"use client";

import { Card, Flex, Image, Text } from "theme-ui";
import { useRouter } from "next/navigation";
import { formatBytes, formatObjects } from "@/utils/format";
import Link from "next/link";
interface DatasetCardProps {
  item: any;
  showLink?: boolean;
  showBorder?: boolean;
  totalSize?: number;
  width?: string;
  isMobile?: boolean;
}

export default function DatasetCard({
  item,
  showLink = true,
  showBorder = true,
  totalSize = 24,
  width = "100%",
  isMobile = false,
}: DatasetCardProps) {
  const router = useRouter();
  return (
    <Card
      sx={{
        width: width,
        p: showBorder ? [2, 3, 3] : 0,
        bg: "white",
        border: showBorder ? "1px solid #E5E7EB" : "none",
        borderRadius: "20px",
        boxShadow: showBorder ? "0px 4px 10px 0px rgba(0, 0, 0, 0.05)" : "none",
      }}
    >
      <Flex sx={{ alignItems: "center", mb: ["15px", "20px", "20px"] }}>
        <Link
          href={
            item?.source_link ??
            "https://commoncrawl.org/blog/november-2024-crawl-archive-now-available"
          }
        >
          <Image
            src={`${"/images/dataset/common.png"}`}
            alt="dataset"
            width={isMobile ? "48px" : "76px"}
            height="auto"
            sx={{
              mr: [2, 3, 3],
            }}
          />
        </Link>
        <Flex
          sx={{
            alignItems: "center",
            border: "1px solid #E5E7EB",
            borderRadius: "20px",
            px: [1, 2, 2],
            flexDirection: "row",
            height: "20px",
            mr: [1, 3, 3],
          }}
        >
          <Image
            src="/images/dataset/text.png"
            alt="common"
            width="16px"
            height="auto"
            mr={isMobile ? 1 : 2}
          />
          <Text sx={{ fontSize: isMobile ? 10 : 14 }}>
            {item?.data_type ?? "text"}
          </Text>
        </Flex>
        <Flex
          sx={{
            alignItems: "center",
            border: "1px solid #E5E7EB",
            borderRadius: "20px",
            px: [1, 2, 2],
            ml: isMobile ? 1 : 2,
            height: "20px",
          }}
        >
          <Image
            src="/images/dataset/language.png"
            alt="common"
            width="14px"
            height="auto"
            mr={isMobile ? 1 : 2}
          />
          <Text sx={{ fontSize: isMobile ? 10 : 14 }}>
            {item?.language ?? "eng"}
          </Text>
        </Flex>
      </Flex>
      <Text
        sx={{
          color: "#333333",
          fontSize: "20px",
          fontWeight: "bold",
          mb: ["15px", "20px", "20px"],
        }}
      >
        {item?.name ?? "Dataset"}
      </Text>
      <Flex
        sx={{
          justifyContent: "space-between",
          mb: ["15px", "20px", "20px"],
        }}
      >
        <Flex sx={{ flexDirection: "column" }}>
          <Text
            sx={{
              color: "rgba(0, 0, 0, 0.5)",
              fontSize: [10, 14, 14],
            }}
          >
            Data Size
          </Text>
          <Text
            sx={{
              color: "#333333",
              fontSize: isMobile ? 14 : totalSize,
              fontWeight: "bold",
            }}
          >
            {`${formatObjects(item?.total_objects ?? 0)}`}
          </Text>
        </Flex>
        <Flex sx={{ flexDirection: "column" }}>
          <Text
            sx={{
              color: "rgba(0, 0, 0, 0.5)",
              fontSize: [10, 14, 14],
            }}
          >
            Total Objects
          </Text>
          <Text
            sx={{
              color: "#333333",
              fontSize: isMobile ? 14 : totalSize,
              fontWeight: "bold",
            }}
          >
            {`${formatBytes(item?.total_bytes ?? 0)}`}
          </Text>
        </Flex>
      </Flex>
      <Flex
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          mb: ["15px", "20px", "20px"],
        }}
      >
        <Flex>
          <Image
            src="/images/icons/calender.png"
            alt="calender"
            width={["16px", "19px", "19px"]}
            height="auto"
            mr={isMobile ? 1 : 2}
          />
          <Text
            sx={{
              color: "black",
              fontSize: ["14px", "16px", "16px"],
              fontWeight: "medium",
            }}
          >
            {item?.crawled_at}
          </Text>
        </Flex>
        {showLink && (
          <Image
            src="/images/icons/link.png"
            alt="link"
            width={isMobile ? "20px" : "24px"}
            height="auto"
            onClick={() => {
              router.push(`/dataset/${item?.id}`);
            }}
            sx={{ cursor: "pointer" }}
          />
        )}
      </Flex>
    </Card>
  );
}
