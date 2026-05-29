import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Carlos Manuel Ramirez Acosta',
    degree: 'M.S.',
    program: { en: 'M.S. in Chemical Engineering at Universidad de Los Andes', es: 'M.S. en Ingeniería Química en la Universidad de Los Andes' },
    graduationYear: 2021,
    startedYear: 2019,
    currentPosition: { en: 'Regional Qualification Expert at Sanofi', es: 'Experto Regional de Calificación en Sanofi' },
    linkedinUrl: 'https://www.linkedin.com/in/carlos-manuel-ramirez-89638b198/',
    thesisTitle: 'Design, Synthesis and Evaluation of pH Responsive Bio Nanoparticles for the Guided Transport and Delivery of CRISPR/Cas9 Plasmids: A Vehicle for Highly-Targeted Gene Therapy',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: "Delivering gene therapies like CRISPR/Cas9 safely and effectively into target cells is a major challenge. Current methods can have low efficiency and potential side effects.", es: 'Entregar terapias génicas como CRISPR/Cas9 de forma segura y eficaz en las células objetivo es un gran reto. Los métodos actuales pueden tener baja eficiencia y posibles efectos secundarios.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: "This research developed a sophisticated 'nanovehicle' made of a magnetic core (magnetite) and a silver shell. This nanoparticle was coated with a 'smart' pH-responsive polymer that could carry and release DNA. It was also equipped with a special peptide (Buforin II) to help it penetrate cells and escape cellular traps.", es: 'Esta investigación desarrolló un sofisticado «nanovehículo» compuesto por un núcleo magnético (magnetita) y una coraza de plata. Esta nanopartícula se recubrió con un polímero «inteligente» sensible al pH capaz de transportar y liberar ADN. También se equipó con un péptido especial (Buforina II) para ayudarla a penetrar las células y escapar de las trampas celulares.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: "The nanovehicles were highly effective. They could load significant amounts of plasmid DNA, enter mammalian cells without causing harm, and efficiently escape the cellular compartments that typically destroy foreign materials. This work demonstrates a powerful and biocompatible platform for highly-targeted gene therapy.", es: 'Los nanovehículos fueron muy eficaces. Lograron cargar cantidades significativas de ADN plasmídico, ingresar a células de mamífero sin causar daño y escapar eficientemente de los compartimentos celulares que suelen destruir el material extraño. Este trabajo demuestra una plataforma potente y biocompatible para una terapia génica altamente dirigida.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5801.jpeg',
};

export default student;
