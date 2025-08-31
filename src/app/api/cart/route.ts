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

    const cart = await prisma.cart.findFirst({
      where: {userId: session?.user?.id},
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: true,
                    category: true,
                    collection: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({items: [], total: 0});
    }

    // Hitung total
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + item.quantity * item.variant.price;
    }, 0);
    const taxes = Math.round(subtotal * 0.11); // 11% tax
    const shipping = 14000;

    const total = subtotal + shipping + taxes;

    return NextResponse.json({
      items: cart.items,
      total,
      subtotal: total,
      shipping,
      taxes,
    });
  } catch (error) {
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
