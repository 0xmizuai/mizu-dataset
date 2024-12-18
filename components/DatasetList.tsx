"use client";
import { Flex, Text, Heading, Grid } from "theme-ui";
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
import { max } from "lodash";

type LanguageEnum = keyof typeof LANGUAGES;

const pageSize = 8;
function DatasetList({}, ref: any) {
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
      console.log("@@@selectedLanguage", selectedLanguage);
      if (selectedLanguage !== "all") {
        params.language = selectedLanguage;
      }
      const res: any = await sendGet("/api/dataset", params);
      if (res?.code === 0) {
        setDatasetList(res.data.list);
        setTotalPages(res.data.total);
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
        mt: 4,
        mx: "auto",
        maxWidth: "1408px",
      }}
    >
      <Flex sx={{ justifyContent: "space-between", mb: 3, mx: 5 }}>
        <Heading
          as="h2"
          sx={{
            color: "text",
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          Dataset list
        </Heading>
        <Flex>
          <Select
            value={selectedLanguage}
            options={languageOptions}
            onChange={(value) => setSelectedLanguage(value as LanguageEnum)}
            style={{ borderRadius: 4, width: 150 }}
          />
          {/* <Select
            value={selectedLanguage}
            options={languageOptions}
            onChange={(value) => setSelectedLanguage(value as LanguageEnum)}
            style={{ marginRight: 16, borderRadius: 4, width: 120 }}
          />
          <Select
            value={selectedLanguage}
            options={languageOptions}
            onChange={(value) => setSelectedLanguage(value)}
            style={{ borderRadius: 4, width: 120 }}
          /> */}
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
              <Grid sx={{ mx: 5 }} columns={[1, 2, 3, 4]} gap={4}>
                {datasetList.map((item, index) => (
                  <DatasetCard item={item} key={index} />
                ))}
              </Grid>
              <Flex sx={{ justifyContent: "flex-end", mt: 4 }}>
                <Pagination
                  showTotal={(total) => (
                    <Text sx={{ color: "#333333", fontSize: 16 }}>
                      {`Total: ${total}`}
                    </Text>
                  )}
                  current={currentPage}
                  total={totalPages}
                  onChange={(page) => setCurrentPage(page)}
                  pageSizeOptions={[8, 16, 32]}
                  pageSize={pageSize}
                  showSizeChanger
                  showQuickJumper
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
              <Text sx={{ color: "#333333", fontSize: 16 }}>No data</Text>
            </Flex>
          )}
        </>
      )}
    </Flex>
  );
}

export default forwardRef(DatasetList);
