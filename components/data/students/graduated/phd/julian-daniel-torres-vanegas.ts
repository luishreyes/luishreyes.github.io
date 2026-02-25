import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Julian Daniel Torres Vanegas',
    degree: 'Doctor',
    program: 'Doctor of Engineering',
    graduationYear: 2023,
    startedYear: 2019,
    currentPosition: 'Assistant Professor at Universidad EAN',
    thesisTitle: 'Rational Design of Carbon-Based Nanoplatforms for the Delivery of Therapeutic Agents: The Impact of Changing the Support and the Translocating Agent on Cell Internalization and Endosomal Escape Abilities',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: "Getting life-saving drugs inside our cells is a major challenge in medicine. Even when a drug gets in, it often gets trapped and destroyed in cellular 'recycling bins' called endosomes before it can do its job. This research aimed to design smarter, microscopic delivery vehicles that can not only carry drugs into cells but also break out of these traps."
        },
        {
            question: 'What was the approach?',
            answer: 'The study developed and tested tiny delivery vehicles, called "nanoplatforms," made from two advanced carbon materials: graphene oxide and carbon dots. To give them special "cell-unlocking" abilities, the researchers attached two different types of cell-penetrating peptides to their surface. They experimented with different chemical linkers to see which worked best and then used high-tech microscopy to watch how these nanovehicles behaved inside different types of human cells.'
        },
        {
            question: 'What were the findings?',
            answer: "The research revealed that a 'one-size-fits-all' approach doesn't work. The success of the delivery vehicle depended on a precise combination of the carbon material, the peptide, the chemical linker, and the target cell type. The study successfully created nanoplatforms that were excellent at entering cells and, in some cases, achieved up to 50% escape from the cellular traps. This work provides a valuable roadmap for rationally designing next-generation drug delivery systems, paving the way for more effective and targeted therapies."
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/Julian%20Daniel%20Torres%20Vanegas.JPG',
};

export default student;