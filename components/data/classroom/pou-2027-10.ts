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
//   · `modules`, `presentations` y casi todo `readings` todavía son los de
//     pectina, heredados de 2026-20. Ya es propio de 2027-10: el reto.
//   · `schedule` y `cronograma` esperan el calendario oficial de 2027-10.
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
  'programa-del-curso':
    'El programa completo de IQYA-2031 para 2027-10: horarios y equipo, descripción y metodología (PO-PBL y aula invertida), el reto de la planta de aceite esencial, resultados ABET, contenido por módulo, distribución de la nota, entregas por semana, escala AIAS de uso de IA y políticas del curso.',
  'taller-02-analisis-granulometrico':
    'Se resuelve en un cuaderno de Google Colab, que se abre desde la página con un clic. Tres casos de la planta: la cáscara que sale del desgarrador, que se juzga contra tres criterios del extractor; dos equipos de desgarrado que compiten por preparar la carga y donde ninguno domina al otro; y una carta de control del D50 con las muestras de una semana. Incluye el ajuste de los tres modelos clásicos de distribución, log-normal, Rosin-Rammler y Gates-Gaudin-Schuhmann, y cinco preguntas de análisis con sustento bibliográfico en formato IEEE. En parejas, con pareja distinta a la del Taller 1.',
};

// Lecturas reescritas para 2027-10: su tiempo real de lectura y la fecha de la revisión.
const REVISADAS: Record<string, { readingMinutes: number; date: string }> = {
  'lectura-01-operaciones-unitarias': { readingMinutes: 25, date: '2026-10-22' },
};

// Descripciones que en 2026-20 hablaban de la planta de pectina.
const DESCRIPCIONES: Record<string, string> = {
  'presentacion-del-curso':
    'La sesión inaugural completa: bienvenida y la planta de aceite esencial, equipo docente, objetivos y resultados ABET, las ocho estaciones del proceso, metodología, módulos y ritmo del semestre, evaluación, uso de IA y expectativas.',
  'diagramas-ingenieria':
    'BFD, PFD y P&ID: el lenguaje visual de la ingeniería química. Simbología de equipos e instrumentos, codificación de equipos (Turton), balance de masa y mejores prácticas, aplicados a la planta de aceite esencial.',
};

export const pou202710Course: Course = {
  ...pou202620Course,

  slug: 'iqya-2031-2027-10',
  term: '2027-10',
  // La tarjeta SÍ aparece en el índice del aula: el profesor necesita poder
  // entrar al curso desde ahí. Lo que restringe el acceso es la reja, no
  // esconder el curso.
  //
  // Solo entra el equipo docente: la reja muestra una sola puerta y pide
  // `staffAccessCode`, el mismo del semestre anterior. Un estudiante que
  // llegue a la tarjeta ve que el semestre se está armando y no pasa.
  staffOnlyAccess: true,
  identidad: 'uniandes',

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
      'Diagramas del proceso: PBD, PFD y P&ID · Diagramas',
      'Lavado, acondicionamiento y desgarrado · Sólidos y agitación',
      'Arrastre de vapor: el extractor · Destilación',
      'Transporte de fluidos y servicios · Fluidos',
      'Condensación y decantador florentino · Intercambio de calor',
      'Winterización y filtración de ceras · Filtración',
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
  // 2027-10. El de molienda trae la cáscara húmeda y el molino de cuchillas.
  simulations: (pou202620Course.simulations ?? []).map((sim) =>
    sim.id === 'explorador-molienda'
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
        : r,
    ),
  ],
};
