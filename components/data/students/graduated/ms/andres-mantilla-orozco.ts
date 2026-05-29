import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Andrés Mantilla-Orozco',
    degree: 'M.S.',
    program: { en: 'M.S. in Biomedical Engineering', es: 'M.S. en Ingeniería Biomédica' },
    graduationYear: 2022,
    startedYear: 2020,
    currentPosition: { en: 'Research Networks Officer - Vicerrectoría de Investigación y Creación, Universidad de los Andes', es: 'Profesional de Redes de Investigación - Vicerrectoría de Investigación y Creación, Universidad de los Andes' },
    linkedinUrl: 'https://www.linkedin.com/in/andresmantillaorozco/',
    thesisTitle: 'Modeling, simulation, and synthesis of magnetoliposomes formation by encapsulation of magnetic nanoparticles in liposomes enabled by low-cost microfluidic platforms as potential drugs delivery vehicles.',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: 'Creating advanced drug delivery vehicles called "magnetoliposomes" is complex and expensive. We needed a low-cost, efficient method to produce them and a way to predict how well the process would work.', es: 'Crear vehículos avanzados de entrega de fármacos llamados «magnetoliposomas» es complejo y costoso. Se necesitaba un método de bajo costo y eficiente para producirlos, así como una forma de predecir qué tan bien funcionaría el proceso.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'This research designed and built a low-cost "lab-on-a-chip" (microfluidic) system to create magnetoliposomes. The process was modeled using advanced computer simulations to optimize the design and predict how different fluid dynamics models would affect the encapsulation of magnetic nanoparticles inside the liposomes.', es: 'Esta investigación diseñó y construyó un sistema microfluídico de «laboratorio en un chip» de bajo costo para crear magnetoliposomas. El proceso se modeló mediante simulaciones computacionales avanzadas para optimizar el diseño y predecir cómo distintos modelos de dinámica de fluidos afectarían la encapsulación de nanopartículas magnéticas dentro de los liposomas.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: 'The study demonstrated that the microfluidic system is a viable, low-cost method for synthesis. The computer models accurately predicted the system\'s performance, showing that specific turbulence models (Euler-Euler) could significantly improve encapsulation efficiency. This provides a powerful computational tool to accelerate the design of nanomedicines.', es: 'El estudio demostró que el sistema microfluídico es un método de síntesis viable y de bajo costo. Los modelos computacionales predijeron con precisión el desempeño del sistema, mostrando que ciertos modelos de turbulencia (Euler-Euler) podían mejorar significativamente la eficiencia de encapsulación. Esto aporta una potente herramienta computacional para acelerar el diseño de nanomedicinas.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5751.JPG',
};

export default student;
