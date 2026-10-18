import type { GraduatedStudent } from '../../../../types';

// Codirigida en la Maestría en Ingeniería Biomédica; su tesis se sustentó en 2023-10. La foto y el cargo
// actual los dio el profesor (18 oct 2026). El título de la tesis va como se registró, en español.
const student: GraduatedStudent = {
    name: 'Erika Alejandra Díaz Ramírez',
    degree: 'M.S.',
    program: { en: 'M.S. in Biomedical Engineering', es: 'M.S. en Ingeniería Biomédica' },
    graduationYear: 2023,
    thesisTitle: 'Síntesis y evaluación de nanobioconjugados a base de magnetita funcionalizada con péptidos translocantes para la administración de fármacos para el tratamiento de melanoma',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: 'Chemotherapy for melanoma is limited by serious side effects and by drugs that dissolve poorly. A carrier that takes the drug to the tumor cells could make the treatment work better and harm healthy tissue less.', es: 'La quimioterapia contra el melanoma se ve limitada por efectos secundarios serios y por fármacos que se disuelven mal. Un vehículo que lleve el fármaco hasta las células del tumor podría hacer más eficaz el tratamiento y dañar menos el tejido sano.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'Magnetite nanoparticles were synthesized and functionalized with translocating peptides, which help molecules cross the cell membrane, so that they could carry chemotherapy drugs into melanoma cells.', es: 'Se sintetizaron nanopartículas de magnetita y se funcionalizaron con péptidos translocantes, que ayudan a atravesar la membrana celular, para que cargaran fármacos de quimioterapia y los llevaran al interior de células de melanoma.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: 'In the article she published as first author in ACS Omega (2024), the drug-loaded nanobioconjugates were compatible with blood and more effective against melanoma cells than the free drugs, also in three-dimensional tumor models.', es: 'En el artículo que publicó como primera autora en ACS Omega (2024), los nanobioconjugados cargados resultaron compatibles con la sangre y más eficaces contra las células de melanoma que los fármacos libres, también en modelos tridimensionales de tumor.' }
        }
    ],
    currentPosition: { en: 'Field Clinical Specialist at Boston Scientific', es: 'Field Clinical Specialist en Boston Scientific' },
    imageUrl: '/images/students/erika-alejandra-diaz-ramirez.jpg',
};

export default student;
