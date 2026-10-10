// Descarga todas las imágenes que el sitio todavía sirve desde Supabase Storage
// (fotos de egresados, testimonios y algunas páginas) a fotos-supabase/, con un
// manifest.json que dice de qué URL salió cada archivo y qué archivos la usan.
//
// Uso: node scripts/descargar-fotos-supabase.mjs [carpeta-de-salida]
// Lo corre el workflow manual .github/workflows/fotos-supabase.yml, porque el
// contenedor de trabajo no alcanza supabase.co. No cambia ninguna URL del sitio.

import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const OUT = process.argv[2] || 'fotos-supabase';
const RAIZ = process.cwd();
const PATRON = /https:\/\/ourwyskhfdesnmnhlxof\.supabase\.co\/storage\/v1\/object\/public\/[^'"`\s)]+/g;

const archivos = [];
const recorrer = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) recorrer(p);
    else if (/\.(ts|tsx)$/.test(f)) archivos.push(p);
  }
};
for (const d of ['components', 'pages', 'context']) recorrer(join(RAIZ, d));

const usos = new Map(); // url → archivos que la usan
for (const f of archivos) {
  for (const url of readFileSync(f, 'utf8').match(PATRON) ?? []) {
    if (!usos.has(url)) usos.set(url, new Set());
    usos.get(url).add(relative(RAIZ, f));
  }
}

mkdirSync(OUT, { recursive: true });
const manifest = [];
for (const [url, donde] of [...usos].sort()) {
  // Nombre local: la ruta dentro del bucket, sin barras, para que no choquen dos archivos con el mismo nombre.
  const archivo = decodeURIComponent(url.split('/object/public/')[1]).replace(/\//g, '__');
  const r = await fetch(url);
  if (!r.ok) {
    manifest.push({ url, archivo: null, error: `HTTP ${r.status}`, usadoEn: [...donde] });
    console.log(`✗ ${r.status} ${url}`);
    continue;
  }
  const buf = Buffer.from(await r.arrayBuffer());
  writeFileSync(join(OUT, archivo), buf);
  manifest.push({ url, archivo, bytes: buf.length, tipo: r.headers.get('content-type'), usadoEn: [...donde] });
  console.log(`✓ ${archivo} (${buf.length} bytes)`);
}
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`${manifest.filter((m) => m.archivo).length} de ${manifest.length} descargadas`);
