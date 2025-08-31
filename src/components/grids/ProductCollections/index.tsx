"use client";

import type {FC} from "react";
import {Box, Grid, Typography, Button} from "@mui/joy";
import {ChevronRightRounded} from "@mui/icons-material";
import Link from "next/link";
import {Collections} from "@/types";
import {ProductCard} from "@/components";
import {formatCurrency} from "@/utils";

interface ProductCollectionsProps {
  collections: Collections;
}

const ProductCollections: FC<ProductCollectionsProps> = ({collections}) => {
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
                  fontSize={{xs: 24, md: 36, lg: 48}}
                  sx={{fontWeight: 700}}
                >
                  {collection.name.toUpperCase()}
                </Typography>
                <Link href={`/products/?collection=${collection.id}`}>
                  <Button
                    variant="outlined"
                    endDecorator={<ChevronRightRounded />}
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
                </Link>
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

export default ProductCollections;
