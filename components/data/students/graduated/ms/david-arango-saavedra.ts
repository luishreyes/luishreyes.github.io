import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'David Arango Saavedra',
    degree: 'M.S.',
    program: 'M.S. in Biomedical Engineering',
    graduationYear: 2021,
    startedYear: 2019,
    currentPosition: 'Sr Site Activation Coordinator at IQVIA',
    thesisTitle: 'Magnetic Nanoparticle Platform Development for Genetic Edition of Neurodegenerative Diseases',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: 'Gene therapies like CRISPR offer promise for treating neurodegenerative diseases like Parkinson\'s, but safely delivering the gene-editing tools into brain cells is a major challenge. A versatile and adaptable delivery system is needed.'
        },
        {
            question: 'What was the approach?',
            answer: 'This research developed a delivery platform using magnetic nanoparticles designed to carry CRISPR gene therapy tools. The nanocarrier was engineered with a cell-penetrating peptide (OmpA) and a pH-sensitive linker to ensure controlled release of the genetic cargo inside the cell.'
        },
        {
            question: 'What were the findings?',
            answer: 'The study successfully designed and characterized a magnetic nanoparticle-based platform capable of carrying gene-editing tools. This work established a versatile system for delivering CRISPR-based therapies, laying the groundwork for future in-vivo testing and the development of new treatments for neurodegenerative diseases.'
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/David%20Arango%20Saavedra.JPG',
};

export default student;