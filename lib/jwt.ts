import { createPublicKey } from "crypto";
import { SignJWT, base64url, jwtVerify } from "jose";
import dayjs from "dayjs";

export interface AuthedUserInfo {
  userId: string;
  userKey: string;
  userKeyType: string;
}

export interface JwtSub {
  user: AuthedUserInfo;
}

export const getJWT = async (user: AuthedUserInfo) => {
  const secretKey = process.env.JWT_SECRET_KEY || "";

  const sub: JwtSub = {
    user,
  };

  const jwt = await new SignJWT({
    sub: JSON.stringify(sub),
    iat: dayjs().unix(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(base64url.decode(secretKey))
    .catch((err) => {
      console.error("getJWT:", err);
    });
  return jwt || undefined;
};

export const verifyJWT = async (jwt: string) => {
  const secretKey = process.env.JWT_SECRET_KEY || "";
  try {
    const verifyResult = await jwtVerify(
      jwt,
      base64url.decode(secretKey)
    ).catch((err) => {
      console.error("verifyJWT:", err);
    });
    console.log("🚀 verifyResult = ", verifyResult);
    return JSON.parse(verifyResult?.payload?.sub || "");
  } catch (error) {
    console.error("JWT verification failed", error);
    return undefined;
  }
};
