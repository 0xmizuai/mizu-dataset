"use client";
import Breadcrumb from "@/components/Breadcrumb";
import DatasetCard from "@/components/DatasetCard";
import Header from "@/components/Header";
import SimpleAndHistory from "@/components/query/SimpleAndHistory";
import { sendGet } from "@/utils/networkUtils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Flex } from "theme-ui";

const DatasetPage = () => {
  const { id } = useParams();
  const [dataset, setDataset] = useState<any>(null);
  console.log("id", id);

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
        justifyContent: "center",
        width: "100%",
        mb: 5,
      }}
    >
      <Header />
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
          {id && <SimpleAndHistory id={id as string} />}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default DatasetPage;
