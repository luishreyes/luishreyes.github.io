/* ====================================================================
   Acercar y mover una figura isométrica. En pantallas táctiles: pellizco
   para acercar, arrastre con un dedo para moverse cuando está acercada y
   doble toque para alternar. En escritorio: ctrl + rueda (o el pellizco
   del trackpad), arrastre y doble clic. Los botones + − y «todo» sirven
   en las dos. Solo cambia el viewBox: el dibujo y el código en vivo
   siguen en las mismas coordenadas.
   ==================================================================== */
function IsoZoom(wrap, svg, W, H) {
  var self = this;
  this.wrap = wrap; this.svg = svg; this.W = W; this.H = H; this.max = 5; this.vb = [0, 0, W, H];
  this.ptr = {}; this.pinch = null; this.drag = null; this.lastTap = null;
  svg.style.touchAction = 'pan-y';
  svg.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    self.ptr[e.pointerId] = { x: e.clientX, y: e.clientY };
    var ids = Object.keys(self.ptr);
    if (ids.length === 2) { self.startPinch(); self.drag = null; self.tap = null; self.lastTap = null; }
    else if (ids.length === 1) {
      self.tap = e.pointerType !== 'mouse' ? { t: performance.now(), x: e.clientX, y: e.clientY } : null;
      if (self.zoomed()) { self.drag = { x: e.clientX, y: e.clientY, vb: self.vb.slice() }; try { svg.setPointerCapture(e.pointerId); } catch (er) {} }
    }
  });
  svg.addEventListener('pointermove', function (e) {
    if (!self.ptr[e.pointerId]) return;
    self.ptr[e.pointerId] = { x: e.clientX, y: e.clientY };
    if (self.pinch && Object.keys(self.ptr).length >= 2) { e.preventDefault(); self.movePinch(); return; }
    if (self.drag) {
      e.preventDefault();
      var k = self.unit(), d = self.drag;
      self.set(d.vb[0] - (e.clientX - d.x) * k, d.vb[1] - (e.clientY - d.y) * k, d.vb[2]);
    }
  });
  var up = function (e) {
    // doble toque: acerca donde se tocó, o vuelve a la vista completa (solo toques cortos y quietos)
    var tp = self.tap; self.tap = null;
    if (tp && e.type === 'pointerup' && performance.now() - tp.t < 260 && Math.hypot(e.clientX - tp.x, e.clientY - tp.y) < 10 && Object.keys(self.ptr).length === 1) {
      var lt = self.lastTap, now = performance.now();
      if (lt && now - lt.t < 360 && Math.hypot(e.clientX - lt.x, e.clientY - lt.y) < 30) { self.lastTap = null; if (self.zoomed()) self.fit(); else self.zoomAt(2.4, e.clientX, e.clientY); }
      else self.lastTap = { t: now, x: e.clientX, y: e.clientY };
    }
    delete self.ptr[e.pointerId];
    if (Object.keys(self.ptr).length < 2) self.pinch = null;
    var ids = Object.keys(self.ptr);
    if (ids.length === 1 && self.zoomed()) { var p = self.ptr[ids[0]]; self.drag = { x: p.x, y: p.y, vb: self.vb.slice() }; } else if (!ids.length) self.drag = null;
  };
  svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up); svg.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') up(e); });
  svg.addEventListener('dblclick', function (e) { if (self.zoomed()) self.fit(); else self.zoomAt(2.4, e.clientX, e.clientY); });
  svg.addEventListener('wheel', function (e) {
    if (!(e.ctrlKey || e.metaKey)) return; // la rueda sola sigue moviendo la página
    e.preventDefault(); self.zoomAt(Math.exp(-e.deltaY * 0.0025), e.clientX, e.clientY);
  }, { passive: false });
  Array.prototype.forEach.call(wrap.querySelectorAll('[data-z]'), function (b) {
    b.addEventListener('click', function () {
      var r = svg.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      if (b.dataset.z === 'in') self.zoomAt(1.6, cx, cy); else if (b.dataset.z === 'out') self.zoomAt(1 / 1.6, cx, cy); else self.fit();
    });
  });
  this.set(0, 0, W);
}
IsoZoom.prototype.zoomed = function () { return this.vb[2] < this.W - 0.5; };
// px de pantalla → unidades del viewBox (preserveAspectRatio: xMidYMid meet)
IsoZoom.prototype.unit = function () { var r = this.svg.getBoundingClientRect(); return Math.max(this.vb[2] / (r.width || 1), this.vb[3] / (r.height || 1)); };
IsoZoom.prototype.toSvg = function (cx, cy) {
  var r = this.svg.getBoundingClientRect(), k = this.unit(), vb = this.vb;
  var ox = (r.width - vb[2] / k) / 2, oy = (r.height - vb[3] / k) / 2;
  return [vb[0] + (cx - r.left - ox) * k, vb[1] + (cy - r.top - oy) * k];
};
IsoZoom.prototype.set = function (x, y, w) {
  var W = this.W, H = this.H; w = Math.max(W / this.max, Math.min(W, w)); var h = w * H / W;
  x = Math.max(0, Math.min(W - w, x)); y = Math.max(0, Math.min(H - h, y));
  this.vb = [x, y, w, h];
  this.svg.setAttribute('viewBox', x.toFixed(2) + ' ' + y.toFixed(2) + ' ' + w.toFixed(2) + ' ' + h.toFixed(2));
  var z = this.zoomed(); this.svg.style.touchAction = z ? 'none' : 'pan-y'; this.wrap.classList.toggle('iz-on', z);
  var out = this.wrap.querySelector('[data-z="out"]'), fit = this.wrap.querySelector('[data-z="fit"]'), inb = this.wrap.querySelector('[data-z="in"]');
  if (out) out.disabled = !z; if (fit) fit.disabled = !z; if (inb) inb.disabled = w <= W / this.max + 0.5;
};
IsoZoom.prototype.zoomAt = function (f, cx, cy) {
  var p = this.toSvg(cx, cy), vb = this.vb, w = Math.max(this.W / this.max, Math.min(this.W, vb[2] / f)), s = w / vb[2];
  this.set(p[0] - (p[0] - vb[0]) * s, p[1] - (p[1] - vb[1]) * s, w);
};
IsoZoom.prototype.fit = function () { this.set(0, 0, this.W); };
IsoZoom.prototype.startPinch = function () {
  var ids = Object.keys(this.ptr), a = this.ptr[ids[0]], b = this.ptr[ids[1]];
  var mid = [(a.x + b.x) / 2, (a.y + b.y) / 2];
  this.pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, vb: this.vb.slice(), at: this.toSvg(mid[0], mid[1]), k: this.unit() };
};
IsoZoom.prototype.movePinch = function () {
  var ids = Object.keys(this.ptr), a = this.ptr[ids[0]], b = this.ptr[ids[1]], P = this.pinch;
  var d = Math.hypot(a.x - b.x, a.y - b.y) || 1, mid = [(a.x + b.x) / 2, (a.y + b.y) / 2];
  var w = Math.max(this.W / this.max, Math.min(this.W, P.vb[2] * P.d / d)), k = P.k * w / P.vb[2];
  // el punto que estaba bajo los dedos sigue bajo los dedos (acerca y mueve a la vez)
  var r = this.svg.getBoundingClientRect(), h = w * this.H / this.W, ox = (r.width - w / k) / 2, oy = (r.height - h / k) / 2;
  this.set(P.at[0] - (mid[0] - r.left - ox) * k, P.at[1] - (mid[1] - r.top - oy) * k, w);
};
