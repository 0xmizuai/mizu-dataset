"use client";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import { Flex } from "theme-ui";

export default function DatasetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <Flex
      sx={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        mb: 5,
      }}
    >
      <Header showSearch={pathname === "/dataset"} />
      {children}
    </Flex>
  );
}
