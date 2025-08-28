"use client";

import {FC} from "react";
import {SessionType} from "@/types";
import Image from "next/image";
import {Typography} from "@mui/joy";
import Link from "next/link";
interface Props {
  session: SessionType;
}

// eslint-disable-next-line @next/next/no-async-client-component
const NotFoundPage: FC<Props> = ({session}) => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center pb-8">
      <Image
        src="/page_error.svg"
        alt="Halaman tidak ditemukan"
        priority
        className="w-3/4 md:1/2 lg:w-2/5 mb-4"
        width={0}
        height={0}
      />
      <Typography level="title-lg" color="neutral" sx={{marginBottom: 8}}>
        Halaman tidak tersedia{" "}
        <Link href={"/"} color="neutral" className="underline">
          klik di sini
        </Link>{" "}
        untuk kembali ke halaman home
      </Typography>
    </div>
  );
};

export default NotFoundPage;
