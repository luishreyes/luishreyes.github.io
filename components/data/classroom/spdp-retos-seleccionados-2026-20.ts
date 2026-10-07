// Retos del SPDP 2026-20 que ya tienen equipo. Se mantiene a mano: vive
// aparte de spdp-retos-2026-20.ts para que la exportación del formulario
// (exportar-portafolio.py) no lo sobrescriba. Clave: id del reto.

export interface Seleccion {
  nombres: string[];
  /** Por qué no está disponible. Sin motivo: lo escogieron para el seminario. */
  motivo?: 'maestria';
}

export const retosSeleccionados: Record<number, Seleccion> = {
  // Oscar Álvarez, 7 de octubre de 2026
  189: { nombres: ['Alejandro Gómez'] },
  190: { nombres: ['Gabriela Mahecha'] },
  191: { nombres: ['Gian Torres', 'Laura Acuña'] },
  192: { nombres: ['Mahmud Bultaif', 'María José Pisciotti'] },
  // Gian Torres, 7 de octubre de 2026: lo trabaja este semestre como
  // proyecto especial de maestría. No choca con el 191: Gian tiene dos
  // proyectos, uno para ingeniería química (191) y otro para alimentos (179).
  179: { nombres: ['Gian Torres'], motivo: 'maestria' },
};
