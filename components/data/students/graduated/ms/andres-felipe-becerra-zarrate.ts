import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Andrés Felipe Becerra Zárrate',
    degree: 'M.S.',
    program: { en: 'M.S. in Product and Process Design at Universidad de los Andes', es: 'M.S. en Diseño de Productos y Procesos en la Universidad de los Andes' },
    graduationYear: 2024,
    currentPosition: { en: 'Customs Chemical Researcher and Analyst at the National Tax and Customs Directorate (DIAN); M.S. student in Chemical Engineering at Universidad de los Andes', es: 'Investigador y analista químico de aduanas en la Dirección de Impuestos y Aduanas Nacionales (DIAN); estudiante de la Maestría en Ingeniería Química en la Universidad de los Andes' },
    thesisTitle: 'Synthesis, Functionalization and Characterization of Silanized Magnetite Nanoparticles with PEG and Doxorubicin',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: 'Doxorubicin is a widely used chemotherapy drug, but its clinical use is limited by serious side effects and by the resistance some tumor cells develop. Carrying it on nanoparticles could deliver it more precisely, raising its effect and lowering the harm to healthy tissue.', es: 'La doxorrubicina es un quimioterapéutico muy usado, pero su uso clínico se ve limitado por efectos secundarios serios y por la resistencia que desarrollan algunas células tumorales. Llevarla sobre nanopartículas podría entregarla con más precisión, aumentar su efecto y reducir el daño al tejido sano.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'Magnetite nanoparticles were synthesized under nitrogen, coated with a silane (APTES) to add amino groups to their surface, and then linked to polyethylene glycol (PEG), which helps nanoparticles stay longer in circulation, and to doxorubicin. Each step was checked with dynamic light scattering, infrared spectroscopy and thermogravimetric analysis.', es: 'Se sintetizaron nanopartículas de magnetita bajo nitrógeno, se recubrieron con un silano (APTES) para dejar grupos amino en su superficie y luego se unieron a polietilenglicol (PEG), que ayuda a que las nanopartículas permanezcan más tiempo en circulación, y a doxorrubicina. Cada paso se verificó con dispersión dinámica de luz, espectroscopía infrarroja y análisis termogravimétrico.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: 'Infrared spectra confirmed the synthesis and silanization of the nanoparticles, and the weight lost on heating grew with each layer added to their surface, as expected. The particles kept a uniform size up to the PEG step. A band consistent with doxorubicin appeared after loading, and the study recommends further tests to confirm the drug on the surface.', es: 'Los espectros infrarrojos confirmaron la síntesis y la silanización de las nanopartículas, y la pérdida de peso al calentarlas aumentó con cada capa añadida a su superficie, como se esperaba. Las partículas mantuvieron un tamaño uniforme hasta el paso del PEG. Tras la carga apareció una banda compatible con la doxorrubicina, y el estudio recomienda más pruebas para confirmar el fármaco en la superficie.' }
        }
    ],
    imageUrl: '/images/students/andres-felipe-becerra-zarrate.jpg',
};

export default student;
