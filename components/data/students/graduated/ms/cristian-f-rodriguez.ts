import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Cristian F. Rodríguez',
    degree: 'M.S.',
    program: { en: 'M.S. in Biomedical Engineering', es: 'M.S. en Ingeniería Biomédica' },
    graduationYear: 2023,
    startedYear: 2021,
    currentPosition: { en: 'Instructor Professor at Universidad de los Andes', es: 'Profesor instructor en la Universidad de los Andes' },
    linkedinUrl: 'https://www.linkedin.com/in/cristian-felipe-rodriguez-ospino/',
    thesisTitle: 'Accelerating Tissue Maturation through Magnetized Cell Spheroids: A Bioprinting Approach Enhanced by Stochastic Multiphysics Modeling in Tissue Engineering',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: 'Lab-grown tissues are crucial for testing new drugs without animals, but the process of fusing tiny cell clusters (spheroids) into functional tissue is extremely slow, taking about a week. This bottleneck makes tissue engineering impractical for many applications.', es: 'Los tejidos cultivados en laboratorio son cruciales para probar nuevos fármacos sin animales, pero el proceso de fusionar diminutos cúmulos de células (esferoides) en tejido funcional es extremadamente lento, pues toma alrededor de una semana. Este cuello de botella hace que la ingeniería de tejidos resulte poco práctica para muchas aplicaciones.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'The research took a two-pronged approach. First, a sophisticated computer model was developed to accurately predict how spheroids fuse. Second, the team embedded tiny magnetic nanoparticles into the spheroids. By applying an external magnetic field, they could gently pull the spheroids together, dramatically speeding up the fusion process.', es: 'La investigación adoptó un enfoque de dos frentes. Primero, se desarrolló un sofisticado modelo computacional para predecir con precisión cómo se fusionan los esferoides. Segundo, el equipo incorporó diminutas nanopartículas magnéticas en los esferoides. Al aplicar un campo magnético externo, podían acercar suavemente los esferoides entre sí, acelerando notablemente el proceso de fusión.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: "The magnetic-assist technique was a remarkable success, reducing tissue fusion time from 7 days to just 2 days. This breakthrough, supported by the predictive computer model, makes biofabrication much faster and more reliable. It's a significant step toward accelerating medical research, reducing animal testing, and advancing regenerative medicine.", es: 'La técnica de asistencia magnética fue un éxito notable, reduciendo el tiempo de fusión del tejido de 7 días a apenas 2 días. Este avance, respaldado por el modelo computacional predictivo, hace que la biofabricación sea mucho más rápida y confiable. Es un paso significativo hacia la aceleración de la investigación médica, la reducción de la experimentación animal y el avance de la medicina regenerativa.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5728.jpg',
};

export default student;
