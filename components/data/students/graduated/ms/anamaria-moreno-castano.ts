import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Anamaria Moreno Castaño',
    degree: 'M.S.',
    program: 'M.S. in Product and Process Design at Universidad de Los Andes',
    graduationYear: 2023,
    startedYear: 2021,
    currentPosition: 'Clinical Data Manager at MSD',
    thesisTitle: 'Integrating In-Silico and Experimental Approaches in the Discovery of Potential Pea Protein (Pisum sativum L.) Bioactive Peptides for the Food Industry',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: 'The food industry needs new, natural additives to improve food quality and safety. Bioactive peptides from plants like peas are promising, but finding the most effective ones is a slow and difficult process. The challenge is to efficiently discover pea peptides with useful antimicrobial properties.'
        },
        {
            question: 'What was the approach?',
            answer: 'This research used a two-pronged strategy. First, a computer-based (in-silico) approach was used to simulate the breakdown of pea protein and predict which resulting peptides would have antimicrobial activity. Then, these predictions were tested in a real lab (in vitro) through experiments to see if the peptides actually stopped fungal growth.'
        },
        {
            question: 'What were the findings?',
            answer: "The study successfully identified potential antimicrobial peptides from pea protein using computer models. While the lab experiments didn't fully match the computer predictions for antifungal activity, the work highlights the importance of combining computational and experimental methods. The findings show that pea protein is a valuable source of bioactive peptides that could be used as natural food preservatives, contributing to safer and healthier food products."
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5740.JPG',
};

export default student;