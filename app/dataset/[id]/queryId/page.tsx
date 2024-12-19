"use client";
import Breadcrumb from "@/components/Breadcrumb";
import CustomCard from "@/components/CustomCard";
import DatasetCard from "@/components/DatasetCard";
import Header from "@/components/Header";
import CollectedTable from "@/components/query/ColletedTable";
import { sendGet } from "@/utils/networkUtils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Flex, Text, Grid } from "theme-ui";

const QeuryDetailPage = () => {
  const { id } = useParams();
  const [dataset, setDataset] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const fetchDataset = async () => {
      const response: any = await sendGet(`/api/dataset/${id}`);
      setDataset(response?.data);
    };
    fetchDataset();
  }, [id]);

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
          <DatasetCard
            item={dataset}
            showLink={false}
            showBorder={false}
            totalSize={32}
            width="40%"
          />
        </Flex>
        <Flex
          sx={{
            justifyContent: "flex-start",
            width: "100%",
            maxWidth: "1280px",
            mb: 2,
          }}
        >
          <Text sx={{ textAlign: "left", fontSize: 18, fontWeight: "medium" }}>
            Processing, please wait...
          </Text>
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
          {id && (
            <CollectedTable
              id={id as string}
              name={dataset?.name}
              data_type={dataset?.data_type}
              language={dataset?.language}
            />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default QeuryDetailPage;
