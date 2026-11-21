/* Las animaciones por pasos de las lecturas de 2027-10 que el libro todavía no tiene. Corren con el motor del
   libro (/classroom/estilo-libro/actividades/, ver su README) y usan las piezas de assets/actividades-curso.js
   (ZB.curso), que se carga antes. Cada una cuenta lo que contaba el video que reemplaza, con los números de su
   lectura, y cada número sale del modelo de este archivo, nunca escrito a mano:
   «ajuste-rr», el ajuste de Rosin-Rammler a los siete puntos de la Tabla 3 de la Lectura 3 (mínimos cuadrados
   sobre ln ln(1/R) contra ln d); «rendimiento-arrastre», el modelo de dos etapas del ejemplo de la Lectura 4
   (Y∞ = 0,85 %, f = 0,60, k1 = 0,15 1/min, k2 = 0,020 1/min, t0 = 22 min, 30 kg de carga y 12 kg/h de vapor),
   con el equilibrio del limoneno a 101,3 kPa de ZB.curso; y «condensacion-inmiscibles», la curva de
   condensación en equilibrio de un vapor de agua con 0,05 kg de tolueno por kg de agua a 1 atm, con las
   ecuaciones de Antoine de la Lectura 10. Los colores salen de la paleta del libro (ZB.dib.col). Cuando se
   escriba el capítulo de cada una, la animación pasa al libro. */
(function () {
  'use strict';
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, T = ZB.tramo, L = ZB.lerp, C = ZB.curso;

  function grupo(padre, op) { return s('g', { opacity: op == null ? 0 : op }, padre); }
  function linea(padre, x1, y1, x2, y2, o) {
    o = o || {};
    return s('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: o.color || K.tinta2, 'stroke-width': o.ancho || 1.6, 'stroke-dasharray': o.guion || 'none' }, padre);
  }
  function camino(pts) { return pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(''); }

  /* ================= Lectura 3, sección 6.4: el ajuste de Rosin-Rammler ================= */

  var RR = (function () {
    var d = [1.18, 0.85, 0.60, 0.425, 0.30, 0.212, 0.150];
    var X = [95, 83, 65, 43, 25, 12, 5].map(function (v) { return v / 100; });
    var lx = d.map(Math.log), ly = X.map(function (x) { return Math.log(Math.log(1 / (1 - x))); });
    var k = d.length, sx = 0, sy = 0, sxx = 0, sxy = 0;
    for (var i = 0; i < k; i++) { sx += lx[i]; sy += ly[i]; sxx += lx[i] * lx[i]; sxy += lx[i] * ly[i]; }
    var m = (k * sxy - sx * sy) / (k * sxx - sx * sx), b = (sy - m * sx) / k;
    var d63 = Math.exp(-b / m);
    var modelo = function (dd) { return 1 - Math.exp(-Math.pow(dd / d63, m)); };
    var media = X.reduce(function (a, x) { return a + x; }, 0) / k;
    var r2 = 1 - X.reduce(function (a, x, j) { return a + Math.pow(x - modelo(d[j]), 2); }, 0) / X.reduce(function (a, x) { return a + Math.pow(x - media, 2); }, 0);
    // la interpolación lineal entre las dos mallas que encierran el 80 %
    var j = 0; while (X[j + 1] > 0.8) j++;
    var interp = d[j] - (X[j] - 0.8) / (X[j] - X[j + 1]) * (d[j] - d[j + 1]);
    return { d: d, X: X, ly: ly, n: m, b: b, d63: d63, ld63: -b / m, d80: d63 * Math.pow(Math.log(5), 1 / m), r2: r2, interp: interp, modelo: modelo, mallas: [d[j], d[j + 1]] };
  })();

  ZB.animacion('ajuste-rr', {
    vista: [0, 0, 640, 386],
    alt: 'Los siete puntos de la Tabla 3 en la curva acumulada que pasa, sobre un eje de tamaños logarítmico. Arriba aparece el modelo de Rosin-Rammler, X = 1 − exp[−(d/d63)^n]. Con R = 1 − X, los puntos pasan al eje de ln ln(1/R) y quedan casi en línea recta; la recta de mínimos cuadrados tiene pendiente n = ' + n(RR.n, 2) + ' y cruza el cero en ln d63 = ' + n(RR.ld63, 2) + ', es decir, d63 = ' + n(RR.d63, 2) + ' mm. De vuelta en la curva, el modelo pasa cerca de los puntos, con R² = ' + n(RR.r2, 3) + ', y da d80 = ' + n(RR.d80, 2) + ' mm, contra ' + n(RR.interp, 2) + ' mm por interpolación.',
    montar: function (svg) {
      var S = {}, x0 = 78, w = 520, y0 = 100, h = 220, base = y0 + h, DMIN = 0.12, DMAX = 1.6, VMIN = -3.4, VMAX = 1.6;
      var X = function (d) { return x0 + Math.log(d / DMIN) / Math.log(DMAX / DMIN) * w; };
      S.yA = function (q) { return base - q * h; };
      S.yB = function (v) { return base - (v - VMIN) / (VMAX - VMIN) * h; };
      // rejilla y números de cada vista: la curva (mm y %) y la forma lineal (ln d y ln ln(1/R))
      S.ticA = grupo(svg, 1); S.ticB = grupo(svg, 0);
      [[0.15, '0,15'], [0.3, '0,3'], [0.6, '0,6'], [1.2, '1,2']].forEach(function (p) {
        linea(S.ticA, X(p[0]), y0, X(p[0]), base, { color: K.rejilla, ancho: 1 });
        D.t(S.ticA, X(p[0]), base + 17, p[1], { tam: 12, ancla: 'middle', color: K.tinta2 });
      });
      [0, 0.2, 0.4, 0.6, 0.8, 1].forEach(function (q) {
        linea(S.ticA, x0, S.yA(q), x0 + w, S.yA(q), { color: K.rejilla, ancho: 1 });
        D.t(S.ticA, x0 - 6, S.yA(q) + 4, n(100 * q, 0), { tam: 12, ancla: 'end', color: K.tinta2 });
      });
      D.t(S.ticA, x0 + w, base + 36, 'd (mm), escala logarítmica', { tam: 12.5, peso: 600, ancla: 'end' });
      D.t(S.ticA, x0 - 4, y0 - 12, 'X, pasa (%)', { tam: 12.5, peso: 600 });
      [-2, -1.5, -1, -0.5, 0].forEach(function (v) {
        linea(S.ticB, X(Math.exp(v)), y0, X(Math.exp(v)), base, { color: K.rejilla, ancho: 1 });
        D.t(S.ticB, X(Math.exp(v)), base + 17, n(v, 1), { tam: 12, ancla: 'middle', color: K.tinta2 });
      });
      [-3, -2, -1, 0, 1].forEach(function (v) {
        linea(S.ticB, x0, S.yB(v), x0 + w, S.yB(v), { color: K.rejilla, ancho: 1 });
        D.t(S.ticB, x0 - 6, S.yB(v) + 4, n(v, 0), { tam: 12, ancla: 'end', color: K.tinta2 });
      });
      D.t(S.ticB, x0 + w, base + 36, 'ln d', { tam: 12.5, peso: 600, ancla: 'end' });
      D.t(S.ticB, x0 - 4, y0 - 12, 'ln ln(1/R)', { tam: 12.5, peso: 600 });
      s('path', { d: 'M' + x0 + ' ' + y0 + 'V' + base + 'H' + (x0 + w), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      // el 63,2 % en la curva
      S.l63 = grupo(svg);
      linea(S.l63, x0, S.yA(0.632), x0 + w, S.yA(0.632), { color: K.olivaOsc, guion: '6 4' });
      D.t(S.l63, x0 + w - 4, S.yA(0.632) - 7, 'X = 63,2 % en d = d_{63}', { tam: 12.5, peso: 650, ancla: 'end', color: K.olivaOsc, halo: true });
      // el cero de la forma lineal y el d63 que da la recta
      S.cero = grupo(svg);
      linea(S.cero, x0, S.yB(0), x0 + w, S.yB(0), { color: K.tinta2, guion: '6 4' });
      S.xp = grupo(svg);
      linea(S.xp, X(RR.d63), S.yB(0), X(RR.d63), base, { color: K.olivaOsc, guion: '5 4' });
      D.punto(S.xp, X(RR.d63), S.yB(0), { r: 5, color: K.olivaOsc, borde: K.olivaOsc });
      D.t(S.xp, X(RR.d63) + 8, base - 8, 'ln d_{63} = ' + n(RR.ld63, 2), { tam: 12.5, peso: 700, color: K.olivaOsc, halo: true });
      // la recta y el modelo
      var va = RR.n * Math.log(DMIN) + RR.b, vb = RR.n * Math.log(DMAX) + RR.b;
      var xa = va < VMIN ? Math.exp((VMIN - RR.b) / RR.n) : DMIN, xb = vb > VMAX ? Math.exp((VMAX - RR.b) / RR.n) : DMAX;
      S.recta = D.trazo(svg, 'M' + X(xa).toFixed(1) + ' ' + S.yB(RR.n * Math.log(xa) + RR.b).toFixed(1) + 'L' + X(xb).toFixed(1) + ' ' + S.yB(RR.n * Math.log(xb) + RR.b).toFixed(1), { color: K.oliva, ancho: 2.4 });
      var pm = [];
      for (var k = 0; k <= 80; k++) { var dd = DMIN * Math.pow(DMAX / DMIN, k / 80); pm.push([X(dd), S.yA(RR.modelo(dd))]); }
      S.modelo = D.trazo(svg, camino(pm), { color: K.oliva, ancho: 2.4 });
      // las lecturas del modelo: d63 y d80
      S.lect = grupo(svg);
      [[0.632, RR.d63, 'd_{63} = ' + n(RR.d63, 2)], [0.8, RR.d80, 'd_{80} = ' + n(RR.d80, 2)]].forEach(function (p, i) {
        var xx = X(p[1]), yy = S.yA(p[0]);
        s('path', { d: 'M' + x0 + ' ' + yy + 'H' + xx + 'V' + base, fill: 'none', stroke: K.tinta, 'stroke-width': 1.5, 'stroke-dasharray': '5 4' }, S.lect);
        D.punto(S.lect, xx, yy, { r: 4.5, color: K.tinta, borde: K.tinta });
        D.t(S.lect, x0 + 8, yy - 7, p[2] + ' mm', { tam: 12.5, peso: 700, halo: true });
      });
      // los siete puntos
      S.p = RR.d.map(function (dd, i) {
        var c = D.punto(svg, X(dd), S.yA(RR.X[i]), { r: 5.5 });
        c.setAttribute('opacity', 0);
        return c;
      });
      S.estado = function (u) {
        S.p.forEach(function (c, i) { c.setAttribute('cy', L(S.yA(RR.X[i]), S.yB(RR.ly[i]), u)); });
        D.ver(S.ticA, 1 - u); D.ver(S.ticB, u);
      };
      // la franja de arriba: la ecuación de cada paso, una a la vez
      var FR = [
        ['Siete mallas de la Tabla 3', 'cada punto: la abertura y el porcentaje de la masa que pasa por ella'],
        ['X = 1 − exp[−(d/d_{63})^n]', 'd_{63}: el tamaño por el que pasa el 63,2 %.   n: entre mayor, más angosta la curva.'],
        ['ln ln(1/R) = n ln d − n ln d_{63}', 'con R = 1 − X, la fracción que queda retenida'],
        ['n = ' + n(RR.n, 2) + '   ·   ln d_{63} = ' + n(RR.ld63, 2) + '   ·   d_{63} = e^{' + n(RR.ld63, 2) + '} = ' + n(RR.d63, 2) + ' mm', 'la pendiente de la recta y su cruce con el cero'],
        ['R^2 = ' + n(RR.r2, 3), 'el modelo contra los siete puntos, en la curva'],
        ['d_{80} = d_{63} (ln 5)^{1/n} = ' + n(RR.d80, 2) + ' mm', 'interpolando entre las mallas de ' + n(RR.mallas[0], 2) + ' y ' + n(RR.mallas[1], 2) + ' mm: ' + n(RR.interp, 2) + ' mm']
      ];
      S.fr = FR.map(function (f) {
        var g = grupo(svg);
        D.t(g, 16, 30, f[0], { tam: 15, peso: 650 });
        D.t(g, 16, 54, f[1], { tam: 12.5, color: K.tinta2 });
        return g;
      });
      S.franja = function (k, u) { S.fr.forEach(function (g, i) { D.ver(g, i === k ? u : i === k - 1 ? 1 - u : 0); }); };
      S.estado(0);
      return S;
    },
    pasos: [
      { texto: 'Un tamizado da siete puntos, no una curva. Cada uno es una malla de la Tabla 3 y el porcentaje de la masa que pasa por su abertura, sobre un eje de tamaños logarítmico.', dur: 1.6, ir: function (S, t) {
        S.franja(0, T(t, 0, 0.3));
        S.p.forEach(function (c, i) { D.ver(c, T(t, 0.1 + 0.08 * i, 0.4 + 0.08 * i)); });
      } },
      { texto: 'El modelo de Rosin-Rammler tiene dos parámetros. $d_{63}$ es el tamaño por el que pasa el 63,2 %, porque con $d = d_{63}$ la retenida vale $e^{-1} = 0,368$; $n$ dice qué tan angosta es la curva. ¿Cómo se sacan de siete puntos?', dur: 1.6, ir: function (S, t) {
        S.franja(1, T(t, 0, 0.5)); D.ver(S.l63, T(t, 0.4, 1));
      } },
      { texto: 'Con $R = 1 - X$, dos logaritmos vuelven el modelo una recta: $\\ln\\ln(1/R) = n\\ln d - n\\ln d_{63}$. El eje de tamaños ya era logarítmico, así que cada punto solo cambia de altura, y los siete quedan casi en línea.', dur: 2.4, ir: function (S, t) {
        S.franja(2, T(t, 0, 0.3)); D.ver(S.l63, 1 - T(t, 0, 0.2));
        S.estado(T(t, 0.1, 0.85)); D.ver(S.cero, T(t, 0.8, 1));
      } },
      { texto: 'La recta de mínimos cuadrados tiene pendiente $n$ = ' + n(RR.n, 2) + '. Cruza el cero donde $R = 1/e$, es decir, en $d = d_{63}$: $\\ln d_{63}$ = ' + n(RR.ld63, 2) + ' y $d_{63} = e^{' + n(RR.ld63, 2) + '}$ = ' + n(RR.d63, 2) + ' mm.', dur: 2, ir: function (S, t) {
        S.franja(3, T(t, 0, 0.3)); S.recta.dibujar(T(t, 0.1, 0.6)); D.ver(S.xp, T(t, 0.6, 1));
      } },
      { texto: 'De vuelta en la curva acumulada, el modelo con $n$ = ' + n(RR.n, 2) + ' y $d_{63}$ = ' + n(RR.d63, 2) + ' mm pasa cerca de los siete puntos, con $R^2$ = ' + n(RR.r2, 3) + '.', dur: 2.2, ir: function (S, t) {
        var u = 1 - T(t, 0, 0.45);
        S.franja(4, T(t, 0.6, 1));
        S.estado(u); S.recta.setAttribute('opacity', u); D.ver(S.xp, u); D.ver(S.cero, u);
        S.modelo.dibujar(T(t, 0.45, 0.9));
      } },
      { texto: 'Con el modelo, el $d_{80}$ sale de despejar $X = 0,8$: $d_{80} = d_{63}\\,(\\ln 5)^{1/n}$ = ' + n(RR.d80, 2) + ' mm. Interpolando entre las mallas de ' + n(RR.mallas[0], 2) + ' y ' + n(RR.mallas[1], 2) + ' mm daba ' + n(RR.interp, 2) + ' mm.', dur: 1.8, ir: function (S, t) {
        S.franja(5, T(t, 0, 0.4)); D.ver(S.lect, T(t, 0.3, 1));
      } }
    ]
  });

  /* ================= Lectura 4, sección 4: el rendimiento de un lote ================= */

  var RA = (function () {
    var p = { yinf: 0.85, f: 0.60, k1: 0.15, k2: 0.020, t0: 22, carga: 30, vapor: 12, P: 101.325 };
    var tau = function (t) { return Math.max(0, t - p.t0); };
    p.lav = function (t) { return p.yinf * p.f * (1 - Math.exp(-p.k1 * tau(t))); };              // % de la carga
    p.dif = function (t) { return p.yinf * (1 - p.f) * (1 - Math.exp(-p.k2 * tau(t))); };
    p.Y = function (t) { return p.lav(t) + p.dif(t); };
    p.gkg = function (pct) { return 10 * pct; };                                                    // g de aceite por kg de carga
    // aceite por kilo de vapor en el instante t (marginal) y en promedio desde que se abre el vapor
    p.r = function (t) {
      if (t < p.t0) return 0;
      var dy = p.yinf * (p.f * p.k1 * Math.exp(-p.k1 * tau(t)) + (1 - p.f) * p.k2 * Math.exp(-p.k2 * tau(t)));   // %/min
      return dy / 100 * p.carga * 1000 / (p.vapor / 60);
    };
    p.rm = function (t) { return t <= 0 ? 0 : p.Y(t) / 100 * p.carga * 1000 / (p.vapor * t / 60); };
    return p;
  })();
  // el equilibrio del limoneno a la presión del ejemplo, con las curvas del capítulo 1 del libro
  function relEquilibrio(P) {
    var t = C.raiz(function (x) { return C.pAgua(x) + C.pLimoneno(x) - P; }, 30, 130);
    return C.pLimoneno(t) * 136.24 / (C.pAgua(t) * 18.02);
  }
  var EQ = 1000 * relEquilibrio(RA.P);

  ZB.animacion('rendimiento-arrastre', {
    vista: [0, 0, 640, 424],
    alt: 'Arriba, el aceite acumulado contra el tiempo en el ensayo piloto del ejemplo: nada durante los primeros ' + n(RA.t0, 0) + ' min, mientras el lecho se calienta; después una curva de lavado que sube rápido, una de difusión que sube despacio y su suma, que se acerca a ' + n(RA.gkg(RA.yinf), 1) + ' g por kg de carga. Abajo, en escala logarítmica, el aceite que lleva cada kilo de vapor: unos ' + n(RA.r(RA.t0), 0) + ' g/kg con la primera gota y ' + n(RA.r(90), 1) + ' g/kg a los 90 min, con un promedio del lote de ' + n(RA.rm(90), 1) + ' g/kg, frente a ' + n(EQ, 0) + ' g/kg del equilibrio del limoneno.',
    montar: function (svg) {
      var S = {}, x0 = 78, w = 520, y1 = 44, h1 = 150, b1 = y1 + h1, y2 = 262, h2 = 112, b2 = y2 + h2;
      var X = function (t) { return x0 + t / 180 * w; };
      var Y1 = function (g) { return b1 - g / 10 * h1; };
      var Y2 = function (r) { return b2 - (Math.log10(Math.max(0.1, r)) + 1) / 4 * h2; };
      // la gráfica de arriba: el aceite acumulado
      [0, 2, 4, 6, 8, 10].forEach(function (g) {
        linea(svg, x0, Y1(g), x0 + w, Y1(g), { color: K.rejilla, ancho: 1 });
        D.t(svg, x0 - 6, Y1(g) + 4, n(g, 0), { tam: 12, ancla: 'end', color: K.tinta2 });
      });
      [0, 30, 60, 90, 120, 150, 180].forEach(function (t) {
        D.t(svg, X(t), b1 + 16, n(t, 0), { tam: 12, ancla: 'middle', color: K.tinta2 });
      });
      s('path', { d: 'M' + x0 + ' ' + y1 + 'V' + b1 + 'H' + (x0 + w), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      D.t(svg, x0 - 4, y1 - 14, 'Aceite (g por kg de carga)', { tam: 12.5, peso: 600 });
      D.t(svg, x0 + w, b1 + 33, 't, desde que se abre el vapor (min)', { tam: 12.5, peso: 600, ancla: 'end' });
      // el calentamiento y la primera gota
      S.banda = grupo(svg);
      s('rect', { x: X(0), y: y1, width: X(RA.t0) - X(0), height: h1, fill: K.amarilloClaro }, S.banda);
      D.t(S.banda, X(RA.t0) / 2 + x0 / 2, y1 + 18, 'se calienta', { tam: 12, peso: 600, ancla: 'middle', color: K.tinta2 });
      D.punto(S.banda, X(RA.t0), b1, { r: 5.5 });
      D.flecha(S.banda, X(48), Y1(3.6), X(RA.t0) + 6, b1 - 6, { color: K.tinta2, ancho: 1.6, punta: 7 });
      D.t(S.banda, X(48) + 4, Y1(3.6) - 2, 'primera gota, ' + n(RA.t0, 0) + ' min', { tam: 12, color: K.tinta2, halo: true });
      // las curvas del modelo
      function curva(f, a, b, esc) { var pts = []; for (var t = a; t <= b + 1e-9; t += 0.5) pts.push([X(t), esc(f(t))]); return camino(pts); }
      S.lav = D.trazo(svg, curva(function (t) { return RA.gkg(RA.lav(t)); }, RA.t0, 180, Y1), { color: K.azul, ancho: 2.4 });
      S.tLav = D.t(svg, X(150), Y1(RA.gkg(RA.lav(150))) - 8, 'lavado', { tam: 12.5, peso: 700, color: K.azul, halo: true }); S.tLav.setAttribute('opacity', 0);
      S.dif = D.trazo(svg, curva(function (t) { return RA.gkg(RA.dif(t)); }, RA.t0, 180, Y1), { color: K.naranja, ancho: 2.4, guion: '7 5' });
      S.tDif = D.t(svg, X(150), Y1(RA.gkg(RA.dif(150))) + 18, 'difusión', { tam: 12.5, peso: 700, color: K.naranja, halo: true }); S.tDif.setAttribute('opacity', 0);
      S.asin = grupo(svg);
      linea(S.asin, x0, Y1(RA.gkg(RA.yinf)), x0 + w, Y1(RA.gkg(RA.yinf)), { color: K.ref, guion: '6 4' });
      D.t(S.asin, x0 + w - 4, Y1(RA.gkg(RA.yinf)) - 7, 'Y_∞ = ' + n(RA.gkg(RA.yinf), 1) + ' g/kg', { tam: 12, peso: 600, ancla: 'end', color: K.tinta2, halo: true });
      S.tot = D.trazo(svg, curva(function (t) { return RA.gkg(RA.Y(t)); }, RA.t0, 180, Y1), { color: K.tinta, ancho: 3 });
      S.tTot = D.t(svg, X(108), Y1(RA.gkg(RA.Y(108))) - 10, 'total', { tam: 12.5, peso: 700, halo: true }); S.tTot.setAttribute('opacity', 0);
      // la gráfica de abajo: el aceite por kilo de vapor, en escala logarítmica
      S.abajo = grupo(svg);
      [[0.1, '0,1'], [1, '1'], [10, '10'], [100, '100'], [1000, '1000']].forEach(function (p) {
        linea(S.abajo, x0, Y2(p[0]), x0 + w, Y2(p[0]), { color: K.rejilla, ancho: 1 });
        D.t(S.abajo, x0 - 6, Y2(p[0]) + 4, p[1], { tam: 12, ancla: 'end', color: K.tinta2 });
      });
      [0, 30, 60, 90, 120, 150, 180].forEach(function (t) { D.t(S.abajo, X(t), b2 + 16, n(t, 0), { tam: 12, ancla: 'middle', color: K.tinta2 }); });
      s('path', { d: 'M' + x0 + ' ' + y2 + 'V' + b2 + 'H' + (x0 + w), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, S.abajo);
      D.t(S.abajo, x0 - 4, y2 - 14, 'Aceite por kilo de vapor (g/kg), escala logarítmica', { tam: 12.5, peso: 600 });
      D.t(S.abajo, x0 + w, b2 + 33, 't (min)', { tam: 12.5, peso: 600, ancla: 'end' });
      S.r = D.trazo(svg, curva(RA.r, RA.t0, 180, Y2), { color: K.tinta, ancho: 2.4 });
      S.tR = D.t(svg, X(132), Y2(RA.r(132)) - 9, 'en cada instante', { tam: 12, peso: 650, ancla: 'middle', halo: true }); S.tR.setAttribute('opacity', 0);
      S.rm = D.trazo(svg, curva(RA.rm, RA.t0 + 1, 180, Y2), { color: K.oliva, ancho: 2.4 });
      S.tRm = D.t(svg, X(150), Y2(RA.rm(150)) - 9, 'promedio del lote', { tam: 12, peso: 650, color: K.olivaOsc, halo: true }); S.tRm.setAttribute('opacity', 0);
      S.p90 = grupo(svg);
      linea(S.p90, X(90), Y2(RA.rm(90)), X(90), b2, { color: K.olivaOsc, guion: '4 3', ancho: 1.4 });
      D.punto(S.p90, X(90), Y2(RA.rm(90)), { r: 5 });
      D.t(S.p90, X(90) + 8, Y2(RA.rm(90)) - 8, n(RA.rm(90), 1) + ' g/kg', { tam: 12.5, peso: 700, halo: true });
      S.eq = grupo(svg);
      linea(S.eq, x0, Y2(EQ), x0 + w, Y2(EQ), { color: K.azul, ancho: 2, guion: '7 4' });
      D.t(S.eq, x0 + w - 4, Y2(EQ) - 7, 'equilibrio del limoneno: ' + n(EQ, 0) + ' g/kg', { tam: 12.5, peso: 700, ancla: 'end', color: K.azul, halo: true });
      S.brecha = grupo(svg);
      D.flecha(S.brecha, X(90) - 14, Y2(RA.rm(90)) - 6, X(90) - 14, Y2(EQ) + 6, { color: K.azul, ancho: 1.8, punta: 8 });
      D.flecha(S.brecha, X(90) - 14, Y2(EQ) + 6, X(90) - 14, Y2(RA.rm(90)) - 6, { color: K.azul, ancho: 1.8, punta: 8 });
      D.t(S.brecha, X(90) - 22, (Y2(EQ) + Y2(RA.rm(90))) / 2 + 4, n(EQ / RA.rm(90), 0) + ' veces', { tam: 12.5, peso: 700, ancla: 'end', color: K.azul, halo: true });
      return S;
    },
    pasos: [
      { texto: 'Primero el lecho se calienta. El vapor condensa sobre la carga fría y la lleva a la temperatura de ebullición, y hasta que el frente llega arriba, a los ' + n(RA.t0, 0) + ' min, no sale aceite.', dur: 1.6, ir: function (S, t) { D.ver(S.banda, T(t, 0, 0.6)); } },
      { texto: 'Después sale rápido el aceite que está a la mano, el de las glándulas que el picado y el calor ya rompieron. Es el lavado, $Y_{\\mathrm{lav}} = Y_\\infty f\\,(1 - e^{-k_1\\tau})$, con $f$ = ' + n(RA.f, 2) + ' del total y $k_1$ = ' + n(RA.k1, 2) + ' min⁻¹.', dur: 2, ir: function (S, t) { S.lav.dibujar(T(t, 0, 0.8)); D.ver(S.tLav, T(t, 0.6, 1)); } },
      { texto: 'Despacio sale el que tiene que difundir desde el tejido intacto, con $k_2$ = ' + n(RA.k2, 3) + ' min⁻¹, ' + n(RA.k1 / RA.k2, 1) + ' veces más lento. La suma, $Y = Y_\\infty[1 - f e^{-k_1\\tau} - (1-f)\\,e^{-k_2\\tau}]$ con $\\tau = t - t_0$, se acerca a $Y_\\infty$ = ' + n(RA.gkg(RA.yinf), 1) + ' g por kg de carga.', dur: 2.4, ir: function (S, t) {
        S.dif.dibujar(T(t, 0, 0.5)); D.ver(S.tDif, T(t, 0.35, 0.6)); S.tot.dibujar(T(t, 0.4, 0.95)); D.ver(S.asin, T(t, 0.7, 1)); D.ver(S.tTot, T(t, 0.8, 1));
      } },
      { texto: 'Cada kilo de vapor lleva cada vez menos aceite: unos ' + n(RA.r(RA.t0), 0) + ' g con la primera gota y ' + n(RA.r(90), 1) + ' g a los 90 min. Promediado desde que se abre el vapor, el lote de 90 min saca ' + n(RA.rm(90), 1) + ' g de aceite por kilo de vapor.', dur: 2.4, ir: function (S, t) {
        D.ver(S.abajo, T(t, 0, 0.25)); S.r.dibujar(T(t, 0.15, 0.6)); D.ver(S.tR, T(t, 0.45, 0.65)); S.rm.dibujar(T(t, 0.5, 0.9)); D.ver(S.tRm, T(t, 0.75, 0.95)); D.ver(S.p90, T(t, 0.85, 1));
      } },
      { texto: 'Un monoterpeno como el limoneno daría en equilibrio, a ' + n(RA.P, 1) + ' kPa, ' + n(EQ, 0) + ' g por kilo de vapor: el lote trabaja unas ' + n(EQ / RA.rm(90), 0) + ' veces por debajo. Esa brecha no la explica el equilibrio sino la hidrodifusión, y por eso el extractor se dimensiona con un ensayo.', dur: 1.8, ir: function (S, t) { D.ver(S.eq, T(t, 0, 0.5)); D.ver(S.brecha, T(t, 0.5, 1)); } }
    ]
  });

  /* ================= Lectura 10, sección 12: condensación de agua con tolueno ================= */

  var CI = (function () {
    var P = 760, MW = 18.015, MT = 92.14, R = 0.05;                 // mmHg; kg de tolueno por kg de agua
    var CLW = 4.19, CLT = 1.75, CVW = 2.0, CVT = 1.5, LT = 370, TS = 35;   // kJ/(kg K), kJ/kg, °C
    var pw = function (t) { return Math.pow(10, 8.07131 - 1730.63 / (233.426 + t)); };   // Antoine, mmHg y °C
    var pt = function (t) { return Math.pow(10, 6.95464 - 1344.8 / (219.482 + t)); };
    var tsw = function (p) { return 1730.63 / (8.07131 - Math.log10(p)) - 233.426; };
    var lw = function (t) { return 2501 - 2.37 * t; };                // kJ/kg, tablas de vapor, aproximación lineal
    var taz = C.raiz(function (t) { return pw(t) + pt(t) - P; }, 60, 100), yaz = pt(taz) / P;
    var NW = 1 / MW, NT = R / MT, faz = 1 - (NT / yaz - NT) / NW;      // fracción del agua condensada al llegar a la meseta
    var pts = [], q = 0, prev = null, N = 600;
    for (var i = 0; i <= N; i++) {
      var f = faz * (1 - Math.pow(1 - i / N, 2)), y = NT / (NT + NW * (1 - f)), t = tsw((1 - y) * P);
      if (prev) q += (f - prev[0]) * lw((t + prev[1]) / 2) + (f * CLW + (1 - f) * CVW + R * CVT) * (prev[1] - t);
      pts.push({ q: q, t: t, f: f, y: y }); prev = [f, t];
    }
    var q1 = pts[N].q, q2 = q1 + (1 - faz) * lw(taz) + R * LT, q3 = q2 + (CLW + R * CLT) * (taz - TS);
    var en = function (fr) { var y = NT / (NT + NW * (1 - fr)); return tsw((1 - y) * P); };
    return { P: P, R: R, TS: TS, LT: LT, pw: pw, pt: pt, taz: taz, faz: faz, pts: pts, q1: q1, q2: q2, q3: q3, en: en };
  })();

  ZB.animacion('condensacion-inmiscibles', {
    vista: [0, 0, 640, 352],
    alt: 'La curva de condensación de un vapor de agua con ' + n(CI.R, 2) + ' kg de tolueno por kg de agua, a 1 atm: la temperatura contra el calor retirado por kilogramo de agua. El agua condensa sola desde ' + n(CI.pts[0].t, 1) + ' °C y la temperatura baja a medida que el vapor se enriquece en tolueno; a ' + n(CI.taz, 1) + ' °C condensan los dos juntos, a temperatura constante, y después las dos fases líquidas se subenfrían hasta ' + n(CI.TS, 0) + ' °C. En total, ' + n(CI.q3, 0) + ' kJ por kg de agua.',
    montar: function (svg) {
      var S = {}, x0 = 78, w = 520, y0 = 36, h = 262, base = y0 + h;
      var X = function (q) { return x0 + q / 2800 * w; }, Y = function (t) { return base - (t - 30) / 80 * h; };
      [30, 50, 70, 90, 110].forEach(function (t) {
        linea(svg, x0, Y(t), x0 + w, Y(t), { color: K.rejilla, ancho: 1 });
        D.t(svg, x0 - 6, Y(t) + 4, n(t, 0), { tam: 12, ancla: 'end', color: K.tinta2 });
      });
      [0, 800, 1600, 2400].forEach(function (q) {
        linea(svg, X(q), y0, X(q), base, { color: K.rejilla, ancho: 1 });
        D.t(svg, X(q), base + 16, n(q, 0), { tam: 12, ancla: 'middle', color: K.tinta2 });
      });
      s('path', { d: 'M' + x0 + ' ' + y0 + 'V' + base + 'H' + (x0 + w), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      D.t(svg, x0 - 4, y0 - 14, 'T (°C)', { tam: 12.5, peso: 600 });
      D.t(svg, x0 + w, base + 34, 'Calor retirado (kJ por kg de agua)', { tam: 12.5, peso: 600, ancla: 'end' });
      // el rocío del vapor que llega
      var p0 = CI.pts[0];
      S.rocio = grupo(svg);
      linea(S.rocio, x0, Y(p0.t), x0 + w, Y(p0.t), { color: K.ref, guion: '6 4' });
      D.t(S.rocio, X(60), Y(p0.t) - 8, 'rocío: ' + n(p0.t, 1) + ' °C', { tam: 12.5, peso: 650, color: K.tinta2, halo: true });
      // el agua sola: un trazo que crece punto a punto, con su lectura
      var sc = CI.pts.map(function (p) { return [X(p.q), Y(p.t)]; }), acum = [0];
      for (var i = 1; i < sc.length; i++) acum.push(acum[i - 1] + Math.hypot(sc[i][0] - sc[i - 1][0], sc[i][1] - sc[i - 1][1]));
      var total = acum[acum.length - 1];
      S.agua = s('path', { d: '', fill: 'none', stroke: K.tinta, 'stroke-width': 3, 'stroke-linejoin': 'round' }, svg);
      S.mov = D.punto(svg, sc[0][0], sc[0][1], { r: 6 }); S.mov.setAttribute('opacity', 0);
      S.lect = grupo(svg);
      var lx = X(70), ly = Y(64);
      S.l1 = D.t(S.lect, lx, ly, '', { tam: 13, peso: 650 });
      S.l2 = D.t(S.lect, lx, ly + 20, '', { tam: 13, peso: 650 });
      S.l3 = D.t(S.lect, lx, ly + 40, '', { tam: 13, peso: 650 });
      S.hasta = function (u) {
        var meta = u * total, k = 0;
        while (k < acum.length - 1 && acum[k] < meta) k++;
        S.agua.setAttribute('d', camino(sc.slice(0, Math.max(2, k + 1))));
        S.agua.setAttribute('opacity', u > 0 ? 1 : 0);
        S.mov.setAttribute('cx', sc[k][0]); S.mov.setAttribute('cy', sc[k][1]);
        var p = CI.pts[k];
        D.ponerTexto(S.l1, 'agua condensada: ' + n(100 * p.f, 1) + ' %');
        D.ponerTexto(S.l2, 'y del tolueno: ' + n(p.y, 3));
        D.ponerTexto(S.l3, 'T = ' + n(p.t, 1) + ' °C');
      };
      // la meseta del heteroazeótropo
      S.meseta = grupo(svg);
      linea(S.meseta, x0, Y(CI.taz), X(CI.q1), Y(CI.taz), { color: K.oliva, guion: '6 4', ancho: 1.8 });
      s('line', { x1: X(CI.q1), y1: Y(CI.taz), x2: X(CI.q2), y2: Y(CI.taz), stroke: K.tinta, 'stroke-width': 3, 'stroke-linecap': 'round' }, S.meseta);
      D.t(S.meseta, x0 + 8, Y(CI.taz) - 8, n(CI.taz, 1) + ' °C', { tam: 13, peso: 700, color: K.olivaOsc, halo: true });
      D.flecha(S.meseta, X(1250), Y(76), X(CI.q1) - 14, Y(CI.taz) + 4, { color: K.olivaOsc, ancho: 1.8, punta: 8 });
      D.t(S.meseta, X(1250), Y(76) + 18, 'agua y tolueno juntos', { tam: 12.5, peso: 700, ancla: 'middle', color: K.olivaOsc, halo: true });
      S.lectAz = grupo(svg);
      D.t(S.lectAz, lx, ly, n(CI.P, 0) + ' = ' + n(CI.pw(CI.taz), 0) + ' + ' + n(CI.pt(CI.taz), 0) + ' mmHg', { tam: 13, peso: 650 });
      D.t(S.lectAz, lx, ly + 20, 'queda el ' + n(100 * (1 - CI.faz), 1) + ' % del agua', { tam: 13, peso: 650 });
      D.t(S.lectAz, lx, ly + 40, 'y todo el tolueno', { tam: 13, peso: 650 });
      // el subenfriamiento de los dos líquidos
      S.sub = D.trazo(svg, 'M' + X(CI.q2) + ' ' + Y(CI.taz) + 'L' + X(CI.q3) + ' ' + Y(CI.TS), { color: K.tinta, ancho: 3 });
      S.fin = grupo(svg);
      D.punto(S.fin, X(CI.q3), Y(CI.TS), { r: 6 });
      D.t(S.fin, X(CI.q3) - 10, Y(CI.TS) + 4, n(CI.TS, 0) + ' °C', { tam: 12.5, peso: 650, ancla: 'end', color: K.tinta2, halo: true });
      S.lectFin = grupo(svg);
      D.t(S.lectFin, lx, ly, 'total: ' + n(CI.q3, 0) + ' kJ por kg de agua', { tam: 13, peso: 650 });
      D.t(S.lectFin, lx, ly + 20, 'tolueno: ' + n(100 * CI.R * CI.LT / CI.q3, 1) + ' % de la carga', { tam: 13, peso: 650 });
      D.t(S.lectFin, lx, ly + 40, 'salen dos líquidos al decantador', { tam: 13, peso: 650 });
      S.p0 = D.punto(svg, sc[0][0], sc[0][1], { r: 6 }); S.p0.setAttribute('opacity', 0);
      return S;
    },
    pasos: [
      { texto: 'El vapor llega a 1 atm con ' + n(CI.R, 2) + ' kg de tolueno por kg de agua, una fracción molar de tolueno de ' + n(CI.pts[0].y, 4) + '. El agua alcanza su rocío a ' + n(CI.pts[0].t, 1) + ' °C, mucho antes que el tolueno.', dur: 1.4, ir: function (S, t) { D.ver(S.rocio, T(t, 0, 0.6)); D.ver(S.p0, T(t, 0.4, 1)); } },
      { texto: 'Primero condensa el agua sola. El vapor que queda se enriquece en tolueno y su rocío baja: con el 90 % del agua condensada va en ' + n(CI.en(0.9), 1) + ' °C, y cerca del final cae de golpe.', dur: 4.5, ir: function (S, t, raw) {
        D.ver(S.p0, 0); D.ver(S.mov, 1); D.ver(S.lect, 1); S.hasta(raw == null ? t : raw);
      } },
      { texto: 'Cuando ha condensado el ' + n(100 * CI.faz, 1) + ' % del agua, el vapor llega a la composición del heteroazeótropo. A ' + n(CI.taz, 1) + ' °C las dos presiones de vapor suman ' + n(CI.P, 0) + ' mmHg, ' + n(CI.pw(CI.taz), 0) + ' del agua y ' + n(CI.pt(CI.taz), 0) + ' del tolueno, y con dos líquidos y su vapor la temperatura queda fija: el tolueno y el agua que queda condensan juntos.', dur: 1.8, ir: function (S, t) {
        D.ver(S.mov, 1 - T(t, 0, 0.3)); D.ver(S.lect, 1 - T(t, 0, 0.3)); D.ver(S.meseta, T(t, 0.2, 0.8)); D.ver(S.lectAz, T(t, 0.4, 1));
      } },
      { texto: 'Las dos fases líquidas se subenfrían hasta ' + n(CI.TS, 0) + ' °C. En total se retiran ' + n(CI.q3, 0) + ' kJ por kg de agua, y la condensación del tolueno pone apenas el ' + n(100 * CI.R * CI.LT / CI.q3, 1) + ' % de esa carga. Salen dos líquidos que no se mezclan, y van al decantador.', dur: 1.6, ir: function (S, t) {
        D.ver(S.lectAz, 1 - T(t, 0, 0.3)); S.sub.dibujar(T(t, 0.1, 0.7)); D.ver(S.fin, T(t, 0.6, 0.9)); D.ver(S.lectFin, T(t, 0.6, 1));
      } }
    ]
  });
})();
