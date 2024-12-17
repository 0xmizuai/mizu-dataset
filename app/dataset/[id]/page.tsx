"use client";
import Breadcrumb from "@/components/Breadcrumb";
import DatasetCard from "@/components/DatasetCard";
import { mockData } from "@/components/DatasetList";
import SimpleData from "@/components/query/SimpleData";
import { sendGet } from "@/utils/networkUtils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "theme-ui";
import { Box, Flex, Input, Image } from "theme-ui";

const DatasetPage = () => {
  const { id } = useParams();
  const [dataset, setDataset] = useState<any>(null);
  console.log("id", id);

  useEffect(() => {
    const fetchDataset = async () => {
      const response: any = await sendGet(`/api/dataset/${id}`, {});
      // setDataset(response?.data);
      setDataset(mockData[0]);
    };
    fetchDataset();
  }, [id]);
  return (
    <Flex
      sx={{
        flexDirection: "column",
        backgroundColor: "white",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <Flex
        sx={{
          width: "1280px",
          flexDirection: "column",
          alignItems: "flex-start",
          mx: "auto",
        }}
      >
        <Breadcrumb />
        <DatasetCard
          item={dataset}
          showLink={false}
          showBorder={false}
          totalSize={32}
          width="30%"
        />
        {/* Sample Data */}
        <SimpleData />

        <Box sx={{ mb: 4, width: "100%" }}>
          <Input
            placeholder="Enter your query"
            sx={{
              width: "100%",
              mb: 2,
              height: "59px",
              borderRadius: "14px",
              background: "#EEF2F5",
            }}
          />
          <Button sx={{ width: "100px" }}>
            Submit
            <Image src="/images/dataset/arrow.svg" alt="arrow" />
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};

export default DatasetPage;
