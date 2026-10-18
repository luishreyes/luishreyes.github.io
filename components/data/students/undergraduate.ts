/** El pregrado en cifras, según el registro académico de la Universidad de los Andes, que empieza
 *  en el semestre 2018-10. La web no lista a cada estudiante (decisión del profesor, 18 oct 2026):
 *  cuenta cuántos son, en qué proyectos y dónde están hoy, por sector. Los destinos salen de sus
 *  perfiles públicos y van solo en agregado; el sector es la agrupación de su empresa. */

/** Primer semestre del registro académico. */
export const UNDERGRADUATE_RECORD_SINCE = '2018-10';

export type UndergraduateWorkType = 'grado' | 'especial' | 'desarrollo' | 'especialMaestria';
export type UndergraduateDestination = 'industria' | 'posgrado' | 'academia' | 'emprendimiento' | 'sinDato';
export type UndergraduateSector =
  | 'consultoria' | 'alimentos' | 'cosmetica' | 'salud' | 'ingenieria' | 'biotecnologia' | 'ambiente' | 'educacion';

export const undergraduateSummary = {
  total: 131,
  /** Personas según el año de su primer proyecto conmigo. */
  porAno: [[2018, 11], [2019, 30], [2020, 10], [2021, 19], [2022, 22], [2023, 17], [2024, 13], [2025, 6], [2026, 3]] as [number, number][],
  /** Proyectos por tipo (una persona puede tener más de uno). */
  porTipo: [['grado', 68], ['desarrollo', 59], ['especial', 20], ['especialMaestria', 4]] as [UndergraduateWorkType, number][],
  codirigidos: 82,
  coautores: 13,
  /** Dónde están hoy los que tienen dato. */
  conDato: 81,
  fueraDeColombia: 20,
  destinos: [['industria', 63], ['posgrado', 9], ['academia', 5], ['emprendimiento', 2], ['sinDato', 2]] as [UndergraduateDestination, number][],
  /** Los 63 que trabajan en la industria, por el sector de su empresa. */
  sectores: [
    ['consultoria', 15], ['alimentos', 13], ['cosmetica', 9], ['salud', 9],
    ['ingenieria', 6], ['biotecnologia', 5], ['ambiente', 4], ['educacion', 2],
  ] as [UndergraduateSector, number][],
};
