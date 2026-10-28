# Del montón al poro (tierra diatomácea)

Acercamiento en 3D para el capítulo 17 del libro (Filtración): un montón de unos 3 cm de tierra diatomácea, la ayuda filtrante, visto cada vez más de cerca hasta un alvéolo de una sola frústula. Está hecho con three.js (el de `public/classroom/vendor/three/`), no con Manim, porque necesita una escena en 3D con decenas de miles de partículas. Se graba como video y va al libro como las animaciones de Manim, con su póster.

```bash
CHROME_PATH=/opt/pw-browsers/chromium node grabar.mjs --destino ../../../../libro-operaciones-unitarias/libro/figuras/filtracion
```

Escribe `del-monton-al-poro.mp4` (cuadros tomados a 1920 × 1080 y video a 1280 × 720 con CRF 30, 24 cuadros por segundo, 30 s, H.264 yuv420p, unos 5 MB; a 1080p pasaba de 50 MB, porque el polvo comprime mal) y `del-monton-al-poro.webp` (el último cuadro, el póster). Cada cuadro tarda unos 4 s en Chromium sin tarjeta gráfica; con tres navegadores (`--hilos 3`, el valor por omisión) el video sale en unos 20 minutos. `--fps` y `--duracion` cambian el ritmo, `--ancho` y `--crf` el tamaño del video, y `--solo-codificar` rehace el video con los cuadros que ya están en `out/`; los cuadros de trabajo quedan en `out/`, ignorado en git. Para mirar la página sin grabar, sirva esta carpeta con el mismo mapeo de `grabar.mjs` y ábrala sin `?video`: trae botones y una barra para recorrer el acercamiento a mano.

## Qué sale de dónde

| Pieza | Origen |
|---|---|
| Frústula céntrica: 69 µm de diámetro, alvéolos de unos 2,6 µm con paso de 3,4 µm | medida sobre una micrografía SEM de tierra diatomácea comercial, con su barra de escala |
| Valva abombada: 34 µm, alvéolos de 1,6 µm con paso de 2,1 µm | ídem, otra micrografía |
| Fragmento: 56 µm, agujeros elípticos de 6 a 9 µm, barras de 2 a 5 µm | ídem |
| Alto de la frústula (15 µm), espesor de las paredes, curvatura de las valvas, poro del fondo (0,9 µm), cíngulo | estimaciones del dibujo: las micrografías son vistas en planta |
| El montón, sus terrones y la mezcla de partículas de la pila | dibujo |

Las micrografías (de IMERYS) sirvieron solo para medir; no se guardan en el repositorio ni se reproducen. Por debajo de 1 µm no hay datos: la regla lo dice («ya no hay datos») y el acercamiento termina en el alvéolo, con unos 4 µm de campo. Para seguir hacia los nanómetros hacen falta micrografías de 50 000× a 100 000× de la lámina del fondo de una valva.

## Cómo está hecha

- Cada lámina de sílice es una malla fina; los agujeros los corta una máscara dibujada en un lienzo (`alphaTest`), y cada agujero tiene su pared, un cilindro abierto del espesor de la lámina. Así los poros son redondos y la superficie se puede curvar sin triángulos largos.
- El montón tiene dos capas: lejos, una superficie con textura de grano; cerca del punto al que llega la cámara, unas 40 000 partículas planas con su máscara (`InstancedMesh`), que se ven solas a medida que la cámara se acerca.
- La distancia de la cámara baja en escala logarítmica, de 70 mm a 4 µm, para que cada nivel dure más o menos lo mismo. La cámara usa `logarithmicDepthBuffer`, porque la escena va de centímetros a décimas de micrómetro.
- El brillo de los bordes (las caras vistas de canto emiten más) imita el contraste de una micrografía de electrones secundarios.
- La regla del costado es logarítmica, de 6 cm a 100 nm; la marca amarilla es el ancho del campo.
