
import React from 'react';
import type { ResearchArea } from '../../types';
import type { Localized } from '../../context/i18n';

export interface ResearchLine {
    id: ResearchArea;
    title: Localized;
    description: Localized;
    icon: React.ReactElement;
}

export const researchLinesMap: Record<ResearchArea, ResearchLine> = {
  'Bioprocess Engineering': {
    id: 'Bioprocess Engineering',
    title: { en: 'Bioprocess Engineering', es: 'Ingeniería de Bioprocesos' },
    description: {
      en: "We design, optimize, and scale-up biological processes that use microorganisms or cells as microscopic factories. Our work spans from lab-scale reactor design to industrial biomanufacturing, ensuring efficient and sustainable production of valuable bioproducts.",
      es: "Diseño, optimizo y escalo procesos biológicos que emplean microorganismos o células como fábricas microscópicas. Mi trabajo abarca desde el diseño de reactores a escala de laboratorio hasta la biomanufactura industrial, asegurando una producción eficiente y sostenible de bioproductos de valor.",
    },
    icon: React.createElement('img', { src: "https://cdn-icons-png.flaticon.com/512/15395/15395283.png", alt: "Bioprocess Engineering Icon", className: "h-8 w-8" })
  },
  'Computational Biology & AI-Driven Design': {
    id: 'Computational Biology & AI-Driven Design',
    title: { en: 'Computational Biology & AI-Driven Design', es: 'Biología Computacional y Diseño Asistido por IA' },
    description: {
      en: "We harness the power of artificial intelligence and computational modeling to revolutionize biological design. By developing and applying advanced algorithms, we predict the function of novel biomolecules, simulate complex biological systems, and rationally engineer microbes, dramatically accelerating the design-build-test-learn cycle.",
      es: "Aprovecho el poder de la inteligencia artificial y el modelado computacional para revolucionar el diseño biológico. Desarrollando y aplicando algoritmos avanzados, predigo la función de biomoléculas novedosas, simulo sistemas biológicos complejos y diseño microbios de forma racional, acelerando notablemente el ciclo diseñar-construir-probar-aprender.",
    },
    icon: React.createElement('img', { src: "https://cdn-icons-png.flaticon.com/512/10874/10874805.png", alt: "Computational Biology & AI Icon", className: "h-8 w-8" })
  },
  'Molecular & Synthetic Biology': {
    id: 'Molecular & Synthetic Biology',
    title: { en: 'Molecular & Synthetic Biology', es: 'Biología Molecular y Sintética' },
    description: {
      en: "At the core of our research, we engineer the genetic code of life. By designing and assembling novel DNA circuits and metabolic pathways, we reprogram microorganisms to perform new functions and produce high-value compounds for medicine, industry, and sustainability.",
      es: "En el núcleo de mi investigación, edito el código genético de la vida. Diseñando y ensamblando circuitos de ADN y rutas metabólicas novedosas, reprogramo microorganismos para que cumplan nuevas funciones y produzcan compuestos de alto valor para la medicina, la industria y la sostenibilidad.",
    },
    icon: React.createElement('img', { src: "https://cdn-icons-png.flaticon.com/512/3207/3207536.png", alt: "Molecular and Synthetic Biology Icon", className: "h-8 w-8" })
  },
   'Multisensory Experience Design': {
    id: 'Multisensory Experience Design',
    title: { en: 'Multisensory Experience Design', es: 'Diseño de Experiencias Multisensoriales' },
    description: {
      en: "We investigate how the interplay of senses—such as sound, smell, and sight—shapes human perception and behavior. By leveraging crossmodal correspondences and computational models, we design immersive sensory experiences that enhance consumer products, promote well-being, and drive sustainable choices.",
      es: "Investigo cómo la interacción de los sentidos —como el oído, el olfato y la vista— moldea la percepción y el comportamiento humanos. Aprovechando las correspondencias crossmodales y modelos computacionales, diseño experiencias sensoriales inmersivas que enriquecen los productos de consumo, promueven el bienestar e impulsan decisiones sostenibles.",
    },
    icon: React.createElement('img', { src: "https://cdn-icons-png.flaticon.com/512/17859/17859750.png", alt: "Multisensory Icon", className: "h-8 w-8" })
  },
  'Reverse Engineering of Microorganisms': {
    id: 'Reverse Engineering of Microorganisms',
    title: { en: 'Reverse Engineering of Microorganisms', es: 'Ingeniería Inversa de Microorganismos' },
    description: {
      en: "We explore nature's evolutionary genius to create improved microorganisms. Using techniques like adaptive laboratory evolution and high-throughput screening of genomic libraries, we discover and harness the genetic traits that enable microbes to thrive under industrial stress and become super-producers of valuable bioproducts.",
      es: "Exploro el genio evolutivo de la naturaleza para crear microorganismos mejorados. Mediante técnicas como la evolución adaptativa de laboratorio y el tamizaje de alto rendimiento de bibliotecas genómicas, descubro y aprovecho los rasgos genéticos que permiten a los microbios prosperar bajo estrés industrial y convertirse en superproductores de bioproductos valiosos.",
    },
    icon: React.createElement('img', { src: "https://cdn-icons-png.flaticon.com/512/15723/15723218.png", alt: "Reverse Engineering Icon", className: "h-8 w-8" })
  },
  'Scholarship of Teaching & Learning': {
    id: 'Scholarship of Teaching & Learning',
    title: { en: 'Scholarship of Teaching & Learning', es: 'Investigación sobre la Enseñanza y el Aprendizaje' },
    description: {
      en: "Research on teaching and learning practices to improve educational outcomes.",
      es: "Investigación sobre las prácticas de enseñanza y aprendizaje para mejorar los resultados educativos.",
    },
    icon: React.createElement('img', { src: "https://cdn-icons-png.flaticon.com/512/9552/9552474.png", alt: "SOTL Icon", className: "h-8 w-8" })
  },
  'Smart Biomaterials & Nanobiotechnology': {
    id: 'Smart Biomaterials & Nanobiotechnology',
    title: { en: 'Smart Biomaterials & Nanobiotechnology', es: 'Biomateriales Inteligentes y Nanobiotecnología' },
    description: {
      en: "We engineer intelligent materials at the nanoscale for biomedical breakthroughs. Our work includes creating 'smart' hydrogels that respond to bodily cues, designing nanocarriers for precision drug and gene delivery, and developing advanced biomaterials that promote tissue regeneration and repair.",
      es: "Diseño materiales inteligentes a escala nanométrica para lograr avances biomédicos. Mi trabajo incluye crear hidrogeles «inteligentes» que responden a señales del organismo, diseñar nanovehículos para la entrega precisa de fármacos y genes, y desarrollar biomateriales avanzados que promueven la regeneración y reparación de tejidos.",
    },
    icon: React.createElement('img', { src: "https://cdn-icons-png.flaticon.com/512/4149/4149585.png", alt: "Smart Biomaterials Icon", className: "h-8 w-8" })
  },
  'Sustainability & Circular Economy': {
    id: 'Sustainability & Circular Economy',
    title: { en: 'Sustainability & Circular Economy', es: 'Sostenibilidad y Economía Circular' },
    description: {
      en: "Our research is committed to a sustainable future by developing biotechnologies for a circular economy. We focus on transforming industrial and agricultural waste into high-value products, engineering microbes for next-generation biofuel production, and designing integrated bioprocesses that minimize environmental impact and maximize resource efficiency.",
      es: "Mi investigación se compromete con un futuro sostenible mediante el desarrollo de biotecnologías para una economía circular. Me enfoco en transformar residuos industriales y agrícolas en productos de alto valor, diseñar microbios para la producción de biocombustibles de nueva generación y crear bioprocesos integrados que minimicen el impacto ambiental y maximicen la eficiencia de los recursos.",
    },
    icon: React.createElement('img', { src: "https://cdn-icons-png.flaticon.com/512/2391/2391086.png", alt: "Sustainability Icon", className: "h-8 w-8" })
  },
};

export const researchLines = Object.values(researchLinesMap).filter(
    (line) => line.id !== 'Scholarship of Teaching & Learning'
);
