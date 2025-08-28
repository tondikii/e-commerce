import type {FC, ReactNode} from "react";
import {Typography, TypographyProps} from "@mui/joy";

export interface TextProps extends TypographyProps {
  children: string | ReactNode;
}

const customSx = {color: "var(--joy-palette-text-primary)"};

const Text: FC<TextProps> = ({children, level = "body-sm", ...props}) => {
  return (
    <Typography level={level} sx={{...customSx, ...props.sx}} {...props}>
      {children}
    </Typography>
  );
};

export default Text;
