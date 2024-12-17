"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flex, Text } from "theme-ui";

export default function Breadcrumb() {
  const pathname = usePathname(); // 获取当前路径
  const pathSegments = pathname.split("/").filter(Boolean); // 分割路径并过滤空值

  return (
    <Flex sx={{ gap: 2, mb: 3 }}>
      {pathSegments.map((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 1).join("/");

        console.log("href", href);
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
                  fontSize: 2,
                  fontWeight:
                    index === pathSegments.length - 1 ? "bold" : "normal",
                }}
              >
                {decodeURIComponent(segment)}
              </Text>
            </Link>
          </Flex>
        );
      })}
    </Flex>
  );
}
