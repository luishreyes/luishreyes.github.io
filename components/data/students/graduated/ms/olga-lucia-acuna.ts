import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Olga Lucia Acuña',
    degree: 'M.S.',
    program: { en: 'M.S. in Chemical Engineering', es: 'M.S. en Ingeniería Química' },
    graduationYear: 2025,
    startedYear: 2023,
    currentPosition: undefined,
    linkedinUrl: 'https://www.linkedin.com/in/lucia-acuna-ingenieraquimica/',
    thesisTitle: 'Design Study of Thermally Sensitive Liposomes Based on Soy Lecithin, Using Carbon Quantum Dots as Marker Nanoparticles',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: "Developing drug delivery systems that can release medicine exactly where needed is a major challenge. Thermosensitive liposomes (tiny fat bubbles that release their contents when heated) are promising, but they are often made from expensive synthetic materials. This project aimed to create a low-cost version using natural soy lecithin. A key hurdle was finding an effective way to track and study these new liposomes.", es: 'Desarrollar sistemas de entrega de fármacos capaces de liberar el medicamento exactamente donde se necesita es un gran reto. Los liposomas termosensibles (diminutas burbujas de grasa que liberan su contenido al calentarse) son prometedores, pero suelen fabricarse con materiales sintéticos costosos. Este proyecto buscó crear una versión de bajo costo usando lecitina de soya natural. Un obstáculo clave era hallar una forma eficaz de rastrear y estudiar estos nuevos liposomas.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: "The research focused on creating thermosensitive liposomes from affordable soy lecithin. To make them trackable, the team incorporated tiny fluorescent nanoparticles called 'carbon quantum dots' (CQDs) inside them. They developed and compared two different methods for creating these liposomes—a traditional hydration method and a modern microfluidics technique—to see which was more efficient. They also designed and attached a special polymer chain to the liposomes to make them release their contents when heated.", es: 'La investigación se centró en crear liposomas termosensibles a partir de lecitina de soya económica. Para hacerlos rastreables, el equipo incorporó en su interior diminutas nanopartículas fluorescentes llamadas «puntos cuánticos de carbono» (CQD). Desarrollaron y compararon dos métodos distintos para crear estos liposomas —un método tradicional de hidratación y una técnica moderna de microfluídica— para ver cuál era más eficiente. También diseñaron y anclaron una cadena polimérica especial a los liposomas para que liberaran su contenido al calentarse.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: "The study successfully created functional, low-cost thermosensitive liposomes from soy lecithin. They demonstrated that the traditional hydration method was more efficient at encapsulating the CQD markers. The addition of the heat-sensitive polymer chain was confirmed to be the key component for temperature-triggered release. This work provides a practical and scalable methodology for developing affordable, smart drug delivery systems, using CQDs as a powerful tool for characterization.", es: 'El estudio logró crear liposomas termosensibles funcionales y de bajo costo a partir de lecitina de soya. Demostraron que el método tradicional de hidratación era más eficiente para encapsular los marcadores de CQD. Se confirmó que la incorporación de la cadena polimérica sensible al calor era el componente clave para la liberación activada por temperatura. Este trabajo aporta una metodología práctica y escalable para desarrollar sistemas de entrega de fármacos inteligentes y asequibles, usando los CQD como una potente herramienta de caracterización.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5782.JPG',
};

export default student;
