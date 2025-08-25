import {Product} from "./product";

// src/types/category.ts
export interface Category {
  id: number;
  name: string;
  products?: Product[]; // Optional karena mungkin tidak selalu di-include
  createdAt: string;
  updatedAt: string;
}

export type Categories = Category[];

export interface CategoryWithProducts extends Category {
  products: Product[];
}
