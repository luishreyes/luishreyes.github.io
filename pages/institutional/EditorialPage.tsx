

import React from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { editorialData } from '../../components/data/institutional';

const eceIcons = [
  <img src="https://cdn-icons-png.flaticon.com/512/8998/8998530.png" alt="Subject Editor in Biotechnology & Bioprocessing Icon" className="w-8 h-8" />,
  <img src="https://cdn-icons-png.flaticon.com/512/263/263075.png" alt="Special Issue Development Icon" className="w-8 h-8" />,
  <img src="https://cdn-icons-png.flaticon.com/512/15766/15766048.png" alt="Academic & Industry Impact Icon" className="w-8 h-8" />,
];

const discoverBiotechIcons = [
  <img src="https://cdn-icons-png.flaticon.com/512/13296/13296573.png" alt="Manuscript Evaluation Icon" className="w-8 h-8" />,
  <img src="https://cdn-icons-png.flaticon.com/512/263/263075.png" alt="Special Issue Coordination Icon" className="w-8 h-8" />,
  <img src="https://cdn-icons-png.flaticon.com/512/1212/1212158.png" alt="Quality Assurance Icon" className="w-8 h-8" />,
];

export const EditorialPage: React.FC = () => {
  return (
    <PageWrapper noPadding>
        <div className="pt-16">
            <div className="sticky top-16 bg-zinc-50/95 backdrop-blur-sm z-20 py-6 border-b border-zinc-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark text-left">Editorial Contributions</h1>
                    <p className="mt-4 text-lg text-left text-brand-gray">
                        I contribute to the academic publishing community by serving on editorial boards, ensuring the quality and integrity of scientific research.
                    </p>
                </div>
            </div>
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                    {editorialData.map((role, index) => {
                      const icons = role.journal.includes('Education for Chemical Engineers') 
                          ? eceIcons 
                          : discoverBiotechIcons;
                      return (
                        <div key={index} className="bg-white rounded-xl shadow-lg border border-yellow-400/40 overflow-hidden flex flex-col md:flex-row">
                            <div className="md:w-1/3 flex items-center justify-center p-6 bg-zinc-50">
                                <img className="h-48 w-auto object-contain" src={role.imageUrl} alt={`Logo for ${role.journal}`} />
                            </div>
                            <div className="p-8 flex flex-col justify-between md:w-2/3">
                                <div>
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-2 mb-2">
                                        <h3 className="text-2xl font-bold text-brand-dark leading-tight">{role.journal}</h3>
                                    </div>
                                    <p className="block text-sm font-semibold text-yellow-500 uppercase tracking-wide">{role.role} ({role.startDate} - {role.endDate})</p>
                                    
                                    <p className="mt-4 text-brand-gray text-base">{role.description}</p>

                                    <ul className="mt-5 list-none space-y-4 text-brand-gray">
                                        {role.responsibilities.map((resp, i) => (
                                            <li key={i} className="flex items-start">
                                                <div className="flex-shrink-0 mr-4 w-8 h-8 flex items-center justify-center">
                                                    {icons[i % icons.length]}
                                                </div>
                                                <span className="leading-relaxed text-sm">{resp}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mt-6">
                                    <a 
                                        href={role.journalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block bg-yellow-400 text-brand-dark font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-yellow-500 transition-colors duration-300 text-sm"
                                    >
                                        Visit Journal
                                    </a>
                                </div>
                            </div>
                        </div>
                      )
                    })}
                </div>
            </div>
        </div>
    </PageWrapper>
  );
};