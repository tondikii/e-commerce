"use client";
import {getPasswordStrength} from "@/utils";
import {LinearProgress, Typography} from "@mui/joy";
import {useEffect, type FC} from "react";
import {HtmlTooltip} from "../";
import {InfoOutlined, CheckCircle, Cancel} from "@mui/icons-material";

interface Props {
  password: string;
  setIsStrong: (isStrong: boolean) => void;
}

const PasswordMeter: FC<Props> = ({password, setIsStrong}) => {
  const {label, value, color, isStrong} = getPasswordStrength(password);

  useEffect(() => {
    setIsStrong(isStrong);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStrong]);

  const renderIndicatorIcon = () => {
    const sx = {color, fontSize: "1rem"};
    if (isStrong) {
      return <CheckCircle sx={sx} />;
    }
    return <Cancel sx={sx} />;
  };

  return (
    <div className="flex flex-row w-full justify-between items-center mt-2">
      <div className="flex flex-col w-094">
        <LinearProgress
          determinate
          value={value}
          sx={{
            bgcolor: "background.level3",
            color,
            marginBottom: "0.125rem",
          }}
        />
        <Typography level="body-xs" sx={{color}}>
          {label} {renderIndicatorIcon()}
        </Typography>
      </div>
      <HtmlTooltip
        title={
          <>
            <Typography>Indikator Kekuatan Kata Sandi</Typography>
            <span>Indikator ini mengevaluasi kata sandi Anda berdasarkan:</span>

            <li>Panjang: Minimal 8 karakter.</li>
            <li>Huruf Kecil: Minimal satu huruf kecil.</li>
            <li>Huruf Besar: Minimal satu huruf besar.</li>
            <li>Angka: Minimal satu angka.</li>
            <li>
              Karakter Khusus: Minimal satu karakter khusus (@, #, $, dll.).
            </li>
          </>
        }
      >
        <InfoOutlined color="action" />
      </HtmlTooltip>
    </div>
  );
};
export default PasswordMeter;
