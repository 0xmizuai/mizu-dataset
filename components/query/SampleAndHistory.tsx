"use client";

import { Card, Text, Input, Flex } from "theme-ui";
import { Pagination, Table, Tabs } from "antd";
import { useEffect, useState } from "react";
import { Box } from "theme-ui";
import { sendGet } from "@/utils/networkUtils";
import { inflate } from "pako";

interface SampleDataProps {
  id: string;
  name: string;
  data_type: string;
  language: string;
}

interface SampleDataItem {
  key: string;
  text: string;
  uri: string;
}

interface HistoryItem {
  key: string;
  query: string;
  date: string;
  expend: string;
  status: string;
}

enum Tab {
  HISTORY = "history",
  SAMPLE = "sample",
}

const SampleColumns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Text",
    dataIndex: "text",
    key: "text",
  },
  {
    title: "URI",
    dataIndex: "uri",
    key: "uri",
  },
];

enum StatusEnum {
  SUCCESS = "Success",
  FAILED = "Failed",
  PROCESSING = "Processing",
  PENDING = "Pending",
}

type TableItem = HistoryItem | SampleDataItem;

const R2_DOWNLOAD_URL = "https://rawdata.mizu.global";

async function downloadAndParseJSON(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const base64EncodedData = await response.text();
    const decodedBuffer = Buffer.from(base64EncodedData, "base64");

    try {
      const decompressedData = inflate(decodedBuffer);
      const textDecoder = new TextDecoder("utf-8", { fatal: false });
      const lines = textDecoder
        .decode(decompressedData)
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      return lines.map((line) => JSON.parse(line));
    } catch (parseErr) {
      console.error("Parse error details:", url, parseErr);
      return [];
    }
  } catch (error: any) {
    console.error("downloadAndParseJSON error:", url, error);
    return [];
  }
}

export default function SampleAndHistory({
  id,
  name,
  data_type,
  language,
}: SampleDataProps) {
  const [list, setList] = useState<HistoryItem[] | SampleDataItem[]>(
    [] as HistoryItem[]
  );
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(Tab.HISTORY);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [totalPages, setTotalPages] = useState(0);
  const [cache, setCache] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const savedCache = localStorage.getItem('sampleDataCache');
      return savedCache ? JSON.parse(savedCache) : {};
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sampleDataCache', JSON.stringify(cache));
    }
  }, [cache]);

  useEffect(() => {
    (async () => {
      if (!name || !data_type || !language) return;

      const cacheKey = `${id}-${name}-${data_type}-${language}`;

      if (cache[cacheKey]) {
        setList(cache[cacheKey]);
        return;
      }

      setLoading(true);
      try {
        const res = await sendGet(`/api/sampleData`, { id });
        const data = res?.data ?? [];
        const keys = data.map((item: any) => `${R2_DOWNLOAD_URL}/${name}/${data_type}/${language}/${item.md5}.zz`);

        const jsonDataArray = await Promise.all(
          keys.map(async (key: any) => {
            try {
              const jsonData = await downloadAndParseJSON(key);
              if (jsonData) {
                return jsonData.map((dataItem: any, index: number) => ({
                  key: dataItem.id,
                  id: dataItem.id,
                  text: dataItem.text,
                  short_text:
                    dataItem.text.length > 50
                      ? dataItem.text.slice(0, 50) + "..."
                      : dataItem.text,
                  uri: dataItem.uri,
                }));
              }
              return null;
            } catch (err) {
              console.error("Error parsing item:", err);
              return null;
            }
          })
        );

        const processedData = jsonDataArray.filter(Boolean).flat();
        setCache((prev) => ({ ...prev, [cacheKey]: processedData }));
        setList(processedData);
      } catch (err) {
        console.error("Error fetching sample data:", err);
        setList([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [data_type, id, language, name, tab, cache]);

  const getColor = (status: StatusEnum) => {
    if (status === StatusEnum.SUCCESS)
      return { backgroundColor: "#B9F3AD", textColor: "#2F7C20" };
    if (status === StatusEnum.PROCESSING)
      return { backgroundColor: "#F9F3CB", textColor: "#B58D0B" };
    if (status === StatusEnum.PENDING)
      return { backgroundColor: "#E3F1FF", textColor: "#2979F2" };
    if (status === StatusEnum.FAILED)
      return { backgroundColor: "#F3E58C", textColor: "#7C6D1A" };
    return { backgroundColor: "#F3E58C", textColor: "#7C6D1A" };
  };

  const HistoryColumns = [
    {
      title: "Seq",
      dataIndex: "seq",
      key: "seq",
    },
    {
      title: "Query Content",
      dataIndex: "query",
      key: "query",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Expend",
      dataIndex: "expend",
      key: "expend",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const { backgroundColor, textColor }: any = getColor(
          status as StatusEnum
        );
        return (
          <Flex
            sx={{
              backgroundColor,
              borderRadius: "20px",
              width: "108px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text sx={{ color: textColor, fontSize: 16 }}>{status}</Text>
          </Flex>
        );
      },
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 4, width: "100%" }}>
        <Input
          placeholder="Enter your query"
          sx={{
            width: "100%",
            mb: 2,
            height: "59px",
            borderRadius: "14px",
            borderColor: "rgba(0, 0, 0, 0.2)",
            background: "#EEF2F5",
          }}
        />
      </Box>
      <Tabs
        type="card"
        items={[
          { label: "Query history", key: Tab.HISTORY },
          { label: "Sample data", key: Tab.SAMPLE },
        ]}
        onChange={(key) => setTab(key as Tab)}
        tabBarStyle={{
          margin: 0,
          borderColor: "rgba(0, 0, 0, 0.2)",
          width: "99%",
        }}
        tabBarGutter={0}
      />
      <Card
        sx={{
          mb: 4,
          border: "1px solid rgba(0, 0, 0, 0.2)",
          borderTop: "none",
          width: "100%",
          borderRadius: "14px",
          borderTopLeftRadius: "0",
          maxHeight: "770px",
          overflow: "auto",
          p: 3,
          pt: 0,
        }}
      >
        <Box sx={{ mt: 3 }}>
          <Table
            key="id"
            columns={tab === Tab.HISTORY ? HistoryColumns : SampleColumns}
            dataSource={list as readonly TableItem[]}
            pagination={false}
            scroll={{ x: 1000 }}
          />
          <Flex
            sx={{
              justifyContent: "flex-end",
              mt: 4,
              position: "sticky",
              bottom: 0,
            }}
          >
            <Pagination
              showTotal={(total) => (
                <Text sx={{ color: "#333333", fontSize: 16 }}>
                  {`Total: ${total}`}
                </Text>
              )}
              current={currentPage}
              total={totalPages}
              onChange={(page) => setCurrentPage(page)}
              pageSizeOptions={[7, 14, 21]}
              pageSize={pageSize}
              showSizeChanger
              showQuickJumper
              onShowSizeChange={(current, size) => {
                setCurrentPage(current);
                setPageSize(size);
              }}
            />
          </Flex>
        </Box>
      </Card>
    </Box>
  );
}
