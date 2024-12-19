"use client";

import { Text, Input, Flex } from "theme-ui";
import { Popover, Table, Tabs } from "antd";
import { useEffect, useState } from "react";
import { Box } from "theme-ui";
import { sendGet } from "@/utils/networkUtils";
import { SampleDataProps, SampleDataItem, HistoryItem } from "@/types/dataset";
import {
  downloadAndParseJSON,
  R2_DOWNLOAD_URL,
  StatusEnum,
} from "@/utils/simpleData";
import Link from "next/link";

enum Tab {
  HISTORY = "history",
  SAMPLE = "sample",
}

const mockHistoryList = [
  {
    seq: 1,
    id: "1",
    query: "What is the capital of France?",
    date: "2024-01-01",
    expend: "100",
    status: StatusEnum.SUCCESS,
  },
];

export default function SampleAndHistory({
  id,
  name,
  data_type,
  language,
}: SampleDataProps) {
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [sampleList, setSampleList] = useState<SampleDataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>(Tab["HISTORY"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [totalPages, setTotalPages] = useState(0);
  const [cache, setCache] = useState<Record<string, any>>(() => {
    if (typeof window !== "undefined") {
      const savedCache = localStorage.getItem("sampleDataCache");
      return savedCache ? JSON.parse(savedCache) : {};
    }
    return {};
  });

  useEffect(() => {
    if (tab === Tab.HISTORY) {
      setHistoryList(mockHistoryList);
    }
  }, [tab]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sampleDataCache", JSON.stringify(cache));
    }
  }, [cache]);

  useEffect(() => {
    (async () => {
      if (tab === Tab.HISTORY) return;
      if (!name || !data_type || !language) return;

      const cacheKey = `${id}-${name}-${data_type}-${language}`;

      if (cache[cacheKey]) {
        setSampleList(cache[cacheKey]);
        return;
      }

      setLoading(true);
      try {
        const res = await sendGet(`/api/sampleData`, { id });
        const data = res?.data ?? [];
        const keys = data.map(
          (item: any) =>
            `${R2_DOWNLOAD_URL}/${name}/${data_type}/${language}/${item.md5}.zz`
        );

        const jsonDataArray = await Promise.all(
          keys.map(async (key: any) => {
            try {
              const jsonData = await downloadAndParseJSON(key);
              if (jsonData) {
                return jsonData.map((dataItem: any, index: number) => ({
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
        const newSampleList = processedData.map((item, index) => ({
          ...item,
          seq: index + 1,
        }));
        if (processedData.length > 0) {
          setCache((prev) => ({ ...prev, [cacheKey]: newSampleList }));
        }

        setSampleList(newSampleList);
      } catch (err) {
        console.error("Error fetching sample data:", err);
        setSampleList([]);
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
      render: (text: string) => {
        return <Link href={`/dataset/${id}/queryId`}>{text}</Link>;
      },
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

  const SampleColumns = [
    {
      title: "Seq",
      dataIndex: "seq",
      key: "seq",
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Text",
      dataIndex: "short_text",
      key: "short_text",
      width: "40%",
      render: (text: string, record: SampleDataItem) => {
        return (
          <Popover
            content={() => (
              <Box
                sx={{ maxHeight: "500px", maxWidth: "500px", overflow: "auto" }}
              >
                <Text>{record.text}</Text>
              </Box>
            )}
            trigger={["hover", "click"]}
          >
            <Text
              style={{
                display: "block",
                textOverflow: "ellipsis",
                cursor: "pointer",
              }}
            >
              {text}
            </Text>
          </Popover>
        );
      },
    },
    {
      title: "URI",
      dataIndex: "uri",
      key: "uri",
      render: (uri: string) => {
        return (
          <Link
            href={uri}
            target="_blank"
            style={{
              display: "block",
              textOverflow: "ellipsis",
              whiteSpace: "wrap",
              wordBreak: "break-all",
            }}
          >
            {uri}
          </Link>
        );
      },
    },
  ];

  const renderHistory = () => {
    return (
      <Table
        rowKey="id"
        columns={HistoryColumns}
        dataSource={historyList}
        pagination={false}
        scroll={{ x: 1000 }}
        bordered
        style={{ width: "100%" }}
      />
    );
  };

  const renderSample = () => {
    return (
      <Table
        rowKey="id"
        columns={SampleColumns}
        dataSource={sampleList}
        pagination={false}
        bordered
        style={{ width: "100%" }}
      />
    );
  };

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
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
        activeKey={tab}
        items={[
          {
            label: "Query history",
            key: Tab.HISTORY,
            children: renderHistory(),
          },
          {
            label: "Sample data",
            key: Tab.SAMPLE,
            children: renderSample(),
          },
        ]}
        onChange={(key) => setTab(key as Tab)}
        // tabBarStyle={{
        //   margin: 0,
        //   borderColor: "rgba(0, 0, 0, 0.2)",
        //   width: "99%",
        // }}
        // tabBarGutter={0}
      />
      {/* <Card
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
      > */}
      {/* <Box sx={{ mt: 3 }}>
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
      </Box> */}
      {/* </Card> */}
    </Box>
  );
}
