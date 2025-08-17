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
  maxLength?: number;
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
  maxLength = 255, // Default max length
}) => {

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (maxLength && e.target.value.length > maxLength) {
      e.target.value = e.target.value.slice(0, maxLength);
    }
    onChange(e);
  }

  return (
    <FormControl label={label} errorMessage={errorMessage}>
      <Textarea
        name={name}
        placeholder={placeholder}
        sx={sx}
        size={size}
        value={value}
        onChange={handleChange}
        minRows={minRows}
      />
    </FormControl>
  );
};
export default StyledTextarea;
