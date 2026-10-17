import type { Course } from '../classroom';
import { pou202620Course } from './pou-2026-20';

// ── POU · semestre 2027-10 ──────────────────────────────────────
// Proyecto del semestre: planta de aceite esencial de cáscara de cítricos.
// Reemplaza al proyecto de pectina de 2026-20, donde la destilación solo
// recuperaba el solvente. Aquí la destilación hace el producto dos veces:
// el arrastre de vapor lo extrae y la rectificación al vacío lo especifica.
//
// CURSO OCULTO. `hidden: true` lo saca del índice del aula: no aparece
// listado para estudiantes y solo se entra por URL directa con el código.
// Es una vista previa para el equipo docente mientras se arma el semestre.
//
// PENDIENTE antes de abrirlo a estudiantes:
//   · `modules`, `readings` y `presentations` todavía describen el proyecto
//     de pectina, heredados de 2026-20. Hay que reescribirlos.
//   · `schedule` y `cronograma` esperan el calendario oficial de 2027-10.
//   · Falta el banner propio del semestre.
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

  tagline:
    'Diseñe una planta de aceite esencial a partir de cáscara de cítricos',
  description:
    'En este curso diseñará, dimensionará y simulará una planta de aceite esencial de grado alimentario a partir de cáscara de cítricos, el residuo que deja una juguera. Bajo el enfoque de Diseño Integrado de Productos y Procesos, cada operación unitaria llega la semana en que su equipo la necesita para cerrar un balance: manejo de sólidos, transporte de fluidos, agitación, intercambio de calor, filtración y, sobre todo, destilación, que aquí no recupera un solvente sino que hace el producto. El arrastre de vapor lo extrae de la cáscara y la rectificación al vacío decide su calidad. El modelo es híbrido: aula invertida con lecturas previas, quices al iniciar clase, talleres en parejas y trabajo autónomo en equipos de 4-5 personas a lo largo de las 16 semanas.',

  bannerUrl: '/classroom/iqya-2031-2027-10/banner.jpg',

  project: {
    ...pou202620Course.project!,
    title: 'Planta de aceite esencial de cáscara de cítricos',
    overview:
      'Diseño integral de una planta que toma la cáscara que deja una juguera, con 70 a 75 % de humedad y entre 0,5 y 3 % de aceite esencial en base húmeda, y la lleva hasta aceite rectificado. El tren tiene siete etapas: lavado y acondicionamiento, desgarrado a 5 a 10 mm, arrastre de vapor, condensación, decantador florentino, winterización a 5 a 10 °C y rectificación al vacío entre 10 y 20 mbar. La decisión que se toma en el desgarrado reaparece en el rendimiento del arrastre, y la pureza que se le exija a la columna es una decisión económica, no un número dado.',
    rawMaterials: [
      { name: 'Cáscara de lima Tahití', outcome: 'Residuo de exportación colombiano · aceite destilado de grado comercial' },
      { name: 'Cáscara de naranja Valencia', outcome: 'Mayor volumen disponible · aceite con 90 a 95 % de limoneno' },
      { name: 'Cáscara de mandarina', outcome: 'Perfil de oxigenados distinto · afecta el corte de la columna' },
      { name: 'Cáscara de toronja', outcome: 'Menor rendimiento, mayor valor por nota aromática' },
    ],
  },

  // El material todavía es el de pectina: se hereda entero del semestre
  // anterior y los enlaces apuntan a /classroom/iqya-2031-2026-20/, donde los
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
    ...pou202620Course.readings,
  ],
};
