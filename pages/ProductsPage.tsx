

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ProductSection } from '../components/ProductSection';
import type { Product, ProductType, ResearchArea } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterModal, type AdvancedFiltersState } from '../components/FilterModal';
import { PageWrapper } from '../components/PageWrapper';

interface ProductsPageProps {
  products: Product[];
  isLoadingProducts: boolean;
  citationCounts: Record<string, number | null>;
  isLoadingCitations: boolean;
}

const ChevronIcon = ({ open }: { open: boolean }) => (
    <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 ml-2 transition-transform text-zinc-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        // FIX: Spread motion props to avoid TypeScript type errors.
        {...{
          animate: { rotate: open ? 180 : 0 },
          transition: { duration: 0.3 },
        }}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </motion.svg>
);


export const ProductsPage = ({ products, isLoadingProducts, citationCounts, isLoadingCitations }: ProductsPageProps) => {
  const [sortBy, setSortBy] = useState<'date' | 'citations'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFiltersState>({
    startYear: null,
    endYear: null,
    types: [],
    areas: [],
  });
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);


  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isSearchExpanded) {
        setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchExpanded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (isSearchExpanded && searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
            setIsSearchExpanded(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchExpanded]);

  const { sortedUniqueTypes, allResearchAreas } = useMemo(() => {
      const typeCounts = products.reduce((acc, product) => {
        const type = product.type;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<ProductType, number>);

      const sortedTypes = [...new Set<ProductType>(products.map(p => p.type))]
        .sort((a, b) => typeCounts[b] - typeCounts[a]);
      
      const areaCounts = products.reduce((acc, product) => {
          product.researchAreas?.forEach(area => {
              acc[area] = (acc[area] || 0) + 1;
          });
          return acc;
      }, {} as Record<ResearchArea, number>);

      const sortedAreas = [...new Set<ResearchArea>(products.flatMap(p => p.researchAreas || []))]
          .sort((a, b) => (areaCounts[b] || 0) - (areaCounts[a] || 0));
      
      return {
          sortedUniqueTypes: sortedTypes,
          allResearchAreas: sortedAreas
      };
  }, [products]);
  
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (advancedFilters.startYear || advancedFilters.endYear) count++;
    if (advancedFilters.types.length > 0) count++;
    if (advancedFilters.areas.length > 0) count++;
    return count;
  }, [advancedFilters]);

  const sortedAndFilteredProducts = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();

    const filtered = products.filter(pub => {
      const matchesSearch = lowercasedQuery === '' ||
        pub.title.toLowerCase().includes(lowercasedQuery) ||
        pub.authors.join(' ').toLowerCase().includes(lowercasedQuery) ||
        pub.keywords.join(' ').toLowerCase().includes(lowercasedQuery);
      if (!matchesSearch) return false;

      const pubYearStr = pub.publicationDate.match(/^\d{4}/);
      if (pubYearStr) {
        const pubYear = parseInt(pubYearStr[0], 10);
        if (advancedFilters.startYear && pubYear < advancedFilters.startYear) return false;
        if (advancedFilters.endYear && pubYear > advancedFilters.endYear) return false;
      }
      
      if (advancedFilters.types.length > 0 && !advancedFilters.types.includes(pub.type)) {
        return false;
      }

      if (advancedFilters.areas.length > 0) {
        const hasMatchingArea = pub.researchAreas?.some(area => advancedFilters.areas.includes(area));
        if (!hasMatchingArea) return false;
      }

      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      const dateB = new Date(b.publicationDate).getTime();
      const dateA = new Date(a.publicationDate).getTime();

      if (sortBy === 'citations') {
        const countA = citationCounts[a.doi] ?? -1;
        const countB = citationCounts[b.doi] ?? -1;
        if (countB !== countA) {
          return countB - countA;
        }
        return dateB - dateA;
      }
      
      if (sortOrder === 'desc') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

    return sorted;
  }, [sortBy, sortOrder, citationCounts, searchQuery, advancedFilters, products]);
  
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    
    // Smoothly scroll to the top of the page when filters change
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [sortedAndFilteredProducts]);


  const handleDateSortClick = () => {
    if (sortBy === 'date') {
      setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy('date');
      setSortOrder('desc');
    }
  };

  const handleApplyAdvancedFilters = (newFilters: AdvancedFiltersState) => {
    setAdvancedFilters(newFilters);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchExpanded(false);
  };

  return (
    <PageWrapper noPadding>
      <div className="pt-16">
        <div className="sticky top-16 bg-zinc-50/95 backdrop-blur-sm z-20 py-6 border-b border-zinc-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark text-left">Products</h1>
            <p className="mt-2 text-sm text-left text-brand-gray">
              {isLoadingProducts ? 'Loading products...' : `Showing ${sortedAndFilteredProducts.length} of ${products.length} total products.`}
            </p>
            
            <div className="flex flex-wrap items-center justify-end gap-2 mt-6">
                {/* Right side: Sort, Search, Advanced Filters */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-brand-gray hidden md:inline">Sort by:</span>
                        <div className="flex gap-2">
                            <button
                                onClick={handleDateSortClick}
                                className={`px-4 h-10 flex items-center text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
                                sortBy === 'date'
                                    ? 'bg-yellow-400 text-brand-dark shadow-md'
                                    : 'bg-white text-brand-gray hover:bg-zinc-100 border border-zinc-200'
                                }`}
                            >
                                Date
                                {sortBy === 'date' && (
                                    sortOrder === 'desc' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                        </svg>
                                    )
                                )}
                            </button>
                            <button
                                onClick={() => setSortBy('citations')}
                                disabled={isLoadingCitations}
                                className={`px-4 h-10 flex items-center text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                                sortBy === 'citations'
                                    ? 'bg-yellow-400 text-brand-dark shadow-md'
                                    : 'bg-white text-brand-gray hover:bg-zinc-100 border border-zinc-200'
                                }`}
                            >
                                Citations
                            </button>
                        </div>
                    </div>

                    <div ref={searchContainerRef} className="relative flex items-center">
                        <AnimatePresence mode="wait">
                            {isSearchExpanded ? (
                                <motion.div
                                    key="search-input"
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 200, opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                >
                                    <form onSubmit={handleSearchSubmit} className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-zinc-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onBlur={() => { if (searchQuery === '') setIsSearchExpanded(false) }}
                                            onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); setIsSearchExpanded(false); } }}
                                            placeholder="Search..."
                                            className="w-full h-10 bg-white border border-zinc-300 rounded-md py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        />
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.button
                                    key="search-button"
                                    onClick={() => setIsSearchExpanded(true)}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-10 h-10 flex items-center justify-center bg-white border border-zinc-300 rounded-md text-sm font-semibold text-brand-gray hover:bg-zinc-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    aria-label="Open search"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                                    </svg>
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={() => setIsFilterModalOpen(true)}
                        className="relative flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white border border-zinc-300 rounded-md text-sm font-semibold text-brand-gray hover:bg-zinc-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        aria-label="Open advanced filters"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                        </svg>
                        {activeFilterCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-brand-dark text-xs font-bold">
                            {activeFilterCount}
                        </span>
                        )}
                    </button>
                </div>
            </div>

          </div>
        </div>
        
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilters={handleApplyAdvancedFilters}
          initialFilters={advancedFilters}
          productTypes={sortedUniqueTypes}
          researchAreas={allResearchAreas}
        />
  
        <motion.div layout className="bg-zinc-50">
          {isLoadingProducts ? (
            <div className="text-center py-20 px-4">
               <h3 className="text-xl font-semibold text-zinc-700">Loading Products...</h3>
               <p className="mt-2 text-zinc-500">Fetching the latest data from the database.</p>
             </div>
          ) : sortedAndFilteredProducts.length > 0 ? (
            sortedAndFilteredProducts.map((prod: Product, index: number) => (
              <motion.div
                key={prod.doi}
                // FIX: Spread motion props to avoid TypeScript type errors.
                {...{
                  layout: true,
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                  transition: { duration: 0.5 },
                }}
              >
                <ProductSection 
                  product={prod} 
                  index={index} 
                  citationCount={citationCounts[prod.doi] ?? null}
                  isLoadingCitations={isLoadingCitations}
                />
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 px-4">
              <h3 className="text-xl font-semibold text-zinc-700">No Products Found</h3>
              <p className="mt-2 text-zinc-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  );
};