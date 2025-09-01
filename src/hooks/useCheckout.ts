"use client";
import {useState} from "react";
import {api} from "@/lib/axios";

export interface CheckoutData {
  cart: {
    items: Array<{
      id: number;
      quantity: number;
      variant: {
        id: number;
        price: number;
        product: {
          id: number;
          name: string;
          images: Array<{
            url: string;
            altText: string | null;
          }>;
        };
        optionValues: any;
      };
    }>;
    subtotal: number;
    shipping: number;
    taxes: number;
    total: number;
  };
  addresses: Array<{
    id: number;
    recipient: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
  }>;
  user: {
    email: string;
    name: string | null;
  };
}

export const useCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCheckoutData = async (selectedItems?: number[]) => {
    try {
      setLoading(true);
      const url = selectedItems
        ? `/checkout?items=${selectedItems.join(",")}`
        : "/checkout";
      const response = await api.get(url);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch checkout data");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (
    shippingAddressId: number,
    paymentMethod: string,
    selectedItems?: number[] // Add selectedItems parameter
  ) => {
    try {
      setLoading(true);
      const response = await api.post("/checkout", {
        shippingAddressId,
        paymentMethod,
        selectedItems, // Pass selected items to API
      });
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create order");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getCheckoutData,
    createOrder,
  };
};
