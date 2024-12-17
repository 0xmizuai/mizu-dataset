"use client";
import { useUserStore } from "@/stores/userStore";
import { saveJwt, sendPost } from "@/utils/networkUtils";
import {
  GoogleLogin,
  useGoogleLogin,
  useGoogleOAuth,
  useGoogleOneTapLogin,
} from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Box, Button, Card, Input, Text, Flex, Image, Heading } from "theme-ui";
import { useResponsiveValue } from "@theme-ui/match-media";
import { validateEmail } from "@/utils/commonUtils";
import { useDebouncedEffect } from "@/hooks/useDebouncedEffect";
import { DEFAULT_LOGIN_REDIRECT } from "@/config/routes";

export default function LoginPage() {
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();
  const isMobile = useResponsiveValue([true, false, false]);
  const [account, setAccount] = useState(""); // 邮箱号
  const [countdown, setCountdown] = useState(0); // 倒计时秒数
  const [code, setCode] = useState<string | null>(null); // 验证码
  const [isLoading, setIsLoading] = useState(false); // 是否正在加载

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  console.log(
    "process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID",
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  );

  const handleGoogleLogin = async (credentialResponse: any) => {
    console.log("credent🌻🌻ialResponse", credentialResponse);
    try {
      const access_token = credentialResponse.access_token;
      console.log("access_token", access_token);
      const response: any = await sendPost(
        `/api/auth/google`,
        {
          access_token,
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
      } else {
        return toast.error("Login failed");
      }
    } catch (error) {
      console.error("Google login error", error);
      return toast.error("Login failed");
    }
  };

  const login = useGoogleLogin({
    scope: "openid email profile",
    onSuccess: async (credentialResponse) => {
      // console.log("🍷🍷credentialResponse", credentialResponse);
      // const response = await fetch("https://oauth2.googleapis.com/userinfo", {
      //   headers: {
      //     Authorization: `Bearer ${credentialResponse.access_token}`,
      //   },
      // });

      // const userInfo = await response.json();
      // console.log("🍷🍷userInfo", userInfo);
      handleGoogleLogin(credentialResponse);
    },
    onError: () => {
      toast.error("Login failed");
    },
  });

  const handleSendCode = async () => {
    if (!account) {
      return toast.error("Please input valid email");
    }
    validateEmail(account);
    console.log("account", account);
    const res = await sendPost(
      `/api/auth/email`,
      {
        email: account,
      },
      {
        excludeAuthorization: true,
      }
    );

    console.log("handleSendCode = ", res);

    if (res && res?.code === 0) {
      setCountdown(60);
      setCode(null);
    }
  };

  const handleLogin = useDebouncedEffect(
    async () => {
      setIsLoading(true); // 设置 loading 状态
      console.log("提交的验证码:", code);
      const res: any = await sendPost(
        "/api/auth/email/login",
        {
          email: account,
          code: code,
        },
        {
          excludeAuthorization: true,
        }
      );

      if (!res || res.code === -1) {
        setCode(null);
        setIsLoading(false);
        return toast.error(res?.message || "login failed");
      }
      saveJwt(res.data.token);
      setUser({
        userKey: res.data.userKey || "",
      });
      setIsLoading(false);
      return router.push(DEFAULT_LOGIN_REDIRECT);
    },
    [code],
    1000
  );

  console.log("loading", isLoading);
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
          alt="logo"
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
                  sx={{
                    borderRadius: "7px",
                    color: "text", // 使用主题中的 text 色值
                    border: "1px solid #ddd",
                  }}
                  onChange={(e: any) => {
                    setAccount(e.target.value);
                  }}
                />
                <Flex>
                  <Input
                    placeholder="Verification Code"
                    sx={{
                      flex: 1,
                      mr: 2,
                      borderRadius: "7px",
                      color: "text", // 使用主题中的 text 色值
                      border: "1px solid #ddd",
                    }}
                    onChange={(e: any) => setCode(e.target.value)}
                  />
                  <Button
                    disabled={countdown > 0}
                    sx={{
                      bg: countdown > 0 ? "gray" : "primary",
                      color: countdown > 0 ? "text-gray-600" : "white",
                      flexShrink: 0,
                      borderRadius: "7px",
                    }}
                    onClick={handleSendCode}
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : "Send"}
                  </Button>
                </Flex>
                <Button
                  loading={isLoading.toString()}
                  sx={{
                    bg: "primary",
                    color: "white",
                    borderRadius: "7px",
                    py: 2,
                  }}
                  onClick={handleLogin}
                >
                  Log In
                </Button>
                <Text sx={{ textAlign: "center", my: 2, color: "text" }}>
                  OR
                </Text>
                {/* <GoogleLogin
                  size="large"
                  onSuccess={handleGoogleLogin}
                  onError={() => {
                    toast.error("Login failed");
                  }}
                /> */}
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
                    alt="google"
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
            >
              <Box sx={{ position: "relative", zIndex: 1, px: 5 }}>
                <Heading as="h1" sx={{ fontSize: 5, mb: 3 }}>
                  Empower your AI Applications with MIZU Data
                </Heading>
                <Text>Open, Ultra-low Cost, Hyperscale</Text>
              </Box>
              <Image
                src="/images/login/logo.png"
                alt="logo"
                sx={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                }}
              />
            </Box>
          )}
        </Flex>
      </Box>
    </Box>
  );
}
