import type { Course } from '../classroom';
import { pou202620Course } from './pou-2026-20';

// ── POU · semestre 2027-10 ──────────────────────────────────────
// Proyecto del semestre: planta de aceite esencial de cáscara de cítricos.
// Reemplaza al proyecto de pectina de 2026-20, donde la destilación solo
// recuperaba el solvente. Aquí la destilación hace el producto dos veces:
// el arrastre de vapor lo extrae y la rectificación al vacío lo especifica.
//
// SOLO EQUIPO DOCENTE. La tarjeta aparece en el índice del aula, pero la reja
// (`staffOnlyAccess`) tiene una sola puerta, la de profesor. Es una vista
// previa mientras se arma el semestre.
//
// PENDIENTE antes de abrirlo a estudiantes:
//   · `presentations` y casi todo `readings` todavía son los de pectina,
//     heredados de 2026-20. Ya son propios de 2027-10: el reto, los módulos
//     y el material de las semanas 1 a 3, más la Lectura 12 (filtración y
//     winterización), que reemplaza a la Lectura 09 de pectina.
//   · El equipo de asistentes y la monitoría están por confirmar. Las fechas
//     ya siguen el calendario académico de 2027-10 (clases del 25 de enero al
//     22 de mayo, receso del 22 al 27 de marzo): el `cronograma` lo escribe
//     scripts/pou-2027-10-cronograma.mjs, que también llena la tabla de sesiones
//     del programa y el cronograma interactivo.
//   · Evaluación rediseñada (21 nov 2026): quices con LockDown Browser, tres
//     exámenes en papel (individuales y después en pareja), tres laboratorios
//     y cinco talleres dentro de la sesión. Lo que da Fenómenos de Transporte
//     Macroscópicos (Bernoulli, LMTD, NTU, McCabe-Thiele) no se enseña de nuevo.
//   · Falta el banner propio del semestre: mientras tanto usa el de 2026-20.
// Material ya reescrito para aceite esencial: vive en /classroom/iqya-2031-2027-10/.
// Cada semana que se migra suma aquí sus ids y slugs.
const PRESENTACIONES_PROPIAS = new Set([
  'presentacion-del-curso', 'trabajo-en-equipo',
  'diagramas-ingenieria', 'pid-instrumentacion',
  'propiedades-solidos-particulados', 'reduccion-de-tamano',
]);
const LECTURAS_PROPIAS = new Set([
  'lectura-01-operaciones-unitarias',
  'lectura-02-diagramas-ingenieria', 'taller-01-analisis-de-pfd',
  'lectura-03-reduccion-tamano', 'taller-02-analisis-granulometrico',
  // Material permanente
  'programa-del-curso', 'cronograma-interactivo', 'bitacoras-de-calculo', 'informe-final',
  'trabajo-en-equipo', 'contrato-de-equipo', 'busqueda-bibliografica',
]);

// Resúmenes de lecturas y talleres que cambiaron de caso para aceite esencial.
const RESUMENES: Record<string, string> = {
  'lectura-01-operaciones-unitarias':
    'Cómo una sola idea ordenó toda la ingeniería química, y cómo se lee con ella la planta de aceite esencial del semestre. El origen del concepto con Davis, Little y el MIT, su evolución en el siglo XX, las dos clasificaciones (por fenómeno de transporte y por tipo de operación) con las siete operaciones de la planta, y los balances de materia y energía con un ejemplo del extractor.',
  'lectura-02-diagramas-ingenieria':
    'Por qué los ingenieros de proceso dibujan sus plantas, y cómo se lee ese dibujo en sus tres niveles con una sola unidad: la de hidrodesulfuración del Manual de diagramas, dibujada como PBD con un balance de masa que cierra, como PFD con sus nueve equipos y quince corrientes, y como P&ID del separador V-201. Recorre la historia de las normas ISA-5.1 (edición vigente de 2024), BS 1553 e ISO 10628, los códigos de equipos y de servicios de Turton, la tabla de corrientes, la diferencia entre un PC y una PSV y lo que debe contener el PFD que entrega su equipo.',
  'programa-del-curso':
    'El programa completo de IQYA-2031 para 2027-10: horarios y equipo, descripción y metodología (PO-PBL y aula invertida), el reto de la planta de aceite esencial, resultados ABET, los ocho módulos, el programa clase por clase, la distribución de la nota, cómo funcionan quices, exámenes, talleres y laboratorios, las fechas clave, la escala AIAS de uso de IA y las políticas del curso.',
  'cronograma-interactivo':
    'El calendario de 2027-10, semana por semana. Arriba, qué sigue: el próximo quiz, taller, laboratorio, examen y entrega, con cuenta regresiva. Abajo, las 16 semanas con quices, talleres, laboratorios, exámenes, entregas de bitácora, coevaluaciones y retroalimentaciones. Se filtra por tipo y resalta la semana actual.',
  'taller-02-analisis-granulometrico':
    'Se resuelve en un cuaderno de Google Colab, que se abre desde la página con un clic. Tres casos de la planta: la cáscara que sale del desgarrador, que se juzga contra tres criterios del extractor; dos equipos de desgarrado que compiten por preparar la carga y donde ninguno domina al otro; y una carta de control del D50 con las muestras de una semana. Incluye el ajuste de los tres modelos clásicos de distribución, log-normal, Rosin-Rammler y Gates-Gaudin-Schuhmann, y cinco preguntas de análisis con sustento bibliográfico en formato IEEE. En parejas, con pareja distinta a la del Taller 1.',
};

// Lecturas reescritas para 2027-10: su tiempo real de lectura y la fecha de la revisión.
const REVISADAS: Record<string, { readingMinutes: number; date: string; tags?: string[] }> = {
  'lectura-01-operaciones-unitarias': { readingMinutes: 25, date: '2026-10-22' },
  'lectura-02-diagramas-ingenieria': {
    readingMinutes: 42, date: '2026-10-22',
    tags: ['diagramas', 'PBD', 'PFD', 'P&ID', 'simbología', 'Turton', 'ISO 10628', 'ISA-5.1', 'HDS'],
  },
};

// Descripciones que en 2026-20 hablaban de la planta de pectina.
const DESCRIPCIONES: Record<string, string> = {
  'presentacion-del-curso':
    'La sesión inaugural completa: bienvenida y la planta de aceite esencial, equipo docente, objetivos y resultados ABET, las ocho estaciones del proceso, metodología, módulos y ritmo del semestre, evaluación, uso de IA y expectativas.',
  'diagramas-ingenieria':
    'PBD, PFD y P&ID: el lenguaje visual de la ingeniería química. Simbología de equipos (Turton e ISO 10628), codificación de equipos y corrientes, balance de masa con cierre de ±1 % y buenas prácticas, con la unidad de hidrodesulfuración del Manual de diagramas como ejemplo.',
  'pid-instrumentacion':
    'Simbología ANSI/ISA-5.1-2024 para instrumentación, lazos de control, seguridad (PSV) y cómo una bomba del PFD se vuelve su P&ID, con la unidad de hidrodesulfuración del Manual de diagramas como ejemplo.',
  'trabajo-en-equipo':
    'Qué distingue a un equipo que funciona, cómo la coevaluación convierte la nota del equipo en una nota individual para cada integrante, con un ejemplo que se mueve en vivo, y las ocho secciones del contrato que cada equipo firma en clase.',
};

// Lo que todavía no se sabe de 2027-10 (equipo de asistentes, fechas) va
// «por confirmar», y las entregas se fijan por semana hasta que salga el
// calendario.
const POR_CONFIRMAR = 'Por confirmar';

export const pou202710Course: Course = {
  ...pou202620Course,

  slug: 'iqya-2031-2027-10',
  term: '2027-10',
  // La tarjeta SÍ aparece en el índice del aula: el profesor necesita poder
  // entrar al curso desde ahí. Lo que restringe el acceso es la reja, no
  // esconder el curso.
  //
  // Solo entra el equipo docente: la reja muestra una sola puerta y pide
  // el código del equipo docente (`staffAccessHash`), el mismo del semestre
  // anterior. Un estudiante que
  // llegue a la tarjeta ve que el semestre se está armando y no pasa.
  staffOnlyAccess: true,
  identidad: 'uniandes',
  duration: '16 semanas y la de finales, con los pósters',

  team: [
    pou202620Course.team[0],
    { name: POR_CONFIRMAR, role: 'Asistente', email: '' },
    { name: POR_CONFIRMAR, role: 'Monitoría', email: '' },
  ],

  objectives: pou202620Course.objectives.map((o) => o.replace('(BFD, PFD, P&ID)', '(PBD, PFD y P&ID)')),

  abet: {
    ...pou202620Course.abet,
    outcomes: pou202620Course.abet.outcomes.map((o, i) =>
      i === 0
        ? {
            ...o,
            indicators: o.indicators.map((ind) =>
              ind.startsWith('1.1.1')
                ? '1.1.1 Define el problema de diseño de la planta de aceite esencial, con sus dos destilaciones: el arrastre de vapor y la rectificación al vacío.'
                : ind,
            ),
          }
        : o,
    ),
  },

  // Ocho módulos. El 4, el 6 y parte del 8 cambiaron para no repetir lo que
  // da Fenómenos de Transporte Macroscópicos el mismo semestre.
  modules: [
    {
      title: 'Módulo 1 · Diagramas',
      topics: [
        'Introducción al proyecto y formación de equipos.',
        'Materia prima y alcance del proyecto.',
        'Diagramas de ingeniería: PBD, PFD y P&ID. El entregable es el PFD completo; el P&ID se practica en el Taller 1.',
        'Simbología: Turton e ISO 10628 para los equipos, ANSI/ISA-5.1 para los instrumentos.',
      ],
    },
    {
      title: 'Módulo 2 · Manejo de sólidos',
      topics: [
        'Caracterización y propiedades de sólidos.',
        'Distribución de tamaños de partícula.',
        'Teoría y equipos de reducción de tamaño.',
        'Desgarrado de la cáscara húmeda y potencia del molino de cuchillas.',
      ],
    },
    {
      title: 'Módulo 3 · Arrastre de vapor',
      topics: [
        'Equilibrio de líquidos inmiscibles.',
        'Relación de vapor e hidrodifusión del aceite en la cáscara.',
        'Diseño del extractor.',
        'Laboratorio 1: arrastre de vapor en Clevenger.',
      ],
    },
    {
      title: 'Módulo 4 · Bombas, válvulas y control',
      topics: [
        'Tipos y mecanismos de bombas: centrífugas y de desplazamiento positivo.',
        'Selección en catálogo, leyes de afinidad, bombas en serie y en paralelo, corrección por viscosidad.',
        'Válvulas según el servicio; válvula de control (Cv, característica y autoridad).',
        'Estrategia de control y sistemas de vacío para la columna.',
      ],
    },
    {
      title: 'Módulo 5 · Agitación',
      topics: [
        'Impulsores y número de potencia.',
        'Suspensión de sólidos y dispersión de gotas.',
        'Criterios de escalado del tanque de lavado y del tanque de enfriamiento.',
        'Laboratorio 2: tamaño de gota de una emulsión contra la velocidad de agitación.',
      ],
    },
    {
      title: 'Módulo 6 · Calor en la planta',
      topics: [
        'El condensador del arrastre: condensación con gases no condensables.',
        'Refrigeración por compresión de vapor: el enfriado de la winterización.',
        'Servicios de planta: vapor, trampas y agua de enfriamiento.',
        'Integración energética del proceso.',
      ],
    },
    {
      title: 'Módulo 7 · Separaciones mecánicas',
      topics: [
        'Decantación de aceite y agua en el florentino.',
        'Filtración con torta y resistencia del medio filtrante.',
        'Winterización: el enfriado y el filtro de profundidad del aceite.',
      ],
    },
    {
      title: 'Módulo 8 · Destilación del producto',
      topics: [
        'Destilación por lotes y políticas de reflujo.',
        'Vacío, efecto de la presión y azeótropos.',
        'Platos y empaques: inundación, diámetro, caída de presión y HETP.',
        'Laboratorio 3: destilación por lotes en modo de olla y en modo de reflujo.',
      ],
    },
  ],

  evaluation: [
    { component: 'Quices', percentage: 10, description: 'Individual · Trece, al empezar la clase, con LockDown Browser.' },
    { component: 'Exámenes', percentage: 25, description: 'Individual, con etapa en pareja · Tres, en papel y con calculadora.' },
    { component: 'Laboratorios', percentage: 15, description: 'Equipo, con prelaboratorio y pregunta oral individuales · Tres prácticas con memorando.' },
    { component: 'Talleres en clase', percentage: 10, description: 'Parejas, con boleto de salida individual · Cinco, dentro de la sesión.' },
    { component: 'Bitácoras de cálculo', percentage: 15, description: 'Grupos · 4 entregas durante el semestre.' },
    { component: 'Sustentaciones de seguimiento', percentage: 10, description: 'Grupos · 4 durante el semestre.' },
    { component: 'Proyecto final', percentage: 10, description: 'Grupos · Documento técnico.' },
    { component: 'Póster', percentage: 5, description: 'Grupos · Sesión de pósters en la semana de finales.' },
  ],

  aias: {
    ...pou202620Course.aias!,
    levels: [
      { level: 1, title: 'Sin IA', description: 'No se permite uso de IA.', application: 'Quices, exámenes, prelaboratorios y talleres en papel.' },
      { level: 2, title: 'IA para ideas', description: 'IA para generar ideas y estructurar.', application: 'Taller 2, en Colab.' },
      { level: 3, title: 'IA para edición', description: 'IA para refinar y mejorar claridad.', application: 'Memorandos de laboratorio, bitácoras, proyecto final y póster.' },
      { level: 4, title: 'IA con evaluación', description: 'IA para tareas con evaluación crítica.', application: 'No aplica en este curso.' },
      { level: 5, title: 'Uso completo', description: 'IA integral a discreción.', application: 'No aplica en este curso.' },
    ],
  },

  deliveries: {
    bitacoras: [
      { label: 'Entrega 1', date: 'Domingo 14 de febrero' },
      { label: 'Entrega 2', date: 'Domingo 14 de marzo' },
      { label: 'Entrega 3', date: 'Domingo 18 de abril' },
      { label: 'Entrega 4', date: 'Domingo 16 de mayo' },
    ],
    coevaluations: [
      { label: 'Coevaluación 1', date: 'Lunes 15 de febrero' },
      { label: 'Coevaluación 2', date: 'Lunes 15 de marzo' },
      { label: 'Coevaluación 3', date: 'Lunes 19 de abril' },
      { label: 'Coevaluación 4', date: 'Lunes 17 de mayo' },
      { label: 'Coevaluación 5', date: 'Semana de finales · documento y pósters' },
    ],
    feedback: [
      { label: 'Retroalimentación 1', date: 'Jueves 18 de febrero' },
      { label: 'Retroalimentación 2', date: 'Martes 30 de marzo' },
      { label: 'Retroalimentación 3', date: 'Jueves 22 de abril' },
      { label: 'Retroalimentación 4', date: 'Jueves 20 de mayo' },
    ],
  },

  // CRONOGRAMA_START
  // Escrito por scripts/pou-2027-10-cronograma.mjs: no editar a mano.
  cronograma: [
    { date: '2027-01-26', day: 'Martes', week: 1, topic: 'Presentación del curso', details: ['El reto: la planta de aceite esencial', 'Metodología, evaluación y uso de IA'], proyecto: 'Publicación del reto del semestre' },
    { date: '2027-01-28', day: 'Jueves', week: 1, topic: 'Equipos, coevaluación y contrato', details: ['Quiz de práctica con LockDown Browser, sin nota'] },
    { date: '2027-02-02', day: 'Martes', week: 2, topic: 'Diagramas de ingeniería: PBD, PFD y P&ID', details: ['Simbología de equipos e instrumentos', 'Codificación de equipos y corrientes'], quiz: 'Quiz 1' },
    { date: '2027-02-04', day: 'Jueves', week: 2, topic: 'Taller 1: análisis de un PFD con errores', details: ['Un plano distinto por pareja'], taller: 'Taller 1' },
    { date: '2027-02-09', day: 'Martes', week: 3, topic: 'Sólidos: caracterización, granulometría y reducción de tamaño', details: ['Distribuciones de tamaño', 'Desgarrado de la cáscara húmeda'], quiz: 'Quiz 2' },
    { date: '2027-02-11', day: 'Jueves', week: 3, topic: 'Taller 2: análisis granulométrico', details: ['En Colab, con datos por pareja'], taller: 'Taller 2', proyecto: 'Bitácora 1: domingo 14 de febrero · Coevaluación: lunes 15 de febrero' },
    { date: '2027-02-16', day: 'Martes', week: 4, topic: 'Arrastre de vapor', details: ['Equilibrio de líquidos inmiscibles', 'Relación de vapor e hidrodifusión', 'Diseño del extractor'], quiz: 'Quiz 3' },
    { date: '2027-02-18', day: 'Jueves', week: 4, topic: 'Retroalimentación 1', details: ['Sustentación de la Bitácora 1 por equipos'] },
    { date: '2027-02-23', day: 'Martes', week: 5, topic: 'Laboratorio 1: arrastre de vapor', details: ['Primera mitad de los equipos', 'Clevenger con cáscara de naranja'], laboratorio: 'Laboratorio 1' },
    { date: '2027-02-25', day: 'Jueves', week: 5, topic: 'Laboratorio 1: arrastre de vapor', details: ['Segunda mitad de los equipos', 'Clevenger con cáscara de naranja'], laboratorio: 'Laboratorio 1' },
    { date: '2027-03-02', day: 'Martes', week: 6, topic: 'Bombas: tipos, mecanismos y selección', details: ['Centrífugas y de desplazamiento positivo', 'Leyes de afinidad, serie y paralelo', 'Corrección por viscosidad'], quiz: 'Quiz 4' },
    { date: '2027-03-04', day: 'Jueves', week: 6, topic: 'Válvulas, control y vacío', details: ['Válvulas según el servicio', 'Válvula de control: Cv, característica y autoridad', 'Sistemas de vacío para la columna'], quiz: 'Quiz 5', proyecto: 'Memorando del Laboratorio 1: domingo 7 de marzo' },
    { date: '2027-03-09', day: 'Martes', week: 7, topic: 'Agitación y escalado', details: ['Impulsores y número de potencia', 'Suspensión y dispersión de gotas', 'Criterios de escalado'], quiz: 'Quiz 6' },
    { date: '2027-03-11', day: 'Jueves', week: 7, topic: 'Laboratorio 2: agitación y emulsión', details: ['Todos los equipos', 'Tamaño de gota en el Mastersizer'], laboratorio: 'Laboratorio 2', proyecto: 'Bitácora 2: domingo 14 de marzo · Coevaluación: lunes 15 de marzo' },
    { date: '2027-03-16', day: 'Martes', week: 8, topic: 'Taller 3: hoja de datos de una bomba y su válvula de control', details: ['Con catálogos impresos'], taller: 'Taller 3' },
    { date: '2027-03-18', day: 'Jueves', week: 8, topic: 'Examen 1: arrastre de vapor, bombas, válvulas, control y vacío', details: ['En papel: primero individual y después en pareja'], examen: 'Examen 1', proyecto: 'Memorando del Laboratorio 2: domingo 21 de marzo' },
    { date: '2027-03-30', day: 'Martes', week: 9, topic: 'Retroalimentación 2', details: ['Sustentación de la Bitácora 2 por equipos'] },
    { date: '2027-04-01', day: 'Jueves', week: 9, topic: 'Condensación y decantación', details: ['El condensador del arrastre', 'Gases no condensables y venteo', 'El decantador florentino'], quiz: 'Quiz 7' },
    { date: '2027-04-06', day: 'Martes', week: 10, topic: 'Refrigeración', details: ['Ciclo de compresión de vapor', 'El enfriado de la winterización'], quiz: 'Quiz 8' },
    { date: '2027-04-08', day: 'Jueves', week: 10, topic: 'Filtración y winterización', details: ['Ley de Darcy, torta y medio filtrante', 'Filtración de profundidad'], quiz: 'Quiz 9' },
    { date: '2027-04-13', day: 'Martes', week: 11, topic: 'Taller 4: el filtro de la winterización y el florentino', details: ['Con datos por pareja'], taller: 'Taller 4' },
    { date: '2027-04-15', day: 'Jueves', week: 11, topic: 'Servicios de planta e integración energética', details: ['Vapor, trampas y agua de enfriamiento', 'Recuperación de calor'], quiz: 'Quiz 10', proyecto: 'Bitácora 3: domingo 18 de abril · Coevaluación: lunes 19 de abril' },
    { date: '2027-04-20', day: 'Martes', week: 12, topic: 'Examen 2: condensación, refrigeración, separaciones mecánicas y servicios', details: ['En papel: primero individual y después en pareja'], examen: 'Examen 2' },
    { date: '2027-04-22', day: 'Jueves', week: 12, topic: 'Retroalimentación 3', details: ['Sustentación de la Bitácora 3 por equipos'] },
    { date: '2027-04-27', day: 'Martes', week: 13, topic: 'Destilación por lotes', details: ['Ecuación de Rayleigh', 'Políticas de reflujo'], quiz: 'Quiz 11' },
    { date: '2027-04-29', day: 'Jueves', week: 13, topic: 'Laboratorio 3: destilación por lotes', details: ['Primera mitad de los equipos', 'Air Still Pro en modo de olla y en modo de reflujo'], laboratorio: 'Laboratorio 3' },
    { date: '2027-05-04', day: 'Martes', week: 14, topic: 'Laboratorio 3: destilación por lotes', details: ['Segunda mitad de los equipos', 'Air Still Pro en modo de olla y en modo de reflujo'], laboratorio: 'Laboratorio 3' },
    { date: '2027-05-06', day: 'Jueves', week: 14, topic: 'Vacío y azeótropos', details: ['Efecto de la presión', 'Azeótropos y destilación especial'], quiz: 'Quiz 12', proyecto: 'Memorando del Laboratorio 3: domingo 9 de mayo' },
    { date: '2027-05-11', day: 'Martes', week: 15, topic: 'Platos y empaques', details: ['Inundación y diámetro', 'Caída de presión', 'HETP'], quiz: 'Quiz 13' },
    { date: '2027-05-13', day: 'Jueves', week: 15, topic: 'Taller 5: ¿platos o empaque para la columna al vacío?', details: ['Con la carta de Fair'], taller: 'Taller 5', proyecto: 'Bitácora 4: domingo 16 de mayo · Coevaluación: lunes 17 de mayo' },
    { date: '2027-05-18', day: 'Martes', week: 16, topic: 'Examen 3: destilación por lotes, vacío y azeótropos, platos y empaques', details: ['En papel: primero individual y después en pareja'], examen: 'Examen 3' },
    { date: '2027-05-20', day: 'Jueves', week: 16, topic: 'Retroalimentación 4', details: ['Sustentación de la Bitácora 4 por equipos'] },
    { date: '2027-05-25', day: 'Martes', week: 17, topic: 'Sesión de pósters', details: ['Semana de finales: fecha y salón según la programación de finales'], proyecto: 'Documento final y póster · Coevaluación 5' },
  ],
  // CRONOGRAMA_END

  // Con el nuevo formato, exámenes y talleres se cierran en la sesión, los
  // laboratorios tienen reglas propias y la demora se penaliza en memorandos
  // y documento final.
  policies: [
    ...pou202620Course.policies.map((p) => ({
      ...p,
      items: p.items.map((it) =>
        it.startsWith('Correo del curso:')
          ? 'Correo del curso: lh.reyes@uniandes.edu.co. Los correos del equipo de asistentes se publican al iniciar el semestre.'
          : it.startsWith('La asistencia a las sesiones magistrales')
          ? 'La asistencia a las clases es obligatoria (control diario).'
          : it.startsWith('Talleres y documento final')
          ? 'Memorandos de laboratorio y documento final: -1 unidad por cada 15 minutos de demora.'
          : it.replace('BloqueNeón', 'Bloque Neón'),
      ),
    })),
    {
      category: 'Exámenes y talleres',
      items: [
        'Se entregan al final de la sesión, sin prórroga.',
        'Exámenes en papel, con calculadora científica no programable; sin computador, celular ni apuntes.',
        'La ausencia a un examen se maneja según el Reglamento General de Estudiantes de Pregrado.',
      ],
    },
    {
      category: 'Laboratorios',
      items: [
        'Sin prelaboratorio no se entra a la práctica.',
        'En el laboratorio se usan bata, gafas y zapato cerrado.',
        'El memorando parte de la hoja de datos firmada por el asistente; sin ella no se califica.',
      ],
    },
  ],

  community: pou202620Course.community.map((c) => ({
    ...c,
    items: c.items.map((it) =>
      it.startsWith('La fecha límite para retirarse')
        ? 'La fecha límite para retirarse del curso la fija el calendario académico de 2027-10 (por confirmar).'
        : it === 'Informa al profesor en las primeras dos semanas.'
        ? 'Informe al profesor en las primeras dos semanas.'
        : it,
    ),
  })),

  tagline:
    'Diseñe una planta de aceite esencial a partir de cáscara de cítricos',
  description:
    'En este curso diseñará, dimensionará y simulará una planta de aceite esencial de grado alimentario a partir de cáscara de cítricos, el residuo que deja una juguera. Bajo el enfoque de Diseño Integrado de Productos y Procesos, cada operación unitaria llega la semana en que su equipo la necesita para cerrar un balance: manejo de sólidos, transporte de fluidos, agitación, intercambio de calor, filtración y, sobre todo, destilación, que aquí no recupera un solvente sino que hace el producto. El arrastre de vapor lo extrae de la cáscara y la rectificación al vacío decide su calidad. El modelo es híbrido: aula invertida con lecturas previas, quices al iniciar clase, talleres en pareja dentro de la sesión, tres laboratorios, tres exámenes en papel y trabajo autónomo en equipos de 4-5 personas a lo largo de las 16 semanas.',

  // Hereda el banner de 2026-20 hasta que exista public/classroom/iqya-2031-2027-10/banner.jpg.
  bannerUrl: '/classroom/iqya-2031-2026-20/banner.jpg',

  challenges: {
    label: 'Hervir a 98 lo que hierve a 176',
    term: '2027-10',
    eyebrow: 'Reto del semestre',
    description:
      'Diseñe y dimensione una planta que extrae aceite esencial de la cáscara que deja una juguera. Abra la guía completa del proyecto.',
    href: '/classroom/iqya-2031-2027-10/reto-aceite-esencial.html',
  },

  project: {
    ...pou202620Course.project!,
    title: 'Planta de aceite esencial de cáscara de cítricos',
    overview:
      'Diseño integral de una planta que toma la cáscara que deja una juguera, con 70 a 75 % de humedad y entre 0,5 y 3 % de aceite esencial en base húmeda, y la lleva hasta aceite rectificado. El proceso físico tiene siete pasos: lavado y acondicionamiento, desgarrado a 5 a 10 mm, arrastre de vapor, condensación, decantador florentino, winterización a 5 a 10 °C y rectificación al vacío entre 10 y 20 mbar. La decisión que se toma en el desgarrado reaparece en el rendimiento del arrastre, y la pureza que se le exija a la columna es una decisión económica, no un número dado.',
    rawMaterials: [
      { name: 'Cáscara de lima Tahití', outcome: 'Residuo de exportación colombiano · aceite destilado de grado comercial' },
      { name: 'Cáscara de naranja Valencia', outcome: 'Mayor volumen disponible · aceite con 90 a 95 % de limoneno' },
      { name: 'Cáscara de mandarina', outcome: 'Perfil de oxigenados distinto · afecta el corte de la columna' },
      { name: 'Cáscara de toronja', outcome: 'Menor rendimiento, mayor valor por nota aromática' },
    ],
    // Formato «Etapa · Operación»: el landing de 2027-10 lo parte en dos.
    scope: [
      'Selección y caracterización de la materia prima · Materia prima',
      'Diagramas del proceso: el PFD completo · Diagramas',
      'Lavado, acondicionamiento y desgarrado · Sólidos y agitación',
      'Arrastre de vapor: el extractor · Destilación',
      'Transporte de fluidos y servicios · Fluidos',
      'Condensación y decantador florentino · Calor y decantación',
      'Winterización: enfriado y filtrado del aceite · Separaciones mecánicas',
      'Rectificación al vacío: la columna que hace el producto · Destilación',
    ],
  },

  // Presentaciones y simuladores se heredan apuntando a la carpeta de 2026-20,
  // donde están sus archivos: el sitio arma su ruta con el slug del curso, y
  // copiar `slides/` duplicaría 240 MB. Al actualizar una pieza para 2027-10 y
  // publicarla en la carpeta propia, se le quita `carpeta`.
  presentations: pou202620Course.presentations.map((p) =>
    PRESENTACIONES_PROPIAS.has(p.id)
      ? { ...p, description: DESCRIPCIONES[p.id] ?? p.description }
      : { ...p, carpeta: 'iqya-2031-2026-20' },
  ),
  // Los simuladores se sirven desde 2026-20, salvo los que ya tienen versión
  // 2027-10. El de molienda trae la cáscara húmeda y el molino de cuchillas;
  // el Manual de diagramas es el mismo, con sus ejemplos de pectina pasados a
  // la unidad HDS o al proyecto de cada equipo.
  simulations: (pou202620Course.simulations ?? []).map((sim) =>
    sim.id === 'manual-diagramas'
      ? sim
      : sim.id === 'explorador-molienda'
      ? {
          ...sim,
          description:
            'Seleccione un equipo de reducción de tamaño y véalo operar, con su animación de física de partículas. Arranca con la cáscara cítrica húmeda de la planta de aceite esencial en un molino de cuchillas: el rotor corta contra las cuchillas fijas de la carcasa y la criba fija el tamaño. Esa cáscara no tiene índice de Bond, así que su energía se fija por consumo específico, entre 5 y 20 kWh/t, y se pasa a sólido seco con su agua; si la pone en un molino de impacto o de compresión, el simulador la marca inviable. Con los demás materiales (caliza, carbón, maíz, azúcar, arcilla y cáscara seca) calcula la energía con la Ley de Bond y los factores de Rowland, compara Bond, Kick y Rittinger, lleva la energía hasta el motor estándar IEC y resuelve el balance térmico. La granulometría usa Rosin-Rammler con tamizado ASTM E11 o Tyler y una tamizadora animada.',
        }
      : { ...sim, carpeta: 'iqya-2031-2026-20' },
  ),

  // La metodología es la misma; solo cambia de qué planta se habla.
  methodology: {
    ...pou202620Course.methodology,
    summary:
      'Aprendizaje orientado a proyectos y basado en problemas (PO-PBL), con aula invertida. Durante todo el semestre su equipo diseña una planta real: la que saca aceite esencial de la cáscara de cítricos que deja una juguera. El proyecto le da contexto a cada tema, y cada tema llega la semana en que su equipo lo va a usar.',
    phases: pou202620Course.methodology.phases.map((f) => ({
      ...f,
      items: f.items.map((it) =>
        it === 'Aplicación de los conceptos al diseño de la planta de pectina.'
          ? 'Aplicación de los conceptos al diseño de la planta de aceite esencial.'
          : it === 'Taller en parejas con problemas reales.'
          ? 'Taller en pareja dentro de la sesión, laboratorio o examen en papel.'
          : it,
      ),
    })),
  },

  // Salvo lo que nombran PRESENTACIONES_PROPIAS y LECTURAS_PROPIAS, el material
  // todavía es el de pectina: se hereda del semestre anterior y los enlaces apuntan a /classroom/iqya-2031-2026-20/, donde los
  // archivos ya están. No se duplican 302 MB en el repositorio para una vista
  // previa. A medida que se escriba el material de aceite esencial, cada
  // entrada se copia a /classroom/iqya-2031-2027-10/ y se le cambia el enlace.
  //
  // OJO: mientras tanto, esos documentos son los MISMOS del curso vivo.
  // Editarlos desde aquí cambia lo que ven los estudiantes de 2026-20.
  readings: [
    {
      slug: 'pagina-del-curso',
      title: 'Página del curso',
      summary:
        'Qué se diseña este semestre, el tren de proceso de la planta de aceite esencial, cómo se trabaja en clase y cómo se califica.',
      date: '2026-10-17',
      category: 'guia',
      href: '/classroom/iqya-2031-2027-10/pagina.html',
    },
    ...pou202620Course.readings.map((r) =>
      LECTURAS_PROPIAS.has(r.slug)
        ? {
            ...r,
            summary: RESUMENES[r.slug] ?? r.summary,
            ...REVISADAS[r.slug],
            href: r.href?.replace('/iqya-2031-2026-20/', '/iqya-2031-2027-10/'),
          }
        : r.slug === 'reto-pectina'
        ? {
            ...r,
            slug: 'reto-aceite-esencial',
            title: 'Guía del reto: hervir a 98 lo que hierve a 176',
            summary:
              'La guía del proyecto semestral: diseñar y dimensionar una planta que extrae aceite esencial de la cáscara de cítricos que deja una juguera. Las ocho etapas a integrar, cómo elegir la materia prima, por qué el extractor pide cincuenta veces más vapor que el equilibrio, qué validar en ASPEN Plus y dónde no confiar, los entregables y la rúbrica de cada bitácora.',
            date: '2026-10-17',
            tags: ['proyecto', 'reto', 'aceite esencial', 'guía'],
            href: '/classroom/iqya-2031-2027-10/reto-aceite-esencial.html',
          }
        : r.slug === 'lectura-09-filtracion'
        ? {
            // La filtración de 2027-10 es su propia Lectura 12 (filtración y
            // winterización), no la Lectura 09 de pectina. Conserva el banner
            // de filtración de 2026-20 mientras no haya uno propio.
            ...r,
            slug: 'lectura-12-filtracion-winterizacion',
            order: 12,
            week: 9,
            title: 'Filtración industrial y winterización',
            summary:
              'La barrera porosa que separa sólidos y gotas de un líquido: mecanismos de retención, la ley de Darcy con la resistencia de la torta y la del medio, el ensayo a presión constante, la compresibilidad, los equipos, los medios y las ayudas filtrantes. Después, la filtración de profundidad con cartuchos y placas (retención nominal y absoluta, razón beta, caída de presión limpia, ensayos de capacidad y cambio del medio) y la winterización de la planta: enfriar el aceite del florentino a 5-10 °C y pasarlo por un filtro de profundidad para quitarle el agua y la turbidez. No es un desencerado.',
            date: '2026-10-23',
            readingMinutes: 45,
            tags: ['filtración', 'ley de Darcy', 'torta', 'resistencia del medio', 'filtración de profundidad', 'cartuchos', 'placas filtrantes', 'razón beta', 'winterización', 'aceite esencial'],
            href: '/classroom/iqya-2031-2027-10/lecturas/Lectura_12/Lectura_12_Filtracion.html',
          }
        : r,
    ),
  ],
};
