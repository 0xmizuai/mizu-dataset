import { verifyJWT } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
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
  const { id } = await context.params;
  if (!id) return new Response("Bad Request", { status: 400 });
  try {
    const dataset = await prisma.datasets.findUnique({
      where: { id: parseInt(id) },
    });
    const date = new Date(dataset?.created_at || "");

    console.log("~🌽🌽 dataset = ", dataset);
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
    console.error("Error processing request:", error);
    return Response.json(
      {
        code: 500,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
