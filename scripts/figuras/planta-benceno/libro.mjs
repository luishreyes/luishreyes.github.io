// Las figuras de la sección de reacción de la planta de benceno para el libro de operaciones unitarias
// (capítulo 2, Los diagramas de ingeniería). Todas salen del mismo modelo (geo.mjs y planta_data.json):
//
//   node build.mjs && node libro.mjs --salida ../../../../libro-operaciones-unitarias/libro
//
//   _planta-iso.qmd        el isométrico del skill anatomy, con el nombre de cada equipo
//   _planta-planta.qmd     la vista en planta (plot plan): equipos, rack, coordenadas y cotas
//   _planta-elevacion.qmd  la elevación mirando al norte, con las elevaciones principales
//   _iso-tuberia.qmd       el isométrico de la línea 9, de R-101 a E-102, con sus cotas en mm
//
// Las tres últimas son dibujos de línea con las clases de svg.dg del libro (estilo/libro.scss).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const LIBRO = resolve(arg('--salida', join(AQUI, '../../../../libro-operaciones-unitarias/libro')));
const DEST = join(LIBRO, 'figuras/los-diagramas-de-ingenieria');
if (!existsSync(join(AQUI, 'out/fig.svg'))) throw new Error('Falta out/: corra antes node build.mjs');
mkdirSync(DEST, { recursive: true });
const KIT = fileURLToPath(new URL('../../../.claude/skills/anatomy', import.meta.url));
const k = await import(KIT + '/kit/iso-kit.mjs');
const D = JSON.parse(readFileSync(join(AQUI, 'planta_data.json'), 'utf8'));
const { PB, ROUTES, ANCLAS } = D;
const r1 = v => Math.round(v * 10) / 10;
const mm = dm => Math.round(dm * 100).toLocaleString('es-CO').replace(/\./g, ' ');
const escribir = (n, html) => { writeFileSync(join(DEST, n), '```{=html}\n' + html.trim() + '\n```\n'); console.log(n, Math.round(html.length / 1024), 'KB'); };
const txt = (x, y, t, cls = 'lbl-s', anc = 'start') => `<text x="${r1(x)}" y="${r1(y)}" class="${cls}" text-anchor="${anc}">${t}</text>`;

/* ── 1. El isométrico, con rótulos ───────────────────────────────────── */
{
  const letra = 14;
  const R = [
    ['H101', 30, 640, 'H-101 · Horno', -12, 60],
    ['R101', 430, 200, 'R-101 · Reactor', 25, 0],
    ['PLAT', 430, 140, 'Plataforma y escalera', 0, 0],
    ['E101', 30, 700, 'E-101 · Precalentador', 0, 0],
    ['RACK', 440, 690, 'Rack de tuberías', 0, 0],
    ['FLARE', 190, 740, 'Cabezal de tea', 0, 0],
    ['E102', 560, 640, 'E-102 · Enfriador', 0, 0],
    ['CW', 700, 690, 'Agua de enfriamiento', 0, 0],
    ['V102', 830, 250, 'V-102 · Separador de alta', 0, 0],
    ['PSV', 830, 200, 'Válvula de seguridad a la tea', 0, 0],
    ['LV', 900, 400, 'Válvula de nivel', 0, 0],
    ['C101B', 860, 640, 'C-101 A/B · Compresores', 0, 0],
  ];
  const trazos = R.map(([a, x, y, t, dx, dy]) => {
    const [ax, ay] = k.iso(ANCLAS[a], D.P).map(v => r1(v));
    const bx = ax + dx, by = ay + dy;
    return `<path class="rot-linea" d="M${bx} ${by}L${x} ${y}"/><circle class="rot-punto" cx="${bx}" cy="${by}" r="2.6"/>` +
      `<text class="rot-texto" x="${x + 5}" y="${r1(y + letra * 0.35)}" text-anchor="start" font-size="${letra}">${t}</text>`;
  }).join('');
  const svg = readFileSync(join(AQUI, 'out/fig.svg'), 'utf8');
  const etiqueta = 'Isométrico de la sección de reacción de la planta de benceno: el rack de tuberías en el centro; al norte, el horno H-101, el precalentador E-101 y el reactor R-101 con su plataforma y su escalera; al sur, el enfriador E-102, el separador V-102 con su válvula de seguridad y los compresores C-101 A/B. Las líneas de proceso van de un equipo al otro por el rack.';
  const cuerpo = svg
    .replace(/<svg([^>]*)>/, (_, a) => `<svg${a.replace(/\s(id|viewBox|aria-label|role|width|height)="[^"]*"/g, '')} viewBox="0 80 1090 680" role="img" aria-label="${etiqueta}">`)
    .replace(/<\/svg>\s*$/, `<g class="rotulos">${trazos}</g></svg>`);
  escribir('_planta-iso.qmd', '<div class="iso iso-libro" data-theme="light">' + cuerpo + '</div>');
}

/* ── 2. Vista en planta (plot plan) ──────────────────────────────────── */
const { RACK, LANE, H101, E101, R101, E102, V102, C101 } = PB;
{
  const s = 2.5, X0 = -48, Y0 = -118, pad = 30;
  const X = x => r1(pad + (x - X0) * s), Y = y => r1(pad + 26 + (y - Y0) * s);
  const out = [];
  const rect = (x0, y0, x1, y1, cls = 'kf') => out.push(`<rect x="${X(x0)}" y="${Y(y0)}" width="${r1((x1 - x0) * s)}" height="${r1((y1 - y0) * s)}" class="${cls}"/>`);
  const circ = (x, y, r, cls = 'kf', extra = '') => out.push(`<circle cx="${X(x)}" cy="${Y(y)}" r="${r1(r * s)}" class="${cls}"${extra}/>`);
  const line = (pts, cls = 'kt', extra = '') => out.push(`<path d="M ${pts.map(([x, y]) => `${X(x)} ${Y(y)}`).join(' L ')}" class="${cls}"${extra}/>`);
  // ejes de los pórticos del rack (línea de trazo y punto) con su letra
  RACK.xs.forEach((x, i) => {
    line([[x, Y0 + 4], [x, 150]], 'dim', ' stroke-dasharray="14 4 3 4"');
    out.push(`<circle cx="${X(x)}" cy="${r1(pad + 8)}" r="11" class="kf" style="stroke-width:1.2"/>` + txt(X(x), pad + 12.5, 'ABCDEF'[i], 'bub-t', 'middle'));
  });
  // el rack: vigas, columnas y los carriles de las líneas
  rect(RACK.xs[0], -RACK.y - 1.5, RACK.xs.at(-1), RACK.y + 1.5, 'kt');
  Object.values(LANE).forEach(y => line([[RACK.x0, y], [RACK.x1, y]], 'imp'));
  RACK.xs.forEach(x => [-RACK.y, RACK.y].forEach(y => rect(x - 1.5, y - 1.5, x + 1.5, y + 1.5, 'kf')));
  // equipos
  circ(H101.x, H101.y, H101.R + 1.2); circ(H101.x, H101.y, H101.rs, 'kt', ' stroke-dasharray="5 3"');
  circ(R101.x, R101.y, R101.R + 7, 'kt', ' stroke-dasharray="5 3"'); circ(R101.x, R101.y, R101.R);
  const hx = (E) => { rect(E.x0, E.y - E.R, E.x1, E.y + E.R); rect(E.x0 - E.ch, E.y - E.R, E.x0, E.y + E.R); rect(E.x1, E.y - E.R, E.x1 + E.ch, E.y + E.R);
    line([[E.x0 - E.ch, E.y - E.R], [E.x0 - E.ch - E.R * 0.55, E.y], [E.x0 - E.ch, E.y + E.R]], 'k'); line([[E.x1 + E.ch, E.y - E.R], [E.x1 + E.ch + E.R * 0.55, E.y], [E.x1 + E.ch, E.y + E.R]], 'k'); };
  hx(E101); hx(E102);
  circ(V102.x, V102.y, V102.R);
  C101.ys.forEach(y => { rect(C101.m0 - 4, y - 9, C101.x1 + 4, y + 9, 'kt'); rect(C101.m0, y - C101.mR, C101.m1, y + C101.mR); rect(C101.x0, y - C101.R, C101.x1, y + C101.R); });
  rect(E102.x1 + 4, E102.y + 10, E102.x1 + 14, E102.y + 22, 'kt');
  // códigos y coordenadas (E y N en mm desde el eje del rack en x = 0, y = 0)
  const tag = (x, y, t, c, anc = 'start') => out.push(txt(X(x), Y(y), t, 'lbl', anc) + txt(X(x), Y(y) + 16, c, 'lbl-ms muted', anc));
  const co = (x, y) => `E ${mm(x)} · N ${mm(-y)}`;
  tag(H101.x - 18, H101.y - 26, 'H-101', co(H101.x, H101.y), 'start');
  tag(R101.x + 22, R101.y - 6, 'R-101', co(R101.x, R101.y));
  tag(E101.x0 - 10, E101.y + 16, 'E-101', co((E101.x0 + E101.x1) / 2, E101.y));
  tag(E102.x0, E102.y + 16, 'E-102', co((E102.x0 + E102.x1) / 2, E102.y));
  tag(V102.x + 10, V102.y - 14, 'V-102', co(V102.x, V102.y));
  tag(C101.m0 - 4, C101.ys[1] + 18, 'C-101 A/B', `E ${mm((C101.m0 + C101.x1) / 2)} · N ${mm(-C101.ys[0])} y ${mm(-C101.ys[1])}`);
  out.push(txt(X(RACK.x0), Y(-RACK.y) - 8, 'Rack de tuberías', 'lbl-s', 'start'));
  // cotas: separación de los pórticos y ancho del rack
  const cota = (x0, x1, y, t) => out.push(`<path d="M ${X(x0)} ${Y(y)} H ${X(x1)} M ${X(x0)} ${Y(y) - 5} v 10 M ${X(x1)} ${Y(y) - 5} v 10" class="dim"/>` + txt((X(x0) + X(x1)) / 2, Y(y) - 5, t, 'lbl-ms annot', 'middle'));
  cota(RACK.xs[3], RACK.xs[4], -RACK.y - 9, mm(RACK.xs[4] - RACK.xs[3]));
  out.push(`<path d="M ${X(RACK.x1 + 4)} ${Y(-RACK.y)} V ${Y(RACK.y)} M ${X(RACK.x1)} ${Y(-RACK.y)} h 14 M ${X(RACK.x1)} ${Y(RACK.y)} h 14" class="dim"/>` + txt(X(RACK.x1 + 7), (Y(-RACK.y) + Y(RACK.y)) / 2 + 4, mm(2 * RACK.y), 'lbl-ms annot', 'start'));
  // norte y escala gráfica
  const nx = X(RACK.x1 - 6), ny = Y(Y0 + 20);
  out.push(`<path d="M ${nx} ${ny + 26} V ${ny - 22}" class="k" marker-end="url(#dg-fl)"/>` + txt(nx, ny - 30, 'N', 'lbl-b', 'middle'));
  const ex = X(-40), ey = Y(150);
  out.push(`<path d="M ${ex} ${ey} h ${100 * s} M ${ex} ${ey - 5} v 10 M ${ex + 50 * s} ${ey - 4} v 8 M ${ex + 100 * s} ${ey - 5} v 10" class="k" style="stroke-width:1.4"/>` +
    txt(ex, ey + 18, '0', 'lbl-ms', 'middle') + txt(ex + 50 * s, ey + 18, '5', 'lbl-ms', 'middle') + txt(ex + 100 * s, ey + 18, '10 m', 'lbl-ms', 'middle'));
  const W = r1(pad * 2 + (318 - X0) * s), H = r1(pad + 26 + (162 - Y0) * s);
  const defs = '<defs><marker id="dg-fl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="fi"/></marker></defs>';
  escribir('_planta-planta.qmd', `<div class="dg-marco">${`<svg class="dg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Vista en planta de la sección de reacción: el rack de tuberías de oeste a este con sus pórticos A a F cada 6 m, el horno, el precalentador y el reactor al norte, y el enfriador, el separador y los compresores al sur, con las coordenadas de cada equipo y la flecha del norte.">${defs}${out.join('')}</svg>`}</div>`);
}

/* ── 3. Elevación mirando al norte ───────────────────────────────────── */
{
  const s = 2.5, X0 = -48, Z1 = 190, pad = 30, IZQ = 130;
  const X = x => r1(pad + IZQ + (x - X0) * s), Z = z => r1(pad + (Z1 - z) * s);
  const out = [];
  const rect = (x0, z0, x1, z1, cls = 'kf') => out.push(`<rect x="${X(x0)}" y="${Z(z1)}" width="${r1((x1 - x0) * s)}" height="${r1((z1 - z0) * s)}" class="${cls}"/>`);
  const path = (d, cls = 'kf') => out.push(`<path d="${d}" class="${cls}"/>`);
  // de lo más lejano (norte) a lo más cercano (sur), con relleno blanco: lo de adelante tapa lo de atrás
  const H = H101;
  [-12, 12].forEach(dx => rect(H.x + dx - 1.2, 0, H.x + dx + 1.2, H.leg, 'kf'));
  rect(H.x - H.R - 1.2, H.leg, H.x + H.R + 1.2, H.z0); rect(H.x - H.R, H.z0, H.x + H.R, H.z1);
  path(`M ${X(H.x - H.R)} ${Z(H.z1)} L ${X(H.x - H.rs - 3)} ${Z(H.cone)} H ${X(H.x + H.rs + 3)} L ${X(H.x + H.R)} ${Z(H.z1)} Z`);
  rect(H.x - H.rs, H.cone, H.x + H.rs, H.stack);
  const Rr = R101;
  rect(Rr.x - Rr.R - 2, 0, Rr.x + Rr.R + 2, 1); rect(Rr.x - Rr.R, 1, Rr.x + Rr.R, Rr.z0); rect(Rr.x - Rr.R, Rr.z0, Rr.x + Rr.R, Rr.z1);
  path(`M ${X(Rr.x - Rr.R)} ${Z(Rr.z1)} A ${r1(Rr.R * s)} ${r1(Rr.hd * s)} 0 0 1 ${X(Rr.x + Rr.R)} ${Z(Rr.z1)} Z`);
  rect(Rr.x - 1.5, Rr.z1 + Rr.hd - 0.4, Rr.x + 1.5, Rr.z1 + Rr.hd + 3.5);
  rect(Rr.x - Rr.R - 7, Rr.z1 + 2, Rr.x + Rr.R + 7, Rr.z1 + 3);
  path(`M ${X(Rr.x - Rr.R - 6.5)} ${Z(Rr.z1 + 3)} V ${Z(Rr.z1 + 13.5)} H ${X(Rr.x + Rr.R + 6.5)} V ${Z(Rr.z1 + 3)} M ${X(Rr.x - Rr.R - 6.5)} ${Z(Rr.z1 + 8.2)} H ${X(Rr.x + Rr.R + 6.5)}`, 'kt');
  const hxE = (E, saddles) => {
    saddles.forEach(x => { rect(x - 4, 0, x + 4, 5, 'kf'); rect(x - 1.6, 5, x + 1.6, E.z - E.R, 'kf'); });
    rect(E.x0, E.z - E.R, E.x1, E.z + E.R); rect(E.x0 - E.ch, E.z - E.R, E.x0, E.z + E.R); rect(E.x1, E.z - E.R, E.x1 + E.ch, E.z + E.R);
    path(`M ${X(E.x0 - E.ch)} ${Z(E.z + E.R)} A ${r1(E.R * 0.55 * s)} ${r1(E.R * s)} 0 0 0 ${X(E.x0 - E.ch)} ${Z(E.z - E.R)} Z`);
    path(`M ${X(E.x1 + E.ch)} ${Z(E.z + E.R)} A ${r1(E.R * 0.55 * s)} ${r1(E.R * s)} 0 0 1 ${X(E.x1 + E.ch)} ${Z(E.z - E.R)} Z`);
  };
  hxE(E101, [E101.x0 + 8, E101.x1 - 8]);
  // rack: columnas, la viga longitudinal y las líneas que corren sobre él
  RACK.xs.forEach(x => rect(x - 1.5, 0, x + 1.5, RACK.z));
  rect(RACK.xs[0] - 1.5, RACK.z, RACK.xs.at(-1) + 1.5, RACK.z + RACK.t);
  rect(RACK.x0, RACK.z + RACK.t, RACK.x1, RACK.z + RACK.t + 4.4, 'kf');
  path(`M ${X(RACK.x0)} ${Z(RACK.z + RACK.t + 2.2)} H ${X(RACK.x1)}`, 'kt');
  hxE(E102, [E102.x0 + 16, E102.x1 - 16]);
  const V = V102;
  [-4.8, 4.8].forEach(dx => rect(V.x + dx - 0.9, 0, V.x + dx + 0.9, V.z0 + 8));
  rect(V.x - V.R, V.z0, V.x + V.R, V.z1);
  path(`M ${X(V.x - V.R)} ${Z(V.z1)} A ${r1(V.R * s)} ${r1(V.hd * s)} 0 0 1 ${X(V.x + V.R)} ${Z(V.z1)} Z M ${X(V.x - V.R)} ${Z(V.z0)} A ${r1(V.R * s)} ${r1(V.hd * s)} 0 0 0 ${X(V.x + V.R)} ${Z(V.z0)} Z`);
  [1, 0].forEach(() => { rect(C101.m0 - 4, 0, C101.x1 + 4, 4); rect(C101.m0 - 2, 4, C101.x1 + 2, 5.5); rect(C101.m0, C101.z - C101.mR, C101.m1, C101.z + C101.mR); rect(C101.x0, C101.z - C101.R, C101.x1, C101.z + C101.R); });
  // piso y elevaciones
  path(`M ${X(-46)} ${Z(0)} H ${X(312)}`, 'k');
  const el = (z, t, x = -46) => out.push(`<path d="M ${X(x) - 46} ${Z(z)} h 40" class="dim"/><path d="M ${X(x) - 10} ${Z(z) - 7} l 6 7 l 6 -7 z" class="fi"/>` + txt(X(x) - 48, Z(z) - 4, t, 'lbl-ms annot', 'end'));
  el(0, 'EL. ±0,000'); el(RACK.z + RACK.t, 'EL. +5,500'); el(Rr.z1, 'EL. +14,400'); el(H.stack, 'EL. +16,000');
  const tag = (x, z, t) => out.push(txt(X(x), Z(z), t, 'lbl', 'middle'));
  tag(H.x, H.stack + 5, 'H-101'); tag(Rr.x, Rr.z1 + 22, 'R-101'); tag(E101.x0 + 10, E101.z + E101.R + 18, 'E-101');
  tag((E102.x0 + E102.x1) / 2, E102.z + E102.R + 4, 'E-102'); tag(V.x, V.z1 + V.hd + 4, 'V-102'); out.push(txt(X(C101.x1 + 6), Z(C101.z + 2), 'C-101 A/B', 'lbl', 'start'));
  const W = r1(pad * 2 + IZQ + (330 - X0) * s), Hh = r1(pad * 2 + Z1 * s);
  escribir('_planta-elevacion.qmd', `<div class="dg-marco"><svg class="dg" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="Elevación de la sección de reacción mirando al norte: el horno con su chimenea, el reactor sobre su faldón con la plataforma de la cabeza, el rack de tuberías a 5,5 m y, adelante, el enfriador, el separador y los compresores, con las elevaciones principales.">${out.join('')}</svg></div>`);
}

/* ── 4. Isométrico de la línea 9 (no a escala), con sus cotas en mm ─────────── */
{
  const pts = ROUTES.p09.pts;
  const tramos = pts.slice(1).map((p, i) => [p[0] - pts[i][0], p[1] - pts[i][1], p[2] - pts[i][2]]);
  const largo = d => Math.hypot(...d);
  // Ejes del papel: el norte (−y del modelo) sube a la derecha a 30°, el este baja a la derecha a 30°, arriba es arriba.
  const c30 = Math.cos(Math.PI / 6), s30 = 0.5;
  const dir = ([dx, dy, dz]) => { const e = Math.sign(dx), n = Math.sign(-dy), u = Math.sign(dz); return [e * c30 + n * c30, e * s30 - n * s30 - u]; };
  // longitud en el papel: no a escala, pero crece con la real
  const papel = L => 90 + 60 * Math.sqrt(L / 10);
  const V = [[0, 0]];
  tramos.forEach(d => { const [ux, uy] = dir(d), L = papel(largo(d)), q = V.at(-1); V.push([q[0] + ux * L, q[1] + uy * L]); });
  const bx = [Math.min(...V.map(p => p[0])), Math.max(...V.map(p => p[0]))], by = [Math.min(...V.map(p => p[1])), Math.max(...V.map(p => p[1]))];
  const ox = 390 - (bx[0] + bx[1]) / 2, oy = 300 - (by[0] + by[1]) / 2;
  V.forEach(p => { p[0] = r1(p[0] + ox); p[1] = r1(p[1] + oy); });
  const out = [];
  out.push(`<path d="M ${V.map(p => p.join(' ')).join(' L ')}" class="proc" style="stroke-width:3.4"/>`);
  const brida = (p, q) => { const ux = q[0] - p[0], uy = q[1] - p[1], L = Math.hypot(ux, uy), nx = -uy / L * 9, ny = ux / L * 9, ax = ux / L * 3, ay = uy / L * 3;
    return `<path d="M ${r1(p[0] - nx)} ${r1(p[1] - ny)} L ${r1(p[0] + nx)} ${r1(p[1] + ny)} M ${r1(p[0] + ax - nx)} ${r1(p[1] + ay - ny)} L ${r1(p[0] + ax + nx)} ${r1(p[1] + ay + ny)}" class="k"/>`; };
  out.push(brida(V[0], V[1]), brida(V.at(-1), V.at(-2)));
  V.slice(1, -1).forEach(p => out.push(`<circle cx="${p[0]}" cy="${p[1]}" r="3.6" class="fi"/>`));
  // cotas por fuera del trazado: a la izquierda de cada tramo según su sentido (abajo, derecha, arriba e izquierda)
  tramos.forEach((d, i) => {
    const p = V[i], q = V[i + 1], ux = q[0] - p[0], uy = q[1] - p[1], L = Math.hypot(ux, uy);
    const nx = -uy / L, ny = ux / L;
    const o = 34, a = [p[0] + nx * o, p[1] + ny * o], b = [q[0] + nx * o, q[1] + ny * o];
    out.push(`<path d="M ${r1(p[0] + nx * 8)} ${r1(p[1] + ny * 8)} L ${r1(a[0] + nx * 6)} ${r1(a[1] + ny * 6)} M ${r1(q[0] + nx * 8)} ${r1(q[1] + ny * 8)} L ${r1(b[0] + nx * 6)} ${r1(b[1] + ny * 6)} M ${r1(a[0])} ${r1(a[1])} L ${r1(b[0])} ${r1(b[1])}" class="dim"/>`);
    out.push(txt((a[0] + b[0]) / 2 + nx * 16, (a[1] + b[1]) / 2 + ny * 16 + 5, mm(largo(d)), 'lbl-m annot', 'middle'));
  });
  // rótulos de los extremos, número de línea, elevaciones y flecha de flujo
  const elev = z => `EL. +${(z / 10).toFixed(3).replace('.', ',')}`;
  out.push(txt(V[0][0] + 14, V[0][1] - 30, 'Salida de R-101', 'lbl-s', 'start') + txt(V[0][0] + 14, V[0][1] - 13, elev(pts[0][2]), 'lbl-ms', 'start'));
  out.push(txt(V.at(-1)[0] + 16, V.at(-1)[1] + 6, 'Entrada a la coraza de E-102', 'lbl-s', 'start') + txt(V.at(-1)[0] + 16, V.at(-1)[1] + 24, elev(pts.at(-1)[2]), 'lbl-ms', 'start'));
  out.push(txt(V[2][0] + 12, V[2][1] - 10, elev(pts[2][2]), 'lbl-ms', 'start'));
  // el número de línea va a lo largo del tramo largo, por dentro
  const a2 = Math.atan2(V[2][1] - V[3][1], V[2][0] - V[3][0]) * 180 / Math.PI, t2 = 0.7;
  const m2 = [V[2][0] + (V[3][0] - V[2][0]) * t2 + s30 * 16, V[2][1] + (V[3][1] - V[2][1]) * t2 + c30 * 16];
  out.push(`<text x="${r1(m2[0])}" y="${r1(m2[1])}" class="lbl" text-anchor="middle" dominant-baseline="hanging" transform="rotate(${r1(a2)} ${r1(m2[0])} ${r1(m2[1])})">8″-P-109-A1</text>`);
  const fd = dir(tramos[2]), fa = [V[2][0] + (V[3][0] - V[2][0]) * 0.22, V[2][1] + (V[3][1] - V[2][1]) * 0.22];
  out.push(`<path d="M ${r1(fa[0])} ${r1(fa[1])} l ${r1(fd[0] * 22)} ${r1(fd[1] * 22)}" class="proc" style="stroke-width:3.4" marker-end="url(#dg-fl)"/>`);
  // norte y ejes
  const nx0 = 70, ny0 = 500;
  out.push(`<path d="M ${nx0} ${ny0} l ${r1(c30 * 46)} ${r1(-s30 * 46)}" class="k" marker-end="url(#dg-fl)"/>` + txt(nx0 + c30 * 46 + 6, ny0 - s30 * 46 - 4, 'N', 'lbl-b', 'start'));
  out.push(`<path d="M ${nx0} ${ny0} l ${r1(c30 * 34)} ${r1(s30 * 34)}" class="kt" marker-end="url(#dg-fl)"/>` + txt(nx0 + c30 * 34 + 6, ny0 + s30 * 34 + 10, 'E', 'lbl-s', 'start'));
  out.push(`<path d="M ${nx0} ${ny0} v -40" class="kt" marker-end="url(#dg-fl)"/>` + txt(nx0, ny0 - 46, 'Arriba', 'lbl-s', 'middle'));
  out.push(txt(30, 30, 'Isométrico de tubería · línea 9', 'lbl', 'start') + txt(30, 48, 'Cotas en mm · no a escala', 'lbl-ms muted', 'start'));
  const defs = '<defs><marker id="dg-fl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="fi"/></marker></defs>';
  escribir('_iso-tuberia.qmd', `<div class="dg-marco dg-iso-marco"><svg class="dg dg-iso" viewBox="0 0 760 560" role="img" aria-label="Isométrico de tubería de la línea 9, de la salida del reactor R-101 a la entrada de la coraza de E-102: sale hacia el este, sube, corre hacia el sur por encima del rack y baja, con sus cotas en milímetros, sus elevaciones y la flecha del norte.">${defs}${out.join('')}</svg></div>`);
}
