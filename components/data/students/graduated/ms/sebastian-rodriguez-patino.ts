import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Sebastián Rodríguez Patiño',
    degree: 'M.S.',
    program: { en: 'M.S. in Product and Process Design at Universidad de Los Andes', es: 'M.S. en Diseño de Producto y Proceso en la Universidad de Los Andes' },
    graduationYear: 2023,
    startedYear: 2021,
    currentPosition: { en: 'Head of Technology at Sika', es: 'Director de Tecnología en Sika' },
    thesisTitle: "Evaluation and Influence of Byproducts from Sugar Extraction and Triethanolamine Byproducts in the Manufacturing of an Additive for Portland Cement Grinding",
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: "Cement production is a huge source of CO2 emissions and uses a massive amount of energy, especially during the grinding phase. The industry needs greener solutions, which includes finding ways to use less of the most energy-intensive component, clinker, without sacrificing cement quality.", es: 'La producción de cemento es una enorme fuente de emisiones de CO2 y consume una cantidad masiva de energía, especialmente durante la fase de molienda. La industria necesita soluciones más ecológicas, lo que incluye hallar formas de usar menos del componente más intensivo en energía, el clínker, sin sacrificar la calidad del cemento.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: "This project took a circular economy approach by creating a new high-performance additive for cement grinding using industrial waste products: byproducts from sugar refining and triethanolamine manufacturing. The team systematically tested different formulations of this new additive to see how it affected the cement's final strength and properties.", es: 'Este proyecto adoptó un enfoque de economía circular al crear un nuevo aditivo de alto desempeño para la molienda de cemento usando residuos industriales: subproductos de la refinación de azúcar y de la fabricación de trietanolamina. El equipo evaluó de forma sistemática distintas formulaciones de este nuevo aditivo para ver cómo afectaban la resistencia y las propiedades finales del cemento.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: "The research successfully turned industrial waste into a valuable product. The new additive significantly improved the cement grinding process and final quality, making it possible to produce high-quality cement with less clinker. This provides a practical, sustainable solution to help the cement industry reduce its carbon footprint and energy consumption.", es: 'La investigación logró convertir residuos industriales en un producto valioso. El nuevo aditivo mejoró significativamente el proceso de molienda y la calidad final del cemento, haciendo posible producir cemento de alta calidad con menos clínker. Esto ofrece una solución práctica y sostenible para ayudar a la industria cementera a reducir su huella de carbono y su consumo de energía.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5749.JPG',
};

export default student;
