import type {FC} from "react";
import {TextProps} from "../Text";
import Title from "../Title";

const Subtitle: FC<TextProps> = ({level = "title-lg", ...textProps}) => {
  return <Title level={level} {...textProps} />;
};

export default Subtitle;
