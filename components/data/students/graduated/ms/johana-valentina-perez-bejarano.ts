import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Johana Valentina Pérez Bejarano',
    degree: 'M.S.',
    program: 'M.S. in Chemical Engineering at Universidad de Los Andes',
    graduationYear: 2022,
    startedYear: 2020,
    currentPosition: 'Research and development Specialist (R&D) at Grupo Danec',
    thesisTitle: 'Novel Biosurfactants: Rationally Designed Surface-Active Peptides and in silico Evaluation at the Decane-Water Interface',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: "Industrial products like detergents and cosmetics use surfactants (molecules that help oil and water mix), but most are made from petroleum and harm the environment. The goal was to design new, eco-friendly biosurfactants from peptides (short proteins) but it's hard to predict which ones will work well."
        },
        {
            question: 'What was the approach?',
            answer: "Instead of costly lab experiments, this research used powerful computer simulations (Molecular Dynamics) to design two new peptide-based biosurfactants from scratch. The computer models predicted how these new molecules would behave at the boundary between oil and water, and their performance was compared to a common commercial surfactant."
        },
        {
            question: 'What were the findings?',
            answer: "The computer simulations accurately predicted the behavior of the new biosurfactants, showing they effectively lower the tension between oil and water. The study also revealed how the peptides arrange themselves at the interface, forming clusters as their concentration increases. This work provides a powerful and efficient computational method to accelerate the design of greener, high-performance biosurfactants for a wide range of products."
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5761.JPG',
};

export default student;