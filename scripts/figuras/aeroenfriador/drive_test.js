/* solo para preview.html: perfil sintético (?np=1…4, &t=s, &snap=1, &v=m/s) */
(function () {
  var q = new URLSearchParams(location.search), Np = +(q.get('np') || 2), n = 60, sh = [], tb = [];
  for (var i = 0; i <= n; i++) { var x = i / n; sh.push(30 + 15 * x); tb.push(55 + 25 * x); }
  var f = new FAir(document.getElementById('acFig'), AC_DATA), s = { prof: { shell: sh, tubes: [tb] }, Np: Np, Tlo: 30, Thi: 80, tTube: 6, vFace: +(q.get('v') || 3.5), dt: 0, snap: q.get('snap') === '1' };
  var adv = +(q.get('t') || 0); for (var k = 0; k < adv * 30; k++) { s.dt = 1 / 30; f.update(s); }
  var last = performance.now();
  (function loop(now) { s.dt = Math.min(0.1, (now - last) / 1000); last = now; f.update(s); requestAnimationFrame(loop); })(last);
})();
