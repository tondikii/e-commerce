import type {FC} from "react";
import {Button} from "@mui/joy";
import {SxProps} from "@mui/joy/styles/types";

interface Props {
  sx?: SxProps;
  children: string | JSX.Element;
  size?: "lg" | "sm" | "md";
  type?: string;
}

const customSx = {
  bgcolor: "black",
  width: "100%",
  borderRadius: "2rem",
  marginTop: "2rem",
  paddingY: "1rem",
  fontWeight: 300,
  "&:hover": {
    backgroundColor: "black",
  },
};

const StyledButton: FC<Props> = ({
  sx = customSx,
  children,
  type,
  size = "lg",
}) => {
  return (
    <Button size={size} sx={sx} type={type}>
      {children}
    </Button>
  );
};
export default StyledButton;
