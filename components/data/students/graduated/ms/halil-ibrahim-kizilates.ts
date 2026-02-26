import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Halil Ibrahim Kizilates',
    degree: 'M.S.',
    program: 'M.S. in Bioengineering at Karlsruhe Institute of Technology & Universidad de los Andes',
    graduationYear: 2025,
    startedYear: 2024,
    currentPosition: 'Business Development (Geodata) at Frankfurt',
    linkedinUrl: 'https://www.linkedin.com/in/halil-kizilates-7712491ba/',
    thesisTitle: 'Enhancing Beer Sensory Profile and Wort Fermentation through Alginate-Peptone and Polyelectrolyte Complex Yeast Encapsulation: A Novel Approach',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: "Craft brewers are always looking for ways to create unique beer flavors and make their fermentation process more efficient and reusable."
        },
        {
            question: 'What was the approach?',
            answer: "This study compared encapsulated yeast (yeast trapped in tiny gel capsules) with traditional free yeast to see how it affected beer flavor and if the capsules could be reused. Different capsule materials (alginate, polyelectrolyte complexes) were tested for strength and how they controlled the fermentation process. Advanced tools like an 'electronic nose' and 'electronic tongue' were used to analyze the sensory profiles."
        },
        {
            question: 'What were the findings?',
            answer: "Encapsulating the yeast worked wonders. The capsules significantly enhanced desirable flavor notes like bitterness, richness, and fruity aromas, making the beer more complex and appealing. The encapsulated yeast was also more efficient at converting sugar to alcohol. The study found that a specific method—homogenizing chitosan and alginate to form polyelectrolyte capsules—provided the best balance of mechanical strength, controlled fermentation, and superior sensory quality, offering a powerful new technique for brewers."
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/Halil%20Ibrahim%20Kizilates.JPG',
};

export default student;