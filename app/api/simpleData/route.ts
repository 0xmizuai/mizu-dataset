import { verifyJWT } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { AUTH_FAILED } from "@/utils/constants";
import { NextRequest } from "next/server";
import zlib from "zlib";
import { httpMessage } from "@/utils/constants";

async function downloadAndParseJSON(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const base64EncodedData = await response.text();

    const decodedBuffer = Buffer.from(base64EncodedData, "base64");
    console.log("~🌽🌽 decompressedData", decodedBuffer);

    zlib.unzip(decodedBuffer, (err, result) => {
      if (err) {
        console.error("unzip error", err);
        return;
      }
      try {
        console.log("~🌽🌽 result", result);
        const jsonData = JSON.parse(result.toString());
        console.log("~🌽🌽 jsonData", jsonData);
        return jsonData;
      } catch (parseErr) {
        console.error("parse error", parseErr);
      }
    });
  } catch (error: any) {
    console.error("downloadAndParseJSON error:", error);
    throw new Error("downloadAndParseJSON error: " + error.message);
  }
}

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
  const currentPage = params.get("currentPage") || 1;
  const pageSize = params.get("pageSzie") || 10;

  console.log("..currentPage..", id, currentPage, pageSize);

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
      skip: (Number(currentPage) - 1) * Number(pageSize),
      take: Number(pageSize),
    });

    const baseUrl = process.env.R2_DOWNLOAD_URL?.endsWith("/")
      ? process.env.R2_DOWNLOAD_URL
      : `${process.env.R2_DOWNLOAD_URL}/`;

    const jsonDataArray = await Promise.all(
      [
        await downloadAndParseJSON(
          "https://rawdata.mizu.global/CC-MAIN-2024-46/text/aar/0009f2b163771cdc3da57f6de6e39a4e.zz"
        ),
      ]
      // records.map(async (item: any) => {
      //   const downloadUrl = `${baseUrl}${dataset.name}/${dataset.data_type}/${dataset.language}/${item.md5}.zz`;
      //   return await downloadAndParseJSON(downloadUrl);
      // })
    );

    console.log("!!!🚀 jsonDataArray = ", jsonDataArray);

    const filteredJsonDataArray = jsonDataArray.filter((data) => data !== null);

    return Response.json({
      code: 0,
      message: "success",
      data: filteredJsonDataArray,
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
