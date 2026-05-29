import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Jorge Felipe León Velandia',
    degree: 'M.S.',
    program: { en: 'M.S. in Product and Process Design at Universidad de Los Andes', es: 'M.S. en Diseño de Producto y Proceso en la Universidad de Los Andes' },
    graduationYear: 2022,
    startedYear: 2020,
    currentPosition: { en: 'Project Management Consultant, Desechables Los Ángeles, Bogotá, Colombia', es: 'Consultor de Gestión de Proyectos, Desechables Los Ángeles, Bogotá, Colombia' },
    linkedinUrl: 'https://www.linkedin.com/in/jorge-felipe-le%C3%B3n-a053b2242/',
    thesisTitle: 'Preparation, Sensory and Physicochemical Analysis of Rice Masato Enriched with Blueberries',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: "Traditional fermented beverages like 'masato' are popular but often face consumer concerns about inconsistent quality, sanitation, and high sugar content. This project aimed to create an improved, healthier version of rice masato by enriching it with blueberries and standardizing its production.", es: 'Las bebidas fermentadas tradicionales como el «masato» son populares, pero suelen generar inquietudes entre los consumidores por su calidad inconsistente, su sanidad y su alto contenido de azúcar. Este proyecto buscó crear una versión mejorada y más saludable del masato de arroz, enriqueciéndola con arándanos y estandarizando su producción.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: "The research involved developing a new masato formulation that incorporated blueberries for their antioxidant properties. The team conducted a thorough analysis, comparing their new beverage to a commercial sample. They measured key chemical properties (like sugar content, pH, and alcohol level), tested its antioxidant activity, and performed a sensory analysis with 45 participants to gauge consumer acceptance.", es: 'La investigación consistió en desarrollar una nueva formulación de masato que incorporaba arándanos por sus propiedades antioxidantes. El equipo realizó un análisis exhaustivo, comparando su nueva bebida con una muestra comercial. Midieron propiedades químicas clave (como el contenido de azúcar, el pH y el nivel de alcohol), evaluaron su actividad antioxidante y efectuaron un análisis sensorial con 45 participantes para medir la aceptación de los consumidores.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: "The study successfully created a healthier masato with higher antioxidant activity and lower sugar content that was still well-received by consumers. The enriched beverage showed similar physicochemical properties to the commercial version but with added health benefits from the blueberries. Sensory analysis revealed a positive response, even with a more sour taste. The project concluded that producing this innovative, healthier masato is not only technically feasible but also economically viable for production expansion.", es: 'El estudio logró crear un masato más saludable, con mayor actividad antioxidante y menor contenido de azúcar, que aun así fue bien recibido por los consumidores. La bebida enriquecida mostró propiedades fisicoquímicas similares a las de la versión comercial, pero con beneficios adicionales para la salud aportados por los arándanos. El análisis sensorial reveló una respuesta positiva, incluso con un sabor más ácido. El proyecto concluyó que producir este masato innovador y más saludable no solo es técnicamente factible, sino también económicamente viable para expandir la producción.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5766.JPG',
};

export default student;
