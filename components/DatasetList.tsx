"use client";
import { Flex, Text, Heading, Grid } from "theme-ui";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Pagination } from "antd";
import { sendGet } from "@/utils/networkUtils";
import DatasetCard from "./DatasetCard";
import { Spinner } from "theme-ui";

const pageSize = 8;
function DatasetList({}, ref: any) {
  const [datasetList, setDatasetList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(8);

  const loadData = useCallback(
    async (searchValue?: string) => {
      setIsLoading(true);
      const params: any = {
        currentPage,
        pageSize,
      };
      if (searchValue) {
        params.name = searchValue;
      }
      const res: any = await sendGet("/api/dataset", params);
      if (res?.code === 0) {
        setDatasetList(res.data.list);
        setTotalPages(res.data.total);
      }
      setIsLoading(false);
    },
    [currentPage, pageSize]
  );

  useEffect(() => {
    loadData();
  }, [currentPage, pageSize]);

  useImperativeHandle(ref, () => ({
    loadData,
  }));

  return (
    <Flex
      sx={{
        maxWidth: "1280px",
        width: "100%",
        flexDirection: "column",
        mt: 3,
      }}
    >
      <Heading
        as="h2"
        sx={{
          mb: 3,
          color: "text",
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "left",
        }}
      >
        Dataset list
      </Heading>
      {isLoading ? (
        <Flex
          sx={{ justifyContent: "center", alignItems: "center", height: 268 }}
        >
          <Spinner size={30} color="primary" />
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
                  showTotal={(total) => (
                    <Text sx={{ color: "#333333", fontSize: 16 }}>
                      {`Total: ${total}`}
                    </Text>
                  )}
                  current={currentPage}
                  total={totalPages}
                  onChange={(page) => setCurrentPage(page)}
                  pageSizeOptions={[8, 16, 32]}
                  pageSize={pageSize}
                  showSizeChanger
                  showQuickJumper
                  onShowSizeChange={(current, size) => {
                    setCurrentPage(current);
                    setPageSize(size);
                  }}
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
    </Flex>
  );
}

export default forwardRef(DatasetList);
