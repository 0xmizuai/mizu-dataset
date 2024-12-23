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
  const name = params.get("name");
  const language = params.get("language");
  try {
    const where: any = {};
    if (name) {
      where.name = { contains: name };
    }
    if (language && language !== "all") {
      where.language = language;
    }
    const datasets = await prisma.datasets.findMany({
      where,
      skip: (Number(currentPage) - 1) * Number(pageSize),
      take: Number(pageSize),
      orderBy: {
        crawled_at: "desc",
      },
    });

    const total = await prisma.datasets.count({ where });

    const transformedData = datasets.map((item: any) => {
      const crawledAt = new Date(item.crawled_at);
      return {
        ...item,
        id: item?.id?.toString(),
        total_bytes: item?.total_bytes?.toString(),
        crawled_at: crawledAt.toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
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
