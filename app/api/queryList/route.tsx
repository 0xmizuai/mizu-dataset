import { verifyJWT } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { httpMessage } from "@/utils/constants";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const token =
    request.headers.get("Authorization")?.replace("Bearer ", "") || "";
  const jwtSub = await verifyJWT(token);
  const jwtUserId = jwtSub?.user?.userId;
  if (!jwtUserId) {
    return Response.json(
      {
        code: 401,
        message: httpMessage[401],
      },
      { status: 401 }
    );
  }

  try {
    const id = request?.nextUrl?.searchParams?.get("id");
    const currentPage = request?.nextUrl?.searchParams?.get("currentPage");
    const pageSize = request?.nextUrl?.searchParams?.get("pageSize");
    const orderBy =
      request?.nextUrl?.searchParams?.get("orderBy") || "created_at";
    const order = request?.nextUrl?.searchParams?.get("order") || "desc";

    console.log(id, currentPage, pageSize);
    if (!id || !currentPage || !pageSize)
      return Response.json(
        {
          code: 400,
          message: httpMessage[400],
        },
        { status: 400 }
      );
    const [queries, total] = await prisma.$transaction([
      prisma?.queries?.findMany({
        where: {
          dataset_id: parseInt(id),
        },
        orderBy: {
          [orderBy]: order,
        },
        skip: (Number(currentPage) - 1) * Number(pageSize),
        take: Number(pageSize),
      }),
      prisma?.queries?.count({
        where: {
          dataset_id: parseInt(id),
        },
      }),
    ]);
    if (!queries || queries?.length === 0) {
      return Response.json({
        code: 0,
        message: "success",
        data: {
          total: 0,
          list: [],
          currentPage: Number(currentPage),
          pageSize: Number(pageSize),
        },
      });
    }

    const jsonData = queries.map((query) => ({
      id: query?.id?.toString(),
      query_text: query?.query_text,
      status: query?.status,
      points_spent: query?.points_spent?.toString(),
      created_at: query?.created_at?.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    }));

    return Response.json({
      code: 0,
      message: "success",
      data: {
        total: total,
        list: jsonData,
        currentPage: Number(currentPage),
        pageSize: Number(pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching queries:", error);
    return Response.json(
      {
        code: 500,
        message: httpMessage[500],
      },
      { status: 500 }
    );
  }
}
