/* solo para preview-col.html: un lote con columna que se repite (5 platos, R que sube de 2 a 6, como con x_D constante) */
(function () {
  var host = document.getElementById('stFig'), fig = new FStill(host, ST_COL_DATA), t0 = performance.now(), last = t0;
  var comp = function (x) { var S = [[0, [38, 64, 104]], [0.5, [112, 158, 160]], [1, [226, 150, 40]]]; x = Math.max(0, Math.min(1, x)); for (var i = 1; i < S.length; i++) if (x <= S[i][0]) { var a = S[i - 1], b = S[i], f = (x - a[0]) / (b[0] - a[0]); return a[1].map(function (v, k) { return v + (b[1][k] - v) * f; }); } return S[2][1]; };
  var n = +(new URLSearchParams(location.search).get('n') || 5);
  function frame(now) {
    var dt = (now - last) / 1000; last = now;
    var ph = ((now - t0) / 16000) % 1.15, run = ph < 1, f = Math.min(1, ph);
    var wr = 1 - 0.6 * f, x = 0.6 - 0.45 * f, T = 70 + 25 * f, cut = f < 0.05 ? 0 : (f < 0.7 ? 1 : 2), R = 2 + 4 * f;
    var D = [Math.min(f, 0.05), Math.max(0, Math.min(f, 0.7) - 0.05), Math.max(0, f - 0.7)];
    var xs = []; for (var k = 0; k < n; k++) xs.push(comp(0.95 - (0.95 - x) * (k + 1) / (n + 1)));
    fig.colors({ w: comp(x), d: comp(0.95), jars: [comp(0.97), comp(0.95), comp(0.8)] });
    fig.update({ wr: wr, T: T, Pst: 3, run: run, xd: 0.95, jars: D.map(function (d, i) { return { fill: d > 0 ? Math.max(0.04, 0.82 * d / 0.65) : 0, on: run && i === cut }; }), dt: dt });
    fig.updateCol({ n: n, xs: xs, R: R, Ttop: 65, run: run, dt: dt });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
