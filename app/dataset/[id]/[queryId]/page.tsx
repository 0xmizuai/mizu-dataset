"use client";
import Breadcrumb from "@/components/Breadcrumb";
import CustomCard from "@/components/CustomCard";
import Header from "@/components/Header";
import CollectedTable from "@/components/query/ColletedTable";
import { sendGet } from "@/utils/networkUtils";
import { Color } from "antd/es/color-picker";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Flex, Grid, Image, Text } from "theme-ui";

const QueryDetailPage = () => {
  const { id, queryId } = useParams();
  const [query, setQuery] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const fetchDataset = async () => {
      const response: any = await sendGet(`/api/dataset/${id}/${queryId}`);
      setQuery(response?.data);
    };
    fetchDataset();
  }, [id, queryId]);

  console.log("~ 🚀 ~ QueryDetailPage ~ query:", query);

  return (
    <Flex
      sx={{
        flexDirection: "column",
        backgroundColor: "white",
      }}
    >
      <Header />
      <Flex
        sx={{
          flexDirection: "column",
          backgroundColor: "white",
          alignItems: "center",
          minHeight: "100vh",
          mx: 5,
        }}
      >
        <Flex
          sx={{
            maxWidth: "1280px",
            width: "100%",
            flexDirection: "column",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Breadcrumb />
        </Flex>
        <Flex
          sx={{
            justifyContent: "flex-start",
            width: "100%",
            maxWidth: "1280px",
            mb: 2,
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Text sx={{ fontSize: 14, color: "rgba(0, 0, 0, 0.5)" }}>
              Query:
            </Text>
            <Text sx={{ fontSize: 20, fontWeight: "bold", color: "#333333" }}>
              {query?.query_text}
            </Text>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Flex
              sx={{
                flexDirection: "column",
                alignItems: "flex-start",
                width: 200,
              }}
            >
              <Text sx={{ fontSize: 14, color: "rgba(0, 0, 0, 0.5)" }}>
                Model:
              </Text>
              <Text sx={{ fontSize: 20, fontWeight: "bold", color: "#333333" }}>
                {query?.model}
              </Text>
            </Flex>
            <Flex
              sx={{
                flexDirection: "column",
                alignItems: "flex-start",
                width: 200,
              }}
            >
              <Text sx={{ fontSize: 14, color: "rgba(0, 0, 0, 0.5)" }}>
                Expend:
              </Text>
              <Text sx={{ fontSize: 20, fontWeight: "bold", color: "#333333" }}>
                {`${query?.points_spent ?? 0} points`}
              </Text>
            </Flex>
            <Flex
              sx={{
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Text sx={{ fontSize: 14, color: "rgba(0, 0, 0, 0.5)" }}>
                Dataset:
              </Text>
              <Flex sx={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  sx={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#333333",
                    mr: 2,
                  }}
                >
                  {query?.dataset?.name}
                </Text>
                <Image
                  src="/images/dataset/common.png"
                  alt="arrow-right"
                  width={76}
                  height={"auto"}
                  sx={{ ml: 2 }}
                />
              </Flex>
            </Flex>
          </Box>
          <Flex
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              mb: 4,
            }}
          >
            <Text sx={{ fontSize: 14, color: "rgba(0, 0, 0, 0.5)" }}>
              Date:
            </Text>
            <Flex sx={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                src="/images/icons/calender.png"
                alt="calendar"
                width={20}
                height={20}
                sx={{ mr: 2 }}
              />
              <Text sx={{ fontSize: 20, fontWeight: "bold", color: "#333333" }}>
                {query?.created_at}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Grid
          sx={{
            width: "100%",
            maxWidth: "1280px",
            justifyContent: "space-between",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 2,
            mb: 5,
          }}
        >
          <CustomCard height="200px">
            <Text sx={{ fontSize: 64, fontWeight: "bold", color: "#2979F2" }}>
              125 K
            </Text>
            <Text sx={{ fontSize: 20, fontWeight: "medium", color: "text" }}>
              Total data processed
            </Text>
          </CustomCard>
          <CustomCard height="200px">
            <Text sx={{ fontSize: 64, fontWeight: "bold", color: "#2979F2" }}>
              35 K
            </Text>
            <Text sx={{ fontSize: 20, fontWeight: "medium", color: "text" }}>
              Total data processed
            </Text>
          </CustomCard>
          <CustomCard height="200px">
            <Text sx={{ fontSize: 64, fontWeight: "bold", color: "#2979F2" }}>
              25 K
            </Text>
            <Text sx={{ fontSize: 20, fontWeight: "medium", color: "text" }}>
              Documents
            </Text>
          </CustomCard>
        </Grid>
        <Flex
          sx={{
            width: "100%",
            maxWidth: "1280px",
          }}
        >
          <CollectedTable
            id={id as string}
            queryId={queryId as string}
            datasetId={id as string}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default QueryDetailPage;
