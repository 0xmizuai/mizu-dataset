"use client";
import { useUserStore } from "@/stores/userStore";
import { apiHost } from "@/utils/constants";
import { saveJwt, sendPost } from "@/utils/networkUtils";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Card,
  Container,
  Input,
  Text,
  Flex,
  Image,
  Heading,
} from "theme-ui";
import { useResponsiveValue } from "@theme-ui/match-media";

export default function LoginPage() {
  const setUser = useUserStore((state) => state.setUser);
  const [isLoginProgress, setIsLoginProgress] = useState(false);
  const router = useRouter();
  const isMobile = useResponsiveValue([true, false, false]);

  const handleGoogleLogin = async (credentialResponse: any) => {
    if (isLoginProgress) return;
    setIsLoginProgress(true);
    try {
      const tokenId = credentialResponse.credential;
      const response: any = await sendPost(
        `${apiHost}/api/google-login`,
        {
          tokenId,
        },
        {
          excludeAuthorization: true,
        }
      );

      if (!!response?.data.token) {
        saveJwt(response.data.token);
        setUser({
          userKey: response.data.userKey || "",
        });
        return router.push("/");
      }
    } finally {
      setIsLoginProgress(false);
    }
    return toast.error("Login failed");
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleLogin,
    onError: () => {
      toast.error("Login failed");
    },
  });

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        bg: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: ["flex-start", "center", "center"],
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          width: !isMobile ? "76%" : "100%",
          mb: [2, 4, 4],
        }}
      >
        <Image
          src="/images/login/logo-text.png"
          sx={{
            maxWidth: ["88px", "108px", "108px"],
            height: "auto",
            mx: [2, 0, 0],
            mt: [4, 0, 0],
          }}
        />
      </Box>
      <Box
        sx={
          isMobile
            ? { width: "100%" }
            : {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "20px",
                mx: [0, 4, 4],
                background: !isMobile
                  ? "linear-gradient(135deg, #3C81BF 0%, #1C44B3 31%, #1A42B4 63%, #1B43B4 100%)"
                  : "none",
              }
        }
      >
        <Flex
          sx={{
            flexDirection: ["column", "row"],
          }}
        >
          {/* 左侧登录卡片 */}
          <Box
            sx={{
              width: ["100%", "50%", "50%"],
              p: [2, 4, 4],
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Card
              sx={{
                p: [2, 4, 4],
                borderRadius: "20px",
                bg: "white",
                width: ["100%", "368px", "500px"],
                height: ["100%", "400px", "588px"],
                mx: "auto",
              }}
            >
              <Flex sx={{ flexDirection: "column", gap: 3 }}>
                <Heading
                  as="h2"
                  sx={{
                    mb: 3,
                    fontSize: 4,
                    textAlign: "center",
                    color: "text",
                    fontWeight: "bold",
                  }}
                >
                  Login
                </Heading>
                <Input
                  placeholder="Enter your email address..."
                  sx={{ borderRadius: "7px" }}
                />
                <Flex>
                  <Input
                    placeholder="Verification Code"
                    sx={{ flex: 1, mr: 2, borderRadius: "7px" }}
                  />
                  <Button
                    sx={{
                      bg: "primary",
                      color: "white",
                      flexShrink: 0,
                      borderRadius: "7px",
                    }}
                  >
                    Send
                  </Button>
                </Flex>
                <Button
                  sx={{
                    bg: "primary",
                    color: "white",
                    borderRadius: "7px",
                    py: 2,
                  }}
                >
                  Log In
                </Button>
                <Text sx={{ textAlign: "center", my: 2, color: "text" }}>
                  OR
                </Text>
                <Button
                  sx={{
                    bg: "white",
                    border: "1px solid #ddd",
                    color: "text",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "7px",
                  }}
                  onClick={() => login()}
                >
                  <Image
                    src="/images/icons/google.png"
                    sx={{ width: "20px", height: "20px", mr: 3 }}
                  />
                  Continue with Google
                </Button>
              </Flex>
            </Card>
          </Box>

          {/* 右侧背景图片和文案 */}
          {!isMobile && (
            <Box
              sx={{
                width: ["100%", "50%"],
                position: "relative",
                color: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pt: 3,
              }}
            ></Box>
          )}
        </Flex>
      </Box>
    </Box>
  );
}
