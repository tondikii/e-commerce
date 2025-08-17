import {useContext} from "react";
import MasterDataContext from "./MasterDataContext";

const useMasterData = () => {
  const context = useContext(MasterDataContext);

  if (context === undefined) {
    throw new Error("useMasterData must be used within a MasterDataProvider");
  }

  return context;
};

export default useMasterData;
