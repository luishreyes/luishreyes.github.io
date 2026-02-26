import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Carlos Manuel Ramirez Acosta',
    degree: 'M.S.',
    program: 'M.S. in Chemical Engineering at Universidad de Los Andes',
    graduationYear: 2021,
    startedYear: 2019,
    currentPosition: 'Regional Qualification Expert at Sanofi',
    linkedinUrl: 'https://www.linkedin.com/in/carlos-manuel-ramirez-89638b198/',
    thesisTitle: 'Design, Synthesis and Evaluation of pH Responsive Bio Nanoparticles for the Guided Transport and Delivery of CRISPR/Cas9 Plasmids: A Vehicle for Highly-Targeted Gene Therapy',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: "Delivering gene therapies like CRISPR/Cas9 safely and effectively into target cells is a major challenge. Current methods can have low efficiency and potential side effects."
        },
        {
            question: 'What was the approach?',
            answer: "This research developed a sophisticated 'nanovehicle' made of a magnetic core (magnetite) and a silver shell. This nanoparticle was coated with a 'smart' pH-responsive polymer that could carry and release DNA. It was also equipped with a special peptide (Buforin II) to help it penetrate cells and escape cellular traps."
        },
        {
            question: 'What were the findings?',
            answer: "The nanovehicles were highly effective. They could load significant amounts of plasmid DNA, enter mammalian cells without causing harm, and efficiently escape the cellular compartments that typically destroy foreign materials. This work demonstrates a powerful and biocompatible platform for highly-targeted gene therapy."
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5801.jpeg',
};

export default student;