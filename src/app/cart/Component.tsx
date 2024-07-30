"use client";
import {type FC} from "react";
import {Button} from "@mui/joy";
import {signOut} from "next-auth/react";
import {useRouter} from "next/navigation";

interface Props {
  name?: string;
}

const Component: FC<Props> = ({name}) => {
  const router = useRouter();
  const handleSignOut = () => {
    signOut({
      callbackUrl: "/sign-in",
    });
  };

  const navigateToSignIn = () => {
    router.push("/sign-in");
  };

  if (!name) {
    return (
      <>
        <span>
          tolong masuk terlebih dahulu untuk membuka halaman keranjang.
        </span>
        <Button color="neutral" onClick={navigateToSignIn}>
          Masuk
        </Button>
      </>
    );
  }

  return (
    <>
      <span>Halaman Keranjang {name}</span>
      <Button color="danger" onClick={handleSignOut}>
        Keluar
      </Button>
    </>
  );
};
export default Component;
