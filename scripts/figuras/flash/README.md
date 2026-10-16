# Sistema de destilación flash en isométrico (skill `anatomy`)

Figura de la pestaña «Tambor» del Explorador de equilibrio y flash (POU 2026-20), con los equipos de las
diapositivas de la sesión de flash: la bomba centrífuga con su motor sobre la bancada, el intercambiador de
tubos y coraza calentado con vapor de servicio (válvula de globo, manómetro, trampa de condensado) sobre su
estructura, la válvula de expansión con actuador de diafragma, la mirilla de flujo y el tambor vertical. El
tambor va abierto por el plano de su eje que mira al lector: se ven el deflector contra el que choca la
entrada, la malla eliminadora de niebla sobre su anillo, el rompe-vórtice de la salida de líquido y el
termopozo. Afuera lleva la válvula de seguridad, el manómetro, el visor de nivel y las válvulas de control de
presión (vapor) y de nivel (líquido).

Lo mueve el modelo del explorador: `DScene.drawFig` le pasa a `FFlash.update` el estado ('2F', 'L' o 'V'),
Ψ, V, L, T y P del tambor, T_F y P₁ antes de la válvula y si hay calor. `drumLoad` (en `32_td` del explorador)
calcula, con el tambor de 64 cm del dibujo, la velocidad del vapor (gas ideal), su límite de Souders-Brown con
malla (K = 0,107 m/s) y el tiempo de residencia del líquido al nivel de control. Con eso:

- el nivel se sostiene en su punto (en 'V' el tambor se vacía) y el visor lo repite;
- en la mirilla de flujo se ven las burbujas que nacen al pasar la válvula, tantas como Ψ;
- las gotas nacen en el deflector con tamaños de 15 a 800 µm; cada una cae o sube según su velocidad terminal
  (Schiller-Naumann) frente a la del vapor. Las que llegan a la malla quedan atrapadas y escurren por debajo en
  gotas grandes; si el vapor pasa el límite, parte de las gotas atraviesa la malla (con borde rojo);
- los diales marcan T, P, P₁ y T_F en la escala comercial que les toca, y las válvulas de presión y de nivel
  abren con V y con L.

El dibujo corre en cámara lenta (×1/8). En pausa o con movimiento reducido todo queda quieto en su valor.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, interior sombreado del corte, orden de pintura (`A.settle`) y audit. Escribe `flash_data.json`, `out/` y `preview.html`. |
| `geo.mjs` | Medidas (`FX`), el contorno del tambor en el plano de corte y el volumen de líquido. Sin imports: corre en el build y en la página. |
| `xprism.mjs` | Prismas de sección cóncava en cualquier marco (los mismos de las otras figuras). |
| `live.js` | `FFlash`: lo vivo dentro del explorador (líquido, niebla, gotas, gas, mirilla, diales y válvulas). |
| `drive_test.js` | Caso fijo para `preview.html` (`?st=2F`, `L` o `V`; `&over=1` pasa el límite de la malla; `&t=s` adelanta). |
| `fl.css` | Corte, malla, vidrio, diales y lo vivo. El tema blueprint va en el explorador. |
| `splice.mjs` | Reinserta `out/` en el HTML publicado, entre los marcadores `FLASH_*_START/END`. |

```sh
node build.mjs --audit     # settle + audit (medio minuto); debe terminar en «audit passed»
node build.mjs --js        # solo el código en vivo, el CSS y la vista previa (necesita un build previo)
node splice.mjs            # mete la figura nueva en public/.../Explorador_Equilibrio_Flash.html
```
