
import React from 'react';
import type { ResearchArea } from '../../types';

export interface ResearchLine {
    id: ResearchArea;
    title: string;
    description: string;
    icon: React.ReactElement;
}

export const researchLinesMap: Record<ResearchArea, ResearchLine> = {
  'Bioprocess Engineering': {
    id: 'Bioprocess Engineering',
    title: 'Bioprocess Engineering',
    description: "We design, optimize, and scale-up biological processes that use microorganisms or cells as microscopic factories. Our work spans from lab-scale reactor design to industrial biomanufacturing, ensuring efficient and sustainable production of valuable bioproducts.",
    icon: React.createElement('img', { src: "https://cdn-icons-png.flaticon.com/512/15395/15395283.png", alt: "Bioprocess Engineering Icon", className: "h-8 w-8" })
  },
  'Computational Biology & AI-Driven Design': {
    id: 'Computational Biology & AI-Driven Design',
    title: 'Computational Biology & AI-Driven Design',
    description: "We harness the power of artificial intelligence and computational modeling to revolutionize biological design. By developing and applying advanced algorithms, we predict the function of novel biomolecules, simulate complex biological systems, and rationally engineer microbes, dramatically accelerating the design-build-test-learn cycle.",
    icon: React.createElement('img', { src: "https://cdn-icons-png.flaticon.com/512/10874/10874805.png", alt: "Computational Biology & AI Icon", className: "h-8 w-8" })
  },
  'Molecular & Synthetic Biology': {
    id: 'Molecular & Synthetic Biology',
    title: 'Molecular & Synthetic Biology',
    description: "At the core of our research, we engineer the genetic code of life. By designing and assembling novel DNA circuits and metabolic pathways, we reprogram microorganisms to perform new functions and produce high-value compounds for medicine, industry, and sustainability.",
    icon: React.createElement('img', { src: "https://cdn-icons-png.flaticon.com/512/3207/3207536.png", alt: "Molecular and Synthetic Biology Icon", className: "h-8 w-8" })
  },
   'Multisensory Experience Design': {
    id: 'Multisensory Experience Design',
    title: 'Multisensory Experience Design',
    description: "We investigate how the interplay of senses—such as sound, smell, and sight—shapes human perception and behavior. By leveraging crossmodal correspondences and computational models, we design immersive sensory experiences that enhance consumer products, promote well-being, and drive sustainable choices.",
    icon: React.createElement('img', { src: "https://cdn-icons-png.flaticon.com/512/17859/17859750.png", alt: "Multisensory Icon", className: "h-8 w-8" })
  },
  'Reverse Engineering of Microorganisms': {
    id: 'Reverse Engineering of Microorganisms',
    title: 'Reverse Engineering of Microorganisms',
    description: "We explore nature's evolutionary genius to create improved microorganisms. Using techniques like adaptive laboratory evolution and high-throughput screening of genomic libraries, we discover and harness the genetic traits that enable microbes to thrive under industrial stress and become super-producers of valuable bioproducts.",
    icon: React.createElement('img', { src: "https://cdn-icons-png.flaticon.com/512/15723/15723218.png", alt: "Reverse Engineering Icon", className: "h-8 w-8" })
  },
  'Scholarship of Teaching & Learning': {
    id: 'Scholarship of Teaching & Learning',
    title: 'Scholarship of Teaching & Learning',
    description: "Research on teaching and learning practices to improve educational outcomes.",
    icon: React.createElement('img', { src: "https://cdn-icons-png.flaticon.com/512/9552/9552474.png", alt: "SOTL Icon", className: "h-8 w-8" })
  },
  'Smart Biomaterials & Nanobiotechnology': {
    id: 'Smart Biomaterials & Nanobiotechnology',
    title: 'Smart Biomaterials & Nanobiotechnology',
    description: "We engineer intelligent materials at the nanoscale for biomedical breakthroughs. Our work includes creating 'smart' hydrogels that respond to bodily cues, designing nanocarriers for precision drug and gene delivery, and developing advanced biomaterials that promote tissue regeneration and repair.",
    icon: React.createElement('img', { src: "https://cdn-icons-png.flaticon.com/512/4149/4149585.png", alt: "Smart Biomaterials Icon", className: "h-8 w-8" })
  },
  'Sustainability & Circular Economy': {
    id: 'Sustainability & Circular Economy',
    title: 'Sustainability & Circular Economy',
    description: "Our research is committed to a sustainable future by developing biotechnologies for a circular economy. We focus on transforming industrial and agricultural waste into high-value products, engineering microbes for next-generation biofuel production, and designing integrated bioprocesses that minimize environmental impact and maximize resource efficiency.",
    icon: React.createElement('img', { src: "https://cdn-icons-png.flaticon.com/512/2391/2391086.png", alt: "Sustainability Icon", className: "h-8 w-8" })
  },
};

export const researchLines = Object.values(researchLinesMap).filter(
    (line) => line.id !== 'Scholarship of Teaching & Learning'
);
