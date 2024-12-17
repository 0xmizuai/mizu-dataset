"use client";

import { Card, Text } from "theme-ui";
import { Table } from "antd";
import { useState } from "react";
import { Box } from "theme-ui";
import { mockData } from "../DatasetList";

export default function SimpleData() {
  const [data, setData] = useState(mockData);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Updated",
      dataIndex: "updated",
      key: "updated",
    },
  ];
  return (
    <Card
      sx={{
        mb: 4,
        border: "1px solid rgba(0, 0, 0, 0.2)",
        width: "100%",
        borderRadius: "14px",
        height: "409px",
        overflow: "auto",
        p: 3,
      }}
    >
      <Text
        sx={{ fontSize: 24, mb: 3, color: "#2F2F2F", fontWeight: "semibold" }}
      >
        Sample data
      </Text>
      <Box sx={{ mt: 3 }}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ x: 1000 }}
        />
      </Box>
    </Card>
  );
}
