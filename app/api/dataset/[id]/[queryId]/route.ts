import { verifyJWT } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { httpMessage } from "@/utils/constants";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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
  const { id } = await params; // queryId
  if (!id)
    return Response.json(
      {
        code: 400,
        message: httpMessage[400],
      },
      { status: 400 }
    );
  try {
    const query = await prisma.queries.findUnique({
      where: { id: parseInt(id) },
      include: {
        dataset: true,
      },
    });
    const date = new Date(query?.created_at || "");

    const jsonData = {
      id: query?.id.toString,
      query_text: query?.query_text,
      model: query?.model,
      status: query?.status,
      points_spent: query?.points_spent.toString(),
      created_at: date?.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      dataset: query?.dataset,
    };

    return Response.json({
      code: 200,
      data: jsonData,
    });
  } catch (error) {
    return Response.json(
      {
        code: 500,
        message: httpMessage[500],
      },
      { status: 500 }
    );
  }
}
