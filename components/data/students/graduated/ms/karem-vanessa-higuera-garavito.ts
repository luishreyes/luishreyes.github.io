import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Karem Vanessa Higuera Garavito',
    degree: 'M.S.',
    program: 'M.S. in Product and Process Design at Universidad de Los Andes',
    graduationYear: 2022,
    startedYear: 2020,
    currentPosition: 'Product Analyst, West Química',
    thesisTitle: 'Formulation of a Whey Protein Isolate Supplemented with 3,3-Diindolylmethane as a Result Enhancer in Fat Loss and Maintenance Programs',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: "Many health-conscious consumers use whey protein supplements. This project aimed to create an enhanced protein powder by adding 3,3'-Diindolylmethane (DIM), a natural compound found in vegetables like broccoli that helps regulate hormones and promote fat oxidation. The main challenge was that DIM is not easily absorbed by the body, so a method was needed to improve its bioavailability and stability in a protein shake."
        },
        {
            question: 'What was the approach?',
            answer: "The research focused on encapsulating DIM within whey protein molecules. Three different types of whey protein were tested to see which one formed the most stable complex with DIM. The team used advanced techniques like infrared spectroscopy to confirm the interaction between the protein and DIM, and microscopy to analyze the particle structure after spray-drying. A sensory panel was also conducted to determine which formulation was most appealing to consumers."
        },
        {
            question: 'What were the findings?',
            answer: "The study successfully demonstrated that whey protein can effectively encapsulate DIM, increasing its bioavailability through hydrophobic interactions. The sensory panel showed a clear preference for the formulation made with whey protein concentrate, which was also the most stable. The research determined the ideal spray-drying conditions to create a non-clumping powder, resulting in a final product that is both functionally enhanced and consumer-friendly."
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5768.JPG',
};

export default student;