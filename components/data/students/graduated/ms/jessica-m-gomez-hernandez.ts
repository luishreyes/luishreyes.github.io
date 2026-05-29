import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Jessica M. Gómez-Hernández',
    degree: 'M.S.',
    program: { en: 'M.S. in Chemical Engineering', es: 'M.S. en Ingeniería Química' },
    graduationYear: 2023,
    startedYear: 2021,
    currentPosition: { en: 'Process Engineer Recovery Plant at Smurfit Westrock', es: 'Ingeniera de Procesos de la Planta de Recuperación en Smurfit Westrock' },
    linkedinUrl: 'https://www.linkedin.com/in/jessica-maria-gomez-hernandez-a6b07018a/',
    thesisTitle: 'Modeling, simulation, assembly, and testing of a bench-scale process for the synthesis of magnetite nanoparticles for biological and medical applications: technical and economic feasibility',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: "Despite the potential of nanotechnology, producing materials like magnetite nanoparticles at a large scale is challenging. Ensuring the right mixing conditions is crucial for quality but difficult to achieve when scaling up production.", es: 'A pesar del potencial de la nanotecnología, producir materiales como las nanopartículas de magnetita a gran escala es un reto. Garantizar las condiciones de mezcla adecuadas es crucial para la calidad, pero difícil de lograr al escalar la producción.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'This research involved designing, modeling, and building a complete bench-scale system to synthesize these nanoparticles using a co-precipitation method. The system was optimized with computer simulations (COMSOL Multiphysics) and included a conical tank, inline static mixers, and a magnetic purification setup to ensure quality and reproducibility.', es: 'Esta investigación consistió en diseñar, modelar y construir un sistema completo a escala de banco para sintetizar estas nanopartículas mediante un método de coprecipitación. El sistema se optimizó con simulaciones computacionales (COMSOL Multiphysics) e incluyó un tanque cónico, mezcladores estáticos en línea y un montaje de purificación magnética para asegurar calidad y reproducibilidad.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: 'The developed system successfully produced uniform, high-quality nanoparticles. A detailed technical and economic feasibility analysis demonstrated that the proposed process is both technologically sound and economically viable for scaling up to full industrial production, paving the way for their use in biomedical applications.', es: 'El sistema desarrollado produjo con éxito nanopartículas uniformes y de alta calidad. Un análisis detallado de factibilidad técnica y económica demostró que el proceso propuesto es tecnológicamente sólido y económicamente viable para escalarlo a producción industrial plena, allanando el camino para su uso en aplicaciones biomédicas.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5733.jpg',
};

export default student;
