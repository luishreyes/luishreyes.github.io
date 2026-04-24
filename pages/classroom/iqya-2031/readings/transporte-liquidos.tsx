import React, { useEffect, useMemo, useState } from 'react';
import { ReadingLayout } from '../../../../components/classroom/ReadingLayout';
import { getCourseBySlug } from '../../../../components/data/classroom';

/* ─── Hook: KaTeX via CDN ─── */
const useKatex = () => {
  useEffect(() => {
    const renderAll = () => {
      // @ts-expect-error — KaTeX se carga dinámicamente
      const rme = window.renderMathInElement;
      if (!rme) return;
      const target = document.querySelector('.reading-prose') ?? document.body;
      rme(target, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
        ],
        throwOnError: false,
      });
    };
    // @ts-expect-error
    if (window.renderMathInElement) { renderAll(); return; }
    if (!document.querySelector('link[data-katex]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css';
      link.setAttribute('data-katex', '1');
      document.head.appendChild(link);
    }
    const s1 = document.createElement('script');
    s1.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js';
    s1.setAttribute('data-katex', '1');
    s1.onload = () => {
      const s2 = document.createElement('script');
      s2.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js';
      s2.setAttribute('data-katex', '1');
      s2.onload = () => renderAll();
      document.head.appendChild(s2);
    };
    document.head.appendChild(s1);
  }, []);
};

/* Hook para re-renderizar KaTeX cuando cambia el contenido (tabs, etc.) */
const useKatexRerender = (deps: unknown[]) => {
  useEffect(() => {
    // @ts-expect-error
    const rme = window.renderMathInElement;
    if (!rme) return;
    // Defer con rAF para que React termine su commit antes de que KaTeX modifique el DOM
    const id = requestAnimationFrame(() => {
      const target = document.querySelector('.reading-prose') ?? document.body;
      try {
        rme(target, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
          ],
          throwOnError: false,
          ignoredClasses: ['katex', 'katex-html', 'katex-mathml'],
        });
      } catch (e) {
        console.warn('KaTeX rerender failed:', e);
      }
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

/* ─── TOC ─── */
const tocItems = [
  { id: 'introduccion', label: 'Introducción' },
  { id: 'propiedades', label: 'Propiedades del fluido' },
  { id: 'regimen', label: 'Reynolds y régimen de flujo' },
  { id: 'perdidas', label: 'Pérdidas en tuberías' },
  { id: 'procedimiento', label: 'Procedimiento de cálculo' },
  { id: 'diseno', label: 'Diseño práctico' },
  { id: 'ejemplo', label: 'Ejemplo resuelto' },
  { id: 'desafios', label: 'Desafíos de diseño' },
  { id: 'bibliografia', label: 'Bibliografía' },
];

/* ─── Callouts ─── */
const TipCallout: React.FC<{ title?: string; children: React.ReactNode }> = ({
  title = '💡 Idea clave',
  children,
}) => (
  <div className="my-6 rounded-xl bg-brand-dark p-5 sm:p-6 not-prose">
    <p className="font-semibold text-brand-yellow text-sm mb-2">{title}</p>
    <div className="text-sm text-zinc-300 leading-relaxed">{children}</div>
  </div>
);

const InfoCallout: React.FC<{ title?: string; children: React.ReactNode }> = ({
  title = '📌 Nota',
  children,
}) => (
  <div className="my-6 rounded-xl bg-brand-dark p-5 sm:p-6 not-prose">
    <p className="font-semibold text-emerald-400 text-sm mb-2">{title}</p>
    <div className="text-sm text-zinc-300 leading-relaxed">{children}</div>
  </div>
);

const WarningCallout: React.FC<{ title?: string; children: React.ReactNode }> = ({
  title = '⚠️ Importante',
  children,
}) => (
  <div className="my-6 rounded-xl bg-brand-dark p-5 sm:p-6 not-prose">
    <p className="font-semibold text-red-400 text-sm mb-2">{title}</p>
    <div className="text-sm text-zinc-300 leading-relaxed">{children}</div>
  </div>
);

const SectionTitle: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => (
  <h2 id={id} className="text-2xl font-bold text-brand-dark mt-14 mb-4 scroll-mt-32">
    {children}
  </h2>
);

const SubTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-lg font-semibold text-brand-dark mt-8 mb-3">{children}</h3>
);

/* ─── Figura centrada (corrige el bug de alineación izquierda) ─── */
const Figure: React.FC<{
  src: string;
  alt: string;
  caption?: React.ReactNode;
  maxWidth?: string;
}> = ({ src, alt, caption, maxWidth = '700px' }) => (
  <figure className="my-8 not-prose flex flex-col items-center">
    <div
      className="w-full flex justify-center rounded-xl bg-zinc-50 border border-zinc-200 p-4 sm:p-6"
    >
      <img
        src={src}
        alt={alt}
        className="block max-w-full h-auto rounded-md shadow-md"
        style={{ maxWidth }}
      />
    </div>
    {caption && (
      <figcaption className="text-center text-sm text-brand-gray mt-3 italic max-w-2xl">
        {caption}
      </figcaption>
    )}
  </figure>
);

/* ─── Gráfica interactiva: propiedad vs. temperatura (inline SVG) ─── */
type TempDataPoint = { T: number; v: number };
type Curve = { name: string; color: string; data: TempDataPoint[] };

const PropertyVsTempChart: React.FC<{ kind: 'density' | 'viscosity' }> = ({ kind }) => {
  const [T, setT] = useState(25);
  const isLog = kind === 'viscosity';
  const xMin = 0;
  const xMax = 100;
  const yMin = kind === 'density' ? 700 : 0.1;
  const yMax = kind === 'density' ? 1050 : 100000;

  const curves: Curve[] = kind === 'density'
    ? [
        { name: 'Agua', color: '#1d4ed8', data: [
          { T: 0, v: 1000 }, { T: 20, v: 998 }, { T: 40, v: 992 },
          { T: 60, v: 983 }, { T: 80, v: 972 }, { T: 100, v: 958 },
        ] },
        { name: 'Queroseno', color: '#b45309', data: [
          { T: 0, v: 820 }, { T: 20, v: 805 }, { T: 40, v: 790 },
          { T: 60, v: 775 }, { T: 80, v: 760 }, { T: 100, v: 745 },
        ] },
        { name: 'Crudo pesado', color: '#7f1d1d', data: [
          { T: 0, v: 970 }, { T: 20, v: 960 }, { T: 40, v: 945 },
          { T: 60, v: 930 }, { T: 80, v: 915 }, { T: 100, v: 900 },
        ] },
      ]
    : [
        { name: 'Agua', color: '#1d4ed8', data: [
          { T: 0, v: 1.79 }, { T: 20, v: 1.00 }, { T: 40, v: 0.65 },
          { T: 60, v: 0.47 }, { T: 80, v: 0.36 }, { T: 100, v: 0.28 },
        ] },
        { name: 'Aceite ligero', color: '#b45309', data: [
          { T: 0, v: 80 }, { T: 20, v: 40 }, { T: 40, v: 20 },
          { T: 60, v: 12 }, { T: 80, v: 8 }, { T: 100, v: 5 },
        ] },
        { name: 'Crudo pesado', color: '#7f1d1d', data: [
          { T: 0, v: 50000 }, { T: 20, v: 5000 }, { T: 40, v: 500 },
          { T: 60, v: 150 }, { T: 80, v: 50 }, { T: 100, v: 20 },
        ] },
      ];

  const unit = kind === 'density' ? 'kg/m³' : 'cP';
  const property = kind === 'density' ? 'ρ' : 'μ';
  const title = kind === 'density' ? 'Densidad vs. temperatura' : 'Viscosidad vs. temperatura (escala log)';

  const interpolate = (data: TempDataPoint[], T: number): number => {
    if (T <= data[0].T) return data[0].v;
    if (T >= data[data.length - 1].T) return data[data.length - 1].v;
    for (let i = 0; i < data.length - 1; i++) {
      if (T >= data[i].T && T <= data[i + 1].T) {
        const t = (T - data[i].T) / (data[i + 1].T - data[i].T);
        if (isLog) {
          const lv = Math.log10(data[i].v) + t * (Math.log10(data[i + 1].v) - Math.log10(data[i].v));
          return Math.pow(10, lv);
        }
        return data[i].v + t * (data[i + 1].v - data[i].v);
      }
    }
    return data[0].v;
  };

  const W = 540;
  const H = 340;
  const margin = { top: 20, right: 20, bottom: 50, left: 70 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  const xScale = (t: number) => margin.left + ((t - xMin) / (xMax - xMin)) * plotW;
  const yScale = (v: number) => {
    if (isLog) {
      const logMin = Math.log10(yMin);
      const logMax = Math.log10(yMax);
      return margin.top + plotH - ((Math.log10(v) - logMin) / (logMax - logMin)) * plotH;
    }
    return margin.top + plotH - ((v - yMin) / (yMax - yMin)) * plotH;
  };

  const pathFor = (data: TempDataPoint[]) =>
    data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xScale(d.T).toFixed(1)} ${yScale(d.v).toFixed(1)}`).join(' ');

  const yTicks = isLog ? [0.1, 1, 10, 100, 1000, 10000, 100000] : [700, 800, 900, 1000, 1050];
  const xTicks = [0, 20, 40, 60, 80, 100];

  const format = (v: number): string => {
    if (isLog) {
      if (v >= 10000) return (v / 1000).toFixed(0) + 'k';
      if (v >= 1000) return (v / 1000).toFixed(1) + 'k';
      if (v >= 10) return v.toFixed(0);
      if (v >= 1) return v.toFixed(1);
      return v.toFixed(2);
    }
    return v.toFixed(0);
  };

  return (
    <div className="my-6 not-prose">
      <div className="rounded-xl bg-white border border-zinc-200 p-4 sm:p-6 shadow-sm">
        <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
          <h4 className="text-base font-semibold text-brand-dark">{title}</h4>
          <div className="text-sm text-brand-gray">
            Temperatura: <span className="font-mono text-brand-dark font-semibold">{T.toFixed(0)} °C</span>
          </div>
        </div>

        <div className="flex justify-center">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[600px]" role="img" aria-label={title}>
            {/* Plot background */}
            <rect x={margin.left} y={margin.top} width={plotW} height={plotH} fill="#fafafa" />

            {/* Y gridlines + labels */}
            {yTicks.map((v) => {
              if (v < yMin || v > yMax) return null;
              const y = yScale(v);
              return (
                <g key={v}>
                  <line x1={margin.left} y1={y} x2={margin.left + plotW} y2={y} stroke="#e4e4e7" strokeWidth="0.5" strokeDasharray="2 2" />
                  <text x={margin.left - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#52525b">{format(v)}</text>
                </g>
              );
            })}

            {/* X gridlines + labels */}
            {xTicks.map((t) => {
              const x = xScale(t);
              return (
                <g key={t}>
                  <line x1={x} y1={margin.top} x2={x} y2={margin.top + plotH} stroke="#e4e4e7" strokeWidth="0.5" strokeDasharray="2 2" />
                  <text x={x} y={margin.top + plotH + 18} textAnchor="middle" fontSize="11" fill="#52525b">{t}</text>
                </g>
              );
            })}

            {/* Axis lines */}
            <line x1={margin.left} y1={margin.top + plotH} x2={margin.left + plotW} y2={margin.top + plotH} stroke="#27272a" strokeWidth="1.2" />
            <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + plotH} stroke="#27272a" strokeWidth="1.2" />

            {/* Axis labels */}
            <text x={margin.left + plotW / 2} y={H - 8} textAnchor="middle" fontSize="12" fill="#27272a" fontWeight="600">
              Temperatura (°C)
            </text>
            <text
              x="16"
              y={margin.top + plotH / 2}
              textAnchor="middle"
              fontSize="12"
              fill="#27272a"
              fontWeight="600"
              transform={`rotate(-90 16 ${margin.top + plotH / 2})`}
            >
              {kind === 'density' ? 'ρ (kg/m³)' : 'μ (cP, log)'}
            </text>

            {/* Curves */}
            {curves.map((c) => (
              <path key={c.name} d={pathFor(c.data)} stroke={c.color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            ))}

            {/* Vertical cursor at selected T */}
            <line x1={xScale(T)} y1={margin.top} x2={xScale(T)} y2={margin.top + plotH} stroke="#E6AC00" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.85" />

            {/* Value dots at cursor */}
            {curves.map((c) => {
              const v = interpolate(c.data, T);
              return (
                <circle key={c.name} cx={xScale(T)} cy={yScale(v)} r="5" fill={c.color} stroke="white" strokeWidth="2" />
              );
            })}
          </svg>
        </div>

        {/* Temperature slider */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-xs text-brand-gray w-12">0 °C</span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={T}
            onChange={(e) => setT(Number(e.target.value))}
            className="flex-1 accent-brand-yellow"
            aria-label="Temperatura"
          />
          <span className="text-xs text-brand-gray w-14 text-right">100 °C</span>
        </div>

        {/* Legend with live values */}
        <div className="grid sm:grid-cols-3 gap-2 mt-4">
          {curves.map((c) => {
            const v = interpolate(c.data, T);
            return (
              <div key={c.name} className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2">
                <span className="inline-block w-3 h-3 rounded-full flex-shrink-0" style={{ background: c.color }} aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-brand-dark truncate">{c.name}</p>
                  <p className="text-xs font-mono text-brand-gray">
                    {property} ≈ {format(v)} {unit}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-center text-brand-gray italic mt-4">
          {kind === 'density'
            ? 'La densidad cambia poco con la temperatura — los líquidos son casi incompresibles. Rango típico: 700–1050 kg/m³.'
            : 'Escala logarítmica. Calentar un crudo pesado de 20 °C a 80 °C reduce μ aproximadamente 100×. Por eso los oleoductos a menudo operan calentados.'}
        </p>
      </div>
    </div>
  );
};

/* ─── Gráfica interactiva: presión de vapor vs. temperatura ─── */
type VaporCurve = {
  name: string;
  color: string;
  bp: number; // boiling point at 1 atm (°C)
  /** data: (T, P) con P en torr. Debe cubrir el rango 0–150 °C. */
  data: TempDataPoint[];
};

const VaporPressureChart: React.FC = () => {
  const [T, setT] = useState(25);

  const xMin = 0;
  const xMax = 150;
  const yMin = 1;
  const yMax = 10000;

  const curves: VaporCurve[] = [
    // Éter dietílico — bp 34.6 °C (muy volátil)
    { name: 'Éter dietílico', color: '#b91c1c', bp: 34.6, data: [
      { T: 0,   v: 185 },
      { T: 10,  v: 291 },
      { T: 20,  v: 442 },
      { T: 30,  v: 647 },
      { T: 34.6, v: 760 },
      { T: 50,  v: 1276 },
      { T: 70,  v: 2356 },
      { T: 90,  v: 4000 },
      { T: 110, v: 6500 },
      { T: 130, v: 10000 },
    ] },
    // Acetona — bp 56.0 °C
    { name: 'Acetona', color: '#c2410c', bp: 56.0, data: [
      { T: 0,   v: 70 },
      { T: 10,  v: 116 },
      { T: 20,  v: 184 },
      { T: 30,  v: 283 },
      { T: 40,  v: 421 },
      { T: 50,  v: 610 },
      { T: 56,  v: 760 },
      { T: 70,  v: 1160 },
      { T: 90,  v: 2090 },
      { T: 110, v: 3500 },
      { T: 130, v: 5600 },
      { T: 150, v: 8500 },
    ] },
    // Etanol — bp 78.4 °C
    { name: 'Etanol', color: '#7c3aed', bp: 78.4, data: [
      { T: 0,   v: 12 },
      { T: 10,  v: 24 },
      { T: 20,  v: 44 },
      { T: 30,  v: 79 },
      { T: 40,  v: 135 },
      { T: 50,  v: 222 },
      { T: 60,  v: 353 },
      { T: 70,  v: 544 },
      { T: 78.4, v: 760 },
      { T: 90,  v: 1187 },
      { T: 110, v: 2210 },
      { T: 130, v: 3840 },
      { T: 150, v: 6300 },
    ] },
    // Agua — bp 100 °C
    { name: 'Agua', color: '#1d4ed8', bp: 100, data: [
      { T: 0,   v: 4.6 },
      { T: 10,  v: 9.2 },
      { T: 20,  v: 17.5 },
      { T: 30,  v: 31.8 },
      { T: 40,  v: 55.3 },
      { T: 50,  v: 92.5 },
      { T: 60,  v: 149.4 },
      { T: 70,  v: 233.7 },
      { T: 80,  v: 355.1 },
      { T: 90,  v: 525.8 },
      { T: 100, v: 760 },
      { T: 110, v: 1074 },
      { T: 130, v: 2025 },
      { T: 150, v: 3567 },
    ] },
  ];

  // Interpolación lineal en log(P) — las curvas de presión de vapor son casi
  // rectas en escala log(P) vs 1/T (Clausius-Clapeyron), y aquí T varía poco,
  // así que log-lineal en T es una aproximación muy aceptable a ojo.
  const interpolateLog = (data: TempDataPoint[], T: number): number => {
    if (T <= data[0].T) return data[0].v;
    if (T >= data[data.length - 1].T) return data[data.length - 1].v;
    for (let i = 0; i < data.length - 1; i++) {
      if (T >= data[i].T && T <= data[i + 1].T) {
        const t = (T - data[i].T) / (data[i + 1].T - data[i].T);
        const lv = Math.log10(data[i].v) + t * (Math.log10(data[i + 1].v) - Math.log10(data[i].v));
        return Math.pow(10, lv);
      }
    }
    return data[0].v;
  };

  const W = 560;
  const H = 360;
  const margin = { top: 20, right: 24, bottom: 54, left: 74 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  const xScale = (t: number) => margin.left + ((t - xMin) / (xMax - xMin)) * plotW;
  const yScale = (v: number) => {
    const logMin = Math.log10(yMin);
    const logMax = Math.log10(yMax);
    return margin.top + plotH - ((Math.log10(v) - logMin) / (logMax - logMin)) * plotH;
  };

  const pathFor = (data: TempDataPoint[]) =>
    data
      .filter((d) => d.T >= xMin && d.T <= xMax)
      .map((d, i) => `${i === 0 ? 'M' : 'L'}${xScale(d.T).toFixed(1)} ${yScale(d.v).toFixed(1)}`)
      .join(' ');

  const yTicks = [1, 10, 100, 760, 1000, 10000];
  const xTicks = [0, 25, 50, 75, 100, 125, 150];

  const formatP = (v: number): string => {
    if (v >= 1000) return (v / 1000).toFixed(v >= 10000 ? 0 : 1) + 'k';
    if (v >= 100) return v.toFixed(0);
    if (v >= 10) return v.toFixed(0);
    if (v >= 1) return v.toFixed(1);
    return v.toFixed(2);
  };

  return (
    <div className="my-6 not-prose">
      <div className="rounded-xl bg-white border border-zinc-200 p-4 sm:p-6 shadow-sm">
        <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
          <h4 className="text-base font-semibold text-brand-dark">
            Presión de vapor vs. temperatura (escala log)
          </h4>
          <div className="text-sm text-brand-gray">
            Temperatura: <span className="font-mono text-brand-dark font-semibold">{T.toFixed(0)} °C</span>
          </div>
        </div>

        <div className="flex justify-center">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[620px]" role="img" aria-label="Curvas de presión de vapor">
            <rect x={margin.left} y={margin.top} width={plotW} height={plotH} fill="#fafafa" />

            {/* Y gridlines + labels */}
            {yTicks.map((v) => {
              const y = yScale(v);
              const is1atm = v === 760;
              return (
                <g key={v}>
                  <line
                    x1={margin.left}
                    y1={y}
                    x2={margin.left + plotW}
                    y2={y}
                    stroke={is1atm ? '#E6AC00' : '#e4e4e7'}
                    strokeWidth={is1atm ? 1.6 : 0.5}
                    strokeDasharray={is1atm ? '6 3' : '2 2'}
                    opacity={is1atm ? 0.9 : 1}
                  />
                  <text
                    x={margin.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="11"
                    fill={is1atm ? '#b45309' : '#52525b'}
                    fontWeight={is1atm ? 700 : 400}
                  >
                    {formatP(v)}
                  </text>
                </g>
              );
            })}

            {/* 1 atm annotation */}
            <text
              x={margin.left + plotW - 6}
              y={yScale(760) - 6}
              textAnchor="end"
              fontSize="11"
              fontWeight="700"
              fill="#b45309"
            >
              1 atm = 760 torr
            </text>

            {/* X gridlines + labels */}
            {xTicks.map((t) => {
              const x = xScale(t);
              return (
                <g key={t}>
                  <line x1={x} y1={margin.top} x2={x} y2={margin.top + plotH} stroke="#e4e4e7" strokeWidth="0.5" strokeDasharray="2 2" />
                  <text x={x} y={margin.top + plotH + 18} textAnchor="middle" fontSize="11" fill="#52525b">{t}</text>
                </g>
              );
            })}

            {/* Axis lines */}
            <line x1={margin.left} y1={margin.top + plotH} x2={margin.left + plotW} y2={margin.top + plotH} stroke="#27272a" strokeWidth="1.2" />
            <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + plotH} stroke="#27272a" strokeWidth="1.2" />

            {/* Axis labels */}
            <text x={margin.left + plotW / 2} y={H - 8} textAnchor="middle" fontSize="12" fill="#27272a" fontWeight="600">
              Temperatura (°C)
            </text>
            <text
              x="16"
              y={margin.top + plotH / 2}
              textAnchor="middle"
              fontSize="12"
              fill="#27272a"
              fontWeight="600"
              transform={`rotate(-90 16 ${margin.top + plotH / 2})`}
            >
              Pᵥₐₚ (torr, log)
            </text>

            {/* Curves */}
            {curves.map((c) => (
              <path
                key={c.name}
                d={pathFor(c.data)}
                stroke={c.color}
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {/* Boiling-point markers at 760 torr */}
            {curves.map((c) => (
              <g key={`bp-${c.name}`}>
                <circle cx={xScale(c.bp)} cy={yScale(760)} r="5" fill={c.color} stroke="white" strokeWidth="2" />
                <text
                  x={xScale(c.bp)}
                  y={yScale(760) + 18}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill={c.color}
                >
                  {c.bp.toFixed(1)}°
                </text>
              </g>
            ))}

            {/* Vertical cursor */}
            <line
              x1={xScale(T)}
              y1={margin.top}
              x2={xScale(T)}
              y2={margin.top + plotH}
              stroke="#E6AC00"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity="0.85"
            />

            {/* Live dots at cursor */}
            {curves.map((c) => {
              const v = interpolateLog(c.data, T);
              if (v < yMin || v > yMax) return null;
              return (
                <circle
                  key={`cursor-${c.name}`}
                  cx={xScale(T)}
                  cy={yScale(v)}
                  r="4"
                  fill={c.color}
                  stroke="white"
                  strokeWidth="1.5"
                />
              );
            })}
          </svg>
        </div>

        {/* Temperature slider */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-xs text-brand-gray w-12">0 °C</span>
          <input
            type="range"
            min={0}
            max={150}
            step={1}
            value={T}
            onChange={(e) => setT(Number(e.target.value))}
            className="flex-1 accent-brand-yellow"
            aria-label="Temperatura"
          />
          <span className="text-xs text-brand-gray w-14 text-right">150 °C</span>
        </div>

        {/* Legend with live values */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
          {curves.map((c) => {
            const v = interpolateLog(c.data, T);
            const aboveAtm = v > 760;
            return (
              <div
                key={c.name}
                className="flex items-center gap-2 rounded-lg border px-3 py-2"
                style={{ borderColor: aboveAtm ? c.color : '#e4e4e7', background: aboveAtm ? `${c.color}0D` : 'white' }}
              >
                <span className="inline-block w-3 h-3 rounded-full flex-shrink-0" style={{ background: c.color }} aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-brand-dark truncate">{c.name}</p>
                  <p className="text-xs font-mono text-brand-gray">Pᵥ ≈ {formatP(v)} torr</p>
                </div>
                {aboveAtm && (
                  <span className="text-[10px] font-semibold text-red-700 whitespace-nowrap" title="Hirviendo a 1 atm">
                    hierve
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-xs text-center text-brand-gray italic mt-4">
          La línea amarilla marca <strong>1 atm (760 torr)</strong>. Donde una curva cruza esa línea está su
          punto de ebullición normal. Mueve el slider y observa cómo líquidos volátiles como el éter alcanzan
          presiones muy altas a temperaturas modestas — por eso requieren cuidado con cavitación y sellado.
        </p>
      </div>
    </div>
  );
};

/* ─── Diagrama de Moody interactivo (leer, no calcular) ─── */
const MoodyDiagram: React.FC = () => {
  const [Re, setRe] = useState(1e5);
  const [epsD, setEpsD] = useState(1e-3);

  // Swamee-Jain (explícita) — aproximación de Colebrook-White (<1% error en Re > 5000).
  // Se usa solo para dibujar y localizar el punto, no para dar el valor al estudiante.
  const swameeJain = (Re: number, epsD: number): number => {
    const arg = epsD / 3.7 + 5.74 / Math.pow(Re, 0.9);
    return 0.25 / Math.pow(Math.log10(arg), 2);
  };

  const ReMin = 1e3;
  const ReMax = 1e8;
  const fMin = 0.008;
  const fMax = 0.1;

  const W = 720;
  const H = 480;
  const margin = { top: 36, right: 86, bottom: 56, left: 76 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  const xScale = (re: number) => {
    const logMin = Math.log10(ReMin);
    const logMax = Math.log10(ReMax);
    return margin.left + ((Math.log10(re) - logMin) / (logMax - logMin)) * plotW;
  };
  const yScale = (f: number) => {
    const logMin = Math.log10(fMin);
    const logMax = Math.log10(fMax);
    return margin.top + plotH - ((Math.log10(f) - logMin) / (logMax - logMin)) * plotH;
  };

  const epsDCurves = [0, 1e-6, 5e-6, 1e-5, 5e-5, 1e-4, 2e-4, 4e-4, 1e-3, 2e-3, 4e-3, 1e-2, 1.5e-2, 2e-2, 3e-2, 5e-2];

  const laminarPath = (() => {
    const pts: [number, number][] = [];
    for (let logRe = 3; logRe <= Math.log10(2300) + 0.01; logRe += 0.1) {
      const re = Math.pow(10, logRe);
      pts.push([xScale(re), yScale(64 / re)]);
    }
    pts.push([xScale(2300), yScale(64 / 2300)]);
    return 'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join(' L');
  })();

  const turbPath = (eps: number): string => {
    const pts: [number, number][] = [];
    for (let logRe = Math.log10(4000); logRe <= Math.log10(ReMax) + 0.01; logRe += 0.05) {
      const re = Math.pow(10, logRe);
      const f = swameeJain(re, eps);
      if (f >= fMin && f <= fMax) {
        pts.push([xScale(re), yScale(f)]);
      }
    }
    return pts.length ? 'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join(' L') : '';
  };

  const roughBoundaryPath = (() => {
    const pts: [number, number][] = [];
    for (const eps of epsDCurves) {
      if (eps === 0) continue;
      const f = swameeJain(1e7, eps);
      const ReCrit = 200 / (eps * Math.sqrt(f));
      if (ReCrit > ReMin && ReCrit < ReMax && f > fMin && f < fMax) {
        pts.push([xScale(ReCrit), yScale(f)]);
      }
    }
    if (pts.length < 2) return '';
    return 'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join(' L');
  })();

  const userF = Re < 2300
    ? 64 / Re
    : Re < 4000
      ? NaN
      : swameeJain(Re, epsD);

  const inLaminar = Re < 2300;
  const inCritical = Re >= 2300 && Re < 4000;
  const inTurbulent = Re >= 4000;
  const isFullyRough = inTurbulent && (5.74 / Math.pow(Re, 0.9)) < 0.1 * (epsD / 3.7);

  const regime: { label: string; color: string; note: string } = inLaminar
    ? { label: 'Laminar', color: '#16a34a', note: 'f = 64/Re · solo depende de Re' }
    : inCritical
      ? { label: 'Zona crítica', color: '#ea580c', note: 'Transición inestable · evitar en diseño' }
      : isFullyRough
        ? { label: 'Turbulento plenamente rugoso', color: '#7c3aed', note: 'f depende solo de ε/D · las curvas se vuelven horizontales a la derecha' }
        : { label: 'Turbulento de transición', color: '#0284c7', note: 'f depende de Re y de ε/D · seguir la curva de tu rugosidad' };

  const xTicksMajor = [1e3, 1e4, 1e5, 1e6, 1e7, 1e8];
  const yTicksMajor = [0.008, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1];
  const xTicksMinor: number[] = [];
  for (let decade = 3; decade < 8; decade++) {
    for (let m = 2; m <= 9; m++) xTicksMinor.push(m * Math.pow(10, decade));
  }

  const fmtEps = (e: number): string => {
    if (e === 0) return '0 (liso)';
    if (e >= 1e-2) return e.toFixed(3);
    if (e >= 1e-3) return e.toFixed(4);
    return e.toExponential(0).replace('+', '');
  };

  const fmtRe = (re: number): string => {
    if (re >= 1e6) return (re / 1e6).toFixed(2) + '×10⁶';
    if (re >= 1e4) return (re / 1e3).toFixed(1) + '×10³';
    return Math.round(re).toString();
  };

  const logRe = Math.log10(Re);
  const logEps = epsD > 0 ? Math.log10(epsD) : -7;

  const superscriptDigit = (n: number): string => {
    const map: Record<string, string> = { '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹' };
    return String(n).split('').map((c) => map[c] ?? c).join('');
  };

  return (
    <div className="my-6 not-prose">
      <div className="rounded-xl bg-white border border-zinc-200 p-4 sm:p-6 shadow-sm">
        <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
          <h4 className="text-base font-semibold text-brand-dark">
            Diagrama de Moody — aprende a leerlo
          </h4>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white" style={{ background: regime.color }}>
            {regime.label}
          </span>
        </div>

        <p className="text-xs text-brand-gray mb-4 leading-relaxed">
          Mueve los sliders de <strong>Re</strong> y de <strong>rugosidad relativa ε/D</strong>. El cursor
          muestra <em>dónde caer</em> en el diagrama — no te da el valor de <em>f</em> para que lo copies.
          Aprende a reconocer el régimen, seguir la curva de ε/D correcta y leer la altura.
        </p>

        <div className="flex justify-center">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[780px]" role="img" aria-label="Diagrama de Moody interactivo">
            <rect x={margin.left} y={margin.top} width={plotW} height={plotH} fill="#fafafa" />

            {/* Zona crítica */}
            <rect
              x={xScale(2300)}
              y={margin.top}
              width={xScale(4000) - xScale(2300)}
              height={plotH}
              fill="#fed7aa"
              opacity="0.45"
            />
            <text x={(xScale(2300) + xScale(4000)) / 2} y={margin.top + 14} textAnchor="middle" fontSize="9" fill="#9a3412" fontWeight="700">
              Zona crítica
            </text>

            {/* Minor X gridlines */}
            {xTicksMinor.map((t) => (
              <line key={`mnx-${t}`} x1={xScale(t)} y1={margin.top} x2={xScale(t)} y2={margin.top + plotH} stroke="#e4e4e7" strokeWidth="0.3" />
            ))}

            {/* Major gridlines */}
            {xTicksMajor.map((t) => (
              <line key={`mjx-${t}`} x1={xScale(t)} y1={margin.top} x2={xScale(t)} y2={margin.top + plotH} stroke="#d4d4d8" strokeWidth="0.8" />
            ))}
            {yTicksMajor.map((f) => (
              <line key={`mjy-${f}`} x1={margin.left} y1={yScale(f)} x2={margin.left + plotW} y2={yScale(f)} stroke="#e4e4e7" strokeWidth="0.5" strokeDasharray="2 2" />
            ))}

            {/* Laminar */}
            <path d={laminarPath} stroke="#16a34a" strokeWidth="2.5" fill="none" />
            <text
              x={xScale(1200) + 2}
              y={yScale(64 / 1200) + 14}
              fontSize="10"
              fill="#16a34a"
              fontWeight="700"
              transform={`rotate(-28 ${xScale(1200) + 2} ${yScale(64 / 1200) + 14})`}
            >
              Laminar · f = 64/Re
            </text>

            {/* Turbulent curves */}
            {epsDCurves.map((eps) => {
              const d = turbPath(eps);
              if (!d) return null;
              const isSmooth = eps === 0;
              return (
                <path
                  key={eps}
                  d={d}
                  stroke={isSmooth ? '#0284c7' : '#1f2937'}
                  strokeWidth={isSmooth ? 2 : 1}
                  fill="none"
                  opacity={isSmooth ? 0.9 : 0.55}
                />
              );
            })}

            {/* Fully-rough boundary */}
            {roughBoundaryPath && (
              <path d={roughBoundaryPath} stroke="#dc2626" strokeWidth="1.2" strokeDasharray="5 3" fill="none" opacity="0.7" />
            )}
            <text x={xScale(4e5)} y={margin.top + 26} fontSize="9" fill="#dc2626" fontStyle="italic">
              Turbulento plenamente rugoso →
            </text>

            {/* Right-axis ε/D labels */}
            {epsDCurves.filter((e) => e >= 1e-5).map((eps) => {
              const f = swameeJain(ReMax * 0.98, eps);
              if (f < fMin || f > fMax) return null;
              return (
                <text key={`r-${eps}`} x={margin.left + plotW + 4} y={yScale(f) + 3} fontSize="8.5" fill="#52525b">
                  {fmtEps(eps)}
                </text>
              );
            })}
            <text x={margin.left + plotW + 38} y={margin.top - 10} fontSize="10" fontWeight="700" fill="#27272a" textAnchor="middle">
              ε/D
            </text>

            {/* X labels */}
            {xTicksMajor.map((t) => {
              const exp = Math.log10(t);
              return (
                <g key={`xlab-${t}`}>
                  <line x1={xScale(t)} y1={margin.top + plotH} x2={xScale(t)} y2={margin.top + plotH + 4} stroke="#27272a" strokeWidth="1" />
                  <text x={xScale(t)} y={margin.top + plotH + 18} textAnchor="middle" fontSize="11" fill="#27272a">
                    10{superscriptDigit(exp)}
                  </text>
                </g>
              );
            })}

            {/* Y labels */}
            {yTicksMajor.map((f) => (
              <text key={`ylab-${f}`} x={margin.left - 8} y={yScale(f) + 4} textAnchor="end" fontSize="10" fill="#27272a">
                {f.toFixed(3)}
              </text>
            ))}

            {/* Axes */}
            <line x1={margin.left} y1={margin.top + plotH} x2={margin.left + plotW} y2={margin.top + plotH} stroke="#27272a" strokeWidth="1.2" />
            <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + plotH} stroke="#27272a" strokeWidth="1.2" />

            {/* Axis titles */}
            <text x={margin.left + plotW / 2} y={H - 10} textAnchor="middle" fontSize="12" fontWeight="700" fill="#27272a">
              Número de Reynolds, Re
            </text>
            <text
              x="18"
              y={margin.top + plotH / 2}
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill="#27272a"
              transform={`rotate(-90 18 ${margin.top + plotH / 2})`}
            >
              Factor de fricción de Darcy, f
            </text>

            {/* User crosshair */}
            {Number.isFinite(userF) && userF >= fMin && userF <= fMax && (
              <g>
                <line x1={xScale(Re)} y1={margin.top + plotH} x2={xScale(Re)} y2={yScale(userF)} stroke="#E6AC00" strokeWidth="1.8" strokeDasharray="5 3" />
                <line x1={margin.left} y1={yScale(userF)} x2={xScale(Re)} y2={yScale(userF)} stroke="#E6AC00" strokeWidth="1.8" strokeDasharray="5 3" />
                <circle cx={xScale(Re)} cy={yScale(userF)} r="7" fill="#FFBF00" stroke="#1A1A1A" strokeWidth="1.8" />
                <circle cx={xScale(Re)} cy={yScale(userF)} r="2" fill="#1A1A1A" />
              </g>
            )}

            {inCritical && (
              <g>
                <line x1={xScale(Re)} y1={margin.top} x2={xScale(Re)} y2={margin.top + plotH} stroke="#ea580c" strokeWidth="1.8" strokeDasharray="5 3" />
                <text x={xScale(Re)} y={margin.top + plotH / 2} textAnchor="middle" fontSize="11" fill="#9a3412" fontWeight="700">
                  f indefinido
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Controls */}
        <div className="grid sm:grid-cols-2 gap-4 mt-5">
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <label htmlFor="moody-re" className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
                Reynolds
              </label>
              <span className="font-mono text-sm text-brand-dark font-semibold">Re = {fmtRe(Re)}</span>
            </div>
            <input
              id="moody-re"
              type="range"
              min={3}
              max={8}
              step={0.02}
              value={logRe}
              onChange={(e) => setRe(Math.pow(10, Number(e.target.value)))}
              className="w-full accent-brand-yellow"
              aria-label="Número de Reynolds (escala logarítmica)"
            />
            <div className="flex justify-between text-[10px] text-brand-gray font-mono mt-0.5">
              <span>10³</span><span>10⁴</span><span>10⁵</span><span>10⁶</span><span>10⁷</span><span>10⁸</span>
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-1">
              <label htmlFor="moody-eps" className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
                Rugosidad relativa
              </label>
              <span className="font-mono text-sm text-brand-dark font-semibold">ε/D = {fmtEps(epsD)}</span>
            </div>
            <input
              id="moody-eps"
              type="range"
              min={-6}
              max={-1.3}
              step={0.05}
              value={logEps}
              onChange={(e) => setEpsD(Math.pow(10, Number(e.target.value)))}
              className="w-full accent-brand-yellow"
              aria-label="Rugosidad relativa (escala logarítmica)"
            />
            <div className="flex justify-between text-[10px] text-brand-gray font-mono mt-0.5">
              <span>10⁻⁶</span><span>10⁻⁵</span><span>10⁻⁴</span><span>10⁻³</span><span>10⁻²</span><span>0.05</span>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-sm text-brand-dark">
            <span className="font-semibold" style={{ color: regime.color }}>{regime.label}.</span>{' '}
            <span className="text-brand-gray">{regime.note}</span>
          </p>
          <p className="text-xs text-brand-gray mt-2 leading-relaxed">
            <strong>Cómo leer el diagrama:</strong> (1) localiza tu Re en el eje inferior. (2) sube vertical
            hasta cruzar la curva con tu ε/D. (3) desde ese cruce, ve a la izquierda para leer <em>f</em>.
            La línea amarilla hace esos tres pasos por ti — el ejercicio es reconocer el régimen y la curva
            correcta.
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-[11px] text-brand-gray mr-1 mt-1">Ejemplos:</span>
          {[
            { label: 'Agua · PVC nuevo', Re: 5e4, epsD: 6e-5 },
            { label: 'Crudo pesado · laminar', Re: 2e3, epsD: 1e-4 },
            { label: 'Aire en acero comercial', Re: 3e6, epsD: 4e-4 },
            { label: 'Leche en acero inoxidable', Re: 8e4, epsD: 3e-5 },
            { label: 'Agua en hierro galvanizado', Re: 2e5, epsD: 3e-3 },
          ].map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => { setRe(p.Re); setEpsD(p.epsD); }}
              className="text-[11px] px-2.5 py-1 rounded-full border border-zinc-300 hover:border-brand-yellow-dark hover:bg-yellow-50 transition text-brand-gray hover:text-brand-dark"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Perfil de presión a lo largo del sistema (SVG inline) ─── */
const PressureProfile: React.FC = () => {
  const W = 720;
  const H = 360;
  const margin = { top: 40, right: 40, bottom: 60, left: 64 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  // Nodos a lo largo del sistema: x = distancia (normalizada 0-1), y = cabeza de presión (m)
  // P_atm = 10.3 m. Ptanque abierto = atm. Succión baja por fricción y altura;
  // bomba agrega 30 m; descarga pierde por fricción y subida; tanque final atm.
  const nodes: { x: number; P: number; label: string; highlight?: 'min' | 'bomba' }[] = [
    { x: 0.00, P: 10.3, label: 'Tanque 1\n(superficie, atm)' },
    { x: 0.18, P: 8.2,  label: 'Entrada a\nbomba', highlight: 'min' },
    { x: 0.30, P: 38.0, label: 'Salida de\nbomba', highlight: 'bomba' },
    { x: 0.55, P: 28.0, label: 'Tras codos\ny válvulas' },
    { x: 0.82, P: 18.0, label: 'Antes de\ndescarga' },
    { x: 1.00, P: 10.3, label: 'Tanque 2\n(atm)' },
  ];

  const Pvap = 2.4; // presión de vapor del agua a 20 °C, en m de H2O
  const NPSHreq = 4; // m, referencia de diseño
  const minNPSH = Pvap + NPSHreq; // nivel mínimo admisible en succión

  const yMin = 0;
  const yMax = 42;

  const xScale = (xn: number) => margin.left + xn * plotW;
  const yScale = (P: number) => margin.top + plotH - ((P - yMin) / (yMax - yMin)) * plotH;

  const pathD = 'M' + nodes.map((n) => `${xScale(n.x).toFixed(1)} ${yScale(n.P).toFixed(1)}`).join(' L');

  return (
    <div className="my-6 not-prose">
      <div className="rounded-xl bg-white border border-zinc-200 p-4 sm:p-6 shadow-sm">
        <h4 className="text-base font-semibold text-brand-dark mb-1">
          Perfil de presión a lo largo del sistema
        </h4>
        <p className="text-xs text-brand-gray mb-4">
          La presión sube en la bomba y baja por fricción y elevación. El <em>mínimo</em> del sistema
          —justo antes de la bomba— es el punto crítico para cavitación.
        </p>

        <div className="flex justify-center">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[780px]" role="img" aria-label="Perfil de presión a lo largo del sistema">
            {/* Plot area */}
            <rect x={margin.left} y={margin.top} width={plotW} height={plotH} fill="#fafafa" />

            {/* Zona de cavitación (por debajo de Pvap) en rojo tenue */}
            <rect
              x={margin.left}
              y={yScale(Pvap)}
              width={plotW}
              height={margin.top + plotH - yScale(Pvap)}
              fill="#fecaca"
              opacity="0.55"
            />
            {/* Margen de NPSH (entre Pvap y Pvap+NPSHreq) en ámbar */}
            <rect
              x={margin.left}
              y={yScale(minNPSH)}
              width={plotW}
              height={yScale(Pvap) - yScale(minNPSH)}
              fill="#fde68a"
              opacity="0.5"
            />

            {/* Líneas horizontales de referencia */}
            <line x1={margin.left} y1={yScale(Pvap)} x2={margin.left + plotW} y2={yScale(Pvap)} stroke="#dc2626" strokeWidth="1.4" strokeDasharray="5 3" />
            <text x={margin.left + plotW - 6} y={yScale(Pvap) - 4} textAnchor="end" fontSize="10" fill="#b91c1c" fontWeight="700">
              P_vap ({Pvap} m) — si P cae aquí → cavitación
            </text>

            <line x1={margin.left} y1={yScale(minNPSH)} x2={margin.left + plotW} y2={yScale(minNPSH)} stroke="#b45309" strokeWidth="1.2" strokeDasharray="4 3" />
            <text x={margin.left + plotW - 6} y={yScale(minNPSH) - 4} textAnchor="end" fontSize="10" fill="#92400e" fontWeight="700">
              P_vap + NPSH_req ({minNPSH} m) — mínimo admisible
            </text>

            {/* Perfil de presión */}
            <path d={pathD} stroke="#1A1A1A" strokeWidth="2.5" fill="none" />

            {/* Área bajo la curva (visual) */}
            <path
              d={`${pathD} L ${xScale(1).toFixed(1)} ${yScale(yMin).toFixed(1)} L ${xScale(0).toFixed(1)} ${yScale(yMin).toFixed(1)} Z`}
              fill="#FFBF00"
              opacity="0.08"
            />

            {/* Nodos */}
            {nodes.map((n, i) => {
              const cx = xScale(n.x);
              const cy = yScale(n.P);
              const color = n.highlight === 'min'
                ? '#dc2626'
                : n.highlight === 'bomba'
                  ? '#16a34a'
                  : '#1A1A1A';
              return (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="6" fill={color} stroke="white" strokeWidth="2" />
                  {n.label.split('\n').map((line, li) => (
                    <text
                      key={li}
                      x={cx}
                      y={margin.top + plotH + 14 + li * 12}
                      textAnchor="middle"
                      fontSize="9.5"
                      fill={color}
                      fontWeight={n.highlight ? 700 : 500}
                    >
                      {line}
                    </text>
                  ))}
                  <text x={cx} y={cy - 10} textAnchor="middle" fontSize="10" fill={color} fontWeight="700" fontFamily="ui-monospace, monospace">
                    {n.P.toFixed(1)} m
                  </text>
                </g>
              );
            })}

            {/* Flecha de "salto" de la bomba */}
            <g>
              <defs>
                <marker id="arr-bomba" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#16a34a" />
                </marker>
              </defs>
              <path
                d={`M ${xScale(0.18) + 8} ${yScale(8.2) - 2} Q ${xScale(0.24)} ${yScale(38) + 10}, ${xScale(0.30) - 8} ${yScale(38) + 2}`}
                fill="none"
                stroke="#16a34a"
                strokeWidth="1.8"
                strokeDasharray="3 3"
                markerEnd="url(#arr-bomba)"
              />
              <text x={xScale(0.24)} y={yScale(23)} textAnchor="middle" fontSize="10" fill="#15803d" fontWeight="700">
                ΔP_bomba ≈ 30 m
              </text>
            </g>

            {/* Eje Y */}
            <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + plotH} stroke="#27272a" strokeWidth="1.2" />
            {[0, 10, 20, 30, 40].map((p) => (
              <g key={p}>
                <line x1={margin.left - 4} y1={yScale(p)} x2={margin.left} y2={yScale(p)} stroke="#27272a" strokeWidth="1" />
                <text x={margin.left - 8} y={yScale(p) + 4} textAnchor="end" fontSize="10" fill="#52525b">{p}</text>
              </g>
            ))}
            {/* Eje X */}
            <line x1={margin.left} y1={margin.top + plotH} x2={margin.left + plotW} y2={margin.top + plotH} stroke="#27272a" strokeWidth="1.2" />

            {/* Títulos */}
            <text x={margin.left + plotW / 2} y={H - 8} textAnchor="middle" fontSize="12" fontWeight="700" fill="#27272a">
              Posición a lo largo del sistema →
            </text>
            <text
              x="16"
              y={margin.top + plotH / 2}
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill="#27272a"
              transform={`rotate(-90 16 ${margin.top + plotH / 2})`}
            >
              Cabeza de presión (m de H₂O)
            </text>
          </svg>
        </div>

        <p className="text-xs text-center text-brand-gray italic mt-4 max-w-2xl mx-auto">
          La <strong>succión</strong> (punto rojo) es el sitio crítico: ahí la presión baja por fricción y
          por altura antes de entrar a la bomba. Si el perfil toca la zona roja (P &lt; P_vap) → cavitación.
          Debe quedar por encima de la franja ámbar para tener margen de NPSH.
        </p>
      </div>
    </div>
  );
};

/* ─── Calculadora interactiva de Reynolds ─── */
const ReynoldsCalculator: React.FC = () => {
  const [V, setV] = useState(1.5);
  const [D, setD] = useState(0.05);
  const [rho, setRho] = useState(1000);
  const [mu, setMu] = useState(0.001);

  const Re = useMemo(() => (rho * V * D) / mu, [V, D, rho, mu]);

  const regime = useMemo(() => {
    if (Re < 2100) return { label: 'Laminar', color: 'bg-emerald-500', note: '$f = 64 / \\mathrm{Re}$ (analítico)' };
    if (Re < 4000) return { label: 'Transición', color: 'bg-amber-500', note: 'Inestable · evitar en diseño' };
    return { label: 'Turbulento', color: 'bg-sky-500', note: 'Usar Moody / Colebrook-White' };
  }, [Re]);

  useKatexRerender([Re, regime.label]);

  const fmt = (n: number) => {
    if (n === 0) return '0';
    const abs = Math.abs(n);
    if (abs >= 1e5 || abs < 1e-2) return n.toExponential(2);
    return n.toLocaleString('es-CO', { maximumFractionDigits: 3 });
  };

  return (
    <div className="my-6 rounded-xl bg-brand-dark p-5 sm:p-6 not-prose text-zinc-100">
      <p className="font-semibold text-brand-yellow text-sm mb-3">🧮 Calculadora de Reynolds</p>
      <p className="text-xs text-zinc-400 mb-4">
        Ajusta los parámetros y observa cómo cambia el régimen de flujo.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {[
          { label: 'Velocidad V (m/s)', value: V, set: setV, min: 0.01, max: 10, step: 0.01 },
          { label: 'Diámetro D (m)', value: D, set: setD, min: 0.001, max: 1, step: 0.001 },
          { label: 'Densidad ρ (kg/m³)', value: rho, set: setRho, min: 100, max: 2000, step: 10 },
          { label: 'Viscosidad μ (Pa·s)', value: mu, set: setMu, min: 0.0001, max: 1, step: 0.0001 },
        ].map((f) => (
          <label key={f.label} className="block">
            <span className="text-xs uppercase tracking-wider text-zinc-400">{f.label}</span>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                value={f.value}
                min={f.min}
                max={f.max}
                step={f.step}
                onChange={(e) => f.set(Number(e.target.value))}
                className="w-24 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm font-mono text-white focus:border-brand-yellow focus:outline-none"
              />
              <input
                type="range"
                value={f.value}
                min={f.min}
                max={f.max}
                step={f.step}
                onChange={(e) => f.set(Number(e.target.value))}
                className="flex-1 accent-brand-yellow"
              />
            </div>
          </label>
        ))}
      </div>
      <div className="rounded-lg bg-zinc-900 border border-zinc-700 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Número de Reynolds</p>
          <p className="text-2xl font-bold font-mono text-brand-yellow">{fmt(Re)}</p>
          <p className="text-xs text-zinc-400 mt-1">
            <span dangerouslySetInnerHTML={{ __html: '' }} />
            {'$\\mathrm{Re} = \\rho V D / \\mu$'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-block w-3 h-3 rounded-full ${regime.color}`}
            aria-hidden="true"
          />
          <div>
            <p className="font-semibold text-white">{regime.label}</p>
            <p className="text-xs text-zinc-400">{regime.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Tabla interactiva de rugosidades ─── */
const materiales = [
  { nombre: 'PVC / plástico liso', epsilon: 0.0015, note: 'Tuberías nuevas de agua/químicos no corrosivos.' },
  { nombre: 'Cobre / vidrio', epsilon: 0.0015, note: 'Superficie pulida; muy baja rugosidad.' },
  { nombre: 'Acero inoxidable', epsilon: 0.002, note: 'Común en industria alimentaria y farmacéutica.' },
  { nombre: 'Acero comercial / hierro forjado', epsilon: 0.046, note: 'El material de referencia en la industria.' },
  { nombre: 'Hierro galvanizado', epsilon: 0.15, note: 'Común en plomería; mayor rugosidad.' },
  { nombre: 'Hierro fundido', epsilon: 0.26, note: 'Rugosidad alta; aumenta con corrosión.' },
  { nombre: 'Concreto', epsilon: 0.3, note: 'Rango 0.3–3 mm según acabado.' },
  { nombre: 'Acero remachado', epsilon: 3.0, note: 'Alta rugosidad; obsoleto en nuevos diseños.' },
];

const MaterialRoughnessTable: React.FC = () => {
  const [active, setActive] = useState(3);
  const D = 0.05; // referencia 50 mm
  useKatexRerender([active]);

  return (
    <div className="my-6 not-prose">
      <p className="text-sm text-brand-gray mb-3">
        Rugosidad absoluta $\varepsilon$ (en mm) de materiales comunes. Haz clic en una fila
        para ver la rugosidad relativa $\varepsilon / D$ asumiendo una tubería de 50 mm.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-brand-dark text-white text-left">
              <th className="px-4 py-2.5 font-semibold">Material</th>
              <th className="px-4 py-2.5 font-semibold">$\varepsilon$ (mm)</th>
              <th className="px-4 py-2.5 font-semibold">$\varepsilon/D$ @ 50 mm</th>
              <th className="px-4 py-2.5 font-semibold">Notas</th>
            </tr>
          </thead>
          <tbody>
            {materiales.map((m, i) => (
              <tr
                key={m.nombre}
                onClick={() => setActive(i)}
                className={`cursor-pointer transition-colors ${
                  active === i ? 'bg-yellow-50' : i % 2 === 0 ? 'bg-white' : 'bg-zinc-50'
                } hover:bg-yellow-50 border-b border-zinc-100`}
              >
                <td className="px-4 py-2.5 font-medium text-brand-dark">{m.nombre}</td>
                <td className="px-4 py-2.5 font-mono text-brand-dark">{m.epsilon}</td>
                <td className="px-4 py-2.5 font-mono text-brand-gray">
                  {((m.epsilon / 1000) / D).toExponential(2)}
                </td>
                <td className="px-4 py-2.5 text-brand-gray text-xs">{m.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-brand-gray mt-2 italic">
        Fuente: Moody (1944), Colebrook-White. Los valores varían con el estado de conservación
        (corrosión, depósitos) — estos son valores típicos para tubería nueva.
      </p>
    </div>
  );
};

/* ─── Tabs de propiedades del fluido ─── */
const FluidPropertiesTabs: React.FC = () => {
  const [tab, setTab] = useState<'rho' | 'mu' | 'pvap'>('rho');
  useKatexRerender([tab]);

  const tabs = [
    { id: 'rho', label: 'Densidad (ρ)' },
    { id: 'mu', label: 'Viscosidad (μ)' },
    { id: 'pvap', label: 'Presión de vapor' },
  ] as const;

  return (
    <div className="my-6 not-prose">
      <div role="tablist" aria-label="Propiedades del fluido" className="flex gap-2 border-b border-zinc-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
              tab === t.id
                ? 'text-brand-dark border-brand-yellow'
                : 'text-brand-gray border-transparent hover:text-brand-dark'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === 'rho' && (
          <div>
            <p className="text-brand-gray leading-relaxed">
              <strong>Densidad</strong> ($\rho$): masa por unidad de volumen (kg/m³).
            </p>
            <ul className="mt-3 pl-5 list-disc space-y-1 text-brand-gray leading-relaxed">
              <li>Afecta la presión hidrostática $P = \rho g h$ cuando hay cambios de elevación.</li>
              <li>Influye directamente en la potencia que requieren las bombas.</li>
              <li>
                Varía principalmente con la <strong>temperatura</strong> (disminuye al calentarse)
                y muy poco con la presión: los líquidos son prácticamente incompresibles.
              </li>
              <li>
                Para agua a 20 °C: $\rho \approx 998$ kg/m³. Para petróleo crudo, entre 800–950
                kg/m³ según el grado API.
              </li>
            </ul>
            <PropertyVsTempChart kind="density" />
          </div>
        )}

        {tab === 'mu' && (
          <div>
            <p className="text-brand-gray leading-relaxed">
              <strong>Viscosidad</strong>: resistencia de un fluido a fluir. Se distinguen dos
              formas:
            </p>
            <ul className="mt-3 pl-5 list-disc space-y-1 text-brand-gray leading-relaxed">
              <li>
                <strong>Viscosidad dinámica</strong> ($\mu$): Pa·s o centipoise (cP). 1 cP = {String.raw`$10^{-3}$`} Pa·s.
              </li>
              <li>
                <strong>Viscosidad cinemática</strong> ($\nu = \mu / \rho$): m²/s o centistokes (cSt).
              </li>
              <li>Factor principal de las pérdidas por fricción en tuberías.</li>
              <li>Afecta la selección del tipo de bomba y la potencia requerida.</li>
              <li>
                Disminuye <strong>marcadamente</strong> con la temperatura, en especial en
                hidrocarburos pesados → a menudo es necesario calentar el fluido antes de bombearlo.
              </li>
              <li>
                Agua a 20 °C: $\mu \approx 1.0$ cP. Aceite SAE 10W a 20 °C: $\approx$ 100 cP.
                Miel a 20 °C: {String.raw`$\approx 10{,}000$`} cP.
              </li>
            </ul>
            <PropertyVsTempChart kind="viscosity" />
          </div>
        )}

        {tab === 'pvap' && (
          <div>
            <p className="text-brand-gray leading-relaxed">
              <strong>Presión de vapor</strong> ({String.raw`$P_{\text{vap}}$`}): presión a la que
              un líquido se vaporiza (entra en ebullición) a una temperatura específica. Unidades:
              Pa o mmHg.
            </p>
            <ul className="mt-3 pl-5 list-disc space-y-1 text-brand-gray leading-relaxed">
              <li>
                <strong>Fundamental para prevenir la cavitación</strong> en bombas. Si la presión
                en la succión cae por debajo de {String.raw`$P_{\text{vap}}$`} a la temperatura de
                bombeo, se forman burbujas que colapsan violentamente, erosionando el impulsor y
                reduciendo la eficiencia.
              </li>
              <li>Aumenta de forma no lineal con la temperatura (curva de Clausius-Clapeyron).</li>
              <li>
                Agua a 25 °C: $\approx 3.2$ kPa. Agua a 80 °C: $\approx 47$ kPa. A 100 °C llega a
                101.3 kPa (1 atm) — por eso hierve.
              </li>
            </ul>
            <VaporPressureChart />
            <Figure
              src="https://www.tlv.com/sites/default/files/tlv_assets/g/steam_story/images/1406cavitation/cavitation-in-condensate-pumps1_LA.gif"
              alt="Animación de cavitación en una bomba de condensado (TLV)"
              caption="Cavitación: cuando la presión local cae por debajo de la presión de vapor, se forman y colapsan burbujas que erosionan el impulsor."
              maxWidth="520px"
            />
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Tabs de pérdidas menores ─── */
const MinorLossesTabs: React.FC = () => {
  const [tab, setTab] = useState<'entradas' | 'expansion' | 'codos'>('entradas');
  useKatexRerender([tab]);

  const tabs = [
    { id: 'entradas', label: 'Entradas y salidas' },
    { id: 'expansion', label: 'Expansiones y contracciones' },
    { id: 'codos', label: 'Codos, tees y uniones' },
  ] as const;

  return (
    <div className="my-6 not-prose">
      <div role="tablist" aria-label="Tipos de pérdidas menores" className="flex gap-2 border-b border-zinc-200 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
              tab === t.id
                ? 'text-brand-dark border-brand-yellow'
                : 'text-brand-gray border-transparent hover:text-brand-dark'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tab === 'entradas' && (
          <div>
            <p className="text-brand-gray leading-relaxed">
              En las <strong>entradas</strong>, $K_L$ depende de la geometría del borde:
              reentrante (0.80) → borde agudo (0.50) → bien redondeado (0.03). En las
              <strong> salidas</strong>, $K_L = \alpha$ (el factor de corrección de energía
              cinética — toda la energía cinética se pierde).
            </p>
            <Figure
              src="/classroom/iqya-2031/readings/transporte-liquidos-07.png"
              alt="Coeficientes KL para entradas y salidas de tubería"
              caption="Coeficientes de pérdida en entradas y salidas. Redondear el borde de entrada reduce las pérdidas ~25× respecto al borde reentrante."
              maxWidth="700px"
            />
          </div>
        )}
        {tab === 'expansion' && (
          <div>
            <p className="text-brand-gray leading-relaxed">
              Las <strong>expansiones súbitas</strong> tienen una expresión cerrada derivada
              del balance de momento de Borda-Carnot; las <strong>contracciones súbitas</strong>
              dependen de $d^2/D^2$ y se leen de gráfica.
            </p>
            <Figure
              src="/classroom/iqya-2031/readings/transporte-liquidos-08.png"
              alt="Coeficientes KL para expansiones y contracciones súbitas"
              caption="Para expansión súbita, KL = (1 − d²/D²)². Para contracción súbita, KL se lee de la gráfica (máx. 0.5 cuando d/D → 0)."
              maxWidth="700px"
            />
          </div>
        )}
        {tab === 'codos' && (
          <div>
            <p className="text-brand-gray leading-relaxed">
              Codos y tees son los accesorios más frecuentes en una planta. Los codos con radio
              de curvatura grande (<em>smooth bends</em>) tienen $K_L$ mucho menor que los
              codos angulares (<em>miter bends</em>). Los miter con vanes guía se acercan en
              desempeño a los smooth.
            </p>
            <Figure
              src="/classroom/iqya-2031/readings/transporte-liquidos-09.png"
              alt="Coeficientes KL para codos, tees y uniones"
              caption="Coeficientes de pérdida típicos para accesorios comunes. Un codo smooth de 90° flanged tiene KL = 0.3; uno roscado (threaded) tiene KL = 0.9 — 3× más."
              maxWidth="700px"
            />
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Stepper del procedimiento de cálculo ─── */
const CalculationStepper: React.FC = () => {
  const [step, setStep] = useState(1);
  useKatexRerender([step]);

  const pasos = [
    {
      title: 'Caracterizar el fluido',
      body: (
        <>
          <p>
            Determinar <strong>$\rho$</strong>, <strong>$\mu$</strong> y <strong>{String.raw`$P_{\text{vap}}$`}</strong>
            a la temperatura de operación. Si la temperatura varía a lo largo de la línea, usar
            el valor promedio ponderado (o segmentar la línea).
          </p>
          <p className="text-xs text-brand-gray italic mt-2">
            Fuentes: hojas de seguridad, Perry's Handbook, NIST WebBook, o correlaciones (Antoine
            para {String.raw`$P_{\text{vap}}$`}).
          </p>
        </>
      ),
    },
    {
      title: 'Calcular la velocidad V',
      body: (
        <>
          <p>A partir del caudal volumétrico $Q$ y del diámetro interno $D$:</p>
          <p className="mt-2">{'$$V = \\dfrac{Q}{A} = \\dfrac{4 Q}{\\pi D^2}$$'}</p>
          <p className="text-xs text-brand-gray italic mt-2">
            Si todavía no se tiene $D$ fijo, usar las velocidades recomendadas de la sección
            "Diseño práctico" para proponer un diámetro inicial.
          </p>
        </>
      ),
    },
    {
      title: 'Calcular el número de Reynolds',
      body: (
        <>
          <p>{'$$\\mathrm{Re} = \\dfrac{\\rho V D}{\\mu}$$'}</p>
          <ul className="list-disc pl-5 mt-2 space-y-0.5">
            <li>{String.raw`Si $\mathrm{Re} < 2100$ → laminar → $f = 64 / \mathrm{Re}$.`}</li>
            <li>{String.raw`Si $\mathrm{Re} > 4000$ → turbulento → Moody o Colebrook-White.`}</li>
            <li>{String.raw`Si $2100 < \mathrm{Re} < 4000$ → transición → evitar en diseño.`}</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Obtener f (Moody / Colebrook-White)',
      body: (
        <>
          <p>
            En turbulento, $f$ depende de {String.raw`$\mathrm{Re}$`} y de la rugosidad relativa $\varepsilon/D$.
            Leer del diagrama de Moody o resolver Colebrook-White iterativamente.
          </p>
          <p className="text-xs text-brand-gray italic mt-2">
            Para cálculos rápidos, la correlación explícita de <strong>Swamee-Jain</strong> evita
            la iteración con error menor al 1 %:
          </p>
          <p className="mt-1">{'$$f = \\dfrac{0.25}{\\left[\\log_{10}\\left(\\dfrac{\\varepsilon/D}{3.7} + \\dfrac{5.74}{\\mathrm{Re}^{0.9}}\\right)\\right]^2}$$'}</p>
        </>
      ),
    },
    {
      title: 'Calcular pérdidas mayores (Darcy-Weisbach)',
      body: (
        <>
          <p>{'$$h_f = f \\, \\dfrac{L}{D} \\, \\dfrac{V^2}{2g}$$'}</p>
          <p className="text-xs text-brand-gray italic mt-2">
            $L$ es la longitud total de tramos rectos de tubería. Si hay segmentos con diámetros
            distintos, calcular $h_f$ por segmento y sumar.
          </p>
        </>
      ),
    },
    {
      title: 'Sumar pérdidas menores',
      body: (
        <>
          <p>{'$$h_m = \\sum K_{L,i} \\, \\dfrac{V^2}{2g}$$'}</p>
          <p className="text-xs text-brand-gray italic mt-2">
            Sumar $K_L$ de cada accesorio (codos, tees, válvulas, cambios de sección, entradas,
            salidas). Ver tablas en la sección anterior.
          </p>
        </>
      ),
    },
    {
      title: 'Aplicar Bernoulli modificada',
      body: (
        <>
          <p>Con $h_L = h_f + h_m$, despejar la cabeza que debe aportar la bomba:</p>
          <p className="mt-2">{'$$h_A = (z_2 - z_1) + \\dfrac{P_2 - P_1}{\\rho g} + \\dfrac{\\alpha_2 V_2^2 - \\alpha_1 V_1^2}{2g} + h_L$$'}</p>
          <p className="text-xs text-brand-gray italic mt-2">
            $h_A$ es la base para seleccionar la bomba: debe aparecer a la derecha de la curva
            del sistema en el diagrama de operación, junto con la verificación del NPSH.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="my-6 not-prose">
      <div role="tablist" aria-label="Pasos del procedimiento de cálculo" className="flex gap-1 flex-wrap mb-4">
        {pasos.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={step === i + 1}
            onClick={() => setStep(i + 1)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
              step === i + 1
                ? 'bg-brand-dark text-white'
                : 'bg-zinc-100 text-brand-gray hover:bg-zinc-200'
            }`}
          >
            <span
              className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                step === i + 1 ? 'bg-brand-yellow text-brand-dark' : 'bg-white text-brand-dark'
              }`}
            >
              {i + 1}
            </span>
            <span className="hidden sm:inline">{pasos[i].title}</span>
          </button>
        ))}
      </div>
      {/* key={step} fuerza remount limpio — evita conflicto con KaTeX que modifica el DOM */}
      <div key={step} className="rounded-xl border-l-4 border-brand-yellow bg-white shadow-sm p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-yellow-dark mb-2">
          Paso {step} de {pasos.length}
        </p>
        <h3 className="text-xl font-bold text-brand-dark mb-3">{pasos[step - 1].title}</h3>
        <div className="text-brand-gray leading-relaxed">{pasos[step - 1].body}</div>
      </div>
    </div>
  );
};

/* ─── Ejemplo resuelto con reveal progresivo ─── */
const WorkedExample: React.FC = () => {
  const [shown, setShown] = useState(0);
  useKatexRerender([shown]);

  const steps = [
    {
      heading: 'Enunciado',
      body: (
        <>
          <p>
            Se requiere bombear <strong>agua a 25 °C</strong> ($\rho = 997$ kg/m³, {String.raw`$\mu = 8.9 \times 10^{-4}$`} Pa·s)
            desde un tanque atmosférico a nivel $z_1 = 2$ m hasta un recipiente presurizado
            ($P_2 = 150$ kPa man.) ubicado a $z_2 = 15$ m. El caudal deseado es $Q = 0.01$ m³/s
            y se usará tubería de acero comercial ($\varepsilon = 0.046$ mm) de diámetro nominal
            de 2 pulgadas ($D = 0.0525$ m). La línea tiene $L = 120$ m e incluye 6 codos de 90°
            smooth flanged ($K_L = 0.3$ c/u), 2 válvulas de compuerta abiertas ($K_L = 0.15$
            c/u) y una entrada brusca ($K_L = 0.5$) y salida ($K_L = 1$).
          </p>
          <p className="mt-2">
            <strong>Objetivo:</strong> calcular la cabeza que debe aportar la bomba $h_A$ (m).
          </p>
        </>
      ),
    },
    {
      heading: '1. Velocidad',
      body: (
        <>
          <p>{'$$V = \\dfrac{4Q}{\\pi D^2} = \\dfrac{4 \\times 0.01}{\\pi \\times 0.0525^2} \\approx 4.62 \\text{ m/s}$$'}</p>
        </>
      ),
    },
    {
      heading: '2. Reynolds',
      body: (
        <>
          <p>{'$$\\mathrm{Re} = \\dfrac{\\rho V D}{\\mu} = \\dfrac{997 \\times 4.62 \\times 0.0525}{8.9 \\times 10^{-4}} \\approx 2.7 \\times 10^5$$'}</p>
          <p className="text-xs text-brand-gray italic mt-2">Régimen turbulento.</p>
        </>
      ),
    },
    {
      heading: '3. Factor de fricción',
      body: (
        <>
          <p>
            Rugosidad relativa: {String.raw`$\varepsilon / D = 0.046 / 52.5 \approx 8.8 \times 10^{-4}$`}.
            Con {String.raw`$\mathrm{Re} = 2.7 \times 10^5$`}, Swamee-Jain da $f \approx 0.0213$.
          </p>
        </>
      ),
    },
    {
      heading: '4. Pérdidas mayores',
      body: (
        <>
          <p>
            {'$$h_f = f \\, \\dfrac{L}{D} \\, \\dfrac{V^2}{2g} = 0.0213 \\times \\dfrac{120}{0.0525} \\times \\dfrac{4.62^2}{2 \\times 9.81} \\approx 53 \\text{ m}$$'}
          </p>
        </>
      ),
    },
    {
      heading: '5. Pérdidas menores',
      body: (
        <>
          <p>
            $\sum K_L = 6 \times 0.3 + 2 \times 0.15 + 0.5 + 1 = 3.6$
          </p>
          <p>{'$$h_m = \\sum K_L \\, \\dfrac{V^2}{2g} = 3.6 \\times \\dfrac{4.62^2}{2 \\times 9.81} \\approx 3.9 \\text{ m}$$'}</p>
        </>
      ),
    },
    {
      heading: '6. Cabeza de la bomba',
      body: (
        <>
          <p>
            Elevación: $\Delta z = 15 - 2 = 13$ m. Presión: {String.raw`$\Delta P / (\rho g) = 150{,}000 / (997 \times 9.81) \approx 15.3$`} m.
          </p>
          <p className="mt-2">Velocidades en los tanques ≈ 0 (recipientes grandes):</p>
          <p>{'$$h_A = \\Delta z + \\dfrac{\\Delta P}{\\rho g} + h_f + h_m = 13 + 15.3 + 53 + 3.9 \\approx 85 \\text{ m}$$'}</p>
          <p className="mt-2 font-semibold text-brand-dark">
            La bomba debe aportar aproximadamente <strong>85 m de cabeza</strong>.
          </p>
          <p className="text-xs text-brand-gray italic mt-3">
            <strong>Lección:</strong> la pérdida mayor ($h_f = 53$ m) domina completamente sobre
            la elevación y la presión. Aumentar el diámetro a 3" reduciría $h_f$ en un factor de
            ~5, pero aumentaría el costo de tubería. Este es exactamente el trade-off que
            discutimos en "Diseño práctico".
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="my-6 not-prose">
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        {steps.slice(0, shown + 1).map((s, i) => (
          <div key={i} className={`px-5 py-4 ${i === 0 ? 'bg-yellow-50 border-b border-zinc-200' : 'border-t border-zinc-100'}`}>
            <h4 className="font-bold text-brand-dark mb-2">{s.heading}</h4>
            <div className="text-sm text-brand-gray leading-relaxed">{s.body}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        {shown < steps.length - 1 && (
          <button
            onClick={() => setShown(shown + 1)}
            className="px-4 py-2 rounded-lg bg-brand-dark text-white text-sm font-semibold hover:bg-zinc-800 transition-colors"
          >
            Mostrar siguiente paso →
          </button>
        )}
        {shown > 0 && (
          <button
            onClick={() => setShown(0)}
            className="px-4 py-2 rounded-lg bg-zinc-100 text-brand-gray text-sm font-semibold hover:bg-zinc-200 transition-colors"
          >
            Reiniciar
          </button>
        )}
        {shown === steps.length - 1 && (
          <span className="px-4 py-2 text-sm text-brand-yellow-dark font-semibold self-center">
            ✓ Ejercicio completo
          </span>
        )}
      </div>
    </div>
  );
};

/* ─── Componente principal ─── */
const TransporteLiquidos: React.FC = () => {
  const course = getCourseBySlug('iqya-2031');
  if (!course) return null;
  const reading = course.readings.find((r) => r.slug === 'transporte-liquidos');
  if (!reading) return null;

  useKatex();

  const [tocOpen, setTocOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Re-renderizar KaTeX cuando cambia la sección activa (click-to-filter del TOC).
  // Si no, al cambiar entre secciones, las fórmulas de la nueva sección no se procesan
  // porque React la monta fresca y useKatex solo corre en el mount inicial.
  useKatexRerender([activeSection]);

  const handleTocClick = (id: string) => {
    setActiveSection((prev) => (prev === id ? null : id));
    setTocOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isVisible = (id: string) => activeSection === null || activeSection === id;

  return (
    <ReadingLayout course={course} reading={reading} wide>
      {/* Mobile TOC */}
      <div className="lg:hidden sticky top-20 z-30 mb-6 not-prose">
        <button
          onClick={() => setTocOpen(!tocOpen)}
          className="w-full flex items-center justify-between py-2.5 px-4 rounded-lg bg-zinc-50 border border-zinc-200 text-sm font-semibold text-brand-dark"
        >
          <span>
            {activeSection
              ? tocItems.find((t) => t.id === activeSection)?.label ?? 'Contenido'
              : 'Contenido'}
          </span>
          <span className="text-brand-gray">{tocOpen ? '−' : '+'}</span>
        </button>
        {tocOpen && (
          <nav className="mt-1 rounded-lg bg-white border border-zinc-200 shadow-lg p-3 space-y-1">
            {activeSection && (
              <button
                onClick={() => { setActiveSection(null); setTocOpen(false); }}
                className="block w-full text-left py-1.5 px-2 text-sm font-semibold text-brand-yellow-dark hover:bg-zinc-50 rounded transition-colors"
              >
                ← Ver todo
              </button>
            )}
            {tocItems.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTocClick(t.id)}
                className={`block w-full text-left py-1 px-2 text-sm rounded transition-colors ${
                  activeSection === t.id
                    ? 'text-brand-dark font-semibold bg-yellow-50'
                    : 'text-brand-gray hover:text-brand-dark hover:bg-zinc-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        )}
      </div>

      <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-10">
        {/* Desktop TOC */}
        <nav className="hidden lg:block">
          <div className="sticky top-28 space-y-1 text-sm">
            {activeSection && (
              <button
                onClick={() => setActiveSection(null)}
                className="block w-full text-left py-1.5 mb-2 text-sm font-semibold text-brand-yellow-dark hover:text-brand-dark transition-colors"
              >
                ← Ver todo
              </button>
            )}
            {tocItems.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTocClick(t.id)}
                className={`block w-full text-left py-1 rounded px-2 transition-colors ${
                  activeSection === t.id
                    ? 'text-brand-dark font-semibold bg-yellow-50'
                    : 'text-brand-gray hover:text-brand-dark'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Contenido */}
        <div className="reading-prose">
          {activeSection === null && (
            <>
              <p className="text-lg leading-relaxed text-brand-gray">
                Esta lectura acompaña la sesión sobre <strong>transporte de líquidos</strong> en la
                industria. Revisaremos las propiedades del fluido que gobiernan su flujo, cómo se
                cuantifican las pérdidas de energía en tuberías, y los principales desafíos que
                enfrenta un ingeniero al diseñar un sistema de transporte. El material es la base
                sobre la cual construiremos, en la siguiente sesión, el estudio de las bombas.
              </p>

              <Figure
                src="https://images.unsplash.com/photo-1622534376374-fe4480328daa?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Planta industrial con líneas de tubería que conectan equipos de proceso"
                caption="El transporte de líquidos conecta todas las etapas del proceso industrial: desde la alimentación de materias primas hasta la distribución del producto final."
                maxWidth="720px"
              />

              <InfoCallout title="📌 Aplicación al proyecto del curso">
                Si tu proyecto incluye el transporte de un líquido entre equipos o desde/hacia
                almacenamiento, para esta parte deberás:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>
                    <strong>Caracterizar el fluido:</strong> determinar o estimar su densidad,
                    viscosidad y presión de vapor a la temperatura de operación.
                  </li>
                  <li>
                    <strong>Diseñar la línea de tubería:</strong> proponer un diámetro y material,
                    y estimar su longitud y accesorios.
                  </li>
                  <li>
                    <strong>Calcular las pérdidas de presión totales</strong> ($h_L$) en la línea.
                  </li>
                  <li>
                    <strong>Estimar la cabeza total del sistema</strong> que una bomba necesitaría
                    vencer, considerando elevación, presiones en los puntos inicial y final, y $h_L$.
                  </li>
                </ul>
              </InfoCallout>
            </>
          )}

          {isVisible('introduccion') && (
            <>
              <SectionTitle id="introduccion">La operación unitaria silenciosa</SectionTitle>
              <p>
                El transporte de líquidos es una operación unitaria omnipresente y esencial que
                conecta todas las etapas de un proceso industrial — desde la alimentación de
                materias primas hasta la distribución de productos finales. Su diseño eficiente
                y seguro resulta fundamental para la viabilidad económica y operativa de
                cualquier planta. En la industria de hidrocarburos, por ejemplo, las redes de
                ductos pueden extenderse por cientos de kilómetros, y una fracción pequeña de
                ineficiencia se traduce en costos energéticos enormes.
              </p>

              <SubTitle>Objetivos principales del transporte de líquidos</SubTitle>
              <ul>
                <li>Movilizar fluidos entre puntos de almacenamiento, procesamiento y distribución.</li>
                <li>Minimizar los costos energéticos y operativos.</li>
                <li>Garantizar el caudal necesario para las operaciones subsiguientes.</li>
                <li>Mantener la integridad del fluido y del sistema de contención.</li>
              </ul>

              <TipCallout>
                Aunque rara vez es protagonista, el transporte de líquidos es la
                <strong> columna vertebral</strong> de cualquier planta química. Una mala
                selección de diámetro o un trazado descuidado puede encarecer el proyecto y
                limitar su operación durante toda la vida útil.
              </TipCallout>
            </>
          )}

          {isVisible('propiedades') && (
            <>
              <SectionTitle id="propiedades">Propiedades del fluido que rigen el transporte</SectionTitle>
              <p>
                Las características del líquido que se transporta son determinantes para el
                diseño y la operación del sistema. Las tres propiedades críticas son la
                densidad, la viscosidad y la presión de vapor. Usa las pestañas para explorar
                cada una.
              </p>
              <FluidPropertiesTabs />
              <InfoCallout title="📌 Recuerda">
                Densidad, viscosidad y presión de vapor son las <strong>tres propiedades</strong>
                que siempre debes caracterizar antes de diseñar una línea de tubería. Todas
                dependen de la temperatura, así que conocerlas en la condición real de operación
                es indispensable.
              </InfoCallout>
            </>
          )}

          {isVisible('regimen') && (
            <>
              <SectionTitle id="regimen">Reynolds y régimen de flujo</SectionTitle>
              <p>
                El <strong>número de Reynolds</strong> es el parámetro adimensional que
                caracteriza el régimen de flujo. Es la razón entre fuerzas inerciales (que
                tienden a generar turbulencia) y fuerzas viscosas (que la amortiguan):
              </p>
              <p>{'$$\\mathrm{Re} = \\dfrac{\\rho V D}{\\mu} = \\dfrac{V D}{\\nu}$$'}</p>

              <div className="grid sm:grid-cols-3 gap-4 my-6 not-prose">
                <div className="rounded-xl border border-zinc-200 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-emerald-500" />
                    <h4 className="font-semibold text-brand-dark">Laminar</h4>
                  </div>
                  <p className="text-xs text-brand-gray leading-relaxed">
                    {String.raw`$\mathrm{Re} < 2100$`}. Flujo ordenado en capas; perfil parabólico de velocidad.
                    $f$ se calcula analíticamente: {String.raw`$f = 64/\mathrm{Re}$`}.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-amber-500" />
                    <h4 className="font-semibold text-brand-dark">Transición</h4>
                  </div>
                  <p className="text-xs text-brand-gray leading-relaxed">
                    {String.raw`$2100 < \mathrm{Re} < 4000$`}. Comportamiento inestable, difícil de predecir.
                    Evitar en diseño — ajustar $V$ o $D$ para salir de esta zona.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-sky-500" />
                    <h4 className="font-semibold text-brand-dark">Turbulento</h4>
                  </div>
                  <p className="text-xs text-brand-gray leading-relaxed">
                    {String.raw`$\mathrm{Re} > 4000$`}. Mezcla caótica; perfil casi plano. $f$ depende de
                    {String.raw` $\mathrm{Re}$`} y $\varepsilon/D$ — leer de Moody o Colebrook-White.
                  </p>
                </div>
              </div>

              <ReynoldsCalculator />
            </>
          )}

          {isVisible('perdidas') && (
            <>
              <SectionTitle id="perdidas">Pérdidas en tuberías: el precio de mover fluidos</SectionTitle>
              <p>
                Un fluido en movimiento pierde energía por fricción, lo cual se manifiesta como
                caída de presión. El marco general es la <strong>ecuación de Bernoulli modificada</strong>
                entre dos puntos 1 y 2:
              </p>
              <p>{'$$\\dfrac{P_1}{\\rho g} + \\dfrac{\\alpha_1 V_1^2}{2g} + z_1 + h_A = \\dfrac{P_2}{\\rho g} + \\dfrac{\\alpha_2 V_2^2}{2g} + z_2 + h_L$$'}</p>
              <ul>
                <li>$h_A$ — cabeza añadida por bomba (m).</li>
                <li>
                  $h_L = h_f + h_m$ — pérdidas totales (m), suma de <strong>mayores</strong>
                  (fricción en tramos rectos) y <strong>menores</strong> (accesorios).
                </li>
                <li>
                  $\alpha$ — factor de corrección de energía cinética: $\approx 1$ para flujo
                  turbulento; $= 2$ para flujo laminar.
                </li>
              </ul>

              <SubTitle>Pérdidas mayores: Darcy-Weisbach</SubTitle>
              <p>La ecuación de Darcy-Weisbach para tramos rectos:</p>
              <p>{'$$h_f = f \\, \\dfrac{L}{D} \\, \\dfrac{V^2}{2g}$$'}</p>
              <p>
                donde $f$ es el factor de fricción de Darcy, que depende de {String.raw`$\mathrm{Re}$`} y de la
                rugosidad relativa $\varepsilon/D$. En régimen turbulento se obtiene del
                <strong> diagrama de Moody</strong> o resolviendo la <strong>ecuación de
                Colebrook-White</strong>:
              </p>
              <p>{String.raw`$$\dfrac{1}{\sqrt{f}} = -2\,\log_{10}\!\left(\dfrac{\varepsilon/D}{3.7} + \dfrac{2.51}{\mathrm{Re}\,\sqrt{f}}\right)$$`}</p>
              <p className="text-sm text-brand-gray">
                Esta ecuación es <strong>implícita</strong> en $f$ (aparece en los dos lados), por lo que
                requiere iteración. En la práctica se usa el diagrama de Moody o una correlación explícita
                como Swamee-Jain (1976). El diagrama de abajo es interactivo: el objetivo no es que obtengas
                un número, sino que practiques <em>cómo se lee</em>.
              </p>
              <MoodyDiagram />

              <MaterialRoughnessTable />

              <SubTitle>Pérdidas menores: método del coeficiente $K_L$</SubTitle>
              <p>
                Las pérdidas en accesorios (válvulas, codos, tees, cambios de sección) se
                calculan como:
              </p>
              <p>{'$$h_m = \\sum K_L \\, \\dfrac{V^2}{2g}$$'}</p>
              <p>
                Cada accesorio tiene un $K_L$ específico (de tablas o fabricante). Explora los
                tipos principales:
              </p>
              <MinorLossesTabs />

              <TipCallout title="💡 Método alternativo: longitud equivalente">
                Algunos manuales (como Crane TP-410) expresan las pérdidas menores como una
                <strong> longitud equivalente </strong>$L_e$ de tubería recta que generaría la
                misma pérdida que el accesorio. La relación es{' '}
                {String.raw`$L_e/D = K_L / f$`}. Ambos métodos son equivalentes — elige el que
                te resulte más cómodo con la información disponible.
              </TipCallout>
            </>
          )}

          {isVisible('procedimiento') && (
            <>
              <SectionTitle id="procedimiento">Procedimiento de cálculo</SectionTitle>
              <p>
                El cálculo de la cabeza de bomba sigue un procedimiento de 7 pasos. Navega entre
                ellos con las pestañas:
              </p>
              <CalculationStepper />
            </>
          )}

          {isVisible('diseno') && (
            <>
              <SectionTitle id="diseno">Diseño práctico</SectionTitle>
              <p>
                Hasta aquí vimos cómo <em>calcular</em> las pérdidas. Ahora, decisiones prácticas
                que un ingeniero debe tomar al diseñar una línea real.
              </p>

              <SubTitle>Velocidades recomendadas</SubTitle>
              <p>
                La velocidad no se elige arbitrariamente. Velocidades <strong>muy bajas</strong>
                sedimentan sólidos en suspensión y tienen costo de capital alto (tubería ancha);
                velocidades <strong>muy altas</strong> generan pérdidas enormes, erosionan la
                tubería y pueden provocar golpe de ariete.
              </p>
              <div className="overflow-x-auto my-4 not-prose">
                <table className="w-full text-sm border-collapse rounded-lg overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-brand-dark text-white text-left">
                      <th className="px-4 py-2.5 font-semibold">Servicio</th>
                      <th className="px-4 py-2.5 font-semibold">V típica (m/s)</th>
                      <th className="px-4 py-2.5 font-semibold">Notas</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b border-zinc-100">
                      <td className="px-4 py-2.5 text-brand-dark font-medium">Línea de succión de bomba</td>
                      <td className="px-4 py-2.5 font-mono text-brand-dark">0.5 – 1.5</td>
                      <td className="px-4 py-2.5 text-brand-gray text-xs">Baja para evitar cavitación</td>
                    </tr>
                    <tr className="bg-zinc-50 border-b border-zinc-100">
                      <td className="px-4 py-2.5 text-brand-dark font-medium">Línea de descarga de bomba</td>
                      <td className="px-4 py-2.5 font-mono text-brand-dark">1.5 – 3.5</td>
                      <td className="px-4 py-2.5 text-brand-gray text-xs">Balance entre costo y pérdidas</td>
                    </tr>
                    <tr className="bg-white border-b border-zinc-100">
                      <td className="px-4 py-2.5 text-brand-dark font-medium">Líneas de proceso (general)</td>
                      <td className="px-4 py-2.5 font-mono text-brand-dark">1 – 3</td>
                      <td className="px-4 py-2.5 text-brand-gray text-xs">Regla general industrial</td>
                    </tr>
                    <tr className="bg-zinc-50 border-b border-zinc-100">
                      <td className="px-4 py-2.5 text-brand-dark font-medium">Flujo por gravedad</td>
                      <td className="px-4 py-2.5 font-mono text-brand-dark">0.5 – 1.5</td>
                      <td className="px-4 py-2.5 text-brand-gray text-xs">Limitada por cabeza disponible</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-2.5 text-brand-dark font-medium">Líquidos con sólidos en suspensión</td>
                      <td className="px-4 py-2.5 font-mono text-brand-dark">≥ 1.0</td>
                      <td className="px-4 py-2.5 text-brand-gray text-xs">Evitar sedimentación</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <SubTitle>Diámetros nominales y cédulas (SCH)</SubTitle>
              <p>
                Las tuberías industriales se fabrican en <strong>diámetros nominales</strong>
                (NPS, Nominal Pipe Size) estandarizados — NO en diámetros interiores exactos.
                Para un mismo NPS, existen distintas <strong>cédulas</strong> (SCH 40, SCH 80,
                SCH 160) que definen el espesor de pared. A mayor SCH, mayor espesor y mayor
                presión de trabajo, pero menor diámetro interno.
              </p>
              <InfoCallout>
                No confundas <em>diámetro nominal</em> con <em>diámetro interno</em>: una tubería
                NPS 2" SCH 40 tiene {String.raw`$D_\text{int} = 52.5$`} mm; la misma NPS 2" SCH 80 tiene
                {String.raw` $D_\text{int} = 49.2$`} mm. La velocidad y el Reynolds cambian — siempre usa el
                {String.raw` $D_\text{int}$`} real en los cálculos.
              </InfoCallout>

              <SubTitle>Golpe de ariete (<em>water hammer</em>)</SubTitle>
              <p>
                Cuando una válvula cierra súbitamente, la energía cinética del fluido se
                transforma en una onda de presión que viaja por la tubería a la velocidad del
                sonido en el líquido ($\sim 1200$ m/s en agua). La sobrepresión pico está dada
                por la fórmula de Joukowsky:
              </p>
              <p>{'$$\\Delta P = \\rho \\, a \\, \\Delta V$$'}</p>
              <p>
                donde $a$ es la celeridad de la onda y $\Delta V$ es el cambio de velocidad.
                Para agua a 3 m/s: $\Delta P \approx 1000 \times 1200 \times 3 = 3.6$ MPa
                (¡36 bar!). Esto puede reventar la tubería o destruir válvulas y bombas.
              </p>
              <WarningCallout title="⚠️ Mitigación del golpe de ariete">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Cerrar válvulas <strong>lentamente</strong> (tiempos de cierre &gt; $2L/a$).</li>
                  <li>Instalar <strong>cámaras de aire</strong> o <strong>tanques de expansión</strong>.</li>
                  <li>Usar <strong>válvulas de alivio</strong> calibradas a la presión máxima permitida.</li>
                  <li>Diseñar la tubería con un margen de presión ≥ {String.raw`$P_\text{op} + \Delta P_\text{golpe}$`}.</li>
                </ul>
              </WarningCallout>

              <SubTitle>NPSH: Net Positive Suction Head</SubTitle>
              <p>
                El <strong>NPSH</strong> es la cabeza neta positiva de succión — la presión
                absoluta disponible en la entrada de la bomba <em>por encima</em> de la presión
                de vapor del líquido. Se usa para verificar que no habrá cavitación.
              </p>
              <p>{String.raw`$$\text{NPSH}_\text{disp} = \dfrac{P_1 - P_\text{vap}}{\rho g} + z_1 - h_{L,\text{succión}}$$`}</p>
              <p>
                Debe cumplirse {String.raw`$\text{NPSH}_\text{disp} > \text{NPSH}_\text{req}$`} —
                donde {String.raw`$\text{NPSH}_\text{req}$`} lo da el fabricante de la bomba.
                Un margen común de diseño es {String.raw`$\text{NPSH}_\text{disp} \geq \text{NPSH}_\text{req} + 1$ m`}.
              </p>
              <PressureProfile />
            </>
          )}

          {isVisible('ejemplo') && (
            <>
              <SectionTitle id="ejemplo">Ejemplo resuelto</SectionTitle>
              <p>
                Apliquemos todo lo anterior a un caso concreto. Haz clic en <em>Mostrar siguiente
                paso</em> para avanzar — no veas la respuesta de corrido, intenta calcular primero
                y compara.
              </p>
              <WorkedExample />
            </>
          )}

          {isVisible('desafios') && (
            <>
              <SectionTitle id="desafios">Desafíos clave en el diseño</SectionTitle>
              <p>
                Diseñar una línea de transporte no es solamente aplicar ecuaciones: implica
                balancear múltiples criterios de ingeniería, económicos y de operación.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
                <div className="rounded-xl border border-zinc-200 p-5 hover:shadow-md hover:border-brand-yellow transition-all">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">Integridad de ductos</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Selección de materiales para evitar corrosión, y diseño que garantice
                    resistencia a presiones operativas y sobrepresiones (golpes de ariete,
                    transientes).
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5 hover:shadow-md hover:border-brand-yellow transition-all">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">Manejo hidráulico y pérdidas</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Selección óptima de diámetros para equilibrar costos de inversión (tuberías
                    más grandes son más costosas) con operativos (tuberías más grandes generan
                    menos pérdidas y reducen el consumo energético).
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5 hover:shadow-md hover:border-brand-yellow transition-all">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">Variabilidad del fluido</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Evaluación del impacto de cambios de temperatura sobre densidad y viscosidad.
                    Significativo en hidrocarburos pesados; en crudos extrapesados, una caída de
                    20 °C puede triplicar $\mu$.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5 hover:shadow-md hover:border-brand-yellow transition-all">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">Optimización del trazado</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Reducción de longitud total y minimización de accesorios. Un trazado limpio
                    puede ahorrar años de consumo energético.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5 hover:shadow-md hover:border-brand-yellow transition-all">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">Expansión térmica</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Tuberías que cambian de temperatura se dilatan ($\sim 0.012$ mm/m·°C en
                    acero). Absorber con <em>loops</em> de expansión, fuelles o codos
                    estratégicamente ubicados.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5 hover:shadow-md hover:border-brand-yellow transition-all">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">Mantenimiento y drenabilidad</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    La línea debe poderse vaciar, limpiar e inspeccionar. Incluir puntos bajos
                    con drenaje, puntos altos con venteo, y válvulas de aislamiento estratégicas.
                  </p>
                </div>
              </div>

              <InfoCallout title="📌 Criterio de diseño">
                La búsqueda del diámetro óptimo es un clásico problema de
                <strong> trade-off</strong>: aumentar el diámetro reduce las pérdidas (y por tanto
                el costo operativo de bombeo), pero incrementa el costo de inversión. La solución
                se encuentra minimizando el costo total anualizado a lo largo de la vida útil
                del sistema — típicamente 20–30 años.
              </InfoCallout>
            </>
          )}

          {isVisible('bibliografia') && (
            <>
              <SectionTitle id="bibliografia">Bibliografía</SectionTitle>
              <ul className="text-sm text-brand-gray leading-relaxed">
                <li>
                  McCabe, W. L., Smith, J. C., &amp; Harriott, P. (2005).
                  <em> Unit Operations of Chemical Engineering</em> (7th ed.). McGraw-Hill.
                  (Capítulos sobre flujo de fluidos).
                </li>
                <li>
                  Perry, R. H., &amp; Green, D. W. (Eds.). (2019).
                  <em> Perry's Chemical Engineers' Handbook</em> (9th ed.). McGraw-Hill.
                  (Sección "Fluid and Particle Dynamics").
                </li>
                <li>
                  Cengel, Y. A., &amp; Cimbala, J. M. (2018).
                  <em> Fluid Mechanics: Fundamentals and Applications</em> (4th ed.).
                  McGraw-Hill.
                </li>
                <li>
                  Crane Co. (2018). <em>Flow of Fluids Through Valves, Fittings, and Pipe</em>
                  (Technical Paper No. 410). Referencia clásica para $K_L$ y $L_e/D$.
                </li>
                <li>
                  Swamee, P. K. &amp; Jain, A. K. (1976). Explicit equations for pipe-flow
                  problems. <em>Journal of the Hydraulics Division, ASCE</em>, 102(HY5), 657–664.
                </li>
                <li>
                  Moody, L. F. (1944). Friction factors for pipe flow.
                  <em> Transactions of the ASME</em>, 66, 671–684.
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </ReadingLayout>
  );
};

export default TransporteLiquidos;
