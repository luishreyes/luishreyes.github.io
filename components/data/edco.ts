import type { Localized } from '../../context/i18n';

/**
 * Formación a escala: los cursos y grupos de la Dirección de Educación Continua (EDCO) de la
 * Universidad de los Andes, abiertos y para organizaciones; los de la Educación Ejecutiva de la
 * Facultad de Administración; los cursos de Coursera y el curso de posgrado de CABBIO con Minciencias.
 *
 * Donde un curso está en el registro oficial de Educación Continua, las cifras (inscritos, horas,
 * fechas) son las de ese registro, y el nombre es el que la Universidad le dio. Los cursos que el
 * registro no trae salen de los correos de coordinación. Nada de dinero: ni valores ni ingresos.
 */

/** Por dónde llega el curso. Las cifras del capítulo cuentan `edco` y `executive`. */
export type EdcoChannel = 'edco' | 'executive' | 'coursera' | 'other';

export interface EdcoCourse {
  year: number;
  /** El nombre con que la Universidad (o la plataforma) registra el curso. */
  title: string;
  titleEn?: string;
  /** Grupo, cohorte o promoción, cuando el curso se dictó más de una vez. */
  group?: Localized;
  type: 'Open Course' | 'Corporate Course' | 'Summer School';
  channel: EdcoChannel;
  /** La organización para la que se dictó, con su nombre oficial y el área cuando se sabe. */
  client?: string;
  /** La organización con que se cuenta (ver `edcoOrganizations`). */
  org?: EdcoOrgId;
  /** Inscritos. Es 0 cuando no hay dato (`attendeesUnknown`) o el curso no ha salido (`underConstruction`). */
  attendees: number;
  attendeesUnknown?: boolean;
  /** Curso de Coursera que todavía no se ha publicado. */
  underConstruction?: boolean;
  role: 'Coordinator' | 'Instructor';
  url?: string;
  /** MOOCs only: share of enrolled learners who completed the course (0-1), from the platform's dashboard. */
  completionRate?: number;
  /** Fechas en AAAA-MM-DD, cuando se conocen. Un curso cuyo fin ya pasó cuenta como dictado. */
  start?: string;
  end?: string;
  /** Solo los cursos del registro oficial de Educación Continua: las horas que dictó el profesor según ese registro. */
  edcoRecord?: { hours: number };
  /** Lo que le tocó cuando no dictó el curso completo, o el dato que lo ubica. */
  note?: Localized;
}

export type EdcoOrgId =
  | 'contraloria' | 'bolivar' | 'uniandes' | 'bancolombia' | 'ecopetrol' | 'abbott' | 'armada' | 'bbva'
  | 'davivienda' | 'produbanco' | 'cenipalma' | 'cocrea' | 'eljuri' | 'vecol' | 'ceiba' | 'fsfb'
  | 'semillas' | 'indra' | 'ingetec' | 'sutherland';

/** Las organizaciones con su nombre oficial completo y, entre paréntesis, el nombre corto. */
export const edcoOrganizations: Record<EdcoOrgId, { name: Localized; detail?: Localized; external: boolean }> = {
  contraloria: { name: 'Contraloría General de la República de Colombia', external: true },
  bolivar: { name: 'Compañía de Seguros Bolívar S. A. (ARL Seguros Bolívar)', external: true },
  uniandes: {
    name: 'Universidad de los Andes',
    detail: { en: 'administrative leaders and the Vice-Presidency for Research and Creation', es: 'líderes administrativos y Vicerrectoría de Investigación y Creación' },
    external: false,
  },
  bancolombia: { name: 'Bancolombia S. A.', external: true },
  ecopetrol: {
    name: 'Ecopetrol S. A.',
    detail: { en: 'through Executive Education at the School of Management (Facultad de Administración)', es: 'con la Educación Ejecutiva de la Facultad de Administración' },
    external: true,
  },
  abbott: { name: 'Abbott Laboratories de Colombia S. A. (Abbott)', external: true },
  armada: { name: 'Armada de la República de Colombia (Armada Nacional)', external: true },
  bbva: { name: 'Banco Bilbao Vizcaya Argentaria Colombia S. A. (BBVA Colombia)', external: true },
  davivienda: { name: 'Banco Davivienda S. A.', external: true },
  produbanco: { name: 'Banco de la Producción S. A. (Produbanco), Ecuador', external: true },
  cenipalma: { name: 'Corporación Centro de Investigación en Palma de Aceite (Cenipalma)', external: true },
  cocrea: { name: 'Corporación Colombia Crea Talento (CoCrea)', external: true },
  eljuri: { name: 'Corporación Empresarial Eljuri (Grupo Eljuri, Ecuador)', external: true },
  vecol: { name: 'Empresa Colombiana de Productos Veterinarios (Vecol)', external: true },
  ceiba: { name: 'Fundación CeiBA', external: true },
  fsfb: { name: 'Fundación Santa Fe de Bogotá', external: true },
  semillas: {
    name: {
      en: 'Huawei Technologies and the Ministerio de Tecnologías de la Información y las Comunicaciones (MinTIC)',
      es: 'Huawei Technologies y Ministerio de Tecnologías de la Información y las Comunicaciones (MinTIC)',
    },
    detail: { en: 'Seeds for the Future programme', es: 'programa Semillas del Futuro' },
    external: true,
  },
  indra: {
    name: 'Indra Sistemas, S. A. (Indra Group)',
    detail: {
      en: 'with Instituto Tecnológico y de Estudios Superiores de Monterrey (Tecnológico de Monterrey)',
      es: 'con el Instituto Tecnológico y de Estudios Superiores de Monterrey (Tecnológico de Monterrey)',
    },
    external: true,
  },
  ingetec: { name: 'Ingenieros Consultores Civiles y Eléctricos S. A. S. (INGETEC)', external: true },
  sutherland: { name: 'Sutherland Global Services (Sutherland)', external: true },
};

const DOMINANDO = 'Dominando la Inteligencia Artificial: más allá de ChatGPT y los modelos generativos';
const DOMINANDO_EN = 'Mastering Artificial Intelligence: beyond ChatGPT and generative models';
const TRANSFORMANDO = 'Transformando la productividad corporativa con IA: Aprovechando el potencial de los modelos generativos en el entorno empresarial';
const TRANSFORMANDO_EN = 'Transforming corporate productivity with AI: harnessing the potential of generative models in the business environment';
const CONTRALORIA = 'Contraloría General de la República de Colombia';
const BOLIVAR = 'Compañía de Seguros Bolívar S. A. (ARL Seguros Bolívar)';
const VICERRECTORIA = 'Inteligencia artificial aplicada en procesos de investigación, creación y emprendimiento';
const VICERRECTORIA_EN = 'Artificial intelligence applied to research, creation and entrepreneurship';
const OIL_GAS = 'Inteligencia artificial aplicada al negocio Oil & Gas';
const OIL_GAS_EN = 'Artificial intelligence applied to the oil & gas business';
const MOOC = 'Coursera (MOOC)';

const grupo = (n: number, lugar?: string): Localized => ({
  en: `Group ${n}${lugar ? `, ${lugar}` : ''}`,
  es: `Grupo ${n}${lugar ? `, ${lugar}` : ''}`,
});
const cohorte = (n: number): Localized => ({ en: `Cohort ${n}`, es: `Cohorte ${n}` });
const promocion = (n: number): Localized => ({ en: `Cohort ${n}`, es: `Promoción ${n}` });

/** Los ocho grupos de «Generalidades de la IA» de la Contraloría, con las fechas del registro. */
const generalidades: [number, string, string][] = [
  [1, '2026-02-23', '2026-03-30'],
  [2, '2026-05-04', '2026-06-11'],
  [3, '2026-06-01', '2026-07-13'],
  [4, '2026-07-02', '2026-08-06'],
  [5, '2026-09-02', '2026-10-02'],
  [6, '2026-09-02', '2026-10-02'],
  [7, '2026-08-03', '2026-09-02'],
  [8, '2026-09-01', '2026-10-01'],
];

export const edcoCoursesData: EdcoCourse[] = [
  // 2026
  {
    year: 2026, title: VICERRECTORIA, titleEn: VICERRECTORIA_EN, group: grupo(1), type: 'Corporate Course', channel: 'edco',
    client: 'Universidad de los Andes, Vicerrectoría de Investigación y Creación', org: 'uniandes',
    attendees: 0, attendeesUnknown: true, role: 'Instructor', start: '2026-10-06', end: '2026-11-20',
  },
  {
    year: 2026, title: VICERRECTORIA, titleEn: VICERRECTORIA_EN, group: grupo(2), type: 'Corporate Course', channel: 'edco',
    client: 'Universidad de los Andes, Vicerrectoría de Investigación y Creación', org: 'uniandes',
    attendees: 0, attendeesUnknown: true, role: 'Instructor', start: '2026-10-06', end: '2026-11-20',
  },
  {
    year: 2026, title: VICERRECTORIA, titleEn: VICERRECTORIA_EN, group: grupo(3), type: 'Corporate Course', channel: 'edco',
    client: 'Universidad de los Andes, Vicerrectoría de Investigación y Creación', org: 'uniandes',
    attendees: 0, attendeesUnknown: true, role: 'Instructor', start: '2026-10-09', end: '2026-11-24',
  },
  {
    year: 2026, title: OIL_GAS, titleEn: OIL_GAS_EN, group: grupo(6, 'Cartagena'), type: 'Corporate Course', channel: 'executive',
    client: 'Ecopetrol S. A.', org: 'ecopetrol', attendees: 25, role: 'Instructor', start: '2026-10-13', end: '2026-10-20',
  },
  {
    year: 2026, title: OIL_GAS, titleEn: OIL_GAS_EN, group: grupo(2, 'Bogotá'), type: 'Corporate Course', channel: 'executive',
    client: 'Ecopetrol S. A.', org: 'ecopetrol', attendees: 25, role: 'Instructor', start: '2026-09-28', end: '2026-10-01',
  },
  {
    year: 2026, title: OIL_GAS, titleEn: OIL_GAS_EN, group: grupo(1, 'Bogotá'), type: 'Corporate Course', channel: 'executive',
    client: 'Ecopetrol S. A.', org: 'ecopetrol', attendees: 25, role: 'Instructor', start: '2026-09-28', end: '2026-09-30',
    note: { en: 'The final module: the capstone project', es: 'El módulo final: el proyecto integrador' },
  },
  {
    year: 2026, title: 'Programa Herramientas de IA para la Escritura de Artículos Científicos',
    titleEn: 'AI tools for writing scientific articles', type: 'Corporate Course', channel: 'edco',
    client: 'Ingenieros Consultores Civiles y Eléctricos S. A. S. (INGETEC)', org: 'ingetec',
    attendees: 0, attendeesUnknown: true, role: 'Instructor', start: '2026-09-25', end: '2026-10-27',
  },
  {
    year: 2026, title: 'AI Leadership & Architecture', titleEn: 'AI Leadership & Architecture', type: 'Corporate Course', channel: 'edco',
    client: 'Indra Sistemas, S. A. (Indra Group)', org: 'indra',
    attendees: 0, attendeesUnknown: true, role: 'Instructor', start: '2026-08-19', end: '2027-01-29',
    note: {
      en: 'With Instituto Tecnológico y de Estudios Superiores de Monterrey (Tecnológico de Monterrey); the Uniandes modules',
      es: 'Con el Instituto Tecnológico y de Estudios Superiores de Monterrey (Tecnológico de Monterrey); los módulos de Uniandes',
    },
  },
  ...generalidades.map(([n, start, end]): EdcoCourse => ({
    year: 2026, title: 'Generalidades de la IA', titleEn: 'AI fundamentals', group: grupo(n), type: 'Corporate Course', channel: 'edco',
    client: CONTRALORIA, org: 'contraloria', attendees: 35, role: 'Instructor', start, end, edcoRecord: { hours: 10 },
  })),
  {
    year: 2026, title: TRANSFORMANDO, titleEn: TRANSFORMANDO_EN, type: 'Corporate Course', channel: 'edco',
    client: BOLIVAR, org: 'bolivar', attendees: 30, role: 'Instructor', start: '2026-08-19', edcoRecord: { hours: 12 },
  },
  {
    year: 2026, title: 'IA Generativa Aplicada', titleEn: 'Applied generative AI', type: 'Corporate Course', channel: 'edco',
    client: 'Empresa Colombiana de Productos Veterinarios (Vecol)', org: 'vecol',
    attendees: 40, role: 'Instructor', start: '2026-07-31', end: '2026-07-31', edcoRecord: { hours: 4 },
  },
  {
    year: 2026, title: DOMINANDO, titleEn: DOMINANDO_EN, group: cohorte(3), type: 'Open Course', channel: 'edco',
    attendees: 36, role: 'Instructor', start: '2026-07-15', end: '2026-08-14', edcoRecord: { hours: 12 },
  },
  {
    year: 2026, title: 'Dominando la Inteligencia Artificial: Google Workspace, Gemini y Herramientas Generativas',
    titleEn: 'Mastering Artificial Intelligence: Google Workspace, Gemini and generative tools', type: 'Corporate Course', channel: 'edco',
    client: 'Banco Davivienda S. A.', org: 'davivienda', attendees: 15, role: 'Instructor', start: '2026-07-07', end: '2026-08-13', edcoRecord: { hours: 12 },
  },
  {
    year: 2026, title: 'Curso Liderazgo en IA', titleEn: 'AI leadership course', type: 'Corporate Course', channel: 'edco',
    client: 'Universidad de los Andes, líderes administrativos', org: 'uniandes',
    attendees: 70, role: 'Instructor', start: '2026-07-01', end: '2026-07-30', edcoRecord: { hours: 4 },
    note: { en: 'The module on prioritizing and designing use cases', es: 'El módulo de priorización y diseño de casos de uso' },
  },
  {
    year: 2026, title: 'IA aplicada a la productividad', titleEn: 'AI applied to productivity', type: 'Corporate Course', channel: 'edco',
    client: 'Corporación Colombia Crea Talento (CoCrea)', org: 'cocrea', attendees: 40, role: 'Instructor', start: '2026-06-02', end: '2026-08-04', edcoRecord: { hours: 10 },
  },
  {
    year: 2026, title: 'Fundamentos de Ingeniería de Prompts', titleEn: 'Prompt engineering fundamentals', type: 'Corporate Course', channel: 'edco',
    client: 'Banco de la Producción S. A. (Produbanco), Ecuador', org: 'produbanco',
    attendees: 20, role: 'Instructor', start: '2026-05-13', end: '2026-05-29', edcoRecord: { hours: 6 },
  },
  {
    year: 2026, title: 'Modelos de la IA', titleEn: 'AI models', type: 'Corporate Course', channel: 'edco',
    client: CONTRALORIA, org: 'contraloria', attendees: 35, role: 'Instructor', start: '2026-05-04', end: '2026-06-11', edcoRecord: { hours: 10 },
  },
  {
    year: 2026, title: DOMINANDO, titleEn: DOMINANDO_EN, group: cohorte(2), type: 'Open Course', channel: 'edco',
    attendees: 29, role: 'Instructor', start: '2026-05-04', end: '2026-06-03', edcoRecord: { hours: 12 },
  },
  {
    year: 2026, title: 'Herramientas de la IA', titleEn: 'AI tools', type: 'Corporate Course', channel: 'edco',
    client: CONTRALORIA, org: 'contraloria', attendees: 35, role: 'Instructor', start: '2026-02-23', end: '2026-03-30', edcoRecord: { hours: 10 },
  },
  {
    year: 2026, title: DOMINANDO, titleEn: DOMINANDO_EN, group: cohorte(1), type: 'Open Course', channel: 'edco',
    attendees: 39, role: 'Instructor', start: '2026-02-16', end: '2026-03-13', edcoRecord: { hours: 12 },
  },
  {
    year: 2026, title: 'Fundamentals of Using Generative AI', titleEn: 'Fundamentals of Using Generative AI', type: 'Open Course', channel: 'coursera',
    client: MOOC, attendees: 227, completionRate: 0.21, role: 'Instructor', url: 'https://www.coursera.org/learn/fundamentals-of-using-generative-ai',
  },
  {
    year: 2026, title: 'IA Generativa para el Análisis de Datos Estructurados', titleEn: 'Generative AI for structured data analysis', type: 'Open Course', channel: 'coursera',
    client: MOOC, attendees: 0, underConstruction: true, role: 'Instructor',
  },

  // 2025
  {
    year: 2025, title: TRANSFORMANDO, titleEn: TRANSFORMANDO_EN, group: grupo(2), type: 'Corporate Course', channel: 'edco',
    client: BOLIVAR, org: 'bolivar', attendees: 26, role: 'Instructor', start: '2025-10-23', end: '2025-12-12',
  },
  {
    year: 2025, title: 'Conferencia IA Generativa y su Impacto en la Seguridad y Salud Laboral',
    titleEn: 'Lecture: generative AI and its impact on occupational health and safety', type: 'Corporate Course', channel: 'edco',
    client: BOLIVAR, org: 'bolivar', attendees: 93, role: 'Instructor', start: '2025-10-24', end: '2025-10-24',
  },
  {
    year: 2025, title: TRANSFORMANDO, titleEn: TRANSFORMANDO_EN, group: grupo(1), type: 'Corporate Course', channel: 'edco',
    client: BOLIVAR, org: 'bolivar', attendees: 15, role: 'Instructor', start: '2025-10-09', end: '2025-11-18', edcoRecord: { hours: 12 },
  },
  {
    year: 2025, title: 'Masa madre: Sabor y ciencia', titleEn: 'Sourdough: flavour and science (workshop)', type: 'Open Course', channel: 'edco',
    attendees: 26, role: 'Instructor', start: '2025-11-29', end: '2025-11-29', edcoRecord: { hours: 4 },
  },
  {
    year: 2025, title: DOMINANDO, titleEn: DOMINANDO_EN, type: 'Open Course', channel: 'edco',
    attendees: 37, role: 'Instructor', start: '2025-10-15', end: '2025-11-21', edcoRecord: { hours: 12 },
  },
  {
    year: 2025, title: 'Prompt Engineering 2025', titleEn: 'Prompt Engineering 2025', type: 'Corporate Course', channel: 'edco',
    client: 'Bancolombia S. A., analítica de datos', org: 'bancolombia', attendees: 33, role: 'Instructor', start: '2025-09-09', end: '2025-09-25', edcoRecord: { hours: 6 },
  },
  {
    year: 2025, title: TRANSFORMANDO, titleEn: TRANSFORMANDO_EN, type: 'Corporate Course', channel: 'edco',
    client: 'Corporación Centro de Investigación en Palma de Aceite (Cenipalma)', org: 'cenipalma',
    attendees: 35, role: 'Instructor', start: '2025-08-22', end: '2025-10-03', edcoRecord: { hours: 12 },
  },
  {
    year: 2025, title: DOMINANDO, titleEn: DOMINANDO_EN, type: 'Open Course', channel: 'edco',
    attendees: 36, role: 'Instructor', start: '2025-07-21', end: '2025-08-15', edcoRecord: { hours: 12 },
  },
  {
    year: 2025, title: DOMINANDO, titleEn: DOMINANDO_EN, type: 'Open Course', channel: 'edco',
    attendees: 34, role: 'Instructor', start: '2025-07-14', end: '2025-08-08', edcoRecord: { hours: 12 },
  },
  {
    year: 2025, title: 'Biotecnología Marina: de la bioprospección al escalado', titleEn: 'Marine Biotechnology: from bioprospecting to scale-up',
    type: 'Summer School', channel: 'other',
    client: 'Centro Latinoamericano de Biotecnología (CABBIO), con el Ministerio de Ciencia, Tecnología e Innovación (Minciencias)',
    attendees: 19, role: 'Instructor', start: '2025-07-14', end: '2025-07-25',
    note: {
      en: 'CABBIO course COL09, for master’s and doctoral students, at Universidad de los Andes; taught between Biological Sciences and Engineering',
      es: 'Curso CABBIO COL09, para estudiantes de maestría y doctorado, en la Universidad de los Andes; lo dictamos entre Ciencias Biológicas e Ingeniería',
    },
  },
  {
    year: 2025, title: 'Inteligencia Artificial Generativa para Químicos', titleEn: 'Generative artificial intelligence for chemists', type: 'Corporate Course', channel: 'edco',
    client: 'Abbott Laboratories de Colombia S. A. (Abbott)', org: 'abbott', attendees: 74, role: 'Instructor', start: '2025-05-10', end: '2025-05-10',
  },
  {
    year: 2025, title: DOMINANDO, titleEn: DOMINANDO_EN, type: 'Corporate Course', channel: 'edco',
    client: 'Fundación Santa Fe de Bogotá', org: 'fsfb', attendees: 32, role: 'Instructor', start: '2025-02-27', end: '2025-04-08', edcoRecord: { hours: 12 },
  },
  {
    year: 2025, title: 'Prompt Engineering', titleEn: 'Prompt Engineering', type: 'Corporate Course', channel: 'edco',
    client: 'Banco Bilbao Vizcaya Argentaria Colombia S. A. (BBVA Colombia), Banca Wealth', org: 'bbva',
    attendees: 19, role: 'Instructor', start: '2025-03-17', end: '2025-03-26', edcoRecord: { hours: 12 },
  },
  {
    year: 2025, title: 'IA generativa en acción: del concepto a la práctica', titleEn: 'Generative AI in action: from concept to practice', type: 'Open Course', channel: 'edco',
    attendees: 26, role: 'Instructor', start: '2025-02-10', end: '2025-03-07', edcoRecord: { hours: 12 },
  },
  {
    year: 2025, title: 'Prompt Engineering', titleEn: 'Prompt Engineering', type: 'Corporate Course', channel: 'edco',
    client: 'Bancolombia S. A.', org: 'bancolombia', attendees: 50, role: 'Instructor', start: '2025-01-20', end: '2025-01-31',
  },
  {
    year: 2025, title: 'Taller IA generativa líderes vicepresidencia', titleEn: 'Generative AI workshop for vice-presidency leaders',
    type: 'Corporate Course', channel: 'edco', client: 'Bancolombia S. A., Vicepresidencia de Riesgos', org: 'bancolombia',
    attendees: 20, role: 'Instructor', edcoRecord: { hours: 4 },
  },
  {
    year: 2025, title: 'Fundamentos del uso de IA generativa', titleEn: 'Fundamentals of using generative AI', type: 'Open Course', channel: 'coursera',
    client: MOOC, attendees: 16584, completionRate: 0.52, role: 'Instructor', url: 'https://www.coursera.org/learn/fundamentos-del-uso-de-ia-generativa',
  },

  // 2024
  {
    year: 2024, title: 'Claves para triunfar con tu cervecería artesanal: Operaciones, finanzas y marca',
    titleEn: 'Keys to succeed with your craft brewery: operations, finance and brand', type: 'Open Course', channel: 'edco',
    attendees: 23, role: 'Coordinator', start: '2024-11-07', end: '2024-11-28', edcoRecord: { hours: 0 },
  },
  {
    year: 2024, title: DOMINANDO, titleEn: DOMINANDO_EN, group: promocion(3), type: 'Open Course', channel: 'edco',
    attendees: 45, role: 'Instructor', start: '2024-08-26', end: '2024-09-23', edcoRecord: { hours: 11 },
  },
  {
    year: 2024, title: 'Sutherland Leadership Competencies Program', titleEn: 'Sutherland Leadership Competencies Program', type: 'Corporate Course', channel: 'edco',
    client: 'Sutherland Global Services (Sutherland)', org: 'sutherland', attendees: 36, role: 'Instructor', start: '2024-08-23', end: '2024-11-22',
    note: { en: 'The module “IA y Transformación Digital” (AI and digital transformation)', es: 'El módulo «IA y Transformación Digital»' },
  },
  {
    year: 2024, title: DOMINANDO, titleEn: DOMINANDO_EN, type: 'Corporate Course', channel: 'edco',
    client: 'Corporación Empresarial Eljuri (Grupo Eljuri), Ecuador', org: 'eljuri', attendees: 38, role: 'Instructor', start: '2024-07-03', end: '2024-08-08', edcoRecord: { hours: 10 },
  },
  {
    year: 2024, title: DOMINANDO, titleEn: DOMINANDO_EN, type: 'Corporate Course', channel: 'edco',
    client: 'Armada de la República de Colombia (Armada Nacional)', org: 'armada', attendees: 25, role: 'Instructor', start: '2024-06-11', end: '2024-07-04', edcoRecord: { hours: 9 },
  },
  {
    year: 2024, title: DOMINANDO, titleEn: DOMINANDO_EN, group: promocion(2), type: 'Open Course', channel: 'edco',
    attendees: 42, role: 'Instructor', start: '2024-02-05', end: '2024-03-01', edcoRecord: { hours: 9 },
  },

  // 2023 y antes
  {
    year: 2023, title: DOMINANDO, titleEn: DOMINANDO_EN, type: 'Open Course', channel: 'edco',
    attendees: 33, role: 'Instructor', start: '2023-08-08', end: '2023-09-14', edcoRecord: { hours: 6 },
  },
  {
    year: 2022, title: 'Boot Camp Semillas del futuro Ingeniería: innovación, liderazgo y tecnología',
    titleEn: 'Seeds for the Future Boot Camp, Engineering: innovation, leadership and technology', type: 'Corporate Course', channel: 'edco',
    client: 'Huawei Technologies y Ministerio de Tecnologías de la Información y las Comunicaciones (MinTIC), programa Semillas del Futuro', org: 'semillas',
    attendees: 19, role: 'Instructor', start: '2022-10-24', end: '2022-10-28', edcoRecord: { hours: 4 },
  },
  {
    year: 2022, title: 'Perfección cervecera y emprendimiento', titleEn: 'Brewing perfection and entrepreneurship', type: 'Open Course', channel: 'edco',
    attendees: 17, role: 'Coordinator', start: '2022-02-23', end: '2022-03-10', edcoRecord: { hours: 0 },
  },
  {
    year: 2021, title: 'Programa investigación para el desarrollo regional', titleEn: 'Research programme for regional development', type: 'Corporate Course', channel: 'edco',
    client: 'Fundación CeiBA', org: 'ceiba', attendees: 86, role: 'Instructor', start: '2021-10-04', end: '2021-11-24', edcoRecord: { hours: 1 },
  },
  {
    year: 2021, title: 'Perfección cervecera y emprendimiento', titleEn: 'Brewing perfection and entrepreneurship', type: 'Open Course', channel: 'edco',
    attendees: 25, role: 'Coordinator', start: '2021-02-17', end: '2021-03-04', edcoRecord: { hours: 0 },
  },
];

/** Fecha de hoy en AAAA-MM-DD, en la hora del navegador. */
export const todayIso = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Dictado: el fin ya pasó o, sin fecha de fin, es de un año anterior. */
export const isTaught = (c: EdcoCourse, today = todayIso()) =>
  c.end ? c.end < today : c.year < Number(today.slice(0, 4));

/** Los cursos y grupos de Educación Continua y de Educación Ejecutiva: lo que cuentan las cifras de la página. */
export const trainingCourses = edcoCoursesData.filter((c) => c.channel === 'edco' || c.channel === 'executive');

/** Los cursos de Coursera. */
export const moocCourses = edcoCoursesData.filter((c) => c.channel === 'coursera');
