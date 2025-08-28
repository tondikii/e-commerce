import {InfoOutlined} from "@mui/icons-material";
import {
  FormControl as FormControlMui,
  FormHelperText,
  FormLabel,
} from "@mui/joy";
import type {FC} from "react";

interface Props {
  label?: string;
  children: React.ReactNode;
  errorMessage?: string;
  size?: "lg" | "sm" | "md";
  required?: boolean;
}

const FormControl: FC<Props> = ({
  label,
  children,
  errorMessage,
  size = "md",
  required,
}) => {
  return (
    <FormControlMui
      sx={{flex: 1}}
      error={Boolean(errorMessage)}
      size={size}
      required={required}
    >
      {label ? <FormLabel>{label}</FormLabel> : null}
      {children}
      {errorMessage ? (
        <FormHelperText>
          <InfoOutlined />
          {errorMessage}
        </FormHelperText>
      ) : null}
    </FormControlMui>
  );
};

export default FormControl;
