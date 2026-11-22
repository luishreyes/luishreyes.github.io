/* Las animaciones por pasos de los capítulos 5 y 6 del libro, «Caracterización de sólidos particulados» y
   «Tamizado y análisis granulométrico», traídas con el mismo código y los mismos números para la presentación
   de propiedades de sólidos particulados de 2027-10. Es una copia de libro/figuras/{capítulo}/actividades.js del
   repositorio del libro, solo con las animaciones: los retos, con sus soluciones, se quedan en el libro. No se
   edita aquí; cuando cambian en el libro se vuelven a copiar. Corren con el motor de /classroom/estilo-libro/actividades/. */
/* ===== Del capítulo 5, «Caracterización de sólidos particulados»: libro/figuras/caracterizacion-de-solidos-particulados/actividades.js ===== */
/* Las animaciones y los retos del capítulo 5, «Caracterización de sólidos particulados». Se escriben aquí directo
   (en bombas pasan por el taller interactivo/). Usan el motor de figuras/comun/actividades.js y las piezas de
   figuras/comun/dibujo.js; los colores salen de la paleta del libro (ZB.dib.col y PALETA), nunca a mano.
   Los números salen del texto del capítulo y del caso de la caliza molida: la tabla del tamizado, los ajustes y
   las medias de caso.json (que escribe herramientas/granulometria.py). Cada animación dibuja lo mismo que la figura
   o el ejemplo que representa: el grano de la figura de los cuatro diámetros, con el mismo contorno y las mismas
   razones; los once tamices y el fondo de la tabla del tamizado, con la densidad q3* de la figura de la
   distribución; las medias y las tres maneras de tratar el fondo del ejemplo del área específica; las dos
   densidades del ejemplo de la probeta, y el divisor de rifles de la figura isométrica, con sus doce canaletas
   de 25 mm, seis hacia la bandeja de adelante y seis hacia la de atrás. Un color hace un solo trabajo: en las
   gráficas, Rosin-Rammler en oliva, como en las figuras del capítulo; los puntos medidos en amarillo con borde
   de tinta. */
(function () {
  'use strict';
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, T = ZB.tramo, L = ZB.lerp;
  var SO = window.PALETA.materiales.solido;

  /* ---------- El caso: el tamizado de la caliza ---------- */
  var AB = [2.0, 1.4, 1.0, 0.71, 0.5, 0.355, 0.25, 0.18, 0.125, 0.09, 0.063];
  var MASA = [0.4, 3.5, 12.3, 21.6, 30.3, 27.4, 26.2, 18.6, 16.3, 10.5, 8.9, 21.7];
  var TOT = 197.7;
  var W = MASA.map(function (m) { return m / TOT; });
  var WF = W[11];
  var Q = [];
  (function () { var a = 0; for (var i = 0; i < AB.length; i++) { a += W[i]; Q.push(1 - a); } })();
  var ARRIBA = AB.map(function (x, i) { return i ? AB[i - 1] : 2.8; });          // la clase del tamiz de 2,00 mm se cierra en 2,80
  var XM = AB.map(function (x, i) { return (x + ARRIBA[i]) / 2; });              // la media aritmética de cada clase
  var RRB = { n: 1.14755, xp: 0.443956 };                                         // el ajuste del ejemplo (caso.json)
  function qRRB(x) { return 1 - Math.exp(-Math.pow(x / RRB.xp, RRB.n)); }
  // las medias de la ecuación de las medias, con el fondo por fuera (dividido por 1 − w_f) y con el fondo a 0,0315 mm
  var SUM1 = 0, SUM3 = 0, SUMX = 0;
  for (var i0 = 0; i0 < 11; i0++) { SUM1 += W[i0] / XM[i0]; SUM3 += W[i0] / Math.pow(XM[i0], 3); SUMX += W[i0] * XM[i0]; }
  var MEDIAS = {
    fuera: { w: SUMX / (1 - WF), sv: (1 - WF) / SUM1, V: Math.pow((1 - WF) / SUM3, 1 / 3) },
    fondo: { w: SUMX + WF * 0.0315, sv: 1 / (SUM1 + WF / 0.0315), V: Math.pow(1 / (SUM3 + WF / Math.pow(0.0315, 3)), 1 / 3) }
  };

  /* ---------- Piezas del capítulo ---------- */
  function grupo(padre, op) { return s('g', { opacity: op == null ? 0 : op }, padre); }
  function camino(padre, pts, o) {
    o = o || {};
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('');
    return s('path', { d: d, fill: 'none', stroke: o.color || K.tinta, 'stroke-width': o.ancho || 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'stroke-dasharray': o.guion || 'none' }, padre);
  }
  function oculto(padre, x, y, str, o) { var e = D.t(padre, x, y, str, o); e.setAttribute('opacity', 0); return e; }
  // Una cota con flecha en las dos puntas, de x1 a x2 en la altura y.
  function cota(padre, x1, y, x2, color) {
    var g = s('g', {}, padre), xm = (x1 + x2) / 2;
    D.flecha(g, xm, y, x1, y, { color: color, ancho: 1.6, punta: 7 });
    D.flecha(g, xm, y, x2, y, { color: color, ancho: 1.6, punta: 7 });
    return g;
  }
  function eje(x0, w, a, b) { return function (v) { return x0 + Math.log(v / a) / Math.log(b / a) * w; }; }
  function poner(el, at) { for (var k in at) el.setAttribute(k, at[k]); }

  /* ================= 5.2 Tamaño y forma de una partícula ================= */

  /* El grano de la figura de los cuatro diámetros: el mismo contorno (herramientas/figura-diametros.mjs) y las
     mismas cuentas, el Feret horizontal, la cuerda de Martin, el círculo de la misma área y el ancho menor. */
  var BASE = [[-58, -10], [-44, -34], [-14, -44], [12, -38], [40, -42], [62, -18], [56, 10], [64, 30], [36, 44], [6, 38], [-22, 46], [-50, 30], [-62, 12]];
  function rotar(P, t) { return P.map(function (p) { return [p[0] * Math.cos(t) - p[1] * Math.sin(t), p[0] * Math.sin(t) + p[1] * Math.cos(t)]; }); }
  var GEO = (function () {
    function area(P) { var a = 0; for (var i = 0; i < P.length; i++) { var p = P[i], q = P[(i + 1) % P.length]; a += p[0] * q[1] - q[0] * p[1]; } return Math.abs(a) / 2; }
    function xs(P) { return P.map(function (p) { return p[0]; }); }
    function ancho(P) { var x = xs(P); return Math.max.apply(null, x) - Math.min.apply(null, x); }
    function debajo(P, c) {
      var out = [];
      for (var i = 0; i < P.length; i++) {
        var a = P[i], b = P[(i + 1) % P.length], ina = a[1] <= c, inb = b[1] <= c;
        if (ina) out.push(a);
        if (ina !== inb) { var t = (c - a[1]) / (b[1] - a[1]); out.push([a[0] + t * (b[0] - a[0]), c]); }
      }
      return out.length > 2 ? area(out) : 0;
    }
    var A = area(BASE), xA = 2 * Math.sqrt(A / Math.PI), x = xs(BASE);
    var ys = BASE.map(function (p) { return p[1]; }), lo = Math.min.apply(null, ys), hi = Math.max.apply(null, ys);
    for (var i = 0; i < 60; i++) { var m = (lo + hi) / 2; if (debajo(BASE, m) < A / 2) lo = m; else hi = m; }
    var yM = (lo + hi) / 2, cr = [];
    for (i = 0; i < BASE.length; i++) {
      var a = BASE[i], b = BASE[(i + 1) % BASE.length];
      if ((a[1] - yM) * (b[1] - yM) < 0) cr.push(a[0] + (yM - a[1]) / (b[1] - a[1]) * (b[0] - a[0]));
    }
    cr.sort(function (p, q) { return p - q; });
    var tMin = 0, wMin = 1e9;
    for (var k = 0; k < 360; k++) { var t = k / 360 * Math.PI, w = ancho(rotar(BASE, t)); if (w < wMin) { wMin = w; tMin = t; } }
    var xmin = Math.min.apply(null, x), xmax = Math.max.apply(null, x);
    return { xA: xA, xmin: xmin, xmax: xmax, xF: xmax - xmin, yM: yM, c0: cr[0], c1: cr[cr.length - 1], xM: cr[cr.length - 1] - cr[0], tMin: tMin, xT: wMin };
  })();
  var RF = n(GEO.xF / GEO.xA, 2), RM = n(GEO.xM / GEO.xA, 2), RT = n(GEO.xT / GEO.xA, 2);

  ZB.animacion('diametros', {
    vista: [0, 0, 640, 300],
    alt: 'El grano anguloso de la figura de los cuatro diámetros. A la izquierda, al microscopio: dos tangentes verticales marcan el diámetro de Feret, ' + RF + ' veces el de área proyectada; la cuerda horizontal que deja la mitad del área de cada lado, el de Martin, ' + RM + ' veces; y el círculo de la misma área, en línea discontinua, el de área proyectada. A la derecha, la malla vista de canto: el grano, girado a su ancho menor, pasa entre dos alambres; el diámetro de tamiz es ' + RT + ' veces el de área proyectada.',
    montar: function (svg) {
      var S = {}, k = 1.25, cx = 170, cy = 122, c2 = 470;
      var pth = function (P, dx, dy) { return 'M' + P.map(function (p) { return (dx + k * p[0]).toFixed(1) + ' ' + (dy + k * p[1]).toFixed(1); }).join('L') + 'Z'; };
      var defs = s('defs', {}, svg), clip = s('clipPath', { id: 'cs-dm-mitad' }, defs);
      s('rect', { x: cx - 120, y: cy + k * GEO.yM, width: 240, height: 120 }, clip);
      D.t(svg, cx, 238, 'Al microscopio', { tam: 12.5, peso: 700, ancla: 'middle' });
      D.t(svg, c2, 238, 'En la malla, vista de canto', { tam: 12.5, peso: 700, ancla: 'middle' });
      S.grano = grupo(svg);
      s('path', { d: pth(BASE, cx, cy), fill: SO.relleno, stroke: SO.oscuro, 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, S.grano);
      // Martin: la mitad de abajo del área, sombreada, y la cuerda que la parte
      S.martin = grupo(svg);
      s('path', { d: pth(BASE, cx, cy), fill: SO.medio, 'clip-path': 'url(#cs-dm-mitad)', opacity: 0.8 }, S.martin);
      cota(S.martin, cx + k * GEO.c0, cy + k * GEO.yM, cx + k * GEO.c1, K.olivaOsc);
      // Feret: dos tangentes verticales
      S.feret = grupo(svg);
      [GEO.xmin, GEO.xmax].forEach(function (x) { camino(S.feret, [[cx + k * x, 44], [cx + k * x, 206]], { color: K.azul, ancho: 1.6, guion: '6 4' }); });
      cota(S.feret, cx + k * GEO.xmin, 200, cx + k * GEO.xmax, K.azul);
      // área proyectada: el círculo de la misma área
      S.circ = grupo(svg);
      s('circle', { cx: cx, cy: cy, r: k * GEO.xA / 2, fill: 'none', stroke: K.tinta2, 'stroke-width': 2, 'stroke-dasharray': '6 4' }, S.circ);
      // la malla vista de canto: dos alambres a cada lado de la abertura
      S.malla = grupo(svg);
      var rw = 10, yw = cy + 8, g = k * GEO.xT / 2;
      [-1, 1].forEach(function (sg) {
        s('circle', { cx: c2 + sg * (g + rw), cy: yw, r: rw, fill: K.metalM, stroke: K.tinta, 'stroke-width': 1.4 }, S.malla);
        s('circle', { cx: c2 + sg * (g + 3 * rw + 14), cy: yw, r: rw, fill: K.metalM, stroke: K.tinta, 'stroke-width': 1.4 }, S.malla);
      });
      S.granoT = s('path', { fill: SO.relleno, stroke: SO.oscuro, 'stroke-width': 1.6, 'stroke-linejoin': 'round', opacity: 0 }, svg);
      S.ponerT = function (ang, dy) {
        var R = rotar(BASE, ang), x = R.map(function (p) { return p[0]; }), mx = (Math.max.apply(null, x) + Math.min.apply(null, x)) / 2;
        S.granoT.setAttribute('d', pth(R.map(function (p) { return [p[0] - mx, p[1]]; }), c2, cy - 8 + dy));
      };
      S.ponerT(GEO.tMin, 0);
      S.cotaT = grupo(svg);
      cota(S.cotaT, c2 - g, 212, c2 + g, K.naranja);
      // las lecturas
      S.lF = oculto(svg, 40, 266, 'Feret: x_F = ' + RF + ' x_A', { tam: 12.5, peso: 650, color: K.azul });
      S.lM = oculto(svg, 330, 266, 'Martin: x_M = ' + RM + ' x_A', { tam: 12.5, peso: 650, color: K.olivaOsc });
      S.lA = oculto(svg, 40, 288, 'Área proyectada: x_A, la referencia', { tam: 12.5, peso: 650, color: K.tinta2 });
      S.lT = oculto(svg, 330, 288, 'Tamiz: x_T = ' + RT + ' x_A', { tam: 12.5, peso: 650, color: K.naranja });
      return S;
    },
    pasos: [
      { texto: 'Un grano anguloso de caliza, visto al microscopio: su contorno proyectado. Cada método de medición lo mide a su manera.', dur: 1.4, ir: function (S, t) { D.ver(S.grano, t); } },
      { texto: 'El diámetro de Feret: la distancia entre dos tangentes paralelas, aquí verticales. Para este contorno mide ' + RF + ' veces el diámetro de área proyectada.', dur: 1.8, ir: function (S, t) { D.ver(S.feret, T(t, 0, 0.6)); D.ver(S.lF, T(t, 0.5, 1)); } },
      { texto: 'El de Martin: la cuerda horizontal que deja la mitad del área de cada lado; la de abajo va sombreada. Mide ' + RM + ' veces el de área proyectada.', dur: 1.8, ir: function (S, t) { D.ver(S.martin, T(t, 0, 0.6)); D.ver(S.lM, T(t, 0.5, 1)); } },
      { texto: 'El de área proyectada: el círculo de la misma área que el contorno, en línea discontinua. Es la referencia de los otros tres, $x_A$.', dur: 1.6, ir: function (S, t) { D.ver(S.circ, T(t, 0, 0.6)); D.ver(S.lA, T(t, 0.5, 1)); } },
      { texto: 'El de tamiz: la malla se ve de canto, y el grano pasa girado por su ancho menor entre dos alambres. Mide ' + RT + ' veces el de área proyectada. El mismo grano da cuatro números.', dur: 2.6, ir: function (S, t) {
        D.ver(S.malla, T(t, 0, 0.2));
        S.granoT.setAttribute('opacity', T(t, 0.05, 0.25));
        S.ponerT(L(GEO.tMin - 1.2, GEO.tMin, T(t, 0.1, 0.55)), L(-50, 0, T(t, 0.45, 0.85)));
        D.ver(S.cotaT, T(t, 0.8, 0.95)); D.ver(S.lT, T(t, 0.85, 1));
      } }
    ]
  });

  /* El cubo, el cilindro corto y la esfera de su mismo volumen, a escala: la esfericidad de Wadell, la de McCabe y la
     esfera corregida. */
  ZB.animacion('esfericidad', {
    vista: [0, 0, 640, 282],
    alt: 'Un cubo de arista b junto a la esfera de su mismo volumen, de 1,241 b de diámetro: el cubo tiene 6 b² de área y la esfera 4,84 b², así que la esfericidad de Wadell es 0,806. Un cilindro con el largo igual al diámetro junto a la esfera de su volumen, de 1,145 D: 4,71 D² contra 4,12 D², esfericidad 0,874. Con el tamaño nominal, la esfericidad de McCabe vale 1,0 en los dos. Al final, un grano triturado, con esfericidad de cerca de 0,65, y la razón entre área y volumen de una esfera corregida.',
    montar: function (svg) {
      var S = {}, b = 70;
      function esfera(padre, cx, cy, r) {
        s('circle', { cx: cx, cy: cy, r: r, fill: SO.relleno, stroke: SO.oscuro, 'stroke-width': 1.6 }, padre);
        s('ellipse', { cx: cx - r * 0.35, cy: cy - r * 0.38, rx: r * 0.28, ry: r * 0.18, fill: K.blanco, opacity: 0.6 }, padre);
      }
      function lineas(padre, cx, y0, lin) {
        return lin.map(function (l, i) { return oculto(padre, cx, y0 + 21 * i, l[0], { tam: 12.5, peso: l[2] || 500, ancla: 'middle', color: l[1] || K.tinta }); });
      }
      // el cubo, con una arista de 70 px
      S.cubo = grupo(svg);
      var x0 = 52, y0 = 82, dx = 24, dy = 16;
      s('path', { d: 'M' + x0 + ' ' + y0 + 'L' + (x0 + dx) + ' ' + (y0 - dy) + 'L' + (x0 + b + dx) + ' ' + (y0 - dy) + 'L' + (x0 + b) + ' ' + y0 + 'Z', fill: SO.relleno, stroke: SO.oscuro, 'stroke-width': 1.4, 'stroke-linejoin': 'round' }, S.cubo);
      s('path', { d: 'M' + (x0 + b) + ' ' + y0 + 'L' + (x0 + b + dx) + ' ' + (y0 - dy) + 'L' + (x0 + b + dx) + ' ' + (y0 - dy + b) + 'L' + (x0 + b) + ' ' + (y0 + b) + 'Z', fill: SO.oscuro, opacity: 0.85, stroke: SO.oscuro, 'stroke-width': 1.4, 'stroke-linejoin': 'round' }, S.cubo);
      s('rect', { x: x0, y: y0, width: b, height: b, fill: SO.medio, stroke: SO.oscuro, 'stroke-width': 1.4 }, S.cubo);
      D.t(S.cubo, x0 + b / 2, y0 + b + 18, 'b', { tam: 13, peso: 700, ancla: 'middle', it: true });
      S.lCubo = lineas(svg, 140, 196, [['área del cubo: 6 b^2']]);
      // la esfera del mismo volumen: x_v = 1,241 b
      S.esf1 = grupo(svg);
      esfera(S.esf1, 222, 112, 1.2407 * b / 2);
      D.t(S.esf1, 222, 170, 'x_v = 1,241 b', { tam: 12.5, ancla: 'middle', halo: true });
      S.lEsf1 = lineas(svg, 140, 217, [['área de la esfera: 4,84 b^2'], ['ψ = 4,84/6 = 0,806', K.tinta, 700]]);
      // el cilindro con el largo igual al diámetro
      S.cil = grupo(svg);
      var cx = 330, top = 72, ry = 11;
      s('path', { d: 'M' + (cx - b / 2) + ' ' + top + 'V' + (top + b) + 'A' + (b / 2) + ' ' + ry + ' 0 0 0 ' + (cx + b / 2) + ' ' + (top + b) + 'V' + top + 'Z', fill: SO.medio, stroke: SO.oscuro, 'stroke-width': 1.4 }, S.cil);
      s('ellipse', { cx: cx, cy: top, rx: b / 2, ry: ry, fill: SO.relleno, stroke: SO.oscuro, 'stroke-width': 1.4 }, S.cil);
      D.t(S.cil, cx, top + b + 30, 'D = L', { tam: 13, peso: 700, ancla: 'middle', it: true });
      S.esf2 = grupo(svg);
      esfera(S.esf2, 440, 112, 1.1447 * b / 2);
      D.t(S.esf2, 440, 170, 'x_v = 1,145 D', { tam: 12.5, ancla: 'middle', halo: true });
      S.lCil = lineas(svg, 385, 196, [['área del cilindro: 4,71 D^2'], ['área de la esfera: 4,12 D^2'], ['ψ = 0,874', K.tinta, 700]]);
      // McCabe, con el tamaño nominal
      S.mc1 = oculto(svg, 140, 259, 'McCabe: Φ_s = 1,0', { tam: 12.5, peso: 700, ancla: 'middle', color: K.olivaOsc });
      S.mc2 = oculto(svg, 385, 259, 'McCabe: Φ_s = 1,0', { tam: 12.5, peso: 700, ancla: 'middle', color: K.olivaOsc });
      // un grano triturado
      S.tri = grupo(svg);
      s('path', { d: 'M' + BASE.map(function (p) { return (568 + 0.62 * p[0]).toFixed(1) + ' ' + (112 + 0.62 * p[1]).toFixed(1); }).join('L') + 'Z', fill: SO.relleno, stroke: SO.oscuro, 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, S.tri);
      D.t(S.tri, 568, 170, 'triturado', { tam: 12.5, ancla: 'middle' });
      S.lTri = lineas(svg, 568, 196, [['ψ ≈ 0,65', K.tinta, 700], ['A_p/V_p = 6/(ψ x_v)']]);
      return S;
    },
    pasos: [
      { texto: 'Un cubo de arista $b$: su volumen es $b^3$ y su área, $6b^2$.', dur: 1.4, ir: function (S, t) { D.ver(S.cubo, T(t, 0, 0.6)); D.ver(S.lCubo[0], T(t, 0.4, 1)); } },
      { texto: 'La esfera del mismo volumen, dibujada a la misma escala, mide $x_v = 1,241\\,b$ y tiene un área de $4,84\\,b^2$. La esfericidad de Wadell es el cociente: $\\psi = 4,84/6 = 0,806$.', dur: 2, ir: function (S, t) { D.ver(S.esf1, T(t, 0, 0.5)); D.ver(S.lEsf1[0], T(t, 0.4, 0.7)); D.ver(S.lEsf1[1], T(t, 0.7, 1)); } },
      { texto: 'Un cilindro con el largo igual al diámetro: la esfera de su volumen mide $1,145\\,D$, con $4,12\\,D^2$ de área contra los $4,71\\,D^2$ del cilindro, y $\\psi$ = 0,874.', dur: 2, ir: function (S, t) { D.ver(S.cil, T(t, 0, 0.4)); D.ver(S.esf2, T(t, 0.3, 0.6)); S.lCil.forEach(function (e, i) { D.ver(e, T(t, 0.5 + 0.15 * i, 0.7 + 0.15 * i)); }); } },
      { texto: 'Con el tamaño nominal, el lado del cubo o el diámetro del cilindro, la esfericidad de McCabe, $\\Phi_s = 6V_p/(x A_p)$, vale 1,0 en los dos, como en la esfera, aunque el cubo tenga 1,24 veces el área de la esfera de su volumen.', dur: 1.8, ir: function (S, t) { D.ver(S.mc1, T(t, 0, 0.6)); D.ver(S.mc2, T(t, 0.3, 0.9)); } },
      { texto: 'Un grano triturado queda alrededor de 0,65. Con la esfericidad, su razón entre área y volumen es la de una esfera corregida: $A_p/V_p = 6/(\\psi\\,x_v)$.', dur: 1.6, ir: function (S, t) { D.ver(S.tri, T(t, 0, 0.5)); D.ver(S.lTri[0], T(t, 0.4, 0.7)); D.ver(S.lTri[1], T(t, 0.6, 1)); } }
    ]
  });

  /* Reto: los diámetros equivalentes y la esfericidad de un cilindro y de una laja, y la razón entre área y volumen
     de un grano triturado. */

  /* ================= 5.3 La distribución de tamaños ================= */

  /* De la pila de tamices de la tabla del tamizado a la figura de la distribución: las masas, las fracciones, la
     densidad q3* en el ancho logarítmico de cada clase y la acumulada con x50,3 y x80,3 interpolados. */
  ZB.animacion('histograma', {
    vista: [0, 0, 640, 318],
    alt: 'A la izquierda, la pila de once tamices, de 2,000 a 0,063 mm, y el fondo, con la masa que retuvo cada uno: 197,7 g en total. A la derecha, arriba, las fracciones de cada clase como barras sobre el tamaño en escala logarítmica, que después pasan a la densidad q3*, la fracción dividida por el ancho de la clase en el logaritmo; la más alta es la de 0,5 a 0,71 mm, y el fondo, 11,0 %, queda por fuera. Abajo, la curva acumulada de lo que pasa, con el x50,3 de 0,339 mm y el x80,3 de 0,696 mm.',
    montar: function (svg) {
      var S = {}, X = eje(200, 420, 0.045, 2.8);
      // la pila de tamices
      D.t(svg, 16, 30, 'La pila de tamices', { tam: 12.5, peso: 700 });
      S.gramos = [];
      AB.concat([0]).forEach(function (a, i) {
        var y = 42 + i * 17.5;
        s('rect', { x: 16, y: y, width: 128, height: 15.5, fill: i === 11 ? K.zona : K.papel, stroke: K.guia, 'stroke-width': 1, rx: 2 }, svg);
        D.t(svg, 22, y + 11.8, i === 11 ? 'fondo' : n(a, 3), { tam: 11.5, color: K.tinta2 });
        S.gramos.push(oculto(svg, 138, y + 11.8, n(MASA[i], 1) + ' g', { tam: 11.5, peso: 650, ancla: 'end' }));
      });
      S.total = oculto(svg, 138, 268, 'total: 197,7 g', { tam: 12, peso: 700, ancla: 'end' });
      // arriba: las barras, primero w_i y después q3*
      var y0 = 40, h = 92, base = y0 + h;
      AB.forEach(function (a) { s('line', { x1: X(a), x2: X(a), y1: y0, y2: base, stroke: K.rejilla, 'stroke-width': 1 }, svg); });
      S.ticW = grupo(svg, 0); S.ticQ = grupo(svg, 0);
      [0, 0.05, 0.10, 0.15].forEach(function (v) {
        var y = base - v / 0.16 * h;
        s('line', { x1: 200, x2: 620, y1: y, y2: y, stroke: K.rejilla, 'stroke-width': 1 }, S.ticW);
        D.t(S.ticW, 194, y + 4, n(v, 2), { tam: 11.5, ancla: 'end', color: K.tinta2 });
      });
      [0, 0.1, 0.2, 0.3, 0.4].forEach(function (v) {
        var y = base - v / 0.46 * h;
        s('line', { x1: 200, x2: 620, y1: y, y2: y, stroke: K.rejilla, 'stroke-width': 1 }, S.ticQ);
        D.t(S.ticQ, 194, y + 4, n(v, 1), { tam: 11.5, ancla: 'end', color: K.tinta2 });
      });
      S.yW = oculto(svg, 202, 30, 'w_i, fracción de cada clase', { tam: 12, peso: 600 });
      S.yQ = oculto(svg, 202, 30, 'q_3^* = w_i/ln(x_{i−1}/x_i)', { tam: 12, peso: 600 });
      // como en la figura de la distribución: las diez clases de 0,063 a 2,00 mm, en el gris de las barras; la del tamiz
      // de 2,00 mm, con 0,2 %, no se ve a esta escala y la figura no la dibuja
      S.barras = AB.slice(1).map(function (a, j) {
        var i = j + 1;
        return { r: s('rect', { x: X(a) + 1, width: X(ARRIBA[i]) - X(a) - 2, y: base, height: 0, fill: window.PALETA.graficas.barra }, svg),
          hw: W[i] / 0.16 * h, hq: W[i] / Math.log(ARRIBA[i] / a) / 0.46 * h };
      });
      s('path', { d: 'M200 ' + y0 + 'V' + base + 'H620', fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      S.notaF = grupo(svg);
      D.t(S.notaF, 206, 52, 'fondo: 11,0 %,', { tam: 11.5, color: K.tinta2 });
      D.t(S.notaF, 206, 67, 'sin ancho ni densidad', { tam: 11.5, color: K.tinta2 });
      // abajo: la acumulada
      var Y = function (q) { return 270 - q * 100; };
      [0, 0.5, 1].forEach(function (q) { s('line', { x1: 200, x2: 620, y1: Y(q), y2: Y(q), stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, 194, Y(q) + 4, n(100 * q, 0), { tam: 11.5, ancla: 'end', color: K.tinta2 }); });
      [[0.063, '0,063'], [0.125, '0,125'], [0.25, '0,25'], [0.5, '0,5'], [1, '1'], [2, '2']].forEach(function (p) {
        s('line', { x1: X(p[0]), x2: X(p[0]), y1: 170, y2: 270, stroke: K.rejilla, 'stroke-width': 1 }, svg);
        D.t(svg, X(p[0]), 286, p[1], { tam: 11.5, ancla: 'middle', color: K.tinta2 });
      });
      s('path', { d: 'M200 170V270H620', fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      D.t(svg, 620, 308, 'abertura del tamiz, x (mm)', { tam: 12, peso: 600, ancla: 'end' });
      D.t(svg, 202, 160, 'Q_3, pasa (%)', { tam: 12, peso: 600 });
      S.curva = D.trazo(svg, D.camino(AB.map(function (a, i) { return [a, Q[i]]; }), X, Y), { color: K.tinta2, ancho: 1.8 });
      S.puntos = grupo(svg);
      AB.forEach(function (a, i) { D.punto(S.puntos, X(a), Y(Q[i]), { r: 4.5 }); });
      // x50,3 y x80,3 interpolados en ln x
      function interp(q) {
        for (var j = 0; j < AB.length - 1; j++) if ((Q[j] - q) * (Q[j + 1] - q) <= 0) return Math.exp(Math.log(AB[j + 1]) + (q - Q[j + 1]) / (Q[j] - Q[j + 1]) * (Math.log(AB[j]) - Math.log(AB[j + 1])));
        return NaN;
      }
      S.guias = grupo(svg);
      [[0.5, 'x_{50,3} = '], [0.8, 'x_{80,3} = ']].forEach(function (p) {
        var x = interp(p[0]);
        camino(S.guias, [[200, Y(p[0])], [X(x), Y(p[0])], [X(x), 270]], { color: K.olivaOsc, ancho: 1.6, guion: '5 4' });
        D.punto(S.guias, X(x), Y(p[0]), { r: 4, color: K.olivaOsc, borde: K.olivaOsc });
        D.t(S.guias, X(x) - 7, Y(p[0]) - 8, p[1] + n(x, 3) + ' mm', { tam: 12.5, peso: 700, ancla: 'end', color: K.olivaOsc, halo: true });
      });
      return S;
    },
    pasos: [
      { texto: 'La pila de once tamices de la serie R 20/3 y el fondo, con la masa que retuvo cada uno: 197,7 g recuperados de los 198,4 g que se pusieron en el tamiz de arriba.', dur: 1.8, ir: function (S, t) { S.gramos.forEach(function (g, i) { D.ver(g, T(t, 0.05 * i, 0.05 * i + 0.3)); }); D.ver(S.total, T(t, 0.7, 1)); } },
      { texto: 'Cada masa dividida por 197,7 g es la fracción $w_i$ de su clase, que va de su abertura a la de arriba. El fondo, con 11,0 %, no tiene abertura de abajo y no entra en la gráfica.', dur: 2, ir: function (S, t) {
        D.ver(S.ticW, T(t, 0, 0.3)); D.ver(S.yW, T(t, 0, 0.3));
        S.barras.forEach(function (b, i) { var hh = b.hw * T(t, 0.1 + 0.05 * i, 0.4 + 0.05 * i); b.r.setAttribute('y', 132 - hh); b.r.setAttribute('height', hh); });
      } },
      { texto: 'Dividida por el ancho de su clase en el logaritmo, de 0,329 a 0,365, cada barra es la densidad $q_3^*$, y su área es la fracción. La más alta es la de 0,5 a 0,71 mm.', dur: 1.8, ir: function (S, t) {
        var u = T(t, 0.1, 0.9);
        D.ver(S.ticW, 1 - u); D.ver(S.yW, 1 - u); D.ver(S.ticQ, u); D.ver(S.yQ, u); D.ver(S.notaF, T(t, 0.6, 1));
        S.barras.forEach(function (b) { var hh = L(b.hw, b.hq, u); b.r.setAttribute('y', 132 - hh); b.r.setAttribute('height', hh); });
      } },
      { texto: 'Sumando desde los finos sale la acumulada: $Q_3$ es la fracción que pasa por cada abertura. Por el tamiz de 0,063 mm pasa el 11,0 %, lo que quedó en el fondo.', dur: 1.8, ir: function (S, t) { D.ver(S.puntos, T(t, 0, 0.5)); S.curva.dibujar(T(t, 0.3, 1)); } },
      { texto: 'El 50 % y el 80 % se interpolan entre los dos tamices que los encierran, en línea recta sobre el logaritmo: $x_{50,3}$ = 0,339 mm y $x_{80,3}$ = 0,696 mm. El $x_{10,3}$ no se lee: queda por debajo del tamiz más fino.', dur: 2, ir: function (S, t) { D.ver(S.guias, t); } }
    ]
  });

  /* El ajuste de Rosin-Rammler, paso a paso, con los números del ejemplo del ajuste: los once puntos con una banda de
     3 puntos de pasante, el modelo y lo que dicen sus dos parámetros, los dos logaritmos que lo vuelven una recta (y
     cómo estiran las bandas), la recta que da n y, donde cruza el cero, x', la vuelta a la curva con el error medio y
     la lectura de x50,3 y x80,3 del modelo contra la interpolación. Arriba, en una franja, la ecuación de cada paso. */
  var VMIN = -2.6, VMAX = 2.2;
  function vRR(q) { return Math.log(-Math.log(1 - q)); }
  ZB.animacion('ajuste-rrb', {
    vista: [0, 0, 640, 404],
    alt: 'Los once puntos del caso en la curva acumulada, cada uno con una banda de 3 puntos porcentuales de pasante por debajo. Arriba aparece el modelo de Rosin-Rammler, Q3 = 1 − exp[−(x/x′)^n], con x′ el tamaño por el que pasa el 63,2 % y n, que dice qué tan angosta es la distribución. Con R = 1 − Q3, la forma lineal ln ln(1/R) = n ln x − n ln x′ deja los puntos casi en línea recta y estira las bandas: la del punto de 99,8 % unas siete veces más que la del medio. La recta de mínimos cuadrados tiene pendiente n = 1,148 y corte 0,932, con r² de 0,998, y cruza el cero en ln x′ = −0,812, es decir, x′ = 0,444 mm. De vuelta en la curva, cada punto queda a su distancia del modelo, que una franja de abajo muestra en puntos de pasante; el error medio es de 1,3 puntos. Del modelo se leen x50,3 = 0,323 mm y x80,3 = 0,672 mm, contra 0,339 y 0,696 mm interpolados.',
    montar: function (svg) {
      var S = {}, x0 = 80, w = 520, y0 = 98, h = 210, base = y0 + h, X = eje(x0, w, 0.05, 2.6);
      S.X = X;
      S.yA = function (q) { return base - q * h; };
      S.yB = function (v) { return base - (v - VMIN) / (VMAX - VMIN) * h; };
      [[0.063, '0,063'], [0.125, '0,125'], [0.25, '0,25'], [0.5, '0,5'], [1, '1'], [2, '2']].forEach(function (p) {
        s('line', { x1: X(p[0]), x2: X(p[0]), y1: y0, y2: base, stroke: K.rejilla, 'stroke-width': 1 }, svg);
        D.t(svg, X(p[0]), base + 17, p[1], { tam: 11.5, ancla: 'middle', color: K.tinta2 });
      });
      S.ticA = grupo(svg, 1); S.ticB = grupo(svg, 0);
      [0, 0.2, 0.4, 0.6, 0.8, 1].forEach(function (q) { var y = S.yA(q); s('line', { x1: x0, x2: x0 + w, y1: y, y2: y, stroke: K.rejilla, 'stroke-width': 1 }, S.ticA); D.t(S.ticA, x0 - 6, y + 4, n(100 * q, 0), { tam: 11.5, ancla: 'end', color: K.tinta2 }); });
      [-2, -1, 0, 1, 2].forEach(function (v) { var y = S.yB(v); s('line', { x1: x0, x2: x0 + w, y1: y, y2: y, stroke: K.rejilla, 'stroke-width': 1 }, S.ticB); D.t(S.ticB, x0 - 6, y + 4, n(v, 0), { tam: 11.5, ancla: 'end', color: K.tinta2 }); });
      s('path', { d: 'M' + x0 + ' ' + y0 + 'V' + base + 'H' + (x0 + w), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      D.t(svg, x0 + w, base + 36, 'x (mm), escala logarítmica', { tam: 12, peso: 600, ancla: 'end' });
      S.labA = D.t(svg, x0 - 4, y0 - 10, 'Q_3, pasa (%)', { tam: 12, peso: 600 });
      S.labB = oculto(svg, x0 - 4, y0 - 10, 'ln ln(1/R)', { tam: 12, peso: 600 });
      // la leyenda de las bandas, dentro del marco
      S.ley = grupo(svg, 1);
      s('line', { x1: x0 + 18, x2: x0 + 18, y1: y0 + 10, y2: y0 + 26, stroke: K.azul, 'stroke-width': 5, opacity: 0.75 }, S.ley);
      D.t(S.ley, x0 + 28, y0 + 23, 'banda de 3 puntos de pasante', { tam: 12, color: K.azul, peso: 600 });
      // el 63,2 % del modelo, sobre la curva
      S.l63 = grupo(svg);
      s('line', { x1: x0, x2: x0 + w, y1: S.yA(0.632), y2: S.yA(0.632), stroke: K.olivaOsc, 'stroke-width': 1.6, 'stroke-dasharray': '6 4' }, S.l63);
      D.t(S.l63, x0 + w - 4, S.yA(0.632) - 7, 'Q_3 = 63,2 % en x = x\'', { tam: 12, peso: 650, ancla: 'end', color: K.olivaOsc, halo: true });
      // el cero de la forma lineal y el x' que da la recta
      var lxp = -0.932 / 1.148, xp = Math.exp(lxp);
      S.cero = grupo(svg);
      s('line', { x1: x0, x2: x0 + w, y1: S.yB(0), y2: S.yB(0), stroke: K.tinta2, 'stroke-width': 1.6, 'stroke-dasharray': '6 4' }, S.cero);
      S.xp = grupo(svg);
      s('line', { x1: X(xp), x2: X(xp), y1: S.yB(0), y2: base, stroke: K.olivaOsc, 'stroke-width': 1.6, 'stroke-dasharray': '5 4' }, S.xp);
      D.punto(S.xp, X(xp), S.yB(0), { r: 5, color: K.olivaOsc, borde: K.olivaOsc });
      D.t(S.xp, X(xp) + 7, base - 8, 'x\' = 0,444 mm', { tam: 12.5, peso: 700, color: K.olivaOsc, halo: true });
      // el modelo en la curva y la recta en la forma lineal
      var ptsM = [];
      for (var k = 0; k <= 80; k++) { var xx = 0.05 * Math.pow(2.6 / 0.05, k / 80); ptsM.push([X(xx), S.yA(qRRB(xx))]); }
      S.modelo = D.trazo(svg, 'M' + ptsM.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L'), { color: K.serie[1], ancho: 2.2 });
      var va = 1.148 * Math.log(0.05) + 0.932, vb = 1.148 * Math.log(2.6) + 0.932;
      S.recta = D.trazo(svg, 'M' + X(0.05) + ' ' + S.yB(Math.max(VMIN, va)) + 'L' + X(2.6) + ' ' + S.yB(Math.min(VMAX, vb)), { color: K.serie[1], ancho: 2.2 });
      // las lecturas del modelo: x50,3 y x80,3
      S.lect = grupo(svg);
      [[0.5, 0.32258, '0,323'], [0.8, 0.67211, '0,672']].forEach(function (p) {
        camino(S.lect, [[x0, S.yA(p[0])], [X(p[1]), S.yA(p[0])], [X(p[1]), base]], { color: K.olivaOsc, ancho: 1.6, guion: '5 4' });
        D.punto(S.lect, X(p[1]), S.yA(p[0]), { r: 4.5, color: K.olivaOsc, borde: K.olivaOsc });
        D.t(S.lect, X(p[1]) - 6, base - 8, p[2], { tam: 12.5, peso: 700, ancla: 'end', color: K.olivaOsc, halo: true });
      });
      // la franja de abajo: modelo menos medido, en puntos de pasante, 5 px por punto
      var zf = 382;
      S.franja = grupo(svg);
      s('line', { x1: x0, x2: x0 + w, y1: zf - 10, y2: zf - 10, stroke: K.rejilla, 'stroke-width': 1 }, S.franja);
      s('line', { x1: x0, x2: x0 + w, y1: zf, y2: zf, stroke: K.tinta2, 'stroke-width': 1 }, S.franja);
      D.t(S.franja, x0 - 6, zf + 4, '0', { tam: 11.5, ancla: 'end', color: K.tinta2 });
      D.t(S.franja, x0 + w + 4, zf - 6, '+2', { tam: 11, color: K.tinta2 });
      D.t(S.franja, x0 + 4, zf - 20, 'modelo menos medido, en puntos', { tam: 11.5, color: K.naranja, peso: 600 });
      // los puntos, sus bandas y su distancia al modelo
      S.p = AB.map(function (a, i) {
        var q = Q[i], x = X(a);
        return {
          q: q, x: x,
          banda: s('line', { x1: x + 9, x2: x + 9, stroke: K.azul, 'stroke-width': 5, opacity: 0, 'stroke-linecap': 'butt' }, svg),
          dif: s('line', { x1: x, x2: x, y1: S.yA(q), y2: S.yA(qRRB(a)), stroke: K.naranja, 'stroke-width': 3, opacity: 0 }, svg),
          res: s('rect', { x: x - 4, width: 8, y: Math.min(zf, zf - 5 * 100 * (qRRB(a) - q)), height: Math.abs(5 * 100 * (qRRB(a) - q)), fill: K.naranja, opacity: 0 }, svg),
          c: D.punto(svg, x, S.yA(q), { r: 4.5 })
        };
      });
      S.p.forEach(function (p) { p.c.setAttribute('opacity', 0); });
      S.estado = function (u, conBanda) {
        S.p.forEach(function (p) {
          var y = L(S.yA(p.q), S.yB(vRR(p.q)), u), yb = L(S.yA(p.q - 0.03), S.yB(vRR(p.q - 0.03)), u);
          p.c.setAttribute('cy', y);
          p.banda.setAttribute('y1', y); p.banda.setAttribute('y2', yb); p.banda.setAttribute('opacity', 0.75 * conBanda);
        });
        D.ver(S.ticA, 1 - u); D.ver(S.labA, 1 - u); D.ver(S.ticB, u); D.ver(S.labB, u); D.ver(S.ley, conBanda);
      };
      S.estado(0, 0); D.ver(S.ley, 0);
      // la franja de arriba: la ecuación de cada paso, una a la vez
      var FR = [
        null,
        ['Q_3 = 1 − exp[−(x/x\')^n]', 'x\': el tamaño por el que pasa el 63,2 %.   n: entre mayor, más angosta la distribución.'],
        ['ln ln(1/R) = n ln x − n ln x\'', 'con R = 1 − Q_3, la fracción que queda retenida'],
        ['pendiente n = 1,148   ·   corte −n ln x\' = 0,932   ·   r^2 = 0,998', 'en el cero, ln x\' = −0,932/1,148 = −0,812, y x\' = e^{−0,812} = 0,444 mm'],
        ['error medio en la curva: 1,3 puntos de pasante', 'la raíz del promedio de los cuadrados de las once distancias'],
        ['x_{50,3} = 0,444 × 0,693^{0,871} = 0,323 mm   ·   x_{80,3} = 0,444 × 1,609^{0,871} = 0,672 mm', 'interpolados entre dos tamices daban 0,339 y 0,696 mm']
      ];
      S.fr = FR.map(function (f) {
        if (!f) return null;
        var g = grupo(svg);
        D.t(g, 16, 28, f[0], { tam: 14.5, peso: 650, color: K.tinta });
        D.t(g, 16, 52, f[1], { tam: 12.5, color: K.tinta2 });
        return g;
      });
      S.franjaArriba = function (k, u) { S.fr.forEach(function (g, i) { if (g) D.ver(g, i === k ? u : i === k - 1 ? 1 - u : 0); }); };
      return S;
    },
    pasos: [
      { texto: 'Un tamizado da once puntos, no una curva: cada uno es un tamiz y la fracción de la masa que pasa por su abertura, $Q_3$, sobre un eje de tamaños logarítmico. Bajo cada punto, una banda de 3 puntos de pasante; en esta escala, todas miden lo mismo.', dur: 1.6, ir: function (S, t) {
        S.p.forEach(function (p, i) { D.ver(p.c, T(t, 0.04 * i, 0.04 * i + 0.4)); });
        S.estado(0, T(t, 0.5, 1));
      } },
      { texto: 'El modelo de Rosin-Rammler tiene dos parámetros. $x\'$ es el tamaño por el que pasa el 63,2 %, porque en $x = x\'$ el exponente vale 1 y $Q_3 = 1 - e^{-1}$; $n$ dice qué tan angosta es la distribución. ¿Cómo se sacan de once puntos?', dur: 1.6, ir: function (S, t) { S.franjaArriba(1, T(t, 0, 0.5)); D.ver(S.l63, T(t, 0.4, 1)); } },
      { texto: 'Con $R = 1 - Q_3$, dos logaritmos vuelven el modelo una recta, $\\ln\\ln(1/R) = n\\ln x - n\\ln x\'$, y los puntos quedan casi en línea. Las bandas ya no miden lo mismo: la del punto de 99,8 % se estira unas siete veces más que la del medio, y la del tamiz más fino, unas cuatro.', dur: 2.4, ir: function (S, t) {
        S.franjaArriba(2, T(t, 0, 0.3)); D.ver(S.l63, 1 - T(t, 0, 0.2));
        S.estado(T(t, 0.1, 0.85), 1); D.ver(S.cero, T(t, 0.8, 1));
      } },
      { texto: 'La recta de mínimos cuadrados le da el mismo peso a cada punto, estirado o no. Su pendiente es $n$ = 1,148, y su corte, $-n\\ln x\'$ = 0,932, con $r^2$ = 0,998. Cruza el cero donde $R = 1/e$, es decir, en $x = x\'$: $\\ln x\'$ = −0,812 y $x\'$ = 0,444 mm.', dur: 2, ir: function (S, t) {
        S.franjaArriba(3, T(t, 0, 0.3)); S.recta.dibujar(T(t, 0.1, 0.6)); D.ver(S.xp, T(t, 0.6, 1));
      } },
      { texto: 'De vuelta en la curva, el modelo con $n$ = 1,148 y $x\'$ = 0,444 mm. Cada punto queda a su distancia del modelo, que la franja de abajo amplía, y la raíz del promedio de sus cuadrados es el error medio: 1,3 puntos. Ese número, y no el $r^2$, es el que se compara entre modelos.', dur: 2.4, ir: function (S, t) {
        var u = 1 - T(t, 0, 0.45);
        S.franjaArriba(4, T(t, 0.6, 1));
        S.estado(u, 1 - T(t, 0, 0.3)); S.recta.setAttribute('opacity', u); D.ver(S.xp, u); D.ver(S.cero, u);
        S.modelo.dibujar(T(t, 0.4, 0.8));
        S.p.forEach(function (p) { p.dif.setAttribute('opacity', T(t, 0.75, 1)); p.res.setAttribute('opacity', T(t, 0.75, 1)); });
        D.ver(S.franja, T(t, 0.7, 1));
      } },
      { texto: 'Con el modelo se lee cualquier tamaño, $x = x\'\\,[\\ln(1/R)]^{1/n}$: $x_{50,3}$ = 0,323 mm y $x_{80,3}$ = 0,672 mm. Interpolando entre dos tamices daban 0,339 y 0,696 mm.', dur: 1.8, ir: function (S, t) {
        S.franjaArriba(5, T(t, 0, 0.4));
        S.p.forEach(function (p) { p.dif.setAttribute('opacity', 1 - T(t, 0, 0.3)); });
        D.ver(S.lect, T(t, 0.3, 1));
      } }
    ]
  });

  /* Reto: x50,3 interpolado entre dos tamices, los tamaños de un ajuste de Rosin-Rammler y los parámetros de los
     otros dos modelos a partir de sus rectas. */

  /* ================= 5.4 Diámetros medios y área específica ================= */

  /* Las tres medias de la ecuación de las medias sobre las fracciones del caso, primero con el fondo por fuera y
     después con el fondo en una clase de 0 a 0,063 mm, a 0,0315 mm, como en el ejemplo del área específica. */
  ZB.animacion('medios', {
    vista: [0, 0, 640, 290],
    alt: 'Las fracciones en masa de las once clases del caso como barras sobre el tamaño en escala logarítmica, con el fondo, 11,0 %, en un recuadro discontinuo. Con el fondo por fuera, el diámetro de masa queda en 0,491 mm, el de Sauter en 0,272 mm y el de volumen en 0,169 mm. Con el fondo en una clase de 0 a 0,063 mm, a 0,0315 mm, el de masa baja apenas a 0,440 mm, el de Sauter cae a 0,148 mm y el de volumen a 0,065 mm.',
    montar: function (svg) {
      var S = {}, X = eje(60, 550, 0.02, 2.8), y0 = 96, h = 140, base = y0 + h;
      var Yw = function (w) { return base - w / 0.16 * h; };
      [[0.063, '0,063'], [0.125, '0,125'], [0.25, '0,25'], [0.5, '0,5'], [1, '1'], [2, '2']].forEach(function (p) {
        s('line', { x1: X(p[0]), x2: X(p[0]), y1: y0, y2: base, stroke: K.rejilla, 'stroke-width': 1 }, svg);
        D.t(svg, X(p[0]), base + 16, p[1], { tam: 11.5, ancla: 'middle', color: K.tinta2 });
      });
      [0, 0.05, 0.1, 0.15].forEach(function (v) { s('line', { x1: 60, x2: 610, y1: Yw(v), y2: Yw(v), stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, 54, Yw(v) + 4, n(v, 2), { tam: 11.5, ancla: 'end', color: K.tinta2 }); });
      D.t(svg, 610, base + 38, 'tamaño, x (mm)', { tam: 12, peso: 600, ancla: 'end' });
      D.t(svg, 22, y0 - 8, 'w_i', { tam: 12, peso: 600 });
      S.barras = grupo(svg);
      AB.forEach(function (a, i) { s('rect', { x: X(a) + 1, y: Yw(W[i]), width: X(ARRIBA[i]) - X(a) - 2, height: base - Yw(W[i]), fill: SO.medio, stroke: SO.oscuro, 'stroke-width': 1 }, S.barras); });
      // el fondo: sin límite de abajo; en el último paso, una clase de 0 a 0,063 mm
      S.fondoV = grupo(svg);
      s('rect', { x: X(0.02) + 1, y: Yw(WF), width: X(0.063) - X(0.02) - 2, height: base - Yw(WF), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.4, 'stroke-dasharray': '5 4' }, S.fondoV);
      D.t(S.fondoV, (X(0.02) + X(0.063)) / 2, Yw(WF) + 34, 'fondo', { tam: 12, peso: 600, ancla: 'middle', color: K.tinta2 });
      D.t(S.fondoV, (X(0.02) + X(0.063)) / 2, Yw(WF) + 50, '11,0 %', { tam: 12, ancla: 'middle', color: K.tinta2 });
      S.fondoL = grupo(svg);
      s('rect', { x: X(0.02) + 1, y: Yw(WF), width: X(0.063) - X(0.02) - 2, height: base - Yw(WF), fill: SO.relleno, stroke: SO.oscuro, 'stroke-width': 1 }, S.fondoL);
      D.t(S.fondoL, (X(0.02) + X(0.063)) / 2, Yw(WF) + 34, 'a 0,0315', { tam: 12, peso: 600, ancla: 'middle' });
      D.t(S.fondoL, (X(0.02) + X(0.063)) / 2, Yw(WF) + 50, 'mm', { tam: 12, ancla: 'middle' });
      s('path', { d: 'M60 ' + y0 + 'V' + base + 'H610', fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      // las tres medias: masa arriba, Sauter en medio, volumen abajo; cada rótulo al lado de su línea
      var M = [['w', 'masa', 44, K.tinta, 'start'], ['sv', 'Sauter', 62, K.azul, 'end'], ['V', 'volumen', 80, K.naranja, 'end']];
      S.m = M.map(function (p) {
        var g = grupo(svg), fan = grupo(svg);
        var linea = s('line', { y1: p[2] + 6, y2: base, stroke: p[3], 'stroke-width': 2.2 }, g);
        var lab = D.t(g, 0, p[2], '', { tam: 12.5, peso: 700, ancla: p[4], color: p[3], halo: true });
        s('line', { x1: X(MEDIAS.fuera[p[0]]), x2: X(MEDIAS.fuera[p[0]]), y1: 88, y2: base, stroke: p[3], 'stroke-width': 1.2, 'stroke-dasharray': '3 4' }, fan);
        return {
          g: g, fan: fan,
          poner: function (v) {
            var x = X(v);
            linea.setAttribute('x1', x); linea.setAttribute('x2', x);
            lab.setAttribute('x', p[4] === 'start' ? x + 5 : x - 5);
            D.ponerTexto(lab, p[1] + ': ' + n(v, 3) + ' mm');
          }
        };
      });
      S.m.forEach(function (m, i) { m.poner(MEDIAS.fuera[M[i][0]]); });
      S.M = M;
      return S;
    },
    pasos: [
      { texto: 'Las fracciones en masa del caso, clase por clase, con el tamaño en escala logarítmica. El fondo, 11,0 %, no tiene límite de abajo: por ahora se deja por fuera, y su masa se reparte entre las demás clases.', dur: 1.6, ir: function (S, t) { D.ver(S.barras, T(t, 0, 0.6)); D.ver(S.fondoV, T(t, 0.4, 1)); } },
      { texto: 'El diámetro de masa, $\\sum w_i \\bar x_i$: 0,491 mm. Cada clase pesa por su masa, y las gruesas mandan.', dur: 1.4, ir: function (S, t) { D.ver(S.m[0].g, t); } },
      { texto: 'El de Sauter, $1/\\sum (w_i/\\bar x_i)$: 0,272 mm. Ahora cada clase pesa por el área que pone, y las finas pesan más.', dur: 1.4, ir: function (S, t) { D.ver(S.m[1].g, t); } },
      { texto: 'El de volumen, con $w_i/\\bar x_i^3$: 0,169 mm. Las clases finas pesan todavía más.', dur: 1.4, ir: function (S, t) { D.ver(S.m[2].g, t); } },
      { texto: 'Con el fondo en una clase de 0 a 0,063 mm, a 0,0315 mm: el de masa apenas baja, a 0,440 mm; el de Sauter cae a 0,148 mm y el de volumen, a 0,065 mm. Las líneas punteadas son las de antes.', dur: 2.4, ir: function (S, t) {
        var u = T(t, 0.15, 0.85);
        D.ver(S.fondoV, 1 - T(t, 0, 0.3)); D.ver(S.fondoL, T(t, 0, 0.3));
        S.m.forEach(function (m, i) {
          var k = S.M[i][0];
          m.fan.setAttribute('opacity', T(t, 0.1, 0.3));
          m.poner(Math.exp(L(Math.log(MEDIAS.fuera[k]), Math.log(MEDIAS.fondo[k]), u)));
        });
      } }
    ]
  });

  /* El área la ponen los finos: lo que pesa cada clase contra el área que pone, w_i/x̄_i, con el fondo a 0,0315 mm,
     y las tres sumas del ejemplo con su área específica (Φs = 0,70, 2711 kg/m³). */
  ZB.animacion('finos', {
    vista: [0, 0, 640, 300],
    alt: 'Arriba, para cada clase del caso y para el fondo, dos barras: el porcentaje de la masa y el porcentaje del área, w_i entre el tamaño de la clase, con el fondo a 0,0315 mm. Las clases del medio tienen la mayor parte de la masa; el fondo, con el 11 % de la masa, pone el 52 % del área. Abajo, tres barras con la suma de w_i entre el tamaño: con el fondo por fuera, 3,670 por mm y 11,6 m²/kg; con el fondo a 0,0315 mm, 6,752 por mm y 21,3 m²/kg; con el modelo de Rosin-Rammler, 17,35 por mm y 54,9 m²/kg, el 81 % en el fondo.',
    montar: function (svg) {
      var S = {}, x0 = 76, gw = 45, y0 = 34, h = 104, base = y0 + h;
      var Yp = function (p) { return base - p / 55 * h; };
      var S6 = SUM1 + WF / 0.0315;
      var ET = ['2,00', '1,40', '1,00', '0,710', '0,500', '0,355', '0,250', '0,180', '0,125', '0,090', '0,063'];
      var cat = AB.map(function (a, i) { return { et: ET[i], m: 100 * W[i], a: 100 * (W[i] / XM[i]) / S6 }; });
      cat.push({ et: 'fondo', m: 100 * WF, a: 100 * (WF / 0.0315) / S6 });
      [0, 25, 50].forEach(function (p) { s('line', { x1: x0, x2: x0 + 12 * gw, y1: Yp(p), y2: Yp(p), stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, x0 - 6, Yp(p) + 4, n(p, 0) + ' %', { tam: 11.5, ancla: 'end', color: K.tinta2 }); });
      s('path', { d: 'M' + x0 + ' ' + y0 + 'V' + base + 'H' + (x0 + 12 * gw), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      S.mas = grupo(svg); S.area = grupo(svg);
      cat.forEach(function (c, i) {
        var gx = x0 + i * gw;
        D.t(svg, gx + gw / 2, base + 15, c.et, { tam: 11, ancla: 'middle', color: K.tinta2 });
        s('rect', { x: gx + 7, y: Yp(c.m), width: 15, height: base - Yp(c.m), fill: SO.medio, stroke: SO.oscuro, 'stroke-width': 1 }, S.mas);
        s('rect', { x: gx + 23, y: Yp(c.a), width: 15, height: base - Yp(c.a), fill: i === 11 ? K.naranja : K.azul }, S.area);
      });
      var gF = x0 + 11 * gw;
      D.t(S.mas, gF + 22, Yp(cat[11].m) - 5, n(cat[11].m, 0) + ' %', { tam: 11.5, peso: 650, ancla: 'end', halo: true });
      D.t(S.area, gF + 31, Yp(cat[11].a) - 5, n(cat[11].a, 0) + ' %', { tam: 11.5, peso: 700, ancla: 'middle', color: K.naranja, halo: true });
      // la leyenda
      s('rect', { x: 220, y: 12, width: 12, height: 12, fill: SO.medio, stroke: SO.oscuro, 'stroke-width': 1 }, svg);
      D.t(svg, 238, 22, 'masa', { tam: 12 });
      S.leyA = grupo(svg);
      s('rect', { x: 290, y: 12, width: 12, height: 12, fill: K.azul }, S.leyA);
      D.t(S.leyA, 308, 22, 'área que pone', { tam: 12 });
      s('rect', { x: 410, y: 12, width: 12, height: 12, fill: K.naranja }, S.leyA);
      D.t(S.leyA, 428, 22, 'área del fondo', { tam: 12 });
      // abajo: las tres sumas
      var xs = 210, k = 12, filas = [
        ['fondo por fuera', [[SUM1 / (1 - WF), K.azul]], 'a'],
        ['fondo a 0,0315 mm', [[SUM1, K.azul], [WF / 0.0315, K.naranja]], 'b'],
        ['fondo con el modelo', [[SUM1, K.azul], [WF * 128.3, K.naranja]], 'c']
      ];
      var AW = { a: 11.6, b: 21.3, c: 54.9 }, SUMAS = { a: 3.670, b: 6.752, c: 17.35 };
      S.filas = filas.map(function (f, j) {
        var y = 196 + 32 * j, g = grupo(svg), x = xs;
        D.t(g, xs - 8, y + 12, f[0], { tam: 12, peso: 600, ancla: 'end' });
        f[1].forEach(function (seg) { s('rect', { x: x, y: y, width: seg[0] * k, height: 16, fill: seg[1] }, g); x += seg[0] * k; });
        D.t(g, x + 7, y + 12, n(SUMAS[f[2]], f[2] === 'c' ? 2 : 3) + ' mm^{−1} · ' + n(AW[f[2]], 1) + ' m^2/kg', { tam: 12, peso: 650 });
        return g;
      });
      D.t(svg, xs, 184, 'Las tres maneras de tratar el fondo', { tam: 12, peso: 700 });
      void SUMAS;
      return S;
    },
    pasos: [
      { texto: 'Cuánto pesa cada clase del caso: la mayor parte de la masa está entre 0,25 y 1 mm, y el fondo tiene el 11 %.', dur: 1.4, ir: function (S, t) { D.ver(S.mas, t); } },
      { texto: 'Cuánta área pone cada clase, $w_i/\\bar x_i$, con el fondo a 0,0315 mm: las clases finas ponen más que las gruesas, y el fondo, con el 11 % de la masa, pone el 52 % del área.', dur: 1.8, ir: function (S, t) { D.ver(S.area, T(t, 0, 0.7)); D.ver(S.leyA, T(t, 0, 0.5)); } },
      { texto: 'Con el fondo por fuera, los tamices suman 3,670 mm⁻¹, y con $\\Phi_s$ = 0,70 y 2711 kg/m³ el área específica es de 11,6 m²/kg.', dur: 1.4, ir: function (S, t) { D.ver(S.filas[0], t); } },
      { texto: 'Con el fondo en su media aritmética, 0,0315 mm, la suma sube a 6,752 mm⁻¹ y el área, a 21,3 m²/kg.', dur: 1.4, ir: function (S, t) { D.ver(S.filas[1], t); } },
      { texto: 'Con el modelo de Rosin-Rammler, los finos valen como si midieran 7,8 μm: 17,35 mm⁻¹ y 54,9 m²/kg, con el 81 % del área en el fondo. Los finos que el tamizado no ve deciden el área.', dur: 1.8, ir: function (S, t) { D.ver(S.filas[2], t); } }
    ]
  });

  /* Reto: las tres medias de un polvo de tres clases, el área específica a partir de la suma y las maneras de tratar
     el fondo. */

  /* ================= 5.5 Densidades, porosidad y fluidez ================= */

  /* Del trozo de calcita al lecho: la densidad verdadera, la de partícula con sus poros y la a granel con el aire
     entre los granos, suelta y asentada, y la primera estimación de la porosidad. */
  ZB.animacion('densidades', {
    vista: [0, 0, 640, 300],
    alt: 'Tres dibujos. Un trozo de calcita sin poros, con su densidad verdadera de 2711 kg/m³. Un grano con poros internos, con la densidad de partícula igual a la verdadera por uno menos la fracción de poros; los de la caliza del caso no tienen poros. Una probeta con granos vertidos suavemente y aire entre ellos, la porosidad del lecho; golpeada, los granos se asientan y el nivel baja. Al final, con la porosidad de 0,4 de la primera estimación, un lecho de calcita tendría 1627 kg/m³.',
    montar: function (svg) {
      var S = {};
      // el trozo de calcita
      S.trozo = grupo(svg);
      s('path', { d: 'M40 92L66 72L150 76L162 104L150 168L58 172L36 140Z', fill: SO.medio, stroke: SO.oscuro, 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, S.trozo);
      s('path', { d: 'M66 72L84 98L150 76M84 98L58 172', fill: 'none', stroke: SO.oscuro, 'stroke-width': 1, opacity: 0.6 }, S.trozo);
      D.t(S.trozo, 100, 204, 'calcita sin poros', { tam: 12.5, peso: 600, ancla: 'middle' });
      D.t(S.trozo, 100, 224, 'ρ_t = 2711 kg/m^3', { tam: 12.5, peso: 700, ancla: 'middle' });
      // un grano con poros internos y su contorno
      S.grano = grupo(svg);
      var gx = 268, gy = 122;
      s('path', { d: 'M' + BASE.map(function (p) { return (gx + 0.95 * p[0]).toFixed(1) + ' ' + (gy + 0.95 * p[1]).toFixed(1); }).join('L') + 'Z', fill: SO.medio, stroke: SO.oscuro, 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, S.grano);
      [[-28, -14, 9, 6], [10, -18, 7, 5], [30, 10, 8, 6], [-10, 16, 10, 7], [-40, 12, 5, 4], [40, -14, 5, 4]].forEach(function (p) {
        s('ellipse', { cx: gx + p[0], cy: gy + p[1], rx: p[2], ry: p[3], fill: K.blanco, stroke: SO.oscuro, 'stroke-width': 1 }, S.grano);
      });
      D.t(S.grano, gx, 204, 'grano con poros, χ', { tam: 12.5, peso: 600, ancla: 'middle' });
      D.t(S.grano, gx, 224, 'ρ_p = ρ_t (1 − χ)', { tam: 12.5, peso: 700, ancla: 'middle' });
      S.caso = oculto(svg, gx, 244, 'en el caso, χ = 0', { tam: 12, ancla: 'middle', color: K.tinta2 });
      // la probeta con los granos: suelto, cada fila apoyada sobre la de abajo a un diámetro; golpeado, las filas se
      // meten en los huecos de la de abajo (0,866 diámetros)
      var px0 = 440, px1 = 580, fondo = 186, ym = 50, dg = 15.5;
      S.lecho = grupo(svg);
      s('path', { d: 'M' + px0 + ' ' + ym + 'V' + fondo + 'H' + px1 + 'V' + ym, fill: K.blanco, stroke: K.tinta, 'stroke-width': 2 }, S.lecho);
      for (var j = 0; j < 6; j++) s('line', { x1: px1, x2: px1 + 8, y1: fondo - 22 * j - 18, y2: fondo - 22 * j - 18, stroke: K.tinta2, 'stroke-width': 1 }, S.lecho);
      var az = 7;
      function rnd() { az = (az * 9301 + 49297) % 233280; return az / 233280; }
      S.granos = [];
      for (var fila = 0; fila < 7; fila++) {
        for (var col = 0; col < (fila % 2 ? 7 : 8); col++) {
          var r = 6.6 + 1.1 * rnd(), x = px0 + 15.75 + col * dg + (fila % 2 ? dg / 2 : 0);
          var yl = fondo - 7.75 - fila * dg, yt = fondo - 7.75 - fila * 0.866 * dg;
          S.granos.push({ c: s('circle', { cx: x, cy: yl, r: r, fill: SO.medio, stroke: SO.oscuro, 'stroke-width': 1 }, S.lecho), yl: yl, yt: yt });
        }
      }
      S.nivel = s('line', { x1: px0 - 14, x2: px1 + 14, stroke: K.azul, 'stroke-width': 2, 'stroke-dasharray': '6 4' }, S.lecho);
      S.ponerNivel = function (y) { S.nivel.setAttribute('y1', y); S.nivel.setAttribute('y2', y); };
      S.yS = fondo - 7.75 - 6 * dg - 9; S.yA = fondo - 7.75 - 6 * 0.866 * dg - 9;
      S.ponerNivel(S.yS);
      D.t(S.lecho, 510, 204, 'el lecho: aire entre los granos, ε', { tam: 12.5, peso: 600, ancla: 'middle' });
      D.t(S.lecho, 510, 224, 'ρ_b = ρ_p (1 − ε)', { tam: 12.5, peso: 700, ancla: 'middle' });
      S.lSuelto = oculto(svg, px0 - 18, S.yS + 4, 'suelto', { tam: 12, peso: 600, ancla: 'end', color: K.azul });
      S.lAsent = oculto(svg, px0 - 18, S.yA + 4, 'golpeado', { tam: 12, peso: 600, ancla: 'end', color: K.azul });
      S.est = grupo(svg);
      D.t(S.est, 510, 250, 'primera estimación, ε = 0,4:', { tam: 12.5, peso: 600, ancla: 'middle', color: K.olivaOsc });
      D.t(S.est, 510, 270, 'ρ_b = 0,6 × 2711 = 1627 kg/m^3', { tam: 12.5, peso: 700, ancla: 'middle', color: K.olivaOsc });
      return S;
    },
    pasos: [
      { texto: 'Un trozo de calcita sin poros: su masa entre su volumen es la densidad verdadera, $\\rho_t$ = 2711 kg/m³.', dur: 1.4, ir: function (S, t) { D.ver(S.trozo, t); } },
      { texto: 'Un grano con poros internos ocupa más volumen con la misma masa: su densidad de partícula es $\\rho_p = \\rho_t(1 - \\chi)$, con $\\chi$ la fracción de poros. Los granos de la caliza del caso no tienen poros: $\\chi$ = 0 y $\\rho_p$ = 2711 kg/m³.', dur: 2, ir: function (S, t) { D.ver(S.grano, T(t, 0, 0.6)); D.ver(S.caso, T(t, 0.6, 1)); } },
      { texto: 'Muchos granos vertidos suavemente en un recipiente dejan aire entre ellos, la porosidad $\\varepsilon$ del lecho: la densidad a granel es $\\rho_b = \\rho_p(1 - \\varepsilon)$.', dur: 1.8, ir: function (S, t) { D.ver(S.lecho, T(t, 0, 0.6)); D.ver(S.lSuelto, T(t, 0.6, 1)); } },
      { texto: 'Golpeado, el lecho se asienta: baja el aire entre los granos y sube la densidad a granel, de 1 a 10 % en partículas regulares y no cohesivas, y hasta 40 % cuando la distribución es ancha.', dur: 2.4, ir: function (S, t) {
        var u = T(t, 0, 0.85);
        S.granos.forEach(function (g) { g.c.setAttribute('cy', L(g.yl, g.yt, u)); });
        S.ponerNivel(L(S.yS, S.yA, u)); D.ver(S.lSuelto, 1 - T(t, 0, 0.3)); D.ver(S.lAsent, T(t, 0.8, 1));
      } },
      { texto: 'Con la porosidad de 0,4 que se toma como primera estimación, un lecho de calcita tendría $\\rho_b$ = 0,6 × 2711 = 1627 kg/m³.', dur: 1.4, ir: function (S, t) { D.ver(S.est, t); } }
    ]
  });

  /* Las escalas de la tabla de las escalas puestas sobre un mismo eje del índice de Carr, con la razón de Hausner
     pasada con I_C = 100(1 − 1/H), y la caliza del ejemplo de la probeta. */
  ZB.animacion('escalas', {
    vista: [0, 0, 640, 262],
    alt: 'Tres franjas sobre un mismo eje del índice de Carr, de 0 a 55 %. La escala de Carr: muy buena hasta 15, buena hasta 20, regular hasta 35, mala hasta 45 y muy mala. La de Koç para la razón de Hausner, con sus cortes de 1,2 y 1,4 en 16,7 y 28,6 %: cohesión baja, media y alta. La de Hayes, con sus cortes de 1,1, 1,25 y 1,4 en 9,1, 20,0 y 28,6 %: flujo libre, medio, difícil y muy difícil. Una línea vertical marca la caliza del caso, índice de Carr de 19,3 % y razón de Hausner de 1,24: buena, media y medio.',
    montar: function (svg) {
      var S = {}, x0 = 150, w = 470, X = function (ic) { return x0 + ic / 55 * w; };
      function franja(y, clases, rot) {
        var g = grupo(svg);
        D.t(g, x0 - 10, y + 22, rot, { tam: 12.5, peso: 700, ancla: 'end' });
        clases.forEach(function (c, i) {
          s('rect', { x: X(c[0]), y: y, width: X(c[1]) - X(c[0]), height: 34, fill: i % 2 ? K.zona : K.papel, stroke: K.guia, 'stroke-width': 1 }, g);
          D.t(g, c[3] != null ? X(c[3]) : (X(c[0]) + X(c[1])) / 2, y + 22, c[2], { tam: 11.5, ancla: 'middle' });
        });
        return g;
      }
      // la caliza del caso, detrás de las franjas: la línea se ve entre una franja y otra, y una marca al pie de cada
      // franja dice dónde cae, sin pasar por encima de los nombres de las clases
      S.caso = grupo(svg);
      var xc = X(100 * (1500 - 1210) / 1500);
      camino(S.caso, [[xc, 36], [xc, 180]], { color: K.tinta, ancho: 2.4 });
      s('path', { d: 'M' + (xc - 6) + ' 30L' + (xc + 6) + ' 30L' + xc + ' 38Z', fill: K.tinta }, S.caso);
      D.t(S.caso, xc, 226, 'la caliza del caso: I_C = 19,3 %, H = 1,24', { tam: 12.5, peso: 700, ancla: 'middle', halo: true });
      // el eje del índice de Carr arriba y el de la razón de Hausner abajo
      [0, 10, 20, 30, 40, 50].forEach(function (v) { D.t(svg, X(v), 26, n(v, 0), { tam: 11.5, ancla: 'middle', color: K.tinta2 }); s('line', { x1: X(v), x2: X(v), y1: 31, y2: 36, stroke: K.tinta2, 'stroke-width': 1 }, svg); });
      D.t(svg, x0 - 10, 26, 'I_C (%)', { tam: 12, peso: 600, ancla: 'end' });
      S.carr = franja(40, [[0, 15, 'muy buena'], [15, 20, 'buena'], [20, 35, 'regular'], [35, 45, 'mala'], [45, 55, 'muy mala']], 'Carr');
      S.koc = franja(90, [[0, 100 / 6, 'baja'], [100 / 6, 200 / 7, 'media'], [200 / 7, 55, 'alta']], 'Hausner, Koç');
      S.hay = franja(140, [[0, 100 / 11, 'libre'], [100 / 11, 20, 'medio'], [20, 200 / 7, 'difícil'], [200 / 7, 55, 'muy difícil']], 'Hausner, Hayes');
      S.ejeH = grupo(svg);
      [1.1, 1.2, 1.25, 1.4, 1.6, 1.8, 2.0].forEach(function (hh) {
        var ic = 100 * (1 - 1 / hh), x = X(ic);
        s('line', { x1: x, x2: x, y1: 180, y2: 186, stroke: K.tinta2, 'stroke-width': 1 }, S.ejeH);
        D.t(S.ejeH, x, 200, n(hh, hh === 1.25 ? 2 : 1), { tam: 11.5, ancla: 'middle', color: K.tinta2 });
      });
      D.t(S.ejeH, x0 - 10, 200, 'H', { tam: 12, peso: 600, ancla: 'end', it: true });
      S.marcas = grupo(svg);
      [74, 124, 174].forEach(function (y) { s('path', { d: 'M' + (xc - 5) + ' ' + (y + 8) + 'L' + (xc + 5) + ' ' + (y + 8) + 'L' + xc + ' ' + y + 'Z', fill: K.tinta }, S.marcas); });
      return S;
    },
    pasos: [
      { texto: 'La escala de Carr, sobre el índice de Carr: fluidez muy buena por debajo de 15 %, buena hasta 20, regular hasta 35, mala hasta 45 y muy mala por encima.', dur: 1.6, ir: function (S, t) { D.ver(S.carr, t); } },
      { texto: 'La escala de Koç para la razón de Hausner, puesta en el mismo eje con $I_C = 100\\,(1 - 1/H)$: su corte de 1,2 cae en 16,7 %, en medio de la clase «buena» de Carr, y el de 1,4, en 28,6 %, en medio de la «regular».', dur: 2.2, ir: function (S, t) { D.ver(S.koc, T(t, 0, 0.6)); D.ver(S.ejeH, T(t, 0.3, 0.8)); } },
      { texto: 'La escala de Hayes corta en 1,1, 1,25 y 1,4, que son 9,1, 20,0 y 28,6 %: otras clases, con otros nombres y otros cortes.', dur: 1.8, ir: function (S, t) { D.ver(S.hay, t); } },
      { texto: 'La caliza del caso, $I_C$ = 19,3 % y $H$ = 1,24: fluidez buena, cerca de la regular, para Carr; cohesión media para Koç, y flujo medio, en el borde con el difícil, para Hayes. Las tres lecturas salen de la misma medición.', dur: 2, ir: function (S, t) { D.ver(S.caso, t); D.ver(S.marcas, t); } }
    ]
  });

  /* Reto: las densidades y los índices de una probeta, la densidad de partícula y la porosidad, y la densidad asentada
     que da una razón de Hausner. */

  /* ================= 5.6 Muestreo ================= */

  /* La fórmula de Gy en escala doble logarítmica: la masa mínima contra el tamaño de los fragmentos más gruesos, con
     pendiente 3 por debajo del tamaño de liberación y 2,5 por encima; duplicar el tamaño, la mitad del error y el
     margen de la práctica. */
  ZB.animacion('gy', {
    vista: [0, 0, 640, 300],
    alt: 'Gráfica doble logarítmica de la masa mínima de la muestra, relativa a la que pide el tamaño de liberación L, contra el tamaño de los fragmentos más gruesos, de L/4 a 16 L. Por debajo de L, una recta de pendiente 3; por encima, de pendiente 2,5, con la de 3 punteada como referencia. Al pasar de 4L a 8L, la masa crece 5,7 veces con el componente encerrado y 8 con el material liberado. Con la mitad del error, toda la curva sube cuatro veces. Al final, una franja de dos a tres veces el mínimo, lo que se toma en la práctica.',
    montar: function (svg) {
      var S = {}, x0 = 90, w = 480, y0 = 30, h = 210, base = y0 + h;
      var X = function (d) { return x0 + Math.log(d / 0.25) / Math.log(64) * w; };
      var Y = function (m) { return base - (Math.log10(m) + 2) / Math.log10(3e5) * h; };
      var dt = [[0.25, 'L/4'], [0.5, 'L/2'], [1, 'L'], [2, '2L'], [4, '4L'], [8, '8L'], [16, '16L']];
      dt.forEach(function (p) { s('line', { x1: X(p[0]), x2: X(p[0]), y1: y0, y2: base, stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, X(p[0]), base + 17, p[1], { tam: 11.5, ancla: 'middle', color: K.tinta2 }); });
      [0.01, 0.1, 1, 10, 100, 1000].forEach(function (m) { s('line', { x1: x0, x2: x0 + w, y1: Y(m), y2: Y(m), stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, x0 - 6, Y(m) + 4, n(m, m < 1 ? (m < 0.1 ? 2 : 1) : 0), { tam: 11.5, ancla: 'end', color: K.tinta2 }); });
      s('path', { d: 'M' + x0 + ' ' + y0 + 'V' + base + 'H' + (x0 + w), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      D.t(svg, x0 - 4, y0 - 12, 'M_s, relativa a la masa en d = L', { tam: 12, peso: 600 });
      D.t(svg, x0 + w, base + 38, 'd, tamaño de los fragmentos más gruesos', { tam: 12, peso: 600, ancla: 'end' });
      camino(svg, [[X(1), y0], [X(1), base]], { color: K.tinta2, ancho: 1.4, guion: '2 4' });
      var M = function (d, f) { return (f || 1) * (d <= 1 ? Math.pow(d, 3) : Math.pow(d, 2.5)); };
      function curva(d0, d1, f, exp) {
        var p = [];
        for (var k = 0; k <= 40; k++) { var d = d0 * Math.pow(d1 / d0, k / 40); p.push([X(d), Y(exp ? f * Math.pow(d, exp) : M(d, f))]); }
        return 'M' + p.map(function (q) { return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join('L');
      }
      // la franja de la práctica, de dos a tres veces el mínimo
      var pf = [], pr = [];
      for (var k = 0; k <= 40; k++) { var d = 0.25 * Math.pow(64, k / 40); pf.push(X(d).toFixed(1) + ' ' + Y(2 * M(d)).toFixed(1)); pr.unshift(X(d).toFixed(1) + ' ' + Y(3 * M(d)).toFixed(1)); }
      S.franja = s('path', { d: 'M' + pf.join('L') + 'L' + pr.join('L') + 'Z', fill: K.amarilloClaro, stroke: 'none', opacity: 0 }, svg);
      S.lib = D.trazo(svg, curva(0.25, 1, 1), { color: K.tinta, ancho: 2.6 });
      S.enc = D.trazo(svg, curva(1, 16, 1), { color: K.tinta, ancho: 2.6 });
      S.ref = D.trazo(svg, curva(1, 13, 1, 3), { color: K.guia, ancho: 1.8, guion: '6 5' });
      S.mitad = D.trazo(svg, curva(0.25, 14, 4), { color: K.azul, ancho: 2, guion: '7 5' });
      S.lLib = oculto(svg, X(0.7) + 6, 206, 'pendiente 3, l = 1', { tam: 12, peso: 650 });
      S.lEnc = oculto(svg, X(2.2) + 8, Y(M(2.2)) + 18, 'pendiente 2,5, l = √(L/d)', { tam: 12, peso: 650 });
      S.lL = oculto(svg, X(1) + 5, y0 + 14, 'L, tamaño de liberación', { tam: 12, color: K.tinta2 });
      // duplicar el tamaño: de 4L a 8L con el componente encerrado, y de L/4 a L/2 con el material liberado
      S.dup = grupo(svg);
      camino(S.dup, [[X(4), Y(M(4))], [X(8), Y(M(4))], [X(8), Y(M(8))]], { color: K.olivaOsc, ancho: 1.8 });
      D.punto(S.dup, X(4), Y(M(4)), { r: 4.5 }); D.punto(S.dup, X(8), Y(M(8)), { r: 4.5 });
      D.t(S.dup, X(8) + 7, (Y(M(4)) + Y(M(8))) / 2 + 10, '× 5,7', { tam: 13, peso: 700, color: K.olivaOsc, halo: true });
      camino(S.dup, [[X(0.25), Y(M(0.25))], [X(0.5), Y(M(0.25))], [X(0.5), Y(M(0.5))]], { color: K.olivaOsc, ancho: 1.8 });
      D.punto(S.dup, X(0.25), Y(M(0.25)), { r: 4.5 }); D.punto(S.dup, X(0.5), Y(M(0.5)), { r: 4.5 });
      D.t(S.dup, X(0.5) + 7, (Y(M(0.25)) + Y(M(0.5))) / 2 + 12, '× 8', { tam: 13, peso: 700, color: K.olivaOsc, halo: true });
      S.lMitad = oculto(svg, X(2) - 8, Y(4 * M(2)) - 11, 'σ/2: la masa × 4', { tam: 12.5, peso: 700, ancla: 'end', color: K.azul, halo: true });
      S.lPrac = grupo(svg);
      s('rect', { x: 98, y: 54, width: 14, height: 11, fill: K.amarilloClaro, stroke: K.olivaOsc, 'stroke-width': 1 }, S.lPrac);
      D.t(S.lPrac, 118, 64, 'de 2 a 3 veces el mínimo, en la práctica', { tam: 12, peso: 650, color: K.olivaOsc });
      return S;
    },
    pasos: [
      { texto: 'Con el material molido por debajo de su tamaño de liberación, $l$ = 1 y la masa mínima de Gy crece con $d^3$: en escala doble logarítmica, una recta de pendiente 3.', dur: 1.6, ir: function (S, t) { S.lib.dibujar(T(t, 0, 0.7)); D.ver(S.lLib, T(t, 0.5, 1)); D.ver(S.lL, T(t, 0.5, 1)); } },
      { texto: 'Por encima de $L$, el componente sigue encerrado en los fragmentos: $l = \\sqrt{L/d}$ baja con el tamaño, y la pendiente queda en 2,5. La punteada gris sería la de pendiente 3.', dur: 1.8, ir: function (S, t) { S.enc.dibujar(T(t, 0, 0.7)); S.ref.dibujar(T(t, 0.3, 0.8)); D.ver(S.lEnc, T(t, 0.5, 1)); } },
      { texto: 'Duplicar el tamaño de los fragmentos más gruesos pide 8 veces la masa con el material liberado, de $L/4$ a $L/2$, y $2^{2,5}$ = 5,7 veces mientras el componente está encerrado, de $4L$ a $8L$.', dur: 2, ir: function (S, t) { D.ver(S.dup, t); } },
      { texto: 'Pedir la mitad del error, $\\sigma/2$, sube toda la curva cuatro veces, porque la masa va con $1/\\sigma^2$.', dur: 1.6, ir: function (S, t) { S.mitad.dibujar(T(t, 0, 0.7)); D.ver(S.lMitad, T(t, 0.5, 1)); } },
      { texto: 'La fórmula da un mínimo: en la práctica, la muestra es de dos a tres veces esa masa, porque las divisiones posteriores y el análisis suman su propia varianza.', dur: 1.6, ir: function (S, t) { S.franja.setAttribute('opacity', T(t, 0, 0.6)); D.ver(S.lPrac, T(t, 0.4, 1)); } }
    ]
  });

  /* El divisor de rifles de la figura isométrica, visto desde arriba: doce canaletas de 25 mm que desaguan una sí y
     una no hacia la bandeja de adelante y hacia la de atrás; la muestra vertida a lo largo de toda la fila y las
     pasadas sucesivas. */
  ZB.animacion('divisor', {
    vista: [0, 0, 640, 290],
    alt: 'El divisor de rifles visto desde arriba: doce canaletas de 25 mm en fila, que desaguan una sí y una no hacia la bandeja de adelante, abajo, y hacia la de atrás, arriba. Un chorro recorre la fila de punta a punta y cada canaleta recibe una tajada de toda la corriente. Cada bandeja recibe seis tajadas, la mitad de los 2,4 kg: 1,2 kg. A la derecha, las pasadas: 2400, 1200, 600 y 300 g, la mitad cada vez.',
    montar: function (svg) {
      var S = {}, cx0 = 60, cw = 25, y0 = 112, ch = 52;
      // las bandejas
      s('rect', { x: 40, y: 40, width: 340, height: 40, rx: 4, fill: K.zona, stroke: K.tinta2, 'stroke-width': 1.4 }, svg);
      D.t(svg, 210, 34, 'bandeja de atrás', { tam: 12.5, peso: 600, ancla: 'middle', color: K.azul });
      s('rect', { x: 40, y: 196, width: 340, height: 40, rx: 4, fill: K.zona, stroke: K.tinta2, 'stroke-width': 1.4 }, svg);
      D.t(svg, 210, 254, 'bandeja de adelante', { tam: 12.5, peso: 600, ancla: 'middle', color: K.olivaOsc });
      // la tolva y la fila de canaletas
      s('rect', { x: cx0 - 6, y: y0 - 6, width: 12 * cw + 12, height: ch + 12, fill: 'none', stroke: K.tinta, 'stroke-width': 2 }, svg);
      S.can = [];
      for (var i = 0; i < 12; i++) {
        var x = cx0 + i * cw, atras = i % 2 === 0;
        s('rect', { x: x, y: y0, width: cw, height: ch, fill: atras ? K.borde : K.papel, stroke: K.tinta2, 'stroke-width': 1 }, svg);
        D.flecha(svg, x + cw / 2, atras ? y0 + ch - 10 : y0 + 10, x + cw / 2, atras ? y0 + 10 : y0 + ch - 10, { color: atras ? K.azul : K.olivaOsc, ancho: 1.8, punta: 7 });
        S.can.push({ x: x + cw / 2, atras: atras });
      }
      D.t(svg, 376, y0 + ch / 2 + 4, '12 × 25 mm', { tam: 12, color: K.tinta2 });
      // el chorro y las tajadas que caen a cada bandeja
      S.chorro = s('circle', { cx: cx0, cy: y0 + ch / 2, r: 9, fill: SO.medio, stroke: SO.oscuro, 'stroke-width': 1.4, opacity: 0 }, svg);
      S.taj = S.can.map(function (c) {
        var g = grupo(svg);
        for (var k = 0; k < 5; k++) s('circle', { cx: c.x - 8 + 4 * k, cy: (c.atras ? 60 : 216) + (k % 2 ? 5 : -5), r: 3.2, fill: SO.medio, stroke: SO.oscuro, 'stroke-width': 0.8 }, g);
        return g;
      });
      S.mAtras = oculto(svg, 388, 65, '1,2 kg', { tam: 13, peso: 700 });
      S.mAdel = oculto(svg, 388, 221, '1,2 kg', { tam: 13, peso: 700 });
      // las pasadas
      D.t(svg, 470, 34, 'Pasadas', { tam: 12.5, peso: 700 });
      S.pas = [[0, '2400 g, la muestra'], [1, '1200 g, la mitad'], [2, '600 g, un cuarto'], [3, '300 g, un octavo']].map(function (p) {
        var g = grupo(svg), y = 62 + 40 * p[0];
        s('rect', { x: 470, y: y - 13, width: 120 / Math.pow(2, p[0]), height: 16, fill: SO.medio, stroke: SO.oscuro, 'stroke-width': 1 }, g);
        D.t(g, 470, y + 19, (p[0] ? 'j = ' + p[0] + ': ' : '') + p[1], { tam: 12, color: K.tinta });
        return g;
      });
      S.lj = oculto(svg, 470, 232, 'tras j pasadas: 1/2^j', { tam: 12.5, peso: 700, color: K.olivaOsc });
      return S;
    },
    pasos: [
      { texto: 'El divisor visto desde arriba: doce canaletas de 25 mm en fila. Las grises desaguan hacia la bandeja de atrás y las blancas hacia la de adelante, una sí y una no: seis y seis.', dur: 1.6, ir: function (S, t) { D.ver(S.pas[0], T(t, 0.4, 1)); } },
      { texto: 'La muestra, 2,4 kg, se vierte pareja a lo largo de toda la fila. Cada canaleta recibe una tajada de toda la corriente y la manda a su bandeja.', dur: 2.6, ir: function (S, t) {
        var u = T(t, 0.05, 0.9);
        S.chorro.setAttribute('opacity', t > 0.02 && t < 0.97 ? 1 : 0);
        S.chorro.setAttribute('cx', L(60, 60 + 12 * 25, u));
        S.taj.forEach(function (g, i) { D.ver(g, T(u, (i + 0.5) / 12, (i + 1) / 12)); });
      } },
      { texto: 'Cada bandeja recibe seis tajadas, la mitad de la muestra: 1,2 kg en cada una, con la misma mezcla de tamaños.', dur: 1.4, ir: function (S, t) { D.ver(S.mAtras, t); D.ver(S.mAdel, t); D.ver(S.pas[1], t); } },
      { texto: 'Una de las mitades vuelve a pasar: queda un cuarto, 600 g. Después de $j$ pasadas queda $1/2^j$ de la muestra: con tres, 300 g.', dur: 2, ir: function (S, t) { D.ver(S.pas[2], T(t, 0, 0.4)); D.ver(S.pas[3], T(t, 0.35, 0.75)); D.ver(S.lj, T(t, 0.7, 1)); } }
    ]
  });

  /* Reto: cuánto crece la masa de Gy con el tamaño y con el error, la masa mínima con los cuatro factores y las
     pasadas por un divisor de rifles. */
})();

/* ===== Del capítulo 6, «Tamizado y análisis granulométrico»: libro/figuras/tamizado-y-analisis-granulometrico/actividades.js ===== */
/* Las animaciones y los retos del capítulo 6, «Tamizado y análisis granulométrico». Se escriben aquí directo
   (en bombas pasan por el taller interactivo/). Usan el motor de figuras/comun/actividades.js y las piezas de
   figuras/comun/dibujo.js; los colores salen de la paleta del libro (ZB.dib.col y PALETA), nunca a mano.
   Los números salen del texto del capítulo y del caso del café aglomerado (caso.json, que escribe
   herramientas/tamizado-cafe.py): la serie de la tabla de los nueve tamices, la pila del ejemplo de la carga,
   la abertura de la tela de 1 mm de la figura de la abertura, los flujos de la figura del circuito y de los
   ejemplos del piso fino, las fracciones de la tabla del reparto, la partición de la tabla por clases y la
   curva del modelo, el lecho de la sección de la capacidad, los factores del ejemplo del área y las tres
   corrientes de la seleccionadora del ejemplo de la naranja. Cada animación dibuja el equipo con todas sus
   corrientes, con los mismos nombres y números que la figura o el esquema de su ejemplo. Un color hace un solo
   trabajo, como en las figuras del capítulo: el piso de 2,00 mm en azul (la primera serie de las gráficas), el
   de 0,500 mm en oliva (la segunda), lo que se pierde o se rechaza por malo en naranja (la tercera) y el café
   con su material de sólido. */
(function () {
  'use strict';
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, T = ZB.tramo, L = ZB.lerp;
  var PA = window.PALETA, SO = PA.materiales.solido;
  var AZ = K.serie[0], OL = K.serie[1], NA = K.serie[2];

  /* ---------- El caso ---------- */
  // Los nueve tamices de la tabla del capítulo: abertura (mm), alambre preferido (mm), carga recomendada y
  // retenido máximo de la ISO 2591-1 (cm³), y la fracción del producto que queda en cada uno (%), como en el
  // esquema del ejemplo de la carga.
  var SERIE = [
    { a: 4.00, d: 1.40, dmin: 1.2, dmax: 1.7, c: 350, m: 175, w: 0 },
    { a: 2.80, d: 1.12, dmin: 0.95, dmax: 1.30, c: 240, m: 120, w: 0 },
    { a: 2.00, d: 0.90, dmin: 0.77, dmax: 1.04, c: 200, m: 100, w: 0 },
    { a: 1.40, d: 0.71, dmin: 0.60, dmax: 0.82, c: 160, m: 80, w: 15.3 },
    { a: 1.00, d: 0.56, dmin: 0.48, dmax: 0.64, c: 140, m: 70, w: 27.7 },
    { a: 0.710, d: 0.45, dmin: 0.38, dmax: 0.52, c: 120, m: 60, w: 28.2 },
    { a: 0.500, d: 0.315, dmin: 0.27, dmax: 0.36, c: 100, m: 50, w: 20.6 },
    { a: 0.355, d: 0.224, dmin: 0.19, dmax: 0.26, c: 80, m: 40, w: 7.6 },
    { a: 0.250, d: 0.16, dmin: 0.13, dmax: 0.19, c: 70, m: 35, w: 0.6 }
  ];
  var RHO_B = 0.470;                 // g/cm³
  var R203 = Math.pow(10, 3 / 20), R403 = Math.pow(10, 3 / 40);
  function foa(a, d) { return Math.pow(a / (a + d), 2); }
  function ab(a) { return a < 1 ? n(a, 3) : n(a, 2); }          // 0,710 mm y 1,00 mm, como en la tabla

  /* ---------- Piezas del capítulo ---------- */
  function grupo(padre, op) { return s('g', { opacity: op == null ? 0 : op }, padre); }
  function oculto(padre, x, y, str, o) { var e = D.t(padre, x, y, str, o); e.setAttribute('opacity', 0); return e; }
  function camino(padre, pts, o) {
    o = o || {};
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + (+p[0]).toFixed(1) + ' ' + (+p[1]).toFixed(1); }).join('');
    return s('path', { d: d, fill: 'none', stroke: o.color || K.tinta, 'stroke-width': o.ancho || 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'stroke-dasharray': o.guion || 'none' }, padre);
  }
  // Una línea de proceso con su flecha al final.
  function tubo(padre, pts, o) {
    o = o || {};
    var g = s('g', {}, padre), ult = pts[pts.length - 1], pen = pts[pts.length - 2];
    camino(g, pts, o);
    D.flecha(g, pen[0], pen[1], ult[0], ult[1], { color: o.color || K.tinta, ancho: o.ancho || 2, punta: 8 });
    return g;
  }
  function caja(padre, x, y, w, h, o) {
    o = o || {};
    return s('rect', { x: x, y: y, width: w, height: h, rx: o.rx == null ? 3 : o.rx, fill: o.fill || K.blanco, stroke: o.borde || K.tinta, 'stroke-width': o.ancho || 1.4, 'stroke-dasharray': o.guion || 'none' }, padre);
  }
  // Una barra horizontal que crece: largo(f) con f de 0 a 1.
  function barra(padre, x, y, w, h, color, o) {
    o = o || {};
    var r = s('rect', { x: x, y: y, width: 0, height: h, fill: color, stroke: o.borde || 'none', 'stroke-width': o.borde ? 1 : 0, opacity: o.op == null ? 1 : o.op }, padre);
    r.largo = function (f) { r.setAttribute('width', Math.max(0, w * Math.max(0, Math.min(1, f)))); };
    r.largo(0);
    return r;
  }
  function poner(el, at) { for (var k in at) el.setAttribute(k, at[k]); }
  // La franja de arriba de una animación: una ecuación por paso, con su línea de números debajo.
  function franja(svg, filas, x, y) {
    var gs = filas.map(function (f) {
      if (!f) return null;
      var g = grupo(svg);
      D.t(g, x, y, f[0], { tam: 14, peso: 650 });
      if (f[1]) D.t(g, x, y + 22, f[1], { tam: 12.5, color: K.tinta2 });
      return g;
    });
    return function (k, u) { gs.forEach(function (g, i) { if (g) D.ver(g, i === k ? u : 0); }); };
  }
  // Aglomerados de café en una banda: círculos repartidos sin azar (para que cada paso dibuje lo mismo).
  function granos(padre, x0, x1, y0, y1, r, cuantos, o) {
    o = o || {};
    var g = s('g', {}, padre);
    for (var i = 0; i < cuantos; i++) {
      var fx = ((i * 0.618034) % 1), fy = ((i * 0.41421 + 0.13) % 1);
      var rr = r * (0.75 + 0.5 * ((i * 0.7548) % 1));
      s('circle', { cx: (x0 + rr + fx * (x1 - x0 - 2 * rr)).toFixed(1), cy: (y0 + rr + fy * (y1 - y0 - 2 * rr)).toFixed(1), r: rr.toFixed(1), fill: o.fill || SO.relleno, stroke: o.borde || SO.oscuro, 'stroke-width': 0.8 }, g);
    }
    return g;
  }

  /* ================= 6.2 Tamices y series ================= */

  /* De la malla a la serie: la celda de la tela de 1 mm de la figura de la abertura (a = 1 mm, d = 0,56 mm), las
     16 aberturas por pulgada, la razón de la R 20/3 con el área que se duplica, los nueve tamices de la tabla del
     caso y el tamiz de 600 µm de la R 40/3 entre el de 710 y el de 500. */
  ZB.animacion('serie', {
    vista: [0, 0, 640, 300],
    alt: 'A la izquierda, cuatro celdas de la tela de 1 mm, con aberturas de 1 mm y alambre de 0,56 mm; la fracción abierta es (1/1,56)² = 0,41. Debajo, una pulgada de 25,4 mm con 16 celdas: 16 mallas, aunque la ASTM llama n.º 18 a ese tamiz. A la derecha, tres aberturas de 0,71, 1,00 y 1,41 mm, con razón 1,4125 entre una y la siguiente y el área que se duplica; después, los nueve tamices del caso de 4,00 a 0,250 mm a escala, y el de 600 µm de la R 40/3 entre el de 710 y el de 500.',
    montar: function (svg) {
      var S = {}, k = 44, A = 1.0 * k, W = 0.56 * k, x0 = 26, y0 = 54;
      // cuatro celdas: alambre alrededor de cada abertura
      S.celda = grupo(svg);
      s('rect', { x: x0, y: y0, width: 2 * (A + W) + W, height: 2 * (A + W) + W, fill: K.metalM, stroke: K.metalO, 'stroke-width': 1 }, S.celda);
      for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++)
        s('rect', { x: x0 + W + i * (A + W), y: y0 + W + j * (A + W), width: A, height: A, fill: K.blanco, stroke: K.metalO, 'stroke-width': 0.8 }, S.celda);
      // la celda a + d de una abertura, punteada
      s('rect', { x: x0 + W / 2, y: y0 + W / 2, width: A + W, height: A + W, fill: 'none', stroke: AZ, 'stroke-width': 1.8, 'stroke-dasharray': '6 4' }, S.celda);
      D.t(S.celda, x0 + W + A / 2, y0 - 10, 'a = 1 mm', { tam: 12.5, peso: 650, ancla: 'middle' });
      D.t(S.celda, x0 + 2 * (A + W) + W + 8, y0 + W + A / 2 + 4, 'd = 0,56', { tam: 12.5, peso: 650 });
      D.t(S.celda, x0 + 2 * (A + W) + W + 8, y0 + W + A / 2 + 22, 'mm', { tam: 12.5, peso: 650 });
      S.lFoa = oculto(svg, x0, y0 + 2 * (A + W) + W + 24, 'F_{oa} = (1/1,56)^2 = 0,41', { tam: 13, peso: 700, color: AZ });
      // una pulgada con 16 celdas
      S.pulg = grupo(svg);
      var px = 7.6, yp = 268;
      s('line', { x1: x0, x2: x0 + 25.4 * px, y1: yp, y2: yp, stroke: K.tinta, 'stroke-width': 1.6 }, S.pulg);
      for (var c = 0; c <= 16; c++) s('line', { x1: x0 + c * 1.56 * px, x2: x0 + c * 1.56 * px, y1: yp - 6, y2: yp + 6, stroke: K.tinta2, 'stroke-width': 1.2 }, S.pulg);
      s('line', { x1: x0 + 25.4 * px, x2: x0 + 25.4 * px, y1: yp - 12, y2: yp + 12, stroke: K.tinta, 'stroke-width': 1.8 }, S.pulg);
      D.t(S.pulg, x0, yp + 24, '25,4 mm: 16 celdas de 1,56 mm', { tam: 12, color: K.tinta2 });
      // tres aberturas en razón 1,4125
      S.tres = grupo(svg);
      var kk = 46, base = 196, xs = [290, 380, 500];
      [0.71, 1.0, 1.41].forEach(function (a, i) {
        s('rect', { x: xs[i], y: base - a * kk, width: a * kk, height: a * kk, fill: K.blanco, stroke: OL, 'stroke-width': 2 }, S.tres);
        D.t(S.tres, xs[i] + a * kk / 2, base + 20, n(a, 2) + ' mm', { tam: 12.5, peso: 650, ancla: 'middle' });
      });
      D.t(S.tres, 370, base - 70, '× 1,4125', { tam: 12.5, peso: 650, ancla: 'middle', color: OL });
      D.t(S.tres, 480, base - 92, '× 1,4125', { tam: 12.5, peso: 650, ancla: 'middle', color: OL });
      D.t(S.tres, 455, base + 46, 'el área: × 1,4125² = 1,995', { tam: 12.5, peso: 650, ancla: 'middle', color: OL });
      // los nueve tamices de la tabla, a escala, con el fondo alineado
      S.nueve = grupo(svg);
      var k9 = 11, b9 = 196, dx = 41, c0 = 294;
      SERIE.forEach(function (t, i) {
        var w = t.a * k9, cx = c0 + i * dx;
        s('rect', { x: cx - w / 2, y: b9 - w, width: w, height: w, fill: K.blanco, stroke: OL, 'stroke-width': 1.6 }, S.nueve);
        D.t(S.nueve, cx, b9 + 18, ab(t.a), { tam: 11.5, ancla: 'middle' });
      });
      D.t(S.nueve, c0 - 24, 104, 'Los nueve tamices del caso, en mm: cada uno es', { tam: 12, color: K.tinta2 });
      D.t(S.nueve, c0 - 24, 120, 'el de arriba entre 1,4125 (R 20/3)', { tam: 12, color: K.tinta2 });
      // el de 600 µm de la R 40/3, entre el de 710 y el de 500
      S.r403 = grupo(svg);
      var cxm = c0 + 5.5 * dx, w6 = 0.6 * k9;
      s('rect', { x: cxm - w6 / 2, y: b9 - w6, width: w6, height: w6, fill: K.blanco, stroke: AZ, 'stroke-width': 1.6 }, S.r403);
      D.flecha(S.r403, cxm, 158, cxm, b9 - w6 - 3, { color: AZ, ancho: 1.4, punta: 6 });
      D.t(S.r403, cxm + 4, 151, '600 µm, n.º 30: R 40/3', { tam: 12, peso: 650, color: AZ, ancla: 'end' });
      D.t(S.r403, c0 - 24, 276, 'R 40/3: 10^{3/40} = 1,1885, casi ∜2 = 1,1892 de Tyler', { tam: 12, color: AZ });
      return S;
    },
    pasos: [
      { texto: 'Cuatro celdas de la tela de 1 mm. Cada abertura mide $a$ = 1 mm, y el alambre, $d$ = 0,56 mm; la celda de una abertura con su alambre mide $a + d$ = 1,56 mm. Con la <a href="#eq-tam-foa">ecuación del área abierta</a>, la fracción abierta es $F_{oa} = (1/1,56)^2$ = 0,41.', dur: 1.8, ir: function (S, t) { D.ver(S.celda, T(t, 0, 0.5)); D.ver(S.lFoa, T(t, 0.5, 1)); } },
      { texto: 'En una pulgada, 25,4 mm, caben $25,4/1,56$ = 16 celdas: la tela tiene 16 mallas. La ASTM E11 llama n.º 18 a ese tamiz, y el número no es la malla; por eso el tamiz se nombra por su abertura.', dur: 1.8, ir: function (S, t) { D.ver(S.pulg, t); } },
      { texto: 'La serie principal de la ISO 565, la R 20/3, avanza con razón $10^{3/20}$ = 1,4125: de 0,71 a 1,00 y a 1,41 mm. El área de la abertura crece con el cuadrado, $1,4125^2$ = 1,995: se duplica de un tamiz al siguiente, como en la serie Tyler con $\\sqrt 2$.', dur: 2, ir: function (S, t) { D.ver(S.tres, t); } },
      { texto: 'Los nueve tamices del caso, de 4,00 a 0,250 mm, dibujados a la misma escala: cada uno es el de arriba entre 1,4125, redondeado a su abertura nominal.', dur: 1.8, ir: function (S, t) { D.ver(S.tres, 1 - T(t, 0, 0.3)); D.ver(S.nueve, T(t, 0.3, 1)); } },
      { texto: 'Si hacen falta pasos más pequeños, se toman de una sola serie suplementaria. La R 40/3, con razón $10^{3/40}$ = 1,1885, mete un tamiz entre cada dos: el de 600 µm, n.º 30, va entre el de 710 y el de 500. Esa razón casi es la $\\sqrt[4]{2}$ = 1,1892 de los intermedios de Tyler.', dur: 2, ir: function (S, t) { D.ver(S.r403, t); } }
    ]
  });

  /* Reto: el área abierta y las mallas de una tela, la serie R 20/3 y la R 40/3, y el área abierta con el alambre
     más delgado y el más grueso que admite la norma. */

  /* ================= 6.3 El análisis paso a paso ================= */

  /* La carga del ejemplo, tamiz por tamiz: la pila del esquema con la fracción del producto en cada tamiz, la
     clase dominante y su carga de 120 cm³, los 56,4 g, el volumen que queda en cada tamiz contra su máximo y la
     partícula más grande arriba y abajo. */
  ZB.animacion('carga', {
    vista: [0, 0, 640, 330],
    alt: 'La pila de nueve tamices y el fondo, con la fracción del producto que queda en cada uno: 15,3 % en 1,40 mm, 27,7 % en 1,00 mm, 28,2 % en 710 µm, 20,6 % en 500 µm, 7,6 % en 355 µm y 0,6 % en 250 µm. Manda la clase de 710 µm: 120 cm³ de carga, 56,4 g con 0,470 g/cm³. Al lado de cada tamiz, una barra con el volumen que queda en él contra su máximo: 33,8 de 60 cm³ en el de 710 µm, 33,2 de 70 en el de 1,00 mm, 24,7 de 50 en el de 500 µm. Ninguno se pasa. La partícula más grande en el tamiz de arriba puede medir 26,4 mm; en el de 250 µm, 3,8 mm.',
    montar: function (svg) {
      var S = {}, y0 = 70, h = 22, xp = 132;
      D.t(svg, 70, y0 - 12, 'Tamiz (mm)', { tam: 12.5, peso: 700, ancla: 'middle' });
      D.t(svg, 236, y0 - 12, '% del producto', { tam: 12.5, peso: 700, ancla: 'middle' });
      S.cab2 = oculto(svg, 330, y0 - 12, 'volumen que queda contra el máximo (cm³)', { tam: 12.5, peso: 700 });
      S.fila = [];
      SERIE.forEach(function (t, i) {
        var y = y0 + i * h;
        s('rect', { x: xp, y: y, width: 60, height: h - 4, fill: K.zona, stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
        s('line', { x1: xp + 4, x2: xp + 56, y1: y + h - 9, y2: y + h - 9, stroke: K.metalO, 'stroke-width': 1, 'stroke-dasharray': '3 3' }, svg);
        D.t(svg, 70, y + 13, ab(t.a), { tam: 12, ancla: 'middle' });
        var fw = oculto(svg, 236, y + 13, n(t.w, 1), { tam: 12, peso: t.a === 0.71 ? 700 : 500, ancla: 'middle', color: t.a === 0.71 ? OL : K.tinta });
        var v = t.w / 100 * 56.4 / RHO_B, xb = 330, wb = 1.25;
        var g = grupo(svg);
        s('rect', { x: xb, y: y + 2, width: t.m * wb, height: h - 8, fill: 'none', stroke: K.guia, 'stroke-width': 1, 'stroke-dasharray': '3 2' }, g);
        var bv = barra(g, xb, y + 2, t.m * wb, h - 8, SO.medio);
        var lv = D.t(g, xb + t.m * wb + 6, y + 13, (t.w ? n(v, 1) : '0') + ' de ' + t.m, { tam: 11.5, color: K.tinta2 });
        S.fila.push({ fw: fw, g: g, bv: bv, f: v / t.m, lv: lv });
      });
      var yf = y0 + SERIE.length * h;
      s('path', { d: 'M' + xp + ' ' + yf + 'V' + (yf + 14) + 'H' + (xp + 60) + 'V' + yf, fill: K.zona, stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      D.t(svg, 70, yf + 12, 'fondo', { tam: 12, ancla: 'middle' });
      S.fondo = oculto(svg, 236, yf + 12, '0,0', { tam: 12, ancla: 'middle' });
      // la clase dominante y la carga
      S.dom = grupo(svg);
      var yd = y0 + 5 * h;
      s('rect', { x: xp - 4, y: yd - 3, width: 68, height: h + 2, fill: 'none', stroke: OL, 'stroke-width': 2.2, rx: 3 }, S.dom);
      S.carga = grupo(svg);
      D.flecha(S.carga, xp + 30, 14, xp + 30, y0 - 4, { color: K.tinta, ancho: 2, punta: 8 });
      D.t(S.carga, xp + 44, 26, 'm = V ρ_b = 120 × 0,470 = 56,4 g', { tam: 13, peso: 700 });
      // la partícula más grande
      S.xmax = grupo(svg);
      D.t(S.xmax, 330, 300, 'x_{máx} = 10 × 4,00^{0,7} = 26,4 mm, en el tamiz de arriba', { tam: 12.5, peso: 650 });
      D.t(S.xmax, 330, 320, 'el de 250 µm admitiría 3,8 mm, pero a él no llega', { tam: 12, color: K.tinta2 });
      return S;
    },
    pasos: [
      { texto: 'La pila de la <a href="#tbl-tam-serie">tabla de los nueve tamices</a> con la fracción del producto que queda en cada tamiz. Las dos clases más pesadas quedan sobre los tamices de 710 µm y de 1,00 mm, con 28,2 y 27,7 % de la masa.', dur: 1.8, ir: function (S, t) { S.fila.forEach(function (f, i) { D.ver(f.fw, T(t, 0.06 * i, 0.06 * i + 0.4)); }); D.ver(S.fondo, T(t, 0.6, 1)); } },
      { texto: 'Manda la clase de 710 µm, por poco: para ese tamiz la norma recomienda una carga de 120 cm³, y la masa sale de la densidad a granel, $m = V\\rho_b = 120 \\times 0,470$ = 56,4 g.', dur: 1.8, ir: function (S, t) { D.ver(S.dom, T(t, 0, 0.4)); D.ver(S.carga, T(t, 0.4, 1)); } },
      { texto: 'Lo que queda en cada tamiz ocupa su fracción de la carga dividida por la densidad a granel: en el de 710 µm, $0,282 \\times 56,4/0,470$ = 33,8 cm³. La línea punteada de cada barra es el retenido máximo, la mitad de la carga recomendada para ese tamiz.', dur: 2.4, ir: function (S, t) { D.ver(S.cab2, T(t, 0, 0.2)); S.fila.forEach(function (f, i) { D.ver(f.g, T(t, 0.05 + 0.05 * i, 0.25 + 0.05 * i)); f.bv.largo(f.f * T(t, 0.3 + 0.05 * i, 0.75 + 0.03 * i)); }); } },
      { texto: 'Ninguno se pasa: el más lleno, el de 710 µm, llega a 33,8 de sus 60 cm³, y el de 1,00 mm a 33,2 de 70. Si mandara el de 1,00 mm, la carga sería de $140 \\times 0,470$ = 65,8 g: la tabla da solo un punto de partida.', dur: 1.6, ir: function (S, t) { S.fila.forEach(function (f, i) { if (i === 4 || i === 5) f.lv.setAttribute('font-weight', t > 0.3 ? 700 : 500); }); } },
      { texto: 'La partícula más grande no puede pasar de $10\\,a^{0,7}$ mm. La carga va en el tamiz de arriba, y ahí cuenta la del de 4,00 mm: 26,4 mm. El de 250 µm admitiría solo 3,8 mm, pero a él no llega nada de ese tamaño.', dur: 1.8, ir: function (S, t) { D.ver(S.xmax, t); } }
    ]
  });

  /* Reto: la carga de una pila, la partícula más grande y la pérdida de masa con tres reglas. */
  var ISO_SIN_250 = SERIE.slice(0, 8);

  /* ================= 6.4 Por qué una partícula tarda en pasar ================= */

  /* Cabe, pero casi nunca pasa: la celda de la tela de 1 mm de la figura de la abertura y el cuadrado en que tiene
     que caer el centro de la partícula, que se encoge para 0,6, 0,9 y 0,99 mm; la probabilidad de paso de la
     ecuación y los intentos que hacen falta para que pase la mitad. */
  var F1 = foa(1, 0.56);
  ZB.animacion('paso', {
    vista: [0, 0, 640, 250],
    alt: 'Una celda de la tela de 1 mm, con alambre de 0,56 mm: la abertura es 0,411 de la celda. Una partícula de 0,6 mm pasa si su centro cae en un cuadrado de 0,4 mm de lado: p = 0,066. Con 0,9 mm el cuadrado mide 0,1 mm y p = 0,0041; con 0,99 mm, 0,01 mm y p = 0,000041. A la derecha, una tabla con el tamaño, el lado del cuadrado, la probabilidad y los intentos para que pase la mitad: 11, 170 y unos 17 000.',
    montar: function (svg) {
      var S = {}, k = 110, x0 = 52, y0 = 66, W = 0.56 * k;
      s('rect', { x: x0 - W / 2, y: y0 - W / 2, width: k + W, height: k + W, fill: K.metalM, stroke: K.metalO, 'stroke-width': 1 }, svg);
      s('rect', { x: x0, y: y0, width: k, height: k, fill: K.blanco, stroke: K.metalO, 'stroke-width': 1 }, svg);
      D.t(svg, x0 + k / 2, y0 - W / 2 - 10, 'celda: a + d = 1,56 mm', { tam: 12, ancla: 'middle', color: K.tinta2 });
      S.lF = oculto(svg, x0 - W / 2, y0 + k + W / 2 + 22, 'F_{oa} = (1/1,56)^2 = 0,411', { tam: 13, peso: 700, color: K.tinta });
      S.cuad = s('rect', { fill: K.amarilloClaro, stroke: OL, 'stroke-width': 1.8, 'stroke-dasharray': '5 3', opacity: 0 }, svg);
      S.part = s('circle', { fill: SO.relleno, 'fill-opacity': 0.7, stroke: SO.oscuro, 'stroke-width': 1.4, opacity: 0 }, svg);
      S.cen = s('circle', { r: 2.6, fill: SO.oscuro, opacity: 0 }, svg);
      S.ponerX = function (x) {
        var lado = Math.max(0.6, (1 - x) * k), c = x0 + k / 2;
        poner(S.cuad, { x: c - lado / 2, y: y0 + k / 2 - lado / 2, width: lado, height: lado });
        var cx = c + 0.3 * lado, cy = y0 + k / 2 - 0.25 * lado;
        poner(S.part, { cx: cx, cy: cy, r: x * k / 2 });
        poner(S.cen, { cx: cx, cy: cy });
      };
      // la tabla
      var cx = [300, 380, 470, 572], yh = 74;
      D.t(svg, cx[0], yh, 'x (mm)', { tam: 12.5, peso: 700, ancla: 'middle' });
      D.t(svg, cx[1], yh, 'a − x (mm)', { tam: 12.5, peso: 700, ancla: 'middle' });
      D.t(svg, cx[2], yh, 'p', { tam: 12.5, peso: 700, ancla: 'middle', it: true });
      D.t(svg, cx[3], yh, 'para la mitad', { tam: 12.5, peso: 700, ancla: 'middle' });
      s('line', { x1: 262, x2: 630, y1: yh + 8, y2: yh + 8, stroke: K.tinta2, 'stroke-width': 1 }, svg);
      var filas = [[0.6, '0,6', '0,4', '0,066', '11 intentos'], [0.9, '0,9', '0,1', '0,0041', '170'], [0.99, '0,99', '0,01', '0,000041', 'unos 17 000']];
      S.fil = filas.map(function (f, i) {
        var y = yh + 32 + i * 30, g = grupo(svg), gN = grupo(svg);
        D.t(g, cx[0], y, f[1], { tam: 12.5, ancla: 'middle' });
        D.t(g, cx[1], y, f[2], { tam: 12.5, ancla: 'middle', color: OL, peso: 650 });
        D.t(g, cx[2], y, f[3], { tam: 12.5, ancla: 'middle', peso: 650 });
        D.t(gN, cx[3], y, f[4], { tam: 12.5, ancla: 'middle', peso: 650, color: AZ });
        return { g: g, gN: gN };
      });
      S.lP = oculto(svg, 262, 196, 'p = F_{oa} (1 − x/a)^2: el cuadrado del lado que sobra', { tam: 12.5, color: K.tinta2 });
      S.lN = oculto(svg, 262, 222, 'sigue arriba: e^{−Np}; pasa la mitad con N = ln 2/p', { tam: 12.5, color: AZ, peso: 650 });
      return S;
    },
    pasos: [
      { texto: 'Una celda de la tela de 1 mm, con alambre de 0,56 mm: la celda mide $a + d$ = 1,56 mm de lado, y la abertura es $F_{oa} = (1/1,56)^2$ = 0,411 de su área. Una partícula muy pequeña pasa en casi cualquier intento que caiga sobre la abertura.', dur: 1.6, ir: function (S, t) { D.ver(S.lF, t); } },
      { texto: 'Una partícula de 0,6 mm pasa sin tocar el alambre si su centro cae a más de 0,3 mm de cada borde: en el cuadrado de lado $a - x$ = 0,4 mm. Con la <a href="#eq-tam-p">ecuación de la probabilidad de paso</a>, $p = 0,411 \\times (1 - 0,6)^2$ = 0,066.', dur: 2, ir: function (S, t) {
        S.ponerX(0.6); [S.cuad, S.part, S.cen].forEach(function (e) { D.ver(e, T(t, 0, 0.5)); });
        D.ver(S.fil[0].g, T(t, 0.5, 1)); D.ver(S.lP, T(t, 0.6, 1));
      } },
      { texto: 'Con 0,9 mm el cuadrado se encoge a 0,1 mm de lado: $p = 0,411 \\times 0,1^2$ = 0,0041, una centésima del área abierta.', dur: 1.8, ir: function (S, t) { S.ponerX(L(0.6, 0.9, T(t, 0, 0.7))); D.ver(S.fil[1].g, T(t, 0.6, 1)); } },
      { texto: 'Con 0,99 mm queda un cuadrado de 0,01 mm, que casi no se ve: $p$ = 0,000041, una diezmilésima del área abierta. La partícula cabe, pero casi nunca pasa.', dur: 1.8, ir: function (S, t) { S.ponerX(L(0.9, 0.99, T(t, 0, 0.7))); D.ver(S.fil[2].g, T(t, 0.6, 1)); } },
      { texto: 'Con $N$ intentos, la fracción que sigue arriba es $e^{-Np}$, y pasa la mitad cuando $N = \\ln 2/p$: 11 intentos con 0,6 mm, 170 con 0,9 mm y unos 17 000 con 0,99 mm.', dur: 2, ir: function (S, t) { D.ver(S.lN, T(t, 0, 0.4)); S.fil.forEach(function (f, i) { D.ver(f.gN, T(t, 0.3 + 0.2 * i, 0.5 + 0.2 * i)); }); } }
    ]
  });

  /* Las cercanas a la abertura deciden el final: la ecuación de los intentos en el tamiz de 500 µm del ensayo
     (2,5 encuentros por segundo, φ cerca de 0,7, la tela de la tabla con F_oa = 0,376), para cuatro tamaños. */
  var FOA5 = foa(0.5, 0.315), KMIN = 2.5 * 60 * 0.7 * FOA5;     // por minuto, sin el (1 − x/a)²
  ZB.animacion('cercanas', {
    vista: [0, 0, 640, 300],
    alt: 'Gráfica de la fracción que sigue sobre el tamiz de 500 µm contra el tiempo, de 0 a 20 minutos, para cuatro tamaños. Con x/a = 0,5 no queda nada al minuto; con 0,8 queda 21 % al minuto y casi nada a los 4; con 0,9 queda 67 % al minuto y 2 % a los 10; con 0,95 queda 37 % a los 10 minutos y 14 % a los 20. Las cercanas a la abertura son las que todavía pasan cuando el resto ya pasó.',
    montar: function (svg) {
      var S = {};
      var E = D.ejes(svg, { x: 64, y: 50, w: 360, h: 200, xmin: 0, xmax: 20, ymin: 0, ymax: 1, xt: [0, 5, 10, 15, 20], yt: [0, 0.5, 1], dy: 1, xr: 't (min)', yr: 'm/m_0, lo que sigue sobre la malla' });
      S.E = E;
      var tam = [[0.5, K.guia], [0.8, K.tinta2], [0.9, AZ], [0.95, OL]];
      S.c = tam.map(function (q) {
        var kk = KMIN * Math.pow(1 - q[0], 2), pts = [];
        for (var i = 0; i <= 160; i++) { var tt = 20 * i / 160; pts.push([tt, Math.exp(-kk * tt)]); }
        return D.trazo(svg, D.camino(pts, E.X, E.Y), { color: q[1], ancho: 2.4 });
      });
      D.t(svg, 446, 52, 'tamiz de 500 µm: ν = 2,5/s,', { tam: 12, color: K.tinta2 });
      D.t(svg, 446, 70, 'φ ≈ 0,7, F_{oa} = 0,376', { tam: 12, color: K.tinta2 });
      var ley = [['x/a = 0,5', 'nada al primer minuto'], ['x/a = 0,8', '21 % al minuto, nada a los 4'], ['x/a = 0,9', '67 % al minuto, 2 % a los 10'], ['x/a = 0,95', '37 % a los 10, 14 % a los 20']];
      S.ley = ley.map(function (l, i) {
        var g = grupo(svg), y = 108 + i * 42;
        s('line', { x1: 446, x2: 468, y1: y - 4, y2: y - 4, stroke: tam[i][1], 'stroke-width': 3 }, g);
        D.t(g, 474, y, l[0], { tam: 12.5, peso: 700, color: tam[i][1] === K.guia ? K.tinta2 : tam[i][1] });
        D.t(g, 446, y + 17, l[1], { tam: 12, color: K.tinta2 });
        return g;
      });
      S.diez = grupo(svg);
      camino(S.diez, [[E.X(10), 50], [E.X(10), 250]], { color: K.tinta2, ancho: 1.4, guion: '4 4' });
      D.t(S.diez, E.X(10) + 6, 64, 'a los 10 min solo quedan', { tam: 12, color: K.tinta, halo: true });
      D.t(S.diez, E.X(10) + 6, 80, 'las cercanas a la abertura', { tam: 12, color: K.tinta, halo: true });
      return S;
    },
    pasos: [
      { texto: 'Con la <a href="#eq-tam-intentos">ecuación de los intentos</a>, lo que sigue sobre el tamiz de 500 µm cae como $\\exp[-\\nu\\,\\varphi\\,F_{oa}(1 - x/a)^2\\,t]$. En el ensayo, $\\nu$ = 2,5 por segundo, casi el 70 % de las partículas toca la malla y $F_{oa}$ = 0,376: sin el último factor, 39,5 por minuto.', dur: 1.8, ir: function (S, t) {} },
      { texto: 'Con $x/a$ = 0,5, el exponente es $39,5 \\times 0,25$ = 9,9 por minuto: en un minuto queda $e^{-9,9}$, nada. Las partículas mucho menores que la abertura salen en el primer minuto.', dur: 1.6, ir: function (S, t) { S.c[0].dibujar(T(t, 0, 0.8)); D.ver(S.ley[0], T(t, 0.5, 1)); } },
      { texto: 'Con 0,8, el exponente es $39,5 \\times 0,04$ = 1,58 por minuto: queda el 21 % al minuto y casi nada a los 4.', dur: 1.6, ir: function (S, t) { S.c[1].dibujar(T(t, 0, 0.8)); D.ver(S.ley[1], T(t, 0.5, 1)); } },
      { texto: 'Con 0,9, 0,40 por minuto: queda el 67 % al minuto y todavía el 2 % a los 10. Estas son las que salen poco a poco.', dur: 1.8, ir: function (S, t) { S.c[2].dibujar(T(t, 0, 0.8)); D.ver(S.ley[2], T(t, 0.5, 1)); } },
      { texto: 'Con 0,95, 0,099 por minuto: queda el 37 % a los 10 minutos y el 14 % a los 20. Casi nunca terminan de salir.', dur: 1.8, ir: function (S, t) { S.c[3].dibujar(T(t, 0, 0.8)); D.ver(S.ley[3], T(t, 0.5, 1)); } },
      { texto: 'Son las dos etapas del tamizado. Cuando el resto ya pasó, las cercanas a la abertura siguen pasando: ellas deciden cuándo se cumple el 0,1 % por minuto, y cuántos finos deja de informar un ensayo de tiempo fijo.', dur: 1.6, ir: function (S, t) { D.ver(S.diez, t); } }
    ]
  });

  /* Reto: la probabilidad de paso, lo que queda después de un tiempo y el tiempo para que pase una fracción. */

  /* ================= 6.5 La criba: balances y eficiencias ================= */

  /* Los dos pisos de la criba de la figura del circuito, con su alimentación y sus tres salidas: el rechazo de
     2,00 mm al triturador, el producto y los finos; los flujos y las fracciones del ejemplo del piso fino y las
     recuperaciones del recuadro «Cuidado». */
  var MD = 'ṁ';
  ZB.animacion('balance', {
    vista: [0, 0, 640, 320],
    alt: 'La criba de dos pisos vista de lado, con la alimentación de 1000 kg/h que entra arriba a la izquierda. El piso de 2,00 mm manda 168,4 kg/h al triturador y deja pasar 831,6 kg/h al piso de 0,500 mm; ese piso deja 776,5 kg/h de producto y 55,1 kg/h de finos. Abajo, las cuentas: el piso de arriba recupera el 100 % de los gruesos y el 94 % de los finos con un rechazo de solo 71 % de gruesos; en el de abajo, la regla de la palanca da 0,9337, las recuperaciones son 1,000 y 0,465, y los tres flujos suman 1000 kg/h.',
    montar: function (svg) {
      var S = {}, xa = 190, xb = 420;
      // la caja de la criba y sus dos pisos
      s('rect', { x: xa, y: 76, width: xb - xa, height: 156, rx: 4, fill: K.papel, stroke: K.tinta, 'stroke-width': 1.6 }, svg);
      S.p1 = s('line', { x1: xa, y1: 104, x2: xb, y2: 124, stroke: AZ, 'stroke-width': 3, 'stroke-dasharray': '7 3' }, svg);
      S.p2 = s('line', { x1: xa, y1: 158, x2: xb, y2: 178, stroke: OL, 'stroke-width': 3, 'stroke-dasharray': '5 3' }, svg);
      s('line', { x1: xa, y1: 206, x2: xb, y2: 222, stroke: K.tinta2, 'stroke-width': 2 }, svg);
      D.t(svg, xa + 36, 98, 'malla de 2,00 mm', { tam: 11.5, peso: 650, color: AZ });
      D.t(svg, xa + 8, 150, 'malla de 0,500 mm', { tam: 11.5, peso: 650, color: OL });
      // la alimentación y las tres salidas
      tubo(svg, [[24, 88], [xa + 4, 88]], { ancho: 2 });
      D.t(svg, 24, 58, 'Alimentación', { tam: 12.5, peso: 700 });
      S.fF = oculto(svg, 24, 76, '1000 kg/h del secador', { tam: 12 });
      tubo(svg, [[xb, 124], [xb + 52, 124]], { color: AZ });
      tubo(svg, [[xb, 178], [xb + 52, 178]], { color: OL });
      tubo(svg, [[xb, 222], [xb + 52, 222]], { color: K.tinta2 });
      D.t(svg, xb + 60, 118, 'al triturador', { tam: 12.5, peso: 700, color: AZ });
      D.t(svg, xb + 60, 172, 'producto', { tam: 12.5, peso: 700, color: OL });
      D.t(svg, xb + 60, 218, 'finos, al aglomerador', { tam: 12.5, peso: 700 });
      S.fO1 = oculto(svg, xb + 60, 136, '168,4 kg/h', { tam: 12 });
      S.fP = oculto(svg, xb + 60, 190, '776,5 kg/h', { tam: 12 });
      S.fU = oculto(svg, xb + 60, 236, '55,1 kg/h', { tam: 12 });
      // el cernido del piso de arriba, que cae al de abajo
      S.u1 = grupo(svg);
      D.flecha(S.u1, 330, 126, 330, 162, { color: K.tinta2, ancho: 1.8, punta: 7 });
      D.t(S.u1, 338, 148, '831,6 kg/h', { tam: 12, peso: 650, halo: true });
      // las cuentas de abajo, un juego por paso
      S.fr = franja(svg, [
        null,
        ['Piso de 2,00 mm: X_F = 0,119, X_O = 0,707, X_U = 0', 'E_O = 1,00 y E_U = 0,94, pero su rechazo tiene solo 71 % de gruesos'],
        [MD + '_O/' + MD + '_F = (0,8574 − 0)/(0,9183 − 0) = 0,9337', MD + '_O = 0,9337 × 831,6 = 776,5 kg/h;  ' + MD + '_U = 831,6 − 776,5 = 55,1 kg/h'],
        ['E_O = 0,9337 × 0,9183/0,8574 = 1,000', 'E_U = (1 − 0,9337)/(1 − 0,8574) = 0,465;  E = 1,000 × 0,465 = 0,465'],
        ['168,4 + 776,5 + 55,1 = 1000 kg/h', 'el producto lleva 1 − 0,9183 = 8,2 % de finos, y cumple']
      ], 24, 272);
      return S;
    },
    pasos: [
      { texto: 'La criba de dos pisos de la <a href="#fig-tam-circuito">figura del circuito</a>: una alimentación, 1000 kg/h del secador, y tres salidas. El rechazo del piso de 2,00 mm va al triturador; el del piso de 0,500 mm es el producto, y su cernido son los finos que vuelven al aglomerador.', dur: 1.6, ir: function (S, t) { D.ver(S.fF, t); } },
      { texto: 'El piso de 2,00 mm manda 168,4 kg/h al triturador y deja pasar 831,6. Con 11,9 % de gruesos en la alimentación, recupera el 100 % de los gruesos y el 94 % de los finos, pero su rechazo tiene solo 71 % de gruesos: casi un tercio de lo que va al triturador es producto bueno.', dur: 2.2, ir: function (S, t) { S.fr(1, T(t, 0, 0.4)); D.ver(S.u1, T(t, 0.2, 0.6)); D.ver(S.fO1, T(t, 0.4, 0.8)); } },
      { texto: 'El piso de 0,500 mm, con los análisis del <a href="#exm-tam-balance">ejemplo del piso fino</a>: con la <a href="#eq-tam-of">ecuación de la palanca</a>, la alimentación queda entre los dos productos, como en una palanca. Sale el 93,37 % como producto, 776,5 kg/h, y 55,1 kg/h de finos.', dur: 2.2, ir: function (S, t) { S.fr(2, T(t, 0, 0.4)); D.ver(S.fP, T(t, 0.4, 0.8)); D.ver(S.fU, T(t, 0.6, 1)); } },
      { texto: 'Con la <a href="#eq-tam-rec">ecuación de las recuperaciones</a>, todo lo mayor que 500 µm sale en el producto, $E_O$ = 1,000, y el piso deja pasar solo el 46,5 % de los finos que recibe. Como el cernido no lleva gruesos, la combinada es igual a la de Taggart.', dur: 2, ir: function (S, t) { S.fr(3, T(t, 0, 0.4)); } },
      { texto: 'Los tres flujos suman lo que entra: 168,4 + 776,5 + 55,1 = 1000 kg/h. El producto lleva 8,2 % de finos y cumple, aunque poco mérito tiene la criba: la especificación admite 10 %.', dur: 1.8, ir: function (S, t) { S.fr(4, T(t, 0, 0.4)); } }
    ]
  });

  /* Ocho clases, un reparto: las fracciones de la tabla del reparto, el reparto de cada clase, el peso de cada
     una en el estimado de mínimos cuadrados, el estimado y la reconciliación de la clase de 0,355 a 0,500 mm. */
  var RF = [0.1, 16.6, 26.3, 26.2, 17.8, 8.5, 3.1, 1.5], RO = [0.1, 17.8, 28.3, 28.0, 18.9, 5.9, 0.4, 0.6], RU = [0.0, 0.0, 0.0, 0.0, 0.3, 50.2, 37.0, 12.6];
  var RCL = ['2,00', '1,40', '1,00', '0,710', '0,500', '0,355', '0,250', '< 0,250'];
  ZB.animacion('reparto', {
    vista: [0, 0, 640, 330],
    alt: 'A la izquierda, el reparto que da cada una de las ocho clases del piso fino, (f − u)/(o − u), entre 0,925 y 0,941, menos la clase de 2,00 a 2,80 mm, que da 1,000 con 0,1 % en dos corrientes. Debajo, el peso de cada clase en el estimado de mínimos cuadrados, (o − u)²: las dos clases bajo la abertura pesan más. La recta del estimado, 0,9344. A la derecha, las sumas, 5320,1 y 5693,8, el producto de 777,0 kg/h y la reconciliación de la clase de 0,355 a 0,500 mm: residuo de −0,31, ajuste de −0,16, y la alimentación sube a 8,66 %, el producto baja a 5,75 % y el cernido queda en 50,19 %.',
    montar: function (svg) {
      var S = {}, x0 = 64, dx = 43, y0 = 52, h = 136, lo = 0.920, hi = 0.950;
      var X = function (i) { return x0 + 20 + i * dx; }, Y = function (v) { return y0 + h - (v - lo) / (hi - lo) * h; };
      [0.92, 0.93, 0.94, 0.95].forEach(function (v) {
        s('line', { x1: x0, x2: x0 + 8 * dx, y1: Y(v), y2: Y(v), stroke: K.rejilla, 'stroke-width': 1 }, svg);
        D.t(svg, x0 - 6, Y(v) + 4, n(v, 2), { tam: 11.5, ancla: 'end', color: K.tinta2 });
      });
      s('path', { d: 'M' + x0 + ' ' + y0 + 'V' + (y0 + h) + 'H' + (x0 + 8 * dx), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      D.t(svg, x0 - 4, y0 - 14, MD + '_O/' + MD + '_F de cada clase', { tam: 12.5, peso: 650 });
      RCL.forEach(function (c, i) { D.t(svg, X(i), y0 + h + 16, c, { tam: 11, ancla: 'middle', color: K.tinta2 }); });
      D.t(svg, x0 + 8 * dx, y0 + h + 32, 'clase, desde (mm)', { tam: 11.5, ancla: 'end', color: K.tinta2 });
      // los puntos de cada clase; la de 2,00 mm, fuera de la escala
      S.pt = RF.map(function (f, i) {
        var v = (f - RU[i]) / (RO[i] - RU[i]);
        if (i === 0) {
          var g = grupo(svg);
          D.flecha(g, X(0), y0 + 26, X(0), y0 + 4, { color: K.tinta2, ancho: 1.6, punta: 7 });
          D.t(g, X(0) + 6, y0 + 22, '1,000', { tam: 11.5, color: K.tinta2 });
          return g;
        }
        var c = D.punto(svg, X(i), Y(v), { r: 5 }); c.setAttribute('opacity', 0); return c;
      });
      // el peso de cada clase
      var yb = 286, hb = 46, W = RO.map(function (o, i) { return Math.pow(o - RU[i], 2); }), Wm = Math.max.apply(null, W);
      S.peso = grupo(svg);
      D.t(S.peso, x0 - 4, yb - hb - 10, 'peso en el estimado, (o_k − u_k)^2', { tam: 12, peso: 650, color: AZ });
      W.forEach(function (w, i) {
        var hh = w / Wm * hb;
        s('rect', { x: X(i) - 12, y: yb - hh, width: 24, height: hh, fill: AZ, opacity: 0.8 }, S.peso);
        D.t(S.peso, X(i), yb + 15, n(w, 0), { tam: 11, ancla: 'middle', color: K.tinta2 });
      });
      // la recta del estimado
      S.recta = grupo(svg);
      camino(S.recta, [[x0, Y(0.9344)], [x0 + 8 * dx, Y(0.9344)]], { color: OL, ancho: 2.2 });
      D.t(S.recta, x0 + 8 * dx - 2, Y(0.9344) - 7, '0,9344', { tam: 12.5, peso: 700, ancla: 'end', color: OL, halo: true });
      // las cuentas de la derecha
      var xr = 432;
      function lineas(arr, y) { var g = grupo(svg); arr.forEach(function (l, i) { D.t(g, xr + (l[3] || 0), y + 21 * i, l[0], { tam: 12, peso: l[1] || 500, color: l[2] || K.tinta }); }); return g; }
      S.suma = lineas([['Σ(f − u)(o − u) = 5320,1'], ['Σ(o − u)^2 = 5693,8'], ['5320,1/5693,8 = 0,9344', 700, OL], ['0,9344 × 831,6 = 777,0 kg/h']], 60);
      S.res = lineas([['clase de 0,355 a 0,500 mm:', 700], ['r = 8,5 − 0,9344 × 5,9'], ['− 0,0656 × 50,2 = −0,31', 500, K.tinta, 14], ['δ = −0,31/1,877 = −0,16', 700, NA]], 158);
      S.rec = lineas([['f: 8,5 → 8,66 %'], ['o: 5,9 → 5,75 %'], ['u: 50,2 → 50,19 %']], 256);
      return S;
    },
    pasos: [
      { texto: 'Cada clase de la <a href="#tbl-tam-reparto">tabla del reparto</a> da su propio reparto con la <a href="#eq-tam-of">ecuación de la palanca</a>: $(f_k - u_k)/(o_k - u_k)$. Siete de las ocho caen entre 0,925 y 0,941; la de 2,00 a 2,80 mm da 1,000, pero con 0,1 % en dos corrientes no dice nada.', dur: 2, ir: function (S, t) { S.pt.forEach(function (p, i) { D.ver(p, T(t, 0.08 * i, 0.08 * i + 0.3)); }); } },
      { texto: 'En la <a href="#eq-tam-reparto">ecuación del reparto</a>, cada clase pesa con $(o_k - u_k)^2$: pesan más las que la criba cambia más. Las dos clases justo bajo la abertura, que van casi todas al cernido, pesan más que las cuatro de arriba juntas.', dur: 2, ir: function (S, t) { D.ver(S.peso, t); } },
      { texto: 'Con las ocho juntas, en puntos porcentuales, el estimado es $5320,1/5693,8$ = 0,9344, y el producto, $0,9344 \\times 831,6$ = 777,0 kg/h.', dur: 1.8, ir: function (S, t) { D.ver(S.recta, T(t, 0, 0.5)); D.ver(S.suma, T(t, 0.3, 1)); } },
      { texto: 'El estimado no pone de acuerdo los análisis. En la clase de 0,355 a 0,500 mm el residuo es $r_k = 8,5 - 0,9344 \\times 5,9 - 0,0656 \\times 50,2$ = −0,31, y con la <a href="#eq-tam-reconciliar">ecuación de la reconciliación</a>, $\\delta_k = -0,31/1,877$ = −0,16.', dur: 2.2, ir: function (S, t) { D.ver(S.res, t); } },
      { texto: 'La alimentación sube 0,16 puntos, a 8,66 %; el producto baja $0,9344 \\times 0,16$ = 0,15, a 5,75 %, y el cernido casi no se mueve. Así el balance de la clase cierra, y la corrección más grande cae en la clase crítica.', dur: 1.8, ir: function (S, t) { D.ver(S.rec, t); } }
    ]
  });

  /* Reto: las corrientes de un piso, sus recuperaciones y el reparto de mínimos cuadrados con tres clases. */

  /* ================= 6.6 La curva de partición ================= */

  /* La curva de partición del piso fino, clase por clase: los flujos de la tabla de la partición, la curva del
     modelo (caso.json, la misma de la figura de las dos curvas), el corte, la nitidez, la imperfección, el corto
     circuito y la curva con el doble de alimentación. */
  var CX = [0.17714, 0.21137, 0.25037, 0.25779, 0.26543, 0.2733, 0.28141, 0.28975, 0.29834, 0.30719, 0.3163, 0.32568, 0.33534, 0.34528, 0.35551, 0.3658, 0.37639, 0.38729, 0.3985, 0.41004, 0.42191, 0.43412, 0.44669, 0.45963, 0.47293, 0.48663, 0.50073, 0.51558, 0.53087, 0.54661, 0.56282, 0.57951, 0.59669, 0.61438];
  var CTB = [0.0218, 0.0263, 0.0426, 0.0482, 0.0551, 0.0638, 0.0744, 0.0876, 0.1037, 0.1234, 0.1473, 0.1759, 0.2101, 0.2503, 0.2972, 0.3497, 0.4089, 0.4744, 0.5455, 0.6206, 0.6977, 0.7737, 0.8452, 0.908, 0.9575, 0.9895, 1, 1, 1, 1, 1, 1, 1, 1];
  var CTD = [0.0638, 0.1018, 0.1729, 0.1905, 0.2101, 0.2318, 0.2559, 0.2824, 0.3116, 0.3436, 0.3784, 0.4161, 0.4567, 0.5001, 0.5459, 0.5929, 0.6415, 0.6911, 0.7409, 0.7899, 0.8371, 0.8811, 0.9204, 0.9535, 0.9788, 0.9948, 1, 1, 1, 1, 1, 1, 1, 1];
  var CLASES = [[1.40, 2.00, 118.6, 118.6], [1.00, 1.40, 215.4, 215.4], [0.710, 1.00, 218.8, 218.8], [0.500, 0.710, 160.1, 160.1], [0.355, 0.500, 79.7, 58.8], [0.250, 0.355, 29.7, 4.4], [0.20, 0.250, 9.1, 0.3]];
  var TCL = [1, 1, 1, 1, 0.737, 0.149, 0.029];
  ZB.animacion('particion', {
    vista: [0, 0, 640, 296],
    alt: 'Gráfica de la curva de partición del piso de 0,500 mm, con el tamaño en escala logarítmica de 0,2 a 2,2 mm. Cada clase de la tabla es un escalón a la altura de su T: 1,000 para las cuatro clases de 0,500 a 2,00 mm, 0,737 para la de 0,355 a 0,500, 0,149 para la de 0,250 a 0,355 y 0,029 para la menor que 0,250. La curva del modelo pasa por los escalones y corta en 0,391 mm, bajo la abertura de 0,500 mm; vale 25 % en 0,345 y 75 % en 0,430 mm, con nitidez 0,80 e imperfección 0,11, y se queda en 0,02 en los finos. Con el doble de alimentación, punteada, corta en 0,345 mm con nitidez 0,70.',
    montar: function (svg) {
      var S = {}, x0 = 64, w = 330, y0 = 40, h = 196, lo = Math.log(0.2), hi = Math.log(2.2);
      var X = function (x) { return x0 + (Math.log(x) - lo) / (hi - lo) * w; }, Y = function (v) { return y0 + h - v * h; };
      S.X = X; S.Y = Y;
      [[0.25, '0,25'], [0.355, '0,355'], [0.5, '0,5'], [0.71, '0,71'], [1, '1'], [1.4, '1,4'], [2, '2']].forEach(function (p) {
        s('line', { x1: X(p[0]), x2: X(p[0]), y1: y0, y2: y0 + h, stroke: K.rejilla, 'stroke-width': 1 }, svg);
        D.t(svg, X(p[0]), y0 + h + 16, p[1], { tam: 11.5, ancla: 'middle', color: K.tinta2 });
      });
      [0, 0.25, 0.5, 0.75, 1].forEach(function (v) {
        s('line', { x1: x0, x2: x0 + w, y1: Y(v), y2: Y(v), stroke: K.rejilla, 'stroke-width': 1 }, svg);
        D.t(svg, x0 - 6, Y(v) + 4, n(100 * v, 0), { tam: 11.5, ancla: 'end', color: K.tinta2 });
      });
      s('path', { d: 'M' + x0 + ' ' + y0 + 'V' + (y0 + h) + 'H' + (x0 + w), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      D.t(svg, x0 - 4, y0 - 14, 'T(x), % de cada tamaño que sale en el rechazo', { tam: 12.5, peso: 650 });
      D.t(svg, x0 + w, y0 + h + 34, 'x (mm), escala logarítmica', { tam: 12, ancla: 'end', color: K.tinta2 });
      // la abertura
      camino(svg, [[X(0.5), y0], [X(0.5), y0 + h]], { color: K.tinta2, ancho: 1.2, guion: '2 3' });
      // los escalones de las clases
      S.esc = CLASES.map(function (c, i) {
        var g = grupo(svg);
        s('line', { x1: X(c[0]), x2: X(c[1]), y1: Y(TCL[i]), y2: Y(TCL[i]), stroke: OL, 'stroke-width': 4, 'stroke-linecap': 'butt' }, g);
        return g;
      });
      // la curva del modelo y la del doble
      var pb = [], pd = [];
      CX.forEach(function (x, i) { if (x >= 0.2) { pb.push([x, CTB[i]]); pd.push([x, CTD[i]]); } });
      pb.push([2.2, 1]); pd.push([2.2, 1]);
      S.cb = D.trazo(svg, D.camino(pb, X, Y), { color: K.tinta, ancho: 2 });
      S.cd = D.trazo(svg, D.camino(pd, X, Y), { color: OL, ancho: 2, guion: '6 4' });
      // corte, nitidez
      S.x50 = grupo(svg);
      camino(S.x50, [[x0, Y(0.5)], [X(0.391), Y(0.5)], [X(0.391), y0 + h]], { color: AZ, ancho: 1.6, guion: '5 4' });
      D.punto(S.x50, X(0.391), Y(0.5), { r: 4.5, color: AZ, borde: AZ });
      S.x2575 = grupo(svg);
      [[0.25, 0.345], [0.75, 0.430]].forEach(function (p) {
        camino(S.x2575, [[x0, Y(p[0])], [X(p[1]), Y(p[0])], [X(p[1]), y0 + h]], { color: K.tinta2, ancho: 1.3, guion: '3 3' });
        D.punto(S.x2575, X(p[1]), Y(p[0]), { r: 4, color: K.tinta2, borde: K.tinta2 });
      });
      S.tau = grupo(svg);
      D.flecha(S.tau, 86, 132, X(0.212), Y(0.02) - 6, { color: NA, ancho: 1.6, punta: 7 });
      D.t(S.tau, 76, 124, 'τ = 0,02', { tam: 12.5, peso: 700, color: NA, halo: true });
      // las cuentas de la derecha
      var xr = 416;
      function lineas(arr, y) { var g = grupo(svg); arr.forEach(function (l, i) { D.t(g, xr, y + 20 * i, l[0], { tam: 11.5, peso: l[1] || 500, color: l[2] || K.tinta }); }); return g; }
      S.l1 = lineas([['0,500 a 2,00 mm: T = 1,000', 650], ['160,1 de 160,1 kg/h, y así arriba']], 46);
      S.l2 = lineas([['0,355 a 0,500: 58,8/79,7 = 0,737', 650]], 98);
      S.l3 = lineas([['0,250 a 0,355: 4,4/29,7 = 0,149', 650], ['menor que 0,250: 0,3/9,1 = 0,029', 650]], 130);
      S.l4 = lineas([['corte: x_{50} = 0,391 mm', 700, AZ]], 182);
      S.l5 = lineas([['κ = 0,345/0,430 = 0,80'], ['I = 0,085/(2 × 0,391) = 0,11']], 210);
      S.l7 = lineas([['el doble: x_{50} = 0,345, κ = 0,70', 700, OL]], 262);
      return S;
    },
    pasos: [
      { texto: 'Con la <a href="#eq-tam-t">definición de la curva de partición</a> en su forma de diferencias, cada clase de la <a href="#tbl-tam-particion">tabla de la partición</a> da un escalón: lo que sale en el producto dividido por lo que trae la alimentación. Las cuatro clases de 0,500 a 2,00 mm salen enteras en el producto: $T$ = 1,000.', dur: 1.8, ir: function (S, t) { for (var i = 0; i < 4; i++) D.ver(S.esc[i], T(t, 0.1 * i, 0.1 * i + 0.4)); D.ver(S.l1, T(t, 0.5, 1)); } },
      { texto: 'La clase de 0,355 a 0,500 mm deja 58,8 de sus 79,7 kg/h en el producto: $T$ = 0,737. Tres cuartas partes de los aglomerados que no deberían estar en el producto se quedan en él.', dur: 1.8, ir: function (S, t) { D.ver(S.esc[4], T(t, 0, 0.5)); D.ver(S.l2, T(t, 0.4, 1)); } },
      { texto: 'Más abajo, $4,4/29,7$ = 0,149 y $0,3/9,1$ = 0,029. Los escalones son promedios sobre cada clase; la curva del modelo, en negro, pasa por ellos y sube en forma de S.', dur: 2, ir: function (S, t) { D.ver(S.esc[5], T(t, 0, 0.3)); D.ver(S.esc[6], T(t, 0.15, 0.45)); D.ver(S.l3, T(t, 0.2, 0.5)); S.cb.dibujar(T(t, 0.45, 1)); } },
      { texto: 'El corte es el tamaño que sale mitad y mitad: $x_{50}$ = 0,391 mm, bajo la abertura de 0,500 mm, la línea punteada vertical.', dur: 1.6, ir: function (S, t) { D.ver(S.x50, T(t, 0, 0.6)); D.ver(S.l4, T(t, 0.4, 1)); } },
      { texto: 'La curva vale 25 % en 0,345 mm y 75 % en 0,430 mm. Con la <a href="#eq-tam-kappa">definición de la nitidez</a>, la nitidez es $\\kappa = 0,345/0,430$ = 0,80, y la imperfección, $I = (0,430 - 0,345)/(2 \\times 0,391)$ = 0,11.', dur: 2, ir: function (S, t) { D.ver(S.x2575, T(t, 0, 0.6)); D.ver(S.l5, T(t, 0.4, 1)); } },
      { texto: 'En los finos la curva no baja a cero: se queda en el corto circuito, $\\tau$ = 0,02. Son los finos pegados a los aglomerados, que llegan al rechazo sin clasificarse.', dur: 1.6, ir: function (S, t) { D.ver(S.tau, t); } },
      { texto: 'Con el doble de alimentación, la curva punteada se corre hacia los finos y se tiende: corta en 0,345 mm, con nitidez 0,70, y el producto llega a 10,0 % de finos.', dur: 1.8, ir: function (S, t) { S.cd.dibujar(T(t, 0, 0.6)); D.ver(S.l7, T(t, 0.4, 1)); } }
    ]
  });

  /* Treinta y nueve intentos contra mil: la misma partícula de 0,9 veces la abertura del piso fino, en la criba
     (15 sacudidas por segundo, 9,6 s, la cuarta parte del lecho sobre la malla, 0,27) y en el tamiz de ensayo (2,5 por segundo, 600 s, φ cerca de
     0,7), con el doble de alimentación (el lecho a la descarga de 1,75 a 3,6 mm, la mitad de los intentos) y el
     largo que haría falta. */
  var P9 = FOA5 * 0.01;
  ZB.animacion('intentos', {
    vista: [0, 0, 640, 306],
    alt: 'Arriba, la probabilidad de paso de una partícula de 0,9 veces la abertura del piso fino: 0,0038. A la izquierda, la criba: 15 sacudidas por segundo durante 9,6 s, con la cuarta parte del lecho sobre la malla, dan unos 39 intentos, y pasa el 14 %. A la derecha, el tamiz de ensayo: 2,5 por segundo durante 600 s con el 70 % sobre la malla, unos 1000 intentos, y pasa el 98 %. Con el doble de alimentación, la criba da unos 19 intentos y pasa el 7 %. Abajo, a escala, los 2,4 m de la criba, los 8 m de la criba más larga y los 30 a 60 m que harían falta.',
    montar: function (svg) {
      var S = {};
      D.t(svg, 20, 28, 'p = F_{oa} (1 − x/a)^2 = 0,376 × 0,01 = 0,0038, con x = 0,9 a', { tam: 13.5, peso: 700 });
      // la criba, de lado
      S.criba = grupo(svg);
      D.t(S.criba, 20, 62, 'En la criba', { tam: 12.5, peso: 700, color: OL });
      camino(S.criba, [[24, 108], [290, 108]], { color: OL, ancho: 2.4, guion: '5 3' });
      s('rect', { x: 24, y: 96, width: 266, height: 12, fill: SO.relleno, stroke: SO.oscuro, 'stroke-width': 0.8 }, S.criba);
      D.flecha(S.criba, 150, 74, 210, 74, { color: K.tinta2, ancho: 1.4, punta: 6 });
      D.t(S.criba, 216, 78, '0,25 m/s', { tam: 11.5, color: K.tinta2 });
      D.t(S.criba, 20, 130, 'N = 15/s × 9,6 s × 0,27 ≈ 39', { tam: 12.5 });
      S.doble = grupo(svg);
      s('rect', { x: 24, y: 84, width: 266, height: 24, fill: SO.relleno, stroke: SO.oscuro, 'stroke-width': 0.8 }, S.doble);
      camino(S.doble, [[24, 108], [290, 108]], { color: OL, ancho: 2.4, guion: '5 3' });
      D.t(S.doble, 20, 150, 'el doble: N = 15/s × 9,6 s × 0,135 ≈ 19', { tam: 12.5, color: NA, peso: 650 });
      // el tamiz de ensayo
      S.tamiz = grupo(svg);
      D.t(S.tamiz, 340, 62, 'En el tamiz de ensayo', { tam: 12.5, peso: 700, color: AZ });
      s('rect', { x: 344, y: 84, width: 260, height: 30, rx: 3, fill: 'none', stroke: K.tinta2, 'stroke-width': 1.4 }, S.tamiz);
      camino(S.tamiz, [[346, 108], [602, 108]], { color: AZ, ancho: 2.4, guion: '5 3' });
      s('rect', { x: 346, y: 103, width: 256, height: 5, fill: SO.relleno, stroke: SO.oscuro, 'stroke-width': 0.6 }, S.tamiz);
      D.t(S.tamiz, 340, 130, 'N = 2,5/s × 600 s × 0,7 = 1050', { tam: 12.5 });
      // lo que pasa
      var xb = 24, wb = 250;
      D.t(svg, 20, 178, 'Lo que pasa, 1 − e^{−Np}', { tam: 12.5, peso: 650 });
      s('rect', { x: xb, y: 186, width: wb, height: 16, fill: 'none', stroke: K.guia, 'stroke-width': 1 }, svg);
      s('rect', { x: 344, y: 186, width: wb, height: 16, fill: 'none', stroke: K.guia, 'stroke-width': 1 }, svg);
      S.bc = barra(svg, xb, 186, wb, 16, OL);
      S.bt = barra(svg, 344, 186, wb, 16, AZ);
      S.lc = oculto(svg, xb, 222, 'pasa el 14 % en la criba', { tam: 12.5, peso: 700, color: OL });
      S.lt = oculto(svg, 344, 222, 'pasa el 98 % en el tamiz', { tam: 12.5, peso: 700, color: AZ });
      S.ld = oculto(svg, xb, 222, 'pasa el 7 % con el doble', { tam: 12.5, peso: 700, color: NA });
      // el largo que haría falta, a escala: 60 m en 560 px
      S.largo = grupo(svg);
      var k = 560 / 60, yl = 272;
      s('line', { x1: 40, x2: 40 + 60 * k, y1: yl, y2: yl, stroke: K.rejilla, 'stroke-width': 8 }, S.largo);
      s('line', { x1: 40 + 30 * k, x2: 40 + 60 * k, y1: yl, y2: yl, stroke: K.amarilloClaro, 'stroke-width': 8 }, S.largo);
      s('line', { x1: 40, x2: 40 + 2.4 * k, y1: yl, y2: yl, stroke: OL, 'stroke-width': 8 }, S.largo);
      s('line', { x1: 40, x2: 40 + 8 * k, y1: yl + 12, y2: yl + 12, stroke: K.tinta2, 'stroke-width': 3 }, S.largo);
      D.t(S.largo, 40, yl - 12, '2,4 m', { tam: 11.5, color: OL, peso: 650 });
      D.t(S.largo, 40 + 8 * k + 6, yl + 16, '8 m, la más larga', { tam: 11.5, color: K.tinta2 });
      D.t(S.largo, 40 + 30 * k, yl - 12, '30 a 60 m: lo que el tamiz hace en 1 a 3 min', { tam: 11.5, color: K.tinta2 });
      return S;
    },
    pasos: [
      { texto: 'Una partícula de 0,9 veces la abertura del piso fino tiene, con la <a href="#eq-tam-p">ecuación de la probabilidad de paso</a>, una probabilidad de paso de $0,376 \\times 0,01$ = 0,0038 en cada intento. Cuántos intentos tiene decide si pasa.', dur: 1.4, ir: function (S, t) {} },
      { texto: 'En la criba, la malla vibra 15 veces por segundo y el café tarda $2,4/0,25$ = 9,6 s en recorrerla; solo la cuarta parte del lecho, 0,27, toca la malla. Son unos 39 intentos, y pasa $1 - e^{-39 \\times 0,0038}$ = 14 % de esas partículas.', dur: 2.4, ir: function (S, t) { D.ver(S.criba, T(t, 0, 0.4)); S.bc.largo(0.135 * T(t, 0.5, 0.9)); D.ver(S.lc, T(t, 0.7, 1)); } },
      { texto: 'En el tamiz de ensayo, a 2,5 encuentros por segundo durante 10 minutos y con casi el 70 % de las partículas sobre la malla, son $2,5 \\times 600 \\times 0,7$ = 1050, unos 1000 intentos, y pasa el 98 %. La criba y el ensayo no ven la misma partición.', dur: 2.2, ir: function (S, t) { D.ver(S.tamiz, T(t, 0, 0.4)); S.bt.largo(0.981 * T(t, 0.4, 0.9)); D.ver(S.lt, T(t, 0.7, 1)); } },
      { texto: 'Con el doble de alimentación, el lecho a la descarga pasa de 1,75 a 3,6 mm y la fracción que toca la malla cae a la mitad: unos 19 intentos, y pasa el 7 %. Por eso el corte baja y el producto se llena de finos.', dur: 2.2, ir: function (S, t) { D.ver(S.doble, T(t, 0, 0.5)); S.bc.largo(L(0.135, 0.070, T(t, 0.3, 0.8))); D.ver(S.lc, 1 - T(t, 0.3, 0.6)); D.ver(S.ld, T(t, 0.6, 1)); } },
      { texto: 'Visto al revés, la separación que un tamiz de laboratorio logra en 1 a 3 minutos pediría una criba de 30 a 60 m de largo, y la más larga que se fabrica mide 8 m. El corte de una criba siempre queda bajo sus aberturas más grandes.', dur: 1.8, ir: function (S, t) { D.ver(S.largo, t); } }
    ]
  });

  /* Reto: T de dos clases, la nitidez y la imperfección, y la curva de Vaillant. */

  /* ================= 6.7 Cribas en la planta ================= */

  /* El lecho que se engruesa sobre el piso fino: la ecuación de Metso con el rechazo de 776,5 kg/h y de 1583 kg/h,
     las reglas de 2, 3 y 5 veces la abertura a la descarga y la capa de una abertura que toca la malla. */
  ZB.animacion('lecho', {
    vista: [0, 0, 640, 300],
    alt: 'El piso fino visto de lado, de la entrada a la descarga, con el lecho de café sobre la malla a escala vertical: 1,87 mm a la entrada y 1,75 mm a la descarga con 1000 kg/h, es decir 3,5 veces la abertura. A la descarga, tres líneas marcan 2, 3 y 5 veces la abertura. La capa de abajo, de 0,5 mm, es la que toca la malla. Con 2000 kg/h el lecho pasa a 3,74 mm a la entrada y 3,6 mm a la descarga, 7,1 veces la abertura, por encima de todas las reglas.',
    montar: function (svg) {
      var S = {}, xa = 70, xb = 470, ym = 244, k = 28;     // 1 mm de lecho = 28 px
      S.fr = franja(svg, [
        ['Piso fino: 1,2 × 2,4 m; el café avanza a 0,25 m/s', 'recibe 831,6 kg/h y descarga 776,5 kg/h de producto'],
        ['Q = 776,5/470 = 1,652 m³/h', 'h_b = 1,652/[3,6 × 0,25 × (1,2 − 0,15)] = 1,75 mm'],
        ['h_b/a = 1,75/0,500 = 3,5', 'entre 2 y 5 de Metso; apenas sobre las 3 de un material liviano'],
        ['con 2000 kg/h: Q = 1583/470 = 3,368 m³/h', 'h_b = 3,368/0,945 = 3,6 mm: 7,1 veces la abertura'],
        ['la capa que toca la malla sigue de 0,5 mm', 'φ = 0,5/3,6 = 0,14, la mitad: el rechazo fija el ancho']
      ], 20, 26);
      function lecho(hin, hout) {
        return 'M' + xa + ' ' + ym + 'L' + xa + ' ' + (ym - hin * k) + 'L' + xb + ' ' + (ym - hout * k) + 'L' + xb + ' ' + ym + 'Z';
      }
      S.l1 = s('path', { d: lecho(1.872, 1.748), fill: SO.relleno, stroke: SO.oscuro, 'stroke-width': 1.2 }, svg);
      S.l2 = s('path', { d: lecho(3.741, 3.565), fill: SO.relleno, stroke: SO.oscuro, 'stroke-width': 1.2, opacity: 0 }, svg);
      S.capa = s('rect', { x: xa, y: ym - 0.5 * k, width: xb - xa, height: 0.5 * k, fill: SO.medio, opacity: 0 }, svg);
      S.borde1 = camino(svg, [[xa, ym - 1.872 * k], [xb, ym - 1.748 * k]], { color: SO.oscuro, ancho: 1.6, guion: '5 4' });
      S.borde1.setAttribute('opacity', 0);
      camino(svg, [[xa - 10, ym], [xb + 10, ym]], { color: OL, ancho: 3, guion: '5 3' });
      D.t(svg, xa, ym + 18, 'malla de 0,500 mm', { tam: 11.5, peso: 650, color: OL });
      D.flecha(svg, 22, ym - 30, xa - 6, ym - 30, { color: K.tinta, ancho: 2, punta: 8 });
      D.t(svg, 22, ym - 40, 'entra', { tam: 11.5 });
      D.flecha(svg, xb + 4, ym - 8, xb + 30, ym + 26, { color: OL, ancho: 2, punta: 8 });
      D.t(svg, xb + 36, ym + 30, 'rechazo', { tam: 11.5, color: OL });
      D.flecha(svg, 220, ym + 30, 300, ym + 30, { color: K.tinta2, ancho: 1.4, punta: 6 });
      D.t(svg, 306, ym + 34, '0,25 m/s', { tam: 11.5, color: K.tinta2 });
      S.cifras = grupo(svg);
      D.t(S.cifras, xa + 6, ym - 1.872 * k - 8, '1,87 mm', { tam: 12, peso: 650, halo: true });
      D.t(S.cifras, xb - 6, ym - 1.748 * k - 8, '1,75 mm', { tam: 12, peso: 650, ancla: 'end', halo: true });
      S.cifras2 = grupo(svg);
      D.t(S.cifras2, xa + 6, ym - 3.741 * k - 8, '3,74 mm', { tam: 12, peso: 650, halo: true, color: NA });
      D.t(S.cifras2, xb - 6, ym - 3.565 * k - 8, '3,6 mm', { tam: 12, peso: 650, ancla: 'end', halo: true, color: NA });
      // las reglas a la descarga
      S.reglas = grupo(svg);
      [[2, '2a', K.tinta2], [3, '3a: liviano', K.tinta], [5, '5a', K.tinta2]].forEach(function (q) {
        var y = ym - q[0] * 0.5 * k;
        camino(S.reglas, [[xb + 4, y], [xb + 60, y]], { color: q[2], ancho: 1.4, guion: '4 3' });
        D.t(S.reglas, xb + 66, y + 4, q[1], { tam: 11.5, color: q[2] });
      });
      S.lcapa = oculto(svg, 200, ym - 0.25 * k + 4, 'la capa que toca la malla: a = 0,5 mm', { tam: 11.5, peso: 650, color: K.blanco });
      return S;
    },
    pasos: [
      { texto: 'El piso fino de la criba del caso, visto de lado y con el lecho a escala vertical: recibe 831,6 kg/h, el café avanza a 0,25 m/s y descarga 776,5 kg/h de producto, que es su rechazo.', dur: 1.6, ir: function (S, t) { S.fr(0, T(t, 0, 0.5)); } },
      { texto: 'Con la <a href="#eq-tam-lecho">ecuación del lecho</a> y el caudal del rechazo, $Q = 776,5/470$ = 1,652 m³/h y $h_b = 1,652/[3,6 \\times 0,25 \\times (1,2 - 0,15)]$ = 1,75 mm a la descarga; a la entrada, con 831,6 kg/h, 1,87 mm.', dur: 2, ir: function (S, t) { S.fr(1, T(t, 0, 0.4)); D.ver(S.cifras, T(t, 0.4, 1)); } },
      { texto: 'A la descarga, el lecho no debe pasar de 3 a 5 veces la abertura ni bajar de 2, y un material liviano se queda en 3. Con 1,75 mm son 3,5 veces: dentro de la regla de Metso, apenas por encima de las 3 veces de un material liviano.', dur: 2, ir: function (S, t) { S.fr(2, T(t, 0, 0.4)); D.ver(S.reglas, T(t, 0.3, 1)); } },
      { texto: 'Con 2000 kg/h el rechazo es de 1583 kg/h: $Q$ = 3,368 m³/h y $h_b$ = 3,6 mm a la descarga, 7,1 veces la abertura, fuera de todas las reglas.', dur: 2, ir: function (S, t) {
        S.fr(3, T(t, 0, 0.4)); var u = T(t, 0.2, 0.8);
        S.l2.setAttribute('opacity', u); S.borde1.setAttribute('opacity', u); D.ver(S.cifras, 1 - u); D.ver(S.cifras2, T(t, 0.6, 1));
      } },
      { texto: 'La capa que toca la malla sigue siendo del grosor de la abertura, 0,5 mm, y encima hay el doble de café: $\\varphi$ cae a la mitad. El rechazo fija el ancho de la criba.', dur: 1.8, ir: function (S, t) { S.fr(4, T(t, 0, 0.4)); S.capa.setAttribute('opacity', 0.85 * T(t, 0.2, 0.7)); D.ver(S.lcapa, T(t, 0.5, 1)); } }
    ]
  });

  /* El método de Metso, factor por factor, con los números del ejemplo del área: la capacidad básica llevada a
     0,500 mm, los seis factores que no valen 1, el área que pide y la del piso. */
  var MET = [['q_b en 1 mm, de la tabla de Metso', 6.7], ['× 0,5^{0,6}: q_b en 0,500 mm', 4.4], ['× k_B = 0,59: 85,7 % de rechazo', 2.596], ['× k_C = 0,41: 1,1 % bajo a/2', 1.0644], ['× k_D = 0,9: el segundo piso', 0.958], ['× k_F = 0,52: sólido de 1,4 t/m³', 0.4981], ['× k_G = 0,75: 37,6 % abierta', 0.3736], ['× k_K = 0,9: horizontal, lineal', 0.3362]];
  ZB.animacion('metso', {
    vista: [0, 0, 640, 330],
    alt: 'Barras horizontales de la capacidad del piso fino, en t/(h·m²): 6,7 en 1 mm, 4,4 llevada a 0,500 mm con la potencia 0,6, y después multiplicada por cada factor que no vale 1: 2,60 con k_B, 1,06 con k_C, 0,96 con k_D, 0,50 con k_F, 0,37 con k_G y 0,34 con k_K. Abajo, el área que pide, 0,35 m² a 1000 kg/h y 0,70 m² a 2000, dibujada contra los 2,88 m² del piso de 1,2 × 2,4 m.',
    montar: function (svg) {
      var S = {}, xb = 236, sc = 300 / 6.7, y0 = 36, h = 22;
      D.t(svg, 20, 22, 'Capacidad específica, t/(h·m²) de finos', { tam: 12.5, peso: 700 });
      S.f = MET.map(function (m, i) {
        var y = y0 + i * h, g = grupo(svg);
        D.t(g, 20, y + 13, m[0], { tam: 11.5, color: i < 2 ? K.tinta : K.tinta2 });
        var b = barra(g, xb, y + 3, m[1] * sc, h - 7, i === MET.length - 1 ? OL : SO.medio);
        D.t(g, xb + m[1] * sc + 6, y + 13, n(m[1], i < 2 ? 1 : 2), { tam: 11.5, peso: 650 });
        return { g: g, b: b };
      });
      // el área, a escala: 1 m = 30 px
      var ka = 30, ya = 236;
      S.area = grupo(svg);
      s('rect', { x: 20, y: ya, width: 2.4 * ka, height: 1.2 * ka, fill: K.zona, stroke: OL, 'stroke-width': 1.6 }, S.area);
      D.t(S.area, 20, ya + 1.2 * ka + 16, 'el piso: 2,88 m²', { tam: 11.5, color: OL, peso: 650 });
      var a1 = Math.sqrt(0.35) * ka, a2 = Math.sqrt(0.70) * ka;
      s('rect', { x: 20, y: ya + 1.2 * ka - a1, width: a1, height: a1, fill: SO.medio, opacity: 0.85 }, S.area);
      s('rect', { x: 20, y: ya + 1.2 * ka - a2, width: a2, height: a2, fill: 'none', stroke: NA, 'stroke-width': 1.6, 'stroke-dasharray': '4 3' }, S.area);
      D.t(S.area, 112, ya + 10, 'A = 0,1186/0,34 = 0,35 m², a 1000 kg/h', { tam: 12, peso: 650 });
      D.t(S.area, 112, ya + 28, '0,70 m² a 2000 kg/h (punteado); con S = 1,4, 0,49 y 0,98', { tam: 12, color: NA });
      S.lecho = oculto(svg, 112, ya + 52, 'el lecho a 2000 kg/h: 7,1 veces la abertura; manda el lecho', { tam: 12, peso: 700, color: K.tinta });
      return S;
    },
    pasos: [
      { texto: 'La capacidad básica de Metso es de 6,7 t/(h·m²) en una separación de 1 mm, y su curva no baja de 0,87 mm. La potencia 0,6 de McCabe la lleva a 0,500 mm: $6,7 \\times 0,5^{0,6}$ = 4,4.', dur: 1.8, ir: function (S, t) { for (var i = 0; i < 2; i++) { D.ver(S.f[i].g, T(t, 0.3 * i, 0.3 * i + 0.3)); S.f[i].b.largo(T(t, 0.3 * i + 0.1, 0.3 * i + 0.5)); } } },
      { texto: 'Los dos factores que más pesan en este piso: casi toda la alimentación es rechazo, 85,7 %, y $k_B$ = 0,59; casi no hay finos menores que la mitad de la separación, 1,1 %, y $k_C$ = 0,41.', dur: 2, ir: function (S, t) { for (var i = 2; i < 4; i++) { var a = 0.4 * (i - 2); D.ver(S.f[i].g, T(t, a, a + 0.3)); S.f[i].b.largo(T(t, a + 0.1, a + 0.5)); } } },
      { texto: 'Después, el segundo piso, 0,9; el sólido de 1,4 t/m³, 0,52; el área abierta de 37,6 % entre 50 %, 0,75, y la criba horizontal de movimiento lineal, 0,9. Los que valen 1 no cambian nada. Con la <a href="#eq-tam-area">ecuación del área de Metso</a>, $q_s$ = 0,34 t/(h·m²).', dur: 2.6, ir: function (S, t) { for (var i = 4; i < 8; i++) { var a = 0.2 * (i - 4); D.ver(S.f[i].g, T(t, a, a + 0.2)); S.f[i].b.largo(T(t, a + 0.05, a + 0.3)); } } },
      { texto: 'Los finos de la alimentación son $831,6 \\times 0,1426$ = 118,6 kg/h: el área es $0,1186/0,34$ = 0,35 m², y 0,70 m² a 2000 kg/h. El piso tiene 2,88 m²: con el área, el piso aguantaría el doble con holgura.', dur: 2.2, ir: function (S, t) { D.ver(S.area, t); } },
      { texto: 'El lecho dice otra cosa: a 2000 kg/h llega a 7,1 veces la abertura. Aquí manda el lecho, porque el método del área dimensiona para los finos, que son pocos, y el trabajo difícil del piso es llevar el 93 % de la alimentación sobre la tela.', dur: 2, ir: function (S, t) { D.ver(S.lecho, t); } }
    ]
  });

  /* Reto: la intensidad de vibración y la velocidad crítica de un trommel, el lecho a la descarga y el área por el
     método de Metso. */

  /* ================= 6.8 Preparar la materia prima ================= */

  /* La seleccionadora del ejemplo de la naranja: sus tres corrientes, con la fracción de fruta buena en cada una,
     los aciertos y los errores en kilogramos por hora y las dos recuperaciones. */
  ZB.animacion('color', {
    vista: [0, 0, 640, 320],
    alt: 'La seleccionadora por color con sus tres corrientes. Entran 10 000 kg/h de naranja con 94 % de fruta buena: 9400 kg/h buenas y 600 defectuosas. El producto, 9367 kg/h con 99 % de fruta buena, lleva 9273 kg/h buenas y 94 defectuosas; el rechazo, 633 kg/h con 20 % de buena, lleva 127 buenas y 506 defectuosas. La máquina deja pasar el 98,7 % de la fruta buena y saca el 84,4 % de la defectuosa; su eficacia es 0,833.',
    montar: function (svg) {
      var S = {};
      caja(svg, 250, 78, 140, 64, { fill: K.papel, ancho: 1.8 });
      D.t(svg, 320, 104, 'Seleccionadora', { tam: 12.5, peso: 700, ancla: 'middle' });
      D.t(svg, 320, 122, 'por color', { tam: 12.5, peso: 700, ancla: 'middle' });
      tubo(svg, [[20, 110], [250, 110]]);
      tubo(svg, [[390, 110], [620, 110]], { color: OL });
      tubo(svg, [[320, 142], [320, 204]], { color: NA });
      // la composición de cada corriente: buena en oliva, defectuosa en naranja
      function comp(x, y, w, yb) {
        var g = grupo(svg, 1);
        s('rect', { x: x, y: y, width: w * yb, height: 8, fill: OL }, g);
        s('rect', { x: x + w * yb, y: y, width: w * (1 - yb), height: 8, fill: NA }, g);
        return g;
      }
      D.t(svg, 20, 58, 'Naranja', { tam: 12.5, peso: 700 });
      D.t(svg, 20, 76, '10 000 kg/h · y_F = 0,94', { tam: 12 });
      comp(20, 88, 160, 0.94);
      D.t(svg, 400, 58, 'Producto', { tam: 12.5, peso: 700, color: OL });
      S.fP = oculto(svg, 400, 76, '9367 kg/h · y_P = 0,99', { tam: 12 });
      S.cP = comp(400, 88, 160, 0.99); S.cP.setAttribute('opacity', 0);
      D.t(svg, 332, 172, 'Rechazo', { tam: 12.5, peso: 700, color: NA });
      S.fR = oculto(svg, 332, 190, '633 kg/h · y_R = 0,20', { tam: 12 });
      S.cR = comp(332, 198, 160, 0.20); S.cR.setAttribute('opacity', 0);
      // los kilogramos por hora de cada clase de fruta
      S.kF = oculto(svg, 20, 136, '9400 buenas · 600 defectuosas', { tam: 12, color: K.tinta2 });
      S.kP = oculto(svg, 400, 136, '9273 buenas · 94 defectuosas', { tam: 12, color: K.tinta2 });
      S.kR = oculto(svg, 332, 226, '127 buenas · 506 defectuosas', { tam: 12, color: K.tinta2 });
      // los errores
      S.e1 = oculto(svg, 400, 156, '94 kg/h: lo que reclama el cliente', { tam: 12, peso: 700, color: NA });
      S.e2 = oculto(svg, 332, 246, '127 kg/h: a la planta de jugo', { tam: 12, peso: 700, color: OL });
      // las recuperaciones
      S.rec = grupo(svg);
      D.t(S.rec, 20, 272, 'buena en el producto: 9273/9400 = 0,987', { tam: 12.5, peso: 650, color: OL });
      D.t(S.rec, 20, 292, 'defectuosa en el rechazo: 506/600 = 0,844', { tam: 12.5, peso: 650, color: NA });
      D.t(S.rec, 20, 312, 'eficacia = 0,987 × 0,844 = 0,833', { tam: 12.5, peso: 700 });
      return S;
    },
    pasos: [
      { texto: 'La seleccionadora del <a href="#exm-tam-color">ejemplo de la naranja</a>, con sus tres corrientes. Entran 10 000 kg/h de naranja con 94 % de fruta buena, en oliva en la barra, y 6 % de defectuosa, en naranja.', dur: 1.6, ir: function (S, t) {} },
      { texto: 'Los balances total y de fruta buena, como en la <a href="#eq-tam-of">ecuación de la palanca</a>: $\\dot m_P/\\dot m_F = (0,94 - 0,20)/(0,99 - 0,20)$ = 0,9367. Salen 9367 kg/h de producto, con 99 % de fruta buena, y 633 kg/h de rechazo, con 20 %.', dur: 2.2, ir: function (S, t) { D.ver(S.fP, T(t, 0, 0.4)); D.ver(S.cP, T(t, 0.2, 0.6)); D.ver(S.fR, T(t, 0.4, 0.8)); D.ver(S.cR, T(t, 0.6, 1)); } },
      { texto: 'En kilogramos por hora: entran 9400 buenas y 600 defectuosas. El producto lleva $0,99 \\times 9367$ = 9273 buenas y 94 defectuosas; el rechazo, $0,20 \\times 633$ = 127 buenas y 506 defectuosas.', dur: 2.2, ir: function (S, t) { D.ver(S.kF, T(t, 0, 0.4)); D.ver(S.kP, T(t, 0.3, 0.7)); D.ver(S.kR, T(t, 0.6, 1)); } },
      { texto: 'Con la <a href="#eq-tam-eficacia">ecuación de la eficacia</a>, la máquina deja pasar el 98,7 % de la fruta buena y saca el 84,4 % de la defectuosa: su eficacia es 0,833.', dur: 1.8, ir: function (S, t) { D.ver(S.rec, t); } },
      { texto: 'Los errores tienen destino: los 94 kg/h de fruta defectuosa que quedan en el producto son los que un cliente reclama, y los 127 kg/h de naranja buena del rechazo van a la planta de jugo. Un ajuste más estricto baja el primero y sube el segundo.', dur: 2, ir: function (S, t) { D.ver(S.e1, T(t, 0, 0.5)); D.ver(S.e2, T(t, 0.4, 0.9)); } }
    ]
  });

  /* Reto: las corrientes de una seleccionadora, sus recuperaciones y su eficacia, y lo que lleva cada salida. */
})();
