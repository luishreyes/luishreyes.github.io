import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Catalina García Rondón',
    degree: 'M.S.',
    program: { en: 'M.S. in Product and Process Design at Universidad de Los Andes', es: 'M.S. en Diseño de Producto y Proceso en la Universidad de Los Andes' },
    graduationYear: 2023,
    startedYear: 2021,
    currentPosition: { en: 'Quality and Innovation Analyst at Natura', es: 'Analista de Calidad e Innovación en Natura' },
    linkedinUrl: 'https://www.linkedin.com/in/catalina-garc%C3%ADa-rond%C3%B3n-b47896178/',
    thesisTitle: 'Design and Evaluation of a Hair Mousse Composed of a Synthetic Peptide with Antifungal Action Against Trichophyton rubrum and Candida spp.',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: 'Common scalp fungal infections are often treated with topical products that can cause irritation and other side effects. There was a need for a safer, more effective, and user-friendly alternative to existing treatments.', es: 'Las infecciones fúngicas comunes del cuero cabelludo suelen tratarse con productos tópicos que pueden causar irritación y otros efectos secundarios. Hacía falta una alternativa más segura, eficaz y fácil de usar frente a los tratamientos existentes.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'This project involved designing a cosmetic hair mousse formulated with a custom synthetic peptide (KS22). The peptide was specifically chosen for its antifungal properties. The team then evaluated the mousse for its physical stability (like bubble size and uniformity) and its effectiveness in inhibiting the growth of fungi responsible for scalp infections, such as T. rubrum and Candida spp.', es: 'Este proyecto consistió en diseñar una mousse capilar cosmética formulada con un péptido sintético a la medida (KS22). El péptido se eligió específicamente por sus propiedades antifúngicas. Luego, el equipo evaluó la estabilidad física de la mousse (como el tamaño y la uniformidad de las burbujas) y su eficacia para inhibir el crecimiento de los hongos responsables de las infecciones del cuero cabelludo, como T. rubrum y Candida spp.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: 'The newly developed hair mousse was stable and demonstrated significant antifungal activity against the target fungi in lab tests. The study successfully showed that a peptide-based cosmetic product can be an effective and gentle alternative to conventional antifungal treatments, offering a sustainable, bioactive solution for the hair care industry.', es: 'La mousse capilar desarrollada fue estable y demostró una actividad antifúngica significativa contra los hongos objetivo en pruebas de laboratorio. El estudio demostró con éxito que un producto cosmético basado en péptidos puede ser una alternativa eficaz y suave frente a los tratamientos antifúngicos convencionales, ofreciendo una solución sostenible y bioactiva para la industria del cuidado del cabello.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5737.JPG',
};

export default student;
