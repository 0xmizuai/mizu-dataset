"use client";
import { Box, Flex, Text, Heading, Grid } from "theme-ui";
import { useEffect, useState } from "react";
import { Pagination } from "antd";
import { sendGet } from "@/utils/networkUtils";
import { useRouter } from "next/navigation";
import DatasetCard from "./DatasetCard";

export const mockData = [
  {
    id: 1,
    name: "CC-MAIN-2024-46",
    total_objects: 100,
    total_bytes: 100000,
    created_at: "2024-01-01",
  },
  {
    id: 2,
    name: "CC-MAIN-2024-46",
    total_objects: 100,
    total_bytes: 100000,
    created_at: "2024-01-01",
  },
  {
    id: 3,
    name: "CC-MAIN-2024-46",
    total_objects: 100,
    total_bytes: 100000,
    created_at: "2024-01-01",
  },
  {
    id: 4,
    name: "CC-MAIN-2024-46",
    total_objects: 100,
    total_bytes: 100000,
    created_at: "2024-01-01",
  },
  {
    id: 5,
    name: "CC-MAIN-2024-46",
    total_objects: 100,
    total_bytes: 100000,
    created_at: "2024-01-01",
  },
  {
    id: 6,
    name: "CC-MAIN-2024-46",
    total_objects: 100,
    total_bytes: 100000,
    created_at: "2024-01-01",
  },
  {
    id: 7,
    name: "CC-MAIN-2024-46",
    total_objects: 100,
    total_bytes: 100000,
    created_at: "2024-01-01",
  },
  {
    id: 8,
    name: "CC-MAIN-2024-46",
    total_objects: 100,
    total_bytes: 100000,
    created_at: "2024-01-01",
  },
];

const pageSize = 8;
function DatasetList() {
  const router = useRouter();
  const [datasetList, setDatasetList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const res: any = await sendGet("/api/dataset", {
        currentPage,
        pageSize,
      });

      if (res?.code === 0) {
        setDatasetList(res.data.list);
        setTotalPages(res.data.total);
        setCurrentPage(res.data.currentPage);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [currentPage]);

  return (
    <Box sx={{ width: 1280, mt: 3 }}>
      <Heading
        as="h2"
        sx={{ mb: 3, color: "text", fontSize: 24, fontWeight: "bold" }}
      >
        Dataset list
      </Heading>
      {isLoading ? (
        <Flex
          sx={{ justifyContent: "center", alignItems: "center", height: 200 }}
        >
          <Text sx={{ color: "#333333", fontSize: 16 }}>Loading...</Text>
        </Flex>
      ) : (
        <>
          {datasetList.length > 0 ? (
            <>
              <Grid columns={[1, 2, 3, 4]} gap={4}>
                {datasetList.map((item, index) => (
                  <DatasetCard item={item} key={index} />
                ))}
              </Grid>
              <Flex sx={{ justifyContent: "flex-end", mt: 4 }}>
                <Pagination
                  current={currentPage}
                  total={totalPages}
                  onChange={(page) => setCurrentPage(page)}
                />
              </Flex>
            </>
          ) : (
            <Flex
              sx={{
                justifyContent: "center",
                alignItems: "center",
                height: 200,
              }}
            >
              <Text sx={{ color: "#333333", fontSize: 16 }}>No data</Text>
            </Flex>
          )}
        </>
      )}
    </Box>
  );
}

export default DatasetList;
