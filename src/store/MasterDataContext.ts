import {Cart, Categories, Collections} from "@/types";
import {createContext} from "react";

interface MasterDataContextType {
  categories: Categories;
  collections: Collections;
  cart: Cart | null;
  addToCart: (variantId: number, quantity: number) => void;
  loadingCart: boolean;
  errorCart: string | null;
  updateQuantityCart: (itemId: number, quantity: number) => void;
  removeFromCart: (itemId: number) => void;
}

const MasterDataContext = createContext<MasterDataContextType>({
  categories: [],
  collections: [],
  cart: null,
  addToCart: () => {},
  loadingCart: false,
  errorCart: null,
  updateQuantityCart: () => {},
  removeFromCart: () => {},
});

export default MasterDataContext;
