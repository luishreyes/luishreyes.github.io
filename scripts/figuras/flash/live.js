/* ====================================================================
   El sistema flash en vivo. La página le pasa, en cada cuadro, el caso
   que resolvió el modelo del explorador:
   · el estado ('2F', 'L' o 'V'), Ψ, V, L y F;
   · T y P del tambor, T_F y P₁ antes de la válvula, si hay calor (Q_H);
   · la velocidad del vapor en el tambor (gas ideal, con el diámetro del
     dibujo) y su límite de Souders-Brown con malla, y el tiempo de
     residencia del líquido; con ellas se mueven el gas y las gotas.
   Las gotas nacen en el deflector de la entrada con tamaños de 15 a
   800 µm; cada una cae o sube según su velocidad terminal frente a la del
   vapor (Schiller-Naumann). Las que suben llegan a la malla y quedan
   atrapadas; el líquido atrapado escurre por debajo en gotas grandes. Si
   el vapor pasa el límite, parte de las gotas atraviesa la malla.
   Cámara lenta: el tiempo del dibujo corre a TS del real.
   ==================================================================== */
function FFlash(host, D) {
  this.host = host; this.D = D; this.svg = host.querySelector('svg'); this.C = xCam(D.P);
  var self = this, q = function (s) { return self.svg.querySelector('[data-live="' + s + '"]'); };
  this.el = {}; ['liq', 'mist', 'gas', 'sight', 'lcol', 'tdrum', 'pdrum', 'p1', 'tf', 'psteam', 'pcv', 'lcv', 'fcv'].forEach(function (k) { self.el[k] = q(k); });
  this.t = 0; this.lev = FX.DR.lev; this.parts = []; this.pool = 0; this.seed = 7; this.spawnAcc = 0; this.dripAcc = 0;
  this.ang = {}; this.trav = { pcv: 0.5, lcv: 0.5, fcv: 0.55 };
  this.gas = []; for (var i = 0; i < 34; i++) this.gas.push(this.gasPoint(Math.random()));
  this.bub = []; for (var j = 0; j < 16; j++) this.bub.push({ x: Math.random(), y: Math.random(), s: 0.5 + Math.random() });
  this.pick = null; this.s = null;
}
FFlash.TS = 0.125; // cámara lenta ×1/8
FFlash.prototype.rnd = function () { this.seed = (this.seed * 16807) % 2147483647; return (this.seed - 1) / 2147483646; };
FFlash.prototype.W3 = function (u, v, z) { var T = this.D.T, H = this.D.HV; return [u * T[0] + v * H[0], u * T[1] + v * H[1], z]; };
FFlash.prototype.P2 = function (u, v, z) { var p = this.W3(u, v, z); return this.C.pr(p[0], p[1], p[2]); };
// ¿el punto (u, v) queda detrás del deflector, donde no se ve?
FFlash.prototype.hidden = function (u, v, z) { var p = this.W3(u, v, z), PL = FX.IN.plate; return p[0] < PL.x + 0.4 && z > PL.z0 - 1.5 && z < PL.z1 + 1.5; };
FFlash.prototype.gasPoint = function (f) { var R = FX.DR.R - 1.5, a = Math.PI * (1.05 + 0.9 * Math.random()), r = R * Math.sqrt(0.08 + 0.92 * Math.random()); return { u: r * Math.cos(a), v: Math.min(-0.8, r * Math.sin(a) * 0.62), f: f, k: 0.75 + 0.5 * Math.random() }; };
FFlash.prototype.colors = function (c) {
  var st = this.svg.style, f = function (v, d) { return 'rgb(' + v.map(function (x) { return Math.max(0, Math.min(255, Math.round(x * d))); }).join(',') + ')'; };
  if (c.x) { st.setProperty('--fl-x', f(c.x, 1)); st.setProperty('--fl-x-top', f(c.x.map(function (v) { return v + (255 - v) * 0.35; }), 1)); st.setProperty('--fl-x-edge', f(c.x, 0.62)); }
  if (c.y) st.setProperty('--fl-y', f(c.y, 0.9));
  if (c.z) { st.setProperty('--fl-z', f(c.z, 1)); st.setProperty('--fl-z-edge', f(c.z, 0.62)); }
};
// velocidad terminal (m/s) de una gota de d µm: Schiller-Naumann, por iteración
FFlash.vt = function (d, rL, rV, mu) {
  var dm = d * 1e-6, g = 9.81, v = g * dm * dm * (rL - rV) / (18 * mu);
  for (var i = 0; i < 30; i++) { var Re = Math.max(1e-6, rV * v * dm / mu), Cd = Re < 1000 ? 24 / Re * (1 + 0.15 * Math.pow(Re, 0.687)) : 0.44; v = Math.sqrt(4 * g * dm * (rL - rV) / (3 * Cd * rV)); }
  return v;
};
FFlash.prototype.dial = function (k, frac) {
  var el = this.el[k]; if (!el) return;
  var a = 225 - 270 * Math.max(-0.02, Math.min(1.03, isFinite(frac) ? frac : 0));
  el.setAttribute('transform', 'rotate(' + a.toFixed(1) + ')');
};
/* s = { state, psi, V, L, F, T, Tmax, P, Pmax, TF, P1, heat, ug (m/s), umax (m/s), rL, rV, dt, snap } */
FFlash.prototype.update = function (s) {
  // la primera vez corre unos segundos por dentro: en pausa o con movimiento reducido el tambor ya tiene su niebla
  if (!this.warmed) { this.warmed = true; var w = {}, k; for (k in s) w[k] = s[k]; w.snap = false; w.dt = 1 / 30; for (var it = 0; it < 150; it++) this.update(w); }
  var D = this.D, self = this, DR = FX.DR, R = DR.R, dt = Math.max(0, Math.min(0.1, s.dt || 0)), ease = function (k) { return s.snap ? 1 : Math.min(1, dt * k); };
  this.t += dt; this.s = s;
  var fin = function (v, d) { return isFinite(v) ? v : d; };
  s.psi = fin(s.psi, 0); s.V = fin(s.V, 0); s.L = fin(s.L, 0); s.F = fin(s.F, 1); s.ug = fin(s.ug, 0); s.umax = fin(s.umax, 0); s.T = fin(s.T, 0); s.P = fin(s.P, 0); s.P1 = fin(s.P1, 0); s.TF = fin(s.TF, 0);
  var two = s.state === '2F', allV = s.state === 'V', allL = s.state === 'L';
  // ---- el nivel: el control lo sostiene en su punto; sin líquido, el tambor se vacía
  var target = allV ? DR.z0 - DR.hd + 0.01 : DR.lev;
  this.lev += (target - this.lev) * ease(0.6);
  var zL = this.lev;
  this.drawLiquid(zL, two);
  // ---- el visor de nivel
  var L0 = D.LG.z0, L1 = D.LG.z1, g1 = Math.max(L0, Math.min(L1, zL));
  if (this.el.lcol) {
    if (g1 > L0 + 0.05) {
      var a = this.C.pr(0, D.LG.y, L0), b = this.C.pr(0, D.LG.y, g1), kk = this.C.pr(1, 0, 0), k0 = this.C.pr(0, 0, 0), w = 0.6 * Math.hypot(kk[0] - k0[0], kk[1] - k0[1]);
      this.el.lcol.innerHTML = '<path class="fl-col" d="M' + (a[0] - w).toFixed(2) + ' ' + a[1].toFixed(2) + 'L' + (a[0] + w).toFixed(2) + ' ' + a[1].toFixed(2) + 'L' + (b[0] + w).toFixed(2) + ' ' + b[1].toFixed(2) + 'L' + (b[0] - w).toFixed(2) + ' ' + b[1].toFixed(2) + 'Z"/>';
    } else this.el.lcol.innerHTML = '';
  }
  // ---- instrumentos
  this.dial('tdrum', (s.T || 0) / (s.Tmax || 200));
  this.dial('pdrum', (s.P || 0) / (s.Pmax || 4));
  this.dial('p1', (s.P1 || 0) / (s.P1max || 4));
  this.dial('tf', (s.TF || 0) / (s.TFmax || 300));
  this.stm = (this.stm || 0) + (((s.heat ? 3 : 0) / 6) - (this.stm || 0)) * ease(1.5);
  this.dial('psteam', this.stm);
  // ---- carrera de las válvulas de control: presión (vapor), nivel (líquido) y la de expansión
  var F = Math.max(1e-9, s.F || 1);
  [['pcv', allL ? 0 : 0.18 + 0.72 * (s.V / F)], ['lcv', allV ? 0 : 0.18 + 0.72 * (s.L / F)], ['fcv', 0.55]].forEach(function (q) {
    if (!isFinite(self.trav[q[0]])) self.trav[q[0]] = 0.5;
    self.trav[q[0]] += ((isFinite(q[1]) ? q[1] : self.trav[q[0]]) - self.trav[q[0]]) * ease(2);
    var V = D[q[0].toUpperCase()], el = self.el[q[0]]; if (!el || !V) return;
    var z = V.z0 + (V.z1 - V.z0) * self.trav[q[0]], n = V.nrm, c = [V.stem[0], V.stem[1]];
    var p = function (o, dz) { return self.C.pr(c[0] + n[0] * o, c[1] + n[1] * o, z + dz); };
    var A = p(0.55, -0.35), B = p(2.45, -0.35), Cc = p(2.45, 0.35), Dd = p(0.55, 0.35);
    el.innerHTML = '<path class="fl-ptr" d="M' + A.map(function (v) { return v.toFixed(2); }).join(' ') + 'L' + B.map(function (v) { return v.toFixed(2); }).join(' ') + 'L' + Cc.map(function (v) { return v.toFixed(2); }).join(' ') + 'L' + Dd.map(function (v) { return v.toFixed(2); }).join(' ') + 'Z"/>';
  });
  // ---- la mirilla de flujo: el chorro que sale de la válvula, ya flasheando
  this.drawSight(s, dt);
  // ---- gas, niebla y gotas en el tambor
  this.drawDrum(s, dt, zL);
};
FFlash.prototype.drawLiquid = function (zL, two) {
  var DR = FX.DR, R = DR.R, self = this, el = this.el.liq; if (!el) return;
  var bot = DR.z0 - DR.hd;
  if (zL <= bot + 0.3) { el.innerHTML = ''; return; }
  var rs = zL >= DR.z0 ? R : R * Math.sqrt(Math.max(0, 1 - Math.pow((DR.z0 - zL) / DR.hd, 2)));
  // la cara del corte: el fondo interior y el nivel, con una ola suave
  var pts = [], n = 28, i;
  for (i = 0; i <= n; i++) { var a = Math.PI / 2 * (i / n), u = -R * Math.cos(a), z = DR.z0 - DR.hd * Math.sin(a); if (z <= zL) pts.push([u, z]); }
  for (i = n; i >= 0; i--) { var a2 = Math.PI / 2 * (i / n), u2 = R * Math.cos(a2), z2 = DR.z0 - DR.hd * Math.sin(a2); if (z2 <= zL) pts.push([u2, z2]); }
  var face = [];
  if (zL > DR.z0) face.push([-R, zL]);
  pts.forEach(function (p) { face.push(p); });
  if (zL > DR.z0) face.push([R, zL]);
  var wave = [], m = 24; for (i = 0; i <= m; i++) { var uu = rs - 2 * rs * i / m; wave.push([uu, zL + 0.45 * Math.sin(uu * 0.35 + self.t * 2.2) * (two ? 1 : 0.4)]); }
  var d1 = face.concat(wave).map(function (p, j) { var q = self.P2(p[0], 0, p[1]); return (j ? 'L' : 'M') + q[0].toFixed(2) + ' ' + q[1].toFixed(2); }).join('') + 'Z';
  // la superficie: media elipse hacia atrás
  var top = []; for (i = 0; i <= 40; i++) { var th = Math.PI + Math.PI * i / 40, q2 = this.P2(rs * Math.cos(th), rs * Math.sin(th), zL); top.push((i ? 'L' : 'M') + q2[0].toFixed(2) + ' ' + q2[1].toFixed(2)); }
  // burbujas que suben en la cara del corte
  var bub = '';
  if (two) for (i = 0; i < 9; i++) { var f = (i * 0.37 + this.t * (0.18 + 0.05 * (i % 3))) % 1, ub = -R * 0.8 + 1.6 * R * ((i * 0.61) % 1), zb = (DR.z0 - DR.hd * 0.6) + (zL - DR.z0 + DR.hd * 0.6) * f; if (zb < zL - 0.8) { var qb = this.P2(ub, 0, zb); bub += '<circle class="fl-bub" cx="' + qb[0].toFixed(2) + '" cy="' + qb[1].toFixed(2) + '" r="' + (0.5 + 0.6 * f).toFixed(2) + '"/>'; } }
  el.innerHTML = '<path class="fl-liqtop" d="' + top.join('') + 'Z"/><path class="fl-liqface" d="' + d1 + '"/>' + bub;
};
FFlash.prototype.drawSight = function (s, dt) {
  var el = this.el.sight; if (!el) return;
  var r = this.D.SGR + 0.5, h = [], two = s.state === '2F', allV = s.state === 'V', psi = Math.max(0, Math.min(1, s.psi || 0)), sp = 4 + 14 * psi;
  h.push('<rect class="' + (allV ? 'fl-sg-v' : 'fl-sg-l') + '" x="' + (-r) + '" y="' + (-r) + '" width="' + (2 * r) + '" height="' + (2 * r) + '"/>');
  if (!s.snap) this.bubT = (this.bubT || 0) + dt * sp; var bt = this.bubT || 0;
  this.bub.forEach(function (b, i) {
    if (!two && !allV) return;
    var x = ((b.x * 2 * r + bt * b.s) % (2 * r)) - r, y = (b.y - 0.5) * 2 * r * 0.85;
    if (allV) h.push('<circle class="fl-mistdot" cx="' + x.toFixed(2) + '" cy="' + y.toFixed(2) + '" r="0.14"/>');
    else { var rr = 0.18 + 0.75 * psi * (0.4 + 0.6 * ((i * 0.37) % 1)); h.push('<circle class="fl-bubv" cx="' + x.toFixed(2) + '" cy="' + y.toFixed(2) + '" r="' + rr.toFixed(2) + '"/>'); }
  });
  el.innerHTML = h.join('');
};
FFlash.prototype.drawDrum = function (s, dt, zL) {
  var DR = FX.DR, R = DR.R, DEM = FX.DEM, PL = FX.IN.plate, self = this, two = s.state === '2F', allV = s.state === 'V', allL = s.state === 'L';
  var TS = FFlash.TS, ug = allL ? 0 : Math.max(0, s.ug || 0), ratio = s.umax > 0 ? ug / s.umax : 0, gv = ug * 100 * TS; // cm/s del dibujo
  var parts = this.parts, h = [], g = [];
  // -- nacen gotas en los bordes del deflector, tantas como líquido arrastra el chorro
  if (two && !s.snap) {
    this.spawnAcc += dt * (10 + 26 * Math.min(1, s.psi * 2.2)) * Math.min(1.6, 0.6 + (s.F || 100) / 160);
    while (this.spawnAcc > 1 && parts.length < 150) {
      this.spawnAcc -= 1;
      var e = this.rnd(), yy, zz;
      if (e < 0.6) { yy = -PL.y + 2 * PL.y * this.rnd(); zz = PL.z1 + 0.5; } else { yy = -PL.y - 0.6; zz = PL.z0 + (PL.z1 - PL.z0) * this.rnd(); }
      var d = 15 * Math.pow(800 / 15, Math.pow(this.rnd(), 1.5)), x0 = PL.x + 0.6;
      var u = x0 * D_T(this.D, 0) + yy * D_T(this.D, 1), v = x0 * this.D.HV[0] + yy * this.D.HV[1];
      if (v > -0.6) continue;
      parts.push({ u: u, v: v, z: zz, vu: (this.rnd() - 0.15) * 46, vv: (this.rnd() - 0.6) * 20, vz: (this.rnd() - 0.3) * 18, ph: this.rnd() * 6.28, d: d, vt: FFlash.vt(d, s.rL || 850, s.rV || 1.2, 1e-5) * 100 * TS, kind: 'm' });
    }
  }
  // -- la malla escurre lo que atrapa en gotas grandes
  if (this.pool > 0 && !s.snap) {
    this.dripAcc += dt * Math.min(6, 0.6 + this.pool * 0.25);
    while (this.dripAcc > 1 && parts.length < 170) {
      this.dripAcc -= 1; this.pool = Math.max(0, this.pool - 3);
      var rr = (R - 3) * Math.sqrt(this.rnd()), aa = Math.PI * (1.05 + 0.9 * this.rnd()), ud = rr * Math.cos(aa), vd = Math.min(-0.8, rr * Math.sin(aa) * 0.6);
      parts.push({ u: ud, v: vd, z: DEM.z0 - 0.3, vu: 0, vv: 0, vz: 0, d: 2500, vt: FFlash.vt(2500, s.rL || 850, s.rV || 1.2, 1e-5) * 100 * TS, kind: 'd', age: 0 });
    }
  }
  // -- movimiento: cada gota tiende a su velocidad neta (la del vapor menos la terminal)
  for (var i = parts.length - 1; i >= 0; i--) {
    var p = parts[i];
    if (!s.snap) {
      if (p.kind === 'd' && p.age < 0.7) { p.age += dt; continue; } // la gota crece colgada de la malla
      var kr = p.d < 120 ? 3 : (p.d < 400 ? 1.6 : 0.9), tu = p.d < 300 ? 6 * Math.sin(self.t * 0.9 + p.ph) : 0, tv = p.d < 300 ? 3 * Math.cos(self.t * 0.7 + p.ph * 1.3) : 0;
      p.vu += (tu - p.vu) * Math.min(1, dt * kr); p.vv += (tv - p.vv) * Math.min(1, dt * kr); p.vz += ((p.kind === 'd' ? 0 : gv) - p.vt - p.vz) * Math.min(1, dt * kr);
      p.u += p.vu * dt; p.v += p.vv * dt; p.z += p.vz * dt;
      var rr2 = Math.hypot(p.u, p.v); if (rr2 > R - 1.2) { p.u *= (R - 1.2) / rr2; p.v *= (R - 1.2) / rr2; p.vu = -p.vu * 0.3; }
      if (p.v > -0.6) { p.v = -0.6; p.vv = -Math.abs(p.vv); }
    }
    if (p.kind !== 'e' && p.z >= DEM.z0 - 0.2) {
      if (ratio > 1 && this.rnd() < Math.min(0.85, (ratio - 1) * 0.9)) { p.kind = 'e'; p.z = DEM.z1 + 0.3; }
      else { parts.splice(i, 1); this.pool += 1; continue; }
    }
    if (p.z <= zL + 0.2 || p.z < DR.z0 - DR.hd + 1 || (p.kind === 'e' && p.z > DR.z1 + 4)) { parts.splice(i, 1); continue; }
  }
  // -- dibujo: el gas (trazos que suben), las gotas y lo que escurre de la malla
  var gasOn = !allL && ug > 0;
  if (gasOn && !s.snap) this.gasT = (this.gasT || 0) + dt * gv;
  var gt = this.gasT || 0, z0g = Math.max(zL + 2, PL.z0 - 6), span = DEM.z0 - z0g - 1, top0 = DEM.z1 + 1, span2 = DR.z1 + 6 - top0;
  this.gas.forEach(function (q, j) {
    if (!gasOn) return;
    var below = j % 3 !== 0, base = below ? z0g : top0, sp = below ? span : span2; if (sp <= 2) return;
    var z = base + ((q.f * sp + gt * q.k) % sp), len = Math.min(6, 1.2 + gv * 0.18);
    if (below && self.hidden(q.u, q.v, z)) return;
    var a = self.P2(q.u, q.v, z), b = self.P2(q.u, q.v, Math.min(base + sp, z + len)), al = Math.sin(Math.PI * ((z - base) / sp));
    (below ? h : g).push('<path class="fl-gas" style="opacity:' + (0.15 + 0.5 * al).toFixed(2) + '" d="M' + a[0].toFixed(2) + ' ' + a[1].toFixed(2) + 'L' + b[0].toFixed(2) + ' ' + b[1].toFixed(2) + '"/>');
  });
  // el líquido que baja del borde inferior del deflector, en láminas
  if (two || allL) for (var k2 = 0; k2 < 4; k2++) {
    var yk = -PL.y + 3 + k2 * (2 * PL.y - 6) / 3, xk = PL.x - 0.4, uk = xk * D_T(this.D, 0) + yk * D_T(this.D, 1), vk = xk * this.D.HV[0] + yk * this.D.HV[1];
    var A = this.P2(uk, vk, PL.z0 - 0.2), B = this.P2(uk, vk, zL + 0.3);
    h.push('<path class="fl-sheet" style="stroke-dashoffset:' + (-(this.t * 30) % 40).toFixed(1) + '" d="M' + A[0].toFixed(2) + ' ' + A[1].toFixed(2) + 'L' + B[0].toFixed(2) + ' ' + B[1].toFixed(2) + '"/>');
  }
  parts.forEach(function (p) {
    if (self.hidden(p.u, p.v, p.z)) return;
    var q = self.P2(p.u, p.v, p.z), r = p.kind === 'd' ? 0.7 + Math.min(1, (p.age || 0) / 0.7) * 0.9 : 0.42 + 1.0 * Math.pow(Math.log(p.d / 15) / Math.log(800 / 15), 1.4);
    (p.kind === 'e' ? g : h).push('<circle class="' + (p.kind === 'e' ? 'fl-drop fl-esc' : 'fl-drop') + '" cx="' + q[0].toFixed(2) + '" cy="' + q[1].toFixed(2) + '" r="' + r.toFixed(2) + '"/>');
  });
  if (this.el.mist) this.el.mist.innerHTML = h.join('');
  if (this.el.gas) this.el.gas.innerHTML = g.join('');
  if (!two) this.pool = Math.max(0, this.pool - dt * 4);
};
function D_T(D, i) { return D.T[i]; }
/* resalta las piezas de un equipo (el que se toca o se fija) */
FFlash.prototype.highlight = function (key) {
  if (key === this.pick) return; this.pick = key;
  Array.prototype.forEach.call(this.svg.querySelectorAll('.it[data-pick]'), function (g) { g.classList.toggle('fl-on', !!key && g.getAttribute('data-pick') === key); });
};
