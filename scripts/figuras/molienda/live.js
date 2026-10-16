/* ====================================================================
   Los equipos de molienda en vivo. La página le pasa, en cada cuadro, la
   escena de partículas del explorador (MillAnim): su ángulo de giro, su
   geometría en píxeles y sus partículas (bolas de acero y mineral). La
   figura mueve el mecanismo con esa misma escena y pone las partículas
   en el plano de corte de la máquina, en un lienzo encima del SVG que
   sigue al acercamiento.
   ==================================================================== */
function FMill(host, D) {
  this.host = host; this.D = D; this.C = xCam(D.P); this.kk = D.P.scale * Math.sqrt(1.6);
  this.svg = host.querySelector('svg'); this.cv = host.querySelector('canvas.ml-live'); this.ctx = this.cv.getContext('2d');
  var self = this; this.el = {};
  Array.prototype.forEach.call(this.svg.querySelectorAll('[data-live]'), function (g) { self.el[g.getAttribute('data-live')] = g; });
  this.M = [1, 0, 0]; this.px = 1;
}
FMill.prototype.fit = function () {
  var cv = this.cv, r = this.svg.getBoundingClientRect(), b = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
  var w = Math.max(1, Math.round(b.width * dpr)), h = Math.max(1, Math.round(b.height * dpr));
  if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
  var vb = (this.svg.getAttribute('viewBox') || '0 0 ' + this.D.W + ' ' + this.D.H).split(/[ ,]+/).map(Number);
  var s = Math.min(r.width / vb[2], r.height / vb[3]) || 1;
  this.M = [dpr * s, dpr * (r.left - b.left + (r.width - vb[2] * s) / 2 - vb[0] * s), dpr * (r.top - b.top + (r.height - vb[3] * s) / 2 - vb[1] * s)];
  this.px = 1 / s; this.vb = vb;
};
FMill.prototype.blue = function () { var th = this.host.closest ? this.host.closest('[data-theme]') : null; return !!th && th.getAttribute('data-theme') === 'blueprint'; };
FMill.prototype.poly = function (pts, close) { var c = this.ctx; c.beginPath(); for (var i = 0; i < pts.length; i++) { if (i) c.lineTo(pts[i][0], pts[i][1]); else c.moveTo(pts[i][0], pts[i][1]); } if (close !== false) c.closePath(); };
// un camino de puntos (círculos chicos) y uno de rayas para los grupos vivos del SVG
function dotPath(pts, r) { var s = ''; for (var i = 0; i < pts.length; i++) { var p = pts[i]; s += 'M' + (p[0] - r).toFixed(2) + ' ' + p[1].toFixed(2) + 'a' + r + ' ' + r + ' 0 1 0 ' + (2 * r) + ' 0a' + r + ' ' + r + ' 0 1 0 ' + (-2 * r) + ' 0'; } return s; }
function segPath(segs) { var s = ''; for (var i = 0; i < segs.length; i++) { var a = segs[i][0], b = segs[i][1]; s += 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1); } return s; }
FMill.prototype.setG = function (k, html) { var g = this.el[k]; if (g && g._h !== html) { g.innerHTML = html; g._h = html; } };
FMill.prototype.draw = function (anim, res) {
  if (!anim || !anim.geo) return;
  this.fit();
  var c = this.ctx, M = this.M;
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, this.cv.width, this.cv.height);
  c.setTransform(M[0], 0, 0, M[0], M[1], M[2]);
  if (this.D.eq === 'bolas') this.drawBolas(anim, res);
  else if (this.D.eq === 'mand') this.drawMand(anim, res);
  else if (this.D.eq === 'rod') this.drawRod(anim, res);
  else if (this.D.eq === 'mart') this.drawMart(anim, res);
  else if (this.D.eq === 'disc') this.drawDisc(anim, res);
  c.setTransform(1, 0, 0, 1, 0, 0);
};

/* ---------- molino de bolas ---------- */
/* El tambor está abierto entre y0 y y1 por la mitad que mira al lector. La carga del lienzo (una sección con bolas de
   5 cm) se repite en capas a lo largo de todo el tambor, separadas un poco más que un diámetro de bola y con un
   corrimiento propio de cada partícula en cada capa: en la artesa quedan solo las que están en la mitad de atrás (las
   de adelante se fueron con el corte) y en el corte de y0 se ve la sección entera. Las capas de más adentro van más
   oscuras. Como cada capa tapa casi toda la de atrás, de una capa de atrás se dibujan solo las partículas que no tienen
   otra delante en la capa siguiente (las del borde de la carga y las que vuelan); las capas se pintan de atrás hacia
   adelante, y dentro de cada una en el orden de profundidad de la sección. */
FMill.prototype.drawBolas = function (anim, res) {
  var D = this.D, C = this.C, c = this.ctx, g = anim.geo, ZA = D.ZA, th = -(anim.ang || 0), px = this.px, blue = this.blue(), self = this;
  var pt = function (t, r, y) { return [r * Math.cos(t), y, ZA + r * Math.sin(t)]; }, pr = function (p) { return C.pr(p[0], p[1], p[2]); };
  var vis = function (t, lim) { return Math.cos(t) * C.V[0] + Math.sin(t) * C.V[2] > lim; };
  var K = D.cut, nv = D.nv, back = function (u, v) { return u * nv[0] + v * nv[1] < 0; };
  // ---- lo que gira por fuera: los pernos del casco, los dientes de la corona y del piñón y los agujeros del trommel
  var dots = [], i, j, t, y;
  for (i = 0; i < 24; i++) { t = (i / 24) * Math.PI * 2 + 0.07 + th; if (!vis(t, 0.12)) continue; for (y = -D.L2 + 30; y <= D.L2 - 25; y += 45) if (y < K.y0 - 10 || y > K.y1 + 10) dots.push(pr(pt(t, D.RO + 0.05, y))); }
  this.setG('bm.bolts', '<path class="ml-dot" d="' + dotPath(dots, 0.55) + '"/>');
  var gs = [], G = D.gear;
  for (i = 0; i < G.n; i++) { t = (i / G.n) * Math.PI * 2 + th; if (!vis(t, 0.05)) continue; gs.push([pr(pt(t, G.r1 + 0.05, G.y0 + 1)), pr(pt(t, G.r1 + 0.05, G.y1 - 1))]); }
  this.setG('bm.teeth', '<path class="ml-teeth" d="' + segPath(gs) + '"/>');
  var ps = [], Pn = D.pin, pa = -th * (G.r1 / Pn.rp);
  for (i = 0; i < 18; i++) { t = (i / 18) * Math.PI * 2 + pa; if (!vis(t, 0.05)) continue; var cx = Pn.c[0] + (Pn.rp + 0.05) * Math.cos(t), cz = Pn.c[2] + (Pn.rp + 0.05) * Math.sin(t); ps.push([C.pr(cx, Pn.y0 + 0.5, cz), C.pr(cx, Pn.y1 - 0.5, cz)]); }
  this.setG('bm.pteeth', '<path class="ml-teeth" d="' + segPath(ps) + '"/>');
  var hs = [], Tr = D.trommel;
  for (j = 0; j < 7; j++) for (i = 0; i < 26; i++) { t = (i / 26) * Math.PI * 2 + th; if (!vis(t, 0.15)) continue; hs.push(pr(pt(t, Tr.r + 0.05, Tr.y1 - 8 - j * 10.5))); }
  this.setG('bm.holes', '<path class="ml-hole" d="' + dotPath(hs, 0.9) + '"/>');
  // ---- los levantadores: barras a lo largo del revestimiento de atrás, y su sección en el corte de y0
  var s = D.R / g.R, lh = (g.lhp || g.rb * g.lh) * s, nl = g.nl || D.lifters, hw = 4.5 / D.R, ink = blue ? '#06182b' : '#3b4148';
  var face = function (pts, sh) { self.poly(pts.map(pr)); c.fillStyle = self.metal(sh, blue); c.fill(); c.strokeStyle = ink; c.lineWidth = 0.45 * px; c.stroke(); };
  var lit = function (n) { return 0.3 + 0.55 * Math.max(0, n[0] * C.L[0] + n[1] * C.L[2]); };
  c.save(); this.poly(D.vis); c.clip();
  for (i = 0; i < nl; i++) {
    t = th - i * Math.PI * 2 / nl; if (!back(Math.cos(t), Math.sin(t))) continue;
    var r1 = D.R - lh, a = -D.L2, b = K.y1;
    // la cara de lado que mira al lector y luego la de adentro
    var sA = t + hw, nA = [-Math.sin(sA), Math.cos(sA)], sB = t - hw, nB = [Math.sin(sB), -Math.cos(sB)];
    var sd = nA[0] * nv[0] + nA[1] * nv[1] > 0 ? [sA, nA] : [sB, nB];
    face([pt(sd[0], D.R, a), pt(sd[0], D.R, b), pt(sd[0], r1, b), pt(sd[0], r1, a)], lit(sd[1]));
    face([pt(t - hw, r1, a), pt(t + hw, r1, a), pt(t + hw, r1, b), pt(t - hw, r1, b)], lit([-Math.cos(t), -Math.sin(t)]));
  }
  c.restore();
  // ---- la carga: capas a lo largo del tambor
  var P = anim.P, n = P.length, mat = (res && res.mat && res.mat.color) || '#b9b1a3', rb = (g.rb || 9) * s;
  /* con un equipo lento se dibujan menos capas (this.bq baja de 1 a 0,5 si el cuadro pasa de 14 ms, y vuelve a subir) */
  var t00 = performance.now(), bq = this.bq || 1, NL = Math.max(6, Math.round((K.y1 - K.y0) / (2.3 * rb) * bq)), dy = (K.y1 - K.y0) / NL;
  var o0 = C.pr(0, 0, ZA), oy = C.pr(0, dy, ZA), Dx = oy[0] - o0[0], Dy = oy[1] - o0[1];
  // la sección en pantalla (en el plano de y0) y su orden de profundidad
  var base = new Array(n), ord = [];
  for (i = 0; i < n; i++) {
    var p = P[i]; if (!p.jit || p.jit.length < NL + 2) { p.jit = []; for (j = 0; j < NL + 2; j++) p.jit.push([Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]); }
    var u = (p.x - g.cx) * s, v = (g.cy - p.y) * s, q = C.pr(u, K.y0, ZA + v);
    base[i] = { p: p, u: u, v: v, rr: p.r * s, X: q[0], Y: q[1], d: C.depth(u, 0, ZA + v), bk: back(u, v), ms: 1 };
    ord.push(i);
  }
  ord.sort(function (a2, b2) { return base[a2].d - base[b2].d; });
  /* ¿desde qué capa se ve cada partícula? La capa siguiente queda corrida D en pantalla: la partícula de la capa j la tapa
     la capa j + m si en la sección hay otra partícula en el punto corrido m·D. m* es la primera m que la tapa: la
     partícula se dibuja solo en sus últimas m* capas (las del fondo de la carga, en una o dos; las del borde que da hacia
     el corrimiento y las que vuelan, en todas). Una malla en pantalla de las de la mitad de atrás */
  var cell = 2.4 * rb * this.kk, grid = {}, kx = function (x) { return Math.floor(x / cell); };
  for (i = 0; i < n; i++) if (base[i].bk) { var kk2 = kx(base[i].X) + ',' + kx(base[i].Y); (grid[kk2] || (grid[kk2] = [])).push(i); }
  var covered = function (x, y) {
    var gx = kx(x), gy = kx(y);
    for (var a3 = gx - 1; a3 <= gx + 1; a3++) for (var b3 = gy - 1; b3 <= gy + 1; b3++) {
      var L3 = grid[a3 + ',' + b3]; if (!L3) continue;
      for (var m3 = 0; m3 < L3.length; m3++) { var f3 = base[L3[m3]], r3 = 0.95 * f3.rr * self.kk; if ((f3.X - x) * (f3.X - x) + (f3.Y - y) * (f3.Y - y) < r3 * r3) return true; }
    }
    return false;
  };
  for (i = 0; i < n; i++) {
    var e0 = base[i]; e0.ms = NL + 2; if (!e0.bk) continue;
    for (var m = 1; m <= NL + 1; m++) if (covered(e0.X - m * Dx, e0.Y - m * Dy)) { e0.ms = m; break; }
  }
  /* cada capa de la artesa va girada un poco alrededor del eje (hasta un diámetro y medio de bola en la pared) y cada
     partícula (también los granos de mineral), corrida hasta media bola: así las bolas de capas vecinas no quedan en fila a lo largo del tambor */
  var rotA = [0, 0]; for (j = 0; j < NL; j++) { var hz = Math.sin((j + 1) * 91.7) * 43758.5453; rotA.push((hz - Math.floor(hz) - 0.5) * 2 * 1.5 * 2 * rb / D.R); }
  var self2 = this, put = function (e, jj, yy, dim, al) {
    var jr = Math.max(e.rr, 0.9 * rb), u0 = e.u + jj[1] * jr, v0 = e.v + jj[2] * jr, ca = Math.cos(al), sa = Math.sin(al), uu = u0 * ca - v0 * sa, vv = u0 * sa + v0 * ca, q2 = C.pr(uu, yy, ZA + vv);
    self2.sprite(q2[0], q2[1], e.rr * self2.kk, e.p.k, dim, mat, blue);
  };
  // detrás y en el corte de y0: la sección entera (de la mitad de atrás, solo lo que asoma por delante de la capa siguiente)
  c.save(); this.poly(D.ell0); c.clip(); this.poly(D.vis); c.clip();
  for (var jl = 1; jl >= 0; jl--) for (i = 0; i < n; i++) {
    var e1 = base[ord[i]], jj1 = e1.p.jit[jl]; if (e1.bk && e1.ms <= NL + jl) continue;
    put(e1, jj1, K.y0 - (jl ? dy * (1.2 + 0.7 * jj1[0]) : e1.rr * (1.02 + 0.3 * Math.abs(jj1[0]))), jl ? 0.5 : 0.74, 0);
  }
  // la sección de los levantadores en el corte (la mitad de adelante)
  for (i = 0; i < nl; i++) {
    t = th - i * Math.PI * 2 / nl; if (back(Math.cos(t), Math.sin(t))) continue;
    this.poly([pt(t - hw, D.R + 0.2, K.y0), pt(t + hw, D.R + 0.2, K.y0), pt(t + hw, D.R - lh, K.y0), pt(t - hw, D.R - lh, K.y0)].map(pr));
    c.fillStyle = blue ? '#4d6f93' : '#5b6168'; c.fill(); c.strokeStyle = ink; c.lineWidth = 0.45 * px; c.stroke();
  }
  c.restore();
  // la artesa: capa por capa hacia el lector; en la última (la de más adelante) van todas las de la mitad de atrás
  c.save(); this.poly(D.vis); c.clip();
  /* debajo, la sombra del cuerpo de la carga: cada partícula del lecho (con al menos tres vecinas) barre una franja oscura
     a lo largo del tambor, y por los huecos entre bolas se ve oscuro, como los intersticios de una carga real, en vez
     del revestimiento. Las que vuelan no dejan sombra */
  var sh = [], nr2 = Math.pow(2.3 * rb * this.kk, 2);
  for (i = 0; i < n; i++) {
    var e3 = base[i]; if (!e3.bk || e3.p.k !== 'ball') continue;
    var gx3 = kx(e3.X), gy3 = kx(e3.Y), nb3 = 0;
    for (var a4 = gx3 - 1; a4 <= gx3 + 1; a4++) for (var b4 = gy3 - 1; b4 <= gy3 + 1; b4++) { var L4 = grid[a4 + ',' + b4]; if (L4) for (var m4 = 0; m4 < L4.length; m4++) { var f4 = base[L4[m4]]; if ((f4.X - e3.X) * (f4.X - e3.X) + (f4.Y - e3.Y) * (f4.Y - e3.Y) < nr2) nb3++; } }
    if (nb3 >= 4) sh.push(e3);
  }
  if (sh.length) {
    c.beginPath();
    for (i = 0; i < sh.length; i++) { var e4 = sh[i]; c.moveTo(e4.X + 0.5 * Dx, e4.Y + 0.5 * Dy); c.lineTo(e4.X + (NL - 0.5) * Dx, e4.Y + (NL - 0.5) * Dy); }
    c.lineCap = 'round'; c.lineWidth = 1.7 * rb * this.kk; c.strokeStyle = blue ? '#0b1d30' : '#2c3138'; c.stroke(); c.lineCap = 'butt';
  }
  for (j = 0; j < NL; j++) {
    for (i = 0; i < n; i++) {
      var e2 = base[ord[i]]; if (!e2.bk || j < NL - e2.ms) continue;
      // el mineral va repartido entre las bolas: cada grano aparece en una de cada tres capas, no en fila a lo largo del tambor
      if (e2.p.k === 'ore' && j < NL - 1 && e2.p.jit[j + 2][0] > -0.17) continue;
      var jj2 = e2.p.jit[j + 2], yy2 = K.y0 + dy * (j + 0.5 + 0.5 * jj2[0]);
      put(e2, jj2, yy2, 0.74 + 0.26 * (yy2 - K.y0) / (K.y1 - K.y0), rotA[j + 2]);
    }
  }
  // los golpes: un destello donde chocan bola y mineral, en el corte
  // en una capa cualquiera del tambor si el golpe cae en la mitad de atrás; si no, en el corte de y0
  (anim.fx || []).forEach(function (f) {
    var al = 1 - f.t / 0.45; if (al <= 0) return;
    var fu = (f.x - g.cx) * s, fv = (g.cy - f.y) * s, h = Math.sin(f.x * 12.9898 + f.y * 78.233) * 43758.5453, fy = back(fu, fv) ? K.y0 + (K.y1 - K.y0) * (h - Math.floor(h)) : K.y0 + 1;
    var q2 = C.pr(fu, fy, ZA + fv), L = (1.4 + Math.min(f.s, 46) * 0.1) * px;
    c.strokeStyle = '#C8452B'; c.globalAlpha = 0.85 * al; c.lineWidth = 1.1 * px; c.beginPath();
    for (var k2 = 0; k2 < 6; k2++) { var an = k2 * Math.PI / 3; c.moveTo(q2[0] + Math.cos(an) * L * 0.35, q2[1] + Math.sin(an) * L * 0.35); c.lineTo(q2[0] + Math.cos(an) * L, q2[1] + Math.sin(an) * L); }
    c.stroke(); c.globalAlpha = 1;
  });
  c.restore();
  var tb = performance.now() - t00; this.bt = this.bt == null ? tb : this.bt * 0.9 + tb * 0.1; this.bn = (this.bn || 0) + 1;
  if (this.bn % 30 === 0) { if (this.bt > 14 && bq > 0.5) this.bq = Math.max(0.5, bq - 0.1); else if (this.bt < 7 && bq < 1) this.bq = Math.min(1, bq + 0.1); }
};
/* una bola de acero o un grano de mineral dibujados una vez (por tono y por brillo) y escalados a cada partícula: con
   miles por cuadro, dibujar cada una con sus arcos sería demasiado */
FMill.prototype.sprite = function (X, Y, R, kind, dim, mat, blue) {
  var lv = Math.max(0, Math.min(5, Math.round((dim - 0.5) / 0.1))), key = kind + '|' + (kind === 'ball' ? '' : mat) + '|' + (blue ? 1 : 0) + '|' + lv;
  var cache = this.spr || (this.spr = {}), cv = cache[key];
  if (!cv) {
    cv = document.createElement('canvas'); var N = 40; cv.width = cv.height = N;
    var c2 = cv.getContext('2d'), save = this.ctx, savePx = this.px; this.ctx = c2; this.px = N / 2 / 10;
    c2.setTransform(N / 20, 0, 0, N / 20, N / 2, N / 2);
    this.grain({ q: [0, 0], r: 9.4, k: kind, dim: 0.5 + lv * 0.1 }, mat, blue);
    this.ctx = save; this.px = savePx; cache[key] = cv;
  }
  if (R < 0.05) return;
  this.ctx.drawImage(cv, X - R * 10 / 9.4, Y - R * 10 / 9.4, 2 * R * 10 / 9.4, 2 * R * 10 / 9.4);
};
/* una bola de acero o un grano de mineral; dim < 1 oscurece lo que está más adentro del tambor */
FMill.prototype.grain = function (e, mat, blue) {
  var c = this.ctx, X = e.q[0], Y = e.q[1], R = e.r, px = this.px;
  c.beginPath(); c.arc(X, Y, R, 0, 6.2832);
  if (e.k === 'ball') {
    c.fillStyle = shadeHex(blue ? '#7f9bb8' : '#7c8894', e.dim); c.fill(); c.lineWidth = 0.35 * px; c.strokeStyle = blue ? '#06182b' : '#2b3036'; c.stroke();
    c.beginPath(); c.arc(X - R * 0.32, Y - R * 0.34, R * 0.42, 0, 6.2832); c.fillStyle = shadeHex(blue ? '#d9e6f2' : '#e9eef2', e.dim); c.globalAlpha = 0.75; c.fill(); c.globalAlpha = 1;
  } else { c.fillStyle = shadeHex(mat, e.dim); c.fill(); c.lineWidth = 0.3 * px; c.strokeStyle = blue ? '#06182b' : '#5a5148'; c.stroke(); }
};
function shadeHex(h, f) {
  if (f >= 1) return h;
  var n = parseInt(h.slice(1), 16);
  return 'rgb(' + Math.round(((n >> 16) & 255) * f) + ',' + Math.round(((n >> 8) & 255) * f) + ',' + Math.round((n & 255) * f) + ')';
}
/* ---------- trituradora de mandíbulas ---------- */
/* La fase de la excéntrica es la del lienzo: e = sen ωt. La biela sigue a la cara móvil del lienzo (giro alrededor de la
   punta de arriba y traslado, jcMove) y sube y baja con el muñón excéntrico; el toggle va de su asiento en la biela al
   del bastidor con su largo de siempre, la varilla sigue a la oreja de la biela por el agujero del bloque y el resorte
   se comprime contra el bloque. Las rocas van en el plano del corte, detrás de las mandíbulas. */
var FYF = { o: [0, 0, 0], a: [0, 1, 0], u: [1, 0, 0], v: [0, 0, 1] };
FMill.prototype.drawMand = function (anim, res) {
  var D = this.D, C = this.C, c = this.ctx, g = anim.geo, px = this.px, blue = this.blue(), self = this;
  var t = anim.t || 0, ph = 5.5 * t, e = Math.sin(ph), mv = jcMove(e), dz = D.ecc * (Math.cos(ph) - 1);
  var T = function (p) { var q = mv(p); return [q[0], q[1] + dz]; };
  var W2 = D.W2, PL = D.PL, S = D.S, E = [S[0] + D.ecc * Math.sin(ph), S[1] + D.ecc * Math.cos(ph) - D.ecc];
  var prism = function (poly, s0, s1, cls, F) { return prismSvg(C, poly, s0, s1, { F: F || FYF, tone: 'mid', cls: cls || '' }); };
  var circ = function (cx, cz, r, y, n) { var o = []; for (var i = 0; i < (n || 32); i++) { var a = i / (n || 32) * Math.PI * 2; o.push(C.pr(cx + r * Math.cos(a), y, cz + r * Math.sin(a))); } return o; };
  var path = function (pts) { return pts.map(function (q, i) { return (i ? 'L' : 'M') + q[0].toFixed(2) + ' ' + q[1].toFixed(2); }).join('') + 'Z'; };
  // la biela con el buje y el muñón excéntrico en su cara de adelante
  var pit = D.pit.map(T), dieM = D.dieM.map(T);
  var bush = path(circ(E[0], E[1], D.rj + 2, W2 + 0.02)) + path(circ(E[0], E[1], D.rj + 0.02, W2 + 0.02).reverse());
  this.setG('pitman', prism(pit, -W2, W2, 'ml-cast') + '<path class="ml-bush" fill-rule="evenodd" d="' + bush + '"/><path class="ml-journal" d="' + path(circ(E[0], E[1], D.rj, W2 + 0.04)) + '"/>');
  this.setG('die.m', prism(dieM, -W2, W2, 'ml-steel'));
  this.setG('lug', prism(D.lug.map(T), -6, 6, 'ml-cast'));
  // el toggle: de su asiento en la biela hacia el del bastidor, con su largo
  this.setG('toggle', prism(togPoly(T(D.Tp), D.Tf, 3.5), -40, 40, 'ml-steel'));
  // la marca de la chaveta en el corte del eje
  var ka = Math.PI / 2 - ph, kc = Math.cos(ka), ks = Math.sin(ka), kw = 0.3;
  var key = [[S[0] + 8 * kc - 1.6 * ks, S[1] + 8 * ks + 1.6 * kc], [S[0] + 12 * kc - 1.6 * ks, S[1] + 12 * ks + 1.6 * kc], [S[0] + 12 * kc + 1.6 * ks, S[1] + 12 * ks - 1.6 * kc], [S[0] + 8 * kc + 1.6 * ks, S[1] + 8 * ks - 1.6 * kc]];
  this.setG('jc.key', '<path class="ml-keyway" d="' + path(key.map(function (q) { return C.pr(q[0], PL + 0.05, q[1]); })) + '"/>');
  // la varilla de tensión, el resorte y la tuerca
  var L0p = T(D.Lp), dr = [115 - L0p[0], 49 - L0p[1]], dl = Math.hypot(dr[0], dr[1]); dr = [dr[0] / dl, dr[1] / dl];
  var RF = { o: [L0p[0], 0, L0p[1]], a: [dr[0], 0, dr[1]], u: [0, 1, 0], v: [-dr[1], 0, dr[0]] }, ng = function (r, n) { var o = []; for (var i = 0; i < n; i++) { var a = (i + 0.5) / n * Math.PI * 2; o.push([r * Math.cos(a), r * Math.sin(a)]); } return o; };
  var sB = (136 - L0p[0]) / dr[0], sW = D.sBlk + 22, coil = [[], []], nT = 6, cr = 5;
  var Vv = [C.V[0], C.V[1], C.V[2]], uu = [0, 1, 0], vv = [-dr[1], 0, dr[0]];
  var prev = null, prevF = null;
  for (var i = 0; i <= nT * 24; i++) {
    var f = i / (nT * 24), sAx = sB + 0.4 + (sW - sB - 0.8) * f, th = f * nT * Math.PI * 2, cu = Math.cos(th), cv = Math.sin(th);
    var w = [L0p[0] + dr[0] * sAx + cr * (cu * uu[0] + cv * vv[0]), cr * (cu * uu[1] + cv * vv[1]), L0p[1] + dr[1] * sAx + cr * (cu * uu[2] + cv * vv[2])];
    var front = (cu * uu[0] + cv * vv[0]) * Vv[0] + (cu * uu[1] + cv * vv[1]) * Vv[1] + (cu * uu[2] + cv * vv[2]) * Vv[2] > 0, q = C.pr(w[0], w[1], w[2]);
    if (prev) coil[front && prevF ? 1 : 0].push('M' + prev[0].toFixed(2) + ' ' + prev[1].toFixed(2) + 'L' + q[0].toFixed(2) + ' ' + q[1].toFixed(2));
    prev = q; prevF = front;
  }
  var sMid = sB, sFr = (94 - L0p[0]) / dr[0];
  this.setG('rod.a', prism(ng(2, 12), 0, sFr, 'ml-steel', RF));
  this.setG('rod.b', '<path class="ml-coil" d="' + coil[0].join('') + '"/>' + prism(ng(2, 12), sMid, D.rodLen, 'ml-steel', RF) + '<path class="ml-coil" d="' + coil[1].join('') + '"/>'
    + prism(ng(5.5, 16), sW, sW + 1.5, 'ml-steel', RF) + prism(ng(4, 6), sW + 1.5, sW + 6, 'ml-steel', RF));
  // los rayos del volante giran con el eje
  var sp = ['', ''], FW = D.FW;
  for (var k = 0; k < 6; k++) {
    var an = Math.PI / 2 - ph + k * Math.PI / 3, ca = Math.cos(an), sa = Math.sin(an), na = -sa, nb = ca;
    var r0 = FW.hub - 0.3, r1 = FW.r0 + 0.3, w0 = 5, w1 = 3.2;
    sp[ca * D.nv[0] + sa * D.nv[1] > 0 ? 1 : 0] += prism([[S[0] + ca * r0 - na * w0, S[1] + sa * r0 - nb * w0], [S[0] + ca * r1 - na * w1, S[1] + sa * r1 - nb * w1], [S[0] + ca * r1 + na * w1, S[1] + sa * r1 + nb * w1], [S[0] + ca * r0 + na * w0, S[1] + sa * r0 + nb * w0]], FW.y0 + 6, FW.y1 - 6, 'ml-cast');
  }
  this.setG('fw.spk.b', sp[0]); this.setG('fw.spk.f', sp[1]);
  // ---- las rocas, en el plano del corte y una capa más adentro
  var s = D.s, zb = D.zb, H86 = 0.86 * (anim.H || 490), cx0 = (anim.W || 900) / 2, mat = (res && res.mat && res.mat.color) || '#b9b1a3', list = [];
  for (i = 0; i < anim.P.length; i++) {
    var p = anim.P[i], x = (p.x - cx0) * s, z = zb + (H86 - p.y) * s, rr = p.r * s;
    if (!p.rock) { p.rock = []; for (var j = 0; j < 7; j++) p.rock.push(0.78 + Math.random() * 0.3); p.rot = Math.random() * 6.28; p.jit = [Math.random() - 0.5, Math.random() - 0.5]; }
    list.push({ x: x, z: z, y: PL - rr * 1.02, r: rr, p: p, dim: 1 });
    list.push({ x: x + p.jit[0] * rr * 0.8, z: z + p.jit[1] * rr * 0.8, y: PL - rr * 3.4, r: rr, p: p, dim: 0.7 });
  }
  list.sort(function (a2, b2) { return a2.dim - b2.dim; });
  c.save();
  // lo que tapa las rocas: las dos mandíbulas, la pared de adelante y la biela
  c.beginPath(); c.rect(-1e4, -1e4, 3e4, 3e4);
  var occ = [[D.dieF, W2], [D.wall, W2], [D.lip, W2], [dieM, W2], [pit, W2]];
  occ.forEach(function (o) { var pts = o[0].map(function (q) { return C.pr(q[0], o[1], q[1]); }); c.moveTo(pts[0][0], pts[0][1]); for (var m = 1; m < pts.length; m++) c.lineTo(pts[m][0], pts[m][1]); c.closePath(); });
  c.clip('evenodd');
  for (i = 0; i < list.length; i++) this.rock(list[i], mat, blue);
  this.flashes(anim, function (f2) { return C.pr((f2.x - cx0) * s, PL, zb + (H86 - f2.y) * s); });
  c.restore();
};
/* ---------- molino de rodillos ---------- */
/* Los rodillos giran con el ángulo del lienzo (el de la izquierda en un sentido y el de la derecha en el otro, hacia
   la boca); sus juntas, los pernos de sus caras y los de los cubos son lo que se ve girar. Las partículas van en el plano
   de las caras de adelante de los rodillos. */
FMill.prototype.drawRod = function (anim, res) {
  var D = this.D, C = this.C, c = this.ctx, px = this.px, blue = this.blue(), self = this;
  var ang = anim.ang || 0, W2 = D.W2, R = D.R, ZC = D.zc;
  var vis = function (t) { return Math.cos(t) * C.V[0] + Math.sin(t) * C.V[2] > 0.04; };
  [['l', -D.XC, -ang], ['r', D.XC, ang]].forEach(function (rl) {
    var x = rl[1], th = rl[2], segs = [], dots = [], hd = [], k, t;
    for (k = 0; k < D.segs; k++) { t = th + k * Math.PI * 2 / D.segs; if (!vis(t)) continue; segs.push([C.pr(x + (R + 0.05) * Math.cos(t), -W2 + 0.4, ZC + (R + 0.05) * Math.sin(t)), C.pr(x + (R + 0.05) * Math.cos(t), W2 - 0.4, ZC + (R + 0.05) * Math.sin(t))]); }
    for (k = 0; k < 16; k++) { t = th + k * Math.PI / 8 + 0.1; dots.push(C.pr(x + 23 * Math.cos(t), W2 + 0.05, ZC + 23 * Math.sin(t))); }
    for (k = 0; k < 8; k++) { t = th + k * Math.PI / 4; hd.push(C.pr(x + 10 * Math.cos(t), W2 + 3.05, ZC + 10 * Math.sin(t))); }
    self.setG('rc.roll.' + rl[0], '<path class="ml-teeth" d="' + segPath(segs) + '"/><path class="ml-dot" d="' + dotPath(dots, 0.6) + '"/>');
    self.setG('rc.hub.' + rl[0], '<path class="ml-dot" d="' + dotPath(hd, 0.55) + '"/>');
  });
  var s = D.s, H56 = 0.56 * (anim.H || 490), cx0 = (anim.W || 900) / 2, mat = (res && res.mat && res.mat.color) || '#b9b1a3', list = [], i;
  for (i = 0; i < anim.P.length; i++) {
    var p = anim.P[i], rr = p.r * s;
    if (!p.rock) { p.rock = []; for (var j = 0; j < 7; j++) p.rock.push(0.78 + Math.random() * 0.3); p.rot = Math.random() * 6.28; }
    list.push({ x: (p.x - cx0) * s, z: ZC + (H56 - p.y) * s, y: W2 - rr * 1.02, r: rr, p: p, dim: 1 });
  }
  c.save();
  c.beginPath(); c.rect(-1e4, -1e4, 3e4, 3e4);
  D.occl.forEach(function (pts) { c.moveTo(pts[0][0], pts[0][1]); for (var m = 1; m < pts.length; m++) c.lineTo(pts[m][0], pts[m][1]); c.closePath(); });
  [-D.XC, D.XC].forEach(function (x) { for (var m = 0; m <= 40; m++) { var a = m / 40 * Math.PI * 2, q = C.pr(x + R * Math.cos(a), W2, ZC + R * Math.sin(a)); if (m) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); } c.closePath(); });
  c.clip('evenodd');
  for (i = 0; i < list.length; i++) this.rock(list[i], mat, blue);
  this.flashes(anim, function (f) { return C.pr((f.x - cx0) * s, W2, ZC + (H56 - f.y) * s); });
  c.restore();
};
/* ---------- molino de martillos ---------- */
/* El rotor gira con el ángulo del lienzo; sus cuatro filas de martillos, los discos y los pasadores se pintan de atrás
   hacia adelante en cada cuadro. Las partículas van en el plano de la cara de adelante de la carcasa. */
FMill.prototype.drawMart = function (anim, res) {
  var D = this.D, C = this.C, c = this.ctx, px = this.px, blue = this.blue(), self = this;
  var th = -(anim.ang || 0), ZC = D.zc, W2 = D.W2, prism = function (poly, s0, s1, cls) { return prismSvg(C, poly, s0, s1, { F: FYF, tone: 'mid', cls: cls || '' }); };
  var parts = [], k, h, t;
  // los discos del rotor y los martillos entre ellos, a lo largo del eje
  D.discs.forEach(function (d) {
    var poly = []; for (var m = 0; m < 28; m++) { var a = th + m / 28 * Math.PI * 2; poly.push([D.rd * Math.cos(a), ZC + D.rd * Math.sin(a)]); }
    parts.push({ y: d[1], svg: prism(poly, d[0], d[1], 'ml-cast') + (function () { var pins = []; for (var q = 0; q < 4; q++) { var a = th + q * Math.PI / 2; pins.push(C.pr(D.rp * Math.cos(a), d[1] + 0.05, ZC + D.rp * Math.sin(a))); } return '<path class="ml-dot" d="' + dotPath(pins, 0.9) + '"/>'; })() });
  });
  D.rows.forEach(function (r) {
    for (h = 0; h < 4; h++) {
      t = th - h * Math.PI / 2; var ca = Math.cos(t), sa = Math.sin(t), na = -sa, nb = ca, r0 = D.r0, r1 = D.r1, w = D.hw;
      parts.push({ y: r[1], svg: prism([[ca * r0 - na * w, ZC + sa * r0 - nb * w], [ca * r1 - na * w, ZC + sa * r1 - nb * w], [ca * r1 + na * w, ZC + sa * r1 + nb * w], [ca * r0 + na * w, ZC + sa * r0 + nb * w]], r[0], r[1], 'ml-steel') });
    }
  });
  parts.sort(function (a, b) { return a.y - b.y; });
  this.setG('hm.rotor', parts.map(function (q) { return q.svg; }).join(''));
  // las partículas
  var s = D.s, cy0 = (anim.H || 490) / 2 + 4, cx0 = (anim.W || 900) / 2, mat = (res && res.mat && res.mat.color) || '#b9b1a3', i;
  c.save(); this.poly(D.open); c.clip();
  for (i = 0; i < anim.P.length; i++) {
    var p = anim.P[i], rr = p.r * s;
    if (!p.rock) { p.rock = []; for (var j = 0; j < 7; j++) p.rock.push(0.78 + Math.random() * 0.3); p.rot = Math.random() * 6.28; }
    this.rock({ x: (p.x - cx0) * s, z: ZC + (cy0 - p.y) * s, y: W2 - rr * 1.02, r: rr, p: p, dim: 1 }, mat, blue);
  }
  this.flashes(anim, function (f) { return C.pr((f.x - cx0) * s, W2, ZC + (cy0 - f.y) * s); });
  c.restore();
};
/* los destellos de fractura del lienzo, en el plano de la figura */
FMill.prototype.flashes = function (anim, at) {
  var c = this.ctx, px = this.px;
  (anim.fx || []).forEach(function (f) {
    var al = 1 - f.t / 0.45; if (al <= 0) return;
    var q = at(f), L = (1.4 + f.s * 0.1) * px;
    c.strokeStyle = '#C8452B'; c.globalAlpha = 0.85 * al; c.lineWidth = 1.1 * px; c.beginPath();
    for (var k = 0; k < 6; k++) { var an = k * Math.PI / 3; c.moveTo(q[0] + Math.cos(an) * L * 0.35, q[1] + Math.sin(an) * L * 0.35); c.lineTo(q[0] + Math.cos(an) * L, q[1] + Math.sin(an) * L); }
    c.stroke(); c.globalAlpha = 1;
  });
};
/* una roca: un polígono de siete lados con radios propios, en el plano (x, z) a la profundidad y */
FMill.prototype.rock = function (e, mat, blue) {
  var C = this.C, c = this.ctx, p = e.p, px = this.px, pts = [];
  for (var i = 0; i < 7; i++) { var a = p.rot + i / 7 * Math.PI * 2, r = e.r * p.rock[i]; pts.push(C.pr(e.x + r * Math.cos(a), e.y, e.z + r * Math.sin(a))); }
  this.poly(pts); c.fillStyle = shadeHex(mat, e.dim); c.fill(); c.lineWidth = 0.35 * px; c.strokeStyle = blue ? '#06182b' : '#4a4038'; c.stroke();
  // una cara de luz arriba a la izquierda
  c.beginPath(); c.moveTo(pts[2][0], pts[2][1]); c.lineTo(pts[3][0], pts[3][1]); c.lineTo(pts[4][0], pts[4][1]); c.lineTo((pts[0][0] + pts[3][0]) / 2, (pts[0][1] + pts[3][1]) / 2); c.closePath();
  c.fillStyle = 'rgba(255,255,255,' + (0.28 * e.dim) + ')'; c.fill();
};
/* el toggle: una placa con las dos puntas redondas, de a a b, media altura h */
function togPoly(a, b, h) {
  var d = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(d[0], d[1]); d = [d[0] / l, d[1] / l]; var n = [-d[1], d[0]], o = [], i, t;
  for (i = 0; i <= 8; i++) { t = Math.PI / 2 + Math.PI * i / 8; o.push([a[0] + h * (d[0] * Math.cos(t) - n[0] * Math.sin(t)), a[1] + h * (d[1] * Math.cos(t) - n[1] * Math.sin(t))]); }
  for (i = 0; i <= 8; i++) { t = -Math.PI / 2 + Math.PI * i / 8; o.push([b[0] + h * (d[0] * Math.cos(t) - n[0] * Math.sin(t)), b[1] + h * (d[1] * Math.cos(t) - n[1] * Math.sin(t))]); }
  return o;
}
FMill.prototype.metal = function (sh, blue) {
  var b = blue ? [70, 104, 140] : [118, 128, 140], hi = blue ? [150, 185, 215] : [205, 212, 220];
  return 'rgb(' + Math.round(b[0] + (hi[0] - b[0]) * sh) + ',' + Math.round(b[1] + (hi[1] - b[1]) * sh) + ',' + Math.round(b[2] + (hi[2] - b[2]) * sh) + ')';
};
/* ---------- molino de discos ---------- */
/* La cara del rotor gira con el ángulo del lienzo (sus ranuras, como en el lienzo) y lleva el color de la temperatura de
   salida; las partículas del lienzo (ρ, θ desde el ojo) van en la luz entre los dos discos. Todo esto vive en el lugar del
   rotor en el orden de pintura del SVG: la puerta y el disco fijo, que van delante, lo tapan salvo en la mitad abierta. */
FMill.prototype.drawDisc = function (anim, res) {
  var D = this.D, C = this.C, g = anim.geo, s = D.R / g.R, ZC = D.zc, th = anim.ang || 0, blue = this.blue(), k = this.kk, i, u;
  var P2 = function (x, y, z) { var q = C.pr(x, y, z); return q[0].toFixed(1) + ' ' + q[1].toFixed(1); };
  // del lienzo (y hacia abajo) al plano de la cara: x = ρ·s·cos θ, z = zc − ρ·s·sen θ
  var heat = Math.max(0, Math.min(1, ((res && res.Tout) - 30) / 70)) || 0, over = res && res.mat && res.mat.tmax && res.Tout > res.mat.tmax;
  var base = blue ? [52, 86, 122] : [150, 158, 167], hot = over ? [222, 140, 116] : [226, 186, 140], col = [0, 1, 2].map(function (j) { return Math.round(base[j] + (hot[j] - base[j]) * heat * 0.8); });
  var face = 'M'; for (i = 0; i < 72; i++) { var a = i / 72 * Math.PI * 2; face += (i ? 'L' : '') + P2(D.R * Math.cos(a), D.yr + 0.02, ZC + D.R * Math.sin(a)); }
  var html = '<path d="' + face + 'Z" style="fill:rgb(' + col.join(',') + ');stroke:none"/>';
  // las ranuras: 24 barras curvas de 0,22 R a R, como las del lienzo
  var gr = '';
  for (var b = 0; b < 24; b++) {
    var a2 = th + b * Math.PI / 12; gr += 'M';
    for (u = 0; u <= 10; u++) { var rr = D.R * (0.22 + 0.78 * u / 10), aa = a2 + u * 0.06; gr += (u ? 'L' : '') + P2(rr * Math.cos(aa), D.yr + 0.03, ZC - rr * Math.sin(aa)); }
  }
  html += '<path class="ds-groove" d="' + gr + '"/>';
  // las partículas: gruesas cerca del ojo, finas en la periferia (seis tonos del color del material)
  var mat = (res && res.mat && res.mat.color) || '#b9b1a3', bins = [[], [], [], [], [], []], P = anim.P;
  for (i = 0; i < P.length; i++) {
    var p = P[i], f = Math.max(0, Math.min(1, (p.r - 2) / 5)), x = (p.x - g.cx) * s, z = ZC + (g.cy - p.y) * s, q = C.pr(x, D.yg, z), r = Math.max(1.1, p.r * 1.35 * s * k);
    bins[Math.min(5, Math.floor(f * 6))].push([q, r]);
  }
  for (i = 0; i < 6; i++) {
    if (!bins[i].length) continue;
    var d = '';
    bins[i].forEach(function (e) { var X = e[0][0], Y = e[0][1], r = e[1]; d += 'M' + (X - r).toFixed(1) + ' ' + Y.toFixed(1) + 'a' + r.toFixed(2) + ' ' + r.toFixed(2) + ' 0 1 0 ' + (2 * r).toFixed(2) + ' 0a' + r.toFixed(2) + ' ' + r.toFixed(2) + ' 0 1 0 ' + (-2 * r).toFixed(2) + ' 0'; });
    html += '<path class="ds-grain" d="' + d + '" style="fill:' + mixHexF(mat, blue ? '#ffffff' : '#fff7ea', (1 - (i + 0.5) / 6) * 0.45) + '"/>';
  }
  this.setG('ds.face', html);
  // lo que hay en la tolva, con el color del material
  var hp = D.heap.map(function (q) { return C.pr(q[0], q[1], q[2]); }), dots = [];
  for (i = 0; i < 26; i++) { var fx = ((i * 0.618) % 1), fy = ((i * 0.381 + 0.17) % 1); dots.push([D.heap[0][0] + (D.heap[1][0] - D.heap[0][0]) * (0.06 + 0.88 * fx), D.heap[0][1] + (D.heap[2][1] - D.heap[0][1]) * (0.08 + 0.84 * fy), D.heap[0][2]]); }
  this.setG('ds.heap', '<path d="M' + hp.map(function (q) { return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join('L') + 'Z" style="fill:' + mat + ';stroke:none"/><path class="ds-speck" d="' + dotPath(dots.map(function (q) { return C.pr(q[0], q[1], q[2]); }), 0.9) + '"/>');
  // los agujeros del alma de la polea, que gira con el rotor
  var sv = [], Sh = D.sheave;
  for (i = 0; i < 5; i++) { var t = -th + i * Math.PI * 2 / 5; sv.push(C.pr(Sh.r * Math.cos(t), Sh.y, ZC + Sh.r * Math.sin(t))); }
  this.setG('ds.sheave', '<path class="ml-hole" d="' + dotPath(sv, 2.2 * this.kk / 2.5) + '"/>');
};
function mixHexF(a, b, t) { var pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16); return 'rgb(' + [16, 8, 0].map(function (sh) { return Math.round(((pa >> sh) & 255) * (1 - t) + ((pb >> sh) & 255) * t); }).join(',') + ')'; }
