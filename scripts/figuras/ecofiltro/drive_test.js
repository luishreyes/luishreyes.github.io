/* solo para preview.html: el caso de referencia del ecofiltro (?act=1&wet=1&f=45) */
(function () {
  var q = new URLSearchParams(location.search), host = document.getElementById('ecFig'), fig = new FEco(host, EC_DATA), last = performance.now();
  var prof = []; for (var i = 0; i < 24; i++) prof.push(Math.exp(-0.9 * (i + 0.5) / 24));
  var bio = []; for (var j = 0; j < 12; j++) bio.push(1 - j / 14);
  var s = { f: +(q.get('f') || 45), Q: 1.21, cin: 450, cout: 182, prof: prof, bio: bio, wet: +(q.get('wet') || 1), qrec: 170.7, qmu: 240, pH: 0.8 };
  var t0 = +(q.get('t') || 0); for (var k = 0; k < t0 * 30; k++) { s.dt = 1 / 30; fig.update(s); }
  function frame(now) { s.dt = (now - last) / 1000; last = now; fig.update(s); requestAnimationFrame(frame); }
  requestAnimationFrame(frame);
})();
