// Cronograma de POU 2027-10 (IQYA-2031), clase por clase.
//
// Una sola lista de sesiones escribe los tres lugares donde aparece el
// cronograma, para que nunca se contradigan:
//   · el arreglo `cronograma` de components/data/classroom/pou-2027-10.ts
//     (lo usan «Qué hay para hoy» y la apertura de semanas), entre
//     // CRONOGRAMA_START y // CRONOGRAMA_END;
//   · la tabla del programa por sesiones de public/classroom/iqya-2031-2027-10/programa.html,
//     entre <!-- SESIONES_START --> y <!-- SESIONES_END -->;
//   · los datos del cronograma interactivo, public/classroom/iqya-2031-2027-10/cronograma.html;
//   · la Presentación del curso (slides/Presentacion_del_Curso/), la guía del reto y la de
//     bitácoras: en la presentación, la línea de tiempo,
//     entre <!-- CRONOGRAMA_DECK_START --> y <!-- CRONOGRAMA_DECK_END -->, y en los tres, cada fecha
//     escrita como <span data-crono="clave">, con las claves sesion-N, quiz-N, taller-N,
//     lab-N, examen-N, bitacora-N y memo-N (data-mayus pone la inicial en mayúscula,
//     data-anio agrega el año y data-forma="semana" escribe el número de la semana).
//
// Calendario académico 2027-10: clases del 25 de enero al 22 de mayo de 2027,
// receso del 22 al 27 de marzo (Semana Santa) y finales del 24 al 29 de mayo.
// POU va martes y jueves. Ningún festivo cae en esos días.
//
// Uso: node scripts/pou-2027-10-cronograma.mjs   (y después regenerar los PDF del programa y
//      de la presentación: CURSO=iqya-2031-2027-10 node scripts/build-pou-programa-pdf.mjs y
//      CURSO=iqya-2031-2027-10 node scripts/build-deck-doc.mjs Presentacion_del_Curso)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TS = path.join(RAIZ, 'components/data/classroom/pou-2027-10.ts');
const PROGRAMA = path.join(RAIZ, 'public/classroom/iqya-2031-2027-10/programa.html');
const CRONO = path.join(RAIZ, 'public/classroom/iqya-2031-2027-10/cronograma.html');
const DECK = path.join(RAIZ, 'public/classroom/iqya-2031-2027-10/slides/Presentacion_del_Curso/Presentacion_del_Curso.html');
// Documentos con fechas escritas como <span data-crono="clave"> (además de la presentación).
const CON_FECHAS = [
  path.join(RAIZ, 'public/classroom/iqya-2031-2027-10/reto-aceite-esencial.html'),
  path.join(RAIZ, 'public/classroom/iqya-2031-2027-10/guias/Guia_Bitacoras_Calculo/Guia_Bitacoras_Calculo.html'),
  path.join(RAIZ, 'public/classroom/iqya-2031-2027-10/slides/Trabajo_en_Equipo/Presentacion_Trabajo_en_Equipo.html'),
  path.join(RAIZ, 'public/classroom/iqya-2031-2027-10/slides/Diagramas_de_Ingenieria/Presentacion_Diagramas_de_Ingenieria.html'),
  path.join(RAIZ, 'public/classroom/iqya-2031-2027-10/slides/PID_Instrumentacion/Presentacion_Diagramas_PID.html'),
  path.join(RAIZ, 'public/classroom/iqya-2031-2027-10/slides/Propiedades_Solidos_Particulados/Presentacion_Propiedades_Solidos_Particulados.html'),
];
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
const MESES_LARGOS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
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

// ── 4. Presentación del curso: línea de tiempo y fechas ─────────
// Semanas cortas para la línea de tiempo: dos renglones de unos diez caracteres.
const SEMANAS = {
  1: ['Inicio', 'y equipos'], 2: ['Diagramas', 'PFD y P&ID'], 3: ['Sólidos y', 'desgarrado'],
  4: ['Arrastre', 'de vapor'], 5: ['Laboratorio', 'Clevenger'], 6: ['Bombas y', 'válvulas'],
  7: ['Agitación', 'y emulsión'], 8: ['Taller 3 y', 'Examen 1'], 9: ['Condensar', 'y decantar'],
  10: ['Frío y', 'filtración'], 11: ['Servicios', 'y Taller 4'], 12: ['Examen 2', 'y retro'],
  13: ['Lotes y', 'Air Still'], 14: ['Vacío y', 'azeótropos'], 15: ['Platos y', 'empaques'],
  16: ['Examen 3', 'y retro'], 17: ['Pósters', 'y cierre'],
};
const MODULOS = [
  { de: 1, a: 2, t: 'M1 · Diagramas', c: '#19222F' }, { de: 3, a: 3, t: 'M2', c: '#6E6A00' },
  { de: 4, a: 5, t: 'M3 · Arrastre', c: '#525C64' }, { de: 6, a: 6, t: 'M4', c: '#19222F' },
  { de: 7, a: 7, t: 'M5', c: '#6E6A00' }, { de: 8, a: 8, t: 'Examen', c: '#FFF500', osc: true },
  { de: 9, a: 11, t: 'M6 y M7', c: '#525C64' }, { de: 12, a: 12, t: 'Examen', c: '#FFF500', osc: true },
  { de: 13, a: 16, t: 'M8 · Destilación del producto', c: '#19222F' }, { de: 17, a: 17, t: 'Cierre', c: '#6E6A00' },
];
const X0 = 160, CW = 78, PASO = 84, REC = 40;
const colX = (s) => X0 + (s - 1) * PASO + (s >= 9 ? REC : 0);
const diaX = (iso, s) => { const d = fecha(iso).getDay(); return colX(s) + (d === 2 ? 20 : d === 4 ? 58 : d === 0 ? 70 : d === 1 ? 8 : 39); };
const lunes = (s) => {
  if (s >= 17) return '24 may';
  const x = SESIONES.find((y) => y.s === s); const d = fecha(x.f); d.setDate(d.getDate() - (d.getDay() - 1));
  return `${d.getDate()} ${MESES[d.getMonth()]}`;
};
const FILAS = [['Quices', 256], ['Talleres', 306], ['Laboratorios', 356], ['Exámenes', 406], ['Entregas', 456]];
const fy = Object.fromEntries(FILAS.map(([n, y]) => [n, y]));
const svg = [];
svg.push('<svg class="crono" viewBox="0 0 1680 604" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Línea de tiempo de 2027-10: módulos, quices, talleres, laboratorios, exámenes y entregas por semana.">');
for (const m of MODULOS) {
  const a = colX(m.de), b = colX(m.a) + CW;
  svg.push(`  <rect x="${a}" y="8" width="${b - a}" height="28" fill="${m.c}"/><text class="cr-mod${m.osc ? ' osc' : ''}" x="${(a + b) / 2}" y="28">${esc(m.t)}</text>`);
}
for (let s = 1; s <= 17; s++) {
  const x = colX(s), c = x + CW / 2, [t1, t2] = SEMANAS[s];
  const num = s >= 17 ? `<text class="cr-wk" x="${c}" y="84" style="font-size:19px">Finales</text>` : `<text class="cr-wk" x="${c}" y="86">${s}</text>`;
  svg.push(`  <rect class="cr-cell" x="${x}" y="46" width="${CW}" height="160"/>${num}<text class="cr-fe" x="${c}" y="110">${lunes(s)}</text><text class="cr-tema" x="${c}" y="148">${esc(t1)}</text><text class="cr-tema" x="${c}" y="168">${esc(t2)}</text>`);
}
const rx = colX(8) + CW + 6;
svg.push(`  <rect x="${rx}" y="46" width="${REC - 12}" height="435" fill="#E4E7EA"/><text class="cr-rec" transform="translate(${rx + (REC - 12) / 2 + 6} 264) rotate(-90)" text-anchor="middle">RECESO · 22 A 27 MAR</text>`);
for (const [n, y] of FILAS) svg.push(`  <line class="cr-rule" x1="0" y1="${y - 25}" x2="1680" y2="${y - 25}"/><text class="cr-lane" x="0" y="${y + 7}">${n}</text>`);
svg.push(`  <line class="cr-rule" x1="0" y1="481" x2="1680" y2="481"/>`);
for (const x of SESIONES) {
  const px = diaX(x.f, x.s);
  if (x.quiz) svg.push(`  <circle cx="${px}" cy="${fy.Quices}" r="9" fill="#19222F"/>`);
  else if (x.s === 1 && /práctica/i.test((x.det || []).join(' '))) svg.push(`  <circle cx="${px}" cy="${fy.Quices}" r="8" fill="none" stroke="#19222F" stroke-width="3"/>`);
  if (x.taller) svg.push(`  <rect x="${px - 13}" y="${fy.Talleres - 13}" width="26" height="26" fill="#6E6A00"/><text class="cr-mk" x="${px}" y="${fy.Talleres + 5}">${x.taller.replace(/\D/g, '')}</text>`);
  if (x.lab) svg.push(`  <rect x="${px - 15}" y="${fy.Laboratorios - 13}" width="30" height="26" fill="#FFF500" stroke="#19222F" stroke-width="2"/><text class="cr-mk osc" x="${px}" y="${fy.Laboratorios + 5}">L${x.lab.replace(/\D/g, '')}</text>`);
  if (x.examen) svg.push(`  <rect x="${px - 15}" y="${fy['Exámenes'] - 13}" width="30" height="26" fill="#19222F"/><text class="cr-mk" x="${px}" y="${fy['Exámenes'] + 5}">E${x.examen.replace(/\D/g, '')}</text>`);
  if (x.tipo === 'retro') svg.push(`  <circle cx="${px}" cy="${fy.Entregas - 4}" r="9" fill="none" stroke="#6E6A00" stroke-width="3"/>`);
}
for (const e of ENTREGAS.filter((y) => y.k === 'entrega')) {
  const bit = e.t.match(/Bitácora (\d)/), memo = e.t.match(/Laboratorio (\d)/);
  const px = e.s >= 17 ? colX(17) + 39 : diaX(e.f, e.s), y = fy.Entregas - 4;
  if (memo) svg.push(`  <path d="M${px} ${y - 11} l11 11 -11 11 -11 -11 z" fill="#525C64"/><text class="cr-fe" x="${px}" y="${y + 27}">M${memo[1]}</text>`);
  else svg.push(`  <path d="M${px - 9} ${y - 11} l20 11 -20 11 z" fill="#565200"/><text class="cr-fe" x="${px}" y="${y + 27}">${bit ? 'B' + bit[1] : 'Final'}</text>`);
}
const LEYENDA = [
  ['<circle cx="10" cy="-6" r="9" fill="#19222F"/>', 'Quiz (en blanco, el de práctica)'],
  ['<rect x="0" y="-18" width="22" height="22" fill="#6E6A00"/>', 'Taller en pareja'],
  ['<rect x="0" y="-18" width="26" height="22" fill="#FFF500" stroke="#19222F" stroke-width="2"/>', 'Laboratorio'],
  ['<rect x="0" y="-18" width="26" height="22" fill="#19222F"/>', 'Examen'],
  ['<path d="M2 -18 l20 11 -20 11 z" fill="#565200"/>', 'Bitácora y documento final'],
  ['<path d="M11 -18 l11 11 -11 11 -11 -11 z" fill="#525C64"/>', 'Memorando de laboratorio'],
  ['<circle cx="10" cy="-6" r="9" fill="none" stroke="#6E6A00" stroke-width="3"/>', 'Retroalimentación y sustentación'],
];
LEYENDA.forEach(([m, t], i) => {
  const col = i % 4, fila = Math.floor(i / 4);
  svg.push(`  <g transform="translate(${col * 420} ${540 + fila * 40})">${m}<text class="cr-leg" x="38" y="0">${esc(t)}</text></g>`);
});
svg.push('</svg>');

const largo = (iso) => { const d = fecha(iso); return `${DIAS[d.getDay()].toLowerCase()} ${d.getDate()} de ${MESES_LARGOS[d.getMonth()]}`; };
const varias = (isos) => {
  if (isos.length === 1) return largo(isos[0]);
  const [a, b] = isos.map(fecha);
  if (a.getMonth() === b.getMonth()) return `${DIAS[a.getDay()].toLowerCase()} ${a.getDate()} y ${DIAS[b.getDay()].toLowerCase()} ${b.getDate()} de ${MESES_LARGOS[b.getMonth()]}`;
  return `${largo(isos[0])} y ${largo(isos[1])}`;
};
function claveCrono(clave) {
  const [tipo, n] = [clave.replace(/-\d+$/, ''), Number(clave.match(/\d+$/)?.[0])];
  const buscar = (campo, nombre) => SESIONES.filter((x) => x[campo] === nombre);
  let isos, semana;
  if (tipo === 'sesion') { isos = [SESIONES[n - 1]?.f]; semana = SESIONES[n - 1]?.s; }
  else if (tipo === 'quiz') { const l = buscar('quiz', `Quiz ${n}`); isos = l.map((x) => x.f); semana = l[0]?.s; }
  else if (tipo === 'taller') { const l = buscar('taller', `Taller ${n}`); isos = l.map((x) => x.f); semana = l[0]?.s; }
  else if (tipo === 'lab') { const l = buscar('lab', `Laboratorio ${n}`); isos = l.map((x) => x.f); semana = l[0]?.s; }
  else if (tipo === 'examen') { const l = buscar('examen', `Examen ${n}`); isos = l.map((x) => x.f); semana = l[0]?.s; }
  else if (tipo === 'bitacora' || tipo === 'memo') {
    const t = tipo === 'bitacora' ? `Entrega de la Bitácora ${n}` : `Memorando del Laboratorio ${n}`;
    const e = ENTREGAS.find((y) => y.t === t); isos = e ? [e.f] : []; semana = e?.s;
  }
  if (!isos?.length || !isos[0]) throw new Error(`Clave de fecha desconocida en la presentación: ${clave}`);
  return { texto: varias(isos), semana };
}
// En el PDF documento la línea de tiempo no se lee a lo ancho de la hoja: va como tabla.
const corto = (x) => (x.quiz ? `${x.quiz}: ${x.tema}` : x.tema);
const tabla = ['<table class="crono-tabla solo-impreso">', '    <thead><tr><th>Sem.</th><th>Semana del</th><th>Martes</th><th>Jueves</th><th>Entregas</th></tr></thead>', '    <tbody>'];
for (let s = 1; s <= 17; s++) {
  if (s === 9) tabla.push(`      <tr class="receso"><td></td><td>22 mar</td><td colspan="3">${esc(RECESO.texto)}</td></tr>`);
  const ses = SESIONES.filter((x) => x.s === s);
  const mar = ses.filter((x) => fecha(x.f).getDay() === 2).map(corto).join('<br>');
  const jue = ses.filter((x) => fecha(x.f).getDay() === 4).map(corto).join('<br>');
  const ent = ENTREGAS.filter((e) => e.s === s && e.k === 'entrega').map((e) => (s >= 17 ? e.t : `${e.t} (${corta(e.f).toLowerCase()})`)).join('<br>');
  if (s >= 17) tabla.push(`      <tr><td class="sem">Fin.</td><td class="lun">24 may</td><td colspan="2">${esc(ses.map((x) => x.tema).join(' · '))}</td><td>${esc(ent)}</td></tr>`);
  else tabla.push(`      <tr><td class="sem">${s}</td><td class="lun">${lunes(s)}</td><td>${esc(mar).replace(/&lt;br&gt;/g, '<br>')}</td><td>${esc(jue).replace(/&lt;br&gt;/g, '<br>')}</td><td>${esc(ent).replace(/&lt;br&gt;/g, '<br>')}</td></tr>`);
}
tabla.push('    </tbody>', '  </table>');
let deck = readFileSync(DECK, 'utf8');
deck = empalmar(deck, '<!-- CRONOGRAMA_DECK_START -->', '<!-- CRONOGRAMA_DECK_END -->',
  `\n  <div class="desliza">${svg.join('\n')}</div>\n  ${tabla.join('\n')}\n  `, DECK);
let fechas = 0;
const ponerFechas = (html) => html.replace(/<span data-crono="([^"]+)"([^>]*)>[^<]*<\/span>/g, (_, clave, attrs) => {
  const { texto, semana } = claveCrono(clave);
  let t = /data-forma="semana"/.test(attrs) ? String(semana) : texto + (/data-anio/.test(attrs) ? ' de 2027' : '');
  if (/data-mayus/.test(attrs)) t = t.charAt(0).toUpperCase() + t.slice(1);
  fechas++;
  return `<span data-crono="${clave}"${attrs}>${t}</span>`;
});
writeFileSync(DECK, ponerFechas(deck));
for (const f of CON_FECHAS) writeFileSync(f, ponerFechas(readFileSync(f, 'utf8')));

console.log(`${SESIONES.length} sesiones · ${datos.meta.quices} quices · ${datos.meta.talleres} talleres · ${datos.meta.laboratorios} laboratorios · ${datos.meta.examenes} exámenes · ${fechas} fechas en la presentación y las guías`);
