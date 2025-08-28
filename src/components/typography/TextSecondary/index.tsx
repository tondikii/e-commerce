import type {FC} from "react";
import Text, {TextProps} from "../Text";

const TextSecondary: FC<TextProps> = ({
  level = "body-sm",
  sx = {},
  ...props
}) => {
  return <Text level={level} sx={{color: "#73738C", ...sx}} {...props} />;
};

export default TextSecondary;
