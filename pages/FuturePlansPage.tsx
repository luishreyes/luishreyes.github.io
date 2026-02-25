import React from 'react';
import { PageWrapper } from '../components/PageWrapper';

export const FuturePlansPage: React.FC = () => {
  return (
    <PageWrapper title="Future Plans" maxWidth="max-w-4xl">
        <div>
            <h2 className="text-2xl font-semibold text-brand-dark">Research Directions</h2>
            <p className="mt-4 text-brand-gray leading-relaxed">
                My future research will focus on the intersection of synthetic biology and machine learning to design intelligent microbial cell factories. We aim to develop self-regulating biosystems capable of adapting to environmental changes for the sustainable and efficient production of next-generation chemicals and therapeutics. Key areas include developing robust genetic circuits, exploring non-model organisms, and creating predictive models of cell metabolism.
            </p>

            <h2 className="text-2xl font-semibold text-brand-dark mt-12">Collaboration & Mentorship</h2>
            <p className="mt-4 text-brand-gray leading-relaxed">
                I am always open to new collaborations with academic and industry partners who share a passion for tackling grand challenges in health and sustainability. My goal is to build interdisciplinary teams to accelerate scientific discovery and its translation into impactful technologies. Furthermore, I am committed to mentoring a diverse group of students and postdoctoral researchers, providing them with the skills and support needed to become independent scientific leaders.
            </p>
        </div>
    </PageWrapper>
  );
};