// src/app/account/orders/page.tsx - Perbaikan pada bagian order items
"use client";

import {useState, useEffect} from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Sheet,
  Chip,
  Stack,
  Divider,
  Breadcrumbs,
  Grid,
} from "@mui/joy";
import {ReceiptRounded, ChevronRightRounded} from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";
import {api} from "@/lib/axios";
import {formatCurrency} from "@/utils";
import {PageLoader} from "@/components";

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const {data} = await api.get("/orders");
      setOrders(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "success";
      case "SHIPPED":
        return "primary";
      case "PROCESSING":
        return "warning";
      case "PENDING":
        return "neutral";
      case "CANCELLED":
        return "danger";
      default:
        return "neutral";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "Selesai";
      case "SHIPPED":
        return "Dikirim";
      case "PROCESSING":
        return "Diproses";
      case "PENDING":
        return "Menunggu";
      case "CANCELLED":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Container maxWidth="lg" sx={{py: 4}}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<ChevronRightRounded />} sx={{mb: 4}}>
        <Link href="/account" style={{textDecoration: "none"}}>
          <Typography color="neutral">Akun</Typography>
        </Link>
        <Typography color="primary">Pesanan</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Typography level="h2" sx={{fontWeight: 700}}>
          Pesanan Saya
        </Typography>
        <Button
          component={Link}
          href="/products"
          variant="soft"
          color="neutral"
        >
          Lanjut Berbelanja
        </Button>
      </Box>

      {orders.length === 0 ? (
        <Sheet
          variant="outlined"
          sx={{p: 6, borderRadius: "lg", textAlign: "center"}}
        >
          <ReceiptRounded sx={{fontSize: 64, color: "neutral.400", mb: 2}} />
          <Typography level="h4" sx={{mb: 1}}>
            Belum ada pesanan
          </Typography>
          <Typography level="body-md" color="neutral" sx={{mb: 3}}>
            Mulai berbelanja dan temukan produk menarik untuk dibeli
          </Typography>
          <Button component={Link} href="/products" size="lg" color="neutral">
            Jelajahi Produk
          </Button>
        </Sheet>
      ) : (
        <Stack spacing={3}>
          {orders.map((order) => (
            <Sheet
              key={order.id}
              variant="outlined"
              sx={{p: 3, borderRadius: "lg"}}
            >
              {/* Order Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 3,
                }}
              >
                <Box>
                  <Typography level="title-lg" fontWeight={600}>
                    Order #{order.orderNumber}
                  </Typography>
                  <Typography level="body-sm" color="neutral">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                </Box>
                <Chip
                  color={getStatusColor(order.status)}
                  variant="soft"
                  size="lg"
                >
                  {getStatusText(order.status)}
                </Chip>
              </Box>

              <Divider sx={{my: 2}} />

              {/* Order Items */}
              <Box sx={{mb: 3}}>
                <Typography level="body-sm" fontWeight={600} sx={{mb: 2}}>
                  Item Pesanan ({order.items.length} produk)
                </Typography>

                <Stack spacing={2}>
                  {order.items.map((item: any) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: "flex",
                        gap: 2,
                        p: 2,
                        bgcolor: "neutral.50",
                        borderRadius: "md",
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          width: 60,
                          height: 60,
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
                        <Typography level="body-sm" fontWeight={600}>
                          {item.variant.product.name}
                        </Typography>
                        {item.variant.optionValues && (
                          <Typography level="body-xs" color="neutral">
                            Varian:{" "}
                            {Object.values(item.variant.optionValues).join(
                              " / "
                            )}
                          </Typography>
                        )}
                        <Typography level="body-xs" color="neutral">
                          Jumlah: {item.quantity}
                        </Typography>
                      </Box>
                      <Box sx={{textAlign: "right", minWidth: 100}}>
                        <Typography level="body-sm" fontWeight={600}>
                          {formatCurrency(item.price * item.quantity)}
                        </Typography>
                        <Typography level="body-xs" color="neutral">
                          {formatCurrency(item.price)}/item
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Divider sx={{my: 2}} />

              {/* Order Summary */}
              <Grid container spacing={2}>
                <Grid xs={12} md={8}>
                  <Box sx={{display: "flex", justifyContent: "space-between"}}>
                    <Typography level="body-sm">
                      Subtotal ({order.items.length} produk)
                    </Typography>
                    <Typography level="body-sm">
                      {formatCurrency(order.totalAmount - order.shippingCost)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                    }}
                  >
                    <Typography level="body-sm">Ongkos Kirim</Typography>
                    <Typography level="body-sm">
                      {formatCurrency(order.shippingCost)}
                    </Typography>
                  </Box>
                  <Divider sx={{my: 1}} />
                  <Box sx={{display: "flex", justifyContent: "space-between"}}>
                    <Typography level="body-md" fontWeight={600}>
                      Total
                    </Typography>
                    <Typography level="body-md" fontWeight={600}>
                      {formatCurrency(order.totalAmount)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid
                  xs={12}
                  md={4}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    component={Link}
                    href={`/account/orders/${order.id}`}
                    variant="solid"
                    size="sm"
                    color="neutral"
                  >
                    Lihat Detail Pesanan
                  </Button>
                </Grid>
              </Grid>
            </Sheet>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default OrdersPage;
