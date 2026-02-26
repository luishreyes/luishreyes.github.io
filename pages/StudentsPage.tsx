


import React, { useState, useMemo, useRef } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { studentsData, graduatedStudentsData } from '../components/data/students';
import type { GraduatedStudent } from '../types';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

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

// FIX: Changed component to React.FC to resolve TypeScript error with the 'key' prop.
const GraduatedStudentCard: React.FC<{ student: GraduatedStudent }> = ({ student }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: imageContainerRef,
        offset: ['start end', 'end start']
    });

    const frameRotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);
    const imageRotate = useTransform(scrollYProgress, [0, 1], [2, -2]);
    const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1]);

    return (
        <motion.div 
            // FIX: Spread motion props to avoid TypeScript type errors.
            {...{
                layout: true,
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -20 },
                transition: { duration: 0.5 },
            }}
            className="bg-white rounded-lg shadow-lg border border-yellow-400/40 overflow-hidden"
        >
            <div className="md:flex md:items-center">
                <div className="w-full md:w-56 flex justify-center p-6 md:flex-shrink-0">
                    <div ref={imageContainerRef} className="relative w-40 h-40">
                        {/* Dephased frame */}
                        <motion.div
                            className="absolute top-2 right-[-6px] bottom-[-6px] left-2 rounded-2xl border-2 border-yellow-400"
                            style={{ rotate: frameRotate }}
                        />

                        {/* Main image */}
                        <motion.div
                            className="relative w-full h-full rounded-2xl shadow-xl z-10 overflow-hidden"
                            style={{ rotate: imageRotate, scale: imageScale }}
                        >
                            <img
                                className="w-full h-full object-cover object-center"
                                src={student.imageUrl}
                                alt={`Photo or thesis cover for ${student.name}`}
                            />
                            <div className="absolute inset-0 bg-white mix-blend-saturation pointer-events-none"></div>
                        </motion.div>
                    </div>
                </div>
                <div className="p-8 pt-0 md:pt-8 md:pl-0 flex-grow text-center md:text-left">
                    <div className="uppercase tracking-wide text-sm text-yellow-500 font-semibold">{student.degree} - Graduated {student.graduationYear}</div>
                    <h3 className="block mt-1 text-2xl leading-tight font-bold text-brand-dark">{student.name}</h3>
                    
                    {(student.program || student.currentPosition) && (
                        <div className="mt-2 text-brand-gray space-y-1">
                            {student.program && <p>{student.program}</p>}
                            {student.currentPosition && (
                                <p className="flex items-center gap-2 justify-center md:justify-start flex-wrap">
                                    <span>{student.currentPosition}</span>
                                    {student.linkedinUrl && (
                                        <a
                                            href={student.linkedinUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-[#0077B5] hover:text-[#005582] transition-colors"
                                            title={`${student.name} on LinkedIn`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                            </svg>
                                        </a>
                                    )}
                                </p>
                            )}
                            {!student.currentPosition && student.linkedinUrl && (
                                <p className="flex items-center gap-2 justify-center md:justify-start">
                                    <a
                                        href={student.linkedinUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-[#0077B5] hover:text-[#005582] transition-colors"
                                        title={`${student.name} on LinkedIn`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                        </svg>
                                        <span className="text-sm ml-1">LinkedIn</span>
                                    </a>
                                </p>
                            )}
                        </div>
                    )}
                    {!student.program && !student.currentPosition && student.linkedinUrl && (
                        <div className="mt-2">
                            <a
                                href={student.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-[#0077B5] hover:text-[#005582] transition-colors"
                                title={`${student.name} on LinkedIn`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                                <span className="text-sm ml-1">LinkedIn</span>
                            </a>
                        </div>
                    )}

                    <p className="mt-4 text-brand-gray italic">"{student.thesisTitle}"</p>
                    
                     <div className="mt-6">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center font-semibold text-yellow-500 hover:text-yellow-400 transition-colors duration-200 mx-auto md:mx-0"
                            aria-expanded={isExpanded}
                        >
                            {isExpanded ? 'Hide' : 'Show'} Thesis Summary
                            <ChevronIcon open={isExpanded} />
                        </button>
                        <AnimatePresence initial={false}>
                            {isExpanded && (
                                <motion.div
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
                                    <div className="mt-4 space-y-4 pt-4 border-t border-zinc-200">
                                        {student.laymanSummary.map((item, i) => (
                                            <div key={i}>
                                                <h4 className="font-semibold text-brand-dark">{item.question}</h4>
                                                <p className="mt-1 text-brand-gray">{item.answer}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const sortGraduatedStudents = (a: GraduatedStudent, b: GraduatedStudent): number => {
  // 1. Sort by graduation year (descending)
  if (a.graduationYear !== b.graduationYear) {
    return b.graduationYear - a.graduationYear;
  }
  // 2. Sort by program (alphabetical, treating undefined as first)
  const programA = a.program ?? '';
  const programB = b.program ?? '';
  const programCompare = programA.localeCompare(programB);
  if (programCompare !== 0) {
    return programCompare;
  }
  // 3. Sort by name (alphabetical)
  return a.name.localeCompare(b.name);
};


export const StudentsPage = () => {
    const [activeFilter, setActiveFilter] = useState<'All' | 'Current' | 'Alumni'>('All');

    const sortedPhdGraduates = useMemo(() => 
        [...graduatedStudentsData.phd].sort(sortGraduatedStudents), 
        []
    );

    const sortedMsGraduates = useMemo(() =>
        [...graduatedStudentsData.ms].sort(sortGraduatedStudents),
        []
    );

    const filterOptions: ('All' | 'Current' | 'Alumni')[] = ['All', 'Current', 'Alumni'];

    return (
        <PageWrapper noPadding>
            <div className="pt-16">
                 <div className="sticky top-16 bg-zinc-50/95 backdrop-blur-sm z-20 py-6 border-b border-zinc-200">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark text-left">Grad Students</h1>
                         <div className="flex items-center justify-center mt-4 space-x-4">
                            <div className="flex gap-2">
                                {filterOptions.map(filter => (
                                     <button
                                        key={filter}
                                        onClick={() => setActiveFilter(filter)}
                                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
                                            activeFilter === filter
                                            ? 'bg-yellow-400 text-brand-dark shadow-md'
                                            : 'bg-white text-brand-gray hover:bg-zinc-100 border border-zinc-200'
                                        }`}
                                    >
                                        {filter} Students
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.div layout className="space-y-16">
                        
                        <AnimatePresence>
                            { (activeFilter === 'All' || activeFilter === 'Current') && (
                                <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <h2 className="text-3xl font-bold tracking-tight text-brand-dark text-left mb-10">Current Students</h2>
                                    
                                    {studentsData.phd.length > 0 && (
                                        <div className="mb-12">
                                            <h3 className="text-2xl font-semibold text-brand-dark mb-6">Ph.D. Students</h3>
                                            <div className="bg-white p-8 rounded-lg shadow-lg border border-yellow-400/40">
                                                <ul className="space-y-4 text-brand-gray text-lg list-disc list-inside">
                                                    {studentsData.phd.map(student => (
                                                        <li key={student.name}><span className="font-medium text-brand-dark">{student.name}</span> - {student.info}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {studentsData.ms.length > 0 && (
                                         <div>
                                            <h3 className="text-2xl font-semibold text-brand-dark mb-6">Master's Students</h3>
                                            <div className="bg-white p-8 rounded-lg shadow-lg border border-yellow-400/40">
                                                <ul className="space-y-4 text-brand-gray text-lg list-disc list-inside">
                                                    {studentsData.ms.map(student => (
                                                        <li key={student.name}><span className="font-medium text-brand-dark">{student.name}</span> - {student.info}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            { (activeFilter === 'All' || activeFilter === 'Alumni') && (
                                <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <h2 className="text-3xl font-bold tracking-tight text-brand-dark text-left mb-10">Alumni</h2>
                                    
                                    {graduatedStudentsData.phd.length > 0 && (
                                        <div className="mb-12">
                                             <h3 className="text-2xl font-semibold text-brand-dark mb-6">Ph.D. Graduates</h3>
                                            <motion.div layout className="space-y-8">
                                                {sortedPhdGraduates.map(student => (
                                                    <GraduatedStudentCard key={student.name} student={student} />
                                                ))}
                                            </motion.div>
                                        </div>
                                    )}

                                    {graduatedStudentsData.ms.length > 0 && (
                                         <div>
                                             <h3 className="text-2xl font-semibold text-brand-dark mb-6">Master's Graduates</h3>
                                            <motion.div layout className="space-y-8">
                                                {sortedMsGraduates.map(student => (
                                                    <GraduatedStudentCard key={student.name} student={student} />
                                                ))}
                                            </motion.div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                 </div>
            </div>
        </PageWrapper>
    );
};