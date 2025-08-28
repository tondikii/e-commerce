import {Button, ButtonProps} from "@mui/joy";
import type {FC} from "react";

const customSx = {
  "&:hover": {
    backgroundColor: "#212b36",
  },
  bgcolor: "#212b36",
  fontWeight: 700,
  color: "#ffffff",
};

const StyledButton: FC<ButtonProps> = ({
  size = "md",
  variant = "solid",
  ...props
}) => {
  return <Button sx={{...customSx, ...props.sx}} {...props} />;
};
export default StyledButton;
