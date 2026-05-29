import React from 'react';
import type { Localized } from '../../context/i18n';

export interface TaughtCourse {
  term: string;
  year: number;
  code: string;
  title: Localized;
  students: number;
  type: 'Core' | 'Elective' | 'CBU' | 'EDCO' | 'Corporate' | 'Coursera';
  level: 'Undergraduate' | 'Graduate' | null;
  evaluation: number | null;
}

export const teachingData: TaughtCourse[] = [
  // 2025
  { term: '2025-20', year: 2025, code: 'CBP-C1320', title: { en: 'Pandora\'s Laboratory', es: 'El Laboratorio de Pandora' }, students: 37, type: 'CBU', level: 'Undergraduate', evaluation: 157 },
  { term: '2025-20', year: 2025, code: 'IQYA-2031', title: { en: 'Unit Operations Project', es: 'Proyecto de Operaciones Unitarias' }, students: 32, type: 'Core', level: 'Undergraduate', evaluation: 156 },
  { term: '2025-10', year: 2025, code: 'DPRO-4300', title: { en: 'Systemic Bioproducts Design', es: 'Diseño Sistémico de Bioproductos' }, students: 23, type: 'Core', level: 'Graduate', evaluation: 155 },
  { term: '2025-10', year: 2025, code: 'IQYA-4100', title: { en: 'Industrial Biotechnology', es: 'Biotecnología Industrial' }, students: 7, type: 'Elective', level: 'Graduate', evaluation: 158 },

  // 2024
  { term: '2024-20', year: 2024, code: 'CBP-C1320', title: { en: 'Pandora\'s Laboratory', es: 'El Laboratorio de Pandora' }, students: 37, type: 'CBU', level: 'Undergraduate', evaluation: 158 },
  { term: '2024-20', year: 2024, code: 'IQYA-2031', title: { en: 'Unit Operations Project', es: 'Proyecto de Operaciones Unitarias' }, students: 16, type: 'Core', level: 'Undergraduate', evaluation: 149 },
  { term: '2024-20', year: 2024, code: 'IQYA-3012', title: { en: 'Food Microbiology', es: 'Microbiología de Alimentos' }, students: 4, type: 'Core', level: 'Undergraduate', evaluation: 154 },
  { term: '2024-10', year: 2024, code: 'DPRO-4300', title: { en: 'Systemic Bioproducts Design', es: 'Diseño Sistémico de Bioproductos' }, students: 18, type: 'Core', level: 'Graduate', evaluation: 155 },
  { term: '2024-10', year: 2024, code: 'IQYA-2031', title: { en: 'Unit Operations Project', es: 'Proyecto de Operaciones Unitarias' }, students: 24, type: 'Core', level: 'Undergraduate', evaluation: 149 },
  { term: '2024-10', year: 2024, code: 'IQYA-3012', title: { en: 'Food Microbiology', es: 'Microbiología de Alimentos' }, students: 21, type: 'Core', level: 'Undergraduate', evaluation: 155 },
  
  // 2023
  { term: '2023-20', year: 2023, code: 'CBP-C1320', title: { en: 'Pandora\'s Laboratory', es: 'El Laboratorio de Pandora' }, students: 36, type: 'CBU', level: 'Undergraduate', evaluation: 158 },
  { term: '2023-20', year: 2023, code: 'IQYA-2032', title: { en: 'Integrated Project 2', es: 'Proyecto Integrador 2' }, students: 18, type: 'Core', level: 'Undergraduate', evaluation: 152 },
  { term: '2023-20', year: 2023, code: 'IQYA-3602', title: { en: 'ChemFood Challenge', es: 'Reto ChemFood' }, students: 24, type: 'Elective', level: 'Undergraduate', evaluation: 160 },
  { term: '2023-20', year: 2023, code: 'IQYA-3901', title: { en: 'IQUI Special Project', es: 'Proyecto Especial IQUI' }, students: 2, type: 'Elective', level: 'Undergraduate', evaluation: 153 },
  { term: '2023-20', year: 2023, code: 'IQYA-4100', title: { en: 'Industrial Biotechnology', es: 'Biotecnología Industrial' }, students: 17, type: 'Elective', level: 'Graduate', evaluation: 141 },
  { term: '2023-10', year: 2023, code: 'IQYA-3601', title: { en: 'Chemical Engineering Challenge', es: 'Reto de Ingeniería Química' }, students: 27, type: 'Elective', level: 'Undergraduate', evaluation: 157 },
  { term: '2023-10', year: 2023, code: 'IQYA-2032', title: { en: 'Integrated Project 2', es: 'Proyecto Integrador 2' }, students: 29, type: 'Core', level: 'Undergraduate', evaluation: 143 },
  { term: '2023-10', year: 2023, code: 'DPRO-4300', title: { en: 'Systemic Bioproducts Design', es: 'Diseño Sistémico de Bioproductos' }, students: 15, type: 'Core', level: 'Graduate', evaluation: 153 },

  // 2022
  { term: '2022-20', year: 2022, code: 'IQUI-4230', title: { en: 'Industrial Biotechnology', es: 'Biotecnología Industrial' }, students: 26, type: 'Elective', level: 'Graduate', evaluation: 152 },
  { term: '2022-20', year: 2022, code: 'IQUI-3094', title: { en: 'Project Seminar', es: 'Seminario de Proyecto' }, students: 38, type: 'Core', level: 'Undergraduate', evaluation: 157 },
  { term: '2022-20', year: 2022, code: 'IQUI-2032', title: { en: 'Integrated Project 2', es: 'Proyecto Integrador 2' }, students: 36, type: 'Core', level: 'Undergraduate', evaluation: 135 },
  { term: '2022-20', year: 2022, code: 'CBP-C1320', title: { en: 'Pandora\'s Laboratory', es: 'El Laboratorio de Pandora' }, students: 27, type: 'CBU', level: 'Undergraduate', evaluation: 158 },
  { term: '2022-20', year: 2022, code: 'IALI-3094', title: { en: 'Project Seminar', es: 'Seminario de Proyecto' }, students: 2, type: 'Core', level: 'Undergraduate', evaluation: 151 },
  { term: '2022-10', year: 2022, code: 'IQUI-3094', title: { en: 'Project Seminar', es: 'Seminario de Proyecto' }, students: 50, type: 'Core', level: 'Undergraduate', evaluation: 155 },
  { term: '2022-10', year: 2022, code: 'IQUI-3090', title: { en: 'Thesis Project Seminar', es: 'Seminario de Proyecto de Tesis' }, students: 8, type: 'Core', level: 'Undergraduate', evaluation: 156 },
  { term: '2022-10', year: 2022, code: 'IQUI-2032', title: { en: 'Integrated Project 2', es: 'Proyecto Integrador 2' }, students: 79, type: 'Core', level: 'Undergraduate', evaluation: 143 },
  { term: '2022-10', year: 2022, code: 'IALI-3101', title: { en: 'From Yeast to Beer', es: 'De la Levadura a la Cerveza' }, students: 59, type: 'Elective', level: 'Undergraduate', evaluation: 154 },
  { term: '2022-10', year: 2022, code: 'IALI-3094', title: { en: 'Project Seminar', es: 'Seminario de Proyecto' }, students: 5, type: 'Core', level: 'Undergraduate', evaluation: 141 },
  { term: '2022-10', year: 2022, code: 'DPRO-4300', title: { en: 'Systemic Bioproducts Design', es: 'Diseño Sistémico de Bioproductos' }, students: 30, type: 'Core', level: 'Graduate', evaluation: 140 },

  // 2021
  { term: '2021-20', year: 2021, code: 'IQUI-4230', title: { en: 'Industrial Biotechnology', es: 'Biotecnología Industrial' }, students: 13, type: 'Elective', level: 'Graduate', evaluation: 160 },
  { term: '2021-20', year: 2021, code: 'IQUI-2032', title: { en: 'Integrated Project 2', es: 'Proyecto Integrador 2' }, students: 86, type: 'Core', level: 'Undergraduate', evaluation: 141 },
  { term: '2021-20', year: 2021, code: 'CBP-C1320', title: { en: 'Pandora\'s Laboratory', es: 'El Laboratorio de Pandora' }, students: 31, type: 'CBU', level: 'Undergraduate', evaluation: 157 },
  { term: '2021-10', year: 2021, code: 'IQUI-3350', title: { en: 'Chemical Engineering Challenge', es: 'Reto de Ingeniería Química' }, students: 14, type: 'Elective', level: 'Undergraduate', evaluation: 159 },
  { term: '2021-10', year: 2021, code: 'IQUI-3010', title: { en: 'Unit Operations', es: 'Operaciones Unitarias' }, students: 36, type: 'Core', level: 'Undergraduate', evaluation: 153 },
  { term: '2021-10', year: 2021, code: 'IALI-3101', title: { en: 'From Yeast to Beer', es: 'De la Levadura a la Cerveza' }, students: 10, type: 'Elective', level: 'Undergraduate', evaluation: 159 },

  // 2020
  { term: '2020-20', year: 2020, code: 'IQUI-3010', title: { en: 'Unit Operations', es: 'Operaciones Unitarias' }, students: 49, type: 'Core', level: 'Undergraduate', evaluation: 152 },
  { term: '2020-20', year: 2020, code: 'IING-3000', title: { en: 'Multidisciplinary Design Project in Engineering', es: 'Proyecto de Diseño Multidisciplinario en Ingeniería' }, students: 38, type: 'Elective', level: 'Undergraduate', evaluation: 152 },
  { term: '2020-20', year: 2020, code: 'IQUI-3520', title: { en: 'Bioproducts Design Fundamentals', es: 'Fundamentos de Diseño de Bioproductos' }, students: 27, type: 'Elective', level: 'Undergraduate', evaluation: 154 },
  { term: '2020-10', year: 2020, code: 'DPRO-4300', title: { en: 'Systemic Bioproducts Design', es: 'Diseño Sistémico de Bioproductos' }, students: 21, type: 'Core', level: 'Graduate', evaluation: null },
  { term: '2020-10', year: 2020, code: 'IQUI-4230', title: { en: 'Industrial Biotechnology', es: 'Biotecnología Industrial' }, students: 16, type: 'Elective', level: 'Graduate', evaluation: null },
  { term: '2020-10', year: 2020, code: 'IQUI-3350', title: { en: 'Chemical Engineering Challenge', es: 'Reto de Ingeniería Química' }, students: 17, type: 'Elective', level: 'Undergraduate', evaluation: null },
  { term: '2020-10', year: 2020, code: 'IQUI-3010', title: { en: 'Unit Operations', es: 'Operaciones Unitarias' }, students: 56, type: 'Core', level: 'Undergraduate', evaluation: null },
  
  // 2019
  { term: '2019-20', year: 2019, code: 'IQUI-3010', title: { en: 'Unit Operations', es: 'Operaciones Unitarias' }, students: 75, type: 'Core', level: 'Undergraduate', evaluation: 152 },
  { term: '2019-20', year: 2019, code: 'IQUI-3518', title: { en: 'From Yeast to Beer', es: 'De la Levadura a la Cerveza' }, students: 25, type: 'Elective', level: 'Undergraduate', evaluation: 162 },
  { term: '2019-10', year: 2019, code: 'DPRO-4300', title: { en: 'Systemic Bioproducts Design', es: 'Diseño Sistémico de Bioproductos' }, students: 11, type: 'Core', level: 'Graduate', evaluation: 158 },
  { term: '2019-10', year: 2019, code: 'IQUI-3010', title: { en: 'Unit Operations', es: 'Operaciones Unitarias' }, students: 68, type: 'Core', level: 'Undergraduate', evaluation: 153 },
  { term: '2019-10', year: 2019, code: 'IQUI-3350', title: { en: 'Chemical Engineering Challenge', es: 'Reto de Ingeniería Química' }, students: 21, type: 'Elective', level: 'Undergraduate', evaluation: 163 },
  { term: '2019-10', year: 2019, code: 'IQUI-4230', title: { en: 'Industrial Biotechnology', es: 'Biotecnología Industrial' }, students: 26, type: 'Elective', level: 'Graduate', evaluation: 159 },
  
  // 2018
  { term: '2018-20', year: 2018, code: 'IQUI-3010', title: { en: 'Unit Operations', es: 'Operaciones Unitarias' }, students: 50, type: 'Core', level: 'Undergraduate', evaluation: 153 },
  { term: '2018-20', year: 2018, code: 'IQUI-3518', title: { en: 'From Yeast to Beer', es: 'De la Levadura a la Cerveza' }, students: 30, type: 'Elective', level: 'Undergraduate', evaluation: 161 },
  { term: '2018-10', year: 2018, code: 'IQUI-2200', title: { en: 'Experimental Design in Chemical Engineering', es: 'Diseño Experimental en Ingeniería Química' }, students: 58, type: 'Core', level: 'Undergraduate', evaluation: 156 },
  { term: '2018-10', year: 2018, code: 'IQUI-3010', title: { en: 'Unit Operations', es: 'Operaciones Unitarias' }, students: 68, type: 'Core', level: 'Undergraduate', evaluation: 154 },

  // 2017
  { term: '2017-20', year: 2017, code: 'IQUI-2200', title: { en: 'Experimental Design in Chemical Engineering', es: 'Diseño Experimental en Ingeniería Química' }, students: 50, type: 'Core', level: 'Undergraduate', evaluation: 154 },
  { term: '2017-20', year: 2017, code: 'IQUI-3010', title: { en: 'Unit Operations', es: 'Operaciones Unitarias' }, students: 21, type: 'Core', level: 'Undergraduate', evaluation: 160 },
];

export interface TeachingPillar {
  title: Localized;
  icon: React.ReactNode;
  description: Localized;
}

export const teachingPillars: TeachingPillar[] = [
  {
    title: { en: 'Fundamentals as Foundation, Not Formulas as Solutions', es: 'Fundamentos como cimiento, no fórmulas como soluciones' },
    icon: React.createElement('img', { src: "https://cdn-icons-png.flaticon.com/512/1606/1606208.png", className: "h-8 w-8", alt: "Fundamentals Icon" }),
    description: {
      en: "I invest intensive time ensuring students understand core principles: conservation laws, thermodynamic principles, transport phenomena. When students truly grasp these fundamentals, they don't need a formula sheet for every case. They can derive what they need, recognize patterns, and build solutions. As Professor Ramírez taught me, when you understand the fundamentals, everything else falls into place naturally.",
      es: "Invierto tiempo intensivo en asegurar que los estudiantes comprendan los principios fundamentales: leyes de conservación, principios termodinámicos, fenómenos de transporte. Cuando los estudiantes realmente comprenden estos fundamentos, no necesitan una hoja de fórmulas para cada caso. Pueden deducir lo que requieren, reconocer patrones y construir soluciones. Como me enseñó el profesor Ramírez, cuando entiendes los fundamentos, todo lo demás encaja de forma natural."
    },
  },
  {
    title: { en: 'Active Construction with Bidirectional Curiosity', es: 'Construcción activa con curiosidad bidireccional' },
    icon: React.createElement('img', { src: "https://cdn-icons-png.flaticon.com/512/1969/1969057.png", className: "h-8 w-8", alt: "Bidirectional Curiosity Icon" }),
    description: {
      en: "I rigorously teach fundamentals, then guide students through increasingly complex problems where they build from these principles. But learning flows both ways. Their questions and approaches often reveal angles I hadn't considered. This mutual curiosity creates a learning laboratory where I explicitly acknowledge that I'm learning alongside them, removing artificial hierarchies that inhibit genuine inquiry.",
      es: "Enseño los fundamentos con rigor y luego guío a los estudiantes a través de problemas cada vez más complejos en los que construyen a partir de esos principios. Pero el aprendizaje fluye en ambos sentidos. Sus preguntas y enfoques a menudo revelan ángulos que yo no había considerado. Esta curiosidad mutua crea un laboratorio de aprendizaje en el que reconozco de forma explícita que estoy aprendiendo junto a ellos, eliminando jerarquías artificiales que inhiben la indagación genuina."
    },
  },
  {
    title: { en: 'Networks Over Isolated Knowledge', es: 'Redes por encima del conocimiento aislado' },
    icon: React.createElement('img', { src: "https://cdn-icons-png.flaticon.com/512/1239/1239608.png", className: "h-8 w-8", alt: "Networks Icon" }),
    description: {
      en: "Real-world connections extend beyond case studies. I view my role as a node connector: linking students with peers, industry professionals, researchers, and alumni. I model this through diverse research collaborations, showing students that even experts rely on networks rather than isolated expertise. Knowing when and how to seek help matters as much as individual capability.",
      es: "Las conexiones del mundo real van más allá de los casos de estudio. Concibo mi rol como el de un conector de nodos: vinculo a los estudiantes con sus pares, profesionales de la industria, investigadores y egresados. Modelo esto a través de diversas colaboraciones de investigación, mostrando a los estudiantes que incluso los expertos dependen de redes en lugar de una experticia aislada. Saber cuándo y cómo pedir ayuda importa tanto como la capacidad individual."
    },
  },
  {
    title: { en: 'Social Learning as Evolutionary Pressure', es: 'El aprendizaje social como presión evolutiva' },
    icon: React.createElement('img', { src: "https://cdn-icons-png.flaticon.com/512/1956/1956643.png", className: "h-8 w-8", alt: "Social Learning Icon" }),
    description: {
      en: "Team-based and experiential learning aren't just pedagogical tools; they're evolutionary pressures that develop adaptability. By constantly changing team compositions and challenge contexts, I create environments where students must continuously adapt their collaboration strategies. This mirrors the professional world where adaptability and teamwork matter more than specialized knowledge.",
      es: "El aprendizaje en equipo y experiencial no son solo herramientas pedagógicas; son presiones evolutivas que desarrollan la adaptabilidad. Al cambiar constantemente la composición de los equipos y los contextos de los retos, creo entornos en los que los estudiantes deben adaptar continuamente sus estrategias de colaboración. Esto refleja el mundo profesional, donde la adaptabilidad y el trabajo en equipo importan más que el conocimiento especializado."
    },
  },
  {
    title: { en: 'Confidence Through Mastery and Evolution', es: 'Confianza a través del dominio y la evolución' },
    icon: React.createElement('img', { src: "https://cdn-icons-png.flaticon.com/512/11244/11244296.png", className: "h-8 w-8", alt: "Confidence and Mastery Icon" }),
    description: {
      en: "When I tell students \"you are capable,\" it's based on genuine mastery of fundamentals combined with the confidence to ask for help when needed. I maintain high standards while adapting methods. If current students connect better through computational tools or industrial examples, I adjust the path, not the destination. The rigor remains; the delivery evolves.",
      es: "Cuando les digo a los estudiantes «eres capaz», se basa en un dominio genuino de los fundamentos combinado con la confianza para pedir ayuda cuando se necesita. Mantengo altos estándares mientras adapto los métodos. Si los estudiantes actuales conectan mejor a través de herramientas computacionales o ejemplos industriales, ajusto el camino, no el destino. El rigor permanece; la forma de enseñarlo evoluciona."
    },
  }
];


export interface Testimonial {
  quote: Localized;
  name: string;
  info: Localized;
  imageUrl: string;
  context: Localized;
  category: 'Teaching & Mentorship' | 'Research Advising';
}

export const testimonials: Testimonial[] = [
  {
    quote: {
      en: "Professor Luis H. Reyes was a fundamental figure throughout my academic career: first as my undergraduate professor, then as my thesis director, and later as my master's advisor. In every capacity, he demonstrated a profound commitment, consistent academic rigor, and a distinct human quality that set him apart. His clear guidance in research, combined with his ability to foster critical thinking and excellence, was key to my professional and scientific development. I am certain that his work is a significant contribution to the education of future generations of students and researchers.",
      es: "El profesor Luis H. Reyes fue una figura fundamental a lo largo de toda mi carrera académica: primero como mi profesor de pregrado, luego como director de mi tesis y más tarde como asesor de mi maestría. En cada uno de esos roles demostró un compromiso profundo, un rigor académico constante y una calidad humana distintiva que lo hizo destacar. Su orientación clara en la investigación, sumada a su capacidad para fomentar el pensamiento crítico y la excelencia, fue clave para mi desarrollo profesional y científico. Estoy segura de que su labor es una contribución significativa a la formación de futuras generaciones de estudiantes e investigadores."
    },
    name: "Angie Daniela Bolaños Barbosa",
    info: { en: "University Tutor at Fundación Alquería Cavelier", es: "Tutora universitaria en la Fundación Alquería Cavelier" },
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5804.jpeg",
    context: { en: "Undergraduate, Thesis & M.S. Mentorship", es: "Mentoría de pregrado, tesis y maestría" },
    category: 'Research Advising'
  },
  {
    quote: {
      en: "During my doctorate, I had the opportunity to have Luis H. Reyes as my main supervisor. His guidance was characterized by an academic openness that allowed me to explore my own research interests, combined with constant guidance that fostered autonomy in my formative process. Furthermore, his supervisory style was considerate and respectful of my time, offering solid academic guidance while respecting my work rhythms. His approachability, genuineness, and willingness to provide support with resources and tools were fundamental to my growth as a researcher.",
      es: "Durante mi doctorado tuve la oportunidad de contar con Luis H. Reyes como mi supervisor principal. Su acompañamiento se caracterizó por una apertura académica que me permitió explorar mis propios intereses de investigación, combinada con una orientación constante que fomentó la autonomía en mi proceso formativo. Además, su estilo de supervisión fue considerado y respetuoso de mi tiempo, brindando una guía académica sólida a la vez que respetaba mis ritmos de trabajo. Su cercanía, autenticidad y disposición para apoyar con recursos y herramientas fueron fundamentales para mi crecimiento como investigador."
    },
    name: "Brayan Rodríguez",
    info: { en: "Assistant Professor at Pontificia Universidad Javeriana", es: "Profesor asistente en la Pontificia Universidad Javeriana" },
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/Brayan%20Rodriguez.JPG",
    context: { en: "Ph.D. Thesis Advisee, Engineering", es: "Dirigido de tesis doctoral, Ingeniería" },
    category: 'Research Advising'
  },
  {
    quote: {
      en: "As my doctoral thesis director, LuisH demonstrated a remarkable capacity for strategic and methodological guidance. His mentorship was distinguished by the combination of academic rigor, business practicality, and sensitivity to the particularities of each student, which helped to maximize my abilities. In my case, his guidance was decisive in structuring and strengthening my doctoral project, providing not only specialized knowledge but also confidence and motivation at every stage of the process.",
      es: "Como director de mi tesis doctoral, LuisH demostró una notable capacidad de orientación estratégica y metodológica. Su mentoría se distinguió por la combinación de rigor académico, practicidad empresarial y sensibilidad hacia las particularidades de cada estudiante, lo que ayudó a maximizar mis capacidades. En mi caso, su orientación fue decisiva para estructurar y fortalecer mi proyecto doctoral, aportando no solo conocimiento especializado, sino también confianza y motivación en cada etapa del proceso."
    },
    name: "Julián F. Becerra-Encinales",
    info: { en: "Director of Technological Extension at Cenipalma", es: "Director de Extensión Tecnológica en Cenipalma" },
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/Julian%20Fernando%20Becerra-Encinales.JPG",
    context: { en: "Ph.D. Thesis Advisee, Technological Innovation Management", es: "Dirigido de tesis doctoral, Gestión de la Innovación Tecnológica" },
    category: 'Research Advising'
  },
  {
    quote: {
      en: "Professor Reyes's pedagogical approach, centered on project-based work and clear objectives, was decisive in my academic development. His guidance taught me to tackle complex problems with a systematic approach: breaking them down, formulating concrete hypotheses, designing rigorous tests, and executing experiments to validate them. He always encouraged me to understand phenomena in depth, avoiding 'black box' thinking and constantly asking 'why.' This practice strengthened my analytical skills and shaped how I approach research and innovation in the biomedical field today.",
      es: "El enfoque pedagógico del profesor Reyes, centrado en el trabajo por proyectos y en objetivos claros, fue decisivo para mi desarrollo académico. Su orientación me enseñó a abordar problemas complejos con un método sistemático: descomponerlos, formular hipótesis concretas, diseñar pruebas rigurosas y ejecutar experimentos para validarlas. Siempre me animó a comprender los fenómenos en profundidad, evitando el pensamiento de 'caja negra' y preguntando constantemente 'por qué'. Esta práctica fortaleció mis habilidades analíticas y moldeó la forma en que hoy abordo la investigación y la innovación en el campo biomédico."
    },
    name: "Cristian F. Rodríguez",
    info: { en: "Instructor Professor at Universidad de los Andes", es: "Profesor instructor en la Universidad de los Andes" },
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5728.jpg",
    context: { en: "M.S. Thesis Advisee, Biomedical Engineering", es: "Dirigido de tesis de maestría, Ingeniería Biomédica" },
    category: 'Research Advising'
  },
  {
    quote: {
      en: "Industrial Biotechnology is a course that reveals the diverse applications of Chemical Engineering when combined with biology, opening up a world of possibilities for a more sustainable future. In Professor Luis H.'s class, we not only learned about the various stages of bioproduct production but also developed critical thinking about the consequences, advantages, and disadvantages of designing these products and processes.",
      es: "Biotecnología Industrial es un curso que revela las diversas aplicaciones de la Ingeniería Química cuando se combina con la biología, abriendo un mundo de posibilidades hacia un futuro más sostenible. En la clase del profesor Luis H. no solo aprendimos sobre las distintas etapas de producción de bioproductos, sino que también desarrollamos un pensamiento crítico sobre las consecuencias, ventajas y desventajas de diseñar estos productos y procesos."
    },
    name: "Daniela Aristizabal",
    info: { en: "Management Specialist at Bavaria", es: "Especialista de gestión en Bavaria" },
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5792%20(1).jpeg",
    context: { en: "Course: Industrial Biotechnology", es: "Curso: Biotecnología Industrial" },
    category: 'Teaching & Mentorship'
  },
  {
    quote: {
      en: "Industrial Biotechnology is an exciting course because it brings together and applies concepts from throughout the entire curriculum. The methodology effectively ties together key concepts, providing a comprehensive understanding of the subject. The final third of the class was the most interesting, as it showcased various real-world applications of biotechnology. This opened my perspective on how the semester's lessons translate into tangible developments and innovations.",
      es: "Biotecnología Industrial es un curso apasionante porque reúne y aplica conceptos de todo el plan de estudios. La metodología articula de manera efectiva los conceptos clave, proporcionando una comprensión integral de la materia. El último tercio de la clase fue el más interesante, pues mostró diversas aplicaciones de la biotecnología en el mundo real. Esto amplió mi perspectiva sobre cómo las lecciones del semestre se traducen en desarrollos e innovaciones tangibles."
    },
    name: "David Santamaría",
    info: { en: "Cheese Expert at Novonesis", es: "Experto en quesos en Novonesis" },
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5791.jpeg",
    context: { en: "Course: Industrial Biotechnology", es: "Curso: Biotecnología Industrial" },
    category: 'Teaching & Mentorship'
  },
  {
    quote: {
      en: "The Industrial Biotechnology course was highly engaging and well-structured. The topics were organized sequentially, and the classes were enriched with recent scientific articles, which made the content feel current and relevant. However, I found the most valuable components to be the emphasis on debate, critical thinking, and the challenge of defending a position with scientific evidence. In short, it was a truly formative experience in every sense of the word.",
      es: "El curso de Biotecnología Industrial fue muy atractivo y estuvo bien estructurado. Los temas se organizaron de forma secuencial y las clases se enriquecieron con artículos científicos recientes, lo que hizo que el contenido se sintiera actual y pertinente. Sin embargo, los componentes que más valoré fueron el énfasis en el debate, el pensamiento crítico y el reto de defender una postura con evidencia científica. En resumen, fue una experiencia verdaderamente formativa en todo el sentido de la palabra."
    },
    name: "Fabio Esteban Herrera",
    info: { en: "Postdoctoral Researcher in Molecular Machine Learning, Leibniz Institute of Plant Biochemistry", es: "Investigador postdoctoral en Aprendizaje Automático Molecular, Leibniz Institute of Plant Biochemistry" },
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5797.jpeg",
    context: { en: "Course: Industrial Biotechnology", es: "Curso: Biotecnología Industrial" },
    category: 'Teaching & Mentorship'
  },
  {
    quote: {
      en: "The brewing course is an excellent opportunity to gain specific knowledge about the entire brewing process, from evaluating malt quality to packaging the final product. As a Chemical Engineering graduate now working as a Quality Assurance Specialist at Central Cervecera de Colombia, I can say that taking this course was one of the best decisions of my academic career. It provided me with a strong foundation to understand the operations and objectives of the beer industry in a clear and efficient way.",
      es: "El curso de cervecería es una excelente oportunidad para adquirir conocimientos específicos sobre todo el proceso de elaboración de cerveza, desde la evaluación de la calidad de la malta hasta el empaque del producto final. Como graduada de Ingeniería Química que hoy trabaja como Especialista de Aseguramiento de Calidad en Central Cervecera de Colombia, puedo decir que tomar este curso fue una de las mejores decisiones de mi carrera académica. Me brindó una base sólida para comprender de manera clara y eficiente las operaciones y objetivos de la industria cervecera."
    },
    name: "Diego Alejandro Peñaloza Mayorga",
    info: { en: "Quality Assurance Specialist, Central Cervecera de Colombia", es: "Especialista de Aseguramiento de Calidad, Central Cervecera de Colombia" },
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5790.jpeg",
    context: { en: "Course: From Yeast to Beer", es: "Curso: De la Levadura a la Cerveza" },
    category: 'Teaching & Mentorship'
  },
  {
    quote: {
      en: "'From Yeast to Beer' is built on a simple, captivating idea: understanding the beer in your hand. It sparks an innate curiosity that turns every sip into a question of 'how?' and 'why?' For me, this was the first course that truly felt like applied Chemical Engineering. We were challenged to think and act as engineers facing a real problem where our decisions directly impacted a tangible product. It’s a powerful way to learn.",
      es: "«De la Levadura a la Cerveza» se construye sobre una idea simple y cautivadora: entender la cerveza que tienes en la mano. Despierta una curiosidad innata que convierte cada sorbo en una pregunta de «¿cómo?» y «¿por qué?». Para mí, este fue el primer curso que realmente se sintió como Ingeniería Química aplicada. Se nos retó a pensar y actuar como ingenieros frente a un problema real, donde nuestras decisiones impactaban directamente un producto tangible. Es una forma poderosa de aprender."
    },
    name: "Jason Bernal Sánchez",
    info: { en: "Process Engineer, Sun Chemical", es: "Ingeniero de procesos, Sun Chemical" },
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5798.jpeg",
    context: { en: "Course: From Yeast to Beer", es: "Curso: De la Levadura a la Cerveza" },
    category: 'Teaching & Mentorship'
  },
  {
    quote: {
      en: "'From Yeast to Beer,' or as I like to call it, the 'Pola class,' is a student's first true taste of the real world of a chemical engineer. It’s where you get to manage a process and design your own product from start to finish. Luis H. ensures we tackle topics of equal or greater relevance, such as analyzing the process's environmental impact, designing and marketing a brand, and managing the product financially. This holistic approach wouldn't be possible without the passion Luis H. inspires in his students.",
      es: "«De la Levadura a la Cerveza», o como me gusta llamarla, la «clase de la pola», es el primer verdadero acercamiento de un estudiante al mundo real de un ingeniero químico. Es donde llegas a gestionar un proceso y a diseñar tu propio producto de principio a fin. Luis H. se asegura de que abordemos temas de igual o mayor relevancia, como analizar el impacto ambiental del proceso, diseñar y comercializar una marca y gestionar el producto financieramente. Este enfoque holístico no sería posible sin la pasión que Luis H. inspira en sus estudiantes."
    },
    name: "Camilo Zarate",
    info: { en: "MBA, Georgetown University", es: "MBA, Georgetown University" },
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5784.jpeg",
    context: { en: "Course: From Yeast to Beer", es: "Curso: De la Levadura a la Cerveza" },
    category: 'Teaching & Mentorship'
  },
  {
    quote: {
      en: "I had the opportunity to take several engineering courses with Luis Reyes and I could witness his work in each of these courses. He is a methodical professor, who strives to impart valuable content and integrate new technologies and current topics. He also seeks to offer practical and realistic tools that facilitate learning and skill development.\n\nIn the courses I took with him, he always managed to get us to analyze beyond the specific topics, encouraging the development of critical and structured thinking. He always encouraged us to implement what we learned in a practical way to solve real problems, going beyond theory and getting genuinely involved in our professional and personal growth.",
      es: "Tuve la oportunidad de tomar varios cursos de ingeniería con Luis Reyes y pude ser testigo de su labor en cada uno de ellos. Es un profesor metódico, que se esfuerza por impartir contenidos valiosos e integrar nuevas tecnologías y temas de actualidad. También busca ofrecer herramientas prácticas y realistas que facilitan el aprendizaje y el desarrollo de habilidades.\n\nEn los cursos que tomé con él, siempre lograba que analizáramos más allá de los temas específicos, fomentando el desarrollo de un pensamiento crítico y estructurado. Siempre nos animó a aplicar de manera práctica lo aprendido para resolver problemas reales, yendo más allá de la teoría e involucrándose genuinamente en nuestro crecimiento profesional y personal."
    },
    name: "Camila Ocasión",
    info: { en: "M.S. in Chemical Engineering, Director of Corporate Responsibility at Hevolución", es: "M.Sc. en Ingeniería Química, Directora de Responsabilidad Corporativa en Hevolución" },
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5777.JPG",
    context: { en: "Course: Multiple Engineering Courses", es: "Curso: Varios cursos de ingeniería" },
    category: 'Teaching & Mentorship'
  },
  {
    quote: {
      en: "As a thesis advisor, he never just gave direct answers; instead, he equipped me with the tools to find my own solutions, encouraging innovative thinking and a resilient attitude.",
      es: "Como asesor de tesis, nunca se limitó a dar respuestas directas; en cambio, me dotó de las herramientas para encontrar mis propias soluciones, fomentando el pensamiento innovador y una actitud resiliente."
    },
    name: "Carlos Manuel Ramirez Acosta",
    info: { en: "Research Professional at Vecol S.A.", es: "Profesional de investigación en Vecol S.A." },
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5801.jpeg",
    context: { en: "M.S. Thesis Advisee", es: "Dirigido de tesis de maestría" },
    category: 'Research Advising'
  },
  {
    quote: {
      en: "As a professor, his passion is undeniable. In one class, he used a simple discussion about pandas to teach us the fundamentals of experimental design, captivating the entire room. Years later, it's clear he wasn't just teaching us about pandas; he was teaching us to think critically, to approach questions with clear tools, and to be aware of the world around us. This anecdote shows the lasting impact of a great teacher.",
      es: "Como profesor, su pasión es innegable. En una clase, usó una simple discusión sobre los pandas para enseñarnos los fundamentos del diseño experimental, cautivando a todo el salón. Años después, queda claro que no solo nos enseñaba sobre pandas; nos enseñaba a pensar de forma crítica, a abordar preguntas con herramientas claras y a ser conscientes del mundo que nos rodea. Esta anécdota muestra el impacto duradero de un gran maestro."
    },
    name: "Carlos Manuel Ramirez Acosta",
    info: { en: "Research Professional at Vecol S.A.", es: "Profesional de investigación en Vecol S.A." },
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5801.jpeg",
    context: { en: "Course: Experimental Design", es: "Curso: Diseño Experimental" },
    category: 'Teaching & Mentorship'
  },
  {
    quote: {
      en: "During my doctoral studies, I had the opportunity to be advised by Dr. Luis H. Reyes. I witnessed his attentiveness and assertiveness in guiding my thesis development. He always gave me complete autonomy to resolve situations that arose during experiments and writing.",
      es: "Durante mis estudios doctorales tuve la oportunidad de ser asesorado por el Dr. Luis H. Reyes. Fui testigo de su atención y asertividad al guiar el desarrollo de mi tesis. Siempre me dio total autonomía para resolver las situaciones que surgían durante los experimentos y la escritura."
    },
    name: "Julian Daniel Torres Vanegas",
    info: { en: "Assistant Professor at Universidad EAN", es: "Profesor asistente en la Universidad EAN" },
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/Julian%20Daniel%20Torres%20Vanegas.JPG",
    context: { en: "Ph.D. Thesis Advisee", es: "Dirigido de tesis doctoral" },
    category: 'Research Advising'
  },
  {
    quote: {
      en: "As his teaching assistant, I also saw the great interest and effort he puts into designing creative learning experiences. These experiences motivated his students to take ownership of their learning process and engage with commitment, reflected in their excellent academic performance. I can state without a doubt that Professor Luis H. is one of the best teachers I have had, inspiring me to give my best in my current work as a professor.",
      es: "Como su asistente de docencia, también vi el gran interés y esfuerzo que pone en diseñar experiencias de aprendizaje creativas. Estas experiencias motivaron a sus estudiantes a apropiarse de su proceso de aprendizaje y a involucrarse con compromiso, lo que se reflejó en su excelente desempeño académico. Puedo afirmar sin duda que el profesor Luis H. es uno de los mejores docentes que he tenido, e inspira a que dé lo mejor de mí en mi trabajo actual como profesor."
    },
    name: "Julian Daniel Torres Vanegas",
    info: { en: "Assistant Professor at Universidad EAN", es: "Profesor asistente en la Universidad EAN" },
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/Julian%20Daniel%20Torres%20Vanegas.JPG",
    context: { en: "Teaching Assistant", es: "Asistente de docencia" },
    category: 'Teaching & Mentorship'
  },
  {
    quote: {
      en: "I had the opportunity to work with Professor Luis H. Reyes in various academic settings: first as his student in the Unit Operations course and later as a graduate assistant. In each of these contexts, the professor distinguished himself by his creativity and the constant generation of valuable ideas, which enriched both learning and academic development.",
      es: "Tuve la oportunidad de trabajar con el profesor Luis H. Reyes en distintos escenarios académicos: primero como su estudiante en el curso de Operaciones Unitarias y luego como asistente graduada. En cada uno de estos contextos, el profesor se distinguió por su creatividad y por la generación constante de ideas valiosas, que enriquecieron tanto el aprendizaje como el desarrollo académico."
    },
    name: "Olga Lucia Acuña",
    info: { en: "M.S. in Chemical Engineering", es: "M.Sc. en Ingeniería Química" },
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5782.JPG",
    context: { en: "Course Student & Graduate Assistant", es: "Estudiante del curso y asistente graduada" },
    category: 'Teaching & Mentorship'
  },
  {
    quote: {
      en: "As my thesis advisor, one of the qualities I most highlight is the freedom he provides to explore different paths when difficulties arise. This openness fosters autonomy and critical thinking, while maintaining close and guiding support. Thanks to his guidance, I was able to strengthen my academic and professional capabilities and understand the importance of leadership that combines guidance with trust in the student.",
      es: "Como asesor de mi tesis, una de las cualidades que más destaco es la libertad que brinda para explorar distintos caminos cuando surgen dificultades. Esta apertura fomenta la autonomía y el pensamiento crítico, manteniendo a la vez un acompañamiento cercano y orientador. Gracias a su guía, pude fortalecer mis capacidades académicas y profesionales y comprender la importancia de un liderazgo que combina la orientación con la confianza en el estudiante."
    },
    name: "Olga Lucia Acuña",
    info: { en: "M.S. in Chemical Engineering", es: "M.Sc. en Ingeniería Química" },
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5782.JPG",
    context: { en: "M.S. Thesis Advisee", es: "Dirigida de tesis de maestría" },
    category: 'Research Advising'
  },
  {
    quote: {
      en: "What distinguishes Professor Reyes is not just his vast experience and ability to drive innovative research, but his exceptional human quality. He sees not just his students, but the people behind them. His warmth and support transcend academics, and that value is, for me, even more significant than any technical knowledge. He is always willing to listen, guide, and motivate, even in the most challenging moments. A large part of the professional I am today is due to his influence.",
      es: "Lo que distingue al profesor Reyes no es solo su vasta experiencia y su capacidad para impulsar investigación innovadora, sino su excepcional calidad humana. No ve únicamente a sus estudiantes, sino a las personas detrás de ellos. Su calidez y apoyo trascienden lo académico, y ese valor es, para mí, aún más significativo que cualquier conocimiento técnico. Siempre está dispuesto a escuchar, orientar y motivar, incluso en los momentos más difíciles. Gran parte de la profesional que soy hoy se debe a su influencia."
    },
    name: "Valentina Quezada",
    info: { en: "Researcher at Universidad de los Andes", es: "Investigadora en la Universidad de los Andes" },
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5755.JPG",
    context: { en: "Mentorship Experience", es: "Experiencia de mentoría" },
    category: 'Teaching & Mentorship'
  },
  {
    quote: {
      en: "Under his mentorship, I participated in a pioneering project on transmembrane peptides and later, as my M.S. thesis co-advisor, he guided my work on an antifungal hydrogel, which led to a patent submission. This experience taught me the importance of developing accessible, scalable methodologies. He conveys the conviction that science must transcend the laboratory to generate a real impact on society.",
      es: "Bajo su mentoría, participé en un proyecto pionero sobre péptidos transmembranales y, más tarde, como coasesor de mi tesis de maestría, guió mi trabajo sobre un hidrogel antifúngico, que derivó en la presentación de una patente. Esta experiencia me enseñó la importancia de desarrollar metodologías accesibles y escalables. Transmite la convicción de que la ciencia debe trascender el laboratorio para generar un impacto real en la sociedad."
    },
    name: "Valentina Quezada",
    info: { en: "Researcher at Universidad de los Andes", es: "Investigadora en la Universidad de los Andes" },
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5755.JPG",
    context: { en: "Undergraduate Researcher & M.S. Thesis Advisee", es: "Investigadora de pregrado y dirigida de tesis de maestría" },
    category: 'Research Advising'
  },
  {
    quote: {
      en: "I had the opportunity to take the Unit Operations and Industrial Biotechnology courses with Professor Luis H. On both occasions, he proved to be an excellent teacher, combining a deep knowledge of the subject with a dynamic and innovative teaching methodology. From including current topics as case studies to examples from various disciplines that showed the interrelation of knowledge and the versatility of engineering to be applied in different fields, his way of teaching was always enriching. He even implemented novel methods for exams, such as the Jeopardy format, and always maintained an 'open door' policy to clarify students' specific doubts. All this made it so that, even seven years later, I can affirm that it was one of the lessons I internalized the most during my time at the university.",
      es: "Tuve la oportunidad de tomar los cursos de Operaciones Unitarias y Biotecnología Industrial con el profesor Luis H. En ambas ocasiones demostró ser un excelente docente, combinando un profundo conocimiento de la materia con una metodología de enseñanza dinámica e innovadora. Desde incluir temas de actualidad como casos de estudio hasta ejemplos de diversas disciplinas que mostraban la interrelación del conocimiento y la versatilidad de la ingeniería para aplicarse en distintos campos, su forma de enseñar siempre fue enriquecedora. Incluso implementó métodos novedosos para los exámenes, como el formato Jeopardy, y siempre mantuvo una política de 'puertas abiertas' para resolver las dudas específicas de los estudiantes. Todo esto hizo que, incluso siete años después, pueda afirmar que fue una de las lecciones que más interioricé durante mi paso por la universidad."
    },
    name: "Juanita Sierra",
    info: { en: "Consultant in sustainable finance at Ambire Global", es: "Consultora en finanzas sostenibles en Ambire Global" },
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5799.jpeg",
    context: { en: "Course: Unit Operations & Industrial Biotechnology", es: "Curso: Operaciones Unitarias y Biotecnología Industrial" },
    category: 'Teaching & Mentorship'
  },
  {
    quote: {
      en: "That versatility of Luis H. motivated me to seek him out as my thesis advisor. In this process, we designed an oxygen concentrator for its application in fish farming. During this time, it was evident not only his support in administrative matters, but also his ability to foster an environment of curiosity in which it was possible to question our methods and arrive at creative and 'out-of-the-box' solutions to overcome the challenges that arose along the way.\n\nToday, Luis H. continues to be for me a model of innovation, adaptability, and commitment to teaching.",
      es: "Esa versatilidad de Luis H. me motivó a buscarlo como asesor de mi tesis. En este proceso, diseñamos un concentrador de oxígeno para su aplicación en la piscicultura. Durante este tiempo se hizo evidente no solo su apoyo en asuntos administrativos, sino también su capacidad para fomentar un entorno de curiosidad en el que era posible cuestionar nuestros métodos y llegar a soluciones creativas y 'fuera de la caja' para superar los retos que surgían en el camino.\n\nHoy, Luis H. sigue siendo para mí un modelo de innovación, adaptabilidad y compromiso con la docencia."
    },
    name: "Juanita Sierra",
    info: { en: "Consultant in sustainable finance at Ambire Global", es: "Consultora en finanzas sostenibles en Ambire Global" },
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5799.jpeg",
    context: { en: "Undergraduate Thesis Advisee", es: "Dirigida de tesis de pregrado" },
    category: 'Research Advising'
  },
  {
    quote: {
      en: "Working with Professor Luis between 2019 and 2021 was a key stage in my academic and professional development. During that time, I had the opportunity to have his support as my master's thesis advisor and, at the same time, as my supervisor in my roles as a research assistant and teaching assistant for the Unit Operations course. His passion for science and research left a significant mark on me, especially as I began my journey in the world of bioprocesses and biotechnology. Experiencing this stage during the pandemic made his guidance even more valuable; his constant support gave me peace of mind amid the uncertainty and allowed my research project to have a significant impact during a complicated time. Thanks to his guidance, I was able to focus my knowledge in an area I am passionate about, which undoubtedly defined the course of my career.",
      es: "Trabajar con el profesor Luis entre 2019 y 2021 fue una etapa clave en mi desarrollo académico y profesional. Durante ese tiempo tuve la oportunidad de contar con su apoyo como asesor de mi tesis de maestría y, al mismo tiempo, como mi supervisor en mis roles de asistente de investigación y de docencia para el curso de Operaciones Unitarias. Su pasión por la ciencia y la investigación dejó en mí una huella significativa, especialmente al iniciar mi camino en el mundo de los bioprocesos y la biotecnología. Vivir esta etapa durante la pandemia hizo su orientación aún más valiosa; su apoyo constante me dio tranquilidad en medio de la incertidumbre y permitió que mi proyecto de investigación tuviera un impacto significativo en un momento complicado. Gracias a su guía, pude enfocar mi conocimiento en un área que me apasiona, lo que sin duda definió el rumbo de mi carrera."
    },
    name: "Maria Camila Henao",
    info: { en: "Scientist at VaxThera", es: "Científica en VaxThera" },
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5759.JPG",
    context: { en: "M.S. Thesis Advisee & Research/Teaching Assistant", es: "Dirigida de tesis de maestría y asistente de investigación/docencia" },
    category: 'Research Advising'
  },
  {
    quote: {
      en: "My professional relationship with Professor Luis gave me much more than technical knowledge; he instilled in me important values for my personal growth. With him, I learned to see mistakes as opportunities for improvement and to work with a greater awareness of my weaknesses. He always knew how to correct with respect and teach with enthusiasm, which created a positive and challenging learning environment. Today, four years after graduating, I am grateful for everything he gave me, not only as a teacher but also as a mentor. A large part of the professional I am today is due to his guidance, and I hope one day we can reconnect on future projects.\n\nFinally, I'd like to point out that one rarely has the chance to learn so much from someone as cool as Luis: his approachability and sense of humor made even the most demanding days in the lab much more bearable.",
      es: "Mi relación profesional con el profesor Luis me dio mucho más que conocimiento técnico; me inculcó valores importantes para mi crecimiento personal. Con él aprendí a ver los errores como oportunidades de mejora y a trabajar con una mayor conciencia de mis debilidades. Siempre supo corregir con respeto y enseñar con entusiasmo, lo que creó un ambiente de aprendizaje positivo y retador. Hoy, cuatro años después de graduarme, agradezco todo lo que me dio, no solo como docente sino también como mentor. Gran parte de la profesional que soy hoy se debe a su guía, y espero que algún día podamos reencontrarnos en proyectos futuros.\n\nPor último, quisiera señalar que pocas veces se tiene la oportunidad de aprender tanto de alguien tan genial como Luis: su cercanía y sentido del humor hicieron mucho más llevaderos incluso los días más exigentes en el laboratorio."
    },
    name: "Maria Camila Henao",
    info: { en: "Scientist at VaxThera", es: "Científica en VaxThera" },
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5759.JPG",
    context: { en: "General Mentorship", es: "Mentoría general" },
    category: 'Teaching & Mentorship'
  }
];
