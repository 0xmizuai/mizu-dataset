import { verifyJWT } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { httpMessage } from "@/utils/constants";

export async function GET(request: NextRequest) {
  const token =
    request.headers.get("Authorization")?.replace("Bearer ", "") || "";
  const jwtSub = await verifyJWT(token);
  const userKey = jwtSub?.userKey;
  if (!userKey) {
    return Response.json(
      {
        code: 401,
        message: httpMessage[401],
      },
      { status: 401 }
    );
  }
  const params = request.nextUrl.searchParams;
  const currentPage = params.get("currentPage");
  const pageSize = params.get("pageSize");
  try {
    const dataset = await prisma.datasets.findMany({
      skip: (Number(currentPage) - 1) * Number(pageSize),
      take: Number(pageSize),
    });

    const total = await prisma.datasets.count();

    const transformedData = dataset.map((item: any) => {
      const date = new Date(item.created_at);
      return {
        ...item,
        id: item.id.toString(),
        total_bytes: item.total_bytes.toString(),
        created_at: date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      };
    });

    return Response.json({
      code: 0,
      message: "success",
      data: {
        list: transformedData,
        total,
        currentPage: Number(currentPage),
        pageSize: Number(pageSize),
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return Response.json(
      {
        code: 500,
        message: httpMessage[500],
      },
      { status: 500 }
    );
  }
}
