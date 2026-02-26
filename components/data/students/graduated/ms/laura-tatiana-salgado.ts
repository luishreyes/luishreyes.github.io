import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Laura Tatiana Salgado',
    degree: 'M.S.',
    program: 'M.S. in Biomedical Engineering',
    graduationYear: 2024,
    startedYear: 2022,
    linkedinUrl: 'https://www.linkedin.com/in/laura-tatiana-salgado-rios-18738a312/',
    thesisTitle: 'Evaluating the Impact of Cell-Penetrating Motif Position on the Cellular Uptake of Magnetite Nanoparticles',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: "To improve drug delivery, scientists often attach cell-penetrating peptides (CPPs) to nanoparticles to help them enter cells. However, it was unclear how the specific placement of the peptide's active part, or 'motif,' affects its performance. This study aimed to determine the optimal design for these molecular keys."
        },
        {
            question: 'What was the approach?',
            answer: "We rationally designed three peptides, each containing the same cell-penetrating motif but placed at the beginning, middle, or end of the peptide chain. We attached these to magnetic nanoparticles and systematically tested how well they were absorbed by cells and if they could escape cellular traps."
        },
        {
            question: 'What were the findings?',
            answer: "Design matters—a lot. The nanoparticle with the peptide where the motif was at the very beginning (N-terminus) was significantly better at entering cells and escaping entrapment. This provides a clear design rule for engineering more effective CPP-based drug delivery vehicles."
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/Laura%20Tatiana%20Salgado.JPG',
};

export default student;