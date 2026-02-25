import React from 'react';
import { PageWrapper } from './PageWrapper';
import { editorialData } from './data/institutional';

export const InstitutionalPage: React.FC = () => {
  return (
    <PageWrapper title="Institutional Activities" maxWidth="max-w-4xl">
        <div className="space-y-12">
            <div>
                <h2 className="text-2xl font-semibold text-brand-dark">Committee Memberships</h2>
                <p className="mt-4 text-brand-gray">
                    I am dedicated to contributing to the academic community and shaping the future of our institution through active service.
                </p>
                 <ul className="mt-4 list-disc list-inside space-y-2 text-brand-gray">
                    <li>Graduate Admissions Committee, Bioengineering Department</li>
                    <li>University Curriculum Development Task Force</li>
                    <li>Faculty Search Committee for Systems Biology</li>
                    <li>Research Ethics Review Board</li>
                </ul>
            </div>
            
            <div>
                <h2 className="text-2xl font-semibold text-brand-dark">Editorial Contributions</h2>
                <p className="mt-4 text-brand-gray">
                    I contribute to the academic publishing community by serving on editorial boards, ensuring the quality and integrity of scientific research.
                </p>
                <div className="mt-6 space-y-6">
                    {editorialData.map((role, index) => (
                        <div key={index} className="p-6 border rounded-lg bg-white shadow-sm">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-2">
                                <h3 className="font-bold text-brand-dark text-lg">{role.journal}</h3>
                                <span className="text-sm font-medium text-brand-gray whitespace-nowrap flex-shrink-0">{role.startDate} - {role.endDate}</span>
                            </div>
                            <p className="text-md font-semibold text-yellow-500 mt-1">{role.role}</p>
                            <p className="mt-4 text-brand-gray text-sm leading-relaxed">{role.description}</p>
                            <ul className="mt-4 list-none space-y-2 text-brand-gray text-sm">
                                {role.responsibilities.map((resp, i) => (
                                    <li key={i}>{resp}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-brand-dark">Academic Outreach</h2>
                <p className="mt-4 text-brand-gray">
                    I am actively involved in science communication and outreach events to promote STEM education in the local community and inspire the next generation of scientists and engineers.
                </p>
            </div>
        </div>
    </PageWrapper>
  );
};