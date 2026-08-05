/** Fecha local del dispositivo como ISO corto (`2026-08-05`). */
export const todayISO = (d: Date = new Date()): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
