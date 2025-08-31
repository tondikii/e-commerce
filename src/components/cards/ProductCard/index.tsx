"use client";

import {useState} from "react";
import {Box, Card, CardContent, Typography, Chip} from "@mui/joy";
import Image from "next/image";
import {alpha} from "@mui/system";

interface ProductCardProps {
  product: any;
  lowestPrice: number;
  mainImage: any;
  formatCurrency: (amount: number) => string;
}

const ProductCard = ({
  product,
  lowestPrice,
  mainImage,
  formatCurrency,
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Cek jika produk habis
  const isOutOfStock = product.variants.every((v: any) => v.stock === 0);
  const lowStock = product.variants.some(
    (v: any) => v.stock > 0 && v.stock <= 2
  );

  const handleCardClick = () => {
    window.location.href = `/products/${product.id}`;
  };

  return (
    <Card
      variant="plain"
      sx={{
        height: "100%",
        width: "100%",
        maxWidth: 250, // Konsisten lebar card
        minWidth: 220,
        p: 0,
        bgcolor: "transparent",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "translateY(-8px)",
        },
      }}
      onClick={isOutOfStock ? undefined : handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container dengan fixed height */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "xl",
          bgcolor: "neutral.50",
          transition: "all 0.3s ease-in-out",
          transform: isHovered ? "scale(1.02)" : "scale(1)",
          width: "100%",
          height: 300, // Fixed height untuk konsistensi
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={mainImage.altText || product.name}
              fill
              style={{
                objectFit: "cover",
                objectPosition: "center",
                opacity: imageLoaded ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
              }}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
        </Box>

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

        {/* Stock Status Badge */}
        {isOutOfStock && (
          <Chip
            color="danger"
            variant="solid"
            size="sm"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              fontWeight: 600,
            }}
          >
            Habis
          </Chip>
        )}

        {lowStock && !isOutOfStock && (
          <Chip
            color="warning"
            variant="solid"
            size="sm"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              fontWeight: 600,
            }}
          >
            Stok Terbatas
          </Chip>
        )}
      </Box>

      {/* Content Container dengan flex grow untuk konsistensi */}
      <CardContent
        sx={{
          p: 2,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
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
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
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

        {/* Price - selalu di bottom untuk konsistensi */}
        <Typography
          level="body-md"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            fontSize: "1rem",
            letterSpacing: "-0.01em",
            mt: "auto",
          }}
        >
          {formatCurrency(lowestPrice)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
