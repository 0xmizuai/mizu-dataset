import { verifyJWT } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { httpMessage } from "@/utils/constants";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; queryId: string } }
) {
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
  const { id, queryId } = await params;
  if (!id || !queryId)
    return Response.json(
      {
        code: 400,
        message: httpMessage[400],
      },
      { status: 400 }
    );
  try {
    const query = await prisma.queries.findUnique({
      where: { id: parseInt(queryId), dataset_id: parseInt(id) },
      include: {
        dataset: true,
      },
    });
    if (!query) {
      return Response.json({
        code: -1,
        message: "Query not found",
      });
    }
    const date = new Date(query.created_at);

    const jsonData = {
      id: query.id,
      query_text: query.query_text,
      model: query.model,
      status: query.status,
      points_spent: query.points_spent.toString(),
      created_at: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      dataset: {
        ...query.dataset,
        total_bytes: query.dataset?.total_bytes?.toString(),
        total_objects: query.dataset?.total_objects?.toString(),
        created_at: query.dataset?.created_at?.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      },
    };

    console.log("~ 🚀 ~ jsonData:", jsonData);

    return Response.json({
      code: 0,
      message: "success",
      data: jsonData,
    });
  } catch (error) {
    console.log("~ 🚀 ~ error:", error);
    return Response.json(
      {
        code: 500,
        message: httpMessage[500],
      },
      { status: 500 }
    );
  }
}
