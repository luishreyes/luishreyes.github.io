import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useI18n } from '../context/i18n';

export interface Serie {
  key: string;
  label: string;
  /** La etiqueta en singular, para leer «1 libro» y no «1 libros». */
  uno?: string;
  /** Tono de gris de la serie: el amarillo queda para el año que se toca. */
  color: string;
}

interface BarrasPorAnoProps {
  /** Valores por año y por serie. Los años sin dato se dibujan vacíos. */
  data: Record<number, Record<string, number>>;
  series: Serie[];
  /** Año que se lee al abrir la página. */
  inicial?: number;
  /** Nombre de la cifra para la lectura: «publicaciones», «citas». */
  unidad: string;
  /** Nota que sigue a la cifra del año, como «hasta septiembre». */
  notaAno?: Record<number, string>;
}

const ALTO = 260;
const M = { top: 12, right: 8, bottom: 32, left: 44 };

/** Barras apiladas por año, para tocar: cada año se puede escoger (con el ratón, el dedo o
 *  el teclado) y la lectura de arriba dice sus cifras. Gris para las series; el amarillo
 *  marca el año escogido. */
export const BarrasPorAno: React.FC<BarrasPorAnoProps> = ({ data, series, inicial, unidad, notaAno }) => {
  const { t, lang } = useI18n();
  const reduce = useReducedMotion();
  const caja = useRef<HTMLDivElement>(null);
  // El ancho sale de la caja; mientras no se ha medido, el gráfico no ocupa nada, para no
  // estirar la columna que lo contiene (en el teléfono quedaba de 640 px y se salía).
  const [ancho, setAncho] = useState(0);
  // Las barras crecen una sola vez, cuando el gráfico asoma en pantalla.
  const visto = useInView(caja, { once: true, margin: '0px 0px -10% 0px' });

  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    const medir = () => setAncho(el.clientWidth);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const anos = useMemo(() => {
    const ks = Object.keys(data).map(Number);
    const desde = Math.min(...ks);
    const hasta = Math.max(...ks);
    return Array.from({ length: hasta - desde + 1 }, (_, i) => desde + i);
  }, [data]);

  const total = (a: number) => series.reduce((s, x) => s + (data[a]?.[x.key] ?? 0), 0);
  const maximo = Math.max(1, ...anos.map(total));
  const paso = maximo > 400 ? 200 : maximo > 40 ? 10 : maximo > 20 ? 5 : 2;
  const techo = Math.ceil(maximo / paso) * paso;
  const marcas = Array.from({ length: Math.floor(techo / paso) + 1 }, (_, i) => i * paso).filter((v, i, arr) => arr.length <= 6 || i % 2 === 0 || v === techo);

  const [activo, setActivo] = useState<number>(inicial ?? anos[anos.length - 1]);

  const interior = Math.max(0, ancho - M.left - M.right);
  const banda = interior / anos.length;
  const barra = Math.max(4, banda * 0.66);
  const y = (v: number) => M.top + (ALTO - M.top - M.bottom) * (1 - v / techo);
  const x = (a: number) => M.left + (a - anos[0]) * banda + (banda - barra) / 2;
  // Si no caben todos los años, se rotula uno de cada cinco, más el primero y el último
  // cuando no queda pegado a otro rótulo.
  const rotular = (a: number, i: number) =>
    banda >= 46 || i === 0 || a % 5 === 0 || (i === anos.length - 1 && a % 5 >= 2);

  const numero = (n: number) => n.toLocaleString(lang === 'es' ? 'es-CO' : 'en-US');
  const valores = series.map((s) => ({ ...s, v: data[activo]?.[s.key] ?? 0 }));

  return (
    <figure className="min-w-0">
      {/* La lectura del año escogido */}
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 min-h-[3.2em]" aria-live="polite">
        <span className="a-h3 tabular-nums">{activo}</span>
        <span className="text-tinta-900 font-semibold tabular-nums">
          {numero(total(activo))} {unidad}
          {notaAno?.[activo] && <span className="font-normal text-tinta-600"> ({notaAno[activo]})</span>}
        </span>
        {series.length > 1 && (
          <span className="a-s text-tinta-700 tabular-nums">
            {valores.filter((s) => s.v > 0).map((s) => `${numero(s.v)} ${(s.v === 1 && s.uno ? s.uno : s.label).toLowerCase()}`).join(' · ')}
          </span>
        )}
      </div>

      <div ref={caja} className="mt-4 w-full min-w-0">
        {ancho > 0 && <svg width={ancho} height={ALTO} role="group" aria-label={unidad} className="block overflow-visible">
          {marcas.map((v) => (
            <g key={v}>
              <text x={M.left - 10} y={y(v) + 5} textAnchor="end" fontSize="15" fill="#5E5E61">{numero(v)}</text>
              <line x1={M.left} x2={ancho - M.right} y1={y(v)} y2={y(v)} stroke={v === 0 ? '#1D1D1B' : '#CDCDD0'} strokeWidth={v === 0 ? 2 : 1} />
            </g>
          ))}
          {anos.map((a, i) => {
            let base = 0;
            const sel = a === activo;
            return (
              <g
                key={a}
                role="button"
                tabIndex={0}
                aria-pressed={sel}
                aria-label={`${a}: ${numero(total(a))} ${unidad}`}
                onMouseEnter={() => setActivo(a)}
                onFocus={() => setActivo(a)}
                onClick={() => setActivo(a)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight' && i < anos.length - 1) setActivo(anos[i + 1]);
                  if (e.key === 'ArrowLeft' && i > 0) setActivo(anos[i - 1]);
                }}
                className="cursor-pointer outline-none"
              >
                {/* La banda entera recibe el toque, aunque el año no tenga barra. */}
                <rect x={M.left + i * banda} y={M.top} width={banda} height={ALTO - M.top - M.bottom} fill={sel ? '#FFF4A3' : 'transparent'} />
                {series.map((s) => {
                  const v = data[a]?.[s.key] ?? 0;
                  if (!v) return null;
                  const y0 = y(base + v);
                  const h = y(base) - y0;
                  base += v;
                  return (
                    <motion.rect
                      key={s.key}
                      x={x(a)}
                      width={barra}
                      fill={s.color}
                      initial={{ attrY: y(0), height: 0 }}
                      animate={visto || reduce ? { attrY: y0, height: h } : { attrY: y(0), height: 0 }}
                      transition={reduce ? { duration: 0 } : { duration: 0.7, ease: [0.22, 0.8, 0.3, 1], delay: i * 0.02 }}
                    />
                  );
                })}
                {sel && <rect x={x(a)} y={y(0) + 4} width={barra} height={5} fill="#FFE900" />}
                {rotular(a, i) && (
                  <text x={x(a) + barra / 2} y={ALTO - 6} textAnchor="middle" fontSize="15" fill={sel ? '#1D1D1B' : '#5E5E61'} fontWeight={sel ? 700 : 400}>
                    {a}
                  </text>
                )}
              </g>
            );
          })}
        </svg>}
      </div>

      {series.length > 1 && (
        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 a-s text-tinta-800" aria-hidden="true">
          {series.map((s) => (
            <li key={s.key} className="flex items-center gap-2">
              <span className="inline-block w-4 h-4" style={{ background: s.color }} />
              {s.label}
            </li>
          ))}
        </ul>
      )}
      <p className="a-s text-tinta-600 mt-3">{t('rc.chart.hint')}</p>
    </figure>
  );
};
