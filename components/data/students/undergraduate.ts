/** El pregrado en cifras, según el registro académico de la Universidad de los Andes, que empieza
 *  en el semestre 2018-10. La web no lista a cada estudiante (decisión del profesor, 18 oct 2026):
 *  cuenta cuántos son, en qué proyectos y dónde están hoy, por sector. Los destinos salen de sus
 *  perfiles públicos y van solo en agregado; el sector es la agrupación de su empresa. */

import { schoolFigures } from './school';

/** Primer semestre del registro académico. */
export const UNDERGRADUATE_RECORD_SINCE = schoolFigures.recordFrom;

export type UndergraduateWorkType = 'grado' | 'especial' | 'desarrollo' | 'especialMaestria';
export type UndergraduateDestination = 'industria' | 'posgrado' | 'academia' | 'emprendimiento' | 'sinDato';
export type UndergraduateSector =
  | 'consultoria' | 'alimentos' | 'cosmetica' | 'salud' | 'ingenieria' | 'biotecnologia' | 'ambiente' | 'educacion';

export const undergraduateSummary = {
  total: schoolFigures.undergrad,
  /** Personas según el año de su primer proyecto conmigo. */
  porAno: schoolFigures.ug.byYear as [number, number][],
  /** Personas con al menos un proyecto de cada tipo (una persona puede tener más de uno). */
  porTipo: schoolFigures.ug.byType as [UndergraduateWorkType, number][],
  codirigidos: schoolFigures.ug.coAdvised,
  coautores: schoolFigures.coauthors,
  /** Dónde están hoy los que tienen dato. */
  conDato: schoolFigures.ug.known,
  fueraDeColombia: schoolFigures.ug.abroad,
  destinos: schoolFigures.ug.destinations as [UndergraduateDestination, number][],
  /** Los que trabajan en la industria, por el sector de su empresa (agrupación hecha a mano). */
  sectores: [
    ['consultoria', 15], ['alimentos', 13], ['cosmetica', 9], ['salud', 9],
    ['ingenieria', 6], ['biotecnologia', 5], ['ambiente', 4], ['educacion', 2],
  ] as [UndergraduateSector, number][],
};
