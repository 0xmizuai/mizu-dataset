import { createPrivateKey, createPublicKey } from "crypto";
import { SignJWT, jwtVerify } from "jose";

export interface AuthedUserInfo {
  userId: string;
  userKey: string;
  userKeyType: string;
}

export interface JwtSub {
  user: AuthedUserInfo;
}

export const getJWT = async (user: AuthedUserInfo) => {
  const privateKey = process.env.JWT_PRIVATE_KEY;
  if (!privateKey) {
    return null;
  }
  const key = createPrivateKey(privateKey);

  const sub: JwtSub = {
    user,
  };

  const jwtSub = {
    sub: JSON.stringify(sub),
  };
  const jwt = await new SignJWT({
    sub: JSON.stringify(jwtSub),
    iat: Math.floor(Date.now() / 1000),
  })
    .setProtectedHeader({ alg: "EdDSA", typ: "JWT" })
    .setExpirationTime("7d")
    .sign(key);
  return jwt;
};

export const verifyJWT = async (jwt: string) => {
  if (!jwt) {
    return null;
  }
  try {
    const privateKey = process.env.JWT_PRIVATE_KEY;
    if (!privateKey) {
      return null;
    }
    const key = createPublicKey(privateKey);
    const verifyResult = await jwtVerify(jwt, key);
    const jwtSub = JSON.parse(verifyResult?.payload?.sub || "");
    return jwtSub;
  } catch (error) {
    console.error("JWT verification failed", error);
    return null;
  }
};
