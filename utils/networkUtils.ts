import { ApiResponse } from "@/types/api";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { COOKIE_KEY_JWT, DEFAULT_ERROR_MESSAGE } from "./constants";

export async function saveJwt(jwt: string) {
  setCookie(COOKIE_KEY_JWT, jwt, {
    maxAge: 60 * 60 * 24 * 7,
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
): Promise<ApiResponse<T> | undefined> {
  try {
    const headers: any = { "Content-Type": "application/json" };
    if (!options?.excludeAuthorization) {
      const jwtCookie = getJwt();
      if (!jwtCookie) {
        options?.onError?.("Unauthorized");
        return;
      }
      headers.Authorization = `Bearer ${jwtCookie}`;
    }

    const response = await fetch(path, {
      method: "POST",
      headers,
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      options?.onError?.(response.statusText);
      return undefined;
    }

    const resJson = await response.json();
    if (resJson?.code === 401) {
      options?.onError?.("Unauthorized");
      return undefined;
    }

    return resJson;
  } catch (err) {
    return undefined;
  }
}

export async function sendGet<T>(
  path: string,
  params: object,
  options?: {
    excludeAuthorization?: boolean;
    onError?: (errMessage: string) => void;
  }
): Promise<ApiResponse<T> | undefined> {
  try {
    const headers: any = { "Content-Type": "application/json" };
    if (!options?.excludeAuthorization) {
      const jwtCookie = getJwt();
      if (!jwtCookie) {
        options?.onError?.("Unauthorized");
        return;
      }
      headers.Authorization = `Bearer ${jwtCookie}`;
    }

    const response = await fetch(
      `${path}?` + new URLSearchParams({ ...params }),
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      options?.onError?.(response.statusText);
      return undefined;
    }

    const resJson = await response.json();

    if (resJson?.code === 401) {
      options?.onError?.("Unauthorized");
      return undefined;
    }

    return resJson;
  } catch (err: any) {
    options?.onError?.(err.message || DEFAULT_ERROR_MESSAGE);
    return undefined;
  }
}

export async function checkAuth() {}
