import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Jesús Rafael Acevedo Mastrogiacomo',
    degree: 'M.S.',
    program: { en: 'M.S. in Chemical Engineering', es: 'M.S. en Ingeniería Química' },
    graduationYear: 2026,
    startedYear: 2024,
    currentPosition: '',
    linkedinUrl: '',
    thesisTitle: 'Adaptive Optimization via Extremum Seeking Control for the Operation of a Biological H₂S Treatment System',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: 'Biological systems that remove hydrogen sulfide (H₂S) — the compound responsible for the rotten-egg odor at facilities like hydroelectric plants — operate most efficiently at a specific, hard-to-find optimum. That optimum shifts constantly with temperature, feed concentration, and microbial dynamics, making it nearly impossible to sustain with fixed operating conditions.', es: 'Los sistemas biológicos que eliminan el sulfuro de hidrógeno (H₂S) —el compuesto responsable del olor a huevo podrido en instalaciones como las centrales hidroeléctricas— operan con mayor eficiencia en un óptimo específico y difícil de hallar. Ese óptimo cambia constantemente con la temperatura, la concentración de alimentación y la dinámica microbiana, lo que hace casi imposible sostenerlo con condiciones de operación fijas.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'This work applied Extremum Seeking Control (ESC), a model-free adaptive optimization strategy, to automatically search for and track the optimal operating point of a biological H₂S treatment reactor in real time — no mathematical model of the bioprocess required.', es: 'Este trabajo aplicó el Control por Búsqueda de Extremos (ESC), una estrategia de optimización adaptativa sin modelo, para buscar y seguir automáticamente el punto óptimo de operación de un reactor biológico de tratamiento de H₂S en tiempo real, sin requerir un modelo matemático del bioproceso.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: 'The ESC algorithm successfully converged to near-optimal conditions and adapted dynamically as the system changed, demonstrating a robust, data-driven path to more efficient and automated odor control in industrial biotreatment facilities.', es: 'El algoritmo ESC convergió con éxito a condiciones casi óptimas y se adaptó dinámicamente a medida que el sistema cambiaba, demostrando una vía robusta y basada en datos hacia un control de olores más eficiente y automatizado en instalaciones industriales de biotratamiento.' }
        }
    ],
    imageUrl: 'https://luishreyes.github.io/images/students/jesus-rafael-acevedo.jpg',
};

export default student;
