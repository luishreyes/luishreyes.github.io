/* ====================================================================
   El armazón de los exploradores con la imagen del libro (POU 2027-10).
   Va con su hoja, /classroom/explorador-libro.css, y la guía está en
   SIMULADORES.md, «Exploradores con la imagen del libro (2027-10)».

   Cada explorador declara solo lo suyo: el modelo (el caso y la función
   que calcula), los controles, las configuraciones y las escenas (la
   pregunta, los números, el veredicto, la predicción, las figuras y los
   pasos del cálculo). El armazón pone todo lo demás: la barra de arriba,
   el riel de escenas y las teclas, los mandos con su «caso: …» y «Más
   ajustes», la tarjeta para predecir, las configuraciones, el estado «con
   cambios», la capa «¿Cómo se calcula?» con KaTeX, la hoja del celular y
   el ciclo de vida de las figuras: SVG propio, isométricas del skill
   anatomy con su acercamiento, lienzos canvas y escenas 3D con three.js.

   JavaScript sin dependencias. KaTeX (/classroom/vendor/katex/) se carga
   en la página antes de este archivo; three.js (/classroom/vendor/three/)
   se pide solo cuando una escena con una figura 3D se abre.
   No guarda nada en localStorage salvo lo que el explorador pida con
   XL.pref (preferencias de vista).
   ==================================================================== */
(function () {
  'use strict';
  if (window.XL) return;
  var XL = window.XL = {};
  var mq = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  XL.reducido = function () { return !!mq.matches; };
  XL.LIBRO = 'https://libro.luishreyes.com/';

  /* ================= Formato ================= */
  var NB = ' ';
  XL.NB = NB;
  // Número con coma decimal, espacio de miles desde 10 000 y signo menos tipográfico.
  function num(x, d) {
    if (x === Infinity) return '∞';
    if (typeof x !== 'number' || !isFinite(x)) return 'sin dato';
    var t = Math.abs(x).toFixed(d == null ? 0 : d), neg = x < 0 && Number(t) !== 0, p = t.split('.'), e = p[0];
    if (e.length > 4) e = e.replace(/\B(?=(\d{3})+(?!\d))/g, NB);
    return (neg ? '−' : '') + e + (p[1] ? ',' + p[1] : '');
  }
  function un(x, d, u) { return num(x, d) + NB + u; }
  function pct(f, d) { return num(100 * f, d || 0) + NB + '%'; }
  // el mismo número para KaTeX: {,} decimal, \, de miles y - de menos
  function kn(x, d) { return num(x, d).replace(',', '{,}').replace(/ /g, '\\,').replace('−', '-'); }
  function man(x) { var e = Math.floor(Math.log10(Math.abs(x))), c = x / Math.pow(10, e); if (Math.abs(c) >= 9.995) { c /= 10; e += 1; } return [c, e]; }
  function kc(x, d) { var m = man(x); return kn(m[0], d == null ? 2 : d) + '\\times10^{' + m[1] + '}'; }
  function hc(x, d) {
    var m = man(x), sup = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
    return num(m[0], d == null ? 2 : d) + NB + '×' + NB + '10' + String(m[1]).split('').map(function (c) { return sup[c]; }).join('');
  }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ico(id) { return '<svg class="xl-ico" aria-hidden="true"><use href="#i-' + id + '"/></svg>'; }
  function K(tex) {
    if (!window.katex) return '<code>' + esc(tex) + '</code>';
    return katex.renderToString(tex, { displayMode: true, throwOnError: false, strict: false });
  }
  function Ki(tex) {
    if (!window.katex) return '<code>' + esc(tex) + '</code>';
    return katex.renderToString(tex, { displayMode: false, throwOnError: false, strict: false });
  }
  // En pantallas angostas, una ecuación larga se parte antes de su último «=» y en cada \qquad, para que el
  // resultado no quede fuera de la vista.
  function aNivel0(t, pat) {
    var out = [], d = 0;
    for (var i = 0; i < t.length; i++) {
      var c = t[i];
      if (c === '\\' && t[i + 1] === '{') { i++; continue; }
      if (c === '{') d++; else if (c === '}') d--;
      else if (d === 0 && t.substr(i, pat.length) === pat) out.push(i);
    }
    return out;
  }
  function partir(tex) {
    if (window.innerWidth >= 700) return tex;
    var out = [];
    tex.split('\\\\').forEach(function (l) {
      var cortes = aNivel0(l, '\\qquad'), piezas = [], a = 0;
      cortes.forEach(function (c) { piezas.push(l.slice(a, c)); a = c + 6; });
      piezas.push(l.slice(a));
      piezas.forEach(function (p) {
        var visible = p.replace(/\\[a-zA-Z]+/g, ' ').replace(/[{}^_]/g, '').replace(/\s+/g, ' ').trim();
        var iguales = aNivel0(p, '=');
        if (visible.length > 30 && iguales.length > 1) { var k = iguales[iguales.length - 1]; out.push(p.slice(0, k)); out.push(p.slice(k)); }
        else out.push(p);
      });
    });
    return out.length > 1 ? '\\begin{gathered}' + out.join('\\\\ ') + '\\end{gathered}' : out[0];
  }
  function enlace(ruta, txt) {
    var url = /^(https?:)?\/\//.test(ruta) ? ruta : XL.LIBRO + ruta;
    return '<a href="' + url + '" target="_blank" rel="noopener">' + txt + ico('fuera') + '</a>';
  }
  XL.num = num; XL.un = un; XL.pct = pct; XL.kn = kn; XL.kc = kc; XL.hc = hc; XL.esc = esc;
  XL.ico = ico; XL.K = K; XL.Ki = Ki; XL.partir = partir; XL.enlace = enlace;

  /* ================= Dibujo en SVG ================= */
  var NS = 'http://www.w3.org/2000/svg';
  // La paleta de las figuras del libro: cada color con un solo significado.
  var C = { tinta: '#19222F', sec: '#525C64', guia: '#8A96A3', eje: '#AEB8C2', borde: '#D3D9DF', rej: '#E3E8EE', zona: '#F1F3F5', blanco: '#FFFFFF',
    amarillo: '#FFF500', oliva: '#6E6A00', azul: '#2E5E9E', alerta: '#B3261E', fuera: '#F6D9C8',
    agua: '#E4EEF7', aguaM: '#BCD0E6', aguaO: '#8FB0CF', aceite: '#F3E9BE', aceiteM: '#E3CF7A', aceiteO: '#B08A1E',
    metal: '#C9D1D9', metalM: '#AEB8C2', metalO: '#8A96A3', metalC: '#E1E4E7' };
  function el(tag, at, padre) { var e = document.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); if (padre) padre.appendChild(e); return e; }
  function texto(padre, x, y, txt, cls, anc) { var e = el('text', { x: x, y: y, class: cls || 'f-t' }, padre); if (anc) e.setAttribute('text-anchor', anc); e.textContent = txt; return e; }
  function attrs(e, at) { for (var k in at) e.setAttribute(k, at[k]); return e; }
  function hex(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }
  function mezcla(a, b, f) { var x = hex(a), y = hex(b); return 'rgb(' + x.map(function (v, i) { return Math.round(v + (y[i] - v) * f); }).join(',') + ')'; }
  function entre(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function azar(semilla) { var a = semilla >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function suave(f) { f = entre(f, 0, 1); return f * f * (3 - 2 * f); }
  // instrumento ISA: círculo con las dos líneas del rótulo
  function burbuja(padre, cx, cy, l1, l2) {
    var g = el('g', {}, padre);
    el('circle', { cx: cx, cy: cy, r: 19, fill: C.blanco, stroke: C.tinta, 'stroke-width': 1.4 }, g);
    texto(g, cx, cy - 2, l1, 'f-tag', 'middle'); texto(g, cx, cy + 13, l2, 'f-tag', 'middle');
    return g;
  }
  // válvula de compuerta en una línea vertical, abierta (blanca) o cerrada (llena)
  function valvula(padre, x, y, abierta) {
    return el('path', { d: 'M' + (x - 9) + ' ' + (y - 7) + 'L' + (x + 9) + ' ' + (y + 7) + 'L' + (x + 9) + ' ' + (y - 7) + 'L' + (x - 9) + ' ' + (y + 7) + 'Z',
      fill: abierta ? C.blanco : C.tinta, stroke: C.tinta, 'stroke-width': 1.4, transform: 'rotate(90 ' + x + ' ' + y + ')' }, padre);
  }
  function flecha(padre, x1, y1, x2, y2, color, w) {
    var a = Math.atan2(y2 - y1, x2 - x1), L = 8;
    el('line', { x1: x1, y1: y1, x2: x2 - Math.cos(a) * 4, y2: y2 - Math.sin(a) * 4, stroke: color, 'stroke-width': w || 2 }, padre);
    el('path', { d: 'M' + x2 + ' ' + y2 + 'L' + (x2 - L * Math.cos(a - 0.45)) + ' ' + (y2 - L * Math.sin(a - 0.45)) + 'L' + (x2 - L * Math.cos(a + 0.45)) + ' ' + (y2 - L * Math.sin(a + 0.45)) + 'Z', fill: color }, padre);
  }
  // tangentes exteriores entre dos círculos (para una lupa)
  function tangentes(x1, y1, r1, x2, y2, r2) {
    var dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy), a = Math.atan2(dy, dx), b = Math.acos((r1 - r2) / d), out = [];
    [a + b, a - b].forEach(function (t) { out.push([x1 + r1 * Math.cos(t), y1 + r1 * Math.sin(t), x2 + r2 * Math.cos(t), y2 + r2 * Math.sin(t)]); });
    return out;
  }
  XL.dib = { NS: NS, C: C, el: el, texto: texto, attrs: attrs, mezcla: mezcla, entre: entre, azar: azar, suave: suave,
    burbuja: burbuja, valvula: valvula, flecha: flecha, tangentes: tangentes };

  /* ================= Íconos (Lucide, en un solo sprite) ================= */
  var SIMBOLOS = {
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    rot: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    abajo: '<path d="m6 9 6 6 6-6"/>',
    der: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    cuadros: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    sigma: '<path d="M18 7V5a1 1 0 0 0-1-1H6.5a.5.5 0 0 0-.4.8l4.5 6a2 2 0 0 1 0 2.4l-4.5 6a.5.5 0 0 0 .4.8H17a1 1 0 0 0 1-1v-2"/>',
    ajustes: '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
    ayuda: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
    ok: '<path d="M20 6 9 17l-5-5"/>',
    alerta: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    libro: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    fuera: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    menos: '<path d="M5 12h14"/>',
    mas: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    pausa: '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>'
  };
  var sprite = null;
  // XL.simbolos({ id: '<path …/>' }) agrega íconos al sprite; se usan con XL.ico('id').
  XL.simbolos = function (mas) {
    for (var k in mas) SIMBOLOS[k] = mas[k];
    if (sprite) pintarSprite();
  };
  function pintarSprite() {
    var h = '';
    for (var k in SIMBOLOS) h += '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + SIMBOLOS[k] + '</symbol>';
    sprite.innerHTML = h;
  }

  /* ================= Preferencias de vista ================= */
  // Lo único que un explorador puede recordar entre visitas: una preferencia de vista (nunca un valor del modelo).
  var PREF = 'xl:';
  XL.pref = function (clave, valor) {
    var k = PREF + (XL._id || 'x') + ':' + clave;
    try {
      if (arguments.length < 2) { var v = localStorage.getItem(k); return v == null ? undefined : JSON.parse(v); }
      if (valor === undefined) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(valor));
    } catch (e) { return undefined; }
  };
  // borra lo que guardaban las versiones anteriores del explorador (por ejemplo, 'pou-molienda:')
  function limpiarViejo(prefijos) {
    try {
      var borrar = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (prefijos.some(function (p) { return k.indexOf(p) === 0; })) borrar.push(k);
      }
      borrar.forEach(function (k) { localStorage.removeItem(k); });
    } catch (e) { /* sin almacenamiento */ }
  }

  /* ================= El acercamiento de las isométricas ================= */
  // El de los exploradores de siempre: pellizco, arrastre, doble toque o doble clic, ctrl + rueda y los botones
  // + − «todo». Una isométrica tiene la cámara fija: solo se acerca y se mueve. X0 y Y0, el origen del viewBox.
  function IsoZoom(wrap, svg, W, H, X0, Y0) {
    var self = this;
    this.wrap = wrap; this.svg = svg; this.W = W; this.H = H; this.x0 = X0 || 0; this.y0 = Y0 || 0; this.max = 5;
    this.vb = [this.x0, this.y0, W, H]; this.ptr = {}; this.pinch = null; this.drag = null; this.lastTap = null; this.alCambiar = null;
    svg.style.touchAction = 'pan-y';
    svg.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return; self.kind = e.pointerType;
      self.ptr[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(self.ptr);
      if (ids.length === 2) { self.startPinch(); self.drag = null; self.tap = null; self.lastTap = null; }
      else if (ids.length === 1) {
        self.tap = e.pointerType !== 'mouse' ? { t: performance.now(), x: e.clientX, y: e.clientY } : null;
        if (self.zoomed()) { self.drag = { x: e.clientX, y: e.clientY, vb: self.vb.slice() }; try { svg.setPointerCapture(e.pointerId); } catch (er) { /* nada */ } }
      }
    });
    svg.addEventListener('pointermove', function (e) {
      if (!self.ptr[e.pointerId]) return;
      self.ptr[e.pointerId] = { x: e.clientX, y: e.clientY };
      if (self.pinch && Object.keys(self.ptr).length >= 2) { e.preventDefault(); self.movePinch(); return; }
      if (self.drag) { e.preventDefault(); var k = self.unit(), d = self.drag; self.set(d.vb[0] - (e.clientX - d.x) * k, d.vb[1] - (e.clientY - d.y) * k, d.vb[2]); }
    });
    var up = function (e) {
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
    svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up);
    svg.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') up(e); });
    svg.addEventListener('dblclick', function (e) { if (self.kind && self.kind !== 'mouse') return; if (self.zoomed()) self.fit(); else self.zoomAt(2.4, e.clientX, e.clientY); });
    svg.addEventListener('wheel', function (e) {
      if (!(e.ctrlKey || e.metaKey)) return; // la rueda sola sigue moviendo la página
      e.preventDefault(); self.zoomAt(Math.exp(-e.deltaY * 0.0025), e.clientX, e.clientY);
    }, { passive: false });
    // los botones se enlazan una vez y actúan sobre la figura que esté puesta (puede cambiar con la variante)
    wrap._iz = this;
    if (!wrap.dataset.izBound) {
      wrap.dataset.izBound = '1';
      Array.prototype.forEach.call(wrap.querySelectorAll('[data-z]'), function (b) {
        b.addEventListener('click', function () {
          var z = wrap._iz; if (!z) return;
          var r = z.svg.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          if (b.dataset.z === 'in') z.zoomAt(1.6, cx, cy); else if (b.dataset.z === 'out') z.zoomAt(1 / 1.6, cx, cy); else z.fit();
        });
      });
    }
    this.set(this.x0, this.y0, W);
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
    x = Math.max(this.x0, Math.min(this.x0 + W - w, x)); y = Math.max(this.y0, Math.min(this.y0 + H - h, y));
    this.vb = [x, y, w, h];
    this.svg.setAttribute('viewBox', x.toFixed(2) + ' ' + y.toFixed(2) + ' ' + w.toFixed(2) + ' ' + h.toFixed(2));
    var z = this.zoomed(); this.svg.style.touchAction = z ? 'none' : 'pan-y'; this.wrap.classList.toggle('iz-on', z);
    var out = this.wrap.querySelector('[data-z="out"]'), fit = this.wrap.querySelector('[data-z="fit"]'), inb = this.wrap.querySelector('[data-z="in"]');
    if (out) out.disabled = !z; if (fit) fit.disabled = !z; if (inb) inb.disabled = w <= W / this.max + 0.5;
    if (this.alCambiar) this.alCambiar(this.vb);
  };
  IsoZoom.prototype.zoomAt = function (f, cx, cy) {
    var p = this.toSvg(cx, cy), vb = this.vb, w = Math.max(this.W / this.max, Math.min(this.W, vb[2] / f)), s = w / vb[2];
    this.set(p[0] - (p[0] - vb[0]) * s, p[1] - (p[1] - vb[1]) * s, w);
  };
  IsoZoom.prototype.fit = function () { this.set(this.x0, this.y0, this.W); };
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
  XL.IsoZoom = IsoZoom;

  /* ================= three.js, cuando haga falta ================= */
  var TRES = '/classroom/vendor/three/three.module.min.js', tresP = null;
  // El mapa de importación que pide OrbitControls ('three'). Lo ideal es declararlo en el <head> de la página; si no
  // está, se agrega aquí, antes de que se cargue cualquier módulo.
  function asegurarMapa() {
    if (document.querySelector('script[type="importmap"]')) return;
    var s = document.createElement('script');
    s.type = 'importmap';
    s.textContent = JSON.stringify({ imports: { three: TRES } });
    document.head.appendChild(s);
  }
  XL.three = function () {
    if (!tresP) {
      asegurarMapa();
      tresP = Promise.all([import('three'), import('/classroom/vendor/three/OrbitControls.js')])
        .then(function (m) { return { THREE: m[0], OrbitControls: m[1].OrbitControls }; });
      tresP.catch(function () { tresP = null; });
    }
    return tresP;
  };
  function liberarTres(obj) {
    if (!obj || !obj.traverse) return;
    obj.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (m) {
        for (var k in m) if (m[k] && m[k].isTexture) m[k].dispose();
        m.dispose();
      });
    });
  }

  /* ================= Las figuras: un ciclo de vida para todos los tipos ================= */
  /* Cada figura pasa por: montar (la primera vez que su escena se abre; las isométricas y las 3D cargan aparte),
     poner (con cada resultado del modelo: modo 'entrar' al abrir la escena, 'cambio' cuando el estudiante mueve
     algo, 'fijo' cuando solo hay que volver a dibujar, como al cambiar el tamaño), cuadro (cada cuadro de animación
     mientras está activa), pausar y reanudar (deja de estar activa: otra escena, la pestaña oculta, la capa abierta
     o la figura fuera de la pantalla en el celular) y desmontar (al salir de la escena si se declara liberar, que es
     lo que hacen las 3D, y al cerrar la página). */
  var cacheSvg = {};
  function traerSvg(url) {
    if (!cacheSvg[url]) {
      cacheSvg[url] = fetch(url).then(function (r) { if (!r.ok) throw new Error('No se pudo traer ' + url + ' (' + r.status + ')'); return r.text(); });
      cacheSvg[url].catch(function () { delete cacheSvg[url]; });
    }
    return cacheSvg[url];
  }
  function medida(v, arg) { return typeof v === 'function' ? v(arg) : v; }
  function ponerAr(elm, vista) { if (vista && vista[0] && vista[1]) elm.style.setProperty('--ar', vista[0] + ' / ' + vista[1]); }
  function div(cls, padre) { var d = document.createElement('div'); d.className = cls; if (padre) padre.appendChild(d); return d; }

  var TIPOS = {};

  // Un dibujo propio en SVG: el armazón crea el <svg> con su viewBox y la figura dibuja dentro.
  TIPOS.svg = {
    crear: function (f) {
      var s = f.spec, v = s.vista || [400, 400];
      var svg = el('svg', { viewBox: '0 0 ' + v[0] + ' ' + v[1], role: 'img', 'aria-label': s.alt || s.titulo || '', preserveAspectRatio: 'xMidYMid meet', class: 'xl-cuerpo' });
      ponerAr(svg, v);
      return svg;
    },
    montar: function (f, listo) { f.X.svg = f.cuerpo; f.llamar('montar', f.cuerpo); listo(); },
    desmontar: function (f) { while (f.cuerpo.firstChild) f.cuerpo.removeChild(f.cuerpo.firstChild); }
  };

  // Un bloque de HTML libre (una tabla, una tarjeta, un catálogo de gráficas).
  TIPOS.html = {
    crear: function (f) { var d = div('xl-cuerpo xl-html'); if (f.spec.alt) { d.setAttribute('role', 'group'); d.setAttribute('aria-label', f.spec.alt); } ponerAr(d, f.spec.vista); return d; },
    montar: function (f, listo) { f.llamar('montar', f.cuerpo); listo(); },
    desmontar: function (f) { f.cuerpo.innerHTML = ''; }
  };

  // Una isométrica del skill anatomy: el SVG viene de un archivo (svg: url o función de la variante) o de una
  // <template> de la página (plantilla: id), entre los marcadores de su splice.mjs. El armazón la pone, le da el
  // acercamiento y los rótulos, y la figura la mueve con su código en vivo.
  TIPOS.iso = {
    crear: function (f) {
      var s = f.spec, d = div('xl-cuerpo xl-iso iso' + (s.clase ? ' ' + s.clase : ''));
      d.setAttribute('data-theme', 'light');
      // el dibujo es la imagen; los botones del acercamiento quedan fuera de ella, al alcance del teclado
      d.innerHTML = '<div class="iz-wrap"><div class="xl-slot" role="img" aria-label="' + esc(s.alt || s.titulo || '') + '"></div><div class="xl-rotulos" aria-hidden="true"></div>' +
        '<div class="iz-ctl" role="group" aria-label="Acercar la figura"><button type="button" data-z="in" aria-label="Acercar" title="Acercar (también: pellizco o ctrl + rueda)">+</button>' +
        '<button type="button" data-z="out" aria-label="Alejar" title="Alejar">−</button><button type="button" data-z="fit" aria-label="Ver la figura completa" title="Ver todo">todo</button></div></div>';
      f.wrap = d.firstChild; f.slot = f.wrap.querySelector('.xl-slot'); f.capaRot = f.wrap.querySelector('.xl-rotulos');
      if (typeof s.vista !== 'function') ponerAr(d, s.vista);
      return d;
    },
    montar: function (f, listo) {
      var s = f.spec, v = s.variante ? s.variante(f.app.R()) : '', token = {};
      f.variante = v; f.tokenIso = token;
      // plantilla (id de una <template> de la página) o svg (dirección del archivo); los dos pueden depender de la
      // variante, y una plantilla que devuelve vacío deja que la variante se traiga del archivo
      var fuente, pid = medida(s.plantilla, v);
      if (pid) {
        var t = document.getElementById(pid);
        fuente = t ? Promise.resolve(t.innerHTML) : Promise.reject(new Error('No está la plantilla ' + pid));
      } else fuente = traerSvg(medida(s.svg, v));
      fuente.then(function (txt) {
        if (f.tokenIso !== token) return;
        f.slot.innerHTML = txt;
        var svg = f.slot.querySelector('svg');
        if (!svg) throw new Error('La figura no trae un <svg>');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.removeAttribute('width'); svg.removeAttribute('height');
        svg.setAttribute('aria-hidden', 'true');
        var vb = (svg.getAttribute('viewBox') || '').split(/[\s,]+/).map(Number);
        var vista = medida(s.vista, v) || [vb[2], vb[3]];
        ponerAr(f.cuerpo, vista);
        var o = s.origen ? medida(s.origen, v) : [vb[0] || 0, vb[1] || 0];
        f.X.svg = svg; f.X.slot = f.slot; f.X.variante = v; f.X.vista = vista;
        f.zoom = f.X.zoom = new IsoZoom(f.wrap, svg, vista[0], vista[1], o[0], o[1]);
        f.zoom.alCambiar = function () { f.rotular(); };
        f.llamar('montar', f.slot);
        listo();
      }).catch(function (e) { if (f.tokenIso === token) listo(e); });
    },
    // la variante (otra figura para otro estado, como la succión con elevación) se revisa con cada resultado
    antesDePoner: function (f, r) {
      if (!f.spec.variante) return true;
      var v = f.spec.variante(r);
      if (v === f.variante) return true;
      f.recargar();
      return false;
    },
    desmontar: function (f) { f.tokenIso = null; f.slot.innerHTML = ''; f.capaRot.innerHTML = ''; f.zoom = f.X.zoom = null; f.rot = null; }
  };

  // Un lienzo canvas. Con vista: [ancho, alto] la figura dibuja en esas unidades, centradas y a escala (como un
  // viewBox); sin vista, en píxeles CSS del recuadro. El armazón cuida la densidad de la pantalla y el tamaño.
  TIPOS.canvas = {
    crear: function (f) {
      var d = div('xl-cuerpo xl-lienzo');
      var cv = document.createElement('canvas');
      cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', f.spec.alt || f.spec.titulo || '');
      d.appendChild(cv); f.canvas = cv;
      ponerAr(d, f.spec.vista || f.spec.proporcion || [4, 3]);
      return d;
    },
    montar: function (f, listo) {
      var X = f.X, cv = f.canvas, v = f.spec.vista;
      X.canvas = cv; X.ctx = cv.getContext('2d');
      X.ancho = v ? v[0] : 0; X.alto = v ? v[1] : 0;
      X.limpiar = function () { var c = X.ctx; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, cv.width, cv.height); c.restore(); };
      TIPOS.canvas.medir(f);
      f.ro = window.ResizeObserver ? new ResizeObserver(function () { if (TIPOS.canvas.medir(f)) f.redibujar(); }) : null;
      if (f.ro) f.ro.observe(f.cuerpo);
      f.llamar('montar', cv);
      listo();
    },
    medir: function (f) {
      var X = f.X, cv = f.canvas, w = f.cuerpo.clientWidth, h = f.cuerpo.clientHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
      if (!w || !h) return false;
      var W = Math.round(w * dpr), H = Math.round(h * dpr);
      if (cv.width === W && cv.height === H && X._dpr === dpr) return false;
      cv.width = W; cv.height = H; X._dpr = dpr;
      var v = f.spec.vista;
      if (v) {
        var k = Math.min(w / v[0], h / v[1]);
        X.ancho = v[0]; X.alto = v[1]; X.escala = k * dpr;
        X.ctx.setTransform(dpr * k, 0, 0, dpr * k, dpr * (w - v[0] * k) / 2, dpr * (h - v[1] * k) / 2);
      } else {
        X.ancho = w; X.alto = h; X.escala = dpr;
        X.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      f.llamar('redimensionar', X.ancho, X.alto);
      return true;
    },
    desmontar: function (f) { if (f.ro) f.ro.disconnect(); f.ro = null; if (f.X.limpiar) f.X.limpiar(); }
  };

  // Una escena 3D con three.js. El armazón carga three.js la primera vez, crea el renderer sobre su canvas y lo
  // dibuja solo mientras la figura está activa; montar arma X.escena y X.camara (y, si quiere, X.controles con
  // X.OrbitControls). Con bajoDemanda: true solo dibuja después de poner, de mover la cámara o de X.redibujar().
  TIPOS.three = {
    crear: function (f) {
      var d = div('xl-cuerpo xl-tres');
      var cv = document.createElement('canvas');
      cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', f.spec.alt || f.spec.titulo || '');
      d.appendChild(cv); f.canvas = cv;
      ponerAr(d, f.spec.vista || f.spec.proporcion || [4, 3]);
      return d;
    },
    liberar: true,
    montar: function (f, listo) {
      var token = f.tokenTres = {};
      XL.three().then(function (m) {
        if (f.tokenTres !== token) return;
        var X = f.X;
        // el canvas se cambia por uno nuevo en cada montaje: el de un renderer liberado no sirve para otro
        var cv = document.createElement('canvas');
        cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', f.spec.alt || f.spec.titulo || '');
        f.cuerpo.replaceChild(cv, f.canvas); f.canvas = cv;
        X.THREE = m.THREE; X.OrbitControls = m.OrbitControls; X.canvas = cv;
        X.renderer = new m.THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: false });
        X.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
        X.escena = null; X.camara = null; X.controles = null;
        f.sucio = true;
        X.redibujar = function () { f.sucio = true; f.app._despertar(); };
        f.llamar('montar', cv);
        if (!X.escena || !X.camara) throw new Error('La figura 3D no definió X.escena y X.camara en montar');
        if (X.controles && X.controles.addEventListener) {
          f.alMover = function () { f.sucio = true; };
          X.controles.addEventListener('change', f.alMover);
        }
        TIPOS.three.medir(f);
        f.ro = window.ResizeObserver ? new ResizeObserver(function () { if (TIPOS.three.medir(f)) f.redibujar(); }) : null;
        if (f.ro) f.ro.observe(f.cuerpo);
        listo();
      }).catch(function (e) { if (f.tokenTres === token) listo(e); });
    },
    medir: function (f) {
      var X = f.X, w = f.cuerpo.clientWidth, h = f.cuerpo.clientHeight;
      if (!w || !h || !X.renderer) return false;
      if (X._w === w && X._h === h) return false;
      X._w = w; X._h = h; X.ancho = w; X.alto = h;
      X.renderer.setSize(w, h, false);
      if (X.camara && X.camara.isPerspectiveCamera) { X.camara.aspect = w / h; X.camara.updateProjectionMatrix(); }
      f.llamar('redimensionar', w, h);
      f.sucio = true;
      return true;
    },
    despuesDePoner: function (f) { f.sucio = true; },
    cuadro: function (f) {
      var X = f.X;
      if (X.controles && X.controles.update) X.controles.update();
      if (!f.spec.bajoDemanda || f.sucio) { X.renderer.render(X.escena, X.camara); f.sucio = false; }
    },
    desmontar: function (f) {
      var X = f.X;
      f.tokenTres = null;
      if (f.ro) f.ro.disconnect(); f.ro = null;
      if (X.controles) { if (f.alMover) X.controles.removeEventListener('change', f.alMover); if (X.controles.dispose) X.controles.dispose(); }
      liberarTres(X.escena);
      if (X.renderer) { X.renderer.dispose(); if (X.renderer.forceContextLoss) X.renderer.forceContextLoss(); }
      X.renderer = X.escena = X.camara = X.controles = null; X._w = X._h = 0;
    }
  };
  XL.tipos = TIPOS;

  function Fig(spec, ranura, app) {
    this.spec = spec; this.ranura = ranura; this.app = app;
    this.tipo = TIPOS[spec.tipo || 'svg'];
    if (!this.tipo) throw new Error('Tipo de figura desconocido: ' + spec.tipo);
    this.estado = 'vacia'; this.activa = false;
    var self = this;
    // el contexto que recibe cada función de la figura
    this.X = { app: app, spec: spec, figura: this, reducido: XL.reducido, R: function () { return app.R(); }, estado: function () { return app.estado(); },
      rotulos: function (lista) { self.rot = lista || null; self.rotular(); } };
    this.cuerpo = this.tipo.crear(this);
    ranura.el.appendChild(this.cuerpo);
  }
  Fig.prototype.llamar = function (fn) {
    var f = this.spec[fn];
    if (typeof f !== 'function') return undefined;
    var args = Array.prototype.slice.call(arguments, 1); args.push(this.X);
    return f.apply(this.spec, args);
  };
  Fig.prototype.montar = function () {
    if (this.estado !== 'vacia') return;
    var self = this, token = this.token = {};
    this.estado = 'cargando';
    this.cuerpo.classList.add('xl-cargando');
    var listo = function (err) {
      if (self.token !== token) return;
      self.cuerpo.classList.remove('xl-cargando');
      if (err) { self.estado = 'error'; self.error(err); return; }
      self.estado = 'lista';
      self.app._figLista(self);
    };
    try { this.tipo.montar(this, listo); } catch (e) { listo(e); }
  };
  Fig.prototype.error = function (e) {
    if (window.console) console.error(e);
    var m = div('xl-error', this.cuerpo);
    m.textContent = this.spec.tipo === 'three' ? 'No se pudo cargar la figura en 3D. Ábrala desde el sitio del curso, no como archivo local.' : 'No se pudo cargar la figura. Ábrala desde el sitio del curso, no como archivo local.';
  };
  Fig.prototype.poner = function (r, modo) {
    if (this.estado !== 'lista') return;
    if (this.tipo.antesDePoner && !this.tipo.antesDePoner(this, r)) return;
    this.llamar('poner', r, modo);
    if (this.tipo.despuesDePoner) this.tipo.despuesDePoner(this);
  };
  Fig.prototype.redibujar = function () { if (this.estado === 'lista') this.poner(this.app.R(), 'fijo'); this.rotular(); };
  Fig.prototype.cuadro = function (dt) {
    if (this.estado !== 'lista') return;
    this.llamar('cuadro', dt, this.app.R());
    if (this.tipo.cuadro) this.tipo.cuadro(this, dt);
  };
  Fig.prototype.activar = function (on) {
    if (on === this.activa) return;
    this.activa = on;
    if (this.estado === 'lista') this.llamar(on ? 'reanudar' : 'pausar');
  };
  Fig.prototype.desmontar = function () {
    if (this.estado === 'vacia') return;
    this.activar(false);
    if (this.estado === 'lista') this.llamar('desmontar');
    this.token = null;
    if (this.tipo.desmontar) this.tipo.desmontar(this);
    var e = this.cuerpo.querySelector('.xl-error'); if (e) e.remove();
    this.cuerpo.classList.remove('xl-cargando');
    this.estado = 'vacia';
  };
  Fig.prototype.recargar = function () { var activa = this.activa; this.desmontar(); this.montar(); if (activa) this.app._actividad(); };
  Fig.prototype.liberable = function () { return this.spec.liberar != null ? !!this.spec.liberar : !!this.tipo.liberar; };
  // Los rótulos de una isométrica: [{ x, y, lado: 'i' | 'd' | 'b', lineas: ['nombre', 'lectura'] }] en unidades del
  // viewBox de la figura completa; siguen al acercamiento y al tamaño. La última línea va en negrita.
  Fig.prototype.rotular = function () {
    var capa = this.capaRot, svg = this.X.svg;
    if (!capa || !svg) return;
    if (!this.rot || !this.rot.length) { capa.innerHTML = ''; return; }
    var vb = (svg.getAttribute('viewBox') || '').split(/[\s,]+/).map(Number), w = this.slot.clientWidth, h = this.slot.clientHeight;
    if (!w || !h || !vb[2]) return;
    var k = Math.min(w / vb[2], h / vb[3]), ox = (w - vb[2] * k) / 2, oy = (h - vb[3] * k) / 2;
    capa.innerHTML = this.rot.map(function (q) {
      var x = ox + (q.x - vb[0]) * k, y = oy + (q.y - vb[1]) * k;
      if (x < -4 || x > w + 4 || y < -4 || y > h + 4) return '';
      var ls = q.lineas || [q.texto];
      return '<div class="xl-rot ' + (q.lado || 'i') + '" style="left:' + x.toFixed(1) + 'px;top:' + y.toFixed(1) + 'px">' +
        ls.map(function (l, i) { return i === ls.length - 1 && ls.length > 1 ? '<b>' + l + '</b>' : l; }).join('<br>') + '</div>';
    }).join('');
    // un rótulo que se saldría del recuadro pasa al otro lado de su punto
    var caja = capa.getBoundingClientRect();
    Array.prototype.forEach.call(capa.children, function (d) {
      var b = d.getBoundingClientRect();
      if (d.classList.contains('i') && b.right > caja.right - 2) { d.classList.remove('i'); d.classList.add('d'); }
      else if (d.classList.contains('d') && b.left < caja.left + 2) { d.classList.remove('d'); d.classList.add('i'); }
    });
  };

  // Una ranura: el recuadro de una figura en la escena, con su cabecera. Si declara vistas (por ejemplo, la máquina
  // en isométrico y el corte en canvas), cada vista es una figura y la cabecera lleva los botones para escoger.
  function Ranura(spec, i, escena, app) {
    var self = this;
    this.spec = spec; this.escena = escena; this.app = app; this.visible = true;
    var f = this.el = document.createElement('figure');
    f.className = 'xl-fig' + (spec.ancha ? ' ancha' : '') + (i === 0 ? ' primera' : '');
    if (spec.peso) f.style.flexGrow = spec.peso;
    f.hidden = true;
    var cab = div('xl-fig-cab', f), tit = document.createElement('span');
    tit.textContent = spec.titulo || ''; cab.appendChild(tit);
    var vistas = spec.vistas || [spec];
    this.vista = 0;
    if (spec.vistas) {
      var seg = div('xl-fig-vistas', cab);
      seg.setAttribute('role', 'group'); seg.setAttribute('aria-label', 'Vista de la figura');
      seg.innerHTML = vistas.map(function (v, j) { return '<button type="button" data-vista="' + j + '" aria-pressed="' + (j === 0) + '">' + v.etiqueta + '</button>'; }).join('');
      seg.addEventListener('click', function (ev) { var b = ev.target.closest('[data-vista]'); if (b) self.escoger(+b.dataset.vista); });
      this.seg = seg;
    }
    this.btnRep = document.createElement('button');
    this.btnRep.type = 'button'; this.btnRep.className = 'xl-mini xl-repetir';
    this.btnRep.addEventListener('click', function () { var g = self.actual(); if (g.estado === 'lista') g.llamar('repetir', app.R()); });
    cab.appendChild(this.btnRep);
    // cada vista hereda de la ranura lo que no declara (el título, el texto alternativo)
    this.figs = vistas.map(function (v) {
      var s = v;
      if (spec.vistas) { s = Object.create(v); ['titulo', 'alt'].forEach(function (k) { if (v[k] == null && spec[k] != null) s[k] = spec[k]; }); }
      return new Fig(s, self, app);
    });
    this.pintarCab();
  }
  Ranura.prototype.actual = function () { return this.figs[this.vista]; };
  Ranura.prototype.pintarCab = function () {
    var g = this.actual(), rep = typeof g.spec.repetir === 'function' && g.spec.repetirTexto;
    this.btnRep.hidden = !rep;
    if (rep) this.btnRep.innerHTML = ico('rot') + rep;
    // con el atributo: un <svg> no tiene la propiedad hidden de los elementos HTML
    this.figs.forEach(function (x, j) { x.cuerpo.toggleAttribute('hidden', j !== this.vista); }, this);
    if (this.seg) this.seg.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', +b.dataset.vista === this.vista ? 'true' : 'false'); }, this);
  };
  Ranura.prototype.escoger = function (j) {
    if (j === this.vista) return;
    var vieja = this.actual();
    vieja.activar(false);
    if (vieja.liberable()) vieja.desmontar();
    this.vista = j;
    this.pintarCab();
    var g = this.actual();
    if (g.estado === 'vacia') g.montar();
    else if (g.estado === 'lista') g.poner(this.app.R(), 'entrar');
    this.app._actividad();
  };

  /* ================= El explorador ================= */
  XL.explorador = function (def) {
    if (XL._app) throw new Error('La página ya tiene un explorador');
    var M = def.modelo, CASO = M.caso, calcular = M.calcular;
    var CTRL = def.controles || {};
    var LIB = def.libro || {};
    if (LIB.base) XL.LIBRO = LIB.base;
    XL._id = def.id || 'explorador';
    limpiarViejo(def.limpiar ? [].concat(def.limpiar) : []);
    var CONFIGS = def.configuraciones && def.configuraciones.length ? def.configuraciones : [{ id: 'caso', ceja: 'El caso del libro', titulo: 'El caso del libro', cambios: {} }];
    var PARTES = def.partes || [{ titulo: '', escenas: def.escenas || [] }];
    var ESCENAS = [];
    PARTES.forEach(function (p) { if (!p.pronto) p.escenas.forEach(function (e) { e._parte = p; ESCENAS.push(e); }); });
    var T = Object.assign({
      capa: 'Cada escena, paso por paso, con los números que usted tiene en pantalla. Si mueve un dato aquí, las cuentas cambian con él, y el explorador queda igual al cerrar.',
      configuraciones: 'Al cargar una, el sistema vuelve al caso del libro con los cambios de la tarjeta. Los resultados de cada tarjeta salen del mismo modelo.',
      datos: 'Mueva uno y mire cómo cambian las cuentas.'
    }, def.textos || {});

    var api = {};   // la interfaz pública; se llena al final
    var estado = Object.assign({}, CASO);
    var R = calcular(estado);
    var cfgActiva = CONFIGS[0].id;
    var escena = 0;
    var $ = function (id) { return document.getElementById(id); };
    function igual(a, b) { return typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) < 1e-9 : a === b; }

    /* ---------- El esqueleto de la página ---------- */
    var nombre = esc(def.nombre || 'Explorador');
    sprite = el('svg', { width: 0, height: 0, style: 'position:absolute', 'aria-hidden': 'true', focusable: 'false' });
    pintarSprite();
    var raiz = document.createElement('div');
    raiz.innerHTML =
      '<div class="xl" id="app">' +
        '<header class="xl-barra">' +
          '<div class="xl-marca"><span class="xl-cap" aria-hidden="true">' + esc(def.capitulo || '') + '</span><span><b>' + nombre + '</b><small>' + esc(def.curso || 'POU · 2027-10') + '</small></span></div>' +
          '<div class="xl-caso" aria-live="polite"><span class="k">Caso</span><span class="v" id="casoNom"></span><span class="m" id="casoMod" hidden>con cambios</span>' +
            '<button type="button" id="casoReset" hidden>' + ico('rot') + 'Volver al caso</button></div>' +
          '<div class="xl-acc">' +
            '<button type="button" class="xl-b xl-b--linea" id="btnCfg" aria-label="Configuraciones">' + ico('cuadros') + '<span>Configuraciones</span></button>' +
            '<button type="button" class="xl-b xl-b--amarillo" id="btnCalc">' + ico('sigma') + '¿Cómo se calcula?</button>' +
          '</div>' +
        '</header>' +
        '<nav class="xl-riel" id="riel" aria-label="Escenas"></nav>' +
        '<main class="xl-escena" id="escena">' +
          '<div class="xl-cab"><p class="xl-ceja" id="ceja"></p><h1 id="titulo"></h1><p class="xl-preg" id="pregunta"></p></div>' +
          '<div class="xl-kpis" id="kpis" aria-live="polite"></div>' +
          '<div class="xl-figs" id="figs"></div>' +
          '<div class="xl-ver" id="veredicto" aria-live="polite"><span class="ic" id="verIc"></span><p id="verTx"></p>' +
            '<button type="button" class="xl-b xl-b--navy xl-sig" id="btnSig"></button></div>' +
        '</main>' +
        '<aside class="xl-panel" id="panel" aria-label="Predicción y controles">' +
          '<section class="xl-pred" id="pred" aria-live="polite"></section>' +
          '<section class="xl-ctl" id="ctl" aria-label="Controles"></section>' +
        '</aside>' +
      '</div>' +
      '<div class="xl-movil">' +
        '<button type="button" class="xl-b xl-b--blanco" id="btnHoja">' + ico('ajustes') + 'Controles</button>' +
        '<button type="button" class="xl-b xl-b--amarillo" id="btnCalcM">' + ico('sigma') + '¿Cómo se calcula?</button>' +
      '</div>' +
      '<div class="xl-capa" id="capa" role="dialog" aria-modal="true" aria-labelledby="capaT" hidden>' +
        '<div class="xl-capa-cab"><div><p class="xl-ceja">' + nombre + ' · El modelo</p><h2 id="capaT">¿Cómo se calcula?</h2><p class="xl-capa-ent">' + T.capa + '</p></div>' +
          '<button type="button" class="xl-cerrar" id="capaX">' + ico('x') + '<span>Cerrar</span></button></div>' +
        '<div class="xl-capa-cuerpo"><div class="xl-capa-lado"><nav class="xl-capa-riel" id="capaRiel" aria-label="Escenas del cálculo"></nav>' +
          '<div class="xl-datos" id="capaDatos" role="group" aria-labelledby="capaDatosT"></div></div>' +
          '<div class="xl-capa-doc" id="capaDoc"><article class="xl-doc" id="doc"></article></div></div>' +
      '</div>' +
      '<div class="xl-velo" id="velo" hidden><div class="xl-modal" role="dialog" aria-modal="true" aria-labelledby="cfgT">' +
        '<div class="xl-modal-cab"><div><p class="xl-ceja">' + nombre + '</p><h2 id="cfgT">Configuraciones</h2><p>' + T.configuraciones + '</p></div>' +
          '<button type="button" class="xl-cerrar" id="cfgX">' + ico('x') + '<span>Cerrar</span></button></div>' +
        '<div class="xl-cfgs" id="cfgs"></div></div></div>';
    var antesDe = document.body.firstChild;
    document.body.insertBefore(sprite, antesDe);
    while (raiz.firstChild) document.body.insertBefore(raiz.firstChild, antesDe);

    /* ---------- El riel ---------- */
    function riel(cont, enCapa) {
      var h = '', n = 0, idx = 0;
      PARTES.forEach(function (p) {
        if (p.pronto) {
          if (enCapa) { n += p.escenas.length; return; }
          h += '<div class="xl-parte xl-pronto"><span class="xl-parte-t">' + p.titulo + '<small>' + p.pronto + '</small></span>';
          p.escenas.forEach(function (t) { n++; h += '<span class="xl-sn" aria-disabled="true"><span class="n">' + n + '</span><span>' + (typeof t === 'string' ? t : t.titulo) + '</span></span>'; });
          h += '</div>';
          return;
        }
        h += '<div class="xl-parte">' + (p.titulo ? '<span class="xl-parte-t">' + p.titulo + '</span>' : '');
        p.escenas.forEach(function (e) {
          n++;
          h += '<button type="button" class="xl-sn" data-escena="' + idx + '"><span class="n">' + n + '</span><span><span class="largo">' + e.titulo + '</span><span class="corto">' + (e.corto || e.titulo) + '</span></span></button>';
          idx++;
        });
        h += '</div>';
      });
      if (!enCapa && (LIB.pie || LIB.capitulo || LIB.enlaces)) {
        var ens = LIB.enlaces || (LIB.capitulo ? [[LIB.capitulo, 'Abrir el capítulo']] : []);
        h += '<p class="xl-riel-pie">' + (LIB.pie || '') + ' ' + ens.map(function (l) { return '<a href="' + (/^https?:/.test(l[0]) ? l[0] : XL.LIBRO + l[0]) + '" target="_blank" rel="noopener">' + l[1] + '</a>'; }).join(' · ') + '</p>';
      }
      cont.innerHTML = h;
      cont.addEventListener('click', function (ev) {
        var b = ev.target.closest('button[data-escena]');
        if (b) { if (enCapa) irCapa(+b.dataset.escena); else ir(+b.dataset.escena); }
      });
    }

    /* ---------- Los controles: cada uno cambia solo su clave ---------- */
    function valorDe(c, x) { return x !== null && typeof x === 'object' ? x.valor : x; }
    function textoDe(c, x) { return x !== null && typeof x === 'object' ? (x.texto != null ? x.texto : String(x.valor)) : String(x); }
    function lim(c, k) { return typeof c[k] === 'function' ? c[k](estado) : c[k]; }
    function fmtCtrl(k, v) {
      var c = CTRL[k];
      if (c.formato) return c.formato(v);
      if (c.tipo === 'opciones') { var o = (c.opciones || []).filter(function (x) { return igual(valorDe(c, x), v); })[0]; return o != null ? textoDe(c, o) : String(v); }
      if (c.tipo === 'contador') return num(v, c.decimales || 0) + (c.unidad ? NB + c.unidad : '');
      return c.unidad ? un(v, c.decimales, c.unidad) : num(v, c.decimales);
    }
    var vivos = [];
    function control(k, cont, compacto) {
      var c = CTRL[k];
      if (!c) throw new Error('No hay control declarado para la clave ' + k);
      var nodo = document.createElement('div'), id = 'c-' + k + (compacto ? '-d' : '');
      nodo.className = 'xl-c';
      var nota = '<p class="xl-c-nota"><span>' + (c.nota || '') + '</span><button type="button" class="xl-caso-b" data-caso>caso: ' + fmtCtrl(k, CASO[k]) + '</button></p>';
      if (c.tipo === 'opciones') {
        nodo.innerHTML = '<div class="xl-c-cab"><span class="lb" id="' + id + '">' + c.etiqueta + '</span></div><div class="xl-seg" role="group" aria-labelledby="' + id + '">' +
          c.opciones.map(function (o, i) { return '<button type="button" data-i="' + i + '" data-v="' + esc(String(valorDe(c, o))) + '">' + textoDe(c, o) + '</button>'; }).join('') + '</div>' + nota;
        nodo.querySelector('.xl-seg').addEventListener('click', function (ev) { var b = ev.target.closest('button'); if (b) cambiar(k, valorDe(c, c.opciones[+b.dataset.i])); });
      } else if (c.tipo === 'contador') {
        var men = c.menos || 'Uno menos', mas = c.mas || 'Uno más';
        nodo.innerHTML = '<div class="xl-c-cab"><span class="lb" id="' + id + '">' + c.etiqueta + '</span><output></output></div><div class="xl-cont" role="group" aria-labelledby="' + id + '">' +
          '<button type="button" data-d="-1" aria-label="' + men + '">' + ico('menos') + '</button><span aria-live="polite"></span><button type="button" data-d="1" aria-label="' + mas + '">' + ico('mas') + '</button></div>' + nota;
        nodo.querySelector('.xl-cont').addEventListener('click', function (ev) {
          var b = ev.target.closest('button'); if (!b) return;
          cambiar(k, entre(estado[k] + (+b.dataset.d) * (c.paso || 1), lim(c, 'min'), lim(c, 'max')));
        });
      } else {
        nodo.innerHTML = '<div class="xl-c-cab"><label for="' + id + '">' + c.etiqueta + '</label><output for="' + id + '"></output></div>' +
          '<input class="xl-r" type="range" id="' + id + '" step="' + c.paso + '">' + nota;
        var inp = nodo.querySelector('input');
        inp.addEventListener('input', function () { cambiar(k, +inp.value); });
      }
      nodo.querySelector('[data-caso]').addEventListener('click', function () { cambiar(k, CASO[k]); });
      cont.appendChild(nodo);
      var v = {
        cont: cont,
        refrescar: function () {
          var val = estado[k], cb = nodo.querySelector('[data-caso]');
          cb.disabled = igual(val, CASO[k]);
          if (c.tipo === 'opciones') nodo.querySelectorAll('.xl-seg button').forEach(function (b) { b.setAttribute('aria-pressed', igual(valorDe(c, c.opciones[+b.dataset.i]), val) ? 'true' : 'false'); });
          else if (c.tipo === 'contador') {
            nodo.querySelector('output').textContent = c.salida ? c.salida(val) : '';
            nodo.querySelector('.xl-cont span').textContent = num(val, c.decimales || 0);
            nodo.querySelector('[data-d="-1"]').disabled = val <= lim(c, 'min'); nodo.querySelector('[data-d="1"]').disabled = val >= lim(c, 'max');
          } else {
            var inp = nodo.querySelector('input'), mn = lim(c, 'min'), mx = lim(c, 'max');
            if (+inp.min !== mn) inp.min = mn;
            if (+inp.max !== mx) inp.max = mx;
            if (document.activeElement !== inp || Math.abs(+inp.value - val) > c.paso / 2) inp.value = val;
            inp.style.setProperty('--p', (100 * (entre(val, mn, mx) - mn) / ((mx - mn) || 1)) + '%');
            nodo.querySelector('output').textContent = fmtCtrl(k, val);
            inp.setAttribute('aria-valuetext', fmtCtrl(k, val));
          }
        }
      };
      vivos.push(v);
      v.refrescar();
      return v;
    }
    function limpiarVivos(cont) { vivos = vivos.filter(function (v) { return v.cont !== cont && !cont.contains(v.cont); }); }

    function armarPanel() {
      var e = ESCENAS[escena], ctl = $('ctl');
      limpiarVivos(ctl);
      ctl.innerHTML = '<div class="xl-hoja-t"><b>Controles · ' + e.titulo + '</b><button type="button" class="xl-cerrar" id="hojaX" aria-label="Cerrar los controles">' + ico('x') + '</button></div><p class="xl-ctl-t">Controles</p>';
      var caja = document.createElement('div'); ctl.appendChild(caja);
      (e.controles || []).forEach(function (k) { control(k, caja); });
      if (e.info) { var inf = document.createElement('p'); inf.className = 'xl-info'; inf.id = 'info'; ctl.appendChild(inf); }
      if (e.mas && e.mas.length) {
        var det = document.createElement('details'); det.className = 'xl-mas';
        det.innerHTML = '<summary>Más ajustes' + ico('abajo') + '</summary>';
        var caja2 = document.createElement('div'); det.appendChild(caja2);
        e.mas.forEach(function (k) { control(k, caja2); });
        ctl.appendChild(det);
      }
      $('hojaX').addEventListener('click', function () { hoja(false); });
    }
    function indice(x) { if (/^\d+$/.test(String(x))) return +x; return ESCENAS.map(function (e) { return e.id; }).indexOf(String(x)); }
    function infoIr(ev) { var b = ev.target.closest('[data-ir]'); if (b) { var i = indice(b.dataset.ir); if (i >= 0) { hoja(false); ir(i); } } }

    /* ---------- La pregunta para predecir: sin puntaje y sin guardar ---------- */
    var preds = ESCENAS.map(function () { return { elegida: null, revelada: false }; });
    function armarPred() {
      var e = ESCENAS[escena], P = e.prediccion, st = preds[escena], box = $('pred');
      box.hidden = !P;
      if (!P) { box.innerHTML = ''; return; }
      var rb = calcular(Object.assign({}, estado, P.base));
      var rn = calcular(Object.assign({}, estado, P.llevar));
      var ok = P.correcta(rn, rb);
      var h = '<p class="k">' + ico('ayuda') + 'Prediga antes de mover</p><p class="q">' + P.pregunta(rb) + '</p><ul>';
      P.opciones.forEach(function (o, i) {
        var cls = 'xl-op' + (st.elegida === i ? ' elegida' : '') + (st.revelada && i === ok ? ' correcta' : '');
        h += '<li><button type="button" class="' + cls + '" data-op="' + i + '"' + (st.elegida !== null ? ' disabled' : '') + '><span class="l">' + 'ABCD'[i] + '</span><span>' + o + '</span></button></li>';
      });
      h += '</ul>';
      if (st.elegida !== null && !st.revelada) h += '<p class="paso">' + P.instruccion + '</p><div class="fila"><button type="button" class="xl-b xl-b--navy" data-llevar>' + ico('der') + 'Llevarlo ahí</button></div>';
      if (st.revelada) {
        var acerto = st.elegida === ok;
        h += '<div class="res"><b>' + ico(acerto ? 'ok' : 'info') + (acerto ? 'Acertó.' : 'La respuesta es la ' + 'ABCD'[ok] + '.') + '</b>' + P.explica(rn, rb) + '</div><button type="button" class="otra" data-otra>Volver a intentarlo</button>';
      }
      box.innerHTML = h;
    }

    /* ---------- Las figuras de cada escena ---------- */
    ESCENAS.forEach(function (e) {
      e._ranuras = (e.figuras || []).map(function (spec, j) { var r = new Ranura(spec, j, e, api); $('figs').appendChild(r.el); return r; });
    });
    function figurasDe(i) { return ESCENAS[i]._ranuras.map(function (r) { return r.actual(); }); }
    var enMontaje = false;
    function entrarFiguras(i) {
      ESCENAS.forEach(function (e, j) {
        e._ranuras.forEach(function (r) {
          r.el.hidden = j !== i;
          if (j !== i) r.figs.forEach(function (f) { f.activar(false); if (f.liberable()) f.desmontar(); });
        });
      });
      var fs = figurasDe(i);
      enMontaje = true;
      fs.forEach(function (f) { f.montar(); });
      enMontaje = false;
      fs.forEach(function (f) { f.poner(R, 'entrar'); });
      actividad();
    }
    // la isométrica o la 3D terminó de cargar: se pone con el estado de ese momento
    function figLista(f) {
      if (enMontaje) return;
      if (f.ranura.escena === ESCENAS[escena] && f.ranura.actual() === f) f.poner(R, 'entrar');
      actividad();
    }

    /* ---------- Un solo reloj, solo para las figuras a la vista ---------- */
    var corre = false, antes = 0;
    // activa cada figura que está a la vista y pausa las demás; devuelve las que piden cuadros
    function activas() {
      var base = !document.hidden && $('capa').hidden, out = [];
      ESCENAS.forEach(function (e, i) {
        e._ranuras.forEach(function (r) {
          r.figs.forEach(function (f) {
            var on = base && i === escena && r.actual() === f && f.estado === 'lista' && r.visible;
            f.activar(on);
            if (on && (f.spec.cuadro || f.tipo.cuadro)) out.push(f);
          });
        });
      });
      return out;
    }
    function actividad() { if (activas().length) despertar(); }
    function despertar() { if (!corre) { corre = true; antes = 0; requestAnimationFrame(bucle); } }
    function bucle(t) {
      var fs = activas();
      if (!fs.length) { corre = false; return; }
      var dt = antes ? Math.min(0.05, (t - antes) / 1000) : 0;
      antes = t;
      fs.forEach(function (f) { f.cuadro(dt); });
      requestAnimationFrame(bucle);
    }
    // en el celular, una figura que salió de la pantalla se pausa
    var io = window.IntersectionObserver ? new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (x.target._ranura) x.target._ranura.visible = x.isIntersecting; });
      actividad();
    }) : null;
    ESCENAS.forEach(function (e) { e._ranuras.forEach(function (r) { r.el._ranura = r; if (io) io.observe(r.el); }); });
    document.addEventListener('visibilitychange', actividad);
    window.addEventListener('pagehide', function (ev) { if (ev.persisted) return; ESCENAS.forEach(function (e) { e._ranuras.forEach(function (r) { r.figs.forEach(function (f) { f.desmontar(); }); }); }); });

    /* ---------- La escena en pantalla ---------- */
    function pintarKpis() {
      var e = ESCENAS[escena], ks = e.kpis ? e.kpis(R) : [];
      $('kpis').hidden = !ks.length;
      $('kpis').style.setProperty('--n', ks.length || 3);
      $('kpis').innerHTML = ks.map(function (q) {
        return '<div class="xl-kpi' + (q.alerta ? ' alerta' : '') + '"><span class="k">' + q.etiqueta + '</span><span class="v">' + q.valor + (q.unidad ? ' <small>' + q.unidad + '</small>' : '') + '</span>' + (q.nota ? '<span class="s">' + q.nota + '</span>' : '') + '</div>';
      }).join('');
      var v = e.veredicto ? e.veredicto(R) : { alerta: false, html: '' }, box = $('veredicto');
      box.classList.toggle('alerta', !!v.alerta);
      $('verIc').innerHTML = ico(v.alerta ? 'alerta' : 'ok');
      $('verTx').innerHTML = v.html;
      if (e.info && $('info')) $('info').innerHTML = e.info(R);
    }
    function casoActual() {
      var cfg = CONFIGS.filter(function (c) { return c.id === cfgActiva; })[0] || CONFIGS[0];
      var ref = Object.assign({}, CASO, cfg.cambios), mod = Object.keys(ref).some(function (k) { return !igual(estado[k], ref[k]); });
      $('casoNom').textContent = cfg.titulo;
      $('casoMod').hidden = !mod;
      $('casoReset').hidden = !mod && cfgActiva === CONFIGS[0].id;
    }
    function ir(i) {
      if (i < 0 || i >= ESCENAS.length) return;
      escena = i;
      var e = ESCENAS[i];
      document.querySelectorAll('#riel .xl-sn[data-escena]').forEach(function (b) { var on = +b.dataset.escena === i; b.classList.toggle('is-active', on); if (on) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
      $('ceja').textContent = 'Escena ' + (i + 1) + ' de ' + ESCENAS.length + (e._parte.titulo ? ' · ' + e._parte.titulo : '');
      $('titulo').textContent = e.titulo;
      $('pregunta').textContent = e.pregunta || '';
      var sig = $('btnSig');
      if (i < ESCENAS.length - 1) { sig.innerHTML = '<span>Siguiente: ' + ESCENAS[i + 1].titulo + '</span>' + ico('der'); sig.onclick = function () { ir(i + 1); }; }
      else { sig.innerHTML = ico('sigma') + '<span>¿Cómo se calcula?</span>'; sig.onclick = function () { abrirCapa(); }; }
      armarPanel(); armarPred(); pintarKpis();
      entrarFiguras(i);
      try { history.replaceState(null, '', '#' + e.id); } catch (err) { /* sin historial */ }
    }
    function cambiar(k, v) {
      if (igual(estado[k], v)) return;
      estado[k] = v;
      if (M.ajustar) M.ajustar(estado, k);
      recalcular('cambio');
    }
    function ponerVarios(cambios) {
      var hay = false;
      for (var k in cambios) if (!igual(estado[k], cambios[k])) { estado[k] = cambios[k]; hay = true; if (M.ajustar) M.ajustar(estado, k); }
      if (hay) recalcular('cambio');
    }
    function recalcular(modo) {
      R = calcular(estado);
      vivos.forEach(function (v) { v.refrescar(); });
      var st = preds[escena], P = ESCENAS[escena].prediccion;
      if (P && st.elegida !== null && !st.revelada && P.cumple(estado)) st.revelada = true;
      armarPred(); pintarKpis(); casoActual();
      figurasDe(escena).forEach(function (f) { f.poner(R, modo); });
      if (!$('capa').hidden) pintarDoc();
      if (def.alCambiar) def.alCambiar(R, estado);
    }

    $('pred').addEventListener('click', function (ev) {
      var P = ESCENAS[escena].prediccion, st = preds[escena], b;
      if (!P) return;
      if ((b = ev.target.closest('[data-op]')) && st.elegida === null) { st.elegida = +b.dataset.op; if (P.cumple(estado)) st.revelada = true; armarPred(); var f = $('pred').querySelector('[data-llevar], .otra'); if (f) f.focus(); return; }
      if (ev.target.closest('[data-llevar]')) { ponerVarios(P.llevar); return; }
      if (ev.target.closest('[data-otra]')) { st.elegida = null; st.revelada = false; armarPred(); var p = $('pred').querySelector('[data-op]'); if (p) p.focus(); }
    });

    /* ---------- «¿Cómo se calcula?» ---------- */
    var escCapa = 0, vistos = ESCENAS.map(function () { return 1; }), ultimoFoco = null;
    function abrirCapa() {
      ultimoFoco = document.activeElement;
      hoja(false);
      $('capa').hidden = false; document.body.style.overflow = 'hidden';
      actividad();
      irCapa(escena);
      $('capaX').focus();
    }
    function cerrarCapa() {
      $('capa').hidden = true; document.body.style.overflow = '';
      limpiarVivos($('capaDatos'));
      actividad();
      if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
    }
    function irCapa(i) {
      escCapa = i;
      document.querySelectorAll('#capaRiel .xl-sn').forEach(function (b) { b.classList.toggle('is-active', +b.dataset.escena === i); });
      var e = ESCENAS[i], doc = $('doc');
      limpiarVivos(doc);
      doc.innerHTML = '<p class="xl-ceja">Escena ' + (i + 1) + (e._parte.titulo ? ' · ' + e._parte.titulo : '') + '</p><h3>' + e.titulo + '</h3><p class="xl-preg">' + (e.pregunta || '') + '</p><div id="docCuerpo"></div>';
      var dd = $('capaDatos');
      limpiarVivos(dd);
      var datos = e.datos || [];
      dd.hidden = !datos.length;
      dd.innerHTML = '<span class="t" id="capaDatosT">Sus datos</span><p class="d">' + T.datos + '</p>';
      datos.forEach(function (k) { control(k, dd, true); });
      pintarDoc();
      $('capaDoc').scrollTop = 0;
    }
    function pintarDoc() {
      var e = ESCENAS[escCapa], cuerpo = $('docCuerpo');
      if (!cuerpo || !e.calculo) { if (cuerpo) cuerpo.innerHTML = ''; return; }
      var c = e.calculo(R), n = vistos[escCapa];
      var h = '<p class="xl-intro">' + c.intro + '</p><ol class="xl-pasos">';
      c.pasos.forEach(function (p, j) {
        if (j >= n) return;
        h += '<li class="xl-paso" id="paso-' + j + '"><span class="pn">' + (j + 1) + '</span><h4>' + p.titulo + '</h4>' + (p.texto ? '<p>' + p.texto + '</p>' : '');
        if (p.ec) h += '<div class="xl-ec">' + K(partir(p.ec)) + '</div>';
        if (p.num || p.res) {
          h += '<div class="xl-num"><span class="k">Con sus números</span>';
          if (p.num) { var nt = partir(p.num); h += K(nt.indexOf('\\\\') >= 0 && nt.indexOf('gathered') < 0 ? '\\begin{gathered}' + nt + '\\end{gathered}' : nt); }
          if (p.res) h += '<p>' + p.res + '</p>';
          h += '</div>';
        }
        if (p.fuente || p.libro) h += '<p class="xl-fuente">' + (p.fuente ? p.fuente + ' ' : '') + (p.libro ? enlace(p.libro[0], p.libro[1]) : '') + '</p>';
        h += '</li>';
      });
      h += '</ol>';
      if (n < c.pasos.length) h += '<div class="xl-avance"><button type="button" class="xl-b xl-b--navy" data-paso>' + ico('der') + 'Siguiente paso</button><span>Paso ' + n + ' de ' + c.pasos.length + '</span><button type="button" class="xl-caso-b" data-todos>Ver todos los pasos</button></div>';
      else if (c.libro && c.libro.length) h += '<div class="xl-libro"><h4>En el libro</h4><ul>' + c.libro.map(function (l) { return '<li>' + enlace(l[0], l[1]) + '</li>'; }).join('') + '</ul></div>';
      var sc = $('capaDoc').scrollTop;
      cuerpo.innerHTML = h;
      $('capaDoc').scrollTop = sc;
    }
    $('doc').addEventListener('click', function (ev) {
      var e = ESCENAS[escCapa]; if (!e.calculo) return;
      var c = e.calculo(R).pasos.length;
      if (ev.target.closest('[data-paso]')) {
        vistos[escCapa] = Math.min(c, vistos[escCapa] + 1); pintarDoc();
        var nuevo = $('paso-' + (vistos[escCapa] - 1)); if (nuevo) nuevo.scrollIntoView({ behavior: mq.matches ? 'auto' : 'smooth', block: 'start' });
        var b = $('doc').querySelector('[data-paso]'); if (b) b.focus({ preventScroll: true });
      } else if (ev.target.closest('[data-todos]')) { vistos[escCapa] = c; pintarDoc(); }
    });

    /* ---------- Configuraciones ---------- */
    function abrirCfg() {
      ultimoFoco = document.activeElement;
      hoja(false);
      $('cfgs').innerHTML = CONFIGS.map(function (c) {
        var r = calcular(Object.assign({}, CASO, c.cambios)), alerta = c.alerta ? c.alerta(r) : false, activa = c.id === cfgActiva;
        return '<div class="xl-cfg' + (activa ? ' activa' : '') + '"><span class="e">' + c.ceja + (activa ? ' · en pantalla' : '') + '</span><h3>' + c.titulo + '</h3><p>' + c.fija + '</p>' +
          (c.resultado ? '<p class="r' + (alerta ? ' alerta' : '') + '">' + c.resultado(r) + '</p>' : '') +
          '<button type="button" class="xl-b xl-b--navy" data-cfg="' + c.id + '">Cargar</button></div>';
      }).join('');
      $('velo').hidden = false; document.body.style.overflow = 'hidden';
      $('cfgX').focus();
    }
    function cerrarCfg() { $('velo').hidden = true; document.body.style.overflow = ''; if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus(); }
    function cargarCfg(id) {
      var c = CONFIGS.filter(function (x) { return x.id === id; })[0];
      if (!c) return;
      cfgActiva = id;
      estado = Object.assign({}, CASO, c.cambios);
      recalcular('entrar');
    }
    $('cfgs').addEventListener('click', function (ev) { var b = ev.target.closest('[data-cfg]'); if (b) { cargarCfg(b.dataset.cfg); cerrarCfg(); } });
    $('velo').addEventListener('click', function (ev) { if (ev.target === $('velo')) cerrarCfg(); });

    /* ---------- La hoja de controles del celular ---------- */
    function hoja(abrir) {
      document.body.classList.toggle('hoja-abierta', !!abrir);
      if (abrir) {
        // la figura, con su cabecera, queda a la vista sobre la hoja
        var r0 = ESCENAS[escena]._ranuras[0], barra = document.querySelector('.xl-barra');
        if (r0) window.scrollTo({ top: Math.max(0, r0.el.getBoundingClientRect().top + window.scrollY - barra.offsetHeight), behavior: mq.matches ? 'auto' : 'smooth' });
        var f = $('ctl').querySelector('input, button:not(#hojaX)'); if (f) f.focus({ preventScroll: true });
      }
    }

    /* ---------- Teclado y foco en las capas ---------- */
    function atrapar(cont, ev) {
      var f = Array.prototype.filter.call(cont.querySelectorAll('button, [href], input, summary, [tabindex]:not([tabindex="-1"])'), function (x) { return !x.disabled && x.offsetParent !== null; });
      if (!f.length) return;
      var a = f[0], z = f[f.length - 1];
      if (ev.shiftKey && document.activeElement === a) { ev.preventDefault(); z.focus(); }
      else if (!ev.shiftKey && document.activeElement === z) { ev.preventDefault(); a.focus(); }
    }
    document.addEventListener('keydown', function (ev) {
      var capa = !$('capa').hidden, velo = !$('velo').hidden;
      if (ev.key === 'Escape') { if (velo) cerrarCfg(); else if (capa) cerrarCapa(); else hoja(false); return; }
      if (ev.key === 'Tab') { if (velo) atrapar($('velo'), ev); else if (capa) atrapar($('capa'), ev); return; }
      if (capa || velo || ev.altKey || ev.ctrlKey || ev.metaKey) return;
      var tag = (ev.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      var n = parseInt(ev.key, 10);
      if (n >= 1 && n <= Math.min(9, ESCENAS.length)) ir(n - 1);
    });

    /* ---------- La interfaz pública ---------- */
    Object.assign(api, {
      estado: function () { return Object.assign({}, estado); },
      R: function () { return R; },
      escena: function () { return escena; },
      escenas: ESCENAS,
      ir: ir, cambiar: cambiar, ponerVarios: ponerVarios,
      abrirCapa: abrirCapa, cerrarCapa: cerrarCapa, abrirCfg: abrirCfg, cerrarCfg: cerrarCfg, cargarCfg: cargarCfg,
      // la figura n de una escena (por id o por número), para las pruebas: { estado, activa, X }
      figura: function (e, n) { var i = indice(e), r = i >= 0 && ESCENAS[i]._ranuras[n || 0]; if (!r) return null; var f = r.actual(); return { estado: f.estado, activa: f.activa, X: f.X }; },
      _figLista: figLista, _actividad: actividad, _despertar: despertar
    });
    XL._app = api;
    window.Explorador = api;

    /* ---------- Arranque ---------- */
    riel($('riel'), false);
    riel($('capaRiel'), true);
    $('btnCfg').addEventListener('click', abrirCfg);
    $('cfgX').addEventListener('click', cerrarCfg);
    $('btnCalc').addEventListener('click', abrirCapa);
    $('btnCalcM').addEventListener('click', abrirCapa);
    $('capaX').addEventListener('click', cerrarCapa);
    $('btnHoja').addEventListener('click', function () { hoja(true); });
    $('ctl').addEventListener('click', infoIr);
    $('casoReset').addEventListener('click', function () { cargarCfg(CONFIGS[0].id); });
    var inicio = ESCENAS.map(function (e) { return e.id; }).indexOf((location.hash || '').slice(1));
    ir(inicio >= 0 ? inicio : 0);
    casoActual();
    var anchoAntes = window.innerWidth;
    window.addEventListener('resize', function () {
      var w = window.innerWidth;
      if ((w < 700) !== (anchoAntes < 700) && !$('capa').hidden) pintarDoc();
      anchoAntes = w;
      figurasDe(escena).forEach(function (f) { f.rotular(); });
    });
    return api;
  };
})();
