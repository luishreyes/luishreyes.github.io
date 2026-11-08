/* Medidas de la separadora de discos autodeslodante del capítulo 19 del libro de operaciones unitarias (Separación
   centrífuga, «La separadora por dentro»): una máquina mediana de tazón semiabierto (con bombas centrípetas a la
   salida), de 450 mm de tazón a 5400 r/min, puesta como purificadora: le saca el agua (y el sólido) a un aceite. La
   misma máquina, con otro disco de gravedad, descrema la leche.
   Unidades: 1 = 1 mm. El eje del tazón va en x = 0, y = 0; z hacia arriba, desde el piso. El corte: el plano y = 0;
   se quita la mitad que mira al lector (y > 0). x crece hacia la derecha del dibujo.

   De las fuentes (con su página; el README dice qué sale de dónde):
   - vertical; la alimentación entra cerca del eje y la acelera un juego de álabes; de 50 a 150 discos cónicos
     separados de 0,4 a 3 mm, a 40 a 55° de la horizontal; el sólido se asienta en la cara de abajo de cada disco y
     resbala hacia el borde mayor y la pared; el líquido clarificado sube por el canal; los agujeros alineados de los
     discos forman los conductos; un rodete fijo (bomba centrípeta) saca el líquido sin espuma; el tazón de doble cono
     junta el sólido en una cámara junto al diámetro mayor; el fondo, cerrado por presión hidráulica, baja cuando se
     vacía el líquido de maniobra y el sólido sale a plena velocidad; tubo de alimentación fijo y un distribuidor;
     tazones de 7 a 24 in, de 12 000 a 4000 r/min (Perry, 2008, pp. 18-121 y 18-122, tabla 18-12 y figs. 18-153 y
     18-154);
   - el agua y la suciedad van por la cara de abajo de los discos hacia afuera y el aceite sube por la de arriba hacia
     adentro; la entrada por el distribuidor y los agujeros de los discos; la fase densa sale por fuera y la liviana por
     el centro (Coulson y Richardson, vol. 2, 2019, pp. 645–647, fig. 11.8);
   - un ejemplo con r = 0,2 m a 5400 r/min (Bylund, 1995, p. 96); los separadores (caulks), tiras radiales soldadas a
     los discos que fijan el canal; la leche entra por agujeros alineados a cierta distancia del borde (pp. 97–98); el
     tazón de cuerpo y capota unidos por un anillo de cierre roscado, la pila apretada entre la capota y el
     distribuidor; en el semiabierto, el tubo de entrada fijo por arriba, el distribuidor con nervios, la cámara del
     discos de rodete de la crema (la liviana) y, arriba, la de la descremada (la densa), que pasa entre el disco de
     arriba y la capota; el espacio de sedimento de 10 a 20 L y descargas cada 30 a 60 min (p. 99); los discos de rodete
     fijos meten el borde en el anillo de líquido que gira (pp. 99–100); el fondo móvil apretado contra un anillo de
     sello de la capota por el agua de abajo, que se vacía para descargar, en décimas de segundo; el bastidor recibe la
     energía del sólido, que sale por gravedad; el eje vertical con un rodamiento arriba y otro abajo, unido al motor
     por un engranaje de tornillo sin fin con eje horizontal (pp. 102–103); el motor horizontal, el freno, el engranaje,
     el sistema del agua de maniobra y el ciclón de sedimento (fig. 6.2.26, p. 100);
   - las dos mitades del tazón apretadas por fuerza hidráulica; el sólido se junta en el diámetro mayor, en el plano que
     las separa, y la mitad de abajo baja un poco para dejarlo salir (Berk, 2013, pp. 253–254);
   - tazones de 0,2 a 1,2 m, de 2000 a 7000 r/min, discos a 0,5 a 1,27 mm; autodeslodantes con 2 a 10 % de sólidos
     (Fellows, 2000, pp. 144–145);
   - la zona neutra: r_i² = (r_A² − (ρ_B/ρ_A) r_B²)/(1 − ρ_B/ρ_A), con r_A el rebose del pesado (el disco de gravedad)
     y r_B el del liviano (McCabe, 2007, pp. 42–43, ec. 2.17);
   - las descremadoras van sobre cojines elásticos; un resorte en el rodamiento cercano al rotor ayuda a pasar la
     velocidad crítica (Perry, 2008, p. 18-118).
   Lo demás es «medida del libro»: típico de una máquina así, escogido para el dibujo. */
export const SD = {
  AZ: 60, EL: 24,
  RPM: 5400,
  ZB: 490,                       // la cara de abajo del tazón (z' = 0 en el cubo); todo el tazón va en z' = z − ZB
  /* el tazón */
  bowl: {
    rO: 226,                     // el radio de afuera del cuerpo (450 mm de tazón con el anillo de cierre)
    rW: 210,                     // el radio de adentro de la pared del cuerpo, donde corre el fondo móvil
    wallTop: 176,                // la boca del cuerpo (z')
    port: [108, 122],            // las lumbreras de descarga del sólido, en la pared (z')
    nPorts: 8,
    col: { rIn: 34, rOut: 72, top: 175 },         // la columna central del cuerpo, sobre la que corre el fondo móvil
    cone: { r0: 30, r1: 22, z0: -20, z1: 70 },     // el asiento cónico del eje
    chamber: [22, 44],           // la cámara del agua de maniobra, bajo el fondo móvil (z')
    feed: { r: 132, w: 8 },      // el canal del agua de maniobra que sube por el fondo del cuerpo
  },
  piston: { rIn: 72, rOut: 210, rim: 196, zBot: 44, zRim: 120, zIn: 146 },    // el fondo móvil
  seal: { r0: 196, r1: 210, z0: 120, z1: 126 },   // el anillo de sello de la capota
  hood: { skirtIn: 196, skirtTop: 255.5, shoulder: [176, 192], rFl: 224, rCone: 205, neckIn: 90, neckOut: 108, top: 450 },
  lock: { r0: 226, r1: 248, z0: 150, z1: 204, lip: 205 },          // el anillo de cierre roscado
  /* los discos: a 50° de la horizontal; el agujero de cada disco en r = 120 */
  disc: { ang: 50, R1: 72, R2: 165, hole: [108, 132], t: 2, pitch: 10, n: 12, real: { t: 0.5, gap: 0.6, n: 70 } },
  skirt: { zEdge: 132, t: 8 },   // la falda del distribuidor: el borde de abajo en r = R2, 8 mm de espesor
  topDisc: { t: 4, neckIn: 66, neckOut: 74, top: 444, roof: 438, roofIn: 32, weir: [400, 406] },
  dist: { bore: 30, neck: 48, top: 395, floor: [175, 183], port: [188, 208], wings: 6 },
  rB: 45,                        // el rebose del liviano (el borde del anillo de la cámara del liviano)
  grav: { rA: 63, r1: 102, z0: 450, z1: 456 },     // el disco de gravedad
  cover: { r0: 92, r1: 108, z0: 456, z1: 498, roofIn: 45 },        // el anillo de cierre chico: la cámara del pesado
  /* lo fijo de arriba: el tubo de alimentación, las dos bombas centrípetas y la caja de salidas */
  tube: { rIn: 12, rOut: 16, bot: 212 },
  lStem: { rIn: 22, rOut: 26 },  // el paso del liviano va entre el tubo (16) y esta pared
  hStem: { rIn: 32, rOut: 36 },  // el del pesado, entre la pared del liviano (26) y esta
  lPare: { z0: 414, z1: 430, ch: [420, 424], rim: 58 },
  hPare: { z0: 464, z1: 480, ch: [470, 474], rim: 78 },
  housing: { r: 100, z0: 1002, z1: 1126, lOut: [1070, 1110], hOut: [1022, 1062], pipe: 340 },
  /* el bastidor (fundición), la capota y el ciclón */
  frame: { rIn: 302, rOut: 320, z0: 60, z1: 720, floor: [60, 80], deck: [380, 400], deckIn: 110, base: [300, 362, 60, 84], fl: [320, 342, 700, 720] },
  fhood: { z0: 720, rBot: 342, cone0: [302, 736], cone1: [130, 970], neck: [120, 138, 970, 1002], t: 12 },
  cushion: { r: 46, h: 60, at: 331, angs: [205, 270, 335] },
  /* el accionamiento: motor horizontal, tornillo sin fin en el eje del tazón y rueda de bronce en el eje horizontal */
  drive: { y: -150, z: 235, shaft: 25, wheel: { rp: 118, rOut: 124, root: 112, rimIn: 100, w: 40, web: 14, hub: 40 }, worm: { z0: 185, z1: 285, r: 32, core: 27 } },
  motor: { r: 128, x0: -372, x1: -700, fan: 60, flange: 150, lantern: [-300, -360] },
  spindle: { r0: 24, r: 30, journal: 34, bot: 95, lower: [80, 124], neck: [360, 462], cone: [490, 560] },
  cyclone: { x: 470, y: -170, r: 85, z0: 470, z1: 640, cone: 150, out: 30, foot: 250 },
  water: { phi: 195, z: 426 },
  /* la persona de referencia (../persona.mjs, 1,75 m): de pie en el piso (z = 0, donde apoyan los cojines), detrás
     del bastidor y a la derecha, entre la capota y el ciclón, de perfil, mirando hacia la izquierda; la máquina la tapa
     en parte. Solo en la vista entera; el detalle no la lleva. Medida del libro. */
  persona: { x: -100, y: -800, piso: 0, rumbo: 150 },
  /* las densidades del caso (para la zona neutra): el aceite de cítricos y el agua a 20 °C (capítulo 16) */
  rho: { liviano: 842, pesado: 998 },
};

/* Las cuentas del dibujo */
export function cuentas() {
  const w = (2 * Math.PI * SD.RPM) / 60;
  const g02 = (0.2 * w * w) / 9.81, vPer = (SD.bowl.rO / 1000) * w;
  const q = SD.rho.liviano / SD.rho.pesado;
  const ri = Math.sqrt((SD.grav.rA ** 2 - q * SD.rB ** 2) / (1 - q));
  const tan = Math.tan((SD.disc.ang * Math.PI) / 180);
  const D = SD.disc, pitchReal = (D.real.t + D.real.gap) / Math.cos((D.ang * Math.PI) / 180);
  const stackReal = D.real.n * pitchReal, stackDrawn = D.n * D.pitch;
  const gapDrawn = (D.pitch - D.t / Math.cos((D.ang * Math.PI) / 180)) * Math.cos((D.ang * Math.PI) / 180);
  return { w, g02, vPer, ri, tan, pitchReal, stackReal, stackDrawn, gapDrawn, exagera: gapDrawn / D.real.gap };
}
