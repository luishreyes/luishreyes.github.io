import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Jessica M. Gómez-Hernández',
    degree: 'M.S.',
    program: 'M.S. in Chemical Engineering',
    graduationYear: 2023,
    startedYear: 2021,
    currentPosition: 'Process Engineer Recovery Plant at Smurfit Westrock',
    linkedinUrl: 'https://www.linkedin.com/in/jessica-maria-gomez-hernandez-a6b07018a/',
    thesisTitle: 'Modeling, simulation, assembly, and testing of a bench-scale process for the synthesis of magnetite nanoparticles for biological and medical applications: technical and economic feasibility',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: "Despite the potential of nanotechnology, producing materials like magnetite nanoparticles at a large scale is challenging. Ensuring the right mixing conditions is crucial for quality but difficult to achieve when scaling up production."
        },
        {
            question: 'What was the approach?',
            answer: 'This research involved designing, modeling, and building a complete bench-scale system to synthesize these nanoparticles using a co-precipitation method. The system was optimized with computer simulations (COMSOL Multiphysics) and included a conical tank, inline static mixers, and a magnetic purification setup to ensure quality and reproducibility.'
        },
        {
            question: 'What were the findings?',
            answer: 'The developed system successfully produced uniform, high-quality nanoparticles. A detailed technical and economic feasibility analysis demonstrated that the proposed process is both technologically sound and economically viable for scaling up to full industrial production, paving the way for their use in biomedical applications.'
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5733.jpg',
};

export default student;