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
  console.log("jwtSub", jwtSub);
  const userKey = jwtSub?.userKey;

  if (!userKey) {
    return NextResponse.json(
      { code: 401, message: "Auth failed" },
      { status: 401 }
    );
  }

  try {
    const newToken = await getJWT(jwtSub.userKey, jwtSub.userKeyType);
    await prisma.users.upsert({
      where: { user_key: jwtSub.userKey },
      update: { user_key: jwtSub.userKey, type: jwtSub.userKeyType },
      create: { user_key: jwtSub.userKey, type: jwtSub.userKeyType },
    });
    return NextResponse.json({
      code: 0,
      data: { userKey: jwtSub.userKey, token: newToken },
    });
  } catch (error) {
    return NextResponse.json(
      { code: 401, message: "Auth failed" },
      { status: 401 }
    );
  }
}
