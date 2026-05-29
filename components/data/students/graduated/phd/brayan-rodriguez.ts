import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Brayan Rodríguez',
    degree: 'Doctor',
    program: { en: 'Doctor in Engineering', es: 'Doctor en Ingeniería' },
    graduationYear: 2025,
    startedYear: 2021,
    currentPosition: { en: 'Assistant Professor at Pontificia Universidad Javeriana', es: 'Profesor asistente en la Pontificia Universidad Javeriana' },
    linkedinUrl: 'https://www.linkedin.com/in/brayanrodbajo/',
    thesisTitle: 'Listening to Sustainable Bites: Assessing the Influence of Sound on Sustainable Food Perceptions and Behaviors Using a Data-Driven Approach',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: "Encouraging consumers to make sustainable food choices is critical, but traditional methods like eco-labels often fall short. This thesis explores a novel approach: using sound to subtly influence perceptions and behaviors around sustainable food.", es: 'Incentivar a los consumidores a elegir alimentos sostenibles es fundamental, pero los métodos tradicionales como las etiquetas ecológicas suelen quedarse cortos. Esta tesis explora un enfoque novedoso: usar el sonido para influir sutilmente en las percepciones y los comportamientos en torno a la alimentación sostenible.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'This research combined experimental psychology, consumer behavior studies, and machine learning. It investigated how various sounds—from packaging noises to customized music soundscapes and voiceovers—can affect perceptions of health, sustainability, and even the taste of products. A key part of the work was developing a transformer-based deep-learning model to predict flavor associations from instrumental music.', es: 'Esta investigación combinó psicología experimental, estudios del comportamiento del consumidor y aprendizaje automático. Indagó cómo distintos sonidos —desde los ruidos del empaque hasta paisajes sonoros musicales personalizados y locuciones— pueden afectar las percepciones de salud, sostenibilidad e incluso el sabor de los productos. Una parte clave del trabajo fue desarrollar un modelo de aprendizaje profundo basado en transformers para predecir asociaciones de sabor a partir de música instrumental.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: "The study demonstrated that carefully designed sounds can significantly influence consumer choices. For example, packaging sounds can make non-alcoholic beverages more appealing, and specific soundscapes can enhance perceptions of environmental and social sustainability. The research also produced a novel AI-powered music recommendation system that generates playlists based on desired flavor profiles, highlighting the powerful and underexplored role of sound in sustainable marketing.", es: 'El estudio demostró que los sonidos cuidadosamente diseñados pueden influir significativamente en las decisiones de los consumidores. Por ejemplo, los sonidos del empaque pueden hacer más atractivas las bebidas sin alcohol, y ciertos paisajes sonoros pueden potenciar las percepciones de sostenibilidad ambiental y social. La investigación también produjo un novedoso sistema de recomendación musical impulsado por IA que genera listas de reproducción según perfiles de sabor deseados, resaltando el papel poderoso y poco explorado del sonido en el marketing sostenible.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/Brayan%20Rodriguez.JPG',
};

export default student;
