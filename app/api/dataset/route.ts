import { verifyJWT } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { currentPage: number; pageSize: number } }
) {
  const token =
    request.headers.get("Authorization")?.replace("Bearer ", "") || "";
  const jwtSub = await verifyJWT(token);
  console.log("jwtSub = ", jwtSub);
  const userKey = jwtSub?.userKey;
  if (!userKey) {
    return Response.json(
      {
        code: 401,
        message: "Authorization header missing",
      },
      { status: 401 }
    );
  }

  const { currentPage, pageSize } = params;
  try {
    const dataset = await prisma.datasets.findMany({
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });

    const jsonData = {
      list: dataset,
      total: dataset.length,
      currentPage,
      pageSize,
    };

    return NextResponse.json(jsonData);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.error();
  }
}
