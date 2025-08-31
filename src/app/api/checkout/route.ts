import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {PaymentMethod} from "@prisma/client";
import {authOptions} from "@/lib/auth";
import {snap} from "@/lib/midtrans";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    // Get user's cart with items
    const cart = await prisma.cart.findFirst({
      where: {userId: session.user.id},
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
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({error: "Cart is empty"}, {status: 400});
    }

    // Get user's shipping addresses
    const addresses = await prisma.shippingAddress.findMany({
      where: {userId: session.user.id},
    });

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + item.quantity * item.variant.price;
    }, 0);

    const shipping = 0; // Free shipping for now
    const taxes = Math.round(subtotal * 0.11); // 11% tax
    const total = subtotal + shipping + taxes;

    return NextResponse.json({
      cart: {
        items: cart.items,
        subtotal,
        shipping,
        taxes,
        total,
      },
      addresses,
      user: {
        email: session.user.email,
        name: session.user.name,
      },
    });
  } catch (error) {
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const userId = Number(session.user.id);
    const body = await req.json();
    const {shippingAddressId, paymentMethod} = body;

    if (!shippingAddressId || !paymentMethod) {
      return NextResponse.json({error: "Missing fields"}, {status: 400});
    }

    // 1. Ambil cart user
    const cart = await prisma.cart.findFirst({
      where: {userId: session?.user?.id},
      include: {
        items: {
          include: {
            variant: {
              include: {product: true},
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({error: "Cart is empty"}, {status: 400});
    }

    for (const item of cart.items) {
      const variant = await prisma.productVariant.findUnique({
        where: {id: item.variantId},
      });

      if (!variant) {
        return NextResponse.json(
          {error: `Varian produk tidak ditemukan`},
          {status: 400}
        );
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Stok tidak cukup untuk ${item.variant.product.name}. Stok tersedia: ${variant.stock}`,
          },
          {status: 400}
        );
      }
    }

    // 2. Hitung total
    const shippingCost = 14000; // nanti bisa dynamic
    const items = cart.items.map((item) => ({
      id: item.variant.sku,
      price: item.variant.price,
      quantity: item.quantity,
      name: item.variant.product.name,
    }));

    const totalAmount =
      items.reduce((sum, item) => sum + item.price * item.quantity, 0) +
      shippingCost;

    // 3. Buat Order
    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        userId,
        shippingAddressId,
        shippingCost,
        totalAmount,
        status: "PENDING",
        items: {
          create: cart.items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.variant.price,
          })),
        },
      },
    });

    // 4. Buat transaksi Snap
    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: order.orderNumber,
        gross_amount: totalAmount,
      },
      item_details: [
        ...items,
        {
          id: "SHIPPING",
          price: shippingCost,
          quantity: 1,
          name: "Shipping Cost",
        },
      ],
      customer_details: {
        first_name: session.user.name || "Customer",
        email: session.user.email,
        phone: session.user.phoneNumber || "",
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${order.id}`,
        error: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?status=failed`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${order.id}?status=pending`,
      },
    });

    // 5. Simpan Payment
    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: totalAmount,
        method: paymentMethod as PaymentMethod,
        status: "PENDING",
        snapToken: transaction.token,
      },
    });

    // 6. Hapus cart user
    await prisma.cartItem.deleteMany({where: {cartId: cart.id}});

    return NextResponse.json({
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
    });
  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: 500});
  }
}
