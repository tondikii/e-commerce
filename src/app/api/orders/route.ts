// src/app/api/orders/route.ts
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

    const orders = await prisma.order.findMany({
      where: {
        userId: Number(session.user.id),
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
        payment: true,
      },
      orderBy: {createdAt: "desc"},
    });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
