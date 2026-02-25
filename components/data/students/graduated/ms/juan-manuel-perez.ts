import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Juan Manuel Perez',
    degree: 'M.S.',
    program: 'M.S. in Product and Process Design at Universidad de Los Andes',
    graduationYear: 2023,
    startedYear: 2021,
    currentPosition: 'Founder at Insuaecol',
    thesisTitle: 'Extraction of Amino Acids from Soybean Cake Through Enzymatic Hydrolysis for Fertilizer Production',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: 'Traditional agricultural fertilizers are often expensive and can be harmful to the environment. This project sought to create a sustainable and cost-effective alternative by upcycling a common agricultural byproduct: soybean cake.'
        },
        {
            question: 'What was the approach?',
            answer: 'The research focused on extracting valuable amino acids from soybean cake, which is the protein-rich residue left after oil extraction. Using a process called enzymatic hydrolysis, the proteins were broken down into amino acids, which can act as powerful biostimulants for plants. The effectiveness of this new natural fertilizer was then tested in a real-world field trial on a potato crop.'
        },
        {
            question: 'What were the findings?',
            answer: 'The method was highly successful. The enzymatic process efficiently converted the waste soybean cake into a nutrient-rich amino acid solution. When applied to potato plants, this natural fertilizer led to a significant increase in both the size and quantity of the harvested potatoes. This study demonstrates a viable circular economy model, turning agricultural waste into a high-value product that can improve crop yields sustainably.'
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5747.JPG',
};

export default student;