"use client";
import DatasetComList from "@/components/DatasetList";
import Header from "@/components/Header";
import { useResponsiveValue } from "@theme-ui/match-media";
import { useRef, useState } from "react";
import { Box, Flex, Text, Heading, Image } from "theme-ui";

function DatasetList() {
  const datasetListRef = useRef<any>(null);
  const isMobile = useResponsiveValue([true, false, false], {
    defaultIndex: 2,
  });
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value: string) => {
    console.log("value", value);
    setSearchValue(value);
    datasetListRef.current?.loadData(value);
  };

  return (
    <Flex
      sx={{
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        mb: 5,
      }}
    >
      <Header
        showSearch={true}
        handleSearch={handleSearch}
        searchValue={searchValue}
      />
      <Flex
        sx={{ flexDirection: "column", width: "100%", alignItems: "center" }}
      >
        <Flex
          sx={{
            width: "100%",
            height: ["200px", "260px"],
            position: "relative",
            color: "white",
            alignItems: "center",
            justifyContent: "center",
            background: !isMobile
              ? "linear-gradient(135deg, #3C81BF 0%, #1C44B3 31%, #1A42B4 63%, #1B43B4 100%)"
              : "none",
          }}
        >
          <Flex
            sx={{
              width: "1280px",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mx: 5,
            }}
          >
            <Box sx={{ width: "50%", mt: 4, pt: 4 }}>
              <Heading
                as="h1"
                sx={{
                  fontSize: 36,
                  fontWeight: "bold",
                  mb: 3,
                }}
              >
                Empower your AI Applications with MIZU Data
              </Heading>
              <Text
                sx={{
                  fontSize: 15,
                }}
              >
                Open, Ultra-low Cost, Hyperscale
              </Text>
            </Box>
            <Image
              src="/images/dataset/logo.png"
              alt="logo"
              sx={{
                maxWidth: "497px",
                height: "auto",
                mt: 4,
                mr: -8,
              }}
            />
          </Flex>
        </Flex>
        <DatasetComList ref={datasetListRef} />
      </Flex>
    </Flex>
  );
}

export default DatasetList;
