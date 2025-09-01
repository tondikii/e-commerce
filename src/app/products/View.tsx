"use client";

import type {FC} from "react";
import {useState, useEffect, useCallback, useMemo} from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Drawer,
  Button,
  FormLabel,
  RadioGroup,
  Radio,
  Checkbox,
  IconButton,
  Sheet,
  Stack,
  Chip,
} from "@mui/joy";
import {FilterAltRounded, CloseRounded} from "@mui/icons-material";
import {PageLoader, ProductCard, TextSecondary} from "@/components";
import {useFetch} from "@/hooks";
import {Product, Category, Collection} from "@prisma/client";
import {useRouter, useSearchParams} from "next/navigation";
import {formatCurrency} from "@/utils";

interface ProductWithRelations extends Product {
  category: Category | null;
  collection: Collection | null;
  images: any[];
  variants: any[];
  reviews: any[];
}

const ProductsPageView: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<
    ProductWithRelations[]
  >([]);

  // State untuk filter - langsung dari URL params
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [searchQuery, setSearchQuery] = useState("");

  // Parse query parameters dari URL hanya sekali pada initial load
  useEffect(() => {
    const categoryParams =
      searchParams.get("category")?.split(",").filter(Boolean) || [];
    const collectionParams =
      searchParams.get("collection")?.split(",").filter(Boolean) || [];
    const minPrice = searchParams.get("minPrice")
      ? parseInt(searchParams.get("minPrice")!)
      : 0;
    const maxPrice = searchParams.get("maxPrice")
      ? parseInt(searchParams.get("maxPrice")!)
      : 10000000;
    const sort = searchParams.get("sort") || "newest";
    const search = searchParams.get("search") || "";

    setSelectedCategories(categoryParams);
    setSelectedCollections(collectionParams);
    setPriceRange([minPrice, maxPrice]);
    setSortBy(sort);
    setSearchQuery(search);
  }, [searchParams]); // Hanya depend on searchParams

  // Build query parameters untuk API menggunakan useMemo
  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};

    if (selectedCategories.length > 0) {
      params.category = selectedCategories.join(",");
    }

    if (selectedCollections.length > 0) {
      params.collection = selectedCollections.join(",");
    }

    if (priceRange[0] > 0) {
      params.minPrice = priceRange[0].toString();
    }

    if (priceRange[1] < 10000000) {
      params.maxPrice = priceRange[1].toString();
    }

    if (searchQuery) {
      params.search = searchQuery;
    }

    params.sort = sortBy;

    return params;
  }, [
    selectedCategories,
    selectedCollections,
    priceRange,
    searchQuery,
    sortBy,
  ]);

  // Fetch data dengan query parameters
  const {data: productsData, loading: productsLoading}: any = useFetch(
    "/products",
    {queryParams}
  );

  const {data: categoriesData}: any = useFetch("/categories");
  const {data: collectionsData}: any = useFetch("/collections");

  // Set filtered products dari API
  useEffect(() => {
    if (productsData) {
      setFilteredProducts(productsData);
    }
  }, [productsData]);

  // Handler functions dengan useCallback
  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  const handleCollectionChange = useCallback((collectionId: string) => {
    setSelectedCollections((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedCollections([]);
    setPriceRange([0, 10000000]);
    setSortBy("newest");
    setSearchQuery("");

    // Redirect ke URL tanpa parameters
    router.replace("/products", {scroll: false});
  }, [router]);

  const hasActiveFilters = useMemo(
    () =>
      selectedCategories.length > 0 ||
      selectedCollections.length > 0 ||
      priceRange[0] > 0 ||
      priceRange[1] < 10000000 ||
      searchQuery ||
      sortBy !== "newest",
    [selectedCategories, selectedCollections, priceRange, searchQuery, sortBy]
  );

  // Update URL ketika filter berubah - tanpa menyebabkan re-render loop
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","));
    }

    if (selectedCollections.length > 0) {
      params.set("collection", selectedCollections.join(","));
    }

    if (priceRange[0] > 0) {
      params.set("minPrice", priceRange[0].toString());
    }

    if (priceRange[1] < 10000000) {
      params.set("maxPrice", priceRange[1].toString());
    }

    if (searchQuery) {
      params.set("search", searchQuery);
    }

    params.set("sort", sortBy);

    // Only update URL if it's different from current
    const currentUrl = `?${searchParams.toString()}`;
    const newUrl = `?${params.toString()}`;

    if (currentUrl !== newUrl) {
      router.replace(`/products?${params.toString()}`, {scroll: false});
    }
  }, [
    selectedCategories,
    selectedCollections,
    priceRange,
    sortBy,
    searchQuery,
    router,
    searchParams,
  ]);

  if (productsLoading) {
    return <PageLoader />;
  }

  return (
    <Box
      sx={{
        py: 4,
        px: {xs: 2, md: 4},
        minHeight: "100vh",
        bgcolor: "background.body",
      }}
    >
      <Container maxWidth="xl">
        {/* Header dengan Search */}
        <Box sx={{mb: 4}}>
          {/* Filter Bar */}
          <Sheet
            sx={{
              p: 3,
              borderRadius: "xl",
              bgcolor: "background.surface",
              mb: 3,
              boxShadow: "sm",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              {/* Left side - Filter button and Sort options */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="outlined"
                  startDecorator={<FilterAltRounded />}
                  onClick={() => setMobileFiltersOpen(true)}
                  sx={{
                    display: {xs: "flex", md: "none"},
                    borderRadius: "lg",
                    fontWeight: 600,
                  }}
                  color="neutral"
                >
                  Filter
                </Button>

                <Typography
                  level="body-sm"
                  sx={{
                    display: {xs: "none", md: "block"},
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  Urutkan:
                </Typography>

                <RadioGroup
                  orientation="horizontal"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{gap: 2}}
                >
                  <Radio
                    value="newest"
                    label="Terbaru"
                    sx={{
                      "& .MuiRadio-label": {
                        fontSize: "0.875rem",
                        fontWeight: 500,
                      },
                    }}
                    color="neutral"
                  />
                  <Radio
                    value="price-low"
                    label="Harga Terendah"
                    sx={{
                      "& .MuiRadio-label": {
                        fontSize: "0.875rem",
                        fontWeight: 500,
                      },
                    }}
                    color="neutral"
                  />
                  <Radio
                    value="price-high"
                    label="Harga Tertinggi"
                    sx={{
                      "& .MuiRadio-label": {
                        fontSize: "0.875rem",
                        fontWeight: 500,
                      },
                    }}
                    color="neutral"
                  />
                </RadioGroup>
              </Box>

              {/* Right side - Clear filters button */}
              {hasActiveFilters && (
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  color="neutral"
                  sx={{
                    borderRadius: "lg",
                    fontWeight: 600,
                    borderWidth: "2px",
                    "&:hover": {
                      borderWidth: "2px",
                      bgcolor: "neutral.100",
                    },
                  }}
                >
                  Hapus Filter
                </Button>
              )}
            </Box>

            {/* Active Filters Chips */}
            {(selectedCategories.length > 0 ||
              selectedCollections.length > 0) && (
              <Box sx={{mt: 2, display: "flex", gap: 1, flexWrap: "wrap"}}>
                {selectedCategories.map((categoryId) => {
                  const category = categoriesData?.find(
                    (c: any) => c.id === categoryId
                  );
                  return category ? (
                    <Chip
                      key={categoryId}
                      variant="soft"
                      color="neutral"
                      onClick={() => handleCategoryChange(categoryId)}
                      sx={{
                        borderRadius: "lg",
                        fontWeight: 600,
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: "neutral.300",
                        },
                      }}
                    >
                      {category.name}
                      <CloseRounded sx={{ml: 0.5, fontSize: "1rem"}} />
                    </Chip>
                  ) : null;
                })}
                {selectedCollections.map((collectionId) => {
                  const collection = collectionsData?.find(
                    (c: any) => c.id === collectionId
                  );
                  return collection ? (
                    <Chip
                      key={collectionId}
                      variant="soft"
                      color="neutral"
                      onClick={() => handleCollectionChange(collectionId)}
                      sx={{
                        borderRadius: "lg",
                        fontWeight: 600,
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: "neutral.300",
                        },
                      }}
                    >
                      {collection.name}
                      <CloseRounded sx={{ml: 0.5, fontSize: "1rem"}} />
                    </Chip>
                  ) : null;
                })}
              </Box>
            )}
          </Sheet>
        </Box>

        <Grid container spacing={4}>
          {/* Sidebar Filters - Desktop */}
          <Grid xs={12} md={3} sx={{display: {xs: "none", md: "block"}}}>
            <Sheet
              sx={{
                p: 3,
                borderRadius: "xl",
                position: "sticky",
                top: 120,
                bgcolor: "background.surface",
                boxShadow: "sm",
              }}
            >
              <Typography level="h4" sx={{mb: 3, fontWeight: 600}}>
                Filter Produk
              </Typography>

              {/* Categories Filter */}
              <Box sx={{mb: 3}}>
                <FormLabel sx={{mb: 1, fontWeight: 600}}>Kategori</FormLabel>
                <Stack spacing={1}>
                  {categoriesData?.map((category: any) => (
                    <Checkbox
                      key={category.id}
                      label={category.name}
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      sx={{"& .MuiCheckbox-label": {fontSize: "0.9rem"}}}
                      color="neutral"
                    />
                  ))}
                </Stack>
              </Box>

              {/* Collections Filter */}
              <Box sx={{mb: 3}}>
                <FormLabel sx={{mb: 1, fontWeight: 600}}>Koleksi</FormLabel>
                <Stack spacing={1}>
                  {collectionsData?.map((collection: any) => (
                    <Checkbox
                      key={collection.id}
                      label={collection.name}
                      checked={selectedCollections.includes(collection.id)}
                      onChange={() => handleCollectionChange(collection.id)}
                      sx={{"& .MuiCheckbox-label": {fontSize: "0.9rem"}}}
                      color="neutral"
                    />
                  ))}
                </Stack>
              </Box>

              <Button
                variant="outlined"
                onClick={clearFilters}
                fullWidth
                sx={{borderRadius: "lg"}}
                color="neutral"
              >
                Hapus Semua Filter
              </Button>
            </Sheet>
          </Grid>

          {/* Products Grid */}
          <Grid xs={12} md={9}>
            {/* Results Count */}
            <TextSecondary sx={{mb: 3}}>
              Menampilkan {filteredProducts.length} produk
              {hasActiveFilters && " yang sesuai dengan filter"}
            </TextSecondary>

            <Grid container spacing={3}>
              {filteredProducts.map((product) => {
                const lowestPrice = Math.min(
                  ...product.variants.map((v: any) => v.price)
                );
                const mainImage = product.images?.[0];

                return (
                  <Grid key={product.id} xs={12} sm={6} lg={4}>
                    <ProductCard
                      product={product}
                      lowestPrice={lowestPrice}
                      mainImage={mainImage}
                      formatCurrency={formatCurrency}
                    />
                  </Grid>
                );
              })}
            </Grid>

            {filteredProducts.length === 0 && (
              <Box sx={{textAlign: "center", py: 8}}>
                <Box sx={{mb: 3}}>
                  <Typography level="h4" sx={{mb: 1, fontWeight: 600}}>
                    Produk tidak ditemukan
                  </Typography>
                  <Typography level="body-md" sx={{color: "text.secondary"}}>
                    Coba ubah filter atau hapus beberapa filter untuk melihat
                    lebih banyak produk.
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  size="lg"
                  sx={{borderRadius: "lg"}}
                  color="neutral"
                >
                  Hapus Semua Filter
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>

        {/* Mobile Filters Drawer */}
        <Drawer
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          anchor="right"
          size="md"
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography level="h4">Filter Produk</Typography>
            <IconButton
              onClick={() => setMobileFiltersOpen(false)}
              variant="plain"
              color="neutral"
            >
              <CloseRounded />
            </IconButton>
          </Box>

          <Box sx={{p: 3}}>
            {/* Categories Filter */}
            <Box sx={{mb: 3}}>
              <FormLabel sx={{mb: 1, fontWeight: 600}}>Kategori</FormLabel>
              <Stack spacing={1}>
                {categoriesData?.map((category: any) => (
                  <Checkbox
                    key={category.id}
                    label={category.name}
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    color="neutral"
                  />
                ))}
              </Stack>
            </Box>

            {/* Collections Filter */}
            <Box sx={{mb: 3}}>
              <FormLabel sx={{mb: 1, fontWeight: 600}}>Koleksi</FormLabel>
              <Stack spacing={1}>
                {collectionsData?.map((collection: any) => (
                  <Checkbox
                    key={collection.id}
                    label={collection.name}
                    checked={selectedCollections.includes(collection.id)}
                    onChange={() => handleCollectionChange(collection.id)}
                    color="neutral"
                  />
                ))}
              </Stack>
            </Box>

            <Button
              fullWidth
              onClick={() => setMobileFiltersOpen(false)}
              sx={{mb: 2, borderRadius: "lg"}}
              size="lg"
              color="neutral"
            >
              Terapkan Filter
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={clearFilters}
              sx={{borderRadius: "lg"}}
              color="neutral"
            >
              Hapus Filter
            </Button>
          </Box>
        </Drawer>
      </Container>
    </Box>
  );
};

export default ProductsPageView;
