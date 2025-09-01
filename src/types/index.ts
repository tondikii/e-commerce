import {ReactNode} from "react";
import {Product, Products} from "./product";
import {Categories} from "./category";

export * from "./product";
export * from "./category";

// custom event.target component Select @mui/joy
export interface CustomTargetType {
  name: string;
  value: string | number;
}

export interface UserType {
  id?: number;
  name: string;
  email: string;
  phoneNumber?: string;
  createdAt?: string;
}

export type SessionType = {
  user: UserType;
} | null;

export interface MenuType {
  label: string;
  route: string;
  icon?: ReactNode;
  child?: MenuType[];
  isChildren?: boolean;
}
export type MenusType = MenuType[];

export interface Size {
  id?: number;
  code: string;
  name?: string;
}

export interface Color {
  id: number;
  name: string;
  hexCode: string;
}

export interface ColourOption {
  value: number;
  label: string;
  color: string;
}
export interface Collection {
  id: number;
  name: string;
  products?: Product[];
  createdAt: string;
  updatedAt: string;
}

export type Collections = Collection[];

export interface BreadCrumbData {
  name: string;
  label: string;
}

export interface FileWithPreview extends File {
  preview: string;
}

export interface AuthParamsImageKit {
  signature: string;
  expire: number;
  token: string;
  publicKey: string;
}

export interface FetchedDataParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface FetchedData {
  data: Categories | Collections | null;
  loading: boolean;
  error: any;
}

export interface CartItem {
  id: number;
  quantity: number;
  variant: {
    id: number;
    price: number;
    optionValues: any;
    product: {
      id: number;
      name: string;
      description: string;
      images: Array<{
        id: number;
        url: string;
        altText: string | null;
      }>;
      category: {
        id: number;
        name: string;
      } | null;
      collection: {
        id: number;
        name: string;
      } | null;
    };
  };
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal: number;
  shipping: number;
  taxes: number;
}
