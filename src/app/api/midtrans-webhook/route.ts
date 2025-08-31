import {NextRequest, NextResponse} from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

// Fungsi untuk verifikasi signature Midtrans
const verifySignature = (
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
) => {
  const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
  const input = orderId + statusCode + grossAmount + serverKey;
  const hash = crypto.createHash("sha512").update(input).digest("hex");
  return hash === signatureKey;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      order_id: orderId,
      transaction_status: transactionStatus,
      fraud_status: fraudStatus,
      status_code: statusCode,
      gross_amount: grossAmount,
      signature_key: signatureKey,
    } = body;

    // 🔹 Skip validasi DB untuk test dari dashboard Midtrans
    if (orderId?.startsWith("payment_notif_test_")) {
      return NextResponse.json({success: true, test: true});
    }

    // Verifikasi signature (jika ada signature key)
    if (signatureKey) {
      if (!verifySignature(orderId, statusCode, grossAmount, signatureKey)) {
        return NextResponse.json({error: "Invalid signature"}, {status: 400});
      }
    }

    // Find the order
    const order = await prisma.order.findUnique({
      where: {orderNumber: orderId},
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
      },
    });

    if (!order) {
      return NextResponse.json({error: "Order not found"}, {status: 404});
    }

    if (!order.payment) {
      return NextResponse.json({error: "Payment not found"}, {status: 404});
    }

    // Update payment status based on Midtrans notification
    let paymentStatus: "PENDING" | "PAID" | "FAILED" | "EXPIRED" = "PENDING";
    let orderStatus: "PENDING" | "PROCESSING" | "CANCELLED" = "PENDING";

    if (transactionStatus === "capture") {
      paymentStatus = fraudStatus === "accept" ? "PAID" : "FAILED";
      orderStatus = paymentStatus === "PAID" ? "PROCESSING" : "CANCELLED";
    } else if (transactionStatus === "settlement") {
      paymentStatus = "PAID";
      orderStatus = "PROCESSING";
    } else if (transactionStatus === "cancel" || transactionStatus === "deny") {
      paymentStatus = "FAILED";
      orderStatus = "CANCELLED";
    } else if (transactionStatus === "expire") {
      paymentStatus = "EXPIRED";
      orderStatus = "CANCELLED";
    } else if (transactionStatus === "pending") {
      paymentStatus = "PENDING";
      orderStatus = "PENDING";
    }

    // Gunakan transaction untuk memastikan konsistensi data
    await prisma.$transaction(async (tx) => {
      // Update payment
      await tx.payment.update({
        where: {id: order.payment!.id},
        data: {
          status: paymentStatus,
          paidAt: paymentStatus === "PAID" ? new Date() : null,
          // Simpan response Midtrans untuk referensi
          // Note: Anda perlu menambahkan field midtransResponse di schema Payment jika ingin menyimpan
          // midtransResponse: body,
        },
      });

      // Update order status
      await tx.order.update({
        where: {id: order.id},
        data: {status: orderStatus},
      });

      // Kurangi stok jika pembayaran berhasil
      if (paymentStatus === "PAID") {
        const orderItems = await tx.orderItem.findMany({
          where: {orderId: order.id},
          include: {variant: true},
        });

        for (const item of orderItems) {
          const newStock = item.variant.stock - item.quantity;

          if (newStock < 0) {
            continue;
          }

          await tx.productVariant.update({
            where: {id: item.variantId},
            data: {stock: newStock},
          });
        }
      }
    });

    return NextResponse.json({success: true});
  } catch (error) {
    return NextResponse.json(
      {error: "Internal server error", details: (error as Error).message},
      {status: 500}
    );
  }
}
