import React from 'react';

/** Ancho y alto de un logo para que todos pesen igual: área constante, con tope de ancho y de alto. */
export const medidaLogo = (ratio: number, area = 2600, maxW = 120, maxH = 52) => {
  let h = Math.sqrt(area / ratio), w = h * ratio;
  if (w > maxW) { w = maxW; h = w / ratio; }
  if (h > maxH) { h = maxH; w = h * ratio; }
  return { w: Math.round(w), h: Math.round(h) };
};

/** Un logo de public/images/portafolio/logos/, en gris, al tamaño que le da medidaLogo. */
export const LogoGris: React.FC<{ slug: string; ratio: number; alt: string; area?: number; maxW?: number; maxH?: number; className?: string }> = ({ slug, ratio, alt, area, maxW, maxH, className = '' }) => (
  <img src={`/images/portafolio/logos/${slug}.svg`} alt={alt} loading="lazy" className={`block max-w-full h-auto opacity-80 ${className}`} style={{ width: medidaLogo(ratio, area, maxW, maxH).w }} />
);

/** El muro de logos: una cuadrícula con filete arriba y una línea entre filas, con el pie debajo. */
export const MuroLogos: React.FC<{ logos: { slug: string; ratio: number; alt: string }[]; columnas: string; pie?: React.ReactNode }> = ({ logos, columnas, pie }) => (
  <figure>
    <ul className={`grid ${columnas} border-t-2 border-tinta-900`}>
      {logos.map((l) => (
        <li key={l.slug} className="flex items-center justify-center h-24 sm:h-28 px-3 border-b-2 border-papel-300">
          <LogoGris slug={l.slug} ratio={l.ratio} alt={l.alt} />
        </li>
      ))}
    </ul>
    {pie && <figcaption className="a-pie">{pie}</figcaption>}
  </figure>
);
