/* Las animaciones por pasos del curso de 2027-10. Corren con el motor del libro
   (/classroom/estilo-libro/actividades/, ver su README) y se traen del libro con el mismo código y los
   mismos números: «inmiscibles» y «planta» son las del capítulo 1, «Las operaciones unitarias», y
   «valvula-variador», la del capítulo 11, «Bombas».
   La presión de vapor del agua sale de IAPWS-IF97 y la del d-limoneno de la ecuación de Antoine
   que el libro ajustó a la tabla 2-10 del Perry: el agua sola hierve en Bogotá (73,7 kPa) a 91,3 °C
   y con limoneno a 88,9 °C. Una animación nueva se escribe aquí con el mismo motor y, cuando se
   escriba su capítulo, pasa al libro. */
(function () {
  'use strict';
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, T = ZB.tramo, L = ZB.lerp;

  /* ---------- Piezas del capítulo ---------- */
  // Una caja con nombre (una o dos líneas), un detalle y una franja de colores arriba; devuelve el grupo.
  function caja(padre, x, y, w, h, o) {
    var g = s('g', { opacity: o.op == null ? 0 : o.op }, padre);
    g.marco = s('rect', { x: x, y: y, width: w, height: h, rx: 4, fill: K.blanco, stroke: K.tinta2, 'stroke-width': 1.4 }, g);
    if (o.franja) {
      var x0 = x, tot = o.franja.reduce(function (a, f) { return a + (f[1] || 1); }, 0);
      o.franja.forEach(function (f) {
        var ww = w * (f[1] || 1) / tot;
        s('rect', { x: x0, y: y, width: ww, height: 9, fill: f[0], stroke: K.tinta, 'stroke-width': 0.8 }, g);
        x0 += ww;
      });
    }
    var lin = String(o.nombre).split('\n'), y0 = y + (o.franja ? 28 : 22);
    lin.forEach(function (t, i) { D.t(g, x + 10, y0 + i * 16, t, { tam: o.tam || 13, peso: 650 }); });
    if (o.detalle) D.t(g, x + 10, y0 + lin.length * 16 + 2, o.detalle, { tam: 11.5, color: K.tinta2 });
    if (o.verbo) {
      var yv = y + h - 12;
      s('rect', { x: x + 10, y: yv - 9, width: 10, height: 10, fill: o.verbo[0], stroke: K.tinta, 'stroke-width': 0.8 }, g);
      D.t(g, x + 26, yv, o.verbo[1], { tam: 12, color: K.tinta2 });
    }
    return g;
  }
  // Presión de vapor del agua (kPa), IAPWS-IF97, región 4.
  var IF = [0, 0.11670521452767e4, -0.72421316703206e6, -0.17073846940092e2, 0.12020824702470e5, -0.32325550322333e7,
    0.14915108613530e2, -0.48232657361591e4, 0.40511340542057e6, -0.23855557567849, 0.65017534844798e3];
  function pAgua(Tc) {
    var Tk = Tc + 273.15, th = Tk + IF[9] / (Tk - IF[10]);
    var A = th * th + IF[1] * th + IF[2], B = IF[3] * th * th + IF[4] * th + IF[5], C = IF[6] * th * th + IF[7] * th + IF[8];
    return Math.pow(2 * C / (-B + Math.sqrt(B * B - 4 * A * C)), 4) * 1000;
  }
  // Presión de vapor del d-limoneno (kPa): la ecuación de Antoine del capítulo 12, en mmHg y °C.
  function pLimoneno(Tc) { return Math.pow(10, 7.49358 - 1936.23 / (Tc + 244.4)) * 0.1333224; }
  function raiz(f, a, b) { for (var i = 0; i < 60; i++) { var m = (a + b) / 2; if (f(a) * f(m) <= 0) b = m; else a = m; } return (a + b) / 2; }
  var P_BOG = 73.7;
  var T_AGUA = raiz(function (t) { return pAgua(t) - P_BOG; }, 60, 110);                     // 91,3 °C
  var T_MEZ = raiz(function (t) { return pAgua(t) + pLimoneno(t) - P_BOG; }, 60, 110);     // 88,9 °C

  /* ================= Capítulo 1 del libro, sección 1.4 ================= */

  /* Las presiones de vapor del agua, del limoneno y de las dos juntas, contra la temperatura. */
  ZB.animacion('inmiscibles', {
    vista: [0, 0, 640, 330],
    alt: 'La presión de vapor del agua llega a los 73,7 kPa de Bogotá a 91,3 °C. La del limoneno es de unos 6 kPa. La suma de las dos llega a 73,7 kPa a 88,9 °C; de esa presión, el agua pone 67,3 kPa y el limoneno 6,4.',
    montar: function (svg) {
      var S = {};
      var E = D.ejes(svg, { x: 64, y: 40, w: 380, h: 230, xmin: 60, xmax: 100, ymin: 0, ymax: 100, xt: [60, 70, 80, 90, 100], yt: [0, 20, 40, 60, 80, 100], xr: 'T (°C)', yr: 'p (kPa)' });
      var X = E.X, Y = E.Y; S.X = X; S.Y = Y;
      function curva(f) { var p = []; for (var t = 60; t <= 100.001; t += 0.5) p.push([t, f(t)]); return D.camino(p, X, Y); }
      S.linea = s('line', { x1: X(60), x2: X(100), y1: Y(P_BOG), y2: Y(P_BOG), stroke: K.ref, 'stroke-width': 1.4, 'stroke-dasharray': '6 4', opacity: 0 }, svg);
      S.tLinea = D.t(svg, X(61), Y(P_BOG) - 7, 'Bogotá: 73,7 kPa', { tam: 12, peso: 600, color: K.tinta2, halo: true });
      S.tLinea.setAttribute('opacity', 0);
      S.agua = D.trazo(svg, curva(pAgua), { color: K.azul, ancho: 2.6 });
      S.tAgua = D.t(svg, X(74), Y(24), 'agua', { tam: 13, peso: 700, color: K.azul, halo: true });
      S.pAgua = D.punto(svg, X(T_AGUA), Y(P_BOG), { r: 5.5, color: K.blanco, borde: K.azul });
      S.tTa = D.t(svg, X(T_AGUA) + 8, Y(P_BOG) + 20, n(T_AGUA, 1) + ' °C', { tam: 12.5, peso: 650, color: K.azul, halo: true });
      S.lim = D.trazo(svg, curva(pLimoneno), { color: K.aceiteO, ancho: 2.6 });
      S.tLim = D.t(svg, X(70), Y(pLimoneno(70)) - 12, 'limoneno', { tam: 13, peso: 700, color: K.aceiteO, halo: true });
      S.suma = D.trazo(svg, curva(function (t) { return pAgua(t) + pLimoneno(t); }), { color: K.tinta, ancho: 2.6 });
      S.tSuma = D.t(svg, X(78.4), Y(52), 'agua + limoneno', { tam: 13, peso: 700, ancla: 'end', color: K.tinta, halo: true });
      S.guia = s('line', { x1: X(T_MEZ), x2: X(T_MEZ), y1: Y(P_BOG), y2: Y(0), stroke: K.tinta, 'stroke-width': 1.2, 'stroke-dasharray': '3 3', opacity: 0 }, svg);
      S.pMez = D.punto(svg, X(T_MEZ), Y(P_BOG), { r: 6.5 });
      S.tTm = D.t(svg, X(T_MEZ) - 8, Y(P_BOG) - 12, n(T_MEZ, 1) + ' °C', { tam: 13, peso: 750, ancla: 'end', color: K.olivaOsc, halo: true });
      [S.tAgua, S.pAgua, S.tTa, S.tLim, S.tSuma, S.pMez, S.tTm].forEach(function (e) { e.setAttribute('opacity', 0); });
      // la barra de la mezcla a 88,9 °C
      var pw = pAgua(T_MEZ), po = pLimoneno(T_MEZ);
      S.barra = s('g', { opacity: 0 }, svg);
      D.t(S.barra, 500, 40, 'a ' + n(T_MEZ, 1) + ' °C', { tam: 12.5, peso: 650, ancla: 'middle' });
      s('rect', { x: 482, y: Y(pw), width: 36, height: Y(0) - Y(pw), fill: K.aguaM, stroke: K.tinta, 'stroke-width': 1 }, S.barra);
      s('rect', { x: 482, y: Y(P_BOG), width: 36, height: Y(pw) - Y(P_BOG), fill: K.aceite, stroke: K.tinta, 'stroke-width': 1 }, S.barra);
      D.t(S.barra, 526, Y(P_BOG) + 4, 'limoneno', { tam: 12, color: K.aceiteO, peso: 650 });
      D.t(S.barra, 526, Y(P_BOG) + 19, n(po, 1) + ' kPa', { tam: 12, color: K.tinta2 });
      D.t(S.barra, 526, Y(pw / 2), 'agua', { tam: 12, color: K.azul, peso: 650 });
      D.t(S.barra, 526, Y(pw / 2) + 15, n(pw, 1) + ' kPa', { tam: 12, color: K.tinta2 });
      return S;
    },
    pasos: [
      { texto: 'La presión de vapor del agua pura sube con la temperatura y llega a los 73,7 kPa de Bogotá a 91,3 °C: ahí hierve el agua sola.', dur: 2.2, ir: function (S, t) {
        D.ver(S.linea, T(t, 0, 0.2)); D.ver(S.tLinea, T(t, 0, 0.2)); S.agua.dibujar(T(t, 0.1, 0.8)); D.ver(S.tAgua, T(t, 0.5, 0.8)); D.ver(S.pAgua, T(t, 0.8, 1)); D.ver(S.tTa, T(t, 0.8, 1));
      } },
      { texto: 'La del limoneno puro es mucho más baja: a 89 °C apenas pasa de 6 kPa. Puro, hierve muy por encima del agua.', dur: 1.8, ir: function (S, t) { S.lim.dibujar(T(t, 0, 0.8)); D.ver(S.tLim, T(t, 0.5, 1)); } },
      { texto: 'Como no se mezclan, cada líquido ejerce su presión de vapor como si el otro no estuviera, y las dos se suman.', dur: 2, ir: function (S, t) { S.suma.dibujar(T(t, 0, 0.8)); D.ver(S.tSuma, T(t, 0.5, 1)); } },
      { texto: 'La suma llega a 73,7 kPa a unos 89 °C: la mezcla hierve por debajo del punto de ebullición de cada líquido, sin vacío.', dur: 1.6, ir: function (S, t) { D.ver(S.guia, t); D.ver(S.pMez, T(t, 0.3, 0.7)); D.ver(S.tTm, T(t, 0.5, 1)); } },
      { texto: 'De esos 73,7 kPa, el agua pone 67,3 y el limoneno 6,4: con el aceite se evapora mucha agua, y ese es el precio del arrastre.', dur: 1.6, ir: function (S, t) { D.ver(S.barra, t); } }
    ]
  });

  /* ================= Capítulo 1 del libro, sección 1.5 ================= */

  /* La planta de aceite esencial, paso por paso, con la familia de cada operación. */
  ZB.animacion('planta', {
    vista: [0, 0, 640, 318],
    alt: 'Los siete pasos de la planta de aceite esencial en dos filas, con una franja del color de su familia: lavado y desgarrado, mecánicos; arrastre de vapor, masa con calor; condensación, calor; florentino, mecánico; winterización, calor, masa y mecánica; rectificación, masa. Las clave son el arrastre, la winterización y la rectificación.',
    montar: function (svg) {
      var S = {}, MEC = K.amarillo, CAL = K.oliva, MAS = K.tinta, w = 140, h = 82;
      var B = [
        { x: 16, y: 46, nom: '1 Lavado', det: 'agua sobre la cáscara', f: [[MEC]] },
        { x: 172, y: 46, nom: '2 Desgarrado', det: 'trozos de 5 a 10 mm', f: [[MEC]] },
        { x: 328, y: 46, nom: '3 Arrastre\nde vapor', det: 'a unos 89 °C', f: [[MAS, 2], [CAL, 1]] },
        { x: 484, y: 46, nom: '4 Condensación', det: 'agua de enfriamiento', f: [[CAL]] },
        { x: 484, y: 186, nom: '5 Florentino', det: 'el aceite flota', f: [[MEC]] },
        { x: 328, y: 186, nom: '6 Winterización', det: '5 °C, 8 h y filtro', f: [[CAL], [MAS], [MEC]] },
        { x: 172, y: 186, nom: '7 Rectificación\nal vacío', det: '10 a 20 mbar', f: [[MAS]] }
      ];
      S.b = B.map(function (b) { return caja(svg, b.x, b.y, w, h, { nombre: b.nom, detalle: b.det, franja: b.f }); });
      S.ent = s('g', { opacity: 0 }, svg);
      D.flecha(S.ent, 70, 14, 70, 45, { punta: 8 });
      D.t(S.ent, 80, 26, 'cáscara', { tam: 12.5, peso: 650 });
      S.f = [
        D.flecha(svg, 156, 87, 171, 87, { punta: 7, op: 0 }), D.flecha(svg, 312, 87, 327, 87, { punta: 7, op: 0 }), D.flecha(svg, 468, 87, 483, 87, { punta: 7, op: 0 }),
        D.flecha(svg, 554, 128, 554, 185, { punta: 8, op: 0 }), D.flecha(svg, 484, 227, 469, 227, { punta: 7, op: 0 }), D.flecha(svg, 328, 227, 313, 227, { punta: 7, op: 0 })
      ];
      S.sal = s('g', { opacity: 0 }, svg);
      D.flecha(S.sal, 172, 227, 112, 227, { punta: 8 });
      D.t(S.sal, 104, 231, 'aceite', { tam: 12.5, peso: 650, ancla: 'end' });
      // la leyenda de las familias
      [[MEC, 'mecánica', 16], [CAL, 'calor', 112], [MAS, 'masa', 184]].forEach(function (l) {
        s('rect', { x: l[2], y: 296, width: 14, height: 10, fill: l[0], stroke: K.tinta, 'stroke-width': 0.8 }, svg);
        D.t(svg, l[2] + 20, 305, l[1], { tam: 12, color: K.tinta2 });
      });
      S.clave = s('g', { opacity: 0 }, svg);
      [2, 5, 6].forEach(function (i) {
        var b = B[i];
        s('rect', { x: b.x - 3, y: b.y - 3, width: w + 6, height: h + 6, rx: 6, fill: 'none', stroke: K.tinta, 'stroke-width': 2.6 }, S.clave);
        D.t(S.clave, b.x + w, b.y - 8, 'clave', { tam: 12, peso: 700, ancla: 'end', color: K.olivaOsc });
      });
      s('rect', { x: 262, y: 294, width: 16, height: 13, rx: 3, fill: 'none', stroke: K.tinta, 'stroke-width': 2.6 }, S.clave);
      D.t(S.clave, 286, 305, 'operación clave: cambia la composición del aceite', { tam: 12, color: K.tinta2 });
      return S;
    },
    pasos: [
      { texto: 'La cáscara entra a dos operaciones mecánicas: el lavado le quita la tierra, y el desgarrado la corta en trozos de 5 a 10 mm.', dur: 2, ir: function (S, t) { D.ver(S.ent, T(t, 0, 0.3)); D.ver(S.b[0], T(t, 0.1, 0.5)); D.ver(S.f[0], T(t, 0.5, 0.6)); D.ver(S.b[1], T(t, 0.6, 1)); } },
      { texto: 'El arrastre de vapor saca el aceite a unos 89 °C. Mueve masa y calor, y manda la masa.', dur: 1.6, ir: function (S, t) { D.ver(S.f[1], T(t, 0, 0.3)); D.ver(S.b[2], T(t, 0.2, 1)); } },
      { texto: 'El condensador devuelve los vapores a líquido, y en el florentino el aceite, menos denso, flota sobre el agua y sale por rebose.', dur: 2, ir: function (S, t) { D.ver(S.f[2], T(t, 0, 0.2)); D.ver(S.b[3], T(t, 0.1, 0.5)); D.ver(S.f[3], T(t, 0.5, 0.6)); D.ver(S.b[4], T(t, 0.6, 1)); } },
      { texto: 'La winterización enfría el aceite a 5 °C y lo deja reposar 8 h; el agua que sale de solución se asienta o queda en el filtro: calor, masa y mecánica en un solo paso.', dur: 1.8, ir: function (S, t) { D.ver(S.f[4], T(t, 0, 0.3)); D.ver(S.b[5], T(t, 0.2, 1)); } },
      { texto: 'La rectificación, a 10 a 20 mbar, separa los hidrocarburos terpénicos de los compuestos oxigenados.', dur: 1.8, ir: function (S, t) { D.ver(S.f[5], T(t, 0, 0.3)); D.ver(S.b[6], T(t, 0.2, 0.8)); D.ver(S.sal, T(t, 0.7, 1)); } },
      { texto: 'Tres pasos cambian la composición del aceite y son las operaciones clave: el arrastre, la winterización y la rectificación. Los demás son auxiliares. Ninguno es una reacción: la planta mueve, calienta y separa, y no tiene reactor.', dur: 1.6, ir: function (S, t) { D.ver(S.clave, t); } }
    ]
  });

  /* ================= Capítulo 11 del libro, «Bombas» ================= */

  function pts(f, a, b, paso) { var o = []; for (var q = a; q <= b + 1e-9; q += paso || 0.5) o.push([q, f(q)]); return o; }

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

  // Lo que necesitan las animaciones de otros archivos del curso.
  ZB.curso = { caja: caja, pAgua: pAgua, pLimoneno: pLimoneno, raiz: raiz, P_BOG: P_BOG, T_AGUA: T_AGUA, T_MEZ: T_MEZ };
})();
