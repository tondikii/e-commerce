"use client";
import type {FC} from "react";

import {Grid, Stack} from "@mui/joy";
import {StyledButton, Text, TextSecondary, Title} from "@/components";
import Link from "next/link";

interface Props {}

const Banner: FC<Props> = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center h-screen w-screen bg-primary justify-center">
      <Grid
        container
        sx={{backgroundColor: "#F2F0F1", width: "100%", height: "100vh"}}
      >
        <Grid
          xs={12}
          md={6}
          height={{xs: "50vh", md: "100vh"}}
          sx={{display: "flex", alignItems: "center"}}
        >
          <Stack
            sx={{
              width: "100%",
              alignItems: "center",
              zIndex: 2,
              textAlign: "center",
            }}
            padding={{xs: 4, md: 8, lg: 16}}
            spacing={4}
          >
            <Title
              sx={{
                fontFamily: "Staatliches, sans-serif",
                fontWeight: 400,
              }}
              fontSize={{xs: 36, md: 60, lg: 72}}
            >
              TEMUKAN FASHION YANG COCOK DENGAN GAYA MU
            </Title>
            <TextSecondary>
              Jelajahi berbagai macam koleksi pakaian kami yang dibuat dengan
              cermat, yang dirancang untuk menonjolkan individualitas Anda dan
              memenuhi selera gaya Anda.
            </TextSecondary>
            <Link href="/products">
              <StyledButton
                size="lg"
                sx={{
                  borderRadius: "3rem",
                  py: 3,
                  px: 6,
                  "&:hover": {
                    backgroundColor: "#212b36",
                  },
                  bgcolor: "#212b36",
                  color: "#ffffff",
                }}
              >
                <Text level="body-lg" sx={{fontWeight: 300, color: "#ffffff"}}>
                  Belanja Sekarang
                </Text>
              </StyledButton>
            </Link>
          </Stack>
        </Grid>
        <Grid
          xs={12}
          md={6}
          height={{xs: "50vh", md: "100vh"}}
          sx={{display: "flex", flex: "end", justifyContent: "center"}}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/banner.png"
            alt="banner"
            className="sm:w-auto md:w-full max-h-full self-end"
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Banner;
