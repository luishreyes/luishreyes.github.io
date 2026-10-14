// Resultados de la selección de retos del SPDP 2026-20, derivados de los datos
// (retos, asignaciones y lista del curso). Los usan la página de resultados
// (SpdpResultadosPage) y el PDF para los profesores
// (scripts/build-spdp-seleccion-pdf.mjs). Solo importa tipos para que Node lo
// pueda cargar tal cual con --experimental-strip-types.

import type { Reto202620 } from './spdp-retos-2026-20';
import type { Seleccion } from './spdp-retos-seleccionados-2026-20';

export interface RetoResultado {
  reto: Reto202620;
  estudiantes: string[];
  /** Cupos que siguen libres (0 si está completo o se hará de forma individual). */
  libres: number;
  pendiente?: string;
  nota?: string;
}

/** Asesor principal de uno o más retos. Los coasesores no tienen bloque
    propio: aparecen como dato de cada reto. */
export interface AsesorResultado {
  nombre: string;
  principal: RetoResultado[];
  /** Cuántos estudiantes lo van a contactar (sin repetir). */
  contactos: number;
}

export interface EstudianteResultado {
  nombre: string;
  retos: RetoResultado[];
  otro?: { situacion: string; contacto: string };
}

export interface Resultados {
  retos: RetoResultado[];
  conEstudiantes: RetoResultado[];
  sinEstudiantes: RetoResultado[];
  conCupo: RetoResultado[];
  pendientes: RetoResultado[];
  asesores: AsesorResultado[];
  estudiantes: EstudianteResultado[];
  areas: { area: string; propuestos: number; conEstudiantes: number; estudiantes: number }[];
  totales: {
    retos: number;
    asesores: number;
    conEstudiantes: number;
    estudiantesCurso: number;
    estudiantesConReto: number;
    dosRetos: number;
  };
}

// Los asesores se nombran «Nombre Apellido» (Luis H. Reyes, Juan Carlos Cruz):
// el apellido es la última palabra. Los estudiantes siguen el orden de la lista
// del curso, que ya viene por apellidos.
const apellido = (n: string) => n.split(' ').slice(-1)[0];
const orden = (a: string, b: string) =>
  apellido(a).localeCompare(apellido(b), 'es') || a.localeCompare(b, 'es');

export function armarResultados(
  retos: Reto202620[],
  seleccionados: Record<number, Seleccion>,
  estudiantesCurso: string[],
  otros: { nombre: string; situacion: string; contacto: string }[],
): Resultados {
  const res: RetoResultado[] = retos.map((reto) => {
    const s = seleccionados[reto.id];
    const estudiantes = s?.nombres ?? [];
    // Un reto con al menos un estudiante queda lleno, aunque sea para dos.
    const libres = estudiantes.length > 0 ? 0 : reto.integrantes;
    return { reto, estudiantes, libres, pendiente: s?.pendiente, nota: s?.nota };
  });

  const conEstudiantes = res.filter((r) => r.estudiantes.length > 0);
  const sinEstudiantes = res.filter((r) => r.estudiantes.length === 0);

  const asesores: AsesorResultado[] = Array.from(new Set(res.map((r) => r.reto.asesor)))
    .map((nombre) => {
      const principal = res.filter((r) => r.reto.asesor === nombre);
      const contactos = new Set(principal.flatMap((r) => r.estudiantes)).size;
      return { nombre, principal, contactos };
    })
    .sort((a, b) => orden(a.nombre, b.nombre));

  const todos = new Set([...estudiantesCurso, ...conEstudiantes.flatMap((r) => r.estudiantes)]);
  const estudiantes: EstudianteResultado[] = Array.from(todos)
    .map((nombre) => {
      const o = otros.find((x) => x.nombre === nombre);
      return {
        nombre,
        retos: conEstudiantes.filter((r) => r.estudiantes.includes(nombre)),
        otro: o ? { situacion: o.situacion, contacto: o.contacto } : undefined,
      };
    })
    .sort((a, b) => {
      const ia = estudiantesCurso.indexOf(a.nombre);
      const ib = estudiantesCurso.indexOf(b.nombre);
      return (ia < 0 ? 1e3 : ia) - (ib < 0 ? 1e3 : ib) || a.nombre.localeCompare(b.nombre, 'es');
    });

  const areasMap = new Map<string, { propuestos: number; conEstudiantes: number; estudiantes: number }>();
  res.forEach((r) => {
    const a = areasMap.get(r.reto.area) ?? { propuestos: 0, conEstudiantes: 0, estudiantes: 0 };
    a.propuestos += 1;
    if (r.estudiantes.length) a.conEstudiantes += 1;
    a.estudiantes += r.estudiantes.length;
    areasMap.set(r.reto.area, a);
  });
  const areas = Array.from(areasMap, ([area, v]) => ({ area, ...v })).sort((a, b) => b.propuestos - a.propuestos || b.estudiantes - a.estudiantes);

  return {
    retos: res,
    conEstudiantes,
    sinEstudiantes,
    conCupo: conEstudiantes.filter((r) => r.libres > 0),
    pendientes: res.filter((r) => r.pendiente),
    asesores,
    estudiantes,
    areas,
    totales: {
      retos: res.length,
      asesores: new Set(res.map((r) => r.reto.asesor)).size,
      conEstudiantes: conEstudiantes.length,
      estudiantesCurso: estudiantesCurso.length,
      estudiantesConReto: estudiantes.filter((e) => e.retos.length > 0).length,
      dosRetos: estudiantes.filter((e) => e.retos.length > 1).length,
    },
  };
}

export const personas = (n: number) => (n === 1 ? 'una persona' : 'dos personas');
export const nombres = (lista: string[]) =>
  lista.length > 1 ? `${lista.slice(0, -1).join(', ')} y ${lista[lista.length - 1]}` : lista[0] ?? '';
