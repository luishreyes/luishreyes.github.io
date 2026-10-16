/* solo para preview.html: un perfil sintético (lineal por paso) para ver la figura sin el explorador.
   ?np=2|4|6|8  &steam=1  &t=s (adelanta)  &snap=1 */
(function () {
  var q = new URLSearchParams(location.search), Np = +(q.get('np') || 4), steam = q.get('steam') === '1', n = 30;
  var Tlo = 25, Thi = 150, units = [];
  HX_DATA.units.forEach(function (u, i) {
    var a = i / HX_DATA.ns, b = (i + 1) / HX_DATA.ns, sh = [], tubes = [];
    for (var j = 0; j <= n; j++) sh.push(steam ? 120 : Thi - (Thi - 70) * (a + (b - a) * j / n));
    for (var k = 0; k < Np; k++) { var t = []; for (var j2 = 0; j2 <= n; j2++) { var f = (k + (k % 2 === 0 ? j2 / n : 1 - j2 / n)) / Np; t.push(Tlo + (95 - Tlo) * (1 - b + (b - a) * f)); } tubes.push(t); }
    units.push({ shell: sh, tubes: tubes });
  });
  var f = new FTube(document.getElementById('hxFig'), HX_DATA), s = { Np: Np, prof: { units: units }, Tlo: Tlo, Thi: Thi, steam: steam, tPass: 3, tComp: 1.2, dt: 0, snap: q.get('snap') === '1' };
  var adv = +(q.get('t') || 0); for (var i = 0; i < adv * 30; i++) { s.dt = 1 / 30; f.update(s); }
  var last = performance.now();
  (function loop(now) { s.dt = Math.min(0.1, (now - last) / 1000); last = now; f.update(s); requestAnimationFrame(loop); })(last);
})();
