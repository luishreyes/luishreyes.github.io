import type { Course, CronogramaEntry } from '../classroom';
import { spdpDocumentos, spdpPresentaciones } from './spdp-material-2026-20';

// ── Seminario de Proyecto (SPDP) · semestre 2026-20 · Periodo 8B ───
// Nueva corrida del Seminario (código IQYA-3050), adaptada de la versión
// 2026-10. Acento naranja, el del design system del curso. Cronograma: 8 sesiones, miércoles 7-oct → 25-nov 2026.
// Fechas y salón confirmados contra el programa 2026-20 (sPDP/202620/programa)
// el 6 de octubre de 2026: AU-107, Edificio Aulas, campus principal.
const seminarioCronograma: CronogramaEntry[] = [
  {
    date: '2026-10-07',
    day: 'Miércoles',
    week: 1,
    topic: 'Presentación del curso y de los retos',
    details: [
      'Revisión del syllabus y criterios de evaluación',
      'Presentación del listado de retos disponibles',
      'Expectativas del seminario',
    ],
  },
  {
    date: '2026-10-14',
    day: 'Miércoles',
    week: 2,
    topic: 'Formación de equipos',
    details: [
      'Selección de retos',
      'Conformación de equipos de trabajo',
      'Primer contacto con el mentor asignado',
    ],
  },
  {
    date: '2026-10-21',
    day: 'Miércoles',
    week: 3,
    topic: 'IA generativa para investigación',
    details: [
      'Búsqueda y síntesis asistida',
      'Trazabilidad de fuentes',
      'Buenas prácticas con IA',
    ],
  },
  {
    date: '2026-10-28',
    day: 'Miércoles',
    week: 4,
    topic: 'IA generativa para análisis de datos',
    details: [
      'Herramientas y flujos de trabajo para análisis con IA',
      'Declaración de uso de IA',
    ],
    proyecto: 'Entrega 1: Propuesta de Valor',
  },
  {
    date: '2026-11-04',
    day: 'Miércoles',
    week: 5,
    topic: 'Presupuestos y uso de laboratorio',
    details: [
      'Plantilla de presupuesto',
      'Normas y seguridad del laboratorio',
      'Recursos y consideraciones logísticas',
    ],
  },
  {
    date: '2026-11-11',
    day: 'Miércoles',
    week: 6,
    topic: 'Taller de ética en investigación',
    details: [
      'Casos y discusión',
      'Checklist de integridad',
      'Evaluación del nivel de riesgo',
    ],
    proyecto: 'Entrega 2: Flujograma y prototipo en papel',
  },
  {
    date: '2026-11-18',
    day: 'Miércoles',
    week: 7,
    topic: 'Narrativas visuales para presentación de datos',
    details: [
      'Principios de visualización',
      'Comunicación efectiva de resultados',
    ],
  },
  {
    date: '2026-11-25',
    day: 'Miércoles',
    week: 8,
    topic: 'Revisión de carpeta',
    details: [
      'Revisión integral del proyecto',
      'Ajustes finales con el mentor',
    ],
    proyecto: 'Entrega final: Propuesta Final',
  },
];

export const seminario202620Course: Course = {
  slug: 'iqya-3050-2026-20',
  code: 'IQYA-3050',
  title: 'Seminario de Proyecto de Desarrollo Profesional',
  term: '2026-20 · Periodo 8B',
  accent: 'naranja',
  credits: 1,
  modality: 'Presencial',
  duration: '8 sesiones',
  tagline: 'Ocho miércoles para pasar de un reto propuesto a una propuesta que su asesor pueda firmar',
  description:
    'El Seminario de Proyecto de Desarrollo Profesional (SPDP) es el primer curso de una serie de dos. Aquí los estudiantes, junto con un mentor, diseñan el reto de innovación o la pregunta de investigación que desarrollarán durante el semestre 2027-10. A lo largo de 8 sesiones se construyen progresivamente tres entregas: la propuesta de valor, el flujograma del proceso y la propuesta final completa — con avales del mentor, presupuesto, consideraciones éticas y evaluación de riesgo.',
  accessCode: 'SPDP202620',
  bannerUrl: '/classroom/iqya-3050-2026-20/banner.jpg',
  challenges: {
    label: '¿Qué retos hay para este semestre?',
    term: '2027-10',
  },
  pillars: [
    {
      title: 'Diseño',
      description:
        'Sistematizar la construcción de la propuesta desde el valor hasta el plan ejecutable: valor → flujograma → propuesta final.',
    },
    {
      title: 'Mentoría',
      description:
        'Cada entrega se construye con y se valida por el mentor asignado. La firma digital del mentor respalda cada avance.',
    },
    {
      title: 'Ética',
      description:
        'Certificado de Ética de la Investigación obligatorio, autoevaluación ética y determinación del nivel de riesgo del proyecto.',
    },
  ],
  team: [
    {
      name: 'Luis H. Reyes',
      role: 'Profesor',
      email: 'lh.reyes@uniandes.edu.co',
      officeHours:
        'Viernes 8:00 am – 12:00 m, con cita previa vía correo electrónico',
    },
  ],
  schedule: [
    { label: 'Sesión semanal', detail: 'Miércoles 12:30 pm – 1:50 pm · Grupo 1' },
    { label: 'Salón', detail: 'AU-107 · Edificio Aulas · Campus principal' },
    { label: 'Atención a estudiantes', detail: 'Viernes 8:00 am – 12:00 m · Cita previa por correo' },
  ],
  objectives: [
    'Integrar creatividad e innovación en el desarrollo de prototipos de baja resolución, identificando oportunidades en el diseño de productos y procesos en contextos reales.',
    'Colaborar en el diseño e implementación de soluciones a problemas específicos de ingeniería junto a colegas.',
    'Aplicar elementos clave de la gestión de proyectos, incluyendo la búsqueda efectiva de información y la toma de decisiones acertadas.',
  ],
  methodology: {
    summary:
      'El curso se desarrolla a través de tres entregas principales — propuesta de valor, flujograma y propuesta final — que guían el proceso de diseño del proyecto que el equipo ejecutará el siguiente semestre. Cada entrega requiere la firma digital del mentor asignado.',
    phases: [
      {
        label: 'Entrega 1',
        title: 'Propuesta de valor',
        items: [
          'Nombre y tipo de proyecto (investigación/innovación)',
          'Público objetivo y problema identificado',
          'Solución propuesta y diferenciadores',
          'Justificación de la relevancia',
        ],
      },
      {
        label: 'Entrega 2',
        title: 'Flujograma y prototipo en papel',
        items: [
          'Representación visual del proceso completo',
          'Etapas y puntos de decisión identificados',
          'Uso de simbología estándar de flujograma',
          'Secuencia lógica del proceso',
        ],
      },
      {
        label: 'Entrega 3',
        title: 'Propuesta final',
        items: [
          'Contexto, reto y propuesta de valor refinada',
          'Objetivos (general y específicos) y diseño experimental (Plan A y Plan B)',
          'Presupuesto, uso de laboratorios y consideraciones de seguridad',
          'Aspectos éticos, nivel de riesgo y certificado de Ética de la Investigación',
          'Aval del mentor sobre la propuesta realizada',
        ],
      },
    ],
  },
  modules: [
    {
      title: 'Módulo 1 · Ideación y equipos',
      topics: [
        'Presentación del curso y de los retos disponibles.',
        'Criterios de selección de reto.',
        'Conformación de equipos de trabajo.',
        'Primer contacto con el mentor.',
      ],
    },
    {
      title: 'Módulo 2 · IA generativa en el proyecto',
      topics: [
        'IA para búsqueda y síntesis bibliográfica.',
        'Trazabilidad de fuentes y buenas prácticas.',
        'IA para análisis de datos y declaración de uso.',
      ],
    },
    {
      title: 'Módulo 3 · Planeación ejecutiva',
      topics: [
        'Presupuesto del proyecto.',
        'Normas y seguridad del laboratorio.',
        'Taller de ética en investigación.',
        'Determinación del nivel de riesgo.',
      ],
    },
    {
      title: 'Módulo 4 · Comunicación y cierre',
      topics: [
        'Narrativas visuales para presentación de datos.',
        'Revisión integral de la carpeta del proyecto.',
        'Aval final del mentor.',
      ],
    },
  ],
  evaluation: [
    { component: 'Primera entrega', percentage: 30, description: 'Propuesta de valor · Aprobado/Reprobado.' },
    { component: 'Segunda entrega', percentage: 30, description: 'Flujograma y prototipo en papel · Aprobado/Reprobado.' },
    { component: 'Entrega final', percentage: 40, description: 'Propuesta completa con aval del mentor · Aprobado/Reprobado.' },
  ],
  aias: {
    intro:
      'El curso utiliza la Escala de Evaluación de Inteligencia Artificial (AIAS) para integrar éticamente las herramientas de IA en el aprendizaje. Cada actividad indica explícitamente el nivel permitido.',
    levels: [
      { level: 1, title: 'Sin IA', description: 'No se permite uso de IA.', application: 'Quices semanales.' },
      { level: 2, title: 'IA para ideas', description: 'IA para generar ideas y estructurar.', application: 'Talleres en clase.' },
      { level: 3, title: 'IA para edición', description: 'IA para refinar y mejorar claridad.', application: 'Bitácoras de cálculo, proyecto.' },
      { level: 4, title: 'IA con evaluación', description: 'IA para tareas con evaluación crítica.', application: 'No aplica en este curso.' },
      { level: 5, title: 'Uso completo', description: 'IA integral a discreción.', application: 'No aplica en este curso.' },
    ],
    goals: [
      'Desarrollar competencias digitales y literacidad en IA.',
      'Fomentar pensamiento crítico sobre resultados generados por IA.',
      'Preparar para el uso responsable de tecnologías emergentes.',
      'Mantener la integridad académica.',
    ],
    declaration: [
      'Herramientas utilizadas.',
      'Propósito del uso.',
      'Cómo evaluaron críticamente los resultados.',
    ],
  },
  policies: [
    {
      category: 'Asistencia',
      items: [
        'La asistencia a las sesiones es obligatoria.',
        'Ausencias justificadas deben reportarse con anticipación.',
      ],
    },
    {
      category: 'Entregas',
      items: [
        'Todas las entregas se realizan a través de Bloque Neón.',
        'No se aceptan entregas tardías (penalización del 100%).',
        'Las entregas deben estar firmadas digital o físicamente por el mentor.',
      ],
    },
    {
      category: 'Comunicación',
      items: [
        'Correo del curso: lh.reyes@uniandes.edu.co.',
        'El asunto del correo debe incluir: [IQYA-3050] – Tema.',
        'Tiempo de respuesta: 48 horas hábiles.',
        'Si no se siguen estas reglas, el correo no será respondido oportunamente.',
      ],
    },
    {
      category: 'Integridad académica',
      items: [
        'Todo trabajo debe ser original.',
        'Las fuentes deben citarse apropiadamente (IEEE o APA).',
        'Citas obligatorias para toda fuente consultada.',
        'Declaración de uso de IA en cada entrega.',
        'El plagio resulta en nota de 0 y reporte al comité disciplinario.',
      ],
    },
  ],
  community: [
    {
      category: 'Política de retiros',
      items: [
        'La fecha límite para retirarse corresponde a la establecida por la universidad para el periodo 8B.',
        'Para esa fecha se habrá publicado un porcentaje significativo de las calificaciones, permitiendo una decisión informada.',
      ],
    },
    {
      category: 'Protocolo MAAD',
      items: [
        'Línea MAAD: lineamaad@uniandes.edu.co',
        'Ombudsperson: ombudsperson@uniandes.edu.co',
        'Decanatura de Estudiantes: centrodeapoyo@uniandes.edu.co',
        'Red PACA: paca@uniandes.edu.co',
        'CEU: comiteacosoceu@uniandes.edu.co',
      ],
    },
    {
      category: 'Nombre identitario',
      items: [
        'Los estudiantes pueden solicitar ser identificados con el nombre y pronombres de su elección.',
        'Para modificar el nombre en el sistema universitario: cade@uniandes.edu.co.',
      ],
    },
    {
      category: 'Ajustes razonables para estudiantes con discapacidad',
      items: [
        'Informe al profesor en las primeras dos semanas.',
        'Los ajustes se implementarán confidencialmente.',
        'Objetivo: facilitar la experiencia educativa en igualdad de condiciones.',
      ],
    },
    {
      category: 'Compromiso con la diversidad',
      items: [
        'Valoramos la diversidad, promovemos el respeto mutuo y creamos un ambiente de aprendizaje inclusivo y seguro para todos.',
      ],
    },
  ],
  // Material: los documentos y las presentaciones viven en spdp-material-2026-20.ts
  // (generado desde la carpeta del curso) y los pinta SpdpMaterialPage. Aquí
  // quedan los documentos como `readings` para que el resto del Aula (conteos,
  // visor genérico) los vea. Las siete presentaciones HTML de 2026-10 que estaban
  // aquí se quitaron: siguen en el curso archivado (iqya-3050).
  readings: spdpDocumentos.map((d, i) => ({
    slug: d.id,
    title: d.titulo,
    summary: d.descripcion,
    date: '2026-10-07',
    category: 'guia' as const,
    order: i + 1,
    href: d.archivo,
  })),
  // Las presentaciones son PDF y las pinta SpdpMaterialPage desde spdp-material-2026-20.ts.
  // Se repiten aquí para que la tarjeta del Aula las cuente. La página genérica
  // arma /classroom/{slug}/slides/{file}; con '../presentaciones/' el enlace
  // resuelve al PDF real.
  presentations: spdpPresentaciones.map((p) => ({
    id: `sesion-${p.sesion}`,
    title: p.titulo,
    sessionNumber: p.sesion,
    week: p.sesion,
    file: `../presentaciones/${p.archivo.split('/').pop()}`,
  })),
  cronograma: seminarioCronograma,
};
