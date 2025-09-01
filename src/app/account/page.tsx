"use client";

import {useState, useEffect} from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Sheet,
  Stack,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemDecorator,
  ListItemContent,
  Chip,
  Alert,
} from "@mui/joy";
import {
  PersonRounded,
  LocationOnRounded,
  ReceiptRounded,
  EmailRounded,
  PhoneRounded,
  ArrowForwardRounded,
} from "@mui/icons-material";
import Link from "next/link";
import {useSession} from "next-auth/react";
import {PageLoader} from "@/components";

const AccountPage = () => {
  const {data: session, status} = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      const {createdAt}: any = session?.user || {};
      setUserData({
        name: session.user.name,
        email: session.user.email,
        phoneNumber: session.user.phoneNumber || "Belum diatur",
        createdAt,
      });
      setLoading(false);
    }
  }, [session]);

  if (status === "loading" || loading) {
    return <PageLoader />;
  }

  if (!session) {
    return (
      <Container maxWidth="md" sx={{py: 4}}>
        <Alert color="warning" sx={{mb: 3}}>
          Silakan login untuk mengakses halaman akun
        </Alert>
        <Button component={Link} href="/sign-in">
          Login
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{py: 4}}>
      {/* Header */}
      <Box sx={{textAlign: "center", mb: 6}}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mx: "auto",
            mb: 2,
            fontSize: "2rem",
          }}
        >
          {session.user?.name?.[0]?.toUpperCase() || "U"}
        </Avatar>
        <Typography level="h2" sx={{mb: 1, fontWeight: 700}}>
          {session.user?.name}
        </Typography>
        <Typography level="body-lg" color="neutral">
          Selamat datang di akun Anda
        </Typography>
      </Box>

      {/* Informasi Akun */}
      <Sheet variant="outlined" sx={{p: 4, borderRadius: "lg", mb: 4}}>
        <Typography level="h4" sx={{mb: 3, fontWeight: 600}}>
          <PersonRounded sx={{mr: 1}} />
          Informasi Akun
        </Typography>

        <Stack spacing={3}>
          <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
            <EmailRounded sx={{color: "neutral.500"}} />
            <Box sx={{flex: 1}}>
              <Typography level="body-sm" fontWeight={600}>
                Email
              </Typography>
              <Typography>{session.user?.email}</Typography>
            </Box>
          </Box>

          <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
            <PhoneRounded sx={{color: "neutral.500"}} />
            <Box sx={{flex: 1}}>
              <Typography level="body-sm" fontWeight={600}>
                Nomor Telepon
              </Typography>
              <Typography>{userData?.phoneNumber}</Typography>
            </Box>
          </Box>

          <Chip
            color="primary"
            variant="soft"
            size="sm"
            sx={{alignSelf: "flex-end", px: 2, py: 1}}
          >
            Member sejak {new Date(userData?.createdAt).getFullYear()}
          </Chip>
        </Stack>
      </Sheet>

      {/* Menu Navigasi */}
      <Sheet variant="outlined" sx={{p: 3, borderRadius: "lg"}}>
        <Typography level="body-md" sx={{mb: 3, fontWeight: 600}}>
          Kelola Akun Anda
        </Typography>

        <List variant="outlined" sx={{borderRadius: "md"}}>
          {/* Menu Alamat */}
          <ListItem
            component={Link}
            href="/account/addresses"
            sx={{
              textDecoration: "none",
              color: "inherit",
              "&:hover": {
                bgcolor: "background.level1",
              },
            }}
          >
            <ListItemDecorator>
              <LocationOnRounded />
            </ListItemDecorator>
            <ListItemContent>
              <Typography fontWeight={600}>Alamat Pengiriman</Typography>
              <Typography level="body-sm">
                Kelola alamat pengiriman Anda
              </Typography>
            </ListItemContent>
            <ArrowForwardRounded />
          </ListItem>

          <Divider />

          {/* Menu Pesanan */}
          <ListItem
            component={Link}
            href="/account/orders"
            sx={{
              textDecoration: "none",
              color: "inherit",
              "&:hover": {
                bgcolor: "background.level1",
              },
            }}
          >
            <ListItemDecorator>
              <ReceiptRounded />
            </ListItemDecorator>
            <ListItemContent>
              <Typography fontWeight={600}>Pesanan Saya</Typography>
              <Typography level="body-sm">
                Lihat riwayat dan status pesanan
              </Typography>
            </ListItemContent>
            <ArrowForwardRounded />
          </ListItem>
        </List>
      </Sheet>

      {/* Quick Actions */}
      <Box sx={{mt: 4, display: "flex", gap: 2, justifyContent: "center"}}>
        <Button
          component={Link}
          href="/products"
          variant="outlined"
          color="neutral"
        >
          Lanjut Berbelanja
        </Button>
        <Button component={Link} href="/" variant="solid" color="neutral">
          Kembali ke Beranda
        </Button>
      </Box>
    </Container>
  );
};

export default AccountPage;
