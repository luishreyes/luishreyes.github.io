

import React, { useState, useRef } from 'react';
// FIX: Removed 'Variants' from framer-motion import to resolve module export error.
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import type { Product } from '../types';
import { CitationCounter } from './CitationCounter';
import { researchLinesMap } from './data/research';

interface ProductSectionProps {
  product: Product;
  index: number;
  citationCount: number | null;
  isLoadingCitations: boolean;
}

const ChevronIcon = ({ open }: { open: boolean }) => (
    <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 ml-2 transition-transform"
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

export const ProductSection = ({ product, index, citationCount, isLoadingCitations }: ProductSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const transform = useTransform(scrollYProgress, [0, 1], ['translateY(5%)', 'translateY(-5%)']);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0]);

  const summaryVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const summaryItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      // FIX: Added 'as const' to prevent TypeScript from widening the string literal type, which caused a type error.
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  return (
    <section
      ref={containerRef}
      className="relative py-8 px-4 sm:px-8 md:px-16 flex items-center overflow-hidden"
    >
      <motion.div
        style={{ transform, opacity }}
        className="relative z-10 max-w-4xl mx-auto w-full"
      >
        <div className="bg-white rounded-lg shadow-xl border border-yellow-400/40 p-8 md:p-12">
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                <div className="flex-grow pr-4">
                    <span className="inline-block bg-zinc-100 text-brand-gray text-xs font-medium px-2.5 py-1 rounded-full uppercase mb-3">
                        {product.type}
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight text-brand-dark leading-tight">
                        {product.title}
                    </h2>
                </div>
                
                {(product.researchAreas && product.researchAreas.length > 0) || product.status ? (
                    <div className="flex-shrink-0 flex flex-col items-end gap-2 pt-1">
                        {product.researchAreas && product.researchAreas.length > 0 && (
                            <div className="flex items-center gap-2">
                                {product.researchAreas.map(area => {
                                    const researchLine = researchLinesMap[area];
                                    if (!researchLine) return null;
                                    return (
                                        <div key={area} className="group relative">
                                          <span className="bg-yellow-400/20 p-2 rounded-full inline-block cursor-pointer">
                                            {React.isValidElement(researchLine.icon) && React.cloneElement(researchLine.icon as React.ReactElement<{ className: string }>, { className: "h-6 w-6" })}
                                          </span>
                                          <span className="absolute bottom-full mb-2 w-max max-w-xs px-3 py-1.5 text-xs font-semibold text-brand-dark bg-zinc-200 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 -translate-x-1/2 left-1/2">
                                            {researchLine.title}
                                          </span>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                        {product.status && (
                            <span className="inline-block bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap">
                                {product.status}
                            </span>
                        )}
                    </div>
                ) : null}
            </div>
            <div className="mt-6 border-t border-zinc-200 pt-6 space-y-4 text-brand-gray">
                <MetaItem label="Authors">
                  {product.authors.map((author, i) => (
                    <React.Fragment key={i}>
                      {author === 'Luis H. Reyes' ? <strong className="font-bold text-brand-dark">{author}</strong> : author}
                      {i < product.authors.length - 1 ? ', ' : ''}
                    </React.Fragment>
                  ))}
                </MetaItem>
                <MetaItem label="Published In" value={`${product.publicationVenue}, ${product.publicationDate}`} />
                <MetaItem label={product.type === 'Patent' ? 'Patent Number' : 'DOI'}>
                    <a
                        href={
                            product.url
                            ? product.url
                            : product.type === 'Patent'
                            ? `https://patents.google.com/patent/${product.doi}`
                            : `http://dx.doi.org/${product.doi}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-500 font-medium hover:underline hover:text-yellow-400 transition-colors duration-200"
                    >
                        {product.doi}
                    </a>
                </MetaItem>
                <MetaItem label="Citations">
                   <CitationCounter countValue={citationCount} isLoading={isLoadingCitations} />
                </MetaItem>
            </div>

            <div className="mt-8">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center text-lg font-semibold text-yellow-500 hover:text-yellow-400 transition-colors duration-200"
                >
                    {isExpanded ? 'Hide' : 'Show'} Layman's Summary
                    <ChevronIcon open={isExpanded} />
                </button>

                <AnimatePresence initial={false}>
                    {isExpanded && (
                        <motion.div
                            key="content"
                            // FIX: Spread motion props to avoid TypeScript type errors.
                            {...{
                                initial: "hidden",
                                animate: "visible",
                                exit: "hidden",
                                variants: {
                                    visible: { opacity: 1, height: 'auto' },
                                    hidden: { opacity: 0, height: 0 }
                                },
                                transition: { duration: 0.4, ease: 'easeInOut' },
                            }}
                            className="overflow-hidden"
                        >
                            <motion.div {...{variants: summaryVariants}} className="mt-6 space-y-6 pt-4 border-t border-zinc-200">
                                {product.laymanSummary.map((item, i) => (
                                    <motion.div key={i} {...{variants: summaryItemVariants}}>
                                        <h4 className="font-semibold text-brand-dark">{item.question}</h4>
                                        <p className="mt-1 text-brand-gray">{item.answer}</p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-200">
                <p className="text-sm text-brand-gray font-medium">Keywords</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    {product.keywords.map(keyword => (
                        <span key={keyword} className="bg-zinc-100 text-brand-gray text-xs font-medium px-2.5 py-1 rounded-full">
                            {keyword}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </motion.div>
    </section>
  );
};

const MetaItem = ({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4">
        <dt className="font-semibold text-brand-dark">{label}</dt>
        <dd className="md:col-span-3">{children || value}</dd>
    </div>
);