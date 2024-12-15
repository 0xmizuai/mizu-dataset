"use client ";
import { Box, Flex, Text, Image, Heading, Grid, Card, s } from "theme-ui";
import { useState } from "react";
import { Pagination } from "antd";

const data = Array.from({ length: 18 }).map((_, index) => ({
  id: index,
  name: `CC-MAIN-2024-46-${index}`,
  size: "128T",
  num: "128K",
  date: "11/24/2024",
  language: null,
}));

const itemsPerPage = 8;

function DatasetList() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box sx={{ width: 1280, mt: 3 }}>
      <Heading
        as="h2"
        sx={{ mb: 3, color: "text", fontSize: 24, fontWeight: "bold" }}
      >
        Dataset list
      </Heading>

      <Grid columns={[1, 2, 3, 4]} gap={4}>
        {currentData.map((item, index) => (
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
              src={`${item.language ?? "/images/dataset/btc.png"}`}
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
                  {`${item.size}T`}
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
                  {`${item.num}K`}
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
                  {item.date}
                </Text>
              </Flex>
              <Image src="/images/icons/link.png" width="24px" height="24px" />
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
    </Box>
  );
}

export default DatasetList;
