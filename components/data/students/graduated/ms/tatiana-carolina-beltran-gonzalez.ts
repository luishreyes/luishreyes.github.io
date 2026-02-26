import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Tatiana Carolina Beltrán González',
    degree: 'M.S.',
    program: 'M.S. in Biomedical Engineering',
    graduationYear: 2022,
    startedYear: 2020,
    currentPosition: 'Teacher at Liceo Boston',
    linkedinUrl: 'https://www.linkedin.com/in/tatiana-beltrang/',
    thesisTitle: 'Development of a Nanoplatform for the Efficient Intracellular Delivery of Linearized Nucleic Acids: Applications in Gene Therapy',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: 'Gene therapies like CRISPR/Cas9 need a safe and efficient way to deliver genetic material into target cells. While non-viral vectors (like nanoparticles) are safer than viruses, they often struggle with low efficiency and toxicity.'
        },
        {
            question: 'What was the approach?',
            answer: 'This research developed a smart "nanoplatform" using a magnetic nanoparticle core. The nanoparticle was coated with molecules to help it penetrate cells and a special, reducible disulfide bond that acts as a "smart lock." This lock was used to attach a DNA tag, which in turn could carry the therapeutic genetic material. The platform was also armed with a protein (OmpA) to help it escape cellular traps.'
        },
        {
            question: 'What were the findings?',
            answer: 'The nanoplatform was successfully constructed and showed high biocompatibility. It demonstrated the ability to effectively enter cells, escape cellular compartments, and release its cargo in response to the internal cell environment. This study provides a versatile and promising new vehicle for delivering linear nucleic acids, advancing the potential of gene therapy applications.'
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5753.JPG',
};

export default student;