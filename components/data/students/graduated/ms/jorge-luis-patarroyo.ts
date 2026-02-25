import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Jorge Luis Patarroyo',
    degree: 'M.S.',
    program: 'M.S. in Chemical Engineering',
    graduationYear: 2022,
    startedYear: 2020,
    currentPosition: 'Senior Clinical Data Manager at MSD LATAM',
    thesisTitle: 'Novel antibacterial hydrogels based on gelatin/polyvinyl-alcohol and graphene oxide/silver nanoconjugates: formulation, characterization, and preliminary biocompatibility evaluation',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: "With antibiotic resistance rising, even common skin infections are becoming hard to treat. We need new antibacterial solutions that are effective and safe."
        },
        {
            question: 'What was the approach?',
            answer: "This research developed a new hydrogel—a soft, skin-friendly gel—for topical treatment. The gel was made from natural polymers and loaded with a powerful nanomaterial: tiny silver nanoparticles (known for killing germs) attached to sheets of graphene oxide. The team then tested its stability, safety, and bacteria-killing power."
        },
        {
            question: 'What were the findings?',
            answer: "The hydrogel was highly effective, completely stopping the growth of harmful bacteria like E. coli and S. aureus. It was also proven to be biocompatible and safe for contact with human cells and blood. This work creates a promising new tool for wound dressings and skin infection treatments that can serve as an alternative to traditional antibiotics."
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5757.JPG',
};

export default student;