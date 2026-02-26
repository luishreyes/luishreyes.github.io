import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Weinner David Silgado Mejía',
    degree: 'M.S.',
    program: 'M.S. in Chemical Engineering',
    graduationYear: 2025,
    startedYear: 2023,
    currentPosition: undefined,
    linkedinUrl: 'https://www.linkedin.com/in/weysilgado4/',
    thesisTitle: "Potential Influence of 'ALE' Beer Fermentation with Low Flocculation through Encapsulation of Endemic Colombian Honey Yeasts",
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: "The Colombian beer industry seeks to innovate by using local ingredients to create unique products, but endemic yeasts from sources like honey often have low flocculation (they don't clump and settle well), which can be a challenge in brewing."
        },
        {
            question: 'What was the approach?',
            answer: 'This study explored encapsulating low-flocculating yeasts isolated from Colombian honeycombs in sodium alginate beads. The research involved bioprospecting for new yeast strains, developing the optimal encapsulation formula, and then conducting fermentations to analyze the sensory and chemical profile of the resulting beer.'
        },
        {
            question: 'What were the findings?',
            answer: "Four promising native yeast strains were identified. The encapsulation technique (using 2.3% w/v sodium alginate) successfully allowed these low-flocculating yeasts to be used in fermentation, creating distinct organoleptic profiles without negatively impacting alcohol production. This validates honey as a source for novel brewing yeasts and shows that encapsulation is a powerful tool to differentiate beer flavors, offering a viable alternative to imported yeast strains."
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/Weinner%20David%20Silgado%20Mejaa.JPG',
};

export default student;