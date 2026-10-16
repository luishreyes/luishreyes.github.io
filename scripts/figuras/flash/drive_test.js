/* solo para preview.html: un caso fijo del flash (?st=2F|L|V, &over=1 para pasar el límite de la malla, &t=segundos) */
(function () {
  var q = new URLSearchParams(location.search), st = q.get('st') || '2F', over = q.get('over') === '1';
  var host = document.getElementById('flFig'), fig = new FFlash(host, FL_DATA), last = performance.now();
  var comp = function (x) { var S = [[0, [38, 64, 104]], [0.3, [62, 116, 168]], [0.55, [112, 158, 160]], [0.78, [196, 168, 92]], [1, [226, 150, 40]]]; for (var i = 1; i < S.length; i++) if (x <= S[i][0]) { var a = S[i - 1], b = S[i], f = (x - a[0]) / (b[0] - a[0]); return a[1].map(function (v, k) { return v + (b[1][k] - v) * f; }); } return S[4][1]; };
  fig.colors({ x: comp(0.313), y: comp(0.507), z: comp(0.4) });
  var s = { state: st, psi: st === 'L' ? 0 : st === 'V' ? 1 : 0.45, F: 100, V: st === 'L' ? 0 : st === 'V' ? 100 : 45, L: st === 'L' ? 100 : st === 'V' ? 0 : 55, T: 91, Tmax: 200, P: 1.013, Pmax: 4, P1: 2.1, P1max: 4, TF: 150, TFmax: 300, heat: true, ug: over ? 4.2 : 1.32, umax: 3.04, rL: 873, rV: 1.08 };
  var t0 = +(q.get('t') || 0); for (var i = 0; i < t0 * 30; i++) { s.dt = 1 / 30; fig.update(s); }
  function frame(now) { s.dt = (now - last) / 1000; last = now; fig.update(s); requestAnimationFrame(frame); }
  requestAnimationFrame(frame);
})();
