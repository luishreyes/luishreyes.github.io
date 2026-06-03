export interface Reading {
  slug: string;
  title: string;
  summary: string;
  date: string;
  readingMinutes?: number;
  tags?: string[];
  /**
   * Categoría editorial del material:
   * - 'guia'    → guías de proceso / metodología (trabajo en equipo, bitácoras, informe, búsqueda, etc.)
   * - 'lectura' → lecturas de contenido que acompañan una clase (una por sesión)
   * Si no se especifica, se asume 'guia'.
   */
  category?: 'guia' | 'lectura';
  /**
   * Si se define, la entrada enlaza a este documento (p. ej. un HTML
   * autocontenido hospedado en `public/`) y abre en pestaña nueva, en lugar
   * de la lectura TSX interna (`/classroom/{slug}/readings/{slug}`).
   */
  href?: string;
}

export interface Presentation {
  id: string;
  title: string;
  sessionNumber?: number;
  date?: string;
  description?: string;
  file: string;
}

export interface TeamMember {
  name: string;
  role: string;
  email: string;
  officeHours?: string;
}

export interface Schedule {
  label: string;
  detail: string;
}

export interface EvaluationItem {
  component: string;
  percentage: number;
  description: string;
}

export interface AbetOutcome {
  title: string;
  indicators: string[];
}

export interface SyllabusModule {
  title: string;
  topics: string[];
}

export interface DeliveryDate {
  label: string;
  date: string;
}

export interface AiasLevel {
  level: number;
  title: string;
  description: string;
  application: string;
}

export interface CronogramaEntry {
  date: string;      // ISO: '2026-01-20'
  day: string;       // 'Martes', 'Jueves', 'Lunes'
  week: number;
  topic: string;     // Main topic (first line)
  details?: string[]; // Sub-bullets
  quiz?: string;
  taller?: string;
  proyecto?: string;  // Deliverable or coevaluation
}

export interface EdcoSession {
  date: string;          // ISO: '2026-05-04'
  day: string;           // 'Lunes', 'Miércoles', 'Viernes'
  time: string;          // '6:30 pm – 8:30 pm'
  module: string;        // 'M1', 'M2.1', etc.
  topic: string;
  instructor: string;    // 'Luis H. Reyes' | 'Francisco Moya' | …
  hours: number;
  isMine?: boolean;      // true si la dicta Luis
}

export interface EdcoCourseModule {
  code: string;          // 'M1', 'M2', …
  title: string;
  hours: number;
  topics?: string[];
  instructor?: string;   // Quién dicta el módulo (si es uno solo)
}

export interface EdcoCourse {
  id: string;                      // 'curso-2-ia-mayo-2026'
  title: string;
  edition: string;                 // 'Curso 2 · Edición Mayo 2026'
  status: 'active' | 'upcoming' | 'past';
  termLabel: string;               // 'Mayo–Junio 2026'
  modality: string;                // 'Virtual', 'Presencial', 'Híbrido'
  totalHours: number;
  description: string;
  externalUrl?: string;            // Página oficial de EDCO Uniandes
  zoom?: {
    url: string;
    meetingId?: string;
    note?: string;
    platform?: 'zoom' | 'teams';   // default 'zoom' si se omite
  };
  team: { name: string; role: string }[];
  modules: EdcoCourseModule[];
  sessions: EdcoSession[];
  presentationIds?: string[];      // IDs de Presentation (en course.presentations) que pertenecen a este curso EDCO
  notes?: string[];                // Notas adicionales (certificación, asistencia, etc.)
}

export interface Course {
  slug: string;
  code: string;
  title: string;
  term: string;
  credits: number;
  modality: string;
  duration: string;
  description: string;
  tagline?: string;
  accessCode: string;
  bannerUrl: string;
  /**
   * Tipo de curso:
   * - 'academic'      → curso regular (POU, SPDP, IQYA, DPRO). Usa el CourseLandingPage estándar.
   * - 'professional'  → espacio de Educación Continua (EDCO Uniandes y similares). Usa un landing custom (EduProLandingPage).
   * Si no se especifica, se asume 'academic'.
   */
  kind?: 'academic' | 'professional';
  /**
   * Tema visual del curso. Si es `'deloitte'`, las páginas del curso (landing,
   * Material, Presentaciones, lecturas, gate de acceso) y su tarjeta en el Aula
   * usan la paleta verde Deloitte + Source Sans 3. Si se omite, usa el tema
   * amarillo del portafolio.
   */
  theme?: 'deloitte';
  /**
   * Si `true`, el curso pertenece a un semestre pasado: NO aparece en el índice de Aula
   * sino en la página de Archivo (`/classroom/archive`). Sus páginas internas (landing,
   * lecturas, presentaciones) siguen siendo accesibles con normalidad.
   */
  archived?: boolean;
  /** Solo aplica si `kind === 'professional'`. Lista de cursos EDCO/charlas que componen el espacio. */
  edcoCourses?: EdcoCourse[];
  cronograma?: CronogramaEntry[];
  pillars?: { title: string; description: string }[];
  team: TeamMember[];
  schedule: Schedule[];
  objectives: string[];
  methodology: {
    summary: string;
    phases: { label: string; title: string; items: string[] }[];
    synergies?: string[];
  };
  abet?: {
    peos: string[];
    outcomes: AbetOutcome[];
  };
  project?: {
    title: string;
    overview: string;
    rawMaterials: { name: string; outcome: string }[];
    scope: string[];
    teamwork: string[];
  };
  modules: SyllabusModule[];
  evaluation: EvaluationItem[];
  deliveries?: {
    bitacoras: DeliveryDate[];
    coevaluations: DeliveryDate[];
    feedback: DeliveryDate[];
  };
  coevaluation?: {
    importance: string[];
    application: string[];
    procedure: string[];
    example: string[];
  };
  /** If set, a "Retos del semestre" button appears in the landing with this label. */
  challenges?: {
    label: string;
    term: string;
    /** Etiqueta pequeña sobre el título. Por defecto "Retos". */
    eyebrow?: string;
    /** Texto descriptivo del botón. Si se omite, usa el texto por defecto de la página de Retos. */
    description?: string;
    /**
     * Si se define, el botón enlaza a este documento (p. ej. una guía HTML
     * autocontenida) y abre en pestaña nueva, en lugar de la página interna
     * de Retos (`/classroom/{slug}/retos`).
     */
    href?: string;
  };
  aias: {
    intro: string;
    levels: AiasLevel[];
    goals: string[];
    declaration: string[];
  };
  policies: {
    category: string;
    items: string[];
  }[];
  community: {
    category: string;
    items: string[];
  }[];
  readings: Reading[];
  presentations: Presentation[];
}

import { pouCourse } from './classroom/pou';
import { pou202620Course } from './classroom/pou-2026-20';
import { spdpCourse } from './classroom/spdp';
import { dpro4300Course } from './classroom/dpro-4300';
import { eduProCourse } from './classroom/edu-pro';

export const classroomData: Course[] = [pou202620Course, pouCourse, spdpCourse, dpro4300Course, eduProCourse];

export const getCourseBySlug = (slug: string): Course | undefined =>
  classroomData.find((c) => c.slug === slug);
