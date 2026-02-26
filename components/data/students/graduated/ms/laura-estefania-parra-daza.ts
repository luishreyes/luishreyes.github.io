import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Laura Estefania Parra Daza',
    degree: 'M.S.',
    program: 'M.S. in Chemical Engineering',
    graduationYear: 2023,
    startedYear: 2021,
    currentPosition: 'Ph.D. Student in Biotechnology at TEC de Monterrey',
    linkedinUrl: 'https://www.linkedin.com/in/lauraparradaza/',
    thesisTitle: 'Design and Assembly of a Microbial Bio-Factory for the Heterologous Expression of (2S)-Naringenin in Escherichia coli',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: '(2S)-naringenin is a healthy compound found in citrus, but producing it commercially is difficult. Using bacteria like E. coli as "bio-factories" is a promising alternative, but yields are often low. A key challenge is understanding how fermentation conditions, like oxygen levels, affect production.'
        },
        {
            question: 'What was the approach?',
            answer: 'This study rationally designed a microbial bio-factory in E. coli to produce naringenin. Using computational tools (OptStoic and MinFlux), the researchers identified the most efficient genetic pathway. They then tested how different oxygen levels impacted naringenin production at both lab and pilot scales and analyzed the expression of key genes.'
        },
        {
            question: 'What were the findings?',
            answer: 'The research successfully assembled the bio-factory and found that oxygen transfer is a critical factor. They discovered that specific oxygen levels trigger different gene expression patterns, directly influencing the final yield. By optimizing these conditions, they significantly increased naringenin production, providing a clear strategy for scaling up the sustainable production of this valuable compound.'
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5735.JPG',
};

export default student;