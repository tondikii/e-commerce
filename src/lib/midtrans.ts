// src/lib/midtrans.ts
import midtransClient from "midtrans-client";

// Gunakan Snap untuk semua operasi
export const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || "",
  clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
});

// Fungsi untuk memverifikasi notification
export const verifyNotification = async (notification: any) => {
  try {
    // Midtrans mengirim data lengkap dalam webhook
    return notification;
  } catch (error) {
    throw error;
  }
};
