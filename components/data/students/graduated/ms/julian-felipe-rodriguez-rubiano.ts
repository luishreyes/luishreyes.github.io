import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Julián Felipe Rodríguez Rubiano',
    degree: 'M.S.',
    program: 'M.S. in Product and Process Design at Universidad de Los Andes',
    graduationYear: 2024,
    startedYear: 2022,
    currentPosition: 'Junior Researcher at Bio D S.A',
    linkedinUrl: 'https://www.linkedin.com/in/julianfrodriguezr/',
    thesisTitle: 'Mathematical Modeling and Economic Evaluation of the Production of 1,3-Propanediol Through the Fermentation of Glycerol with Lactobacillus reuteri',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: 'The production of 1,3-propanodiol (1,3-PDO), a valuable chemical for sustainable plastics and cosmetics, is often not economically viable using bio-based methods. The challenge was to design a biotechnological process that is both technically feasible and profitable, using glycerol, an abundant waste product from the biodiesel industry.'
        },
        {
            question: 'What was the approach?',
            answer: 'The project designed and mathematically modeled a complete production process using the bacterium Lactobacillus reuteri to ferment glycerol into 1,3-PDO. This included all stages, from fermentation to complex downstream purification steps like liquid-liquid extraction and distillation, using the simulation software Aspen Plus to evaluate the entire system.'
        },
        {
            question: 'What were the findings?',
            answer: "The study demonstrated that while the base process was technically viable, it was not initially profitable. However, by proposing key optimizations—such as switching to a more efficient 'feed-batch' fermentation and creating additional value by selling the bacterial biomass as a probiotic—the project's economic outlook was transformed. The optimized process showed a strong positive Net Present Value (NPV), providing a clear pathway to turn an industrial waste stream into a high-value, sustainable chemical in a competitive and profitable way."
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5720.JPG',
};

export default student;