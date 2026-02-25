

import React, { useState, useMemo } from 'react';
import { productsData } from '../components/constants';
import { PublicationSection } from '../components/PublicationSection';
import type { Product, ProductType } from '../types';
import { motion } from 'framer-motion';

const uniqueTypes = [...new Set<ProductType>(productsData.map(p => p.type))];
const filterOptions = ['All', ...uniqueTypes];

interface PublicationsPageProps {
  citationCounts: Record<string, number | null>;
  isLoadingCitations: boolean;
}

export const PublicationsPage: React.FC<PublicationsPageProps> = ({ citationCounts, isLoadingCitations }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'date' | 'citations'>('date');

  const sortedAndFilteredPublications = useMemo(() => {
    const filtered = productsData.filter(pub => 
      activeFilter === 'All' || pub.type === activeFilter
    );

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'citations') {
        const countA = citationCounts[a.doi] ?? -1;
        const countB = citationCounts[b.doi] ?? -1;
        return countB - countA;
      }
      // Default to date sort
      return new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
    });

    return sorted;
  }, [activeFilter, sortBy, citationCounts]);

  return (
    <motion.div
      // FIX: Spread motion props to avoid TypeScript type errors.
      {...{
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3 },
      }}
    >
      <div className="py-16 bg-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 text-center">Publications</h1>
          <div className="flex flex-wrap gap-2 justify-center mt-8">
            {filterOptions.map(type => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
                  activeFilter === type
                    ? 'bg-yellow-400 text-brand-dark shadow-md'
                    : 'bg-white text-brand-gray hover:bg-zinc-100 border border-zinc-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-center mt-6 space-x-4">
            <span className="text-sm font-medium text-brand-gray">Sort by:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('date')}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
                  sortBy === 'date'
                    ? 'bg-yellow-400 text-brand-dark shadow-md'
                    : 'bg-white text-brand-gray hover:bg-zinc-100 border border-zinc-200'
                }`}
              >
                Date
              </button>
              <button
                onClick={() => setSortBy('citations')}
                disabled={isLoadingCitations}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  sortBy === 'citations'
                    ? 'bg-yellow-400 text-brand-dark shadow-md'
                    : 'bg-white text-brand-gray hover:bg-zinc-100 border border-zinc-200'
                }`}
              >
                Citations
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <motion.div {...{layout: true}} className="bg-slate-50">
        {sortedAndFilteredPublications.map((pub: Product, index: number) => (
          <motion.div
            key={pub.doi}
            // FIX: Spread motion props to avoid TypeScript type errors.
            {...{
              layout: true,
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              transition: { duration: 0.5 },
            }}
          >
            <PublicationSection 
              publication={pub} 
              index={index} 
              citationCount={citationCounts[pub.doi] ?? null}
              isLoadingCitations={isLoadingCitations}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};