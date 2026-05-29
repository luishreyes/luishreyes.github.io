import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Saúl Camilo Gómez Tinoco',
    degree: 'M.S.',
    program: { en: 'M.S. in Biomedical Engineering', es: 'M.S. en Ingeniería Biomédica' },
    graduationYear: 2021,
    startedYear: 2019,
    currentPosition: { en: 'Medical Writer at Zimmer Biomet', es: 'Redactor médico en Zimmer Biomet' },
    linkedinUrl: 'https://www.linkedin.com/in/saul-camilo-g%C3%B3mez-tinoco-2022a51b3/',
    thesisTitle: 'Design and manufacture of a low-cost microfluidic platform for the synthesis of giant liposomes for the encapsulation and separation of yeasts: Applications for the screening of membrane-active peptides',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: "The discovery of new antibiotic alternatives, known as Membrane-Active Peptides (MAPs), is often slow and expensive. A key challenge is developing a high-throughput system to efficiently screen vast libraries of potential candidates to find effective new drugs.", es: 'El descubrimiento de nuevas alternativas a los antibióticos, conocidas como Péptidos Activos de Membrana (MAP), suele ser lento y costoso. Un reto clave es desarrollar un sistema de alto rendimiento para rastrear eficientemente vastas bibliotecas de candidatos potenciales y encontrar nuevos fármacos eficaces.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'A low-cost "lab-on-a-chip" (microfluidic) platform was designed and built from the ground up. This platform first creates artificial cell membranes (GUVs) and then uses specialized micro-channels to mix them with particles that mimic yeast expressing the peptides to be tested. The entire system was optimized using advanced computer simulations.', es: 'Se diseñó y construyó desde cero una plataforma microfluídica de «laboratorio en un chip» de bajo costo. Esta plataforma primero crea membranas celulares artificiales (GUV) y luego usa microcanales especializados para mezclarlas con partículas que imitan levaduras que expresan los péptidos por evaluar. Todo el sistema se optimizó mediante simulaciones computacionales avanzadas.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: "The microfluidic platform proved to be highly effective, showing great potential for rapidly screening new MAPs. The computational models accurately predicted the system's performance, providing a robust and affordable tool to accelerate the discovery of new drugs to combat antibiotic resistance.", es: 'La plataforma microfluídica resultó muy eficaz, mostrando un gran potencial para rastrear rápidamente nuevos MAP. Los modelos computacionales predijeron con precisión el desempeño del sistema, ofreciendo una herramienta robusta y asequible para acelerar el descubrimiento de nuevos fármacos que combatan la resistencia a los antibióticos.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5775.JPG',
};

export default student;
