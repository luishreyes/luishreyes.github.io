import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Jonatan Garcia Mape',
    degree: 'M.S.',
    program: 'M.S. in Product and Process Design at Universidad de Los Andes',
    graduationYear: 2023,
    startedYear: 2021,
    currentPosition: 'Head of Supply Chain at Waruwa',
    linkedinUrl: 'https://www.linkedin.com/in/jonatan-garcia-mape-0237ab194/',
    thesisTitle: "Development of Nanobioconjugates from Magnetite Nanoparticles (MNPs) as a Transport Vehicle for Idebenone (IDE) and Study of Their Antioxidant Capacity",
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: "Idebenone, a powerful antioxidant used in treating various diseases, is difficult for the body to absorb because it's greasy and doesn't dissolve well in water. This limits its effectiveness when taken orally or applied topically."
        },
        {
            question: 'What was the approach?',
            answer: "This project designed a nanoscale delivery system. Tiny magnetic nanoparticles were coated with stabilizing molecules and then loaded with Idebenone. This 'nanobioconjugate' was engineered to be a stable and effective vehicle to transport the antioxidant. The team used advanced spectroscopic and analytical techniques to verify each step and test the final product's antioxidant power."
        },
        {
            question: 'What were the findings?',
            answer: "The strategy was highly successful. The created nanobioconjugates were stable and demonstrated outstanding antioxidant activity, effectively neutralizing harmful free radicals in lab tests. This research provides a promising new platform for delivering tricky but potent drugs like Idebenone, potentially leading to more effective treatments by improving the drug's bioavailability."
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5744.jpg',
};

export default student;