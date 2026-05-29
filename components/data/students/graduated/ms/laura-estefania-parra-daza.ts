import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Laura Estefania Parra Daza',
    degree: 'M.S.',
    program: { en: 'M.S. in Chemical Engineering', es: 'M.S. en Ingeniería Química' },
    graduationYear: 2023,
    startedYear: 2021,
    currentPosition: { en: 'Ph.D. Student in Biotechnology at TEC de Monterrey', es: 'Estudiante de doctorado en Biotecnología en el TEC de Monterrey' },
    linkedinUrl: 'https://www.linkedin.com/in/lauraparradaza/',
    thesisTitle: 'Design and Assembly of a Microbial Bio-Factory for the Heterologous Expression of (2S)-Naringenin in Escherichia coli',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: '(2S)-naringenin is a healthy compound found in citrus, but producing it commercially is difficult. Using bacteria like E. coli as "bio-factories" is a promising alternative, but yields are often low. A key challenge is understanding how fermentation conditions, like oxygen levels, affect production.', es: 'La (2S)-naringenina es un compuesto saludable presente en los cítricos, pero producirla comercialmente es difícil. Usar bacterias como E. coli a modo de «biofábricas» es una alternativa prometedora, pero los rendimientos suelen ser bajos. Un reto clave es comprender cómo las condiciones de fermentación, como los niveles de oxígeno, afectan la producción.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'This study rationally designed a microbial bio-factory in E. coli to produce naringenin. Using computational tools (OptStoic and MinFlux), the researchers identified the most efficient genetic pathway. They then tested how different oxygen levels impacted naringenin production at both lab and pilot scales and analyzed the expression of key genes.', es: 'Este estudio diseñó racionalmente una biofábrica microbiana en E. coli para producir naringenina. Usando herramientas computacionales (OptStoic y MinFlux), los investigadores identificaron la vía genética más eficiente. Luego evaluaron cómo distintos niveles de oxígeno impactaban la producción de naringenina tanto a escala de laboratorio como piloto y analizaron la expresión de genes clave.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: 'The research successfully assembled the bio-factory and found that oxygen transfer is a critical factor. They discovered that specific oxygen levels trigger different gene expression patterns, directly influencing the final yield. By optimizing these conditions, they significantly increased naringenin production, providing a clear strategy for scaling up the sustainable production of this valuable compound.', es: 'La investigación logró ensamblar la biofábrica y halló que la transferencia de oxígeno es un factor crítico. Descubrieron que niveles específicos de oxígeno desencadenan distintos patrones de expresión génica, influyendo directamente en el rendimiento final. Al optimizar estas condiciones, aumentaron significativamente la producción de naringenina, aportando una estrategia clara para escalar la producción sostenible de este valioso compuesto.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5735.JPG',
};

export default student;
