// src/app/api/cart/update/route.ts
import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const {itemId, quantity} = await request.json();

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        {error: "Item ID and quantity are required"},
        {status: 400}
      );
    }

    if (quantity <= 0) {
      // Hapus item jika quantity 0 atau kurang
      await prisma.cartItem.delete({
        where: {id: itemId},
      });
    } else {
      // Update quantity
      await prisma.cartItem.update({
        where: {id: itemId},
        data: {quantity: quantity},
      });
    }

    return NextResponse.json({success: true});
  } catch (error) {
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
