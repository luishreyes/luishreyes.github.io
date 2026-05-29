import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Jorge Luis Patarroyo',
    degree: 'M.S.',
    program: { en: 'M.S. in Chemical Engineering', es: 'M.S. en Ingeniería Química' },
    graduationYear: 2022,
    startedYear: 2020,
    currentPosition: { en: 'Senior Clinical Data Manager at MSD LATAM', es: 'Gerente Sénior de Datos Clínicos en MSD LATAM' },
    linkedinUrl: 'https://www.linkedin.com/in/jorge-luis-patarroyo-5391401a2/',
    thesisTitle: 'Novel antibacterial hydrogels based on gelatin/polyvinyl-alcohol and graphene oxide/silver nanoconjugates: formulation, characterization, and preliminary biocompatibility evaluation',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: "With antibiotic resistance rising, even common skin infections are becoming hard to treat. We need new antibacterial solutions that are effective and safe.", es: 'Con la resistencia a los antibióticos en aumento, incluso las infecciones cutáneas comunes se están volviendo difíciles de tratar. Necesitamos nuevas soluciones antibacterianas que sean eficaces y seguras.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: "This research developed a new hydrogel—a soft, skin-friendly gel—for topical treatment. The gel was made from natural polymers and loaded with a powerful nanomaterial: tiny silver nanoparticles (known for killing germs) attached to sheets of graphene oxide. The team then tested its stability, safety, and bacteria-killing power.", es: 'Esta investigación desarrolló un nuevo hidrogel —un gel suave y amable con la piel— para tratamiento tópico. El gel se elaboró con polímeros naturales y se cargó con un potente nanomaterial: diminutas nanopartículas de plata (conocidas por eliminar gérmenes) ancladas a láminas de óxido de grafeno. Luego, el equipo evaluó su estabilidad, seguridad y capacidad para eliminar bacterias.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: "The hydrogel was highly effective, completely stopping the growth of harmful bacteria like E. coli and S. aureus. It was also proven to be biocompatible and safe for contact with human cells and blood. This work creates a promising new tool for wound dressings and skin infection treatments that can serve as an alternative to traditional antibiotics.", es: 'El hidrogel fue muy eficaz, deteniendo por completo el crecimiento de bacterias dañinas como E. coli y S. aureus. También demostró ser biocompatible y seguro en contacto con células humanas y sangre. Este trabajo crea una prometedora nueva herramienta para apósitos de heridas y tratamientos de infecciones cutáneas que puede servir como alternativa a los antibióticos tradicionales.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5757.JPG',
};

export default student;
