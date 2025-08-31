import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import prisma from "@/lib/prisma";
import midtransClient from "midtrans-client";

export async function POST(
  request: NextRequest,
  {params}: {params: {id: string}}
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const orderId = parseInt(params.id);

    // Get order with payment details
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId: session.user.id,
      },
      include: {
        payment: true,
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
        shippingAddress: true,
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json({error: "Order not found"}, {status: 404});
    }

    if (!order.payment) {
      return NextResponse.json({error: "Payment not found"}, {status: 404});
    }

    if (
      order.payment.status !== "PENDING" &&
      order.payment.status !== "FAILED"
    ) {
      return NextResponse.json(
        {error: "Payment cannot be continued"},
        {status: 400}
      );
    }

    // Initialize Midtrans
    const snap = new midtransClient.Snap({
      isProduction: process.env.NODE_ENV === "production",
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.MIDTRANS_CLIENT_KEY!,
    });

    // Prepare items for Midtrans - convert id to string
    const itemDetails = order.items.map((item) => ({
      id: item.variantId.toString(), // Convert to string
      price: item.price,
      quantity: item.quantity,
      name: item.variant.product.name,
    }));

    // Add shipping cost as an item - convert id to string
    itemDetails.push({
      id: "SHIPPING", // Already string
      price: order.shippingCost,
      quantity: 1,
      name: "Shipping Cost",
    });

    // Create transaction
    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: order.orderNumber,
        gross_amount: order.totalAmount,
      },
      item_details: itemDetails,
      customer_details: {
        first_name: order.shippingAddress.recipient,
        email: order.user.email,
        phone: order.shippingAddress.phone,
        shipping_address: {
          first_name: order.shippingAddress.recipient,
          phone: order.shippingAddress.phone,
          address: order.shippingAddress.address,
          city: order.shippingAddress.city,
          postal_code: order.shippingAddress.postalCode,
          country_code: "IDN",
        },
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${order.id}`,
        error: `${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${order.id}?payment=failed`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${order.id}?payment=pending`,
      },
    });

    // Update payment - gunakan field yang sesuai dengan schema Prisma Anda
    await prisma.payment.update({
      where: {id: order.payment.id},
      data: {
        snapToken: transaction.token, // Gunakan snapToken sesuai schema
        status: "PENDING", // Reset status to pending when retrying
        expiryAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Set expiry 24 hours from now
      },
    });

    // Also update order status back to PENDING
    await prisma.order.update({
      where: {id: order.id},
      data: {status: "PENDING"},
    });

    return NextResponse.json({
      redirectUrl: transaction.redirect_url,
      token: transaction.token,
    });
  } catch (error) {
    return NextResponse.json(
      {error: "Failed to continue payment"},
      {status: 500}
    );
  }
}
