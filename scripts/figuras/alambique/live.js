/* ====================================================================
   El alambique en vivo. SScene le pasa, en cada cuadro, el instante del
   lote que dio el modelo de Rayleigh:
   · la fracción W/W₀ que queda en el calderín: el nivel del visor y de la
     mirilla (por la que se ve hervir el líquido) y su color;
   · T del calderín: la aguja del termómetro del capitel;
   · x_D instantánea: el color del destilado y lo que se hunde el
     densímetro del loro (más liviano, más hondo);
   · el corte que toca: la llave abierta (palanca a lo largo del tubo) y
     el chorro a su recipiente; cada recipiente con su destilado y su
     composición;
   · si el lote corre: la válvula de vapor da 3 barg al manómetro; al
     terminar, la presión cae y el hervor para.
   ==================================================================== */
function FStill(host, D) {
  this.host = host; this.D = D; this.svg = host.querySelector('svg'); this.C = xCam(D.P);
  var self = this, q = function (s) { return self.svg.querySelector('[data-live="' + s + '"]'); };
  this.el = {}; ['mirilla', 'tneedle', 'sneedle', 'gauge', 'hydro', 'beak', 'trays', 'funnel', 'tneedleH', 'magled'].forEach(function (k) { self.el[k] = q(k); });
  this.jarEl = [0, 1, 2].map(function (i) { return q('jar' + i); });
  this.streamEl = [0, 1, 2].map(function (i) { return q('stream' + i); });
  this.leverEl = [0, 1, 2].map(function (i) { return q('lever' + i); });
  var kt = this.C.pr(D.T[0], D.T[1], 0), k0 = this.C.pr(0, 0, 0); this.k = Math.hypot(kt[0] - k0[0], kt[1] - k0[1]); // px por cm
  this.jarKey = ['', '', '']; this.lev = [0, 0, 0]; this.ang = [1, 1, 1]; this.steam = 0; this.t = 0; this.offs = 0;
  this.bub = []; for (var i = 0; i < 14; i++) this.bub.push({ x: (hash(i + 3) - 0.5) * 8, u: hash(i + 11), s: 0.25 + 0.3 * hash(i + 23), r: 0.22 + 0.32 * hash(i + 31) });
  this.pick = null;
  function hash(i) { var s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
}
FStill.prototype.P3 = function (p) { return this.C.pr(p[0], p[1], p[2]); };
FStill.prototype.colors = function (c) {
  var st = this.svg.style, f = function (v, d) { return 'rgb(' + v.map(function (x) { return Math.max(0, Math.min(255, Math.round(x * d))); }).join(',') + ')'; };
  if (c.w) { st.setProperty('--st-w', f(c.w, 1)); st.setProperty('--st-w-edge', f(c.w, 0.62)); }
  if (c.d) { st.setProperty('--st-d', f(c.d, 1)); st.setProperty('--st-d-0', f(c.d, 0.86)); st.setProperty('--st-d-edge', f(c.d, 0.6)); }
  (c.jars || []).forEach(function (j, i) { if (j) { st.setProperty('--st-j' + i, f(j, 1)); st.setProperty('--st-j' + i + '-0', f(j, 0.86)); st.setProperty('--st-j' + i + '-edge', f(j, 0.6)); } });
};
/* s = { wr, T, Pst (barg), run, xd (0…1, para el densímetro), jars: [{ fill (0…1), on }], dt, snap }
   snap: en pausa (o con movimiento reducido) cada instrumento salta a su valor */
FStill.prototype.update = function (s) {
  var D = this.D, SGJ = SG.JAR, C = this.C, self = this, dt = Math.max(0, Math.min(0.1, s.dt || 0));
  var ease = function (rate) { return s.snap ? 1 : Math.min(1, dt * rate); };
  this.t += dt;
  // la mirilla: el nivel del calderín visto por el vidrio, en su plano
  var zL = D.Z0 + levelOf(s.wr), yL = (zL - D.MIR.cz) / D.MIR.e2z, R = D.MIR.r + 0.4, h = [];
  h.push('<rect class="st-vap" x="' + (-R) + '" y="' + (-R) + '" width="' + (2 * R) + '" height="' + (2 * R) + '"/>');
  if (yL > -R) h.push('<rect class="st-liq" x="' + (-R) + '" y="' + (-R).toFixed(2) + '" width="' + (2 * R) + '" height="' + Math.max(0, Math.min(2 * R, yL + R)).toFixed(2) + '"/>');
  if (yL > -R && yL < R) h.push('<path class="st-surf" d="M' + (-R) + ' ' + yL.toFixed(2) + 'L' + R + ' ' + yL.toFixed(2) + '"/>');
  var boil = s.run ? 1 : 0;
  this.boil = (this.boil || 0) + (boil - (this.boil || 0)) * ease(1.5);
  if (this.boil > 0.02) this.bub.forEach(function (b, i) {
    var top = Math.min(yL, R), span = top + R; if (span <= 0.3) return;
    var u = (b.u + self.t * b.s) % 1, y = -R + span * u, r = b.r * (0.6 + 0.6 * u);
    h.push('<circle class="st-bub" cx="' + b.x.toFixed(2) + '" cy="' + y.toFixed(2) + '" r="' + r.toFixed(2) + '" style="opacity:' + (self.boil * (0.35 + 0.55 * u)).toFixed(2) + '"/>');
    if (top < R && i % 3 === 0) { var sp = (b.u * 3.7 + self.t * 1.3) % 1; h.push('<circle class="st-drop" cx="' + (b.x * 0.8).toFixed(2) + '" cy="' + (top + 0.3 + sp * 1.6).toFixed(2) + '" r="0.18" style="opacity:' + (self.boil * (1 - sp)).toFixed(2) + '"/>'); }
  });
  this.el.mirilla.innerHTML = h.join('');
  // el termómetro (0 a 120 °C) y el manómetro del vapor (0 a 6 barg)
  var tv = Math.max(0, Math.min(1.02, (s.T || 0) / 120));
  this.el.tneedle.setAttribute("transform", "rotate(" + (225 - 270 * tv).toFixed(1) + ")"); this.el.tneedle.style.opacity = s.T == null ? 0 : 1;
  this.steam += ((s.run ? s.Pst : 0) - this.steam) * ease(2.2);
  this.el.sneedle.setAttribute('transform', 'rotate(' + (225 - 270 * Math.max(0, Math.min(1, this.steam / 6))).toFixed(1) + ')');
  // el visor de nivel: la columna de líquido del calderín
  var g0 = D.GV.G0, g1 = Math.max(g0, Math.min(D.GV.G1, zL)), a = this.P3([D.GV.x, D.GV.y, g0]), b = this.P3([D.GV.x, D.GV.y, g1]), w = 0.62 * this.k;
  this.el.gauge.innerHTML = g1 > g0 + 0.05 ? '<path class="st-col" d="M' + (a[0] - w).toFixed(2) + ' ' + a[1].toFixed(2) + 'L' + (a[0] + w).toFixed(2) + ' ' + a[1].toFixed(2) + 'L' + (b[0] + w).toFixed(2) + ' ' + b[1].toFixed(2) + 'L' + (b[0] - w).toFixed(2) + ' ' + b[1].toFixed(2) + 'Z"/>' : '';
  // el densímetro: se hunde más cuanto más rico (más liviano) sale el destilado
  var dz = 1.6 - 3.4 * Math.max(0, Math.min(1, s.xd));
  this.hz = this.hz == null ? dz : this.hz + (dz - this.hz) * ease(3);
  var o = this.P3([0, 0, 0]), oz = this.P3([0, 0, this.hz]);
  this.el.hydro.setAttribute('transform', 'translate(' + (oz[0] - o[0]).toFixed(2) + ' ' + (oz[1] - o[1]).toFixed(2) + ')');
  // el pico al embudo y el chorro al recipiente del corte
  this.offs -= dt * 22;
  this.el.beak.style.opacity = s.run ? 1 : 0; this.el.beak.style.strokeDashoffset = this.offs.toFixed(1);
  (s.jars || []).forEach(function (j, i) {
    var JC = D.JARS[i], z0 = SGJ.z0 + 0.8, top = SGJ.z1 - 1.4, zl = z0 + Math.max(0, Math.min(1, j.fill)) * (top - z0);
    self.lev[i] = zl;
    var key = (j.fill > 0 ? zl.toFixed(2) : '0');
    if (key !== self.jarKey[i]) {
      self.jarKey[i] = key;
      var F = { o: [JC[0], JC[1], 0], a: [0, 0, 1], u: D.T, v: D.HV };
      self.jarEl[i].innerHTML = j.fill > 0 && zl > z0 + 0.05 ? prismSvg(C, halfRing(0, SGJ.r - 0.06, 24), z0, zl, { F: F, tone: 'faint', crease: 'none', flat: true, cls: 'st-jliq st-j' + i }) : '';
    }
    var on = s.run && j.on, sa = self.P3([JC[0], JC[1], SGJ.z1 + 2.6]), sb = self.P3([JC[0], JC[1], zl]);
    self.streamEl[i].innerHTML = on ? '<path class="st-stream" style="stroke-dashoffset:' + self.offs.toFixed(1) + '" d="M' + sa[0].toFixed(2) + ' ' + sa[1].toFixed(2) + 'L' + sb[0].toFixed(2) + ' ' + sb[1].toFixed(2) + '"/>' : '';
    // la palanca de la llave: a lo largo del tubo, abierta; atravesada, cerrada
    var target = j.on && s.run ? 1 : 0;
    self.ang[i] += (target - self.ang[i]) * ease(6);
    var th = self.ang[i] * Math.PI / 2, tip = [JC[0] + D.HV[0] * 2.4, JC[1] + D.HV[1] * 2.4, SGJ.cock], Lv = 4.2;
    var e = [D.T[0] * Math.cos(th), D.T[1] * Math.cos(th), -Math.sin(th)];
    var p0 = self.P3(tip), p1 = self.P3([tip[0] + e[0] * Lv, tip[1] + e[1] * Lv, tip[2] + e[2] * Lv]);
    self.leverEl[i].innerHTML = '<path class="st-lever" d="M' + p0[0].toFixed(2) + ' ' + p0[1].toFixed(2) + 'L' + p1[0].toFixed(2) + ' ' + p1[1].toFixed(2) + '"/><circle class="st-knob st-k' + i + '" cx="' + p1[0].toFixed(2) + '" cy="' + p1[1].toFixed(2) + '" r="' + (0.75 * self.k).toFixed(2) + '"/><circle class="st-hubdot" cx="' + p0[0].toFixed(2) + '" cy="' + p0[1].toFixed(2) + '" r="' + (0.42 * self.k).toFixed(2) + '"/>';
  });
};
/* resalta las piezas de un equipo (el que se toca o se fija) */
FStill.prototype.highlight = function (key) {
  if (key === this.pick) return; this.pick = key;
  Array.prototype.forEach.call(this.svg.querySelectorAll('.it[data-pick]'), function (g) { g.classList.toggle('st-on', !!key && g.getAttribute('data-pick') === key); });
};

/* ====================================================================
   El alambique con columna (out-col): además de lo de arriba, cada cuadro
   recibe del explorador el cálculo plato a plato del instante:
   · n, los platos de la columna (N − 1) y xs, el color del líquido de
     cada uno, del de arriba al de abajo: se dibujan hasta 12 (con más, se
     toman 12 repartidos) con su vertedero, su bajante y su líquido;
   · R, la razón de reflujo: el embudo de la cabeza pasa R/(R + 1) del
     ciclo devolviendo el condensado a la columna y el resto echándolo a la
     copa del destilado; con reflujo total no sale nunca;
   · Ttop, la temperatura del vapor en la cabeza (su termómetro).
   ==================================================================== */
FStill.prototype.trayGeom = function (shown) {
  var D = this.D, C = this.C, K = D.COL, F = { o: [D.PC[0], D.PC[1], 0], a: [0, 0, 1], u: D.T, v: D.HV };
  var Rr = K.r - 0.12, c = 6.4, w = Math.sqrt(Rr * Rr - c * c), sp = shown > 1 ? (K.t1 - K.t0) / (shown - 1) : (K.t1 - K.t0);
  var zs = []; for (var k = 0; k < shown; k++) zs.push(shown > 1 ? K.t1 - (K.t1 - K.t0) * k / (shown - 1) : (K.t0 + K.t1) / 2);
  var arc = function (r, t0, t1, n) { var o = []; for (var i = 0; i <= n; i++) { var tt = t0 + (t1 - t0) * i / n; o.push([r * Math.cos(tt), r * Math.sin(tt)]); } return o; };
  var A0 = Math.acos(c / Rr), A1 = Math.acos((c + 0.25) / Rr);
  // el plato k deja su bajante del lado sd (+1 a la derecha, −1 a la izquierda); los lados se alternan
  var side = function (k) { return k % 2 === 0 ? -1 : 1; };
  var plate = function (sd) { return sd < 0 ? arc(Rr, Math.PI + A0, 2 * Math.PI, 28).concat([[-c, 0]]) : arc(Rr, Math.PI, 2 * Math.PI - A0, 28).concat([[c, 0]]); };
  var dcPoly = function (sd) { return sd > 0 ? arc(Rr, 2 * Math.PI - A1, 2 * Math.PI, 10).concat([[c + 0.25, 0]]) : arc(Rr, Math.PI, Math.PI + A1, 10).concat([[-(c + 0.25), 0]]); };
  var apron = function (sd) { var u0 = sd * c, u1 = sd * (c + 0.25); return [[Math.min(u0, u1), -w], [Math.max(u0, u1), -w], [Math.max(u0, u1), 0], [Math.min(u0, u1), 0]]; };
  var P = function (poly, z0, z1, cls) { return prismSvg(C, poly, z0, z1, { F: F, tone: 'mid', cls: cls, crease: 'faint' }); };
  var out = [], th = 0.35, hl = 1.3, hw = 1.8;
  // de abajo hacia arriba: la bajante del plato (que cae al de abajo o al calderín), el plato, su líquido y sus burbujas
  for (var k = shown - 1; k >= 0; k--) {
    var z = zs[k], sd = side(k), zLow = k === shown - 1 ? K.zb + 0.4 : zs[k + 1] + th, dcTop = z + th + hw;
    var lvl = Math.min(dcTop - 0.4, zLow + Math.max(1.2, 0.42 * (z - zLow)));
    out.push(P(dcPoly(sd), zLow, lvl, 'st-tliq st-t' + k));
    out.push(P(apron(sd), z - 0.55 * Math.max(4, z - zLow), dcTop, 'cu'));
    out.push(P(plate(sd), z, z + th, 'cu'));
    out.push(P(plate(sd).map(function (q, i, a) { return q; }), z + th, z + th + hl, 'st-tliq st-t' + k));
    out.push('<g data-tb="' + k + '"></g>');
  }
  out.push('<path data-reflux class="st-stream" d=""/>');
  return { html: out.join(''), zs: zs, sp: sp, Rr: Rr, c: c, side: side, F: F };
};
FStill.prototype.updateCol = function (s) {
  var D = this.D, C = this.C, self = this, dt = Math.max(0, Math.min(0.1, s.dt || 0)); if (!D.COL || !this.el.trays) return;
  var shown = Math.max(0, Math.min(12, s.n || 0));
  if (this.trayKey !== shown) {
    this.trayKey = shown; this.tg = shown ? this.trayGeom(shown) : null;
    this.el.trays.innerHTML = this.tg ? this.tg.html : '';
    this.tb = []; Array.prototype.forEach.call(this.el.trays.querySelectorAll('[data-tb]'), function (g) { self.tb[+g.getAttribute('data-tb')] = g; });
    this.refl = this.el.trays.querySelector('[data-reflux]');
  }
  // el color de cada plato
  var st = this.svg.style, f = function (v, d) { return 'rgb(' + v.map(function (x) { return Math.max(0, Math.min(255, Math.round(x * d))); }).join(',') + ')'; };
  for (var k = 0; k < shown; k++) { var col = s.xs && s.xs[k]; if (!col) continue; st.setProperty('--st-t' + k, f(col, 1)); st.setProperty('--st-t' + k + '-0', f(col, 0.86)); st.setProperty('--st-t' + k + '-e', f(col, 0.6)); }
  // las burbujas del vapor que atraviesa el líquido de cada plato
  var tg = this.tg, P3 = function (u, v, z) { return self.C.pr(D.PC[0] + D.T[0] * u + D.HV[0] * v, D.PC[1] + D.T[1] * u + D.HV[1] * v, z); };
  this.fx = (this.fx || 0) + dt;
  if (tg) for (var j = 0; j < shown; j++) {
    var z = tg.zs[j] + 0.35 + 1.3, sd = tg.side(j), h = [];
    if (s.run) for (var b = 0; b < 9; b++) {
      var hu = hashF(j * 13 + b), hv = hashF(j * 7 + b * 3 + 1), ph = (hashF(b + j) + this.fx * (0.9 + hu)) % 1;
      var u = -sd * tg.c + sd * (2 * tg.c) * hu * 0.92 - sd * 0.4, v = -(0.3 + 0.62 * hv) * Math.sqrt(Math.max(0, tg.Rr * tg.Rr - u * u)), q = P3(u, v, z + 0.05);
      var r = (0.18 + 0.32 * ph) * self.k;
      h.push('<circle class="st-tbub" cx="' + q[0].toFixed(2) + '" cy="' + q[1].toFixed(2) + '" r="' + r.toFixed(2) + '" style="opacity:' + (0.85 * (1 - ph)).toFixed(2) + '"/>');
    }
    var key = h.join(''); if (this.tb[j] && this.tb[j]._h !== key) { this.tb[j].innerHTML = key; this.tb[j]._h = key; }
  }
  // el embudo: un ciclo de 2,4 s; durante 1/(R + 1) del ciclo el electroimán lo jala y su pico echa a la copa
  var R = s.R, fD = isFinite(R) ? 1 / (R + 1) : 0, cyc = 2.4;
  this.ph = ((this.ph || 0) + dt / cyc) % 1;
  var take = s.run && this.ph < fD, Hd = D.HEAD;
  this.tilt = this.tilt == null ? 0 : this.tilt + ((take ? 1 : 0) - this.tilt) * (s.snap ? 1 : Math.min(1, dt * 14));
  // cuelga del gancho por un alambre; el cono abajo, donde se ve por debajo de la brida de arriba, y el vástago hasta
  // el pico: inclinado, el pico queda sobre la copa
  var piv = Hd.hookZ, L0 = 9.6, Lc = 4.6, L1 = piv - Hd.cupZ - 1.2, rT = 3.4, rN = 0.6, rS = 0.38, a = this.tilt * Math.asin(Math.min(0.9, Hd.cupU / L1));
  var rot = function (u, z) { var dz = z - piv; return [u * Math.cos(a) - dz * Math.sin(a), piv + u * Math.sin(a) + dz * Math.cos(a)]; };
  var mouth = rot(0, piv - L0), tip = rot(0, piv - L1);
  var Q = function (u, z) { var q = rot(u, z); return P3(q[0], 0, q[1]); };
  var cone = [Q(-rT, piv - L0), Q(rT, piv - L0), Q(rN, piv - L0 - Lc), Q(rS, piv - L0 - Lc - 0.6), Q(rS, piv - L1), Q(-rS, piv - L1), Q(-rS, piv - L0 - Lc - 0.6), Q(-rN, piv - L0 - Lc)];
  var lip = [Q(-rT, piv - L0), Q(rT, piv - L0)], arm = [Q(-rT + 0.4, piv - L0 - 0.9), Q(-rT - 2.2, piv - L0 - 0.9)];
  var hang = [P3(0, 0, piv), Q(0, piv - L0)];
  var pth = function (pp) { return 'M' + pp.map(function (q) { return q[0].toFixed(2) + ' ' + q[1].toFixed(2); }).join('L') + 'Z'; };
  var seg = function (pp, c) { return '<path class="' + c + '" d="M' + pp[0][0].toFixed(2) + ' ' + pp[0][1].toFixed(2) + 'L' + pp[1][0].toFixed(2) + ' ' + pp[1][1].toFixed(2) + '"/>'; };
  this.offs2 = (this.offs2 || 0) - dt * 22;
  var hh = [seg(hang, 'st-hang'), '<path class="st-funnel" d="' + pth(cone) + '"/>', seg(lip, 'st-lip'), seg(arm, 'st-arm')];
  if (s.run) {
    // las gotas del condensado que caen del condensador a la boca del embudo
    for (var g = 0; g < 4; g++) { var u2 = (g * 0.25 + this.fx * 1.3) % 1, zz = Hd.g1 - u2 * (Hd.g1 - mouth[1] - 0.2), qd = P3((g % 2 ? 1.1 : -1.1), 0, zz); hh.push('<circle class="st-drip" cx="' + qd[0].toFixed(2) + '" cy="' + qd[1].toFixed(2) + '" r="' + (0.3 * this.k).toFixed(2) + '"/>'); }
    // el chorro del pico: a la copa (destilado) o derecho a la columna (reflujo)
    var e0 = P3(tip[0], 0, tip[1]), e1 = take ? P3(tip[0], 0, Hd.cupZ - 0.6) : P3(tip[0], 0, D.COL.zt);
    hh.push('<path class="st-stream" style="stroke-dashoffset:' + this.offs2.toFixed(1) + '" d="M' + e0[0].toFixed(2) + ' ' + e0[1].toFixed(2) + 'L' + e1[0].toFixed(2) + ' ' + e1[1].toFixed(2) + '"/>');
  }
  this.el.funnel.innerHTML = hh.join('');
  // el reflujo que cae de la cabeza al plato de arriba
  if (this.refl) {
    var on = s.run && !take && tg, a3 = P3(0, 0, D.COL.zt), b3 = tg ? P3(0, 0, tg.zs[0] + 0.35 + 1.3) : a3;
    this.refl.setAttribute('d', on ? 'M' + a3[0].toFixed(2) + ' ' + a3[1].toFixed(2) + 'L' + b3[0].toFixed(2) + ' ' + b3[1].toFixed(2) : '');
    this.refl.style.strokeDashoffset = this.offs2.toFixed(1);
  }
  if (this.el.magled) this.el.magled.setAttribute('class', take ? 'st-led on' : 'st-led');
  if (this.el.tneedleH) { var tv = Math.max(0, Math.min(1.02, (s.Ttop || 0) / 120)); this.el.tneedleH.setAttribute('transform', 'rotate(' + (225 - 270 * tv).toFixed(1) + ')'); this.el.tneedleH.style.opacity = s.Ttop == null ? 0 : 1; }
};
function hashF(i) { var s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
