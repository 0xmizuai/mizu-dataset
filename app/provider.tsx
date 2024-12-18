"use client";
import { AuthInit } from "@/components/AuthInit";
import { theme } from "@/theme";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeUIProvider } from "theme-ui";

export default function Provider({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <ThemeUIProvider theme={theme}>
      <GoogleOAuthProvider clientId={clientId}>
        <AuthInit>{children}</AuthInit>
      </GoogleOAuthProvider>
    </ThemeUIProvider>
  );
}
