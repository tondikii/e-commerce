// pages/index.tsx
"use client";
import type {FC} from "react";
import {Collection} from "@prisma/client";
import {BannerHome, ProductCollections} from "@/components";
import {useFetch} from "@/hooks";
import {Box, CircularProgress} from "@mui/joy";

interface Props {}

const HomePage: FC<Props> = ({}) => {
  const {
    data: collections,
    loading,
  }: {
    data: null | {collections: Collection[]};
    loading: boolean;
  } = useFetch("/collections/with-products");

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <BannerHome />
      {collections && <ProductCollections collections={collections} />}
    </>
  );
};

export default HomePage;
