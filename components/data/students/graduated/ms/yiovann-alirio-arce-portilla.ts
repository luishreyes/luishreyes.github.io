import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Yiovann Alirio Arce Portilla',
    degree: 'M.S.',
    program: 'M.S. in Product and Process Design at Universidad de Los Andes',
    graduationYear: 2021,
    startedYear: 2018,
    currentPosition: undefined,
    thesisTitle: 'Formulation, Design, and Production of Craft Beer for the City of Florencia, Caquetá',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: "The craft beer market in Florencia, Caquetá, was largely unexplored, with consumers having limited access to locally produced, high-quality beers. The challenge was to understand local taste preferences and then design and formulate two new craft beers that would appeal to the regional market."
        },
        {
            question: 'What was the approach?',
            answer: "The research began with a market analysis, surveying 356 people in Florencia to identify their preferred sensory attributes in beer, such as aroma and flavor. Based on these findings, two beer styles were selected and formulated: an American Pale Ale (APA) with citrus notes and a Porter with caramel and woodsy aromas. The beers were then brewed at a pilot scale, and their chemical and microbiological properties were rigorously analyzed to ensure they met quality and safety standards."
        },
        {
            question: 'What were the findings?',
            answer: "The project successfully translated local consumer preferences into two distinct and well-formulated craft beer recipes. The APA ('La Catedral') and the Porter ('La Diosa del Chairá') both met the desired sensory profiles identified in the market research. Microbiological analysis confirmed that the beers were safe for consumption, and a financial analysis demonstrated the economic viability of producing them on a larger scale. This work provides a complete roadmap for establishing a craft brewery in the region, from consumer research to final product formulation."
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5803.jpeg',
};

export default student;