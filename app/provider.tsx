import { theme } from "@/theme";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeUIProvider } from "theme-ui";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeUIProvider theme={theme}>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
      >
        {children}
      </GoogleOAuthProvider>
    </ThemeUIProvider>
  );
}
