/* Animaciones de Manim en las presentaciones deck-stage del aula.
 *
 * Cada <video class="anim"> arranca solo cuando su diapositiva se vuelve
 * activa y se detiene en los instantes de data-pausas (el final de cada
 * sección de la escena). La flecha derecha, la barra o Av Pág siguen con
 * el paso siguiente; a mitad de un paso, lo completan de una vez. Cuando
 * el video ya terminó, la flecha pasa de diapositiva como siempre. Un clic
 * (o Enter con el video enfocado) hace lo mismo y, al final, lo repite.
 * Al volver a una diapositiva desde la siguiente, el video aparece en su
 * último cuadro, completo.
 *
 * Con movimiento reducido no arranca solo: muestra el último cuadro y un
 * clic lo reproduce. Al imprimir sale el póster (img.anim-impresion).
 *
 * Una vez por presentación, después de deck-stage.js:
 *   <script src="/classroom/animaciones.js"></script>
 * El HTML de cada video lo imprime scripts/animaciones/publicar.py; la guía
 * es ANIMACIONES.md.
 */
(function () {
  'use strict';
  var stage = document.querySelector('deck-stage');
  if (!stage) return;
  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)');

  var css = document.createElement('style');
  css.textContent =
    '.anim-caja{width:100%}' +
    'video.anim{display:block;width:100%;height:auto;cursor:pointer}' +
    'video.anim:focus{outline:none}' +
    'video.anim:focus-visible{outline:3px solid var(--acero,#5980A6);outline-offset:6px}' +
    'img.anim-impresion{display:none;width:100%;height:auto}' +
    '@media print{video.anim{display:none!important}img.anim-impresion{display:block!important}}';
  document.head.appendChild(css);

  function proximoAlto(v) {
    var altos = (v.dataset.pausas || '').split(',').map(Number);
    for (var i = 0; i < altos.length; i++) {
      if (altos[i] > v.currentTime + 0.05) return altos[i];
    }
    return Infinity;
  }

  function terminado(v) {
    return v.ended || (isFinite(v.duration) && v.currentTime >= v.duration - 0.05);
  }

  function reproducir(v) {
    var alto = proximoAlto(v);
    var promesa = v.play();
    if (promesa && promesa.catch) promesa.catch(function () {});
    if (alto === Infinity) return;
    (function vigilar() {
      if (v.paused) return;
      if (v.currentTime >= alto) { v.pause(); return; }
      requestAnimationFrame(vigilar);
    })();
  }

  function alFinal(v) {
    v.pause();
    if (isFinite(v.duration)) { v.currentTime = v.duration; return; }
    v.addEventListener('loadedmetadata', function () { v.currentTime = v.duration; }, { once: true });
  }

  function desdeCero(v) {
    v.pause();
    v.currentTime = 0;
  }

  // Un paso adelante. Devuelve false si ya no queda nada: la flecha sigue a la otra diapositiva.
  function avanzar(v) {
    if (terminado(v)) return false;
    if (!v.paused) {
      var alto = proximoAlto(v);
      v.pause();
      v.currentTime = alto === Infinity ? v.duration : alto;
      return true;
    }
    reproducir(v);
    return true;
  }

  function pulsar(v) {
    if (terminado(v)) { desdeCero(v); reproducir(v); } else avanzar(v);
  }

  function videoActivo() {
    var s = stage.querySelector('section[data-deck-active]');
    return s ? s.querySelector('video.anim') : null;
  }

  function entrar(seccion, volviendo) {
    seccion.querySelectorAll('video.anim').forEach(function (v) {
      if (volviendo || quieto.matches) { alFinal(v); return; }
      desdeCero(v);
      reproducir(v);
    });
  }

  stage.addEventListener('slidechange', function (e) {
    var d = e.detail;
    if (d.previousSlide) d.previousSlide.querySelectorAll('video.anim').forEach(function (v) { v.pause(); });
    if (d.slide) entrar(d.slide, d.previousIndex > d.index);
  });

  // deck-stage pudo anunciar la primera diapositiva antes de que cargara este archivo.
  var inicial = stage.querySelector('section[data-deck-active]');
  if (inicial) entrar(inicial, false);

  // En captura, para responder antes que deck-stage (que escucha en window, en burbuja).
  window.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(t.tagName))) return;
    var v = videoActivo();
    if (!v) return;
    var tecla = e.key;
    if (tecla === 'Enter' && t === v) {
      pulsar(v);
    } else if (tecla === 'ArrowRight' || tecla === 'PageDown' || tecla === ' ' || tecla === 'Spacebar') {
      if (!avanzar(v)) return;
    } else {
      return;
    }
    e.preventDefault();
    e.stopImmediatePropagation();
  }, true);

  stage.addEventListener('click', function (e) {
    var v = e.target.closest ? e.target.closest('video.anim') : null;
    if (!v) return;
    e.preventDefault();
    pulsar(v);
  });
})();
