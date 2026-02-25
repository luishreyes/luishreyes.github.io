import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Ariel Coli',
    degree: 'M.S.',
    program: 'M.S. in Biomedical Engineering',
    graduationYear: 2023,
    startedYear: 2021,
    currentPosition: 'Ph.D. student at Saarland University, Germany',
    thesisTitle: 'Efficient Cellular Penetration and Biocompatibility of FE23-Functionalized Magnetite Nanoparticles: A Promising Platform for Targeted Drug Delivery',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: 'A major challenge in medicine is designing drug delivery vehicles that can effectively penetrate cells and escape the internal traps that destroy them, limiting the effectiveness of many therapies.'
        },
        {
            question: 'What was the approach?',
            answer: 'This research developed a novel nanocarrier by attaching a specially designed, cell-penetrating peptide (FE23) to magnetic nanoparticles. The team then rigorously tested the safety and performance of this new system in various cell lines.'
        },
        {
            question: 'What were the findings?',
            answer: 'The engineered nanocarriers were highly successful. They proved to be very safe and biocompatible, and demonstrated excellent cell penetration and the ability to escape cellular traps. This work provides a promising new platform for creating more effective and targeted drug delivery systems.'
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5726.JPG',
};

export default student;