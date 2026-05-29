import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Laura Daniela León',
    degree: 'M.S.',
    program: { en: 'M.S. in Technology Innovation Management', es: 'M.S. en Gestión de la Innovación Tecnológica' },
    graduationYear: 2026,
    startedYear: 2024,
    currentPosition: '',
    linkedinUrl: '',
    thesisTitle: 'Design of an Evaluation Methodology for Generative AI Tools in University Education',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: 'Generative AI tools are being rapidly adopted in university classrooms, but there is no systematic way to evaluate whether a specific tool is appropriate for a given educational context. Institutions are making adoption decisions without rigorous, reproducible criteria.', es: 'Las herramientas de IA generativa se están adoptando rápidamente en las aulas universitarias, pero no existe una forma sistemática de evaluar si una herramienta específica es apropiada para un contexto educativo determinado. Las instituciones toman decisiones de adopción sin criterios rigurosos y reproducibles.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'This work designed and validated a structured evaluation methodology grounded in innovation management frameworks. The methodology was piloted through real assessment exercises in university engineering courses, allowing iterative refinement against practical constraints.', es: 'Este trabajo diseñó y validó una metodología de evaluación estructurada, fundamentada en marcos de gestión de la innovación. La metodología se puso a prueba mediante ejercicios reales de evaluación en cursos universitarios de ingeniería, lo que permitió refinarla de forma iterativa frente a restricciones prácticas.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: 'The resulting methodology provides a criterion-based, reproducible process that enables educational institutions to systematically assess and responsibly adopt generative AI tools, balancing pedagogical effectiveness with ethical and practical considerations.', es: 'La metodología resultante ofrece un proceso reproducible y basado en criterios que permite a las instituciones educativas evaluar de forma sistemática y adoptar de manera responsable herramientas de IA generativa, equilibrando la eficacia pedagógica con consideraciones éticas y prácticas.' }
        }
    ],
    imageUrl: 'https://luishreyes.github.io/images/students/laura-daniela-leon.jpg',
};

export default student;
