// src/app/api/checkout/direct/route.ts
import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {PrismaClient} from "@prisma/client";
import {authOptions} from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const {variantId, quantity, shippingAddressId} = await request.json();

    if (!variantId || !quantity) {
      return NextResponse.json(
        {error: "Variant ID and quantity are required"},
        {status: 400}
      );
    }

    // Get variant details
    const variant = await prisma.productVariant.findUnique({
      where: {id: variantId},
      include: {
        product: true,
      },
    });

    if (!variant) {
      return NextResponse.json({error: "Variant not found"}, {status: 404});
    }

    // Check stock
    if (variant.stock < quantity) {
      return NextResponse.json(
        {error: `Insufficient stock. Only ${variant.stock} available`},
        {status: 400}
      );
    }

    // Get or create cart
    let cart = await prisma.cart.findFirst({
      where: {userId: session.user.id},
      include: {items: true},
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {userId: session.user.id || 0},
        include: {items: true},
      });
    }

    // Clear existing cart items
    await prisma.cartItem.deleteMany({
      where: {cartId: cart?.id || 0},
    });

    // Add the single item to cart
    await prisma.cartItem.create({
      data: {
        cartId: cart?.id || 0,
        variantId: variantId,
        quantity: quantity,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product added to cart for direct checkout",
    });
  } catch (error) {
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
