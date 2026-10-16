/* ====================================================================
   La instalación de bombeo en vivo. La página le pasa el resultado del
   modelo del explorador (en el punto de operación):
   · el impulsor gira 150 veces más despacio que el real (como en la vista
     «Por dentro»), con su diámetro recortado; el líquido entra por la
     boquilla de succión, pasa al ojo, sale por los canales entre álabes,
     da la vuelta por la voluta y sube por la garganta, coloreado con la
     presión estática de cada zona;
   · burbujas en los bordes de ataque de los álabes cuando el NPSH
     disponible no alcanza el de inicio de la cavitación (1,3 × NPSH3), y
     muchas más bajo el NPSH3;
   · las agujas de los manómetros (succión, descarga y tanque), el nivel
     del tanque en su vidrio, el vástago de la válvula de regulación y las
     marcas del acople, que giran con el eje.
   ==================================================================== */
var PAL = [[43, 76, 126], [89, 128, 166], [143, 184, 201], [232, 195, 90], [217, 130, 43]];
function palAt(t) { t = Math.max(0, Math.min(1, t)) * (PAL.length - 1); var i = Math.min(PAL.length - 2, Math.floor(t)), f = t - i, a = PAL[i], b = PAL[i + 1]; return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * f) + ',' + Math.round(a[1] + (b[1] - a[1]) * f) + ',' + Math.round(a[2] + (b[2] - a[2]) * f) + ')'; }
var SLOW = 150;
function FPump(host, D) {
  this.host = host; this.D = D; this.svg = host.querySelector('svg'); this.C = xCam(D.P);
  var svg = this.svg, q = function (n) { return svg.querySelector('[data-live="' + n + '"]'); };
  this.el = { imp: q('imp'), vol: q('flow.vol'), volf: q('flow.volf'), thr: q('flow.thr'), suc: q('flow.suc'), ps: q('ps'), pd: q('pd'), p1: q('p1'), lcol: q('lcol'), gv: q('gv.stem'), cpl: q('cpl') };
  this.rot = 0; this.t = 0; this.parts = []; this.acc = 0; this.seed = 11; this.open = 1;
  var k0 = this.C.pr(0, 0, 0), kx = this.C.pr(1, 0, 0); this.px = Math.hypot(kx[0] - k0[0], kx[1] - k0[1]);
}
FPump.prototype.P = function (x, y, z) { return this.C.pr(x, y, z); };
FPump.prototype.rnd = function () { this.seed = (this.seed * 16807) % 2147483647; return this.seed / 2147483647; };
/* un punto del plano de la voluta: x a lo largo del eje, (r, θ) en el plano yz (θ desde +y hacia +z) */
FPump.prototype.Q = function (x, r, th) { return this.P(PB.xP + x, r * Math.cos(th), this.D.zA + r * Math.sin(th)); };
FPump.prototype.path = function (pts) { return 'M' + pts.map(function (p) { return p[0].toFixed(2) + ' ' + p[1].toFixed(2); }).join('L') + 'Z'; };
FPump.prototype.dial = function (el, frac) { if (!el) return; var a = 225 - 270 * Math.max(-0.02, Math.min(1.03, isFinite(frac) ? frac : 0)); el.setAttribute('transform', 'rotate(' + a.toFixed(1) + ')'); };
/* presión (m, absoluta) por zona, para el color: la misma escala de la vista «Por dentro» */
FPump.prototype.pAt = function (s, zone, f) {
  var p = s.press;
  if (zone === 'suc') return p[0];
  if (zone === 'eye') return p[1];
  if (zone === 'imp') { var dip = Math.max(0, 1 - f / 0.18); return p[1] + (p[3] - p[1]) * Math.pow(f, 1.3) - (p[1] - p[2]) * dip * dip; }
  if (zone === 'vol') return p[3] + (p[4] - p[3]) * f;
  return p[4] + (p[5] - p[4]) * f;
};
FPump.prototype.col = function (s, pv) { var p = s.press, lo = Math.min(p[2], s.pv), hi = p[5]; return pv < s.pv ? '#C8452B' : palAt((pv - lo) / Math.max(1e-6, hi - lo)); };
/* s = { N (rpm), r2 (cm, recortado), press: [6 presiones, m abs], pv (m), cm1 (m/s en la succión), cm2, c2u, uThroat (m/s), Qrel (Q/QBEP),
         cav (0 sin cavitación, 0..1 incipiente, >1 bajo el NPSH3), ps, pd, p1 (fracción de cada escala), level (0..1), open (0..1), dt, snap } */
FPump.prototype.update = function (s) {
  var dt = Math.max(0, Math.min(0.1, s.dt || 0)), h = dt / SLOW, w = s.N * Math.PI / 30;
  // la primera vez corre medio minuto por dentro: en pausa o con movimiento reducido el líquido ya llena la bomba
  if (!this.primed) { this.primed = true; for (var i = 0; i < 400; i++) { this.rot += w * 0.1 / SLOW; this.t += 0.1; this.step(s, 0.1); } }
  if (!s.snap) { this.t += dt; this.rot += w * h; this.step(s, dt); }
  this.drawImp(s); this.drawFlow(s);
  this.dial(this.el.ps, s.ps); this.dial(this.el.pd, s.pd); this.dial(this.el.p1, s.p1);
  this.level(s); this.stem(s); this.coupling(s);
};
/* el líquido: partículas de la succión al ojo, por los canales del impulsor, la voluta y la garganta (cm, tiempo lento) */
FPump.prototype.step = function (s, dt) {
  var k = 100 / SLOW, self = this, r1 = PB.r1, r2 = s.r2, x0 = PB.bw + PB.wall + PB.suc.len;
  // caudal de partículas proporcional al caudal (relativo al BEP)
  this.acc += dt * Math.max(4, Math.min(40, 22 * (s.Qrel || 1)));
  while (this.acc > 1 && this.parts.length < 260) {
    this.acc -= 1;
    var a = Math.PI + Math.PI * this.rnd(), rr = (PB.suc.r - 0.4) * Math.sqrt(this.rnd());
    this.parts.push({ z: 'suc', x: x0, r: rr, th: a, f: this.rnd(), age: 0 });
  }
  var vS = Math.max(0.3, s.cm1 * k), vM = Math.max(0.3, s.cm2 * k), vU = Math.max(0.5, s.c2u * k), vT = Math.max(0.3, s.uThroat * k);
  this.parts = this.parts.filter(function (p) {
    p.age += dt;
    if (p.z === 'suc') { p.x -= vS * dt; if (p.x < PB.bw + PB.wall) { p.z = 'eye'; } return true; }
    if (p.z === 'eye') { p.x -= vS * dt; p.r += 0.6 * vS * dt; if (p.x < 0.2) { p.z = 'imp'; p.rel = p.th - self.rot; p.rr = Math.max(p.r, r1 * 0.95); p.x = -0.2 + 0.9 * p.f; } return true; }
    if (p.z === 'imp') { p.rr += vM * dt * (r2 / Math.max(p.rr, 1)); p.th = p.rel + self.rot + vaneOff(p.rr, r2) - vaneOff(r1 * 0.95, r2); if (p.rr >= r2) { p.z = 'vol'; p.r = r2 + 0.3; p.f = 0; } return true; }
    if (p.z === 'vol') { p.th += (vU / Math.max(p.r, 1)) * dt; p.r = Math.min(p.r + 0.25 * dt, (r2 + rOut(((p.th % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI))) / 2 + 0.6); var tn = ((p.th % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI); p.f = tn / (2 * Math.PI); if (p.age > 40) return false; if (tn > 1.95 * Math.PI) { p.z = 'thr'; p.y = PB.r3 + PB.dv * (0.25 + 0.5 * self.rnd()); p.zz = 0; p.x = (self.rnd() - 0.5) * 2 * (PB.bw - 0.5); } return true; }
    if (p.z === 'thr') { p.zz += vT * dt; return p.zz < PB.zT; }
    return false;
  });
};
FPump.prototype.drawImp = function (s) {
  var el = this.el.imp; if (!el) return;
  var self = this, z = PB.vanes, r2 = s.r2, r0 = PB.r1 * 0.95, V = this.C.V, out = [];
  var xd0 = PB.disk[0], xd1 = PB.disk[1], xv0 = PB.vane[0], xv1 = PB.vane[1];
  var circ = function (x, r, n) { var pts = []; for (var i = 0; i < n; i++) pts.push(self.Q(x, r, 2 * Math.PI * i / n)); return self.path(pts); };
  // el disco de atrás: su canto y su cara
  out.push('<path class="pb-imp-e" d="' + circ(xd0, r2, 64) + '"/><path class="pb-imp-f" d="' + circ(xd1, r2, 64) + '"/>');
  // los álabes de atrás hacia adelante; cada uno es una cinta curva extruida a lo largo del eje
  var vanes = [];
  for (var b = 0; b < z; b++) {
    var a0 = this.rot + b * 2 * Math.PI / z, front = [], back = [], n = 12, tk = 0.3;
    var cl = []; for (var i = 0; i <= n; i++) { var r = r0 + (r2 - r0) * i / n; cl.push([r, a0 + vaneOff(r, r2) - vaneOff(r0, r2)]); }
    var side = function (sg) { return cl.map(function (c) { return [c[0], c[1] + sg * tk / c[0]]; }); };
    var A = side(1), B = side(-1).reverse(), ring = A.concat(B);
    ring.forEach(function (c) { front.push(self.Q(xv1, c[0], c[1])); back.push(self.Q(xv0, c[0], c[1])); });
    var mid = cl[n >> 1], mx = PB.xP, my = mid[0] * Math.cos(mid[1]), mz = self.D.zA + mid[0] * Math.sin(mid[1]);
    vanes.push({ d: mx * V[0] + my * V[1] + mz * V[2], f: front, k: back });
  }
  vanes.sort(function (p, q) { return p.d - q.d; });
  vanes.forEach(function (v) {
    var sides = '';
    for (var i = 0; i < v.f.length; i++) { var j = (i + 1) % v.f.length; sides += 'M' + v.f[i][0].toFixed(2) + ' ' + v.f[i][1].toFixed(2) + 'L' + v.f[j][0].toFixed(2) + ' ' + v.f[j][1].toFixed(2) + 'L' + v.k[j][0].toFixed(2) + ' ' + v.k[j][1].toFixed(2) + 'L' + v.k[i][0].toFixed(2) + ' ' + v.k[i][1].toFixed(2) + 'Z'; }
    out.push('<path class="pb-vane-s" d="' + sides + '"/><path class="pb-vane" d="' + self.path(v.f) + '"/>');
  });
  // el líquido en los canales (encima del disco, entre los álabes) y las burbujas en los bordes de ataque
  var pts = [];
  this.parts.forEach(function (p) {
    if (p.z !== 'imp' && p.z !== 'eye') return;
    var r = p.z === 'eye' ? p.r : p.rr, f = p.z === 'eye' ? 0 : (r - r0) / Math.max(1e-6, r2 - r0), q = self.Q(p.x, r, p.th);
    pts.push('<circle class="pb-p" cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r=".55" style="fill:' + self.col(s, self.pAt(s, p.z === 'eye' ? 'eye' : 'imp', f)) + '"/>');
  });
  if (s.cav > 0) {
    var nb = Math.round(Math.min(1, s.cav) * 4 + Math.max(0, s.cav - 1) * 10), t = this.t;
    for (var b2 = 0; b2 < z; b2++) for (var j2 = 0; j2 < nb; j2++) {
      var ph = ((j2 / Math.max(1, nb)) + t * 0.6 + b2 * 0.37) % 1, rb = r0 * (1.02 + 0.55 * ph * (s.cav > 1 ? 1.6 : 1)), ab = this.rot + b2 * 2 * Math.PI / z + vaneOff(rb, r2) - vaneOff(r0, r2) - 0.16 - 0.05 * j2, qb = this.Q(0.2 + 0.5 * ((j2 * 7) % 3) / 2, rb, ab);
      pts.push('<circle class="pb-bub" cx="' + qb[0].toFixed(1) + '" cy="' + qb[1].toFixed(1) + '" r="' + (0.55 * (1 - 0.75 * ph) + 0.2).toFixed(2) + '"/>');
    }
  }
  // el cubo y la tuerca del impulsor
  out.push(pts.join(''));
  out.push('<path class="pb-imp-e" d="' + circ(xv1 + 0.2, PB.rh, 24) + '"/><path class="pb-hub" d="' + circ(xv1 + 0.9, PB.rh, 24) + '"/>');
  var hex = []; for (var i2 = 0; i2 < 6; i2++) hex.push(this.Q(xv1 + 0.95, 1.5, this.rot + i2 * Math.PI / 3));
  out.push('<path class="pb-nut" d="' + this.path(hex) + '"/>');
  el.innerHTML = out.join('');
};
FPump.prototype.drawFlow = function (s) {
  var self = this, v = [], vf = [], t = [], u = [];
  this.parts.forEach(function (p) {
    if (p.z === 'vol') { var tn = ((p.th % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI); if (tn > Math.PI) return; var q = self.Q(((p.f * 7.3) % 1 - 0.5) * 2 * (PB.bw - 0.6), p.r, tn); (tn < TS ? v : vf).push('<circle class="pb-p" cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r=".6" style="fill:' + self.col(s, self.pAt(s, 'vol', p.f)) + '"/>'); }
    else if (p.z === 'thr') { var q2 = self.P(PB.xP + p.x, p.y, self.D.zA + p.zz); t.push('<circle class="pb-p" cx="' + q2[0].toFixed(1) + '" cy="' + q2[1].toFixed(1) + '" r=".6" style="fill:' + self.col(s, self.pAt(s, 'dis', p.zz / PB.zT)) + '"/>'); }
    else if (p.z === 'suc') { var q3 = self.Q(p.x, p.r, p.th); u.push('<circle class="pb-p" cx="' + q3[0].toFixed(1) + '" cy="' + q3[1].toFixed(1) + '" r=".6" style="fill:' + self.col(s, self.pAt(s, 'suc', 0)) + '"/>'); }
  });
  if (this.el.vol) this.el.vol.innerHTML = v.join('');
  if (this.el.volf) this.el.volf.innerHTML = vf.join('');
  if (this.el.thr) this.el.thr.innerHTML = t.join('');
  if (this.el.suc) this.el.suc.innerHTML = u.join('');
};
/* el nivel del tanque en su vidrio */
FPump.prototype.level = function (s) {
  var el = this.el.lcol, g = this.D.lg; if (!el || !g) return;
  var zl = g.z0 + (g.z1 - g.z0) * Math.max(0, Math.min(1, s.level)), a = this.P(g.x, g.y, g.z0), b = this.P(g.x, g.y, zl), w = 0.6 * this.px;
  el.innerHTML = zl > g.z0 + 0.1 ? '<path class="pb-col" d="M' + (a[0] - w).toFixed(2) + ' ' + a[1].toFixed(2) + 'L' + (a[0] + w).toFixed(2) + ' ' + a[1].toFixed(2) + 'L' + (b[0] + w).toFixed(2) + ' ' + b[1].toFixed(2) + 'L' + (b[0] - w).toFixed(2) + ' ' + b[1].toFixed(2) + 'Z"/>' : '';
};
/* el vástago de la válvula de regulación y su volante: sale más cuanto más abierta está */
FPump.prototype.stem = function (s) {
  var el = this.el.gv, g = this.D.gv; if (!el || !g) return;
  var target = Math.max(0, Math.min(1, s.open == null ? 1 : s.open));
  this.open += (target - this.open) * Math.min(1, (s.dt || 0) * 4); if (s.snap) this.open = target;
  var self = this, c = g.c, n = g.dir, e1 = [-n[1], n[0], 0], e2 = [0, 0, 1], sTop = 16.5 + 7.5 * this.open;
  var at = function (sv, u, v2) { return self.P(c[0] + n[0] * sv + e1[0] * u, c[1] + n[1] * sv + e1[1] * u, c[2] + v2); };
  var rod = [at(15, -0.55, 0), at(sTop, -0.55, 0), at(sTop, 0.55, 0), at(15, 0.55, 0)];
  var rim = [], hub = []; for (var i = 0; i < 28; i++) { var a = 2 * Math.PI * i / 28; rim.push(at(sTop, 5.8 * Math.cos(a), 5.8 * Math.sin(a))); hub.push(at(sTop, 4.6 * Math.cos(a), 4.6 * Math.sin(a))); }
  var spokes = ''; for (var j = 0; j < 5; j++) { var b = 2 * Math.PI * j / 5 + 0.4, p0 = at(sTop, 1.1 * Math.cos(b), 1.1 * Math.sin(b)), p1 = at(sTop, 4.8 * Math.cos(b), 4.8 * Math.sin(b)); spokes += 'M' + p0[0].toFixed(2) + ' ' + p0[1].toFixed(2) + 'L' + p1[0].toFixed(2) + ' ' + p1[1].toFixed(2); }
  el.innerHTML = '<path class="pb-rod" d="' + this.path(rod) + '"/><path class="pb-wheel" d="' + this.path(rim) + this.path(hub.slice().reverse()) + '"/><path class="pb-spoke" d="' + spokes + '"/>';
};
/* las marcas del acople: los pernos de las bridas del espaciador, que giran con el eje */
FPump.prototype.coupling = function (s) {
  var el = this.el.cpl; if (!el) return;
  var V = this.C.V, out = [];
  for (var i = 0; i < 4; i++) {
    var a = this.rot + i * Math.PI / 2, n = [0, Math.cos(a), Math.sin(a)];
    if (n[1] * V[1] + n[2] * V[2] < 0.05) continue;
    [-57.2, -64.8].forEach(function (x) { var q = this.P(x, 3.65 * Math.cos(a), this.D.zA + 3.65 * Math.sin(a)); out.push('<circle class="pb-bolt" cx="' + q[0].toFixed(2) + '" cy="' + q[1].toFixed(2) + '" r=".5"/>'); }, this);
  }
  el.innerHTML = out.join('');
};
