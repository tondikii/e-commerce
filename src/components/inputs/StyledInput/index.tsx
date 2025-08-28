import {Input, InputProps} from "@mui/joy";
import {FC} from "react";
import FormControl from "../FormControl";

interface Props extends Omit<InputProps, "onChange"> {
  label?: string;
  errorMessage?: string;
  maxLength?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const customSx = {
  "--Input-focusedInset": "var(--any, )",
  "--Input-focusedThickness": "0rem",
  "&::before": {
    transition: "box-shadow .15s ease-in-out",
  },
  "&:focus-within": {
    borderColor: "#212b36",
  },
};

const StyledInput: FC<Props> = ({
  label,
  errorMessage,
  maxLength = 255, // Default maxLength
  onChange,
  size = "md",
  placeholder = "Masukkan di sini...",
  sx,
  required,
  ...inputProps // Spread semua props lainnya dari InputProps
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (maxLength && e.target.value.length > maxLength) {
      e.target.value = e.target.value.slice(0, maxLength);
    }
    onChange(e);
  };

  return (
    <FormControl
      label={label}
      errorMessage={errorMessage}
      size={size}
      required={required}
    >
      <Input
        {...inputProps} // Spread semua props InputProps
        size={size}
        placeholder={placeholder}
        sx={{...customSx, ...sx}}
        onChange={handleChange}
      />
    </FormControl>
  );
};
export default StyledInput;
