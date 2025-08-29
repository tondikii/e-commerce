// src/components/ProductCard/index.tsx
"use client";

import {useState} from "react";
import {Box, Card, CardContent, Typography, Button} from "@mui/joy";
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
}: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleCardClick = () => {
    window.location.href = `/products/${product.id}`;
  };

  return (
    <Card
      variant="plain"
      className="w-full max-w-[300px] min-w-[250px] h-full p-0 bg-transparent cursor-pointer transition-all duration-300 ease-in-out flex flex-col hover:-translate-y-2 mx-auto"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container dengan fixed height dan aspect ratio */}
      <Box
        className="relative overflow-hidden rounded-xl bg-neutral-50 transition-all duration-300 ease-in-out w-full h-72 flex-shrink-0"
        sx={{
          transform: isHovered ? "scale(1.02)" : "scale(1)",
        }}
      >
        <Box className="relative w-full h-full">
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={mainImage.altText || product.name}
              fill
              className="object-cover object-center transition-opacity duration-300 ease-in-out"
              style={{
                opacity: imageLoaded ? 1 : 0,
              }}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <Box className="w-full h-full bg-neutral-50 flex items-center justify-center">
              <Typography sx={{color: "text.secondary"}}>No Image</Typography>
            </Box>
          )}
        </Box>

        {/* Overlay effect on hover */}
        <Box
          className="absolute inset-0 transition-colors duration-300 ease-in-out"
          sx={{
            bgcolor: isHovered ? alpha("#000", 0.02) : "transparent",
          }}
        />

        {/* Quick View Button (appear on hover) */}
        <Button
          variant="solid"
          size="sm"
          className="absolute bottom-3 left-1/2 rounded-lg font-medium px-3 text-sm whitespace-nowrap transition-all duration-300 ease-in-out"
          sx={{
            transform: isHovered
              ? "translateX(-50%) translateY(0)"
              : "translateX(-50%) translateY(100%)",
            opacity: isHovered ? 1 : 0,
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

      {/* Content Container dengan flex grow untuk konsistensi */}
      <CardContent className="p-4 flex-grow flex flex-col">
        {/* Product Name */}
        <Typography
          level="title-md"
          className="mb-2 font-medium text-gray-900 line-clamp-2 leading-tight text-base transition-colors duration-200 ease-in-out hover:text-blue-600"
        >
          {product.name}
        </Typography>

        {/* Category */}
        {product.category && (
          <Typography
            level="body-xs"
            className="mb-2 text-gray-500 font-normal uppercase tracking-wide text-xs"
          >
            {product.category.name}
          </Typography>
        )}

        {/* Price - selalu di bottom untuk konsistensi */}
        <Typography
          level="body-md"
          className="font-semibold text-gray-900 text-base tracking-tight mt-auto"
        >
          {formatCurrency(lowestPrice)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
