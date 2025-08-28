"use client";

import type {FC} from "react";
import {SxProps} from "@mui/joy/styles/types";
import {Staatliches} from "next/font/google";
import {Stack} from "@mui/joy";
import Image from "next/image";
import {Title} from "../..";

const staatliches = Staatliches({
  subsets: ["latin"],
  weight: "400", // Staatliches hanya punya 400
});

interface Props {
  level?: "h1" | "h2" | "h3" | "h4"; // restrict only to valid heading level
  sx?: SxProps;
  textSx?: SxProps;
}

const StoreLogo: FC<Props> = ({level = "h3", sx = {}, textSx = {}}) => {
  return (
    <Stack spacing={0} sx={{flexDirection: "row", alignItems: "center", ...sx}}>
      <Image
        src="/rumah_fashion.svg"
        alt="Logo RUMAH FASHION"
        width={50}
        height={50}
      />
      <Title
        sx={{
          fontFamily: "Staatliches, sans-serif",
          fontWeight: 400,
          mt: 1,
          ...textSx,
        }}
        level={level}
      >
        RUMAH FASHION
      </Title>
    </Stack>
  );
};
export default StoreLogo;
