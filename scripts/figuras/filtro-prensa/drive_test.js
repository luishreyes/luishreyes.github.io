// banco de prueba: un ciclo sintético (o un estado fijo con ?ph=f&k=0.5)
(function () {
  const st = document.createElement("style"); st.textContent = __FPCSS__; document.head.appendChild(st);
  const fig = new FPress(document.querySelector(".iso-stage"), D); window.__fp = fig;
  fig.colors([180, 138, 90], [201, 183, 156]);
  const qs = new URLSearchParams(location.search);
  const Tf = 12, Tw = 3, Td = 7, T = Tf + Tw + Td;
  const stateAt = (t) => {
    if (t < Tf) { const k = t / Tf; return { phase: "f", k, fill: Math.sqrt(k) * 0.97, P: Math.min(7, 0.8 + 14 * k), qrel: 1 / Math.sqrt(1 + 12 * k), vfrac: 0.85 * Math.sqrt(k), Td }; }
    if (t < Tf + Tw) { const k = (t - Tf) / Tw; return { phase: "w", k, fill: 0.97, P: 7, qrel: 0.18, vfrac: 0.85 + 0.15 * k, Td }; }
    const k = (t - Tf - Tw) / Td; return { phase: "d", k, fill: 0.97, P: 7, qrel: 0, vfrac: Math.max(0, 1 - k * 1.4), Td };
  };
  if (qs.get("t")) { // estado fijo: reproduce el ciclo hasta ese instante para que la tolva tenga lo que debe
    const tEnd = +qs.get("t"); let t = 0; while (t < tEnd) { const s = stateAt(t); s.dt = 1 / 60; fig.update(s); t += 1 / 60; }
    const s = stateAt(tEnd); s.dt = 0; fig.update(s); return;
  }
  let t0 = performance.now();
  const loop = (now) => { const t = ((now - t0) / 1000) % T; const s = stateAt(t); s.dt = 1 / 60; fig.update(s); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
})();
