/* Las dos animaciones por pasos del ciclo de compresión de vapor del capítulo 26, «Refrigeración y congelación», del
   libro, con el enfriador de la winterización del ejemplo 26.2, para la presentación de refrigeración de 2027-10:
   el ciclo en el diagrama presión-entalpía del propano y el COP contra las dos temperaturas. Son copia del bloque
   final de libro/figuras/refrigeracion-y-congelacion/actividades.js del repositorio del libro, con las tablas del
   propano adentro y las remisiones a las ecuaciones llevadas a libro.luishreyes.com (LIBRO). No se editan aquí;
   cuando cambian en el libro se vuelven a copiar. Corren con el motor de /classroom/estilo-libro/actividades/. */

(function () {
  'use strict';
  if (!window.ZB || !ZB.dib || !window.PALETA) return;
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, TR = ZB.tramo;
  var GR = window.PALETA.graficas;
  var AZ = K.serie[0], NA = K.serie[2], REF = K.ref, TXT = GR.texto, TXT2 = GR['texto-2'], AMA = K.amarillo;
  // Las remisiones al capítulo: en el libro, a la misma página; en el aula, a libro.luishreyes.com.
  var LIBRO = 'https://libro.luishreyes.com/refrigeracion-y-congelacion.html';
  function ref(id, t) { return '<a href="' + LIBRO + '#' + id + '"' + (LIBRO ? ' target="_blank" rel="noopener"' : '') + '>' + t + '</a>'; }

  /* El propano de CoolProp 8.0.0, con la ecuación de Lemmon y la referencia del IIR, la misma del ejemplo 26.2
     (uv run --with CoolProp==8.0.0): Ĥ1 = 579,5, Ĥ2s = 630,3 y Ĥ3 = 287,2 kJ/kg a 406,0 y 1160,8 kPa. */
  var PR = {
    // la campana: [T (°C), p (kPa), Ĥ del líquido saturado, Ĥ del vapor saturado (kJ/kg)], de −45 °C al punto crítico
    sat: [[-45,89,93.9,522.5],[-42.5,99.6,99.5,525.5],[-40,111.1,105.1,528.5],[-37.5,123.6,110.8,531.5],[-35,137.2,116.5,534.5],[-32.5,151.9,122.2,537.4],[-30,167.8,128,540.4],[-27.5,185,133.8,543.3],[-25,203.4,139.6,546.3],[-22.5,223.2,145.5,549.2],[-20,244.5,151.4,552.1],[-17.5,267.3,157.3,555],[-15,291.6,163.3,557.9],[-12.5,317.6,169.3,560.8],[-10,345.3,175.3,563.6],[-7.5,374.7,181.4,566.5],[-5,406,187.6,569.3],[-2.5,439.2,193.8,572.1],[0,474.5,200,574.9],[2.5,511.7,206.3,577.6],[5,551.1,212.6,580.3],[7.5,592.7,219,583],[10,636.6,225.4,585.7],[12.5,682.8,231.9,588.3],[15,731.5,238.4,590.9],[17.5,782.7,245,593.4],[20,836.5,251.6,596],[22.5,892.9,258.3,598.4],[25,952.1,265.1,600.8],[27.5,1014.1,271.9,603.2],[30,1079,278.8,605.5],[32.5,1146.9,285.8,607.8],[35,1217.9,292.8,610],[37.5,1292,299.9,612.1],[40,1369.4,307.1,614.2],[42.5,1450.2,314.4,616.2],[45,1534.3,321.8,618.1],[47.5,1622,329.2,619.9],[50,1713.3,336.8,621.7],[52.5,1808.3,344.5,623.3],[55,1907.2,352.2,624.8],[57.5,2009.9,360.1,626.1],[60,2116.8,368.1,627.4],[62.5,2227.7,376.3,628.4],[65,2342.9,384.6,629.3],[67.5,2462.6,393.1,630],[70,2586.8,401.8,630.4],[72.5,2715.6,410.6,630.5],[75,2849.3,419.8,630.3],[77.5,2988,429.2,629.8],[80,3131.9,438.9,628.7],[82.5,3281.2,449.1,627.1],[85,3436.1,459.8,624.8],[86,3499.7,464.3,623.5],[87,3564.3,468.9,622.1],[88,3629.9,473.6,620.5],[89,3696.5,478.6,618.7],[90,3764.1,483.7,616.5],[91,3832.8,489.1,613.9],[92,3902.7,494.9,610.8],[93,3973.7,501.2,607.1],[94,4045.9,508.1,602.3],[95,4119.5,516.3,595.8],[96,4194.5,527.4,585.4]],
    crit: [555.2, 4251.2],
    // de 1 a la presión de condensación: la isentrópica [p, Ĥ] y la compresión real, Ĥ1 + (Ĥ2s − Ĥ1)/η a cada presión
    isen: [[406,579.5],[433.6,582.6],[463,585.7],[494.4,588.8],[528,592],[563.8,595.1],[602.1,598.3],[642.9,601.4],[686.5,604.6],[733.1,607.8],[782.9,611],[836,614.2],[892.7,617.4],[953.3,620.6],[1018,623.8],[1087.1,627],[1160.8,630.3]],
    real: [[406,579.5],[433.6,583.6],[463,587.8],[494.4,591.9],[528,596.1],[563.8,600.3],[602.1,604.5],[642.9,608.7],[686.5,613],[733.1,617.2],[782.9,621.5],[836,625.8],[892.7,630],[953.3,634.3],[1018,638.6],[1087.1,642.9],[1160.8,647.2]],
    // el ciclo del ejemplo: −5 y 33 °C, 6 K de sobrecalentamiento, η = 0,75
    c: { pe: 406.0, pc: 1160.8, h1: 579.5, h2s: 630.3, h2: 647.2, h3: 287.2, hge: 569.3, hgc: 608.2, T2: 51.6 },
    // el COP real y el de Carnot contra la condensación, con la evaporación a −5 °C: [T (°C), COP, COP de Carnot]
    vsTc: [[20,7.0839,10.726],[21,6.7758,10.3135],[22,6.4901,9.9315],[23,6.2244,9.5768],[24,5.9766,9.2466],[25,5.745,8.9383],[26,5.5279,8.65],[27,5.3239,8.3797],[28,5.132,8.1258],[29,4.9509,7.8868],[30,4.7798,7.6614],[31,4.6179,7.4486],[32,4.4643,7.2473],[33,4.3185,7.0566],[34,4.1798,6.8756],[35,4.0477,6.7037],[36,3.9217,6.5402],[37,3.8013,6.3845],[38,3.6862,6.236],[39,3.5759,6.0943],[40,3.4702,5.9589],[41,3.3688,5.8293],[42,3.2714,5.7053],[43,3.1776,5.5865],[44,3.0874,5.4724],[45,3.0004,5.363],[46,2.9165,5.2578],[47,2.8355,5.1567],[48,2.7572,5.0594],[49,2.6815,4.9657],[50,2.6082,4.8755]],
    // y contra la evaporación, con la condensación a 33 °C
    vsTe: [[-25,2.3867,4.2784],[-24,2.4504,4.3711],[-23,2.5165,4.467],[-22,2.585,4.5664],[-21,2.6562,4.6694],[-20,2.7301,4.7764],[-19,2.8069,4.8875],[-18,2.8869,5.0029],[-17,2.9701,5.123],[-16,3.0568,5.248],[-15,3.1471,5.3781],[-14,3.2415,5.5138],[-13,3.34,5.6554],[-12,3.4429,5.8033],[-11,3.5507,5.958],[-10,3.6636,6.1198],[-9,3.7819,6.2893],[-8,3.9061,6.4671],[-7,4.0366,6.6537],[-6,4.1739,6.85],[-5,4.3185,7.0566],[-4,4.4711,7.2743],[-3,4.6322,7.5042],[-2,4.8027,7.7471],[-1,4.9833,8.0044],[0,5.175,8.2773],[1,5.3788,8.5672],[2,5.5958,8.8758],[3,5.8275,9.205],[4,6.0753,9.5569],[5,6.3409,9.9339]]
  };

  /* ---------- Piezas ---------- */
  function grupo(padre, op) { return s('g', { opacity: op == null ? 0 : op }, padre); }
  function ver(el, t) { D.ver(el, t); }
  function txt(padre, x, y, str, o) { o = o || {}; return D.t(padre, x, y, str, { tam: o.tam || 13, peso: o.peso, ancla: o.ancla, color: o.color || TXT2, halo: o.halo }); }
  function dTrazo(pts) { return pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(''); }
  function fila(tabla, T) { for (var i = 0; i < tabla.length; i++) if (tabla[i][0] === T) return tabla[i]; return null; }
  function m(x, d) { return n(x, d).replace(/ /g, ''); }   // un número dentro de $…$ (ZB.tex pone la coma)

  // Los números del ejemplo, redondeados como en el texto, y las cuentas con ellos.
  var C = PR.c, Q = 1.314, ETA = 0.75;
  var h1 = Math.round(C.h1 * 10) / 10, h2s = Math.round(C.h2s * 10) / 10, h3 = Math.round(C.h3 * 10) / 10;
  var h2 = h1 + (h2s - h1) / ETA, qe = h1 - h3, mm = Q / qe, P = mm * (h2s - h1) / ETA, COP = Q / P;
  var CAR = (273.15 - 5) / (33 + 5), QC = Q + P;

  /* ======================= El ciclo en el diagrama presión-entalpía ======================= */

  /* A la izquierda, el diagrama presión-entalpía del propano con la presión en escala logarítmica; a la derecha, los
     cuatro equipos del enfriador, que se marcan a medida que el ciclo pasa por ellos, y las entalpías y las cuentas.
     Los colores son los de la figura del ciclo del capítulo: el ciclo estándar en azul, la compresión real en naranja
     a trazos, los estados en amarillo y la campana en gris. */
  var X0 = 72, X1 = 470, H0 = 50, H1 = 700, Y0 = 34, Y1 = 372, PMIN = 100, PMAX = 5000;
  function X(h) { return X0 + (h - H0) / (H1 - H0) * (X1 - X0); }
  function Y(p) { return Y1 - Math.log(p / PMIN) / Math.log(PMAX / PMIN) * (Y1 - Y0); }

  ZB.animacion('ciclo-ph', {
    vista: [0, 0, 720, 440],
    alt: 'A la izquierda, el diagrama presión-entalpía del propano, con la entalpía de 50 a 700 kJ/kg y la presión de 100 a 5000 kPa en escala logarítmica, y la campana de saturación: el líquido a la izquierda, la mezcla de líquido y vapor adentro y el vapor a la derecha. Encima se dibuja, paso a paso, el ciclo del enfriador de la winterización: el evaporador, una horizontal a 406,0 kPa y −5 °C, de 287,2 a 579,5 kJ/kg, con 6 K de sobrecalentamiento al final; la compresión isentrópica, hasta 1160,8 kPa con 630,3 kJ/kg, y la real, con una eficiencia de 0,75, hasta 647,2 kJ/kg y 52 °C; el condensador, una horizontal a 33 °C hasta el líquido saturado con 287,2 kJ/kg, y la válvula, una vertical a entalpía constante. A la derecha, los cuatro equipos del enfriador con sus estados, que se marcan cuando el ciclo pasa por ellos, y una tabla con las entalpías, el efecto refrigerante de 292,3 kJ/kg, el caudal de 16,2 kg/h, la potencia de 0,304 kW y el COP de 4,32, frente a 7,06 del de Carnot.',
    montar: function (svg) {
      var S = {};
      /* -- los ejes, con la presión en escala logarítmica -- */
      S.ejes = grupo(svg, 1);
      [100, 200, 300, 400, 500, 1000, 2000, 3000, 4000, 5000].forEach(function (p) {
        s('line', { x1: X0, x2: X1, y1: Y(p), y2: Y(p), stroke: K.rejilla, 'stroke-width': 1 }, S.ejes);
      });
      [100, 200, 500, 1000, 2000, 5000].forEach(function (p) { txt(S.ejes, X0 - 6, Y(p) + 4, n(p, 0), { tam: 12, ancla: 'end' }); });
      for (var h = 100; h <= 700; h += 100) {
        s('line', { x1: X(h), x2: X(h), y1: Y0, y2: Y1, stroke: K.rejilla, 'stroke-width': 1 }, S.ejes);
        txt(S.ejes, X(h), Y1 + 16, n(h, 0), { tam: 12, ancla: 'middle' });
      }
      s('path', { d: 'M' + X0 + ' ' + Y0 + 'V' + Y1 + 'H' + X1, fill: 'none', stroke: TXT2, 'stroke-width': 1.2 }, S.ejes);
      txt(S.ejes, X0 - 2, Y0 - 12, 'presión, kPa (escala logarítmica)', { tam: 13, peso: 600, color: TXT });
      txt(S.ejes, X1, Y1 + 34, 'entalpía, kJ/kg', { tam: 13, peso: 600, ancla: 'end', color: TXT });
      /* -- la campana -- */
      var liq = [], vap = [];
      PR.sat.forEach(function (r) { if (r[1] >= PMIN) { liq.push([X(r[2]), Y(r[1])]); vap.push([X(r[3]), Y(r[1])]); } });
      var cr = [X(PR.crit[0]), Y(PR.crit[1])];
      s('path', { d: dTrazo(liq.concat([cr]).concat(vap.slice().reverse())), fill: 'none', stroke: TXT2, 'stroke-width': 1.8 }, S.ejes);
      txt(S.ejes, X(95), Y(1500), 'líquido', { tam: 13, ancla: 'start' });
      txt(S.ejes, X(330), Y(150), 'líquido y vapor', { tam: 13, ancla: 'middle' });
      txt(S.ejes, X(695), Y(300), 'vapor', { tam: 13, ancla: 'end' });
      /* -- los dos niveles de presión -- */
      S.niveles = grupo(svg);
      [C.pe, C.pc].forEach(function (p) { s('line', { x1: X0, x2: X1, y1: Y(p), y2: Y(p), stroke: REF, 'stroke-width': 1.4, 'stroke-dasharray': '6 5' }, S.niveles); });
      var xm = (X(C.h3) + X(C.h1)) / 2;
      txt(S.niveles, xm, Y(C.pc) + 19, '33 °C, ' + n(C.pc, 1) + ' kPa', { tam: 13, peso: 650, ancla: 'middle', color: TXT, halo: K.blanco });
      txt(S.niveles, xm, Y(C.pe) - 9, '−5 °C, ' + n(C.pe, 1) + ' kPa', { tam: 13, peso: 650, ancla: 'middle', color: TXT, halo: K.blanco });
      /* -- el ciclo -- */
      var pe = Y(C.pe), pc = Y(C.pc);
      S.evap = D.trazo(svg, dTrazo([[X(h3), pe], [X(h1), pe]]), { color: AZ, ancho: 2.8 });
      S.isen = D.trazo(svg, dTrazo(PR.isen.map(function (q) { return [X(q[1]), Y(q[0])]; })), { color: AZ, ancho: 2.8 });
      S.real = s('path', { d: dTrazo(PR.real.map(function (q) { return [X(q[1]), Y(q[0])]; })), fill: 'none', stroke: NA, 'stroke-width': 2.6, 'stroke-dasharray': '7 5', opacity: 0 }, svg);
      S.cond = D.trazo(svg, dTrazo([[X(h2), pc], [X(h3), pc]]), { color: AZ, ancho: 2.8 });
      S.valv = D.trazo(svg, dTrazo([[X(h3), pc], [X(h3), pe]]), { color: AZ, ancho: 2.8 });
      // los puntos y sus nombres
      function estado(x, y, nombre, dx, dy, ancla) {
        var g = grupo(svg);
        D.punto(g, x, y, { r: 6, color: AMA });
        txt(g, x + dx, y + dy, nombre, { tam: 14, peso: 700, ancla: ancla || 'middle', color: TXT, halo: K.blanco });
        return g;
      }
      S.e4 = estado(X(h3), pe, '4', -12, 18);
      S.e1 = estado(X(h1), pe, '1', 12, 18);
      S.e2s = estado(X(h2s), pc, '2s', -10, -12);
      S.e2 = estado(X(h2), pc, '2', 12, -12);
      S.e3 = estado(X(h3), pc, '3', -12, -12);
      S.desc = grupo(svg);
      txt(S.desc, X(h2) + 8, pc + 20, n(C.T2, 0) + ' °C', { tam: 12.5, peso: 700, ancla: 'start', color: NA, halo: K.blanco });
      // la llave del efecto refrigerante y la del trabajo, bajo la línea del evaporador
      S.llaveQ = grupo(svg);
      var yb = pe + 34;
      s('path', { d: 'M' + X(h3) + ' ' + (yb - 6) + 'V' + yb + 'H' + X(h1) + 'V' + (yb - 6), fill: 'none', stroke: TXT, 'stroke-width': 1.4 }, S.llaveQ);
      txt(S.llaveQ, (X(h3) + X(h1)) / 2, yb + 17, 'efecto refrigerante, ' + n(qe, 1) + ' kJ/kg', { tam: 13, peso: 700, ancla: 'middle', color: TXT, halo: K.blanco });
      S.llaveW = grupo(svg);
      var yw = pc - 30;
      s('path', { d: 'M' + X(h1) + ' ' + (yw + 6) + 'V' + yw + 'H' + X(h2) + 'V' + (yw + 6), fill: 'none', stroke: NA, 'stroke-width': 1.4 }, S.llaveW);
      txt(S.llaveW, X(h1) - 6, yw + 4, 'trabajo, ' + n(h2 - h1, 1) + ' kJ/kg', { tam: 13, peso: 700, ancla: 'end', color: NA, halo: K.blanco });

      /* -- los cuatro equipos del enfriador -- */
      var EX0 = 540, EX1 = 656, CY = 124, VX = 512, KX = 688;
      S.eq = {};
      function caja(nombre, y, zig) {
        var g = s('g', {}, svg);
        var r = s('rect', { x: EX0, y: y, width: EX1 - EX0, height: 26, fill: K.blanco, stroke: TXT, 'stroke-width': 1.6 }, g);
        var d = '';
        if (zig) { for (var i = 0; i <= 8; i++) d += (i ? 'L' : 'M') + (EX0 + 10 + i * 12) + ' ' + (y + (i % 2 ? 7 : 19)); }
        else { for (var j = 1; j <= 8; j++) d += 'M' + (EX0 + j * 13) + ' ' + (y + 4) + 'V' + (y + 22); }
        s('path', { d: d, fill: 'none', stroke: TXT, 'stroke-width': 1.2 }, g);
        S.eq[nombre] = r;
        return g;
      }
      // las líneas del refrigerante
      s('path', { d: 'M' + EX1 + ' 193H' + KX + 'V' + (CY + 16) + 'M' + KX + ' ' + (CY - 16) + 'V57H' + EX1 + 'M' + EX0 + ' 57H' + VX + 'V' + (CY - 9) + 'M' + VX + ' ' + (CY + 9) + 'V193H' + EX0, fill: 'none', stroke: TXT, 'stroke-width': 1.6 }, svg);
      caja('cond', 44, true);
      caja('evap', 180, false);
      var gk = s('g', {}, svg);
      S.eq.comp = s('circle', { cx: KX, cy: CY, r: 16, fill: K.blanco, stroke: TXT, 'stroke-width': 1.6 }, gk);
      s('path', { d: 'M' + (KX - 7) + ' ' + (CY + 14) + 'L' + (KX - 11) + ' ' + (CY - 10) + 'M' + (KX + 7) + ' ' + (CY + 14) + 'L' + (KX + 11) + ' ' + (CY - 10), fill: 'none', stroke: TXT, 'stroke-width': 1.3 }, gk);
      S.eq.valv = s('path', { d: 'M' + (VX - 8) + ' ' + (CY - 9) + 'H' + (VX + 8) + 'L' + (VX - 8) + ' ' + (CY + 9) + 'H' + (VX + 8) + 'Z', fill: K.blanco, stroke: TXT, 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, svg);
      txt(svg, (EX0 + EX1) / 2, 34, 'condensador, aire a 25 °C', { tam: 12, peso: 600, ancla: 'middle', color: TXT });
      txt(svg, (EX0 + EX1) / 2, 224, 'evaporador, glicol a 0 °C', { tam: 12, peso: 600, ancla: 'middle', color: TXT });
      txt(svg, VX + 14, CY + 4, 'válvula', { tam: 12, peso: 600, ancla: 'start', color: TXT });
      txt(svg, KX - 20, CY + 4, 'compresor', { tam: 12, peso: 600, ancla: 'end', color: TXT });
      function burbuja(x, y, t) { s('circle', { cx: x, cy: y, r: 9, fill: K.blanco, stroke: TXT, 'stroke-width': 1.2 }, svg); txt(svg, x, y + 4, t, { tam: 12, peso: 700, ancla: 'middle', color: TXT }); }
      burbuja(KX, 164, '1'); burbuja(KX, 84, '2'); burbuja(VX, 84, '3'); burbuja(VX, 164, '4');
      /* -- la tabla de las entalpías y las cuentas -- */
      var TX0 = 504, TX1 = 712;
      txt(svg, TX0, 256, 'Entalpías del propano, kJ/kg', { tam: 12.5, peso: 700, color: TXT });
      s('line', { x1: TX0, x2: TX1, y1: 262, y2: 262, stroke: K.borde, 'stroke-width': 1 }, svg);
      function renglon(y, et, val, color) {
        var g = grupo(svg);
        txt(g, TX0, y, et, { tam: 12.5, color: color || TXT2 });
        txt(g, TX1, y, val, { tam: 12.5, peso: 700, ancla: 'end', color: color || TXT });
        return g;
      }
      S.r1 = renglon(280, '1, vapor que sale', n(h1, 1));
      S.r2s = renglon(298, '2s, isentrópica', n(h2s, 1));
      S.r2 = renglon(316, '2, descarga real', n(h2, 1), NA);
      S.r3 = renglon(334, '3 = 4, líquido', n(h3, 1));
      S.sep = grupo(svg);
      s('line', { x1: TX0, x2: TX1, y1: 344, y2: 344, stroke: K.borde, 'stroke-width': 1 }, S.sep);
      S.rq = renglon(362, 'efecto refrigerante', n(qe, 1) + ' kJ/kg');
      S.rm = renglon(380, 'caudal de propano', n(mm * 3600, 1) + ' kg/h');
      S.rp = renglon(398, 'potencia del compresor', n(P, 3) + ' kW');
      S.rc = renglon(418, 'COP', n(COP, 2) + '  (Carnot ' + n(CAR, 2) + ')');
      S.rc.querySelectorAll('text')[1].setAttribute('font-size', 14);
      S.rc.querySelectorAll('text')[0].setAttribute('font-weight', 700);
      return S;
    },
    pasos: [
      { texto: 'Bajo la campana, el propano hierve o condensa a una temperatura fija para cada presión. El enfriador de la winterización evapora a −5 °C, que en el propano es 406,0 kPa, y condensa a 33 °C, 1160,8 kPa: el compresor tiene que subir el vapor entre esas dos presiones, una relación de 2,86.', dur: 1.6,
        ir: function (S, t) { ver(S.niveles, TR(t, 0, 1)); } },
      { texto: 'En el evaporador de placas el propano entra como una mezcla de líquido y vapor, en 4, hierve con el calor que le quita al glicol y sale como vapor, en 1. La válvula termostática lo deja salir 6 K sobrecalentado, para que no llegue líquido al compresor: $\\hat{H}_1$ = ' + n(h1, 1) + ' kJ/kg.', dur: 2,
        ir: function (S, t) { marcar(S, 'evap'); ver(S.e4, TR(t, 0, 0.3)); S.evap.dibujar(TR(t, 0.1, 0.9)); ver(S.e1, TR(t, 0.7, 1)); ver(S.r1, TR(t, 0.7, 1)); } },
      { texto: 'Un compresor sin pérdidas subiría el vapor por la isentrópica que sale de 1, la curva de entropía constante, hasta la presión de condensación: llegaría a 2s, con $\\hat{H}_{2s}$ = ' + n(h2s, 1) + ' kJ/kg.', dur: 2,
        ir: function (S, t) { marcar(S, 'comp'); S.isen.dibujar(TR(t, 0, 0.8)); ver(S.e2s, TR(t, 0.7, 1)); ver(S.r2s, TR(t, 0.7, 1)); } },
      { texto: 'El compresor real, con una eficiencia de 0,75, gasta más y calienta más el gas: $\\hat{H}_2 = ' + m(h1, 1) + ' + (' + m(h2s, 1) + ' - ' + m(h1, 1) + ')/0,75$ = ' + n(h2, 1) + ' kJ/kg, y la descarga sale a ' + n(C.T2, 0) + ' °C. Lo que se pierde en la compresión también lo tiene que quitar el condensador.', dur: 2,
        ir: function (S, t) { marcar(S, 'comp'); ver(S.real, TR(t, 0, 0.6)); ver(S.e2, TR(t, 0.5, 0.9)); ver(S.desc, TR(t, 0.6, 1)); ver(S.r2, TR(t, 0.6, 1)); } },
      { texto: 'En el condensador de aire el gas primero se enfría hasta la saturación y después condensa a 33 °C, 8 K sobre el aire de diseño de Bogotá, hasta que sale como líquido saturado, en 3: $\\hat{H}_3$ = ' + n(h3, 1) + ' kJ/kg.', dur: 2,
        ir: function (S, t) { marcar(S, 'cond'); S.cond.dibujar(TR(t, 0, 0.85)); ver(S.e3, TR(t, 0.75, 1)); } },
      { texto: 'La válvula baja la presión sin hacer trabajo y sin intercambiar calor, así que la expansión es isentálpica: en el diagrama es una vertical, y $\\hat{H}_4 = \\hat{H}_3$ = ' + n(h3, 1) + ' kJ/kg. Una parte del líquido se evapora al pasar, y la mezcla vuelve al evaporador.', dur: 1.8,
        ir: function (S, t) { marcar(S, 'valv'); S.valv.dibujar(TR(t, 0, 0.8)); ver(S.r3, TR(t, 0.6, 1)); } },
      { texto: 'Cada kilogramo que pasa por el evaporador se lleva el efecto refrigerante de la ' + ref('eq-rf-efecto', 'ecuación del efecto refrigerante') + ', $q_e = ' + m(h1, 1) + ' - ' + m(h3, 1) + '$ = ' + n(qe, 1) + ' kJ/kg. Para los ' + n(Q, 3) + ' kW del lote circulan $' + m(Q, 3) + '/' + m(qe, 1) + '$ = ' + n(mm * 1000, 3) + ' × 10⁻³ kg/s, ' + n(mm * 3600, 1) + ' kg/h de propano.', dur: 2,
        ir: function (S, t) { marcar(S, null); ver(S.llaveQ, TR(t, 0, 0.6)); ver(S.sep, TR(t, 0.4, 0.8)); ver(S.rq, TR(t, 0.4, 0.8)); ver(S.rm, TR(t, 0.6, 1)); } },
      { texto: 'Con la ' + ref('eq-rf-potencia', 'ecuación de la potencia') + ', el compresor toma $' + m(mm * 1000, 3) + '\\times10^{-3}\\,(' + m(h2s, 1) + ' - ' + m(h1, 1) + ')/0,75$ = ' + n(P, 3) + ' kW, y la ' + ref('eq-rf-cop', 'del COP') + ' da $' + m(Q, 3) + '/' + m(P, 3) + '$ = ' + n(COP, 2) + ', frente a ' + n(CAR, 2) + ' del de Carnot entre −5 y 33 °C. El condensador le entrega al aire ' + n(Q, 3) + ' + ' + n(P, 3) + ' = ' + n(QC, 2) + ' kW.', dur: 2,
        ir: function (S, t) { ver(S.llaveW, TR(t, 0, 0.6)); ver(S.rp, TR(t, 0.3, 0.7)); ver(S.rc, TR(t, 0.6, 1)); } }
    ]
  });
  // El equipo por donde va el ciclo, con el relleno del punto que se lee.
  function marcar(S, cual) {
    ['evap', 'comp', 'cond', 'valv'].forEach(function (k) {
      S.eq[k].setAttribute('fill', k === cual ? K.amarilloClaro : K.blanco);
      S.eq[k].setAttribute('stroke-width', k === cual ? 2.6 : 1.6);
    });
  }

  /* ======================= El COP contra las temperaturas ======================= */

  /* Dos gráficas del COP del enfriador: a la izquierda contra la condensación, con la evaporación a −5 °C; a la
     derecha contra la evaporación, con la condensación a 33 °C. El ciclo real del propano en azul y el de Carnot en el
     gris de referencia, a trazos; el punto que se lee, en amarillo. */
  var OI = { x: 70, y: 66, w: 262, h: 300, xmin: 20, xmax: 50, ymin: 0, ymax: 12, xt: [20, 25, 30, 35, 40, 45, 50], yt: [0, 2, 4, 6, 8, 10, 12], xr: 'condensación, °C', yr: 'COP' };
  var OD = { x: 432, y: 66, w: 262, h: 300, xmin: -25, xmax: 5, ymin: 0, ymax: 12, xt: [-25, -20, -15, -10, -5, 0, 5], yt: [0, 2, 4, 6, 8, 10, 12], xr: 'evaporación, °C', yr: 'COP' };
  var c33 = fila(PR.vsTc, 33), c40 = fila(PR.vsTc, 40), e15 = fila(PR.vsTe, -15);
  var RZ = PR.vsTc.concat(PR.vsTe).map(function (r) { return r[1] / r[2]; });
  var RMIN = Math.min.apply(null, RZ), RMAX = Math.max.apply(null, RZ);
  var Pd = Q / c33[1], P40 = Q / c40[1], P15 = Q / e15[1];
  var dTc = (fila(PR.vsTc, 34)[1] - fila(PR.vsTc, 32)[1]) / 2, dTe = (fila(PR.vsTe, -4)[1] - fila(PR.vsTe, -6)[1]) / 2;
  var dTcC = (fila(PR.vsTc, 34)[2] - fila(PR.vsTc, 32)[2]) / 2, dTeC = (fila(PR.vsTe, -4)[2] - fila(PR.vsTe, -6)[2]) / 2;
  function interp(tabla, T, k) {
    for (var i = 0; i < tabla.length - 1; i++) if (T >= tabla[i][0] && T <= tabla[i + 1][0]) return tabla[i][k] + (tabla[i + 1][k] - tabla[i][k]) * (T - tabla[i][0]) / (tabla[i + 1][0] - tabla[i][0]);
    return NaN;
  }

  ZB.animacion('cop', {
    vista: [0, 0, 720, 440],
    alt: 'Dos gráficas del COP del enfriador de la winterización. A la izquierda, contra la temperatura de condensación, de 20 a 50 °C, con la evaporación a −5 °C; a la derecha, contra la de evaporación, de −25 a 5 °C, con la condensación a 33 °C. En las dos, el COP de Carnot va arriba, a trazos, y el del ciclo real del propano, con 6 K de sobrecalentamiento y una eficiencia de 0,75, debajo, entre 53 y 66 % del de Carnot. En el punto de diseño, −5 y 33 °C, el real es 4,32 y el de Carnot 7,06. Si la condensación sube a 40 °C, el COP baja a 3,47 y la potencia sube 24 %; si la evaporación baja a −15 °C, el COP baja a 3,15 y la potencia sube 37 %. Cerca del punto de diseño, cada kelvin de evaporación mueve el COP real 0,15 y cada kelvin de condensación 0,14.',
    montar: function (svg) {
      var S = {};
      S.ejes = grupo(svg, 1);
      var ei = D.ejes(S.ejes, OI), ed = D.ejes(S.ejes, OD);
      S.ei = ei; S.ed = ed;
      txt(S.ejes, OI.x + OI.w / 2, OI.y - 26, 'con la evaporación a −5 °C', { tam: 13, peso: 650, ancla: 'middle', color: TXT });
      txt(S.ejes, OD.x + OD.w / 2, OD.y - 26, 'con la condensación a 33 °C', { tam: 13, peso: 650, ancla: 'middle', color: TXT });
      // la leyenda
      s('line', { x1: 150, x2: 178, y1: 16, y2: 16, stroke: REF, 'stroke-width': 2.4, 'stroke-dasharray': '7 5' }, S.ejes);
      txt(S.ejes, 184, 20, 'Carnot', { tam: 13, ancla: 'start', color: TXT });
      S.ley = grupo(svg);
      s('line', { x1: 262, x2: 290, y1: 16, y2: 16, stroke: AZ, 'stroke-width': 2.6 }, S.ley);
      txt(S.ley, 296, 20, 'ciclo real del propano, 6 K y η = 0,75', { tam: 13, ancla: 'start', color: TXT });
      // las curvas
      function curva(e, tabla, k) { return dTrazo(tabla.map(function (r) { return [e.X(r[0]), e.Y(Math.min(r[k], 12))]; })); }
      S.carI = D.trazo(svg, curva(ei, PR.vsTc, 2), { color: REF, ancho: 2.4, guion: '7 5' });
      S.carD = D.trazo(svg, curva(ed, PR.vsTe, 2), { color: REF, ancho: 2.4, guion: '7 5' });
      S.reI = D.trazo(svg, curva(ei, PR.vsTc, 1), { color: AZ, ancho: 2.8 });
      S.reD = D.trazo(svg, curva(ed, PR.vsTe, 1), { color: AZ, ancho: 2.8 });
      // los puntos de diseño
      S.pCar = grupo(svg);
      D.punto(S.pCar, ei.X(33), ei.Y(c33[2]), { r: 5, color: K.blanco });
      D.punto(S.pCar, ed.X(-5), ed.Y(c33[2]), { r: 5, color: K.blanco });
      txt(S.pCar, ei.X(33) + 9, ei.Y(c33[2]) - 8, n(c33[2], 2), { tam: 13, peso: 650, ancla: 'start', color: TXT, halo: K.blanco });
      txt(S.pCar, ed.X(-5) + 9, ed.Y(c33[2]) - 8, n(c33[2], 2), { tam: 13, peso: 650, ancla: 'start', color: TXT, halo: K.blanco });
      S.pRe = grupo(svg);
      D.punto(S.pRe, ei.X(33), ei.Y(c33[1]), { r: 6, color: AMA });
      D.punto(S.pRe, ed.X(-5), ed.Y(c33[1]), { r: 6, color: AMA });
      txt(S.pRe, ei.X(33) + 9, ei.Y(c33[1]) - 9, n(c33[1], 2), { tam: 13, peso: 700, ancla: 'start', color: TXT, halo: K.blanco });
      txt(S.pRe, ed.X(-5) - 10, ed.Y(c33[1]) - 9, n(c33[1], 2), { tam: 13, peso: 700, ancla: 'end', color: TXT, halo: K.blanco });
      // el punto que se mueve en cada gráfica, con su lectura
      S.mI = grupo(svg); S.mIp = D.punto(S.mI, 0, 0, { r: 6, color: AMA });
      S.mIt = txt(S.mI, 0, 0, '', { tam: 13, peso: 700, ancla: 'start', color: TXT, halo: K.blanco });
      S.mIt2 = txt(S.mI, 0, 0, '', { tam: 12.5, peso: 600, ancla: 'start', color: TXT, halo: K.blanco });
      S.mD = grupo(svg); S.mDp = D.punto(S.mD, 0, 0, { r: 6, color: AMA });
      S.mDt = txt(S.mD, 0, 0, '', { tam: 13, peso: 700, ancla: 'start', color: TXT, halo: K.blanco });
      S.mDt2 = txt(S.mD, 0, 0, '', { tam: 12.5, peso: 600, ancla: 'start', color: TXT, halo: K.blanco });
      // los límites del enfriador
      S.lim = grupo(svg);
      s('line', { x1: ei.X(33), x2: ei.X(33), y1: OI.y, y2: OI.y + OI.h, stroke: TXT, 'stroke-width': 1.3, 'stroke-dasharray': '3 4' }, S.lim);
      txt(S.lim, ei.X(33) - 6, OI.y + 14, 'aire a 25 °C + 8 K', { tam: 12, peso: 600, ancla: 'end', color: TXT, halo: K.blanco });
      s('line', { x1: ed.X(-5), x2: ed.X(-5), y1: OD.y, y2: OD.y + OD.h, stroke: TXT, 'stroke-width': 1.3, 'stroke-dasharray': '3 4' }, S.lim);
      txt(S.lim, ed.X(-5) - 6, OD.y + 14, 'glicol a 0 °C − 5 K', { tam: 12, peso: 600, ancla: 'end', color: TXT, halo: K.blanco });
      // las pendientes en el punto de diseño
      S.pend = grupo(svg);
      [[ei, 33, dTc], [ed, -5, dTe]].forEach(function (a) {
        var e = a[0], T0 = a[1], d = a[2], x1 = e.X(T0 - 4), x2 = e.X(T0 + 4), y1 = e.Y(c33[1] - 4 * d), y2 = e.Y(c33[1] + 4 * d);
        s('line', { x1: x1, x2: x2, y1: y1, y2: y2, stroke: TXT, 'stroke-width': 2 }, S.pend);
      });
      txt(S.pend, ei.X(33) - 6, ei.Y(c33[1]) + 34, n(Math.abs(dTc), 2) + ' por kelvin', { tam: 12.5, peso: 700, ancla: 'end', color: TXT, halo: K.blanco });
      txt(S.pend, ed.X(-5) + 8, ed.Y(c33[1]) + 34, n(dTe, 2) + ' por kelvin', { tam: 12.5, peso: 700, ancla: 'start', color: TXT, halo: K.blanco });
      return S;
    },
    pasos: [
      { texto: 'El COP de Carnot, la ' + ref('eq-rf-carnot', 'ecuación de Carnot') + ' con las temperaturas en kelvin, es el techo de cualquier ciclo entre dos temperaturas: entre −5 y 33 °C, $268,15/38$ = ' + n(CAR, 2) + '. A la izquierda cambia la condensación, con la evaporación en −5 °C; a la derecha, la evaporación, con la condensación en 33 °C. Las dos curvas caen cuando la diferencia entre las temperaturas crece.', dur: 2,
        ir: function (S, t) { S.carI.dibujar(TR(t, 0, 0.7)); S.carD.dibujar(TR(t, 0, 0.7)); ver(S.pCar, TR(t, 0.6, 1)); } },
      { texto: 'El ciclo real del enfriador, con el propano, 6 K de sobrecalentamiento y una eficiencia de 0,75, da ' + n(c33[1], 2) + ' en el punto de diseño, el ' + n(100 * c33[1] / c33[2], 0) + ' % del de Carnot. Sigue a Carnot en las dos gráficas, y se aparta un poco más cuando la diferencia crece: en estas curvas va de ' + n(100 * RMAX, 0) + ' a ' + n(100 * RMIN, 0) + ' % del de Carnot.', dur: 2,
        ir: function (S, t) { ver(S.ley, TR(t, 0, 0.4)); S.reI.dibujar(TR(t, 0, 0.7)); S.reD.dibujar(TR(t, 0, 0.7)); ver(S.pRe, TR(t, 0.6, 1)); } },
      { texto: 'Si la condensación sube a 40 °C, por un día más caliente o un condensador sucio, el COP baja a ' + n(c40[1], 2) + ' y el compresor toma ' + n(P40, 3) + ' kW para el mismo lote, en lugar de ' + n(Pd, 3) + ': ' + n(100 * (P40 / Pd - 1), 0) + ' % más, unos ' + n(100 * (Math.pow(P40 / Pd, 1 / 7) - 1), 1) + ' % por kelvin, cerca de los 3 % de los catálogos.', dur: 2.4,
        ir: function (S, t) { var T = 33 + 7 * TR(t, 0, 0.8); mover(S, 'I', T); ver(S.mI, TR(t, 0, 0.15)); } },
      { texto: 'Si la evaporación baja a −15 °C, el COP baja a ' + n(e15[1], 2) + ' y la potencia sube a ' + n(P15, 3) + ' kW: ' + n(100 * (P15 / Pd - 1), 0) + ' % más con 10 K. En este enfriador no se puede: con el evaporador 5 K más frío que el glicol, el glicol bajaría de 0 °C y el agua libre del aceite se congelaría en la camisa.', dur: 2.4,
        ir: function (S, t) { var T = -5 - 10 * TR(t, 0, 0.8); mover(S, 'D', T); ver(S.mD, TR(t, 0, 0.15)); } },
      { texto: 'Cerca del punto de diseño, cada kelvin de evaporación mueve el COP del enfriador ' + n(dTe, 2) + ', y cada kelvin de condensación ' + n(Math.abs(dTc), 2) + ' (en el de Carnot, ' + n(dTeC, 2) + ' y ' + n(Math.abs(dTcC), 2) + '): un kelvin del evaporador pesa un poco más. Por eso se evapora tan caliente como lo deja el usuario, aquí la camisa a 0 °C, y se condensa tan frío como lo deja el aire de Bogotá.', dur: 2.2,
        ir: function (S, t) { ver(S.mI, 1 - TR(t, 0, 0.3)); ver(S.mD, 1 - TR(t, 0, 0.3)); ver(S.lim, TR(t, 0.2, 0.7)); ver(S.pend, TR(t, 0.5, 1)); } }
    ]
  });
  // El punto que se mueve: a lo largo de la curva real, con el COP y la potencia que lee.
  function mover(S, lado, T) {
    var izq = lado === 'I', tabla = izq ? PR.vsTc : PR.vsTe, e = izq ? S.ei : S.ed, cop = interp(tabla, T, 1);
    var x = e.X(T), y = e.Y(cop), p = izq ? S.mIp : S.mDp, t1 = izq ? S.mIt : S.mDt, t2 = izq ? S.mIt2 : S.mDt2;
    p.setAttribute('cx', x); p.setAttribute('cy', y);
    [t1, t2].forEach(function (tt) { tt.setAttribute('text-anchor', 'start'); tt.setAttribute('x', x + 8); });
    // a la izquierda, sobre la curva; a la derecha, debajo, para no tapar la lectura del punto de diseño
    t1.setAttribute('y', izq ? y - 30 : y + 24); t2.setAttribute('y', izq ? y - 14 : y + 40);
    D.ponerTexto(t1, n(T, 0) + ' °C: COP ' + n(cop, 2));
    D.ponerTexto(t2, 'P = ' + n(Q / cop, 3) + ' kW');
  }
})();
