"use client";
import type {FC} from "react";

import {Stack} from "@mui/joy";

interface Props {
  children: React.ReactNode;
}

const AuthContainer: FC<Props> = ({children}) => {
  return (
    <div className="flex flex-col lg:flex-row items-center h-screen w-screen bg-primary justify-center">
      <Stack
        width={{xs: "100%", lg: "50%"}}
        sx={{alignItems: "center", zIndex: 2}}
        padding={{xs: 4, md: 16, lg: 24}}
        spacing={2}
      >
        {children}
      </Stack>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/banner.png"
        alt="banner"
        className="hidden md:block absolute h-1/4 lg:w-1/2 lg:h-auto lg:static left-0 bottom-0 self-end"
      />
    </div>
  );
};

export default AuthContainer;
