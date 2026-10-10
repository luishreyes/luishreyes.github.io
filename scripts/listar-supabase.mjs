// Lista las tablas que la clave anónima de Supabase deja ver, con sus columnas y
// el número de filas. No guarda nada: solo imprime en el registro del workflow
// .github/workflows/listar-supabase.yml (este contenedor no alcanza supabase.co).
const URL = 'https://ourwyskhfdesnmnhlxof.supabase.co';
const KEY = process.env.SUPABASE_ANON_KEY;
const h = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const api = await (await fetch(`${URL}/rest/v1/`, { headers: h })).json();
const tablas = Object.entries(api.definitions ?? {});
console.log(`Tablas y vistas expuestas: ${tablas.length}`);
for (const [nombre, def] of tablas) {
  const r = await fetch(`${URL}/rest/v1/${nombre}?select=*&limit=1`, { headers: { ...h, Prefer: 'count=exact' } });
  const total = r.headers.get('content-range')?.split('/')[1] ?? `HTTP ${r.status}`;
  console.log(`\n## ${nombre} · ${total} filas`);
  console.log('   columnas: ' + Object.keys(def.properties ?? {}).join(', '));
}
