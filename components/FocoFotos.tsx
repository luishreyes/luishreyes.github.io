import React from 'react';
import { todasLasFotos } from './data/fotos';

/** El foco de cada foto del portafolio, aplicado en todo el sitio: donde la foto se
 *  recorte (una miniatura 16:10, un retrato 4:5, una banda ancha), queda a la vista lo
 *  importante, casi siempre las caras. Un `objectPosition` en línea sigue mandando. */
const reglas = todasLasFotos
  .map((f) => `.portafolio img[src="${f.src}"]{object-position:${f.foco}}`)
  .join('\n');

export const FocoFotos: React.FC = () => <style>{reglas}</style>;
