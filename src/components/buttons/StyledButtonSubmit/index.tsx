import type {FC} from "react";
import {Button, CircularProgress} from "@mui/joy";
import {SxProps} from "@mui/joy/styles/types";

interface Props {
  sx?: SxProps;
  children: string | React.ReactNode;
  size?: "lg" | "sm" | "md";
  type?: string;
  loading?: boolean;
  disabled?: boolean;
}

const customSx = {
  bgcolor: "#212b36",
  width: "100%",
  borderRadius: "2rem",
  fontWeight: 300,
  "&:hover": {
    backgroundColor: "#212b36",
  },
};

const StyledButtonSubmit: FC<Props> = ({
  sx = customSx,
  children,
  type = "submit",
  size = "lg",
  loading,
  disabled,
}) => {
  let usedSx: SxProps = sx ? {...sx} : {...customSx};

  if (disabled || loading) {
    usedSx = {...usedSx, cursor: "not-allowed", border: "1px solid #212b36"};
  }

  return (
    <Button
      size={size}
      sx={usedSx}
      type={type}
      loading={loading}
      loadingPosition="end"
      loadingIndicator={<CircularProgress color="neutral" />}
      disabled={disabled || loading}
    >
      {children}
    </Button>
  );
};
export default StyledButtonSubmit;
