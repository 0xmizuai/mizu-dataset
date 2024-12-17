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
  console.log("pathname", pathname);
  return (
    <Flex sx={{ flexDirection: "column", alignItems: "center", bg: "#F7FAFC" }}>
      <Header showSearch={pathname === "/dataset"} />
      {children}
    </Flex>
  );
}
