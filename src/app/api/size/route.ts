import {NextResponse} from "next/server";
import {prisma} from "@/lib";
import {
  RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
  RESPONSE_STATUS_OK,
} from "@/constants";

export async function GET() {
  try {
    const sizes = await prisma.size.findMany();
    return NextResponse.json(sizes, {status: RESPONSE_STATUS_OK});
  } catch (err) {
    return NextResponse.json(
      {message: "Gagal mengambil data ukuran"},
      {
        status: RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
      }
    );
  }
}
