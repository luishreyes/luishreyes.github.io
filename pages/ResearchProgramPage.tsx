

import React from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { useI18n } from '../context/i18n';
// FIX: Removed 'Variants' from framer-motion import to resolve module export error.
import { motion } from 'framer-motion';
import { researchLines } from '../components/data/research';

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

export const ResearchProgramPage = () => {
    const { t } = useI18n();
    return (
        <PageWrapper noPadding>
            <div className="pt-16">
                <div className="sticky top-16 bg-zinc-50/95 backdrop-blur-sm z-20 py-6 border-b border-zinc-200">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark text-left">{t('research.program.title')}</h1>
                        <p className="mt-4 text-brand-gray leading-relaxed">
                            {t('research.program.sub')}
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-left max-w-4xl mx-auto mb-16"
                    >
                        <p className="text-brand-gray text-lg leading-relaxed">
                            {t('research.program.para1')}
                        </p>
                        <p className="mt-4 text-brand-gray text-lg leading-relaxed">
                            {t('research.program.para2')}
                        </p>
                    </motion.div>

                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        // FIX: Spread motion props to avoid TypeScript type errors.
                        {...{
                            variants: containerVariants,
                            initial: "hidden",
                            whileInView: "visible",
                            viewport: { once: true, amount: 0.1 }
                        }}
                    >
                        {researchLines.map((line) => (
                            <motion.div
                                key={line.title}
                                // FIX: Spread motion props to avoid TypeScript type errors.
                                {...{variants: itemVariants}}
                                className="bg-white rounded-lg shadow-lg border border-zinc-100 p-8 flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2"
                            >
                                <div className="bg-yellow-400/20 p-4 rounded-full mb-6">
                                    {line.icon}
                                </div>
                                <h3 className="text-xl font-bold text-brand-dark mb-3">{line.title}</h3>
                                <p className="text-brand-gray leading-relaxed text-sm">{line.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </PageWrapper>
    );
};