import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Jonatan Garcia Mape',
    degree: 'M.S.',
    program: { en: 'M.S. in Product and Process Design at Universidad de Los Andes', es: 'M.S. en Diseño de Producto y Proceso en la Universidad de Los Andes' },
    graduationYear: 2023,
    startedYear: 2021,
    currentPosition: { en: 'Head of Supply Chain at Waruwa', es: 'Director de Cadena de Suministro en Waruwa' },
    linkedinUrl: 'https://www.linkedin.com/in/jonatan-garcia-mape-0237ab194/',
    thesisTitle: "Development of Nanobioconjugates from Magnetite Nanoparticles (MNPs) as a Transport Vehicle for Idebenone (IDE) and Study of Their Antioxidant Capacity",
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: "Idebenone, a powerful antioxidant used in treating various diseases, is difficult for the body to absorb because it's greasy and doesn't dissolve well in water. This limits its effectiveness when taken orally or applied topically.", es: 'La idebenona, un potente antioxidante usado en el tratamiento de diversas enfermedades, es difícil de absorber por el cuerpo porque es grasosa y no se disuelve bien en agua. Esto limita su eficacia al tomarse por vía oral o aplicarse de forma tópica.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: "This project designed a nanoscale delivery system. Tiny magnetic nanoparticles were coated with stabilizing molecules and then loaded with Idebenone. This 'nanobioconjugate' was engineered to be a stable and effective vehicle to transport the antioxidant. The team used advanced spectroscopic and analytical techniques to verify each step and test the final product's antioxidant power.", es: 'Este proyecto diseñó un sistema de entrega a nanoescala. Diminutas nanopartículas magnéticas se recubrieron con moléculas estabilizadoras y luego se cargaron con idebenona. Este «nanobioconjugado» se diseñó para ser un vehículo estable y eficaz para transportar el antioxidante. El equipo empleó técnicas espectroscópicas y analíticas avanzadas para verificar cada paso y evaluar la capacidad antioxidante del producto final.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: "The strategy was highly successful. The created nanobioconjugates were stable and demonstrated outstanding antioxidant activity, effectively neutralizing harmful free radicals in lab tests. This research provides a promising new platform for delivering tricky but potent drugs like Idebenone, potentially leading to more effective treatments by improving the drug's bioavailability.", es: 'La estrategia fue muy exitosa. Los nanobioconjugados creados fueron estables y demostraron una actividad antioxidante sobresaliente, neutralizando eficazmente radicales libres dañinos en pruebas de laboratorio. Esta investigación aporta una prometedora nueva plataforma para entregar fármacos potentes pero difíciles como la idebenona, lo que podría conducir a tratamientos más eficaces al mejorar la biodisponibilidad del medicamento.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5744.jpg',
};

export default student;
