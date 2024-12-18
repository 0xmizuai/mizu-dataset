"use client";
import { AuthInit } from "@/components/AuthInit";
import { theme } from "@/theme";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Suspense } from "react";
import { Flex } from "theme-ui";
import { Spinner } from "theme-ui";
import { ThemeUIProvider } from "theme-ui";

export default function Provider({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  console.log("process.env.GOOGLE_CLIENT_ID", clientId);

  const fallback = (
    <Flex
      sx={{ justifyContent: "center", alignItems: "center", height: "100vh" }}
    >
      <Spinner color="primary" />
    </Flex>
  );
  return (
    <Suspense fallback={fallback}>
      <ThemeUIProvider theme={theme}>
        <GoogleOAuthProvider clientId={clientId}>
          <AuthInit />
          {children}
        </GoogleOAuthProvider>
      </ThemeUIProvider>
    </Suspense>
  );
}
