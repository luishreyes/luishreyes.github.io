import type { Lang } from '../context/i18n';

/** Párrafos de un testimonio entre comillas: «…» en español y “…” en inglés, con las
 *  comillas que ya traiga el texto (un título, por ejemplo) pasadas al segundo nivel. */
export const comillar = (texto: string, lang: Lang) => {
  const [abre, cierra, a2, c2] = lang === 'es' ? ['«', '»', '“', '”'] : ['“', '”', '‘', '’'];
  const pars = texto.split('\n\n').map((p) => p.replace(/«([^»]*)»/g, `${a2}$1${c2}`).replace(/“([^”]*)”/g, lang === 'es' ? '“$1”' : `${a2}$1${c2}`));
  return pars.map((p, k) => `${k === 0 ? abre : ''}${p}${k === pars.length - 1 ? cierra : ''}`);
};
