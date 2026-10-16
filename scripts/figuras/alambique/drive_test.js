/* solo para preview.html: un lote de prueba que se repite, con los números del ejemplo de metanol-agua */
(function () {
  var host = document.getElementById('stFig'), fig = new FStill(host, ST_DATA), t0 = performance.now(), last = t0;
  var comp = function (x) { var S = [[0, [38, 64, 104]], [0.5, [112, 158, 160]], [1, [226, 150, 40]]]; for (var i = 1; i < S.length; i++) if (x <= S[i][0]) { var a = S[i - 1], b = S[i], f = (x - a[0]) / (b[0] - a[0]); return a[1].map(function (v, k) { return v + (b[1][k] - v) * f; }); } return S[2][1]; };
  function frame(now) {
    var dt = (now - last) / 1000; last = now;
    var ph = ((now - t0) / 16000) % 1.15, run = ph < 1, f = Math.min(1, ph);
    var wr = 1 - 0.647 * f, x = 0.75 - 0.2 * f, y = 0.893 - 0.091 * f, T = 68.4 + 3.7 * f, cut = f < 0.046 ? 0 : (f < 0.667 ? 1 : 2);
    var D = [Math.min(f, 0.046) / 0.646, Math.max(0, Math.min(f, 0.667) - 0.046) / 0.646, Math.max(0, f - 0.667) / 0.646].map(function (d, i) { return d * 0.646; });
    var mx = Math.max(0.03, 0.4, 0.215);
    fig.colors({ w: comp((x - 0.55) / 0.4), d: comp((y - 0.55) / 0.4), jars: [comp(0.85), comp(0.8), comp(0.68)] });
    fig.update({ wr: wr, T: T, Pst: 3, run: run, xd: y, jars: D.map(function (d, i) { return { fill: d > 0 ? Math.max(0.04, 0.82 * d / mx) : 0, on: run && i === cut }; }), dt: dt });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
