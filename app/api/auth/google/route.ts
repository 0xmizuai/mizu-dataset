import { NextRequest } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { getJWT } from "@/lib/jwt";
import { AUTH_FAILED } from "@/utils/constants";
import connectMongo from "@/lib/mongoose";
import { UserPointModel } from "@/models/userPoint";
import { USER_KEY_TYPE } from "../email/login/route";

// const client = new OAuth2Client({
//   clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//   clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
// });

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

  try {
    const { sub, email, name, picture } = userData;
    const userKey = email || sub;

    await connectMongo();
    const admin = await UserPointModel.findOneAndUpdate(
      { user_key: userKey, user_key_type: USER_KEY_TYPE },
      { $set: { user_key: userKey, user_key_type: USER_KEY_TYPE } },
      { upsert: true, new: true }
    );
    const token = await getJWT({
      userId: admin._id.toString(),
      userKey: admin.user_key,
      userKeyType: admin.user_key_type,
    });

    return Response.json({
      code: 0,
      data: {
        token,
        user: {
          userId: admin._id.toString(),
          userKey: admin.user_key,
          userKeyType: admin.user_key_type,
          point: admin.claimed_point,
        },
      },
    });
  } catch (err) {
    return Response.json({
      code: AUTH_FAILED,
      message: "Google OAuth2.0 Auth failed",
    });
  }
}
