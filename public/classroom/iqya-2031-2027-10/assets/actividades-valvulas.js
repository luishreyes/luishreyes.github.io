/* Las animaciones por pasos de los capítulos 13, «Tanques, válvulas, tuberías y medición», y 12, «Ventiladores,
   compresores y vacío», del libro, traídas con el mismo código y los mismos números para la presentación de
   válvulas, control y vacío de 2027-10. Son copias de libro/figuras/valvulas-tuberias-y-medicion-de-flujo/actividades.js
   y de libro/figuras/ventiladores-compresores-y-vacio/actividades.js del repositorio del libro, solo con las
   animaciones: los retos, con sus soluciones, se quedan en el libro. Necesitan la carta de la bomba del caso
   (carta-bombas.js) antes de dibujo.js. No se editan aquí; cuando cambian en el libro se vuelven a copiar. Corren
   con el motor de /classroom/estilo-libro/actividades/. */
/* Las animaciones y los retos del capítulo 13, «Tanques, válvulas, tuberías y medición». Se escriben aquí directo (en
   bombas pasan por el taller interactivo/). Usan el motor de figuras/comun/actividades.js y las piezas de
   figuras/comun/dibujo.js; los colores salen de la paleta del libro (ZB.dib.col y PALETA), nunca a mano.
   Los números salen del texto del capítulo y de los modelos del caso: herramientas/control-linea-agua.py (caso.json: la
   bomba de 190 mm contra la línea sin la válvula, las características instaladas del caso, la cavitación y la placa) y
   herramientas/tanque-llegada.py (la reserva, el respiradero con la API 2000 y el transmisor). La animación de la
   característica instalada reemplaza al video de Manim (escenas/libro/caracteristica_instalada.py del público) con sus
   tres partes y sus números: la inherente con la caída constante, la instalada con la caída total constante mientras la
   fracción de la válvula baja a 25 y a 10 %, y el caso con la bomba de 190 mm y los dos globos de jaula de 2 in.
   Cada animación que dibuja un equipo lo dibuja con sus corrientes y sus instrumentos, como las figuras del capítulo:
   la línea con la válvula de la @fig-val-lazo, el tanque de llegada con las cotas de la @tbl-val-tanque.
   Un color hace un solo trabajo dentro de cada animación: la bomba, el caso y la válvula de igual porcentaje en azul
   (la primera serie de las gráficas); la línea, la lineal y lo que se compara en oliva (la segunda); lo que se pasa
   de un límite en el rojo de alerta; el agua con su material. */
(function () {
  'use strict';
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, T = ZB.tramo;
  var PA = window.PALETA, AGUA = PA.cortes.liquido;
  var AZ = K.serie[0], OL = K.serie[1];
  var G = 9.81, RHO = 997.0;

  /* ---------- El caso (caso.json) ---------- */
  // La bomba de 190 mm, la línea sin la válvula de control y la línea con la válvula de 2 in abierta: Q, Hb, línea,
  // abierta (caso.json, curvas).
  var CURV = [[0, 20.057, 10.0, 10.0], [1, 20.077, 10.009, 10.013], [2, 20.087, 10.033, 10.049], [3, 20.089, 10.069, 10.105], [4, 20.081, 10.118, 10.182], [5, 20.064, 10.18, 10.28], [6, 20.038, 10.254, 10.398], [7, 20.003, 10.34, 10.536], [8, 19.958, 10.438, 10.694], [9, 19.904, 10.549, 10.873], [10, 19.84, 10.671, 11.071], [11, 19.767, 10.806, 11.29], [12, 19.684, 10.953, 11.528], [13, 19.59, 11.111, 11.787], [14, 19.486, 11.282, 12.065], [15, 19.372, 11.465, 12.364], [16, 19.246, 11.659, 12.682], [17, 19.108, 11.866, 13.021], [18, 18.958, 12.084, 13.379], [19, 18.794, 12.314, 13.757], [20, 18.615, 12.557, 14.156], [21, 18.419, 12.811, 14.574], [22, 18.203, 13.077, 15.012], [23, 17.965, 13.355, 15.469], [24, 17.7, 13.645, 15.947], [25, 17.403, 13.946, 16.445], [26, 17.067, 14.26, 16.962], [27, 16.687, 14.586, 17.5], [28, 16.26, 14.923, 18.057], [29, 15.786, 15.273, 18.634], [30, 15.267, 15.634, 19.231], [31, 14.71, 16.007, 19.848], [32, 14.121, 16.392, 20.485]];
  // La característica instalada del caso, caudal (m³/h) contra carrera cada 2 % (caso.json, instalada).
  var INST_IG = [0.0, 0.811, 1.621, 2.095, 2.242, 2.399, 2.567, 2.747, 2.939, 3.144, 3.364, 3.598, 3.848, 4.115, 4.4, 4.704, 5.028, 5.373, 5.74, 6.131, 6.545, 6.986, 7.452, 7.946, 8.467, 9.018, 9.597, 10.205, 10.842, 11.508, 12.2, 12.918, 13.661, 14.424, 15.206, 16.002, 16.807, 17.617, 18.427, 19.23, 20.021, 20.793, 21.54, 22.255, 22.936, 23.577, 24.174, 24.727, 25.234, 25.697, 26.117];
  var INST_LI = [0.0, 1.252, 2.501, 3.741, 4.964, 6.166, 7.341, 8.485, 9.595, 10.666, 11.697, 12.684, 13.628, 14.527, 15.382, 16.192, 16.957, 17.68, 18.36, 19.001, 19.601, 20.164, 20.692, 21.185, 21.646, 22.077, 22.481, 22.855, 23.205, 23.533, 23.837, 24.121, 24.387, 24.635, 24.867, 25.084, 25.286, 25.477, 25.654, 25.82, 25.978, 26.124, 26.262, 26.393, 26.516, 26.63, 26.739, 26.842, 26.94, 27.032, 27.119];
  // Los tres caudales de la planta: Q, carrera de la de igual porcentaje y de la lineal (caso.json, dimensiona).
  var DEM = [[8, 0.462, 0.131], [18, 0.749, 0.349], [25, 0.950, 0.692]];
  function curvaCaso(i, q) { var a = Math.floor(q), b = Math.min(32, a + 1), f = q - a; return CURV[a][i] + (CURV[b][i] - CURV[a][i]) * f; }

  /* ---------- Las ecuaciones del capítulo ---------- */
  var R30 = 30;
  function fIgual(x, R) { R = R || R30; return x >= 0.05 ? Math.pow(R, x - 1) : x / 0.05 * Math.pow(R, 0.05 - 1); }   // con el tramo recto del pie
  function instalada(f, a) { return f > 0 ? f / Math.sqrt(a + (1 - a) * f * f) : 0; }
  function cvSin(q, dp, rr) { return q / 0.0865 * Math.sqrt((rr == null ? 0.998 : rr) / dp); }
  function fpDe(cv, d, Dt) { var sk = 1.5 * Math.pow(1 - d * d / (Dt * Dt), 2); return Math.pow(1 + sk / 890 * Math.pow(cv / (d * d), 2), -0.5); }
  function cvCon(q, dp, cvVal, d, Dt) { var c0 = cvSin(q, dp), cv = cvVal; for (var i = 0; i < 40; i++) cv = c0 / fpDe(cv, d, Dt); return cv; }
  function colebrook(re, rr) { var f = 0.02; for (var i = 0; i < 60; i++) f = Math.pow(-2 * Math.log10(rr / 3.7 + 2.51 / (re * Math.sqrt(f))), -2); return f; }
  function cPlaca(beta, re, Dmm) {                        // ISO 5167-2, ec. 4, tomas de brida, con el término de tubo pequeño
    var L = 25.4 / Dmm, A = Math.pow(19000 * beta / re, 0.8), M2 = 2 * L / (1 - beta);
    var c = 0.5961 + 0.0261 * beta * beta - 0.216 * Math.pow(beta, 8) + 0.000521 * Math.pow(1e6 * beta / re, 0.7)
      + (0.0188 + 0.0063 * A) * Math.pow(beta, 3.5) * Math.pow(1e6 / re, 0.3)
      + (0.043 + 0.080 * Math.exp(-10 * L) - 0.123 * Math.exp(-7 * L)) * (1 - 0.11 * A) * Math.pow(beta, 4) / (1 - Math.pow(beta, 4))
      - 0.031 * (M2 - 0.8 * Math.pow(M2, 1.1)) * Math.pow(beta, 1.3);
    if (Dmm < 71.12) c += 0.011 * (0.75 - beta) * (2.8 - Dmm / 25.4);
    return c;
  }
  function perdidaPlaca(beta, c) { var x = Math.sqrt(1 - Math.pow(beta, 4) * (1 - c * c)); return (x - c * beta * beta) / (x + c * beta * beta); }
  // Cédula 40 y tubo sanitario: nominal, exterior, pared, interior (mm), de las tablas del capítulo y del capítulo 10
  var CED = [['1', 33.40, 3.38, 26.64], ['1½', 48.26, 3.68, 40.89], ['2', 60.33, 3.91, 52.50], ['2½', 73.03, 5.16, 62.71], ['3', 88.90, 5.49, 77.93], ['4', 114.30, 6.02, 102.26]];
  var SAN = [['1', 25.4, 22.91, 26.64], ['1½', 38.1, 35.61, 40.89], ['2', 50.8, 47.50, 52.50], ['2½', 63.5, 60.20, 62.71], ['3', 76.2, 72.90, 77.93], ['4', 101.6, 97.38, 102.26]];

  /* ---------- Piezas ---------- */
  function grupo(padre, op) { return s('g', { opacity: op == null ? 0 : op }, padre); }
  function camino(padre, pts, o) {
    o = o || {};
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + (+p[0]).toFixed(1) + ' ' + (+p[1]).toFixed(1); }).join('');
    return s('path', { d: d, fill: o.fill || 'none', stroke: o.color || K.tinta, 'stroke-width': o.ancho || 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'stroke-dasharray': o.guion || 'none' }, padre);
  }
  function dTrazo(pts) { return pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(''); }
  function lineas(padre, x, y, filas, o) {
    o = o || {};
    filas.forEach(function (f, i) { D.t(padre, x, y + i * (o.salto || 17), f, { tam: o.tam || 12, peso: i === 0 && o.titulo ? 700 : (o.peso || 500), ancla: o.ancla || 'start', color: i === 0 && o.titulo ? (o.colorT || K.tinta) : (o.color || K.tinta2) }); });
  }
  function barraH(padre, x, y, w, h, color, o) {           // barra horizontal que crece de 0 a w
    o = o || {};
    var r = s('rect', { x: x, y: y, width: 0, height: h, fill: color, opacity: o.op == null ? 1 : o.op }, padre);
    r.largo = function (f) { r.setAttribute('width', Math.max(0, w * Math.max(0, Math.min(1, f)))); };
    r.largo(0);
    return r;
  }
  function curva(f, a, b, k, X, Y) { var p = []; for (var i = 0; i <= k; i++) { var x = a + (b - a) * i / k; p.push([X(x), Y(f(x))]); } return p; }
  function burbuja(padre, cx, cy, letras, num, r) {
    var g = s('g', {}, padre);
    s('circle', { cx: cx, cy: cy, r: r || 16, fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.4 }, g);
    D.t(g, cx, cy - 1, letras, { tam: 11.5, peso: 700, ancla: 'middle' });
    D.t(g, cx, cy + 11, num, { tam: 11, peso: 500, ancla: 'middle' });
    return g;
  }
  function setD(p, pts) { p.setAttribute('d', dTrazo(pts)); }

  /* ================= 13.1 La tubería ================= */

  /* La pared de la descarga: el tubo de 2½ in cédula 40 en corte, la pared aumentada con lo que se le quita (la
     tolerancia de fábrica y el margen de corrosión), la presión que aguanta con la ecuación del capítulo y la presión de
     diseño de la descarga, con la cabeza a caudal cero de la bomba y el tanque de succión. */
  ZB.animacion('pared', {
    vista: [0, 0, 640, 340],
    alt: 'A la izquierda, el tubo de la descarga en corte: 73,03 mm por fuera y 5,16 mm de pared. A la derecha, la pared aumentada: se le quita la tolerancia de fábrica, 12½ %, 0,65 mm, y el margen de corrosión, 1,5 mm, y quedan 3,02 mm. Abajo, barras de presión: el tubo aguanta 68 barg; la brida clase 150, 19,6 barg; la bomba con la descarga cerrada y el tanque de succión le ponen 2,16 barg, y la presión de diseño, redondeada hacia arriba, es 2,5 barg: el tubo aguanta 27 veces eso.',
    montar: function (svg) {
      var S = {};
      // el tubo en corte
      var cx = 100, cy = 92, R = 66, r = R * (1 - 2 * 5.16 / 73.03);
      s('path', { d: 'M' + (cx - R) + ' ' + cy + 'A' + R + ' ' + R + ' 0 1 0 ' + (cx + R) + ' ' + cy + 'A' + R + ' ' + R + ' 0 1 0 ' + (cx - R) + ' ' + cy + 'ZM' + (cx - r) + ' ' + cy + 'A' + r + ' ' + r + ' 0 1 1 ' + (cx + r) + ' ' + cy + 'A' + r + ' ' + r + ' 0 1 1 ' + (cx - r) + ' ' + cy + 'Z', fill: K.metalM, 'fill-rule': 'evenodd', stroke: K.tinta, 'stroke-width': 1.4 }, svg);
      s('circle', { cx: cx, cy: cy, r: r - 0.7, fill: AGUA }, svg);
      D.flecha(svg, cx - R, cy + R + 14, cx + R, cy + R + 14, { color: K.tinta2, ancho: 1.2, punta: 7 });
      D.flecha(svg, cx + R, cy + R + 14, cx - R, cy + R + 14, { color: K.tinta2, ancho: 1.2, punta: 7 });
      D.t(svg, cx, cy + R + 32, 'D_o = 73,03 mm', { tam: 12, ancla: 'middle' });
      D.t(svg, cx, cy + 5, '2½ in, cédula 40', { tam: 11.5, ancla: 'middle', color: K.tinta2 });
      // la pared aumentada: 74 px por mm
      var x0 = 228, y0 = 40, h = 30, k = 74;
      D.t(svg, x0, y0 - 12, 'la pared, aumentada: 5,16 mm', { tam: 12, peso: 600 });
      var wb = 3.015 * k, wc = 1.5 * k, wt = 0.645 * k;
      s('rect', { x: x0, y: y0, width: 5.16 * k, height: h, fill: K.metalM, stroke: K.tinta, 'stroke-width': 1.2 }, svg);
      S.tol = s('rect', { x: x0 + wb + wc, y: y0, width: wt, height: h, fill: K.alerta, opacity: 0 }, svg);
      S.cor = s('rect', { x: x0 + wb, y: y0, width: wc, height: h, fill: K.zona, opacity: 0 }, svg);
      S.tolT = grupo(svg); lineas(S.tolT, x0 + wb + wc + wt / 2, y0 + h + 18, ['tolerancia', '0,65 mm'], { ancla: 'middle', color: K.alerta });
      S.corT = grupo(svg); lineas(S.corT, x0 + wb + wc / 2, y0 + h + 18, ['corrosión', '1,5 mm'], { ancla: 'middle' });
      S.bT = grupo(svg);
      s('rect', { x: x0, y: y0, width: wb, height: h, fill: 'none', stroke: AZ, 'stroke-width': 2.4 }, S.bT);
      lineas(S.bT, x0 + wb / 2, y0 + h + 18, ['queda b = 3,02 mm'], { ancla: 'middle', color: AZ });
      // las presiones, en barg: 5 px por barg
      var bx = 228, by = 168, kb = 5.2;
      D.t(svg, bx, by - 16, 'presión manométrica (barg)', { tam: 12, peso: 600 });
      [0, 20, 40, 60].forEach(function (v) {
        s('line', { x1: bx + v * kb, x2: bx + v * kb, y1: by - 4, y2: by + 128, stroke: K.rejilla, 'stroke-width': 1 }, svg);
        D.t(svg, bx + v * kb, by + 144, n(v, 0), { tam: 11.5, ancla: 'middle', color: K.tinta2 });
      });
      S.bTubo = barraH(svg, bx, by, 68 * kb, 22, AZ);
      S.tTubo = grupo(svg); D.t(S.tTubo, bx + 6, by + 16, 'el tubo aguanta 68 barg', { tam: 12, peso: 650, color: K.blanco });
      S.bBrida = barraH(svg, bx, by + 34, 19.6 * kb, 22, K.metalO);
      S.tBrida = grupo(svg); D.t(S.tBrida, bx + 19.6 * kb + 8, by + 50, 'brida clase 150: 19,6 barg', { tam: 12, halo: true });
      S.bBomba = barraH(svg, bx, by + 68, 2.16 * kb, 22, OL);
      S.tBomba = grupo(svg); D.t(S.tBomba, bx + 2.5 * kb + 8, by + 84, 'bomba cerrada y succión: 2,16 barg', { tam: 12, halo: true });
      S.bDis = barraH(svg, bx, by + 102, 2.5 * kb, 22, K.alerta);
      S.tDis = grupo(svg); D.t(S.tDis, bx + 2.5 * kb + 8, by + 118, 'presión de diseño: 2,5 barg', { tam: 12, peso: 650, color: K.alerta, halo: true });
      S.veces = grupo(svg); D.t(S.veces, 92, 268, '68/2,5 = 27 veces', { tam: 14, peso: 700, ancla: 'middle', color: AZ });
      D.t(S.veces, 92, 286, 'la presión de diseño', { tam: 12, ancla: 'middle', color: K.tinta2 });
      return S;
    },
    pasos: [
      { texto: 'La descarga es de 2½ in cédula 40: 73,03 mm por fuera y 5,16 mm de pared nominal, de acero SA53 sin costura, con $S$ = 79,6 N/mm² hasta 120 °C y $E$ = 1.', dur: 1.2, ir: function (S, t) { } },
      { texto: 'La fábrica puede entregar la pared hasta 12½ % más delgada: $5,16 \\times 0,125$ = 0,65 mm que no se cuentan.', dur: 1.4, ir: function (S, t) { S.tol.setAttribute('opacity', t); D.ver(S.tolT, t); } },
      { texto: 'El margen de corrosión del caso, 1,5 mm, también sale: $b = 5,16\\,(1 - 0,125) - 1,5$ = 3,02 mm es lo que aguanta la presión.', dur: 1.6, ir: function (S, t) { S.cor.setAttribute('opacity', t); D.ver(S.corT, t); D.ver(S.bT, T(t, 0.4, 1)); } },
      { texto: 'Con la <a href="#eq-val-presion">ecuación de la presión</a>: $p = 2SEb/(D_o - 2Yb) = 2 \\times 79,6 \\times 3,02/(73,03 - 2 \\times 0,4 \\times 3,02)$ = 6,8 N/mm², 68 barg. La brida clase 150 que cierra la línea aguanta 19,6 barg a 38 °C (<a href="#tbl-val-bridas">tabla de las bridas</a>).', dur: 2, ir: function (S, t) { S.bTubo.largo(T(t, 0, 0.6)); D.ver(S.tTubo, T(t, 0.5, 0.8)); S.bBrida.largo(T(t, 0.5, 1)); D.ver(S.tBrida, T(t, 0.8, 1)); } },
      { texto: 'Con la descarga cerrada, la bomba da 20,1 m sobre su succión, y el tanque de succión suma 2,0 m: $997 \\times 9,81 \\times 22,1$ = 216 kPa, 2,16 barg. La presión de diseño, redondeada hacia arriba, es 2,5 barg, y el tubo aguanta 27 veces eso: la pared la fijan la corrosión y la resistencia mecánica.', dur: 2.2, ir: function (S, t) { S.bBomba.largo(T(t, 0, 0.4)); D.ver(S.tBomba, T(t, 0.2, 0.5)); S.bDis.largo(T(t, 0.4, 0.7)); D.ver(S.tDis, T(t, 0.6, 0.9)); D.ver(S.tBomba, T(t, 0.2, 0.5)); D.ver(S.veces, T(t, 0.7, 1)); } }
    ]
  });
  // El tubo de la brida y el texto de la bomba no se encimen: la barra de la bomba (2,16 barg) es más corta que la de
  // la presión de diseño, y los dos rótulos empiezan donde termina la de 2,5 barg.

  /* Reto: la dilatación, la presión que aguanta un tubo y la presión de diseño de una descarga. */

  /* ================= 13.2 Las válvulas manuales ================= */

  /* La retención de bisagra de la descarga a los tres caudales de la planta: el disco que se levanta según la velocidad
     y las barras de velocidad contra el criterio de Crane (35 √V̂ ft/s, 1,35 m/s con agua) y el del Hydraulic
     Institute (4,6 m/s). */
  ZB.animacion('retencion', {
    vista: [0, 0, 640, 320],
    alt: 'A la izquierda, una retención de bisagra en corte, con el disco que cuelga de su bisagra sobre un asiento inclinado y el agua que lo levanta. A la derecha, barras de la velocidad del agua en el tubo de 2½ in: 2,25 m/s a 25 m³/h, 1,62 m/s a 18 m³/h y 0,72 m/s a 8 m³/h, contra la velocidad de Crane que abre el disco del todo, 1,35 m/s, y la del Hydraulic Institute, 4,6 m/s. A 25 y a 18 m³/h el disco abre del todo; a 8 m³/h flota a medio abrir.',
    montar: function (svg) {
      var S = {};
      // la retención: cuerpo, asiento inclinado y disco con su bisagra
      var y = 160, x1 = 24, x2 = 236;
      s('path', { d: 'M' + x1 + ' ' + (y - 26) + 'H76Q90 ' + (y - 70) + ' 130 ' + (y - 74) + 'Q172 ' + (y - 70) + ' 184 ' + (y - 26) + 'H' + x2 + 'V' + (y + 26) + 'H184Q172 ' + (y + 64) + ' 130 ' + (y + 66) + 'Q90 ' + (y + 64) + ' 76 ' + (y + 26) + 'H' + x1 + 'Z', fill: AGUA, stroke: K.tinta, 'stroke-width': 2 }, svg);
      s('path', { d: 'M112 ' + (y - 24) + 'L102 ' + (y + 26), stroke: K.metalO, 'stroke-width': 5, 'stroke-linecap': 'round' }, svg);   // el asiento inclinado
      S.piv = [116, y - 40];
      s('circle', { cx: S.piv[0], cy: S.piv[1], r: 4.5, fill: K.tinta }, svg);
      S.disco = s('g', {}, svg);
      s('line', { x1: 0, y1: 0, x2: 0, y2: 12, stroke: K.tinta, 'stroke-width': 3 }, S.disco);
      s('rect', { x: -6, y: 12, width: 12, height: 52, rx: 3, fill: K.metalM, stroke: K.tinta, 'stroke-width': 1.6 }, S.disco);
      S.ponerDisco = function (ang) { S.disco.setAttribute('transform', 'translate(' + S.piv[0] + ' ' + S.piv[1] + ') rotate(' + (-ang) + ')'); };
      S.ponerDisco(8);
      D.flecha(svg, x1 + 6, y, x1 + 44, y, { color: K.tinta2, ancho: 2, punta: 8 });
      D.t(svg, x1 + 2, y + 46, 'flujo', { tam: 11.5, color: K.tinta2 });
      D.t(svg, 130, 44, 'retención de bisagra', { tam: 12, peso: 600, ancla: 'middle' });
      S.estado = grupo(svg, 1); S.estadoT = D.t(S.estado, 130, 270, 'disco apoyado en el asiento', { tam: 12, ancla: 'middle', color: K.tinta2 });
      // las velocidades
      var bx = 300, w = 300, vmax = 5, X = function (v) { return bx + v / vmax * w; };
      D.t(svg, bx, 40, 'velocidad del agua en el tubo de 2½ in (m/s)', { tam: 12, peso: 600 });
      [0, 1, 2, 3, 4, 5].forEach(function (v) { s('line', { x1: X(v), x2: X(v), y1: 52, y2: 236, stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, X(v), 252, n(v, 0), { tam: 11.5, ancla: 'middle', color: K.tinta2 }); });
      S.crane = grupo(svg);
      s('line', { x1: X(1.35), x2: X(1.35), y1: 52, y2: 236, stroke: OL, 'stroke-width': 2.2 }, S.crane);
      D.t(S.crane, X(1.35) + 4, 272, 'Crane: 1,35 m/s', { tam: 12, peso: 650, color: OL });
      S.hi = grupo(svg);
      s('line', { x1: X(4.6), x2: X(4.6), y1: 52, y2: 236, stroke: K.alerta, 'stroke-width': 2.2, 'stroke-dasharray': '6 4' }, S.hi);
      D.t(S.hi, X(4.6), 290, 'Hydraulic Institute: 4,6 m/s', { tam: 12, peso: 650, color: K.alerta, ancla: 'end' });
      S.b = [[25, 2.248, 70], [18, 1.619, 126], [8, 0.719, 182]].map(function (f) {
        var g = grupo(svg);
        var bar = barraH(g, bx, f[2], f[1] / vmax * w, 30, f[1] < 1.35 ? K.alerta : AZ, { op: 0.85 });
        D.t(g, bx - 6, f[2] + 20, n(f[0], 0) + ' m³/h', { tam: 12, peso: 650, ancla: 'end' });
        // la velocidad, después de la barra y nunca encima de la línea de Crane
        D.t(g, Math.max(bx + f[1] / vmax * w, X(1.35)) + 8, f[2] + 20, n(f[1], 2) + ' m/s', { tam: 12, peso: 650, halo: true });
        return { g: g, bar: bar };
      });
      return S;
    },
    pasos: [
      { texto: 'El K de la tabla, 2,0 en una de bisagra, vale con el disco abierto del todo. Crane pide $35\\sqrt{\\hat V}$ ft/s, con $\\hat V$ en ft³/lb; con agua, $\\hat V$ = 0,01605 ft³/lb y $35 \\times 0,1267$ = 4,43 ft/s, 1,35 m/s.', dur: 1.6, ir: function (S, t) { D.ver(S.crane, t); } },
      { texto: 'A 25 m³/h, el agua va por el tubo de 2½ in a $v = (25/3600)/(\\pi \\times 0,06271^2/4)$ = 2,25 m/s: por encima de 1,35 m/s, el disco abre del todo y pierde lo que dice su K.', dur: 1.8, ir: function (S, t) { D.ver(S.b[0].g, 1); S.b[0].bar.largo(t); S.ponerDisco(8 + 64 * t); S.estadoT.textContent = 'abierta del todo'; } },
      { texto: 'A 18 m³/h, 1,62 m/s: todavía abre del todo.', dur: 1.4, ir: function (S, t) { D.ver(S.b[1].g, 1); S.b[1].bar.largo(t); S.ponerDisco(72); } },
      { texto: 'A 8 m³/h, 0,72 m/s, por debajo de los 1,35 m/s de Crane: el disco flota a medio abrir, golpea y pierde más que su K. El caso lleva una retención de bisagra con resorte, que cierra con ayuda y no castañetea.', dur: 1.8, ir: function (S, t) { D.ver(S.b[2].g, 1); S.b[2].bar.largo(t); S.ponerDisco(72 - 40 * t); S.estadoT.textContent = t > 0.5 ? 'flota a medio abrir' : 'abierta del todo'; } },
      { texto: 'El Hydraulic Institute pide 4,6 m/s para todas las retenciones: con ese criterio, la de la descarga no abre del todo con ningún caudal de la planta. Es un aviso de que por debajo de esa velocidad el K de la tabla se queda corto.', dur: 1.6, ir: function (S, t) { D.ver(S.hi, t); } }
    ]
  });

  /* Reto: lo que se lleva una válvula, la velocidad de Crane y el caudal con que abre del todo una retención. */

  /* ================= 13.3 La válvula de control ================= */

  /* De la característica inherente a la instalada, como en la escena de Manim que reemplaza: la lineal y la de igual
     porcentaje con la caída constante; después con la caída total constante mientras la fracción de la válvula baja de
     1 a 0,5, a 0,25 y a 0,10 (la ecuación de la característica instalada), con los números a media carrera; y el caso,
     con la bomba de 190 mm y los dos globos de jaula de 2 in (la mitad de abajo de la figura de la característica
     instalada), con sus tres caudales y su ganancia. La barra de la derecha reparte la caída total entre la válvula y
     la línea. */
  ZB.animacion('instalada', {
    vista: [0, 0, 640, 360],
    alt: 'Una gráfica del caudal contra la carrera, de 0 a 100 %, con la característica lineal en oliva y la de igual porcentaje con Rv = 30 en azul, y a la derecha una barra que reparte la caída total entre la válvula y la línea. Con la caída toda en la válvula, la lineal es la diagonal y la de igual porcentaje pasa el 18 % a media carrera. Cuando la válvula abierta se lleva 50, 25 y 10 % de la caída, la de igual porcentaje se endereza (a media carrera pasa 25, 35 y 51 %) y la lineal se dobla hacia arriba (63, 76 y 88 %). Al final, el caso: la válvula abierta se lleva 27 % de la caída, y la de igual porcentaje da 8, 18 y 25 m³/h a 46, 75 y 95 % de carrera, la lineal a 13, 35 y 69 %; la ganancia de la de igual porcentaje es 1,0, 1,6 y 1,0, y la de la lineal 2,3, 1,4 y 0,43.',
    montar: function (svg) {
      var S = {};
      var x0 = 58, y0 = 34, w = 330, h = 250;
      var X = function (x) { return x0 + x / 100 * w; }, Yp = function (v) { return y0 + h - v / 100 * h; }, Yq = function (q) { return y0 + h - q / 30 * h; };
      S.X = X; S.Yp = Yp; S.Yq = Yq;
      [0, 20, 40, 60, 80, 100].forEach(function (v) {
        s('line', { x1: X(v), x2: X(v), y1: y0, y2: y0 + h, stroke: K.rejilla, 'stroke-width': 1 }, svg);
        D.t(svg, X(v), y0 + h + 17, n(v, 0), { tam: 11.5, ancla: 'middle', color: K.tinta2 });
      });
      S.ejeP = grupo(svg, 1);
      [0, 20, 40, 60, 80, 100].forEach(function (v) { s('line', { x1: x0, x2: x0 + w, y1: Yp(v), y2: Yp(v), stroke: K.rejilla, 'stroke-width': 1 }, S.ejeP); D.t(S.ejeP, x0 - 6, Yp(v) + 4, n(v, 0), { tam: 11.5, ancla: 'end', color: K.tinta2 }); });
      D.t(S.ejeP, x0 - 2, y0 - 12, 'caudal (% del máximo)', { tam: 12, peso: 600 });
      S.ejeQ = grupo(svg);
      [0, 5, 10, 15, 20, 25, 30].forEach(function (q) { s('line', { x1: x0, x2: x0 + w, y1: Yq(q), y2: Yq(q), stroke: K.rejilla, 'stroke-width': 1 }, S.ejeQ); D.t(S.ejeQ, x0 - 6, Yq(q) + 4, n(q, 0), { tam: 11.5, ancla: 'end', color: K.tinta2 }); });
      D.t(S.ejeQ, x0 - 2, y0 - 12, 'caudal (m³/h)', { tam: 12, peso: 600 });
      s('path', { d: 'M' + x0 + ' ' + y0 + 'V' + (y0 + h) + 'H' + (x0 + w), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      D.t(svg, x0 + w, y0 + h + 36, 'carrera (%)', { tam: 12, peso: 600, ancla: 'end' });
      // las dos curvas genéricas (se rehacen con la fracción de la válvula) y las dos del caso
      S.lin = camino(svg, [[0, 0]], { color: OL, ancho: 2.6 });
      S.ig = camino(svg, [[0, 0]], { color: AZ, ancho: 2.6 });
      S.cLin = D.trazo(svg, dTrazo(INST_LI.map(function (q, i) { return [X(2 * i), Yq(q)]; })), { color: OL, ancho: 2.6 });
      S.cIg = D.trazo(svg, dTrazo(INST_IG.map(function (q, i) { return [X(2 * i), Yq(q)]; })), { color: AZ, ancho: 2.6 });
      S.media = grupo(svg);
      s('line', { x1: X(50), x2: X(50), y1: y0, y2: y0 + h, stroke: K.tinta2, 'stroke-width': 1.2, 'stroke-dasharray': '4 3' }, S.media);
      S.pLin = D.punto(S.media, X(50), Yp(50), { r: 4.5 }); S.pIg = D.punto(S.media, X(50), Yp(18), { r: 4.5 });
      // los nombres de las curvas: el de la lineal encima de ella, a 40 % de carrera, y el de igual porcentaje debajo de
      // ella, a 62 %; se mueven con la fracción de la caída
      S.rotLin = D.t(svg, X(40), Yp(40) - 8, 'lineal', { tam: 12, peso: 650, color: OL, ancla: 'end' });
      S.rotIg = D.t(svg, X(62), Yp(27.5) + 18, 'igual porcentaje', { tam: 12, peso: 650, color: AZ, ancla: 'start' });
      // los tres caudales del caso
      S.caso = grupo(svg);
      DEM.forEach(function (f) {
        s('line', { x1: x0, x2: x0 + w, y1: Yq(f[0]), y2: Yq(f[0]), stroke: K.tinta2, 'stroke-width': 1, 'stroke-dasharray': '4 3', opacity: 0.7 }, S.caso);
        D.punto(S.caso, X(100 * f[1]), Yq(f[0]), { r: 5 }); D.punto(S.caso, X(100 * f[2]), Yq(f[0]), { r: 5 });
      });
      D.t(S.caso, X(18), Yq(15), 'lineal', { tam: 12, peso: 650, color: OL, ancla: 'end' });
      D.t(S.caso, X(62), Yq(12.9) + 18, 'igual porcentaje', { tam: 12, peso: 650, color: AZ, ancla: 'start' });
      // la barra de la caída total, a la derecha
      var bx = 420, by = 46, bh = 150;
      S.bx = bx; S.by = by; S.bh = bh;
      D.t(svg, bx, 30, 'la caída total', { tam: 12, peso: 600 });
      s('rect', { x: bx, y: by, width: 28, height: bh, fill: OL, opacity: 0.35, stroke: K.tinta, 'stroke-width': 1 }, svg);
      S.bVal = s('rect', { x: bx, y: by, width: 28, height: bh, fill: AZ, opacity: 0.85 }, svg);
      S.tVal = D.t(svg, bx + 36, by + 16, '', { tam: 12, peso: 650, color: AZ });
      S.tLin = D.t(svg, bx + 36, by + bh - 6, '', { tam: 12, peso: 650, color: OL });
      // las cuentas, debajo de la barra
      S.c1 = D.t(svg, bx, 228, '', { tam: 12, peso: 650 });
      S.c2 = D.t(svg, bx, 248, '', { tam: 12, color: AZ });
      S.c3 = D.t(svg, bx, 268, '', { tam: 12, color: OL });
      S.c4 = D.t(svg, bx, 288, '', { tam: 12, color: K.tinta2 });
      S.ponerA = function (a) {
        var ptsL = [], ptsI = [];
        for (var i = 0; i <= 100; i++) { var x = i / 100; ptsL.push([X(i), Yp(100 * instalada(x, a))]); ptsI.push([X(i), Yp(100 * instalada(fIgual(x), a))]); }
        setD(S.lin, ptsL); setD(S.ig, ptsI);
        var qL = instalada(0.5, a), qI = instalada(fIgual(0.5), a);
        S.pLin.setAttribute('cy', Yp(100 * qL)); S.pIg.setAttribute('cy', Yp(100 * qI));
        S.rotLin.setAttribute('y', Yp(100 * instalada(0.40, a)) - 8); S.rotIg.setAttribute('y', Yp(100 * instalada(fIgual(0.62), a)) + 18);
        S.bVal.setAttribute('height', bh * a);
        D.ponerTexto(S.tVal, 'válvula: ' + n(100 * a, 0) + ' %');
        D.ponerTexto(S.tLin, a < 0.999 ? 'línea: ' + n(100 * (1 - a), 0) + ' %' : '');
        D.ponerTexto(S.c1, 'a media carrera, Q/Q_{máx}:');
        D.ponerTexto(S.c2, 'igual porcentaje: ' + n(qI, 2));
        D.ponerTexto(S.c3, 'lineal: ' + n(qL, 2));
        D.ponerTexto(S.c4, 'a_v = ' + n(a, 2));
      };
      S.ponerA(1);
      S.verGenericas = function (v) { [S.lin, S.ig, S.media, S.rotLin, S.rotIg, S.ejeP].forEach(function (e) { e.setAttribute('opacity', v); }); };
      S.verGenericas(0);
      return S;
    },
    pasos: [
      { texto: 'Con la caída constante en la válvula, el caudal sigue al $C_v$: es la característica inherente. La lineal sube parejo, y la de igual porcentaje, con la <a href="#eq-val-igual">ecuación de igual porcentaje</a> y $R_v$ = 30, pasa a media carrera $30^{-0,5}$ = 0,18 de su caudal, y la mitad solo al 80 % de la carrera.', dur: 1.8, ir: function (S, t) { S.verGenericas(1); S.ponerA(1); [S.lin, S.ig].forEach(function (p) { p.setAttribute('opacity', t); }); } },
      { texto: 'Ahora la caída total no cambia y la línea se lleva una parte: al abrir, sube el caudal, la línea pierde más y a la válvula le queda menos. Con la <a href="#eq-val-instalada">ecuación de la característica instalada</a> y $a_v$ = 0,5, a media carrera la de igual porcentaje pasa $0,183/\\sqrt{0,5 + 0,5 \\times 0,183^2}$ = 0,25, y la lineal $0,5/\\sqrt{0,5 + 0,5 \\times 0,5^2}$ = 0,63.', dur: 2.6, ir: function (S, t) { S.verGenericas(1); S.ponerA(1 - 0.5 * t); } },
      { texto: 'Con $a_v$ = 0,25, la de igual porcentaje pasa a media carrera $0,183/\\sqrt{0,25 + 0,75 \\times 0,183^2}$ = 0,35, y la lineal, 0,76: la lineal ya se dobla hacia arriba.', dur: 2.2, ir: function (S, t) { S.verGenericas(1); S.ponerA(0.5 - 0.25 * t); } },
      { texto: 'Con $a_v$ = 0,10, la de igual porcentaje sale casi recta: a media carrera pasa $0,183/\\sqrt{0,10 + 0,90 \\times 0,183^2}$ = 0,51, y la misma carrera da el mismo cambio de caudal en todo el intervalo. La lineal pasa 0,88: se dobló hacia la de apertura rápida.', dur: 2.2, ir: function (S, t) { S.verGenericas(1); S.ponerA(0.25 - 0.15 * t); } },
      { texto: 'El caso, con la bomba de 190 mm y dos globos de jaula de 2 in: abierta del todo, la válvula se lleva 2,7 m de los 10,1 m de cabeza dinámica que la bomba tiene a caudal cero, $a_v$ = 0,27. La de igual porcentaje da 8, 18 y 25 m³/h a 46, 75 y 95 % de la carrera; la lineal los amontona en 13, 35 y 69 %, y a 8 m³/h trabaja casi cerrada.', dur: 2.4, ir: function (S, t) {
        S.verGenericas(1 - T(t, 0, 0.3)); S.ejeQ.setAttribute('opacity', T(t, 0.2, 0.5)); S.cIg.dibujar(T(t, 0.3, 0.8)); S.cLin.dibujar(T(t, 0.3, 0.8)); D.ver(S.caso, T(t, 0.7, 1));
        S.bVal.setAttribute('height', S.bh * 0.27); D.ponerTexto(S.tVal, 'válvula: 27 %'); D.ponerTexto(S.tLin, 'línea: 73 %');
        D.ponerTexto(S.c1, '8, 18 y 25 m³/h:'); D.ponerTexto(S.c2, 'igual %: 46, 75 y 95 %'); D.ponerTexto(S.c3, 'lineal: 13, 35 y 69 %'); D.ponerTexto(S.c4, 'a_v = 0,27, del caso');
      } },
      { texto: 'La prueba es la ganancia instalada, el cambio de caudal en porcentaje de la escala de 0 a 25 m³/h por porcentaje de carrera, la pendiente de cada curva en sus puntos: la de igual porcentaje da 1,0, 1,6 y 1,0, dentro de 0,5 a 2; la lineal da 2,3, 1,4 y 0,43, y se sale por los dos lados.', dur: 2, ir: function (S, t) {
        S.verGenericas(0); S.ejeQ.setAttribute('opacity', 1); S.cIg.dibujar(1); S.cLin.dibujar(1); D.ver(S.caso, 1);
        S.bVal.setAttribute('height', S.bh * 0.27); D.ponerTexto(S.tVal, 'válvula: 27 %'); D.ponerTexto(S.tLin, 'línea: 73 %');
        D.ponerTexto(S.c1, 'ganancia, de 0,5 a 2:'); D.ponerTexto(S.c2, 'igual %: 1,0, 1,6 y 1,0'); D.ponerTexto(S.c3, 'lineal: 2,3, 1,4 y 0,43'); D.ponerTexto(S.c4, 'la lineal se sale');
        [S.c1, S.c2, S.c3, S.c4].forEach(function (e) { e.setAttribute('opacity', t); });
      } }
    ]
  });

  /* Reto: el coeficiente de una válvula sin reducciones, la carrera que pide y la característica instalada. */

  /* ================= 13.4 La válvula de control del caso ================= */

  /* El Cv de la válvula del caso: la bomba de 190 mm contra la línea sin la válvula, como en la figura de lo que queda
     para la válvula; a 25 m³/h la caída y el Cv con sus reducciones (el ejemplo); a 18 y a 8 m³/h, sus carreras; y la
     línea con la válvula abierta del todo. */
  ZB.animacion('cv-caso', {
    vista: [0, 0, 640, 350],
    alt: 'La bomba de 190 mm contra la línea del caso sin la válvula de control, cabeza contra caudal. A 25 m³/h la bomba da 17,40 m y la línea pide 13,95: a la válvula le quedan 3,46 m, 33,8 kPa, que piden un Cv de 49,7 sin reducciones y de 50,4 con ellas, el 84,5 % de la válvula de igual porcentaje de 2 in: 95 % de carrera, y 69 % en la lineal. A 18 m³/h quedan 6,87 m y el Cv es 25,4: 75 y 35 %; a 8 m³/h, 9,52 m y Cv 9,6: 46 y 13 %. Con la válvula abierta del todo, la línea cruza la bomba en 26,1 m³/h.',
    montar: function (svg) {
      var S = {};
      var x0 = 52, y0 = 28, w = 330, h = 260, qmax = 32, hmax = 22;
      var X = function (q) { return x0 + q / qmax * w; }, Y = function (v) { return y0 + h - v / hmax * h; };
      [0, 8, 16, 24, 32].forEach(function (q) { s('line', { x1: X(q), x2: X(q), y1: y0, y2: y0 + h, stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, X(q), y0 + h + 17, n(q, 0), { tam: 11.5, ancla: 'middle', color: K.tinta2 }); });
      [0, 4, 8, 12, 16, 20].forEach(function (v) { s('line', { x1: x0, x2: x0 + w, y1: Y(v), y2: Y(v), stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, x0 - 6, Y(v) + 4, n(v, 0), { tam: 11.5, ancla: 'end', color: K.tinta2 }); });
      s('path', { d: 'M' + x0 + ' ' + y0 + 'V' + (y0 + h) + 'H' + (x0 + w), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      D.t(svg, x0 + w, y0 + h + 36, 'caudal (m³/h)', { tam: 12, peso: 600, ancla: 'end' });
      D.t(svg, x0 - 2, y0 - 12, 'cabeza (m)', { tam: 12, peso: 600 });
      var zona = [];
      CURV.forEach(function (p) { if (p[1] >= p[2]) zona.push([X(p[0]), Y(p[1])]); });
      CURV.slice().reverse().forEach(function (p) { if (p[1] >= p[2]) zona.push([X(p[0]), Y(p[2])]); });
      S.zona = s('path', { d: dTrazo(zona) + 'Z', fill: K.zona, opacity: 0 }, svg);
      S.bomba = D.trazo(svg, dTrazo(CURV.map(function (p) { return [X(p[0]), Y(p[1])]; })), { color: AZ, ancho: 2.6 });
      S.linea = D.trazo(svg, dTrazo(CURV.map(function (p) { return [X(p[0]), Y(p[2])]; })), { color: OL, ancho: 2.4 });
      S.abierta = D.trazo(svg, dTrazo(CURV.filter(function (p) { return p[3] <= hmax; }).map(function (p) { return [X(p[0]), Y(p[3])]; })), { color: OL, ancho: 1.8, guion: '6 4' });
      S.rot = grupo(svg);
      D.t(S.rot, X(1), Y(20.06) - 16, 'bomba de 190 mm', { tam: 12, peso: 650, color: AZ });
      D.t(S.rot, X(31.5), Y(11.4), 'línea sin la válvula', { tam: 12, peso: 650, color: OL, ancla: 'end' });   // debajo de su curva
      function flecha(q, hb, hl, txt, yt) {
        var g = grupo(svg);
        D.flecha(g, X(q), Y(hl) - 2, X(q), Y(hb) + 3, { color: K.tinta, ancho: 1.6, punta: 7 });
        D.flecha(g, X(q), Y(hb) + 3, X(q), Y(hl) - 2, { color: K.tinta, ancho: 1.6, punta: 7 });
        D.t(g, X(q) - 6, yt || (Y(hb) + Y(hl)) / 2 + 4, txt, { tam: 12, peso: 650, ancla: 'end', halo: true });
        return g;
      }
      S.f25 = flecha(25, 17.403, 13.946, '', 1);
      // el rótulo de los 3,46 m, arriba de la bomba con una guía: abajo no cabe entre la bomba y la válvula abierta
      camino(S.f25, [[X(25) - 4, 64], [X(25), Y(17.403) - 1]], { color: K.tinta2, ancho: 1 });
      D.t(S.f25, X(25) - 6, 60, '3,46 m', { tam: 12, peso: 650, ancla: 'end' });
      S.f18 = flecha(18, 18.958, 12.084, '6,87 m');
      S.f8 = flecha(8, 19.958, 10.438, '9,52 m');
      S.pa = grupo(svg); D.punto(S.pa, X(26.12), Y(curvaCaso(1, 26.12)), { r: 5.5 });
      camino(S.pa, [[X(26.12), Y(curvaCaso(1, 26.12)) - 7], [X(26.3), 44]], { color: K.tinta2, ancho: 1 });
      D.t(S.pa, X(26.3) + 4, 40, '26,1 m³/h', { tam: 12, peso: 650 });
      // las cuentas, a la derecha
      S.c = [
        ['A 25 m³/h', '17,40 − 13,95 = 3,46 m', '= 33,8 kPa'],
        ['Sin reducciones', 'C_v = 49,7'],
        ['Con reducciones de 2½ in', 'F_p = 0,9785 → C_v 50,75', 'F_p = 0,9843 → C_v 50,4'],
        ['Carrera a 25 m³/h', 'igual %: 50,4/59,7 = 0,845 → 95 %', 'lineal: 50,4/72,9 → 69 %'],
        ['18 y 8 m³/h', 'C_v 25,4: 75 % y 35 %', 'C_v 9,6: 46 % y 13 %']
      ].map(function (f, i) { var g = grupo(svg); lineas(g, 400, 34 + i * 58, f, { titulo: true, tam: 12, salto: 16 }); return g; });
      return S;
    },
    pasos: [
      { texto: 'La bomba de 190 mm da su cabeza y la línea sin la válvula de control pide la suya: la diferencia, la zona gris, es lo que queda para la válvula. A 25 m³/h, $17,40 - 13,95$ = 3,46 m, que con agua a 25 °C son $997 \\times 9,81 \\times 3,46$ = 33,8 kPa.', dur: 2.2, ir: function (S, t) { S.bomba.dibujar(T(t, 0, 0.5)); S.linea.dibujar(T(t, 0.1, 0.6)); D.ver(S.rot, T(t, 0.4, 0.7)); S.zona.setAttribute('opacity', T(t, 0.5, 0.8)); D.ver(S.f25, T(t, 0.7, 1)); D.ver(S.c[0], T(t, 0.7, 1)); } },
      { texto: 'Sin reducciones, con la <a href="#eq-val-cv">ecuación de la válvula</a>: $C_v = (25/0,0865)\\sqrt{0,998/33,8}$ = 49,7. La de 1½ in de igual porcentaje, con 35,8, no alcanza; la de 2 in tiene 59,7.', dur: 1.8, ir: function (S, t) { D.ver(S.c[1], t); } },
      { texto: 'La válvula de 2 in va entre reducciones de 2½ in, con $\\sum K$ = 0,177. Con la <a href="#eq-val-fp">ecuación de las reducciones</a> y el $C_v$ de la válvula como primer tanteo, $F_p$ = 0,9785 y $C_v$ = 50,75; con ese, $F_p$ = 0,9843 y $C_v$ = 50,4, que otra vuelta ya no cambia.', dur: 2, ir: function (S, t) { D.ver(S.c[2], t); } },
      { texto: 'Son el 84,5 % del $C_v$ de la de igual porcentaje: con la <a href="#eq-val-igual">ecuación de igual porcentaje</a>, $\\ell = 1 + \\ln 0,845/\\ln 30$ = 0,95, el 95 % de la carrera. La lineal, de $C_v$ = 72,9, trabajaría al 69 %.', dur: 1.8, ir: function (S, t) { D.ver(S.c[3], t); } },
      { texto: 'Al caudal normal quedan 6,87 m, 67,2 kPa, y el $C_v$ es 25,4: 75 % de carrera en la de igual porcentaje y 35 % en la lineal. Al mínimo quedan 9,52 m, 93,1 kPa, y el $C_v$ es 9,6: 46 y 13 %.', dur: 2, ir: function (S, t) { D.ver(S.f18, T(t, 0, 0.5)); D.ver(S.f8, T(t, 0.3, 0.8)); D.ver(S.c[4], T(t, 0.4, 1)); } },
      { texto: 'Con la válvula abierta del todo, la línea pide la curva de trazos y cruza la bomba en 26,1 m³/h: es el caudal más alto que puede pasar. Ahí la válvula abierta se lleva 2,7 m de los 10,1 m de cabeza dinámica que la bomba tiene a caudal cero: $a_v$ = 0,27.', dur: 1.8, ir: function (S, t) { S.abierta.dibujar(t); D.ver(S.pa, T(t, 0.6, 1)); } }
    ]
  });

  /* La presión a lo largo de la válvula del caso al caudal mínimo, como en el ejemplo de la cavitación: la salida fijada
     por lo que hay aguas abajo, la entrada, la vena contracta con F_LP/F_p, la caída de bloqueo y la cavitación
     incipiente con el x_FZ estimado de la norma. La forma entre la entrada y la salida es esquemática. */
  var CAV = { p1: 157.44, p2: 64.36, pvc: 28.39, pv: 3.17, dpB: 111.3 };
  function perfilValv(x, p1, pvc, p2) {                  // x de 0 a 10: entrada, asiento a 4, vena contracta a 5, salida desde 8
    var sv = function (u) { u = Math.max(0, Math.min(1, u)); return 0.5 - 0.5 * Math.cos(Math.PI * u); };
    if (x < 3.6) return p1;
    if (x < 5) return p1 - (p1 - pvc) * sv((x - 3.6) / 1.4);
    if (x < 8) return pvc + (p2 - pvc) * sv((x - 5) / 3);
    return p2;
  }
  ZB.animacion('vena', {
    vista: [0, 0, 640, 340],
    alt: 'La presión absoluta a lo largo de la válvula del caso al caudal mínimo, 8 m³/h. Sale a 64,4 kPa, lo que fija el tanque y la bajada; entra a 157,4 kPa con los 93,1 kPa de caída. En la vena contracta la presión baja a 28,4 kPa y después se recupera hasta la salida. Si la vena contracta llegara a la presión de vapor, 3,17 kPa, el caudal se bloquearía con 111,3 kPa de caída: la válvula usa el 84 %. La relación xF = 0,60 pasa del xFZ estimado, 0,54, y aparecen burbujas en la vena contracta, que colapsan cuando la presión se recupera.',
    montar: function (svg) {
      var S = {};
      var x0 = 60, y0 = 30, w = 330, h = 250, pmin = -15, pmax = 175;
      var X = function (x) { return x0 + x / 10 * w; }, Y = function (p) { return y0 + h - (p - pmin) / (pmax - pmin) * h; };
      S.X = X; S.Y = Y;
      [0, 40, 80, 120, 160].forEach(function (p) { s('line', { x1: x0, x2: x0 + w, y1: Y(p), y2: Y(p), stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, x0 - 6, Y(p) + 4, n(p, 0), { tam: 11.5, ancla: 'end', color: K.tinta2 }); });
      s('path', { d: 'M' + x0 + ' ' + y0 + 'V' + (y0 + h) + 'H' + (x0 + w), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      D.t(svg, x0 - 2, y0 - 12, 'presión absoluta (kPa)', { tam: 12, peso: 600 });
      [[1.8, 'entrada'], [5, 'vena contracta'], [9, 'salida']].forEach(function (e) { D.t(svg, X(e[0]), y0 + h + 18, e[1], { tam: 11.5, ancla: 'middle', color: K.tinta2 }); });
      // el asiento, una marca en el eje
      s('rect', { x: X(4) - 3, y: y0 + h - 8, width: 6, height: 8, fill: K.metalO }, svg);
      S.pv = grupo(svg);
      s('line', { x1: x0, x2: x0 + w, y1: Y(CAV.pv), y2: Y(CAV.pv), stroke: K.alerta, 'stroke-width': 1.4, 'stroke-dasharray': '5 4' }, S.pv);
      D.t(S.pv, X(0.2), Y(CAV.pv) - 6, 'p_v = 3,17 kPa', { tam: 11.5, color: K.alerta, ancla: 'start' });   // a la izquierda, donde no pasa ninguna curva
      S.sal = grupo(svg);
      camino(S.sal, [[X(8), Y(CAV.p2)], [X(10), Y(CAV.p2)]], { color: AZ, ancho: 2.6 });
      D.t(S.sal, X(9), Y(CAV.p2) - 8, 'p_2 = 64,4', { tam: 12, peso: 650, color: AZ, ancla: 'middle', halo: true });
      S.ent = grupo(svg);
      camino(S.ent, [[X(0), Y(CAV.p1)], [X(3.6), Y(CAV.p1)]], { color: AZ, ancho: 2.6 });
      D.t(S.ent, X(1.8), Y(CAV.p1) - 8, 'p_1 = 157,4', { tam: 12, peso: 650, color: AZ, ancla: 'middle', halo: true });
      var pts = []; for (var i = 0; i <= 100; i++) { var x = i / 10; pts.push([X(x), Y(perfilValv(x, CAV.p1, CAV.pvc, CAV.p2))]); }
      S.perfil = D.trazo(svg, dTrazo(pts.filter(function (p, i) { return i >= 36 && i <= 80; })), { color: AZ, ancho: 2.6 });
      S.vc = grupo(svg); D.punto(S.vc, X(5), Y(CAV.pvc), { r: 5 });
      // el rótulo, arriba del valle, entre las dos ramas del perfil
      camino(S.vc, [[X(5) + 3, Y(CAV.pvc) - 6], [X(5.3), Y(CAV.pvc) - 52]], { color: K.tinta2, ancho: 1 });
      D.t(S.vc, X(5.3) + 2, Y(CAV.pvc) - 56, 'p_{vc} = 28,4', { tam: 12, peso: 650 });
      var pb = []; var pvcB = CAV.p1 - CAV.dpB / Math.pow(0.849, 2);
      for (var j = 36; j <= 80; j++) { var xx = j / 10; pb.push([X(xx), Y(perfilValv(xx, CAV.p1, CAV.pv, CAV.p1 - CAV.dpB))]); }
      S.bloq = D.trazo(svg, dTrazo(pb), { color: OL, ancho: 1.8, guion: '6 4' });
      S.bloqT = grupo(svg); D.t(S.bloqT, X(8.2), Y(CAV.p1 - CAV.dpB) - 6, 'bloqueo', { tam: 12, peso: 650, color: OL });   // sobre su tramo plano, debajo de p2
      S.burb = grupo(svg);
      [[4.8, 22], [5.1, 14], [5.4, 26], [5.0, 34], [5.7, 18]].forEach(function (b) { s('circle', { cx: X(b[0]), cy: Y(b[1]), r: 3.2, fill: K.blanco, stroke: K.tinta, 'stroke-width': 1 }, S.burb); });
      // las cuentas
      S.c = [
        ['Salida', '73,7 + ρg(12,045 − 13)', '= 64,36 kPa'],
        ['Entrada', '64,36 + 93,08 = 157,4 kPa'],
        ['Vena contracta', 'F_{LP}/F_p = 0,849', '157,4 − 93,1/0,849² = 28,4'],
        ['Bloqueo', '0,849²(157,4 − 0,957 × 3,17)', '= 111,3 kPa: usa el 84 %'],
        ['Cavitación', 'x_F = 93,1/(157,4 − 3,17) = 0,60', 'x_{FZ} = 0,46 → 0,54 a 157 kPa']
      ].map(function (f, i) { var g = grupo(svg); lineas(g, 408, 34 + i * 60, f, { titulo: true, tam: 12, salto: 16, colorT: i === 4 ? K.alerta : K.tinta }); return g; });
      return S;
    },
    pasos: [
      { texto: 'Al caudal mínimo, la válvula descarga a lo que fija lo que hay aguas abajo: la cabeza piezométrica a su salida es 12,045 m, el nivel del tanque más lo que pierden la bajada y su codo, y está a 13 m. En Bogotá, $p_2 = 73,7 + 997 \\times 9,81 \\times (12,045 - 13)/1000$ = 64,36 kPa absolutos.', dur: 2, ir: function (S, t) { D.ver(S.sal, t); D.ver(S.c[0], t); } },
      { texto: 'La válvula se lleva los 93,08 kPa que le deja la bomba a 8 m³/h, así que entra a $p_1 = 64,36 + 93,08$ = 157,4 kPa.', dur: 1.4, ir: function (S, t) { D.ver(S.ent, t); D.ver(S.c[1], t); } },
      { texto: 'Al pasar el asiento, el agua se acelera y la presión cae hasta la vena contracta; después recupera una parte. Con la <a href="#eq-val-fl">ecuación del factor de recuperación</a> y $F_{LP}/F_p$ = 0,849 de las reducciones, $p_{vc} = 157,4 - 93,1/0,849^2$ = 28,4 kPa.', dur: 2.2, ir: function (S, t) { S.perfil.dibujar(t); D.ver(S.vc, T(t, 0.4, 0.8)); D.ver(S.c[2], T(t, 0.5, 1)); } },
      { texto: 'Si la vena contracta llegara a la presión de vapor, 3,17 kPa, el caudal se bloquearía. Con la <a href="#eq-val-bloqueo">ecuación del bloqueo</a>, $F_F$ = 0,957 y $\\Delta p_b = 0,849^2(157,4 - 0,957 \\times 3,17)$ = 111,3 kPa: la válvula usa el 84 %. No se bloquea, pero está cerca.', dur: 2.2, ir: function (S, t) { D.ver(S.pv, T(t, 0, 0.4)); S.bloq.dibujar(T(t, 0.2, 0.8)); D.ver(S.bloqT, T(t, 0.6, 1)); D.ver(S.c[3], T(t, 0.5, 1)); } },
      { texto: 'La cavitación empieza antes: $x_F = 93,1/(157,4 - 3,17)$ = 0,60, y la <a href="#eq-val-xfz">estimación de la norma</a>, con $F_d$ = 0,31 y $C_v$ = 9,6, da $x_{FZ}$ = 0,46 a 6 bara y 0,54 a 157,4 kPa. Con 0,60 contra 0,54, aparecen burbujas en la vena contracta que colapsan cuando la presión se recupera: ruido sin daño, porque $x_F$ no llega a 0,7 y $p_2 - p_v$ es 0,61 bar.', dur: 2.4, ir: function (S, t) { D.ver(S.burb, T(t, 0.3, 0.8)); D.ver(S.c[4], T(t, 0, 0.6)); } }
    ]
  });

  /* Reto: el Cv con las reducciones de 2½ in, la caída de bloqueo con x_F, y el x_FZ estimado de la norma. */

  /* ================= 13.5 Las válvulas de una planta de alimentos ================= */

  /* Reto: el caudal de la limpieza en sitio en un tubo sanitario, la velocidad de un caudal en el tubo sanitario y en la
     cédula 40 del mismo tamaño, y el área que se pierde. */

  /* ================= 13.6 Medir el caudal ================= */

  /* La raíz cuadrada: lo que lee el transmisor de una placa contra el caudal (Δp ∝ Q²) y el error que pasa al caudal de
     un transmisor de 0,25 % de su escala, a plena escala, a la mitad, a un cuarto y a la décima parte; al final, la placa
     del caso a 8 m³/h. */
  ZB.animacion('raiz', {
    vista: [0, 0, 640, 330],
    alt: 'Dos gráficas contra el caudal en porcentaje del máximo. A la izquierda, lo que lee el transmisor en porcentaje de su escala, una parábola: 100 % a plena escala, 25 % a la mitad, 6,25 % a un cuarto y 1 % a la décima parte. A la derecha, el error que pasa al caudal con un transmisor de 0,25 % de la escala: 0,125 %, 0,5 %, 2 % y 12,5 %. La placa del caso a 8 m³/h, 32 % del máximo, lee el 10,2 % de su escala y mide con 1,22 % de error.',
    montar: function (svg) {
      var S = {};
      var h = 220, y0 = 40;
      var A = { x0: 56, w: 240 }, B = { x0: 372, w: 240 };
      var XA = function (q) { return A.x0 + q / 100 * A.w; }, YA = function (p) { return y0 + h - p / 100 * h; };
      var XB = function (q) { return B.x0 + q / 100 * B.w; }, YB = function (e) { return y0 + h - Math.min(e, 14) / 14 * h; };
      [0, 25, 50, 75, 100].forEach(function (q) {
        s('line', { x1: XA(q), x2: XA(q), y1: y0, y2: y0 + h, stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, XA(q), y0 + h + 17, n(q, 0), { tam: 11.5, ancla: 'middle', color: K.tinta2 });
        s('line', { x1: XB(q), x2: XB(q), y1: y0, y2: y0 + h, stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, XB(q), y0 + h + 17, n(q, 0), { tam: 11.5, ancla: 'middle', color: K.tinta2 });
      });
      [0, 25, 50, 75, 100].forEach(function (p) { s('line', { x1: A.x0, x2: A.x0 + A.w, y1: YA(p), y2: YA(p), stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, A.x0 - 6, YA(p) + 4, n(p, 0), { tam: 11.5, ancla: 'end', color: K.tinta2 }); });
      [0, 2, 4, 6, 8, 10, 12, 14].forEach(function (e) { s('line', { x1: B.x0, x2: B.x0 + B.w, y1: YB(e), y2: YB(e), stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, B.x0 - 6, YB(e) + 4, n(e, 0), { tam: 11.5, ancla: 'end', color: K.tinta2 }); });
      s('path', { d: 'M' + A.x0 + ' ' + y0 + 'V' + (y0 + h) + 'H' + (A.x0 + A.w), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      s('path', { d: 'M' + B.x0 + ' ' + y0 + 'V' + (y0 + h) + 'H' + (B.x0 + B.w), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      D.t(svg, A.x0 - 2, y0 - 14, 'lectura (% de la escala)', { tam: 12, peso: 600 });
      D.t(svg, B.x0 - 2, y0 - 14, 'error del caudal (%)', { tam: 12, peso: 600 });
      D.t(svg, A.x0 + A.w, y0 + h + 36, 'caudal (% del máximo)', { tam: 12, peso: 600, ancla: 'end' });
      D.t(svg, B.x0 + B.w, y0 + h + 36, 'caudal (% del máximo)', { tam: 12, peso: 600, ancla: 'end' });
      S.par = D.trazo(svg, dTrazo(curva(function (q) { return q * q / 100; }, 0, 100, 60, XA, YA)), { color: AZ, ancho: 2.6 });
      S.err = D.trazo(svg, dTrazo(curva(function (q) { return 12.5 / (q * q / 100); }, 9.45, 100, 80, XB, YB)), { color: K.alerta, ancho: 2.2 });
      function par(q, p, e, rotA, rotB, col) {
        var g = grupo(svg);
        D.punto(g, XA(q), YA(p), { r: 5 }); D.punto(g, XB(q), YB(e), { r: 5 });
        D.t(g, XA(q) + rotA[0], YA(p) + rotA[1], rotA[2], { tam: 12, peso: 650, ancla: rotA[3] || 'start', halo: true, color: col });
        D.t(g, XB(q) + rotB[0], YB(e) + rotB[1], rotB[2], { tam: 12, peso: 650, ancla: rotB[3] || 'start', halo: true, color: col });
        return g;
      }
      // los rótulos de los puntos bajos de la izquierda van arriba, donde la parábola no pasa, con una guía a su punto
      function guia(g, x1, y1, x2, y2) { camino(g, [[x1, y1], [x2, y2]], { color: K.tinta2, ancho: 1 }); }
      S.p100 = par(100, 100, 0.125, [-8, 4, '100 %', 'end'], [-8, -10, '0,125 %', 'end']);
      S.p50 = par(50, 25, 0.5, [-8, -8, '25 %', 'end'], [6, -10, '0,5 %']);
      S.p25 = par(25, 6.25, 2, [0, 0, ''], [-8, 4, '2 %', 'end']);
      D.t(S.p25, XA(2), YA(64), '6,25 %', { tam: 12, peso: 650 }); guia(S.p25, XA(14), YA(64) + 4, XA(25), YA(6.25) - 6);
      S.p10 = par(10, 1, 12.5, [0, 0, ''], [10, 4, '12,5 %']);
      D.t(S.p10, XA(2), YA(50), '1 %', { tam: 12, peso: 650 }); guia(S.p10, XA(7), YA(50) + 4, XA(10), YA(1) - 6);
      S.p32 = par(32, 10.24, 1.22, [0, 0, ''], [0, 0, ''], AZ);
      D.t(S.p32, XA(31), YA(80), 'caso: 10,2 %', { tam: 12, peso: 650, color: AZ, ancla: 'end' }); guia(S.p32, XA(31) + 3, YA(80) - 3, XA(32), YA(10.24) - 6);
      D.t(S.p32, XB(40), YB(4.6), 'caso: 1,22 %', { tam: 12, peso: 650, color: AZ }); guia(S.p32, XB(42), YB(4.6) + 4, XB(32) + 2, YB(1.22) - 6);
      return S;
    },
    pasos: [
      { texto: 'Con la <a href="#eq-val-dp">ecuación del medidor de presión diferencial</a>, el caudal va con la raíz del diferencial: lo que lee el transmisor va con el cuadrado del caudal. A plena escala lee el 100 %, y un error de 0,25 % de la escala es 0,25 % de la lectura, que en el caudal se vuelve la mitad, 0,125 %.', dur: 2, ir: function (S, t) { S.par.dibujar(T(t, 0, 0.7)); D.ver(S.p100, T(t, 0.6, 1)); } },
      { texto: 'A la mitad del caudal, el transmisor lee $0,5^2$ = 25 % de su escala: los 0,25 % de la escala son el 1 % de la lectura, y al caudal pasa 0,5 %.', dur: 1.6, ir: function (S, t) { D.ver(S.p50, t); } },
      { texto: 'A un cuarto del caudal lee la dieciseisava parte, 6,25 %: el error es el 4 % de la lectura, y 2 % del caudal.', dur: 1.6, ir: function (S, t) { D.ver(S.p25, t); } },
      { texto: 'A la décima parte lee el 1 % de su escala: el mismo error es el 25 % de la lectura y el 12,5 % del caudal. Por eso una placa con un solo transmisor no mide bien más allá de 3:1 o 4:1.', dur: 1.8, ir: function (S, t) { D.ver(S.p10, t); S.err.dibujar(T(t, 0.3, 1)); } },
      { texto: 'La placa del caso a 8 m³/h trabaja al 32 % de su caudal máximo: el transmisor lee $(8/25)^2$ = 10,2 % de su escala, el error es $0,25/0,102$ = 2,44 % de la lectura, y al caudal pasa 1,22 %. Un magnético mide ese caudal tan bien como el máximo.', dur: 2, ir: function (S, t) { D.ver(S.p32, t); } }
    ]
  });

  /* Reto: el caudal de una placa con su coeficiente, la pérdida permanente con la forma simple de la norma y su
     potencia, y la corrección de un rotámetro por la densidad. */

  /* ================= 13.7 El medidor del caso ================= */

  /* La placa de la subida: el tubo con la placa y sus tomas de brida, el Reynolds, la β que da 24,9 kPa a 25 m³/h, la
     presión a lo largo de la placa (la forma de la figura del perfil), lo que se lleva y a 8 m³/h. */
  ZB.animacion('placa', {
    vista: [0, 0, 640, 350],
    alt: 'Arriba, la placa de orificio en el tubo de 2½ in de la subida, con las tomas de brida y el transmisor FT-101. Abajo, la presión a lo largo de la placa a 25 m³/h: cae 24,9 kPa entre las tomas, llega a su mínimo en la vena contracta y se recupera hasta perder para siempre 13,3 kPa, el 53,5 %. A la derecha las cuentas: Re de 1,58 × 10⁵, β 0,679, orificio de 42,6 mm, C 0,613, 92 W, a la válvula le quedan 2,09 m y la línea no llega a 25 m³/h; a 8 m³/h el transmisor lee 2,55 kPa, el 10,2 % de su escala, y la incertidumbre del caudal sube de 0,75 a 1,4 %.',
    montar: function (svg) {
      var S = {};
      // el tubo con la placa
      var x1 = 30, x2 = 380, yc = 76, r = 26;
      s('rect', { x: x1, y: yc - r, width: x2 - x1, height: 2 * r, fill: AGUA }, svg);
      camino(svg, [[x1, yc - r], [x2, yc - r]], { ancho: 2.4 }); camino(svg, [[x1, yc + r], [x2, yc + r]], { ancho: 2.4 });
      var xp = 140;
      S.placa = s('g', {}, svg);
      S.ponerPlaca = function (b) {
        while (S.placa.firstChild) S.placa.removeChild(S.placa.firstChild);
        var a = r * b;
        s('rect', { x: xp - 3, y: yc - r - 6, width: 6, height: r - a + 6, fill: K.metalO }, S.placa);
        s('rect', { x: xp - 3, y: yc + a, width: 6, height: r - a + 6, fill: K.metalO }, S.placa);
      };
      S.ponerPlaca(1);
      // las tomas de brida y el transmisor
      // las tomas suben y entran a la burbuja por abajo, sin cruzar su número
      camino(svg, [[xp - 14, yc - r], [xp - 14, 40], [xp - 6, 34]], { ancho: 1.4 });
      camino(svg, [[xp + 14, yc - r], [xp + 14, 40], [xp + 6, 34]], { ancho: 1.4 });
      burbuja(svg, xp, 21, 'FT', '101', 14);
      D.flecha(svg, x1 + 10, yc, x1 + 70, yc, { color: K.tinta2, ancho: 2, punta: 8 });
      D.t(svg, x1 + 6, yc + r + 18, '25 m³/h; D = 62,71 mm', { tam: 11.5, color: K.tinta2 });
      S.chorro = grupo(svg);
      s('path', { d: 'M' + (xp + 3) + ' ' + (yc - r * 0.679) + 'Q' + (xp + 16) + ' ' + (yc - r * 0.5) + ' ' + (xp + 26) + ' ' + (yc - r * 0.5) + 'Q' + (xp + 90) + ' ' + (yc - r * 0.5) + ' ' + (xp + 160) + ' ' + (yc - r + 2) + 'M' + (xp + 3) + ' ' + (yc + r * 0.679) + 'Q' + (xp + 16) + ' ' + (yc + r * 0.5) + ' ' + (xp + 26) + ' ' + (yc + r * 0.5) + 'Q' + (xp + 90) + ' ' + (yc + r * 0.5) + ' ' + (xp + 160) + ' ' + (yc + r - 2), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2, 'stroke-dasharray': '4 3' }, S.chorro);
      // la presión a lo largo de la placa: la forma de la figura del perfil
      var gx0 = 58, gy0 = 150, gw = 322, gh = 150, xa = -2, xb = 8, pmin = -28, pmax = 2;
      var X = function (x) { return gx0 + (x - xa) / (xb - xa) * gw; }, Y = function (p) { return gy0 + (pmax - p) / (pmax - pmin) * gh; };
      [-24, -16, -8, 0].forEach(function (p) { s('line', { x1: gx0, x2: gx0 + gw, y1: Y(p), y2: Y(p), stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, gx0 - 6, Y(p) + 4, n(p, 0), { tam: 11.5, ancla: 'end', color: K.tinta2 }); });
      [-2, 0, 2, 4, 6, 8].forEach(function (x) { D.t(svg, X(x), gy0 + gh + 16, n(x, 0), { tam: 11.5, ancla: 'middle', color: K.tinta2 }); });
      s('path', { d: 'M' + gx0 + ' ' + gy0 + 'V' + (gy0 + gh) + 'H' + (gx0 + gw), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      D.t(svg, gx0 - 2, gy0 - 10, 'p − p_1 (kPa)', { tam: 12, peso: 600 });
      D.t(svg, gx0 + gw, gy0 + gh + 34, 'diámetros desde la placa', { tam: 12, peso: 600, ancla: 'end' });
      var sv = function (u) { return u <= 0 ? 0 : u >= 1 ? 1 : 0.5 - 0.5 * Math.cos(Math.PI * u); };
      var beta = 0.679, dP = 24.9, perm = 13.31, xvc = 0.65 - (beta - 0.224) / (0.84 - 0.224) * 0.35;
      var pPl = function (x) { return x < 0 ? 0 : x < xvc ? -dP * 1.03 * sv(x / xvc) : -(dP * 1.03 - (dP * 1.03 - perm) * sv((x - xvc) / (6 - xvc))); };
      S.perfil = D.trazo(svg, dTrazo(curva(pPl, xa, xb, 160, X, Y)), { color: AZ, ancho: 2.6 });
      S.lee = grupo(svg);
      s('line', { x1: gx0, x2: gx0 + gw, y1: Y(-24.9), y2: Y(-24.9), stroke: K.tinta2, 'stroke-width': 1, 'stroke-dasharray': '4 3' }, S.lee);
      D.t(S.lee, X(7.8), Y(-24.9) - 6, 'lee 24,9 kPa', { tam: 12, peso: 650, ancla: 'end', halo: true });
      S.pierde = grupo(svg);
      D.flecha(S.pierde, X(7.2), Y(0) + 2, X(7.2), Y(-perm) - 2, { color: K.alerta, ancho: 1.6, punta: 7 });
      D.t(S.pierde, X(7.0), Y(-6.6) + 4, 'pierde 13,3', { tam: 12, peso: 650, ancla: 'end', color: K.alerta, halo: true });
      // las cuentas, a la derecha
      S.c = [
        ['El tubo', 'v = 2,248 m/s', 'Re_D = 1,58 × 10^5'],
        ['La placa, tanteada', 'β = 0,679; d = 42,6 mm', 'C = 0,613'],
        ['Lo que pierde', '0,535 × 24,9 = 13,3 kPa', '1,36 m; 92 W a 25 m³/h'],
        ['A la válvula', '3,46 − 1,36 = 2,09 m', 'no llega a 25: 24,6 m³/h'],
        ['A 8 m³/h', '(8/25)² = 10,2 %: 2,55 kPa', 'U(Q)/Q: 0,75 % → 1,4 %']
      ].map(function (f, i) { var g = grupo(svg); lineas(g, 410, 34 + i * 60, f, { titulo: true, tam: 12, salto: 16, colorT: i === 3 ? K.alerta : K.tinta }); return g; });
      return S;
    },
    pasos: [
      { texto: 'La placa va a media subida, en el tubo de 2½ in, con tomas de brida. A 25 m³/h el agua va a 2,248 m/s y, con 0,890 mPa·s, $\\mathrm{Re}_D = 997 \\times 2,248 \\times 0,06271/0,000890 = 1,58\\times10^5$.', dur: 1.6, ir: function (S, t) { D.ver(S.c[0], t); } },
      { texto: 'Se busca que 25 m³/h den 24,9 kPa. Tanteando $\\beta$ con la <a href="#eq-val-rhg">ecuación de Reader‑Harris y Gallagher</a> y la <a href="#eq-val-dp">ecuación del medidor</a>, sale $\\beta$ = 0,679: un orificio de 42,6 mm con $C$ = 0,613.', dur: 2, ir: function (S, t) { S.ponerPlaca(1 - (1 - 0.679) * t); D.ver(S.chorro, T(t, 0.5, 1)); D.ver(S.c[1], t); } },
      { texto: 'El chorro se contrae después de la placa y la presión cae hasta la vena contracta; las tomas de brida leen 24,9 kPa. Después el chorro se abre y la presión se recupera en unos 6 diámetros.', dur: 2.2, ir: function (S, t) { S.ponerPlaca(0.679); D.ver(S.chorro, 1); S.perfil.dibujar(t); D.ver(S.lee, T(t, 0.4, 0.8)); } },
      { texto: 'Con la <a href="#eq-val-perdida">ecuación de la pérdida permanente</a>, la placa pierde el 53,5 % de lo que lee: 13,3 kPa, 1,36 m de agua, y $(25/3600) \\times 13,3$ = 0,092 kW de potencia hidráulica.', dur: 1.8, ir: function (S, t) { D.ver(S.pierde, t); D.ver(S.c[2], t); } },
      { texto: 'Pesa más lo que le quita a la válvula: a 25 m³/h le quedaban 3,46 m, y con la placa le quedan 2,09. La válvula abierta del todo pide 2,50 m a ese caudal, así que la línea se queda en 24,6 m³/h.', dur: 1.8, ir: function (S, t) { D.ver(S.c[3], t); } },
      { texto: 'A 8 m³/h el transmisor lee $(8/25)^2$ = 10,2 % de su escala, 2,55 kPa. Con la <a href="#eq-val-incertidumbre">ecuación de la incertidumbre</a>, la del caudal sube de 0,75 a 1,4 %, y todo el aumento viene del transmisor.', dur: 1.8, ir: function (S, t) { D.ver(S.c[4], t); } }
    ]
  });

  /* Reto: lo que lee la placa a un caudal menor y el error que pasa al caudal, su incertidumbre con la ecuación de la
     norma, y lo que le quita a la válvula. */

  /* ================= 13.8 Los tanques y su nivel ================= */

  /* Reto: el tiempo de retención, el venteo de la API 2000 y lo que lee un transmisor de nivel calibrado con agua. */

  /* ================= 13.9 El tanque de llegada del caso ================= */

  /* El tanque de llegada cuando la bomba para: el tanque con las cotas de la tabla del tanque, la llegada por el techo
     con FV-101, el respiradero, el LSHH-103 a 12,25 m, el rebose, el LT-102 en la toma de 9,2 m y la salida a la
     planta; el nivel baja al caudal de la planta y, al lado, el nivel contra el tiempo a 8, 18 y 25 m³/h. */
  ZB.animacion('vaciado', {
    vista: [0, 0, 640, 340],
    alt: 'A la izquierda, el tanque de llegada de lado: fondo a 9,0 m, mínimo a 9,5 m, nivel normal a 12,0 m, rebose a 12,35 m, pared hasta 12,65 m y techo de cono hasta 12,91 m; la llegada por el techo con FV-101 y el tubo que entrega a 11,0 m; el respiradero, el interruptor LSHH-103 a 12,25 m, el transmisor LT-102 en la toma de 9,2 m y la salida a la planta. A la derecha, el nivel contra el tiempo cuando la bomba para: a 18 m³/h baja 2,55 m por hora y llega al mínimo en 59 min; a 25 m³/h, en 42 min; a 8 m³/h, en 2,2 h. Por debajo de 11,0 m, la boca del tubo de llegada queda en el aire.',
    montar: function (svg) {
      var S = {};
      // el tanque: 52 px por metro, fondo a 9,0 m en y = 286
      var k = 52, yb = 286, xt = 56, wt = 3.0 * k;
      var Z = function (z) { return yb - (z - 9.0) * k; };
      S.Z = Z;
      // la estructura bajo el tanque
      camino(svg, [[xt + 8, yb], [xt + 8, yb + 30]], { ancho: 2, color: K.metalO }); camino(svg, [[xt + wt - 8, yb], [xt + wt - 8, yb + 30]], { ancho: 2, color: K.metalO });
      S.agua = s('rect', { x: xt, y: Z(12.0), width: wt, height: Z(9.0) - Z(12.0), fill: AGUA }, svg);
      S.sup = s('line', { x1: xt, x2: xt + wt, y1: Z(12.0), y2: Z(12.0), stroke: K.aguaO || K.tinta2, 'stroke-width': 1.6 }, svg);
      camino(svg, [[xt, Z(12.65)], [xt, Z(9.0)], [xt + wt, Z(9.0)], [xt + wt, Z(12.65)]], { ancho: 2.2 });
      camino(svg, [[xt - 3, Z(12.65)], [xt + wt / 2, Z(12.91)], [xt + wt + 3, Z(12.65)]], { ancho: 2 });
      // la llegada por el techo, con FV-101 encima, y el tubo que entrega a 11,0 m
      var xl = xt + 36;
      camino(svg, [[xl, 18], [xl, Z(11.0)]], { ancho: 3, color: K.metalO });
      S.valv = s('g', {}, svg);
      s('path', { d: 'M' + (xl - 7) + ' 34L' + (xl + 7) + ' 48L' + (xl + 7) + ' 34L' + (xl - 7) + ' 48Z', fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.4, transform: 'rotate(90 ' + xl + ' 41)' }, S.valv);
      D.t(svg, xl - 12, 45, 'FV‑101', { tam: 11.5, ancla: 'end', color: K.tinta2 });
      S.cerrada = grupo(svg); D.t(S.cerrada, xl + 12, 30, 'la bomba para', { tam: 11.5, color: K.alerta, peso: 650 });
      // el respiradero de cuello de ganso
      var xr = xt + wt - 30;
      camino(svg, [[xr, Z(12.69)], [xr, Z(12.69) - 22], [xr + 16, Z(12.69) - 22], [xr + 16, Z(12.69) - 12]], { ancho: 2.2 });
      // el interruptor de muy alto nivel, con su horquilla a 12,25 m
      var xs = xt + wt / 2 + 18;
      camino(svg, [[xs, Z(12.83)], [xs, Z(12.25)]], { ancho: 1.6 });
      burbuja(svg, xs + 2, Z(12.83) - 30, 'LSHH', '103', 17);
      camino(svg, [[xs + 2, Z(12.83) - 13], [xs, Z(12.83)]], { ancho: 1.4 });
      // el rebose a 12,35 m, por fuera
      camino(svg, [[xt + wt, Z(12.35)], [xt + wt + 14, Z(12.35)], [xt + wt + 14, yb + 30]], { ancho: 2, color: K.metalO });
      D.t(svg, xt + wt + 28, Z(12.35) - 2, 'rebose 12,35', { tam: 11.5, color: K.tinta2 });
      // el transmisor en la toma de 9,2 m y la salida a la planta
      camino(svg, [[xt, Z(9.2)], [xt - 14, Z(9.2)]], { ancho: 1.4 });
      burbuja(svg, xt - 30, Z(9.2), 'LT', '102', 15);
      camino(svg, [[xt + wt / 2, Z(9.0)], [xt + wt / 2, yb + 18], [xt - 30, yb + 18]], { ancho: 3, color: K.metalO });
      D.flecha(svg, xt + 20, yb + 18, xt - 10, yb + 18, { color: K.tinta2, ancho: 1.8, punta: 7 });
      D.t(svg, xt - 32, yb + 36, 'a la planta', { tam: 11.5, color: K.tinta2 });
      // las cotas, a la derecha del tanque
      [[12.0, 'normal 12,0'], [11.0, 'llegada 11,0'], [9.5, 'mínimo 9,5']].forEach(function (c) {
        s('line', { x1: xt, x2: xt + wt + 26, y1: Z(c[0]), y2: Z(c[0]), stroke: K.tinta2, 'stroke-width': 1, 'stroke-dasharray': '3 3' }, svg);
        D.t(svg, xt + wt + 28, Z(c[0]) + 4, c[1], { tam: 11.5, color: K.tinta2 });
      });
      S.boca = grupo(svg); D.t(S.boca, xl + 8, Z(11.0) + 16, 'en el aire', { tam: 11.5, peso: 650, color: K.alerta });
      // el nivel contra el tiempo
      var gx0 = 360, gy0 = 40, gw = 250, gh = 230, tmax = 140;
      var X = function (tm) { return gx0 + tm / tmax * gw; }, Y = function (z) { return gy0 + gh - (z - 9.0) / 3.5 * gh; };
      S.X = X; S.Y = Y;
      [0, 30, 60, 90, 120].forEach(function (tm) { s('line', { x1: X(tm), x2: X(tm), y1: gy0, y2: gy0 + gh, stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, X(tm), gy0 + gh + 17, n(tm, 0), { tam: 11.5, ancla: 'middle', color: K.tinta2 }); });
      [9, 10, 11, 12].forEach(function (z) { s('line', { x1: gx0, x2: gx0 + gw, y1: Y(z), y2: Y(z), stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, gx0 - 6, Y(z) + 4, n(z, 0), { tam: 11.5, ancla: 'end', color: K.tinta2 }); });
      s('path', { d: 'M' + gx0 + ' ' + gy0 + 'V' + (gy0 + gh) + 'H' + (gx0 + gw), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      s('line', { x1: gx0, x2: gx0 + gw, y1: Y(9.5), y2: Y(9.5), stroke: K.alerta, 'stroke-width': 1.4, 'stroke-dasharray': '5 4' }, svg);
      D.t(svg, gx0 + gw, Y(9.5) + 16, 'mínimo', { tam: 11.5, color: K.alerta, ancla: 'end' });
      D.t(svg, gx0 - 2, gy0 - 12, 'nivel (m)', { tam: 12, peso: 600 });
      D.t(svg, gx0 + gw, gy0 + gh + 36, 'tiempo con la bomba parada (min)', { tam: 12, peso: 600, ancla: 'end' });
      var A = Math.PI * 9 / 4;
      S.l18 = D.trazo(svg, dTrazo([[X(0), Y(12)], [X(17.67 / 18 * 60), Y(9.5)]]), { color: AZ, ancho: 2.6 });
      S.l25 = D.trazo(svg, dTrazo([[X(0), Y(12)], [X(17.67 / 25 * 60), Y(9.5)]]), { color: OL, ancho: 2 });
      S.l8 = D.trazo(svg, dTrazo([[X(0), Y(12)], [X(17.67 / 8 * 60), Y(9.5)]]), { color: OL, ancho: 2, guion: '6 4' });
      // los puntos y, arriba a la derecha, donde no pasa ninguna línea, la clave con los tiempos
      S.t18 = grupo(svg); D.punto(S.t18, X(58.9), Y(9.5), { r: 5 });
      S.mBoca = grupo(svg); D.punto(S.mBoca, X(23.6), Y(11.0), { r: 4.5, color: K.alerta });
      function clave(i, col, guion, txt, punto) {
        var g = grupo(svg), y = 54 + i * 19;
        if (punto) s('circle', { cx: 482, cy: y - 4, r: 4.5, fill: K.alerta, stroke: K.tinta, 'stroke-width': 1.2 }, g);
        else s('line', { x1: 472, x2: 494, y1: y - 4, y2: y - 4, stroke: col, 'stroke-width': 2.4, 'stroke-dasharray': guion || 'none' }, g);
        D.t(g, 500, y, txt, { tam: 11.5, peso: 650, color: punto ? K.alerta : col });
        return g;
      }
      S.k18 = clave(0, AZ, '', '18 m³/h: 59 min');
      S.kBoca = clave(1, null, '', '11,0 m a los 24 min', true);
      S.k25 = clave(2, OL, '', '25 m³/h: 42 min');
      S.k8 = clave(3, OL, '6 4', '8 m³/h: 2,2 h');
      S.ponerNivel = function (z) { S.agua.setAttribute('y', Z(z)); S.agua.setAttribute('height', Z(9.0) - Z(z)); S.sup.setAttribute('y1', Z(z)); S.sup.setAttribute('y2', Z(z)); };
      S.A = A;
      return S;
    },
    pasos: [
      { texto: 'El tanque de llegada: 3,0 m de diámetro, $A = \\pi \\times 3,0^2/4$ = 7,07 m², con el nivel normal a 12,0 m y el mínimo a 9,5 m. Entre los dos guarda $7,07 \\times 2,5$ = 17,7 m³ de reserva.', dur: 1.6, ir: function (S, t) { S.ponerNivel(12.0); } },
      { texto: 'La bomba para: no entra agua, y la planta sigue tomando 18 m³/h. El nivel baja a $Q/A = 18/7,07$ = 2,55 m por hora, unos 4 cm por minuto.', dur: 2.2, ir: function (S, t) { D.ver(S.cerrada, t); S.l18.dibujar(T(t, 0.2, 1) * 0.4); S.ponerNivel(12.0 - 1.0 * T(t, 0.2, 1)); } },
      { texto: 'A los 24 minutos el nivel pasa por 11,0 m: la boca del tubo de llegada, 1 m bajo el nivel normal, queda en el aire. Si la bomba arrancara ahí, el agua caería libre, salpicaría y arrastraría aire.', dur: 1.8, ir: function (S, t) { D.ver(S.cerrada, 1); S.l18.dibujar(0.4); S.ponerNivel(11.0); D.ver(S.boca, t); D.ver(S.mBoca, t); D.ver(S.kBoca, t); } },
      { texto: 'Con la <a href="#eq-val-reserva">ecuación del tiempo de retención</a>, el nivel llega al mínimo en $t_r = 17,7/18$ = 0,98 h, 59 min, algo que se ve en la pantalla de la sala de control mucho antes de que importe.', dur: 2, ir: function (S, t) { D.ver(S.cerrada, 1); D.ver(S.boca, 1); S.l18.dibujar(0.4 + 0.6 * t); S.ponerNivel(11.0 - 1.5 * t); D.ver(S.t18, T(t, 0.7, 1)); D.ver(S.k18, T(t, 0.7, 1)); } },
      { texto: 'Con la demanda máxima, 25 m³/h, el tanque dura 42 min; con la mínima, 8 m³/h, 2,2 h. Para dos horas al caudal normal habría que doblar la sección: $A = 2 \\times 18/2,5$ = 14,4 m², un diámetro de 4,28 m, 4,3 m redondeado hacia arriba.', dur: 2, ir: function (S, t) { D.ver(S.cerrada, 1); D.ver(S.boca, 1); S.ponerNivel(9.5); S.l25.dibujar(T(t, 0, 0.6)); S.l8.dibujar(T(t, 0.2, 0.8)); D.ver(S.k25, T(t, 0.4, 0.8)); D.ver(S.k8, T(t, 0.6, 1)); } }
    ]
  });

  /* El respiradero del tanque de llegada: los caudales de la API 2000 y la pérdida del cuello de ganso de 1 y de 2 in,
     contra el vacío y la presión que aguanta el techo (el ejemplo del respiradero y tanque-llegada.py). */
  ZB.animacion('respiradero', {
    vista: [0, 0, 640, 320],
    alt: 'A la izquierda, el techo de cono del tanque con el respiradero de cuello de ganso y su malla, con el aire que entra cuando el tanque se vacía y el que sale cuando se llena. A la derecha, barras de la pérdida del respiradero contra lo que aguanta el techo: con tubo de 1 in, el aire que entra, 29,6 m³/h, pierde 386 Pa, más que los 250 Pa de vacío, y el que sale, 30,8 m³/h, pierde 416 Pa, más que los 350 Pa de presión; con tubo de 2 in, 23 y 24 Pa.',
    montar: function (svg) {
      var S = {};
      // el techo con el cuello de ganso, abajo a la izquierda; las cuentas de la norma, arriba
      var yb = 238, xt = 30, wt = 230;
      s('rect', { x: xt, y: yb, width: wt, height: 70, fill: AGUA, opacity: 0.6 }, svg);
      camino(svg, [[xt, yb + 70], [xt, yb], [xt + wt, yb], [xt + wt, yb + 70]], { ancho: 2.2 });
      camino(svg, [[xt - 4, yb], [xt + wt / 2, yb - 36], [xt + wt + 4, yb]], { ancho: 2 });
      var xr = xt + wt / 2 + 40, yr = yb - 26;
      camino(svg, [[xr, yr], [xr, yr - 46], [xr + 44, yr - 46], [xr + 44, yr - 18]], { ancho: 4 });
      s('line', { x1: xr + 36, x2: xr + 52, y1: yr - 16, y2: yr - 16, stroke: K.tinta, 'stroke-width': 1.4, 'stroke-dasharray': '2 2' }, svg);
      D.t(svg, xr + 56, yr - 12, 'malla', { tam: 11.5, color: K.tinta2 });
      D.t(svg, xr - 8, yr - 38, 'cuello de ganso, 1 m', { tam: 11.5, color: K.tinta2, ancla: 'end' });
      S.entra = grupo(svg);
      D.flecha(S.entra, xr + 66, yr - 40, xr + 50, yr - 22, { color: K.alerta, ancho: 2, punta: 7 });
      S.entraT = D.t(S.entra, xt + 6, yb + 58, '', { tam: 12, peso: 650, color: K.alerta });
      S.nivel = s('line', { x1: xt, x2: xt + wt, y1: yb + 30, y2: yb + 30, stroke: K.tinta2, 'stroke-width': 1.4 }, svg);
      S.cuentas = [
        ['API 2000, aire que entra', '0,94 × 25 + 0,169 × 26,4', '= 28,0 Nm³/h → 29,6 m³/h'],
        ['Aire que sale', '1,01 × 26,1 + 0,6 × 0,169 × 26,4', '= 29,1 Nm³/h → 30,8 m³/h']
      ].map(function (f, i) { var g = grupo(svg); lineas(g, xt, 22 + i * 58, f, { titulo: true, tam: 11.5, salto: 15 }); return g; });
      // las barras de la pérdida, en Pa: 0,3 px por Pa
      var bx = 330, kb = 0.6, by = 74;
      D.t(svg, bx, by - 34, 'pérdida del respiradero (Pa)', { tam: 12, peso: 600 });
      [0, 100, 200, 300, 400].forEach(function (p) { s('line', { x1: bx + p * kb, x2: bx + p * kb, y1: by - 18, y2: by + 186, stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, bx + p * kb, by + 202, n(p, 0), { tam: 11.5, ancla: 'middle', color: K.tinta2 }); });
      S.lim = [[250, by - 18, by + 76, 'vacío: 250'], [350, by + 98, by + 186, 'presión: 350']].map(function (l) {
        var g = grupo(svg);
        s('line', { x1: bx + l[0] * kb, x2: bx + l[0] * kb, y1: l[1], y2: l[2], stroke: K.alerta, 'stroke-width': 2, 'stroke-dasharray': '5 3' }, g);
        D.t(g, bx + l[0] * kb + 4, l[1] + 10, l[3], { tam: 11.5, color: K.alerta, peso: 650 });
        return g;
      });
      function fila(y, etq, pa, col) {
        var g = grupo(svg);
        var b = barraH(g, bx, y, Math.min(pa, 420) * kb, 22, col, { op: 0.85 });
        D.t(g, bx - 6, y + 16, etq, { tam: 12, ancla: 'end' });
        var tx = Math.min(pa, 420) * kb + 6;
        D.t(g, bx + tx, y + 16, n(pa, 0) + ' Pa', { tam: 12, peso: 650, halo: true });
        return { g: g, b: b };
      }
      D.t(svg, bx - 6, by + 8, 'entra', { tam: 12, peso: 650, ancla: 'end' });
      D.t(svg, bx - 6, by + 122, 'sale', { tam: 12, peso: 650, ancla: 'end' });
      S.e1 = fila(by + 16, '1 in', 386, K.alerta);
      S.e2 = fila(by + 46, '2 in', 23, AZ);
      S.s1 = fila(by + 130, '1 in', 416, K.alerta);
      S.s2 = fila(by + 160, '2 in', 24, AZ);
      S.nota = grupo(svg); D.t(S.nota, bx, by + 236, 'como masa: 43,7 m³/h, 1 in pierde 830 Pa', { tam: 11.5, color: K.tinta2 });
      return S;
    },
    pasos: [
      { texto: 'El aire entra cuando la bomba para y la planta toma 25 m³/h. La API 2000 pide 0,94 Nm³/h por cada m³/h que sale, más la respiración térmica de un tanque de 26,4 m³: $0,94 \\times 25 + 0,169 \\times 26,4$ = 28,0 Nm³/h. Sale cuando la línea pasa 26,1 m³/h y la planta no toma: $1,01 \\times 26,1 + 0,6 \\times 0,169 \\times 26,4$ = 29,1 Nm³/h, redondeado hacia arriba.', dur: 2.4, ir: function (S, t) { D.ver(S.cuentas[0], T(t, 0, 0.5)); D.ver(S.cuentas[1], T(t, 0.4, 1)); D.ver(S.entra, T(t, 0, 0.4)); D.ponerTexto(S.entraT, 'el nivel baja: entra aire'); } },
      { texto: 'Leídos como volumen en el tanque, × 1,057: 29,6 m³/h entran y 30,8 m³/h salen. El techo de acero de 4,76 mm admite unos 350 Pa de presión y puede no aguantar más de 250 Pa de vacío.', dur: 1.8, ir: function (S, t) { D.ver(S.cuentas[0], 1); D.ver(S.cuentas[1], 1); D.ver(S.entra, 1); D.ponerTexto(S.entraT, 'el nivel baja: entra aire'); S.lim.forEach(function (g) { D.ver(g, t); }); } },
      { texto: 'En tubo de 1 in, de 26,64 mm, el aire que entra va a 14,7 m/s, con $\\rho_a v^2/2 = 0,861 \\times 14,7^2/2$ = 93,6 Pa. Con la entrada, los dos codos y la salida, $\\sum K$ = 3,0, y la fricción, $fL/D$ = 1,12: $\\Delta p = 4,12 \\times 93,6$ = 386 Pa, 1,54 veces el vacío que aguanta el techo.', dur: 2.2, ir: function (S, t) { D.ver(S.e1.g, 1); S.e1.b.largo(t); } },
      { texto: 'Hacia afuera, el mismo tubo pierde 416 Pa, 1,19 veces sus 350 Pa. Sale más aire del que entra, pero manda el que entra, porque el techo aguanta menos vacío que presión.', dur: 1.6, ir: function (S, t) { D.ver(S.s1.g, 1); S.s1.b.largo(t); } },
      { texto: 'En 2 in, de 52,50 mm, la velocidad baja a 3,80 m/s y la cabeza de velocidad a 6,2 Pa: el aire que entra pierde 23 Pa, el 9 % del límite, y el que sale, 24 Pa. Doblar el diámetro baja la pérdida dieciséis veces, y le queda a la malla un K de unos 36. Leídos como masa, 43,7 m³/h, el de 1 in perdería 830 Pa: la respuesta, 2 in, no cambia.', dur: 2.2, ir: function (S, t) { D.ver(S.e2.g, 1); D.ver(S.s2.g, 1); S.e2.b.largo(t); S.s2.b.largo(t); D.ver(S.nota, T(t, 0.5, 1)); } }
    ]
  });

  /* Reto: la reserva del tanque de llegada con otro diámetro, la banda proporcional del controlador de nivel y la
     pérdida de un respiradero. */
})();

/* Las animaciones y los retos del capítulo 12, «Ventiladores, compresores y vacío». Se escriben aquí directo (en bombas
   pasan por el taller interactivo/). Usan el motor de figuras/comun/actividades.js y las piezas de
   figuras/comun/dibujo.js; los colores salen de la paleta del libro (ZB.dib.col y PALETA), nunca a mano.
   Los números salen del texto del capítulo y del modelo del caso (caso.json, que escribe
   herramientas/gases-planta-aceite.py): la línea de aire que se rompe (Fanno y Levenspiel), el ventilador de la caldera
   en aire estándar y en Bogotá, la carga parcial con compuerta y con variador, el aire de instrumentos en una y en
   varias etapas, el ciclo del pistón, el sistema de aire comprimido y la carga del vacío de la rectificación.
   El ciclo del pistón se mueve con el modelo de herramientas/figura-ciclo.py (el de la figura del ciclo, que a su vez
   copia el de la escena de Manim), sin cambios en su parte numérica, y su último paso se ve como esa figura.
   Cada animación que dibuja un sistema lo dibuja con todos sus equipos y en su orden, como el esquema o el típico del
   capítulo. Un color hace un solo trabajo dentro de cada animación: el caso y el modelo en azul (la primera serie de
   las gráficas); lo que se compara en oliva (la segunda); lo que se pasa de un límite en el rojo de alerta. En el ciclo
   del pistón, como en su figura, la etapa única va en tinta y la primera de dos en oliva. */
(function () {
  'use strict';
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, T = ZB.tramo;
  var PA = window.PALETA;
  var AZ = K.serie[0], OL = K.serie[1];
  var MUERTO = PA.graficas['zona-marcada'] || K.borde;

  /* ---------- El caso (caso.json) ---------- */
  var KG = 1.4, RU = 8314, MA = 28.97;                 // aire: k, J/(kmol·K), kg/kmol
  var P_BOG = 73.7, P_MAR = 101.325, RHO_BOG = 0.876, RHO_STD = 1.2;
  // El ventilador: la curva de la ecuación del capítulo, el punto del catálogo y el lado del aire de la caldera.
  var FAN = { Q: 0.45, dp: 1.60, n: 1750, eta: 0.78, c: [1.0391037801224545, 0.19781476149695373, 0.09924181263198713, -0.34269505083472107] };
  var Q_STD = 0.4301331099294456, DP_SIS = 1.20, N_BOG = 2138.2, M_AIRE = 0.5161597319153347;
  // La potencia al eje a carga parcial en Bogotá, a 2138 r/min: carga, compuerta, variador, q relativo con la compuerta
  // (caso.json, series.control).
  var CTL = [[0.3, 0.8065, 0.0337, 0.3216], [0.32, 0.8193, 0.0409, 0.343], [0.34, 0.8323, 0.0491, 0.3644], [0.36, 0.8455, 0.0583, 0.3859], [0.38, 0.8587, 0.0685, 0.4073], [0.4, 0.8721, 0.0799, 0.4288], [0.42, 0.8857, 0.0925, 0.4502], [0.44, 0.8993, 0.1064, 0.4716], [0.46, 0.9131, 0.1215, 0.4931], [0.48, 0.9269, 0.1381, 0.5145], [0.5, 0.9408, 0.1561, 0.5359], [0.52, 0.9548, 0.1756, 0.5574], [0.54, 0.9688, 0.1966, 0.5788], [0.56, 0.9828, 0.2193, 0.6003], [0.58, 0.9969, 0.2436, 0.6217], [0.6, 1.0109, 0.2697, 0.6431], [0.62, 1.0249, 0.2976, 0.6646], [0.64, 1.0389, 0.3273, 0.686], [0.66, 1.0528, 0.359, 0.7074], [0.68, 1.0666, 0.3926, 0.7289], [0.7, 1.0803, 0.4283, 0.7503], [0.72, 1.0939, 0.4661, 0.7718], [0.74, 1.1073, 0.506, 0.7932], [0.76, 1.1205, 0.5482, 0.8146], [0.78, 1.1335, 0.5926, 0.8361], [0.8, 1.1462, 0.6393, 0.8575], [0.82, 1.1586, 0.6885, 0.8789], [0.84, 1.1706, 0.7401, 0.9004], [0.86, 1.1823, 0.7943, 0.9218], [0.88, 1.1936, 0.851, 0.9433], [0.9, 1.2043, 0.9103, 0.9647], [0.92, 1.2145, 0.9724, 0.9861], [0.94, 1.2242, 1.0372, 1.0076], [0.96, 1.2331, 1.1048, 1.029], [0.98, 1.2413, 1.1753, 1.0504], [1.0, 1.2487, 1.2487, 1.0719]];
  // El aire de instrumentos: 50 Nm³/h a 700 kPa manométricos, 80 % por etapa, interenfriado a 30 °C.
  var M_INST = 50 * 101325 * 0.028965 / (8.314462618 * 273.15) / 3600, CP = 1005, ETA_S = 0.80, T_INT = 30;

  /* ---------- Las ecuaciones del capítulo ---------- */
  function fanDp(Q, N, rho) {                             // la curva del ventilador con las leyes de afinidad (kPa)
    var q = Q / (FAN.Q * N / FAN.n), c = FAN.c;
    return rho / RHO_STD * Math.pow(N / FAN.n, 2) * FAN.dp * (c[0] + q * (c[1] + q * (c[2] + q * c[3])));
  }
  function sisDp(Q, rho) { return DP_SIS * rho / RHO_STD * Math.pow(Q / Q_STD, 2); }
  function fanno(Ma) { var m2 = Ma * Ma; return (1 - m2) / (KG * m2) + (KG + 1) / (2 * KG) * Math.log((KG + 1) * m2 / (2 + (KG - 1) * m2)); }
  function fannoInv(N) { if (N <= 0) return 1; var lo = 0.01, hi = 1; for (var i = 0; i < 80; i++) { var m = (lo + hi) / 2; if (fanno(m) > N) lo = m; else hi = m; } return (lo + hi) / 2; }
  function pSobreEstrella(Ma) { return 1 / Ma * Math.sqrt((KG + 1) / (2 + (KG - 1) * Ma * Ma)); }
  function gSobreG(Ma) { return Ma * Math.pow((KG + 1) / (2 + (KG - 1) * Ma * Ma), (KG + 1) / (2 * (KG - 1))); }
  function p1Sobrep0(Ma) { return Math.pow(1 + (KG - 1) / 2 * Ma * Ma, -KG / (KG - 1)); }
  function gEstrella(p0, T0) { return p0 * Math.sqrt(KG * MA / (RU * T0) * Math.pow(2 / (KG + 1), (KG + 1) / (KG - 1))); }
  function compresion(N, p1, p2, tInt) {                  // etapas iguales, cada una con 80 %, enfriadas a tInt
    var r = Math.pow(p2 / p1, 1 / N), a = (KG - 1) / KG, tIn = 20, et = [], w = 0;
    for (var i = 0; i < N; i++) {
      var ts = (tIn + 273.15) * Math.pow(r, a) - 273.15, tOut = tIn + (ts - tIn) / ETA_S, wi = M_INST * CP * (tOut - tIn) / 1000;
      et.push({ r: r, tIn: tIn, tOut: tOut, W: wi, pIn: p1 * Math.pow(r, i) }); w += wi; tIn = tInt == null ? T_INT : tInt;
    }
    return { r: r, et: et, W: w, Tmax: Math.max.apply(null, et.map(function (e) { return e.tOut; })) };
  }
  function antoine(t) { return Math.pow(10, 7.49358 - 1936.23 / (t + 244.4)); }        // mmHg, limoneno

  /* ---------- Piezas ---------- */
  function grupo(padre, op) { return s('g', { opacity: op == null ? 0 : op }, padre); }
  function camino(padre, pts, o) {
    o = o || {};
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + (+p[0]).toFixed(1) + ' ' + (+p[1]).toFixed(1); }).join('');
    return s('path', { d: d, fill: o.fill || 'none', stroke: o.color || K.tinta, 'stroke-width': o.ancho || 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'stroke-dasharray': o.guion || 'none' }, padre);
  }
  function dTrazo(pts) { return pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(''); }
  function lineas(padre, x, y, filas, o) {
    o = o || {};
    filas.forEach(function (f, i) { D.t(padre, x, y + i * (o.salto || 17), f, { tam: o.tam || 12, peso: i === 0 && o.titulo ? 700 : (o.peso || 500), ancla: o.ancla || 'start', color: i === 0 && o.titulo ? (o.colorT || K.tinta) : (o.color || K.tinta2) }); });
  }
  function barra(padre, x, y, w, h, color, o) {
    o = o || {};
    var r = s('rect', { x: x, y: y, width: 0, height: h, fill: color, opacity: o.op == null ? 1 : o.op }, padre);
    r.largo = function (f) { r.setAttribute('width', Math.max(0, w * Math.max(0, Math.min(1, f)))); };
    r.largo(0);
    return r;
  }
  function curva(f, a, b, k, X, Y) { var p = []; for (var i = 0; i <= k; i++) { var x = a + (b - a) * i / k; p.push([X(x), Y(f(x))]); } return p; }
  function rotado(padre, x, y, txt, o) {
    o = o || {};
    var t = s('text', { x: x, y: y, 'font-size': o.tam || 12, 'font-weight': o.peso || 600, 'text-anchor': 'middle', fill: o.color || K.tinta, transform: 'rotate(-90 ' + x + ' ' + y + ')' }, padre);
    D.ponerTexto(t, txt);
    return t;
  }
  // Un compresor (círculo con el triángulo de la ISO 10628), un motor y un recipiente vertical, como en los típicos.
  function compresorSim(padre, cx, cy, r) {
    var g = s('g', {}, padre);
    s('circle', { cx: cx, cy: cy, r: r, fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.8 }, g);
    camino(g, [[cx - r * 0.75, cy - r * 0.62], [cx + r * 0.95, cy - r * 0.3]], { ancho: 1.4 });
    camino(g, [[cx - r * 0.75, cy + r * 0.62], [cx + r * 0.95, cy + r * 0.3]], { ancho: 1.4 });
    return g;
  }
  function motorSim(padre, cx, cy, r) {
    var g = s('g', {}, padre);
    s('circle', { cx: cx, cy: cy, r: r, fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.6 }, g);
    D.t(g, cx, cy + 4.5, 'M', { tam: 12, peso: 700, ancla: 'middle' });
    return g;
  }
  function recipiente(padre, cx, cy, w, h, relleno) {
    var x = cx - w / 2, y = cy - h / 2, c = Math.min(10, h / 6);
    return s('path', { d: 'M' + x + ' ' + (y + c) + 'Q' + cx + ' ' + (y - c) + ' ' + (x + w) + ' ' + (y + c) + 'V' + (y + h - c) + 'Q' + cx + ' ' + (y + h + c) + ' ' + x + ' ' + (y + h - c) + 'Z', fill: relleno || K.blanco, stroke: K.tinta, 'stroke-width': 1.8 }, padre);
  }
  function intercambiador(padre, cx, cy, r) {
    var g = s('g', {}, padre);
    s('circle', { cx: cx, cy: cy, r: r, fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.8 }, g);
    camino(g, [[cx - r * 0.8, cy + r * 0.25], [cx - r * 0.25, cy + r * 0.25], [cx + r * 0.25, cy - r * 0.25], [cx + r * 0.8, cy - r * 0.25]], { ancho: 1.4 });
    return g;
  }
  function filtroSim(padre, cx, cy) {
    var g = s('g', {}, padre);
    s('path', { d: 'M' + (cx - 8) + ' ' + cy + 'L' + cx + ' ' + (cy - 11) + 'L' + (cx + 8) + ' ' + cy + 'L' + cx + ' ' + (cy + 11) + 'Z', fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.6 }, g);
    camino(g, [[cx, cy - 11], [cx, cy + 11]], { ancho: 1.2, guion: '3 2' });
    return g;
  }
  function burbuja(padre, cx, cy, letras, num) {
    var g = s('g', {}, padre);
    s('circle', { cx: cx, cy: cy, r: 16, fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.4 }, g);
    D.t(g, cx, cy - 1, letras, { tam: 11.5, peso: 700, ancla: 'middle' });
    D.t(g, cx, cy + 11, num, { tam: 10.5, peso: 500, ancla: 'middle' });
    return g;
  }
  // Un recuadro que marca el equipo del paso.
  function marco(padre, x, y, w, h) { return s('rect', { x: x, y: y, width: w, height: h, rx: 6, fill: 'none', stroke: K.amarillo, 'stroke-width': 0, opacity: 0 }, padre); }
  function resaltar(r, t) { r.setAttribute('opacity', t > 0 ? 1 : 0); r.setAttribute('stroke-width', 3); r.setAttribute('stroke', K.oliva); r.setAttribute('stroke-dasharray', '5 4'); }

  /* ================= 12.1 Cuando la densidad cambia ================= */

  /* La línea de aire que se rompe: el tanque, el tubo con la entrada y los tres codos del esquema del ejemplo, y la
     presión a lo largo del tubo con Fanno y Levenspiel. La resistencia del tubo se reparte a lo largo del tubo y la de
     la entrada y los codos va donde están, en las proporciones del esquema. */
  var LIN = { p0: 1.101e6, T0: 293.15, L: 10, D: 0.0525, f: 0.0188 };
  LIN.fLD = LIN.f * LIN.L / LIN.D;                         // 3,58
  LIN.Kt = 5.6;                                            // 3,58 + 0,5 + 3 × 0,5, redondeado como en el ejemplo
  LIN.fLD = LIN.Kt - 2;                                    // lo que se reparte a lo largo del tubo
  LIN.Ma1 = fannoInv(LIN.Kt);                              // 0,294
  LIN.gg = gSobreG(LIN.Ma1);                               // 0,48
  LIN.p1 = p1Sobrep0(LIN.Ma1);                             // 0,942
  LIN.pstar = LIN.p1 / pSobreEstrella(LIN.Ma1);            // 0,25
  LIN.G = gEstrella(LIN.p0, LIN.T0);                       // 2600 kg/(m²·s)
  LIN.m = LIN.gg * LIN.G * Math.PI * LIN.D * LIN.D / 4;    // 2,7 kg/s
  LIN.codos = [0.83, 2.29, 8.33];                          // m, en las proporciones del esquema
  function linResistencia(x) { var N = 0.5 + LIN.fLD * x / LIN.L; LIN.codos.forEach(function (c) { if (x >= c) N += 0.5; }); return N; }
  function linP(x) { return LIN.pstar * pSobreEstrella(fannoInv(LIN.Kt - linResistencia(x))); }
  ZB.animacion('estrangulado', {
    vista: [0, 0, 640, 400],
    alt: 'Arriba, el tanque de aire a 1,101 MPa absolutos y 20 °C, y la línea de 10 m de tubo de 2 in con la entrada brusca, tres codos y la salida a la atmósfera. Abajo, la presión a lo largo del tubo como fracción de la del tanque: entra al tubo a 0,942, baja con la fricción y con un escalón en la entrada y en cada codo, y sale a 0,25 en Mach 1, muy por encima de la atmósfera, 0,092. A la derecha, los números: K total de 5,6, Mach 0,294 a la entrada, 0,48 veces el flujo de una tobera sola, 2,7 kg/s y 244 K a la salida.',
    montar: function (svg) {
      var S = {};
      // la línea, como en el esquema del ejemplo
      s('rect', { x: 26, y: 50, width: 64, height: 96, rx: 10, fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.8 }, svg);
      D.t(svg, 58, 92, 'aire', { tam: 12, peso: 700, ancla: 'middle' });
      D.t(svg, 58, 110, '20 °C', { tam: 12, ancla: 'middle', color: K.tinta2 });
      D.t(svg, 58, 40, 'p_0 = 1,101 MPa', { tam: 12, ancla: 'middle', color: K.tinta2 });
      var ruta = [[90, 120], [140, 120], [140, 56], [400, 56], [400, 104], [430, 104]];
      camino(svg, ruta, { color: K.metalM, ancho: 7 });
      camino(svg, ruta, { color: K.tinta, ancho: 1.2 });
      D.flecha(svg, 432, 104, 470, 104, { color: K.tinta2, ancho: 2, punta: 8 });
      D.t(svg, 478, 108, 'atm', { tam: 12, color: K.tinta2 });
      [[140, 120], [140, 56], [400, 56]].forEach(function (p) { s('circle', { cx: p[0], cy: p[1], r: 4.5, fill: K.tinta }, svg); });
      D.t(svg, 270, 84, '10 m de 2 in cédula 40, D = 52,5 mm', { tam: 12, ancla: 'middle', color: K.tinta2 });
      // las resistencias, en el paso 2
      S.ks = grupo(svg);
      D.t(S.ks, 112, 140, 'K = 0,5', { tam: 11.5, ancla: 'middle', color: AZ, peso: 650 });
      D.t(S.ks, 160, 136, '0,5', { tam: 11.5, color: AZ, peso: 650 });
      D.t(S.ks, 128, 48, '0,5', { tam: 11.5, ancla: 'end', color: AZ, peso: 650 });
      D.t(S.ks, 408, 48, '0,5', { tam: 11.5, color: AZ, peso: 650 });
      D.t(S.ks, 270, 46, 'fL/D = 3,58', { tam: 11.5, ancla: 'middle', color: AZ, peso: 650 });
      // los Mach, en el paso 3
      S.mach = grupo(svg);
      D.t(S.mach, 92, 162, 'Ma_1 = 0,294 a la entrada', { tam: 11.5, peso: 650, color: AZ });
      D.t(S.mach, 424, 126, 'Ma = 1', { tam: 11.5, peso: 650, color: AZ, ancla: 'end' });
      // la gráfica de la presión a lo largo del tubo
      var X = function (x) { return 130 + x / 10 * 300; }, Y = function (p) { return 350 - p * 150; };
      S.X = X; S.Y = Y;
      [0, 0.25, 0.5, 0.75, 1].forEach(function (v) {
        s('line', { x1: 70, x2: 490, y1: Y(v), y2: Y(v), stroke: K.rejilla, 'stroke-width': 1 }, svg);
        D.t(svg, 64, Y(v) + 4, n(v, 2), { tam: 11.5, ancla: 'end', color: K.tinta2 });
      });
      [0, 2, 4, 6, 8, 10].forEach(function (v) { D.t(svg, X(v), 366, n(v, 0), { tam: 11.5, ancla: 'middle', color: K.tinta2 }); });
      s('path', { d: 'M70 196V350H490', fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      s('line', { x1: X(0), x2: X(0), y1: 196, y2: 350, stroke: K.guia, 'stroke-width': 1, 'stroke-dasharray': '3 3' }, svg);
      s('line', { x1: X(10), x2: X(10), y1: 196, y2: 350, stroke: K.guia, 'stroke-width': 1, 'stroke-dasharray': '3 3' }, svg);
      D.t(svg, 100, 252, 'tanque', { tam: 11.5, ancla: 'middle', color: K.tinta2 });
      D.t(svg, 460, 222, 'afuera', { tam: 11.5, ancla: 'middle', color: K.tinta2 });
      D.t(svg, 66, 186, 'p/p_0', { tam: 12.5, peso: 600 });
      D.t(svg, 430, 392, 'distancia a lo largo del tubo (m)', { tam: 12.5, peso: 600, ancla: 'end' });
      // las referencias: la crítica de una tobera y la atmósfera
      S.ref = grupo(svg);
      s('line', { x1: 70, x2: 490, y1: Y(0.528), y2: Y(0.528), stroke: K.tinta2, 'stroke-width': 1.2, 'stroke-dasharray': '6 4' }, S.ref);
      D.t(S.ref, 496, Y(0.528) + 4, 'crítica, 0,528', { tam: 11.5, color: K.tinta2 });
      s('line', { x1: 70, x2: 490, y1: Y(0.092), y2: Y(0.092), stroke: K.tinta2, 'stroke-width': 1.2, 'stroke-dasharray': '2 3' }, S.ref);
      S.atmT = D.t(S.ref, 496, Y(0.092) + 4, 'atmósfera, 0,092', { tam: 11.5, color: K.tinta2 });
      // el perfil
      var pts = [[X(-1.4), Y(1)], [X(0), Y(1)], [X(0), Y(LIN.p1)]];
      var xs = [0]; for (var x = 0.05; x < 10; x += 0.05) xs.push(x); LIN.codos.forEach(function (c) { xs.push(c - 1e-4, c + 1e-4); }); xs.push(10);
      xs.sort(function (a, b) { return a - b; });
      xs.forEach(function (x) { pts.push([X(x), Y(x === 0 ? LIN.p1 : linP(x))]); });
      S.perfil = D.trazo(svg, dTrazo(pts), { color: AZ, ancho: 2.6 });
      S.salto = grupo(svg);
      s('line', { x1: X(10), x2: X(10.9), y1: Y(LIN.pstar), y2: Y(LIN.pstar), stroke: AZ, 'stroke-width': 2.6 }, S.salto);
      S.chorro = s('line', { x1: X(10.9), x2: X(10.9), y1: Y(LIN.pstar), y2: Y(0.092), stroke: AZ, 'stroke-width': 1.6, 'stroke-dasharray': '4 3' }, S.salto);
      S.np = grupo(svg);
      D.t(S.np, X(0) - 6, Y(LIN.p1) + 12, n(LIN.p1, 3), { tam: 12, peso: 700, color: AZ, ancla: 'end', halo: true });
      D.t(S.np, X(10) + 6, Y(LIN.pstar) - 8, n(LIN.pstar, 2) + ', Mach 1', { tam: 12, peso: 700, color: AZ, halo: true });
      // los resultados, a la derecha
      S.r = [];
      var filas = [['K_t = ' + n(LIN.Kt, 1), 'cabezas de velocidad'], ['Ma_1 = ' + n(LIN.Ma1, 3), 'a la entrada del tubo'], ['G/G^* = ' + n(LIN.gg, 2), 'p_1/p_0 = ' + n(LIN.p1, 3)],
        ['G^* = ' + n(Math.round(LIN.G / 50) * 50, 0) + ' kg/(m²·s)', n(LIN.m, 1) + ' kg/s; T^* = ' + n(2 * LIN.T0 / 2.4, 0) + ' K']];
      filas.forEach(function (f, i) { var g = grupo(svg); S.r.push(g); lineas(g, 512, 30 + i * 40, f, { titulo: true, tam: 12, salto: 16, colorT: AZ }); });
      return S;
    },
    pasos: [
      { texto: 'La línea: aire a 10⁶ Pa manométricos y 20 °C, a nivel del mar, $p_0$ = 1,101 MPa absolutos, que sale a la atmósfera por 10 m de tubo de 2 in cédula 40 con una entrada brusca y tres codos. La descarga está a $0,1013/1,101$ = 0,092 veces la presión de la fuente, muy por debajo de la <a href="#eq-gas-critica">relación crítica</a>, 0,528: la línea se estrangula.', dur: 1.6, ir: function (S, t) { D.ver(S.ref, t); } },
      { texto: 'La resistencia, en cabezas de velocidad: con el factor de Darcy de la turbulencia completa, 0,0188, el tubo suma $fL/D = 0,0188 \\times 10/0,0525$ = 3,58; la entrada brusca, 0,5, y los tres codos, 1,5. En total, $K_t$ = 5,6. La salida no se suma.', dur: 1.6, ir: function (S, t) { D.ver(S.ks, t); D.ver(S.r[0], T(t, 0.4, 1)); } },
      { texto: 'El tubo entero se estrangula en la salida cuando su resistencia es la de la <a href="#eq-gas-fanno">ecuación de Fanno</a> con el Mach de la entrada. Tanteando, $K_t$ = 5,6 pide $\\mathrm{Ma}_1$ = 0,294: el aire entra al tubo a 0,294 veces la velocidad del sonido y sale en Mach 1.', dur: 1.6, ir: function (S, t) { D.ver(S.mach, t); D.ver(S.r[1], T(t, 0.4, 1)); } },
      { texto: 'La tobera de la entrada, con la <a href="#eq-gas-levenspiel">ecuación de Levenspiel</a>: $G/G^* = 0,48$ y $p_1/p_0 = (1 + 0,2 \\times 0,294^2)^{-3,5}$ = 0,942. Con la presión de Fanno, $p_1/p^*$ = 3,70: la presión cae a lo largo del tubo, con un escalón en la entrada y en cada codo, y la salida queda en $0,942/3,70$ = 0,25 veces la de la fuente.', dur: 2.6, ir: function (S, t) { S.perfil.dibujar(T(t, 0, 0.85)); D.ver(S.np, T(t, 0.7, 1)); D.ver(S.r[2], T(t, 0.6, 1)); } },
      { texto: 'Con la <a href="#eq-gas-estrangulado">ecuación del flujo estrangulado</a>, una tobera sola daría $G^*$ = 2600 kg/(m²·s); el tubo deja pasar $0,48 \\times 2600$ = 1250, 2,7 kg/s por 21,6 cm². El aire sale en Mach 1, a $T^* = 2 \\times 293,15/2,4$ = 244,3 K: la expansión lo enfría casi 50 grados.', dur: 1.6, ir: function (S, t) { D.ver(S.r[3], t); } },
      { texto: 'Afuera, el chorro se expande de 0,25 a 0,092 veces la presión de la fuente. Si la presión de afuera baja más, nada cambia dentro del tubo: ni el caudal ni la presión de la salida. Es la cuenta de la válvula de alivio de un tanque de aire o de una línea rota.', dur: 1.8, ir: function (S, t) { D.ver(S.salto, t); } }
    ]
  });

  /* Reto: las condiciones de un volumen, una tobera estrangulada y el tubo de Levenspiel. */

  /* ================= 12.2 Ventiladores y sopladores ================= */

  /* El ventilador de la caldera contra el lado del aire, como en la figura del ventilador: en aire estándar, en Bogotá
     y a la velocidad corregida, con la zona inestable a la izquierda del máximo de su curva. */
  ZB.animacion('bogota', {
    vista: [0, 0, 640, 380],
    alt: 'Presión contra caudal del ventilador de la caldera y del lado del aire de la caldera. Primero, la combustión pide 0,516 kg/s de aire. En aire estándar el ventilador cruza la caldera en 0,482 m³/s y 1,51 kPa, 0,579 kg/s, y la compuerta lo baja a 0,430 m³/s. En Bogotá las dos curvas bajan a 0,73 veces y el cruce queda en 0,482 m³/s con 1,10 kPa, 0,422 kg/s: −6 % de aire en exceso. A 2138 r/min el ventilador da los 0,589 m³/s que hacen falta, con 1,64 kPa y 1,25 kW. A la izquierda del máximo de su curva queda la zona inestable, y la potencia máxima de la curva, 1,27 kW, pide un motor de por lo menos 1,34 kW.',
    montar: function (svg) {
      var S = {};
      var x0 = 62, y0 = 22, w = 380, h = 300, qmax = 0.8, pmax = 3;
      var X = function (q) { return x0 + q / qmax * w; }, Y = function (p) { return y0 + h - Math.min(p, pmax) / pmax * h; };
      S.zona = s('rect', { x: x0, y: y0, width: X(0.6 * FAN.Q * N_BOG / FAN.n) - x0, height: h, fill: K.zona, opacity: 0 }, svg);
      S.zonaT = grupo(svg); D.t(S.zonaT, x0 + 8, Y(0.75), 'zona inestable', { tam: 11.5, color: K.tinta2 }); D.t(S.zonaT, x0 + 8, Y(0.75) + 15, 'a 2138 r/min', { tam: 11.5, color: K.tinta2 });
      for (var q = 0; q <= qmax + 1e-9; q += 0.1) { s('line', { x1: X(q), x2: X(q), y1: y0, y2: y0 + h, stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, X(q), y0 + h + 17, n(q, 1), { tam: 11.5, ancla: 'middle', color: K.tinta2 }); }
      for (var p = 0; p <= pmax + 1e-9; p += 0.5) { s('line', { x1: x0, x2: x0 + w, y1: Y(p), y2: Y(p), stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, x0 - 6, Y(p) + 4, n(p, 1), { tam: 11.5, ancla: 'end', color: K.tinta2 }); }
      s('path', { d: 'M' + x0 + ' ' + y0 + 'V' + (y0 + h) + 'H' + (x0 + w), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      D.t(svg, x0 + w, y0 + h + 36, 'caudal a la entrada del ventilador (m³/s)', { tam: 12, peso: 600, ancla: 'end' });
      D.t(svg, x0 - 2, y0 - 8, 'presión (kPa)', { tam: 12, peso: 600 });
      function trazo(f, a, b, o) { return D.trazo(svg, dTrazo(curva(f, a, b, 60, X, Y)), o); }
      S.fStd = trazo(function (Q) { return fanDp(Q, FAN.n, RHO_STD); }, 0, 1.62 * FAN.Q, { color: AZ, ancho: 2, guion: '6 4' });
      S.sStd = trazo(function (Q) { return sisDp(Q, RHO_STD); }, 0, 0.62, { color: OL, ancho: 1.8, guion: '6 4' });
      S.fBog = trazo(function (Q) { return fanDp(Q, FAN.n, RHO_BOG); }, 0, 1.62 * FAN.Q, { color: AZ, ancho: 1.8 });
      S.sBog = trazo(function (Q) { return sisDp(Q, RHO_BOG); }, 0, 0.8, { color: OL, ancho: 1.8 });
      S.fN = trazo(function (Q) { return fanDp(Q, N_BOG, RHO_BOG); }, 0, qmax, { color: AZ, ancho: 3 });
      // la clave, arriba a la izquierda, donde no pasa ninguna curva; cada línea aparece con su curva
      S.ley = [['6 4', AZ, 2, 'ventilador, aire estándar, 1750 r/min'], ['', AZ, 1.8, 'el mismo en Bogotá'], ['', AZ, 3, 'en Bogotá a 2138 r/min'],
        ['6 4', OL, 1.8, 'caldera, aire estándar'], ['', OL, 1.8, 'caldera en Bogotá']].map(function (l, i) {
        var g = grupo(svg), y = 36 + i * 18;
        s('line', { x1: 72, x2: 98, y1: y - 4, y2: y - 4, stroke: l[1], 'stroke-width': l[2], 'stroke-dasharray': l[0] || 'none' }, g);
        D.t(g, 104, y, l[3], { tam: 11.5, color: K.tinta2 });
        return g;
      });
      // lo que pide la caldera en Bogotá
      S.pide = grupo(svg);
      s('line', { x1: X(0.589), x2: X(0.589), y1: y0, y2: y0 + h, stroke: K.tinta2, 'stroke-width': 1, 'stroke-dasharray': '4 3' }, S.pide);
      D.t(S.pide, X(0.589) - 5, y0 + h - 30, '0,589 m³/s', { tam: 11.5, color: K.tinta2, ancla: 'end' });
      D.t(S.pide, X(0.589) - 5, y0 + h - 14, 'en Bogotá', { tam: 11.5, color: K.tinta2, ancla: 'end' });
      function punto(Q, dp, txt, dx, dy, anc) { var g = grupo(svg); D.punto(g, X(Q), Y(dp), { r: 5.5 }); D.t(g, X(Q) + dx, Y(dp) + dy, txt, { tam: 12, peso: 650, ancla: anc || 'start', halo: true }); return g; }
      // los rótulos de los puntos, donde no los cruza ninguna curva (buscado con la geometría de cada curva)
      S.p1 = punto(0.4823, 1.509, '0,579 kg/s', -74, 8);
      S.p2 = punto(0.4301, 1.631, '0,430 m³/s, 0,90 kW', -64, -36);
      S.p3 = punto(0.4823, 1.101, '0,422 kg/s', -30, 42);
      S.p4 = punto(0.5893, 1.644, '0,516 kg/s', 14, -2);
      S.pmax = grupo(svg);
      s('circle', { cx: X(0.6573), cy: Y(fanDp(0.6573, N_BOG, RHO_BOG)), r: 3.5, fill: K.tinta2 }, S.pmax);
      // las cuentas, a la derecha
      S.c = [];
      [['La combustión pide', '0,516 kg/s de aire', '0,430 m³/s estándar'], ['Aire estándar, 1750 r/min', '0,482 m³/s: 0,579 kg/s', 'compuerta: 0,90 kW'], ['Bogotá, 1750 r/min', '0,482 m³/s: 0,422 kg/s', 'aire en exceso: −6 %'], ['Bogotá, 2138 r/min', '0,589 m³/s: 0,516 kg/s', '1,644 kPa y 1,25 kW'], ['El motor', 'P máx. 1,27 kW ÷ 0,95', 'por lo menos 1,34 kW']].forEach(function (f, i) {
        var g = grupo(svg); S.c.push(g); lineas(g, 464, 30 + i * 62, f, { titulo: true, tam: 12, salto: 16, colorT: i === 2 ? K.alerta : K.tinta });
      });
      return S;
    },
    pasos: [
      { texto: 'La caldera da 1600 kg/h de vapor a 5 bara: 1110 kW, que con 85 % y el poder calorífico inferior del metano piden 1,627 mol/s de gas. Con el aire teórico de 9,52 moles por mol y 15 % de exceso (<a href="#eq-gas-exceso">aire en exceso</a>), la combustión pide 0,516 kg/s de aire: 0,430 m³/s de aire estándar.', dur: 1.6, ir: function (S, t) { D.ver(S.c[0], t); } },
      { texto: 'En aire estándar, el ventilador sigue la <a href="#eq-gas-curva-ventilador">curva del caso</a> con 1,60 kPa y 0,45 m³/s en su punto, y la caldera la <a href="#eq-gas-sistema">parábola del lado del aire</a>, 1,20 kPa a 0,430 m³/s. Se cruzan en 0,482 m³/s y 1,51 kPa: 0,579 kg/s, 12 % de margen. La compuerta lo lleva a 0,430 m³/s, donde el ventilador da 1,63 kPa y pide $0,430 \\times 1,63/0,778$ = 0,90 kW.', dur: 2.4, ir: function (S, t) { S.fStd.dibujar(T(t, 0, 0.5)); S.sStd.dibujar(T(t, 0.2, 0.7)); D.ver(S.ley[0], T(t, 0, 0.4)); D.ver(S.ley[3], T(t, 0.2, 0.6)); D.ver(S.p1, T(t, 0.6, 0.8)); D.ver(S.p2, T(t, 0.8, 1)); D.ver(S.c[1], T(t, 0.6, 1)); } },
      { texto: 'En Bogotá el aire tiene 0,876 kg/m³, 0,73 veces el estándar. Con las <a href="#eq-gas-afinidad">leyes de afinidad con la densidad</a>, la curva del ventilador y la de la caldera bajan las dos a 0,73 veces, y el cruce queda en el mismo volumen, 0,482 m³/s, con $1,509 \\times 0,73$ = 1,10 kPa. Pero son $0,482 \\times 0,876$ = 0,422 kg/s: el aire en exceso pasa de +15 % a −6 %.', dur: 2.4, ir: function (S, t) { S.fBog.dibujar(T(t, 0, 0.5)); S.sBog.dibujar(T(t, 0.2, 0.7)); D.ver(S.ley[1], T(t, 0, 0.4)); D.ver(S.ley[4], T(t, 0.2, 0.6)); D.ver(S.p3, T(t, 0.6, 1)); D.ver(S.c[2], T(t, 0.6, 1)); D.ver(S.p2, 1 - T(t, 0, 0.3)); } },
      { texto: 'Para mover 0,516 kg/s en Bogotá hacen falta $0,516/0,876$ = 0,589 m³/s. El punto se mueve sobre la parábola de la caldera, y con las leyes de afinidad, $N = 1750 \\times 0,589/0,482$ = 2138 r/min, $\\Delta p = 1,101 \\times (2138/1750)^2$ = 1,644 kPa y $P = 0,589 \\times 1,644/0,776$ = 1,25 kW: 22 % más rápido y 39 % más potencia.', dur: 2.4, ir: function (S, t) { D.ver(S.pide, T(t, 0, 0.3)); S.fN.dibujar(T(t, 0.2, 0.8)); D.ver(S.ley[2], T(t, 0.2, 0.6)); D.ver(S.p4, T(t, 0.7, 1)); D.ver(S.c[3], T(t, 0.6, 1)); } },
      { texto: 'A la izquierda del máximo de su curva, hacia 60 % de su caudal, queda la zona inestable. El motor se escoge con la potencia máxima de la curva a 2138 r/min, 1,27 kW en 0,66 m³/s, y a 2600 m un motor normal da 95 % de su potencia nominal: por lo menos $1,27/0,95$ = 1,34 kW. El de 0,90 kW del nivel del mar hay que cambiarlo.', dur: 2, ir: function (S, t) { S.zona.setAttribute('opacity', t); D.ver(S.zonaT, t); D.ver(S.pmax, T(t, 0.3, 1)); D.ver(S.c[4], T(t, 0.5, 1)); } }
    ]
  });

  /* Compuerta o variador: la potencia al eje a carga parcial de la figura del control, con la zona inestable de la
     compuerta y el piso de 25 a 30 Hz del variador. */
  ZB.animacion('control', {
    vista: [0, 0, 640, 360],
    alt: 'Potencia al eje del ventilador de la caldera en Bogotá contra la carga, de 30 a 100 % del aire. A plena carga, 2138 r/min y 1,25 kW. Con la compuerta, la potencia baja poco: 1,08 kW a 70 % y 0,94 kW a la mitad. Con el variador baja con el cubo: 0,43 kW a 70 % y 0,16 kW a la mitad. Por debajo de unos 55 % la compuerta lleva el ventilador a la zona inestable; por debajo de 42 a 50 % el variador bajaría del piso de 25 a 30 Hz.',
    montar: function (svg) {
      var S = {};
      var x0 = 62, y0 = 22, w = 400, h = 270, fmin = 0.3, pmax = 1.4;
      var X = function (f) { return x0 + (f - fmin) / (1 - fmin) * w; }, Y = function (p) { return y0 + h - p / pmax * h; };
      var fInest = 0.5;
      CTL.forEach(function (c) { if (c[3] < 0.6) fInest = Math.max(fInest, c[0]); });
      S.zona = grupo(svg);
      s('rect', { x: x0, y: y0, width: X(fInest) - x0, height: h, fill: K.zona }, S.zona);
      D.t(S.zona, x0 + 8, y0 + 16, 'con la compuerta, el ventilador', { tam: 11.5, color: K.tinta2 });
      D.t(S.zona, x0 + 8, y0 + 31, 'entra en su zona inestable', { tam: 11.5, color: K.tinta2 });
      S.piso = grupo(svg);
      s('rect', { x: X(25 / 60), y: y0 + 120, width: X(0.5) - X(25 / 60), height: h - 120, fill: K.alerta, opacity: 0.14 }, S.piso);
      D.t(S.piso, X(0.455), y0 + 174, 'piso del variador,', { tam: 11.5, color: K.alerta, ancla: 'middle' });
      D.t(S.piso, X(0.455), y0 + 189, '25 a 30 Hz', { tam: 11.5, color: K.alerta, ancla: 'middle' });
      for (var f = 0.3; f <= 1.0001; f += 0.1) { s('line', { x1: X(f), x2: X(f), y1: y0, y2: y0 + h, stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, X(f), y0 + h + 17, n(f * 100, 0), { tam: 11.5, ancla: 'middle', color: K.tinta2 }); }
      for (var p = 0; p <= pmax + 1e-9; p += 0.2) { s('line', { x1: x0, x2: x0 + w, y1: Y(p), y2: Y(p), stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, x0 - 6, Y(p) + 4, n(p, 1), { tam: 11.5, ancla: 'end', color: K.tinta2 }); }
      s('path', { d: 'M' + x0 + ' ' + y0 + 'V' + (y0 + h) + 'H' + (x0 + w), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      D.t(svg, x0 + w, y0 + h + 36, 'carga de la caldera: aire, en % del de plena carga', { tam: 12, peso: 600, ancla: 'end' });
      D.t(svg, x0 - 2, y0 - 8, 'potencia al eje (kW)', { tam: 12, peso: 600 });
      var inv = CTL.slice().reverse();
      S.comp = D.trazo(svg, dTrazo(inv.map(function (c) { return [X(c[0]), Y(c[1])]; })), { color: OL, ancho: 2.6 });
      S.vel = D.trazo(svg, dTrazo(inv.map(function (c) { return [X(c[0]), Y(c[2])]; })), { color: AZ, ancho: 2.6 });
      function pto(f, p, txt, dx, dy, anc) { var g = grupo(svg); D.punto(g, X(f), Y(p), { r: 5 }); D.t(g, X(f) + dx, Y(p) + dy, txt, { tam: 12, peso: 650, ancla: anc || 'start', halo: true }); return g; }
      S.p100 = pto(1, 1.2487, '1,25 kW', -8, -10, 'end');
      S.c70 = pto(0.7, 1.0803, '1,08 kW', 6, -10);
      S.c50 = pto(0.5, 0.9408, '0,94 kW', 8, -10);
      S.v70 = pto(0.7, 0.4283, '0,43 kW', 8, 16);
      S.v50 = pto(0.5, 0.1561, '0,16 kW', 8, -8);
      S.ley = grupo(svg);
      s('line', { x1: X(0.62), x2: X(0.62) + 24, y1: y0 + h - 32, y2: y0 + h - 32, stroke: OL, 'stroke-width': 2.6 }, S.ley);
      D.t(S.ley, X(0.62) + 30, y0 + h - 28, 'compuerta, a 2138 r/min', { tam: 12 });
      s('line', { x1: X(0.62), x2: X(0.62) + 24, y1: y0 + h - 14, y2: y0 + h - 14, stroke: AZ, 'stroke-width': 2.6 }, S.ley);
      D.t(S.ley, X(0.62) + 30, y0 + h - 10, 'velocidad variable', { tam: 12 });
      S.c = [];
      [['Plena carga', '2138 r/min, 1,25 kW'], ['Compuerta', '70 %: 1,08 kW', '50 %: 0,94 kW'], ['Variador', '70 %: 1497 r/min, 0,43 kW', '50 %: 1069 r/min, 0,16 kW'], ['Lo real, a la mitad', 'variador: unos 0,30 kW', 'compuerta: tres veces más']].forEach(function (fl, i) {
        var g = grupo(svg); S.c.push(g); lineas(g, 482, 34 + i * 66, fl, { titulo: true, tam: 12, salto: 16, colorT: i === 1 ? OL : i === 2 ? AZ : K.tinta });
      });
      return S;
    },
    pasos: [
      { texto: 'A plena carga, en Bogotá, el ventilador gira a 2138 r/min, mueve 0,589 m³/s y gasta 1,25 kW. La caldera baja su carga, y el aire tiene que seguir al gas: hay que quitarle aire al ventilador.', dur: 1.4, ir: function (S, t) { D.ver(S.p100, t); D.ver(S.c[0], t); D.ver(S.ley, t); } },
      { texto: 'Con la compuerta, la curva del sistema se empina y el ventilador se corre a la izquierda sobre su propia curva, con más presión. La potencia apenas baja: 1,08 kW con 70 % del aire y 0,94 kW con la mitad.', dur: 2, ir: function (S, t) { S.comp.dibujar(T(t, 0, 0.8)); D.ver(S.c70, T(t, 0.4, 0.7)); D.ver(S.c50, T(t, 0.7, 1)); D.ver(S.c[1], T(t, 0.5, 1)); } },
      { texto: 'Con el variador, el punto se mueve sobre la parábola de la caldera, y con las <a href="#eq-gas-afinidad">leyes de afinidad</a> el caudal va con la velocidad y la potencia con su cubo: a 70 %, $2138 \\times 0,7$ = 1497 r/min y $1,25 \\times 0,7^3$ = 0,43 kW; a la mitad, 1069 r/min y 0,16 kW.', dur: 2, ir: function (S, t) { S.vel.dibujar(T(t, 0, 0.8)); D.ver(S.v70, T(t, 0.4, 0.7)); D.ver(S.v50, T(t, 0.7, 1)); D.ver(S.c[2], T(t, 0.5, 1)); } },
      { texto: 'La compuerta tiene otro costo: por debajo de unos 55 % de carga lleva el ventilador a la izquierda del máximo de su curva, a la zona inestable, conectado a un hogar, que es el volumen compresible que necesita una oscilación.', dur: 1.6, ir: function (S, t) { D.ver(S.zona, t); } },
      { texto: 'El variador tampoco baja sin límite: un fabricante pone su frecuencia más baja entre 25 y 30 Hz, de 42 a 50 % de la carga si el motor da la velocidad plena a 60 Hz. A 40 % el ventilador giraría a 855 r/min, unos 24 Hz: ahí se deja una velocidad mínima y se termina de regular con la compuerta.', dur: 1.8, ir: function (S, t) { D.ver(S.piso, t); } },
      { texto: 'El cubo es ideal. Con las curvas genéricas del control de ventiladores, a la mitad del caudal el variador conserva unos 24 % de su potencia plena, no 13 %: unos 0,30 kW. La compuerta sigue gastando tres veces más.', dur: 1.6, ir: function (S, t) { D.ver(S.c[3], t); } }
    ]
  });

  /* Reto: las leyes de afinidad con la densidad, el aire de la combustión y la velocidad corregida. */

  /* ================= 12.3 El trabajo de comprimir un gas ================= */

  /* El aire de instrumentos en una etapa: la temperatura de descarga contra la relación, isentrópica y real, y el
     trabajo isotérmico, isentrópico y real, como en el ejemplo. */
  ZB.animacion('una-etapa', {
    vista: [0, 0, 640, 360],
    alt: 'A la izquierda, la temperatura de descarga de una etapa contra la relación de presiones, de 1 a 12, con el aire a 20 °C: la isentrópica y la real con 80 % de eficiencia, y la franja de 70 a 200 °C con que el aire sale de los compresores de planta. En Bogotá la relación es 10,5: 301 °C isentrópica y 371 °C real; a nivel del mar, 7,9 y 315 °C. A la derecha, la potencia: 3,55 kW isotérmica, 5,06 kW isentrópica y 6,33 kW real en Bogotá, y 5,32 kW real a nivel del mar.',
    montar: function (svg) {
      var S = {};
      var x0 = 62, y0 = 24, w = 300, h = 270, rmax = 12, tmax = 400;
      var X = function (r) { return x0 + (r - 1) / (rmax - 1) * w; }, Y = function (t) { return y0 + h - t / tmax * h; };
      var a = (KG - 1) / KG;
      var Ts = function (r) { return 293.15 * Math.pow(r, a) - 273.15; }, Tr = function (r) { return 20 + (Ts(r) - 20) / ETA_S; };
      S.banda = grupo(svg);
      s('rect', { x: x0, y: Y(200), width: w, height: Y(70) - Y(200), fill: K.zona }, S.banda);
      D.t(S.banda, X(5.2), Y(70) - 22, 'el aire de planta:', { tam: 11.5, color: K.tinta2 });
      D.t(S.banda, X(5.2), Y(70) - 8, '70 a 200 °C', { tam: 11.5, color: K.tinta2 });
      [1, 3, 5, 7, 9, 11].forEach(function (r) { s('line', { x1: X(r), x2: X(r), y1: y0, y2: y0 + h, stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, X(r), y0 + h + 17, String(r), { tam: 11.5, ancla: 'middle', color: K.tinta2 }); });
      [0, 100, 200, 300, 400].forEach(function (t) { s('line', { x1: x0, x2: x0 + w, y1: Y(t), y2: Y(t), stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, x0 - 6, Y(t) + 4, String(t), { tam: 11.5, ancla: 'end', color: K.tinta2 }); });
      s('path', { d: 'M' + x0 + ' ' + y0 + 'V' + (y0 + h) + 'H' + (x0 + w), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      D.t(svg, x0 + w, y0 + h + 36, 'relación de presiones, r', { tam: 12, peso: 600, ancla: 'end' });
      D.t(svg, x0 - 2, y0 - 10, 'temperatura de descarga (°C)', { tam: 12, peso: 600 });
      S.rB = grupo(svg);
      s('line', { x1: X(10.5), x2: X(10.5), y1: y0, y2: y0 + h, stroke: K.tinta2, 'stroke-width': 1, 'stroke-dasharray': '4 3' }, S.rB);
      D.t(S.rB, X(10.5) - 4, y0 + h - 8, 'Bogotá, 10,5', { tam: 11.5, ancla: 'end', color: K.tinta2 });
      S.cS = D.trazo(svg, dTrazo(curva(Ts, 1, rmax, 60, X, Y)), { color: AZ, ancho: 2, guion: '6 4' });
      S.cR = D.trazo(svg, dTrazo(curva(Tr, 1, rmax, 60, X, Y)), { color: AZ, ancho: 2.6 });
      S.tS = grupo(svg); D.t(S.tS, X(5) + 6, Y(Ts(5)) + 16, 'isentrópica', { tam: 11.5, color: AZ, halo: true });
      S.tR = grupo(svg); D.t(S.tR, X(6), Y(Tr(6)) - 10, 'real, η = 0,80', { tam: 11.5, ancla: 'end', color: AZ, halo: true });
      S.pS = grupo(svg); D.punto(S.pS, X(10.5), Y(Ts(10.5)), { r: 5 }); D.t(S.pS, X(10.5) - 8, Y(Ts(10.5)) + 18, '301 °C', { tam: 12, peso: 650, ancla: 'end', halo: true });
      S.pR = grupo(svg); D.punto(S.pR, X(10.5), Y(Tr(10.5)), { r: 5 }); D.t(S.pR, X(10.5) - 8, Y(Tr(10.5)) - 8, '371 °C', { tam: 12, peso: 650, ancla: 'end', halo: true });
      S.pM = grupo(svg);
      s('circle', { cx: X(7.9), cy: Y(Tr(7.9)), r: 5, fill: OL, stroke: K.tinta, 'stroke-width': 1.4 }, S.pM); D.t(S.pM, X(7.9) - 8, Y(Tr(7.9)) - 8, 'mar: 315 °C', { tam: 12, peso: 650, ancla: 'end', color: OL, halo: true });
      // la potencia, en barras
      var bx = 420, bw = 190, PM = 7;
      D.t(svg, bx, 40, 'potencia (kW), 0,0179 kg/s', { tam: 12, peso: 600 });
      S.bar = [];
      [['isotérmica', 3.551, AZ, 0.35], ['isentrópica', M_INST * 3.5 * 287.05 * 293.15 * (Math.pow(773.7 / 73.7, a) - 1) / 1000, AZ, 0.6], ['real, Bogotá', 6.33, AZ, 1], ['real, nivel del mar', 5.324, OL, 1]].forEach(function (b, i) {
        var y = 70 + i * 58, g = grupo(svg);
        D.t(g, bx, y, b[0], { tam: 12, color: K.tinta2 });
        var br = barra(g, bx, y + 8, bw, 18, b[2], { op: b[3] });
        var tv = D.t(g, bx + 4, y + 22, '', { tam: 12, peso: 700 });
        S.bar.push({ g: g, b: br, t: tv, v: b[1], w: bw * b[1] / PM, x: bx });
      });
      S.ponerBarra = function (i, f) { var B = S.bar[i]; D.ver(B.g, f > 0 ? 1 : 0); B.b.largo(f * B.v / PM); B.t.setAttribute('x', bx + B.w * f + 6); D.ponerTexto(B.t, n(B.v * f, 2)); };
      S.notas = grupo(svg); lineas(S.notas, bx, 312, ['64,6 kg/h; 73,8 m³/h en la sala', 'r = 773,7/73,7 = 10,5'], { tam: 12, salto: 17 });
      return S;
    },
    pasos: [
      { texto: 'El aire: 50 Nm³/h son $50 \\times 1,293$ = 64,6 kg/h, 0,0179 kg/s; en la sala, a 73,7 kPa y 20 °C, ocupan $64,6/0,876$ = 73,8 m³/h (<a href="#eq-gas-condiciones">ecuación de las condiciones</a>). Ese es el caudal de aire libre que se le pide al fabricante. Se entrega a 773,7 kPa absolutos: una relación de $773,7/73,7$ = 10,5.', dur: 1.8, ir: function (S, t) { D.ver(S.notas, t); D.ver(S.rB, T(t, 0.4, 1)); } },
      { texto: 'Sin intercambio de calor ni fricción, con la <a href="#eq-gas-isentropico">ecuación isentrópica</a>: $T_{2s} = 293,15 \\times 10,5^{0,286}$ = 574 K, 301 °C. La curva a trazos es la misma cuenta para cada relación.', dur: 1.8, ir: function (S, t) { S.cS.dibujar(T(t, 0, 0.8)); D.ver(S.tS, T(t, 0.5, 1)); D.ver(S.pS, T(t, 0.6, 1)); } },
      { texto: 'La fricción calienta el gas por encima de la isentrópica. Con la <a href="#eq-gas-descarga">temperatura de descarga real</a> y 80 % de eficiencia: $T_2 = 20 + (301 - 20)/0,80$ = 371 °C, muy por encima de los 70 a 200 °C con que el aire sale de los compresores de planta.', dur: 1.8, ir: function (S, t) { S.cR.dibujar(T(t, 0, 0.8)); D.ver(S.tR, T(t, 0.5, 1)); D.ver(S.pR, T(t, 0.6, 1)); D.ver(S.banda, T(t, 0.4, 1)); } },
      { texto: 'El trabajo real es el cambio de entalpía: $w = c_p\\,(T_2 - T_1) = 1005 \\times (371 - 20)$ = 353 kJ/kg, y por 0,0179 kg/s, 6,3 kW. El isentrópico es 80 % de eso, 5,06 kW, y el <a href="#eq-gas-isotermico">isotérmico</a>, $287 \\times 293,15 \\times \\ln 10,5$ = 198 kJ/kg, solo 3,55 kW: el piso.', dur: 2.2, ir: function (S, t) { S.ponerBarra(0, T(t, 0, 0.4)); S.ponerBarra(1, T(t, 0.3, 0.7)); S.ponerBarra(2, T(t, 0.6, 1)); } },
      { texto: 'A nivel del mar, para la misma presión manométrica, la relación es $801/101,3$ = 7,9: la etapa descargaría a 315 °C y pediría 5,32 kW. En Bogotá el compresor trabaja más, porque aspira a menor presión.', dur: 1.6, ir: function (S, t) { D.ver(S.pM, t); S.ponerBarra(3, T(t, 0.3, 1)); } }
    ]
  });

  /* Reto: la descarga isentrópica y real, el trabajo y la potencia, y la eficiencia politrópica. */

  /* ================= 12.4 Etapas e interenfriamiento ================= */

  /* El aire de instrumentos en una a cuatro etapas, como en la figura de las etapas: la potencia y la descarga más
     caliente, en Bogotá y a nivel del mar, con el trabajo isotérmico entre la eficiencia. */
  ZB.animacion('etapas', {
    vista: [0, 0, 640, 360],
    alt: 'Dos gráficas contra el número de etapas, de 1 a 4. Potencia: 6,33, 5,37, 5,09 y 4,96 kW en Bogotá, y 5,32, 4,62, 4,42 y 4,32 kW a nivel del mar, acercándose al trabajo isotérmico entre la eficiencia. Temperatura de descarga más alta: 371, 181, 125 y 99 °C en Bogotá, y 315, 160, 112 y 90 °C a nivel del mar. Con dos etapas, la relación de cada una es 3,24 y la intermedia queda a 239 kPa.',
    montar: function (svg) {
      var S = {};
      var B = [1, 2, 3, 4].map(function (k) { return compresion(k, P_BOG, P_BOG + 700); }), M = [1, 2, 3, 4].map(function (k) { return compresion(k, P_MAR, P_MAR + 700); });
      S.B = B; S.M = M;
      var iso = function (p1) { return M_INST * 287 * 293.15 * Math.log((p1 + 700) / p1) / 1000; };
      function panel(x0, titulo, vmax, paso, clave, fmt) {
        var y0 = 34, w = 236, h = 240;
        var X = function (k) { return x0 + (k - 0.6) / 3.8 * w; }, Y = function (v) { return y0 + h - v / vmax * h; };
        for (var v = 0; v <= vmax + 1e-9; v += paso) { s('line', { x1: x0, x2: x0 + w, y1: Y(v), y2: Y(v), stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, x0 - 6, Y(v) + 4, fmt(v), { tam: 11.5, ancla: 'end', color: K.tinta2 }); }
        for (var k = 1; k <= 4; k++) D.t(svg, X(k), y0 + h + 17, String(k), { tam: 11.5, ancla: 'middle', color: K.tinta2 });
        s('path', { d: 'M' + x0 + ' ' + y0 + 'V' + (y0 + h) + 'H' + (x0 + w), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
        D.t(svg, x0 + w / 2, y0 + h + 36, 'etapas', { tam: 12, peso: 600, ancla: 'middle' });
        D.t(svg, x0 - 2, y0 - 14, titulo, { tam: 12, peso: 600 });
        return { X: X, Y: Y, w: w, x0: x0 };
      }
      var PW = panel(58, 'potencia al eje (kW)', 8, 2, 'W', function (v) { return n(v, 0); });
      var PT = panel(384, 'descarga más caliente (°C)', 400, 100, 'T', function (v) { return n(v, 0); });
      S.iso = grupo(svg);
      [iso(P_BOG), iso(P_MAR)].forEach(function (v) { s('line', { x1: PW.x0, x2: PW.x0 + PW.w, y1: PW.Y(v / ETA_S), y2: PW.Y(v / ETA_S), stroke: K.tinta2, 'stroke-width': 1, 'stroke-dasharray': '4 3' }, S.iso); });
      D.t(S.iso, PW.x0 + 6, PW.Y(iso(P_MAR) / ETA_S) + 18, 'isotérmico ÷ 0,8, los dos sitios', { tam: 11.5, color: K.tinta2, halo: true });
      // un punto por etapa y sitio, y el trazo que los une
      function serie(datos, color, campo, P) {
        var g = { pts: [], lin: [] };
        datos.forEach(function (d, i) {
          var v = campo === 'W' ? d.W : d.Tmax;
          var pt = grupo(svg); s('circle', { cx: P.X(i + 1), cy: P.Y(v), r: 5, fill: color === AZ ? K.caso : color, stroke: K.tinta, 'stroke-width': 1.4 }, pt);
          g.pts.push(pt);
          if (i) g.lin.push(D.trazo(svg, dTrazo([[P.X(i), P.Y(campo === 'W' ? datos[i - 1].W : datos[i - 1].Tmax)], [P.X(i + 1), P.Y(v)]]), { color: color, ancho: 2.4 }));
        });
        return g;
      }
      S.bW = serie(B, AZ, 'W', PW); S.bT = serie(B, AZ, 'T', PT); S.mW = serie(M, OL, 'W', PW); S.mT = serie(M, OL, 'T', PT);
      S.lab = [];
      [[0, '6,33 kW', '371 °C'], [1, '5,37 kW', '181 °C'], [2, '5,09 kW', '125 °C'], [3, '4,96 kW', '99 °C']].forEach(function (l) {
        var g = grupo(svg), i = l[0];
        D.t(g, PW.X(i + 1) + 8, PW.Y(B[i].W) - 9, l[1], { tam: 12, peso: 650, halo: true });
        D.t(g, PT.X(i + 1) + 8, PT.Y(B[i].Tmax) - 9, l[2], { tam: 12, peso: 650, halo: true });
        S.lab.push(g);
      });
      S.ley = grupo(svg);
      s('line', { x1: 140, x2: 164, y1: 342, y2: 342, stroke: AZ, 'stroke-width': 2.4 }, S.ley); D.t(S.ley, 170, 346, 'Bogotá, 73,7 kPa', { tam: 12 });
      s('line', { x1: 340, x2: 364, y1: 342, y2: 342, stroke: OL, 'stroke-width': 2.4 }, S.ley); D.t(S.ley, 370, 346, 'nivel del mar', { tam: 12 });
      return S;
    },
    pasos: [
      { texto: 'En una etapa, la relación es 10,5: el aire sale a 371 °C y el compresor pide 6,33 kW (ejemplo del aire de instrumentos en una etapa).', dur: 1.4, ir: function (S, t) { D.ver(S.bW.pts[0], t); D.ver(S.bT.pts[0], t); D.ver(S.lab[0], T(t, 0.4, 1)); D.ver(S.ley, t); } },
      { texto: 'En dos etapas, con la <a href="#eq-gas-etapas">relación por etapa</a>, $r = 10,5^{1/2}$ = 3,24, y la intermedia queda a $73,7 \\times 3,24$ = 239 kPa. La primera descarga a 166 °C; la segunda toma el aire a 30 °C y lo entrega a 181 °C. Las dos piden $2,64 + 2,73$ = 5,37 kW, 15 % menos.', dur: 2.2, ir: function (S, t) { S.bW.lin[0].dibujar(T(t, 0, 0.5)); S.bT.lin[0].dibujar(T(t, 0, 0.5)); D.ver(S.bW.pts[1], T(t, 0.4, 0.6)); D.ver(S.bT.pts[1], T(t, 0.4, 0.6)); D.ver(S.lab[1], T(t, 0.6, 1)); } },
      { texto: 'En tres etapas, $r = 10,5^{1/3}$ = 2,19: las descargas bajan a 112 y 125 °C y la potencia a 5,09 kW. En cuatro, $r$ = 1,80: 99 °C y 4,96 kW. La temperatura cae mucho más que la potencia.', dur: 2.2, ir: function (S, t) { S.bW.lin[1].dibujar(T(t, 0, 0.4)); S.bT.lin[1].dibujar(T(t, 0, 0.4)); D.ver(S.bW.pts[2], T(t, 0.3, 0.5)); D.ver(S.bT.pts[2], T(t, 0.3, 0.5)); D.ver(S.lab[2], T(t, 0.4, 0.6)); S.bW.lin[2].dibujar(T(t, 0.5, 0.9)); S.bT.lin[2].dibujar(T(t, 0.5, 0.9)); D.ver(S.bW.pts[3], T(t, 0.8, 1)); D.ver(S.bT.pts[3], T(t, 0.8, 1)); D.ver(S.lab[3], T(t, 0.85, 1)); } },
      { texto: 'Con muchas etapas, enfriando entre ellas, el trabajo se acerca al <a href="#eq-gas-isotermico">isotérmico</a>, 3,55 kW, dividido por la eficiencia de 0,8: 4,44 kW. Cada etapa más ahorra menos, a cambio de un cilindro y un enfriador.', dur: 1.6, ir: function (S, t) { D.ver(S.iso, t); } },
      { texto: 'A nivel del mar la relación total es 7,9, y todo baja: 5,32 kW y 315 °C en una etapa, 4,62 kW y 160 °C en dos. El compresor de Bogotá trabaja más en cualquier número de etapas.', dur: 1.8, ir: function (S, t) { [0, 1, 2, 3].forEach(function (i) { D.ver(S.mW.pts[i], T(t, 0.1 * i, 0.1 * i + 0.4)); D.ver(S.mT.pts[i], T(t, 0.1 * i, 0.1 * i + 0.4)); }); [0, 1, 2].forEach(function (i) { S.mW.lin[i].dibujar(T(t, 0.1 + 0.2 * i, 0.4 + 0.2 * i)); S.mT.lin[i].dibujar(T(t, 0.1 + 0.2 * i, 0.4 + 0.2 * i)); }); } }
    ]
  });

  /* Reto: la relación por etapa, las descargas con el interenfriador y el agua de los enfriadores. */

  /* ================= 12.5 Las máquinas ================= */

  /* El ciclo de un cilindro con espacio muerto, con el modelo de herramientas/figura-ciclo.py (copiado sin cambios en
     su parte numérica): el diagrama presión-volumen con las mismas coordenadas que la figura del ciclo, y a la derecha,
     donde la figura tiene su clave, el cilindro con su pistón y sus dos válvulas. Al final el cilindro se va y queda la
     figura. */
  var CI = { P1: 73.7, P2: 773.7, C: 6.0, NP: 1.35 };
  CI.V1 = 100 + CI.C;
  CI.P2B = CI.P1 * Math.pow(CI.P2 / CI.P1, 0.5);
  function ciV2(p2) { return CI.V1 * Math.pow(CI.P1 / p2, 1 / CI.NP); }
  function ciV4(p2) { return CI.C * Math.pow(p2 / CI.P1, 1 / CI.NP); }
  function ciEta(p2) { return 1 - CI.C / 100 * (Math.pow(p2 / CI.P1, 1 / CI.NP) - 1); }
  ZB.animacion('ciclo', {
    vista: [0, 0, 680, 396],
    alt: 'El cilindro del compresor del aire de instrumentos y su diagrama de presión contra volumen, en porcentaje del barrido, con el espacio muerto de 6 % a la izquierda. El pistón comprime el aire de 73,7 a 773,7 kPa con las válvulas cerradas, hasta 18,6 % del barrido; lo descarga a presión constante hasta 6 %; el aire del espacio muerto se reexpande hasta 34,2 %; y la succión llena el cilindro de 34,2 a 106 %: aspira 72 % del barrido. Al final, la primera de dos etapas, hasta 239 kPa, se reexpande solo hasta 14,3 % y aspira 92 %, como en la figura del ciclo.',
    montar: function (svg) {
      var S = {};
      var X0 = 70, X1 = 440, Y0 = 22, Y1 = 300, VMAX = 110, PMAX = 800, YC1 = Y1 + 38, YC2 = Y1 + 58;
      var X = function (v) { return X0 + v / VMAX * (X1 - X0); }, Y = function (p) { return Y1 - p / PMAX * (Y1 - Y0); };
      S.X = X; S.Y = Y;
      for (var v = 0; v <= 110; v += 20) { s('line', { x1: X(v), x2: X(v), y1: Y0, y2: Y1, stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, X(v), Y1 + 18, String(v), { tam: 12.5, ancla: 'middle', color: K.tinta2 }); }
      for (var p = 0; p <= 800; p += 200) { s('line', { x1: X0, x2: X1, y1: Y(p), y2: Y(p), stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, X0 - 8, Y(p) + 4.5, String(p), { tam: 12.5, ancla: 'end', color: K.tinta2 }); }
      s('rect', { x: X(0), y: Y0, width: X(CI.C) - X(0), height: Y1 - Y0, fill: MUERTO }, svg);
      var tx = X(CI.C / 2) + 4.5, ty = Y(470), tm = s('text', { x: tx, y: ty, 'font-size': 12, 'font-weight': 500, 'text-anchor': 'middle', fill: K.tinta2, transform: 'rotate(-90 ' + tx + ' ' + ty + ')' }, svg);
      D.ponerTexto(tm, 'espacio muerto');
      s('path', { d: 'M' + X0 + ' ' + Y0 + 'V' + Y1 + 'H' + X1, fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      D.t(svg, (X0 + X1) / 2, Y1 + 84, 'volumen del cilindro (% del barrido)', { tam: 12.5, peso: 600, ancla: 'middle' });
      rotado(svg, 22, (Y0 + Y1) / 2, 'presión absoluta (kPa)', { tam: 12.5 });
      // la primera de dos etapas, en oliva (paso 6)
      var v2b = ciV2(CI.P2B), v4b = ciV4(CI.P2B), v2 = ciV2(CI.P2), v4 = ciV4(CI.P2), k, pts;
      var pol = function (pa, va, vb, nn) { var o = []; for (k = 0; k <= nn; k++) { var vv = va + (vb - va) * k / nn; o.push([vv, pa * Math.pow(va / vv, CI.NP)]); } return o; };
      pts = pol(CI.P1, CI.V1, v2b, 40).concat([[CI.C, CI.P2B]]).concat(pol(CI.P2B, CI.C, v4b, 40)).concat([[CI.V1, CI.P1]]);
      S.dos = D.trazo(svg, dTrazo(pts.map(function (q) { return [X(q[0]), Y(q[1])]; })), { color: K.oliva, ancho: 2.4 });
      // el relleno del ciclo de una etapa (paso 5)
      pts = pol(CI.P1, CI.V1, v2, 40).concat([[CI.C, CI.P2]]).concat(pol(CI.P2, CI.C, v4, 40));
      S.relleno = s('path', { d: dTrazo(pts.map(function (q) { return [X(q[0]), Y(q[1])]; })) + 'Z', fill: K.tinta, 'fill-opacity': 0.10, stroke: 'none', opacity: 0 }, svg);
      S.CI = { v2: v2, v4: v4, v2b: v2b, v4b: v4b, pol: pol };
      S.traza = s('path', { d: '', fill: 'none', stroke: K.tinta, 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, svg);
      S.punto = s('circle', { cx: X(CI.V1), cy: Y(CI.P1), r: 6, fill: K.caso, stroke: K.tinta, 'stroke-width': 1.6 }, svg);
      // las puntas y los números de los tramos, como en la figura
      function punta(vv, pp, dv, dp) {
        var x = X(vv), y = Y(pp), ux = X(vv + dv) - x, uy = Y(pp + dp) - y, L = Math.hypot(ux, uy); ux /= L; uy /= L;
        var a = 10, b = 4.6;
        return s('polygon', { points: [[x + ux * a / 2, y + uy * a / 2], [x - ux * a / 2 - uy * b, y - uy * a / 2 + ux * b], [x - ux * a / 2 + uy * b, y - uy * a / 2 - ux * b]].map(function (q) { return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' '), fill: K.tinta }, svg);
      }
      function numero(padre, x, y, kk) { var g = s('g', {}, padre); s('circle', { cx: x, cy: y, r: 9, fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.4 }, g); D.t(g, x, y + 4.2, String(kk), { tam: 12, peso: 700, ancla: 'middle' }); return g; }
      var vm = 40, pm = CI.P1 * Math.pow(CI.V1 / vm, CI.NP), vr = 12, pr = CI.P2 * Math.pow(CI.C / vr, CI.NP);
      S.tramos = [grupo(svg), grupo(svg), grupo(svg), grupo(svg)];
      S.tramos[0].appendChild(punta(vm, pm, -1, CI.P1 * Math.pow(CI.V1 / (vm - 1), CI.NP) - pm)); numero(S.tramos[0], X(vm) + 18, Y(pm) - 16, 1);
      S.tramos[1].appendChild(punta((CI.C + v2) / 2, CI.P2, -1, 0)); numero(S.tramos[1], X((CI.C + v2) / 2), Y(CI.P2) + 20, 2);
      S.tramos[2].appendChild(punta(vr, pr, 1, CI.P2 * Math.pow(CI.C / (vr + 1), CI.NP) - pr)); numero(S.tramos[2], X(vr) + 20, Y(pr) - 6, 3);
      S.tramos[3].appendChild(punta((v4 + CI.V1) / 2 + 12, CI.P1, 1, 0)); numero(S.tramos[3], X(70), Y(CI.P1) + 13, 4);
      // lo que aspira cada uno, bajo el eje
      function cota(padre, va, y, color, txt) {
        var g = s('g', {}, padre);
        s('path', { d: 'M' + X(va).toFixed(1) + ' ' + (Y(CI.P1) + 4).toFixed(1) + 'V' + (y + 6), stroke: color, 'stroke-width': 1, 'stroke-dasharray': '3 3' }, g);
        s('path', { d: 'M' + (X(va) + 2).toFixed(1) + ' ' + y + 'H' + (X(CI.V1) - 2).toFixed(1), stroke: color, 'stroke-width': 1.6 }, g);
        s('path', { d: 'M' + X(va).toFixed(1) + ' ' + y + 'l8 -3.6v7.2zM' + X(CI.V1).toFixed(1) + ' ' + y + 'l-8 -3.6v7.2z', fill: color }, g);
        D.t(g, X(CI.V1) + 8, y + 4.5, txt, { tam: 12.5, peso: 700, color: color });
        return g;
      }
      S.guiaV1 = s('path', { d: 'M' + X(CI.V1).toFixed(1) + ' ' + (Y(CI.P1) + 4).toFixed(1) + 'V' + (YC2 + 6), stroke: K.tinta2, 'stroke-width': 1, 'stroke-dasharray': '3 3', opacity: 0 }, svg);
      S.cota1 = grupo(svg); cota(S.cota1, v4, YC1, K.tinta, n(ciEta(CI.P2) * 100, 0) + ' %');
      S.cota2 = grupo(svg); cota(S.cota2, v4b, YC2, K.oliva, n(ciEta(CI.P2B) * 100, 0) + ' %');
      // la clave de la figura (paso 6)
      S.clave = grupo(svg);
      var xl = 486, yl = 40, c = S.clave;
      s('path', { d: 'M' + xl + ' ' + (yl - 4) + 'h24', stroke: K.tinta, 'stroke-width': 2.6 }, c);
      D.t(c, xl + 32, yl, 'Una etapa,', { tam: 13, peso: 700 }); D.t(c, xl + 32, yl + 18, '73,7 a 774 kPa:', { tam: 12.5, color: K.tinta2 }); D.t(c, xl + 32, yl + 36, 'aspira ' + n(ciEta(CI.P2) * 100, 0) + ' % del barrido', { tam: 12.5, color: K.tinta2 });
      yl += 66;
      s('path', { d: 'M' + xl + ' ' + (yl - 4) + 'h24', stroke: K.oliva, 'stroke-width': 2.4 }, c);
      D.t(c, xl + 32, yl, 'Primera de dos,', { tam: 13, peso: 700, color: K.oliva }); D.t(c, xl + 32, yl + 18, '73,7 a ' + n(CI.P2B, 0) + ' kPa:', { tam: 12.5, color: K.tinta2 }); D.t(c, xl + 32, yl + 36, 'aspira ' + n(ciEta(CI.P2B) * 100, 0) + ' %', { tam: 12.5, color: K.tinta2 });
      yl += 70;
      ['compresión', 'descarga', 'reexpansión del gas', 'succión'].forEach(function (nom, i) {
        numero(c, xl + 10, yl - 4.2, i + 1); D.t(c, xl + 32, yl, nom, { tam: 12.5, color: K.tinta2 });
        if (i === 2) { yl += 18; D.t(c, xl + 32, yl, 'del espacio muerto', { tam: 12.5, color: K.tinta2 }); }
        yl += 28;
      });
      // el cilindro, donde va la clave: culata a la izquierda, válvula de succión arriba y de descarga abajo
      S.cil = grupo(svg, 1);
      var g = S.cil, XC0 = 500, XC1 = 640, YC = 150, RC = 30, XP0 = XC0 + 6, XP1 = XC0 + 22;
      S.xPiston = function (vv) { return XC0 + vv / CI.V1 * (XC1 - XC0); };
      S.gas = s('rect', { x: XC0, y: YC - RC + 2, width: 10, height: 2 * RC - 4, fill: K.vapor }, g);
      camino(g, [[XP0, YC - RC], [XC0, YC - RC], [XC0, YC + RC], [XP0, YC + RC]], { ancho: 3 });
      camino(g, [[XP1, YC - RC], [XC1 + 30, YC - RC]], { ancho: 3 }); camino(g, [[XP1, YC + RC], [XC1 + 30, YC + RC]], { ancho: 3 });
      camino(g, [[XP0, YC - RC], [XP0, YC - RC - 24]], { ancho: 2 }); camino(g, [[XP1, YC - RC], [XP1, YC - RC - 24]], { ancho: 2 });
      camino(g, [[XP0, YC + RC], [XP0, YC + RC + 24]], { ancho: 2 }); camino(g, [[XP1, YC + RC], [XP1, YC + RC + 24]], { ancho: 2 });
      S.valS = s('line', { x1: XP0, y1: YC - RC, x2: XP1, y2: YC - RC, stroke: K.oliva, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
      S.valD = s('line', { x1: XP0, y1: YC + RC, x2: XP1, y2: YC + RC, stroke: K.oliva, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
      S.piston = s('rect', { x: XC1 - 10, y: YC - RC + 2, width: 10, height: 2 * RC - 4, fill: K.metalM, stroke: K.tinta, 'stroke-width': 1.6 }, g);
      S.vastago = s('line', { x1: XC1, y1: YC, x2: XC1 + 30, y2: YC, stroke: K.tinta, 'stroke-width': 4 }, g);
      D.t(g, XP0 + 8, YC - RC - 30, 'succión', { tam: 12, ancla: 'middle', color: K.tinta2 });
      D.t(g, XP0 + 8, YC + RC + 42, 'descarga', { tam: 12, ancla: 'middle', color: K.tinta2 });
      S.lect = D.t(g, (XC0 + XC1) / 2 + 10, YC - RC - 12, '', { tam: 13, peso: 700, ancla: 'middle' });
      S.lectV = D.t(g, (XC0 + XC1) / 2 + 16, YC + RC + 20, '', { tam: 12, peso: 600, ancla: 'middle', color: K.tinta });
      S.YC = YC; S.RC = RC; S.XC0 = XC0; S.XP0 = XP0; S.XP1 = XP1;
      // el estado del ciclo en (fase, t): fase 0 cilindro, 1 compresión, 2 descarga, 3 reexpansión, 4 succión
      S.estado = function (fase, t) {
        var C = S.CI, vv, pp, abreS = false, abreD = false;
        var tray = [];
        var comp = C.pol(CI.P1, CI.V1, C.v2, 40), reex = C.pol(CI.P2, CI.C, C.v4, 40);
        if (fase <= 0) { vv = CI.V1; pp = CI.P1; }
        else if (fase === 1) { vv = CI.V1 + (C.v2 - CI.V1) * t; pp = CI.P1 * Math.pow(CI.V1 / vv, CI.NP); tray = C.pol(CI.P1, CI.V1, vv, 40); }
        else if (fase === 2) { vv = C.v2 + (CI.C - C.v2) * t; pp = CI.P2; tray = comp.concat([[vv, CI.P2]]); abreD = t < 1; }
        else if (fase === 3) { vv = CI.C + (C.v4 - CI.C) * t; pp = CI.P2 * Math.pow(CI.C / vv, CI.NP); tray = comp.concat([[CI.C, CI.P2]]).concat(C.pol(CI.P2, CI.C, vv, 40)); }
        else { vv = C.v4 + (CI.V1 - C.v4) * t; pp = CI.P1; tray = comp.concat([[CI.C, CI.P2]]).concat(reex).concat([[vv, CI.P1]]); abreS = t < 1; }
        S.traza.setAttribute('d', tray.length ? dTrazo(tray.map(function (q) { return [X(q[0]), Y(q[1])]; })) : '');
        S.punto.setAttribute('cx', X(vv)); S.punto.setAttribute('cy', Y(pp));
        var xp = S.xPiston(vv);
        S.piston.setAttribute('x', xp); S.vastago.setAttribute('x1', xp + 10);
        S.gas.setAttribute('width', Math.max(0, xp - S.XC0));
        var f = Math.max(0, Math.min(1, (pp - CI.P1) / (CI.P2 - CI.P1)));
        S.gas.setAttribute('fill-opacity', 0.35 + 0.65 * f);
        S.valS.setAttribute('x2', abreS ? S.XP0 + 10 : S.XP1); S.valS.setAttribute('y2', abreS ? S.YC - S.RC + 12 : S.YC - S.RC);
        S.valD.setAttribute('x2', abreD ? S.XP0 + 10 : S.XP1); S.valD.setAttribute('y2', abreD ? S.YC + S.RC + 12 : S.YC + S.RC);
        D.ponerTexto(S.lect, n(pp, pp < 100 ? 1 : 0) + ' kPa');
        D.ponerTexto(S.lectV, 'V = ' + n(vv, 1) + ' %');
      };
      S.estado(0, 0);
      return S;
    },
    pasos: [
      { texto: 'El cilindro del aire de instrumentos, lleno de aire de la sala de Bogotá a 73,7 kPa, con el pistón al fondo: 106 % del barrido, porque el pistón no llega a la culata y deja un espacio muerto de $f_c$ = 6 % del barrido. Las dos válvulas están cerradas.', dur: 1.4, ir: function (S, t) { S.estado(0, 0); D.ver(S.cil, 1); } },
      { texto: 'Compresión: con las dos válvulas cerradas, el pistón avanza y el aire sigue la politrópica, $pV^n$ constante con $n$ = 1,35. La válvula de descarga abre cuando el aire llega a la presión de la línea, 773,7 kPa, una relación de $773,7/73,7$ = 10,5: en $V = 106 \\times (73,7/773,7)^{1/1,35}$ = 18,6 % del barrido.', dur: 3, ir: function (S, t) { S.estado(1, t); D.ver(S.tramos[0], T(t, 0.6, 1)); } },
      { texto: 'Descarga: con la válvula de descarga abierta, el pistón empuja el aire a la línea a presión constante, 773,7 kPa, hasta el final de su carrera, en 6 % del barrido. El aire del espacio muerto se queda adentro, comprimido.', dur: 2.4, ir: function (S, t) { S.estado(2, t); D.ver(S.tramos[1], T(t, 0.6, 1)); } },
      { texto: 'Reexpansión: el pistón regresa, y el aire del espacio muerto se expande por la misma politrópica, de 6 % a $6 \\times 10,5^{1/1,35}$ = 34,2 % del barrido, antes de que su presión baje a la de succión. Mientras tanto no entra aire nuevo.', dur: 2.6, ir: function (S, t) { S.estado(3, t); D.ver(S.tramos[2], T(t, 0.6, 1)); } },
      { texto: 'Succión: abre la válvula de succión y entra aire nuevo, pero solo de 34,2 a 106 %. Con la <a href="#eq-gas-volumetrica">eficiencia volumétrica</a>, $\\eta_v = 1 - 0,06\\,(10,5^{1/1,35} - 1)$ = 0,72: casi un tercio del cilindro trabaja en vano. El área encerrada es el trabajo del ciclo.', dur: 2.6, ir: function (S, t) { S.estado(4, t); D.ver(S.tramos[3], T(t, 0.5, 0.8)); S.relleno.setAttribute('opacity', T(t, 0.7, 1)); D.ver(S.cota1, T(t, 0.8, 1)); S.guiaV1.setAttribute('opacity', T(t, 0.8, 1)); } },
      { texto: 'En dos etapas, la primera llega solo a $73,7 \\times 3,24$ = 239 kPa, una relación de 3,24 (<a href="#eq-gas-etapas">relación por etapa</a>): el espacio muerto se reexpande solo hasta 14,3 % y aspira $\\eta_v = 1 - 0,06\\,(3,24^{1/1,35} - 1)$ = 0,92 del barrido. Entre etapas, el aire se enfría.', dur: 2.6, ir: function (S, t) { S.estado(4, 1); S.dos.dibujar(T(t, 0, 0.7)); D.ver(S.cota2, T(t, 0.6, 0.9)); D.ver(S.cil, 1 - T(t, 0, 0.4)); D.ver(S.clave, T(t, 0.4, 0.9)); S.punto.setAttribute('opacity', 1 - T(t, 0, 0.3)); } }
    ]
  });

  /* Reto: la eficiencia volumétrica, el vacío más alto de un pistón y el caudal de un cilindro. */

  /* ================= 12.6 El sistema de aire comprimido ================= */

  /* El aire de instrumentos recorre el típico de la figura del sistema, equipo por equipo y en su orden: filtro de
     succión, compresor y motor, posenfriador con agua, separador con su purga, tanque pulmón con PSV-401, PI-402,
     PT-403 (que manda el motor) y su purga, secador, los dos filtros con PDI-404 y PDI-405, y la red. */
  ZB.animacion('aire', {
    vista: [0, 0, 640, 380],
    alt: 'El típico del aire comprimido: filtro de succión, compresor con su motor, posenfriador con agua, separador con purga, tanque pulmón con su válvula de seguridad PSV-401, su manómetro PI-402, el transmisor PT-403 que arranca y para el motor y su purga, secador, dos filtros con sus indicadores PDI-404 y PDI-405, y la red de aire de instrumentos. Paso a paso, debajo de cada equipo, lo que le hace al aire: el compresor lo entrega a 773,7 kPa y caliente; el posenfriador lo deja a 30 °C y el separador le quita de 80 a 90 % del agua; el tanque de 234 L lo guarda; el secador de adsorción lo deja con −40 °C de punto de rocío; los filtros le quitan las partículas y el aceite; y la red de 150 m pierde 0,17 bar con tubo de 1 in y 0,04 con 1¼ in.',
    montar: function (svg) {
      var S = {}, Y = 130;
      // la línea del proceso
      D.flecha(svg, 6, Y, 26, Y, { color: K.tinta, ancho: 1.8, punta: 7 });
      filtroSim(svg, 36, Y); camino(svg, [[44, Y], [66, Y]], { ancho: 1.8 });
      compresorSim(svg, 88, Y, 22); camino(svg, [[88, Y + 22], [88, Y + 40]], { ancho: 1.6 }); motorSim(svg, 88, Y + 54, 13);
      camino(svg, [[110, Y], [140, Y]], { ancho: 1.8 });
      intercambiador(svg, 156, Y, 16); D.flecha(svg, 150, Y + 40, 150, Y + 18, { color: K.tinta2, ancho: 1.3, punta: 6 }); D.flecha(svg, 162, Y + 18, 162, Y + 40, { color: K.tinta2, ancho: 1.3, punta: 6 });
      D.t(svg, 168, Y + 44, 'agua', { tam: 11.5, color: K.tinta2 });
      camino(svg, [[172, Y], [196, Y]], { ancho: 1.8 });
      recipiente(svg, 212, Y + 8, 28, 54); camino(svg, [[212, Y + 36], [212, Y + 50]], { ancho: 1.3 }); D.flecha(svg, 212, Y + 50, 212, Y + 66, { color: K.tinta2, ancho: 1.3, punta: 6 });
      camino(svg, [[212, Y - 20], [212, Y - 30], [246, Y - 30], [246, Y], [266, Y]], { ancho: 1.8 });
      recipiente(svg, 290, Y, 40, 90); camino(svg, [[290, Y - 46], [290, Y - 58]], { ancho: 1.6 });
      s('path', { d: 'M283 ' + (Y - 58) + 'L297 ' + (Y - 58) + 'L290 ' + (Y - 70) + 'Z', fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.5 }, svg);
      camino(svg, [[290, Y + 46], [290, Y + 56]], { ancho: 1.3 }); D.flecha(svg, 290, Y + 56, 290, Y + 72, { color: K.tinta2, ancho: 1.3, punta: 6 });
      burbuja(svg, 336, Y - 34, 'PI', '402'); camino(svg, [[310, Y - 26], [321, Y - 30]], { ancho: 1 });
      burbuja(svg, 336, Y + 40, 'PT', '403'); camino(svg, [[310, Y + 40], [321, Y + 40]], { ancho: 1 });
      camino(svg, [[336, Y + 55], [336, Y + 96], [88, Y + 96], [88, Y + 67]], { ancho: 1.1, guion: '4 3' });
      camino(svg, [[310, Y - 14], [350, Y - 14], [350, Y], [362, Y]], { ancho: 1.8 });
      s('rect', { x: 362, y: Y - 17, width: 34, height: 34, rx: 3, fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.8 }, svg);
      camino(svg, [[396, Y], [414, Y]], { ancho: 1.8 }); filtroSim(svg, 422, Y); camino(svg, [[430, Y], [452, Y]], { ancho: 1.8 }); filtroSim(svg, 460, Y);
      D.flecha(svg, 468, Y, 520, Y, { color: K.tinta, ancho: 1.8, punta: 8 });
      burbuja(svg, 422, Y - 50, 'PDI', '404'); camino(svg, [[422, Y - 35], [422, Y - 11]], { ancho: 1 });
      burbuja(svg, 460, Y - 50, 'PDI', '405'); camino(svg, [[460, Y - 35], [460, Y - 11]], { ancho: 1 });
      D.t(svg, 526, Y + 4, 'a la red, IA', { tam: 12, color: K.tinta2 });
      // los nombres, arriba
      [[36, 'Filtro', Y - 20], [80, 'Compresor', Y - 30], [160, 'Posenfriador', Y - 26], [208, 'Separador', Y - 40], [290, 'Tanque pulmón', Y - 80], [386, 'Secador', Y - 26], [441, 'Filtros', Y - 76]].forEach(function (e) {
        D.t(svg, e[0], e[2], e[1], { tam: 12, peso: 650, ancla: 'middle' });
      });
      D.t(svg, 304, Y - 62, 'PSV-401', { tam: 11.5, color: K.tinta2 });
      // los marcos de cada paso y lo que hace cada equipo, abajo
      S.m = [marco(svg, 14, Y - 46, 104, 130), marco(svg, 115, Y - 56, 129, 140), marco(svg, 240, Y - 100, 114, 196), marco(svg, 354, Y - 42, 58, 66), marco(svg, 404, Y - 92, 74, 112), marco(svg, 474, Y - 18, 160, 34)];
      S.notas = [];
      var NOT = [
        ['Compresor', '64,6 kg/h a 773,7 kPa abs.', 'dos etapas: sale a 181 °C', 'pistón sin lubricar: sin aceite'],
        ['Posenfriador y separador', 'deja el aire a 30 °C, unos', '10 °C sobre su agua; quita 2,73 kW', 'el separador atrapa 80 a 90 %', 'del agua; cada uno con su purga'],
        ['Tanque pulmón', 'V = 234 L (20,5 L/s, banda', 'de 0,5 bar); PSV-401 lo protege', 'y PT-403 arranca y para', 'el compresor; se purga a diario'],
        ['Secador de adsorción', 'punto de rocío a presión', 'de −40 °C: clase 2 de agua'],
        ['Filtros', 'coalescente y de partículas,', 'con su caída en PDI-404 y', 'PDI-405: clase 1.2.1'],
        ['La red, 150 m', '1 in: 0,17 bar; 1¼ in: 0,04 bar', 'hasta 0,1 bar; cada bar más', 'pide unos 8 % de potencia']
      ];
      NOT.forEach(function (f, i) { var g = grupo(svg); S.notas.push(g); lineas(g, 14 + (i % 3) * 210, 262 + Math.floor(i / 3) * 0 + (i < 3 ? 0 : 0), f, { titulo: true, tam: 11.5, salto: 15, colorT: AZ }); });
      return S;
    },
    pasos: [
      { texto: 'El compresor aspira por su filtro el aire de la sala, 64,6 kg/h, que ocupan 73,8 m³/h a 73,7 kPa, y lo entrega a 773,7 kPa absolutos. En dos etapas, la última descarga a 181 °C (ejemplo del aire en dos etapas). Es un pistón sin lubricar: el aire sale caliente y saturado de agua, pero sin aceite.', dur: 1.8, ir: function (S, t) { resaltar(S.m[0], t); D.ver(S.notas[0], t); } },
      { texto: 'El posenfriador va justo después del compresor y deja el aire a 30 °C, unos 10 °C por encima de su agua: el calor sensible de bajarlo de 181 a 30 °C, 2,73 kW. El agua que condensa la atrapa el separador, de 80 a 90 %, y cada uno la saca por su purga automática.', dur: 1.8, ir: function (S, t) { resaltar(S.m[0], 0); resaltar(S.m[1], t); D.ver(S.notas[0], 1 - T(t, 0, 0.3)); D.ver(S.notas[1], T(t, 0.3, 1)); } },
      { texto: 'El tanque pulmón guarda el aire, amortigua las pulsaciones y recoge más condensado. Con su <a href="#eq-gas-pulmon">volumen mínimo</a>, $V = 0,25 \\times 20,5 \\times 0,737 \\times 303,15/[(1/30) \\times 0,5 \\times 293,15]$ = 234 L. La PSV-401 lo protege como recipiente a presión, el PI-402 da su presión y el PT-403 arranca y para el compresor.', dur: 2.2, ir: function (S, t) { resaltar(S.m[1], 0); resaltar(S.m[2], t); D.ver(S.notas[1], 1 - T(t, 0, 0.3)); D.ver(S.notas[2], T(t, 0.3, 1)); } },
      { texto: 'El secador de adsorción deja el aire con un punto de rocío a presión de −40 °C, la clase 2 de agua de la ISO 8573-1: ninguna línea fría del aire de instrumentos recoge agua. Uno refrigerado, de +2 a +10 °C, no bastaría.', dur: 1.6, ir: function (S, t) { resaltar(S.m[2], 0); resaltar(S.m[3], t); D.ver(S.notas[2], 1 - T(t, 0, 0.3)); D.ver(S.notas[3], T(t, 0.3, 1)); } },
      { texto: 'Los dos filtros quitan las partículas y lo que quede de aceite, y sus PDI-404 y PDI-405 muestran su caída, con la que se cambian. Con el filtro, el secador de adsorción y otro filtro, el aire queda en la clase 1.2.1.', dur: 1.6, ir: function (S, t) { resaltar(S.m[3], 0); resaltar(S.m[4], t); D.ver(S.notas[3], 1 - T(t, 0, 0.3)); D.ver(S.notas[4], T(t, 0.3, 1)); } },
      { texto: 'A la red, con el código IA. Con la <a href="#eq-gas-red">caída de una red</a>, 150 m de tubo de 1 in a 7,74 bara pierden $450 \\times 20,5^{1,85} \\times 150/(26,64^5 \\times 7,74)$ = 0,17 bar, más que los 0,1 bar de una red fija; con 1¼ in, 0,04. Cada bar más de presión pide unos 8 % más de potencia, y un agujero de 1 mm se lleva 8 % del aire.', dur: 2.2, ir: function (S, t) { resaltar(S.m[4], 0); resaltar(S.m[5], t); D.ver(S.notas[4], 1 - T(t, 0, 0.3)); D.ver(S.notas[5], T(t, 0.3, 1)); } }
    ]
  });

  /* Reto: el tanque pulmón, la caída de una red y una fuga estrangulada. */

  /* ================= 12.7 Sistemas de vacío ================= */

  /* La carga del vacío de la rectificación, como en el ejemplo: la columna con sus juntas, el condensador del tope con
     su agua, el recibidor del condensado que vuelve a la columna, la línea de 6 m a la bomba de vacío y la descarga a
     la atmósfera. A la derecha, la carga de la bomba. */
  ZB.animacion('carga', {
    vista: [0, 0, 640, 380],
    alt: 'La columna de rectificación a 15 mbar con sus juntas, por donde entra el aire, el condensador del tope, el recibidor del condensado que vuelve a la columna y la línea de 6 m a la bomba de vacío, que descarga a la atmósfera. A la derecha, la carga: 3,0 kg/h de aire por 15,1 m de empaque; con el condensador a 25 °C, 3,1 kg/h de limoneno, y a 5 °C, 0,71 kg/h; 170 m³/h en la succión de la bomba, y 179 m³/h con una línea de 1½ in.',
    montar: function (svg) {
      var S = {};
      // la columna, con sus bridas
      s('path', { d: 'M30 340V96Q55 64 80 96V340Z', fill: K.blanco, stroke: K.tinta, 'stroke-width': 2 }, svg);
      [140, 200, 260, 310].forEach(function (y) { s('line', { x1: 24, x2: 86, y1: y, y2: y, stroke: K.tinta, 'stroke-width': 2.4 }, svg); });
      D.t(svg, 55, 360, 'Columna, 15 mbar', { tam: 12, peso: 650, ancla: 'middle' });
      // el condensador, el recibidor, la línea y la bomba, como en el típico del vacío
      camino(svg, [[55, 74], [55, 44], [150, 44], [150, 64]], { ancho: 1.8 });
      intercambiador(svg, 150, 82, 17);
      D.flecha(svg, 192, 92, 168, 88, { color: K.tinta2, ancho: 1.3, punta: 6 }); D.flecha(svg, 168, 76, 192, 72, { color: K.tinta2, ancho: 1.3, punta: 6 });
      D.t(svg, 158, 34, 'Condensador', { tam: 12, peso: 650 });
      camino(svg, [[150, 99], [150, 124]], { ancho: 1.8 });
      recipiente(svg, 150, 152, 30, 50);
      D.t(svg, 172, 196, 'Recibidor', { tam: 12, peso: 650 });
      D.flecha(svg, 150, 178, 150, 220, { color: K.tinta2, ancho: 1.4, punta: 7 }); camino(svg, [[150, 220], [88, 220]], { ancho: 1.4, color: K.tinta2 });
      D.flecha(svg, 100, 220, 86, 220, { color: K.tinta2, ancho: 1.4, punta: 7 });
      D.t(svg, 96, 236, 'condensado', { tam: 11.5, color: K.tinta2 });
      camino(svg, [[165, 140], [312, 140]], { ancho: 1.8 });
      D.t(svg, 238, 132, '6 m de línea', { tam: 11.5, ancla: 'middle', color: K.tinta2 });
      compresorSim(svg, 334, 140, 20);
      D.t(svg, 334, 112, 'Bomba de vacío', { tam: 12, peso: 650, ancla: 'middle' });
      D.flecha(svg, 354, 140, 392, 140, { color: K.tinta, ancho: 1.8, punta: 8 });
      D.t(svg, 372, 158, 'atm', { tam: 11.5, ancla: 'middle', color: K.tinta2 });
      // el aire que entra por las juntas
      S.aire = grupo(svg);
      [140, 200, 260, 310].forEach(function (y) { D.flecha(S.aire, 4, y - 6, 22, y, { color: AZ, ancho: 1.6, punta: 6 }); D.flecha(S.aire, 108, y - 6, 89, y, { color: AZ, ancho: 1.6, punta: 6 }); });
      D.t(S.aire, 98, 290, 'aire', { tam: 11.5, color: AZ, peso: 650 });
      S.gas = grupo(svg);
      D.t(S.gas, 238, 160, 'aire + limoneno', { tam: 11.5, ancla: 'middle', color: AZ, peso: 650 });
      S.agua = D.t(svg, 196, 104, '', { tam: 11.5, color: K.tinta2 });
      // la carga, a la derecha
      var bx = 420, bw = 150, KG_MAX = 3.5;
      D.t(svg, bx, 44, 'lo que saca la bomba (kg/h)', { tam: 12, peso: 600 });
      S.b = {};
      [['aire', 'aire, por 15,1 m de juntas', 3.03, AZ, 1], ['l25', 'limoneno, condensador a 25 °C', 3.13, OL, 1], ['l5', 'limoneno, condensador a 5 °C', 0.71, OL, 0.55]].forEach(function (b, i) {
        var y = 70 + i * 50, g = grupo(svg);
        D.t(g, bx, y, b[1], { tam: 11.5, color: K.tinta2 });
        var br = barra(g, bx, y + 7, bw, 16, b[3], { op: b[4] });
        var tv = D.t(g, bx + 4, y + 20, '', { tam: 12, peso: 700 });
        S.b[b[0]] = { g: g, br: br, tv: tv, v: b[2] };
      });
      S.ponerB = function (k, f) { var B = S.b[k]; D.ver(B.g, f > 0 ? 1 : 0); B.br.largo(f * B.v / KG_MAX); B.tv.setAttribute('x', bx + bw * B.v / KG_MAX * f + 6); D.ponerTexto(B.tv, n(B.v * f, 2)); };
      S.vol = grupo(svg); lineas(S.vol, bx, 236, ['Volumen en la succión', '3,74 kg/h a 15 mbar y 5 °C:', '169,3 m³/h, 170 redondeando'], { titulo: true, tam: 12, salto: 16, colorT: AZ });
      S.lin = grupo(svg); lineas(S.lin, bx, 300, ['La línea de 6 m', '3 in: 14,94 mbar; 2 in: 14,72', '1½ in: 14,22 mbar, 179 m³/h'], { titulo: true, tam: 12, salto: 16, colorT: AZ });
      S.hueco = grupo(svg); lineas(S.hueco, 196, 270, ['Todo cabe en un agujero:', 'por 2,5 mm entran', '3,0 kg/h estrangulados'], { titulo: true, tam: 12, salto: 16, colorT: K.alerta });
      return S;
    },
    pasos: [
      { texto: 'El aire entra por las juntas de la columna, el condensador y el rehervidor: $\\pi\\,(4 \\times 0,32 + 2 \\times 0,35 + 2 \\times 0,40 + 2 \\times 0,30 + 24 \\times 0,06)$ = 15,1 m de empaque. Con 0,2 kg/h por metro, 3,0 kg/h de aire; con la cifra de los evaporadores serían 0,06 kg/h. Adentro hay menos de la mitad de la presión de afuera, así que entra estrangulado.', dur: 2, ir: function (S, t) { D.ver(S.aire, t); S.ponerB('aire', T(t, 0.3, 1)); } },
      { texto: 'El aire sale del condensador saturado de limoneno. Con agua de enfriamiento, a 25 °C, la <a href="#eq-gas-antoine">ecuación de Antoine</a> da 2,03 mmHg, 2,70 mbar, y la <a href="#eq-gas-dalton">ley de Dalton</a>, $\\frac{2,70}{15 - 2,70} \\times \\frac{136,2}{29,0}$ = 1,03 kg por kilogramo de aire: 3,1 kg/h, casi 15 % del aceite.', dur: 2, ir: function (S, t) { D.ver(S.gas, t); D.ponerTexto(S.agua, t > 0 ? 'agua a 25 °C' : ''); S.ponerB('l25', T(t, 0.3, 1)); } },
      { texto: 'Con agua helada, a 5 °C, Antoine da 0,54 mmHg, 0,72 mbar, y salen $\\frac{0,72}{15 - 0,72} \\times \\frac{136,2}{29,0}$ = 0,24 kg por kilogramo de aire: 0,71 kg/h, 3,4 % del aceite. El aire que entra es el mismo; el condensador decide cuánto aceite se va.', dur: 1.8, ir: function (S, t) { D.ponerTexto(S.agua, t > 0.3 ? 'agua helada, 5 °C' : 'agua a 25 °C'); S.ponerB('l5', T(t, 0.3, 1)); } },
      { texto: 'La bomba mueve volumen. Con el condensador a 5 °C recibe 3,74 kg/h a 15 mbar y 5 °C, que como gases ideales (<a href="#eq-gas-condiciones">ecuación de las condiciones</a>) ocupan 169,3 m³/h, 170 m³/h redondeando hacia arriba: unos 56 m³/h por cada kilogramo por hora de aire.', dur: 1.8, ir: function (S, t) { D.ver(S.vol, t); } },
      { texto: 'La línea de 6 m hasta la bomba, con la <a href="#eq-gas-isotermica">ecuación isotérmica</a> y el factor laminar, $f = 64/\\mathrm{Re}$: el gas llega a 14,94 mbar con 3 in, a 14,72 con 2 in y a 14,22 con 1½ in. Las tres pasan la regla del 10 %, pero con 1½ in la bomba mueve $169,3 \\times 15/14,22$ = 179 m³/h, 5 % más.', dur: 2, ir: function (S, t) { D.ver(S.lin, t); } },
      { texto: 'Toda la carga cabe en un agujero: por un orificio de 2,5 mm, con la <a href="#eq-gas-estrangulado">ecuación del flujo estrangulado</a> y el aire de la sala a 73,7 kPa y 20 °C, entran 3,0 kg/h. La bomba la dimensionan las fugas, no el producto ni la columna.', dur: 1.8, ir: function (S, t) { D.ver(S.hueco, t); } }
    ]
  });

  /* Reto: Antoine y Dalton, el volumen de la bomba y el tiempo de evacuación. */
})();

