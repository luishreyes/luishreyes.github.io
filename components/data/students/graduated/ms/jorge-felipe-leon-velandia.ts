import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Jorge Felipe León Velandia',
    degree: 'M.S.',
    program: 'M.S. in Product and Process Design at Universidad de Los Andes',
    graduationYear: 2022,
    startedYear: 2020,
    currentPosition: 'Project Management Consultant, Desechables Los Ángeles, Bogotá, Colombia',
    thesisTitle: 'Preparation, Sensory and Physicochemical Analysis of Rice Masato Enriched with Blueberries',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: "Traditional fermented beverages like 'masato' are popular but often face consumer concerns about inconsistent quality, sanitation, and high sugar content. This project aimed to create an improved, healthier version of rice masato by enriching it with blueberries and standardizing its production."
        },
        {
            question: 'What was the approach?',
            answer: "The research involved developing a new masato formulation that incorporated blueberries for their antioxidant properties. The team conducted a thorough analysis, comparing their new beverage to a commercial sample. They measured key chemical properties (like sugar content, pH, and alcohol level), tested its antioxidant activity, and performed a sensory analysis with 45 participants to gauge consumer acceptance."
        },
        {
            question: 'What were the findings?',
            answer: "The study successfully created a healthier masato with higher antioxidant activity and lower sugar content that was still well-received by consumers. The enriched beverage showed similar physicochemical properties to the commercial version but with added health benefits from the blueberries. Sensory analysis revealed a positive response, even with a more sour taste. The project concluded that producing this innovative, healthier masato is not only technically feasible but also economically viable for production expansion."
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5766.JPG',
};

export default student;