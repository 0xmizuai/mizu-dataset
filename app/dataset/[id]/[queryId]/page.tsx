"use client";
import Breadcrumb from "@/components/Breadcrumb";
import CustomCard from "@/components/CustomCard";
import Header from "@/components/Header";
import CollectedTable from "@/components/query/ColletedTable";
import { sendGet } from "@/utils/networkUtils";
import { useResponsiveValue } from "@theme-ui/match-media";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Flex, Grid, Image, Text } from "theme-ui";

const QueryDetailPage = () => {
  const { id, queryId } = useParams();
  const [query, setQuery] = useState<any>(null);
  const isMobile = useResponsiveValue([true, false, false], {
    defaultIndex: 2,
  });

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
        backgroundColor: isMobile ? "#F7FAFC" : "white",
        overflowX: "hidden",
        minHeight: "100vh",
      }}
    >
      <Header isMobile={isMobile} />
      <Flex
        sx={{
          flexDirection: "column",
          alignItems: "center",
          mx: ["15px", "20px", "20px"],
        }}
      >
        <Flex
          sx={{
            maxWidth: "1280px",
            width: "100%",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Breadcrumb isMobile={isMobile} />
        </Flex>
        <Flex
          sx={{
            justifyContent: "flex-start",
            width: "100%",
            maxWidth: "1280px",
            mb: ["15px", "20px", "20px"],
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              mb: ["15px", "20px", "20px"],
            }}
          >
            <Text
              sx={{
                fontSize: "14px",
                color: "rgba(0, 0, 0, 0.5)",
              }}
            >
              Query:
            </Text>
            <Text
              sx={{
                fontSize: ["18px", "20px", "20px"],
                fontWeight: "bold",
                color: "#333333",
              }}
            >
              {query?.dataset?.language === "en"
                ? "BAAI/bge-small-en"
                : "Xenova/multilingual-e5-small"}
            </Text>
          </Box>
          <Grid
            sx={{
              display: "grid",
              gridTemplateColumns: [
                "repeat(2, 1fr)",
                "repeat(4, 1fr)",
                "repeat(4, 1fr)",
              ],
              gap: 2,
              width: "100%",
              mb: ["15px", "20px", "20px"],
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
          </Grid>
          <Flex
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              mb: ["15px", "20px", "20px"],
            }}
          >
            <Text sx={{ fontSize: 14, color: "rgba(0, 0, 0, 0.5)" }}>
              Date:
            </Text>
            <Flex sx={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                src="/images/icons/calender.png"
                alt="calendar"
                width={isMobile ? 16 : 20}
                height={"auto"}
                sx={{ mr: 2 }}
              />
              <Text
                sx={{
                  fontSize: ["14px", "20px", "20px"],
                  fontWeight: "bold",
                  color: "#333333",
                }}
              >
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
            mb: ["15px", "20px", "20px"],
          }}
        >
          <CustomCard isMobile={isMobile} height={isMobile ? "65px" : "200px"}>
            <Text
              sx={{
                fontSize: ["20px", "64px", "64px"],
                fontWeight: "bold",
                color: "#2979F2",
              }}
            >
              125 K
            </Text>
            <Text
              sx={{
                fontSize: ["10px", "20px", "20px"],
                fontWeight: "medium",
                color: "text",
                textAlign: "center",
              }}
            >
              Total data processed
            </Text>
          </CustomCard>
          <CustomCard isMobile={isMobile} height={isMobile ? "65px" : "200px"}>
            <Text
              sx={{
                fontSize: ["20px", "64px", "64px"],
                fontWeight: "bold",
                color: "#2979F2",
              }}
            >
              35 K
            </Text>
            <Text
              sx={{
                fontSize: ["10px", "20px", "20px"],
                fontWeight: "medium",
                color: "text",
                textAlign: "center",
              }}
            >
              Total data processed
            </Text>
          </CustomCard>
          <CustomCard isMobile={isMobile} height={isMobile ? "65px" : "200px"}>
            <Text
              sx={{
                fontSize: ["20px", "64px", "64px"],
                fontWeight: "bold",
                color: "#2979F2",
              }}
            >
              25 K
            </Text>
            <Text
              sx={{
                fontSize: ["10px", "20px", "20px"],
                fontWeight: "medium",
                color: "text",
                textAlign: "center",
              }}
            >
              Documents
            </Text>
          </CustomCard>
        </Grid>
      </Flex>
      <Flex
        sx={{
          flexDirection: "column",
          alignItems: "center",
          mx: ["0", "20px", "20px"],
        }}
      >
        <CollectedTable
          id={id as string}
          queryId={queryId as string}
          datasetId={id as string}
          isMobile={isMobile}
        />
      </Flex>
    </Flex>
  );
};

export default QueryDetailPage;
