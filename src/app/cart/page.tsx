import {FC} from "react";
import Component from "./Component";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";

interface Props {}

const CartPage: FC<Props> = async ({}) => {
  const session = await getServerSession(authOptions);
  const name: string = session?.user?.name || "";

  return <Component name={name} />;
};
export default CartPage;
