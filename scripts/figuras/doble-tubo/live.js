/* ====================================================================
   El doble tubo en vivo. La página le pasa el perfil del explorador
   (profileAll: contracorriente o paralelo, con el ánulo como «coraza»):
   · el tubo interior de cada rama, pintado a lo largo con la temperatura
     de su fluido, con su brillo y trazos blancos que corren en su sentido;
   · el ánulo: un velo con la temperatura de su fluido sobre la pared
     interior del tubo exterior y puntos que corren por la holgura, en su
     sentido; con vapor, el condensado: gotas que bajan por el tubo
     interior, caen y corren por el fondo del tubo exterior.
   Cada fluido tarda en recorrer una rama lo que tarda de verdad (acotado).
   ==================================================================== */
var TCOL = [[47, 109, 181], [111, 168, 220], [233, 227, 211], [236, 154, 96], [200, 69, 43]];
function tcol(t) { if (!isFinite(t)) t = 0.5; t = Math.max(0, Math.min(1, t)) * (TCOL.length - 1); var i = Math.min(TCOL.length - 2, Math.floor(t)), f = t - i, a = TCOL[i], b = TCOL[i + 1]; return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]; }
function rgb(c, k) { k = k == null ? 1 : k; return 'rgb(' + Math.round(Math.min(255, c[0] * k)) + ',' + Math.round(Math.min(255, c[1] * k)) + ',' + Math.round(Math.min(255, c[2] * k)) + ')'; }
function FDouble(host, D) {
  this.host = host; this.D = D; this.svg = host.querySelector('svg'); this.C = xCam(D.P);
  var self = this; this.an = []; this.inr = [];
  D.legs.forEach(function (z, k) { self.an.push(self.svg.querySelector('[data-live="leg' + k + '.an"]')); self.inr.push(self.svg.querySelector('[data-live="leg' + k + '.in"]')); });
  this.key = ''; this.t = 0;
}
FDouble.prototype.P = function (x, y, z) { return this.C.pr(x, y, z); };
FDouble.prototype.Tat = function (a, x) { x = Math.max(0, Math.min(1, x)) * (a.length - 1); var i = Math.min(a.length - 2, Math.floor(x)); return a[i] + (a[i + 1] - a[i]) * (x - i); };
FDouble.prototype.seg = function (a, b) { return 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1); };
/* x del perfil en la rama k, posición y: en contracorriente el tubo interior entra en x = 1 */
FDouble.prototype.X = function (s, k, y) { var p = pathPos(k, y); return s.contra ? 1 - p : p; };
/* el tubo interior va hacia atrás (y baja) en las ramas pares; el ánulo, al revés en contracorriente y igual en paralelo */
FDouble.prototype.back = function (s, k, annulus) { var b = k % 2 === 0; return annulus && s.contra ? !b : b; };
/* s = { prof: { shell (ánulo), tubes: [interior] }, Tlo, Thi, steam, contra, tLegIn, tLegAn (s en recorrer una rama), dt, snap } */
FDouble.prototype.update = function (s) {
  var dt = Math.max(0, Math.min(0.1, s.dt || 0)), sh = s.prof.shell, tb = s.prof.tubes[0];
  var key = [s.Tlo, s.Thi, s.steam, s.contra, sh[0], sh[sh.length - 1], sh[sh.length >> 1], tb[0], tb[tb.length - 1], tb[tb.length >> 1]].join('|');
  if (key !== this.key) { this.key = key; this.build(s); }
  if (!s.snap) this.t += dt;
  this.flow(s);
};
FDouble.prototype.grad = function (id, k, arr, s) {
  var D = this.D, zc = D.legs[k], a = this.P(0, 0, zc), b = this.P(0, D.L, zc), span = Math.max(1e-6, s.Thi - s.Tlo), st = [];
  for (var i = 0; i <= 10; i++) { var y = D.L * i / 10; st.push('<stop offset="' + (i / 10).toFixed(2) + '" stop-color="' + rgb(tcol((this.Tat(arr, this.X(s, k, y)) - s.Tlo) / span)) + '"/>'); }
  return '<linearGradient id="' + id + '" gradientUnits="userSpaceOnUse" x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '">' + st.join('') + '</linearGradient>';
};
FDouble.prototype.build = function (s) {
  var D = this.D, self = this, sh = s.prof.shell, tb = s.prof.tubes[0], d = 2 * D.ro * D.sc;
  // generatriz del tubo interior al ángulo th (0 arriba, hacia el lector con th > 0)
  var gen = function (zc, th, y0, y1) { var x = D.ro * Math.sin(th), z = zc + D.ro * Math.cos(th); return self.seg(self.P(x, y0, z), self.P(x, y1, z)); };
  // el extremo de atrás (contra el cabezal de retorno): la elipse del borde, un poco adentro del contorno
  var end = function (zc) { var r = D.ro - 0.25 / D.sc, pts = []; for (var i = 0; i < 32; i++) { var t = Math.PI * 2 * i / 32; pts.push(self.P(r * Math.sin(t), 0, zc + r * Math.cos(t))); } return 'M' + pts.map(function (q) { return q[0].toFixed(2) + ' ' + q[1].toFixed(2); }).join('L') + 'Z'; };
  // con vapor, el condensado corre por el fondo del tubo exterior: su superficie es horizontal, a hf del fondo
  var film = function (zc, k) { var hf = 1.1, w = Math.sqrt(D.Ri * D.Ri - (D.Ri - hf) * (D.Ri - hf)), z = zc - D.Ri + hf; return '<path class="dp-film" clip-path="url(#hxClip_leg' + k + '_out)" d="M' + [self.P(0, 0, z), self.P(0, D.L, z), self.P(-w, D.L, z), self.P(-w, 0, z)].map(function (q) { return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join('L') + 'Z"/>'; };
  D.legs.forEach(function (zc, k) {
    if (self.inr[k]) {
      var id = 'dpG_in' + k;
      self.inr[k].innerHTML = '<defs>' + self.grad(id, k, tb, s) + '</defs>' +
        '<path class="dp-tb" style="stroke:url(#' + id + ');stroke-width:' + (d - 0.5).toFixed(2) + 'px" d="' + self.seg(self.P(0, 0, zc), self.P(0, D.L, zc)) + '"/>' +
        '<path class="dp-tbe" style="fill:url(#' + id + ')" d="' + end(zc) + '"/>' +
        '<path class="dp-tbd" style="stroke-width:' + (d * 0.3).toFixed(2) + 'px" d="' + gen(zc, 2.25, 0.05, D.L - 0.05) + '"/>' +
        '<path class="dp-tbs" style="stroke-width:' + (d * 0.22).toFixed(2) + 'px" d="' + gen(zc, 0.62, 0.05, D.L - 0.05) + '"/>' +
        '<g class="dp-dash"></g>';
    }
    if (self.an[k]) {
      var ida = 'dpG_an' + k, c = [self.P(-D.Ri, -2, zc - D.Ri - 1), self.P(-D.Ri, D.L + 2, zc + D.Ri + 1), self.P(0, -2, zc + D.Ri + 1), self.P(0, D.L + 2, zc - D.Ri - 1)];
      var xs = c.map(function (q) { return q[0]; }), ys = c.map(function (q) { return q[1]; }), x0 = Math.min.apply(null, xs), y0 = Math.min.apply(null, ys);
      self.an[k].innerHTML = '<defs>' + self.grad(ida, k, sh, s) + '</defs><rect class="dp-tint' + (s.steam ? ' dp-steam' : '') + '" clip-path="url(#hxClip_leg' + k + '_out)" x="' + x0.toFixed(1) + '" y="' + y0.toFixed(1) + '" width="' + (Math.max.apply(null, xs) - x0).toFixed(1) + '" height="' + (Math.max.apply(null, ys) - y0).toFixed(1) + '" fill="url(#' + ida + ')"/>' + (s.steam ? film(zc, k) : '') + '<g class="dp-dots" clip-path="url(#hxClip_leg' + k + '_out)"></g>';
    }
  });
  this.dash = this.inr.map(function (e) { return e ? e.querySelector('.dp-dash') : null; });
  this.dots = this.an.map(function (e) { return e ? e.querySelector('.dp-dots') : null; });
};
FDouble.prototype.flow = function (s) {
  var D = this.D, self = this, span = Math.max(1e-6, s.Thi - s.Tlo), sh = s.prof.shell;
  // cada fluido recorre una rama en tLegIn o tLegAn segundos
  var vIn = 1 / Math.max(0.6, s.tLegIn || 3), vAn = 1 / Math.max(0.6, s.tLegAn || 3), th = 1.0, xg = D.ro * Math.sin(th), zg = D.ro * Math.cos(th);
  D.legs.forEach(function (zc, k) {
    var od = [], oa = [], bi = self.back(s, k, false), ba = self.back(s, k, true);
    for (var q = 0; q < 7; q++) {
      var f = (q / 7 + self.t * vIn + k * 0.31) % 1, y = bi ? D.L * (1 - f) : D.L * f, y2 = Math.max(0.2, Math.min(D.L - 0.2, y + (bi ? -4 : 4)));
      od.push(self.seg(self.P(xg, y, zc + zg), self.P(xg, y2, zc + zg)));
    }
    for (var q2 = 0; q2 < 12; q2++) {
      var f2 = (q2 / 12 + self.t * vAn + k * 0.17) % 1, y3 = ba ? D.L * (1 - f2) : D.L * f2, x2 = self.X(s, k, y3), top = q2 % 2 === 0;
      var r = D.ro + (D.Ri - D.ro) * (0.4 + 0.25 * ((q2 * 7) % 3) / 2), p = self.P(-0.6, y3, zc + (top ? r : -r));
      if (s.steam) { // el vapor condensa sobre el tubo interior: la gota baja por su cara y cae al fondo del tubo exterior
        var fz = (q2 / 12 + self.t * 0.3 + k * 0.23) % 1, yd = D.L * ((q2 * 0.618 + k * 0.29) % 1) * 0.94 + D.L * 0.03, pd;
        if (fz < 0.62) { var a = 0.35 + (Math.PI - 0.35) * fz / 0.62; pd = self.P((D.ro + 0.35) * Math.sin(a), yd, zc + (D.ro + 0.35) * Math.cos(a)); }
        else { var zf = zc - D.ro - 0.4 - (D.Ri - D.ro - 1.5) * Math.pow((fz - 0.62) / 0.38, 2); pd = self.P(0.3, yd, zf); }
        od.push('<ellipse class="dp-drop" cx="' + pd[0].toFixed(1) + '" cy="' + pd[1].toFixed(1) + '" rx=".75" ry="1.05"/>');
      } else oa.push('<circle class="dp-dot" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r=".75" style="fill:' + rgb(tcol((self.Tat(sh, x2) - s.Tlo) / span), 0.82) + '"/>');
    }
    if (self.dash[k]) self.dash[k].innerHTML = '<path class="dp-flow" d="' + od.filter(function (q) { return q.charAt(0) === 'M'; }).join('') + '"/>' + od.filter(function (q) { return q.charAt(0) === '<'; }).join('');
    if (self.dots[k]) self.dots[k].innerHTML = oa.join('');
  });
};
