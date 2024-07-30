import type {FC} from "react";

import styles from "./styles.module.css";
import clsx from "clsx";

interface Props {
  children: React.ReactNode;
}

const Banner: FC<Props> = ({children}) => {
  return (
    <div
      className={clsx(
        "flex flex-row items-center min-height-screen min-width-screen",
        styles.backgroundImage
      )}
    >
      <span className="text-4xl font-montserrat font-black absolute top-4 left-4">
        TokoTrend
      </span>
      <div className="w-1/2">{children}</div>
    </div>
  );
};

export default Banner;
