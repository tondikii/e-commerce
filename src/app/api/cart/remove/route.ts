// src/app/api/cart/remove/route.ts
import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const {searchParams} = new URL(request.url);
    const itemId = searchParams.get("itemId");

    if (!itemId) {
      return NextResponse.json({error: "Item ID is required"}, {status: 400});
    }

    await prisma.cartItem.delete({
      where: {id: parseInt(itemId)},
    });

    return NextResponse.json({success: true});
  } catch (error) {
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
