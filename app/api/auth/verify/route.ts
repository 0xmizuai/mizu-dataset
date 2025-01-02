import { getJWT, verifyJWT } from "@/lib/jwt";
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
  const user = jwtSub?.user;
  if (!user) {
    return NextResponse.json(
      { code: 401, message: "Auth failed" },
      { status: 401 }
    );
  }

  try {
    const newToken = await getJWT(user);
    return NextResponse.json({
      code: 0,
      data: {
        token: newToken,
        user,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { code: 401, message: "Auth failed" },
      { status: 401 }
    );
  }
}
