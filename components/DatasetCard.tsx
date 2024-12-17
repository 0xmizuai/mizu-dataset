"use client";

import { Card, Flex, Image, Text } from "theme-ui";
import { useRouter } from "next/navigation";

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
        borderRadius: "8px",
      }}
    >
      <Image
        src={`${"/images/dataset/btc.png"}`}
        alt="dataset"
        width="50px"
        height="50px"
      />
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
            Size:
          </Text>
          <Text
            sx={{
              color: "#333333",
              fontSize: totalSize,
              fontWeight: "bold",
            }}
          >
            {`${item?.total_objects ?? 0}T`}
          </Text>
        </Flex>
        <Flex sx={{ flexDirection: "column" }}>
          <Text
            sx={{
              color: "rgba(0, 0, 0, 0.5)",
              fontSize: 14,
            }}
          >
            Num:
          </Text>
          <Text
            sx={{
              color: "#333333",
              fontSize: totalSize,
              fontWeight: "bold",
            }}
          >
            {`${item?.total_bytes ?? 0}K`}
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
            {item?.created_at}
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
