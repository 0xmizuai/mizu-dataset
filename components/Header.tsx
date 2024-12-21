/** @jsxImportSource theme-ui */
import { Box, Flex, Image, Text } from "theme-ui";
import { Dropdown, Input, MenuProps, message } from "antd";
import { deleteJwt } from "@/utils/networkUtils";
import { useRouter } from "next/navigation";
import { useState } from "react";

enum HeaderKey {
  POINTS = "points",
  LOGOUT = "logout",
}

interface HeaderProps {
  showSearch?: boolean;
  handleSearch?: (value: string) => void;
  searchValue?: string;
  isMobile?: boolean;
}

function Header({
  showSearch = false,
  handleSearch,
  searchValue,
  isMobile = false,
}: HeaderProps) {
  const router = useRouter();
  const [key, setKey] = useState<HeaderKey | null>(null);

  const items: MenuProps["items"] = [
    {
      label: (
        <Flex
          sx={{
            alignItems: "center",
            cursor: "pointer",
            color: key === HeaderKey.POINTS ? "#2979F2" : "inherit",
          }}
        >
          <Text sx={{ ml: 2, fontSize: 16, fontWeight: "medium" }}>
            My points:
            <Text sx={{ fontWeight: "bold", color: "#2979F2" }}>2000</Text>
          </Text>
        </Flex>
      ),
      key: HeaderKey.POINTS,
    },
    {
      label: (
        <Flex
          sx={{
            alignItems: "center",
            cursor: "pointer",
            color: key === HeaderKey.LOGOUT ? "#2979F2" : "inherit",
          }}
          onClick={() => {
            deleteJwt();
            router.push("/login");
          }}
        >
          <Image
            src="/images/login/logout.png"
            alt="logout"
            width="20px"
            height="20px"
          />
          <Text sx={{ ml: 2, fontSize: 16, fontWeight: "medium" }}>Logout</Text>
        </Flex>
      ),
      key: HeaderKey.LOGOUT,
    },
  ];

  const onClick: MenuProps["onClick"] = ({ key }) => {
    message.info(`Click on item ${key}`);
    if (key === HeaderKey.LOGOUT) {
      setKey(HeaderKey.LOGOUT);
      deleteJwt();
      router.push("/login");
    }
    if (key === HeaderKey.POINTS) {
      setKey(HeaderKey.POINTS);
    }
  };
  return (
    <Flex
      sx={{
        backgroundColor: "#F7FAFC",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderBottom: "1px solid #eaeaea",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Flex
        sx={{
          py: [2, 3, 3],
          justifyContent: "space-between",
          maxWidth: "1280px",
          width: "100%",
          mx: [3, 5, 5],
        }}
      >
        <Image
          src="/images/login/logo-text.png"
          sx={{ maxWidth: "114px" }}
          alt="logo"
          width={isMobile ? 90 : 114}
          height="auto"
        />
        <Flex sx={{ alignItems: "center" }}>
          {showSearch && !isMobile && (
            <Input
              value={searchValue}
              onChange={(e) => handleSearch?.(e.target.value)}
              placeholder="Search Dataset..."
              sx={{
                maxWidth: ["100%", "300px"],
                ml: [0, 3],
              }}
              prefix={
                <Image
                  src="/images/icons/search.png"
                  width="24px"
                  height="24px"
                  alt="search"
                  sx={{ display: "inline-block" }}
                />
              }
            />
          )}
          <Box sx={{ ml: 3 }}>
            <Dropdown menu={{ items, onClick }}>
              <Image
                src="/images/icons/avatar.png"
                sx={{ width: "24px", height: "auto", cursor: "pointer" }}
                alt="avatar"
              />
            </Dropdown>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Header;
