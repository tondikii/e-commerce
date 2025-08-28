import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {RESPONSE_STATUS_OK} from "@/constants";

export async function GET(request: NextRequest) {
  try {
    const {searchParams} = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");
    const categoryId = searchParams.get("categoryId");
    const collectionId = searchParams.get("collectionId");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        {name: {contains: search, mode: "insensitive"}},
        {description: {contains: search, mode: "insensitive"}},
      ];
    }

    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    if (collectionId === "true") {
      where.collectionId = Number(collectionId);
    }

    // Get products dengan relations
    const [data, totalRecords] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: {
          images: true,
          variants: true,
          category: {
            select: {
              name: true,
            },
          },
          collection: {
            select: {
              name: true,
            },
          },
          reviews: {
            select: {
              id: true,
              rating: true,
              comment: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.product.count({where}),
    ]);

    return NextResponse.json(
      {
        data,
        totalRecords,
      },
      {status: RESPONSE_STATUS_OK}
    );
  } catch (error) {
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
