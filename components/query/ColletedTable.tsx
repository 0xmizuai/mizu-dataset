"use client";

import { Input } from "theme-ui";
import { Pagination, Table, Tabs } from "antd";
import { useEffect, useState } from "react";
import { Box } from "theme-ui";
import { sendGet } from "@/utils/networkUtils";
import { SampleDataProps, HistoryItem } from "@/types/dataset";
import { StatusEnum } from "@/utils/simpleData";
import Link from "next/link";
import { Flex, Text } from "theme-ui";

const mockCollectedList = [
  {
    seq: 1,
    id: "1",
    query: "What is the capital of France?",
    date: "2024-01-01",
    expend: "100",
    status: StatusEnum.SUCCESS,
  },
];

export default function CollectedTable({ id }: SampleDataProps) {
  const [collectedList, setCollectedList] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await sendGet(`/api/sampleData`, { id });
        const newCollectedList = res?.data ?? [];
        setCollectedList(mockCollectedList);
      } catch (err) {
        console.error("Error fetching sample data:", err);
        setCollectedList([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status: string) => {
    //     const { backgroundColor, textColor }: any = getColor(
    //       status as StatusEnum
    //     );
    //     return (
    //       <Flex
    //         sx={{
    //           backgroundColor,
    //           borderRadius: "20px",
    //           width: "108px",
    //           alignItems: "center",
    //           justifyContent: "center",
    //         }}
    //       >
    //         <Text sx={{ color: textColor, fontSize: 16 }}>{status}</Text>
    //       </Flex>
    //     );
    //   },
    // },
  ];

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

      <Box sx={{ mt: 3 }}>
        <Table
          rowKey="id"
          columns={HistoryColumns}
          dataSource={collectedList}
          pagination={false}
          scroll={{ x: 1000 }}
          bordered
          style={{ width: "100%" }}
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
    </Box>
  );
}
