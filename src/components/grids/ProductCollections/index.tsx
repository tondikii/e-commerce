// src/components/ProductCollections.tsx
"use client";

import type {FC} from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  AspectRatio,
} from "@mui/joy";
import {ChevronRightRounded} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import {alpha} from "@mui/system";
import {Collections} from "@/types";

interface ProductCollectionsProps {
  collections: Collections;
}

const ProductCollections: FC<ProductCollectionsProps> = ({collections}) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get lowest price dari variants
  const getLowestPrice = (variants: any[]) => {
    if (!variants || variants.length === 0) return 0;
    return Math.min(...variants.map((v) => v.price));
  };

  return (
    <Box sx={{py: 8, px: {xs: 2, md: 4}}}>
      <Box sx={{maxWidth: "lg", mx: "auto"}}>
        {/* Filter collections yang memiliki produk */}
        {collections
          ?.filter(
            (collection) =>
              collection.products && collection.products.length > 0
          )
          .map((collection) => (
            <Box key={collection.id} sx={{mb: 10}}>
              {/* Header Collection */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 5,
                }}
              >
                <Typography
                  level="h1"
                  sx={{
                    fontSize: {xs: "1.75rem", md: "2.25rem"},
                    fontWeight: 600, // Lebih soft dari 800
                    letterSpacing: "-0.025em",
                    color: "text.primary",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {collection.name.toUpperCase()}
                </Typography>
                <Button
                  variant="outlined"
                  endDecorator={<ChevronRightRounded />}
                  component={Link}
                  href={`/collections/${collection.id}`}
                  sx={{
                    fontWeight: 500,
                    borderRadius: "xl",
                    px: 3,
                    py: 1,
                    fontSize: "0.9rem",
                    "&:hover": {
                      bgcolor: "primary.softBg",
                      transform: "translateX(4px)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                  color="neutral"
                >
                  Lihat Semua
                </Button>
              </Box>

              {/* Product Grid */}
              <Grid container spacing={4}>
                {collection.products && collection.products.length > 0
                  ? collection.products.slice(0, 4).map((product) => {
                      const lowestPrice = getLowestPrice(
                        product.variants || []
                      );
                      const mainImage = product.images?.[0];

                      return (
                        <Grid key={product.id} xs={12} sm={6} md={3}>
                          <ProductCard
                            product={product}
                            lowestPrice={lowestPrice}
                            mainImage={mainImage}
                            formatCurrency={formatCurrency}
                          />
                        </Grid>
                      );
                    })
                  : null}
              </Grid>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

// Komponen ProductCard dengan typography yang lebih estetik
const ProductCard = ({
  product,
  lowestPrice,
  mainImage,
  formatCurrency,
}: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleCardClick = () => {
    // Navigasi ke detail produk
    window.location.href = `/products/${product.id}`;
  };

  return (
    <Card
      variant="plain"
      sx={{
        height: "100%",
        p: 0,
        bgcolor: "transparent",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-8px)",
        },
      }}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "xl",
          mb: 3,
          bgcolor: "neutral.50",
          transition: "all 0.3s ease-in-out",
          transform: isHovered ? "scale(1.02)" : "scale(1)",
        }}
      >
        <AspectRatio ratio={3 / 4}>
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={mainImage.altText || product.name}
              fill
              style={{
                objectFit: "cover",
                opacity: imageLoaded ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
              }}
              onLoad={() => setImageLoaded(true)}
              className="product-image"
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                bgcolor: "neutral.50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{color: "text.secondary"}}>No Image</Typography>
            </Box>
          )}
        </AspectRatio>

        {/* Overlay effect on hover */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: isHovered ? alpha("#000", 0.02) : "transparent",
            transition: "background-color 0.3s ease-in-out",
          }}
        />

        {/* Quick View Button (appear on hover) */}
        <Button
          variant="solid"
          size="sm"
          sx={{
            position: "absolute",
            bottom: 12,
            left: "50%",
            transform: isHovered
              ? "translateX(-50%) translateY(0)"
              : "translateX(-50%) translateY(100%)",
            opacity: isHovered ? 1 : 0,
            borderRadius: "lg",
            fontWeight: 500,
            px: 3,
            fontSize: "0.8rem",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            whiteSpace: "nowrap",
          }}
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Quick view modal
          }}
          color="neutral"
        >
          Beli Sekarang
        </Button>
      </Box>

      <CardContent sx={{p: 0}}>
        {/* Product Name */}
        <Typography
          level="title-md"
          sx={{
            mb: 1,
            fontWeight: 500,
            color: "text.primary",
            lineHeight: 1.4,
            fontSize: "1rem",
            transition: "color 0.2s ease-in-out",
            "&:hover": {
              color: "primary.plainColor",
            },
          }}
        >
          {product.name}
        </Typography>

        {/* Category */}
        {product.category && (
          <Typography
            level="body-xs"
            sx={{
              mb: 1.5,
              color: "text.secondary",
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontSize: "0.7rem",
            }}
          >
            {product.category.name}
          </Typography>
        )}

        {/* Price */}
        <Typography
          level="body-md"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            fontSize: "1rem",
            letterSpacing: "-0.01em",
          }}
        >
          {formatCurrency(lowestPrice)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCollections;
