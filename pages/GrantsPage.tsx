

import React, { useState, useMemo } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { grantsData } from '../components/data/grants';
// FIX: Removed 'Variants' from framer-motion import to resolve module export error.
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            // FIX: Added 'as const' to prevent TypeScript from widening the string literal type, which caused a type error.
            ease: "easeOut" as const,
        },
    },
};

export const GrantsPage = () => {
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    const sortedGrants = useMemo(() => {
        return [...grantsData].sort((a, b) => {
            const isAInProgress = a.status === 'In Progress';
            const isBInProgress = b.status === 'In Progress';

            const endYearA = a.endYear ?? a.startYear;
            const endYearB = b.endYear ?? b.startYear;

            if (sortOrder === 'newest') {
                // 'In Progress' comes before 'Concluded'
                if (isAInProgress && !isBInProgress) return -1;
                if (!isAInProgress && isBInProgress) return 1;

                // If both have same status, sort by end year descending
                if (endYearA !== endYearB) {
                    return endYearB - endYearA;
                }
                // Then by start year descending
                return b.startYear - a.startYear;
            } else { // oldest
                // 'In Progress' comes after 'Concluded'
                if (isAInProgress && !isBInProgress) return 1;
                if (!isAInProgress && isBInProgress) return -1;
                
                // If both have same status, sort by end year ascending
                if (endYearA !== endYearB) {
                    return endYearA - endYearB;
                }
                // Then by start year ascending
                return a.startYear - b.startYear;
            }
        });
    }, [sortOrder]);
    
    return (
        <PageWrapper noPadding>
            <div className="pt-16">
                <div className="sticky top-16 bg-zinc-50/95 backdrop-blur-sm z-20 py-6 border-b border-zinc-200">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark text-left">Funded Grants</h1>
                        <div className="flex items-center justify-center mt-4 space-x-4">
                            <span className="text-sm font-medium text-brand-gray">Sort by:</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSortOrder('newest')}
                                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
                                        sortOrder === 'newest'
                                        ? 'bg-yellow-400 text-brand-dark shadow-md'
                                        : 'bg-white text-brand-gray hover:bg-zinc-100 border border-zinc-200'
                                    }`}
                                >
                                    Newest First
                                </button>
                                <button
                                    onClick={() => setSortOrder('oldest')}
                                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
                                        sortOrder === 'oldest'
                                        ? 'bg-yellow-400 text-brand-dark shadow-md'
                                        : 'bg-white text-brand-gray hover:bg-zinc-100 border border-zinc-200'
                                    }`}
                                >
                                    Oldest First
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                     <motion.div 
                        // FIX: Spread motion props to avoid TypeScript type errors.
                        {...{
                            variants: containerVariants,
                            initial: "hidden",
                            animate: "visible",
                        }}
                        className="space-y-6"
                     >
                        {sortedGrants.map((grant) => {
                            const yearDisplay = (grant.endYear && grant.endYear !== grant.startYear)
                                ? `${grant.startYear} - ${grant.endYear}`
                                : grant.startYear;
                            return (
                                <motion.div
                                    key={grant.title}
                                    // FIX: Spread motion props to avoid TypeScript type errors.
                                    {...{variants: itemVariants}}
                                    className="bg-white p-8 rounded-lg shadow-lg border border-yellow-400/40 transition-transform duration-300 hover:-translate-y-1"
                                >
                                    <div className="flex justify-between items-start gap-4 mb-2">
                                        <h2 className="flex-grow text-lg md:text-xl font-bold tracking-tight text-brand-dark leading-tight">
                                            {grant.title}
                                        </h2>
                                        <span className="flex-shrink-0 bg-amber-100 text-amber-800 text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap mt-1">
                                            {yearDisplay}
                                        </span>
                                    </div>
                                    <p className="text-md text-brand-gray">{grant.organization}</p>
                                    <div className="mt-4 flex justify-between items-center text-sm">
                                        <span className="text-brand-dark font-medium">{grant.role}</span>
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                            grant.status === 'Concluded' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                                        }`}>
                                            {grant.status}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </PageWrapper>
    );
};