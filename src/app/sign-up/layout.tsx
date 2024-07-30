import type {FC} from "react";
import {Banner} from "@/components";

interface Props {
  children: React.ReactNode;
}

const AuthLayout: FC<Props> = ({children}) => {
  return <Banner>{children}</Banner>;
};
export default AuthLayout;
