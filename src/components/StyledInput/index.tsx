import {Input} from "@mui/joy";
import {FC} from "react";
import FormControl from "../FormControl";
import {SxProps} from "@mui/joy/styles/types";

interface Props {
  type?: string;
  name?: string;
  label?: string;
  size?: "lg" | "sm" | "md";
  placeholder?: string;
  sx?: SxProps;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  startDecorator?: React.ReactNode;
  errorMessage?: string;
  endDecorator?: React.ReactNode;
}

const customSx = {
  "--Input-focusedInset": "var(--any, )",
  "--Input-focusedThickness": "0rem",
  "&::before": {
    transition: "box-shadow .15s ease-in-out",
  },
  "&:focus-within": {
    borderColor: "black",
  },
};

const StyledInput: FC<Props> = ({
  type,
  name,
  label,
  size = "lg",
  placeholder = "Masukkan di sini...",
  sx = customSx,
  value,
  onChange,
  startDecorator,
  errorMessage,
  endDecorator,
}) => {
  return (
    <FormControl label={label} errorMessage={errorMessage}>
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        sx={sx}
        size={size}
        value={value}
        onChange={onChange}
        startDecorator={startDecorator}
        endDecorator={endDecorator}
      />
    </FormControl>
  );
};
export default StyledInput;
