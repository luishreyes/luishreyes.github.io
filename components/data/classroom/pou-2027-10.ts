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
//   · `schedule`, `cronograma`, el equipo de asistentes y las fechas esperan
//     el calendario oficial de 2027-10.
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
  'programa-del-curso', 'bitacoras-de-calculo', 'informe-final',
  'trabajo-en-equipo', 'contrato-de-equipo', 'busqueda-bibliografica',
]);

// Resúmenes de lecturas y talleres que cambiaron de caso para aceite esencial.
const RESUMENES: Record<string, string> = {
  'lectura-01-operaciones-unitarias':
    'Cómo una sola idea ordenó toda la ingeniería química, y cómo se lee con ella la planta de aceite esencial del semestre. El origen del concepto con Davis, Little y el MIT, su evolución en el siglo XX, las dos clasificaciones (por fenómeno de transporte y por tipo de operación) con las siete operaciones de la planta, y los balances de materia y energía con un ejemplo del extractor.',
  'lectura-02-diagramas-ingenieria':
    'Por qué los ingenieros de proceso dibujan sus plantas, y cómo se lee ese dibujo en sus tres niveles con una sola unidad: la de hidrodesulfuración del Manual de diagramas, dibujada como PBD con un balance de masa que cierra, como PFD con sus nueve equipos y quince corrientes, y como P&ID del separador V-201. Recorre la historia de las normas ISA-5.1 (edición vigente de 2024), BS 1553 e ISO 10628, los códigos de equipos y de servicios de Turton, la tabla de corrientes, la diferencia entre un PC y una PSV y lo que debe contener el PFD que entrega su equipo.',
  'programa-del-curso':
    'El programa completo de IQYA-2031 para 2027-10: horarios y equipo, descripción y metodología (PO-PBL y aula invertida), el reto de la planta de aceite esencial, resultados ABET, contenido por módulo, distribución de la nota, entregas por semana, escala AIAS de uso de IA y políticas del curso.',
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
  duration: '16 semanas y la 17 de pósters',

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

  modules: [
    {
      title: 'Módulo 1 · Fundamentos y diagramación',
      topics: [
        'Introducción al proyecto y formación de equipos.',
        'Diagramas de ingeniería: PBD, PFD y P&ID. El entregable es el PFD completo; el P&ID se practica en el Taller 1.',
        'Simbología: Turton e ISO 10628 para los equipos, ANSI/ISA-5.1 para los instrumentos.',
        'Materia prima y alcance del proyecto.',
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
      ],
    },
    {
      title: 'Módulo 4 · Transporte de fluidos y agitación',
      topics: [
        'Ecuación de Bernoulli y pérdidas mayores y menores.',
        'Bombas centrífugas, curvas características y NPSH.',
        'Servicios de la planta y vapor vivo.',
        'Agitación del tanque de lavado y del tanque de enfriamiento; criterios de escalado.',
      ],
    },
    {
      title: 'Módulo 5 · Transferencia de calor',
      topics: [
        'El condensador del arrastre, la carga térmica más grande de la planta.',
        'Método LMTD y efectividad-NTU.',
        'Selección y dimensionamiento.',
        'Integración energética del proceso.',
      ],
    },
    {
      title: 'Módulo 6 · Separaciones mecánicas',
      topics: [
        'Decantación de aceite y agua en el florentino.',
        'Teoría de filtración y resistencia del medio filtrante.',
        'Winterización: el enfriado y el filtro de profundidad del aceite.',
      ],
    },
    {
      title: 'Módulo 7 · Rectificación al vacío',
      topics: [
        'Equilibrio líquido-vapor (repaso).',
        'Destilación flash y diferencial.',
        'Método McCabe-Thiele y efecto de la presión.',
        'Platos y empaques, con HETP.',
        'Azeótropos.',
      ],
    },
  ],

  evaluation: pou202620Course.evaluation.map((e) =>
    e.component === 'Presentación final'
      ? { ...e, description: 'Grupos · Sustentación de pósters en la semana 17.' }
      : e,
  ),

  deliveries: {
    bitacoras: [3, 7, 10, 15].map((w, i) => ({ label: `Entrega ${i + 1}`, date: `Domingo de la semana ${w}` })),
    coevaluations: [
      ...[4, 8, 11, 16].map((w, i) => ({ label: `Coevaluación ${i + 1}`, date: `Lunes de la semana ${w}` })),
      { label: 'Coevaluación 5', date: 'Semana 17 · documento y pósters' },
    ],
    feedback: [4, 8, 11, 16].map((w, i) => ({ label: `Retroalimentación ${i + 1}`, date: `Semana ${w}` })),
  },

  policies: pou202620Course.policies.map((p) => ({
    ...p,
    items: p.items.map((it) =>
      it.startsWith('Correo del curso:')
        ? 'Correo del curso: lh.reyes@uniandes.edu.co. Los correos del equipo de asistentes se publican al iniciar el semestre.'
        : it.replace('BloqueNeón', 'Bloque Neón'),
    ),
  })),

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
    'En este curso diseñará, dimensionará y simulará una planta de aceite esencial de grado alimentario a partir de cáscara de cítricos, el residuo que deja una juguera. Bajo el enfoque de Diseño Integrado de Productos y Procesos, cada operación unitaria llega la semana en que su equipo la necesita para cerrar un balance: manejo de sólidos, transporte de fluidos, agitación, intercambio de calor, filtración y, sobre todo, destilación, que aquí no recupera un solvente sino que hace el producto. El arrastre de vapor lo extrae de la cáscara y la rectificación al vacío decide su calidad. El modelo es híbrido: aula invertida con lecturas previas, quices al iniciar clase, talleres en parejas y trabajo autónomo en equipos de 4-5 personas a lo largo de las 16 semanas.',

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
