import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Laura Daniela León',
    degree: 'M.S.',
    program: 'M.S. in Technology Innovation Management',
    graduationYear: 2026,
    startedYear: 2024,
    currentPosition: '',
    linkedinUrl: '',
    thesisTitle: 'Design of an Evaluation Methodology for Generative AI Tools in University Education',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: 'Generative AI tools are being rapidly adopted in university classrooms, but there is no systematic way to evaluate whether a specific tool is appropriate for a given educational context. Institutions are making adoption decisions without rigorous, reproducible criteria.'
        },
        {
            question: 'What was the approach?',
            answer: 'This work designed and validated a structured evaluation methodology grounded in innovation management frameworks. The methodology was piloted through real assessment exercises in university engineering courses, allowing iterative refinement against practical constraints.'
        },
        {
            question: 'What were the findings?',
            answer: 'The resulting methodology provides a criterion-based, reproducible process that enables educational institutions to systematically assess and responsibly adopt generative AI tools, balancing pedagogical effectiveness with ethical and practical considerations.'
        }
    ],
    imageUrl: 'https://luishreyes.github.io/images/students/laura-daniela-leon.jpg',
};

export default student;
