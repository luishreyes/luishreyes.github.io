import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Cristian F. Rodríguez',
    degree: 'M.S.',
    program: 'M.S. in Biomedical Engineering',
    graduationYear: 2023,
    startedYear: 2021,
    currentPosition: 'Instructor Professor at Universidad de los Andes',
    thesisTitle: 'Accelerating Tissue Maturation through Magnetized Cell Spheroids: A Bioprinting Approach Enhanced by Stochastic Multiphysics Modeling in Tissue Engineering',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: 'Lab-grown tissues are crucial for testing new drugs without animals, but the process of fusing tiny cell clusters (spheroids) into functional tissue is extremely slow, taking about a week. This bottleneck makes tissue engineering impractical for many applications.'
        },
        {
            question: 'What was the approach?',
            answer: 'The research took a two-pronged approach. First, a sophisticated computer model was developed to accurately predict how spheroids fuse. Second, the team embedded tiny magnetic nanoparticles into the spheroids. By applying an external magnetic field, they could gently pull the spheroids together, dramatically speeding up the fusion process.'
        },
        {
            question: 'What were the findings?',
            answer: "The magnetic-assist technique was a remarkable success, reducing tissue fusion time from 7 days to just 2 days. This breakthrough, supported by the predictive computer model, makes biofabrication much faster and more reliable. It's a significant step toward accelerating medical research, reducing animal testing, and advancing regenerative medicine."
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5728.jpg',
};

export default student;