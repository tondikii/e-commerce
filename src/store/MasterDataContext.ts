import {Categories, Collections} from "@/types";
import {createContext} from "react";

interface MasterDataContextType {
  categories: Categories;
  collections: Collections;
}

const MasterDataContext = createContext<MasterDataContextType>({
  categories: [],
  collections: [],
});

export default MasterDataContext;
