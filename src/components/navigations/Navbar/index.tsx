"use client";

import {StoreLogo, StyledInput} from "@/components";
import {
  MenuRounded,
  PersonRounded,
  SearchRounded,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import {Box, Container, IconButton, Sheet} from "@mui/joy";
import type {FC} from "react";
import SubtitleWithDropdown from "./SubtitleWithDropdown";
import Link from "next/link";
import useMasterData from "@/store/useMasterData";

interface props {}

const Navbar: FC<props> = ({}) => {
  const {categories, collections} = useMasterData();

  return (
    <Sheet
      sx={{
        py: 1.5,
        px: {xs: 2, sm: 4},
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.body",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/" style={{alignSelf: "center"}}>
          <StoreLogo />
        </Link>

        {/* Desktop Navigation */}
        <Box sx={{display: {xs: "none", md: "flex"}, gap: 3}}>
          <SubtitleWithDropdown
            title="Kategori"
            items={categories}
            sx={{fontWeight: 500}}
          />
          <SubtitleWithDropdown
            title="Koleksi"
            items={collections}
            sx={{fontWeight: 500}}
          />
        </Box>

        {/* Search Bar - Desktop */}
        <Box
          sx={{
            display: {xs: "none", md: "flex"},
            flex: 1,
            maxWidth: 400,
            mx: 2,
          }}
        >
          <StyledInput
            placeholder="Cari produk..."
            fullWidth
            startDecorator={<SearchRounded />}
            sx={{
              bgcolor: "background.level1",
              borderRadius: "xl",
            }}
            onChange={() => {}}
          />
        </Box>

        {/* Mobile Menu Button */}
        <IconButton
          variant="plain"
          color="neutral"
          sx={{display: {xs: "inline-flex", md: "none"}}}
        >
          <MenuRounded />
        </IconButton>

        {/* Desktop Icons */}
        <Box sx={{display: {xs: "none", md: "flex"}, gap: 1}}>
          <Link href="/cart">
            <IconButton variant="plain" color="neutral">
              <ShoppingCartOutlined />
            </IconButton>
          </Link>
          <Link href="/profile">
            <IconButton variant="plain" color="neutral">
              <PersonRounded />
            </IconButton>
          </Link>
        </Box>
      </Container>
    </Sheet>
  );
};

export default Navbar;
