import {useState} from "react";
import {api} from "@/lib/axios";

export interface ShippingAddress {
  id: number;
  recipient: string;
  phone: string;
  address: string;
  province: string;
  city: string;
  postalCode: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export const useAddresses = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAddresses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/addresses");
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch addresses");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createAddress = async (
    addressData: Omit<
      ShippingAddress,
      "id" | "userId" | "createdAt" | "updatedAt"
    >
  ) => {
    try {
      setLoading(true);
      const response = await api.post("/addresses", addressData);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create address");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (
    id: number,
    addressData: Partial<ShippingAddress>
  ) => {
    try {
      setLoading(true);
      const response = await api.put(`/addresses/${id}`, addressData);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update address");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id: number) => {
    try {
      setLoading(true);
      const response = await api.delete(`/addresses/${id}`);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to delete address");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
  };
};
