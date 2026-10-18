import type { Localized } from '../../context/i18n';
import type { Product } from '../../types';

/**
 * La investigación sobre mi propia docencia: los cuatro artículos, con el diseño de cada
 * estudio, la revisión crítica y las cifras del estudio de 2025.
 *
 * Las páginas leen las cifras de aquí y no las repiten en su texto, para que un estudio
 * nuevo se registre una sola vez. Las demás publicaciones y las ponencias salen de
 * public/data/products.json (área «Scholarship of Teaching & Learning»).
 */

export interface EducationPaper {
  /** Forma corta, para citar dentro del texto. */
  authors: string;
  /** Lista completa de autores, para la bibliografía. */
  authorsFull: string;
  year: number;
  title: string;
  journal: string;
  /** Volumen y páginas, p. ej. "51, 64-78". */
  locator: string;
  doi: string;
  /** El curso que estudia: los de Operaciones Unitarias van también en su página. */
  course: 'unitops' | 'challenge';
  /** El diseño del estudio, en pocas palabras. */
  design: Localized;
  /** Qué se hizo y qué encontró. */
  summary: Localized;
}

export const educationPapers: EducationPaper[] = [
  {
    authors: 'Ballesteros et al.',
    authorsFull: 'Ballesteros, M.A., Daza, M.A., Valdés, J.P., Ratkovich, N., & Reyes, L.H.',
    year: 2019,
    title:
      'Applying PBL methodologies to the chemical engineering courses: Unit operations and modeling and simulation, using a joint course project',
    journal: 'Education for Chemical Engineers',
    locator: '27, 35-42',
    doi: '10.1016/j.ece.2019.01.005',
    course: 'unitops',
    design: { en: 'A survey after the project', es: 'Una encuesta tras el proyecto' },
    summary: {
      en: 'Project-based learning in Unit Operations and Modeling and Simulation, analyzed with Legitimation Code Theory, which tells how tightly a concept is tied to its context of application. The centrifugal pump project was assessed with a survey at the end of both courses.',
      es: 'El aprendizaje basado en proyectos en Operaciones Unitarias y Modelamiento y Simulación, analizado con la teoría de los códigos de legitimación, que distingue cuán ligado está un concepto a su contexto de aplicación. El proyecto de la bomba centrífuga se evaluó con una encuesta al terminar los cursos.',
    },
  },
  {
    authors: 'Reedy et al.',
    authorsFull: 'Reedy, A.K., Guerrero Farías, M.L., Reyes, L.H., & Pradilla, D.',
    year: 2020,
    title:
      'Improving employability skills through non-placement work-integrated learning in chemical and food engineering: A case study',
    journal: 'Education for Chemical Engineers',
    locator: '33, 91-101',
    doi: '10.1016/j.ece.2020.09.002',
    course: 'challenge',
    design: { en: 'A qualitative study with separate voices', es: 'Un estudio cualitativo con voces separadas' },
    summary: {
      en: 'The Chemical Engineering Challenge. The study analyzed data from students, professors and companies, and the student focus groups were led by Alison Reedy and María Lucía Guerrero, who did not teach the course. Five themes came out of the analysis: the model worked to build creativity and teamwork, and the article points out what to adjust.',
      es: 'El Chemical Engineering Challenge. Se analizaron datos de estudiantes, profesores y empresas, y los grupos focales con estudiantes los condujeron Alison Reedy y María Lucía Guerrero, que no dictaban el curso. Del análisis salieron cinco temas: el modelo funcionó para formar creatividad y trabajo en equipo, y el artículo señala qué ajustar.',
    },
  },
  {
    authors: 'Ballesteros et al.',
    authorsFull: 'Ballesteros, M.Á., Sánchez, J.S., Ratkovich, N., Cruz, J.C., & Reyes, L.H.',
    year: 2021,
    title:
      'Modernizing the chemical engineering curriculum via a student-centered framework that promotes technical, professional, and technology expertise skills: The case of unit operations',
    journal: 'Education for Chemical Engineers',
    locator: '35, 8-21',
    doi: '10.1016/j.ece.2020.12.004',
    course: 'unitops',
    design: { en: 'Formative and summative evaluation over four semesters', es: 'Evaluación formativa y sumativa durante cuatro semestres' },
    summary: {
      en: 'The redesign of Unit Operations, followed through each of its stages: an interview with the professor, an entry profile, focus groups and two Likert-scale surveys per semester, with two-way analysis of variance. Co-author from Conecta-TE: Juan Sebastián Sánchez.',
      es: 'El rediseño de Operaciones Unitarias, seguido en cada una de sus etapas: entrevista al profesor, perfil de entrada, grupos focales y dos encuestas en escala Likert por semestre, con análisis de varianza de dos vías. Coautor de Conecta-TE: Juan Sebastián Sánchez.',
    },
  },
  {
    authors: 'Acuña et al.',
    authorsFull:
      'Acuña, O.L., Santos Carvajal, D.M., Bolaños-Barbosa, A.D., Torres-Vanegas, J.D., Alvarez Solano, O.A., Cruz, J.C., & Reyes, L.H.',
    year: 2025,
    title:
      'Fostering technical proficiency and professional skills: A multifaceted PO-PBL strategy for unit operations education',
    journal: 'Education for Chemical Engineers',
    locator: '51, 64-78',
    doi: '10.1016/j.ece.2025.01.001',
    course: 'unitops',
    design: { en: 'Mixed methods and a comparison across cohorts', es: 'Métodos mixtos y una comparación entre cohortes' },
    summary: {
      en: 'Four semesters of the course, from 2022-20 to 2024-10, three as Integrated Project 2 and the last as the Unit Operations Project: Likert-scale surveys with open questions, performance metrics, analysis of variance and Tukey tests for communication, and t tests to compare literature reviews written without AI and with AI governed by the AIAS.',
      es: 'Cuatro semestres del curso, entre 2022-20 y 2024-10, tres como Proyecto Integrado 2 y el último como Proyecto de Operaciones Unitarias: encuestas en escala Likert con preguntas abiertas, métricas de desempeño, análisis de varianza y pruebas de Tukey para la comunicación, y pruebas t para comparar las revisiones de literatura hechas sin IA y con IA reglada por la escala AIAS.',
    },
  },
];

/** La revisión crítica, en revisión final. Sin cifras del manuscrito: todavía no es público. */
export const criticalReview = {
  year: 2026,
  coauthor: 'Juan Carlos Cruz',
  journal: 'Education for Chemical Engineers',
  design: { en: 'A critical review', es: 'Una revisión crítica' } as Localized,
  summary: {
    en: '“First, do no harm”: what the evidence says about generative AI in chemical engineering education. Written with Juan Carlos Cruz.',
    es: '«Primero no hacer daño»: qué dice la evidencia sobre la IA generativa en la educación en ingeniería química. Escrita con Juan Carlos Cruz.',
  } as Localized,
  status: { en: 'in final review', es: 'en revisión final' } as Localized,
};

/**
 * El estudio de 2025 de Proyecto de Operaciones Unitarias. Cada cifra que las páginas
 * citan sobre el aprendizaje de los estudiantes sale de este objeto (verificadas contra el
 * artículo: cohortes de 38, 32, 18 y 24 estudiantes).
 */
export const pouLongitudinalStudy = {
  paper: educationPapers[3],
  students: 112,
  cohorts: 4,

  /** Comunicación escrita entre semestres: ANOVA de una vía, F = 7,503, p = 0,00014. */
  writtenCommunication: { test: 'one-way ANOVA', f: 7.5, pBelow: 0.001 },
  /** Un evaluador independiente volvió a calificar con la misma rúbrica documentos de distintos semestres. */
  independentEvaluator: { pLow: 0.005, pHigh: 0.014 },

  /** Estudiantes que reportaron motivación constante durante el semestre, modelo actual frente al anterior. */
  sustainedMotivation: { now: 94, before: 67 },

  /** Revisiones de literatura con IA reglada por la AIAS frente a las de los semestres sin IA. */
  references: { before: 8, after: 20, p: 0.045 },
  highImpactSources: { before: 3, after: 13, p: 0.043 },
};

/** Los productos del área de docencia en products.json, partidos como los cuenta el capítulo:
 *  artículos de investigación, otras publicaciones y ponencias, del más reciente al más antiguo. */
export const sotlProducts = (products: Product[]) => {
  const propios = products
    .filter((p) => p.researchAreas?.includes('Scholarship of Teaching & Learning'))
    .sort((a, b) => b.publicationDate.localeCompare(a.publicationDate));
  return {
    papers: propios.filter((p) => p.type === 'Research Paper'),
    talks: propios.filter((p) => p.type === 'Conference'),
    other: propios.filter((p) => p.type !== 'Research Paper' && p.type !== 'Conference'),
  };
};
