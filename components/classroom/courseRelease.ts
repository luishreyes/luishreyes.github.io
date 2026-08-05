import React from 'react';
import type { Course } from '../data/classroom';
import { useCourseRole } from './CourseAccessGate';

// Entrega gradual del material de un curso.
//
// El material del Classroom se etiqueta con la semana del semestre (`week`) y
// el cronograma del curso fecha cada sesión. Con esos dos datos se sabe cuándo
// le toca a cada semana: una semana se abre `releaseLeadDays` días antes de su
// primera sesión (por defecto 2, para que el aula invertida tenga fin de semana
// para leer) y se queda abierta el resto del semestre.
//
// Quien entra con el código del equipo docente (`staffAccessCode`) ve todo
// desde el primer día; el filtro es una capa de presentación, no un control de
// seguridad: los HTML de `public/` siguen siendo archivos estáticos servidos
// por GitHub Pages y quien conozca la URL exacta puede abrirlos.

const DEFAULT_LEAD_DAYS = 2;

/** Fecha local del dispositivo como ISO corto, para comparar con el cronograma. */
export const todayISO = (d: Date = new Date()): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const shiftISO = (iso: string, days: number): string => {
  const d = new Date(`${iso}T12:00:00`);
  if (isNaN(d.getTime())) return iso;
  d.setDate(d.getDate() + days);
  return todayISO(d);
};

/** Primera fecha de cada semana según el cronograma del curso. */
export const weekStartDates = (course: Course): Map<number, string> => {
  const first = new Map<number, string>();
  for (const e of course.cronograma ?? []) {
    const prev = first.get(e.week);
    if (!prev || e.date < prev) first.set(e.week, e.date);
  }
  return first;
};

export interface ReleaseInfo {
  /** `true` si la sesión entró con el código del equipo docente. */
  isStaff: boolean;
  /** `true` si el filtro por semana está activo para esta sesión. */
  gated: boolean;
  /** Semana en curso según la fecha del dispositivo (la última ya iniciada). */
  currentWeek: number | null;
  /** ¿Está disponible el material de esta semana? Sin semana → siempre sí. */
  isWeekOpen: (week?: number) => boolean;
  /** Fecha ISO en que se abre una semana, o `null` si no está en el cronograma. */
  releaseDate: (week: number) => string | null;
}

/**
 * Estado de la entrega gradual para la sesión actual. Debe usarse dentro de
 * `CourseAccessGate`: el rol se lee de `localStorage` en el primer efecto y,
 * mientras tanto, se asume estudiante (lo restrictivo) para no dejar ver
 * material futuro por un instante.
 */
export const useCourseRelease = (course: Course): ReleaseInfo => {
  const role = useCourseRole(course.slug);
  const isStaff = role === 'staff';
  const gated = !!course.gradualRelease && !isStaff;
  const lead = course.releaseLeadDays ?? DEFAULT_LEAD_DAYS;

  const starts = React.useMemo<Map<number, string>>(() => weekStartDates(course), [course]);
  const hoy = todayISO();

  const releaseDate = (week: number): string | null => {
    const start = starts.get(week);
    return start ? shiftISO(start, -lead) : null;
  };

  // La semana en curso es la última cuya primera sesión ya ocurrió; antes de
  // que arranque el semestre, la primera del cronograma.
  const semanas: number[] = [...starts.keys()].sort((a, b) => a - b);
  let currentWeek: number | null = semanas[0] ?? null;
  for (const w of semanas) {
    if (starts.get(w)! <= hoy) currentWeek = w;
  }

  const isWeekOpen = (week?: number): boolean => {
    if (week === undefined) return true; // material transversal
    if (!gated) return true;
    const release = releaseDate(week);
    // Semana que el cronograma no fecha: no hay con qué cerrarla, se deja abierta.
    return release === null || release <= hoy;
  };

  return { isStaff, gated, currentWeek, isWeekOpen, releaseDate };
};

/** «domingo 6 de septiembre» — para anunciar cuándo se abre una semana. */
export const fmtReleaseDate = (iso: string): string => {
  const d = new Date(`${iso}T12:00:00`);
  if (isNaN(d.getTime())) return iso;
  // «domingo, 9 de agosto» → «domingo 9 de agosto»: en español la coma sobra.
  return d
    .toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })
    .replace(',', '');
};
