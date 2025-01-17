"use client";
import { useUserStore } from "@/stores/userStore";
import { saveJwt, sendPost } from "@/utils/networkUtils";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Card,
  Input,
  Text,
  Flex,
  Image,
  Heading,
  Spinner,
} from "theme-ui";
import { useResponsiveValue } from "@theme-ui/match-media";
import { validateEmail } from "@/utils/commonUtils";
import { DEFAULT_LOGIN_REDIRECT } from "@/config/routes";

export default function LoginPage() {
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();
  const isMobile = useResponsiveValue([true, false, false], {
    defaultIndex: 2,
  });
  const [account, setAccount] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoging, setIsLoging] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const handleGoogleLogin = async (credentialResponse: any) => {
    console.log("credent🌻🌻ialResponse", credentialResponse);
    try {
      setIsLoading(true);
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
          userId: response.data.userId || "",
          point: response.data.user.point || 0,
        });
        return router.push("/");
      } else {
        return toast.error("Login failed");
      }
    } catch (error) {
      console.error("Google login error", error);
      return toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleLogin,
    onError: () => {
      toast.error("Login failed");
    },
  });

  const handleSendCode = async () => {
    if (!account || !validateEmail(account)) {
      console.log("account", account);
      return toast.error("Please input valid email");
    }
    setIsSending(true);
    console.log("🚀 ~ handleSendCode ~ account", account);
    const res = await sendPost(
      `/api/auth/email`,
      {
        email: account,
      },
      {
        excludeAuthorization: true,
      }
    );

    console.log("🚀 ~ handleSendCode ~ res", res);

    if (res && res.code === 0) {
      setCountdown(60);
      setCode("");
      setIsSending(false);
    } else {
      setIsSending(false);
      return toast.error(res?.message || "Send failed");
    }
  };

  const handleLogin = async () => {
    if (!code || !account) {
      return toast.error("Please input verification code and email");
    }
    setIsLoging(true);
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
      setCode("");
      setIsLoging(false);
      return toast.error(res?.message || "login failed");
    }
    saveJwt(res?.data?.token);
    setUser({
      userId: res?.data?.user?.userId || "",
      point: res?.data?.user?.point || 0,
    });
    setIsLoging(false);
    return router.push(DEFAULT_LOGIN_REDIRECT);
  };

  return (
    <Flex
      sx={{
        height: "100vh",
        width: "100%",
        bg: "white",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* header */}
      <Flex
        sx={{
          alignItems: "center",
          width: "100%",
          height: "108px",
          pl: isMobile ? "2" : "18%",
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
      </Flex>
      <Box
        sx={
          isMobile
            ? { width: "100%" }
            : {
                display: "flex",
                width: "100%",
                background: isMobile
                  ? "none"
                  : "linear-gradient(135deg, #3C81BF 0%, #1C44B3 31%, #1A42B4 63%, #1B43B4 100%)",
                height: "calc(100vh - 108px - 168px)",
                pl: "18%",
              }
        }
      >
        <Flex
          sx={{
            flexDirection: ["column", "row"],
          }}
        >
          <Box
            sx={{
              p: [2, 0, 0],
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              zIndex: 1000,
            }}
          >
            <Card
              sx={{
                p: [2, 4, 4],
                borderRadius: "20px",
                bg: "white",
                maxWidth: ["100%", "368px", "408px", "488px", "568px"],
                minWidth: ["100%", "368px", "400px", "428px", "508px"],
                maxHeight: ["100%", "488px", "488px", "538px", "688px"],
                minHeight: ["100%", "488px", "488px", "508px", "608px"],
                mx: "auto",
              }}
            >
              <Flex sx={{ flexDirection: "column", gap: 3 }}>
                <Heading
                  as="h2"
                  sx={{
                    mb: 3,
                    fontSize: ["24px", "28px", "36px", "36px", "36px"],
                    textAlign: "center",
                    color: "text",
                    fontWeight: "bold",
                    mt: ["0px", "0px", "12px", "12px", "12px"],
                  }}
                >
                  Login
                </Heading>
                <Input
                  placeholder="Enter your email address..."
                  sx={{
                    borderRadius: "7px",
                    color: "text",
                    border: "1px solid #ddd",
                  }}
                  onChange={(e: any) => {
                    setAccount(e.target.value);
                  }}
                />
                <Flex>
                  <Input
                    placeholder="Verification Code"
                    value={code}
                    sx={{
                      flex: 1,
                      mr: 2,
                      borderRadius: "7px",
                      color: "text",
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
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: !account ? "not-allowed" : "pointer",
                    }}
                    onClick={handleSendCode}
                  >
                    {countdown > 0 ? (
                      `${countdown}s`
                    ) : isSending ? (
                      <Spinner
                        size={20}
                        sx={{ color: "white", textAlign: "center", mr: 3 }}
                      />
                    ) : (
                      "Send"
                    )}
                  </Button>
                </Flex>
                <Button
                  loading={isLoading}
                  sx={{
                    bg: "primary",
                    color: "white",
                    borderRadius: "7px",
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: !code || !account ? "not-allowed" : "pointer",
                    height: "42px",
                    lineHeight: "42px",
                  }}
                  disabled={!code || !account}
                  onClick={handleLogin}
                >
                  {isLoging ? (
                    <Spinner sx={{ color: "white" }} size={20} />
                  ) : (
                    "Log In"
                  )}
                </Button>
                {/* google login */}
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
                  {isLoading ? (
                    <Spinner size={20} sx={{ textAlign: "center", mr: 3 }} />
                  ) : (
                    <Image
                      src="/images/icons/google.png"
                      alt="google"
                      sx={{ width: "20px", height: "20px", mr: 3 }}
                    />
                  )}
                  Continue with Google
                </Button>
              </Flex>
            </Card>
          </Box>

          {/* 右侧背景图片和文案 */}
          {isMobile ? null : (
            <Flex
              sx={{
                width: ["100%", "50%"],
                flexDirection: "column",
                mt: ["58px", "58px", "58px", "78px", "188px"],
                ml: ["70px", "70px", "70px", "70px", "150px"],
              }}
            >
              <Heading
                as="h1"
                sx={{
                  fontSize: ["24px", "28px", "36px", "42px", "48px"],
                  mb: 3,
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Empower your AI Applications with MIZU Data
              </Heading>
              <Text sx={{ color: "white", fontSize: 15 }}>
                Open, Ultra-low Cost, Hyperscale
              </Text>
            </Flex>
          )}
        </Flex>
        {isMobile ? null : (
          <Image
            src="/images/login/logo.png"
            alt="logo"
            sx={{
              maxWidth: ["100%", "400px", "468px", "508px", "688px"],
              minWidth: ["100%", "400px", "408px", "488px", "600px"],
              height: "auto",
              objectFit: "cover",
              position: "absolute",
              bottom: 168,
              right: 0,
            }}
          />
        )}
      </Box>
    </Flex>
  );
}
