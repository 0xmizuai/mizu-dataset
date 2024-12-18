"use client";

import { Card, Flex, Image, Text } from "theme-ui";
import { useRouter } from "next/navigation";
import { formatBytes, formatObjects } from "@/utils/format";
import { Box } from "theme-ui";
import Link from "next/link";
interface DatasetCardProps {
  item: any;
  showLink?: boolean;
  showBorder?: boolean;
  totalSize?: number;
  width?: string;
}

export default function DatasetCard({
  item,
  showLink = true,
  showBorder = true,
  totalSize = 24,
  width = "100%",
}: DatasetCardProps) {
  const router = useRouter();
  return (
    <Card
      sx={{
        width: width,
        p: showBorder ? 3 : 0,
        bg: "white",
        border: showBorder ? "1px solid #E5E7EB" : "none",
        borderRadius: "20px",
      }}
    >
      <Flex sx={{ flexDirection: "row", alignItems: "center", mb: 3 }}>
        <Link
          href={
            item?.source_link ??
            "https://commoncrawl.org/blog/november-2024-crawl-archive-now-available"
          }
        >
          <Image
            src={`${"/images/dataset/common.png"}`}
            alt="dataset"
            width="76px"
            height="auto"
            sx={{
              mr: 3,
            }}
          />
        </Link>
        <Flex
          sx={{
            alignItems: "center",
            border: "1px solid #E5E7EB",
            borderRadius: "20px",
            px: 2,
            width: "",
            flexDirection: "row",
            height: "20px",
            mr: 3,
          }}
        >
          <Image
            src="/images/dataset/text.png"
            alt="common"
            width="10px"
            height="auto"
            mr={2}
          />
          <Text>{item?.data_type ?? "text"}</Text>
        </Flex>
        <Flex
          sx={{
            alignItems: "center",
            border: "1px solid #E5E7EB",
            borderRadius: "20px",
            px: 2,
            ml: 2,
            height: "20px",
          }}
        >
          <Image
            src="/images/dataset/language.png"
            alt="common"
            width="10px"
            height="auto"
            mr={2}
          />
          <Text>{item?.language ?? "eng"}</Text>
        </Flex>
      </Flex>
      <Text
        sx={{
          color: "#333333",
          fontSize: 20,
          fontWeight: "bold",
          mt: 3,
        }}
      >
        {item?.name ?? "Dataset"}
      </Text>
      <Flex
        sx={{
          justifyContent: "space-between",
          my: 3,
        }}
      >
        <Flex sx={{ flexDirection: "column" }}>
          <Text
            sx={{
              color: "rgba(0, 0, 0, 0.5)",
              fontSize: 14,
            }}
          >
            Data Size
          </Text>
          <Text
            sx={{
              color: "#333333",
              fontSize: totalSize,
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
              fontSize: 14,
            }}
          >
            Total Objects
          </Text>
          <Text
            sx={{
              color: "#333333",
              fontSize: totalSize,
              fontWeight: "bold",
            }}
          >
            {`${formatBytes(item?.total_bytes ?? 0)}`}
          </Text>
        </Flex>
      </Flex>
      <Flex sx={{ justifyContent: "space-between", my: 3 }}>
        <Flex>
          <Image
            src="/images/icons/calender.png"
            alt="calender"
            width="19px"
            height="19px"
            mr={2}
          />
          <Text
            sx={{
              color: "black",
              fontSize: 16,
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
            width="24px"
            height="24px"
            onClick={() => {
              console.log("click");
              router.push(`/dataset/${item?.id}`);
            }}
            sx={{ cursor: "pointer" }}
          />
        )}
      </Flex>
    </Card>
  );
}
