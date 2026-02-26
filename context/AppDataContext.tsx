import React, { createContext, useContext } from 'react';
import type { Product } from '../types';

interface CitationData {
  counts: Record<string, number | null>;
  total: number;
  hIndex: number;
  i10Index: number;
  isLoading: boolean;
}

interface AppDataContextType {
  products: Product[];
  productsLoading: boolean;
  citationData: CitationData;
}

export const AppDataContext = createContext<AppDataContextType>({
  products: [],
  productsLoading: true,
  citationData: {
    counts: {},
    total: 0,
    hIndex: 0,
    i10Index: 0,
    isLoading: true,
  },
});

export const useAppData = () => useContext(AppDataContext);
