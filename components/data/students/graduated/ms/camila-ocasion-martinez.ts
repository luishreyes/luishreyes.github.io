import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Camila Ocasión Martinez',
    degree: 'M.S.',
    program: 'M.S. in Chemical Engineering at Universidad de Los Andes',
    graduationYear: 2021,
    startedYear: 2019,
    currentPosition: 'Director of Corporate Responsibility at Hevolución',
    thesisTitle: 'Improvement in the Functional Screening of Metagenomic Libraries',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: "The natural world is a treasure trove of undiscovered molecules that could become new medicines or industrial enzymes. Scientists use 'metagenomic libraries' to explore this genetic diversity. However, finding a useful molecule in these vast libraries is like finding a needle in a haystack—the traditional methods are slow, inefficient, and often miss the mark."
        },
        {
            question: 'What was the approach?',
            answer: "This project developed a high-tech 'searchlight' to find these needles more easily. The team designed and built tiny biological sensors, called RNA biosensors or 'riboswitches,' that can be programmed to signal when they detect a specific molecule of interest. Using a combination of computer modeling (in-silico) and laboratory experiments, they created a proof-of-concept system that could detect a health-promoting compound called naringenin."
        },
        {
            question: 'What were the findings?',
            answer: "The strategy was a success. The team created a robust and efficient method for designing these molecular sensors. The developed biosensor could successfully detect naringenin at very low concentrations, providing a clear signal. This work provides a powerful new toolkit for a scientist, making it much faster and easier to screen vast genetic libraries and accelerate the discovery of novel, valuable biomolecules."
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5777.JPG',
};

export default student;