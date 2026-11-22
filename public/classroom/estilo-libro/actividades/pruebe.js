/* Piezas comunes de los recuadros «Pruebe» que se arman sobre un diagrama.
   Un recuadro así tiene un dibujo en SVG del equipo o de la sección, y cada control vive al lado de
   lo que cambia: el caudal junto a su corriente, la temperatura junto a su termómetro. En pantalla
   ancha los controles van en dos rieles, a la izquierda y a la derecha del dibujo, a la altura de su
   corriente; en el teléfono bajan debajo del dibujo, en orden, con la misma etiqueta que llevan en él.
   Pasar el puntero o el dedo por un control resalta su parte del dibujo, y al revés.
   Se carga antes del interactivos.js del capítulo. Sin dependencias. */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var P = {};

  P.num = function (v, d) {
    if (!isFinite(v)) return '—';
    var s = Math.abs(v).toFixed(d), p = s.split('.'), e = p[0];
    if (e.length > 4) e = e.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (v < 0 ? '−' : '') + e + (p[1] ? ',' + p[1] : '');
  };
  P.h = function (tag, attrs, padre, html) {
    var e = document.createElement(tag);
    for (var k in attrs || {}) { if (k === 'class') e.className = attrs[k]; else e.setAttribute(k, attrs[k]); }
    if (html != null) e.innerHTML = html;
    if (padre) padre.appendChild(e);
    return e;
  };
  P.s = function (tag, attrs, padre, texto) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (texto != null) e.textContent = texto;
    if (padre) padre.appendChild(e);
    return e;
  };
  // texto de SVG con subíndices escritos como c_p: el _ baja la letra siguiente
  P.st = function (padre, x, y, t, cls, anc) {
    var e = P.s('text', { x: x, y: y, class: cls || '', 'text-anchor': anc || 'start' }, padre);
    P.ponerTexto(e, t);
    return e;
  };
  P.ponerTexto = function (e, t) {
    while (e.firstChild) e.removeChild(e.firstChild);
    String(t).split(/(_\w)/).forEach(function (parte) {
      if (!parte) return;
      if (parte[0] === '_') { P.s('tspan', { class: 'sb', dy: 4 }, e, parte[1]); P.s('tspan', { dy: -4 }, e, '​'); }
      else P.s('tspan', {}, e, parte);
    });
  };
  P.reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // El lienzo: dibujo al centro y dos rieles de controles. vb = [ancho, alto] del viewBox.
  P.lienzo = function (raiz, vb, opciones) {
    opciones = opciones || {};
    var marco = P.h('div', { class: 'lienzo' }, raiz);
    var izq = P.h('div', { class: 'riel riel-izq' }, marco);
    var centro = P.h('div', { class: 'lienzo-dibujo' }, marco);
    var der = P.h('div', { class: 'riel riel-der' }, marco);
    var svg = P.s('svg', { viewBox: '0 0 ' + vb[0] + ' ' + vb[1], role: 'img', 'aria-label': opciones.aria || '' }, centro);
    var abajo = P.h('div', { class: 'lienzo-abajo' }, raiz);
    var chips = [];
    function chip(lado, o) {
      var c = P.h('div', { class: 'chip', 'data-parte': o.parte || '' }, lado === 'der' ? der : izq);
      if (o.color) c.style.borderLeftColor = o.color;
      var cab = P.h('div', { class: 'chip-cab' }, c);
      if (o.tag) P.h('span', { class: 'chip-tag' }, cab, o.tag);
      P.h('span', { class: 'chip-tit' }, cab, o.titulo || '');
      chips.push({ el: c, y: o.y, lado: lado });
      if (o.parte) {
        c.addEventListener('pointerenter', function () { resaltar(o.parte, true); });
        c.addEventListener('pointerleave', function () { resaltar(o.parte, false); });
        c.addEventListener('focusin', function () { resaltar(o.parte, true); });
        c.addEventListener('focusout', function () { resaltar(o.parte, false); });
      }
      return c;
    }
    function resaltar(parte, si) {
      svg.classList.toggle('hay-resalte', si);
      svg.querySelectorAll('[data-parte="' + parte + '"]').forEach(function (e) { e.classList.toggle('resalta', si); });
      marco.querySelectorAll('.chip[data-parte="' + parte + '"]').forEach(function (e) { e.classList.toggle('resalta', si); });
    }
    // lo que se dibuja con data-parte también resalta su control
    svg.addEventListener('pointerover', function (ev) { var t = ev.target.closest('[data-parte]'); if (t) resaltar(t.getAttribute('data-parte'), true); });
    svg.addEventListener('pointerout', function (ev) { var t = ev.target.closest('[data-parte]'); if (t) resaltar(t.getAttribute('data-parte'), false); });
    // cada chip a la altura de su parte del dibujo, sin encimarse
    function alinear() {
      var ancho = marco.getBoundingClientRect().width;
      var compacto = ancho < (opciones.umbral || 760);
      marco.classList.toggle('compacto', compacto);
      // Con los controles abajo, el dibujo ocupa todo el ancho y su escala cambia con la pantalla: la letra
      // se ajusta para medir unos 14 px en pantalla (más de 17 en el dibujo en un teléfono, menos en un
      // computador, donde el dibujo se estira), sin pasar de 22 px del dibujo para no encimar los rótulos.
      var escala = svg.getBoundingClientRect().width / vb[0];
      if (escala > 0) svg.style.setProperty('--letra-k', Math.max(0.6, Math.min(22 / 17, 14 / (17 * escala))).toFixed(3));
      if (compacto) { chips.forEach(function (c) { c.el.style.top = ''; }); izq.style.height = der.style.height = ''; return; }
      var esc = svg.getBoundingClientRect().height / vb[1];
      ['izq', 'der'].forEach(function (lado) {
        var fin = 0, riel = lado === 'der' ? der : izq, lista = chips.filter(function (c) { return c.lado === lado; });
        lista.forEach(function (c) {
          var alto = c.el.offsetHeight, top = Math.max(fin, c.y * esc - alto / 2);
          c.el.style.top = top + 'px'; fin = top + alto + 10;
        });
        riel.style.height = Math.max(fin, svg.getBoundingClientRect().height) + 'px';
      });
    }
    var ultimo = 0;
    new ResizeObserver(function () { var w = Math.round(marco.getBoundingClientRect().width); if (Math.abs(w - ultimo) > 2) { ultimo = w; alinear(); } }).observe(marco);
    return { svg: svg, chip: chip, abajo: abajo, alinear: alinear, marco: marco };
  };

  // Un deslizador dentro de un chip
  var cont = 0;
  P.deslizador = function (padre, est, clave, nombre, min, max, paso, fmt, fn) {
    var w = P.h('div', { class: 'ctl' }, padre), id = 'pru-' + (++cont);
    var lab = P.h('label', { for: id }, w); P.h('span', {}, lab, nombre); var out = P.h('b', {}, lab);
    var inp = P.h('input', { type: 'range', id: id, min: min, max: max, step: paso, value: est[clave] }, w);
    function mostrar() { out.innerHTML = fmt(est[clave]); inp.value = est[clave]; }
    inp.addEventListener('input', function () { est[clave] = parseFloat(inp.value); mostrar(); fn(); });
    mostrar();
    return { mostrar: mostrar, caja: w, inp: inp };
  };
  P.botones = function (padre, rotulo, opciones, fn) {
    var w = P.h('div', { class: 'botones', role: 'group', 'aria-label': rotulo.replace(/<[^>]+>/g, '') }, padre), bs = [];
    if (rotulo) P.h('span', {}, w, rotulo);
    opciones.forEach(function (op) {
      var b = P.h('button', { type: 'button', class: 'op', 'aria-pressed': 'false' }, w, op.t);
      b.addEventListener('click', function () { fn(op.v); marcar(op.v); });
      bs.push([op.v, b]);
    });
    function marcar(v) { bs.forEach(function (x) { x[1].setAttribute('aria-pressed', String(x[0] === v)); }); }
    return marcar;
  };
  // Un paso a paso compacto: «± 0,5 % [−][+]», para la incertidumbre de un instrumento
  P.pasos = function (padre, est, clave, paso, min, max, fmt, fn, rotulo) {
    var w = P.h('span', { class: 'pasos' }, padre);
    if (rotulo) P.h('span', { class: 'pasos-rot' }, w, rotulo);
    var menos = P.h('button', { type: 'button', 'aria-label': 'Menos' }, w, '−');
    var v = P.h('b', { 'aria-live': 'polite' }, w);
    var mas = P.h('button', { type: 'button', 'aria-label': 'Más' }, w, '+');
    function mostrar() { v.innerHTML = fmt(est[clave]); }
    function cambiar(d) { est[clave] = Math.round(Math.min(max, Math.max(min, est[clave] + d)) / paso) * paso; mostrar(); fn(); }
    menos.addEventListener('click', function () { cambiar(-paso); });
    mas.addEventListener('click', function () { cambiar(paso); });
    mostrar();
    return w;
  };
  // Una fila con el paso a paso a la izquierda y la barrita de lo que pesa a la derecha
  P.fila = function (padre) { return P.h('div', { class: 'chip-fila' }, padre); };
  // Una barrita de «cuánto pesa» dentro de un chip (0 a 1)
  P.peso = function (padre, color) {
    var w = P.h('div', { class: 'chip-peso' }, padre), pista = P.h('span', { class: 'pista' }, w);
    var barra = P.h('i', {}, pista), t = P.h('b', {}, w);
    if (color) barra.style.background = color;
    return function (f, texto) { barra.style.width = (100 * Math.max(0, Math.min(1, f))).toFixed(1) + '%'; t.textContent = texto; };
  };

  window.Pruebe = P;
})();
