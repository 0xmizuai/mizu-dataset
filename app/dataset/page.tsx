"use client";
import DatasetComList from "@/components/DatasetList";
import Header from "@/components/Header";
import { useResponsiveValue } from "@theme-ui/match-media";
import { useRef, useState } from "react";
import { Box, Flex, Text, Image, Input } from "theme-ui";

function DatasetList() {
  const datasetListRef = useRef<any>(null);
  const isMobile = useResponsiveValue([true, false, false], {
    defaultIndex: 2,
  });
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value: string) => {
    setSearchValue(value);
    datasetListRef.current?.loadData(value);
  };

  return (
    <Flex
      sx={{
        flexDirection: "column",
        justifyContent: "center",
        mb: 5,
        overflow: "hidden",
      }}
    >
      <Header
        showSearch={true}
        handleSearch={handleSearch}
        searchValue={searchValue}
        isMobile={isMobile}
      />
      {/* {isMobile && (
        <Flex sx={{ width: "100%", mt: 3, mb: ["15px", "32px", "32px"] }}>
          <Input
            value={searchValue}
            onChange={(e: any) => handleSearch?.(e.target.value)}
            placeholder="Search Dataset..."
            sx={{
              mx: 3,
              borderRadius: "20px",
              border: "1px solid #FFFFFF",
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.05)",
            }}
            prefix={
              <Image
                src="/images/icons/search.png"
                width="24px"
                height="24px"
                alt="search"
                sx={{ display: "inline-block" }}
              />
            }
          />
        </Flex>
      )} */}
      <Flex
        sx={{
          flexDirection: "column",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Flex
          sx={{
            mx: [3, 0, 0],
            borderRadius: ["20px", "0", "0"],
            height: ["115px", "260px", "260px"],
            position: "relative",
            color: "white",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, #3C81BF 0%, #1C44B3 31%, #1A42B4 63%, #1B43B4 100%)",
            ...(!isMobile && {
              width: "100%",
            }),
          }}
        >
          <Flex
            sx={{
              width: ["100%", "1280px", "1280px"],
              justifyContent: "space-between",
              alignItems: "flex-start",
              mx: [3, 5, 5],
              position: "relative",
            }}
          >
            <Box
              sx={{
                width: ["50%", "45%", "45%", "50%", "50%"],
                mt: [0, 2, 3],
                pt: [0, 2, 3],
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Text
                sx={{
                  fontSize: ["16px", "28px", "36px"],
                  fontWeight: "bold",
                  mb: [0, 3, 3],
                }}
              >
                Empower your AI Applications with MIZU Data
              </Text>
              <Text
                sx={{
                  fontSize: ["8px", "15px", "15px"],
                }}
              >
                Open, Ultra-low Cost, Hyperscale
              </Text>
            </Box>
            <Image
              src="/images/dataset/logo.png"
              alt="logo"
              sx={{
                maxWidth: ["216px", "367px", "497px", "497px", "497px"],
                height: "auto",
                borderBottomRightRadius: ["20px", "20px", "0"],
                position: "absolute",
                right: 0,
                bottom: 0,
                transform: "translate(20%, 18%)",
              }}
            />
          </Flex>
        </Flex>
        <DatasetComList isMobile={isMobile} ref={datasetListRef} />
      </Flex>
    </Flex>
  );
}

export default DatasetList;
