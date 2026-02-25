import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProductType, ResearchArea } from '../types';

export interface AdvancedFiltersState {
  startYear: number | null;
  endYear: number | null;
  types: ProductType[];
  areas: ResearchArea[];
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: AdvancedFiltersState) => void;
  initialFilters: AdvancedFiltersState;
  productTypes: ProductType[];
  researchAreas: ResearchArea[];
}

export const FilterModal = ({ isOpen, onClose, onApplyFilters, initialFilters, productTypes, researchAreas }: FilterModalProps) => {
  const [filters, setFilters] = useState<AdvancedFiltersState>(initialFilters);

  useEffect(() => {
    if (isOpen) {
        setFilters(initialFilters);
    }
  }, [initialFilters, isOpen]);

  const handleTypeChange = (type: ProductType) => {
    setFilters(prev => {
      const newTypes = prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type];
      return { ...prev, types: newTypes };
    });
  };
  
  const handleAreaChange = (area: ResearchArea) => {
    setFilters(prev => {
      const newAreas = prev.areas.includes(area)
        ? prev.areas.filter(a => a !== area)
        : [...prev.areas, area];
      return { ...prev, areas: newAreas };
    });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'startYear' | 'endYear') => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      [field]: value ? parseInt(value, 10) : null,
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = { startYear: null, endYear: null, types: [], areas: [] };
    onApplyFilters(clearedFilters);
    onClose();
  };
  
  const currentYear = new Date().getFullYear();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          {...{
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        >
          <motion.div
            {...{
              initial: { scale: 0.95, y: 20, opacity: 0 },
              animate: { scale: 1, y: 0, opacity: 1 },
              exit: { scale: 0.95, y: 20, opacity: 0 },
              transition: { duration: 0.2, ease: 'easeOut' },
            }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md m-4"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-modal-title"
          >
            <div className="p-6 border-b border-zinc-200 flex justify-between items-center">
              <h2 id="filter-modal-title" className="text-xl font-bold text-brand-dark">Advanced Filters</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-zinc-100 text-brand-gray" aria-label="Close filters">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Date Range Filter */}
              <div>
                <h3 className="text-md font-semibold text-brand-dark mb-3">Publication Year</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label htmlFor="startYear" className="block text-sm font-medium text-brand-gray mb-1">From</label>
                    <input
                      type="number"
                      id="startYear"
                      name="startYear"
                      placeholder="e.g., 2010"
                      min="2000"
                      max={currentYear}
                      value={filters.startYear ?? ''}
                      onChange={(e) => handleYearChange(e, 'startYear')}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      aria-label="Start year for date range filter"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="endYear" className="block text-sm font-medium text-brand-gray mb-1">To</label>
                    <input
                      type="number"
                      id="endYear"
                      name="endYear"
                      placeholder={`e.g., ${currentYear}`}
                      min="2000"
                      max={currentYear}
                      value={filters.endYear ?? ''}
                      onChange={(e) => handleYearChange(e, 'endYear')}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      aria-label="End year for date range filter"
                    />
                  </div>
                </div>
              </div>

              {/* Product Type Filter */}
              <div>
                <h3 className="text-md font-semibold text-brand-dark mb-3">Product Type</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {productTypes.map(type => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.types.includes(type)}
                        onChange={() => handleTypeChange(type)}
                        className="h-4 w-4 rounded border-zinc-300 text-yellow-500 focus:ring-yellow-500"
                      />
                      <span className="text-sm text-brand-gray">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Research Area Filter */}
              <div>
                <h3 className="text-md font-semibold text-brand-dark mb-3">Research Area</h3>
                <div className="grid grid-cols-1 gap-y-2">
                  {researchAreas.map(area => (
                    <label key={area} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.areas.includes(area)}
                        onChange={() => handleAreaChange(area)}
                        className="h-4 w-4 rounded border-zinc-300 text-yellow-500 focus:ring-yellow-500"
                      />
                      <span className="text-sm text-brand-gray">{area}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-zinc-200 bg-zinc-50 flex justify-end gap-3 rounded-b-lg">
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-white border border-zinc-300 rounded-md text-sm font-semibold text-brand-gray hover:bg-zinc-100 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={handleApply}
                className="px-6 py-2 bg-yellow-400 text-brand-dark rounded-md text-sm font-semibold hover:bg-yellow-500 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};