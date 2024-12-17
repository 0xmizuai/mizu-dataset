"use client";

import { useDebouncedEffect } from "@/hooks/useDebouncedEffect";
import { useUserStore } from "@/stores/userStore";
import { deleteJwt, saveJwt, sendPost } from "@/utils/networkUtils";
import { usePathname, useRouter } from "next/navigation";

export const AuthInit = () => {
  const router = useRouter();
  const pathname = usePathname();
  const setUser = useUserStore((state) => state.setUser);

  // if (pathname === "/login") return null;

  useDebouncedEffect(
    async () => {
      const res: any = await sendPost(`/api/auth/verify`, {}, {});
      console.log("res", res);
      if (res?.code === 0) {
        saveJwt(res?.data?.token);
        setUser(res?.data?.userKey);
      } else {
        deleteJwt();
        router.push("/login");
      }
    },
    [pathname],
    500
  );

  return null;
};
