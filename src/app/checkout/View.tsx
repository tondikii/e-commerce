"use client";

import {useState, useEffect} from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Divider,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Sheet,
  Modal,
  ModalDialog,
  ModalClose,
  Stack,
  Badge,
  Alert,
} from "@mui/joy";
import {
  AddRounded,
  CreditCardRounded,
  ErrorRounded,
  LocalShippingRounded,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import {useCheckout} from "@/hooks/useCheckout";
import {formatCurrency} from "@/utils";
import {useSearchParams} from "next/navigation";
import {PageLoader} from "@/components";

// Payment method options
const PAYMENT_METHODS = [
  {
    value: "GOPAY",
    label: "GoPay",
    description: "Bayar dengan GoPay",
    logoSrc: "/gopay.png",
    badge: "Populer",
  },
  {
    value: "SHOPEEPAY",
    label: "ShopeePay",
    description: "Bayar dengan ShopeePay",
    logoSrc: "/shopee.svg",
  },
  {
    value: "QRIS",
    label: "QRIS",
    description: "Scan QR code untuk pembayaran",
    logoSrc: "/qris.svg",
  },
  {
    value: "BANK_TRANSFER",
    label: "Transfer Bank",
    description: "BCA, BNI, BRI, Mandiri",
    logo: "🏦",
  },
  {
    value: "ALFAMART",
    label: "Alfamart",
    description: "Bayar di gerai Alfamart",
    logoSrc: "/alfamart.png",
  },
  {
    value: "INDOMARET",
    label: "Indomaret",
    description: "Bayar di gerai Indomaret",
    logoSrc: "/indomart.png",
  },
];

const CheckoutPageView = () => {
  const searchParams = useSearchParams();
  const {loading, error, getCheckoutData, createOrder} = useCheckout();
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [showFailedAlert, setShowFailedAlert] = useState(false);

  const selectedItemsParam = searchParams.get("items");
  const selectedItems = selectedItemsParam
    ? selectedItemsParam.split(",").map(Number)
    : null;

  const loadCheckoutData = async () => {
    try {
      // Pass selected items to getCheckoutData
      const data = await getCheckoutData(selectedItems || undefined);
      setCheckoutData(data);

      if (data.addresses.length > 0) {
        setSelectedAddress(data.addresses[0].id.toString());
      }
      setSelectedPayment(PAYMENT_METHODS[0].value);
    } catch (err) {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddress || !selectedPayment) return;

    try {
      setProcessing(true);
      // Pass selected items to createOrder
      const result = await createOrder(
        parseInt(selectedAddress),
        selectedPayment,
        selectedItems || undefined
      );

      // Redirect to Midtrans payment page
      setPaymentUrl(result.redirectUrl);
      setOrderSuccess(true);
    } catch (err) {
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    loadCheckoutData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "failed") {
      setShowFailedAlert(true);
    }
  }, [searchParams]);

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{py: 4}}>
        <Box sx={{textAlign: "center", py: 8}}>
          <Typography level="h4" color="danger">
            {error}
          </Typography>
          <Button component={Link} href="/cart" sx={{mt: 2}}>
            Kembali ke Keranjang
          </Button>
        </Box>
      </Container>
    );
  }

  if (!checkoutData) {
    return null;
  }

  return (
    <>
      <Container maxWidth="lg" sx={{py: 4}}>
        <Typography level="h2" sx={{mb: 4, fontWeight: 700}}>
          Checkout
        </Typography>

        {/* Failed Payment Alert */}
        {showFailedAlert && (
          <Alert
            color="danger"
            variant="soft"
            sx={{mb: 3}}
            startDecorator={<ErrorRounded />}
          >
            <Typography fontWeight={600}>Pembayaran Gagal</Typography>
            <Typography level="body-sm">
              Transaksi pembayaran Anda gagal. Silakan coba lagi dengan metode
              pembayaran yang berbeda.
            </Typography>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Left Column - Shipping and Payment */}
            <Grid xs={12} md={8}>
              {/* Shipping Address */}
              <Sheet variant="outlined" sx={{borderRadius: "lg", p: 3, mb: 3}}>
                <Typography level="h4" sx={{mb: 3, fontWeight: 600}}>
                  <LocalShippingRounded sx={{mr: 1}} />
                  Alamat Pengiriman
                </Typography>

                <FormControl>
                  <FormLabel sx={{mb: 2, fontWeight: 600}}>
                    Pilih Alamat
                  </FormLabel>
                  <RadioGroup
                    value={selectedAddress}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                  >
                    {checkoutData.addresses.map((address: any) => (
                      <Sheet
                        key={address.id}
                        variant="outlined"
                        sx={{
                          p: 2,
                          mb: 2,
                          borderRadius: "md",
                          cursor: "pointer",
                        }}
                      >
                        <Radio
                          color="neutral"
                          value={address.id.toString()}
                          label={
                            <Box>
                              <Typography fontWeight={600}>
                                {address.recipient}{" "}
                              </Typography>
                              <Typography level="body-sm">
                                {address.phone}{" "}
                              </Typography>
                              <Typography level="body-sm">
                                {address.address}, {address.city},{" "}
                                {address.province} {address.postalCode}
                              </Typography>
                            </Box>
                          }
                          sx={{width: "100%"}}
                        />
                      </Sheet>
                    ))}
                  </RadioGroup>
                </FormControl>

                <Button
                  variant="outlined"
                  startDecorator={<AddRounded />}
                  sx={{mt: 2}}
                  component={Link}
                  href="/account/addresses"
                  color="neutral"
                >
                  Tambah Alamat Baru
                </Button>
              </Sheet>

              {/* Payment Method */}
              <Sheet variant="outlined" sx={{borderRadius: "lg", p: 3}}>
                <Typography level="h4" sx={{mb: 3, fontWeight: 600}}>
                  <CreditCardRounded sx={{mr: 1}} />
                  Metode Pembayaran
                </Typography>

                <FormControl>
                  <FormLabel sx={{mb: 2, fontWeight: 600}}>
                    Pilih Metode Pembayaran
                  </FormLabel>
                  <RadioGroup
                    value={selectedPayment}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    sx={{gap: 2}}
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <Sheet
                        key={method.value}
                        variant="outlined"
                        sx={{
                          p: 3,
                          borderRadius: "lg",
                          cursor: "pointer",
                          transition: "all 0.2s ease-in-out",
                          borderWidth: selectedPayment === method.value ? 2 : 1,
                          borderColor:
                            selectedPayment === method.value
                              ? "primary.500"
                              : "neutral.outlinedBorder",
                          backgroundColor:
                            selectedPayment === method.value
                              ? "primary.softBg"
                              : "background.surface",
                          "&:hover": {
                            borderColor: "primary.300",
                            transform: "translateY(-2px)",
                          },
                        }}
                        onClick={() => setSelectedPayment(method.value)}
                      >
                        <Radio
                          value={method.value}
                          label={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                              }}
                            >
                              <Box
                                sx={{
                                  mr: 2,
                                  width: 50,
                                  height: 50,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: "neutral.100",
                                  borderRadius: "md",
                                  overflow: "hidden",
                                }}
                              >
                                {method?.logo ? (
                                  <Typography level="h2">
                                    {method.logo}
                                  </Typography>
                                ) : (
                                  <Image
                                    src={method.logoSrc || ""}
                                    alt={method.label}
                                    width={40}
                                    height={40}
                                  />
                                )}
                              </Box>
                              <Box sx={{flex: 1}}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 0.5,
                                  }}
                                >
                                  <Typography fontWeight={600}>
                                    {method.label}
                                  </Typography>
                                  {method.badge && (
                                    <Badge
                                      size="sm"
                                      color="primary"
                                      variant="soft"
                                    >
                                      {method.badge}
                                    </Badge>
                                  )}
                                </Box>
                                <Typography level="body-sm" color="neutral">
                                  {method.description}
                                </Typography>
                              </Box>
                            </Box>
                          }
                          sx={{width: "100%"}}
                          overlay
                        />
                      </Sheet>
                    ))}
                  </RadioGroup>
                </FormControl>
              </Sheet>
            </Grid>

            {/* Right Column - Order Summary */}
            <Grid xs={12} md={4}>
              <Sheet
                variant="outlined"
                sx={{borderRadius: "lg", p: 3, position: "sticky", top: 100}}
              >
                <Typography level="h4" sx={{mb: 3, fontWeight: 600}}>
                  Ringkasan Pesanan
                </Typography>

                {/* Order Items */}
                <Box sx={{mb: 3}}>
                  {checkoutData.cart.items.map((item: any) => (
                    <Box key={item.id} sx={{display: "flex", gap: 2, mb: 2}}>
                      <Box
                        sx={{
                          position: "relative",
                          width: 60,
                          height: 60,
                          borderRadius: "md",
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={
                            item.variant.product.images[0]?.url ||
                            "/placeholder-image.jpg"
                          }
                          alt={
                            item.variant.product.images[0]?.altText ||
                            item.variant.product.name
                          }
                          fill
                          style={{objectFit: "cover"}}
                        />
                      </Box>
                      <Box sx={{flex: 1}}>
                        <Typography level="body-sm" fontWeight={600}>
                          {item.variant.product.name}
                        </Typography>
                        <Typography level="body-xs" color="neutral">
                          {item.quantity} × {formatCurrency(item.variant.price)}
                        </Typography>
                        {item.variant.optionValues && (
                          <Typography level="body-xs" color="neutral">
                            {Object.entries(item.variant.optionValues)
                              .map(([key, value]) => `${value}`)
                              .join(" / ")}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{my: 2}} />

                {/* Order Summary */}
                <Stack spacing={1} sx={{mb: 3}}>
                  <Box sx={{display: "flex", justifyContent: "space-between"}}>
                    <Typography level="body-sm">Subtotal</Typography>
                    <Typography level="body-sm">
                      {formatCurrency(checkoutData.cart.subtotal)}
                    </Typography>
                  </Box>

                  <Box sx={{display: "flex", justifyContent: "space-between"}}>
                    <Typography level="body-sm">Pengiriman</Typography>
                    <Typography level="body-sm">
                      {formatCurrency(checkoutData.cart.shipping)}
                    </Typography>
                  </Box>

                  <Box sx={{display: "flex", justifyContent: "space-between"}}>
                    <Typography level="body-sm">Pajak</Typography>
                    <Typography level="body-sm">
                      {formatCurrency(checkoutData.cart.taxes)}
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{my: 2}} />

                {/* Total */}
                <Box
                  sx={{display: "flex", justifyContent: "space-between", mb: 3}}
                >
                  <Typography level="title-lg" fontWeight={600}>
                    Total
                  </Typography>
                  <Typography level="title-lg" fontWeight={600}>
                    {formatCurrency(checkoutData.cart.total)}
                  </Typography>
                </Box>

                <Button
                  type="submit"
                  size="lg"
                  loading={processing}
                  disabled={!selectedAddress || !selectedPayment}
                  fullWidth
                  color="neutral"
                >
                  Lanjut ke Pembayaran
                </Button>
              </Sheet>
            </Grid>
          </Grid>
        </form>
      </Container>

      {/* Success Modal */}
      <Modal open={orderSuccess} onClose={() => setOrderSuccess(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h4" sx={{mb: 2}}>
            Order Berhasil Dibuat!
          </Typography>
          <Typography level="body-sm" sx={{mb: 3}}>
            Silakan lanjutkan ke halaman pembayaran untuk menyelesaikan
            transaksi.
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
            Lanjut ke Pembayaran
          </Button>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default CheckoutPageView;
