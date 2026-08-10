import React from 'react';
import type { Course } from '../data/classroom';
import { useCourseRole } from './CourseAccessGate';
import { todayISO } from './today';
import { fetchPublishedWeeks, readCachedWeeks, setWeekPublished } from './publishState';

// Entrega del material de un curso, en dos modos:
//
// - `gradualRelease` (automático): el material se etiqueta con la semana del
//   semestre (`week`) y el cronograma fecha cada sesión. Una semana se abre
//   `releaseLeadDays` días antes de su primera sesión (por defecto 2, para que
//   el aula invertida tenga fin de semana para leer).
// - `manualRelease` (manual): nada se abre solo. El equipo docente publica u
//   oculta cada semana con un botón ON/OFF; el estado vive en
//   `published/{slug}.json` en el repositorio (ver `publishState.ts`).
//
// Quien entra con el código del equipo docente (`staffAccessCode`) ve todo
// desde el primer día; el filtro es una capa de presentación, no un control de
// seguridad: los HTML de `public/` siguen siendo archivos estáticos servidos
// por GitHub Pages y quien conozca la URL exacta puede abrirlos.

const DEFAULT_LEAD_DAYS = 2;

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
  /** `true` si el curso publica manualmente (`manualRelease`). */
  manual: boolean;
  /** Semana en curso según la fecha del dispositivo (la última ya iniciada). */
  currentWeek: number | null;
  /** ¿Está disponible el material de esta semana? Sin semana → siempre sí. */
  isWeekOpen: (week?: number) => boolean;
  /** Fecha ISO en que se abre una semana, o `null` si no está en el cronograma. */
  releaseDate: (week: number) => string | null;
  /**
   * Semanas publicadas por el equipo docente (solo cursos `manualRelease`);
   * `null` mientras no se ha podido leer el estado del repositorio.
   */
  publishedWeeks: Set<number> | null;
  /** Publica u oculta una semana en el repositorio (equipo docente). */
  setPublished: (week: number, on: boolean, token: string) => Promise<void>;
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
  const manual = !!course.manualRelease;
  const gated = (manual || !!course.gradualRelease) && !isStaff;
  const lead = course.releaseLeadDays ?? DEFAULT_LEAD_DAYS;

  // Publicación manual: se arranca con la última copia buena en caché para no
  // parpadear, y se refresca desde el repositorio en cuanto se puede.
  const [pub, setPub] = React.useState<number[] | null>(() =>
    manual ? readCachedWeeks(course.slug) : null,
  );
  React.useEffect(() => {
    if (!manual) return;
    let vivo = true;
    fetchPublishedWeeks(course.slug).then((weeks) => {
      if (vivo && weeks) setPub(weeks);
    });
    return () => {
      vivo = false;
    };
  }, [manual, course.slug]);
  const publishedWeeks = React.useMemo<Set<number> | null>(
    () => (pub ? new Set(pub) : null),
    [pub],
  );

  const setPublished = async (week: number, on: boolean, token: string) => {
    const weeks = await setWeekPublished(course.slug, week, on, token);
    setPub(weeks);
  };

  const starts = React.useMemo<Map<number, string>>(() => weekStartDates(course), [course]);
  const hoy = todayISO();

  // En modo manual no hay fecha de apertura que anunciar: la semana se abre
  // cuando el equipo docente la publica.
  const releaseDate = (week: number): string | null => {
    if (manual) return null;
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
    // Manual: solo lo publicado. Sin estado legible se falla cerrado, para que
    // un tropiezo de red no destape material que el equipo aún no publica.
    if (manual) return publishedWeeks?.has(week) ?? false;
    const release = releaseDate(week);
    // Semana que el cronograma no fecha: no hay con qué cerrarla, se deja abierta.
    return release === null || release <= hoy;
  };

  return { isStaff, gated, manual, currentWeek, isWeekOpen, releaseDate, publishedWeeks, setPublished };
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
