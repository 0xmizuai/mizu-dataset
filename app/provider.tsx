import { theme } from "@/theme";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeUIProvider } from "theme-ui";

export default function Provider({ children }: { children: React.ReactNode }) {
  console.log("process.env.GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID);
  return (
    <ThemeUIProvider theme={theme}>
      <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID || ""}>
        {children}
      </GoogleOAuthProvider>
    </ThemeUIProvider>
  );
}
