/* Los esquemas de «Las familias por dentro» del capítulo 11 del libro, «Bombas», traídos con el mismo código
   para la presentación de bombas de 2027-10. Es una copia de libro/figuras/bombas/esquemas.js del repositorio
   del libro; no se edita aquí, y cuando cambia en el libro se vuelve a copiar. Necesita la paleta del libro
   (/classroom/estilo-libro/actividades/paleta.js) cargada antes. */
/* Los esquemas de «Las familias por dentro»: ocho cortes en SVG que se mueven.
   Cada <div class="esquema" data-esquema="…"> se dibuja aquí, con un botón para
   detenerlo. Solo se anima lo que está a la vista; con «reducir movimiento» arranca
   quieto. La geometría sale del mecanismo: engranajes de evolvente, lóbulos
   cicloidales conjugados, una manivela con su biela, paletas que tocan la carcasa. */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  // Los colores, de la paleta del libro (figuras/comun/paleta.js): el metal en sus tonos de corte, el líquido
  // con su material, el agua que gira en el impulsor en su tono hondo y las gotas que lo recorren en el azul del flujo.
  var PA = window.PALETA, CO = PA.cortes;
  var K = {
    navy: CO.trazo, sec: PA.base['tinta-2'], metal: CO['pieza-atras'], pared: CO.pieza, pieza: CO['pieza-media'], piezaOsc: CO['pieza-oscura'],
    liq: CO.liquido, liqHondo: CO['liquido-hondo'], liqOsc: CO.flujo, aire: PA.materiales.gas.relleno
  };
  var TAU = Math.PI * 2, RAD = Math.PI / 180;

  function s(tag, a, padre, texto) {
    var e = document.createElementNS(NS, tag);
    for (var k in a || {}) e.setAttribute(k, a[k]);
    if (texto != null) e.textContent = texto;
    if (padre) padre.appendChild(e);
    return e;
  }
  function rotulo(svg, x, y, texto, ancla, hacia) {
    if (hacia) s('line', { x1: hacia[0], y1: hacia[1], x2: x + (ancla === 'end' ? 4 : ancla === 'middle' ? 0 : -4), y2: y - 4, stroke: K.sec, 'stroke-width': 1 }, svg);
    if (hacia) s('circle', { cx: hacia[0], cy: hacia[1], r: 2.2, fill: K.navy }, svg);
    var lineas = String(texto).split('\n');
    lineas.forEach(function (l, i) {
      s('text', { x: x, y: y + i * 16, 'text-anchor': ancla || 'start', fill: K.navy, 'font-size': 13, 'font-weight': 600, style: 'paint-order:stroke;stroke:' + K.aire + ';stroke-width:3px;stroke-linejoin:round' }, svg, l);
    });
  }
  function puntos(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }
  function suave(f) { f = f < 0 ? 0 : f > 1 ? 1 : f; return f * f * (3 - 2 * f); }
  function mezcla(a, b, f) { var g = suave(f); return [a[0] + (b[0] - a[0]) * g, a[1] + (b[1] - a[1]) * g]; }
  // Un recorrido por tramos rectos; devuelve la posición a una fracción u de su largo.
  function poligonal(pts) {
    var L = [0];
    for (var i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return function (u) {
      var d = Math.max(0, Math.min(1, u)) * L[L.length - 1], j = 1;
      while (j < L.length - 1 && L[j] < d) j++;
      var f = (d - L[j - 1]) / ((L[j] - L[j - 1]) || 1);
      return [pts[j - 1][0] + (pts[j][0] - pts[j - 1][0]) * f, pts[j - 1][1] + (pts[j][1] - pts[j - 1][1]) * f];
    };
  }
  // Una gota que llega por la succión, entra a una bolsa que se mueve, viaja con ella y sale por la descarga.
  // La bolsa avanza con una fase que crece w rad/s; la gota entra en la fase c y sale en la r. o.pos(fase) es
  // dónde está su lugar en la bolsa; o.entra y o.sale, los recorridos por los tubos, de u = 0 a 1. Como la
  // bolsa vuelve a pasar cada vuelta, hay dos gotas por lugar: la que viene llegando y la que va en la bolsa.
  var MEZCLA = 0.45;
  function gotaDeBolsa(o, fase) {
    var c = ((fase - o.c) % TAU + TAU) % TAU, viaje = ((o.r - o.c) % TAU + TAU) % TAU;
    var falta = (TAU - c) / o.w, desde = c / o.w, llega = null, va = null;
    if (falta <= o.Tin) {
      var p = o.entra(1 - falta / o.Tin);
      llega = falta < MEZCLA ? mezcla(p, o.pos(fase), 1 - falta / MEZCLA) : p;
    }
    if (c <= viaje) va = o.pos(fase);
    else {
      var so = desde - viaje / o.w;
      if (so <= o.Tout) { var q = o.sale(so / o.Tout); va = so < MEZCLA ? mezcla(o.pos(fase), q, so / MEZCLA) : q; }
    }
    return [llega, va];
  }
  function ponerGota(c, xy) {
    if (!xy) { c.style.display = 'none'; return; }
    c.style.display = ''; c.setAttribute('cx', xy[0].toFixed(1)); c.setAttribute('cy', xy[1].toFixed(1));
  }
  function camino(pts, cerrar) { return pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(2) + ' ' + p[1].toFixed(2); }).join('') + (cerrar ? 'Z' : ''); }
  // Una válvula de retención de bola en un pasaje vertical: asiento y bola. Devuelve cómo moverla y dónde está.
  function valvula(svg, x0, x1, ySeat) {
    var cx = (x0 + x1) / 2, w = x1 - x0, bola = { x: cx, y: ySeat - w * 0.3 - 2, r: w * 0.3 };
    s('path', { d: 'M' + x0 + ' ' + (ySeat - 8) + 'L' + (cx - 7) + ' ' + ySeat + 'L' + x0 + ' ' + ySeat + 'Z', fill: K.pieza, stroke: K.navy, 'stroke-width': 1.2 }, svg);
    s('path', { d: 'M' + x1 + ' ' + (ySeat - 8) + 'L' + (cx + 7) + ' ' + ySeat + 'L' + x1 + ' ' + ySeat + 'Z', fill: K.pieza, stroke: K.navy, 'stroke-width': 1.2 }, svg);
    var b = s('circle', { cx: cx, r: bola.r, fill: K.navy }, svg);
    var mover = function (abierta) { bola.y = ySeat - w * 0.3 - 2 - (abierta ? 11 : 0); b.setAttribute('cy', bola.y); };
    mover.bola = bola;
    return mover;
  }

  // ── Centrífuga ─────────────────────────────────────────────────────
  function centrifuga(svg) {
    var cx = 180, cy = 168, R = function (f) { return 80 + 42 * f / TAU; };
    var pt = function (r, th) { return [cx + r * Math.cos(th), cy - r * Math.sin(th)]; };
    var c = [pt(80, 0)];
    for (var f = 0; f <= TAU + 1e-6; f += TAU / 120) c.push(pt(R(f), f));
    c.push([cx + 122, 26], [cx + 80, 26]);
    var d = camino(c, true);
    s('path', { d: d, fill: 'none', stroke: K.pared, 'stroke-width': 16, 'stroke-linejoin': 'round' }, svg);
    s('path', { d: d, fill: K.liq }, svg);
    s('path', { d: d, fill: 'none', stroke: K.navy, 'stroke-width': 2, 'stroke-linejoin': 'round' }, svg);
    s('rect', { x: cx + 68, y: 14, width: 66, height: 12, fill: K.pieza, stroke: K.navy, 'stroke-width': 1.5 }, svg);
    var imp = s('g', {}, svg);
    s('circle', { cx: cx, cy: cy, r: 70, fill: K.liqHondo, stroke: K.navy, 'stroke-width': 1.5 }, imp);
    var cotb = 1 / Math.tan(27 * RAD);
    for (var k = 0; k < 6; k++) {
      var th0 = k * TAU / 6, pb = [];
      for (var r = 26; r <= 70.01; r += 2) pb.push(pt(r, th0 - cotb * Math.log(r / 26)));
      s('path', { d: camino(pb), fill: 'none', stroke: K.navy, 'stroke-width': 5, 'stroke-linecap': 'round' }, imp);
    }
    s('circle', { cx: cx, cy: cy, r: 26, fill: K.liq, stroke: K.navy, 'stroke-width': 1, 'stroke-dasharray': '3 3' }, imp);
    s('circle', { cx: cx, cy: cy, r: 13, fill: K.navy }, imp);
    s('rect', { x: cx - 2, y: cy - 13, width: 4, height: 6, fill: K.aire }, imp);
    // Partículas: salen del ojo, giran con el impulsor, recorren la voluta y suben por la garganta.
    var g = s('g', {}, svg), P = [];
    for (var i = 0; i < 34; i++) P.push({ c: s('circle', { r: 2.6, fill: K.liqOsc, opacity: 0.9 }, g) });
    function nace(p) { p.f = 0; p.r = 26; p.th = Math.random() * TAU; }
    P.forEach(function (p) { nace(p); });
    var w = TAU * 0.22, ang = 0;
    function paso(dt) {
      P.forEach(function (p) {
        if (p.f === 0) { p.r += 30 * dt; p.th += 0.62 * w * dt; if (p.r >= 72) { p.f = 1; p.phi = ((p.th % TAU) + TAU) % TAU; } }
        else if (p.f === 1) { var rm = (72 + R(p.phi)) / 2; p.phi += 72 / rm * dt; if (p.phi >= TAU) { p.f = 2; p.x = cx + 88 + Math.random() * 26; p.y = cy; } }
        else { p.y -= 72 * dt; if (p.y < 22) nace(p); }
      });
    }
    for (var t = 0; t < 8; t += 0.05) paso(0.05);
    rotulo(svg, 14, 60, 'Voluta', 'start', pt(R(2.4) - 4, 2.4));
    rotulo(svg, 14, 286, 'Impulsor', 'start', pt(56, 3.95));
    rotulo(svg, 14, 172, 'Ojo:\nentra el\nlíquido', 'start', [cx - 20, cy]);
    rotulo(svg, 392, 210, 'Lengüeta', 'end', [cx + 80, cy]);
    rotulo(svg, 392, 64, 'Descarga', 'end', null);
    return function (dt) {
      ang += w * dt; paso(dt);
      imp.setAttribute('transform', 'rotate(' + (-ang / RAD) + ' ' + cx + ' ' + cy + ')');
      P.forEach(function (p) {
        var xy = p.f === 0 ? pt(p.r, p.th) : p.f === 1 ? pt((72 + R(p.phi)) / 2, p.phi) : [p.x, p.y];
        p.c.setAttribute('cx', xy[0]); p.c.setAttribute('cy', xy[1]);
      });
    };
  }

  // ── Émbolo y diafragma: cámara entre dos válvulas, manivela con biela ─
  // Las gotas son el mismo líquido de punta a punta. Cuando la cámara crece, la válvula de succión se abre: las gotas
  // del tubo de succión suben, pasan el asiento rodeando la bola, entran a la caja de las válvulas y de ahí a la
  // cámara, donde avanzan como un tapón detrás del émbolo (o del diafragma). Cuando la cámara se achica, el tapón
  // vuelve, las gotas cruzan la caja hacia arriba y salen por la válvula de descarga. En la caja (x de 80 a 116, y de
  // 120 a 180) el flujo es el de una esquina: entra parejo por abajo y gira hacia la cámara, o llega de la cámara y
  // sale parejo por arriba; así empata con el tubo y con el tapón, y las gotas no se amontonan. Cada gota lleva el
  // mismo volumen de líquido, así que en la cámara hay más gotas cuando está llena. El rincón de la izquierda no se
  // mueve.
  var AREA_GOTA = 200;                                           // px² de líquido por gota
  function cabezal(svg, xDer, xCam) {
    s('rect', { x: 40, y: 104, width: xDer - 40, height: 92, fill: K.metal, stroke: K.navy, 'stroke-width': 2 }, svg);
    // pasajes y tubos
    s('rect', { x: 80, y: 0, width: 36, height: 120, fill: K.liq }, svg);
    s('rect', { x: 80, y: 180, width: 36, height: 120, fill: K.liq }, svg);
    s('rect', { x: 55, y: 120, width: (xCam || xDer) - 55, height: 60, fill: K.liq }, svg);
    [[80, 0, 80, 104], [116, 0, 116, 104], [80, 196, 80, 300], [116, 196, 116, 300]].forEach(function (l) {
      s('line', { x1: l[0], y1: l[1], x2: l[2], y2: l[3], stroke: K.navy, 'stroke-width': 2 }, svg);
    });
    var capa = s('g', {}, svg);                                  // las gotas, debajo de las válvulas
    var vd = valvula(svg, 80, 116, 100), vs = valvula(svg, 80, 116, 210);
    rotulo(svg, 130, 52, 'Válvula de\ndescarga', 'start', [112, 86]);
    rotulo(svg, 130, 248, 'Válvula de\nsucción', 'start', [112, 196]);
    rotulo(svg, 70, 16, 'Descarga', 'end', null);
    rotulo(svg, 70, 294, 'Succión', 'end', null);
    var G = [], k = 0, PASO = AREA_GOTA / 28;
    var carril = function () { k++; return 84 + 28 * ((k * 0.618034) % 1); };
    var nueva = function (z, x, y) { var g = { z: z, x: x, y: y, e: 0, c: s('circle', { r: 2.8, fill: K.liqOsc, opacity: 0.85 }, capa) }; G.push(g); return g; };
    var y;
    for (y = 184; y < 306; y += PASO) nueva('suc', carril(), y);
    for (y = 116; y > -6; y -= PASO) nueva('des', carril(), y);
    var listo = false;
    // la cámara se llena la primera vez que se conoce la frontera que se mueve (el émbolo o el diafragma)
    function llenar(hasta) {
      var lado = Math.sqrt(AREA_GOTA), i = 0;
      for (var x = 58 + lado / 2; x < 200; x += lado) {
        for (var yy = 124 + lado / 2; yy < 178; yy += lado) {
          var jx = x + 4 * (((i * 0.37) % 1) - 0.5), jy = yy + 4 * (((i * 0.71) % 1) - 0.5); i++;
          if (jx < 80) { nueva('quieta', jx, jy); continue; }
          var h = hasta.alto(jx), g = { e: Math.max(-1, Math.min(1, (jy - 150) / (h / 2 - 4))) };
          var y2 = jx <= 116 ? jy : 150 + g.e * (h / 2 - 4);
          if (jx <= hasta.x(y2) - 4) { var q = nueva('camara', jx, y2); q.e = g.e; }
        }
      }
    }
    // Q: cuánto crece la cámara, en px² por segundo; desplaza(g, Qdt): cuánto se corre en x una gota de la cámara
    return { capa: capa, mover: function (Q, dt, hasta, desplaza) {
      if (!listo) { llenar(hasta); listo = true; }
      vs(Q > 20); vd(Q < -20);
      var Qdt = Q * dt, v = Math.abs(Qdt) / 36, kq = Qdt / 2160, cola = 300;
      G.forEach(function (g) { if (g.z === 'suc') cola = Math.max(cola, g.y); });
      G.forEach(function (g) {
        if (g.z === 'suc') {
          if (Q > 0) { g.y -= v; if (g.y < 180) g.z = 'camara'; }
        } else if (g.z === 'des') {
          if (Q < 0) { g.y -= v; if (g.y < -6) { g.z = 'suc'; g.x = carril(); g.y = cola = cola + PASO; } }
        } else if (g.z === 'camara') {
          if (g.x <= 116) {
            // la esquina: u = Q (x − 80)/2160; v = −Q (y − 120)/2160 en la succión y Q (180 − y)/2160 en la descarga
            g.x += kq * (g.x - 80);
            g.y += Q > 0 ? -kq * (g.y - 120) : kq * (180 - g.y);
            if (g.x > 116) g.e = Math.max(-0.95, Math.min(0.95, (g.y - 150) / (hasta.alto(g.x) / 2 - 4)));
            else if (g.y < 120) g.z = 'des';
          } else {
            g.x += desplaza(g, Qdt);
            g.y = 150 + g.e * (hasta.alto(g.x) / 2 - 4);
            g.x = Math.min(g.x, hasta.x(g.y) - 4);
          }
        }
      });
      // en los pasajes, cada gota rodea la bola de su válvula
      G.forEach(function (g) {
        var x = g.x;
        if (g.z === 'suc' || g.z === 'des') {
          [vs.bola, vd.bola].forEach(function (b) {
            var dy3 = g.y - b.y, lim = b.r + 3.6;
            if (Math.abs(dy3) < lim) { var ddx = Math.sqrt(lim * lim - dy3 * dy3); if (Math.abs(x - b.x) < ddx) x = b.x + (x >= b.x ? 1 : -1) * Math.min(ddx, 14.6); }
          });
          // por el asiento solo se pasa por el centro
          [[vs.bola, 210], [vd.bola, 100]].forEach(function (q) { if (g.y > q[1] - 9 && g.y < q[1] + 1) x = 98 + Math.max(-3.6, Math.min(3.6, x - 98)); });
        }
        g.c.setAttribute('cx', x.toFixed(1)); g.c.setAttribute('cy', g.y.toFixed(1));
      });
    } };
  }
  function manivela(svg, cxk, rk, L) {
    s('line', { x1: 270, y1: 134, x2: 330, y2: 134, stroke: K.navy, 'stroke-width': 1.5 }, svg);
    s('line', { x1: 270, y1: 166, x2: 330, y2: 166, stroke: K.navy, 'stroke-width': 1.5 }, svg);
    var disco = s('circle', { cx: cxk, cy: 150, r: rk + 9, fill: K.metal, stroke: K.navy, 'stroke-width': 1.5 }, svg);
    var biela = s('line', { stroke: K.navy, 'stroke-width': 7, 'stroke-linecap': 'round' }, svg);
    var cruceta = s('rect', { y: 138, width: 24, height: 24, fill: K.pieza, stroke: K.navy, 'stroke-width': 1.5 }, svg);
    var pin = s('circle', { r: 5, fill: K.navy }, svg);
    s('circle', { cx: cxk, cy: 150, r: 5, fill: K.navy }, svg);
    rotulo(svg, cxk, 222, 'Manivela', 'middle', null);
    return function (th) {
      var px = cxk + rk * Math.cos(th), py = 150 + rk * Math.sin(th), xc = px - Math.sqrt(L * L - Math.pow(py - 150, 2));
      biela.setAttribute('x1', xc); biela.setAttribute('y1', 150); biela.setAttribute('x2', px); biela.setAttribute('y2', py);
      cruceta.setAttribute('x', xc - 12); pin.setAttribute('cx', px); pin.setAttribute('cy', py);
      return xc;
    };
  }
  function embolo(svg) {
    s('rect', { x: 140, y: 118, width: 130, height: 64, fill: K.metal, stroke: K.navy, 'stroke-width': 2 }, svg);
    var cab = cabezal(svg, 140);
    var bore = s('rect', { x: 139, y: 133, height: 34, fill: K.liq }, svg);
    svg.insertBefore(bore, cab.capa);
    var pist = s('rect', { y: 135, width: 88, height: 30, fill: K.pieza, stroke: K.navy, 'stroke-width': 1.5 }, svg);
    [[252, 119], [252, 167]].forEach(function (p) { s('rect', { x: p[0], y: p[1], width: 18, height: 14, fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1 }, svg); });
    var mv = manivela(svg, 348, 26, 82);
    rotulo(svg, 200, 98, 'Empaquetadura', 'middle', [258, 124]);
    rotulo(svg, 230, 238, 'Émbolo', 'middle', [282, 158]);
    var th = 0, w = TAU * 0.35, prev = null, face = 0;
    // el ducto: la cámara de 60 px de alto hasta el cilindro, y el cilindro de 34 px hasta la cara del émbolo
    var alto = function (x) { return x <= 130 ? 60 : x >= 140 ? 34 : 60 - 2.6 * (x - 130); };
    var hasta = { x: function () { return face; }, alto: alto };
    return function (dt) {
      th += w * dt;
      var xc = mv(th);
      face = xc - 100;
      bore.setAttribute('width', Math.max(0, face - 139));
      pist.setAttribute('x', face);
      var df = prev == null ? 0 : face - prev; prev = face;
      cab.mover(dt > 0 ? 34 * df / dt : 0, dt, hasta, function (g, Qdt) { return Qdt / alto(g.x); });
    };
  }
  function diafragma(svg) {
    s('rect', { x: 150, y: 104, width: 70, height: 92, fill: K.aire, stroke: K.navy, 'stroke-width': 2 }, svg);
    var cab = cabezal(svg, 150, 100);
    var camara = s('path', { fill: K.liq }, svg);
    svg.insertBefore(camara, cab.capa);
    var memb = s('path', { fill: 'none', stroke: K.navy, 'stroke-width': 4, 'stroke-linecap': 'round' }, svg);
    var vastago = s('line', { y1: 150, y2: 150, stroke: K.navy, 'stroke-width': 6 }, svg);
    s('rect', { x: 216, y: 142, width: 12, height: 16, fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1 }, svg);
    var mv = manivela(svg, 348, 18, 64);
    rotulo(svg, 185, 92, 'Diafragma', 'middle', [158, 112]);
    rotulo(svg, 230, 260, 'El mecanismo\nno toca el líquido', 'middle', [190, 186]);
    var th = 0, w = TAU * 0.4, prev = null, d = 0;
    // la membrana es una curva de Bézier entre (150, 120) y (150, 180): en la altura y está en 150 + 4 d s (1 − s)
    var forma = function (y) { var q = Math.max(0, Math.min(1, (y - 120) / 60)); return 4 * q * (1 - q); };
    var hasta = { x: function (y) { return 150 + d * forma(y) - 1; }, alto: function () { return 60; } };
    return function (dt) {
      th += w * dt;
      var xc = mv(th);
      d = (xc - 284) * 1.1;                                     // desplazamiento del centro del diafragma
      camara.setAttribute('d', 'M99 120 L150 120 Q' + (150 + 2 * d) + ' 150 150 180 L99 180 Z');
      memb.setAttribute('d', 'M150 116 Q' + (150 + 2 * d) + ' 150 150 184');
      vastago.setAttribute('x1', 150 + d); vastago.setAttribute('x2', xc - 12);
      var dd = prev == null ? 0 : d - prev; prev = d;
      // a la entrada de la cámara el líquido avanza parejo; junto a la membrana, lo que ella avanza a su altura.
      // El área barrida por la membrana es 40 d.
      cab.mover(dt > 0 ? 40 * dd / dt : 0, dt, hasta, function (g, Qdt) {
        var l = Math.max(0, Math.min(1, (g.x - 116) / Math.max(4, hasta.x(g.y) - 116)));
        return (1 - l) * Qdt / 60 + l * dd * forma(g.y);
      });
    };
  }

  // ── Engranajes y lóbulos: dos rotores en una carcasa en ocho ──────
  function carcasaOcho(svg, Rc, c1, c2, xa, xb) {
    var dy = Math.sqrt(Rc * Rc - Math.pow(xa - c1, 2));
    var d = 'M' + xa + ' 0L' + xa + ' ' + (150 - dy) + 'A' + Rc + ' ' + Rc + ' 0 1 0 ' + xa + ' ' + (150 + dy) +
      'L' + xa + ' 300L' + xb + ' 300L' + xb + ' ' + (150 + dy) + 'A' + Rc + ' ' + Rc + ' 0 1 0 ' + xb + ' ' + (150 - dy) + 'L' + xb + ' 0';
    s('path', { d: d, fill: 'none', stroke: K.pared, 'stroke-width': 16 }, svg);
    s('path', { d: d + 'Z', fill: K.liq }, svg);
    s('path', { d: d, fill: 'none', stroke: K.navy, 'stroke-width': 2 }, svg);
    rotulo(svg, xb + 12, 22, 'Descarga', 'start', null);
    rotulo(svg, xb + 12, 292, 'Succión', 'start', null);
    return { dy: dy };
  }
  // Perfil de evolvente: N dientes, módulo m, ángulo de presión de 20°.
  function engrane(N, m) {
    var R = N * m / 2, al = 20 * RAD, Rb = R * Math.cos(al), Ra = R + m, Rf = R - 1.25 * m;
    var inv = function (a) { return Math.tan(a) - a; };
    var medio = Math.PI / (2 * N) + inv(al);
    var beta = function (r) { return medio - inv(Math.acos(Math.min(1, Rb / r))); };
    var pts = [], r0 = Math.max(Rb, Rf);
    for (var k = 0; k < N; k++) {
      var c = k * TAU / N, flanco = [];
      for (var i = 0; i <= 8; i++) { var r = r0 + (Ra - r0) * i / 8; flanco.push([r, beta(r)]); }
      pts.push([Rf, c - beta(r0)]);
      flanco.forEach(function (p) { pts.push([p[0], c - p[1]]); });
      for (var j = 1; j < 4; j++) pts.push([Ra, c - beta(Ra) + 2 * beta(Ra) * j / 4]);
      flanco.slice().reverse().forEach(function (p) { pts.push([p[0], c + p[1]]); });
      pts.push([Rf, c + beta(r0)]);
      var sig = (k + 1) * TAU / N - beta(r0);
      for (var q = 1; q < 4; q++) pts.push([Rf, c + beta(r0) + (sig - c - beta(r0)) * q / 4]);
    }
    return { R: R, Ra: Ra, Rf: Rf, d: camino(pts.map(function (p) { return [p[0] * Math.cos(p[1]), p[0] * Math.sin(p[1])]; }), true) };
  }
  // Perfil cicloidal de n lóbulos (Roots): epicicloides en las puntas, hipocicloides en las raíces.
  function lobulo(n, R) {
    var a = R / (2 * n), pts = [], arco = Math.PI / n;
    for (var k = 0; k < n; k++) {
      var b = 2 * k * arco;
      for (var i = 0; i <= 14; i++) {
        var t = arco * i / 14, x = (R + a) * Math.cos(t) - a * Math.cos((R + a) / a * t), y = (R + a) * Math.sin(t) - a * Math.sin((R + a) / a * t);
        pts.push([x * Math.cos(b) - y * Math.sin(b), x * Math.sin(b) + y * Math.cos(b)]);
      }
      for (var j = 1; j <= 14; j++) {
        var u = arco * j / 14, x2 = (R - a) * Math.cos(u) + a * Math.cos((R - a) / a * u), y2 = (R - a) * Math.sin(u) - a * Math.sin((R - a) / a * u), b2 = b + arco;
        pts.push([x2 * Math.cos(b2) - y2 * Math.sin(b2), x2 * Math.sin(b2) + y2 * Math.cos(b2)]);
      }
    }
    return { tip: R + 2 * a, d: camino(pts, true), pts: pts };
  }
  // Las gotas viajan en las bolsas entre los dientes (o los lóbulos) y la carcasa. Cada bolsa tiene varios lugares;
  // cada lugar recibe una gota que sube por la succión, entra a la bolsa cuando la bolsa pasa abierta frente a la
  // succión, da la vuelta con ella contra la carcasa y sale a la descarga antes de que el otro rotor entre a la
  // bolsa. Los lugares de afuera se llenan primero y se vacían de últimos, porque el diente del otro rotor llega
  // primero al fondo. La fase de cada bolsa se mide desde el engrane: la del rotor de la derecha es el espejo de la
  // del izquierdo, porque gira al revés. Las gotas van debajo de los rotores.
  function dosRotores(svg, forma, Rc, w, huecos, lugares, rotulos) {
    var c1 = 150, c2 = 250, casco = carcasaOcho(svg, Rc, c1, c2, 175, 225);
    var capa = s('g', {}, svg);
    var g1 = s('g', {}, svg), g2 = s('g', {}, svg);
    s('path', { d: forma.d, fill: K.pieza, stroke: K.navy, 'stroke-width': 1.5 }, g1);
    s('path', { d: forma.d, fill: K.pieza, stroke: K.navy, 'stroke-width': 1.5 }, g2);
    [g1, g2].forEach(function (g) { s('circle', { cx: 0, cy: 0, r: 9, fill: K.navy }, g); s('circle', { cx: 0, cy: 0, r: 3, fill: K.aire }, g); });
    rotulos();
    // el turno de cada lugar: de afuera hacia el fondo, para repartir las entradas y las salidas en la bolsa
    var orden = lugares.map(function (l, i) { return i; }).sort(function (a, b) { return lugares[b].r - lugares[a].r || lugares[a].d - lugares[b].d; });
    var turno = []; orden.forEach(function (i, n) { turno[i] = (n + 0.5) / lugares.length; });
    var largo = function (pts) { var L = 0; for (var i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };
    var VEL = 36;                                                 // px/s por los tubos
    var GOTAS = [];
    [1, -1].forEach(function (lado) {
      huecos.forEach(function (h0, k) {
        lugares.forEach(function (l, i) {
          var q = turno[i], cx = lado > 0 ? c1 : c2, carril = 180 + 40 * ((i * 0.618 + k * 0.31 + (lado > 0 ? 0 : 0.5)) % 1);   // es el mismo líquido: cualquier carril
          var pos = function (fase) { var a = fase + l.d; return [cx + lado * l.r * Math.cos(a), 150 + l.r * Math.sin(a)]; };
          var o = { w: w, c: (22 + 42 * q) * RAD, r: (296 + 40 * (1 - q)) * RAD, pos: pos };
          var pc = pos(o.c), pr = pos(o.r);
          var pin = [[carril, 306], [carril, 150 + casco.dy + 12], pc], pout = [pr, [carril, 150 - casco.dy - 12], [carril, -6]];
          o.entra = poligonal(pin); o.sale = poligonal(pout); o.Tin = largo(pin) / VEL; o.Tout = largo(pout) / VEL;
          // la fase de esta bolsa: el ángulo del hueco medido desde el engrane, creciendo en el sentido del giro
          var f0 = lado > 0 ? h0 + forma.f1 : Math.PI - (h0 + forma.f2 + forma.h2);
          GOTAS.push({ o: o, f0: f0, c: [s('circle', { r: 3.2, fill: K.liqOsc }, capa), s('circle', { r: 3.2, fill: K.liqOsc }, capa)] });
        });
      });
    });
    var th = 0;
    return function (dt) {
      th += w * dt;
      g1.setAttribute('transform', 'translate(' + c1 + ' 150) rotate(' + (th + forma.f1) / RAD + ')');
      g2.setAttribute('transform', 'translate(' + c2 + ' 150) rotate(' + (-th + forma.f2) / RAD + ')');
      GOTAS.forEach(function (g) {
        var dos = gotaDeBolsa(g.o, g.f0 + th);
        ponerGota(g.c[0], dos[0]); ponerGota(g.c[1], dos[1]);
      });
    };
  }
  function engranajes(svg) {
    var N = 12, e = engrane(N, 100 / N);
    e.f1 = 0; e.f2 = Math.PI / N; e.h2 = 0;
    var huecos = puntos(N).map(function (k) { return k * TAU / N + Math.PI / N; });
    // dos lugares por hueco, uno cerca del fondo y otro cerca de la punta del diente
    return dosRotores(svg, e, e.Ra + 3, TAU * 0.11, huecos, [{ r: e.Rf + 5.6, d: 0 }, { r: e.Ra - 4.6, d: 0 }], function () {
      rotulo(svg, 8, 36, 'Por fuera, entre\nlos dientes y\nla carcasa', 'start', [92, 112]);
    });
  }
  function lobulos(svg) {
    var l = lobulo(3, 50), esc = 0.985;
    l.d = l.d.replace(/-?\d+\.\d+/g, function (x) { return (parseFloat(x) * esc).toFixed(2); });
    l.f1 = -Math.PI / 6; l.f2 = -Math.PI / 6; l.h2 = 0;
    var huecos = [0, 1, 2].map(function (k) { return k * TAU / 3 + Math.PI / 2; });
    // Los lugares llenan la bolsa entre dos lóbulos y la carcasa: el perfil del lóbulo, en polares, dice dónde empieza
    // el líquido a cada ángulo del fondo de la bolsa (que está en π/2).
    var Rc = l.tip * esc + 4, polar = l.pts.map(function (q) { return [Math.atan2(q[1], q[0]), Math.hypot(q[0], q[1]) * esc]; });
    var perfil = function (a) {
      var mejor = 0, dmin = 9;
      polar.forEach(function (q) { var d = Math.abs(((q[0] - a) % TAU + TAU + Math.PI) % TAU - Math.PI); if (d < dmin) { dmin = d; mejor = q[1]; } });
      return mejor;
    };
    var lugares = [];
    [0, -17, 17, -32, 32].forEach(function (dg) {
      for (var r = perfil(Math.PI / 2 + dg * RAD) + 5.5; r <= Rc - 5; r += 9) lugares.push({ r: r, d: dg * RAD });
    });
    return dosRotores(svg, l, Rc, TAU * 0.09, huecos, lugares, function () {
      rotulo(svg, 8, 36, 'Los lóbulos\nno se tocan', 'start', null);
    });
  }

  // ── Tornillo: corte a lo largo del eje ─────────────────────────────
  // Las cavidades entre filetes avanzan a lo largo del eje. Cada una se forma frente a la boca de la succión, donde se
  // llena con el líquido que baja por el tubo, y se abre frente a la boca de la descarga, donde lo suelta. Las gotas
  // del canal de abajo pasan detrás del eje para llegar (o para salir): van debajo del eje y de los filetes.
  function tornillo(svg) {
    var x0 = 40, x1 = 360, y0 = 105, y1 = 195, p = 58, wf = 14, sl = 44, V = 26;
    var S0 = 60, S1 = 100, D0 = 300, D1 = 340;                     // las bocas de la succión y de la descarga
    s('rect', { x: S0, y: 0, width: S1 - S0, height: y0 + 1, fill: K.liq }, svg);
    s('rect', { x: D0, y: y1 - 1, width: D1 - D0, height: 301 - y1, fill: K.liq }, svg);
    s('rect', { x: x0 - 8, y: y0 - 10, width: S0 - x0 + 8, height: 10, fill: K.pared }, svg);
    s('rect', { x: S1, y: y0 - 10, width: x1 + 8 - S1, height: 10, fill: K.pared }, svg);
    s('rect', { x: x0 - 8, y: y1, width: D0 - x0 + 8, height: 10, fill: K.pared }, svg);
    s('rect', { x: D1, y: y1, width: x1 + 8 - D1, height: 10, fill: K.pared }, svg);
    s('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, fill: K.liq }, svg);
    s('path', { d: 'M' + S0 + ' 0V' + y0 + 'H' + x0 + 'V' + y1 + 'H' + D0 + 'V300M' + D1 + ' 300V' + y1 + 'H' + x1 + 'V' + y0 + 'H' + S1 + 'V0', fill: 'none', stroke: K.navy, 'stroke-width': 2 }, svg);
    s('line', { x1: 0, y1: 150, x2: x0, y2: 150, stroke: K.navy, 'stroke-width': 10 }, svg);
    var gotas = s('g', {}, svg);
    var id = 'tz' + Math.random().toString(36).slice(2, 7);
    s('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0 }, s('clipPath', { id: id }, s('defs', {}, svg)));
    var capa = s('g', { 'clip-path': 'url(#' + id + ')' }, svg);
    s('rect', { x: x0, y: 136, width: x1 - x0, height: 28, fill: K.pieza, stroke: K.navy, 'stroke-width': 1 }, capa);
    var n = Math.ceil((x1 - x0 + sl + p) / p) + 1;
    var filetes = puntos(n).map(function () { return s('path', { fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1.2 }, capa); });
    rotulo(svg, 120, 52, 'Succión', 'start', null);
    rotulo(svg, 294, 292, 'Descarga', 'end', null);
    rotulo(svg, 200, 236, 'Las cavidades entre filetes\navanzan a lo largo del eje', 'middle', null);
    // los lugares de una cavidad, medidos desde el borde izquierdo de su filete en la cara de arriba: tres en el canal
    // de arriba y tres en el de abajo, donde la cavidad va 29 px más atrás por la inclinación del filete
    var LUG = [{ dx: 16, y: 120, k: -1 }, { dx: 28.7, y: 120, k: 0 }, { dx: 41.4, y: 120, k: 1 },
               { dx: -13, y: 180, k: -1 }, { dx: -0.3, y: 180, k: 0 }, { dx: 12.4, y: 180, k: 1 }];
    var CICLO = 9, VEL = 40, MEZ = 0.4, G = [];
    LUG.forEach(function (l, q) {
      for (var j = 0; j < CICLO; j++) G.push({ l: l, q: q, j: j, c: s('circle', { r: 3.6, fill: K.liqOsc, opacity: 0.95 }, gotas) });
    });
    var t = 0;
    return function (dt) {
      t += dt;
      var fase = (V * t) % p;
      filetes.forEach(function (f, k) {
        var b = x0 - p + k * p + fase;
        f.setAttribute('d', 'M' + b + ' ' + (y0 + 2) + 'L' + (b + wf) + ' ' + (y0 + 2) + 'L' + (b + wf - sl) + ' ' + (y1 - 2) + 'L' + (b - sl) + ' ' + (y1 - 2) + 'Z');
      });
      // la cavidad m tiene su filete en b = x0 − p + m p + V t; cada lugar entra a la cavidad cuando pasa bajo la boca
      // de la succión y sale cuando llega a la de la descarga
      G.forEach(function (g) {
        var l = g.l, entra = (S0 + S1) / 2 + 9 * l.k, sale = (D0 + D1) / 2 + 9 * l.k;
        // las cavidades de más a la derecha ya pasaron por la entrada; m0 es la próxima en llegar a ella
        var m0 = Math.floor((entra - (x0 - p + l.dx + V * t)) / p);
        var mejor = null;
        for (var m = m0; m <= m0 + 8; m++) {
          if (((m % CICLO) + CICLO) % CICLO !== g.j) continue;
          var x = x0 - p + m * p + l.dx + V * t, tc = (entra - x) / V, tr = (sale - x) / V;   // segundos a la entrada y a la salida
          var cx = carril(g, 'in'), dx2 = carril(g, 'out');
          var pin = [[cx, -6], [cx, y0 - 4], [entra, l.y]], pout = [[sale, l.y], [dx2, y1 + 4], [dx2, 306]];
          var Lin = largo(pin), Lout = largo(pout);
          if (tc > 0 && tc <= Lin / VEL) {
            var pp = poligonal(pin)(1 - tc * VEL / Lin);
            mejor = tc < MEZ ? mezcla(pp, [x, l.y], 1 - tc / MEZ) : pp;
          } else if (tc <= 0 && tr >= 0) mejor = [x, l.y];
          else if (tr < 0 && -tr <= Lout / VEL) {
            var po = poligonal(pout)(-tr * VEL / Lout);
            mejor = -tr < MEZ ? mezcla([x, l.y], po, -tr / MEZ) : po;
          }
          if (mejor) break;
        }
        ponerGota(g.c, mejor);
      });
    };
    function carril(g, cual) { var f = ((g.j * 0.618 + g.q * 0.27 + (cual === 'in' ? 0 : 0.5)) % 1); return cual === 'in' ? S0 + 7 + f * 26 : D0 + 7 + f * 26; }
    function largo(pts) { var L = 0; for (var i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; }
  }

  // ── Paletas ────────────────────────────────────────────────────────
  // El rotor está corrido a la derecha y toca la carcasa en el lado derecho; gira en el sentido del reloj. Por abajo,
  // de la derecha a la izquierda, cada cámara entre dos paletas crece: ahí va la lumbrera de succión, ancha, que la
  // llena mientras crece. Por arriba, de la izquierda a la derecha, la cámara se achica: ahí va la lumbrera de
  // descarga, que recibe lo que la cámara expulsa. Entre las dos lumbreras quedan dos tramos ciegos de carcasa, más
  // anchos que el paso entre paletas, para que la succión y la descarga nunca se toquen: el de la izquierda, con la
  // cámara llena, y el de la derecha, donde la cámara casi desaparece. Frente a las lumbreras el anillo sigue, con
  // ventanas entre puentes: las paletas se apoyan en los puentes y el líquido pasa por las ventanas.
  function paletas(svg) {
    var C = [200, 150], Rc = 92, Cr = [218, 150], Rr = 74, n = 6;
    var en = function (g) { return [C[0] + Rc * Math.cos(g * RAD), C[1] + Rc * Math.sin(g * RAD)]; };
    var A1 = en(40), A2 = en(140), B1 = en(220), B2 = en(320), P = function (q) { return q[0].toFixed(1) + ' ' + q[1].toFixed(1); };
    var arco = function (barrido, q) { return 'A' + Rc + ' ' + Rc + ' 0 0 ' + barrido + ' ' + P(q); };
    var liquido = 'M' + P(A1) + 'L230 262L230 300L170 300L170 262L' + P(A2) + arco(1, B1) + 'L170 38L170 0L230 0L230 38L' + P(B2) + arco(1, A1) + 'Z';
    var der = 'M230 300L230 262L' + P(A1) + arco(0, B2) + 'L230 38L230 0', izq = 'M170 300L170 262L' + P(A2) + arco(1, B1) + 'L170 38L170 0';
    s('path', { d: liquido, fill: K.liq }, svg);
    [der, izq].forEach(function (d) {
      s('path', { d: d, fill: 'none', stroke: K.pared, 'stroke-width': 16, 'stroke-linejoin': 'round' }, svg);
      s('path', { d: d, fill: 'none', stroke: K.navy, 'stroke-width': 2, 'stroke-linejoin': 'round' }, svg);
    });
    var capa = s('g', {}, svg);
    [[40, 140], [220, 320]].forEach(function (lu) {
      for (var g0 = lu[0] + 4; g0 + 7 <= lu[1] - 2; g0 += 14) {
        var d = 'M' + P(en(g0)) + 'A' + Rc + ' ' + Rc + ' 0 0 1 ' + P(en(g0 + 7));
        s('path', { d: d, fill: 'none', stroke: K.navy, 'stroke-width': 9, 'stroke-linecap': 'butt' }, svg);
        s('path', { d: d, fill: 'none', stroke: K.pared, 'stroke-width': 6, 'stroke-linecap': 'butt' }, svg);
      }
    });
    var rot = s('g', {}, svg);
    s('circle', { cx: 0, cy: 0, r: Rr, fill: K.pieza, stroke: K.navy, 'stroke-width': 1.5 }, rot);
    for (var k = 0; k < n; k++) { var a = k * TAU / n; s('line', { x1: 34 * Math.cos(a), y1: 34 * Math.sin(a), x2: Rr * Math.cos(a), y2: Rr * Math.sin(a), stroke: K.navy, 'stroke-width': 9 }, rot); }
    s('circle', { cx: 0, cy: 0, r: 11, fill: K.navy }, rot);
    var vanes = puntos(n).map(function () { return s('path', { fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1.2 }, svg); });
    var alcance = function (a) { // distancia del centro del rotor a la carcasa por el rayo de ángulo a
      var ux = Math.cos(a), uy = Math.sin(a), dx = Cr[0] - C[0], dyy = Cr[1] - C[1], b = dx * ux + dyy * uy;
      return -b + Math.sqrt(b * b - (dx * dx + dyy * dyy) + Rc * Rc);
    };
    rotulo(svg, 244, 22, 'Descarga:\nla cámara se achica', 'start', null);
    rotulo(svg, 244, 276, 'Succión:\nla cámara crece', 'start', null);
    rotulo(svg, 392, 150, 'Rotor\nexcéntrico', 'end', null);
    var w = TAU * 0.09;
    // Cinco lugares por cámara, entre el rotor y la carcasa y lejos de las paletas. La gota de cada lugar entra a la
    // cámara mientras la cámara pasa por la succión y sale mientras pasa por la descarga, en el mismo orden.
    var LUG = [[0.75, -12], [0.75, 12], [0.2, -15], [0.2, 0], [0.2, 15]], VEL = 36, GOTAS = [];
    var largo = function (pts) { var L = 0; for (var i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };
    for (var j = 0; j < n; j++) {
      LUG.forEach(function (l, i) {
        var q = (i + 0.5) / LUG.length, d = l[1] * RAD;
        var pos = function (fase) {
          var an = fase + d, gap = alcance(an) - Rr, rr = Rr + 3.6 + l[0] * Math.max(0, gap - 7.2);
          return [Cr[0] + rr * Math.cos(an), Cr[1] + rr * Math.sin(an)];
        };
        var o = { w: w, c: (75 + 65 * q) * RAD, r: (218 + 64 * q) * RAD, pos: pos };
        var carril = 176 + 48 * ((j * 0.31 + i * 0.618) % 1), pc = pos(o.c), pr = pos(o.r);
        var pin = [[carril, 306], [carril, 258], pc], pout = [pr, [carril, 42], [carril, -6]];
        o.entra = poligonal(pin); o.sale = poligonal(pout); o.Tin = largo(pin) / VEL; o.Tout = largo(pout) / VEL;
        GOTAS.push({ o: o, f0: j * TAU / n + Math.PI / n, c: [s('circle', { r: 3.2, fill: K.liqOsc }, capa), s('circle', { r: 3.2, fill: K.liqOsc }, capa)] });
      });
    }
    var th = 0;
    return function (dt) {
      th += w * dt;
      rot.setAttribute('transform', 'translate(' + Cr[0] + ' ' + Cr[1] + ') rotate(' + th / RAD + ')');
      for (var k = 0; k < n; k++) {
        var a = th + k * TAU / n, L = alcance(a) - 1, ux = Math.cos(a), uy = Math.sin(a), px = -uy * 3.5, py = ux * 3.5, r0 = 40;
        vanes[k].setAttribute('d', 'M' + (Cr[0] + r0 * ux + px) + ' ' + (Cr[1] + r0 * uy + py) + 'L' + (Cr[0] + L * ux + px) + ' ' + (Cr[1] + L * uy + py) +
          'L' + (Cr[0] + L * ux - px) + ' ' + (Cr[1] + L * uy - py) + 'L' + (Cr[0] + r0 * ux - px) + ' ' + (Cr[1] + r0 * uy - py) + 'Z');
      }
      GOTAS.forEach(function (g) {
        var dos = gotaDeBolsa(g.o, g.f0 + th);
        ponerGota(g.c[0], dos[0]); ponerGota(g.c[1], dos[1]);
      });
    };
  }

  // ── Peristáltica ───────────────────────────────────────────────────
  function peristaltica(svg) {
    var C = [200, 172], Ro = 110, Ri = 94, Rrod = 95, rr = 13;
    s('path', { d: 'M' + (C[0] - 118) + ' 300L' + (C[0] - 118) + ' ' + C[1] + 'A118 118 0 0 1 ' + (C[0] + 118) + ' ' + C[1] + 'L' + (C[0] + 118) + ' 300', fill: 'none', stroke: K.pared, 'stroke-width': 14 }, svg);
    var liq = s('path', { fill: K.liq }, svg);
    var paredIn = s('path', { fill: 'none', stroke: K.navy, 'stroke-width': 2 }, svg);
    s('path', { d: 'M' + (C[0] - Ro) + ' 300L' + (C[0] - Ro) + ' ' + C[1] + 'A' + Ro + ' ' + Ro + ' 0 0 1 ' + (C[0] + Ro) + ' ' + C[1] + 'L' + (C[0] + Ro) + ' 300', fill: 'none', stroke: K.navy, 'stroke-width': 2 }, svg);
    var brazo = s('g', {}, svg);
    for (var k = 0; k < 3; k++) { var a = k * TAU / 3; s('line', { x1: 0, y1: 0, x2: Rrod * Math.cos(a), y2: Rrod * Math.sin(a), stroke: K.pieza, 'stroke-width': 12, 'stroke-linecap': 'round' }, brazo); }
    s('circle', { cx: 0, cy: 0, r: 22, fill: K.pieza, stroke: K.navy, 'stroke-width': 1.5 }, brazo);
    s('circle', { cx: 0, cy: 0, r: 6, fill: K.navy }, brazo);
    var capa = s('g', {}, svg);                                  // las gotas, debajo de los rodillos
    var rods = [0, 1, 2].map(function () { return s('circle', { r: rr, fill: K.metal, stroke: K.navy, 'stroke-width': 1.5 }, svg); });
    var gs = puntos(22).map(function () { return s('circle', { r: 2.8, fill: K.liqOsc }, capa); });
    rotulo(svg, 8, 290, 'Succión', 'start', null);
    rotulo(svg, 392, 290, 'Descarga', 'end', null);
    rotulo(svg, 392, 30, 'El rodillo aprieta\nel tubo y empuja', 'end', null);
    var th = 0, w = TAU * 0.08;
    // La pared interior del tubo, a lo largo de la pata izquierda, el arco y la pata derecha,
    // con su normal hacia la pared exterior. Cada rodillo la empuja hasta su borde.
    var base = [], Lp = 300 - C[1];
    for (var yy = 300; yy > C[1]; yy -= 4) base.push({ p: [C[0] - Ri, yy], n: [-1, 0] });
    for (var i = 0; i <= 180; i += 1.5) { var ph = Math.PI + Math.PI * i / 180; base.push({ p: [C[0] + Ri * Math.cos(ph), C[1] + Ri * Math.sin(ph)], n: [Math.cos(ph), Math.sin(ph)] }); }
    for (var y2 = C[1] + 4; y2 <= 300; y2 += 4) base.push({ p: [C[0] + Ri, y2], n: [1, 0] });
    var empuja = function (b, cs) {
      var t = 0;
      cs.forEach(function (c) {
        var dx = c[0] - b.p[0], dy = c[1] - b.p[1], dn = dx * b.n[0] + dy * b.n[1], d2 = dx * dx + dy * dy;
        if (d2 < rr * rr || (dn > 0 && d2 - dn * dn < rr * rr)) { var tt = dn + Math.sqrt(Math.max(0, rr * rr - d2 + dn * dn)); if (tt > t) t = tt; }
      });
      t = Math.min(t + 0.5, Ro - Ri - 2);
      return [b.p[0] + t * b.n[0], b.p[1] + t * b.n[1]];
    };
    return function (dt) {
      th += w * dt;
      var angs = [0, 1, 2].map(function (k) { return th + k * TAU / 3; });
      var cs = angs.map(function (al) { return [C[0] + Rrod * Math.cos(al), C[1] + Rrod * Math.sin(al)]; });
      var inn = base.map(function (b) { return empuja(b, cs); });
      var out = [];
      for (var k = 0; k <= 180; k++) { var phi = Math.PI + Math.PI * k / 180; out.push([C[0] + Ro * Math.cos(phi), C[1] + Ro * Math.sin(phi)]); }
      var dLiq = 'M' + (C[0] - Ro) + ' 300L' + (C[0] - Ro) + ' ' + C[1] + camino(out).replace(/^M/, 'L') + 'L' + (C[0] + Ro) + ' 300' +
        camino(inn.slice().reverse()).replace(/^M/, 'L') + 'Z';
      liq.setAttribute('d', dLiq);
      paredIn.setAttribute('d', camino(inn));
      brazo.setAttribute('transform', 'translate(' + C[0] + ' ' + C[1] + ') rotate(' + th / RAD + ')');
      angs.forEach(function (al, k) { rods[k].setAttribute('cx', C[0] + Rrod * Math.cos(al)); rods[k].setAttribute('cy', C[1] + Rrod * Math.sin(al)); });
      // Gotas: el líquido que queda encerrado entre dos rodillos avanza con ellos, así que las gotas van en fase con el
      // tren de rodillos, en el tramo libre entre uno y otro, y nunca debajo de un rodillo. Por las patas siguen al
      // mismo paso. s es la distancia a lo largo del tubo desde el pie de la pata de la succión.
      var Lpata = 300 - C[1], rm = (Ro + Ri) / 2, Larco = Math.PI * rm, total = Lpata * 2 + Larco, Lr = TAU / 3 * rm;
      var sr = Lpata + (th - Math.PI) * rm, F = [0.15, 0.32, 0.5, 0.68, 0.85], n = 0;
      for (var m = Math.floor(-sr / Lr) - 1; m <= Math.ceil((total - sr) / Lr) + 1; m++) {
        F.forEach(function (f, q) {
          var sPos = sr + Lr * (m + f), e = (q % 2 ? 2.6 : -2.6), x, y;
          if (sPos < 0 || sPos > total || n >= gs.length) return;
          if (sPos < Lpata) { x = C[0] - rm + e; y = 300 - sPos; }
          else if (sPos < Lpata + Larco) { var phi = Math.PI + (sPos - Lpata) / rm; x = C[0] + (rm + e) * Math.cos(phi); y = C[1] + (rm + e) * Math.sin(phi); }
          else { x = C[0] + rm + e; y = C[1] + (sPos - Lpata - Larco); }
          ponerGota(gs[n++], [x, y]);
        });
      }
      while (n < gs.length) ponerGota(gs[n++], null);
    };
  }

  var DIBUJOS = { centrifuga: centrifuga, embolo: embolo, diafragma: diafragma, engranajes: engranajes, lobulos: lobulos, tornillo: tornillo, paletas: paletas, peristaltica: peristaltica };
  var quieto = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var activos = [];

  function montar(el) {
    var fn = DIBUJOS[el.getAttribute('data-esquema')];
    if (!fn || el.dataset.listo) return;
    el.dataset.listo = '1';
    var svg = s('svg', { viewBox: '0 0 400 300', preserveAspectRatio: 'xMidYMid meet', 'aria-hidden': 'true', style: 'font-family:inherit' }, el);
    var frame = fn(svg);
    var e = { el: el, frame: frame, pausa: quieto, visible: false };
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'pausa';
    var marcar = function () { b.textContent = e.pausa ? 'Mover' : 'Detener'; b.setAttribute('aria-pressed', String(e.pausa)); };
    b.addEventListener('click', function () { e.pausa = !e.pausa; marcar(); });
    marcar(); el.appendChild(b);
    frame(0.6); // un cuadro con todo en su sitio, también para quien lo ve quieto
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { e.visible = es[0].isIntersecting; }).observe(el);
    else e.visible = true;
    activos.push(e);
  }
  var antes = null;
  function bucle(t) {
    var dt = antes == null ? 0 : Math.min(0.05, (t - antes) / 1000); antes = t;
    activos.forEach(function (e) { if (!e.pausa && e.visible && e.el.offsetParent !== null) e.frame(dt); });
    requestAnimationFrame(bucle);
  }
  function iniciar() {
    document.querySelectorAll('.esquema[data-esquema]').forEach(montar);
    requestAnimationFrame(bucle);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
