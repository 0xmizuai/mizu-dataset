import { verifyJWT } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { AUTH_FAILED } from "@/utils/constants";
import { NextRequest } from "next/server";
import zlib from "zlib";
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
  console.log("...params..", params);

  const id = params.get("id");

  if (!id) {
    return Response.json(
      { code: 400, message: "Missing dataset ID" },
      { status: 400 }
    );
  }

  try {
    const dataset = await prisma.datasets.findUnique({
      where: { id: Number(id) },
    });

    if (!dataset) {
      return Response.json(
        { code: 404, message: "Dataset not found" },
        { status: 404 }
      );
    }

    const records = await prisma.data_records.findMany({
      where: { dataset_id: Number(id) },
      skip: 0,
      take: 5,
    });

    const serializedRecords = records.map((record: any) => ({
      id: Number(record.id),
      md5: record.md5,
      byte_size: Number(record.byte_size),
    }));

    return Response.json(
      {
        code: 0,
        message: "success",
        data: serializedRecords,
      },
      { status: 200 }
    );
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
