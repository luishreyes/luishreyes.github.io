import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Daniela Rubio Olaya',
    degree: 'M.S.',
    program: 'M.S. in Biomedical Engineering',
    graduationYear: 2021,
    startedYear: 2019,
    currentPosition: 'Programs Manager at Rockstar',
    thesisTitle: "Buforin II-Escherichia coli's DNA interactome: routes to elucidate the molecular mechanisms of its antimicrobial activity",
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: "With bacteria becoming resistant to antibiotics, we need new ways to fight them. A promising molecule called Buforin II (BUFII) is known to kill bacteria by attacking their DNA, but exactly how it does this at a molecular level is unclear."
        },
        {
            question: 'What was the approach?',
            answer: "This research developed a novel technique to map out where BUFII binds to the DNA of E. coli. They attached BUFII to tiny magnetic nanoparticles, which acted as a 'hook.' When mixed with bacterial DNA, they could use a magnet to 'fish out' the specific DNA fragments attached to BUFII."
        },
        {
            question: 'What were the findings?',
            answer: "The study provided the first detailed look at this interaction, showing that BUFII causes DNA to form unique, super-coiled nanoscale structures. This deeper understanding of BUFII's mechanism is a critical step for developing it into a new antibiotic and could also be used to design new systems for gene therapy."
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5773.JPG',
};

export default student;