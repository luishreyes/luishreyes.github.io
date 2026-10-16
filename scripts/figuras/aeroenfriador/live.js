/* ====================================================================
   El aeroenfriador en vivo. La página le pasa el perfil del explorador
   (profileAll: el proceso por los tubos y el aire como «coraza», en el
   contra-cruce equivalente):
   · cada fila de tubos, pintada a lo largo con la temperatura del proceso
     en su paso (el proceso entra por la fila de arriba y baja paso a paso,
     cambiando de sentido en cada cabezal); los trazos blancos tardan en
     recorrer un tubo lo que tarda el líquido, L/u (acotado);
   · las aspas giran más rápido con más aire;
   · el aire entra frío por debajo de los anillos, llena la cámara y sale
     por arriba del haz con su temperatura de salida: más caliente donde el
     proceso de la fila de arriba está más caliente, con la media del
     balance.
   ==================================================================== */
var TCOL = [[47, 109, 181], [111, 168, 220], [233, 227, 211], [236, 154, 96], [200, 69, 43]];
function tcol(t) { if (!isFinite(t)) t = 0.5; t = Math.max(0, Math.min(1, t)) * (TCOL.length - 1); var i = Math.min(TCOL.length - 2, Math.floor(t)), f = t - i, a = TCOL[i], b = TCOL[i + 1]; return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]; }
function rgb(c, k) { k = k == null ? 1 : k; return 'rgb(' + Math.round(Math.min(255, c[0] * k)) + ',' + Math.round(Math.min(255, c[1] * k)) + ',' + Math.round(Math.min(255, c[2] * k)) + ')'; }
function FAir(host, D) {
  this.host = host; this.D = D; this.svg = host.querySelector('svg'); this.C = xCam(D.P);
  var svg = this.svg, q = function (n) { return svg.querySelector('[data-live="' + n + '"]'); };
  this.el = { tubes: q('hz.tubes'), out: q('air.out'), pl: [q('air.pl0'), q('air.pl1')], inB: [q('air.in0.bk'), q('air.in1.bk')], inF: [q('air.in0.fr'), q('air.in1.fr')], bk: [q('fan0.bk'), q('fan1.bk')], fr: [q('fan0.fr'), q('fan1.fr')] };
  // la mitad de atrás de cada ventilador: lo que queda detrás del plano vertical del eje que mira al lector
  var a = AC.AZ * Math.PI / 180; this.hv = [Math.cos(a), Math.sin(a)];
  this.key = ''; this.t = 0; this.ang = 0; this.off = [0, 0, 0, 0];
}
FAir.prototype.P = function (x, y, z) { return this.C.pr(x, y, z); };
FAir.prototype.Tat = function (a, x) { x = Math.max(0, Math.min(1, x)) * (a.length - 1); var i = Math.min(a.length - 2, Math.floor(x)); return a[i] + (a[i + 1] - a[i]) * (x - i); };
FAir.prototype.seg = function (a, b) { return 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1); };
/* temperatura del proceso en la fila r, en y (el perfil va en x = 1 − posición del recorrido) */
FAir.prototype.Tp = function (s, r, y) { return this.Tat(s.prof.tubes[0], 1 - pathPos(r, y, s.Np)); };
/* s = { prof: { shell (aire), tubes: [proceso] }, Np, Tlo, Thi, tTube (s en recorrer un tubo), vFace (m/s), dt, snap } */
FAir.prototype.update = function (s) {
  var dt = Math.max(0, Math.min(0.1, s.dt || 0)), sh = s.prof.shell, tb = s.prof.tubes[0];
  var key = [s.Np, s.Tlo, s.Thi, sh[0], sh[sh.length - 1], tb[0], tb[tb.length >> 1], tb[tb.length - 1]].join('|');
  if (key !== this.key) { this.key = key; this.build(s); }
  if (!s.snap) {
    this.t += dt;
    this.ang += dt * 2 * Math.PI * Math.max(0.2, Math.min(1.2, 0.14 * (s.vFace || 3)));
    var ln = this.tubeLen, v = ln / Math.max(0.8, Math.min(14, s.tTube || 4));
    for (var r = 0; r < AC.NR; r++) this.off[r] += dt * v * (passOf(r, s.Np) % 2 === 0 ? 1 : -1);
  }
  if (this.el.tubes) for (var r2 = 0; r2 < AC.NR; r2++) this.el.tubes.style.setProperty('--acf' + r2, this.off[r2].toFixed(1));
  this.fans(s); this.air(s);
};
FAir.prototype.build = function (s) {
  var D = this.D, self = this, span = Math.max(1e-6, s.Thi - s.Tlo), sc = D.sc, df = AC.Df * sc, V = this.C.V;
  var col = function (T) { return rgb(tcol((T - s.Tlo) / span)); };
  // un degradado por fila, en la caja de cada tubo (horizontal): el borde izquierdo es el extremo de y = L
  var defs = [], a0 = this.P(0, 0, 0), a1 = this.P(0, AC.L, 0), rev = a1[0] < a0[0];
  this.tubeLen = Math.hypot(a1[0] - a0[0], a1[1] - a0[1]);
  for (var r = 0; r < AC.NR; r++) {
    var st = [];
    for (var g = 0; g <= 10; g++) { var f = g / 10, y = rev ? AC.L * (1 - f) : AC.L * f; st.push('<stop offset="' + f.toFixed(2) + '" stop-color="' + col(this.Tp(s, r, y)) + '"/>'); }
    defs.push('<linearGradient id="acG' + r + '" x1="0" y1="0" x2="1" y2="0">' + st.join('') + '</linearGradient>');
  }
  // los tubos de atrás hacia adelante (todos paralelos: basta la profundidad del eje)
  var list = [];
  for (var r3 = 0; r3 < AC.NR; r3++) for (var i = 0; i < AC.NT; i++) { var x = tubeX(r3, i), z = rowZ(r3); list.push({ r: r3, x: x, z: z, d: x * V[0] + z * V[2] }); }
  list.sort(function (p, q) { return p.d - q.d; });
  var html = list.map(function (t) {
    var d = self.seg(self.P(t.x, 0.2, t.z), self.P(t.x, AC.L - 0.2, t.z)), hl = self.seg(self.P(t.x, 0.2, t.z + AC.Df * 0.3), self.P(t.x, AC.L - 0.2, t.z + AC.Df * 0.3));
    return '<path class="ac-to" style="stroke-width:' + (df + 0.7).toFixed(2) + 'px" d="' + d + '"/><path class="ac-tf" style="stroke:url(#acG' + t.r + ');stroke-width:' + df.toFixed(2) + 'px" d="' + d + '"/><path class="ac-tx" style="stroke-width:' + (df - 0.5).toFixed(2) + 'px" d="' + d + '"/><path class="ac-th" style="stroke-width:' + (df * 0.22).toFixed(2) + 'px" d="' + hl + '"/><path class="ac-flow ac-f' + t.r + '" d="' + d + '"/>';
  });
  if (this.el.tubes) this.el.tubes.innerHTML = '<defs>' + defs.join('') + '</defs>' + html.join('');
  // el aire que sale: su temperatura en cada y (la del balance en promedio)
  var Ttop = [], n = 24, mean = 0;
  for (var j = 0; j <= n; j++) { Ttop.push(this.Tp(s, 0, AC.L * j / n)); mean += Ttop[j] / (n + 1); }
  var Tci = s.prof.shell[0], Tco = s.prof.shell[s.prof.shell.length - 1], k = Math.abs(mean - Tci) > 1e-6 ? (Tco - Tci) / (mean - Tci) : 0;
  this.Tout = function (y) { return Tci + k * (self.Tat(Ttop, y / AC.L) - Tci); };
  this.Tci = Tci; this.span = span; this.Tlo = s.Tlo;
};
/* las aspas: cuatro por ventilador, con su torcimiento; las de la mitad de atrás van detrás del cubo */
FAir.prototype.fans = function (s) {
  var self = this, F = AC.fan, V = this.C.V;
  F.y.forEach(function (yf, f) {
    var back = [], front = [];
    for (var b = 0; b < F.blades; b++) {
      var phi = self.ang + b * 2 * Math.PI / F.blades, lead = [], trail = [];
      for (var q = 0; q <= 6; q++) {
        var rr = F.hub + 0.9 + (F.tip - F.hub - 0.9) * q / 6, c = 10 - 3.6 * q / 6, dl = c / 2 / rr, h = 1.5 - 0.9 * q / 6;
        lead.push(self.P(rr * Math.cos(phi + dl), yf + rr * Math.sin(phi + dl), F.z - h));
        trail.push(self.P(rr * Math.cos(phi - dl), yf + rr * Math.sin(phi - dl), F.z + h));
      }
      var pts = lead.concat(trail.reverse()), cx = Math.cos(phi), mid = [26 * cx, yf + 26 * Math.sin(phi), F.z], far = self.hv[0] * cx + self.hv[1] * Math.sin(phi) < 0;
      var lit = 0.86 + 0.1 * Math.sin(phi + 0.8), dpath = 'M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L') + 'Z';
      (far ? back : front).push({ d: mid[0] * V[0] + mid[1] * V[1] + mid[2] * V[2], h: '<path class="ac-bl" style="fill:' + rgb([214, 219, 224], lit) + '" d="' + dpath + '"/>' });
    }
    var draw = function (arr) { return arr.sort(function (a, b) { return a.d - b.d; }).map(function (o) { return o.h; }).join(''); };
    if (self.el.bk[f]) self.el.bk[f].innerHTML = draw(back);
    if (self.el.fr[f]) self.el.fr[f].innerHTML = draw(front);
  });
};
/* el aire: entra frío por los anillos, sube por la cámara y sale del haz con su temperatura */
FAir.prototype.air = function (s) {
  var self = this, F = AC.fan, ZT = topZ(), tR = Math.max(1.2, Math.min(5, 9 / Math.max(0.5, s.vFace || 3))), cin = rgb(tcol((this.Tci - this.Tlo) / this.span), 0.85);
  // cada partícula es un trazo corto que sube
  var dot = function (p, c, o, r, q) { q = q || [p[0], p[1] - 3]; return '<path class="ac-air" d="M' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + 'L' + q[0].toFixed(1) + ' ' + q[1].toFixed(1) + '" style="stroke:' + c + ';stroke-opacity:' + o.toFixed(2) + ';stroke-width:' + (r || 0.9) + 'px"/>'; };
  var hash = function (i, k) { var v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };
  // arriba del haz
  if (this.el.out) {
    var o = [];
    for (var i = 0; i < 46; i++) {
      var f = (hash(i, 1) + this.t / tR) % 1, x = -44 + 92 * hash(i, 2), y = 6 + (AC.L - 12) * hash(i, 3), z = ZT + AC.sup + 1 + 36 * f;
      o.push(dot(this.P(x, y, z), rgb(tcol((this.Tout(y) - this.Tlo) / this.span), 0.85), 0.95 * (1 - f * f), 1.1, this.P(x, y, z + 4)));
    }
    this.el.out.innerHTML = o.join('');
  }
  F.y.forEach(function (yf, k) {
    // en la cámara
    if (self.el.pl[k]) {
      var o2 = [], y0 = k ? 152 : 18, y1 = k ? 282 : 148;
      for (var i2 = 0; i2 < 26; i2++) {
        var f2 = (hash(i2, 5 + k) + self.t / (tR * 1.3)) % 1, x2 = -50 + 100 * hash(i2, 7 + k), y2 = y0 + (y1 - y0) * hash(i2, 9 + k), z2 = AC.zf + 2 + 60 * f2;
        o2.push(dot(self.P(x2, y2, z2), cin, 0.75 * Math.sin(Math.PI * f2), 1.0, self.P(x2, y2, z2 + 3.5)));
      }
      self.el.pl[k].innerHTML = o2.join('');
    }
    // por debajo del anillo, hacia la boca
    var ob = [], of = [];
    for (var i3 = 0; i3 < 18; i3++) {
      var f3 = (hash(i3, 11 + k) + self.t / (tR * 0.8)) % 1, a = 2 * Math.PI * hash(i3, 13 + k), rr = 38 - 13 * f3, z3 = 107.5 + 16.5 * f3;
      ((self.hv[0] * Math.cos(a) + self.hv[1] * Math.sin(a)) < 0 ? ob : of).push(dot(self.P(rr * Math.cos(a), yf + rr * Math.sin(a), z3), cin, 0.8 * Math.sin(Math.PI * f3), 1.0, self.P((rr - 1.6) * Math.cos(a), yf + (rr - 1.6) * Math.sin(a), z3 + 2.6)));
    }
    if (self.el.inB[k]) self.el.inB[k].innerHTML = ob.join('');
    if (self.el.inF[k]) self.el.inF[k].innerHTML = of.join('');
  });
};
