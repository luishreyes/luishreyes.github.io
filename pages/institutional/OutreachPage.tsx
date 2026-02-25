

import React from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { outreachData } from '../../components/data/outreach';
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

const getTypeIcon = (type: string) => {
  const iconClass = "h-5 w-5 text-brand-gray";
  switch (type) {
    case 'School Visit':
      return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
    case 'University Event':
      return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1.5 2.5a.5.5 0 00-1 0v8.586a.5.5 0 00.5.5a2.5 2.5 0 005 0a.5.5 0 00.5-.5V4.5a.5.5 0 00-1 0v8.086a1.5 1.5 0 01-3 0V4.5z" clipRule="evenodd" /><path d="M10.5 3.5a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5zM10.5 6.5a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5zm0 3a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5z" /></svg>;
    case 'Virtual Event':
      return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm2-1a1 1 0 00-1 1v8a1 1 0 001 1h10a1 1 0 001-1V5a1 1 0 00-1-1H5z" clipRule="evenodd" /></svg>;
    case 'Fair':
      return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
    default:
      return null;
  }
};

export const OutreachPage: React.FC = () => {
  return (
    <PageWrapper noPadding>
        <div className="pt-16">
            <div className="sticky top-16 bg-zinc-50/95 backdrop-blur-sm z-20 py-6 border-b border-zinc-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark text-left">Outreach & Scouting</h1>
                    <p className="mt-4 text-brand-gray leading-relaxed">
                        I am actively involved in science communication, outreach events, and scouting activities to promote STEM education, disseminate our work, and inspire the next generation of scientists and engineers. These activities are a core part of my commitment to bridging the gap between academia and the community.
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
                    className="relative border-l-2 border-zinc-200"
                >
                    {outreachData.map((activity, index) => (
                        <motion.div 
                            key={index} 
                            // FIX: Spread motion props to avoid TypeScript type errors.
                            {...{variants: timelineItemVariants}}
                            className="relative pl-10 pb-12 last:pb-0"
                        >
                            <div className="absolute left-0 top-1 w-5 h-5 bg-yellow-400 rounded-full -translate-x-1/2 border-4 border-white"></div>
                            
                            <div className="ml-2">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                    <h3 className="font-bold text-xl text-brand-dark">{activity.title}</h3>
                                    <span className="text-sm font-semibold text-yellow-800 bg-yellow-100 inline-block px-2 py-1 rounded-md mt-2 sm:mt-0">{activity.year}</span>
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-brand-gray mb-3">
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{activity.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getTypeIcon(activity.type)}
                                        <span>{activity.type}</span>
                                    </div>
                                </div>

                                <p className="font-medium text-brand-dark">{activity.location}</p>
                                <p className="mt-2 text-brand-gray">{activity.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    </PageWrapper>
  );
};