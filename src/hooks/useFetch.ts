import {api} from "@/lib/axios";
import {useState, useEffect, useCallback} from "react";

interface Props {
  params?: any;
  prevent?: boolean;
  refetch?: boolean;
  setRefetch?: Function;
}
const useFetch = (
  endpoint: string,
  {
    params = {},
    prevent = false,
    refetch = false,
    setRefetch = () => {},
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
      const {data} = await api.get(endpoint, {
        signal: abortController.signal,
        params,
      });
      setData(data);
      resetState();
    } catch (err: any) {
      if (err?.name !== "AbortError" || err?.message !== "canceled") {
        setError(err);
        resetState();
      }
    }
  }, [abortController.signal, endpoint, params, setRefetch]);

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

  return {data, loading, error};
};
export default useFetch;
