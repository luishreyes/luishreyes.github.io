import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Carlos Emilio Torres Garay',
    degree: 'M.S.',
    program: 'M.S. in Biomedical Engineering',
    graduationYear: 2021,
    startedYear: 2019,
    currentPosition: 'Sustainability and Climate Change Manager at PwC Colombia',
    linkedinUrl: 'https://www.linkedin.com/in/carlos-emilio-torres-garay-734574169/',
    thesisTitle: 'Microfluidic Synthesis and Purification of Magnetoliposomes for Oral Drug Delivery',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: "Many drugs are hard to deliver orally because they can't easily pass through the intestinal wall. This research aimed to solve this by creating tiny, smart delivery vehicles called 'magnetoliposomes'—magnetic particles wrapped in a fatty layer—but producing them efficiently and purely has been a major challenge."
        },
        {
            question: 'What was the approach?',
            answer: 'The study designed and built a low-cost "lab-on-a-chip" system using microfluidics. This system allowed for the precise, controlled synthesis of the magnetoliposomes and included a novel magnetic purification step to separate them from leftover materials.'
        },
        {
            question: 'What were the findings?',
            answer: "The microfluidic platform was highly successful, producing uniform and biocompatible drug carriers with an impressive encapsulation efficiency of up to 90%. This work provides a scalable and cost-effective method for developing advanced oral drug delivery systems for difficult-to-transport medicines."
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5771.JPG',
};

export default student;