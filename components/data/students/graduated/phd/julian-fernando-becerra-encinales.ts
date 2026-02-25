import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Julián Fernando Becerra-Encinales',
    degree: 'Doctor',
    program: 'Doctor in Technological Innovation Management',
    graduationYear: 2025,
    startedYear: 2021,
    currentPosition: 'Director of Technological Extension at Cenipalma',
    thesisTitle: 'Systemic Management Model for Technological Extension in Oil Palm Cultivation in Colombia: An Integrative and Evidence-Based Approach',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: 'Technological extension in developing countries, especially for complex crops like oil palm, is often inefficient and doesn\'t adapt to local needs, limiting sustainability and productivity.'
        },
        {
            question: 'What was the approach?',
            answer: 'This research used a mixed-methods approach, combining a literature review, cluster analysis of sustainability data from 3,808 Colombian oil palm producers, and a system dynamics model to create a comprehensive management framework.'
        },
        {
            question: 'What were the findings?',
            answer: 'The study identified key barriers to technology adoption and segmented producers into distinct typologies based on their sustainability performance. It developed a practical, systemic model and an operational protocol for Cenipalma (the leading research institute) to implement more targeted, effective, and adaptive extension strategies, moving beyond one-size-fits-all approaches.'
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/Julian%20Fernando%20Becerra-Encinales.JPG',
};

export default student;