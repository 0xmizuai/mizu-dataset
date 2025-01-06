import prisma from "@/lib/prisma";
import { httpMessage } from "@/utils/constants";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const query = await prisma.queries.findUnique({
      where: { id: parseInt(id) },
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

    const jsonData = {
      id: query.id,
      query_text: query.query_text,
      model: query.model,
    };

    return Response.json({
      code: 0,
      message: "success",
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
