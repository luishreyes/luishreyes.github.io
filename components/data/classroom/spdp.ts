import type { Course, CronogramaEntry } from '../classroom';

const spdpCronograma: CronogramaEntry[] = [
  {
    date: '2026-03-25',
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
    date: '2026-04-08',
    day: 'Miércoles',
    week: 3,
    topic: 'Formación de equipos',
    details: [
      'Selección de retos',
      'Conformación de equipos de trabajo',
      'Primer contacto con el mentor asignado',
    ],
  },
  {
    date: '2026-04-15',
    day: 'Miércoles',
    week: 4,
    topic: 'IA generativa para investigación',
    details: [
      'Búsqueda y síntesis asistida',
      'Trazabilidad de fuentes',
      'Buenas prácticas con IA',
    ],
  },
  {
    date: '2026-04-22',
    day: 'Miércoles',
    week: 5,
    topic: 'IA generativa para análisis de datos',
    details: [
      'Herramientas y flujos de trabajo para análisis con IA',
      'Declaración de uso de IA',
    ],
    proyecto: 'Entrega 1: Propuesta de Valor',
  },
  {
    date: '2026-04-29',
    day: 'Miércoles',
    week: 6,
    topic: 'Presupuestos y uso de laboratorio',
    details: [
      'Plantilla de presupuesto',
      'Normas y seguridad del laboratorio',
      'Recursos y consideraciones logísticas',
    ],
  },
  {
    date: '2026-05-06',
    day: 'Miércoles',
    week: 7,
    topic: 'Taller de ética en investigación',
    details: [
      'Casos y discusión',
      'Checklist de integridad',
      'Evaluación del nivel de riesgo',
    ],
    proyecto: 'Entrega 2: Flujograma y prototipo en papel',
  },
  {
    date: '2026-05-13',
    day: 'Miércoles',
    week: 8,
    topic: 'Narrativas visuales para presentación de datos',
    details: [
      'Principios de visualización',
      'Comunicación efectiva de resultados',
    ],
  },
  {
    date: '2026-05-20',
    day: 'Miércoles',
    week: 9,
    topic: 'Revisión de carpeta',
    details: [
      'Revisión integral del proyecto',
      'Ajustes finales con el mentor',
    ],
    proyecto: 'Entrega final: Propuesta Final',
  },
];

export const spdpCourse: Course = {
  slug: 'iqya-3050',
  code: 'IQYA-3050',
  title: 'Seminario de Proyecto de Desarrollo Profesional',
  term: '2026-10 · Periodo 8B',
  credits: 1,
  modality: 'Presencial',
  duration: '8 sesiones',
  tagline: 'Diseñar en 8 sesiones el proyecto que ejecutarás el próximo semestre',
  description:
    'El Seminario de Proyecto de Desarrollo Profesional (SPDP) es el primer curso de una serie de dos. Aquí los estudiantes, junto con un mentor, diseñan el reto de innovación o la pregunta de investigación que desarrollarán durante el semestre 2026-20. A lo largo de 8 sesiones se construyen progresivamente tres entregas: la propuesta de valor, el flujograma del proceso y la propuesta final completa — con avales del mentor, presupuesto, consideraciones éticas y evaluación de riesgo.',
  accessCode: 'SPDP202610',
  bannerUrl: '/classroom/iqya-3050/banner.jpg',
  challenges: {
    label: '¿Qué retos hay para este semestre?',
    term: '2026-20',
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
    { label: 'Sesión semanal', detail: 'Miércoles 12:30 pm – 1:50 pm · C-209' },
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
        'Informa al profesor en las primeras dos semanas.',
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
  readings: [
    {
      slug: 'propuesta-valor',
      title: 'Propuesta de valor',
      summary:
        'Guía para desarrollar la propuesta de valor del proyecto de desarrollo profesional: dos esquemas (proyecto de desarrollo y proyecto de innovación) con ejemplos completos (EcoFilter, ChemFoodLab), campo a campo, proceso de redacción y pasos de entrega firmada por el asesor.',
      date: '2026-02-05',
      readingMinutes: 15,
      tags: ['propuesta', 'proyecto', 'entregable'],
      category: 'guia',
    },
    {
      slug: 'flujogramas',
      title: 'Flujogramas en el desarrollo de proyectos',
      summary:
        'Guía sobre qué es un flujograma, sus características, tipos (lineal vertical/horizontal/panorámico, matricial), símbolos estándar (terminales, proceso, decisión, entrada, salida, conectores), los cuatro pasos para construirlo y herramientas recomendadas (draw.io, Lucidchart, Miro, Canva).',
      date: '2026-02-12',
      readingMinutes: 18,
      tags: ['flujograma', 'proceso', 'diseño', 'entregable'],
      category: 'guia',
    },
  ],
  presentations: [
    {
      id: 'clase-01-bienvenida',
      title: 'Bienvenida y presentación de retos',
      description:
        'Presentación del curso: objetivos, metodología de las tres entregas, cronograma, evaluación Aprobado/Reprobado, escala AIAS y listado completo de los 26 retos propuestos por los 11 asesores del departamento.',
      date: '2026-03-25',
      sessionNumber: 1,
      file: 'clase-01-bienvenida.html',
    },
    {
      id: 'clase-03-ia-investigacion',
      title: 'IA generativa para investigación',
      description:
        'Framework de decisión estratégica para elegir la herramienta correcta según el tipo de pregunta (conceptual, empírica, metodológica, contextual). Revisión de ChatGPT/Claude, Perplexity, SciSpace/Consensus, Google Scholar/WoS, NotebookLM y Deep Research, con matriz de decisión y flujo de trabajo recomendado.',
      date: '2026-04-15',
      sessionNumber: 3,
      file: 'clase-03-ia-investigacion.html',
    },
    {
      id: 'clase-04-ia-datos',
      title: 'IA generativa para análisis de datos',
      description:
        'Enfoque human-in-the-loop para analítica moderna: datos estructurados vs. no estructurados, por qué los LLM cierran la brecha de habilidades, formatos de representación (CSV, JSON, YAML), flujo de 5 etapas (Diagnóstico → Ideación → Alineación → Navegación → Evolución), roles clave (IA · humano · colaboración) y demostración con tres prompts (EDA, plan y ejecución).',
      date: '2026-04-22',
      sessionNumber: 4,
      file: 'clase-04-ia-datos.html',
    },
    {
      id: 'clase-05a-presupuestos',
      title: 'Presupuesto pregrado y posgrados',
      description:
        'Gestión del presupuesto del proyecto: montos asignados por programa, compra de reactivos y sustancias químicas, equipos de laboratorio, alimentos perecederos, otros suministros, servicios especializados (Ing. Mecánica, Centro de Microscopía, DSIT), gases especiales, restricciones y proceso de solicitud de compras.',
      date: '2026-04-29',
      sessionNumber: 5,
      file: 'clase-05a-presupuestos.html',
    },
    {
      id: 'clase-05b-laboratorios',
      title: 'Laboratorios',
      description:
        'Uso correcto de laboratorios del departamento: sistema BooQui para reservas y formato PES, cursos virtuales y charlas obligatorias, gestión de material roto, categorías de reservas ML 416 / ML 418, inventario de sustancias químicas, directriz para montajes, reglamentos clave, horario no hábil, compras externas y proveedores autorizados.',
      date: '2026-04-29',
      sessionNumber: 5,
      file: 'clase-05b-laboratorios.html',
    },
    {
      id: 'clase-06-etica',
      title: 'Ética en investigación',
      description:
        'Principios fundamentales (Belmont: respeto, beneficencia, justicia), casos históricos (Tuskegee), marco normativo en Colombia (Resolución 8430 de 1993), Comité de Ética de la Facultad de Ingeniería, clasificación de riesgo por autoclasificación (preguntas 1.1–1.5 · conflicto de interés), ejemplos prácticos sin riesgo / mínimo / mayor al mínimo, consentimiento y asentimiento informado, proceso de solicitud y lista de chequeo.',
      date: '2026-05-06',
      sessionNumber: 6,
      file: 'clase-06-etica.html',
    },
    {
      id: 'clase-07-narrativas-visuales',
      title: 'Narrativas visuales para presentación de datos',
      description:
        'Data storytelling y los 5 principios de diseño visual (tipo de gráfica, ratio datos-tinta, jerarquía visual, color con propósito y títulos argumentativos). Cuarteto de Anscombe, makeovers de "antes y después", paletas cualitativa/secuencial/divergente, estructura Situación-Complicación-Resolución, herramientas (Excel, Python, IA generativa) y talleres prácticos. Todas las gráficas están renderizadas directamente en SVG dentro del slide.',
      date: '2026-05-13',
      sessionNumber: 7,
      file: 'clase-07-narrativas-visuales.html',
    },
  ],
  cronograma: spdpCronograma,
};
