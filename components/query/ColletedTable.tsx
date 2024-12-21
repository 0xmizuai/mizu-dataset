"use client";

import { Pagination, Table } from "antd";
import { useEffect, useState } from "react";
import { Box } from "theme-ui";
import { sendGet } from "@/utils/networkUtils";
import { HistoryItem } from "@/types/dataset";
import { Flex, Text } from "theme-ui";
import { getColor } from "./SampleAndHistory";
import { max } from "lodash";

interface CollectedTableProps {
  id: string;
  queryId: string;
  datasetId: string;
  isMobile: boolean;
}

export default function CollectedTable({ id, isMobile }: CollectedTableProps) {
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
    <Box
      sx={{
        width: "100%",
        maxWidth: "1280px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pb: 4,
        ...(isMobile && {
          borderRadius: "20px",
          backgroundColor: "white",
          p: 3,
        }),
      }}
    >
      <Text
        sx={{
          color: "#0A043C",
          fontSize: [16, 24, 24],
          fontWeight: "semibold",
          alignSelf: "flex-start",
        }}
      >
        Data collected
      </Text>
      <Box sx={{ mt: 3, width: "100%" }}>
        <Table
          rowKey="id"
          columns={HistoryColumns}
          dataSource={collectedList}
          pagination={false}
          scroll={{ x: isMobile ? 300 : 1000 }}
          style={{ width: "100%" }}
          loading={loading}
          size={isMobile ? "small" : "middle"}
          className="antd-collected-table"
        />
        <Flex
          sx={{
            justifyContent: "center",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            mt: 4,
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
          {isMobile && (
            <Text sx={{ color: "#333333", mt: 1, fontSize: [10, 16, 16] }}>
              {`Total: ${totalPages}`}
            </Text>
          )}
        </Flex>
      </Box>
    </Box>
  );
}
