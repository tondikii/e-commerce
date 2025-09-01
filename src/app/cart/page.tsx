"use client";

import {useState} from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Divider,
  IconButton,
  Stack,
  Sheet,
  Input,
  Modal,
  ModalDialog,
  ModalClose,
  Checkbox,
} from "@mui/joy";
import {
  AddRounded,
  RemoveRounded,
  DeleteRounded,
  ShoppingCartOutlined,
  LoginRounded,
  ArrowForwardRounded,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import {useSession} from "next-auth/react";
import {PageLoader, Title} from "@/components";
import {formatCurrency} from "@/utils";
import useMasterData from "@/store/useMasterData";

const CartPage = () => {
  const {data: session} = useSession();
  const {cart, loadingCart, errorCart, updateQuantityCart, removeFromCart} =
    useMasterData();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(itemId);
      // Remove from selected items if it was selected
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      await updateQuantityCart(itemId, newQuantity);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    await removeFromCart(itemId);
    // Remove from selected items
    setSelectedItems(selectedItems.filter((id) => id !== itemId));
  };

  const toggleItemSelection = (itemId: number) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const cartItems = Array.isArray(cart?.items) ? cart.items : [];

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  // Calculate selected items total
  const selectedItemsTotal = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((total, item) => total + item.quantity * item.variant.price, 0);

  // Calculate selected items count
  const selectedItemsCount = selectedItems.length;

  if (loadingCart) {
    return <PageLoader />;
  }

  if (errorCart) {
    return (
      <Container maxWidth="lg" sx={{py: 4}}>
        <Box sx={{textAlign: "center", py: 8}}>
          <Typography level="h4" color="danger">
            {errorCart}
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{py: 4}}>
        <Box sx={{textAlign: "center", py: 8}}>
          <ShoppingCartOutlined
            sx={{fontSize: 64, color: "neutral.400", mb: 2}}
          />
          <Typography level="h4" sx={{mb: 2}}>
            Keranjang Anda kosong
          </Typography>
          <Typography level="body-md" color="neutral" sx={{mb: 3}}>
            Tambahkan beberapa produk untuk mulai berbelanja
          </Typography>
          <Button component={Link} href="/products" size="lg" color="neutral">
            Lanjutkan Berbelanja
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{py: 4}}>
        <Title sx={{mb: 4}}>Keranjang Belanja</Title>

        <Grid container spacing={4}>
          {/* Items List */}
          <Grid xs={12} md={8}>
            <Sheet variant="outlined" sx={{borderRadius: "lg", p: 3}}>
              <Box sx={{display: "flex", alignItems: "center", mb: 3}}>
                <Checkbox
                  label={`Pilih Semua (${selectedItemsCount}/${cart.items.length})`}
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  sx={{mr: 2}}
                />
              </Box>

              {cart.items.map((item) => (
                <Box key={item.id}>
                  <Grid container spacing={3} sx={{mb: 3, py: 3}}>
                    <Grid xs={1}>
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        sx={{mt: 1}}
                      />
                    </Grid>

                    <Grid xs={3} sm={2}>
                      <Box
                        sx={{
                          position: "relative",
                          borderRadius: "lg",
                          overflow: "hidden",
                          aspectRatio: "1",
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
                    </Grid>

                    <Grid xs={8} sm={9}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                        }}
                      >
                        <Typography
                          level="title-md"
                          sx={{mb: 1, fontWeight: 600}}
                        >
                          {item.variant.product.name}
                        </Typography>

                        {item.variant.optionValues && (
                          <Typography
                            level="body-sm"
                            color="neutral"
                            sx={{mb: 1}}
                          >
                            Varian:{" "}
                            {Object.entries(item.variant.optionValues)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(" / ")}
                          </Typography>
                        )}

                        <Typography
                          level="body-md"
                          sx={{mb: 2, fontWeight: 600}}
                        >
                          {formatCurrency(item.variant.price)}
                        </Typography>

                        <Box
                          sx={{
                            mt: "auto",
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{display: "flex", alignItems: "center", gap: 1}}
                          >
                            <IconButton
                              size="sm"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                            >
                              <RemoveRounded />
                            </IconButton>

                            <Input
                              value={item.quantity}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (!isNaN(value) && value > 0) {
                                  handleQuantityChange(item.id, value);
                                }
                              }}
                              sx={{width: "60px", textAlign: "center"}}
                            />

                            <IconButton
                              size="sm"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                            >
                              <AddRounded />
                            </IconButton>
                          </Box>

                          <IconButton
                            color="danger"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <DeleteRounded />
                          </IconButton>
                        </Box>

                        <Typography
                          level="body-lg"
                          sx={{mt: 2, fontWeight: 600}}
                        >
                          Total:{" "}
                          {formatCurrency(item.quantity * item.variant.price)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  <Divider />
                </Box>
              ))}
            </Sheet>
          </Grid>

          {/* Order Summary */}
          <Grid xs={12} md={4}>
            <Sheet
              variant="outlined"
              sx={{borderRadius: "lg", p: 3, position: "sticky", top: 100}}
            >
              <Title sx={{mb: 3}}>Ringkasan Pesanan</Title>

              <Divider sx={{my: 2}} />

              {/* Selected Items Info */}
              {selectedItemsCount > 0 && (
                <>
                  <Typography level="body-sm" sx={{mb: 2}}>
                    {selectedItemsCount} item dipilih dari {cart.items.length}
                  </Typography>
                  <Divider sx={{my: 2}} />
                </>
              )}

              {/* Order Summary Details */}
              <Stack spacing={1} sx={{mb: 3}}>
                <Box sx={{display: "flex", justifyContent: "space-between"}}>
                  <Typography level="body-sm">Subtotal</Typography>
                  <Typography level="body-sm">
                    {selectedItemsCount > 0
                      ? formatCurrency(selectedItemsTotal)
                      : formatCurrency(cart.subtotal)}
                  </Typography>
                </Box>

                <Box sx={{display: "flex", justifyContent: "space-between"}}>
                  <Typography level="body-sm">Pengiriman</Typography>
                  <Typography level="body-sm">
                    {selectedItemsCount > 0
                      ? formatCurrency(
                          cart.shipping *
                            (selectedItemsCount / cart.items.length)
                        )
                      : formatCurrency(cart.shipping)}
                  </Typography>
                </Box>

                <Box sx={{display: "flex", justifyContent: "space-between"}}>
                  <Typography level="body-sm">Pajak</Typography>
                  <Typography level="body-sm">
                    {selectedItemsCount > 0
                      ? formatCurrency(
                          cart.taxes * (selectedItemsTotal / cart.subtotal)
                        )
                      : formatCurrency(cart.taxes)}
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
                  {selectedItemsCount > 0
                    ? formatCurrency(
                        selectedItemsTotal +
                          cart.shipping *
                            (selectedItemsCount / cart.items.length) +
                          cart.taxes * (selectedItemsTotal / cart.subtotal)
                      )
                    : formatCurrency(cart.total)}
                </Typography>
              </Box>

              {session ? (
                <Button
                  component={Link}
                  href={
                    selectedItemsCount > 0
                      ? `/checkout?items=${selectedItems.join(",")}`
                      : "/checkout"
                  }
                  size="lg"
                  fullWidth
                  endDecorator={<ArrowForwardRounded />}
                  sx={{mb: 2}}
                  color="neutral"
                  disabled={selectedItemsCount === 0}
                >
                  {selectedItemsCount > 0
                    ? `Lanjut ke Pembayaran (${selectedItemsCount})`
                    : "Pilih Item untuk Checkout"}
                </Button>
              ) : (
                <Button
                  size="lg"
                  fullWidth
                  startDecorator={<LoginRounded />}
                  onClick={() => setLoginModalOpen(true)}
                  sx={{mb: 2}}
                  color="neutral"
                >
                  Masuk untuk Checkout
                </Button>
              )}

              <Button
                component={Link}
                href="/products"
                variant="outlined"
                fullWidth
                color="neutral"
              >
                Lanjutkan Berbelanja
              </Button>
            </Sheet>
          </Grid>
        </Grid>
      </Container>

      {/* Login Modal */}
      <Modal open={loginModalOpen} onClose={() => setLoginModalOpen(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h4" sx={{mb: 2}}>
            Masuk ke Akun
          </Typography>
          <Typography level="body-sm" sx={{mb: 3}}>
            Masuk untuk melanjutkan proses checkout dan pengalaman berbelanja
            yang lebih baik.
          </Typography>
          <Link href="/auth/signin">
            <Button
              component={Link}
              href="/auth/signin"
              fullWidth
              size="lg"
              onClick={() => setLoginModalOpen(false)}
              color="neutral"
            >
              Masuk Sekarang
            </Button>
          </Link>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default CartPage;
