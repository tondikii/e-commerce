import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: {params: Promise<{id: string}>}
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const {id} = await context.params;
    const orderId = parseInt(id);

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: true,
                  },
                },
              },
            },
          },
        },
        shippingAddress: true,
        payment: true,
      },
    });

    if (!order) {
      return NextResponse.json({error: "Order not found"}, {status: 404});
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
