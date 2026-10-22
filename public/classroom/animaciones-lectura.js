/* Animaciones de Manim en las lecturas del aula.
 *
 * Cada <video data-auto> arranca solo cuando el lector llega a él (al
 * menos el 60 % del video en pantalla) y se detiene si sale de la vista;
 * al volver sigue donde iba. Corre una vez: al terminar queda en su último
 * cuadro y los controles lo repiten. Si el lector lo detiene, ya no vuelve
 * a arrancar solo.
 *
 * No arranca solo con movimiento reducido ni con ahorro de datos: queda el
 * póster, que es la figura completa, y los controles lo reproducen.
 *
 * Una vez por lectura, antes de </body>:
 *   <script src="/classroom/animaciones-lectura.js"></script>
 * El HTML de cada video lo imprime scripts/animaciones/publicar.py; la guía
 * es ANIMACIONES.md.
 */
(function () {
  'use strict';
  var videos = document.querySelectorAll('video[data-auto]');
  if (!videos.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (navigator.connection && navigator.connection.saveData) return;

  var VISIBLE = 0.6;

  videos.forEach(function (v) {
    var nuestra = false;   // la pausa la puso este archivo, no el lector
    var soltado = false;   // el lector lo detuvo: no se vuelve a meter

    v.addEventListener('pause', function () {
      if (!nuestra && !v.ended) soltado = true;
      nuestra = false;
    });

    // Cerca de la vista empieza a cargar, para que arranque sin espera.
    var cerca = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      cerca.disconnect();
      // Si ya arrancó (se llegó de un salto), load() lo reiniciaría.
      if (v.paused && v.readyState === 0) { v.preload = 'auto'; v.load(); }
    }, { rootMargin: '600px 0px' });
    cerca.observe(v);

    new IntersectionObserver(function (es) {
      var e = es[0];
      if (e.intersectionRatio >= VISIBLE) {
        if (soltado || v.ended || !v.paused) return;
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      } else if (!v.paused) {
        nuestra = true;
        v.pause();
      }
    }, { threshold: [0, VISIBLE] }).observe(v);
  });
})();
