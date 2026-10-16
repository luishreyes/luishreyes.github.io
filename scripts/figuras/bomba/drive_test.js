/* solo para preview.html: un punto de operación sintético (?cav=0…2, &q=Q/QBEP, &lev=0…1, &open=0…1, &t=s, &snap=1) */
(function () {
  var q = new URLSearchParams(location.search), cav = +(q.get('cav') || 0), Qr = +(q.get('q') || 1);
  var f = new FPump(document.getElementById('pbFig'), PB_DATA);
  var s = { N: 1750, r2: 9.5, press: [12, 9.5, 8.6, 22, 26, 28], pv: 0.3, cm1: 1.6, cm2: 2.2, c2u: 11, uThroat: 3.2, Qrel: Qr, cav: cav, ps: 0.42, pd: 0.55, p1: 0.08, level: +(q.get('lev') || 0.6), open: +(q.get('open') || 1), dt: 0, snap: q.get('snap') === '1' };
  var adv = +(q.get('t') || 0); for (var k = 0; k < adv * 30; k++) { s.dt = 1 / 30; f.update(s); }
  var last = performance.now();
  (function loop(now) { s.dt = Math.min(0.1, (now - last) / 1000); last = now; f.update(s); requestAnimationFrame(loop); })(last);
})();
