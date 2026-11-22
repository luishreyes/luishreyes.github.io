/* Las animaciones por pasos de los capítulos 14, «Agitación», y 15, «Mezclado y escalado de tanques agitados», del
   libro, traídas con el mismo código y los mismos números para la presentación de agitación y mezclado de 2027-10.
   Son copias de libro/figuras/agitacion/actividades.js y de libro/figuras/mezclado/actividades.js del repositorio del
   libro, solo con las animaciones: los retos, con sus soluciones, se quedan en el libro. No se editan aquí; cuando
   cambian en el libro se vuelven a copiar. Corren con el motor de /classroom/estilo-libro/actividades/. */
/* Las animaciones y los retos del capítulo 14, «Agitación». Se escriben aquí directo (en bombas pasan por el taller
   interactivo/). Usan el motor de figuras/comun/actividades.js y las piezas de figuras/comun/dibujo.js; los colores
   salen de la paleta del libro (ZB.dib.col y PALETA), nunca a mano.
   Los números salen del texto del capítulo y del modelo del caso (caso.json, que escribe herramientas/agitacion.py, y
   herramientas/agitacion-alimentos.py): el reactor de 2,5 m con 3,0 m de líquido desde el punto más bajo del fondo
   elíptico, 13,7 m³, la turbina de cuatro palas inclinadas de 0,83 m a 0,625 m del fondo y a 100 r/min, las dos aletas,
   el agua a 85 °C (968,6 kg/m³ y 0,333 mPa·s) y la cáscara de 2 mm y 950 kg/m³; el tanque de aireación, las gotas de
   ciclohexano, el silo, el jugo y la papilla con el ancla de sus ejemplos.
   La animación «arrastre» reemplaza al video de Manim (escenas/libro/arrastre_cascara.py del público) con sus pasos y
   sus números, con el modelo de herramientas/figura-arrastre.py (copiado sin cambios en su parte numérica), y su último
   paso se ve como la figura del arrastre.
   Cada tanque se dibuja con las medidas de su caso o de su ejemplo, como en la tabla del caso y en sus esquemas.
   Un color hace un solo trabajo dentro de cada animación: el caso y el modelo en azul (la primera serie de las
   gráficas); lo que se compara en oliva (la segunda) y en naranja (la tercera); el punto que se lee, en amarillo; lo que
   se pasa de un límite, en el rojo de alerta; el líquido, la cáscara y la papilla con su material. */
(function () {
  'use strict';
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, T = ZB.tramo;
  var PA = window.PALETA, AGUA = PA.cortes.liquido, AGUA_M = PA.cortes['liquido-hondo'];
  var CASC = PA.materiales.cascara.medio, PURE = PA.materiales.suspension.relleno, PURE_M = PA.materiales.suspension.medio;
  var GOTA = PA.materiales.aceite.medio, CALOR = PA.cortes.calor;
  var AZ = K.serie[0], OL = K.serie[1], S3 = K.serie[2], AL = K.alerta;
  var G = 9.81;

  /* ---------- El caso (caso.json) ---------- */
  var RHO = 968.6, MU = 3.3307e-4, NU = MU / RHO, RHO20 = 998.2, RHO_S = 950;
  var DT = 2.5, HL = 3.0, DI = 0.83, CI = 0.625, RPM = 100, N0 = RPM / 60;
  var VFONDO = Math.PI * Math.pow(DT, 3) / 24, VCIL = Math.PI / 4 * DT * DT * (HL - DT / 4), VOL = VFONDO + VCIL;   // 2,0 + 11,7 = 13,7 m³
  var NP = 1.27, NPH = NP * Math.pow((CI / DI) / (DT / 3 / DI), -0.25);   // 1,36 con la altura del caso
  var ALT = 0.89, TOPE = 0.85;                                            // el motor a 2600 m y el tope del impulsor
  // El número de potencia de la turbina de palas inclinadas contra log10(Re) (caso.json, curvas.pbt).
  var PBT = [[0.0, 44.5], [0.1, 35.3476], [0.2, 28.0776], [0.3, 22.3028], [0.4, 17.7158], [0.5, 14.2562], [0.6, 12.1383], [0.7, 10.5036], [0.8, 9.183], [0.9, 8.0636], [1.0, 7.07], [1.1, 6.2039], [1.2, 5.4613], [1.3, 4.8162], [1.4, 4.2564], [1.5, 3.7796], [1.6, 3.3791], [1.7, 3.0367], [1.8, 2.746], [1.9, 2.4993], [2.0, 2.29], [2.1, 2.1165], [2.2, 1.965], [2.3, 1.8312], [2.4, 1.7224], [2.5, 1.63], [2.6, 1.549], [2.7, 1.4793], [2.8, 1.414], [2.9, 1.3563], [3.0, 1.32], [3.1, 1.3012], [3.2, 1.2877], [3.3, 1.28], [3.4, 1.276], [3.5, 1.2728], [3.6, 1.2707], [3.7, 1.27], [7.0, 1.27]];
  // El ancla de brazos planos en la transición (Hemrajani y Tatterson, fig. 6-33): Re y N_P.
  var ANCLA = [[100, 5.0], [1000, 1.2], [1e4, 0.50]];

  /* ---------- Las ecuaciones del capítulo ---------- */
  function pot(np, rho, rpm, d) { return np * rho * Math.pow(rpm / 60, 3) * Math.pow(d, 5); }            // W, ec. agi-p
  function joosten(dt, rhoS, rho) {                                                                      // r/min, ec. agi-joosten
    rho = rho || RHO;
    var fr = 0.036 * Math.pow(dt, -3.65) * Math.pow((rho - rhoS) / rho, 0.42);
    return { fr: fr, rpm: 60 * Math.sqrt(fr * G / (dt * DT)) };
  }
  function zw(S, nu, gdr, X, x, d) { return S * Math.pow(nu, 0.1) * Math.pow(gdr, 0.45) * Math.pow(X, 0.13) * Math.pow(x, 0.2) * Math.pow(d, -0.85); } // rev/s
  function cdTL(re) { return 24 / re * (1 + 0.173 * Math.pow(re, 0.657)) + 0.413 / (1 + 16300 * Math.pow(re, -1.09)); }  // ec. agi-arrastre
  function reTL(ar) { var lo = 1e-6, hi = 1e6; for (var i = 0; i < 200; i++) { var m = Math.sqrt(lo * hi); if (cdTL(m) * m * m > 4 / 3 * ar) hi = m; else lo = m; } return Math.sqrt(lo * hi); }
  function logInterp(pts, x) {
    x = Math.min(pts[pts.length - 1][0], Math.max(pts[0][0], x));
    for (var i = 0; i < pts.length - 1; i++) {
      var a = pts[i], b = pts[i + 1];
      if (x >= a[0] && x <= b[0]) return Math.pow(10, Math.log10(a[1]) + (Math.log10(b[1]) - Math.log10(a[1])) * Math.log10(x / a[0]) / Math.log10(b[0] / a[0]));
    }
    return NaN;
  }
  function npPBT(re) {
    var l = Math.log10(re);
    if (l <= 0) return 44.5 / re;
    for (var i = 0; i < PBT.length - 1; i++) if (l >= PBT[i][0] && l <= PBT[i + 1][0]) {
      var t = (l - PBT[i][0]) / (PBT[i + 1][0] - PBT[i][0]);
      return Math.pow(10, Math.log10(PBT[i][1]) + (Math.log10(PBT[i + 1][1]) - Math.log10(PBT[i][1])) * t);
    }
    return 1.27;
  }
  function motorMin(pkw) { return pkw / (ALT * TOPE); }

  /* ---------- Piezas ---------- */
  function grupo(padre, op) { return s('g', { opacity: op == null ? 0 : op }, padre); }
  function dTrazo(pts) { return pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(''); }
  function camino(padre, pts, o) {
    o = o || {};
    return s('path', { d: dTrazo(pts), fill: o.fill || 'none', stroke: o.color || K.tinta, 'stroke-width': o.ancho || 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'stroke-dasharray': o.guion || 'none' }, padre);
  }
  function lineas(padre, x, y, filas, o) {
    o = o || {};
    filas.forEach(function (f, i) { D.t(padre, x, y + i * (o.salto || 17), f, { tam: o.tam || 12, peso: i === 0 && o.titulo ? 700 : (o.peso || 500), ancla: o.ancla || 'start', color: i === 0 && o.titulo ? (o.colorT || K.tinta) : (o.color || K.tinta2) }); });
  }
  function rotado(padre, x, y, txt, o) {
    o = o || {};
    var t = s('text', { x: x, y: y, 'font-size': o.tam || 12, 'font-weight': o.peso || 600, 'text-anchor': 'middle', fill: o.color || K.tinta, transform: 'rotate(-90 ' + x + ' ' + y + ')' }, padre);
    D.ponerTexto(t, txt);
    return t;
  }
  function barra(padre, x, y, w, h, color) {
    var r = s('rect', { x: x, y: y, width: 0, height: h, fill: color }, padre);
    r.largo = function (f) { r.setAttribute('width', Math.max(0, w * Math.max(0, f))); };
    return r;
  }
  function cotaV(padre, x, y1, y2, txt, o) {
    o = o || {};
    var g = s('g', {}, padre), c = o.color || K.tinta2;
    s('line', { x1: x, x2: x, y1: y1 + 6, y2: y2 - 6, stroke: c, 'stroke-width': 1.2 }, g);
    s('path', { d: 'M' + x + ' ' + y1 + 'l-3.5 7h7zM' + x + ' ' + y2 + 'l-3.5 -7h7z', fill: c }, g);
    if (txt) D.t(g, x + (o.dx == null ? 7 : o.dx), (y1 + y2) / 2 + 4, txt, { tam: o.tam || 12, ancla: o.ancla || 'start', color: c, peso: 600, halo: o.halo });
    return g;
  }
  function cotaH(padre, x1, x2, y, txt, o) {
    o = o || {};
    var g = s('g', {}, padre), c = o.color || K.tinta2;
    s('line', { x1: x1 + 6, x2: x2 - 6, y1: y, y2: y, stroke: c, 'stroke-width': 1.2 }, g);
    s('path', { d: 'M' + x1 + ' ' + y + 'l7 -3.5v7zM' + x2 + ' ' + y + 'l-7 -3.5v7z', fill: c }, g);
    if (txt) D.t(g, (x1 + x2) / 2, y + (o.dy == null ? 16 : o.dy), txt, { tam: o.tam || 12, ancla: 'middle', color: c, peso: 600, halo: o.halo });
    return g;
  }
  // Un tanque cortado por el plano del eje. o: { cx, yb (punto más bajo), esc (px/m), Dt, alto (pared recta, m),
  // nivel (m), fondo: 'eliptico' | 'plano', liquido, tapa, camisa }
  function tanque(padre, o) {
    var g = s('g', {}, padre), e = o.esc, R = o.Dt / 2 * e, cx = o.cx, yb = o.yb;
    var hf = o.fondo === 'plano' ? 0 : o.Dt / 4;
    var X = function (r) { return cx + r * e; }, Y = function (z) { return yb - z * e; };
    function contorno(zTop) {
      return o.fondo === 'plano' ? 'M' + X(-o.Dt / 2) + ' ' + Y(zTop) + 'V' + yb + 'H' + X(o.Dt / 2) + 'V' + Y(zTop)
        : 'M' + X(-o.Dt / 2) + ' ' + Y(zTop) + 'V' + Y(hf) + 'A' + R + ' ' + (hf * e) + ' 0 0 0 ' + X(o.Dt / 2) + ' ' + Y(hf) + 'V' + Y(zTop);
    }
    if (o.camisa) s('path', { d: 'M' + (X(-o.Dt / 2) - 7) + ' ' + Y(o.alto * 0.92) + 'V' + Y(hf + 0.04) + 'M' + (X(o.Dt / 2) + 7) + ' ' + Y(o.alto * 0.92) + 'V' + Y(hf + 0.04), stroke: K.tinta2, 'stroke-width': 1.6, fill: 'none' }, g);
    var liq = s('path', { d: contorno(o.nivel) + 'Z', fill: o.liquido || AGUA }, g);
    s('path', { d: contorno(o.alto), fill: 'none', stroke: K.tinta, 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, g);
    if (o.tapa) s('path', { d: 'M' + X(-o.Dt / 2) + ' ' + Y(o.alto) + 'A' + R + ' ' + (o.Dt / 4 * e) + ' 0 0 1 ' + X(o.Dt / 2) + ' ' + Y(o.alto), fill: 'none', stroke: K.tinta, 'stroke-width': 2.2 }, g);
    var sup = s('line', { x1: X(-o.Dt / 2), x2: X(o.Dt / 2), y1: Y(o.nivel), y2: Y(o.nivel), stroke: AGUA_M, 'stroke-width': 1.6 }, g);
    return { g: g, X: X, Y: Y, liq: liq, sup: sup, contorno: contorno, hf: hf };
  }
  // La turbina de palas inclinadas vista de lado: dos palas de canto a los lados del cubo y la de adelante inclinada.
  function turbina(padre, tk, z, d, o) {
    o = o || {};
    var g = s('g', { opacity: o.op == null ? 1 : o.op }, padre), X = tk.X, Y = tk.Y, w = d / 5 * 0.71, col = o.color || K.metalM;
    [-1, 1].forEach(function (sg) {
      s('path', { d: dTrazo([[X(sg * 0.05), Y(z + w / 2)], [X(sg * d / 2), Y(z + w / 2)], [X(sg * d / 2), Y(z - w / 2)], [X(sg * 0.05), Y(z - w / 2)]]) + 'Z', fill: col, stroke: K.tinta, 'stroke-width': 1.3, 'stroke-dasharray': o.guion || 'none' }, g);
    });
    s('path', { d: dTrazo([[X(-0.16 * d), Y(z + w / 2)], [X(0.0), Y(z + w / 2)], [X(0.16 * d), Y(z - w / 2)], [X(0.0), Y(z - w / 2)]]) + 'Z', fill: K.metal, stroke: K.tinta, 'stroke-width': 1.3, 'stroke-dasharray': o.guion || 'none' }, g);
    s('rect', { x: X(-0.05), y: Y(z + w * 0.7), width: X(0.05) - X(-0.05), height: (w * 1.4) * (tk.Y(0) - tk.Y(1)), fill: K.metalO, stroke: K.tinta, 'stroke-width': 1 }, g);
    return g;
  }
  // Las dos aletas del caso: un tubo cerrado colgado de la tapa y una aleta hacia la pared en su parte de abajo.
  function aletas(padre, tk, zTop) {
    var g = s('g', {}, padre), X = tk.X, Y = tk.Y, sep = 0.015 * DT;
    [-1, 1].forEach(function (sg) {
      var rw = DT / 2 - sep, rf = rw - 0.17, rp = rf - 0.08;
      s('rect', { x: Math.min(X(sg * rf), X(sg * rp)), y: Y(zTop), width: Math.abs(X(sg * rf) - X(sg * rp)), height: Y(0.42) - Y(zTop), fill: K.metal, stroke: K.tinta, 'stroke-width': 1.2 }, g);
      s('rect', { x: Math.min(X(sg * rw), X(sg * rf)), y: Y(2.3), width: Math.abs(X(sg * rw) - X(sg * rf)), height: Y(0.42) - Y(2.3), fill: K.metalM, stroke: K.tinta, 'stroke-width': 1.2 }, g);
    });
    return g;
  }
  // El eje, el reductor y el motor sobre la tapa.
  function accionamiento(padre, tk, zEje0, zTapa) {
    var g = s('g', {}, padre), X = tk.X, Y = tk.Y;
    s('line', { x1: X(0), x2: X(0), y1: Y(zEje0), y2: Y(zTapa) - 18, stroke: K.tinta, 'stroke-width': 3 }, g);
    s('rect', { x: X(0) - 13, y: Y(zTapa) - 38, width: 26, height: 20, fill: K.metalM, stroke: K.tinta, 'stroke-width': 1.3 }, g);
    s('rect', { x: X(0) - 10, y: Y(zTapa) - 62, width: 20, height: 24, rx: 3, fill: K.metal, stroke: K.tinta, 'stroke-width': 1.3 }, g);
    return g;
  }
  // Ejes logarítmicos. o: { x, y, w, h, lx0, lx1, ly0, ly1 (log10), xt, yt (valores), xf, yf (formato), xr, yr }
  function ejesLog(padre, o) {
    var g = s('g', {}, padre);
    var X = function (v) { return o.x + (Math.log10(v) - o.lx0) / (o.lx1 - o.lx0) * o.w; };
    var Y = function (v) { return o.y + o.h - (Math.log10(v) - o.ly0) / (o.ly1 - o.ly0) * o.h; };
    (o.yt || []).forEach(function (v) {
      s('line', { x1: o.x, x2: o.x + o.w, y1: Y(v), y2: Y(v), stroke: K.rejilla, 'stroke-width': 1 }, g);
      D.t(g, o.x - 6, Y(v) + 4, o.yf ? o.yf(v) : String(v), { tam: 11.5, ancla: 'end', color: K.tinta2 });
    });
    (o.xt || []).forEach(function (v) {
      s('line', { x1: X(v), x2: X(v), y1: o.y, y2: o.y + o.h, stroke: K.rejilla, 'stroke-width': 1 }, g);
      D.t(g, X(v), o.y + o.h + 16, o.xf ? o.xf(v) : String(v), { tam: 11.5, ancla: 'middle', color: K.tinta2 });
    });
    s('path', { d: 'M' + o.x + ' ' + o.y + 'V' + (o.y + o.h) + 'H' + (o.x + o.w), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, g);
    if (o.xr) D.t(g, o.x + o.w, o.y + o.h + 34, o.xr, { tam: 12, peso: 600, ancla: 'end' });
    if (o.yr) D.t(g, o.x - 4, o.y - 10, o.yr, { tam: 12, peso: 600, ancla: 'start' });
    return { g: g, X: X, Y: Y };
  }
  function pot10(v) { var e = Math.round(Math.log10(v)); return e === 0 ? '1' : e === 1 ? '10' : '10^{' + String(e).replace('-', '−') + '}'; }
  // Un lazo de flujo suave (Catmull-Rom pasado a Bézier) por los puntos, con la punta en el último tramo.
  function flechaLazo(padre, pts, color) {
    var g = s('g', {}, padre), d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    for (var i = 0; i < pts.length - 2; i++) {
      var p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      d += 'C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
    }
    s('path', { d: d, fill: 'none', stroke: color || AZ, 'stroke-width': 2, 'stroke-linecap': 'round' }, g);
    var a = pts[pts.length - 2], b = pts[pts.length - 1];
    D.flecha(g, a[0], a[1], b[0], b[1], { color: color || AZ, ancho: 2, punta: 9 });
    return g;
  }

  /* ================= 14.1 El tanque ================= */

  /* El reactor del caso con las medidas de la tabla del caso y de su figura: fondo elíptico 2:1, 3,0 m de líquido,
     la turbina a 0,625 m del fondo, las dos aletas colgadas de la tapa y, al final, la segunda turbina que decide la
     sección de los sólidos, 0,83 m bajo la superficie. */
  ZB.animacion('tanque', {
    vista: [0, 0, 640, 400],
    alt: 'El reactor del caso en corte, a escala: un tanque de 2,5 m con fondo elíptico 2:1 de 0,625 m de hondo y el líquido hasta 3,0 m desde el punto más bajo. El volumen: 2,0 m³ en el fondo y 11,7 m³ de cilindro, 13,7 m³. La turbina de palas inclinadas de 0,83 m a 0,625 m del fondo, 2,4 m bajo la superficie; las dos aletas colgadas de la tapa, de unos 0,25 m con su tubo; y la comparación con el tanque normalizado. Al final, la segunda turbina, 0,83 m bajo la superficie y a 2,17 m del fondo, 1,9 diámetros sobre la de abajo.',
    montar: function (svg) {
      var S = {}, AL0 = 3.35, ZT = AL0 + DT / 4;
      var tk = tanque(svg, { cx: 196, yb: 380, esc: 76, Dt: DT, alto: AL0, nivel: HL, tapa: true });
      S.tk = tk;
      var X = tk.X, Y = tk.Y;
      // el fondo y el cilindro, resaltados en el paso 2
      S.fondo = s('path', { d: tk.contorno(tk.hf) + 'Z', fill: AGUA_M, opacity: 0 }, svg);
      S.cil = s('rect', { x: X(-DT / 2), y: Y(HL), width: X(DT / 2) - X(-DT / 2), height: Y(tk.hf) - Y(HL), fill: AGUA_M, opacity: 0 }, svg);
      accionamiento(svg, tk, CI, ZT);
      S.aletas = grupo(svg); aletas(S.aletas, tk, AL0 + DT / 4 * Math.sqrt(1 - Math.pow(0.96 / 1.25, 2)) + 0.1);
      S.turb = grupo(svg); turbina(S.turb, tk, CI, DI);
      S.turb2 = grupo(svg); turbina(S.turb2, tk, HL - DI, DI, { color: K.metal, guion: '4 3' });
      // las cotas: el diámetro arriba del líquido, la altura a la izquierda, y la cadena de alturas de las turbinas
      S.c1 = grupo(svg);
      S.c1.appendChild(cotaH(svg, X(-DT / 2), X(DT / 2), Y(AL0) - 3, '', {}));
      D.t(S.c1, X(-0.47), Y(AL0) - 11, 'D_t = 2,5 m', { tam: 11.5, peso: 600, ancla: 'middle', color: K.tinta2 });
      S.c1.appendChild(cotaV(svg, 34, Y(HL), Y(0), '', {}));
      rotado(S.c1, 24, (Y(HL) + Y(0)) / 2, 'H = 3,0 m', { tam: 12, color: K.tinta2 });
      S.c3 = grupo(svg);
      S.c3.appendChild(cotaV(svg, 74, Y(CI), Y(0), '', {}));
      rotado(S.c3, 64, (Y(CI) + Y(0)) / 2, 'C = 0,625 m', { tam: 11.5, color: K.tinta2 });
      S.c3.appendChild(cotaH(svg, X(-DI / 2), X(DI / 2), Y(CI) + 16, '', {}));
      D.t(S.c3, X(0), Y(CI) + 32, 'D = 0,83 m', { tam: 11.5, peso: 600, ancla: 'middle', color: K.tinta2 });
      S.c6 = grupo(svg);
      S.c6.appendChild(cotaV(svg, 74, Y(HL - DI), Y(CI), '', { color: AZ }));
      rotado(S.c6, 64, (Y(HL - DI) + Y(CI)) / 2, '1,9 D', { tam: 11.5, color: AZ });
      S.c6.appendChild(cotaV(svg, 74, Y(HL), Y(HL - DI), '', { color: AZ }));
      rotado(S.c6, 64, (Y(HL) + Y(HL - DI)) / 2, '0,83 m', { tam: 11.5, color: AZ });
      // a la derecha, los números
      var x = 316;
      S.r = [grupo(svg), grupo(svg), grupo(svg), grupo(svg), grupo(svg), grupo(svg)];
      lineas(S.r[0], x, 34, ['El tanque', 'D_t = 2,5 m; fondo elíptico 2:1, de 0,625 m', 'H = 3,0 m desde el punto más bajo: H/D_t = 1,2'], { titulo: true });
      lineas(S.r[1], x, 96, ['El volumen', 'fondo: πD_t^3/24 = ' + n(VFONDO, 1) + ' m³', 'cilindro: π/4 × 2,5² × (3,0 − 0,625) = ' + n(VCIL, 1) + ' m³', 'en total: ' + n(VOL, 1) + ' m³'], { titulo: true, colorT: AZ });
      lineas(S.r[2], x, 175, ['La turbina', 'D = 0,83 m (D/D_t = 0,33); palas de D/5', 'C = 0,625 m (C/D_t = 1/4)', '2,4 m bajo la superficie'], { titulo: true });
      lineas(S.r[3], x, 254, ['Los bafles', 'dos aletas de unos D_t/10 = 0,25 m', 'a 1,5 % de D_t de la pared: 38 mm'], { titulo: true });
      lineas(S.r[4], x, 316, ['Frente al tanque normalizado', 'C/D_t: 1/4 y no 1/3; H/D_t: 1,2 y no 1', 'bafles de D_t/10 y no de D_t/12'], { titulo: true });
      lineas(S.r[5], x, 316, ['La segunda turbina', 'a 2,17 m del fondo, 0,83 m bajo la superficie', '(2,17 − 0,625)/0,83 = 1,9 diámetros arriba'], { titulo: true, colorT: AZ });
      return S;
    },
    pasos: [
      { texto: 'El tanque del caso: $D_t$ = 2,5 m, con un fondo elíptico 2:1 de $D_t/4$ = 0,625 m de hondo, y el líquido hasta $H$ = 3,0 m desde el punto más bajo del fondo: $H/D_t$ = 1,2. Es vidriado y lleva camisa en la parte cilíndrica.', dur: 1.6, ir: function (S, t) { D.ver(S.c1, t); D.ver(S.r[0], T(t, 0.3, 1)); } },
      { texto: 'El volumen: el fondo, media elipsoide, guarda $\\pi D_t^3/24 = \\pi \\times 2,5^3/24$ = 2,0 m³, y el cilindro de encima, $\\pi/4 \\times 2,5^2 \\times (3,0 - 0,625)$ = 11,7 m³. En total, 13,7 m³.', dur: 2, ir: function (S, t) { S.fondo.setAttribute('opacity', 0.9 * T(t, 0, 0.4)); S.cil.setAttribute('opacity', 0.6 * T(t, 0.4, 0.8)); D.ver(S.r[1], T(t, 0.2, 1)); } },
      { texto: 'La turbina de cuatro palas inclinadas a 45°: $D$ = 0,83 m, $D/D_t$ = 0,33, con palas de $D/5$, a $C$ = 0,625 m del fondo, $C/D_t$ = 1/4, bombeando hacia abajo. La superficie le queda $3,0 - 0,625$ = 2,4 m arriba: es la parte del tanque que menos se mueve.', dur: 1.8, ir: function (S, t) { S.fondo.setAttribute('opacity', 0); S.cil.setAttribute('opacity', 0); D.ver(S.turb, T(t, 0, 0.5)); D.ver(S.c3, T(t, 0.4, 1)); D.ver(S.r[2], T(t, 0.3, 1)); } },
      { texto: 'Los bafles: dos aletas vidriadas colgadas de boquillas opuestas de la tapa, cada una de unos $D_t/10$ = 0,25 m con su tubo y separada de la pared 1,5 % de $D_t$, unos 38 mm. Las potencias del capítulo se calculan como si fueran cuatro bafles de pared, el lado seguro para el motor.', dur: 1.8, ir: function (S, t) { D.ver(S.aletas, t); D.ver(S.r[3], T(t, 0.3, 1)); } },
      { texto: 'Frente al tanque normalizado de la <a href="#tbl-agi-proporciones">tabla de las proporciones</a>, el caso conserva $D/D_t$ = 1/3 y $W/D$ = 1/5, pero tiene el impulsor más abajo, $C/D_t$ = 1/4 y no 1/3, más líquido, $H/D_t$ = 1,2 y no 1, y bafles de $D_t/10$ y no de $D_t/12$.', dur: 1.6, ir: function (S, t) { D.ver(S.r[4], t); } },
      { texto: 'Con $H/D_t$ = 1,2, el caso está justo en el límite de un impulsor para suspender sólidos. La sección de los sólidos le agrega una segunda turbina igual, 0,83 m bajo la superficie, a 2,17 m del fondo: $(2,17 - 0,625)/0,83$ = 1,9 diámetros sobre la de abajo, más que el diámetro que las separa.', dur: 2, ir: function (S, t) { D.ver(S.r[4], 1 - T(t, 0, 0.3)); D.ver(S.turb2, T(t, 0.2, 0.7)); D.ver(S.c6, T(t, 0.5, 1)); D.ver(S.r[5], T(t, 0.4, 1)); } }
    ]
  });

  /* Reto: el volumen con el fondo elíptico, las proporciones normalizadas y dónde va el segundo impulsor. */

  /* ================= 14.2 Los impulsores ================= */

  /* El Reynolds de la turbina del caso contra la viscosidad, en ejes logarítmicos, y lo que quiere decir cada límite. */
  ZB.animacion('viscosidad', {
    vista: [0, 0, 640, 380],
    alt: 'El Reynolds de la turbina del caso, de 0,83 m a 100 r/min, contra la viscosidad del líquido, en ejes logarítmicos. Con el agua a 85 °C, Re = 3,34 millones. Con un líquido de 1000 kg/m³ la recta es Re = 1148/μ: Re = 1000 con 1,1 Pa·s, donde la turbina de palas inclinadas deja de bombear con eficiencia; Re = 200 con 5,7 Pa·s y 100 con 11,5 Pa·s, donde conviene un impulsor para el laminar; y los 50 Pa·s que McCabe da para las turbinas, que aquí son Re = 23.',
    montar: function (svg) {
      var S = {};
      var E = ejesLog(svg, { x: 72, y: 28, w: 330, h: 290, lx0: -4, lx1: 2, ly0: 0, ly1: 7, xt: [1e-4, 1e-3, 1e-2, 0.1, 1, 10, 100], yt: [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7],
        xf: function (v) { return v < 0.1 ? pot10(v) : n(v, v < 1 ? 1 : 0); }, yf: pot10, xr: 'viscosidad, Pa·s', yr: 'Re' });
      var X = E.X, Y = E.Y;
      S.zonas = s('g', {}, null);
      s('rect', { x: 72, y: Y(1e7), width: 330, height: Y(1e4) - Y(1e7), fill: K.zona }, S.zonas);
      s('rect', { x: 72, y: Y(10), width: 330, height: Y(1) - Y(10), fill: K.zona }, S.zonas);
      svg.insertBefore(S.zonas, svg.firstChild);
      D.t(svg, 396, Y(1e4) - 8, 'turbulento', { tam: 11.5, ancla: 'end', color: K.tinta2 });
      D.t(svg, 396, Y(10) + 16, 'laminar', { tam: 11.5, ancla: 'end', color: K.tinta2 });
      var k = 1000 * N0 * DI * DI;   // 1148
      S.recta = D.trazo(svg, dTrazo([[X(k / 1e7), Y(1e7)], [X(100), Y(k / 100)]]), { color: AZ, ancho: 2.4 });
      S.agua = grupo(svg);
      var reW = RHO * N0 * DI * DI / MU;
      D.punto(S.agua, X(MU), Y(reW), { r: 6 });
      D.t(S.agua, X(MU) + 10, Y(reW) - 6, 'agua a 85 °C', { tam: 11.5, peso: 600, halo: true });
      function marca(mu, txt, col, o) {
        var g = grupo(svg), re = k / mu;
        s('line', { x1: 72, x2: X(mu), y1: Y(re), y2: Y(re), stroke: col, 'stroke-width': 1.2, 'stroke-dasharray': '4 3' }, g);
        D.punto(g, X(mu), Y(re), { r: 5, color: col === AL ? K.blanco : K.caso });
        D.t(g, X(mu) + o.dx, Y(re) + o.dy, txt, { tam: 11.5, peso: 600, color: col, halo: true, ancla: o.ancla || 'start' });
        return g;
      }
      S.m1000 = marca(1.1, 'Re = 1000: 1,1 Pa·s', K.tinta, { dx: 8, dy: -8 });
      S.m200 = marca(5.7, '5,7 Pa·s', K.tinta, { dx: 8, dy: -8 });
      S.m100 = marca(11.5, '11,5 Pa·s', K.tinta, { dx: 8, dy: -6 });
      S.mMc = marca(50, 'McCabe, 50 Pa·s: Re = 23', AL, { dx: -8, dy: 18, ancla: 'end' });
      var x = 430;
      S.r = [grupo(svg), grupo(svg), grupo(svg), grupo(svg)];
      lineas(S.r[0], x, 40, ['Re = ρND²/μ', 'D = 0,83 m; N = 1,667 r/s', 'agua: 3,34 millones', 'ρ = 1000 kg/m³: Re = 1148/μ'], { titulo: true, colorT: AZ });
      lineas(S.r[1], x, 124, ['Re = 1000', 'la turbina inclinada', 'deja de bombear bien'], { titulo: true });
      lineas(S.r[2], x, 192, ['Re = 100 a 200', 'impulsor para el laminar;', 'debajo, turbinas pésimas'], { titulo: true });
      lineas(S.r[3], x, 260, ['Los límites de la tabla', 'McCabe, 50 Pa·s: Re = 23', 'Geankoplis, 100 Pa·s: 11', 'EKATO, 20 Pa·s: 57'], { titulo: true, colorT: AL });
      return S;
    },
    pasos: [
      { texto: 'El Reynolds del impulsor, $\\mathrm{Re} = \\rho N D^2/\\mu$, con la turbina del caso: $D$ = 0,83 m a 100 r/min, $N$ = 1,667 r/s. En el agua a 85 °C, $968,6 \\times 1,667 \\times 0,83^2/(3,33 \\times 10^{-4})$ = 3,34 millones, muy adentro del turbulento.', dur: 1.6, ir: function (S, t) { D.ver(S.agua, t); D.ver(S.r[0], T(t, 0.3, 1)); } },
      { texto: 'Con un líquido de 1000 kg/m³, $\\mathrm{Re} = 1000 \\times 1,667 \\times 0,83^2/\\mu = 1148/\\mu$: una recta de pendiente −1 en ejes logarítmicos. El flujo es laminar por debajo de Re = 10 y turbulento por encima de 10⁴.', dur: 1.8, ir: function (S, t) { S.recta.dibujar(t); } },
      { texto: 'Re = 1000 con $1148/1000$ = 1,1 Pa·s. Por debajo de ese Reynolds, una turbina de palas inclinadas deja de bombear con eficiencia.', dur: 1.4, ir: function (S, t) { D.ver(S.m1000, t); D.ver(S.r[1], T(t, 0.3, 1)); } },
      { texto: 'Re = 200 con 5,7 Pa·s, y Re = 100 con 11,5 Pa·s. Entre 100 y 200 vale la pena pensar en un impulsor hecho para el laminar, y por debajo de 100 mezclar con turbinas es pésimo.', dur: 1.6, ir: function (S, t) { D.ver(S.m200, T(t, 0, 0.6)); D.ver(S.m100, T(t, 0.3, 0.9)); D.ver(S.r[2], T(t, 0.4, 1)); } },
      { texto: 'Los 50 Pa·s que McCabe da para las turbinas le dan a esta turbina $\\mathrm{Re} = 1148/50$ = 23; los 100 de Geankoplis, 11, y los 20 de EKATO, 57. Un límite de viscosidad vale solo para el tanque en que se fijó: el impulsor se escoge por su Reynolds.', dur: 1.8, ir: function (S, t) { D.ver(S.mMc, t); D.ver(S.r[3], T(t, 0.3, 1)); } }
    ]
  });

  /* Reto: el Reynolds de un impulsor, la viscosidad que lo lleva a un límite y la velocidad para el turbulento. */

  /* ================= 14.3 La potencia ================= */

  /* La potencia del reactor como en el ejemplo: el Reynolds, el número de potencia leído en la curva de la turbina de
     palas inclinadas (caso.json), la potencia, la punta y el par, la corrección por la altura del impulsor, el lote frío
     y el motor en Bogotá con el tope de 85 %. */
  ZB.animacion('potencia', {
    vista: [0, 0, 640, 400],
    alt: 'A la izquierda, el número de potencia de la turbina de palas inclinadas contra el Reynolds, en ejes logarítmicos; el caso queda en Re = 3,34 millones, donde la curva es plana en 1,27. Abajo, barras con la potencia: 2,24 kW con el lote caliente, 2,41 kW con el 1,36 de la altura del impulsor y 2,48 kW con el lote frío, contra lo que el motor de 3 kW le deja al impulsor en Bogotá, de 2,27 a 2,40 kW. A la derecha, los números: Re, N_P, la potencia, 164 W/m³, la punta a 4,35 m/s, el par de 214 N·m y el motor mínimo de 3,3 kW.',
    montar: function (svg) {
      var S = {};
      var E = ejesLog(svg, { x: 66, y: 26, w: 260, h: 196, lx0: 0, lx1: 7, ly0: -1, ly1: 2, xt: [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7], yt: [0.1, 1, 10, 100],
        xf: pot10, yf: function (v) { return n(v, v < 1 ? 1 : 0); }, yr: 'N_P' });
      D.t(svg, 326, 256, 'Re', { tam: 12, peso: 600, ancla: 'end' });
      var X = E.X, Y = E.Y;
      var zt = s('rect', { x: X(1e4), y: 26, width: X(1e7) - X(1e4), height: 196, fill: K.zona }, null);
      svg.insertBefore(zt, svg.firstChild);
      D.t(svg, X(1e7) - 4, 40, 'turbulento', { tam: 11.5, ancla: 'end', color: K.tinta2 });
      S.curva = D.trazo(svg, dTrazo(PBT.map(function (p) { return [X(Math.pow(10, p[0])), Y(p[1])]; })), { color: AZ, ancho: 2.4 });
      S.curva.dibujar(1);
      D.t(svg, X(3), Y(17) - 6, 'palas inclinadas', { tam: 11.5, peso: 600, color: AZ });
      S.reW = RHO * N0 * DI * DI / MU;
      S.guiaRe = s('line', { x1: X(S.reW), x2: X(S.reW), y1: 222, y2: Y(NP), stroke: K.tinta2, 'stroke-width': 1.2, 'stroke-dasharray': '4 3', opacity: 0 }, svg);
      S.guiaNp = s('line', { x1: 66, x2: X(S.reW), y1: Y(NP), y2: Y(NP), stroke: K.tinta2, 'stroke-width': 1.2, 'stroke-dasharray': '4 3', opacity: 0 }, svg);
      S.pto = D.punto(svg, X(1), 222, { r: 6 });
      S.pto.setAttribute('opacity', 0);
      S.X = X; S.Y = Y;
      // las barras de la potencia
      var bx = 150, bw = 170, PM = 3.5, BX = function (p) { return bx + p / PM * bw; };
      S.barras = grupo(svg);
      D.t(S.barras, 66, 266, 'potencia del impulsor, kW', { tam: 11.5, peso: 600 });
      [0, 1, 2, 3].forEach(function (v) { s('line', { x1: BX(v), x2: BX(v), y1: 290, y2: 376, stroke: K.rejilla, 'stroke-width': 1 }, S.barras); D.t(S.barras, BX(v), 390, String(v), { tam: 11.5, ancla: 'middle', color: K.tinta2 }); });
      S.tope = s('rect', { x: BX(3 * ALT * 0.85), y: 290, width: BX(3 * ALT * 0.90) - BX(3 * ALT * 0.85), height: 86, fill: OL, opacity: 0 }, svg);
      S.topeT = grupo(svg);
      D.t(S.topeT, BX(2.33), 284, 'tope del motor de 3 kW', { tam: 11, ancla: 'middle', color: OL, peso: 600 });
      var filas = [['caliente, 1,27', pot(NP, RHO, RPM, DI) / 1000, AZ], ['caliente, 1,36', pot(NPH, RHO, RPM, DI) / 1000, AZ], ['frío, 1,36', pot(NPH, RHO20, RPM, DI) / 1000, AL]];
      S.b = filas.map(function (f, i) {
        var y = 296 + i * 26, g = grupo(svg);
        D.t(g, bx - 6, y + 13, f[0], { tam: 11.5, ancla: 'end', color: K.tinta2 });
        var b = barra(g, bx, y, bw, 18, f[2]); b.largo(f[1] / PM);
        D.t(g, BX(2.48) + 8, y + 13, n(f[1], 2), { tam: 11.5, peso: 700 });
        return g;
      });
      // los números, a la derecha
      var x = 352;
      S.r = [grupo(svg), grupo(svg), grupo(svg), grupo(svg), grupo(svg), grupo(svg)];
      lineas(S.r[0], x, 34, ['Re = ρND²/μ = 3,34 millones', 'muy adentro del turbulento'], { titulo: true, colorT: AZ });
      lineas(S.r[1], x, 78, ['N_P = 1,27', 'la meseta de la curva'], { titulo: true, colorT: AZ });
      lineas(S.r[2], x, 122, ['P = N_P ρN³D⁵ = 2,24 kW', '164 W/m³: agitación moderada'], { titulo: true, colorT: AZ });
      lineas(S.r[3], x, 166, ['πND = 4,35 m/s', 'P/(2πN) = 214 N·m'], { titulo: true });
      lineas(S.r[4], x, 210, ['N_P = 1,27 (0,625/0,833)^{−0,25} = 1,36', 'caliente: 2,41 kW; frío: 2,48 kW'], { titulo: true });
      lineas(S.r[5], x, 254, ['El motor en Bogotá', '3 kW × 0,89 = 2,67 kW', 'tope de 85 a 90 %: 2,27 a 2,40 kW', '2,48/(0,89 × 0,85) = 3,3 kW'], { titulo: true, colorT: AL });
      return S;
    },
    pasos: [
      { texto: 'El Reynolds del impulsor, con la <a href="#eq-agi-re">ecuación del Reynolds del impulsor</a> y el agua a 85 °C: $968,6 \\times 1,667 \\times 0,83^2/(3,33 \\times 10^{-4})$ = 3,34 millones, muy adentro del turbulento, que empieza en 10⁴.', dur: 1.8, ir: function (S, t) { var re = Math.pow(10, Math.log10(S.reW) * t); S.pto.setAttribute('opacity', 1); S.pto.setAttribute('cx', S.X(Math.max(1, re))); S.pto.setAttribute('cy', 222); D.ver(S.r[0], T(t, 0.5, 1)); } },
      { texto: 'El número de potencia se lee en la curva de la turbina de palas inclinadas (<a href="#fig-agi-potencia">figura del número de potencia</a>): en turbulento es la meseta, $N_P$ = 1,27, el de la <a href="#tbl-agi-np">tabla de las constantes</a>, con el impulsor a $D_t/3$ del fondo.', dur: 1.4, ir: function (S, t) { S.pto.setAttribute('cx', S.X(S.reW)); S.pto.setAttribute('cy', 222 + (S.Y(NP) - 222) * t); S.guiaRe.setAttribute('opacity', t); S.guiaNp.setAttribute('opacity', T(t, 0.6, 1)); D.ver(S.r[1], T(t, 0.5, 1)); } },
      { texto: 'La potencia, con la <a href="#eq-agi-p">ecuación de la potencia</a>: $P = 1,27 \\times 968,6 \\times 1,667^3 \\times 0,83^5$ = 2,24 kW. En los 13,7 m³ son 164 W/m³: agitación moderada, la que pide un tanque que solo tiene que circular.', dur: 1.6, ir: function (S, t) { D.ver(S.barras, T(t, 0, 0.4)); D.ver(S.b[0], t); D.ver(S.r[2], T(t, 0.3, 1)); } },
      { texto: 'La punta de las palas va a $\\pi N D = \\pi \\times 1,667 \\times 0,83$ = 4,35 m/s, y el par en el eje es $P/(2\\pi N) = 2240/(2\\pi \\times 1,667)$ = 214 N·m.', dur: 1.2, ir: function (S, t) { D.ver(S.r[3], t); } },
      { texto: 'El 1,27 vale con el impulsor a $D_t/3$. Con la <a href="#eq-agi-altura">ecuación de la altura del impulsor</a>, a los 0,625 m del caso sube a $1,27 \\times (0,625/0,833)^{-0,25}$ = 1,36, y la potencia a 2,41 kW. El lote arranca frío, con agua a 20 °C de 998,2 kg/m³: 2,48 kW. Con esa se escoge el motor.', dur: 1.8, ir: function (S, t) { D.ver(S.b[1], T(t, 0, 0.5)); D.ver(S.b[2], T(t, 0.4, 0.9)); D.ver(S.r[4], T(t, 0.3, 1)); } },
      { texto: 'En Bogotá el motor de 3 kW da 89 % de su potencia, 2,67 kW, y el tope de 85 a 90 % le deja al impulsor de 2,27 a 2,40 kW. Los 2,24 kW del lote caliente caben; los 2,48 del arranque en frío, no: el caso necesita por lo menos $2,48/(0,89 \\times 0,85)$ = 3,3 kW.', dur: 1.8, ir: function (S, t) { S.tope.setAttribute('opacity', 0.3 * T(t, 0, 0.5)); D.ver(S.topeT, T(t, 0.2, 0.6)); D.ver(S.r[5], T(t, 0.4, 1)); } }
    ]
  });

  /* Reto: la potencia en turbulento con la punta y el par, la potencia en laminar y el motor con la altura del impulsor. */

  /* ================= 14.4 El caudal que bombea ================= */

  /* Cuánto bombea la turbina del caso, como en el ejemplo: el lazo en el tanque, el caudal, las vueltas del tanque, la
     cabeza, la potencia de bomba y la comparación con la bomba del capítulo 11. */
  ZB.animacion('bombeo', {
    vista: [0, 0, 640, 400],
    alt: 'El reactor del caso en corte con la turbina de palas inclinadas y su lazo: el líquido baja por el centro, sale hacia la pared, sube por ella y vuelve. A la derecha, los números: el caudal de 0,71 a 0,83 m³/s, el tanque entero que pasa por la turbina cada 17 a 19 s, la cabeza de 0,285 m y la potencia de bomba, 2,24 kW. Abajo, la turbina contra la bomba del capítulo de bombas: unas 120 veces más caudal con la sesentava parte de la cabeza.',
    montar: function (svg) {
      var S = {};
      var AL0 = 3.35, tk = tanque(svg, { cx: 146, yb: 380, esc: 76, Dt: DT, alto: AL0, nivel: HL, tapa: true });
      aletas(svg, tk, AL0 + DT / 4 * Math.sqrt(1 - Math.pow(0.96 / 1.25, 2)) + 0.1);
      accionamiento(svg, tk, CI, AL0 + DT / 4);
      turbina(svg, tk, CI, DI);
      S.lazos = grupo(svg);
      [-1, 1].forEach(function (sg) {
        var X = tk.X, Y = tk.Y;
        flechaLazo(S.lazos, [[X(sg * 0.28), Y(CI - 0.16)], [X(sg * 0.42), Y(0.2)], [X(sg * 0.7), Y(0.3)], [X(sg * 0.8), Y(0.9)], [X(sg * 0.8), Y(2.3)], [X(sg * 0.65), Y(2.7)], [X(sg * 0.38), Y(2.6)], [X(sg * 0.3), Y(1.9)], [X(sg * 0.28), Y(1.2)]]);
        D.flecha(S.lazos, X(sg * 0.28), Y(1.12), X(sg * 0.28), Y(CI + 0.14), { color: AZ, ancho: 2, punta: 9 });
      });
      var x = 310;
      S.r = [grupo(svg), grupo(svg), grupo(svg), grupo(svg)];
      lineas(S.r[0], x, 34, ['Q = N_Q N D³', '(0,75 a 0,87) × 1,667 × 0,83³', '= 0,71 a 0,83 m³/s: 2570 a 2990 m³/h'], { titulo: true, colorT: AZ });
      lineas(S.r[1], x, 98, ['Una vuelta del tanque', '13,7/0,83 = 16,5 s; 13,7/0,71 = 19 s'], { titulo: true });
      lineas(S.r[2], x, 145, ['H_i = N_P N²D²/(N_Q g)', '1,27 × 1,667² × 0,83²/(0,87 × 9,81) = 0,285 m'], { titulo: true, colorT: AZ });
      lineas(S.r[3], x, 192, ['ρ g H_i Q = 968,6 × 9,81 × 0,285 × 0,829', '= 2,24 kW, la potencia del ejemplo'], { titulo: true });
      // la turbina contra la bomba
      S.cmp = grupo(svg);
      var y0 = 250, bw = 290;
      D.t(S.cmp, x, y0, 'La turbina contra la bomba del capítulo 11', { tam: 12, peso: 700 });
      D.t(S.cmp, x, y0 + 22, 'caudal, m³/h', { tam: 11.5, color: K.tinta2 });
      S.bQt = barra(S.cmp, x, y0 + 30, bw, 14, AZ); S.bQp = barra(S.cmp, x, y0 + 48, bw, 14, OL);
      D.t(S.cmp, x + bw, y0 + 41, '2990', { tam: 11.5, peso: 700, ancla: 'end', color: K.blanco });
      D.t(S.cmp, x + 8, y0 + 59, '25: 120 veces menos', { tam: 11.5, peso: 600, color: OL });
      D.t(S.cmp, x, y0 + 86, 'cabeza, m', { tam: 11.5, color: K.tinta2 });
      S.bHt = barra(S.cmp, x, y0 + 94, bw, 14, AZ); S.bHp = barra(S.cmp, x, y0 + 112, bw, 14, OL);
      D.t(S.cmp, x + 8, y0 + 105, '0,285: la sesentava parte', { tam: 11.5, peso: 600, color: AZ });
      D.t(S.cmp, x + bw, y0 + 123, '17', { tam: 11.5, peso: 700, ancla: 'end', color: K.blanco });
      return S;
    },
    pasos: [
      { texto: 'La turbina echa el líquido hacia abajo por el centro; el líquido sale hacia la pared, sube por ella y vuelve a la turbina por arriba. Con la <a href="#eq-agi-q">ecuación del caudal</a> y $N_Q$ entre 0,75 y 0,87: $Q = (0,75 \\text{ a } 0,87) \\times 1,667 \\times 0,83^3$ = 0,71 a 0,83 m³/s, de 2570 a 2990 m³/h.', dur: 2, ir: function (S, t) { D.ver(S.lazos, T(t, 0, 0.6)); D.ver(S.r[0], T(t, 0.3, 1)); } },
      { texto: 'El tanque entero, 13,7 m³, pasa por el impulsor cada $13,7/0,829$ = 16,5 s a $13,7/0,715$ = 19 s: de 17 a 19 s.', dur: 1.4, ir: function (S, t) { D.ver(S.r[1], t); } },
      { texto: 'La cabeza, con la <a href="#eq-agi-carga">ecuación de la cabeza</a> y $N_Q$ = 0,87: $H_i = 1,27 \\times 1,667^2 \\times 0,83^2/(0,87 \\times 9,81)$ = 0,285 m. Mide la mayor fuerza que puede hacer la corriente.', dur: 1.4, ir: function (S, t) { D.ver(S.r[2], t); } },
      { texto: 'Como en cualquier bomba, $\\rho g H_i Q = 968,6 \\times 9,81 \\times 0,285 \\times 0,829$ = 2,24 kW: la potencia del <a href="#exm-agi-potencia">ejemplo de la potencia del reactor</a>. Toda esa cabeza se gasta en el tanque como turbulencia.', dur: 1.4, ir: function (S, t) { D.ver(S.r[3], t); } },
      { texto: 'La bomba del <a href="bombas.html">capítulo de bombas</a> mueve 25 m³/h con 17 m de cabeza. La turbina del caso mueve unas $2990/25$ = 120 veces más líquido con $0,285/17$, la sesentava parte de la cabeza: una bomba sin carcasa.', dur: 2, ir: function (S, t) { D.ver(S.cmp, T(t, 0, 0.3)); S.bQt.largo(T(t, 0.1, 0.6)); S.bQp.largo(T(t, 0.1, 0.6) * 25 / 2990); S.bHp.largo(T(t, 0.4, 0.9)); S.bHt.largo(T(t, 0.4, 0.9) * 0.285 / 17); } }
    ]
  });

  /* Reto: el caudal y las vueltas del tanque, la cabeza y la potencia de bomba, y la escala de Kolmogorov. */

  /* ================= 14.5 El accionamiento ================= */

  /* Reto: el par del motor en el eje, la banda prohibida de la velocidad crítica y el reductor. */

  /* ================= 14.6 Sólidos en suspensión ================= */

  /* La velocidad de Zwietering para la cáscara empapada a 1050 kg/m³, factor por factor, y la curva de N_js contra la
     densidad de la cáscara, de 1000 a 1200 kg/m³, contra los 100 r/min del caso. */
  var ZWX = 100 * 10 / 90;
  function zwCasc(rhoS) { return zw(4.4, NU, G * (rhoS - RHO) / RHO, ZWX, 0.002, DI) * 60; }
  ZB.animacion('zwietering', {
    vista: [0, 0, 640, 390],
    alt: 'La correlación de Zwietering para la cáscara empapada a 1050 kg/m³, factor por factor: S = 4,4; la viscosidad cinemática a la 0,1, 0,226; lo que pesa la partícula en el líquido a la 0,45, 0,917; la carga X = 11,1 a la 0,13, 1,37; el tamaño de 2 mm a la 0,2, 0,289; y el diámetro de 0,83 m a la −0,85, 1,17. El producto da 0,421 r/s, 25 r/min. Abajo, la velocidad contra la densidad de la cáscara: 16,5 r/min con 1000 kg/m³, 25 con 1050 y 40 con 1200, muy por debajo de los 100 r/min del caso.',
    montar: function (svg) {
      var S = {};
      var gdr = G * (1050 - RHO) / RHO;
      var F = [['S', 4.4, 'palas inclinadas'], ['ν^{0,1}', Math.pow(NU, 0.1), '(3,44·10^{−7})^{0,1}'], ['(gΔρ/ρ)^{0,45}', Math.pow(gdr, 0.45), '0,824^{0,45}'], ['X^{0,13}', Math.pow(ZWX, 0.13), '11,1^{0,13}'], ['x^{0,2}', Math.pow(0.002, 0.2), '0,002^{0,2}'], ['D^{−0,85}', Math.pow(DI, -0.85), '0,83^{−0,85}']];
      S.F = F;
      var x0 = 28, w = 96, y0 = 46;
      D.t(svg, x0, 26, 'N_{js} = S ν^{0,1} (gΔρ/ρ)^{0,45} X^{0,13} x^{0,2} D^{−0,85}', { tam: 13, peso: 700, color: AZ });
      S.cajas = F.map(function (f, i) {
        var g = grupo(svg), x = x0 + i * (w + 4);
        s('rect', { x: x, y: y0, width: w, height: 62, rx: 5, fill: K.blanco, stroke: K.borde, 'stroke-width': 1.2 }, g);
        D.t(g, x + w / 2, y0 + 19, f[0], { tam: 12, peso: 700, ancla: 'middle' });
        D.t(g, x + w / 2, y0 + 37, f[2], { tam: 11, ancla: 'middle', color: K.tinta2 });
        D.t(g, x + w / 2, y0 + 55, n(f[1], i === 0 ? 1 : (f[1] > 1 ? 2 : 3)), { tam: 12.5, peso: 700, ancla: 'middle', color: AZ });
        return g;
      });
      S.res = grupo(svg);
      D.t(S.res, x0, 136, '= 0,421 r/s = 25 r/min para la cáscara empapada de 1050 kg/m³', { tam: 13, peso: 700, color: AZ });
      // la curva contra la densidad
      var E = D.ejes(svg, { x: 70, y: 166, w: 340, h: 180, xmin: 975, xmax: 1225, ymin: 0, ymax: 110, xt: [1000, 1050, 1100, 1150, 1200], yt: [0, 25, 50, 75, 100], xr: 'densidad de la cáscara, kg/m³', yr: 'N_{js}, r/min' });
      var X = E.X, Y = E.Y;
      var pts = []; for (var rs = 975; rs <= 1200.01; rs += 2.5) pts.push([X(rs), Y(zwCasc(rs))]);
      S.curva = D.trazo(svg, dTrazo(pts), { color: AZ, ancho: 2.4 });
      S.caso = grupo(svg);
      s('line', { x1: 70, x2: 410, y1: Y(100), y2: Y(100), stroke: K.tinta2, 'stroke-width': 1.2, 'stroke-dasharray': '6 4' }, S.caso);
      D.t(S.caso, 406, Y(100) - 6, 'el caso: 100 r/min', { tam: 11.5, ancla: 'end', color: K.tinta2 });
      S.ptos = [1000, 1050, 1200].map(function (rs, i) {
        var g = grupo(svg), v = zwCasc(rs);
        D.punto(g, X(rs), Y(v), { r: 5.5 });
        D.t(g, X(rs) + (i === 2 ? -8 : 8), Y(v) + (i === 2 ? -9 : 18), n(v, i === 0 ? 1 : 0), { tam: 12, peso: 700, ancla: i === 2 ? 'end' : 'start', halo: true });
        return g;
      });
      // a la derecha, lo que pesa cada factor
      var x = 440;
      S.r = [grupo(svg), grupo(svg)];
      lineas(S.r[0], x, 182, ['De 1000 a 1200 kg/m³', '16,5 a 40 r/min:', '100 r/min es 2,5 a 6 veces más'], { titulo: true, colorT: AZ });
      lineas(S.r[1], x, 262, ['Si se dobla', 'Δρ: × 2^{0,45} = 1,37', 'el tamaño: × 2^{0,2} = 1,15', 'la carga: × 2^{0,13} = 1,09'], { titulo: true });
      return S;
    },
    pasos: [
      { texto: 'La cáscara empapada, si llega a 1050 kg/m³, se hunde, y la pregunta es la de Zwietering, la <a href="#eq-agi-zw">correlación de Zwietering</a>, con el $S$ = 4,4 de la turbina del caso (<a href="#tbl-agi-s">tabla de S</a>). La viscosidad cinemática del agua a 85 °C es $3,33 \\times 10^{-4}/968,6 = 3,44 \\times 10^{-7}$ m²/s, y entra con la potencia 0,1.', dur: 1.8, ir: function (S, t) { D.ver(S.cajas[0], T(t, 0, 0.5)); D.ver(S.cajas[1], T(t, 0.4, 1)); } },
      { texto: 'Lo que pesa la partícula en el líquido: $g\\,\\Delta\\rho/\\rho = 9,81 \\times (1050 - 968,6)/968,6$ = 0,824 m/s², a la 0,45: 0,917. Es el exponente mayor de la correlación.', dur: 1.4, ir: function (S, t) { D.ver(S.cajas[2], t); } },
      { texto: 'La carga y el tamaño: con 10 % en peso, $X = 100 \\times 10/90$ = 11,1 por cada 100 de líquido, a la 0,13: 1,37; la cáscara de 2 mm, $0,002^{0,2}$ = 0,289; y la turbina de 0,83 m, $0,83^{-0,85}$ = 1,17.', dur: 1.8, ir: function (S, t) { D.ver(S.cajas[3], T(t, 0, 0.4)); D.ver(S.cajas[4], T(t, 0.3, 0.7)); D.ver(S.cajas[5], T(t, 0.6, 1)); } },
      { texto: 'El producto: $N_{js} = 4,4 \\times 0,226 \\times 0,917 \\times 1,37 \\times 0,289 \\times 1,17$ = 0,421 r/s, 25 r/min. La turbina del caso va a 100: cuatro veces más.', dur: 1.4, ir: function (S, t) { D.ver(S.res, t); } },
      { texto: 'La misma cuenta con cada densidad: 16,5 r/min con 1000 kg/m³, 25 con 1050 y 40 con 1200. A 100 r/min el reactor queda entre 2,5 y 6 veces por encima de la suspensión completa: empapada, a la cáscara le sobra velocidad.', dur: 2.2, ir: function (S, t) { S.curva.dibujar(T(t, 0, 0.7)); D.ver(S.caso, T(t, 0, 0.3)); S.ptos.forEach(function (g, i) { D.ver(g, T(t, 0.3 + i * 0.2, 0.6 + i * 0.2)); }); D.ver(S.r[0], T(t, 0.6, 1)); } },
      { texto: 'Lo que pesa cada factor: doblar la diferencia de densidad multiplica la velocidad por $2^{0,45}$ = 1,37; doblar el tamaño, por $2^{0,2}$ = 1,15, y doblar la carga, por $2^{0,13}$ = 1,09. La densidad manda.', dur: 1.4, ir: function (S, t) { D.ver(S.r[1], t); } }
    ]
  });

  /* Lo que cuesta hundir la cáscara, con el modelo de herramientas/figura-arrastre.py (el de figuras-14.mjs y de la
     escena de Manim): las mismas coordenadas que la figura del arrastre; la turbina crece de D/T = 0,33 a 0,50 y su
     punto de Joosten se mueve por el camino punteado. El último paso se ve como la figura. */
  var AR = { RHO: 968.6, RHO_S: 950, NP: 1.27, T: 2.5, X0: 70, X1: 630, Y0: 40, Y1: 350, NMAX: 200, PMAX: 8 };
  function arPot(rpm, dt) { return AR.NP * AR.RHO * Math.pow(rpm / 60, 3) * Math.pow(dt * AR.T, 5) / 1000; }
  function arJoo(dt) { return 60 * Math.sqrt(0.036 * Math.pow(dt, -3.65) * Math.pow((AR.RHO - AR.RHO_S) / AR.RHO, 0.42) * G / (dt * AR.T)); }
  function arX(nn) { return AR.X0 + nn / AR.NMAX * (AR.X1 - AR.X0); }
  function arY(p) { return AR.Y1 - p / AR.PMAX * (AR.Y1 - AR.Y0); }
  function arCurva(dt) {
    var tope = Math.min(AR.NMAX, 60 * Math.pow(AR.PMAX * 1000 / (AR.NP * AR.RHO * Math.pow(dt * AR.T, 5)), 1 / 3)), pts = [];
    for (var i = 0; i <= 80; i++) { var nn = tope * i / 80; pts.push([arX(nn), arY(arPot(nn, dt))]); }
    return { d: dTrazo(pts), tope: tope };
  }
  function arLugar(dt1) { var pts = []; for (var i = 0; i <= 40; i++) { var dt = 0.332 + (dt1 - 0.332) * i / 40; pts.push([arX(arJoo(dt)), arY(arPot(arJoo(dt), dt))]); } return dTrazo(pts); }
  ZB.animacion('arrastre', {
    vista: [0, 0, 690, 402],
    alt: 'La potencia que la turbina del caso le entrega al líquido contra la velocidad del eje, de 0 a 200 r/min y de 0 a 8 kW. Primero la curva de la turbina de 0,83 m, que sube con el cubo de la velocidad, con el punto de hoy: 100 r/min y 2,24 kW. Después la velocidad que pide Joosten para hundir la cáscara de 950 kg/m³, 128 r/min, con 4,67 kW. Luego la turbina crece a D/Dt = 0,40, que pide 83 r/min y 3,23 kW, y a 0,50, que pide 49 r/min y 2,08 kW: la curva se empina con D⁵, pero la velocidad baja tanto que el punto cae. Al final las tres curvas, como en la figura del arrastre.',
    montar: function (svg) {
      var S = {}, X = arX, Y = arY;
      var g = s('g', {}, svg);
      for (var v = 0; v <= 200; v += 25) { s('line', { x1: X(v), x2: X(v), y1: AR.Y0, y2: AR.Y1, stroke: K.rejilla, 'stroke-width': 1 }, g); D.t(g, X(v), AR.Y1 + 20, String(v), { tam: 13, ancla: 'middle', color: K.tinta2 }); }
      for (var p = 0; p <= 8; p++) { s('line', { x1: AR.X0, x2: AR.X1, y1: Y(p), y2: Y(p), stroke: K.rejilla, 'stroke-width': 1 }, g); D.t(g, AR.X0 - 8, Y(p) + 5, String(p), { tam: 13, ancla: 'end', color: K.tinta2 }); }
      s('path', { d: 'M' + AR.X0 + ' ' + AR.Y0 + 'V' + AR.Y1 + 'H' + AR.X1, fill: 'none', stroke: K.eje, 'stroke-width': 1 }, g);
      D.t(g, (AR.X0 + AR.X1) / 2, AR.Y1 + 44, 'velocidad del eje, r/min', { tam: 13, ancla: 'middle', color: K.tinta2 });
      rotado(g, 24, (AR.Y0 + AR.Y1) / 2, 'potencia al líquido, kW', { tam: 13, peso: 500, color: K.tinta2 });
      // las tres curvas de la figura (la del caso se dibuja en el paso 1; las otras dos aparecen al final)
      var c0 = arCurva(0.332), c4 = arCurva(0.40), c5 = arCurva(0.50);
      S.c0 = D.trazo(svg, c0.d, { color: AZ, ancho: 2.4 });
      S.c4 = s('path', { d: c4.d, fill: 'none', stroke: S3, 'stroke-width': 2.4, 'stroke-dasharray': '9 5', opacity: 0 }, svg);
      S.mov = s('path', { d: '', fill: 'none', stroke: OL, 'stroke-width': 2.4, opacity: 0 }, svg);
      S.rot0 = D.t(svg, X(c0.tope), AR.Y0 - 10, 'D/D_t = 0,33, el caso', { tam: 13, ancla: 'middle', color: AZ });
      S.rot0.setAttribute('opacity', 0);
      S.rot4 = D.t(svg, X(c4.tope), AR.Y0 - 10, 'D/D_t = 0,40', { tam: 13, ancla: 'middle', color: S3 });
      S.rot5 = D.t(svg, X(c5.tope), AR.Y0 - 10, 'D/D_t = 0,50', { tam: 13, ancla: 'middle', color: OL });
      S.rot4.setAttribute('opacity', 0); S.rot5.setAttribute('opacity', 0);
      // el camino del punto, Joosten y los puntos
      S.lugar = s('path', { d: '', fill: 'none', stroke: K.tinta, 'stroke-width': 1, 'stroke-dasharray': '4 4' }, svg);
      S.vJoo = s('line', { x1: X(arJoo(0.332)), x2: X(arJoo(0.332)), y1: AR.Y1, y2: AR.Y0, stroke: OL, 'stroke-width': 2, 'stroke-dasharray': '6 4', opacity: 0 }, svg);
      S.tJoo = D.t(svg, X(arJoo(0.332)) - 6, AR.Y0 + 16, 'Joosten', { tam: 13, ancla: 'end', color: OL, peso: 600, halo: K.blanco });
      S.tJoo.setAttribute('opacity', 0);
      var hoy = arPot(100, 0.332);
      S.hoy = s('circle', { cx: X(100), cy: Y(hoy), r: 5.5, fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.4, opacity: 0 }, svg);
      S.tHoy = D.t(svg, X(100) + 12, Y(hoy) + 18, 'hoy: 100 r/min, ' + n(hoy, 2) + ' kW', { tam: 13, peso: 600, halo: K.blanco });
      S.tHoy.setAttribute('opacity', 0);
      S.p = [0.332, 0.40, 0.50].map(function (dt) { var c = D.punto(svg, X(arJoo(dt)), Y(arPot(arJoo(dt), dt)), { r: 5.5 }); c.setAttribute('opacity', 0); return c; });
      S.pm = D.punto(svg, X(arJoo(0.332)), Y(arPot(arJoo(0.332), 0.332)), { r: 6.5 });
      S.pm.setAttribute('opacity', 0);
      // la lectura en vivo y la clave del final
      S.lect = grupo(svg);
      S.lect1 = D.t(S.lect, X(152), Y(3.6), '', { tam: 13, color: K.tinta2, halo: K.blanco });
      S.lect2 = D.t(S.lect, X(152), Y(3.6) + 19, '', { tam: 14, peso: 700, halo: K.blanco });
      S.clave = grupo(svg);
      D.t(S.clave, AR.X1 - 4, 298, 'La velocidad de Joosten y su potencia', { tam: 14, peso: 600, ancla: 'end' });
      [[0.332, AZ], [0.40, S3], [0.50, OL]].forEach(function (f, i) {
        var nn = arJoo(f[0]), pp = arPot(nn, f[0]);
        D.t(S.clave, AR.X1 - 4, 298 + 15 * (i + 1), 'D/D_t = ' + n(f[0], 2) + ', D = ' + n(f[0] * AR.T, 2) + ' m: ' + n(nn, 0) + ' r/min, ' + n(pp, 2) + ' kW', { tam: 13, ancla: 'end', color: f[1] });
      });
      S.ver = function (dt) {
        var c = arCurva(dt), nn = arJoo(dt), pp = arPot(nn, dt);
        S.mov.setAttribute('d', c.d); S.mov.setAttribute('opacity', 1);
        S.lugar.setAttribute('d', arLugar(dt));
        S.pm.setAttribute('cx', X(nn)); S.pm.setAttribute('cy', Y(pp)); S.pm.setAttribute('opacity', 1);
        S.vJoo.setAttribute('x1', X(nn)); S.vJoo.setAttribute('x2', X(nn));
        S.tJoo.setAttribute('x', X(nn) - 6);
        D.ponerTexto(S.lect1, 'D/D_t = ' + n(dt, 2) + ', D = ' + n(dt * AR.T, 2) + ' m');
        D.ponerTexto(S.lect2, n(nn, 0) + ' r/min, ' + n(pp, 2) + ' kW');
        D.ver(S.lect, 1);
      };
      return S;
    },
    pasos: [
      { texto: 'La potencia de la turbina del caso en turbulento, con la <a href="#eq-agi-p">ecuación de la potencia</a>: $P = N_P\\,\\rho N^3 D^5$, con $N_P$ = 1,27 y el agua a 85 °C, de 968,6 kg/m³. Con $D$ = 0,83 m sube con el cubo de la velocidad, y a 100 r/min, $N$ = 1,667 r/s, es $1,27 \\times 968,6 \\times 1,667^3 \\times 0,83^5$ = 2,24 kW.', dur: 2.2, ir: function (S, t) { S.c0.dibujar(T(t, 0, 0.7)); S.rot0.setAttribute('opacity', T(t, 0.5, 0.9)); S.hoy.setAttribute('opacity', T(t, 0.7, 1)); S.tHoy.setAttribute('opacity', T(t, 0.75, 1)); } },
      { texto: 'La cáscara de 950 kg/m³ flota. La <a href="#eq-agi-joosten">correlación de Joosten</a> pide $\\mathrm{Fr} = 0,036 \\times 0,332^{-3,65} \\times (18,6/968,6)^{0,42}$ = 0,383, y con $D$ = 0,83 m, $N = \\sqrt{0,383 \\times 9,81/0,83}$ = 2,128 r/s: 128 r/min. Ahí la turbina toma $1,27 \\times 968,6 \\times 2,128^3 \\times 0,83^5$ = 4,67 kW, el doble de hoy; con el lote frío y el 1,36 de la altura del impulsor, 5,2 kW, y el motor tendría que ser de por lo menos 6,8 kW.', dur: 2.2, ir: function (S, t) { S.tHoy.setAttribute('opacity', 1 - T(t, 0, 0.3)); S.vJoo.setAttribute('opacity', T(t, 0, 0.5)); S.tJoo.setAttribute('opacity', T(t, 0.2, 0.6)); S.p[0].setAttribute('opacity', T(t, 0.5, 0.9)); } },
      { texto: 'Una turbina más grande: con $D/D_t$ = 0,40, $D$ = 1,0 m, la curva se empina, porque la potencia va con $D^5$, $(1,0/0,83)^5$ = 2,5 veces. Pero Joosten pide mucho menos: $\\mathrm{Fr} = 0,036 \\times 0,40^{-3,65} \\times (18,6/968,6)^{0,42}$ = 0,194, $N$ = 1,38 r/s, 83 r/min, y la potencia baja a 3,23 kW.', dur: 2.6, ir: function (S, t, raw) { var dt = 0.332 + (0.40 - 0.332) * t; S.ver(dt); S.mov.setAttribute('opacity', 1 - T(t, 0.85, 1)); S.c4.setAttribute('opacity', T(t, 0.85, 1)); S.rot4.setAttribute('opacity', T(t, 0.85, 1)); S.p[1].setAttribute('opacity', T(t, 0.9, 1)); } },
      { texto: 'Con $D/D_t$ = 0,50, $D$ = 1,25 m, Joosten pide 49,3 r/min y la potencia baja a 2,08 kW, menos que los 2,24 kW de hoy. La curva se empina con $D^5$, pero la velocidad que se pide baja tanto que el punto cae de 4,67 a 2,08 kW.', dur: 2.6, ir: function (S, t) { var dt = 0.40 + (0.50 - 0.40) * t; S.ver(dt); S.rot5.setAttribute('opacity', T(t, 0.85, 1)); S.p[2].setAttribute('opacity', T(t, 0.9, 1)); } },
      { texto: 'Las tres turbinas, como en la <a href="#fig-agi-arrastre">figura del arrastre</a>. Joosten midió con un solo bafle parcial; con las dos aletas del caso la cáscara puede pedir más, y eso hay que ensayarlo. Tan lejos de su geometría la correlación es una extrapolación, y la turbina grande seguiría 2,4 m bajo la superficie: el caso toma una segunda turbina cerca de la superficie, con un variador.', dur: 1.8, ir: function (S, t) { S.ver(0.50); S.tHoy.setAttribute('opacity', T(t, 0.4, 0.8)); D.ver(S.lect, 1 - T(t, 0, 0.4)); S.pm.setAttribute('opacity', 1 - T(t, 0, 0.4)); S.vJoo.setAttribute('opacity', 1 - T(t, 0, 0.5)); S.tJoo.setAttribute('opacity', 1 - T(t, 0, 0.5)); D.ver(S.clave, T(t, 0.3, 1)); } }
    ]
  });

  /* Reto: la velocidad con que sube o cae una partícula con Turton y Levenspiel, Zwietering y Joosten. */

  /* ================= 14.7 Gas en el líquido ================= */

  /* El tanque de aireación del ejemplo en el mapa de regímenes de la Rushton, como en la figura del gas: el punto sube
     de 100 a 300 r/min con 1 vvm por la línea punteada, cruza la inundación cerca de 180 y la dispersión completa cerca
     de 278. A 250 r/min, la potencia con gas de Calderbank y el kLa de van't Riet. */
  var AI = { rho: 995.6, Dt: 0.6, D: 0.2, V: 0.16965, Qg: 0.0028274 };
  AI.dt = AI.D / AI.Dt;
  function giFl(rpm) { return AI.Qg / (rpm / 60 * Math.pow(AI.D, 3)); }
  function giFr(rpm) { var N = rpm / 60; return N * N * AI.D / G; }
  AI.nF = 60 * Math.cbrt(AI.Qg * G / (30 * Math.pow(AI.D, 4) * Math.pow(AI.dt, 3.5)));
  AI.nCD = 60 * Math.sqrt(AI.Qg * Math.sqrt(G) / (0.2 * Math.pow(AI.D, 3.5) * Math.sqrt(AI.dt)));
  ZB.animacion('gas', {
    vista: [0, 0, 640, 390],
    alt: 'El mapa de regímenes de una Rushton de D/Dt = 1/3: el número de flujo del gas contra el número de Froude, en ejes logarítmicos, con las rectas de la inundación y de la dispersión completa y la franja gris donde el impulsor casi no actúa. El tanque de aireación del ejemplo, con 1 vvm, sube por una línea punteada al subir la velocidad: a 100 r/min está inundado, cruza la inundación cerca de 180 r/min, a 250 r/min está cargado, con la potencia con gas de 0,46 de la de sin gas y un kLa de 0,027 1/s, y desde 278 r/min dispersa del todo.',
    montar: function (svg) {
      var S = {};
      var E = ejesLog(svg, { x: 70, y: 26, w: 350, h: 290, lx0: Math.log10(0.02), lx1: Math.log10(2), ly0: -2.3, ly1: -0.2, xt: [0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], yt: [0.01, 0.02, 0.05, 0.1, 0.2, 0.5],
        xf: function (v) { return n(v, v < 0.1 ? 2 : (v < 1 ? 1 : 0)); }, yf: function (v) { return n(v, v < 0.1 ? 2 : 1); }, xr: 'Fr = N²D/g', yr: 'Fl_G = Q_g/(ND³)' });
      var X = E.X, Y = E.Y;
      S.X = X; S.Y = Y;
      var zona = s('rect', { x: 70, y: 26, width: X(0.04) - 70, height: 290, fill: K.zona }, null);
      svg.insertBefore(zona, svg.firstChild);
      D.t(svg, 76, 300, 'sin acción', { tam: 11, color: K.tinta2 });
      S.mapa = grupo(svg);
      var fF = function (fr) { return 30 * fr * Math.pow(AI.dt, 3.5); }, fCD = function (fr) { return 0.2 * Math.sqrt(AI.dt) * Math.sqrt(fr); };
      [fF, fCD].forEach(function (f) {
        var pts = [];
        for (var l = Math.log10(0.04); l <= Math.log10(2) + 1e-9; l += 0.02) { var fr = Math.pow(10, l), fl = f(fr); if (Math.log10(fl) >= -2.3 && Math.log10(fl) <= -0.2) pts.push([X(fr), Y(fl)]); }
        camino(S.mapa, pts, { ancho: 1.8 });
      });
      var angF = -Math.atan((290 / 2.1) / (350 / 2)) * 180 / Math.PI, angC = -Math.atan(0.5 * (290 / 2.1) / (350 / 2)) * 180 / Math.PI;
      var xF = X(0.45) - 6, yF = Y(fF(0.45)) - 8, xC = X(0.09), yC = Y(fCD(0.09)) + 16;
      var tF = D.t(S.mapa, xF, yF, 'inundación', { tam: 11.5, ancla: 'end', color: K.tinta2 }); tF.setAttribute('transform', 'rotate(' + angF.toFixed(1) + ' ' + xF.toFixed(1) + ' ' + yF.toFixed(1) + ')');
      var tC = D.t(S.mapa, xC, yC, 'dispersión completa', { tam: 11.5, ancla: 'start', color: K.tinta2 }); tC.setAttribute('transform', 'rotate(' + angC.toFixed(1) + ' ' + xC.toFixed(1) + ' ' + yC.toFixed(1) + ')');
      D.t(S.mapa, X(0.08), Y(0.4), 'inundado', { tam: 12, ancla: 'middle', color: K.tinta2, peso: 600 });
      D.t(S.mapa, X(1.0), Y(0.32), 'cargado', { tam: 12, ancla: 'middle', color: K.tinta2, peso: 600 });
      D.t(S.mapa, X(1.0), Y(0.012), 'disperso', { tam: 12, ancla: 'middle', color: K.tinta2, peso: 600 });
      S.camino = s('path', { d: '', fill: 'none', stroke: AZ, 'stroke-width': 2.2, 'stroke-dasharray': '2 5', 'stroke-linecap': 'round' }, svg);
      S.pto = D.punto(svg, X(giFr(100)), Y(giFl(100)), { r: 6 });
      S.pto.setAttribute('opacity', 0);
      S.tPto = D.t(svg, 0, 0, '', { tam: 12, peso: 700, halo: true });
      var x = 440;
      S.r = [grupo(svg), grupo(svg), grupo(svg), grupo(svg), grupo(svg)];
      lineas(S.r[0], x, 34, ['El tanque', 'D_t = H = 0,6 m; 0,170 m³', 'Rushton de 0,2 m', '1 vvm: Q_g = 2,83 L/s'], { titulo: true });
      lineas(S.r[1], x, 112, ['A 100 r/min', 'Fl_G = 0,21; Fr = 0,057', 'inundado'], { titulo: true, colorT: AZ });
      lineas(S.r[2], x, 112, ['A ' + n(AI.nF, 0) + ' r/min', 'cruza la inundación:', 'cargado'], { titulo: true, colorT: AZ });
      lineas(S.r[3], x, 112, ['A 250 r/min', 'Fl_G = 0,085; Fr = 0,354', 'P = 133 W sin gas', 'P_g/P = 0,46: 61 W', '362 W/m³', 'k_La = 0,027 1/s, 99 h^{−1}'], { titulo: true, colorT: AZ });
      lineas(S.r[4], x, 236, ['Desde ' + n(AI.nCD, 0) + ' r/min', 'dispersión completa', 'a 300: Fl_G = 0,071'], { titulo: true, colorT: AZ });
      S.ir = function (rpm) {
        var pts = []; for (var k = 100; k <= rpm + 1e-9; k += 2) pts.push([X(giFr(k)), Y(giFl(k))]);
        pts.push([X(giFr(rpm)), Y(giFl(rpm))]);
        S.camino.setAttribute('d', dTrazo(pts));
        S.pto.setAttribute('cx', X(giFr(rpm))); S.pto.setAttribute('cy', Y(giFl(rpm))); S.pto.setAttribute('opacity', 1);
        S.tPto.setAttribute('x', X(giFr(rpm)) + 10); S.tPto.setAttribute('y', Y(giFl(rpm)) + 22); S.tPto.setAttribute('text-anchor', 'start');
        D.ponerTexto(S.tPto, n(rpm, 0) + ' r/min');
      };
      return S;
    },
    pasos: [
      { texto: 'El mapa de la <a href="#eq-agi-gas">ecuación de las fronteras del gas</a> con $D/D_t$ = 1/3: la inundación, $\\mathrm{Fl}_G = 30\\,\\mathrm{Fr}\\,(1/3)^{3,5}$, y la dispersión completa, $\\mathrm{Fl}_G = 0,2\\,(1/3)^{0,5}\\,\\mathrm{Fr}^{0,5}$. Con Fr por debajo de unos 0,04 el impulsor casi no actúa sobre el gas. El tanque de aireación del ejemplo recibe 1 vvm: $Q_g$ = 0,170/60 = 2,83 L/s.', dur: 1.8, ir: function (S, t) { D.ver(S.mapa, t); D.ver(S.r[0], T(t, 0.3, 1)); } },
      { texto: 'A 100 r/min, $N$ = 1,67 r/s: $\\mathrm{Fl}_G = 0,00283/(1,67 \\times 0,2^3)$ = 0,21 y $\\mathrm{Fr} = 1,67^2 \\times 0,2/9,81$ = 0,057. El punto queda arriba de la inundación: el gas sube por el eje casi sin tocar las palas.', dur: 1.4, ir: function (S, t) { S.ir(100); S.pto.setAttribute('opacity', t); S.tPto.setAttribute('opacity', t); D.ver(S.r[1], T(t, 0.3, 1)); } },
      { texto: 'Al subir la velocidad con el mismo gas, $\\mathrm{Fl}_G$ baja con $1/N$ y Fr sube con $N^2$, y el punto baja por la línea punteada. Despejando $N$ de la frontera de la inundación, la cruza a ' + n(AI.nF, 0) + ' r/min: desde ahí el impulsor está cargado.', dur: 2, ir: function (S, t) { S.tPto.setAttribute('opacity', 1); S.ir(100 + (AI.nF - 100) * t); D.ver(S.r[1], 1 - T(t, 0, 0.3)); D.ver(S.r[2], T(t, 0.5, 1)); } },
      { texto: 'A 250 r/min, el ejemplo: $\\mathrm{Fl}_G$ = 0,085 y Fr = 0,354, cargado. Sin gas tomaría $5,75 \\times 995,6 \\times 4,17^3 \\times 0,2^5$ = 133 W; con la <a href="#eq-agi-calderbank">correlación de Calderbank</a>, $P_g/P = 0,62 - 1,85 \\times 0,085$ = 0,46: 61 W, 362 W/m³. Con la <a href="#eq-agi-kla">correlación de van\'t Riet</a>, $k_La = 0,026 \\times 362^{0,4} \\times 0,010^{0,5}$ = 0,027 s⁻¹, un orden de magnitud, porque está por debajo de 500 W/m³.', dur: 2, ir: function (S, t) { S.ir(AI.nF + (250 - AI.nF) * t); D.ver(S.r[2], 1 - T(t, 0, 0.3)); D.ver(S.r[3], T(t, 0.5, 1)); } },
      { texto: 'Despejando $N$ de la frontera de la dispersión completa, el impulsor dispersa del todo desde ' + n(AI.nCD, 0) + ' r/min: las burbujas llegan a todo el tanque y vuelven al impulsor. A 300 r/min, $\\mathrm{Fl}_G$ = 0,071. El motor se escoge con la potencia sin gas, por si el aire se corta.', dur: 1.8, ir: function (S, t) { S.ir(250 + 50 * t); D.ver(S.r[4], T(t, 0.5, 1)); } }
    ]
  });

  /* Reto: el número de flujo del gas y el régimen, las velocidades de las fronteras, y la potencia con gas y el kLa. */

  /* ================= 14.8 Gotas ================= */

  /* Las gotas de ciclohexano del ejemplo con las tres correlaciones, y lo que hace doblar la velocidad. */
  ZB.animacion('gotas', {
    vista: [0, 0, 640, 380],
    alt: 'A la izquierda, el tanque de 30 cm con la turbina de seis palas de 10 cm y las gotas de ciclohexano en el agua. A la derecha, el Weber, 780, y el diámetro de Sauter con tres correlaciones: 121 µm con Chen, Middleman y Doulah, 153 µm con McCabe y 132 µm con Gnanasundaram y colaboradores; 26 % de diferencia. Al doblar la velocidad, el Weber sube a 3120 y las gotas bajan a 0,44 de su tamaño: 53 µm, con ocho veces la potencia.',
    montar: function (svg) {
      var S = {};
      var tk = tanque(svg, { cx: 120, yb: 330, esc: 600, Dt: 0.30, alto: 0.38, nivel: 0.30, fondo: 'plano' });
      // los bafles y la turbina de disco
      [-1, 1].forEach(function (sg) { s('rect', { x: Math.min(tk.X(sg * 0.1455), tk.X(sg * 0.1205)), y: tk.Y(0.36), width: 15, height: tk.Y(0.0) - tk.Y(0.36), fill: K.metal, stroke: K.tinta, 'stroke-width': 1 }, svg); });
      s('line', { x1: tk.X(0), x2: tk.X(0), y1: tk.Y(0.1), y2: tk.Y(0.42), stroke: K.tinta, 'stroke-width': 3 }, svg);
      s('rect', { x: tk.X(-0.0375), y: tk.Y(0.1) - 1.5, width: tk.X(0.0375) - tk.X(-0.0375), height: 3, fill: K.metalO }, svg);
      [-1, 1].forEach(function (sg) { s('rect', { x: Math.min(tk.X(sg * 0.025), tk.X(sg * 0.05)), y: tk.Y(0.1) - 6, width: 15, height: 12, fill: K.metalM, stroke: K.tinta, 'stroke-width': 1 }, svg); });
      // gotas, en un patrón fijo
      S.gotas = grupo(svg, 1);
      for (var i = 0; i < 46; i++) {
        var x = -0.105 + ((i * 37) % 100) / 100 * 0.21, z = 0.02 + ((i * 53) % 97) / 97 * 0.26;
        if (Math.abs(z - 0.1) < 0.02 && Math.abs(x) < 0.06) continue;
        s('circle', { cx: tk.X(x), cy: tk.Y(z), r: 3 + (i % 3), fill: GOTA, stroke: PA.materiales.aceite.oscuro, 'stroke-width': 0.8 }, S.gotas);
      }
      S.tk = tk;
      D.t(svg, 120, 360, 'D_t = 30 cm; D = 10 cm; 6 r/s', { tam: 11.5, ancla: 'middle', color: K.tinta2 });
      // las barras de d32
      var bx = 280, bw = 300, M = 180, BX = function (v) { return bx + v / M * bw; };
      D.t(svg, bx, 30, 'We = 997 × 6² × 0,10³/0,046 = 780', { tam: 13, peso: 700, color: AZ });
      S.we = grupo(svg);
      D.t(S.we, bx, 50, 'd_{32} = c_1 (1 + c_2 α_d) We^{−0,6} D', { tam: 12, color: K.tinta2 });
      S.ejes = grupo(svg, 1);
      [0, 50, 100, 150].forEach(function (v) { s('line', { x1: BX(v), x2: BX(v), y1: 70, y2: 300, stroke: K.rejilla, 'stroke-width': 1 }, S.ejes); D.t(S.ejes, BX(v), 316, String(v), { tam: 11.5, ancla: 'middle', color: K.tinta2 }); });
      D.t(S.ejes, bx + bw, 334, 'd_{32}, µm', { tam: 12, peso: 600, ancla: 'end' });
      var f = Math.pow(780, -0.6) * 0.10 * 1e6;
      var B = [['Chen, Middleman y Doulah', 0.053 * 1.24 * f, AZ], ['McCabe', 0.058 * (1 + 5.4 * 0.08) * f, OL], ['Gnanasundaram', 0.052 * Math.exp(0.32) * f, S3], ['al doble de velocidad', 0.053 * 1.24 * f * Math.pow(2, -1.2), AZ]];
      S.b = B.map(function (b, i) {
        var g = grupo(svg), y = 82 + i * 56;
        D.t(g, bx, y, b[0], { tam: 12, peso: 600, color: b[2] });
        var r = barra(g, bx, y + 8, bw, 20, b[2]); r.largo(b[1] / M);
        if (i === 3) r.setAttribute('opacity', 0.55);
        D.t(g, BX(b[1]) + 6, y + 23, n(b[1], 0) + ' µm', { tam: 12, peso: 700 });
        return g;
      });
      return S;
    },
    pasos: [
      { texto: 'El tanque de 30 cm con la turbina de seis palas de 10 cm a 6 r/s; 8 % de ciclohexano en volumen en agua a 25 °C, de 997 kg/m³, con una tensión interfacial de 46 mN/m. El Weber de la <a href="#eq-agi-gota">ecuación del tamaño de las gotas</a>: $997 \\times 6^2 \\times 0,10^3/0,046$ = 780.', dur: 1.6, ir: function (S, t) { D.ver(S.we, t); } },
      { texto: 'Con las constantes de Chen, Middleman y Doulah: $d_{32} = 0,053 \\times (1 + 3 \\times 0,08) \\times 780^{-0,6} \\times 0,10$ m = 121 µm. Es la única de las tres que dice su intervalo, y con ella se calcula.', dur: 1.4, ir: function (S, t) { D.ver(S.b[0], t); } },
      { texto: 'Con las de McCabe: $0,058 \\times (1 + 5,4 \\times 0,08) \\times 780^{-0,6} \\times 0,10$ m = 153 µm.', dur: 1.2, ir: function (S, t) { D.ver(S.b[1], t); } },
      { texto: 'Con la de Gnanasundaram y colaboradores, la <a href="#eq-agi-seader">correlación de Gnanasundaram y colaboradores</a>, por debajo de We = 10 000: $0,052 \\times 780^{-0,6} \\times e^{4 \\times 0,08} \\times 0,10$ m = 132 µm. Las tres difieren en 26 %: con datos del sistema real, las correlaciones sirven para los cambios relativos.', dur: 1.6, ir: function (S, t) { D.ver(S.b[2], t); } },
      { texto: 'Doblar la velocidad, a 12 r/s, sube el Weber a $4 \\times 780$ = 3120, y como $d_{32} \\propto \\mathrm{We}^{-0,6}$, las gotas bajan a $2^{-1,2}$ = 0,44 de su tamaño: 53 µm con Chen, Middleman y Doulah. La potencia sube con $N^3$: ocho veces.', dur: 1.6, ir: function (S, t) { D.ver(S.b[3], t); S.gotas.setAttribute('transform', ''); } }
    ]
  });

  /* Reto: el Weber y el diámetro de Sauter, las tres correlaciones y la velocidad para una gota. */

  /* ================= 14.9 La agitación en una planta de alimentos ================= */

  /* El silo de leche del ejemplo, a escala: 4,0 m de diámetro y 8,0 m de leche, la hélice de entrada lateral cerca del
     fondo con su motor afuera y su lazo; las dos hélices comparadas, el Reynolds, la potencia por volumen y la crema
     que sube a 4 °C en las 7 h de suministro. */
  var SI = { Dt: 4.0, H: 8.0, rho: 1032 };
  SI.V = Math.PI / 4 * SI.Dt * SI.Dt * SI.H;
  SI.h = [[0.5, 300], [0.8, 90]].map(function (h) { var N = h[1] / 60; return { D: h[0], rpm: h[1], P: 0.32 * SI.rho * Math.pow(N, 3) * Math.pow(h[0], 5), Q: 0.5 * N * Math.pow(h[0], 3), u: Math.PI * N * h[0] }; });
  ZB.animacion('silo', {
    vista: [0, 0, 640, 400],
    alt: 'El silo de leche del ejemplo en corte: 4,0 m de diámetro y 8,0 m de leche, 100,5 m³, con la hélice de entrada lateral cerca del fondo, su motor afuera y el lazo que hace la hélice. A la derecha, las dos hélices: la de 0,5 m a 300 r/min toma 1,29 kW, bombea 0,312 m³/s y da una vuelta al silo en 5,4 min con la punta a 7,9 m/s; la de 0,8 m a 90 r/min toma 0,37 kW, bombea 0,384 m³/s y da la vuelta en 4,4 min con la punta a 3,8 m/s. Después el Reynolds, 5 × 10⁵, y la potencia por volumen, 3,6 W/m³. Al final, la crema que sube arriba del silo.',
    montar: function (svg) {
      var S = {};
      var tk = tanque(svg, { cx: 130, yb: 352, esc: 38, Dt: SI.Dt, alto: 8.4, nivel: SI.H, fondo: 'plano' });
      S.tk = tk;
      var X = tk.X, Y = tk.Y;
      s('path', { d: 'M' + X(-2) + ' ' + Y(8.4) + 'L' + X(0) + ' ' + Y(8.7) + 'L' + X(2) + ' ' + Y(8.4), fill: 'none', stroke: K.tinta, 'stroke-width': 2.2 }, svg);
      // la crema que sube (paso 5)
      S.crema = s('rect', { x: X(-2), y: Y(8.0), width: X(2) - X(-2), height: 0, fill: PURE_M }, svg);
      S.tCrema = grupo(svg); D.t(S.tCrema, X(0), Y(8.0) + 17, 'la crema sube', { tam: 11.5, ancla: 'middle', color: K.tinta2 });
      // la hélice de lado, su motor y su lazo
      var zh = 0.45;
      s('rect', { x: X(-2) - 34, y: Y(zh) - 11, width: 24, height: 18, fill: K.metal, stroke: K.tinta, 'stroke-width': 1.3 }, svg);
      s('line', { x1: X(-2) - 10, x2: X(-1.55), y1: Y(zh) - 2, y2: Y(zh) + 4, stroke: K.tinta, 'stroke-width': 2.4 }, svg);
      S.helice = s('ellipse', { cx: X(-1.55), cy: Y(zh) + 4, rx: 3, ry: 10, fill: K.metalM, stroke: K.tinta, 'stroke-width': 1.2, transform: 'rotate(-20 ' + X(-1.55) + ' ' + (Y(zh) + 4) + ')' }, svg);
      S.lazo = grupo(svg);
      flechaLazo(S.lazo, [[X(-1.35), Y(0.4)], [X(0), Y(0.32)], [X(1.25), Y(0.36)], [X(1.58), Y(0.9)], [X(1.62), Y(4)], [X(1.58), Y(6.5)], [X(1.25), Y(7.0)], [X(0), Y(7.08)], [X(-1.25), Y(7.0)], [X(-1.58), Y(6.5)], [X(-1.62), Y(4)], [X(-1.6), Y(1.6)], [X(-1.6), Y(1.3)]], AZ);
      cotaH(svg, X(-2), X(2), 366, 'D_t = 4,0 m', { dy: 18 });
      cotaV(svg, X(2) + 16, Y(8.0), Y(0), '8,0 m', { tam: 12 });
      var x = 270;
      S.r = [grupo(svg), grupo(svg), grupo(svg), grupo(svg), grupo(svg)];
      lineas(S.r[0], x, 34, ['El silo: π/4 × 4,0² × 8,0 = ' + n(SI.V, 1) + ' m³', 'leche de 1032 kg/m³; N_P = 0,32 y N_Q = 0,5'], { titulo: true });
      var h0 = SI.h[0], h1 = SI.h[1];
      lineas(S.r[1], x, 84, ['Hélice de 0,5 m a 300 r/min', 'P = ' + n(h0.P / 1000, 2) + ' kW; Q = 0,312 m³/s', 'una vuelta: ' + n(SI.V / h0.Q, 0) + ' s, ' + n(SI.V / h0.Q / 60, 1) + ' min; punta: ' + n(h0.u, 1) + ' m/s'], { titulo: true, colorT: OL });
      lineas(S.r[2], x, 150, ['Hélice de 0,8 m a 90 r/min', 'P = ' + n(h1.P / 1000, 2) + ' kW; Q = ' + n(h1.Q, 3) + ' m³/s', 'una vuelta: ' + n(SI.V / h1.Q, 0) + ' s, ' + n(SI.V / h1.Q / 60, 1) + ' min; punta: ' + n(h1.u, 1) + ' m/s'], { titulo: true, colorT: AZ });
      lineas(S.r[3], x, 216, ['Re = 1032 × 1,5 × 0,8²/0,002 = 5 × 10⁵', 'P/V = 365/100,5 = 3,6 W/m³: treinta', 'veces menos que la agitación moderada'], { titulo: true });
      lineas(S.r[4], x, 282, ['La crema, a 4 °C', '3 µm: 0,60 mm/h; en 7 h, 4 mm', '10 µm: (10/3)² = 11 veces: 46 mm'], { titulo: true });
      // las barras de la potencia
      S.barras = grupo(svg);
      var bx = 270, bw = 150;
      D.t(S.barras, bx, 352, 'potencia', { tam: 11.5, color: K.tinta2 });
      S.bp0 = barra(S.barras, bx + 64, 342, bw, 12, OL); S.bp1 = barra(S.barras, bx + 64, 358, bw, 12, AZ);
      D.t(S.barras, bx + 64 + bw + 6, 352, '1,29 kW', { tam: 11.5, color: OL, peso: 600 });
      D.t(S.barras, bx + 64 + bw * 0.37 / 1.29 + 6, 368, '0,37 kW', { tam: 11.5, color: AZ, peso: 600 });
      return S;
    },
    pasos: [
      { texto: 'El silo del ejemplo: 4,0 m de diámetro y 8,0 m de leche, $\\pi/4 \\times 4,0^2 \\times 8,0$ = 100,5 m³, con una hélice de entrada lateral cerca del fondo, inclinada hacia abajo y con el motor afuera. La leche, de 1032 kg/m³; la hélice, con el $N_P$ de 0,32 y el $N_Q$ de 0,5 de la <a href="#tbl-agi-np">tabla de las constantes</a>, una aproximación para una hélice de lado y sin bafles.', dur: 1.8, ir: function (S, t) { D.ver(S.r[0], t); D.ver(S.lazo, T(t, 0.4, 1)); } },
      { texto: 'Una hélice de 0,5 m a 300 r/min, $N$ = 5,0 r/s: $P = 0,32 \\times 1032 \\times 5,0^3 \\times 0,5^5$ = 1,29 kW, y $Q = 0,5 \\times 5,0 \\times 0,5^3$ = 0,312 m³/s. El silo pasa entero por ella en $100,5/0,312$ = 322 s, 5,4 min, con la punta a $\\pi N D$ = 7,9 m/s.', dur: 1.6, ir: function (S, t) { D.ver(S.r[1], t); } },
      { texto: 'Una hélice de 0,8 m a 90 r/min, $N$ = 1,5 r/s: $P = 0,32 \\times 1032 \\times 1,5^3 \\times 0,8^5$ = 0,37 kW, y $Q = 0,5 \\times 1,5 \\times 0,8^3$ = 0,384 m³/s: una vuelta en 262 s, 4,4 min, con la punta a 3,8 m/s. Bombea más con menos de un tercio de la potencia: el caudal crece con $D^{4/3}$ a igual potencia.', dur: 1.8, ir: function (S, t) { D.ver(S.r[2], t); D.ver(S.barras, T(t, 0.3, 0.6)); S.bp0.largo(T(t, 0.3, 0.8)); S.bp1.largo(T(t, 0.4, 0.9) * 0.37 / 1.29); } },
      { texto: 'Con 2 mPa·s, la <a href="#eq-agi-re">ecuación del Reynolds del impulsor</a> da $1032 \\times 1,5 \\times 0,8^2/0,002$ = 5 × 10⁵: turbulento, aun con la leche fría diez veces más viscosa. La potencia por volumen, 3,6 W/m³, queda treinta veces por debajo de la agitación moderada: la leche no pide más.', dur: 1.6, ir: function (S, t) { D.ver(S.r[3], t); } },
      { texto: 'Mientras no se agita, la crema sube con la velocidad de Stokes: a 4 °C, un glóbulo de 3 µm sube 0,60 mm/h, y en las 7 h de suministro, 4 mm; uno de 10 µm, $(10/3)^2$ = 11 veces más rápido, 46 mm. Los 5 a 10 min de agitación, una o dos vueltas del silo, bastan para repartirla.', dur: 1.8, ir: function (S, t) { D.ver(S.r[4], t); S.crema.setAttribute('height', 3 * T(t, 0, 0.8)); D.ver(S.tCrema, T(t, 0.4, 1)); } }
    ]
  });

  /* La papilla de manzana del ejemplo en la marmita con el ancla: Metzner y Otto con k_s = 25, el Reynolds con la
     viscosidad aparente, el número de potencia leído en la curva del ancla, la potencia, Skelland y la holgura. */
  var PU = { m: 2.4, n: 0.5, rho: 1200, Dt: 1.2, D: 1.14, N: 0.5, e: 0.03 };
  PU.V = Math.PI / 4 * PU.Dt * PU.Dt * 1.2;
  PU.k = [25, 11].map(function (ks) { var g = ks * PU.N, mu = PU.m * Math.pow(g, PU.n - 1), re = PU.rho * PU.N * PU.D * PU.D / mu, np = logInterp(ANCLA, re); return { ks: ks, g: g, mu: mu, re: re, np: np, P: np * PU.rho * Math.pow(PU.N, 3) * Math.pow(PU.D, 5) }; });
  ZB.animacion('pure', {
    vista: [0, 0, 640, 400],
    alt: 'A la izquierda, la marmita con camisa de 1,2 m con 1,2 m de papilla de manzana a 90 °C y el ancla de 1,14 m que gira a 30 r/min con 30 mm de holgura. A la derecha, el número de potencia del ancla de brazos planos contra el Reynolds, en ejes logarítmicos, por los puntos 5,0 a Re = 100, 1,2 a 1000 y 0,50 a 10⁴. Con Metzner y Otto y k_s = 25, la velocidad de corte es 12,5 1/s, la viscosidad aparente 0,68 Pa·s, el Reynolds 1150, el número de potencia 1,14 y la potencia 329 W. Con el 11 de Skelland, 760, 1,42 y 410 W. En la holgura, 60 1/s y 0,31 Pa·s.',
    montar: function (svg) {
      var S = {};
      var tk = tanque(svg, { cx: 118, yb: 300, esc: 150, Dt: PU.Dt, alto: 1.4, nivel: 1.2, fondo: 'eliptico', liquido: PURE, camisa: true });
      var X = tk.X, Y = tk.Y;
      // el ancla: un brazo en U a 30 mm de la pared y del fondo, con el eje
      var ra = PU.D / 2, hf = tk.hf;
      var dA = 'M' + X(-ra) + ' ' + Y(1.05) + 'V' + Y(hf + 0.02) + 'A' + (ra * 150) + ' ' + ((hf - 0.03) * 150) + ' 0 0 0 ' + X(ra) + ' ' + Y(hf + 0.02) + 'V' + Y(1.05);
      s('path', { d: dA, fill: 'none', stroke: K.metalO, 'stroke-width': 6, 'stroke-linejoin': 'round' }, svg);
      s('path', { d: dA, fill: 'none', stroke: K.metalM, 'stroke-width': 3.6, 'stroke-linejoin': 'round' }, svg);
      s('line', { x1: X(-ra), x2: X(ra), y1: Y(1.05), y2: Y(1.05), stroke: K.metalO, 'stroke-width': 4 }, svg);
      s('line', { x1: X(0), x2: X(0), y1: Y(1.05), y2: Y(1.4) - 30, stroke: K.tinta, 'stroke-width': 3 }, svg);
      s('rect', { x: X(0) - 12, y: Y(1.4) - 50, width: 24, height: 22, rx: 3, fill: K.metal, stroke: K.tinta, 'stroke-width': 1.3 }, svg);
      S.holgura = grupo(svg);
      s('rect', { x: X(PU.Dt / 2) - 8, y: Y(1.0), width: 8, height: Y(0.45) - Y(1.0), fill: CALOR, opacity: 0.55 }, S.holgura);
      D.t(S.holgura, X(PU.Dt / 2) + 12, Y(0.75), '30 mm', { tam: 11.5, peso: 600, color: S3 });
      D.t(svg, X(0), 334, 'D_t = 1,2 m; ancla de 1,14 m; 30 r/min', { tam: 11.5, ancla: 'middle', color: K.tinta2 });
      D.t(svg, X(0), 352, 'm = 2,4 Pa·sⁿ; n = 0,5; 1200 kg/m³', { tam: 11.5, ancla: 'middle', color: K.tinta2 });
      // la curva del ancla
      var E = ejesLog(svg, { x: 300, y: 26, w: 300, h: 190, lx0: 2, lx1: 4, ly0: Math.log10(0.4), ly1: Math.log10(6), xt: [100, 300, 1000, 3000, 1e4], yt: [0.5, 1, 2, 5],
        xf: function (v) { return v >= 1e4 ? '10^{4}' : n(v, 0); }, yf: function (v) { return n(v, v < 1 ? 1 : 0); }, xr: 'Re del impulsor', yr: 'N_P, ancla' });
      S.X = E.X; S.Y = E.Y;
      var pts = []; for (var l = 2; l <= 4.0001; l += 0.02) { var re = Math.pow(10, l); pts.push([E.X(re), E.Y(logInterp(ANCLA, re))]); }
      S.curva = D.trazo(svg, dTrazo(pts), { color: K.tinta, ancho: 2.2 });
      S.puntosA = grupo(svg);
      ANCLA.forEach(function (p) { s('circle', { cx: E.X(p[0]), cy: E.Y(p[1]), r: 3.5, fill: K.tinta }, S.puntosA); });
      S.p25 = grupo(svg); S.p11 = grupo(svg);
      [[S.p25, PU.k[0], AZ, 'k_s = 25'], [S.p11, PU.k[1], OL, 'k_s = 11']].forEach(function (f, i) {
        var q = f[1];
        s('line', { x1: E.X(q.re), x2: E.X(q.re), y1: 216, y2: E.Y(q.np), stroke: f[2], 'stroke-width': 1.2, 'stroke-dasharray': '4 3' }, f[0]);
        s('line', { x1: 300, x2: E.X(q.re), y1: E.Y(q.np), y2: E.Y(q.np), stroke: f[2], 'stroke-width': 1.2, 'stroke-dasharray': '4 3' }, f[0]);
        D.punto(f[0], E.X(q.re), E.Y(q.np), { r: 5.5, color: i ? K.blanco : K.caso });
        D.t(f[0], E.X(q.re) + 8, E.Y(q.np) - 8, f[3] + ': ' + n(q.np, 2), { tam: 11.5, peso: 700, color: f[2], halo: true });
      });
      S.reLinea = s('line', { x1: E.X(PU.k[0].re), x2: E.X(PU.k[0].re), y1: 216, y2: 26, stroke: AZ, 'stroke-width': 1.2, 'stroke-dasharray': '4 3', opacity: 0 }, svg);
      var x = 300, a = PU.k[0], b = PU.k[1];
      S.r = [grupo(svg), grupo(svg), grupo(svg), grupo(svg), grupo(svg)];
      D.t(S.r[0], x, 274, 'k_s = 25: corte medio de ' + n(a.g, 1) + ' 1/s; μ_{ap} = ' + n(a.mu, 2) + ' Pa·s', { tam: 12, peso: 600, color: AZ });
      D.t(S.r[1], x, 292, 'Re = 1200 × 0,5 × 1,14²/0,68 = ' + n(Math.round(a.re / 10) * 10, 0) + ': transición', { tam: 12, peso: 600, color: AZ });
      D.t(S.r[2], x, 310, 'N_P = ' + n(a.np, 2) + ': P = ' + n(a.P, 0) + ' W, ' + n(a.P / PU.V, 0) + ' W/m³', { tam: 12, peso: 700, color: AZ });
      D.t(S.r[3], x, 334, 'k_s = 11: corte medio de 5,5 1/s; μ_{ap} = ' + n(b.mu, 2) + ' Pa·s', { tam: 12, peso: 600, color: OL });
      D.t(S.r[3], x, 352, 'Re = ' + n(Math.round(b.re / 10) * 10, 0) + '; N_P = ' + n(b.np, 2) + '; P = ' + n(b.P, 0) + ' W', { tam: 12, peso: 700, color: OL });
      lineas(S.r[4], 20, 378, ['En la holgura de 30 mm', 'πND/e = ' + n(Math.PI * PU.N * PU.D / PU.e, 0) + ' 1/s; μ = 2,4 × 60^{−0,5} = 0,31 Pa·s; la capa se renueva cada 1/(2N) = 1 s'], { titulo: true, colorT: S3, salto: 16 });
      return S;
    },
    pasos: [
      { texto: 'La marmita del ejemplo: 1,2 m de diámetro con 1,2 m de papilla de manzana a 90 °C, 1,36 m³, y un ancla de 1,14 m, 95 % del tanque, con 30 mm entre sus brazos y la pared, a 30 r/min, $N$ = 0,5 r/s. La papilla, de 1200 kg/m³, sigue la ley de potencia con $m$ = 2,4 Pa·sⁿ y $n$ = 0,5: no tiene una sola viscosidad.', dur: 1.6, ir: function (S, t) { S.curva.dibujar(0); } },
      { texto: 'Metzner y Otto, con la <a href="#eq-agi-metzner">ecuación de Metzner y Otto</a> y el 25 del ancla: la velocidad de corte media es $\\dot\\gamma = 25 \\times 0,5$ = 12,5 s⁻¹, y la viscosidad aparente, $\\mu_{ap} = 2,4 \\times 12,5^{-0,5}$ = 0,68 Pa·s.', dur: 1.4, ir: function (S, t) { D.ver(S.r[0], t); } },
      { texto: 'El Reynolds con esa viscosidad, con la <a href="#eq-agi-re">ecuación del Reynolds del impulsor</a>: $1200 \\times 0,5 \\times 1,14^2/0,68$ = 1150, en la transición, donde Metzner y Otto todavía valen para un ancla.', dur: 1.4, ir: function (S, t) { D.ver(S.r[1], t); S.reLinea.setAttribute('opacity', T(t, 0.3, 1)); } },
      { texto: 'El número de potencia del ancla de brazos planos con una holgura de 2,75 % del tanque: unos 5,0 a Re = 100, 1,2 a 1000 y 0,50 a 10⁴, leído entre esos puntos en ejes logarítmicos. A Re = 1150 da 1,14.', dur: 1.8, ir: function (S, t) { S.curva.dibujar(T(t, 0, 0.6)); D.ver(S.puntosA, T(t, 0, 0.4)); S.reLinea.setAttribute('opacity', 1 - T(t, 0.5, 0.8)); D.ver(S.p25, T(t, 0.6, 1)); } },
      { texto: 'La potencia, con la <a href="#eq-agi-np">ecuación del número de potencia</a>: $P = 1,14 \\times 1200 \\times 0,5^3 \\times 1,14^5$ = 329 W, 242 W/m³.', dur: 1.2, ir: function (S, t) { S.curva.dibujar(1); D.ver(S.r[2], t); } },
      { texto: 'Con el 11 de Skelland, la velocidad de corte baja a 5,5 s⁻¹, la viscosidad sube a 1,02 Pa·s, el Reynolds baja a 760, el número de potencia sube a 1,42 y la potencia a 410 W: un cuarto más, por una constante en la que las fuentes no coinciden. El motor se escoge para esos 410 W.', dur: 1.8, ir: function (S, t) { S.curva.dibujar(1); D.ver(S.p11, T(t, 0, 0.6)); D.ver(S.r[3], T(t, 0.4, 1)); } },
      { texto: 'En la holgura de 30 mm, la velocidad de corte es más o menos la de la punta entre la holgura: $\\pi N D/e = \\pi \\times 0,5 \\times 1,14/0,030$ = 60 s⁻¹, cinco veces la media, y ahí la papilla se adelgaza a $2,4 \\times 60^{-0,5}$ = 0,31 Pa·s. Los dos brazos renuevan esa capa contra la camisa cada $1/(2N)$ = 1 s: es lo que evita que se queme.', dur: 1.8, ir: function (S, t) { S.curva.dibujar(1); D.ver(S.holgura, T(t, 0, 0.5)); D.ver(S.r[4], T(t, 0.3, 1)); } }
    ]
  });

  /* Reto: el silo con una hélice de lado, el tanque de mezcla de jugo y la papilla con el ancla. */
})();

/* Las animaciones y los retos del capítulo 15, «Mezclado y escalado de tanques agitados». Se escriben aquí directo (en
   bombas pasan por el taller interactivo/). Usan el motor de figuras/comun/actividades.js y las piezas de
   figuras/comun/dibujo.js; los colores salen de la paleta del libro (ZB.dib.col y PALETA), nunca a mano.
   Los números salen del texto del capítulo y del modelo del caso (caso.json y datos.js, que escribe
   herramientas/mezclado.py): el reactor vidriado de 2,5 m con 3,0 m de líquido desde el punto más bajo del fondo
   elíptico, 13,7 m³, la turbina de cuatro palas inclinadas de 0,83 m a 0,625 m del fondo y a 100 r/min con N_P = 1,27,
   las dos aletas y la segunda turbina del capítulo 14, el agua a 85 °C (968,6 kg/m³ y 0,333 mPa·s), el piloto de
   0,5 m, la camisa de vapor a 2,00 bara, la línea de 2½ in a 25 m³/h, la marmita de papilla y la leche de su ejemplo.
   La animación «estrias» reemplaza al video de Manim (escenas/libro/estrias_estatico.py del público) con sus pasos y
   sus números, con el modelo de herramientas/figura-estrias.py, y su último paso se ve como la figura de las estrías.
   Un color hace un solo trabajo dentro de cada animación: el caso y el modelo en azul (la primera serie de las
   gráficas); lo que se compara en oliva (la segunda) y en naranja (la tercera); el punto que se lee, en amarillo; lo que
   se pasa de un límite, en el rojo de alerta; el agua, el ácido, el vapor y la leche con su material. */
(function () {
  'use strict';
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, T = ZB.tramo;
  var PA = window.PALETA, MAT = PA.materiales, GR = PA.graficas, CO = PA.cortes;
  var AGUA = CO.liquido, AGUA_M = CO['liquido-hondo'];
  var ACIDO = MAT.acido.medio, ACIDO_R = MAT.acido.relleno, AGUA_E = MAT.agua.medio;
  var VIDRIO = MAT.vidrio.oscuro, LECHE = MAT.gas.relleno, GRASA = MAT.aceite.medio;
  var AZ = K.serie[0], OL = K.serie[1], S3 = K.serie[2], S4 = K.serie[3], AL = K.alerta;
  var G = 9.81;

  /* ---------- El caso (datos.js y caso.json) ---------- */
  var A = window.MEZCLADO || { tanque: { T: 2.5, H: 3.0, D: 0.83, C: 0.625, V: 13.7036, Po: 1.27 }, agua85: { rho: 968.6, mu: 3.3307e-4 } };
  var DT = A.tanque.T, HL = A.tanque.H, DI = A.tanque.D, CI = A.tanque.C, VOL = A.tanque.V, NP = A.tanque.Po;
  var RHO = A.agua85.rho, MU = A.agua85.mu, NU = MU / RHO, RHO_S = 950;
  var RPM = 100, N0 = RPM / 60;

  /* ---------- Las ecuaciones del capítulo ---------- */
  function pot(np, rho, rpm, d) { return np * rho * Math.pow(rpm / 60, 3) * Math.pow(d, 5); }      // W, ec. agi-p
  function grenville(nrps, d, dt, h, mu, rho, np) {                                                 // ec. mez-grenville y mez-transicion
    np = np || NP; rho = rho || RHO; mu = mu || MU;
    var re = rho * nrps * d * d / mu, x = Math.pow(np, 1 / 3) * re, th;
    if (x > 6370) th = 5.20 * Math.pow(dt, 1.5) * Math.sqrt(h) / (Math.pow(np, 1 / 3) * nrps * d * d);
    else th = rho * Math.pow(dt, 1.5) * Math.sqrt(h) / (mu * Math.pow(x / 183, 2));
    return { th: th, re: re, x: x, turb: x > 6370 };
  }
  function grado(t95, z) { return t95 * Math.log((100 - z) / 100) / Math.log(0.05); }               // ec. mez-grado
  function cov0(a) { return Math.sqrt((1 - a) / a); }                                               // ec. mez-cov0
  function joostenN(d) { var fr = 0.036 * Math.pow(DI / DT, -3.65) * Math.pow((RHO - RHO_S) / RHO, 0.42); return Math.sqrt(fr * G / d); } // r/s, ec. agi-joosten
  function colebrook(re, er) { var f = 0.02; for (var i = 0; i < 40; i++) f = Math.pow(-2 * Math.log10(er / 3.7 + 2.51 / (re * Math.sqrt(f))), -2); return f; }

  /* ---------- Piezas ---------- */
  function grupo(padre, op) { return s('g', { opacity: op == null ? 0 : op }, padre); }
  function dTrazo(pts) { return pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(''); }
  function lineas(padre, x, y, filas, o) {
    o = o || {};
    filas.forEach(function (f, i) { D.t(padre, x, y + i * (o.salto || 17), f, { tam: o.tam || 12, peso: i === 0 && o.titulo ? 700 : (o.peso || 500), ancla: o.ancla || 'start', color: i === 0 && o.titulo ? (o.colorT || K.tinta) : (o.color || K.tinta2) }); });
  }
  function rotado(padre, x, y, txt, o) {
    o = o || {};
    var t = s('text', { x: x, y: y, 'font-size': o.tam || 12, 'font-weight': o.peso || 600, 'text-anchor': 'middle', fill: o.color || K.tinta, transform: 'rotate(-90 ' + x + ' ' + y + ')' }, padre);
    D.ponerTexto(t, txt);
    return t;
  }
  function flechaH(padre, x1, x2, y, txt, o) {      // cota con dos puntas y su rótulo encima
    o = o || {};
    var g = s('g', {}, padre), c = o.color || K.tinta2;
    s('line', { x1: x1 + 6, x2: x2 - 6, y1: y, y2: y, stroke: c, 'stroke-width': 1.2 }, g);
    s('path', { d: 'M' + x1 + ' ' + y + 'l7 -3.5v7zM' + x2 + ' ' + y + 'l-7 -3.5v7z', fill: c }, g);
    if (txt) D.t(g, (x1 + x2) / 2, y - 7, txt, { tam: o.tam || 12, ancla: 'middle', color: c, peso: 600 });
    return g;
  }
  // Un tanque cortado por el plano del eje: o = { cx, yb (punto más bajo), esc (px/m), Dt, alto (pared recta, m), nivel, tapa, camisa }
  function tanque(padre, o) {
    var g = s('g', {}, padre), e = o.esc, R = o.Dt / 2 * e, cx = o.cx, yb = o.yb, hf = o.plano ? 0 : o.Dt / 4;
    var X = function (r) { return cx + r * e; }, Y = function (z) { return yb - z * e; };
    function contorno(zTop) {
      return o.plano ? 'M' + X(-o.Dt / 2) + ' ' + Y(zTop) + 'V' + yb + 'H' + X(o.Dt / 2) + 'V' + Y(zTop)
        : 'M' + X(-o.Dt / 2) + ' ' + Y(zTop) + 'V' + Y(hf) + 'A' + R + ' ' + (hf * e) + ' 0 0 0 ' + X(o.Dt / 2) + ' ' + Y(hf) + 'V' + Y(zTop);
    }
    if (o.camisa) s('path', { d: 'M' + (X(-o.Dt / 2) - 7) + ' ' + Y(o.alto * 0.95) + 'V' + Y(hf + 0.03) + 'M' + (X(o.Dt / 2) + 7) + ' ' + Y(o.alto * 0.95) + 'V' + Y(hf + 0.03), stroke: K.tinta2, 'stroke-width': 1.6, fill: 'none' }, g);
    var liq = s('path', { d: contorno(o.nivel) + 'Z', fill: o.liquido || AGUA }, g);
    s('path', { d: contorno(o.alto), fill: 'none', stroke: K.tinta, 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, g);
    if (o.tapa) s('path', { d: 'M' + X(-o.Dt / 2) + ' ' + Y(o.alto) + 'A' + R + ' ' + (o.Dt / 4 * e) + ' 0 0 1 ' + X(o.Dt / 2) + ' ' + Y(o.alto), fill: 'none', stroke: K.tinta, 'stroke-width': 2.2 }, g);
    s('line', { x1: X(-o.Dt / 2), x2: X(o.Dt / 2), y1: Y(o.nivel), y2: Y(o.nivel), stroke: AGUA_M, 'stroke-width': 1.6 }, g);
    return { g: g, X: X, Y: Y, liq: liq, hf: hf };
  }
  // La turbina de palas inclinadas vista de lado.
  function turbina(padre, tk, z, d, o) {
    o = o || {};
    var g = s('g', { opacity: o.op == null ? 1 : o.op }, padre), X = tk.X, Y = tk.Y, w = d / 5 * 0.71, col = o.color || K.metalM;
    [-1, 1].forEach(function (sg) {
      s('path', { d: dTrazo([[X(sg * 0.04 * d / 0.83), Y(z + w / 2)], [X(sg * d / 2), Y(z + w / 2)], [X(sg * d / 2), Y(z - w / 2)], [X(sg * 0.04 * d / 0.83), Y(z - w / 2)]]) + 'Z', fill: col, stroke: K.tinta, 'stroke-width': 1.2 }, g);
    });
    s('path', { d: dTrazo([[X(-0.16 * d), Y(z + w / 2)], [X(0.0), Y(z + w / 2)], [X(0.16 * d), Y(z - w / 2)], [X(0.0), Y(z - w / 2)]]) + 'Z', fill: K.metal, stroke: K.tinta, 'stroke-width': 1.2 }, g);
    return g;
  }
  // Las dos aletas del caso: un tubo cerrado colgado de la tapa y una aleta hacia la pared en su parte de abajo.
  function aletas(padre, tk, zTop) {
    var g = s('g', {}, padre), X = tk.X, Y = tk.Y, sep = 0.015 * DT;
    [-1, 1].forEach(function (sg) {
      var rw = DT / 2 - sep, rf = rw - 0.17, rp = rf - 0.08;
      s('rect', { x: Math.min(X(sg * rf), X(sg * rp)), y: Y(zTop), width: Math.abs(X(sg * rf) - X(sg * rp)), height: Y(0.42) - Y(zTop), fill: K.metal, stroke: K.tinta, 'stroke-width': 1.1 }, g);
      s('rect', { x: Math.min(X(sg * rw), X(sg * rf)), y: Y(2.3), width: Math.abs(X(sg * rw) - X(sg * rf)), height: Y(0.42) - Y(2.3), fill: K.metalM, stroke: K.tinta, 'stroke-width': 1.1 }, g);
    });
    return g;
  }
  function accionamiento(padre, tk, zEje0, zTapa) {
    var g = s('g', {}, padre), X = tk.X, Y = tk.Y;
    s('line', { x1: X(0), x2: X(0), y1: Y(zEje0), y2: Y(zTapa) - 14, stroke: K.tinta, 'stroke-width': 3 }, g);
    s('rect', { x: X(0) - 12, y: Y(zTapa) - 32, width: 24, height: 18, fill: K.metalM, stroke: K.tinta, 'stroke-width': 1.2 }, g);
    s('rect', { x: X(0) - 9, y: Y(zTapa) - 52, width: 18, height: 20, rx: 3, fill: K.metal, stroke: K.tinta, 'stroke-width': 1.2 }, g);
    return g;
  }
  // Ejes logarítmicos y lineales con sus marcas.
  function ejesLog(padre, o) {
    var g = s('g', {}, padre);
    var X = function (v) { return o.x + (Math.log10(v) - o.lx0) / (o.lx1 - o.lx0) * o.w; };
    var Y = function (v) { return o.y + o.h - (Math.log10(v) - o.ly0) / (o.ly1 - o.ly0) * o.h; };
    (o.yt || []).forEach(function (v) {
      s('line', { x1: o.x, x2: o.x + o.w, y1: Y(v), y2: Y(v), stroke: K.rejilla, 'stroke-width': 1 }, g);
      D.t(g, o.x - 6, Y(v) + 4, o.yf ? o.yf(v) : String(v), { tam: 12, ancla: 'end', color: K.tinta2 });
    });
    (o.xt || []).forEach(function (v) {
      s('line', { x1: X(v), x2: X(v), y1: o.y, y2: o.y + o.h, stroke: K.rejilla, 'stroke-width': 1 }, g);
      D.t(g, X(v), o.y + o.h + 16, o.xf ? o.xf(v) : String(v), { tam: 12, ancla: 'middle', color: K.tinta2 });
    });
    s('path', { d: 'M' + o.x + ' ' + o.y + 'V' + (o.y + o.h) + 'H' + (o.x + o.w), fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, g);
    if (o.xr) D.t(g, o.x + o.w, o.y + o.h + 34, o.xr, { tam: 12, peso: 600, ancla: 'end' });
    if (o.yr) D.t(g, o.x - 4, o.y - 10, o.yr, { tam: 12, peso: 600, ancla: 'start' });
    return { g: g, X: X, Y: Y };
  }
  function ejeLog1(padre, o) {      // un eje logarítmico horizontal solo, con su título y sus marcas
    var g = s('g', {}, padre), X = function (v) { return o.x0 + (Math.log10(v) - o.l0) / (o.l1 - o.l0) * (o.x1 - o.x0); };
    s('line', { x1: o.x0, x2: o.x1, y1: o.y, y2: o.y, stroke: K.tinta2, 'stroke-width': 1.4 }, g);
    o.marcas.forEach(function (m) {
      s('line', { x1: X(m[0]), x2: X(m[0]), y1: o.y - 4, y2: o.y + 4, stroke: K.tinta2, 'stroke-width': 1.2 }, g);
      D.t(g, X(m[0]), o.y + 18, m[1], { tam: 12, ancla: 'middle', color: K.tinta2 });
    });
    D.t(g, o.x0, o.y - 60, o.titulo, { tam: 13, peso: 700 });
    return { g: g, X: X };
  }
  function marca(padre, x, y, txt, o) {   // un punto sobre un eje, con su rótulo arriba
    o = o || {};
    var g = grupo(padre);
    s('line', { x1: x, x2: x, y1: y, y2: y - (o.alto || 14), stroke: o.color || AZ, 'stroke-width': 1.4 }, g);
    D.punto(g, x, y, { r: 5.5, color: o.relleno || K.caso });
    D.t(g, x + (o.dx || 0), y - (o.alto || 14) - 5, txt, { tam: 12, peso: 600, ancla: o.ancla || 'middle', color: o.color || AZ, halo: K.papel });
    return g;
  }
  function seg(t) { return t < 100 ? n(t, 1) + ' s' : n(t, 0) + ' s'; }

  /* ================= 15.2 Mezclar un líquido ================= */

  /* Las escalas de la tabla del capítulo en dos ejes logarítmicos: las longitudes, del tanque a Batchelor, y los
     tiempos, del engullimiento a la mezcla del tanque. */
  var ESC = (function () {
    var p = pot(NP, RHO, RPM, DI), eps = p / (RHO * VOL);
    var q1 = 0.87 * N0 * Math.pow(DI, 3), q2 = 0.75 * N0 * Math.pow(DI, 3);
    return { P: p, eps: eps, lk: Math.pow(NU * NU * NU / eps, 0.25), lb: Math.pow(NU * 4e-18 / eps, 0.25), eng: 17 * Math.sqrt(NU / eps),
      v1: VOL / q1, v2: VOL / q2, t95: grenville(N0, DI, DT, HL).th };
  })();
  ZB.animacion('escalas', {
    vista: [0, 0, 640, 400],
    alt: 'Dos ejes logarítmicos con las escalas del reactor del caso a 100 r/min. Arriba, las longitudes, de una micra a diez metros: el tanque de 2,5 m; la escala de Kolmogorov, 22 µm, el tamaño de los remolinos más pequeños; y la de Batchelor, 1,7 µm, la de las láminas más finas antes de que la difusión las borre, con las bandas de la macromezcla, la mesomezcla y la micromezcla. Abajo, los tiempos, de un milisegundo a cien segundos: el engullimiento, 24 ms; una vuelta del tanque, 17 a 19 s; y el tiempo de mezcla, 28,6 s, mil veces el engullimiento.',
    montar: function (svg) {
      var S = {};
      var L = ejeLog1(svg, { x0: 60, x1: 600, y: 118, l0: -6, l1: 1, titulo: 'Longitudes',
        marcas: [[1e-6, '1 µm'], [1e-5, '10 µm'], [1e-4, '0,1 mm'], [1e-3, '1 mm'], [1e-2, '1 cm'], [0.1, '0,1 m'], [1, '1 m'], [10, '10 m']] });
      var Tm = ejeLog1(svg, { x0: 60, x1: 600, y: 300, l0: -3, l1: 2, titulo: 'Tiempos',
        marcas: [[1e-3, '1 ms'], [1e-2, '10 ms'], [0.1, '0,1 s'], [1, '1 s'], [10, '10 s'], [100, '100 s']] });
      S.L = L; S.Tm = Tm;
      // las bandas de la mezcla, debajo de las marcas del eje
      function banda(a, b, txt, col) {
        var g = grupo(svg);
        s('rect', { x: L.X(a) + 1.5, y: 146, width: L.X(b) - L.X(a) - 3, height: 10, fill: col }, g);
        D.t(g, (L.X(a) + L.X(b)) / 2, 174, txt, { tam: 12, ancla: 'middle', color: K.tinta2, peso: 600 });
        return g;
      }
      S.bMacro = banda(1e-3, DT, 'macromezcla', AGUA_M);
      S.bMeso = banda(1e-4, 1e-3, 'meso', K.borde);
      S.bMicro = banda(1e-6, 5e-5, 'micromezcla', ACIDO_R);
      S.tq = marca(svg, L.X(DT), 118, 'D_t = 2,5 m', { ancla: 'end', dx: 4, color: K.tinta, relleno: K.blanco });
      S.lk = marca(svg, L.X(ESC.lk), 118, 'λ_K = ' + n(ESC.lk * 1e6, 0) + ' µm', { ancla: 'start', dx: -4 });
      S.lb = marca(svg, L.X(ESC.lb), 118, 'λ_B = ' + n(ESC.lb * 1e6, 1) + ' µm', { ancla: 'start', dx: -4, alto: 34 });
      S.eng = marca(svg, Tm.X(ESC.eng), 300, 'engullimiento: ' + n(ESC.eng * 1000, 0) + ' ms', { ancla: 'middle' });
      S.vu = grupo(svg);
      s('rect', { x: Tm.X(ESC.v1), y: 292, width: Tm.X(ESC.v2) - Tm.X(ESC.v1), height: 16, fill: OL, opacity: 0.55 }, S.vu);
      D.t(S.vu, Tm.X(ESC.v1) - 6, 286, 'una vuelta: ' + n(ESC.v1, 0) + ' a ' + n(ESC.v2, 0) + ' s', { tam: 12, peso: 600, ancla: 'end', color: OL, halo: K.papel });
      S.t95 = marca(svg, Tm.X(ESC.t95), 300, 't_{95} = ' + n(ESC.t95, 1) + ' s', { ancla: 'start', dx: -6, alto: 36 });
      S.mil = grupo(svg);
      var ya = 352;
      s('line', { x1: Tm.X(ESC.eng), x2: Tm.X(ESC.t95), y1: ya, y2: ya, stroke: AL, 'stroke-width': 1.4 }, S.mil);
      s('path', { d: 'M' + Tm.X(ESC.eng) + ' ' + ya + 'l7 -3.5v7zM' + Tm.X(ESC.t95) + ' ' + ya + 'l-7 -3.5v7z', fill: AL }, S.mil);
      D.t(S.mil, (Tm.X(ESC.eng) + Tm.X(ESC.t95)) / 2, ya + 18, 'unas mil veces: la micromezcla no limita la extracción', { tam: 12, peso: 600, ancla: 'middle', color: AL });
      S.dat = grupo(svg);
      D.t(S.dat, 600, 30, 'ε = P/(ρV) = ' + n(ESC.eps, 3) + ' W/kg', { tam: 12, ancla: 'end', color: K.tinta2 });
      D.t(S.dat, 600, 47, 'ν = μ/ρ = 3,44 × 10^{−7} m²/s', { tam: 12, ancla: 'end', color: K.tinta2 });
      return S;
    },
    pasos: [
      { texto: 'La potencia de una turbina, $P = N_P \\rho N^3 D^5$ = 2243 W, repartida en la masa del lote: $\\varepsilon = P/(\\rho V) = 2243/(968,6 \\times 13,7)$ = 0,169 W/kg. La viscosidad cinemática del agua a 85 °C es $\\nu = \\mu/\\rho = 3,33 \\times 10^{-4}/968,6$ = 3,44 × 10⁻⁷ m²/s. El tanque mide 2,5 m.', dur: 1.8, ir: function (S, t) { D.ver(S.dat, t); D.ver(S.tq, T(t, 0.3, 1)); } },
      { texto: 'Los remolinos más pequeños miden lo que da la escala de Kolmogorov, $\\lambda_K = (\\nu^3/\\varepsilon)^{1/4} = ((3,44 \\times 10^{-7})^3/0,169)^{1/4}$ = 22 µm. Del tanque hasta los milímetros trabaja la macromezcla; hasta las décimas de milímetro, la mesomezcla.', dur: 1.8, ir: function (S, t) { D.ver(S.lk, t); D.ver(S.bMacro, T(t, 0.3, 0.8)); D.ver(S.bMeso, T(t, 0.5, 1)); } },
      { texto: 'Las láminas más finas antes de que la difusión las borre miden lo que da la escala de Batchelor, $\\lambda_B = (\\nu D_{AB}^2/\\varepsilon)^{1/4}$, con la $D_{AB}$ = 2 × 10⁻⁹ m²/s de un ion en agua fría: 1,7 µm. De decenas de micras para abajo trabaja la micromezcla.', dur: 1.8, ir: function (S, t) { D.ver(S.lb, t); D.ver(S.bMicro, T(t, 0.4, 1)); } },
      { texto: 'Los tiempos. Los remolinos pequeños engullen el líquido de alrededor en $17\\,(\\nu/\\varepsilon)^{1/2} = 17 \\times (3,44 \\times 10^{-7}/0,169)^{1/2}$ = 24 ms.', dur: 1.4, ir: function (S, t) { D.ver(S.eng, t); } },
      { texto: 'Una vuelta del tanque es $V/Q$, con el caudal de la turbina, $Q = N_Q N D^3$, y $N_Q$ de 0,75 a 0,87 (capítulo 14): $13,7/(0,87 \\times 1,667 \\times 0,83^3)$ = 17 s y $13,7/(0,75 \\times 1,667 \\times 0,83^3)$ = 19 s.', dur: 1.6, ir: function (S, t) { D.ver(S.vu, t); } },
      { texto: 'El tiempo de mezcla del tanque, con la <a href="#eq-mez-grenville">correlación de Grenville</a>, es $t_{95}$ = 28,6 s: unas mil veces el engullimiento. La micromezcla solo decidiría con una reacción tan rápida como ella, y la hidrólisis que libera la pectina tarda mucho más que medio minuto.', dur: 2, ir: function (S, t) { D.ver(S.t95, T(t, 0, 0.5)); D.ver(S.mil, T(t, 0.4, 1)); } }
    ]
  });

  /* Reto: la potencia por masa, Kolmogorov y Batchelor, el engullimiento y una vuelta del tanque. */

  /* ================= 15.3 Cómo se mide una mezcla ================= */

  /* La señal normalizada de tres sondas contra el tiempo, con la envolvente exponencial de primer orden y las franjas
     de ±5 % y ±1 %: t95 = 28,6 s, t99 = 44,0 s, y de 22 en 22 s por cada década de lo que falta. */
  var GD = { x0: 70, x1: 600, y0: 40, y1: 330, tmax: 70, t95: ESC.t95 };
  GD.k = Math.log(20) / GD.t95;
  GD.X = function (t) { return GD.x0 + t / GD.tmax * (GD.x1 - GD.x0); };
  GD.Y = function (v) { return GD.y1 - v / 2 * (GD.y1 - GD.y0); };
  var SONDAS = [{ a: 1.0, w: 0.33, f: Math.PI, col: AZ }, { a: 0.75, w: 0.33, f: 1.9, col: OL }, { a: 0.9, w: 0.33, f: 0.3, col: S3 }];
  function senal(sd, t) { return t <= 0 ? 0 : 1 + sd.a * Math.exp(-GD.k * t) * Math.cos(sd.w * t + sd.f); }
  ZB.animacion('grado', {
    vista: [0, 0, 640, 380],
    alt: 'La señal normalizada de tres sondas de conductividad contra el tiempo, de 0 a 70 s, después de echar un trazador. Las tres oscilan alrededor de su valor final, 1, dentro de una envolvente que decae como una exponencial de primer orden. Entran a la franja de más o menos 5 % a los 28,6 s, el tiempo de mezcla, y a la de más o menos 1 % a los 44,0 s. Las marcas de 22,0, 44,0 y 66,0 s, al 90, 99 y 99,9 %, quedan separadas por el mismo tiempo, 22 s.',
    montar: function (svg) {
      var S = {}, X = GD.X, Y = GD.Y, g = s('g', {}, svg);
      [0, 10, 20, 30, 40, 50, 60, 70].forEach(function (t) { s('line', { x1: X(t), x2: X(t), y1: GD.y0, y2: GD.y1, stroke: K.rejilla, 'stroke-width': 1 }, g); D.t(g, X(t), GD.y1 + 17, String(t), { tam: 12, ancla: 'middle', color: K.tinta2 }); });
      [0, 0.5, 1, 1.5, 2].forEach(function (v) { s('line', { x1: GD.x0, x2: GD.x1, y1: Y(v), y2: Y(v), stroke: K.rejilla, 'stroke-width': 1 }, g); D.t(g, GD.x0 - 7, Y(v) + 4, n(v, 1), { tam: 12, ancla: 'end', color: K.tinta2 }); });
      s('path', { d: 'M' + GD.x0 + ' ' + GD.y0 + 'V' + GD.y1 + 'H' + GD.x1, fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, g);
      D.t(g, GD.x1, GD.y1 + 36, 'tiempo desde que entra el trazador, s', { tam: 12, ancla: 'end', color: K.tinta2 });
      rotado(g, 24, (GD.y0 + GD.y1) / 2, 'señal normalizada, c/c_∞', { tam: 12, peso: 500, color: K.tinta2 });
      // las franjas
      S.f5 = grupo(svg); s('rect', { x: GD.x0, y: Y(1.05), width: GD.x1 - GD.x0, height: Y(0.95) - Y(1.05), fill: K.ref, opacity: 0.3 }, S.f5);
      D.t(S.f5, GD.x1 - 4, Y(1.05) - 5, '±5 %', { tam: 12, peso: 600, ancla: 'end', color: K.tinta2 });
      S.f1 = grupo(svg); s('rect', { x: GD.x0, y: Y(1.01), width: GD.x1 - GD.x0, height: Y(0.99) - Y(1.01), fill: K.tinta, opacity: 0.3 }, S.f1);
      D.t(S.f1, GD.x1 - 4, Y(0.99) + 15, '±1 %', { tam: 12, peso: 600, ancla: 'end', color: K.tinta2 });
      // las señales, que se dibujan solas
      S.sen = SONDAS.map(function (sd) {
        var pts = []; for (var i = 0; i <= 280; i++) { var t = GD.tmax * i / 280; pts.push([X(t), Y(senal(sd, t))]); }
        return D.trazo(svg, dTrazo(pts), { color: sd.col, ancho: 1.8 });
      });
      S.leyenda = grupo(svg, 1);
      [['bajo el impulsor', AZ], ['a medio lazo', OL], ['detrás de un bafle', S3]].forEach(function (f, i) {
        s('line', { x1: 380, x2: 400, y1: 62 + i * 17, y2: 62 + i * 17, stroke: f[1], 'stroke-width': 2 }, S.leyenda);
        D.t(S.leyenda, 406, 66 + i * 17, f[0], { tam: 12, color: K.tinta2 });
      });
      // la envolvente
      S.env = grupo(svg);
      [1, -1].forEach(function (sg) {
        var pts = []; for (var i = 0; i <= 140; i++) { var t = GD.tmax * i / 140; pts.push([X(t), Y(1 + sg * Math.exp(-GD.k * t))]); }
        s('path', { d: dTrazo(pts), fill: 'none', stroke: K.tinta, 'stroke-width': 1.2, 'stroke-dasharray': '5 4' }, S.env);
      });
      D.t(S.env, X(10) + 6, Y(1 + Math.exp(-GD.k * 10)) - 6, '1 ± e^{−kt}', { tam: 12, peso: 600, halo: K.papel });
      function tmarca(t, txt, col, y, izq) {
        var g2 = grupo(svg);
        s('line', { x1: X(t), x2: X(t), y1: GD.y0 + 6, y2: GD.y1, stroke: col, 'stroke-width': 1.6, 'stroke-dasharray': '6 4' }, g2);
        D.t(g2, X(t) + (izq ? -5 : 5), y, txt, { tam: 12, peso: 700, color: col, halo: K.papel, ancla: izq ? 'end' : 'start' });
        return g2;
      }
      S.m95 = tmarca(GD.t95, 't_{95} = ' + n(GD.t95, 1) + ' s', K.tinta, 140);
      S.m99 = tmarca(grado(GD.t95, 99), 't_{99} = ' + n(grado(GD.t95, 99), 1) + ' s', K.tinta, 160);
      S.m90 = tmarca(grado(GD.t95, 90), '90 %: ' + n(grado(GD.t95, 90), 1) + ' s', K.tinta2, 270, true);
      S.m999 = tmarca(grado(GD.t95, 99.9), '99,9 %: ' + n(grado(GD.t95, 99.9), 1) + ' s', K.tinta2, 270, true);
      S.dec = grupo(svg);
      var yd = Y(0.32);
      [[grado(GD.t95, 90), grado(GD.t95, 99)], [grado(GD.t95, 99), grado(GD.t95, 99.9)]].forEach(function (p) {
        s('line', { x1: X(p[0]) + 3, x2: X(p[1]) - 3, y1: yd, y2: yd, stroke: AL, 'stroke-width': 1.4 }, S.dec);
        s('path', { d: 'M' + (X(p[0]) + 3) + ' ' + yd + 'l7 -3.5v7zM' + (X(p[1]) - 3) + ' ' + yd + 'l-7 -3.5v7z', fill: AL }, S.dec);
        D.t(S.dec, (X(p[0]) + X(p[1])) / 2, yd + 18, '22,0 s', { tam: 12, peso: 600, ancla: 'middle', color: AL });
      });
      return S;
    },
    pasos: [
      { texto: 'Se echa un trazador y se siguen tres sondas: bajo el impulsor, a medio lazo y detrás de un bafle. La señal normalizada, $c/c_\\infty$, oscila alrededor de su valor final, 1, mientras el líquido da vueltas en el tanque.', dur: 2.4, ir: function (S, t) { S.sen.forEach(function (p) { p.dibujar(t); }); } },
      { texto: 'Las fluctuaciones decaen como una exponencial, porque la mezcla es de primer orden: la envolvente es $1 \\pm e^{-kt}$. Al 95 % lo que falta es 5 %, así que $e^{-k t_{95}} = 0,05$ y $k = \\ln 20/t_{95} = 3,00/28,6$ = 0,105 s⁻¹.', dur: 1.8, ir: function (S, t) { D.ver(S.env, t); } },
      { texto: '$t_{95}$ es lo que tarda la señal en entrar a la franja de ±5 % y quedarse ahí. En el caso, con la <a href="#eq-mez-grenville">correlación de Grenville</a>, 28,6 s: $N t_{95} = 1,667 \\times 28,6$ = 47,7 vueltas del eje.', dur: 1.8, ir: function (S, t) { D.ver(S.f5, T(t, 0, 0.5)); D.ver(S.m95, T(t, 0.4, 1)); } },
      { texto: 'Al 99 % la franja es de ±1 %. Con la <a href="#eq-mez-grado">regla del grado de homogeneidad</a>, $t_{99} = 28,6 \\times \\ln 0,01/\\ln 0,05$ = 44,0 s: 1,54 veces el de 95 %, no varias veces más.', dur: 1.8, ir: function (S, t) { D.ver(S.f1, T(t, 0, 0.5)); D.ver(S.m99, T(t, 0.4, 1)); } },
      { texto: 'Cada vez que lo que falta por mezclar se divide por diez, el tiempo sube lo mismo: 22,0 s al 90 %, 44,0 s al 99 % y 66,0 s al 99,9 %, de 22 en 22 s. Los tiempos de fuentes distintas solo se comparan llevados al mismo grado.', dur: 2, ir: function (S, t) { D.ver(S.m90, T(t, 0, 0.4)); D.ver(S.m999, T(t, 0.2, 0.6)); D.ver(S.dec, T(t, 0.5, 1)); } }
    ]
  });

  /* Reto: el CoV al empezar, el tiempo a otro grado y una meta dada como CoV. */

  /* ================= 15.4 El tiempo de mezcla ================= */

  /* El ejemplo del ácido: el reactor con sus medidas, el régimen, Grenville, las correcciones del caso y el diseño. */
  var AC = (function () {
    var g = grenville(N0, DI, DT, HL), al = Math.pow(0.6, -1 / 3);
    return { re: g.re, x: g.x, t: g.th, conf: g.th * 6.24 / 5.20, b1: g.th * 1.3, b2: g.th * 1.4, a1: g.th * 1.3 * al, a2: g.th * 1.4 * al,
      n1: grado(g.th * 1.3 * al, 99), n2: grado(g.th * 1.4 * al, 99), al: al };
  })();
  ZB.animacion('acido', {
    vista: [0, 0, 640, 400],
    alt: 'A la izquierda, el reactor del caso en corte: 2,5 m de diámetro, 3,0 m de líquido, dos aletas colgadas de la tapa, la turbina de 0,83 m a 0,625 m del fondo y, al final, la segunda turbina cerca de la superficie, con el ácido que entra por arriba. A la derecha, el régimen, turbulento con N_P^(1/3) Re = 3,6 millones, y una escala de tiempo de 0 a 80 s con barras: 28,6 s con Grenville, 34,4 s con la constante al 95 % de confianza, 37 a 40 s con la turbina baja, 44 a 48 s con las aletas, y el diseño, 48 s al 95 % y 75 s al 99 %. Al final, tres sondas: una en la corriente de cada turbina y una detrás de una aleta cerca de la superficie.',
    montar: function (svg) {
      var S = {}, AL0 = 3.2;
      var tk = tanque(svg, { cx: 150, yb: 388, esc: 82, Dt: DT, alto: AL0, nivel: HL, tapa: true });
      var X = tk.X, Y = tk.Y;
      accionamiento(svg, tk, CI, AL0 + DT / 4);
      aletas(svg, tk, AL0 + 0.25);
      S.t1 = turbina(svg, tk, CI, DI);
      S.t2 = grupo(svg); turbina(S.t2, tk, HL - DI, DI);
      S.acido = grupo(svg);
      D.flecha(S.acido, X(0.62), Y(AL0 + 0.75), X(0.62), Y(HL) - 4, { color: ACIDO, ancho: 3, punta: 10 });
      D.t(S.acido, X(0.62) + 8, Y(AL0 + 0.62), 'ácido', { tam: 12, peso: 700, color: MAT.acido.oscuro, halo: K.papel });
      S.cotas = grupo(svg);
      D.t(S.cotas, 6, 14, 'D_t = 2,5 m; H = 3,0 m; D = 0,83 m; 100 r/min', { tam: 12, peso: 600, color: K.tinta2 });
      S.baja = grupo(svg);
      D.t(S.baja, X(-0.45), Y(CI) + 4, '0,21 H', { tam: 12, peso: 700, ancla: 'end', color: AL, halo: K.papel });
      S.sondas = grupo(svg);
      [[-0.6, CI - 0.3], [-0.6, HL - DI - 0.3], [1.13, HL - 0.4]].forEach(function (p) { s('circle', { cx: X(p[0]), cy: Y(p[1]), r: 5, fill: K.amarillo, stroke: K.tinta, 'stroke-width': 1.4 }, S.sondas); });
      // el régimen, arriba a la derecha
      S.reg = grupo(svg);
      lineas(S.reg, 350, 30, ['El régimen', 'Re = ρND²/μ = 3,34 × 10^6', 'N_P^{1/3} Re = 3,6 × 10^6 > 6370: turbulento'], { titulo: true, colorT: AZ });
      // la escala de tiempo, con las barras
      var x0 = 350, x1 = 620, tm = 80, XB = function (t) { return x0 + t / tm * (x1 - x0); };
      S.XB = XB;
      S.ejeT = grupo(svg);
      [0, 20, 40, 60, 80].forEach(function (t) { s('line', { x1: XB(t), x2: XB(t), y1: 112, y2: 362, stroke: K.rejilla, 'stroke-width': 1 }, S.ejeT); D.t(S.ejeT, XB(t), 378, String(t), { tam: 12, ancla: 'middle', color: K.tinta2 }); });
      D.t(S.ejeT, x1, 394, 'tiempo de mezcla, s', { tam: 12, ancla: 'end', color: K.tinta2 });
      function fila(y, txt, a, b, col) {
        var g = grupo(svg);
        D.t(g, x0, y - 6, txt, { tam: 12, peso: 600, color: K.tinta, halo: K.papel });
        s('rect', { x: x0, y: y, width: XB(a) - x0, height: 11, fill: col }, g);
        if (b) s('rect', { x: XB(a), y: y, width: XB(b) - XB(a), height: 11, fill: col, opacity: 0.45 }, g);
        return g;
      }
      S.f1 = fila(134, 'Grenville: ' + n(AC.t, 1) + ' s', AC.t, 0, AZ);
      S.f2 = fila(178, 'al 95 % de confianza: ' + n(AC.conf, 1) + ' s', AC.conf, 0, K.ref);
      S.f3 = fila(222, 'turbina baja, 30 a 40 % más: ' + n(AC.b1, 0) + ' a ' + n(AC.b2, 0) + ' s', AC.b1, AC.b2, OL);
      S.f4 = fila(266, 'aletas, × 0,6^{−1/3} = × ' + n(AC.al, 2) + ': ' + n(AC.a1, 0) + ' a ' + n(AC.a2, 0) + ' s', AC.a1, AC.a2, S3);
      S.f5 = grupo(svg);
      D.t(S.f5, x0, 304, 'diseño: 48 s al 95 %; 75 s al 99 %', { tam: 12, peso: 700, color: K.tinta, halo: K.papel });
      s('rect', { x: x0, y: 310, width: XB(48) - x0, height: 11, fill: K.amarillo, stroke: K.tinta, 'stroke-width': 1 }, S.f5);
      s('rect', { x: XB(AC.n1), y: 330, width: XB(AC.n2) - XB(AC.n1), height: 11, fill: S3, opacity: 0.45 }, S.f5);
      s('rect', { x: XB(75) - 2, y: 326, width: 4, height: 19, fill: K.tinta }, S.f5);
      D.t(S.f5, XB(AC.n1) - 6, 340, 'al 99 %: ' + n(AC.n1, 0) + ' a ' + n(AC.n2, 0) + ' s', { tam: 12, ancla: 'end', color: K.tinta2 });
      return S;
    },
    pasos: [
      { texto: 'El reactor del caso: $D_t$ = 2,5 m, $H$ = 3,0 m, la turbina de $D$ = 0,83 m a 100 r/min, $N$ = 100/60 = 1,667 r/s, con $N_P$ = 1,27 con cuatro bafles de pared. El ácido entra por arriba. ¿Cuánto tarda en repartirse?', dur: 1.6, ir: function (S, t) { D.ver(S.cotas, t); D.ver(S.acido, T(t, 0.3, 1)); } },
      { texto: 'El régimen: $\\mathrm{Re} = \\rho N D^2/\\mu = 968,6 \\times 1,667 \\times 0,83^2/(3,33 \\times 10^{-4})$ = 3,34 × 10⁶, y $N_P^{1/3}\\mathrm{Re} = 1,27^{1/3} \\times 3,34 \\times 10^6$ = 3,6 × 10⁶, muy por encima de 6370: vale la <a href="#eq-mez-grenville">correlación turbulenta de Grenville</a>.', dur: 1.8, ir: function (S, t) { D.ver(S.reg, t); } },
      { texto: '$t_{95} = 5,20 \\times 2,5^{1,5} \\times 3,0^{0,5}/(1,27^{1/3} \\times 1,667 \\times 0,83^2)$ = 28,6 s, con $N t_{95}$ = 47,7 vueltas del eje. Con la constante al 95 % de confianza, 6,24 en lugar de 5,20, el tiempo sube a 34,4 s.', dur: 2, ir: function (S, t) { D.ver(S.ejeT, T(t, 0, 0.3)); D.ver(S.f1, T(t, 0.2, 0.6)); D.ver(S.f2, T(t, 0.6, 1)); } },
      { texto: 'La geometría no es la de Grenville. La turbina está a 0,21 de la altura del líquido, no a un tercio: con 30 a 40 % más, de 37 a 40 s. Las dos aletas dan el 60 % de la potencia de cuatro bafles de pared, y $t_{95}$ va con $N_P^{-1/3}$: $0,6^{-1/3}$ = 1,19, de 44 a 48 s.', dur: 2.2, ir: function (S, t) { D.ver(S.baja, T(t, 0, 0.4)); D.ver(S.f3, T(t, 0.2, 0.6)); D.ver(S.f4, T(t, 0.6, 1)); } },
      { texto: 'Al 99 %, 1,54 veces: de 68 a 73 s. Redondeados hacia arriba, los valores de diseño del caso son 48 s y 75 s. La segunda turbina forma su propio lazo y puede alargar el tiempo tanto como acortarlo, así que los 48 s se confirman en el arranque, con agua y sal: una sonda en la corriente de cada turbina y una detrás de una aleta cerca de la superficie.', dur: 2.4, ir: function (S, t) { D.ver(S.f5, T(t, 0, 0.5)); D.ver(S.t2, T(t, 0.3, 0.7)); D.ver(S.sondas, T(t, 0.6, 1)); D.ver(S.acido, 1 - T(t, 0, 0.4)); } }
    ]
  });

  /* Reto: el tiempo de mezcla en turbulento, en la transición, y la velocidad para un tiempo dado. */

  /* ================= 15.5 Dónde echar el ácido ================= */

  /* Reto: la punta, la salida del tubo de inmersión y su boquilla. */

  /* ================= 15.6 Escalar ================= */

  /* El piloto y la planta, a escala, con cada regla: la velocidad, la potencia, el tiempo de mezcla y lo que recibe la
     cáscara, con la cáscara que se hunde o se queda arriba. */
  var R_ESC = 5, DP_ = DI / R_ESC, DTP = DT / R_ESC, HP_ = HL / R_ESC, RPMP = RPM * Math.pow(R_ESC, 2 / 3);
  function unaPlanta(x) {
    var rpm = RPMP * Math.pow(R_ESC, -x), N = rpm / 60;
    return { x: x, rpm: rpm, P: pot(NP, RHO, rpm, DI), t: grenville(N, DI, DT, HL).th, nj: N / joostenN(DI), u: Math.PI * N * DI };
  }
  var PIL = { rpm: RPMP, P: pot(NP, RHO, RPMP, DP_), t: grenville(RPMP / 60, DP_, DTP, HP_).th, nj: RPMP / 60 / joostenN(DP_) };
  var REGLAS = [unaPlanta(2 / 3), unaPlanta(0.5), unaPlanta(0), unaPlanta(1)];
  ZB.animacion('escalado', {
    vista: [0, 0, 640, 410],
    alt: 'A la izquierda, el piloto de 0,5 m y la planta de 2,5 m a la misma escala, cada uno con la cáscara: en el piloto se hunde. A la derecha, cuatro barras para la planta con la regla de cada paso: la velocidad, la potencia en escala logarítmica, el tiempo de mezcla y la velocidad dividida por la que hunde la cáscara, con la línea de 1. Con la potencia por volumen igual, 100 r/min, 2,24 kW, 28,6 s y 0,78: la cáscara flota. Con el Froude igual, 131 r/min, 5,0 kW, 22 s y 1,02: se hunde. Con la velocidad igual, 292 r/min y 56 kW. Con la punta igual, 58,5 r/min, 0,45 kW, 49 s y 0,46. Al final, las cuatro reglas juntas.',
    montar: function (svg) {
      var S = {};
      var pl = tanque(svg, { cx: 165, yb: 370, esc: 80, Dt: DT, alto: HL + 0.15, nivel: HL });
      var pi = tanque(svg, { cx: 24, yb: 370, esc: 80, Dt: DTP, alto: HP_ + 0.03, nivel: HP_ });
      turbina(svg, pl, CI, DI); turbina(svg, pi, CI / R_ESC, DP_);
      s('line', { x1: pl.X(0), x2: pl.X(0), y1: pl.Y(CI), y2: pl.Y(HL + 0.4), stroke: K.tinta, 'stroke-width': 2.4 }, svg);
      s('line', { x1: pi.X(0), x2: pi.X(0), y1: pi.Y(CI / R_ESC), y2: pi.Y(HP_ + 0.12), stroke: K.tinta, 'stroke-width': 1.4 }, svg);
      D.t(svg, pi.X(0), pi.Y(HP_) - 16, 'piloto', { tam: 12, peso: 700, ancla: 'middle' });
      D.t(svg, pl.X(0), pl.Y(HL + 0.4) - 8, 'planta, R = 5', { tam: 12, peso: 700, ancla: 'middle' });
      D.t(svg, pi.X(0), 392, '0,5 m', { tam: 12, ancla: 'middle', color: K.tinta2 });
      D.t(svg, pl.X(0), 392, '2,5 m', { tam: 12, ancla: 'middle', color: K.tinta2 });
      // la cáscara: arriba si flota, repartida si se hunde
      function cascara(tk, dt, h, nPed, k) {
        var arriba = s('g', {}, svg), abajo = s('g', {}, svg), sem = 7;
        for (var i = 0; i < nPed; i++) {
          sem = (sem * 9301 + 49297) % 233280; var u1 = sem / 233280; sem = (sem * 9301 + 49297) % 233280; var u2 = sem / 233280;
          var x = (u1 - 0.5) * dt * 0.9;
          s('rect', { x: tk.X(x) - k, y: tk.Y(h) - k * 0.4, width: 2 * k, height: k * 0.8, fill: MAT.cascara.medio, stroke: MAT.cascara.oscuro, 'stroke-width': 0.6 }, arriba);
          s('rect', { x: tk.X(x) - k, y: tk.Y(h * (0.1 + 0.8 * u2)) - k * 0.4, width: 2 * k, height: k * 0.8, fill: MAT.cascara.medio, stroke: MAT.cascara.oscuro, 'stroke-width': 0.6 }, abajo);
        }
        return { arriba: arriba, abajo: abajo };
      }
      S.cp = cascara(pl, DT, HL, 26, 4.5);
      var cpi = cascara(pi, DTP, HP_, 6, 2.2);
      cpi.arriba.setAttribute('opacity', 0);
      S.ver = function (nj) { var h = nj >= 1 ? 1 : 0; S.cp.arriba.setAttribute('opacity', 1 - h); S.cp.abajo.setAttribute('opacity', h); };
      S.ver(0);
      S.cp.arriba.setAttribute('opacity', 0); S.cp.abajo.setAttribute('opacity', 0);
      // las barras de la derecha
      var x0 = 340, x1 = 590;
      var BAR = [
        { t: 'velocidad, r/min', y: 92, f: function (v) { return v / 300; }, marcas: [[0, '0'], [100, '100'], [200, '200'], [300, '300']], k: 'rpm' },
        { t: 'potencia, escala logarítmica', y: 172, f: function (v) { return (Math.log10(v) - 1) / 4; }, marcas: [[10, '10 W'], [100, '0,1 kW'], [1000, '1 kW'], [1e4, '10 kW'], [1e5, '100 kW']], k: 'P' },
        { t: 't_{95}, s', y: 252, f: function (v) { return v / 60; }, marcas: [[0, '0'], [20, '20'], [40, '40'], [60, '60']], k: 't' },
        { t: 'velocidad / la que hunde la cáscara', y: 332, f: function (v) { return v / 2.5; }, marcas: [[0, '0'], [1, '1'], [2, '2']], k: 'nj' }
      ];
      S.BAR = BAR; S.bx = function (b, v) { return x0 + Math.max(0, Math.min(1, b.f(v))) * (x1 - x0); };
      BAR.forEach(function (b) {
        D.t(svg, x0, b.y - 22, b.t, { tam: 12, peso: 600 });
        s('rect', { x: x0, y: b.y - 10, width: x1 - x0, height: 14, fill: K.zona }, svg);
        b.marcas.forEach(function (m) { var x = S.bx(b, m[0]); s('line', { x1: x, x2: x, y1: b.y + 4, y2: b.y + 9, stroke: K.tinta2, 'stroke-width': 1 }, svg); D.t(svg, x, b.y + 22, m[1], { tam: 11.5, ancla: 'middle', color: K.tinta2 }); });
        if (b.k === 'nj') s('line', { x1: S.bx(b, 1), x2: S.bx(b, 1), y1: b.y - 14, y2: b.y + 8, stroke: AL, 'stroke-width': 2 }, svg);
        b.barra = s('rect', { x: x0, y: b.y - 8, width: 0, height: 10, fill: AZ }, svg);
        b.pil = s('path', { d: '', fill: OL }, svg);
        b.lect = D.t(svg, x1 + 4, b.y + 2, '', { tam: 12, peso: 700, ancla: 'start', color: AZ });
        b.puntos = [];
      });
      // el piloto, como referencia en cada barra (un triángulo oliva)
      BAR.forEach(function (b) { var x = S.bx(b, PIL[b.k]); b.pil.setAttribute('d', 'M' + x + ' ' + (b.y - 10) + 'l-5 -8h10z'); });
      S.leyP = grupo(svg, 1);
      s('path', { d: 'M' + x0 + ' 30l-5 -8h10z', fill: OL }, S.leyP);
      D.t(S.leyP, x0 + 10, 30, 'el piloto: ' + n(PIL.rpm, 0) + ' r/min, ' + n(PIL.P, 1) + ' W, ' + n(PIL.t, 1) + ' s, ' + n(PIL.nj, 2), { tam: 12, color: OL, peso: 600 });
      S.regla = D.t(svg, x0, 52, '', { tam: 12.5, peso: 700, color: AZ });
      // los puntos de las cuatro reglas para el final
      S.fin = grupo(svg);
      REGLAS.forEach(function (rg) { BAR.forEach(function (b) { D.punto(S.fin, S.bx(b, rg[b.k]), b.y - 3, { r: 4.5, color: rg.x === 2 / 3 ? K.caso : K.blanco }); }); });
      S.poner = function (a, b, t, nombre) {
        BAR.forEach(function (br) {
          var va = a[br.k], vb = b[br.k], v = br.k === 'P' ? Math.pow(10, Math.log10(va) + (Math.log10(vb) - Math.log10(va)) * t) : va + (vb - va) * t;
          br.barra.setAttribute('width', S.bx(br, v) - x0);
          br.barra.setAttribute('fill', br.k === 'nj' ? (v >= 1 ? AZ : AL) : AZ);
          D.ponerTexto(br.lect, br.k === 'rpm' ? n(v, v < 100 ? 1 : 0) : br.k === 'P' ? (v < 1000 ? n(v, v < 100 ? 1 : 0) + ' W' : n(v / 1000, v < 1e4 ? 2 : 0) + ' kW') : br.k === 't' ? n(v, 1) + ' s' : n(v, 2));
        });
        D.ponerTexto(S.regla, nombre);
        S.ver(t < 0.5 ? a.nj : b.nj);
      };
      return S;
    },
    pasos: [
      { texto: 'El piloto: $D_t$ = 0,5 m, 110 L, turbina de 0,166 m a 292 r/min: $P = N_P \\rho N^3 D^5 = 1,27 \\times 968,6 \\times 4,87^3 \\times 0,166^5$ = 17,9 W, 164 W/m³, $t_{95}$ = 9,8 s, y su velocidad es 1,02 de la que hunde la cáscara: la hunde. La planta es cinco veces más grande, $R$ = 5, y gira a $292 \\times 5^{-x}$ r/min.', dur: 2, ir: function (S, t) { S.poner(PIL, PIL, 1, 'el piloto'); S.cp.abajo.setAttribute('opacity', 0); S.cp.arriba.setAttribute('opacity', 0); } },
      { texto: 'Potencia por volumen igual, $x$ = 2/3: $292 \\times 5^{-2/3}$ = 100 r/min y 2,24 kW, los mismos 164 W/m³. El tiempo de mezcla sube $5^{2/3}$ = 2,9 veces, a 28,6 s, y la cáscara recibe 0,78 de la velocidad que pide: flota.', dur: 2, ir: function (S, t) { S.poner(PIL, REGLAS[0], t, 'potencia por volumen igual, x = 2/3'); } },
      { texto: 'Froude igual, $x$ = 1/2: $292 \\times 5^{-1/2}$ = 131 r/min, y $N^2D/g = 2,18^2 \\times 0,83/9,81$ = 0,402, el mismo del piloto. La potencia sube a 5,0 kW, el ácido se reparte en 22 s y la cáscara recibe 1,02 de lo que pide: se hunde, como en el piloto.', dur: 2, ir: function (S, t) { S.poner(REGLAS[0], REGLAS[1], t, 'Froude igual, x = 1/2'); } },
      { texto: 'Tiempo de mezcla igual, $x$ = 0: la planta gira a 292 r/min, como el piloto, y toma 56 kW, 25 veces la potencia del diseño, con la punta a $\\pi N D = \\pi \\times 4,87 \\times 0,83$ = 12,7 m/s.', dur: 2, ir: function (S, t) { S.poner(REGLAS[1], REGLAS[2], t, 'tiempo de mezcla igual, x = 0'); } },
      { texto: 'Punta igual, $x$ = 1: $292/5$ = 58,5 r/min y 0,45 kW; el tiempo sube a 49 s y la cáscara recibe 0,46 de lo que pide.', dur: 2, ir: function (S, t) { S.poner(REGLAS[2], REGLAS[3], t, 'punta igual, x = 1'); } },
      { texto: 'Las cuatro reglas juntas, como en la <a href="#fig-mez-escalado">figura de las reglas</a>, con el punto amarillo en la potencia por volumen: solo con $x$ de 1/2 o menos la cáscara llega a 1. La cáscara decide el escalado del reactor; el ácido, que se reparte en menos de un minuto con cualquiera de ellas, no decide nada.', dur: 1.8, ir: function (S, t) { S.poner(REGLAS[0], REGLAS[0], 1, 'en amarillo, la potencia por volumen'); D.ver(S.fin, t); S.BAR.forEach(function (b) { b.barra.setAttribute('opacity', 1 - T(t, 0, 0.6)); b.lect.setAttribute('opacity', 1 - T(t, 0, 0.6)); }); } }
    ]
  });

  /* Reto: la velocidad de la planta con cada regla, su potencia y su Froude. */

  /* ================= 15.7 El calor por la camisa ================= */

  /* El lote al fuego: el corte de la pared con sus cinco resistencias, cada capa del ancho de su resistencia, la
     temperatura que cae de un lado al otro, y la curva del lote hasta 85 °C. */
  var LO = (function () {
    var ts = 120.21, tb = 52.5, res = [['película del vapor', 1.419, MAT.caliente.medio], ['ensuciamiento del vapor', 1.0, GR.barra], ['12 mm de acero', 0.012 / 52 * 1e4, K.metalO],
      ['2 mm de vidrio', 0.002 / 1.16 * 1e4, VIDRIO], ['ensuciamiento del lote', 2.0, GR.barra], ['película del lote', 3.590, AZ]];
    var tot = res.reduce(function (a, b) { return a + b[1]; }, 0), q = (ts - tb) / (tot * 1e-4), U = 1e4 / tot;
    var m = 13273, cp = 4184, area = 18.65, tau = m * cp / (U * area);
    return { ts: ts, tb: tb, res: res, tot: tot, q: q, U: U, tau: tau, tfin: tau * Math.log((ts - 20) / (ts - 85)) / 60 };
  })();
  ZB.animacion('lote', {
    vista: [0, 0, 640, 400],
    alt: 'A la izquierda, la pared del reactor vidriado en corte, con sus cinco resistencias en serie dibujadas del ancho de cada una: la película del vapor, 1,4; su ensuciamiento, 1,0; 12 mm de acero, 2,3; 2 mm de vidrio, 17,2; el ensuciamiento del lote, 2,0; y la película del lote, 3,6, en diez milésimas de metro cuadrado por kelvin por vatio, 27,6 en total y U = 363 W/(m²·K). La temperatura cae de 120,2 °C del vapor a 52,5 °C del lote, casi toda en el vidrio, y la cara del lote queda a 61,3 °C. A la derecha, el lote que se calienta de 20 a 85 °C en 143 min.',
    montar: function (svg) {
      var S = {}, x0 = 72, esc = 9.6, y0 = 104, y1 = 272;
      var Yt = function (T) { return y1 - (T - 40) / (130 - 40) * (y1 - y0); };
      S.capas = []; var x = x0, bordes = [x0];
      LO.res.forEach(function (c, i) {
        var w = c[1] * esc, g = grupo(svg, 1);
        var r = s('rect', { x: x, y: y0, width: w, height: y1 - y0, fill: K.blanco, stroke: K.tinta, 'stroke-width': 1 }, g);
        var lab = D.t(g, x + w / 2, i % 2 ? y0 - 8 : y0 - 24, n(c[1], 1), { tam: 12, peso: 700, ancla: 'middle', color: K.tinta, halo: K.papel });
        lab.setAttribute('opacity', 0);
        S.capas.push({ r: r, lab: lab, col: c[2] }); x += w; bordes.push(x);
      });
      S.bordes = bordes;
      D.t(svg, 40, 36, 'Las cinco resistencias, en 10^{−4} m²·K/W', { tam: 12.5, peso: 700 });
      D.t(svg, x0 - 4, y1 + 18, 'vapor', { tam: 12, peso: 600, color: K.tinta2 });
      D.t(svg, x + 4, y1 + 18, 'lote', { tam: 12, peso: 600, ancla: 'end', color: K.tinta2 });
      // la leyenda
      var ley = grupo(svg, 1);
      LO.res.forEach(function (c, i) { if (i === 4) return; var col = i < 4 ? i : 4, yy = 314 + (col % 3) * 18, xx = x0 + Math.floor(col / 3) * 150; s('rect', { x: xx, y: yy - 10, width: 12, height: 12, fill: c[2] }, ley); D.t(ley, xx + 18, yy, i === 1 ? 'ensuciamientos' : c[0], { tam: 12, color: K.tinta2 }); });
      // el perfil de temperatura
      var tps = [LO.ts], tt = LO.ts; LO.res.forEach(function (c) { tt -= LO.q * c[1] * 1e-4; tps.push(tt); });
      S.perfil = D.trazo(svg, dTrazo(bordes.map(function (bx, i) { return [bx, Yt(tps[i])]; })), { color: AL, ancho: 2.4 });
      S.tlab = grupo(svg);
      D.t(S.tlab, bordes[0] - 4, Yt(tps[0]) + 4, n(LO.ts, 1) + ' °C', { tam: 12, peso: 700, ancla: 'end', color: AL });
      D.t(S.tlab, bordes[6] + 4, Yt(tps[6]) + 4, n(LO.tb, 1) + ' °C', { tam: 12, peso: 700, color: AL });
      [0, 5, 6].forEach(function (i) { s('circle', { cx: bordes[i], cy: Yt(tps[i]), r: 3.5, fill: AL }, S.tlab); });
      S.Ulab = D.t(svg, 40, 60, '', { tam: 12.5, peso: 700, color: AZ });
      // la curva del lote
      var gx0 = 432, gx1 = 620, gy0 = 104, gy1 = 300, X = function (t) { return gx0 + t / 150 * (gx1 - gx0); }, Y = function (T) { return gy1 - T / 100 * (gy1 - gy0); };
      S.graf = grupo(svg);
      [0, 30, 60, 90, 120, 150].forEach(function (t) { s('line', { x1: X(t), x2: X(t), y1: gy0, y2: gy1, stroke: K.rejilla, 'stroke-width': 1 }, S.graf); D.t(S.graf, X(t), gy1 + 16, String(t), { tam: 12, ancla: 'middle', color: K.tinta2 }); });
      [0, 20, 40, 60, 80, 100].forEach(function (T) { s('line', { x1: gx0, x2: gx1, y1: Y(T), y2: Y(T), stroke: K.rejilla, 'stroke-width': 1 }, S.graf); D.t(S.graf, gx0 - 6, Y(T) + 4, String(T), { tam: 12, ancla: 'end', color: K.tinta2 }); });
      s('path', { d: 'M' + gx0 + ' ' + gy0 + 'V' + gy1 + 'H' + gx1, fill: 'none', stroke: K.tinta2, 'stroke-width': 1.2 }, S.graf);
      D.t(S.graf, gx1, gy1 + 34, 'tiempo, min', { tam: 12, ancla: 'end', color: K.tinta2 });
      D.t(S.graf, gx0 - 30, gy0 - 14, 'lote, °C', { tam: 12, color: K.tinta2 });
      s('line', { x1: gx0, x2: gx1, y1: Y(85), y2: Y(85), stroke: K.tinta, 'stroke-width': 1, 'stroke-dasharray': '4 4' }, S.graf);
      D.t(S.graf, gx0 + 4, Y(85) - 5, '85 °C', { tam: 12, color: K.tinta2, halo: K.papel });
      var pts = []; for (var i = 0; i <= 120; i++) { var tm = LO.tfin * i / 120; pts.push([X(tm), Y(LO.ts - (LO.ts - 20) * Math.exp(-tm * 60 / LO.tau))]); }
      S.curva = D.trazo(svg, dTrazo(pts), { color: AZ, ancho: 2.4 });
      S.fin = grupo(svg);
      D.punto(S.fin, X(LO.tfin), Y(85), { r: 5.5 });
      D.t(S.fin, gx1 - 4, Y(8), 'a 85 °C en ' + n(LO.tfin, 0) + ' min; 1640 kg de vapor', { tam: 12, peso: 700, ancla: 'end', halo: K.papel });
      return S;
    },
    pasos: [
      { texto: 'La pared del reactor, vista de cerca. Del lado de la camisa, vapor saturado a 2,00 bara, 120,2 °C, que se condensa; del lado del lote, el agua a media carrera, 52,5 °C. Entre los dos hay cinco resistencias en serie, $1/U = 1/h_s + R_{f,s} + \\sum \\delta/k + R_{f,p} + 1/h_p$, dibujadas aquí con el ancho de cada una.', dur: 1.6, ir: function (S, t) { S.capas.forEach(function (c) { c.r.setAttribute('fill', K.blanco); c.lab.setAttribute('opacity', 0); }); } },
      { texto: 'La película del lote, con la <a href="#eq-mez-nu">correlación de la pared</a>: $h_p = (0,6436/2,5) \\times 0,45 \\times (2,161 \\times 10^6)^{2/3} \\times 3,407^{1/3} \\times (0,5244/0,4571)^{0,14} \\times 0,938$ = 2785 W/(m²·K), así que $1/h_p$ = 3,6 × 10⁻⁴ m²·K/W.', dur: 1.8, ir: function (S, t) { var c = S.capas[5]; c.r.setAttribute('fill', t > 0.3 ? c.col : K.blanco); c.lab.setAttribute('opacity', T(t, 0.3, 1)); } },
      { texto: 'La película del vapor, con la <a href="#eq-mez-nusselt">ecuación de Nusselt</a> en los 2,375 m de pared mojada: $h_s$ = 7046 W/(m²·K), 1,4 × 10⁻⁴. Los ensuciamientos, 1,0 del lado del vapor y 2,0 del lado del lote, son ilustrativos.', dur: 1.8, ir: function (S, t) { [0, 1, 4].forEach(function (i) { var c = S.capas[i]; c.r.setAttribute('fill', t > 0.3 ? c.col : K.blanco); c.lab.setAttribute('opacity', T(t, 0.3, 1)); }); } },
      { texto: 'La pared: $\\delta/k$ = 0,012/52 = 2,3 × 10⁻⁴ del acero y 0,002/1,16 = 17,2 × 10⁻⁴ del vidrio, el 63 % del total. La suma es 27,6 × 10⁻⁴ m²·K/W, y $U$ = 363 W/(m²·K). La temperatura cae casi toda en el vidrio, y la cara del lote queda a 61,3 °C.', dur: 2.2, ir: function (S, t) { [2, 3].forEach(function (i) { var c = S.capas[i]; c.r.setAttribute('fill', t > 0.2 ? c.col : K.blanco); c.lab.setAttribute('opacity', T(t, 0.2, 0.6)); }); D.ponerTexto(S.Ulab, t > 0.5 ? 'total: 27,6; U = 363 W/(m²·K); cara del lote: 61,3 °C' : ''); S.perfil.dibujar(T(t, 0.4, 1)); D.ver(S.tlab, T(t, 0.7, 1)); } },
      { texto: 'El lote, con la <a href="#eq-mez-lote">ecuación del lote con vapor</a>: $m_b c_p/(UA) = 13\\,273 \\times 4184/(363 \\times 18,65)$ = 8203 s, y $t = 8203 \\times \\ln[(120,2 - 20)/(120,2 - 85)]$ = 8580 s, 143 min. El vapor que se condensa es $13\\,273 \\times 4,184 \\times 65/2201,5$ = 1640 kg.', dur: 2.4, ir: function (S, t) { D.ver(S.graf, T(t, 0, 0.3)); S.curva.dibujar(T(t, 0.2, 0.9)); D.ver(S.fin, T(t, 0.85, 1)); } }
    ]
  });

  /* Reto: el U de una pared, el tiempo de calentar un lote y el área de una camisa. */

  /* ================= 15.8 Mezcladores estáticos ================= */

  /* Cómo mezcla un mezclador estático en flujo laminar, con el modelo de herramientas/figura-estrias.py: los cortes de
     la corriente que cada elemento parte, estira y apila; el KMS de 12 elementos de 1,5 D, y el CoV a lo largo con
     K_iL = 0,87. El último paso se ve como la figura de las estrías. */
  var ES = { KIL: 0.87, LEL: 1.5, NEL: 12, LADO: 64, PASO: 98, YC: 32, X0: 70, X1: 676, Y0: 290, Y1: 470, YP: 222, YMIN: Math.log10(0.02) };
  ES.X = function (ld) { return ES.X0 + ld / 18 * (ES.X1 - ES.X0); };
  ES.Y = function (c) { return ES.Y1 - (Math.log10(c) - ES.YMIN) / -ES.YMIN * (ES.Y1 - ES.Y0); };
  ES.RP = (ES.X(1) - ES.X(0)) / 2;
  ES.cov = function (ld) { return Math.pow(ES.KIL, ld); };
  function espesor(k) { var mm = 50 / Math.pow(2, k); return mm >= 1 ? n(mm, mm === Math.round(mm) ? 0 : 1) + ' mm' : n(1000 * mm, 0) + ' µm'; }
  function capas(padre, k, x, y, w, h) {       // 2^k estrías: cada una, agua abajo y ácido arriba
    var g = s('g', {}, padre);
    s('rect', { x: x, y: y, width: w, height: h, fill: AGUA_E }, g);
    var m = Math.pow(2, k), e = h / m;
    for (var j = 0; j < m; j++) s('rect', { x: x, y: y + j * e, width: w, height: e / 2, fill: ACIDO }, g);
    return g;
  }
  ZB.animacion('estrias', {
    vista: [0, 0, 690, 520],
    alt: 'Arriba, el corte idealizado de una corriente de mitad ácido y mitad agua en un mezclador estático en flujo laminar. A la entrada hay una estría de espesor D, 50 mm en un tubo de 50 mm. Cada elemento parte la corriente en dos, estira cada mitad y las apila: después de 1, 2, 3, 4 y 5 elementos hay 2, 4, 8, 16 y 32 estrías, de 25 mm a 1,6 mm, y después de 12 elementos serían 4096 estrías de 12 µm, que la difusión ya borró. Al medio, el Kenics KMS de 12 elementos de 1,5 diámetros, con el elemento que recorre la corriente resaltado. Abajo, el coeficiente de variación del ácido contra el largo, en escala logarítmica: baja de 1 como 0,87 elevado a L/D y vale 0,08 a los 18 diámetros.',
    montar: function (svg) {
      var S = {}, X = ES.X, Y = ES.Y, YP = ES.YP, RP = ES.RP, YC = ES.YC, LADO = ES.LADO;
      D.t(svg, 0, YC - 12, 'la corriente en corte, idealizada', { tam: 13, color: K.tinta2 });
      S.leyM = grupo(svg, 1);
      [[ACIDO, 'ácido'], [AGUA_E, 'agua'], [ACIDO_R, 'mezcla']].forEach(function (c, i) {
        var g = i === 2 ? (S.leyMez = grupo(svg)) : S.leyM, x = 420 + i * 92;
        s('rect', { x: x, y: YC - 24, width: 13, height: 13, fill: c[0], stroke: K.tinta2, 'stroke-width': 1 }, g);
        D.t(g, x + 19, YC - 12, c[1], { tam: 13, color: K.tinta2 });
      });
      // los siete cortes, cada uno con sus tres rótulos
      var CORTES = [[0, 'a la entrada', '1 estría'], [1, '1 elemento', '2 estrías'], [2, '2 elementos', '4 estrías'], [3, '3 elementos', '8 estrías'], [4, '4 elementos', '16 estrías'], [5, '5 elementos', '32 estrías'], [12, '12 elementos', '4096 estrías']];
      S.cortes = CORTES.map(function (c, i) {
        var k = c[0], x = k === 12 ? 690 - LADO : i * ES.PASO, tx = k === 12 ? 690 : x, anc = k === 12 ? 'end' : 'start', g = grupo(svg);
        var cuerpo = s('g', {}, g);
        if (k === 12) s('rect', { x: x, y: YC, width: LADO, height: LADO, fill: ACIDO_R }, cuerpo); else capas(cuerpo, k, x, YC, LADO, LADO);
        s('rect', { x: x, y: YC, width: LADO, height: LADO, fill: 'none', stroke: K.tinta2, 'stroke-width': 1 }, g);
        D.t(g, tx, YC + LADO + 17, c[1], { tam: 13, peso: 600, ancla: anc });
        D.t(g, tx, YC + LADO + 33, c[2], { tam: 13, ancla: anc, color: K.tinta2 });
        D.t(g, tx, YC + LADO + 49, (k ? 'D/' + Math.pow(2, k) : 'D') + ': ' + espesor(k), { tam: 13, ancla: anc, color: K.tinta2 });
        return { g: g, cuerpo: cuerpo, x: x, k: k };
      });
      S.puntos = grupo(svg); D.t(S.puntos, (5 * ES.PASO + LADO + 690 - LADO) / 2, YC + LADO / 2 + 5, '…', { tam: 14, peso: 600, ancla: 'middle' });
      S.nota = grupo(svg, 1); D.t(S.nota, 0, YC + LADO + 70, 'tercera línea: el espesor de una estría y su valor en un tubo de 50 mm', { tam: 13, color: K.tinta2 });
      // el corte que nace: una copia del anterior que se parte, se estira y se apila
      S.nace = s('g', {}, svg);
      S.partir = function (k, t) {      // del corte k al k + 1, en la casilla k + 1
        while (S.nace.firstChild) S.nace.removeChild(S.nace.firstChild);
        if (t <= 0 || t >= 1) return;
        var x = (k + 1) * ES.PASO, a = T(t, 0, 0.25), b = T(t, 0.25, 0.6), c = T(t, 0.6, 1);
        var izq = s('g', { transform: 'translate(' + x + ' ' + (YC + LADO) + ') scale(' + (1 + c) + ' ' + (1 - 0.5 * b) + ') translate(0 ' + (-LADO) + ')' }, S.nace);
        var der = s('g', { transform: 'translate(' + (x + LADO) + ' ' + YC + ') scale(' + (1 + c) + ' ' + (1 - 0.5 * b) + ') translate(' + (-LADO) + ' 0)' }, S.nace);
        capas(izq, k, 0, 0, LADO / 2 + (c > 0 ? 0 : 0.3), LADO); capas(der, k, LADO / 2, 0, LADO / 2, LADO);
        s('rect', { x: x, y: YC, width: LADO, height: LADO, fill: 'none', stroke: K.tinta2, 'stroke-width': 1 }, S.nace);
        if (a > 0 && b < 1) s('line', { x1: x + LADO / 2, x2: x + LADO / 2, y1: YC - 4, y2: YC - 4 + (LADO + 8) * a, stroke: K.tinta, 'stroke-width': 3 }, S.nace);
      };
      // el mezclador, a la escala del eje de la gráfica
      S.resalte = s('rect', { x: X(0), y: YP - RP, width: X(ES.LEL) - X(0), height: 2 * RP, fill: K.amarilloClaro, opacity: 0 }, svg);
      s('rect', { x: X(-1.2), y: YP - RP, width: X(0) - X(-1.2), height: RP, fill: ACIDO }, svg);
      s('rect', { x: X(-1.2), y: YP, width: X(0) - X(-1.2), height: RP, fill: AGUA_E }, svg);
      for (var k = 0; k < ES.NEL; k++) {
        var a = X(ES.LEL * k) + 1.5, b = X(ES.LEL * (k + 1)) - 1.5, m = (a + b) / 2, arr = YP - RP + 2, aba = YP + RP - 2, y1 = k % 2 ? aba : arr, y2 = k % 2 ? arr : aba;
        s('path', { d: 'M' + a + ' ' + y1 + 'C' + m + ' ' + y1 + ' ' + m + ' ' + y2 + ' ' + b + ' ' + y2, fill: 'none', stroke: K.tinta2, 'stroke-width': 1.6 }, svg);
        s('path', { d: 'M' + a + ' ' + YP + 'C' + m + ' ' + (YP + (y1 - YP) / 2) + ' ' + m + ' ' + (YP + (y2 - YP) / 2) + ' ' + b + ' ' + YP, fill: 'none', stroke: K.tinta2, 'stroke-width': 0.8, 'stroke-opacity': 0.6 }, svg);
        D.t(svg, X(ES.LEL * (k + 0.5)), YP - RP - 6, String(k + 1), { tam: 12, ancla: 'middle', color: K.tinta2 });
        if (k) s('line', { x1: X(ES.LEL * k), x2: X(ES.LEL * k), y1: YP - RP, y2: YP + RP, stroke: K.rejilla, 'stroke-width': 1 }, svg);
      }
      s('path', { d: 'M' + X(-1.2) + ' ' + (YP - RP) + 'H' + (X(18) + 6) + 'M' + X(-1.2) + ' ' + (YP + RP) + 'H' + (X(18) + 6), fill: 'none', stroke: K.tinta, 'stroke-width': 2 }, svg);
      D.t(svg, X(-1.2), YP + RP + 18, 'mezclador KMS: 12 elementos de 1,5 D, numerados arriba', { tam: 13, color: K.tinta2 });
      // la gráfica del CoV
      var g = s('g', {}, svg);
      [0.5, 0.2, 0.1].forEach(function (c) { s('line', { x1: ES.X0, x2: ES.X1, y1: Y(c), y2: Y(c), stroke: K.rejilla, 'stroke-width': 1 }, g); });
      s('path', { d: 'M' + ES.X0 + ' ' + ES.Y0 + 'V' + ES.Y1 + 'H' + ES.X1, fill: 'none', stroke: K.eje, 'stroke-width': 1 }, g);
      [0, 3, 6, 9, 12, 15, 18].forEach(function (v) { s('line', { x1: X(v), x2: X(v), y1: ES.Y1, y2: ES.Y1 + 5, stroke: K.eje, 'stroke-width': 1 }, g); D.t(g, X(v), ES.Y1 + 20, String(v), { tam: 13, ancla: 'middle', color: K.tinta2 }); });
      [[1, '1'], [0.5, '0,5'], [0.2, '0,2'], [0.1, '0,1'], [0.05, '0,05'], [0.02, '0,02']].forEach(function (c) { D.t(g, ES.X0 - 8, Y(c[0]) + 5, c[1], { tam: 13, ancla: 'end', color: K.tinta2 }); });
      D.t(g, (ES.X0 + ES.X1) / 2, ES.Y1 + 42, 'largo desde la entrada, L/D', { tam: 13, ancla: 'middle', color: K.tinta2 });
      rotado(g, 18, (ES.Y0 + ES.Y1) / 2, 'CoV del ácido', { tam: 13, peso: 500, color: K.tinta2 });
      s('path', { d: 'M' + ES.X0 + ' ' + Y(0.05) + 'H' + ES.X1, fill: 'none', stroke: OL, 'stroke-width': 2, 'stroke-dasharray': '8 5' }, g);
      D.t(g, ES.X0 + 8, Y(0.05) + 18, 'CoV = 0,05: mezclado', { tam: 13, color: OL });
      S.curva = s('path', { d: '', fill: 'none', stroke: AZ, 'stroke-width': 2.4 }, svg);
      S.rotC = grupo(svg);
      D.t(S.rotC, ES.X0 + 8, Y(0.05) - 26, 'CoV = 0,87^{L/D}', { tam: 13, peso: 600 });
      D.t(S.rotC, ES.X0 + 8, Y(0.05) - 9, 'KMS en laminar: K_{iL} = 0,87 por diámetro', { tam: 13, color: K.tinta2 });
      S.pto = D.punto(svg, X(0), Y(1), { r: 5.5 });
      S.lect = D.t(svg, ES.X1, ES.Y0 + 4, '', { tam: 13, peso: 600, ancla: 'end' });
      S.ld = function (ld) {          // la curva y el punto hasta ld diámetros
        var pts = [], i; for (i = 0; i <= Math.round(ld * 4); i++) pts.push([X(i / 4), Y(ES.cov(i / 4))]);
        pts.push([X(ld), Y(ES.cov(ld))]);
        S.curva.setAttribute('d', dTrazo(pts));
        S.pto.setAttribute('cx', X(ld)); S.pto.setAttribute('cy', Y(ES.cov(ld)));
        D.ponerTexto(S.lect, 'L/D = ' + n(ld, ld % 1 ? 1 : 0) + ': CoV = ' + n(ES.cov(ld), 2));
        var el = Math.min(ES.NEL, Math.ceil(ld / ES.LEL - 1e-6));
        if (el >= 1) { S.resalte.setAttribute('x', X(ES.LEL * (el - 1))); S.resalte.setAttribute('opacity', 1); } else S.resalte.setAttribute('opacity', 0);
      };
      S.mostrar = function (hasta) { S.cortes.forEach(function (c) { c.g.setAttribute('opacity', c.k <= hasta ? 1 : 0); }); };
      S.mostrar(-1); S.ld(0);
      return S;
    },
    pasos: [
      { texto: 'En flujo laminar no hay remolinos que mezclen. Ácido y agua, mitad y mitad, entran lado a lado a un Kenics KMS de 12 elementos de cinta torcida, de 1,5 D cada uno y girados 90°. Con mitad y mitad, la <a href="#eq-mez-cov0">ecuación del CoV al empezar</a> da $\\mathrm{CoV}_0 = (0,5/0,5)^{1/2}$ = 1: una sola estría de espesor $D$, 50 mm en un tubo de 50 mm.', dur: 1.8, ir: function (S, t) { S.mostrar(0); S.cortes[0].g.setAttribute('opacity', T(t, 0, 0.5)); S.ld(0); D.ver(S.rotC, 0); } },
      { texto: 'El primer elemento parte la corriente en dos, estira cada mitad y apila las dos. Una estría es un par de capas, una de ácido y una de agua: salen 2 estrías de $D/2$, 25 mm. A los 1,5 diámetros, la <a href="#eq-mez-estatico">ecuación del mezclador estático</a> da $\\mathrm{CoV} = 0,87^{1,5}$ = 0,81.', dur: 3, ir: function (S, t) { S.mostrar(0); S.partir(0, T(t, 0, 0.85)); S.cortes[1].g.setAttribute('opacity', T(t, 0.85, 1)); S.ld(ES.LEL * T(t, 0, 0.85)); D.ver(S.rotC, T(t, 0.6, 1)); } },
      { texto: 'El segundo y el tercero hacen lo mismo con lo que reciben: 4 y 8 estrías, $2^{n_e}$, de espesor $D/2^{n_e}$, 12,5 y 6,3 mm. A los 4,5 diámetros, $\\mathrm{CoV} = 0,87^{4,5}$ = 0,53.', dur: 3.4, ir: function (S, t) { S.mostrar(1); var u = T(t, 0, 0.5), v = T(t, 0.5, 1); S.partir(u < 1 ? 1 : 2, u < 1 ? u * 1.18 : v * 1.18); S.cortes[2].g.setAttribute('opacity', u >= 0.85 ? 1 : 0); S.cortes[3].g.setAttribute('opacity', v >= 0.85 ? 1 : 0); S.ld(ES.LEL * (1 + Math.min(1, u * 1.18) + Math.min(1, v * 1.18))); D.ver(S.rotC, 1); } },
      { texto: 'Con cada elemento el número de estrías se duplica y su espesor se parte por la mitad: 16 con cuatro y 32 con cinco, de 3,1 y 1,6 mm, y con siete ya serían 128, de 0,39 mm. A los 7,5 diámetros, $\\mathrm{CoV} = 0,87^{7,5}$ = 0,35.', dur: 2.6, ir: function (S, t) { S.mostrar(3); var u = T(t, 0, 0.5), v = T(t, 0.5, 1); S.partir(u < 1 ? 3 : 4, u < 1 ? u * 1.18 : v * 1.18); S.cortes[4].g.setAttribute('opacity', u >= 0.85 ? 1 : 0); S.cortes[5].g.setAttribute('opacity', v >= 0.85 ? 1 : 0); S.ld(ES.LEL * (3 + Math.min(1, u * 1.18) + Math.min(1, v * 1.18))); D.ver(S.rotC, 1); } },
      { texto: 'Cuando las estrías son más finas de lo que se ve, la difusión las borra: con 12 elementos serían 4096, de 12 µm. El CoV medido del KMS en laminar baja con $\\mathrm{CoV}/\\mathrm{CoV}_0 = K_{iL}^{L/D}$, 0,87 por diámetro sin importar la viscosidad ni el caudal: a los 18 diámetros vale $0,87^{18}$ = 0,08, y llega a 0,05 a los 21,5. Cuándo se borran las estrías es del dibujo.', dur: 3, ir: function (S, t) { S.mostrar(5); S.partir(0, 0); D.ver(S.puntos, T(t, 0, 0.3)); S.cortes[6].g.setAttribute('opacity', T(t, 0.5, 0.9)); D.ver(S.leyMez, T(t, 0.5, 0.9)); S.ld(7.5 + (18 - 7.5) * T(t, 0, 0.9)); if (t >= 1) S.resalte.setAttribute('opacity', 0); } }
    ]
  });

  /* El ácido en la línea, como en el ejemplo: la línea, el CoV al inyectar, el KVM, el KMS y el SMX, y el tubo vacío. */
  var LI = (function () {
    var d = 0.06271, q = 25 / 3600, rho = 998.2, mu = 1.0016e-3, v = q / (Math.PI / 4 * d * d), re = rho * v * d / mu, f = colebrook(re, 0.046e-3 / d);
    var dpm = f * rho * v * v / 2 / d, aa = 9.8233e-4, c0 = cov0(aa);
    function ld(ki) { return Math.ceil(Math.log(0.05 / c0) / Math.log(ki) * 10 - 1e-9) / 10; }
    var M = { vacio: [0.95, 1, 'tubo vacío'], KVM: [0.42, 24, 'KVM (el caso)'], KMS: [0.50, 150, 'KMS'], SMX: [0.46, 500, 'SMX'] };
    Object.keys(M).forEach(function (k) { var m = M[k]; m.ld = ld(m[0]); m.L = m.ld * d; m.dp = m[1] * dpm * m.L; });
    return { d: d, v: v, re: re, f: f, dpm: dpm, aa: aa, c0: c0, M: M };
  })();
  ZB.animacion('linea', {
    vista: [0, 0, 640, 420],
    alt: 'Arriba, la línea de agua de 2½ in, 62,7 mm, con 25 m³/h a 2,25 m/s, la lanza que inyecta el ácido al centro y el mezclador estático. Abajo, el coeficiente de variación del ácido contra el largo en diámetros, de 0 a 40, en escala logarítmica de 0,01 a 100: arranca en 31,9 y baja en línea recta con cada mezclador hasta la meta de 0,05. El KVM llega en 7,5 diámetros, 0,47 m, con 9,3 kPa; el KMS en 9,4 diámetros con 73 kPa; el SMX en 8,4 con 217 kPa; y el tubo vacío necesita 126 diámetros, 7,9 m.',
    montar: function (svg) {
      var S = {}, M = LI.M;
      // la línea
      var y0 = 70, y1 = 106, xa = 30, xb = 620;
      s('rect', { x: xa, y: y0, width: xb - xa, height: y1 - y0, fill: AGUA }, svg);
      s('path', { d: 'M' + xa + ' ' + y0 + 'H' + xb + 'M' + xa + ' ' + y1 + 'H' + xb, stroke: K.tinta, 'stroke-width': 2, fill: 'none' }, svg);
      D.flecha(svg, xa + 6, (y0 + y1) / 2, xa + 60, (y0 + y1) / 2, { color: AZ, ancho: 2.4, punta: 9 });
      D.t(svg, xa, y0 - 12, 'agua, 25 m³/h; 2½ in, 62,7 mm', { tam: 12, color: K.tinta2 });
      S.lin = grupo(svg);
      D.t(S.lin, xa, y1 + 20, '2,25 m/s; Re = 141 000; f = 0,0205; 826 Pa/m', { tam: 12, peso: 600, color: AZ });
      S.lanza = grupo(svg);
      s('path', { d: 'M300 30V' + ((y0 + y1) / 2) + 'H325', stroke: K.tinta, 'stroke-width': 2.4, fill: 'none' }, S.lanza);
      s('path', { d: 'M325 ' + ((y0 + y1) / 2) + 'H372', stroke: ACIDO, 'stroke-width': 3, fill: 'none' }, S.lanza);
      D.t(S.lanza, 308, 34, 'ácido, 24,6 L/h: CoV_0 = 31,9', { tam: 12, peso: 600, color: MAT.acido.oscuro });
      S.mez = grupo(svg);
      s('rect', { x: 400, y: y0 + 2, width: 140, height: y1 - y0 - 4, fill: 'none', stroke: K.tinta, 'stroke-width': 1.4 }, S.mez);
      for (var i = 0; i < 4; i++) s('path', { d: 'M' + (402 + i * 35) + ' ' + (y0 + 3) + 'l30 ' + (y1 - y0 - 6) + 'M' + (402 + i * 35) + ' ' + (y1 - 3) + 'l30 ' + (-(y1 - y0 - 6)), stroke: K.tinta2, 'stroke-width': 1 }, S.mez);
      S.mezT = D.t(svg, 540, y1 + 20, '', { tam: 12, peso: 700, ancla: 'end', color: AZ });
      // la gráfica
      var E = ejesLog(svg, { x: 80, y: 160, w: 520, h: 200, lx0: 0, lx1: 0, ly0: -2, ly1: 2, yt: [0.01, 0.1, 1, 10, 100], yf: function (v) { return n(v, v < 0.1 ? 2 : v < 1 ? 1 : 0); }, yr: 'CoV del ácido' });
      var X = function (l) { return 80 + l / 40 * 520; }, Y = E.Y;
      [0, 10, 20, 30, 40].forEach(function (l) { s('line', { x1: X(l), x2: X(l), y1: 160, y2: 360, stroke: K.rejilla, 'stroke-width': 1 }, svg); D.t(svg, X(l), 376, String(l), { tam: 12, ancla: 'middle', color: K.tinta2 }); });
      D.t(svg, 600, 394, 'largo desde la inyección, L/D', { tam: 12, ancla: 'end', color: K.tinta2 });
      S.meta = grupo(svg);
      s('line', { x1: 80, x2: 600, y1: Y(0.05), y2: Y(0.05), stroke: OL, 'stroke-width': 1.6, 'stroke-dasharray': '7 5' }, S.meta);
      D.t(S.meta, 596, Y(0.05) + 16, 'meta: CoV = 0,05', { tam: 12, peso: 600, ancla: 'end', color: OL });
      D.punto(S.meta, X(0), Y(LI.c0), { r: 5 });
      function linea(k, col, guion) {
        var m = M[k], fin = Math.min(40, m.ld);
        var p = D.trazo(svg, dTrazo([[X(0), Y(LI.c0)], [X(fin), Y(LI.c0 * Math.pow(m[0], fin))]]), { color: col, ancho: 2.2, guion: guion });
        return p;
      }
      S.lKVM = linea('KVM', AZ); S.lKMS = linea('KMS', S3); S.lSMX = linea('SMX', S4); S.lvac = linea('vacio', K.tinta2, '7 5');
      function rot(k, txt, dy, col) { var g = grupo(svg), m = M[k]; if (m.ld <= 40) D.punto(g, X(m.ld), Y(0.05), { r: 4.5, color: k === 'KVM' ? K.caso : K.blanco }); D.t(g, k === 'vacio' ? 596 : X(m.ld) + 7, k === 'vacio' ? 200 : Y(0.05) + dy, txt, { tam: 12, peso: 600, ancla: k === 'vacio' ? 'end' : 'start', color: col, halo: K.blanco }); return g; }
      S.rKVM = rot('KVM', 'KVM: ' + n(M.KVM.ld, 1) + ' D, ' + n(M.KVM.L, 2) + ' m, ' + n(M.KVM.dp / 1000, 1) + ' kPa', -34, AZ);
      S.rKMS = rot('KMS', 'KMS: ' + n(M.KMS.ld, 1) + ' D, ' + n(M.KMS.dp / 1000, 0) + ' kPa', 18, S3);
      S.rSMX = rot('SMX', 'SMX: ' + n(M.SMX.ld, 1) + ' D, ' + n(M.SMX.dp / 1000, 0) + ' kPa', -14, S4);
      S.rvac = rot('vacio', 'tubo vacío: ' + n(M.vacio.ld, 0) + ' D, ' + n(M.vacio.L, 1) + ' m, ' + n(M.vacio.dp / 1000, 1) + ' kPa', 0, K.tinta2);
      return S;
    },
    pasos: [
      { texto: 'La línea que llena el reactor: 25 m³/h en el tubo de 2½ in cédula 40, de 62,7 mm, así que $v = Q/(\\pi D^2/4)$ = 2,25 m/s, y con agua a 20 °C, $\\mathrm{Re}$ = 141 000. La ecuación de Colebrook, con los 0,046 mm del acero comercial, da $f$ = 0,0205, y el tubo vacío pierde $f \\rho v^2/(2D) = 0,0205 \\times 998 \\times 2,25^2/(2 \\times 0,0627)$ = 826 Pa por metro.', dur: 1.8, ir: function (S, t) { D.ver(S.lin, t); } },
      { texto: 'El ácido entra por la lanza, al centro, en la proporción del lote: 24,6 L/h, $\\alpha_a$ = 9,82 × 10⁻⁴. Con la <a href="#eq-mez-cov0">ecuación del CoV al empezar</a>, $\\mathrm{CoV}_0 = ((1 - \\alpha_a)/\\alpha_a)^{1/2}$ = 31,9, y la meta es 0,05.', dur: 1.6, ir: function (S, t) { D.ver(S.lanza, t); D.ver(S.meta, T(t, 0.3, 1)); } },
      { texto: 'El KVM, de vórtice, con $K_{iT}$ = 0,42: la <a href="#eq-mez-estatico">ecuación del mezclador estático</a> da $L/D = \\ln(0,05/31,9)/\\ln 0,42$ = 7,45, que se redondea hacia arriba a 7,5 diámetros, 0,47 m. Con $K_T$ = 24, la <a href="#eq-mez-dp">caída</a> es $24 \\times 826 \\times 0,47$ = 9,3 kPa.', dur: 2, ir: function (S, t) { D.ver(S.mez, T(t, 0, 0.3)); D.ponerTexto(S.mezT, t > 0.3 ? 'KVM: 0,47 m; 9,3 kPa' : ''); S.lKVM.dibujar(T(t, 0.2, 0.8)); D.ver(S.rKVM, T(t, 0.7, 1)); } },
      { texto: 'El KMS, con $K_{iT}$ = 0,50 y $K_T$ = 150, pide 9,4 diámetros, 0,59 m, y 73 kPa, ocho veces la caída del KVM. El SMX, de los mejores en laminar, con 0,46 y 500, pide 8,4 diámetros y 217 kPa en este servicio.', dur: 2, ir: function (S, t) { S.lKMS.dibujar(T(t, 0, 0.6)); D.ver(S.rKMS, T(t, 0.4, 0.8)); S.lSMX.dibujar(T(t, 0.3, 0.9)); D.ver(S.rSMX, T(t, 0.7, 1)); } },
      { texto: 'El tubo vacío, con $K_{iT}$ = 0,95, también mezcla, pero pide 126 diámetros, 7,9 m de tramo recto sin codos, con 6,5 kPa. En turbulento, el mezclador de vórtice hace el trabajo en medio metro con pocos kilopascales.', dur: 1.8, ir: function (S, t) { S.lvac.dibujar(t); D.ver(S.rvac, T(t, 0.5, 1)); } }
    ]
  });

  /* Reto: el largo de un mezclador, su caída y la T de Forney y Lee con el Froude densimétrico. */

  /* ================= 15.9 Homogeneizar ================= */

  /* La leche homogeneizada: dos botellas de 29 cm con los glóbulos al cabo de un día, antes y después, y los números
     del ejemplo: las densidades de Choi y Okos, Stokes, la bomba y el calor. */
  var LE = (function () {
    var tc = 20, w = { agua: 0.908, proteina: 0.034, carbohidratos: 0.049, grasa: 0.002, ceniza: 0.008 };
    var rho = { agua: 997.18 + 0.0031439 * tc - 0.0037574 * tc * tc, proteina: 1329.9 - 0.51840 * tc, grasa: 925.59 - 0.41757 * tc, carbohidratos: 1599.1 - 0.31046 * tc, ceniza: 2423.8 - 0.28063 * tc };
    var inv = 0; Object.keys(w).forEach(function (k) { inv += w[k] / rho[k]; });
    var rc = 1 / inv, dr = rc - rho.grasa, mu = 1.8e-3, v = function (d) { return G * d * d * dr / (18 * mu); };
    return { rc: rc, rd: rho.grasa, dr: dr, v: v, P: 10 / 3600 * 19.7e6 };
  })();
  ZB.animacion('leche', {
    vista: [0, 0, 640, 400],
    alt: 'Dos botellas de leche de 29 cm, una antes de homogeneizar y otra después, con los glóbulos de grasa al cabo de un día. Antes, los glóbulos de 10 µm suben 29 cm y forman la crema arriba, y el glóbulo medio de 3,5 µm sube 3,5 cm. Después, el glóbulo medio de 0,8 µm sube apenas 1,8 mm. A la derecha, las densidades de Choi y Okos a 20 °C, 1027 kg/m³ la leche descremada y 917 la grasa; la velocidad de Stokes, 4,1 × 10⁻⁷ m/s antes y 19 veces menos después; la bomba, 55 kW a la leche y 68 kW del motor; y el calentamiento, unos 5 °C.',
    montar: function (svg) {
      var S = {}, yb = 360, esc = 10;    // 10 px por centímetro: la botella de 29 cm mide 290 px
      function botella(x, txt) {
        var g = s('g', {}, svg);
        s('path', { d: 'M' + x + ' ' + (yb - 290) + 'V' + yb + 'H' + (x + 80) + 'V' + (yb - 290), fill: LECHE, stroke: K.tinta, 'stroke-width': 2 }, g);
        D.t(g, x + 40, yb + 20, txt, { tam: 12, peso: 700, ancla: 'middle' });
        return g;
      }
      botella(70, 'antes'); botella(186, 'después');
      s('line', { x1: 58, x2: 58, y1: yb, y2: yb - 290, stroke: K.tinta2, 'stroke-width': 1 }, svg);
      [0, 10, 20, 29].forEach(function (c) { s('line', { x1: 54, x2: 58, y1: yb - c * esc, y2: yb - c * esc, stroke: K.tinta2, 'stroke-width': 1 }, svg); D.t(svg, 51, yb - c * esc + 4, c + ' cm', { tam: 12, ancla: 'end', color: K.tinta2 }); });
      // los glóbulos: cada uno sube lo que da Stokes en el tiempo del paso
      var sem = 11; function az() { sem = (sem * 9301 + 49297) % 233280; return sem / 233280; }
      S.antes = []; S.despues = [];
      for (var i = 0; i < 46; i++) {
        var d = i % 6 === 0 ? 10e-6 : i % 3 === 0 ? 1.5e-6 : 3.5e-6, x = 78 + az() * 64, h0 = az() * 26;
        S.antes.push({ c: s('circle', { cx: x, cy: yb - h0 * esc, r: d > 5e-6 ? 3.6 : d > 2e-6 ? 2.6 : 1.8, fill: GRASA, stroke: MAT.aceite.oscuro, 'stroke-width': 0.6 }, svg), h0: h0, v: LE.v(d) * 100 });
        var h1 = az() * 28;
        S.despues.push({ c: s('circle', { cx: 194 + az() * 64, cy: yb - h1 * esc, r: 1.4, fill: GRASA, stroke: MAT.aceite.oscuro, 'stroke-width': 0.5 }, svg), h0: h1, v: LE.v(0.8e-6) * 100 });
      }
      S.crema = s('rect', { x: 71, y: yb - 289, width: 78, height: 0, fill: MAT.aceite.relleno }, svg);
      S.reloj = D.t(svg, 168, 46, '', { tam: 12.5, peso: 700, ancla: 'middle', color: AZ });
      S.subir = function (dias, cual) {     // posiciones al cabo de «dias» días (cm/s × s)
        (cual === 'antes' ? S.antes : S.despues).forEach(function (g) { var h = Math.min(28.6, g.h0 + g.v * dias * 86400); g.c.setAttribute('cy', yb - h * esc); });
      };
      // la columna de la derecha
      var x = 312;
      S.r = [grupo(svg), grupo(svg), grupo(svg), grupo(svg), grupo(svg)];
      lineas(S.r[0], x, 40, ['Las densidades a 20 °C, con Choi y Okos', 'leche descremada: ' + n(LE.rc, 0) + ' kg/m³', 'grasa: 925,59 − 0,41757 × 20 = ' + n(LE.rd, 0) + ' kg/m³', 'Δρ = ' + n(LE.dr, 0) + ' kg/m³; μ = 1,8 mPa·s'], { titulo: true });
      lineas(S.r[1], x, 124, ['Antes: 3,5 µm', 'v_t = ' + n(LE.v(3.5e-6) * 1e7, 1) + ' × 10^{−7} m/s: ' + n(LE.v(3.5e-6) * 86400 * 100, 1) + ' cm por día', '10 µm: ' + n(LE.v(10e-6) * 86400 * 100, 0) + ' cm por día, la botella entera'], { titulo: true, colorT: AZ });
      lineas(S.r[2], x, 191, ['Después: 0,8 µm', '(3,5/0,8)² = ' + n(Math.pow(3.5 / 0.8, 2), 0) + ' veces más despacio', n(LE.v(0.8e-6) * 86400 * 1000, 1) + ' mm por día; en 48 h, ' + n(LE.v(0.8e-6) * 172800 * 1000, 1) + ' mm'], { titulo: true, colorT: OL });
      lineas(S.r[3], x, 258, ['La bomba', 'Q Δp = (10/3600) × 19,7 × 10^6 = ' + n(LE.P / 1000, 0) + ' kW', 'motor: 55/(0,85 × 0,95) = ' + n(LE.P / 1000 / 0.85 / 0.95, 0) + ' kW'], { titulo: true, colorT: S3 });
      lineas(S.r[4], x, 325, ['El calor', '1 °C por cada 4 MPa: 20/4 = 5 °C', 'que el pasteurizador cuenta en su balance'], { titulo: true, colorT: AL });
      return S;
    },
    pasos: [
      { texto: 'Las densidades a 20 °C, con el <a href="#eq-mez-choi">modelo de Choi y Okos</a>: la leche descremada, con 90,8 % de agua, 3,4 % de proteína, 4,9 % de carbohidratos, 0,2 % de grasa y 0,8 % de ceniza, da $1/\\rho = \\sum w_i/\\rho_i$, 1027 kg/m³; la grasa, $925,59 - 0,41757 \\times 20$ = 917 kg/m³. La diferencia es 110 kg/m³, y la leche descremada tiene 1,8 mPa·s.', dur: 1.8, ir: function (S, t) { D.ver(S.r[0], t); S.subir(0, 'antes'); S.subir(0, 'despues'); S.crema.setAttribute('height', 0); D.ponerTexto(S.reloj, 'al ordeñar'); } },
      { texto: 'Antes de homogeneizar, con la <a href="#eq-mez-stokes">ley de Stokes con la diferencia al revés</a>: $v_t = 9,81 \\times (3,5 \\times 10^{-6})^2 \\times 110/(18 \\times 0,0018)$ = 4,1 × 10⁻⁷ m/s, 1,5 mm por hora y 3,5 cm por día. Un glóbulo de 10 µm sube 29 cm en un día, todo el alto de la botella: la crema se forma arriba en un día.', dur: 2.6, ir: function (S, t) { D.ver(S.r[1], T(t, 0, 0.3)); S.subir(t, 'antes'); S.crema.setAttribute('height', 14 * T(t, 0.6, 1)); D.ponerTexto(S.reloj, 'al cabo de ' + n(24 * t, 0) + ' h'); } },
      { texto: 'Después de homogeneizar, el glóbulo medio mide 0,8 µm, y la velocidad baja con el cuadrado del diámetro, $(3,5/0,8)^2$ = 19 veces: 1,8 mm por día. En la prueba de las 48 h, el glóbulo medio sube 7 cm antes y menos de 4 mm después.', dur: 2.4, ir: function (S, t) { D.ver(S.r[2], T(t, 0, 0.3)); S.subir(1, 'antes'); S.crema.setAttribute('height', 14); S.subir(t, 'despues'); D.ponerTexto(S.reloj, 'al cabo de 24 h'); } },
      { texto: 'La bomba sube la leche de unos 0,3 MPa a la presión de homogeneización, 20 MPa, que ya incluye la segunda etapa. La potencia que le entrega es la de la <a href="bombas.html#eq-potencia-dp">ecuación de la potencia con la diferencia de presión</a> del capítulo 11, sin la eficiencia: $Q\\,\\Delta p = (10/3600) \\times 19,7 \\times 10^6$ = 55 kW, y con 0,85 de la bomba y 0,95 del motor, el motor toma 68 kW. Menos de 1 % de esa energía rompe los glóbulos.', dur: 2, ir: function (S, t) { D.ver(S.r[3], t); } },
      { texto: 'Casi toda la energía se vuelve calor en la válvula: a 1 °C por cada 4 MPa, los 20 MPa calientan la leche unos 5 °C. Homogeneizar ataca el diámetro, el factor que más pesa en la ley de Stokes, y lo paga con una bomba de casi 70 kW para 10 m³/h y unos grados que el pasteurizador tiene que contar.', dur: 1.8, ir: function (S, t) { D.ver(S.r[4], t); } }
    ]
  });

  /* Reto: la subida de un glóbulo, la prueba de las 48 h y la bomba del homogeneizador. */
})();

