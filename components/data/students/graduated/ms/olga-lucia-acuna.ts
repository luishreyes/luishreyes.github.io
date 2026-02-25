import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Olga Lucia Acuña',
    degree: 'M.S.',
    program: 'M.S. in Chemical Engineering',
    graduationYear: 2025,
    startedYear: 2023,
    currentPosition: undefined,
    thesisTitle: 'Design Study of Thermally Sensitive Liposomes Based on Soy Lecithin, Using Carbon Quantum Dots as Marker Nanoparticles',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: "Developing drug delivery systems that can release medicine exactly where needed is a major challenge. Thermosensitive liposomes (tiny fat bubbles that release their contents when heated) are promising, but they are often made from expensive synthetic materials. This project aimed to create a low-cost version using natural soy lecithin. A key hurdle was finding an effective way to track and study these new liposomes."
        },
        {
            question: 'What was the approach?',
            answer: "The research focused on creating thermosensitive liposomes from affordable soy lecithin. To make them trackable, the team incorporated tiny fluorescent nanoparticles called 'carbon quantum dots' (CQDs) inside them. They developed and compared two different methods for creating these liposomes—a traditional hydration method and a modern microfluidics technique—to see which was more efficient. They also designed and attached a special polymer chain to the liposomes to make them release their contents when heated."
        },
        {
            question: 'What were the findings?',
            answer: "The study successfully created functional, low-cost thermosensitive liposomes from soy lecithin. They demonstrated that the traditional hydration method was more efficient at encapsulating the CQD markers. The addition of the heat-sensitive polymer chain was confirmed to be the key component for temperature-triggered release. This work provides a practical and scalable methodology for developing affordable, smart drug delivery systems, using CQDs as a powerful tool for characterization."
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5782.JPG',
};

export default student;