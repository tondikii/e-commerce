"use client";
import React, {FC, useEffect, useState} from "react";
import MasterDataContext from "./MasterDataContext";
import {Categories, FetchedCategories} from "@/types";
import {useFetch} from "@/hooks";
import {ENDPOINT_CATEGORY} from "@/constants";

interface Props {
  children: React.ReactNode;
}

const MasterDataContextProvider: FC<Props> = ({children}) => {
  const [categories, setCategories] = useState<Categories>([]);

  const fetchedCategories: FetchedCategories = useFetch(ENDPOINT_CATEGORY);

  useEffect(() => {
    if (fetchedCategories.data) {
      const data = fetchedCategories.data || [];
      const mappedCategoriesWithRoute = data.map((category) => ({
        ...category,
        route: `${category?.id}`,
      }));
      setCategories(mappedCategoriesWithRoute);
    }
  }, [fetchedCategories.data]);

  return (
    <MasterDataContext.Provider value={{categories}}>
      {children}
    </MasterDataContext.Provider>
  );
};

export default MasterDataContextProvider;
