/* solo para preview.html: un perfil sintético de contracorriente (?steam=1 &t=s &snap=1) */
(function () {
  var q = new URLSearchParams(location.search), steam = q.get('steam') === '1', n = 40, sh = [], tb = [];
  for (var i = 0; i <= n; i++) { var x = i / n; sh.push(steam ? 120 : 90 - 50 * x); tb.push(25 + 40 * (1 - x)); }
  var f = new FPlate(document.getElementById('plFig'), PL_DATA), s = { prof: { shell: sh, tubes: [tb] }, hotShell: true, Tlo: 25, Thi: steam ? 120 : 90, steam: steam, tPass: 4, dt: 0, snap: q.get('snap') === '1' };
  var adv = +(q.get('t') || 0); for (var k = 0; k < adv * 30; k++) { s.dt = 1 / 30; f.update(s); }
  var last = performance.now();
  (function loop(now) { s.dt = Math.min(0.1, (now - last) / 1000); last = now; f.update(s); requestAnimationFrame(loop); })(last);
})();
