import {Collection} from ".";
import {Category} from "./category";

export interface CreateProductRequest {
  product: {
    name: string;
    description: string;
    categoryId?: number;
    collectionId?: number;
    images?: string[];
  };
  variants: {
    price: number;
    stock: number;
    optionValues: Record<string, string>;
  }[];
}

export interface CreateProductResponse {
  id: number;
  name: string;
  description: string;
  variants: ProductVariantResponse[];
  images: ProductImageResponse[];
}

export interface ProductVariantResponse {
  id: number;
  sku: string;
  price: number;
  stock: number;
  optionValues: Record<string, string>;
}

export interface ProductImageResponse {
  id: number;
  url: string;
  altText: string | null;
}

export interface ProductOptionType {
  id?: number;
  name: string;
  variants: string[];
}

export interface ProductDetailType {
  id?: number;
  name: string;
  description: string;
  images: File[];
}

export interface VariantEditType {
  price: number;
  stock: number;
}

export interface VariantEditData {
  [key: string | number]: VariantEditType;
}

export interface ProductVariantType {
  id?: string | number;
  price: number;
  stock: number;
  combinations?: Record<string, string>;
  optionValues?: Record<string, string>;
  sku?: string;
  productId?: number;
  product?: Product;
}

export interface ProductVariantFormType {
  options: ProductOptionType[];
  variants: ProductVariantType[];
}

export interface ProductImage {
  id?: number;
  url: string;
  productId?: number;
  altText?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  categoryId?: number;
  collectionId?: number;
  images?: ProductImage[];
  variants?: ProductVariantType[];
  category: Category;
  collection: Collection;
}

export type Products = Product[];

export interface ProductWithRelations {
  id: number;
  name: string;
  description: string;
  images: ProductImage[];
  variants: ProductVariantType[];
  category: {id: number; name: string} | null;
  collection: {id: number; name: string} | null;
  createdAt: string;
  updatedAt: string;
}
