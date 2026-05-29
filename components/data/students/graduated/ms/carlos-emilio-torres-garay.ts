import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Carlos Emilio Torres Garay',
    degree: 'M.S.',
    program: { en: 'M.S. in Biomedical Engineering', es: 'M.S. en Ingeniería Biomédica' },
    graduationYear: 2021,
    startedYear: 2019,
    currentPosition: { en: 'Sustainability and Climate Change Manager at PwC Colombia', es: 'Gerente de Sostenibilidad y Cambio Climático en PwC Colombia' },
    linkedinUrl: 'https://www.linkedin.com/in/carlos-emilio-torres-garay-734574169/',
    thesisTitle: 'Microfluidic Synthesis and Purification of Magnetoliposomes for Oral Drug Delivery',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: "Many drugs are hard to deliver orally because they can't easily pass through the intestinal wall. This research aimed to solve this by creating tiny, smart delivery vehicles called 'magnetoliposomes'—magnetic particles wrapped in a fatty layer—but producing them efficiently and purely has been a major challenge.", es: 'Muchos fármacos son difíciles de administrar por vía oral porque no atraviesan fácilmente la pared intestinal. Esta investigación buscó resolverlo creando diminutos vehículos de entrega inteligentes llamados «magnetoliposomas» —partículas magnéticas envueltas en una capa grasa—, aunque producirlos de forma eficiente y pura ha sido un gran reto.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'The study designed and built a low-cost "lab-on-a-chip" system using microfluidics. This system allowed for the precise, controlled synthesis of the magnetoliposomes and included a novel magnetic purification step to separate them from leftover materials.', es: 'El estudio diseñó y construyó un sistema de «laboratorio en un chip» de bajo costo basado en microfluídica. Este sistema permitió la síntesis precisa y controlada de los magnetoliposomas e incluyó un novedoso paso de purificación magnética para separarlos de los materiales sobrantes.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: "The microfluidic platform was highly successful, producing uniform and biocompatible drug carriers with an impressive encapsulation efficiency of up to 90%. This work provides a scalable and cost-effective method for developing advanced oral drug delivery systems for difficult-to-transport medicines.", es: 'La plataforma microfluídica tuvo gran éxito, produciendo acarreadores de fármacos uniformes y biocompatibles con una impresionante eficiencia de encapsulación de hasta el 90 %. Este trabajo aporta un método escalable y rentable para desarrollar sistemas avanzados de administración oral de medicamentos difíciles de transportar.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5771.JPG',
};

export default student;
