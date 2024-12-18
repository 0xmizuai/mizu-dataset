"use client";
import DatasetLayout from "./dataset/layout";
import DatasetListPage from "./dataset/page";

export default function Home() {
  return (
    <DatasetLayout>
      <DatasetListPage />
    </DatasetLayout>
  );
}
