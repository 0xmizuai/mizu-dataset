import { ApiResponse } from "@/types/api";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { COOKIE_KEY_JWT, DEFAULT_ERROR_MESSAGE } from "./constants";

export async function saveJwt(jwt: string) {
  setCookie(COOKIE_KEY_JWT, jwt, {
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    secure: process.env.NODE_ENV === "production",
  });
}

export function getJwt() {
  return getCookie(COOKIE_KEY_JWT);
}

export function deleteJwt() {
  deleteCookie(COOKIE_KEY_JWT);
}

export async function sendPost<T>(
  path: string,
  params: object,
  options?: {
    excludeAuthorization?: boolean;
    onError?: (errMessage: string) => void;
  }
): Promise<ApiResponse<T> | void> {
  try {
    const headers: any = { "Content-Type": "application/json" };

    if (!options?.excludeAuthorization) {
      const jwtCookie = getJwt();
      if (!jwtCookie) {
        options?.onError?.("Unauthorized");
        window.location.href = "/login";
        return;
      }
      headers.Authorization = `Bearer ${jwtCookie}`;
    }

    const response = await fetch(path, {
      method: "POST",
      headers,
      body: JSON.stringify(params),
    });

    if (response.status === 401) {
      options?.onError?.("Unauthorized");
      window.location.href = "/login";
      return;
    }

    if (!response.ok) {
      options?.onError?.(response.statusText);
      return;
    }

    return await response.json();
  } catch (err: any) {
    options?.onError?.(err.message || DEFAULT_ERROR_MESSAGE);
    return undefined;
  }
}

export async function sendGet<T>(
  path: string,
  params?: object,
  options?: {
    excludeAuthorization?: boolean;
    onError?: (errMessage: string) => void;
  }
): Promise<ApiResponse<T> | void> {
  try {
    const headers: any = { "Content-Type": "application/json" };

    if (!options?.excludeAuthorization) {
      const jwtCookie = getJwt();
      if (!jwtCookie) {
        window.location.href = "/login";
        options?.onError?.("Unauthorized");
        return;
      }
      headers.Authorization = `Bearer ${jwtCookie}`;
    }

    const url = params ? `${path}?${new URLSearchParams({ ...params })}` : path;
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (response.status === 401) {
      options?.onError?.("Unauthorized");
      window.location.href = "/login";
      return;
    }

    if (!response.ok) {
      options?.onError?.(response.statusText);
      return;
    }

    return await response.json();
  } catch (err: any) {
    options?.onError?.(err.message || DEFAULT_ERROR_MESSAGE);
    return;
  }
}
