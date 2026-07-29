import type { Course } from '../classroom';

// ── POU · semestre 2026-20 ──────────────────────────────────────
// Proyecto del semestre: planta de pectina de grado alimentario a partir
// de cáscara de cítricos o maracuyá (residuo agroindustrial colombiano).
export const pou202620Course: Course = {
  slug: 'iqya-2031-2026-20',
  code: 'IQYA-2031',
  title: 'Proyecto de Operaciones Unitarias',
  term: '2026-20',
  credits: 3,
  modality: 'Presencial',
  duration: '16 semanas',
  accent: 'acero',
  tagline: 'Diseñe y dimensione una planta de pectina a partir de cáscara de fruta colombiana',
  description:
    'En este curso diseñará, dimensionará y simulará una planta completa de producción de pectina de grado alimentario a partir de cáscara de cítricos o maracuyá, un residuo agroindustrial colombiano. Bajo el enfoque de Diseño Integrado de Productos y Procesos, cada semana aplica lo aprendido directamente en su proyecto: manejo de sólidos, transporte de fluidos, agitación, intercambio de calor, filtración y la columna que recupera el etanol de precipitación. El modelo es híbrido: aula invertida con lecturas previas, quices al iniciar clase, talleres prácticos en parejas y trabajo autónomo en equipos de 4-5 personas a lo largo de las 16 semanas.',
  accessCode: 'POU202620',
  bannerUrl: '/classroom/iqya-2031-2026-20/banner.jpg',
  pillars: [
    {
      title: 'Creatividad',
      description:
        'Motor de la identificación de oportunidades y la generación de ideas.',
    },
    {
      title: 'Innovación',
      description:
        'Desarrollo ágil de prototipos viables, aplicando un enfoque multiescala.',
    },
    {
      title: 'Emprendimiento',
      description:
        'Desde el diseño del modelo de negocio hasta el desarrollo de la planta de producción.',
    },
  ],
  team: [
    {
      name: 'Luis H. Reyes',
      role: 'Profesor',
      email: 'lh.reyes@uniandes.edu.co',
      officeHours:
        'Viernes 8 a.m. a 12 m., con cita previa por correo electrónico',
    },
    {
      name: 'Andrés F. Infante',
      role: 'Asistente',
      email: 'af.infante@uniandes.edu.co',
    },
    {
      name: 'Dana Catalina Mora',
      role: 'Monitora',
      email: 'dc.morat1@uniandes.edu.co',
    },
  ],
  schedule: [
    { label: 'Magistral', detail: 'Martes 11:00 a.m. - 12:20 p.m. · Salón según BloqueNeón' },
    { label: 'Magistral', detail: 'Jueves 11:00 a.m. - 12:20 p.m. · Salón según BloqueNeón' },
  ],
  objectives: [
    'Diseñar y dimensionar las operaciones unitarias de un proceso químico completo, que abarca el manejo de sólidos, el transporte de fluidos y la separación final por destilación.',
    'Elaborar e interpretar diagramas de ingeniería profesionales (PBD, PFD, P&ID) según estándares industriales.',
    'Calcular y especificar equipos de proceso con criterios técnicos, económicos y de sostenibilidad.',
    'Simular procesos completos en ASPEN Plus y validar con ellos los cálculos manuales.',
    'Documentar el diseño en bitácoras de cálculo profesionales y reportes ejecutivos.',
    'Trabajar en equipo, gestionando el tiempo y los recursos con eficacia.',
    'Aplicar pensamiento crítico al elegir alternativas de diseño y resolver problemas.',
    'Comunicar resultados técnicos a audiencias distintas mediante informes y presentaciones.',
  ],
  methodology: {
    summary:
      'Modelo híbrido Project Oriented-Problem Based Learning (PO-PBL) + aula invertida. Durante todo el semestre su equipo desarrolla un proyecto real: el diseño completo de una planta de producción de pectina de grado alimentario a partir de cáscaras de fruta colombianas. El proyecto da contexto a cada tema, que llega justo cuando su equipo lo va a usar.',
    phases: [
      {
        label: 'Antes (3 h semanales)',
        title: 'Preparación individual',
        items: [
          'Lectura que el profesor prepara para cada tema.',
          'Material audiovisual complementario.',
          'Llegar a clase con una comprensión básica del tema.',
        ],
      },
      {
        label: 'Durante (3 h semanales)',
        title: 'Sesión presencial',
        items: [
          'Quiz individual sobre el material previo.',
          'Charla: profundización, aclaraciones y ejemplos industriales.',
          'Taller en parejas con problemas reales.',
        ],
      },
      {
        label: 'Después (3 h semanales)',
        title: 'Trabajo autónomo',
        items: [
          'Aplicación de los conceptos al diseño de la planta de pectina.',
          'Búsqueda de información en bases de datos técnicas.',
          'Documentación y desarrollo de las bitácoras de cálculo.',
        ],
      },
    ],
    synergies: [
      'El proyecto da contexto al contenido: las lecturas están ligadas al avance del diseño de la planta.',
      'Aprendizaje just-in-time: los temas se presentan cuando se necesitan para el proyecto.',
      'Retroalimentación continua sobre lo teórico y lo práctico.',
      'Desarrollo de autonomía para gestionar el tiempo entre preparación y proyecto.',
      'Simulación del ambiente profesional: aprender y entregar simultáneamente.',
    ],
  },
  abet: {
    peos: [
      'PEO 1: Use chemical engineering principles creatively to design innovative solutions for society\'s problems linked to industry or research centers.',
      'PEO 2: Integrate tools and methods to analyze and design sustainable products and processes at molecular to macroscopic scales by leading professional projects.',
      'PEO 3: Approach engineering challenges and changing environments with respect, empathy, assertiveness, and effective communication in collaborative settings.',
      'PEO 4: Demonstrate a high sense of responsibility, autonomy, breadth of thought, and ethical practice of the profession.',
    ],
    outcomes: [
      {
        title:
          'Identify, formulate, and solve complex engineering problems',
        indicators: [
          '1.1.1 Define el problema de diseño del proceso de extracción de pectina y recuperación de etanol.',
          '1.2.1 Formula modelos matemáticos apropiados para cada operación unitaria.',
          '1.2.2 Resuelve los problemas de diseño y evalúa la viabilidad de las soluciones.',
        ],
      },
      {
        title: 'Apply engineering design to produce solutions',
        indicators: [
          '2.1.1 Identifica las necesidades de diseño dentro del marco del proyecto.',
          '2.1.2 Aplica metodologías de diseño de procesos en cada operación unitaria.',
          '2.2.1 Considera factores económicos, ambientales y de seguridad en el diseño.',
        ],
      },
      {
        title: 'Communicate effectively with a range of audiences',
        indicators: [
          '3.1.1 Comunica ideas técnicas claramente en bitácoras de cálculo.',
          '3.1.2 Redacta informes técnicos siguiendo estándares profesionales.',
          '3.2.1 Presenta efectivamente el proyecto final.',
          '3.3.1 Cita apropiadamente fuentes técnicas y literatura.',
        ],
      },
      {
        title: 'Function effectively on a team',
        indicators: [
          '5.1.1 Demuestra compromiso con el equipo mediante participación activa.',
          '5.1.2 Contribuye significativamente al desarrollo del proyecto.',
          '5.1.3 El equipo entrega productos de calidad esperada.',
          '5.1.4 Se comunica respetuosamente y maneja conflictos constructivamente.',
        ],
      },
      {
        title: 'Acquire and apply new knowledge as needed',
        indicators: [
          '7.1.1 Busca información técnica en bases de datos especializadas.',
          '7.1.2 Utiliza estrategias de aprendizaje para dominar nuevas herramientas.',
          '7.1.3 Aplica conocimientos adquiridos autónomamente al proyecto.',
        ],
      },
    ],
  },
  project: {
    title: 'Planta de producción de pectina de grado alimentario',
    overview:
      'Diseño integral de una planta que aprovecha cáscara de cítricos o maracuyá, un residuo agroindustrial colombiano, para extraer pectina de grado alimentario, dimensionada operación por operación y validada en ASPEN Plus. No es un cálculo aislado: es un sistema, donde la decisión que se toma en la molienda reaparece en el consumo de vapor de la columna.',
    rawMaterials: [
      { name: 'Cáscara de naranja', outcome: 'Fuente clásica · alto rendimiento, pectina de alta esterificación' },
      { name: 'Cáscara de limón o lima', outcome: 'Mayor contenido de pectina · calidad premium para gelificación' },
      { name: 'Cáscara de mandarina o toronja', outcome: 'Variante cítrica de buen rendimiento, según disponibilidad regional' },
      { name: 'Cáscara de maracuyá', outcome: 'Residuo abundante de la industria de jugos · alternativa no cítrica' },
    ],
    scope: [
      'Selección y justificación de la materia prima (humedad, contenido de pectina, volumen regional).',
      'Diseño del proceso de extracción simplificado (hidrólisis ácida, conversión supuesta).',
      'Manejo de sólidos: secado y molienda de la cáscara, con cálculo de potencia del molino.',
      'Sistema completo de transporte de fluidos (agua de proceso, extracto y etanol) con pérdidas y NPSH.',
      'Diseño del agitador del reactor de extracción (impulsor, patrón de flujo, escalado).',
      'Red de intercambiadores de calor (calentamiento, condensador y rehervidor) con integración energética.',
      'Separación sólido-líquido: filtración del bagazo agotado para clarificar el extracto.',
      'Columna de recuperación de etanol por destilación (método McCabe-Thiele).',
    ],
    teamwork: [
      'Grupos fijos de 4-5 personas durante todo el semestre.',
      'Sesiones de retroalimentación programadas con el profesor.',
      'Autoevaluación y coevaluación del desempeño.',
    ],
  },
  modules: [
    {
      title: 'Módulo 1 · Fundamentos y diagramación',
      topics: [
        'Introducción al proyecto y formación de equipos.',
        'Diagramas de ingeniería: PBD, PFD, P&ID.',
        'Simbología y estándares ISA.',
        'Definición del alcance del proyecto.',
      ],
    },
    {
      title: 'Módulo 2 · Manejo de sólidos',
      topics: [
        'Caracterización y propiedades de sólidos.',
        'Distribución de tamaños de partícula.',
        'Teoría y equipos de molienda.',
        'Cálculos de potencia y selección de molinos para la cáscara.',
      ],
    },
    {
      title: 'Módulo 3 · Transporte de fluidos',
      topics: [
        'Ecuación de Bernoulli y aplicaciones (repaso).',
        'Pérdidas mayores y menores en tuberías.',
        'Selección y dimensionamiento de bombas centrífugas.',
        'Curvas características y NPSH.',
      ],
    },
    {
      title: 'Módulo 4 · Agitación y mezclado',
      topics: [
        'Teoría de agitación y tipos de impulsores.',
        'Patrones de flujo y número de potencia.',
        'Criterios de escalado.',
        'Diseño del mezclado del reactor de extracción.',
      ],
    },
    {
      title: 'Módulo 5 · Transferencia de calor',
      topics: [
        'Fundamentos de intercambiadores de calor.',
        'Método LMTD y Efectividad-NTU.',
        'Selección y dimensionamiento.',
        'Integración energética del proceso.',
      ],
    },
    {
      title: 'Módulo 6 · Procesos de filtración',
      topics: [
        'Teoría de filtración.',
        'Diseño de filtros rotatorios y prensa.',
        'Separación del bagazo agotado.',
      ],
    },
    {
      title: 'Módulo 7 · Destilación',
      topics: [
        'Equilibrio líquido-vapor (repaso).',
        'Destilación flash y diferencial.',
        'Método McCabe-Thiele.',
        'Diseño de platos y eficiencias.',
        'Columnas empacadas.',
        'Recuperación del etanol de precipitación.',
      ],
    },
  ],
  evaluation: [
    { component: 'Quices semanales', percentage: 10, description: 'Individual · Comprensión del material previo.' },
    { component: 'Complementarias', percentage: 10, description: 'Variado · Aplicación práctica.' },
    { component: 'Talleres en clase', percentage: 20, description: 'Parejas · Aplicación de conceptos.' },
    { component: 'Bitácoras de cálculo', percentage: 20, description: 'Grupos · 4 entregas durante el semestre.' },
    { component: 'Sustentaciones de seguimiento', percentage: 10, description: 'Grupos · 4 durante el semestre.' },
    { component: 'Proyecto final', percentage: 20, description: 'Grupos · Documento técnico.' },
    { component: 'Presentación final', percentage: 10, description: 'Grupos · Presentación ejecutiva del proyecto.' },
  ],
  deliveries: {
    bitacoras: [
      { label: 'Entrega 1', date: 'Domingo 23 de agosto' },
      { label: 'Entrega 2', date: 'Domingo 20 de septiembre' },
      { label: 'Entrega 3', date: 'Domingo 18 de octubre' },
      { label: 'Entrega 4', date: 'Domingo 22 de noviembre' },
    ],
    coevaluations: [
      { label: 'Coevaluación 1', date: 'Lunes 24 de agosto' },
      { label: 'Coevaluación 2', date: 'Lunes 21 de septiembre' },
      { label: 'Coevaluación 3', date: 'Lunes 19 de octubre' },
      { label: 'Coevaluación 4', date: 'Lunes 23 de noviembre' },
      { label: 'Coevaluación 5', date: 'Finales · documento y pósters' },
    ],
    feedback: [
      { label: 'Retroalimentación 1', date: 'Jueves 27 de agosto' },
      { label: 'Retroalimentación 2', date: 'Jueves 24 de septiembre' },
      { label: 'Retroalimentación 3', date: 'Jueves 22 de octubre' },
      { label: 'Retroalimentación 4', date: 'Martes 24 y jueves 26 de noviembre' },
    ],
  },
  coevaluation: {
    importance: [
      'Componente clave en la evaluación del curso.',
      'Permite reflexionar sobre el aprendizaje y el desempeño.',
      'Desarrolla habilidades de evaluación crítica y autorreflexión.',
      'Fomenta la responsabilidad individual dentro del trabajo en equipo.',
    ],
    application: [
      'Se realiza una coevaluación y autoevaluación dentro de los dos días siguientes a cada entrega relacionada con el proyecto.',
      'En total, 5 evaluaciones durante el semestre (una por bitácora y una tras el documento final y la sustentación de pósters).',
      'Cada estudiante evalúa su desempeño y el de sus compañeros.',
      'Los criterios los establece cada equipo al inicio del semestre.',
    ],
    procedure: [
      'Cada coevaluación afecta únicamente la nota de la entrega correspondiente.',
      'La nota más alta del equipo se toma como 100%.',
      'Las demás notas se ajustan proporcionalmente.',
      'Por cada coevaluación no realizada se descuenta 1.0 punto de esa evaluación.',
    ],
    example: [
      'Nota grupal de la bitácora: 4.2',
      'Estudiante A (mejor coevaluación): 3.5 → 100% → Nota final: 4.2',
      'Estudiante B: 3.0 → 85.7% → Nota final: 3.6',
      'Estudiante C: 3.3 → 94.3% → Nota final: 4.0',
    ],
  },
  aias: {
    intro:
      'El curso utiliza la Escala de Evaluación de Inteligencia Artificial (AIAS) para integrar éticamente las herramientas de IA en el aprendizaje. Cada actividad indica explícitamente el nivel permitido. El objetivo es desarrollar criterio sobre lo que la herramienta produce, no delegar el pensamiento en ella.',
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
        'La asistencia a las sesiones magistrales es obligatoria (control diario).',
        'Los quices se realizan al inicio de clase sin excepción.',
        'No hay supletorio de quices. Con excusa válida, el siguiente quiz vale el doble.',
      ],
    },
    {
      category: 'Entregas',
      items: [
        'Todas las entregas se realizan a través de BloqueNeón.',
        'No se aceptan entregas tardías en quices (penalización del 100%).',
        'Talleres y documento final: -1 unidad por cada 15 minutos de demora.',
        'Las bitácoras y la entrega final deben seguir el formato establecido.',
      ],
    },
    {
      category: 'Comunicación',
      items: [
        'Correo del curso: lh.reyes@uniandes.edu.co, af.infante@uniandes.edu.co, dc.morat1@uniandes.edu.co.',
        'El asunto del correo debe incluir [IQYA-2031] seguido del tema.',
        'Tiempo de respuesta: 48 horas hábiles.',
      ],
    },
    {
      category: 'Trabajo en equipo',
      items: [
        'Los grupos son fijos durante todo el semestre.',
        'Problemas internos se reportan primero al asistente y luego al profesor.',
        'La coevaluación afecta la nota individual del proyecto.',
        'La coevaluación es autónoma; no puede cambiarse bajo ninguna circunstancia.',
      ],
    },
    {
      category: 'Integridad académica',
      items: [
        'Todo trabajo debe ser original del equipo.',
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
        'La fecha límite para retirarse del curso es la semana 11 (19 al 23 de octubre).',
        'Para esa fecha se habrá publicado más del 50% de las calificaciones.',
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
  challenges: {
    label: 'La cáscara que vale más que la fruta',
    term: '2026-20',
    eyebrow: 'Reto del semestre',
    description:
      'Diseñe y dimensione una planta que extrae pectina de grado alimentario a partir de cáscara de fruta colombiana. Abra la guía completa del proyecto.',
    href: '/classroom/iqya-2031-2026-20/reto-pectina.html',
  },
  cronograma: [
    { date: '2026-08-04', day: 'Martes', week: 1, topic: 'Introducción al curso', details: ['Presentación del proyecto', 'Metodología de trabajo', 'Sistema de evaluación'], proyecto: 'Publicación del proyecto del semestre' },
    { date: '2026-08-06', day: 'Jueves', week: 1, topic: 'Equipos de trabajo, matriz de coevaluación y contrato de cumplimiento' },
    { date: '2026-08-11', day: 'Martes', week: 2, topic: 'Diagramas de ingeniería I', quiz: 'Quiz 1' },
    { date: '2026-08-13', day: 'Jueves', week: 2, topic: 'Taller de diagramas', taller: 'Taller 1: diagramas en ingeniería' },
    { date: '2026-08-18', day: 'Martes', week: 3, topic: 'Propiedades de sólidos', quiz: 'Quiz 2' },
    { date: '2026-08-20', day: 'Jueves', week: 3, topic: 'Taller de molienda', taller: 'Taller 2: molienda', proyecto: 'Entrega Bitácora 1: domingo 23 de agosto' },
    { date: '2026-08-25', day: 'Martes', week: 4, topic: 'Flujo de fluidos', quiz: 'Quiz 3' },
    { date: '2026-08-27', day: 'Jueves', week: 4, topic: 'Retroalimentación 1', proyecto: 'Coevaluación Bitácora 1: jueves 27 de agosto' },
    { date: '2026-09-01', day: 'Martes', week: 5, topic: 'Taller de Bernoulli', taller: 'Taller 3: Bernoulli' },
    { date: '2026-09-03', day: 'Jueves', week: 5, topic: 'Bombas centrífugas', quiz: 'Quiz 4' },
    { date: '2026-09-08', day: 'Martes', week: 6, topic: 'Agitación', quiz: 'Quiz 5' },
    { date: '2026-09-10', day: 'Jueves', week: 6, topic: 'Mezclado y escalado', quiz: 'Quiz 6' },
    { date: '2026-09-15', day: 'Martes', week: 7, topic: 'Taller de agitación y mezclado', taller: 'Taller 4: agitación' },
    { date: '2026-09-17', day: 'Jueves', week: 7, topic: 'Intercambiadores de calor I', quiz: 'Quiz 7', proyecto: 'Entrega Bitácora 2: domingo 20 de septiembre' },
    { date: '2026-09-22', day: 'Martes', week: 8, topic: 'Intercambiadores de calor II', taller: 'Taller 5: diseño térmico' },
    { date: '2026-09-24', day: 'Jueves', week: 8, topic: 'Retroalimentación 2', proyecto: 'Coevaluación Bitácora 2: jueves 24 de septiembre' },
    { date: '2026-10-06', day: 'Martes', week: 9, topic: 'Filtración I', quiz: 'Quiz 8' },
    { date: '2026-10-08', day: 'Jueves', week: 9, topic: 'Taller de filtración', taller: 'Taller 6: diseño de filtros' },
    { date: '2026-10-13', day: 'Martes', week: 10, topic: 'Destilación I: equilibrio de fases', quiz: 'Quiz 9' },
    { date: '2026-10-15', day: 'Jueves', week: 10, topic: 'Destilación II: flash', quiz: 'Quiz 10', proyecto: 'Entrega Bitácora 3: domingo 18 de octubre' },
    { date: '2026-10-20', day: 'Martes', week: 11, topic: 'McCabe-Thiele I', quiz: 'Quiz 11' },
    { date: '2026-10-22', day: 'Jueves', week: 11, topic: 'Retroalimentación 3', proyecto: 'Coevaluación Bitácora 3: jueves 22 de octubre' },
    { date: '2026-10-27', day: 'Martes', week: 12, topic: 'McCabe-Thiele II', taller: 'Taller 7: destilación flash multicomponente, método de Rachford-Rice' },
    { date: '2026-10-29', day: 'Jueves', week: 12, topic: 'Diseño de platos', quiz: 'Quiz 12' },
    { date: '2026-11-03', day: 'Martes', week: 13, topic: 'Eficiencias en destilación', quiz: 'Quiz 13' },
    { date: '2026-11-05', day: 'Jueves', week: 13, topic: 'Comunicación visual', quiz: 'Quiz 14' },
    { date: '2026-11-10', day: 'Martes', week: 14, topic: 'Taller integral de destilación', taller: 'Taller 8: destilación diferencial simple' },
    { date: '2026-11-12', day: 'Jueves', week: 14, topic: 'Laboratorio de destilación batch' },
    { date: '2026-11-17', day: 'Martes', week: 15, topic: 'Laboratorio de destilación batch' },
    { date: '2026-11-19', day: 'Jueves', week: 15, topic: 'Taller integral de destilación', taller: 'Taller 9: McCabe-Thiele', proyecto: 'Entrega Bitácora 4: domingo 22 de noviembre' },
    { date: '2026-11-24', day: 'Martes', week: 16, topic: 'Retroalimentación 4' },
    { date: '2026-11-26', day: 'Jueves', week: 16, topic: 'Retroalimentación 4', proyecto: 'Coevaluación Bitácora 4: jueves 26 de noviembre' },
    { date: '2026-12-01', day: 'Martes', week: 17, topic: 'Sesión de pósters', proyecto: 'Coevaluación 5: póster y documento final' },
    { date: '2026-12-03', day: 'Jueves', week: 17, topic: 'Sustentación final del proyecto' },
  ],
  readings: [
    {
      slug: 'programa-del-curso',
      order: 1,
      title: 'Programa del curso',
      summary:
        'El programa completo de IQYA-2031 para 2026-20: horarios y equipo, descripción y metodología (PO-PBL + aula invertida), el reto de la planta de pectina, resultados ABET, contenido por módulo, distribución de la nota, calendario y fechas de entrega, escala AIAS de uso de IA y políticas del curso.',
      date: '2026-08-04',
      readingMinutes: 12,
      tags: ['programa', 'syllabus', 'logística'],
      category: 'guia',
      href: '/classroom/iqya-2031-2026-20/programa.html',
      bannerImg: '/classroom/iqya-2031-2026-20/guias-banners/programa.jpg',
    },
    {
      slug: 'cronograma-interactivo',
      order: 2,
      title: 'Cronograma interactivo',
      summary:
        'El calendario del semestre, semana por semana. Arriba, qué sigue: el próximo quiz, taller y entrega con cuenta regresiva. Abajo, el timeline de las 16 semanas con quices, talleres, entregas de bitácora, coevaluaciones y retroalimentaciones. Se filtra por tipo y resalta la semana actual.',
      date: '2026-08-04',
      readingMinutes: 4,
      tags: ['cronograma', 'calendario', 'logística'],
      category: 'guia',
      href: '/classroom/iqya-2031-2026-20/cronograma.html',
      bannerImg: '/classroom/iqya-2031-2026-20/guias-banners/programa.jpg',
    },
    {
      slug: 'trabajo-en-equipo',
      order: 3,
      title: 'Trabajo en equipo: guía práctica para el proyecto',
      summary:
        'Los fundamentos, herramientas y compromisos que construyen equipos que funcionan de verdad. Cubre el Proyecto Aristóteles de Google, bienestar y seguridad psicológica, normas y contrato de equipo, roles, matriz de evaluación, resolución de conflictos y plantillas de registro semanal.',
      date: '2026-06-03',
      readingMinutes: 35,
      tags: ['trabajo en equipo', 'contrato', 'roles', 'normas', 'evaluación'],
      category: 'guia',
      href: '/classroom/iqya-2031-2026-20/guias/Guia_Trabajo_en_Equipo/Guia_Trabajo_en_Equipo.html',
      bannerImg: '/classroom/iqya-2031-2026-20/guias-banners/teamwork.jpg',
    },
    {
      slug: 'contrato-de-equipo',
      order: 4,
      title: 'Contrato de equipo',
      summary:
        'El acuerdo que su equipo firma en la segunda sesión y al que apela el resto del semestre. Se llena en pantalla, marca en rojo los pesos de coevaluación mientras no sumen 100, y el botón «Imprimir contrato» arma el documento formateado para firmar o guardar en PDF. Cubre propósito y valores, roles, normas con indicador observable, reuniones y canales, rutas de conflicto, criterios de coevaluación, sanciones y firmas.',
      date: '2026-07-27',
      readingMinutes: 40,
      tags: ['contrato', 'equipo', 'normas', 'roles', 'coevaluación'],
      category: 'guia',
      href: '/classroom/iqya-2031-2026-20/guias/Contrato_de_Equipo/Contrato_de_Equipo.html',
    },
    {
      slug: 'busqueda-bibliografica',
      order: 5,
      title: 'Búsqueda bibliográfica y herramientas de IA',
      summary:
        'Once plataformas para encontrar, analizar y sintetizar literatura científica: desde Google Scholar, Web of Science y Scopus hasta ChatGPT, Claude, Perplexity, SciSpace, Consensus y Connected Papers. Incluye estrategias de búsqueda avanzada y un flujo de trabajo recomendado para el proyecto.',
      date: '2026-06-03',
      readingMinutes: 35,
      tags: ['búsqueda bibliográfica', 'herramientas de IA', 'Google Scholar', 'ChatGPT', 'bases de datos'],
      category: 'guia',
      href: '/classroom/iqya-2031-2026-20/guias/Guia_Busqueda_Bibliografica/Guia_Busqueda_Bibliografica.html',
      bannerImg: '/classroom/iqya-2031-2026-20/guias-banners/research.jpg',
    },
    {
      slug: 'reto-pectina',
      order: 2,
      title: 'Guía del reto: la cáscara que vale más que la fruta',
      summary:
        'La guía del proyecto semestral: diseñar y dimensionar una planta que extrae pectina de grado alimentario a partir de cáscara de cítricos o maracuyá. Las ocho operaciones a integrar, cómo elegir la materia prima, qué validar en ASPEN Plus y dónde no confiar, los entregables y la rúbrica de cada bitácora.',
      date: '2026-08-03',
      readingMinutes: 8,
      tags: ['proyecto', 'reto', 'pectina', 'guía'],
      category: 'guia',
      href: '/classroom/iqya-2031-2026-20/reto-pectina.html',
      bannerImg: '/classroom/iqya-2031-2026-20/guias-banners/reto.jpg',
    },
    {
      slug: 'bitacoras-de-calculo',
      order: 4,
      title: 'Guía de elaboración de bitácoras de cálculo',
      summary:
        'Qué va en cada una de las cuatro bitácoras del proyecto y cómo se evalúan. Estructura general, contenidos requeridos por entrega, formato LaTeX/Word, fuentes de ingeniería, errores más comunes y consejos prácticos.',
      date: '2026-06-03',
      readingMinutes: 20,
      tags: ['bitácoras', 'cálculo', 'formato', 'documentación'],
      category: 'guia',
      href: '/classroom/iqya-2031-2026-20/guias/Guia_Bitacoras_Calculo/Guia_Bitacoras_Calculo.html',
      bannerImg: '/classroom/iqya-2031-2026-20/guias-banners/bitacoras.jpg',
    },
    {
      slug: 'informe-final',
      order: 6,
      title: 'Guía de elaboración del informe final',
      summary:
        'Estructura, formato y criterios de evaluación del documento final del proyecto. Cubre las diferencias con las bitácoras, los 12 capítulos del cuerpo del informe, las hojas de especificación de equipos, los errores más comunes y cómo preparar la sustentación.',
      date: '2026-06-03',
      readingMinutes: 15,
      tags: ['informe final', 'documento', 'estructura', 'evaluación'],
      category: 'guia',
      href: '/classroom/iqya-2031-2026-20/guias/Guia_Informe_Final/Guia_Informe_Final.html',
      bannerImg: '/classroom/iqya-2031-2026-20/guias-banners/informe.jpg',
    },
    {
      slug: 'lectura-01-operaciones-unitarias',
      week: 1,
      order: 1,
      title: 'Las operaciones unitarias: historia de un concepto y formas de clasificarlo',
      summary:
        'Cómo una sola idea ordenó toda la ingeniería química. Origen del concepto con Arthur D. Little (MIT, 1915), evolución a lo largo del siglo XX y las dos clasificaciones complementarias: por tipo de operación y por fenómeno de transporte predominante.',
      date: '2026-06-03',
      readingMinutes: 12,
      tags: ['operaciones unitarias', 'historia', 'Little', 'fenómenos de transporte', 'clasificación'],
      category: 'lectura',
      href: '/classroom/iqya-2031-2026-20/lecturas/Lectura_01/Lectura_01_Operaciones_Unitarias.html',
      bannerImg: '/classroom/iqya-2031-2026-20/lecturas-banners/l01.jpg',
    },
    {
      slug: 'lectura-02-diagramas-ingenieria',
      week: 2,
      order: 2,
      title: 'Los diagramas de ingeniería como lenguaje de la profesión',
      summary:
        'Por qué los ingenieros de proceso no describen sus plantas: las dibujan. Los tres niveles de representación (BFD, PFD, P&ID), qué exige cada uno al ingeniero y la simbología ISO/ISA como convención universal de la disciplina.',
      date: '2026-06-03',
      readingMinutes: 14,
      tags: ['diagramas', 'BFD', 'PFD', 'P&ID', 'simbología', 'ISO', 'ISA'],
      category: 'lectura',
      href: '/classroom/iqya-2031-2026-20/lecturas/Lectura_02/Lectura_02_Diagramas_Ingenieria.html',
      bannerImg: '/classroom/iqya-2031-2026-20/lecturas-banners/l02.jpg',
    },
    {
      slug: 'lectura-03-reduccion-tamano',
      week: 3,
      order: 3,
      title: 'Reducción de tamaño',
      summary:
        'Conminución, mecanismos de fractura y leyes energéticas. Por qué la molienda es una de las operaciones más comunes en la industria y, a la vez, una de las menos eficientes. Bond, Rittinger, Kick y Hukki, con un ejemplo resuelto para caliza.',
      date: '2026-06-04',
      readingMinutes: 25,
      tags: ['conminución', 'molienda', 'trituración', 'Bond', 'mecanismos de fractura', 'sólidos'],
      category: 'lectura',
      href: '/classroom/iqya-2031-2026-20/lecturas/Lectura_03/Lectura_03_Reduccion_de_Tamano.html',
      bannerImg: '/classroom/iqya-2031-2026-20/lecturas-banners/l03.jpg',
    },
    {
      slug: 'lectura-04-transporte-liquidos',
      week: 4,
      order: 4,
      title: 'Transporte de líquidos en la industria',
      summary:
        'Flujo en tuberías y pérdidas de energía. Número de Reynolds, diagrama de Moody interactivo, Darcy-Weisbach y pérdidas menores con coeficientes K_L. Un procedimiento de cálculo paso a paso y un ejemplo resuelto que culmina en la cabeza del sistema, el dato de partida para seleccionar la bomba en la Lectura 05.',
      date: '2026-06-05',
      readingMinutes: 22,
      tags: ['transporte de fluidos', 'Reynolds', 'Moody', 'Darcy-Weisbach', 'pérdidas', 'tubería', 'cabeza del sistema'],
      category: 'lectura',
      href: '/classroom/iqya-2031-2026-20/lecturas/Lectura_04/Lectura_04_Transporte_Liquidos.html',
      bannerImg: '/classroom/iqya-2031-2026-20/lecturas-banners/l04.jpg',
    },
    {
      slug: 'lectura-05-bombas',
      week: 5,
      order: 5,
      title: 'Bombas industriales',
      summary:
        'El equipo que suministra energía al fluido. Tipos de bombas (centrífugas y desplazamiento positivo), selector visual Q-H, curvas características interactivas, cavitación, NPSH disponible con calculadora reactiva y cálculo de potencia paso a paso.',
      date: '2026-06-05',
      readingMinutes: 30,
      tags: ['bombas', 'centrífuga', 'desplazamiento positivo', 'curvas características', 'NPSH', 'cavitación', 'potencia de bombeo', 'BEP'],
      category: 'lectura',
      href: '/classroom/iqya-2031-2026-20/lecturas/Lectura_05/Lectura_05_Bombas.html',
      bannerImg: '/classroom/iqya-2031-2026-20/lecturas-banners/l05.jpg',
    },
    {
      slug: 'lectura-06-agitacion',
      week: 6,
      order: 6,
      title: 'Fundamentos de agitación',
      summary:
        'Agitación vs. mezclado, patrones de flujo (axial, radial), tipos de impulsores con visor interactivo (hélice, PBT, Rushton, Smith, paletas, ancla, cinta helicoidal), bafles, geometría estándar del tanque, números adimensionales (Reynolds de agitación, número de potencia), curva interactiva Np vs Re, calculadora de potencia y calculadora de escalado con cuatro criterios (P/V, Vtip, Re, tmix).',
      date: '2026-06-05',
      readingMinutes: 25,
      tags: ['agitación', 'mezclado', 'impulsores', 'Rushton', 'PBT', 'bafles', 'número de potencia', 'escalado', 'Reynolds'],
      category: 'lectura',
      href: '/classroom/iqya-2031-2026-20/lecturas/Lectura_06/Lectura_06_Agitacion.html',
      bannerImg: '/classroom/iqya-2031-2026-20/lecturas-banners/l06.jpg',
    },
    {
      slug: 'lectura-07-mezclado',
      week: 6,
      order: 7,
      title: 'Mezclado y escalado',
      summary:
        'Mecanismos fundamentales del mezclado (convectivo, cizalladura, difusivo), equipos para sólidos con visor interactivo (doble cono, V-blender, ribbon blender, paletas, tornillo cónico, granulador de alta cizalla), equipos para líquidos (rotor-estator, mezclador estático, homogeneizador de alta presión), criterios de escalado con calculadora reactiva (P/V, v_tip, N·t, Froude), tecnología PAT y errores comunes.',
      date: '2026-06-06',
      readingMinutes: 28,
      tags: ['mezclado', 'escalado', 'tumble blender', 'ribbon blender', 'mezclador estático', 'homogeneizador', 'PAT', 'scale-up'],
      category: 'lectura',
      href: '/classroom/iqya-2031-2026-20/lecturas/Lectura_07/Lectura_07_Mezclado.html',
      bannerImg: '/classroom/iqya-2031-2026-20/lecturas-banners/l07.jpg',
    },
    {
      slug: 'lectura-08-intercambiadores-de-calor',
      week: 7,
      order: 8,
      title: 'Intercambiadores de calor',
      summary:
        'Mecanismos de transferencia de calor (conducción, convección, radiación), tipos de intercambiadores con visor interactivo (tubo y coraza, placas, aeroenfriador), otros tipos (doble tubo, serpentín, espiral, bobina enrollada), ecuación de diseño Q = UA·ΔTlm·FT, coeficiente global U, calculadora LMTD reactiva, factor de corrección FT, método ε-NTU, ensuciamiento (fouling) y estrategias de mitigación.',
      date: '2026-06-06',
      readingMinutes: 30,
      tags: ['intercambiadores de calor', 'transferencia de calor', 'LMTD', 'NTU', 'tubo y coraza', 'placas', 'aeroenfriador', 'ensuciamiento', 'fouling', 'TEMA'],
      category: 'lectura',
      href: '/classroom/iqya-2031-2026-20/lecturas/Lectura_08/Lectura_08_Intercambiadores_de_Calor.html',
      bannerImg: '/classroom/iqya-2031-2026-20/lecturas-banners/l08.jpg',
    },
    {
      slug: 'lectura-09-filtracion',
      week: 9,
      order: 9,
      title: 'Filtración industrial',
      summary:
        'La barrera porosa que separa sólidos de fluidos. Mecanismos de retención con visor interactivo, teoría basada en la ley de Darcy (resistencia de torta y del medio), linealización t/V-V con gráfica interactiva, compresibilidad de la torta, calculadora de tiempo de ciclo, los cinco grandes tipos de filtros industriales (lecho granular, prensa, tambor rotatorio al vacío, cartucho, membranas), medios filtrantes y ciclo de operación.',
      date: '2026-06-06',
      readingMinutes: 28,
      tags: ['filtración', 'separación sólido-líquido', 'torta', 'ley de Darcy', 'resistencia específica', 'filtro prensa', 'tambor rotatorio', 'membranas', 'medios filtrantes', 'retrolavado'],
      category: 'lectura',
      href: '/classroom/iqya-2031-2026-20/lecturas/Lectura_09/Lectura_09_Filtracion.html',
      bannerImg: '/classroom/iqya-2031-2026-20/lecturas-banners/l09.jpg',
    },
    {
      slug: 'lectura-10-equilibrio-de-fases',
      week: 10,
      order: 10,
      title: 'Equilibrio de fases',
      summary:
        'La piedra angular de la destilación: equilibrio líquido-vapor (ELV), ley de Raoult, ley de Dalton, ecuación de Antoine con calculadora interactiva, volatilidad relativa α, diagramas T-x-y / P-x-y / y-x con tres videos explicativos y explorador interactivo de la curva de equilibrio, coeficientes de actividad y azeótropos de mínima y máxima ebullición.',
      date: '2026-06-13',
      readingMinutes: 24,
      tags: ['equilibrio de fases', 'ELV', 'Raoult', 'Dalton', 'Antoine', 'volatilidad relativa', 'diagrama T-x-y', 'diagrama y-x', 'azeótropo', 'destilación'],
      category: 'lectura',
      href: '/classroom/iqya-2031-2026-20/lecturas/Lectura_10/Lectura_10_Equilibrio_de_Fases.html',
      bannerImg: '/classroom/iqya-2031-2026-20/lecturas-banners/l10.jpg',
    },
    {
      slug: 'lectura-11-destilacion-flash',
      week: 10,
      order: 11,
      title: 'Destilación flash',
      summary:
        'Separación de una sola etapa por vaporización parcial: principio del flash, esquema del tambor flash (SVG interactivo), diferencia con la destilación convencional, balances de materia, constantes de equilibrio K, algoritmo de cálculo y ecuación de Rachford-Rice con calculadora flash binaria isotérmica para el sistema etanol-agua.',
      date: '2026-06-20',
      readingMinutes: 18,
      tags: ['flash', 'vaporización', 'Rachford-Rice', 'tambor flash', 'equilibrio líquido-vapor', 'destilación', 'una etapa'],
      category: 'lectura',
      href: '/classroom/iqya-2031-2026-20/lecturas/Lectura_11/Lectura_11_Destilacion_Flash.html',
      bannerImg: '/classroom/iqya-2031-2026-20/lecturas-banners/l11.jpg',
    },
    {
      slug: 'lectura-12-destilacion-por-lotes',
      week: 14,
      order: 12,
      title: 'Destilación por lotes',
      summary:
        'Destilación discontinua (alambique): principio de la operación, ecuación de Rayleigh con calculadora interactiva (integración numérica), destilación rectificada por lotes a R constante y a y_D constante, destilación multietapa con simulación interactiva embebida (LearnChemE) y video explicativo, los tres cortes del destilado (cabezas, corazón y colas) en la destilería artesanal, sistema de doble destilación escocés y el rol del cobre.',
      date: '2026-06-27',
      readingMinutes: 22,
      tags: ['destilación por lotes', 'alambique', 'ecuación de Rayleigh', 'pot still', 'multietapa', 'simulación', 'cabezas', 'corazón', 'colas', 'spirit cut', 'whisky', 'discontinua'],
      category: 'lectura',
      href: '/classroom/iqya-2031-2026-20/lecturas/Lectura_12/Lectura_12_Destilacion_por_Lotes.html',
      bannerImg: '/classroom/iqya-2031-2026-20/lecturas-banners/l12.jpg',
    },
    {
      slug: 'lectura-13-destilacion-continua',
      week: 11,
      order: 13,
      title: 'Destilación continua',
      summary:
        'Diseño de columnas de destilación binaria continua: secciones de rectificación y agotamiento, balances de materia globales, razón de reflujo R, supuesto CMO, método gráfico de McCabe-Thiele paso a paso con imágenes de construcción (9 pasos), explorador interactivo de la calidad de la alimentación (q) y la línea q con dos videos explicativos, efectos de las variables de operación, reflujo mínimo, reflujo total, y eficiencia de etapa E_o con estimador Fenske-Underwood interactivo.',
      date: '2026-07-04',
      readingMinutes: 32,
      tags: ['destilación continua', 'McCabe-Thiele', 'reflujo', 'etapas teóricas', 'línea de operación', 'calidad de alimentación', 'línea q', 'eficiencia', 'Fenske', 'Underwood', 'columna', 'platos'],
      category: 'lectura',
      href: '/classroom/iqya-2031-2026-20/lecturas/Lectura_13/Lectura_13_Destilacion_Continua.html',
      bannerImg: '/classroom/iqya-2031-2026-20/lecturas-banners/l13.jpg',
    },
    {
      slug: 'lectura-14-comunicacion-visual',
      week: 13,
      order: 14,
      title: 'Comunicación visual de resultados',
      summary:
        'Cómo decidir qué figura hacer antes de abrir la herramienta: la diferencia entre explorar y explicar con el dato medido de Boy et al. sobre el efecto de la narrativa, el costo cognitivo y la jerarquía de Cleveland y McGill, la ficha de contexto de tres preguntas, el título como tesis y no como tema, la elección del gráfico según la tarea visual con la serie de canónicos de la disciplina, la razón de tinta de datos y la jerarquía visual de tres niveles, las cuatro trampas que aparecen solas en un informe de proceso y cómo criticar una figura ajena sin destruirla.',
      date: '2026-11-05',
      readingMinutes: 25,
      tags: ['comunicación visual', 'storytelling with data', 'explorar y explicar', 'Cleveland-McGill', 'título de tesis', 'data-ink', 'jerarquía visual', 'prueba de los cinco segundos', 'ética de la figura', 'coevaluación'],
      category: 'lectura',
      href: '/classroom/iqya-2031-2026-20/lecturas/Lectura_14/Lectura_14_Comunicacion_Visual.html',
      bannerImg: '/classroom/iqya-2031-2026-20/lecturas-banners/l14.jpg',
    },
    {
      slug: 'taller-01-analisis-de-pfd',
      week: 2,
      order: 101,
      title: 'Taller 1 · Análisis de un diagrama de flujo de proceso',
      summary:
        'Una planta de producción de ron a partir de melaza, dibujada con errores de dibujo y de ingeniería. El taller pide leer el diagrama, trazar las corrientes, encontrar los errores y proponer lo que falta para que la planta pueda operarse: la separación de sólidos antes de la columna, las bombas que el plano no tiene, el control de presión del tope y los servicios de cada intercambiador. Incluye un visor con zoom sobre el PFD, porque varias etiquetas no se leen a tamaño de página. Cierra con operabilidad, seguridad y una discusión económica sobre recuperar o purgar.',
      date: '2026-08-13',
      readingMinutes: 15,
      tags: ['PFD', 'diagramas de proceso', 'bombas', 'destilación', 'azeótropo', 'control', 'PSV', 'corrientes de servicio', 'taller'],
      category: 'taller',
      href: '/classroom/iqya-2031-2026-20/talleres/Taller_01/Taller_01_Analisis_de_PFD.html',
      bannerImg: '/classroom/iqya-2031-2026-20/guias-banners/informe.jpg',
    },
    {
      slug: 'taller-02-analisis-granulometrico',
      week: 3,
      order: 102,
      title: 'Taller 2 · Análisis granulométrico de sólidos particulados',
      summary:
        'Se resuelve en un cuaderno de Google Colab, que se abre desde la página con un clic. Tres casos: un catalizador que debe fluidizar y se juzga contra tres criterios de planta, dos circuitos de molienda que compiten por alimentar una flotación y donde ninguno domina al otro, y una carta de control del D50 con las muestras de una semana. Incluye el ajuste de los tres modelos clásicos de distribución, log-normal, Rosin-Rammler y Gates-Gaudin-Schuhmann, y cinco preguntas de análisis con sustento bibliográfico en formato IEEE. En parejas, con pareja distinta a la del Taller 1.',
      date: '2026-08-20',
      readingMinutes: 12,
      tags: ['granulometría', 'tamizado', 'sólidos particulados', 'D80', 'fluidización', 'molienda', 'Rosin-Rammler', 'carta de control', 'Colab', 'Python', 'taller'],
      category: 'taller',
      href: '/classroom/iqya-2031-2026-20/talleres/Taller_02/Taller_02_Analisis_Granulometrico.html',
      bannerImg: '/classroom/iqya-2031-2026-20/lecturas-banners/l03.jpg',
    },
    {
      slug: 'taller-03-seleccion-de-bombas',
      week: 5,
      order: 103,
      title: 'Taller 3 · Selección de un sistema de bombeo',
      summary:
        'Un trasiego entre dos tanques y tres bombas candidatas, con las cartas de catálogo incrustadas y un visor con zoom para leerlas. Se plantea el balance de energía, se obtiene el factor de fricción con Colebrook, se construye la curva del sistema y se calcula el NPSH disponible en la condición crítica. La parte final es la que da sentido al taller: comparar el NPSH disponible con el requerido y descubrir que el sistema, tal como está especificado, no se puede operar, para después proponer y cuantificar el rediseño. En parejas, distintas a las de los talleres 1 y 2.',
      date: '2026-09-01',
      readingMinutes: 18,
      tags: ['bombas', 'Bernoulli', 'Colebrook', 'curva del sistema', 'NPSH', 'cavitación', 'punto de operación', 'BEP', 'selección de equipos', 'taller'],
      category: 'taller',
      href: '/classroom/iqya-2031-2026-20/talleres/Taller_03/Taller_03_Seleccion_de_Bombas.html',
      bannerImg: '/classroom/iqya-2031-2026-20/lecturas-banners/l05.jpg',
    },
  ],
  presentations: [
    {
      id: 'presentacion-del-curso',
      title: 'Presentación del curso',
      sessionNumber: 1,
      week: 1,
      description:
        'La sesión inaugural completa: bienvenida y la idea del proyecto, equipo docente, objetivos y resultados ABET, el reto de la pectina, metodología, cronograma y fechas clave, evaluación, uso de IA y expectativas.',
      file: 'Presentacion_del_Curso/Presentacion_del_Curso.html',
    },
    {
      id: 'trabajo-en-equipo',
      week: 1,
      title: 'Equipos, coevaluación y contrato',
      sessionNumber: 2,
      description:
        'Qué distingue a un equipo que funciona, cómo la coevaluación convierte una nota grupal en cinco notas individuales, con un ejemplo que se mueve en vivo, y las ocho secciones del contrato que cada equipo firma en clase.',
      file: 'Trabajo_en_Equipo/Presentacion_Trabajo_en_Equipo.html',
    },
    {
      id: 'diagramas-ingenieria',
      week: 2,
      title: 'Diagramas de ingeniería',
      description:
        'PBD, PFD y P&ID: el lenguaje visual de la ingeniería química. Simbología ISA, codificación de equipos, balance de masa y mejores prácticas.',
      sessionNumber: 1,
      file: 'Diagramas_de_Ingenieria/Presentacion_Diagramas_de_Ingenieria.html',
    },
    {
      id: 'pid-instrumentacion',
      week: 2,
      title: 'Diagramas P&ID e instrumentación',
      description:
        'Simbología ISA para instrumentación, lazos de control, seguridad (PSV) y construcción profesional de P&ID.',
      sessionNumber: 2,
      file: 'PID_Instrumentacion/Presentacion_Diagramas_PID.html',
    },
    {
      id: 'propiedades-solidos-particulados',
      week: 3,
      title: 'Propiedades de sólidos particulados',
      description:
        'Densidad, porosidad, tamaño y forma, flujo, cohesión, segregación, propiedades térmicas, explosividad de polvos y aplicaciones a molienda, tolvas, transporte y mezclado.',
      sessionNumber: 5,
      file: 'Propiedades_Solidos_Particulados/Presentacion_Propiedades_Solidos_Particulados.html',
    },
    {
      id: 'reduccion-de-tamano',
      week: 3,
      title: 'Reducción de tamaño',
      description:
        'Física de la fractura (Griffith), leyes de la conminución (Rittinger, Kick, Bond), equipos de trituración y molienda, clasificación por tamizado y control de polvo.',
      sessionNumber: 6,
      file: 'Reduccion_de_Tamano/Presentacion_Reduccion_de_Tamano.html',
    },
    {
      id: 'flujo-de-fluidos',
      week: 4,
      title: 'Flujo de fluidos',
      description:
        'Ecuación de Bernoulli, pérdidas de carga (Darcy-Weisbach, Moody) en redes de tuberías, selección de diámetros, fluidos no-newtonianos, cavitación y golpe de ariete.',
      sessionNumber: 7,
      file: 'Flujo_de_Fluidos/Presentacion_Flujo_de_Fluidos.html',
    },
    {
      id: 'bombas-centrifugas',
      week: 5,
      title: 'Bombas centrífugas',
      description:
        'Curvas características (H-Q, eficiencia, potencia) y punto de operación, NPSH y cavitación, operación en serie y paralelo, y criterios de especificación y mantenimiento.',
      sessionNumber: 8,
      file: 'Bombas_Centrifugas/Presentacion_Bombas_Centrifugas.html',
    },
    {
      id: 'agitacion',
      week: 6,
      title: 'Agitación',
      description:
        'Tipos de impulsores (axiales y radiales), geometría del tanque, número de potencia y curvas Np-Re, suspensión de sólidos y escalamiento (P/V, tip speed, Re).',
      sessionNumber: 9,
      file: 'Agitacion/Presentacion_Agitacion.html',
    },
    {
      id: 'mezclado-de-fluidos',
      week: 6,
      title: 'Mezclado de fluidos',
      description:
        'Agitación (causa) vs. mezclado (efecto): los tres mecanismos de mezclado, tiempo de mezclado θ₉₅ y su costo energético, y los retos de alta viscosidad y líquidos inmiscibles.',
      sessionNumber: 10,
      file: 'Mezclado/Presentacion_Mezclado.html',
    },
    {
      id: 'intercambiadores-i',
      week: 7,
      title: 'Intercambiadores de calor I',
      description:
        'Coeficiente global U y ensuciamiento (fouling), tipos de intercambiadores (tubos y coraza, placas, espiral, aletados) y diseño por el método LMTD con factor de corrección F.',
      sessionNumber: 11,
      file: 'Intercambiadores/Presentacion_Intercambiadores.html',
    },
    {
      id: 'intercambiadores-ii',
      week: 8,
      title: 'Intercambiadores de calor II',
      description:
        'Método ε-NTU para evaluar equipos existentes: efectividad, número de unidades de transferencia, relaciones por geometría y casos límite. Dimensionamiento físico de tubos y coraza, velocidades y caída de presión, método de Kern y verificación con software.',
      sessionNumber: 12,
      file: 'Intercambiadores_II/Presentacion_Intercambiadores_II.html',
    },
    {
      id: 'filtracion',
      week: 9,
      title: 'Filtración',
      description:
        'Mecanismos (filtración con torta, profunda y tangencial), Ley de Darcy y modelo de resistencias en serie (R_c = αw, R_m), compresibilidad de la torta. Ecuaciones de diseño a presión y a caudal constante con simulador interactivo del ciclo real (Fase 1-2-3). Determinación experimental de α y R_m, ayudas de filtración (diatomeas, perlita, celulosa, pre-capa, body feed), equipos (filtro prensa, filtro rotatorio de vacío, decantadora centrífuga) con videos, criterios de selección y cosecha de células en biotecnología.',
      sessionNumber: 13,
      file: 'Filtracion/Presentacion_Filtracion.html',
    },
    {
      id: 'equilibrio-de-fases',
      week: 10,
      title: 'Equilibrio de fases y destilación',
      description:
        'Equilibrio líquido-vapor, ley de Raoult, volatilidad relativa, diagramas T-xy y x-y con datos reales, azeótropos, modelos termodinámicos (Wilson, NRTL, UNIQUAC) y tipos de destilación.',
      sessionNumber: 14,
      file: 'Equilibrio_de_Fases/Presentacion_Equilibrio_de_Fases.html',
    },
    {
      id: 'destilacion-flash',
      week: 10,
      title: 'Destilación flash: principios y fundamentos',
      description:
        'Vaporización parcial súbita y equilibrio de una sola etapa: el fenómeno del flasheo, el tambor separador, diagramas P-x-y y T-x-y, balances de materia y energía, la línea de operación flash y el flash multicomponente (Rachford-Rice) con algoritmo interactivo y solucionador en vivo. Aplicaciones en refinación y desalinización.',
      sessionNumber: 15,
      file: 'Destilacion_Flash/Presentacion_Destilacion_Flash.html',
    },
    {
      id: 'diseno-de-platos',
      week: 12,
      title: 'Diseño de platos',
      sessionNumber: 2,
      description:
        'De las etapas teóricas de McCabe-Thiele a una columna real: anatomía del plato, selección entre perforados, válvulas y campanas, la ventana de operación con sus cuatro límites, el diámetro por velocidad de inundación con Souders-Brown, la verificación del bajante y la altura. Incluye una ventana de operación interactiva y el dimensionamiento resuelto de la columna de recuperación de etanol de la planta de pectina.',
      file: 'Diseno_de_Platos/Presentacion_Diseno_de_Platos.html',
    },
    {
      id: 'eficiencias-en-destilacion',
      week: 13,
      title: 'Eficiencias en destilación',
      sessionNumber: 1,
      description:
        'El número que convierte etapas teóricas en platos que se compran. Por qué un plato real no alcanza el equilibrio, las tres eficiencias que suelen confundirse, la de Murphree sobre el diagrama de McCabe-Thiele, la eficiencia global con la correlación de O\'Connell y sus límites, y cuándo conviene relleno en vez de platos. Cierra recalculando la columna de recuperación de etanol del proyecto.',
      file: 'Eficiencias_en_Destilacion/Presentacion_Eficiencias_en_Destilacion.html',
    },
    {
      id: 'comunicacion-visual',
      week: 13,
      title: 'Comunicación visual',
      sessionNumber: 2,
      description:
        'Cómo lograr que una figura de proceso diga lo que usted quiere decir, y cómo usar la IA generativa para acelerar ese trabajo sin delegarle el criterio. Primera mitad: explorar frente a explicar, la ficha de contexto, el título como tesis, la elección del gráfico por tarea, la razón de tinta y la jerarquía visual, con las cuatro trampas frecuentes. Segunda mitad: las cinco piezas de un prompt útil y cuatro prompts listos para criticar figuras, simular la prueba de los cinco segundos, reescribir títulos y recomendar visualizaciones con restricciones explícitas. Incluye un selector de audiencia que reconstruye la misma figura para tres lectores distintos y una prueba de los cinco segundos cronometrada en vivo.',
      file: 'Comunicacion_Visual/Presentacion_Comunicacion_Visual.html',
    },
    {
      id: 'destilacion-diferencial',
      week: 14,
      title: 'Destilación diferencial',
      description:
        'Destilación por lotes y su naturaleza transitoria: recorrido interactivo en el diagrama T-x-y (A→B→C→…), aparato y anatomía de un destilador, columnas multietapa y reflujo, derivación de la ecuación de Rayleigh, algoritmo de solución y calculadora en vivo (metanol-agua), operación y aplicaciones en bebidas, perfumería y química fina.',
      sessionNumber: 16,
      file: 'Destilacion_Diferencial/Presentacion_Destilacion_Diferencial.html',
    },
    {
      id: 'destilacion-continua',
      week: 11,
      title: 'Diseño y análisis de columnas de destilación continua',
      description:
        'Volatilidad relativa, curva de equilibrio líquido-vapor interactiva, anatomía de la columna y el método de McCabe-Thiele: zonas, balances, líneas de operación (LOS/LOI) y línea q, condición térmica de la alimentación (parámetro q), y un ejemplo completo n-hexano/p-xileno con construcción gráfica interactiva paso a paso (línea q, punto pinch, R mínimo, escalonado de etapas). Eficiencia de platos, diseño hidráulico, limitaciones, azeótropos y control.',
      sessionNumber: 17,
      file: 'Destilacion_Continua/Presentacion_Destilacion_Continua.html',
    },
  ],
  simulations: [
    {
      id: 'manual-diagramas',
      week: 2,
      title: 'Manual de diagramas de ingeniería',
      description:
        'La referencia interactiva de BFD, PFD y P&ID del curso, hilada por un mismo proceso (hidrodesulfuración de nafta) dibujado con detalle creciente. Once secciones navegables: introducción y jerarquía de diagramas, diagrama de bloques, equipos y nomenclatura con un decodificador de tags en vivo, corrientes y servicios, lazos de control con un constructor por tipo de equipo, tablas del PFD, un PFD explorable clic-a-clic, tuberías e instrumentación (ISA-5.1), layout e isométricos, una biblioteca de símbolos buscable y filtrable, y una autoevaluación de 10 preguntas que se califica sola. La guía visual para leer y dibujar diagramas de proceso.',
      sessionNumber: 1,
      file: 'Manual_Diagramas.html',
      tags: ['diagramas', 'BFD', 'PFD', 'P&ID', 'ISA-5.1', 'nomenclatura', 'lazos de control', 'símbolos', 'instrumentación'],
    },
    {
      id: 'explorador-agitacion',
      week: 6,
      title: 'Explorador de agitación',
      description:
        'Explore el tanque agitado del proyecto en vivo: elija el impulsor (hélice marina axial, turbina Rushton radial o ancla para alta viscosidad), active o quite los bafles, y seleccione el fluido (agua, aceite, jarabe de glucosa o uno genérico con ρ y μ ajustables) junto con la velocidad de giro y el diámetro D/T. La herramienta dibuja el campo de velocidades estilo CFD en vista lateral y superior, con streamlines coloreadas por magnitud y animadas, incluyendo el patrón clásico con bafles (giro central más remolinos entre bafles) y el vórtice central cuando faltan. Calcula Reynolds y régimen, el número de potencia sobre la curva Np-Re (con y sin bafles), la potencia y P/V, la velocidad de punta, el tiempo de mezcla θ₉₅ de Grenville y la profundidad del vórtice, con avisos de zonas muertas, arrastre de aire y daño por cizalla.',
      sessionNumber: 9,
      file: 'Explorador_Agitacion.html',
      tags: ['agitación', 'mezclado', 'impulsores', 'bafles', 'número de potencia', 'Np-Re', 'vórtice', 'tiempo de mezcla', 'tanque agitado'],
    },
    {
      id: 'explorador-intercambiadores',
      week: 8,
      title: 'Explorador de intercambiadores de tubos y coraza',
      description:
        'Diseñe el intercambiador del proyecto por el método de Kern en vivo: defina el requerimiento (enfriar aceite ligero con agua), asigne fluidos a tubos o coraza, elija tubo, arreglo del haz (triangular/cuadrado), pasos, corazas en serie, número y longitud de tubos, espaciado de bafles, material y factores de ensuciamiento. La herramienta calcula los coeficientes h de cada lado, U limpio y de diseño, LMTD y factor F multi-paso/multi-coraza, el área requerida vs. disponible (sobrediseño), las caídas de presión y las velocidades. Entrega un veredicto de diseño por criterio (régimen, ΔP, esbeltez, F…), la viabilidad económica (capital anualizado más energía de bombeo) y una comparación de cinco materiales. Con corte longitudinal, sección transversal del haz y perfil de temperaturas dibujados en tiempo real.',
      sessionNumber: 11,
      file: 'Explorador_Intercambiadores.html',
      tags: ['intercambiadores', 'tubos y coraza', 'método de Kern', 'U', 'LMTD', 'factor F', 'bafles', 'caída de presión', 'ensuciamiento', 'economía'],
    },
    {
      id: 'explorador-molienda',
      week: 3,
      title: 'Explorador de molienda y tamizado',
      description:
        'Seleccione el equipo de reducción de tamaño del proyecto en vivo: elija material (caliza, carbón, maíz, azúcar, arcilla) y molino (mandíbulas, rodillos, martillos, bolas, discos), y defina alimentación F₈₀, producto objetivo P₈₀ y capacidad en escala logarítmica. La herramienta calcula la energía con la Ley de Bond y compara los tres regímenes (Bond, Kick, Rittinger) calibrados en el punto de operación, dimensiona la potencia al eje y del motor, y resuelve el balance térmico adiabático (calor disipado, ΔT, temperatura de salida vs. límite del material). En seco o húmedo, con detección de atascos, daño térmico, ATEX, abrasión y sobre-reducción. La Parte 2 modela la distribución del producto con Rosin-Rammler y genera el análisis de tamizado completo de la serie Tyler.',
      sessionNumber: 6,
      file: 'Explorador_Molienda.html',
      tags: ['molienda', 'conminución', 'Ley de Bond', 'Kick', 'Rittinger', 'Rosin-Rammler', 'tamizado', 'balance térmico', 'sólidos'],
    },
    {
      id: 'explorador-bernoulli',
      week: 5,
      title: 'Explorador de Bernoulli',
      description:
        'Arme el circuito de flujo del proyecto en vivo y aplique el balance de energía mecánica: elija el fluido (agua, etanol, glicerina, aceite o uno personalizado con ρ y μ ajustables), el material y diámetro de la tubería, la longitud, las elevaciones y el caudal de diseño, y arme la lista de accesorios (codos, tés, válvulas de globo/compuerta/bola/check) con su apertura para estrangular. La herramienta calcula la velocidad, el número de Reynolds y el régimen, el factor de fricción por Swamee-Jain, y las pérdidas por el método K y por longitud equivalente en paralelo. Resuelve el balance de Bernoulli término a término (presión, elevación, energía cinética, bomba y pérdidas), permite instalar o quitar la bomba para hallar el punto de operación donde su curva corta la del sistema, y estima la potencia. Con el esquema del sistema dibujado a partir de sus accesorios, el diagrama de Moody con el punto de operación y las curvas de sistema y bomba en tiempo real. Descarga libre a la atmósfera o sumergida a un tanque elevado.',
      sessionNumber: 7,
      file: 'Explorador_Bernoulli.html',
      tags: ['Bernoulli', 'Darcy-Weisbach', 'factor de fricción', 'diagrama de Moody', 'pérdidas menores', 'método K', 'longitud equivalente', 'punto de operación', 'bomba'],
    },
    {
      id: 'explorador-bombas-centrifugas',
      week: 5,
      title: 'Explorador de bombas centrífugas',
      description:
        'Seleccione la bomba del circuito en vivo: elija diámetro de impulsor y velocidad de giro, defina la curva del sistema (caudal de diseño, fricción y niveles de succión y descarga referidos al eje de la bomba, z = 0) y observe el punto de operación donde la curva de la bomba corta la del sistema. Reescale la familia de curvas con las leyes de afinidad, dibuje las islas de eficiencia, calcule la potencia hidráulica y al freno con selección de motor estándar, y evalúe el NPSH disponible vs. requerido con la altitud del sitio (Bogotá ≈ 2600 msnm) para anticipar la cavitación. Basado en la curva B&G TEH-375A. Unidades US o SI.',
      sessionNumber: 8,
      file: 'Explorador_Bombas_Centrifugas.html',
      tags: ['bombas', 'curva característica', 'NPSH', 'cavitación', 'leyes de afinidad', 'punto de operación', 'BHP', 'eficiencia'],
    },
    {
      id: 'explorador-mccabe-thiele',
      week: 11,
      title: 'Explorador McCabe-Thiele',
      description:
        'Diseñe la columna de destilación binaria en vivo: mueva la composición y calidad de la alimentación, la pureza de productos, el reflujo y la eficiencia de Murphree, y observe cómo se reconstruyen las rectas de operación, la línea q y el escalonado de etapas. Incluye cinco sistemas (benceno-tolueno, metanol-agua, metanol-etanol, etanol-agua no ideal con azeótropo y α personalizable), balance global de materia, Rmín, Fenske y la torre con su plato de alimentación óptimo. La herramienta del proyecto para dimensionar la recuperación de etanol.',
      sessionNumber: 17,
      file: 'Explorador_McCabe_Thiele.html',
      tags: ['destilación', 'McCabe-Thiele', 'reflujo', 'línea q', 'etapas', 'etanol-agua', 'Murphree', 'Fenske'],
    },
    {
      id: 'explorador-graficos',
      week: 13,
      title: 'Explorador de gráficos',
      description:
        'El catálogo de decisión visual del curso: 79 tipos de gráfico organizados por las ocho tareas que puede pedirle a un dato, con una miniatura dibujada de cada uno. De cada tipo indica la pregunta que responde, cuándo usarlo y cuándo no, un ejemplo de área, la decisión que habilita, su trampa ética típica y su lugar en la jerarquía de Cleveland y McGill. Incluye un diagrama de decisión que lleva de la pregunta al grupo correcto en un clic y una serie completa de canónicos de la disciplina: McCabe-Thiele, Txy, Moody, psicrométrico, Mollier, curvas de bomba y sistema, distribución de tiempos de residencia, Arrhenius, tamaño de partícula, muerte térmica, isotermas de sorción y curvas de secado.',
      sessionNumber: 26,
      file: 'Explorador_Graficos.html',
      tags: ['comunicación visual', 'elección de gráfico', 'tarea visual', 'Cleveland-McGill', 'canónicos', 'ética de la figura', 'catálogo'],
    },
  ],
};
