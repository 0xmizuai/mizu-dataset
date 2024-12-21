"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flex, Text } from "theme-ui";

export default function Breadcrumb({ isMobile }: { isMobile: boolean }) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <Flex sx={{ gap: 2, mb: ["15px", "20px", "20px"] }}>
      {pathSegments.map((segment, index) => {
        let segmentLabel =
          segment === "dataset" ? "Home" : decodeURIComponent(segment);
        const href = "/" + pathSegments.slice(0, index + 1).join("/");

        if (index === 1) {
          segmentLabel = "Dataset";
        }
        if (index === 2) {
          segmentLabel = "Query";
        }

        return (
          <Flex key={href} sx={{ alignItems: "center", gap: 2, my: 3 }}>
            {index !== 0 && <Text sx={{ color: "text" }}>{">"}</Text>}
            <Link
              href={href}
              style={{
                textDecoration: "none",
                color: index === pathSegments.length - 1 ? "#000" : "#3b82f6",
              }}
            >
              <Text
                sx={{
                  fontSize: "14px",
                  fontWeight:
                    index === pathSegments.length - 1 ? "bold" : "normal",
                }}
              >
                {segmentLabel}
              </Text>
            </Link>
          </Flex>
        );
      })}
    </Flex>
  );
}
