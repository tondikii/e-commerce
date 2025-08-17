import {NextResponse} from "next/server";
import {prisma} from "@/lib";
import {
  DEFAULT_CATEGORY_ID,
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  DEFAULT_STYLE_ID,
  RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
  RESPONSE_STATUS_OK,
} from "@/constants";
import {Prisma} from "@prisma/client";

export async function GET(request: Request) {
  try {
    const {searchParams} = new URL(request.url);
    const paramsObject = Object.fromEntries(searchParams.entries());
    const {
      name = "",
      limit = DEFAULT_LIMIT,
      offset = DEFAULT_OFFSET,
      styleId = DEFAULT_STYLE_ID,
      categoryId = DEFAULT_CATEGORY_ID,
    } = paramsObject;
    const pagination = {take: Number(limit), skip: Number(offset)};

    const where: Prisma.ProductWhereInput = {
      name: {contains: name, mode: "insensitive"},
      styleId: Number(styleId),
      categoryId: Number(categoryId),
    };

    const [data, totalRecords] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: {
          productImages: {select: {url: true}},
          productUnits: {
            select: {quantity: true, size: {select: {code: true}}},
          },
        },
        ...pagination,
      }),
      prisma.product.count({where}),
    ]);
    return NextResponse.json(
      {data, totalRecords},
      {status: RESPONSE_STATUS_OK}
    );
  } catch (err) {
    return NextResponse.json(err, {
      status: RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
    });
  }
}
