import {Categories} from "@/types";
import {createContext} from "react";

interface MasterDataContextType {
  categories: Categories;
}

const MasterDataContext = createContext<MasterDataContextType>({
  categories: [],
});

export default MasterDataContext;
