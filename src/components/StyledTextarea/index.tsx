import {Textarea} from "@mui/joy";
import {SxProps} from "@mui/joy/styles/types";
import {FC} from "react";
import FormControl from "../FormControl";

interface Props {
  name: string;
  label?: string;
  size?: "lg" | "sm" | "md";
  placeholder?: string;
  sx?: SxProps;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  errorMessage?: string;
  minRows?: number;
}

const customSx = {
  "--Textarea-focusedInset": "var(--any, )",
  "--Textarea-focusedThickness": "0rem",
  "&::before": {
    transition: "box-shadow .15s ease-in-out",
  },
  "&:focus-within": {
    borderColor: "black",
  },
};

const StyledTextarea: FC<Props> = ({
  name,
  label,
  size = "lg",
  placeholder = "Masukkan di sini...",
  sx = customSx,
  value,
  onChange,
  errorMessage,
  minRows = 2,
}) => {
  return (
    <FormControl label={label} errorMessage={errorMessage}>
      <Textarea
        name={name}
        placeholder={placeholder}
        sx={sx}
        size={size}
        value={value}
        onChange={onChange}
        minRows={minRows}
      />
    </FormControl>
  );
};
export default StyledTextarea;
