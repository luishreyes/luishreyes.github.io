import type { Course } from '../classroom';

// ── Narrativas Visuales de Datos IAgen · semestre 2026-20 ──────────
// Electivo de 2 créditos. Integra los DOS libros de Cole Nussbaumer Knaflic:
//   · Storytelling with Data (2015)  → fundamentos de narrativa visual  (M1–M4)
//   · Storytelling with You  (2022)  → planificar/crear/entregar        (M5–M8)
// Columna narrativa propuesta por Óscar Álvarez: apertura corta de ~30 min al
// inicio de cada módulo («Mostrar, no contar» en la 1.ª mitad, «Narrativas
// contigo» en la 2.ª) + dos talleres integradores (M4 y M8). El acento violeta
// lo aplica `.accent-violet` (ver index.css). El syllabus completo vive como
// guía HTML autocontenida en /classroom/iqya-3751-2026-20/programa.html.
export const narrativas202620Course: Course = {
  slug: 'iqya-3751-2026-20',
  code: 'IQYA-3751',
  title: 'Narrativas Visuales de Datos IAgen',
  term: '2026-20',
  accent: 'citron',
  credits: 2,
  modality: 'Presencial',
  duration: '16 semanas',
  tagline:
    'De mostrar datos a contar historias centradas en el usuario, con IA generativa como copiloto.',
  description:
    'Aprende a transformar datos técnicos en historias visuales que impulsan decisiones — y a traducirlas en narrativas centradas en la experiencia de usuario y la propuesta de valor. El curso integra los dos libros de Cole Nussbaumer Knaflic: Storytelling with Data (fundamentos de narrativa visual, primera mitad) y Storytelling with You (planificar, crear y entregar una presentación estelar, segunda mitad), con IA generativa (Google AI Studio, Claude, ChatGPT) como copiloto bajo un enfoque human-in-the-loop. Cada módulo abre con un espacio corto de «mostrar, no contar», y la ética en la comunicación de datos es un hilo conductor permanente. La evaluación es un portafolio acumulativo, sin exámenes.',
  accessCode: 'NARRATIVAS202620',
  bannerUrl: '/classroom/iqya-3751-2026-20/banner.jpg',

  team: [
    {
      name: 'Luis H. Reyes',
      role: 'Profesor',
      email: 'lh.reyes@uniandes.edu.co',
    },
    {
      name: 'Óscar Álvarez',
      role: 'Profesor',
      email: 'oalvarez@uniandes.edu.co',
    },
  ],

  schedule: [
    { label: 'Sesión semanal', detail: 'Jueves · 9:00 – 10:50 a.m. · Grupo 2' },
    { label: 'Modalidad', detail: 'Presencial' },
    { label: 'Duración', detail: '16 semanas (calendario 2026-20)' },
  ],

  objectives: [
    'Aplicar un marco de pensamiento analítico (decisión, evidencia, datos) antes de abrir cualquier herramienta de visualización.',
    'Seleccionar y justificar el tipo de visualización según la pregunta que se quiere responder y la audiencia a la que se dirige.',
    'Aplicar principios de diseño visual (Gestalt, jerarquía, color, tipografía, accesibilidad) para dirigir la atención del lector.',
    'Construir narrativas de datos con estructura argumental clara (situación, complicación, resolución) para audiencias técnicas y no técnicas.',
    'Traducir datos en narrativas centradas en la experiencia de usuario y la propuesta de valor, mostrando cómo se comportaría un producto en contexto.',
    'Usar IA generativa con criterio para acelerar la generación de código, el prototipado y los artefactos interactivos, manteniendo el juicio crítico (human-in-the-loop).',
    'Reunir un portafolio profesional de visualizaciones y narrativas, y entregarlo en una presentación estelar (planificar, crear, entregar).',
  ],

  methodology: {
    summary:
      'Cada sesión de 110 minutos abre con un espacio narrativo corto (~30 min) que reencuadra el concepto del día desde la experiencia de usuario, y continúa con práctica activa intensiva. El trabajo alterna formatos análogos (papel, marcadores, storyboards), dinámicas colaborativas (1-2-4 y coevaluación) y trabajo con IA generativa. La columna narrativa recorre el curso en dos mitades: «Mostrar, no contar» (módulos 1-4) y «Narrativas contigo: planificar, crear, entregar» (módulos 5-8).',
    phases: [
      {
        label: 'Principio',
        title: 'Pensar antes de ejecutar',
        items: [
          'Antes de abrir cualquier herramienta, el estudiante reflexiona sobre el contexto, la audiencia y el mensaje.',
          'Muchas actividades comienzan de forma análoga, con papel y marcadores.',
        ],
      },
      {
        label: 'Principio',
        title: 'Mostrar, no contar: la narrativa como columna',
        items: [
          'Cada módulo abre con un espacio corto de narrativa centrado en la experiencia de usuario.',
          'Primera mitad: por qué funcionan las historias, narrativa en UX, cómo construirlas (Storytelling with Data).',
          'Segunda mitad: planificar, crear y entregar una presentación estelar (Storytelling with You).',
        ],
      },
      {
        label: 'Principio',
        title: 'Iteración crítica entre pares',
        items: [
          'Los estudiantes revisan y mejoran el trabajo de sus compañeros con la dinámica 1-2-4 (individual, en parejas, en grupo de cuatro).',
          'Rúbricas simplificadas y coevaluación en cada entregable.',
        ],
      },
      {
        label: 'Principio',
        title: 'La IA como herramienta, no como reemplazo',
        items: [
          'La IA generativa acelera la ejecución técnica; el estudiante mantiene el control estratégico.',
          'Se introduce después de trabajar el concepto, bajo un flujo human-in-the-loop.',
        ],
      },
      {
        label: 'Principio',
        title: 'La ética como hilo conductor',
        items: [
          'La responsabilidad en la comunicación visual se aborda en cada módulo.',
          'Comienza en la sesión 1 (engaño visual) y se refuerza hasta los sesgos de la IA en el módulo 6.',
        ],
      },
    ],
    synergies: [
      'Dos libros, dos mitades: Storytelling with Data ancla los módulos 1-4; Storytelling with You ancla los módulos 5-8.',
      'La apertura narrativa reencuadra el bloque conceptual: no añade tiempo, lo enfoca.',
      'Los datos técnicos se vuelven el insumo de historias de producto y de usuario (propuesta de valor), como en Proyecto Integrado.',
      'La IA acelera la ejecución mientras el estudiante mantiene el control estratégico (human-in-the-loop).',
      'La ética acompaña cada módulo, de los ejes truncados a los sesgos de la IA.',
    ],
  },

  modules: [
    {
      title: 'Módulo 1 · El contexto lo es todo (y la ética también)',
      topics: [
        'Apertura «Mostrar, no contar»: por qué y cómo funcionan las historias; el usuario como protagonista.',
        'Las tres preguntas: ¿a quién hablo?, ¿qué necesita saber?, ¿qué decisión se va a tomar?',
        'Audiencia y contexto comunicativo.',
        'Reconocer el engaño visual: ejes truncados, escalas manipuladas, cherry-picking de datos.',
        'Taller análogo de crítica con dinámica 1-2-4 sobre gráficos impresos.',
      ],
    },
    {
      title: 'Módulo 2 · Eligiendo el visual correcto + IA generativa',
      topics: [
        'Apertura «Mostrar, no contar»: la narrativa en los procesos de experiencia de usuario y la propuesta de valor.',
        'Tipos de gráfico y cuándo usar cada uno; ejercicio en papel.',
        'Introducción a la IA generativa, prompting y flujo human-in-the-loop.',
        'Prototipado de visualizaciones con IA.',
      ],
    },
    {
      title: 'Módulo 3 · Menos es más',
      topics: [
        'Apertura «Mostrar, no contar»: cómo construir y contar la historia (quitar ruido = aclarar el relato).',
        'Gestalt, carga cognitiva y atributos preatentivos.',
        'Taller de decluttering y ejecución digital con IA.',
        'Cómo el ruido visual puede ocultar o distorsionar información crítica (ética).',
      ],
    },
    {
      title: 'Módulo 4 · Pensar como diseñador + Taller integrador de narrativa',
      topics: [
        'Taller integrador (2 h): construcción de una narrativa visual de propuesta de valor (storyboard de experiencia de usuario).',
        'Color con propósito, tipografía y jerarquía.',
        'Accesibilidad: daltonismo, contraste, WCAG y legibilidad como responsabilidad profesional.',
        'Artefactos React interactivos con IA.',
      ],
    },
    {
      title: 'Módulo 5 · La narrativa detrás de los datos — «Narrativas contigo: planificar»',
      topics: [
        'Apertura «Narrativas contigo · Planificar»: audiencia, gran idea y storyboard (Storytelling with You).',
        'Estructura argumental, títulos activos y framing ético.',
        'Storyboard de la historia de datos.',
        'Ejecución digital de la narrativa.',
      ],
    },
    {
      title: 'Módulo 6 · Flujo human-in-the-loop completo — «Narrativas contigo: crear»',
      topics: [
        'Apertura «Narrativas contigo · Crear»: crear los artefactos de la historia con IA (Storytelling with You).',
        'Flujo HITL de cinco etapas y prompts avanzados.',
        'Laboratorio en Google Colab (pandas, matplotlib, plotly, seaborn) con LLM.',
        'Pensamiento crítico y sesgos de la IA.',
      ],
    },
    {
      title: 'Módulo 7 · Dashboards efectivos — «Narrativas contigo: entregar»',
      topics: [
        'Apertura «Narrativas contigo · Entregar»: cómo se entrega la historia a la audiencia (Storytelling with You).',
        'Jerarquía, flujo de lectura e interactividad del dashboard.',
        'Casos de estudio.',
        'Taller de dashboard y coevaluación del borrador.',
      ],
    },
    {
      title: 'Módulo 8 · Presentación estelar',
      topics: [
        'Taller integrador: armar toda la historia hacia una «presentación estelar» (planificar, crear, entregar).',
        'Pulido del portafolio y ensayo de las presentaciones.',
        'Presentaciones del portafolio ante la clase.',
        'Reflexión final.',
      ],
    },
  ],

  evaluation: [
    { component: 'Pieza 1 · Selección y justificación de visualizaciones', percentage: 10, description: 'Individual · Sesión 4 (Ago 27).' },
    { component: 'Pieza 2 · Transformación antes y después (decluttering)', percentage: 10, description: 'Individual · Sesión 6 (Sep 10).' },
    { component: 'Pieza 3 · Visualización interactiva con diseño intencional', percentage: 12, description: 'Individual · Sesión 8 (Sep 24).' },
    { component: 'Pieza 4 · Data story narrativo (centrado en el usuario)', percentage: 15, description: 'Individual · Sesión 10 (Oct 15).' },
    { component: 'Pieza 5 · Notebook human-in-the-loop documentado', percentage: 13, description: 'Individual · Sesión 12 (Oct 29).' },
    { component: 'Pieza 6 · Dashboard interactivo integrador', percentage: 15, description: 'Individual o en equipo · Sesión 14 (Nov 12).' },
    { component: 'Presentación estelar del portafolio', percentage: 15, description: 'Individual · Sesión 16 (Nov 26).' },
    { component: 'Participación y retroalimentación entre pares', percentage: 10, description: 'Individual · Sesiones 1 a 16.' },
  ],

  aias: {
    intro:
      'El curso utiliza la Escala de Evaluación de Inteligencia Artificial (AIAS) para integrar éticamente las herramientas de IA. Aquí la IA generativa es parte integral de la metodología: los conceptos de IA, prompt engineering y flujo human-in-the-loop se introducen en el módulo 2, antes de usar las herramientas. Cada actividad indica el nivel permitido; el objetivo es desarrollar criterio sobre lo que la herramienta produce, no delegar el pensamiento en ella.',
    levels: [
      { level: 1, title: 'Sin IA', description: 'Trabajo análogo y conceptual, sin IA.', application: 'Crítica en papel, storyboards a mano, reflexiones.' },
      { level: 2, title: 'IA para ideas', description: 'IA para generar ideas y estructurar.', application: 'Brainstorming de enfoques y narrativas.' },
      { level: 3, title: 'IA para edición', description: 'IA para refinar y mejorar la claridad.', application: 'Pulido de visualizaciones, títulos y copy.' },
      { level: 4, title: 'IA con evaluación crítica', description: 'IA para generar código y artefactos, con evaluación crítica del resultado.', application: 'Visualizaciones en Python y artefactos React.' },
      { level: 5, title: 'Uso completo (HITL)', description: 'Flujo human-in-the-loop completo, documentado y evaluado.', application: 'Notebook HITL y dashboard integrador.' },
    ],
    goals: [
      'Desarrollar competencias digitales y literacidad en IA.',
      'Fomentar pensamiento crítico sobre los resultados generados por IA y sus sesgos.',
      'Preparar para el uso responsable de tecnologías emergentes.',
      'Mantener la integridad académica.',
    ],
    declaration: [
      'Herramientas utilizadas y prompts en cada pieza del portafolio.',
      'Propósito del uso y las iteraciones realizadas.',
      'Cómo se evaluaron críticamente los resultados (errores, sesgos, decisiones cuestionables).',
    ],
  },

  policies: [
    {
      category: 'Asistencia y participación',
      items: [
        'La asistencia a las sesiones es obligatoria; el curso es presencial e intensivo en práctica.',
        'La participación y la retroalimentación entre pares hacen parte de la nota (10%).',
      ],
    },
    {
      category: 'Entregas',
      items: [
        'El portafolio se construye de forma acumulativa: cada pieza demuestra el dominio progresivo de los principios del curso.',
        'Cada pieza se evalúa con una rúbrica de tres dimensiones: claridad comunicativa, calidad del diseño visual y pensamiento crítico.',
        'Las rúbricas detalladas se entregan en la sesión 1.',
      ],
    },
    {
      category: 'Política de uso de IA',
      items: [
        'El uso de IA generativa no solo está permitido: es parte del método.',
        'Documentar los prompts y las iteraciones en cada pieza del portafolio.',
        'Evaluar críticamente los resultados, identificando errores, sesgos o decisiones de diseño cuestionables.',
        'La IA propone, el estudiante decide y argumenta: nunca presentar como propio un resultado sin revisarlo, editarlo y mejorarlo.',
      ],
    },
    {
      category: 'Integridad académica',
      items: [
        'Todo trabajo debe ser original del estudiante, con fuentes citadas y declaración de uso de IA.',
        'Esta política se alinea con el reglamento de integridad académica de la Universidad de los Andes.',
        'El plagio resulta en nota de 0 y reporte al comité disciplinario.',
      ],
    },
  ],

  community: [
    {
      category: 'Prerrequisitos',
      items: [
        'No se requieren conocimientos previos de programación ni de diseño gráfico.',
        'Se asume familiaridad básica con hojas de cálculo y una cuenta de Google para las herramientas.',
        'Pensado para semestres avanzados (7.º y 8.º), abierto a niveles intermedios.',
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
      slug: 'programa-del-curso',
      order: 1,
      title: 'Programa del curso',
      summary:
        'El programa completo de IQYA-3751 para 2026-20: horarios y equipo, descripción y metodología (con la columna narrativa de los dos libros de Cole Knaflic), objetivos y resultados de aprendizaje, contenido por módulo, programa por sesiones, evaluación del portafolio, escala AIAS de uso de IA, ética transversal, herramientas y bibliografía.',
      date: '2026-08-06',
      readingMinutes: 12,
      tags: ['programa', 'syllabus', 'logística'],
      category: 'guia',
      href: '/classroom/iqya-3751-2026-20/programa.html',
    },
  ],
  presentations: [],
};
