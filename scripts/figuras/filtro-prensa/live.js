/* ====================================================================
   El filtro prensa en vivo. FScene le pasa en cada cuadro el estado del
   ciclo del modelo (fase, avance, carga de la torta, presión, caudal y
   filtrado acumulado) y la figura lo dibuja:
   · las tortas crecen desde las dos telas con fill (la misma u = V/A);
   · la suspensión llena la cámara y el canal central mientras se filtra;
   · el filtrado baja por las caras de las placas y sale por el canal
     inferior con una velocidad proporcional al caudal del modelo;
   · el manómetro marca la presión y la mirilla el filtrado acumulado;
   · en la descarga el cilindro retira el cabezal móvil, las placas se
     corren una por una (resorte crítico, el mismo que audita la figura)
     y cada torta cae a la tolva cuando su cámara se abre.
   ==================================================================== */
function FPress(host, D) {
  this.host = host; this.D = D; this.svg = host.querySelector('svg');
  this.C = xCam(D.P);
  this.cakePoly = notched(D.YR, D.ZR0, D.ZR1, [{ zc: D.ZC, r: D.RC }]);
  this.boxPoly = [[0, D.ZR0], [D.YR, D.ZR0], [D.YR, D.ZR1], [0, D.ZR1]];
  this.eye = halfOct(D.ZC, D.RC, 8);
  var self = this, q = function (s) { return self.svg.querySelector(s); };
  this.cake = []; this.slurry = []; this.eyes = [];
  for (var j = 0; j <= D.NPL; j++) { this.cake.push([q('[data-live="cake' + j + 'L"]'), q('[data-live="cake' + j + 'R"]')]); this.slurry.push(q('[data-live="slurry' + j + '"]')); }
  this.eyeHead = q('[data-live="eye.head"]');
  for (var i = 0; i < D.NPL; i++) this.eyes.push(q('[data-live="eye' + i + '"]'));
  this.belt = q('[data-live="belt"]');
  this.needle = q('[data-live="needle"]'); this.setp = q('[data-live="setpoint"]'); this.sight = q('[data-live="sight"]'); this.pile = q('[data-live="pile"]');
  this.flowWalls = q('[data-live="flow.walls"]'); this.flowDrain = q('[data-live="flow.drain"]'); this.flowEye = q('[data-live="flow.eye"]');
  this.root = q('.fp-items') || this.svg;
  this.nodes = Array.prototype.map.call(this.svg.querySelectorAll('.it'), function (el) {
    var m = el.getAttribute('data-m').split(',').map(Number);
    return { el: el, piece: el.getAttribute('data-piece'), key: +el.getAttribute('data-k'), lift: m[0] * D.V[0] + m[1] * D.V[1] + m[2] * D.V[2], mx: m[0], shown: '' };
  });
  this.parent = this.nodes.length ? this.nodes[0].el.parentNode : this.svg;
  this.order = this.nodes.map(function (_, n) { return n; });
  this.share = {}; for (var id in D.pieces) this.share[id] = 0;
  this.sig = {}; this.offs = 0; this.drops = []; this.landed = []; this.lastK = 0; this.lastPhase = '';
}
FPress.prototype.reset = function () { this.drops = []; this.landed = []; this.pile.innerHTML = ''; this.lastPhase = ''; };
FPress.prototype.colors = function (cake, slurry, blue) {
  var st = this.svg.style, f = function (c, d) { return 'rgb(' + c.map(function (v) { return Math.max(0, Math.min(255, Math.round(v * d))); }).join(',') + ')'; };
  st.setProperty('--fp-cake', f(cake, 1)); st.setProperty('--fp-cake-0', f(cake, 0.72)); st.setProperty('--fp-cake-1', f(cake, 0.8));
  st.setProperty('--fp-cake-2', f(cake, 0.88)); st.setProperty('--fp-cake-3', f(cake, 0.94)); st.setProperty('--fp-cake-top', f(cake, 1.08)); st.setProperty('--fp-cake-edge', f(cake, 0.55));
  st.setProperty('--fp-slurry', f(slurry, 1)); st.setProperty('--fp-slurry-edge', f(slurry, 0.8));
};
// resorte crítico: la misma respuesta que replica el audit (rigidez 46, amortiguamiento 13,6 ≈ 2√46)
FPress.prototype.spring = function (t) { if (t <= 0) return 0; var w = Math.sqrt(this.D.spring.stiffness); return 1 - (1 + w * t) * Math.exp(-w * t); };
FPress.prototype.html = function (el, key, make) { if (this.sig[key] === make[0]) return; this.sig[key] = make[0]; el.innerHTML = make[1] ? make[1]() : ''; };
FPress.prototype.place = function () {
  var D = this.D, sh = this.share, self = this;
  for (var n = 0; n < this.nodes.length; n++) {
    var nd = this.nodes[n], s = sh[nd.piece] || 0, dx = nd.mx * s;
    var tx = dx * D.EX[0], ty = dx * D.EX[1];
    var text = Math.abs(dx) < 1e-3 ? '' : 'translate(' + tx.toFixed(2) + ' ' + ty.toFixed(2) + ')';
    if (text !== nd.shown) { nd.shown = text; if (text) nd.el.setAttribute('transform', text); else nd.el.removeAttribute('transform'); }
  }
  var next = this.nodes.map(function (_, n) { return n; }).sort(function (a, b) {
    var A = self.nodes[a], B = self.nodes[b];
    return A.key + A.lift * (sh[A.piece] || 0) - (B.key + B.lift * (sh[B.piece] || 0));
  });
  var same = true; for (var i = 0; i < next.length; i++) if (next[i] !== this.order[i]) { same = false; break; }
  if (!same) { var frag = document.createDocumentFragment(); for (i = 0; i < next.length; i++) frag.appendChild(this.nodes[next[i]].el); this.parent.appendChild(frag); this.order = next; }
};
/* descarga: tiempos en segundos de animación sobre Td */
/* La descarga en el tiempo de la animación (t = 8,5k). Primero se para la bomba y se abre el alivio: la presión de alimentación
   cae a cero, y solo con el manómetro en cero el cilindro afloja el cierre y retira el cabezal. Al final, con el paquete ya
   cerrado, la bomba vuelve a llenar las cámaras y la presión sube a la del arranque del ciclo siguiente. */
var FP_T = { base: 8.5, rel: 1.5, open: 1.65 };
FPress.prototype.stage = function (k, Td) {
  var D = this.D, sc = Math.max(1, Td / FP_T.base), t = k * Td / sc, T = Td / sc, nP = D.stagger.length, stg = D.spring.stagger;
  var tClose = FP_T.open + stg * (nP - 1) + 1.05, tShut = tClose + 1.5, tFill = Math.min(tShut + 0.15, T - 0.3);
  var ease = function (x) { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
  var rel = 1 - ease(t / FP_T.rel), fill = t > tFill ? ease((t - tFill) / Math.max(1e-6, T - tFill)) : 0;
  return { t: t, rel: rel, fill: fill, tClose: tClose, id: t < FP_T.rel ? 'alivio' : (t < tClose ? 'abre' : (t < tShut ? 'cierra' : (t < tFill ? 'cerrado' : 'llena'))) };
};
FPress.prototype.discharge = function (k, Td, w) {
  var D = this.D, g = this.stage(k, Td), t = g.t, tOpen = FP_T.open, stg = D.spring.stagger, nP = D.stagger.length;
  var tClose = g.tClose, dClose = 1.5, i, id;
  if (t < tClose) for (i = 0; i < nP; i++) this.share[D.stagger[i]] = this.spring(t - tOpen - i * stg);
  else { // el cilindro empuja: el cabezal móvil vuelve y arrastra las placas
    var u = Math.min(1, (t - tClose) / dClose), e = u * u * (3 - 2 * u), f = D.TRAVEL * (1 - e);
    this.share.follower = f / D.TRAVEL;
    for (i = 0; i < D.NPL; i++) { id = 'pl' + i; var cap = D.pieces[id][0]; this.share[id] = Math.min(cap, f) / cap; }
  }
  return t;
};
FPress.prototype.offset = function (piece) { return piece === 'frame' ? 0 : (this.share[piece] || 0) * this.D.pieces[piece][0]; };
FPress.prototype.update = function (s) {
  var fin = function (v, d) { return typeof v === 'number' && isFinite(v) ? v : d; };
  s.k = Math.min(1, Math.max(0, fin(s.k, 0))); s.Td = fin(s.Td, FP_T.base) > 0 ? fin(s.Td, FP_T.base) : FP_T.base; s.fill = Math.max(0, fin(s.fill, 0)); s.P = Math.max(0, fin(s.P, 0));
  s.Pset = fin(s.Pset, 0); s.qrel = Math.max(0, fin(s.qrel, 0)); s.vfrac = fin(s.vfrac, 0); s.dt = Math.max(0, fin(s.dt, 0));
  var D = this.D, C = this.C, self = this, j, w = Math.min(1, Math.max(0, s.fill)) * D.POCK, phase = s.phase, dis = phase === 'd';
  if (phase !== this.lastPhase) { if (phase === 'f') { this.drops = []; } this.lastPhase = phase; }
  if (dis && s.k < this.lastK - 1e-6) { this.drops = []; this.landed = []; this.pile.innerHTML = ''; }
  this.lastK = dis ? s.k : 0;
  // 1 · cabezal móvil y placas
  for (var id in this.share) this.share[id] = 0;
  var tD = dis ? this.discharge(s.k, s.Td, w) : 0, gs = dis ? this.stage(s.k, s.Td) : { id: '' };
  if (phase === 'f' || phase === 'w') this.lastLiq = phase === 'f' ? 'fp-slurry' : 'fp-wash';
  this.place();
  // 2 · tortas: crecen en la cámara; en la descarga se despegan y caen a la tolva
  var wFull = w, fallen = [];
  for (j = 0; j <= D.NPL; j++) {
    var wl = D.walls[j][0], wr = D.walls[j][1], rl = D.rides[j][0], rr = D.rides[j][1];
    var gap = this.offset(rr) - this.offset(rl), sideKeys = ['L', 'R'];
    for (var sI = 0; sI < 2; sI++) {
      var el = this.cake[j][sI], x0 = sI ? wr - wFull : wl, x1 = sI ? wr : wl + wFull, dx = 0, dz = 0, gone = false;
      if (dis) {
        var rec = this.drops[j * 2 + sI];
        if (!rec && gap > 2 * wFull + 1.2) rec = this.drops[j * 2 + sI] = { t0: tD };
        if (rec) {
          var tt = tD - rec.t0, slide = Math.min(1, tt / 0.16);
          dx = (sI ? -1 : 1) * (wFull + 0.25) * slide;
          var tf = Math.max(0, tt - 0.16); dz = -0.5 * 981 * tf * tf;
          if (D.ZR0 + dz <= D.HOP_FLOOR) { gone = true; if (!rec.land) { rec.land = true; this.land(j, sI, (x0 + x1) / 2 + dx + (sI ? this.offset(rr) : this.offset(rl)), wFull); } }
        }
      }
      var key = (gone || wFull < 0.02 ? 0 : wFull.toFixed(3)) + '';
      this.html(el, 'c' + j + sI, [key, gone || wFull < 0.02 ? null : function () { return xPrismSvg(C, self.cakePoly, x0, x1, { tone: 'mid', crease: 'faint', cls: 'fp-cake' }); }]);
      var tr = dx || dz ? 'translate(' + (dx * D.EX[0]).toFixed(2) + ' ' + (dx * D.EX[1] + dz * D.EZ[1]).toFixed(2) + ')' : '';
      if (el.getAttribute('transform') !== tr) { if (tr) el.setAttribute('transform', tr); else el.removeAttribute('transform'); }
    }
    // suspensión (o agua de lavado) entre las dos tortas
    // mientras se alivia la presión el líquido sigue en las cámaras; al final de la descarga la bomba las vuelve a llenar
    var liq = phase === 'f' ? 'fp-slurry' : (phase === 'w' ? 'fp-wash' : (gs.id === 'alivio' ? this.lastLiq || 'fp-slurry' : (gs.id === 'llena' ? 'fp-slurry' : ''))), gx0 = wl + wFull, gx1 = wr - wFull;
    if (dis && gs.id === 'llena') { gx0 = wl; gx1 = wr; }
    var lk = liq && gx1 - gx0 > 0.04 ? liq + gx0.toFixed(3) : '';
    this.html(this.slurry[j], 's' + j, [lk, lk ? function () { return xPrismSvg(C, self.boxPoly, gx0, gx1, { tone: 'faint', crease: 'none', cls: liq, flat: true }); } : null]);
  }
  // 3 · canal central
  var eyeCls = phase === 'f' ? 'fp-slurry' : (phase === 'w' ? 'fp-wash' : (gs.id === 'alivio' ? this.lastLiq || 'fp-slurry' : (gs.id === 'llena' ? 'fp-slurry' : '')));
  this.html(this.eyeHead, 'eh', [eyeCls, eyeCls ? function () { return xPrismSvg(C, self.eye, 0, D.XH, { tone: 'faint', crease: 'none', cls: eyeCls, flat: true }); } : null]);
  this.eyes.forEach(function (el, i) { var x = D.webs[i]; self.html(el, 'e' + i, [eyeCls, eyeCls ? function () { return xPrismSvg(C, self.eye, x - D.WEB / 2, x + D.WEB / 2, { tone: 'faint', crease: 'none', cls: eyeCls, flat: true }); } : null]); });
  // 4 · manómetro
  // en la descarga, s.P es la presión con que terminó el ciclo y s.P0 la del arranque del siguiente
  var Pb = dis ? Math.max(0, s.P * gs.rel + Math.max(0, fin(s.P0, 0)) * gs.fill) : s.P, v = Math.max(0, Math.min(D.GMAX * 1.03, Pb));
  var ang = 225 - 270 * v / D.GMAX; this.needle.setAttribute('transform', 'rotate(' + (-ang).toFixed(1) + ')');
  if (this.setp) { var sp = s.Pset > 0 ? 225 - 270 * Math.min(D.GMAX, s.Pset) / D.GMAX : null; this.setp.style.display = sp == null ? 'none' : ''; if (sp != null) this.setp.setAttribute('transform', 'rotate(' + (-sp).toFixed(1) + ')'); }
  var over = s.fill > 1.001; if (over !== this.over) { this.over = over; this.svg.classList.toggle('fp-over', over); }
  // 5 · mirilla del tanque de filtrado
  var lev = Math.max(0, Math.min(1, s.vfrac)), S = D.SIGHT, yTop = S.bot[1] + (S.top[1] - S.bot[1]) * lev, xTop = S.bot[0] + (S.top[0] - S.bot[0]) * lev;
  this.sight.setAttribute('d', lev > 0.005 ? 'M' + S.bot[0].toFixed(2) + ' ' + S.bot[1].toFixed(2) + 'L' + xTop.toFixed(2) + ' ' + yTop.toFixed(2) : '');
  // 6 · flujos: el filtrado baja por las placas y sale por el canal inferior
  var flowing = !dis && s.qrel > 0.002, op = flowing ? Math.min(1, 0.25 + s.qrel * 1.2) : 0;
  this.offs -= (s.dt || 0) * (6 + 34 * Math.min(1.5, s.qrel));
  [this.flowWalls, this.flowDrain, this.flowEye].forEach(function (g, n) { if (!g) return; g.style.opacity = n === 2 ? (phase === 'f' ? Math.min(1, 0.3 + s.qrel) : (phase === 'w' ? 0.6 : (dis && gs.id === 'llena' ? 0.6 * gs.fill + 0.2 : 0))) : op; g.style.strokeDashoffset = self.offs.toFixed(1); });
  // 7 · al empezar el ciclo siguiente la banda se lleva las tortas de la tolva
  var move = 0;
  if (phase === 'f' && this.landed.length) {
    var u = Math.min(1, s.k / 0.1); move = 150 * u; var fade = u < 0.55 ? 1 : Math.max(0, 1 - (u - 0.55) / 0.45);
    this.pile.setAttribute('transform', 'translate(' + (move * D.EX[0]).toFixed(2) + ' ' + (move * D.EX[1]).toFixed(2) + ')'); this.pile.style.opacity = fade.toFixed(3);
    if (u >= 1) { this.landed = []; this.pile.innerHTML = ''; this.pile.removeAttribute('transform'); this.pile.style.opacity = '1'; }
  } else { this.pile.removeAttribute('transform'); this.pile.style.opacity = '1'; }
  if (this.belt) { if (move !== this.beltLast) { this.beltOff = (this.beltOff || 0) - (move - (this.beltLast || 0)) * Math.hypot(D.EX[0], D.EX[1]); this.beltLast = move; this.belt.style.strokeDashoffset = this.beltOff.toFixed(1); } }
};
// la torta se rompe al llegar al fondo de la tolva: trozos planos apilados por franjas
FPress.prototype.land = function (j, sI, xc, w) {
  var D = this.D, C = this.C, n = 2, seed = j * 7 + sI * 3 + 1;
  var rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  for (var c = 0; c < n; c++) {
    var len = 7 + rnd() * 5, dep = 7 + rnd() * 4, x0 = xc - len / 2 + (rnd() - 0.5) * 6, y1 = -1.5 - (sI * 2 + c) * 5.6 - rnd() * 1.5, y0 = Math.max(-24.5, y1 - dep);
    var h = Math.max(0.9, 2 * w * (0.7 + rnd() * 0.3)), z0 = this.heightAt(x0, x0 + len, y0, y1);
    this.landed.push({ x0: x0, x1: x0 + len, y0: y0, y1: y1, z0: z0, z1: z0 + h });
  }
  var list = this.landed.slice().sort(function (p, q) { return C.depth((p.x0 + p.x1) / 2, (p.y0 + p.y1) / 2, p.z0) - C.depth((q.x0 + q.x1) / 2, (q.y0 + q.y1) / 2, q.z0); });
  this.pile.innerHTML = list.map(function (b) { return xPrismSvg(C, [[b.y1, b.z0], [b.y0, b.z0], [b.y0, b.z1], [b.y1, b.z1]], b.x0, b.x1, { tone: 'mid', cls: 'fp-cake' }); }).join('');
};
FPress.prototype.heightAt = function (x0, x1, y0, y1) {
  var z = this.D.HOP_FLOOR;
  for (var i = 0; i < this.landed.length; i++) { var b = this.landed[i]; if (b.x0 < x1 && b.x1 > x0 && b.y0 < y1 && b.y1 > y0) z = Math.max(z, b.z1); }
  return z;
};
