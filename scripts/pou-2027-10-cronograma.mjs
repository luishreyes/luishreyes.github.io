// Cronograma de POU 2027-10 (IQYA-2031), clase por clase.
//
// Una sola lista de sesiones escribe los tres lugares donde aparece el
// cronograma, para que nunca se contradigan:
//   · el arreglo `cronograma` de components/data/classroom/pou-2027-10.ts
//     (lo usan «Qué hay para hoy» y la apertura de semanas), entre
//     // CRONOGRAMA_START y // CRONOGRAMA_END;
//   · la tabla del programa por sesiones de public/classroom/iqya-2031-2027-10/programa.html,
//     entre <!-- SESIONES_START --> y <!-- SESIONES_END -->;
//   · los datos del cronograma interactivo, public/classroom/iqya-2031-2027-10/cronograma.html.
//
// Calendario académico 2027-10: clases del 25 de enero al 22 de mayo de 2027,
// receso del 22 al 27 de marzo (Semana Santa) y finales del 24 al 29 de mayo.
// POU va martes y jueves. Ningún festivo cae en esos días.
//
// Uso: node scripts/pou-2027-10-cronograma.mjs   (y después regenerar el PDF del programa:
//      CURSO=iqya-2031-2027-10 node scripts/build-pou-programa-pdf.mjs)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TS = path.join(RAIZ, 'components/data/classroom/pou-2027-10.ts');
const PROGRAMA = path.join(RAIZ, 'public/classroom/iqya-2031-2027-10/programa.html');
const CRONO = path.join(RAIZ, 'public/classroom/iqya-2031-2027-10/cronograma.html');
const HOY = new Date().toISOString().slice(0, 10);

// ── Las sesiones ────────────────────────────────────────────────
// tipo: clase (con quiz) | taller | lab | examen | retro | intro | posters
const SESIONES = [
  { s: 1, f: '2027-01-26', tipo: 'intro', tema: 'Presentación del curso', det: ['El reto: la planta de aceite esencial', 'Metodología, evaluación y uso de IA'], proyecto: 'Publicación del reto del semestre' },
  { s: 1, f: '2027-01-28', tipo: 'intro', tema: 'Equipos, coevaluación y contrato', det: ['Quiz de práctica con LockDown Browser, sin nota'] },
  { s: 2, f: '2027-02-02', tipo: 'clase', quiz: 'Quiz 1', tema: 'Diagramas de ingeniería: PBD, PFD y P&ID', det: ['Simbología de equipos e instrumentos', 'Codificación de equipos y corrientes'] },
  { s: 2, f: '2027-02-04', tipo: 'taller', taller: 'Taller 1', tema: 'Taller 1: análisis de un PFD con errores', det: ['Un plano distinto por pareja'] },
  { s: 3, f: '2027-02-09', tipo: 'clase', quiz: 'Quiz 2', tema: 'Sólidos: caracterización, granulometría y reducción de tamaño', det: ['Distribuciones de tamaño', 'Desgarrado de la cáscara húmeda'] },
  { s: 3, f: '2027-02-11', tipo: 'taller', taller: 'Taller 2', tema: 'Taller 2: análisis granulométrico', det: ['En Colab, con datos por pareja'], proyecto: 'Bitácora 1: domingo 14 de febrero · Coevaluación: lunes 15 de febrero' },
  { s: 4, f: '2027-02-16', tipo: 'clase', quiz: 'Quiz 3', tema: 'Arrastre de vapor', det: ['Equilibrio de líquidos inmiscibles', 'Relación de vapor e hidrodifusión', 'Diseño del extractor'] },
  { s: 4, f: '2027-02-18', tipo: 'retro', tema: 'Retroalimentación 1', det: ['Sustentación de la Bitácora 1 por equipos'] },
  { s: 5, f: '2027-02-23', tipo: 'lab', lab: 'Laboratorio 1', tema: 'Laboratorio 1: arrastre de vapor', det: ['Primera mitad de los equipos', 'Clevenger con cáscara de naranja'] },
  { s: 5, f: '2027-02-25', tipo: 'lab', lab: 'Laboratorio 1', tema: 'Laboratorio 1: arrastre de vapor', det: ['Segunda mitad de los equipos', 'Clevenger con cáscara de naranja'] },
  { s: 6, f: '2027-03-02', tipo: 'clase', quiz: 'Quiz 4', tema: 'Bombas: tipos, mecanismos y selección', det: ['Centrífugas y de desplazamiento positivo', 'Leyes de afinidad, serie y paralelo', 'Corrección por viscosidad'] },
  { s: 6, f: '2027-03-04', tipo: 'clase', quiz: 'Quiz 5', tema: 'Válvulas, control y vacío', det: ['Válvulas según el servicio', 'Válvula de control: Cv, característica y autoridad', 'Sistemas de vacío para la columna'], proyecto: 'Memorando del Laboratorio 1: domingo 7 de marzo' },
  { s: 7, f: '2027-03-09', tipo: 'clase', quiz: 'Quiz 6', tema: 'Agitación y escalado', det: ['Impulsores y número de potencia', 'Suspensión y dispersión de gotas', 'Criterios de escalado'] },
  { s: 7, f: '2027-03-11', tipo: 'lab', lab: 'Laboratorio 2', tema: 'Laboratorio 2: agitación y emulsión', det: ['Todos los equipos', 'Tamaño de gota en el Mastersizer'], proyecto: 'Bitácora 2: domingo 14 de marzo · Coevaluación: lunes 15 de marzo' },
  { s: 8, f: '2027-03-16', tipo: 'taller', taller: 'Taller 3', tema: 'Taller 3: hoja de datos de una bomba y su válvula de control', det: ['Con catálogos impresos'] },
  { s: 8, f: '2027-03-18', tipo: 'examen', examen: 'Examen 1', tema: 'Examen 1: arrastre de vapor, bombas, válvulas, control y vacío', det: ['En papel: primero individual y después en pareja'], proyecto: 'Memorando del Laboratorio 2: domingo 21 de marzo' },
  { s: 9, f: '2027-03-30', tipo: 'retro', tema: 'Retroalimentación 2', det: ['Sustentación de la Bitácora 2 por equipos'] },
  { s: 9, f: '2027-04-01', tipo: 'clase', quiz: 'Quiz 7', tema: 'Condensación y decantación', det: ['El condensador del arrastre', 'Gases no condensables y venteo', 'El decantador florentino'] },
  { s: 10, f: '2027-04-06', tipo: 'clase', quiz: 'Quiz 8', tema: 'Refrigeración', det: ['Ciclo de compresión de vapor', 'El enfriado de la winterización'] },
  { s: 10, f: '2027-04-08', tipo: 'clase', quiz: 'Quiz 9', tema: 'Filtración y winterización', det: ['Ley de Darcy, torta y medio filtrante', 'Filtración de profundidad'] },
  { s: 11, f: '2027-04-13', tipo: 'taller', taller: 'Taller 4', tema: 'Taller 4: el filtro de la winterización y el florentino', det: ['Con datos por pareja'] },
  { s: 11, f: '2027-04-15', tipo: 'clase', quiz: 'Quiz 10', tema: 'Servicios de planta e integración energética', det: ['Vapor, trampas y agua de enfriamiento', 'Recuperación de calor'], proyecto: 'Bitácora 3: domingo 18 de abril · Coevaluación: lunes 19 de abril' },
  { s: 12, f: '2027-04-20', tipo: 'examen', examen: 'Examen 2', tema: 'Examen 2: condensación, refrigeración, separaciones mecánicas y servicios', det: ['En papel: primero individual y después en pareja'] },
  { s: 12, f: '2027-04-22', tipo: 'retro', tema: 'Retroalimentación 3', det: ['Sustentación de la Bitácora 3 por equipos'] },
  { s: 13, f: '2027-04-27', tipo: 'clase', quiz: 'Quiz 11', tema: 'Destilación por lotes', det: ['Ecuación de Rayleigh', 'Políticas de reflujo'] },
  { s: 13, f: '2027-04-29', tipo: 'lab', lab: 'Laboratorio 3', tema: 'Laboratorio 3: destilación por lotes', det: ['Primera mitad de los equipos', 'Air Still Pro en modo de olla y en modo de reflujo'] },
  { s: 14, f: '2027-05-04', tipo: 'lab', lab: 'Laboratorio 3', tema: 'Laboratorio 3: destilación por lotes', det: ['Segunda mitad de los equipos', 'Air Still Pro en modo de olla y en modo de reflujo'] },
  { s: 14, f: '2027-05-06', tipo: 'clase', quiz: 'Quiz 12', tema: 'Vacío y azeótropos', det: ['Efecto de la presión', 'Azeótropos y destilación especial'], proyecto: 'Memorando del Laboratorio 3: domingo 9 de mayo' },
  { s: 15, f: '2027-05-11', tipo: 'clase', quiz: 'Quiz 13', tema: 'Platos y empaques', det: ['Inundación y diámetro', 'Caída de presión', 'HETP'] },
  { s: 15, f: '2027-05-13', tipo: 'taller', taller: 'Taller 5', tema: 'Taller 5: ¿platos o empaque para la columna al vacío?', det: ['Con la carta de Fair'], proyecto: 'Bitácora 4: domingo 16 de mayo · Coevaluación: lunes 17 de mayo' },
  { s: 16, f: '2027-05-18', tipo: 'examen', examen: 'Examen 3', tema: 'Examen 3: destilación por lotes, vacío y azeótropos, platos y empaques', det: ['En papel: primero individual y después en pareja'] },
  { s: 16, f: '2027-05-20', tipo: 'retro', tema: 'Retroalimentación 4', det: ['Sustentación de la Bitácora 4 por equipos'] },
  { s: 17, f: '2027-05-25', tipo: 'posters', tema: 'Sesión de pósters', det: ['Semana de finales: fecha y salón según la programación de finales'], proyecto: 'Documento final y póster · Coevaluación 5' },
];

const RECESO = { s: 8, desde: '2027-03-22', texto: 'Receso de Semana Santa, del 22 al 27 de marzo' };

// Entregas y coevaluaciones (domingos y lunes), para el cronograma interactivo.
const ENTREGAS = [
  { s: 3, f: '2027-02-14', k: 'entrega', t: 'Entrega de la Bitácora 1' },
  { s: 4, f: '2027-02-15', k: 'coevaluacion', t: 'Coevaluación de la Bitácora 1' },
  { s: 6, f: '2027-03-07', k: 'entrega', t: 'Memorando del Laboratorio 1' },
  { s: 7, f: '2027-03-14', k: 'entrega', t: 'Entrega de la Bitácora 2' },
  { s: 8, f: '2027-03-15', k: 'coevaluacion', t: 'Coevaluación de la Bitácora 2' },
  { s: 8, f: '2027-03-21', k: 'entrega', t: 'Memorando del Laboratorio 2' },
  { s: 11, f: '2027-04-18', k: 'entrega', t: 'Entrega de la Bitácora 3' },
  { s: 12, f: '2027-04-19', k: 'coevaluacion', t: 'Coevaluación de la Bitácora 3' },
  { s: 14, f: '2027-05-09', k: 'entrega', t: 'Memorando del Laboratorio 3' },
  { s: 15, f: '2027-05-16', k: 'entrega', t: 'Entrega de la Bitácora 4' },
  { s: 16, f: '2027-05-17', k: 'coevaluacion', t: 'Coevaluación de la Bitácora 4' },
  { s: 17, f: '2027-05-25', k: 'entrega', t: 'Documento final y póster (semana de finales)' },
  { s: 17, f: '2027-05-25', k: 'coevaluacion', t: 'Coevaluación 5: documento final y póster' },
];

// ── Utilidades ──────────────────────────────────────────────────
const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const fecha = (iso) => new Date(iso + 'T12:00:00');
const dia = (iso) => DIAS[fecha(iso).getDay()];
const corta = (iso) => `${dia(iso).slice(0, 3)} ${fecha(iso).getDate()} ${MESES[fecha(iso).getMonth()]}`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

for (const x of SESIONES) {
  const d = dia(x.f);
  if (x.tipo !== 'posters' && d !== 'Martes' && d !== 'Jueves') throw new Error(`${x.f} cae en ${d}`);
}

function empalmar(texto, ini, fin, nuevo, archivo) {
  const a = texto.indexOf(ini), b = texto.indexOf(fin);
  if (a < 0 || b < 0 || b < a) throw new Error(`Faltan los marcadores ${ini} / ${fin} en ${archivo}`);
  return texto.slice(0, a + ini.length) + nuevo + texto.slice(b);
}

// ── 1. Datos del curso (TypeScript) ─────────────────────────────
const tsLineas = SESIONES.map((x) => {
  const campos = [`date: ${q(x.f)}`, `day: ${q(dia(x.f))}`, `week: ${x.s}`, `topic: ${q(x.tema)}`];
  if (x.det?.length) campos.push(`details: [${x.det.map(q).join(', ')}]`);
  if (x.quiz) campos.push(`quiz: ${q(x.quiz)}`);
  if (x.taller) campos.push(`taller: ${q(x.taller)}`);
  if (x.lab) campos.push(`laboratorio: ${q(x.lab)}`);
  if (x.examen) campos.push(`examen: ${q(x.examen)}`);
  if (x.proyecto) campos.push(`proyecto: ${q(x.proyecto)}`);
  return `    { ${campos.join(', ')} },`;
});
let ts = readFileSync(TS, 'utf8');
ts = empalmar(ts, '// CRONOGRAMA_START', '  // CRONOGRAMA_END',
  `\n  // Escrito por scripts/pou-2027-10-cronograma.mjs: no editar a mano.\n  cronograma: [\n${tsLineas.join('\n')}\n  ],\n`, TS);
writeFileSync(TS, ts);

// ── 2. Programa por sesiones (HTML) ─────────────────────────────
const evaluacion = (x) => [x.quiz, x.taller, x.lab && `${x.lab} (prelaboratorio)`, x.examen, x.proyecto].filter(Boolean).map(esc).join('<br>');
const filas = [];
for (const x of SESIONES) {
  if (x.s === 9 && !filas.some((r) => r.includes('receso'))) {
    filas.push(`          <tr class="receso"><td></td><td>22 a 27 mar</td><td colspan="2">${esc(RECESO.texto)}</td></tr>`);
  }
  const sem = x.s >= 17 ? 'Finales' : x.s;
  const cuando = x.s >= 17 ? '24 a 29 may' : corta(x.f);
  const det = x.det?.length ? `<span class="det">${x.det.map(esc).join(' · ')}</span>` : '';
  filas.push(`          <tr class="t-${x.tipo}"><td class="sem">${sem}</td><td class="fecha">${cuando}</td><td><b>${esc(x.tema)}</b>${det}</td><td class="ev">${evaluacion(x)}</td></tr>`);
}
let html = readFileSync(PROGRAMA, 'utf8');
html = empalmar(html, '<!-- SESIONES_START -->', '          <!-- SESIONES_END -->', `\n${filas.join('\n')}\n`, PROGRAMA);
writeFileSync(PROGRAMA, html);

// ── 3. Cronograma interactivo (JSON) ────────────────────────────
const eventos = [];
for (const x of SESIONES) {
  eventos.push({
    kind: 'sesion', week: x.s, date: x.f, day: dia(x.f), block: 'Magistral', title: x.tema,
    bullets: x.det || [], tags: [x.quiz && 'quiz', x.taller && 'taller', x.lab && 'lab', x.examen && 'examen', x.tipo === 'retro' && 'retro'].filter(Boolean),
    quiz: x.quiz || null, taller: x.taller || null, laboratorio: x.lab || null, examen: x.examen || null,
  });
}
eventos.push({ kind: 'hito', week: 1, date: '2027-01-26', day: '', block: '', title: 'Publicación del reto del semestre', bullets: [], tags: ['hito'] });
eventos.push({ kind: 'receso', week: RECESO.s, date: RECESO.desde, day: '', block: '', title: RECESO.texto, bullets: [], tags: [] });
for (const e of ENTREGAS) eventos.push({ kind: e.k, week: e.s, date: e.f, day: '', block: '', title: e.t, bullets: [], tags: [e.k] });
const datos = {
  curso: 'POU · IQYA-2031 · 2027-10', generado: HOY,
  meta: {
    quices: SESIONES.filter((x) => x.quiz).length, talleres: SESIONES.filter((x) => x.taller).length,
    laboratorios: new Set(SESIONES.filter((x) => x.lab).map((x) => x.lab)).size,
    examenes: SESIONES.filter((x) => x.examen).length, entregas: ENTREGAS.filter((e) => /Bitácora/.test(e.t) && e.k === 'entrega').length,
  },
  events: eventos,
};
let crono = readFileSync(CRONO, 'utf8');
crono = crono.replace(/(<script id="cronograma-data" type="application\/json">)[\s\S]*?(<\/script>)/,
  (_, a, b) => a + JSON.stringify(datos).replace(/</g, '\\u003c') + b);
writeFileSync(CRONO, crono);

console.log(`${SESIONES.length} sesiones · ${datos.meta.quices} quices · ${datos.meta.talleres} talleres · ${datos.meta.laboratorios} laboratorios · ${datos.meta.examenes} exámenes`);
