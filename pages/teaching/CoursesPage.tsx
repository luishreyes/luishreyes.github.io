import React, { useState, useMemo } from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { teachingData } from '../../components/data/teaching';

type FilterType = 'All' | 'Core' | 'Elective' | 'CBU' | 'Undergraduate' | 'Graduate';
const filterOptions: FilterType[] = ['All', 'Core', 'Elective', 'CBU', 'Undergraduate', 'Graduate'];

export const CoursesPage: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<FilterType>('All');

    // Sort courses by term in descending order to show the latest first.
    const allSortedCourses = useMemo(() => 
        [...teachingData].sort((a, b) => b.term.localeCompare(a.term)),
        []
    );

    const filteredCourses = useMemo(() => {
        if (activeFilter === 'All') {
            return allSortedCourses;
        }
        return allSortedCourses.filter(course => {
            if (activeFilter === 'Undergraduate' || activeFilter === 'Graduate') {
                return course.level === activeFilter;
            }
            return course.type === activeFilter;
        });
    }, [activeFilter, allSortedCourses]);

    return (
        <PageWrapper noPadding>
            <div className="pt-16">
                <div className="sticky top-16 bg-zinc-50/95 backdrop-blur-sm z-20 py-6 border-b border-zinc-200">
                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto text-left">
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">Courses Taught</h1>
                            <p className="mt-4 text-brand-gray leading-relaxed">
                                Below is a comprehensive list of courses I have taught since 2017, detailing student engagement, course type, and my role in their design.
                            </p>
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
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-zinc-200">
                        <table className="min-w-full divide-y divide-zinc-200">
                            <thead className="bg-zinc-50">
                                <tr className="text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                                    <th scope="col" className="px-6 py-3">Term</th>
                                    <th scope="col" className="px-6 py-3">Course</th>
                                    <th scope="col" className="px-6 py-3">Students</th>
                                    <th scope="col" className="px-6 py-3">Type</th>
                                    <th scope="col" className="px-6 py-3 text-center">Student Evaluation</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-zinc-200">
                                {filteredCourses.map((course, index) => (
                                    <tr key={`${course.term}-${course.code}-${index}`} className="hover:bg-zinc-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray">{course.term}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-dark">
                                            <div className="font-medium">{course.title}</div>
                                            <div className="text-brand-gray">{course.code}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-brand-gray">{course.students}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    course.type === 'Core' ? 'bg-yellow-100 text-yellow-800' : 
                                                    course.type === 'CBU' ? 'bg-sky-100 text-sky-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                    {course.type}
                                                </span>
                                                {course.level && (
                                                    <span className="mt-1 text-xs text-zinc-500">
                                                        {course.level}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-dark text-center">
                                            {course.evaluation !== null ? course.evaluation.toFixed(1) : '---'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};
