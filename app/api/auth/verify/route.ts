import { getJWT, verifyJWT } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const token =
    request.headers.get("Authorization")?.replace("Bearer ", "") || "";

  if (!token) {
    return NextResponse.json(
      { code: 401, message: "Auth failed" },
      { status: 401 }
    );
  }
  const jwtSub = await verifyJWT(token);
  const userKey = jwtSub?.userKey;
  const userKeyType = jwtSub?.userKeyType;
  if (!userKey) {
    return NextResponse.json(
      { code: 401, message: "Auth failed" },
      { status: 401 }
    );
  }

  try {
    const newToken = await getJWT(userKey, userKeyType);
    await prisma.users.upsert({
      where: { user_key: userKey },
      update: { user_key: userKey, type: userKeyType },
      create: { user_key: userKey, type: userKeyType },
    });
    return NextResponse.json({
      code: 0,
      data: { userKey, token: newToken },
    });
  } catch (error) {
    return NextResponse.json(
      { code: 401, message: "Auth failed" },
      { status: 401 }
    );
  }
}
