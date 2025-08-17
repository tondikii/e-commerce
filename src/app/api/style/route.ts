import {NextResponse} from "next/server";
import {prisma} from "@/lib";
import {
  RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
  RESPONSE_STATUS_OK,
} from "@/constants";

export async function GET() {
  try {
    const styles = await prisma.style.findMany();
    return NextResponse.json(styles, {status: RESPONSE_STATUS_OK});
  } catch (err) {
    return NextResponse.json(
      {message: "Gagal mengambil data styles"},
      {
        status: RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
      }
    );
  }
}
