import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Julián Felipe Rodríguez Rubiano',
    degree: 'M.S.',
    program: { en: 'M.S. in Product and Process Design at Universidad de Los Andes', es: 'M.S. en Diseño de Producto y Proceso en la Universidad de Los Andes' },
    graduationYear: 2024,
    startedYear: 2022,
    currentPosition: { en: 'Junior Researcher at Bio D S.A', es: 'Investigador júnior en Bio D S.A' },
    linkedinUrl: 'https://www.linkedin.com/in/julianfrodriguezr/',
    thesisTitle: 'Mathematical Modeling and Economic Evaluation of the Production of 1,3-Propanediol Through the Fermentation of Glycerol with Lactobacillus reuteri',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: 'The production of 1,3-propanodiol (1,3-PDO), a valuable chemical for sustainable plastics and cosmetics, is often not economically viable using bio-based methods. The challenge was to design a biotechnological process that is both technically feasible and profitable, using glycerol, an abundant waste product from the biodiesel industry.', es: 'La producción de 1,3-propanodiol (1,3-PDO), un compuesto químico valioso para plásticos y cosméticos sostenibles, a menudo no es económicamente viable mediante métodos de base biológica. El reto era diseñar un proceso biotecnológico que fuera a la vez técnicamente factible y rentable, usando glicerol, un residuo abundante de la industria del biodiésel.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'The project designed and mathematically modeled a complete production process using the bacterium Lactobacillus reuteri to ferment glycerol into 1,3-PDO. This included all stages, from fermentation to complex downstream purification steps like liquid-liquid extraction and distillation, using the simulation software Aspen Plus to evaluate the entire system.', es: 'El proyecto diseñó y modeló matemáticamente un proceso de producción completo usando la bacteria Lactobacillus reuteri para fermentar glicerol en 1,3-PDO. Esto incluyó todas las etapas, desde la fermentación hasta complejos pasos de purificación aguas abajo como la extracción líquido-líquido y la destilación, empleando el software de simulación Aspen Plus para evaluar todo el sistema.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: "The study demonstrated that while the base process was technically viable, it was not initially profitable. However, by proposing key optimizations—such as switching to a more efficient 'feed-batch' fermentation and creating additional value by selling the bacterial biomass as a probiotic—the project's economic outlook was transformed. The optimized process showed a strong positive Net Present Value (NPV), providing a clear pathway to turn an industrial waste stream into a high-value, sustainable chemical in a competitive and profitable way.", es: 'El estudio demostró que, aunque el proceso base era técnicamente viable, inicialmente no era rentable. Sin embargo, al proponer optimizaciones clave —como cambiar a una fermentación «feed-batch» más eficiente y generar valor adicional vendiendo la biomasa bacteriana como probiótico—, las perspectivas económicas del proyecto se transformaron. El proceso optimizado mostró un Valor Presente Neto (VPN) sólido y positivo, ofreciendo una vía clara para convertir un flujo de residuos industriales en un compuesto químico sostenible y de alto valor de manera competitiva y rentable.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5720.JPG',
};

export default student;
