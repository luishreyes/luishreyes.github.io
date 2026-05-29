import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Weinner David Silgado Mejía',
    degree: 'M.S.',
    program: { en: 'M.S. in Chemical Engineering', es: 'M.S. en Ingeniería Química' },
    graduationYear: 2025,
    startedYear: 2023,
    currentPosition: undefined,
    linkedinUrl: 'https://www.linkedin.com/in/weysilgado4/',
    thesisTitle: "Potential Influence of 'ALE' Beer Fermentation with Low Flocculation through Encapsulation of Endemic Colombian Honey Yeasts",
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: "The Colombian beer industry seeks to innovate by using local ingredients to create unique products, but endemic yeasts from sources like honey often have low flocculation (they don't clump and settle well), which can be a challenge in brewing.", es: 'La industria cervecera colombiana busca innovar usando ingredientes locales para crear productos únicos, pero las levaduras endémicas de fuentes como la miel suelen tener baja floculación (no se agrupan ni sedimentan bien), lo que puede ser un reto en la fabricación de cerveza.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'This study explored encapsulating low-flocculating yeasts isolated from Colombian honeycombs in sodium alginate beads. The research involved bioprospecting for new yeast strains, developing the optimal encapsulation formula, and then conducting fermentations to analyze the sensory and chemical profile of the resulting beer.', es: 'Este estudio exploró la encapsulación, en esferas de alginato de sodio, de levaduras de baja floculación aisladas de panales colombianos. La investigación incluyó la bioprospección de nuevas cepas de levadura, el desarrollo de la formulación óptima de encapsulación y la realización de fermentaciones para analizar el perfil sensorial y químico de la cerveza resultante.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: "Four promising native yeast strains were identified. The encapsulation technique (using 2.3% w/v sodium alginate) successfully allowed these low-flocculating yeasts to be used in fermentation, creating distinct organoleptic profiles without negatively impacting alcohol production. This validates honey as a source for novel brewing yeasts and shows that encapsulation is a powerful tool to differentiate beer flavors, offering a viable alternative to imported yeast strains.", es: 'Se identificaron cuatro prometedoras cepas de levadura nativas. La técnica de encapsulación (con alginato de sodio al 2,3 % p/v) permitió usar con éxito estas levaduras de baja floculación en la fermentación, creando perfiles organolépticos distintivos sin afectar negativamente la producción de alcohol. Esto valida la miel como fuente de nuevas levaduras cerveceras y muestra que la encapsulación es una herramienta poderosa para diferenciar los sabores de la cerveza, ofreciendo una alternativa viable a las cepas de levadura importadas.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/Weinner%20David%20Silgado%20Mejaa.JPG',
};

export default student;
