/* solo para preview.html: perfil sintético (?par=1 paralelo, &steam=1, &t=s, &snap=1) */
(function () {
  var q = new URLSearchParams(location.search), par = q.get('par') === '1', steam = q.get('steam') === '1', n = 60, sh = [], tb = [];
  for (var i = 0; i <= n; i++) { var x = i / n; sh.push(steam ? 110 : 90 - 45 * x); tb.push(par ? 20 + 30 * x : 20 + 50 * (1 - x)); }
  var f = new FDouble(document.getElementById('dpFig'), DP_DATA), s = { prof: { shell: sh, tubes: [tb] }, Tlo: 20, Thi: steam ? 110 : 90, steam: steam, contra: !par, tLegIn: 2.5, tLegAn: 3.5, dt: 0, snap: q.get('snap') === '1' };
  var adv = +(q.get('t') || 0); for (var k = 0; k < adv * 30; k++) { s.dt = 1 / 30; f.update(s); }
  var last = performance.now();
  (function loop(now) { s.dt = Math.min(0.1, (now - last) / 1000); last = now; f.update(s); requestAnimationFrame(loop); })(last);
})();
