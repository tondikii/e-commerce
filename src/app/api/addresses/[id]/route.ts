// src/app/api/addresses/[id]/route.ts
import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  context: {params: Promise<{id: string}>}
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const {id} = await context.params;
    const addressId = parseInt(id);
    const body = await request.json();
    const {recipient, phone, address, province, city, postalCode} = body;

    const existingAddress = await prisma.shippingAddress.findUnique({
      where: {id: addressId},
    });

    if (!existingAddress || existingAddress.userId !== session.user.id) {
      return NextResponse.json({error: "Address not found"}, {status: 404});
    }

    const updatedAddress = await prisma.shippingAddress.update({
      where: {id: addressId},
      data: {
        recipient,
        phone,
        address,
        province,
        city,
        postalCode,
      },
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}

export async function DELETE(
  request: NextRequest,
  context: {params: Promise<{id: string}>}
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const {id} = await context.params;
    const addressId = parseInt(id);

    const existingAddress = await prisma.shippingAddress.findUnique({
      where: {id: addressId},
    });

    if (!existingAddress || existingAddress.userId !== session.user.id) {
      return NextResponse.json({error: "Address not found"}, {status: 404});
    }

    await prisma.shippingAddress.delete({
      where: {id: addressId},
    });

    return NextResponse.json({success: true});
  } catch (error) {
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
