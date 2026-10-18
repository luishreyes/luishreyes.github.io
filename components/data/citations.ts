/**
 * Las cifras de la investigación que no se pueden calcular desde products.json,
 * cada una con su fuente y su fecha. Son una foto fija: se actualizan a mano.
 *
 * - Citas, índice h e índice i10: el perfil público de Google Scholar del profesor,
 *   que es la fuente oficial (la suma de `citations` de products.json da otra cifra,
 *   porque Google Scholar cuenta registros que la lista no tiene).
 * - Publicaciones por año, cuartiles y primeros autores: el registro de la producción
 *   del profesor, contado por año de publicación del volumen.
 */

import type { Product } from '../../types';

export const SCHOLAR_URL = 'https://scholar.google.com/citations?user=2vO8IrIAAAAJ&hl=en';

export const scholar = {
  /** Fecha de la foto del perfil (AAAA-MM-DD). */
  asOf: '2026-10-02',
  citations: 3222,
  hIndex: 31,
  i10Index: 64,
  /** Citas que recibió cada año, según las barras del perfil al 28 de septiembre de 2026.
   *  La de 2026 va hasta finales de septiembre. */
  perYearAsOf: '2026-09-28',
  perYear: {
    2012: 19, 2013: 44, 2014: 74, 2015: 69, 2016: 101, 2017: 84, 2018: 112,
    2019: 131, 2020: 146, 2021: 214, 2022: 277, 2023: 348, 2024: 438, 2025: 600, 2026: 518,
  } as Record<number, number>,
};

/** Publicaciones por año y por clase: artículos (de investigación y de revisión),
 *  capítulos, libros y otras (editoriales, divulgación, preprints y otros). Sin las
 *  ponencias, las patentes ni la traducción al español publicada en Palmas, que es la
 *  misma obra que su original en inglés. */
export type ClasePublicacion = 'articles' | 'chapters' | 'books' | 'other';

export const publicationsPerYear: Record<number, Record<ClasePublicacion, number>> = {
  2007: { articles: 1, chapters: 0, books: 0, other: 0 },
  2011: { articles: 1, chapters: 0, books: 0, other: 0 },
  2012: { articles: 2, chapters: 0, books: 0, other: 0 },
  2013: { articles: 2, chapters: 1, books: 0, other: 0 },
  2014: { articles: 1, chapters: 0, books: 0, other: 0 },
  2015: { articles: 1, chapters: 0, books: 0, other: 0 },
  2016: { articles: 1, chapters: 0, books: 0, other: 0 },
  2017: { articles: 1, chapters: 0, books: 0, other: 0 },
  2018: { articles: 1, chapters: 1, books: 0, other: 0 },
  2019: { articles: 2, chapters: 0, books: 0, other: 0 },
  2020: { articles: 12, chapters: 0, books: 0, other: 0 },
  2021: { articles: 9, chapters: 0, books: 0, other: 0 },
  2022: { articles: 12, chapters: 1, books: 1, other: 2 },
  2023: { articles: 11, chapters: 0, books: 1, other: 2 },
  2024: { articles: 12, chapters: 2, books: 1, other: 4 },
  2025: { articles: 8, chapters: 14, books: 1, other: 1 },
  2026: { articles: 3, chapters: 1, books: 1, other: 0 },
};

export const publications = {
  /** Fecha del registro del que salen las cifras. */
  asOf: '2026-10-12',
  since: 2007,
  total: 114,
  patents: 2,
  /** Artículos en revistas (de investigación y de revisión) y su cuartil Scimago en el
   *  año de publicación (los de 2026, con la tabla de 2025, la última publicada). */
  articles: 80,
  q1: 56,
  q2: 21,
  /** Artículos desde julio de 2017, cuando el profesor llegó a la Universidad de los Andes. */
  articlesSince2017: 71,
  /** Artículos con un estudiante que el profesor dirigió o codirigió como primer autor, y
   *  con un estudiante a quien acompañó como mentor. */
  studentFirstDirected: 46,
  studentFirstMentored: 11,
  /** Artículos que firma al menos un estudiante que el profesor dirigió. */
  withDirectedStudent: 54,
  /** Ponencias en congresos desde 2017, y cuántas en el AIChE Annual Meeting. */
  talksSince2017: 42,
  talksAiche: 10,
};

/** Reconocimiento del Ministerio de Ciencia, Tecnología e Innovación (Minciencias),
 *  convocatoria 957 de 2024 (resultados publicados el 5 de diciembre de 2025). */
export const minciencias = {
  call: 957,
  callYear: 2024,
  group: 'Grupo de Diseño de Productos y Procesos (GDPP)',
  groupCategory: 'A1',
};

/** En products.json, `status: 'secondary'` marca una publicación secundaria: la misma
 *  obra que otra, publicada otra vez (la traducción al español en Palmas). Se lista, pero
 *  no se cuenta. */
export const SECONDARY = 'secondary';

/** Lo que cuenta como publicación: ni las ponencias, ni las patentes, ni lo secundario. */
export const esPublicacion = (p: Pick<Product, 'type' | 'status'>) =>
  p.type !== 'Conference' && p.type !== 'Patent' && p.status !== SECONDARY;
