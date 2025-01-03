import { NextRequest } from "next/server";
import { getRedisClient } from "@/lib/redis";
import { getJWT } from "@/lib/jwt";
import { namespace } from "@/utils/constants";
import connectMongo from "@/lib/mongoose";
import { UserPointModel } from "@/models/userPoint";

export const USER_KEY_TYPE = "email";

export async function POST(request: NextRequest) {
  const requestData = await request.json();
  const { email, code } = requestData;

  if (!email || !code) {
    return Response.json({
      code: -1,
      message: "request format error",
    });
  }

  // Check code
  const redisClient = await getRedisClient();
  const emailCode = await redisClient.get(`${namespace}:emailCode:${email}`);
  if (!emailCode || emailCode !== code) {
    return Response.json({
      code: -1,
      message: "code incorrect",
    });
  }

  await redisClient.del(`${namespace}:emailCode:${email}`);
  await connectMongo();
  const admin = await UserPointModel.findOneAndUpdate(
    { user_key: email, user_key_type: USER_KEY_TYPE },
    { $set: { user_key: email, user_key_type: USER_KEY_TYPE } },
    { upsert: true, new: true }
  );

  if (!admin) {
    return Response.json({
      code: -1,
      message: "admin not found",
    });
  }

  const token = await getJWT({
    userId: admin._id.toString(),
    userKey: admin.user_key,
    userKeyType: USER_KEY_TYPE,
  });

  return Response.json({
    code: 0,
    data: {
      token,
      user: {
        userId: admin._id.toString(),
        userKey: admin.user_key,
        userKeyType: USER_KEY_TYPE,
        point: admin.claimed_point,
      },
    },
  });
}
