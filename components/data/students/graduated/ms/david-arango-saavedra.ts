import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'David Arango Saavedra',
    degree: 'M.S.',
    program: { en: 'M.S. in Biomedical Engineering', es: 'M.S. en Ingeniería Biomédica' },
    graduationYear: 2021,
    startedYear: 2019,
    currentPosition: { en: 'Sr Site Activation Coordinator at IQVIA', es: 'Coordinador Sénior de Activación de Sitios en IQVIA' },
    thesisTitle: 'Magnetic Nanoparticle Platform Development for Genetic Edition of Neurodegenerative Diseases',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: 'Gene therapies like CRISPR offer promise for treating neurodegenerative diseases like Parkinson\'s, but safely delivering the gene-editing tools into brain cells is a major challenge. A versatile and adaptable delivery system is needed.', es: 'Las terapias génicas como CRISPR resultan prometedoras para tratar enfermedades neurodegenerativas como el párkinson, pero entregar de forma segura las herramientas de edición génica en las células cerebrales es un gran reto. Se necesita un sistema de entrega versátil y adaptable.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'This research developed a delivery platform using magnetic nanoparticles designed to carry CRISPR gene therapy tools. The nanocarrier was engineered with a cell-penetrating peptide (OmpA) and a pH-sensitive linker to ensure controlled release of the genetic cargo inside the cell.', es: 'Esta investigación desarrolló una plataforma de entrega basada en nanopartículas magnéticas diseñadas para transportar herramientas de terapia génica CRISPR. El nanoacarreador se construyó con un péptido penetrante de célula (OmpA) y un enlazador sensible al pH para asegurar la liberación controlada de la carga genética dentro de la célula.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: 'The study successfully designed and characterized a magnetic nanoparticle-based platform capable of carrying gene-editing tools. This work established a versatile system for delivering CRISPR-based therapies, laying the groundwork for future in-vivo testing and the development of new treatments for neurodegenerative diseases.', es: 'El estudio logró diseñar y caracterizar una plataforma basada en nanopartículas magnéticas capaz de transportar herramientas de edición génica. Este trabajo estableció un sistema versátil para entregar terapias basadas en CRISPR, sentando las bases para futuras pruebas in vivo y el desarrollo de nuevos tratamientos contra enfermedades neurodegenerativas.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/David%20Arango%20Saavedra.JPG',
};

export default student;
