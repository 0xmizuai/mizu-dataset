"use client ";
import { Box, Flex, Text, Image, Heading, Grid, Card } from "theme-ui";
import { useEffect, useState } from "react";
import { Pagination } from "antd";
import { sendGet } from "@/utils/networkUtils";

const pageSize = 8;

function DatasetList() {
  const [datasetList, setDatasetList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
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
                  <Card
                    key={index}
                    sx={{
                      p: 3,
                      bg: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                  >
                    <Image
                      src={`${"/images/dataset/btc.png"}`}
                      width="50px"
                      height="50px"
                    />
                    <Text
                      sx={{
                        color: "#333333",
                        fontSize: 20,
                        fontWeight: "bold",
                        mt: 3,
                      }}
                    >
                      {item.name}
                    </Text>
                    <Flex
                      sx={{
                        justifyContent: "space-between",
                        my: 3,
                      }}
                    >
                      <Flex sx={{ flexDirection: "column" }}>
                        <Text
                          sx={{
                            color: "rgba(0, 0, 0, 0.5)",
                            fontSize: 14,
                          }}
                        >
                          Size:
                        </Text>
                        <Text
                          sx={{
                            color: "#333333",
                            fontSize: 24,
                            fontWeight: "bold",
                          }}
                        >
                          {`${item.total_objects ?? 0}T`}
                        </Text>
                      </Flex>
                      <Flex sx={{ flexDirection: "column" }}>
                        <Text
                          sx={{
                            color: "rgba(0, 0, 0, 0.5)",
                            fontSize: 14,
                          }}
                        >
                          Num:
                        </Text>
                        <Text
                          sx={{
                            color: "#333333",
                            fontSize: 24,
                            fontWeight: "bold",
                          }}
                        >
                          {`${item.total_bytes ?? 0}K`}
                        </Text>
                      </Flex>
                    </Flex>
                    <Flex sx={{ justifyContent: "space-between", my: 3 }}>
                      <Flex>
                        <Image
                          src="/images/icons/calender.png"
                          width="19px"
                          height="19px"
                          mr={2}
                        />
                        <Text
                          sx={{
                            color: "#333333",
                            fontSize: 16,
                            fontWeight: "medium",
                          }}
                        >
                          {item.created_at}
                        </Text>
                      </Flex>
                      <Image
                        src="/images/icons/link.png"
                        width="24px"
                        height="24px"
                      />
                    </Flex>
                  </Card>
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
