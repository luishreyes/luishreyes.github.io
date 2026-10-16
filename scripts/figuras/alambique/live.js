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
  this.el = {}; ['mirilla', 'tneedle', 'sneedle', 'gauge', 'hydro', 'beak'].forEach(function (k) { self.el[k] = q(k); });
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
