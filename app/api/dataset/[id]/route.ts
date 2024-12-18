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
  const { id } = await params;
  if (!id)
    return Response.json(
      {
        code: 400,
        message: httpMessage[400],
      },
      { status: 400 }
    );
  try {
    const dataset = await prisma.datasets.findUnique({
      where: { id: parseInt(id) },
    });
    const date = new Date(dataset?.created_at || "");

    const jsonData = {
      id: dataset?.id.toString,
      name: dataset?.name,
      language: dataset?.language,
      data_type: dataset?.data_type,
      total_objects: dataset?.total_objects.toString(),
      total_bytes: dataset?.total_bytes?.toString(),
      created_at: date?.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
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
