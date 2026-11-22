/* Las animaciones por pasos del capítulo 32 del libro, «Arrastre de vapor», traídas con el mismo código y los
   mismos números para la presentación de arrastre de vapor de 2027-10. Es una copia de
   libro/figuras/arrastre-de-vapor/actividades.js del repositorio del libro, solo con las animaciones (los retos,
   con sus soluciones, se quedan en el libro), con los datos del modelo (datos.js) adelante y los enlaces a las
   ecuaciones llevados a libro.luishreyes.com. No se edita aquí; cuando cambian en el libro se vuelven a copiar.
   Corren con el motor de /classroom/estilo-libro/actividades/. */
window.ARRASTRE = {"caso":{"cp_acero":0.478354769295041,"marginal_corte":10.697200880545198,"marginal_inicio":30.63364154890571,"r_140":21.160589060308556,"t_140":71.85758172320561,"recuperado_140":0.30923690458000896,"T":91.22649608356113,"A":2.5446900494077327,"V":5.089380098815465,"m_carga":2544.6900494077327,"cp_cascara":3.6797220979315255,"calor_vapor":2365.899575044439,"vapor_arranque":325.10334349411073,"perdida_W":1233.232117516229,"perdida_kg":1.8765105965983504,"qe":489.9632397134888,"t0":39.96461990462183,"tv":130.66433497285328,"recuperado":0.6508021789225604,"ciclo":160.66433497285328,"en_vapor":3.2531011937386363,"cascara":3801.2519204156124,"aceite":20.964940952881765,"calentamiento":485.63859833465875,"paredes":6.104478861857294,"condensado":1102.156922803484,"relacion":0.01902173866454028,"veces_equilibrio":38.07167373839394,"rho_v":0.442705563521052,"mu_v":1.1927569359641793e-05,"vs":0.12081229249352288,"G":0.053484274028615206,"dpL":13.716104564372609,"dp_lecho":27.432209128745217,"vapor_por_aceite":76.31788725739625,"fraccion_juguera":0.35953124247272367,"T_equilibrio":88.88404307957315},"supuestos":{"vapor_caldera":1600.0,"h_vapor":2748.1,"linea":6.1,"T_aire":20.0,"p":73.7,"cascara":{"agua":80.0,"carbohidrato":20.0},"T_cascara":20.0,"aceite_cascara":8.474576271186441,"k":0.0116,"D":1.8,"H":2.0,"rho_carga":500.0,"eps":0.5,"dp":0.0075,"acero":3000.0,"aislante":0.05,"area_ext":22.0,"tc":30.0,"n":4.0},"equilibrio":{"bogota":{"T":88.88404307957315,"pv_agua":67.2592853203739,"total":0.7241894283733707},"mar":{"T":97.39309618422448,"pv_agua":92.33903501998161,"total":0.7359524553064861}},"tres_componentes":{"x":{"limoneno":0.9464093535423815,"linalol":0.03557055355746449,"citral":0.018020092900154022},"T":88.97830217041152,"pv_agua":67.50213872735341,"total":0.6955291332306864,"por_componente":{"limoneno":0.6855016533332988,"linalol":0.008515127156885047,"citral":0.0015123527405025675}},"sat":[[40.0,7.38494,0.05124,1.0185e-05],[40.5,7.58408,0.05254,1.0201e-05],[41.0,7.78784,0.05387,1.0218e-05],[41.5,7.9963,0.05523,1.0234e-05],[42.0,8.20956,0.05661,1.0251e-05],[42.5,8.42771,0.05803,1.0267e-05],[43.0,8.65083,0.05947,1.0284e-05],[43.5,8.87903,0.06095,1.03e-05],[44.0,9.11239,0.06246,1.0317e-05],[44.5,9.35102,0.06399,1.0333e-05],[45.0,9.595,0.06556,1.035e-05],[45.5,9.84444,0.06717,1.0366e-05],[46.0,10.09944,0.0688,1.0383e-05],[46.5,10.36009,0.07047,1.04e-05],[47.0,10.62651,0.07218,1.0416e-05],[47.5,10.8988,0.07391,1.0433e-05],[48.0,11.17705,0.07569,1.045e-05],[48.5,11.46139,0.0775,1.0466e-05],[49.0,11.75191,0.07934,1.0483e-05],[49.5,12.04872,0.08123,1.05e-05],[50.0,12.35195,0.08315,1.0516e-05],[50.5,12.66169,0.08511,1.0533e-05],[51.0,12.97807,0.0871,1.055e-05],[51.5,13.30119,0.08914,1.0567e-05],[52.0,13.63119,0.09122,1.0583e-05],[52.5,13.96817,0.09333,1.06e-05],[53.0,14.31225,0.09549,1.0617e-05],[53.5,14.66356,0.09769,1.0634e-05],[54.0,15.02223,0.09994,1.0651e-05],[54.5,15.38836,0.10223,1.0668e-05],[55.0,15.7621,0.10456,1.0684e-05],[55.5,16.14357,0.10693,1.0701e-05],[56.0,16.53289,0.10935,1.0718e-05],[56.5,16.93021,0.11182,1.0735e-05],[57.0,17.33564,0.11433,1.0752e-05],[57.5,17.74933,0.11689,1.0769e-05],[58.0,18.17142,0.1195,1.0786e-05],[58.5,18.60203,0.12216,1.0803e-05],[59.0,19.04131,0.12486,1.082e-05],[59.5,19.4894,0.12762,1.0837e-05],[60.0,19.94643,0.13043,1.0854e-05],[60.5,20.41257,0.13328,1.0871e-05],[61.0,20.88794,0.1362,1.0887e-05],[61.5,21.3727,0.13916,1.0904e-05],[62.0,21.867,0.14218,1.0921e-05],[62.5,22.37098,0.14525,1.0938e-05],[63.0,22.8848,0.14838,1.0956e-05],[63.5,23.40862,0.15156,1.0973e-05],[64.0,23.94259,0.1548,1.099e-05],[64.5,24.48686,0.1581,1.1007e-05],[65.0,25.0416,0.16146,1.1024e-05],[65.5,25.60696,0.16487,1.1041e-05],[66.0,26.18312,0.16835,1.1058e-05],[66.5,26.77023,0.17189,1.1075e-05],[67.0,27.36846,0.17549,1.1092e-05],[67.5,27.97798,0.17915,1.1109e-05],[68.0,28.59896,0.18288,1.1126e-05],[68.5,29.23157,0.18667,1.1143e-05],[69.0,29.87599,0.19052,1.116e-05],[69.5,30.53238,0.19444,1.1178e-05],[70.0,31.20093,0.19843,1.1195e-05],[70.5,31.88182,0.20249,1.1212e-05],[71.0,32.57522,0.20661,1.1229e-05],[71.5,33.28132,0.21081,1.1246e-05],[72.0,34.00031,0.21507,1.1263e-05],[72.5,34.73237,0.21941,1.1281e-05],[73.0,35.47769,0.22382,1.1298e-05],[73.5,36.23646,0.2283,1.1315e-05],[74.0,37.00887,0.23285,1.1332e-05],[74.5,37.79512,0.23749,1.1349e-05],[75.0,38.5954,0.24219,1.1367e-05],[75.5,39.4099,0.24698,1.1384e-05],[76.0,40.23884,0.25184,1.1401e-05],[76.5,41.08241,0.25678,1.1418e-05],[77.0,41.94082,0.2618,1.1435e-05],[77.5,42.81427,0.26691,1.1453e-05],[78.0,43.70297,0.27209,1.147e-05],[78.5,44.60712,0.27736,1.1487e-05],[79.0,45.52695,0.28271,1.1504e-05],[79.5,46.46266,0.28815,1.1522e-05],[80.0,47.41447,0.29367,1.1539e-05],[80.5,48.3826,0.29928,1.1556e-05],[81.0,49.36727,0.30498,1.1573e-05],[81.5,50.36869,0.31077,1.1591e-05],[82.0,51.3871,0.31665,1.1608e-05],[82.5,52.42272,0.32262,1.1625e-05],[83.0,53.47577,0.32868,1.1643e-05],[83.5,54.54649,0.33484,1.166e-05],[84.0,55.63511,0.34109,1.1677e-05],[84.5,56.74186,0.34743,1.1694e-05],[85.0,57.86697,0.35388,1.1712e-05],[85.5,59.01069,0.36042,1.1729e-05],[86.0,60.17326,0.36706,1.1746e-05],[86.5,61.35492,0.3738,1.1764e-05],[87.0,62.55591,0.38064,1.1781e-05],[87.5,63.77647,0.38759,1.1798e-05],[88.0,65.01687,0.39464,1.1816e-05],[88.5,66.27734,0.40179,1.1833e-05],[89.0,67.55815,0.40905,1.185e-05],[89.5,68.85953,0.41642,1.1868e-05],[90.0,70.18177,0.4239,1.1885e-05],[90.5,71.5251,0.43148,1.1902e-05],[91.0,72.88979,0.43918,1.192e-05],[91.5,74.27612,0.44699,1.1937e-05],[92.0,75.68433,0.45491,1.1954e-05],[92.5,77.1147,0.46295,1.1972e-05],[93.0,78.5675,0.47111,1.1989e-05],[93.5,80.043,0.47938,1.2006e-05],[94.0,81.54148,0.48777,1.2024e-05],[94.5,83.06321,0.49628,1.2041e-05],[95.0,84.60847,0.50491,1.2059e-05],[95.5,86.17753,0.51366,1.2076e-05],[96.0,87.7707,0.52254,1.2093e-05],[96.5,89.38823,0.53154,1.2111e-05],[97.0,91.03044,0.54067,1.2128e-05],[97.5,92.6976,0.54993,1.2145e-05],[98.0,94.39,0.55931,1.2163e-05],[98.5,96.10795,0.56883,1.218e-05],[99.0,97.85173,0.57847,1.2197e-05],[99.5,99.62165,0.58825,1.2215e-05],[100.0,101.418,0.59817,1.2232e-05],[100.5,103.24108,0.60822,1.225e-05],[101.0,105.09121,0.61841,1.2267e-05],[101.5,106.96869,0.62874,1.2284e-05],[102.0,108.87383,0.6392,1.2302e-05],[102.5,110.80694,0.64981,1.2319e-05],[103.0,112.76833,0.66056,1.2336e-05],[103.5,114.75832,0.67146,1.2354e-05],[104.0,116.77723,0.6825,1.2371e-05],[104.5,118.82538,0.69369,1.2388e-05],[105.0,120.90309,0.70503,1.2406e-05],[105.5,123.01069,0.71652,1.2423e-05],[106.0,125.1485,0.72816,1.2441e-05],[106.5,127.31685,0.73995,1.2458e-05],[107.0,129.51608,0.7519,1.2475e-05],[107.5,131.74652,0.76401,1.2493e-05],[108.0,134.00851,0.77627,1.251e-05],[108.5,136.30238,0.78869,1.2527e-05],[109.0,138.62847,0.80127,1.2545e-05],[109.5,140.98714,0.81402,1.2562e-05],[110.0,143.37871,0.82693,1.258e-05]],"constantes":{"MMHG":0.1333224,"P_BOGOTA":73.7,"M_AGUA":18.015,"antoine_limoneno":[7.49358,1936.23,244.4],"clara":{"linalol":[12.68,-1940.0,-877000.0],"citral":[17.51,-6320.0,-60000.0],"alfa-pineno":[13.27,-2780.0,-399000.0]},"M":{"limoneno":136.24,"alfa-pineno":136.24,"linalol":154.25,"citral":152.24}}};

/* Las animaciones y los retos del capítulo 32, «Arrastre de vapor». Se escriben aquí directo, con el motor de
   figuras/comun/actividades.js y las piezas de figuras/comun/dibujo.js; los colores salen de la paleta del libro
   (ZB.dib.col y PALETA), nunca a mano. Los números salen del modelo del caso (datos.js, que escribe
   herramientas/arrastre.py --json): el agua saturada de IAPWS-95 cada 0,5 K, la Antoine del limoneno del capítulo 12,
   las constantes de Clará, el equilibrio en Bogotá y a nivel del mar, el tiempo muerto, el corte y la batería. Lo
   que el modelo no trae se calcula aquí con las ecuaciones del capítulo.
   Un color hace un solo trabajo dentro de cada animación: en las gráficas, los de las figuras del capítulo (el agua en
   azul, el limoneno en oliva y la suma en naranja, a trazos; la curva de rendimiento en azul y la recta del corte en
   oliva); en los dibujos, el vapor en el naranja del calor, la cáscara fría en el relleno de la cáscara, la caliente
   en el de lo caliente, el aceite en el suyo y el metal en los grises de los cortes. */
(function () {
  'use strict';
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, TR = ZB.tramo, L = ZB.lerp;
  var PA = window.PALETA, GR = PA.graficas, M = PA.materiales;
  var AZ = K.serie[0], OL = K.serie[1], NA = K.serie[2], REF = K.ref, TXT = GR.texto || K.tinta, AMA = K.amarillo;
  var A = window.ARRASTRE;
  if (!A) return;
  var C = A.caso, SU = A.supuestos, KO = A.constantes, EQ = A.equilibrio, SAT = A.sat;
  var MW = KO.M_AGUA, ML = KO.M.limoneno;

  /* ---------- Piezas ---------- */
  function grupo(padre, op) { return s('g', { opacity: op == null ? 0 : op }, padre); }
  function m(x, d) { return n(x, d).replace(',', '{,}').replace(/ /g, '\\,'); }   // un número dentro de $…$
  function ver(el, t) { D.ver(el, t); }
  function txt(padre, x, y, str, o) { o = o || {}; return D.t(padre, x, y, str, { tam: o.tam || 13, peso: o.peso, ancla: o.ancla, color: o.color || K.tinta2, halo: o.halo }); }
  function dTrazo(pts) { return pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(''); }
  function rect(padre, x, y, w, h, a) { var o = { x: x, y: y, width: Math.max(0, w), height: Math.max(0, h) }; for (var k in a || {}) o[k] = a[k]; return s('rect', o, padre); }
  function poner(el, a) { for (var k in a) el.setAttribute(k, typeof a[k] === 'number' ? a[k].toFixed(1) : a[k]); }

  /* ---------- El modelo: las cuentas de herramientas/arrastre.py ---------- */
  // el agua saturada de IAPWS-95, cada 0,5 K: la presión por su logaritmo
  function psat(T) {
    var i = Math.max(0, Math.min(SAT.length - 2, Math.floor((T - SAT[0][0]) / 0.5)));
    var a = SAT[i], b = SAT[i + 1], f = (T - a[0]) / (b[0] - a[0]);
    return Math.exp(Math.log(a[1]) + (Math.log(b[1]) - Math.log(a[1])) * f);
  }
  function Tsat(p) { return biseccion(function (T) { return psat(T) - p; }, 40, 110); }
  // el limoneno con la Antoine del capítulo 12 (mmHg, °C); el linalol y el citral con Clará (kPa, K)
  function pvLim(T) { var a = KO.antoine_limoneno; return Math.pow(10, a[0] - a[1] / (T + a[2])) * KO.MMHG; }
  function clara(c) { var k = KO.clara[c]; return function (T) { var Tk = T + 273.15; return Math.exp(k[0] + k[1] / Tk + k[2] / (Tk * Tk)); }; }
  var PV = { limoneno: pvLim, linalol: clara('linalol'), citral: clara('citral') };
  function biseccion(f, a, b) {
    var fa = f(a);
    for (var i = 0; i < 80; i++) { var c = (a + b) / 2, fc = f(c); if ((fc < 0) === (fa < 0)) { a = c; fa = fc; } else b = c; }
    return (a + b) / 2;
  }
  // la temperatura a la que hierve el agua con el aceite (x: fracciones molares en el aceite), la ecuación de Raoult
  function hierve(p, x) {
    x = x || { limoneno: 1 };
    return biseccion(function (T) { var t = psat(T) - p; for (var c in x) t += x[c] * PV[c](T); return t; }, 40, 110);
  }
  // el primer orden con tiempo muerto y su corte por máxima producción
  function Yde(t, Yi, k, t0) { return t <= t0 ? 0 : Yi * (1 - Math.exp(-k * (t - t0))); }
  function corte(k, t0, tc) { return biseccion(function (t) { var e = Math.exp(-k * (t - t0)); return k * e * (t + tc) - (1 - e); }, t0 + 1e-6, t0 + 3000); }

  var YI = SU.aceite_cascara, K2 = SU.k, T0 = C.t0, TV = C.tv, TC = SU.tc, CIC = C.ciclo;

  /* ---------- 1. Los dos líquidos que hierven juntos ---------- */
  ZB.animacion('inmiscibles', {
    vista: [0, 0, 720, 410],
    alt: 'Una gráfica de presión de vapor contra temperatura, entre 60 y 110 °C. La curva del agua corta la recta de 73,7 kPa a 91,29 °C. La del limoneno queda abajo, en unos 6 kPa a 90 °C. La suma de las dos corta la recta a 88,88 °C; a esa temperatura una barra a la derecha reparte los 73,7 kPa en 67,26 del agua y 6,44 del limoneno, y la relación de equilibrio da 0,724 kg de aceite por kilogramo de agua. Al final la recta sube a 101,3 kPa, el corte pasa a 97,39 °C y la relación a 0,736.',
    montar: function (svg) {
      var S = {};
      var o = { x: 70, y: 40, w: 440, h: 300, xmin: 60, xmax: 110, ymin: 0, ymax: 110, xt: [60, 70, 80, 90, 100, 110], yt: [0, 20, 40, 60, 80, 100], xr: 'T (°C)', yr: 'p (kPa)' };
      var e = S.e = D.ejes(svg, o);
      function curva(f, T1) { var pts = []; for (var T = 60; T <= T1 + 1e-9; T += 0.5) pts.push([e.X(T), e.Y(Math.min(110, f(T)))]); return dTrazo(pts); }
      var Tw110 = Tsat(110), Ts110 = biseccion(function (T) { return psat(T) + pvLim(T) - 110; }, 60, 110);
      S.recta = s('line', { x1: o.x, x2: o.x + o.w, stroke: REF, 'stroke-width': 1.4, 'stroke-dasharray': '5 4' }, svg);
      S.rotRecta = txt(svg, o.x + o.w - 4, 0, '', { ancla: 'end', tam: 12, color: REF, peso: 600, halo: K.blanco });
      S.agua = D.trazo(svg, curva(psat, Tw110), { color: AZ, ancho: 2.6 });
      S.lim = D.trazo(svg, curva(pvLim, 110), { color: OL, ancho: 2.6 });
      S.suma = D.trazo(svg, curva(function (T) { return psat(T) + pvLim(T); }, Ts110), { color: NA, ancho: 2.4, guion: '7 4' });
      S.labAgua = grupo(svg); txt(S.labAgua, e.X(101.5), e.Y(84), 'agua', { color: AZ, peso: 650, halo: K.blanco });
      S.ptAgua = D.punto(S.labAgua, 0, 0, { r: 5, color: AZ });
      S.txAgua = txt(S.labAgua, 0, 0, '', { ancla: 'start', tam: 12, color: AZ, peso: 650, halo: K.blanco });
      S.labLim = grupo(svg); txt(S.labLim, e.X(104), e.Y(pvLim(104)) - 8, 'limoneno', { ancla: 'end', color: OL, peso: 650, halo: K.blanco });
      S.labSuma = grupo(svg); txt(S.labSuma, e.X(80), e.Y(62), 'agua + limoneno', { ancla: 'end', color: NA, peso: 650, halo: K.blanco });
      S.ptSuma = D.punto(svg, 0, 0, { r: 6, color: AMA }); ver(S.ptSuma, 0);
      S.vert = s('line', { stroke: K.tinta2, 'stroke-width': 1, 'stroke-dasharray': '3 3', opacity: 0 }, svg);
      S.txSuma = txt(svg, 0, 0, '', { ancla: 'end', tam: 13, color: TXT, peso: 650, halo: K.blanco }); ver(S.txSuma, 0);
      // la barra que reparte la presión
      var bx = 580, bw = 34;
      S.barra = grupo(svg);
      S.bAgua = rect(S.barra, bx, 0, bw, 0, { fill: M.agua.relleno, stroke: AZ, 'stroke-width': 1.4 });
      S.bLim = rect(S.barra, bx, 0, bw, 0, { fill: M.aceite.relleno || K.aceite, stroke: OL, 'stroke-width': 1.4 });
      S.tbAgua = txt(S.barra, bx + bw + 8, 0, '', { tam: 12, color: AZ, peso: 650 });
      S.tbLim = txt(S.barra, bx + bw + 8, 0, '', { tam: 12, color: OL, peso: 650 });
      S.tbTit = txt(S.barra, bx + bw / 2, o.y - 8, '', { ancla: 'middle', tam: 12, color: TXT, peso: 650 });
      S.tbRel = txt(S.barra, bx + bw / 2, o.y + o.h + 34, '', { ancla: 'middle', tam: 13, color: TXT, peso: 700 });
      S.poner = function (p) {
        var T = hierve(p), pw = psat(T), pl = p - pw, Tw = Tsat(p);
        poner(S.recta, { y1: e.Y(p), y2: e.Y(p) });
        S.rotRecta.setAttribute('y', (e.Y(p) - 6).toFixed(1)); D.ponerTexto(S.rotRecta, n(p, 1) + ' kPa');
        poner(S.ptAgua, { cx: e.X(Tw), cy: e.Y(p) });
        S.txAgua.setAttribute('x', (e.X(Tw) + 8).toFixed(1)); S.txAgua.setAttribute('y', (e.Y(p) + 18).toFixed(1)); D.ponerTexto(S.txAgua, n(Tw, 2) + ' °C');
        poner(S.ptSuma, { cx: e.X(T), cy: e.Y(p) });
        poner(S.vert, { x1: e.X(T), x2: e.X(T), y1: e.Y(p), y2: e.Y(0) });
        S.txSuma.setAttribute('x', (e.X(T) - 10).toFixed(1)); S.txSuma.setAttribute('y', (e.Y(p) - 10).toFixed(1)); D.ponerTexto(S.txSuma, n(T, 2) + ' °C');
        poner(S.bAgua, { y: e.Y(pw), height: e.Y(0) - e.Y(pw) });
        poner(S.bLim, { y: e.Y(p), height: e.Y(pw) - e.Y(p) });
        S.tbAgua.setAttribute('y', ((e.Y(pw) + e.Y(0)) / 2 + 4).toFixed(1)); D.ponerTexto(S.tbAgua, n(pw, 2));
        S.tbLim.setAttribute('y', ((e.Y(p) + e.Y(pw)) / 2 + 4).toFixed(1)); D.ponerTexto(S.tbLim, n(pl, 2));
        D.ponerTexto(S.tbTit, 'a ' + n(T, 2) + ' °C (kPa)');
        D.ponerTexto(S.tbRel, n(pl / pw * ML / MW, 3) + ' kg/kg');
      };
      S.poner(KO.P_BOGOTA);
      ver(S.barra, 0);
      return S;
    },
    pasos: [
      { texto: 'El agua sola hierve en Bogotá donde su presión de vapor llega a la de la atmósfera, 73,7 kPa: a ' + n(Tsat(KO.P_BOGOTA), 2) + ' °C.', dur: 1.8,
        ir: function (S, t) { S.poner(KO.P_BOGOTA); S.agua.dibujar(TR(t, 0, 0.7)); ver(S.labAgua, TR(t, 0.5, 1)); ver(S.lim, 0); ver(S.labLim, 0); S.suma.dibujar(0); ver(S.labSuma, 0); ver(S.ptSuma, 0); ver(S.txSuma, 0); ver(S.vert, 0); ver(S.barra, 0); } },
      { texto: 'El limoneno, solo, hierve a ' + n(biseccion(function (T) { return pvLim(T) - KO.P_BOGOTA; }, 100, 250), 1) + ' °C. Cerca de 90 °C su presión de vapor es apenas de unos 6 kPa, y su curva va pegada al eje.', dur: 1.6,
        ir: function (S, t) { S.poner(KO.P_BOGOTA); ver(S.lim, 1); S.lim.dibujar(TR(t, 0, 0.7)); ver(S.labLim, TR(t, 0.5, 1)); } },
      { texto: 'Cuando están juntos, cada líquido pone su presión de vapor entera, como si el otro no estuviera, y la mezcla hierve donde la suma llega a 73,7 kPa (la <a href="https://libro.luishreyes.com/las-operaciones-unitarias.html#eq-inmiscibles" target="_blank" rel="noopener">ecuación de los inmiscibles</a>): a ' + n(EQ.bogota.T, 2) + ' °C, por debajo del agua sola.', dur: 2,
        ir: function (S, t) { S.poner(KO.P_BOGOTA); S.suma.dibujar(TR(t, 0, 0.7)); ver(S.labSuma, TR(t, 0.4, 0.8)); ver(S.ptSuma, TR(t, 0.6, 1)); ver(S.txSuma, TR(t, 0.7, 1)); ver(S.vert, TR(t, 0.7, 1)); } },
      { texto: 'A ' + n(EQ.bogota.T, 2) + ' °C el agua pone ' + n(EQ.bogota.pv_agua, 2) + ' kPa y el limoneno ' + n(KO.P_BOGOTA - EQ.bogota.pv_agua, 2) + '. El vapor lleva los moles en esa razón, y con las masas molares, $(' + m(KO.P_BOGOTA - EQ.bogota.pv_agua, 2) + '/' + m(EQ.bogota.pv_agua, 2) + ')(136{,}24/18{,}015)$ = ' + n(EQ.bogota.total, 3) + ' kg de aceite por kilogramo de agua: la <a href="https://libro.luishreyes.com/arrastre-de-vapor.html#eq-av-relacion" target="_blank" rel="noopener">relación de equilibrio</a>.', dur: 1.8,
        ir: function (S, t) { S.poner(KO.P_BOGOTA); ver(S.barra, TR(t, 0, 0.8)); } },
      { texto: 'A nivel del mar la recta sube a 101,3 kPa y el corte pasa a ' + n(EQ.mar.T, 2) + ' °C. La relación casi no cambia, ' + n(EQ.mar.total, 3) + ' kg/kg, porque las dos presiones de vapor suben casi juntas en este intervalo.', dur: 2.2,
        ir: function (S, t) { S.poner(L(KO.P_BOGOTA, 101.325, TR(t, 0, 1))); } }
    ]
  });

  /* ---------- 2. El frente de condensación y el tiempo muerto ---------- */
  var QN = C.qe - C.perdida_kg;                     // el vapor que le queda a la carga, kg/h
  function mvDe(tm) { return Math.min(C.vapor_arranque, QN * tm / 60); }
  ZB.animacion('frente', {
    vista: [0, 0, 720, 420],
    alt: 'A la izquierda, un extractor del caso en corte con su lecho de cáscara de 2,0 m y tres termopares en la pared; el vapor entra por abajo. Un frente de condensación sube por el lecho: debajo la cáscara está caliente, encima fría. Los termopares se encienden al pasar el frente. A los 40,0 min el frente llega arriba con 325 kg de vapor condensado y sale la primera gota hacia el condensador. A la derecha, el vapor condensado en la carga contra el tiempo: sube en línea recta hasta 325 kg a los 40,0 min y después queda plano.',
    montar: function (svg) {
      var S = {};
      var xa = 90, xb = 260, yt = 110, yb = 330, yTapa = 70, yFondo = 370;
      S.geo = { xa: xa, xb: xb, yt: yt, yb: yb };
      // el recipiente
      s('path', { d: 'M' + xa + ' ' + (yTapa + 20) + ' Q ' + (xa + xb) / 2 + ' ' + (yTapa - 14) + ' ' + xb + ' ' + (yTapa + 20) + ' V ' + (yFondo - 20) + ' Q ' + (xa + xb) / 2 + ' ' + (yFondo + 14) + ' ' + xa + ' ' + (yFondo - 20) + ' Z', fill: K.blanco, stroke: 'none' }, svg);
      S.frio = rect(svg, xa, yt, xb - xa, yb - yt, { fill: M.cascara.relleno });
      S.caliente = rect(svg, xa, yb, xb - xa, 0, { fill: M.caliente.relleno });
      // los trozos de cáscara, con una semilla fija
      var sem = 7; function az() { sem = (sem * 9301 + 49297) % 233280; return sem / 233280; }
      for (var i = 0; i < 70; i++) {
        var x = xa + 6 + az() * (xb - xa - 18), y = yt + 6 + az() * (yb - yt - 14), r = az() * 180;
        rect(svg, x, y, 11, 4, { fill: M.cascara.medio, transform: 'rotate(' + r.toFixed(0) + ' ' + (x + 5).toFixed(0) + ' ' + (y + 2).toFixed(0) + ')', rx: 1 });
      }
      S.linea = s('line', { x1: xa, x2: xb, stroke: K.calor, 'stroke-width': 2.4, 'stroke-dasharray': '7 4' }, svg);
      s('path', { d: 'M' + xa + ' ' + yb + ' H ' + xb, stroke: K.tinta, 'stroke-width': 1.2, 'stroke-dasharray': '5 3', fill: 'none' }, svg);
      s('path', { d: 'M' + xa + ' ' + (yTapa + 20) + ' Q ' + (xa + xb) / 2 + ' ' + (yTapa - 14) + ' ' + xb + ' ' + (yTapa + 20) + ' V ' + (yFondo - 20) + ' Q ' + (xa + xb) / 2 + ' ' + (yFondo + 14) + ' ' + xa + ' ' + (yFondo - 20) + ' Z', fill: 'none', stroke: K.tinta, 'stroke-width': 2 }, svg);
      // el vapor que entra y el que sale
      D.flecha(svg, (xa + xb) / 2, 412, (xa + xb) / 2, yFondo + 6, { color: K.calor, ancho: 2.4 });
      txt(svg, (xa + xb) / 2 + 10, 404, 'vapor: ' + n(C.qe, 1) + ' kg/h', { tam: 12, color: K.calor, peso: 650 });
      s('path', { d: 'M' + (xa + xb) / 2 + ' ' + (yTapa - 4) + ' V 30 H 330', fill: 'none', stroke: K.tinta, 'stroke-width': 2 }, svg);
      D.flecha(svg, 330, 30, 360, 30, { color: K.tinta, ancho: 2 });
      txt(svg, 366, 34, 'a E-201', { tam: 12, color: K.tinta2 });
      S.gota = grupo(svg);
      s('path', { d: 'M 345 40 q -5 8 0 12 q 5 -4 0 -12 Z', fill: K.aceite, stroke: K.aceiteO, 'stroke-width': 1 }, S.gota);
      txt(S.gota, 366, 52, 'la primera gota', { tam: 12, color: TXT, peso: 650 });
      S.subir = [];
      for (var j = 0; j < 3; j++) S.subir.push(D.flechaViva(svg, { color: K.calor, ancho: 2, punta: 8 }));
      // los termopares
      S.te = [0.8, 0.5, 0.2].map(function (h, k) {
        var y = yb - h * (yb - yt), g = s('g', {}, svg);
        s('line', { x1: xb, x2: xb + 22, y1: y, y2: y, stroke: K.tinta2, 'stroke-width': 1 }, g);
        var c = s('circle', { cx: xb + 34, cy: y, r: 11, fill: K.blanco, stroke: K.tinta, 'stroke-width': 1.4 }, g);
        txt(g, xb + 50, y + 4, 'TE-206A' + (k + 1), { tam: 12, color: K.tinta2, peso: 600 });
        return { c: c, h: h };
      });
      // la gráfica del vapor condensado
      var o = { x: 470, y: 70, w: 220, h: 250, xmin: 0, xmax: 60, ymin: 0, ymax: 350, xt: [0, 20, 40, 60], yt: [0, 100, 200, 300], xr: 't (min)', yr: 'vapor condensado (kg)' };
      var e = S.e = D.ejes(svg, o);
      var pts = []; for (var tm = 0; tm <= 60; tm += 1) pts.push([e.X(tm), e.Y(mvDe(tm))]);
      S.curva = D.trazo(svg, dTrazo(pts), { color: K.calor, ancho: 2.6 });
      S.pt = D.punto(svg, 0, 0, { r: 5.5, color: AMA });
      S.reloj = txt(svg, 470, 372, '', { tam: 14, color: TXT, peso: 700 });
      S.mv = txt(svg, 470, 394, '', { tam: 13, color: K.calor, peso: 650 });
      S.poner = function (tm) {
        var f = Math.min(1, tm / T0), yf = yb - f * (yb - yt);
        poner(S.caliente, { y: yf, height: yb - yf }); poner(S.frio, { height: yf - yt });
        poner(S.linea, { y1: yf, y2: yf }); S.linea.setAttribute('opacity', f < 1 ? 1 : 0);
        S.te.forEach(function (q) { q.c.setAttribute('fill', f >= q.h ? K.calor : K.blanco); });
        var u = (tm % 6) / 6;
        S.subir.forEach(function (fl, k) {
          var x = xa + (k + 1) * (xb - xa) / 4;
          var y0 = yb - 4, y1 = Math.max(yf + 10, yb - 60);
          if (f >= 1) { y1 = yt - 26; }
          fl(x, y0, x, Math.min(y0, y1));
        });
        S.curva.dibujar(tm / 60);
        poner(S.pt, { cx: e.X(tm), cy: e.Y(mvDe(tm)) });
        D.ponerTexto(S.reloj, 't = ' + n(tm, 1) + ' min');
        D.ponerTexto(S.mv, 'en la carga y el acero: ' + n(mvDe(tm), 0) + ' kg');
        ver(S.gota, tm >= T0 ? 1 : 0);
      };
      S.poner(0);
      return S;
    },
    pasos: [
      { texto: 'Se abre la válvula del vapor y llegan ' + n(C.qe, 1) + ' kg/h de vapor saturado de 5 bara bajo la rejilla; las paredes condensan ' + n(C.perdida_kg, 1) + '. La carga está a 20 °C, y el vapor condensa en los primeros trozos que toca y los lleva a ' + n(C.T, 2) + ' °C, la temperatura del lecho.', dur: 1.6,
        ir: function (S, t) { S.poner(L(0, 3, t)); } },
      { texto: 'El frente de condensación sube. Debajo de él la carga está caliente y mojada; encima sigue fría, y el vapor no la cruza: condensa en el frente. Los termopares lo ven pasar, primero el de abajo. Cada kilogramo de vapor deja ' + n(C.calor_vapor, 1) + ' kJ, y a los 20 min van ' + n(mvDe(20), 0) + ' kg en la carga.', dur: 2.6,
        ir: function (S, t) { S.poner(L(3, 20, t)); } },
      { texto: 'A los ' + n(T0, 1) + ' min el frente llega arriba con ' + n(C.vapor_arranque, 0) + ' kg de vapor condensado en la carga y el acero, ' + n(C.vapor_arranque / C.m_carga, 3) + ' kg por kilogramo de cáscara, y sale la primera gota: es el $t_0$ de la <a href="https://libro.luishreyes.com/arrastre-de-vapor.html#eq-av-arranque" target="_blank" rel="noopener">ecuación del tiempo muerto</a>, la cota de un frente plano.', dur: 2.6,
        ir: function (S, t) { S.poner(L(20, T0, t)); } },
      { texto: 'Desde ahí el vapor cruza el lecho caliente y se lleva el aceite que llega a la superficie de los trozos: unos 19 g por kilogramo de vapor, ' + n(C.veces_equilibrio, 0) + ' veces menos que el equilibrio. Las paredes siguen condensando ' + n(C.perdida_kg, 1) + ' kg/h, pero la carga ya no se queda con más vapor.', dur: 2,
        ir: function (S, t) { S.poner(L(T0, 60, t)); } }
    ]
  });

  /* ---------- 3. La curva de rendimiento y el corte ---------- */
  var TCUT = corte(K2, T0, TC), YCUT = Yde(TCUT, YI, K2, T0), T90 = T0 - Math.log(0.1) / K2;
  ZB.animacion('corte', {
    vista: [0, 0, 720, 400],
    alt: 'El aceite recogido por kilogramo de cáscara contra el tiempo desde que se abre el vapor, entre −40 y 280 min. La curva es cero hasta el tiempo muerto, 40,0 min, y después sube como un primer orden hacia 8,47 g/kg. Una recta sale del punto de −30 min, el tiempo de descarga y carga, y barre la curva; su pendiente es máxima donde la toca, a 130,7 min y 5,52 g/kg, el corte por máxima producción. Al final se marca el 90 % de recuperación, a 238 min.',
    montar: function (svg) {
      var S = {};
      var o = { x: 70, y: 40, w: 610, h: 280, xmin: -40, xmax: 280, ymin: 0, ymax: 9, xt: [-40, 0, 40, 80, 120, 160, 200, 240, 280], yt: [0, 2, 4, 6, 8], xr: 'tiempo desde que se abre el vapor (min)', yr: 'Y (g/kg)' };
      var e = S.e = D.ejes(svg, o);
      s('line', { x1: e.X(-40), x2: e.X(280), y1: e.Y(YI), y2: e.Y(YI), stroke: REF, 'stroke-width': 1.4, 'stroke-dasharray': '5 4' }, svg);
      txt(svg, e.X(-36), e.Y(YI) - 7, 'Y_∞ = ' + n(YI, 2) + ' g/kg', { tam: 12, color: REF, peso: 600 });
      S.muerto = D.trazo(svg, dTrazo([[e.X(0), e.Y(0)], [e.X(T0), e.Y(0)]]), { color: AZ, ancho: 4 });
      S.labMuerto = grupo(svg); txt(S.labMuerto, e.X(T0 / 2), e.Y(0) - 12, 't_0 = ' + n(T0, 1) + ' min', { ancla: 'middle', tam: 12, color: AZ, peso: 650, halo: K.blanco });
      var pts = []; for (var t = T0; t <= 280; t += 2) pts.push([e.X(t), e.Y(Yde(t, YI, K2, T0))]);
      S.curva = D.trazo(svg, dTrazo(pts), { color: AZ, ancho: 2.6 });
      S.labCurva = grupo(svg); txt(S.labCurva, e.X(200), e.Y(Yde(200, YI, K2, T0)) + 22, 'primer orden', { ancla: 'middle', color: AZ, peso: 650, halo: K.blanco });
      S.origen = D.punto(svg, e.X(-TC), e.Y(0), { r: 5, color: OL }); ver(S.origen, 0);
      S.labOrigen = grupo(svg); txt(S.labOrigen, e.X(-TC), e.Y(0) - 12, '−t_c', { ancla: 'middle', tam: 12, color: OL, peso: 650, halo: K.blanco });
      S.recta = s('line', { stroke: OL, 'stroke-width': 2, 'stroke-dasharray': '6 4', opacity: 0 }, svg);
      S.pm = D.punto(svg, 0, 0, { r: 5, color: OL }); ver(S.pm, 0);
      S.lectura = txt(svg, e.X(-36), e.Y(8.2) + 34, '', { tam: 13, color: OL, peso: 650, halo: K.blanco }); ver(S.lectura, 0);
      S.labCorte = grupo(svg);
      D.punto(S.labCorte, e.X(TCUT), e.Y(YCUT), { r: 6.5, color: AMA });
      s('line', { x1: e.X(TCUT), x2: e.X(TCUT), y1: e.Y(YCUT), y2: e.Y(0), stroke: K.tinta2, 'stroke-width': 1, 'stroke-dasharray': '3 3' }, S.labCorte);
      txt(S.labCorte, e.X(TCUT) + 10, e.Y(YCUT) + 22, 'corte: ' + n(TCUT, 1) + ' min, ' + n(YCUT, 2) + ' g/kg', { tam: 13, color: TXT, peso: 700, halo: K.blanco });
      S.lab90 = grupo(svg);
      D.punto(S.lab90, e.X(T90), e.Y(0.9 * YI), { r: 5, color: REF });
      txt(S.lab90, e.X(T90), e.Y(0.9 * YI) + 22, '90 %: ' + n(T90, 0) + ' min', { ancla: 'middle', tam: 12, color: REF, peso: 650, halo: K.blanco });
      S.rectaA = function (tt) {
        var y = Yde(tt, YI, K2, T0), x2 = 280, y2 = y * (x2 + TC) / (tt + TC);
        if (y2 > 9) { y2 = 9; x2 = 9 * (tt + TC) / y - TC; }
        poner(S.recta, { x1: e.X(-TC), y1: e.Y(0), x2: e.X(x2), y2: e.Y(y2) });
        poner(S.pm, { cx: e.X(tt), cy: e.Y(y) });
        D.ponerTexto(S.lectura, 'Y/(t + t_c) = ' + n(y / (tt + TC) * 60, 2) + ' g/kg por hora de ciclo');
      };
      return S;
    },
    pasos: [
      { texto: 'El reloj empieza cuando se abre el vapor, y durante el tiempo muerto no sale aceite: la curva arranca a los ' + n(T0, 1) + ' min, cuando el frente llega arriba.', dur: 1.4,
        ir: function (S, t) { S.muerto.dibujar(TR(t, 0, 0.7)); ver(S.labMuerto, TR(t, 0.4, 1)); S.curva.dibujar(0); ver(S.labCurva, 0); ver(S.labCorte, 0); ver(S.lab90, 0); ver(S.recta, 0); ver(S.pm, 0); ver(S.origen, 0); ver(S.labOrigen, 0); ver(S.lectura, 0); } },
      { texto: 'Después viene el primer orden, $Y = ' + m(YI, 2) + '\\,[1 - e^{-' + m(K2, 4) + '\\,(t - ' + m(T0, 1) + ')}]$ g/kg (la <a href="https://libro.luishreyes.com/arrastre-de-vapor.html#eq-av-primer-orden" target="_blank" rel="noopener">ecuación del primer orden</a>). La curva se aplana hacia $Y_\\infty$: a los 100 min va en ' + n(Yde(100, YI, K2, T0), 2) + ' g/kg, y a los 200 min en ' + n(Yde(200, YI, K2, T0), 2) + '.', dur: 2,
        ir: function (S, t) { S.curva.dibujar(TR(t, 0, 0.8)); ver(S.labCurva, TR(t, 0.6, 1)); } },
      { texto: 'Cada ciclo suma además los ' + n(TC, 0) + ' min de descarga y carga. El aceite por minuto de ciclo, $Y/(t + t_c)$, es la pendiente de la recta que sale del punto $(-t_c,\\ 0)$ hasta la curva: crece mientras la curva sube rápido y baja cuando se aplana.', dur: 3,
        ir: function (S, t) { ver(S.origen, TR(t, 0, 0.15)); ver(S.labOrigen, TR(t, 0, 0.15)); ver(S.recta, TR(t, 0.05, 0.2)); ver(S.pm, TR(t, 0.05, 0.2)); ver(S.lectura, TR(t, 0.05, 0.2)); var u = TR(t, 0.1, 0.65), w = TR(t, 0.65, 1); S.rectaA(w > 0 ? L(250, TCUT, w) : L(60, 250, u)); } },
      { texto: 'La pendiente es máxima donde la recta toca la curva (la <a href="https://libro.luishreyes.com/arrastre-de-vapor.html#eq-av-corte" target="_blank" rel="noopener">ecuación del corte</a>): a los ' + n(TCUT, 1) + ' min, con ' + n(YCUT, 2) + ' g/kg, ' + n(100 * YCUT / YI, 1) + ' % del aceite. El ciclo dura ' + n(TCUT + TC, 1) + ' min y saca ' + n(YCUT * C.m_carga / 1000, 1) + ' kg por carga.', dur: 1.6,
        ir: function (S, t) { S.rectaA(TCUT); ver(S.labCorte, TR(t, 0, 0.7)); } },
      { texto: 'En el corte cada kilogramo de vapor lleva ' + n(C.marginal_corte, 1) + ' g de aceite, frente a ' + n(C.marginal_inicio, 1) + ' en la primera gota (la <a href="https://libro.luishreyes.com/arrastre-de-vapor.html#eq-av-marginal" target="_blank" rel="noopener">relación marginal</a>). Sacar 90 % pediría llegar a ' + n(T90, 0) + ' min, y el aceite por hora del extractor bajaría a ' + n(0.9 * YI * C.m_carga / 1000 / ((T90 + TC) / 60), 1) + ' kg, frente a ' + n(YCUT * C.m_carga / 1000 / ((TCUT + TC) / 60), 1) + ' con el corte.', dur: 1.6,
        ir: function (S, t) { ver(S.lab90, TR(t, 0, 0.7)); } }
    ]
  });

  /* ---------- 4. El programa de la batería ---------- */
  var NB = SU.n, CUARTO = CIC / NB, LET = 'ABCD';
  function fase(i, tm) { var u = ((tm - i * CUARTO) % CIC + CIC) % CIC; return u < T0 ? 0 : u < TV ? 1 : 2; }   // 0 calienta, 1 destila, 2 carga
  var COLF = [M.caliente.relleno, M.cascara.relleno, PA.cortes['pieza-atras']];
  var NOMF = ['calienta', 'destila', 'se carga'];
  var TB = TV - 3 * CUARTO;                          // cuándo corta el extractor que lleva más tiempo, en cada cuarto
  ZB.animacion('bateria', {
    vista: [0, 0, 720, 420],
    alt: 'Arriba, los cuatro extractores V-201 A a D, cada uno con el color de su fase: caliente si calienta su carga, cáscara si destila y gris si se descarga y se carga, con una flecha de vapor debajo de los que reciben vapor. Abajo, el programa de un ciclo de 160,7 min en barras, con una línea que avanza. Cada 40,2 min entra una carga nueva y 10,2 min después corta la que lleva más tiempo; hay tres o cuatro extractores con vapor, 3,25 en promedio.',
    montar: function (svg) {
      var S = {};
      var xs = [110, 240, 370, 500], y0 = 40, y1 = 170, w = 76;
      S.vasos = xs.map(function (x, i) {
        var g = s('g', {}, svg);
        var r = rect(g, x - w / 2, y0 + 10, w, y1 - y0 - 20, { fill: COLF[1], stroke: 'none' });
        s('path', { d: 'M' + (x - w / 2) + ' ' + (y0 + 10) + ' Q ' + x + ' ' + (y0 - 8) + ' ' + (x + w / 2) + ' ' + (y0 + 10) + ' V ' + (y1 - 10) + ' Q ' + x + ' ' + (y1 + 8) + ' ' + (x - w / 2) + ' ' + (y1 - 10) + ' Z', fill: 'none', stroke: K.tinta, 'stroke-width': 2 }, g);
        txt(g, x, y1 + 26, 'V-201 ' + LET[i], { ancla: 'middle', tam: 13, color: TXT, peso: 700 });
        var est = txt(g, x, y1 + 44, '', { ancla: 'middle', tam: 12, color: K.tinta2 });
        var fl = D.flecha(g, x, y1 + 72, x, y1 + 50, { color: K.calor, ancho: 2.4 });
        return { r: r, est: est, fl: fl };
      });
      S.cuenta = txt(svg, 600, 90, '', { tam: 14, color: K.calor, peso: 700 });
      S.reloj = txt(svg, 600, 114, '', { tam: 13, color: TXT, peso: 650 });
      NOMF.forEach(function (nm, k) {
        rect(svg, 600, 140 + k * 22, 16, 14, { fill: COLF[k], stroke: K.tinta2, 'stroke-width': 0.8 });
        txt(svg, 622, 152 + k * 22, nm, { tam: 12, color: K.tinta2 });
      });
      // el programa de un ciclo
      var gx = 110, gw = 580, gy = 270, gh = 22, X = function (tm) { return gx + tm / CIC * gw; };
      for (var i = 0; i < NB; i++) {
        var y = gy + i * (gh + 7);
        txt(svg, gx - 10, y + 16, 'V-201 ' + LET[i], { ancla: 'end', tam: 12, color: TXT, peso: 650 });
        for (var tm = 0; tm < CIC; tm += 0.5) {
          var f = fase(i, tm), a = tm, b = tm + 0.5;
          while (b < CIC && fase(i, b) === f) b += 0.5;
          rect(svg, X(a), y, X(Math.min(b, CIC)) - X(a), gh, { fill: COLF[f], stroke: K.tinta2, 'stroke-width': 0.8 });
          tm = b - 0.5;
        }
      }
      [0, 40, 80, 120, 160].forEach(function (v) { txt(svg, X(v), gy + NB * (gh + 7) + 14, n(v, 0), { ancla: 'middle', tam: 12, color: K.tinta2 }); });
      txt(svg, gx + gw, gy + NB * (gh + 7) + 32, 'tiempo (min)', { ancla: 'end', tam: 12, color: TXT, peso: 600 });
      S.cursor = s('line', { y1: gy - 6, y2: gy + NB * (gh + 7), stroke: K.alerta, 'stroke-width': 2 }, svg);
      S.poner = function (tm) {
        var con = 0;
        S.vasos.forEach(function (v, i) {
          var f = fase(i, tm); v.r.setAttribute('fill', COLF[f]); D.ponerTexto(v.est, NOMF[f]);
          v.fl.setAttribute('opacity', f < 2 ? 1 : 0); if (f < 2) con++;
        });
        D.ponerTexto(S.cuenta, 'con vapor: ' + con + ' de ' + NB);
        D.ponerTexto(S.reloj, 't = ' + n(tm, 1) + ' min');
        poner(S.cursor, { x1: X(tm), x2: X(tm) });
      };
      S.poner(0);
      return S;
    },
    pasos: [
      { texto: 'Al arrancar el ciclo de V-201 A, su carga nueva empieza a calentarse; V-201 B termina su destilación, y C y D destilan: los cuatro reciben vapor.', dur: 1.6,
        ir: function (S, t) { S.poner(L(0, TB - 0.01, t)); } },
      { texto: 'A los ' + n(TB, 1) + ' min V-201 B llega a sus ' + n(TV, 1) + ' min de vapor, se corta y pasa ' + n(TC, 0) + ' min en descarga y carga: quedan tres con vapor. A los ' + n(T0, 1) + ' min V-201 A da su primera gota.', dur: 2,
        ir: function (S, t) { S.poner(L(TB, CUARTO - 0.01, t)); } },
      { texto: 'Cada ' + n(CUARTO, 1) + ' min, un cuarto de ciclo, entra una carga nueva, y ' + n(TB, 1) + ' min después corta la que lleva más tiempo: B vuelve a empezar a los ' + n(CUARTO, 1) + ' min, C a los ' + n(2 * CUARTO, 1) + ' y D a los ' + n(3 * CUARTO, 1) + '. Siempre hay tres o cuatro extractores con vapor, y la caldera ve una demanda casi pareja.', dur: 4,
        ir: function (S, t) { S.poner(L(CUARTO, CIC - 0.01, t)); } },
      { texto: 'En promedio reciben vapor $4 \\times ' + m(TV, 1) + '/' + m(CIC, 1) + '$ = ' + n(C.en_vapor, 2) + ' extractores, y la <a href="https://libro.luishreyes.com/arrastre-de-vapor.html#eq-av-bateria" target="_blank" rel="noopener">ecuación de la batería</a> le da a cada uno ' + n(SU.vapor_caldera - SU.linea, 1) + '/' + n(C.en_vapor, 2) + ' = ' + n(C.qe, 1) + ' kg/h. La batería trata $4 \\times ' + m(C.m_carga, 0) + '/(' + m(CIC, 1) + '/60)$ = ' + n(C.cascara, 0) + ' kg/h de cáscara.', dur: 1.2,
        ir: function (S) { S.poner(CIC - 0.01); } }
    ]
  });

})();
