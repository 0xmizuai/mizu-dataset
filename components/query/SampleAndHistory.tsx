"use client";

import { Input, Modal, Pagination, Popover, Table, Tabs } from "antd";
import { useEffect, useState } from "react";
import { Box } from "theme-ui";
import { sendGet, sendPost } from "@/utils/networkUtils";
import { SampleDataProps, SampleDataItem, HistoryItem } from "@/types/dataset";
import {
  downloadAndParseJSON,
  R2_DOWNLOAD_URL,
  StatusText,
} from "@/utils/simpleData";
import Link from "next/link";
import { Button, Image, Text, Flex } from "theme-ui";
import toast from "react-hot-toast";
import { ApiResponse } from "@/types/api";

enum Tab {
  HISTORY = "history",
  SAMPLE = "sample",
}

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
  const [visible, setVisible] = useState(false);
  const [queryText, setQueryText] = useState("");

  const [cache, setCache] = useState<Record<string, any>>(() => {
    if (typeof window !== "undefined") {
      const savedCache = localStorage.getItem("sampleDataCache");
      return savedCache ? JSON.parse(savedCache) : {};
    }
    return {};
  });

  const loadHistory = async () => {
    setLoading(true);
    const res = await sendGet(`/api/queryList`, {
      id,
      currentPage,
      pageSize,
    });
    const data = res?.data ?? [];
    setHistoryList(data.list);
    setTotalPages(data.total);
    setCurrentPage(data.currentPage);
    setPageSize(data.pageSize);
    setLoading(false);
  };

  useEffect(() => {
    if (tab !== Tab.HISTORY || !id || !currentPage || !pageSize) return;
    loadHistory();
  }, [tab, currentPage, pageSize]);

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

  const getColor = (status: number) => {
    switch (status) {
      case 2: // finished
        return { backgroundColor: "#B9F3AD", textColor: "#2F7C20" };
      case 1: // processing
        return { backgroundColor: "#F9F3CB", textColor: "#B58D0B" };
      case 0: // pending
        return { backgroundColor: "#E3F1FF", textColor: "#2979F2" };
      case 3: // error
        return { backgroundColor: "#F3E58C", textColor: "#7C6D1A" };
      default:
        return { backgroundColor: "#F3E58C", textColor: "#7C6D1A" };
    }
  };

  const HistoryColumns = [
    {
      title: "Query Content",
      dataIndex: "query_text",
      key: "query_text",
      render: (text: string, record: HistoryItem) => {
        return <Link href={`/dataset/${id}/${record.id}`}>{text}</Link>;
      },
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Expend",
      dataIndex: "points_spent",
      key: "points_spent",
      render: (points_spent: string) => {
        return <Text>{`${points_spent} points`}</Text>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: number) => {
        const { backgroundColor, textColor }: any = getColor(status);
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
            <Text sx={{ color: textColor, fontSize: 16 }}>
              {StatusText[status]}
            </Text>
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
        loading={loading}
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
        loading={loading}
      />
    );
  };
  const handleNewQuery = async () => {
    const res = (await sendPost(`/api/dataset/${id}/query`, {
      datasetId: id,
      query_text: queryText,
      model: "gpt-4o",
    })) as ApiResponse<any>;
    if (res.code === 0) {
      setVisible(false);
      loadHistory();
      return toast.success("New query created");
    }
    return toast.error("Failed to create new query");
  };

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <Button
        sx={{
          mb: 4,
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
        }}
        onClick={() => setVisible(true)}
      >
        New Query
        <Image
          src="/images/icons/create.png"
          alt="plus"
          width={18}
          height={18.5}
          sx={{ ml: 2 }}
        />
      </Button>

      <Tabs
        type="card"
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
      />
      {tab === Tab.HISTORY && (
        <Box sx={{ mt: 3 }}>
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
              onChange={(page) => {
                setCurrentPage(page);
              }}
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
      )}
      <Modal
        open={visible}
        title="New Query"
        onCancel={() => setVisible(false)}
        onOk={handleNewQuery}
      >
        <Input.TextArea
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          placeholder="Please enter your query"
          rows={4}
          style={{ marginBottom: 16 }}
          autoSize={{ minRows: 4, maxRows: 10 }}
        />
      </Modal>
    </Box>
  );
}
