/* Las actividades de un capítulo del libro, al estilo de un libro de actividades: animaciones por pasos,
   preguntas de participación con la explicación de cada respuesta y retos con números que cambian. Cada
   actividad va en el capítulo como un bloque HTML (<div class="act" data-tipo="anim|preguntas|reto" …>);
   este script las numera por sección (11.2.1, 11.2.2…, aparte las de participación y las de reto), guarda el
   avance en el navegador y pone bajo el título de cada sección su avance. Las animaciones y los retos de un
   capítulo los registra su script (figuras/{capitulo}/actividades.js) con ZB.animacion(id, def) y ZB.reto(id, def).

   Animación: def = { vista: [x, y, ancho, alto], alt, montar(svg, d) → s, pasos: [{ texto, dur, ir(s, t, d) }] }.
   montar dibuja el estado inicial y devuelve los elementos que se mueven; ir(s, t) deja el paso en su fracción t
   (0 a 1, ya suavizada) y no depende del cuadro anterior: así se puede volver a cualquier paso. La animación se
   detiene al final de cada paso; el botón sigue. Se da por vista cuando llega al último paso.

   Reto: def = { niveles: [function (r) → { enunciado, campos: [{ et, u, v, dec, tol }], solucion }] }.
   r da números al azar (r.entre(a, b, dec), r.de(lista)). La respuesta vale si cae dentro de tol (relativa,
   por defecto 1 %) o del redondeo de dec decimales. */
(function () {
  'use strict';
  var ZB = window.ZB = window.ZB || {};
  var NS = 'http://www.w3.org/2000/svg';
  var quieto = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Utilidades ---------- */
  // Coma decimal y miles con espacio fino desde cinco cifras, como en el libro (1750, 14 264).
  ZB.num = function (x, d) {
    if (x == null || isNaN(x)) return '–';
    d = d == null ? 1 : d;
    var neg = x < 0, s = Math.abs(x).toFixed(d), p = s.split('.');
    if (p[0].length >= 5) p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (neg && Number(s) !== 0 ? '−' : '') + p[0] + (p[1] ? ',' + p[1] : '');
  };
  ZB.el = function (tag, a, padre, html) {
    var e = document.createElement(tag);
    for (var k in a || {}) { if (k === 'class') e.className = a[k]; else e.setAttribute(k, a[k]); }
    if (html != null) e.innerHTML = html;
    if (padre) padre.appendChild(e);
    return e;
  };
  ZB.s = function (tag, a, padre, texto) {
    var e = document.createElementNS(NS, tag);
    for (var k in a || {}) e.setAttribute(k, a[k]);
    if (texto != null) e.textContent = texto;
    if (padre) padre.appendChild(e);
    return e;
  };
  ZB.suave = function (t) { t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); };
  ZB.lerp = function (a, b, t) { return a + (b - a) * t; };
  // Un tramo del paso: dentro de [a, b] de t, de 0 a 1 suavizado.
  ZB.tramo = function (t, a, b) { return ZB.suave((t - a) / (b - a)); };

  // Matemáticas: $…$ en línea y $$…$$ aparte, con coma decimal, igual que lo que prepara armar.mjs.
  function aTex(m) {
    m = m.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    return m.replace(/(\d),(\d)/g, '$1{,}$2').replace(/ /g, '\\,').replace(/−/g, '-');
  }
  ZB.tex = function (str) {
    if (!window.katex) return str;
    return String(str).replace(/\$\$([\s\S]+?)\$\$/g, function (_, m) {
      return katex.renderToString(aTex(m), { displayMode: true, throwOnError: false });
    }).replace(/\$([^$]+?)\$/g, function (_, m) {
      return katex.renderToString(aTex(m), { throwOnError: false });
    });
  };

  // Números al azar con semilla, para que un nivel se pueda repetir igual si hace falta.
  function azar(semilla) {
    var a = semilla >>> 0;
    var f = function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    return {
      u: f,
      entre: function (lo, hi, dec) { var p = Math.pow(10, dec == null ? 1 : dec); return Math.round((lo + (hi - lo) * f()) * p) / p; },
      de: function (lista) { return lista[Math.floor(f() * lista.length)]; }
    };
  }

  /* ---------- Progreso ---------- */
  var CLAVE = 'libro-actividades:' + location.pathname.split('/').pop().replace(/\.html$/, '');
  var estado = {};
  try { estado = JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch (e) { estado = {}; }
  function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) { /* sin almacenamiento */ } }
  function marcas(id, n) {
    var m = estado[id];
    if (!m || m.length !== n) { m = []; for (var i = 0; i < n; i++) m.push(0); estado[id] = m; }
    return m;
  }

  var ACTS = [];      // { id, sec, tipo, n, el, pintar }
  function registrarAct(a) { ACTS.push(a); }
  function hecho(a, i) {
    var m = marcas(a.id, a.n);
    if (m[i]) return;
    m[i] = 1; guardar(); a.pintar(); avance();
  }

  /* ---------- Cabecera de una actividad ---------- */
  function cabecera(el, tipo, numero, titulo, n) {
    var cab = ZB.el('div', { class: 'act-cab' });
    ZB.el('div', { class: 'act-tipo' }, cab, tipo);
    var t = ZB.el('div', { class: 'act-titulo' }, cab);
    ZB.el('span', { class: 'n' }, t, numero);
    ZB.el('span', {}, t, ZB.tex(titulo || ''));
    var mm = ZB.el('div', { class: 'marcas', role: 'img' }, cab);
    var is = [];
    for (var i = 0; i < n; i++) is.push(ZB.el('i', {}, mm));
    el.insertBefore(cab, el.firstChild);
    return function (m) {
      var k = 0;
      is.forEach(function (x, j) { x.classList.toggle('si', !!m[j]); if (m[j]) k++; });
      mm.setAttribute('aria-label', k + ' de ' + n + ' completadas');
      el.classList.toggle('hecha', k === n);
    };
  }
  function cuerpo(el) {
    var c = ZB.el('div', { class: 'act-cuerpo' });
    while (el.firstChild) c.appendChild(el.firstChild);
    el.appendChild(c);
    return c;
  }

  /* ---------- Íconos ---------- */
  var IC = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>',
    otra: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>'
  };

  /* ---------- Animación ---------- */
  ZB.anims = {};
  ZB.animacion = function (id, def) { ZB.anims[id] = def; };

  function montarAnim(el, a) {
    var def = ZB.anims[a.clave];
    var c = a.c;
    if (!def) { ZB.el('p', {}, c, 'Falta la animación «' + a.clave + '».'); a.pintar = function () {}; return; }
    var n = def.pasos.length;
    var lienzo = ZB.el('div', { class: 'anim-lienzo' }, c);
    var vb = def.vista || [0, 0, 640, 320];
    var rollo = ZB.el('div', { class: 'rollo' }, lienzo);
    var svg = ZB.s('svg', { viewBox: vb.join(' '), role: 'img', 'aria-label': def.alt || '' }, rollo);
    var emp = ZB.el('button', { class: 'anim-empezar', type: 'button' }, lienzo, '<span>Empezar</span>');
    var mandos = ZB.el('div', { class: 'anim-mandos' }, c);
    var play = ZB.el('button', { class: 'anim-play', type: 'button', 'aria-label': 'Empezar' }, mandos, IC.play);
    var ol = ZB.el('ol', { class: 'anim-pasos', 'aria-label': 'Pasos' }, mandos);
    var bps = def.pasos.map(function (p, i) {
      var li = ZB.el('li', {}, ol);
      var b = ZB.el('button', { type: 'button', 'aria-label': 'Paso ' + (i + 1) }, li, String(i + 1));
      b.addEventListener('click', function () { if (i <= visto) correr(i); });
      return b;
    });
    var vel = ZB.el('label', { class: 'anim-vel' }, mandos);
    var chk = ZB.el('input', { type: 'checkbox', id: a.id + '-2x' }, vel);
    ZB.el('span', {}, vel, 'Velocidad 2×');
    var txt = ZB.el('p', { class: 'anim-texto vacio', 'aria-live': 'polite' }, c, '<span>Pulse <b>Empezar</b>. La animación se detiene al final de cada paso, y el botón de la flecha sigue con el siguiente.</span>');
    var det = ZB.el('details', { class: 'anim-frases' }, c);
    ZB.el('summary', {}, det, 'Todas las frases de la animación');
    var lista = ZB.el('ol', {}, det);
    def.pasos.forEach(function (p) { ZB.el('li', {}, lista, ZB.tex(p.texto)); });

    var s = null, actual = -1, visto = -1, raf = 0, corriendo = false;
    function rehacer(hasta) {           // el dibujo inicial y los pasos anteriores ya terminados
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      s = def.montar(svg, def) || {};
      for (var j = 0; j < hasta; j++) def.pasos[j].ir(s, 1, 1);
    }
    function marcar() {
      bps.forEach(function (b, i) {
        b.classList.toggle('actual', i === actual);
        b.classList.toggle('visto', i <= visto);
        b.disabled = i > visto;
      });
      var fin = actual === n - 1 && !corriendo;
      play.innerHTML = fin ? IC.otra : IC.play;
      play.setAttribute('aria-label', actual < 0 ? 'Empezar' : fin ? 'Repetir desde el principio' : 'Siguiente paso');
      play.disabled = corriendo;
      play.classList.toggle('llama', !corriendo && actual >= 0 && actual < n - 1);
    }
    function frase(i) {
      txt.classList.remove('vacio');
      txt.innerHTML = '<span class="k">' + (i + 1) + '</span><span>' + ZB.tex(def.pasos[i].texto) + '</span>';
    }
    function correr(i) {
      cancelAnimationFrame(raf);
      emp.hidden = true;
      rehacer(i);
      actual = i; corriendo = true; frase(i); marcar();
      var p = def.pasos[i];
      var dur = quieto ? 0 : (p.dur || 2) * 1000 / (chk.checked ? 2 : 1);
      var t0 = null;
      function cuadro(ts) {
        if (t0 == null) t0 = ts;
        var raw = dur ? Math.min(1, (ts - t0) / dur) : 1;
        p.ir(s, ZB.suave(raw), raw);
        if (raw < 1) raf = requestAnimationFrame(cuadro);
        else {
          corriendo = false;
          if (i > visto) visto = i;
          marcar();
          if (i === n - 1) hecho(a, 0);
        }
      }
      raf = requestAnimationFrame(cuadro);
    }
    emp.addEventListener('click', function () { correr(0); });
    play.addEventListener('click', function () {
      if (corriendo) return;
      if (actual < 0 || actual === n - 1) correr(0); else correr(actual + 1);
    });
    rehacer(0);
    // Quieto, el dibujo muestra el primer cuadro; con «reducir movimiento» cada paso salta a su final.
    marcar();
    a.pintar = function () { a.cab(marcas(a.id, 1)); };
  }

  /* ---------- Preguntas ---------- */
  function norm(t) { return String(t).trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').replace(/^(el|la|los|las|un|una) /, ''); }
  function aNumero(t) {
    t = String(t).trim().replace(/\s| /g, '').replace('−', '-');
    if (/^-?\d+,\d+$/.test(t)) t = t.replace(',', '.');
    if (!/^-?(\d+\.?\d*|\.\d+)(e-?\d+)?$/i.test(t)) return NaN;
    return parseFloat(t);
  }
  function cerca(x, v, tol, dec) {
    var lim = Math.max(Math.abs(v) * (tol == null ? 0.01 : tol), dec == null ? 0 : 0.5 * Math.pow(10, -dec) + 1e-9);
    return Math.abs(x - v) <= lim;
  }

  function montarPreguntas(el, a) {
    var c = a.c;
    c.innerHTML = ZB.tex(c.innerHTML);   // las fórmulas $…$ del enunciado, las opciones y las explicaciones
    var qs = Array.prototype.slice.call(c.querySelectorAll(':scope > .q'));
    a.n = qs.length;
    qs.forEach(function (q, i) {
      // La cabecera con su letra
      var enun = q.querySelector('.q-enunciado');
      var cab = ZB.el('div', { class: 'q-cab' });
      ZB.el('span', { class: 'k' }, cab, String.fromCharCode(97 + i) + ')');
      q.insertBefore(cab, q.firstChild);
      if (enun) cab.appendChild(enun);
      if (q.classList.contains('corta')) preguntaCorta(q, a, i);
      else if (q.classList.contains('emparejar')) preguntaEmparejar(q, a, i);
      else preguntaOpcion(q, a, i);
    });
    a.pintar = function () { a.cab(marcas(a.id, a.n)); };
  }

  // Las opciones se escriben con la correcta donde caiga; aquí se revuelven, siempre igual para la misma
  // pregunta (la semilla sale de su texto), para que la correcta no quede de primera por costumbre.
  function semillaDe(t) { var h = 2166136261; for (var k = 0; k < t.length; k++) { h ^= t.charCodeAt(k); h = Math.imul(h, 16777619); } return h >>> 0; }
  function preguntaOpcion(q, a, i) {
    var ul = q.querySelector('.q-op');
    var ops = Array.prototype.slice.call(q.querySelectorAll('.q-op > li'));
    var r = azar(semillaDe(q.textContent));
    for (var k = ops.length - 1; k > 0; k--) { var j = Math.floor(r.u() * (k + 1)); var t = ops[k]; ops[k] = ops[j]; ops[j] = t; }
    ops.forEach(function (li) { ul.appendChild(li); });
    var fb = ZB.el('div', { class: 'fb', 'aria-live': 'polite' }, q);
    ops.forEach(function (li) {
      var src = li.querySelector('.fb-src');
      var b = ZB.el('button', { type: 'button' });
      var span = ZB.el('span', {}, b);
      while (li.firstChild && li.firstChild !== src) span.appendChild(li.firstChild);
      li.insertBefore(b, li.firstChild);
      b.addEventListener('click', function () {
        var ok = li.hasAttribute('data-ok');
        ops.forEach(function (o) { var bb = o.querySelector('button'); bb.classList.remove('bien', 'mal'); bb.setAttribute('aria-pressed', 'false'); });
        b.classList.add(ok ? 'bien' : 'mal'); b.setAttribute('aria-pressed', 'true');
        fb.className = 'fb ver ' + (ok ? 'bien' : 'mal');
        fb.innerHTML = '<span class="veredicto">' + (ok ? 'Correcto.' : 'No.') + '</span>' + (src ? src.innerHTML : '');
        if (ok) hecho(a, i);
      });
    });
  }

  function preguntaCorta(q, a, i) {
    var resp = q.getAttribute('data-respuesta');
    var esNum = !isNaN(aNumero(resp.split('|')[0]));
    var tol = q.hasAttribute('data-tol') ? parseFloat(q.getAttribute('data-tol')) : 0.01;
    var dec = q.hasAttribute('data-dec') ? parseInt(q.getAttribute('data-dec'), 10) : null;
    var unidad = q.getAttribute('data-unidad');
    var exp = q.querySelector('.fb-src');
    var fila = ZB.el('div', { class: 'corta-fila' }, q);
    var campo = ZB.el('span', { class: 'campo' }, fila);
    var inp = ZB.el('input', { type: 'text', inputmode: esNum ? 'decimal' : 'text', id: a.id + '-q' + i, autocomplete: 'off', 'aria-label': 'Respuesta' }, campo);
    if (!esNum) inp.classList.add('texto');
    if (unidad) ZB.el('span', { class: 'u' }, campo, unidad);
    var rev = ZB.el('button', { type: 'button', class: 'boton' }, fila, 'Revisar');
    var ver = ZB.el('button', { type: 'button', class: 'boton sec' }, fila, 'Mostrar la respuesta');
    var fb = ZB.el('div', { class: 'fb', 'aria-live': 'polite' }, q);
    var veces = 0;
    var correcta = esNum ? ZB.num(aNumero(resp.split('|')[0]), dec == null ? 1 : dec) + (unidad ? ' ' + unidad : '') : resp.split('|')[0];
    function revisar() {
      var v = inp.value, ok;
      if (!v.trim()) return;
      if (esNum) { var x = aNumero(v); ok = !isNaN(x) && cerca(x, aNumero(resp.split('|')[0]), tol, dec); }
      else ok = resp.split('|').some(function (r) { return norm(r) === norm(v); });
      campo.className = 'campo ' + (ok ? 'bien' : 'mal');
      fb.className = 'fb ver ' + (ok ? 'bien' : 'mal');
      fb.innerHTML = ok ? '<span class="veredicto">Correcto.</span>' + (exp ? exp.innerHTML : '')
        : '<span class="veredicto">Todavía no.</span>' + (esNum && isNaN(aNumero(v)) ? 'Escriba solo el número, con coma o punto decimal.' : 'Revise el planteamiento e intente de nuevo, o pida la respuesta.');
      if (ok) hecho(a, i);
    }
    rev.addEventListener('click', revisar);
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') revisar(); });
    ver.addEventListener('click', function () {
      veces++;
      if (veces === 1) { ver.textContent = 'Pulse otra vez para verla'; return; }
      fb.className = 'fb ver bien';
      fb.innerHTML = '<span class="veredicto">Respuesta: ' + correcta + '.</span>' + (exp ? exp.innerHTML : '');
      ver.textContent = 'Mostrar la respuesta'; veces = 0;
      hecho(a, i);
    });
  }

  function preguntaEmparejar(q, a, i) {
    var dl = q.querySelector('dl');
    var pares = [];
    var dts = dl.querySelectorAll('dt');
    Array.prototype.forEach.call(dts, function (dt) { pares.push({ t: dt.innerHTML, d: dt.nextElementSibling.innerHTML }); });
    dl.parentNode.removeChild(dl);
    var opciones = pares.map(function (p) { return p.d; });
    // un orden fijo pero revuelto, el mismo cada vez que se abre la página
    var r = azar(pares.length * 7919 + i), orden = opciones.map(function (_, k) { return k; });
    for (var k = orden.length - 1; k > 0; k--) { var j = Math.floor(r.u() * (k + 1)); var t = orden[k]; orden[k] = orden[j]; orden[j] = t; }
    var sels = pares.map(function (p, k) {
      var fila = ZB.el('div', { class: 'emp-fila' }, q);
      ZB.el('span', { class: 'term' }, fila, p.t);
      var sel = ZB.el('select', { id: a.id + '-q' + i + '-' + k, 'aria-label': 'Pareja de ' + p.t.replace(/<[^>]+>/g, '') }, fila);
      ZB.el('option', { value: '' }, sel, 'Escoja…');
      orden.forEach(function (o) { var op = ZB.el('option', { value: String(o) }, sel); op.textContent = opciones[o].replace(/<[^>]+>/g, ''); });
      var marca = ZB.el('span', { class: 'ok', 'aria-hidden': 'true' }, fila);
      return { sel: sel, k: k, marca: marca };
    });
    var fila = ZB.el('div', { class: 'corta-fila' }, q);
    var rev = ZB.el('button', { type: 'button', class: 'boton' }, fila, 'Revisar');
    var fb = ZB.el('div', { class: 'fb', 'aria-live': 'polite' }, q);
    rev.addEventListener('click', function () {
      var bien = 0, vacias = 0;
      sels.forEach(function (x) {
        if (x.sel.value === '') { vacias++; x.sel.className = ''; x.marca.textContent = ''; return; }
        var ok = x.sel.value === String(x.k);
        if (ok) bien++;
        x.sel.className = ok ? 'bien' : 'mal';
        x.marca.textContent = ok ? '✓' : '';
      });
      var todo = bien === sels.length;
      fb.className = 'fb ver ' + (todo ? 'bien' : 'mal');
      fb.innerHTML = todo ? '<span class="veredicto">Correcto.</span>Todas las parejas están bien.'
        : '<span class="veredicto">' + bien + ' de ' + sels.length + '.</span>' + (vacias ? 'Faltan ' + vacias + ' por escoger. ' : '') + 'Cambie las que están en rojo.';
      if (todo) hecho(a, i);
    });
  }

  /* ---------- Reto ---------- */
  ZB.retos = {};
  ZB.reto = function (id, def) { ZB.retos[id] = def; };

  function montarReto(el, a) {
    var def = ZB.retos[a.clave];
    var c = a.c;
    if (!def) { ZB.el('p', {}, c, 'Falta el reto «' + a.clave + '».'); a.pintar = function () {}; return; }
    var n = def.niveles.length;
    var niv = ZB.el('div', { class: 'reto-niveles' }, c);
    ZB.el('span', { class: 'rot' }, niv, 'Nivel');
    var bns = def.niveles.map(function (_, i) {
      var b = ZB.el('button', { type: 'button', 'aria-label': 'Nivel ' + (i + 1) }, niv, String(i + 1));
      b.addEventListener('click', function () { if (!b.disabled) nivel(i); });
      return b;
    });
    var enun = ZB.el('div', { class: 'reto-enunciado' }, c);
    var campos = ZB.el('div', { class: 'reto-campos' }, c);
    var bots = ZB.el('div', { class: 'reto-botones' }, c);
    var rev = ZB.el('button', { type: 'button', class: 'boton' }, bots, 'Revisar');
    var otra = ZB.el('button', { type: 'button', class: 'boton sec' }, bots, IC.otra + 'Otros números');
    var sig = ZB.el('button', { type: 'button', class: 'boton' }, bots, 'Siguiente nivel');
    var fb = ZB.el('div', { class: 'reto-fb', 'aria-live': 'polite' }, c);
    var actual = 0, prob = null, ins = [], cerrado = false;

    function pintarNiveles() {
      var m = marcas(a.id, n);
      bns.forEach(function (b, i) {
        b.classList.toggle('hecho', !!m[i]);
        b.classList.toggle('actual', i === actual);
        b.disabled = i > 0 && !m[i - 1] && !m[i];
      });
    }
    function nivel(i, mismo) {
      actual = i; cerrado = false;
      var semilla = mismo != null ? mismo : Math.floor(Math.random() * 1e9);
      prob = def.niveles[i](azar(semilla));
      el.__prob = prob;
      enun.innerHTML = ZB.tex(prob.enunciado);
      campos.innerHTML = ''; ins = [];
      prob.campos.forEach(function (f, k) {
        var fila = ZB.el('div', { class: 'reto-campo' }, campos);
        ZB.el('label', { class: 'et', for: a.id + '-c' + k }, fila, ZB.tex(f.et));
        var campo = ZB.el('span', { class: 'campo' }, fila);
        var inp = ZB.el('input', { type: 'text', inputmode: 'decimal', id: a.id + '-c' + k, autocomplete: 'off' }, campo);
        if (f.u) ZB.el('span', { class: 'u' }, campo, f.u);
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') revisar(); });
        ins.push({ inp: inp, campo: campo, f: f });
      });
      fb.innerHTML = '';
      rev.hidden = false; rev.disabled = false; otra.hidden = true; sig.hidden = true;
      pintarNiveles();
    }
    function revisar() {
      if (cerrado) return;
      var vacio = ins.some(function (x) { return !x.inp.value.trim(); });
      if (vacio) { fb.innerHTML = '<div class="caja mal"><span class="veredicto">Falta una respuesta.</span> Llene todos los campos.</div>'; return; }
      var todos = true, filas = '';
      ins.forEach(function (x) {
        var v = aNumero(x.inp.value), ok = !isNaN(v) && cerca(v, x.f.v, x.f.tol, x.f.dec);
        if (!ok) todos = false;
        x.campo.className = 'campo ' + (ok ? 'bien' : 'mal');
        x.inp.readOnly = true;
        filas += '<tr><td>' + ZB.tex(x.f.et) + '</td><td>' + (isNaN(v) ? '–' : ZB.num(v, Math.max(x.f.dec == null ? 2 : x.f.dec, 0))) + '</td><td>' + ZB.num(x.f.v, x.f.dec == null ? 2 : x.f.dec) + (x.f.u ? ' ' + x.f.u : '') + '</td><td>' + (ok ? '✓' : '✗') + '</td></tr>';
      });
      cerrado = true;
      var tabla = '<table class="comp"><tr><th></th><th>Su respuesta</th><th>La esperada</th><th></th></tr>' + filas + '</table>';
      var sol = '<div class="sol">' + ZB.tex(prob.solucion) + '</div>';
      if (todos) {
        fb.innerHTML = '<div class="caja bien"><span class="veredicto">Correcto.</span>' + tabla + sol + '</div>';
        hecho(a, actual);
        rev.hidden = true;
        otra.hidden = false;
        sig.hidden = actual >= n - 1;
      } else {
        fb.innerHTML = '<div class="caja mal"><span class="veredicto">No todavía.</span> Compare con la solución y pruebe otra vez con números nuevos.' + tabla + sol + '</div>';
        rev.hidden = true; otra.hidden = false; sig.hidden = true;
      }
      pintarNiveles();
    }
    rev.addEventListener('click', revisar);
    otra.addEventListener('click', function () { nivel(actual); });
    sig.addEventListener('click', function () { if (actual < n - 1) nivel(actual + 1); });
    var m0 = marcas(a.id, n), primero = 0;
    while (primero < n - 1 && m0[primero]) primero++;
    nivel(primero);
    a.pintar = function () { a.cab(marcas(a.id, n)); pintarNiveles(); };
  }

  /* ---------- Numeración por sección y avance ---------- */
  function seccionDe(el) {
    var s = el.closest('section.level2');
    if (!s) return null;
    var n = s.querySelector(':scope > h2 .header-section-number');
    return { el: s, id: s.id, num: n ? n.textContent.trim() : '' };
  }
  function pct(x, y) { return y ? Math.round(100 * x / y) : 0; }
  var SECS = {};
  function avance() {
    Object.keys(SECS).forEach(function (id) {
      var S = SECS[id], t = { p: 0, pd: 0, r: 0, rd: 0 };
      ACTS.forEach(function (a) {
        if (a.sec !== id) return;
        var m = marcas(a.id, a.n), k = m.reduce(function (s, x) { return s + (x ? 1 : 0); }, 0);
        if (a.tipo === 'reto') { t.r += a.n; t.rd += k; } else { t.p += a.n; t.pd += k; }
      });
      [['part', t.pd, t.p], ['reto', t.rd, t.r]].forEach(function (x) {
        var c = S.cajas[x[0]];
        c.hidden = !x[2];
        c.querySelector('i').style.width = pct(x[1], x[2]) + '%';
        c.querySelector('b').textContent = x[1] + ' de ' + x[2];
      });
    });
  }
  function resumen(sec) {
    if (SECS[sec.id]) return;
    var h2 = sec.el.querySelector(':scope > h2');
    var r = ZB.el('div', { class: 'act-resumen' });
    var cajas = {};
    [['part', 'Participación'], ['reto', 'Retos']].forEach(function (x) {
      var sp = ZB.el('span', {}, r);
      var m = ZB.el('span', { class: 'act-medidor ' + x[0], role: 'img', 'aria-label': x[1] }, sp);
      ZB.el('i', {}, m);
      ZB.el('span', {}, sp, x[1] + ': ');
      ZB.el('b', {}, sp);
      cajas[x[0]] = sp;
    });
    // va después del título y de la ceja, si la hay
    var tras = h2; while (tras.nextElementSibling && tras.nextElementSibling.classList.contains('ceja')) tras = tras.nextElementSibling;
    tras.parentNode.insertBefore(r, tras.nextSibling);
    SECS[sec.id] = { cajas: cajas };
  }

  function iniciar() {
    var k = {};
    document.querySelectorAll('.act[data-tipo]').forEach(function (x) {
      var sec = seccionDe(x) || { id: 'cap', num: '', el: null };
      var tipo = x.getAttribute('data-tipo'), esReto = tipo === 'reto';
      var c = k[sec.id] || (k[sec.id] = { p: 0, r: 0 });
      var num = (sec.num ? sec.num + '.' : '') + (esReto ? ++c.r : ++c.p);
      x.classList.toggle('reto', esReto);
      var a = { id: sec.id + '-' + tipo + '-' + (x.getAttribute('data-id') || num), clave: x.getAttribute('data-id'), sec: sec.id, tipo: tipo, n: 1, el: x, pintar: function () {} };
      if (esReto && ZB.retos[a.clave]) a.n = ZB.retos[a.clave].niveles.length;
      if (tipo === 'preguntas') a.n = x.querySelectorAll(':scope > .q').length;
      a.c = cuerpo(x);
      a.cab = cabecera(x, esReto ? 'Actividad de reto' : 'Actividad de participación', num, x.getAttribute('data-titulo'), a.n);
      registrarAct(a);
      if (sec.el) resumen(sec);
      try {
        if (tipo === 'anim') montarAnim(x, a);
        else if (tipo === 'preguntas') montarPreguntas(x, a);
        else if (esReto) montarReto(x, a);
      } catch (e) { console.error('Actividad ' + a.id + ': ' + e.message); }
      a.pintar();
    });
    avance();
  }
  ZB.iniciar = iniciar;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(iniciar, 0); });
  else setTimeout(iniciar, 0);
})();
