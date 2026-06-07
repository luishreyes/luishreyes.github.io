import type { Course } from '../classroom';

// ── Seminario de Proyecto (SPDP) · semestre 2026-20 · Periodo 8B ───
// ESQUELETO EN BLANCO. Nueva corrida del Seminario (código IQYA-3050).
// Creado para previsualizar el acento azul y la estructura del curso.
// Reemplazar los "Por definir" con el contenido real cuando esté listo.
export const seminario202620Course: Course = {
  slug: 'iqya-3050-2026-20',
  code: 'IQYA-3050',
  title: 'Seminario de Proyecto',
  term: '2026-20 · Periodo 8B',
  accent: 'blue',
  credits: 1,
  modality: 'Presencial',
  duration: '8 semanas',
  tagline: 'Por definir',
  description:
    'Contenido por publicar. Este espacio mostrará el programa completo del Seminario de Proyecto del periodo 8B.',
  accessCode: 'SPDP202620',
  bannerUrl: '/classroom/iqya-3050-2026-20/banner.jpg',

  team: [
    {
      name: 'Luis H. Reyes',
      role: 'Profesor',
      email: 'lh.reyes@uniandes.edu.co',
    },
  ],

  schedule: [
    { label: 'Sesión semanal', detail: 'Miércoles · 12:30 – 13:50 · Grupo 1' },
    { label: 'Duración', detail: '8 semanas (Periodo 8B, calendario 2026-20)' },
  ],

  objectives: ['Por definir.'],

  methodology: {
    summary: 'Por definir.',
    phases: [
      { label: 'Fase', title: 'Por definir', items: ['Por definir.'] },
    ],
  },

  modules: [
    { title: 'Módulo 1 · Por definir', topics: ['Por definir.'] },
  ],

  evaluation: [
    { component: 'Por definir', percentage: 100, description: 'Por definir.' },
  ],

  aias: {
    intro: 'Por definir.',
    levels: [
      { level: 1, title: 'Sin IA', description: 'Por definir.', application: 'Por definir.' },
      { level: 2, title: 'IA para ideas', description: 'Por definir.', application: 'Por definir.' },
      { level: 3, title: 'IA para edición', description: 'Por definir.', application: 'Por definir.' },
      { level: 4, title: 'IA con evaluación', description: 'Por definir.', application: 'Por definir.' },
      { level: 5, title: 'Uso completo', description: 'Por definir.', application: 'Por definir.' },
    ],
    goals: ['Por definir.'],
    declaration: ['Por definir.'],
  },

  policies: [
    { category: 'Por definir', items: ['Por definir.'] },
  ],

  community: [
    { category: 'Por definir', items: ['Por definir.'] },
  ],

  readings: [],
  presentations: [],
};
