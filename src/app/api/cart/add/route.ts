import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const {variantId, quantity} = await request.json();

    if (!variantId || !quantity) {
      return NextResponse.json(
        {error: "Variant ID and quantity are required"},
        {status: 400}
      );
    }

    // Cari atau buat keranjang untuk user
    let cart = await prisma.cart.findFirst({
      where: {userId: session.user.id},
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {userId: session.user.id || 0},
      });
    }

    // Cek apakah item sudah ada di keranjang
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        variantId: variantId,
      },
    });

    if (existingItem) {
      // Update quantity jika sudah ada
      await prisma.cartItem.update({
        where: {id: existingItem.id},
        data: {quantity: existingItem.quantity + quantity},
      });
    } else {
      // Tambah item baru
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId: variantId,
          quantity: quantity,
        },
      });
    }

    return NextResponse.json({success: true});
  } catch (error) {
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
