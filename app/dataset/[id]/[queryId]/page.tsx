"use client";
import Breadcrumb from "@/components/Breadcrumb";
import CustomCard from "@/components/CustomCard";
import Header from "@/components/Header";
import CollectedTable from "@/components/query/ColletedTable";
import { sendGet } from "@/utils/networkUtils";
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
              textAlign: "left",
              fontSize: 18,
              fontWeight: "medium",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Text sx={{ fontSize: 18, fontWeight: "bold", mr: 2 }}>Query:</Text>
            <Text sx={{ fontSize: 18, fontWeight: "medium", color: "text" }}>
              {query?.query_text}
            </Text>
          </Box>
          <Box
            sx={{
              textAlign: "left",
              fontSize: 18,
              fontWeight: "medium",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Text sx={{ fontSize: 18, fontWeight: "bold", mr: 2 }}>Model:</Text>
            <Text sx={{ fontSize: 18, fontWeight: "medium", color: "text" }}>
              {query?.model}
            </Text>
          </Box>
          <Box
            sx={{
              textAlign: "left",
              fontSize: 18,
              fontWeight: "medium",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Text sx={{ fontSize: 18, fontWeight: "bold", mr: 2 }}>
              Expend:
            </Text>
            <Text sx={{ fontSize: 18, fontWeight: "medium", color: "text" }}>
              {`${query?.points_spent} points`}
            </Text>
          </Box>
          <Box
            sx={{
              textAlign: "left",
              fontSize: 18,
              fontWeight: "medium",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Text sx={{ fontSize: 18, fontWeight: "bold", mr: 2 }}>Date:</Text>
            <Text sx={{ fontSize: 18, fontWeight: "medium", color: "text" }}>
              {query?.created_at}
            </Text>
          </Box>
          <Box
            sx={{
              textAlign: "left",
              display: "flex",
              flexDirection: "row",
              fontSize: 18,
              fontWeight: "medium",
              color: "black",
              mb: 2,
            }}
          >
            <Text sx={{ fontSize: 18, fontWeight: "bold", mr: 2 }}>
              Dataset:
            </Text>
            <Text
              sx={{ fontSize: 18, fontWeight: "medium", mx: 2, color: "text" }}
            >
              {query?.dataset?.name}
            </Text>
            {/* <Box
              sx={{
                border: "1px solid #333333",
                borderRadius: "20px",
                px: 2,
                py: 1,
                fontSize: 18,
                fontWeight: "medium",
                mr: 2,
                color: "text",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <Image
                src={`/images/dataset/text.png`}
                alt={query?.dataset?.data_type}
                width={20}
                height={20}
                sx={{ mr: 2 }}
              />
              {query?.dataset?.data_type}
            </Box> */}
            {/* <Text sx={{ fontSize: 18, fontWeight: "medium", color: "text" }}>
              {query?.dataset?.created_at}
            </Text> */}
          </Box>
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
