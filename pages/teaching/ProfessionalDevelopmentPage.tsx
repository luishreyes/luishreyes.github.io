

import React from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { professionalDevelopmentData } from '../../components/data/professionalDevelopment';
// FIX: Removed 'Variants' from framer-motion import to resolve module export error.
import { motion } from 'framer-motion';

const containerVariants = {
  offscreen: {},
  onscreen: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const timelineItemVariants = {
  offscreen: {
    x: -30,
    opacity: 0,
  },
  onscreen: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      // FIX: Added 'as const' to prevent TypeScript from widening the string literal type, which caused a type error.
      ease: 'easeOut' as const,
    },
  },
};

const ListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const ProfessionalDevelopmentPage = () => {
    return (
        <PageWrapper noPadding>
            <div className="pt-16">
                <div className="sticky top-16 bg-zinc-50/95 backdrop-blur-sm z-20 py-6 border-b border-zinc-200">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark text-left">Improving My Teaching Performance</h1>
                        <p className="mt-4 text-brand-gray leading-relaxed">
                            Since I arrived at the university, I have focused on improving and deepening my understanding of how to teach effectively and create lasting impact. For this reason, I have taken various workshops and courses to continually refine my pedagogical approach.
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.div 
                        // FIX: Spread motion props to avoid TypeScript type errors.
                        {...{
                          initial: "offscreen",
                          whileInView: "onscreen",
                          viewport: { once: true, amount: 0.1 },
                          variants: containerVariants,
                        }}
                        className="relative border-l-2 border-zinc-200 md:ml-24"
                    >
                        {professionalDevelopmentData.map((activity, index) => (
                            <motion.div 
                                key={index} 
                                // FIX: Spread motion props to avoid TypeScript type errors.
                                {...{variants: timelineItemVariants}}
                                className="relative pl-10 pb-12 last:pb-0"
                            >
                                <div className="absolute left-0 top-1 w-5 h-5 bg-yellow-400 rounded-full -translate-x-1/2 border-4 border-white"></div>
                                
                                <div className="ml-2">
                                    <p className="md:absolute md:-left-36 md:top-0 md:text-right md:w-28 mb-2 md:mb-0">
                                        <span className="text-sm font-semibold text-yellow-800 bg-yellow-100 inline-block px-2 py-1 rounded-md">{activity.period}</span>
                                    </p>
                                    <h3 className="font-bold text-xl text-brand-dark">{activity.title}</h3>
                                    {activity.institution && (
                                        <p className="text-brand-gray font-medium">{activity.institution}</p>
                                    )}
                                    <p className="mt-2 text-brand-gray">{activity.description}</p>
                                    {activity.details && (
                                        <ul className="mt-4 space-y-2">
                                            {activity.details.map((detail, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 pt-1">
                                                        <ListIcon />
                                                    </div>
                                                    <span className="text-brand-gray text-sm">{detail}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </PageWrapper>
    );
};