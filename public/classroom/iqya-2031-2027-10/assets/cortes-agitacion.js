/* Los tanques agitados del capítulo 14 del libro, «Agitación», en corte y con el flujo que se mueve: copia de
   libro/figuras/agitacion/cortes.js del repositorio del libro, para la presentación de agitación y mezclado de
   2027-10. No se edita aquí; cuando cambia en el libro se vuelve a copiar. */
/* Los tanques agitados del capítulo 14 (Agitación), en 2D: el corte del tanque por el plano del eje, con los bafles
   contra la pared, el impulsor de frente y las líneas de flujo del líquido, con flechas que avanzan por ellas.
   Las líneas son curvas de nivel de una función de corriente de celdas, ψ = sen(πx)·sen(πy) en coordenadas estiradas
   para que el centro de cada lazo quede donde lo ponen las fuentes: un lazo para los impulsores axiales (baja por el
   impulsor, sale por el fondo, sube por la pared y vuelve por arriba), dos para los radiales (el chorro sale hacia la
   pared y se parte arriba y abajo) y uno al revés para la cinta (sube por la pared y baja por el centro). Las flechas
   van más rápido donde las líneas se juntan y en el chorro del impulsor; la mitad izquierda es el espejo de la
   derecha, con el mismo sentido de giro del lazo visto desde el eje. El ancla y la cinta hacen girar el líquido, y
   eso se ve en la vista en planta de al lado. Son esquemas, no mediciones.
   Cada dibujo se arma en un <g> de un SVG de 400 × 320 con tanque(g, op), que devuelve poner(op), cuadro(dt) y
   medidas(). Los usan las pestañas de los impulsores y los recuadros «Pruebe» del capítulo, que además ponen la
   cáscara (que flota o se hunde) y el gas (inundado, cargado o disperso). Con «reducir movimiento» las pestañas
   arrancan quietas. Sin dependencias. */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  // Los colores, de la paleta del libro (figuras/comun/paleta.js): el metal en sus tres tonos, el líquido, el flujo
  // en azul, la cáscara, el aire y la tinta (o el ácido) con su material.
  var PA = window.PALETA, CO = PA.cortes, M = PA.materiales;
  var K = {
    navy: CO.trazo, sec: PA.base['tinta-2'], pared: CO.pieza, pieza: CO['pieza-media'], piezaOsc: CO['pieza-oscura'],
    pala: CO['pieza-media'], palaAtras: CO.pieza, liq: CO.liquido, flujo: CO.flujo, solido: M.cascara.oscuro,
    aire: M.gas.relleno, tinta: M.acido.oscuro
  };
  var RAD = Math.PI / 180;

  function s(tag, a, padre, texto) {
    var e = document.createElementNS(NS, tag);
    for (var k in a || {}) e.setAttribute(k, a[k]);
    if (texto != null) e.textContent = texto;
    if (padre) padre.appendChild(e);
    return e;
  }
  function f1(x) { return x.toFixed(1); }
  function camino(pts, cerrar) { return pts.map(function (p, i) { return (i ? 'L' : 'M') + f1(p[0]) + ' ' + f1(p[1]); }).join('') + (cerrar ? 'Z' : ''); }
  function limpiar(c) { while (c.firstChild) c.removeChild(c.firstChild); }

  // Qué hace cada impulsor: palas, diámetro típico, altura sobre el fondo y patrón de flujo
  var IMP = {
    helice:    { palas: 3, forma: 'helice', DT: 0.30, CT: 0.30, patron: 'axial' },
    pbt:       { palas: 4, forma: 'inclinada', DT: 1 / 3, CT: 1 / 3, patron: 'axial' },
    hidrofoil: { palas: 3, forma: 'hidrofoil', DT: 0.40, CT: 0.30, patron: 'axial' },
    rushton:   { palas: 6, forma: 'rushton', DT: 1 / 3, CT: 1 / 3, patron: 'radial' },
    paleta:    { palas: 2, forma: 'paleta', DT: 0.50, CT: 1 / 3, patron: 'radial' },
    ancla:     { palas: 2, forma: 'ancla', DT: 0.92, CT: 0.03, patron: 'giro' },
    cinta:     { palas: 2, forma: 'cinta', DT: 0.92, CT: 0.03, patron: 'cinta' }
  };

  // ── Las líneas de flujo de una celda ───────────────────────────────────
  // La celda ocupa r de r0 a r1 y z de z0 a z1 (px), con su centro en (rc, zc); el mapeo x^a pone el centro donde se pide.
  function celda(r0, r1, rc, z0, z1, zc) {
    var a = Math.log((rc - r0) / (r1 - r0)) / Math.log(0.5), b = Math.log((zc - z0) / (z1 - z0)) / Math.log(0.5);
    return { r0: r0, r1: r1, a: a, z0: z0, z1: z1, b: b,
      r: function (x) { return r0 + (r1 - r0) * Math.pow(x, a); }, z: function (y) { return z0 + (z1 - z0) * Math.pow(y, b); } };
  }
  // La curva ψ = c, cerrada, recorrida en sentido antihorario en (r, z): por abajo hacia afuera, sube por afuera,
  // vuelve por arriba hacia adentro y baja por adentro. Cada punto lleva [r, z, rapidez relativa].
  function curva(cel, c, impulso) {
    var x1 = Math.asin(c) / Math.PI, x2 = 1 - x1, n = 40, abajo = [], arriba = [];
    for (var i = 0; i <= n; i++) {
      var u = i / n, x = x1 + (x2 - x1) * (1 - Math.cos(Math.PI * u)) / 2, sx = Math.sin(Math.PI * x);
      var y = Math.asin(Math.min(1, c / Math.max(sx, 1e-9))) / Math.PI;
      abajo.push([x, y]); arriba.push([x, 1 - y]);
    }
    var pts = abajo.concat(arriba.reverse().slice(1, -1));
    return pts.map(function (p) {
      var x = p[0], y = p[1];
      var g = Math.hypot(Math.cos(Math.PI * x) * Math.sin(Math.PI * y), Math.sin(Math.PI * x) * Math.cos(Math.PI * y));
      var r = cel.r(x), z = cel.z(y);
      return [r, z, 0.35 + g * (1 + (impulso ? impulso(r, z) : 0))];
    });
  }

  // ════════════════════════════════════════════════════════════════════
  // El tanque en corte
  // ════════════════════════════════════════════════════════════════════
  function tanque(g, op) {
    var o = { imp: 'pbt', HT: 1, bafles: true, v: 1, solidos: 0 };
    for (var k0 in op || {}) o[k0] = op[k0];
    var cx, yb, Rt, Hp, J, cap = {}, th = 0;
    var capas = { fondo: s('g', {}, g), lineas: s('g', {}, g), atras: s('g', {}, g), eje: s('g', {}, g), frente: s('g', {}, g),
      flechas: s('g', {}, g), cosas: s('g', {}, g), pared: s('g', {}, g), planta: s('g', {}, g) };
    var lineas = [], flechas = [], sol = [], burb = [], plantaFl = [], celdas = [], tin = [];

    function P(r, z) { return [cx + r, yb - z]; }
    function conPlanta() { return IMP[o.imp].patron === 'giro' || IMP[o.imp].patron === 'cinta'; }

    function geometria() {
      var i = IMP[o.imp], cerca = i.patron === 'giro' || i.patron === 'cinta';
      Rt = Math.min(98, 112 / o.HT);
      Hp = 2 * Rt * o.HT;
      yb = 302;
      cx = conPlanta() ? 160 : 200;
      J = o.bafles && !cerca ? 2 * Rt / 10 : 0;
      cap.D = 2 * Rt * (cerca ? i.DT : (o.DT || i.DT));
      cap.R = cap.D / 2;
      cap.zc = cerca ? 0.03 * Hp : 2 * Rt * (o.CT || i.CT);
    }

    // ── El tanque, los bafles, el motor y el eje
    function dibujarTanque() {
      ['fondo', 'pared'].forEach(function (k) { limpiar(capas[k]); });
      var top = Hp + 0.14 * Rt, e = 5;
      s('rect', { x: f1(cx - Rt), y: f1(yb - Hp), width: f1(2 * Rt), height: f1(Hp), fill: K.liq }, capas.fondo);
      s('path', { d: 'M' + f1(cx - Rt) + ' ' + f1(yb - Hp) + 'H' + f1(cx + Rt), stroke: K.flujo, 'stroke-width': 1.2, opacity: 0.6 }, capas.fondo);
      if (J) [-1, 1].forEach(function (lado) {
        var x = lado > 0 ? cx + Rt - J - 3 : cx - Rt + 3;
        s('rect', { x: f1(x), y: f1(yb - Hp - 0.06 * Rt), width: f1(J), height: f1(Hp + 0.06 * Rt - 0.03 * Hp), fill: K.pared, stroke: K.navy, 'stroke-width': 0.9 }, capas.pared);
      });
      // paredes y fondo del corte
      s('path', { d: 'M' + f1(cx - Rt - e / 2) + ' ' + f1(yb - top) + 'V' + f1(yb + e / 2) + 'H' + f1(cx + Rt + e / 2) + 'V' + f1(yb - top),
        fill: 'none', stroke: K.navy, 'stroke-width': e, 'stroke-linejoin': 'round' }, capas.pared);
      s('path', { d: 'M' + f1(cx - Rt - e / 2) + ' ' + f1(yb - top) + 'V' + f1(yb + e / 2) + 'H' + f1(cx + Rt + e / 2) + 'V' + f1(yb - top),
        fill: 'none', stroke: K.pared, 'stroke-width': e - 2.4, 'stroke-linejoin': 'round' }, capas.pared);
      // puente, reductor y motor
      var yr = yb - top;
      s('rect', { x: f1(cx - Rt - 10), y: f1(yr - 6), width: f1(2 * Rt + 20), height: 6, fill: K.pieza, stroke: K.navy, 'stroke-width': 1 }, capas.pared);
      s('rect', { x: cx - 16, y: f1(yr - 26), width: 32, height: 20, rx: 2, fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1.1 }, capas.pared);
      s('rect', { x: cx - 12, y: f1(Math.max(2, yr - 48)), width: 24, height: f1(Math.min(22, yr - 28)), rx: 3, fill: K.pieza, stroke: K.navy, 'stroke-width': 1.1 }, capas.pared);
      limpiar(capas.eje);
      var zt = IMP[o.imp].patron === 'giro' || IMP[o.imp].patron === 'cinta' ? 0.05 * Hp : cap.zc;
      s('rect', { x: cx - 2.5, y: f1(yr - 6), width: 5, height: f1(yb - zt - yr + 6), fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 0.8 }, capas.eje);
    }

    // ── Las líneas de flujo según el patrón
    function armarLineas() {
      var i = IMP[o.imp], R = cap.R, zc = cap.zc, rIn = 4, rOut = Rt - J - (J ? 7 : 6), zLo = 0.035 * Hp, zHi = Hp - 0.035 * Hp;
      celdas = []; cap.rIn = rIn; cap.rOut = rOut; cap.zLo = zLo; cap.zHi = zHi;
      var niveles = [0.18, 0.5, 0.82];
      if (i.patron === 'axial') {
        // un lazo: baja por el impulsor, sale por el fondo, sube por la pared y vuelve por arriba
        var cel = celda(rIn, rOut, Math.max(R * 1.25, 0.5 * rOut), zLo, zHi, Math.min(zHi - 20, zc + 0.22 * Hp));
        var imp = function (r, z) { return 1.6 * Math.exp(-Math.pow((r - 0.6 * R) / (0.6 * R), 2) - Math.pow((z - zc) / (0.35 * Hp), 2)); };
        celdas.push({ cel: cel, imp: imp, sentido: 1 });
      } else if (i.patron === 'radial') {
        // dos lazos: el chorro sale hacia la pared a la altura del impulsor y se parte arriba y abajo
        var jet = function (r, z) { return 1.8 * Math.exp(-Math.pow((z - zc) / (0.08 * Hp), 2)) * (r > 0.7 * R ? 1 : 0.3); };
        var sup = celda(rIn, rOut, 0.58 * rOut, zc, zHi, zc + 0.45 * (zHi - zc));
        var inf = celda(rIn, rOut, 0.58 * rOut, zLo, zc, zLo + 0.55 * (zc - zLo));
        celdas.push({ cel: sup, imp: jet, sentido: 1 });     // arriba: sale por abajo, sube por la pared, baja por el eje
        celdas.push({ cel: inf, imp: jet, sentido: -1 });    // abajo: sale por arriba, baja por la pared, sube por el eje
      } else if (i.patron === 'cinta') {
        // la cinta sube el líquido junto a la pared y lo deja bajar por el centro
        var cc = celda(rIn, Rt - 8, 0.45 * Rt, zLo, zHi, 0.5 * Hp);
        var pared = function (r) { return 1.2 * Math.max(0, (r - 0.7 * Rt) / (0.3 * Rt)); };
        celdas.push({ cel: cc, imp: pared, sentido: 1 });
      }
      lineas = [];
      celdas.forEach(function (ce) { niveles.forEach(function (c) { [1, -1].forEach(function (lado) { lineas.push(linea(ce, c, lado)); }); }); });
    }
    // una línea de flujo de nivel c en la celda, del lado derecho (1) o izquierdo (−1): la izquierda es el espejo,
    // r → −r con el mismo orden de puntos, que conserva el sentido del lazo visto desde el eje
    function linea(ce, c, lado) {
      var pts = curva(ce.cel, c, ce.imp);
      if (ce.sentido < 0) pts.reverse();
      return preparar(pts.map(function (p) { return [lado * p[0], p[1], p[2]]; }));
    }
    // La velocidad del líquido en (r, z), en px/s a la velocidad de giro 1: tangente a las líneas de flujo, con la misma
    // rapidez que las flechas. Fuera de las celdas (junto al eje, a la pared, al fondo o a la superficie) es cero.
    function campo(r, z) {
      var ra = Math.abs(r);
      for (var k = 0; k < celdas.length; k++) {
        var ce = celdas[k], c = ce.cel;
        if (ra < c.r0 || ra > c.r1 || z < c.z0 || z > c.z1) continue;
        var x = Math.max(1e-3, Math.min(1 - 1e-3, Math.pow((ra - c.r0) / (c.r1 - c.r0), 1 / c.a)));
        var y = Math.max(1e-3, Math.min(1 - 1e-3, Math.pow((z - c.z0) / (c.z1 - c.z0), 1 / c.b)));
        var px = Math.PI * Math.cos(Math.PI * x) * Math.sin(Math.PI * y), py = Math.PI * Math.sin(Math.PI * x) * Math.cos(Math.PI * y);
        var dr = (c.r1 - c.r0) * c.a * Math.pow(x, c.a - 1) * py, dz = -(c.z1 - c.z0) * c.b * Math.pow(y, c.b - 1) * px;
        var n = Math.hypot(dr, dz) || 1, g = Math.hypot(px, py) / Math.PI;
        var rap = 55 * (0.35 + g * (1 + (ce.imp ? ce.imp(ra, z) : 0))) * ce.sentido;
        return [(r < 0 ? -1 : 1) * rap * dr / n, rap * dz / n];
      }
      return [0, 0];
    }
    // cada burbuja que anda en el líquido va por su propia línea, con un nivel al azar
    function lineaSuelta(j) {
      if (!celdas.length) return null;
      var ce = celdas[j % celdas.length], c = 0.08 + 0.86 * ((j * 0.6180339) % 1);
      return linea(ce, c, (j * 7) % 2 ? -1 : 1);
    }
    // longitud y tiempo de viaje a lo largo de una línea cerrada
    function preparar(pts) {
      var n = pts.length, s0 = [0], t0 = [0];
      for (var k = 1; k <= n; k++) {
        var a = pts[k - 1], b = pts[k % n], d = Math.hypot(b[0] - a[0], b[1] - a[1]);
        s0.push(s0[k - 1] + d); t0.push(t0[k - 1] + d / (55 * (a[2] + b[2]) / 2));
      }
      return { p: pts, s: s0, t: t0, L: s0[n], T: t0[n], fase: Math.random() };
    }
    function enTiempo(li, tau) {
      var t = li.t, p = li.p, n = p.length, lo = 0, hi = n;
      while (hi - lo > 1) { var m = (lo + hi) >> 1; if (t[m] <= tau) lo = m; else hi = m; }
      var a = p[lo], b = p[(lo + 1) % n], u = (tau - t[lo]) / Math.max(1e-9, t[lo + 1] - t[lo]);
      return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, Math.atan2(-(b[1] - a[1]), b[0] - a[0])];
    }
    function dibujarLineas() {
      limpiar(capas.lineas); limpiar(capas.flechas); flechas = [];
      lineas.forEach(function (li) {
        s('path', { d: camino(li.p.map(function (q) { return P(q[0], q[1]); }), true), fill: 'none', stroke: K.flujo, 'stroke-width': 1.3, opacity: 0.35 }, capas.lineas);
        var n = Math.max(2, Math.round(li.L / 48));
        for (var k = 0; k < n; k++) flechas.push({ li: li, k: k, n: n, e: s('path', { d: 'M6.5 0L-4.5 -4.6L-1.5 0L-4.5 4.6Z', fill: K.flujo }, capas.flechas) });
      });
    }
    function moverFlechas(dt) {
      var v = o.vflujo != null ? o.vflujo : o.v;
      lineas.forEach(function (li) { li.fase = (li.fase + dt * v / li.T) % 1; });
      flechas.forEach(function (f) {
        var q = enTiempo(f.li, ((f.li.fase + f.k / f.n) % 1) * f.li.T), pt = P(q[0], q[1]);
        f.e.setAttribute('transform', 'translate(' + f1(pt[0]) + ' ' + f1(pt[1]) + ') rotate(' + f1(q[2] / RAD) + ')');
        f.e.setAttribute('opacity', v > 0.01 ? 0.95 : 0.4);
      });
    }

    // ── El impulsor de frente: cada pala se proyecta según su ángulo; las de atrás van claras y detrás del eje
    function pala(r0, r1, w, alfa, z, ang, ancho) {
      var n = 8, a = [], b = [], c = Math.cos(ang), sn = Math.sin(ang);
      for (var i = 0; i <= n; i++) {
        var r = r0 + (r1 - r0) * i / n, al = (typeof alfa === 'function' ? alfa(r) : alfa) * RAD, ww = (ancho ? ancho(r) : w) / 2;
        a.push([r * c - ww * sn * Math.cos(al), z + ww * Math.sin(al)]);
        b.push([r * c + ww * sn * Math.cos(al), z - ww * Math.sin(al)]);
      }
      return { pts: a.concat(b.reverse()), atras: sn > 0 };
    }
    function dibujarImpulsor() {
      limpiar(capas.atras); limpiar(capas.frente);
      var i = IMP[o.imp], R = cap.R, z = cap.zc;
      if (i.forma === 'ancla') return dibujarAncla();
      if (i.forma === 'cinta') return dibujarCinta();
      for (var k = 0; k < i.palas; k++) {
        var ang = th + 2 * Math.PI * k / i.palas, p;
        if (i.forma === 'inclinada') p = pala(0.16 * R, R, 0.4 * R, 45, z, ang);
        else if (i.forma === 'paleta') p = pala(0.08 * R, R, 0.45 * R, 90, z, ang);
        else if (i.forma === 'rushton') p = pala(0.5 * R, R, 0.4 * R, 90, z, ang);
        else if (i.forma === 'helice') p = pala(0.16 * R, R, 0, function (r) { return Math.atan(2 * R / (2 * Math.PI * r)) / RAD; }, z, ang,
          function (r) { var t = (r / R - 0.16) / 0.84; return R * (0.32 + 0.9 * Math.sin(Math.PI * Math.min(1, t * 0.92)) * (1 - 0.35 * t)); });
        else p = pala(0.14 * R, R, 0, function (r) { return 34 - 14 * (r / R); }, z, ang,
          function (r) { var t = r / R; return R * (t < 0.9 ? 0.42 : 0.42 * Math.sqrt(Math.max(0, 1 - (t - 0.9) / 0.1)) + 0.06); });
        s('path', { d: camino(p.pts.map(function (q) { return P(q[0], q[1]); }), true), fill: p.atras ? K.palaAtras : K.pala, stroke: K.navy,
          'stroke-width': 1, 'stroke-linejoin': 'round' }, p.atras ? capas.atras : capas.frente);
      }
      if (i.forma === 'rushton') s('rect', { x: f1(cx - 0.75 * R), y: f1(yb - z - 1.5), width: f1(1.5 * R), height: 3, fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 0.8 }, capas.atras);
      s('rect', { x: cx - 5, y: f1(yb - z - 0.2 * R), width: 10, height: f1(0.4 * R), rx: 2, fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1 }, capas.frente);
    }
    function dibujarAncla() {
      var R = cap.R, z0 = 0.04 * Hp, z1 = 0.8 * Hp;
      [0, Math.PI].forEach(function (d) {
        var a = th + d, x = R * Math.cos(a), w = 3 + 4 * Math.abs(Math.sin(a)), atras = Math.sin(a) > 0;
        s('rect', { x: f1(cx + x - w / 2), y: f1(yb - z1), width: f1(w), height: f1(z1 - z0), fill: atras ? K.palaAtras : K.pala, stroke: K.navy, 'stroke-width': 1 }, atras ? capas.atras : capas.frente);
      });
      var x = R * Math.cos(th);
      s('rect', { x: f1(cx - Math.abs(x)), y: f1(yb - z0 - 3), width: f1(2 * Math.abs(x)), height: 6, fill: K.pala, stroke: K.navy, 'stroke-width': 1 }, capas.frente);
      s('rect', { x: cx - 2.5, y: f1(yb - z1), width: 5, height: f1(z1 - z0), fill: K.piezaOsc }, capas.frente);
    }
    function dibujarCinta() {
      var R = cap.R, z0 = 0.05 * Hp, z1 = 0.92 * Hp;
      [0, Math.PI].forEach(function (d) {
        var tramo = [], atrasAnt = null;
        function cerrar() { if (tramo.length > 1) s('path', { d: camino(tramo), fill: 'none', stroke: atrasAnt ? K.palaAtras : K.pala, 'stroke-width': 6, 'stroke-linecap': 'round' }, atrasAnt ? capas.atras : capas.frente); }
        for (var k = 0; k <= 80; k++) {
          var z = z0 + (z1 - z0) * k / 80, a = th + d + 2 * Math.PI * (z - z0) / (2 * R), atras = Math.sin(a) > 0;
          if (atrasAnt !== null && atras !== atrasAnt) { cerrar(); tramo = [tramo[tramo.length - 1]]; }
          atrasAnt = atras; tramo.push(P(R * Math.cos(a), z));
        }
        cerrar();
      });
      [z0, (z0 + z1) / 2, z1].forEach(function (z) {
        var a = th + 2 * Math.PI * (z - z0) / (2 * R), x = R * Math.cos(a);
        s('path', { d: camino([P(-x, z), P(x, z)]), stroke: K.piezaOsc, 'stroke-width': 3, 'stroke-linecap': 'round' }, capas.frente);
      });
      s('rect', { x: cx - 2.5, y: f1(yb - z1), width: 5, height: f1(z1 - z0), fill: K.piezaOsc }, capas.frente);
    }

    // ── La vista en planta del ancla y la cinta: el líquido gira con el impulsor, más rápido junto a la pared
    var pl = null;
    function armarPlanta() {
      limpiar(capas.planta); plantaFl = []; pl = null;
      if (!conPlanta()) return;
      var px = 336, py = 150, rp = 50;
      pl = { x: px, y: py, r: rp };
      s('circle', { cx: px, cy: py, r: rp + 2.5, fill: K.liq, stroke: K.navy, 'stroke-width': 4 }, capas.planta);
      s('circle', { cx: px, cy: py, r: rp + 2.5, fill: 'none', stroke: K.pared, 'stroke-width': 1.6 }, capas.planta);
      s('text', { x: px, y: py + rp + 22, 'text-anchor': 'middle', fill: K.sec, 'font-size': 12 }, capas.planta, 'en planta');
      [0.35, 0.62, 0.88].forEach(function (f) {
        s('circle', { cx: px, cy: py, r: f1(f * rp), fill: 'none', stroke: K.flujo, 'stroke-width': 1.2, opacity: 0.35 }, capas.planta);
        var n = Math.max(2, Math.round(2 * Math.PI * f * rp / 40));
        for (var k = 0; k < n; k++) plantaFl.push({ f: f, k: k, n: n, e: s('path', { d: 'M6.5 0L-4.5 -4.6L-1.5 0L-4.5 4.6Z', fill: K.flujo }, capas.planta) });
      });
      pl.brazo = s('path', { stroke: K.piezaOsc, 'stroke-width': 5, 'stroke-linecap': 'round' }, capas.planta);
      s('circle', { cx: px, cy: py, r: 4, fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1 }, capas.planta);
    }
    function moverPlanta() {
      if (!pl) return;
      var R = 0.92 * pl.r, a = -th;
      pl.brazo.setAttribute('d', 'M' + f1(pl.x - R * Math.cos(a)) + ' ' + f1(pl.y - R * Math.sin(a)) + 'L' + f1(pl.x + R * Math.cos(a)) + ' ' + f1(pl.y + R * Math.sin(a)));
      plantaFl.forEach(function (f) {
        // el líquido gira algo más lento que el impulsor, y más lento lejos de la pared
        var b = -th * (0.25 + 0.55 * f.f) + 2 * Math.PI * f.k / f.n, x = pl.x + f.f * pl.r * Math.cos(b), y = pl.y + f.f * pl.r * Math.sin(b);
        f.e.setAttribute('transform', 'translate(' + f1(x) + ' ' + f1(y) + ') rotate(' + f1(b / RAD - 90) + ')');
      });
    }

    // ── La cáscara y el gas
    function armarCosas() {
      var antes = sol, rMax = Rt - J - 8;
      limpiar(capas.cosas); sol = []; burb = [];
      for (var j = 0; j < o.solidos; j++) {
        var q0 = antes[j] || { r: (((j * 0.618) % 1) * 2 - 1) * rMax, z: o.flotan ? Hp - 1.5 : 2.5, quieto: true };
        sol.push({ e: s('rect', { width: 5, height: 2.4, rx: 0.8, fill: K.solido }, capas.cosas), r: q0.r, z: q0.z, quieto: q0.quieto,
          capa: j % 2, gira: (j * 47) % 180 });
      }
      var antesT = tin; tin = [];
      for (var t = 0; t < (o.tinta || 0); t++) {
        var t0 = antesT[t] || { r: 0, z: -99 };
        tin.push({ e: s('circle', { r: 2.1, fill: K.tinta, 'fill-opacity': 0.55 }, capas.cosas), r: t0.r, z: t0.z });
      }
      if (o.gas) {
        var R = cap.R, zs = cap.zc - 0.55 * R;
        s('path', { d: camino([P(-0.8 * R, zs), P(0.8 * R, zs)]), stroke: K.navy, 'stroke-width': 3, 'stroke-linecap': 'round' }, capas.cosas);
        for (var b = 0; b < 44; b++) burb.push({ e: s('circle', { r: 2.4, fill: K.aire, stroke: K.flujo, 'stroke-width': 0.9 }, capas.cosas),
          u: (b * 0.618) % 1, lado: b % 2 ? -1 : 1, r0: (b * 0.41) % 1, k: b, li: lineaSuelta(b + 3) });
      }
    }
    function moverCosas(dt) {
      var v = o.vflujo != null ? o.vflujo : o.v;
      if (sol.length) moverCascara(dt, v);
      if (tin.length) { if (dt > 0) pasoTinta(dt, v); dibujarTinta(); }
      if (!burb.length) return;
      var R = cap.R, zc = cap.zc, zs = zc - 0.55 * R, rw = Rt - J - 12;
      burb.forEach(function (b, i) {
        var x, z, reg = o.gas;
        if (reg === 'inundado') {
          // el gas sube por el eje sin que el impulsor lo reparta
          b.u = (b.u + dt * 0.5 * (0.8 + 0.4 * b.r0)) % 1;
          x = b.lado * R * (0.2 + 0.6 * b.r0); z = zs + (Hp - zs) * b.u; b.e.setAttribute('r', 3.4);
        } else if (reg === 'cargado' || i % 4 === 0) {
          // del anillo al impulsor, hacia la pared con el chorro y arriba junto a la pared hasta la superficie
          b.u = (b.u + dt * 0.32 * Math.max(0.4, v)) % 1;
          var t = b.u, xr = 0.8 * R, xw = rw * (0.8 + 0.2 * b.r0);
          if (t < 0.12) { x = xr * (0.6 + 0.4 * t / 0.12); z = zs + (zc - zs) * t / 0.12; }
          else if (t < 0.35) { x = xr + (xw - xr) * (t - 0.12) / 0.23; z = zc + 3 * Math.sin(b.k); }
          else { x = xw; z = zc + (Hp - zc) * (t - 0.35) / 0.65; }
          x *= b.lado; b.e.setAttribute('r', 2.6);
        } else {
          // disperso: las burbujas recorren los dos lazos y vuelven al impulsor
          var li = b.li;
          b.u = (b.u + dt * v * 0.9 / li.T) % 1;
          var w = enTiempo(li, b.u * li.T); x = w[0]; z = w[1] + 4 * (b.r0 - 0.5); b.e.setAttribute('r', 1.9);
        }
        var pt = P(x, Math.min(Hp - 2, z));
        b.e.setAttribute('cx', f1(pt[0])); b.e.setAttribute('cy', f1(pt[1]));
      });
    }

    // ── La cáscara: cada trozo sube (si flota) o cae (si se hunde) a su velocidad, y el líquido lo arrastra.
    // La velocidad de subida o de caída del dibujo, ws, sale de o.vc, la velocidad de giro a la que la correlación del
    // capítulo dice que la cáscara empieza a moverse (Joosten si flota, Zwietering si se hunde): a esa velocidad, la
    // corriente que baja junto a la superficie (o la que sube junto al fondo) vale justo ws. Dónde se junta la cáscara
    // y cuánto tarda salen de ahí; son del dibujo, no de una fuente. La turbulencia es un paseo al azar pequeño.
    function velocidadCascara() {
      var lim = 0, zc = o.flotan ? cap.zHi - 6 : cap.zLo + 6;
      for (var r = cap.rIn + 1; r < cap.rOut; r += 1) {
        var u = campo(r, zc);
        lim = Math.max(lim, o.flotan ? -u[1] : u[1]);
      }
      return lim * (o.vc || 1);
    }
    function azar() { return Math.random() + Math.random() + Math.random() - 1.5; }
    function entre(x, a, b) { return Math.max(a, Math.min(b, x)); }
    // un paso de la cáscara: dt en s, v la velocidad de giro sobre 100 r/min
    function pasoCascara(dt, v) {
      var ws = velocidadCascara(), rMax = Rt - J - 8, rMin = cap.rIn + 2, flota = o.flotan;
      var zCapa = flota ? cap.zHi - 6 : cap.zLo + 6, paso = 6 * Math.sqrt(Math.max(v, 0) * dt);
      sol.forEach(function (q) {
        var lado = q.r < 0 ? -1 : 1;
        if (q.quieto) {
          // quieta en la superficie (o en el fondo): la corriente la corre de lado, y la arrastra con una frecuencia
          // que crece con lo que le falta a la corriente para ganarle a ws; las ráfagas de la turbulencia se llevan
          // algún trozo desde un poco antes de la velocidad que pide la correlación
          var u = campo(q.r, zCapa), tira = (flota ? -u[1] : u[1]) * v / Math.max(ws, 1e-6);
          q.r += 0.6 * v * u[0] * dt + 0.5 * paso * azar();
          if (Math.random() < 3 * dt * Math.pow(entre((tira - 0.75) / 0.25, 0, 1), 2)) { q.quieto = false; q.z = zCapa; }
        } else {
          var w = campo(q.r, q.z);
          q.r += v * w[0] * dt + paso * azar();
          q.z += (v * w[1] + (flota ? ws : -ws)) * dt + paso * azar();
          if (flota ? q.z >= cap.zHi : q.z <= cap.zLo) q.quieto = true;
          q.z = entre(q.z, cap.zLo, cap.zHi);
        }
        q.r = lado * entre(lado * q.r, rMin, rMax);
      });
      // la cáscara quieta no se encima: en cada lado del eje se reparte en dos capas, con 3 px entre trozos
      [-1, 1].forEach(function (lado) { [0, 1].forEach(function (capa) {
        var fila = sol.filter(function (q) { return q.quieto && q.capa === capa && (q.r < 0 ? -1 : 1) === lado; });
        fila.sort(function (a, b) { return Math.abs(a.r) - Math.abs(b.r); });
        for (var it = 0; it < 3; it++) {
          for (var k = 1; k < fila.length; k++) {
            var d = Math.abs(fila[k].r) - Math.abs(fila[k - 1].r);
            if (d < 3) { var m = (3 - d) / 2; fila[k - 1].r -= lado * m; fila[k].r += lado * m; }
          }
          fila.forEach(function (q) { q.r = lado * entre(lado * q.r, rMin, rMax); });
        }
      }); });
    }
    function dibujarCascara() {
      var flota = o.flotan;
      sol.forEach(function (q) {
        var zq = q.quieto ? (flota ? Hp - 1.5 - 2.1 * q.capa : 2.5 + 2.1 * q.capa) : q.z;
        var pt = P(q.r, zq), ang = q.quieto ? (q.gira % 30) - 15 : q.gira + th * 30;
        q.e.setAttribute('x', f1(pt[0] - 2.5)); q.e.setAttribute('y', f1(pt[1] - 1.2));
        q.e.setAttribute('transform', 'rotate(' + f1(ang % 180) + ' ' + f1(pt[0]) + ' ' + f1(pt[1]) + ')');
      });
    }
    function moverCascara(dt, v) {
      if (dt > 0) pasoCascara(dt, v);
      dibujarCascara();
    }

    // ── La tinta (o el ácido): cada gota la lleva el líquido con el mismo campo de las flechas y la turbulencia la
    // reparte con un paseo al azar de difusividad o.difusion (px²/s). Las gotas que no se han echado van con z < 0.
    function pasoTinta(dt, v) {
      var rMax = Rt - J - 3, sg = Math.sqrt(2 * (o.difusion || 60) * dt) * 1.41;
      tin.forEach(function (q) {
        if (q.z < 0) return;
        var w = campo(q.r, q.z);
        q.r = entre(q.r + v * w[0] * dt + sg * azar(), -rMax, rMax);
        q.z = entre(q.z + v * w[1] * dt + sg * azar(), 2, Hp - 2);
      });
    }
    function dibujarTinta() {
      tin.forEach(function (q) {
        var pt = q.z < 0 ? [-50, -50] : P(q.r, q.z);
        q.e.setAttribute('cx', f1(pt[0])); q.e.setAttribute('cy', f1(pt[1]));
      });
    }

    function rehacer() { geometria(); dibujarTanque(); armarLineas(); dibujarLineas(); armarPlanta(); armarCosas(); dibujarImpulsor(); moverFlechas(0); moverPlanta(); moverCosas(0); }
    rehacer();
    return {
      poner: function (op2) {
        var cambia = false;
        for (var k in op2) {
          if (o[k] === op2[k]) continue;
          if (k === 'flotan') sol.forEach(function (q) { if (q.quieto) { q.quieto = false; q.z = q.z > Hp / 2 ? cap.zHi - 1 : cap.zLo + 1; } });
          if (k !== 'v' && k !== 'vflujo' && k !== 'vc' && k !== 'flotan' && k !== 'difusion' && !(k === 'gas' && o.gas && op2.gas)) cambia = true;
          o[k] = op2[k];
        }
        if (cambia) rehacer();
      },
      cuadro: function (dt) {
        th += (o.v || 0) * 2 * Math.PI * 0.45 * dt;
        dibujarImpulsor();
        moverFlechas(dt); moverPlanta(); moverCosas(dt);
      },
      // sin animación (movimiento reducido): deja correr la cáscara seg segundos de una vez y la dibuja
      asentar: function (seg) { for (var t = 0; t < seg; t += 0.05) pasoCascara(0.05, o.vflujo != null ? o.vflujo : o.v); dibujarCascara(); },
      campo: function (r, z) { return campo(r, z); },
      // echa toda la tinta en (r, z), en px desde el eje y el fondo, con un poco de dispersión
      echar: function (r, z) { tin.forEach(function (q, i) { q.r = r + 2 * Math.cos(i * 2.4) * Math.sqrt(i % 7); q.z = z + 2 * Math.sin(i * 2.4) * Math.sqrt(i % 7); }); dibujarTinta(); },
      // deja correr la tinta seg segundos de una vez (movimiento reducido)
      asentarTinta: function (seg) { for (var t = 0; t < seg; t += 0.05) pasoTinta(0.05, o.vflujo != null ? o.vflujo : o.v); dibujarTinta(); },
      // lo que tarda una vuelta del lazo en el dibujo a la velocidad 1, en s (el promedio de las líneas)
      tVuelta: function () { var a = 0, n = 0; lineas.forEach(function (li) { if (li.p[0][0] >= 0) { a += li.T; n++; } }); return n ? a / n : 10; },
      // dónde está cada gota de tinta, en px (para medir qué tan repartida está)
      tinta: function () { return tin.filter(function (q) { return q.z >= 0; }).map(function (q) { return [q.r, q.z]; }); },
      medidas: function () { return { cx: cx, yb: yb, Rt: Rt, Hp: Hp, zc: cap.zc, R: cap.R, P: P }; }
    };
  }

  // ════════════════════════════════════════════════════════════════════
  // Las pestañas de los impulsores
  // ════════════════════════════════════════════════════════════════════
  var quieto = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var activos = [];
  function montar(el) {
    var nombre = el.getAttribute('data-tanque');
    if (!IMP[nombre] || el.dataset.listo) return;
    el.dataset.listo = '1';
    var svg = s('svg', { viewBox: '0 0 400 320', preserveAspectRatio: 'xMidYMid meet', 'aria-hidden': 'true', style: 'font-family:inherit' }, el);
    var d = tanque(s('g', {}, svg), { imp: nombre });
    var e = { el: el, d: d, pausa: quieto, visible: false };
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'pausa';
    var marcar = function () { b.textContent = e.pausa ? 'Mover' : 'Detener'; b.setAttribute('aria-pressed', String(e.pausa)); };
    b.addEventListener('click', function () { e.pausa = !e.pausa; marcar(); });
    marcar(); el.appendChild(b);
    d.cuadro(0.3);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { e.visible = es[0].isIntersecting; }).observe(el);
    else e.visible = true;
    activos.push(e);
  }
  var antes = null;
  function bucle(t) {
    var dt = antes == null ? 0 : Math.min(0.05, (t - antes) / 1000); antes = t;
    activos.forEach(function (e) {
      if (e.pausa || !e.visible || e.el.offsetParent === null) return;
      e.d.cuadro(dt);
    });
    requestAnimationFrame(bucle);
  }
  function iniciar() {
    document.querySelectorAll('.esquema[data-tanque]').forEach(montar);
    requestAnimationFrame(bucle);
  }
  window.Tanques = { tanque: tanque, IMP: IMP, K: K, s: s };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
