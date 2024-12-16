import { NextRequest } from "next/server";
import { OAuth2Client } from "google-auth-library";
import prisma from "@/lib/prisma";
import { getJWT } from "@/lib/jwt";
import { AUTH_FAILED } from "@/utils/constants";

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

console.log("GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID);
/**
 * @description: google OAuth2.0 login
 * @param request: { tokenId: string }
 * @returns { code: number, data: {token: string} }
 */
export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { tokenId } = requestBody;
  console.log("tokenId", tokenId);
  const ticket = await client.verifyIdToken({
    idToken: tokenId,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  console.log("🌹 payload", payload);

  if (!payload) {
    return Response.json({
      code: -1,
      message: "verify token failed",
    });
  }

  try {
    const { sub, email, name, picture } = payload;
    console.log("🌹 payload", payload);
    const token = await getJWT(sub, "GOOGLE");
    const user = await prisma.users.upsert({
      where: { user_key: sub },
      update: {
        user_key: sub,
        type: "GOOGLE",
        email,
        name,
        avatar: picture,
      },
    });
    return Response.json({
      code: 0,
      data: { token, userKey: user.user_key },
    });
  } catch (err) {
    return Response.json({
      code: AUTH_FAILED,
      message: "Google OAuth2.0 Auth failed",
    });
  }
}
