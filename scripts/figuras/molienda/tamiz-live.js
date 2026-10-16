/* ====================================================================
   La tamizadora en vivo. La página le pasa, en cada cuadro, la muestra
   del explorador (SieveAnim): las partículas que va sacando al azar de la
   Rosin-Rammler del producto, cada una con su tamaño y el tamiz que la
   retiene. La figura:
   · pinta la trama de cada malla con un paso que crece con su abertura
     (en escala logarítmica, como los granos: los tamaños reales van de
     38 µm a centímetros y no se verían);
   · deja caer cada partícula por la pila hasta la malla que la retiene
     (o hasta el fondo) y la deja ahí, en la mitad de atrás que queda;
   · mientras dura el ensayo mueve la pila en su órbita (278 por minuto,
     28,6 × 11,1 mm) y el martillo (150 golpes por minuto, cae sobre el
     corcho y hace saltar los granos); el temporizador cuenta los diez
     minutos del ensayo y el piloto queda encendido.
   ==================================================================== */
function FSieve(host, D) {
  this.host = host; this.D = D; this.C = xCam(D.P); this.svg = host.querySelector('svg');
  var self = this; this.el = {};
  Array.prototype.forEach.call(this.svg.querySelectorAll('[data-live]'), function (g) { self.el[g.getAttribute('data-live')] = g; });
  this.stack = Array.prototype.slice.call(this.svg.querySelectorAll('[data-ride="stack"]'));
  this.arm = this.svg.querySelector('[data-ride="arm"]'); this.head = this.svg.querySelector('[data-ride="head"]');
  var o = this.C.pr(0, 0, 0), px = this.C.pr(1, 0, 0), py = this.C.pr(0, 1, 0), pz = this.C.pr(0, 0, 1);
  this.sx = [px[0] - o[0], px[1] - o[1]]; this.sy = [py[0] - o[0], py[1] - o[1]]; this.sz = [pz[0] - o[0], pz[1] - o[1]];
  this.t = 0; this.tap = 0; this.lastTap = -1; this.grains = []; this.key = ''; this.amp = 0; this.levelKey = [];
}
FSieve.prototype.P3 = function (u, v, z) { var D = this.D; return this.C.pr(D.T[0] * u + D.HV[0] * v, D.T[1] * u + D.HV[1] * v, z); };
/* la serie de tamices del análisis: rows del modelo (rows[0] el más grueso, arriba) y el rango de tamaños para los granos */
FSieve.prototype.setRows = function (res) {
  var key = res.rows.map(function (r) { return r.a; }).join(',') + '|' + res.x63.toFixed(1);
  if (key === this.key) return; this.key = key; this.res = res; this.grains = []; this.seen = 0;
  this.lmin = Math.log(Math.max(5, res.x63 * 0.02)); this.lmax = Math.log(res.rows[0].hi);
  var D = this.D, n = D.n, self = this;
  for (var k = 0; k < n; k++) {
    var row = res.rows[n - 1 - k], a = row ? row.a : 38, p = Math.max(0.24, Math.min(2.8, 0.24 + 0.17 * Math.log(a / 38) / Math.LN2)), rs = D.rs - 0.05, z = D.mesh[k] + 0.06, d = '';
    for (var v = -p / 2; v > -rs; v -= p) { var hw = Math.sqrt(rs * rs - v * v), q0 = this.P3(-hw, v, z), q1 = this.P3(hw, v, z); d += 'M' + q0[0].toFixed(2) + ' ' + q0[1].toFixed(2) + 'L' + q1[0].toFixed(2) + ' ' + q1[1].toFixed(2); }
    for (var u = -Math.floor(rs / p) * p; u <= rs; u += p) { var hv = Math.sqrt(Math.max(0, rs * rs - u * u)); if (hv < 0.2) continue; var r0 = this.P3(u, -hv, z), r1 = this.P3(u, -0.02, z); d += 'M' + r0[0].toFixed(2) + ' ' + r0[1].toFixed(2) + 'L' + r1[0].toFixed(2) + ' ' + r1[1].toFixed(2); }
    if (this.el['tz.hatch' + k]) this.el['tz.hatch' + k].innerHTML = '<path class="tz-wire" d="' + d + '"/>';
  }
  for (var L = 0; L <= n; L++) { this.levelKey[L] = null; if (this.el['tz.grains' + L]) this.el['tz.grains' + L].innerHTML = ''; if (this.el['tz.fall' + L]) this.el['tz.fall' + L].innerHTML = ''; }
};
// el piso de cada nivel: 0 es el fondo y k + 1 la malla del tamiz k (de abajo hacia arriba)
FSieve.prototype.floor = function (L) { return L === 0 ? this.D.pan : this.D.mesh[L - 1] + 0.06; };
FSieve.prototype.levelAt = function (z) { for (var L = this.D.n; L > 0; L--) if (z >= this.floor(L)) return L; return 0; };
function tzHash(i) { var s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
/* s = { sim (SieveAnim), dt, snap } */
FSieve.prototype.update = function (s) {
  var D = this.D, sim = s.sim, dt = Math.max(0, Math.min(0.05, s.dt || 0)), self = this, n = D.n;
  if (!sim || !sim.rows || !this.res) return;
  if (sim.parts.length < this.seen) { this.grains = []; this.seen = 0; }
  // las partículas nuevas de la muestra entran por arriba de la pila; caen hasta su nivel
  for (var i = this.seen; i < sim.parts.length; i++) {
    var p = sim.parts[i], L = p.lvl >= n ? 0 : n - p.lvl, f = Math.max(0, Math.min(1, (Math.log(p.size) - this.lmin) / (this.lmax - this.lmin)));
    var rr = (L === 0 ? D.ri : D.rs) - 0.5, u = (tzHash(i * 3 + 1) * 2 - 1) * rr, vmax = Math.sqrt(Math.max(0, rr * rr - u * u)), v = -0.4 - tzHash(i * 7 + 2) * (vmax - 0.4);
    var r = 0.14 + 0.46 * f, g = { L: L, u: u, v: v, r: r, z: D.st.top + 0.5 + tzHash(i) * 1.5, vz: 0, done: !!s.snap, hop: 0, seed: i };
    if (g.done) g.z = this.floor(L) + r * 0.7;
    this.grains.push(g);
  }
  this.seen = sim.parts.length;
  var running = sim.done < sim.total || this.grains.some(function (q) { return !q.done; });
  if (s.snap) running = false;
  this.t += dt;
  // la órbita de la pila y el martillo, con su arranque y su parada suaves
  this.amp += ((running ? 1 : 0) - this.amp) * Math.min(1, dt * 6);
  var w = 2 * Math.PI * TZ.osc / 60, dx = TZ.ox * Math.cos(w * this.t) * this.amp, dy = TZ.oy * Math.sin(w * this.t) * this.amp;
  var tx = dx * this.sx[0] + dy * this.sy[0], ty = dx * this.sx[1] + dy * this.sy[1], tr = 'translate(' + tx.toFixed(2) + ' ' + ty.toFixed(2) + ')';
  if (tr !== this.lastTr) { this.lastTr = tr; this.stack.forEach(function (g) { g.setAttribute('transform', tr); }); }
  // el martillo: la leva lo sube en el 75 % del ciclo y lo suelta; cae libre sobre el corcho. Parado, queda sobre el corcho
  var per = 60 / TZ.taps, L0 = TZ.lift;
  if (this.tapPh == null) this.tapPh = 0.9;
  if (running || (this.tapPh % 1) < 0.87) this.tapPh += dt / per;
  var q = this.tapPh % 1; if (!running && q >= 0.87) q = 0.9;
  var lift = q < 0.75 ? L0 * (0.5 - 0.5 * Math.cos(Math.PI * q / 0.75)) : q < 0.87 ? L0 * (1 - Math.pow((q - 0.75) / 0.12, 2)) : 0;
  var cyc = Math.floor(this.tapPh - 0.87); if (cyc > this.lastTap) { this.lastTap = cyc; if (running) this.tap = this.t; }
  this.moveHammer(lift);
  // la caída por la pila y los saltos con cada golpe
  var sinceTap = this.t - this.tap, hopA = running && sinceTap < 0.12 ? 0.35 * (1 - sinceTap / 0.12) : 0;
  this.grains.forEach(function (g) {
    if (g.done) return;
    g.vz -= 981 * dt; g.z += g.vz * dt;
    var fl = self.floor(g.L) + g.r * 0.7; if (g.z <= fl) { g.z = fl; g.done = true; }
  });
  // cada nivel: los granos que ya llegaron (con su salto) y los que van cayendo por él
  var byL = [], fall = [];
  for (var L2 = 0; L2 <= n; L2++) { byL.push([]); fall.push([]); }
  this.grains.forEach(function (g) { if (g.done) byL[g.L].push(g); else fall[self.levelAt(g.z)].push(g); });
  for (var L3 = 0; L3 <= n; L3++) {
    var gs = byL[L3], key = gs.length + ':' + (hopA > 0 ? Math.round(hopA * 50) : 0);
    if (key !== this.levelKey[L3]) { this.levelKey[L3] = key; if (this.el['tz.grains' + L3]) this.el['tz.grains' + L3].innerHTML = this.grainSvg(gs, hopA); }
    var fk = fall[L3].length ? 'f' : '';
    if (fall[L3].length || this.el['tz.fall' + L3] && this.el['tz.fall' + L3]._f) { if (this.el['tz.fall' + L3]) { this.el['tz.fall' + L3].innerHTML = this.grainSvg(fall[L3], 0); this.el['tz.fall' + L3]._f = fk; } }
  }
  // el temporizador: los diez minutos del ensayo, según lo que va de la muestra; y el piloto
  var prog = sim.total ? Math.min(1, sim.done / sim.total) : 1, left = running ? Math.ceil(600 * (1 - prog)) : 0;
  if (this.el['tz.time'] && left !== this.lastLeft) { this.lastLeft = left; this.el['tz.time'].innerHTML = tzSeg(Math.floor(left / 60), left % 60); }
  if (this.el['tz.run']) this.el['tz.run'].setAttribute('class', running ? 'tz-runled on' : 'tz-runled');
  this.running = running;
};
/* el brazo gira alrededor del pivote (eje x): se redibuja como un prisma a lo largo de su dirección girada, con su misma
   sección, desde la corredera hasta la punta; el martillo sube lo que sube su eje (su inclinación es de menos de 6°) */
FSieve.prototype.moveHammer = function (lift) {
  var D = this.D, pv = D.pivot, th = lift / (0 - pv[1]), sz = this.sz;
  if (this.arm && th !== this.lastTh) {
    this.lastTh = th;
    var c = Math.cos(th), s = Math.sin(th), F = { o: pv, a: [0, c, s], u: [1, 0, 0], v: [0, -s, c] };
    // la sección del brazo respecto del pivote: x de −1,2 a 1,2 y z de zp − 1 a zp + 1 (el pivote está en zp + 1,2)
    var zr0 = D.arm - 1 - pv[2], zr1 = D.arm + 1 - pv[2];
    this.arm.innerHTML = '<g class="tz-steel">' + prismSvg(this.C, [[-1.2, zr0], [1.2, zr0], [1.2, zr1], [-1.2, zr1]], -14.6 - pv[1], 2.7 - pv[1], { F: F, tone: 'mid' }) + '</g>';
  }
  var ht = 'translate(' + (lift * sz[0]).toFixed(2) + ' ' + (lift * sz[1]).toFixed(2) + ')';
  if (this.head && ht !== this.lastHead) { this.lastHead = ht; this.head.setAttribute('transform', ht); }
};
// granos de mineral: polígonos irregulares del color del material, de atrás hacia adelante
FSieve.prototype.grainSvg = function (gs, hopA) {
  var self = this, kk = this.D.kk, out = '';
  gs.slice().sort(function (a, b) { return a.v - b.v; }).forEach(function (g) {
    var z = g.z + (hopA ? hopA * (0.4 + 0.6 * tzHash(g.seed * 5 + 3)) : 0), c = self.P3(g.u, g.v, z), R = g.r * kk, d = '';
    for (var j = 0; j < 6; j++) { var a = j * Math.PI / 3 + tzHash(g.seed + j) * 0.6, rr = R * (0.72 + 0.4 * tzHash(g.seed * 3 + j)); d += (j ? 'L' : 'M') + (c[0] + rr * Math.cos(a)).toFixed(2) + ' ' + (c[1] + rr * 0.8 * Math.sin(a)).toFixed(2); }
    out += '<path class="tz-grain" style="fill:' + self.color(g) + '" d="' + d + 'Z"/>';
  });
  return out;
};
FSieve.prototype.color = function (g) {
  var base = (this.res && this.res.mat && this.res.mat.color) || '#b9b1a3', n = parseInt(base.slice(1), 16), f = 0.82 + 0.3 * tzHash(g.seed * 11 + 7);
  return 'rgb(' + Math.min(255, Math.round(((n >> 16) & 255) * f)) + ',' + Math.min(255, Math.round(((n >> 8) & 255) * f)) + ',' + Math.min(255, Math.round((n & 255) * f)) + ')';
};
/* el temporizador de siete segmentos (mm:ss) en el plano de la pantalla, en cm: cuatro dígitos y los dos puntos */
var TZ_SEG = { 0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc', 5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' };
function tzSeg(mm, ss) {
  var digits = [Math.floor(mm / 10) % 10, mm % 10, Math.floor(ss / 10), ss % 10], xs = [-4.9, -2.55, 0.85, 3.2], out = '';
  var w = 1.7, h = 1.55, t = 0.36;
  var seg = { a: [0, -2 * h, 1], b: [w, -2 * h, 0], c: [w, -h, 0], d: [0, 0, 1], e: [0, -h, 0], f: [0, -2 * h, 0], g: [0, -h, 1] };
  digits.forEach(function (dgt, i) {
    var on = TZ_SEG[dgt], x0 = xs[i], y0 = 1.5;
    'abcdefg'.split('').forEach(function (s) {
      var q = seg[s], x = x0 + q[0], y = y0 + q[1];
      var r = q[2] ? '<rect x="' + (x + t * 0.5).toFixed(2) + '" y="' + (y - t / 2).toFixed(2) + '" width="' + (w - t).toFixed(2) + '" height="' + t + '" rx="0.12"/>' : '<rect x="' + (x - t / 2).toFixed(2) + '" y="' + (y + t * 0.5).toFixed(2) + '" width="' + t + '" height="' + (h - t).toFixed(2) + '" rx="0.12"/>';
      out += r.replace('<rect', '<rect class="tz-seg' + (on.indexOf(s) >= 0 ? '' : ' off') + '"');
    });
  });
  out += '<circle class="tz-seg" cx="0.1" cy="-0.6" r="0.22"/><circle class="tz-seg" cx="0.1" cy="0.4" r="0.22"/>';
  return out;
}
