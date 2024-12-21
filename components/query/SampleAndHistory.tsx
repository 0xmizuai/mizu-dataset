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
import { ColumnType } from "antd/es/table";
import { SorterResult } from "antd/es/table/interface";

enum Tab {
  HISTORY = "history",
  SAMPLE = "sample",
}

export const getColor = (status: number) => {
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

export default function SampleAndHistory({
  id,
  name,
  data_type,
  language,
  isMobile,
}: SampleDataProps) {
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [sampleList, setSampleList] = useState<SampleDataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>(Tab["HISTORY"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [visible, setVisible] = useState(false);
  const [queryText, setQueryText] = useState("");
  const [total, setTotal] = useState(0);
  const [cache, setCache] = useState<Record<string, any>>(() => {
    if (typeof window !== "undefined") {
      const savedCache = localStorage.getItem("sampleDataCache");
      return savedCache ? JSON.parse(savedCache) : {};
    }
    return {};
  });

  const loadHistory = async (orderBy = "created_at", order = "desc") => {
    setLoading(true);
    const res = await sendGet(`/api/queryList`, {
      id,
      currentPage,
      pageSize,
      orderBy,
      order,
    });
    const data = res?.data ?? [];
    setHistoryList(data.list);
    setCurrentPage(data.currentPage);
    setPageSize(data.pageSize);
    setLoading(false);
    setTotal(data.total);
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

  const HistoryColumns = [
    {
      title: "Query Content",
      dataIndex: "query_text",
      key: "query_text",
      width: "40%",
      render: (text: string, record: HistoryItem) => {
        return (
          <Link
            style={{ color: "#2979F2" }}
            href={`/dataset/${id}/${record.id}`}
          >
            <Text
              sx={{
                fontSize: ["10px", "16px", "16px"],
                wordBreak: "break-all",
                whiteSpace: "wrap",
              }}
            >
              {text}
            </Text>
          </Link>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      defaultSortOrder: "descend",
      sorter: (a: HistoryItem, b: HistoryItem) =>
        a.created_at.localeCompare(b.created_at),
      render: (text: string) => {
        return <Text sx={{ fontSize: ["10px", "16px", "16px"] }}>{text}</Text>;
      },
    },
    {
      title: "Expend",
      dataIndex: "points_spent",
      key: "points_spent",
      defaultSortOrder: "descend",
      sorter: (a: HistoryItem, b: HistoryItem) =>
        parseInt(a.points_spent) - parseInt(b.points_spent),
      render: (points_spent: string) => {
        return (
          <Text sx={{ fontSize: ["10px", "16px", "16px"] }}>
            {`${points_spent} points`}
          </Text>
        );
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
              width: isMobile ? "80px" : "108px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text sx={{ color: textColor, fontSize: ["10px", "16px", "16px"] }}>
              {StatusText[status]}
            </Text>
          </Flex>
        );
      },
    },
  ];

  const SampleColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "30%",
      render: (text: string) => {
        return (
          <Text
            sx={{
              fontSize: ["10px", "16px", "16px"],
              whiteSpace: "wrap",
              wordBreak: "break-all",
            }}
          >
            {text}
          </Text>
        );
      },
    },
    {
      title: "Text",
      dataIndex: "short_text",
      key: "short_text",
      width: "30%",
      render: (text: string, record: SampleDataItem) => {
        return (
          <Popover
            content={() => (
              <Box
                sx={{
                  maxHeight: isMobile ? "200px" : "500px",
                  maxWidth: isMobile ? "200px" : "500px",
                  overflow: "auto",
                }}
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
                fontSize: ["10px", "16px", "16px"],
                whiteSpace: "wrap",
                wordBreak: "break-all",
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
              color: "#2979F2",
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
        columns={HistoryColumns as ColumnType<HistoryItem>[]}
        dataSource={historyList}
        pagination={false}
        scroll={{ x: isMobile ? 100 : 1000 }}
        style={{ width: "100%" }}
        size={isMobile ? "small" : "middle"}
        loading={loading}
        onChange={(
          pagination,
          filters,
          sorter: SorterResult<HistoryItem> | SorterResult<HistoryItem>[]
        ) => {
          setCurrentPage(pagination.current ?? 1);
          setPageSize(pagination.pageSize ?? 7);
          const order = Array.isArray(sorter)
            ? sorter[0].order === "ascend"
              ? "asc"
              : "desc"
            : (sorter as SorterResult<HistoryItem>).order === "ascend"
            ? "asc"
            : "desc";
          const orderBy = Array.isArray(sorter)
            ? (sorter[0] as SorterResult<HistoryItem>).field
            : (sorter as SorterResult<HistoryItem>).field;
          loadHistory(orderBy as string, order);
        }}
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
        style={{ width: "100%" }}
        loading={loading}
        size={isMobile ? "small" : "middle"}
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
    <Box
      sx={{
        maxWidth: "1280px",
        width: "100%",
      }}
    >
      <Box sx={{ mb: 3, mx: [3, 0, 0] }}>
        <Button
          sx={{
            mb: ["15px", "20px", "20px"],
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#2979F2",
            ...(isMobile && {
              width: "100%",
            }),
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
      </Box>

      <Box
        sx={{
          boxShadow: isMobile ? "0px 0px 10px 0px rgba(0, 0, 0, 0.1)" : "none",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          borderBottomLeftRadius: isMobile ? "0px" : "20px",
          borderBottomRightRadius: isMobile ? "0px" : "20px",
          backgroundColor: "white",
          pb: "20px",
          ...(!isMobile && {
            border: "1px solid rgba(0, 0, 0, 0.2)",
            pb: 4,
            pt: 0,
          }),
        }}
      >
        <Flex
          sx={{
            justifyContent: "space-between",
            mb: [3, 4, 4],
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
          }}
        >
          <Button
            sx={{
              width: "50%",
              backgroundColor: tab === Tab.HISTORY ? "white" : "#EFEFEF",
              color: tab === Tab.HISTORY ? "#0A043C" : "rgba(10, 4, 60, 0.5)",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: tab === Tab.HISTORY ? "20px" : "0px",
              borderBottomLeftRadius: "0px",
              borderBottomRightRadius: tab === Tab.HISTORY ? "0px" : "20px",
              border: "none",
              height: "45px",
            }}
            onClick={() => setTab(Tab.HISTORY)}
          >
            <Text>Query history</Text>
          </Button>
          <Button
            sx={{
              width: "50%",
              backgroundColor: tab === Tab.SAMPLE ? "white" : "#F7FAFC",
              color: tab === Tab.SAMPLE ? "#0A043C" : "rgba(10, 4, 60, 0.5)",
              borderTopLeftRadius: tab === Tab.SAMPLE ? "20px" : "0px",
              borderTopRightRadius: "20px",
              borderBottomLeftRadius: tab === Tab.SAMPLE ? "0px" : "20px",
              borderBottomRightRadius: tab === Tab.SAMPLE ? "20px" : "0px",
              border: "none",
              height: "45px",
            }}
            onClick={() => setTab(Tab.SAMPLE)}
          >
            <Text>Sample data</Text>
          </Button>
        </Flex>
        {tab === Tab.HISTORY && (
          <Box sx={{ mx: [2, 4, 4] }}>
            {renderHistory()}
            <Box sx={{ mt: 3 }}>
              <Flex
                sx={{
                  justifyContent: isMobile ? "center" : "flex-end",
                  mt: 4,
                  position: "sticky",
                  bottom: 0,
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: "center",
                }}
              >
                <Pagination
                  showTotal={(total) =>
                    !isMobile ? (
                      <Text sx={{ color: "#333333", fontSize: 16 }}>
                        {`Total: ${total}`}
                      </Text>
                    ) : null
                  }
                  current={currentPage}
                  total={total}
                  onChange={(page) => {
                    setCurrentPage(page);
                  }}
                  pageSizeOptions={[7, 14, 21]}
                  pageSize={pageSize}
                  showSizeChanger
                  onShowSizeChange={(current, size) => {
                    setCurrentPage(current);
                    setPageSize(size);
                  }}
                />
                {isMobile && (
                  <Text
                    sx={{
                      color: "#333333",
                      mt: 2,
                      fontSize: ["10px", "16px", "16px"],
                    }}
                  >
                    {`Total: ${total}`}
                  </Text>
                )}
              </Flex>
            </Box>
          </Box>
        )}
        {tab === Tab.SAMPLE && (
          <Box sx={{ mx: [2, 4, 4] }}>{renderSample()}</Box>
        )}
      </Box>
      <Modal
        open={visible}
        closable={false}
        title={
          <Box sx={{ textAlign: "center", fontSize: "16px" }}>
            <Text sx={{ alignSelf: "center", fontSize: "16px" }}>
              New Query
            </Text>
          </Box>
        }
        onCancel={() => setVisible(false)}
        onOk={handleNewQuery}
        footer={[
          <Flex sx={{ justifyContent: "center", gap: 2 }}>
            <Button
              sx={{
                borderRadius: "10px",
                backgroundColor: "#EFEFEF",
                color: "text",
                width: "160px",
              }}
              key="cancel"
              onClick={() => setVisible(false)}
            >
              Cancel
            </Button>
            <Button
              sx={{
                borderRadius: "10px",
                backgroundColor: "#2979F2",
                color: "white",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: "160px",
              }}
              key="submit"
              onClick={handleNewQuery}
            >
              Submit
              <Image
                src="/images/icons/create.png"
                alt="plus"
                width={18}
                height={18.5}
                sx={{ ml: 2 }}
              />
            </Button>
          </Flex>,
        ]}
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
