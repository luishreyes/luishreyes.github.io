import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Valentina Quezada Pérez',
    degree: 'M.S.',
    program: 'M.S. in Biomedical Engineering',
    graduationYear: 2022,
    startedYear: 2020,
    currentPosition: 'Researcher at Universidad de los Andes',
    linkedinUrl: 'https://www.linkedin.com/in/valentina-quezada-p%C3%A9rez/',
    thesisTitle: 'Formulation and evaluation of a peptide-based topical treatment against Fluconazole-resistant Candida sp.',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: "Fungal infections caused by drug-resistant Candida are increasingly difficult to treat. There's a need for new, effective topical therapies that can fight these infections directly on the skin without causing systemic side effects."
        },
        {
            question: 'What was the approach?',
            answer: 'This research developed a novel hydrogel-based topical treatment containing a custom-designed antifungal peptide (KS22). The hydrogel was tested for its physical stability, texture, and rheological properties to ensure it was suitable for skin application. Its effectiveness was then evaluated against drug-resistant Candida species in both standard lab tests and advanced 3D skin and cervix models.'
        },
        {
            question: 'What were the findings?',
            answer: "The peptide-infused hydrogel was highly effective, showing significant antifungal activity against resistant Candida strains. It was also found to be biocompatible, with very low toxicity to human cells and blood. The treatment worked successfully in advanced 3D models of skin and cervical infections, demonstrating its strong potential as a safe and potent new therapy for topical fungal infections."
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5755.JPG',
};

export default student;