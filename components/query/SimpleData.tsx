"use client";

import { Card, Text } from "theme-ui";
import { Table } from "antd";
import { useEffect, useState } from "react";
import { Box } from "theme-ui";
import { sendGet } from "@/utils/networkUtils";

interface SimpleDataProps {
  id: string;
}

interface SimpleDataItem {
  id: string;
  text: string;
  uri: string;
}

export default function SimpleData({ id }: SimpleDataProps) {
  const [list, setList] = useState<SimpleDataItem[]>([]);
  const [loading, setLoading] = useState(false);

  console.log("~🚀 🚀 id", id);
  const columns = [
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

  useEffect(() => {
    (async () => {
      const res = await sendGet(`/api/simpleData`, { id });
      const data = res?.data ?? [];
      const newList = data.map((item: any, index: number) => {
        return {
          ...item,
          seq: index + 1,
        };
      });
      setList(newList);
    })();
  }, []);

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
          dataSource={list}
          pagination={false}
          scroll={{ x: 1000 }}
        />
      </Box>
    </Card>
  );
}
