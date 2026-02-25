import React from 'react';
import { PageWrapper } from '../../components/PageWrapper';

export const CollaborationPage: React.FC = () => {
  return (
    <PageWrapper noPadding>
        <div className="pt-16">
            <div className="sticky top-16 bg-zinc-50/95 backdrop-blur-sm z-20 py-6 border-b border-zinc-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark text-left">Collaboration & Mentorship</h1>
                </div>
            </div>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white p-12 rounded-lg shadow-lg border border-yellow-400/40">
                    <p className="text-brand-gray leading-relaxed text-lg">
                        I am always open to new collaborations with academic and industry partners who share a passion for tackling grand challenges in health and sustainability. My goal is to build interdisciplinary teams to accelerate scientific discovery and its translation into impactful technologies. Furthermore, I am committed to mentoring a diverse group of students and postdoctoral researchers, providing them with the skills and support needed to become independent scientific leaders.
                    </p>
                </div>
            </div>
        </div>
    </PageWrapper>
  );
};