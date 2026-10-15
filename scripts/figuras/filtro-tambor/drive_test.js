// banco de prueba del tambor: un caso sintético (?f=0.33&t=3 congela un instante)
(function () {
  const st = document.createElement("style"); st.textContent = __FDCSS__; document.head.appendChild(st);
  const qs = new URLSearchParams(location.search), f = +(qs.get("f") || 0.33), thin = qs.get("thin") === "1";
  const fig = new FDrum(document.querySelector(".iso-stage"), FD_DATA); window.__fd = fig;
  fig.colors([180, 138, 90], [201, 183, 156]);
  const Lmax = thin ? 1.2 : 6.5;
  const prof = Array.from({ length: 121 }, (_, i) => { const phi = i / 120; return phi <= f ? Lmax * Math.sqrt(phi / f) : (phi <= 0.94 || thin ? Lmax : 0); });
  fig.configure({ f, prof, peel: !thin });
  const w = (2 * Math.PI) / 14;
  if (qs.get("t")) { const tEnd = +qs.get("t"); let t = 0; while (t < tEnd) { fig.update({ ang: (w * t) % (2 * Math.PI), dt: 1 / 60 }); t += 1 / 60; } return; }
  const t0 = performance.now(); let last = t0;
  const loop = (now) => { const t = (now - t0) / 1000; fig.update({ ang: (w * t) % (2 * Math.PI), dt: (now - last) / 1000 }); last = now; requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
})();
