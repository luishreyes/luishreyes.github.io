import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Maria Camila Henao',
    degree: 'M.S.',
    program: 'M.S. in Chemical Engineering',
    graduationYear: 2022,
    startedYear: 2020,
    currentPosition: 'Scientist at VaxThera',
    thesisTitle: 'Discovery and Validation of Novel Cell-Penetrating Peptides from the SARS-CoV-2 Spike Glycoprotein for Biomedical Applications',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: 'Delivering drugs and other therapeutic molecules inside human cells is a major challenge, as cells have protective membranes that are difficult to cross. This research sought a new "key" to unlock these cellular doors, drawing inspiration from how viruses naturally invade cells.'
        },
        {
            question: 'What was the approach?',
            answer: "The study focused on the spike protein of the SARS-CoV-2 virus, the tool it uses to enter human cells. Using advanced computer simulations, the team identified small fragments of the spike protein (peptides) with the potential to act as cell-penetrating agents. The most promising candidates were then synthesized, attached to nanoparticles, and tested for their ability to carry a cargo into living cells in a laboratory setting."
        },
        {
            question: 'What were the findings?',
            answer: "A novel peptide, named AHB-1, was discovered and validated as a highly effective cell-penetrating agent. The study confirmed that nanoparticles carrying AHB-1 could safely and efficiently enter cells and reach the cell's interior (cytosol), demonstrating its strong potential as a new tool for developing advanced and targeted drug delivery systems."
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5759.JPG',
};

export default student;