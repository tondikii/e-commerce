import { Product } from '@/types';
import useFetch from './useFetch';

const useProduct = (id: string) => {
  const { data, loading, error } = useFetch(
    id ? `/products/${id}` : '',
    { prevent: !id }
  );

  return {
    product: data,
    loading,
    error,
  };
};

export default useProduct