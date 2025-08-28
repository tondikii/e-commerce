"use client";
import React, {FC, useEffect, useState} from "react";
import MasterDataContext from "./MasterDataContext";
import {Categories, Collections, FetchedData} from "@/types";
import {useFetch} from "@/hooks";
import {ENDPOINT_CATEGORIES, ENDPOINT_COLLECTIONS} from "@/constants";

interface Props {
  children: React.ReactNode;
}

const MasterDataContextProvider: FC<Props> = ({children}) => {
  const [categories, setCategories] = useState<Categories>([]);
  const [collections, setCollections] = useState<Collections>([]);

  const fetchedCategories: FetchedData = useFetch(ENDPOINT_CATEGORIES);
  const fetchedCollections: FetchedData = useFetch(ENDPOINT_COLLECTIONS);

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

  useEffect(() => {
    if (fetchedCollections.data) {
      const data = fetchedCollections.data || [];
      const mappedCollectionsWithRoute = data.map((category) => ({
        ...category,
        route: `${category?.id}`,
      }));
      setCollections(mappedCollectionsWithRoute);
    }
  }, [fetchedCollections.data]);

  return (
    <MasterDataContext.Provider value={{categories, collections}}>
      {children}
    </MasterDataContext.Provider>
  );
};

export default MasterDataContextProvider;
