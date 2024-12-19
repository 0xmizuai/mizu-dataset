"use client";
import Breadcrumb from "@/components/Breadcrumb";
import DatasetCard from "@/components/DatasetCard";
import Header from "@/components/Header";
import SampleAndHistory from "@/components/query/SampleAndHistory";
import { sendGet } from "@/utils/networkUtils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Flex } from "theme-ui";

const DatasetPage = () => {
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
            width: "100%",
            maxWidth: "1280px",
          }}
        >
          {id && (
            <SampleAndHistory
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

export default DatasetPage;
