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
//   · Falta el banner propio del semestre.
// Material ya reescrito para aceite esencial: vive en /classroom/iqya-2031-2027-10/.
// Cada semana que se migra suma aquí sus ids y slugs.
const PRESENTACIONES_PROPIAS = new Set(['presentacion-del-curso', 'trabajo-en-equipo']);
const LECTURAS_PROPIAS = new Set(['lectura-01-operaciones-unitarias']);

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

  bannerUrl: '/classroom/iqya-2031-2027-10/banner.jpg',

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
  presentations: pou202620Course.presentations.map((p) => {
    if (!PRESENTACIONES_PROPIAS.has(p.id)) return { ...p, carpeta: 'iqya-2031-2026-20' };
    return p.id === 'presentacion-del-curso'
      ? {
          ...p,
          description:
            'La sesión inaugural completa: bienvenida y la planta de aceite esencial, equipo docente, objetivos y resultados ABET, las ocho estaciones del proceso, metodología, módulos y ritmo del semestre, evaluación, uso de IA y expectativas.',
        }
      : p;
  }),
  simulations: (pou202620Course.simulations ?? []).map((sim) => ({ ...sim, carpeta: 'iqya-2031-2026-20' })),

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
        ? { ...r, href: r.href?.replace('/iqya-2031-2026-20/', '/iqya-2031-2027-10/') }
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
