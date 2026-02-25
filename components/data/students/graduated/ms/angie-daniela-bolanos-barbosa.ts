import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Angie Daniela Bolaños Barbosa',
    degree: 'M.S.',
    program: 'M.S. in Chemical Engineering',
    graduationYear: 2023,
    startedYear: 2021,
    currentPosition: 'University Tutor at Fundación Alquería Cavelier',
    thesisTitle: 'Formulation and characterization of calcium alginate capsules and different strains of the yeast Saccharomyces cerevisiae: impact on the sensory profile of fermented products obtained from a base malt wort.',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: 'Breweries constantly seek new, unique beer flavors. However, using different yeast strains to achieve this can be challenging, as some may not perform well under standard brewing conditions. The goal was to find a method to effectively use various yeast strains to create novel flavor profiles.'
        },
        {
            question: 'What was the approach?',
            answer: 'This research explored encapsulating yeast cells in tiny, porous gel beads made from calcium alginate (a natural polymer from seaweed). The study identified the optimal bead formulation for stability and then conducted fermentations using four different yeast strains—including a local wild strain—trapped inside these capsules, comparing them to traditional fermentations with free yeast.'
        },
        {
            question: 'What were the findings?',
            answer: "Yeast encapsulation proved to be a powerful tool for innovation. It significantly altered the final flavor and aroma of the beer, creating distinct sensory profiles. The technique also dramatically improved the performance of the wild yeast strain, boosting its alcohol production. The study demonstrates that encapsulation is a viable strategy for brewers to differentiate their products without needing to genetically modify the yeast."
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5804.jpeg',
};

export default student;