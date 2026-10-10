// Exporta una sola vez la producción académica que vivía en Supabase a
// public/data/products.json, el archivo que el portafolio lee ahora.
//
// Hace las mismas consultas que hacía services/supabase.ts (fetchInitialData)
// y escribe un Product[] con la forma exacta que usa la app, más el campo
// `citations` (el número de citas que guardaba la tabla `products`).
//
// Diferencias deliberadas con la consulta del navegador:
// - Pide las tablas relacionadas por bloques de productos, para no chocar con
//   el límite de 1000 filas por respuesta de la API de Supabase.
// - Ordena la salida por fecha (más reciente primero) y título, para que los
//   cambios futuros al archivo se lean bien en un diff.
//
// Uso: node scripts/export-supabase.mjs [ruta-de-salida]
// Lo corre el workflow .github/workflows/export-supabase.yml, porque este
// contenedor no alcanza supabase.co. La clave es la anónima, la misma que ya
// estaba publicada en el código del sitio.

import { createClient } from '@supabase/supabase-js';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ourwyskhfdesnmnhlxof.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91cnd5c2toZmRlc25tbmhseG9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMTQ3MDcsImV4cCI6MjA3MTg5MDcwN30.yCcUo1nnelUTN1IPXMuDj9mhrc-6I1589adbLz7bAf8';

const OUT = resolve(process.argv[2] || 'public/data/products.json');
const PAGE = 1000; // límite de filas por respuesta de PostgREST
const CHUNK = 40; // productos por consulta a las tablas relacionadas

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

const fail = (msg) => {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
};

/** Todos los productos, paginados por id (único, así la paginación es estable). */
async function fetchProducts() {
  const rows = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id')
      .range(from, from + PAGE - 1);
    if (error) fail(`products: ${error.message}`);
    rows.push(...data);
    if (data.length < PAGE) break;
  }
  return rows;
}

/** Filas de una tabla relacionada para todos los productos, por bloques. */
async function fetchRelated(table, select, ids, orderCols) {
  const rows = [];
  for (let i = 0; i < ids.length; i += CHUNK) {
    const block = ids.slice(i, i + CHUNK);
    let q = supabase.from(table).select(select).in('product_id', block);
    for (const c of orderCols) q = q.order(c);
    const { data, error } = await q.range(0, PAGE - 1);
    if (error) fail(`${table}: ${error.message}`);
    if (data.length >= PAGE) fail(`${table}: un bloque llegó a ${PAGE} filas; bajar CHUNK`);
    rows.push(...data);
  }
  return rows;
}

const one = (v) => (Array.isArray(v) ? v[0] : v);

const group = (rows, pick) => {
  const map = new Map();
  for (const row of rows) {
    const value = pick(row);
    if (value == null) continue;
    if (!map.has(row.product_id)) map.set(row.product_id, []);
    map.get(row.product_id).push(value);
  }
  return map;
};

const productsData = await fetchProducts();
if (productsData.length === 0) fail('la tabla products llegó vacía; no se escribe nada');

const columns = [...new Set(productsData.flatMap((p) => Object.keys(p)))].sort();
console.log(`products: ${productsData.length} filas`);
console.log(`columnas de products: ${columns.join(', ')}`);

const ids = productsData.map((p) => p.id).filter((id) => id != null);

const [authorsRows, keywordsRows, areasRows, summariesRows] = await Promise.all([
  fetchRelated('products_authors', 'product_id, position, authors!inner(name)', ids, ['product_id', 'position']),
  fetchRelated('products_keywords', 'product_id, keywords!inner(keyword)', ids, ['product_id']),
  fetchRelated('products_research_areas', 'product_id, research_areas!inner(area)', ids, ['product_id']),
  fetchRelated('layman_summaries', 'product_id, id, question, answer', ids, ['product_id', 'id']),
]);

for (const [name, rows] of [
  ['products_authors', authorsRows],
  ['products_keywords', keywordsRows],
  ['products_research_areas', areasRows],
  ['layman_summaries', summariesRows],
]) {
  const note = rows.length > PAGE ? ` (más de ${PAGE}: la consulta del navegador las truncaba)` : '';
  console.log(`${name}: ${rows.length} filas${note}`);
}

const authorsMap = group(authorsRows, (r) => one(r.authors)?.name || null);
const keywordsMap = group(keywordsRows, (r) => one(r.keywords)?.keyword || null);
const areasMap = group(areasRows, (r) => one(r.research_areas)?.area || null);
const summariesMap = group(summariesRows, (r) =>
  r.question && r.answer ? { question: r.question, answer: r.answer } : null,
);

const products = productsData.map((p) => ({
  title: p.title,
  type: p.type,
  authors: authorsMap.get(p.id) || [],
  publicationVenue: p.publication_venue,
  publicationDate: p.publication_date,
  doi: p.doi,
  corpusId: p.corpus_id,
  url: p.url,
  imageUrl: p.image_url,
  status: p.status,
  citations: typeof p.citations === 'number' ? p.citations : null,
  researchAreas: areasMap.get(p.id) || [],
  keywords: keywordsMap.get(p.id) || [],
  laymanSummary: summariesMap.get(p.id) || [],
}));

products.sort(
  (a, b) =>
    String(b.publicationDate || '').localeCompare(String(a.publicationDate || '')) ||
    String(a.title || '').localeCompare(String(b.title || '')),
);

const byType = products.reduce((acc, p) => ({ ...acc, [p.type]: (acc[p.type] || 0) + 1 }), {});
console.log('por tipo:', JSON.stringify(byType));
const dois = products.map((p) => p.doi).filter(Boolean);
const dupes = dois.filter((d, i) => dois.indexOf(d) !== i);
if (dupes.length) console.log(`DOI repetidos: ${[...new Set(dupes)].join(', ')}`);
console.log(`sin DOI: ${products.length - dois.length}`);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(products, null, 2) + '\n');
console.log(`escrito ${OUT}`);
