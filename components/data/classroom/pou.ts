import type { Course } from '../classroom';

export const pouCourse: Course = {
  slug: 'iqya-2031',
  code: 'IQYA-2031',
  title: 'Proyecto de Operaciones Unitarias',
  term: '2026-10',
  credits: 3,
  modality: 'Presencial',
  duration: '16 semanas',
  tagline: 'Diseño integral de una planta de producción de alcohol',
  description:
    'En este curso diseñarás, dimensionarás y simularás una planta completa de producción de alcohol a partir de materias primas renovables colombianas. Desde los diagramas de ingeniería hasta la torre de destilación, pasando por manejo de sólidos, transporte de fluidos, agitación, intercambio de calor y filtración — cada semana aplicas lo aprendido directamente en tu proyecto. El modelo es híbrido: aula invertida con podcasts y lecturas previas, quices al iniciar clase, talleres prácticos en parejas y trabajo autónomo en equipos de 4-5 personas a lo largo de las 16 semanas.',
  accessCode: 'POU202610',
  bannerUrl:
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1920&auto=format&fit=crop',
  pillars: [
    {
      title: 'Innovación',
      description:
        'Desarrollo ágil de prototipos viables, aplicando un enfoque multiescala.',
    },
    {
      title: 'Creatividad',
      description:
        'Motor de la identificación de oportunidades y generación de ideas.',
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
        'Viernes 8 am - 12 m, con cita previa por correo electrónico',
    },
    {
      name: 'Andrés F. Infante',
      role: 'Asistente',
      email: 'af.infante@uniandes.edu.co',
      officeHours: 'Jueves 4:00 pm - 5:30 pm',
    },
    {
      name: 'Dana Catalina Mora',
      role: 'Monitora',
      email: 'dc.morat1@uniandes.edu.co',
      officeHours: 'Martes 3:00 pm - 4:30 pm',
    },
  ],
  schedule: [
    { label: 'Magistral', detail: 'Martes 11:00 am - 12:20 pm · LL_202' },
    { label: 'Magistral', detail: 'Jueves 11:00 am - 12:20 pm · RGD_210' },
    { label: 'Trabajo asistido', detail: 'Lunes 15:30 - 16:50 · SD_402' },
  ],
  objectives: [
    'Diseñar y dimensionar operaciones unitarias básicas para un proceso químico integral, desde el manejo de sólidos hasta la separación final por destilación.',
    'Elaborar e interpretar diagramas de ingeniería profesionales (PBD, PFD, P&ID) siguiendo estándares industriales.',
    'Calcular y especificar equipos de proceso considerando criterios técnicos, económicos y de sostenibilidad.',
    'Simular procesos completos utilizando ASPEN Plus, validando los cálculos manuales realizados.',
    'Documentar técnicamente el diseño mediante bitácoras de cálculo profesionales y reportes ejecutivos.',
    'Trabajar colaborativamente en equipos, gestionando el tiempo y los recursos efectivamente.',
    'Aplicar pensamiento crítico en la selección de alternativas de diseño y solución de problemas.',
    'Comunicar efectivamente resultados técnicos a audiencias diversas mediante informes escritos y presentaciones orales.',
  ],
  methodology: {
    summary:
      'Modelo híbrido Project Oriented-Problem Based Learning (PO-PBL) + aula invertida. Los estudiantes desarrollan durante todo el semestre el diseño completo de una planta de producción de alcohol por destilación.',
    phases: [
      {
        label: 'Antes (3 h semanales)',
        title: 'Preparación individual',
        items: [
          'Podcast: material audiovisual del profesor sobre el tema.',
          'Lectura complementaria al podcast.',
          'Llegar a clase con comprensión básica del tema.',
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
          'Aplicación de conceptos al diseño del proceso del proyecto.',
          'Búsqueda de información en bases de datos técnicas.',
          'Documentación y desarrollo de bitácoras de cálculo.',
        ],
      },
    ],
    synergies: [
      'El proyecto da contexto al contenido: podcasts y lecturas están ligados al avance del diseño.',
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
          '1.1.1 Define el problema de diseño del proceso de fermentación-destilación.',
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
    title: 'Planta de producción de alcohol por destilación',
    overview:
      'Diseño integral de una planta a partir de la fermentación de materias primas renovables colombianas.',
    rawMaterials: [
      { name: 'Arroz (de rechazo o partido)', outcome: 'Shochu o alcohol neutro' },
      { name: 'Ñame', outcome: 'Alcohol industrial' },
      { name: 'Mucílago y pulpa de café', outcome: 'Bioetanol de residuos cafeteros' },
      { name: 'Piña (corazones y cáscaras)', outcome: 'Destilado tropical' },
      { name: 'Remolacha forrajera', outcome: 'Alcohol industrial' },
    ],
    scope: [
      'Selección y justificación de materia prima.',
      'Diseño del proceso de fermentación (simplificado).',
      'Dimensionamiento de equipos de manejo de sólidos.',
      'Sistema completo de transporte de fluidos.',
      'Diseño de agitadores para fermentadores.',
      'Red de intercambiadores de calor.',
      'Sistema de separación sólido-líquido.',
      'Torre de destilación para purificación final.',
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
        'Cálculos de potencia y selección de molinos.',
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
        'Diseño de sistemas de mezclado para fermentadores.',
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
        'Separación de biomasa fermentada.',
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
        'Control y operación de torres.',
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
      { label: 'Entrega 1', date: '8 de febrero' },
      { label: 'Entrega 2', date: '8 de marzo' },
      { label: 'Entrega 3', date: '12 de abril' },
      { label: 'Entrega 4', date: '10 de mayo' },
    ],
    coevaluations: [
      { label: 'Coevaluación 1', date: '9 de febrero' },
      { label: 'Coevaluación 2', date: '9 de marzo' },
      { label: 'Coevaluación 3', date: '13 de abril' },
      { label: 'Coevaluación 4', date: '11 de mayo' },
      { label: 'Coevaluación 5', date: 'Semana 17' },
    ],
    feedback: [
      { label: 'Retroalimentación 1', date: '12 de febrero' },
      { label: 'Retroalimentación 2', date: '12 de marzo' },
      { label: 'Retroalimentación 3', date: '16 de abril' },
      { label: 'Retroalimentación 4', date: '12 y 14 de mayo' },
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
      'En total, 5 evaluaciones durante el semestre (una por bitácora y una tras el documento final y sustentación).',
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
        'La asistencia a las sesiones magistrales es obligatoria (control diario).',
        'Los quices se realizan al inicio de clase sin excepción.',
        'Ausencias justificadas deben reportarse con anticipación.',
      ],
    },
    {
      category: 'Entregas',
      items: [
        'Todas las entregas se realizan a través de Bloque Neón.',
        'No se aceptan entregas tardías en quices (penalización del 100%).',
        'No hay supletorio de quices. Con excusa válida, el siguiente quiz vale el doble.',
        'Talleres y documento final: -1 unidad por cada 15 minutos de demora.',
        'Las bitácoras y la entrega final deben seguir el formato establecido.',
      ],
    },
    {
      category: 'Comunicación',
      items: [
        'Correo del curso: af.infante@uniandes.edu.co, dc.morat1@uniandes.edu.co, lh.reyes@uniandes.edu.co.',
        'El asunto del correo debe incluir: [IQYA-2031] – Tema.',
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
        'La fecha límite para retirarse del curso es la semana 11.',
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
  readings: [
    {
      slug: 'bienvenida-pou',
      title: 'Bienvenida al curso POU',
      summary:
        'Orientación general, recomendaciones para la primera semana y cómo usar este portal durante el semestre.',
      date: '2026-01-19',
      readingMinutes: 5,
      tags: ['bienvenida', 'logística'],
    },
    {
      slug: 'trabajo-en-equipo',
      title: 'Trabajo en equipo: guía práctica para el proyecto',
      summary:
        'Principios de equipos efectivos, normas de convivencia, roles, resolución de conflictos y evaluación entre pares para el proyecto de Operaciones Unitarias.',
      date: '2026-01-26',
      readingMinutes: 20,
      tags: ['equipos', 'gestión de proyectos', 'soft skills'],
    },
  ],
  presentations: [
    {
      id: 'clase-01-intro',
      title: 'Clase 1 · Introducción al curso y al proyecto',
      sessionNumber: 1,
      description:
        'Presentación de bienvenida: DIPP, metodología PO-PBL + aula invertida, y formación de equipos.',
      file: 'clase-01-intro.html',
    },
  ],
};
