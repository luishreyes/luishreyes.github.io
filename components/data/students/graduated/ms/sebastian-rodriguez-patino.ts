import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Sebastián Rodríguez Patiño',
    degree: 'M.S.',
    program: 'M.S. in Product and Process Design at Universidad de Los Andes',
    graduationYear: 2023,
    startedYear: 2021,
    currentPosition: 'Head of Technology at Sika',
    thesisTitle: "Evaluation and Influence of Byproducts from Sugar Extraction and Triethanolamine Byproducts in the Manufacturing of an Additive for Portland Cement Grinding",
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: "Cement production is a huge source of CO2 emissions and uses a massive amount of energy, especially during the grinding phase. The industry needs greener solutions, which includes finding ways to use less of the most energy-intensive component, clinker, without sacrificing cement quality."
        },
        {
            question: 'What was the approach?',
            answer: "This project took a circular economy approach by creating a new high-performance additive for cement grinding using industrial waste products: byproducts from sugar refining and triethanolamine manufacturing. The team systematically tested different formulations of this new additive to see how it affected the cement's final strength and properties."
        },
        {
            question: 'What were the findings?',
            answer: "The research successfully turned industrial waste into a valuable product. The new additive significantly improved the cement grinding process and final quality, making it possible to produce high-quality cement with less clinker. This provides a practical, sustainable solution to help the cement industry reduce its carbon footprint and energy consumption."
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5749.JPG',
};

export default student;