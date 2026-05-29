import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Karem Vanessa Higuera Garavito',
    degree: 'M.S.',
    program: { en: 'M.S. in Product and Process Design at Universidad de Los Andes', es: 'M.S. en Diseño de Producto y Proceso en la Universidad de Los Andes' },
    graduationYear: 2022,
    startedYear: 2020,
    currentPosition: { en: 'Product Analyst, West Química', es: 'Analista de Producto, West Química' },
    linkedinUrl: 'https://www.linkedin.com/in/karem-vanessa-higuera-garavito-606bbb157/',
    thesisTitle: 'Formulation of a Whey Protein Isolate Supplemented with 3,3-Diindolylmethane as a Result Enhancer in Fat Loss and Maintenance Programs',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: "Many health-conscious consumers use whey protein supplements. This project aimed to create an enhanced protein powder by adding 3,3'-Diindolylmethane (DIM), a natural compound found in vegetables like broccoli that helps regulate hormones and promote fat oxidation. The main challenge was that DIM is not easily absorbed by the body, so a method was needed to improve its bioavailability and stability in a protein shake.", es: 'Muchos consumidores preocupados por su salud usan suplementos de proteína de suero. Este proyecto buscó crear una proteína en polvo mejorada añadiendo 3,3-diindolilmetano (DIM), un compuesto natural presente en vegetales como el brócoli que ayuda a regular las hormonas y a promover la oxidación de grasa. El principal reto era que el DIM no se absorbe fácilmente en el cuerpo, por lo que se necesitaba un método para mejorar su biodisponibilidad y estabilidad en un batido de proteína.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: "The research focused on encapsulating DIM within whey protein molecules. Three different types of whey protein were tested to see which one formed the most stable complex with DIM. The team used advanced techniques like infrared spectroscopy to confirm the interaction between the protein and DIM, and microscopy to analyze the particle structure after spray-drying. A sensory panel was also conducted to determine which formulation was most appealing to consumers.", es: 'La investigación se centró en encapsular el DIM dentro de moléculas de proteína de suero. Se probaron tres tipos distintos de proteína de suero para ver cuál formaba el complejo más estable con el DIM. El equipo usó técnicas avanzadas como la espectroscopía infrarroja para confirmar la interacción entre la proteína y el DIM, y microscopía para analizar la estructura de las partículas tras el secado por aspersión. También se realizó un panel sensorial para determinar qué formulación resultaba más atractiva para los consumidores.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: "The study successfully demonstrated that whey protein can effectively encapsulate DIM, increasing its bioavailability through hydrophobic interactions. The sensory panel showed a clear preference for the formulation made with whey protein concentrate, which was also the most stable. The research determined the ideal spray-drying conditions to create a non-clumping powder, resulting in a final product that is both functionally enhanced and consumer-friendly.", es: 'El estudio demostró con éxito que la proteína de suero puede encapsular eficazmente el DIM, aumentando su biodisponibilidad mediante interacciones hidrofóbicas. El panel sensorial mostró una clara preferencia por la formulación elaborada con concentrado de proteína de suero, que también fue la más estable. La investigación determinó las condiciones ideales de secado por aspersión para crear un polvo que no se apelmaza, dando como resultado un producto final funcionalmente mejorado y agradable para el consumidor.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5768.JPG',
};

export default student;
