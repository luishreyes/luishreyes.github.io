

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product, ProductType } from '../types';

interface ChartData {
  year: number;
  count: number;
}

// Chart height is constant, width will be dynamic.
const chartHeight = 300;
const margin = { top: 20, right: 20, bottom: 40, left: 40 };

// Helper to process raw product data into yearly counts
const processData = (products: Product[], filter: ProductType | 'All'): ChartData[] => {
  const filteredProducts = filter === 'All' ? products : products.filter(p => p.type === filter);
  
  const countsByYear: { [year: string]: number } = {};

  filteredProducts.forEach(p => {
    const yearMatch = p.publicationDate.match(/^\d{4}/);
    if (yearMatch) {
      const year = yearMatch[0];
      countsByYear[year] = (countsByYear[year] || 0) + 1;
    }
  });

  return Object.entries(countsByYear)
    .map(([year, count]) => ({ year: parseInt(year), count }))
    .sort((a, b) => a.year - b.year);
};

export const ProductsOverTimeChart = ({ products }: { products: Product[] }) => {
  const [activeFilter, setActiveFilter] = useState<ProductType | 'All'>('All');
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(800);

  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) {
        setChartWidth(chartContainerRef.current.offsetWidth);
      }
    };

    handleResize(); // Set initial width
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const innerWidth = chartWidth > (margin.left + margin.right) ? chartWidth - margin.left - margin.right : 0;
  const innerHeight = chartHeight - margin.top - margin.bottom;

  const uniqueTypes = useMemo(() => ['All', ...new Set(products.map(p => p.type))] as (ProductType | 'All')[], [products]);
  const chartData = useMemo(() => processData(products, activeFilter), [products, activeFilter]);

  const { overallMinYear, overallMaxYear } = useMemo(() => {
    if (products.length === 0) {
      const currentYear = new Date().getFullYear();
      return { overallMinYear: currentYear, overallMaxYear: currentYear };
    }
    const years = products.map(p => {
        const yearMatch = p.publicationDate.match(/^\d{4}/);
        return yearMatch ? parseInt(yearMatch[0]) : null;
    }).filter((y): y is number => y !== null);

    if (years.length === 0) {
      const currentYear = new Date().getFullYear();
      return { overallMinYear: currentYear, overallMaxYear: currentYear };
    }

    return {
      overallMinYear: Math.min(...years),
      overallMaxYear: Math.max(...years),
    };
  }, [products]);

  const maxCount = useMemo(() => {
    if (chartData.length === 0) return 1;
    return Math.max(1, ...chartData.map(d => d.count));
  }, [chartData]);
  
  const yAxisMax = Math.ceil(maxCount / 4) * 4 || 4;

  const paddedMinYear = overallMinYear - 1;
  const paddedMaxYear = overallMaxYear + 1;
  const yearSpan = paddedMaxYear - paddedMinYear;

  const xScale = (year: number) => {
    if (yearSpan <= 1 || innerWidth <= 0) return margin.left + innerWidth / 2;
    return margin.left + ((year - paddedMinYear) / yearSpan) * innerWidth;
  };

  const yScale = (count: number) => {
    return margin.top + innerHeight - (innerHeight * count) / yAxisMax;
  };
  
  const barWidth = Math.max(5, (innerWidth / yearSpan) * 0.7);

  const xAxisTicks = useMemo(() => chartData.map(d => d.year), [chartData]);

  // Filter X-axis ticks to prevent them from overlapping on smaller screens.
  const filteredXAxisTicks = useMemo(() => {
    if (innerWidth <= 0) return [];
    const maxTicks = Math.floor(innerWidth / 60); // Allow one tick per 60px
    if (xAxisTicks.length <= maxTicks) {
      return xAxisTicks;
    }
    const stride = Math.ceil(xAxisTicks.length / maxTicks);
    return xAxisTicks.filter((_, i) => i % stride === 0);
  }, [xAxisTicks, innerWidth]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-yellow-400/40 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold text-brand-dark text-center mb-4">Products Over Time</h2>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {uniqueTypes.map(type => (
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
      
      {/* SVG Chart */}
      <div ref={chartContainerRef} className="w-full">
        {chartWidth > 0 && (
          <svg width={chartWidth} height={chartHeight}>
            {/* Y Axis Gridlines and Labels */}
            <g>
              {Array.from({ length: 5 }).map((_, i) => {
                const value = Math.round(yAxisMax / 4 * i);
                const y = yScale(value);
                if (isNaN(y) || value > yAxisMax) return null;
                return (
                  <g key={i}>
                    <text x={margin.left - 8} y={y + 4} textAnchor="end" fontSize="12" fill="#555555">{value}</text>
                    {i > 0 && <line x1={margin.left} y1={y} x2={chartWidth - margin.right} y2={y} stroke="#f4f4f5" />}
                  </g>
                );
              })}
            </g>
            
            {/* Axes Lines */}
            <line x1={margin.left} y1={margin.top} x2={margin.left} y2={innerHeight + margin.top} stroke="#e4e4e7" />
            <line x1={margin.left} y1={innerHeight + margin.top} x2={chartWidth - margin.right} y2={innerHeight + margin.top} stroke="#e4e4e7" />
            
            {/* Bars */}
            <g>
              <AnimatePresence>
                {chartData.map(({ year, count }) => (
                  <motion.g
                    key={year}
                    // FIX: Spread motion props to avoid TypeScript type errors.
                    {...{
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      exit: { opacity: 0 },
                      transition: { duration: 0.3 },
                    }}
                  >
                    <title>{`Year: ${year}, Count: ${count}`}</title>
                    <motion.rect
                      // FIX: Spread motion props to avoid TypeScript type errors.
                      {...{
                        x: xScale(year) - barWidth / 2,
                        width: barWidth,
                        initial: { y: innerHeight + margin.top, height: 0 },
                        animate: { 
                            y: yScale(count), 
                            height: Math.max(0, innerHeight + margin.top - yScale(count))
                        },
                        exit: { y: innerHeight + margin.top, height: 0 },
                        transition: { type: 'spring', stiffness: 200, damping: 20 },
                      }}
                      fill="#FBBF24"
                      rx="2"
                    />
                  </motion.g>
                ))}
              </AnimatePresence>
            </g>

            {/* X-Axis Labels */}
            <g>
              {filteredXAxisTicks.map(year => (
                <text
                  key={year}
                  x={xScale(year)}
                  y={innerHeight + margin.top + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#555555"
                >
                  {year}
                </text>
              ))}
            </g>
          </svg>
        )}
      </div>
    </div>
  );
};