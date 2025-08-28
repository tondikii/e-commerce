"use client";
import {Navbar} from "@/components";
import {Box} from "@mui/joy";
import {usePathname} from "next/navigation";
import type {FC, ReactNode} from "react";

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({children}) => {
  const pathname = usePathname();

  if (pathname === "/sign-in") {
    return <>{children}</>;
  }

  return (
    <Box sx={{display: "flex", flexDirection: "column", minHeight: "100dvh"}}>
      <Navbar />
      {children}
    </Box>
  );
};
export default Layout;
