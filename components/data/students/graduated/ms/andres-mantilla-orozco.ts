import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Andrés Mantilla-Orozco',
    degree: 'M.S.',
    program: 'M.S. in Biomedical Engineering',
    graduationYear: 2022,
    startedYear: 2020,
    currentPosition: 'Research Networks Officer - Vicerrectoría de Investigación y Creación, Universidad de los Andes',
    linkedinUrl: 'https://www.linkedin.com/in/andresmantillaorozco/',
    thesisTitle: 'Modeling, simulation, and synthesis of magnetoliposomes formation by encapsulation of magnetic nanoparticles in liposomes enabled by low-cost microfluidic platforms as potential drugs delivery vehicles.',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: 'Creating advanced drug delivery vehicles called "magnetoliposomes" is complex and expensive. We needed a low-cost, efficient method to produce them and a way to predict how well the process would work.'
        },
        {
            question: 'What was the approach?',
            answer: 'This research designed and built a low-cost "lab-on-a-chip" (microfluidic) system to create magnetoliposomes. The process was modeled using advanced computer simulations to optimize the design and predict how different fluid dynamics models would affect the encapsulation of magnetic nanoparticles inside the liposomes.'
        },
        {
            question: 'What were the findings?',
            answer: 'The study demonstrated that the microfluidic system is a viable, low-cost method for synthesis. The computer models accurately predicted the system\'s performance, showing that specific turbulence models (Euler-Euler) could significantly improve encapsulation efficiency. This provides a powerful computational tool to accelerate the design of nanomedicines.'
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5751.JPG',
};

export default student;