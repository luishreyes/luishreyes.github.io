/* ====================================================================
   El intercambiador de tubos y coraza en vivo. La página le pasa el
   perfil de temperaturas de cada coraza (profileAll del explorador, el
   mismo modelo de Nagle que da F y la efectividad) y el número de pasos:
   · los tubos se reparten en bandas horizontales, una por paso (las
     particiones del canal van entre bandas pares, las del cabezal de atrás
     entre impares; en el BEU, las curvas en U unen cada par de bandas);
   · cada tubo se pinta con la temperatura de su paso a lo largo de y;
   · el lado coraza corre en zigzag entre los bafles, con su temperatura;
     si es vapor que condensa, caen gotas de condensado;
   · trazos que corren por los tubos de adelante marcan el sentido de cada paso.
   ==================================================================== */
var TCOL = [[47, 109, 181], [111, 168, 220], [233, 227, 211], [236, 154, 96], [200, 69, 43]];
function tcol(t) { if (!isFinite(t)) t = 0.5; t = Math.max(0, Math.min(1, t)) * (TCOL.length - 1); var i = Math.min(TCOL.length - 2, Math.floor(t)), f = t - i, a = TCOL[i], b = TCOL[i + 1]; return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]; }
function rgb(c, k) { k = k == null ? 1 : k; return 'rgb(' + Math.round(Math.min(255, c[0] * k)) + ',' + Math.round(Math.min(255, c[1] * k)) + ',' + Math.round(Math.min(255, c[2] * k)) + ')'; }
function FTube(host, D) {
  this.host = host; this.D = D; this.svg = host.querySelector('svg'); this.C = xCam(D.P);
  var self = this, q = function (s) { return self.svg.querySelector('[data-live="' + s + '"]'); };
  this.el = {}; D.units.forEach(function (u) { var p = 'u' + u.l; for (var k = 0; k <= HX.NB; k++) self.el[p + '.sl' + k] = q(p + '.sl' + k); self.el[p + '.ch'] = q(p + '.ch'); self.el[p + '.rr'] = q(p + '.rr'); self.el[p + '.tint'] = q(p + '.tint'); });
  this.rows = tubeRows(D.RB); this.baf = baffles(); this.flow = 0; this.key = ''; this.parts = []; this.t = 0;
  var a = this.C.pr(0, 0, 0), b = this.C.pr(0, 0, 1); this.k = Math.hypot(b[0] - a[0], b[1] - a[1]) / Math.cos(D.EL * Math.PI / 180); // px por cm
  var c = this.C.pr(0, HX.L, 0); this.Lpx = Math.hypot(c[0] - a[0], c[1] - a[1]); // largo de un tubo en pantalla
}
FTube.prototype.P = function (x, y, z) { return this.C.pr(x, y, z); };
FTube.prototype.seg = function (a, b) { return 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1); };
/* temperatura del paso k (o de la coraza si k < 0) de la coraza u en la posición y */
FTube.prototype.T = function (pu, odd, k, y) {
  var x = odd ? 1 - y / HX.L : y / HX.L, a = k < 0 ? pu.shell : pu.tubes[Math.min(k, pu.tubes.length - 1)];
  x = Math.max(0, Math.min(1, x)); var f = x * (a.length - 1), i = Math.min(a.length - 2, Math.floor(f));
  return a[i] + (a[i + 1] - a[i]) * (f - i);
};
/* s = { Np, prof: { units: [...] }, Tlo, Thi, steam, tPass (s que tarda el líquido en recorrer un paso),
   tComp (s que tarda la coraza en cruzar entre dos bafles), dt, snap } */
FTube.prototype.update = function (s) {
  var D = this.D, self = this, dt = Math.max(0, Math.min(0.1, s.dt || 0));
  this.t += dt;
  var key = [s.Np, s.Tlo, s.Thi, s.steam, JSON.stringify(s.prof.units.map(function (u) { return [u.shell[0], u.shell[u.shell.length - 1]].concat(u.tubes.map(function (t) { return t[0]; })); }))].join('|');
  if (key !== this.key) { this.key = key; this.build(s); }
  // los trazos de los tubos recorren un paso en tPass segundos
  if (!s.snap) this.flow -= dt * this.Lpx / Math.max(0.5, s.tPass || 4);
  this.svg.style.setProperty('--hx-flow', this.flow.toFixed(1));
  this.shellFlow(s, dt);
};
FTube.prototype.build = function (s) {
  var D = this.D, self = this, Np = s.Np, ln = lanes(Np), dTube = HX.tube.d * this.k, span = Math.max(1e-6, s.Thi - s.Tlo);
  var col = function (T) { return tcol((T - s.Tlo) / span); };
  var yStart = D.head === 'BEU' ? HX.rear.U.straight : D.head === 'AES' ? 2.8 : 0, baf = this.baf; // en el AES los tubos asoman tras el anillo dividido
  D.units.forEach(function (u) {
    var pu = s.prof.units['ABC'.indexOf(u.letter)] || s.prof.units[0], p = 'u' + u.l, zc = u.zc;
    // tajadas entre bafles: de atrás hacia adelante; en cada una, columnas del fondo al frente
    for (var k = 0; k <= HX.NB; k++) {
      var y0 = k === 0 ? yStart : baf[k - 1].y + 0.4, y1 = k === HX.NB ? HX.L : baf[k].y - 0.4, html = [];
      // por la ventana del bafle de atrás los tubos siguen sin corte (no hay placa que los tape)
      var winB = k === 0 ? 0 : baf[k - 1].win * (u.odd ? 1 : -1), inWin = function (z) { return winB !== 0 && winB * z > HX.R - HX.CUT; };
      if (k === 0 && D.head === 'BEU') html.push(self.ubends(u, pu, ln, col, dTube));
      for (var c = HX.tube.cols.length - 1; c >= 0; c--) {
        var bins = {};
        self.rows.forEach(function (t) {
          if (t.c !== c) return;
          var band = bandOf(t.z, ln);
          for (var h = 0; h < 2; h++) {
            var ya = (h === 0 && inWin(t.z) ? y0 - 0.8 : y0) + (y1 - y0) * h / 2, yb = y0 + (y1 - y0) * (h + 1) / 2, cc = col(self.T(pu, u.odd, band, (ya + yb) / 2)), kk = cc.map(function (v) { return Math.round(v / 6) * 6; }).join(',');
            (bins[kk] = bins[kk] || []).push(self.seg(self.P(t.x, ya, zc + t.z), self.P(t.x, yb, zc + t.z)));
          }
        });
        Object.keys(bins).forEach(function (kk) {
          var c3 = kk.split(',').map(Number), d = bins[kk].join('');
          html.push('<path class="hx-tbo" style="stroke-width:' + (dTube + 0.9).toFixed(2) + 'px" d="' + d + '"/><path class="hx-tb" style="stroke:' + rgb(c3) + ';stroke-width:' + dTube.toFixed(2) + 'px" d="' + d + '"/><path class="hx-tbs" style="stroke-width:' + (dTube * 0.32).toFixed(2) + 'px" d="' + d + '"/>');
        });
        if (c === 0) { // trazos de flujo en la columna de adelante, en el sentido de cada paso
          var fl = [];
          self.rows.forEach(function (t) { if (t.c !== 0) return; var band = bandOf(t.z, ln), back = band % 2 === 0; var a = self.P(t.x, back ? y1 : y0, zc + t.z), b = self.P(t.x, back ? y0 : y1, zc + t.z); fl.push(self.seg(a, b)); });
          html.push('<path class="hx-flow" d="' + fl.join('') + '"/>');
        }
      }
      html.push('<g class="hx-sh" data-k="' + k + '"></g>');
      if (self.el[p + '.sl' + k]) self.el[p + '.sl' + k].innerHTML = html.join('');
    }
    // el fluido de la coraza: un velo con su temperatura a lo largo de y sobre la pared interior (recortado a la abertura)
    if (self.el[p + '.tint']) {
      var gid = 'hxT_' + p, a0 = self.P(0, 0, zc), a1 = self.P(0, HX.L, zc), st = [];
      for (var gi = 0; gi <= 8; gi++) { var yy = HX.L * gi / 8; st.push('<stop offset="' + (gi / 8).toFixed(3) + '" stop-color="' + rgb(col(self.T(pu, u.odd, -1, yy))) + '"/>'); }
      var c0 = self.P(-HX.R, -40, zc + HX.R + 2), c1 = self.P(0, HX.L + 4, zc - HX.R - 2), bx = [self.P(-HX.R, -40, zc - HX.R - 2), self.P(-HX.R, HX.L + 4, zc + HX.R + 2), c0, c1];
      var xs = bx.map(function (q) { return q[0]; }), ys = bx.map(function (q) { return q[1]; }), x0 = Math.min.apply(null, xs), y0r = Math.min.apply(null, ys);
      self.el[p + '.tint'].innerHTML = '<defs><linearGradient id="' + gid + '" gradientUnits="userSpaceOnUse" x1="' + a0[0].toFixed(1) + '" y1="' + a0[1].toFixed(1) + '" x2="' + a1[0].toFixed(1) + '" y2="' + a1[1].toFixed(1) + '">' + st.join('') + '</linearGradient></defs><rect class="hx-tint' + (s.steam ? ' hx-steam' : '') + '" clip-path="url(#hxClip_' + p + '_shell)" x="' + x0.toFixed(1) + '" y="' + y0r.toFixed(1) + '" width="' + (Math.max.apply(null, xs) - x0).toFixed(1) + '" height="' + (Math.max.apply(null, ys) - y0r).toFixed(1) + '" fill="url(#' + gid + ')"/>';
    }
    // particiones del canal (entre bandas 2j y 2j+1) y del cabezal de atrás (entre 2j+1 y 2j+2)
    if (self.el[p + '.ch']) self.el[p + '.ch'].innerHTML = self.plates(u, ln.filter(function (l, i) { return i % 2 === 0; }), u.chanP);
    if (self.el[p + '.rr'] && u.rearP) self.el[p + '.rr'].innerHTML = self.plates(u, ln.filter(function (l, i) { return i % 2 === 1; }), u.rearP);
  });
  this.shellEls = Array.prototype.slice.call(this.svg.querySelectorAll('.hx-sh'));
};
/* placas divisorias horizontales de un cabezal (cp = { ya, yb, dish, R }): cara de arriba y canto cortado en el
   plano x = 0. Si el cabezal tiene fondo, la placa lo sigue hasta donde lo corta. */
FTube.prototype.plates = function (u, zs, cp) {
  var self = this, out = [], t = 0.45, R = cp.R - 0.3;
  var pp = function (pts) { return 'M' + pts.map(function (q) { return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join('L') + 'Z'; };
  zs.forEach(function (lz) {
    if (Math.abs(lz) > R - 1) return;
    var d = cp.dish, yA = cp.ya, yB = cp.yb, rOf = function () { return R; };
    if (d) {
      var reach = d.y + d.s * d.hd * Math.sqrt(Math.max(0, 1 - (lz * lz) / (R * R))) * 0.97;
      if (d.s > 0) yB = reach; else yA = reach;
      rOf = function (y) { var e = (y - d.y) * d.s; return e <= 0 ? R : R * Math.sqrt(Math.max(0, 1 - (e * e) / (d.hd * d.hd))); };
    }
    var z = u.zc + lz, n = d ? 14 : 1, top = [], back = [];
    for (var i = 0; i <= n; i++) {
      var y = yA + (yB - yA) * i / n, xe = -Math.sqrt(Math.max(0, rOf(y) * rOf(y) - lz * lz));
      top.push(self.P(0, y, z + t)); back.push(self.P(xe, y, z + t));
    }
    var edge = [self.P(0, yA, z + t), self.P(0, yB, z + t), self.P(0, yB, z - t), self.P(0, yA, z - t)];
    out.push('<path class="hx-plate" d="' + pp(top.concat(back.reverse())) + '"/><path class="hx-plate-e" d="' + pp(edge) + '"/>');
  });
  return out.join('');
};
/* curvas en U: en cada columna, cada fila de la banda 2j con su espejo en la banda 2j+1 */
FTube.prototype.ubends = function (u, pu, ln, col, dTube) {
  var self = this, y = HX.rear.U.straight, out = [];
  for (var c = HX.tube.cols.length - 1; c >= 0; c--) {
    var zs = this.rows.filter(function (t) { return t.c === c; }).map(function (t) { return t.z; });
    for (var j = 0; 2 * j + 1 <= ln.length; j++) {
      var lane = ln[2 * j], lo = zs.filter(function (z) { return bandOf(z, ln) === 2 * j; }), hi = zs.filter(function (z) { return bandOf(z, ln) === 2 * j + 1; });
      lo.forEach(function (z1) {
        var want = 2 * lane - z1, best = null; hi.forEach(function (z2) { if (best === null || Math.abs(z2 - want) < Math.abs(best - want)) best = z2; });
        if (best === null) return;
        var r = (best - z1) / 2, zm = (best + z1) / 2, pts = [];
        for (var i = 0; i <= 14; i++) { var a = -Math.PI / 2 + Math.PI * i / 14; pts.push(self.P(HX.tube.cols[c], y - r * Math.cos(a), u.zc + zm + r * Math.sin(a))); }
        var d = 'M' + pts.map(function (q) { return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join('L'), cc = col(self.T(pu, u.odd, 2 * j, y));
        out.push('<path class="hx-tbo hx-u" style="stroke-width:' + (dTube + 0.9).toFixed(2) + 'px" d="' + d + '"/><path class="hx-tb hx-u" style="stroke:' + rgb(cc) + ';stroke-width:' + dTube.toFixed(2) + 'px" d="' + d + '"/>');
      });
    }
  }
  return out.join('');
};
/* lado coraza: partículas en el plano del corte. En cada tajada entran por la ventana de un bafle (o por la boquilla),
   cruzan el haz de arriba abajo o al revés y salen por la ventana del siguiente: el zigzag. Con vapor que condensa,
   gotas de condensado que caen entre los tubos. */
FTube.prototype.shellFlow = function (s, dt) {
  var D = this.D, self = this, baf = this.baf, NB = HX.NB, R = HX.R, span = Math.max(1e-6, s.Thi - s.Tlo);
  if (!this.shellEls) return;
  if (!this.sp || this.sp.length === 0) { this.sp = []; for (var i = 0; i < 84; i++) this.sp.push({ k: i % (NB + 1), v: Math.random(), w: Math.random(), w2: Math.random() }); }
  var speed = s.steam ? 0.3 : 1 / Math.max(0.25, s.tComp || 2);
  if (!s.snap) this.sp.forEach(function (q) { q.v += dt * speed * (0.85 + 0.3 * q.w2); if (q.v >= 1) { q.v -= 1; q.w = Math.random(); q.w2 = Math.random(); } });
  var html = {}, yS = D.head === 'BEU' ? HX.rear.U.straight : D.head === 'AES' ? 2.8 : 0;
  var wFor = function (u, i) { return (i % 2 ? -1 : 1) * (u.odd ? 1 : -1); };
  D.units.forEach(function (u) {
    var pu = s.prof.units['ABC'.indexOf(u.letter)] || s.prof.units[0], p = 'u' + u.l;
    self.sp.forEach(function (q) {
      var k = q.k, y0 = k === 0 ? yS + 1 : baf[k - 1].y + 0.8, y1 = k === NB ? HX.L - 1 : baf[k].y - 0.8, y, z;
      if (s.steam) {
        y = y0 + (y1 - y0) * (0.08 + 0.84 * q.w); z = u.zc + (R - 2) - (2 * R - 4) * q.v;
      } else {
        var first = u.odd ? k === NB : k === 0, last = u.odd ? k === 0 : k === NB;
        var ya = u.odd ? y1 : y0, yb = u.odd ? y0 : y1;
        var wIn = first ? 1 : wFor(u, u.odd ? k : k - 1), wOut = last ? -1 : wFor(u, u.odd ? k - 1 : k);
        var za = first ? R - 2 : wIn * (R - HX.CUT * (0.2 + 0.6 * q.w2)), zb = last ? -(R - 2) : wOut * (R - HX.CUT * (0.2 + 0.6 * (1 - q.w2)));
        if (first) ya = u.odd ? u.noz.shellIn : u.noz.shellIn;
        if (last) yb = u.noz.shellOut;
        var ym = ya + (yb - ya) * (0.12 + 0.76 * q.w);
        var l1 = Math.abs(ym - ya), l2 = Math.abs(zb - za), l3 = Math.abs(yb - ym), tot = l1 + l2 + l3 || 1, d = q.v * tot;
        if (d < l1) { y = ya + (ym - ya) * (d / (l1 || 1)); z = za; }
        else if (d < l1 + l2) { y = ym; z = za + (zb - za) * ((d - l1) / (l2 || 1)); }
        else { y = ym + (yb - ym) * ((d - l1 - l2) / (l3 || 1)); z = zb; }
        z += u.zc;
      }
      var T = self.T(pu, u.odd, -1, y), c = tcol((T - s.Tlo) / span), pt = self.P(0.4, y, z);
      var key = p + '|' + k; (html[key] = html[key] || []).push('<circle class="hx-sp' + (s.steam ? ' hx-drop' : '') + '" cx="' + pt[0].toFixed(1) + '" cy="' + pt[1].toFixed(1) + '" r="' + (s.steam ? 1.0 : 1.25) + '" style="fill:' + rgb(c, 0.92) + '"/>');
    });
  });
  this.shellEls.forEach(function (g) { var key = g.parentNode.getAttribute('data-live').replace(/\.sl(\d+)$/, '|$1'); g.innerHTML = (html[key] || []).join(''); });
};
