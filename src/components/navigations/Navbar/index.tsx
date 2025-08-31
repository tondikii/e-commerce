"use client";

import {StoreLogo, StyledInput} from "@/components";
import {
  MenuRounded,
  PersonRounded,
  SearchRounded,
  ShoppingCartOutlined,
  LogoutRounded,
  LocationOnRounded,
  ReceiptRounded,
  CloseRounded,
} from "@mui/icons-material";
import {
  Box,
  Container,
  IconButton,
  Sheet,
  Menu,
  MenuItem,
  ListItemDecorator,
  Divider,
  Drawer,
  Typography,
  Input,
  Button,
} from "@mui/joy";
import type {FC} from "react";
import SubtitleWithDropdown from "./SubtitleWithDropdown";
import Link from "next/link";
import useMasterData from "@/store/useMasterData";
import {signOut, useSession} from "next-auth/react";
import {useState, useEffect, useCallback} from "react";
import {useRouter, useSearchParams} from "next/navigation";

interface Props {}

const Navbar: FC<Props> = ({}) => {
  const {categories, collections} = useMasterData();
  const {data: session} = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  // Handle search when debounced value changes
  useEffect(() => {
    if (debouncedSearch) {
      router.push(`/products?search=${encodeURIComponent(debouncedSearch)}`);
    }
  }, [debouncedSearch, router]);

  // Set initial search value from URL
  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setSearchValue(search);
    }
  }, [searchParams]);

  const handleAccountClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    handleCloseMenu();
    signOut({
      callbackUrl: "/sign-in",
    });
  };

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/products?search=${encodeURIComponent(searchValue.trim())}`);
  };

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
        {/* Logo */}
        <Link href="/" style={{alignSelf: "center"}}>
          <StoreLogo />
        </Link>

        {/* Desktop Navigation */}
        <Box sx={{display: {xs: "none", md: "flex"}, gap: 3}}>
          <SubtitleWithDropdown
            title="Kategori"
            items={categories}
            sx={{fontWeight: 500}}
            searchParams="category"
          />
          <SubtitleWithDropdown
            title="Koleksi"
            items={collections}
            sx={{fontWeight: 500}}
            searchParams="collection"
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
          <form onSubmit={handleSearchSubmit} style={{width: "100%"}}>
            <StyledInput
              placeholder="Cari produk..."
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              fullWidth
              startDecorator={<SearchRounded />}
              sx={{
                bgcolor: "background.level1",
                borderRadius: "xl",
              }}
            />
          </form>
        </Box>

        {/* Mobile Menu Button */}
        <IconButton
          variant="plain"
          color="neutral"
          sx={{display: {xs: "inline-flex", md: "none"}}}
          onClick={handleMobileToggle}
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

          {/* Account Menu - Conditional based on auth status */}
          <IconButton
            variant="plain"
            color="neutral"
            onClick={handleAccountClick}
          >
            <PersonRounded />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            placement="bottom-end"
          >
            {session ? (
              [
                <MenuItem key="account" onClick={handleCloseMenu}>
                  <ListItemDecorator>
                    <PersonRounded />
                  </ListItemDecorator>
                  <Link
                    href="/account"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      width: "100%",
                    }}
                  >
                    Akun Saya
                  </Link>
                </MenuItem>,
                <MenuItem key="addresses" onClick={handleCloseMenu}>
                  <ListItemDecorator>
                    <LocationOnRounded />
                  </ListItemDecorator>
                  <Link
                    href="/account/addresses"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      width: "100%",
                    }}
                  >
                    Alamat
                  </Link>
                </MenuItem>,
                <MenuItem key="orders" onClick={handleCloseMenu}>
                  <ListItemDecorator>
                    <ReceiptRounded />
                  </ListItemDecorator>
                  <Link
                    href="/account/orders"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      width: "100%",
                    }}
                  >
                    Pesanan
                  </Link>
                </MenuItem>,
                <Divider key="divider" />,
                <MenuItem key="logout" onClick={handleSignOut}>
                  <ListItemDecorator>
                    <LogoutRounded />
                  </ListItemDecorator>
                  Logout
                </MenuItem>,
              ]
            ) : (
              <MenuItem onClick={handleCloseMenu}>
                <ListItemDecorator>
                  <PersonRounded />
                </ListItemDecorator>
                <Link
                  href="/sign-in"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    width: "100%",
                  }}
                >
                  Login
                </Link>
              </MenuItem>
            )}
          </Menu>
        </Box>

        {/* Mobile Drawer */}
        <Drawer
          open={mobileOpen}
          onClose={handleMobileToggle}
          anchor="right"
          size="sm"
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography level="h4">Menu</Typography>
            <IconButton onClick={handleMobileToggle}>
              <CloseRounded />
            </IconButton>
          </Box>

          <Divider />

          {/* Mobile Search */}
          <Box sx={{p: 2}}>
            <form onSubmit={handleSearchSubmit}>
              <Input
                placeholder="Cari produk..."
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                fullWidth
                startDecorator={<SearchRounded />}
                sx={{mb: 2}}
              />
            </form>
          </Box>

          <Divider />

          {/* Mobile Navigation */}
          <Box sx={{p: 2}}>
            <Typography level="title-sm" sx={{mb: 1, fontWeight: 600}}>
              Kategori
            </Typography>
            <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
              {categories.map((category: any) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  style={{textDecoration: "none"}}
                  onClick={handleMobileToggle}
                >
                  <Button
                    variant="plain"
                    fullWidth
                    sx={{justifyContent: "start"}}
                  >
                    {category.name}
                  </Button>
                </Link>
              ))}
            </Box>

            <Typography level="title-sm" sx={{mt: 2, mb: 1, fontWeight: 600}}>
              Koleksi
            </Typography>
            <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
              {collections.map((collection: any) => (
                <Link
                  key={collection.id}
                  href={`/products?collection=${collection.id}`}
                  style={{textDecoration: "none"}}
                  onClick={handleMobileToggle}
                >
                  <Button
                    variant="plain"
                    fullWidth
                    sx={{justifyContent: "start"}}
                  >
                    {collection.name}
                  </Button>
                </Link>
              ))}
            </Box>
          </Box>

          <Divider />

          {/* Mobile Account Menu */}
          <Box sx={{p: 2}}>
            {session ? (
              <>
                <Typography level="title-sm" sx={{mb: 1, fontWeight: 600}}>
                  Akun Saya
                </Typography>
                <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
                  <Link
                    href="/account"
                    style={{textDecoration: "none"}}
                    onClick={handleMobileToggle}
                  >
                    <Button
                      variant="plain"
                      fullWidth
                      sx={{justifyContent: "start"}}
                      startDecorator={<PersonRounded />}
                    >
                      Profil
                    </Button>
                  </Link>
                  <Link
                    href="/account/addresses"
                    style={{textDecoration: "none"}}
                    onClick={handleMobileToggle}
                  >
                    <Button
                      variant="plain"
                      fullWidth
                      sx={{justifyContent: "start"}}
                      startDecorator={<LocationOnRounded />}
                    >
                      Alamat
                    </Button>
                  </Link>
                  <Link
                    href="/account/orders"
                    style={{textDecoration: "none"}}
                    onClick={handleMobileToggle}
                  >
                    <Button
                      variant="plain"
                      fullWidth
                      sx={{justifyContent: "start"}}
                      startDecorator={<ReceiptRounded />}
                    >
                      Pesanan
                    </Button>
                  </Link>
                  <Button
                    variant="plain"
                    fullWidth
                    sx={{justifyContent: "start"}}
                    startDecorator={<LogoutRounded />}
                    onClick={handleSignOut}
                  >
                    Logout
                  </Button>
                </Box>
              </>
            ) : (
              <Link
                href="/sign-in"
                style={{textDecoration: "none"}}
                onClick={handleMobileToggle}
              >
                <Button
                  variant="solid"
                  fullWidth
                  startDecorator={<PersonRounded />}
                >
                  Login
                </Button>
              </Link>
            )}
          </Box>

          <Divider />

          {/* Mobile Cart */}
          <Box sx={{p: 2}}>
            <Link
              href="/cart"
              style={{textDecoration: "none"}}
              onClick={handleMobileToggle}
            >
              <Button
                variant="outlined"
                fullWidth
                startDecorator={<ShoppingCartOutlined />}
              >
                Keranjang Belanja
              </Button>
            </Link>
          </Box>
        </Drawer>
      </Container>
    </Sheet>
  );
};

export default Navbar;
