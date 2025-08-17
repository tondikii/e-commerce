"use client";

// import {ENDPOINT_PRODUCT} from "@/constants";
// import {useFetch, useSearchParams} from "@/hooks";
// import {FetchedProducts, FetchProductsParams} from "@/types";
// import {useRouter} from "next/navigation";
import {
  // useState,
  type FC,
} from "react";

interface ViewProps {}

const View: FC<ViewProps> = ({}) => {
  // const router = useRouter();

  // const {searchParams, setSearchParams, urlSearchParams} =
  //   useSearchParams(router);

  // const [refetch, setRefetch] = useState<boolean>(false);

  // const refetchData = () => {
  //   setRefetch(true);
  // };

  // const searchParamsObject: FetchProductsParams = Object.fromEntries(
  //   searchParams.entries()
  // );

  // const fetchProductsParams = {...searchParamsObject};

  // const fetchedProducts: FetchedProducts = useFetch(ENDPOINT_PRODUCT, {
  //   params: fetchProductsParams,
  //   refetch,
  //   setRefetch,
  //   // prevent,
  // });

  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
};
export default View;
