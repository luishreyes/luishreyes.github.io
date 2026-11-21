# Animaciones por pasos

Copia del motor de actividades del libro de operaciones unitarias (`libro/figuras/comun/` del repositorio
privado del libro): `actividades.js` (animaciones por pasos, preguntas y retos), `actividades.css`,
`dibujo.js` (texto con subíndices, ejes, flechas, trazos) y `paleta.js` (los colores del libro). No se
editan aquí: cuando cambian en el libro se vuelven a copiar.

En el curso se usan en lugar de los videos de Manim (pedido del profesor, 21 nov 2026: «Mejor crearlas
en HTML que los estudiantes vayan dando clic. Como el libro en español. Nunca manim»). Una página carga,
en este orden:

```html
<link rel="stylesheet" href="/classroom/estilo-libro/actividades/actividades.css">
<script src="/classroom/vendor/katex/katex.min.js"></script>  <!-- si los pasos llevan $…$ -->
<script src="/classroom/estilo-libro/actividades/actividades.js"></script>
<script src="/classroom/estilo-libro/actividades/paleta.js"></script>
<script src="/classroom/estilo-libro/actividades/dibujo.js"></script>
<script src="…/actividades-curso.js"></script>                <!-- las animaciones de la página -->
```

y pone cada animación como `<div class="act" data-tipo="anim" data-id="clave" data-titulo="…"></div>`.
La clave es la de `ZB.animacion('clave', { vista, alt, montar, pasos })` en el script del curso. Las
animaciones que ya existen en el libro se traen de su capítulo con el mismo código y los mismos números.

Para el papel, la página carga además `/classroom/estilo-libro/actividades-impreso.css` (fuera de esta
carpeta, porque no es del libro): quita los mandos y deja el dibujo terminado con todas sus frases. El
script que arma el PDF corre antes cada animación hasta su último paso con
`scripts/lib/actividades-al-final.mjs`, que abre la página con movimiento reducido; ya lo hacen
`build-pou-programa-pdf.mjs` y `build-deck-doc.mjs`.

En una presentación deck-stage la actividad lleva además la clase `act-diapo`, con su CSS en el deck: el
ancho, el `zoom` en pantalla ancha, sin la cabecera (la diapositiva ya tiene título) y sin la lista de
frases en pantalla (sí en el PDF). Ejemplo: la diapositiva «El arrastre de vapor» de la Presentación del
curso de 2027-10.

