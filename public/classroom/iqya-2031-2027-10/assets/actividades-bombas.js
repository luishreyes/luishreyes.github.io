/* Las animaciones por pasos del capítulo 11 del libro, «Bombas», traídas con el mismo código y los mismos
   números para la presentación de bombas de 2027-10. Es una copia de libro/figuras/bombas/actividades.js del
   repositorio del libro, solo con las animaciones (los retos, con sus soluciones, se quedan en el libro). La
   carta de la bomba del caso va aparte, en carta-bombas.js, que se carga antes que dibujo.js. No se edita
   aquí; cuando cambian en el libro se vuelven a copiar. Corren con el motor de /classroom/estilo-libro/actividades/. */
/* 11-01-sistema.js: se escribe en interactivo/bombas/secciones/ y se trae con node interactivo/al-libro.mjs. No se edita aquí. */
/* 11.1 La bomba en el sistema: tres animaciones y el reto. */
(function () {
  'use strict';
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, T = ZB.tramo;
  var g = 9.81;

  /* La misma cabeza con tres líquidos: tres columnas de 20 m, tres presiones. */
  ZB.animacion('tres-liquidos', {
    vista: [0, 0, 640, 360],
    alt: 'Tres bancos iguales: la misma bomba sube agua, una salmuera y diésel hasta 20 m, y su manómetro marca 196, 255 y 157 kPa.',
    montar: function (svg) {
      var y0 = 300, esc = 10, Y = function (m) { return y0 - m * esc; };
      // regla
      s('line', { x1: 52, x2: 52, y1: Y(0), y2: Y(22), stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      for (var m = 0; m <= 20; m += 5) {
        s('line', { x1: 46, x2: 52, y1: Y(m), y2: Y(m), stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
        D.t(svg, 42, Y(m) + 4, m + ' m', { tam: 12, ancla: 'end', color: K.tinta2 });
      }
      var linea = s('line', { x1: 60, x2: 620, y1: Y(20), y2: Y(20), stroke: K.oliva, 'stroke-width': 1.6, 'stroke-dasharray': '6 5', opacity: 0 }, svg);
      var rotH = D.t(svg, 288, Y(20) + 22, 'H = 20 m en los tres', { tam: 14, peso: 700, ancla: 'middle', color: K.olivaOsc, halo: true });
      rotH.setAttribute('opacity', 0);
      var L = [
        { nom: 'Agua', rho: 998, col: K.aguaM, cx: 200 },
        { nom: 'Salmuera', rho: 1300, col: K.aguaO, cx: 375 },
        { nom: 'Diésel', rho: 800, col: K.aceite, cx: 550 }
      ];
      L.forEach(function (l) {
        var cx = l.cx;
        // tubo y columna
        s('rect', { x: cx - 13, y: 64, width: 26, height: y0 - 64, fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.5 }, svg);
        l.liq = s('rect', { x: cx - 11.5, y: y0, width: 23, height: 0, fill: l.col }, svg);
        // tubería de la bomba a la columna
        s('rect', { x: cx - 86, y: y0 - 6, width: 74, height: 12, fill: K.metal, stroke: K.tinta, 'stroke-width': 1.3 }, svg);
        l.tub = s('rect', { x: cx - 85, y: y0 - 4.5, width: 72, height: 9, fill: K.blanco }, svg);
        // bomba
        s('circle', { cx: cx - 98, cy: y0, r: 17, fill: K.metalM, stroke: K.tinta, 'stroke-width': 1.5 }, svg);
        l.imp = s('g', { transform: 'translate(' + (cx - 98) + ' ' + y0 + ')' }, svg);
        for (var k = 0; k < 6; k++) {
          var a = k * Math.PI / 3;
          s('path', { d: 'M0 0Q' + (7 * Math.cos(a + 0.5)).toFixed(1) + ' ' + (7 * Math.sin(a + 0.5)).toFixed(1) + ' ' + (12 * Math.cos(a)).toFixed(1) + ' ' + (12 * Math.sin(a)).toFixed(1), fill: 'none', stroke: K.tinta, 'stroke-width': 1.4 }, l.imp);
        }
        // manómetro sobre la descarga
        s('line', { x1: cx - 48, x2: cx - 48, y1: y0 - 6, y2: y0 - 34, stroke: K.tinta, 'stroke-width': 2 }, svg);
        l.man = D.manometro(svg, cx - 48, y0 - 54, 18, 300, { paso: 100, lectura: false });
        l.lec = D.t(svg, cx - 48, y0 - 82, '0 kPa', { tam: 13, peso: 650, ancla: 'middle' });
        l.man.poner(0, '');
        D.t(svg, cx - 40, 330, l.nom, { tam: 14, peso: 650, ancla: 'middle' });
        D.t(svg, cx - 40, 348, n(l.rho, 0) + ' kg/m³', { tam: 12.5, ancla: 'middle', color: K.tinta2 });
        l.Y = Y;
      });
      return { L: L, linea: linea, rotH: rotH, y0: y0 };
    },
    pasos: [
      { texto: 'La bomba da 20 m de cabeza. Con agua, la columna sube 20 m y el manómetro marca $\\rho g H$ = 196 kPa.', dur: 2.6, ir: function (S, t) { subir(S, 0, t); } },
      { texto: 'Con una salmuera de 1300 kg/m³, la columna sube lo mismo, 20 m, pero el manómetro marca 255 kPa.', dur: 2.6, ir: function (S, t) { subir(S, 1, t); } },
      { texto: 'Con diésel, de 800 kg/m³, otra vez 20 m; el manómetro marca 157 kPa.', dur: 2.6, ir: function (S, t) { subir(S, 2, t); } },
      { texto: 'La cabeza no cambió con el líquido; la presión sí, en proporción a la densidad. Por eso la curva del fabricante va en metros.', dur: 1.6, ir: function (S, t) { D.ver(S.linea, t); D.ver(S.rotH, t); } }
    ]
  });
  function subir(S, i, t) {
    var l = S.L[i], H = 20 * t;
    l.liq.setAttribute('y', l.Y(H)); l.liq.setAttribute('height', S.y0 - l.Y(H));
    l.tub.setAttribute('fill', t > 0 ? l.col : K.blanco);
    var p = l.rho * g * H / 1000;
    l.man.poner(p, '');
    D.ponerTexto(l.lec, n(p, 0) + ' kPa');
    l.imp.setAttribute('transform', 'translate(' + (l.cx - 98) + ' ' + S.y0 + ') rotate(' + (t * 720) + ')');
  }

  /* La cabeza entre bridas, término por término. */
  ZB.animacion('bridas', {
    vista: [0, 0, 640, 330],
    alt: 'La bomba del caso con sus dos manómetros; la cabeza se arma con el término de presión, 15,77 m, el de altura, 0,30 m, y el de velocidad, 0,50 m: 16,6 m.',
    montar: function (svg) {
      var S = {};
      S.luz = [
        s('rect', { x: 52, y: 112, width: 230, height: 70, rx: 8, fill: K.amarilloClaro, opacity: 0 }, svg),
        s('rect', { x: 262, y: 100, width: 52, height: 64, rx: 8, fill: K.amarilloClaro, opacity: 0 }, svg),
        s('rect', { x: 20, y: 46, width: 244, height: 196, rx: 8, fill: K.amarilloClaro, opacity: 0 }, svg)
      ];
      // succión (3 in) y descarga (2 in)
      s('rect', { x: 20, y: 199, width: 120, height: 34, fill: K.agua, stroke: K.tinta, 'stroke-width': 1.6 }, svg);
      s('rect', { x: 196, y: 40, width: 24, height: 130, fill: K.agua, stroke: K.tinta, 'stroke-width': 1.6 }, svg);
      s('rect', { x: 134, y: 192, width: 8, height: 48, fill: K.metalM, stroke: K.tinta, 'stroke-width': 1.2 }, svg);
      s('rect', { x: 189, y: 160, width: 38, height: 8, fill: K.metalM, stroke: K.tinta, 'stroke-width': 1.2 }, svg);
      s('circle', { cx: 196, cy: 216, r: 52, fill: K.metal, stroke: K.tinta, 'stroke-width': 1.8 }, svg);
      s('circle', { cx: 196, cy: 216, r: 30, fill: K.agua, stroke: K.tinta, 'stroke-width': 1.2 }, svg);
      D.t(svg, 196, 290, 'Bomba 2×3‑8', { tam: 13, peso: 600, ancla: 'middle' });
      D.t(svg, 30, 260, 'Brida de succión, 3 in', { tam: 12, color: K.tinta2 });
      D.t(svg, 226, 32, 'Brida de descarga, 2 in', { tam: 12, color: K.tinta2 });
      // manómetros
      s('line', { x1: 96, x2: 96, y1: 199, y2: 170, stroke: K.tinta, 'stroke-width': 2 }, svg);
      S.ms = D.manometro(svg, 96, 148, 20, 200, { paso: 50, lectura: false });
      S.ls = D.t(svg, 96, 118, '', { tam: 13, peso: 650, ancla: 'middle' });
      s('line', { x1: 220, x2: 248, y1: 104, y2: 104, stroke: K.tinta, 'stroke-width': 2 }, svg);
      S.md = D.manometro(svg, 270, 104, 20, 200, { paso: 50, lectura: false });
      S.ld = D.t(svg, 270, 74, '', { tam: 13, peso: 650, ancla: 'middle' });
      S.ms.poner(0); S.md.poner(0);
      // cota de 0,30 m
      S.cota = s('g', { opacity: 0 }, svg);
      s('line', { x1: 300, x2: 300, y1: 104, y2: 148, stroke: K.tinta, 'stroke-width': 1.2 }, S.cota);
      s('line', { x1: 116, x2: 306, y1: 148, y2: 148, stroke: K.tinta2, 'stroke-width': 1, 'stroke-dasharray': '3 3' }, S.cota);
      s('line', { x1: 294, x2: 306, y1: 104, y2: 104, stroke: K.tinta, 'stroke-width': 1.2 }, S.cota);
      D.t(S.cota, 304, 132, '0,30 m', { tam: 12.5, peso: 650 });
      // velocidades
      S.vs = D.flechaViva(svg, { color: K.flujo, ancho: 3 });
      S.vd = D.flechaViva(svg, { color: K.flujo, ancho: 3 });
      S.tvs = D.t(svg, 30, 192, '', { tam: 12.5, peso: 650, color: K.flujo });
      S.tvd = D.t(svg, 160, 70, '', { tam: 12.5, peso: 650, color: K.flujo, ancla: 'end' });
      // la suma, a la derecha
      var x = 360;
      S.filas = [
        ['Presión:  (p_d − p_s)/ρg', '15,77 m'],
        ['Altura:  z_d − z_s', '0,30 m'],
        ['Velocidad:  (v_d² − v_s²)/2g', '0,50 m']
      ].map(function (f, i) {
        var gg = s('g', { opacity: 0 }, svg);
        D.t(gg, x, 64 + i * 40, f[0], { tam: 14 });
        D.t(gg, 620, 64 + i * 40, (i ? '+ ' : '') + f[1], { tam: 15, peso: 700, ancla: 'end' });
        return gg;
      });
      S.total = s('g', { opacity: 0 }, svg);
      s('line', { x1: x, x2: 620, y1: 172, y2: 172, stroke: K.tinta, 'stroke-width': 1.5 }, S.total);
      D.t(S.total, x, 198, 'Cabeza de la bomba', { tam: 14, peso: 650 });
      D.t(S.total, 620, 198, 'H = 16,6 m', { tam: 16, peso: 750, ancla: 'end', color: K.olivaOsc });
      S.barras = s('g', { opacity: 0 }, svg);
      var e = 14;
      [['Dos manómetros solos', 15.8, K.metalM], ['Entre las bridas', 16.6, K.aguaM]].forEach(function (b, i) {
        var y = 236 + i * 40;
        D.t(S.barras, x, y - 6, b[0] + ': ' + n(b[1], 1) + ' m', { tam: 12.5, color: K.tinta2 });
        b.push(s('rect', { x: x, y: y, width: 0, height: 16, fill: b[2], stroke: K.tinta, 'stroke-width': 1 }, S.barras));
        S['b' + i] = { r: b[3], w: b[1] * e };
      });
      return S;
    },
    pasos: [
      { texto: 'La bomba pasa 27,3 m³/h. El manómetro de succión marca 12,5 kPa y el de descarga, 0,30 m más arriba, 166,7 kPa.', dur: 2, ir: function (S, t) {
        S.ms.poner(12.5 * t); S.md.poner(166.7 * t);
        D.ponerTexto(S.ls, n(12.5 * t, 1) + ' kPa'); D.ponerTexto(S.ld, n(166.7 * t, 1) + ' kPa');
      } },
      { texto: 'La diferencia de presión dividida por $\\rho g$ da el término más grande: 15,77 m.', dur: 1.4, ir: function (S, t) { D.ver(S.luz[0], t); D.ver(S.filas[0], t); } },
      { texto: 'El manómetro de la descarga está 0,30 m más alto: se suman 0,30 m.', dur: 1.4, ir: function (S, t) { D.ver(S.luz[0], 1 - t); D.ver(S.luz[1], t); D.ver(S.cota, t); D.ver(S.filas[1], t); } },
      { texto: 'Por la brida de 2 in el agua va a 3,50 m/s y por la de 3 in a 1,59 m/s. La diferencia de cabezas de velocidad suma 0,50 m.', dur: 2, ir: function (S, t) {
        D.ver(S.luz[1], 1 - t); D.ver(S.luz[2], 0.6 * t);
        S.vs(36, 216, 36 + 1.59 * 18 * t, 216); S.vd(208, 150, 208, 150 - 3.5 * 18 * t);
        D.ponerTexto(S.tvs, t > 0.5 ? 'v_s = 1,59 m/s' : ''); D.ponerTexto(S.tvd, t > 0.5 ? 'v_d = 3,50 m/s' : '');
        D.ver(S.filas[2], t);
      } },
      { texto: 'La bomba da 16,6 m. Los dos manómetros solos habrían dicho 15,8 m, un 5 % menos.', dur: 2, ir: function (S, t) {
        D.ver(S.luz[2], 0.6 * (1 - t)); D.ver(S.total, t); D.ver(S.barras, Math.min(1, t * 2));
        S.b0.r.setAttribute('width', S.b0.w * T(t, 0.2, 0.8)); S.b1.r.setAttribute('width', S.b1.w * T(t, 0.3, 1));
      } }
    ]
  });

  /* De la red al agua: las tres potencias como bandas. */
  ZB.animacion('potencias', {
    vista: [0, 0, 640, 320],
    alt: 'La potencia de la bomba del caso como una banda: 2,07 kW de la red, 1,72 kW al eje y 1,23 kW al agua; el motor pierde 0,35 kW y la bomba 0,49 kW como calor.',
    montar: function (svg) {
      var S = {}, e = 42, top = 92;
      S.e = e; S.top = top;
      S.Pe = 2.07; S.Pj = 1.72; S.Ph = 1.23;
      S.b1 = s('rect', { x: 24, y: top, width: 0, height: S.Pe * e, fill: K.metalM }, svg);
      S.b2 = s('rect', { x: 250, y: top, width: 0, height: S.Pj * e, fill: K.metalM }, svg);
      S.b3 = s('rect', { x: 466, y: top, width: 0, height: S.Ph * e, fill: K.aguaM }, svg);
      S.p1 = D.trazo(svg, 'M220 ' + (top + S.Pj * e + (S.Pe - S.Pj) * e / 2) + 'C 235 ' + (top + S.Pe * e + 20) + ' 236 250 240 282', { color: K.caliente, ancho: (S.Pe - S.Pj) * e });
      S.p2 = D.trazo(svg, 'M436 ' + (top + S.Ph * e + (S.Pj - S.Ph) * e / 2) + 'C 451 ' + (top + S.Pj * e + 20) + ' 452 250 456 282', { color: K.caliente, ancho: (S.Pj - S.Ph) * e });
      // equipos
      [[190, 'Motor'], [406, 'Bomba']].forEach(function (q) {
        s('rect', { x: q[0], y: top - 14, width: 60, height: S.Pe * e + 28, fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.8, rx: 4 }, svg);
        D.t(svg, q[0] + 30, top + S.Pe * e / 2 + 5, q[1], { tam: 14, peso: 650, ancla: 'middle' });
      });
      S.r = [
        rot(svg, 24, 'Eléctrica', '2,07 kW'),
        rot(svg, 260, 'Al eje', '1,72 kW · η_{mot} = 83 %'),
        rot(svg, 476, 'Hidráulica', '1,23 kW · η = 71,6 %')
      ];
      S.c1 = D.t(svg, 252, 300, '0,35 kW: calor en el motor', { tam: 12.5, color: K.calienteO, peso: 600 });
      S.c2 = D.t(svg, 468, 300, '0,49 kW: calor en la bomba', { tam: 12.5, color: K.calienteO, peso: 600 });
      S.fin = D.t(svg, 616, 230, '0,59 de cada kW pagado', { tam: 15, peso: 750, ancla: 'end', color: K.olivaOsc });
      [S.c1, S.c2, S.fin].concat(S.r).forEach(function (x) { x.setAttribute('opacity', 0); });
      return S;
    },
    pasos: [
      { texto: 'De la red entran 2,07 kW: la potencia eléctrica, la que se paga.', dur: 1.6, ir: function (S, t) { S.b1.setAttribute('width', 166 * t); D.ver(S.r[0], t); } },
      { texto: 'El motor, con 83 % de eficiencia, le entrega 1,72 kW al eje. Los 0,35 kW que faltan se vuelven calor en el motor.', dur: 2.2, ir: function (S, t) { S.p1.dibujar(T(t, 0, 0.6)); D.ver(S.c1, T(t, 0.4, 0.7)); S.b2.setAttribute('width', 156 * T(t, 0.3, 1)); D.ver(S.r[1], T(t, 0.5, 1)); } },
      { texto: 'La bomba, con 71,6 %, le da al agua 1,23 kW: la potencia hidráulica, $\\rho g Q H$. Los 0,49 kW restantes terminan casi todos como calor en el agua.', dur: 2.2, ir: function (S, t) { S.p2.dibujar(T(t, 0, 0.6)); D.ver(S.c2, T(t, 0.4, 0.7)); S.b3.setAttribute('width', 150 * T(t, 0.3, 1)); D.ver(S.r[2], T(t, 0.5, 1)); } },
      { texto: 'De cada kilovatio que se paga, 0,59 llegan al agua: $0,83 \\times 0,716 = 0,59$.', dur: 1.2, ir: function (S, t) { D.ver(S.fin, t); } }
    ]
  });
  function rot(svg, x, a, b) {
    var gg = s('g', {}, svg);
    D.t(gg, x, 58, a, { tam: 14, peso: 650 });
    D.t(gg, x, 76, b, { tam: 12.5, color: K.tinta2 });
    return gg;
  }

  /* Reto: presión, cabeza entre bridas y potencias. */
  var LIQ = [
    function (r) { return { n: 'una salmuera', c: 'la salmuera', rho: r.entre(1100, 1300, 0) }; },
    function (r) { return { n: 'diésel', c: 'el diésel', rho: r.entre(810, 860, 0) }; },
    function (r) { return { n: 'un jarabe diluido', c: 'el jarabe', rho: r.entre(1040, 1150, 0) }; },
    function (r) { return { n: 'etanol', c: 'el etanol', rho: 789 }; }
  ];
})();

/* 11-02-tipos.js: se escribe en interactivo/bombas/secciones/ y se trae con node interactivo/al-libro.mjs. No se edita aquí. */
/* 11.2 Tipos de bombas: la válvula de descarga que se cierra y el reto. */
(function () {
  'use strict';
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, T = ZB.tramo;
  var g = 9.81;

  /* Las dos bombas del ejemplo del libro, en el mismo sistema: H = 10 + k Q² (Q en m³/h, H en m). */
  var HS = 10, HAL = 50;
  function cen(k) { var Q = Math.sqrt(30 / (0.0025 + k)); return { Q: Q, H: 40 - 0.0025 * Q * Q }; }
  function dp(k) {
    var Q = (-1 + Math.sqrt(1 + 35.1 * k)) / (0.3 * k), H = HS + k * Q * Q;
    if (H <= HAL) return { Q: Q, H: H, linea: Q, alivio: 0, sin: H };
    var Qb = 60 - 0.15 * HAL, Ql = Math.sqrt((HAL - HS) / k);
    return { Q: Qb, H: HAL, linea: Ql, alivio: Qb - Ql, sin: H };
  }
  function kLog(a, b, t) { return Math.exp(Math.log(a) + (Math.log(b) - Math.log(a)) * t); }

  ZB.animacion('descarga-cerrada', {
    vista: [0, 0, 640, 360],
    alt: 'Curvas de cabeza contra caudal de una centrífuga y de una bomba de desplazamiento positivo en el mismo sistema. Al cerrar la válvula, la curva del sistema se empina: la centrífuga baja su caudal hasta llegar a 40 m sin caudal; la otra casi no cambia su caudal y su presión sube hasta que abre la válvula de alivio a 50 m.',
    montar: function (svg) {
      var S = {};
      var E = S.E = D.ejes(svg, { x: 62, y: 30, w: 352, h: 270, xmin: 0, xmax: 100, ymin: 0, ymax: 70, xt: [0, 20, 40, 60, 80, 100], yt: [0, 10, 20, 30, 40, 50, 60, 70], xr: 'Q (m³/h)', yr: 'H (m)' });
      var X = E.X, Y = E.Y;
      // curva de la centrífuga y recta casi vertical de la de desplazamiento positivo
      var pc = []; for (var q = 0; q <= 100; q += 2) pc.push([q, 40 - 0.0025 * q * q]);
      S.cc = s('path', { d: D.camino(pc, X, Y), fill: 'none', stroke: K.serie[0], 'stroke-width': 2.6, opacity: 0 }, svg);
      S.cd = s('path', { d: 'M' + X(60) + ' ' + Y(0) + 'L' + X(60 - 0.15 * 70) + ' ' + Y(70), fill: 'none', stroke: K.serie[1], 'stroke-width': 2.6, opacity: 0 }, svg);
      S.rc = D.t(svg, X(3), Y(40) - 10, 'Centrífuga', { tam: 13, peso: 650, color: K.serie[0], halo: true });
      S.rd = D.t(svg, X(62), Y(12), 'Desplazamiento', { tam: 13, peso: 650, color: K.serie[1], halo: true });
      S.rd2 = D.t(svg, X(62), Y(12) + 16, 'positivo', { tam: 13, peso: 650, color: K.serie[1], halo: true });
      // sistema
      S.sis = s('path', { fill: 'none', stroke: K.tinta, 'stroke-width': 2.2, opacity: 0 }, svg);
      S.rs = D.t(svg, 0, 0, 'Sistema', { tam: 13, peso: 650, halo: true });
      // válvula de alivio
      S.al = s('g', { opacity: 0 }, svg);
      s('line', { x1: X(0), x2: X(100), y1: Y(HAL), y2: Y(HAL), stroke: K.alerta, 'stroke-width': 1.6, 'stroke-dasharray': '7 5' }, S.al);
      D.t(S.al, X(99), Y(HAL) - 7, 'Válvula de alivio, 50 m', { tam: 12.5, peso: 650, ancla: 'end', color: K.alerta, halo: true });
      // sin alivio
      S.sin = s('g', { opacity: 0 }, svg);
      D.flecha(S.sin, X(52.5), Y(52), X(52.5), Y(70) - 6, { color: K.alerta, ancho: 2.6 });
      D.t(S.sin, X(50.5), Y(64), 'sin alivio, la presión', { tam: 12.5, peso: 650, color: K.alerta, halo: true, ancla: 'end' });
      D.t(S.sin, X(50.5), Y(64) + 15, 'sigue subiendo', { tam: 12.5, peso: 650, color: K.alerta, halo: true, ancla: 'end' });
      // puntos de operación
      S.pc = D.punto(svg, 0, 0, { r: 6.5 });
      S.pd = D.punto(svg, 0, 0, { r: 6.5 });
      S.pc.setAttribute('opacity', 0); S.pd.setAttribute('opacity', 0);
      // lecturas a la derecha
      var x0 = 446;
      D.t(svg, x0, 40, 'Válvula de descarga', { tam: 12.5, color: K.tinta2 });
      s('rect', { x: x0, y: 48, width: 180, height: 10, fill: K.rejilla }, svg);
      S.ab = s('rect', { x: x0, y: 48, width: 180, height: 10, fill: K.tinta }, svg);
      S.abt = D.t(svg, x0 + 180, 40, 'abierta', { tam: 12.5, peso: 650, ancla: 'end' });
      D.t(svg, x0, 92, 'Centrífuga', { tam: 14, peso: 700, color: K.serie[0] });
      S.lc = [D.t(svg, x0, 114, '', { tam: 13 }), D.t(svg, x0, 132, '', { tam: 13 })];
      S.calor = s('g', { opacity: 0 }, svg);
      s('rect', { x: x0 - 6, y: 142, width: 192, height: 42, rx: 4, fill: K.caliente, opacity: 0.35 }, S.calor);
      D.t(S.calor, x0, 160, 'Sin caudal: toda la potencia', { tam: 12.5, peso: 650, color: K.calienteO });
      D.t(S.calor, x0, 176, 'calienta el líquido', { tam: 12.5, peso: 650, color: K.calienteO });
      D.t(svg, x0, 214, 'Desplazamiento positivo', { tam: 14, peso: 700, color: K.serie[1] });
      S.ld = [D.t(svg, x0, 236, '', { tam: 13 }), D.t(svg, x0, 254, '', { tam: 13 }), D.t(svg, x0, 272, '', { tam: 13, color: K.alerta, peso: 600 })];
      return S;
    },
    pasos: [
      { texto: 'Con la válvula abierta, cada bomba corta la curva del sistema donde le toca: la centrífuga pasa 86,6 m³/h a 21,3 m, y la de desplazamiento positivo, 57,7 m³/h a 15,0 m.', dur: 2.4, ir: function (S, t) {
        [S.cc, S.cd, S.rc, S.rd, S.rd2].forEach(function (e) { D.ver(e, T(t, 0, 0.5)); });
        D.ver(S.sis, T(t, 0.3, 0.7)); D.ver(S.rs, T(t, 0.3, 0.7));
        poner(S, 0.0015, 1, T(t, 0.6, 1), 'abierta');
      } },
      { texto: 'Al cerrar la válvula a medias, la curva del sistema se empina. La centrífuga baja a 63,2 m³/h; la otra casi no cambia, 56,1 m³/h, pero su presión sube a 25,8 m. La centrífuga cede caudal; la de desplazamiento positivo, presión.', dur: 2.6, ir: function (S, t) {
        poner(S, kLog(0.0015, 0.005, t), ZB.lerp(1, 0.5, t), 1, 'a medias');
      } },
      { texto: 'Casi cerrada, la centrífuga se queda en 36,5 m³/h a 36,7 m. La de desplazamiento positivo subiría a 62 m, pero la válvula de alivio abre a 50 m y devuelve 7,8 m³/h a la succión.', dur: 2.8, ir: function (S, t) {
        D.ver(S.al, T(t, 0.35, 0.7));
        poner(S, kLog(0.005, 0.02, t), ZB.lerp(0.5, 0.15, t), 1, 'casi cerrada');
      } },
      { texto: 'Cerrada del todo, la centrífuga llega a su cabeza de cierre, 40 m, sin caudal, y toda la potencia que entra por el eje calienta el líquido de la carcasa. En la bomba del caso, la cabeza de cierre es 20,1 m. La de desplazamiento positivo devuelve sus 52,5 m³/h por el alivio.', dur: 2.8, ir: function (S, t) {
        D.ver(S.al, 1);
        var k = t >= 1 ? 1e12 : 0.02 / ((1 - t) * (1 - t));
        poner(S, k, ZB.lerp(0.15, 0, t), 1, t >= 1 ? 'cerrada' : 'casi cerrada');
        D.ver(S.calor, T(t, 0.6, 1));
      } },
      { texto: 'Sin válvula de alivio, la presión de la de desplazamiento positivo seguiría subiendo hasta que algo cediera: el motor, el eje, la carcasa o la tubería. Por eso esa bomba nunca se cierra sin un camino de regreso.', dur: 1.8, ir: function (S, t) {
        D.ver(S.al, 1 - 0.65 * t); D.ver(S.calor, 1);
        poner(S, 1e12, 0, 1, 'cerrada');
        D.ver(S.sin, t);
      } }
    ]
  });
  function poner(S, k, abre, vis, rot) {
    var X = S.E.X, Y = S.E.Y;
    // curva del sistema hasta 70 m
    var qm = Math.min(100, Math.sqrt((70 - HS) / k)), pts = [];
    for (var i = 0; i <= 40; i++) { var q = qm * i / 40; pts.push([q, HS + k * q * q]); }
    S.sis.setAttribute('d', D.camino(pts, X, Y));
    S.rs.setAttribute('x', X(qm) + 6); S.rs.setAttribute('y', Y(Math.min(70, HS + k * qm * qm)) + 14);
    if (qm < 8) { S.rs.setAttribute('x', X(0) + 8); S.rs.setAttribute('y', Y(12)); }
    var c = cen(k), d = dp(k);
    S.pc.setAttribute('cx', X(c.Q)); S.pc.setAttribute('cy', Y(c.H));
    S.pd.setAttribute('cx', X(d.linea)); S.pd.setAttribute('cy', Y(d.H));
    D.ver(S.pc, vis); D.ver(S.pd, vis);
    S.ab.setAttribute('width', 180 * abre);
    D.ponerTexto(S.abt, rot);
    D.ponerTexto(S.lc[0], 'Caudal: ' + n(c.Q, 1) + ' m³/h');
    D.ponerTexto(S.lc[1], 'Cabeza: ' + n(c.H, 1) + ' m');
    D.ponerTexto(S.ld[0], 'Caudal a la línea: ' + n(d.linea, 1) + ' m³/h');
    D.ponerTexto(S.ld[1], 'Cabeza: ' + n(d.H, 1) + ' m');
    D.ponerTexto(S.ld[2], d.alivio > 0.05 ? 'Por el alivio: ' + n(d.alivio, 1) + ' m³/h' : '');
  }

  /* Reto: volumen por vuelta y presión de cierre. */
  var LIQ = [
    { n: 'agua de 998 kg/m³', rho: 998 },
    { n: 'una salmuera de 1180 kg/m³', rho: 1180 },
    { n: 'un aceite de 870 kg/m³', rho: 870 },
    { n: 'un jarabe de 1250 kg/m³', rho: 1250 }
  ];
})();

/* 11-03-dentro.js: se escribe en interactivo/bombas/secciones/ y se trae con node interactivo/al-libro.mjs. No se edita aquí. */
/* 11.3 La centrífuga por dentro: el recorrido del líquido, el cebado y el reto. */
(function () {
  'use strict';
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, T = ZB.tramo;
  var g = 9.81, RAD = Math.PI / 180;

  /* El recorrido del líquido, en un corte de frente. φ se mide desde la izquierda en el sentido del giro
     (el de las agujas del reloj en pantalla): la voluta se ensancha de la lengüeta hasta la garganta. */
  var CX = 196, CY = 200, RI = 76, R0 = 90, DR = 40, TOPE = 22;
  function R(phi) { return R0 + DR * phi / 360; }
  function pt(r, phi) { return [CX - r * Math.cos(phi * RAD), CY - r * Math.sin(phi * RAD)]; }
  // Números del modelo de la bomba del caso a 27,3 m³/h: velocidad absoluta y presión absoluta, en m de agua.
  var EST = [
    { n: ['Ojo'], v: 1.67, p: 8.8 },
    { n: ['Salida del', 'impulsor'], v: 11.2495, p: 20.7 },
    { n: ['Brida de', 'descarga'], v: 3.50, p: 24.9 }
  ];
  var NP = 26;
  function particula(i) {
    var fe = (i * 360 / NP + 37 * ((i * 7) % 5)) % 360;
    var d1 = 1, d2 = 2.4 * (360 - fe) / 360 + 0.15, d3 = 0.9;
    return { fe: fe, d1: d1, d2: d2, d3: d3, L: d1 + d2 + d3, off: (i * 0.618) % 1 * (d1 + d2 + d3), j: ((i * 5) % 7 - 3) * 3 };
  }
  // Dónde va una partícula en el instante tau; fases: 1 impulsor, 2 voluta, 3 descarga.
  function lugar(p, tau, soloImp) {
    var a = soloImp ? (tau + p.off) % p.d1 : (tau + p.off) % p.L;
    if (a < p.d1) { var u = a / p.d1; return { xy: pt(22 + (RI + 2 - 22) * u, p.fe - 85 * (1 - u)), f: 1 }; }
    a -= p.d1;
    if (a < p.d2) { var w = a / p.d2, phi = p.fe + (360 - p.fe) * w, r = ZB.lerp(RI + 4, (RI + 4 + R(phi)) / 2, Math.min(1, w * 3)); return { xy: pt(r, phi), f: 2 }; }
    a -= p.d2;
    var z = a / p.d3, x = CX - (R0 + DR / 2) + p.j * 0.4;
    return { xy: [x, CY - (CY - TOPE) * z], f: 3 };
  }

  ZB.animacion('recorrido', {
    vista: [0, 0, 640, 360],
    alt: 'Corte de frente de la bomba: el líquido entra por el ojo, los álabes lo hacen girar y lo lanzan hacia afuera, la voluta lo recoge hasta la garganta y lo frena. A la derecha, la velocidad y la presión en el ojo, a la salida del impulsor y en la brida de descarga.',
    montar: function (svg) {
      var S = {};
      // voluta: el canal con su pared de metal
      var cam = [], phi;
      for (phi = 0; phi <= 360; phi += 4) cam.push(pt(R(phi), phi));
      var xo = CX - R(360), xi = CX - R0;
      var d = 'M' + cam.map(function (q) { return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join('L') + 'L' + xo + ' ' + TOPE + 'L' + xi + ' ' + TOPE + 'Z';
      s('path', { d: d, fill: 'none', stroke: K.metal, 'stroke-width': 24, 'stroke-linejoin': 'round' }, svg);
      S.canal = s('path', { d: d, fill: K.agua, stroke: K.tinta, 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, svg);
      s('rect', { x: xo - 14, y: TOPE - 10, width: xi - xo + 28, height: 10, fill: K.metalM, stroke: K.tinta, 'stroke-width': 1.2 }, svg);
      // impulsor
      S.imp = s('g', {}, svg);
      s('circle', { cx: 0, cy: 0, r: RI, fill: K.aguaM, stroke: K.tinta, 'stroke-width': 1.6 }, S.imp);
      for (var k = 0; k < 6; k++) {
        var pts = [];
        for (var r = 26; r <= RI; r += 5) { var ph = k * 60 - 70 * (r - 26) / (RI - 26); pts.push([-r * Math.cos(ph * RAD), -r * Math.sin(ph * RAD)]); }
        s('path', { d: 'M' + pts.map(function (q) { return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join('L'), fill: 'none', stroke: K.metalO, 'stroke-width': 5, 'stroke-linecap': 'round' }, S.imp);
      }
      s('circle', { cx: 0, cy: 0, r: 13, fill: K.metalM, stroke: K.tinta, 'stroke-width': 1.2 }, S.imp);
      s('circle', { cx: CX, cy: CY, r: 26, fill: 'none', stroke: K.tinta, 'stroke-width': 1, 'stroke-dasharray': '3 3' }, svg);
      // anillo de desgaste y fuga (paso 5)
      S.fuga = s('g', { opacity: 0 }, svg);
      s('circle', { cx: CX, cy: CY, r: 31, fill: 'none', stroke: K.alerta, 'stroke-width': 2.4 }, S.fuga);
      [30, 150, 270].forEach(function (a) {
        var p1 = pt(RI - 2, a), p2 = pt(36, a + 25), c = pt(60, a + 30);
        s('path', { d: 'M' + p1[0] + ' ' + p1[1] + 'Q' + c[0] + ' ' + c[1] + ' ' + p2[0] + ' ' + p2[1], fill: 'none', stroke: K.alerta, 'stroke-width': 2.2, 'stroke-dasharray': '5 3' }, S.fuga);
        var q = pt(42, a + 28);
        D.flecha(S.fuga, q[0], q[1], p2[0], p2[1], { color: K.alerta, ancho: 2.2, punta: 8 });
      });
      D.t(S.fuga, 20, 352, 'Fuga por la holgura de los anillos: vuelve al ojo', { tam: 12.5, peso: 650, color: K.alerta });
      // partículas
      S.P = []; S.dots = [];
      for (var i = 0; i < NP; i++) { S.P.push(particula(i)); S.dots.push(s('circle', { r: 3.2, fill: K.flujo, opacity: 0 }, svg)); }
      // flecha de c2 a la salida
      S.c2 = s('g', { opacity: 0 }, svg);
      var b = pt(RI + 2, 92), e = [b[0] + 11.25 * 5.6 * Math.cos(7.6 * RAD), b[1] - 11.25 * 5.6 * Math.sin(7.6 * RAD)];
      D.flecha(S.c2, b[0], b[1], e[0], e[1], { color: K.olivaOsc, ancho: 3, punta: 10 });
      D.t(S.c2, e[0] + 4, e[1] - 8, 'c_2 = 11,2 m/s', { tam: 13, peso: 700, color: K.olivaOsc, halo: true });
      // rótulos fijos
      D.t(svg, CX, CY + 5, 'Ojo', { tam: 12, peso: 650, ancla: 'middle', halo: K.aguaM });
      D.t(svg, CX + 6, CY + 58, 'Impulsor', { tam: 12.5, peso: 650, ancla: 'middle', halo: K.aguaM });
      D.t(svg, CX + R(200) + 16, CY + 30, 'Voluta', { tam: 13, peso: 650 });
      D.t(svg, xi + 22, TOPE + 34, 'Garganta', { tam: 12.5, peso: 650 });
      D.t(svg, xi + 22, TOPE + 50, 'y descarga', { tam: 12.5, peso: 650 });
      S.gira = D.t(svg, CX + 70, CY - 98, 'Gira así ↻', { tam: 12.5, color: K.tinta2 });
      // las tres estaciones, a la derecha
      S.der = s('g', { opacity: 0 }, svg);
      var x0 = 392, w = 40, paso = 80;
      D.t(S.der, x0, 40, 'Velocidad del líquido (m/s)', { tam: 13, peso: 650 });
      D.t(S.der, x0, 186, 'Presión absoluta (m de agua)', { tam: 13, peso: 650 });
      S.bv = []; S.bp = [];
      EST.forEach(function (e, i) {
        var x = x0 + 8 + i * paso;
        S.bv.push({ r: s('rect', { x: x, y: 150, width: w, height: 0, fill: K.flujo }, S.der), t: D.t(S.der, x + w / 2, 146, '', { tam: 12.5, peso: 650, ancla: 'middle' }), v: e.v, esc: 8 });
        S.bp.push({ r: s('rect', { x: x, y: 318, width: w, height: 0, fill: K.aguaO }, S.der), t: D.t(S.der, x + w / 2, 314, '', { tam: 12.5, peso: 650, ancla: 'middle' }), v: e.p, esc: 4 });
        e.n.forEach(function (l, j) { D.t(S.der, x + w / 2, 334 + j * 14, l, { tam: 11.5, ancla: 'middle', color: K.tinta2 }); });
      });
      s('line', { x1: x0, x2: x0 + 240, y1: 150, y2: 150, stroke: K.tinta2 }, S.der);
      s('line', { x1: x0, x2: x0 + 240, y1: 318, y2: 318, stroke: K.tinta2 }, S.der);
      return S;
    },
    pasos: [
      { texto: 'El líquido llega por la succión, de frente, y entra al impulsor por el ojo, en el centro.', dur: 2.6, ir: function (S, t) { mover(S, 0, t, 'ojo'); } },
      { texto: 'Los álabes lo hacen girar y lo lanzan hacia afuera. A la salida del impulsor va a 11,2 m/s, más rápido que en cualquier otra parte de la bomba.', dur: 3, ir: function (S, t) { mover(S, 1, t, 'imp'); D.ver(S.c2, T(t, 0.4, 0.8)); } },
      { texto: 'La voluta se ensancha alrededor del impulsor, en el sentido del giro, y recoge el líquido hasta la garganta de la descarga.', dur: 3.4, ir: function (S, t) { mover(S, 2, t, 'todo'); D.ver(S.c2, 1 - T(t, 0, 0.3)); } },
      { texto: 'Al ensancharse, la voluta frena el líquido: de 11,2 m/s a la salida del impulsor a 3,5 m/s en la brida de descarga. Esa velocidad perdida se vuelve presión, que sube de 20,7 a 24,9 m.', dur: 3.4, ir: function (S, t) {
        mover(S, 3, t, 'todo'); D.ver(S.der, T(t, 0, 0.2));
        [S.bv, S.bp].forEach(function (grupo) {
          grupo.forEach(function (b, i) {
            var f = T(t, 0.1 + i * 0.25, 0.4 + i * 0.25), h = b.v * b.esc * f;
            b.r.setAttribute('height', h);
            b.r.setAttribute('y', (grupo === S.bv ? 150 : 318) - h);
            D.ponerTexto(b.t, f > 0.05 ? n(b.v * f, 1) : ''); b.t.setAttribute('y', (grupo === S.bv ? 150 : 318) - h - 5);
          });
        });
      } },
      { texto: 'Una parte del líquido que sale del impulsor a alta presión se devuelve al ojo por la holgura de los anillos de desgaste. El impulsor tiene que bombearla otra vez: es la pérdida volumétrica.', dur: 2.6, ir: function (S, t) { mover(S, 4, t, 'todo'); D.ver(S.fuga, T(t, 0, 0.5)); } }
    ]
  });
  function mover(S, paso, t, modo) {
    var tau = (paso + t) * 2.6;
    S.imp.setAttribute('transform', 'translate(' + CX + ' ' + CY + ') rotate(' + (tau * 140).toFixed(2) + ')');
    // las barras quedan completas después del paso 4
    if (paso > 3) [S.bv, S.bp].forEach(function (grupo) {
      grupo.forEach(function (b) { var h = b.v * b.esc, y0 = grupo === S.bv ? 150 : 318; b.r.setAttribute('height', h); b.r.setAttribute('y', y0 - h); D.ponerTexto(b.t, n(b.v, 1)); b.t.setAttribute('y', y0 - h - 5); });
    });
    if (paso > 3) D.ver(S.der, 1);
    S.P.forEach(function (p, i) {
      var dot = S.dots[i], q;
      if (modo === 'ojo') {
        var r = 6 + 16 * ((i * 0.37) % 1), ph = i * 137.5 + tau * 140;
        q = { xy: pt(r, ph), f: 0 };
        dot.setAttribute('opacity', T(t, (i % 9) / 12, (i % 9) / 12 + 0.25));
      } else {
        q = lugar(p, tau, modo === 'imp');
        dot.setAttribute('opacity', 1);
      }
      dot.setAttribute('cx', q.xy[0].toFixed(1)); dot.setAttribute('cy', q.xy[1].toFixed(1));
    });
  }

  /* El cebado: la misma cabeza con aire y con agua. */
  var RA = 1.2, RW = 998, HC = 30;
  ZB.animacion('cebado', {
    vista: [0, 0, 640, 340],
    alt: 'Una centrífuga sobre un tanque, con la succión llena de aire: da 30 m de cabeza de aire, 353 Pa, y el agua sube apenas 3,6 cm. Llena de agua, la misma bomba da unos 2,9 bar y el agua sube por la descarga.',
    montar: function (svg) {
      var S = {};
      // tanque
      s('rect', { x: 30, y: 246, width: 230, height: 84, fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.6 }, svg);
      s('rect', { x: 31, y: 262, width: 228, height: 67, fill: K.aguaM }, svg);
      // succión: tubo con su contenido
      s('rect', { x: 100, y: 120, width: 20, height: 196, fill: K.metal, stroke: K.tinta, 'stroke-width': 1.4 }, svg);
      s('rect', { x: 100, y: 112, width: 80, height: 20, fill: K.metal, stroke: K.tinta, 'stroke-width': 1.4 }, svg);
      S.sAire = s('rect', { x: 103, y: 115, width: 74, height: 14, fill: K.vapor }, svg);
      S.sAire2 = s('rect', { x: 103, y: 115, width: 14, height: 147, fill: K.vapor }, svg);
      S.sAgua = s('rect', { x: 103, y: 262, width: 14, height: 52, fill: K.aguaM }, svg);
      S.sAguaH = s('rect', { x: 103, y: 115, width: 74, height: 14, fill: K.aguaM, opacity: 0 }, svg);
      // descarga
      s('rect', { x: 222, y: 20, width: 18, height: 72, fill: K.metal, stroke: K.tinta, 'stroke-width': 1.4 }, svg);
      S.dAgua = s('rect', { x: 225, y: 90, width: 12, height: 0, fill: K.aguaM }, svg);
      // bomba
      S.cas = s('circle', { cx: 212, cy: 122, r: 36, fill: K.vapor, stroke: K.tinta, 'stroke-width': 1.8 }, svg);
      s('circle', { cx: 212, cy: 122, r: 42, fill: 'none', stroke: K.metalM, 'stroke-width': 8 }, svg);
      S.imp = s('g', {}, svg);
      for (var k = 0; k < 6; k++) {
        var a = k * 60 * RAD;
        s('path', { d: 'M0 0Q' + (13 * Math.cos(a + 0.5)).toFixed(1) + ' ' + (13 * Math.sin(a + 0.5)).toFixed(1) + ' ' + (26 * Math.cos(a)).toFixed(1) + ' ' + (26 * Math.sin(a)).toFixed(1), fill: 'none', stroke: K.metalO, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, S.imp);
      }
      s('circle', { cx: 212, cy: 122, r: 7, fill: K.metalM, stroke: K.tinta }, svg);
      D.t(svg, 212, 182, 'Bomba: H = 30 m', { tam: 12.5, peso: 650, ancla: 'middle' });
      // cota de 3 m
      s('line', { x1: 282, x2: 282, y1: 122, y2: 262, stroke: K.tinta, 'stroke-width': 1.2 }, svg);
      s('line', { x1: 250, x2: 290, y1: 122, y2: 122, stroke: K.tinta2, 'stroke-dasharray': '3 3' }, svg);
      s('line', { x1: 262, x2: 290, y1: 262, y2: 262, stroke: K.tinta2, 'stroke-dasharray': '3 3' }, svg);
      D.t(svg, 288, 196, '3 m', { tam: 12.5, peso: 650 });
      S.sube = D.t(svg, 126, 252, '', { tam: 12.5, peso: 700, color: K.alerta, halo: true });
      // manómetro de descarga, en bar
      s('line', { x1: 240, x2: 262, y1: 50, y2: 50, stroke: K.tinta, 'stroke-width': 2 }, svg);
      S.man = D.manometro(svg, 284, 50, 20, 4, { paso: 1, lectura: false });
      S.lec = D.t(svg, 312, 55, '', { tam: 13, peso: 650 });
      S.man.poner(0);
      // barras de presión
      var x0 = 400, esc = 60;
      D.t(svg, x0, 40, 'Presión que da la bomba (bar)', { tam: 13, peso: 650 });
      s('line', { x1: x0, x2: x0, y1: 60, y2: 210, stroke: K.tinta2 }, svg);
      [0, 1, 2, 3].forEach(function (v) { D.t(svg, x0 + v * esc, 228, String(v), { tam: 12, ancla: 'middle', color: K.tinta2 }); s('line', { x1: x0 + v * esc, x2: x0 + v * esc, y1: 210, y2: 214, stroke: K.tinta2 }, svg); });
      s('line', { x1: x0, x2: x0 + 200, y1: 210, y2: 210, stroke: K.tinta2 }, svg);
      S.esc = esc; S.x0 = x0;
      S.bA = s('rect', { x: x0, y: 82, width: 0, height: 34, fill: K.vapor, stroke: K.tinta, 'stroke-width': 1, opacity: 0 }, svg);
      S.tA = D.t(svg, x0 + 8, 76, '', { tam: 12.5, peso: 650 });
      S.bW = s('rect', { x: x0, y: 150, width: 0, height: 34, fill: K.aguaM, stroke: K.tinta, 'stroke-width': 1, opacity: 0 }, svg);
      S.tW = D.t(svg, x0 + 8, 144, '', { tam: 12.5, peso: 650 });
      S.fin = D.t(svg, 400, 270, '', { tam: 14, peso: 700, color: K.olivaOsc });
      return S;
    },
    pasos: [
      { texto: 'La bomba da 30 m de cabeza, pero arranca con la carcasa y la succión llenas de aire. El agua está en el tanque, 3 m más abajo.', dur: 2, ir: function (S, t) { girar(S, 0, t); } },
      { texto: 'Con aire de 1,2 kg/m³, la presión que desarrolla es $\\Delta p = \\rho g H = 1,2 \\times 9,81 \\times 30$ = 353 Pa: menos de 0,004 bar. La aguja casi no se mueve.', dur: 2.4, ir: function (S, t) {
        girar(S, 1, t);
        var p = RA * g * HC / 1e5 * t;
        S.man.poner(p); D.ponerTexto(S.lec, n(p * 1e5, 0) + ' Pa');
        D.ver(S.bA, T(t, 0.2, 0.5)); S.bA.setAttribute('width', Math.max(1, p * S.esc));
        D.ponerTexto(S.tA, t > 0.4 ? 'Con aire: 0,0035 bar' : '');
      } },
      { texto: 'Esa presión sostiene apenas $353/(998 \\times 9,81)$ = 0,036 m de agua, 3,6 cm. El agua de la succión casi no sube y la bomba no bombea nada.', dur: 2.4, ir: function (S, t) {
        girar(S, 2, t); fijoAire(S);
        var h = 1.7 * t;
        S.sAgua.setAttribute('y', 262 - h); S.sAgua.setAttribute('height', 52 + h);
        D.ponerTexto(S.sube, t > 0.3 ? '← sube 3,6 cm' : '');
      } },
      { texto: 'Llena de agua, la misma bomba da 30 m de agua: $998 \\times 9,81 \\times 30$ = 294 kPa, unos 2,9 bar.', dur: 2.8, ir: function (S, t) {
        girar(S, 3, t); fijoAire(S);
        var f = T(t, 0, 0.5);
        var y = ZB.lerp(260.3, 115, f);
        S.sAgua.setAttribute('y', y); S.sAgua.setAttribute('height', 314 - y);
        S.sAire2.setAttribute('height', Math.max(0, y - 115));
        D.ver(S.sAguaH, T(t, 0.45, 0.55));
        S.cas.setAttribute('fill', f >= 1 ? K.aguaM : K.vapor);
        D.ponerTexto(S.sube, '');
        var p = ZB.lerp(RA, RW, T(t, 0.5, 1)) * g * HC / 1e5;
        S.man.poner(p); D.ponerTexto(S.lec, p < 0.01 ? n(p * 1e5, 0) + ' Pa' : n(p, 2) + ' bar');
        D.ver(S.bW, T(t, 0.5, 0.6)); S.bW.setAttribute('width', RW * g * HC / 1e5 * S.esc * T(t, 0.5, 1));
        D.ponerTexto(S.tW, t > 0.6 ? 'Con agua: 2,94 bar' : '');
      } },
      { texto: 'El agua sube por la descarga y la bomba entrega caudal. Por eso, antes de arrancar, la carcasa y la succión tienen que estar llenas: la bomba tiene que estar cebada.', dur: 2, ir: function (S, t) {
        girar(S, 4, t); fijoAire(S); fijoAgua(S);
        S.dAgua.setAttribute('y', 90 - 68 * t); S.dAgua.setAttribute('height', 68 * t + 2);
        D.ponerTexto(S.fin, t > 0.5 ? 'Bomba cebada' : '');
      } }
    ]
  });
  function girar(S, paso, t) { S.imp.setAttribute('transform', 'translate(212 122) rotate(' + ((paso + t) * 300).toFixed(1) + ')'); }
  function fijoAire(S) {
    var p = RA * g * HC / 1e5;
    S.man.poner(p); D.ponerTexto(S.lec, n(p * 1e5, 0) + ' Pa');
    D.ver(S.bA, 1); S.bA.setAttribute('width', Math.max(1, p * S.esc));
    D.ponerTexto(S.tA, 'Con aire: 0,0035 bar');
    S.sAgua.setAttribute('y', 260.3); S.sAgua.setAttribute('height', 53.7);
    D.ponerTexto(S.sube, '← sube 3,6 cm');
  }
  function fijoAgua(S) {
    S.sAgua.setAttribute('y', 115); S.sAgua.setAttribute('height', 199);
    S.sAire2.setAttribute('height', 0); D.ver(S.sAguaH, 1); S.cas.setAttribute('fill', K.aguaM);
    D.ponerTexto(S.sube, '');
    var p = RW * g * HC / 1e5;
    S.man.poner(p); D.ponerTexto(S.lec, n(p, 2) + ' bar');
    D.ver(S.bW, 1); S.bW.setAttribute('width', p * S.esc); D.ponerTexto(S.tW, 'Con agua: 2,94 bar');
  }

  /* Reto: el nombre de una bomba, el cebado y las fugas del sello. */
  var TAM = [[1, 1.5, 6], [1.5, 3, 6], [2, 3, 6], [1, 1.5, 8], [1.5, 3, 8], [2, 3, 8], [3, 4, 8], [1, 2, 10], [1.5, 3, 10], [2, 3, 10], [3, 4, 10], [4, 6, 10], [1.5, 3, 13], [2, 3, 13], [3, 4, 13], [4, 6, 13], [6, 8, 13]];
  function pulg(x) { return x % 1 ? Math.floor(x) + '½' : String(x); }
})();

/* 11-04-euler.js: se escribe en interactivo/bombas/secciones/ y se trae con node interactivo/al-libro.mjs. No se edita aquí. */
/* 11.4 Por qué una centrífuga da cabeza: tres animaciones y el reto. */
(function () {
  'use strict';
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, T = ZB.tramo;
  var g = 9.81, RAD = Math.PI / 180;
  // El impulsor del caso: 190 mm, 1750 r/min, salida de 9,3 mm, 92 % del área libre, 6 álabes a 27°.
  var u2 = Math.PI * 0.190 * 1750 / 60, A2 = Math.PI * 0.190 * 0.0093 * 0.92, H0 = u2 * u2 / g;
  function pendiente(beta) { return u2 / Math.tan(beta * RAD) / (g * A2) / 3600; } // m por (m³/h)

  /* El ángulo del álabe y la pendiente de la recta de Euler. */
  function icono(padre, cx, cy, desv, color) {
    var gg = s('g', {}, padre);
    s('circle', { cx: cx, cy: cy, r: 27, fill: K.blanco, stroke: K.borde, 'stroke-width': 1.2, 'stroke-dasharray': '3 3' }, gg);
    for (var k = 0; k < 3; k++) {
      var a0 = (90 + k * 120) * RAD, a1 = a0 + desv * RAD;
      var p0 = [cx + 8 * Math.cos(a0), cy - 8 * Math.sin(a0)], p1 = [cx + 26 * Math.cos(a1), cy - 26 * Math.sin(a1)];
      var am = (a0 + a1) / 2 + (desv ? -desv * 0.25 * RAD : 0), pm = [cx + 19 * Math.cos(am), cy - 19 * Math.sin(am)];
      s('path', { d: 'M' + p0.join(' ') + 'Q' + pm.join(' ') + ' ' + p1.join(' '), fill: 'none', stroke: color, 'stroke-width': 3, 'stroke-linecap': 'round' }, gg);
    }
    s('circle', { cx: cx, cy: cy, r: 8, fill: K.metalM, stroke: K.tinta, 'stroke-width': 1.2 }, gg);
    // sentido de giro: contra las manecillas
    s('path', { d: 'M' + (cx + 33) + ' ' + (cy + 8) + 'A 34 34 0 0 0 ' + (cx + 8) + ' ' + (cy - 33), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, gg);
    s('path', { d: 'M' + (cx + 8) + ' ' + (cy - 33) + 'l7 -2 l-2 7z', fill: K.tinta2 }, gg);
    return gg;
  }
  ZB.animacion('alabes', {
    vista: [0, 0, 640, 330],
    alt: 'La cabeza ideal de Euler contra el caudal para el impulsor del caso con álabes hacia atrás, radiales y hacia adelante: la recta baja, es plana o sube. Debajo, la curva real de la bomba.',
    montar: function (svg) {
      var S = {};
      var E = D.ejes(svg, { x: 64, y: 30, w: 340, h: 240, xmin: 0, xmax: 50, ymin: 0, ymax: 45, xt: [0, 10, 20, 30, 40, 50], yt: [0, 10, 20, 30, 40], xr: 'Q (m³/h)', yr: 'H (m)' });
      S.E = E;
      var lineas = [[27, K.serie[0], 'Hacia atrás, 27°', -50], [90, K.serie[1], 'Radiales, 90°', 0], [150, K.serie[2], 'Hacia adelante, 150°', 50]];
      S.L = lineas.map(function (l, i) {
        var m = pendiente(l[0]), y50 = H0 - m * 50;
        var tr = D.trazo(svg, 'M' + E.X(0) + ' ' + E.Y(H0) + 'L' + E.X(50) + ' ' + E.Y(y50), { color: l[1], ancho: 3 });
        var leg = s('g', { opacity: 0 }, svg);
        icono(leg, 452, 64 + i * 78, l[3], l[1]);
        D.t(leg, 490, 60 + i * 78, l[2], { tam: 13.5, peso: 650 });
        D.t(leg, 490, 78 + i * 78, i === 1 ? 'la cabeza no cambia' : i === 0 ? 'baja con el caudal' : 'sube con el caudal', { tam: 12.5, color: K.tinta2 });
        return { tr: tr, leg: leg };
      });
      S.H0 = s('g', { opacity: 0 }, svg);
      s('line', { x1: E.X(0), y1: E.Y(H0), x2: E.X(3), y2: E.Y(37) + 4, stroke: K.tinta2, 'stroke-width': 1 }, S.H0);
      D.t(S.H0, E.X(3) + 2, E.Y(37), 'u_2²/g = 30,9 m', { tam: 12.5, peso: 650, halo: true });
      S.marco = s('rect', { x: 418, y: 26, width: 214, height: 70, rx: 6, fill: 'none', stroke: K.oliva, 'stroke-width': 2, opacity: 0 }, svg);
      S.real = D.trazo(svg, D.camino(D.cartaPts('190', 0), E.X, E.Y), { color: K.tinta, ancho: 3 });
      S.rReal = D.t(svg, E.X(33) + 4, E.Y(D.carta('190', 32.5, 0)) + 18, 'curva real, 190 mm', { tam: 12.5, peso: 650, halo: true });
      S.rReal.setAttribute('opacity', 0);
      return S;
    },
    pasos: [
      { texto: 'Con caudal cero las tres rectas parten del mismo punto, $u_2^2/g$ = 30,9 m. Con álabes hacia atrás, a 27° como los del caso, la recta baja: más caudal, menos cabeza ideal.', dur: 2, ir: function (S, t) { D.ver(S.H0, T(t, 0, 0.3)); S.L[0].tr.dibujar(T(t, 0.2, 1)); D.ver(S.L[0].leg, T(t, 0.2, 0.6)); } },
      { texto: 'Con álabes radiales, $\\cot 90° = 0$ y la cabeza ideal no depende del caudal.', dur: 1.6, ir: function (S, t) { S.L[1].tr.dibujar(t); D.ver(S.L[1].leg, T(t, 0, 0.5)); } },
      { texto: 'Con álabes hacia adelante, $\\cot\\beta_{2B}$ es negativa y la recta sube con el caudal.', dur: 1.6, ir: function (S, t) { S.L[2].tr.dibujar(t); D.ver(S.L[2].leg, T(t, 0, 0.5)); } },
      { texto: 'Una curva que sube con el caudal se vuelve inestable en muchas instalaciones. Por eso casi todas las centrífugas llevan álabes hacia atrás, entre 20 y 35°.', dur: 1.2, ir: function (S, t) { D.ver(S.marco, t); D.ver(S.L[1].leg, 1 - 0.6 * t); D.ver(S.L[2].leg, 1 - 0.6 * t); } },
      { texto: 'La curva real de la bomba del caso queda muy por debajo de su recta ideal: el deslizamiento y las pérdidas se llevan la diferencia.', dur: 2, ir: function (S, t) { S.real.dibujar(t); D.ver(S.rReal, T(t, 0.6, 1)); } }
    ]
  });

  /* El triángulo de velocidades a la salida, a escala, y lo que hace el deslizamiento. */
  var tri = { cm: 1.4836, cuInf: 14.4979, cu: 11.1513, wuInf: 2.9117, wu: 6.2584, b2: 13.336, Hinf: 25.73, Hth: 19.79, H: 16.56 };
  ZB.animacion('triangulos', {
    vista: [0, 0, 640, 350],
    alt: 'El triángulo de velocidades a la salida del impulsor del caso, a escala: u2 de 17,4 m/s, w2 a 27° y c2. Con el deslizamiento, el líquido sale a 13°, c2u baja de 14,5 a 11,2 m/s y la cabeza teórica de 25,7 a 19,8 m; la bomba da 16,6 m.',
    montar: function (svg) {
      var S = {}, e = 30, P = [56, 300];
      S.e = e; S.P = P; S.U = [P[0] + u2 * e, P[1]];
      // el impulsor, pequeño, con la salida marcada
      var cx = 92, cy = 104, R = 62;
      s('circle', { cx: cx, cy: cy, r: R, fill: K.agua, stroke: K.tinta, 'stroke-width': 1.5 }, svg);
      S.rot = s('g', {}, svg);
      for (var k = 0; k < 6; k++) {
        var a0 = k * 60 * RAD, a1 = a0 - 55 * RAD, am = a0 - 22 * RAD;
        s('path', { d: 'M' + (cx + 16 * Math.cos(a0)) + ' ' + (cy - 16 * Math.sin(a0)) + 'Q' + (cx + 44 * Math.cos(am)) + ' ' + (cy - 44 * Math.sin(am)) + ' ' + (cx + R * Math.cos(a1)) + ' ' + (cy - R * Math.sin(a1)), fill: 'none', stroke: K.metalO, 'stroke-width': 4, 'stroke-linecap': 'round' }, S.rot);
      }
      s('circle', { cx: cx, cy: cy, r: 15, fill: K.metalM, stroke: K.tinta, 'stroke-width': 1.2 }, svg);
      s('path', { d: 'M' + (cx + R + 10) + ' ' + (cy + 18) + 'A ' + (R + 12) + ' ' + (R + 12) + ' 0 0 0 ' + (cx + 22) + ' ' + (cy - R - 8), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.3 }, svg);
      s('path', { d: 'M' + (cx + 22) + ' ' + (cy - R - 8) + 'l8 -1 l-3 7z', fill: K.tinta2 }, svg);
      D.t(svg, cx, cy + R + 22, 'Impulsor de 190 mm', { tam: 12.5, color: K.tinta2, ancla: 'middle' });
      s('line', { x1: P[0], x2: 620, y1: P[1], y2: P[1], stroke: K.rejilla, 'stroke-width': 1 }, svg);
      D.t(svg, 620, 342, 'Triángulo a escala: 1 m/s = ' + e + ' px', { tam: 11.5, color: K.tinta2, ancla: 'end' });
      // vectores
      S.alabe = s('line', { stroke: K.metalO, 'stroke-width': 1.5, 'stroke-dasharray': '6 4', opacity: 0 }, svg);
      S.cmLin = s('line', { stroke: K.tinta2, 'stroke-width': 1.2, 'stroke-dasharray': '4 3', opacity: 0 }, svg);
      S.arco = s('path', { fill: 'none', stroke: K.tinta, 'stroke-width': 1.3, opacity: 0 }, svg);
      S.fu = D.flechaViva(svg, { color: K.tinta, ancho: 3 });
      S.fw = D.flechaViva(svg, { color: K.oliva, ancho: 3 });
      S.fc = D.flechaViva(svg, { color: K.flujo, ancho: 3 });
      S.tu = D.t(svg, S.U[0], 322, '', { tam: 13, peso: 650, ancla: 'end' });
      S.tw = D.t(svg, 0, 0, 'w_2', { tam: 14, peso: 700, color: K.olivaOsc, halo: true });
      S.tc = D.t(svg, 0, 0, 'c_2', { tam: 14, peso: 700, color: K.flujo, halo: true });
      S.tcu = D.t(svg, 0, 322, '', { tam: 13, peso: 650, color: K.flujo, ancla: 'middle' });
      S.tcm = D.t(svg, 0, 0, 'c_{2m} = 1,48 m/s', { tam: 12, peso: 600, color: K.tinta2, ancla: 'end' });
      S.tb = D.t(svg, 0, 0, '', { tam: 12.5, peso: 650, halo: true, ancla: 'end' });
      [S.tw, S.tc, S.tcm, S.tb].forEach(function (x) { x.setAttribute('opacity', 0); });
      // las tres cabezas
      var bx = 250, be = 12.5;
      S.barras = [['Sin deslizamiento, H_{th,∞}', tri.Hinf, K.metalM], ['Con deslizamiento, H_{th}', tri.Hth, K.aguaM], ['La bomba, H', tri.H, K.aguaO]].map(function (b, i) {
        var y = 46 + i * 46, gg = s('g', { opacity: 0 }, svg);
        var tx = D.t(gg, bx, y - 7, b[0] + ' = ' + n(b[1], 1) + ' m', { tam: 13, peso: 600 });
        var r = s('rect', { x: bx, y: y, width: 0, height: 15, fill: b[2], stroke: K.tinta, 'stroke-width': 1 }, gg);
        return { g: gg, r: r, w: b[1] * be };
      });
      return S;
    },
    pasos: [
      { texto: 'El álabe se mueve con el impulsor. En la salida, a 190 mm y 1750 r/min, va a $u_2 = \\pi D_2 N/60$ = 17,4 m/s.', dur: 1.8, ir: function (S, t) {
        S.rot.setAttribute('transform', 'rotate(' + (-60 * t) + ' 92 104)');
        S.fu(S.P[0], S.P[1], S.P[0] + u2 * S.e * t, S.P[1]);
        D.ponerTexto(S.tu, t > 0.6 ? 'u_2 = 17,4 m/s' : '');
      } },
      { texto: 'Respecto al álabe, el líquido sale por el canal a 27° de la tangente: es la velocidad relativa $w_2$. Su componente radial, $c_{2m} = Q/A_2$ = 1,48 m/s, es pequeña al lado de $u_2$.', dur: 2, ir: function (S, t) {
        var W = [S.U[0] - tri.wuInf * S.e, S.P[1] - tri.cm * S.e];
        S.fw(S.U[0], S.U[1], S.U[0] + (W[0] - S.U[0]) * t, S.U[1] + (W[1] - S.U[1]) * t);
        var L = 150;
        S.alabe.setAttribute('x1', S.U[0]); S.alabe.setAttribute('y1', S.U[1]);
        S.alabe.setAttribute('x2', S.U[0] - L * Math.cos(27 * RAD)); S.alabe.setAttribute('y2', S.U[1] - L * Math.sin(27 * RAD));
        D.ver(S.alabe, T(t, 0.4, 1));
        S.cmLin.setAttribute('x1', W[0]); S.cmLin.setAttribute('x2', W[0]); S.cmLin.setAttribute('y1', W[1]); S.cmLin.setAttribute('y2', S.P[1]);
        D.ver(S.cmLin, T(t, 0.6, 1));
        ponerW(S, W); D.ver(S.tw, T(t, 0.5, 1));
        S.tcm.setAttribute('x', W[0] - 6); S.tcm.setAttribute('y', S.P[1] - 6); D.ver(S.tcm, T(t, 0.6, 1));
        arco(S, 27); D.ver(S.arco, T(t, 0.6, 1)); D.ver(S.tb, T(t, 0.6, 1));
      } },
      { texto: 'La velocidad absoluta es la suma, $c_2 = u_2 + w_2$. Su componente tangencial, $c_{2u}$ = 14,5 m/s, entra en la ecuación de Euler: $H_{th,\\infty} = u_2 c_{2u}/g$ = 25,7 m.', dur: 2, ir: function (S, t) {
        var W = [S.U[0] - tri.wuInf * S.e, S.P[1] - tri.cm * S.e];
        S.fc(S.P[0], S.P[1], S.P[0] + (W[0] - S.P[0]) * t, S.P[1] + (W[1] - S.P[1]) * t);
        ponerC(S, W); D.ver(S.tc, T(t, 0.5, 1));
        S.tcu.setAttribute('x', (S.P[0] + W[0]) / 2); D.ponerTexto(S.tcu, t > 0.5 ? 'c_{2u} = 14,5 m/s' : '');
        D.ver(S.barras[0].g, T(t, 0.4, 0.7)); S.barras[0].r.setAttribute('width', S.barras[0].w * T(t, 0.5, 1));
      } },
      { texto: 'El líquido no sigue el álabe: sale a 13° y no a 27°. Con el deslizamiento de Wiesner, $\\gamma$ = 0,808, $c_{2u}$ baja a 11,2 m/s y la cabeza teórica, a 19,8 m.', dur: 2.4, ir: function (S, t) {
        var wu = ZB.lerp(tri.wuInf, tri.wu, t), W = [S.U[0] - wu * S.e, S.P[1] - tri.cm * S.e];
        S.fw(S.U[0], S.U[1], W[0], W[1]); S.fc(S.P[0], S.P[1], W[0], W[1]);
        S.cmLin.setAttribute('x1', W[0]); S.cmLin.setAttribute('x2', W[0]);
        S.tcm.setAttribute('x', W[0] - 6);
        ponerW(S, W); ponerC(S, W);
        var cu = ZB.lerp(tri.cuInf, tri.cu, t);
        S.tcu.setAttribute('x', (S.P[0] + W[0]) / 2); D.ponerTexto(S.tcu, 'c_{2u} = ' + n(cu, 1) + ' m/s');
        arco(S, Math.atan(tri.cm / wu) / RAD);
        D.ver(S.barras[1].g, T(t, 0.3, 0.6)); S.barras[1].r.setAttribute('width', S.barras[1].w * T(t, 0.4, 1));
      } },
      { texto: 'Las pérdidas hidráulicas se llevan otros 3,2 m: la bomba da 16,6 m, y su eficiencia hidráulica es $\\eta_h$ = 16,6/19,8 = 0,84.', dur: 1.6, ir: function (S, t) {
        D.ver(S.barras[2].g, T(t, 0, 0.4)); S.barras[2].r.setAttribute('width', S.barras[2].w * T(t, 0.2, 1));
      } }
    ]
  });
  function ponerW(S, W) { S.tw.setAttribute('x', (S.U[0] + W[0]) / 2 + 6); S.tw.setAttribute('y', (S.U[1] + W[1]) / 2 - 12); }
  function ponerC(S, W) { S.tc.setAttribute('x', (S.P[0] + W[0]) / 2 - 10); S.tc.setAttribute('y', (S.P[1] + W[1]) / 2 - 10); }
  function arco(S, b) {
    var r = 70, c = S.U, p = [];
    for (var k = 0; k <= 12; k++) { var f = b * k / 12 * RAD; p.push((k ? 'L' : 'M') + (c[0] - r * Math.cos(f)).toFixed(1) + ' ' + (c[1] - r * Math.sin(f)).toFixed(1)); }
    S.arco.setAttribute('d', p.join(''));
    S.tb.setAttribute('x', c[0] - r - 6); S.tb.setAttribute('y', c[1] - 4);
    D.ponerTexto(S.tb, b > 20 ? 'β_{2B} = 27°' : 'β_2 = ' + n(b, 0) + '°');
  }

  /* La velocidad específica y la forma del impulsor. */
  var FORMAS = [
    { nq: 10.5, rot: 'Radial angosto', s: [[0, 35], [20, 35], [28, 50], [30, 95]], h: [[0, 12], [30, 12], [38, 40], [37, 95]], sal: [[33.5, 95], [33.5, 112]] },
    { nq: 75, rot: 'Radial ancho', s: [[0, 50], [20, 50], [30, 65], [32, 95]], h: [[0, 12], [40, 12], [50, 40], [52, 95]], sal: [[42, 95], [42, 112]] },
    { nq: 130, rot: 'Semiaxial', s: [[0, 58], [25, 60], [45, 72], [58, 92]], h: [[0, 14], [35, 16], [62, 34], [84, 60]], sal: [[71, 76], [83, 88]] },
    { nq: 260, rot: 'Axial (hélice)', s: [[0, 80], [30, 80], [60, 80], [85, 80]], h: [[0, 38], [30, 38], [60, 38], [85, 38]], sal: [[85, 59], [100, 59]], alabes: true }
  ];
  function Xq(q) { return 64 + 270 * Math.log10(q / 5); }
  ZB.animacion('nq', {
    vista: [0, 0, 640, 345],
    alt: 'Una escala logarítmica de la velocidad específica de 5 a 500 con la sección de cuatro impulsores: radial angosto, radial ancho, semiaxial y axial. La bomba del caso tiene n_q = 17,3.',
    montar: function (svg) {
      var S = {}, ya = 236;
      s('line', { x1: Xq(5), x2: Xq(500), y1: ya, y2: ya, stroke: K.tinta, 'stroke-width': 1.5 }, svg);
      [5, 10, 20, 50, 100, 200, 500].forEach(function (q) {
        s('line', { x1: Xq(q), x2: Xq(q), y1: ya, y2: ya + 6, stroke: K.tinta, 'stroke-width': 1.3 }, svg);
        D.t(svg, Xq(q), ya + 21, String(q), { tam: 12.5, ancla: 'middle', color: K.tinta2 });
      });
      D.t(svg, Xq(500), ya - 8, 'n_q', { tam: 14, peso: 700, ancla: 'end', it: true });
      S.formas = FORMAS.map(function (f) {
        var gg = s('g', { opacity: 0 }, svg), sc = 0.7, x0 = Xq(f.nq) - 35, b = 214;
        var P = function (p) { return (x0 + sc * p[0]).toFixed(1) + ' ' + (b - sc * p[1]).toFixed(1); };
        s('line', { x1: x0 - 4, x2: x0 + 74, y1: b, y2: b, stroke: K.tinta2, 'stroke-width': 1, 'stroke-dasharray': '8 3 2 3' }, gg);
        s('path', { d: 'M' + P(f.s[0]) + 'C' + P(f.s[1]) + ' ' + P(f.s[2]) + ' ' + P(f.s[3]) + 'L' + P(f.h[3]) + 'C' + P(f.h[2]) + ' ' + P(f.h[1]) + ' ' + P(f.h[0]) + 'Z', fill: K.aguaM }, gg);
        [f.s, f.h].forEach(function (c) { s('path', { d: 'M' + P(c[0]) + 'C' + P(c[1]) + ' ' + P(c[2]) + ' ' + P(c[3]), fill: 'none', stroke: K.metalO, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, gg); });
        if (f.alabes) [38, 52].forEach(function (x) { s('line', { x1: x0 + sc * x, y1: b - sc * 40, x2: x0 + sc * (x + 10), y2: b - sc * 78, stroke: K.metalO, 'stroke-width': 2.5 }, gg); });
        var e0 = f.sal[0], e1 = f.sal[1];
        D.flecha(gg, x0 + sc * e0[0], b - sc * e0[1], x0 + sc * e1[0], b - sc * e1[1], { color: K.flujo, ancho: 2.2, punta: 8 });
        D.flecha(gg, x0 - 16, b - sc * (f.s[0][1] + f.h[0][1]) / 2, x0 - 2, b - sc * (f.s[0][1] + f.h[0][1]) / 2, { color: K.flujo, ancho: 2.2, punta: 8 });
        D.t(gg, Xq(f.nq), f.nq === 75 ? 102 : 118, f.rot, { tam: 13, peso: 650, ancla: 'middle' });
        return gg;
      });
      S.rangos = [['Radiales: hasta unos 100', 7, 100, 276], ['Semiaxiales: 35 a 160', 35, 160, 300], ['Axiales: 160 a 400', 160, 400, 276]].map(function (r) {
        var gg = s('g', { opacity: 0 }, svg);
        s('path', { d: 'M' + Xq(r[1]) + ' ' + (r[3] - 6) + 'V' + r[3] + 'H' + Xq(r[2]) + 'V' + (r[3] - 6), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.3 }, gg);
        D.t(gg, (Xq(r[1]) + Xq(r[2])) / 2, r[3] + 15, r[0], { tam: 12, ancla: 'middle', color: K.tinta2 });
        return gg;
      });
      S.caso = s('g', { opacity: 0 }, svg);
      s('line', { x1: Xq(17.3), x2: Xq(17.3), y1: ya - 6, y2: 60, stroke: K.oliva, 'stroke-width': 1.5, 'stroke-dasharray': '4 3' }, S.caso);
      D.punto(S.caso, Xq(17.3), ya, { r: 6 });
      D.t(S.caso, Xq(17.3) + 8, 56, 'Bomba del caso: n_q = 17,3', { tam: 13.5, peso: 700, color: K.olivaOsc });
      S.banda = s('g', { opacity: 0 }, svg);
      s('rect', { x: Xq(40), y: ya - 4, width: Xq(50) - Xq(40), height: 8, fill: K.oliva }, S.banda);
      s('line', { x1: (Xq(40) + Xq(50)) / 2, x2: (Xq(40) + Xq(50)) / 2, y1: ya - 6, y2: 92, stroke: K.oliva, 'stroke-width': 1.2 }, S.banda);
      D.t(S.banda, (Xq(40) + Xq(50)) / 2 - 4, 86, 'Máxima eficiencia de las radiales: 40 a 50', { tam: 12.5, peso: 650, color: K.olivaOsc, ancla: 'start', halo: K.papel });
      return S;
    },
    pasos: [
      { texto: 'Con el mejor punto de la bomba del caso, 25,3 m³/h y 17,3 m a 1750 r/min, $n_q = 1750\\sqrt{25,3/3600}/17,3^{0,75}$ = 17,3.', dur: 1.4, ir: function (S, t) { D.ver(S.caso, t); } },
      { texto: 'Un $n_q$ bajo pide mucha cabeza con poco caudal: impulsor radial, grande y angosto, con el ojo chico frente al diámetro exterior. Así es el del caso.', dur: 1.4, ir: function (S, t) { D.ver(S.formas[0], t); } },
      { texto: 'Al subir $n_q$ el impulsor se ensancha y el ojo crece. Un impulsor radial llega hasta $n_q$ de unos 100.', dur: 1.4, ir: function (S, t) { D.ver(S.formas[1], t); D.ver(S.rangos[0], t); } },
      { texto: 'Más arriba el flujo sale inclinado: son los impulsores semiaxiales, de flujo mixto, entre 35 y 160.', dur: 1.4, ir: function (S, t) { D.ver(S.formas[2], t); D.ver(S.rangos[1], t); } },
      { texto: 'Entre 160 y 400 el flujo sale axial: es la bomba de hélice, de mucho caudal y poca cabeza.', dur: 1.4, ir: function (S, t) { D.ver(S.formas[3], t); D.ver(S.rangos[2], t); } },
      { texto: 'Las radiales de una etapa tienen su mejor eficiencia cerca de $n_q$ = 40 a 50. La bomba del caso, con 17,3, está donde la eficiencia cae rápido.', dur: 1.4, ir: function (S, t) { D.ver(S.banda, t); } }
    ]
  });

  /* Reto: del impulsor a la cabeza. */
})();

/* 11-05-curvas.js: se escribe en interactivo/bombas/secciones/ y se trae con node interactivo/al-libro.mjs. No se edita aquí. */
/* 11.5 Las curvas características: tres animaciones y el reto. Las curvas salen de la carta del modelo
   (CARTA_BOMBA), con ZB.dib.carta(d, q, i): i = 0 cabeza, 1 eficiencia, 2 potencia al eje, 3 NPSH3. */
(function () {
  'use strict';
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, T = ZB.tramo;
  var CB = window.CARTA_BOMBA, g = 9.81;
  var DS = ['152', '165', '178', '190', '203'];
  var qB = CB.D['190'].qB, qFin = D.cartaFin('190');

  // Ejes sin rótulos en x, para las gráficas apiladas que comparten el caudal.
  function panel(svg, o) {
    var gg = s('g', {}, svg);
    var X = function (v) { return o.x + (v - o.xmin) / (o.xmax - o.xmin) * o.w; };
    var Y = function (v) { return o.y + o.h - (v - o.ymin) / (o.ymax - o.ymin) * o.h; };
    (o.yt || []).forEach(function (v) {
      s('line', { x1: o.x, x2: o.x + o.w, y1: Y(v), y2: Y(v), stroke: K.rejilla, 'stroke-width': 1 }, gg);
      D.t(gg, o.x - 6, Y(v) + 4, n(v, o.dy || 0), { tam: 11.5, ancla: 'end', color: K.tinta2 });
    });
    (o.xt || []).forEach(function (v) {
      s('line', { x1: X(v), x2: X(v), y1: o.y, y2: o.y + o.h, stroke: K.rejilla, 'stroke-width': 1 }, gg);
      if (o.rotX) D.t(gg, X(v), o.y + o.h + 15, n(v, 0), { tam: 11.5, ancla: 'middle', color: K.tinta2 });
    });
    s('path', { d: 'M' + o.x + ' ' + o.y + 'V' + (o.y + o.h) + 'H' + (o.x + o.w), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, gg);
    if (o.yr) D.t(gg, o.x + 6, o.y + 12, o.yr, { tam: 12.5, peso: 650, halo: true });
    if (o.xr) D.t(gg, o.x + o.w, o.y + o.h + 32, o.xr, { tam: 12.5, peso: 600, ancla: 'end' });
    return { X: X, Y: Y };
  }
  function rombo(padre, x, y, r) {
    return s('path', { d: 'M' + x + ' ' + (y - r) + 'L' + (x + r) + ' ' + y + 'L' + x + ' ' + (y + r) + 'L' + (x - r) + ' ' + y + 'Z', fill: K.caso, stroke: K.tinta, 'stroke-width': 1.5 }, padre);
  }

  /* El banco de pruebas: la válvula de descarga se abre y deja los puntos de la curva de 190 mm. */
  var QS = [0, 10, 20, qB, qFin];
  ZB.animacion('banco', {
    vista: [0, 0, 640, 410],
    alt: 'Un banco de pruebas con tanque, bomba, medidor de caudal y válvula de descarga. La válvula se abre por pasos y deja los puntos de cabeza, eficiencia y potencia de la curva de 190 mm, del caudal cero al final de la curva.',
    montar: function (svg) {
      var S = {};
      // tanque
      s('rect', { x: 18, y: 250, width: 80, height: 100, fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.6 }, svg);
      s('rect', { x: 19.5, y: 272, width: 77, height: 76.5, fill: K.agua }, svg);
      D.t(svg, 58, 368, 'Tanque', { tam: 12, ancla: 'middle', color: K.tinta2 });
      // tuberías: succión, columna de descarga, tramo de arriba y retorno al tanque
      var tubo = 'M98 330H145 M165 310V110H58V250';
      s('path', { d: tubo, fill: 'none', stroke: K.tinta, 'stroke-width': 10, 'stroke-linejoin': 'round' }, svg);
      s('path', { d: tubo, fill: 'none', stroke: K.agua, 'stroke-width': 6.5, 'stroke-linejoin': 'round' }, svg);
      // bomba
      s('circle', { cx: 165, cy: 330, r: 21, fill: K.metalM, stroke: K.tinta, 'stroke-width': 1.6 }, svg);
      S.imp = s('g', {}, svg);
      for (var k = 0; k < 6; k++) {
        var a = k * Math.PI / 3;
        s('path', { d: 'M0 0Q' + (8 * Math.cos(a + 0.5)).toFixed(1) + ' ' + (8 * Math.sin(a + 0.5)).toFixed(1) + ' ' + (14 * Math.cos(a)).toFixed(1) + ' ' + (14 * Math.sin(a)).toFixed(1), fill: 'none', stroke: K.tinta, 'stroke-width': 1.5 }, S.imp);
      }
      D.t(svg, 196, 352, 'Bomba', { tam: 12, color: K.tinta2 });
      // medidor de caudal en la columna
      s('rect', { x: 153, y: 186, width: 24, height: 34, fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.5, rx: 3 }, svg);
      D.t(svg, 165, 208, 'Q', { tam: 13, peso: 700, ancla: 'middle', it: true });
      D.t(svg, 184, 207, 'Medidor', { tam: 12, color: K.tinta2 });
      // manómetro de descarga
      s('line', { x1: 170, x2: 192, y1: 268, y2: 268, stroke: K.tinta, 'stroke-width': 2 }, svg);
      S.man = D.manometro(svg, 206, 268, 14, 300, { paso: 100, lectura: false });
      // válvula de descarga en el tramo de arriba
      s('path', { d: 'M98 98L98 122L122 110Z M122 110L146 98L146 122Z', fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, svg);
      S.vastago = s('line', { x1: 122, x2: 122, y1: 110, y2: 80, stroke: K.tinta, 'stroke-width': 2 }, svg);
      S.volante = s('rect', { x: 108, y: 76, width: 28, height: 6, rx: 3, fill: K.metalO, stroke: K.tinta, 'stroke-width': 1.2 }, svg);
      D.t(svg, 122, 28, 'Válvula de descarga', { tam: 12, ancla: 'middle', color: K.tinta2 });
      S.abre = D.t(svg, 122, 44, 'cerrada', { tam: 12, peso: 650, ancla: 'middle' });
      // lectura
      S.lec = D.t(svg, 18, 398, '', { tam: 13, peso: 650 });
      // las tres gráficas
      var x0 = 318, w = 290;
      S.PH = panel(svg, { x: x0, y: 22, w: w, h: 110, xmin: 0, xmax: 36, ymin: 0, ymax: 24, yt: [0, 8, 16, 24], xt: [0, 10, 20, 30], yr: 'H (m)' });
      S.PE = panel(svg, { x: x0, y: 158, w: w, h: 80, xmin: 0, xmax: 36, ymin: 0, ymax: 80, yt: [0, 40, 80], xt: [0, 10, 20, 30], yr: 'η (%)' });
      S.PP = panel(svg, { x: x0, y: 264, w: w, h: 80, xmin: 0, xmax: 36, ymin: 0, ymax: 2.4, yt: [0, 1.2, 2.4], xt: [0, 10, 20, 30], yr: 'P al eje (kW)', dy: 1, rotX: true, xr: 'Q (m³/h)' });
      S.cH = D.trazo(svg, D.camino(D.cartaPts('190', 0), S.PH.X, S.PH.Y), { color: K.serie[0], ancho: 2.6 });
      S.cE = D.trazo(svg, D.camino(D.cartaPts('190', 1).map(function (p) { return [p[0], 100 * p[1]]; }), S.PE.X, S.PE.Y), { color: K.serie[1], ancho: 2.6 });
      S.cP = D.trazo(svg, D.camino(D.cartaPts('190', 2), S.PP.X, S.PP.Y), { color: K.serie[2], ancho: 2.6 });
      S.pts = QS.map(function () {
        return [D.punto(svg, 0, 0, { r: 5 }), D.punto(svg, 0, 0, { r: 5 }), D.punto(svg, 0, 0, { r: 5 })].map(function (c) { c.setAttribute('opacity', 0); return c; });
      });
      S.rBEP = D.t(svg, S.PE.X(qB), S.PE.Y(72.3) - 12, 'BEP', { tam: 12.5, peso: 700, ancla: 'middle', color: K.olivaOsc, halo: true });
      S.rFin = D.t(svg, S.PH.X(qFin) - 4, S.PH.Y(D.carta('190', qFin, 0)) + 22, 'final de la curva', { tam: 12, peso: 650, ancla: 'end', halo: true });
      [S.rBEP, S.rFin].forEach(function (x) { x.setAttribute('opacity', 0); });
      return S;
    },
    pasos: [0, 1, 2, 3, 4].map(function (k) {
      var textos = [
        'Con la válvula de descarga cerrada, el caudal es cero: la bomba da 20,1 m, pide 0,72 kW y su eficiencia es cero, porque no entrega nada.',
        'Se abre la válvula hasta 10 m³/h: 19,8 m, 48 % y 1,12 kW. Cada abertura deja un punto en las tres gráficas.',
        'A 20 m³/h: 18,6 m, 69 % y 1,47 kW. La cabeza empieza a bajar más rápido.',
        'En 25,3 m³/h la eficiencia llega a su máximo, 72,3 %, con 17,3 m: es el punto de mejor eficiencia, el BEP.',
        'A 32,8 m³/h, el 130 % del caudal del BEP, termina la curva que publica el fabricante.'
      ];
      return { texto: textos[k], dur: k ? 2 : 1.2, ir: function (S, t) { mover(S, k, t); } };
    }).concat([
      { texto: 'Por los puntos pasan las curvas de cabeza, eficiencia y potencia al eje del impulsor de 190 mm: es lo que publica el catálogo.', dur: 1.8, ir: function (S, t) { S.cH.dibujar(t); S.cE.dibujar(t); S.cP.dibujar(t); } }
    ])
  });
  function mover(S, k, t) {
    var q = k ? ZB.lerp(QS[k - 1], QS[k], t) : 0;
    var H = D.carta('190', q, 0), e = D.carta('190', q, 1), P = D.carta('190', q, 2);
    var p = S.pts[k];
    [[S.PH, H], [S.PE, 100 * e], [S.PP, P]].forEach(function (z, i) {
      p[i].setAttribute('cx', z[0].X(q)); p[i].setAttribute('cy', z[0].Y(z[1])); p[i].setAttribute('opacity', 1);
    });
    var f = q / qFin;
    S.volante.setAttribute('y', 76 - 18 * f); S.vastago.setAttribute('y2', 80 - 18 * f);
    D.ponerTexto(S.abre, f <= 0 ? 'cerrada' : 'abierta ' + n(100 * f, 0) + ' % del recorrido');
    S.imp.setAttribute('transform', 'translate(165 330) rotate(' + (k * 180 + t * 180) + ')');
    S.man.poner(997 * g * H / 1000 * 1.0, '');
    D.ponerTexto(S.lec, 'Q = ' + n(q, 1) + ' m³/h · H = ' + n(H, 1) + ' m · η = ' + n(100 * e, 0) + ' % · P = ' + n(P, 2) + ' kW');
    if (k === 3) D.ver(S.rBEP, T(t, 0.7, 1));
    if (k === 4) D.ver(S.rFin, T(t, 0.7, 1));
  }

  /* La carta con los cinco impulsores y las islas de eficiencia. */
  function cruces(d, L) {
    var fin = D.cartaFin(d), izq = null, der = null, prev = D.carta(d, 0, 1);
    for (var q = 0.1; q <= fin + 1e-9; q += 0.1) {
      var e = D.carta(d, q, 1);
      if (izq == null && prev < L && e >= L) izq = q - 0.1 + 0.1 * (L - prev) / (e - prev);
      if (izq != null && der == null && prev >= L && e < L) der = q - 0.1 + 0.1 * (prev - L) / (prev - e);
      prev = e;
    }
    return { izq: izq, der: der };
  }
  ZB.animacion('carta', {
    vista: [0, 0, 640, 350],
    alt: 'La carta de la carcasa 2×3‑8 a 1750 r/min: las curvas de cabeza de los impulsores de 152, 165, 178, 190 y 203 mm, las islas de eficiencia de 60, 65 y 70 %, el mejor punto de cada impulsor y el punto de operación del caso.',
    montar: function (svg) {
      var S = {};
      var E = D.ejes(svg, { x: 64, y: 26, w: 440, h: 270, xmin: 0, xmax: 40, ymin: 0, ymax: 26, xt: [0, 10, 20, 30, 40], yt: [0, 5, 10, 15, 20, 25], xr: 'Q (m³/h)', yr: 'H (m)' });
      S.E = E;
      S.curvas = DS.map(function (d) {
        var tr = D.trazo(svg, D.camino(D.cartaPts(d, 0), E.X, E.Y), { color: d === '190' ? K.tinta : K.tinta2, ancho: d === '190' ? 3 : 2 });
        var fin = D.cartaFin(d), r = D.t(svg, E.X(fin) + 6, E.Y(D.carta(d, fin, 0)) + 4, d + ' mm', { tam: 12.5, peso: d === '190' ? 750 : 600 });
        r.setAttribute('opacity', 0);
        return { tr: tr, r: r };
      });
      S.islas = [0.65, 0.70].map(function (L, i) {
        var izq = [], der = [];
        DS.slice().reverse().forEach(function (d) { var c = cruces(d, L); if (c.izq != null) izq.push([c.izq, D.carta(d, c.izq, 0)]); });
        DS.forEach(function (d) { var c = cruces(d, L); if (c.izq != null && c.der != null) der.push([c.der, D.carta(d, c.der, 0)]); });
        var gg = s('g', { opacity: 0 }, svg);
        var pts = izq.concat(der);
        s('path', { d: D.camino(pts, E.X, E.Y), fill: 'none', stroke: K.serie[1], 'stroke-width': 1.8, 'stroke-dasharray': i === 1 ? 'none' : '5 4' }, gg);
        var p0 = izq[0];
        D.t(gg, E.X(p0[0]) + (i ? 6 : -6), E.Y(p0[1]) - 6, n(L * 100, 0) + ' %', { tam: 12.5, peso: 700, ancla: i ? 'start' : 'end', color: K.olivaOsc, halo: true });
        return gg;
      });
      S.bep = s('g', { opacity: 0 }, svg);
      DS.forEach(function (d) { rombo(S.bep, E.X(CB.D[d].qB), E.Y(CB.D[d].hB), 5.5); });
      D.t(S.bep, 548, 40, 'BEP de cada impulsor', { tam: 12, color: K.tinta2, ancla: 'end' });
      rombo(S.bep, 558, 36, 5);
      S.caso = s('g', { opacity: 0 }, svg);
      D.punto(S.caso, E.X(27.3), E.Y(16.56), { r: 6.5, color: K.blanco });
      s('circle', { cx: E.X(27.3), cy: E.Y(16.56), r: 2.5, fill: K.tinta }, S.caso);
      s('line', { x1: E.X(27.3) + 6, y1: E.Y(16.56) - 5, x2: 548, y2: 112, stroke: K.tinta, 'stroke-width': 1 }, S.caso);
      D.t(S.caso, 636, 92, 'Punto del caso', { tam: 12.5, peso: 750, ancla: 'end' });
      D.t(S.caso, 636, 108, '27,3 m³/h, 16,6 m', { tam: 12, ancla: 'end' });
      D.t(S.caso, 636, 124, 'η = 71,6 %', { tam: 12, ancla: 'end' });
      return S;
    },
    pasos: [
      { texto: 'La carta pone en un mismo eje la curva de cabeza de cada impulsor que cabe en la carcasa 2×3‑8, entre 152 y 203 mm, a 1750 r/min.', dur: 2.6, ir: function (S, t) {
        S.curvas.forEach(function (c, i) { var f = T(t, i * 0.16, i * 0.16 + 0.36); c.tr.dibujar(f); D.ver(c.r, T(f, 0.7, 1)); });
      } },
      { texto: 'Las islas unen los puntos de igual eficiencia, aquí los de 65 y 70 %. La bomba rinde más hacia el centro de las islas.', dur: 2, ir: function (S, t) { S.islas.forEach(function (x, i) { D.ver(x, T(t, i * 0.4, i * 0.4 + 0.6)); }); } },
      { texto: 'El rombo de cada curva es su BEP. El impulsor más grande da más cabeza y llega a una eficiencia un poco mayor: 63,7 % con 152 mm y 73,5 % con 203 mm.', dur: 1.4, ir: function (S, t) { D.ver(S.bep, t); } },
      { texto: 'La bomba del caso lleva el impulsor de 190 mm. Su punto de operación, 27,3 m³/h y 16,6 m, cae dentro de la isla de 70 %, con 71,6 %.', dur: 1.4, ir: function (S, t) { D.ver(S.caso, t); } }
    ]
  });

  /* La ventana de operación: recirculación a la izquierda, cavitación a la derecha. */
  ZB.animacion('ventana', {
    vista: [0, 0, 640, 330],
    alt: 'La curva de 190 mm con su BEP en 25,3 m³/h, la ventana de 70 a 110 % del caudal del BEP, la zona de recirculación a la izquierda, la zona en que sube el NPSH requerido a la derecha y el punto de operación del caso en el 108 %.',
    montar: function (svg) {
      var S = {}, y0 = 34, h = 200;
      var E = D.ejes(svg, { x: 64, y: y0, w: 530, h: h, xmin: 0, xmax: 36, ymin: 0, ymax: 24, xt: [0, 5, 10, 15, 20, 25, 30, 35], yt: [0, 6, 12, 18, 24], xr: 'Q (m³/h)', yr: 'H (m)' });
      S.E = E;
      var zona = function (q1, q2, color, op) { return s('rect', { x: E.X(q1), y: y0, width: E.X(q2) - E.X(q1), height: h, fill: color, opacity: 0, 'data-op': op }, svg); };
      S.rec1 = zona(0, 0.4 * qB, K.caliente, 0.55);
      S.rec2 = zona(0.4 * qB, 0.75 * qB, K.caliente, 0.28);
      S.ven = zona(0.7 * qB, 1.1 * qB, K.amarilloClaro, 1);
      S.der = zona(1.1 * qB, 36, K.fuera, 0.13);
      // la curva encima de las zonas
      S.curva = D.trazo(svg, D.camino(D.cartaPts('190', 0), E.X, E.Y), { color: K.tinta, ancho: 3 });
      S.bep = s('g', { opacity: 0 }, svg);
      rombo(S.bep, E.X(qB), E.Y(CB.D['190'].hB), 6);
      D.t(S.bep, E.X(qB) - 8, E.Y(CB.D['190'].hB) - 12, 'BEP', { tam: 12.5, peso: 700, ancla: 'end', halo: true });
      S.rv = s('g', { opacity: 0 }, svg);
      D.t(S.rv, E.X(qB * 0.9), y0 + 150, 'Ventana', { tam: 13, peso: 700, ancla: 'middle', color: K.olivaOsc });
      D.t(S.rv, E.X(qB * 0.9), y0 + 166, '17,7 a 27,8 m³/h', { tam: 12, ancla: 'middle', color: K.olivaOsc });
      S.rr = s('g', { opacity: 0 }, svg);
      D.t(S.rr, E.X(0.3 * qB), y0 + 150, 'Recirculación', { tam: 13, peso: 700, ancla: 'middle', color: K.calienteO });
      D.t(S.rr, E.X(0.3 * qB), y0 + 166, 'empieza entre 40 y 75 %', { tam: 12, ancla: 'middle', color: K.calienteO });
      S.rd = s('g', { opacity: 0 }, svg);
      s('line', { x1: E.X(qFin), x2: E.X(qFin), y1: y0, y2: y0 + h, stroke: K.tinta, 'stroke-width': 1.4, 'stroke-dasharray': '5 4' }, S.rd);
      D.t(S.rd, E.X(1.1 * qB) + 6, y0 + 18, 'Sube el NPSH3:', { tam: 12.5, peso: 700, color: K.alerta, halo: true });
      D.t(S.rd, E.X(1.1 * qB) + 6, y0 + 34, 'cavitación', { tam: 12.5, peso: 700, color: K.alerta, halo: true });
      D.t(S.rd, E.X(qFin) - 4, y0 + h - 8, 'final de la curva', { tam: 12, ancla: 'end', halo: true });
      // la escala en porcentaje del BEP
      S.pct = s('g', { opacity: 0 }, svg);
      D.t(S.pct, 4, 308, '% del BEP', { tam: 12, peso: 650, color: K.tinta2 });
      [40, 70, 100, 110, 130].forEach(function (p) {
        var x = E.X(p / 100 * qB);
        s('line', { x1: x, x2: x, y1: 288, y2: 294, stroke: K.tinta2, 'stroke-width': 1.2 }, S.pct);
        D.t(S.pct, x, 308, p + ' %', { tam: 12, ancla: 'middle', color: K.tinta2 });
      });
      s('line', { x1: E.X(0), x2: E.X(36), y1: 288, y2: 288, stroke: K.tinta2, 'stroke-width': 1 }, S.pct);
      S.caso = s('g', { opacity: 0 }, svg);
      D.punto(S.caso, E.X(27.3), E.Y(16.56), { r: 6.5 });
      D.t(S.caso, E.X(27.3) - 10, E.Y(16.56) + 26, 'Caso: 108 %', { tam: 12.5, peso: 700, ancla: 'end', halo: true });
      return S;
    },
    pasos: [
      { texto: 'La curva de 190 mm y su mejor punto: 25,3 m³/h y 17,3 m. Debajo, los caudales como porcentaje del caudal del BEP.', dur: 1.8, ir: function (S, t) { S.curva.dibujar(t); D.ver(S.bep, T(t, 0.7, 1)); D.ver(S.pct, T(t, 0.5, 1)); } },
      { texto: 'La ventana de 70 a 110 % del caudal del BEP cubre los caudales entre 17,7 y 27,8 m³/h. Ahí se escoge el punto de operación.', dur: 1.4, ir: function (S, t) { zonaVer(S.ven, t); D.ver(S.rv, t); } },
      { texto: 'Por debajo de entre 40 y 75 % del BEP empieza la recirculación: remolinos en el ojo y en la salida que calientan el líquido, hacen vibrar la bomba y pueden cavitar.', dur: 1.8, ir: function (S, t) { zonaVer(S.rec1, t); zonaVer(S.rec2, t); D.ver(S.rr, t); } },
      { texto: 'A la derecha de la ventana sube el NPSH requerido y llega la cavitación. La curva publicada termina en 32,8 m³/h, el 130 %.', dur: 1.8, ir: function (S, t) { zonaVer(S.der, t); D.ver(S.rd, t); } },
      { texto: 'El punto de operación del caso, 27,3 m³/h y 16,6 m, está en el 108 % del BEP: dentro de la ventana, cerca de su borde derecho.', dur: 1.4, ir: function (S, t) { D.ver(S.caso, t); } }
    ]
  });
  function zonaVer(r, t) { r.setAttribute('opacity', t * parseFloat(r.getAttribute('data-op'))); }

  /* La carta como imagen para el reto: las curvas de H de los cinco impulsores y las de η y P del escogido. */
  function cartaSVG(dSel, q) {
    var W = 600, x0 = 56, w = 520, X = function (v) { return x0 + v / 36 * w; };
    var paneles = [
      { y: 18, h: 170, max: 24, paso: 1, rot: 2, nom: 'H (m)', i: 0, f: 1, dec: 0 },
      { y: 222, h: 110, max: 80, paso: 5, rot: 20, nom: 'η (%)', i: 1, f: 100, dec: 0 },
      { y: 366, h: 100, max: 2.4, paso: 0.1, rot: 0.4, nom: 'P al eje (kW)', i: 2, f: 1, dec: 1 }
    ];
    var o = '<svg viewBox="0 0 ' + W + ' 500" role="img" aria-label="Carta de la bomba: cabeza de los cinco impulsores; eficiencia y potencia al eje del impulsor de ' + dSel + ' mm; una línea vertical marca ' + q + ' m³/h.">';
    var txt = function (x, y, t, a, extra) { return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" font-size="12" text-anchor="' + (a || 'start') + '" fill="' + K.tinta2 + '"' + (extra || '') + '>' + t + '</text>'; };
    paneles.forEach(function (p, k) {
      var Y = function (v) { return p.y + p.h - v / p.max * p.h; };
      for (var v = 0; v <= p.max + 1e-9; v += p.paso) {
        var mayor = Math.abs(v / p.rot - Math.round(v / p.rot)) < 1e-6;
        o += '<line x1="' + x0 + '" x2="' + (x0 + w) + '" y1="' + Y(v).toFixed(1) + '" y2="' + Y(v).toFixed(1) + '" stroke="' + (mayor ? K.borde : K.rejilla) + '" stroke-width="1"/>';
        if (mayor) o += txt(x0 - 6, Y(v) + 4, n(v, p.dec), 'end');
      }
      for (var qq = 0; qq <= 36; qq += 1) {
        var may = qq % 4 === 0;
        o += '<line x1="' + X(qq).toFixed(1) + '" x2="' + X(qq).toFixed(1) + '" y1="' + p.y + '" y2="' + (p.y + p.h) + '" stroke="' + (may ? K.borde : K.rejilla) + '" stroke-width="1"/>';
        if (may && k === 2) o += txt(X(qq), p.y + p.h + 16, String(qq), 'middle');
      }
      o += '<path d="M' + x0 + ' ' + p.y + 'V' + (p.y + p.h) + 'H' + (x0 + w) + '" fill="none" stroke="' + K.tinta2 + '" stroke-width="1.2"/>';
      o += '<text x="' + (x0 + 6) + '" y="' + (p.y + 13) + '" font-size="12.5" font-weight="650" fill="' + K.tinta + '" style="paint-order:stroke;stroke:' + K.papel + ';stroke-width:4px">' + p.nom + '</text>';
      var lista = k === 0 ? DS : [dSel];
      lista.forEach(function (d) {
        var pts = D.cartaPts(d, p.i).map(function (z) { return X(z[0]).toFixed(1) + ' ' + Y(z[1] * p.f).toFixed(1); });
        var sel = d === dSel;
        o += '<path d="M' + pts.join('L') + '" fill="none" stroke="' + (sel ? K.serie[k] : K.ref) + '" stroke-width="' + (sel ? 2.4 : 1.4) + '"/>';
        if (k === 0) { var fin = D.cartaFin(d); o += '<text x="' + (X(fin) + 4).toFixed(1) + '" y="' + (Y(D.carta(d, fin, 0)) + 4).toFixed(1) + '" font-size="11.5" font-weight="' + (sel ? 750 : 500) + '" fill="' + (sel ? K.tinta : K.tinta2) + '">' + d + '</text>'; }
      });
    });
    o += '<line x1="' + X(q).toFixed(1) + '" x2="' + X(q).toFixed(1) + '" y1="14" y2="466" stroke="' + K.oliva + '" stroke-width="1.6" stroke-dasharray="5 4"/>';
    o += txt(x0 + w, 494, 'Q (m³/h)', 'end', ' font-weight="600"');
    return '<div class="carta-reto">' + o + '</svg></div>';
  }

  /* Reto: leer la carta, la ventana de operación y la descarga cerrada. */
})();

/* 11-06-punto.js: se escribe en interactivo/bombas/secciones/ y se trae con node interactivo/al-libro.mjs. No se edita aquí. */
/* 11.6 La curva del sistema y el punto de operación: tres animaciones y el reto. */
(function () {
  'use strict';
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, T = ZB.tramo;
  var g = 9.81;
  var H190 = function (q) { return D.carta('190', q, 0); };
  var H178 = function (q) { return D.carta('178', q, 0); };
  var sis = function (q) { return 10 + 5.5 * Math.pow(q / 25, 2); };
  function bis(f, a, b) { for (var i = 0; i < 60; i++) { var m = (a + b) / 2; if (f(a) * f(m) <= 0) b = m; else a = m; } return (a + b) / 2; }
  function pts(f, a, b, paso) { var o = []; for (var q = a; q <= b + 1e-9; q += paso || 0.5) o.push([q, f(q)]); return o; }
  // Ejes comunes del caso: caudal de 0 a 35 m³/h, cabeza de 0 a 24 m.
  function ejesCaso(svg) {
    return D.ejes(svg, { x: 64, y: 34, w: 540, h: 250, xmin: 0, xmax: 35, ymin: 0, ymax: 24, xt: [0, 5, 10, 15, 20, 25, 30, 35], yt: [0, 4, 8, 12, 16, 20, 24], xr: 'Caudal, Q (m³/h)', yr: 'Cabeza (m)' });
  }
  function guia(padre, E, q, h) {
    var gg = s('g', {}, padre);
    s('path', { d: 'M' + E.X(q) + ' ' + E.Y(0) + 'V' + E.Y(h) + 'H' + E.X(0), fill: 'none', stroke: K.tinta, 'stroke-width': 1, 'stroke-dasharray': '4 4' }, gg);
    return gg;
  }
  var QOP = bis(function (q) { return H190(q) - sis(q); }, 0, 40), HOP = sis(QOP);

  /* La curva del sistema del caso, pieza por pieza, y por qué el cruce es estable. */
  ZB.animacion('curva-sistema', {
    vista: [0, 0, 640, 330],
    alt: 'La curva del sistema del caso: 10 m de cabeza estática y una dinámica que crece con el cuadrado del caudal; la curva de la bomba de 190 mm la cruza en 27,3 m³/h y 16,6 m.',
    montar: function (svg) {
      var S = {}, E = S.E = ejesCaso(svg);
      S.banda = s('rect', { x: E.X(0), y: E.Y(10), width: E.X(35) - E.X(0), height: E.Y(0) - E.Y(10), fill: K.zona, opacity: 0 }, svg);
      S.est = s('line', { x1: E.X(0), x2: E.X(35), y1: E.Y(10), y2: E.Y(10), stroke: K.tinta2, 'stroke-width': 1.6, 'stroke-dasharray': '6 4', opacity: 0 }, svg);
      S.tEst = D.t(svg, E.X(1), E.Y(10) + 18, 'Cabeza estática: 10 m', { tam: 13, peso: 650, color: K.tinta2 });
      S.sis = D.trazo(svg, D.camino(pts(sis, 0, 35), E.X, E.Y), { color: K.serie[0], ancho: 2.6 });
      S.din = s('g', { opacity: 0 }, svg);
      s('line', { x1: E.X(25), x2: E.X(25), y1: E.Y(10), y2: E.Y(15.5), stroke: K.serie[0], 'stroke-width': 2 }, S.din);
      s('line', { x1: E.X(25) - 5, x2: E.X(25) + 5, y1: E.Y(10), y2: E.Y(10), stroke: K.serie[0], 'stroke-width': 2 }, S.din);
      D.t(S.din, E.X(25) - 6, E.Y(11.0), 'dinámica: 5,5 m', { tam: 12.5, peso: 600, color: K.serie[0], ancla: 'end', halo: true });
      D.t(S.din, E.X(34.8), E.Y(sis(34.8)) + 22, 'Sistema', { tam: 13, peso: 700, color: K.serie[0], ancla: 'end', halo: true });
      S.bom = D.trazo(svg, D.camino(pts(H190, 0, D.cartaFin('190')), E.X, E.Y), { color: K.tinta, ancho: 2.8 });
      S.tBom = D.t(svg, E.X(3), E.Y(20.06) - 10, 'Bomba, 190 mm', { tam: 13, peso: 700 });
      S.guia = guia(svg, E, QOP, HOP);
      S.pto = D.punto(svg, E.X(QOP), E.Y(HOP), { r: 7 });
      S.tPto = s('g', {}, svg);
      D.t(S.tPto, E.X(QOP) + 6, E.Y(0) - 8, '27,3', { tam: 13, peso: 750, halo: true });
      D.t(S.tPto, E.X(0) + 6, E.Y(HOP) - 6, '16,6', { tam: 13, peso: 750, halo: true });
      // la prueba de estabilidad
      S.est1 = s('g', { opacity: 0 }, svg);
      [[22, 1], [31, -1]].forEach(function (c) {
        var q = c[0], hb = H190(q), hs = sis(q), y1 = E.Y(Math.max(hb, hs)), y2 = E.Y(Math.min(hb, hs));
        s('line', { x1: E.X(q), x2: E.X(q), y1: y1, y2: y2, stroke: c[1] > 0 ? K.oliva : K.alerta, 'stroke-width': 3 }, S.est1);
        D.flecha(S.est1, E.X(q), (y1 + y2) / 2, E.X(q) + c[1] * 28, (y1 + y2) / 2, { color: c[1] > 0 ? K.oliva : K.alerta, ancho: 2.4 });
      });
      D.t(S.est1, E.X(22), E.Y(sis(22)) + 20, 'sobra cabeza', { tam: 12, peso: 650, color: K.olivaOsc, ancla: 'middle', halo: true });
      D.t(S.est1, E.X(31), E.Y(H190(31)) + 30, 'falta cabeza', { tam: 12, peso: 650, color: K.alerta, ancla: 'middle', halo: true });
      [S.tEst, S.tBom, S.guia, S.pto, S.tPto].forEach(function (x) { x.setAttribute('opacity', 0); });
      return S;
    },
    pasos: [
      { texto: 'La cabeza estática: los 10 m que separan las dos superficies, que hay que dar aunque pase muy poco caudal.', dur: 1.6, ir: function (S, t) { D.ver(S.banda, t); D.ver(S.est, t); D.ver(S.tEst, t); } },
      { texto: 'La dinámica crece con $Q^2$: a 25 m³/h son 5,5 m más, 15,5 m en total. La suma es la curva del sistema.', dur: 2.4, ir: function (S, t) { S.sis.dibujar(t); D.ver(S.din, T(t, 0.6, 1)); } },
      { texto: 'Encima va la curva de la bomba de 190 mm, leída de la carta: 20,1 m a caudal cero, y cae con el caudal.', dur: 2.4, ir: function (S, t) { S.bom.dibujar(t); D.ver(S.tBom, T(t, 0, 0.3)); } },
      { texto: 'Las dos se cruzan en 27,3 m³/h y 16,6 m: el punto de operación. La bomba no puede trabajar en otro punto con esta línea.', dur: 1.6, ir: function (S, t) { D.ver(S.guia, t); D.ver(S.pto, t); D.ver(S.tPto, T(t, 0.3, 1)); } },
      { texto: 'A 22 m³/h la bomba da más cabeza de la que pide la línea y el caudal sube; a 31 m³/h da menos y el caudal baja. Los dos vuelven al cruce: el punto es estable.', dur: 1.8, ir: function (S, t) { D.ver(S.est1, t); } }
    ]
  });

  /* Entre dos impulsores del catálogo: el de 178 mm no llega; el de 190 mm pasa y la válvula quita el exceso. */
  var KV = (H190(25) - 10) / 625;     // la constante del sistema con la válvula cerrada lo justo
  var Q178 = bis(function (q) { return H178(q) - sis(q); }, 0, 40);
  ZB.animacion('dos-impulsores', {
    vista: [0, 0, 640, 330],
    alt: 'La línea del caso pide 25 m³/h y 15,5 m. El impulsor de 178 mm cruza el sistema en 23,4 m³/h; el de 190 mm, en 27,3 m³/h, y con la válvula cerrada lo justo entrega 25 m³/h quemando 1,9 m.',
    montar: function (svg) {
      var S = {}, E = S.E = ejesCaso(svg);
      S.sis = s('path', { d: D.camino(pts(sis, 0, 35), E.X, E.Y), fill: 'none', stroke: K.serie[0], 'stroke-width': 2.6 }, svg);
      S.tSis = D.t(svg, E.X(33.5), E.Y(sis(33.5)) - 10, 'Sistema', { tam: 13, peso: 700, color: K.serie[0], ancla: 'end', halo: true });
      S.pedido = s('g', {}, svg);
      s('rect', { x: E.X(25) - 6, y: E.Y(15.5) - 6, width: 12, height: 12, fill: K.blanco, stroke: K.tinta, 'stroke-width': 2, transform: 'rotate(45 ' + E.X(25) + ' ' + E.Y(15.5) + ')' }, S.pedido);
      s('line', { x1: E.X(25) + 2, y1: E.Y(15.5) + 8, x2: E.X(30), y2: E.Y(9.4), stroke: K.tinta, 'stroke-width': 1 }, S.pedido);
      D.t(S.pedido, E.X(34.6), E.Y(9.4) + 15, 'Lo pedido: 25 m³/h y 15,5 m', { tam: 12.5, peso: 650, ancla: 'end', halo: true });
      S.c178 = D.trazo(svg, D.camino(pts(H178, 0, D.cartaFin('178')), E.X, E.Y), { color: K.metalO, ancho: 2.4 });
      S.t178 = D.t(svg, E.X(2), E.Y(H178(0)) - 8, '178 mm', { tam: 13, peso: 700, color: K.tinta2 });
      S.p178 = D.punto(svg, E.X(Q178), E.Y(sis(Q178)), { r: 5.5, color: K.blanco });
      S.l178 = s('g', {}, svg);
      s('line', { x1: E.X(Q178), x2: E.X(Q178), y1: E.Y(sis(Q178)) + 6, y2: E.Y(0), stroke: K.tinta2, 'stroke-width': 1, 'stroke-dasharray': '4 4' }, S.l178);
      D.t(S.l178, E.X(Q178) - 5, E.Y(0) - 8, n(Q178, 1), { tam: 12.5, peso: 700, ancla: 'end', halo: true });
      S.c190 = D.trazo(svg, D.camino(pts(H190, 0, D.cartaFin('190')), E.X, E.Y), { color: K.tinta, ancho: 2.8 });
      S.t190 = D.t(svg, E.X(2), E.Y(H190(0)) - 8, '190 mm', { tam: 13, peso: 700 });
      S.p190 = D.punto(svg, E.X(QOP), E.Y(HOP), { r: 5.5, color: K.blanco });
      S.l190 = s('g', {}, svg);
      s('line', { x1: E.X(QOP), x2: E.X(QOP), y1: E.Y(HOP) + 6, y2: E.Y(0), stroke: K.tinta2, 'stroke-width': 1, 'stroke-dasharray': '4 4' }, S.l190);
      D.t(S.l190, E.X(QOP) + 5, E.Y(0) - 8, '27,3', { tam: 12.5, peso: 700, halo: true });
      S.valv = s('path', { fill: 'none', stroke: K.alerta, 'stroke-width': 2.4, 'stroke-dasharray': '7 5' }, svg);
      S.quema = s('g', { opacity: 0 }, svg);
      s('line', { x1: E.X(25), x2: E.X(25), y1: E.Y(15.5), y2: E.Y(H190(25)), stroke: K.alerta, 'stroke-width': 3.5 }, S.quema);
      s('line', { x1: E.X(25) + 3, y1: E.Y(16.45), x2: E.X(31), y2: E.Y(5.4), stroke: K.alerta, 'stroke-width': 1 }, S.quema);
      D.t(S.quema, E.X(34.6), E.Y(5.4) + 15, 'La válvula quema 1,9 m', { tam: 12.5, peso: 700, color: K.alerta, ancla: 'end', halo: true });
      S.final = D.punto(svg, E.X(25), E.Y(H190(25)), { r: 7 });
      [S.t178, S.p178, S.l178, S.t190, S.p190, S.l190, S.final].forEach(function (x) { x.setAttribute('opacity', 0); });
      return S;
    },
    pasos: [
      { texto: 'La línea del caso pide 25 m³/h, y a ese caudal necesita 15,5 m. En el catálogo hay impulsores de 178 y de 190 mm.', dur: 1.2, ir: function (S, t) { D.ver(S.pedido, t); } },
      { texto: 'El de 178 mm cruza el sistema en ' + n(Q178, 1) + ' m³/h: a 25 m³/h solo da 14,4 m, menos de lo que pide la línea. No sirve.', dur: 2.2, ir: function (S, t) { S.c178.dibujar(T(t, 0, 0.8)); D.ver(S.t178, T(t, 0, 0.3)); D.ver(S.p178, T(t, 0.7, 1)); D.ver(S.l178, T(t, 0.7, 1)); } },
      { texto: 'El de 190 mm da 17,4 m a 25 m³/h, más de lo pedido; con la válvula abierta cruza en 27,3 m³/h.', dur: 2.2, ir: function (S, t) { S.c190.dibujar(T(t, 0, 0.8)); D.ver(S.t190, T(t, 0, 0.3)); D.ver(S.p190, T(t, 0.7, 1)); D.ver(S.l190, T(t, 0.7, 1)); } },
      { texto: 'Se escoge el de 190 mm y se cierra un poco la válvula: la curva del sistema se empina hasta cruzar la bomba en 25 m³/h. La válvula quema los 1,9 m que sobran.', dur: 2.6, ir: function (S, t) {
        var k = ZB.lerp(5.5 / 625, KV, t), E = S.E;
        S.valv.setAttribute('d', D.camino(pts(function (q) { return 10 + k * q * q; }, 0, Math.min(35, Math.sqrt(14 / k))), E.X, E.Y));
        D.ver(S.valv, t > 0 ? 1 : 0); D.ver(S.quema, T(t, 0.7, 1)); D.ver(S.final, T(t, 0.8, 1));
      } }
    ]
  });

  /* Dos sistemas que pasan por el mismo punto, y lo que hace cada uno si la bomba baja. */
  var KST = (HOP - 14) / (QOP * QOP), KFR = HOP / (QOP * QOP);
  function hBomba(r) { return function (q) { return r * r * H190(q / r); }; }
  function cruce(r, est, k) { return bis(function (q) { return hBomba(r)(q) - (est + k * q * q); }, 0.5, 40); }
  ZB.animacion('dos-sistemas', {
    vista: [0, 0, 640, 330],
    alt: 'Por el punto de operación del caso pasan un sistema casi plano, con 14 m de estática, y uno que sale del origen. Con la bomba girando 10 % más despacio, el caudal cae a 17,9 m³/h en el primero y a 24,6 m³/h en el segundo.',
    montar: function (svg) {
      var S = {}, E = S.E = ejesCaso(svg);
      S.bom = s('path', { fill: 'none', stroke: K.tinta, 'stroke-width': 2.8 }, svg);
      S.bom0 = s('path', { d: D.camino(pts(H190, 0, D.cartaFin('190')), E.X, E.Y), fill: 'none', stroke: K.tinta, 'stroke-width': 1.4, 'stroke-dasharray': '3 4', opacity: 0 }, svg);
      S.tBom = D.t(svg, E.X(2), E.Y(H190(0)) - 8, 'Bomba, 190 mm', { tam: 13, peso: 700 });
      S.st = D.trazo(svg, D.camino(pts(function (q) { return 14 + KST * q * q; }, 0, 35), E.X, E.Y), { color: K.serie[1], ancho: 2.6 });
      S.tSt = D.t(svg, E.X(1), E.Y(14) + 18, 'Dominado por la estática', { tam: 13, peso: 700, color: K.serie[1], halo: true });
      S.fr = D.trazo(svg, D.camino(pts(function (q) { return KFR * q * q; }, 0, 32.8), E.X, E.Y), { color: K.serie[2], ancho: 2.6 });
      S.tFr = D.t(svg, E.X(31), E.Y(KFR * 31 * 31) + 4, 'Dominado por la fricción', { tam: 13, peso: 700, color: K.serie[2], ancla: 'end', halo: true });
      S.p0 = D.punto(svg, E.X(QOP), E.Y(HOP), { r: 6 });
      S.pSt = D.punto(svg, E.X(QOP), E.Y(HOP), { r: 6, color: K.blanco, borde: K.serie[1] });
      S.pFr = D.punto(svg, E.X(QOP), E.Y(HOP), { r: 6, color: K.blanco, borde: K.serie[2] });
      S.lSt = D.t(svg, 0, 0, '', { tam: 12.5, peso: 700, color: K.serie[1], halo: true, ancla: 'end' });
      S.lFr = D.t(svg, 0, 0, '', { tam: 12.5, peso: 700, color: K.serie[2], halo: true });
      S.bom.setAttribute('d', D.camino(pts(H190, 0, D.cartaFin('190')), E.X, E.Y));
      [S.tSt, S.tFr, S.pSt, S.pFr, S.lSt, S.lFr].forEach(function (x) { x.setAttribute('opacity', 0); });
      return S;
    },
    pasos: [
      { texto: 'La bomba de 190 mm y su punto de operación con la línea del caso: 27,3 m³/h y 16,6 m.', dur: 1, ir: function (S, t) { D.ver(S.p0, 1); } },
      { texto: 'Un sistema dominado por la estática pasa por el mismo punto: 14 m de estática y poca fricción. Su curva es casi plana.', dur: 1.8, ir: function (S, t) { S.st.dibujar(t); D.ver(S.tSt, T(t, 0.5, 1)); } },
      { texto: 'Uno dominado por la fricción, sin estática, también pasa por ahí: sale del origen y es empinado.', dur: 1.8, ir: function (S, t) { S.fr.dibujar(t); D.ver(S.tFr, T(t, 0.5, 1)); } },
      { texto: 'Si la bomba gira 10 % más despacio, su curva baja. En el sistema plano el caudal cae a 17,9 m³/h, un 34 % menos; en el de fricción, a 24,6 m³/h, un 10 % menos.', dur: 3, ir: function (S, t) {
        var r = 1 - 0.1 * t, E = S.E, f = hBomba(r);
        S.bom.setAttribute('d', D.camino(pts(f, 0, D.cartaFin('190') * r), E.X, E.Y));
        D.ver(S.bom0, t > 0 ? 1 : 0); D.ver(S.p0, 1 - t);
        var qs = cruce(r, 14, KST), qf = cruce(r, 0, KFR);
        S.pSt.setAttribute('cx', E.X(qs)); S.pSt.setAttribute('cy', E.Y(14 + KST * qs * qs));
        S.pFr.setAttribute('cx', E.X(qf)); S.pFr.setAttribute('cy', E.Y(KFR * qf * qf));
        D.ver(S.pSt, t > 0 ? 1 : 0); D.ver(S.pFr, t > 0 ? 1 : 0);
        S.lSt.setAttribute('x', E.X(qs) - 10); S.lSt.setAttribute('y', E.Y(14 + KST * qs * qs) - 12);
        S.lFr.setAttribute('x', E.X(qf) + 10); S.lFr.setAttribute('y', E.Y(KFR * qf * qf) + 22);
        D.ponerTexto(S.lSt, n(qs, 1) + ' m³/h'); D.ponerTexto(S.lFr, n(qf, 1) + ' m³/h');
        D.ver(S.lSt, T(t, 0.6, 1)); D.ver(S.lFr, T(t, 0.6, 1));
      } }
    ]
  });

  /* Reto: la curva del sistema, el punto de operación y la cabeza que quema la válvula. */
  function curvas(r) {
    var a = r.entre(28, 60, 1), b = r.entre(0.002, 0.008, 4), c = r.entre(4, Math.round(a * 0.45), 1), d = r.entre(0.001, 0.006, 4);
    var Q = Math.sqrt((a - c) / (b + d));
    return { a: a, b: b, c: c, d: d, Q: Q, H: a - b * Q * Q };
  }
  function enunCurvas(k) {
    return 'la bomba tiene la curva $H = ' + n(k.a, 1) + ' - ' + n(k.b, 4) + '\\,Q^2$ y el sistema, $H_{sis} = ' + n(k.c, 1) + ' + ' + n(k.d, 4) + '\\,Q^2$, con $Q$ en m³/h y $H$ en m';
  }
})();

/* 11-07-mover.js: se escribe en interactivo/bombas/secciones/ y se trae con node interactivo/al-libro.mjs. No se edita aquí. */
/* 11.7 Cómo mover el punto de operación: tres animaciones, la figura del costo y el reto. */
(function () {
  'use strict';
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, T = ZB.tramo;
  var g = 9.81;
  var H190 = function (q) { return D.carta('190', q, 0); };
  var sis = function (q) { return 10 + 5.5 * Math.pow(q / 25, 2); };
  function bis(f, a, b) { for (var i = 0; i < 60; i++) { var m = (a + b) / 2; if (f(a) * f(m) <= 0) b = m; else a = m; } return (a + b) / 2; }
  function pts(f, a, b, paso) { var o = []; for (var q = a; q <= b + 1e-9; q += paso || 0.5) o.push([q, f(q)]); return o; }
  function ejesCaso(svg) {
    return D.ejes(svg, { x: 64, y: 34, w: 540, h: 250, xmin: 0, xmax: 35, ymin: 0, ymax: 24, xt: [0, 5, 10, 15, 20, 25, 30, 35], yt: [0, 4, 8, 12, 16, 20, 24], xr: 'Caudal, Q (m³/h)', yr: 'Cabeza (m)' });
  }
  function rombo(padre, x, y, o) {
    o = o || {};
    return s('rect', { x: x - 6, y: y - 6, width: 12, height: 12, fill: o.color || K.blanco, stroke: o.borde || K.tinta, 'stroke-width': 2, transform: 'rotate(45 ' + x + ' ' + y + ')' }, padre);
  }
  function mover(el, x, y) { el.setAttribute('cx', x); el.setAttribute('cy', y); }
  function moverRombo(el, x, y) { el.setAttribute('x', x - 6); el.setAttribute('y', y - 6); el.setAttribute('transform', 'rotate(45 ' + x + ' ' + y + ')'); }

  /* La válvula o el variador, en la bomba sobredimensionada H = 40 − 0,0025 Q² y el sistema H = 10 + 0,0015 Q². */
  var bomba = function (r) { return function (q) { return 40 * r * r - 0.0025 * q * q; }; };
  var finB = function (r) { return Math.min(100, Math.sqrt(40 * r * r / 0.0025)); };
  var sist = function (k) { return function (q) { return 10 + k * q * q; }; };
  var KV = (bomba(1)(60) - 10) / 3600, RV = Math.sqrt((sist(0.0015)(60) + 0.0025 * 3600) / 40);
  ZB.animacion('valvula-variador', {
    vista: [0, 0, 640, 330],
    alt: 'Una bomba sobredimensionada debe pasar 60 m³/h en lugar de 86,6. Con la válvula, la bomba sigue en 31 m y la válvula quema 15,6 m; con el variador al 78 %, la curva baja hasta 15,4 m. La potencia hidráulica pasa de 5,1 a 2,5 kW.',
    montar: function (svg) {
      var S = {}, E = S.E = D.ejes(svg, { x: 64, y: 34, w: 540, h: 250, xmin: 0, xmax: 100, ymin: 0, ymax: 45, xt: [0, 20, 40, 60, 80, 100], yt: [0, 10, 20, 30, 40], xr: 'Caudal, Q (m³/h)', yr: 'Cabeza (m)' });
      S.ped = s('line', { x1: E.X(60), x2: E.X(60), y1: E.Y(0), y2: E.Y(44), stroke: K.tinta2, 'stroke-width': 1, 'stroke-dasharray': '4 4' }, svg);
      D.t(svg, E.X(60) + 5, E.Y(0) - 8, '60 pedidos', { tam: 12, peso: 650, color: K.tinta2 });
      S.sis = s('path', { d: D.camino(pts(sist(0.0015), 0, 100, 1), E.X, E.Y), fill: 'none', stroke: K.serie[0], 'stroke-width': 2.6 }, svg);
      D.t(svg, E.X(99), E.Y(sist(0.0015)(99)) + 22, 'Sistema', { tam: 13, peso: 700, color: K.serie[0], ancla: 'end', halo: true });
      S.valv = s('path', { fill: 'none', stroke: K.alerta, 'stroke-width': 2.4, 'stroke-dasharray': '7 5', opacity: 0 }, svg);
      S.bom0 = s('path', { d: D.camino(pts(bomba(1), 0, 100, 1), E.X, E.Y), fill: 'none', stroke: K.tinta, 'stroke-width': 1.3, 'stroke-dasharray': '3 4', opacity: 0 }, svg);
      S.bom = s('path', { d: D.camino(pts(bomba(1), 0, 100, 1), E.X, E.Y), fill: 'none', stroke: K.tinta, 'stroke-width': 2.8 }, svg);
      S.tBom = D.t(svg, E.X(3), E.Y(40) - 8, 'Bomba a plena velocidad', { tam: 13, peso: 700 });
      S.abierto = D.punto(svg, E.X(86.6), E.Y(21.25), { r: 6, color: K.blanco });
      D.t(svg, E.X(86.6) + 9, E.Y(21.25) - 10, '86,6', { tam: 12.5, peso: 700, halo: true });
      S.pV = D.punto(svg, E.X(60), E.Y(31), { r: 6.5 });
      S.quema = s('g', { opacity: 0 }, svg);
      s('line', { x1: E.X(60), x2: E.X(60), y1: E.Y(15.4), y2: E.Y(31), stroke: K.alerta, 'stroke-width': 4 }, S.quema);
      D.t(S.quema, E.X(60) - 10, E.Y(23.2) + 4, 'la válvula quema 15,6 m', { tam: 12.5, peso: 700, color: K.alerta, ancla: 'end', halo: true });
      S.pF = D.punto(svg, E.X(60), E.Y(15.4), { r: 6.5 });
      S.tVar = D.t(svg, 0, 0, '', { tam: 13, peso: 700, color: K.olivaOsc, halo: true });
      // barras de potencia hidráulica
      S.bar = s('g', { opacity: 0 }, svg);
      var x0 = E.X(66), e = (E.X(98) - E.X(66)) / 5.2;
      D.t(S.bar, x0, E.Y(44.5), 'Potencia hidráulica', { tam: 12.5, peso: 700 });
      [['Con la válvula', 5.07, K.alerta], ['Con el variador', 2.52, K.oliva]].forEach(function (b, i) {
        var y = E.Y(44.5) + 10 + i * 30;
        s('rect', { x: x0, y: y, width: b[1] * e, height: 12, fill: b[2] }, S.bar);
        D.t(S.bar, x0 + b[1] * e + 6, y + 11, n(b[1], 1) + ' kW', { tam: 12.5, peso: 700 });
        D.t(S.bar, x0, y + 26, b[0], { tam: 11.5, color: K.tinta2 });
      });
      [S.pV, S.pF].forEach(function (x) { x.setAttribute('opacity', 0); });
      return S;
    },
    pasos: [
      { texto: 'La bomba, $H = 40 - 0,0025\\,Q^2$, y el sistema, $H = 10 + 0,0015\\,Q^2$, con 10 m de cabeza estática ($Q$ en m³/h). Con la válvula abierta se cruzan en 86,6 m³/h y 21,3 m, y el proceso necesita solo 60 m³/h.', dur: 1.2, ir: function (S, t) { D.ver(S.ped, t); } },
      { texto: 'Con la válvula, la curva del sistema se empina hasta cruzar la bomba en 60 m³/h. La bomba sigue a plena velocidad y da 31,0 m.', dur: 2.2, ir: function (S, t) {
        var k = ZB.lerp(0.0015, KV, t);
        S.valv.setAttribute('d', D.camino(pts(sist(k), 0, Math.min(100, Math.sqrt(35 / k)), 1), S.E.X, S.E.Y));
        D.ver(S.valv, t > 0 ? 1 : 0); D.ver(S.pV, T(t, 0.8, 1));
      } },
      { texto: 'La línea solo necesita 15,4 m a 60 m³/h: la válvula se come la diferencia, 15,6 m.', dur: 1.4, ir: function (S, t) { D.ver(S.quema, t); } },
      { texto: 'Con el variador, la válvula queda abierta y la bomba gira más despacio. Al 78 % de la velocidad, su curva $H = 40\\,(0,78)^2 - 0,0025\\,Q^2$ cruza el sistema en 60 m³/h y 15,4 m.', dur: 2.6, ir: function (S, t) {
        var r = ZB.lerp(1, RV, t), E = S.E;
        D.ver(S.valv, 1 - t); D.ver(S.quema, 1 - T(t, 0, 0.4)); D.ver(S.pV, 1 - T(t, 0, 0.4)); D.ver(S.bom0, t > 0 ? 1 : 0);
        S.bom.setAttribute('d', D.camino(pts(bomba(r), 0, finB(r), 0.5), E.X, E.Y));
        D.ver(S.tBom, 1 - T(t, 0, 0.3));
        S.tVar.setAttribute('x', E.X(3)); S.tVar.setAttribute('y', E.Y(40 * r * r) - 8);
        D.ponerTexto(S.tVar, 'Bomba al ' + n(r * 100, 0) + ' %');
        D.ver(S.tVar, T(t, 0.2, 0.5)); D.ver(S.pF, T(t, 0.8, 1));
      } },
      { texto: 'La potencia hidráulica, $\\rho g Q H$ con agua: 5,1 kW con la válvula y 2,5 kW con el variador: la mitad, para el mismo caudal.', dur: 1.4, ir: function (S, t) { D.ver(S.bar, t); } }
    ]
  });

  /* La bomba del caso a menos velocidad: el BEP por la parábola de afinidad, el punto de operación por el sistema. */
  var QB = 25.25, HB = 17.32, NOM = 1750;
  var bombaN = function (r) { return function (q) { return r * r * H190(q / r); }; };
  function opN(r) { var f = function (q) { return bombaN(r)(q) - sis(q); }; return f(0) > 0 ? bis(f, 0, 40) : 0; }
  var RMIN = Math.sqrt(10 / H190(0));
  ZB.animacion('parabola-afinidad', {
    vista: [0, 0, 640, 330],
    alt: 'La bomba del caso a 1750, 1500 y 1300 r/min en la línea del caso: el BEP se desliza por la parábola de afinidad, pero el punto de operación se corre a la izquierda, a 19,3 y 9,6 m³/h, y hacia 1236 r/min deja de pasar agua.',
    montar: function (svg) {
      var S = {}, E = S.E = ejesCaso(svg);
      S.sis = s('path', { d: D.camino(pts(sis, 0, 35), E.X, E.Y), fill: 'none', stroke: K.serie[0], 'stroke-width': 2.6 }, svg);
      D.t(svg, E.X(34.8), E.Y(sis(34.8)) + 22, 'Sistema', { tam: 13, peso: 700, color: K.serie[0], ancla: 'end', halo: true });
      S.par = D.trazo(svg, D.camino(pts(function (q) { return HB / (QB * QB) * q * q; }, 0, 29.5), E.X, E.Y), { color: K.serie[1], ancho: 2, guion: '3 5' });
      S.tPar = D.t(svg, E.X(29.4), E.Y(HB / (QB * QB) * 29.4 * 29.4) - 10, 'Parábola de afinidad', { tam: 12.5, peso: 700, color: K.serie[1], ancla: 'end', halo: true });
      S.bom0 = s('path', { d: D.camino(pts(H190, 0, D.cartaFin('190')), E.X, E.Y), fill: 'none', stroke: K.tinta, 'stroke-width': 1.3, 'stroke-dasharray': '3 4', opacity: 0 }, svg);
      S.bom = s('path', { fill: 'none', stroke: K.tinta, 'stroke-width': 2.8 }, svg);
      S.tN = D.t(svg, 0, 0, '', { tam: 13, peso: 700, halo: true });
      S.bep = rombo(svg, 0, 0, { color: K.amarilloClaro });
      S.op = D.punto(svg, 0, 0, { r: 6.5 });
      S.tOp = D.t(svg, 0, 0, '', { tam: 12.5, peso: 700, halo: true });
      S.tPar.setAttribute('opacity', 0);
      S.poner = function (r) {
        var f = bombaN(r), q = opN(r), qb = QB * r, hb = HB * r * r;
        S.bom.setAttribute('d', D.camino(pts(f, 0, D.cartaFin('190') * r), E.X, E.Y));
        S.tN.setAttribute('x', E.X(2.5)); S.tN.setAttribute('y', E.Y(f(0)) - 8);
        D.ponerTexto(S.tN, n(NOM * r, 0) + ' r/min');
        moverRombo(S.bep, E.X(qb), E.Y(hb));
        mover(S.op, E.X(q), E.Y(sis(q)));
        S.tOp.setAttribute('x', E.X(q) + 10); S.tOp.setAttribute('y', E.Y(sis(q)) + 22);
        D.ponerTexto(S.tOp, q < 0.05 ? 'sin caudal' : n(q, 1) + ' m³/h');
      };
      S.poner(1);
      return S;
    },
    pasos: [
      { texto: 'A 1750 r/min la bomba cruza la línea del caso en 27,3 m³/h, un poco a la derecha de su BEP, el rombo: 25,3 m³/h y 17,3 m.', dur: 1, ir: function (S, t) { S.poner(1); } },
      { texto: 'Los puntos semejantes del BEP a cualquier velocidad caen sobre una parábola que pasa por el origen: la parábola de afinidad.', dur: 1.8, ir: function (S, t) { S.par.dibujar(t); D.ver(S.tPar, T(t, 0.5, 1)); } },
      { texto: 'A 1500 r/min la curva baja y el BEP se desliza por la parábola, a 21,6 m³/h y 12,7 m. El punto de operación sigue al sistema y cae en 19,3 m³/h, el 89 % del caudal del BEP.', dur: 2.4, ir: function (S, t) { D.ver(S.bom0, t > 0 ? 1 : 0); S.poner(ZB.lerp(1, 1500 / NOM, t)); } },
      { texto: 'A 1300 r/min el BEP queda en 18,8 m³/h, pero el punto de operación cae en 9,6 m³/h, la mitad: la cabeza estática pesa cada vez más.', dur: 2.4, ir: function (S, t) { S.poner(ZB.lerp(1500 / NOM, 1300 / NOM, t)); } },
      { texto: 'Hacia 1236 r/min la bomba da, a caudal cero, los mismos 10 m de la estática, y deja de pasar agua aunque siga girando.', dur: 2, ir: function (S, t) { S.poner(ZB.lerp(1300 / NOM, RMIN - 1e-6, t)); } }
    ]
  });

  /* El recorte por la recta del origen, en el caso. */
  var QP = 25, HP = 15.5, PEND = HP / QP;
  var QH = bis(function (q) { return H190(q) - PEND * q; }, 5, 40), HH = PEND * QH, ESC = HP / HH, DR = 190 * Math.sqrt(ESC);
  ZB.animacion('recorte', {
    vista: [0, 0, 640, 330],
    alt: 'La recta del origen que pasa por el punto pedido, 25 m³/h y 15,5 m, corta la curva de 190 mm en 26,9 m³/h y 16,7 m; con m = 2 el impulsor se recorta a 183 mm, y cada punto de la curva se corre por su recta hasta la curva nueva.',
    montar: function (svg) {
      var S = {}, E = S.E = ejesCaso(svg);
      S.bom = s('path', { d: D.camino(pts(H190, 0, D.cartaFin('190')), E.X, E.Y), fill: 'none', stroke: K.tinta, 'stroke-width': 2.8 }, svg);
      D.t(svg, E.X(1), E.Y(20.06) - 8, '190 mm', { tam: 13, peso: 700 });
      S.ped = s('g', { opacity: 0 }, svg);
      rombo(S.ped, E.X(QP), E.Y(HP));
      s('line', { x1: E.X(QP) + 4, y1: E.Y(HP) + 8, x2: E.X(26.5), y2: E.Y(10.4), stroke: K.tinta, 'stroke-width': 1 }, S.ped);
      D.t(S.ped, E.X(26.5), E.Y(10.4) + 14, 'Pedido: 25 m³/h y 15,5 m', { tam: 12.5, peso: 650 });
      S.recta = D.trazo(svg, 'M' + E.X(0) + ' ' + E.Y(0) + 'L' + E.X(33) + ' ' + E.Y(PEND * 33), { color: K.serie[1], ancho: 1.8 });
      S.hom = D.punto(svg, E.X(QH), E.Y(HH), { r: 6, color: K.blanco });
      S.tHom = D.t(svg, E.X(QH) - 8, E.Y(HH) - 12, 'homólogo: 26,9 m³/h y 16,7 m', { tam: 12.5, peso: 700, ancla: 'end', halo: true });
      S.cuenta = s('g', { opacity: 0 }, svg);
      s('rect', { x: E.X(19.2), y: E.Y(7.9), width: 255, height: 86, fill: K.blanco, stroke: K.borde, 'stroke-width': 1, rx: 4 }, S.cuenta);
      D.t(S.cuenta, E.X(19.2) + 12, E.Y(7.9) + 26, 'D′ = 190 √(15,5/16,7) = 183 mm', { tam: 14, peso: 700 });
      D.t(S.cuenta, E.X(19.2) + 12, E.Y(7.9) + 48, 'con m = 2: un recorte de 4 %', { tam: 12.5, color: K.tinta2 });
      // rayos de tres puntos de la curva
      S.rayos = [10, 20, 30].map(function (q) {
        var h = H190(q), gg = s('g', { opacity: 0 }, svg);
        s('line', { x1: E.X(0), y1: E.Y(0), x2: E.X(q), y2: E.Y(h), stroke: K.guia, 'stroke-width': 1, 'stroke-dasharray': '3 4' }, gg);
        var p = s('circle', { r: 4, fill: K.serie[1], stroke: K.tinta, 'stroke-width': 1 }, gg);
        return { q: q, h: h, g: gg, p: p };
      });
      S.nueva = s('path', { fill: 'none', stroke: K.serie[1], 'stroke-width': 2.8, opacity: 0 }, svg);
      S.tNueva = D.t(svg, E.X(1), E.Y(20.06 * ESC) + 20, '183 mm', { tam: 13, peso: 700, color: K.serie[1], halo: true });
      S.fin = s('g', { opacity: 0 }, svg);
      D.t(S.fin, E.X(19.2) + 12, E.Y(7.9) + 72, 'm = 3: 185 mm · parábola: 181 mm', { tam: 12.5, peso: 650, color: K.olivaOsc });
      [S.hom, S.tHom, S.tNueva].forEach(function (x) { x.setAttribute('opacity', 0); });
      return S;
    },
    pasos: [
      { texto: 'La curva de 190 mm y el punto que pide la línea: 25 m³/h y 15,5 m, por debajo de la curva.', dur: 1.2, ir: function (S, t) { D.ver(S.ped, t); } },
      { texto: 'La recta del origen que pasa por el punto pedido, $H = (15,5/25)\\,Q$, corta la curva en su homólogo: 26,9 m³/h y 16,7 m.', dur: 2, ir: function (S, t) { S.recta.dibujar(t); D.ver(S.hom, T(t, 0.7, 1)); D.ver(S.tHom, T(t, 0.7, 1)); } },
      { texto: 'Con $m = 2$, el diámetro sale de la cabeza del homólogo: $D\' = 190\\sqrt{15,5/16,7} = 183$ mm.', dur: 1.4, ir: function (S, t) { D.ver(S.cuenta, t); } },
      { texto: 'Cada punto de la curva se corre por su propia recta hacia el origen, en la misma proporción, $(183/190)^2 = 0,93$. La curva recortada pasa por el punto pedido.', dur: 2.8, ir: function (S, t) {
        var k = ZB.lerp(1, ESC, t), E = S.E;
        S.rayos.forEach(function (r) { D.ver(r.g, T(t, 0, 0.15)); mover(r.p, E.X(r.q * k), E.Y(r.h * k)); });
        S.nueva.setAttribute('d', D.camino(pts(H190, 0, D.cartaFin('190')).map(function (p) { return [p[0] * k, p[1] * k]; }), E.X, E.Y));
        D.ver(S.nueva, t > 0 ? 1 : 0); D.ver(S.tNueva, T(t, 0.8, 1)); D.ver(S.tHom, 1 - T(t, 0, 0.3));
      } },
      { texto: 'Con $m = 3$ saldría 185 mm, y con la parábola de McCabe, 181 mm. Como el recorte es de 4 %, se corta primero a 185 mm, se prueba y se hace el corte final.', dur: 1.2, ir: function (S, t) { D.ver(S.fin, t); } }
    ]
  });

  /* La figura del costo: potencia al eje contra caudal requerido, con los números del modelo del caso. */
  var COSTO = {
    Q: [10, 10.833, 11.667, 12.5, 13.333, 14.167, 15, 15.833, 16.667, 17.5, 18.333, 19.167, 20, 20.833, 21.667, 22.5, 23.333, 24.167, 25, 25.833, 26.667, 27.5, 28.333, 29.167, 30],
    valvula: [1.1142, 1.1451, 1.1757, 1.206, 1.236, 1.2657, 1.2951, 1.3243, 1.3533, 1.382, 1.4105, 1.4389, 1.4671, 1.4952, 1.5233, 1.5512, 1.5792, 1.6073, 1.6356, 1.6642, 1.6934, null, null, null, null],
    variador: [0.5345, 0.5642, 0.5958, 0.6292, 0.6647, 0.7023, 0.7422, 0.7846, 0.8296, 0.8774, 0.9282, 0.9821, 1.0394, 1.1002, 1.1648, 1.2333, 1.306, 1.3831, 1.4648, 1.5513, 1.6427, 1.7395, 1.842, 1.9497, 2.0627],
    recorte: [null, 0.6426, 0.6758, 0.7101, 0.7458, 0.7829, 0.8216, 0.862, 0.9043, 0.9486, 0.995, 1.0439, 1.0954, 1.1497, 1.2072, 1.2682, 1.3331, 1.4025, 1.4769, 1.5572, 1.6443, 1.7395, 1.8443, 1.9566, 2.0767]
  };
  function figuraCosto() {
    var caja = document.getElementById('fig-costo-svg');
    if (!caja) return;
    var svg = s('svg', { viewBox: '0 0 640 330', role: 'img', 'aria-label': 'Potencia al eje contra caudal requerido: con la válvula baja de 1,64 kW a 1,11 kW entre 25 y 10 m³/h; con el variador, de 1,46 a 0,53 kW; el recorte va casi encima del variador.', style: 'font-family:inherit' }, caja);
    var E = D.ejes(svg, { x: 64, y: 34, w: 540, h: 250, xmin: 10, xmax: 30, ymin: 0, ymax: 2.2, xt: [10, 15, 20, 25, 30], yt: [0, 0.5, 1, 1.5, 2], dy: 1, xr: 'Caudal requerido (m³/h)', yr: 'Potencia al eje (kW)' });
    function serie(clave) { var o = []; COSTO.Q.forEach(function (q, i) { if (COSTO[clave][i] != null) o.push([q, COSTO[clave][i]]); }); return o; }
    s('path', { d: D.camino(serie('valvula'), E.X, E.Y), fill: 'none', stroke: K.alerta, 'stroke-width': 2.6, 'stroke-dasharray': '8 5' }, svg);
    s('path', { d: D.camino(serie('recorte'), E.X, E.Y), fill: 'none', stroke: K.serie[1], 'stroke-width': 2.4, 'stroke-dasharray': '2 4', 'stroke-linecap': 'round' }, svg);
    s('path', { d: D.camino(serie('variador'), E.X, E.Y), fill: 'none', stroke: K.tinta, 'stroke-width': 2.6 }, svg);
    D.t(svg, E.X(10.4), E.Y(1.114) - 10, 'Válvula', { tam: 13, peso: 700, color: K.alerta, halo: true });
    D.t(svg, E.X(14.5), E.Y(0.62), 'Variador', { tam: 13, peso: 700, halo: true });
    D.t(svg, E.X(14.5), E.Y(0.62) + 18, 'Recorte, casi encima', { tam: 12.5, peso: 650, color: K.serie[1], halo: true });
    s('line', { x1: E.X(25), x2: E.X(25), y1: E.Y(0), y2: E.Y(2.2), stroke: K.tinta2, 'stroke-width': 1, 'stroke-dasharray': '4 4' }, svg);
    D.t(svg, E.X(25) - 6, E.Y(2.05), 'diseño: 25 m³/h', { tam: 12, peso: 650, color: K.tinta2, ancla: 'end' });
    D.punto(svg, E.X(25), E.Y(1.6356), { r: 5, color: K.blanco, borde: K.alerta });
    D.punto(svg, E.X(25), E.Y(1.4648), { r: 5 });
    D.t(svg, E.X(25) + 9, E.Y(1.6356) - 6, '1,64 kW', { tam: 12, peso: 700, halo: true });
    D.t(svg, E.X(25) + 9, E.Y(1.4648) + 16, '1,46 kW', { tam: 12, peso: 700, halo: true });
  }
  figuraCosto();

  /* Reto: afinidad, recorte con m = 2 y válvula contra variador. */
})();

/* 11-08-arreglos.js: se escribe en interactivo/bombas/secciones/ y se trae con node interactivo/al-libro.mjs. No se edita aquí. */
/* 11.8 Bombas en serie y en paralelo: tres animaciones y el reto. */
(function () {
  'use strict';
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, T = ZB.tramo;

  // La bomba y el sistema del ejemplo: H = 40 − 0,0025 Q², H_sis = 10 + 0,0015 Q² (Q en m³/h).
  var A = 40, B = 0.0025, C = 10, E = 0.0015;
  function curva(f, q0, q1, paso) { var p = []; for (var q = q0; q <= q1 + 1e-9; q += paso || 1) p.push([q, f(q)]); return p; }
  function recorte(svg, id, ej) {
    var defs = s('defs', {}, svg), cp = s('clipPath', { id: id }, defs);
    s('rect', { x: ej.X(ej.xmin), y: ej.Y(ej.ymax), width: ej.X(ej.xmax) - ej.X(ej.xmin), height: ej.Y(ej.ymin) - ej.Y(ej.ymax) }, cp);
    return s('g', { 'clip-path': 'url(#' + id + ')' }, svg);
  }
  function ejes(svg, o) {
    var e = D.ejes(svg, o);
    e.xmin = o.xmin; e.xmax = o.xmax; e.ymin = o.ymin; e.ymax = o.ymax;
    return e;
  }
  function rotulo(padre, x, y, txt, color, ancla) {
    var t = D.t(padre, x, y, txt, { tam: 13, peso: 650, color: color, ancla: ancla || 'start', halo: true });
    t.setAttribute('opacity', 0);
    return t;
  }
  function punto(padre, x, y, color) { var p = D.punto(padre, x, y, { r: 6, color: color }); p.setAttribute('opacity', 0); return p; }

  /* Dos bombas en paralelo: se suman caudales a cabeza constante. */
  var Q1 = Math.sqrt((A - C) / (B + E)), H1 = C + E * Q1 * Q1;
  var QP = Math.sqrt((A - C) / (B / 4 + E)), HP = C + E * QP * QP;
  var QS = Math.sqrt((2 * A - C) / (2 * B + E)), HS = C + E * QS * QS;
  ZB.animacion('paralelo', {
    vista: [0, 0, 640, 350],
    alt: 'Curva de una bomba, de dos en paralelo y del sistema: el par cruza el sistema en 118,8 m³/h, un 37 % más que una sola bomba, no el doble.',
    montar: function (svg) {
      var S = {};
      var e = S.e = ejes(svg, { x: 64, y: 34, w: 540, h: 260, xmin: 0, xmax: 180, ymin: 0, ymax: 60, xt: [0, 30, 60, 90, 120, 150, 180], yt: [0, 10, 20, 30, 40, 50, 60], xr: 'Q (m³/h)', yr: 'H (m)' });
      var g = recorte(svg, 'clip-par', e);
      S.sis = D.trazo(g, D.camino(curva(function (q) { return C + E * q * q; }, 0, 180), e.X, e.Y), { color: K.tinta2, ancho: 2.4 });
      S.una = D.trazo(g, D.camino(curva(function (q) { return A - B * q * q; }, 0, 126.5, 0.5), e.X, e.Y), { color: K.serie[0], ancho: 2.6 });
      S.par = D.trazo(g, D.camino(curva(function (q) { return A - B * q * q / 4; }, 0, 180), e.X, e.Y), { color: K.serie[1], ancho: 2.8 });
      S.rSis = rotulo(svg, e.X(160), e.Y(C + E * 160 * 160) - 10, 'sistema', K.tinta2, 'end');
      S.rUna = rotulo(svg, e.X(100), e.Y(A - B * 100 * 100) + 20, 'una bomba', K.serie[0], 'end');
      S.rPar = rotulo(svg, e.X(176), e.Y(A - B * 176 * 176 / 4) + 22, 'dos en paralelo', K.serie[1], 'end');
      // A 30 m de cabeza: el caudal de una y el doble
      var qa = Math.sqrt((A - 30) / B);
      S.g30 = s('g', { opacity: 0 }, svg);
      s('line', { x1: e.X(0), x2: e.X(2 * qa), y1: e.Y(30), y2: e.Y(30), stroke: K.tinta2, 'stroke-width': 1.2, 'stroke-dasharray': '5 4' }, S.g30);
      D.punto(S.g30, e.X(qa), e.Y(30), { r: 5, color: K.blanco, borde: K.serie[0] });
      S.f30 = D.flechaViva(S.g30, { color: K.serie[1], ancho: 2.2 });
      S.p30 = D.punto(S.g30, e.X(2 * qa), e.Y(30), { r: 5, color: K.blanco, borde: K.serie[1] });
      D.t(S.g30, e.X(qa), e.Y(30) - 10, n(qa, 1), { tam: 12, ancla: 'middle', color: K.serie[0], peso: 650, halo: true });
      S.t30 = D.t(S.g30, e.X(2 * qa), e.Y(30) - 10, n(2 * qa, 1), { tam: 12, ancla: 'middle', color: K.serie[1], peso: 650, halo: true });
      S.qa = qa;
      S.p1 = punto(svg, e.X(Q1), e.Y(H1));
      S.t1 = rotulo(svg, e.X(Q1) + 10, e.Y(H1) + 20, n(Q1, 1) + ' m³/h; ' + n(H1, 1) + ' m', K.tinta);
      S.pP = punto(svg, e.X(QP), e.Y(HP));
      S.tP = rotulo(svg, e.X(QP) - 6, e.Y(37.6), n(QP, 1) + ' m³/h; ' + n(HP, 1) + ' m', K.tinta, 'end');
      S.doble = s('g', { opacity: 0 }, svg);
      s('line', { x1: e.X(2 * Q1), x2: e.X(2 * Q1), y1: e.Y(0), y2: e.Y(46), stroke: K.alerta, 'stroke-width': 1.4, 'stroke-dasharray': '5 4' }, S.doble);
      D.t(S.doble, e.X(2 * Q1) - 6, e.Y(48), 'el doble: ' + n(2 * Q1, 1), { tam: 12.5, peso: 650, color: K.alerta, ancla: 'middle', halo: true });
      S.cada = s('g', { opacity: 0 }, svg);
      s('line', { x1: e.X(QP / 2), x2: e.X(QP), y1: e.Y(HP), y2: e.Y(HP), stroke: K.tinta2, 'stroke-width': 1.2, 'stroke-dasharray': '5 4' }, S.cada);
      D.punto(S.cada, e.X(QP / 2), e.Y(HP), { r: 6, color: K.blanco, borde: K.serie[0] });
      D.t(S.cada, e.X(QP / 2) - 10, e.Y(HP) + 22, 'cada una: ' + n(QP / 2, 1) + ' m³/h', { tam: 12.5, peso: 650, color: K.serie[0], ancla: 'end', halo: true });
      return S;
    },
    pasos: [
      { texto: 'La curva de una bomba, $H = 40 - 0,0025\\,Q^2$, cruza la del sistema, $H_{sis} = 10 + 0,0015\\,Q^2$, en 86,6 m³/h y 21,3 m.', dur: 2.4, ir: function (S, t) {
        S.sis.dibujar(T(t, 0, 0.45)); S.una.dibujar(T(t, 0.3, 0.8)); D.ver(S.rSis, T(t, 0.3, 0.5)); D.ver(S.rUna, T(t, 0.6, 0.8));
        D.ver(S.p1, T(t, 0.8, 1)); D.ver(S.t1, T(t, 0.85, 1));
      } },
      { texto: 'A 30 m de cabeza una bomba pasa 63,2 m³/h. Dos en paralelo trabajan a la misma cabeza y pasan el doble: 126,5 m³/h.', dur: 2, ir: function (S, t) {
        var e = S.e; D.ver(S.g30, T(t, 0, 0.25));
        S.f30(e.X(S.qa) + 6, e.Y(30), e.X(S.qa + S.qa * T(t, 0.2, 1)) - 4, e.Y(30));
        D.ver(S.p30, T(t, 0.9, 1)); D.ver(S.t30, T(t, 0.9, 1));
      } },
      { texto: 'Lo mismo a cada cabeza da la curva del par: $H = 40 - 0,0025\\,(Q/2)^2$, que a cada altura está al doble de distancia del eje.', dur: 2, ir: function (S, t) {
        S.par.dibujar(t); D.ver(S.rPar, T(t, 0.7, 1)); D.ver(S.g30, 1 - 0.65 * T(t, 0.5, 1));
      } },
      { texto: 'El par cruza el sistema en 118,8 m³/h, a 31,2 m: un 37 % más que una sola bomba. El doble, 173,2 m³/h, no se alcanza porque el sistema pide más cabeza con más caudal.', dur: 2.2, ir: function (S, t) {
        D.ver(S.g30, 0.35 * (1 - t)); D.ver(S.pP, T(t, 0, 0.4)); D.ver(S.tP, T(t, 0.1, 0.5)); D.ver(S.doble, T(t, 0.5, 1));
      } },
      { texto: 'Cada bomba pasa la mitad, 59,4 m³/h, a 31,2 m: sube por su curva y queda a la izquierda de donde trabajaba sola.', dur: 1.8, ir: function (S, t) { D.ver(S.cada, t); } }
    ]
  });

  /* Dos bombas en serie, y cuándo gana cada arreglo. */
  var F = 0.006;   // un sistema de pura fricción, H_sis = 0,006 Q²: dato del libro para comparar
  var Q1f = Math.sqrt(A / (B + F)), QPf = Math.sqrt(A / (B / 4 + F)), QSf = Math.sqrt(2 * A / (2 * B + F));
  ZB.animacion('serie', {
    vista: [0, 0, 640, 350],
    alt: 'Curva de dos bombas en serie: en el sistema de cabeza estática alta el paralelo da más caudal; en uno de pura fricción gana la serie.',
    montar: function (svg) {
      var S = {};
      var e = S.e = ejes(svg, { x: 64, y: 34, w: 540, h: 260, xmin: 0, xmax: 140, ymin: 0, ymax: 80, xt: [0, 20, 40, 60, 80, 100, 120, 140], yt: [0, 20, 40, 60, 80], xr: 'Q (m³/h)', yr: 'H (m)' });
      var g = recorte(svg, 'clip-ser', e);
      S.sis = D.trazo(g, D.camino(curva(function (q) { return C + E * q * q; }, 0, 140), e.X, e.Y), { color: K.tinta2, ancho: 2.4 });
      S.fric = D.trazo(g, D.camino(curva(function (q) { return F * q * q; }, 0, 116), e.X, e.Y), { color: K.naranja, ancho: 2.4 });
      S.una = D.trazo(g, D.camino(curva(function (q) { return A - B * q * q; }, 0, 126.5, 0.5), e.X, e.Y), { color: K.serie[0], ancho: 2.6 });
      S.ser = D.trazo(g, D.camino(curva(function (q) { return 2 * (A - B * q * q); }, 0, 126.5, 0.5), e.X, e.Y), { color: K.serie[2], ancho: 2.8 });
      S.par = D.trazo(g, D.camino(curva(function (q) { return A - B * q * q / 4; }, 0, 140), e.X, e.Y), { color: K.serie[1], ancho: 2, guion: '7 5' });
      S.rSis = rotulo(svg, e.X(138), e.Y(C + E * 138 * 138) + 18, 'sistema', K.tinta2, 'end');
      S.rFric = rotulo(svg, e.X(112) - 6, e.Y(F * 112 * 112) + 4, 'pura fricción', K.naranja, 'end');
      S.rUna = rotulo(svg, e.X(20), e.Y(30.5), 'una bomba', K.serie[0]);
      S.rSer = rotulo(svg, e.X(40), e.Y(2 * (A - B * 40 * 40)) - 10, 'dos en serie', K.serie[2]);
      S.rPar = rotulo(svg, e.X(138), e.Y(A - B * 138 * 138 / 4) + 20, 'dos en paralelo', K.serie[1], 'end');
      // a 60 m³/h, la cabeza de una y el doble
      S.g60 = s('g', { opacity: 0 }, svg);
      s('line', { x1: e.X(60), x2: e.X(60), y1: e.Y(0), y2: e.Y(62), stroke: K.tinta2, 'stroke-width': 1.2, 'stroke-dasharray': '5 4' }, S.g60);
      D.punto(S.g60, e.X(60), e.Y(31), { r: 5, color: K.blanco, borde: K.serie[0] });
      S.f60 = D.flechaViva(S.g60, { color: K.serie[2], ancho: 2.2 });
      S.p60 = D.punto(S.g60, e.X(60), e.Y(62), { r: 5, color: K.blanco, borde: K.serie[2] });
      D.t(S.g60, e.X(60) + 8, e.Y(31) + 16, '31 m', { tam: 12, peso: 650, color: K.serie[0], halo: true });
      S.t60 = D.t(S.g60, e.X(60) + 8, e.Y(62) - 6, '62 m', { tam: 12, peso: 650, color: K.serie[2], halo: true });
      S.p1 = punto(svg, e.X(Q1), e.Y(H1));
      S.pS = punto(svg, e.X(QS), e.Y(HS));
      S.tS = rotulo(svg, e.X(QS) - 8, e.Y(HS) + 22, 'serie: ' + n(QS, 1), K.serie[2], 'end');
      S.pP = punto(svg, e.X(QP), e.Y(HP), K.blanco);
      S.tP = rotulo(svg, e.X(QP) + 2, e.Y(HP) - 12, 'paralelo: ' + n(QP, 1), K.serie[1], 'middle');
      S.pSf = punto(svg, e.X(QSf), e.Y(F * QSf * QSf));
      S.tSf = rotulo(svg, e.X(QSf) + 10, e.Y(F * QSf * QSf) + 4, 'serie: ' + n(QSf, 1), K.serie[2]);
      S.pPf = punto(svg, e.X(QPf), e.Y(F * QPf * QPf), K.blanco);
      S.tPf = rotulo(svg, e.X(QPf) - 8, e.Y(F * QPf * QPf) - 16, 'paralelo: ' + n(QPf, 1), K.serie[1], 'end');
      return S;
    },
    pasos: [
      { texto: 'La misma bomba y el mismo sistema: una sola pasa 86,6 m³/h a 21,3 m.', dur: 1.8, ir: function (S, t) {
        S.sis.dibujar(T(t, 0, 0.45)); S.una.dibujar(T(t, 0.3, 0.8)); D.ver(S.rSis, T(t, 0.3, 0.5)); D.ver(S.rUna, T(t, 0.6, 0.8)); D.ver(S.p1, T(t, 0.8, 1));
      } },
      { texto: 'En serie pasa el mismo caudal por las dos y las cabezas se suman. A 60 m³/h una bomba da 31 m; dos en serie dan 62 m.', dur: 2, ir: function (S, t) {
        var e = S.e; D.ver(S.g60, T(t, 0, 0.25));
        S.f60(e.X(60), e.Y(31) - 6, e.X(60), e.Y(31 + 31 * T(t, 0.2, 1)) + 4);
        D.ver(S.p60, T(t, 0.9, 1)); D.ver(S.t60, T(t, 0.9, 1));
      } },
      { texto: 'Lo mismo a cada caudal da la curva del par en serie, $H = 2\\,(40 - 0,0025\\,Q^2)$: el doble de alta que la de una sola.', dur: 2, ir: function (S, t) {
        S.ser.dibujar(t); D.ver(S.rSer, T(t, 0.7, 1)); D.ver(S.g60, 1 - 0.7 * T(t, 0.5, 1));
      } },
      { texto: 'La serie cruza el sistema en 103,8 m³/h, a 26,2 m; el paralelo daba 118,8. Con mucha cabeza estática gana el paralelo.', dur: 2.2, ir: function (S, t) {
        D.ver(S.g60, 0.3 * (1 - t)); D.ver(S.pS, T(t, 0, 0.3)); D.ver(S.tS, T(t, 0.1, 0.4));
        S.par.dibujar(T(t, 0.3, 0.7)); D.ver(S.rPar, T(t, 0.5, 0.8)); D.ver(S.pP, T(t, 0.7, 1)); D.ver(S.tP, T(t, 0.75, 1));
      } },
      { texto: 'En un sistema de pura fricción, $H_{sis} = 0,006\\,Q^2$, la serie pasa 85,3 m³/h y el paralelo 77,7: ahí gana la serie.', dur: 2.4, ir: function (S, t) {
        var f = 1 - 0.75 * T(t, 0, 0.3);
        [S.sis, S.rSis, S.pS, S.pP, S.p1].forEach(function (x) { x.setAttribute('opacity', f); });
        [S.tS, S.tP].forEach(function (x) { x.setAttribute('opacity', 1 - T(t, 0, 0.3)); });
        S.fric.dibujar(T(t, 0.2, 0.6)); D.ver(S.rFric, T(t, 0.5, 0.7));
        D.ver(S.pSf, T(t, 0.65, 0.85)); D.ver(S.tSf, T(t, 0.7, 0.9)); D.ver(S.pPf, T(t, 0.8, 1)); D.ver(S.tPf, T(t, 0.85, 1));
      } }
    ]
  });

  /* La bomba que queda sola: dos bombas del caso con el impulsor de 203 mm en paralelo. */
  var CB = window.CARTA_BOMBA, d203 = CB.D['203'];
  var qB = d203.qB, hB = d203.hB, Qc = 0.98 * qB, Hc = D.carta('203', Qc, 0), kSis = (Hc - 10) / Math.pow(2 * Qc, 2);
  var qSola = (function () {
    var lo = Qc, hi = 35.9;
    for (var i = 0; i < 60; i++) { var m = (lo + hi) / 2; if (D.carta('203', m, 0) - (10 + kSis * m * m) > 0) lo = m; else hi = m; }
    return lo;
  })();
  var hSola = 10 + kSis * qSola * qSola;
  ZB.animacion('sola', {
    vista: [0, 0, 640, 350],
    alt: 'Dos bombas del caso con el impulsor de 203 mm en paralelo trabajan cada una al 98 % de su mejor punto; si una se apaga, la otra queda en 35,7 m³/h, al 137 %, más allá del final de su curva.',
    montar: function (svg) {
      var S = {};
      var e = S.e = ejes(svg, { x: 64, y: 34, w: 540, h: 260, xmin: 0, xmax: 60, ymin: 0, ymax: 30, xt: [0, 10, 20, 30, 40, 50, 60], yt: [0, 5, 10, 15, 20, 25, 30], xr: 'Q (m³/h)', yr: 'H (m)' });
      var g = recorte(svg, 'clip-sola', e);
      // zonas: más allá del 120 % y del final de la curva publicada (130 %)
      S.zona = s('g', { opacity: 0 }, g);
      s('rect', { x: e.X(1.2 * qB), y: e.Y(30), width: e.X(60) - e.X(1.2 * qB), height: e.Y(0) - e.Y(30), fill: K.caliente, opacity: 0.35 }, S.zona);
      [[1.2, '120 %'], [1.3, '130 %: fin de la curva']].forEach(function (z, i) {
        s('line', { x1: e.X(z[0] * qB), x2: e.X(z[0] * qB), y1: e.Y(0), y2: e.Y(30), stroke: K.calienteO, 'stroke-width': 1.3, 'stroke-dasharray': '5 4' }, S.zona);
        D.t(S.zona, e.X(z[0] * qB) + 4, e.Y(27.5 - i * 2.6), z[1], { tam: 12, peso: 650, color: K.calienteO });
      });
      S.sis = D.trazo(g, D.camino(curva(function (q) { return 10 + kSis * q * q; }, 0, 60), e.X, e.Y), { color: K.tinta2, ancho: 2.4 });
      var una = []; for (var q = 0; q <= 36; q += 0.5) una.push([q, D.carta('203', q, 0)]);
      var par = una.map(function (p) { return [2 * p[0], p[1]]; });
      S.una = D.trazo(g, D.camino(una, e.X, e.Y), { color: K.serie[0], ancho: 2.6 });
      S.par = D.trazo(g, D.camino(par, e.X, e.Y), { color: K.serie[1], ancho: 2.8 });
      S.rSis = rotulo(svg, e.X(58), e.Y(10 + kSis * 58 * 58) - 10, 'sistema', K.tinta2, 'end');
      S.rUna = rotulo(svg, e.X(8), e.Y(D.carta('203', 8, 0)) - 10, 'una bomba, 203 mm', K.serie[0]);
      S.rPar = rotulo(svg, e.X(59.5), e.Y(D.carta('203', 29.75, 0)) + 20, 'dos en paralelo', K.serie[1], 'end');
      // el mejor punto
      S.bep = s('path', { d: 'M' + e.X(qB) + ' ' + (e.Y(hB) - 8) + 'l7 8l-7 8l-7 -8z', fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.6, opacity: 0 }, svg);
      S.pPar = punto(svg, e.X(2 * Qc), e.Y(Hc));
      S.tPar = rotulo(svg, e.X(58), e.Y(28.2), 'las dos: ' + n(2 * Qc, 1) + ' m³/h', K.tinta, 'end');
      S.pCada = punto(svg, e.X(Qc), e.Y(Hc), K.blanco);
      S.tCada = rotulo(svg, e.X(Qc) - 12, e.Y(Hc) + 22, 'cada una: ' + n(Qc, 1) + ' m³/h, 98 %', K.serie[0], 'end');
      S.mov = D.punto(svg, 0, 0, { r: 7 }); S.mov.setAttribute('opacity', 0);
      S.tSola = rotulo(svg, e.X(qSola) + 10, e.Y(hSola) + 22, 'sola: ' + n(qSola, 1) + ' m³/h, ' + n(100 * qSola / qB, 0) + ' %', K.alerta);
      return S;
    },
    pasos: [
      { texto: 'Dos bombas del caso con el impulsor de 203 mm, en paralelo. El par cruza el sistema en ' + n(2 * Qc, 1) + ' m³/h.', dur: 2.4, ir: function (S, t) {
        S.sis.dibujar(T(t, 0, 0.4)); S.una.dibujar(T(t, 0.2, 0.6)); S.par.dibujar(T(t, 0.4, 0.8));
        D.ver(S.rSis, T(t, 0.3, 0.5)); D.ver(S.rUna, T(t, 0.5, 0.7)); D.ver(S.rPar, T(t, 0.7, 0.9));
        D.ver(S.pPar, T(t, 0.85, 1)); D.ver(S.tPar, T(t, 0.85, 1));
      } },
      { texto: 'Cada bomba pasa ' + n(Qc, 1) + ' m³/h, el 98 % del caudal de su mejor punto (el rombo): bien adentro de su ventana.', dur: 1.6, ir: function (S, t) {
        D.ver(S.bep, T(t, 0, 0.5)); D.ver(S.pCada, T(t, 0.3, 0.8)); D.ver(S.tCada, T(t, 0.4, 1));
      } },
      { texto: 'Se apaga una. El punto baja por la curva del sistema hasta la de una sola bomba: ' + n(qSola, 1) + ' m³/h, el ' + n(100 * qSola / qB, 0) + ' % de su mejor punto.', dur: 2.4, ir: function (S, t) {
        var e = S.e, q = 2 * Qc + (qSola - 2 * Qc) * t;
        S.mov.setAttribute('cx', e.X(q)); S.mov.setAttribute('cy', e.Y(10 + kSis * q * q)); D.ver(S.mov, Math.min(1, t * 5));
        D.ver(S.pPar, 1 - 0.6 * t); D.ver(S.tPar, 1 - 0.6 * t); D.ver(S.pCada, 1 - 0.6 * t); D.ver(S.tCada, 1 - 0.6 * t); D.ver(S.par, 1 - 0.5 * t);
        D.ver(S.tSola, T(t, 0.8, 1));
      } },
      { texto: 'Sulzer pide que la bomba sola no pase de unos 120 % de su mejor punto, y la curva publicada termina en el 130 %. Esta queda más allá de los dos, donde el NPSH requerido se dispara.', dur: 1.8, ir: function (S, t) { D.ver(S.zona, t); } }
    ]
  });

  /* Reto: puntos de operación de una, dos en paralelo y dos en serie. */
  function datos(r) {
    var a = r.entre(30, 60, 0), b = r.entre(0.0015, 0.004, 4), c = r.entre(4, Math.round(a * 0.45), 0), d = r.entre(0.0008, 0.003, 4);
    return { a: a, b: b, c: c, d: d };
  }
  function enun(x, que) {
    return '<p>Una bomba de curva $H = ' + n(x.a, 0) + ' - ' + n(x.b, 4) + '\\,Q^2$ trabaja en un sistema $H_{sis} = ' + n(x.c, 0) + ' + ' + n(x.d, 4) + '\\,Q^2$, con $Q$ en m³/h y $H$ en m. ' + que + '</p>';
  }
})();

/* 11-09-npsh.js: se escribe en interactivo/bombas/secciones/ y se trae con node interactivo/al-libro.mjs. No se edita aquí. */
/* 11.9 NPSH y cavitación: cuatro animaciones y el reto. Los datos salen del modelo de la bomba del caso
   (en/figuras/11/datos.json): la presión a lo largo de la bomba, las piezas del NPSH disponible, el NPSH
   disponible contra la temperatura y las curvas de NPSH del caso que cavita. */
(function () {
  'use strict';
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, T = ZB.tramo;
  var g = 9.81;

  // Presión absoluta, en metros de líquido, a lo largo de la bomba: brida de succión, ojo, borde de ataque
  // del álabe, salida del impulsor, voluta y brida de descarga.
  var LUGAR = [[0, 'brida de', 'succión'], [1, 'ojo', ''], [1.3, 'borde de', 'ataque'], [2.2, 'salida del', 'impulsor'], [3.1, 'voluta', ''], [4, 'brida de', 'descarga']];
  var BASE = { pv: 0.3229, p: [8.8142, 8.7936, 8.0642, 20.6618, 23.6139, 24.8791] };
  var CAV = { pv: 2.0601, p: [3.8636, 3.8281, 1.1262, 50.1054, 62.8253, 68.2767] };
  function pAt(c, x) {           // interpolación lineal entre los seis puntos
    for (var i = 1; i < LUGAR.length; i++) if (x <= LUGAR[i][0]) {
      var x0 = LUGAR[i - 1][0], x1 = LUGAR[i][0];
      return c.p[i - 1] + (c.p[i] - c.p[i - 1]) * (x - x0) / (x1 - x0);
    }
    return c.p[c.p.length - 1];
  }
  function cruce(c, x0, x1) {    // dónde la presión pasa por la de vapor entre x0 y x1
    for (var i = 0; i < 60; i++) { var m = (x0 + x1) / 2; if ((pAt(c, x0) - c.pv) * (pAt(c, m) - c.pv) <= 0) x1 = m; else x0 = m; }
    return (x0 + x1) / 2;
  }
  var xA = cruce(CAV, 1, 1.3), xB = cruce(CAV, 1.3, 2.2);

  function recorte(svg, id, x, y, w, h) {
    var defs = s('defs', {}, svg), cp = s('clipPath', { id: id }, defs);
    s('rect', { x: x, y: y, width: w, height: h }, cp);
    return s('g', { 'clip-path': 'url(#' + id + ')' }, svg);
  }
  function oculto(el) { el.setAttribute('opacity', 0); return el; }
  function burbuja(padre) {
    var b = s('g', { opacity: 0 }, padre);
    var c = s('circle', { r: 0, fill: K.blanco, stroke: K.flujo, 'stroke-width': 1.4 }, b);
    var est = s('g', { opacity: 0, stroke: K.alerta, 'stroke-width': 1.6, 'stroke-linecap': 'round' }, b);
    for (var k = 0; k < 6; k++) { var a = k * Math.PI / 3; s('line', { x1: 3 * Math.cos(a), y1: 3 * Math.sin(a), x2: 8 * Math.cos(a), y2: 8 * Math.sin(a) }, est); }
    return { g: b, c: c, est: est };
  }

  // Una burbuja va a media altura entre la presión de vapor y la presión del líquido, mientras esta es menor.
  function yBur(S, x, i) { var p = Math.min(pAt(CAV, x), CAV.pv); return S.LY((p + CAV.pv) / 2) + (i % 2 ? 2 : -2); }

  /* La presión a lo largo de la bomba, en el caso base y en el que cavita. */
  ZB.animacion('presion-bomba', {
    vista: [0, 0, 640, 350],
    alt: 'Presión absoluta a lo largo de la bomba. En el caso base el mínimo, en el borde de ataque del álabe, queda 7,74 m por encima de la presión de vapor; con el tanque bajo el eje, agua a 60 °C y 3500 r/min baja 0,93 m por debajo, y nacen burbujas que colapsan dentro del impulsor.',
    montar: function (svg) {
      var S = {};
      var X0 = 72, W = 532, Y0 = 34, H = 236;
      var X = S.X = function (x) { return X0 + x / 4 * W; };
      var Y = S.Y = function (p) { return Y0 + H - p / 26 * H; };
      [0, 5, 10, 15, 20, 25].forEach(function (v) {
        s('line', { x1: X0, x2: X0 + W, y1: Y(v), y2: Y(v), stroke: K.rejilla, 'stroke-width': 1 }, svg);
        D.t(svg, X0 - 6, Y(v) + 4, ZB.num(v, 0), { tam: 12, ancla: 'end', color: K.tinta2 });
      });
      LUGAR.forEach(function (l) {
        s('line', { x1: X(l[0]), x2: X(l[0]), y1: Y0, y2: Y0 + H, stroke: K.rejilla, 'stroke-width': 1 }, svg);
        D.t(svg, X(l[0]), Y0 + H + 18, l[1], { tam: 12, ancla: 'middle', color: K.tinta2 });
        if (l[2]) D.t(svg, X(l[0]), Y0 + H + 33, l[2], { tam: 12, ancla: 'middle', color: K.tinta2 });
      });
      s('path', { d: 'M' + X0 + ' ' + Y0 + 'V' + (Y0 + H) + 'H' + (X0 + W), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      D.t(svg, X0 - 2, Y0 - 12, 'presión absoluta (m de líquido)', { tam: 13, peso: 600 });
      var gr = recorte(svg, 'clip-pres', X0, Y0, W, H);
      function linea(c) { return 'M' + c.p.map(function (p, i) { return X(LUGAR[i][0]).toFixed(1) + ' ' + Y(p).toFixed(1); }).join('L'); }
      // caso base
      S.base = D.trazo(gr, linea(BASE), { color: K.serie[0], ancho: 2.6 });
      S.pvBase = oculto(s('line', { x1: X0, x2: X0 + W, y1: Y(BASE.pv), y2: Y(BASE.pv), stroke: K.serie[0], 'stroke-width': 1.4, 'stroke-dasharray': '6 4' }, svg));
      S.tpvBase = oculto(D.t(svg, X0 + W - 4, Y(BASE.pv) - 5, 'presión de vapor a 25 °C: 0,32 m', { tam: 12, ancla: 'end', color: K.serie[0], peso: 600, halo: true }));
      S.margen = oculto(s('g', {}, svg));
      D.flecha(S.margen, X(1.3) + 16, Y(BASE.pv) - 2, X(1.3) + 16, Y(BASE.p[2]) + 3, { color: K.serie[0], ancho: 1.4, punta: 7 });
      D.flecha(S.margen, X(1.3) + 16, Y(BASE.p[2]) + 3, X(1.3) + 16, Y(BASE.pv) - 2, { color: K.serie[0], ancho: 1.4, punta: 7 });
      D.t(S.margen, X(1.3) + 24, Y(4.5), '7,74 m', { tam: 13, peso: 700, color: K.serie[0], halo: true });
      S.tBase = oculto(D.t(svg, X(4) - 4, Y(BASE.p[5]) - 10, 'caso base', { tam: 13, peso: 650, ancla: 'end', color: K.serie[0], halo: true }));
      // caso que cavita
      S.cav = D.trazo(gr, linea(CAV), { color: K.alerta, ancho: 2.6 });
      S.pvCav = oculto(s('line', { x1: X0, x2: X0 + W, y1: Y(CAV.pv), y2: Y(CAV.pv), stroke: K.alerta, 'stroke-width': 1.4, 'stroke-dasharray': '6 4' }, svg));
      S.tpvCav = oculto(D.t(svg, X0 + W - 4, Y(CAV.pv) - 6, 'presión de vapor a 60 °C: 2,06 m', { tam: 12, ancla: 'end', color: K.alerta, peso: 600, halo: true }));
      S.tCav = oculto(D.t(svg, X(1.72) - 6, Y(24.2), 'sube a 68,3 m en la descarga', { tam: 12.5, peso: 650, color: K.alerta, ancla: 'end', halo: true }));
      S.sombra = oculto(s('path', { d: 'M' + X(xA) + ' ' + Y(CAV.pv) + 'L' + X(1.3) + ' ' + Y(CAV.p[2]) + 'L' + X(xB) + ' ' + Y(CAV.pv) + 'Z', fill: K.alerta }, gr));
      // la lupa: el borde de ataque, ampliado
      var lx = 396, ly = 118, lw = 200, lh = 116, ax = 1.05, bx = 1.5, ap = 0, bp = 4.5;
      var LX = function (x) { return lx + (x - ax) / (bx - ax) * lw; }, LY = function (p) { return ly + lh - (p - ap) / (bp - ap) * lh; };
      S.lupa = oculto(s('g', {}, svg));
      s('rect', { x: lx, y: ly, width: lw, height: lh, fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.2, rx: 4 }, S.lupa);
      s('line', { x1: X(1.3) + 4, y1: Y(CAV.p[2]), x2: lx, y2: ly + lh - 10, stroke: K.guia, 'stroke-width': 1, 'stroke-dasharray': '3 3' }, S.lupa);
      var gl = recorte(S.lupa, 'clip-lupa', lx, ly, lw, lh);
      var pts = []; for (var x = ax; x <= bx + 1e-9; x += 0.005) pts.push(LX(x).toFixed(1) + ' ' + LY(pAt(CAV, x)).toFixed(1));
      s('path', { d: 'M' + LX(xA) + ' ' + LY(CAV.pv) + 'L' + LX(1.3) + ' ' + LY(CAV.p[2]) + 'L' + LX(xB) + ' ' + LY(CAV.pv) + 'Z', fill: K.alerta, opacity: 0.18 }, gl);
      s('path', { d: 'M' + pts.join('L'), fill: 'none', stroke: K.alerta, 'stroke-width': 2.4 }, gl);
      s('line', { x1: lx, x2: lx + lw, y1: LY(CAV.pv), y2: LY(CAV.pv), stroke: K.alerta, 'stroke-width': 1.3, 'stroke-dasharray': '6 4' }, gl);
      D.t(S.lupa, lx + 6, ly + 16, 'el borde de ataque, ampliado', { tam: 11.5, peso: 650, color: K.tinta2 });
      D.t(S.lupa, LX(1.3), LY(CAV.p[2]) + 16, '1,13 m', { tam: 11.5, peso: 700, color: K.alerta, ancla: 'middle' });
      D.t(S.lupa, lx + lw - 6, LY(CAV.pv) - 5, 'p_v', { tam: 11.5, peso: 650, color: K.alerta, ancla: 'end', it: true });
      S.burbujas = [];
      for (var i = 0; i < 6; i++) S.burbujas.push(burbuja(gl));
      S.LX = LX; S.LY = LY;
      return S;
    },
    pasos: [
      { texto: 'El caso base, con agua a 25 °C. La presión absoluta, en metros de líquido, es de 8,8 m en la brida de succión; baja en el ojo y en el borde de ataque del álabe, y sube en el impulsor y en la voluta hasta 24,9 m.', dur: 2.4, ir: function (S, t) { S.base.dibujar(t); D.ver(S.tBase, T(t, 0.8, 1)); } },
      { texto: 'La presión de vapor del agua a 25 °C es de 0,32 m. El mínimo, en el borde de ataque, queda 7,74 m por encima: no hay burbujas.', dur: 1.8, ir: function (S, t) { D.ver(S.pvBase, T(t, 0, 0.4)); D.ver(S.tpvBase, T(t, 0.2, 0.5)); D.ver(S.margen, T(t, 0.5, 1)); } },
      { texto: 'Ahora el tanque 3 m por debajo del eje, el agua a 60 °C y la bomba a 3500 r/min. La succión llega con 3,9 m y la presión de vapor sube a 2,06 m.', dur: 2.4, ir: function (S, t) {
        var f = 1 - 0.7 * T(t, 0, 0.3);
        [S.base, S.pvBase, S.tpvBase, S.margen, S.tBase].forEach(function (x) { x.setAttribute('opacity', f); });
        D.ver(S.pvCav, T(t, 0.2, 0.4)); D.ver(S.tpvCav, T(t, 0.25, 0.45)); S.cav.dibujar(T(t, 0.35, 1)); D.ver(S.tCav, T(t, 0.85, 1));
      } },
      { texto: 'En el borde de ataque la presión baja a 1,13 m, 0,93 m por debajo de la de vapor: ahí el agua hierve y nacen las burbujas.', dur: 2.2, ir: function (S, t) {
        D.ver(S.sombra, 0.3 * T(t, 0, 0.3)); D.ver(S.lupa, T(t, 0.1, 0.4));
        S.burbujas.forEach(function (b, i) {
          var u = T(t, 0.4 + i * 0.07, 0.7 + i * 0.05), x = xA + 0.02 + (1.3 - xA - 0.02) * (i / 6);
          b.g.setAttribute('opacity', u > 0 ? 1 : 0);
          b.g.setAttribute('transform', 'translate(' + S.LX(x).toFixed(1) + ' ' + yBur(S, x, i).toFixed(1) + ')');
          b.c.setAttribute('r', 1.5 + 3 * u); b.est.setAttribute('opacity', 0);
        });
      } },
      { texto: 'Las burbujas viajan con el flujo hacia donde la presión sube y colapsan, todavía dentro del impulsor. Cada colapso junto a una pared la golpea con un microchorro.', dur: 3, ir: function (S, t) {
        S.burbujas.forEach(function (b, i) {
          var x0 = xA + 0.02 + (1.3 - xA - 0.02) * (i / 6), u = T(t, i * 0.08, 0.55 + i * 0.08);
          var x = x0 + (xB + 0.05 - x0) * u, r;
          if (x < xB) r = 4.5 + 2 * u; else r = Math.max(0, 6.5 * (1 - (x - xB) / 0.05));
          b.g.setAttribute('transform', 'translate(' + S.LX(x).toFixed(1) + ' ' + yBur(S, x, i).toFixed(1) + ')');
          b.c.setAttribute('r', r.toFixed(2));
          b.est.setAttribute('opacity', x >= xB + 0.03 ? 1 : 0);
          b.g.setAttribute('opacity', 1);
        });
      } }
    ]
  });

  /* Cómo se arma el NPSH disponible del caso: barras en cascada. */
  ZB.animacion('barras-npsha', {
    vista: [0, 0, 640, 350],
    alt: 'El NPSH disponible del caso se arma con la atmósfera de Bogotá, 7,54 m, el tanque abierto, el nivel de 2,00 m sobre el eje, las pérdidas de 0,60 m y la presión de vapor de 0,32 m: 8,62 m contra 0,68 m de NPSH3.',
    montar: function (svg) {
      var S = {};
      var e = D.ejes(svg, { x: 64, y: 36, w: 548, h: 240, xmin: 0, xmax: 7, ymin: 0, ymax: 10, yt: [0, 2, 4, 6, 8, 10], yr: 'm de agua' });
      var cols = [
        ['atmósfera', 'de Bogotá', 0, 7.540, K.aguaM, '7,54'],
        ['tanque', 'abierto', 7.540, 7.540, K.aguaM, '0'],
        ['nivel sobre', 'el eje', 7.540, 9.540, K.aguaM, '+2,00'],
        ['pérdidas de', 'la succión', 9.540, 8.943, K.caliente, '−0,60'],
        ['presión', 'de vapor', 8.943, 8.620, K.caliente, '−0,32'],
        ['NPSH', 'disponible', 0, 8.620, K.aguaO, '8,62'],
        ['NPSH3', 'de la bomba', 0, 0.676, K.metalM, '0,68']
      ];
      S.c = cols.map(function (c, i) {
        var x = e.X(i + 0.5) - 26, gg = s('g', { opacity: 0 }, svg);
        var r = s('rect', { x: x, width: 52, y: e.Y(Math.max(c[2], c[3])), height: Math.max(1.5, Math.abs(e.Y(c[2]) - e.Y(c[3]))), fill: c[4], stroke: K.tinta, 'stroke-width': 1.2 }, gg);
        D.t(gg, x + 26, e.Y(Math.max(c[2], c[3])) - 8, c[5] + ' m', { tam: 13, peso: 700, ancla: 'middle', halo: true });
        D.t(svg, x + 26, e.Y(0) + 18, c[0], { tam: 12, ancla: 'middle', color: K.tinta2 });
        D.t(svg, x + 26, e.Y(0) + 33, c[1], { tam: 12, ancla: 'middle', color: K.tinta2 });
        if (i > 0 && i < 6) s('line', { x1: x - 26, x2: x, y1: e.Y(c[2]), y2: e.Y(c[2]), stroke: K.tinta2, 'stroke-width': 1, 'stroke-dasharray': '3 3' }, gg);
        return { g: gg, r: r, y0: c[2], y1: c[3], e: e };
      });
      S.sobra = oculto(s('g', {}, svg));
      var xs = e.X(6.5) + 34;
      D.flecha(S.sobra, xs, e.Y(0.676) - 2, xs, e.Y(8.62) + 2, { color: K.oliva, ancho: 1.6, punta: 8 });
      D.t(S.sobra, xs - 4, e.Y(5), 'sobran', { tam: 12.5, peso: 650, color: K.olivaOsc, ancla: 'end', halo: true });
      D.t(S.sobra, xs - 4, e.Y(5) + 16, '7,94 m', { tam: 12.5, peso: 700, color: K.olivaOsc, ancla: 'end', halo: true });
      return S;
    },
    pasos: [
      { texto: 'La atmósfera de Bogotá, 73,7 kPa, equivale a 7,54 m de agua: es lo que empuja el agua hacia la bomba. El tanque está abierto, así que no suma nada más.', dur: 2, ir: function (S, t) { crecer(S.c[0], t); D.ver(S.c[1].g, T(t, 0.7, 1)); } },
      { texto: 'El nivel está 2,00 m por encima del eje: la succión inundada suma 2,00 m.', dur: 1.4, ir: function (S, t) { crecer(S.c[2], t); } },
      { texto: 'La succión pierde 0,60 m a 27,3 m³/h, y esa energía ya no llega a la bomba.', dur: 1.4, ir: function (S, t) { crecer(S.c[3], t); } },
      { texto: 'Se resta la presión de vapor del agua a 25 °C, 0,32 m: lo que el agua necesita para no hervir.', dur: 1.4, ir: function (S, t) { crecer(S.c[4], t); } },
      { texto: 'Quedan 8,62 m disponibles contra 0,68 m de NPSH3: sobran casi 8 m.', dur: 2, ir: function (S, t) { crecer(S.c[5], T(t, 0, 0.6)); crecer(S.c[6], T(t, 0.3, 0.8)); D.ver(S.sobra, T(t, 0.7, 1)); } }
    ]
  });
  function crecer(c, t) {
    var e = c.e, y = c.y0 + (c.y1 - c.y0) * t;
    D.ver(c.g, t > 0 ? 1 : 0);
    c.r.setAttribute('y', e.Y(Math.max(c.y0, y)));
    c.r.setAttribute('height', Math.max(1.5, Math.abs(e.Y(c.y0) - e.Y(y))));
  }

  /* El NPSH disponible del caso contra la temperatura del agua. */
  var TEMP = [[1, 8.855], [3, 8.845], [5, 8.833], [7, 8.82], [9, 8.806], [11, 8.791], [13, 8.774], [15, 8.755], [17, 8.733], [19, 8.71], [21, 8.683], [23, 8.653], [25, 8.62], [27, 8.584], [29, 8.543], [31, 8.497], [33, 8.447], [35, 8.391], [37, 8.329], [39, 8.261], [41, 8.185], [43, 8.102], [45, 8.011], [47, 7.911], [49, 7.801], [51, 7.681], [53, 7.55], [55, 7.406], [57, 7.25], [59, 7.08], [61, 6.895], [63, 6.694], [65, 6.477], [67, 6.241], [69, 5.986], [71, 5.711], [73, 5.414], [75, 5.093], [77, 4.748], [79, 4.377], [81, 3.979], [83, 3.55], [85, 3.091], [85.5, 2.972], [86, 2.85], [86.5, 2.726], [87, 2.6], [87.5, 2.471], [88, 2.341], [88.5, 2.208], [89, 2.073], [89.5, 1.936], [90, 1.796], [90.5, 1.654], [91, 1.51], [91.3, 1.40]];
  function nT(x) { for (var i = 1; i < TEMP.length; i++) if (x <= TEMP[i][0]) { var a = TEMP[i - 1], b = TEMP[i]; return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); } return TEMP[TEMP.length - 1][1]; }
  function hasta(x1) { return TEMP.filter(function (p) { return p[0] <= x1; }).concat([[x1, nT(x1)]]); }
  ZB.animacion('npsha-temperatura', {
    vista: [0, 0, 640, 340],
    alt: 'El NPSH disponible del caso contra la temperatura del agua: cambia poco hasta 60 °C y se desploma cerca de la ebullición; a 91,3 °C el agua hierve en Bogotá y quedan 1,40 m, el doble del NPSH3 de la bomba.',
    montar: function (svg) {
      var S = {};
      var e = S.e = D.ejes(svg, { x: 64, y: 34, w: 540, h: 250, xmin: 0, xmax: 100, ymin: 0, ymax: 10, xt: [0, 20, 40, 60, 80, 100], yt: [0, 2, 4, 6, 8, 10], xr: 'temperatura del agua (°C)', yr: 'NPSH disponible (m)' });
      S.tramos = [25, 60, 90, 91.3].map(function (x1) { return D.trazo(svg, D.camino(hasta(x1), e.X, e.Y), { color: K.serie[0], ancho: 2.8 }); });
      S.p25 = oculto(D.punto(svg, e.X(25), e.Y(8.62)));
      S.t25 = oculto(D.t(svg, e.X(25), e.Y(8.62) + 24, '25 °C: 8,62 m', { tam: 12.5, peso: 650, ancla: 'middle', halo: true }));
      S.p60 = oculto(D.punto(svg, e.X(60), e.Y(nT(60)), { r: 5, color: K.blanco, borde: K.serie[0] }));
      S.t60 = oculto(D.t(svg, e.X(60), e.Y(nT(60)) + 22, '60 °C: ' + n(nT(60), 1) + ' m', { tam: 12.5, peso: 650, ancla: 'middle', halo: true }));
      S.p80 = oculto(D.punto(svg, e.X(80), e.Y(nT(80)), { r: 5, color: K.blanco, borde: K.serie[0] }));
      S.t80 = oculto(D.t(svg, e.X(80) - 10, e.Y(nT(80)) + 4, '80 °C: ' + n(nT(80), 1) + ' m', { tam: 12.5, peso: 650, ancla: 'end', halo: true }));
      S.p90 = oculto(D.punto(svg, e.X(90), e.Y(nT(90)), { r: 5, color: K.blanco, borde: K.serie[0] }));
      S.t90 = oculto(D.t(svg, e.X(90) - 10, e.Y(nT(90)) + 18, '90 °C: ' + n(nT(90), 1) + ' m', { tam: 12.5, peso: 650, ancla: 'end', halo: true }));
      S.hierve = oculto(s('g', {}, svg));
      s('line', { x1: e.X(91.3), x2: e.X(91.3), y1: e.Y(0), y2: e.Y(9.6), stroke: K.alerta, 'stroke-width': 1.4, 'stroke-dasharray': '5 4' }, S.hierve);
      D.t(S.hierve, e.X(91.3) - 6, e.Y(9.75), 'hierve en Bogotá: 91,3 °C', { tam: 12.5, peso: 650, ancla: 'end', color: K.alerta, halo: true });
      D.punto(S.hierve, e.X(91.3), e.Y(1.40), { r: 6 });
      D.t(S.hierve, e.X(91.3) + 8, e.Y(1.40) - 8, '1,40 m', { tam: 12.5, peso: 700, halo: true });
      S.n3 = oculto(s('g', {}, svg));
      s('line', { x1: e.X(0), x2: e.X(100), y1: e.Y(0.676), y2: e.Y(0.676), stroke: K.tinta, 'stroke-width': 1.6, 'stroke-dasharray': '7 4' }, S.n3);
      D.t(S.n3, e.X(2), e.Y(0.676) - 7, 'NPSH3 de la bomba: 0,68 m', { tam: 12.5, peso: 650, halo: true });
      return S;
    },
    pasos: [
      { texto: 'A 25 °C, el NPSH disponible del caso es de 8,62 m.', dur: 1.4, ir: function (S, t) { S.tramos[0].dibujar(t); D.ver(S.p25, T(t, 0.6, 1)); D.ver(S.t25, T(t, 0.7, 1)); } },
      { texto: 'Hasta unos 60 °C cambia poco: a 60 °C queda en ' + n(nT(60), 1) + ' m.', dur: 1.8, ir: function (S, t) { S.tramos[1].dibujar(t); D.ver(S.p60, T(t, 0.8, 1)); D.ver(S.t60, T(t, 0.85, 1)); } },
      { texto: 'Cerca de la ebullición se desploma, porque la presión de vapor crece casi en forma exponencial: unos ' + n(nT(80), 1) + ' m a 80 °C y ' + n(nT(90), 1) + ' m a 90 °C.', dur: 2.2, ir: function (S, t) {
        S.tramos[2].dibujar(t); D.ver(S.p80, T(t, 0.6, 0.8)); D.ver(S.t80, T(t, 0.65, 0.85)); D.ver(S.p90, T(t, 0.85, 1)); D.ver(S.t90, T(t, 0.9, 1));
      } },
      { texto: 'A 91,3 °C el agua hierve en Bogotá y un tanque abierto no puede estar más caliente. El término de presión se anula y quedan 1,40 m: la altura menos las pérdidas.', dur: 1.8, ir: function (S, t) { S.tramos[3].dibujar(t); D.ver(S.hierve, T(t, 0.4, 1)); } },
      { texto: 'La bomba pide 0,68 m. Aun con el agua hirviendo le quedan 1,40 m, el doble, gracias a los 2 m de succión inundada.', dur: 1.4, ir: function (S, t) { D.ver(S.n3, t); } }
    ]
  });

  /* El caudal máximo antes de cavitar: NPSH disponible y NPSH3 contra caudal, en la instalación que cavita. */
  var NQ = [[0, 2.578, 2.538], [2, 2.577, 2.47], [4, 2.571, 2.409], [6, 2.563, 2.355], [8, 2.551, 2.307], [10, 2.535, 2.266], [12, 2.516, 2.23], [14, 2.493, 2.201], [16, 2.467, 2.177], [18, 2.438, 2.16], [20, 2.405, 2.149], [22, 2.368, 2.144], [23, 2.349, 2.143], [24, 2.328, 2.144], [26, 2.285, 2.151], [28, 2.238, 2.165], [30, 2.188, 2.185], [31, 2.161, 2.197], [32, 2.134, 2.211], [34, 2.077, 2.244], [36, 2.016, 2.279], [38, 1.952, 2.317], [40, 1.884, 2.356], [42, 1.813, 2.397], [44, 1.738, 2.441], [46, 1.66, 2.486], [48, 1.578, 2.534], [50, 1.493, 2.583], [52, 1.405, 2.635], [54, 1.313, 2.688], [56, 1.217, 2.744], [58, 1.118, 2.801], [60, 1.016, 2.861]];
  var Qx = 30.1, Nx = 2.186, QOP = 35.8, NAOP = 2.023, N3OP = 2.275;
  ZB.animacion('npsh-caudal', {
    vista: [0, 0, 640, 340],
    alt: 'NPSH disponible y NPSH3 contra caudal en una instalación con el tanque 3 m bajo el eje, agua a 60 °C y 3500 r/min: se cruzan en 30,1 m³/h; a la derecha la bomba cavita, y con la regla del margen no sirve con ningún caudal.',
    montar: function (svg) {
      var S = {};
      var e = S.e = D.ejes(svg, { x: 64, y: 34, w: 540, h: 250, xmin: 0, xmax: 60, ymin: 0, ymax: 4, xt: [0, 10, 20, 30, 40, 50, 60], yt: [0, 1, 2, 3, 4], dy: 0, xr: 'Q (m³/h)', yr: 'NPSH (m)' });
      S.zona = oculto(s('rect', { x: e.X(Qx), y: e.Y(4), width: e.X(60) - e.X(Qx), height: e.Y(0) - e.Y(4), fill: K.caliente }, svg));
      S.tZona = oculto(D.t(svg, e.X(59), e.Y(3.75), 'la bomba cavita', { tam: 13, peso: 700, ancla: 'end', color: K.calienteO, halo: true }));
      var na = NQ.map(function (p) { return [p[0], p[1]]; }), n3 = NQ.map(function (p) { return [p[0], p[2]]; });
      var mg = NQ.map(function (p) { return [p[0], Math.max(1.25 * p[2], p[2] + 0.6)]; });
      S.na = D.trazo(svg, D.camino(na, e.X, e.Y), { color: K.serie[0], ancho: 2.8 });
      S.n3 = D.trazo(svg, D.camino(n3, e.X, e.Y), { color: K.alerta, ancho: 2.8 });
      S.mg = D.trazo(svg, D.camino(mg, e.X, e.Y), { color: K.alerta, ancho: 1.8, guion: '7 5' });
      S.tna = oculto(D.t(svg, e.X(4), e.Y(2.58) - 10, 'NPSH disponible', { tam: 13, peso: 650, color: K.serie[0], halo: true }));
      S.tn3 = oculto(D.t(svg, e.X(9), e.Y(2.27) + 22, 'NPSH3', { tam: 13, peso: 650, color: K.alerta, halo: true }));
      S.tmg = oculto(D.t(svg, e.X(4), e.Y(3.17) - 8, 'lo que pide la regla del margen', { tam: 12.5, peso: 650, color: K.alerta, halo: true }));
      S.px = oculto(D.punto(svg, e.X(Qx), e.Y(Nx)));
      S.tx = oculto(D.t(svg, e.X(Qx), e.Y(Nx) - 14, n(Qx, 1) + ' m³/h', { tam: 13, peso: 700, ancla: 'middle', halo: true }));
      S.dis = oculto(s('g', {}, svg));
      s('line', { x1: e.X(48), x2: e.X(48), y1: e.Y(0), y2: e.Y(2.534), stroke: K.tinta2, 'stroke-width': 1.2, 'stroke-dasharray': '4 4' }, S.dis);
      D.t(S.dis, e.X(48) + 6, e.Y(0.35), 'diseño: 48 m³/h', { tam: 12.5, peso: 600, color: K.tinta2, halo: true });
      D.flecha(S.dis, e.X(48) + 8, e.Y(1.578) + 1, e.X(48) + 8, e.Y(2.534) - 1, { color: K.alerta, ancho: 1.4, punta: 6 });
      D.t(S.dis, e.X(48) + 14, e.Y(2.06), 'faltan 0,96 m', { tam: 12.5, peso: 700, color: K.alerta, halo: true });
      D.punto(S.dis, e.X(QOP), e.Y(NAOP), { r: 6, color: K.blanco, borde: K.serie[0] });
      D.t(S.dis, e.X(QOP) - 6, e.Y(NAOP) + 20, 'opera en 35,8', { tam: 12.5, peso: 650, ancla: 'end', halo: true });
      return S;
    },
    pasos: [
      { texto: 'Una instalación que cavita: el tanque 3 m por debajo del eje, el agua a 60 °C y la bomba a 3500 r/min. El NPSH disponible arranca en 2,58 m y baja con el caudal, porque crecen las pérdidas de la succión.', dur: 2, ir: function (S, t) { S.na.dibujar(t); D.ver(S.tna, T(t, 0.6, 1)); } },
      { texto: 'El NPSH3 de la bomba tiene su mínimo hacia 23 m³/h y sube con el caudal, cada vez más rápido.', dur: 2, ir: function (S, t) { S.n3.dibujar(t); D.ver(S.tn3, T(t, 0.6, 1)); } },
      { texto: 'Las dos curvas se cruzan en 30,1 m³/h. A la derecha del cruce la bomba no tiene el NPSH que pide: cavita.', dur: 1.8, ir: function (S, t) { D.ver(S.px, T(t, 0, 0.4)); D.ver(S.tx, T(t, 0.2, 0.5)); D.ver(S.zona, 0.4 * T(t, 0.4, 1)); D.ver(S.tZona, T(t, 0.6, 1)); } },
      { texto: 'La instalación se diseñó para 48 m³/h, y ahí faltarían 0,96 m. La bomba se queda en 35,8 m³/h, con 0,25 m menos de lo que pide, y pierde un 20 % de su cabeza.', dur: 2, ir: function (S, t) { D.ver(S.dis, t); } },
      { texto: 'Con la regla del margen, el mayor entre $1,25\\,\\mathrm{NPSH_3}$ y $\\mathrm{NPSH_3} + 0,6$ m, la curva de lo que hace falta queda siempre por encima: esta instalación no sirve con ningún caudal.', dur: 1.8, ir: function (S, t) { S.mg.dibujar(t); D.ver(S.tmg, T(t, 0.3, 1)); } }
    ]
  });

  /* Reto: NPSH disponible y margen, altura mínima de un líquido saturado y velocidad específica de succión. */
  var PV = [[10, 1.23, 999.7], [20, 2.34, 998.2], [25, 3.17, 997.0], [30, 4.25, 995.6], [40, 7.38, 992.2], [50, 12.4, 988.0], [60, 19.9, 983.2], [70, 31.2, 977.7], [80, 47.4, 971.8]];
  var PATM = [[0, 101.3], [1000, 89.9], [1500, 84.5], [2000, 79.5], [2600, 73.7], [3000, 70.1]];
  function margen(N3) { return Math.max(1.25 * N3, N3 + 0.6); }
})();

/* 11-10-liquidos.js: se escribe en interactivo/bombas/secciones/ y se trae con node interactivo/al-libro.mjs. No se edita aquí. */
/* 11.10 Líquidos que no son agua: la corrección por viscosidad, el lodo y el reto. */
(function () {
  'use strict';
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, T = ZB.tramo, L = ZB.lerp;
  var g = 9.81;

  // ANSI/HI 9.6.7 (versión de 2004): B en las unidades de la norma, log decimal en C_Q.
  function hiB(nu, H, Q, N) { return 16.5 * Math.sqrt(nu) * Math.pow(H, 0.0625) / (Math.pow(Q, 0.375) * Math.pow(N, 0.25)); }
  function hiCQ(B) { return Math.pow(2.71, -0.165 * Math.pow(Math.log10(B), 3.15)); }
  function hiCe(B) { return Math.pow(B, -0.0547 * Math.pow(B, 0.69)); }

  /* La corrección de ANSI/HI 9.6.7, con el impulsor de 203 mm y el aceite ISO VG 32 a 20 °C. */
  var B0 = hiB(86, 20.6, 26.0, 1750), CQ0 = hiCQ(B0), CE0 = hiCe(B0);
  ZB.animacion('hi-viscosidad', {
    vista: [0, 0, 640, 380],
    alt: 'La curva de agua del impulsor de 203 mm se corrige para un aceite de 86 cSt: con B = 8,42, el mejor punto baja de 26,0 m³/h y 20,6 m a 22,9 m³/h y 18,1 m, y la eficiencia de 73,5 a 44,2 %.',
    montar: function (svg) {
      var S = {};
      var qB = window.CARTA_BOMBA.D['203'].qB;
      var fin = D.cartaFin('203');
      S.ptsH = D.cartaPts('203', 0, fin); S.ptsE = D.cartaPts('203', 1, fin);
      S.eH = D.ejes(svg, { x: 56, y: 44, w: 250, h: 220, xmin: 0, xmax: 40, ymin: 0, ymax: 25, xt: [0, 10, 20, 30, 40], yt: [0, 5, 10, 15, 20, 25], xr: 'Q (m³/h)', yr: 'H (m)' });
      S.eE = D.ejes(svg, { x: 380, y: 44, w: 236, h: 220, xmin: 0, xmax: 40, ymin: 0, ymax: 80, xt: [0, 10, 20, 30, 40], yt: [0, 20, 40, 60, 80], xr: 'Q (m³/h)', yr: 'η (%)' });
      var X = S.eH.X, Y = S.eH.Y, Xe = S.eE.X, Ye = S.eE.Y;
      S.aguaH = D.trazo(svg, D.camino(S.ptsH, X, Y), { color: K.aguaO, ancho: 2.4, guion: '7 5' });
      S.aguaE = D.trazo(svg, D.camino(S.ptsE.map(function (p) { return [p[0], 100 * p[1]]; }), Xe, Ye), { color: K.aguaO, ancho: 2.4, guion: '7 5' });
      S.aceiteH = s('path', { fill: 'none', stroke: K.aceiteO, 'stroke-width': 2.8, 'stroke-linejoin': 'round', opacity: 0 }, svg);
      S.aceiteE = s('path', { fill: 'none', stroke: K.aceiteO, 'stroke-width': 2.8, 'stroke-linejoin': 'round', opacity: 0 }, svg);
      function rombo(x, y, color) {
        var r = s('path', { d: 'M0 -7L7 0L0 7L-7 0Z', fill: color, stroke: K.tinta, 'stroke-width': 1.4, opacity: 0 }, svg);
        r.mover = function (xx, yy) { r.setAttribute('transform', 'translate(' + xx.toFixed(1) + ' ' + yy.toFixed(1) + ')'); };
        r.mover(x, y);
        return r;
      }
      S.qB = qB; S.hB = D.carta('203', qB, 0); S.eB = D.carta('203', qB, 1);
      S.bepH = rombo(X(qB), Y(S.hB), K.caso);
      S.bepE = rombo(Xe(qB), Ye(100 * S.eB), K.caso);
      S.tAgua = D.t(svg, X(30.5), Y(19.4), 'agua', { tam: 13, peso: 650, color: K.aguaO, halo: true });
      S.tAceite = D.t(svg, X(2), Y(19.6), 'aceite, 86 cSt', { tam: 13, peso: 650, color: K.aceiteO, halo: true });
      S.tAceite.setAttribute('opacity', 0);
      S.tBEPa = D.t(svg, X(27), Y(22.4), '26,0 m³/h; 20,6 m', { tam: 12, peso: 600, halo: true, color: K.tinta2 });
      S.tBEPe = D.t(svg, Xe(26), Ye(78.5), '73,5 %', { tam: 12.5, peso: 600, ancla: 'middle', halo: true });
      S.tBEPa.setAttribute('opacity', 0); S.tBEPe.setAttribute('opacity', 0);
      S.tBEPo = D.t(svg, X(21.4), Y(16.4), '22,9 m³/h; 18,1 m', { tam: 12.5, peso: 650, ancla: 'end', color: K.aceiteO, halo: true });
      S.tBEPoe = D.t(svg, Xe(22.9), Ye(34), '44,2 %', { tam: 12.5, peso: 650, ancla: 'middle', color: K.aceiteO, halo: true });
      S.tBEPo.setAttribute('opacity', 0); S.tBEPoe.setAttribute('opacity', 0);
      // los factores
      S.caja = s('g', { opacity: 0 }, svg);
      s('rect', { x: 56, y: 300, width: 560, height: 66, rx: 6, fill: K.blanco, stroke: K.borde }, S.caja);
      D.t(S.caja, 72, 324, 'B = ' + n(B0, 2), { tam: 15, peso: 700 });
      D.t(S.caja, 200, 324, 'C_Q = ' + n(CQ0, 3), { tam: 15, peso: 700 });
      D.t(S.caja, 340, 324, 'C_η = ' + n(CE0, 3), { tam: 15, peso: 700 });
      S.tPot = D.t(S.caja, 72, 352, '', { tam: 13.5, peso: 600, color: K.tinta2 });
      return S;
    },
    pasos: [
      { texto: 'La curva de agua del impulsor de 203 mm a 1750 r/min, con su mejor punto: 26,0 m³/h, 20,6 m y 73,5 % de eficiencia.', dur: 2, ir: function (S, t) {
        S.aguaH.dibujar(T(t, 0, 0.6)); S.aguaE.dibujar(T(t, 0.2, 0.8)); D.ver(S.bepH, T(t, 0.6, 0.9)); D.ver(S.bepE, T(t, 0.6, 0.9)); D.ver(S.tBEPa, T(t, 0.7, 1)); D.ver(S.tBEPe, T(t, 0.7, 1));
      } },
      { texto: 'Con un aceite ISO VG 32 a 20 °C, de 86 cSt, la norma da $B$ = 8,42, y de él salen los factores $C_Q$ = 0,879 y $C_\\eta$ = 0,602.', dur: 1.4, ir: function (S, t) { D.ver(S.caja, t); } },
      { texto: 'Cada punto de la curva se corre: el caudal se multiplica por $C_Q$ y la cabeza por $C_H$, que vale $C_Q$ en el mejor punto y se acerca a 1 hacia caudal cero. El mejor punto baja a 22,9 m³/h y 18,1 m.', dur: 2.6, ir: function (S, t) {
        var X = S.eH.X, Y = S.eH.Y;
        var d = S.ptsH.map(function (p, i) {
          var CH = 1 - (1 - CQ0) * Math.pow(p[0] / S.qB, 0.75);
          return (i ? 'L' : 'M') + X(L(p[0], CQ0 * p[0], t)).toFixed(1) + ' ' + Y(L(p[1], CH * p[1], t)).toFixed(1);
        }).join('');
        S.aceiteH.setAttribute('d', d); S.aceiteH.setAttribute('opacity', t > 0 ? 1 : 0);
        S.bepH.mover(X(L(S.qB, CQ0 * S.qB, t)), Y(L(S.hB, CQ0 * S.hB, t)));
        D.ver(S.tAceite, T(t, 0.6, 1)); D.ver(S.tBEPo, T(t, 0.7, 1)); D.ver(S.tBEPa, 1 - T(t, 0, 0.4));
      } },
      { texto: 'La eficiencia se multiplica por $C_\\eta$ en toda la curva: el mejor punto cae de 73,5 a 44,2 %.', dur: 2.2, ir: function (S, t) {
        var Xe = S.eE.X, Ye = S.eE.Y;
        var d = S.ptsE.map(function (p, i) {
          return (i ? 'L' : 'M') + Xe(L(p[0], CQ0 * p[0], t)).toFixed(1) + ' ' + Ye(100 * L(p[1], CE0 * p[1], t)).toFixed(1);
        }).join('');
        S.aceiteE.setAttribute('d', d); S.aceiteE.setAttribute('opacity', t > 0 ? 1 : 0);
        S.bepE.mover(Xe(L(S.qB, CQ0 * S.qB, t)), Ye(100 * L(S.eB, CE0 * S.eB, t)));
        D.ver(S.tBEPoe, T(t, 0.7, 1)); D.ver(S.tBEPe, 1 - 0.6 * T(t, 0, 0.4));
      } },
      { texto: 'En el mejor punto la potencia al eje sube de 1,98 a 2,18 kW, aunque el aceite pese 14 % menos que el agua: un motor escogido con la curva de agua quedaría justo.', dur: 1.4, ir: function (S, t) {
        D.ponerTexto(S.tPot, 'Potencia al eje en el BEP: 1,98 kW con agua; 2,18 kW con el aceite');
        D.ver(S.tPot, t);
      } }
    ]
  });

  /* Arena en el agua: la cabeza baja y la presión sube. */
  ZB.animacion('lodo', {
    vista: [0, 0, 640, 340],
    alt: 'Con agua la bomba da 30 m y 294 kPa; con 20 % en volumen de arena la mezcla pesa 1330 kg/m³, la cabeza cae a 24,6 m y la presión sube a 321 kPa.',
    montar: function (svg) {
      var S = {}, y0 = 290, e = 7.2, Y = function (m) { return y0 - m * e; };
      S.Y = Y; S.y0 = y0;
      s('line', { x1: 56, x2: 56, y1: Y(0), y2: Y(32), stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      for (var m = 0; m <= 30; m += 10) {
        s('line', { x1: 50, x2: 56, y1: Y(m), y2: Y(m), stroke: K.tinta2 }, svg);
        D.t(svg, 46, Y(m) + 4, m + ' m', { tam: 12, ancla: 'end', color: K.tinta2 });
      }
      D.t(svg, 56, 26, 'Cabeza', { tam: 13, peso: 650 });
      // dos columnas
      S.col = [[120, 'Agua', K.aguaM], [230, 'Agua con 20 % de arena', K.metalM]].map(function (c) {
        s('rect', { x: c[0] - 22, y: Y(32), width: 44, height: y0 - Y(32), fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.4 }, svg);
        var liq = s('rect', { x: c[0] - 20.5, y: y0, width: 41, height: 0, fill: c[2] }, svg);
        var granos = s('g', { opacity: 0 }, svg);
        D.t(svg, c[0], 312, c[1].split(' con ')[0], { tam: 13, peso: 650, ancla: 'middle' });
        if (c[1].indexOf('arena') > 0) D.t(svg, c[0], 328, 'con 20 % de arena', { tam: 12, ancla: 'middle', color: K.tinta2 });
        var lec = D.t(svg, c[0], y0, '', { tam: 13, peso: 700, ancla: 'middle', halo: true });
        return { x: c[0], liq: liq, granos: granos, lec: lec };
      });
      // granos de arena en la segunda columna
      for (var k = 0; k < 46; k++) {
        var fx = ((0.5 + k * 0.7548776662) % 1), fy = ((0.5 + k * 0.5698402910) % 1);
        s('circle', { cx: 230 - 17 + 34 * fx, cy: y0 - 4 - fy * 170, r: 2.1, fill: K.tinta2 }, S.col[1].granos);
      }
      S.clip = s('clipPath', { id: 'lodo-clip' }, s('defs', {}, svg));
      S.clipR = s('rect', { x: 200, y: y0, width: 60, height: 0 }, S.clip);
      S.col[1].granos.setAttribute('clip-path', 'url(#lodo-clip)');
      S.muestra = s('g', { opacity: 0 }, svg);
      s('rect', { x: 284, y: Y(30), width: 34, height: 34, fill: K.metalM, stroke: K.tinta, 'stroke-width': 1 }, S.muestra);
      for (var j = 0; j < 9; j++) s('circle', { cx: 290 + (j % 3) * 11, cy: Y(30) + 6 + Math.floor(j / 3) * 11, r: 2.1, fill: K.tinta2 }, S.muestra);
      S.rho = D.t(svg, 301, Y(30) + 54, '', { tam: 13, peso: 650, color: K.tinta, ancla: 'middle', halo: true });
      S.rho.setAttribute('opacity', 0);
      // barras de presión
      var x0 = 380, ex = 0.62;
      D.t(svg, x0, 26, 'Diferencia de presión (kPa)', { tam: 13, peso: 650 });
      s('line', { x1: x0, x2: x0, y1: 46, y2: 250, stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      [0, 100, 200, 300].forEach(function (v) {
        s('line', { x1: x0 + v * ex, x2: x0 + v * ex, y1: 250, y2: 256, stroke: K.tinta2 }, svg);
        D.t(svg, x0 + v * ex, 272, String(v), { tam: 12, ancla: 'middle', color: K.tinta2 });
      });
      S.bar = [[90, 'Agua', K.aguaM], [170, 'Mezcla', K.metalM]].map(function (b) {
        D.t(svg, x0 + 4, b[0] - 8, b[1], { tam: 12.5, color: K.tinta2 });
        var r = s('rect', { x: x0, y: b[0], width: 0, height: 26, fill: b[2], stroke: K.tinta, 'stroke-width': 1 }, svg);
        var t = D.t(svg, x0, b[0] + 18, '', { tam: 13, peso: 700 });
        return { r: r, t: t, ex: ex, x0: x0 };
      });
      S.fin = D.t(svg, 616, 330, '9 % más presión con 18 % menos cabeza', { tam: 13.5, peso: 700, ancla: 'end', color: K.olivaOsc });
      S.fin.setAttribute('opacity', 0);
      return S;
    },
    pasos: [
      { texto: 'Con agua, de 1000 kg/m³, la bomba da 30 m y una diferencia de presión de 294 kPa.', dur: 2, ir: function (S, t) {
        columna(S, 0, 30 * t); barra(S, 0, 294.3 * T(t, 0.3, 1));
      } },
      { texto: 'Con 20 % en volumen de arena de 2650 kg/m³, la mezcla pesa $\\rho_m = 0,8 \\times 1000 + 0,2 \\times 2650 = 1330$ kg/m³.', dur: 1.6, ir: function (S, t) {
        D.ver(S.muestra, T(t, 0, 0.6));
        D.ponerTexto(S.rho, '1330 kg/m³'); D.ver(S.rho, T(t, 0.4, 1));
      } },
      { texto: 'Los sólidos no aguantan presión, solo energía cinética: la cabeza cae al 82 % de la de agua, a 24,6 m.', dur: 2, ir: function (S, t) { columna(S, 1, 24.6 * t); } },
      { texto: 'Aun así la presión sube a 321 kPa, 9 % más que con agua, porque la mezcla pesa 33 % más: $\\Delta p = \\rho_m\\,g\\,f_H\\,H_w$.', dur: 2, ir: function (S, t) { barra(S, 1, 321.0 * t); D.ver(S.fin, T(t, 0.6, 1)); } }
    ]
  });
  function columna(S, i, H) {
    var c = S.col[i], y = S.Y(H);
    if (i === 1) { D.ver(c.granos, H > 0 ? 1 : 0); S.clipR.setAttribute('y', y); S.clipR.setAttribute('height', S.y0 - y); }
    c.liq.setAttribute('y', y); c.liq.setAttribute('height', S.y0 - y);
    c.lec.setAttribute('y', i === 0 ? S.Y(32) - 8 : y - 8);
    D.ponerTexto(c.lec, H > 0.5 ? n(H, 1) + ' m' : '');
  }
  function barra(S, i, v) {
    var b = S.bar[i];
    b.r.setAttribute('width', v * b.ex);
    b.t.setAttribute('x', b.x0 + v * b.ex + 6);
    D.ponerTexto(b.t, v > 1 ? n(v, 0) + ' kPa' : '');
  }

  /* Reto: otra densidad, la corrección por viscosidad y un lodo. */
})();

/* 11-11-dp.js: se escribe en interactivo/bombas/secciones/ y se trae con node interactivo/al-libro.mjs. No se edita aquí. */
/* 11.11 Bombas de desplazamiento positivo: la pulsación, el deslizamiento y el reto. */
(function () {
  'use strict';
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, T = ZB.tramo;
  var g = 9.81;

  /* Uno, dos y tres cilindros de simple efecto, con un émbolo de movimiento senoidal (sin la biela). */
  function cil(th, fase) { var v = Math.sin((th - fase) * Math.PI / 180); return v > 0 ? v : 0; }
  ZB.animacion('pulsacion', {
    vista: [0, 0, 640, 330],
    alt: 'El caudal de un cilindro de simple efecto va de cero a su máximo en media vuelta; tres cilindros desfasados 120° suman un caudal casi constante.',
    montar: function (svg) {
      var S = {};
      S.e = D.ejes(svg, { x: 64, y: 36, w: 550, h: 220, xmin: 0, xmax: 720, ymin: 0, ymax: 1.25, xt: [0, 180, 360, 540, 720], yt: [0, 0.5, 1], dy: 1, xr: 'ángulo del cigüeñal (°)', yr: 'caudal (pico de un cilindro = 1)' });
      var X = S.e.X, Y = S.e.Y;
      var colores = [K.serie[0], K.serie[1], K.serie[2]];
      S.c = [0, 120, 240].map(function (f, i) {
        var pts = []; for (var th = 0; th <= 720; th += 3) pts.push([th, cil(th, f)]);
        return D.trazo(svg, D.camino(pts, X, Y), { color: colores[i], ancho: 2 });
      });
      var suma = []; for (var th = 0; th <= 720; th += 3) suma.push([th, cil(th, 0) + cil(th, 120) + cil(th, 240)]);
      S.suma = D.trazo(svg, D.camino(suma, X, Y), { color: K.tinta, ancho: 3.4 });
      S.m1 = s('line', { x1: X(0), x2: X(720), y1: Y(1 / Math.PI), y2: Y(1 / Math.PI), stroke: K.serie[0], 'stroke-width': 1.4, 'stroke-dasharray': '6 4', opacity: 0 }, svg);
      S.t1 = D.t(svg, X(716), Y(1 / Math.PI) - 6, 'promedio de un cilindro', { tam: 12.5, peso: 600, ancla: 'end', color: K.serie[0], halo: true });
      S.m3 = s('line', { x1: X(0), x2: X(720), y1: Y(3 / Math.PI), y2: Y(3 / Math.PI), stroke: K.tinta, 'stroke-width': 1.2, 'stroke-dasharray': '6 4', opacity: 0 }, svg);
      S.t3 = D.t(svg, X(716), Y(1.13), 'tres cilindros: casi constante', { tam: 13, peso: 700, ancla: 'end', halo: true });
      S.t2 = D.t(svg, X(300), Y(1.13), 'a 120°', { tam: 12.5, peso: 600, color: K.serie[1], halo: true });
      S.t2b = D.t(svg, X(420), Y(1.13), 'a 240°', { tam: 12.5, peso: 600, color: K.serie[2], halo: true });
      S.fr = D.t(svg, 64, 300, 'Pulsa tres veces por vuelta: a 200 r/min, 3 × 200/60 = 10 Hz.', { tam: 13, peso: 600, color: K.tinta2 });
      [S.t1, S.t3, S.t2, S.t2b, S.fr].forEach(function (x) { x.setAttribute('opacity', 0); });
      return S;
    },
    pasos: [
      { texto: 'Un cilindro de simple efecto descarga durante media vuelta y aspira durante la otra media: el caudal va de cero a un pico de más de tres veces su promedio.', dur: 2.4, ir: function (S, t) { S.c[0].dibujar(T(t, 0, 0.8)); D.ver(S.m1, T(t, 0.6, 1)); D.ver(S.t1, T(t, 0.7, 1)); } },
      { texto: 'Un segundo cilindro, desfasado 120°, empieza a descargar antes de que el primero termine.', dur: 2, ir: function (S, t) { S.c[1].dibujar(T(t, 0, 0.9)); D.ver(S.t2, T(t, 0.5, 1)); } },
      { texto: 'El tercero, a 240°, llena el hueco que dejaban los dos primeros.', dur: 2, ir: function (S, t) { S.c[2].dibujar(T(t, 0, 0.9)); D.ver(S.t2b, T(t, 0.5, 1)); } },
      { texto: 'La suma de los tres es la tríplex: su caudal casi no cambia en la vuelta y pulsa tres veces por vuelta. Con la biela real la curva se deforma un poco; la tabla de pulsación da la variación de cada arreglo.', dur: 2.4, ir: function (S, t) {
        S.c.forEach(function (c) { c.setAttribute('opacity', 1 - 0.65 * T(t, 0, 0.3)); });
        D.ver(S.m1, 1 - T(t, 0, 0.3)); D.ver(S.t1, 1 - T(t, 0, 0.3));
        S.suma.dibujar(T(t, 0.1, 0.8)); D.ver(S.m3, T(t, 0.6, 1)); D.ver(S.t3, T(t, 0.7, 1)); D.ver(S.fr, T(t, 0.8, 1));
      } }
    ]
  });

  /* El deslizamiento de la bomba de engranajes internos del ejemplo: 0,35 L por vuelta a 400 r/min. */
  ZB.animacion('deslizamiento', {
    vista: [0, 0, 640, 330],
    alt: 'Caudal contra diferencia de presión de una bomba de engranajes: desplaza 140 L/min; con el aceite entrega 133 L/min a 6 bar, y con la mitad de la viscosidad, 126 L/min.',
    montar: function (svg) {
      var S = {};
      S.e = D.ejes(svg, { x: 70, y: 36, w: 400, h: 230, xmin: 0, xmax: 10, ymin: 110, ymax: 145, xt: [0, 2, 4, 6, 8, 10], yt: [110, 120, 130, 140], xr: 'Δp (bar)', yr: 'Q (L/min)' });
      var X = S.e.X, Y = S.e.Y;
      D.t(svg, 70, 300, 'El eje del caudal empieza en 110 L/min.', { tam: 12, color: K.tinta2 });
      S.teo = D.trazo(svg, 'M' + X(0) + ' ' + Y(140) + 'L' + X(10) + ' ' + Y(140), { color: K.tinta2, ancho: 1.8, guion: '7 5' });
      S.tTeo = D.t(svg, X(10), Y(140) - 8, 'lo que desplaza: 140 L/min', { tam: 12.5, peso: 600, ancla: 'end', color: K.tinta2, halo: true });
      S.ac = D.trazo(svg, 'M' + X(0) + ' ' + Y(140) + 'L' + X(10) + ' ' + Y(140 - 70 / 6), { color: K.aceiteO, ancho: 2.8 });
      S.ac2 = D.trazo(svg, 'M' + X(0) + ' ' + Y(140) + 'L' + X(10) + ' ' + Y(140 - 140 / 6), { color: K.calienteO, ancho: 2.8 });
      S.p1 = D.punto(svg, X(6), Y(133)); S.p2 = D.punto(svg, X(6), Y(126));
      S.f1 = D.flechaViva(svg, { color: K.aceiteO, ancho: 1.6, punta: 7 });
      S.f2 = D.flechaViva(svg, { color: K.calienteO, ancho: 1.6, punta: 7 });
      S.t1 = D.t(svg, X(6) + 14, Y(133) - 9, '133 L/min: se devuelven 7', { tam: 12.5, peso: 650, color: K.aceiteO, halo: true, ancla: 'start' });
      S.t2 = D.t(svg, X(6) - 12, Y(126) + 20, '126 L/min: se devuelven 14', { tam: 12.5, peso: 650, color: K.calienteO, halo: true, ancla: 'end' });
      S.caja = s('g', {}, svg);
      D.t(S.caja, 490, 70, 'Q = N V_d − Q_{desl}', { tam: 14, peso: 700 });
      D.t(S.caja, 490, 96, 'Q_{desl} ∝ Δp δ³/μ', { tam: 14, peso: 700 });
      S.tMitad = D.t(S.caja, 490, 132, 'μ a la mitad:', { tam: 13, peso: 600, color: K.calienteO });
      S.tMitad2 = D.t(S.caja, 490, 150, 'deslizamiento doble', { tam: 13, peso: 600, color: K.calienteO });
      [S.p1, S.p2, S.t1, S.t2, S.tTeo, S.caja, S.tMitad, S.tMitad2].forEach(function (x) { x.setAttribute('opacity', 0); });
      S.f1(0, 0, 0, 0); S.f2(0, 0, 0, 0);
      return S;
    },
    pasos: [
      { texto: 'Sin holguras, la bomba entregaría siempre lo que desplaza: $400 \\times 0,35 = 140$ L/min, contra cualquier presión.', dur: 1.6, ir: function (S, t) { S.teo.dibujar(t); D.ver(S.tTeo, T(t, 0.5, 1)); } },
      { texto: 'Por las holguras se devuelve un caudal que crece con la diferencia de presión. Con este aceite son 7 L/min a 6 bar, y la bomba entrega 133 L/min.', dur: 2.2, ir: function (S, t) {
        var X = S.e.X, Y = S.e.Y; D.ver(S.caja, T(t, 0, 0.4)); D.ver(S.tMitad, 0); D.ver(S.tMitad2, 0);
        S.ac.dibujar(T(t, 0.1, 0.7)); D.ver(S.p1, T(t, 0.7, 0.9)); D.ver(S.t1, T(t, 0.8, 1));
        if (t > 0.6) S.f1(X(6), Y(140) + 3, X(6), Y(133) - 7); else S.f1(0, 0, 0, 0);
      } },
      { texto: 'Si el aceite se calienta y su viscosidad baja a la mitad, el deslizamiento se duplica: 14 L/min a 6 bar, y el caudal baja a 126 L/min, 5 % menos, sin que cambie la velocidad.', dur: 2.2, ir: function (S, t) {
        var X = S.e.X, Y = S.e.Y; D.ver(S.tMitad, T(t, 0, 0.4)); D.ver(S.tMitad2, T(t, 0, 0.4));
        S.ac2.dibujar(T(t, 0.1, 0.7)); D.ver(S.p2, T(t, 0.7, 0.9)); D.ver(S.t2, T(t, 0.8, 1));
        if (t > 0.6) S.f2(X(6) - 10, Y(140) + 3, X(6) - 10, Y(126) - 7); else S.f2(0, 0, 0, 0);
      } },
      { texto: 'Por eso el caudal garantizado se fija con la viscosidad mínima, la de mayor deslizamiento, y el motor con la máxima, la que pide más potencia.', dur: 1.2, ir: function (S, t) { D.ver(S.t2, 1); } }
    ]
  });

  /* Reto: una reciprocante, su cabeza de aceleración y una rotatoria. */
})();

/* 11-12-alimentos.js: se escribe en interactivo/bombas/secciones/ y se trae con node interactivo/al-libro.mjs. No se edita aquí. */
/* 11.12 Bombas para alimentos: dos animaciones y el reto. */
(function () {
  'use strict';
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, T = ZB.tramo;

  /* Qué familia para cada producto: un árbol de decisión que recorren cuatro productos. */
  var NODOS = {
    visc: { x: 290, y: 60, t: ['¿Más viscoso que', 'unos 500 cP?'] },
    ciz: { x: 290, y: 150, t: ['¿Lo daña', 'la cizalla?'] },
    tro: { x: 290, y: 240, t: ['¿Lleva trozos que', 'no deben romperse?'] },
    dp: { x: 545, y: 105, t: ['Desplazamiento', 'positivo, lenta'], fin: true },
    cav: { x: 545, y: 240, t: ['Rotatoria de cavidades', 'grandes, sin válvulas'], fin: true },
    cen: { x: 545, y: 302, t: ['Centrífuga', 'sanitaria'], fin: true }
  };
  // Los recorridos: el producto entra por la izquierda de la primera pregunta; «no» baja, «sí» sale a la derecha.
  var PRODUCTOS = [
    { t: ['Jugo clarificado'], y: 60, ruta: [[210, 60], [290, 60], [290, 150], [290, 240], [290, 302], [460, 302]] },
    { t: ['Un puré de más', 'de 500 cP'], y: 135, ruta: [[210, 60], [290, 60], [370, 60], [460, 105]] },
    { t: ['Un producto sensible', 'a la cizalla'], y: 210, ruta: [[210, 60], [290, 60], [290, 150], [370, 150], [460, 105]] },
    { t: ['Trozos de 15 mm hacia', 'un proceso aséptico'], y: 285, ruta: [[210, 60], [290, 60], [290, 150], [290, 240], [370, 240], [460, 240]] }
  ];
  function caja(padre, x, y, lineas, o) {
    var g = s('g', {}, padre), w = o.fin ? 170 : 160, h = 44;
    s('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: o.fin ? 6 : 22, fill: o.fin ? K.blanco : K.papel, stroke: K.tinta, 'stroke-width': o.fin ? 2 : 1.4 }, g);
    lineas.forEach(function (l, i) { D.t(g, x, y - (lineas.length - 1) * 8 + i * 16 + 5, l, { tam: 12.5, peso: o.fin ? 700 : 600, ancla: 'middle' }); });
    return g;
  }
  function enRuta(pts, u) {
    var L = [0], i;
    for (i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    var d = u * L[L.length - 1];
    for (i = 1; i < pts.length - 1 && L[i] < d; i++);
    var f = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1);
    return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f];
  }
  ZB.animacion('familia-alimento', {
    vista: [0, 0, 640, 336],
    alt: 'Un árbol de decisión para escoger la bomba de un alimento: la viscosidad, la cizalla y los trozos separan la centrífuga sanitaria, la de desplazamiento positivo lenta y la rotatoria de cavidades grandes.',
    montar: function (svg) {
      var S = { rutas: [], fichas: [], prods: [] };
      // las ramas del árbol, en gris, debajo de todo
      var ramas = [[[290, 60], [290, 302], [460, 302]], [[370, 60], [460, 105]], [[370, 150], [460, 105]], [[370, 240], [460, 240]]];
      ramas.forEach(function (r) { s('path', { d: 'M' + r.map(function (q) { return q.join(' '); }).join('L'), fill: 'none', stroke: K.borde, 'stroke-width': 2 }, svg); });
      PRODUCTOS.forEach(function (p, i) {
        var g = s('g', { opacity: 0.35 }, svg);
        p.t.forEach(function (l, j) { D.t(g, 22, p.y - (p.t.length - 1) * 8 + j * 16 + 4, l, { tam: 12.5, peso: 650 }); });
        S.prods.push(g);
        var pts = [[180, p.y]].concat(p.ruta);
        var r = D.trazo(svg, 'M' + pts.map(function (q) { return q.join(' '); }).join('L'), { color: K.serie[[0, 1, 2, 0][i]], ancho: 2.6 });
        S.rutas.push({ r: r, pts: pts });
      });
      Object.keys(NODOS).forEach(function (k) { var nd = NODOS[k]; caja(svg, nd.x, nd.y, nd.t, { fin: nd.fin }); });
      D.t(svg, 22, 22, 'El producto', { tam: 13, peso: 700, color: K.tinta2 });
      D.t(svg, 545, 22, 'La bomba', { tam: 13, peso: 700, color: K.tinta2, ancla: 'middle' });
      S.si = s('g', { opacity: 0 }, svg);
      [[408, 72, 'sí'], [408, 120, 'sí'], [408, 234, 'sí'], [298, 108, 'no'], [298, 198, 'no'], [298, 284, 'no']].forEach(function (l) {
        D.t(S.si, l[0], l[1], l[2], { tam: 12, peso: 700, color: l[2] === 'sí' ? K.olivaOsc : K.tinta2, halo: true });
      });
      PRODUCTOS.forEach(function () { S.fichas.push(s('circle', { r: 7, fill: K.caso, stroke: K.tinta, 'stroke-width': 1.6, opacity: 0 }, svg)); });
      S.gas = s('g', { opacity: 0 }, svg);
      D.t(S.gas, 22, 330, 'Con gas arrastrado, la centrífuga maneja poco.', { tam: 12.5, peso: 650, color: K.alerta });
      return S;
    },
    pasos: [0, 1, 2, 3].map(function (i) {
      var txt = [
        'Un jugo clarificado: poco viscoso, sin trozos y sin cuidado especial con la cizalla. Pasa las tres preguntas y llega a la centrífuga sanitaria, simple, barata y fácil de limpiar en sitio.',
        'Un puré de más de unos 500 cP. Ya en la primera pregunta sale de la centrífuga: va una de desplazamiento positivo, lenta.',
        'Un producto que la cizalla daña también va a una de desplazamiento positivo y lenta, aunque no sea tan viscoso.',
        'Trozos de 15 mm hacia un proceso aséptico a unos 4 bar: cámaras grandes, bomba lenta y sin válvulas, porque un trozo entre una válvula y su asiento deja escapar la presión.'
      ][i];
      return { texto: txt, dur: 2.4, ir: function (S, t) {
        S.rutas.forEach(function (R, j) { if (j < i) R.r.setAttribute('stroke-opacity', 1 - 0.65 * T(t, 0, 0.3)); });
        var R = S.rutas[i];
        R.r.dibujar(T(t, 0, 0.8)); R.r.setAttribute('stroke-opacity', 1);
        D.ver(S.prods[i], 0.35 + 0.65 * T(t, 0, 0.2));
        var p = enRuta(R.pts, T(t, 0, 0.8));
        S.fichas[i].setAttribute('cx', p[0]); S.fichas[i].setAttribute('cy', p[1]);
        D.ver(S.fichas[i], T(t, 0, 0.1));
        if (i === 0) D.ver(S.si, T(t, 0.3, 0.6));
        if (i === 3) D.ver(S.gas, T(t, 0.8, 1));
      } };
    })
  });

  /* La limpieza de la línea de jugo: los tres criterios y la cabeza. */
  var RHO = 974.8, MU = 0.000377, DI = 0.048, AREA = Math.PI * DI * DI / 4;
  var V1 = 6 / 3600 / AREA, V2 = 1.5, Q2 = 1.5 * AREA * 3600;
  var RE1 = RHO * V1 * DI / MU, RE2 = RHO * V2 * DI / MU;
  var TAU1 = 0.0177 * RHO * V1 * V1 / 8, TAU2 = 0.0161 * RHO * V2 * V2 / 8;
  ZB.animacion('limpieza-cip', {
    vista: [0, 0, 640, 364],
    alt: 'Los tres criterios de la limpieza en sitio en la línea de jugo de 48 mm: con el caudal del producto, 6 m³/h, el Reynolds y el esfuerzo en la pared pasan, pero la velocidad no llega a 1,5 m/s; la limpieza pide 9,8 m³/h y la línea pierde 2,7 m en vez de 1,07.',
    montar: function (svg) {
      var S = {};
      // el tubo
      s('rect', { x: 30, y: 40, width: 580, height: 34, rx: 4, fill: K.agua, stroke: K.tinta, 'stroke-width': 1.6 }, svg);
      D.t(svg, 30, 28, 'Tubo de acero inoxidable de 48 mm y 40 m, con ∑K = 10', { tam: 13, peso: 650 });
      S.fl = []; for (var i = 0; i < 6; i++) S.fl.push(D.flechaViva(svg, { color: K.flujo, ancho: 2.4 }));
      S.tq = D.t(svg, 30, 98, '', { tam: 13, peso: 700, color: K.flujo });
      // tres medidores con su umbral
      var C = [
        { t: 'Velocidad (m/s)', max: 2, um: 1.5, umt: '1,5 m/s', v1: V1, v2: V2, d: 2 },
        { t: 'Reynolds', max: 200000, um: 25000, umt: '25 000', v1: RE1, v2: RE2, d: 0 },
        { t: 'Esfuerzo en la pared (Pa)', max: 5, um: 0.8, umt: '0,8 Pa', v1: TAU1, v2: TAU2, d: 1 }
      ];
      S.C = C.map(function (c, k) {
        var x = 40 + k * 200, y0 = 290, h = 118, w = 46;
        var g = s('g', {}, svg);
        D.t(g, x, 160, c.t, { tam: 12.5, peso: 650 });
        s('rect', { x: x + 40, y: y0 - h, width: w, height: h, fill: K.blanco, stroke: K.borde, 'stroke-width': 1 }, g);
        var barra = s('rect', { x: x + 40, y: y0, width: w, height: 0, fill: K.aguaM, stroke: K.tinta, 'stroke-width': 1 }, g);
        var yu = y0 - h * c.um / c.max;
        s('line', { x1: x + 30, x2: x + 96, y1: yu, y2: yu, stroke: K.alerta, 'stroke-width': 1.8, 'stroke-dasharray': '5 3' }, g);
        D.t(g, x + 100, yu + 4, c.umt, { tam: 12, peso: 650, color: K.alerta });
        var lect = D.t(g, x + 63, y0 + 20, '', { tam: 13, peso: 700, ancla: 'middle' });
        var marca = D.t(g, x + 104, y0 + 21, '', { tam: 15, peso: 800 });
        return { c: c, barra: barra, lect: lect, marca: marca, y0: y0, h: h };
      });
      S.cab = s('g', { opacity: 0 }, svg);
      s('rect', { x: 380, y: 84, width: 240, height: 40, rx: 6, fill: K.amarilloClaro, stroke: K.tinta, 'stroke-width': 1 }, S.cab);
      D.t(S.cab, 392, 109, 'Lo que pierde la línea:', { tam: 12.5, peso: 650 });
      S.tcab = D.t(S.cab, 608, 109, '', { tam: 14, peso: 750, ancla: 'end' });
      S.fin = D.t(svg, 320, 352, '', { tam: 13, peso: 700, ancla: 'middle', color: K.olivaOsc });
      return S;
    },
    pasos: [
      { texto: 'Con el caudal del producto, 6 m³/h, el jugo va a 0,92 m/s por el tubo de 48 mm.', dur: 1.8, ir: function (S, t) { flujo(S, V1 * t); D.ponerTexto(S.tq, t > 0.5 ? '6 m³/h · 0,92 m/s' : ''); } },
      { texto: 'Si la solución de limpieza circulara igual, el Reynolds sería de 114 000 y el esfuerzo en la pared de 1,8 Pa: los dos criterios se cumplen. La velocidad, 0,92 m/s, no llega a los 1,5 m/s de la regla práctica.', dur: 2.4, ir: function (S, t) { medir(S, 'v1', t); } },
      { texto: 'La bomba de limpieza tiene que dar 1,5 m/s: $1,5 \\times 1,81 \\times 10^{-3} \\times 3600 = 9,8$ m³/h, un 63 % más que el caudal del producto. Ahora pasan los tres criterios.', dur: 2.4, ir: function (S, t) { medir(S, 'v2', 1, t); flujo(S, V1 + (V2 - V1) * t); D.ponerTexto(S.tq, '9,8 m³/h · 1,5 m/s'); } },
      { texto: 'Con 9,8 m³/h la línea pierde 2,7 m, contra 1,07 m con el producto: la fricción crece casi con el cuadrado del caudal.', dur: 1.8, ir: function (S, t) { D.ver(S.cab, t); D.ponerTexto(S.tcab, n(1.07 + (2.7 - 1.07) * t, 2) + ' m'); } },
      { texto: 'La limpieza, y no el producto, fija el caudal máximo de la bomba de esta línea.', dur: 1.2, ir: function (S, t) { D.ponerTexto(S.fin, 'La limpieza fija el caudal máximo: 9,8 m³/h'); S.fin.setAttribute('opacity', t); } }
    ]
  });
  function flujo(S, v) {
    S.fl.forEach(function (f, i) { var x = 60 + i * 92; f(x, 57, x + Math.max(0, v) * 34, 57); });
  }
  function medir(S, cual, t, t2) {
    S.C.forEach(function (m) {
      var v = cual === 'v1' ? m.c.v1 * t : m.c.v1 + (m.c.v2 - m.c.v1) * t2;
      var hh = m.h * Math.min(1, v / m.c.max);
      m.barra.setAttribute('y', m.y0 - hh); m.barra.setAttribute('height', hh);
      D.ponerTexto(m.lect, m.c.d === 0 ? n(Math.round(v / 1000) * 1000, 0) : n(v, m.c.d));
      var fin = cual === 'v1' ? t : t2;
      var ok = v >= m.c.um;
      D.ponerTexto(m.marca, fin > 0.95 ? (ok ? '✓' : '✗') : '');
      m.marca.setAttribute('fill', ok ? K.olivaOsc : K.alerta);
    });
  }

  /* Reto: la velocidad de la línea, el caudal de limpieza y los criterios. */
  var DIAM = [[38, '1½ in'], [48, '2 in'], [61, '2½ in'], [73, '3 in']];
})();

/* 11-13-seleccion.js: se escribe en interactivo/bombas/secciones/ y se trae con node interactivo/al-libro.mjs. No se edita aquí. */
/* 11.13 Selección paso a paso: la revisión del caso y el reto. */
(function () {
  'use strict';
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, T = ZB.tramo;
  var H190 = function (q) { return D.carta('190', q, 0); };
  var sis = function (q) { return 10 + 5.5 * Math.pow(q / 25, 2); };
  function pts(f, a, b) { var o = []; for (var q = a; q <= b + 1e-9; q += 0.5) o.push([q, f(q)]); return o; }
  var QB = window.CARTA_BOMBA.D['190'].qB;

  ZB.animacion('revision-caso', {
    vista: [0, 0, 640, 330],
    alt: 'La revisión de la bomba del caso: el punto de operación al 108 % del BEP dentro de la ventana, la curva estable, el NPSH disponible con margen y el motor de 3,0 kW que cubre la potencia máxima de la curva.',
    montar: function (svg) {
      var S = {}, E = S.E = D.ejes(svg, { x: 50, y: 36, w: 270, h: 240, xmin: 0, xmax: 35, ymin: 0, ymax: 24, xt: [0, 10, 20, 30], yt: [0, 8, 16, 24], xr: 'Q (m³/h)', yr: 'H (m)' });
      S.ven = s('rect', { x: E.X(0.7 * QB), y: E.Y(24), width: E.X(1.1 * QB) - E.X(0.7 * QB), height: E.Y(0) - E.Y(24), fill: K.amarilloClaro, opacity: 0 }, svg);
      S.tVen = D.t(svg, (E.X(0.7 * QB) + E.X(1.1 * QB)) / 2, E.Y(2), '70 a 110 %', { tam: 12, peso: 650, ancla: 'middle', color: K.olivaOsc });
      S.sis = D.trazo(svg, D.camino(pts(sis, 0, 35), E.X, E.Y), { color: K.serie[0], ancho: 2 });
      S.bom = D.trazo(svg, D.camino(pts(H190, 0, D.cartaFin('190')), E.X, E.Y), { color: K.tinta, ancho: 2.6 });
      S.pto = D.punto(svg, E.X(27.3), E.Y(16.6), { r: 6.5 });
      S.tPto = D.t(svg, E.X(27.3) + 12, E.Y(16.6) + 5, '108 %', { tam: 12.5, peso: 750, halo: true });
      S.cero = D.punto(svg, E.X(0), E.Y(20.06), { r: 5.5 });
      S.tCero = D.t(svg, E.X(0) + 10, E.Y(20.06) - 10, '20,1 m a caudal cero', { tam: 12, peso: 650, halo: true });
      S.baja = D.trazo(svg, D.camino(pts(H190, 0, D.cartaFin('190')), E.X, E.Y), { color: K.oliva, ancho: 5 });
      S.baja.setAttribute('stroke-opacity', 0.55);
      S.exceso = s('g', { opacity: 0 }, svg);
      s('line', { x1: E.X(25), x2: E.X(25), y1: E.Y(15.5), y2: E.Y(5), stroke: K.alerta, 'stroke-width': 1.2, 'stroke-dasharray': '4 3' }, S.exceso);
      s('line', { x1: E.X(27.3), x2: E.X(27.3), y1: E.Y(16.6), y2: E.Y(5), stroke: K.alerta, 'stroke-width': 1.2, 'stroke-dasharray': '4 3' }, S.exceso);
      D.flecha(S.exceso, E.X(25), E.Y(6), E.X(27.3), E.Y(6), { color: K.alerta, ancho: 1.8, punta: 6 });
      D.t(S.exceso, E.X(25) - 4, E.Y(7), '25 pedidos;', { tam: 12, peso: 700, color: K.alerta, ancla: 'end', halo: true });
      D.t(S.exceso, E.X(25) - 4, E.Y(7) + 15, '2,3 m³/h de más', { tam: 12, peso: 700, color: K.alerta, ancla: 'end', halo: true });
      [S.tVen, S.pto, S.tPto, S.cero, S.tCero].forEach(function (x) { x.setAttribute('opacity', 0); });
      // la lista de revisión
      var items = [
        ['El punto, en la ventana', '27,3 m³/h y 16,6 m, al 108 % del BEP'],
        ['La curva, estable', 'baja desde 20,1 m a caudal cero'],
        ['El NPSH, con margen', '8,62 m contra 0,68 m; a 90 °C, 1,77 m:', 'cumple la regla (1,28 m), no la de Perry (2,20 m)'],
        ['El motor, sin sobrecarga', '1,72 kW en el punto y 1,92 kW al final de la', 'curva; 3,0 kW, que en Bogotá dan 2,67 kW']
      ];
      S.items = items.map(function (it, i) {
        var g = s('g', { opacity: 0.3 }, svg), y = 52 + i * 66;
        s('rect', { x: 352, y: y - 13, width: 18, height: 18, rx: 3, fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.5 }, g);
        var ok = s('path', { d: 'M355 ' + (y - 4) + 'l5 6l9-12', fill: 'none', stroke: K.oliva, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0 }, g);
        D.t(g, 380, y + 1, it[0], { tam: 13.5, peso: 700 });
        for (var k = 1; k < it.length; k++) D.t(g, 380, y + 1 + k * 17, it[k], { tam: 12, color: K.tinta2 });
        return { g: g, ok: ok };
      });
      S.fin = s('g', { opacity: 0 }, svg);
      s('rect', { x: 346, y: 296, width: 286, height: 30, rx: 4, fill: K.amarilloClaro }, S.fin);
      D.t(S.fin, 356, 316, 'Quitarlos con la válvula cuesta 0,17 kW más.', { tam: 12.5, peso: 650 });
      return S;
    },
    pasos: [
      { texto: 'La curva de la bomba de 190 mm cruza la del sistema en 27,3 m³/h y 16,6 m: el 108 % del BEP, dentro de la ventana de 70 a 110 %.', dur: 2.2, ir: function (S, t) {
        S.bom.dibujar(T(t, 0, 0.5)); S.sis.dibujar(T(t, 0.2, 0.7)); D.ver(S.ven, 0.8 * T(t, 0.5, 0.8)); D.ver(S.tVen, T(t, 0.5, 0.8));
        D.ver(S.pto, T(t, 0.7, 0.9)); D.ver(S.tPto, T(t, 0.8, 1)); marcar(S, 0, T(t, 0.8, 1));
      } },
      { texto: 'La curva es estable: baja todo el tiempo desde los 20,1 m a caudal cero, así que el cruce es uno solo.', dur: 1.8, ir: function (S, t) {
        var E = S.E; D.ver(S.cero, T(t, 0, 0.3)); D.ver(S.tCero, T(t, 0, 0.3));
        S.baja.dibujar(T(t, 0.2, 1));
        marcar(S, 1, T(t, 0.8, 1));
      } },
      { texto: 'El NPSH disponible es de 8,62 m contra 0,68 m de NPSH3. Con agua a 90 °C bajaría a 1,77 m, que cumple la regla del margen, 1,28 m, y no el margen de Perry, 2,20 m.', dur: 1.6, ir: function (S, t) { marcar(S, 2, t); } },
      { texto: 'La potencia al eje es de 1,72 kW en el punto y de 1,92 kW al final de la curva. El motor de 3,0 kW, que a 2600 m y hasta 40 °C da 2,67 kW, cubre las dos con su factor de servicio de reserva.', dur: 1.6, ir: function (S, t) { marcar(S, 3, t); } },
      { texto: 'Es una selección sana. Lo que se puede mejorar es poco: pasa 2,3 m³/h más de los 25 pedidos, y quitarlos con la válvula cuesta 0,17 kW más que recortar o bajar la velocidad.', dur: 1.8, ir: function (S, t) { D.ver(S.exceso, t); D.ver(S.fin, T(t, 0.4, 1)); } }
    ]
  });
  function marcar(S, i, t) { D.ver(S.items[i].g, 0.3 + 0.7 * t); D.ver(S.items[i].ok, t); }

  /* Reto: la ventana, el margen de NPSH y el motor. */
})();

/* 11-14-operacion.js: se escribe en interactivo/bombas/secciones/ y se trae con node interactivo/al-libro.mjs. No se edita aquí. */
/* 11.14 Operación y diagnóstico: la parada, una succión bien hecha y el reto. */
(function () {
  'use strict';
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, T = ZB.tramo;
  var g = 9.81;

  /* La parada: la velocidad, el caudal que se invierte y la retención. Esquema cualitativo, sin escala. */
  var T0 = 0.06, TAU = 0.3, HE = 0.45;
  function vel(t) { return t < T0 ? 1 : Math.exp(-(t - T0) / TAU); }
  function caudal(t) { var v = vel(t); return Math.max(-0.42, (v * v - HE) / (1 - HE)); }
  var TR = T0 - TAU * Math.log(Math.sqrt(HE)), TC = TR + 0.16;
  function presion(t, cierre, tarde) {
    var v = vel(t), base = Math.max(HE, HE + (1 - HE) * v * v);
    if (t < cierre) return tarde ? Math.max(HE * 0.75, HE + (1 - HE) * (v * v - HE) / (1 - HE) * 0.9) : base;
    var dt = t - cierre;
    if (!tarde) return HE + 0.04 * Math.exp(-dt / 0.05) * Math.cos(dt * 60);
    return HE + 1.05 * Math.exp(-dt / 0.12) * Math.cos(dt * 38);
  }
  function serie(f, a, b) { var o = []; for (var t = a; t <= b + 1e-9; t += 0.004) o.push([t, f(t)]); return o; }
  ZB.animacion('parada', {
    vista: [0, 0, 640, 352],
    alt: 'Esquema cualitativo de la parada de una bomba: la velocidad baja por inercia, el caudal baja más rápido y se invierte en un sistema con cabeza estática; una retención que cierra a tiempo deja la presión tranquila y una que golpea tarde da el pico del golpe de ariete.',
    montar: function (svg) {
      var S = {};
      var A = S.A = D.ejes(svg, { x: 60, y: 36, w: 520, h: 130, xmin: 0, xmax: 1, ymin: -0.5, ymax: 1.1, xt: [], yt: [], yr: 'Velocidad y caudal' });
      var B = S.B = D.ejes(svg, { x: 60, y: 208, w: 520, h: 100, xmin: 0, xmax: 1, ymin: 0, ymax: 1.6, xt: [], yt: [], xr: 'tiempo', yr: 'Presión en la descarga' });
      s('line', { x1: A.X(0), x2: A.X(1), y1: A.Y(0), y2: A.Y(0), stroke: K.tinta2, 'stroke-width': 1, 'stroke-dasharray': '3 3' }, svg);
      D.t(svg, A.X(0) + 4, A.Y(0) + 14, 'caudal cero', { tam: 11.5, color: K.tinta2 });
      S.inv = s('rect', { x: A.X(TR), y: A.Y(0), width: A.X(1) - A.X(TR), height: A.Y(-0.5) - A.Y(0), fill: K.caliente, opacity: 0 }, svg);
      S.tInv = D.t(svg, A.X(0.62), A.Y(-0.3), 'el líquido se devuelve', { tam: 12, peso: 650, color: K.calienteO, ancla: 'middle' });
      S.para = s('g', { opacity: 0 }, svg);
      s('line', { x1: A.X(T0), x2: A.X(T0), y1: A.Y(1.1), y2: B.Y(0), stroke: K.tinta, 'stroke-width': 1, 'stroke-dasharray': '4 3' }, S.para);
      D.t(S.para, B.X(T0) + 6, B.Y(1.45), 'se apaga el motor', { tam: 12, peso: 650 });
      S.vel = D.trazo(svg, D.camino(serie(vel, 0, 1), A.X, A.Y), { color: K.tinta, ancho: 2.4 });
      S.tVel = D.t(svg, A.X(0.42), A.Y(vel(0.42)) - 8, 'velocidad', { tam: 12.5, peso: 700, halo: true });
      S.q = D.trazo(svg, D.camino(serie(caudal, 0, 1), A.X, A.Y), { color: K.serie[0], ancho: 2.4 });
      S.tQ = D.t(svg, A.X(0.16), A.Y(caudal(0.16)) - 10, 'caudal', { tam: 12.5, peso: 700, color: K.serie[0], halo: true });
      // la retención que cierra a tiempo
      S.qBien = D.trazo(svg, D.camino(serie(caudal, 0, TR).concat([[TR, 0], [1, 0]]), A.X, A.Y), { color: K.oliva, ancho: 3 });
      S.pBien = D.trazo(svg, D.camino(serie(function (t) { return presion(t, TR, false); }, 0, 1), B.X, B.Y), { color: K.oliva, ancho: 2.4 });
      S.tBien = D.t(svg, B.X(0.98), B.Y(presion(0.98, TR, false)) - 10, 'cierra a tiempo', { tam: 12, peso: 700, color: K.olivaOsc, ancla: 'end', halo: true });
      // la que golpea tarde
      S.qMal = D.trazo(svg, D.camino(serie(caudal, 0, TC).concat([[TC, 0], [1, 0]]), A.X, A.Y), { color: K.alerta, ancho: 3 });
      S.pMal = D.trazo(svg, D.camino(serie(function (t) { return presion(t, TC, true); }, 0, 1), B.X, B.Y), { color: K.alerta, ancho: 2.4 });
      S.tMal = D.t(svg, B.X(TC) + 10, B.Y(1.48), 'golpe de ariete', { tam: 12.5, peso: 750, color: K.alerta, halo: true });
      S.nota = D.t(svg, 580, 22, 'Esquema cualitativo, sin escala', { tam: 11.5, ancla: 'end', color: K.tinta2 });
      [S.tVel, S.tQ, S.tInv, S.tBien, S.tMal].forEach(function (x) { x.setAttribute('opacity', 0); });
      return S;
    },
    pasos: [
      { texto: 'Se apaga el motor. El rotor de la bomba y el del motor siguen girando por inercia y se frenan en 10 a 60 s, según el tamaño; una bomba pequeña, en menos.', dur: 2.2, ir: function (S, t) { D.ver(S.para, T(t, 0, 0.3)); S.vel.dibujar(t); D.ver(S.tVel, T(t, 0.6, 1)); } },
      { texto: 'El caudal baja más rápido. Con cabeza estática, la bomba deja de vencerla antes de parar, y el caudal se invierte: el líquido volvería por la bomba y la haría girar al revés, como una turbina.', dur: 2.4, ir: function (S, t) { S.q.dibujar(t); D.ver(S.tQ, T(t, 0, 0.3)); D.ver(S.inv, 0.35 * T(t, 0.6, 1)); D.ver(S.tInv, T(t, 0.7, 1)); } },
      { texto: 'La válvula de retención lo impide. Si cierra antes de que el caudal se invierta, lo para sin brusquedad y la presión en la descarga baja tranquila hasta la estática.', dur: 2.2, ir: function (S, t) { S.q.setAttribute('opacity', 1 - 0.7 * t); S.qBien.dibujar(T(t, 0, 0.5)); S.pBien.dibujar(T(t, 0.3, 1)); D.ver(S.tBien, T(t, 0.8, 1)); } },
      { texto: 'Si golpea tarde, contra un caudal que ya se invirtió, detiene el líquido de una vez: de ahí salen los picos de presión más altos de la línea, el golpe de ariete.', dur: 2.4, ir: function (S, t) { S.qMal.dibujar(T(t, 0, 0.5)); S.pMal.dibujar(T(t, 0.3, 1)); D.ver(S.tMal, T(t, 0.7, 1)); } },
      { texto: 'Por eso la retención se escoge para que cierre antes de que el caudal se invierta. El salto de Joukowski, la separación de la columna y las protecciones están en el capítulo 10.', dur: 1.2, ir: function (S, t) { D.ver(S.nota, 1); } }
    ]
  });

  /* Una succión bien hecha, pieza por pieza. */
  ZB.animacion('succion', {
    vista: [0, 0, 640, 320],
    alt: 'Una succión bien hecha: la entrada del tanque redondeada y sumergida, la válvula de paso completo, la línea que sube hacia la bomba, el filtro con su dren y su manómetro diferencial, la reducción excéntrica plana por arriba y el tramo recto antes de la brida.',
    montar: function (svg) {
      var S = {};
      var X0 = 150, Y0 = 250, X1 = 330, Y1 = 218;   // el tramo inclinado
      // tanque
      s('rect', { x: 20, y: 70, width: 130, height: 220, fill: K.blanco, stroke: K.tinta, 'stroke-width': 2 }, svg);
      s('rect', { x: 21.5, y: 170, width: 127, height: 118.5, fill: K.agua }, svg);
      s('line', { x1: 22, x2: 148, y1: 170, y2: 170, stroke: K.flujo, 'stroke-width': 1.4 }, svg);
      D.t(svg, 30, 162, 'nivel mínimo', { tam: 11.5, color: K.tinta2 });
      // tubería: un contorno de tinta con el líquido adentro
      function tubo(d, w) {
        var gg = s('g', {}, svg);
        s('path', { d: d, fill: 'none', stroke: K.tinta, 'stroke-width': w + 4, 'stroke-linejoin': 'round' }, gg);
        s('path', { d: d, fill: 'none', stroke: K.agua, 'stroke-width': w, 'stroke-linejoin': 'round' }, gg);
        return gg;
      }
      tubo('M' + X0 + ' ' + Y0 + 'L' + X1 + ' ' + Y1 + 'L370 ' + Y1, 22);
      tubo('M420 ' + (Y1 - 4) + 'L520 ' + (Y1 - 4), 14);
      // reducción excéntrica, plana por arriba
      S.red = s('path', { d: 'M370 ' + (Y1 - 11) + 'L420 ' + (Y1 - 11) + 'L420 ' + (Y1 + 3) + 'L370 ' + (Y1 + 11) + 'Z', fill: K.agua, stroke: K.tinta, 'stroke-width': 2 }, svg);
      // bomba
      s('rect', { x: 520, y: Y1 - 22, width: 8, height: 36, fill: K.metalM, stroke: K.tinta, 'stroke-width': 1.4 }, svg);
      s('circle', { cx: 572, cy: Y1 - 4, r: 42, fill: K.metal, stroke: K.tinta, 'stroke-width': 2 }, svg);
      s('circle', { cx: 572, cy: Y1 - 4, r: 22, fill: K.agua, stroke: K.tinta, 'stroke-width': 1.2 }, svg);
      D.t(svg, 572, Y1 + 56, 'Bomba', { tam: 13, peso: 700, ancla: 'middle' });
      // entrada redondeada dentro del tanque
      S.ent = s('g', { opacity: 0 }, svg);
      s('path', { d: 'M150 ' + (Y0 - 13) + 'Q132 ' + (Y0 - 13) + ' 126 ' + (Y0 - 24) + 'M150 ' + (Y0 + 13) + 'Q132 ' + (Y0 + 13) + ' 126 ' + (Y0 + 24), fill: 'none', stroke: K.tinta, 'stroke-width': 2.4 }, S.ent);
      s('line', { x1: 108, x2: 108, y1: 170, y2: Y0 - 13, stroke: K.olivaOsc, 'stroke-width': 1.4 }, S.ent);
      s('line', { x1: 102, x2: 114, y1: 170, y2: 170, stroke: K.olivaOsc, 'stroke-width': 1.4 }, S.ent);
      s('line', { x1: 102, x2: 114, y1: Y0 - 13, y2: Y0 - 13, stroke: K.olivaOsc, 'stroke-width': 1.4 }, S.ent);
      D.t(S.ent, 102, 196, 'sumergida', { tam: 11.5, peso: 650, color: K.olivaOsc, ancla: 'end' });
      D.t(S.ent, 102, 211, '2 a 4 D', { tam: 11.5, peso: 650, color: K.olivaOsc, ancla: 'end' });
      // válvula de paso completo
      S.val = s('g', { opacity: 0 }, svg);
      var xv = 205, yv = Y0 - (xv - X0) * (Y0 - Y1) / (X1 - X0);
      s('path', { d: 'M' + (xv - 14) + ' ' + (yv - 14) + 'L' + (xv + 14) + ' ' + (yv + 14) + 'L' + (xv + 14) + ' ' + (yv - 14) + 'L' + (xv - 14) + ' ' + (yv + 14) + 'Z', fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.8, transform: 'rotate(-10 ' + xv + ' ' + yv + ')' }, S.val);
      s('line', { x1: xv, x2: xv, y1: yv, y2: yv - 32, stroke: K.tinta, 'stroke-width': 1.8 }, S.val);
      s('line', { x1: xv - 9, x2: xv + 9, y1: yv - 32, y2: yv - 32, stroke: K.tinta, 'stroke-width': 2 }, S.val);
      D.t(S.val, 165, yv + 36, 'paso completo, abierta', { tam: 11.5, peso: 650, ancla: 'start', halo: true });
      // la pendiente
      S.pend = s('g', { opacity: 0 }, svg);
      D.flecha(S.pend, X0 + 70, Y0 + 2, X1 - 40, Y1 + 8, { color: K.flujo, ancho: 2, punta: 8 });
      D.t(S.pend, (X0 + X1) / 2 + 20, Y0 + 50, 'sube hacia la bomba, 10° o más', { tam: 12, peso: 650, ancla: 'middle' });
      D.t(S.pend, (X0 + X1) / 2 + 20, Y0 + 66, 'sin puntos altos; 1 a 2 m/s', { tam: 12, color: K.tinta2, ancla: 'middle' });
      // filtro con dren y manómetro diferencial
      S.fil = s('g', { opacity: 0 }, svg);
      var xf = 285, yf = Y0 - (xf - X0) * (Y0 - Y1) / (X1 - X0);
      s('path', { d: 'M' + (xf - 8) + ' ' + (yf + 6) + 'l14 34l12 -4l-10 -32', fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.6 }, S.fil);
      s('line', { x1: xf + 11, x2: xf + 11, y1: yf + 40, y2: yf + 54, stroke: K.tinta, 'stroke-width': 1.6 }, S.fil);
      D.t(S.fil, xf + 18, yf + 56, 'dren', { tam: 11.5, color: K.tinta2 });
      s('path', { d: 'M' + (xf - 26) + ' ' + (yf - 8) + 'V' + (yf - 44) + 'H' + (xf + 22) + 'V' + (yf - 14), fill: 'none', stroke: K.tinta, 'stroke-width': 1.2 }, S.fil);
      s('circle', { cx: xf - 2, cy: yf - 44, r: 12, fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.4 }, S.fil);
      D.t(S.fil, xf - 2, yf - 40, 'ΔP', { tam: 11, peso: 700, ancla: 'middle' });
      D.t(S.fil, xf - 2, yf - 80, 'filtro con', { tam: 11.5, peso: 650, ancla: 'middle', halo: true });
      D.t(S.fil, xf - 2, yf - 65, 'manómetro diferencial', { tam: 11.5, peso: 650, ancla: 'middle', halo: true });
      // la reducción y el tramo recto
      S.rec = s('g', { opacity: 0 }, svg);
      D.t(S.rec, 430, Y1 - 46, 'reducción excéntrica,', { tam: 11.5, peso: 650, ancla: 'middle' });
      D.t(S.rec, 430, Y1 - 31, 'plana por arriba', { tam: 11.5, peso: 650, ancla: 'middle' });
      s('line', { x1: 400, x2: 420, y1: Y1 - 14, y2: Y1 - 26, stroke: K.tinta2, 'stroke-width': 1 }, S.rec);
      s('path', { d: 'M420 ' + (Y1 + 22) + 'V' + (Y1 + 30) + 'H520V' + (Y1 + 22), fill: 'none', stroke: K.olivaOsc, 'stroke-width': 1.4 }, S.rec);
      D.t(S.rec, 470, Y1 + 46, '5 a 8 D recto', { tam: 12, peso: 700, color: K.olivaOsc, ancla: 'middle' });
      S.luz = s('rect', { x: 0, y: 0, width: 0, height: 0, rx: 8, fill: K.amarilloClaro, opacity: 0 }, svg);
      svg.insertBefore(S.luz, svg.firstChild);
      return S;
    },
    pasos: [
      { texto: 'La entrada desde el tanque, redondeada y sumergida por lo menos entre 2 y 4 diámetros bajo el nivel mínimo, con un rompevórtices si hace falta.', dur: 1.8, ir: function (S, t) { luz(S, 92, 150, 70, 120, t); D.ver(S.ent, t); } },
      { texto: 'Válvulas de paso completo en la succión, y abiertas del todo: la succión nunca se estrangula.', dur: 1.6, ir: function (S, t) { luz(S, 172, 168, 70, 90, t); D.ver(S.val, t); } },
      { texto: 'La línea, corta y recta, con velocidades de entre 1 y 2 m/s. Con la bomba por encima del tanque, sube hacia ella con 10° o más, sin un punto alto donde se junte el gas.', dur: 2, ir: function (S, t) { luz(S, 150, 210, 200, 110, t); D.ver(S.pend, t); } },
      { texto: 'Si el líquido puede traer cuerpos extraños, un filtro. Uno que hace su trabajo se tapa, así que lleva su dren y un manómetro diferencial.', dur: 1.8, ir: function (S, t) { luz(S, 240, 170, 100, 130, t); D.ver(S.fil, t); } },
      { texto: 'La reducción que ensancha la succión es excéntrica y plana por arriba, a unos diámetros de la brida, y antes de la brida van de 5 a 8 diámetros de tubo recto.', dur: 2, ir: function (S, t) { luz(S, 355, 160, 180, 110, t); D.ver(S.rec, t); } }
    ]
  });
  function luz(S, x, y, w, h, t) {
    S.luz.setAttribute('x', x); S.luz.setAttribute('y', y); S.luz.setAttribute('width', w); S.luz.setAttribute('height', h);
    S.luz.setAttribute('opacity', 0.9 * (1 - Math.abs(2 * t - 1) * 0.4));
  }

  /* Reto: la velocidad de la succión, el tramo recto y la cabeza medida contra la curva. */
  var TUBOS = [[2, 52.5], [3, 77.9], [4, 102.3], [6, 154.1]];
})();
