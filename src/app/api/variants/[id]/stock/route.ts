// src/app/api/variants/[id]/stock/route.ts
import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  {params}: {params: {id: string}}
) {
  try {
    const variantId = parseInt(params.id);

    const variant = await prisma.productVariant.findUnique({
      where: {id: variantId},
      select: {
        id: true,
        stock: true,
        sku: true,
        product: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!variant) {
      return NextResponse.json(
        {error: "Varian tidak ditemukan"},
        {status: 404}
      );
    }

    return NextResponse.json({
      variantId: variant.id,
      sku: variant.sku,
      productName: variant.product.name,
      stock: variant.stock,
      inStock: variant.stock > 0,
    });
  } catch (error) {
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
