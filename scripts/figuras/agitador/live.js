/* ====================================================================
   El reactor agitado en vivo. La página le pasa, en cada cuadro, la
   escena del explorador (TankScene): el resultado del modelo R (la
   geometría, el impulsor, el régimen, el vórtice, los sólidos y el gas),
   el campo de flujo F, el trazador y las partículas, que viven en metros
   con z hacia arriba desde el fondo. Todo se pinta en un lienzo encima
   del dibujo, en las mismas coordenadas del SVG.
   El dibujo es la mitad de atrás del recipiente: solo se pinta lo que
   queda detrás del plano del corte (y > 0 en el modelo), salvo la mitad
   de adelante del eje y del impulsor, que no se cortan. El trazador, el
   mapa de velocidad y las líneas de corriente van en la cara del corte,
   reflejados a ambos lados del eje, como en la pestaña 1.
   Del modelo al dibujo: k = 100/T; x del modelo va hacia −T, y hacia
   −HV (atrás) y z hacia arriba (así el giro conserva su sentido).
   ==================================================================== */
function FAgit(host, D) {
  this.host = host; this.D = D; this.C = xCam(D.P);
  this.svg = host.querySelector('svg'); this.cv = host.querySelector('canvas.ag-live'); this.ctx = this.cv.getContext('2d');
  var C = this.C, o = C.pr(0, 0, 0), d = function (v) { var p = C.pr(v[0], v[1], v[2]); return [p[0] - o[0], p[1] - o[1]]; };
  this.o = o; this.eT = d(D.T); this.eV = d(D.HV); this.eZ = d([0, 0, 1]);
  var L = C.L; this.Lm = [-(L[0] * D.T[0] + L[1] * D.T[1]), -(L[0] * D.HV[0] + L[1] * D.HV[1]), L[2]];
  this.cE = Math.cos(D.EL * Math.PI / 180); this.sE = Math.sin(D.EL * Math.PI / 180);
  this.M = [1, 0, 0]; this.px = 1;
}
/* el lienzo cubre la caja de la figura; su transformación sigue al viewBox (el acercamiento solo cambia el viewBox) */
FAgit.prototype.fit = function () {
  var cv = this.cv, r = this.svg.getBoundingClientRect(), b = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
  var w = Math.max(1, Math.round(b.width * dpr)), h = Math.max(1, Math.round(b.height * dpr));
  if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
  var vb = (this.svg.getAttribute('viewBox') || '0 0 ' + this.D.W + ' ' + this.D.H).split(/[ ,]+/).map(Number);
  var s = Math.min(r.width / vb[2], r.height / vb[3]) || 1;
  this.M = [dpr * s, dpr * (r.left - b.left + (r.width - vb[2] * s) / 2 - vb[0] * s), dpr * (r.top - b.top + (r.height - vb[3] * s) / 2 - vb[1] * s)];
  this.px = 1 / s; this.vb = vb; this.box = r;
};
/* del modelo (m) al SVG */
FAgit.prototype.basis = function (k) {
  var o = this.o, T = this.eT, V = this.eV, Z = this.eZ;
  this.k = k; this.A = [o[0], -k * T[0], -k * V[0], k * Z[0], o[1], -k * T[1], -k * V[1], k * Z[1]];
};
FAgit.prototype.S = function (x, y, z) { var A = this.A; return [A[0] + A[1] * x + A[2] * y + A[3] * z, A[4] + A[5] * x + A[6] * y + A[7] * z]; };
/* qué tan cerca del lector queda un punto del modelo (más es más cerca) */
FAgit.prototype.near = function (x, y, z) { return -y * this.cE + z * this.sE; };
FAgit.prototype.metal = function (sh) {
  var b = this.blue ? [205, 222, 240] : [118, 131, 146], hi = this.blue ? [240, 247, 255] : [214, 222, 230];
  return 'rgb(' + Math.round(b[0] + (hi[0] - b[0]) * sh) + ',' + Math.round(b[1] + (hi[1] - b[1]) * sh) + ',' + Math.round(b[2] + (hi[2] - b[2]) * sh) + ')';
};
FAgit.prototype.poly = function (pts, close) { var c = this.ctx; c.beginPath(); for (var i = 0; i < pts.length; i++) { if (i) c.lineTo(pts[i][0], pts[i][1]); else c.moveTo(pts[i][0], pts[i][1]); } if (close !== false) c.closePath(); };
/* ¿la partícula queda detrás de un bafle visto desde el lector? (el rayo hacia el lector corre hacia −y y sube) */
FAgit.prototype.behindBaffle = function (x, y, z) {
  var bf = this.bafs; if (!bf) return '';
  var hit = '';
  for (var i = 0; i < bf.length; i++) {
    var b = bf[i]; if (Math.abs(b.c) < 1e-6) continue;
    var t = x / b.c; if (t < b.r0 || t > b.r1) continue;
    var yb = t * b.s; if (yb >= y) continue;
    var zr = z + (y - yb) * this.sE / this.cE; if (zr > b.z0 && zr < b.z1) { if (b.front) return 'f'; hit = 'b'; }
  }
  return hit;
};
FAgit.prototype.draw = function (sc) {
  var R = sc.R, F = sc.F; if (!R || !F) return;
  this.fit();
  var c = this.ctx, cv = this.cv, M = this.M, self = this, g = R.geo, k = 100 / g.T, Rm = g.T / 2, H = g.H, px = this.px, i, glass = !!this.D.glass;
  var th = this.host.closest ? this.host.closest('[data-theme]') : null; this.blue = !!th && th.getAttribute('data-theme') === 'blueprint';
  this.basis(k);
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, cv.width, cv.height);
  c.setTransform(M[0], 0, 0, M[0], M[1], M[2]);
  var flu = R.fl.color || '#3F86D1', ink = this.blue ? '#e6eef7' : '#1c1b1a', paper = this.blue ? '#12304d' : '#ffffff', view = sc.view || {};
  var zr = sc.zs(Rm), tw = sc.ts || 0, hl = this.blue ? '#FFBF00' : '#5980A6';
  var amp = R.baff && R.Re > 2000 ? Math.min(0.02 * R.tip * R.tip / (2 * 9.81), 0.008 * g.T) : 0;
  var wob = amp ? function (x) { return amp * (Math.sin(9 * x / Rm + tw * 3.1) * 0.6 + Math.sin(17 * x / Rm - tw * 4.3) * 0.4); } : function () { return 0; };
  var S = function (x, y, z) { return self.S(x, y, z); };
  // ---- 1 · el volumen de líquido: en el corte, la mitad de atrás; en el vidrio, todo el cilindro
  var vol = [];
  if (glass) {
    for (i = 0; i <= 40; i++) { var pa = Math.PI + Math.PI * i / 40; vol.push(S(Rm * Math.cos(pa), Rm * Math.sin(pa), 0)); }
    for (i = 0; i <= 40; i++) { var pb = Math.PI * i / 40; vol.push(S(Rm * Math.cos(pb), Rm * Math.sin(pb), zr)); }
  } else {
    vol.push(S(Rm, 0, 0), S(Rm, 0, zr));
    for (i = 0; i <= 40; i++) { var ph = Math.PI * i / 40; vol.push(S(Rm * Math.cos(ph), Rm * Math.sin(ph), zr)); }
    vol.push(S(-Rm, 0, zr), S(-Rm, 0, 0));
  }
  this.poly(vol); c.fillStyle = flu; c.globalAlpha = this.blue ? 0.16 : (glass ? 0.12 : 0.1); c.fill(); c.globalAlpha = 1;
  // ---- 2 · el plano del eje: la cara del corte (o, en el vidrio, solo los mapas), el trazador y las líneas de corriente
  var face = [S(-Rm, 0, 0), S(Rm, 0, 0)];
  for (i = 0; i <= 60; i++) { var x = Rm - 2 * Rm * i / 60; face.push(S(x, 0, sc.zs(Math.abs(x)) + wob(x))); }
  var planeLayer = function () {
    c.save(); self.poly(face);
    if (!glass) { c.fillStyle = flu; c.globalAlpha = self.blue ? 0.16 : 0.1; c.fill(); c.globalAlpha = 1; }
    c.clip();
    var maps = [];
    if (view.map) maps.push('speed');
    if (view.dye && sc.tr && sc.tr.on) maps.push('dye');
    maps.forEach(function (w) {
      var off = sc.mapCanvas(w); if (!off) return;
      var A = self.A, sx = F.Rr / F.NR, sz = F.H / F.NZ;
      [-1, 1].forEach(function (sd) {
        c.save(); c.transform(sd * sx * A[1], sd * sx * A[5], -sz * A[3], -sz * A[7], A[0] + F.H * A[3], A[4] + F.H * A[7]);
        c.imageSmoothingEnabled = true; c.globalAlpha = w === 'speed' ? 0.85 : (glass ? 0.85 : 1); c.drawImage(off, 0, 0); c.restore();
      });
    });
    if (view.stream && sc.lines) {
      c.strokeStyle = self.blue ? 'rgba(255,255,255,0.8)' : ink; c.lineWidth = 1.3 * px; c.setLineDash([6 * px, 8 * px]); c.lineDashOffset = -(sc.tw || 0) * 28 * px;
      [-1, 1].forEach(function (sd) { sc.lines.forEach(function (ln) { c.globalAlpha = 0.35 + 0.4 * ln.lev; self.poly(ln.pts.map(function (q) { return S(sd * q[0], 0, q[1]); }), false); c.stroke(); }); });
      c.setLineDash([]); c.globalAlpha = 1;
    }
    c.restore();
  };
  if (!glass) planeLayer();
  // ---- 3 · los bafles: en el corte quedan los dos de atrás; en el vidrio, los cuatro
  this.bafs = R.baff ? (glass ? [1, 3, 5, 7] : [1, 3]).map(function (j) { var a = j * Math.PI / 4; return { a: a, c: Math.cos(a), s: Math.sin(a), r0: Rm - g.B, r1: Rm * 0.995, z0: 0.02 * H, z1: (self.D.Z1 - 4) / k, front: Math.sin(a) < 0 }; }) : null;
  var parts = view.parts ? sc.parts : [], sol = view.sol && R.sol ? sc.sol : [], bub = view.gas ? sc.bub.concat(sc.gasB) : [];
  var hidB = [], hidF = [], far = [], near = [], front = [], yImp = 0.5 * g.D;
  function sortIn(p, kind) {
    if (!glass && p.y <= 0.002 * Rm) { if (kind === 'p') p.fn = 0; return; }
    var e = { p: p, k: kind }, bb = self.behindBaffle(p.x, p.y, p.z);
    if (bb === 'b') hidB.push(e); else if (bb === 'f') hidF.push(e); else if (p.y > yImp) far.push(e); else if (p.y > -yImp) near.push(e); else front.push(e);
  }
  for (i = 0; i < parts.length; i++) sortIn(parts[i], 'p');
  for (i = 0; i < sol.length; i++) sortIn(sol[i], 's');
  for (i = 0; i < bub.length; i++) sortIn(bub[i], 'b');
  var ref = Math.max(0.15 * R.tip, 0.6 * F.umax, 1e-4), rec = sc.running && sc.dts > 0 && ((sc.frame || 0) % 2 === 0), K = 12;
  var solRest = this.blue ? '#e2b77a' : '#7a5230', solMov = this.blue ? '#f0cf9a' : '#9c6b3e';
  // tamaño y opacidad según la profundidad: en el corte, de la pared de atrás al plano; en el vidrio, de atrás adelante
  var depthOf = glass ? function (y) { return Math.max(0, Math.min(1, 0.5 - 0.5 * y / Rm)); } : function (y) { return Math.max(0, Math.min(1, 1 - y / Rm)); };
  function drawSet(arr) {
    c.lineCap = 'round'; c.lineJoin = 'round';
    for (var n = 0; n < arr.length; n++) {
      var e = arr[n], p = e.p, q = S(p.x, p.y, p.z), fr = depthOf(p.y);
      if (e.k === 'p') {
        if (!p.fh) { p.fh = new Float32Array(2 * K); p.fn = 0; p.fi = 0; }
        if (rec || !p.fn) {
          var li = (p.fi - 1 + K) % K;
          if (p.fn && Math.hypot(q[0] - p.fh[2 * li], q[1] - p.fh[2 * li + 1]) > 14) p.fn = 0;
          p.fh[2 * p.fi] = q[0]; p.fh[2 * p.fi + 1] = q[1]; p.fi = (p.fi + 1) % K; if (p.fn < K) p.fn++;
        }
        var cc = palRGB(Math.sqrt(clamp(p.sp / ref, 0, 1))), col = 'rgb(' + (cc[0] | 0) + ',' + (cc[1] | 0) + ',' + (cc[2] | 0) + ')';
        c.strokeStyle = col; c.globalAlpha = 0.25 + 0.6 * fr; c.lineWidth = (0.7 + 1.0 * fr) * px;
        c.beginPath(); var st = (p.fi - p.fn + K) % K;
        for (var m = 0; m < p.fn; m++) { var kk = (st + m) % K; if (m) c.lineTo(p.fh[2 * kk], p.fh[2 * kk + 1]); else c.moveTo(p.fh[2 * kk], p.fh[2 * kk + 1]); }
        c.lineTo(q[0], q[1] + 0.01); c.stroke();
        c.globalAlpha = 0.4 + 0.55 * fr; c.fillStyle = col; c.beginPath(); c.arc(q[0], q[1], (0.8 + 0.8 * fr) * px, 0, 6.2832); c.fill();
      } else if (e.k === 's') {
        c.globalAlpha = 0.45 + 0.55 * fr; c.fillStyle = p.rest ? solRest : solMov; c.beginPath(); c.arc(q[0], q[1], (1.3 + 1.3 * fr) * px, 0, 6.2832); c.fill();
      } else {
        var rb = (1.0 + 1.1 * (p.d || 1)) * (0.7 + 0.5 * fr) * px;
        c.globalAlpha = 0.45 + 0.45 * fr; c.fillStyle = '#fff'; c.beginPath(); c.arc(q[0], q[1], rb, 0, 6.2832); c.fill();
        c.globalAlpha = 0.25 + 0.4 * fr; c.lineWidth = 0.7 * px; c.strokeStyle = self.blue ? '#9fb6cc' : ink; c.stroke();
      }
    }
    c.globalAlpha = 1;
  }
  drawSet(hidB);
  if (this.bafs) this.bafs.forEach(function (b) { if (!b.front) self.baffle(b, k); });
  // ---- 4 · el distribuidor de gas (mitad de atrás) y su tubo
  var spr = R.gas ? { rs: 0.4 * g.D, z: sc.spZ() } : null;
  if (spr) this.sparger(spr, false, k);
  drawSet(far);
  // ---- 5 · el impulsor: lo de atrás del plano antes de las partículas cercanas, lo de adelante después
  var polys = sc.impPolys(sc.rot).map(function (o) { var y = 0, n = 0; o.p.forEach(function (q) { y += q[1]; n += self.near(q[0], q[1], q[2]); }); o.y = y / o.p.length; o.n = n / o.p.length; return o; });
  polys.sort(function (a, b) { return a.n - b.n; });
  var blur = Math.abs(R.omega * (sc.dts || 0)) > 0.35 && sc.running;
  polys.forEach(function (o) { if (o.y > 0 && o.k !== 'hub') self.blade(o, blur ? 0.6 : 1); });
  if (glass) planeLayer();
  drawSet(near);
  // ---- 6 · lo que no se corta: la mitad de adelante del distribuidor, el eje y el impulsor
  if (spr) this.sparger(spr, true, k);
  this.shaft(R, k);
  polys.forEach(function (o) { if (o.y <= 0 || o.k === 'hub') self.blade(o, blur && o.k !== 'hub' ? 0.6 : 1); });
  if (blur && !R.imp.close) { var ce = S(0, 0, g.C); c.strokeStyle = hl; c.globalAlpha = 0.35; c.lineWidth = 1.1 * px; c.setLineDash([3 * px, 4 * px]); c.beginPath(); c.ellipse(ce[0], ce[1], Math.hypot(this.A[1], this.A[5]) * g.D / 2, Math.hypot(this.A[2], this.A[6]) * g.D / 2, Math.atan2(this.A[5], this.A[1]), 0, 6.2832); c.stroke(); c.setLineDash([]); c.globalAlpha = 1; }
  // ---- 7 · en el vidrio, lo de adelante: lo que queda detrás de los bafles de adelante, esos bafles y las partículas del frente
  if (glass) { drawSet(hidF); if (this.bafs) this.bafs.forEach(function (b) { if (b.front) self.baffle(b, k); }); drawSet(front); }
  // ---- 8 · la superficie libre (con el embudo si hay vórtice) y su perfil en el plano del eje
  var surf = [];
  for (i = 0; i <= 60; i++) { var xs = Rm - 2 * Rm * i / 60; surf.push(S(xs, 0, sc.zs(Math.abs(xs)) + wob(xs))); }
  var rim = [];
  for (i = 0; i <= 40; i++) { var p2 = Math.PI - Math.PI * i / 40; rim.push(S(Rm * Math.cos(p2), Rm * Math.sin(p2), zr)); }
  if (glass) { var rimF = []; for (i = 0; i <= 40; i++) { var p3 = Math.PI + Math.PI * i / 40; rimF.push(S(Rm * Math.cos(p3), Rm * Math.sin(p3), zr)); } this.poly(rim.concat(rimF)); }
  else this.poly(surf.concat(rim));
  c.fillStyle = flu; c.globalAlpha = this.blue ? 0.26 : 0.2; c.fill(); c.globalAlpha = 1;
  c.strokeStyle = hl; c.lineWidth = 1.6 * px; this.poly(surf, false); c.stroke();
  c.lineWidth = 0.9 * px; c.globalAlpha = 0.55; this.poly(rim, false); c.stroke(); c.globalAlpha = 1;
  if (glass) { c.lineWidth = 1.1 * px; c.globalAlpha = 0.75; this.poly(rimF || [], false); c.stroke(); c.globalAlpha = 1; }
  // ---- 9 · las sondas del trazador, el frente del vidrio y las cotas
  if (view.dye && sc.tr && sc.tr.on) this.probes(sc, k);
  if (glass) this.glassFront(R, k, sc);
  if (view.dims) this.dims(R, k, ink, paper);
  c.setTransform(1, 0, 0, 1, 0, 0);
};
/* el frente del vidrio, delante de todo lo de adentro: el borde, las aristas, el canto del fondo y los brillos */
FAgit.prototype.glassFront = function (R, k, sc) {
  var c = this.ctx, D = this.D, self = this, ro = (D.R + D.TW) / k, ri = D.R / k, zt = D.Z1 / k, zb = -D.BT / k, px = this.px, i;
  var arc = function (r, z, a0, a1, n) { var o = []; for (var j = 0; j <= n; j++) { var a = a0 + (a1 - a0) * j / n; o.push(self.S(r * Math.cos(a), r * Math.sin(a), z)); } return o; };
  // un velo muy leve sobre la mitad de adelante
  var veil = arc(ro, zb, Math.PI, 2 * Math.PI, 40).concat(arc(ro, zt, 2 * Math.PI, Math.PI, 40));
  this.poly(veil); c.fillStyle = this.blue ? 'rgba(200,225,255,0.05)' : 'rgba(225,238,245,0.18)'; c.fill();
  // brillos verticales (dos franjas a la izquierda del centro, del lado de la luz)
  [[Math.PI * 1.32, 0.05, 0.55], [Math.PI * 1.41, 0.02, 0.32], [Math.PI * 1.8, 0.03, 0.22]].forEach(function (q) {
    var a = q[0], w = q[1], b0 = self.S(ro * Math.cos(a - w), ro * Math.sin(a - w), zb + 0.08 * (zt - zb)), b1 = self.S(ro * Math.cos(a + w), ro * Math.sin(a + w), zb + 0.08 * (zt - zb));
    var t0 = self.S(ro * Math.cos(a + w), ro * Math.sin(a + w), zt - 0.06 * (zt - zb)), t1 = self.S(ro * Math.cos(a - w), ro * Math.sin(a - w), zt - 0.06 * (zt - zb));
    var gr = c.createLinearGradient(0, b0[1], 0, t0[1]); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, 'rgba(255,255,255,' + (self.blue ? q[2] * 0.4 : q[2]) + ')'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    self.poly([b0, b1, t0, t1]); c.fillStyle = gr; c.fill();
  });
  // las aristas: las dos verticales de la silueta, el borde de arriba (adelante) y el canto del fondo
  var edge = this.blue ? 'rgba(230,238,247,0.85)' : 'rgba(28,27,26,0.55)';
  var lft = this.S(ro, 0, zb), lft2 = this.S(ro, 0, zt), rgt = this.S(-ro, 0, zb), rgt2 = this.S(-ro, 0, zt);
  c.strokeStyle = edge; c.lineWidth = 0.9 * px;
  c.beginPath(); c.moveTo(lft[0], lft[1]); c.lineTo(lft2[0], lft2[1]); c.moveTo(rgt[0], rgt[1]); c.lineTo(rgt2[0], rgt2[1]); c.stroke();
  this.poly(arc(ro, zb, Math.PI, 2 * Math.PI, 40), false); c.stroke();
  this.poly(arc(ri, 0, Math.PI, 2 * Math.PI, 40), false); c.globalAlpha = 0.5; c.stroke(); c.globalAlpha = 1;
  // el labio de arriba: corona de adelante, clara
  var lip = arc(ro, zt, Math.PI, 2 * Math.PI, 40).concat(arc(ri, zt, 2 * Math.PI, Math.PI, 40));
  this.poly(lip); c.fillStyle = this.blue ? 'rgba(230,240,250,0.55)' : 'rgba(250,252,253,0.9)'; c.fill(); c.lineWidth = 0.8 * px; c.stroke();
  // la pantalla del motor: las rpm del caso
  var sc0 = D.ends.screen; if (sc0 && R.s) {
    var cen = this.C.pr(sc0.c[0], sc0.c[1], sc0.c[2]), eT = this.eT, eZ = this.eZ;
    c.save(); c.transform(eT[0], eT[1], -eZ[0], -eZ[1], cen[0], cen[1]);
    c.fillStyle = '#16302a'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = '700 2.7px ' + (getComputedStyle(this.host).getPropertyValue('--font-mono') || 'monospace');
    c.fillText(fmtN(R.s.rpm, R.s.rpm < 10 ? 1 : 0) + ' rpm', 0, 0.2); c.restore();
  }
};
FAgit.prototype.baffle = function (b, k) {
  var c = this.ctx, self = this, ca = b.c, sa = b.s, S = function (r, z) { return self.S(r * ca, r * sa, z); };
  // la placa, sus dos caras y el canto de adentro, con tres grapas a la pared
  var pts = [S(b.r0, b.z0), S(b.r1, b.z0), S(b.r1, b.z1), S(b.r0, b.z1)];
  var n = [-sa, ca, 0], sh = 0.3 + 0.6 * Math.abs(n[0] * this.Lm[0] + n[1] * this.Lm[1]);
  this.poly(pts); c.fillStyle = this.metal(sh); c.globalAlpha = 0.92; c.fill(); c.globalAlpha = 1;
  c.strokeStyle = this.blue ? '#e6eef7' : '#1c1b1a'; c.lineWidth = 0.7 * this.px; c.globalAlpha = 0.75; c.stroke(); c.globalAlpha = 1;
  var g0 = 0.15 * (b.r1 - b.r0), cl = [0.12, 0.5, 0.88];
  cl.forEach(function (f) { var z = b.z0 + f * (b.z1 - b.z0), h = 1.6 / k; self.poly([S(b.r1 - g0, z), S(b.r1 / 0.995, z), S(b.r1 / 0.995, z + h), S(b.r1 - g0, z + h)]); c.fillStyle = self.metal(0.4); c.fill(); c.lineWidth = 0.5 * self.px; c.stroke(); });
};
FAgit.prototype.blade = function (o, alpha) {
  var c = this.ctx, self = this, pp = o.p.map(function (q) { return self.S(q[0], q[1], q[2]); }), sh = 0.5;
  if (o.p.length >= 3) {
    var a = o.p[0], b = o.p[1], d = o.p[o.p.length - 1], u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [d[0] - a[0], d[1] - a[1], d[2] - a[2]];
    var n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]], nn = Math.hypot(n[0], n[1], n[2]) || 1, L = this.Lm;
    sh = 0.25 + 0.75 * Math.abs((n[0] * L[0] + n[1] * L[1] + n[2] * L[2]) / nn);
  }
  if (o.k === 'disk') sh = 0.85;
  if (o.k === 'hub') sh = 0.6;
  c.globalAlpha = alpha; this.poly(pp); c.fillStyle = this.metal(sh); c.fill();
  c.lineWidth = (o.k === 'rib' ? 0.45 : 0.8) * this.px; c.strokeStyle = this.blue ? '#e6eef7' : '#1c1b1a'; c.globalAlpha = alpha * (o.k === 'rib' ? 0.5 : 0.85); c.stroke(); c.globalAlpha = 1;
};
/* el eje: de la boquilla de la corona al cubo del impulsor, con el brillo del lado de la luz */
FAgit.prototype.shaft = function (R, k) {
  var c = this.ctx, g = R.geo, top = this.D.shaftTop / k, bot = R.imp.close ? g.C + 0.1 * g.D : g.C, a = this.S(0, 0, bot), b = this.S(0, 0, top), w = this.D.shaftR * Math.hypot(this.eT[0], this.eT[1]);
  var gr = c.createLinearGradient(a[0] - w, 0, a[0] + w, 0);
  gr.addColorStop(0, this.metal(0.3)); gr.addColorStop(0.35, this.metal(0.95)); gr.addColorStop(1, this.metal(0.45));
  c.fillStyle = gr; c.fillRect(a[0] - w, b[1], 2 * w, a[1] - b[1]);
  c.strokeStyle = this.blue ? '#e6eef7' : '#1c1b1a'; c.lineWidth = 0.6 * this.px; c.globalAlpha = 0.8;
  c.beginPath(); c.moveTo(a[0] - w, b[1]); c.lineTo(a[0] - w, a[1]); c.moveTo(a[0] + w, b[1]); c.lineTo(a[0] + w, a[1]); c.stroke(); c.globalAlpha = 1;
};
/* el anillo distribuidor (0,8·D, bajo el impulsor) y su tubo de alimentación, que baja junto a la pared de atrás */
FAgit.prototype.sparger = function (s, front, k) {
  var c = this.ctx, self = this, ph0 = front ? Math.PI : 0, pts = [], w = 1.5 * Math.hypot(this.eT[0], this.eT[1]);
  for (var i = 0; i <= 30; i++) { var ph = ph0 + Math.PI * i / 30; pts.push(this.S(s.rs * Math.cos(ph), s.rs * Math.sin(ph), s.z)); }
  c.lineCap = 'round'; c.lineJoin = 'round';
  c.strokeStyle = this.blue ? '#06182b' : '#1c1b1a'; c.lineWidth = w + 1.2 * this.px; this.poly(pts, false); c.stroke();
  c.strokeStyle = this.metal(0.75); c.lineWidth = w; this.poly(pts, false); c.stroke();
  if (front) return;
  // el tubo: de la boquilla de gas (θ = 305° en el dibujo) baja hasta la altura del anillo y entra radial
  var a = this.D.gasTh - Math.PI, rp = this.D.gasR / k, top = this.D.gasZ / k, ca = Math.cos(a), sa = Math.sin(a);
  var run = [this.S(rp * ca, rp * sa, top), this.S(rp * ca, rp * sa, s.z), this.S(s.rs * ca, s.rs * sa, s.z)];
  c.strokeStyle = this.blue ? '#06182b' : '#1c1b1a'; c.lineWidth = w + 1.2 * this.px; this.poly(run, false); c.stroke();
  c.strokeStyle = this.metal(0.6); c.lineWidth = w; this.poly(run, false); c.stroke();
};
FAgit.prototype.probes = function (sc, k) {
  var c = this.ctx, F = sc.F, tr = sc.tr, px = this.px, last = tr.hist.length ? tr.hist[tr.hist.length - 1].v : null, cols = ['#C8452B', '#2F7D5B', '#B7791F'], self = this;
  c.font = '700 ' + (10 * px).toFixed(2) + 'px ' + (getComputedStyle(this.host).getPropertyValue('--font-mono') || 'monospace');
  c.textAlign = 'left';
  tr.probes.forEach(function (pr, n) {
    var q = self.S(-(pr[0] + 0.5) * F.dr, 0, (pr[1] + 0.5) * F.dz), X = q[0], Y = q[1], s = 5.5 * px, ok = last && Math.abs(last[n] - 1) <= 0.05;
    if (self.D.glass) { var top = self.S(-(pr[0] + 0.5) * F.dr, 0, (self.D.Z1 + 18) / k); c.strokeStyle = self.blue ? '#9fb6cc' : '#3a4048'; c.lineWidth = 1.6 * px; c.beginPath(); c.moveTo(X, Y); c.lineTo(top[0], top[1]); c.stroke(); c.lineWidth = 0.9 * px; c.beginPath(); c.moveTo(top[0], top[1]); c.quadraticCurveTo(top[0], top[1] - 10 * px, top[0] + 14 * px, top[1] - 12 * px); c.stroke(); }
    c.fillStyle = cols[n]; c.strokeStyle = '#fff'; c.lineWidth = 1.4 * px;
    c.beginPath(); c.moveTo(X, Y - s); c.lineTo(X + s, Y); c.lineTo(X, Y + s); c.lineTo(X - s, Y); c.closePath(); c.fill(); c.stroke();
    var tx = 'P' + (n + 1) + (ok ? ' ✓' : ''), w = c.measureText(tx).width;
    c.fillStyle = 'rgba(255,255,255,0.85)'; c.fillRect(X + 8 * px, Y - 7.5 * px, w + 4 * px, 12 * px); c.fillStyle = cols[n]; c.fillText(tx, X + 10 * px, Y + 2.5 * px);
  });
};
/* cotas en la cara del corte: T abajo, H por la pared izquierda, C y D en el impulsor */
FAgit.prototype.dims = function (R, k, ink, paper) {
  var c = this.ctx, g = R.geo, Rm = g.T / 2, px = this.px, self = this, S = function (x, z) { return self.S(x, 0, z); };
  var col = this.blue ? '#9fb6cc' : '#6b6764';
  c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 0.9 * px; c.font = '600 ' + (10 * px).toFixed(2) + 'px ' + (getComputedStyle(this.host).getPropertyValue('--font-mono') || 'monospace');
  function arr(a, b, t, al, off) {
    c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
    [[a, b], [b, a]].forEach(function (s) { var an = Math.atan2(s[1][1] - s[0][1], s[1][0] - s[0][0]), h = 5 * px; c.beginPath(); c.moveTo(s[0][0], s[0][1]); c.lineTo(s[0][0] + h * Math.cos(an + 0.4), s[0][1] + h * Math.sin(an + 0.4)); c.moveTo(s[0][0], s[0][1]); c.lineTo(s[0][0] + h * Math.cos(an - 0.4), s[0][1] + h * Math.sin(an - 0.4)); c.stroke(); });
    if (!t) return;
    var m = [(a[0] + b[0]) / 2 + (off ? off[0] : 0), (a[1] + b[1]) / 2 + (off ? off[1] : 0)], w = c.measureText(t).width;
    c.textAlign = al || 'center'; c.fillStyle = paper; c.globalAlpha = 0.85; c.fillRect(al === 'left' ? m[0] - 2 * px : m[0] - w / 2 - 2 * px, m[1] - 8 * px, w + 4 * px, 11 * px); c.globalAlpha = 1; c.fillStyle = col; c.fillText(t, m[0], m[1] + 1 * px);
  }
  var y0 = 0.03 * g.T;
  arr(S(Rm * 0.995, y0), S(-Rm * 0.995, y0), 'T = ' + fmtN(g.T, 2) + ' m');
  var xh = Rm * 0.9;
  arr(S(xh, 0), S(xh, g.H), 'H = ' + fmtN(g.H, 2) + ' m', 'left', [4 * px, 0]);
  if (!R.imp.close) {
    var xc = -0.62 * g.D;
    arr(S(xc, 0), S(xc, g.C), 'C = ' + fmtN(g.C, 2), 'left', [4 * px, 0]);
    var zd = g.C + 0.17 * g.D + 0.02 * g.T;
    arr(S(g.D / 2, zd), S(-g.D / 2, zd), 'D = ' + fmtN(g.D, 2) + ' m');
  }
};
