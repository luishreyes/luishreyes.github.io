import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Laura Tatiana Salgado',
    degree: 'M.S.',
    program: { en: 'M.S. in Biomedical Engineering', es: 'M.S. en Ingeniería Biomédica' },
    graduationYear: 2024,
    startedYear: 2022,
    linkedinUrl: 'https://www.linkedin.com/in/laura-tatiana-salgado-rios-18738a312/',
    thesisTitle: 'Evaluating the Impact of Cell-Penetrating Motif Position on the Cellular Uptake of Magnetite Nanoparticles',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: "To improve drug delivery, scientists often attach cell-penetrating peptides (CPPs) to nanoparticles to help them enter cells. However, it was unclear how the specific placement of the peptide's active part, or 'motif,' affects its performance. This study aimed to determine the optimal design for these molecular keys.", es: 'Para mejorar la entrega de fármacos, los científicos suelen anclar péptidos penetrantes de célula (CPP) a las nanopartículas para ayudarlas a entrar en las células. Sin embargo, no estaba claro cómo la ubicación específica de la parte activa del péptido, o «motivo», afecta su desempeño. Este estudio buscó determinar el diseño óptimo de estas llaves moleculares.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: "We rationally designed three peptides, each containing the same cell-penetrating motif but placed at the beginning, middle, or end of the peptide chain. We attached these to magnetic nanoparticles and systematically tested how well they were absorbed by cells and if they could escape cellular traps.", es: 'Diseñamos racionalmente tres péptidos, cada uno con el mismo motivo penetrante de célula, pero ubicado al inicio, en la mitad o al final de la cadena peptídica. Los anclamos a nanopartículas magnéticas y evaluamos de forma sistemática qué tan bien eran absorbidos por las células y si lograban escapar de las trampas celulares.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: "Design matters—a lot. The nanoparticle with the peptide where the motif was at the very beginning (N-terminus) was significantly better at entering cells and escaping entrapment. This provides a clear design rule for engineering more effective CPP-based drug delivery vehicles.", es: 'El diseño importa, y mucho. La nanopartícula con el péptido cuyo motivo estaba justo al inicio (extremo N-terminal) fue significativamente mejor para ingresar a las células y escapar del atrapamiento. Esto aporta una regla de diseño clara para crear vehículos de entrega de fármacos basados en CPP más eficaces.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/Laura%20Tatiana%20Salgado.JPG',
};

export default student;
