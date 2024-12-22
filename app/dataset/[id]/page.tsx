"use client";
import Breadcrumb from "@/components/Breadcrumb";
import DatasetCard from "@/components/DatasetCard";
import Header from "@/components/Header";
import SampleAndHistory from "@/components/query/SampleAndHistory";
import { sendGet } from "@/utils/networkUtils";
import { useResponsiveValue } from "@theme-ui/match-media";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Flex } from "theme-ui";

const DatasetPage = () => {
  const { id } = useParams();
  const [dataset, setDataset] = useState<any>(null);
  const isMobile = useResponsiveValue([true, false, false], {
    defaultIndex: 2,
  });

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
        backgroundColor: isMobile ? "#F7FAFC" : "white",
        minHeight: "100vh",
      }}
    >
      <Header isMobile={isMobile} />
      <Flex
        sx={{
          flexDirection: "column",
          backgroundColor: isMobile ? "#F7FAFC" : "white",
          alignItems: "center",
          mx: [3, 5, 5],
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
          <DatasetCard
            item={dataset}
            showLink={false}
            showBorder={false}
            totalSize={isMobile ? 24 : 32}
            width={isMobile ? "100%" : "40%"}
            isMobile={isMobile}
          />
        </Flex>
      </Flex>
      <Flex
        sx={{
          width: "100%",
          justifyContent: "center",
        }}
      >
        {id && (
          <SampleAndHistory
            id={id as string}
            name={dataset?.name}
            data_type={dataset?.data_type}
            language={dataset?.language}
            isMobile={isMobile}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default DatasetPage;
