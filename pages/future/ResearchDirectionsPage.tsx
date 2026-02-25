import React from 'react';
import { PageWrapper } from '../../components/PageWrapper';

export const ResearchDirectionsPage: React.FC = () => {
  return (
    <PageWrapper noPadding>
        <div className="pt-16">
            <div className="sticky top-16 bg-zinc-50/95 backdrop-blur-sm z-20 py-6 border-b border-zinc-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark text-left">Future Research Directions</h1>
                </div>
            </div>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white p-12 rounded-lg shadow-lg border border-yellow-400/40">
                <p className="text-brand-gray leading-relaxed text-lg">
                    My future research will focus on the intersection of synthetic biology and machine learning to design intelligent microbial cell factories. We aim to develop self-regulating biosystems capable of adapting to environmental changes for the sustainable and efficient production of next-generation chemicals and therapeutics. Key areas include developing robust genetic circuits, exploring non-model organisms, and creating predictive models of cell metabolism.
                </p>
                </div>
            </div>
        </div>
    </PageWrapper>
  );
};