"use client";

import { Pagination, Table } from "antd";
import { useEffect, useState } from "react";
import { Box } from "theme-ui";
import { sendGet } from "@/utils/networkUtils";
import { HistoryItem } from "@/types/dataset";
import { Flex, Text } from "theme-ui";
import { getColor } from "./SampleAndHistory";

interface CollectedTableProps {
  id: string;
  queryId: string;
  datasetId: string;
}

export default function CollectedTable({ id }: CollectedTableProps) {
  const [collectedList, setCollectedList] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [totalPages, setTotalPages] = useState(0);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await sendGet(`/api/queryList`, {
        id,
        currentPage,
        pageSize,
      });
      console.log("~ 🚀 ~ res:", res);
      const newCollectedList = res?.data?.list ?? [];
      setCollectedList(newCollectedList);
      setTotalPages(res?.data?.total);
      setCurrentPage(res?.data?.currentPage);
      setPageSize(res?.data?.pageSize);
    } catch (err) {
      console.error("Error fetching sample data:", err);
      setCollectedList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, currentPage, pageSize]);

  const HistoryColumns = [
    {
      title: "Query Content",
      dataIndex: "query_text",
      key: "query_text",
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
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: number) => {
        const { backgroundColor, textColor }: any = getColor(status);
        return <Text>{status}</Text>;
        // <Flex
        //   sx={{
        //     backgroundColor,
        //     borderRadius: "20px",
        //     width: "108px",
        //     alignItems: "center",
        //     justifyContent: "center",
        //   }}
        // >
        //   <Text sx={{ color: textColor, fontSize: 16 }}>{status}</Text>
        // </Flex>
      },
    },
  ];

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <Text sx={{ color: "#0A043C", fontSize: 24, fontWeight: "semibold" }}>
        Data collected
      </Text>
      <Box sx={{ mt: 3 }}>
        <Table
          rowKey="id"
          columns={HistoryColumns}
          dataSource={collectedList}
          pagination={false}
          scroll={{ x: 1000 }}
          bordered
          style={{ width: "100%" }}
          loading={loading}
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
