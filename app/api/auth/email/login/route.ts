import { NextRequest } from "next/server";
import { getRedisClient } from "@/lib/redis";
import { getJWT } from "@/lib/jwt";
import prisma from "@/lib/prisma";

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
  const emailCode = await redisClient.get(`emailCode:${email}`);
  if (!emailCode || emailCode !== code) {
    return Response.json({
      code: -1,
      message: "code incorrect",
    });
  }

  // Code is right, enter register logic
  const token = await getJWT(email, "EMAIL");

  await redisClient.del(`emailCode:${email}`);
  await prisma.users.upsert({
    where: { user_key: email },
    update: { user_key: email, type: "EMAIL", name: email },
    create: { user_key: email, type: "EMAIL", name: email },
  });

  return Response.json({
    code: 0,
    data: { token, userKey: email },
  });
}
