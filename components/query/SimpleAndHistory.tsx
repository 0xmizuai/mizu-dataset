"use client";

import { Card, Text, Input, Flex } from "theme-ui";
import { Pagination, Table, Tabs } from "antd";
import { useEffect, useState } from "react";
import { Box } from "theme-ui";
import { sendGet } from "@/utils/networkUtils";

interface SimpleDataProps {
  id: string;
}

interface SimpleDataItem {
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
  SIMPLE = "simple",
}

const SimpleColumns = [
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

const mockList = [
  {
    seq: 1,
    key: "#3546651",
    query: "text",
    date: "2024-01-01",
    expend: "uri",
    status: StatusEnum.SUCCESS,
  },
  {
    seq: 2,
    key: "#3546652",
    query: "text",
    date: "2024-01-01",
    expend: "uri",
    status: StatusEnum.PROCESSING,
  },
  {
    seq: 3,
    key: "#3546653",
    query: "text",
    date: "2024-01-01",
    expend: "uri",
    status: StatusEnum.PENDING,
  },
  {
    seq: 4,
    key: "#3546654",
    query: "text",
    date: "2024-01-01",
    expend: "uri",
    status: StatusEnum.FAILED,
  },
  {
    seq: 5,
    key: "#3546655",
    query: "text",
    date: "2024-01-01",
    expend: "uri",
    status: StatusEnum.SUCCESS,
  },
  {
    seq: 6,
    key: "#3546656",
    query: "text",
    date: "2024-01-01",
    expend: "uri",
    status: StatusEnum.SUCCESS,
  },
];

export default function SimpleAndHistory({ id }: SimpleDataProps) {
  const [list, setList] = useState<SimpleDataItem[] | HistoryItem[]>(
    mockList.slice(0, 7)
  );
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(Tab.HISTORY);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [totalPages, setTotalPages] = useState(mockList.length);

  // useEffect(() => {
  //   (async () => {
  //     const res = await sendGet(`/api/simpleData`, { id });
  //     const data = res?.data ?? [];
  //     const newList = data.map((item: any, index: number) => {
  //       return {
  //         ...item,
  //         seq: index + 1,
  //       };
  //     });
  //     setList(newList);
  //   })();
  // }, [id]);

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
          { label: "Simple data", key: Tab.SIMPLE },
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
            columns={tab === Tab.HISTORY ? HistoryColumns : SimpleColumns}
            dataSource={list}
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
