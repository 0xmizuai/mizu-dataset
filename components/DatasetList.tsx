"use client";
import { Flex, Text, Grid } from "theme-ui";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Pagination, Select } from "antd";
import { sendGet } from "@/utils/networkUtils";
import DatasetCard from "./DatasetCard";
import { Spinner } from "theme-ui";
import { LANGUAGES } from "@/utils/languages";

type LanguageEnum = keyof typeof LANGUAGES;

function DatasetList({ isMobile }: { isMobile: boolean }, ref: any) {
  const [datasetList, setDatasetList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(8);
  const [languageOptions, setLanguageOptions] = useState<any[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageEnum>("all");

  useEffect(() => {
    const newLanguageOptions = [
      { label: "Language", value: "all" },
      ...Object.keys(LANGUAGES).map((key) => ({
        label: LANGUAGES[key].name,
        value: key,
      })),
    ];
    setLanguageOptions(newLanguageOptions);
  }, []);

  const loadData = useCallback(
    async (searchValue?: string) => {
      setIsLoading(true);
      const params: any = {
        currentPage,
        pageSize,
      };
      if (searchValue) {
        params.name = searchValue;
        params.currentPage = 1;
      }
      if (selectedLanguage !== "all") {
        params.language = selectedLanguage;
      }
      const res: any = await sendGet("/api/dataset", params);
      if (res?.code === 0) {
        setDatasetList(res?.data?.list || []);
        setTotalPages(res?.data?.total || 0);
      }
      setIsLoading(false);
    },
    [currentPage, pageSize, selectedLanguage]
  );

  useEffect(() => {
    loadData();
  }, [currentPage, pageSize, selectedLanguage]);

  useImperativeHandle(ref, () => ({
    loadData,
  }));

  return (
    <Flex
      sx={{
        width: "100%",
        flexDirection: "column",
        mt: ["15px", "32px", "32px"],
        mx: "auto",
        maxWidth: "1408px",
      }}
    >
      <Flex sx={{ justifyContent: "space-between", mb: 3, mx: [3, 5, 5] }}>
        <Text
          sx={{
            color: "#0A043C",
            fontSize: ["20px", "24px", "24px"],
            fontWeight: ["semiBold", "bold", "bold"],
          }}
        >
          Dataset list
        </Text>
        <Flex>
          <Select
            value={selectedLanguage}
            options={languageOptions}
            onChange={(value) => setSelectedLanguage(value as LanguageEnum)}
            style={{ borderRadius: 4, width: 150 }}
          />
        </Flex>
      </Flex>
      {isLoading ? (
        <Flex
          sx={{
            justifyContent: "center",
            alignItems: "center",
            height: 268,
          }}
        >
          <Spinner size={30} color="primary" />
        </Flex>
      ) : (
        <>
          {datasetList.length > 0 ? (
            <>
              <Grid
                sx={{ mx: [3, 5, 5] }}
                columns={[2, 3, 4]}
                gap={["15px", "24px", "24px"]}
              >
                {datasetList.map((item, index) => (
                  <DatasetCard item={item} key={index} isMobile={isMobile} />
                ))}
              </Grid>
              <Flex sx={{ mx: [3, 5, 5], justifyContent: "flex-end", mt: 4 }}>
                <Pagination
                  showTotal={(total) => (
                    <Text
                      sx={{
                        color: "#333333",
                        fontSize: ["10px", "16px", "16px"],
                      }}
                    >
                      {`Total: ${total}`}
                    </Text>
                  )}
                  current={currentPage}
                  total={totalPages}
                  onChange={(page) => setCurrentPage(page)}
                  pageSizeOptions={[8, 16, 32]}
                  pageSize={pageSize}
                  showSizeChanger
                  onShowSizeChange={(current, size) => {
                    setCurrentPage(current);
                    setPageSize(size);
                  }}
                />
              </Flex>
            </>
          ) : (
            <Flex
              sx={{
                justifyContent: "center",
                alignItems: "center",
                height: 200,
              }}
            >
              <Text
                sx={{ color: "#333333", fontSize: ["10px", "16px", "16px"] }}
              >
                No data
              </Text>
            </Flex>
          )}
        </>
      )}
    </Flex>
  );
}

export default forwardRef(DatasetList);
