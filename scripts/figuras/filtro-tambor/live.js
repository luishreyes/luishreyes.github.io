/* ====================================================================
   El tambor en vivo. FScene le pasa el caso (fracción sumergida f y el
   espesor de la torta en cada punto de la vuelta, del modelo de presión
   constante con t = φ/n) y, en cada cuadro, el ángulo del tambor.
   · la sección del corte gira: cubierta con sus sectores, tubos de drenaje
     (cada uno se pinta según la zona de la válvula por la que pasa:
     filtrado, lavado, aire de secado o soplado) y la araña;
   · el perfil de la torta es el del modelo (fijo en el espacio en régimen),
     con puntos que viajan con el tambor;
   · las regaderas lavan, la cuchilla pela la torta, que resbala por la
     canaleta y cae a la banda; si la torta es muy delgada para la
     cuchilla, se queda pegada y da la vuelta.
   ==================================================================== */
function FDrum(host, D) {
  this.host = host; this.D = D; this.svg = host.querySelector('svg'); this.C = xCam(D.P);
  var self = this, q = function (s) { return self.svg.querySelector('[data-live="' + s + '"]'); };
  ['pool.left', 'cake', 'cake.cap', 'sprays', 'pool.right', 'vat.right', 'vat.lower', 'knife', 'knife.holder', 'chute0', 'chute1', 'section', 'drum.lines', 'wash', 'peel', 'chunks', 'agitator', 'flows', 'belt'].forEach(function (k) { self[k.replace('.', '_')] = q(k); });
  this.key = ''; this.lastAng = null; this.sheet = 0; this.pieces = []; this.drops = []; this.offs = 0; this.beltOff = 0; this.t = 0;
  this.buildSection();
}
FDrum.prototype.colors = function (cake, slurry) {
  var st = this.svg.style, f = function (c, d) { return 'rgb(' + c.map(function (v) { return Math.max(0, Math.min(255, Math.round(v * d))); }).join(',') + ')'; };
  st.setProperty('--fp-cake', f(cake, 1)); st.setProperty('--fp-cake-0', f(cake, 0.72)); st.setProperty('--fp-cake-1', f(cake, 0.8));
  st.setProperty('--fp-cake-2', f(cake, 0.88)); st.setProperty('--fp-cake-3', f(cake, 0.94)); st.setProperty('--fp-cake-top', f(cake, 1.08)); st.setProperty('--fp-cake-edge', f(cake, 0.55));
  st.setProperty('--fp-slurry', f(slurry, 1)); st.setProperty('--fp-slurry-0', f(slurry, 0.82)); st.setProperty('--fp-slurry-edge', f(slurry, 0.7));
};
// la sección del tambor en coordenadas del plano de corte (x a la derecha, z arriba, centro en el eje)
FDrum.prototype.buildSection = function () {
  var R = DG.R, h = [], i, a;
  var c = function (r, cls) { return '<circle class="' + cls + '" r="' + r + '"/>'; };
  h.push(c(84, 'fd-int'));
  for (i = 0; i < 6; i++) { a = i * 60; h.push('<rect class="fd-spoke" x="10" y="-1.6" width="74" height="3.2" transform="rotate(' + a + ')"/>'); }
  h.push(c(12, 'fd-hub')); h.push(c(8, 'fd-shaft'));
  h.push('<path class="fd-shell" fill-rule="evenodd" d="' + ring(88) + ring(84) + '"/>');
  h.push('<path class="fd-deck" fill-rule="evenodd" d="' + ring(R) + ring(88) + '"/>');
  var ticks = ''; for (i = 0; i < 24; i++) { a = (i * 15) * Math.PI / 180; ticks += 'M' + (84 * Math.cos(a)).toFixed(2) + ' ' + (84 * Math.sin(a)).toFixed(2) + 'L' + (R * Math.cos(a)).toFixed(2) + ' ' + (R * Math.sin(a)).toFixed(2); }
  h.push('<path class="iso-line" data-tone="mid" d="' + ticks + '"/>');
  this.pipeEls = [];
  for (i = 0; i < 24; i++) { a = (i * 15 + 7.5) * Math.PI / 180; h.push('<circle class="fd-pipe" data-z="dry" r="1.7" cx="' + (80.5 * Math.cos(a)).toFixed(2) + '" cy="' + (80.5 * Math.sin(a)).toFixed(2) + '"/>'); }
  h.push('<circle class="fd-cloth" r="' + R + '"/>');
  this.section.innerHTML = h.join('');
  this.pipeEls = Array.prototype.slice.call(this.section.querySelectorAll('.fd-pipe'));
  function ring(r) { return 'M' + r + ' 0A' + r + ' ' + r + ' 0 1 0 ' + (-r) + ' 0A' + r + ' ' + r + ' 0 1 0 ' + r + ' 0Z'; }
};
/* el caso: f, perfil dibujado (cm) en 121 puntos de φ = 0…1, y si la cuchilla la puede pelar */
FDrum.prototype.configure = function (cfg) {
  var key = cfg.f.toFixed(4) + '|' + cfg.peel + '|' + cfg.prof.map(function (v) { return v.toFixed(2); }).join(',');
  if (key === this.key) return; this.key = key;
  this.cfg = cfg; this.Z = zonesOf(cfg.f); this.K = knifeOf(cfg.f);
  var C = this.C, D = this.D, Y0 = D.Y0, L = DG.L, P = pools(cfg.prof, cfg.f), Vr = vatRight(cfg.f), K = this.K, self = this;
  var y = { axis: 'y' };
  this.pool_left.innerHTML = prismSvg(C, P.left, Y0, 0, { axis: 'y', tone: 'faint', crease: 'none', cls: 'fd-slurry' }) + this.motes(P.left);
  this.pool_right.innerHTML = prismSvg(C, P.right, Y0, 0, { axis: 'y', tone: 'faint', crease: 'none', cls: 'fd-slurry' }) + this.motes(P.right);
  var band = cakeBand(cfg.prof, cfg.f, 0, cfg.peel ? DG.PHIK : 1, 96);
  this.cake.innerHTML = prismSvg(C, band.poly, -L, 0, { axis: 'y', tone: 'mid', cls: 'fp-cake', skip: band.skip, cap: 'none' });
  this.cake_cap.innerHTML = prismSvg(C, band.poly, -L, 0, { axis: 'y', tone: 'mid', cls: 'fp-cake', skip: band.skip, cap: 'only' });
  this.vat_right.innerHTML = (Vr.front ? prismSvg(C, Vr.front, Y0, 0, { axis: 'y', tone: 'mid' }) : '') + (Vr.upper ? prismSvg(C, Vr.upper, Y0, 0, { axis: 'y', tone: 'mid' }) : '');
  this.vat_lower.innerHTML = Vr.back ? prismSvg(C, Vr.back, Y0, 0, { axis: 'y', tone: 'mid' }) : '';
  this.knife.innerHTML = prismSvg(C, K.blade, -L, 0, { axis: 'y', tone: 'hi', cls: cfg.peel ? '' : 'fd-warn' });
  this.knife_holder.innerHTML = prismSvg(C, K.holder, -L, 0, { axis: 'y', tone: 'mid' });
  this.chute0.innerHTML = prismSvg(C, plate(K.chute[0], K.chute[1], 1, -1), -L - 2, 0, { axis: 'y', tone: 'mid' });
  this.chute1.innerHTML = K.chute.length > 2 ? prismSvg(C, plate(K.chute[1], K.chute[2], 1, -1), -L - 2, 0, { axis: 'y', tone: 'mid' }) : '';
  // regaderas de lavado: dos tubos con sus boquillas mirando al tambor
  var wash = washOf(cfg.f), wh = [];
  this.sprayList = [];
  wash.forEach(function (p, i) {
    var r = 2.2, poly = circlePoly(p[0], p[1], r, 16), th = Math.atan2(p[1] - DG.ZD, p[0]);
    wh.push(prismSvg(C, poly, -L + 4, -2, { axis: 'y', tone: 'hi' }));
    var dots = '';
    [-6, -30, -54, -78, -102].forEach(function (yy) { var q = C.pr(p[0] - Math.cos(th) * r, yy, p[1] - Math.sin(th) * r); dots += '<circle class="fd-nozzle" cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="0.9"/>'; self.sprayList.push({ p: p, th: th, y: yy }); });
    wh.push(dots);
  });
  this.wash.innerHTML = wh.join('');
  this.pieces = []; this.sheet = 0; this.chunks.innerHTML = ''; this.peel.innerHTML = '';
};
// partículas en suspensión sobre la cara cortada de la piscina (fijas: la artesa tiene agitador)
FDrum.prototype.motes = function (poly) {
  var xs = poly.map(function (p) { return p[0]; }), zs = poly.map(function (p) { return p[1]; }), x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), z0 = Math.min.apply(null, zs), z1 = Math.max.apply(null, zs), out = '', seed = 7, C = this.C;
  var rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  for (var i = 0; i < 70; i++) { var x = x0 + (x1 - x0) * rnd(), z = z0 + (z1 - z0) * rnd(); if (!inPoly(poly, x, z)) continue; var q = C.pr(x, 0, z); out += '<circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="' + (0.35 + rnd() * 0.45).toFixed(2) + '"/>'; }
  return '<g class="fd-motes">' + out + '</g>';
  function inPoly(p, x, y) { var c = false; for (var i = 0, j = p.length - 1; i < p.length; j = i++) { if ((p[i][1] > y) !== (p[j][1] > y) && x < (p[j][0] - p[i][0]) * (y - p[i][1]) / (p[j][1] - p[i][1]) + p[i][0]) c = !c; } return c; }
};
FDrum.prototype.zoneOf = function (th) { // zona de la válvula por la que pasa el sector que está en θ
  var phi = ((this.Z.thIn - th) / (2 * Math.PI)) % 1; if (phi < 0) phi += 1;
  var f = this.cfg.f, w0 = Math.min(f + 0.04, 0.76), w1 = Math.min(f + 0.2, 0.86);
  return phi < f ? 'filt' : (phi < w0 ? 'dew' : (phi < w1 ? 'wash' : (phi < 0.9 ? 'dry' : (phi < 0.97 ? 'blow' : 'idle'))));
};
FDrum.prototype.update = function (s) {
  if (!this.cfg) return;
  var C = this.C, D = this.D, R = DG.R, ZD = DG.ZD, L = DG.L, ang = s.ang || 0, dt = Math.max(0, s.dt || 0), self = this, i;
  var dAng = this.lastAng == null ? 0 : ang - this.lastAng; if (dAng < -Math.PI) dAng += 2 * Math.PI; if (dAng < 0) dAng = 0; this.lastAng = ang;
  this.t += dt;
  // 1 · la sección gira (el tambor gira con θ decreciendo)
  var deg = -ang * 180 / Math.PI;
  this.section.setAttribute('transform', 'rotate(' + deg.toFixed(2) + ')');
  for (i = 0; i < this.pipeEls.length; i++) { var th = (i * 15 + 7.5) * Math.PI / 180 - ang, z = this.zoneOf(th); if (this.pipeEls[i].__z !== z) { this.pipeEls[i].__z = z; this.pipeEls[i].setAttribute('data-z', z); } }
  // 2 · las juntas de los sectores sobre la camisa (solo las que miran al lector)
  var V = C.V, d = '';
  for (i = 0; i < 24; i++) { var t2 = (i * 15) * Math.PI / 180 - ang, nx = Math.cos(t2), nz = Math.sin(t2); if (nx * V[0] + nz * V[2] < 0.04) continue; var a = C.pr(R * nx, 0, ZD + R * nz), b = C.pr(R * nx, -L, ZD + R * nz); d += 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1); }
  this.drum_lines.innerHTML = d ? '<path class="iso-line" data-tone="lo" d="' + d + '"/>' : '';
  // 3 · agitador oscilante en el fondo de la artesa
  var sw = 22 * Math.sin(this.t * 1.6);
  this.agitator.innerHTML = '<g transform="rotate(' + (-90 + sw).toFixed(2) + ')"><rect class="fd-rake" x="94" y="-1.4" width="6" height="2.8"/><circle class="fd-rake" cx="97" cy="0" r="0.6"/></g>';
  // 4 · puntos de la torta que viajan con el tambor, sobre la cara cortada
  var cfg = this.cfg, Z = this.Z, dots = '', phiEnd = cfg.peel ? DG.PHIK : 1;
  for (i = 0; i < 90; i++) {
    var th0 = (i * 4 + (i % 3) * 1.3) * Math.PI / 180 - ang, phi = ((Z.thIn - th0) / (2 * Math.PI)) % 1; if (phi < 0) phi += 1;
    if (phi > phiEnd) continue; var tk = drawnAt(cfg.prof, phi); if (tk < 0.9) continue;
    var u = 0.25 + 0.5 * ((i * 37) % 11) / 10, rr = R + tk * u, p = C.pr(rr * Math.cos(th0), 0, ZD + rr * Math.sin(th0));
    dots += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="0.55"/>';
  }
  // 5 · flujos: el vacío arrastra el filtrado hacia los tubos; las regaderas mojan la torta
  this.offs -= dt * 26;
  var fl = '<g class="fd-cakedots">' + dots + '</g>';
  var drops = '';
  for (i = 0; i < 26; i++) {
    var ph = (i / 26) * cfg.f, thd = Z.thIn - ph * 2 * Math.PI, k = ((this.t * 0.9 + i * 0.37) % 1), r0 = R + Math.max(0.6, drawnAt(cfg.prof, ph)), r1 = 82, rr2 = r0 + (r1 - r0) * k;
    var pd = C.pr(rr2 * Math.cos(thd), 0, ZD + rr2 * Math.sin(thd)); drops += '<circle cx="' + pd[0].toFixed(1) + '" cy="' + pd[1].toFixed(1) + '" r="0.7"/>';
  }
  fl += '<g class="fd-filt">' + drops + '</g>';
  var spr = '';
  this.sprayList.forEach(function (sp) {
    for (var j = -1; j <= 1; j++) {
      var tt = sp.th + j * 0.09, ph2 = ((Z.thIn - tt) / (2 * Math.PI)) % 1; if (ph2 < 0) ph2 += 1;
      var rr3 = R + drawnAt(cfg.prof, ph2) + 0.4, a1 = C.pr(sp.p[0] - Math.cos(sp.th) * 2.4, sp.y, sp.p[1] - Math.sin(sp.th) * 2.4), b1 = C.pr(rr3 * Math.cos(tt), sp.y, ZD + rr3 * Math.sin(tt));
      spr += 'M' + a1[0].toFixed(1) + ' ' + a1[1].toFixed(1) + 'L' + b1[0].toFixed(1) + ' ' + b1[1].toFixed(1);
    }
  });
  this.sprays.innerHTML = '<path class="fp-flow fd-spray" style="stroke-dashoffset:' + this.offs.toFixed(1) + '" d="' + spr + '"/>';
  // en el plano de corte, el agua que sale de la punta de cada regadera cae sobre la torta
  var wd = '';
  washOf(cfg.f).forEach(function (p, n) {
    var th = Math.atan2(p[1] - ZD, p[0]);
    for (var j = 0; j < 7; j++) {
      var tt = th + (j - 3) * 0.035, ph3 = ((Z.thIn - tt) / (2 * Math.PI)) % 1; if (ph3 < 0) ph3 += 1;
      var k2 = ((self.t * 1.7 + j * 0.29 + n * 0.5) % 1), r0 = DG.R + DG.WASHR - 2.4, r1 = DG.R + drawnAt(cfg.prof, ph3) + 0.3, rr4 = r0 + (r1 - r0) * k2;
      var pw = C.pr(rr4 * Math.cos(tt), 0, ZD + rr4 * Math.sin(tt)); wd += '<circle cx="' + pw[0].toFixed(1) + '" cy="' + pw[1].toFixed(1) + '" r="0.6"/>';
    }
  });
  fl += '<g class="fd-washdrops">' + wd + '</g>';
  this.flows.innerHTML = fl;
  // 6 · el pelado: la torta sube por la hoja, se parte y baja por la canaleta a la banda
  var K = this.K, tkK = drawnAt(cfg.prof, Math.min(DG.PHIK, 0.935)), bl = Math.hypot(K.base[0] - K.T[0], K.base[1] - K.T[1]);
  if (cfg.peel && tkK > 0.3) {
    this.sheet += R * dAng;
    if (!this.brk) this.brk = 8;
    while (this.sheet > this.brk) { this.sheet -= this.brk; this.nb = (this.nb || 0) + 1; var sd0 = ((this.nb * 7919) % 97) / 97; this.pieces.push({ s: Math.max(0, bl - this.brk), v: 20, vmax: 55 + 30 * sd0, len: this.brk * 0.9, tk: tkK * (0.8 + 0.25 * sd0), st: 0, y: 0, z: 0, age: 0, rot: 0, seed: this.nb, tilt: (sd0 - 0.5) * 0.5 }); this.brk = 6 + 6 * (((this.nb * 104729) % 89) / 89); }
    var sl = Math.min(this.sheet, Math.min(bl, this.brk || 8)), off = 0.25;
    var p0 = [K.T[0] + K.up[0] * off, K.T[1] + K.up[1] * off], p1 = [p0[0] + K.b[0] * sl, p0[1] + K.b[1] * sl];
    this.peel.innerHTML = sl > 0.4 ? prismSvg(C, [p0, p1, [p1[0] + K.up[0] * tkK, p1[1] + K.up[1] * tkK], [p0[0] + K.up[0] * tkK, p0[1] + K.up[1] * tkK]], -L, 0, { axis: 'y', tone: 'mid', cls: 'fp-cake' }) : '';
  } else this.peel.innerHTML = '';
  // trozos: resbalan por la canaleta (la hoja y luego las placas), caen a la banda y la banda se los lleva
  var path = [K.T].concat(K.chute.slice(1)), segs = [], tot = 0;
  for (i = 0; i < path.length - 1; i++) { var ll = Math.hypot(path[i + 1][0] - path[i][0], path[i + 1][1] - path[i][1]); segs.push(ll); tot += ll; }
  var html = '', keep = [], beltMove = 0;
  for (i = 0; i < this.pieces.length; i++) {
    var pc = this.pieces[i]; pc.age += dt;
    var cx, cz, dir, shift = 0;
    if (pc.st === 0) {
      pc.v = Math.min(pc.vmax, pc.v + 160 * dt); pc.s += pc.v * dt;
      if (pc.s >= tot) { pc.st = 1; pc.vz = 0; pc.x = path[path.length - 1][0]; pc.z = path[path.length - 1][1]; pc.dx = 18; }
      else { var acc = pc.s, j = 0; while (j < segs.length - 1 && acc > segs[j]) { acc -= segs[j]; j++; } var A = path[j], B = path[j + 1], u2 = Math.min(1, acc / segs[j]); cx = A[0] + (B[0] - A[0]) * u2; cz = A[1] + (B[1] - A[1]) * u2; dir = [(B[0] - A[0]) / segs[j], (B[1] - A[1]) / segs[j]]; }
    }
    if (pc.st === 1) { pc.vz -= 981 * dt; pc.z += pc.vz * dt; pc.x += pc.dx * dt; pc.rot += dt * 2.5; if (pc.z <= D.BELT + pc.tk * 0.5) { pc.st = 2; pc.z = D.BELT + pc.tk * 0.5; pc.age = 0; } cx = pc.x; cz = pc.z; dir = [Math.cos(-0.6 - pc.rot), Math.sin(-0.6 - pc.rot)]; }
    if (pc.st === 2) { pc.y -= 34 * dt; cx = Math.min(D.CVX[1] - 4, Math.max(D.CVX[0] + 4, pc.x)); cz = D.BELT + pc.tk * 0.5; dir = [1, 0]; shift = pc.y; beltMove = 34; if (pc.age > 2.6) continue; }
    keep.push(pc);
    var hl = pc.len / 2, nrm = [-dir[1], dir[0]], ht = pc.tk / 2;
    var poly = [[cx - dir[0] * hl - nrm[0] * ht, cz - dir[1] * hl - nrm[1] * ht], [cx + dir[0] * hl - nrm[0] * ht, cz + dir[1] * hl - nrm[1] * ht], [cx + dir[0] * hl + nrm[0] * ht, cz + dir[1] * hl + nrm[1] * ht], [cx - dir[0] * hl + nrm[0] * ht, cz - dir[1] * hl + nrm[1] * ht]];
    if (pc.st !== 1) { var lift = ht + 0.55; poly = poly.map(function (q) { return [q[0] + nrm[0] * lift, q[1] + nrm[1] * lift]; }); }
    var op = pc.st === 2 ? Math.max(0, 1 - Math.max(0, pc.age - 1.6)) : 1, segs2 = '';
    // la torta sale en hojuelas: el trozo se parte también a lo largo del tambor
    var nseg = 3 + (pc.seed % 2), ycur = -L + 1;
    for (var q2 = 0; q2 < nseg; q2++) { var sd = ((pc.seed * 31 + q2 * 17) % 23) / 23, len2 = (L - 2) / nseg * (0.7 + 0.5 * sd), ya = ycur, yb = Math.min(-1, ya + len2); ycur = yb + 2 + 6 * sd; if (yb - ya < 4) continue; segs2 += prismSvg(C, poly, ya + shift, yb + shift, { axis: 'y', tone: 'mid', cls: 'fp-cake' }); if (ycur > -3) break; }
    html += '<g style="opacity:' + op.toFixed(2) + '">' + segs2 + '</g>';
  }
  this.pieces = keep.slice(-14); this.chunks.innerHTML = html;
  if (this.belt) { this.beltOff -= beltMove * dt * 0.8; this.belt.style.strokeDashoffset = this.beltOff.toFixed(1); }
};
