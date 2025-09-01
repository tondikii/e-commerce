"use client";

import {useState, useEffect} from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Divider,
  IconButton,
  Stack,
  Input,
  Alert,
} from "@mui/joy";
import {
  AddRounded,
  RemoveRounded,
  ShoppingCartRounded,
  ArrowBackRounded,
  ArrowForwardRounded,
} from "@mui/icons-material";
import Image from "next/image";
import {useParams, useRouter} from "next/navigation";
import {useProduct} from "@/hooks";
import {api} from "@/lib/axios";
import {Product} from "@/types";
import {formatCurrency} from "@/utils";
import {PageLoader, ShareButton} from "@/components";
import {useSession} from "next-auth/react";
import useMasterData from "@/store/useMasterData";

const ProductDetailPage = () => {
  const {data: session} = useSession();
  const params = useParams();
  const productId = params.id as string;
  const {
    product,
    loading,
    error,
  }: {product: any | null | Product; loading: boolean; error: any} =
    useProduct(productId);
  const {addToCart} = useMasterData();

  const router = useRouter();

  const [actionLoading, setActionLoading] = useState<
    "addToCart" | "buyNow" | null
  >(null);

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addToCartMessage, setAddToCartMessage] = useState<{
    type: "success" | "warning";
    message: string;
  } | null>(null);

  const handleBuyNow = async () => {
    if (!session) {
      router.push("/sign-in");
      return;
    }
    if (!selectedVariant) return;

    try {
      setActionLoading("buyNow");

      // Gunakan API direct checkout
      await api.post("/checkout/direct", {
        variantId: selectedVariant.id,
        quantity,
      });

      // Redirect ke checkout page
      router.push("/checkout");
    } catch (error: any) {
      setAddToCartMessage({
        type: "warning",
        message: error.response?.data?.message || "Gagal melakukan pembelian",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Reset message setelah 3 detik
  useEffect(() => {
    if (addToCartMessage) {
      const timer = setTimeout(() => {
        setAddToCartMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [addToCartMessage]);

  // Otomatis pilih opsi pertama yang tersedia
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      const initialOptions: Record<string, string> = {};

      // Ambil semua option keys yang tersedia
      const optionKeys = new Set<string>();
      product.variants.forEach((variant: any) => {
        if (variant.optionValues) {
          Object.keys(variant.optionValues).forEach((key) => {
            optionKeys.add(key);
          });
        }
      });

      // Untuk setiap option key, pilih nilai pertama yang tersedia
      Array.from(optionKeys).forEach((key) => {
        const values = new Set(
          product.variants
            .map((v: any) => v.optionValues?.[key])
            .filter(Boolean)
        );
        if (values.size > 0) {
          initialOptions[key] = Array.from(values)[0] as string;
        }
      });

      setSelectedOptions(initialOptions);
    }
  }, [product]);

  const nextImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{py: 4}}>
        <Box sx={{textAlign: "center", py: 8}}>
          <Typography level="h4" color="danger">
            {error?.message || "Produk tidak ditemukan"}
          </Typography>
        </Box>
      </Container>
    );
  }

  // Dapatkan varian yang sesuai dengan opsi yang dipilih
  const selectedVariant = product.variants.find((variant: any) => {
    if (!variant.optionValues) return false;

    return Object.entries(selectedOptions).every(
      ([key, value]) => variant.optionValues[key] === value
    );
  });

  const isOutOfStock = selectedVariant ? selectedVariant.stock === 0 : true;

  // Group options berdasarkan type (color, size, etc)
  const availableOptions: Record<string, string[]> = {};
  product.variants.forEach((variant: any) => {
    if (variant.optionValues) {
      Object.entries(variant.optionValues).forEach(([key, value]: any) => {
        if (!availableOptions[key]) {
          availableOptions[key] = [];
        }
        if (value && !availableOptions[key].includes(value)) {
          availableOptions[key].push(value);
        }
      });
    }
  });

  // Dapatkan varian yang tersedia berdasarkan opsi yang sudah dipilih
  const getAvailableOptionsFor = (optionType: string) => {
    const otherSelectedOptions = {...selectedOptions};
    delete otherSelectedOptions[optionType];

    const availableValues = new Set<string>();

    product.variants.forEach((variant: any) => {
      if (!variant.optionValues) return;

      // Cek apakah varian ini sesuai dengan opsi yang sudah dipilih (selain optionType)
      const matchesOtherOptions = Object.entries(otherSelectedOptions).every(
        ([key, value]) => variant.optionValues[key] === value
      );

      if (
        matchesOtherOptions &&
        variant.stock > 0 &&
        variant.optionValues[optionType]
      ) {
        availableValues.add(variant.optionValues[optionType]);
      }
    });

    return Array.from(availableValues);
  };

  const handleOptionSelect = (optionType: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionType]: value,
    }));
  };

  const handleAddToCart = async () => {
    if (!session) {
      router.push("/sign-in");
      return;
    }
    if (!selectedVariant) return;

    try {
      setActionLoading("addToCart");
      setAddToCartMessage(null);

      addToCart(selectedVariant.id, quantity);

      setAddToCartMessage({
        type: "success",
        message: "Produk berhasil ditambahkan ke keranjang!",
      });
    } catch (error: any) {
      setAddToCartMessage({
        type: "warning",
        message:
          error.response?.data?.message || "Gagal menambahkan ke keranjang",
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{py: 4}}>
      <Grid container spacing={4}>
        {/* Product Images dengan Carousel */}
        <Grid xs={12} md={6}>
          <Box
            sx={{position: "relative", borderRadius: "lg", overflow: "hidden"}}
          >
            {product.images.length > 0 ? (
              <>
                <Box
                  sx={{position: "relative", width: "100%", height: "37.5rem"}}
                >
                  <Image
                    src={product.images[currentImageIndex].url}
                    alt={
                      product.images[currentImageIndex].altText || product.name
                    }
                    fill
                    style={{
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
                  />

                  {/* Navigation arrows untuk multiple images */}
                  {product.images.length > 1 && (
                    <>
                      <IconButton
                        onClick={prevImage}
                        sx={{
                          position: "absolute",
                          left: 10,
                          top: "50%",
                          transform: "translateY(-50%)",
                          bgcolor: "rgba(255, 255, 255, 0.8)",
                          "&:hover": {bgcolor: "white"},
                        }}
                      >
                        <ArrowBackRounded />
                      </IconButton>
                      <IconButton
                        onClick={nextImage}
                        sx={{
                          position: "absolute",
                          right: 10,
                          top: "50%",
                          transform: "translateY(-50%)",
                          bgcolor: "rgba(255, 255, 255, 0.8)",
                          "&:hover": {bgcolor: "white"},
                        }}
                      >
                        <ArrowForwardRounded />
                      </IconButton>
                    </>
                  )}
                </Box>

                {/* Image counter */}
                {product.images.length > 1 && (
                  <Typography
                    level="body-sm"
                    sx={{textAlign: "center", mt: 1, color: "text.secondary"}}
                  >
                    {currentImageIndex + 1} / {product.images.length}
                  </Typography>
                )}
              </>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "400px",
                  bgcolor: "neutral.100",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "lg",
                }}
              >
                <Typography color="neutral">Gambar tidak tersedia</Typography>
              </Box>
            )}
          </Box>
        </Grid>

        {/* Product Info */}
        <Grid xs={12} md={6}>
          <Box sx={{pl: {md: 3}}}>
            {/* Breadcrumb */}
            <Typography level="body-sm" color="neutral" sx={{mb: 1}}>
              Koleksi: {product.collection?.name || "-"} / Kategori:{" "}
              {product.category?.name || "-"}
            </Typography>

            {/* Product Title */}
            <Typography level="h2" sx={{mb: 2, fontWeight: 700}}>
              {product.name}
            </Typography>

            {/* Description */}
            <Typography level="body-md" sx={{mb: 3, color: "text.secondary"}}>
              {product.description}
            </Typography>

            {/* Price */}
            <Typography
              level="h3"
              sx={{mb: 3, color: "neutral.800", fontWeight: 600}}
            >
              {selectedVariant
                ? formatCurrency(selectedVariant.price)
                : formatCurrency(
                    Math.min(...product.variants.map((v: any) => v.price))
                  )}
            </Typography>

            <Divider sx={{my: 3}} />

            {/* Option Selection */}
            {Object.keys(availableOptions).map((optionType) => {
              const availableValues = getAvailableOptionsFor(optionType);
              const optionLabel =
                optionType === "color"
                  ? "Warna"
                  : optionType === "size"
                  ? "Ukuran"
                  : optionType;

              return (
                <Box key={optionType} sx={{mb: 3}}>
                  <Typography level="title-sm" sx={{mb: 2, fontWeight: 600}}>
                    Pilih {optionLabel}:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {availableValues.map((value: string) => {
                      const isSelected = selectedOptions[optionType] === value;
                      const isAvailable = availableValues.includes(value);

                      return (
                        <Chip
                          key={value}
                          variant={isSelected ? "solid" : "outlined"}
                          color={isAvailable ? "neutral" : "danger"}
                          onClick={() =>
                            isAvailable && handleOptionSelect(optionType, value)
                          }
                          sx={{
                            minWidth: "70px",
                            fontWeight: 500,
                            cursor: isAvailable ? "pointer" : "not-allowed",
                            mb: 1,
                            opacity: isAvailable ? 1 : 0.5,
                            ...(isSelected && {
                              bgcolor: "neutral.800",
                              color: "white",
                            }),
                          }}
                        >
                          {value}
                        </Chip>
                      );
                    })}
                  </Stack>
                </Box>
              );
            })}

            {/* Quantity Selector */}
            <Box sx={{mb: 3}}>
              <Typography level="title-sm" sx={{mb: 1, fontWeight: 600}}>
                Jumlah:
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton
                  variant="outlined"
                  color="neutral"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                >
                  <RemoveRounded />
                </IconButton>
                <Input
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value > 0) {
                      setQuantity(value);
                    }
                  }}
                  sx={{width: "80px", textAlign: "center"}}
                  disabled={isOutOfStock}
                />
                <IconButton
                  variant="outlined"
                  color="neutral"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={
                    isOutOfStock ||
                    (selectedVariant && quantity >= selectedVariant.stock)
                  }
                >
                  <AddRounded />
                </IconButton>
              </Stack>
            </Box>

            {selectedVariant && (
              <Box sx={{mb: 2}}>
                <Typography
                  level="body-sm"
                  color={
                    selectedVariant.stock === 0
                      ? "danger"
                      : selectedVariant.stock <= 2
                      ? "warning"
                      : "neutral"
                  }
                  fontWeight={600}
                >
                  {selectedVariant.stock === 0
                    ? "Stok habis"
                    : selectedVariant.stock <= 2
                    ? `Stok terbatas (${selectedVariant.stock} tersedia)`
                    : `Stok tersedia (${selectedVariant.stock} item)`}
                </Typography>
              </Box>
            )}

            {/* Add to Cart Button */}
            <Stack
              direction="row"
              spacing={2}
              sx={{
                mb: 3,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Button
                size="lg"
                loading={actionLoading === "addToCart"}
                onClick={handleAddToCart}
                disabled={isOutOfStock || !selectedVariant}
                sx={{
                  borderRadius: "lg",
                }}
                color="neutral"
              >
                <ShoppingCartRounded />
              </Button>

              <Button
                size="lg"
                loading={actionLoading === "buyNow"}
                onClick={handleBuyNow}
                disabled={isOutOfStock || !selectedVariant}
                sx={{
                  flex: 1,
                  borderRadius: "lg",
                }}
                variant="solid"
                color="neutral"
              >
                Beli Sekarang
              </Button>

              <ShareButton />
            </Stack>

            {/* Add to Cart Message */}
            {addToCartMessage && (
              <Alert color={addToCartMessage.type} variant="soft" sx={{mb: 2}}>
                {addToCartMessage.message}
              </Alert>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailPage;
