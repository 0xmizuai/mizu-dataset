import { NextRequest } from "next/server";
import { OAuth2Client } from "google-auth-library";
import prisma from "@/lib/prisma";
import { getJWT } from "@/lib/jwt";
import { AUTH_FAILED } from "@/utils/constants";

const client = new OAuth2Client({
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
});

/**
 * @description: google OAuth2.0 login
 * @param request: { tokenId: string }
 * @returns { code: number, data: {token: string} }
 */
export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { access_token } = requestBody;
  console.log("access_token", access_token);
  // 验证 google 认证用户信息是否有效

  // const tokenInfo = await client.getTokenInfo(access_token);
  // const ticket = await client.verifyIdToken({
  //   idToken: tokenId,
  //   audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  // });
  // const payload = ticket.getPayload();

  const response: any = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  console.log("🌹 response = ", response);
  if (!response) {
    return Response.json({
      code: -1,
      message: "verify token failed",
    });
  }

  const userData = await response.json();

  console.log("🌹 userData = ", userData);

  try {
    const { sub, email, name, picture } = userData;
    const token = await getJWT(sub, "GOOGLE");
    const user = await prisma.users.upsert({
      where: { user_key: sub },
      update: {
        user_key: sub,
        type: "GOOGLE",
        email,
        name: name || "",
        avatar: picture,
      },
      create: {
        user_key: sub,
        type: "GOOGLE",
        email,
        name: name || "",
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
