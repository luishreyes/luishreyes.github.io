import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Camila Andrea Cáceres Villamizar',
    degree: 'M.S.',
    program: 'M.S. in Product and Process Design at Universidad de Los Andes',
    graduationYear: 2022,
    startedYear: 2020,
    currentPosition: 'Commercial Chief at Bavaria',
    linkedinUrl: 'https://www.linkedin.com/in/camilaandreacv/',
    thesisTitle: 'Genome Editing of Lactobacillus bulgaricus with CRISPR-Cas9 to Increase Its Bioprotective Potential in Dairy Products',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: "Dairy products like yogurt are susceptible to spoilage from bacteria and fungi. While natural preservatives exist, they are often not produced in large enough quantities by the microorganisms used in fermentation. This project aimed to genetically engineer a common yogurt bacterium, Lactobacillus bulgaricus, to make it a super-producer of diacetyl, a natural compound that not only enhances the buttery flavor of dairy products but also acts as a powerful antimicrobial agent."
        },
        {
            question: 'What was the approach?',
            answer: "The research used the cutting-edge gene-editing tool CRISPR/Cas9 to precisely modify the bacterium's DNA. The team designed a strategy to simultaneously 'turn up' two genes (nox and alsS) that are responsible for producing diacetyl, while 'turning off' another gene (budA) that would otherwise convert the diacetyl into a less useful compound. This multi-gene editing was designed to create a synergistic effect, redirecting the bacterium's metabolism to maximize diacetyl production."
        },
        {
            question: 'What were the findings?',
            answer: "The study successfully designed a recombinant Lactobacillus bulgaricus strain with the potential for significantly increased diacetyl biosynthesis. By creating a genetic blueprint for overexpressing key production genes while simultaneously blocking a competing pathway, the research provides a powerful new strategy for developing natural bioprotectants. This work paves the way for creating dairy products with a longer shelf life and enhanced flavor, all through the power of precision genetic engineering."
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5764.jpg',
};

export default student;