import type { Localized } from '../../context/i18n';

/**
 * Los nombres de los cursos, como los registra la Universidad (y como los traen sus
 * programas). Los que se registran en inglés se quedan en inglés en los dos idiomas.
 */
export const COURSE = {
  ou:        { en: 'Unit Operations', es: 'Operaciones Unitarias' },
  pi2:       { en: 'Integrated Project 2', es: 'Proyecto Integrado 2' },
  pou:       { en: 'Unit Operations Project', es: 'Proyecto de Operaciones Unitarias' },
  challenge: 'Chemical Engineering Challenge',
  chemfood:  'ChemFood Challenge',
  pmdi:      { en: 'Multidisciplinary Design Project in Engineering', es: 'Proyecto de Diseño Multidisciplinario en Ingeniería' },
  spdp:      { en: 'Professional Development Project Seminar', es: 'Seminario de Proyecto de Desarrollo Profesional' },
  beer:      'From yeast to beer: The scientific principles of brewing',
  biotec:    { en: 'Industrial Biotechnology', es: 'Biotecnología Industrial' },
  dpro:      { en: 'Systemic Design of Bioproducts', es: 'Diseño Sistémico de Bioproductos' },
  fdb:       { en: 'Fundamentals of Bioproduct Design', es: 'Fundamentos de Diseño de Bioproductos' },
  micro:     { en: 'Food Microbiology', es: 'Microbiología de Alimentos' },
  dexp:      { en: 'Experimental Design in Chemical Engineering', es: 'Diseño Experimental en Ingeniería Química' },
  pandora:   { en: 'Pandora’s Lab: From “Eureka!” to disaster', es: 'El Laboratorio de Pandora: Del «¡Eureka!» al desastre' },
  mgi:       { en: 'Generative AI Applications in Engineering Project Management', es: 'Aplicaciones de IA Generativa en la Gestión de Proyectos de Ingeniería' },
} satisfies Record<string, Localized>;

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
  // 2026
  { term: '2026-20', year: 2026, code: 'MGI-4307', title: COURSE.mgi, students: 49, type: 'Elective', level: 'Graduate', evaluation: null },
  { term: '2026-10', year: 2026, code: 'IQYA-2031', title: COURSE.pou, students: 29, type: 'Core', level: 'Undergraduate', evaluation: 155 },
  { term: '2026-10', year: 2026, code: 'IQYA-4100', title: COURSE.biotec, students: 16, type: 'Elective', level: 'Graduate', evaluation: 137 },
  { term: '2026-10', year: 2026, code: 'DPRO-4300', title: COURSE.dpro, students: 16, type: 'Core', level: 'Graduate', evaluation: null },
  { term: '2026-10', year: 2026, code: 'IQYA-3050', title: COURSE.spdp, students: 19, type: 'Core', level: 'Undergraduate', evaluation: null },

  // 2025
  { term: '2025-20', year: 2025, code: 'MGI-4307', title: COURSE.mgi, students: 45, type: 'Elective', level: 'Graduate', evaluation: null },
  { term: '2025-20', year: 2025, code: 'CBP-C1320', title: COURSE.pandora, students: 37, type: 'CBU', level: 'Undergraduate', evaluation: 157 },
  { term: '2025-20', year: 2025, code: 'IQYA-2031', title: COURSE.pou, students: 32, type: 'Core', level: 'Undergraduate', evaluation: 156 },
  { term: '2025-10', year: 2025, code: 'DPRO-4300', title: COURSE.dpro, students: 23, type: 'Core', level: 'Graduate', evaluation: 155 },
  { term: '2025-10', year: 2025, code: 'IQYA-4100', title: COURSE.biotec, students: 7, type: 'Elective', level: 'Graduate', evaluation: 158 },
  { term: '2025-20', year: 2025, code: 'IQYA-3050', title: COURSE.spdp, students: 22, type: 'Core', level: 'Undergraduate', evaluation: null },
  { term: '2025-10', year: 2025, code: 'IQYA-3050', title: COURSE.spdp, students: 18, type: 'Core', level: 'Undergraduate', evaluation: null },

  // 2024
  { term: '2024-20', year: 2024, code: 'CBP-C1320', title: COURSE.pandora, students: 37, type: 'CBU', level: 'Undergraduate', evaluation: 158 },
  { term: '2024-20', year: 2024, code: 'IQYA-2031', title: COURSE.pou, students: 16, type: 'Core', level: 'Undergraduate', evaluation: 149 },
  { term: '2024-20', year: 2024, code: 'IQYA-3012', title: COURSE.micro, students: 4, type: 'Core', level: 'Undergraduate', evaluation: 154 },
  { term: '2024-10', year: 2024, code: 'DPRO-4300', title: COURSE.dpro, students: 18, type: 'Core', level: 'Graduate', evaluation: 155 },
  { term: '2024-10', year: 2024, code: 'IQYA-2031', title: COURSE.pou, students: 24, type: 'Core', level: 'Undergraduate', evaluation: 149 },
  { term: '2024-10', year: 2024, code: 'IQYA-3012', title: COURSE.micro, students: 21, type: 'Core', level: 'Undergraduate', evaluation: 155 },
  { term: '2024-20', year: 2024, code: 'IQYA-3050', title: COURSE.spdp, students: 14, type: 'Core', level: 'Undergraduate', evaluation: null },
  { term: '2024-10', year: 2024, code: 'IQYA-3050', title: COURSE.spdp, students: 12, type: 'Core', level: 'Undergraduate', evaluation: null },
  
  // 2023
  { term: '2023-20', year: 2023, code: 'CBP-C1320', title: COURSE.pandora, students: 36, type: 'CBU', level: 'Undergraduate', evaluation: 158 },
  { term: '2023-20', year: 2023, code: 'IQYA-2032', title: COURSE.pi2, students: 18, type: 'Core', level: 'Undergraduate', evaluation: 152 },
  { term: '2023-20', year: 2023, code: 'IQYA-3602', title: COURSE.chemfood, students: 24, type: 'Elective', level: 'Undergraduate', evaluation: 160 },
  { term: '2023-20', year: 2023, code: 'IQYA-3901', title: { en: 'IQUI Special Project', es: 'Proyecto Especial IQUI' }, students: 2, type: 'Elective', level: 'Undergraduate', evaluation: 153 },
  { term: '2023-20', year: 2023, code: 'IQYA-4100', title: COURSE.biotec, students: 17, type: 'Elective', level: 'Graduate', evaluation: 141 },
  { term: '2023-10', year: 2023, code: 'IQYA-3601', title: COURSE.challenge, students: 27, type: 'Elective', level: 'Undergraduate', evaluation: 157 },
  { term: '2023-10', year: 2023, code: 'IQYA-2032', title: COURSE.pi2, students: 29, type: 'Core', level: 'Undergraduate', evaluation: 143 },
  { term: '2023-10', year: 2023, code: 'DPRO-4300', title: COURSE.dpro, students: 15, type: 'Core', level: 'Graduate', evaluation: 153 },
  { term: '2023-20', year: 2023, code: 'IQYA-3050', title: COURSE.spdp, students: 12, type: 'Core', level: 'Undergraduate', evaluation: null },
  { term: '2023-10', year: 2023, code: 'IQYA-3050', title: COURSE.spdp, students: 11, type: 'Core', level: 'Undergraduate', evaluation: null },

  // 2022
  { term: '2022-20', year: 2022, code: 'IQUI-4230', title: COURSE.biotec, students: 26, type: 'Elective', level: 'Graduate', evaluation: 152 },
  { term: '2022-20', year: 2022, code: 'IQUI-3094', title: COURSE.spdp, students: 38, type: 'Core', level: 'Undergraduate', evaluation: 157 },
  { term: '2022-20', year: 2022, code: 'IQUI-2032', title: COURSE.pi2, students: 36, type: 'Core', level: 'Undergraduate', evaluation: 135 },
  { term: '2022-20', year: 2022, code: 'CBP-C1320', title: COURSE.pandora, students: 27, type: 'CBU', level: 'Undergraduate', evaluation: 158 },
  { term: '2022-20', year: 2022, code: 'IALI-3094', title: COURSE.spdp, students: 2, type: 'Core', level: 'Undergraduate', evaluation: 151 },
  { term: '2022-10', year: 2022, code: 'IQUI-3094', title: COURSE.spdp, students: 50, type: 'Core', level: 'Undergraduate', evaluation: 155 },
  { term: '2022-10', year: 2022, code: 'IQUI-3090', title: { en: 'Thesis Project Seminar', es: 'Seminario de Proyecto de Tesis' }, students: 8, type: 'Core', level: 'Undergraduate', evaluation: 156 },
  { term: '2022-10', year: 2022, code: 'IQUI-2032', title: COURSE.pi2, students: 79, type: 'Core', level: 'Undergraduate', evaluation: 143 },
  { term: '2022-10', year: 2022, code: 'IALI-3101', title: COURSE.beer, students: 59, type: 'Elective', level: 'Undergraduate', evaluation: 154 },
  { term: '2022-10', year: 2022, code: 'IALI-3094', title: COURSE.spdp, students: 5, type: 'Core', level: 'Undergraduate', evaluation: 141 },
  { term: '2022-10', year: 2022, code: 'DPRO-4300', title: COURSE.dpro, students: 30, type: 'Core', level: 'Graduate', evaluation: 140 },

  // 2021
  { term: '2021-20', year: 2021, code: 'IQUI-4230', title: COURSE.biotec, students: 13, type: 'Elective', level: 'Graduate', evaluation: 160 },
  { term: '2021-20', year: 2021, code: 'IQUI-2032', title: COURSE.pi2, students: 86, type: 'Core', level: 'Undergraduate', evaluation: 141 },
  { term: '2021-20', year: 2021, code: 'CBP-C1320', title: COURSE.pandora, students: 31, type: 'CBU', level: 'Undergraduate', evaluation: 157 },
  { term: '2021-10', year: 2021, code: 'IQUI-3350', title: COURSE.challenge, students: 14, type: 'Elective', level: 'Undergraduate', evaluation: 159 },
  { term: '2021-10', year: 2021, code: 'IQUI-3010', title: COURSE.ou, students: 36, type: 'Core', level: 'Undergraduate', evaluation: 153 },
  { term: '2021-10', year: 2021, code: 'IALI-3101', title: COURSE.beer, students: 10, type: 'Elective', level: 'Undergraduate', evaluation: 159 },

  // 2020
  { term: '2020-20', year: 2020, code: 'IQUI-3010', title: COURSE.ou, students: 49, type: 'Core', level: 'Undergraduate', evaluation: 152 },
  { term: '2020-20', year: 2020, code: 'IING-3000', title: COURSE.pmdi, students: 38, type: 'Elective', level: 'Undergraduate', evaluation: 152 },
  { term: '2020-20', year: 2020, code: 'IQUI-3520', title: COURSE.fdb, students: 27, type: 'Elective', level: 'Undergraduate', evaluation: 154 },
  { term: '2020-10', year: 2020, code: 'DPRO-4300', title: COURSE.dpro, students: 21, type: 'Core', level: 'Graduate', evaluation: null },
  { term: '2020-10', year: 2020, code: 'IQUI-4230', title: COURSE.biotec, students: 16, type: 'Elective', level: 'Graduate', evaluation: null },
  { term: '2020-10', year: 2020, code: 'IQUI-3350', title: COURSE.challenge, students: 17, type: 'Elective', level: 'Undergraduate', evaluation: null },
  { term: '2020-10', year: 2020, code: 'IQUI-3010', title: COURSE.ou, students: 56, type: 'Core', level: 'Undergraduate', evaluation: null },
  
  // 2019
  { term: '2019-20', year: 2019, code: 'IQUI-3010', title: COURSE.ou, students: 75, type: 'Core', level: 'Undergraduate', evaluation: 152 },
  { term: '2019-20', year: 2019, code: 'IQUI-3518', title: COURSE.beer, students: 25, type: 'Elective', level: 'Undergraduate', evaluation: 162 },
  { term: '2019-10', year: 2019, code: 'DPRO-4300', title: COURSE.dpro, students: 11, type: 'Core', level: 'Graduate', evaluation: 158 },
  { term: '2019-10', year: 2019, code: 'IQUI-3010', title: COURSE.ou, students: 68, type: 'Core', level: 'Undergraduate', evaluation: 153 },
  { term: '2019-10', year: 2019, code: 'IQUI-3350', title: COURSE.challenge, students: 21, type: 'Elective', level: 'Undergraduate', evaluation: 163 },
  { term: '2019-10', year: 2019, code: 'IQUI-4230', title: COURSE.biotec, students: 26, type: 'Elective', level: 'Graduate', evaluation: 159 },
  
  // 2018
  { term: '2018-20', year: 2018, code: 'IQUI-3010', title: COURSE.ou, students: 50, type: 'Core', level: 'Undergraduate', evaluation: 153 },
  { term: '2018-20', year: 2018, code: 'IQUI-3518', title: COURSE.beer, students: 30, type: 'Elective', level: 'Undergraduate', evaluation: 161 },
  { term: '2018-10', year: 2018, code: 'IQUI-2200', title: COURSE.dexp, students: 58, type: 'Core', level: 'Undergraduate', evaluation: 156 },
  { term: '2018-10', year: 2018, code: 'IQUI-3010', title: COURSE.ou, students: 68, type: 'Core', level: 'Undergraduate', evaluation: 154 },

  // 2017
  { term: '2017-20', year: 2017, code: 'IQUI-2200', title: COURSE.dexp, students: 50, type: 'Core', level: 'Undergraduate', evaluation: 154 },
  { term: '2017-20', year: 2017, code: 'IQUI-3010', title: COURSE.ou, students: 21, type: 'Core', level: 'Undergraduate', evaluation: 160 },
];

export interface Testimonial {
  quote: Localized;
  name: string;
  /**
   * Exact `name` of the matching record in the graduated-student data. When set,
   * the page shows that record's currentPosition and `info` is not used, so a
   * graduate's job is stated in one place. Testimonials from people without a
   * graduate record leave it unset and carry their own `info`.
   */
  graduateName?: string;
  /** Fallback shown when graduateName is unset, or when the linked record has
   *  no current position on file. */
  info: Localized;
  /** Foto de la persona; sin ella, la cita va sola. */
  imageUrl?: string;
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
    graduateName: "Angie Daniela Bolaños Barbosa",
    info: { en: "Co-founder at Moxacá Brewery", es: "Cofundadora de Moxacá Brewery" },
    imageUrl: "/images/students/angie-daniela-bolanos-barbosa.jpg",
    context: { en: "Undergraduate, Thesis & M.S. Mentorship", es: "Mentoría de pregrado, tesis y maestría" },
    category: 'Research Advising'
  },
  {
    quote: {
      en: "During my doctorate, Luis has been fundamental to my growth as a researcher and also as a person. He has always had the patience to listen to my doubts, to accompany me when I was stuck and to help me find new perspectives when I did not know how to move forward. Although he has taught me to take on my research independently and to recognize that this is my own process, his guidance has made the road feel like real teamwork. With him I can talk not only about academic matters, but also share personal experiences and say what I think without feeling judged. His closeness, his patience and his understanding of the difficulties of doing a doctorate have taken his guidance far beyond the strictly academic. I deeply value everything he has taught me, the trust he has placed in me and, above all, the inspiration he gives me to want to be a better researcher every day.",
      es: "Durante mi doctorado, Luis ha sido una persona fundamental en mi crecimiento como investigadora y también a nivel personal. Siempre ha tenido la paciencia para escuchar mis dudas, acompañarme en los momentos de estancamiento y ayudarme a encontrar nuevas perspectivas cuando no sabía cómo avanzar. Aunque me ha enseñado a asumir mi investigación con independencia y a reconocer que este es mi propio proceso, su acompañamiento ha hecho que el camino se sienta como un verdadero trabajo en equipo. Con él puedo hablar no solo de temas académicos, sino también compartir experiencias personales y expresar lo que pienso sin sentirme juzgada. Su cercanía, paciencia y capacidad para comprender las dificultades que implica hacer un doctorado han hecho que su orientación vaya mucho más allá de lo estrictamente académico. Valoro profundamente todo lo que me ha enseñado, la confianza que ha depositado en mí y, sobre todo, la inspiración que me brinda para querer ser cada día una mejor investigadora."
    },
    name: "Martha Liliana Díaz Bustamante",
    info: { en: "Doctoral student in Engineering", es: "Doctoranda en Ingeniería" },
    imageUrl: "/images/testimonials/martha-liliana-diaz-bustamante.jpg",
    context: { en: "Doctoral advising", es: "Dirección de doctorado" },
    category: 'Research Advising'
  },
  {
    quote: {
      en: "During my doctorate, I had the opportunity to have Luis H. Reyes as my main supervisor. His guidance was characterized by an academic openness that allowed me to explore my own research interests, combined with constant guidance that fostered autonomy in my formative process. Furthermore, his supervisory style was considerate and respectful of my time, offering solid academic guidance while respecting my work rhythms. His approachability, genuineness, and willingness to provide support with resources and tools were fundamental to my growth as a researcher.",
      es: "Durante mi doctorado tuve la oportunidad de contar con Luis H. Reyes como mi supervisor principal. Su acompañamiento se caracterizó por una apertura académica que me permitió explorar mis propios intereses de investigación, combinada con una orientación constante que fomentó la autonomía en mi proceso formativo. Además, su estilo de supervisión fue considerado y respetuoso de mi tiempo, brindando una guía académica sólida a la vez que respetaba mis ritmos de trabajo. Su cercanía, autenticidad y disposición para apoyar con recursos y herramientas fueron fundamentales para mi crecimiento como investigador."
    },
    name: "Brayan Rodríguez",
    graduateName: "Brayan Rodríguez",
    info: { en: "Assistant Professor at Pontificia Universidad Javeriana", es: "Profesor asistente en la Pontificia Universidad Javeriana" },
    imageUrl: "/images/students/brayan-rodriguez.jpg",
    context: { en: "Ph.D. Thesis Advisee, Engineering", es: "Dirigido de tesis doctoral, Ingeniería" },
    category: 'Research Advising'
  },
  {
    quote: {
      en: "As my doctoral thesis director, LuisH demonstrated a remarkable capacity for strategic and methodological guidance. His mentorship was distinguished by the combination of academic rigor, business practicality, and sensitivity to the particularities of each student, which helped to maximize my abilities. In my case, his guidance was decisive in structuring and strengthening my doctoral project, providing not only specialized knowledge but also confidence and motivation at every stage of the process.",
      es: "Como director de mi tesis doctoral, LuisH demostró una notable capacidad de orientación estratégica y metodológica. Su mentoría se distinguió por la combinación de rigor académico, practicidad empresarial y sensibilidad hacia las particularidades de cada estudiante, lo que ayudó a maximizar mis capacidades. En mi caso, su orientación fue decisiva para estructurar y fortalecer mi proyecto doctoral, aportando no solo conocimiento especializado, sino también confianza y motivación en cada etapa del proceso."
    },
    name: "Julián F. Becerra-Encinales",
    graduateName: "Julián Fernando Becerra-Encinales",
    info: { en: "Director of Technological Extension at Cenipalma", es: "Director de Extensión Tecnológica en Cenipalma" },
    imageUrl: "/images/students/julian-fernando-becerra-encinales.jpg",
    context: { en: "Ph.D. Thesis Advisee, Technological Innovation Management", es: "Dirigido de tesis doctoral, Gestión de la Innovación Tecnológica" },
    category: 'Research Advising'
  },
  {
    quote: {
      en: "Professor Reyes's pedagogical approach, centered on project-based work and clear objectives, was decisive in my academic development. His guidance taught me to tackle complex problems with a systematic approach: breaking them down, formulating concrete hypotheses, designing rigorous tests, and executing experiments to validate them. He always encouraged me to understand phenomena in depth, avoiding 'black box' thinking and constantly asking 'why.' This practice strengthened my analytical skills and shaped how I approach research and innovation in the biomedical field today.",
      es: "El enfoque pedagógico del profesor Reyes, centrado en el trabajo por proyectos y en objetivos claros, fue decisivo para mi desarrollo académico. Su orientación me enseñó a abordar problemas complejos con un método sistemático: descomponerlos, formular hipótesis concretas, diseñar pruebas rigurosas y ejecutar experimentos para validarlas. Siempre me animó a comprender los fenómenos en profundidad, evitando el pensamiento de 'caja negra' y preguntando constantemente 'por qué'. Esta práctica fortaleció mis habilidades analíticas y moldeó la forma en que hoy abordo la investigación y la innovación en el campo biomédico."
    },
    name: "Cristian F. Rodríguez",
    graduateName: "Cristian F. Rodríguez",
    info: { en: "Instructor Professor at Universidad de los Andes", es: "Profesor instructor en la Universidad de los Andes" },
    imageUrl: "/images/students/cristian-f-rodriguez.jpg",
    context: { en: "M.S. Thesis Advisee, Biomedical Engineering", es: "Dirigido de tesis de maestría, Ingeniería Biomédica" },
    category: 'Research Advising'
  },
  {
    quote: {
      en: "Industrial Biotechnology is a course that reveals the diverse applications of Chemical Engineering when combined with biology, opening up a world of possibilities for a more sustainable future. In Professor Luis H.'s class, we not only learned about the various stages of bioproduct production but also developed critical thinking about the consequences, advantages, and disadvantages of designing these products and processes.",
      es: "Biotecnología Industrial es un curso que revela las diversas aplicaciones de la Ingeniería Química cuando se combina con la biología, abriendo un mundo de posibilidades hacia un futuro más sostenible. En la clase del profesor Luis H. no solo aprendimos sobre las distintas etapas de producción de bioproductos, sino que también desarrollamos un pensamiento crítico sobre las consecuencias, ventajas y desventajas de diseñar estos productos y procesos."
    },
    name: "Daniela Aristizabal",
    info: { en: "Talent Development Specialist at Fortra", es: "Especialista en Desarrollo de Talento en Fortra" },
    imageUrl: "/images/testimonials/img-5792-1.jpg",
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
    imageUrl: "/images/testimonials/img-5791.jpg",
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
    imageUrl: "/images/testimonials/img-5797.jpg",
    context: { en: "Course: Industrial Biotechnology", es: "Curso: Biotecnología Industrial" },
    category: 'Teaching & Mentorship'
  },
  {
    quote: {
      en: "The brewing course is an excellent opportunity to gain specific knowledge about the entire brewing process, from evaluating malt quality to packaging the final product. As a Chemical Engineering graduate now working as a Quality Assurance Specialist at Central Cervecera de Colombia, I can say that taking this course was one of the best decisions of my academic career. It provided me with a strong foundation to understand the operations and objectives of the beer industry in a clear and efficient way.",
      es: "El curso de cervecería es una excelente oportunidad para adquirir conocimientos específicos sobre todo el proceso de elaboración de cerveza, desde la evaluación de la calidad de la malta hasta el empaque del producto final. Como graduado de Ingeniería Química que hoy trabaja como Especialista de Aseguramiento de Calidad en Central Cervecera de Colombia, puedo decir que tomar este curso fue una de las mejores decisiones de mi carrera académica. Me brindó una base sólida para comprender de manera clara y eficiente las operaciones y objetivos de la industria cervecera."
    },
    name: "Diego Alejandro Peñaloza Mayorga",
    info: { en: "Packaging Team Lead at Central Cervecera de Colombia", es: "Líder de Equipo de Envasado en Central Cervecera de Colombia" },
    imageUrl: "/images/testimonials/img-5790.jpg",
    context: { en: "Course: From yeast to beer", es: "Curso: From yeast to beer" },
    category: 'Teaching & Mentorship'
  },
  {
    quote: {
      en: "'From yeast to beer' is built on a simple, captivating idea: understanding the beer in your hand. It sparks an innate curiosity that turns every sip into a question of 'how?' and 'why?' For me, this was the first course that truly felt like applied Chemical Engineering. We were challenged to think and act as engineers facing a real problem where our decisions directly impacted a tangible product. It’s a powerful way to learn.",
      es: "«From yeast to beer» se construye sobre una idea simple y cautivadora: entender la cerveza que tienes en la mano. Despierta una curiosidad innata que convierte cada sorbo en una pregunta de «¿cómo?» y «¿por qué?». Para mí, este fue el primer curso que realmente se sintió como Ingeniería Química aplicada. Se nos retó a pensar y actuar como ingenieros frente a un problema real, donde nuestras decisiones impactaban directamente un producto tangible. Es una forma poderosa de aprender."
    },
    name: "Jason Bernal Sánchez",
    info: { en: "Integration Lead Engineer at Kanadevia Inova", es: "Ingeniero líder de integración en Kanadevia Inova" },
    imageUrl: "/images/testimonials/img-5798.jpg",
    context: { en: "Course: From yeast to beer", es: "Curso: From yeast to beer" },
    category: 'Teaching & Mentorship'
  },
  {
    quote: {
      en: "'From yeast to beer,' or as I like to call it, the 'Pola class,' is a student's first true taste of the real world of a chemical engineer. It’s where you get to manage a process and design your own product from start to finish. Luis H. ensures we tackle topics of equal or greater relevance, such as analyzing the process's environmental impact, designing and marketing a brand, and managing the product financially. This holistic approach wouldn't be possible without the passion Luis H. inspires in his students.",
      es: "«From yeast to beer», o como me gusta llamarla, la «clase de la pola», es el primer verdadero acercamiento de un estudiante al mundo real de un ingeniero químico. Es donde llegas a gestionar un proceso y a diseñar tu propio producto de principio a fin. Luis H. se asegura de que abordemos temas de igual o mayor relevancia, como analizar el impacto ambiental del proceso, diseñar y comercializar una marca y gestionar el producto financieramente. Este enfoque holístico no sería posible sin la pasión que Luis H. inspira en sus estudiantes."
    },
    name: "Camilo Zarate",
    info: { en: "Senior Associate at PwC", es: "Asociado sénior en PwC" },
    imageUrl: "/images/testimonials/img-5784.jpg",
    context: { en: "Course: From yeast to beer", es: "Curso: From yeast to beer" },
    category: 'Teaching & Mentorship'
  },
  {
    quote: {
      en: "I had the opportunity to take several engineering courses with Luis Reyes and I could witness his work in each of these courses. He is a methodical professor, who strives to impart valuable content and integrate new technologies and current topics. He also seeks to offer practical and realistic tools that facilitate learning and skill development.\n\nIn the courses I took with him, he always managed to get us to analyze beyond the specific topics, encouraging the development of critical and structured thinking. He always encouraged us to implement what we learned in a practical way to solve real problems, going beyond theory and getting genuinely involved in our professional and personal growth.",
      es: "Tuve la oportunidad de tomar varios cursos de ingeniería con Luis Reyes y pude ser testigo de su labor en cada uno de ellos. Es un profesor metódico, que se esfuerza por impartir contenidos valiosos e integrar nuevas tecnologías y temas de actualidad. También busca ofrecer herramientas prácticas y realistas que facilitan el aprendizaje y el desarrollo de habilidades.\n\nEn los cursos que tomé con él, siempre lograba que analizáramos más allá de los temas específicos, fomentando el desarrollo de un pensamiento crítico y estructurado. Siempre nos animó a aplicar de manera práctica lo aprendido para resolver problemas reales, yendo más allá de la teoría e involucrándose genuinamente en nuestro crecimiento profesional y personal."
    },
    name: "Camila Ocasión",
    graduateName: "Camila Ocasión Martínez",
    info: { en: "Consultant at Excelsa", es: "Consultora en Excelsa" },
    imageUrl: "/images/students/camila-ocasion-martinez.jpg",
    context: { en: "Course: Multiple Engineering Courses", es: "Curso: Varios cursos de ingeniería" },
    category: 'Teaching & Mentorship'
  },
  {
    quote: {
      en: "As a thesis advisor, he never just gave direct answers; instead, he equipped me with the tools to find my own solutions, encouraging innovative thinking and a resilient attitude.",
      es: "Como asesor de tesis, nunca se limitó a dar respuestas directas; en cambio, me dotó de las herramientas para encontrar mis propias soluciones, fomentando el pensamiento innovador y una actitud resiliente."
    },
    name: "Carlos Manuel Ramírez Acosta",
    graduateName: "Carlos Manuel Ramírez Acosta",
    info: { en: "Regional Qualification Expert at Sanofi", es: "Experto Regional de Calificación en Sanofi" },
    imageUrl: "/images/students/carlos-manuel-ramirez-acosta.jpg",
    context: { en: "M.S. Thesis Advisee", es: "Dirigido de tesis de maestría" },
    category: 'Research Advising'
  },
  {
    quote: {
      en: "As a professor, his passion is undeniable. In one class, he used a simple discussion about pandas to teach us the fundamentals of experimental design, captivating the entire room. Years later, it's clear he wasn't just teaching us about pandas; he was teaching us to think critically, to approach questions with clear tools, and to be aware of the world around us. This anecdote shows the lasting impact of a great teacher.",
      es: "Como profesor, su pasión es innegable. En una clase, usó una simple discusión sobre los pandas para enseñarnos los fundamentos del diseño experimental, cautivando a todo el salón. Años después, queda claro que no solo nos enseñaba sobre pandas; nos enseñaba a pensar de forma crítica, a abordar preguntas con herramientas claras y a ser conscientes del mundo que nos rodea. Esta anécdota muestra el impacto duradero de un gran maestro."
    },
    name: "Carlos Manuel Ramírez Acosta",
    graduateName: "Carlos Manuel Ramírez Acosta",
    info: { en: "Regional Qualification Expert at Sanofi", es: "Experto Regional de Calificación en Sanofi" },
    imageUrl: "/images/students/carlos-manuel-ramirez-acosta.jpg",
    context: { en: "Course: Experimental Design", es: "Curso: Diseño Experimental" },
    category: 'Teaching & Mentorship'
  },
  {
    quote: {
      en: "During my doctoral studies, I had the opportunity to be advised by Dr. Luis H. Reyes. I witnessed his attentiveness and assertiveness in guiding my thesis development. He always gave me complete autonomy to resolve situations that arose during experiments and writing.",
      es: "Durante mis estudios doctorales tuve la oportunidad de ser asesorado por el Dr. Luis H. Reyes. Fui testigo de su atención y asertividad al guiar el desarrollo de mi tesis. Siempre me dio total autonomía para resolver las situaciones que surgían durante los experimentos y la escritura."
    },
    name: "Julian Daniel Torres Vanegas",
    graduateName: "Julian Daniel Torres Vanegas",
    info: { en: "Assistant Professor at Universidad EAN", es: "Profesor asistente en la Universidad EAN" },
    imageUrl: "/images/students/julian-daniel-torres-vanegas.jpg",
    context: { en: "Ph.D. Thesis Advisee", es: "Dirigido de tesis doctoral" },
    category: 'Research Advising'
  },
  {
    quote: {
      en: "As his teaching assistant, I also saw the great interest and effort he puts into designing creative learning experiences. These experiences motivated his students to take ownership of their learning process and engage with commitment, reflected in their excellent academic performance. I can state without a doubt that Professor Luis H. is one of the best teachers I have had, inspiring me to give my best in my current work as a professor.",
      es: "Como su asistente de docencia, también vi el gran interés y esfuerzo que pone en diseñar experiencias de aprendizaje creativas. Estas experiencias motivaron a sus estudiantes a apropiarse de su proceso de aprendizaje y a involucrarse con compromiso, lo que se reflejó en su excelente desempeño académico. Puedo afirmar sin duda que el profesor Luis H. es uno de los mejores docentes que he tenido, e inspira a que dé lo mejor de mí en mi trabajo actual como profesor."
    },
    name: "Julian Daniel Torres Vanegas",
    graduateName: "Julian Daniel Torres Vanegas",
    info: { en: "Assistant Professor at Universidad EAN", es: "Profesor asistente en la Universidad EAN" },
    imageUrl: "/images/students/julian-daniel-torres-vanegas.jpg",
    context: { en: "Teaching Assistant", es: "Asistente de docencia" },
    category: 'Teaching & Mentorship'
  },
  {
    quote: {
      en: "I had the opportunity to work with Professor Luis H. Reyes in various academic settings: first as his student in the Unit Operations course and later as a graduate assistant. In each of these contexts, the professor distinguished himself by his creativity and the constant generation of valuable ideas, which enriched both learning and academic development.",
      es: "Tuve la oportunidad de trabajar con el profesor Luis H. Reyes en distintos escenarios académicos: primero como su estudiante en el curso de Operaciones Unitarias y luego como asistente graduada. En cada uno de estos contextos, el profesor se distinguió por su creatividad y por la generación constante de ideas valiosas, que enriquecieron tanto el aprendizaje como el desarrollo académico."
    },
    name: "Olga Lucía Acuña",
    graduateName: "Olga Lucía Acuña",
    info: { en: "Jr. Solutions Engineer at Arcaise LLC", es: "Ingeniera de soluciones júnior en Arcaise LLC" },
    imageUrl: "/images/students/olga-lucia-acuna.jpg",
    context: { en: "Course Student & Graduate Assistant", es: "Estudiante del curso y asistente graduada" },
    category: 'Teaching & Mentorship'
  },
  {
    quote: {
      en: "As my thesis advisor, one of the qualities I most highlight is the freedom he provides to explore different paths when difficulties arise. This openness fosters autonomy and critical thinking, while maintaining close and guiding support. Thanks to his guidance, I was able to strengthen my academic and professional capabilities and understand the importance of leadership that combines guidance with trust in the student.",
      es: "Como asesor de mi tesis, una de las cualidades que más destaco es la libertad que brinda para explorar distintos caminos cuando surgen dificultades. Esta apertura fomenta la autonomía y el pensamiento crítico, manteniendo a la vez un acompañamiento cercano y orientador. Gracias a su guía, pude fortalecer mis capacidades académicas y profesionales y comprender la importancia de un liderazgo que combina la orientación con la confianza en el estudiante."
    },
    name: "Olga Lucía Acuña",
    graduateName: "Olga Lucía Acuña",
    info: { en: "Jr. Solutions Engineer at Arcaise LLC", es: "Ingeniera de soluciones júnior en Arcaise LLC" },
    imageUrl: "/images/students/olga-lucia-acuna.jpg",
    context: { en: "M.S. Thesis Advisee", es: "Dirigida de tesis de maestría" },
    category: 'Research Advising'
  },
  {
    quote: {
      en: "What distinguishes Professor Reyes is not just his vast experience and ability to drive innovative research, but his exceptional human quality. He sees not just his students, but the people behind them. His warmth and support transcend academics, and that value is, for me, even more significant than any technical knowledge. He is always willing to listen, guide, and motivate, even in the most challenging moments. A large part of the professional I am today is due to his influence.",
      es: "Lo que distingue al profesor Reyes no es solo su vasta experiencia y su capacidad para impulsar investigación innovadora, sino su excepcional calidad humana. No ve únicamente a sus estudiantes, sino a las personas detrás de ellos. Su calidez y apoyo trascienden lo académico, y ese valor es, para mí, aún más significativo que cualquier conocimiento técnico. Siempre está dispuesto a escuchar, orientar y motivar, incluso en los momentos más difíciles. Gran parte de la profesional que soy hoy se debe a su influencia."
    },
    name: "Valentina Quezada",
    graduateName: "Valentina Quezada Pérez",
    info: { en: "Scientific Writer at Sanofi", es: "Redactora científica en Sanofi" },
    imageUrl: "/images/students/valentina-quezada-perez.jpg",
    context: { en: "Mentorship Experience", es: "Experiencia de mentoría" },
    category: 'Teaching & Mentorship'
  },
  {
    quote: {
      en: "Under his mentorship, I participated in a pioneering project on transmembrane peptides and later, as my M.S. thesis co-advisor, he guided my work on an antifungal hydrogel, which led to a patent submission. This experience taught me the importance of developing accessible, scalable methodologies. He conveys the conviction that science must transcend the laboratory to generate a real impact on society.",
      es: "Bajo su mentoría, participé en un proyecto pionero sobre péptidos transmembranales y, más tarde, como coasesor de mi tesis de maestría, guió mi trabajo sobre un hidrogel antifúngico, que derivó en la presentación de una patente. Esta experiencia me enseñó la importancia de desarrollar metodologías accesibles y escalables. Transmite la convicción de que la ciencia debe trascender el laboratorio para generar un impacto real en la sociedad."
    },
    name: "Valentina Quezada",
    graduateName: "Valentina Quezada Pérez",
    info: { en: "Scientific Writer at Sanofi", es: "Redactora científica en Sanofi" },
    imageUrl: "/images/students/valentina-quezada-perez.jpg",
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
    imageUrl: "/images/testimonials/img-5799.jpg",
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
    imageUrl: "/images/testimonials/img-5799.jpg",
    context: { en: "Undergraduate Thesis Advisee", es: "Dirigida de tesis de pregrado" },
    category: 'Research Advising'
  },
  {
    quote: {
      en: "Working with Professor Luis between 2019 and 2021 was a key stage in my academic and professional development. During that time, I had the opportunity to have his support as my master's thesis advisor and, at the same time, as my supervisor in my roles as a research assistant and teaching assistant for the Unit Operations course. His passion for science and research left a significant mark on me, especially as I began my journey in the world of bioprocesses and biotechnology. Experiencing this stage during the pandemic made his guidance even more valuable; his constant support gave me peace of mind amid the uncertainty and allowed my research project to have a significant impact during a complicated time. Thanks to his guidance, I was able to focus my knowledge in an area I am passionate about, which undoubtedly defined the course of my career.",
      es: "Trabajar con el profesor Luis entre 2019 y 2021 fue una etapa clave en mi desarrollo académico y profesional. Durante ese tiempo tuve la oportunidad de contar con su apoyo como asesor de mi tesis de maestría y, al mismo tiempo, como mi supervisor en mis roles de asistente de investigación y de docencia para el curso de Operaciones Unitarias. Su pasión por la ciencia y la investigación dejó en mí una huella significativa, especialmente al iniciar mi camino en el mundo de los bioprocesos y la biotecnología. Vivir esta etapa durante la pandemia hizo su orientación aún más valiosa; su apoyo constante me dio tranquilidad en medio de la incertidumbre y permitió que mi proyecto de investigación tuviera un impacto significativo en un momento complicado. Gracias a su guía, pude enfocar mi conocimiento en un área que me apasiona, lo que sin duda definió el rumbo de mi carrera."
    },
    name: "María Camila Henao",
    graduateName: "María Camila Henao",
    info: { en: "Scientist at VaxThera", es: "Científica en VaxThera" },
    imageUrl: "/images/students/maria-camila-henao.jpg",
    context: { en: "M.S. Thesis Advisee & Research/Teaching Assistant", es: "Dirigida de tesis de maestría y asistente de investigación/docencia" },
    category: 'Research Advising'
  },
  {
    quote: {
      en: "My professional relationship with Professor Luis gave me much more than technical knowledge; he instilled in me important values for my personal growth. With him, I learned to see mistakes as opportunities for improvement and to work with a greater awareness of my weaknesses. He always knew how to correct with respect and teach with enthusiasm, which created a positive and challenging learning environment. Today, four years after graduating, I am grateful for everything he gave me, not only as a teacher but also as a mentor. A large part of the professional I am today is due to his guidance, and I hope one day we can reconnect on future projects.\n\nFinally, I'd like to point out that one rarely has the chance to learn so much from someone as cool as Luis: his approachability and sense of humor made even the most demanding days in the lab much more bearable.",
      es: "Mi relación profesional con el profesor Luis me dio mucho más que conocimiento técnico; me inculcó valores importantes para mi crecimiento personal. Con él aprendí a ver los errores como oportunidades de mejora y a trabajar con una mayor conciencia de mis debilidades. Siempre supo corregir con respeto y enseñar con entusiasmo, lo que creó un ambiente de aprendizaje positivo y retador. Hoy, cuatro años después de graduarme, agradezco todo lo que me dio, no solo como docente sino también como mentor. Gran parte de la profesional que soy hoy se debe a su guía, y espero que algún día podamos reencontrarnos en proyectos futuros.\n\nPor último, quisiera señalar que pocas veces se tiene la oportunidad de aprender tanto de alguien tan genial como Luis: su cercanía y sentido del humor hicieron mucho más llevaderos incluso los días más exigentes en el laboratorio."
    },
    name: "María Camila Henao",
    graduateName: "María Camila Henao",
    info: { en: "Scientist at VaxThera", es: "Científica en VaxThera" },
    imageUrl: "/images/students/maria-camila-henao.jpg",
    context: { en: "General Mentorship", es: "Mentoría general" },
    category: 'Teaching & Mentorship'
  },
  {
    quote: {
      en: "I met Professor Luis H. in the Augmented Artificial Intelligence initiative at Universidad de los Andes, where he was the lead professor and I joined first as a student assistant and then as a graduate research assistant. Although we come from different branches of engineering, from the start I was impressed by his ability to bring his experience to emerging topics such as generative artificial intelligence. Luis constantly expands his own knowledge and, at the same time, opens the space and offers the tools for his colleagues and students to challenge themselves. Working alongside him meant contributing to valuable research and projects and, above all, a kind of learning I would hardly have found any other way.\n\nToday, as Lead of the Artificial Intelligence Node at Uniandes Continuing Education, we count on Professor Luis as a key ally and consultant in the projects we develop. His commitment to the learning of those who work with him is still a reference for me. I thank him for his dedication to his students and for the way he promotes, by example, research and lifelong learning.",
      es: "Conocí al profesor Luis H. en la iniciativa de Inteligencia Artificial Aumentada de la Universidad de los Andes, donde él se desempeñaba como profesor líder y yo me vinculé primero como monitor y luego como asistente graduado de investigación. Aunque venimos de ramas distintas de la ingeniería, desde el inicio me impresionó su capacidad para llevar su experiencia a temas emergentes como la inteligencia artificial generativa. Luis amplía constantemente su propio conocimiento y, al mismo tiempo, abre el espacio y ofrece las herramientas para que sus colegas y estudiantes se reten. Trabajar a su lado significó contribuir a investigaciones y proyectos de valor y, sobre todo, vivir un aprendizaje que difícilmente habría encontrado de otra forma.\n\nHoy, desde mi rol como Líder del Nodo de Inteligencia Artificial de Educación Continua Uniandes, contamos con el profesor Luis como un aliado y consultor fundamental en los proyectos que desarrollamos. Su compromiso con el aprendizaje de quienes trabajan con él sigue siendo un referente para mí. Le agradezco su dedicación a sus estudiantes y su manera de promover, con el ejemplo, la investigación y el aprendizaje continuo."
    },
    name: "Andrés Guerrero",
    info: { en: "Lead of the Artificial Intelligence Node, Continuing Education, Universidad de los Andes", es: "Líder del Nodo de Inteligencia Artificial de la Dirección de Educación Continua, Universidad de los Andes" },
    context: { en: "Systems and Computing Engineering student; student assistant and graduate research assistant, Augmented Intelligence", es: "Estudiante de Ingeniería de Sistemas y Computación; monitor y asistente graduado de investigación, Inteligencia Aumentada" },
    category: 'Teaching & Mentorship'
  },
  {
    quote: {
      en: "In my humble opinion, Luis H. is the definition of the word vocation. It is inspiring to see someone who is not afraid to become friends with young talents, with different talents and with different ideas.\n\nSince I have known him, he has always sought to improve: to improve his classes, the projects he works on and his surroundings. Around him there is a constant atmosphere of growth and learning. He helps anyone who wants to bring about positive change, and he has no trouble making room in his schedule to guide those processes.\n\nI have no problem saying that Luis is the person who has placed the most trust in me throughout my academic career. I owe him many of the opportunities I have had to push myself and explore new knowledge. He is a great inspiration to me.",
      es: "A mi humilde parecer, Luis H es la definición de la palabra vocación. Es inspirador ver a alguien que no tiene miedo en volverse amigo de los talentos jóvenes, de los talentos diferentes y de las ideas diferentes.\n\nDesde que lo conozco, siempre ha buscado mejorar. Mejorar sus clases, mejorar los proyectos en los que trabaja, mejorar su entorno. A su alrededor se crea un ambiente constante de evolución y aprendizaje. Ayuda a todo el que quiera generar un cambio positivo, y no le cuesta abrir un espacio en su agenda para guiar esos procesos.\n\nNo tengo ningún problema en decir que Luis es la persona que más confianza ha depositado en mí a lo largo de mi carrera académica. Le debo muchas de las oportunidades que he tenido para superarme y explorar nuevos conocimientos. Es una gran inspiración para mí."
    },
    name: "David Santiago Ramos",
    info: { en: "Chemical engineer and systems and computing engineer; works at the Master's in Information Engineering (MINE), Universidad de los Andes", es: "Ingeniero químico e ingeniero de sistemas y computación; trabaja en la Maestría en Ingeniería de la Información (MINE), Universidad de los Andes" },
    context: { en: "Undergraduate professional development project, Chemical Engineering, and the Augmented Intelligence team", es: "Proyecto de desarrollo profesional de pregrado, Ingeniería Química, y equipo de Inteligencia Aumentada" },
    category: 'Research Advising'
  }
];

// ── Los cursos que creé o rediseñé, agrupados por lo que enseñan ────────────

export type CourseTheme = 'process' | 'bio' | 'general' | 'ai';

export interface CourseRecord {
  id: string;
  theme: CourseTheme;
  title: Localized;
  /** Los códigos con que se ha dictado, en orden. Con ellos se cuentan sus secciones en teachingData. */
  codes: string[];
  /** Semestre en que lo creé o lo rediseñé. */
  since: string;
  action: 'created' | 'redesigned';
  /** Con quién lo creé o lo rediseñé. */
  partners?: string[];
  /** Qué tiene el curso y qué cambió en él. Párrafos separados por una línea en blanco. */
  text: Localized;
}

/** Diez creados y cinco rediseñados, con el semestre en que lo hice y con quién. */
export const courseCatalog: CourseRecord[] = [
  // Procesos y proyectos
  {
    id: 'ou', theme: 'process', title: COURSE.ou, codes: ['IQUI-3010'], since: '2017-20', action: 'redesigned',
    text: {
      en: 'I redesigned it from 2017 with Nicolás Ríos Ratkovich and the support of the Center for Innovation in Technology and Education (Conecta-TE): a flipped classroom with an e-book of seven modules and a joint project with Modeling and Simulation. In 2020-10 I built its version 2.0, a project-oriented, problem-based course.',
      es: 'Lo rediseñé desde 2017 con Nicolás Ríos Ratkovich y el acompañamiento del Centro de Innovación en Tecnología y Educación (Conecta-TE): un aula invertida con un libro electrónico de siete módulos y un proyecto conjunto con Modelamiento y Simulación. En 2020-10 armé su versión 2.0, un curso orientado a proyectos y basado en problemas.',
    },
  },
  {
    id: 'challenge', theme: 'process', title: COURSE.challenge, codes: ['IQUI-3350', 'IQYA-3601'], since: '2019-10', action: 'created', partners: ['Diego Pradilla'],
    text: {
      en: 'Student teams solve a real problem for a company, tied to a Sustainable Development Goal, with one advisor from the university and one from the company, and defend their solution before a jury. As in every course of our department that has a project, they work with Integrated Product and Process Design (DIPP, from its Spanish name), the design philosophy of the Department of Chemical and Food Engineering. Each semester is a different edition, and we studied the course in the 2020 article.',
      es: 'Equipos de estudiantes resuelven un problema real de una empresa, ligado a un Objetivo de Desarrollo Sostenible, con un asesor de la universidad y otro de la empresa, y defienden su solución ante un jurado. Como en todo curso de nuestro departamento que tiene un proyecto, trabajan con el Diseño Integrado de Productos y Procesos (DIPP), la filosofía de diseño del Departamento de Ingeniería Química y de Alimentos. Cada semestre es una edición distinta, y estudiamos el curso en el artículo de 2020.',
    },
  },
  {
    id: 'pmdi', theme: 'process', title: COURSE.pmdi, codes: ['IING-3000'], since: '2020-20', action: 'redesigned', partners: ['Óscar Álvarez', 'Diego Pradilla'],
    text: {
      en: 'A School of Engineering course that Juan Carlos Briceño and Carola Hernández created in 2017. In 2020-20 I coordinated it with Óscar Álvarez. It ran online because of the pandemic, in three phases (opportunity, creativity and innovation), and the teams presented their solutions to companies.',
      es: 'Un curso de la Facultad de Ingeniería que habían creado en 2017 Juan Carlos Briceño y Carola Hernández. En 2020-20 lo coordiné con Óscar Álvarez. Fue virtual, por la pandemia, en tres fases (oportunidad, creatividad e innovación), y los equipos presentaban sus soluciones ante empresas.',
    },
  },
  {
    id: 'pi2', theme: 'process', title: COURSE.pi2, codes: ['IQUI-2032', 'IQYA-2032'], since: '2021-20', action: 'created',
    text: {
      en: 'It came with the School’s curriculum reform: unit operations taught through projects, with up to 86 students per group. Its story is told on the Unit Operations page.',
      es: 'Llegó con la reforma curricular de la Facultad: las operaciones unitarias por proyectos, con hasta 86 estudiantes por grupo. Su historia está en la página de Operaciones Unitarias.',
    },
  },
  {
    id: 'spdp', theme: 'process', title: COURSE.spdp, codes: ['IQUI-3094', 'IALI-3094', 'IQYA-3050'], since: '2022-10', action: 'created', partners: ['Diego Pradilla'],
    text: {
      en: 'Alicia Porras helped us, and since 2024-20 I teach it alone. It is a one-credit course in which each student, with a mentor, turns an innovation challenge or a research question into the proposal for their professional development project. The deep work happens with the mentors; I organize the deliverables and teach the sessions on design tools, artificial intelligence, ethics and visual narratives.\n\nFrom the first semester the proposal goes through the School’s ethics committee, and over the semesters the value proposition, the flowchart, the mentor’s signature on each deliverable, the Research Ethics certificate and the AI Assessment Scale (AIAS) were added. It had 11 students in 2023-10 and has 31 in 2026-20. Its semesters as IQYA-3050 have no evaluation on record: the system requires a minimum number of responses.',
      es: 'Nos ayudó Alicia Porras, y desde 2024-20 lo dicto solo. Es un curso de un crédito en el que cada estudiante, con su mentor, convierte un reto de innovación o una pregunta de investigación en la propuesta de su proyecto de desarrollo profesional. El trabajo de fondo lo hacen con sus mentores; yo organizo las entregas y dicto las sesiones de herramientas de diseño, de inteligencia artificial, de ética y de narrativas visuales.\n\nDesde el primer semestre la propuesta pasa por el comité de ética de la Facultad, y con los semestres se sumaron la propuesta de valor, el flujograma, la firma del mentor en cada entrega, el certificado de Ética de la Investigación y la escala de evaluación de la IA (AI Assessment Scale, AIAS). En 2023-10 tuvo 11 estudiantes, y en 2026-20 tiene 31. Sus semestres como IQYA-3050 no tienen evaluación en el registro: el sistema exige un mínimo de respuestas.',
    },
  },
  {
    id: 'chemfood', theme: 'process', title: COURSE.chemfood, codes: ['IQYA-3602'], since: '2023-20', action: 'created', partners: ['Óscar Álvarez'],
    text: {
      en: 'We created it after the Belcorp edition of the Chemical Engineering Challenge. Its Chr. Hansen Edition had two guided challenges, “Mi primer queso” (my first cheese) and “El yogurt”, and two dairy product challenges, with sessions taught by Chr. Hansen Colombia S.A.S. It ran one semester, with 24 students.',
      es: 'Lo creamos después de la edición Belcorp del Chemical Engineering Challenge. Su Chr. Hansen Edition tuvo dos retos guiados, «Mi primer queso» y «El yogurt», y dos desafíos de productos lácteos, con sesiones dictadas por Chr. Hansen Colombia S.A.S. Se dictó un semestre, con 24 estudiantes.',
    },
  },
  {
    id: 'pou', theme: 'process', title: COURSE.pou, codes: ['IQYA-2031'], since: '2024-10', action: 'created',
    text: {
      en: 'The course took this name and this code in 2024-10, and in 2025-20 I changed it from the ground up: a flipped classroom and a plant that the teams design across seven modules. For this course I received the 2026 award for innovation in chemical engineering education of the American Institute of Chemical Engineers (AIChE).',
      es: 'El curso tomó este nombre y este código en 2024-10, y en 2025-20 lo volví a cambiar a fondo: un aula invertida y una planta que los equipos diseñan a lo largo de siete módulos. Por este curso recibí en 2026 el premio a la innovación en la educación en ingeniería química del American Institute of Chemical Engineers (AIChE).',
    },
  },
  // Biotecnología y bioprocesos
  {
    id: 'beer', theme: 'bio', title: COURSE.beer, codes: ['IQUI-3518', 'IALI-3101'], since: '2018-20', action: 'created',
    text: {
      en: 'Since 2021 it has also run as IALI-3101, for Food Engineering. From the first version, industry and alumni were in the classroom: Bavaria replicated the beers of the second project and the final was a sensory panel at Bar Corona; Julián Becerra, co-founder of Cervecería Moonshine S.A.S. (Moonshine), and Camilo Rojas, of Chelarte S.A.S. (Chelarte), both chemical engineering graduates, gave talks, and the first project was to replicate Chelarte’s Cerveza Raquel. Each team designs a beer, with its brand, its formulation and its process, following DIPP, and presents it to a jury.\n\nIn 2021 I made it an eight-week course graded only on the project, with two iterations of the home-brewed beer and a presentation by roles, and in 2022-10 it had 59 students and six breweries on the schedule.',
      es: 'Desde 2021 se dicta también como IALI-3101, para Ingeniería de Alimentos. Desde la primera versión la industria y los egresados estuvieron en el aula: Bavaria replicaba las cervezas del segundo proyecto y la final fue un panel sensorial en el Bar Corona; Julián Becerra, cofundador de Cervecería Moonshine S.A.S. (Moonshine), y Camilo Rojas, de Chelarte S.A.S. (Chelarte), los dos egresados de Ingeniería Química, daban charlas, y el primer proyecto era replicar la Cerveza Raquel de Chelarte. Cada equipo idea una cerveza, con su marca, su formulación y su proceso, siguiendo el DIPP, y la presenta ante un jurado.\n\nEn 2021 lo pasé a ocho semanas, calificado solo por el proyecto, con dos iteraciones de la cerveza hecha en casa y una presentación por roles, y en 2022-10 tuvo 59 estudiantes y seis cervecerías en el cronograma.',
    },
  },
  {
    id: 'biotec', theme: 'bio', title: COURSE.biotec, codes: ['IQUI-4230', 'IQYA-4100'], since: '2019-10', action: 'created',
    text: {
      en: 'A master’s elective. The first version had exams, case studies, article summaries and a bioethics session. The second, in 2020-10, brought debates on ethical dilemmas and a home laboratory in which students built their own fermenter with bottles, hoses and a drill. In 2023-20 I taught it with the Department of Biological Sciences, under a double code (CBIO-4339) and with María Francisca Villegas, around recombinant proteins. In 2025-10 a review article written in English came in, and in 2026-10 generative artificial intelligence, with a workshop and its use to structure that article.',
      es: 'Es una electiva de maestría. La primera versión tenía parciales, casos de estudio, resúmenes de artículos y una sesión de bioética. En la segunda, en 2020-10, entraron los debates sobre dilemas éticos y un laboratorio casero, en el que los estudiantes construían su propio fermentador con botellas, mangueras y un taladro. En 2023-20 lo dicté con el Departamento de Ciencias Biológicas, con doble código (CBIO-4339) y con María Francisca Villegas, alrededor de las proteínas recombinantes. En 2025-10 entró un artículo de revisión escrito en inglés, y en 2026-10 la inteligencia artificial generativa, con un taller y su uso para estructurar ese artículo.',
    },
  },
  {
    id: 'dpro', theme: 'bio', title: COURSE.dpro, codes: ['DPRO-4300'], since: '2019-10', action: 'redesigned',
    text: {
      en: 'A required course of the Master’s in Product and Process Design, taught intensively: eight weeks in three blocks of Thursdays and Fridays. Until 2022 it was an in silico molecular project: each team improved an enzyme, wrote in Authorea and ran virtual labs in Labster, and in 2022-10 presented its value proposition on a poster and a paper prototype. That semester I taught it online. I could not be at the university for personal reasons, and the Department was considering offering the master’s online, so we took it as a trial. The students did not like it.\n\nSince 2023 I have given more weight to theoretical understanding, with a short exam at the end of each day and topics of ethics, sustainability and regulation, and since 2024-10 I teach it with Andrés Fernando González Barrios. In 2026-10 we redesigned it by scales (molecule, cell, bioprocess, techno-economics and scale-up), with tools such as AlphaFold 3, Boltz-2, GROMACS and COBRApy, and with the course’s first policy on the use of AI.',
      es: 'Es un curso obligatorio de la Maestría en Diseño de Productos y Procesos, intensivo: ocho semanas en tres bloques de jueves y viernes. Hasta 2022 fue un proyecto molecular in silico: cada equipo mejoraba una enzima, escribía en Authorea y hacía laboratorios virtuales en Labster, y en 2022-10 presentaba su propuesta de valor en un póster y en un prototipo de papel. Ese semestre lo dicté con clases virtuales. Yo no podía estar en la universidad por razones personales, y el Departamento estaba considerando ofrecer la maestría de manera virtual, así que lo tomamos como un ensayo. A los estudiantes no les gustó.\n\nDesde 2023 le di más peso a la comprensión teórica, con un examen corto al final de cada día y con temas de ética, sostenibilidad y regulación, y desde 2024-10 lo dicto con Andrés Fernando González Barrios. En 2026-10 lo rediseñamos por escalas (molécula, célula, bioproceso, tecnoeconomía y escalamiento), con herramientas como AlphaFold 3, Boltz-2, GROMACS y COBRApy, y con la primera política de uso de IA del curso.',
    },
  },
  {
    id: 'fdb', theme: 'bio', title: COURSE.fdb, codes: ['IQUI-3520'], since: '2020-20', action: 'created',
    text: {
      en: 'The undergraduate version of the Systemic Design project, entirely in silico because of the pandemic, with creativity sessions, a value proposition, guests and an expert panel. I taught it one semester, to 27 students.',
      es: 'La versión de pregrado del proyecto de Diseño Sistémico, todo in silico por la pandemia, con sesiones de creatividad, una propuesta de valor, invitados y un panel de expertos. Lo dicté un semestre, a 27 estudiantes.',
    },
  },
  {
    id: 'micro', theme: 'bio', title: COURSE.micro, codes: ['IQYA-3012'], since: '2024-10', action: 'redesigned',
    text: {
      en: 'What was new were the MicroBlogs Alimentarios, four opinion columns across the semester; the first, “Voces de la MicroCocina”, asks students to explore how microorganisms have shaped Colombian cuisine.',
      es: 'Lo nuevo fueron los MicroBlogs Alimentarios, cuatro columnas de opinión a lo largo del semestre; la primera, «Voces de la MicroCocina», pide explorar cómo los microorganismos han moldeado la gastronomía colombiana.',
    },
  },
  // Formación general
  {
    id: 'dexp', theme: 'general', title: COURSE.dexp, codes: ['IQUI-2200'], since: '2017-20', action: 'redesigned',
    text: {
      en: 'I redesigned it when I arrived, in 2017, and taught it two semesters to 108 students. It had experiments at home, a project each student chose and a session on bias in research.',
      es: 'Lo rediseñé al llegar, en 2017, y lo dicté dos semestres a 108 estudiantes. Tenía experimentos en casa, un proyecto que escogía cada estudiante y una sesión sobre los sesgos en la investigación.',
    },
  },
  {
    id: 'pandora', theme: 'general', title: COURSE.pandora, codes: ['CBP-C1320'], since: '2021-20', action: 'created', partners: ['Juan Carlos Cruz'],
    text: {
      en: 'A course of the Ciclo Básico Uniandino, the university’s core curriculum, in its Scientific Thinking area, open to students of every major. It starts from Pandora’s Lab, Paul A. Offit’s book on the times when science done badly or misunderstood had terrible consequences, and it borrows the book’s name with his permission. The course works on critical thinking through those cases, so that students think about the social, health and ethical problems that technologies such as artificial intelligence, gene editing, stem cells or transhumanism can bring. Each semester has conversations, debates and seven sessions with guests, and since 2025-20 artificial intelligence is one of the course’s cases. In five semesters it has taken 168 students.',
      es: 'Es un curso del Ciclo Básico Uniandino, en el área de Pensamiento Científico, abierto a estudiantes de todas las carreras. Parte de Pandora’s Lab, el libro de Paul A. Offit sobre las veces en que una ciencia mal hecha o mal entendida tuvo consecuencias terribles, y lleva su nombre con la autorización del autor. El curso trabaja el pensamiento crítico a partir de esos casos, para que los estudiantes piensen en los problemas sociales, de salud y éticos que pueden traer tecnologías como la inteligencia artificial, la edición genética, las células madre o el transhumanismo. Cada semestre hay conversatorios, debates y siete sesiones con invitados, y desde 2025-20 la inteligencia artificial es uno de los casos del curso. En cinco semestres ha recibido a 168 estudiantes.',
    },
  },
  // Inteligencia artificial
  {
    id: 'mgi', theme: 'ai', title: COURSE.mgi, codes: ['MGI-4307'], since: '2025-20', action: 'created', partners: ['Juan Carlos Cruz'],
    text: {
      en: 'An online elective of the Master’s in Engineering Management: eight weeks, with one live session a week, that uses content from our open course on Coursera, Fundamentos del uso de IA Generativa. It has had two cohorts, of 45 students in 2025-20 and 49 in 2026-20, and it has no evaluation on record.',
      es: 'Una electiva virtual de la Maestría en Gerencia de la Ingeniería: ocho semanas, con una sesión en vivo por semana, que usa contenido de nuestro curso abierto en Coursera, Fundamentos del uso de IA Generativa. Lleva dos cohortes, de 45 estudiantes en 2025-20 y de 49 en 2026-20, y no tiene evaluación en el registro.',
    },
  },
];

/** Las ediciones del Chemical Engineering Challenge, con las razones sociales de las empresas. */
export const challengeEditions: { term: string; with: Localized; challenges: Localized }[] = [
  {
    term: '2019-10',
    with: { en: 'With Diego Pradilla', es: 'Con Diego Pradilla' },
    challenges: {
      en: 'Cocoa pulp and juice with Sucesores de José Jesús Restrepo & Cía. S.A. (Casa Luker), yeasts with Bavaria & Cía. S. C. A. (Bavaria), a cosmetic formulation with a contract manufacturer, and whey',
      es: 'Pulpa y jugo de cacao con Sucesores de José Jesús Restrepo & Cía. S.A. (Casa Luker), levaduras con Bavaria & Cía. S. C. A. (Bavaria), una formulación cosmética con una maquiladora y el suero lácteo',
    },
  },
  {
    term: '2020-10',
    with: { en: 'With Diego Pradilla', es: 'Con Diego Pradilla' },
    challenges: {
      en: 'Protein in milk with Productos Naturales de la Sabana S.A.S. BIC (Alquería), an adhesive made from Bavaria’s trub, and surfactants with Loraine Cosmetics',
      es: 'Proteína en leche con Productos Naturales de la Sabana S.A.S. BIC (Alquería), un pegante hecho con el trub de Bavaria y surfactantes con Loraine Cosmetics',
    },
  },
  {
    term: '2021-10',
    with: { en: 'With Óscar Álvarez', es: 'Con Óscar Álvarez' },
    challenges: { en: 'Belcorp Edition, with Bel Star S.A. (Belcorp)', es: 'Belcorp Edition, con Bel Star S.A. (Belcorp)' },
  },
  {
    term: '2023-10',
    with: { en: 'On my own, in English', es: 'Solo, en inglés' },
    challenges: { en: 'Brewing edition, with craft breweries', es: 'Brewing edition, con cervecerías artesanales' },
  },
];

/**
 * Biotecnología Industrial: estudiantes de posgrado y de pregrado en cada grupo, según la
 * lista de cada semestre. En 2023-20 cuenta los dos códigos del curso, IQYA-4100 y
 * CBIO-4339; por eso la página muestra la proporción y no reemplaza los inscritos de
 * teachingData, que son los de la sección IQYA-4100.
 */
export const biotechCohorts: { term: string; graduate: number; undergraduate: number; evaluation: number; bothCodes?: boolean }[] = [
  { term: '2021-20', graduate: 7, undergraduate: 7, evaluation: 160 },
  { term: '2022-20', graduate: 9, undergraduate: 16, evaluation: 152 },
  { term: '2023-20', graduate: 11, undergraduate: 23, evaluation: 141, bothCodes: true },
  { term: '2025-10', graduate: 5, undergraduate: 2, evaluation: 158 },
  { term: '2026-10', graduate: 4, undergraduate: 10, evaluation: 137 },
];

/**
 * Mi puntaje global de evaluación docente por semestre. Son lecturas de las gráficas del
 * sistema de evaluación, que no muestra los números, y pueden variar en un punto.
 * 2020-10 no tuvo evaluación, por la pandemia.
 */
export const globalEvaluation: { term: string; score: number | null }[] = [
  { term: '2017-20', score: 157 }, { term: '2018-10', score: 155 }, { term: '2018-20', score: 157 },
  { term: '2019-10', score: 157 }, { term: '2019-20', score: 157 }, { term: '2020-10', score: null },
  { term: '2020-20', score: 153 }, { term: '2021-10', score: 157 }, { term: '2021-20', score: 152 },
  { term: '2022-10', score: 147 }, { term: '2022-20', score: 148 }, { term: '2023-10', score: 151 },
  { term: '2023-20', score: 150 }, { term: '2024-10', score: 152 }, { term: '2024-20', score: 153 },
  { term: '2025-10', score: 157 }, { term: '2025-20', score: 156 }, { term: '2026-10', score: 146 },
];

/** Lo que pasó en los semestres en que la evaluación de un curso bajó, y qué hice con eso. */
export const evaluationLessons: { terms: Localized; course: Localized; scores: string; happened: Localized; did: Localized }[] = [
  {
    terms: { en: '2021-20 and 2022-10', es: '2021-20 y 2022-10' },
    course: COURSE.pi2,
    scores: '141 · 143',
    happened: {
      en: 'With the reform the course became project-based, with up to 86 students per group and no assessed theory. The theory came in training sessions that not every team member took, and the students asked for more guidance.',
      es: 'Con la reforma, el curso pasó a ser por proyectos, con hasta 86 estudiantes por grupo y sin teoría evaluada. La teoría llegaba en capacitaciones que no tomaba todo el equipo, y los estudiantes pedían más guía.',
    },
    did: {
      en: 'A project course also needs guided theory. From 2022-20 I gave it back: first weekly videos with quizzes, and in 2023-20 assessed workshops and guided labs.',
      es: 'Un curso por proyectos también necesita teoría guiada. Desde 2022-20 se la fui devolviendo: primero videos semanales con quices, y en 2023-20 talleres evaluados y laboratorios guiados.',
    },
  },
  {
    terms: { en: '2022-20', es: '2022-20' },
    course: COURSE.pi2,
    scores: '135',
    happened: {
      en: 'It was the first semester of that adjustment, and the new design was still settling.',
      es: 'Fue el primer semestre de ese ajuste, y el diseño nuevo todavía se estaba acomodando.',
    },
    did: {
      en: 'I kept adjusting it, and the evaluation rose to 143, 152, 149, 149, 156 and 155.',
      es: 'Lo seguí ajustando, y la evaluación subió a 143, 152, 149, 149, 156 y 155.',
    },
  },
  {
    terms: { en: '2022-10', es: '2022-10' },
    course: COURSE.dpro,
    scores: '140',
    happened: {
      en: 'I taught it with online classes, as a trial.',
      es: 'Lo dicté con clases virtuales, como un ensayo.',
    },
    did: {
      en: 'I went back to the classroom and gave more weight to theory: 153, 155 and 155.',
      es: 'Volví a la presencialidad y le di más peso a la teoría: 153, 155 y 155.',
    },
  },
  {
    terms: { en: '2022-10', es: '2022-10' },
    course: { en: 'Professional Development Project Seminar, Food Engineering section', es: 'Seminario de Proyecto de Desarrollo Profesional, sección de Ingeniería de Alimentos' },
    scores: '141',
    happened: {
      en: 'Five students, in the first semester of the course. The Chemical Engineering section scored 155.',
      es: 'Cinco estudiantes, en el primer semestre del curso. La sección de Ingeniería Química sacó 155.',
    },
    did: {
      en: 'With five responses the figure says little on its own, and I kept the course as it was.',
      es: 'Con cinco respuestas la cifra dice poco por sí sola, y dejé el curso como estaba.',
    },
  },
  {
    terms: { en: '2023-20 and 2026-10', es: '2023-20 y 2026-10' },
    course: COURSE.biotec,
    scores: '141 · 137',
    happened: {
      en: 'About two in three students were undergraduates, in a master’s elective, and in those two semesters the course also had three exams.',
      es: 'Cerca de dos de cada tres estudiantes eran de pregrado, en una electiva de maestría, y en esos dos semestres el curso tuvo además tres parciales.',
    },
    did: {
      en: 'I keep it as a master’s course, and I teach it again in 2027-10.',
      es: 'Lo mantengo como curso de maestría y lo vuelvo a dictar en 2027-10.',
    },
  },
];
