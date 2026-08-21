import type { Localized } from '../../context/i18n';

/**
 * The record behind the Scholarship of Teaching argument: the papers the POU
 * course produced, the turns of the measure-publish-redesign cycle, and the
 * findings of the longitudinal study.
 *
 * Prose reads its figures from here rather than restating them, so a new study
 * is entered once. The same papers back the Unit Operations bibliography; they
 * lived in that page alone until three of their DOIs turned out to point at the
 * wrong articles.
 */

export interface EducationPaper {
  /** Short form, for a citation inside running text. */
  authors: string;
  /** Full author list, for a bibliography entry. */
  authorsFull: string;
  year: number;
  title: string;
  journal: string;
  /** Volume and page range, e.g. "51, 64-78". */
  locator: string;
  doi: string;
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
  },
];

/** One pass of the cycle: the course changed, the change was measured, the
 *  measurement was published, and the next pass started from there. */
export interface CycleTurn {
  years: string;
  change: Localized;
  paper: EducationPaper;
  /** Set when the turn drew an external distinction. Matched against the role
   *  tag in awards.ts so the award text is never restated here. */
  recognizedBy?: string;
}

export const cycleTurns: CycleTurn[] = [
  {
    years: '2017-2019',
    change: {
      en: 'A joint design project links Unit Operations with Modelling and Simulation.',
      es: 'Un proyecto de diseño conjunto une Operaciones Unitarias con Modelado y Simulación.',
    },
    paper: educationPapers[0],
  },
  {
    years: '2019-2021',
    change: {
      en: 'The course moves to a student-centred framework: flipped classroom, PO-PBL, interactive e-learning.',
      es: 'El curso pasa a un marco centrado en el estudiante: aula invertida, PO-PBL y e-learning interactivo.',
    },
    paper: educationPapers[1],
  },
  {
    years: '2021-2025',
    change: {
      en: 'Gamification, self- and peer-evaluation, and generative AI bounded by the AIAS enter the PO-PBL model.',
      es: 'La gamificación, la autoevaluación y coevaluación, y la IA generativa acotada por la AIAS entran al modelo PO-PBL.',
    },
    paper: educationPapers[2],
    recognizedBy: 'AIChE Education Division',
  },
];

/**
 * The longitudinal study of the POU course. Every figure quoted in the
 * portfolio's prose about student learning comes from this object.
 */
export const pouLongitudinalStudy = {
  paper: educationPapers[2],
  students: 112,
  cohorts: 4,

  /** Written communication, compared against the pre-intervention baseline. */
  writtenCommunication: { test: 'one-way ANOVA', f: 7.5, pBelow: 0.001 },
  /** Independent readers, blind to the cohort, across the rubric. */
  blindEvaluation: { criteria: 6, pLow: 0.005, pHigh: 0.014 },

  /** Share of students still motivated at the end of the semester, current
   *  model against the previous one. */
  sustainedMotivation: { now: 94, before: 67 },

  references: { before: 8, after: 20, p: 0.045 },
  highImpactSources: { before: 3, after: 13, p: 0.043 },
  methodologyQuality: { before: 65, after: 88 },

  careerPreparedness: 94,
  shapedAspirations: 87,
};
