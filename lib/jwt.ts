import { createPrivateKey, createPublicKey } from "crypto";
import { SignJWT, jwtVerify } from "jose";

export const getJWT = async (userKey: string, userKeyType: string) => {
  const privateKey = process.env.JWT_PRIVATE_KEY;
  if (!privateKey) {
    return null;
  }
  const key = createPrivateKey(privateKey);

  const jwtSub = {
    userKey,
    userKeyType,
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
