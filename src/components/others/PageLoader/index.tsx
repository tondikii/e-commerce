import {Typography} from "@mui/joy";
import {FC} from "react";
import {PacmanLoader} from "react-spinners";

const PageLoader: FC = () => {
  return (
    <div className="flex items-center flex-col h-screen justify-center text-center py-3">
      <div className="flex items-center flex-col">
        <PacmanLoader color="#212b36" />
      </div>
      <Typography level="body-lg" textAlign="center" color="neutral">
        Sedang memuat ...
      </Typography>
    </div>
  );
};

export default PageLoader;
