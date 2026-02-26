import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Catalina García Rondón',
    degree: 'M.S.',
    program: 'M.S. in Product and Process Design at Universidad de Los Andes',
    graduationYear: 2023,
    startedYear: 2021,
    currentPosition: 'Quality and Innovation Analyst at Natura',
    linkedinUrl: 'https://www.linkedin.com/in/catalina-garc%C3%ADa-rond%C3%B3n-b47896178/',
    thesisTitle: 'Design and Evaluation of a Hair Mousse Composed of a Synthetic Peptide with Antifungal Action Against Trichophyton rubrum and Candida spp.',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: 'Common scalp fungal infections are often treated with topical products that can cause irritation and other side effects. There was a need for a safer, more effective, and user-friendly alternative to existing treatments.'
        },
        {
            question: 'What was the approach?',
            answer: 'This project involved designing a cosmetic hair mousse formulated with a custom synthetic peptide (KS22). The peptide was specifically chosen for its antifungal properties. The team then evaluated the mousse for its physical stability (like bubble size and uniformity) and its effectiveness in inhibiting the growth of fungi responsible for scalp infections, such as T. rubrum and Candida spp.'
        },
        {
            question: 'What were the findings?',
            answer: 'The newly developed hair mousse was stable and demonstrated significant antifungal activity against the target fungi in lab tests. The study successfully showed that a peptide-based cosmetic product can be an effective and gentle alternative to conventional antifungal treatments, offering a sustainable, bioactive solution for the hair care industry.'
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5737.JPG',
};

export default student;