/* Medidas y formas del alambique que comparten build.mjs y la página. Sin imports: el mismo texto corre en las dos.
   Unidades: 1 = 1 cm, z hacia arriba. Las posiciones van en (t, h): t a lo largo del plano de corte (hacia la derecha
   del lector) y h hacia el lector. */
export const SG = {
  POT: { t: -62, h: 6, z0: 40, R: 26, sc: 20, a: 28, top: 44, charge: 38 },
  TUB: { t: 44, h: -20, R: 24, TW: 1.2, z0: 40, z1: 110, water: 106 },
  COIL: { r: 1.5, rc: 16, top: 98, bot: 52, thIn: 200, thOut: 360, turns: 4 },
  // el loro, el embudo y el distribuidor van por debajo de la salida del serpentín: el destilado baja por gravedad
  LORO: { r: 4.6, TW: 0.6, z0: 30, z1: 47, spill: 43, dx: 24 },
  FUN: { z0: 34, z1: 39, r0: 1.3, r1: 4.2, dx: 10.5 },
  MAN: { z: 32.6, r: 1.3 },
  JAR: { d: [22, 46, 70], r: 9.5, TW: 0.7, z0: 3, z1: 24, cock: 29 },
  JACK: { R: 29, a: 31 },
};
export function axesOf(az) {
  const a = (az * Math.PI) / 180, sA = Math.sin(a), cA = Math.cos(a);
  return { T: [sA, -cA, 0], HV: [cA, sA, 0] };
}
// el cuerpo del calderín: un elipsoide de revolución cortado abajo y arriba
export function potR(s) { const { R, sc, a } = SG.POT, q = (s - sc) / a; return R * Math.sqrt(Math.max(0, 1 - q * q)); }
export function potSlope(s) { const { R, sc, a } = SG.POT, q = (s - sc) / a, w = Math.sqrt(Math.max(1e-6, 1 - q * q)); return (-R * q) / (a * w); }
// el capitel: una cebolla de 18 cm de radio
export function helmR(s) { const q = (s - 55) / 16; return 18 * Math.sqrt(Math.max(0, 1 - q * q)); }
export function helmSlope(s) { const q = (s - 55) / 16, w = Math.sqrt(Math.max(1e-6, 1 - q * q)); return (-18 * q) / (16 * w); }
// la camisa de vapor: otro elipsoide, 3 cm por fuera del cuerpo en el ecuador
export function jackR(s) { const { R, a } = SG.JACK, q = (s - SG.POT.sc) / a; return R * Math.sqrt(Math.max(0, 1 - q * q)); }
export function jackSlope(s) { const { R, a } = SG.JACK, q = (s - SG.POT.sc) / a, w = Math.sqrt(Math.max(1e-6, 1 - q * q)); return (-R * q) / (a * w); }
// volumen del calderín hasta la altura s (desde el fondo), en cm³
export function potVol(s) { const { R, sc, a } = SG.POT; s = Math.max(0, Math.min(SG.POT.top, s)); return Math.PI * R * R * (s - (Math.pow(s - sc, 3) + Math.pow(sc, 3)) / (3 * a * a)); }
// altura del líquido para la fracción W/W₀ de la carga (que llega a POT.charge)
export function levelOf(wr) {
  const target = Math.max(0, Math.min(1, wr)) * potVol(SG.POT.charge);
  let lo = 0, hi = SG.POT.top;
  for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (potVol(m) < target) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
// media corona (v ≤ 0) entre r0 y r1 en el plano (u, v) del marco de corte; con r0 = 0, medio disco
export function halfRing(r0, r1, n = 36) {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = Math.PI + (Math.PI * i) / n; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  if (r0 > 1e-6) for (let i = n; i >= 0; i--) { const t = Math.PI + (Math.PI * i) / n; out.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
}
// el serpentín: baja vertical desde la unión sobre el borde, da sus vueltas y sale por la pared al pie del tanque
export function coilRoute(TC, T, HV) {
  const { rc, top, bot, thIn, thOut, turns } = SG.COIL, { TUB } = SG, D2R = Math.PI / 180;
  const P3 = (r, th, z) => [TC[0] + r * (Math.cos(th) * T[0] + Math.sin(th) * HV[0]), TC[1] + r * (Math.cos(th) * T[1] + Math.sin(th) * HV[1]), z];
  const a0 = thIn * D2R, a1 = thOut * D2R + 2 * Math.PI * turns, n = Math.round(((a1 - a0) / (2 * Math.PI)) * 12);
  const helix = [];
  for (let i = 0; i <= n; i++) { const f = i / n; helix.push(P3(rc, a0 + (a1 - a0) * f, top - (top - bot) * f)); }
  // la bajada desde la unión sobre el borde hasta el codo donde empieza la hélice
  return { drop: [P3(rc, a0, TUB.z1 + 9), P3(rc, a0, top)], helix, elbow: P3(rc, a0, top), tangent: [-Math.sin(a0) * T[0] + Math.cos(a0) * HV[0], -Math.sin(a0) * T[1] + Math.cos(a0) * HV[1], 0] };
}
