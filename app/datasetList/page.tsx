"use client";
import DatasetCardList from "@/components/DatasetCard";
import Header from "@/components/Header";
import { useResponsiveValue } from "@theme-ui/match-media";
import { Box, Flex, Text, Heading, Image } from "theme-ui";

function DatasetList() {
  const isMobile = useResponsiveValue([true, false, false]);

  return (
    <Flex
      sx={{
        flexDirection: "column",
        alignItems: "center",
        bg: "#F7FAFC",
      }}
    >
      <Header />
      <Flex
        sx={{
          width: ["100%", "100%"],
          height: ["200px", "261px"],
          position: "relative",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 3,
          background: !isMobile
            ? "linear-gradient(135deg, #3C81BF 0%, #1C44B3 31%, #1A42B4 63%, #1B43B4 100%)"
            : "none",
        }}
      >
        <Box
          sx={{
            width: "1280px",
            mx: "auto",
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1, width: "50%", mt: 4 }}>
            <Heading
              as="h1"
              sx={{
                fontSize: 36,
                fontWeight: "bold",
                mb: 3,
                fontFamily: "Inter",
              }}
            >
              Empower your AI Applications with MIZU Data
            </Heading>
            <Text
              sx={{
                fontFamily: "Inter",
              }}
            >
              Open, Ultra-low Cost, Hyperscale
            </Text>
          </Box>
          <Image
            src="/images/dataset/logo.png"
            sx={{
              width: "497px",
              height: "auto",
              position: "absolute",
              bottom: 0,
              right: 180,
            }}
          />
        </Box>
      </Flex>
      <DatasetCardList />
    </Flex>
  );
}

export default DatasetList;
