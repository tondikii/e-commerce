"use client";

import {useState, useEffect} from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Sheet,
  Stack,
  Divider,
  Alert,
  Chip,
  Grid,
  Modal,
  ModalDialog,
  ModalClose,
} from "@mui/joy";
import {
  CheckCircleRounded,
  LocalShippingRounded,
  InventoryRounded,
  HomeRounded,
  ReceiptRounded,
  ScheduleRounded,
  PaymentRounded,
  DoneAllRounded,
  ErrorRounded,
  CreditCardRounded,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import {useParams} from "next/navigation";
import {api} from "@/lib/axios";
import {formatCurrency} from "@/utils";
import {PageLoader} from "@/components";

const orderSteps = [
  {
    label: "Pesanan Dibuat",
    description: "Pesanan telah diterima",
    status: "PENDING",
    icon: <ScheduleRounded />,
  },
  {
    label: "Pembayaran",
    description: "Menunggu konfirmasi pembayaran",
    status: "PAID",
    icon: <PaymentRounded />,
  },
  {
    label: "Diproses",
    description: "Pesanan sedang dipersiapkan",
    status: "PROCESSING",
    icon: <InventoryRounded />,
  },
  {
    label: "Dikirim",
    description: "Pesanan dalam pengiriman",
    status: "SHIPPED",
    icon: <LocalShippingRounded />,
  },
  {
    label: "Selesai",
    description: "Pesanan telah diterima",
    status: "DELIVERED",
    icon: <DoneAllRounded />,
  },
];

const OrderDetailPage = () => {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const {data} = await api.get(`/orders/${orderId}`);
      setOrder(data);
    } catch (err) {
      setError("Gagal memuat detail order");
    } finally {
      setLoading(false);
    }
  };

  const getActiveStep = (status: string) => {
    const statusIndex = orderSteps.findIndex((step) => step.status === status);
    return statusIndex >= 0 ? statusIndex : 0;
  };

  const handleContinuePayment = async () => {
    try {
      setProcessingPayment(true);
      const {data} = await api.post(`/orders/${orderId}/continue-payment`);
      setPaymentUrl(data.redirectUrl);
      setShowPaymentModal(true);
    } catch (err) {
      setError("Gagal melanjutkan pembayaran");
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (error || !order) {
    return (
      <Container maxWidth="lg" sx={{py: 4}}>
        <Alert color="danger">{error || "Order tidak ditemukan"}</Alert>
        <Button
          component={Link}
          href="/account/orders"
          sx={{mt: 2}}
          color="neutral"
        >
          Kembali ke Daftar Order
        </Button>
      </Container>
    );
  }

  const activeStep = getActiveStep(order.status);
  const isPendingPayment = order.payment?.status === "PENDING";
  const isFailedPayment = order.payment?.status === "FAILED";
  const canContinuePayment = isPendingPayment || isFailedPayment;

  return (
    <Container maxWidth="lg" sx={{py: 4}}>
      {/* Header */}
      <Box sx={{textAlign: "center", mb: 6}}>
        {canContinuePayment ? (
          <ErrorRounded sx={{fontSize: 64, color: "warning.500", mb: 2}} />
        ) : (
          <CheckCircleRounded
            sx={{fontSize: 64, color: "success.500", mb: 2}}
          />
        )}
        <Typography level="h2" sx={{mb: 1, fontWeight: 700}}>
          {canContinuePayment ? "Pembayaran Tertunda" : "Terima Kasih!"}
        </Typography>
        <Typography level="body-lg" color="neutral">
          {isPendingPayment
            ? "Silakan selesaikan pembayaran Anda"
            : isFailedPayment
            ? "Pembayaran Anda gagal. Silakan coba lagi."
            : "Pesanan Anda telah berhasil dibuat"}
        </Typography>
        <Chip color="neutral" variant="soft" sx={{mt: 2}}>
          No. Order: {order.orderNumber}
        </Chip>
      </Box>

      {/* Payment Alert for Pending/Failed */}
      {canContinuePayment && (
        <Alert
          color={isPendingPayment ? "warning" : "danger"}
          variant="soft"
          sx={{mb: 4}}
          startDecorator={<CreditCardRounded />}
        >
          <Box>
            <Typography fontWeight={600}>
              {isPendingPayment ? "Menunggu Pembayaran" : "Pembayaran Gagal"}
            </Typography>
            <Typography level="body-sm">
              {isPendingPayment
                ? "Silakan selesaikan pembayaran untuk melanjutkan proses order."
                : "Pembayaran Anda tidak berhasil. Silakan coba lagi dengan metode yang berbeda."}
            </Typography>
            <Button
              onClick={handleContinuePayment}
              loading={processingPayment}
              sx={{mt: 2}}
              color="neutral"
            >
              {isPendingPayment ? "Lanjutkan Pembayaran" : "Coba Lagi"}
            </Button>
          </Box>
        </Alert>
      )}

      {/* Order Progress */}
      <Sheet variant="outlined" sx={{p: 4, borderRadius: "lg", mb: 4}}>
        <Typography level="h4" sx={{mb: 3, fontWeight: 600}}>
          Status Pesanan
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            position: "relative",
            mb: 3,
          }}
        >
          {/* Progress Line */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: 2,
              bgcolor: "neutral.200",
              transform: "translateY(-50%)",
              zIndex: 1,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              width: `${(activeStep / (orderSteps.length - 1)) * 100}%`,
              height: 2,
              bgcolor: "neutral.500",
              transform: "translateY(-50%)",
              zIndex: 2,
            }}
          />

          {/* Steps */}
          {orderSteps.map((step, index) => (
            <Box
              key={step.label}
              sx={{position: "relative", zIndex: 3, textAlign: "center"}}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: index <= activeStep ? "neutral.500" : "neutral.200",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 1,
                }}
              >
                {index <= activeStep ? (
                  <CheckCircleRounded sx={{color: "white"}} />
                ) : (
                  <Box sx={{color: "neutral.500"}}>{step.icon}</Box>
                )}
              </Box>
              <Typography level="body-sm" fontWeight={600}>
                {step.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Current Status */}
        <Alert color="neutral" variant="soft">
          <Typography fontWeight={600}>
            Status saat ini: {orderSteps[activeStep].label}
          </Typography>
          <Typography level="body-sm">
            {orderSteps[activeStep].description}
          </Typography>
        </Alert>
      </Sheet>

      <Grid container spacing={4}>
        {/* Order Details */}
        <Grid xs={12} md={8}>
          <Sheet variant="outlined" sx={{p: 3, borderRadius: "lg", mb: 3}}>
            <Typography level="body-md" sx={{mb: 3, fontWeight: 600}}>
              Detail Pesanan
            </Typography>

            <Box>
              {order.items.map((item: any) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    gap: 2,
                    p: 2,
                    bgcolor: "neutral.50",
                    borderRadius: "md",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: 80,
                      height: 80,
                      borderRadius: "sm",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={
                        item.variant.product.images[0]?.url ||
                        "/placeholder-image.jpg"
                      }
                      alt={item.variant.product.name}
                      fill
                      style={{objectFit: "cover"}}
                    />
                  </Box>
                  <Box sx={{flex: 1}}>
                    <Typography fontWeight={600}>
                      {item.variant.product.name}
                    </Typography>
                    <Typography level="body-sm" color="neutral" sx={{mb: 1}}>
                      {item.quantity} × {formatCurrency(item.price)}
                    </Typography>
                    {item.variant.optionValues && (
                      <Typography level="body-xs" color="neutral">
                        Varian:{" "}
                        {Object.values(item.variant.optionValues).join(" / ")}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{textAlign: "right", minWidth: 100}}>
                    <Typography fontWeight={600}>
                      {formatCurrency(item.price * item.quantity)}
                    </Typography>
                    <Typography level="body-xs" color="neutral">
                      {formatCurrency(item.price)}/item
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Stack spacing={1}>
              <Box sx={{display: "flex", justifyContent: "space-between"}}>
                <Typography>Subtotal</Typography>
                <Typography>
                  {formatCurrency(order.totalAmount - order.shippingCost)}
                </Typography>
              </Box>
              <Box sx={{display: "flex", justifyContent: "space-between"}}>
                <Typography>Ongkos Kirim</Typography>
                <Typography>{formatCurrency(order.shippingCost)}</Typography>
              </Box>
              <Divider />
              <Box sx={{display: "flex", justifyContent: "space-between"}}>
                <Typography fontWeight={600}>Total</Typography>
                <Typography fontWeight={600}>
                  {formatCurrency(order.totalAmount)}
                </Typography>
              </Box>
            </Stack>
          </Sheet>

          {/* Shipping Address */}
          <Sheet variant="outlined" sx={{p: 3, borderRadius: "lg"}}>
            <Typography level="body-md" sx={{mb: 2, fontWeight: 600}}>
              <LocalShippingRounded sx={{mr: 1}} />
              Alamat Pengiriman
            </Typography>
            <Box sx={{display: "flex", alignItems: "flex-start", gap: 2}}>
              <HomeRounded sx={{color: "neutral.500", mt: 0.5}} />
              <Box>
                <Typography fontWeight={600}>
                  {order.shippingAddress.recipient}
                </Typography>
                <Typography level="body-sm">
                  {order.shippingAddress.phone}
                </Typography>
                <Typography level="body-sm" color="neutral">
                  {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.province}{" "}
                  {order.shippingAddress.postalCode}
                </Typography>
              </Box>
            </Box>
          </Sheet>
        </Grid>

        <Grid xs={12} md={4}>
          <Sheet
            variant="outlined"
            sx={{p: 3, borderRadius: "lg", position: "sticky", top: 100}}
          >
            <Stack spacing={2}>
              <Button
                component={Link}
                href="/products"
                variant="outlined"
                fullWidth
                color="neutral"
              >
                Lanjut Berbelanja
              </Button>

              <Button
                component={Link}
                href="/account/orders"
                variant="solid"
                fullWidth
                color="neutral"
              >
                Lihat Semua Order
              </Button>

              {canContinuePayment && (
                <Button
                  onClick={handleContinuePayment}
                  loading={processingPayment}
                  fullWidth
                  startDecorator={<CreditCardRounded />}
                  color="neutral"
                >
                  {isPendingPayment ? "Lanjutkan Pembayaran" : "Coba Lagi"}
                </Button>
              )}

              {order.payment?.status === "PAID" && (
                <Button
                  variant="outlined"
                  color="neutral"
                  fullWidth
                  startDecorator={<ReceiptRounded />}
                  onClick={() => window.print()}
                >
                  Cetak Invoice
                </Button>
              )}
            </Stack>

            {/* Payment Status */}
            <Divider sx={{my: 3}} />
            <Box>
              <Typography level="body-sm" fontWeight={600} sx={{mb: 1}}>
                Status Pembayaran
              </Typography>
              <Chip
                color={
                  order.payment?.status === "PAID"
                    ? "success"
                    : order.payment?.status === "PENDING"
                    ? "warning"
                    : "danger"
                }
                variant="soft"
                size="sm"
              >
                {order.payment?.status === "PAID"
                  ? "Lunas"
                  : order.payment?.status === "PENDING"
                  ? "Menunggu"
                  : "Gagal"}
              </Chip>
            </Box>

            {/* Order Info */}
            <Divider sx={{my: 3}} />
            <Box>
              <Typography level="body-sm" fontWeight={600} sx={{mb: 1}}>
                Informasi Order
              </Typography>
              <Typography level="body-xs">
                Tanggal: {new Date(order.createdAt).toLocaleDateString("id-ID")}
              </Typography>
              <Typography level="body-xs">Status: {order.status}</Typography>
              {order.payment?.paidAt && (
                <Typography level="body-xs">
                  Dibayar:{" "}
                  {new Date(order.payment.paidAt).toLocaleDateString("id-ID")}
                </Typography>
              )}
            </Box>
          </Sheet>
        </Grid>
      </Grid>

      {/* Payment Modal */}
      <Modal open={showPaymentModal} onClose={() => setShowPaymentModal(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h4" sx={{mb: 2}}>
            Lanjutkan Pembayaran
          </Typography>
          <Typography level="body-sm" sx={{mb: 3}}>
            Silakan lanjutkan ke halaman pembayaran untuk menyelesaikan
            transaksi. Jangan tutup halaman ini sampai pembayaran selesai.
          </Typography>
          <Button
            component={Link}
            href={paymentUrl}
            // target="_blank"
            rel="noopener noreferrer"
            fullWidth
            size="lg"
            color="neutral"
          >
            Buka Halaman Pembayaran
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{mt: 2}}
            onClick={() => setShowPaymentModal(false)}
            color="neutral"
          >
            Tutup
          </Button>
        </ModalDialog>
      </Modal>
    </Container>
  );
};

export default OrderDetailPage;
