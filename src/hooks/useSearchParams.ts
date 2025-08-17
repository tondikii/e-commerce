"use client";
import {
  useSearchParams as useSearchParamsImported,
  usePathname,
} from "next/navigation";

const useSearchParams = (router: any) => {
  const pathname: string = usePathname();
  const searchParams = useSearchParamsImported();
  const urlSearchParams = searchParams.toString();

  const setSearchParams = ({
    name,
    value,
    resetPagination,
  }: {
    name: string;
    value: string;
    resetPagination?: boolean;
  }) => {
    const params = new URLSearchParams(urlSearchParams);
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    if (name === "limit" || resetPagination) {
      params.delete("page");
      if (resetPagination) {
        params.delete("limit");
      }
    }

    router.push(pathname + "?" + params.toString());
  };

  return {
    setSearchParams,
    searchParams,
    urlSearchParams,
  };
};

export default useSearchParams;
