import type {FC} from "react";
import Text, {TextProps} from "../Text";

const customSx = {
  fontWeight: 600,
};

const Title: FC<TextProps> = ({level = "h4", ...props}) => {
  return <Text level={level} sx={{...customSx, ...props.sx}} {...props} />;
};

export default Title;
