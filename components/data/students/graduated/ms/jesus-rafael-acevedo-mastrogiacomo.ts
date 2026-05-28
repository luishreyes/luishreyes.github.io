import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Jesús Rafael Acevedo Mastrogiacomo',
    degree: 'M.S.',
    program: 'M.S. in Chemical Engineering',
    graduationYear: 2026,
    startedYear: 2024,
    currentPosition: '',
    linkedinUrl: '',
    thesisTitle: 'Adaptive Optimization via Extremum Seeking Control for the Operation of a Biological H₂S Treatment System',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: 'Biological systems that remove hydrogen sulfide (H₂S) — the compound responsible for the rotten-egg odor at facilities like hydroelectric plants — operate most efficiently at a specific, hard-to-find optimum. That optimum shifts constantly with temperature, feed concentration, and microbial dynamics, making it nearly impossible to sustain with fixed operating conditions.'
        },
        {
            question: 'What was the approach?',
            answer: 'This work applied Extremum Seeking Control (ESC), a model-free adaptive optimization strategy, to automatically search for and track the optimal operating point of a biological H₂S treatment reactor in real time — no mathematical model of the bioprocess required.'
        },
        {
            question: 'What were the findings?',
            answer: 'The ESC algorithm successfully converged to near-optimal conditions and adapted dynamically as the system changed, demonstrating a robust, data-driven path to more efficient and automated odor control in industrial biotreatment facilities.'
        }
    ],
    imageUrl: 'https://luishreyes.github.io/images/students/jesus-rafael-acevedo.jpg',
};

export default student;
