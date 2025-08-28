import {NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {
  RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
  RESPONSE_STATUS_OK,
} from "@/constants";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        id: "asc",
      },
    });
    return NextResponse.json(categories, {status: RESPONSE_STATUS_OK});
  } catch (err) {
    return NextResponse.json(err, {
      status: RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
    });
  }
}
