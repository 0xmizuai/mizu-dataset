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
}

function Header({ showSearch = false }: HeaderProps) {
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
      }}
    >
      <Flex
        sx={{
          py: 3,
          justifyContent: "space-between",
          width: 1280,
        }}
      >
        <Image
          src="/images/login/logo-text.png"
          sx={{ maxWidth: "114px" }}
          alt="logo"
        />
        <Flex sx={{ alignItems: "center" }}>
          {showSearch && (
            <Input
              placeholder="Search Dataset..."
              sx={{
                maxWidth: ["100%", "300px"],
                ml: [0, 3],
                flex: 1,
              }}
              prefix={
                <Image
                  src="/images/icons/search.png"
                  width="24px"
                  height="24px"
                  alt="search"
                />
              }
            />
          )}
          <Box sx={{ ml: 3 }}>
            <Dropdown menu={{ items, onClick }}>
              <Image
                src="/images/icons/avatar.png"
                sx={{ width: "24px", height: "24px", cursor: "pointer" }}
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
