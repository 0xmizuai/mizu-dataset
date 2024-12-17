"use client";
import { AuthInit } from "@/components/AuthInit";
import { theme } from "@/theme";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeUIProvider } from "theme-ui";

export default function Provider({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  console.log("process.env.GOOGLE_CLIENT_ID", clientId);

  return (
    <ThemeUIProvider theme={theme}>
      <GoogleOAuthProvider clientId={clientId}>
        {/* <AuthInit /> */}
        {children}
      </GoogleOAuthProvider>
    </ThemeUIProvider>
  );
}
