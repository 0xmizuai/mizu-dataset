import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) return new NextResponse("Not Found", { status: 404 });
  try {
    const dataset = await prisma.datasets.findUnique({
      where: { id },
    });

    const jsonData = {
      name: dataset?.name,
    };

    return NextResponse.json(jsonData);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.error();
  }
}
