import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Laura Sofía Hernández Díaz',
    degree: 'M.S.',
    program: 'M.S. in Product and Process Design at Universidad de Los Andes',
    graduationYear: 2024,
    startedYear: 2022,
    currentPosition: 'Improvement Management Analyst at Vitalis',
    thesisTitle: 'Identification and Characterization of Native Yeast Strains in Sugarcane Plantations in Cali, Colombia, for the Efficient Production of Ethanol in the Brewing Industry',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: "The Colombian brewing industry relies heavily on imported yeast strains, which limits product uniqueness and creates dependency. The country's rich biodiversity, particularly in sugarcane fields, is an untapped resource for native yeasts that could produce more authentic and sustainable local beers."
        },
        {
            question: 'What was the approach?',
            answer: 'This project ventured into sugarcane plantations in Cali to isolate and identify native yeast strains directly from fresh sugarcane juice. The best candidates were characterized using microbiological and genomic techniques (PCR) to confirm they belonged to the Saccharomyces genus, which is ideal for brewing. Finally, their ability to produce ethanol and desirable flavors was tested in a controlled, lab-scale fermentation.'
        },
        {
            question: 'What were the findings?',
            answer: "The research successfully identified native yeast strains capable of fermenting sugars into ethanol. The resulting product had a characteristic beer-like aroma, confirming the potential of these local microbes to create unique beverages. This study lays the groundwork for a more independent and innovative Colombian brewing industry, leveraging local biodiversity to craft authentic products and reduce reliance on imported ingredients."
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5722.JPG',
};

export default student;