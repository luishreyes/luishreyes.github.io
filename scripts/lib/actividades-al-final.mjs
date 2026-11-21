// Lleva cada animación por pasos de la página (el motor del libro, /classroom/estilo-libro/actividades/)
// hasta su último paso, abre la lista de sus frases y le pone al <html> la clase act-impreso, para que
// el PDF la muestre terminada, como una figura (/classroom/estilo-libro/actividades-impreso.css).
// La página tiene que abrirse con movimiento reducido (newPage({ reducedMotion: 'reduce' })): así el
// motor salta cada paso a su final y basta con pulsar el botón una vez por paso.
// Lo usan build-pou-programa-pdf.mjs (la guía del reto) y build-deck-doc.mjs.
export async function actividadesAlFinal(page) {
  return page.evaluate(async () => {
    const cuadro = () => new Promise((r) => requestAnimationFrame(() => r()));
    const anims = [...document.querySelectorAll('.act[data-tipo="anim"]')];
    for (const a of anims) {
      const play = a.querySelector('.anim-play');
      const n = a.querySelectorAll('.anim-pasos button').length;
      for (let i = 0; i < n && play; i++) {
        play.click();
        for (let k = 0; k < 4; k++) await cuadro();
      }
      const frases = a.querySelector('.anim-frases');
      if (frases) frases.open = true;
    }
    if (anims.length) document.documentElement.classList.add('act-impreso'); // actividades-impreso.css
    return anims.length;
  });
}
