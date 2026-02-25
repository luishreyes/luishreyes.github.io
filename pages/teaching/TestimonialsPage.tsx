


import React, { useMemo, useState } from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { testimonials, type Testimonial } from '../../components/data/teaching';
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

// FIX: Changed component to React.FC to resolve TypeScript error with the 'key' prop.
const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
    <motion.div 
        className="w-full h-full bg-white rounded-lg shadow-lg border border-yellow-400/40 flex flex-col p-8"
        // FIX: Spread motion props to avoid TypeScript type errors.
        {...{variants: itemVariants}}
    >
        <div className="flex items-center mb-4">
            <img
                className="w-20 h-20 rounded-full object-cover object-center border-4 border-zinc-100 shadow-sm"
                src={testimonial.imageUrl}
                alt={`Photo of ${testimonial.name}`}
            />
            <div className="ml-4 text-left">
                <p className="font-semibold text-brand-dark text-lg">{testimonial.name}</p>
                <p className="text-sm text-brand-gray">{testimonial.info}</p>
                <p className="text-xs text-zinc-500 mt-1 font-medium uppercase tracking-wider">{testimonial.context}</p>
            </div>
        </div>
        
        <div className="w-full text-left flex-grow">
            <blockquote className="space-y-4">
                {testimonial.quote.split('\n\n').map((paragraph, index, arr) => (
                    <p key={index} className="text-brand-gray italic text-sm leading-relaxed">
                        {index === 0 && `"`}
                        {paragraph}
                        {index === arr.length - 1 && `"`}
                    </p>
                ))}
            </blockquote>
        </div>
    </motion.div>
);

type FilterCategory = 'All' | 'Teaching & Mentorship' | 'Research Advising';
const filterOptions: FilterCategory[] = ['All', 'Teaching & Mentorship', 'Research Advising'];

export const TestimonialsPage = () => {
    const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');

    // FIX: Added explicit type annotation to resolve 'unknown' type errors.
    const filteredTestimonials: Record<string, Testimonial[]> = useMemo(() => {
        const sorted = [...testimonials].sort((a, b) => a.name.localeCompare(b.name));
        
        const teaching = sorted.filter(t => t.category === 'Teaching & Mentorship');
        const advising = sorted.filter(t => t.category === 'Research Advising');

        switch (activeFilter) {
            case 'Teaching & Mentorship':
                return { 'Teaching & Mentorship': teaching };
            case 'Research Advising':
                return { 'Research Advising': advising };
            case 'All':
            default:
                 return {
                    'Teaching & Mentorship': teaching,
                    'Research Advising': advising,
                };
        }
    }, [activeFilter]);

    return (
        <PageWrapper noPadding>
            <div className="pt-16">
                <div className="sticky top-16 bg-zinc-50/95 backdrop-blur-sm z-20 py-6 border-b border-zinc-200">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark text-left">Student Testimonials</h1>
                        <p className="mt-4 text-brand-gray leading-relaxed text-left">
                            Hearing from students is the most meaningful measure of teaching success. Here is what some of my past and present students have to say about their learning experiences.
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center mt-6">
                            {filterOptions.map(option => (
                                <button
                                    key={option}
                                    onClick={() => setActiveFilter(option)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
                                    activeFilter === option
                                        ? 'bg-yellow-400 text-brand-dark shadow-md'
                                        : 'bg-white text-brand-gray hover:bg-zinc-100 border border-zinc-200'
                                    }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {Object.entries(filteredTestimonials).map(([category, list]) => (
                        list.length > 0 && (
                            <div key={category} className="mb-16">
                                <h2 className="text-3xl font-bold tracking-tight text-brand-dark text-left mb-8 pb-2 border-b-2 border-yellow-400">{category}</h2>
                                <motion.div
                                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                                    // FIX: Spread motion props to avoid TypeScript type errors.
                                    {...{
                                        variants: containerVariants,
                                        initial: "hidden",
                                        animate: "visible",
                                    }}
                                >
                                    {list.map((testimonial, index) => (
                                        <TestimonialCard key={`${testimonial.name}-${testimonial.category}-${index}`} testimonial={testimonial} />
                                    ))}
                                </motion.div>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </PageWrapper>
    );
};