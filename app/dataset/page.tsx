"use client";
import DatasetComList from "@/components/DatasetList";
import { useResponsiveValue } from "@theme-ui/match-media";
import { Box, Flex, Text, Heading, Image } from "theme-ui";

function DatasetList() {
  const isMobile = useResponsiveValue([true, false, false]);

  return (
    <Flex sx={{ flexDirection: "column", maxWidth: "1280px", mx: "auto" }}>
      <Flex
        sx={{
          width: "100%",
          height: ["200px", "261px"],
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
            maxWidth: "1280px",
            justifyContent: "space-between",
            alignItems: "center",
            mx: "auto",
          }}
        >
          <Box sx={{ width: "50%", mt: 4 }}>
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
            alt="logo"
            sx={{
              maxWidth: "497px",
              height: "auto",
              mr: -40,
              mb: -19,
            }}
          />
        </Flex>
      </Flex>
      <DatasetComList />
    </Flex>
  );
}

export default DatasetList;
