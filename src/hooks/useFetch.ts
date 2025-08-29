// src/hooks/useFetch.ts
import {api} from "@/lib/axios";
import {useState, useEffect, useCallback} from "react";

interface Props {
  params?: any;
  prevent?: boolean;
  refetch?: boolean;
  setRefetch?: Function;
  queryParams?: Record<string, string>;
}

const useFetch = (
  endpoint: string,
  {
    params = {},
    prevent = false,
    refetch = false,
    setRefetch = () => {},
    queryParams,
  }: Props | undefined = {}
) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const abortController: AbortController = new AbortController();

  const getData = useCallback(async () => {
    const resetState = () => {
      setLoading(false);
      setRefetch(false);
    };

    try {
      // Gabungkan params dan queryParams
      const allParams = {
        ...params,
        ...queryParams,
      };

      const {data} = await api.get(endpoint, {
        signal: abortController.signal,
        params: allParams,
      });
      setData(data);
      resetState();
    } catch (err: any) {
      if (err?.name !== "AbortError" || err?.message !== "canceled") {
        setError(err);
        resetState();
      }
    }
  }, [abortController.signal, endpoint, params, queryParams, setRefetch]);

  useEffect(() => {
    if (!prevent) {
      getData();
    }

    return () => {
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevent]);

  useEffect(() => {
    if (refetch) {
      setLoading(true);
      setData(null);
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  // Effect untuk refetch ketika queryParams berubah
  useEffect(() => {
    if (!prevent) {
      setLoading(true);
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(queryParams)]); // Gunakan JSON.stringify untuk compare object

  return {data, loading, error};
};

export default useFetch;
