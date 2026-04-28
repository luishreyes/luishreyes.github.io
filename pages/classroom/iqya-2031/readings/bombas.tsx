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

const useKatexRerender = (deps: unknown[]) => {
  useEffect(() => {
    // @ts-expect-error
    const rme = window.renderMathInElement;
    if (!rme) return;
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

/* ─── Íconos SVG (Lucide-style, no emojis) ─── */
const Icon: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const IconLightbulb = () => (
  <Icon><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V18h6v-1.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2Z" /></Icon>
);
const IconPin = () => (
  <Icon><path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /><path d="M12 22s7-7.6 7-13a7 7 0 0 0-14 0c0 5.4 7 13 7 13Z" /></Icon>
);
const IconWarn = () => (
  <Icon><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></Icon>
);
const IconBook = () => (
  <Icon><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></Icon>
);

/* ─── Callouts (SVG en lugar de emoji) ─── */
const TipCallout: React.FC<{ title?: string; children: React.ReactNode }> = ({
  title = 'Idea clave',
  children,
}) => (
  <div className="my-6 rounded-xl bg-brand-dark p-5 sm:p-6 not-prose">
    <p className="font-semibold text-brand-yellow text-sm mb-2 flex items-center gap-2">
      <span className="text-base"><IconLightbulb /></span>{title}
    </p>
    <div className="text-sm text-zinc-300 leading-relaxed">{children}</div>
  </div>
);

const InfoCallout: React.FC<{ title?: string; children: React.ReactNode }> = ({
  title = 'Nota',
  children,
}) => (
  <div className="my-6 rounded-xl bg-brand-dark p-5 sm:p-6 not-prose">
    <p className="font-semibold text-emerald-400 text-sm mb-2 flex items-center gap-2">
      <span className="text-base"><IconPin /></span>{title}
    </p>
    <div className="text-sm text-zinc-300 leading-relaxed">{children}</div>
  </div>
);

const WarningCallout: React.FC<{ title?: string; children: React.ReactNode }> = ({
  title = 'Importante',
  children,
}) => (
  <div className="my-6 rounded-xl bg-brand-dark p-5 sm:p-6 not-prose">
    <p className="font-semibold text-red-400 text-sm mb-2 flex items-center gap-2">
      <span className="text-base"><IconWarn /></span>{title}
    </p>
    <div className="text-sm text-zinc-300 leading-relaxed">{children}</div>
  </div>
);

/* ─── Headers ─── */
const SectionTitle: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => (
  <h2 id={id} className="text-2xl font-bold text-brand-dark mt-14 mb-4 scroll-mt-32">
    {children}
  </h2>
);

const SubTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-lg font-semibold text-brand-dark mt-8 mb-3">{children}</h3>
);

/* ─── Figura centrada ─── */
const Figure: React.FC<{
  src: string;
  alt: string;
  caption?: React.ReactNode;
  maxWidth?: string;
}> = ({ src, alt, caption, maxWidth = '700px' }) => (
  <figure className="my-8 not-prose flex flex-col items-center">
    <div className="w-full flex justify-center rounded-xl bg-zinc-50 border border-zinc-200 p-4 sm:p-6">
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

/* ─── TOC ─── */
const tocItems = [
  { id: 'introduccion', label: 'Introducción' },
  { id: 'tipos', label: 'Tipos de bombas' },
  { id: 'curvas', label: 'Curvas características' },
  { id: 'cavitacion', label: 'Cavitación y NPSH' },
  { id: 'potencia', label: 'Potencia de bombeo' },
  { id: 'desafios', label: 'Desafíos clave' },
  { id: 'bibliografia', label: 'Bibliografía' },
];

/* ─── Stepper de tipos de bombas ─── */
type PumpType = {
  id: string;
  family: 'centrifuga' | 'reciprocante' | 'rotatoria';
  name: string;
  image: string;
  description: string;
  features: string[];
  applications: string;
};

const pumpTypes: PumpType[] = [
  {
    id: 'centrifuga',
    family: 'centrifuga',
    name: 'Centrífuga',
    image: '/classroom/iqya-2031/readings/bombas-centrifuga_anim.gif',
    description:
      'Utilizan un impulsor (rodete) provisto de álabes que gira a alta velocidad dentro de una carcasa estacionaria (voluta o difusor). El fluido entra axialmente al ojo del impulsor, es acelerado radialmente por la fuerza centrífuga, y esa energía cinética se convierte parcialmente en energía de presión en la voluta antes de la descarga.',
    features: [
      'Flujo relativamente suave y continuo.',
      'Robustas, de diseño simple y económicas para caudales altos.',
      'Manejan amplio rango de caudales con cabezas moderadas.',
      'Eficiencia varía con el punto de operación.',
      'Sensibles a la viscosidad del fluido (degradación de cabeza y eficiencia).',
      'No son autocebantes (salvo diseños especiales sumergibles o autocebantes).',
    ],
    applications:
      'Bombeo de agua, soluciones acuosas, productos químicos de baja a media viscosidad, hidrocarburos ligeros y medianos, sistemas de enfriamiento, alimentación a calderas (tipos especiales).',
  },
  {
    id: 'piston',
    family: 'reciprocante',
    name: 'Pistón / émbolo',
    image: '/classroom/iqya-2031/readings/bombas-piston.gif',
    description:
      'Reciprocante: un pistón o émbolo se mueve alternativamente (vaivén) dentro de un cilindro, con válvulas de succión y descarga. Pueden generar presiones muy altas.',
    features: [
      'Generan presiones muy altas.',
      'Caudal pulsante (mitigado con cámaras de amortiguación o varios cilindros).',
      'Autocebantes.',
      'Adecuadas para fluidos limpios y sin sólidos.',
    ],
    applications: 'Inyección de químicos, pruebas hidrostáticas, sistemas hidráulicos de alta presión.',
  },
  {
    id: 'diafragma',
    family: 'reciprocante',
    name: 'Diafragma',
    image: '/classroom/iqya-2031/readings/bombas-diafragma.gif',
    description:
      'Reciprocante: un diafragma flexible es accionado mecánica o neumáticamente, aislando el fluido del mecanismo de accionamiento. Buenas para fluidos corrosivos o con sólidos.',
    features: [
      'Aislamiento total entre fluido y mecanismo.',
      'Tolerantes a corrosivos, abrasivos y lodos.',
      'Autocebantes y capaces de operar en seco brevemente.',
      'Caudal pulsante.',
    ],
    applications: 'Bombeo de químicos corrosivos, lodos, dosificación precisa.',
  },
  {
    id: 'tornillo',
    family: 'rotatoria',
    name: 'Tornillo',
    image: '/classroom/iqya-2031/readings/bombas-tornillo.gif',
    description:
      'Rotatoria: uno o más tornillos rotan en una carcasa ajustada, moviendo el fluido axialmente. Adecuadas para altas viscosidades y pueden manejar algunos sólidos.',
    features: [
      'Flujo casi continuo y suave (baja pulsación).',
      'Manejan fluidos muy viscosos y con sólidos blandos.',
      'Bajo cizallamiento (aptas para fluidos sensibles).',
      'Autocebantes.',
    ],
    applications: 'Aceites pesados, polímeros, lodos, alimentos viscosos.',
  },
  {
    id: 'paletas',
    family: 'rotatoria',
    name: 'Paletas (vane)',
    image: '/classroom/iqya-2031/readings/bombas-paletas.gif',
    description:
      'Rotatoria: paletas deslizantes en un rotor excéntrico atrapan y desplazan el fluido entre los álabes y la carcasa.',
    features: [
      'Caudal estable a presión variable.',
      'Buenas para fluidos limpios de baja a media viscosidad.',
      'Autocebantes.',
      'Compactas, bajo costo en su rango.',
    ],
    applications: 'Combustibles, aceites lubricantes, refrigerantes, sistemas hidráulicos ligeros.',
  },
];

const PumpTypesStepper: React.FC = () => {
  const [active, setActive] = useState(0);
  const p = pumpTypes[active];

  const familyLabel: Record<PumpType['family'], string> = {
    centrifuga: 'Cinética',
    reciprocante: 'Desplazamiento positivo · Reciprocante',
    rotatoria: 'Desplazamiento positivo · Rotatoria',
  };

  return (
    <div className="my-8 not-prose">
      <div className="flex flex-wrap gap-2 mb-4" role="tablist">
        {pumpTypes.map((t, i) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              i === active
                ? 'bg-brand-dark text-white border-brand-dark'
                : 'bg-white text-brand-gray border-zinc-300 hover:border-brand-dark hover:text-brand-dark'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-4 flex items-center justify-center min-h-[260px]">
          <img
            src={p.image}
            alt={`Animación de bomba ${p.name.toLowerCase()}`}
            className="block max-w-full h-auto rounded-md shadow-sm"
            style={{ maxHeight: 320 }}
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-brand-yellow-dark mb-1">
            {familyLabel[p.family]}
          </p>
          <h4 className="text-xl font-bold text-brand-dark mb-3">Bomba de {p.name.toLowerCase()}</h4>
          <p className="text-sm text-brand-gray leading-relaxed mb-4">{p.description}</p>

          <p className="text-sm font-semibold text-brand-dark mb-2">Características</p>
          <ul className="list-disc pl-5 text-sm text-brand-gray space-y-1 mb-4">
            {p.features.map((f) => <li key={f}>{f}</li>)}
          </ul>

          <p className="text-sm">
            <span className="font-semibold text-brand-dark">Aplicaciones típicas: </span>
            <span className="text-brand-gray">{p.applications}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

/* ─── Gráfica de curvas características interactiva ─── */
const PumpCurvesChart: React.FC = () => {
  const [Q, setQ] = useState(60); // m³/h

  // Modelo simplificado de bomba centrífuga genérica
  const Qmax = 120; // m³/h
  const Hshut = 50; // m a Q=0
  // H(Q) = Hshut - k*Q²
  const headFn = (q: number) => Hshut - (Hshut / (Qmax * Qmax)) * q * q;
  // η(Q) = parábola con máximo en Qbep
  const Qbep = 70;
  const etaMax = 0.78;
  const etaFn = (q: number) =>
    Math.max(0, etaMax * (1 - Math.pow((q - Qbep) / Qbep, 2)));
  // BHP = ρgQH / η, con ρ=1000, g=9.81, Q en m³/s, H en m → kW (/1000)
  const bhpFn = (q: number) => {
    const eta = Math.max(0.05, etaFn(q));
    const H = Math.max(0.1, headFn(q));
    return (1000 * 9.81 * (q / 3600) * H) / eta / 1000;
  };
  // NPSHr crece con Q
  const npshrFn = (q: number) => 1.5 + 0.0009 * q * q;

  // Curva del sistema: Hsys = Hest + a*Q²
  const Hest = 12;
  const sysCoef = (Hshut - Hest) / (Qbep * Qbep + 100); // intersecta cerca de BEP
  const sysFn = (q: number) => Hest + sysCoef * q * q;

  // Punto de operación (intersección bomba ↔ sistema)
  const Qop = useMemo(() => {
    // Hshut - k*Q² = Hest + sysCoef*Q²
    const k = Hshut / (Qmax * Qmax);
    const q2 = (Hshut - Hest) / (k + sysCoef);
    return Math.sqrt(Math.max(0, q2));
  }, []);
  const Hop = headFn(Qop);

  const W = 600;
  const H = 360;
  const margin = { top: 20, right: 70, bottom: 50, left: 60 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  const xScale = (q: number) => margin.left + (q / Qmax) * plotW;
  const yLeftScale = (h: number) => margin.top + plotH - (h / 60) * plotH; // 0..60 m
  const yRightScale = (e: number) => margin.top + plotH - (e / 1) * plotH; // 0..1

  const headPath = useMemo(() => {
    const pts: string[] = [];
    for (let q = 0; q <= Qmax; q += 4) {
      pts.push(`${q === 0 ? 'M' : 'L'}${xScale(q).toFixed(1)} ${yLeftScale(headFn(q)).toFixed(1)}`);
    }
    return pts.join(' ');
  }, []);
  const etaPath = useMemo(() => {
    const pts: string[] = [];
    for (let q = 0; q <= Qmax; q += 4) {
      pts.push(`${q === 0 ? 'M' : 'L'}${xScale(q).toFixed(1)} ${yRightScale(etaFn(q)).toFixed(1)}`);
    }
    return pts.join(' ');
  }, []);
  const npshPath = useMemo(() => {
    const pts: string[] = [];
    for (let q = 0; q <= Qmax; q += 4) {
      pts.push(`${q === 0 ? 'M' : 'L'}${xScale(q).toFixed(1)} ${yLeftScale(npshrFn(q)).toFixed(1)}`);
    }
    return pts.join(' ');
  }, []);
  const sysPath = useMemo(() => {
    const pts: string[] = [];
    for (let q = 0; q <= Qmax; q += 4) {
      pts.push(`${q === 0 ? 'M' : 'L'}${xScale(q).toFixed(1)} ${yLeftScale(sysFn(q)).toFixed(1)}`);
    }
    return pts.join(' ');
  }, []);

  const xTicks = [0, 20, 40, 60, 80, 100, 120];
  const yLeftTicks = [0, 10, 20, 30, 40, 50, 60];
  const yRightTicks = [0, 0.2, 0.4, 0.6, 0.8, 1];

  return (
    <div className="my-6 not-prose">
      <div className="rounded-xl bg-white border border-zinc-200 p-4 sm:p-6 shadow-sm">
        <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
          <h4 className="text-base font-semibold text-brand-dark">Curvas características de una bomba centrífuga</h4>
          <div className="text-sm text-brand-gray">
            Caudal: <span className="font-mono text-brand-dark font-semibold">{Q.toFixed(0)} m³/h</span>
          </div>
        </div>

        <div className="flex justify-center">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[680px]" role="img" aria-label="Curvas características">
            <rect x={margin.left} y={margin.top} width={plotW} height={plotH} fill="#fafafa" />

            {yLeftTicks.map((v) => {
              const y = yLeftScale(v);
              return (
                <g key={`yl-${v}`}>
                  <line x1={margin.left} y1={y} x2={margin.left + plotW} y2={y} stroke="#e4e4e7" strokeWidth="0.5" strokeDasharray="2 2" />
                  <text x={margin.left - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#52525b">{v}</text>
                </g>
              );
            })}
            {yRightTicks.map((v) => {
              const y = yRightScale(v);
              return (
                <text key={`yr-${v}`} x={margin.left + plotW + 8} y={y + 4} textAnchor="start" fontSize="11" fill="#52525b">
                  {v.toFixed(1)}
                </text>
              );
            })}
            {xTicks.map((t) => {
              const x = xScale(t);
              return (
                <g key={`x-${t}`}>
                  <line x1={x} y1={margin.top} x2={x} y2={margin.top + plotH} stroke="#e4e4e7" strokeWidth="0.5" strokeDasharray="2 2" />
                  <text x={x} y={margin.top + plotH + 18} textAnchor="middle" fontSize="11" fill="#52525b">{t}</text>
                </g>
              );
            })}

            <line x1={margin.left} y1={margin.top + plotH} x2={margin.left + plotW} y2={margin.top + plotH} stroke="#27272a" strokeWidth="1.2" />
            <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + plotH} stroke="#27272a" strokeWidth="1.2" />
            <line x1={margin.left + plotW} y1={margin.top} x2={margin.left + plotW} y2={margin.top + plotH} stroke="#27272a" strokeWidth="1.2" />

            <text x={margin.left + plotW / 2} y={H - 8} textAnchor="middle" fontSize="12" fill="#27272a" fontWeight="600">
              Caudal Q (m³/h)
            </text>
            <text x="14" y={margin.top + plotH / 2} textAnchor="middle" fontSize="12" fill="#27272a" fontWeight="600"
              transform={`rotate(-90 14 ${margin.top + plotH / 2})`}>
              Cabeza H (m), NPSHr (m)
            </text>
            <text x={W - 14} y={margin.top + plotH / 2} textAnchor="middle" fontSize="12" fill="#27272a" fontWeight="600"
              transform={`rotate(90 ${W - 14} ${margin.top + plotH / 2})`}>
              Eficiencia η
            </text>

            <path d={headPath} stroke="#1d4ed8" strokeWidth="2.5" fill="none" />
            <path d={sysPath} stroke="#16a34a" strokeWidth="2.5" fill="none" strokeDasharray="6 3" />
            <path d={etaPath} stroke="#b45309" strokeWidth="2.5" fill="none" />
            <path d={npshPath} stroke="#7f1d1d" strokeWidth="2.5" fill="none" strokeDasharray="3 3" />

            {/* Punto de operación */}
            <circle cx={xScale(Qop)} cy={yLeftScale(Hop)} r="6" fill="#FFBF00" stroke="#1A1A1A" strokeWidth="1.5" />
            <text x={xScale(Qop) + 10} y={yLeftScale(Hop) - 8} fontSize="11" fill="#1A1A1A" fontWeight="700">
              Punto de operación
            </text>

            {/* BEP */}
            <circle cx={xScale(Qbep)} cy={yRightScale(etaMax)} r="5" fill="#b45309" stroke="white" strokeWidth="1.5" />
            <text x={xScale(Qbep)} y={yRightScale(etaMax) - 10} textAnchor="middle" fontSize="10" fill="#b45309" fontWeight="700">BEP</text>

            {/* Cursor */}
            <line x1={xScale(Q)} y1={margin.top} x2={xScale(Q)} y2={margin.top + plotH} stroke="#1A1A1A" strokeWidth="1.2" strokeDasharray="4 2" opacity="0.7" />
            <circle cx={xScale(Q)} cy={yLeftScale(headFn(Q))} r="4" fill="#1d4ed8" stroke="white" strokeWidth="1.5" />
            <circle cx={xScale(Q)} cy={yRightScale(etaFn(Q))} r="4" fill="#b45309" stroke="white" strokeWidth="1.5" />
            <circle cx={xScale(Q)} cy={yLeftScale(npshrFn(Q))} r="4" fill="#7f1d1d" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>

        <input
          type="range"
          min={0}
          max={Qmax}
          step={1}
          value={Q}
          onChange={(e) => setQ(parseFloat(e.target.value))}
          className="w-full mt-3 accent-brand-yellow-dark"
          aria-label="Caudal de operación"
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-sm">
          <div className="rounded-lg bg-zinc-50 p-3 border border-zinc-200">
            <div className="text-xs text-brand-gray uppercase">Cabeza H</div>
            <div className="font-mono font-semibold text-blue-700">{headFn(Q).toFixed(1)} m</div>
          </div>
          <div className="rounded-lg bg-zinc-50 p-3 border border-zinc-200">
            <div className="text-xs text-brand-gray uppercase">Eficiencia η</div>
            <div className="font-mono font-semibold" style={{ color: '#b45309' }}>{(etaFn(Q) * 100).toFixed(0)} %</div>
          </div>
          <div className="rounded-lg bg-zinc-50 p-3 border border-zinc-200">
            <div className="text-xs text-brand-gray uppercase">BHP</div>
            <div className="font-mono font-semibold text-brand-dark">{bhpFn(Q).toFixed(1)} kW</div>
          </div>
          <div className="rounded-lg bg-zinc-50 p-3 border border-zinc-200">
            <div className="text-xs text-brand-gray uppercase">NPSHr</div>
            <div className="font-mono font-semibold" style={{ color: '#7f1d1d' }}>{npshrFn(Q).toFixed(1)} m</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-brand-gray mt-3 justify-center">
          <span><span className="inline-block w-4 h-0.5 bg-blue-700 align-middle mr-1.5" />Cabeza bomba</span>
          <span><span className="inline-block w-4 h-0.5 align-middle mr-1.5" style={{ background: 'repeating-linear-gradient(90deg,#16a34a 0 4px,transparent 4px 7px)' }} />Curva del sistema</span>
          <span><span className="inline-block w-4 h-0.5 align-middle mr-1.5" style={{ backgroundColor: '#b45309' }} />Eficiencia</span>
          <span><span className="inline-block w-4 h-0.5 align-middle mr-1.5" style={{ background: 'repeating-linear-gradient(90deg,#7f1d1d 0 2px,transparent 2px 5px)' }} />NPSHr</span>
        </div>

        <p className="text-xs text-brand-gray text-center mt-2">
          El punto de operación es la intersección de la curva H–Q de la bomba con la curva del sistema. Lo deseable es que coincida (o esté cerca) del BEP.
        </p>
      </div>
    </div>
  );
};

/* ─── Calculadora NPSH ─── */
const NPSHCalculator: React.FC = () => {
  const [Ptank, setPtank] = useState(101.3); // kPa abs
  const [zNet, setZNet] = useState(2.0); // m (positivo si tanque arriba de bomba)
  const [hL, setHL] = useState(1.5); // m de pérdidas en succión
  const [Pvap, setPvap] = useState(2.34); // kPa abs (agua a 20 °C)
  const [npshR, setNpshR] = useState(3.5); // m

  const rho = 1000;
  const g = 9.81;
  const head = (kPa: number) => (kPa * 1000) / (rho * g); // m

  const NPSHa = head(Ptank) + zNet - hL - head(Pvap);
  const margen = NPSHa - npshR;
  const ok = margen >= 0.5;

  const Field: React.FC<{ label: string; value: number; setter: (v: number) => void; min: number; max: number; step: number; unit: string }> =
    ({ label, value, setter, min, max, step, unit }) => (
      <label className="block">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-brand-gray">{label}</span>
          <span className="font-mono font-semibold text-brand-dark">{value.toFixed(2)} {unit}</span>
        </div>
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => setter(parseFloat(e.target.value))}
          className="w-full accent-brand-yellow-dark"
        />
      </label>
    );

  return (
    <div className="my-8 not-prose">
      <div className="rounded-xl bg-white border border-zinc-200 p-5 sm:p-6 shadow-sm">
        <h4 className="text-base font-semibold text-brand-dark mb-4">Calculadora interactiva de NPSH disponible</h4>
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-3">
          <Field label="Presión sobre el líquido (P_tanque)" value={Ptank} setter={setPtank} min={20} max={500} step={0.1} unit="kPa" />
          <Field label="Diferencia de elevación (z_tanque − z_bomba)" value={zNet} setter={setZNet} min={-8} max={10} step={0.1} unit="m" />
          <Field label="Pérdidas en succión (h_L)" value={hL} setter={setHL} min={0} max={8} step={0.1} unit="m" />
          <Field label="Presión de vapor (P_vap)" value={Pvap} setter={setPvap} min={0.5} max={150} step={0.1} unit="kPa" />
          <Field label="NPSH requerido por la bomba" value={npshR} setter={setNpshR} min={0.5} max={10} step={0.1} unit="m" />
        </div>

        <div className="mt-5 grid sm:grid-cols-3 gap-3">
          <div className="rounded-lg bg-zinc-50 p-3 border border-zinc-200">
            <div className="text-xs text-brand-gray uppercase">NPSH disponible</div>
            <div className="font-mono text-lg font-semibold text-brand-dark">{NPSHa.toFixed(2)} m</div>
          </div>
          <div className="rounded-lg bg-zinc-50 p-3 border border-zinc-200">
            <div className="text-xs text-brand-gray uppercase">Margen (NPSHa − NPSHr)</div>
            <div className={`font-mono text-lg font-semibold ${margen >= 0.5 ? 'text-emerald-600' : margen >= 0 ? 'text-amber-600' : 'text-red-600'}`}>
              {margen >= 0 ? '+' : ''}{margen.toFixed(2)} m
            </div>
          </div>
          <div className={`rounded-lg p-3 border ${ok ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            <div className="text-xs uppercase font-semibold" style={{ color: ok ? '#047857' : '#b91c1c' }}>
              {ok ? 'Operación segura' : margen >= 0 ? 'Margen insuficiente' : 'Cavitación inminente'}
            </div>
            <div className="text-xs text-brand-gray mt-0.5">
              {ok
                ? 'NPSHa supera al NPSHr en al menos 0,5 m.'
                : margen >= 0
                ? 'NPSHa apenas supera al NPSHr — bomba propensa a cavitar.'
                : 'NPSHa por debajo del NPSHr — habrá cavitación.'}
            </div>
          </div>
        </div>

        <p className="text-xs text-brand-gray mt-3 italic">
          {String.raw`Modelo simplificado con $\rho = 1000$ kg/m³ y $g = 9{,}81$ m/s². Para fluidos distintos al agua, ajusta $\rho$ y $P_{\text{vap}}$ a la temperatura de operación.`}
        </p>
      </div>
    </div>
  );
};

/* ─── Calculadora de potencia de bombeo ─── */
const PowerCalculator: React.FC = () => {
  const [Q, setQ] = useState(50); // m³/h
  const [H, setH] = useState(35); // m
  const [rho, setRho] = useState(1000); // kg/m³
  const [eta, setEta] = useState(0.7);
  const [etaMotor, setEtaMotor] = useState(0.92);

  const g = 9.81;
  const Q_si = Q / 3600; // m³/s
  const Ph = rho * g * Q_si * H; // W
  const BHP = Ph / Math.max(0.05, eta);
  const Pelec = BHP / Math.max(0.05, etaMotor);

  return (
    <div className="my-8 not-prose">
      <div className="rounded-xl bg-white border border-zinc-200 p-5 sm:p-6 shadow-sm">
        <h4 className="text-base font-semibold text-brand-dark mb-4">Calculadora de potencia</h4>
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-3">
          <label className="block">
            <div className="flex justify-between text-xs mb-1"><span className="text-brand-gray">Caudal Q</span><span className="font-mono font-semibold">{Q.toFixed(0)} m³/h</span></div>
            <input type="range" min={1} max={500} step={1} value={Q} onChange={(e) => setQ(+e.target.value)} className="w-full accent-brand-yellow-dark" />
          </label>
          <label className="block">
            <div className="flex justify-between text-xs mb-1"><span className="text-brand-gray">Cabeza total H</span><span className="font-mono font-semibold">{H.toFixed(0)} m</span></div>
            <input type="range" min={1} max={200} step={1} value={H} onChange={(e) => setH(+e.target.value)} className="w-full accent-brand-yellow-dark" />
          </label>
          <label className="block">
            <div className="flex justify-between text-xs mb-1"><span className="text-brand-gray">Densidad ρ</span><span className="font-mono font-semibold">{rho.toFixed(0)} kg/m³</span></div>
            <input type="range" min={600} max={1600} step={10} value={rho} onChange={(e) => setRho(+e.target.value)} className="w-full accent-brand-yellow-dark" />
          </label>
          <label className="block">
            <div className="flex justify-between text-xs mb-1"><span className="text-brand-gray">Eficiencia bomba η</span><span className="font-mono font-semibold">{(eta * 100).toFixed(0)} %</span></div>
            <input type="range" min={0.3} max={0.9} step={0.01} value={eta} onChange={(e) => setEta(+e.target.value)} className="w-full accent-brand-yellow-dark" />
          </label>
          <label className="block">
            <div className="flex justify-between text-xs mb-1"><span className="text-brand-gray">Eficiencia motor η_m</span><span className="font-mono font-semibold">{(etaMotor * 100).toFixed(0)} %</span></div>
            <input type="range" min={0.7} max={0.97} step={0.01} value={etaMotor} onChange={(e) => setEtaMotor(+e.target.value)} className="w-full accent-brand-yellow-dark" />
          </label>
        </div>

        <div className="mt-5 grid sm:grid-cols-3 gap-3 text-sm">
          <div className="rounded-lg bg-zinc-50 p-3 border border-zinc-200">
            <div className="text-xs text-brand-gray uppercase">Potencia hidráulica P_h</div>
            <div className="font-mono text-lg font-semibold text-brand-dark">{(Ph / 1000).toFixed(2)} kW</div>
          </div>
          <div className="rounded-lg bg-zinc-50 p-3 border border-zinc-200">
            <div className="text-xs text-brand-gray uppercase">Potencia al freno (BHP)</div>
            <div className="font-mono text-lg font-semibold text-brand-dark">{(BHP / 1000).toFixed(2)} kW</div>
          </div>
          <div className="rounded-lg bg-yellow-50 p-3 border border-yellow-200">
            <div className="text-xs uppercase font-semibold text-brand-yellow-dark">Potencia eléctrica</div>
            <div className="font-mono text-lg font-semibold text-brand-dark">{(Pelec / 1000).toFixed(2)} kW</div>
            <div className="text-xs text-brand-gray">≈ {(Pelec / 1000 * 1.341).toFixed(1)} HP</div>
          </div>
        </div>

        <p className="text-xs text-brand-gray mt-3 italic">
          {String.raw`$P_h = \rho g Q H$, $\text{BHP} = P_h / \eta_{\text{bomba}}$, $P_{\text{eléctrica}} = \text{BHP} / \eta_{\text{motor}}$. Para selección comercial añadir un factor de servicio típico de 1,15–1,25.`}
        </p>
      </div>
    </div>
  );
};

/* ─── Selector interactivo Centrífuga vs DP ─── */
type PumpFamily = {
  id: string;
  name: string;
  group: 'centrifuga' | 'dp';
  qRange: [number, number];   // m³/h
  hRange: [number, number];   // m
  muMax: number;              // cP (a partir de aquí se degrada)
  solids: boolean;
  pulsates: boolean;
  color: string;
};

const families: PumpFamily[] = [
  { id: 'centrifuga', name: 'Centrífuga',           group: 'centrifuga', qRange: [3, 2000], hRange: [3, 300],  muMax: 500,    solids: false, pulsates: false, color: '#1d4ed8' },
  { id: 'piston',     name: 'Pistón / émbolo',      group: 'dp',         qRange: [0.1, 100], hRange: [20, 2000], muMax: 50000, solids: false, pulsates: true,  color: '#7f1d1d' },
  { id: 'diafragma',  name: 'Diafragma',            group: 'dp',         qRange: [0.1, 50],  hRange: [1, 200],   muMax: 20000, solids: true,  pulsates: true,  color: '#b45309' },
  { id: 'tornillo',   name: 'Tornillo',             group: 'dp',         qRange: [0.5, 500], hRange: [1, 150],   muMax: 100000, solids: true, pulsates: false, color: '#15803d' },
  { id: 'engranajes', name: 'Engranajes',           group: 'dp',         qRange: [0.1, 100], hRange: [1, 200],   muMax: 20000, solids: false, pulsates: true,  color: '#9333ea' },
  { id: 'lobulos',    name: 'Lóbulos',              group: 'dp',         qRange: [1, 300],   hRange: [1, 100],   muMax: 50000, solids: true,  pulsates: true,  color: '#0e7490' },
];

const PumpSelector: React.FC = () => {
  const [Q, setQ] = useState(50);   // m³/h
  const [H, setH] = useState(40);   // m
  const [mu, setMu] = useState(1);  // cP
  const [solids, setSolids] = useState(false);
  const [needsSmooth, setNeedsSmooth] = useState(false);

  const evaluate = (f: PumpFamily) => {
    const reasons: string[] = [];
    let ok = true;
    if (Q < f.qRange[0] || Q > f.qRange[1]) {
      ok = false;
      reasons.push(`Q fuera de rango (${f.qRange[0]}–${f.qRange[1]} m³/h)`);
    }
    if (H < f.hRange[0] || H > f.hRange[1]) {
      ok = false;
      reasons.push(`H fuera de rango (${f.hRange[0]}–${f.hRange[1]} m)`);
    }
    if (mu > f.muMax) {
      ok = false;
      reasons.push(`viscosidad excesiva (máx ${f.muMax} cP)`);
    }
    if (solids && !f.solids) {
      ok = false;
      reasons.push('no tolera sólidos');
    }
    if (needsSmooth && f.pulsates) {
      ok = false;
      reasons.push('flujo pulsante');
    }
    // marginal si está cerca de los bordes
    let marginal = false;
    if (ok) {
      const nearQEdge = Q < f.qRange[0] * 1.5 || Q > f.qRange[1] * 0.7;
      const nearHEdge = H < f.hRange[0] * 1.5 || H > f.hRange[1] * 0.7;
      const nearMu = mu > f.muMax * 0.5;
      if (nearQEdge || nearHEdge || nearMu) {
        marginal = true;
        if (nearMu) reasons.push('viscosidad cercana al límite');
      }
    }
    return { ok, marginal, reasons };
  };

  const evaluations = families.map((f) => ({ family: f, ...evaluate(f) }));
  const recommended = evaluations.filter((e) => e.ok && !e.marginal);
  const marginalList = evaluations.filter((e) => e.ok && e.marginal);
  const excluded = evaluations.filter((e) => !e.ok);

  // Mapa Q-H log-log
  const W = 560;
  const HSVG = 380;
  const margin = { top: 20, right: 20, bottom: 50, left: 60 };
  const plotW = W - margin.left - margin.right;
  const plotH = HSVG - margin.top - margin.bottom;
  const qMin = 0.1, qMax = 3000;
  const hMin = 0.5, hMax = 3000;
  const xScale = (q: number) =>
    margin.left + ((Math.log10(Math.max(qMin, q)) - Math.log10(qMin)) / (Math.log10(qMax) - Math.log10(qMin))) * plotW;
  const yScale = (h: number) =>
    margin.top + plotH - ((Math.log10(Math.max(hMin, h)) - Math.log10(hMin)) / (Math.log10(hMax) - Math.log10(hMin))) * plotH;

  const xTicks = [0.1, 1, 10, 100, 1000];
  const yTicks = [1, 10, 100, 1000];

  return (
    <div className="my-8 not-prose">
      <div className="rounded-xl bg-white border border-zinc-200 p-5 sm:p-6 shadow-sm">
        <h4 className="text-base font-semibold text-brand-dark mb-1">Selector visual de bomba</h4>
        <p className="text-sm text-brand-gray mb-4">
          Mueve los controles para ver qué familias de bomba caben en tu punto de operación. El
          rectángulo de cada familia es su rango típico publicado por fabricantes (orientativo).
        </p>

        <div className="grid lg:grid-cols-[1fr_280px] gap-6">
          {/* Mapa Q-H */}
          <div>
            <svg viewBox={`0 0 ${W} ${HSVG}`} className="w-full" role="img" aria-label="Mapa de selección de bomba (Q vs H)">
              <rect x={margin.left} y={margin.top} width={plotW} height={plotH} fill="#fafafa" />

              {/* Gridlines */}
              {xTicks.map((t) => {
                const x = xScale(t);
                return (
                  <g key={`x-${t}`}>
                    <line x1={x} y1={margin.top} x2={x} y2={margin.top + plotH} stroke="#e4e4e7" strokeWidth="0.5" strokeDasharray="2 2" />
                    <text x={x} y={margin.top + plotH + 18} textAnchor="middle" fontSize="11" fill="#52525b">{t < 1 ? t : t.toFixed(0)}</text>
                  </g>
                );
              })}
              {yTicks.map((t) => {
                const y = yScale(t);
                return (
                  <g key={`y-${t}`}>
                    <line x1={margin.left} y1={y} x2={margin.left + plotW} y2={y} stroke="#e4e4e7" strokeWidth="0.5" strokeDasharray="2 2" />
                    <text x={margin.left - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#52525b">{t}</text>
                  </g>
                );
              })}

              {/* Family rectangles */}
              {families.map((f) => {
                const ev = evaluate(f);
                const x1 = xScale(f.qRange[0]);
                const x2 = xScale(f.qRange[1]);
                const y1 = yScale(f.hRange[1]);
                const y2 = yScale(f.hRange[0]);
                const dim = !ev.ok;
                return (
                  <g key={f.id}>
                    <rect
                      x={x1} y={y1}
                      width={x2 - x1} height={y2 - y1}
                      fill={f.color}
                      fillOpacity={dim ? 0.06 : 0.16}
                      stroke={f.color}
                      strokeOpacity={dim ? 0.25 : 0.85}
                      strokeWidth={dim ? 1 : 1.6}
                      strokeDasharray={dim ? '4 3' : '0'}
                    />
                    <text
                      x={(x1 + x2) / 2}
                      y={y1 + 14}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="700"
                      fill={f.color}
                      opacity={dim ? 0.4 : 0.95}
                    >
                      {f.name}
                    </text>
                  </g>
                );
              })}

              {/* Axis lines */}
              <line x1={margin.left} y1={margin.top + plotH} x2={margin.left + plotW} y2={margin.top + plotH} stroke="#27272a" strokeWidth="1.2" />
              <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + plotH} stroke="#27272a" strokeWidth="1.2" />

              {/* Axis labels */}
              <text x={margin.left + plotW / 2} y={HSVG - 8} textAnchor="middle" fontSize="12" fill="#27272a" fontWeight="600">
                Caudal Q (m³/h, escala log)
              </text>
              <text x="14" y={margin.top + plotH / 2} textAnchor="middle" fontSize="12" fill="#27272a" fontWeight="600"
                transform={`rotate(-90 14 ${margin.top + plotH / 2})`}>
                Cabeza H (m, escala log)
              </text>

              {/* User point */}
              <line x1={xScale(Q)} y1={margin.top} x2={xScale(Q)} y2={margin.top + plotH} stroke="#1A1A1A" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
              <line x1={margin.left} y1={yScale(H)} x2={margin.left + plotW} y2={yScale(H)} stroke="#1A1A1A" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
              <circle cx={xScale(Q)} cy={yScale(H)} r="8" fill="#FFBF00" stroke="#1A1A1A" strokeWidth="2" />
            </svg>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <label className="block">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-brand-gray">Caudal Q</span>
                <span className="font-mono font-semibold text-brand-dark">{Q < 10 ? Q.toFixed(1) : Q.toFixed(0)} m³/h</span>
              </div>
              <input type="range" min={-1} max={3.3} step={0.05}
                value={Math.log10(Q)}
                onChange={(e) => setQ(Math.pow(10, parseFloat(e.target.value)))}
                className="w-full accent-brand-yellow-dark" />
            </label>

            <label className="block">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-brand-gray">Cabeza H</span>
                <span className="font-mono font-semibold text-brand-dark">{H < 10 ? H.toFixed(1) : H.toFixed(0)} m</span>
              </div>
              <input type="range" min={0} max={3.3} step={0.05}
                value={Math.log10(H)}
                onChange={(e) => setH(Math.pow(10, parseFloat(e.target.value)))}
                className="w-full accent-brand-yellow-dark" />
            </label>

            <label className="block">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-brand-gray">Viscosidad μ</span>
                <span className="font-mono font-semibold text-brand-dark">{mu < 10 ? mu.toFixed(1) : mu.toFixed(0)} cP</span>
              </div>
              <input type="range" min={0} max={5} step={0.05}
                value={Math.log10(mu)}
                onChange={(e) => setMu(Math.pow(10, parseFloat(e.target.value)))}
                className="w-full accent-brand-yellow-dark" />
              <div className="flex justify-between text-[10px] text-brand-gray mt-0.5">
                <span>agua</span><span>aceite</span><span>melaza</span><span>brea</span>
              </div>
            </label>

            <div className="flex flex-col gap-2 pt-2 border-t border-zinc-200">
              <label className="flex items-center gap-2 text-sm text-brand-dark cursor-pointer">
                <input type="checkbox" checked={solids} onChange={(e) => setSolids(e.target.checked)}
                  className="accent-brand-yellow-dark" />
                Fluido con sólidos en suspensión
              </label>
              <label className="flex items-center gap-2 text-sm text-brand-dark cursor-pointer">
                <input type="checkbox" checked={needsSmooth} onChange={(e) => setNeedsSmooth(e.target.checked)}
                  className="accent-brand-yellow-dark" />
                Se requiere flujo sin pulsaciones
              </label>
            </div>

            {/* Presets */}
            <div className="pt-2 border-t border-zinc-200">
              <p className="text-xs text-brand-gray mb-1.5 font-semibold uppercase">Casos típicos</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: 'Agua de proceso', Q: 80, H: 35, mu: 1, solids: false, smooth: false },
                  { name: 'Crudo viscoso', Q: 25, H: 80, mu: 5000, solids: false, smooth: false },
                  { name: 'Dosificación química', Q: 0.5, H: 60, mu: 5, solids: false, smooth: false },
                  { name: 'Lodos', Q: 8, H: 20, mu: 200, solids: true, smooth: false },
                  { name: 'Inyección de pozo', Q: 15, H: 800, mu: 10, solids: false, smooth: false },
                ].map((p) => (
                  <button
                    key={p.name}
                    onClick={() => { setQ(p.Q); setH(p.H); setMu(p.mu); setSolids(p.solids); setNeedsSmooth(p.smooth); }}
                    className="px-2 py-1 text-xs rounded-md bg-zinc-50 border border-zinc-200 text-brand-gray hover:bg-yellow-50 hover:border-brand-yellow hover:text-brand-dark transition-colors"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recomendación */}
        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          <div className={`rounded-lg p-3 border ${recommended.length ? 'bg-emerald-50 border-emerald-200' : 'bg-zinc-50 border-zinc-200'}`}>
            <div className="text-xs uppercase font-semibold text-emerald-700 mb-1">Recomendadas</div>
            {recommended.length === 0 ? (
              <div className="text-sm text-brand-gray italic">Ninguna familia entra en su rango óptimo. Revisa los rangos marginales.</div>
            ) : (
              <ul className="text-sm text-brand-dark space-y-0.5">
                {recommended.map((e) => (
                  <li key={e.family.id} className="flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: e.family.color }} />
                    {e.family.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={`rounded-lg p-3 border ${marginalList.length ? 'bg-amber-50 border-amber-200' : 'bg-zinc-50 border-zinc-200'}`}>
            <div className="text-xs uppercase font-semibold text-amber-700 mb-1">Marginales</div>
            {marginalList.length === 0 ? (
              <div className="text-sm text-brand-gray italic">—</div>
            ) : (
              <ul className="text-sm text-brand-dark space-y-0.5">
                {marginalList.map((e) => (
                  <li key={e.family.id} className="flex flex-col">
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: e.family.color }} />
                      {e.family.name}
                    </span>
                    {e.reasons.length > 0 && (
                      <span className="text-xs text-brand-gray ml-3.5">{e.reasons.join('; ')}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-lg p-3 border bg-red-50 border-red-200">
            <div className="text-xs uppercase font-semibold text-red-700 mb-1">Excluidas</div>
            {excluded.length === 0 ? (
              <div className="text-sm text-brand-gray italic">—</div>
            ) : (
              <ul className="text-sm text-brand-dark space-y-0.5">
                {excluded.map((e) => (
                  <li key={e.family.id} className="flex flex-col">
                    <span className="flex items-center gap-1.5 opacity-70">
                      <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: e.family.color }} />
                      {e.family.name}
                    </span>
                    <span className="text-xs text-brand-gray ml-3.5">{e.reasons[0]}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <p className="text-xs text-brand-gray mt-3 italic">
          Los rangos son orientativos: cada fabricante publica el mapa exacto de sus modelos. La
          decisión final también pondera costo, mantenimiento, seguridad y disponibilidad de repuestos.
        </p>
      </div>
    </div>
  );
};

/* ─── Componente principal ─── */
const Bombas: React.FC = () => {
  const course = getCourseBySlug('iqya-2031');
  if (!course) return null;
  const reading = course.readings.find((r) => r.slug === 'bombas');
  if (!reading) return null;

  useKatex();

  const [tocOpen, setTocOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
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
                Esta lectura es la continuación natural de <em>Transporte de líquidos</em>. Una vez
                conocemos las propiedades del fluido, las pérdidas en la tubería y la cabeza total
                que el sistema demanda, llega el turno del equipo que <strong>aporta la energía</strong>:
                la bomba. Aquí veremos los grandes tipos de bombas, cómo se leen sus curvas de
                rendimiento, qué es la cavitación y cómo evitarla con el NPSH, y cómo se calcula la
                potencia eléctrica que el motor debe entregar.
              </p>

              <Figure
                src="/classroom/iqya-2031/readings/bombas-centrifuga_b.png"
                alt="Bomba centrífuga industrial con motor acoplado"
                caption="Bomba centrífuga industrial — el caballo de batalla del transporte de líquidos en plantas químicas y refinerías."
                maxWidth="720px"
              />

              <InfoCallout title="Aplicación al proyecto del curso">
                Continuando con el diseño del sistema de transporte de líquidos:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>
                    Con la cabeza total del sistema calculada en la lectura previa, <strong>seleccionar
                    un tipo de bomba</strong> (centrífuga o de desplazamiento positivo) justificando la
                    elección en función del fluido y las condiciones de operación.
                  </li>
                  <li>
                    Usando curvas características (genéricas, de catálogo o las del curso),
                    <strong> determinar un modelo o tamaño</strong> que cumpla con el caudal y la cabeza
                    requeridos.
                  </li>
                  <li>
                    Identificar el <strong>punto de operación</strong>, la eficiencia $\eta$ y el
                    {' '}<strong>NPSH requerido</strong> en dicho punto.
                  </li>
                  <li>
                    Calcular el <strong>NPSH disponible</strong> de la succión y verificar que supere al
                    requerido con margen de seguridad.
                  </li>
                  <li>
                    Estimar la <strong>potencia al freno (BHP)</strong> y seleccionar un motor eléctrico
                    comercial considerando un factor de servicio.
                  </li>
                </ul>
              </InfoCallout>
            </>
          )}

          {isVisible('introduccion') && (
            <>
              <SectionTitle id="introduccion">El corazón del sistema de transporte</SectionTitle>
              <p>
                Las bombas son dispositivos mecánicos que <strong>transfieren energía a un fluido</strong>
                {' '}para aumentar su presión y/o producir flujo. Son indispensables en la gran mayoría
                de procesos industriales: desde el suministro de agua hasta el bombeo de productos
                químicos complejos o hidrocarburos a través de extensos ductos.
              </p>
              <p>
                Un sistema de transporte de líquidos sin la bomba correcta es como un cuerpo sin
                corazón: la tubería puede ser perfecta, pero si no hay quien empuje el fluido, no
                pasa nada. La elección de la bomba —y de su punto de operación— determina la
                confiabilidad, el consumo energético y, en última instancia, el costo del proceso.
              </p>
            </>
          )}

          {isVisible('tipos') && (
            <>
              <SectionTitle id="tipos">Tipos principales de bombas</SectionTitle>
              <p>
                La selección del tipo de bomba adecuado es una decisión de ingeniería fundamental
                que depende de múltiples factores: características del fluido (viscosidad,
                temperatura, sólidos en suspensión, corrosividad), caudal requerido, cabeza a
                desarrollar, eficiencia deseada y consideraciones económicas. Las dos grandes
                familias son las <strong>cinéticas</strong> (centrífugas) y las de
                {' '}<strong>desplazamiento positivo (DP)</strong>.
              </p>

              <SubTitle>Bombas centrífugas</SubTitle>
              <p>
                Utilizan un elemento rotatorio llamado <strong>impulsor</strong> (o rodete), provisto
                de álabes, que gira a alta velocidad dentro de una carcasa estacionaria (voluta o
                difusor). El fluido entra axialmente al ojo del impulsor, es acelerado radialmente
                por la fuerza centrífuga, y esa energía cinética se convierte parcialmente en
                energía de presión en la voluta —una cámara con forma espiral que desacelera el
                flujo— antes de la descarga.
              </p>

              <SubTitle>Bombas de desplazamiento positivo (DP)</SubTitle>
              <p>
                Operan <strong>atrapando un volumen fijo</strong> de líquido en una cavidad mecánica y
                forzándolo (desplazándolo) hacia la tubería de descarga. A diferencia de las
                centrífugas, el caudal es casi directamente proporcional a la velocidad de
                operación (rpm) e idealmente independiente de la presión de descarga, dentro de los
                límites mecánicos de la bomba.
              </p>
              <p>Se subdividen en dos familias:</p>
              <ul>
                <li>
                  <strong>Reciprocantes:</strong> un elemento se mueve alternativamente (vaivén)
                  dentro de una cámara — pistón, émbolo o diafragma.
                </li>
                <li>
                  <strong>Rotatorias:</strong> elementos rotatorios forman sellos móviles con la
                  carcasa para atrapar y mover el fluido — tornillos, engranajes, lóbulos, paletas.
                </li>
              </ul>

              <p className="text-sm text-brand-gray mt-4">
                Explora cada tipo en el visor interactivo:
              </p>
              <PumpTypesStepper />

              <TipCallout title="Características generales de las bombas DP">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Capaces de generar <strong>presiones muy altas</strong>.</li>
                  <li>Adecuadas para fluidos de <strong>alta viscosidad</strong>.</li>
                  <li>Algunos tipos manejan fluidos con sólidos en suspensión o sensibles al cizallamiento.</li>
                  <li>Caudal relativamente <strong>constante</strong> incluso con variaciones de presión.</li>
                  <li>Son <strong>autocebantes</strong>.</li>
                </ul>
                <p className="mt-3 text-zinc-300">
                  <strong>Aplicaciones típicas:</strong> dosificación precisa de químicos, lodos,
                  fluidos muy viscosos (aceites pesados, polímeros, melazas, pastas alimenticias),
                  hidráulica de alta presión y muestreo.
                </p>
              </TipCallout>

              <WarningCallout title="Válvula de alivio obligatoria en DP">
                Las bombas de desplazamiento positivo seguirán intentando desplazar el fluido aunque
                la descarga se bloquee. Esto puede romper la tubería, los sellos o la propia bomba.
                <strong> Toda instalación con bomba DP requiere una válvula de alivio de presión</strong>
                {' '}aguas arriba del primer punto de cierre, dimensionada para el caudal y la
                presión máxima que la bomba pueda generar.
              </WarningCallout>

              <SubTitle>¿Centrífuga o desplazamiento positivo?</SubTitle>
              <p>
                La elección depende del cruce entre el <strong>punto de operación</strong> ($Q$, $H$),
                la <strong>viscosidad</strong> del fluido y restricciones del proceso (sólidos,
                tolerancia a pulsación). El siguiente selector permite explorar visualmente cómo se
                acomodan las distintas familias en el plano $Q$–$H$:
              </p>

              <PumpSelector />

              <p className="text-sm text-brand-gray mt-2">
                Para fijar la comparación rápido, esta es la versión tabular:
              </p>
              <div className="my-4 overflow-x-auto not-prose">
                <table className="min-w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-zinc-100 text-brand-dark">
                      <th className="text-left p-3 border border-zinc-200 font-semibold">Criterio</th>
                      <th className="text-left p-3 border border-zinc-200 font-semibold">Centrífuga</th>
                      <th className="text-left p-3 border border-zinc-200 font-semibold">Desplazamiento positivo</th>
                    </tr>
                  </thead>
                  <tbody className="text-brand-gray">
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">Caudal</td>
                      <td className="p-3 border border-zinc-200">Alto (decenas a miles de m³/h)</td>
                      <td className="p-3 border border-zinc-200">Bajo a moderado, muy controlable</td>
                    </tr>
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">Presión / cabeza</td>
                      <td className="p-3 border border-zinc-200">Moderada (típicamente &lt; 100–200 m)</td>
                      <td className="p-3 border border-zinc-200">Muy alta posible (&gt; 1000 bar)</td>
                    </tr>
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">Viscosidad</td>
                      <td className="p-3 border border-zinc-200">Baja a media (degrada con μ alta)</td>
                      <td className="p-3 border border-zinc-200">Maneja viscosidades muy altas</td>
                    </tr>
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">Pulsación</td>
                      <td className="p-3 border border-zinc-200">Flujo suave</td>
                      <td className="p-3 border border-zinc-200">Pulsante (mitigable con varios cilindros / amortiguadores)</td>
                    </tr>
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">Autocebado</td>
                      <td className="p-3 border border-zinc-200">No (requiere cebado)</td>
                      <td className="p-3 border border-zinc-200">Sí</td>
                    </tr>
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">Costo / mantenimiento</td>
                      <td className="p-3 border border-zinc-200">Más bajo</td>
                      <td className="p-3 border border-zinc-200">Mayor (más componentes móviles)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {isVisible('curvas') && (
            <>
              <SectionTitle id="curvas">Curvas características de las bombas centrífugas</SectionTitle>
              <p>
                Las <strong>curvas características</strong> (o curvas de rendimiento) son gráficos
                proporcionados por el fabricante que describen el comportamiento de una bomba
                centrífuga específica a una velocidad de rotación dada y para un fluido de
                referencia (usualmente agua). Son fundamentales para la selección y predicción del
                comportamiento de la bomba en un sistema.
              </p>

              <ul>
                <li>
                  <strong>Cabeza vs. caudal ($H$ vs. $Q$):</strong> es la curva principal. Muestra la
                  cabeza total que la bomba puede desarrollar (m de columna de líquido) en función
                  del caudal. Generalmente la cabeza disminuye al aumentar $Q$. El punto $Q = 0$ se
                  conoce como <em>«cabeza de cierre»</em> (shut-off head).
                </li>
                <li>
                  <strong>{String.raw`Eficiencia vs. caudal ($\eta$ vs. $Q$):`}</strong>{String.raw` la eficiencia es cero a $Q=0$ y a $Q_{\max}$, y alcanza un máximo en el `}<strong>BEP (Best Efficiency Point)</strong>.
                  Es deseable operar tan cerca del BEP como sea posible.
                </li>
                <li>
                  <strong>Potencia al freno vs. caudal (BHP vs. $Q$):</strong> potencia que el motor
                  debe entregar al eje de la bomba para cada caudal.
                </li>
                <li>
                  <strong>{String.raw`NPSH requerido vs. caudal ($\text{NPSH}_r$ vs. $Q$):`}</strong> cabeza
                  mínima de succión que la bomba necesita para operar sin cavitación. Suele aumentar
                  con $Q$.
                </li>
              </ul>

              <p>
                El <strong>punto de operación</strong> de una bomba dentro de un sistema se determina
                gráficamente por la intersección de la curva {String.raw`$H{-}Q$`} de la bomba con la curva del
                sistema. La curva del sistema representa la cabeza total que la bomba debe vencer
                (cabeza estática neta + diferencias de presión entre tanques + pérdidas por
                fricción $h_L$) para cada caudal.
              </p>

              <PumpCurvesChart />

              <Figure
                src="/classroom/iqya-2031/readings/bombas-curvas.png"
                alt="Curvas características de una bomba centrífuga"
                caption="Curvas características típicas de una bomba centrífuga (referencia del fabricante)."
                maxWidth="700px"
              />

              <TipCallout title="Cómo seleccionar el tamaño correcto">
                Una bomba sobredimensionada operará lejos del BEP — generalmente a la izquierda,
                con baja eficiencia, recirculación interna y vibraciones. Una subdimensionada
                operará a la derecha del BEP, con NPSHr alto y riesgo de cavitación. La regla
                práctica es seleccionar la bomba de modo que el punto de operación caiga dentro
                de la <strong>ventana del 70 %–110 %</strong> del caudal del BEP.
              </TipCallout>
            </>
          )}

          {isVisible('cavitacion') && (
            <>
              <SectionTitle id="cavitacion">Cavitación y NPSH</SectionTitle>
              <p>
                La <strong>cavitación</strong> es la formación y colapso implosivo de burbujas de
                vapor dentro de una bomba. Ocurre cuando la presión local del líquido en algún
                punto —típicamente a la entrada del impulsor— cae por debajo de la presión de
                vapor del líquido a la temperatura de bombeo.
              </p>

              <SubTitle>Efectos de la cavitación</SubTitle>
              <ul>
                <li>Ruido característico (como si la bomba moviera grava) y vibraciones intensas.</li>
                <li>Daño erosivo a los componentes, especialmente el impulsor.</li>
                <li>Reducción de la cabeza desarrollada y del caudal.</li>
                <li>Disminución de la eficiencia.</li>
                <li>En casos severos, falla catastrófica de la bomba.</li>
              </ul>

              <div className="my-6 not-prose grid md:grid-cols-2 gap-4 items-start">
                <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full rounded-md"
                      src="https://www.youtube.com/embed/FBapRUolruM"
                      title="Inertial collapse of a bubble"
                      frameBorder={0}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-xs text-brand-gray italic mt-2">
                    Simulación numérica del colapso de una burbuja cerca de una superficie sólida.
                    El colapso asimétrico genera un chorro y ondas de choque que erosionan el metal
                    (Beig & Johnson).
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    El daño en bombas reales se concentra en los <strong>bordes de ataque de los
                    álabes</strong>, donde la presión es mínima. Cada burbuja que colapsa contra el
                    metal libera un chorro micro-supersónico que arranca pequeñas cantidades de
                    material. Sumado en miles de millones de eventos por hora, el impulsor se
                    perfora — a veces en cuestión de semanas.
                  </p>
                  <p className="text-sm text-brand-gray leading-relaxed mt-3">
                    Para prevenirla, la ingeniería usa el concepto de <strong>NPSH</strong> (Net
                    Positive Suction Head, carga neta positiva en la succión).
                  </p>
                </div>
              </div>

              <SubTitle>NPSH disponible (NPSHa)</SubTitle>
              <p>
                Es una característica del <strong>sistema de succión</strong> e indica la energía
                absoluta (expresada como cabeza de líquido) en la brida de succión de la bomba por
                encima de la presión de vapor del líquido:
              </p>
              <p>
                {String.raw`$$\text{NPSH}_a = \frac{P_{\text{abs,succión}}}{\rho g} - \frac{P_{\text{vap}}}{\rho g}$$`}
              </p>
              <p>O, en términos prácticos del sistema (tanque de succión):</p>
              <p>
                {String.raw`$$\text{NPSH}_a = \frac{P_{\text{tanque}}}{\rho g} + (z_{\text{tanque}} - z_{\text{bomba}}) - h_{L,\text{succión}} - \frac{P_{\text{vap}}}{\rho g}$$`}
              </p>
              <ul>
                <li>{String.raw`$P_{\text{abs,succión}}$: presión absoluta en la brida de succión de la bomba.`}</li>
                <li>{String.raw`$P_{\text{tanque}}$: presión absoluta sobre la superficie del líquido en el tanque de succión.`}</li>
                <li>{String.raw`$(z_{\text{tanque}} - z_{\text{bomba}})$: diferencia de elevación, positiva si el nivel del líquido está por encima de la bomba.`}</li>
                <li>{String.raw`$h_{L,\text{succión}}$: pérdidas totales de cabeza en la tubería de succión.`}</li>
                <li>{String.raw`$P_{\text{vap}}$: presión de vapor del líquido a la temperatura de bombeo.`}</li>
                <li>{String.raw`$\rho$: densidad del líquido. $g$: aceleración de la gravedad.`}</li>
              </ul>

              <Figure
                src="/classroom/iqya-2031/readings/bombas-npsh_a.png"
                alt="Diagrama de cálculo del NPSH disponible"
                caption="Diagrama de los términos del NPSHa para una bomba en succión inundada."
                maxWidth="640px"
              />

              <SubTitle>NPSH requerido (NPSHr)</SubTitle>
              <p>
                Es una <strong>característica intrínseca de la bomba</strong>, determinada
                experimentalmente por el fabricante y reportada en sus curvas. Representa la cabeza
                mínima necesaria en la brida de succión para superar las pérdidas internas de la
                bomba y evitar que la presión en el ojo del impulsor caiga por debajo de la presión
                de vapor. Suele <strong>aumentar con el caudal</strong>.
              </p>

              <SubTitle>Condición para evitar cavitación</SubTitle>
              <p>
                El NPSH disponible debe ser <strong>mayor</strong> que el requerido, con un margen
                de seguridad razonable (típicamente 0,5–1 m, o 10–25 % por encima de NPSHr):
              </p>
              <p>
                {String.raw`$$\text{NPSH}_a \;>\; \text{NPSH}_r + \text{margen de seguridad}$$`}
              </p>

              <Figure
                src="/classroom/iqya-2031/readings/bombas-npsh_marg.png"
                alt="Margen entre NPSH disponible y NPSH requerido"
                caption="El margen de seguridad entre NPSHa y NPSHr es lo que separa una operación confiable de un impulsor erosionado."
                maxWidth="640px"
              />

              <NPSHCalculator />

              <InfoCallout title="Estrategias para subir el NPSHa">
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Subir el tanque</strong>{String.raw` de succión (aumenta $z_{\text{tanque}}$).`}</li>
                  <li><strong>Bajar la bomba</strong> respecto al nivel del líquido.</li>
                  <li><strong>Reducir pérdidas</strong> en la línea de succión: tuberías más cortas y de mayor diámetro, menos accesorios, menos curvas.</li>
                  <li><strong>Enfriar el líquido</strong>{String.raw` para disminuir $P_{\text{vap}}$.`}</li>
                  <li><strong>Presurizar el tanque</strong> (cuando es viable, con gas inerte por ejemplo).</li>
                </ul>
              </InfoCallout>
            </>
          )}

          {isVisible('potencia') && (
            <>
              <SectionTitle id="potencia">Potencia de bombeo</SectionTitle>

              <SubTitle>Potencia hidráulica (Pₕ)</SubTitle>
              <p>Es la energía útil transferida por la bomba al fluido por unidad de tiempo:</p>
              <p>{String.raw`$$P_h = \rho \cdot g \cdot Q \cdot H$$`}</p>
              <ul>
                <li>{String.raw`$P_h$: potencia hidráulica (W).`}</li>
                <li>{String.raw`$\rho$: densidad del fluido (kg/m³).`}</li>
                <li>{String.raw`$g$: aceleración de la gravedad (9,81 m/s²).`}</li>
                <li>{String.raw`$Q$: caudal volumétrico (m³/s).`}</li>
                <li>{String.raw`$H$: cabeza total desarrollada por la bomba (m de columna de fluido).`}</li>
              </ul>

              <SubTitle>Potencia al freno (BHP)</SubTitle>
              <p>
                Es la potencia real que el motor debe suministrar al <strong>eje</strong> de la bomba,
                considerando la eficiencia hidromecánica:
              </p>
              <p>{String.raw`$$\text{BHP} = \frac{P_h}{\eta_{\text{bomba}}}$$`}</p>
              <p>
                {String.raw`La eficiencia $\eta_{\text{bomba}}$ se obtiene de la curva característica para el punto de operación.`}
              </p>

              <SubTitle>Potencia eléctrica del motor</SubTitle>
              <p>
                Para seleccionar el motor comercial es necesario contemplar también la
                <strong> eficiencia del motor</strong>{String.raw` $\eta_{\text{motor}}$ `}(típicamente 0,85–0,95
                según tamaño y clase) y aplicar un <strong>factor de servicio</strong> de 1,15–1,25:
              </p>
              <p>{String.raw`$$P_{\text{eléctrica}} = \frac{\text{BHP}}{\eta_{\text{motor}}} \quad ; \quad P_{\text{nominal}} \geq f_s \cdot P_{\text{eléctrica}}$$`}</p>

              <PowerCalculator />

              <TipCallout title="Ejemplo numérico rápido">
                {String.raw`Bomba que mueve agua a $Q = 50$ m³/h con $H = 35$ m, $\eta_{\text{bomba}} = 0{,}70$, $\eta_{\text{motor}} = 0{,}92$:`}
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>{String.raw`$P_h = 1000 \cdot 9{,}81 \cdot (50/3600) \cdot 35 \approx 4{,}77$ kW`}</li>
                  <li>{String.raw`$\text{BHP} = 4{,}77 / 0{,}70 \approx 6{,}81$ kW`}</li>
                  <li>{String.raw`$P_{\text{eléctrica}} = 6{,}81 / 0{,}92 \approx 7{,}40$ kW`}</li>
                  <li>{String.raw`Con $f_s = 1{,}20$: $P_{\text{nominal}} \geq 8{,}88$ kW $\Rightarrow$ motor comercial de $\mathbf{11}$ kW (15 HP).`}</li>
                </ul>
              </TipCallout>
            </>
          )}

          {isVisible('desafios') && (
            <>
              <SectionTitle id="desafios">Desafíos clave en operación</SectionTitle>
              <p>
                Operar bombas en la práctica es mucho más que aplicar las ecuaciones anteriores.
                Estos son los frentes que un ingeniero de procesos debe atender:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
                <div className="rounded-xl border border-zinc-200 p-5 hover:shadow-md hover:border-brand-yellow transition-all">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">Selección adecuada</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Escoger el tipo y tamaño de bomba correcto para la aplicación específica es
                    fundamental para la eficiencia operativa y la vida útil del equipo.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5 hover:shadow-md hover:border-brand-yellow transition-all">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">Optimización energética</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Operar cerca del BEP es clave para minimizar el consumo de energía, con impacto
                    económico y ambiental significativo a lo largo de la vida útil de la planta.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5 hover:shadow-md hover:border-brand-yellow transition-all">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">Control del sistema</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Estrategias como variadores de frecuencia (VFD), válvulas de control y operación
                    en paralelo o serie permiten adaptar el rendimiento a las necesidades variables
                    del proceso.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5 hover:shadow-md hover:border-brand-yellow transition-all">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">Prevención de cavitación</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Diseño cuidadoso del sistema de succión: tuberías cortas y amplias, baja
                    elevación de la bomba, NPSHa con margen razonable.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5 hover:shadow-md hover:border-brand-yellow transition-all">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">Mantenimiento y confiabilidad</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Las bombas son equipos rotativos que requieren plan preventivo y predictivo:
                    sellos, rodamientos, alineación, vibraciones y consumo de potencia.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5 hover:shadow-md hover:border-brand-yellow transition-all">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">Manejo de fluidos complejos</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Desafíos adicionales con fluidos viscosos, corrosivos, con sólidos o a altas
                    temperaturas — pueden cambiar por completo la familia de bomba elegida.
                  </p>
                </div>
              </div>

              <InfoCallout title="Operación en paralelo y en serie">
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>En paralelo</strong> (dos bombas idénticas con succión y descarga
                    comunes): se <em>suman caudales</em> a la misma cabeza. Útil cuando la demanda
                    de $Q$ es variable y se quiere apagar una bomba en horas de baja carga.
                  </li>
                  <li>
                    <strong>En serie</strong> (descarga de una alimenta la succión de otra): se
                    <em> suman cabezas</em> al mismo caudal. Útil cuando una sola bomba no llega a
                    la presión requerida (por ejemplo, edificios altos, oleoductos).
                  </li>
                </ul>
              </InfoCallout>
            </>
          )}

          {isVisible('bibliografia') && (
            <>
              <SectionTitle id="bibliografia">Bibliografía recomendada</SectionTitle>
              <ul className="text-sm text-brand-gray leading-relaxed">
                <li>
                  McCabe, W. L., Smith, J. C., &amp; Harriott, P. (2005).
                  <em> Unit Operations of Chemical Engineering</em> (7th ed.). McGraw-Hill.
                  (Capítulo 9: Transportation of Fluids).
                </li>
                <li>
                  Perry, R. H., &amp; Green, D. W. (Eds.). (2019).
                  <em> Perry's Chemical Engineers' Handbook</em> (9th ed.). McGraw-Hill.
                  (Sección 10: Transport and Storage of Fluids — Pumps and Compressors).
                </li>
                <li>
                  Karassik, I. J., Messina, J. P., Cooper, P., &amp; Heald, C. C. (2008).
                  <em> Pump Handbook</em> (4th ed.). McGraw-Hill. <span className="italic">— La
                  referencia más completa y detallada sobre bombas.</span>
                </li>
                <li>
                  Lobanoff, V. S., &amp; Ross, R. R. (1992).
                  <em> Centrifugal Pumps: Design and Application</em> (2nd ed.). Gulf Professional
                  Publishing.
                </li>
                <li>
                  Hydraulic Institute. (2010). ANSI/HI 9.6.7 — <em>Effects of Liquid Viscosity on
                  Rotodynamic (Centrifugal and Vertical) Pump Performance</em>.
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </ReadingLayout>
  );
};

export default Bombas;
