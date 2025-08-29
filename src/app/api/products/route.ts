// src/app/api/products/route.ts
import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const {searchParams} = new URL(request.url);

    const categoryIds = searchParams.get("category")?.split(",") || [];
    const collectionIds = searchParams.get("collection")?.split(",") || [];
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sortBy = searchParams.get("sort") || "newest";
    const searchQuery = searchParams.get("search");

    // Build where clause
    const where: any = {};

    if (categoryIds.length > 0) {
      where.categoryId = {in: categoryIds.map((id) => parseInt(id))};
    }

    if (collectionIds.length > 0) {
      where.collectionId = {in: collectionIds.map((id) => parseInt(id))};
    }

    if (searchQuery) {
      where.OR = [
        {name: {contains: searchQuery, mode: "insensitive"}},
        {description: {contains: searchQuery, mode: "insensitive"}},
      ];
    }

    // Build orderBy
    let orderBy: any = {createdAt: "desc"};

    if (sortBy === "price-low") {
      orderBy = {variants: {_min: {price: "asc"}}};
    } else if (sortBy === "price-high") {
      orderBy = {variants: {_min: {price: "desc"}}};
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        images: true,
        variants: true,
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
        },
      },
      orderBy,
    });

    // Filter by price range
    let filteredProducts = products;
    if (minPrice || maxPrice) {
      const min = minPrice ? parseInt(minPrice) : 0;
      const max = maxPrice ? parseInt(maxPrice) : 10000000;

      filteredProducts = products.filter((product) => {
        const minProductPrice = Math.min(
          ...product.variants.map((v) => v.price)
        );
        return minProductPrice >= min && minProductPrice <= max;
      });
    }

    return NextResponse.json(filteredProducts);
  } catch (error) {
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
