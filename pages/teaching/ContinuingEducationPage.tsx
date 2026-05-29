

import React, { useState, useMemo } from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { edcoCoursesData, type EdcoCourse } from '../../components/data/edco';
import { useI18n, localize, type UIKey } from '../../context/i18n';
import { motion } from 'framer-motion';

type FilterType = 'All' | EdcoCourse['type'];
const filterOptions: FilterType[] = ['All', 'Open Course', 'Corporate Course', 'Summer School'];
const filterLabelKey: Record<string, UIKey> = {
    'All': 'contEd.filter.all',
    'Open Course': 'contEd.filter.open',
    'Corporate Course': 'contEd.filter.corporate',
    'Summer School': 'contEd.filter.summer',
};

const typeLabel: Record<string, { en: string; es: string }> = {
    'Open Course': { en: 'Open Course', es: 'Curso Abierto' },
    'Corporate Course': { en: 'Corporate Course', es: 'Curso Corporativo' },
    'Summer School': { en: 'Summer School', es: 'Escuela de Verano' },
};
const roleLabel: Record<string, { en: string; es: string }> = {
    'Instructor': { en: 'Instructor', es: 'Instructor' },
    'Coordinator': { en: 'Coordinator', es: 'Coordinador' },
};

export const ContinuingEducationPage = () => {
    const { t, lang } = useI18n();
    const [activeFilter, setActiveFilter] = useState<FilterType>('All');

    const filteredCourses = useMemo(() => {
        const sorted = [...edcoCoursesData].sort((a, b) => b.year - a.year);
        if (activeFilter === 'All') {
            return sorted;
        }
        return sorted.filter(course => course.type === activeFilter);
    }, [activeFilter]);

    return (
        <PageWrapper noPadding>
            <div className="pt-16">
                 <div className="sticky top-16 bg-zinc-50/95 backdrop-blur-sm z-20 py-6 border-b border-zinc-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto text-left">
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">{t('contEd.title')}</h1>
                            <motion.p 
                                {...{
                                    initial: { opacity: 0, y: 20 },
                                    animate: { opacity: 1, y: 0 },
                                    transition: { duration: 0.5, delay: 0.2 },
                                }}
                                className="mt-4 text-brand-gray leading-relaxed"
                            >
                                {t('contEd.sub')}
                            </motion.p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 justify-center mt-6">
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
                                    {t(filterLabelKey[filter])}
                                </button>
                            ))}
                        </div>
                    </div>
                 </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.div 
                        {...{
                            initial: { opacity: 0, y: 20 },
                            animate: { opacity: 1, y: 0 },
                            transition: { duration: 0.5, delay: 0.4 },
                        }}
                        className="overflow-x-auto bg-white rounded-lg shadow-md border border-zinc-200"
                    >
                        <table className="min-w-full divide-y divide-zinc-200">
                            <thead className="bg-zinc-50">
                                <tr className="text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                                    <th scope="col" className="px-6 py-3">{t('contEd.col.year')}</th>
                                    <th scope="col" className="px-6 py-3">{t('contEd.col.title')}</th>
                                    <th scope="col" className="px-6 py-3">{t('contEd.col.type')}</th>
                                    <th scope="col" className="px-6 py-3 text-center">{t('contEd.col.attendees')}</th>
                                    <th scope="col" className="px-6 py-3 text-center">{t('contEd.col.role')}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-zinc-200">
                                {filteredCourses.map((course, index) => (
                                    <tr key={`${course.year}-${course.title}-${index}`} className="hover:bg-zinc-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray">{course.year}</td>
                                        <td className="px-6 py-4 text-sm text-brand-dark">
                                            {(() => {
                                                const primary = lang === 'en' && course.titleEn ? course.titleEn : course.title;
                                                const secondary = lang === 'en' ? course.title : course.titleEn;
                                                const showSecondary = secondary && secondary !== primary;
                                                return course.url ? (
                                                    <a href={course.url} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-dark hover:text-yellow-500 hover:underline transition-colors">
                                                        {primary}
                                                        {showSecondary && <div className="text-brand-gray italic text-xs mt-1 font-normal">({secondary})</div>}
                                                    </a>
                                                ) : (
                                                    <>
                                                        <div className="font-medium">{primary}</div>
                                                        {showSecondary && <div className="text-brand-gray italic text-xs mt-1 font-normal">({secondary})</div>}
                                                    </>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray">
                                            <div>{localize(typeLabel[course.type], lang)}</div>
                                            {course.client && <div className="text-xs text-zinc-500 italic">{course.client}</div>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-brand-gray">{course.attendees}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                course.role === 'Instructor' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                                {localize(roleLabel[course.role], lang)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                </div>
            </div>
        </PageWrapper>
    );
};