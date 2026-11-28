/* Las animaciones por pasos del capítulo 18, «Filtración», del libro, traídas con el mismo código y los mismos
   números para la presentación de filtración y winterización de 2027-10: la torta que crece, la compresibilidad, el
   ciclo de la prensa, el tambor, del montón al poro y la winterización. Es copia de
   libro/figuras/filtracion/actividades.js del repositorio del libro, solo con las animaciones (los retos, con sus
   soluciones, se quedan en el libro), con los datos del caso (datos.js) adelante, los enlaces a las ecuaciones
   llevados a libro.luishreyes.com y los seis cuadros de la diatomita en /classroom/iqya-2031-2027-10/assets/diatomita/.
   No se edita aquí; cuando cambia en el libro se vuelve a copiar. Corre con el motor de
   /classroom/estilo-libro/actividades/. */

// Lo escribe herramientas/filtros.py --json; no se edita a mano.
window.FILTROS = {"ruth":[{"psi":6.7,"dp":46194.8719,"alfa":110672391987.73212,"Rm":64908279589.77171},{"psi":16.2,"dp":111695.06339999998,"alfa":149747442267.28708,"Rm":66788724571.74783},{"psi":28.2,"dp":194432.1474,"alfa":162724262773.30353,"Rm":90674725319.73186},{"psi":36.3,"dp":250279.67909999998,"alfa":176630245809.4048,"Rm":93095065732.57593},{"psi":49.1,"dp":338532.5687,"alfa":188048958302.1267,"Rm":106890560592.69543}],"ruth_s":0.26128956390912883,"ruth_alfa0":6845732726.430912,"ruth_A":0.044,"ruth_c":23.5,"ruth_mu":0.000890022489077689,"ruth_Rm":{"m":153781.29784774483,"b":55525699402.632866},"lodo_g_m3":{"dosis":30.0,"sst_ntu":1.3,"polimero":1.0,"Q":25.0},"lodo":{"kg_d":{"seco":9.18,"medio":24.78,"lluvia":83.28000000000002},"c_lodo":15.0,"c":15.66631809819707,"seco_m3":352.676555100044,"alfa_sin":50000000000000.0,"alfa_con":5000000000000.0,"P_ref":50000.0,"s":0.35,"Rm":100000000000.0,"camara_lado":0.4,"camara_b":0.025,"n":25,"q_bomba":1.0,"t_muerto":1.0,"mu":0.0011375827668372186,"T":15.0,"rho_w":999.0897227230067,"P_trabajo":600000.0,"turno":8.0,"polimero_g_kg":5.0},"ruth_ensayos":[{"V":[0.0005,0.001,0.0015,0.002,0.0025,0.003],"t":[17.3,41.3,72.0,108.3,152.1,201.7],"desde":1,"Kc2":12941333.333333336,"q0inv":28421.999999999993},{"V":[0.0005,0.001,0.0015,0.002,0.0025,0.003,0.0035,0.004],"t":[6.8,19.0,34.6,53.4,76.0,102.0,131.2,163.0],"desde":1,"Kc2":7242006.802721088,"q0inv":12095.323129251701},{"V":[0.0005,0.001,0.0015,0.002,0.0025,0.003,0.0035,0.004,0.0045000000000000005,0.005],"t":[6.3,14.0,24.2,37.0,51.7,69.0,88.8,110.0,134.0,160.0],"desde":1,"Kc2":4520825.396825396,"q0inv":9433.36155202822},{"V":[0.0005,0.001,0.0015,0.002,0.0025,0.003,0.0035,0.004,0.0045000000000000005,0.005,0.0055,0.006],"t":[5.0,11.5,19.8,30.1,42.5,56.8,73.0,91.2,111.0,133.0,156.8,182.5],"desde":1,"Kc2":3812176.3085399447,"q0inv":7524.010232192051},{"V":[0.0005,0.001,0.0015,0.002,0.0025,0.003,0.0035,0.004,0.0045000000000000005,0.005],"t":[4.4,9.5,16.3,24.6,34.7,46.1,59.0,73.6,89.4,107.3],"desde":1,"Kc2":3000571.4285714286,"q0inv":6386.857142857141}],"ayudas_alfa":{"Celite 545":791601535.8032382,"Harborlite 700":3891128901.0297427},"tambor":{"cF":235.47141159721403,"c":308.16671438597473,"dp":67727.8,"alfa":128500834799.46071,"ms":0.1366584342015251,"ms_lb_s":0.30128027550711467,"flux":0.01800547201339656,"A":7.589827920081602,"A_ft2":81.69622781000064,"W_vuelta":5.401641604018968},"tambor_lodo":{"vacio":0.5,"alfa":5000000000000.0,"patm_bogota":73.7,"3mm":{"W":1.0580296653001322,"t_c_h":3.7632060838780834,"rpm":0.004428847715268154,"kg_m2_h":0.2811511359510252,"A_25NTU":3.6724020214517474},"6mm":{"W":2.1160593306002644,"t_c_h":15.052824335512334,"rpm":0.0011072119288170386,"kg_m2_h":0.1405755679755126,"A_25NTU":7.344804042903495},"10mm":{"W":3.5267655510004405,"t_c_h":41.8134009319787,"rpm":0.0003985962943741339,"kg_m2_h":0.08434534078530757,"A_25NTU":12.241340071505823}},"prensa":{"n":25,"A":8.000000000000002,"kg_ciclo":35.26765551000441,"t_h":4.233144534893697,"t_cambio_h":0.6453374164134181,"V":2.2511770340002943,"ciclo_h":5.233144534893697,"ciclos_dia_100":2.3613704624163603,"optimo":{"t_f_h":1.0075067928896289,"W":2.233017472369593,"torta_mm":6.331630044804513,"camara_mm":12.663260089609025,"prod":1.1123337068042303},"t_espesor":{"15":1.4120011889193778,"20":2.5062723293767664,"25":3.9123455085762884,"30":5.630220726517938,"40":10.001377278627636}},"agua":[[0,999.8290303005613,0.0017918181518025765],[1,999.8878854382513,0.001731077958006187],[2,999.9291494476216,0.0016735672557789676],[3,999.9534049833936,0.0016190561890447636],[4,999.9612000499716,0.001567335101674765],[5,999.9530507695008,0.001518212450409505],[6,999.9294438768344,0.001471512963978667],[7,999.8908389726042,0.0014270760158820747],[8,999.8376705617684,0.0013847541830458918],[9,999.7703499014084,0.001344411966562887],[10,999.689266678631,0.0013059246540906323],[11,999.5947905369017,0.0012691773063269016],[12,999.487272467095,0.0012340638523934458],[13,999.3670460771704,0.0012004862810093087],[14,999.2344287532845,0.001168353916081966],[15,999.0897227230067,0.0011375827668372186],[16,998.9332160308157,0.0011080949438865664],[17,998.7651834341997,0.0010798181337287327],[18,998.585887228262,0.001052685125125829],[19,998.3955780055411,0.0010266333816091016],[20,998.1944953571686,0.0010016046550726573],[21,997.9828685207391,0.000977544636023056],[22,997.7609169798628,0.0009544026365813508],[23,997.5288510195866,0.0009321313027939945],[24,997.2868722416353,0.0009106863532094732],[25,997.0351740430319,0.0008900263410270743],[26,996.7739420610712,0.0008701124374298295],[27,996.5033545876224,0.0008509082339812492],[28,996.2235829552712,0.0008323795622003911],[29,995.9347918974926,0.0008144943286361756],[30,995.6371398851327,0.0007972223639434048],[31,995.330779440918,0.0007805352846231287],[32,995.0158574337596,0.0007644063662315467],[33,994.6925153544511,0.0007488104269863538],[34,994.3608895740911,0.000733723720810573],[35,994.021111586612,0.0007191238389516734],[36,993.6733082364958,0.0007049896194012966],[37,993.317601932823,0.0006913010634184443],[38,992.9541108505967,0.0006780392585276763],[39,992.5829491202775,0.0006651863074260207],[40,992.2042270063,0.0006527252622865838]],"limoneno":[[0,860.7920500000001,0.0012458298228120255],[1,859.9990500000001,0.0012264669282975307],[2,859.2060500000001,0.00120754245739165],[3,858.4130500000001,0.0011890438979668403],[4,857.6200500000001,0.0011709591628912299],[5,856.8270500000001,0.0011532765734131533],[6,856.0340500000001,0.0011359848432768791],[7,855.2410500000001,0.0011190730635338962],[8,854.4480500000001,0.0011025306880160085],[9,853.6550500000001,0.0010863475194382943],[10,852.8620500000001,0.0010705136961016556],[11,852.0690500000001,0.0010550196791662971],[12,851.2760500000002,0.0010398562404689638],[13,850.48305,0.0010250144508581768],[14,849.6900500000002,0.0010104856690230483],[15,848.89705,0.0009962615307925289],[16,848.1040500000001,0.0009823339388831086],[17,847.3110500000001,0.0009686950530741276],[18,846.5180500000001,0.0009553372807909208],[19,845.7250500000001,0.0009422532680770114],[20,844.9320500000001,0.0009294358909375198],[21,844.1390500000001,0.0009168782470368525],[22,843.3460500000001,0.0009045736477345851],[23,842.5530500000001,0.0008925156104442396],[24,841.7600500000001,0.0008806978513004383],[25,840.9670500000001,0.000869114278120605],[26,840.1740500000001,0.0008577589836480932],[27,839.3810500000001,0.0008466262390642303],[28,838.5880500000001,0.0008357104877574096],[29,837.7950500000001,0.0008250063393379039],[30,837.00205,0.0008145085638876534],[31,836.2090500000002,0.0008042120864347651],[32,835.41605,0.00079411198164298],[33,834.6230500000001,0.0007842034687068112],[34,833.83005,0.0007744819064434977],[35,833.0370500000001,0.0007649427885733507],[36,832.2440500000001,0.0007555817391804453],[37,831.4510500000001,0.000746394508346005],[38,830.6580500000001,0.0007373769679471705],[39,829.8650500000001,0.000728525107614191],[40,829.0720500000001,0.0007198350308393964]],"winter":{"aceite_kg_h":20.76244550342911,"lote_h":8.0,"hd":1.0,"pall":{"EKS":29,"K 100":146,"K 250":510,"K 900":1700},"t_filtrar":2.0,"reposo":8.0,"T_flor":20.0,"disuelta":[[0,470.67912490224387],[1,479.7301535757317],[2,488.887540172406],[3,498.1515044785575],[4,507.5222571956793],[5,517.0],[6,526.5849256033374],[7,536.2772178152017],[8,546.0770516061094],[9,555.984593172042],[10,566.0000000000001],[11,576.2016190022498],[12,586.5136223529953],[13,596.9361626734167],[14,607.4693839291212],[15,618.113421498557],[16,628.868402242328],[17,639.7344445733638],[18,650.7116585278934],[19,661.8001458371849],[20,673.0],[21,684.3734774337411],[22,695.8601372575695],[23,707.4600624051457],[24,719.1733277139823],[25,730.9999999999997],[26,742.9836712808395],[27,755.0819797772938],[28,767.2949774598295],[29,779.6227084736885],[30,792.0652092152853],[31,804.6225084089991],[32,817.2946271843083],[33,830.081579153266],[34,842.9833704882557],[35,855.9999999999999],[36,869.1314592158132],[37,882.3777324580356],[38,895.7387969226487],[39,909.2146227580226],[40,922.8051731437771]],"libre":500.0,"d_libre":[2e-06,1.6392631578041878e-05],"capacidad":100.0,"zd":{"fino":525,"pulido":850},"mu_w20":0.0010016046550726573}};

/* Las animaciones y los retos del capítulo 18, «Filtración». Se escriben aquí directo (en bombas pasan por el taller
   interactivo/). Usan el motor de figuras/comun/actividades.js y las piezas de figuras/comun/dibujo.js; los colores
   salen de la paleta del libro (ZB.dib.col y PALETA), nunca a mano.
   Los números salen del texto del capítulo y del modelo del caso (datos.js, que escribe herramientas/filtros.py
   --json): los ensayos de Ruth (McCabe, tabla 29.1) con el agua de IAPWS, el lodo de alumbre con su resistencia
   ilustrativa y su compresibilidad, la prensa de 25 cámaras a 6 barg con el agua a 15 °C, el tambor de McCabe y el
   mismo tambor con el lodo, las ayudas de Imerys, y el limoneno de Clará y coautores con el agua disuelta de Li y
   Tamura. Las cuentas son las de filtros.py, con las mismas ecuaciones del capítulo.
   La animación «torta» reemplaza al video de Manim (escenas/libro/torta_ruth.py del público) con sus pasos y sus
   números, con el modelo de herramientas/figura-torta.py, y su último paso se ve como la figura de la torta que crece.
   La animación «diatomita» reemplaza al video de three.js (scripts/animaciones/diatomita/ del público) con un paso
   por cuadro, con los cuadros de herramientas/figura-diatomita.py, y su último paso se ve como la figura del montón al
   poro.
   Un color hace un solo trabajo dentro de cada animación: el caso y el modelo en azul (la primera serie de las
   gráficas); lo que se compara, en oliva (la segunda) y en naranja (la tercera); lo que se toma como referencia, en el
   gris; el punto que se lee, en amarillo; lo que no sirve, en el rojo de alerta; el lodo, la torta, el agua y el aceite
   con su material. */
(function () {
  'use strict';
  var s = ZB.s, D = ZB.dib, K = D.col, n = ZB.num, T = ZB.tramo;
  var PA = window.PALETA, MAT = PA.materiales, GR = PA.graficas;
  var LODO = MAT.suspension.relleno, LODO_M = MAT.suspension.medio, SOL_O = MAT.solido.oscuro, SOL_M = MAT.solido.medio;
  var AGUA = MAT.agua.relleno, AGUA_M = MAT.agua.medio, AGUA_O = MAT.agua.oscuro;
  var ACEITE = MAT.aceite.relleno, ACEITE_M = MAT.aceite.medio, ACEITE_O = MAT.aceite.oscuro;
  var METAL = MAT.metal.relleno, METAL_M = MAT.metal.medio, METAL_O = MAT.metal.oscuro;
  var AZ = K.serie[0], OL = K.serie[1], S3 = K.serie[2], AL = K.alerta, REF = K.ref, TXT = GR.texto;
  var G = 9.80665, BAR = 1e5;

  /* ---------- El caso (datos.js) ---------- */
  var F = window.FILTROS;
  var LO = F.lodo, PR = F.prensa, WI = F.winter;
  function tabla(L, tc) {
    var i = Math.max(0, Math.min(L.length - 2, Math.floor(tc - L[0][0]))), a = L[i], b = L[i + 1], t = tc - a[0];
    return { rho: a[1] + (b[1] - a[1]) * t, mu: Math.exp(Math.log(a[2]) + (Math.log(b[2]) - Math.log(a[2])) * t) };
  }
  function agua(tc) { return tabla(F.agua, tc); }
  function limoneno(tc) { var T_ = tc + 273.15; return { rho: 1077.4 - 0.793 * T_, mu: 0.017e-3 * Math.exp(1173 / T_) }; }   // ec. fil-limoneno
  function disuelta(tc) { var c = WI.disuelta, i = Math.max(0, Math.min(c.length - 2, Math.floor(tc))), f = tc - c[i][0]; return c[i][1] + (c[i + 1][1] - c[i][1]) * f; }

  /* ---------- Piezas ---------- */
  function grupo(padre, op) { return s('g', { opacity: op == null ? 0 : op }, padre); }
  function dTrazo(pts) { return pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(''); }
  function rotado(padre, x, y, txt, o) {
    o = o || {};
    var t = s('text', { x: x, y: y, 'font-size': o.tam || 13, 'font-weight': o.peso || 500, 'text-anchor': 'middle', fill: o.color || K.tinta2, transform: 'rotate(-90 ' + x + ' ' + y + ')' }, padre);
    D.ponerTexto(t, txt);
    return t;
  }
  // Un texto con partes de distinto peso: partes = [[texto, peso], …]; cada parte admite _x y ^{xx}.
  function rico(padre, x, y, partes, o) {
    o = o || {};
    var a = { x: x, y: y, 'font-size': o.tam || 13, 'font-weight': 500, 'text-anchor': o.ancla || 'start', fill: o.color || TXT };
    if (o.halo) a.style = 'paint-order:stroke;stroke:' + K.blanco + ';stroke-width:4px;stroke-linejoin:round';
    var t = s('text', a, padre);
    partes.forEach(function (p) { var w = s('tspan', { 'font-weight': p[1] || 500 }, t); D.ponerTexto(w, p[0]); });
    return t;
  }
  function m(x, d) { return n(x, d).replace(',', '{,}'); }           // un número dentro de $…$
  function cient(x, d) {                                             // 4,80 × 10^{−7}, para el texto de las animaciones
    var e = Math.floor(Math.log10(Math.abs(x))), c = x / Math.pow(10, e);
    if (Math.abs(c) >= 9.995) { c /= 10; e += 1; }
    return n(c, d == null ? 2 : d) + ' × 10^{' + (e < 0 ? '−' + (-e) : e) + '}';
  }
  function cientH(x, d) {                                            // 4,80 × 10⁻⁷, para el texto de los pasos (HTML)
    var e = Math.floor(Math.log10(Math.abs(x))), c = x / Math.pow(10, e), sup = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '−': '⁻' };
    if (Math.abs(c) >= 9.995) { c /= 10; e += 1; }
    return n(c, d == null ? 2 : d) + ' × 10' + String(e < 0 ? '−' + (-e) : e).split('').map(function (ch) { return sup[ch]; }).join('');
  }
  function cientTex(x, d) { var e = Math.floor(Math.log10(Math.abs(x))), c = x / Math.pow(10, e); if (Math.abs(c) >= 9.995) { c /= 10; e += 1; } return m(c, d == null ? 2 : d) + '\\times10^{' + e + '}'; }
  function ver(el, t) { D.ver(el, t); }
  function entre(x, a, b) { return Math.max(a, Math.min(b, x)); }

  /* ================= 18.2 La torta y la tela ================= */

  /* La torta que crece: el ensayo V de Ruth a 338,5 kPa, con 440 cm² y 23,5 g/L (ejemplo fil-ruth). La hoja en corte, la
     presión del líquido y la de los sólidos, y la recta de t/V contra V; el dibujo es el de herramientas/figura-torta.py,
     con la torta incompresible del video y de la figura: a V litros, la torta se lleva K_p·V/(K_p·V + B) de la caída. */
  var RU = F.ruth_ensayos[4], RU5 = F.ruth[4];
  var TO = (function () {
    var pend = RU.Kc2 * 1e-6, ord = RU.q0inv * 1e-3, Kp = 2 * pend;             // s/L², s/L
    var Vs = [0].concat(RU.V.map(function (v) { return v * 1000; })), ts = [0].concat(RU.t);
    function vDe(t) { for (var i = 1; i < ts.length; i++) if (t <= ts[i]) return Vs[i - 1] + (Vs[i] - Vs[i - 1]) * (t - ts[i - 1]) / (ts[i] - ts[i - 1]); return Vs[Vs.length - 1]; }
    function parte(v) { return Kp * v / (Kp * v + ord); }
    return { pend: pend, ord: ord, Kp: Kp, vDe: vDe, parte: parte, V: Vs.slice(1), t: ts.slice(1), dp: RU5.dp / 1000, alfa: RU5.alfa, Rm: RU5.Rm,
      tfin: ts[ts.length - 1], vfin: Vs[Vs.length - 1], f1: parte(0.5), ffin: parte(Vs[Vs.length - 1]) };
  })();

  ZB.animacion('torta', {
    vista: [0, 0, 720, 400],
    alt: 'A la izquierda, una celda de ensayo en corte con el lodo de carbonato arriba, la torta que crece sobre la tela y la probeta que se llena de filtrado; al lado, la presión del líquido, que cae a través de la torta y de la tela, y la de los sólidos, que crece hacia la tela. A la derecha, los puntos de t/V contra V que salen cada medio litro, la recta de mínimos cuadrados sin el primero, su ordenada, que es la tela, y su pendiente, que es la torta. El último paso es la figura de la torta que crece.',
    montar: function (svg) {
      var S = {};
      var CX0 = 78, CX1 = 188, YT = 30, YK = 196, YK2 = 208, HMAX = 56, CX = (CX0 + CX1) / 2;
      var PX0 = CX - 26, PX1 = CX + 26, PY0 = 268, PY1 = 352, NIVMAX = 40;     // 40 px de filtrado con 5 L, como en la figura
      var QX0 = 222, QX1 = 352, GX0 = 448, GX1 = 708, GY0 = 30, GY1 = 352, VMAX = 6, TVMAX = 30, VA = 3.0, VB = 4.5;
      var Q = function (p) { return QX0 + p / TO.dp * (QX1 - QX0); };
      var X = function (v) { return GX0 + v / VMAX * (GX1 - GX0); }, Y = function (tv) { return GY1 - tv / TVMAX * (GY1 - GY0); };
      // la celda: el lodo, sus partículas sueltas (la semilla fija de la figura), la torta y sus granos, la tela
      S.lodo = s('rect', { x: CX0, y: YT, width: CX1 - CX0, height: YK - YT, fill: LODO }, svg);
      var sem = 7; function azar() { sem = (sem * 16807) % 2147483647; return sem / 2147483647; }
      S.part = [];
      for (var i = 0; i < 46; i++) { var px = CX0 + 5 + azar() * (CX1 - CX0 - 10), py = YT + 6 + azar() * (140 - YT - 12); S.part.push({ y: py, c: s('circle', { cx: px.toFixed(1), cy: py.toFixed(1), r: 1.5, fill: SOL_O }, svg) }); }
      S.torta = s('rect', { x: CX0, y: YK, width: CX1 - CX0, height: 0, fill: LODO_M }, svg);
      S.gr = [];
      for (var fila = 0, y = YK - 3.5; y > 140 + 2; fila++, y -= 6.2)
        for (var x = CX0 + 3.5 + (fila % 2) * 3.5; x < CX1 - 2; x += 7) S.gr.push({ y: y, c: s('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: 2.3, fill: SOL_O, opacity: 0 }, svg) });
      s('rect', { x: CX0, y: YK, width: CX1 - CX0, height: YK2 - YK, fill: METAL }, svg);
      s('path', { d: 'M' + CX0 + ' ' + (YK + YK2) / 2 + 'H' + CX1, stroke: K.tinta2, 'stroke-width': 2, 'stroke-dasharray': '2 2' }, svg);
      s('path', { d: 'M' + CX0 + ' ' + (YT - 8) + 'V' + (YK2 + 4) + 'L' + (CX - 6) + ' ' + (YK2 + 30) + 'V' + (YK2 + 46) + 'M' + CX1 + ' ' + (YT - 8) + 'V' + (YK2 + 4) + 'L' + (CX + 6) + ' ' + (YK2 + 30) + 'V' + (YK2 + 46), fill: 'none', stroke: TXT, 'stroke-width': 2.2 }, svg);
      S.filt = s('rect', { x: PX0, y: PY1, width: PX1 - PX0, height: 0, fill: AGUA }, svg);
      s('path', { d: 'M' + PX0 + ' ' + PY0 + 'V' + PY1 + 'H' + PX1 + 'V' + PY0, fill: 'none', stroke: TXT, 'stroke-width': 2 }, svg);
      S.gota = s('circle', { cx: CX, cy: YK2 + 50, r: 2.4, fill: AGUA_O, opacity: 0 }, svg);
      D.t(svg, CX0 - 8, (YT + 140) / 2 + 5, 'lodo', { tam: 13, ancla: 'end', color: K.tinta2 });
      D.t(svg, CX0 - 8, YK2 + 2, 'tela', { tam: 13, ancla: 'end', color: K.tinta2 });
      D.t(svg, PX0 - 8, (PY1 - NIVMAX + PY1) / 2 + 5, 'filtrado', { tam: 13, ancla: 'end', color: K.tinta2 });
      S.rTorta = D.t(svg, CX0 - 8, 173, 'torta', { tam: 13, ancla: 'end', color: K.tinta2 });
      // la presión al lado
      S.guias = [0, 1, 2].map(function () { return s('line', { x1: CX1, x2: QX1 + 6, stroke: K.rejilla, 'stroke-width': 1, 'stroke-dasharray': '3 3' }, svg); });
      S.guias[1].setAttribute('y1', YK); S.guias[1].setAttribute('y2', YK); S.guias[2].setAttribute('y1', YK2); S.guias[2].setAttribute('y2', YK2);
      s('path', { d: 'M' + QX0 + ' ' + YT + 'V' + (YK2 + 14) + 'H' + (QX1 + 6) + 'M' + QX1 + ' ' + (YK2 + 14) + 'v-5', fill: 'none', stroke: K.eje, 'stroke-width': 1 }, svg);
      D.t(svg, QX0, YK2 + 32, '0', { tam: 13, ancla: 'middle', color: K.tinta2 });
      D.t(svg, QX1, YK2 + 32, n(TO.dp, 1) + ' kPa', { tam: 13, ancla: 'middle', color: K.tinta2 });
      D.t(svg, (QX0 + QX1) / 2, YK2 + 52, 'presión', { tam: 13, ancla: 'middle', color: K.tinta2 });
      S.liq = s('path', { d: '', fill: 'none', stroke: TXT, 'stroke-width': 2.6 }, svg);
      S.sol = s('path', { d: '', fill: 'none', stroke: OL, 'stroke-width': 2.4, 'stroke-dasharray': '7 4' }, svg);
      D.t(svg, Q(TO.dp) - 8, YT + 22, 'líquido', { tam: 13, peso: 600, ancla: 'end', color: TXT, halo: K.blanco });
      S.rSol = D.t(svg, Q(0) + 8, 132, 'sólidos', { tam: 13, peso: 600, color: OL, halo: K.blanco });
      // lo que se lee
      S.lt = rico(svg, QX0, 296, [['t', 600], [' = ', 500]], { color: K.tinta2 }); S.ltv = s('tspan', {}, S.lt);
      S.lv = rico(svg, QX0, 316, [['V', 600], [' = ', 500]], { color: K.tinta2 }); S.lvv = s('tspan', {}, S.lv);
      S.lf = D.t(svg, QX0, 336, '', { tam: 13, color: K.tinta2 });
      // la gráfica de t/V contra V
      var g = s('g', {}, svg);
      for (var v = 1; v <= 6; v++) s('line', { x1: X(v), x2: X(v), y1: GY0, y2: GY1, stroke: K.rejilla, 'stroke-width': 1 }, g);
      [5, 10, 15, 20, 25, 30].forEach(function (tv) { s('line', { x1: GX0, x2: GX1, y1: Y(tv), y2: Y(tv), stroke: K.rejilla, 'stroke-width': 1 }, g); });
      s('path', { d: 'M' + GX0 + ' ' + GY0 + 'V' + GY1 + 'H' + GX1, fill: 'none', stroke: K.eje, 'stroke-width': 1 }, g);
      for (v = 0; v <= 6; v++) D.t(g, X(v), GY1 + 18, String(v), { tam: 13, ancla: 'middle', color: K.tinta2 });
      [0, 5, 10, 15, 20, 25, 30].forEach(function (tv) { D.t(g, GX0 - 8, Y(tv) + 5, String(tv), { tam: 13, ancla: 'end', color: K.tinta2 }); });
      D.t(g, (GX0 + GX1) / 2, GY1 + 40, 'volumen de filtrado, V (L)', { tam: 13, ancla: 'middle', color: K.tinta2 });
      rotado(g, GX0 - 36, (GY0 + GY1) / 2, 't/V (s/L)', { tam: 13 });
      S.recta = D.trazo(svg, 'M' + X(0) + ' ' + Y(TO.ord).toFixed(1) + 'L' + X(VMAX) + ' ' + Y(TO.ord + TO.pend * VMAX).toFixed(1), { color: AZ, ancho: 2.4 });
      S.pts = TO.V.map(function (vv, k) {
        return { t: TO.t[k], c: s('circle', { cx: X(vv).toFixed(1), cy: Y(TO.t[k] / vv).toFixed(1), r: 4, fill: k === 0 ? K.blanco : TXT, stroke: k === 0 ? TXT : 'none', 'stroke-width': 1.4, opacity: 0 }, svg) };
      });
      // la pendiente: la torta
      var ya = TO.ord + TO.pend * VA, yb = TO.ord + TO.pend * VB;
      S.tri = grupo(svg);
      s('path', { d: 'M' + X(VA).toFixed(1) + ' ' + Y(ya).toFixed(1) + 'H' + X(VB).toFixed(1) + 'V' + Y(yb).toFixed(1), fill: 'none', stroke: OL, 'stroke-width': 1.6 }, S.tri);
      D.t(S.tri, (X(VA) + X(VB)) / 2, Y(ya) + 18, n(VB - VA, 1) + ' L', { tam: 13, peso: 600, ancla: 'middle', color: OL, halo: K.blanco });
      D.t(S.tri, X(VB) + 6, (Y(ya) + Y(yb)) / 2 + 5, n(TO.pend * (VB - VA), 2) + ' s/L', { tam: 13, peso: 600, color: OL, halo: K.blanco });
      S.lTorta = grupo(svg);
      rico(S.lTorta, GX0 + 12, GY0 + 22, [['la torta:', 600], [' μαc/(2A^{2}Δp) = ' + n(TO.pend, 2) + ' s/L^{2}', 500]]);
      D.t(S.lTorta, GX0 + 12, GY0 + 42, 'α = ' + cient(TO.alfa) + ' m/kg', { tam: 13, color: TXT });
      // la ordenada: la tela
      S.lTela = grupo(svg);
      s('path', { d: 'M' + X(1.0).toFixed(1) + ' ' + (Y(TO.ord) + 24).toFixed(1) + 'L' + (X(0) + 9).toFixed(1) + ' ' + (Y(TO.ord) + 4).toFixed(1), fill: 'none', stroke: TXT, 'stroke-width': 1.2 }, S.lTela);
      rico(S.lTela, X(1.1), Y(TO.ord) + 30, [['la tela:', 600], [' μR_m/(AΔp) = ' + n(TO.ord, 2) + ' s/L', 500]]);
      D.t(S.lTela, X(1.1), Y(TO.ord) + 50, 'R_m = ' + cient(TO.Rm) + ' m^{−1}', { tam: 13, color: TXT });
      S.pOrd = grupo(svg); D.punto(S.pOrd, X(0), Y(TO.ord), { r: 5.5 });
      S.ir = function (t) {                    // el estado del ensayo a los t segundos
        var v = TO.vDe(t), h = HMAX * v / TO.vfin, cara = YK - h, f = v > 0 ? TO.parte(v) : 0;
        S.lodo.setAttribute('height', (cara - YT).toFixed(1));
        S.part.forEach(function (p) { p.c.setAttribute('opacity', p.y < cara - 2 ? 1 : 0); });
        S.torta.setAttribute('y', cara.toFixed(1)); S.torta.setAttribute('height', h.toFixed(1));
        S.gr.forEach(function (p) { p.c.setAttribute('opacity', p.y - 2.3 > cara - 0.5 ? 0.75 : 0); });
        S.filt.setAttribute('y', (PY1 - NIVMAX * v / TO.vfin).toFixed(1)); S.filt.setAttribute('height', (NIVMAX * v / TO.vfin).toFixed(1));
        S.rTorta.setAttribute('y', ((cara + YK) / 2 + 5).toFixed(1)); ver(S.rTorta, entre((h - 22) / 10, 0, 1));
        S.guias[0].setAttribute('y1', cara.toFixed(1)); S.guias[0].setAttribute('y2', cara.toFixed(1)); ver(S.guias[0], h > 2 ? 1 : 0);
        var pTela = TO.dp * (1 - f);
        S.liq.setAttribute('d', 'M' + Q(TO.dp).toFixed(1) + ' ' + YT + 'V' + cara.toFixed(1) + 'L' + Q(pTela).toFixed(1) + ' ' + YK + 'L' + Q(0).toFixed(1) + ' ' + YK2);
        S.sol.setAttribute('d', h > 1 ? 'M' + Q(0).toFixed(1) + ' ' + cara.toFixed(1) + 'L' + Q(TO.dp * f).toFixed(1) + ' ' + YK : '');
        S.rSol.setAttribute('y', (cara - 8).toFixed(1));
        D.ponerTexto(S.ltv, n(t, 1) + ' s'); D.ponerTexto(S.lvv, n(v, 2) + ' L');
        D.ponerTexto(S.lf, 'torta: ' + n(100 * f, 0) + ' % de Δp');
        S.pts.forEach(function (p) { p.c.setAttribute('opacity', t >= p.t - 1e-6 ? 1 : 0); });
        var fase = (t * 0.9) % 1;
        S.gota.setAttribute('cy', (YK2 + 50 + fase * (PY1 - NIVMAX * v / TO.vfin - YK2 - 54)).toFixed(1));
      };
      return S;
    },
    pasos: [
      { texto: 'Una hoja de 440 cm² de tela en la suspensión de carbonato de calcio, a ' + n(TO.dp, 1) + ' kPa constantes: el ensayo V de Ruth. Al empezar no hay torta, y toda la caída de presión está en la tela. En los dos términos de la <a href="https://libro.luishreyes.com/filtracion.html#eq-fil-torta" target="_blank" rel="noopener">ecuación de la filtración</a>, la torta se lleva $K_pV/(K_pV + B)$ de la caída. A los ' + n(TO.t[0], 1) + ' s ya pasó medio litro, y la torta, todavía delgada, se lleva ' + n(100 * TO.f1, 0) + ' %.', dur: 2.4,
        ir: function (S, t) { S.ir(TO.t[0] * t); ver(S.gota, t < 1 ? 1 : 0); ver(S.rSol, 0); ver(S.sol, 0); S.recta.dibujar(0); [S.tri, S.lTorta, S.lTela, S.pOrd].forEach(function (g) { ver(g, 0); }); } },
      { texto: 'Cada litro de filtrado deja ' + n(F.ruth_c, 1) + ' g de carbonato sobre la tela, y la torta crece en proporción al filtrado. Con ella crece su parte de la caída, y el filtrado sale cada vez más despacio. La presión del líquido cae a través de la torta, y lo que pierde el líquido lo ganan los sólidos, que se aprietan contra la tela. A los ' + n(TO.tfin, 1) + ' s han salido ' + n(TO.vfin, 2) + ' L, y la torta se lleva ' + n(100 * TO.ffin, 0) + ' % de la caída. Cada medio litro da un punto de $t/V$ contra $V$.', dur: 4,
        ir: function (S, t) { S.ir(TO.t[0] + (TO.tfin - TO.t[0]) * t); ver(S.gota, t < 1 ? 1 : 0); ver(S.rSol, T(t, 0, 0.2)); ver(S.sol, T(t, 0, 0.2)); } },
      { texto: 'Los puntos caen en una recta, la <a href="https://libro.luishreyes.com/filtracion.html#eq-fil-ruth" target="_blank" rel="noopener">recta de Ruth</a>, $t/V = (K_p/2)\\,V + B$. El primero, hueco, queda fuera del ajuste: los primeros segundos son los de más error. La recta de mínimos cuadrados con los otros nueve es $t/V$ = ' + n(TO.pend, 2) + ' $V$ + ' + n(TO.ord, 2) + ', en s/L con $V$ en litros.', dur: 1.8,
        ir: function (S, t) { ver(S.gota, 0); S.recta.dibujar(T(t, 0, 0.9)); } },
      { texto: 'La ordenada es la tela: $B = \\mu R_m/(A\\,\\Delta p)$ = ' + n(TO.ord, 2) + ' s/L, ' + n(Math.round(TO.ord * 100) * 10, 0) + ' s/m³. Con el agua a 25 °C, de ' + n(F.ruth_mu * 1000, 3) + ' mPa·s, $R_m = A\\,\\Delta p\\,B/\\mu$ = 0,044 × 338 500 × ' + n(Math.round(TO.ord * 100) * 10, 0) + '/(' + n(F.ruth_mu * 1000, 3) + ' × 10⁻³) = ' + cientH(TO.Rm) + ' m⁻¹, el extremo alto de las telas. La ordenada es la que peor se mide.', dur: 1.6,
        ir: function (S, t) { ver(S.pOrd, T(t, 0, 0.4)); ver(S.lTela, T(t, 0.3, 0.8)); } },
      { texto: 'La pendiente es la torta: entre 3,0 y 4,5 L, $t/V$ sube ' + n(TO.pend * 1.5, 2) + ' s/L, así que $K_p/2$ = ' + n(TO.pend, 2) + ' s/L² = ' + n(TO.pend, 2) + ' × 10⁶ s/m⁶. Con $\\alpha = 2A^2\\Delta p\\,(K_p/2)/(\\mu c)$, la torta resiste ' + cientH(TO.alfa) + ' m/kg. Es la <a href="https://libro.luishreyes.com/filtracion.html#fig-fil-torta" target="_blank" rel="noopener">figura de la torta que crece</a>.', dur: 1.8,
        ir: function (S, t) { ver(S.tri, T(t, 0, 0.5)); ver(S.lTorta, T(t, 0.4, 0.9)); } }
    ]
  });

  /* ================= 18.3 Cuando la torta se aprieta ================= */

  /* La resistencia contra la presión en log-log: los cinco ensayos de Ruth, su recta de s = 0,26, lo que compra la
     presión con s = 0 y s = 1, el lodo del caso con y sin polímero y las ayudas filtrantes (ecs. fil-alfa y fil-ruth;
     ejemplo fil-lodo-alfa). Los ejes y los rótulos son los de la figura de la resistencia contra la presión. */
  var CP = (function () {
    var s_ = F.ruth_s, a0 = F.ruth_alfa0, aref = a0 * Math.pow(BAR, s_);
    function lodo(p, acond) { return (acond ? LO.alfa_con : LO.alfa_sin) * Math.pow(p / LO.P_ref, LO.s); }
    return { s: s_, a0: a0, aref: aref, lodo: lodo, a6: lodo(LO.P_trabajo, true), ce: F.ayudas_alfa['Celite 545'], ha: F.ayudas_alfa['Harborlite 700'],
      ahorro: 1 - Math.pow(2, s_ - 1), rapido: Math.pow(LO.P_trabajo / LO.P_ref, 1 - LO.s), rapido08: Math.pow(LO.P_trabajo / LO.P_ref, 0.2) };
  })();

  ZB.animacion('compresibilidad', {
    vista: [0, 0, 720, 420],
    alt: 'La resistencia específica contra la caída de presión, en escalas logarítmicas. Aparecen los cinco ensayos de Ruth y su recta de pendiente 0,26; dos guías por 1 bar, una horizontal para una torta rígida y otra de pendiente 1, con la que la presión no cambia el tiempo; el lodo de alumbre del caso con polímero, con su punto a 6 bar, y sin polímero, diez veces más arriba; y la diatomita y la perlita, horizontales y muy abajo. El último paso es la figura de la resistencia contra la presión.',
    montar: function (svg) {
      var S = {}, x0 = 90, y0 = 20, w = 540, h = 340, la = 4, lb = 6.3, ya = 8, yb = 15;
      var X = function (p) { return x0 + (Math.log10(p) - la) / (lb - la) * w; }, Y = function (a) { return y0 + h - (Math.log10(a) - ya) / (yb - ya) * h; };
      var g = s('g', {}, svg);
      [1e4, 1e5, 1e6].forEach(function (p) { s('line', { x1: X(p), x2: X(p), y1: y0, y2: y0 + h, stroke: K.rejilla, 'stroke-width': 1 }, g); });
      for (var e = ya; e <= yb; e++) s('line', { x1: x0, x2: x0 + w, y1: Y(Math.pow(10, e)), y2: Y(Math.pow(10, e)), stroke: K.rejilla, 'stroke-width': 1 }, g);
      s('path', { d: 'M' + x0 + ' ' + y0 + 'V' + (y0 + h) + 'H' + (x0 + w), fill: 'none', stroke: K.eje, 'stroke-width': 1 }, g);
      [[1e4, '0,1'], [1e5, '1'], [1e6, '10 bar']].forEach(function (q) { D.t(g, X(q[0]), y0 + h + 20, q[1], { tam: 13, ancla: 'middle', color: K.tinta2 }); });
      for (e = ya; e <= yb; e++) D.t(g, x0 - 8, Y(Math.pow(10, e)) + 5, '10^{' + e + '}', { tam: 13, ancla: 'end', color: K.tinta2 });
      D.t(g, x0 + w / 2, y0 + h + 44, 'caída de presión en la torta, escala logarítmica', { tam: 13, ancla: 'middle', color: K.tinta2 });
      rotado(g, x0 - 56, y0 + h / 2, 'resistencia específica α, m/kg', { tam: 13 });
      var pa = 0.3e5, pb = 15e5;
      function linea(f, p1, p2) { var pts = []; for (var i = 0; i <= 20; i++) { var p = p1 * Math.pow(p2 / p1, i / 20); pts.push([X(p), Y(f(p))]); } return dTrazo(pts); }
      // las guías de s = 0 y s = 1 por 1 bar
      S.guias = grupo(svg);
      s('path', { d: linea(function () { return CP.aref; }, 2e4, 2e6), fill: 'none', stroke: REF, 'stroke-width': 1.4, 'stroke-dasharray': '4 4' }, S.guias);
      s('path', { d: linea(function (p) { return CP.aref * p / BAR; }, 2e4, 2e6), fill: 'none', stroke: REF, 'stroke-width': 1.4, 'stroke-dasharray': '4 4' }, S.guias);
      D.t(S.guias, X(2e6) - 4, Y(CP.aref) + 18, 's = 0: el tiempo baja con la presión', { tam: 13, ancla: 'end', color: K.tinta2, halo: K.blanco });
      D.t(S.guias, X(2e6) - 30, Y(CP.aref * 20) - 10, 's = 1: el tiempo no cambia', { tam: 13, ancla: 'end', color: K.tinta2, halo: K.blanco });
      // el lodo del caso
      S.sin = D.trazo(svg, linea(function (p) { return CP.lodo(p, false); }, pa, pb), { color: AL, ancho: 2.2, guion: '8 5' });
      S.con = D.trazo(svg, linea(function (p) { return CP.lodo(p, true); }, pa, pb), { color: AZ, ancho: 2.4 });
      S.lLodo = grupo(svg);
      D.t(S.lLodo, X(1.2e4), Y(LO.alfa_sin * Math.pow(0.3, LO.s)) - 44, 'lodo de alumbre sin acondicionar', { tam: 13, color: AL });
      D.t(S.lLodo, X(1.2e4), Y(LO.alfa_con * Math.pow(0.3, LO.s)) - 30, 'lodo con polímero', { tam: 13, color: AZ });
      S.pBuch = grupo(svg); s('circle', { cx: X(LO.P_ref), cy: Y(LO.alfa_con), r: 4.5, fill: K.blanco, stroke: AZ, 'stroke-width': 1.6 }, S.pBuch);
      D.t(S.pBuch, X(LO.P_ref) + 8, Y(LO.alfa_con) + 18, 'Buchner, 0,5 bar', { tam: 13, color: AZ, halo: K.blanco });
      S.p6 = grupo(svg); D.punto(S.p6, X(LO.P_trabajo), Y(CP.a6), { r: 5 });
      D.t(S.p6, X(LO.P_trabajo) + 4, Y(CP.a6) + 26, '6 bar: ' + cient(CP.a6, 1), { tam: 13, peso: 600, ancla: 'middle', halo: K.blanco });
      // Ruth
      S.ruth = D.trazo(svg, linea(function (p) { return CP.a0 * Math.pow(p, CP.s); }, 3e4, 6e5), { color: REF, ancho: 2 });
      S.lRuth = grupo(svg); D.t(S.lRuth, X(1.2e4), Y(CP.a0 * Math.pow(3e4, CP.s)) - 12, 'carbonato de Ruth', { tam: 13, color: K.tinta2 });
      S.pts = F.ruth.map(function (c) { return s('circle', { cx: X(c.dp), cy: Y(c.alfa), r: 4, fill: K.blanco, stroke: TXT, 'stroke-width': 1.4, opacity: 0 }, svg); });
      S.pRef = grupo(svg); D.punto(S.pRef, X(BAR), Y(CP.aref), { r: 4.5, color: TXT, borde: TXT });
      D.t(S.pRef, X(BAR) - 8, Y(CP.aref) + 22, '1 bar: ' + cient(CP.aref), { tam: 13, peso: 600, ancla: 'end', halo: K.blanco });
      // las ayudas
      S.ayu = grupo(svg);
      s('path', { d: linea(function () { return CP.ce; }, pa, pb), fill: 'none', stroke: OL, 'stroke-width': 2.4 }, S.ayu);
      s('path', { d: linea(function () { return CP.ha; }, pa, pb), fill: 'none', stroke: OL, 'stroke-width': 2.4, 'stroke-dasharray': '7 5' }, S.ayu);
      D.t(S.ayu, X(1.2e4), Y(CP.ha) - 8, 'perlita, Harborlite 700', { tam: 13, color: OL });
      D.t(S.ayu, X(1.2e4), Y(CP.ce) + 20, 'diatomita, Celite 545', { tam: 13, color: OL });
      return S;
    },
    pasos: [
      { texto: 'Cada ensayo de Ruth da su $\\alpha$ con su recta: ' + F.ruth.map(function (c) { return cientH(c.alfa) + ' m/kg a ' + n(c.dp / 1000, 0) + ' kPa'; }).join('; ') + '. En escalas logarítmicas, la resistencia de la torta sube con la caída de presión.', dur: 2,
        ir: function (S, t) { S.pts.forEach(function (c, i) { ver(c, T(t, i * 0.15, i * 0.15 + 0.3)); }); S.ruth.dibujar(0); S.sin.dibujar(0); S.con.dibujar(0); [S.lRuth, S.pRef, S.guias, S.lLodo, S.pBuch, S.p6, S.ayu].forEach(function (g) { ver(g, 0); }); } },
      { texto: 'Los cinco puntos caen en una recta de pendiente $s$ = ' + n(CP.s, 2) + ': es la <a href="https://libro.luishreyes.com/filtracion.html#eq-fil-alfa" target="_blank" rel="noopener">ley de compresibilidad</a>, $\\alpha = \\alpha_{ref}(\\Delta p/\\Delta p_{ref})^s$, con $\\alpha_{ref}$ = ' + cientH(CP.aref) + ' m/kg a 1 bar. Escrita como $\\alpha_0\\,\\Delta p^{\\,s}$ con la presión en pascales, la misma ley lleva $\\alpha_0$ = ' + cientH(CP.a0, 1) + ', una constante con la unidad de presión escondida.', dur: 1.8,
        ir: function (S, t) { S.ruth.dibujar(T(t, 0, 0.7)); ver(S.lRuth, T(t, 0.4, 0.8)); ver(S.pRef, T(t, 0.6, 1)); } },
      { texto: 'El tiempo para filtrar un volumen dado va como $\\alpha/\\Delta p$, es decir, como $\\Delta p^{\\,s-1}$. Una torta rígida, con $s$ = 0, sigue la horizontal: doblar la presión ahorra la mitad del tiempo. Con $s$ = 1 la resistencia sube tanto como la presión, y el tiempo no cambia. El carbonato de Ruth, con $s$ = ' + n(CP.s, 2) + ', ahorra $1 - 2^{' + m(CP.s - 1, 2) + '}$ = ' + n(100 * CP.ahorro, 0) + ' % al doblar la presión.', dur: 1.6,
        ir: function (S, t) { ver(S.guias, T(t, 0, 0.6)); } },
      { texto: 'El lodo del caso, con polímero: $5 \\times 10^{12}$ m/kg en un ensayo de Buchner a 0,5 bar (ilustrativo), con el $s$ = ' + n(LO.s, 2) + ' de los hidróxidos. A 6 bar, $\\alpha = 5\\times10^{12}\\,(6/0{,}5)^{0{,}35}$ = ' + cientH(CP.a6) + ' m/kg: doce veces la presión y ' + n(Math.pow(12, LO.s), 1) + ' veces la resistencia, así que el filtrado sale ' + n(CP.rapido, 1) + ' veces más rápido, y no 12; con $s$ = 0,8 saldría ' + n(CP.rapido08, 1) + ' veces más rápido. Sin polímero, en rojo, resiste diez veces más.', dur: 2.2,
        ir: function (S, t) { ver(S.guias, 1 - T(t, 0, 0.3)); S.con.dibujar(T(t, 0.1, 0.6)); ver(S.pBuch, T(t, 0.1, 0.4)); ver(S.p6, T(t, 0.5, 0.8)); S.sin.dibujar(T(t, 0.6, 1)); ver(S.lLodo, T(t, 0.7, 1)); } },
      { texto: 'Las ayudas filtrantes casi no se aprietan y se dibujan rígidas: la diatomita Celite 545 resiste ' + cientH(CP.ce, 1) + ' m/kg, y la perlita Harborlite 700, ' + cientH(CP.ha, 1) + '. El lodo acondicionado, a 0,5 bar, resiste unas ' + n(Math.round(LO.alfa_con / CP.ce / 100) * 100, 0) + ' veces lo que la Celite. Es la <a href="https://libro.luishreyes.com/filtracion.html#fig-fil-alfa" target="_blank" rel="noopener">figura de la resistencia contra la presión</a>.', dur: 1.6,
        ir: function (S, t) { ver(S.ayu, T(t, 0, 0.6)); } }
    ]
  });

  /* ================= 18.4 La prensa y su ciclo ================= */

  /* El llenado de la prensa del caso: la bomba a caudal constante hasta 6 barg y después la presión constante (ecs.
     fil-caudal y fil-desde, ejemplo fil-prensa), con el llenado de filtros.py; el ciclo con su hora muerta, la
     producción media y el óptimo de la ec. fil-optimo, y el caso de 25 mm que cabe en un turno. */
  function llenado(A, b, dpMax, qb, sv, acond) {
    var mu = LO.mu, c = LO.c, W = LO.seco_m3 * b / 2, Vf = W * A / c, nn = 300, dV = Vf / nn, t = 0, pts = [[0, 0, 0, qb]], tc = null, q = qb / 3600;
    var a0 = acond ? LO.alfa_con : LO.alfa_sin;
    function alfa(p) { return a0 * Math.pow(p / LO.P_ref, sv); }
    for (var k = 0; k < nn; k++) {
      var Vm = (k + 0.5) * dV, p = 1e4, qq;
      for (var it = 0; it < 40; it++) p = mu * q * (alfa(p) * c * Vm / A + LO.Rm) / A;
      if (p <= dpMax) qq = q; else { p = dpMax; qq = A * dpMax / (mu * (alfa(dpMax) * c * Vm / A + LO.Rm)); if (tc === null) tc = t; }
      t += dV / qq;
      pts.push([t / 3600, (k + 1) * dV, p / BAR, qq * 3600]);
    }
    return { t: t / 3600, tc: (tc === null ? t : tc) / 3600, pts: pts, V: Vf };
  }
  var CI = (function () {
    var A = PR.A, b = LO.camara_b, P = LO.P_trabajo, mu = LO.mu, c = LO.c, a6 = LO.alfa_con * Math.pow(P / LO.P_ref, LO.s);
    var L = llenado(A, b, P, LO.q_bomba, LO.s, true);
    var vf = LO.q_bomba / 3600 / A, a0 = LO.alfa_con / Math.pow(LO.P_ref, LO.s), dpm = mu * vf * LO.Rm, Kr = mu * vf * vf * c * a0;
    var Kp2 = mu * a6 * c / (2 * A * A * P), B = mu * LO.Rm / (A * P), tm = LO.t_muerto * 3600;
    var tf = tm + B * Math.sqrt(tm / Kp2), Vo = (-B + Math.sqrt(B * B + 4 * Kp2 * tf)) / (2 * Kp2);
    var k6 = 0; while (L.pts[k6][2] < P / BAR - 1e-9) k6++;            // el primer punto del llenado a la presión de trabajo
    var V1 = L.pts[k6][1], tc6 = L.pts[k6][0];
    var t1a = Math.pow(P - dpm, 1 - LO.s) / Kr;
    return { L: L, A: A, vf: vf, a0: a0, dpm: dpm, Kr: Kr, tc6: tc6, tA: t1a + Kp2 * (L.V * L.V - V1 * V1), t1: Math.pow(P - dpm, 1 - LO.s) / Kr, Kp2: Kp2, B: B, tf: tf, Vo: Vo, V1: V1,
      tC: (t1a + Kp2 * (L.V * L.V - V1 * V1)) / 3600,            // el llenado del ejemplo, con las ecuaciones del texto
      prod: L.V / ((t1a + Kp2 * (L.V * L.V - V1 * V1)) / 3600 + LO.t_muerto), prodO: Vo / (tf / 3600 + LO.t_muerto), qfin: L.pts[L.pts.length - 1][3],
      tpc: function (V) { return (Kp2 * V * V + B * V) / 3600; } };
  })();

  ZB.animacion('ciclo', {
    vista: [0, 0, 720, 380],
    alt: 'A la izquierda, tres cámaras de la prensa en corte, con la torta que crece desde las dos telas, la bomba y el manómetro de la entrada. A la derecha, el filtrado contra el tiempo: una recta mientras la bomba da su caudal constante hasta 6 barg, y después una curva que se aplana a presión constante hasta que las cámaras se llenan a las 4,2 h. Luego la hora muerta, la recta de la producción media del ciclo, la tangente del ciclo óptimo y la banda de lo que cabe en un turno.',
    montar: function (svg) {
      var S = {};
      // las cámaras
      var KX0 = 40, KY0 = 96, KY1 = 266, PL = 10, NK = 3, AK = 50;
      var gk = s('g', {}, svg);
      for (var i = 0; i <= NK; i++) s('rect', { x: KX0 + i * (AK + PL), y: KY0 - 8, width: PL, height: KY1 - KY0 + 16, fill: METAL, stroke: TXT, 'stroke-width': 1 }, gk);
      S.cam = [];
      for (i = 0; i < NK; i++) {
        var x = KX0 + PL + i * (AK + PL);
        s('rect', { x: x, y: KY0, width: AK, height: KY1 - KY0, fill: LODO }, gk);
        S.cam.push({ x: x, a: s('rect', { x: x, y: KY0, width: 0, height: KY1 - KY0, fill: SOL_M }, gk), b: s('rect', { x: x + AK, y: KY0, width: 0, height: KY1 - KY0, fill: SOL_M }, gk) });
        s('line', { x1: x + 1, x2: x + 1, y1: KY0, y2: KY1, stroke: K.tinta2, 'stroke-width': 1.4, 'stroke-dasharray': '2 2' }, gk);
        s('line', { x1: x + AK - 1, x2: x + AK - 1, y1: KY0, y2: KY1, stroke: K.tinta2, 'stroke-width': 1.4, 'stroke-dasharray': '2 2' }, gk);
      }
      var ym = (KY0 + KY1) / 2, KX1 = KX0 + NK * (AK + PL) + PL;
      s('line', { x1: 12, x2: KX1, y1: ym, y2: ym, stroke: SOL_O, 'stroke-width': 4, opacity: 0.5 }, gk);
      D.t(gk, (KX0 + KX1) / 2, KY1 + 26, 'tres de las 25 cámaras', { tam: 13, ancla: 'middle', color: K.tinta2 });
      S.man = D.manometro(svg, 40, 42, 22, 8, { paso: 2, lectura: false });
      S.lMan = D.t(svg, 72, 47, '', { tam: 13, peso: 600, color: TXT });
      S.lt = D.t(svg, 12, 334, '', { tam: 13, color: K.tinta2 });
      S.lq = D.t(svg, 12, 354, '', { tam: 13, color: K.tinta2 });
      S.lv = D.t(svg, 12, 314, '', { tam: 13, color: K.tinta2 });
      // la gráfica
      var GX0 = 300, GX1 = 700, GY0 = 40, GY1 = 300, T0 = -1, T1 = 8, VM = 2.5;
      var X = function (t) { return GX0 + (t - T0) / (T1 - T0) * (GX1 - GX0); }, Y = function (v) { return GY1 - v / VM * (GY1 - GY0); };
      S.X = X; S.Y = Y;
      var g = s('g', {}, svg);
      S.turno = grupo(svg);
      s('rect', { x: X(0), y: GY0, width: X(7) - X(0), height: GY1 - GY0, fill: K.zona }, S.turno);
      for (var t = -1; t <= 8; t++) s('line', { x1: X(t), x2: X(t), y1: GY0, y2: GY1, stroke: K.rejilla, 'stroke-width': 1 }, g);
      [0.5, 1, 1.5, 2, 2.5].forEach(function (v) { s('line', { x1: GX0, x2: GX1, y1: Y(v), y2: Y(v), stroke: K.rejilla, 'stroke-width': 1 }, g); });
      s('path', { d: 'M' + GX0 + ' ' + GY0 + 'V' + GY1 + 'H' + GX1, fill: 'none', stroke: K.eje, 'stroke-width': 1 }, g);
      s('line', { x1: X(0), x2: X(0), y1: GY0, y2: GY1, stroke: K.eje, 'stroke-width': 1 }, g);
      for (t = -1; t <= 8; t++) D.t(g, X(t), GY1 + 18, n(t, 0), { tam: 13, ancla: 'middle', color: K.tinta2 });
      [0, 0.5, 1, 1.5, 2, 2.5].forEach(function (v) { D.t(g, GX0 - 8, Y(v) + 5, n(v, 1), { tam: 13, ancla: 'end', color: K.tinta2 }); });
      D.t(g, (GX0 + GX1) / 2, GY1 + 40, 'tiempo, h', { tam: 13, ancla: 'middle', color: K.tinta2 });
      rotado(g, GX0 - 40, (GY0 + GY1) / 2, 'filtrado, m³', { tam: 13 });
      D.t(S.turno, X(7) - 6, GY1 - 10, 'llenado que cabe en un turno', { tam: 13, ancla: 'end', color: K.tinta2 });
      // la hora muerta y la producción media
      S.muerto = grupo(svg);
      s('rect', { x: X(-1), y: GY1 - 24, width: X(0) - X(-1), height: 24, fill: K.zona, stroke: REF, 'stroke-width': 1.2 }, S.muerto);
      D.t(S.muerto, X(-1), GY1 + 36, '1 h muerta', { tam: 13, peso: 600, color: TXT });
      S.cuerda = D.trazo(svg, 'M' + X(-1).toFixed(1) + ' ' + Y(0).toFixed(1) + 'L' + X(CI.L.t).toFixed(1) + ' ' + Y(CI.L.V).toFixed(1), { color: OL, ancho: 1.8, guion: '6 4' });
      S.lCuerda = grupo(svg); D.t(S.lCuerda, X(2.6), Y(CI.prod * 3.6) + 18, n(CI.prod, 2) + ' m³/h', { tam: 13, peso: 600, color: OL, halo: K.blanco });
      // la curva a presión constante desde el principio y la tangente del óptimo
      var pc = []; for (var k = 0; k <= 60; k++) { var V = k / 60 * 2.4, tt = CI.tpc(V); if (tt <= T1) pc.push([X(tt), Y(V)]); }
      S.pc = D.trazo(svg, dTrazo(pc), { color: REF, ancho: 1.8, guion: '3 4' });
      var tfh = CI.tf / 3600, pend = CI.Vo / (tfh + 1), tFin = 3.4;
      S.tang = D.trazo(svg, 'M' + X(-1).toFixed(1) + ' ' + Y(0).toFixed(1) + 'L' + X(tFin).toFixed(1) + ' ' + Y(pend * (tFin + 1)).toFixed(1), { color: OL, ancho: 1.8 });
      S.pOpt = grupo(svg); s('circle', { cx: X(tfh), cy: Y(CI.Vo), r: 5, fill: OL }, S.pOpt);
      D.t(S.pOpt, X(-0.9), GY0 + 70, 'óptimo: ' + n(tfh, 1) + ' h', { tam: 13, peso: 600, color: OL, halo: K.blanco });
      D.t(S.pOpt, X(-0.9), GY0 + 87, n(CI.Vo, 2) + ' m³', { tam: 13, peso: 600, color: OL, halo: K.blanco });
      D.t(S.pOpt, X(-0.9), GY0 + 104, n(CI.prodO, 2) + ' m³/h', { tam: 13, peso: 600, color: OL, halo: K.blanco });
      // el llenado del caso
      S.curva = s('path', { d: '', fill: 'none', stroke: AZ, 'stroke-width': 2.6 }, svg);
      S.mov = D.punto(svg, X(0), Y(0), { r: 5, color: AZ, borde: TXT });
      S.pCaso = grupo(svg); D.punto(S.pCaso, X(CI.L.t), Y(CI.L.V), { r: 6 });
      D.t(S.pCaso, X(CI.L.t) + 10, Y(CI.L.V) + 22, 'el caso: ' + n(CI.L.t, 1) + ' h', { tam: 13, peso: 600, halo: K.blanco });
      S.pCambio = grupo(svg); s('circle', { cx: X(CI.tc6), cy: Y(CI.V1), r: 3.5, fill: TXT }, S.pCambio);
      D.t(S.pCambio, X(CI.tc6) + 8, Y(CI.V1) + 16, '6 barg a las ' + n(CI.L.tc, 2) + ' h', { tam: 13, peso: 600, halo: K.blanco });
      S.ir = function (th) {                       // el llenado del caso a las th horas; la lectura del tiempo se escala al del ejemplo
        var p = CI.L.pts, d = [], k = 0;
        for (k = 0; k < p.length && p[k][0] <= th; k++) d.push([X(p[k][0]), Y(p[k][1])]);
        var j = Math.min(k, p.length - 1), i0 = Math.max(0, j - 1), f = p[j][0] > p[i0][0] ? entre((th - p[i0][0]) / (p[j][0] - p[i0][0]), 0, 1) : 1;
        var V = p[i0][1] + (p[j][1] - p[i0][1]) * f, pr = p[i0][2] + (p[j][2] - p[i0][2]) * f, q = p[i0][3] + (p[j][3] - p[i0][3]) * f;
        d.push([X(th), Y(V)]);
        S.curva.setAttribute('d', dTrazo(d));
        S.mov.setAttribute('cx', X(th).toFixed(1)); S.mov.setAttribute('cy', Y(V).toFixed(1));
        var fr = V / CI.L.V;
        S.cam.forEach(function (c) { var w = AK / 2 * fr; c.a.setAttribute('width', w.toFixed(1)); c.b.setAttribute('x', (c.x + AK - w).toFixed(1)); c.b.setAttribute('width', w.toFixed(1)); });
        S.man.poner(pr); D.ponerTexto(S.lMan, n(pr, 1) + ' barg');
        D.ponerTexto(S.lt, 't = ' + n(th * CI.tC / CI.L.t, 2) + ' h'); D.ponerTexto(S.lv, 'V = ' + n(V, 2) + ' m³'); D.ponerTexto(S.lq, 'caudal: ' + n(q, 2) + ' m³/h');
      };
      return S;
    },
    pasos: [
      { texto: 'La bomba neumática entrega 1 m³/h sobre los ' + n(CI.A, 1) + ' m² de tela: $v_f$ = ' + cientH(CI.vf) + ' m/s. Mientras la torta es delgada, la presión sube con ella a caudal constante, con la <a href="https://libro.luishreyes.com/filtracion.html#eq-fil-caudal" target="_blank" rel="noopener">ecuación de la filtración a caudal constante</a>: $K_r = \\mu v_f^2 c\\,\\alpha_0$ = ' + n(CI.Kr, 2) + ', y la presión llega a 6 barg a $t_1$ = ' + n(Math.round(CI.t1 / 10) * 10, 0) + ' s, ' + n(CI.L.tc, 2) + ' h, con ' + n(CI.V1, 2) + ' m³ de filtrado.', dur: 2,
        ir: function (S, t) { S.ir(CI.tc6 * t); ver(S.mov, 1); [S.turno, S.muerto, S.lCuerda, S.pOpt, S.pCaso, S.pCambio].forEach(function (g) { ver(g, 0); }); S.cuerda.dibujar(0); S.pc.dibujar(0); S.tang.dibujar(0); } },
      { texto: 'Desde ahí la prensa filtra a 6 barg y el caudal baja. Con la <a href="https://libro.luishreyes.com/filtracion.html#eq-fil-desde" target="_blank" rel="noopener">ecuación desde $V_1$</a> y $K_p/2$ = ' + n(Math.round(CI.Kp2 / 10) * 10, 0) + ' s/m⁶ para la prensa entera, $t$ = ' + n(Math.round(CI.t1 / 10) * 10, 0) + ' + ' + n(Math.round(CI.Kp2 / 10) * 10, 0) + ' (' + n(CI.L.V, 2) + '² − ' + n(CI.V1, 2) + '²) = ' + n(Math.round(CI.tA / 100) * 100, 0) + ' s, ' + n(CI.tA / 3600, 2) + ' h, cuando las cámaras se llenan con ' + n(CI.L.V, 2) + ' m³ de filtrado. Al final el caudal es de ' + n(CI.qfin, 2) + ' m³/h.', dur: 3,
        ir: function (S, t) { ver(S.pCambio, T(t, 0, 0.2)); S.ir(CI.tc6 + (CI.L.t - CI.tc6) * t); } },
      { texto: 'Con 1 h para abrir, descargar, lavar la tela y cerrar, el ciclo dura ' + n(CI.tC + 1, 1) + ' h. La producción media del ciclo es la pendiente de la recta que sale de −1 h y llega al final del llenado: ' + n(CI.L.V, 2) + '/' + n(CI.tC + 1, 2) + ' = ' + n(CI.prod, 2) + ' m³ de filtrado por hora.', dur: 1.8,
        ir: function (S, t) { ver(S.mov, 0); ver(S.muerto, T(t, 0, 0.4)); S.cuerda.dibujar(T(t, 0.3, 0.9)); ver(S.lCuerda, T(t, 0.7, 1)); } },
      { texto: 'Si las cámaras pudieran tener cualquier espesor, la producción media sería máxima en la tangente a la curva a 6 barg, en gris, trazada desde −1 h: es el <a href="https://libro.luishreyes.com/filtracion.html#eq-fil-optimo" target="_blank" rel="noopener">ciclo óptimo</a>, $t_f = t\' + B\\sqrt{t\'/(K_p/2)}$ = 3600 + ' + n(CI.B, 1) + ' × √(3600/' + n(Math.round(CI.Kp2 / 10) * 10, 0) + ') = ' + n(Math.round(CI.tf / 10) * 10, 0) + ' s, ' + n(CI.tf / 3600, 1) + ' h, con ' + n(CI.Vo, 2) + ' m³ y ' + n(CI.prodO, 2) + ' m³/h. Pero eso son cámaras de ' + n(PR.optimo.camara_mm, 0) + ' mm, con ' + n(PR.optimo.torta_mm, 0) + ' mm de torta pegajosa por cara, que se despega mal.', dur: 2.2,
        ir: function (S, t) { S.pc.dibujar(T(t, 0, 0.4)); S.tang.dibujar(T(t, 0.3, 0.8)); ver(S.pOpt, T(t, 0.6, 1)); } },
      { texto: 'El caso toma cámaras de 25 mm: se llenan en ' + n(CI.L.t, 1) + ' h, la torta cae sola y el ciclo de ' + n(CI.L.t + 1, 1) + ' h cabe en un turno de 8 h, con su hora para descargar. Cada ciclo guarda ' + n(PR.kg_ciclo, 0) + ' kg de sólido seco; en las lluvias llegan ' + n(LO.kg_d.lluvia, 1) + ' kg/d, ' + n(PR.ciclos_dia_100, 2) + ' ciclos al día: uno por turno, con holgura.', dur: 1.8,
        ir: function (S, t) { ver(S.turno, T(t, 0, 0.5)); ver(S.pCaso, T(t, 0.3, 0.8)); } }
    ]
  });

  /* ================= 18.5 La torta que se lleva el tambor ================= */

  /* El tambor que gira: el ejemplo 29.2 de McCabe (ec. fil-tambor-s) y el mismo tambor con el lodo del caso (ec.
     fil-vuelta), con el tambor y el lodo de filtros.py. La torta crece como la raíz del tiempo sumergido, porque la tela
     se desprecia; su espesor en el dibujo es esquemático. A la derecha, el tiempo por vuelta en escala logarítmica,
     frente a lo que giran los tambores (de 0,1 a 2 r/min). */
  var TA = F.tambor, TL = F.tambor_lodo;
  ZB.animacion('tambor', {
    vista: [0, 0, 720, 360],
    alt: 'A la izquierda, un tambor rotatorio a vacío en corte, con 30 % de su superficie sumergida en la suspensión de la artesa: la torta crece mientras la tela está sumergida, sale, se seca y la cuchilla la quita antes de que la tela vuelva a entrar. A la derecha, lo que da el tambor de McCabe y lo que pediría el lodo del caso, y una escala logarítmica de minutos por vuelta con la banda de lo que giran los tambores: el tambor de McCabe cae en ella, y el lodo de alumbre queda cientos de veces a la derecha.',
    montar: function (svg) {
      var S = {}, cx = 170, cy = 160, R = 100, th = 54, LV = cy + R * Math.cos(th * Math.PI / 180), ESP = 12, RAS = 250;
      function P(a, r) { var t = a * Math.PI / 180; return [cx - r * Math.sin(t), cy + r * Math.cos(t)]; }
      // la artesa con la suspensión
      s('path', { d: 'M' + (cx - R - 26) + ' ' + (LV - 16) + 'V' + (cy + R - 6) + 'Q' + (cx - R - 26) + ' ' + (cy + R + 26) + ' ' + cx + ' ' + (cy + R + 26) + 'Q' + (cx + R + 26) + ' ' + (cy + R + 26) + ' ' + (cx + R + 26) + ' ' + (cy + R - 6) + 'V' + (LV - 16) + 'Z', fill: LODO, stroke: 'none' }, svg);
      s('rect', { x: cx - R - 26, y: LV - 16, width: 2 * R + 52, height: 16, fill: K.papel }, svg);
      s('path', { d: 'M' + (cx - R - 26) + ' ' + (LV - 16) + 'V' + (cy + R - 6) + 'Q' + (cx - R - 26) + ' ' + (cy + R + 26) + ' ' + cx + ' ' + (cy + R + 26) + 'Q' + (cx + R + 26) + ' ' + (cy + R + 26) + ' ' + (cx + R + 26) + ' ' + (cy + R - 6) + 'V' + (LV - 16), fill: 'none', stroke: TXT, 'stroke-width': 2.2 }, svg);
      s('line', { x1: cx - R - 26, x2: cx + R + 26, y1: LV, y2: LV, stroke: SOL_O, 'stroke-width': 1.2, 'stroke-dasharray': '5 4' }, svg);
      // la torta: crece como la raíz del tiempo sumergido, sigue hasta la cuchilla
      function grosor(a) { return a <= th ? ESP * Math.sqrt(entre((a + th) / (2 * th), 0, 1)) : (a <= RAS ? ESP : 0); }
      S.torta = s('path', { d: '', fill: SOL_M, stroke: SOL_O, 'stroke-width': 0.8 }, svg);
      S.ponerTorta = function (hasta) {
        if (hasta <= -th + 0.5) { S.torta.setAttribute('d', ''); return; }
        var ext = [], int = [];
        for (var a = -th; a <= hasta + 1e-6; a += 2) { ext.push(P(a, R + grosor(a) + 1)); int.push(P(a, R)); }
        S.torta.setAttribute('d', dTrazo(ext.concat(int.reverse())) + 'Z');
      };
      // el tambor y sus compartimentos
      s('circle', { cx: cx, cy: cy, r: R, fill: METAL, stroke: TXT, 'stroke-width': 2 }, svg);
      s('circle', { cx: cx, cy: cy, r: R - 2, fill: 'none', stroke: K.tinta2, 'stroke-width': 1.4, 'stroke-dasharray': '2 2' }, svg);
      S.radios = [];
      for (var k = 0; k < 12; k++) S.radios.push(s('line', { x1: cx, y1: cy, x2: cx, y2: cy, stroke: METAL_O, 'stroke-width': 1.4 }, svg));
      s('circle', { cx: cx, cy: cy, r: 12, fill: METAL_M, stroke: TXT, 'stroke-width': 1.5 }, svg);
      S.giro = function (rot) { S.radios.forEach(function (l, i) { var q = P(rot + i * 30, R - 4); l.setAttribute('x2', q[0].toFixed(1)); l.setAttribute('y2', q[1].toFixed(1)); }); };
      // la cuchilla
      var c0 = P(RAS, R + 1), c1 = P(RAS - 12, R + 34);
      s('path', { d: 'M' + c0[0].toFixed(1) + ' ' + c0[1].toFixed(1) + 'L' + c1[0].toFixed(1) + ' ' + c1[1].toFixed(1), stroke: TXT, 'stroke-width': 3, 'stroke-linecap': 'round' }, svg);
      D.t(svg, c1[0] + 4, c1[1] - 4, 'cuchilla', { tam: 13, color: K.tinta2 });
      D.flecha(svg, cx - 34, cy - R - 22, cx + 34, cy - R - 22, { color: K.tinta2, ancho: 1.6 });
      D.t(svg, cx, cy - R - 30, 'giro', { tam: 13, ancla: 'middle', color: K.tinta2 });
      D.t(svg, cx, cy + R + 46, 'suspensión, 30 % sumergido', { tam: 13, ancla: 'middle', color: K.tinta2 });
      var tq = P(130, R + ESP + 6);
      S.lTorta = grupo(svg); D.t(S.lTorta, tq[0] - 4, tq[1], 'torta', { tam: 13, peso: 600, ancla: 'end', color: TXT, halo: K.blanco });
      // lo que se lee: el tambor de McCabe y el lodo
      var XR = 360;
      S.b1 = grupo(svg); D.t(S.b1, XR, 40, 'Carbonato, McCabe: 67,7 kPa de vacío', { tam: 13, peso: 600, color: AZ });
      S.l1 = grupo(svg); D.t(S.l1, XR, 62, 'una vuelta cada 300 s; sumergida, 90 s', { tam: 13, color: TXT });
      S.l2 = grupo(svg); D.t(S.l2, XR, 84, 'W por vuelta = ' + n(TA.W_vuelta, 2) + ' kg/m^{2}; ' + n(TA.flux, 4) + ' kg/(m^{2}·s)', { tam: 13, color: TXT });
      S.l3 = grupo(svg); D.t(S.l3, XR, 106, n(TA.ms, 3) + ' kg/s de sólidos: A_T = ' + n(TA.A, 2) + ' m^{2}', { tam: 13, color: TXT });
      S.b2 = grupo(svg); D.t(S.b2, XR, 146, 'Lodo con polímero: 0,5 bar, agua a 15 °C', { tam: 13, peso: 600, color: AL });
      S.l4 = grupo(svg); D.t(S.l4, XR, 168, '3 mm: ' + n(TL['3mm'].W, 2) + ' kg/m^{2}; una vuelta cada ' + n(TL['3mm'].t_c_h, 1) + ' h', { tam: 13, color: TXT });
      S.l5 = grupo(svg); D.t(S.l5, XR, 190, '6 mm: cada ' + n(TL['6mm'].t_c_h, 0) + ' h; 10 mm: cada ' + n(TL['10mm'].t_c_h, 0) + ' h', { tam: 13, color: TXT });
      // los minutos por vuelta, en escala logarítmica
      var X0 = 370, X1 = 700, YE = 280, E0 = -1, E1 = 4;
      var X = function (mi) { return X0 + (Math.log10(mi) - E0) / (E1 - E0) * (X1 - X0); };
      s('rect', { x: X(0.5), y: YE - 34, width: X(10) - X(0.5), height: 34, fill: K.zona }, svg);
      D.t(svg, (X(0.5) + X(10)) / 2, YE - 52, 'lo que giran', { tam: 13, ancla: 'middle', color: K.tinta2 });
      s('line', { x1: X0, x2: X1, y1: YE, y2: YE, stroke: K.eje, 'stroke-width': 1.2 }, svg);
      [0.1, 1, 10, 100, 1000, 10000].forEach(function (mi) { s('line', { x1: X(mi), x2: X(mi), y1: YE, y2: YE + 5, stroke: K.eje, 'stroke-width': 1.2 }, svg); D.t(svg, X(mi), YE + 20, mi < 1 ? '0,1' : mi === 10000 ? '10 000' : String(mi), { tam: 13, ancla: 'middle', color: K.tinta2 }); });
      D.t(svg, (X0 + X1) / 2, YE + 42, 'minutos por vuelta, escala logarítmica', { tam: 13, ancla: 'middle', color: K.tinta2 });
      S.pMc = grupo(svg); D.punto(S.pMc, X(5), YE - 17, { r: 6, color: AZ, borde: TXT }); D.t(S.pMc, X(5), YE - 30, 'McCabe', { tam: 13, peso: 600, ancla: 'middle', color: AZ, halo: K.blanco });
      S.pAl = [['3mm', '3 mm', 30], ['6mm', '6 mm', 48], ['10mm', '10 mm', 30]].map(function (q) {
        var g = grupo(svg), mi = TL[q[0]].t_c_h * 60;
        s('circle', { cx: X(mi), cy: YE - 17, r: 6, fill: AL, stroke: TXT, 'stroke-width': 1.4 }, g);
        D.t(g, X(mi), YE - q[2], q[1], { tam: 13, peso: 600, ancla: 'middle', color: AL, halo: K.blanco });
        return g;
      });
      S.ponerTorta(-th); S.giro(0);
      S.th = th; S.RAS = RAS;
      return S;
    },
    pasos: [
      { texto: 'El tambor del ejemplo de McCabe da una vuelta cada 5 min, con 30 % de su superficie sumergida en la suspensión de carbonato y 20 inHg de vacío, 67,7 kPa. Cada pedazo de tela filtra a presión constante el tiempo que pasa sumergido, $t = \\varphi/N$ = 0,30 × 300 = 90 s.', dur: 2.4,
        ir: function (S, t) { S.giro(360 * t); S.ponerTorta(-S.th); [S.lTorta, S.b1, S.l1, S.l2, S.l3, S.b2, S.l4, S.l5, S.pMc, S.pAl[0], S.pAl[1], S.pAl[2]].forEach(function (g) { ver(g, 0); }); ver(S.b1, T(t, 0, 0.3)); ver(S.l1, T(t, 0.3, 0.6)); } },
      { texto: 'Mientras la tela está sumergida recoge torta, que crece como la raíz del tiempo, porque la tela se desprecia. Al salir, el vacío la seca, y la cuchilla la quita antes de que la tela vuelva a la suspensión. Con la <a href="https://libro.luishreyes.com/filtracion.html#eq-fil-tambor-s" target="_blank" rel="noopener">ecuación del tambor con la torta compresible</a> y el $\\alpha_0$ de McCabe en pascales, el tambor produce ' + n(TA.flux, 4) + ' kg de torta seca por metro cuadrado y por segundo, y cada vuelta deja $W$ = ' + n(TA.flux, 4) + ' × 300 = ' + n(TA.W_vuelta, 2) + ' kg/m².', dur: 3,
        ir: function (S, t) { S.giro(360 * t); S.ponerTorta(-S.th + (S.th + S.RAS) * T(t, 0, 0.9)); ver(S.lTorta, T(t, 0.6, 0.9)); ver(S.l2, T(t, 0.6, 1)); } },
      { texto: 'Los 10 gal/min de suspensión traen ' + n(TA.ms, 3) + ' kg/s de carbonato, así que el tambor necesita $A_T$ = ' + n(TA.ms, 4) + '/' + n(TA.flux, 4) + ' = ' + n(TA.A, 2) + ' m², los ' + n(TA.A_ft2, 1) + ' ft² de McCabe. Sus 5 min por vuelta caen dentro de lo que giran los tambores, de 0,1 a 2 r/min.', dur: 2,
        ir: function (S, t) { S.giro(360 * t); ver(S.l3, T(t, 0, 0.5)); ver(S.pMc, T(t, 0.4, 0.8)); } },
      { texto: 'El mismo tambor con el lodo del caso, acondicionado, a 0,5 bar de vacío y con el agua a 15 °C. Una torta de 3 mm, la más delgada que suelta una banda, pide 353 × 0,003 = ' + n(TL['3mm'].W, 2) + ' kg/m², y la <a href="https://libro.luishreyes.com/filtracion.html#eq-fil-vuelta" target="_blank" rel="noopener">velocidad que deja una torta dada</a> da $N$ = ' + cientH(1 / (TL['3mm'].t_c_h * 3600), 1) + ' r/s: una vuelta cada ' + n(TL['3mm'].t_c_h, 1) + ' h, ' + n(TL['3mm'].rpm, 3) + ' r/min, cerca de la vigésima parte de lo que gira el tambor más lento.', dur: 2,
        ir: function (S, t) { S.giro(360); ver(S.b2, T(t, 0, 0.3)); ver(S.l4, T(t, 0.2, 0.6)); ver(S.pAl[0], T(t, 0.5, 0.9)); } },
      { texto: 'Con 6 mm, la torta que suelta una cuchilla, el tambor daría una vuelta cada ' + n(TL['6mm'].t_c_h, 0) + ' h, y con los 10 mm que piden los precipitados finos, una cada ' + n(TL['10mm'].t_c_h, 0) + ' h. El lodo de alumbre filtra demasiado despacio para un tambor que tiene que descargar una torta, y va a la prensa.', dur: 1.8,
        ir: function (S, t) { ver(S.l5, T(t, 0, 0.4)); ver(S.pAl[1], T(t, 0.3, 0.6)); ver(S.pAl[2], T(t, 0.6, 0.9)); } }
    ]
  });

  /* ================= 18.6 Del montón al poro ================= */

  /* Del montón al poro: un paso por cuadro de la escena de three.js (scripts/animaciones/diatomita/ del público), con
     el cuadro grande, su barra de escala y la marca del ancho del campo que baja por la regla logarítmica; el último
     paso es la figura de herramientas/figura-diatomita.py, con los seis cuadros juntos. Los campos son los de
     figuras/filtracion/diatomita.json (copia de en/figuras/18/diatomite.json). */
  var DI = { ancho: 1120, alto: 700, campos: [64230.966, 3670.341, 367.034, 100.934, 12.846, 3.854],
    rot: ['Un montón', 'El polvo', 'Las partículas', 'Una frústula', 'Los alvéolos', 'El poro del fondo'],
    opc: [0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000] };
  function medida(um) {
    var v, u;
    if (um >= 10000) { v = um / 10000; u = 'cm'; } else if (um >= 1000) { v = um / 1000; u = 'mm'; } else if (um >= 1) { v = um; u = 'µm'; } else return Math.round(um * 1000) + ' nm';
    var d = (u !== 'µm' || um < 10) && Math.abs(v - Math.round(v)) > 1e-9 ? 1 : 0;
    return n(v, d) + ' ' + u;
  }
  function barraEscala(padre, x, y, w, h, campo, letra) {
    var umPx = w / campo, um = DI.opc.filter(function (u) { return u * umPx <= w * 0.42; }).pop(), L = um * umPx;
    s('rect', { x: x + 6, y: y + h - 30, width: Math.max(L, 44) + 14, height: 24, rx: 3, fill: K.tinta, opacity: 0.78 }, padre);
    s('rect', { x: x + 13, y: y + h - 13, width: L, height: 3, fill: K.blanco }, padre);
    D.t(padre, x + 13, y + h - 17, medida(um), { tam: letra || 12, color: K.blanco });
  }
  ZB.animacion('diatomita', {
    vista: [0, -2, 720, 483],
    alt: 'Tierra diatomácea vista cada vez más de cerca, en seis cuadros de un modelo en tres dimensiones: un montón de unos 3 cm, el polvo, las partículas, una frústula céntrica cubierta de alvéolos, los alvéolos y el poro del fondo de uno de ellos. Cada cuadro lleva su barra de escala, y a la derecha una regla logarítmica de 10 cm a 100 nm marca el ancho del campo. Al final, los seis cuadros juntos con la regla debajo, como en la figura del montón al poro.',
    montar: function (svg) {
      var S = {}, BX = 10, BY = 24, BW = 592, BH = BW * DI.alto / DI.ancho, RX = 650, RT = 30, RB = 394;
      var RV = function (um) { return RT + (5 - Math.log10(um)) / 6 * (RB - RT); };
      // el acercamiento: el cuadro grande y la regla vertical
      S.zoom = s('g', {}, svg);
      S.img = DI.campos.map(function (c, k) {
        var g = s('g', { opacity: k === 0 ? 1 : 0 }, S.zoom);
        s('image', { href: '/classroom/iqya-2031-2027-10/assets/diatomita/diatomita-' + k + '.jpg', x: BX, y: BY, width: BW, height: BH.toFixed(1), preserveAspectRatio: 'none' }, g);
        barraEscala(g, BX, BY, BW, BH, c, 13);
        rico(g, BX, BY - 8, [[String(k + 1), 600], ['  ' + DI.rot[k], 500]], { color: K.tinta2 });
        return g;
      });
      D.t(S.zoom, 712, 16, 'ancho del campo', { tam: 13, ancla: 'end', color: TXT });
      s('path', { d: 'M' + RX + ' ' + RT + 'V' + RV(0.6).toFixed(1), stroke: TXT, 'stroke-width': 1.6 }, S.zoom);
      s('path', { d: 'M' + RX + ' ' + RV(0.6).toFixed(1) + 'V' + RB, stroke: TXT, 'stroke-width': 1.6, 'stroke-dasharray': '4 4' }, S.zoom);
      [100000, 10000, 1000, 100, 10, 1, 0.1].forEach(function (um) {
        s('path', { d: 'M' + (RX - 5) + ' ' + RV(um).toFixed(1) + 'H' + (RX + 5), stroke: TXT, 'stroke-width': 1.4 }, S.zoom);
        D.t(S.zoom, RX + 10, RV(um) + 5, medida(um), { tam: 13, color: K.tinta2 });
      });
      S.marca = s('g', {}, S.zoom);
      s('path', { d: 'M' + (RX - 14) + ' 0H' + RX, stroke: TXT, 'stroke-width': 2.2 }, S.marca);
      s('circle', { cx: RX - 24, cy: 0, r: 9, fill: K.caso, stroke: K.casoT, 'stroke-width': 1.6 }, S.marca);
      S.nMarca = D.t(S.marca, RX - 24, 4, '1', { tam: 12, peso: 600, ancla: 'middle', color: TXT });
      S.ponerMarca = function (um, k) { S.marca.setAttribute('transform', 'translate(0 ' + RV(um).toFixed(1) + ')'); D.ponerTexto(S.nMarca, String(k + 1)); };
      // los seis juntos, como en la figura
      var PW = 228, GAP = 18, TOP = 22, PH = PW * DI.alto / DI.ancho, FILA = PH + 34, RY = TOP + 2 * FILA + 30, RX0 = 30, RX1 = 3 * PW + 2 * GAP - 30;
      var R = function (um) { return RX0 + (5 - Math.log10(um)) / 6 * (RX1 - RX0); };
      S.todo = grupo(svg);
      DI.campos.forEach(function (c, k) {
        var x = (k % 3) * (PW + GAP), y = TOP + Math.floor(k / 3) * FILA;
        s('image', { href: '/classroom/iqya-2031-2027-10/assets/diatomita/diatomita-' + k + '.jpg', x: x, y: y.toFixed(1), width: PW, height: PH.toFixed(1), preserveAspectRatio: 'none' }, S.todo);
        rico(S.todo, x, y - 7, [[String(k + 1), 600], ['  ' + DI.rot[k], 500]], { color: K.tinta2 });
        barraEscala(S.todo, x, y, PW, PH, c, 12);
      });
      s('path', { d: 'M' + RX0 + ' ' + RY.toFixed(1) + 'H' + R(0.6).toFixed(1), stroke: TXT, 'stroke-width': 1.6 }, S.todo);
      s('path', { d: 'M' + R(0.6).toFixed(1) + ' ' + RY.toFixed(1) + 'H' + RX1, stroke: TXT, 'stroke-width': 1.6, 'stroke-dasharray': '4 4' }, S.todo);
      [100000, 10000, 1000, 100, 10, 1, 0.1].forEach(function (um) {
        s('path', { d: 'M' + R(um).toFixed(1) + ' ' + (RY - 6).toFixed(1) + 'V' + (RY + 6).toFixed(1), stroke: TXT, 'stroke-width': 1.4 }, S.todo);
        D.t(S.todo, R(um), RY + 22, medida(um), { tam: 13, ancla: 'middle', color: K.tinta2 });
      });
      [[30000, 'el montón', 0, 'middle'], [69, 'una frústula', 0, 'middle'], [2.6, 'un alvéolo', 0, 'end'], [0.9, 'el poro del fondo', 1, 'middle'], [0.25, 'sin datos', 0, 'start']].forEach(function (q) {
        var dx = q[3] === 'end' ? 4 : q[3] === 'start' ? -4 : 0;
        s('circle', { cx: R(q[0]).toFixed(1), cy: (RY + 34).toFixed(1), r: 2.4, fill: GR['texto-2'] }, S.todo);
        D.t(S.todo, R(q[0]) + dx, RY + 52 + 17 * q[2], q[1], { tam: 13, ancla: q[3], color: K.tinta2 });
        if (q[2]) s('path', { d: 'M' + R(q[0]).toFixed(1) + ' ' + (RY + 37).toFixed(1) + 'V' + (RY + 56).toFixed(1), stroke: GR['texto-2'], 'stroke-width': 1 }, S.todo);
      });
      DI.campos.forEach(function (c, k) {
        var x = R(c);
        s('path', { d: 'M' + x.toFixed(1) + ' ' + (RY - 16).toFixed(1) + 'V' + (RY - 1).toFixed(1), stroke: TXT, 'stroke-width': 2.2 }, S.todo);
        s('circle', { cx: x.toFixed(1), cy: (RY - 24).toFixed(1), r: 8, fill: K.caso, stroke: K.casoT, 'stroke-width': 1.6 }, S.todo);
        D.t(S.todo, x, RY - 20, String(k + 1), { tam: 12, peso: 600, ancla: 'middle', color: TXT });
      });
      D.t(S.todo, RX0, RY - 40, 'ancho del campo de cada cuadro', { tam: 13, color: TXT });
      S.ponerMarca(DI.campos[0], 0);
      return S;
    },
    pasos: [0, 1, 2, 3, 4, 5].map(function (k) {
      var txt = [
        'Un montón de tierra diatomácea de unos 3 cm, como el que cabe en una cuchara; el campo mide ' + medida(DI.campos[0]) + '. Así llega la ayuda en el saco: un polvo blanco de sílice casi pura, de los esqueletos de unas algas microscópicas, las diatomeas.',
        'El polvo, con un campo de ' + medida(DI.campos[1]) + ': de cerca, el montón se deshace en partículas sueltas, casi todas de menos de 50 µm, y entre ellas queda mucho hueco. Una torta de diatomita tiene una porosidad cercana a 0,9, cuando una torta común tiene de 0,2 a 0,3.',
        'Las partículas, con un campo de ' + medida(DI.campos[2]) + ': valvas, fragmentos y astillas de 5 a 100 µm, acostadas al azar. El líquido pasa por los huecos que dejan entre sí las frústulas rotas.',
        'Una frústula céntrica de 69 µm, con un campo de ' + medida(DI.campos[3]) + ': la caja de sílice de una diatomea, dos valvas unidas por el cíngulo, con la valva cubierta de alvéolos en filas.',
        'Los alvéolos, con un campo de ' + medida(DI.campos[4]) + ': huecos de unos 2,6 µm, con un paso de 3,4 µm entre centros, y en el fondo de cada uno un poro fino. Los finos que trae el líquido se quedan en la entrada.',
        'El poro del fondo, de 0,9 µm, en la lámina de adentro, con un campo de ' + medida(DI.campos[5]) + '. Por debajo de 1 µm las micrografías ya no muestran detalle, y la regla sigue punteada.'
      ][k];
      return { texto: txt, dur: k ? 1.8 : 1.2,
        ir: function (S, t) {
          if (k === 0) { ver(S.todo, 0); ver(S.zoom, 1); S.img.forEach(function (g, j) { ver(g, j === 0 ? 1 : 0); }); S.ponerMarca(DI.campos[0], 0); return; }
          ver(S.img[k - 1], 1 - T(t, 0.2, 0.8)); ver(S.img[k], T(t, 0.2, 0.8));
          var lg = Math.log(DI.campos[k - 1]) + (Math.log(DI.campos[k]) - Math.log(DI.campos[k - 1])) * T(t, 0, 0.9);
          S.ponerMarca(Math.exp(lg), t < 0.5 ? k - 1 : k);
        } };
    }).concat([
      { texto: 'Los seis cuadros juntos, con el ancho de su campo en la regla: de ' + medida(DI.campos[0]) + ' a ' + medida(DI.campos[5]) + ', cuatro órdenes de magnitud. Por esos huecos la Celite 545 deja pasar 4,00 darcy y resiste ' + cientH(F.ayudas_alfa['Celite 545'], 1) + ' m/kg (<a href="https://libro.luishreyes.com/filtracion.html#tbl-fil-alfa" target="_blank" rel="noopener">tabla de las resistencias</a>), unas ' + n(Math.round(LO.alfa_con / F.ayudas_alfa['Celite 545'] / 100) * 100, 0) + ' veces menos que el lodo acondicionado a 0,5 bar. Es la <a href="https://libro.luishreyes.com/filtracion.html#fig-fil-diatomita" target="_blank" rel="noopener">figura del montón al poro</a>.', dur: 1.6,
        ir: function (S, t) { ver(S.zoom, 1 - T(t, 0, 0.5)); ver(S.todo, T(t, 0.4, 1)); } }
    ])
  });

  /* ================= 18.7 El aceite frío ================= */

  /* El reposo y el filtro del aceite: el lote a 5 °C con el limoneno de la ec. fil-limoneno, las gotas que caen con
     Stokes (ec. ade-stokes del capítulo 4), la gota más chica que llega al fondo (ec. sed-arrastre del capítulo 17), la
     fracción que cae, el agua que llega al filtro y el área por cada criterio (ejemplo fil-winter). */
  var WN = (function () {
    var T5 = 5, o = limoneno(T5), w = agua(T5), dr = w.rho - o.rho, kg = WI.aceite_kg_h * WI.lote_h, V = kg / o.rho;
    var Dt = Math.pow(4 * V / (Math.PI * WI.hd), 1 / 3), h = WI.hd * Dt, tr = WI.reposo * 3600;
    function v(d) { return G * dr * d * d / (18 * o.mu); }
    var dmin = Math.sqrt(18 * o.mu * h / tr / (G * dr)), a = WI.d_libre[0], b = WI.d_libre[1];
    var eta = (b * b - a * a) / (2 * dmin * dmin * Math.log(b / a));
    var sale = disuelta(WI.T_flor) - disuelta(T5), libre = WI.libre * (1 - eta), mgkg = libre + sale, g = mgkg * kg / 1000;
    var Q = V / (WI.t_filtrar * 3600), Rk = function (J) { return BAR / (WI.mu_w20 * J / 60000); };
    return { o: o, w: w, dr: dr, kg: kg, V: V, D: Dt, h: h, v: v, dmin: dmin, a: a, b: b, eta: eta, sale: sale, libre: libre, mgkg: mgkg, g: g, Q: Q,
      A250: o.mu * Rk(WI.pall['K 250']) * Q / (0.1 * BAR), AEKS: o.mu * Rk(WI.pall.EKS) * Q / (0.1 * BAR),
      Af: Q * 3.6e6 / WI.zd.fino, Ap: Q * 3.6e6 / WI.zd.pulido, Aw: g / WI.capacidad, d20: disuelta(WI.T_flor), d5: disuelta(T5) };
  })();

  ZB.animacion('winter', {
    vista: [0, 0, 720, 380],
    alt: 'A la izquierda, el tanque del lote con su camisa de frío y tres columnas de gotas de agua de 18, 10 y 5 µm que caen durante las 8 h de reposo; la de 18 µm llega al fondo, las otras bajan menos. A la derecha, las propiedades del aceite a 5 °C, la fracción de cada tamaño que llega al fondo y, al final, el área de placa por cada criterio: la caída de presión limpia, el flujo recomendado y el agua que retienen las placas, que decide el área.',
    montar: function (svg) {
      var S = {}, TX0 = 50, TX1 = 240, TY0 = 70, TY1 = 260, ESC = (TY1 - TY0) / WN.h;     // px por metro
      // el tanque con su camisa
      s('rect', { x: TX0 - 12, y: TY0 - 4, width: TX1 - TX0 + 24, height: TY1 - TY0 + 16, rx: 8, fill: AGUA_M, stroke: TXT, 'stroke-width': 1.4 }, svg);
      s('rect', { x: TX0, y: TY0, width: TX1 - TX0, height: TY1 - TY0, fill: ACEITE }, svg);
      S.capa = s('rect', { x: TX0, y: TY1, width: TX1 - TX0, height: 0, fill: AGUA_O }, svg);
      s('path', { d: 'M' + TX0 + ' ' + (TY0 - 14) + 'V' + TY1 + 'H' + TX1 + 'V' + (TY0 - 14), fill: 'none', stroke: TXT, 'stroke-width': 2.2 }, svg);
      D.t(svg, (TX0 + TX1) / 2, TY0 - 22, 'el lote, a 5 °C, con camisa de frío', { tam: 13, ancla: 'middle', color: K.tinta2 });
      S.lReposo = D.t(svg, (TX0 + TX1) / 2, TY0 + 18, '', { tam: 13, peso: 600, ancla: 'middle', color: TXT, halo: K.blanco });
      // las gotas: tres columnas, seis gotas cada una, que caen con Stokes
      S.cols = [18e-6, 10e-6, 5e-6].map(function (d, j) {
        var x = TX0 + 40 + j * 55, gotas = [];
        for (var i = 0; i < 6; i++) gotas.push({ y0: TY0 + 30 + i * 30, c: s('circle', { cx: x, cy: 0, r: Math.max(1.6, d * 1e6 * 0.32), fill: AGUA_O, stroke: TXT, 'stroke-width': 0.6 }, svg) });
        D.t(svg, x, TY1 + 30, n(d * 1e6, 0) + ' µm', { tam: 13, peso: 600, ancla: 'middle', color: TXT });
        var vc = WN.v(d) * 3600 * 100;
        D.t(svg, x, TY1 + 48, vc >= 1 ? n(vc, 1) + ' cm/h' : n(vc * 10, 0) + ' mm/h', { tam: 13, ancla: 'middle', color: K.tinta2 });
        return { d: d, x: x, gotas: gotas };
      });
      S.ponerReposo = function (hr) {
        S.cols.forEach(function (c) {
          var baja = WN.v(c.d) * hr * 3600 * ESC;
          var r = Math.max(1.6, c.d * 1e6 * 0.32), fondo = TY1 - 7 * hr / WI.reposo - r;
          c.gotas.forEach(function (g, i) { var abajo = g.y0 + baja >= fondo; g.c.setAttribute('cy', Math.min(g.y0 + baja, fondo).toFixed(1)); g.c.setAttribute('cx', (c.x + (abajo ? (i - 2.5) * 2.2 * r : 0)).toFixed(1)); });
        });
        S.capa.setAttribute('y', (TY1 - 7 * hr / WI.reposo).toFixed(1)); S.capa.setAttribute('height', (7 * hr / WI.reposo).toFixed(1));
        D.ponerTexto(S.lReposo, 'reposo: ' + n(hr, 1) + ' h');
      };
      // a la derecha: las propiedades
      var XR = 300;
      S.prop = grupo(svg);
      D.t(S.prop, XR, 36, 'aceite: ' + n(WN.kg, 0) + ' kg, ' + n(WN.V * 1000, 0) + ' L; tanque de ' + n(WN.D, 2) + ' × ' + n(WN.h, 2) + ' m', { tam: 13, color: TXT });
      D.t(S.prop, XR, 56, 'a 5 °C: ρ = ' + n(WN.o.rho, 1) + ' kg/m^{3}, μ = ' + n(WN.o.mu * 1000, 2) + ' mPa·s; Δρ = ' + n(WN.dr, 0) + ' kg/m^{3}', { tam: 13, color: TXT });
      // la fracción que cae: (d/d_min)² en escala logarítmica de d
      var X0 = 340, X1 = 690, Y0 = 100, Y1 = 230, LA = Math.log10(1.5), LB = Math.log10(25);
      var X = function (d) { return X0 + (Math.log10(d) - LA) / (LB - LA) * (X1 - X0); }, Y = function (f) { return Y1 - f * (Y1 - Y0); };
      S.frac = grupo(svg);
      s('rect', { x: X(WN.a * 1e6), y: Y0, width: X(WN.b * 1e6) - X(WN.a * 1e6), height: Y1 - Y0, fill: K.zona }, S.frac);
      [2, 5, 10, 20].forEach(function (d) { s('line', { x1: X(d), x2: X(d), y1: Y0, y2: Y1, stroke: K.rejilla, 'stroke-width': 1 }, S.frac); D.t(S.frac, X(d), Y1 + 18, String(d), { tam: 13, ancla: 'middle', color: K.tinta2 }); });
      [0.5, 1].forEach(function (f) { s('line', { x1: X0, x2: X1, y1: Y(f), y2: Y(f), stroke: K.rejilla, 'stroke-width': 1 }, S.frac); });
      [0, 0.5, 1].forEach(function (f) { D.t(S.frac, X0 - 6, Y(f) + 5, n(f, 1), { tam: 13, ancla: 'end', color: K.tinta2 }); });
      s('path', { d: 'M' + X0 + ' ' + Y0 + 'V' + Y1 + 'H' + X1, fill: 'none', stroke: K.eje, 'stroke-width': 1 }, S.frac);
      D.t(S.frac, X1, Y1 + 36, 'diámetro de la gota, µm', { tam: 13, ancla: 'end', color: K.tinta2 });
      D.t(S.frac, X0, Y0 - 8, 'fracción que llega al fondo', { tam: 13, color: K.tinta2 });
      var cu = []; for (var i = 0; i <= 50; i++) { var d = 1.5 * Math.pow(25 / 1.5, i / 50); cu.push([X(d), Y(Math.min(1, Math.pow(d / (WN.dmin * 1e6), 2)))]); }
      s('path', { d: dTrazo(cu), fill: 'none', stroke: AZ, 'stroke-width': 2.4 }, S.frac);
      s('line', { x1: X(WN.dmin * 1e6), x2: X(WN.dmin * 1e6), y1: Y0, y2: Y1, stroke: TXT, 'stroke-width': 1.2, 'stroke-dasharray': '4 3' }, S.frac);
      D.t(S.frac, X(WN.dmin * 1e6) - 6, Y(0.08), n(WN.dmin * 1e6, 2) + ' µm', { tam: 13, peso: 600, ancla: 'end', color: TXT, halo: K.blanco });
      D.t(S.frac, (X(WN.a * 1e6) + X(WN.b * 1e6)) / 2, Y(0.62), 'las gotas del florentino', { tam: 13, ancla: 'middle', color: K.tinta2, halo: K.blanco });
      D.t(S.frac, (X(WN.a * 1e6) + X(WN.b * 1e6)) / 2, Y(0.62) + 17, 'η = ' + n(WN.eta, 3), { tam: 13, peso: 600, ancla: 'middle', color: AZ, halo: K.blanco });
      // el agua que llega al filtro
      S.agua = grupo(svg);
      D.t(S.agua, XR, 290, 'al filtro: ' + n(WN.libre, 0) + ' + ' + n(WN.sale, 0) + ' = ' + n(WN.mgkg, 0) + ' mg/kg, ' + n(WN.g, 0) + ' g por lote', { tam: 13, peso: 600, color: TXT });
      // el área por cada criterio
      var AX0 = 500, AX1 = 700, AY0 = 96, FI = 38;
      var AX = function (a) { return AX0 + (Math.log10(a) + 2) / 2.5 * (AX1 - AX0); };
      S.area = grupo(svg);
      [0.01, 0.1, 1].forEach(function (a) { s('line', { x1: AX(a), x2: AX(a), y1: AY0, y2: AY0 + 4 * FI, stroke: K.rejilla, 'stroke-width': 1 }, S.area); D.t(S.area, AX(a), AY0 + 4 * FI + 18, a === 1 ? '1 m^{2}' : n(a, 2), { tam: 13, ancla: 'middle', color: K.tinta2 }); });
      s('path', { d: 'M' + AX0 + ' ' + AY0 + 'V' + (AY0 + 4 * FI) + 'H' + AX1, fill: 'none', stroke: K.eje, 'stroke-width': 1 }, S.area);
      [['caída limpia, K 250', [WN.A250, WN.A250]], ['caída limpia, EKS', [WN.AEKS, WN.AEKS]], ['flujo recomendado', [WN.Ap, WN.Af]], ['agua, 100 g/m^{2}', [WN.Aw, WN.Aw]]].forEach(function (q, k) {
        var yc = AY0 + FI * k + FI / 2;
        D.t(S.area, AX0 - 10, yc + 5, q[0], { tam: 13, peso: k === 3 ? 600 : 500, ancla: 'end', color: TXT });
        if (q[1][1] / q[1][0] > 1.05) s('rect', { x: AX(q[1][0]), y: yc - 8, width: AX(q[1][1]) - AX(q[1][0]), height: 16, fill: K.ref }, S.area);
        else if (k < 3) s('circle', { cx: AX(q[1][0]), cy: yc, r: 6, fill: K.blanco, stroke: TXT, 'stroke-width': 1.4 }, S.area);
        else D.punto(S.area, AX(q[1][0]), yc, { r: 6 });
      });
      D.t(S.area, AX(WN.Aw) - 10, AY0 + 3 * FI + FI / 2 + 5, n(WN.Aw, 2) + ' m^{2}', { tam: 13, peso: 600, ancla: 'end', color: TXT, halo: K.blanco });
      D.t(S.area, AX0 - 10, AY0 - 10, 'área de placa, escala logarítmica', { tam: 13, ancla: 'end', color: K.tinta2 });
      S.ponerReposo(0);
      return S;
    },
    pasos: [
      { texto: 'El lote de 8 h: ' + n(WN.kg, 0) + ' kg de aceite, ' + n(WN.V * 1000, 0) + ' L a 5 °C, en un tanque de ' + n(WN.D, 2) + ' m de diámetro con ' + n(WN.h, 2) + ' m de líquido. Con la <a href="https://libro.luishreyes.com/filtracion.html#eq-fil-limoneno" target="_blank" rel="noopener">ecuación del limoneno</a> a 278,15 K, $\\rho$ = ' + n(WN.o.rho, 1) + ' kg/m³ y $\\mu$ = ' + n(WN.o.mu * 1000, 2) + ' mPa·s; el agua a 5 °C tiene ' + n(WN.w.rho, 1) + ' kg/m³, y la diferencia de densidad es de ' + n(WN.dr, 0) + ' kg/m³.', dur: 1.4,
        ir: function (S, t) { S.ponerReposo(0); ver(S.prop, T(t, 0, 0.6)); [S.frac, S.agua, S.area].forEach(function (g) { ver(g, 0); }); } },
      { texto: 'Durante las 8 h de reposo las gotas caen con la <a href="https://libro.luishreyes.com/analisis-dimensional-y-escalado.html#eq-ade-stokes" target="_blank" rel="noopener">ley de Stokes del capítulo 4</a>: una gota de 18 µm cae a ' + n(WN.v(18e-6) * 360000, 1) + ' cm/h y baja los ' + n(WN.h, 2) + ' m del tanque en el reposo; una de 10 µm, a ' + n(WN.v(10e-6) * 360000, 1) + ' cm/h, baja ' + n(WN.v(10e-6) * 8 * 360000, 0) + ' cm, y una de 5 µm, a ' + n(WN.v(5e-6) * 3.6e6, 0) + ' mm/h, apenas ' + n(WN.v(5e-6) * 8 * 360000, 0) + ' cm. El agua que llega al fondo se purga.', dur: 3.2,
        ir: function (S, t) { S.ponerReposo(WI.reposo * t); } },
      { texto: 'La gota más pequeña que llega al fondo desde la superficie sale de la <a href="https://libro.luishreyes.com/sedimentacion-y-decantacion.html#eq-sed-arrastre" target="_blank" rel="noopener">ecuación del arrastre del capítulo 17</a> con $v_L$ = ' + n(WN.h, 2) + ' m/8 h: ' + n(WN.dmin * 1e6, 2) + ' µm. Las gotas del florentino son todas menores, de 2 a ' + n(WN.b * 1e6, 1) + ' µm, y cada tamaño llega al fondo en la fracción $(d/' + m(WN.dmin * 1e6, 2) + ')^2$, como en el tanque de Hazen. Con el agua libre repartida pareja en el logaritmo del tamaño, cae $\\eta$ = ' + n(WN.eta, 3) + ' del agua libre.', dur: 1.8,
        ir: function (S, t) { ver(S.frac, T(t, 0, 0.6)); } },
      { texto: 'Al filtro llegan ' + n(WI.libre, 0) + ' × (1 − ' + n(WN.eta, 3) + ') = ' + n(WN.libre, 0) + ' mg/kg de agua libre y ' + n(WN.d20, 0) + ' − ' + n(WN.d5, 0) + ' = ' + n(WN.sale, 0) + ' mg/kg del agua que salió de solución al enfriar: ' + n(WN.mgkg, 0) + ' mg/kg, ' + n(WN.g, 0) + ' g en los ' + n(WN.kg, 0) + ' kg del lote.', dur: 1.4,
        ir: function (S, t) { ver(S.agua, T(t, 0, 0.6)); } },
      { texto: 'El área de placa, por cada criterio: la caída de presión limpia de 0,1 bar pide ' + n(WN.A250, 3) + ' m² con la K 250 y ' + n(WN.AEKS, 2) + ' con la EKS; el flujo que recomienda Pall, de ' + n(WN.Ap, 2) + ' a ' + n(WN.Af, 2) + ' m²; y el agua, con 100 g/m² (ilustrativo), ' + n(WN.Aw, 2) + ' m²: seis placas de 400 × 400 mm. El agua decide el área, como en la <a href="https://libro.luishreyes.com/filtracion.html#fig-fil-aceite" target="_blank" rel="noopener">figura del área de placa</a>.', dur: 1.8,
        ir: function (S, t) { ver(S.frac, 1 - T(t, 0, 0.4)); ver(S.area, T(t, 0.3, 0.9)); } }
    ]
  });

})();
