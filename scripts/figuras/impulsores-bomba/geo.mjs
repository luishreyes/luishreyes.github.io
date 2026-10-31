/* Medidas de los cuatro impulsores de bomba del capítulo 11 del libro de operaciones unitarias (Bombas): cerrado,
   semiabierto, abierto y axial. Unidades: 1 = 1 mm, z hacia arriba, el eje del impulsor en x = y = 0. Los tres radiales
   van con el ojo arriba (el líquido entra por arriba) y el eje abajo; el axial, igual: el líquido entra por el cono.
   Las proporciones salen de las fuentes del capítulo (la página va al lado) o del caso del capítulo (el modelo del
   Explorador de bombas centrífugas, el mismo de la tabla del caso); lo demás es «medida del libro»: típico de un
   impulsor así, escogido para la figura. El README lleva la misma lista. */

/* ---------- los tres radiales: el impulsor del caso, una 2×3‑8 ----------
   Diámetro de 190 mm (el del caso; la carcasa admite 203), seis álabes que salen a 27°, ojo de 80 mm y ancho de salida
   de 9,31 mm: los del modelo del explorador (REF: D2max 0,203 m, b2 0,00931 m, beta2 27°, z 6, D1 0,080 m). El ángulo de
   entrada, 18°, es el de la figura de la instalación (bomba/geo.mjs). Los tres van con el mismo diámetro, los mismos
   álabes y la misma cámara: solo cambian las tapas. */
export const RAD = {
  AZ: 40, EL: 45,
  r2: 95, b2: 9.31, z: 6, beta1: 18, beta2: 27,
  r1: 40,                       // radio del ojo (D1 = 80 mm)
  e: 4,                         // espesor del álabe: e/d2 = 0,021 (Gülich, p. 347: 0,016 a 0,022; 3 a 5 mm si es fundido)
  eLE: 1.4, lLE: 7,             // el borde de ataque se afina a 1,4 mm en los primeros 7 mm (medida del libro)
  phase: 22,                    // ángulo del primer álabe en el ojo (medida del libro, para la vista)
  // la tapa delantera por dentro: casi plana de r2 a r = 60 (de b2 a 13 mm sobre la tapa trasera) y una curva elíptica
  // que sube hasta el cuello del ojo (r = 40 a z = 30); el cuello sube hasta z = 42. Espesor de 4 mm. Medida del libro.
  fs: { rA: 60, zA: 13, zEye: 30, zTop: 42, t: 4 },
  rs: { t: 5 },                 // tapa trasera de 5 mm (medida del libro)
  le: { rHub: 31, rShr: 41 },   // borde de ataque: de r = 31 en la tapa trasera a r = 41 en la tapa delantera
  // el corte de la tapa delantera: un sector de ±55° frente al lector, de r = 62 hacia afuera (el ojo queda entero)
  cut: { r: 62, half: 55 },
  ring: { r0: 44, r1: 47.5, z0: 32, z1: 42 },  // anillo de desgaste sobre el cuello del ojo (medida del libro)
  holes: { r: 35.5, d: 7 },     // agujeros de balance en la tapa trasera, uno por canal (Gülich, p. 40)
  // el cubo, el eje y la fijación: eje de 24 mm (chaveta 8 × 7 de un eje de 22 a 30 mm), punta roscada M16, tuerca M16
  // (24 mm entre caras, 13 mm de alto) y arandela. Medida del libro.
  hub: { rb: 12, rn: 20, rf: 25, zt: 20, back: -30, rBack: 24 },
  shaft: { r: 12, bottom: -72, thread: 8, top: 38 },
  key: { w: 8, rIn: 8, rOut: 15.3, z0: -24, z1: 17 },
  washer: { r: 15, h: 2.5 }, nut: { af: 24, h: 13 },
  notch: 45,                    // el cubo, sin el cuarto que mira al lector (±45°), para ver el eje y la chaveta
  // abierto: la tapa trasera recortada entre álabes (Gülich, p. 41: «large cut-outs in the rear shroud»; p. 42, Tabla
  // 2.1 B: casi solo el cubo): queda un disco hasta r = 44 entre álabes y un nervio corto bajo cada álabe, hasta
  // r = 57 (medida del libro); de ahí afuera los álabes van libres
  open: { rMin: 44, rWeb: 57, wWeb: 7, wTip: 3.2 },
};

/* ---------- el axial (de hélice) ----------
   D = 300 mm (medida del libro: una bomba axial pequeña; 0,15 m³/s y 6 m a 1450 r/min). Lo demás sale de Gülich para
   una velocidad específica nq = 200, en el medio de las axiales (180 a 300, p. 379):
   - relación de cubo ν = dn/d2 ≈ 0,5 (Fig. 7.24 y 7.25, p. 384);
   - cuatro álabes (Tabla D7.3, p. 384: zLa = 4 entre nq 160 y 230);
   - solidez en la punta L/t = 0,7 (ec. 7.5.14, p. 396, con nq,Ref = 200) y cuerda en el cubo 0,8 de la de la punta
     (Li/La = 0,7 a 0,9, p. 396);
   - holgura en la punta ΔD/d2 = 0,004 (p. 396): 1,2 mm en el diámetro, 0,6 mm por lado;
   - álabes de perfil delgado, fundidos con el cubo en las bombas pequeñas (p. 379);
   - ángulos de vórtice libre (cu·r constante, Tabla 7.3, p. 381) con φ = 0,22 y ψ = 0,25 (Fig. 7.25, p. 384) y
     ηh = 0,88 (el ejemplo de la p. 379), más 2° de incidencia y de 5° a 2° de desviación: 38° en el cubo y 15° en la
     punta, medidos desde el plano de giro.
   El espesor (10 % de la cuerda en el cubo, 6 % en la punta, con la forma de un perfil NACA de cuatro cifras), el cono,
   el cubo, el eje y la carcasa son medida del libro. */
export const AX = {
  AZ: 58, EL: 30,
  R: 150, nu: 0.5, n: 4, gap: 0.6,
  phi: 0.22, psi: 0.25, etaH: 0.88, inc: 2, dev: [5, 2],   // incidencia y desviación (cubo, punta), en grados
  sigmaTip: 0.7, liLa: 0.8, tHub: 0.10, tTip: 0.06,
  phase: 30,
  hub: { z0: -58, z1: 46 },                                 // el cubo cilíndrico, de r = ν·R
  cone: { h: 82, t: 6, cut: 45 },                            // el cono de entrada (tapa del cubo), sin el cuarto de adelante
  shaft: { r: 25, bottom: -150, thread: 18, top: 86 },
  washer: { r: 38, h: 4 }, nut: { af: 55, h: 30 },
  casing: { rIn: 150.6, t: 12, z0: -118, z1: 96, fl: { r: 205, t: 18 }, bolts: 12, boltR: 182, hole: 9 },
};
