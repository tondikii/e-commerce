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
}

const FormControl: FC<Props> = ({label, children, errorMessage}) => {
  return (
    <FormControlMui sx={{marginTop: "1rem"}} error={Boolean(errorMessage)}>
      {label ? (
        <FormLabel sx={{fontSize: "1.125rem", lineHeight: "1.75rem"}}>
          {label}
        </FormLabel>
      ) : null}
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
