import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Camila Ocasión Martinez',
    degree: 'M.S.',
    program: { en: 'M.S. in Chemical Engineering at Universidad de Los Andes', es: 'M.S. en Ingeniería Química en la Universidad de Los Andes' },
    graduationYear: 2021,
    startedYear: 2019,
    currentPosition: { en: 'CEO at Excelsa', es: 'CEO en Excelsa' },
    linkedinUrl: 'https://www.linkedin.com/in/camila-ocasion/',
    thesisTitle: 'Improvement in the Functional Screening of Metagenomic Libraries',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: "The natural world is a treasure trove of undiscovered molecules that could become new medicines or industrial enzymes. Scientists use 'metagenomic libraries' to explore this genetic diversity. However, finding a useful molecule in these vast libraries is like finding a needle in a haystack—the traditional methods are slow, inefficient, and often miss the mark.", es: 'La naturaleza es un tesoro de moléculas aún por descubrir que podrían convertirse en nuevos medicamentos o enzimas industriales. Los científicos usan «bibliotecas metagenómicas» para explorar esta diversidad genética. Sin embargo, hallar una molécula útil en estas vastas bibliotecas es como buscar una aguja en un pajar: los métodos tradicionales son lentos, ineficientes y a menudo no dan en el blanco.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: "This project developed a high-tech 'searchlight' to find these needles more easily. The team designed and built tiny biological sensors, called RNA biosensors or 'riboswitches,' that can be programmed to signal when they detect a specific molecule of interest. Using a combination of computer modeling (in-silico) and laboratory experiments, they created a proof-of-concept system that could detect a health-promoting compound called naringenin.", es: 'Este proyecto desarrolló un «reflector» de alta tecnología para hallar esas agujas con mayor facilidad. El equipo diseñó y construyó diminutos sensores biológicos, llamados biosensores de ARN o «riboswitches», que pueden programarse para emitir una señal al detectar una molécula de interés específica. Combinando modelado computacional (in silico) y experimentos de laboratorio, crearon un sistema de prueba de concepto capaz de detectar un compuesto beneficioso para la salud llamado naringenina.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: "The strategy was a success. The team created a robust and efficient method for designing these molecular sensors. The developed biosensor could successfully detect naringenin at very low concentrations, providing a clear signal. This work provides a powerful new toolkit for a scientist, making it much faster and easier to screen vast genetic libraries and accelerate the discovery of novel, valuable biomolecules.", es: 'La estrategia fue un éxito. El equipo creó un método robusto y eficiente para diseñar estos sensores moleculares. El biosensor desarrollado logró detectar naringenina en concentraciones muy bajas, ofreciendo una señal clara. Este trabajo aporta un poderoso nuevo conjunto de herramientas para los científicos, haciendo mucho más rápido y sencillo rastrear vastas bibliotecas genéticas y acelerar el descubrimiento de biomoléculas novedosas y valiosas.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5777.JPG',
};

export default student;
