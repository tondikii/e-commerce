"use client";
import {useState, useEffect} from "react";
import {api} from "@/lib/axios";
import {Cart} from "@/types";

const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get("/cart");
      setCart(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (variantId: number, quantity: number) => {
    try {
      await api.post("/cart/add", {variantId, quantity});
      await fetchCart(); // Refresh cart data
      return {success: true};
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || "Failed to add to cart",
      };
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      await api.put("/cart/update", {itemId, quantity});
      await fetchCart(); // Refresh cart data
      return {success: true};
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || "Failed to update quantity",
      };
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      await api.delete(`/cart/remove?itemId=${itemId}`);
      await fetchCart(); // Refresh cart data
      return {success: true};
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || "Failed to remove from cart",
      };
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    refreshCart: fetchCart,
  };
};

export default useCart;
