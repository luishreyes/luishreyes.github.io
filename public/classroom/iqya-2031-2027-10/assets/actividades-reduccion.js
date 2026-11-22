/* Las animaciones por pasos del capítulo 7 del libro, «Reducción y aumento de tamaño», traídas con el mismo
   código y los mismos números para la presentación de reducción de tamaño de 2027-10. Es una copia de
   libro/figuras/reduccion-de-tamano/actividades.js del repositorio del libro, solo con las animaciones: los
   retos, con sus soluciones, se quedan en el libro. No se edita aquí; cuando cambian en el libro se vuelven a
   copiar. Corren con el motor de /classroom/estilo-libro/actividades/. */
/* Las animaciones y los retos del capítulo 7, «Reducción y aumento de tamaño». Se escriben aquí directo
   (en bombas pasan por el taller interactivo/). Usan el motor de figuras/comun/actividades.js y las piezas de
   figuras/comun/dibujo.js; los colores salen de la paleta del libro (ZB.dib.col y PALETA), nunca a mano.
   Los números salen del texto del capítulo y del caso de la planta de carbonato (caso.json, que escribe
   herramientas/molienda-carbonato.py): la ley de Bond con el índice de la caliza, las tres etapas del ejemplo de
   la energía y de la figura de la planta, el molino del ejemplo del molino, el circuito del modelo con sus
   cargas circulantes, el balance de Dahl con el tamiz de 45 µm, el desgaste y el calor del molino; los cubos de
   zanahoria del ejemplo del corte; la paja de trigo de Mani y sus colegas; el aglomerador del café con el reciclo
   del modelo del capítulo 6 (168,4 kg/h) y el plato del cacao. Cada animación que dibuja un equipo lo dibuja con
   todas sus corrientes, con los mismos nombres y números que la figura o el esquema de su ejemplo. Un color hace un
   solo trabajo dentro de cada animación: Bond y el circuito cerrado en azul (la primera serie de las gráficas),
   Rittinger y lo que se compara en oliva (la segunda), Kick y el calor en naranja (la tercera), el acero en los
   grises de las piezas, la caliza y los gránulos con su material de sólido y el agua con su material. */
(function () {
  'use strict';
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, T = ZB.tramo, L = ZB.lerp;
  var PA = window.PALETA, SO = PA.materiales.solido, GA = PA.materiales.gas, AGU = PA.materiales.agua;
  var AZ = K.serie[0], OL = K.serie[1], NA = K.serie[2];

  /* ---------- El caso ---------- */
  var WI = 11.61, WIT = 11.61 / 0.907;            // kWh por tonelada corta y por tonelada métrica, como el ejemplo
  function bond(F, P, wi) { return 10 * (wi || WIT) * (1 / Math.sqrt(P) - 1 / Math.sqrt(F)); }
  function finura(P) { return P < 70 ? (P + 10.3) / (1.145 * P) : 1; }
  function diam(Dm) { return Math.pow(8 / (Dm / 0.3048), 0.2); }
  function kwb(Dm, J, phi) { var Df = Dm / 0.3048; return 2.8 * Math.pow(Df, 0.4) * (3.2 - 3 * J) * phi * (1 - 0.1 / Math.pow(2, 9 - 10 * phi)); }
  function bolaIn(F, Dm, phi, Sg, wi, KB) { var Df = Dm / 0.3048; return Math.sqrt(F / KB) * Math.pow(Sg * wi / (100 * phi * Math.sqrt(Df)), 1 / 3); }
  var LB = 453.59237;                              // g por libra
  // Índices de la tabla de índices del capítulo (Bond, 1961, tabla IIIA): nombre, gravedad específica, Wi
  var MAT = [
    { n: 'caliza', sg: 2.69, wi: 11.61 }, { n: 'granito', sg: 2.68, wi: 14.39 }, { n: 'cuarzo', sg: 2.64, wi: 12.77 },
    { n: 'dolomita', sg: 2.82, wi: 11.31 }, { n: 'feldespato', sg: 2.59, wi: 11.67 }, { n: 'clínker de cemento', sg: 3.09, wi: 13.49 },
    { n: 'barita', sg: 4.28, wi: 6.24 }, { n: 'roca fosfórica', sg: 2.66, wi: 10.13 }
  ];

  /* ---------- Piezas del capítulo ---------- */
  function grupo(padre, op) { return s('g', { opacity: op == null ? 0 : op }, padre); }
  function oculto(padre, x, y, str, o) { var e = D.t(padre, x, y, str, o); e.setAttribute('opacity', 0); return e; }
  function camino(padre, pts, o) {
    o = o || {};
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + (+p[0]).toFixed(1) + ' ' + (+p[1]).toFixed(1); }).join('');
    return s('path', { d: d, fill: 'none', stroke: o.color || K.tinta, 'stroke-width': o.ancho || 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'stroke-dasharray': o.guion || 'none' }, padre);
  }
  function tubo(padre, pts, o) {
    o = o || {};
    var g = s('g', {}, padre), ult = pts[pts.length - 1], pen = pts[pts.length - 2];
    camino(g, pts, o);
    D.flecha(g, pen[0], pen[1], ult[0], ult[1], { color: o.color || K.tinta, ancho: o.ancho || 2, punta: o.punta || 8 });
    return g;
  }
  function caja(padre, x, y, w, h, o) {
    o = o || {};
    return s('rect', { x: x, y: y, width: w, height: h, rx: o.rx == null ? 3 : o.rx, fill: o.fill || K.blanco, stroke: o.borde || K.tinta, 'stroke-width': o.ancho || 1.4, 'stroke-dasharray': o.guion || 'none' }, padre);
  }
  function barra(padre, x, y, w, h, color, o) {
    o = o || {};
    var r = s('rect', { x: x, y: y, width: 0, height: h, fill: color, stroke: o.borde || 'none', 'stroke-width': o.borde ? 1 : 0, opacity: o.op == null ? 1 : o.op }, padre);
    r.largo = function (f) { r.setAttribute('width', Math.max(0, w * Math.max(0, Math.min(1, f)))); };
    r.largo(0);
    return r;
  }
  // Una barra vertical que crece desde la base y0 hasta y1 (y1 < y0) con f de 0 a 1.
  function columna(padre, x, w, y0, color, o) {
    o = o || {};
    var r = s('rect', { x: x, y: y0, width: w, height: 0, fill: color, stroke: o.borde || 'none', 'stroke-width': o.borde ? 1 : 0, opacity: o.op == null ? 1 : o.op }, padre);
    r.subir = function (y1, f) { var h = (y0 - y1) * Math.max(0, Math.min(1, f)); r.setAttribute('y', y0 - h); r.setAttribute('height', Math.max(0, h)); };
    return r;
  }
  function poner(el, at) { for (var k in at) el.setAttribute(k, at[k]); }
  // La franja de arriba: una ecuación por paso, con una línea de números debajo.
  function franja(svg, filas, x, y, o) {
    o = o || {};
    var gs = filas.map(function (f) {
      if (!f) return null;
      var g = grupo(svg);
      D.t(g, x, y, f[0], { tam: o.tam || 13.5, peso: 650, ancla: o.ancla || 'start' });
      if (f[1]) D.t(g, x, y + 20, f[1], { tam: 12.5, color: K.tinta2, ancla: o.ancla || 'start' });
      return g;
    });
    return function (k, u) { gs.forEach(function (g, i) { if (g) D.ver(g, i === k ? u : 0); }); };
  }
  // Granos repartidos sin azar dentro de una caja (cada paso dibuja lo mismo).
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

  /* ================= 7.2 Cómo se rompe un sólido ================= */

  /* De mil unidades de energía, una: lo que sale del motor, lo que le entrega la máquina al material (eficiencia
     mecánica de 25 a 60 %), la grieta que se abre y suelta la energía como calor, la milésima que queda en la
     superficie nueva y la máquina perfecta que seguiría calentando el producto. */
  ZB.animacion('perdida', {
    vista: [0, 0, 640, 270],
    alt: 'Cuatro barras sobre una escala de mil unidades de energía. Del motor salen 1000. Al material llegan de 250 a 600, la eficiencia mecánica de 25 a 60 %. A la derecha, una partícula con una grieta que se abre y suelta calor. La superficie nueva guarda más o menos una unidad, una milésima; otras estimaciones dan de 0,6 a 10 y ninguna pasa de 50. El resto, casi todo, sale como calor.',
    montar: function (svg) {
      var S = {}, x0 = 140, W = 300, k = W / 1000, h = 24;
      function fila(y, et) { var g = grupo(svg); D.t(g, x0 - 10, y + 16, et, { tam: 12.5, peso: 650, ancla: 'end' }); return g; }
      // del motor
      S.f1 = fila(34, 'del motor');
      s('rect', { x: x0, y: 34, width: W, height: h, fill: K.metalM, stroke: K.metalO, 'stroke-width': 1 }, S.f1);
      D.t(S.f1, x0 + W + 6, 51, '1000', { tam: 12.5, peso: 650 });
      // al material
      S.f2 = fila(88, 'al material');
      s('rect', { x: x0, y: 88, width: W, height: h, fill: 'none', stroke: K.guia, 'stroke-width': 1, 'stroke-dasharray': '3 3' }, S.f2);
      S.b2a = barra(S.f2, x0, 88, 250 * k, h, OL);
      S.b2b = barra(S.f2, x0 + 250 * k, 88, 350 * k, h, OL, { op: 0.35 });
      D.t(S.f2, x0 + W + 6, 105, '250 a 600', { tam: 12.5, peso: 650, color: OL });
      // la superficie nueva
      S.f3 = fila(142, 'superficie nueva');
      s('rect', { x: x0, y: 142, width: W, height: h, fill: 'none', stroke: K.guia, 'stroke-width': 1, 'stroke-dasharray': '3 3' }, S.f3);
      s('rect', { x: x0, y: 142, width: 1.2, height: h, fill: K.tinta }, S.f3);
      D.flecha(S.f3, x0 + 46, 154, x0 + 6, 154, { color: K.tinta, ancho: 1.4, punta: 6 });
      D.t(S.f3, x0 + 52, 158, 'más o menos 1: una milésima', { tam: 12.5, peso: 650 });
      D.t(S.f3, x0 + 52, 184, 'otras estimaciones: de 0,6 a 10; ninguna pasa de 50', { tam: 11.5, color: K.tinta2 });
      // el calor
      S.f4 = fila(196, 'calor');
      S.b4 = barra(S.f4, x0, 196, 999 * k, h, NA, { op: 0.85 });
      D.t(S.f4, x0 + W + 6, 213, 'casi todo', { tam: 12.5, peso: 650, color: NA });
      D.t(S.f4, x0, 244, 'una máquina perfecta entregaría las 1000 y el material las soltaría igual como calor', { tam: 11.5, color: K.tinta2 });
      // la partícula y su grieta
      var cx = 580, cy = 112;
      S.part = s('path', { d: 'M' + (cx - 40) + ' ' + (cy + 4) + 'L' + (cx - 26) + ' ' + (cy - 30) + 'L' + (cx + 6) + ' ' + (cy - 40) + 'L' + (cx + 38) + ' ' + (cy - 18) + 'L' + (cx + 42) + ' ' + (cy + 20) + 'L' + (cx + 14) + ' ' + (cy + 42) + 'L' + (cx - 24) + ' ' + (cy + 34) + 'Z', fill: SO.relleno, stroke: SO.oscuro, 'stroke-width': 1.4, opacity: 0 }, svg);
      S.grieta = D.trazo(svg, 'M' + (cx - 33) + ' ' + (cy - 12) + 'L' + (cx - 14) + ' ' + (cy - 4) + 'L' + (cx - 4) + ' ' + (cy + 10) + 'L' + (cx + 12) + ' ' + (cy + 6) + 'L' + (cx + 22) + ' ' + (cy + 22), { color: K.tinta, ancho: 2 });
      S.calor = grupo(svg);
      [[-34, -46], [0, -58], [36, -44]].forEach(function (p) {
        var x = cx + p[0], y = cy + p[1];
        s('path', { d: 'M' + x + ' ' + (y + 10) + 'q4 -5 0 -10q-4 -5 0 -10', fill: 'none', stroke: NA, 'stroke-width': 1.8, 'stroke-linecap': 'round' }, S.calor);
      });
      D.t(S.calor, cx, cy + 66, 'grieta nueva', { tam: 12, ancla: 'middle', color: K.tinta2 });
      return S;
    },
    pasos: [
      { texto: 'Mil unidades de energía salen del motor del molino.', dur: 1.2, ir: function (S, t) { D.ver(S.f1, t); } },
      { texto: 'La máquina le entrega al material entre 25 y 60 % de lo que toma del motor, entre 250 y 600 unidades: es su eficiencia mecánica. El resto no llega al material.', dur: 1.8, ir: function (S, t) { D.ver(S.f2, T(t, 0, 0.3)); S.b2a.largo(T(t, 0.2, 0.6)); S.b2b.largo(T(t, 0.5, 1)); } },
      { texto: 'La partícula absorbe energía de deformación hasta que falla su defecto más débil; al romperse suelta casi toda esa energía como calor, y lo que queda es una grieta nueva. Por eso Bond ata la energía útil a la longitud de las grietas.', dur: 2.2, ir: function (S, t) { D.ver(S.part, T(t, 0, 0.3)); S.grieta.dibujar(T(t, 0.25, 0.7)); D.ver(S.calor, T(t, 0.6, 1)); } },
      { texto: 'La superficie nueva guarda más o menos una de las mil unidades, una milésima, según Bond; otras estimaciones dan de 0,06 a 1 %, de 0,6 a 10 unidades, y ninguna pasa de 5 %.', dur: 1.8, ir: function (S, t) { D.ver(S.f3, t); } },
      { texto: 'Casi todo sale como calor. Una máquina perfecta le entregaría al material las mil unidades, y el material las soltaría igual al romperse: el desperdicio está en la física de la fractura.', dur: 1.8, ir: function (S, t) { D.ver(S.f4, T(t, 0, 0.3)); S.b4.largo(T(t, 0.2, 0.9)); } }
    ]
  });

  /* ================= 7.3 La energía ================= */

  /* Tres leyes ajustadas al mismo molino: la ecuación de Walker con sus tres exponentes, el punto del caso (de 3 mm a
     34,9 µm, 19,3 kWh/t sin correcciones), las constantes de Kick y de Rittinger que salen de ese punto, y lo que
     pide cada ley a 10 µm y a 1 mm, en escala logarítmica. Los mismos números de la figura de las tres leyes. */
  var W45 = bond(3000, 34.9), CR = W45 / (1 / 34.9 - 1 / 3000), CK = W45 / Math.log(3000 / 34.9);
  function leyes(P) { return [CK * Math.log(3000 / P), bond(3000, P), CR * (1 / P - 1 / 3000)]; }
  ZB.animacion('leyes', {
    vista: [0, 0, 640, 300],
    alt: 'Barras en escala logarítmica de la energía que pide cada ley para moler caliza desde 3 mm: Kick en naranja, Bond en azul, Rittinger en oliva. En el punto del caso, 34,9 µm, las tres piden 19,3 kWh/t porque se ajustaron ahí: la constante de Kick sale 4,34 kWh/t y la de Rittinger 683 kWh·µm/t. A 10 µm, Rittinger pide 68,0, Bond 38,1 y Kick 24,8 kWh/t. A 1 mm el orden se invierte: Kick 4,77, Bond 1,71 y Rittinger 0,46.',
    montar: function (svg) {
      var S = {}, y0 = 262, h = 160, lo = -1, hi = 2;
      var Y = function (v) { return y0 - (Math.log(Math.max(v, 0.1)) / Math.LN10 - lo) / (hi - lo) * h; };
      [0.1, 1, 10, 100].forEach(function (v) {
        s('line', { x1: 60, x2: 610, y1: Y(v), y2: Y(v), stroke: K.rejilla, 'stroke-width': 1 }, svg);
        D.t(svg, 54, Y(v) + 4, n(v, v < 1 ? 1 : 0), { tam: 12, ancla: 'end', color: K.tinta2 });
      });
      s('line', { x1: 60, x2: 610, y1: y0, y2: y0, stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      D.t(svg, 60, Y(100) - 10, 'kWh/t, escala logarítmica', { tam: 12, color: K.tinta2 });
      // la leyenda
      var ley = [['Kick', NA], ['Bond', AZ], ['Rittinger', OL]];
      ley.forEach(function (l, i) {
        s('rect', { x: 330 + i * 98, y: Y(100) - 20, width: 12, height: 12, fill: l[1] }, svg);
        D.t(svg, 346 + i * 98, Y(100) - 10, l[0], { tam: 12.5, peso: 650 });
      });
      var cs = [150, 335, 520], Ps = [1000, 34.9, 10], et = ['P_{80} = 1 mm', '34,9 µm, el caso', '10 µm'];
      S.g = []; S.b = []; S.v = [];
      cs.forEach(function (c, gi) {
        var vals = leyes(Ps[gi]), g = grupo(svg);
        D.t(g, c, y0 + 18, et[gi], { tam: 12.5, peso: 650, ancla: 'middle' });
        S.g.push(g); S.b.push([]); S.v.push([]);
        vals.forEach(function (v, i) {
          var x = c + (i - 1) * 42 - 16;
          var b = columna(g, x, 32, y0, ley[i][1]);
          var tx = D.t(g, x + 16, Y(v) - 6, n(v, v < 1 ? 2 : v < 10 ? 2 : 1), { tam: 12, peso: 650, ancla: 'middle', color: ley[i][1] });
          tx.setAttribute('opacity', 0);
          S.b[gi].push({ el: b, y: Y(v) }); S.v[gi].push(tx);
        });
      });
      S.fr = franja(svg, [
        ['dW = −C dx/x^n: n = 1, Kick; n = 1,5, Bond; n = 2, Rittinger'],
        ['Bond, de 3 mm a 34,9 µm: W = 128 (1/√34,9 − 1/√3000) = 19,3 kWh/t'],
        ['C_K = 19,3/ln(3000/34,9) = 4,34 kWh/t', 'C_R = 19,3/(1/34,9 − 1/3000) = 683 kWh·µm/t'],
        ['A 10 µm: Rittinger pide más que Bond, y Kick menos'],
        ['A 1 mm el orden se invierte'],
        ['Kick sobre 1 cm; Bond en barras y bolas; Rittinger de 10 a 1000 µm']
      ], 60, 24);
      S.subir = function (gi, f) { S.b[gi].forEach(function (b, i) { b.el.subir(b.y, f); D.ver(S.v[gi][i], T(f, 0.7, 1)); }); };
      return S;
    },
    pasos: [
      { texto: 'La ecuación de Walker, $dW = -C\\,dx/x^n$: con $n$ = 1 sale la ley de Kick, con 1,5 la de Bond y con 2 la de Rittinger. Las tres se aplican a la caliza que entra al molino de bolas con un $F_{80}$ de 3 mm.', dur: 1.6, ir: function (S, t) { S.fr(0, t); } },
      { texto: 'El punto del caso. Con la <a href="#eq-red-bond">ley de Bond</a> y $W_i$ = 12,80 kWh/t, de 3 mm a 34,9 µm: $W = 128\\,(1/\\sqrt{34,9} - 1/\\sqrt{3000})$ = 19,3 kWh/t. Las otras dos se ajustan para pasar por ahí.', dur: 1.8, ir: function (S, t) { S.fr(1, t); D.ver(S.g[1], T(t, 0, 0.3)); S.subir(1, T(t, 0.2, 1)); } },
      { texto: 'Las constantes salen de ese punto con la <a href="#eq-red-rk">ecuación de Rittinger y Kick</a>: $C_K = 19,3/\\ln(3000/34,9)$ = 4,34 kWh/t y $C_R = 19,3/(1/34,9 - 1/3000)$ = 683 kWh·µm/t.', dur: 1.8, ir: function (S, t) { S.fr(2, t); } },
      { texto: 'Hacia lo fino, a 10 µm, las leyes se separan: Rittinger pide 68,0 kWh/t, Bond 38,1 y Kick 24,8.', dur: 1.8, ir: function (S, t) { S.fr(3, t); D.ver(S.g[2], T(t, 0, 0.3)); S.subir(2, T(t, 0.2, 1)); } },
      { texto: 'Hacia lo grueso, a 1 mm, el orden se invierte: Kick pide 4,77 kWh/t, Bond 1,71 y Rittinger 0,46.', dur: 1.8, ir: function (S, t) { S.fr(4, t); D.ver(S.g[0], T(t, 0, 0.3)); S.subir(0, T(t, 0.2, 1)); } },
      { texto: 'Lejos del punto de ajuste las leyes no coinciden, y cada una vale en su intervalo: el mapa de Hukki pone a Kick por encima de un centímetro, a Bond en el intervalo de los molinos de barras y de bolas, y a Rittinger en la molienda fina, de 10 a 1000 µm.', dur: 1.8, ir: function (S, t) { S.fr(5, t); } }
    ]
  });

  /* El registro de energía de las tres etapas: la curva 10·Wi/√x con Wi = 12,80 kWh/t, en escala logarítmica de
     tamaño, y la energía de cada etapa como la diferencia de registros, con los números del ejemplo de las tres
     etapas; las correcciones del molino de bolas y la regla de la cuarta parte del tamaño. */
  var REG = function (x) { return 10 * WIT / Math.sqrt(x); };
  ZB.animacion('etapas', {
    vista: [0, 0, 640, 300],
    alt: 'La curva del registro de energía de Bond, 10 Wi/√x, contra el tamaño de 20 µm a 300 mm en escala logarítmica. Es casi cero en los tamaños gruesos y sube rápido en los finos. La trituradora pasa de 200 a 40 mm y gasta la diferencia de registros, 0,354 kWh/t; el molino de martillos, de 40 a 3 mm, 1,697 kWh/t; el molino de bolas, de 3 mm a 34,9 µm, 19,33 kWh/t sin correcciones y 29,6 con ellas. A 139,6 µm el registro es de 10,8 kWh/t, y a la cuarta parte de ese tamaño, 34,9 µm, de 21,7: el doble.',
    montar: function (svg) {
      var S = {}, xa = 70, xb = 600, ya = 250, yb = 60, la = Math.log10(20), lb = Math.log10(300000), vmax = 24;
      var X = function (x) { return xa + (Math.log10(x) - la) / (lb - la) * (xb - xa); };
      var Y = function (v) { return ya - v / vmax * (ya - yb); };
      [0, 5, 10, 15, 20].forEach(function (v) {
        s('line', { x1: xa, x2: xb, y1: Y(v), y2: Y(v), stroke: K.rejilla, 'stroke-width': 1 }, svg);
        D.t(svg, xa - 6, Y(v) + 4, n(v, 0), { tam: 12, ancla: 'end', color: K.tinta2 });
      });
      [[100, '100 µm'], [1000, '1 mm'], [10000, '10 mm'], [100000, '100 mm']].forEach(function (m) {
        s('line', { x1: X(m[0]), x2: X(m[0]), y1: yb, y2: ya, stroke: K.rejilla, 'stroke-width': 1 }, svg);
        D.t(svg, X(m[0]), ya + 16, m[1], { tam: 12, ancla: 'middle', color: K.tinta2 });
      });
      s('path', { d: 'M' + xa + ' ' + yb + 'V' + ya + 'H' + xb, fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      D.t(svg, xa, yb - 10, 'registro de energía, 10 W_i/√x (kWh/t)', { tam: 12, color: K.tinta2 });
      D.t(svg, xb, ya + 34, 'tamaño x (escala logarítmica)', { tam: 12, ancla: 'end', color: K.tinta2 });
      var pts = [];
      for (var l = Math.log10(29); l <= Math.log10(260000); l += 0.02) pts.push([X(Math.pow(10, l)), Y(REG(Math.pow(10, l)))]);
      S.curva = D.trazo(svg, D.camino(pts, function (v) { return v; }, function (v) { return v; }), { color: K.tinta2, ancho: 2 });
      // las etapas: F, P, rótulo
      var et = [
        { F: 200000, P: 40000, r: ['trituradora, de 200 a 40 mm:', '0,640 − 0,286 = 0,354 kWh/t; 1,77 kW'], xr: 420, yr: 200 },
        { F: 40000, P: 3000, r: ['molino de martillos, de 40 a 3 mm:', '2,337 − 0,640 = 1,697 kWh/t; 8,48 kW'], xr: 330, yr: 156 },
        { F: 3000, P: 34.9, r: ['molino de bolas, de 3 mm a 34,9 µm:', '21,67 − 2,34 = 19,33 kWh/t sin correcciones'], xr: 160, yr: 100 }
      ];
      S.et = et.map(function (e) {
        var g = grupo(svg), yF = Y(REG(e.F)), yP = Y(REG(e.P));
        camino(g, [[X(e.F), yF], [X(e.P), yF]], { color: AZ, ancho: 1.4, guion: '4 3' });
        s('line', { x1: X(e.P), x2: X(e.P), y1: yF, y2: yP, stroke: AZ, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
        D.punto(g, X(e.F), yF, { r: 4, color: K.blanco, borde: AZ });
        D.punto(g, X(e.P), yP, { r: 4.5, color: AZ, borde: AZ });
        D.t(g, e.xr, e.yr, e.r[0], { tam: 12, peso: 650, color: AZ });
        D.t(g, e.xr, e.yr + 16, e.r[1], { tam: 12, color: K.tinta });
        return g;
      });
      S.corr = oculto(svg, 160, 132, 'con correcciones: × 1,30 × 1,131 × 1,040 = 29,6 kWh/t; 148 kW', { tam: 12, peso: 650, color: AZ });
      S.cuarto = grupo(svg);
      var x4 = 139.6, y4 = Y(REG(x4)), x1 = 34.9, y1 = Y(REG(x1));
      D.punto(S.cuarto, X(x4), y4, { r: 5, color: K.caso, borde: K.tinta });
      D.punto(S.cuarto, X(x1), y1, { r: 5, color: K.caso, borde: K.tinta });
      D.t(S.cuarto, X(x4) + 9, y4 - 6, '10,8 a 139,6 µm', { tam: 12, peso: 650 });
      D.t(S.cuarto, X(x1) + 9, y1 - 2, '21,7 a 34,9 µm: el doble', { tam: 12, peso: 650 });
      return S;
    },
    pasos: [
      { texto: 'Bond le da a cada tamaño su registro de energía, $10\\,W_i/\\sqrt{x}$: la energía para llevar una tonelada de un tamaño infinito a $x$. Con la caliza, $W_i$ = 12,80 kWh por tonelada métrica. Es casi cero en los tamaños gruesos y sube rápido en los finos.', dur: 1.8, ir: function (S, t) { S.curva.dibujar(t); } },
      { texto: 'La energía de una etapa es el registro del producto menos el de la alimentación. La trituradora, de 200 a 40 mm: $0,640 - 0,286$ = 0,354 kWh/t, 1,77 kW con 5 t/h.', dur: 1.8, ir: function (S, t) { D.ver(S.et[0], t); } },
      { texto: 'El molino de martillos, de 40 a 3 mm: $2,337 - 0,640$ = 1,697 kWh/t, 8,48 kW. Bond da aquí solo una primera estimación: los molinos de martillos gastan varias veces más.', dur: 1.8, ir: function (S, t) { D.ver(S.et[1], t); } },
      { texto: 'El molino de bolas, de 3 mm a 34,9 µm: $21,67 - 2,34$ = 19,33 kWh/t. Con las correcciones de la molienda en seco, la finura y el diámetro, $19,33 \\times 1,30 \\times 1,131 \\times 1,040$ = 29,6 kWh/t y 148 kW.', dur: 2, ir: function (S, t) { D.ver(S.et[2], T(t, 0, 0.6)); D.ver(S.corr, T(t, 0.5, 1)); } },
      { texto: 'Cada vez que el tamaño se divide entre cuatro, el registro se duplica, porque $1/\\sqrt{x/4} = 2/\\sqrt{x}$: a 139,6 µm vale 10,8 kWh/t, y a 34,9 µm, 21,7. Por eso la etapa fina se lleva $29,6/31,65$ = 94 % de la energía de la planta.', dur: 2, ir: function (S, t) { D.ver(S.cuarto, t); } }
    ]
  });

  /* Reto: la ley de Bond con un índice de la tabla, el índice del ensayo de molturabilidad y el molino de bolas con
     sus correcciones. */

  /* ================= 7.4 Las máquinas ================= */

  /* De la cantera al polvo: el eje de tamaños de 1 m a 10 µm en escala logarítmica, lo que entrega cada clase de
     máquina según McCabe, la frontera de Bond en un cuarto de pulgada y las tres etapas del caso con su razón de
     reducción, como en la figura de la planta. */
  ZB.animacion('razon', {
    vista: [0, 0, 640, 270],
    alt: 'Un eje de tamaños de 1 m a 10 µm en escala logarítmica. Arriba, lo que entrega cada clase de máquina: las trituradoras primarias, de 150 a 250 mm; las secundarias, unos 6 mm; los molinos finos, casi todo por 74 µm; los ultrafinos, de 1 a 50 µm. Una línea punteada en un cuarto de pulgada separa triturar de moler. Abajo, las tres etapas del caso: la trituradora de mandíbulas de 200 a 40 mm, razón 5; el molino de martillos de 40 a 3 mm, razón 13,3; el molino de bolas de 3 mm a 34,9 µm, razón 86. La razón total es 5730.',
    montar: function (svg) {
      var S = {}, xa = 40, xb = 610, ye = 150;
      var X = function (um) { return xa + (6 - Math.log10(um)) / 5 * (xb - xa); };
      S.X = X;
      s('line', { x1: xa, x2: xb, y1: ye, y2: ye, stroke: K.tinta, 'stroke-width': 1.6 }, svg);
      [[1e6, '1 m'], [1e5, '100 mm'], [1e4, '10 mm'], [1e3, '1 mm'], [100, '100 µm'], [10, '10 µm']].forEach(function (m, i) {
        s('line', { x1: X(m[0]), x2: X(m[0]), y1: ye - 5, y2: ye + 5, stroke: K.tinta, 'stroke-width': 1.4 }, svg);
        D.t(svg, X(m[0]), ye + 20, m[1], { tam: 12, ancla: i === 0 ? 'start' : i === 5 ? 'end' : 'middle', color: K.tinta2 });
      });
      // las clases de McCabe
      S.clases = grupo(svg);
      var banda = function (a, b, y, et, anc, xt) {
        s('rect', { x: X(a), y: y, width: Math.max(4, X(b) - X(a)), height: 16, fill: K.zona, stroke: K.guia, 'stroke-width': 1 }, S.clases);
        D.t(S.clases, xt == null ? (X(a) + X(b)) / 2 : xt, y - 6, et, { tam: 11.5, ancla: anc || 'middle', color: K.tinta2 });
      };
      banda(250000, 150000, 92, 'primarias, 150 a 250 mm');
      banda(7000, 5000, 92, 'secundarias, unos 6 mm');
      banda(80, 70, 92, 'finos: casi todo por 74 µm', 'end', X(74) - 6);
      banda(50, 10, 92, 'ultrafinos, 1 a 50 µm', 'start', X(50) + 4);
      // la frontera de Bond
      S.bond = grupo(svg);
      var xbd = X(6350);
      camino(S.bond, [[xbd, 114], [xbd, 156]], { color: K.tinta2, ancho: 1.4, guion: '5 4' });
      D.t(S.bond, xbd - 6, 142, 'triturar', { tam: 12, ancla: 'end', color: K.tinta2 });
      D.t(S.bond, xbd + 6, 142, 'moler', { tam: 12, color: K.tinta2 });
      D.t(S.bond, xbd + 6, 126, '¼ de pulgada, 6,35 mm', { tam: 11.5, color: K.tinta2 });
      // las etapas del caso
      var et = [
        { a: 200000, b: 40000, n1: 'mandíbulas, × 5', n2: '200 a 40 mm' },
        { a: 40000, b: 3000, n1: 'martillos, × 13,3', n2: '40 a 3 mm' },
        { a: 3000, b: 34.9, n1: 'bolas, × 86', n2: '3 mm a 34,9 µm' }
      ];
      S.et = et.map(function (e) {
        var g = grupo(svg), x1 = X(e.a), x2 = X(e.b), xm = (x1 + x2) / 2;
        D.flecha(g, x1 + 2, 202, x2 - 2, 202, { color: AZ, ancho: 3, punta: 9 });
        s('line', { x1: x1, x2: x1, y1: 196, y2: 208, stroke: AZ, 'stroke-width': 1.6 }, g);
        D.t(g, xm, 192, e.n1, { tam: 12.5, peso: 650, ancla: 'middle', color: AZ });
        D.t(g, xm, 224, e.n2, { tam: 12, ancla: 'middle' });
        return g;
      });
      S.total = oculto(svg, X(200000), 40, 'razón total: 200 000/34,9 = 5 × 13,3 × 86 = 5730', { tam: 13, peso: 700 });
      return S;
    },
    pasos: [
      { texto: 'El eje va de 1 m a 10 µm en escala logarítmica: cada marca es diez veces más fina que la anterior. Arriba, lo que entrega cada clase de máquina: las trituradoras primarias, de 150 a 250 mm; las secundarias, unos 6 mm; los molinos finos, casi todo por 74 µm, y los ultrafinos, de 1 a 50 µm.', dur: 1.8, ir: function (S, t) { D.ver(S.clases, t); } },
      { texto: 'Bond pone la frontera entre triturar y moler en un cuarto de pulgada, 6,35 mm: producir partículas más grandes sigue siendo trituración.', dur: 1.4, ir: function (S, t) { D.ver(S.bond, t); } },
      { texto: 'La trituradora de mandíbulas lleva los trozos de 200 a 40 mm: una razón de reducción de $200/40$ = 5, dentro de los 3 a 6 de una etapa de trituración.', dur: 1.6, ir: function (S, t) { D.ver(S.et[0], t); } },
      { texto: 'El molino de martillos, de 40 a 3 mm: $40/3$ = 13,3. Su producto ya pasa la frontera de Bond: es molienda.', dur: 1.6, ir: function (S, t) { D.ver(S.et[1], t); } },
      { texto: 'El molino de bolas, de 3 mm a 34,9 µm: $3000/34,9$ = 86, dentro de los 20 a 200 de los molinos de bolas.', dur: 1.6, ir: function (S, t) { D.ver(S.et[2], t); } },
      { texto: 'La razón total es el producto de las tres: $5 \\times 13,3 \\times 86$ = 5730. En la escala logarítmica, la etapa de bolas sola recorre casi dos décadas de tamaño, y por eso se lleva casi toda la energía.', dur: 1.6, ir: function (S, t) { D.ver(S.total, t); } }
    ]
  });

  /* Reto: las etapas que pide una reducción, la capacidad de un par de rodillos y la partícula más grande que agarran. */

  /* ================= 7.5 El molino de bolas por dentro ================= */

  /* Dónde se suelta la bola: el corte del molino del caso, de 2,0 m, con la carga en reposo a 40 % del volumen (la
     superficie de la carga a 0,158 R bajo el centro), y el vuelo de la bola de afuera, que se suelta donde
     cos θ = φ² y sigue su parábola con g y la velocidad del revestimiento: a 50 % cae en la carga del mismo lado, a
     75 % cerca de la mitad, a 90 % en el pie, a 95 % en el revestimiento, y a 100 % no se suelta. Es el mismo
     cálculo del recuadro «Haga girar el molino». */
  function ySupCarga(J) {
    var lo = 0, hi = 2 * Math.PI;
    for (var i = 0; i < 60; i++) { var th = (lo + hi) / 2; if ((th - Math.sin(th)) / (2 * Math.PI) < J) lo = th; else hi = th; }
    return -Math.cos((lo + hi) / 4);
  }
  function vuelo(phi, ys) {
    var a = Math.acos(phi * phi), x0 = Math.sin(a), y0 = Math.cos(a), vx = -phi * Math.cos(a), vy = phi * Math.sin(a), pts = [[x0, y0]], t = 0, dt = 0.004;
    for (var k = 0; k < 4000; k++) {
      t += dt;
      var x = x0 + vx * t, y = y0 + vy * t - t * t / 2;
      if (x * x + y * y >= 1 && t > 0.05) { var hh = Math.hypot(x, y); pts.push([x / hh, y / hh]); return { a: a, pts: pts, donde: 'pared' }; }
      if (y <= ys && vy - t < 0) { pts.push([x, ys]); return { a: a, pts: pts, donde: 'carga' }; }
      pts.push([x, y]);
    }
    return { a: a, pts: pts, donde: '' };
  }
  ZB.animacion('suelta', {
    vista: [0, 0, 640, 306],
    alt: 'El corte del molino de bolas del caso, de 2,0 m, con la carga en reposo en la parte de abajo y el tambor que gira en el sentido contrario al de las agujas del reloj. La bola de la capa de afuera sube por la derecha y se suelta a un ángulo θ de la vertical con cos θ = φ². A 50 % de la crítica se suelta a 75,5° y cae enseguida sobre la carga; a 75 %, a 56°, y cae cerca de la mitad de la carga; a 90 %, a 36°, y cae sobre el pie de la carga, al otro lado; a 95 %, a 25°, y golpea el revestimiento; a 100 % no se suelta. A la derecha, una tabla con la fracción de la crítica, las r/min, el ángulo y dónde cae.',
    montar: function (svg) {
      var S = {}, cx = 160, cy = 152, R = 116, ys = ySupCarga(0.40);
      var P = function (p) { return [cx + p[0] * R, cy - p[1] * R]; };
      s('circle', { cx: cx, cy: cy, r: R + 7, fill: K.metalM, stroke: K.tinta, 'stroke-width': 1.6 }, svg);
      s('circle', { cx: cx, cy: cy, r: R, fill: K.blanco, stroke: K.metalO, 'stroke-width': 1.2 }, svg);
      // la carga en reposo: el segmento bajo la cuerda
      var hc = Math.sqrt(1 - ys * ys), yc = cy - ys * R;
      s('path', { d: 'M' + (cx - hc * R) + ' ' + yc + 'A' + R + ' ' + R + ' 0 0 0 ' + (cx + hc * R) + ' ' + yc + 'Z', fill: K.metal, stroke: K.metalO, 'stroke-width': 1 }, svg);
      for (var i = 0; i < 26; i++) {
        var fx = ((i * 0.618034) % 1) * 2 - 1, fy = ((i * 0.41421 + 0.2) % 1);
        var x = fx * hc * 0.92, ylo = -Math.sqrt(Math.max(0, 1 - x * x)) + 0.07, y = ys - 0.05 - fy * (ys - 0.05 - ylo);
        if (y < ylo) continue;
        var p = P([x, y]);
        s('circle', { cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: 5, fill: K.metalM, stroke: K.metalO, 'stroke-width': 0.8 }, svg);
      }
      // el giro
      var rg = R + 17, pg = function (a) { a = a * Math.PI / 180; return [cx + rg * Math.cos(a), cy + rg * Math.sin(a)]; };
      var g1 = pg(-55), g2 = pg(-118), g3 = pg(-126);
      s('path', { d: 'M' + g1[0].toFixed(1) + ' ' + g1[1].toFixed(1) + 'A' + rg + ' ' + rg + ' 0 0 0 ' + g2[0].toFixed(1) + ' ' + g2[1].toFixed(1), fill: 'none', stroke: NA, 'stroke-width': 1.8 }, svg);
      D.flecha(svg, g2[0], g2[1], g3[0], g3[1], { color: NA, ancho: 1.8, punta: 8 });
      D.t(svg, cx, cy + R + 28, 'D = 2,0 m; J = 0,40', { tam: 12, ancla: 'middle', color: K.tinta2 });
      // los vuelos
      var phis = [0.50, 0.75, 0.90, 0.95];
      S.v = phis.map(function (phi) {
        var vu = vuelo(phi, ys), d = vu.pts.map(function (q, j) { var p = P(q); return (j ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('');
        var tr = D.trazo(svg, d, { color: AZ, ancho: 2.2 });
        var p0 = P([Math.sin(vu.a), Math.cos(vu.a)]), pf = P(vu.pts[vu.pts.length - 1]);
        var g = grupo(svg);
        camino(g, [[cx, cy], [cx, cy - R]], { color: K.guia, ancho: 1.2, guion: '4 3' });
        camino(g, [[cx, cy], p0], { color: K.guia, ancho: 1.2, guion: '4 3' });
        var ra = 30, a1 = -Math.PI / 2, a2 = -Math.PI / 2 + vu.a;
        s('path', { d: 'M' + (cx + ra * Math.cos(a1)) + ' ' + (cy + ra * Math.sin(a1)) + 'A' + ra + ' ' + ra + ' 0 0 1 ' + (cx + ra * Math.cos(a2)) + ' ' + (cy + ra * Math.sin(a2)), fill: 'none', stroke: AZ, 'stroke-width': 1.4 }, g);
        var al = vu.a + 0.21; D.t(g, cx + 34 * Math.sin(al), cy - 34 * Math.cos(al) + 4, 'θ', { tam: 13, peso: 700, color: AZ, it: true, ancla: 'start' });
        var b0 = s('circle', { cx: p0[0], cy: p0[1], r: 6, fill: K.metalO, stroke: K.tinta, 'stroke-width': 1 }, g);
        var bf = s('circle', { cx: pf[0], cy: pf[1], r: 6, fill: K.caso, stroke: K.tinta, 'stroke-width': 1.2, opacity: 0 }, svg);
        return { tr: tr, g: g, bf: bf, b0: b0 };
      });
      // a 100 %: la bola da la vuelta pegada al revestimiento
      S.v100 = s('circle', { cx: cx, cy: cy, r: R - 7, fill: 'none', stroke: AZ, 'stroke-width': 2.2, 'stroke-dasharray': '6 4', opacity: 0 }, svg);
      // la tabla
      var xs = [330, 384, 440, 492], y0 = 66;
      ['φ', 'r/min', 'θ', 'dónde cae'].forEach(function (h, i) { D.t(svg, xs[i], y0, h, { tam: 12.5, peso: 700, it: i === 0 || i === 2 }); });
      s('line', { x1: 324, x2: 630, y1: y0 + 7, y2: y0 + 7, stroke: K.guia, 'stroke-width': 1 }, svg);
      var filas = [['50 %', '15,0', '75,5°', 'en cascada'], ['75 %', '22,4', '56°', 'mitad de la carga'], ['90 %', '26,9', '36°', 'pie de la carga'], ['95 %', '28,4', '25°', 'revestimiento'], ['100 %', '29,9', '0°', 'no se suelta']];
      S.f = filas.map(function (f, k) {
        var g = grupo(svg);
        f.forEach(function (c, i) { D.t(g, xs[i], y0 + 26 + 22 * k, c, { tam: 12, peso: i === 0 ? 650 : 500 }); });
        return g;
      });
      D.t(svg, 330, 210, 'N_c = 42,3/√2,0 = 29,9 r/min', { tam: 12.5, peso: 650 });
      D.t(svg, 330, 230, 'cos θ = φ^2', { tam: 12.5, peso: 650 });
      D.t(svg, 330, 254, 'se opera a 65 a 80 % de la crítica', { tam: 12, color: K.tinta2 });
      S.ver = function (k, t) {
        S.v.forEach(function (v, i) {
          if (i === k) { v.tr.dibujar(T(t, 0.25, 0.85)); v.tr.setAttribute('stroke', AZ); D.ver(v.g, T(t, 0, 0.3)); D.ver(v.bf, T(t, 0.8, 1)); }
          else if (i < k) { v.tr.dibujar(1); v.tr.setAttribute('stroke', K.guia); v.tr.setAttribute('opacity', 0.6); D.ver(v.g, 0); D.ver(v.bf, 0); }
        });
      };
      return S;
    },
    pasos: [
      { texto: 'El molino del caso, de 2,0 m, con la carga en reposo a 40 % del volumen. Gira en el sentido contrario al de las agujas del reloj, y la bola de afuera sube pegada al revestimiento por la derecha. Su velocidad crítica, con la forma de diseño, es $N_c = 42,3/\\sqrt{2,0}$ = 29,9 r/min.', dur: 1.4, ir: function (S, t) { } },
      { texto: 'A 50 % de la crítica, 15,0 r/min, la <a href="#eq-red-suelta">ecuación de la bola que se suelta</a> da $\\cos\\theta = 0,50^2 = 0,25$: la bola se suelta a 75,5° de la vertical y cae enseguida sobre la carga, del mismo lado. Las bolas ruedan sobre la carga: es la cascada.', dur: 2, ir: function (S, t) { S.ver(0, t); D.ver(S.f[0], T(t, 0.6, 1)); } },
      { texto: 'A 75 %, 22,4 r/min, la velocidad del caso: $\\cos\\theta = 0,75^2 = 0,5625$ y $\\theta$ = 56°. La bola vuela en parábola y cae cerca de la mitad de la carga: es la catarata, donde se hace la mayor parte de la molienda.', dur: 2, ir: function (S, t) { S.ver(1, t); D.ver(S.f[1], T(t, 0.6, 1)); } },
      { texto: 'A 90 %, 26,9 r/min: $\\cos\\theta = 0,81$ y $\\theta$ = 36°. La bola cae sobre el pie de la carga, al otro lado.', dur: 2, ir: function (S, t) { S.ver(2, t); D.ver(S.f[2], T(t, 0.6, 1)); } },
      { texto: 'A 95 %, 28,4 r/min: $\\theta$ = 25°, y la bola pasa por encima del pie y golpea el revestimiento. Por encima de unos 92 % el molino gasta acero sin moler; en marcha, con el pie de la carga más alto, eso pasa antes.', dur: 2, ir: function (S, t) { S.ver(3, t); D.ver(S.f[3], T(t, 0.6, 1)); } },
      { texto: 'A 100 %, $\\cos\\theta = 1$ y $\\theta = 0$: la bola no se suelta nunca y da la vuelta pegada al revestimiento; el molino centrifuga. Los molinos se operan a 65 a 80 % de la crítica.', dur: 1.6, ir: function (S, t) { S.ver(4, t); D.ver(S.v100, T(t, 0, 0.6)); D.ver(S.f[4], T(t, 0.5, 1)); } }
    ]
  });

  /* La bola que apenas rompe la partícula más grande: la regla de la raíz (1, 2 y 3 pulgadas para 1, 4 y 9 mm),
     la ecuación de la bola de Bond con los números del ejemplo del molino y el canto rodado de sílice del mismo
     peso, todo a la misma escala. */
  ZB.animacion('bola', {
    vista: [0, 0, 640, 280],
    alt: 'A la izquierda, tres bolas de 1, 2 y 3 pulgadas junto a las partículas de 1, 4 y 9 mm que rompen, a la misma escala: la bola va como la raíz del tamaño. A la derecha, la bola de reposición del caso, 1,63 pulgadas o 41 mm, junto a una partícula de 3 mm, y el canto rodado de sílice del mismo peso, 2,34 pulgadas o 59 mm.',
    montar: function (svg) {
      var S = {}, k = 1.5, yb = 226;
      S.regla = grupo(svg);
      [[1, 1, 56], [2, 4, 150], [3, 9, 276]].forEach(function (b) {
        var r = b[0] * 25.4 * k / 2, rp = b[1] * k / 2;
        s('circle', { cx: b[2], cy: yb - r, r: r, fill: K.metalM, stroke: K.metalO, 'stroke-width': 1.2 }, S.regla);
        s('circle', { cx: b[2] + r + rp + 4, cy: yb - rp, r: Math.max(rp, 1.2), fill: SO.relleno, stroke: SO.oscuro, 'stroke-width': 0.8 }, S.regla);
        D.t(S.regla, b[2] + 4, yb + 18, b[0] + (b[0] === 1 ? ' pulgada' : ' pulgadas'), { tam: 12, peso: 650, ancla: 'middle' });
        D.t(S.regla, b[2] + 4, yb + 34, 'para ' + b[1] + ' mm', { tam: 12, ancla: 'middle', color: K.tinta2 });
      });
      s('line', { x1: 20, x2: 330, y1: yb, y2: yb, stroke: K.guia, 'stroke-width': 1 }, S.regla);
      // el caso
      S.caso = grupo(svg);
      var rB = 41.4 * k / 2, rp3 = 3 * k / 2;
      s('line', { x1: 360, x2: 630, y1: yb, y2: yb, stroke: K.guia, 'stroke-width': 1 }, S.caso);
      s('circle', { cx: 410, cy: yb - rB, r: rB, fill: K.metalM, stroke: K.metalO, 'stroke-width': 1.2 }, S.caso);
      s('circle', { cx: 410 + rB + rp3 + 4, cy: yb - rp3, r: rp3, fill: SO.relleno, stroke: SO.oscuro, 'stroke-width': 0.8 }, S.caso);
      D.t(S.caso, 414, yb + 18, '1,63 pulgadas, 41 mm', { tam: 12, peso: 650, ancla: 'middle', color: AZ });
      D.t(S.caso, 414, yb + 34, 'para 3 mm', { tam: 12, ancla: 'middle', color: K.tinta2 });
      S.canto = grupo(svg);
      var rC = 59.5 * k / 2;
      s('circle', { cx: 556, cy: yb - rC, r: rC, fill: SO.relleno, stroke: SO.oscuro, 'stroke-width': 1.2 }, S.canto);
      D.t(S.canto, 556, yb + 18, 'canto de sílice', { tam: 12, peso: 650, ancla: 'middle', color: OL });
      D.t(S.canto, 556, yb + 34, '2,34 pulgadas, 59 mm', { tam: 12, ancla: 'middle', color: K.tinta2 });
      S.fr = franja(svg, [
        ['La bola va como la raíz del tamaño que rompe'],
        ['(F/K_B)^{1/2} = (3000/335)^{1/2} = 2,99', 'en seco, K_B = 335, con el F de 3000 µm del caso'],
        ['(S_g W_i/(100 φ √D))^{1/3} = (2,69 × 11,61/(100 × 0,75 × √6,56))^{1/3} = 0,546'],
        ['B = 2,99 × 0,546 = 1,63 pulgadas = 41 mm', 'la regla de la raíz daría √3 = 1,73 pulgadas'],
        ['B_c = 1,63 × (7,8/2,65)^{1/3} = 2,34 pulgadas = 59 mm', 'el mismo peso con un tercio de la densidad']
      ], 20, 26, { tam: 13 });
      return S;
    },
    pasos: [
      { texto: 'La bola de reposición correcta es la que apenas rompe las partículas más grandes de la alimentación, y va como la raíz del tamaño que tiene que romper: 1 pulgada para 1 mm, 2 pulgadas para 4 mm y 3 pulgadas para 9 mm, dibujadas a la misma escala.', dur: 1.8, ir: function (S, t) { S.fr(0, t); D.ver(S.regla, t); } },
      { texto: 'La <a href="#eq-red-bola">ecuación de la bola</a>, en seco, con $K_B$ = 335 y la alimentación de 3000 µm del caso: el primer factor es $(3000/335)^{1/2}$ = 2,99.', dur: 1.6, ir: function (S, t) { S.fr(1, t); } },
      { texto: 'El segundo factor lleva el material y el molino: la caliza, con $S_g$ = 2,69 y $W_i$ = 11,61; la fracción de la crítica, 0,75, y el diámetro, 6,56 pies. Da 0,546.', dur: 1.6, ir: function (S, t) { S.fr(2, t); } },
      { texto: 'La bola de reposición es $B = 2,99 \\times 0,546$ = 1,63 pulgadas, 41 mm, para una alimentación de 3 mm. La regla de la raíz daría $\\sqrt 3$ = 1,73 pulgadas; la ecuación ajusta por el material y el molino.', dur: 1.8, ir: function (S, t) { S.fr(3, t); D.ver(S.caso, t); } },
      { texto: 'Un canto rodado de sílice del mismo peso, con la <a href="#eq-red-canto">ecuación del canto</a>: $B_c = 1,63 \\times (7,8/2,65)^{1/3}$ = 2,34 pulgadas, 59 mm. Pesa lo mismo con un tercio de la densidad, y por eso el molino de cantos rodados es más grande.', dur: 1.8, ir: function (S, t) { S.fr(4, t); D.ver(S.canto, t); } }
    ]
  });

  /* Reto: la velocidad crítica y el ángulo de la bola, la carga y el largo de un molino, y la bola de reposición
     con su canto rodado. */

  /* ================= 7.6 El circuito cerrado ================= */

  /* El clasificador con sus tres corrientes y los análisis con el tamiz de 45 µm del texto: el balance de Dahl, la
     carga circulante, los caudales con los 17,5 t/h de la descarga y lo que mueve un punto de error. */
  ZB.animacion('dahl', {
    vista: [0, 0, 640, 290],
    alt: 'El clasificador con sus tres corrientes, cada una con su muestra: la descarga del molino, L, que entra por la izquierda; el producto, P, que sale por la derecha, y el retorno al molino, R, que sale por abajo. Una barra al lado de cada una muestra lo que retiene un tamiz de 45 µm: 56,5 %, 9,2 % y 75,4 %. El balance da R = 0,714 y una carga circulante de 2,50; con 17,5 t/h de descarga vuelven 12,5 t/h y salen 5,0 de producto. Con un punto de error en el retorno, la carga sale 2,38.',
    montar: function (svg) {
      var S = {};
      // el clasificador
      s('path', { d: 'M280 70H380V140L345 186H315L280 140Z', fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.6 }, svg);
      D.t(svg, 330, 104, 'Clasificador', { tam: 12.5, peso: 700, ancla: 'middle' });
      D.t(svg, 330, 120, 'de aire', { tam: 12.5, peso: 700, ancla: 'middle' });
      tubo(svg, [[30, 128], [280, 128]], { ancho: 2.2 });
      tubo(svg, [[380, 86], [610, 86]], { ancho: 2.2 });
      tubo(svg, [[330, 186], [330, 232], [30, 232]], { ancho: 2.2 });
      D.t(svg, 30, 118, 'L: descarga del molino', { tam: 12.5, peso: 650 });
      D.t(svg, 400, 76, 'P: producto', { tam: 12.5, peso: 650 });
      D.t(svg, 40, 222, 'R: retorno al molino', { tam: 12.5, peso: 650 });
      // las muestras: barras de lo que retiene el tamiz de 45 µm, de 0 a 100 % en 120 px
      var bar = function (x, y, Y, et) {
        var g = grupo(svg);
        s('rect', { x: x, y: y, width: 120, height: 12, fill: K.zona, stroke: K.guia, 'stroke-width': 1 }, g);
        var b = barra(g, x, y, 120, 12, SO.medio);
        var tx = D.t(g, x + 126, y + 11, et, { tam: 12.5, peso: 650 });
        return { g: g, b: b, f: Y / 100, tx: tx };
      };
      S.L = bar(40, 138, 56.5, 'Y_L = 56,5 %');
      S.P = bar(400, 96, 9.2, 'Y_P = 9,2 %');
      S.R = bar(40, 242, 75.4, 'Y_R = 75,4 %');
      S.err = s('rect', { x: 40 + 120 * 0.754, y: 242, width: 1.2, height: 12, fill: NA, opacity: 0 }, svg);
      S.errT = oculto(svg, 40, 272, 'con 76,4 % en lugar de 75,4: R = 47,3/67,2 = 0,704 y C_L = 2,38', { tam: 12, peso: 650, color: NA });
      // los caudales
      S.q = grupo(svg);
      D.t(S.q, 200, 118, '17,5 t/h', { tam: 12.5, peso: 650, color: AZ });
      D.t(S.q, 490, 76, '5,0 t/h', { tam: 12.5, peso: 650, color: AZ });
      D.t(S.q, 345, 214, '0,714 × 17,5 = 12,5 t/h', { tam: 12.5, peso: 650, color: AZ });
      S.fr = franja(svg, [
        null,
        ['ṁ_L = ṁ_P + ṁ_R;   Y_L ṁ_L = Y_P ṁ_P + Y_R ṁ_R'],
        ['R = (56,5 − 9,2)/(75,4 − 9,2) = 0,714;   C_L = R/(1 − R) = 2,50'],
        null,
        null
      ], 20, 30);
      return S;
    },
    pasos: [
      { texto: 'Tres muestras donde las corrientes caen libres: la descarga del molino (L), el producto (P) y el retorno (R). Un tamiz de 45 µm retiene el 56,5 %, el 9,2 % y el 75,4 % de cada una.', dur: 2, ir: function (S, t) { [S.L, S.P, S.R].forEach(function (m, i) { D.ver(m.g, T(t, 0.1 * i, 0.1 * i + 0.3)); m.b.largo(m.f * T(t, 0.2 + 0.1 * i, 0.7 + 0.1 * i)); }); } },
      { texto: 'Todo lo que entra al clasificador sale por el producto o por el retorno, y lo mismo pasa con la parte que el tamiz retiene. Son los dos balances de la criba del capítulo 6.', dur: 1.6, ir: function (S, t) { S.fr(1, t); } },
      { texto: 'De los dos balances sale la fracción de la descarga que vuelve, sin pesar nada, con la <a href="#eq-red-dahl">ecuación de Dahl</a>: $R = (56,5 - 9,2)/(75,4 - 9,2)$ = 0,714, y la carga circulante, $C_L = R/(1 - R)$ = 2,50, el 250 % del modelo.', dur: 2, ir: function (S, t) { S.fr(2, t); } },
      { texto: 'Con las 17,5 t/h de la descarga, vuelven $0,714 \\times 17,5$ = 12,5 t/h al molino y salen 5,0 t/h de producto: los caudales del caso, sin pesar ninguna corriente.', dur: 1.6, ir: function (S, t) { S.fr(2, 1); D.ver(S.q, t); } },
      { texto: 'Si el análisis del retorno se equivocara en un punto, 76,4 % en lugar de 75,4, saldría $R = 47,3/67,2$ = 0,704 y $C_L$ = 2,38: un punto del análisis mueve la carga en doce puntos. Por eso el balance sirve más para revisar los análisis que para calcular la carga.', dur: 2, ir: function (S, t) { S.fr(2, 1); poner(S.err, { width: 120 * 0.01 * T(t, 0, 0.5) + 0.01 }); D.ver(S.err, T(t, 0, 0.3)); D.ver(S.errT, T(t, 0.4, 1)); } }
    ]
  });

  /* El circuito cerrado con todas sus corrientes, como en la figura de la planta: la caliza fresca de 3 mm, el
     molino de 148 kW, la descarga, el clasificador que corta en 32 µm, el grueso que vuelve, el producto y el aire
     al filtro; y las cargas circulantes del modelo con 5, 6 y 8 t/h. */
  var CIRC = [
    { F: 5, R: 12.5, x98: 65, CL: '250 %' },
    { F: 6, R: 28.2, x98: 72, CL: '470 %' },
    { F: 8, R: 119.2, x98: 98, CL: '1490 %' }
  ];
  ZB.animacion('circuito', {
    vista: [0, 0, 640, 320],
    alt: 'El circuito del caso: la caliza fresca de 3 mm entra al molino de bolas de 148 kW junto con el grueso que devuelve el clasificador; la descarga sube al clasificador, que corta en 32 µm; el producto sale por la derecha y el aire caliente sube al filtro. Con 5 t/h de caliza fresca vuelven 12,5 t/h, una carga circulante de 250 %, y el producto cumple el x98,3 de 65 µm. Con 6 t/h vuelven 28,2 t/h, 470 %, y el x98,3 sube a 72 µm. Con 8 t/h vuelven 119 t/h, 1490 %, y el x98,3 llega a 98 µm. Una tabla abajo reúne los tres casos.',
    montar: function (svg) {
      var S = {};
      // el molino
      s('rect', { x: 140, y: 170, width: 150, height: 60, rx: 26, fill: K.metalM, stroke: K.tinta, 'stroke-width': 1.6 }, svg);
      D.t(svg, 215, 196, 'Molino de bolas', { tam: 12.5, peso: 700, ancla: 'middle' });
      D.t(svg, 215, 213, '148 kW, en seco', { tam: 12, ancla: 'middle' });
      // el clasificador
      s('path', { d: 'M380 66H470V112L440 140H410L380 112Z', fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.6 }, svg);
      D.t(svg, 425, 88, 'Clasificador', { tam: 12, peso: 700, ancla: 'middle' });
      D.t(svg, 425, 104, 'corte 32 µm', { tam: 12, ancla: 'middle' });
      // la fresca
      tubo(svg, [[20, 200], [140, 200]], { ancho: 2.2 });
      D.t(svg, 20, 170, 'Caliza fresca', { tam: 12.5, peso: 700 });
      D.t(svg, 20, 188, '3 mm', { tam: 12 });
      S.tF = D.t(svg, 20, 220, '', { tam: 12.5, peso: 650, color: AZ });
      // la descarga
      tubo(svg, [[290, 200], [425, 200], [425, 142]], { ancho: 2.2 });
      S.tQ = D.t(svg, 434, 186, '', { tam: 12.5, peso: 650, color: AZ });
      D.t(svg, 434, 170, 'descarga', { tam: 12 });
      // el grueso que vuelve
      S.ret = s('path', { d: 'M380 98H215V168', fill: 'none', stroke: K.tinta, 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, svg);
      S.retF = s('path', { d: 'M215 168L209 156H221Z', fill: K.tinta }, svg);
      D.t(svg, 226, 90, 'grueso que vuelve', { tam: 12 });
      S.tR = D.t(svg, 226, 126, '', { tam: 12.5, peso: 650, color: AZ });
      // el producto
      tubo(svg, [[470, 90], [610, 90]], { ancho: 2.2 });
      D.t(svg, 484, 80, 'Producto', { tam: 12.5, peso: 700 });
      S.tP = D.t(svg, 484, 108, '', { tam: 12.5, peso: 650, color: AZ });
      S.tX = D.t(svg, 484, 126, '', { tam: 12.5, peso: 650 });
      // el aire
      tubo(svg, [[425, 66], [425, 18]], { ancho: 1.6, color: K.tinta2 });
      D.t(svg, 416, 26, 'aire caliente al filtro', { tam: 12, ancla: 'end', color: K.tinta2 });
      // la tabla
      var cx = [60, 190, 330, 470], yh = 256;
      ['caliza fresca', 'grueso que vuelve', 'carga circulante', 'x_{98,3} del producto'].forEach(function (h, i) { D.t(svg, cx[i], yh, h, { tam: 12, peso: 700 }); });
      s('line', { x1: 54, x2: 610, y1: yh + 6, y2: yh + 6, stroke: K.guia, 'stroke-width': 1 }, svg);
      S.fil = CIRC.map(function (c, k) {
        var g = grupo(svg), y = yh + 22 + 18 * k;
        D.t(g, cx[0], y, n(c.F, 0) + ' t/h', { tam: 12 });
        D.t(g, cx[1], y, n(c.R, 1) + ' t/h', { tam: 12 });
        D.t(g, cx[2], y, c.CL, { tam: 12, peso: 650, color: AZ });
        D.t(g, cx[3], y, n(c.x98, 0) + ' µm' + (c.x98 > 65.5 ? ', no cumple' : ', cumple'), { tam: 12, color: c.x98 > 65.5 ? K.alerta : K.tinta });
        return g;
      });
      S.marca = s('rect', { x: 324, y: yh + 8, width: 270, height: 38, fill: 'none', stroke: NA, 'stroke-width': 1.8, rx: 3, opacity: 0 }, svg);
      S.caso = function (k) {
        var c = CIRC[k], Q = c.F + c.R;
        D.ponerTexto(S.tF, n(c.F, 0) + ' t/h');
        D.ponerTexto(S.tQ, n(Q, 1) + ' t/h');
        D.ponerTexto(S.tR, n(c.R, 1) + ' t/h');
        D.ponerTexto(S.tP, n(c.F, 0) + ' t/h');
        D.ponerTexto(S.tX, 'x_{98,3} = ' + n(c.x98, 0) + ' µm');
        S.tX.setAttribute('fill', c.x98 > 65.5 ? K.alerta : K.tinta);
        var w = 1.5 + c.R / 15;
        S.ret.setAttribute('stroke-width', w);
        poner(S.retF, { d: 'M215 ' + (168 + w / 2) + 'L' + (215 - 4 - w) + ' ' + (156 - w) + 'H' + (215 + 4 + w) + 'Z' });
      };
      S.caso(0);
      return S;
    },
    pasos: [
      { texto: 'El circuito del caso con todas sus corrientes: 5 t/h de caliza fresca de 3 mm y 12,5 t/h de grueso que devuelve el clasificador entran al molino de 148 kW, que descarga 17,5 t/h al clasificador. El clasificador corta en 32 µm: el producto, 5 t/h, sale con un $x_{98,3}$ de 65 µm, y el aire se lleva el calor al filtro.', dur: 1.6, ir: function (S, t) { S.caso(0); } },
      { texto: 'La carga circulante es el retorno dividido entre el producto: $C_L$ = 12,5/5 = 2,50, el 250 %, la misma del ensayo de Bond.', dur: 1.4, ir: function (S, t) { S.caso(0); D.ver(S.fil[0], t); } },
      { texto: 'Con el mismo corte y 6 t/h de caliza fresca, cada tonelada recibe menos energía: el producto engruesa hasta un $x_{98,3}$ de 72 µm, y el grueso que vuelve sube a 28,2 t/h, una carga de 470 %. Al molino entran $6 + 28,2$ = 34,2 t/h.', dur: 1.8, ir: function (S, t) { S.caso(t > 0.3 ? 1 : 0); D.ver(S.fil[1], T(t, 0.3, 1)); } },
      { texto: 'Con 8 t/h, el $x_{98,3}$ llega a 98 µm y vuelven 119 t/h, una carga de 1490 %: al molino entrarían 127 t/h.', dur: 1.8, ir: function (S, t) { S.caso(t > 0.3 ? 2 : 1); D.ver(S.fil[2], T(t, 0.3, 1)); } },
      { texto: 'La carga circulante crece mucho antes de que el producto se salga de la especificación: casi se duplica, de 250 a 470 %, mientras el $x_{98,3}$ pasa de 65 a 72 µm. Por eso una carga que sube sin que nadie haya tocado el clasificador avisa que el molino perdió capacidad, porque se gastaron las bolas o cambió la piedra.', dur: 1.8, ir: function (S, t) { S.caso(2); D.ver(S.marca, t); } }
    ]
  });

  /* Reto: el balance de Dahl, la energía de cada pasada y el corte del clasificador. */

  /* ================= 7.7 Lo que el molino le deja al producto ================= */

  /* El acero que se acumula en el carbonato: la regla de Bond con el divisor del medio, en seco y con el
     revestimiento, los gramos por tonelada del ejemplo del hierro y el acero que se lleva el producto de 5 t/h,
     hora tras hora, con la banda de los divisores de 9 y de 6. */
  ZB.animacion('hierro', {
    vista: [0, 0, 640, 290],
    alt: 'A la izquierda, la cuenta del acero: en húmedo, (0,0256 + 1)/7,5 = 0,137 lb/kWh; en seco, un séptimo, 8,9 g/kWh; con el revestimiento, 9,97 g/kWh; con 29,6 kWh/t, 295 g por tonelada; con 5 t/h, 1,47 kg por hora. A la derecha, el acero que se lleva el carbonato a lo largo de un día: una recta que llega a unos 35 kg a las 24 horas, dentro de una banda de 29 a 44 kg con los divisores de 9 y de 6. Un molino de cantos rodados de sílice dejaría la recta en cero.',
    montar: function (svg) {
      var S = {};
      var lin = [
        ['húmedo: (0,0256 + 1)/7,5 = 0,137 lb/kWh', ''],
        ['seco, un séptimo: 0,0195 lb/kWh = 8,9 g/kWh', 'con el revestimiento: 8,9 × 9/8 = 9,97 g/kWh'],
        ['por tonelada: 9,97 × 29,6 = 295 g/t', 'de 246 a 368 g/t con los divisores de 9 y de 6'],
        ['por hora: 5 × 295 = 1,47 kg; por día, unos 35 kg', '']
      ];
      S.l = lin.map(function (l, k) {
        var g = grupo(svg), y = 46 + 56 * k;
        D.t(g, 20, y, l[0], { tam: 12.5, peso: 650 });
        if (l[1]) D.t(g, 20, y + 18, l[1], { tam: 12, color: K.tinta2 });
        return g;
      });
      // la gráfica: kg de acero contra horas
      var o = { x: 380, y: 50, w: 230, h: 180, xmin: 0, xmax: 24, ymin: 0, ymax: 50, xt: [0, 6, 12, 18, 24], yt: [0, 10, 20, 30, 40, 50], xr: 'horas', yr: 'acero en el producto (kg)' };
      S.ejes = D.ejes(svg, o);
      S.ejes.g.setAttribute('opacity', 0);
      var X = S.ejes.X, Y = S.ejes.Y, gh = 5 * 0.2947, lo = 5 * 0.2456, hi = 5 * 0.3684;
      S.banda = s('path', { d: 'M' + X(0) + ' ' + Y(0) + 'L' + X(24) + ' ' + Y(24 * hi) + 'L' + X(24) + ' ' + Y(24 * lo) + 'Z', fill: K.metal, opacity: 0 }, svg);
      S.recta = D.trazo(svg, 'M' + X(0) + ' ' + Y(0) + 'L' + X(24) + ' ' + Y(24 * gh), { color: K.metalO, ancho: 2.6 });
      S.pt = D.punto(svg, X(24), Y(24 * gh), { r: 5 });
      S.pt.setAttribute('opacity', 0);
      S.ptT = oculto(svg, X(24) - 6, Y(24 * gh) - 10, '35 kg', { tam: 12.5, peso: 700, ancla: 'end' });
      S.cantos = grupo(svg);
      camino(S.cantos, [[X(0), Y(0) - 1], [X(24), Y(0) - 1]], { color: OL, ancho: 2.6 });
      D.t(S.cantos, 20, 270, 'Sin hierro: cantos rodados de sílice de 59 mm, en un molino de 2,72 × 3,22 m', { tam: 12, peso: 650, color: OL });
      return S;
    },
    pasos: [
      { texto: 'La regla de Bond, con el divisor del medio, 7,5: en húmedo, las bolas pierden $(A_i + 1)/7,5$ libras por kWh. Con la caliza, $A_i$ = 0,0256: $(0,0256 + 1)/7,5$ = 0,137 lb/kWh.', dur: 1.6, ir: function (S, t) { D.ver(S.l[0], t); } },
      { texto: 'El molino del caso muele en seco, y en seco se pierde un séptimo: 0,0195 lb/kWh, 8,9 g/kWh. El revestimiento suma un octavo de eso: $8,9 \\times 9/8$ = 9,97 g/kWh.', dur: 1.8, ir: function (S, t) { D.ver(S.l[1], t); } },
      { texto: 'Con los 29,6 kWh/t del molino, el carbonato se lleva $9,97 \\times 29,6$ = 295 g de acero por tonelada, unos 300 mg por kilogramo; con los divisores de 9 y de 6, de 246 a 368 g/t.', dur: 1.8, ir: function (S, t) { D.ver(S.l[2], t); } },
      { texto: 'Con 5 t/h de producto, son $5 \\times 295$ = 1,47 kg de acero por hora, que se acumulan en el carbonato: en un día, unos 35 kg, de 29 a 44 kg con los dos divisores.', dur: 2.2, ir: function (S, t) { D.ver(S.l[3], T(t, 0, 0.3)); D.ver(S.ejes.g, T(t, 0, 0.3)); D.ver(S.banda, 0.5 * T(t, 0.3, 0.7)); S.recta.dibujar(T(t, 0.3, 0.9)); D.ver(S.pt, T(t, 0.85, 1)); D.ver(S.ptT, T(t, 0.85, 1)); } },
      { texto: 'Si el comprador no admite ese hierro, se saca con separadores magnéticos o no se pone: con cantos rodados de sílice de 59 mm en lugar de bolas, el molino que hace el mismo trabajo mide 2,72 × 3,22 m, dos veces y media el volumen del de bolas.', dur: 1.8, ir: function (S, t) { D.ver(S.cantos, t); } }
    ]
  });

  /* A dónde va el calor del molino: el balance de energía del molino y el clasificador con los números del texto,
     29,6 kWh/t, 106 kJ/kg, los 120 K que subiría el carbonato, los 42 kW que se lleva el producto a 60 °C y los
     106 kW que se lleva el aire, 3,0 kg/s, unos 9000 m³/h. */
  ZB.animacion('calor', {
    vista: [0, 0, 640, 290],
    alt: 'El molino y el clasificador dentro de una frontera punteada. Entran el trabajo, 148 kW, la caliza a 25 °C y el aire a 25 °C. Si todo el calor se quedara en el carbonato, este se calentaría unos 120 K. Sale el carbonato a 60 °C, que se lleva 42 kW, y el aire a 60 °C, que se lleva los otros 106 kW: unos 3,0 kg/s, unos 9000 m³/h. Una barra a la derecha reparte los 148 kW entre el producto y el aire.',
    montar: function (svg) {
      var S = {};
      // la frontera
      s('rect', { x: 150, y: 96, width: 200, height: 110, rx: 6, fill: K.zona, stroke: OL, 'stroke-width': 1.6, 'stroke-dasharray': '7 5' }, svg);
      D.t(svg, 250, 146, 'molino de bolas', { tam: 12.5, peso: 700, ancla: 'middle' });
      D.t(svg, 250, 163, 'y clasificador', { tam: 12.5, peso: 700, ancla: 'middle' });
      // el trabajo
      S.w = grupo(svg);
      D.flecha(S.w, 250, 30, 250, 94, { color: K.tinta, ancho: 3, punta: 9 });
      D.t(S.w, 260, 44, 'trabajo: 148 kW', { tam: 12.5, peso: 700 });
      D.t(S.w, 260, 62, '29,6 kWh/t = 106 kJ/kg', { tam: 12 });
      // las entradas
      tubo(svg, [[20, 130], [150, 130]], { ancho: 2 });
      D.t(svg, 20, 120, 'caliza, 5 t/h, 25 °C', { tam: 12 });
      tubo(svg, [[20, 186], [150, 186]], { ancho: 2, color: K.tinta2 });
      D.t(svg, 20, 176, 'aire, 25 °C', { tam: 12, color: K.tinta2 });
      // el carbonato que sale
      S.p = grupo(svg);
      D.flecha(S.p, 350, 186, 470, 186, { color: K.tinta, ancho: 2 });
      D.t(S.p, 356, 204, 'carbonato, 60 °C', { tam: 12 });
      D.t(S.p, 356, 222, '42 kW', { tam: 12.5, peso: 700, color: SO.oscuro });
      // el aire que sale
      S.a = grupo(svg);
      D.flecha(S.a, 350, 120, 470, 120, { color: K.tinta2, ancho: 2 });
      D.t(S.a, 356, 92, 'aire, 60 °C: 106 kW', { tam: 12.5, peso: 700, color: K.tinta2 });
      D.t(S.a, 356, 110, 'unos 3,0 kg/s, 9000 m³/h', { tam: 12, color: K.tinta2 });
      // el calor que se quedaría
      S.q = grupo(svg);
      s('path', { d: 'M178 198q5 -6 0 -12q-5 -6 0 -12M250 198q5 -6 0 -12q-5 -6 0 -12M322 198q5 -6 0 -12q-5 -6 0 -12', fill: 'none', stroke: NA, 'stroke-width': 1.8 }, S.q);
      D.t(S.q, 150, 250, 'si se quedara en el carbonato: 106/0,87 ≈ 120 K más', { tam: 12, peso: 650, color: NA });
      // la barra del reparto
      var bx = 520, by = 70, bh = 160, k = bh / 148;
      S.b = grupo(svg);
      D.t(S.b, bx + 30, by - 12, '148 kW', { tam: 12.5, peso: 700, ancla: 'middle' });
      s('rect', { x: bx + 10, y: by, width: 40, height: bh, fill: 'none', stroke: K.guia, 'stroke-width': 1, 'stroke-dasharray': '3 3' }, S.b);
      S.bP = columna(svg, bx + 10, 40, by + bh, SO.medio);
      S.bA = columna(svg, bx + 10, 40, by + bh - 42 * k, GA.oscuro);
      S.tbP = oculto(svg, bx + 56, by + bh - 16, 'producto', { tam: 11.5 });
      S.tbA = oculto(svg, bx + 56, by + bh - 42 * k - 50, 'aire', { tam: 11.5 });
      S.k = k; S.by = by; S.bh = bh;
      return S;
    },
    pasos: [
      { texto: 'El molino de bolas gasta 29,6 kWh por tonelada, $29,6 \\times 3600/1000$ = 106 kJ/kg: con 5 t/h, 148 kW. Casi toda esa energía aparece como calor.', dur: 1.6, ir: function (S, t) { D.ver(S.w, t); D.ver(S.b, T(t, 0.5, 1)); } },
      { texto: 'Si el calor se quedara en el carbonato, con la capacidad calorífica de la calcita a 55 °C, 0,87 kJ/(kg·K), lo calentaría $106/0,87$, unos 120 K.', dur: 1.6, ir: function (S, t) { D.ver(S.q, t); } },
      { texto: 'No se queda ahí. El carbonato sale a 60 °C y se lleva $(5000/3600) \\times 0,87 \\times (60 - 25)$ = 42 kW de los 148.', dur: 1.8, ir: function (S, t) { D.ver(S.q, 1 - 0.45 * T(t, 0, 0.4)); D.ver(S.p, T(t, 0, 0.5)); S.bP.subir(S.by + S.bh - 42 * S.k, T(t, 0.3, 1)); D.ver(S.tbP, T(t, 0.7, 1)); } },
      { texto: 'Si el casco no pierde nada, el aire que barre el clasificador se lleva los otros 106 kW: unos 3,0 kg/s que entran a 25 °C y salen a 60 °C, unos 9000 m³/h.', dur: 1.8, ir: function (S, t) { D.ver(S.a, T(t, 0, 0.5)); S.bA.subir(S.by, T(t, 0.3, 1)); D.ver(S.tbA, T(t, 0.7, 1)); } },
      { texto: 'Para la caliza ese calor es solo un costo de ventilación. Para un alimento, un polímero o un fármaco puede ser el límite de la operación: se saca con camisas de agua helada o de salmuera, con aire refrigerado o con hielo seco.', dur: 1.4, ir: function (S, t) { } }
    ]
  });

  /* Reto: el acero que deja un molino, el canto rodado y su carga, y a dónde va el calor. */
  var ABR = [{ n: 'caliza', a: 0.0256 }, { n: 'cuarzo', a: 0.1831 }, { n: 'cuarcita', a: 0.6905 }];

  /* ================= 7.8 Cortar ================= */

  /* Tres cortes y la superficie que dejan: una pieza de 4 × 3 × 3 cubos de 10 mm, como la de la figura de los
     cortes, con 1040 kg/m³; la superficie por kilogramo antes y después de cada corte, que termina en 6/(ρ b),
     la del ejemplo de la zanahoria, y el carbonato del caso para comparar. */
  ZB.animacion('cubos', {
    vista: [0, 0, 640, 280],
    alt: 'A la izquierda, una pieza de 40 × 30 × 30 mm en perspectiva, en la que aparecen los tres cortes: tajadas, tiras y cubos de 10 mm. A la derecha, una barra por estado con la superficie por kilogramo: la pieza, 0,176 m²/kg; las cuatro tajadas, 0,321; las doce tiras, 0,449; los 36 cubos, 0,577, que es 6/(ρ b). Un kilogramo del carbonato del caso expone 101 m²/kg.',
    montar: function (svg) {
      var S = {}, u = 26, x0 = 40, y0 = 214, dx = 12, dy = -9;
      var P = function (a, b, c) { return [x0 + a * u + c * dx, y0 - b * u + c * dy]; };
      var poly = function (pts, o) { return s('path', { d: 'M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L') + 'Z', fill: o.fill, stroke: K.tinta, 'stroke-width': 1.4 }, svg); };
      poly([P(0, 0, 0), P(4, 0, 0), P(4, 3, 0), P(0, 3, 0)], { fill: SO.relleno });
      poly([P(0, 3, 0), P(4, 3, 0), P(4, 3, 3), P(0, 3, 3)], { fill: SO.medio });
      poly([P(4, 0, 0), P(4, 0, 3), P(4, 3, 3), P(4, 3, 0)], { fill: SO.medio });
      var linea = function (g, a, b) { var p = P(a[0], a[1], a[2]), q = P(b[0], b[1], b[2]); s('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], stroke: K.tinta, 'stroke-width': 1.6 }, g); };
      S.c1 = grupo(svg); S.c2 = grupo(svg); S.c3 = grupo(svg);
      [1, 2, 3].forEach(function (i) { linea(S.c1, [i, 0, 0], [i, 3, 0]); linea(S.c1, [i, 3, 0], [i, 3, 3]); });
      [1, 2].forEach(function (j) { linea(S.c2, [0, j, 0], [4, j, 0]); linea(S.c2, [4, j, 0], [4, j, 3]); });
      [1, 2].forEach(function (k) { linea(S.c3, [0, 3, k], [4, 3, k]); linea(S.c3, [4, 0, k], [4, 3, k]); });
      D.t(svg, x0 + 2 * u, y0 + 22, '40 × 30 × 30 mm, 37,4 g', { tam: 12, ancla: 'middle', color: K.tinta2 });
      // las barras
      var bx = 330, bw = 230, vmax = 0.62, filas = [['pieza', 0.1763, '6600 mm²'], ['tajadas', 0.3205, '12 000 mm²'], ['tiras', 0.4487, '16 800 mm²'], ['cubos', 0.5769, '21 600 mm²']];
      D.t(svg, bx, 40, 'A_w (m²/kg)', { tam: 12.5, peso: 700 });
      S.b = filas.map(function (f, k) {
        var g = grupo(svg), y = 58 + 40 * k;
        D.t(g, bx - 8, y + 15, f[0], { tam: 12.5, peso: 650, ancla: 'end' });
        var b = barra(g, bx, y, bw / vmax * f[1], 20, k === 3 ? AZ : SO.medio);
        D.t(g, bx + bw / vmax * f[1] + 6, y + 15, n(f[1], 3), { tam: 12.5, peso: 700, color: k === 3 ? AZ : K.tinta });
        D.t(g, bx, y + 34, f[2], { tam: 11.5, color: K.tinta2 });
        return { g: g, b: b };
      });
      S.carb = oculto(svg, bx - 70, 240, 'carbonato del caso: 101 m²/kg, unas 174 veces más', { tam: 12.5, peso: 700, color: OL });
      return S;
    },
    pasos: [
      { texto: 'Una pieza de 40 × 30 × 30 mm, como la de la <a href="#fig-red-cortes">figura de los tres cortes</a>, con 1040 kg/m³: pesa 37,4 g y tiene 6600 mm² de superficie, así que $A_w$ = 0,0066/0,0374 = 0,176 m²/kg.', dur: 1.6, ir: function (S, t) { D.ver(S.b[0].g, t); S.b[0].b.largo(T(t, 0.2, 1)); } },
      { texto: 'El primer corte saca cuatro tajadas de 10 × 30 × 30 mm, de 3000 mm² cada una: 12 000 mm², 0,321 m²/kg.', dur: 1.6, ir: function (S, t) { D.ver(S.c1, T(t, 0, 0.4)); D.ver(S.b[1].g, T(t, 0.2, 0.5)); S.b[1].b.largo(T(t, 0.3, 1)); } },
      { texto: 'El segundo corte, en ángulo recto, deja doce tiras de 10 × 10 × 30 mm, de 1400 mm² cada una: 16 800 mm², 0,449 m²/kg.', dur: 1.6, ir: function (S, t) { D.ver(S.c2, T(t, 0, 0.4)); D.ver(S.b[2].g, T(t, 0.2, 0.5)); S.b[2].b.largo(T(t, 0.3, 1)); } },
      { texto: 'El tercero deja 36 cubos de 10 mm, de 600 mm² cada uno: 21 600 mm², 0,577 m²/kg, que es $6/(\\rho b) = 6/(1040 \\times 0,010)$, el área de los cubos del ejemplo de la zanahoria. Los tres cortes multiplicaron el área por 3,3.', dur: 1.8, ir: function (S, t) { D.ver(S.c3, T(t, 0, 0.4)); D.ver(S.b[3].g, T(t, 0.2, 0.5)); S.b[3].b.largo(T(t, 0.3, 1)); } },
      { texto: 'Cortar deja poca superficie nueva, porque lo que busca es una forma: un kilogramo del carbonato del caso expone 101 m²/kg, unas 174 veces lo de los cubos. Pero esa poca superficie es tejido roto, y por eso los cubos van enseguida al escaldador.', dur: 1.6, ir: function (S, t) { D.ver(S.carb, t); } }
    ]
  });

  /* Reto: los cubos que salen y su superficie, la superficie de un cilindro antes del corte y el escaldado. */

  /* ================= 7.9 Alimentos, fibras y fármacos ================= */

  /* Ninguna ley da una constante con la paja: la paja de trigo de Mani y sus colegas, picada a 7,67 mm, con 8,3 %
     de humedad, con las tres cribas, sus energías (11,4, 37,0 y 51,6 kWh/t) y los diámetros medios del producto
     (0,64 mm del texto, y 0,34 y 0,28 mm de su tabla 2); el índice de Bond aparente y las constantes de Kick y de
     Rittinger con cada criba, cada una sobre la de la criba gruesa. */
  var PJ = { F: 7670, P: [640, 340, 280], W: [11.4, 37.0, 51.6], cr: ['3,2 mm', '1,6 mm', '0,8 mm'] };
  PJ.bond = PJ.W.map(function (w, i) { return w / (10 / Math.sqrt(PJ.P[i]) - 10 / Math.sqrt(PJ.F)); });
  PJ.kick = PJ.W.map(function (w, i) { return w / Math.log(PJ.F / PJ.P[i]); });
  PJ.ritt = PJ.W.map(function (w, i) { return w / (1 / PJ.P[i] - 1 / PJ.F); });
  ZB.animacion('paja', {
    vista: [0, 0, 640, 300],
    alt: 'Arriba, los datos de la paja de trigo picada a 7,67 mm: con las cribas de 3,2, 1,6 y 0,8 mm pidió 11,4, 37,0 y 51,6 kWh/t, y el producto salió de 0,64, 0,34 y 0,28 mm. Abajo, tres grupos de barras, cada barra dividida entre la de la criba gruesa: el índice de Bond aparente pasa de 40,6 a 86,4 y 106,7 kWh/t, 2,6 veces; la constante de Kick, de 4,59 a 11,9 y 15,6, 3,4 veces; la de Rittinger, de 7960 a 13 160 y 15 000 kWh·µm/t, 1,9 veces. Ninguna es constante; la de Rittinger es la que menos varía.',
    montar: function (svg) {
      var S = {};
      // los datos
      S.dat = grupo(svg);
      var cx = [150, 270, 390, 510];
      D.t(S.dat, 20, 34, 'paja de trigo, picada a 7,67 mm, 8,3 % de humedad', { tam: 12.5, peso: 700 });
      [['criba', 0], ['energía (kWh/t)', 1], ['producto (mm)', 2]].forEach(function (f, k) {
        D.t(S.dat, cx[0] - 10, 56 + 18 * k, f[0], { tam: 12, ancla: 'end', color: K.tinta2 });
      });
      PJ.cr.forEach(function (c, i) {
        D.t(S.dat, cx[i + 1] - 40, 56, c, { tam: 12, peso: 650, ancla: 'middle' });
        D.t(S.dat, cx[i + 1] - 40, 74, n(PJ.W[i], 1), { tam: 12, ancla: 'middle' });
        D.t(S.dat, cx[i + 1] - 40, 92, n(PJ.P[i] / 1000, 2), { tam: 12, ancla: 'middle' });
      });
      // las barras: tres leyes, tres cribas, sobre la criba gruesa
      var y0 = 250, h = 120, rmax = 3.6, Y = function (v) { return y0 - v / rmax * h; };
      s('line', { x1: 60, x2: 620, y1: y0, y2: y0, stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      [1, 2, 3].forEach(function (v) {
        s('line', { x1: 60, x2: 620, y1: Y(v), y2: Y(v), stroke: K.rejilla, 'stroke-width': 1 }, svg);
        D.t(svg, 54, Y(v) + 4, '× ' + v, { tam: 12, ancla: 'end', color: K.tinta2 });
      });
      var ley = [['Bond (kWh/t)', AZ, PJ.bond, 1], ['Kick (kWh/t)', NA, PJ.kick, 2], ['Rittinger (kWh·µm/t)', OL, PJ.ritt, 0]];
      var cs = [160, 345, 530];
      S.g = ley.map(function (l, gi) {
        var g = grupo(svg), c = cs[gi], vals = l[2], bs = [], ts = [];
        D.t(g, c, y0 + 18, l[0], { tam: 12.5, peso: 700, ancla: 'middle', color: l[1] });
        vals.forEach(function (v, i) {
          var x = c + (i - 1) * 46 - 18, f = v / vals[0];
          bs.push({ el: columna(g, x, 36, y0, l[1], { op: 0.55 + 0.2 * i }), y: Y(f) });
          var tx = D.t(g, x + 18, Y(f) - 6, l[3] ? n(v, v < 10 ? 2 : 1) : n(Math.round(v / 10) * 10, 0), { tam: 11.5, peso: 650, ancla: 'middle', color: l[1] });
          tx.setAttribute('opacity', 0); ts.push(tx);
        });
        D.t(g, c, y0 + 34, '× ' + n(vals[2] / vals[0], 1) + ' de la criba gruesa a la fina', { tam: 11.5, ancla: 'middle', color: K.tinta2 });
        return { g: g, bs: bs, ts: ts };
      });
      S.subir = function (gi, t) { D.ver(S.g[gi].g, T(t, 0, 0.3)); S.g[gi].bs.forEach(function (b, i) { b.el.subir(b.y, T(t, 0.2 + 0.1 * i, 0.8 + 0.05 * i)); D.ver(S.g[gi].ts[i], T(t, 0.7, 1)); }); };
      return S;
    },
    pasos: [
      { texto: 'La paja de trigo, picada a 7,67 mm y con 8,3 % de humedad, en el molino de martillos piloto: las cribas de 3,2, 1,6 y 0,8 mm pidieron 11,4, 37,0 y 51,6 kWh/t, y el producto salió con diámetros medios de 0,64, 0,34 y 0,28 mm.', dur: 1.8, ir: function (S, t) { D.ver(S.dat, t); } },
      { texto: 'El índice de Bond aparente, despejado de la <a href="#eq-red-bond">ley de Bond</a>: $W_i = W/(10/\\sqrt P - 10/\\sqrt F)$. Con la criba gruesa, $11,4/(10/\\sqrt{640} - 10/\\sqrt{7670})$ = 40,6 kWh/t; con las otras dos, 86,4 y 106,7: 2,6 veces más.', dur: 2, ir: function (S, t) { S.subir(0, t); } },
      { texto: 'La constante de Kick, de la <a href="#eq-red-rk">ecuación de Rittinger y Kick</a>, $C_K = W/\\ln(F/P)$: 4,59, 11,9 y 15,6 kWh/t, 3,4 veces de la criba gruesa a la fina.', dur: 2, ir: function (S, t) { S.subir(1, t); } },
      { texto: 'La de Rittinger, $C_R = W/(1/P - 1/F)$: 7960, 13 160 y 15 000 kWh·µm/t, 1,9 veces.', dur: 2, ir: function (S, t) { S.subir(2, t); } },
      { texto: 'Ninguna ley da una constante; la que menos varía es la de Rittinger. Para un material fibroso el dato de diseño es la energía medida con la criba y la humedad de la planta, y la criba no es el tamaño del producto: la de 3,2 mm dejó partículas de 0,64 mm, porque las fibras pasan a lo largo.', dur: 1.6, ir: function (S, t) { } }
    ]
  });

  /* Reto: el índice de Bond aparente de un material fibroso, sus constantes de Kick y de Rittinger, y la energía de
     un molino harinero. */

  /* ================= 7.10 Aumentar el tamaño ================= */

  /* El agua en los poros del aglomerado: el aglomerador del ejemplo con todas sus corrientes (fresco, reciclo de la
     criba con 168,4 + 55,1 kg/h, vapor, aglomerado húmedo, secador, agua evaporada y el producto a la criba), la
     saturación y la resistencia de Rumpf, el techo de 95 % y la otra densidad a granel; un puente de agua entre dos
     granos que crece con la saturación. */
  ZB.animacion('puente', {
    vista: [0, 0, 640, 300],
    alt: 'Arriba, el aglomerador del café con sus corrientes: entran 776,5 kg/h de polvo fresco y 223,5 kg/h que devuelve la criba, con 2,5 % de humedad; el vapor condensa 59,8 kg/h y deja 1059,8 kg/h con 8 %; el secador evapora 59,8 kg/h y entrega 1000 kg/h a la criba. Abajo a la izquierda, dos granos con un puente de agua que crece con la saturación. Abajo a la derecha, un eje de saturación de 0 a 1 con el caso en 0,143, el estado capilar de 0,8 a 1 y el techo de 0,95; con la otra densidad a granel, 0,08.',
    montar: function (svg) {
      var S = {};
      // el diagrama
      S.dg = grupo(svg);
      caja(S.dg, 170, 48, 110, 40); D.t(S.dg, 225, 73, 'Aglomerador', { tam: 12.5, peso: 700, ancla: 'middle' });
      caja(S.dg, 400, 48, 84, 40); D.t(S.dg, 442, 73, 'Secador', { tam: 12.5, peso: 700, ancla: 'middle' });
      tubo(S.dg, [[20, 68], [170, 68]], { ancho: 2 });
      D.t(S.dg, 20, 58, 'polvo fresco: 776,5 kg/h', { tam: 12 });
      tubo(S.dg, [[225, 128], [225, 88]], { ancho: 2 });
      D.t(S.dg, 234, 124, 'reciclo de la criba: 168,4 + 55,1 = 223,5 kg/h', { tam: 12 });
      tubo(S.dg, [[225, 12], [225, 48]], { ancho: 1.8, color: K.tinta2 });
      D.t(S.dg, 234, 24, 'vapor: 59,8 kg/h', { tam: 12, color: K.tinta2 });
      tubo(S.dg, [[280, 68], [400, 68]], { ancho: 2 });
      D.t(S.dg, 340, 60, '1059,8 kg/h, 8 %', { tam: 12, peso: 650, ancla: 'middle', color: AZ });
      tubo(S.dg, [[442, 48], [442, 12]], { ancho: 1.8, color: K.tinta2 });
      D.t(S.dg, 452, 24, 'agua: 59,8 kg/h', { tam: 12, color: K.tinta2 });
      tubo(S.dg, [[484, 68], [626, 68]], { ancho: 2 });
      D.t(S.dg, 626, 60, '1000 kg/h, 2,5 %', { tam: 12, ancla: 'end' });
      D.t(S.dg, 626, 88, 'a la criba', { tam: 12, ancla: 'end' });
      D.t(S.dg, 20, 86, 'todo con 2,5 %', { tam: 11.5, color: K.tinta2 });
      // los dos granos y el puente
      var gx1 = 90, gx2 = 170, gy = 222, gr = 40;
      s('circle', { cx: gx1, cy: gy, r: gr, fill: SO.relleno, stroke: SO.oscuro, 'stroke-width': 1.2 }, svg);
      s('circle', { cx: gx2, cy: gy, r: gr, fill: SO.relleno, stroke: SO.oscuro, 'stroke-width': 1.2 }, svg);
      S.puente = s('ellipse', { cx: (gx1 + gx2) / 2, cy: gy, rx: 6, ry: 8, fill: K.aguaM, stroke: K.aguaO, 'stroke-width': 1, 'fill-opacity': 0.85 }, svg);
      S.ptx = D.t(svg, 130, 286, '', { tam: 12, peso: 650, ancla: 'middle' });
      S.ponerPuente = function (Sv, solido) {
        var f = Math.max(0, Math.min(1, (Sv - 0.05) / 0.9));
        poner(S.puente, { rx: 7 + 40 * f, ry: 9 + 34 * f, fill: solido ? SO.medio : K.aguaM, stroke: solido ? SO.oscuro : K.aguaO });
      };
      // el eje de saturación
      var xa = 300, xb = 610, ye = 232, X = function (v) { return xa + v * (xb - xa); };
      S.X = X;
      s('line', { x1: xa, x2: xb, y1: ye, y2: ye, stroke: K.tinta, 'stroke-width': 1.4 }, svg);
      [0, 0.2, 0.4, 0.6, 0.8, 1].forEach(function (v) {
        s('line', { x1: X(v), x2: X(v), y1: ye - 4, y2: ye + 4, stroke: K.tinta, 'stroke-width': 1.2 }, svg);
        D.t(svg, X(v), ye + 18, n(v, 1), { tam: 12, ancla: 'middle', color: K.tinta2 });
      });
      D.t(svg, xa, ye + 38, 'saturación de los poros, S', { tam: 12, color: K.tinta2 });
      s('rect', { x: X(0.8), y: ye - 18, width: X(1) - X(0.8), height: 12, fill: K.aguaM, opacity: 0.8 }, svg);
      D.t(svg, X(0.8) - 5, ye - 8, 'capilar', { tam: 12, ancla: 'end', color: K.tinta2 });
      D.t(svg, X(0.12), ye - 24, 'pendular', { tam: 12, ancla: 'middle', color: K.tinta2 });
      S.techo = grupo(svg);
      camino(S.techo, [[X(0.95), ye - 46], [X(0.95), ye]], { color: K.alerta, ancho: 1.6, guion: '4 3' });
      D.t(S.techo, X(0.95) - 4, ye - 50, 'techo: 0,95, barro', { tam: 12, peso: 650, ancla: 'end', color: K.alerta });
      S.mk = D.punto(svg, X(0.143), ye, { r: 6 });
      S.mkT = D.t(svg, X(0.143), ye - 40, '', { tam: 12, peso: 700, ancla: 'start' });
      S.marca = function (v, et) { poner(S.mk, { cx: X(v) }); var alto = v > 0.6; poner(S.mkT, { x: alto ? X(v) - 10 : X(v) - 6, y: alto ? ye - 26 : ye - 40, 'text-anchor': alto ? 'end' : 'start' }); D.ponerTexto(S.mkT, et); };
      S.res = oculto(svg, 300, 150, 'σ_T = 2,25 × (0,522/0,478) × (0,072/50 × 10^{−6}) = 3540 Pa', { tam: 12, peso: 650 });
      S.ver0 = function () { D.ver(S.mk, 0); D.ver(S.mkT, 0); D.ver(S.techo, 0); D.ver(S.puente, 0); };
      S.ver0();
      return S;
    },
    pasos: [
      { texto: 'El aglomerador con todas sus corrientes: entran 776,5 kg/h de polvo fresco y 223,5 kg/h que devuelve la criba, todo con 2,5 % de humedad; el vapor condensa 59,8 kg/h y los deja en 1059,8 kg/h con 8 %; el secador evapora los mismos 59,8 kg/h y le entrega 1000 kg/h a la criba.', dur: 1.8, ir: function (S, t) { D.ver(S.dg, t); } },
      { texto: 'En base seca, el aglomerado húmedo lleva $X = 0,08/0,92$ = 0,087 kg de agua por kilogramo de sólido. Con $1 - \\chi$ = 0,522, la <a href="#eq-red-saturacion">ecuación de la saturación</a> da $S$ = 0,143: el agua llena la séptima parte de los poros, en puentes separados entre los granos. Es el estado pendular.', dur: 2, ir: function (S, t) { D.ver(S.puente, T(t, 0, 0.4)); S.ponerPuente(0.143 * T(t, 0, 1), false); D.ver(S.mk, T(t, 0.4, 0.8)); D.ver(S.mkT, T(t, 0.4, 0.8)); S.marca(0.143, 'S = 0,143, el caso'); D.ponerTexto(S.ptx, 'puente líquido'); } },
      { texto: 'En el estado pendular, $K_R$ = 9/4, y la <a href="#eq-red-rumpf">ecuación de Rumpf</a> da $\\sigma_T$ = 3540 Pa, unos 3,5 kPa: el aglomerado verde, débil, que se seca sin golpearlo.', dur: 1.8, ir: function (S, t) { D.ver(S.res, t); } },
      { texto: 'Más agua sube la saturación. De 80 a 100 % de los poros llenos el estado es capilar, pero el techo es 95 %: con $X_\\text{máx}$ = 0,579 kg/kg, 36,7 % en base húmeda. Un poco más y toda la masa se vuelve barro.', dur: 2.2, ir: function (S, t) { var v = L(0.143, 0.95, T(t, 0, 0.8)); S.ponerPuente(v, false); S.marca(v, v > 0.9 ? 'S = 0,95, X = 0,579' : 'S = ' + n(v, 2)); D.ver(S.techo, T(t, 0.6, 1)); D.ver(S.res, 1 - T(t, 0, 0.3)); } },
      { texto: 'Con la otra densidad a granel del café instantáneo, 330 kg/m³, la porosidad sube a 0,63 y la saturación baja a 0,08: el mismo estado pendular. Al secarse, el café que el agua disolvió en los puentes los vuelve sólidos, y el secador evapora otra vez los 59,8 kg/h.', dur: 2, ir: function (S, t) { var v = L(0.95, 0.08, T(t, 0, 0.6)); S.ponerPuente(v, t > 0.7); S.marca(v, t > 0.6 ? 'S = 0,08 con 330 kg/m³' : 'S = ' + n(v, 2)); D.ver(S.techo, 1 - 0.35 * T(t, 0, 0.5)); D.ponerTexto(S.ptx, t > 0.7 ? 'puente sólido, al secarse' : 'puente líquido'); } }
    ]
  });

  /* Dos gránulos que chocan: el plato del ejemplo del cacao, la velocidad de choque, el Stokes crítico y el viscoso con
     agua y con jarabe (rebotan o se quedan juntos) y el tamaño límite en una escala de tamaños. */
  ZB.animacion('choque', {
    vista: [0, 0, 640, 290],
    alt: 'Arriba a la izquierda, dos gránulos de 2 mm con su capa de líquido que se acercan a 0,225 m/s. Con agua rebotan; con jarabe se quedan juntos. A la derecha, una escala logarítmica del número de Stokes con el crítico en 6,91, el de los gránulos con jarabe en 2,4 y con agua en 240. Abajo, una escala de tamaños con el tamaño límite con agua, 58 µm, el gránulo de 2 mm y el límite con jarabe, 5,8 mm.',
    montar: function (svg) {
      var S = {}, gy = 104, r = 26;
      S.cap1 = s('circle', { cy: gy, r: r + 6, fill: K.aguaM, opacity: 0.8 }, svg);
      S.cap2 = s('circle', { cy: gy, r: r + 6, fill: K.aguaM, opacity: 0.8 }, svg);
      S.g1 = s('circle', { cy: gy, r: r, fill: SO.relleno, stroke: SO.oscuro, 'stroke-width': 1.2 }, svg);
      S.g2 = s('circle', { cy: gy, r: r, fill: SO.relleno, stroke: SO.oscuro, 'stroke-width': 1.2 }, svg);
      S.f1 = D.flechaViva(svg, { color: K.tinta, ancho: 2 });
      S.f2 = D.flechaViva(svg, { color: K.tinta, ancho: 2 });
      S.pos = function (d, flechas) {
        var c = 160, x1 = c - r - 6 - d, x2 = c + r + 6 + d;
        [S.g1, S.cap1].forEach(function (e) { e.setAttribute('cx', x1); });
        [S.g2, S.cap2].forEach(function (e) { e.setAttribute('cx', x2); });
        if (flechas === 1) { S.f1(x1 - r - 34, gy, x1 - r - 10, gy); S.f2(x2 + r + 34, gy, x2 + r + 10, gy); }
        else if (flechas === -1) { S.f1(x1 - r - 10, gy, x1 - r - 34, gy); S.f2(x2 + r + 10, gy, x2 + r + 34, gy); }
        else { S.f1(0, 0, 0, 0); S.f2(0, 0, 0, 0); }
      };
      S.pos(70, 1);
      S.tv = D.t(svg, 160, 34, 'v_c = ND/2 = (27/60) × 1,0/2 = 0,225 m/s', { tam: 12.5, peso: 650, ancla: 'middle' });
      S.res = D.t(svg, 160, 162, '', { tam: 12.5, peso: 700, ancla: 'middle' });
      // la escala del número de Stokes
      var xa = 360, xb = 620, ye = 104, X = function (v) { return xa + (Math.log10(v) - 0) / 3 * (xb - xa); };
      S.stk = grupo(svg);
      s('line', { x1: xa, x2: xb, y1: ye, y2: ye, stroke: K.tinta, 'stroke-width': 1.4 }, S.stk);
      [1, 10, 100, 1000].forEach(function (v) {
        s('line', { x1: X(v), x2: X(v), y1: ye - 4, y2: ye + 4, stroke: K.tinta, 'stroke-width': 1.2 }, S.stk);
        D.t(S.stk, X(v), ye + 18, n(v, 0), { tam: 12, ancla: 'middle', color: K.tinta2 });
      });
      D.t(S.stk, xa, ye + 54, 'número de Stokes viscoso', { tam: 12, color: K.tinta2 });
      camino(S.stk, [[X(6.91), ye - 40], [X(6.91), ye + 4]], { color: K.tinta, ancho: 1.6, guion: '4 3' });
      D.t(S.stk, X(6.91) + 4, ye - 44, 'Stk^* = 6,91', { tam: 12.5, peso: 700 });
      D.t(S.stk, X(6.91) - 6, ye + 36, 'se unen', { tam: 11.5, ancla: 'end', color: K.tinta2 });
      D.t(S.stk, X(6.91) + 6, ye + 36, 'rebotan', { tam: 11.5, color: K.tinta2 });
      S.pA = grupo(svg); D.punto(S.pA, X(240), ye, { r: 6, color: AZ, borde: K.tinta }); D.t(S.pA, X(240), ye - 22, 'agua: 240', { tam: 12, peso: 700, ancla: 'middle', color: AZ });
      S.pJ = grupo(svg); D.punto(S.pJ, X(2.4), ye, { r: 6, color: OL, borde: K.tinta }); D.t(S.pJ, X(6.91) - 6, ye - 22, 'jarabe: 2,4', { tam: 12, peso: 700, ancla: 'end', color: OL });
      // la escala de tamaños
      var ta = 60, tb = 600, yt = 226, XT = function (um) { return ta + (Math.log10(um) - 1) / (Math.log10(20000) - 1) * (tb - ta); };
      S.tam = grupo(svg);
      s('line', { x1: ta, x2: tb, y1: yt, y2: yt, stroke: K.tinta, 'stroke-width': 1.4 }, S.tam);
      [[10, '10 µm'], [100, '100 µm'], [1000, '1 mm'], [10000, '10 mm']].forEach(function (m) {
        s('line', { x1: XT(m[0]), x2: XT(m[0]), y1: yt - 4, y2: yt + 4, stroke: K.tinta, 'stroke-width': 1.2 }, S.tam);
        D.t(S.tam, XT(m[0]), yt + 18, m[1], { tam: 12, ancla: 'middle', color: K.tinta2 });
      });
      D.t(S.tam, ta, yt + 38, 'tamaño del gránulo', { tam: 12, color: K.tinta2 });
      [[58, 'x^* con agua: 58 µm', AZ, 'middle', -14], [2000, 'gránulo: 2 mm', K.tinta, 'end', -14], [5800, 'x^* con jarabe: 5,8 mm', OL, 'middle', -14]].forEach(function (m, i) {
        D.punto(S.tam, XT(m[0]), yt, { r: 5.5, color: i === 1 ? K.caso : m[2], borde: K.tinta });
        D.t(S.tam, XT(m[0]) + (m[3] === 'end' ? -4 : 0), yt + m[4], m[1], { tam: 12, peso: 700, ancla: m[3], color: m[2] });
      });
      return S;
    },
    pasos: [
      { texto: 'En el plato de 1,0 m que gira a 27 r/min, los gránulos chocan a $v_c = ND/2 = (27/60) \\times 1,0/2$ = 0,225 m/s, con la <a href="#eq-red-uc">velocidad de choque</a>. Cada uno lleva una capa de líquido.', dur: 1.6, ir: function (S, t) { S.pos(70 - 30 * t, 1); D.ponerTexto(S.res, ''); } },
      { texto: 'El Stokes crítico, con $e$ = 0,5 y la capa diez veces más gruesa que las asperezas: $\\mathrm{Stk}^* = (1 + 1/0,5)\\ln 10$ = 6,91. Por debajo de ese número, el choque une los gránulos.', dur: 1.6, ir: function (S, t) { S.pos(40, 1); D.ver(S.stk, t); } },
      { texto: 'Con agua, de 1 mPa·s: $\\mathrm{Stk}_v = 4 \\times 1200 \\times 0,225 \\times 0,002/(9 \\times 0,001)$ = 240, mucho más que 6,91. La capa no alcanza a disipar la energía del choque, y los gránulos de 2 mm rebotan.', dur: 2.4, ir: function (S, t) { var d = t < 0.45 ? 40 * (1 - t / 0.45) : 60 * (t - 0.45) / 0.55; S.pos(d, t < 0.45 ? 1 : -1); D.ver(S.pA, T(t, 0, 0.3)); D.ponerTexto(S.res, t > 0.6 ? 'con agua: rebotan' : ''); S.res.setAttribute('fill', AZ); } },
      { texto: 'Con jarabe, de 0,1 Pa·s, cien veces más viscoso: $\\mathrm{Stk}_v$ = 2,4, menos que 6,91. La capa disipa la energía del choque y los gránulos se quedan juntos.', dur: 2.4, ir: function (S, t) { var d = t < 0.5 ? 60 - 66 * (t / 0.5) : -6; S.pos(d, t < 0.5 ? 1 : 0); D.ver(S.pJ, T(t, 0, 0.3)); D.ponerTexto(S.res, t > 0.6 ? 'con jarabe: se quedan juntos' : ''); S.res.setAttribute('fill', OL); } },
      { texto: 'El tamaño límite, de la <a href="#eq-red-dlimite">ecuación del gránulo más grande</a>: con agua, $x^*$ = 58 µm, y con jarabe, cien veces más, 5,8 mm. Los gránulos de 2 mm siguen creciendo con jarabe; con agua solo se forman núcleos. Girar más rápido sube $v_c$ y baja el límite.', dur: 1.8, ir: function (S, t) { D.ver(S.tam, t); } }
    ]
  });

  /* Reto: el aglomerador, la saturación y la resistencia, y el plato. */
})();
