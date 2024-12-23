"use client";

import { useDebouncedEffect } from "@/hooks/useDebouncedEffect";
import { useUserStore } from "@/stores/userStore";
import { deleteJwt, saveJwt, sendPost } from "@/utils/networkUtils";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export const AuthInit = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const setUser = useUserStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);

  useDebouncedEffect(
    async () => {
      if (pathname === "/login") return;
      setLoading(true);
      try {
        const res: any = await sendPost(`/api/auth/verify`, {}, {});
        if (res?.code === 0) {
          saveJwt(res?.data?.token);
          setUser(res?.data?.userKey);
        } else {
          deleteJwt();
          router.push("/login");
        }
      } catch (error) {
        toast.error("Authentication failed");
        deleteJwt();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    },
    [pathname],
    500
  );

  return children;
};
