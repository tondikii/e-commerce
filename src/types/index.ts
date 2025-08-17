import {ReactNode} from "react";

// custom event.target component Select @mui/joy
export interface CustomTargetType {
  name: string;
  value: string | number;
}

// custom event.target component Select @mui/joy
export interface CustomTargetType {
  name: string;
  value: string | number;
}

export interface UserType {
  name: string;
  email: string;
}

export type SessionType = {
  user: UserType;
} | null;

export interface MenuType {
  label: string;
  route: string;
  icon?: ReactNode;
  child?: MenuType[];
  disabled: boolean;
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

export interface ProductImage {
  id?: number;
  url: string;
  colorId: number;
}

export interface ProductUnit {
  id?: number;
  quantity: number;
  size: Size;
  color: Color;
  sizeId?: number;
  colorId?: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount?: number;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  styleId: number;
  productImages?: ProductImage[];
  productUnits?: ProductUnit[];
}

export type Products = Product[];

export interface FetchProductsParams {
  name?: string;
  page?: number;
  limit?: number;
  offset?: number;
  styleId?: number;
}
export interface FetchedProducts {
  data: {
    data: Products;
    totalRecords: number;
  } | null;
  loading: boolean;
  error: any;
}

export interface ColourOption {
  value: number;
  label: string;
  color: string;
}

export interface Category {
  id: number;
  name: string;
  route?: string;
}

export type Categories = Category[];

export interface FetchedCategories {
  data: Categories | null;
  loading: boolean;
  error: any;
}
