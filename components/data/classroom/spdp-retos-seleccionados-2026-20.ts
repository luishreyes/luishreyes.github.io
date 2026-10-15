// Retos del SPDP 2026-20 con estudiantes. Se mantiene a mano: vive aparte de
// spdp-retos-2026-20.ts para que la exportación del formulario
// (exportar-portafolio.py) no lo sobrescriba. Clave: id del reto.
//
// Estado final de la sesión de selección del miércoles 14 de octubre de 2026,
// más lo que llegó antes por correo. Lo leen el explorador de retos, la página
// de resultados y el PDF para los profesores
// (scripts/build-spdp-seleccion-pdf.mjs).
//
// Un reto con al menos un estudiante queda «No disponible», aunque sea para
// dos: si en uno para dos quedó una sola persona, el reto se cierra igual.

export interface Seleccion {
  nombres: string[];
  /** Por qué no está disponible. Sin motivo: lo escogieron para el seminario. */
  motivo?: 'maestria';
  /** Reto para dos que una persona hará sola: no deja cupo libre. */
  individual?: boolean;
  /** Algo que falta resolver con el asesor. */
  pendiente?: string;
  /** Contexto para el asesor (programa, continuidad, etc.). */
  nota?: string;
}

export const fechaSeleccion = 'miércoles 14 de octubre de 2026';
/** Hasta cuándo tienen los estudiantes para pedir la reunión con su asesor. */
export const plazoContacto = 'miércoles 21 de octubre de 2026';

export const retosSeleccionados: Record<number, Seleccion> = {
  177: {
    nombres: ['Ana Sofía Contreras Bohórquez'],
    individual: true,
    nota: 'Lo viene trabajando como proyecto especial y lo continúa sola en el PDP.',
  },
  178: {
    nombres: ['Mahmud Walid Bultaif Hassan', 'Gabriela Mahecha Ballén'],
    nota: 'Es el reto de Ingeniería de Alimentos de ambos; cada uno tiene además un reto de Ingeniería Química.',
  },
  179: {
    nombres: ['Gian Carlo Torres Medina'],
    nota: 'Es su reto de Ingeniería de Alimentos; lo viene trabajando como proyecto especial de maestría.',
  },
  180: { nombres: ['Andrés Alfonso López López', 'Erick Antonio Sayes Guandique'] },
  181: { nombres: ['Ana Sofía Martínez Osorio', 'Valentina Rodríguez Caneva'] },
  182: {
    nombres: ['Sebastián Mantilla Torres'],
    nota: 'Nicolás Castellanos Coy lo contactará para ver la posibilidad de escribir una propuesta de continuación, que sería para 2027-20.',
  },
  183: { nombres: ['Valentina Losada Perdomo'] },
  184: { nombres: ['Juan Esteban Narváez Calderón'] },
  185: { nombres: ['Camilo José Ochoa Romero'] },
  186: { nombres: ['Eduardo Perea Castillo'] },
  187: { nombres: ['Juliana Franco Llanes', 'Luis Santiago Gutiérrez Mojica'] },
  189: { nombres: ['Alejandro Gómez Ramírez'] },
  190: { nombres: ['Gabriela Mahecha Ballén'] },
  191: { nombres: ['Laura Camila Acuña Tafur', 'Gian Carlo Torres Medina'] },
  192: { nombres: ['Mahmud Walid Bultaif Hassan', 'María José Pisciotti Díaz'] },
  194: { nombres: ['María José Fernández Romero'] },
  196: { nombres: ['Daniela García Barona'] },
  197: { nombres: ['Isabel Sofía Acosta Patiño'] },
  199: { nombres: ['Santiago José Gálvez Redondo', 'Catalina Romero Gómez'] },
  200: { nombres: ['Luis Eduardo Arias de Abreu', 'James Andrés Rodríguez Aldana'] },
  201: { nombres: ['Jesús Daniel Guzmán Berrío'] },
  202: { nombres: ['Valentín Elías Ibáñez Lengua', 'Jacobo Zapata Montes'] },
};

/** Estudiantes del curso que no quedaron en un reto de esta convocatoria. */
export const otrosCasos: { nombre: string; situacion: string; contacto: string }[] = [
  {
    nombre: 'Andrea Carolina Castellanos Ríos',
    situacion: 'Trabajará en el reto del semestre pasado junto con Salomé Guarín.',
    contacto: 'Alicia Porras',
  },
  {
    nombre: 'Nicolás Castellanos Coy',
    situacion:
      'No seleccionó reto en esta convocatoria. Contactará al asesor para ver la posibilidad de escribir una propuesta de continuación del reto 182 (Asfaltenos modelo in silico en interfases), que sería para 2027-20.',
    contacto: 'Diego Pradilla',
  },
  {
    nombre: 'Juan Sebastián Dimas Caro',
    situacion: 'Todavía no tiene reto: debe hablar con el profesor del curso.',
    contacto: 'Luis H. Reyes',
  },
];
