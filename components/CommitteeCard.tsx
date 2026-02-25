

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Committee } from '../types';

const ChevronIcon = ({ open }: { open: boolean }) => (
    <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 transition-transform"
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

export const CommitteeCard = ({ committee }: { committee: Committee }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasDetails = committee.description.length > 0;
    const yearDisplay = committee.endYear ? `${committee.startYear} - ${committee.endYear}` : committee.startYear.toString();

    const cardContent = (
        <div className="flex justify-between items-start gap-4">
            <div>
                <h3 className="text-lg font-bold text-brand-dark">{committee.title}</h3>
                {committee.role && (
                    <p className="text-sm font-semibold text-yellow-500 mt-1">{committee.role}</p>
                )}
            </div>
            <span className="flex-shrink-0 bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full mt-1">{yearDisplay}</span>
        </div>
    );

    if (!hasDetails) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-lg border border-yellow-400/40 w-full">
                {cardContent}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg border border-yellow-400/40 w-full overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full text-left p-6 hover:bg-zinc-50 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                aria-expanded={isExpanded}
                aria-controls={`committee-details-${committee.title.replace(/\s/g, '')}`}
            >
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-grow">
                        <h3 className="text-lg font-bold text-brand-dark">{committee.title}</h3>
                        {committee.role && (
                            <p className="text-sm font-semibold text-yellow-500 mt-1">{committee.role}</p>
                        )}
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-4">
                         <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full mt-1">{yearDisplay}</span>
                        <div className="flex items-center gap-1 text-sm font-medium text-brand-gray">
                            <span className="hidden sm:inline">Details</span> 
                            <ChevronIcon open={isExpanded} />
                        </div>
                    </div>
                </div>
            </button>
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.section
                        id={`committee-details-${committee.title.replace(/\s/g, '')}`}
                        key="content"
                        // FIX: Spread motion props to avoid TypeScript type errors.
                        {...{
                            initial: "collapsed",
                            animate: "open",
                            exit: "collapsed",
                            variants: {
                                open: { opacity: 1, height: 'auto' },
                                collapsed: { opacity: 0, height: 0 }
                            },
                            transition: { duration: 0.4, ease: 'easeInOut' },
                        }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6 pt-4 border-t border-zinc-200">
                            <div className="space-y-4 text-brand-gray text-base leading-relaxed">
                                {committee.description.map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </div>
    );
};