/* ====================================================================
   El ecofiltro en vivo. La página le pasa, en cada cuadro, el caso que
   resolvió el modelo del explorador:
   · f (Hz) y Q (m³/s) del ventilador V-101 A;
   · cin y cout (ppm) y el perfil C_G(h)/C_in a lo largo del lecho;
   · el consumo de la biopelícula en cada capa, normalizado (0 a 1);
   · el riego (recirculación en L/min, reposición en L/h) y la fracción
     del empaque que moja el aspersor;
   · el pH de la purga.
   Los puntos ámbar son moléculas de H₂S: entran con la carga del gas y,
   mientras suben por el lecho, cada una sobrevive un tramo con la
   probabilidad C_G(h + dh)/C_G(h); la que no sobrevive pasa a la película
   (se vuelve verde y se apaga). Así, la fracción que llega arriba es la
   que deja salir el lecho. Tiempos acelerados: el gas, ×8; el riego y el
   rotor, en cámara lenta.
   ==================================================================== */
function FEco(host, D) {
  this.host = host; this.D = D; this.svg = host.querySelector('svg'); this.C = xCam(D.P);
  var self = this, q = function (s) { return self.svg.querySelector('[data-live="' + s + '"]'); };
  this.el = {}; ['sump', 'gasLow', 'bedFlow', 'spray', 'gasHigh', 'imp', 'float', 'fcv', 'at1', 'at2', 'ph'].forEach(function (k) { self.el[k] = q(k); });
  this.bio = []; for (var i = 0; i < D.LAYERS; i++) this.bio.push(q('bio' + i));
  this.t = 0; this.rot = 0; this.seed = 11; this.mol = []; this.drop = []; this.acc = 0; this.accD = 0; this.s = null;
  this.trav = { fcv: 0.3 }; this.flt = 0.4;
  this.txt = {};
}
FEco.prototype.rnd = function () { this.seed = (this.seed * 16807) % 2147483647; return (this.seed - 1) / 2147483646; };
FEco.prototype.W3 = function (u, v, z) { var T = this.D.T, H = this.D.HV; return [u * T[0] + v * H[0], u * T[1] + v * H[1], z]; };
FEco.prototype.P2 = function (u, v, z) { var p = this.W3(u, v, z); return this.C.pr(p[0], p[1], p[2]); };
FEco.prototype.pt = function (u, v, z) { var p = this.P2(u, v, z); return p[0].toFixed(1) + ' ' + p[1].toFixed(1); };
FEco.fmt = function (v, d) { if (!isFinite(v)) return '—'; var s = Math.abs(v).toFixed(d), p = s.split('.'); return (v < 0 ? '−' : '') + p[0] + (p[1] ? ',' + p[1] : ''); };
/* C_G/C_in a la altura z del lecho, del perfil del modelo */
FEco.prototype.cg = function (z) {
  var pr = this.s && this.s.prof, B = FX.BED; if (!pr || !pr.length) return 1;
  if (z <= B.z0) return 1; if (z >= B.z1) return pr[pr.length - 1];
  var x = (z - B.z0) / (B.z1 - B.z0) * pr.length - 0.5, i = Math.floor(x);
  if (i < 0) return 1 + (pr[0] - 1) * ((z - B.z0) / (B.z1 - B.z0) * pr.length * 2);
  if (i >= pr.length - 1) return pr[pr.length - 1];
  return pr[i] + (pr[i + 1] - pr[i]) * (x - i);
};
FEco.prototype.liqColor = function (pH) {
  var st = this.svg.style, c;
  if (!isFinite(pH)) c = [150, 160, 168];
  else { var a = [200, 69, 43], b = [183, 121, 31], n = [89, 128, 166], f; if (pH < 2) { f = Math.max(0, Math.min(1, (pH - 0.5) / 1.5)); c = a.map(function (x, i) { return x + (b[i] - x) * f; }); } else { f = Math.max(0, Math.min(1, (pH - 2) / 4)); c = b.map(function (x, i) { return x + (n[i] - x) * f; }); } }
  var rgb = function (v, k) { return 'rgb(' + v.map(function (x) { return Math.round(Math.max(0, Math.min(255, x + (255 - x) * k))); }).join(',') + ')'; };
  st.setProperty('--ec-liq', rgb(c, 0.25)); st.setProperty('--ec-liq-top', rgb(c, 0.5));
};
FEco.prototype.text = function (k, v) { var el = this.el[k]; if (el && this.txt[k] !== v) { this.txt[k] = v; el.textContent = v; } };
/* s = { f, Q, cin, cout, prof, bio, wet, qrec, qmu, pH, dt, snap } */
FEco.prototype.update = function (s) {
  if (!this.warmed) { this.warmed = true; var w = {}, k; for (k in s) w[k] = s[k]; w.snap = false; w.dt = 1 / 30; for (var it = 0; it < 210; it++) this.update(w); }
  var dt = Math.max(0, Math.min(0.1, s.dt || 0)), self = this, R = FX.COL.R, B = FX.BED;
  this.t += dt; this.s = s;
  var QL = Math.max(0, (s.qrec || 0) + (s.qmu || 0) / 60), wet = Math.max(0, Math.min(1, s.wet == null ? 1 : s.wet)), liq = QL > 0.01;
  // ---- pantallas
  this.text('at1', FEco.fmt(s.cin, 0)); this.text('at2', FEco.fmt(s.cout, s.cout < 100 ? 1 : 0)); this.text('ph', FEco.fmt(s.pH, 1));
  this.liqColor(s.pH);
  // ---- biopelícula: el verde de cada capa con su consumo
  for (var i = 0; i < this.bio.length; i++) { var b = this.bio[i]; if (!b) continue; var o = liq && s.bio ? 0.05 + 0.4 * Math.max(0, Math.min(1, s.bio[i] || 0)) : 0; b.setAttribute('fill-opacity', o.toFixed(3)); }
  // ---- rotor del V-101 A: cámara lenta, 1/30 de la velocidad real a 1750 rpm con 60 Hz
  this.rot = (this.rot + dt * 360 * (1750 / 60) * ((s.f || 0) / 60) / 30) % 360;
  if (this.el.imp) this.el.imp.setAttribute('transform', 'rotate(' + this.rot.toFixed(1) + ')');
  // ---- rotámetro y válvula de la reposición
  var fl = Math.max(0, Math.min(1, (s.qrec || 0) / 400)); this.flt += (fl - this.flt) * (s.snap ? 1 : Math.min(1, dt * 3));
  this.drawFloat(this.flt);
  var tv = Math.max(0, Math.min(1, (s.qmu || 0) / 2000)); this.trav.fcv += (tv - this.trav.fcv) * (s.snap ? 1 : Math.min(1, dt * 2));
  this.drawStem();
  // ---- el fondo: el líquido con el color del pH
  this.drawSump(liq);
  // ---- moléculas de H₂S
  var uG = (s.Q || 0) / 7.3, vg = 133 * Math.max(0.15, Math.min(4, uG / 0.166)); // cm/s del dibujo (gas ×8)
  var rate = Math.min(90, 22 * (s.cin / 450) * ((s.Q || 0) / 1.2));
  this.acc += rate * dt;
  var IN = FX.IN, bx = -R + 44, mu0 = bx * this.D.T[0], mv0 = bx * this.D.HV[0]; // la boca del tubo de entrada, que descarga hacia abajo
  while (this.acc >= 1 && this.mol.length < 260) {
    this.acc -= 1;
    this.mol.push({ u: mu0 + (this.rnd() - 0.5) * 18, v: mv0 + (this.rnd() - 0.5) * 18, z: IN.z - 50, tu: (this.rnd() * 2 - 1) * (R - 12), st: 0, a: 1 });
  }
  if (this.acc > 4) this.acc = 0;
  var keep = [];
  this.mol.forEach(function (m) {
    if (m.st === 0) { // zona de entrada: baja un poco, se reparte y sube hasta la rejilla
      m.z += vg * 0.55 * dt; m.u += (m.tu - m.u) * Math.min(1, dt * 1.2); m.v += (-30 - m.v) * Math.min(1, dt * 0.8);
      if (m.z >= FX.GRID.z1) { m.st = 1; m.v = 0; m.z = B.z0; }
    } else if (m.st === 1) { // en el lecho: en la cara del corte; sobrevive tramo a tramo con el perfil
      var z0 = m.z; m.z += vg * dt * (0.85 + 0.3 * self.rnd()); m.u += Math.sin(self.t * 3 + m.tu) * 0.4;
      var c0 = self.cg(z0), c1 = self.cg(m.z), pS = c0 > 0 ? c1 / c0 : 0;
      if (self.rnd() > pS) { m.st = 3; m.a = 1; m.du = (self.rnd() < 0.5 ? -1 : 1) * 6; }
      else if (m.z >= B.z1) { m.st = 2; m.v = -self.rnd() * R * 0.55; }
    } else if (m.st === 2) { // sobre el lecho: sube hasta la malla y sale
      m.z += vg * dt; if (m.z >= FX.SPRAY.z - 8) return; // pasa entre los ramales y sigue a la malla
    } else { // pasó a la película: se vuelve verde y se apaga
      m.a -= dt * 1.6; m.u += m.du * dt; if (m.a <= 0) return;
    }
    keep.push(m);
  });
  this.mol = keep;
  // ---- gotas: de los aspersores mojados al lecho, por la cara del corte y del soporte al fondo
  var nN = FX.SPRAY.n, wetN = liq ? Math.max(1, Math.round(nN * wet)) : 0;
  if (liq) {
    this.accD += dt * Math.min(40, 9 * Math.sqrt(QL / 170));
    while (this.accD >= 1 && this.drop.length < 220) {
      this.accD -= 1;
      var nz = this.D.NOZ[Math.floor(this.rnd() * this.D.NOZ.length)];
      if (nz.i >= wetN) continue;
      this.drop.push({ u: nz.u + (this.rnd() - 0.5) * 22, v: nz.v + (this.rnd() - 0.5) * 22, z: nz.z, st: 0, w: this.rnd() * 6 });
    }
  }
  var keepD = [], uWet = -R + 2 * R * (wetN / nN);
  this.drop.forEach(function (d) {
    if (d.st === 0) { d.z -= 70 * dt; if (d.z <= FX.HOLD.z1) { if (d.u > uWet) return; d.st = 1; d.v = 0; d.z = B.z1; } }
    else if (d.st === 1) { d.z -= 34 * dt; d.w += dt * 4; if (d.z <= B.z0) { d.st = 2; d.v = -self.rnd() * (R - 20); d.z = FX.GRID.z0; } }
    else { d.z -= 90 * dt; if (d.z <= FX.SUMP.lev) return; }
    keepD.push(d);
  });
  this.drop = keepD;
  // ---- dibujo de lo que se mueve
  var low = '', bed = '', high = '', spray = '', r0 = 1.5;
  this.mol.forEach(function (m) {
    var p = self.P2(m.u, m.v, m.z), c = '<circle class="' + (m.st === 3 ? 'ec-molx' : 'ec-mol') + '" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + r0 + '"' + (m.st === 3 ? ' fill-opacity="' + Math.max(0, m.a).toFixed(2) + '"' : '') + '/>';
    if (m.st === 0) low += c; else if (m.st === 2) high += c; else bed += c;
  });
  this.drop.forEach(function (d) {
    var p = self.P2(d.u + (d.st === 1 ? Math.sin(d.w) * 2 : 0), d.v, d.z), c = '<ellipse class="ec-drop" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" rx="0.8" ry="1.3"/>';
    if (d.st === 0) spray += c; else if (d.st === 1) bed += c; else low += c;
  });
  // conos de los aspersores mojados, con opacidad según el riego
  var cones = '';
  if (liq) {
    var op = Math.min(0.32, 0.06 + 0.18 * Math.sqrt(QL / 170));
    this.D.NOZ.forEach(function (nz) {
      if (nz.i >= wetN) return;
      var tip = self.P2(nz.u, nz.v, nz.z), pts = [];
      for (var j = 0; j <= 12; j++) { var a = Math.PI * j / 12, rr = 16; pts.push(self.pt(nz.u + rr * Math.cos(a), nz.v - rr * 0.35 * Math.sin(a), FX.HOLD.z1 + 1)); }
      cones += '<path class="ec-cone" fill-opacity="' + op.toFixed(2) + '" d="M' + tip[0].toFixed(1) + ' ' + tip[1].toFixed(1) + 'L' + pts.join('L') + 'Z"/>';
    });
  }
  if (this.el.gasLow) this.el.gasLow.innerHTML = low;
  if (this.el.bedFlow) this.el.bedFlow.innerHTML = bed;
  if (this.el.gasHigh) this.el.gasHigh.innerHTML = high;
  if (this.el.spray) this.el.spray.innerHTML = cones + spray;
};
FEco.prototype.drawSump = function (liq) {
  var el = this.el.sump; if (!el) return;
  if (!liq && !this.s.keepSump) { el.innerHTML = ''; return; }
  var R = FX.COL.R - 0.3, z0 = FX.COL.z0, zl = FX.SUMP.lev, self = this, face = [self.pt(-R, 0, z0), self.pt(R, 0, z0), self.pt(R, 0, zl), self.pt(-R, 0, zl)], top = [];
  for (var i = 0; i <= 40; i++) { var a = Math.PI + Math.PI * i / 40; top.push(self.pt(R * Math.cos(a), R * Math.sin(a), zl)); }
  el.innerHTML = '<path class="ec-liqtop" d="M' + top.join('L') + 'Z"/><path class="ec-liqface" d="M' + face.join('L') + 'Z"/>';
};
FEco.prototype.drawFloat = function (f) {
  var el = this.el.float; if (!el) return;
  var M = this.D.RM, z = M.z0 + (M.z1 - M.z0) * f, c = M.c, C = this.C, n = M.n;
  var at = function (dz, rr, a) { var tx = Math.cos(a), ty = Math.sin(a); return C.pr(c[0] + rr * tx, c[1] + rr * ty, z + dz); };
  var top = [], bot = [];
  for (var i = 0; i <= 16; i++) { var a = 2 * Math.PI * i / 16; top.push(at(0, 3.2, a)); }
  var tip = C.pr(c[0], c[1], z - 5);
  var hull = top.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); });
  el.innerHTML = '<path class="ec-float" d="M' + tip[0].toFixed(1) + ' ' + tip[1].toFixed(1) + 'L' + hull.join('L') + 'Z"/><path class="ec-float" d="M' + hull.join('L') + 'Z"/>';
};
FEco.prototype.drawStem = function () {
  var el = this.el.fcv, V = this.D.FCV; if (!el || !V) return;
  var z = V.z0 + (V.z1 - V.z0) * this.trav.fcv, C = this.C, n = V.nrm, base = [V.stem[0] + n[0] * 0.2, V.stem[1] + n[1] * 0.2, z];
  var a = C.pr(base[0], base[1], z), b = C.pr(base[0] + n[0] * 3.2, base[1] + n[1] * 3.2, z);
  el.innerHTML = '<path class="ec-ptr" d="M' + a[0].toFixed(1) + ' ' + (a[1] - 0.5).toFixed(1) + 'L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1) + 'L' + a[0].toFixed(1) + ' ' + (a[1] + 0.5).toFixed(1) + 'Z"/>';
};
FEco.prototype.highlight = function (key) {
  var items = this.svg.querySelectorAll('.it[data-pick]');
  for (var i = 0; i < items.length; i++) items[i].classList.toggle('ec-on', !!key && items[i].getAttribute('data-pick') === key);
};
