import { verifyJWT } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { httpMessage } from "@/utils/constants";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
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
  const { query_text, datasetId, model } = await request.json(); // datasetId
  if (!query_text || !datasetId || !model)
    return Response.json(
      {
        code: 400,
        message: httpMessage[400],
      },
      { status: 400 }
    );
  try {
    await prisma.queries.create({
      data: {
        query_text,
        dataset_id: parseInt(datasetId),
        user_id: userKey,
        model,
      },
    });

    return Response.json({
      code: 0,
      data: {},
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
