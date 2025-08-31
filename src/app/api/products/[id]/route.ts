import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: {params: Promise<{id: string}>}
) {
  try {
    const {id} = await context.params;
    const productId = parseInt(id);

    const product = await prisma.product.findUnique({
      where: {id: productId},
      include: {
        images: true,
        variants: {
          include: {
            cartItems: true,
            orderItems: true,
          },
        },
        category: true,
        collection: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({error: "Product not found"}, {status: 404});
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
