/* ====================================================================
   El intercambiador de placas en vivo. La página le pasa el perfil del
   explorador (profileAll: una contracorriente con el UA·F de las placas):
   · cada canal del corte se pinta con la temperatura de su fluido a lo
     largo de la placa: el caliente entra arriba y baja; el frío entra
     abajo y sube (contracorriente);
   · puntos que corren por los canales, tardando lo que tarda el líquido
     en recorrer la placa (L/u, acotado); con vapor, gotas de condensado.
   ==================================================================== */
var TCOL = [[47, 109, 181], [111, 168, 220], [233, 227, 211], [236, 154, 96], [200, 69, 43]];
function tcol(t) { if (!isFinite(t)) t = 0.5; t = Math.max(0, Math.min(1, t)) * (TCOL.length - 1); var i = Math.min(TCOL.length - 2, Math.floor(t)), f = t - i, a = TCOL[i], b = TCOL[i + 1]; return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]; }
function rgb(c, k) { k = k == null ? 1 : k; return 'rgb(' + Math.round(Math.min(255, c[0] * k)) + ',' + Math.round(Math.min(255, c[1] * k)) + ',' + Math.round(Math.min(255, c[2] * k)) + ')'; }
function FPlate(host, D) {
  this.host = host; this.D = D; this.svg = host.querySelector('svg'); this.C = xCam(D.P);
  var self = this; this.el = D.ch.map(function (c) { return self.svg.querySelector('[data-live="ch.' + c.i + '"]'); });
  this.key = ''; this.t = 0; this.pts = null;
}
FPlate.prototype.P = function (x, y, z) { return this.C.pr(x, y, z); };
/* temperatura en la altura z: f = 0 arriba (entra el caliente), 1 abajo (entra el frío) */
FPlate.prototype.T = function (a, z) { var D = this.D, f = (D.Z1 - D.GK - z) / (D.Z1 - D.Z0 - 2 * D.GK); f = Math.max(0, Math.min(1, f)) * (a.length - 1); var i = Math.min(a.length - 2, Math.floor(f)); return a[i] + (a[i + 1] - a[i]) * (f - i); };
/* s = { prof: { shell: [...], tubes: [[...]] }, hotShell, Tlo, Thi, steam, tPass, dt, snap } */
FPlate.prototype.update = function (s) {
  var dt = Math.max(0, Math.min(0.1, s.dt || 0)), key = [s.Tlo, s.Thi, s.steam, s.prof.shell[0], s.prof.shell[s.prof.shell.length - 1], s.prof.tubes[0][0], s.prof.tubes[0][s.prof.tubes[0].length - 1]].join('|');
  if (key !== this.key) { this.key = key; this.build(s); }
  if (!s.snap) this.t += dt;
  this.dots(s);
};
FPlate.prototype.build = function (s) {
  var D = this.D, self = this, span = Math.max(1e-6, s.Thi - s.Tlo), zA = D.Z0 + D.GK, zB = D.Z1 - D.GK, nb = 16;
  var hot = s.hotShell ? s.prof.shell : s.prof.tubes[0], cold = s.hotShell ? s.prof.tubes[0] : s.prof.shell;
  D.ch.forEach(function (c, j) {
    var a = c.hot ? hot : cold, html = [], pp = function (pts) { return 'M' + pts.map(function (q) { return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join('L') + 'Z'; };
    for (var b = 0; b < nb; b++) {
      var z0 = zA + (zB - zA) * b / nb, z1 = zA + (zB - zA) * (b + 1) / nb, T = self.T(a, (z0 + z1) / 2), col = rgb(tcol((T - s.Tlo) / span));
      html.push('<path class="pl-fl' + (c.hot && s.steam ? ' pl-steam' : '') + '" style="fill:' + col + '" d="' + pp([self.P(0, c.y0, z0), self.P(0, c.y1, z0), self.P(0, c.y1, z1 + 0.05), self.P(0, c.y0, z1 + 0.05)]) + '"/>');
    }
    html.push('<g class="pl-dots"></g>');
    if (self.el[j]) self.el[j].innerHTML = html.join('');
  });
  this.dotEls = this.el.map(function (e) { return e ? e.querySelector('.pl-dots') : null; });
};
FPlate.prototype.dots = function (s) {
  var D = this.D, self = this, zA = D.Z0 + D.GK + 1.5, zB = D.Z1 - D.GK - 1.5, span = Math.max(1e-6, s.Thi - s.Tlo), per = 7;
  var hot = s.hotShell ? s.prof.shell : s.prof.tubes[0], cold = s.hotShell ? s.prof.tubes[0] : s.prof.shell, v = 1 / Math.max(0.8, s.tPass || 4);
  D.ch.forEach(function (c, j) {
    if (!self.dotEls || !self.dotEls[j]) return;
    var out = [], a = c.hot ? hot : cold, ym = (c.y0 + c.y1) / 2, w = (c.y1 - c.y0) * 0.28;
    for (var q = 0; q < per; q++) {
      var ph = (q / per + self.t * v * (c.hot && s.steam ? 0.7 : 1) + j * 0.137) % 1, f = c.hot ? ph : 1 - ph; // el caliente baja, el frío sube
      var z = zB - (zB - zA) * f, y = ym + w * Math.sin(q * 2.399 + j), T = self.T(a, z), p = self.P(0.1, y, z), col = rgb(tcol((T - s.Tlo) / span), 0.8);
      out.push(c.hot && s.steam ? '<ellipse class="pl-drop" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" rx=".55" ry=".85"/>' : '<circle class="pl-dot" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r=".75" style="fill:' + col + '"/>');
    }
    self.dotEls[j].innerHTML = out.join('');
  });
};
