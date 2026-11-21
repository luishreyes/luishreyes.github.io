/* 11-00-comun.js: se escribe en interactivo/bombas/secciones/ y se trae con node interactivo/al-libro.mjs. No se edita aquí. */
/* Piezas de dibujo que comparten las animaciones del capítulo: texto con subíndices, flechas, manómetros,
   ejes de gráfica y trazos que se dibujan solos. Los colores salen de la paleta del libro (PALETA). */
(function () {
  'use strict';
  var PA = window.PALETA, B = PA.base, M = PA.materiales, G = PA.graficas, C = PA.cortes;
  var s = ZB.s;
  var D = ZB.dib = {};
  D.col = {
    tinta: B.tinta, tinta2: B['tinta-2'], guia: B.guia, eje: B.eje, borde: B.borde, rejilla: B.rejilla, zona: B.zona,
    papel: B.papel, blanco: B.blanco, amarillo: B.amarillo, amarilloClaro: B['amarillo-claro'], oliva: B.oliva, olivaOsc: B['oliva-osc'],
    azul: B.azul, naranja: B.naranja, alerta: B.alerta,
    agua: M.agua.relleno, aguaM: M.agua.medio, aguaO: M.agua.oscuro, aceite: M.aceite.medio, aceiteO: M.aceite.oscuro,
    metal: C.pieza, metalM: C['pieza-media'], metalO: C['pieza-oscura'], flujo: C.flujo, calor: C.calor,
    serie: G.series, caso: G['caso-relleno'], casoT: G['caso-trazo'], fuera: G['fuera-de-rango'], ref: G.referencia,
    caliente: M.caliente.medio, calienteO: M.caliente.oscuro, vapor: M.gas.medio
  };
  var K = D.col;

  // Texto con _x o _{xx} (subíndice) y ^{xx} (superíndice). o: { tam, peso, ancla, color, halo, clase }
  D.t = function (padre, x, y, str, o) {
    o = o || {};
    var a = { x: x, y: y, 'font-size': o.tam || 14, 'font-weight': o.peso || 500, 'text-anchor': o.ancla || 'start', fill: o.color || K.tinta };
    if (o.halo) a.style = 'paint-order:stroke;stroke:' + (o.halo === true ? K.papel : o.halo) + ';stroke-width:4px;stroke-linejoin:round';
    if (o.it) a['font-style'] = 'italic';
    var t = s('text', a, padre);
    D.ponerTexto(t, str);
    return t;
  };
  D.ponerTexto = function (t, str) {
    while (t.firstChild) t.removeChild(t.firstChild);
    var re = /([_^])(\{[^}]*\}|.)/g, ult = 0, m;
    str = String(str);
    while ((m = re.exec(str))) {
      if (m.index > ult) s('tspan', {}, t, str.slice(ult, m.index));
      var txt = m[2].charAt(0) === '{' ? m[2].slice(1, -1) : m[2];
      var sub = m[1] === '_';
      s('tspan', { 'baseline-shift': sub ? '-25%' : '40%', 'font-size': '72%' }, t, txt);
      ult = re.lastIndex;
    }
    if (ult < str.length) s('tspan', {}, t, str.slice(ult));
  };
  D.flecha = function (padre, x1, y1, x2, y2, o) {
    o = o || {};
    var g = s('g', { opacity: o.op == null ? 1 : o.op }, padre);
    var ang = Math.atan2(y2 - y1, x2 - x1), L = o.punta || 9, w = o.ancho || 2;
    var xb = x2 - L * Math.cos(ang), yb = y2 - L * Math.sin(ang);
    s('line', { x1: x1, y1: y1, x2: xb, y2: yb, stroke: o.color || K.tinta, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-dasharray': o.guion || 'none' }, g);
    var p1 = [xb + L * 0.45 * Math.sin(ang), yb - L * 0.45 * Math.cos(ang)], p2 = [xb - L * 0.45 * Math.sin(ang), yb + L * 0.45 * Math.cos(ang)];
    s('path', { d: 'M' + x2 + ' ' + y2 + 'L' + p1.join(' ') + 'L' + p2.join(' ') + 'Z', fill: o.color || K.tinta }, g);
    return g;
  };
  // Flecha cuyo largo cambia: devuelve una función que la pone entre dos puntos.
  D.flechaViva = function (padre, o) {
    o = o || {};
    var g = s('g', {}, padre);
    var l = s('line', { stroke: o.color || K.tinta, 'stroke-width': o.ancho || 2.4, 'stroke-linecap': 'round' }, g);
    var p = s('path', { fill: o.color || K.tinta }, g);
    var f = function (x1, y1, x2, y2) {
      var len = Math.hypot(x2 - x1, y2 - y1);
      g.setAttribute('opacity', len < 1 ? 0 : (o.op == null ? 1 : o.op));
      var ang = Math.atan2(y2 - y1, x2 - x1), L = Math.min(o.punta || 10, len * 0.6);
      var xb = x2 - L * Math.cos(ang), yb = y2 - L * Math.sin(ang);
      l.setAttribute('x1', x1); l.setAttribute('y1', y1); l.setAttribute('x2', xb); l.setAttribute('y2', yb);
      var a1 = [xb + L * 0.45 * Math.sin(ang), yb - L * 0.45 * Math.cos(ang)], a2 = [xb - L * 0.45 * Math.sin(ang), yb + L * 0.45 * Math.cos(ang)];
      p.setAttribute('d', 'M' + x2 + ' ' + y2 + 'L' + a1.join(' ') + 'L' + a2.join(' ') + 'Z');
    };
    f.g = g;
    return f;
  };
  // Manómetro de carátula: devuelve { g, poner(valor) }.
  D.manometro = function (padre, cx, cy, r, max, o) {
    o = o || {};
    var g = s('g', {}, padre);
    s('circle', { cx: cx, cy: cy, r: r + 3, fill: K.metalM, stroke: K.tinta, 'stroke-width': 1.5 }, g);
    s('circle', { cx: cx, cy: cy, r: r, fill: K.blanco, stroke: K.tinta, 'stroke-width': 1 }, g);
    var a0 = 225 * Math.PI / 180, a1 = -45 * Math.PI / 180;
    var paso = o.paso || max / 5;
    for (var v = 0; v <= max + 1e-9; v += paso / 2) {
      var f = v / max, a = a0 + (a1 - a0) * f, larga = Math.abs(v / paso - Math.round(v / paso)) < 1e-6;
      s('line', { x1: cx + (r - (larga ? 7 : 4)) * Math.cos(a), y1: cy - (r - (larga ? 7 : 4)) * Math.sin(a), x2: cx + (r - 1) * Math.cos(a), y2: cy - (r - 1) * Math.sin(a), stroke: K.tinta, 'stroke-width': larga ? 1.4 : 0.8 }, g);
    }
    var aguja = s('line', { x1: cx, y1: cy, x2: cx, y2: cy - r + 9, stroke: K.alerta, 'stroke-width': 2, 'stroke-linecap': 'round' }, g);
    s('circle', { cx: cx, cy: cy, r: 2.6, fill: K.tinta }, g);
    var lect = o.lectura === false ? null : D.t(g, cx, cy + r + 18, '', { tam: 13, peso: 650, ancla: 'middle' });
    return {
      g: g,
      poner: function (val, texto) {
        var f = Math.max(0, Math.min(1, val / max)), a = a0 + (a1 - a0) * f;
        aguja.setAttribute('x2', cx + (r - 9) * Math.cos(a)); aguja.setAttribute('y2', cy - (r - 9) * Math.sin(a));
        if (lect) D.ponerTexto(lect, texto != null ? texto : ZB.num(val, 0) + ' kPa');
      }
    };
  };
  // Ejes de gráfica. o: { x, y, w, h, xmin, xmax, ymin, ymax, xt, yt, xr, yr (rótulos), dx, dy (decimales) }
  D.ejes = function (padre, o) {
    var g = s('g', {}, padre);
    var X = function (v) { return o.x + (v - o.xmin) / (o.xmax - o.xmin) * o.w; };
    var Y = function (v) { return o.y + o.h - (v - o.ymin) / (o.ymax - o.ymin) * o.h; };
    (o.yt || []).forEach(function (v) {
      s('line', { x1: o.x, x2: o.x + o.w, y1: Y(v), y2: Y(v), stroke: K.rejilla, 'stroke-width': 1 }, g);
      D.t(g, o.x - 6, Y(v) + 4, ZB.num(v, o.dy || 0), { tam: 12, ancla: 'end', color: K.tinta2 });
    });
    (o.xt || []).forEach(function (v) {
      s('line', { x1: X(v), x2: X(v), y1: o.y, y2: o.y + o.h, stroke: K.rejilla, 'stroke-width': 1 }, g);
      D.t(g, X(v), o.y + o.h + 16, ZB.num(v, o.dx || 0), { tam: 12, ancla: 'middle', color: K.tinta2 });
    });
    s('path', { d: 'M' + o.x + ' ' + o.y + 'V' + (o.y + o.h) + 'H' + (o.x + o.w), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, g);
    if (o.xr) D.t(g, o.x + o.w, o.y + o.h + 34, o.xr, { tam: 13, peso: 600, ancla: 'end' });
    if (o.yr) D.t(g, o.x - 2, o.y - 10, o.yr, { tam: 13, peso: 600, ancla: 'start' });
    return { g: g, X: X, Y: Y };
  };
  D.camino = function (pts, X, Y) {
    return pts.map(function (p, i) { return (i ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1); }).join('');
  };
  // Un trazo que se dibuja de 0 a 1.
  D.trazo = function (padre, d, o) {
    o = o || {};
    var p = s('path', { d: d, fill: 'none', stroke: o.color || K.tinta, 'stroke-width': o.ancho || 2.4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, padre);
    if (o.guion) p.setAttribute('stroke-dasharray', o.guion);
    var L = null;
    p.dibujar = function (t) {
      if (o.guion) { p.setAttribute('opacity', t > 0 ? Math.min(1, t * 3) : 0); return; }
      if (L == null) { try { L = p.getTotalLength(); } catch (e) { L = 1000; } }
      p.setAttribute('stroke-dasharray', L + ' ' + L);
      p.setAttribute('stroke-dashoffset', L * (1 - t));
      p.setAttribute('opacity', t > 0 ? 1 : 0);
    };
    p.dibujar(0);
    return p;
  };
  D.ver = function (el, t) { el.setAttribute('opacity', Math.max(0, Math.min(1, t))); };
  D.punto = function (padre, x, y, o) {
    o = o || {};
    return s('circle', { cx: x, cy: y, r: o.r || 6, fill: o.color || K.caso, stroke: o.borde || K.tinta, 'stroke-width': 1.6 }, padre);
  };

  // La carta del modelo (CARTA_BOMBA): H, η, P y NPSH3 de un impulsor a un caudal, por interpolación.
  var CB = window.CARTA_BOMBA;
  D.carta = function (d, q, i) {
    var pts = CB.D[d].pts, x = q / CB.paso, k = Math.floor(x);
    if (k < 0) return pts[0][i];
    if (k >= pts.length - 1) return pts[pts.length - 1][i];
    return pts[k][i] + (pts[k + 1][i] - pts[k][i]) * (x - k);
  };
  D.cartaFin = function (d) { return 1.3 * CB.D[d].qB; };
  D.cartaPts = function (d, i, qmax) {
    var out = [], fin = qmax || D.cartaFin(d);
    for (var q = 0; q <= fin + 1e-9; q += 0.5) out.push([q, D.carta(d, q, i)]);
    return out;
  };
})();
