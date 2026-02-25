


import React from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { CommitteeCard } from '../../components/CommitteeCard';
import { committeesData, leadershipRolesData } from '../../components/data/institutional';
// FIX: Removed 'Variants' from framer-motion import to resolve module export error.
import { motion } from 'framer-motion';
import type { Committee } from '../../types';

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

interface CommitteesPageProps {
  setCurrentPage?: (page: string) => void;
}

export const CommitteesPage: React.FC<CommitteesPageProps> = ({ setCurrentPage }) => {

    // FIX: Changed component to React.FC to resolve TypeScript error with the 'key' prop.
    const CommitteeSection: React.FC<{ title: string; committees: Committee[] }> = ({ title, committees }) => {
        if (committees.length === 0 && title !== "Administrative & Leadership Roles") return null;
        return (
            <div className="mb-12">
                <h2 className="text-2xl font-semibold text-brand-dark mb-6 pb-2 border-b-2 border-yellow-400">{title}</h2>
                <motion.div
                    className="space-y-6"
                    // FIX: Spread motion props to avoid TypeScript type errors.
                    {...{
                        variants: containerVariants,
                        initial: "hidden",
                        animate: "visible",
                    }}
                >
                    {committees.map((committee, index) => (
                        <motion.div key={index} {...{variants: itemVariants}}>
                            <CommitteeCard committee={committee} />
                        </motion.div>
                    ))}

                    {title === "Administrative & Leadership Roles" && setCurrentPage && (
                        <motion.div {...{variants: itemVariants}}>
                            <div className="bg-white p-6 rounded-lg shadow-lg border border-zinc-200 w-full flex flex-col sm:flex-row items-center justify-between gap-4 transition-transform duration-300 hover:-translate-y-1">
                                <div className="flex-grow text-center sm:text-left">
                                    <h3 className="text-lg font-bold text-brand-dark">Augmented Intelligence Uniandes Initiative</h3>
                                    <p className="text-sm font-semibold text-yellow-500 mt-1">Co-founder (Jun 2024 - Present)</p>
                                    <p className="mt-2 text-sm text-brand-gray">A strategic initiative to transform engineering education with Generative AI. For more details on my role and its impact, visit the dedicated page.</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <button
                                        onClick={() => setCurrentPage('institutional.augmented-intelligence')}
                                        className="inline-block bg-yellow-400 text-brand-dark font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-yellow-500 transition-colors duration-300 text-sm"
                                    >
                                        Learn More
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        );
    };

    const groupedCommittees = committeesData.reduce((acc, committee) => {
        const level = committee.level || 'Other';
        if (!acc[level]) {
            acc[level] = [];
        }
        acc[level].push(committee);
        return acc;
    }, {} as Record<string, Committee[]>);

    const order: (Committee['level'])[] = ['National', 'University', 'Faculty', 'Department'];

    return (
        <PageWrapper noPadding>
            <div className="pt-16">
                <div className="sticky top-16 bg-zinc-50/95 backdrop-blur-sm z-20 py-6 border-b border-zinc-200">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark text-left">Service & Leadership</h1>
                        <p className="mt-4 text-brand-gray leading-relaxed text-left">
                            I am dedicated to contributing to the academic community and shaping the future of our institution through active service in various leadership roles and committees.
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-16">
                        {/* Leadership Roles Section */}
                        <CommitteeSection title="Administrative & Leadership Roles" committees={leadershipRolesData} />

                        {/* Committee Service Section */}
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-brand-dark text-left mb-10">Committee Service</h2>
                            {order.map(level => (
                                level && groupedCommittees[level] && (
                                    <CommitteeSection 
                                        key={level}
                                        title={`${level} Level`} 
                                        committees={groupedCommittees[level]} 
                                    />
                                )
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};