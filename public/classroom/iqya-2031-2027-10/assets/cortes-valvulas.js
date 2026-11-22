/* Los cortes que se mueven del capítulo 13 del libro, «Tanques, válvulas, tuberías y medición»: las válvulas, los
   medidores y los tanques. Copia de libro/figuras/valvulas-tuberias-y-medicion-de-flujo/cortes.js para la presentación
   de válvulas, control y vacío de 2027-10; no se edita aquí. Necesita la paleta del libro (paleta.js) antes. */
/* Los cortes de las válvulas y de los medidores de flujo del capítulo 13 (Tanques, válvulas, tuberías y medición).
   Cada dibujo se arma en un <g> de un SVG de 400 × 300 y devuelve dos funciones: poner(x), que fija la apertura
   (fracción de 0 a 1; en la bola y la mariposa, el ángulo de cierre en grados; en los medidores de presión
   diferencial, la razón de diámetros β), y cuadro(dt, v), que mueve el agua con la velocidad relativa v (1 es el
   caudal del caso). Los usan las pestañas «por dentro», donde la apertura va y viene sola, y los recuadros «Pruebe»
   del capítulo, que la fijan con sus botones.
   Las proporciones son las de un tubo de 2½ in con bridas; los cortes son esquemas, no planos. Con «reducir
   movimiento» las pestañas arrancan quietas. Sin dependencias. */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  // Los colores, de la paleta del libro (figuras/comun/paleta.js): el metal en sus tonos de corte, el agua con su
  // material y las gotas que la recorren en el azul del flujo, el caucho de empaquetaduras y diafragmas y el campo
  // magnético en oliva.
  var PA = window.PALETA, CO = PA.cortes, M = PA.materiales;
  var K = {
    navy: CO.trazo, sec: PA.base['tinta-2'], metal: CO['pieza-atras'], pared: CO.pieza, pieza: CO['pieza-media'], piezaOsc: CO['pieza-oscura'],
    liq: CO.liquido, liqHondo: CO['liquido-hondo'], liqOsc: CO.flujo, aire: M.gas.relleno, goma: M.caucho.medio, campo: PA.base.oliva
  };
  var RAD = Math.PI / 180;
  var CY = 190, R = 26, T = 6;                          // eje del tubo, radio interior y pared

  function s(tag, a, padre, texto) {
    var e = document.createElementNS(NS, tag);
    for (var k in a || {}) e.setAttribute(k, a[k]);
    if (texto != null) e.textContent = texto;
    if (padre) padre.appendChild(e);
    return e;
  }
  function camino(pts, cerrar) { return pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('') + (cerrar ? 'Z' : ''); }
  function rotulo(g, x, y, texto, ancla, hacia) {
    if (hacia) {
      // la línea llega al lado del texto que mira al punto (el ancho se estima: 7 px por letra)
      var lineas = String(texto).split('\n'), ancho = Math.max.apply(null, lineas.map(function (l) { return l.length; })) * 7;
      var x0 = ancla === 'end' ? x - ancho : ancla === 'middle' ? x - ancho / 2 : x, x1 = x0 + ancho;
      var xl = hacia[0] > x1 ? x1 + 4 : hacia[0] < x0 ? x0 - 4 : (x0 + x1) / 2, yl = hacia[0] > x1 || hacia[0] < x0 ? y - 4 : (hacia[1] < y ? y - 14 : y + 4 + (lineas.length - 1) * 15);
      s('line', { x1: hacia[0], y1: hacia[1], x2: xl, y2: yl, stroke: K.sec, 'stroke-width': 1 }, g);
      s('circle', { cx: hacia[0], cy: hacia[1], r: 2.2, fill: K.navy }, g);
    }
    String(texto).split('\n').forEach(function (l, i) {
      s('text', { x: x, y: y + i * 15, 'text-anchor': ancla || 'start', fill: K.navy, 'font-size': 12.5, 'font-weight': 600, style: 'paint-order:stroke;stroke:' + K.aire + ';stroke-width:3px;stroke-linejoin:round' }, g, l);
    });
  }
  function flecha(g, x, y, dx, dy) {
    var L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    s('path', { d: 'M' + x + ' ' + y + 'l' + (dx - ux * 7) + ' ' + (dy - uy * 7), stroke: K.navy, 'stroke-width': 1.6, fill: 'none' }, g);
    var px = x + dx, py = y + dy;
    s('path', { d: 'M' + px + ' ' + py + 'L' + (px - ux * 9 - uy * 4.5) + ' ' + (py - uy * 9 + ux * 4.5) + 'L' + (px - ux * 9 + uy * 4.5) + ' ' + (py - uy * 9 - ux * 4.5) + 'Z', fill: K.navy }, g);
  }

  // Tubo recto de x0 a x1 con su pared, lleno de agua
  function tubo(g, x0, x1, cy, r) {
    cy = cy || CY; r = r || R;
    s('rect', { x: x0, y: cy - r - T, width: x1 - x0, height: 2 * (r + T), fill: K.pared }, g);
    s('rect', { x: x0, y: cy - r, width: x1 - x0, height: 2 * r, fill: K.liq }, g);
    s('path', { d: 'M' + x0 + ' ' + (cy - r - T) + 'H' + x1 + 'M' + x0 + ' ' + (cy + r + T) + 'H' + x1, stroke: K.navy, 'stroke-width': 1.4 }, g);
    s('path', { d: 'M' + x0 + ' ' + (cy - r) + 'H' + x1 + 'M' + x0 + ' ' + (cy + r) + 'H' + x1, stroke: K.navy, 'stroke-width': 0.8, opacity: 0.6 }, g);
  }
  // Un par de bridas en x (la del tubo y la del equipo), con un perno arriba y otro abajo
  function bridas(g, x, cy, alto) {
    cy = cy || CY; alto = alto || 50;
    [[x - 9, 8], [x + 1, 8]].forEach(function (b) {
      s('rect', { x: b[0], y: cy - alto, width: b[1], height: 2 * alto, fill: K.pieza, stroke: K.navy, 'stroke-width': 1.2 }, g);
    });
    [cy - alto + 9, cy + alto - 9].forEach(function (y) {
      s('rect', { x: x - 13, y: y - 2.5, width: 26, height: 5, fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 0.8 }, g);
    });
    s('rect', { x: x - 1, y: cy - R, width: 2, height: 2 * R, fill: K.liq }, g);
  }
  function volante(g, x, y, ancho) {
    ancho = ancho || 44;
    s('ellipse', { cx: x, cy: y, rx: ancho, ry: 7, fill: 'none', stroke: K.navy, 'stroke-width': 4 }, g);
    s('path', { d: 'M' + (x - ancho) + ' ' + y + 'H' + (x + ancho) + 'M' + x + ' ' + (y - 7) + 'V' + (y + 7), stroke: K.navy, 'stroke-width': 2 }, g);
  }

  // Una corriente: puntos que avanzan por polilíneas. Cada vértice lleva [x, y, f], con f el factor de velocidad.
  // Los puntos van en su propio grupo, que cada corte pone debajo de las piezas sólidas.
  function corriente(g, n, radio) {
    var lineas = [], puntos = [], u = [];
    for (var i = 0; i < n; i++) { puntos.push(s('circle', { r: radio || 2.6, fill: K.liqOsc, opacity: 0.85 }, g)); u.push(i / n); }
    function preparar(ls) {
      lineas = ls.map(function (l) {
        var acum = [0];
        for (var k = 1; k < l.length; k++) acum.push(acum[k - 1] + Math.hypot(l[k][0] - l[k - 1][0], l[k][1] - l[k - 1][1]));
        return { p: l, a: acum, L: acum[acum.length - 1] };
      });
    }
    function donde(li, frac) {
      var d = li.L * frac, a = li.a, p = li.p;
      for (var k = 1; k < p.length; k++) if (a[k] >= d) {
        var t = (d - a[k - 1]) / Math.max(1e-9, a[k] - a[k - 1]);
        return [p[k - 1][0] + (p[k][0] - p[k - 1][0]) * t, p[k - 1][1] + (p[k][1] - p[k - 1][1]) * t, (p[k - 1][2] || 1) + ((p[k][2] || 1) - (p[k - 1][2] || 1)) * t];
      }
      return [p[p.length - 1][0], p[p.length - 1][1], 1];
    }
    return {
      lineas: preparar,
      mover: function (dt, v) {
        if (!lineas.length) return;
        puntos.forEach(function (c, i) {
          var li = lineas[i % lineas.length], q = donde(li, u[i]);
          u[i] = (u[i] + v * 70 * dt * q[2] / li.L) % 1;
          if (u[i] < 0) u[i] += 1;
          q = donde(li, u[i]);
          c.setAttribute('cx', q[0].toFixed(1)); c.setAttribute('cy', q[1].toFixed(1));
          c.setAttribute('opacity', v > 0.005 ? 0.85 : 0.35);
        });
      }
    };
  }

  // Franjas por el paso libre: en cada x de la lista, libre(x) da el tramo [arriba, abajo] por donde pasa el agua, y
  // cada corriente va a la misma fracción de ese tramo, a 3,5 px de las paredes. Así los puntos se acomodan a lo que
  // deja la pieza a cada apertura y nunca quedan sobre ella. El factor de velocidad sale de cuánto se angosta el paso.
  function franjas(xs, libre, fracciones) {
    return fracciones.map(function (fr) {
      return xs.map(function (x) {
        var l = libre(x), lo = l[0] + 3.5, hi = l[1] - 3.5;
        if (hi < lo) lo = hi = (l[0] + l[1]) / 2;
        return [x, lo + fr * (hi - lo), Math.min(5, (2 * R - 7) / Math.max(1, hi - lo))];
      });
    });
  }
  function mezclar(a, b, f) { f = Math.max(0, Math.min(1, f)); return a + (b - a) * f; }

  // ════════════════════════════════════════════════════════════════════
  // Válvulas
  // ════════════════════════════════════════════════════════════════════

  // Compuerta: la cuña baja de frente al flujo. Abierta, sale entera del paso.
  function compuerta(g) {
    tubo(g, 0, 100); tubo(g, 300, 400);
    s('path', { d: 'M100 ' + (CY - 42) + 'H150Q160 ' + (CY - 42) + ' 164 ' + (CY - 80) + 'H236Q240 ' + (CY - 42) + ' 250 ' + (CY - 42) + 'H300V' + (CY + 42) + 'H250Q242 ' + (CY + 42) + ' 236 ' + (CY + 70) + 'H164Q158 ' + (CY + 42) + ' 150 ' + (CY + 42) + 'H100Z', fill: K.metal, stroke: K.navy, 'stroke-width': 1.6 }, g);
    s('path', { d: camino([[100, CY - R], [176, CY - R], [176, CY - 76], [224, CY - 76], [224, CY - R], [300, CY - R], [300, CY + R], [224, CY + R], [224, CY + 60], [176, CY + 60], [176, CY + R], [100, CY + R]], true), fill: K.liq }, g);
    var gc = s('g', {}, g), c = corriente(gc, 18);
    // bonete, empaquetadura y volante
    s('rect', { x: 160, y: CY - 96, width: 80, height: 16, fill: K.pieza, stroke: K.navy, 'stroke-width': 1.2 }, g);
    s('path', { d: 'M180 ' + (CY - 96) + 'V' + (CY - 150) + 'H220V' + (CY - 96), fill: K.metal, stroke: K.navy, 'stroke-width': 1.4 }, g);
    s('rect', { x: 186, y: CY - 162, width: 28, height: 12, fill: K.pieza, stroke: K.navy, 'stroke-width': 1.2 }, g);
    for (var i = 0; i < 4; i++) s('rect', { x: 191, y: CY - 148 + i * 6, width: 18, height: 4, fill: K.goma }, g);
    var movil = s('g', {}, g);
    var vastago = s('rect', { x: 197, width: 6, fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 0.8 }, movil);
    var cuna = s('path', { fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1.4 }, movil);
    volante(g, 200, 24, 42);
    // asientos
    [[170, CY - R - 6], [170, CY + R], [224, CY - R - 6], [224, CY + R]].forEach(function (p) { s('rect', { x: p[0], y: p[1], width: 6, height: 6, fill: K.pieza, stroke: K.navy, 'stroke-width': 0.8 }, g); });
    rotulo(g, 300, 30, 'volante', 'start', [242, 24]);
    rotulo(g, 300, 70, 'empaquetadura', 'start', [214, CY - 140]);
    rotulo(g, 300, 105, 'bonete', 'start', [222, CY - 112]);
    var rotCuna = s('g', {}, g);
    rotulo(g, 30, 290, 'asiento', 'start', [173, CY + R + 3]);
    var a = 1;
    function poner(x) {
      a = Math.max(0, Math.min(1, x));
      var fondo = CY + R + 4 - a * (2 * R + 8), arriba = fondo - 62;
      cuna.setAttribute('d', camino([[184, arriba], [216, arriba], [213, fondo], [187, fondo]], true));
      vastago.setAttribute('y', 18); vastago.setAttribute('height', arriba - 18);
      while (rotCuna.firstChild) rotCuna.removeChild(rotCuna.firstChild);
      rotulo(rotCuna, 30, 70, 'vástago', 'start', [197, 60]);
      rotulo(rotCuna, 30, 110, 'cuña', 'start', [186, arriba + 18]);
      // bajo la cuña el paso va de su borde de abajo al fondo del tubo; antes y después se angosta poco a poco
      var techo = Math.max(CY - R, fondo);
      c.lineas(franjas([0, 100, 150, 160, 168, 175, 182, 191, 200, 209, 218, 225, 232, 240, 250, 300, 400], function (x) {
        var d = x < 200 ? x - 168 : 232 - x;
        return [mezclar(CY - R, techo, d / 14), CY + R];
      }, [0.15, 0.5, 0.85]));
    }
    poner(1);
    return { poner: poner, cuadro: function (dt, v) { c.mover(dt, a > 0.001 ? v : 0); } };
  }

  // Globo: el agua entra por abajo, pasa por el asiento horizontal y sale por arriba; el disco sube y baja.
  function globo(g) {
    tubo(g, 0, 100); tubo(g, 300, 400);
    s('path', { d: 'M100 ' + (CY - 42) + 'H128Q138 ' + (CY - 96) + ' 160 ' + (CY - 96) + 'H240Q262 ' + (CY - 96) + ' 272 ' + (CY - 42) + 'H300V' + (CY + 42) + 'H272Q262 ' + (CY + 84) + ' 240 ' + (CY + 84) + 'H160Q138 ' + (CY + 84) + ' 128 ' + (CY + 42) + 'H100Z', fill: K.metal, stroke: K.navy, 'stroke-width': 1.6 }, g);
    // cámara de entrada (abajo) y de salida (arriba); entre las dos, el tabique con el asiento
    s('path', { d: camino([[100, CY - R], [140, CY - R], [172, CY + 6], [228, CY + 6], [252, CY + R + 10], [240, CY + 68], [160, CY + 68], [134, CY + R], [100, CY + R]], true), fill: K.liq }, g);
    s('path', { d: camino([[148, CY - R], [158, CY - 84], [242, CY - 84], [256, CY - R], [300, CY - R], [300, CY + R], [262, CY + R], [234, CY - 4], [176, CY - 4]], true), fill: K.liq }, g);
    s('rect', { x: 182, y: CY - 4, width: 36, height: 10, fill: K.liq }, g);
    var gc = s('g', {}, g), c = corriente(gc, 24);
    [[170, CY - 6], [218, CY - 6]].forEach(function (p) { s('rect', { x: p[0], y: p[1], width: 12, height: 14, fill: K.pieza, stroke: K.navy, 'stroke-width': 1 }, g); });
    s('rect', { x: 166, y: CY - 104, width: 68, height: 16, fill: K.pieza, stroke: K.navy, 'stroke-width': 1.2 }, g);
    s('path', { d: 'M182 ' + (CY - 104) + 'V' + (CY - 146) + 'H218V' + (CY - 104), fill: K.metal, stroke: K.navy, 'stroke-width': 1.4 }, g);
    s('rect', { x: 187, y: CY - 158, width: 26, height: 12, fill: K.pieza, stroke: K.navy, 'stroke-width': 1.2 }, g);
    for (var i = 0; i < 4; i++) s('rect', { x: 192, y: CY - 144 + i * 6, width: 16, height: 4, fill: K.goma }, g);
    var vastago = s('rect', { x: 197, y: 18, width: 6, fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 0.8 }, g);
    var disco = s('path', { fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1.4 }, g);
    volante(g, 200, 24, 40);
    rotulo(g, 300, 30, 'volante', 'start', [240, 24]);
    rotulo(g, 300, 80, 'empaquetadura', 'start', [212, CY - 136]);
    rotulo(g, 30, 290, 'asiento', 'start', [176, CY + 8]);
    rotulo(g, 300, 290, 'tabique', 'start', [244, CY + R]);
    var rotD = s('g', {}, g), a = 1;
    function poner(x) {
      a = Math.max(0, Math.min(1, x));
      var lift = a * 26, base = CY - 4 - lift;
      disco.setAttribute('d', camino([[176, base - 14], [224, base - 14], [224, base], [216, base], [206, base + 12], [194, base + 12], [184, base], [176, base]], true));
      vastago.setAttribute('height', base - 14 - 18);
      while (rotD.firstChild) rotD.removeChild(rotD.firstChild);
      rotulo(rotD, 30, 70, 'vástago', 'start', [198, 58]);
      rotulo(rotD, 30, 110, 'disco', 'start', [178, base - 7]);
      // El agua sube por el asiento entre el tapón y el borde del asiento, sale de lado por debajo del borde del disco,
      // lo rodea y sigue a la salida. Una corriente va por la izquierda del disco y pasa por encima, detrás del
      // vástago; las otras dos, por la derecha. Nada cruza el disco ni los asientos.
      var f = Math.min(4, 1.2 / Math.max(0.05, a));
      var ancho = function (y) { return y < base - 14 ? 0 : y <= base ? 24 : y <= base + 12 ? 16 - 10 * (y - base) / 12 : 0; };
      var carril = function (y, lado, fr) {                    // dentro del asiento (x de 182 a 218), al lado del tapón
        var w = ancho(y), lo = lado < 0 ? 185.5 : 200 + w + 3.5, hi = lado < 0 ? 200 - w - 3.5 : 214.5;
        return hi < lo ? (lo + hi) / 2 : lo + fr * (hi - lo);
      };
      var yg = (CY - 6 + base) / 2;                              // entre la cara del asiento y el borde del disco
      var bordeIzq = function (y) { return y > CY - R ? 176 - 28 * (CY - 4 - y) / 22 : 148 + 10 * (CY - R - y) / 58; };
      var yIzq = base - 8;
      c.lineas([
        [[0, CY - 12], [118, CY - 12], [150, CY + 26], [carril(CY + 14, -1, 0.5), CY + 14], [carril(CY + 8, -1, 0.5), CY + 8, f], [carril(CY - 6, -1, 0.5), CY - 6, f],
          [172, yg, f], [Math.max(bordeIzq(yIzq) + 4, 160), yIzq], [178, base - 26], [222, base - 26], [244, base - 8], [272, CY - 8], [300, CY - 12], [400, CY - 12]],
        [[0, CY], [118, CY], [150, CY + 34], [carril(CY + 14, 1, 0.3), CY + 14], [carril(CY + 8, 1, 0.3), CY + 8, f], [carril(CY - 6, 1, 0.3), CY - 6, f],
          [228, yg, f], [238, base - 4], [266, CY - 4], [300, CY], [400, CY]],
        [[0, CY + 12], [118, CY + 12], [150, CY + 42], [carril(CY + 14, 1, 0.8), CY + 14], [carril(CY + 8, 1, 0.8), CY + 8, f], [carril(CY - 6, 1, 0.8), CY - 6, f],
          [230, yg + 2, f], [242, base + 4], [270, CY + 6], [300, CY + 12], [400, CY + 12]]
      ]);
    }
    poner(1);
    return { poner: poner, cuadro: function (dt, v) { c.mover(dt, a > 0.001 ? v : 0); } };
  }

  // Diafragma: una membrana de goma baja sobre un vertedero; nada metálico que se mueva toca el líquido.
  function diafragma(g) {
    tubo(g, 0, 100); tubo(g, 300, 400);
    s('path', { d: 'M100 ' + (CY - 42) + 'H140Q150 ' + (CY - 42) + ' 152 ' + (CY - 52) + 'H248Q250 ' + (CY - 42) + ' 260 ' + (CY - 42) + 'H300V' + (CY + 42) + 'H100Z', fill: K.metal, stroke: K.navy, 'stroke-width': 1.6 }, g);
    var fondo = [[100, CY + R], [150, CY + R], [168, CY + R - 6], [184, CY - 2], [200, CY - 8], [216, CY - 2], [232, CY + R - 6], [250, CY + R], [300, CY + R]];
    var agua = s('path', { fill: K.liq }, g);
    var gc = s('g', {}, g), c = corriente(gc, 18);
    s('path', { d: camino(fondo), fill: 'none', stroke: K.navy, 'stroke-width': 1 }, g);
    // bonete en cúpula
    s('path', { d: 'M146 ' + (CY - 52) + 'Q146 ' + (CY - 118) + ' 200 ' + (CY - 118) + 'Q254 ' + (CY - 118) + ' 254 ' + (CY - 52) + 'Z', fill: K.aire, stroke: K.navy, 'stroke-width': 1.6 }, g);
    s('rect', { x: 140, y: CY - 58, width: 120, height: 8, fill: K.pieza, stroke: K.navy, 'stroke-width': 1 }, g);
    s('path', { d: 'M184 ' + (CY - 116) + 'V' + (CY - 150) + 'H216V' + (CY - 116), fill: K.metal, stroke: K.navy, 'stroke-width': 1.4 }, g);
    var vastago = s('rect', { x: 197, y: 18, width: 6, fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 0.8 }, g);
    var compresor = s('path', { fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1.2 }, g);
    var membrana = s('path', { fill: 'none', stroke: K.goma, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    volante(g, 200, 24, 38);
    rotulo(g, 300, 30, 'volante', 'start', [238, 24]);
    rotulo(g, 30, 290, 'vertedero', 'start', [200, CY - 6]);
    var rotD = s('g', {}, g), a = 1;
    function poner(x) {
      a = Math.max(0, Math.min(1, x));
      var yd = CY - 12 - a * 46;
      var dm = 'M150 ' + (CY - 52) + 'C170 ' + (CY - 52) + ' 176 ' + yd + ' 200 ' + yd + 'C224 ' + yd + ' 230 ' + (CY - 52) + ' 250 ' + (CY - 52);
      membrana.setAttribute('d', dm);
      agua.setAttribute('d', 'M100 ' + (CY - R) + 'H146L150 ' + (CY - 52) + dm.replace(/^M150 [^C]+/, '') + 'L254 ' + (CY - R) + 'H300V' + (CY + R) + camino(fondo.slice().reverse()).replace(/^M/, 'L') + 'Z');
      compresor.setAttribute('d', camino([[180, yd - 30], [220, yd - 30], [220, yd - 8], [212, yd - 3], [188, yd - 3], [180, yd - 8]], true));
      vastago.setAttribute('height', yd - 30 - 18);
      while (rotD.firstChild) rotD.removeChild(rotD.firstChild);
      rotulo(rotD, 30, 80, 'compresor', 'start', [182, yd - 18]);
      rotulo(rotD, 300, 110, 'diafragma', 'start', [232, (CY - 52 + yd) / 2 + 4]);
      // el paso va de la membrana (o del tubo, si la membrana está más arriba) al vertedero, punto por punto
      var bez = [], k;
      for (k = 0; k <= 24; k++) {
        var tt = k / 24, mt = 1 - tt;
        bez.push([mt * mt * mt * 150 + 3 * mt * mt * tt * 170 + 3 * mt * tt * tt * 176 + tt * tt * tt * 200, mt * mt * mt * (CY - 52) + 3 * mt * mt * tt * (CY - 52) + 3 * mt * tt * tt * yd + tt * tt * tt * yd]);
      }
      var enLinea = function (pts, x) {
        for (var i = 1; i < pts.length; i++) if (pts[i][0] >= x) { var q = (x - pts[i - 1][0]) / Math.max(1e-9, pts[i][0] - pts[i - 1][0]); return pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * q; }
        return pts[pts.length - 1][1];
      };
      var memb = function (x) { return enLinea(bez, x <= 200 ? x : 400 - x); };
      c.lineas(franjas([0, 100, 140, 150, 158, 166, 174, 182, 190, 200, 210, 218, 226, 234, 242, 250, 260, 300, 400], function (x) {
        if (x < 150 || x > 250) return [CY - R, CY + R];
        return [Math.max(memb(x), CY - R - 6), enLinea(fondo, x)];
      }, [0.2, 0.5, 0.8]));
    }
    poner(1);
    return { poner: poner, cuadro: function (dt, v) { c.mover(dt, a > 0.001 ? v : 0); } };
  }

  // Bola, vista desde arriba: el paso de la bola gira con la palanca. poner(θ), ángulo de cierre en grados.
  function bola(g) {
    tubo(g, 0, 100); tubo(g, 300, 400);
    s('path', { d: 'M100 ' + (CY - 44) + 'H140Q150 ' + (CY - 66) + ' 200 ' + (CY - 66) + 'Q250 ' + (CY - 66) + ' 260 ' + (CY - 44) + 'H300V' + (CY + 44) + 'H260Q250 ' + (CY + 66) + ' 200 ' + (CY + 66) + 'Q150 ' + (CY + 66) + ' 140 ' + (CY + 44) + 'H100Z', fill: K.metal, stroke: K.navy, 'stroke-width': 1.6 }, g);
    s('rect', { x: 100, y: CY - R, width: 60, height: 2 * R, fill: K.liq }, g);
    s('rect', { x: 240, y: CY - R, width: 60, height: 2 * R, fill: K.liq }, g);
    // los puntos solo se ven por donde hay agua: el tubo a los dos lados de la bola y el paso girado
    var idp = 'corte-bola-agua-' + Math.random().toString(36).slice(2, 7);
    s('defs', {}, g).innerHTML = '<clipPath id="corte-bola-clip"><circle cx="200" cy="' + CY + '" r="44"/></clipPath>' +
      '<clipPath id="' + idp + '"><rect x="0" y="' + (CY - R) + '" width="156" height="' + 2 * R + '"/><rect x="244" y="' + (CY - R) + '" width="156" height="' + 2 * R + '"/>' +
      '<rect class="paso" x="150" y="' + (CY - R) + '" width="100" height="' + 2 * R + '"/></clipPath>';
    var pasoClip = g.querySelector('#' + idp + ' .paso');
    s('circle', { cx: 200, cy: CY, r: 44, fill: K.pieza, stroke: K.navy, 'stroke-width': 1.4 }, g);
    var paso = s('g', { 'clip-path': 'url(#corte-bola-clip)' }, g);
    var rect = s('rect', { x: 150, y: CY - R, width: 100, height: 2 * R, fill: K.liq, stroke: K.navy, 'stroke-width': 1 }, paso);
    [[150, CY - R - 8], [150, CY + R], [244, CY - R - 8], [244, CY + R]].forEach(function (p) { s('rect', { x: p[0] + (p[0] < 200 ? 0 : 0), y: p[1], width: 6, height: 8, fill: K.goma }, g); });
    var gc = s('g', { 'clip-path': 'url(#' + idp + ')' }, g), c = corriente(gc, 18);
    var palanca = s('g', {}, g);
    s('rect', { x: 196, y: CY - 4, width: 92, height: 8, rx: 4, fill: 'none', stroke: K.navy, 'stroke-width': 2, 'stroke-dasharray': '5 3' }, palanca);
    s('rect', { x: 192, y: CY - 8, width: 16, height: 16, fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1.2 }, g);
    rotulo(g, 30, 40, 'vista desde arriba', 'start');
    rotulo(g, 30, 290, 'bola', 'start', [176, CY + 30]);
    rotulo(g, 300, 290, 'asiento', 'start', [247, CY + R + 4]);
    var rotP = s('g', {}, g), th = 0;
    function poner(grados) {
      th = Math.max(0, Math.min(90, grados));
      rect.setAttribute('transform', 'rotate(' + th + ' 200 ' + CY + ')');
      pasoClip.setAttribute('transform', 'rotate(' + th + ' 200 ' + CY + ')');
      palanca.setAttribute('transform', 'rotate(' + th + ' 200 ' + CY + ')');
      while (rotP.firstChild) rotP.removeChild(rotP.firstChild);
      rotulo(rotP, 300, 60, 'palanca', 'start', [200 + 80 * Math.cos(th * RAD), CY + 80 * Math.sin(th * RAD)]);
      // dentro de la bola el agua solo pasa por el paso girado, y no se sale del alto del tubo
      var sn = Math.sin(th * RAD), cs = Math.cos(th * RAD), xs = [0, 100, 150, 156];
      for (var x = 164; x <= 236; x += 8) xs.push(x);
      xs.push(244, 250, 300, 400);
      c.lineas(franjas(xs, function (x) {
        if (x < 156 || x > 244) return [CY - R, CY + R];
        if (cs < 0.05) return [CY, CY];
        var lo = Math.max(CY - R, CY + ((x - 200) * sn - R) / cs), hi = Math.min(CY + R, CY + ((x - 200) * sn + R) / cs);
        return hi < lo ? [CY, CY] : [lo, hi];
      }, [0.2, 0.5, 0.8]));
    }
    poner(0);
    return { poner: poner, cuadro: function (dt, v) { c.mover(dt, th < 88 ? v : 0); } };
  }

  // Mariposa, vista desde arriba: un disco gira sobre su eje dentro del tubo. poner(θ), ángulo de cierre.
  // La higiénica (hig) no tiene bridas: dos mitades del cuerpo aprietan un anillo de sello más ancho, que hace de
  // asiento, y los extremos van soldados al tubo.
  function mariposa(g, hig) {
    tubo(g, 0, 172); tubo(g, 228, 400);
    if (hig) {
      [[172, 28], [200, 28]].forEach(function (b) { s('rect', { x: b[0], y: CY - 44, width: b[1], height: 88, rx: 4, fill: K.metal, stroke: K.navy, 'stroke-width': 1.6 }, g); });
      s('rect', { x: 172, y: CY - R, width: 56, height: 2 * R, fill: K.liq }, g);
      [CY - 36, CY + 36].forEach(function (y) { s('rect', { x: 180, y: y - 3, width: 40, height: 6, fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 0.8 }, g); });
      s('rect', { x: 176, y: CY - R - 7, width: 48, height: 7, fill: K.goma }, g);
      s('rect', { x: 176, y: CY + R, width: 48, height: 7, fill: K.goma }, g);
      [[166, 172], [228, 234]].forEach(function (x) {
        s('path', { d: 'M' + x[0] + ' ' + (CY - R - T) + 'L' + x[1] + ' ' + (CY - R - T - 5) + 'L' + x[1] + ' ' + (CY - R - T) + 'Z' + 'M' + x[0] + ' ' + (CY + R + T) + 'L' + x[1] + ' ' + (CY + R + T + 5) + 'L' + x[1] + ' ' + (CY + R + T) + 'Z', fill: K.navy }, g);
      });
    } else {
      s('rect', { x: 172, y: CY - 46, width: 56, height: 92, fill: K.metal, stroke: K.navy, 'stroke-width': 1.6 }, g);
      s('rect', { x: 172, y: CY - R, width: 56, height: 2 * R, fill: K.liq }, g);
      [[164, 8], [228, 8]].forEach(function (b) { s('rect', { x: b[0], y: CY - 52, width: b[1], height: 104, fill: K.pieza, stroke: K.navy, 'stroke-width': 1.2 }, g); });
      s('rect', { x: 172, y: CY - R - 4, width: 56, height: 4, fill: K.goma }, g);
      s('rect', { x: 172, y: CY + R, width: 56, height: 4, fill: K.goma }, g);
    }
    var gc = s('g', {}, g), c = corriente(gc, 18);
    var disco = s('g', {}, g);
    s('path', { d: 'M' + (200 - R + 1) + ' ' + CY + 'Q200 ' + (CY - 6) + ' ' + (200 + R - 1) + ' ' + CY + 'Q200 ' + (CY + 6) + ' ' + (200 - R + 1) + ' ' + CY + 'Z', fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1.4 }, disco);
    s('circle', { cx: 200, cy: CY, r: 5, fill: K.navy }, g);
    rotulo(g, 30, 40, 'vista desde arriba', 'start');
    rotulo(g, 300, 60, 'eje', 'start', [204, CY - 3]);
    rotulo(g, 30, 290, 'disco', 'start', [186, CY + 6]);
    if (hig) {
      rotulo(g, 300, 290, 'anillo de sello', 'start', [222, CY + R + 4]);
      rotulo(g, 250, 104, 'cuerpo en\ndos mitades', 'start', [222, CY - 40]);
      rotulo(g, 30, 250, 'extremo soldado', 'start', [168, CY + R + T + 2]);
    } else rotulo(g, 300, 290, 'anillo de goma', 'start', [222, CY + R + 2]);
    var th = 0;
    function poner(grados) {
      th = Math.max(0, Math.min(90, grados));
      disco.setAttribute('transform', 'rotate(' + th + ' 200 ' + CY + ')');
      // Cada corriente pasa por el hueco entre la punta del disco y el tubo: las de arriba por la punta de la
      // izquierda, que sube al girar, y las de abajo por la de la derecha. Al lado del disco no hay nada que cruzar.
      var px = R * Math.cos(th * RAD), py = R * Math.sin(th * RAD);
      c.lineas([0.3, 0.75].map(function (gq) { return [-1, gq]; }).concat([0.3, 0.75].map(function (gq) { return [1, gq]; })).map(function (q) {
        var lado = q[0], gq = q[1], pared = CY + lado * (R - 3.5), punta = CY + lado * (py + 4.5);
        var y = CY + lado * (R - 3.5 - gq * (R - 8)), yh = Math.abs(pared - CY) > Math.abs(punta - CY) ? pared + (punta - pared) * gq : pared;
        var hueco = Math.max(1, Math.abs(pared - punta)), f = Math.min(5, (R - 8) / hueco);
        return [[0, y], [150, y], [200 + lado * px, yh, f], [250, y], [400, y]];
      }));
    }
    poner(0);
    return { poner: poner, cuadro: function (dt, v) { c.mover(dt, th < 88 ? v : 0); } };
  }

  // Retención de bisagra: el disco cuelga de un pasador y el flujo lo levanta. poner(a): 0 cerrada, 1 abierta.
  function retencion(g) {
    tubo(g, 0, 100); tubo(g, 300, 400);
    s('path', { d: 'M100 ' + (CY - 42) + 'H146Q150 ' + (CY - 78) + ' 168 ' + (CY - 78) + 'H262Q276 ' + (CY - 78) + ' 278 ' + (CY - 42) + 'H300V' + (CY + 42) + 'H270Q262 ' + (CY + 64) + ' 240 ' + (CY + 64) + 'H180Q160 ' + (CY + 64) + ' 154 ' + (CY + 42) + 'H100Z', fill: K.metal, stroke: K.navy, 'stroke-width': 1.6 }, g);
    s('path', { d: camino([[100, CY - R], [168, CY - R], [168, CY - 66], [264, CY - 66], [270, CY - R], [300, CY - R], [300, CY + R], [266, CY + R], [250, CY + 52], [184, CY + 52], [168, CY + R], [100, CY + R]], true), fill: K.liq }, g);
    var gc = s('g', {}, g), c = corriente(gc, 18);
    s('rect', { x: 150, y: CY - 92, width: 132, height: 14, fill: K.pieza, stroke: K.navy, 'stroke-width': 1.2 }, g);
    // asiento inclinado
    s('path', { d: camino([[160, CY - R - 6], [170, CY - R - 6], [174, CY - R + 4], [164, CY - R + 4]], true), fill: K.pieza, stroke: K.navy, 'stroke-width': 1 }, g);
    s('path', { d: camino([[160, CY + R - 4], [168, CY + R - 4], [164, CY + R + 6], [156, CY + R + 6]], true), fill: K.pieza, stroke: K.navy, 'stroke-width': 1 }, g);
    var piv = [178, CY - 50];
    var disco = s('g', {}, g);
    s('path', { d: 'M' + piv[0] + ' ' + piv[1] + 'L' + (piv[0] + 4) + ' ' + (CY - 4), stroke: K.navy, 'stroke-width': 4 }, disco);
    s('rect', { x: piv[0] - 6 + 4, y: CY - R - 8, width: 10, height: 2 * R + 16, rx: 2, fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1.4, transform: 'rotate(-8 ' + (piv[0] + 4) + ' ' + CY + ')' }, disco);
    s('circle', { cx: piv[0], cy: piv[1], r: 5, fill: K.navy }, g);
    rotulo(g, 30, 40, 'tapa', 'start', [180, CY - 86]);
    rotulo(g, 300, 40, 'bisagra', 'start', [piv[0] + 5, piv[1]]);
    rotulo(g, 30, 290, 'asiento', 'start', [160, CY + R + 2]);
    var rotD = s('g', {}, g), a = 1;
    function poner(x) {
      a = Math.max(0, Math.min(1, x));
      var phi = -a * 68;
      disco.setAttribute('transform', 'rotate(' + phi + ' ' + piv[0] + ' ' + piv[1] + ')');
      while (rotD.firstChild) rotD.removeChild(rotD.firstChild);
      var px = piv[0] + Math.sin(-phi * RAD) * 52, py = piv[1] + Math.cos(-phi * RAD) * 52;
      rotulo(rotD, 300, 290 - 30, 'disco', 'start', [px, py]);
      c.lineas([-0.5, 0, 0.5].map(function (k) {
        var y = CY + k * R;
        return [[0, y], [150, y], [210, CY + 18 + k * 16], [260, y], [400, y]];
      }));
    }
    poner(1);
    return { poner: poner, cuadro: function (dt, v) { c.mover(dt, a > 0.02 ? v : 0); } };
  }

  // ════════════════════════════════════════════════════════════════════
  // Medidores
  // ════════════════════════════════════════════════════════════════════

  // Transmisor de presión diferencial arriba, con sus dos tubos de impulso hasta las tomas
  function transmisor(g, x1, x2, rotular, y0) {
    var xm = (x1 + x2) / 2;
    y0 = y0 || CY - R - T;
    s('path', { d: 'M' + x1 + ' ' + y0 + 'V70H' + (xm - 14) + 'M' + x2 + ' ' + y0 + 'V70H' + (xm + 14), stroke: K.navy, 'stroke-width': 2, fill: 'none' }, g);
    s('rect', { x: xm - 24, y: 40, width: 48, height: 40, rx: 4, fill: K.metal, stroke: K.navy, 'stroke-width': 1.6 }, g);
    s('circle', { cx: xm, cy: 34, r: 12, fill: K.metal, stroke: K.navy, 'stroke-width': 1.4 }, g);
    s('text', { x: xm, y: 66, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: K.navy }, g, 'ΔP');
    if (rotular !== false) rotulo(g, xm + 34, 40, 'transmisor de\npresión diferencial', 'start', [xm + 24, 52]);
  }

  // Placa de orificio: poner(β)
  function placa(g) {
    tubo(g, 0, 400);
    var ge = s('g', {}, g);
    [183, 201].forEach(function (x) { s('rect', { x: x, y: CY - 46, width: 16, height: 92, fill: K.pieza, stroke: K.navy, 'stroke-width': 1.2 }, g); });
    [CY - 37, CY + 37].forEach(function (y) { s('rect', { x: 179, y: y - 2.5, width: 42, height: 5, fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 0.8 }, g); });
    s('rect', { x: 183, y: CY - R, width: 34, height: 2 * R, fill: K.liq }, g);
    s('rect', { x: 198, y: CY - 66, width: 4, height: 22, fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1 }, g);
    var pl = s('g', {}, g);
    transmisor(g, 190, 210, true, CY - R);
    var gc = s('g', {}, g), c = corriente(gc, 28);
    rotulo(g, 30, 290, 'placa', 'start', [200, CY + R + 16]);
    rotulo(g, 300, 290, 'vena contracta', 'start', [238, CY + 12]);
    rotulo(g, 30, 110, 'tomas en\nlas bridas', 'start', [190, CY - 52]);
    rotulo(g, 300, 120, 'paleta', 'start', [202, CY - 60]);
    var b = 0.6;
    function poner(beta) {
      b = Math.max(0.2, Math.min(0.75, beta));
      var r0 = b * R;
      while (pl.firstChild) pl.removeChild(pl.firstChild);
      s('path', { d: camino([[198, CY - 46], [202, CY - 46], [202, CY - r0 - 3], [206, CY - r0], [198, CY - r0]], true) + camino([[198, CY + 46], [202, CY + 46], [202, CY + r0 + 3], [206, CY + r0], [198, CY + r0]], true), fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1.2 }, pl);
      // remolinos en las esquinas, aguas abajo
      while (ge.firstChild) ge.removeChild(ge.firstChild);
      [-1, 1].forEach(function (l) {
        s('ellipse', { cx: 236, cy: CY + l * (R - (R - r0) * 0.45), rx: 22, ry: (R - r0) * 0.38, fill: 'none', stroke: K.liqOsc, 'stroke-width': 1, 'stroke-dasharray': '3 3', opacity: 0.7 }, ge);
      });
      var rc = r0 * 0.78, xc = 200 + 0.5 * 2 * R;
      c.lineas([-0.8, -0.4, 0, 0.4, 0.8].map(function (k) {
        var f = Math.pow(R / r0, 2) * 0.9;
        return [[0, CY + k * R], [150, CY + k * R], [200, CY + k * r0 * 0.95, f * 0.8], [xc, CY + k * rc, f], [300, CY + k * R * 0.75, 1.4], [400, CY + k * R]];
      }));
    }
    poner(0.6);
    return { poner: poner, cuadro: function (dt, v) { c.mover(dt, v); } };
  }

  // Venturi: cono de entrada, garganta y cono de salida largo. poner(β)
  function venturi(g) {
    var cuerpo = s('g', {}, g);
    transmisor(g, 112, 192);
    var gc = s('g', {}, g), c = corriente(gc, 28);
    rotulo(g, 30, 290, 'cono de entrada', 'start', [140, CY + R + 2]);
    rotulo(g, 200, 290, 'garganta', 'middle', [195, CY + 18]);
    rotulo(g, 300, 270, 'cono de\nsalida', 'start', [280, CY + R]);
    var b = 0.6;
    function poner(beta) {
      b = Math.max(0.3, Math.min(0.75, beta));
      var rt = b * R, x1 = 120, x2 = x1 + (R - rt) / Math.tan(10.5 * RAD), x3 = x2 + 30, x4 = x3 + (R - rt) / Math.tan(3.5 * RAD);
      x4 = Math.min(x4, 392);
      while (cuerpo.firstChild) cuerpo.removeChild(cuerpo.firstChild);
      var arr = [[0, CY - R], [x1, CY - R], [x2, CY - rt], [x3, CY - rt], [x4, CY - R], [400, CY - R]];
      var abj = arr.map(function (p) { return [p[0], 2 * CY - p[1]]; });
      s('path', { d: camino(arr.concat([[400, CY - R - T - 8], [0, CY - R - T - 8]]), true), fill: K.pared, stroke: K.navy, 'stroke-width': 1.4 }, cuerpo);
      s('path', { d: camino(abj.concat([[400, CY + R + T + 8], [0, CY + R + T + 8]]), true), fill: K.pared, stroke: K.navy, 'stroke-width': 1.4 }, cuerpo);
      s('path', { d: camino(arr.concat(abj.slice().reverse()), true), fill: K.liq }, cuerpo);
      c.lineas([-0.75, -0.35, 0, 0.35, 0.75].map(function (k) {
        var f = Math.pow(R / rt, 2);
        return [[0, CY + k * R], [x1, CY + k * R], [x2, CY + k * rt, f], [x3, CY + k * rt, f], [x4, CY + k * R], [400, CY + k * R]];
      }));
    }
    poner(0.6);
    return { poner: poner, cuadro: function (dt, v) { c.mover(dt, v); } };
  }

  // Tobera de radio largo entre bridas: entrada en cuarto de elipse y garganta recta que termina en seco.
  // Tomas a 1D antes y ½D después de la cara de entrada. poner(β)
  function tobera(g) {
    tubo(g, 0, 400);
    var ge = s('g', {}, g), cuerpo = s('g', {}, g);
    transmisor(g, 118, 196, true, CY - R);
    var gc = s('g', {}, g), c = corriente(gc, 28);
    rotulo(g, 30, 290, 'entrada elíptica', 'start', [160, CY - R + 8]);
    rotulo(g, 300, 290, 'chorro', 'start', [250, CY + 8]);
    rotulo(g, 30, 110, 'tomas a 1D\ny a ½D', 'start', [118, CY - R - T - 2]);
    var b = 0.55;
    function poner(beta) {
      b = Math.max(0.3, Math.min(0.75, beta));
      var rt = b * R, x0 = 168, x1 = 168 + 0.6 * 2 * R, x2 = x1 + 0.35 * 2 * R;
      while (cuerpo.firstChild) cuerpo.removeChild(cuerpo.firstChild);
      while (ge.firstChild) ge.removeChild(ge.firstChild);
      var arco = [];
      for (var i = 0; i <= 16; i++) { var a = i / 16 * Math.PI / 2; arco.push([x0 + (x1 - x0) * Math.sin(a), CY - rt - (R - rt) * Math.cos(a)]); }
      var arr = [[x0, CY - R]].concat(arco).concat([[x2, CY - rt], [x2, CY - rt - 3], [x2 - 6, CY - R]]);
      [1, -1].forEach(function (l) {
        s('path', { d: camino(arr.map(function (p) { return [p[0], CY + l * (CY - p[1]) * -1 + 0]; }).map(function (p) { return [p[0], l > 0 ? p[1] : 2 * CY - p[1]]; }), true), fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1.2 }, cuerpo);
        s('ellipse', { cx: x2 + 40, cy: CY + l * (R - (R - rt) * 0.45), rx: 34, ry: (R - rt) * 0.38, fill: 'none', stroke: K.liqOsc, 'stroke-width': 1, 'stroke-dasharray': '3 3', opacity: 0.7 }, ge);
      });
      [[x0 - 10, 8], [x0 - 2, 8]].forEach(function (bb) { s('rect', { x: bb[0], y: CY - 46, width: bb[1], height: 92, fill: K.pieza, stroke: K.navy, 'stroke-width': 1.2 }, cuerpo); });
      s('rect', { x: x0 - 10, y: CY - R, width: 10, height: 2 * R, fill: K.liq }, cuerpo);
      c.lineas([-0.8, -0.4, 0, 0.4, 0.8].map(function (k) {
        var f = Math.pow(R / rt, 2);
        return [[0, CY + k * R], [x0 - 10, CY + k * R], [x1, CY + k * rt * 0.98, f], [x2, CY + k * rt, f], [x2 + 70, CY + k * rt * 1.15, f * 0.8], [360, CY + k * R * 0.85, 1.3], [400, CY + k * R]];
      }));
    }
    poner(0.55);
    return { poner: poner, cuadro: function (dt, v) { c.mover(dt, v); } };
  }

  // Magnético: bobinas arriba y abajo, electrodos a los lados, revestimiento aislante
  function magnetico(g) {
    tubo(g, 0, 124); tubo(g, 276, 400);
    bridas(g, 128, CY, 46); bridas(g, 272, CY, 46);
    s('rect', { x: 128, y: CY - R - 14, width: 144, height: 2 * R + 28, fill: K.metal, stroke: K.navy, 'stroke-width': 1.6 }, g);
    s('rect', { x: 128, y: CY - R - 4, width: 144, height: 2 * R + 8, fill: K.goma, opacity: 0.85 }, g);
    s('rect', { x: 124, y: CY - R, width: 152, height: 2 * R, fill: K.liq }, g);
    // bobinas y campo
    [CY - R - 30, CY + R + 14].forEach(function (y) {
      s('rect', { x: 168, y: y, width: 64, height: 16, rx: 3, fill: K.pieza, stroke: K.navy, 'stroke-width': 1.2 }, g);
      for (var i = 0; i < 7; i++) s('line', { x1: 172 + i * 9, y1: y + 2, x2: 176 + i * 9, y2: y + 14, stroke: K.navy, 'stroke-width': 1 }, g);
    });
    for (var j = 0; j < 4; j++) s('line', { x1: 178 + j * 14, y1: CY - R - 12, x2: 178 + j * 14, y2: CY + R + 12, stroke: K.campo, 'stroke-width': 1, 'stroke-dasharray': '4 4' }, g);
    s('circle', { cx: 200, cy: CY, r: 7, fill: K.metal, stroke: K.navy, 'stroke-width': 1.4 }, g);
    s('circle', { cx: 200, cy: CY, r: 2, fill: K.navy }, g);
    s('path', { d: 'M200 ' + (CY - R - 30) + 'V60', stroke: K.navy, 'stroke-width': 2 }, g);
    s('rect', { x: 172, y: 30, width: 56, height: 32, rx: 4, fill: K.metal, stroke: K.navy, 'stroke-width': 1.6 }, g);
    var gc = s('g', {}, g), c = corriente(gc, 24);
    c.lineas([-0.75, -0.35, 0, 0.35, 0.75].map(function (k) { return [[0, CY + k * R], [400, CY + k * R]]; }));
    rotulo(g, 240, 40, 'convertidor', 'start', [228, 46]);
    rotulo(g, 30, 110, 'bobina', 'start', [170, CY - R - 22]);
    rotulo(g, 300, 112, 'campo\nmagnético', 'start', [220, CY - R - 4]);
    rotulo(g, 30, 274, 'revestimiento\naislante', 'start', [140, CY + R + 2]);
    rotulo(g, 300, 274, 'electrodo,\ny otro detrás', 'start', [206, CY + 4]);
    return { poner: function () {}, cuadro: function (dt, v) { c.mover(dt, v); } };
  }

  // Vórtice: un cuerpo romo suelta remolinos alternados; un sensor cuenta su frecuencia
  function vortice(g) {
    tubo(g, 0, 400);
    bridas(g, 120, CY, 46); bridas(g, 300, CY, 46);
    var gc = s('g', {}, g), c = corriente(gc, 20);
    s('path', { d: camino([[160, CY - R], [172, CY - R], [168, CY + R], [164, CY + R]], true), fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1.4 }, g);
    s('path', { d: camino([[156, CY - R], [176, CY - R], [176, CY + R], [156, CY + R]], true), fill: 'none' }, g);
    s('rect', { x: 236, y: CY - R - 18, width: 8, height: 30, fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1 }, g);
    s('path', { d: 'M240 ' + (CY - R - 18) + 'V70', stroke: K.navy, 'stroke-width': 2 }, g);
    s('rect', { x: 212, y: 36, width: 56, height: 34, rx: 4, fill: K.metal, stroke: K.navy, 'stroke-width': 1.6 }, g);
    var gv = s('g', {}, g), rem = [];
    for (var i = 0; i < 8; i++) {
      var e = s('g', {}, gv);
      s('path', { d: 'M-8 0A8 8 0 1 1 0 8', fill: 'none', stroke: K.liqOsc, 'stroke-width': 1.6 }, e);
      s('path', { d: 'M0 8l-4 -3l0 6z', fill: K.liqOsc }, e);
      rem.push({ el: e, x: 176 + i * 28, lado: i % 2 ? 1 : -1, giro: 0 });
    }
    c.lineas([-0.8, -0.4, 0.4, 0.8].map(function (k) { return [[0, CY + k * R], [150, CY + k * R], [168, CY + k * R * 1.05, 1.5], [200, CY + k * R * 0.9], [400, CY + k * R]]; }));
    rotulo(g, 278, 40, 'electrónica', 'start', [268, 48]);
    rotulo(g, 30, 290, 'cuerpo romo', 'start', [166, CY + R - 4]);
    rotulo(g, 300, 120, 'sensor', 'start', [244, CY - R - 8]);
    rotulo(g, 300, 274, 'remolinos\nalternados', 'start', [300, CY + 12]);
    return {
      poner: function () {},
      cuadro: function (dt, v) {
        c.mover(dt, v);
        rem.forEach(function (r) {
          r.x += v * 70 * dt; r.giro += v * 360 * dt * r.lado;
          if (r.x > 400) r.x -= 8 * 28;
          var y = CY + r.lado * R * 0.42;
          r.el.setAttribute('transform', 'translate(' + r.x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + r.giro.toFixed(0) + ')');
          r.el.setAttribute('opacity', r.x < 182 ? 0 : 0.9);
        });
      }
    };
  }

  // Coriolis: dos tubos curvos que vibran; con flujo, las dos ramas se desfasan
  function coriolis(g) {
    tubo(g, 0, 100); tubo(g, 300, 400);
    bridas(g, 104, CY, 46); bridas(g, 296, CY, 46);
    s('rect', { x: 108, y: 54, width: 184, height: CY + 46 - 54, rx: 10, fill: 'none', stroke: K.sec, 'stroke-width': 1.2, 'stroke-dasharray': '6 4' }, g);
    s('rect', { x: 108, y: CY - R - T, width: 26, height: 2 * (R + T), fill: K.metal, stroke: K.navy, 'stroke-width': 1.2 }, g);
    s('rect', { x: 266, y: CY - R - T, width: 26, height: 2 * (R + T), fill: K.metal, stroke: K.navy, 'stroke-width': 1.2 }, g);
    var tubos = s('path', { fill: 'none', stroke: K.pieza, 'stroke-width': 16, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    var agua = s('path', { fill: 'none', stroke: K.liq, 'stroke-width': 10, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    var exc = s('rect', { width: 20, height: 12, fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1 }, g);
    var sen = [s('circle', { r: 6, fill: K.campo }, g), s('circle', { r: 6, fill: K.campo }, g)];
    var gc = s('g', {}, g), c = corriente(gc, 22);
    rotulo(g, 300, 30, 'tubos que\nvibran', 'start', [262, 90]);
    rotulo(g, 30, 274, 'sensor de\nentrada', 'start', [150, 120]);
    rotulo(g, 300, 270, 'sensor de\nsalida', 'start', [250, 120]);
    rotulo(g, 200, 290, 'excitador', 'middle', [200, 78]);
    var t = 0, vv = 1;
    function forma(dy1, dy2, dyc) {
      return [[121, CY], [140, CY - 40], [150, 110 + dy1], [175, 80 + (dy1 + dyc) / 2], [200, 76 + dyc], [225, 80 + (dy2 + dyc) / 2], [250, 110 + dy2], [260, CY - 40], [279, CY]];
    }
    return {
      poner: function () {},
      cuadro: function (dt, v) {
        t += dt; vv = v;
        var w = 2 * Math.PI * 1.4, A = 6, fase = 0.5 * v;
        var dyc = A * Math.sin(w * t), dy1 = 0.7 * A * Math.sin(w * t + fase), dy2 = 0.7 * A * Math.sin(w * t - fase);
        var p = forma(dy1, dy2, dyc), d = camino(p);
        tubos.setAttribute('d', d); agua.setAttribute('d', d);
        exc.setAttribute('x', 190); exc.setAttribute('y', 62 + dyc);
        sen[0].setAttribute('cx', 150); sen[0].setAttribute('cy', 110 + dy1);
        sen[1].setAttribute('cx', 250); sen[1].setAttribute('cy', 110 + dy2);
        c.lineas([[[0, CY - 10], [121, CY - 10]].concat(p.slice(1, -1)).concat([[279, CY - 10], [400, CY - 10]]), [[0, CY + 10], [121, CY + 10]].concat(p.slice(1, -1)).concat([[279, CY + 10], [400, CY + 10]])]);
        c.mover(dt, v);
      }
    };
  }

  // Rotámetro: tubo cónico vertical con el flotador; el caudal sube por dentro. poner(f): altura del flotador (0 a 1)
  function rotametro(g) {
    var x = 200, y0 = 262, y1 = 52;
    tubo(g, 0, 150, y0 + 6, 14); tubo(g, 250, 400, y1 - 6, 14);
    s('path', { d: camino([[150, y0 - 8], [x - 10, y0 - 8], [x - 10, y0 + 20], [150, y0 + 20]], true), fill: K.liq }, g);
    s('path', { d: camino([[x + 10, y1 - 20], [250, y1 - 20], [250, y1 + 8], [x + 10, y1 + 8]], true), fill: K.liq }, g);
    var abajo = 8, arriba = 22;
    s('path', { d: camino([[x - abajo, y0], [x - arriba, y1], [x + arriba, y1], [x + abajo, y0]], true), fill: K.liq, stroke: K.navy, 'stroke-width': 2 }, g);
    var gc = s('g', {}, g), c = corriente(gc, 28, 1.9);             // por dentro de las conexiones, el agua va escondida
    s('rect', { x: x - 30, y: y0, width: 60, height: 14, fill: K.pieza, stroke: K.navy, 'stroke-width': 1.2 }, g);
    s('rect', { x: x - 30, y: y1 - 14, width: 60, height: 14, fill: K.pieza, stroke: K.navy, 'stroke-width': 1.2 }, g);
    for (var i = 0; i <= 10; i++) {
      var y = y0 - 10 - i * (y0 - y1 - 20) / 10;
      s('line', { x1: x + 34, y1: y, x2: x + (i % 5 ? 42 : 48), y2: y, stroke: K.navy, 'stroke-width': 1 }, g);
      if (i % 5 === 0) s('text', { x: x + 52, y: y + 4, 'font-size': 11, fill: K.sec }, g, String(i * 10));
    }
    var flot = s('path', { fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1.2 }, g);
    var anchoTubo = function (y) { return abajo + (arriba - abajo) * (y0 - y) / (y0 - y1); };
    rotulo(g, 30, 40, 'tubo cónico\nde vidrio', 'start', [x - 18, 90]);
    rotulo(g, 300, 290, 'escala', 'start', [x + 46, y0 - 30]);
    var rotF = s('g', {}, g), h = 0.5, t = 0;
    function poner(f) {
      h = Math.max(0, Math.min(1, f));
      // el flotador deja un anillo de 4 px con el vidrio; por ahí sube el agua, a los dos lados
      var yf = y0 - 14 - h * (y0 - y1 - 40), rf = anchoTubo(yf) - 4;
      flot.setAttribute('d', camino([[x - rf, yf - 6], [x + rf, yf - 6], [x + rf * 0.5, yf + 10], [x - rf * 0.5, yf + 10]], true));
      c.lineas([[-1, 0.5], [-1, 0], [1, 0], [1, 0.5]].map(function (q) {
        var l = q[0], j = q[1], aro = function (y, w) { return x + l * (w + (anchoTubo(y) - w) * 0.5); };
        var abajoF = yf + 10, arribaF = yf - 6, f = Math.min(6, anchoTubo(yf) / 4);
        return [[0, y0 + 6 + (j - 0.25) * 12 * l], [x - 10, y0 + 6 + (j - 0.25) * 12 * l], [x + l * (2 + j * 2), y0 - 4],
          [aro(abajoF + 14, 0), abajoF + 14], [aro(abajoF, rf * 0.5), abajoF, f], [aro(arribaF, rf), arribaF, f],
          [x + l * (4 + j * 10), y1 + 18], [x + l * (3 + j * 6), y1 - 6 + l * (2 + j * 6)], [400, y1 - 6 + l * (2 + j * 6)]];
      }));
      while (rotF.firstChild) rotF.removeChild(rotF.firstChild);
      rotulo(rotF, 30, 180, 'flotador', 'start', [x - rf * 0.7, yf]);
    }
    poner(0.5);
    return { poner: poner, cuadro: function (dt, v) { t += dt; c.mover(dt, v); poner(Math.min(1, 0.55 * v + 0.012 * Math.sin(t * 9))); } };
  }

  // Turbina: un rotor de álabes gira con el caudal; un captador cuenta los álabes
  function turbina(g) {
    tubo(g, 0, 400);
    bridas(g, 110, CY, 46); bridas(g, 290, CY, 46);
    var gc = s('g', {}, g), c = corriente(gc, 20);
    [150, 250].forEach(function (x) {
      for (var i = -2; i <= 2; i++) s('line', { x1: x - 14, y1: CY + i * 10, x2: x + 14, y2: CY + i * 10, stroke: K.navy, 'stroke-width': 1.4 }, g);
      s('rect', { x: x - 4, y: CY - 5, width: 22, height: 10, fill: K.pieza, stroke: K.navy, 'stroke-width': 1 }, g);
    });
    s('rect', { x: 168, y: CY - 5, width: 64, height: 10, fill: K.pieza, stroke: K.navy, 'stroke-width': 1 }, g);
    var alabes = [];
    for (var i = 0; i < 6; i++) alabes.push(s('path', { fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1 }, g));
    s('ellipse', { cx: 200, cy: CY, rx: 12, ry: 9, fill: K.pieza, stroke: K.navy, 'stroke-width': 1.2 }, g);
    s('rect', { x: 194, y: CY - R - T - 22, width: 12, height: 26, fill: K.campo, stroke: K.navy, 'stroke-width': 1 }, g);
    s('path', { d: 'M200 ' + (CY - R - T - 22) + 'V70', stroke: K.navy, 'stroke-width': 2 }, g);
    s('rect', { x: 172, y: 36, width: 56, height: 34, rx: 4, fill: K.metal, stroke: K.navy, 'stroke-width': 1.6 }, g);
    c.lineas([-0.8, -0.45, 0.45, 0.8].map(function (k) { return [[0, CY + k * R], [400, CY + k * R]]; }));
    rotulo(g, 30, 290, 'enderezador', 'start', [150, CY + 20]);
    rotulo(g, 300, 290, 'rotor', 'start', [204, CY + 22]);
    rotulo(g, 240, 110, 'captador', 'start', [206, CY - R - 16]);
    var ang = 0;
    return {
      poner: function () {},
      cuadro: function (dt, v) {
        c.mover(dt, v);
        ang += v * 520 * dt;
        alabes.forEach(function (al, i) {
          var a = (ang + i * 60) * RAD, alto = (R - 3) * Math.cos(a), ancho = 9 * Math.abs(Math.sin(a)) + 3, lado = Math.sin(a) > 0;
          al.setAttribute('d', camino([[200 - ancho, CY], [200 - ancho + 3, CY - alto], [200 + ancho + 3, CY - alto], [200 + ancho, CY]], true));
          al.setAttribute('opacity', lado ? 1 : 0.55);
        });
      }
    };
  }

  // Ultrasonido de tiempo de tránsito: dos transductores por fuera; el pulso a favor del flujo llega antes
  function ultrasonido(g) {
    tubo(g, 0, 400);
    var A = [150, CY - R - T], B = [250, CY + R + T];
    s('path', { d: camino([[A[0] - 14, A[1] - 22], [A[0] + 14, A[1] - 22], [A[0] + 8, A[1]], [A[0] - 8, A[1]]], true), fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1.2 }, g);
    s('path', { d: camino([[B[0] - 14, B[1] + 22], [B[0] + 14, B[1] + 22], [B[0] + 8, B[1]], [B[0] - 8, B[1]]], true), fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1.2 }, g);
    s('path', { d: 'M' + A[0] + ' ' + (CY - R) + 'L' + B[0] + ' ' + (CY + R), stroke: K.campo, 'stroke-width': 1.4, 'stroke-dasharray': '5 4' }, g);
    s('path', { d: 'M' + A[0] + ' ' + (A[1] - 22) + 'V70H' + (B[0] + 40) + 'V' + (B[1] + 40) + 'H' + B[0] + 'V' + (B[1] + 22), stroke: K.navy, 'stroke-width': 1.4, fill: 'none' }, g);
    s('rect', { x: 176, y: 40, width: 56, height: 34, rx: 4, fill: K.metal, stroke: K.navy, 'stroke-width': 1.6 }, g);
    var gc = s('g', {}, g), c = corriente(gc, 20);
    c.lineas([-0.8, -0.4, 0, 0.4, 0.8].map(function (k) { return [[0, CY + k * R], [400, CY + k * R]]; }));
    var pulsos = [s('circle', { r: 4.5, fill: K.campo }, g), s('circle', { r: 4.5, fill: K.navy }, g)];
    rotulo(g, 30, 110, 'transductor', 'start', [A[0] - 10, A[1] - 12]);
    rotulo(g, 300, 290, 'transductor', 'start', [B[0] + 10, B[1] + 12]);
    rotulo(g, 30, 274, 'trayectoria\ndel sonido', 'start', [178, CY - 12]);
    var t = 0;
    return {
      poner: function () {},
      cuadro: function (dt, v) {
        c.mover(dt, v); t += dt;
        var ida = (t * 0.9) % 1, vuelta = ((t * 0.9) % 1);
        var adel = Math.min(1, ida * (1 + 0.12 * v)), atras = Math.min(1, vuelta * (1 - 0.12 * v));
        pulsos[0].setAttribute('cx', A[0] + (B[0] - A[0]) * adel); pulsos[0].setAttribute('cy', CY - R + 2 * R * adel);
        pulsos[1].setAttribute('cx', B[0] - (B[0] - A[0]) * atras); pulsos[1].setAttribute('cy', CY + R - 2 * R * atras);
      }
    };
  }

  // ════════════════════════════════════════════════════════════════════
  // Válvulas higiénicas
  // ════════════════════════════════════════════════════════════════════

  // Dos líneas en cruz, cada una con su color de puntos: el producto en azul y la limpieza en oliva
  function teñir(gc, color) { gc.querySelectorAll('circle').forEach(function (c) { c.setAttribute('fill', color); }); }

  // De asiento: el producto entra por la cámara de arriba, baja por el asiento y sale por la de abajo. El actuador
  // levanta el tapón contra su resorte; sin aire, el resorte lo cierra. poner(a): 0 cerrada, 1 abierta.
  function asiento(g) {
    var YA = 140, YB = 238;                              // eje de la entrada (arriba) y de la salida (abajo)
    tubo(g, 0, 160, YA); tubo(g, 240, 400, YB);
    s('circle', { cx: 200, cy: YA, r: 48, fill: K.metal, stroke: K.navy, 'stroke-width': 1.6 }, g);
    s('circle', { cx: 200, cy: YB, r: 44, fill: K.metal, stroke: K.navy, 'stroke-width': 1.6 }, g);
    s('rect', { x: 170, y: YA + 30, width: 60, height: YB - YA - 50, fill: K.metal }, g);
    s('circle', { cx: 200, cy: YA, r: 40, fill: K.liq }, g);
    s('circle', { cx: 200, cy: YB, r: 36, fill: K.liq }, g);
    s('rect', { x: 156, y: YA - R, width: 20, height: 2 * R, fill: K.liq }, g);
    s('rect', { x: 226, y: YB - R, width: 20, height: 2 * R, fill: K.liq }, g);
    s('rect', { x: 180, y: YA + 30, width: 40, height: YB - YA - 56, fill: K.liq }, g);
    var gc = s('g', {}, g), c = corriente(gc, 20);
    // asiento: el borde del paso entre las dos cámaras
    [[172, YA + 36], [220, YA + 36]].forEach(function (p) { s('rect', { x: p[0], y: p[1], width: 8, height: 8, fill: K.pieza, stroke: K.navy, 'stroke-width': 0.9 }, g); });
    // linterna y actuador: cilindro con el resorte encima del pistón
    s('path', { d: 'M184 ' + (YA - 47) + 'V' + 74 + 'M216 ' + (YA - 47) + 'V' + 74, stroke: K.navy, 'stroke-width': 3 }, g);
    s('rect', { x: 166, y: 14, width: 68, height: 60, rx: 6, fill: K.metal, stroke: K.navy, 'stroke-width': 1.6 }, g);
    var resorte = s('path', { fill: 'none', stroke: K.navy, 'stroke-width': 1.6 }, g);
    var piston = s('rect', { x: 170, width: 60, height: 6, fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 0.8 }, g);
    var vastago = s('rect', { x: 197, width: 6, fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 0.8 }, g);
    var tapon = s('path', { fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1.4 }, g);
    var sello = s('path', { fill: 'none', stroke: K.goma, 'stroke-width': 4 }, g);
    s('path', { d: 'M234 64h14', stroke: K.navy, 'stroke-width': 2 }, g);
    rotulo(g, 256, 68, 'aire', 'start');
    rotulo(g, 260, 30, 'actuador', 'start', [234, 30]);
    rotulo(g, 10, 104, 'entrada', 'start');
    rotulo(g, 330, 280, 'salida', 'start');
    rotulo(g, 300, 196, 'asiento', 'start', [228, YA + 40]);
    var rotA = s('g', {}, g), a = 1;
    function poner(x) {
      a = Math.max(0, Math.min(1, x));
      var fondo = YA + 36 - a * 24;                     // la cara de abajo del tapón; cerrado, sobre el asiento
      tapon.setAttribute('d', camino([[176, fondo - 12], [224, fondo - 12], [224, fondo - 4], [218, fondo], [182, fondo], [176, fondo - 4]], true));
      sello.setAttribute('d', 'M178 ' + (fondo - 2) + 'L182 ' + fondo + 'M222 ' + (fondo - 2) + 'L218 ' + fondo);
      var yp = 50 - a * 24;                             // el pistón sube con el aire y comprime el resorte
      piston.setAttribute('y', yp);
      vastago.setAttribute('y', yp + 6); vastago.setAttribute('height', fondo - 12 - yp - 6);
      var d = 'M200 18', n = 7, alto = yp - 18;
      for (var k = 1; k <= n; k++) d += 'L' + (k % 2 ? 214 : 186) + ' ' + (18 + alto * (k - 0.5) / n);
      resorte.setAttribute('d', d + 'L200 ' + yp);
      while (rotA.firstChild) rotA.removeChild(rotA.firstChild);
      rotulo(rotA, 10, 30, 'resorte', 'start', [190, 18 + alto * 0.4]);
      rotulo(rotA, 10, 64, 'vástago', 'start', [198, (yp + fondo) / 2 - 8]);
      rotulo(rotA, 300, 150, 'tapón', 'start', [222, fondo - 8]);
      // el producto baja de la cámara de arriba por el anillo que deja el tapón sobre el asiento
      var gap = Math.max(1, YA + 36 - fondo), f = Math.min(5, 14 / gap);
      c.lineas([[YA - 12, 186], [YA, 200], [YA + 12, 214]].map(function (q, i) {
        var lado = i === 2 ? 1 : -1, borde = 200 + lado * 26;
        return [[0, q[0]], [150, q[0]], [borde - lado * 2, fondo + 4, f], [q[1], YA + 46, f], [q[1], YB - 30], [236, YB - 12 + i * 12], [400, YB - 12 + i * 12]];
      }));
    }
    poner(1);
    return { poner: poner, cuadro: function (dt, v) { c.mover(dt, a > 0.001 ? v : 0); } };
  }

  // A prueba de mezcla, de doble asiento: dos líneas que se cruzan (arriba la limpieza, abajo el producto), dos tapones
  // con sus asientos y entre ellos la cámara de fugas, abierta a la atmósfera por el vástago hueco del tapón de abajo.
  // poner(fase), con la fase de 0 a 1 de un ciclo: cerrada, abre, abierta, cierra, cerrada y lava la cámara.
  var FASES = [
    [0.00, 'cerrada: cada línea\ncon lo suyo; la cámara drena'], [0.20, 'abre: el tapón de abajo\nsube y cierra la cámara'],
    [0.27, 'abre: los dos tapones\nsuben juntos'], [0.35, 'abierta: el producto\npasa de abajo arriba'],
    [0.60, 'cierra: los dos\nbajan juntos'], [0.68, 'cierra: la cámara\nse abre al desagüe'],
    [0.72, 'cerrada: cada línea\ncon lo suyo; la cámara drena'], [0.80, 'lava la cámara: el tapón\nde arriba se levanta'],
    [0.90, 'cerrada: cada línea\ncon lo suyo; la cámara drena']
  ];
  function mezcla(g) {
    var YA = 92, YB = 236, BX0 = 180, BX1 = 220;        // ejes de las líneas y el paso entre las dos cámaras
    tubo(g, 0, 146, YA); tubo(g, 254, 400, YA); tubo(g, 0, 146, YB); tubo(g, 254, 400, YB);
    s('rect', { x: 146, y: 56, width: 108, height: 76, rx: 14, fill: K.metal, stroke: K.navy, 'stroke-width': 1.6 }, g);
    s('rect', { x: 146, y: 198, width: 108, height: 76, rx: 14, fill: K.metal, stroke: K.navy, 'stroke-width': 1.6 }, g);
    s('rect', { x: 166, y: 130, width: 68, height: 70, fill: K.metal, stroke: K.navy, 'stroke-width': 1.2 }, g);
    s('rect', { x: 146, y: YA - R, width: 108, height: 2 * R, fill: K.liq }, g);
    s('rect', { x: 156, y: YA + R - 2, width: 88, height: 128 - YA - R + 2, fill: K.liq }, g);
    s('rect', { x: 146, y: YB - R, width: 108, height: 2 * R, fill: K.liq }, g);
    s('rect', { x: 156, y: 204, width: 88, height: YB - R - 204 + 2, fill: K.liq }, g);
    var paso = s('rect', { x: BX0, y: 126, width: BX1 - BX0, height: 80, fill: K.liq }, g);
    var camara = s('rect', { x: BX0, width: BX1 - BX0, fill: K.aire }, g);
    var gLimp = s('g', {}, g), cLimp = corriente(gLimp, 16); teñir(gLimp, K.campo);
    var gProd = s('g', {}, g), cProd = corriente(gProd, 16);
    var gCruce = s('g', {}, g), cCruce = corriente(gCruce, 16);
    var gDren = s('g', {}, g), cDren = corriente(gDren, 8, 2.2); teñir(gDren, K.campo);
    // asientos
    [[172, 134], [220, 134], [172, 186], [220, 186]].forEach(function (p) { s('rect', { x: p[0], y: p[1], width: 8, height: 8, fill: K.pieza, stroke: K.navy, 'stroke-width': 0.9 }, g); });
    // actuador y vástago de arriba
    s('rect', { x: 170, y: 6, width: 60, height: 38, rx: 6, fill: K.metal, stroke: K.navy, 'stroke-width': 1.6 }, g);
    var vArriba = s('rect', { x: 197, width: 6, fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 0.8 }, g);
    var tArriba = s('rect', { x: BX0 + 1, width: BX1 - BX0 - 2, height: 14, rx: 2, fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1.4 }, g);
    var sArriba = s('path', { fill: 'none', stroke: K.goma, 'stroke-width': 4 }, g);
    var tAbajo = s('rect', { x: BX0 + 1, width: BX1 - BX0 - 2, height: 14, rx: 2, fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1.4 }, g);
    var sAbajo = s('path', { fill: 'none', stroke: K.goma, 'stroke-width': 4 }, g);
    var hueco = s('rect', { x: 193, width: 14, height: 400, fill: K.pieza, stroke: K.navy, 'stroke-width': 1 }, g);
    var canal = s('rect', { x: 197, width: 6, height: 400, fill: K.aire }, g);
    s('rect', { x: 186, y: 274, width: 28, height: 10, fill: K.pieza, stroke: K.navy, 'stroke-width': 1 }, g);
    rotulo(g, 258, 26, 'actuador', 'start', [230, 26]);
    rotulo(g, 12, 54, 'limpieza', 'start', [40, YA - 14]);
    rotulo(g, 300, 196, 'producto', 'start', [330, YB - 14]);
    rotulo(g, 230, 296, 'al desagüe', 'start', [205, 292]);
    var estado = [s('text', { x: 12, y: 280, fill: K.sec, 'font-size': 11.5 }, g), s('text', { x: 12, y: 294, fill: K.sec, 'font-size': 11.5 }, g)];
    var rotM = s('g', {}, g), fase = 0, abierta = false, lavando = false;
    function poner(x) {
      fase = ((x % 1) + 1) % 1;
      var ua = 0, ub = 0, e = 0;                         // subida de cada tapón, en px
      var tramo = function (a, b) { return Math.max(0, Math.min(1, (fase - a) / (b - a))); };
      if (fase < 0.20) { ua = 0; ub = 0; }
      else if (fase < 0.27) { ub = 44 * tramo(0.20, 0.27); }
      else if (fase < 0.35) { var t = tramo(0.27, 0.35); ua = 40 * t; ub = 44 + 40 * t; }
      else if (fase < 0.60) { ua = 40; ub = 84; }
      else if (fase < 0.68) { var t2 = tramo(0.60, 0.68); ua = 40 * (1 - t2); ub = 44 + 40 * (1 - t2); }
      else if (fase < 0.72) { ub = 44 * (1 - tramo(0.68, 0.72)); }
      else if (fase >= 0.80 && fase < 0.90) { ua = 10 * Math.sin(Math.PI * tramo(0.80, 0.90)); }
      abierta = fase >= 0.30 && fase < 0.64;
      lavando = fase >= 0.81 && fase < 0.89;
      for (var i = FASES.length - 1; i >= 0; i--) if (fase >= FASES[i][0]) { e = i; break; }
      FASES[e][1].split('\n').forEach(function (l, i) { estado[i].textContent = l; });
      var ya = 128 - ua, yb = 186 - ub;                  // cara de arriba de cada tapón
      tArriba.setAttribute('y', ya); tAbajo.setAttribute('y', yb);
      sArriba.setAttribute('d', 'M' + (BX0 + 1) + ' ' + (ya + 12) + 'V' + (ya + 4) + 'M' + (BX1 - 1) + ' ' + (ya + 12) + 'V' + (ya + 4));
      sAbajo.setAttribute('d', 'M' + (BX0 + 1) + ' ' + (yb + 2) + 'V' + (yb + 10) + 'M' + (BX1 - 1) + ' ' + (yb + 2) + 'V' + (yb + 10));
      vArriba.setAttribute('y', 40); vArriba.setAttribute('height', ya - 40);
      hueco.setAttribute('y', yb + 14); canal.setAttribute('y', yb + 4);
      var c0 = ya + 14, c1 = yb;
      camara.setAttribute('y', c0); camara.setAttribute('height', Math.max(0, c1 - c0));
      paso.setAttribute('y', Math.min(126, ya)); paso.setAttribute('height', 206 - Math.min(126, ya));
      while (rotM.firstChild) rotM.removeChild(rotM.firstChild);
      rotulo(rotM, 300, 120, 'tapón de arriba', 'start', [BX1 - 2, ya + 7]);
      rotulo(rotM, 300, 170, 'tapón de abajo', 'start', [BX1 - 2, yb + 7]);
      if (c1 - c0 > 6) rotulo(rotM, 12, 166, 'cámara de fugas', 'start', [BX0 + 4, (c0 + c1) / 2]);
      cLimp.lineas([YA - 12, YA, YA + 12].map(function (y) { return [[0, y], [400, y]]; }));
      cProd.lineas([YB - 12, YB, YB + 12].map(function (y) { return [[0, y], [400, y]]; }));
      cCruce.lineas([[BX0 + 5, YB - 12], [BX0 + 10, YB], [BX1 - 6, YB + 12]].map(function (q, i) {
        return [[0, q[1]], [140, q[1]], [q[0], 200, 1.6], [q[0], 130, 1.6], [q[0] + (i === 2 ? 18 : 30), YA + 6], [260, YA - 12 + i * 12], [400, YA - 12 + i * 12]];
      }));
      cDren.lineas([[[BX0 + 6, YA + 20], [BX0 + 6, ya + 18, 3], [198, c1 - 4], [200, 296]], [[BX1 - 6, YA + 20], [BX1 - 6, ya + 18, 3], [202, c1 - 4], [200, 296]]]);
    }
    poner(0);
    return {
      poner: poner,
      cuadro: function (dt, v) {
        gLimp.setAttribute('opacity', abierta ? 0 : 1); gProd.setAttribute('opacity', abierta ? 0 : 1);
        gCruce.setAttribute('opacity', abierta ? 1 : 0); gDren.setAttribute('opacity', lavando ? 1 : 0);
        cLimp.mover(dt, abierta ? 0 : v); cProd.mover(dt, abierta ? 0 : v);
        cCruce.mover(dt, abierta ? v : 0); cDren.mover(dt, lavando ? 0.6 * v : 0);
      }
    };
  }

  // ════════════════════════════════════════════════════════════════════
  // Tanques de almacenamiento
  // ════════════════════════════════════════════════════════════════════

  // Un tanque vertical en corte con el nivel que sube y baja. poner(f) fija la fracción llena (0 a 1) y cuadro(dt, v)
  // mueve el aire por el venteo con v > 0 al llenarse (sale) y v < 0 al vaciarse (entra). tipo: 'cono', 'domo',
  // 'ext' (techo flotante externo) o 'int' (techo flotante interno, bajo un techo de cono).
  function tanqueTipo(g, tipo) {
    var X0 = 92, X1 = 308, YF = 268, YT = 86, e = 6;              // pared por dentro, fondo y borde de arriba
    var flota = tipo === 'ext' || tipo === 'int';
    s('rect', { x: 64, y: YF + e, width: 272, height: 10, fill: K.pieza, stroke: K.navy, 'stroke-width': 1 }, g);
    var liq = s('rect', { x: X0, width: X1 - X0, fill: K.liqHondo }, g);   // el tanque, sin paredes ni gotas que lo marquen: el tono hondo
    var vapor = s('g', {}, g), gotas = [];
    if (!flota) for (var i = 0; i < 14; i++) gotas.push(s('circle', { r: 2, fill: K.campo, opacity: 0.55 }, vapor));
    // pared, fondo y techo
    s('rect', { x: X0 - e, y: YT, width: e, height: YF - YT + e, fill: K.metal, stroke: K.navy, 'stroke-width': 1.2 }, g);
    s('rect', { x: X1, y: YT, width: e, height: YF - YT + e, fill: K.metal, stroke: K.navy, 'stroke-width': 1.2 }, g);
    s('rect', { x: X0 - e, y: YF, width: X1 - X0 + 2 * e, height: e, fill: K.metal, stroke: K.navy, 'stroke-width': 1.2 }, g);
    var cima = YT;
    if (tipo === 'cono' || tipo === 'int') {
      cima = YT - 24;
      s('path', { d: 'M' + (X0 - e - 4) + ' ' + YT + 'L200 ' + cima + 'L' + (X1 + e + 4) + ' ' + YT, fill: 'none', stroke: K.navy, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    } else if (tipo === 'domo') {
      cima = YT - 30;
      s('path', { d: 'M' + (X0 - e - 2) + ' ' + YT + 'Q200 ' + (YT - 60) + ' ' + (X1 + e + 2) + ' ' + YT, fill: 'none', stroke: K.navy, 'stroke-width': 4 }, g);
    } else {
      // techo flotante externo: anillo de viento por fuera, cerca del borde de arriba, y la plataforma
      [[X0 - e - 16, 16], [X1 + e, 16]].forEach(function (a) { s('rect', { x: a[0], y: YT + 10, width: a[1], height: 5, fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 0.8 }, g); });
      s('rect', { x: X1 + e, y: YT - 6, width: 22, height: 4, fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 0.8 }, g);
    }
    // venteo del techo fijo: un cuello de ganso en la cima
    var boca = null;
    if (tipo !== 'ext') {
      s('path', { d: 'M200 ' + (cima + 1) + 'V' + (cima - 18) + 'H214V' + (cima - 8), fill: 'none', stroke: K.navy, 'stroke-width': 4 }, g);
      boca = [214, cima - 6];
      if (tipo === 'int') [[X0 + 4, YT - 2], [X1 - 14, YT - 2]].forEach(function (a) { s('rect', { x: a[0], y: a[1], width: 10, height: 5, fill: K.aire, stroke: K.navy, 'stroke-width': 1 }, g); });
    }
    var aire = s('g', {}, g), puntos = [], u = [];
    if (boca) for (var j = 0; j < 7; j++) { puntos.push(s('circle', { r: 2.4, fill: K.liqOsc, opacity: 0.8 }, aire)); u.push(j / 7); }
    // la cubierta flotante con su sello, sus pontones y sus patas
    var cubierta = null, patas = null, escalera = null;
    if (flota) {
      cubierta = s('g', {}, g);
      s('rect', { x: X0 + 3, y: -6, width: X1 - X0 - 6, height: tipo === 'ext' ? 10 : 5, fill: tipo === 'ext' ? K.metal : K.pieza, stroke: K.navy, 'stroke-width': 1.2 }, cubierta);
      if (tipo === 'ext') [[X0 + 3, 26], [X1 - 29, 26]].forEach(function (a) { s('rect', { x: a[0], y: -6, width: a[1], height: 10, fill: K.piezaOsc, stroke: K.navy, 'stroke-width': 1 }, cubierta); });
      [X0, X1 - 4].forEach(function (x) { s('rect', { x: x, y: -10, width: 4, height: 14, fill: K.goma }, cubierta); });
      patas = s('g', {}, cubierta);
      [X0 + 40, 200, X1 - 40].forEach(function (x) { s('rect', { x: x - 1.5, y: 4, width: 3, height: 26, fill: K.piezaOsc }, patas); });
      if (tipo === 'ext') escalera = s('g', {}, g);
    }
    var nivelY = YF, f = 0.5;
    var rot = s('g', {}, g);
    function poner(x) {
      f = Math.max(0, Math.min(1, x));
      var minimo = flota ? 0.12 : 0.04;
      nivelY = YF - (YF - YT - 12) * (minimo + (0.92 - minimo) * f);
      liq.setAttribute('y', nivelY); liq.setAttribute('height', YF - nivelY);
      if (cubierta) cubierta.setAttribute('transform', 'translate(0 ' + nivelY + ')');
      if (escalera) {
        while (escalera.firstChild) escalera.removeChild(escalera.firstChild);
        var a = [X1 + e + 18, YT - 4], b = [236, nivelY - 6], n = 7;
        s('path', { d: 'M' + a[0] + ' ' + a[1] + 'L' + b[0] + ' ' + b[1], stroke: K.navy, 'stroke-width': 2 }, escalera);
        for (var k = 1; k < n; k++) { var t = k / n, px = a[0] + (b[0] - a[0]) * t, py = a[1] + (b[1] - a[1]) * t; s('path', { d: 'M' + (px - 4) + ' ' + (py + 3) + 'l8 -6', stroke: K.navy, 'stroke-width': 1.2 }, escalera); }
        s('circle', { cx: b[0], cy: b[1], r: 3, fill: K.navy }, escalera);
      }
      // el vapor sobre el líquido, en el espacio que queda bajo el techo fijo
      var techoY = tipo === 'int' ? YT : cima + 10;
      gotas.forEach(function (c, i) {
        var arriba = tipo === 'int' ? YT + 4 : techoY + 8, abajo = (tipo === 'int' ? nivelY - 10 : nivelY - 6);
        var yy = arriba + ((i * 37) % 100) / 100 * Math.max(4, abajo - arriba);
        c.setAttribute('cx', X0 + 12 + ((i * 53) % 100) / 100 * (X1 - X0 - 24)); c.setAttribute('cy', yy);
        c.setAttribute('opacity', abajo - arriba > 8 ? 0.5 : 0);
      });
      while (rot.firstChild) rot.removeChild(rot.firstChild);
      if (tipo === 'cono') { rotulo(rot, 300, 30, 'techo de cono', 'start', [262, YT - 10]); rotulo(rot, 20, 44, 'respiradero', 'start', [200, cima - 14]); rotulo(rot, 20, 120, 'espacio\nde vapor', 'start', [120, (cima + 20 + nivelY) / 2]); }
      if (tipo === 'domo') { rotulo(rot, 300, 30, 'techo de domo', 'start', [262, YT - 18]); rotulo(rot, 20, 44, 'respiradero', 'start', [200, cima - 14]); rotulo(rot, 20, 120, 'espacio\nde vapor', 'start', [120, (cima + 24 + nivelY) / 2]); }
      if (tipo === 'ext') { rotulo(rot, 16, 44, 'anillo de viento', 'start', [X0 - e - 8, YT + 12]); rotulo(rot, 300, 290, 'pontón', 'start', [X1 - 16, nivelY - 1]); rotulo(rot, 16, 290, 'sello', 'start', [X0 + 2, nivelY - 3]); rotulo(rot, 300, 30, 'escalera\nrodante', 'start', [X1 + e + 4, YT + 4]); rotulo(rot, 120, 20, 'techo flotante', 'start', [160, nivelY - 2]); }
      if (tipo === 'int') { rotulo(rot, 300, 30, 'techo de cono', 'start', [262, YT - 10]); rotulo(rot, 20, 44, 'respiradero', 'start', [200, cima - 14]); rotulo(rot, 20, 104, 'ventila\nde la pared', 'start', [X0 + 9, YT]); rotulo(rot, 300, 186, 'cubierta\nflotante', 'start', [X1 - 30, nivelY - 2]); rotulo(rot, 16, 290, 'sello', 'start', [X0 + 2, nivelY - 3]); }
      if (patas) rotulo(rot, 300, 250, 'patas', 'start', [X1 - 40, nivelY + 22]);
    }
    poner(0.5);
    return {
      poner: poner,
      cuadro: function (dt, v) {
        if (!boca) return;
        // el aire va del espacio de arriba a la boca del venteo y sale (o al revés, al vaciarse)
        var camino0 = [[200, cima + 12], [200, cima - 18], [214, cima - 18], [214, cima], [214, cima + 22]];
        aire.setAttribute('opacity', Math.min(1, Math.abs(v) * 1.6));
        puntos.forEach(function (c, i) {
          u[i] = (u[i] + v * dt * 0.45 + 1) % 1;
          var L = [0], k2;
          for (k2 = 1; k2 < camino0.length; k2++) L.push(L[k2 - 1] + Math.hypot(camino0[k2][0] - camino0[k2 - 1][0], camino0[k2][1] - camino0[k2 - 1][1]));
          var d = u[i] * L[L.length - 1];
          for (k2 = 1; k2 < camino0.length; k2++) if (L[k2] >= d) { var q = (d - L[k2 - 1]) / (L[k2] - L[k2 - 1]); c.setAttribute('cx', camino0[k2 - 1][0] + (camino0[k2][0] - camino0[k2 - 1][0]) * q); c.setAttribute('cy', camino0[k2 - 1][1] + (camino0[k2][1] - camino0[k2 - 1][1]) * q); break; }
        });
      }
    };
  }

  var DIBUJOS = {
    'v-compuerta': compuerta, 'v-globo': globo, 'v-diafragma': diafragma, 'v-bola': bola, 'v-mariposa': mariposa, 'v-retencion': retencion,
    't-cono': function (g) { return tanqueTipo(g, 'cono'); }, 't-domo': function (g) { return tanqueTipo(g, 'domo'); },
    't-ext': function (g) { return tanqueTipo(g, 'ext'); }, 't-int': function (g) { return tanqueTipo(g, 'int'); },
    'v-asiento': asiento, 'v-mariposa-hig': function (g) { return mariposa(g, true); }, 'v-mezcla': mezcla,
    'm-placa': placa, 'm-tobera': tobera, 'm-venturi': venturi, 'm-magnetico': magnetico, 'm-vortice': vortice, 'm-coriolis': coriolis,
    'm-rotametro': rotametro, 'm-turbina': turbina, 'm-ultrasonido': ultrasonido
  };
  // Cómo se mueve cada uno en su pestaña: la apertura va y viene sola
  function ciclo(nombre, t) {
    var c = 0.5 - 0.5 * Math.cos(2 * Math.PI * t / 10);             // 0 → 1 → 0 en diez segundos
    if (nombre === 'v-mezcla') return { x: (t / 16) % 1, v: 1 };
    if (nombre.indexOf('t-') === 0) return { x: 0.5 - 0.42 * Math.cos(2 * Math.PI * t / 12), v: Math.sin(2 * Math.PI * t / 12) };
    if (nombre === 'v-bola' || nombre.indexOf('v-mariposa') === 0) return { x: 90 * c, v: Math.max(0, Math.cos(c * Math.PI / 2)) };
    if (nombre === 'v-retencion') { var on = Math.sin(2 * Math.PI * t / 10) > -0.4; return { x: on ? 1 : 0, v: on ? 1 : 0 }; }
    if (nombre.indexOf('v-') === 0) return { x: 1 - 0.92 * c, v: 1 - 0.92 * c };
    if (nombre === 'm-placa' || nombre === 'm-venturi' || nombre === 'm-tobera') return { x: nombre === 'm-placa' ? 0.68 : 0.55, v: 1 };
    return { x: 0.5, v: 1 };
  }

  var quieto = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var activos = [];
  function montar(el) {
    var nombre = el.getAttribute('data-esquema'), fn = DIBUJOS[nombre];
    if (!fn || el.dataset.listo) return;
    el.dataset.listo = '1';
    var svg = s('svg', { viewBox: '0 0 400 300', preserveAspectRatio: 'xMidYMid meet', 'aria-hidden': 'true', style: 'font-family:inherit' }, el);
    var d = fn(s('g', {}, svg));
    var e = { el: el, d: d, nombre: nombre, pausa: quieto, visible: false, t: 0 };
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'pausa';
    var marcar = function () { b.textContent = e.pausa ? 'Mover' : 'Detener'; b.setAttribute('aria-pressed', String(e.pausa)); };
    b.addEventListener('click', function () { e.pausa = !e.pausa; marcar(); });
    marcar(); el.appendChild(b);
    var c0 = ciclo(nombre, 0); d.poner(c0.x); d.cuadro(0.4, c0.v);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { e.visible = es[0].isIntersecting; }).observe(el);
    else e.visible = true;
    activos.push(e);
  }
  var antes = null;
  function bucle(t) {
    var dt = antes == null ? 0 : Math.min(0.05, (t - antes) / 1000); antes = t;
    activos.forEach(function (e) {
      if (e.pausa || !e.visible || e.el.offsetParent === null) return;
      e.t += dt;
      var c = ciclo(e.nombre, e.t);
      e.d.poner(c.x); e.d.cuadro(dt, c.v);
    });
    requestAnimationFrame(bucle);
  }
  function iniciar() {
    document.querySelectorAll('.esquema[data-esquema]').forEach(montar);
    requestAnimationFrame(bucle);
  }
  window.Cortes = { dibujos: DIBUJOS, K: K, CY: CY, R: R };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
