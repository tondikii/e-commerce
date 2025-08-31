// src/app/api/addresses/route.ts
import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const addresses = await prisma.shippingAddress.findMany({
      where: {userId: session.user.id},
    });

    return NextResponse.json(addresses);
  } catch (error) {
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const body = await request.json();
    const {recipient, phone, address, province, city, postalCode} = body;

    // Validasi required fields
    if (!recipient || !phone || !address || !province || !city || !postalCode) {
      return NextResponse.json(
        {error: "Semua field harus diisi"},
        {status: 400}
      );
    }

    const newAddress = await prisma.shippingAddress.create({
      data: {
        recipient,
        phone,
        address,
        province,
        city,
        postalCode,
        userId: session.user.id || 0,
      },
    });

    return NextResponse.json(newAddress);
  } catch (error) {
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
