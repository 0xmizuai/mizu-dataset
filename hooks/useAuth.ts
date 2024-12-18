import { usePathname, useRouter } from "next/navigation";
import { getJwt, deleteJwt } from "@/utils/networkUtils";

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();

  const checkJwt = () => {
    console.log("🚀 ~ checkJwt ~ pathname", pathname);
    const jwt = getJwt();
    if (!jwt) {
      if (pathname !== "/login") {
        router.push("/login");
      }
      return false;
    }
    return true;
  };

  const handleUnauthorized = () => {
    console.log("🚀 ~ handleUnauthorized ~ pathname", pathname);
    if (pathname !== "/login") {
      router.push("/login");
    }
    deleteJwt();
  };

  return {
    checkJwt,
    handleUnauthorized,
  };
}
