/* Las animaciones por pasos del capítulo 2 del libro, «Los diagramas de ingeniería», traídas con el mismo
   código y los mismos números para las presentaciones de diagramas y de P&ID de 2027-10. Es una copia de
   libro/figuras/los-diagramas-de-ingenieria/actividades.js del repositorio del libro, solo con las
   animaciones: los retos, con sus soluciones, se quedan en el libro. No se edita aquí; cuando cambian
   en el libro se vuelven a copiar. Corren con el motor de /classroom/estilo-libro/actividades/. */
(function () {
  'use strict';
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, T = ZB.tramo, L = ZB.lerp;

  /* ---------- Piezas del capítulo ---------- */
  function grupo(padre, op) { return s('g', { opacity: op == null ? 0 : op }, padre); }
  function caja(padre, x, y, w, h, o) {
    o = o || {};
    return s('rect', { x: x, y: y, width: w, height: h, rx: o.rx == null ? 3 : o.rx, fill: o.fill || K.blanco, stroke: o.borde || K.tinta, 'stroke-width': o.ancho || 1.4, 'stroke-dasharray': o.guion || 'none' }, padre);
  }
  function camino(padre, pts, o) {
    o = o || {};
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0] + ' ' + p[1]; }).join('');
    return s('path', { d: d, fill: 'none', stroke: o.color || K.tinta, 'stroke-width': o.ancho || 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'stroke-dasharray': o.guion || 'none' }, padre);
  }
  // Una línea de proceso con su flecha al final.
  function tubo(padre, pts, o) {
    o = o || {};
    var g = s('g', {}, padre);
    var ult = pts[pts.length - 1], pen = pts[pts.length - 2];
    camino(g, pts.slice(0, -1).concat([ult]), o);
    if (o.flecha !== false) D.flecha(g, pen[0], pen[1], ult[0], ult[1], { color: o.color || K.tinta, ancho: o.ancho || 2, punta: 8 });
    return g;
  }
  // El número de una corriente en su rombo.
  function rombo(padre, x, y, txt, o) {
    o = o || {};
    var g = s('g', { opacity: o.op == null ? 1 : o.op }, padre), r = 13;
    s('path', { d: 'M' + x + ' ' + (y - r) + 'L' + (x + r) + ' ' + y + 'L' + x + ' ' + (y + r) + 'L' + (x - r) + ' ' + y + 'Z', fill: o.fill || K.blanco, stroke: K.tinta, 'stroke-width': 1.3 }, g);
    D.t(g, x, y + 4.5, txt, { tam: 12.5, peso: 700, ancla: 'middle' });
    return g;
  }
  // Un globo de instrumento de la ISA-5.1: en campo (círculo), en la sala de control (con raya) o función
  // compartida del sistema de control (círculo en un cuadrado, con raya).
  function globo(padre, x, y, letras, num, tipo, o) {
    o = o || {};
    var g = s('g', { opacity: o.op == null ? 1 : o.op }, padre), r = 17;
    if (tipo === 'compartido') s('rect', { x: x - r, y: y - r, width: 2 * r, height: 2 * r, fill: o.fill || K.blanco, stroke: K.tinta, 'stroke-width': 1.3 }, g);
    g.c = s('circle', { cx: x, cy: y, r: r, fill: o.fill || K.blanco, stroke: K.tinta, 'stroke-width': 1.4 }, g);
    if (tipo === 'panel' || tipo === 'compartido') s('line', { x1: x - r, x2: x + r, y1: y, y2: y, stroke: K.tinta, 'stroke-width': 1.2 }, g);
    D.t(g, x, y - 3, letras, { tam: 11.5, peso: 700, ancla: 'middle' });
    if (num) D.t(g, x, y + 12, num, { tam: 11, peso: 600, ancla: 'middle', color: K.tinta2 });
    return g;
  }
  // El enclavamiento: un rombo con una I.
  function enclavamiento(padre, x, y, num, o) {
    var g = s('g', { opacity: (o && o.op != null) ? o.op : 1 }, padre), r = 18;
    s('path', { d: 'M' + x + ' ' + (y - r) + 'L' + (x + r) + ' ' + y + 'L' + x + ' ' + (y + r) + 'L' + (x - r) + ' ' + y + 'Z', fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.4 }, g);
    D.t(g, x, y - 1, 'I', { tam: 11.5, peso: 700, ancla: 'middle' });
    D.t(g, x, y + 11, num, { tam: 11, peso: 600, ancla: 'middle', color: K.tinta2 });
    return g;
  }
  // Una señal: eléctrica (discontinua), neumática (con pares de rayas) o sin definir (la del PFD).
  function senal(padre, pts, tipo) {
    var g = s('g', {}, padre);
    var guion = tipo === 'electrica' ? '6 4' : tipo === 'indefinida' ? '2 3' : 'none';
    camino(g, pts, { color: K.tinta, ancho: 1.3, guion: guion });
    if (tipo === 'neumatica') {
      for (var i = 0; i < pts.length - 1; i++) {
        var a = pts[i], b = pts[i + 1], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
        var ux = (b[0] - a[0]) / len, uy = (b[1] - a[1]) / len;
        for (var d = 16; d < len - 8; d += 26) {
          [0, 5].forEach(function (k) {
            var cx = a[0] + ux * (d + k), cy = a[1] + uy * (d + k);
            s('line', { x1: cx - uy * 5 + ux * 3, y1: cy + ux * 5 + uy * 3, x2: cx + uy * 5 - ux * 3, y2: cy - ux * 5 - uy * 3, stroke: K.tinta, 'stroke-width': 1.2 }, g);
          });
        }
      }
    }
    return g;
  }
  // Una válvula de control sobre una línea horizontal: el corbatín y el actuador de diafragma arriba.
  function valvula(padre, x, y, o) {
    o = o || {};
    var g = s('g', { opacity: o.op == null ? 1 : o.op }, padre), w = 11, h = 8;
    g.cuerpo = s('path', { d: 'M' + (x - w) + ' ' + (y - h) + 'L' + (x + w) + ' ' + (y + h) + 'L' + (x + w) + ' ' + (y - h) + 'L' + (x - w) + ' ' + (y + h) + 'Z', fill: o.fill || K.blanco, stroke: K.tinta, 'stroke-width': 1.4, 'stroke-linejoin': 'round' }, g);
    if (o.actuador !== false) {
      s('line', { x1: x, x2: x, y1: y, y2: y - 18, stroke: K.tinta, 'stroke-width': 1.3 }, g);
      s('path', { d: 'M' + (x - 10) + ' ' + (y - 18) + 'A10 9 0 0 1 ' + (x + 10) + ' ' + (y - 18) + 'Z', fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.3 }, g);
    }
    return g;
  }
  // Un recipiente vertical con cabezas redondeadas; devuelve el grupo con el rectángulo del líquido.
  function recipiente(padre, x, y, w, h, o) {
    o = o || {};
    var g = s('g', {}, padre), r = Math.min(w / 2, 24);
    s('rect', { x: x, y: y, width: w, height: h, rx: r, fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.8 }, g);
    var id = 'clip-' + Math.random().toString(36).slice(2, 9);
    var cp = s('clipPath', { id: id }, g);
    s('rect', { x: x + 1, y: y + 1, width: w - 2, height: h - 2, rx: r - 1 }, cp);
    g.liq = s('rect', { x: x, y: y + h, width: w, height: 0, fill: K.agua, 'clip-path': 'url(#' + id + ')' }, g);
    g.nivel = function (f) { var hh = Math.max(0, Math.min(1, f)) * h; g.liq.setAttribute('y', y + h - hh); g.liq.setAttribute('height', hh); };
    if (o.nivel != null) g.nivel(o.nivel);
    if (o.nombre) D.t(g, x + w / 2, y + h / 2 + 4, o.nombre, { tam: 12.5, peso: 700, ancla: 'middle' });
    return g;
  }
  // Una ficha con texto (un código, una letra, una palabra guía).
  function ficha(padre, x, y, txt, o) {
    o = o || {};
    var g = s('g', { opacity: o.op == null ? 1 : o.op }, padre), tam = o.tam || 12.5;
    var w = o.w || Math.max(28, String(txt).replace(/[_^{}]/g, '').length * tam * 0.62 + 16), h = o.h || 26;
    g.r = s('rect', { x: x, y: y, width: w, height: h, rx: 3, fill: o.fill || K.zona, stroke: o.borde || K.tinta2, 'stroke-width': 1.1 }, g);
    g.t = D.t(g, x + w / 2, y + h / 2 + tam * 0.36, txt, { tam: tam, peso: o.peso || 700, ancla: 'middle', color: o.color || K.tinta });
    g.w = w;
    return g;
  }
  function relleno(g, color) { g.r.setAttribute('fill', color); }
  // Redondeo hacia arriba a la décima, como se redondea una presión de diseño.
  function arriba(x) { return Math.ceil(x * 10 - 1e-9) / 10; }

  /* ================= 2.1 Por qué se dibuja un proceso ================= */

  /* Las normas, año por año: la ISA-5.1 para los instrumentos y la ISO 10628 para los equipos y los diagramas. */
  ZB.animacion('normas', {
    vista: [0, 0, 640, 310],
    alt: 'Una línea de tiempo vertical con nueve fechas: 1949, la práctica RP-5.1; 1984, la norma ANSI/ISA-5.1; 1992, reafirmada; 1997, la ISO 10628; 2009, la ISA-5.1 revisada; 2012 y 2014, las dos partes de la ISO 10628; 2022, la revisión interina; 2024, la edición vigente de la ISA-5.1. Al final se resaltan la ISA-5.1-2009 y la ISO 10628-2, las que sigue el capítulo.',
    montar: function (svg) {
      var S = {};
      var filas = [
        [1949, 'isa', 'RP-5.1, práctica recomendada de la Instrument Society of America'],
        [1984, 'isa', 'ANSI/ISA-5.1, aprobada como norma'],
        [1992, 'isa', 'ANSI/ISA-5.1, reafirmada'],
        [1997, 'iso', 'ISO 10628, primera edición'],
        [2009, 'isa', 'ANSI/ISA-5.1-2009, revisada'],
        [2012, 'iso', 'ISO 10628-2: los símbolos gráficos'],
        [2014, 'iso', 'ISO 10628-1: la especificación de los diagramas'],
        [2022, 'isa', 'ISA-5.1, revisión interina: aclaraciones y correcciones'],
        [2024, 'isa', 'edición vigente; sus guías pasan a ISA-TR5.1.02 y TR5.1.03']
      ];
      var y0 = 50, dy = 28, xl = 100;
      s('line', { x1: xl, x2: xl, y1: y0 - 14, y2: y0 + dy * (filas.length - 1) + 14, stroke: K.borde, 'stroke-width': 2 }, svg);
      // la leyenda
      D.punto(svg, 120, 20, { r: 6, color: K.azul, borde: K.tinta });
      D.t(svg, 132, 25, 'ISA: instrumentos', { tam: 12.5, peso: 650 });
      D.punto(svg, 290, 20, { r: 6, color: K.oliva, borde: K.tinta });
      D.t(svg, 302, 25, 'ISO: equipos y diagramas', { tam: 12.5, peso: 650 });
      S.filas = filas.map(function (f, i) {
        var y = y0 + i * dy, g = grupo(svg);
        g.fondo = s('rect', { x: 20, y: y - 13, width: 604, height: 26, rx: 3, fill: K.amarilloClaro, opacity: 0 }, g);
        D.t(g, xl - 16, y + 5, String(f[0]), { tam: 13, peso: 750, ancla: 'end', color: K.olivaOsc });
        D.punto(g, xl, y, { r: 6, color: f[1] === 'isa' ? K.azul : K.oliva, borde: K.tinta });
        D.t(g, xl + 16, y + 5, f[2], { tam: 13, peso: 550 });
        return g;
      });
      S.nota = D.t(svg, 620, 304, 'resaltadas: las que sigue este capítulo', { tam: 12, peso: 650, ancla: 'end', color: K.olivaOsc });
      S.nota.setAttribute('opacity', 0);
      return S;
    },
    pasos: [
      { texto: 'En 1949 la Instrument Society of America publica su práctica recomendada RP-5.1, para dibujar y nombrar los instrumentos.', dur: 1.4, ir: function (S, t) { D.ver(S.filas[0], t); } },
      { texto: 'La práctica se vuelve la norma ANSI/ISA-5.1 en 1984, y se reafirma en 1992.', dur: 1.6, ir: function (S, t) { D.ver(S.filas[1], T(t, 0, 0.5)); D.ver(S.filas[2], T(t, 0.5, 1)); } },
      { texto: 'En 1997 la ISO publica la 10628 para los equipos y los diagramas. Hoy tiene dos partes: los símbolos gráficos, de 2012, y la especificación de los diagramas, de 2014.', dur: 2, ir: function (S, t) { D.ver(S.filas[3], T(t, 0, 0.4)); D.ver(S.filas[5], T(t, 0.3, 0.7)); D.ver(S.filas[6], T(t, 0.6, 1)); } },
      { texto: 'La ISA-5.1 se revisa en 2009, tiene una revisión interina en 2022 y una edición nueva en 2024, que saca sus dos anexos informativos a informes técnicos.', dur: 2, ir: function (S, t) { D.ver(S.filas[4], T(t, 0, 0.4)); D.ver(S.filas[7], T(t, 0.3, 0.7)); D.ver(S.filas[8], T(t, 0.6, 1)); } },
      { texto: 'Este capítulo dibuja los equipos con los símbolos de la ISO 10628-2 y los instrumentos con la ANSI/ISA-5.1-2009.', dur: 1.4, ir: function (S, t) { [4, 5].forEach(function (i) { S.filas[i].fondo.setAttribute('opacity', t); }); D.ver(S.nota, t); } }
    ]
  });

  /* ================= 2.2 Tres diagramas, tres preguntas ================= */

  /* El separador de alta en el diagrama de bloques, en el PFD y en el P&ID. */
  ZB.animacion('tres-niveles', {
    vista: [0, 0, 640, 432],
    alt: 'Tres paneles con las mismas cuatro corrientes del separador de alta: entra el efluente y salen el gas de reciclo, la purga y el líquido. En el diagrama de bloques, V-102 es parte de la caja Separación. En el PFD, el efluente llega por la corriente 10 desde E-102, el gas sale por la 11 hacia C-101, la purga por la 12 con la válvula del PC-105 y el líquido por la 13 hacia V-103 con la del LC-106. En el P&ID cada corriente es una línea, el PC se abre en PT-105, PIC-105, PY-105 y PV-105, el LC en LT-106, LIC-106, LY-106 y LV-106, y aparecen la PSV-116 hacia la tea y el LSHH-115.',
    montar: function (svg) {
      var S = { lin: { ent: [], rec: [], pur: [], liq: [] } };
      S.p = [];
      [['Bloques', 10, 150], ['Flujo de proceso', 180, 200], ['Tubería e instrumentación', 402, 230]].forEach(function (p) {
        var g = grupo(svg);
        D.t(g, p[1], 20, p[0], { tam: 13, peso: 750, color: K.olivaOsc });
        s('line', { x1: p[1], x2: p[1] + p[2], y1: 28, y2: 28, stroke: K.borde, 'stroke-width': 1.2 }, g);
        S.p.push(g);
      });
      function r(nombre, g) { S.lin[nombre].push(g); return g; }
      // 1. el bloque: la caja Separación con sus cuatro corrientes
      var b = S.p[0];
      caja(b, 46, 200, 80, 50, { ancho: 2.2 });
      D.t(b, 86, 230, 'Separación', { tam: 12, peso: 700, ancla: 'middle' });
      r('ent', tubo(b, [[10, 225], [46, 225]]));
      D.t(b, 10, 194, 'efluente', { tam: 11.5, color: K.tinta2 });
      r('rec', tubo(b, [[62, 200], [62, 120]]));
      D.t(b, 12, 112, 'gas de reciclo', { tam: 11.5, color: K.tinta2 });
      r('pur', tubo(b, [[110, 200], [110, 70]]));
      D.t(b, 110, 62, 'purga', { tam: 11.5, color: K.tinta2, ancla: 'middle' });
      r('liq', tubo(b, [[126, 235], [160, 235]]));
      D.t(b, 158, 264, 'líquido', { tam: 11.5, color: K.tinta2, ancla: 'end' });
      D.t(b, 86, 330, 'V-102 no aparece:', { tam: 11.5, peso: 650, ancla: 'middle', color: K.tinta2 });
      D.t(b, 86, 346, 'es parte de la caja', { tam: 11.5, ancla: 'middle', color: K.tinta2 });
      // 2. el PFD: E-102, V-102 y las corrientes 10 a 13, con los lazos básicos
      var p = S.p[1];
      r('ent', tubo(p, [[180, 226], [187, 226]], { flecha: false }));
      s('circle', { cx: 200, cy: 226, r: 13, fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.6 }, p);
      s('path', { d: 'M188 231L195 231L205 221L212 221', fill: 'none', stroke: K.tinta, 'stroke-width': 1.3 }, p);
      D.t(p, 200, 256, 'E-102', { tam: 11.5, peso: 650, ancla: 'middle' });
      r('ent', tubo(p, [[213, 226], [256, 226]]));
      rombo(p, 234, 226, '10');
      S.v2 = recipiente(p, 256, 170, 36, 120, { nivel: 0.35 });
      D.t(p, 250, 308, 'V-102', { tam: 11.5, peso: 650, ancla: 'end' });
      r('rec', tubo(p, [[274, 170], [274, 130], [378, 130]]));
      rombo(p, 274, 150, '11');
      D.t(p, 378, 150, 'a C-101', { tam: 11.5, ancla: 'end', color: K.tinta2 });
      s('circle', { cx: 316, cy: 130, r: 3.5, fill: K.tinta }, p);
      r('pur', tubo(p, [[316, 130], [316, 84], [378, 84]]));
      rombo(p, 316, 108, '12');
      S.pv2 = valvula(p, 358, 84);
      D.t(p, 378, 106, 'purga', { tam: 11.5, ancla: 'end', color: K.tinta2 });
      S.pc = globo(p, 330, 54, 'PC', '105', 'campo');
      senal(p, [[347, 58], [349, 60]], 'indefinida');
      senal(p, [[338, 69], [338, 130]], 'indefinida');
      r('liq', tubo(p, [[274, 290], [274, 360], [378, 360]]));
      rombo(p, 274, 326, '13');
      S.lv2 = valvula(p, 340, 360);
      D.t(p, 378, 382, 'a V-103', { tam: 11.5, ancla: 'end', color: K.tinta2 });
      S.lc = globo(p, 346, 292, 'LC', '106', 'campo');
      senal(p, [[292, 272], [331, 286]], 'indefinida');
      senal(p, [[344, 309], [340, 333]], 'indefinida');
      // 3. el P&ID: las mismas corrientes como líneas, con sus válvulas y sus instrumentos
      var q = S.p[2];
      S.v3 = recipiente(q, 466, 170, 38, 150, { nivel: 0.35 });
      D.t(q, 404, 330, 'V-102', { tam: 11.5, peso: 650 });
      r('ent', tubo(q, [[402, 240], [466, 240]]));
      D.t(q, 404, 258, 'de E-102', { tam: 11.5, color: K.tinta2 });
      // la válvula de alivio, a la tea
      camino(q, [[475, 174], [475, 152]], { ancho: 1.4 });
      s('path', { d: 'M468 152L482 152L475 142Z', fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.3 }, q);
      tubo(q, [[475, 142], [475, 112], [404, 112]], { ancho: 1.6 });
      D.t(q, 406, 104, 'a la tea', { tam: 11.5, color: K.tinta2 });
      D.t(q, 406, 150, 'PSV-116', { tam: 11, peso: 650 });
      // el gas, a los compresores, y la purga, a gas combustible
      r('rec', tubo(q, [[492, 172], [492, 130], [632, 130]]));
      D.t(q, 630, 124, 'a C-101', { tam: 11.5, ancla: 'end', color: K.tinta2 });
      s('circle', { cx: 522, cy: 130, r: 3.5, fill: K.tinta }, q);
      r('pur', tubo(q, [[522, 130], [522, 84], [632, 84]]));
      S.pv3 = valvula(q, 570, 84);
      D.t(q, 630, 76, 'gas comb.', { tam: 11.5, ancla: 'end', color: K.tinta2 });
      D.t(q, 580, 104, 'PV-105', { tam: 11, peso: 650 });
      // el lazo de presión
      S.pt = globo(q, 538, 182, 'PT', '105', 'campo');
      camino(q, [[504, 186], [521, 184]], { ancho: 1.2 });
      S.pic = globo(q, 594, 182, 'PIC', '105', 'compartido');
      senal(q, [[555, 182], [577, 182]], 'electrica');
      S.py = globo(q, 556, 106, 'PY', '105', 'campo');
      senal(q, [[584, 166], [566, 122]], 'electrica');
      senal(q, [[556, 89], [556, 61], [561, 61]], 'neumatica');
      // el lazo de nivel
      S.lt = globo(q, 538, 262, 'LT', '106', 'campo');
      camino(q, [[504, 262], [521, 262]], { ancho: 1.2 });
      S.lic = globo(q, 594, 262, 'LIC', '106', 'compartido');
      senal(q, [[555, 262], [577, 262]], 'electrica');
      S.ly = globo(q, 594, 316, 'LY', '106', 'campo');
      senal(q, [[594, 279], [594, 299]], 'electrica');
      r('liq', tubo(q, [[485, 320], [485, 372], [632, 372]]));
      S.lv3 = valvula(q, 548, 372);
      D.t(q, 560, 394, 'LV-106', { tam: 11, peso: 650 });
      senal(q, [[577, 316], [548, 316], [548, 345]], 'neumatica');
      D.t(q, 630, 364, 'a V-103', { tam: 11.5, ancla: 'end', color: K.tinta2 });
      // el interruptor de nivel muy alto
      S.ls = globo(q, 432, 200, 'LSHH', '115', 'campo');
      senal(q, [[449, 200], [466, 200]], 'electrica');
      D.t(q, 402, 414, '+ LAH, LAL, LG-114, TI-113, I-115,', { tam: 11, color: K.tinta2 });
      D.t(q, 402, 428, 'bloqueos, bypass y drenaje', { tam: 11, color: K.tinta2 });
      // las flechas entre paneles
      S.f1 = D.flecha(svg, 162, 290, 178, 290, { color: K.oliva, ancho: 2.4, punta: 8, op: 0 });
      S.f2 = D.flecha(svg, 383, 290, 399, 290, { color: K.oliva, ancho: 2.4, punta: 8, op: 0 });
      return S;
    },
    pasos: [
      { texto: 'En el diagrama de bloques, el separador de alta ni siquiera aparece: es parte de la caja «Separación». Le entra el efluente del reactor y salen tres corrientes: el gas de reciclo, la purga y el líquido.', dur: 1.6, ir: function (S, t) { D.ver(S.p[0], t); colorear(S, 0); } },
      { texto: 'En el PFD la caja se abre en sus equipos: el efluente llega por la 10 desde el enfriador E-102; el gas sale de V-102 por la 11 hacia el compresor C-101, la purga se aparta por la 12 y el líquido baja por la 13 hacia el separador de baja V-103.', dur: 2, ir: function (S, t) { D.ver(S.f1, T(t, 0, 0.3)); D.ver(S.p[1], T(t, 0.2, 1)); colorear(S, 0); } },
      { texto: 'El PFD también lleva los lazos básicos de V-102: el PC-105 mueve la válvula de la purga para sostener la presión, y el LC-106, la del líquido.', dur: 1.4, ir: function (S, t) { [S.pc, S.lc].forEach(function (g) { g.c.setAttribute('fill', t > 0.5 ? K.amarillo : K.blanco); }); colorear(S, 0); } },
      { texto: 'En el P&ID cada corriente es una línea física, y cada lazo se abre en sus instrumentos: el PC en PT-105, PIC-105, PY-105 y la válvula PV-105; el LC en LT-106, LIC-106, LY-106 y la LV-106.', dur: 2.2, ir: function (S, t) { D.ver(S.f2, T(t, 0, 0.3)); D.ver(S.p[2], T(t, 0.2, 1)); colorear(S, 0); } },
      { texto: 'Aparece también lo que el PFD no dibuja: la PSV-116, que descarga a la tea, el interruptor LSHH-115 y, en la lista de abajo, las alarmas, el visor, el termómetro, los bloqueos y el drenaje.', dur: 1.6, ir: function (S, t) { [S.pt, S.pic, S.py, S.lt, S.lic, S.ly, S.ls].forEach(function (g) { g.c.setAttribute('fill', t > 0.5 ? K.amarillo : K.blanco); }); colorear(S, 0); } },
      { texto: 'Las mismas cuatro corrientes en los tres diagramas, cada una con su color: entra el efluente y salen el gas de reciclo, la purga y el líquido. En el de bloques, la purga sale junto con el gas de V-103.', dur: 1.4, ir: function (S, t) { colorear(S, t); } }
    ]
  });
  // Pinta las cuatro corrientes de la animación de los tres niveles (t = 0, en tinta; t = 1, cada una con su color).
  function colorear(S, t) {
    var col = { ent: K.tinta, rec: K.serie[0], pur: K.serie[1], liq: K.serie[2] };
    Object.keys(S.lin).forEach(function (k) {
      if (t <= 0.5) return;
      var c = col[k];
      S.lin[k].forEach(function (g) {
        g.querySelectorAll('path').forEach(function (e) {
          if (e.getAttribute('fill') === 'none') { e.setAttribute('stroke', c); e.setAttribute('stroke-width', 3); }
          else e.setAttribute('fill', c);
        });
        g.querySelectorAll('line').forEach(function (e) { e.setAttribute('stroke', c); });
      });
    });
  }

  /* ================= 2.3 El diagrama de bloques ================= */

  /* Los tres bloques se abren en los quince equipos del PFD. */
  ZB.animacion('bfd-pfd', {
    vista: [0, 0, 640, 316],
    alt: 'Los tres bloques del diagrama de bloques, Reacción, Separación y Destilación, y debajo de cada uno los equipos en que se abre en el PFD: cinco, cuatro y seis, quince en total.',
    montar: function (svg) {
      var S = {};
      var cols = [
        { x: 14, nom: 'Reacción', eq: [['V-101', 'tambor'], ['P-101', 'bombas'], ['E-101', 'precalentador'], ['H-101', 'horno'], ['R-101', 'reactor']] },
        { x: 226, nom: 'Separación', eq: [['E-102', 'enfriador'], ['V-102', 'separador de alta'], ['C-101', 'compresor'], ['V-103', 'separador de baja']] },
        { x: 438, nom: 'Destilación', eq: [['E-103', 'calentador'], ['T-101', 'columna'], ['E-104', 'condensador'], ['V-104', 'tambor de reflujo'], ['P-102', 'bombas de reflujo'], ['E-105', 'rehervidor']] }
      ];
      S.bloques = grupo(svg);
      cols.forEach(function (c, i) {
        caja(S.bloques, c.x + 14, 24, 160, 52, { ancho: 2.2 });
        D.t(S.bloques, c.x + 94, 55, c.nom, { tam: 13, peso: 700, ancla: 'middle' });
        if (i < 2) D.flecha(S.bloques, c.x + 174, 50, c.x + 226, 50, { punta: 8 });
      });
      D.flecha(S.bloques, 4, 50, 28, 50, { punta: 8 });
      D.flecha(S.bloques, 612, 50, 636, 50, { punta: 8 });
      // los reciclos, por arriba
      camino(S.bloques, [[320, 24], [320, 12], [108, 12], [108, 18]], { ancho: 1.6 });
      D.flecha(S.bloques, 108, 14, 108, 24, { punta: 7, ancho: 1.6 });
      camino(S.bloques, [[540, 24], [540, 6], [80, 6], [80, 18]], { ancho: 1.6 });
      D.flecha(S.bloques, 80, 14, 80, 24, { punta: 7, ancho: 1.6 });
      S.cols = cols.map(function (c) {
        var g = grupo(svg);
        s('path', { d: 'M' + (c.x + 94) + ' 76V92M' + (c.x + 4) + ' 92H' + (c.x + 196), fill: 'none', stroke: K.oliva, 'stroke-width': 1.6 }, g);
        g.filas = c.eq.map(function (e, k) {
          var f = grupo(g), y = 102 + k * 30;
          ficha(f, c.x + 4, y, e[0], { tam: 12.5, w: 62, h: 24, fill: K.blanco });
          D.t(f, c.x + 74, y + 17, e[1], { tam: 12, color: K.tinta2 });
          return f;
        });
        D.t(g, c.x + 94, 293, c.eq.length + ' equipos', { tam: 12.5, peso: 700, ancla: 'middle', color: K.olivaOsc });
        return g;
      });
      S.total = D.t(svg, 320, 312, '5 + 4 + 6 = 15 equipos con su código', { tam: 13, peso: 750, ancla: 'middle', color: K.tinta });
      S.total.setAttribute('opacity', 0);
      return S;
    },
    pasos: [
      { texto: 'El diagrama de bloques: tres operaciones, con lo que entra, lo que sale y los dos reciclos que vuelven a Reacción.', dur: 1.4, ir: function (S, t) { D.ver(S.bloques, t); } },
      { texto: 'Reacción se abre en cinco equipos: el tambor V-101, las bombas P-101, el precalentador E-101, el horno H-101 y el reactor R-101.', dur: 2, ir: function (S, t) { var g = S.cols[0]; D.ver(g, T(t, 0, 0.2)); g.filas.forEach(function (f, k) { D.ver(f, T(t, 0.1 + 0.16 * k, 0.3 + 0.16 * k)); }); } },
      { texto: 'Separación, en cuatro: el enfriador E-102, el separador de alta V-102, el compresor C-101 y el separador de baja V-103.', dur: 1.8, ir: function (S, t) { var g = S.cols[1]; D.ver(g, T(t, 0, 0.2)); g.filas.forEach(function (f, k) { D.ver(f, T(t, 0.1 + 0.2 * k, 0.3 + 0.2 * k)); }); } },
      { texto: 'Destilación, en seis: el calentador E-103, la columna T-101, el condensador E-104, el tambor de reflujo V-104, las bombas P-102 y el rehervidor E-105.', dur: 2.2, ir: function (S, t) { var g = S.cols[2]; D.ver(g, T(t, 0, 0.2)); g.filas.forEach(function (f, k) { D.ver(f, T(t, 0.1 + 0.14 * k, 0.3 + 0.14 * k)); }); } },
      { texto: 'Son quince equipos. El PFD los dibuja todos, cada uno con su código, y numera las corrientes que los unen.', dur: 1.2, ir: function (S, t) { D.ver(S.total, t); } }
    ]
  });


  /* ================= 2.4 El diagrama de flujo de proceso ================= */

  /* La numeración de las corrientes: un número nuevo en cada tramo, en cada mezcla y en cada división. */
  ZB.animacion('corrientes', {
    vista: [0, 0, 640, 340],
    alt: 'Las corrientes 3, 4 y 5 se juntan en la 6; la 6 pasa por E-101 y sale como la 7; la 7 pasa por el horno y sale como la 8; la 8 pasa por el reactor y sale como la 9. Abajo, la 10 entra a V-102, que la separa: el líquido sale por la 13 hacia V-103 y el gas se divide en la 11, al compresor, y la 12, la purga. El vapor HPS de E-101 no lleva número.',
    montar: function (svg) {
      var S = {}, y = 110;
      // la mezcla
      S.m = grupo(svg);
      tubo(S.m, [[20, y], [88, y]], { flecha: false });
      rombo(S.m, 46, y, '3');
      D.t(S.m, 20, y - 22, 'de P-101', { tam: 12, color: K.tinta2 });
      tubo(S.m, [[96, 40], [96, y - 8]], { flecha: false });
      rombo(S.m, 96, 64, '4');
      D.t(S.m, 112, 44, 'hidrógeno', { tam: 12, color: K.tinta2 });
      tubo(S.m, [[96, 182], [96, y + 8]], { flecha: false });
      rombo(S.m, 96, 156, '5');
      D.t(S.m, 112, 190, 'gas de reciclo', { tam: 12, color: K.tinta2 });
      s('circle', { cx: 96, cy: y, r: 6, fill: K.tinta }, S.m);
      // 6 → E-101 → 7 → H-101 → 8 → R-101 → 9
      S.t6 = grupo(svg); tubo(S.t6, [[102, y], [190, y]]); rombo(S.t6, 140, y, '6');
      S.e101 = grupo(svg);
      s('circle', { cx: 210, cy: y, r: 19, fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.8 }, S.e101);
      s('path', { d: 'M193 118L203 118L217 102L227 102', fill: 'none', stroke: K.tinta, 'stroke-width': 1.6 }, S.e101);
      D.t(S.e101, 226, y + 34, 'E-101', { tam: 12, peso: 650 });
      S.t7 = grupo(svg); tubo(S.t7, [[229, y], [312, y]]); rombo(S.t7, 268, y, '7');
      S.h101 = grupo(svg);
      caja(S.h101, 312, y - 28, 56, 56, { ancho: 1.8 });
      s('path', { d: 'M324 ' + (y + 14) + 'L340 ' + (y - 12) + 'L356 ' + (y + 14), fill: 'none', stroke: K.calor, 'stroke-width': 1.8 }, S.h101);
      D.t(S.h101, 340, y + 46, 'H-101', { tam: 12, peso: 650, ancla: 'middle' });
      S.t8 = grupo(svg); tubo(S.t8, [[368, y], [446, y]]); rombo(S.t8, 404, y, '8');
      S.r101 = grupo(svg);
      caja(S.r101, 446, y - 46, 40, 92, { rx: 14, ancho: 1.8 });
      s('path', { d: 'M446 ' + (y - 24) + 'L486 ' + (y + 24) + 'M486 ' + (y - 24) + 'L446 ' + (y + 24), fill: 'none', stroke: K.tinta, 'stroke-width': 1.1 }, S.r101);
      D.t(S.r101, 466, y + 64, 'R-101', { tam: 12, peso: 650, ancla: 'middle' });
      S.t9 = grupo(svg); tubo(S.t9, [[486, y], [580, y]]); rombo(S.t9, 530, y, '9');
      D.t(S.t9, 584, y + 5, 'a E-102', { tam: 12, color: K.tinta2 });
      // la división del gas de V-102
      S.div = grupo(svg);
      var v = recipiente(S.div, 160, 220, 40, 70, { nivel: 0.3 });
      D.t(S.div, 208, 248, 'V-102', { tam: 12, peso: 650 });
      tubo(S.div, [[24, 255], [160, 255]]);
      rombo(S.div, 110, 255, '10');
      D.t(S.div, 24, 245, 'de E-102', { tam: 12, color: K.tinta2 });
      tubo(S.div, [[180, 290], [180, 318], [300, 318]]);
      rombo(S.div, 236, 318, '13');
      D.t(S.div, 306, 323, 'a V-103', { tam: 12, color: K.tinta2 });
      tubo(S.div, [[180, 220], [180, 206], [300, 206]], { flecha: false });
      s('circle', { cx: 300, cy: 206, r: 5, fill: K.tinta }, S.div);
      tubo(S.div, [[300, 206], [470, 206]]);
      rombo(S.div, 380, 206, '11');
      D.t(S.div, 476, 211, 'al compresor C-101', { tam: 12, color: K.tinta2 });
      tubo(S.div, [[300, 206], [300, 272], [470, 272]]);
      rombo(S.div, 380, 272, '12');
      D.t(S.div, 476, 277, 'purga', { tam: 12, color: K.tinta2 });
      // el servicio de E-101
      S.hps = grupo(svg);
      camino(S.hps, [[210, 46], [210, 91]], { ancho: 1.4 });
      D.flecha(S.hps, 210, 70, 210, 88, { punta: 7, ancho: 1.4 });
      D.t(S.hps, 218, 52, 'HPS', { tam: 12.5, peso: 700 });
      camino(S.hps, [[210, 129], [210, 140]], { ancho: 1.4 });
      D.t(S.hps, 254, 52, 'sin rombo: se lee por su código', { tam: 12, color: K.olivaOsc, peso: 650 });
      return S;
    },
    pasos: [
      { texto: 'Tres corrientes llegan a un punto de mezcla: la 3, de las bombas P-101; la 4, el hidrógeno de repuesto, y la 5, el gas de reciclo. Lo que sale de la mezcla es una corriente nueva, la 6.', dur: 2.2, ir: function (S, t) { D.ver(S.m, T(t, 0, 0.6)); D.ver(S.t6, T(t, 0.6, 1)); } },
      { texto: 'Un intercambiador cambia la temperatura, así que cambia el número: la 6 entra a E-101 y sale la 7.', dur: 1.6, ir: function (S, t) { D.ver(S.e101, T(t, 0, 0.5)); D.ver(S.t7, T(t, 0.5, 1)); } },
      { texto: 'La 7 entra al horno H-101 y sale la 8; la 8 entra al reactor R-101 y sale la 9, que va a E-102.', dur: 2.2, ir: function (S, t) { D.ver(S.h101, T(t, 0, 0.25)); D.ver(S.t8, T(t, 0.25, 0.5)); D.ver(S.r101, T(t, 0.5, 0.75)); D.ver(S.t9, T(t, 0.75, 1)); } },
      { texto: 'Un separador y una división también crean corrientes nuevas: la 10 entra a V-102, que la parte en dos; el líquido sale por la 13 hacia V-103, y el gas se reparte en la 11, que va al compresor, y la 12, la purga.', dur: 2, ir: function (S, t) { D.ver(S.div, t); } },
      { texto: 'Las corrientes de servicio se dibujan pero no se numeran: el vapor de alta presión que entra a E-101 se identifica con su código, HPS.', dur: 1.4, ir: function (S, t) { D.ver(S.hps, t); } }
    ]
  });

  /* La presión de diseño de V-102 y la zona en que la válvula de alivio gotea, con las dos reglas del texto. */
  var P_NORMAL = 22.9, P_MAX = P_NORMAL + 1.7, P_DIS = arriba(Math.max(1.1 * P_MAX, P_MAX + 1.7)), P_DIS2 = arriba(1.1 * P_NORMAL);
  ZB.animacion('presiones', {
    vista: [0, 0, 640, 320],
    alt: 'Dos columnas de presión en barg, de 20 a 29. A la izquierda, la regla que se usó para V-102: operación normal 22,9, presión máxima de operación 24,6 y presión de diseño 27,1, con la zona de goteo de la válvula entre 24,9 y 25,7, lejos de la operación. A la derecha, el margen del 10 %: diseño en 25,2 y goteo entre 23,2 y 23,9, justo encima de la operación.',
    montar: function (svg) {
      var S = {}, y0 = 290, esc = 28, p0 = 20;
      var Y = function (p) { return y0 - (p - p0) * esc; };
      S.Y = Y;
      for (var p = 20; p <= 29; p++) {
        s('line', { x1: 70, x2: 620, y1: Y(p), y2: Y(p), stroke: K.rejilla, 'stroke-width': 1 }, svg);
        D.t(svg, 62, Y(p) + 4, String(p), { tam: 12, ancla: 'end', color: K.tinta2 });
      }
      D.t(svg, 16, 22, 'barg', { tam: 12.5, peso: 650 });
      s('path', { d: 'M70 ' + Y(29.4) + 'V' + y0, fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      S.col = [{ x: 150, tit: 'la regla de V-102', dis: P_DIS }, { x: 390, tit: 'margen del 10 %', dis: P_DIS2 }].map(function (c) {
        var g = grupo(svg);
        D.t(g, c.x + 50, 20, c.tit, { tam: 13, peso: 700, ancla: 'middle', color: K.olivaOsc });
        g.zona = s('rect', { x: c.x, y: Y(0.95 * c.dis), width: 100, height: Y(0.92 * c.dis) - Y(0.95 * c.dis), fill: K.alerta, opacity: 0 }, svg);
        g.dis = grupo(svg);
        s('rect', { x: c.x, y: Y(c.dis) - 2, width: 100, height: 4, fill: K.tinta }, g.dis);
        g.c = c;
        return g;
      });
      // la operación normal, en las dos columnas
      S.normal = grupo(svg);
      s('line', { x1: 140, x2: 500, y1: Y(P_NORMAL), y2: Y(P_NORMAL), stroke: K.azul, 'stroke-width': 3 }, S.normal);
      D.t(S.normal, 256, Y(P_NORMAL) + 18, 'operación: ' + n(P_NORMAL, 1) + ' barg', { tam: 12.5, peso: 700, color: K.azul, halo: true });
      // la presión máxima de operación (izquierda)
      S.max = grupo(svg);
      s('line', { x1: 150, x2: 250, y1: Y(P_MAX), y2: Y(P_MAX), stroke: K.tinta, 'stroke-width': 1.6, 'stroke-dasharray': '5 4' }, S.max);
      D.t(S.max, 256, Y(P_MAX) + 4, 'máxima de operación: ' + n(P_MAX, 1), { tam: 12.5, peso: 600, halo: true });
      // los rótulos de la izquierda
      S.tDis1 = D.t(svg, 256, Y(P_DIS) + 4, 'diseño = ajuste de la PSV: ' + n(P_DIS, 1), { tam: 12.5, peso: 700, halo: true });
      S.tZona1 = D.t(svg, 256, Y(0.935 * P_DIS) + 4, 'goteo: ' + n(0.92 * P_DIS, 1) + ' a ' + n(0.95 * P_DIS, 1), { tam: 12.5, peso: 650, color: K.alerta, halo: true });
      S.tPct1 = D.t(svg, 200, y0 + 22, 'opera al ' + n(100 * P_NORMAL / P_DIS, 1) + ' %', { tam: 13, peso: 750, ancla: 'middle', color: K.olivaOsc });
      // los de la derecha
      S.tDis2 = D.t(svg, 496, Y(P_DIS2) - 6, 'diseño: ' + n(P_DIS2, 1), { tam: 12.5, peso: 700, halo: true });
      S.tZona2 = D.t(svg, 496, Y(0.935 * P_DIS2) + 4, 'goteo: ' + n(0.92 * P_DIS2, 1) + ' a ' + n(0.95 * P_DIS2, 1), { tam: 12.5, peso: 650, color: K.alerta, halo: true });
      S.tPct2 = D.t(svg, 440, y0 + 22, 'opera al ' + n(100 * P_NORMAL / P_DIS2, 0) + ' %', { tam: 13, peso: 750, ancla: 'middle', color: K.alerta });
      [S.tDis1, S.tZona1, S.tPct1, S.tDis2, S.tZona2, S.tPct2].forEach(function (e) { e.setAttribute('opacity', 0); });
      return S;
    },
    pasos: [
      { texto: 'V-102 opera a 23,9 bar absolutos, 22,9 barg.', dur: 1.2, ir: function (S, t) { D.ver(S.normal, t); } },
      { texto: 'La regla que se usó para V-102 parte de una presión máxima de operación 1,7 bar por encima de la normal: 24,6 barg.', dur: 1.4, ir: function (S, t) { D.ver(S.col[0], T(t, 0, 0.4)); D.ver(S.max, T(t, 0.3, 1)); } },
      { texto: 'La de diseño es la mayor entre $1{,}1 \\times 24{,}6$ = 27,06 y $24{,}6 + 1{,}7$ = 26,3 barg: 27,06, que se redondea hacia arriba a 27,1 barg. A esa presión se ajusta la PSV-116.', dur: 1.8, ir: function (S, t) { D.ver(S.col[0].dis, T(t, 0, 0.5)); D.ver(S.tDis1, T(t, 0.3, 1)); } },
      { texto: 'Una válvula de resorte en servicio de gas gotea entre el 92 y el 95 % de su presión de ajuste: de 24,9 a 25,7 barg. V-102 opera al 84,5 %, lejos de esa zona.', dur: 1.8, ir: function (S, t) { S.col[0].zona.setAttribute('opacity', 0.25 * t); D.ver(S.tZona1, T(t, 0.2, 0.7)); D.ver(S.tPct1, T(t, 0.5, 1)); } },
      { texto: 'Con un margen del 10 % sobre la presión normal, el diseño sería de 25,2 barg; la válvula gotearía desde 23,2 barg, y el recipiente operaría al 91 %, al borde de esa zona.', dur: 2.2, ir: function (S, t) {
        D.ver(S.col[1], T(t, 0, 0.3)); D.ver(S.col[1].dis, T(t, 0.1, 0.4)); D.ver(S.tDis2, T(t, 0.2, 0.5));
        S.col[1].zona.setAttribute('opacity', 0.25 * T(t, 0.4, 0.7)); D.ver(S.tZona2, T(t, 0.5, 0.8)); D.ver(S.tPct2, T(t, 0.7, 1));
      } }
    ]
  });

  /* Los lotes que se traslapan: el diagrama de Gantt del principio activo farmacéutico. */
  var PASOS_LOTE = [['R-301', 'reactor', 3.5], ['Sc-301', 'tamiz', 0.5], ['T-301', 'destilador', 3.5], ['CR-301', 'cristalizador', 2], ['TD-301', 'secador', 4], ['PK-301', 'empaque', 1]];
  var T_LOTE = PASOS_LOTE.reduce(function (a, p) { return a + p[2]; }, 0), T_MAX = Math.max.apply(null, PASOS_LOTE.map(function (p) { return p[2]; }));
  ZB.animacion('gantt', {
    vista: [0, 0, 640, 316],
    alt: 'Un diagrama de Gantt con seis equipos y el tiempo de 0 a 30 h. El lote 1 ocupa los seis equipos, uno tras otro, durante 14,5 h. Si el lote 2 esperara, empezaría a las 14,5 h; traslapado, empieza a las 4 h, y el lote 3 a las 8 h. El secador queda ocupado sin pausa y fija el ritmo: un lote cada 4 h.',
    montar: function (svg) {
      var S = {}, x0 = 112, w = 516, horas = 30, px = w / horas, y0 = 34, hf = 34;
      var X = function (h) { return x0 + h * px; };
      for (var h = 0; h <= horas; h += 2) {
        s('line', { x1: X(h), x2: X(h), y1: y0 - 4, y2: y0 + PASOS_LOTE.length * hf, stroke: K.rejilla, 'stroke-width': 1 }, svg);
        if (h % 4 === 0) D.t(svg, X(h), y0 + PASOS_LOTE.length * hf + 16, String(h), { tam: 12, ancla: 'middle', color: K.tinta2 });
      }
      D.t(svg, X(horas), y0 + PASOS_LOTE.length * hf + 34, 'tiempo (h)', { tam: 12.5, peso: 600, ancla: 'end' });
      s('path', { d: 'M' + x0 + ' ' + (y0 - 4) + 'V' + (y0 + PASOS_LOTE.length * hf) + 'H' + X(horas), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, svg);
      PASOS_LOTE.forEach(function (p, i) {
        D.t(svg, 10, y0 + i * hf + 15, p[0], { tam: 12.5, peso: 700 });
        D.t(svg, 10, y0 + i * hf + 29, p[1], { tam: 11.5, color: K.tinta2 });
      });
      function lote(k, inicio, o) {
        var g = s('g', {}, svg), h0 = inicio;
        g.barras = PASOS_LOTE.map(function (p, i) {
          var r = s('rect', { x: X(h0), y: y0 + i * hf + 6, width: 0, height: hf - 12, fill: o.fill, stroke: o.borde || K.blanco, 'stroke-width': 1, 'stroke-dasharray': o.guion || 'none' }, g);
          r.w = p[2] * px; h0 += p[2];
          return r;
        });
        g.lleno = function (t) { g.barras.forEach(function (r, i) { var a = i / PASOS_LOTE.length, b = (i + 1) / PASOS_LOTE.length; r.setAttribute('width', r.w * Math.max(0, Math.min(1, (t - a) / (b - a)))); }); };
        return g;
      }
      S.l1 = lote(0, 0, { fill: K.serie[0] });
      S.sombra = lote(1, T_LOTE, { fill: 'none', borde: K.tinta2, guion: '4 3' });
      S.l2 = lote(1, T_MAX, { fill: K.serie[1] });
      S.l3 = lote(2, 2 * T_MAX, { fill: K.serie[2] });
      S.tSombra = D.t(svg, X(horas), 24, 'el lote 2, si esperara: empieza a las ' + n(T_LOTE, 1) + ' h', { tam: 12, peso: 650, ancla: 'end', color: K.tinta2 });
      S.tSombra.setAttribute('opacity', 0);
      S.tRitmo = D.t(svg, X(2 * T_MAX + T_LOTE - 1) + 6, y0 + 4 * hf + 22, 'un lote cada ' + n(T_MAX, 0) + ' h', { tam: 12.5, peso: 750, color: K.olivaOsc, halo: true });
      S.tRitmo.setAttribute('opacity', 0);
      S.leyenda = grupo(svg, 1);
      [0, 1, 2].forEach(function (k) {
        s('rect', { x: x0 + k * 84, y: 280, width: 16, height: 12, fill: K.serie[k] }, S.leyenda);
        D.t(S.leyenda, x0 + 22 + k * 84, 291, 'lote ' + (k + 1), { tam: 12, color: K.tinta2 });
      });
      S.formula = D.t(svg, 320, 312, 'ocho lotes: (8 − 1) × 4 + 14,5 = 42,5 h, contra 8 × 14,5 = 116 h', { tam: 12.5, peso: 650, ancla: 'middle', color: K.tinta });
      S.formula.setAttribute('opacity', 0);
      return S;
    },
    pasos: [
      { texto: 'Un lote pasa por seis equipos, uno tras otro: el reactor, el tamiz, el destilador, el cristalizador, el secador y el empaque. En total, 14,5 h.', dur: 2.4, ir: function (S, t) { S.l1.lleno(t); } },
      { texto: 'Si el lote 2 esperara a que saliera el 1, empezaría a las 14,5 h, y la planta haría un lote cada 14,5 h.', dur: 1.6, ir: function (S, t) { S.sombra.lleno(t); D.ver(S.tSombra, T(t, 0.5, 1)); } },
      { texto: 'Pero el lote 2 puede empezar en cuanto el secador quede libre para él: 4 h después del 1, lo que dura el secador, el paso más largo.', dur: 2.4, ir: function (S, t) { D.ver(S.sombra, 1 - T(t, 0, 0.3)); D.ver(S.tSombra, 1 - T(t, 0, 0.3)); S.l2.lleno(T(t, 0.2, 1)); } },
      { texto: 'El lote 3 empieza a las 8 h. El secador queda ocupado sin pausa: él fija el ritmo, un lote cada 4 h.', dur: 2.4, ir: function (S, t) { S.l3.lleno(T(t, 0, 0.8)); D.ver(S.tRitmo, T(t, 0.7, 1)); } },
      { texto: 'Para $N$ lotes, $t_N = (N - 1)\\,t_\\text{máx} + \\sum t_i$: ocho lotes toman 42,5 h, contra 116 h uno tras otro.', dur: 1.4, ir: function (S, t) { D.ver(S.formula, t); } }
    ]
  });


  /* ================= 2.5 El diagrama de tubería e instrumentación ================= */

  /* Una etiqueta de la ISA-5.1, letra por letra. */
  var ETIQUETAS = [
    { tag: 'PT', num: '105', tipo: 'campo', lee: 'transmisor de presión', filas: [['P', 'primera letra: la variable, presión'], ['T', 'función: transmitir'], ['105', 'el lazo de presión de V-102']] },
    { tag: 'PIC', num: '105', tipo: 'compartido', lee: 'indicador y controlador de presión', filas: [['P', 'presión'], ['I', 'función: indicar'], ['C', 'función: controlar'], ['105', 'el mismo lazo']] },
    { tag: 'PY', num: '105', tipo: 'campo', lee: 'convertidor del lazo de presión', filas: [['P', 'presión'], ['Y', 'función: relé, cálculo o convertidor'], ['105', 'el mismo lazo']] },
    { tag: 'PSV', num: '116', tipo: 'campo', lee: 'válvula de seguridad de presión', filas: [['P', 'presión'], ['S', 'modificador de la variable: seguridad'], ['V', 'función: válvula']] },
    { tag: 'LSHH', num: '115', tipo: 'campo', lee: 'interruptor de nivel muy alto', filas: [['L', 'nivel'], ['S', 'función: interruptor'], ['HH', 'modificador de la función: muy alto']] },
    { tag: 'FFC', num: '103', tipo: 'compartido', lee: 'controlador de razón de flujos', filas: [['F', 'flujo'], ['F', 'modificador de la variable: razón'], ['C', 'función: controlar']] }
  ];
  ZB.animacion('etiqueta', {
    vista: [0, 0, 640, 250],
    alt: 'Un globo de instrumento a la izquierda y, a la derecha, cada letra de la etiqueta con lo que significa: PT-105, PIC-105, PY-105, PSV-116, LSHH-115 y FFC-103.',
    montar: function (svg) {
      var S = {}, cx = 104, cy = 120, r = 40;
      S.marco = s('rect', { x: cx - r - 2, y: cy - r - 2, width: 2 * r + 4, height: 2 * r + 4, fill: 'none', stroke: K.tinta, 'stroke-width': 1.8 }, svg);
      s('circle', { cx: cx, cy: cy, r: r, fill: K.blanco, stroke: K.tinta, 'stroke-width': 2 }, svg);
      S.raya = s('line', { x1: cx - r, x2: cx + r, y1: cy, y2: cy, stroke: K.tinta, 'stroke-width': 1.6 }, svg);
      S.letras = D.t(svg, cx, cy - 10, '', { tam: 13, peso: 750, ancla: 'middle' });
      S.num = D.t(svg, cx, cy + 24, '', { tam: 13, peso: 650, ancla: 'middle', color: K.tinta2 });
      S.donde = D.t(svg, cx, cy + 66, '', { tam: 11.5, peso: 600, ancla: 'middle', color: K.tinta2 });
      S.donde2 = D.t(svg, cx, cy + 81, '', { tam: 11.5, peso: 600, ancla: 'middle', color: K.tinta2 });
      S.lee = D.t(svg, 232, 32, '', { tam: 13, peso: 750, color: K.olivaOsc });
      S.der = s('g', {}, svg);
      S.poner = function (k, t) {
        var e = ETIQUETAS[k];
        D.ponerTexto(S.letras, e.tag); D.ponerTexto(S.num, e.num);
        D.ponerTexto(S.lee, e.tag + '-' + e.num + ': ' + e.lee);
        var comp = e.tipo === 'compartido';
        S.marco.setAttribute('opacity', comp ? 1 : 0); S.raya.setAttribute('opacity', comp ? 1 : 0);
        D.ponerTexto(S.donde, comp ? 'función compartida' : 'instrumento');
        D.ponerTexto(S.donde2, comp ? 'del sistema de control' : 'en campo');
        while (S.der.firstChild) S.der.removeChild(S.der.firstChild);
        e.filas.forEach(function (f, i) {
          var g = grupo(S.der, Math.max(0, Math.min(1, t * e.filas.length * 1.4 - i * 1.2)));
          var y = 52 + i * 46;
          ficha(g, 232, y, f[0], { tam: 13, w: 52, h: 30, fill: i === 0 ? K.amarillo : K.zona, borde: K.tinta });
          D.t(g, 298, y + 20, f[1], { tam: 13 });
        });
      };
      S.poner(0, 0);
      return S;
    },
    pasos: [
      { texto: 'PT-105: la primera letra, P, es la variable, presión; la T es la función, transmitir. El número es el del lazo, el mismo para todos sus instrumentos.', dur: 1.8, ir: function (S, t) { S.poner(0, t); } },
      { texto: 'PIC-105: dos funciones, indicar y controlar. El círculo dentro de un cuadrado, con su raya, dice que es una función compartida del sistema de control.', dur: 1.8, ir: function (S, t) { S.poner(1, t); } },
      { texto: 'PY-105: la Y es relé, cálculo o convertidor; este convierte la señal de 4 a 20 mA del controlador en aire para la válvula.', dur: 1.6, ir: function (S, t) { S.poner(2, t); } },
      { texto: 'PSV-116: la S pegada a la P es el modificador de seguridad, y la etiqueta se lee «válvula de seguridad de presión».', dur: 1.6, ir: function (S, t) { S.poner(3, t); } },
      { texto: 'LSHH-115: L es nivel; S, después de la variable sin modificar, es la función interruptor, y HH, muy alto. Un interruptor de nivel muy alto.', dur: 1.8, ir: function (S, t) { S.poner(4, t); } },
      { texto: 'FFC-103: la segunda F modifica la variable y la vuelve una razón. Es el controlador de la razón entre el hidrógeno de repuesto y el tolueno.', dur: 1.6, ir: function (S, t) { S.poner(5, t); } }
    ]
  });

  /* El PC-105 del PFD, abierto en los instrumentos del P&ID; y lo que no es control. */
  ZB.animacion('lazo', {
    vista: [0, 0, 640, 300],
    alt: 'V-102 con su salida de gas y la purga. En el PFD, un solo globo PC-105 mueve la válvula de la purga. En el P&ID, el transmisor PT-105 en campo manda una señal eléctrica al PIC-105, función compartida del sistema de control; el PIC manda su salida al convertidor PY-105, que mueve la válvula con aire. El LSHH-115 y el enclavamiento I-115 detienen los compresores.',
    montar: function (svg) {
      var S = {};
      var v = recipiente(svg, 70, 70, 70, 170, { nivel: 0.35, nombre: 'V-102' });
      tubo(svg, [[10, 190], [70, 190]]);
      D.t(svg, 10, 180, 'de E-102', { tam: 12, color: K.tinta2 });
      camino(svg, [[105, 70], [105, 36], [612, 36]]);
      D.flecha(svg, 600, 36, 620, 36, { punta: 8 });
      D.t(svg, 616, 26, 'a C-101 A/B', { tam: 12, ancla: 'end', color: K.tinta2 });
      camino(svg, [[250, 36], [250, 140], [612, 140]]);
      D.flecha(svg, 600, 140, 620, 140, { punta: 8 });
      D.t(svg, 616, 130, 'purga', { tam: 12, ancla: 'end', color: K.tinta2 });
      camino(svg, [[105, 240], [105, 286], [612, 286]]);
      D.flecha(svg, 600, 286, 620, 286, { punta: 8 });
      D.t(svg, 616, 276, 'a V-103', { tam: 12, ancla: 'end', color: K.tinta2 });
      S.valv = valvula(svg, 500, 140);
      D.t(svg, 484, 126, 'PV-105', { tam: 11.5, peso: 650, ancla: 'end' });
      // el PFD
      S.pfd = grupo(svg);
      senal(S.pfd, [[140, 104], [300, 104], [300, 183]], 'indefinida');
      globo(S.pfd, 300, 200, 'PC', '105', 'campo');
      senal(S.pfd, [[317, 200], [500, 200], [500, 129]], 'indefinida');
      D.t(S.pfd, 330, 236, 'en el PFD: un solo globo', { tam: 12.5, peso: 650, color: K.olivaOsc });
      // el P&ID
      S.pt = grupo(svg);
      camino(S.pt, [[140, 100], [158, 100]], { ancho: 1.2 });
      globo(S.pt, 175, 100, 'PT', '105', 'campo');
      senal(S.pt, [[175, 117], [175, 200], [283, 200]], 'electrica');
      S.pic = grupo(svg);
      globo(S.pic, 300, 200, 'PIC', '105', 'compartido');
      S.py = grupo(svg);
      senal(S.py, [[317, 200], [413, 200]], 'electrica');
      globo(S.py, 430, 200, 'PY', '105', 'campo');
      senal(S.py, [[447, 200], [560, 200], [560, 114], [510, 114]], 'neumatica');
      // el control actúa
      S.accion = grupo(svg);
      D.flecha(S.accion, 476, 174, 476, 152, { color: K.oliva, ancho: 2.4, punta: 8 });
      D.t(S.accion, 468, 172, 'abre', { tam: 12.5, peso: 700, ancla: 'end', color: K.olivaOsc, halo: true });
      // lo que no es control
      S.ls = grupo(svg);
      camino(S.ls, [[140, 232], [158, 232]], { ancho: 1.2 });
      globo(S.ls, 175, 232, 'LSHH', '115', 'campo');
      senal(S.ls, [[192, 236], [248, 248]], 'electrica');
      enclavamiento(S.ls, 266, 252, '115');
      D.t(S.ls, 292, 257, 'detiene C-101 A/B', { tam: 12.5, peso: 700, color: K.alerta, halo: true });
      return S;
    },
    pasos: [
      { texto: 'En el PFD, el lazo de presión de V-102 es un solo globo, el PC-105: mide la presión del recipiente y mueve la válvula de la purga.', dur: 1.6, ir: function (S, t) { D.ver(S.pfd, t); } },
      { texto: 'En el P&ID el PC-105 se abre. El transmisor PT-105, en campo, mide la presión y manda una señal eléctrica, discontinua, al PIC-105, una función compartida del sistema de control.', dur: 2.2, ir: function (S, t) { D.ver(S.pfd, 1 - T(t, 0, 0.4)); D.ver(S.pt, T(t, 0.3, 0.7)); D.ver(S.pic, T(t, 0.6, 1)); } },
      { texto: 'El PIC-105 manda su salida al convertidor PY-105, que la vuelve aire: la señal neumática, con sus pares de rayas, mueve el actuador de la válvula.', dur: 2, ir: function (S, t) { D.ver(S.pfd, 0); D.ver(S.py, t); } },
      { texto: 'Si la presión sube, el PIC-105 abre un poco la purga y la presión baja. El plano no dice el sentido del control, pero se deduce.', dur: 1.6, ir: function (S, t) { D.ver(S.pfd, 0); D.ver(S.accion, t); S.valv.cuerpo.setAttribute('fill', t > 0.4 ? K.amarillo : K.blanco); } },
      { texto: 'El P&ID dibuja también lo que no es control: si el nivel sube hasta el LSHH-115, el enclavamiento I-115 detiene los compresores, para que no les llegue líquido.', dur: 2, ir: function (S, t) { D.ver(S.pfd, 0); D.ver(S.ls, t); } }
    ]
  });

  /* El estudio de riesgos: las palabras guía sobre el nivel de V-102. */
  ZB.animacion('hazop', {
    vista: [0, 0, 640, 320],
    alt: 'V-102 con su entrada desde E-102, su nivel, la salida de gas a los compresores, la válvula de nivel LV-106 y el separador de baja V-103. Las palabras guía: no, más, menos, además de, parte de, inverso, otro que. Con MÁS, el nivel sube y el líquido va hacia los compresores, con LAH-106 y LSHH-115 como salvaguardas. Con MENOS o NO, el nivel se pierde y el gas a 23,9 bar pasa por LV-106 a V-103, que trabaja a 2,8 bar.',
    montar: function (svg) {
      var S = {};
      var palabras = ['NO', 'MÁS', 'MENOS', 'ADEMÁS DE', 'PARTE DE', 'INVERSO', 'OTRO QUE'], x = 14;
      S.pal = {};
      S.palabras = grupo(svg);
      palabras.forEach(function (p) { var f = ficha(S.palabras, x, 10, p, { tam: 12, h: 26 }); S.pal[p] = f; x += f.w + 8; });
      S.v = recipiente(svg, 50, 70, 64, 176, { nivel: 0.35 });
      D.t(svg, 122, 214, 'V-102', { tam: 12.5, peso: 700 });
      tubo(svg, [[12, 150], [50, 150]]);
      D.t(svg, 12, 168, 'de', { tam: 11.5, color: K.tinta2 });
      D.t(svg, 12, 182, 'E-102', { tam: 11.5, color: K.tinta2 });
      camino(svg, [[82, 70], [82, 54], [180, 54]]);
      D.flecha(svg, 166, 54, 180, 54, { punta: 7 });
      D.t(svg, 186, 59, 'C-101 A/B', { tam: 12, color: K.tinta2 });
      camino(svg, [[82, 246], [82, 300], [500, 300]]);
      S.lv = valvula(svg, 180, 300);
      D.t(svg, 196, 280, 'LV-106', { tam: 12, peso: 650 });
      caja(svg, 500, 272, 110, 42, { rx: 20, ancho: 1.8 });
      D.t(svg, 555, 298, 'V-103', { tam: 12.5, peso: 700, ancla: 'middle' });
      D.t(svg, 555, 264, '2,8 bar', { tam: 12, ancla: 'middle', color: K.tinta2 });
      D.t(svg, 122, 236, '23,9 bar', { tam: 12, color: K.tinta2 });
      // las flechas de lo que pasa
      S.liqArriba = D.flecha(svg, 82, 92, 82, 62, { color: K.alerta, ancho: 3, punta: 9, op: 0 });
      S.gasAbajo = grupo(svg);
      camino(S.gasAbajo, [[198, 300], [480, 300]], { color: K.alerta, ancho: 4 });
      D.flecha(S.gasAbajo, 440, 300, 492, 300, { color: K.alerta, ancho: 4, punta: 11 });
      D.t(S.gasAbajo, 360, 290, 'gas', { tam: 12.5, peso: 700, color: K.alerta, ancla: 'middle', halo: true });
      // la ficha de cada desviación
      function tarjeta(lineas) {
        var g = grupo(svg);
        lineas.forEach(function (l, i) { D.t(g, 214, 108 + i * 22, l[0], { tam: l[1] || 12.5, peso: l[2] || 500, color: l[3] || K.tinta }); });
        return g;
      }
      S.mas = tarjeta([
        ['MÁS: nivel alto en V-102', 13, 750, K.olivaOsc],
        ['Causas: LV-106 pegada cerrada; LT-106 lee bajo'],
        ['Consecuencia: líquido arrastrado hacia C-101 A/B', 12.5, 650, K.alerta],
        ['Salvaguardas: LAH-106; LSHH-115 e I-115,'],
        ['que detienen los compresores'],
        ['Acción: ninguna; el disparo ya está', 12.5, 650]
      ]);
      S.menos = tarjeta([
        ['MENOS, NO: sin nivel en V-102', 13, 750, K.olivaOsc],
        ['Causas: LV-106 pegada abierta; LT-106 lee alto;'],
        ['el bypass de LV-106 quedó abierto'],
        ['Consecuencia: el gas a 23,9 bar pasa a V-103', 12.5, 650, K.alerta],
        ['Salvaguardas: LAL-106, que lee el mismo LT-106;'],
        ['LV-106 falla cerrada, pero solo si pierde el aire']
      ]);
      S.accion = grupo(svg);
      D.t(S.accion, 214, 244, 'Acción: disparo por nivel muy bajo con un segundo', { tam: 12.5, peso: 650 });
      D.t(S.accion, 214, 262, 'transmisor; revisar el alivio de V-103', { tam: 12.5, peso: 650 });
      return S;
    },
    pasos: [
      { texto: 'El estudio toma el nivel de V-102 y la línea que lleva su líquido a V-103, y les aplica las palabras guía.', dur: 1.4, ir: function (S, t) { D.ver(S.palabras, t); } },
      { texto: 'MÁS: el nivel sube porque LV-106 se pega cerrada o porque LT-106 lee bajo. El líquido puede llegar a los compresores.', dur: 2, ir: function (S, t) { relleno(S.pal['MÁS'], t > 0.2 ? K.amarillo : K.zona); S.v.nivel(L(0.35, 0.9, t)); D.ver(S.liqArriba, T(t, 0.6, 1)); D.ver(S.mas, T(t, 0.3, 0.8)); } },
      { texto: 'Para esa desviación, las salvaguardas ya están en el plano: la alarma LAH-106 y el LSHH-115, con el enclavamiento I-115 que detiene los compresores.', dur: 1.4, ir: function (S, t) { relleno(S.pal['MÁS'], K.amarillo); S.v.nivel(0.9); D.ver(S.liqArriba, 1); D.ver(S.mas, 1); } },
      { texto: 'MENOS, NO: si LV-106 se pega abierta, el nivel se pierde, y el gas a 23,9 bar pasa a V-103, que trabaja a 2,8 bar.', dur: 2.2, ir: function (S, t) {
        relleno(S.pal['MÁS'], K.zona); relleno(S.pal['MENOS'], K.amarillo); relleno(S.pal['NO'], K.amarillo);
        D.ver(S.mas, 0); D.ver(S.liqArriba, 0); S.v.nivel(L(0.9, 0, T(t, 0, 0.6))); D.ver(S.gasAbajo, T(t, 0.5, 0.9)); D.ver(S.menos, T(t, 0.3, 0.8));
        S.lv.cuerpo.setAttribute('fill', K.alerta);
      } },
      { texto: 'La alarma LAL-106 depende del mismo LT-106 que falló, y la posición de falla solo ayuda si la válvula pierde el aire. La acción: un disparo con un segundo transmisor, y revisar el alivio de V-103.', dur: 1.8, ir: function (S, t) {
        relleno(S.pal['MENOS'], K.amarillo); relleno(S.pal['NO'], K.amarillo); D.ver(S.mas, 0); D.ver(S.liqArriba, 0); S.v.nivel(0); D.ver(S.gasAbajo, 1); D.ver(S.menos, 1);
        S.lv.cuerpo.setAttribute('fill', K.alerta); D.ver(S.accion, t);
      } }
    ]
  });


  /* ================= 2.6 Una planta de alimentos: el pasteurizador ================= */

  /* La temperatura de la leche a lo largo del intercambiador de placas y del tubo de retención. */
  var T1 = 7, T2 = 55.8, T3 = 72, T4 = 23.3, T5 = 4.5;   // las de Fellows: la pasteurizada baja 48,7 K y la cruda sube 48,8 K
  ZB.animacion('regeneracion', {
    vista: [0, 0, 640, 320],
    alt: 'La temperatura de la leche a lo largo del pasteurizador: entra a 7 °C, sale de la regeneración a 55,8 °C, llega a 72 °C en el calentamiento y se mantiene 15 s en el tubo de retención; de vuelta en la regeneración baja a 23,3 °C, y el enfriamiento la deja a 4,5 °C. La recuperación de calor es del 75 %.',
    montar: function (svg) {
      var S = {}, xs = [70, 200, 320, 400, 520, 610], y0 = 250, esc = 2.6;
      var Y = function (t) { return y0 - t * esc; };
      S.Y = Y; S.xs = xs;
      [0, 20, 40, 60, 80].forEach(function (t) {
        s('line', { x1: 56, x2: 620, y1: Y(t), y2: Y(t), stroke: K.rejilla, 'stroke-width': 1 }, svg);
        D.t(svg, 50, Y(t) + 4, String(t), { tam: 12, ancla: 'end', color: K.tinta2 });
      });
      D.t(svg, 14, 26, 'T (°C)', { tam: 12.5, peso: 650 });
      var tramos = [['regeneración', K.serie[0]], ['calentamiento', K.calor], ['retención', K.tinta2], ['regeneración', K.serie[0]], ['enfriamiento', K.azul]];
      S.bandas = tramos.map(function (tr, i) {
        var g = grupo(svg);
        s('rect', { x: xs[i] + 2, y: y0 + 12, width: xs[i + 1] - xs[i] - 4, height: 8, fill: tr[1] }, g);
        D.t(g, (xs[i] + xs[i + 1]) / 2, y0 + 38, tr[0], { tam: 12, peso: 600, ancla: 'middle', color: K.tinta2 });
        return g;
      });
      var temps = [T1, T2, T3, T3, T4, T5];
      S.temps = temps;
      S.linea = s('path', { fill: 'none', stroke: K.tinta, 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, svg);
      S.pts = temps.map(function (t, i) { var p = D.punto(svg, xs[i], Y(t), { r: 5.5, color: K.blanco, borde: K.tinta }); p.setAttribute('opacity', 0); return p; });
      var et = [[T1, 'end', -10, 4], [T2, 'end', -10, -8], [T3, 'end', -8, -10], [T3, 'start', 8, -10], [T4, 'start', 8, -10], [T5, 'end', -10, 14]];
      S.et = et.map(function (e, i) { var t = D.t(svg, xs[i] + e[2], Y(e[0]) + e[3], n(e[0], e[0] % 1 ? 1 : 0) + ' °C', { tam: 13, peso: 700, ancla: e[1], halo: true }); t.setAttribute('opacity', 0); return t; });
      S.t15 = D.t(svg, 360, Y(T3) + 22, '15 s', { tam: 12.5, peso: 650, ancla: 'middle', color: K.tinta2, halo: true });
      S.t15.setAttribute('opacity', 0);
      // lo que sube la cruda y lo que baja la pasteurizada en la regeneración
      S.sube = grupo(svg);
      D.flecha(S.sube, 140, Y(T1) - 4, 140, Y(T2) + 4, { color: K.serie[0], ancho: 2.2, punta: 8 });
      D.t(S.sube, 148, Y((T1 + T2) / 2) + 20, '+48,8 K', { tam: 12.5, peso: 700, color: K.serie[0], halo: true });
      S.baja = grupo(svg);
      D.flecha(S.baja, 470, Y(T3) + 4, 470, Y(T4) - 4, { color: K.serie[0], ancho: 2.2, punta: 8 });
      D.t(S.baja, 478, Y((T3 + T4) / 2), '−48,7 K', { tam: 12.5, peso: 700, color: K.serie[0], halo: true });
      S.rec = D.t(svg, 620, 26, 'recuperación: (55,8 − 7)/(72 − 7) = 75 %', { tam: 13, peso: 750, ancla: 'end', color: K.olivaOsc });
      S.rec.setAttribute('opacity', 0);
      S.hasta = function (k, f) {     // la línea hasta el punto k, más una fracción f del tramo siguiente
        var d = 'M' + xs[0] + ' ' + Y(temps[0]);
        for (var i = 1; i <= k; i++) d += 'L' + xs[i] + ' ' + Y(temps[i]);
        if (f > 0 && k < 5) d += 'L' + L(xs[k], xs[k + 1], f) + ' ' + Y(L(temps[k], temps[k + 1], f));
        S.linea.setAttribute('d', d);
        S.pts.forEach(function (p, i) { p.setAttribute('opacity', i <= k || (i === k + 1 && f >= 1) ? 1 : 0); });
        S.et.forEach(function (e, i) { e.setAttribute('opacity', i <= k || (i === k + 1 && f >= 1) ? 1 : 0); });
      };
      S.hasta(0, 0);
      return S;
    },
    pasos: [
      { texto: 'La leche cruda entra a 7 °C y, en la sección de regeneración, se calienta con la leche ya pasteurizada hasta 55,8 °C.', dur: 1.8, ir: function (S, t) { D.ver(S.bandas[0], T(t, 0, 0.3)); S.hasta(0, t); D.ver(S.sube, T(t, 0.7, 1)); } },
      { texto: 'El agua caliente la lleva a 72 °C en la sección de calentamiento, y el tubo de retención la mantiene ahí 15 s.', dur: 2, ir: function (S, t) { D.ver(S.bandas[1], T(t, 0, 0.2)); D.ver(S.bandas[2], T(t, 0.5, 0.7)); S.hasta(t < 0.5 ? 1 : 2, t < 0.5 ? t * 2 : (t - 0.5) * 2); D.ver(S.t15, T(t, 0.7, 1)); } },
      { texto: 'De vuelta en la regeneración, ahora por el lado caliente, la pasteurizada le cede su calor a la cruda y baja a 23,3 °C: 48,7 K, casi lo mismo que subió la cruda.', dur: 2, ir: function (S, t) { D.ver(S.bandas[3], T(t, 0, 0.3)); S.hasta(3, t); D.ver(S.baja, T(t, 0.7, 1)); } },
      { texto: 'El agua helada la termina de enfriar a 4,5 °C.', dur: 1.4, ir: function (S, t) { D.ver(S.bandas[4], T(t, 0, 0.3)); S.hasta(4, t); } },
      { texto: 'La recuperación de calor es $(55{,}8 - 7)/(72 - 7)$ = 75 %: tres cuartas partes del calentamiento las pone la propia leche.', dur: 1.4, ir: function (S, t) { S.hasta(5, 0); D.ver(S.rec, t); } }
    ]
  });

  /* La válvula de desvío: flujo adelante, desvío y vuelta, con el registro de la temperatura. */
  ZB.animacion('desvio', {
    vista: [0, 0, 640, 300],
    alt: 'La leche sale del tanque V-201, pasa por la regeneración, la bomba de tiempo P-201 y el calentamiento, y el tubo de retención llega a la válvula de desvío; el TT-201 mide la temperatura y el TRC-201 la registra. Con la leche a 72,4 °C la válvula la deja seguir hacia la regeneración; cuando baja a 71,6 °C, la devuelve al tanque de balance V-201; cuando vuelve a 72 °C o más, regresa al flujo adelante. El registro muestra la temperatura contra el tiempo, con la línea de 72 °C.',
    montar: function (svg) {
      var S = {};
      // el tanque, la regeneración, la bomba de tiempo, el calentamiento y el tubo de retención
      caja(svg, 20, 200, 58, 56, { ancho: 1.8 });
      D.t(svg, 49, 233, 'V-201', { tam: 12.5, peso: 700, ancla: 'middle' });
      tubo(svg, [[78, 236], [98, 236]]);
      caja(svg, 98, 220, 78, 32, { fill: K.zona });
      D.t(svg, 137, 241, 'regeneración', { tam: 11.5, ancla: 'middle' });
      camino(svg, [[176, 236], [190, 236], [190, 178], [196, 178]]);
      s('circle', { cx: 210, cy: 178, r: 14, fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.8 }, svg);
      D.t(svg, 210, 208, 'P-201', { tam: 12, peso: 650, ancla: 'middle' });
      tubo(svg, [[224, 178], [238, 178]]);
      caja(svg, 238, 162, 84, 32, { fill: K.zona });
      D.t(svg, 280, 183, 'calentamiento', { tam: 11.5, ancla: 'middle' });
      D.t(svg, 210, 268, 'E-201: dos de sus tres secciones', { tam: 11, color: K.tinta2, ancla: 'middle' });
      S.tubo = camino(svg, [[322, 178], [427, 149]], { ancho: 3.2 });
      D.t(svg, 348, 196, 'tubo de retención', { tam: 12, color: K.tinta2 });
      // la válvula de desvío: tres vías
      s('circle', { cx: 440, cy: 148, r: 13, fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.8 }, svg);
      D.t(svg, 456, 134, 'FDV', { tam: 12, peso: 700 });
      S.adelante = grupo(svg, 1);
      S.adelanteL = camino(S.adelante, [[453, 148], [612, 148]], { ancho: 2.4 });
      D.flecha(S.adelante, 596, 148, 618, 148, { punta: 8 });
      D.t(S.adelante, 614, 172, 'a la regeneración', { tam: 12, ancla: 'end', color: K.tinta2 });
      S.desvio = grupo(svg, 1);
      S.desvioL = camino(S.desvio, [[440, 161], [440, 288], [49, 288], [49, 268]], { ancho: 2.4 });
      D.flecha(S.desvio, 49, 276, 49, 257, { punta: 8 });
      D.t(S.desvio, 300, 280, 'desvío: vuelve al tanque', { tam: 12, color: K.tinta2 });
      // el sensor y el registrador
      camino(svg, [[404, 152], [404, 120]], { ancho: 1.2 });
      globo(svg, 404, 103, 'TT', '201', 'campo');
      senal(svg, [[387, 103], [354, 103]], 'electrica');
      globo(svg, 337, 103, 'TRC', '201', 'panel');
      senal(svg, [[337, 86], [337, 70], [470, 70], [470, 100], [440, 100], [440, 135]], 'electrica');
      // el registro: la temperatura contra el tiempo
      var gx = 28, gy = 20, gw = 270, gh = 110;
      S.Yt = function (tc) { return gy + gh - (tc - 70.5) / 3 * gh; };
      S.Xt = function (f) { return gx + f * gw; };
      s('rect', { x: gx, y: gy, width: gw, height: gh, fill: K.blanco, stroke: K.borde, 'stroke-width': 1 }, svg);
      s('line', { x1: gx, x2: gx + gw, y1: S.Yt(72), y2: S.Yt(72), stroke: K.alerta, 'stroke-width': 1.4, 'stroke-dasharray': '5 4' }, svg);
      D.t(svg, gx + 6, S.Yt(72) + 16, '72 °C', { tam: 12, peso: 650, color: K.alerta });
      D.t(svg, gx + 6, gy + 16, 'registro del TRC-201', { tam: 12, peso: 650, color: K.tinta2 });
      S.traza = s('path', { fill: 'none', stroke: K.azul, 'stroke-width': 2.2 }, svg);
      S.lect = D.t(svg, gx + gw - 6, gy + 16, '', { tam: 13, peso: 750, ancla: 'end', color: K.azul });
      // la temperatura del registro, de 0 a 1 en el tiempo
      S.temp = function (f) { return f < 0.35 ? 72.4 : f < 0.45 ? L(72.4, 71.6, (f - 0.35) / 0.1) : f < 0.65 ? 71.6 : f < 0.75 ? L(71.6, 72.5, (f - 0.65) / 0.1) : 72.5; };
      S.hasta = function (f) {
        var d = '';
        for (var q = 0; q <= f + 1e-9; q += 0.01) d += (d ? 'L' : 'M') + S.Xt(q).toFixed(1) + ' ' + S.Yt(S.temp(q)).toFixed(1);
        S.traza.setAttribute('d', d || 'M0 0');
        var tc = S.temp(f);
        D.ponerTexto(S.lect, n(tc, 1) + ' °C');
        var bien = tc >= 72;
        S.adelanteL.setAttribute('stroke', bien ? K.oliva : K.borde); S.adelante.setAttribute('opacity', bien ? 1 : 0.35);
        S.desvioL.setAttribute('stroke', bien ? K.borde : K.naranja); S.desvio.setAttribute('opacity', bien ? 0.35 : 1);
        S.tubo.setAttribute('stroke', bien ? K.tinta : K.naranja);
      };
      S.hasta(0);
      return S;
    },
    pasos: [
      { texto: 'La leche cruda sale del tanque de balance V-201, se precalienta en la regeneración, la bomba de tiempo P-201 la empuja por el calentamiento y llega al tubo de retención. El TT-201, a no más de 46 cm de la válvula, le mide la temperatura, y el TRC-201 la registra.', dur: 1.4, ir: function (S, t) { S.hasta(0.05 * t); } },
      { texto: 'A 72,4 °C la leche llegó a la temperatura de pasteurización, y la válvula de desvío la deja seguir, en flujo adelante, hacia la regeneración.', dur: 1.8, ir: function (S, t) { S.hasta(L(0.05, 0.34, t)); } },
      { texto: 'El agua caliente falla y la leche sale a 71,6 °C, por debajo de 72 °C: la válvula cambia de posición y la devuelve al tanque de balance V-201 para que pase otra vez.', dur: 2.2, ir: function (S, t) { S.hasta(L(0.34, 0.6, t)); } },
      { texto: 'Cuando la temperatura vuelve a 72 °C o más, la válvula vuelve al flujo adelante. El registro es la prueba de que toda la leche que siguió se pasteurizó.', dur: 2, ir: function (S, t) { S.hasta(L(0.6, 1, t)); } }
    ]
  });


  /* ================= 2.7 Las vistas de la planta ================= */

  /* De la planta y la elevación al isométrico: una caja de 6 × 3 × 2 m. */
  ZB.animacion('isometrico', {
    vista: [0, 0, 640, 300],
    alt: 'Una caja de 6 por 3 por 2 metros vista en planta, un rectángulo de 6 por 3, y en elevación, un rectángulo de 6 por 2. A la derecha, los tres ejes de un isométrico, el vertical y dos a 30 grados de la horizontal, separados 120 grados; la caja dibujada en isométrico, con cada eje acortado al 81,6 por ciento, y sus cotas reales en milímetros.',
    montar: function (svg) {
      var S = {}, e = 20;
      // la planta
      S.planta = grupo(svg);
      D.t(S.planta, 20, 24, 'Planta', { tam: 13, peso: 750, color: K.olivaOsc });
      caja(S.planta, 20, 46, 6 * e, 3 * e, { rx: 0, ancho: 1.8, fill: K.zona });
      D.t(S.planta, 20 + 3 * e, 128, '6000', { tam: 12.5, peso: 650, ancla: 'middle' });
      D.t(S.planta, 26 + 6 * e, 46 + 1.5 * e + 4, '3000', { tam: 12.5, peso: 650 });
      D.t(S.planta, 20, 150, 'sin alturas', { tam: 12, color: K.alerta, peso: 650 });
      // la elevación
      S.elev = grupo(svg);
      D.t(S.elev, 20, 184, 'Elevación', { tam: 13, peso: 750, color: K.olivaOsc });
      caja(S.elev, 20, 206, 6 * e, 2 * e, { rx: 0, ancho: 1.8, fill: K.zona });
      D.t(S.elev, 20 + 3 * e, 268, '6000', { tam: 12.5, peso: 650, ancla: 'middle' });
      D.t(S.elev, 26 + 6 * e, 206 + e + 4, '2000', { tam: 12.5, peso: 650 });
      D.t(S.elev, 20, 290, 'no dice qué va delante', { tam: 12, color: K.alerta, peso: 650 });
      // los ejes del isométrico, aparte de la caja
      var ox = 372, oy = 170, c = Math.cos(Math.PI / 6), sn = Math.sin(Math.PI / 6);
      S.ejes = grupo(svg);
      D.t(S.ejes, 300, 24, 'Isométrico', { tam: 13, peso: 750, color: K.olivaOsc });
      s('line', { x1: 300, x2: 456, y1: oy, y2: oy, stroke: K.borde, 'stroke-width': 1, 'stroke-dasharray': '4 4' }, S.ejes);
      D.flecha(S.ejes, ox, oy, ox, oy - 90, { color: K.tinta2, ancho: 1.4, punta: 8 });
      D.flecha(S.ejes, ox, oy, ox + 90 * c, oy - 90 * sn, { color: K.tinta2, ancho: 1.4, punta: 8 });
      D.flecha(S.ejes, ox, oy, ox - 64 * c, oy - 64 * sn, { color: K.tinta2, ancho: 1.4, punta: 8 });
      s('path', { d: 'M' + (ox + 36) + ' ' + oy + 'A36 36 0 0 0 ' + (ox + 36 * c) + ' ' + (oy - 36 * sn), fill: 'none', stroke: K.oliva, 'stroke-width': 1.6 }, S.ejes);
      D.t(S.ejes, ox + 42, oy - 4, '30°', { tam: 12.5, peso: 700, color: K.olivaOsc });
      // los dos ejes horizontales forman 120° entre sí, y 120° con el vertical prolongado hacia abajo
      s('path', { d: 'M' + (ox + 26 * c) + ' ' + (oy - 26 * sn) + 'A26 26 0 0 0 ' + (ox - 26 * c) + ' ' + (oy - 26 * sn), fill: 'none', stroke: K.oliva, 'stroke-width': 1.6 }, S.ejes);
      D.t(S.ejes, ox + 8, oy - 34, '120°', { tam: 12.5, peso: 700, color: K.olivaOsc });
      // la caja en isométrico, con los ejes acortados al 81,6 %
      var bx = 500, by = 262, k = 16, P = function (x, y, z) { return [bx + (x - y) * c * k, by - (x + y) * sn * k - z * k]; };
      S.caja = grupo(svg);
      var cara = function (pts, fill) { s('path', { d: 'M' + pts.map(function (q) { return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join('L') + 'Z', fill: fill, stroke: K.tinta, 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, S.caja); };
      cara([P(0, 0, 2), P(6, 0, 2), P(6, 3, 2), P(0, 3, 2)], K.zona);
      cara([P(0, 0, 0), P(6, 0, 0), P(6, 0, 2), P(0, 0, 2)], K.blanco);
      cara([P(0, 0, 0), P(0, 3, 0), P(0, 3, 2), P(0, 0, 2)], K.rejilla);
      S.cotas = grupo(svg);
      D.t(S.cotas, 548, 256, '6000', { tam: 12.5, peso: 700, halo: true });
      D.t(S.cotas, 470, 272, '3000', { tam: 12.5, peso: 700, ancla: 'end', halo: true });
      D.t(S.cotas, 591, 202, '2000', { tam: 12.5, peso: 700, halo: true });
      D.t(S.cotas, 630, 294, 'cotas reales, en mm', { tam: 12, peso: 650, ancla: 'end', color: K.olivaOsc });
      S.factor = D.t(svg, 630, 140, 'cada eje, al 81,6 %', { tam: 12, peso: 650, ancla: 'end', color: K.tinta2 });
      S.factor.setAttribute('opacity', 0);
      return S;
    },
    pasos: [
      { texto: 'Vista desde arriba, una caja de 6 × 3 × 2 m es un rectángulo: se miden el largo y el ancho con la escala, pero no la altura.', dur: 1.4, ir: function (S, t) { D.ver(S.planta, t); } },
      { texto: 'Vista de lado, sobre un plano vertical, es otro rectángulo: se miden el largo y la altura, pero no se sabe qué va delante de qué.', dur: 1.4, ir: function (S, t) { D.ver(S.elev, t); } },
      { texto: 'En el isométrico la mirada forma el mismo ángulo con los tres ejes: el vertical se dibuja vertical, y los dos horizontales a 30° de la horizontal, a 120° entre sí.', dur: 1.8, ir: function (S, t) { D.ver(S.ejes, t); } },
      { texto: 'Cada eje se acorta al $\\sqrt{2/3}$ = 81,6 % de su longitud. Como los tres se acortan igual, la caja conserva sus proporciones y se ven sus tres medidas a la vez.', dur: 1.8, ir: function (S, t) { D.ver(S.caja, t); D.ver(S.factor, T(t, 0.5, 1)); } },
      { texto: 'Las cotas se escriben con la longitud real, 6000, 3000 y 2000 mm, aunque en el papel midan menos.', dur: 1.2, ir: function (S, t) { D.ver(S.cotas, t); } }
    ]
  });

  /* La línea 9, tramo por tramo, en su isométrico de tubería. */
  var TRAMOS_L9 = [['este', 790, 50], ['arriba', 3600, 120], ['sur', 12200, 250], ['abajo', 2930, 96]];
  ZB.animacion('linea9', {
    vista: [0, 0, 640, 320],
    alt: 'El isométrico de la línea 9, de una sola línea: sale del reactor a EL +3,400, corre 790 mm al este, sube 3600 mm a EL +7,000, cruza 12 200 mm al sur y baja 2930 mm a la boquilla de E-102 a EL +4,070. Son 19 520 mm de tubo recto, tres codos y dos bridas. El dibujo no va a escala.',
    montar: function (svg) {
      var S = {}, c = Math.cos(Math.PI / 6), sn = Math.sin(Math.PI / 6);
      var dir = { este: [c, -sn], arriba: [0, -1], sur: [c, sn], abajo: [0, 1] };
      var p = [70, 200];
      S.pts = [p];
      TRAMOS_L9.forEach(function (tr) { var d = dir[tr[0]]; p = [p[0] + d[0] * tr[2], p[1] + d[1] * tr[2]]; S.pts.push(p); });
      // la flecha del norte, que apunta al contrario del sur
      var nx = 590, ny = 60;
      D.flecha(svg, nx + 18 * c, ny + 18 * sn, nx - 18 * c, ny - 18 * sn, { color: K.tinta, ancho: 1.8, punta: 9 });
      D.t(svg, nx - 26 * c - 4, ny - 26 * sn - 2, 'N', { tam: 13, peso: 750, ancla: 'middle' });
      D.t(svg, 620, 100, 'no está a escala', { tam: 12, peso: 650, ancla: 'end', color: K.tinta2 });
      // el reactor y el enfriador, solo como referencia
      caja(svg, 30, 170, 36, 64, { rx: 12, ancho: 1.4, fill: K.zona });
      D.t(svg, 48, 252, 'R-101', { tam: 12, peso: 650, ancla: 'middle' });
      var f = S.pts[4];
      caja(svg, f[0] - 40, f[1], 80, 24, { rx: 10, ancho: 1.4, fill: K.zona });
      D.t(svg, f[0] + 46, f[1] + 20, 'E-102', { tam: 12, peso: 650 });
      S.tramos = TRAMOS_L9.map(function (tr, i) {
        var a = S.pts[i], b = S.pts[i + 1];
        var g = s('g', {}, svg);
        g.linea = s('line', { x1: a[0], y1: a[1], x2: a[0], y2: a[1], stroke: K.tinta, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
        g.a = a; g.b = b;
        var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
        var off = { este: [0, -12, 'end'], arriba: [-10, 4, 'end'], sur: [12, -10, 'start'], abajo: [10, 4, 'start'] }[tr[0]];
        g.cota = D.t(svg, mx + off[0], my + off[1], n(tr[1], 0), { tam: 13, peso: 700, ancla: off[2], color: K.olivaOsc, halo: true });
        g.cota.setAttribute('opacity', 0);
        return g;
      });
      // los codos y las bridas
      S.codos = [1, 2, 3].map(function (i) { var q = S.pts[i], cc = D.punto(svg, q[0], q[1], { r: 4.5, color: K.blanco, borde: K.tinta }); cc.setAttribute('opacity', 0); return cc; });
      S.bridas = [0, 4].map(function (i) {
        var q = S.pts[i], g = grupo(svg);
        if (i === 0) s('line', { x1: q[0] - 5 * sn, y1: q[1] - 5 * c, x2: q[0] + 5 * sn, y2: q[1] + 5 * c, stroke: K.tinta, 'stroke-width': 3 }, g);
        else s('line', { x1: q[0] - 8, y1: q[1], x2: q[0] + 8, y2: q[1], stroke: K.tinta, 'stroke-width': 3 }, g);
        return g;
      });
      S.el = [[0, 'EL +3,400', 4, 24, 'start'], [2, 'EL +7,000', -12, -8, 'end'], [4, 'EL +4,070', 50, -6, 'start']].map(function (e) {
        var q = S.pts[e[0]], t = D.t(svg, q[0] + e[2], q[1] + e[3], e[1], { tam: 12.5, peso: 650, ancla: e[4], halo: true });
        t.setAttribute('opacity', 0); return t;
      });
      S.total = D.t(svg, 20, 312, '790 + 3600 + 12 200 + 2930 = 19 520 mm de tubo recto, tres codos de 90° y dos bridas', { tam: 12.5, peso: 700, color: K.tinta });
      S.total.setAttribute('opacity', 0);
      S.tramo = function (i, f) { var g = S.tramos[i]; g.linea.setAttribute('x2', L(g.a[0], g.b[0], f)); g.linea.setAttribute('y2', L(g.a[1], g.b[1], f)); D.ver(g.cota, T(f, 0.7, 1)); };
      return S;
    },
    pasos: [
      { texto: 'La línea sale de una boquilla lateral del reactor R-101, a EL +3,400, con su brida, y corre 790 mm hacia el este.', dur: 1.4, ir: function (S, t) { D.ver(S.el[0], t); D.ver(S.bridas[0], t); S.tramo(0, t); } },
      { texto: 'Un codo la sube 3600 mm, hasta EL +7,000, la elevación a la que cruza el rack.', dur: 1.6, ir: function (S, t) { D.ver(S.codos[0], T(t, 0, 0.2)); S.tramo(1, t); D.ver(S.el[1], T(t, 0.8, 1)); } },
      { texto: 'Otro codo la lleva 12 200 mm hacia el sur, por encima del rack. En el dibujo ese tramo no mide quince veces el primero: el isométrico de tubería no va a escala, y mandan las cotas.', dur: 2.2, ir: function (S, t) { D.ver(S.codos[1], T(t, 0, 0.2)); S.tramo(2, t); } },
      { texto: 'El tercer codo la baja 2930 mm hasta la boquilla de la coraza de E-102, a EL +4,070.', dur: 1.6, ir: function (S, t) { D.ver(S.codos[2], T(t, 0, 0.2)); S.tramo(3, t); D.ver(S.bridas[1], T(t, 0.8, 1)); D.ver(S.el[2], T(t, 0.8, 1)); } },
      { texto: 'En total, 19 520 mm de tubo recto, tres codos de 90° y dos bridas: lo que necesita el cálculo de la caída de presión de la línea.', dur: 1.2, ir: function (S, t) { D.ver(S.total, t); } }
    ]
  });


  /* ================= 2.8 Las reglas del dibujo ================= */

  /* Qué línea se interrumpe en un cruce. */
  ZB.animacion('cruces', {
    vista: [0, 0, 640, 250],
    alt: 'A la izquierda, dos líneas del mismo grosor se cruzan y se interrumpe la vertical. A la derecha, una línea de proceso gruesa, vertical, cruza una de servicio delgada, horizontal, y se interrumpe la delgada.',
    montar: function (svg) {
      var S = {};
      S.izq = grupo(svg);
      D.t(S.izq, 30, 26, 'mismo grosor', { tam: 13, peso: 750, color: K.olivaOsc });
      s('line', { x1: 30, x2: 270, y1: 130, y2: 130, stroke: K.tinta, 'stroke-width': 3 }, S.izq);
      S.vIzq = [s('line', { x1: 150, x2: 150, y1: 50, y2: 130, stroke: K.tinta, 'stroke-width': 3 }, S.izq), s('line', { x1: 150, x2: 150, y1: 130, y2: 210, stroke: K.tinta, 'stroke-width': 3 }, S.izq)];
      S.tIzq = D.t(svg, 30, 238, 'se interrumpe la vertical', { tam: 12.5, peso: 650 });
      S.tIzq.setAttribute('opacity', 0);
      S.der = grupo(svg);
      D.t(S.der, 360, 26, 'grosores distintos', { tam: 13, peso: 750, color: K.olivaOsc });
      s('line', { x1: 480, x2: 480, y1: 50, y2: 210, stroke: K.tinta, 'stroke-width': 4.5 }, S.der);
      D.t(S.der, 490, 62, 'proceso, 1,0 mm', { tam: 12, color: K.tinta2 });
      S.hDer = [s('line', { x1: 360, x2: 480, y1: 130, y2: 130, stroke: K.tinta, 'stroke-width': 1.8 }, S.der), s('line', { x1: 480, x2: 600, y1: 130, y2: 130, stroke: K.tinta, 'stroke-width': 1.8 }, S.der)];
      D.t(S.der, 360, 120, 'servicio, 0,5 mm', { tam: 12, color: K.tinta2 });
      S.tDer = D.t(svg, 360, 238, 'se interrumpe la más delgada', { tam: 12.5, peso: 650 });
      S.tDer.setAttribute('opacity', 0);
      S.hueco = function (lin, eje, c, g, vertical) {
        if (vertical) { lin[0].setAttribute('y2', c - g); lin[1].setAttribute('y1', c + g); }
        else { lin[0].setAttribute('x2', c - g); lin[1].setAttribute('x1', c + g); }
      };
      return S;
    },
    pasos: [
      { texto: 'Dos líneas del mismo grosor se cruzan sin conectarse.', dur: 1, ir: function (S, t) { D.ver(S.izq, t); } },
      { texto: 'Se interrumpe la vertical, y la horizontal sigue de largo.', dur: 1.2, ir: function (S, t) { S.hueco(S.vIzq, 'y', 130, 9 * t, true); D.ver(S.tIzq, t); } },
      { texto: 'Una línea de proceso de 1,0 mm, vertical, cruza una de servicio de 0,5 mm, horizontal.', dur: 1.2, ir: function (S, t) { D.ver(S.der, t); } },
      { texto: 'Con grosores distintos se interrumpe la más delgada, aunque sea la horizontal.', dur: 1.2, ir: function (S, t) { S.hueco(S.hDer, 'x', 480, 11 * t, false); D.ver(S.tDer, t); } }
    ]
  });
})();
