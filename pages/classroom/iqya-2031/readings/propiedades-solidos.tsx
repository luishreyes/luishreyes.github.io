import React, { useEffect, useMemo, useState } from 'react';
import { ReadingLayout } from '../../../../components/classroom/ReadingLayout';
import { getCourseBySlug } from '../../../../components/data/classroom';

/* ─── Hook: KaTeX via CDN (se carga una vez y renderiza fórmulas $...$ y $$...$$) ─── */
const useKatex = () => {
  useEffect(() => {
    const renderAll = () => {
      // @ts-expect-error — KaTeX se carga dinámicamente vía CDN
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
    if (window.renderMathInElement) {
      renderAll();
      return;
    }

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

/* Hook para re-renderizar KaTeX cuando cambia el contenido (tabs, steppers, etc.) */
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
  { id: 'densidad', label: 'Densidad de partícula' },
  { id: 'porosidad', label: 'Porosidad' },
  { id: 'tamano', label: 'Tamaño y distribución' },
  { id: 'forma', label: 'Forma de la partícula' },
  { id: 'flujo', label: 'Propiedades de flujo' },
  { id: 'otras', label: 'Otras propiedades' },
  { id: 'impacto', label: 'Impacto en operaciones' },
  { id: 'caso', label: 'Caso práctico: tolva de cacao' },
  { id: 'consejos', label: 'Consejos prácticos' },
  { id: 'bibliografia', label: 'Bibliografía' },
];

/* ─── Callouts reutilizables ─── */
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

/* ─── Video embebido ─── */
const VideoEmbed: React.FC<{ id: string; title: string; start?: number }> = ({
  id,
  title,
  start,
}) => (
  <div className="my-8 aspect-video rounded-xl overflow-hidden shadow-lg not-prose">
    <iframe
      className="w-full h-full"
      src={`https://www.youtube.com/embed/${id}?rel=0${start ? `&start=${start}` : ''}`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
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

/* ─── Tabs: tipos de densidad ─── */
/* ─── Visualizador interactivo: qué densidad mides según qué cuentas ─── */
const DensityComparisonViz: React.FC = () => {
  const [incInterparticle, setIncInterparticle] = useState(false);
  const [incClosedPores, setIncClosedPores] = useState(false);
  const [incOpenPores, setIncOpenPores] = useState(false);

  const densityName = useMemo(() => {
    if (!incInterparticle && !incClosedPores && !incOpenPores) return { label: 'Densidad verdadera', symbol: 'ρ_verdadera', desc: 'Solo el sólido puro — sin poros de ningún tipo.', color: '#0ea5e9' };
    if (!incInterparticle && incClosedPores && !incOpenPores) return { label: 'Densidad aparente (partícula)', symbol: 'ρ_aparente', desc: 'Sólido + poros cerrados internos. Volumen de la partícula "desde fuera".', color: '#8b5cf6' };
    if (!incInterparticle && incClosedPores && incOpenPores) return { label: 'Densidad efectiva', symbol: 'ρ_efectiva', desc: 'Sólido + todos los poros internos (cerrados y abiertos). Hidrodinámica con fluido alrededor.', color: '#f59e0b' };
    if (incInterparticle && incClosedPores && incOpenPores) return { label: 'Densidad masal (lecho)', symbol: 'ρ_masal', desc: 'Todo: sólido + poros internos + huecos entre partículas. Lo que ves desde afuera del silo.', color: '#ef4444' };
    return { label: 'Combinación no física', symbol: '—', desc: 'No existe una densidad estándar para esta combinación: los huecos interparticulares existen solo en un lecho (que también tiene las partículas con sus poros).', color: '#71717a' };
  }, [incInterparticle, incClosedPores, incOpenPores]);

  return (
    <div className="my-6 not-prose">
      <div className="rounded-xl overflow-hidden border border-zinc-200 shadow-sm">
        <div className="bg-brand-dark text-white p-5 sm:p-6">
          <h4 className="font-bold text-lg mb-1">¿Qué densidad estás midiendo?</h4>
          <p className="text-sm text-zinc-400">
            Cada densidad se define por <strong>qué volúmenes cuentas</strong> en el denominador.
            Activa o desactiva cada tipo de vacío y observa cuál corresponde.
          </p>
        </div>
        <div className="grid lg:grid-cols-[1fr_280px]">
          <div className="bg-gradient-to-br from-zinc-50 to-white p-6 flex items-center justify-center">
            <svg viewBox="0 0 400 320" className="w-full max-w-md" role="img" aria-label="Visualización de densidades">
              <rect x="20" y="20" width="360" height="280" fill="none" stroke="#27272a" strokeWidth="2" strokeDasharray="6 3" rx="8" />
              <text x="30" y="42" fontSize="10" fill="#52525b" fontWeight="600">LECHO (silo / empaque)</text>
              {incInterparticle && (
                <rect x="22" y="22" width="356" height="276" fill="#dbeafe" opacity="0.55" rx="6" />
              )}
              {[
                [80, 100], [200, 90], [320, 110],
                [70, 180], [190, 195], [315, 185],
                [130, 250], [270, 255],
              ].map(([cx, cy], i) => {
                const r = 42;
                return (
                  <g key={i}>
                    {incOpenPores && (
                      <circle cx={cx} cy={cy} r={r + 4} fill="#fde68a" opacity="0.8" />
                    )}
                    <circle cx={cx} cy={cy} r={r} fill="#fff" stroke="#27272a" strokeWidth="1.5" />
                    {incClosedPores ? (
                      <>
                        <circle cx={cx - 12} cy={cy - 8} r="6" fill="#c4b5fd" opacity="0.9" />
                        <circle cx={cx + 10} cy={cy + 6} r="5" fill="#c4b5fd" opacity="0.9" />
                        <circle cx={cx - 5} cy={cy + 14} r="4" fill="#c4b5fd" opacity="0.9" />
                      </>
                    ) : (
                      <>
                        <circle cx={cx - 12} cy={cy - 8} r="6" fill="none" stroke="#a1a1aa" strokeWidth="0.8" strokeDasharray="2 1.5" />
                        <circle cx={cx + 10} cy={cy + 6} r="5" fill="none" stroke="#a1a1aa" strokeWidth="0.8" strokeDasharray="2 1.5" />
                        <circle cx={cx - 5} cy={cy + 14} r="4" fill="none" stroke="#a1a1aa" strokeWidth="0.8" strokeDasharray="2 1.5" />
                      </>
                    )}
                    {incOpenPores && (
                      <>
                        <path d={`M ${cx + r - 4} ${cy - 3} q 8 -2 12 -8`} fill="none" stroke="#f59e0b" strokeWidth="2" />
                        <path d={`M ${cx - r + 4} ${cy + 5} q -8 2 -12 8`} fill="none" stroke="#f59e0b" strokeWidth="2" />
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="bg-white p-5 border-t lg:border-t-0 lg:border-l border-zinc-200">
            <p className="text-xs uppercase tracking-widest text-brand-yellow-dark font-bold mb-3">Volúmenes a contar</p>
            <div className="space-y-2.5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={incClosedPores} onChange={() => setIncClosedPores(!incClosedPores)} className="mt-0.5 w-4 h-4 accent-violet-500 flex-shrink-0" />
                <span className="flex-1 text-sm">
                  <span className="font-semibold text-brand-dark">Poros cerrados internos</span>
                  <span className="block text-xs text-brand-gray">Huecos aislados dentro de cada partícula.</span>
                </span>
              </label>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={incOpenPores} onChange={() => setIncOpenPores(!incOpenPores)} className="mt-0.5 w-4 h-4 accent-amber-500 flex-shrink-0" />
                <span className="flex-1 text-sm">
                  <span className="font-semibold text-brand-dark">Poros abiertos</span>
                  <span className="block text-xs text-brand-gray">Canales accesibles desde el exterior de la partícula.</span>
                </span>
              </label>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={incInterparticle} onChange={() => setIncInterparticle(!incInterparticle)} className="mt-0.5 w-4 h-4 accent-sky-500 flex-shrink-0" />
                <span className="flex-1 text-sm">
                  <span className="font-semibold text-brand-dark">Huecos interparticulares</span>
                  <span className="block text-xs text-brand-gray">Espacios entre partículas dentro del lecho.</span>
                </span>
              </label>
            </div>
            <div className="mt-5 pt-4 border-t border-zinc-200">
              <p className="text-[10px] uppercase tracking-widest text-brand-gray mb-1">Densidad correspondiente</p>
              <p className="text-lg font-bold" style={{ color: densityName.color }}>{densityName.label}</p>
              <p className="text-xs font-mono text-brand-gray mt-0.5">{densityName.symbol}</p>
              <p className="text-xs text-brand-gray mt-2 leading-relaxed">{densityName.desc}</p>
            </div>
          </div>
        </div>
        <div className="bg-zinc-50 border-t border-zinc-200 p-3 text-[11px] text-brand-gray grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button onClick={() => { setIncInterparticle(false); setIncClosedPores(false); setIncOpenPores(false); }} className="text-left hover:bg-white rounded px-2 py-1 transition-colors">
            <span className="block font-semibold text-sky-600">→ Verdadera</span>
            <span>todo apagado</span>
          </button>
          <button onClick={() => { setIncInterparticle(false); setIncClosedPores(true); setIncOpenPores(false); }} className="text-left hover:bg-white rounded px-2 py-1 transition-colors">
            <span className="block font-semibold text-violet-600">→ Aparente</span>
            <span>solo poros cerrados</span>
          </button>
          <button onClick={() => { setIncInterparticle(false); setIncClosedPores(true); setIncOpenPores(true); }} className="text-left hover:bg-white rounded px-2 py-1 transition-colors">
            <span className="block font-semibold text-amber-600">→ Efectiva</span>
            <span>todos los poros</span>
          </button>
          <button onClick={() => { setIncInterparticle(true); setIncClosedPores(true); setIncOpenPores(true); }} className="text-left hover:bg-white rounded px-2 py-1 transition-colors">
            <span className="block font-semibold text-red-600">→ Masal</span>
            <span>todo encendido</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Calculadora interactiva de porosidad con interpretación ─── */
const PorosityCalculator: React.FC = () => {
  const [rhoMasal, setRhoMasal] = useState(600);
  const [rhoAparente, setRhoAparente] = useState(1100);
  const [rhoVerdadera, setRhoVerdadera] = useState(1500);

  const eLecho = useMemo(() => 1 - rhoMasal / rhoAparente, [rhoMasal, rhoAparente]);
  const eParticula = useMemo(() => 1 - rhoAparente / rhoVerdadera, [rhoAparente, rhoVerdadera]);
  const eTotal = useMemo(() => 1 - rhoMasal / rhoVerdadera, [rhoMasal, rhoVerdadera]);
  const consistente = rhoMasal <= rhoAparente && rhoAparente <= rhoVerdadera;

  const interpretar = (e: number, tipo: 'lecho' | 'particula') => {
    if (tipo === 'lecho') {
      if (e < 0.26) return { label: 'Empaque ordenado', color: '#059669', note: 'Denso, tipo cúbico cerrado. Material esférico uniforme bien asentado.' };
      if (e < 0.38) return { label: 'Empaque compactado', color: '#10b981', note: 'Esferas compactadas (tapped) o granular bien clasificado.' };
      if (e < 0.46) return { label: 'Empaque aleatorio típico', color: '#f59e0b', note: 'Rango típico de polvos granulares vertidos libremente.' };
      if (e < 0.60) return { label: 'Empaque suelto / irregular', color: '#f97316', note: 'Partículas irregulares o angulosas; flujo moderado.' };
      return { label: 'Polvo cohesivo / muy suelto', color: '#dc2626', note: 'Harinas, polvos finos, aerogeles — alta porosidad, flujo deficiente.' };
    } else {
      if (e < 0.05) return { label: 'Prácticamente no porosa', color: '#059669', note: 'Cristales densos, metales, vidrio — densidad verdadera ≈ aparente.' };
      if (e < 0.20) return { label: 'Porosidad baja', color: '#10b981', note: 'Minerales compactos, cerámicas densas.' };
      if (e < 0.45) return { label: 'Porosidad moderada', color: '#f59e0b', note: 'Catalizadores, carbones activados, materiales sinterizados.' };
      if (e < 0.70) return { label: 'Porosidad alta', color: '#f97316', note: 'Zeolitas, soportes porosos, espumas — alta área superficial interna.' };
      return { label: 'Porosidad extrema', color: '#dc2626', note: 'Aerogeles, materiales MOF — casi todo es poro.' };
    }
  };

  const interpLecho = interpretar(eLecho, 'lecho');
  const interpPart = interpretar(eParticula, 'particula');

  useKatexRerender([rhoMasal, rhoAparente, rhoVerdadera]);

  return (
    <div className="my-6 rounded-xl bg-brand-dark p-5 sm:p-6 not-prose text-zinc-100">
      <p className="font-semibold text-brand-yellow text-sm mb-3">🧮 Calculadora e intérprete de porosidad</p>
      <p className="text-xs text-zinc-400 mb-4">
        Ingresa las tres densidades (mismas unidades — típicamente kg/m³). La calculadora deriva las
        tres porosidades y clasifica el comportamiento esperado.
      </p>
      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        {[
          { label: 'ρ masal (lecho)', value: rhoMasal, set: setRhoMasal, min: 100, max: 3000, step: 10, color: 'text-red-300' },
          { label: 'ρ aparente (partícula)', value: rhoAparente, set: setRhoAparente, min: 100, max: 5000, step: 10, color: 'text-violet-300' },
          { label: 'ρ verdadera (sólido)', value: rhoVerdadera, set: setRhoVerdadera, min: 100, max: 8000, step: 10, color: 'text-sky-300' },
        ].map((f) => (
          <label key={f.label} className="block">
            <span className={`text-xs uppercase tracking-wider ${f.color}`}>{f.label}</span>
            <div className="flex items-center gap-2 mt-1">
              <input type="number" value={f.value} min={f.min} max={f.max} step={f.step}
                onChange={(e) => f.set(Number(e.target.value))}
                className="w-20 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm font-mono text-white focus:border-brand-yellow focus:outline-none" />
              <input type="range" value={f.value} min={f.min} max={f.max} step={f.step}
                onChange={(e) => f.set(Number(e.target.value))}
                className="flex-1 accent-brand-yellow" />
            </div>
          </label>
        ))}
      </div>
      {!consistente && (
        <p className="text-xs text-red-400 mb-3">
          ⚠️ Debe cumplirse ρ masal ≤ ρ aparente ≤ ρ verdadera. Ajusta los valores para tener una configuración física.
        </p>
      )}
      <div className="space-y-3" key={`${rhoMasal}-${rhoAparente}-${rhoVerdadera}`}>
        {[
          { label: 'ε lecho (interparticular)', value: eLecho, interp: interpLecho },
          { label: 'ε partícula (intraparticular)', value: eParticula, interp: interpPart },
        ].map((b) => {
          const pct = Math.max(0, Math.min(100, b.value * 100));
          return (
            <div key={b.label} className="rounded-lg bg-zinc-900 border border-zinc-700 p-3">
              <div className="flex items-baseline justify-between gap-2 mb-1.5">
                <p className="text-xs font-semibold text-white">{b.label}</p>
                <p className="text-lg font-mono font-bold text-brand-yellow">
                  {b.value.toFixed(3)} <span className="text-xs text-zinc-400">({pct.toFixed(1)} %)</span>
                </p>
              </div>
              <div className="h-2 rounded-full bg-zinc-800 overflow-hidden mb-2">
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: b.interp.color }} />
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ background: b.interp.color }} />
                <p className="text-xs font-semibold" style={{ color: b.interp.color }}>{b.interp.label}</p>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 leading-snug">{b.interp.note}</p>
            </div>
          );
        })}
        <div className="rounded-lg bg-zinc-900 border border-zinc-700 p-3">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-xs font-semibold text-zinc-400">ε total (lecho + intraparticular)</p>
            <p className="text-lg font-mono font-bold text-zinc-300">
              {eTotal.toFixed(3)} <span className="text-xs text-zinc-500">({(eTotal * 100).toFixed(1)} %)</span>
            </p>
          </div>
          <p className="text-[11px] text-zinc-500 italic mt-1">
            Volumen de "no sólido" en el lecho completo = 1 − ρ_masal / ρ_verdadera.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ─── Íconos SVG inline correctos para los métodos de medición ─── */
const MethodIcon: React.FC<{ kind: 'tamiz' }> = ({ kind: _kind }) => {
  const common = 'w-full h-auto max-w-[380px] block mx-auto';
  return (
    <svg viewBox="0 0 340 260" className={common} aria-hidden="true">
      {[0, 1, 2].map((i) => {
        const y = 30 + i * 60;
        const meshGap = 5 + i * 3;
        return (
          <g key={i}>
            <rect x="70" y={y} width="200" height="40" fill="#fef3c7" stroke="#1A1A1A" strokeWidth="2" rx="4" />
            {Array.from({ length: Math.floor(200 / meshGap) }, (_, j) => (
              <line key={j} x1={70 + j * meshGap} y1={y + 36} x2={70 + j * meshGap} y2={y + 40} stroke="#71717a" strokeWidth="0.8" />
            ))}
            <text x="280" y={y + 25} fontSize="10" fill="#52525b" fontWeight="600">{['2 mm', '0.5 mm', '0.1 mm'][i]}</text>
            {Array.from({ length: 6 }, (_, j) => (
              <circle key={j} cx={90 + j * 30} cy={y + 20} r={Math.max(1.5, 4 - i)} fill="#FFBF00" stroke="#1A1A1A" strokeWidth="0.5" />
            ))}
          </g>
        );
      })}
      <rect x="60" y="220" width="220" height="25" fill="#e4e4e7" stroke="#1A1A1A" strokeWidth="2" rx="4" />
      <text x="170" y="238" fontSize="10" fill="#52525b" fontWeight="600" textAnchor="middle">Colector (finos)</text>
      <path d="M170 10 L170 25 M165 20 L170 25 L175 20" stroke="#1A1A1A" strokeWidth="1.5" fill="none" />
      <text x="180" y="18" fontSize="10" fill="#27272a" fontWeight="600">muestra</text>
    </svg>
  );
};

/* ─── SVGs estáticos para secciones donde solo se necesita un concepto claro ─── */

const VolumeDiameterSvg: React.FC = () => (
  <div className="my-6 not-prose flex flex-col items-center">
    <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-5 w-full flex justify-center">
      <svg viewBox="0 0 520 200" className="w-full max-w-[480px]" aria-hidden="true">
        <path
          d="M40 80 Q30 50 60 40 Q90 30 120 35 Q150 45 145 85 Q148 125 120 140 Q80 150 55 130 Q30 110 40 80 Z"
          fill="#dbeafe"
          stroke="#1d4ed8"
          strokeWidth="2"
        />
        <text x="82" y="170" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1d4ed8">Partícula real</text>
        <text x="82" y="185" textAnchor="middle" fontSize="10" fill="#52525b">Vp</text>
        <path d="M170 95 L215 95 M210 90 L215 95 L210 100" stroke="#64748b" strokeWidth="2" fill="none" />
        <text x="192" y="88" textAnchor="middle" fontSize="10" fontStyle="italic" fill="#52525b">mismo V</text>
        <circle cx="300" cy="95" r="60" fill="#dbeafe" stroke="#1d4ed8" strokeWidth="2" />
        <line x1="240" y1="95" x2="360" y2="95" stroke="#16a34a" strokeWidth="2" />
        <path d="M240 95 L247 91 M240 95 L247 99 M360 95 L353 91 M360 95 L353 99" stroke="#16a34a" strokeWidth="2" fill="none" />
        <text x="300" y="80" textAnchor="middle" fontSize="14" fontWeight="700" fill="#16a34a">dᵥ</text>
        <text x="300" y="170" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1d4ed8">Esfera equivalente</text>
        <text x="300" y="185" textAnchor="middle" fontSize="10" fill="#52525b">mismo volumen Vp</text>
        <text x="460" y="100" textAnchor="middle" fontSize="14" fontWeight="700" fill="#27272a">dᵥ = (6Vp/π)^⅓</text>
      </svg>
    </div>
    <figcaption className="text-center text-sm text-brand-gray mt-3 italic max-w-2xl">
      El diámetro equivalente por volumen <em>d<sub>v</sub></em> es el de la esfera que tiene el mismo
      volumen que la partícula irregular.
    </figcaption>
  </div>
);

const PycnometerSvg: React.FC = () => (
  <div className="my-6 not-prose flex flex-col items-center">
    <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-5 w-full flex justify-center">
      <svg viewBox="0 0 480 260" className="w-full max-w-[440px]" aria-hidden="true">
        {/* 3 frascos mostrando los 3 pasos clave */}
        {[0, 1, 2].map((i) => {
          const cx = 80 + i * 160;
          const labels = ['1 · masa vacío', '2 · con fluido', '3 · con polvo + fluido'];
          const sublabels = ['m₀', 'm₁ (V conocido)', 'm₂'];
          return (
            <g key={i}>
              {/* Tapón/capilar */}
              <rect x={cx - 8} y="20" width="16" height="28" fill="#a3a3a3" stroke="#1A1A1A" strokeWidth="1.5" rx="1" />
              <line x1={cx} y1="22" x2={cx} y2="48" stroke="#1A1A1A" strokeWidth="0.8" />
              {/* Cuerpo del picnómetro (bulbo) */}
              <path d={`M ${cx - 5} 48 L ${cx - 5} 72 Q ${cx - 50} 82 ${cx - 50} 140 Q ${cx - 50} 200 ${cx} 210 Q ${cx + 50} 200 ${cx + 50} 140 Q ${cx + 50} 82 ${cx + 5} 72 L ${cx + 5} 48 Z`}
                fill="white" stroke="#1A1A1A" strokeWidth="1.8" />
              {/* Contenido según paso */}
              {i === 1 && (
                <path d={`M ${cx - 48} 125 Q ${cx - 50} 140 ${cx - 50} 140 Q ${cx - 50} 200 ${cx} 210 Q ${cx + 50} 200 ${cx + 50} 140 Q ${cx + 50} 140 ${cx + 48} 125 Z`}
                  fill="#dbeafe" opacity="0.85" />
              )}
              {i === 2 && (
                <>
                  <path d={`M ${cx - 48} 125 Q ${cx - 50} 140 ${cx - 50} 140 Q ${cx - 50} 200 ${cx} 210 Q ${cx + 50} 200 ${cx + 50} 140 Q ${cx + 50} 140 ${cx + 48} 125 Z`}
                    fill="#dbeafe" opacity="0.85" />
                  {[[cx - 20, 180], [cx + 10, 195], [cx - 5, 170], [cx + 25, 175], [cx - 30, 155], [cx + 20, 155], [cx, 200]].map(([x, y], k) => (
                    <circle key={k} cx={x} cy={y} r={3.5} fill="#FFBF00" stroke="#1A1A1A" strokeWidth="0.6" />
                  ))}
                </>
              )}
              <text x={cx} y="235" textAnchor="middle" fontSize="10" fontWeight="700" fill="#27272a">{labels[i]}</text>
              <text x={cx} y="250" textAnchor="middle" fontSize="9.5" fontFamily="ui-monospace, monospace" fill="#52525b">{sublabels[i]}</text>
            </g>
          );
        })}
      </svg>
    </div>
    <figcaption className="text-center text-sm text-brand-gray mt-3 italic max-w-2xl">
      <strong>Picnómetro de líquido</strong>: frasco con volumen calibrado y capilar de llenado. Se pesa
      vacío, con el líquido de referencia y con el polvo + líquido. Por desplazamiento se despeja el volumen
      de sólido y, con la masa del polvo, su densidad.
    </figcaption>
  </div>
);

const SphericitySvg: React.FC = () => (
  <div className="my-6 not-prose flex flex-col items-center">
    <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-5 w-full flex justify-center">
      <svg viewBox="0 0 560 240" className="w-full max-w-[520px]" aria-hidden="true">
        {/* Esfera ideal */}
        <g>
          <circle cx="120" cy="120" r="70" fill="#dcfce7" stroke="#16a34a" strokeWidth="2.5" />
          <circle cx="100" cy="100" r="12" fill="white" opacity="0.6" />
          <text x="120" y="125" textAnchor="middle" fontSize="13" fontWeight="700" fill="#15803d">esfera</text>
          <text x="120" y="142" textAnchor="middle" fontSize="10" fill="#166534">Aₑ = π·dᵥ²</text>
          <text x="120" y="215" textAnchor="middle" fontSize="14" fontWeight="700" fill="#27272a">Φₛ = 1</text>
        </g>
        {/* Partícula irregular, mismo volumen */}
        <g>
          <path
            d="M 380 55 Q 420 45 450 70 Q 475 100 465 140 Q 470 175 435 190 Q 400 200 370 185 Q 335 170 330 135 Q 325 100 345 75 Q 360 60 380 55 Z"
            fill="#fef3c7"
            stroke="#b45309"
            strokeWidth="2.5"
          />
          <text x="400" y="128" textAnchor="middle" fontSize="13" fontWeight="700" fill="#92400e">partícula</text>
          <text x="400" y="145" textAnchor="middle" fontSize="10" fill="#78350f">Ar &gt; Aₑ</text>
          <text x="400" y="215" textAnchor="middle" fontSize="14" fontWeight="700" fill="#27272a">Φₛ &lt; 1</text>
        </g>
        {/* Flecha / igualdad de volumen */}
        <path d="M 195 110 L 255 110 M 250 106 L 255 110 L 250 114" stroke="#64748b" strokeWidth="2" fill="none" />
        <path d="M 255 135 L 195 135 M 200 131 L 195 135 L 200 139" stroke="#64748b" strokeWidth="2" fill="none" />
        <text x="225" y="102" textAnchor="middle" fontSize="11" fontStyle="italic" fill="#334155">mismo</text>
        <text x="225" y="155" textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">volumen</text>
        {/* Fórmula */}
        <text x="280" y="33" textAnchor="middle" fontSize="13" fontWeight="700" fill="#27272a">
          Φₛ = (área de esfera del mismo V) / (área real)
        </text>
      </svg>
    </div>
    <figcaption className="text-center text-sm text-brand-gray mt-3 italic max-w-2xl">
      Para el mismo volumen, la esfera tiene el área superficial <strong>mínima</strong>. Toda partícula
      irregular tiene más área que la esfera equivalente, así que <strong>Φₛ &lt; 1</strong>.
    </figcaption>
  </div>
);

const AngleOfReposeSvg: React.FC = () => {
  const [angle, setAngle] = useState(35);
  const W = 520;
  const H = 260;
  const baseY = 210;
  const apexX = W / 2;
  const halfBase = 160;
  const apexY = baseY - halfBase * Math.tan((angle * Math.PI) / 180);
  const qualitative = angle < 25
    ? { label: 'Flujo muy libre', color: '#16a34a' }
    : angle < 30
      ? { label: 'Flujo libre', color: '#16a34a' }
      : angle < 40
        ? { label: 'Flujo aceptable', color: '#ca8a04' }
        : angle < 50
          ? { label: 'Flujo deficiente', color: '#ea580c' }
          : { label: 'Muy cohesivo (no fluye bien)', color: '#dc2626' };

  return (
    <div className="my-6 not-prose">
      <div className="rounded-xl bg-white border border-zinc-200 p-4 sm:p-6 shadow-sm">
        <div className="flex items-baseline justify-between flex-wrap gap-2 mb-3">
          <h4 className="text-base font-semibold text-brand-dark">Ángulo de reposo — visualízalo</h4>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white" style={{ background: qualitative.color }}>
            θ = {angle}° · {qualitative.label}
          </span>
        </div>
        <div className="flex justify-center">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[520px]" aria-hidden="true">
            {/* Piso */}
            <line x1="20" y1={baseY} x2={W - 20} y2={baseY} stroke="#1A1A1A" strokeWidth="2" />
            {[40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480].map((x) => (
              <line key={x} x1={x} y1={baseY} x2={x - 10} y2={baseY + 12} stroke="#78716c" strokeWidth="1" />
            ))}
            {/* Cono de polvo */}
            <path
              d={`M ${apexX - halfBase} ${baseY} L ${apexX} ${apexY} L ${apexX + halfBase} ${baseY} Z`}
              fill="#fef3c7"
              stroke="#b45309"
              strokeWidth="2"
            />
            {/* Granos decorativos sobre el cono */}
            {[...Array(30)].map((_, i) => {
              const t = (i + 1) / 31;
              const x = apexX - halfBase + t * halfBase * 2;
              const distFromCenter = Math.abs(x - apexX);
              const yOnSlope = baseY - (halfBase - distFromCenter) * Math.tan((angle * Math.PI) / 180);
              return <circle key={i} cx={x} cy={yOnSlope - 2} r="2.5" fill="#FFBF00" stroke="#1A1A1A" strokeWidth="0.4" />;
            })}
            {/* Arco del ángulo */}
            <path
              d={`M ${apexX + 40} ${baseY} A 40 40 0 0 0 ${apexX + 40 * Math.cos((angle * Math.PI) / 180)} ${baseY - 40 * Math.sin((angle * Math.PI) / 180)}`}
              fill="none"
              stroke="#dc2626"
              strokeWidth="2.2"
            />
            <text
              x={apexX + 50}
              y={baseY - 18}
              fontSize="16"
              fontWeight="700"
              fill="#dc2626"
              fontStyle="italic"
            >
              θ
            </text>
            {/* Tolva arriba (vertido) */}
            <path d={`M ${apexX - 18} 30 L ${apexX - 28} 55 L ${apexX + 28} 55 L ${apexX + 18} 30 Z`} fill="#e7e5e4" stroke="#1A1A1A" strokeWidth="1.2" />
            {/* Chorro de polvo */}
            <path d={`M ${apexX - 4} 55 L ${apexX - 2} ${apexY - 4} M ${apexX + 4} 55 L ${apexX + 2} ${apexY - 4}`} stroke="#b45309" strokeWidth="2" opacity="0.7" />
          </svg>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-xs text-brand-gray w-8">10°</span>
          <input
            type="range"
            min={10}
            max={60}
            step={1}
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="flex-1 accent-brand-yellow"
            aria-label="Ángulo de reposo"
          />
          <span className="text-xs text-brand-gray w-10 text-right">60°</span>
        </div>
        <p className="text-xs text-center text-brand-gray italic mt-3">
          Desliza para ver cómo cambia el cono. θ bajo (pendiente suave) = polvo fluye bien; θ alto (pendiente
          empinada) = polvo cohesivo.
        </p>
      </div>
    </div>
  );
};

/* ─── Explorador de distribuciones de tamaño típicas en la industria ─── */
type PSDPreset = {
  id: string;
  nombre: string;
  descripcion: string;
  ejemplo: string;
  /** Histograma: frecuencia por bin. Los bins van de 1 a 500 μm logarítmicamente. */
  hist: number[];
};
const PSD_BINS_PER_DECADE = 6;
const PSD_LOG_MIN = 0; // 10⁰ = 1 μm
const PSD_LOG_MAX = 2.7; // ~500 μm
const PSD_NUM_BINS = Math.round((PSD_LOG_MAX - PSD_LOG_MIN) * PSD_BINS_PER_DECADE);

/** Genera una distribución log-normal discretizada (integral ≈ 1). */
function lognormalHist(mu: number, sigma: number): number[] {
  const h: number[] = [];
  let sum = 0;
  for (let i = 0; i < PSD_NUM_BINS; i++) {
    const lx = PSD_LOG_MIN + (i + 0.5) * ((PSD_LOG_MAX - PSD_LOG_MIN) / PSD_NUM_BINS);
    const z = (lx - mu) / sigma;
    const v = Math.exp(-0.5 * z * z);
    h.push(v);
    sum += v;
  }
  return h.map((v) => v / sum);
}
function addHists(a: number[], b: number[], wa: number, wb: number): number[] {
  return a.map((v, i) => wa * v + wb * b[i]);
}

const psdPresets: PSDPreset[] = [
  {
    id: 'narrow',
    nombre: 'Estrecha (monodispersa)',
    descripcion: 'Casi todas las partículas en un rango angosto. Resultado de cristalización controlada, atomización o clasificación fina.',
    ejemplo: 'Microesferas de vidrio calibradas · polvos farmacéuticos monodispersos · catalizadores esféricos.',
    hist: lognormalHist(1.6, 0.10),
  },
  {
    id: 'broad',
    nombre: 'Amplia (polidispersa)',
    descripcion: 'Amplia gama de tamaños con un pico suave. Típica de molienda no clasificada — finos, medios y gruesos convivientes.',
    ejemplo: 'Cemento · harinas industriales · carbón pulverizado · productos de molino de martillos.',
    hist: lognormalHist(1.6, 0.42),
  },
  {
    id: 'bimodal',
    nombre: 'Bimodal',
    descripcion: 'Dos picos separados — suele indicar mezcla de dos flujos o aglomeración parcial. También se diseña así en cerámicos para densificar.',
    ejemplo: 'Mezcla de finos + gruesos en empaque denso · pellets con polvo adherido · lecho fluidizado con elutriación.',
    hist: addHists(lognormalHist(1.1, 0.18), lognormalHist(2.1, 0.16), 0.55, 0.45),
  },
  {
    id: 'trimodal',
    nombre: 'Trimodal',
    descripcion: 'Tres picos — cada uno corresponde a una población distinta (p. ej. ingredientes de una formulación).',
    ejemplo: 'Formulaciones farmacéuticas con API + excipiente + lubricante · mezclas nutracéuticas.',
    hist: addHists(addHists(lognormalHist(0.7, 0.14), lognormalHist(1.6, 0.12), 0.35, 0.35), lognormalHist(2.3, 0.14), 1.0, 0.30),
  },
  {
    id: 'fino-pesado',
    nombre: 'Sesgo a finos',
    descripcion: 'Cola larga hacia finos — característica de molienda fina o procesos con generación de polvo fugitivo.',
    ejemplo: 'Pigmentos · TiO₂ micronizado · toner · polvo de cemento reciclado.',
    hist: lognormalHist(1.0, 0.55),
  },
  {
    id: 'grueso-pesado',
    nombre: 'Sesgo a gruesos',
    descripcion: 'Cola hacia gruesos — típico de productos granulados o aglomerados esféricos.',
    ejemplo: 'Fertilizantes granulados · alimento peletizado · detergente en polvo granulado.',
    hist: lognormalHist(2.1, 0.35),
  },
];

const PSDExplorer: React.FC = () => {
  const [activeId, setActiveId] = useState('broad');
  const preset = psdPresets.find((p) => p.id === activeId) ?? psdPresets[1];

  const W = 620;
  const H = 320;
  const margin = { top: 24, right: 58, bottom: 50, left: 58 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  const xBinCenter = (i: number) => {
    const lx = PSD_LOG_MIN + (i + 0.5) * ((PSD_LOG_MAX - PSD_LOG_MIN) / PSD_NUM_BINS);
    return Math.pow(10, lx);
  };
  const xScale = (size: number) =>
    margin.left + ((Math.log10(size) - PSD_LOG_MIN) / (PSD_LOG_MAX - PSD_LOG_MIN)) * plotW;

  const maxFreq = Math.max(...preset.hist) * 1.15;
  const yScaleFreq = (f: number) => margin.top + plotH - (f / maxFreq) * plotH;
  const yScaleCum = (c: number) => margin.top + plotH - c * plotH;

  let cum = 0;
  const cumCurve = preset.hist.map((h) => { cum += h; return cum; });

  const xTicks = [1, 3, 10, 30, 100, 300];

  // d10, d50, d90 (diámetros en el % acumulado volumen)
  const findDx = (frac: number): number => {
    for (let i = 0; i < cumCurve.length; i++) {
      if (cumCurve[i] >= frac) {
        if (i === 0) return xBinCenter(0);
        const c0 = cumCurve[i - 1];
        const c1 = cumCurve[i];
        const x0 = Math.log10(xBinCenter(i - 1));
        const x1 = Math.log10(xBinCenter(i));
        const t = (frac - c0) / (c1 - c0);
        return Math.pow(10, x0 + t * (x1 - x0));
      }
    }
    return xBinCenter(cumCurve.length - 1);
  };
  const d10 = findDx(0.10);
  const d50 = findDx(0.50);
  const d90 = findDx(0.90);
  const spread = d90 / d10;

  return (
    <div className="my-6 not-prose">
      <div className="rounded-xl bg-white border border-zinc-200 p-4 sm:p-6 shadow-sm">
        <h4 className="text-base font-semibold text-brand-dark mb-1">
          Distribuciones típicas en la industria
        </h4>
        <p className="text-xs text-brand-gray mb-4">
          El tamaño de partícula nunca es único — es una <strong>distribución</strong>. Explora las formas
          clásicas: angostas, amplias, bimodales, sesgadas. Cada una tiene un origen de proceso distinto.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {psdPresets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveId(p.id)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                activeId === p.id
                  ? 'bg-brand-dark text-white border-brand-dark'
                  : 'bg-white text-brand-gray border-zinc-300 hover:border-brand-yellow-dark hover:text-brand-dark'
              }`}
            >
              {p.nombre}
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[680px]" role="img" aria-label="Distribución de tamaño de partícula">
            <rect x={margin.left} y={margin.top} width={plotW} height={plotH} fill="#fafafa" />

            {/* Gridlines */}
            {xTicks.map((t) => (
              <line key={t} x1={xScale(t)} y1={margin.top} x2={xScale(t)} y2={margin.top + plotH} stroke="#e4e4e7" strokeWidth="0.5" strokeDasharray="2 2" />
            ))}
            {[0.2, 0.4, 0.6, 0.8, 1.0].map((c) => (
              <line key={c} x1={margin.left} y1={yScaleCum(c)} x2={margin.left + plotW} y2={yScaleCum(c)} stroke="#e4e4e7" strokeWidth="0.5" strokeDasharray="2 2" />
            ))}

            {/* Histograma */}
            {preset.hist.map((h, i) => {
              const binWidth = (PSD_LOG_MAX - PSD_LOG_MIN) / PSD_NUM_BINS;
              const x0 = margin.left + ((Math.log10(xBinCenter(i)) - binWidth / 2) - PSD_LOG_MIN) / (PSD_LOG_MAX - PSD_LOG_MIN) * plotW;
              const x1 = margin.left + ((Math.log10(xBinCenter(i)) + binWidth / 2) - PSD_LOG_MIN) / (PSD_LOG_MAX - PSD_LOG_MIN) * plotW;
              const y = yScaleFreq(h);
              return (
                <rect key={i} x={x0 + 0.5} y={y} width={Math.max(0, x1 - x0 - 1)} height={margin.top + plotH - y} fill="#FFBF00" opacity="0.5" />
              );
            })}

            {/* Curva acumulada */}
            <path
              d={'M ' + cumCurve.map((c, i) => `${xScale(xBinCenter(i)).toFixed(1)} ${yScaleCum(c).toFixed(1)}`).join(' L ')}
              fill="none"
              stroke="#1d4ed8"
              strokeWidth="2.5"
            />

            {/* Marcadores d10, d50, d90 */}
            {[
              { x: d10, label: 'd₁₀', color: '#0ea5e9' },
              { x: d50, label: 'd₅₀', color: '#1d4ed8' },
              { x: d90, label: 'd₉₀', color: '#0ea5e9' },
            ].map((m) => (
              <g key={m.label}>
                <line x1={xScale(m.x)} y1={margin.top} x2={xScale(m.x)} y2={margin.top + plotH} stroke={m.color} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.85" />
                <text x={xScale(m.x)} y={margin.top - 4} textAnchor="middle" fontSize="9" fontWeight="700" fill={m.color}>
                  {m.label}
                </text>
              </g>
            ))}

            {/* Ejes */}
            <line x1={margin.left} y1={margin.top + plotH} x2={margin.left + plotW} y2={margin.top + plotH} stroke="#27272a" strokeWidth="1.2" />
            <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + plotH} stroke="#27272a" strokeWidth="1.2" />
            <line x1={margin.left + plotW} y1={margin.top} x2={margin.left + plotW} y2={margin.top + plotH} stroke="#27272a" strokeWidth="1.2" />

            {/* Etiquetas X */}
            {xTicks.map((t) => (
              <g key={`xlab-${t}`}>
                <line x1={xScale(t)} y1={margin.top + plotH} x2={xScale(t)} y2={margin.top + plotH + 4} stroke="#27272a" strokeWidth="1" />
                <text x={xScale(t)} y={margin.top + plotH + 16} textAnchor="middle" fontSize="10" fill="#27272a">
                  {t}
                </text>
              </g>
            ))}
            <text x={margin.left + plotW / 2} y={H - 8} textAnchor="middle" fontSize="11" fontWeight="700" fill="#27272a">
              Tamaño de partícula (μm, log)
            </text>

            {/* Y-izquierda: frecuencia */}
            <text x={16} y={margin.top + plotH / 2} transform={`rotate(-90 16 ${margin.top + plotH / 2})`} textAnchor="middle" fontSize="11" fontWeight="700" fill="#b45309">
              Frecuencia relativa
            </text>

            {/* Y-derecha: acumulado */}
            {[0, 0.5, 1].map((c) => (
              <text key={c} x={margin.left + plotW + 6} y={yScaleCum(c) + 4} fontSize="10" fill="#1d4ed8">
                {(c * 100).toFixed(0)}%
              </text>
            ))}
            <text x={W - 16} y={margin.top + plotH / 2} transform={`rotate(90 ${W - 16} ${margin.top + plotH / 2})`} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1d4ed8">
              Volumen acumulado
            </text>
          </svg>
        </div>

        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-sm text-brand-dark font-semibold mb-1">{preset.nombre}</p>
            <p className="text-xs text-brand-gray leading-relaxed">{preset.descripcion}</p>
            <p className="text-xs text-brand-gray italic mt-2"><strong>Típico en:</strong> {preset.ejemplo}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 content-start">
            <div className="rounded-lg border border-zinc-200 p-2 text-center">
              <p className="text-[10px] uppercase tracking-wider text-brand-gray">d₁₀</p>
              <p className="text-sm font-mono font-bold text-brand-dark">{d10.toFixed(1)} μm</p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-2 text-center">
              <p className="text-[10px] uppercase tracking-wider text-brand-gray">d₅₀ (mediana)</p>
              <p className="text-sm font-mono font-bold text-brand-dark">{d50.toFixed(1)} μm</p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-2 text-center">
              <p className="text-[10px] uppercase tracking-wider text-brand-gray">d₉₀</p>
              <p className="text-sm font-mono font-bold text-brand-dark">{d90.toFixed(1)} μm</p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-2 text-center">
              <p className="text-[10px] uppercase tracking-wider text-brand-gray">Spread d₉₀/d₁₀</p>
              <p className="text-sm font-mono font-bold text-brand-dark">{spread.toFixed(1)}×</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Simulador de tamizado: ajustar la distribución retenida en cada malla ─── */
const SieveSimulator: React.FC = () => {
  // Mallas Tyler estándar (en μm) desde gruesa a fina + colector
  const sieves = [
    { size: 2000, label: '2000 μm (10 mesh)' },
    { size: 1000, label: '1000 μm (18 mesh)' },
    { size: 500,  label: '500 μm (35 mesh)' },
    { size: 250,  label: '250 μm (60 mesh)' },
    { size: 125,  label: '125 μm (120 mesh)' },
    { size: 63,   label: '63 μm (230 mesh)' },
    { size: 0,    label: 'Colector (finos)' },
  ];
  const defaultWeights = [5, 12, 25, 30, 18, 8, 2];
  const [weights, setWeights] = useState(defaultWeights);
  const total = weights.reduce((a, b) => a + b, 0);
  const frac = weights.map((w) => (total > 0 ? w / total : 0));

  const presets = [
    { name: 'Balanceado', w: [5, 12, 25, 30, 18, 8, 2] },
    { name: 'Más gruesos', w: [22, 30, 25, 13, 6, 3, 1] },
    { name: 'Más finos', w: [1, 3, 6, 13, 25, 30, 22] },
    { name: 'Molienda intermedia', w: [2, 10, 22, 32, 22, 10, 2] },
    { name: 'Bimodal', w: [15, 22, 6, 3, 6, 22, 26] },
  ];

  // Gráfica: PSD acumulada que pasa
  // Convención: el peso[i] quedó retenido en la malla i (o pasa si i es colector)
  // % acumulado que pasa en el tamaño de la malla i: suma de fracciones en mallas menores (i+1..n)
  const cumulativePass = sieves.map((_, i) => frac.slice(i + 1).reduce((a, b) => a + b, 0));
  const xAxisSizes = sieves.filter((s) => s.size > 0).map((s) => s.size);
  const pts = sieves
    .map((s, i) => ({ size: s.size, pass: cumulativePass[i] }))
    .filter((p) => p.size > 0);

  const W = 620;
  const H = 300;
  const margin = { top: 20, right: 30, bottom: 52, left: 58 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;
  const xMin = Math.log10(50);
  const xMax = Math.log10(3000);
  const xScale = (s: number) => margin.left + ((Math.log10(s) - xMin) / (xMax - xMin)) * plotW;
  const yScale = (f: number) => margin.top + plotH - f * plotH;

  const sortedPts = [...pts].sort((a, b) => a.size - b.size);
  const pathD = 'M ' + sortedPts.map((p) => `${xScale(p.size).toFixed(1)} ${yScale(p.pass).toFixed(1)}`).join(' L ');

  return (
    <div className="my-6 not-prose">
      <div className="rounded-xl bg-white border border-zinc-200 p-4 sm:p-6 shadow-sm">
        <h4 className="text-base font-semibold text-brand-dark mb-1">Simulador de tamizado</h4>
        <p className="text-xs text-brand-gray mb-4">
          Ajusta cuánto peso queda <strong>retenido</strong> en cada malla. La curva acumulada (% que pasa
          cada malla) se actualiza en vivo.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-[11px] text-brand-gray mr-1 mt-1.5">Presets:</span>
          {presets.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setWeights(p.w)}
              className="text-[11px] px-2.5 py-1 rounded-full border border-zinc-300 hover:border-brand-yellow-dark hover:bg-yellow-50 transition text-brand-gray hover:text-brand-dark"
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Sliders + mini pila */}
          <div className="space-y-2">
            {sieves.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-24 text-[11px] text-brand-gray font-mono">{s.label}</div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  step={1}
                  value={weights[i]}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    const next = [...weights];
                    next[i] = v;
                    setWeights(next);
                  }}
                  className="flex-1 accent-brand-yellow"
                />
                <span className="w-10 text-right font-mono text-xs text-brand-dark font-semibold">
                  {frac[i] > 0 ? (frac[i] * 100).toFixed(0) : 0}%
                </span>
              </div>
            ))}
          </div>

          {/* Curvas PSD: relativa (barras) y acumulada (línea) */}
          <div>
            {/* Frecuencia relativa (barras) */}
            <div className="flex justify-center">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Frecuencia relativa por malla">
                <rect x={margin.left} y={margin.top} width={plotW} height={plotH} fill="#fafafa" />
                {[0, 0.25, 0.5, 0.75, 1.0].map((c) => (
                  <line key={c} x1={margin.left} y1={margin.top + plotH - c * plotH} x2={margin.left + plotW} y2={margin.top + plotH - c * plotH} stroke="#e4e4e7" strokeWidth="0.5" strokeDasharray="2 2" />
                ))}
                {(() => {
                  const maxFrac = Math.max(...frac, 0.01);
                  const yBar = (v: number) => margin.top + plotH - (v / maxFrac) * plotH;
                  // Barras: una por cada fracción (mallas con tamaño > 0). El colector queda como barra extra a la izquierda.
                  const barEntries = sieves.map((s, i) => ({ size: s.size, frac: frac[i], i }));
                  return barEntries.map((b) => {
                    // Posición x: para malla con tamaño>0 usa xScale; para colector ponla justo antes del límite izquierdo del eje.
                    const cx = b.size > 0 ? xScale(b.size) : margin.left + 12;
                    const barW = 22;
                    const y = yBar(b.frac);
                    return (
                      <g key={`bar-${b.i}`}>
                        <rect x={cx - barW / 2} y={y} width={barW} height={margin.top + plotH - y} fill="#FFBF00" stroke="#1A1A1A" strokeWidth="0.6" opacity="0.85" />
                        {b.frac > 0.04 && (
                          <text x={cx} y={y - 3} textAnchor="middle" fontSize="9" fontWeight="700" fill="#1A1A1A">
                            {(b.frac * 100).toFixed(0)}%
                          </text>
                        )}
                      </g>
                    );
                  });
                })()}

                <line x1={margin.left} y1={margin.top + plotH} x2={margin.left + plotW} y2={margin.top + plotH} stroke="#27272a" strokeWidth="1.2" />
                <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + plotH} stroke="#27272a" strokeWidth="1.2" />

                {xAxisSizes.map((s) => (
                  <g key={`xb-${s}`}>
                    <line x1={xScale(s)} y1={margin.top + plotH} x2={xScale(s)} y2={margin.top + plotH + 3} stroke="#27272a" strokeWidth="1" />
                    <text x={xScale(s)} y={margin.top + plotH + 16} textAnchor="middle" fontSize="9" fill="#27272a">
                      {s >= 1000 ? `${s / 1000}mm` : `${s}μm`}
                    </text>
                  </g>
                ))}
                <text x={margin.left + plotW / 2} y={H - 8} textAnchor="middle" fontSize="11" fontWeight="700" fill="#27272a">
                  Apertura de malla (log)
                </text>
                <text x={14} y={margin.top + plotH / 2} transform={`rotate(-90 14 ${margin.top + plotH / 2})`} textAnchor="middle" fontSize="11" fontWeight="700" fill="#b45309">
                  Frecuencia relativa
                </text>
              </svg>
            </div>

            {/* Acumulada que pasa */}
            <div className="flex justify-center mt-3">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Curva acumulada de tamizado">
                <rect x={margin.left} y={margin.top} width={plotW} height={plotH} fill="#fafafa" />
                {[0, 0.25, 0.5, 0.75, 1.0].map((c) => (
                  <line key={c} x1={margin.left} y1={yScale(c)} x2={margin.left + plotW} y2={yScale(c)} stroke="#e4e4e7" strokeWidth="0.5" strokeDasharray="2 2" />
                ))}
                {xAxisSizes.map((s) => (
                  <line key={s} x1={xScale(s)} y1={margin.top} x2={xScale(s)} y2={margin.top + plotH} stroke="#e4e4e7" strokeWidth="0.5" strokeDasharray="2 2" />
                ))}

                <path d={pathD} stroke="#1d4ed8" strokeWidth="2.5" fill="none" />
                {sortedPts.map((p, k) => (
                  <circle key={k} cx={xScale(p.size)} cy={yScale(p.pass)} r="4" fill="#FFBF00" stroke="#1A1A1A" strokeWidth="1" />
                ))}

                <line x1={margin.left} y1={margin.top + plotH} x2={margin.left + plotW} y2={margin.top + plotH} stroke="#27272a" strokeWidth="1.2" />
                <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + plotH} stroke="#27272a" strokeWidth="1.2" />

                {xAxisSizes.map((s) => (
                  <g key={`xl-${s}`}>
                    <line x1={xScale(s)} y1={margin.top + plotH} x2={xScale(s)} y2={margin.top + plotH + 3} stroke="#27272a" strokeWidth="1" />
                    <text x={xScale(s)} y={margin.top + plotH + 16} textAnchor="middle" fontSize="9" fill="#27272a">
                      {s >= 1000 ? `${s / 1000}mm` : `${s}μm`}
                    </text>
                  </g>
                ))}
                {[0, 0.5, 1.0].map((c) => (
                  <text key={c} x={margin.left - 6} y={yScale(c) + 4} textAnchor="end" fontSize="10" fill="#27272a">
                    {(c * 100).toFixed(0)}%
                  </text>
                ))}
                <text x={margin.left + plotW / 2} y={H - 8} textAnchor="middle" fontSize="11" fontWeight="700" fill="#27272a">
                  Apertura de malla (log)
                </text>
                <text x={14} y={margin.top + plotH / 2} transform={`rotate(-90 14 ${margin.top + plotH / 2})`} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1d4ed8">
                  % que pasa (acumulado)
                </text>
              </svg>
            </div>
            <p className="text-xs text-brand-gray italic text-center mt-2">
              <strong className="text-amber-700">Arriba</strong>: cuánto peso quedó retenido en cada malla (frecuencia relativa).
              {' '}<strong className="text-blue-700">Abajo</strong>: porcentaje acumulado que <em>pasa</em> cada malla. La acumulada se desplaza
              hacia la izquierda con más finos, hacia la derecha con más gruesos; una distribución bimodal
              produce dos picos en la barra y una S doble en la acumulada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Sedimentación: dos cilindros animados (finos lentos / gruesos rápidos) ─── */
const SedimentationJarsAnim: React.FC = () => {
  // Usamos CSS @keyframes generados dinámicamente en el <style> del componente para
  // simular partículas cayendo a velocidades distintas según el radio (Stokes).
  const fineCount = 18;
  const coarseCount = 14;
  const fineDelays = Array.from({ length: fineCount }, (_, i) => (i * 0.45) % 8);
  const coarseDelays = Array.from({ length: coarseCount }, (_, i) => (i * 0.35) % 3);

  return (
    <div className="my-6 not-prose">
      <style>{`
        @keyframes sedim-fall-slow { 0%{ transform: translateY(-10px); } 100%{ transform: translateY(180px); } }
        @keyframes sedim-fall-fast { 0%{ transform: translateY(-10px); } 100%{ transform: translateY(180px); } }
        .sedim-fine  { animation: sedim-fall-slow 8s linear infinite; }
        .sedim-coarse{ animation: sedim-fall-fast 3s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .sedim-fine, .sedim-coarse { animation: none; }
        }
      `}</style>
      <div className="rounded-xl bg-white border border-zinc-200 p-4 sm:p-6 shadow-sm">
        <h4 className="text-base font-semibold text-brand-dark mb-3 text-center">
          Sedimentación: gruesas caen rápido, finas caen lento
        </h4>
        <div className="flex justify-center">
          <svg viewBox="0 0 420 280" className="w-full max-w-[460px]" aria-hidden="true">
            {/* Cilindro 1 — finas */}
            <g>
              <rect x="40" y="30" width="140" height="210" rx="4" fill="#e0f2fe" stroke="#1A1A1A" strokeWidth="2" />
              <ellipse cx="110" cy="32" rx="70" ry="4" fill="#38bdf8" />
              {fineDelays.map((d, i) => {
                const cx = 55 + (i * 7.5) % 130;
                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy="30"
                    r="1.8"
                    fill="#b45309"
                    stroke="#1A1A1A"
                    strokeWidth="0.4"
                    className="sedim-fine"
                    style={{ animationDelay: `${-d}s` }}
                  />
                );
              })}
              {/* Sedimento acumulado (delgado) */}
              <path d="M 40 232 Q 110 226 180 232 L 180 240 L 40 240 Z" fill="#b45309" stroke="#1A1A1A" strokeWidth="1" />
              <text x="110" y="260" textAnchor="middle" fontSize="12" fontWeight="700" fill="#27272a">Partículas finas</text>
              <text x="110" y="274" textAnchor="middle" fontSize="10" fill="#52525b" fontStyle="italic">v_t ∝ d² → muy lenta</text>
            </g>
            {/* Cilindro 2 — gruesas */}
            <g>
              <rect x="240" y="30" width="140" height="210" rx="4" fill="#e0f2fe" stroke="#1A1A1A" strokeWidth="2" />
              <ellipse cx="310" cy="32" rx="70" ry="4" fill="#38bdf8" />
              {coarseDelays.map((d, i) => {
                const cx = 258 + (i * 9) % 124;
                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy="30"
                    r="5"
                    fill="#FFBF00"
                    stroke="#1A1A1A"
                    strokeWidth="0.6"
                    className="sedim-coarse"
                    style={{ animationDelay: `${-d}s` }}
                  />
                );
              })}
              {/* Sedimento acumulado (grueso) */}
              <path d="M 240 220 Q 310 210 380 220 L 380 240 L 240 240 Z" fill="#FFBF00" stroke="#1A1A1A" strokeWidth="1" />
              <text x="310" y="260" textAnchor="middle" fontSize="12" fontWeight="700" fill="#27272a">Partículas gruesas</text>
              <text x="310" y="274" textAnchor="middle" fontSize="10" fill="#52525b" fontStyle="italic">v_t ∝ d² → rápida</text>
            </g>
            {/* Flecha de gravedad */}
            <path d="M 205 85 L 205 155 M 200 150 L 205 155 L 210 150" stroke="#dc2626" strokeWidth="2" fill="none" />
            <text x="205" y="78" textAnchor="middle" fontSize="12" fontWeight="700" fill="#dc2626">g</text>
          </svg>
        </div>
        <p className="text-xs text-center text-brand-gray italic mt-3 max-w-2xl mx-auto">
          Por la Ley de Stokes, la velocidad terminal crece con el cuadrado del diámetro. Una partícula el
          doble de grande cae ~4 veces más rápido — por eso las gruesas llegan al fondo antes.
        </p>
      </div>
    </div>
  );
};

/* ─── Difracción láser: partícula en canal microfluídico + detector ─── */
const LaserDiffractionAnim: React.FC = () => (
  <div className="my-6 not-prose">
    <style>{`
      @keyframes laser-flow { 0%{ transform: translateX(-40px); } 100%{ transform: translateX(340px); } }
      @keyframes laser-pulse { 0%, 100%{ opacity: 0.25 } 50%{ opacity: 1 } }
      @keyframes laser-signal { 0%{ transform: translateX(0); } 100%{ transform: translateX(-70px); } }
      .ldz-p1 { animation: laser-flow 4.5s linear infinite; }
      .ldz-p2 { animation: laser-flow 4.5s linear infinite; animation-delay: -1.2s; }
      .ldz-p3 { animation: laser-flow 4.5s linear infinite; animation-delay: -2.7s; }
      .ldz-p4 { animation: laser-flow 4.5s linear infinite; animation-delay: -3.8s; }
      .ldz-beam { animation: laser-pulse 4.5s ease-in-out infinite; }
      .ldz-sig { animation: laser-signal 3s linear infinite; }
      @media (prefers-reduced-motion: reduce) { .ldz-p1,.ldz-p2,.ldz-p3,.ldz-p4,.ldz-beam,.ldz-sig{animation:none} }
    `}</style>
    <div className="rounded-xl bg-white border border-zinc-200 p-4 sm:p-6 shadow-sm">
      <h4 className="text-base font-semibold text-brand-dark mb-3 text-center">
        Difracción láser en canal microfluídico
      </h4>
      <div className="flex justify-center">
        <svg viewBox="0 0 520 260" className="w-full max-w-[560px]" aria-hidden="true">
          {/* Fuente láser */}
          <rect x="30" y="90" width="50" height="30" fill="#1A1A1A" rx="3" />
          <text x="55" y="85" textAnchor="middle" fontSize="10" fontWeight="700" fill="#27272a">LÁSER</text>
          {/* Haz entrante */}
          <line x1="80" y1="105" x2="140" y2="105" stroke="#dc2626" strokeWidth="2.5" className="ldz-beam" />
          {/* Canal microfluídico (caja alargada) */}
          <rect x="140" y="85" width="220" height="40" fill="#dbeafe" stroke="#1A1A1A" strokeWidth="1.8" rx="4" />
          {/* Líneas guía del canal */}
          <line x1="140" y1="93" x2="360" y2="93" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="140" y1="117" x2="360" y2="117" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2 2" />
          <text x="250" y="78" textAnchor="middle" fontSize="10" fontWeight="700" fill="#27272a">canal de flujo</text>
          {/* Partículas en el canal */}
          <g>
            <circle cx="140" cy="102" r="5" fill="#FFBF00" stroke="#1A1A1A" strokeWidth="0.6" className="ldz-p1" />
            <circle cx="140" cy="108" r="3" fill="#FFBF00" stroke="#1A1A1A" strokeWidth="0.6" className="ldz-p2" />
            <circle cx="140" cy="105" r="6" fill="#FFBF00" stroke="#1A1A1A" strokeWidth="0.6" className="ldz-p3" />
            <circle cx="140" cy="111" r="2" fill="#FFBF00" stroke="#1A1A1A" strokeWidth="0.6" className="ldz-p4" />
          </g>
          {/* Haz saliente + difracción */}
          <line x1="360" y1="105" x2="420" y2="105" stroke="#dc2626" strokeWidth="2.5" opacity="0.6" />
          {[-35, -22, -12, 0, 12, 22, 35].map((a) => {
            const rad = (a * Math.PI) / 180;
            const x2 = 360 + Math.cos(rad) * 100;
            const y2 = 105 + Math.sin(rad) * 100;
            return <line key={a} x1="360" y1="105" x2={x2} y2={y2} stroke="#dc2626" strokeWidth="1" opacity="0.55" strokeDasharray={a === 0 ? '0' : '3 2'} />;
          })}
          {/* Arco detector */}
          <path d="M 470 40 A 110 110 0 0 1 470 170" fill="none" stroke="#0369a1" strokeWidth="4.5" strokeLinecap="round" />
          <text x="490" y="107" fontSize="10" fontWeight="700" fill="#0369a1">arco detector</text>
          {/* Computador */}
          <g transform="translate(190 170)">
            <rect x="0" y="0" width="140" height="60" fill="#1A1A1A" stroke="#1A1A1A" strokeWidth="1.5" rx="3" />
            <rect x="4" y="4" width="132" height="46" fill="#052e16" />
            {/* Señal (curva acumulando/moviéndose) */}
            <g className="ldz-sig">
              {[
                [0, 40], [10, 38], [20, 30], [30, 20], [40, 22], [50, 35], [60, 40], [70, 36],
                [80, 30], [90, 18], [100, 16], [110, 28], [120, 38], [130, 42], [140, 40],
                [150, 32], [160, 22], [170, 28], [180, 38], [190, 42],
              ].map(([x, y], k, a) => {
                if (k === 0) return null;
                const prev = a[k - 1];
                return <line key={k} x1={prev[0] + 4} y1={prev[1] + 4} x2={x + 4} y2={y + 4} stroke="#22c55e" strokeWidth="1.6" />;
              })}
            </g>
            <rect x="60" y="60" width="20" height="8" fill="#27272a" />
            <text x="70" y="75" textAnchor="middle" fontSize="8" fontWeight="700" fill="#27272a">computador</text>
          </g>
          {/* Línea del detector al computador */}
          <path d="M 460 140 Q 380 160 330 180" fill="none" stroke="#0369a1" strokeWidth="1" strokeDasharray="3 2" />
        </svg>
      </div>
      <p className="text-xs text-center text-brand-gray italic mt-3 max-w-2xl mx-auto">
        Las partículas fluyen por el canal y cruzan el haz. El ángulo de dispersión depende del tamaño:
        partículas grandes dispersan más hacia adelante, las pequeñas en ángulos mayores. El detector
        registra el patrón y el computador lo invierte (Mie/Fraunhofer) para obtener la DTP.
      </p>
    </div>
  </div>
);

/* ─── Coulter: animación con pulso externo sincronizado ─── */
const CoulterAnim: React.FC = () => (
  <div className="my-6 not-prose">
    <style>{`
      @keyframes coulter-cross { 0%{ transform: translate(0,0); } 100%{ transform: translate(100px, 0); } }
      @keyframes coulter-pulse { 0%, 100%{ opacity: 0; } 10%, 18%{ opacity: 1; } 20%{ opacity: 0; } }
      .cou-p { animation: coulter-cross 3.4s linear infinite; }
      .cou-p.d1 { animation-delay: -0.2s; }
      .cou-p.d2 { animation-delay: -1.5s; }
      .cou-p.d3 { animation-delay: -2.8s; }
      .cou-flash { animation: coulter-pulse 3.4s linear infinite; }
      .cou-flash.d1 { animation-delay: -0.2s; }
      .cou-flash.d2 { animation-delay: -1.5s; }
      .cou-flash.d3 { animation-delay: -2.8s; }
      @media (prefers-reduced-motion: reduce) { .cou-p, .cou-flash { animation: none } }
    `}</style>
    <div className="rounded-xl bg-white border border-zinc-200 p-4 sm:p-6 shadow-sm">
      <h4 className="text-base font-semibold text-brand-dark mb-3 text-center">
        Contador Coulter: cada partícula genera un pulso en el osciloscopio
      </h4>
      <div className="flex justify-center">
        <svg viewBox="0 0 560 260" className="w-full max-w-[600px]" aria-hidden="true">
          {/* Contenedor izquierdo */}
          <rect x="30" y="60" width="150" height="170" fill="#e0f2fe" stroke="#1A1A1A" strokeWidth="2" rx="3" />
          <ellipse cx="105" cy="62" rx="72" ry="4" fill="#38bdf8" />
          {/* Contenedor derecho */}
          <rect x="260" y="60" width="150" height="170" fill="#e0f2fe" stroke="#1A1A1A" strokeWidth="2" rx="3" />
          <ellipse cx="335" cy="62" rx="72" ry="4" fill="#38bdf8" />
          {/* Orificio en el medio */}
          <rect x="180" y="135" width="80" height="20" fill="#1A1A1A" />
          <rect x="216" y="139" width="8" height="12" fill="#e0f2fe" />
          <text x="220" y="130" textAnchor="middle" fontSize="9" fontWeight="700" fill="#27272a">orificio</text>
          {/* Electrodos */}
          <rect x="95" y="40" width="20" height="24" fill="#1A1A1A" />
          <rect x="325" y="40" width="20" height="24" fill="#1A1A1A" />
          <line x1="105" y1="30" x2="335" y2="30" stroke="#1A1A1A" strokeWidth="1.5" />
          <rect x="200" y="14" width="40" height="20" fill="#e4e4e7" stroke="#1A1A1A" strokeWidth="1.5" rx="2" />
          <text x="220" y="28" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1A1A1A">+ −</text>
          {/* Partículas en reposo (lado izquierdo) */}
          {[[55, 185], [80, 205], [130, 175], [65, 205], [150, 200]].map(([cx, cy], i) => (
            <circle key={`st-${i}`} cx={cx} cy={cy} r="4" fill="#FFBF00" stroke="#1A1A1A" strokeWidth="0.6" />
          ))}
          {/* 3 partículas animadas cruzando el orificio (comienzan en el lado izquierdo, terminan del otro lado) */}
          {[0, 1, 2].map((i) => (
            <circle
              key={`an-${i}`}
              cx={160}
              cy={145}
              r={3 + i}
              fill="#ef4444"
              stroke="#1A1A1A"
              strokeWidth="0.7"
              className={`cou-p d${i + 1}`}
            />
          ))}
          {/* Flash cuando la partícula cruza (pequeño círculo rojo sobre el orificio) */}
          {[0, 1, 2].map((i) => (
            <circle
              key={`fl-${i}`}
              cx="220"
              cy="145"
              r="12"
              fill="none"
              stroke="#ef4444"
              strokeWidth="1.5"
              className={`cou-flash d${i + 1}`}
            />
          ))}
          {/* Etiqueta */}
          <text x="220" y="245" textAnchor="middle" fontSize="10" fill="#52525b" fontStyle="italic">electrolito</text>

          {/* === Osciloscopio externo === */}
          <g transform="translate(420 60)">
            <rect x="0" y="0" width="130" height="150" fill="#1A1A1A" stroke="#1A1A1A" strokeWidth="1.5" rx="3" />
            <text x="65" y="-6" textAnchor="middle" fontSize="10" fontWeight="700" fill="#27272a">osciloscopio</text>
            <rect x="4" y="4" width="122" height="100" fill="#052e16" />
            {/* Grid tenue */}
            {[1, 2, 3, 4].map((i) => (
              <line key={`gvx-${i}`} x1={4 + i * 24} y1="4" x2={4 + i * 24} y2="104" stroke="#14532d" strokeWidth="0.5" />
            ))}
            {[1, 2, 3].map((i) => (
              <line key={`gvy-${i}`} x1="4" y1={4 + i * 25} x2="126" y2={4 + i * 25} stroke="#14532d" strokeWidth="0.5" />
            ))}
            {/* Línea base + 3 pulsos sincronizados a los delays */}
            <g>
              {/* Trazo "siempre" verde alrededor de baseline */}
              <path
                d="M 4 75 L 24 75 L 26 70 L 28 64 L 30 58 L 32 64 L 34 75 L 52 75 L 54 72 L 56 66 L 58 55 L 60 66 L 62 72 L 64 75 L 90 75 L 92 70 L 94 60 L 96 46 L 98 60 L 100 70 L 102 75 L 126 75"
                fill="none"
                stroke="#22c55e"
                strokeWidth="1.6"
              />
              <text x="27" y="92" textAnchor="middle" fontSize="7" fill="#22c55e" opacity="0.8">pequeña</text>
              <text x="58" y="92" textAnchor="middle" fontSize="7" fill="#22c55e" opacity="0.8">mediana</text>
              <text x="96" y="92" textAnchor="middle" fontSize="7" fill="#22c55e" opacity="0.8">grande</text>
            </g>
            {/* Rótulos */}
            <text x="65" y="122" textAnchor="middle" fontSize="9" fill="#d4d4d8">amplitud ∝ volumen</text>
            <text x="65" y="135" textAnchor="middle" fontSize="8" fill="#71717a">cada pulso = 1 partícula</text>
            {/* Perillas */}
            <circle cx="15" cy="142" r="5" fill="#78716c" stroke="#27272a" strokeWidth="1" />
            <circle cx="35" cy="142" r="5" fill="#78716c" stroke="#27272a" strokeWidth="1" />
          </g>
          {/* Cable del electrodo al osciloscopio */}
          <path d="M 345 40 Q 395 40 420 80" fill="none" stroke="#78716c" strokeWidth="1.8" />
        </svg>
      </div>
      <p className="text-xs text-center text-brand-gray italic mt-3 max-w-2xl mx-auto">
        Cada vez que una partícula cruza el orificio (flash rojo) desplaza electrolito y cambia la
        resistencia. El osciloscopio <strong>externo</strong> registra el pulso: amplitud proporcional al
        volumen de la partícula.
      </p>
    </div>
  </div>
);

const SvgFigure: React.FC<{ children: React.ReactNode; caption: React.ReactNode }> = ({ children, caption }) => (
  <figure className="my-8 not-prose flex flex-col items-center">
    <div className="w-full flex justify-center rounded-xl bg-zinc-50 border border-zinc-200 p-4 sm:p-6">
      {children}
    </div>
    <figcaption className="text-center text-sm text-brand-gray mt-3 italic max-w-2xl">{caption}</figcaption>
  </figure>
);

const DensityTypesTabs: React.FC = () => {
  const [tab, setTab] = useState<'verdadera' | 'aparente' | 'masal' | 'efectiva'>('verdadera');
  useKatexRerender([tab]);

  const tabs = [
    { id: 'verdadera', label: 'Verdadera' },
    { id: 'aparente', label: 'Aparente (partícula)' },
    { id: 'masal', label: 'Masal (lecho)' },
    { id: 'efectiva', label: 'Efectiva' },
  ] as const;

  return (
    <div className="my-6 not-prose">
      <div role="tablist" aria-label="Tipos de densidad" className="flex gap-2 border-b border-zinc-200 flex-wrap">
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
        {tab === 'verdadera' && (
          <div>
            <p className="text-brand-gray leading-relaxed">
              <strong>Densidad verdadera</strong> ({String.raw`$\rho_\text{verdadera}$`}): densidad
              del material sólido en sí, <em>excluyendo todos los poros</em> (tanto abiertos como
              cerrados). Se mide comúnmente con picnometría de helio, porque el He penetra incluso
              en poros muy pequeños.
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              {'$$\\rho_\\text{verdadera} = \\dfrac{m_\\text{sólido}}{V_\\text{sólido sin poros}}$$'}
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              <strong>Cuándo usarla:</strong> como referencia termodinámica del material, para
              calcular la porosidad intraparticular total, y en cálculos de composición.
            </p>
          </div>
        )}
        {tab === 'aparente' && (
          <div>
            <p className="text-brand-gray leading-relaxed">
              <strong>Densidad aparente o de partícula</strong>
              ({String.raw`$\rho_\text{aparente}$`}): masa de una partícula dividida por su volumen
              total (sólido + poros cerrados), <em>sin contar los huecos entre partículas</em>.
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              {'$$\\rho_\\text{aparente} = \\dfrac{m_\\text{partícula}}{V_\\text{sólido} + V_\\text{poros cerrados}}$$'}
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              <strong>Cuándo usarla:</strong> en modelos de sedimentación, transporte neumático,
              fluidización y cálculos de velocidad terminal. Se mide por picnometría de líquido.
            </p>
          </div>
        )}
        {tab === 'masal' && (
          <div>
            <p className="text-brand-gray leading-relaxed">
              <strong>Densidad masal o aparente del lecho</strong>
              ({String.raw`$\rho_\text{masal}$`}): masa total de polvo dividida por el volumen
              ocupado por el lecho <em>incluyendo los huecos interparticulares</em>. Es la densidad
              que "percibe" un silo o un empaque.
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              {'$$\\rho_\\text{masal} = \\dfrac{m_\\text{polvo}}{V_\\text{lecho}}$$'}
            </p>
            <ul className="mt-3 pl-5 list-disc space-y-1 text-brand-gray leading-relaxed">
              <li>
                <strong>Densidad masal suelta</strong> ({String.raw`$\rho_\text{suelta}$`}):
                después de verter libremente el polvo, sin compactar.
              </li>
              <li>
                <strong>Densidad masal compactada</strong> ({String.raw`$\rho_\text{compactada}$`}):
                después de aplicar golpeteo estandarizado (típicamente 500–1250 <em>taps</em>).
              </li>
            </ul>
            <p className="text-brand-gray leading-relaxed mt-2">
              <strong>Cuándo usarla:</strong> dimensionar silos, tolvas y empaques; estimar masa de
              producto por volumen de recipiente.
            </p>
          </div>
        )}
        {tab === 'efectiva' && (
          <div>
            <p className="text-brand-gray leading-relaxed">
              <strong>Densidad efectiva de partícula</strong>: incluye <em>tanto poros abiertos
              como cerrados</em>. Es la densidad que gobierna la interacción hidrodinámica con un
              fluido que puede (o no) penetrar en los poros accesibles.
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              <strong>Cuándo usarla:</strong> procesos donde un fluido rodea pero no llena la
              partícula (flujo a través de lecho fijo, filtración, secado) — relevante cuando la
              partícula tiene poros abiertos significativos (catalizadores, granos hinchados).
            </p>
          </div>
        )}
      </div>

      <DensityComparisonViz />
    </div>
  );
};

/* ─── Stepper: procedimiento del picnómetro ─── */
const PycnometerStepper: React.FC = () => {
  const [step, setStep] = useState(1);
  useKatexRerender([step]);

  const pasos = [
    {
      title: 'Pesar el picnómetro vacío',
      body: (
        <>
          <p>
            Se pesa el picnómetro limpio y seco en una balanza analítica. Esta masa base es
            {' '}{String.raw`$m_\text{pic}$`}.
          </p>
          <p className="text-xs text-brand-gray italic mt-2">
            Es crítico que esté seco — cualquier humedad residual introduce un error sistemático.
          </p>
        </>
      ),
    },
    {
      title: 'Añadir polvo y pesar',
      body: (
        <>
          <p>
            Se añade una cantidad conocida de polvo al picnómetro (típicamente llenando 30–50 % del
            volumen) y se pesa el conjunto ({String.raw`$m_{\text{pic+p}}$`}). La masa del polvo se
            obtiene por diferencia:
          </p>
          <p className="mt-2">{'$$m_p = m_{\\text{pic+p}} - m_{\\text{pic}}$$'}</p>
        </>
      ),
    },
    {
      title: 'Llenar con líquido eliminando burbujas',
      body: (
        <>
          <p>
            Se completa el picnómetro con un líquido de densidad conocida
            ({String.raw`$\rho_\text{liq}$`}) — típicamente agua destilada, o un solvente no polar
            si el polvo es hidrófilo. <strong>Eliminar burbujas</strong> por ultrasonicación o
            vacío para que el líquido ocupe todos los huecos accesibles.
          </p>
          <p>Se pesa el conjunto: {String.raw`$m_{\text{pic}+p+\text{liq}}$`}.</p>
        </>
      ),
    },
    {
      title: 'Pesar el picnómetro solo con líquido',
      body: (
        <>
          <p>
            En un experimento paralelo, se llena el picnómetro <em>solo con líquido</em> hasta la
            marca de calibración y se pesa ({String.raw`$m_{\text{pic}+\text{liq}}$`}).
          </p>
          <p className="mt-2">
            Masa del líquido que llena todo el picnómetro:
            {' '}{String.raw`$m_\text{liq} = m_{\text{pic}+\text{liq}} - m_\text{pic}$`}.
          </p>
        </>
      ),
    },
    {
      title: 'Calcular el volumen del picnómetro',
      body: (
        <>
          <p>A partir de la masa y densidad del líquido:</p>
          <p className="mt-2">{'$$V_\\text{pic} = \\dfrac{m_\\text{liq}}{\\rho_\\text{liq}}$$'}</p>
          <p className="text-xs text-brand-gray italic mt-2">
            Este volumen es la constante de calibración del picnómetro — lo ideal es verificarlo
            periódicamente.
          </p>
        </>
      ),
    },
    {
      title: 'Calcular masa y volumen del líquido con polvo',
      body: (
        <>
          <p>Masa del líquido que ocupa el espacio restante cuando hay polvo:</p>
          <p className="mt-2">
            {"$$m'_\\text{liq} = m_{\\text{pic}+p+\\text{liq}} - m_{\\text{pic}+p}$$"}
          </p>
          <p className="mt-2">Volumen correspondiente:</p>
          <p className="mt-2">
            {"$$V'_\\text{liq} = \\dfrac{m'_\\text{liq}}{\\rho_\\text{liq}}$$"}
          </p>
        </>
      ),
    },
    {
      title: 'Calcular el volumen de las partículas',
      body: (
        <>
          <p>Por diferencia de volúmenes:</p>
          <p className="mt-2">
            {"$$V_p = V_\\text{pic} - V'_\\text{liq}$$"}
          </p>
          <p className="text-xs text-brand-gray italic mt-2">
            Este volumen excluye poros abiertos accesibles al líquido — por eso da la densidad de
            partícula, no la densidad verdadera.
          </p>
        </>
      ),
    },
    {
      title: 'Calcular la densidad de partícula',
      body: (
        <>
          <p>Aplicar la definición:</p>
          <p className="mt-2">
            {"$$\\rho_\\text{aparente} = \\dfrac{m_p}{V_p} = \\dfrac{m_p}{V_\\text{pic} - V'_\\text{liq}}$$"}
          </p>
          <p className="text-xs text-brand-gray italic mt-2">
            Repetir 3–5 veces y reportar promedio ± desviación estándar. Si se usa He en lugar de
            líquido, el resultado se acerca a la densidad <em>verdadera</em>.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="my-6 not-prose">
      <div role="tablist" aria-label="Pasos del procedimiento del picnómetro" className="flex gap-1 flex-wrap mb-4">
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

/* ─── Tabs: tipos de diámetro equivalente ─── */
const DiameterTypesTabs: React.FC = () => {
  const [tab, setTab] = useState<'volumen' | 'superficie' | 'tamiz' | 'stokes'>('volumen');
  useKatexRerender([tab]);

  const tabs = [
    { id: 'volumen', label: 'Volumen ($d_v$)' },
    { id: 'superficie', label: 'Superficie ($d_s$)' },
    { id: 'tamiz', label: 'Tamiz ($d_t$)' },
    { id: 'stokes', label: 'Stokes' },
  ] as const;

  return (
    <div className="my-6 not-prose">
      <div role="tablist" aria-label="Tipos de diámetro equivalente" className="flex gap-2 border-b border-zinc-200 flex-wrap">
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
        {tab === 'volumen' && (
          <div>
            <p className="text-brand-gray leading-relaxed">
              <strong>Diámetro equivalente por volumen</strong> ($d_v$): diámetro de una esfera
              que tiene <em>el mismo volumen</em> que la partícula real.
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              {'$$d_v = \\left( \\dfrac{6 V_p}{\\pi} \\right)^{1/3}$$'}
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              <strong>Cuándo aplica:</strong> modelos de masa de partícula, cálculos de
              fluidización y empaquetamiento, simulaciones CFD-DEM donde el volumen es la variable
              física natural.
            </p>
            <VolumeDiameterSvg />
          </div>
        )}
        {tab === 'superficie' && (
          <div>
            <p className="text-brand-gray leading-relaxed">
              <strong>Diámetro equivalente por superficie</strong> ($d_s$): diámetro de una esfera
              con <em>la misma área superficial externa</em> que la partícula.
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              {'$$d_s = \\left( \\dfrac{A_p}{\\pi} \\right)^{1/2}$$'}
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              <strong>Cuándo aplica:</strong> procesos donde domina la interfaz sólido-fluido —
              disolución, catálisis, secado, transferencia de calor. También se combina con $d_v$
              en el <strong>diámetro de Sauter</strong>
              {' '}{String.raw`$d_{32} = d_v^3 / d_s^2$`}, muy usado en sprays y aerosoles.
            </p>
          </div>
        )}
        {tab === 'tamiz' && (
          <div>
            <p className="text-brand-gray leading-relaxed">
              <strong>Diámetro de tamiz</strong> ($d_t$): tamaño de la apertura cuadrada más
              pequeña a través de la cual la partícula <em>pasa</em> en un análisis granulométrico.
              Es <strong>el más común en la industria</strong> por su bajo costo y simplicidad.
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              <strong>Cuándo aplica:</strong> caracterización rutinaria de polvos gruesos y
              medios (entre ~38 μm y varios mm), control de calidad en molienda, clasificación por
              tamaño.
            </p>
            <Figure
              src="/classroom/iqya-2031/readings/propiedades-solidos-07.png"
              alt="Diámetro de tamiz"
              caption="Diámetro de tamiz ($d_t$): dimensión funcional de la partícula respecto al tamaño de apertura de malla cuadrada."
              maxWidth="400px"
            />
          </div>
        )}
        {tab === 'stokes' && (
          <div>
            <p className="text-brand-gray leading-relaxed">
              <strong>Diámetro de Stokes</strong> ({String.raw`$d_\text{Stokes}$`}, o <em>diámetro
              de caída libre</em>): diámetro de una esfera con <em>la misma velocidad terminal</em>
              que la partícula real en un fluido dado.
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              <strong>Cuándo aplica:</strong> procesos donde la partícula se mueve respecto al
              fluido — sedimentación, hidrociclones, transporte neumático, elutriación, separación
              gravimétrica. Es la única variable que "conoce" simultáneamente la forma, la
              densidad y la hidrodinámica.
            </p>
            <Figure
              src="/classroom/iqya-2031/readings/propiedades-solidos-08.png"
              alt="Diámetro de Stokes"
              caption="Diámetro de Stokes: la esfera hipotética que sedimenta a la misma velocidad que la partícula real en un fluido dado."
              maxWidth="400px"
            />
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Tabs: métodos de medición de DTP ─── */
const SizingMethodsTabs: React.FC = () => {
  const [tab, setTab] = useState<'tamiz' | 'micro' | 'sedim' | 'laser' | 'coulter'>('tamiz');
  useKatexRerender([tab]);

  const tabs = [
    { id: 'tamiz', label: 'Tamizado' },
    { id: 'micro', label: 'Microscopía' },
    { id: 'sedim', label: 'Sedimentación' },
    { id: 'laser', label: 'Difracción láser' },
    { id: 'coulter', label: 'Contador Coulter' },
  ] as const;

  return (
    <div className="my-6 not-prose">
      <div role="tablist" aria-label="Métodos de medición de DTP" className="flex gap-2 border-b border-zinc-200 flex-wrap">
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
        {tab === 'tamiz' && (
          <div>
            <p className="text-brand-gray leading-relaxed">
              <strong>Principio:</strong> una pila de tamices con aperturas de malla decrecientes
              (series Tyler o BS). El material se vierte en el tamiz superior y se agita; cada
              fracción queda retenida entre mallas consecutivas. Se pesa cada fracción y se grafica
              el % acumulado que pasa (o se retiene) en función del tamaño de apertura.
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              <strong>Rango útil:</strong> ~38 μm – 125 mm. Por debajo de 38 μm las partículas
              aglomeran y el método pierde precisión (se requiere tamizado en húmedo o air-jet).
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              <strong>Ventajas:</strong> económico, robusto, ampliamente estandarizado (ASTM, ISO).
              <strong> Limitaciones:</strong> da $d_t$ (no $d_v$), sensible a la forma, tiempo de
              tamizado y carga influyen en el resultado.
            </p>
            <SvgFigure
              caption="Pila de tamices con aperturas decrecientes: las partículas se distribuyen por tamaño. El colector inferior recoge los finos que atraviesan todas las mallas."
            >
              <MethodIcon kind="tamiz" />
            </SvgFigure>
            <SieveSimulator />
          </div>
        )}
        {tab === 'micro' && (
          <div>
            <p className="text-brand-gray leading-relaxed">
              <strong>Principio:</strong> observación directa bajo microscopio óptico o
              electrónico (SEM). Se mide el diámetro de Feret, el diámetro circular equivalente
              u otras proyecciones sobre imágenes digitales procesadas.
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              <strong>Rango útil:</strong> ~1 μm – 150 μm (óptico); &lt; 1 μm – nm (SEM / TEM).
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              <strong>Ventajas:</strong> caracteriza <em>simultáneamente</em> tamaño y forma —
              insustituible para validar otros métodos. <strong>Limitaciones:</strong> requiere
              contar estadísticamente muchas partículas (&gt; 1000), lento, costoso.
            </p>
            <Figure
              src="/classroom/iqya-2031/readings/propiedades-solidos-microscopia.png"
              alt="Esquema de un microscopio electrónico de barrido (SEM)"
              caption="Esquema de un microscopio electrónico de barrido (SEM)."
              maxWidth="640px"
            />
            <div className="my-4 rounded-xl border-l-4 border-brand-yellow bg-zinc-50 p-5 text-sm text-brand-dark leading-relaxed">
              <p className="font-semibold mb-2">Cómo funciona — paso a paso</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Un <strong>cañón de electrones</strong> (Electron Gun, en azul arriba) emite
                  un haz de electrones por efecto termoiónico o de campo. Estos electrones
                  reemplazan a la luz visible de un microscopio óptico — su menor longitud de
                  onda permite resoluciones de hasta unidades de nanómetro.
                </li>
                <li>
                  El <strong>haz de electrones</strong> (Electron Beam) es acelerado por una
                  diferencia de potencial entre el cañón y el <strong>ánodo</strong> (Anode,
                  en verde) — típicamente entre 1 y 30 kV. A mayor voltaje, mayor penetración
                  pero menor sensibilidad superficial.
                </li>
                <li>
                  Una <strong>lente condensadora</strong> (Condenser Lens, en naranja) — en
                  realidad un electroimán — colima el haz y controla la corriente que llegará
                  a la muestra.
                </li>
                <li>
                  La <strong>lente objetivo</strong> (Objective Lens, en rojo) enfoca el haz a
                  un punto muy fino (1–10 nm) sobre la muestra y lo barre línea a línea por
                  toda la zona de interés.
                </li>
                <li>
                  Al chocar contra la <strong>muestra</strong> (Sample/Stage), las partículas
                  emiten <strong>electrones secundarios</strong> (Secondary Electrons) — de
                  baja energía — que escapan únicamente desde los primeros nanómetros de la
                  superficie. Por eso el SEM es ideal para topografía.
                </li>
                <li>
                  El <strong>detector de electrones secundarios</strong> (Secondary Electron
                  Detector, en azul a la izquierda) cuenta los electrones que llegan en cada
                  punto del barrido. Más electrones = píxel más brillante.
                </li>
                <li>
                  La señal se sincroniza con la posición del haz y se construye en tiempo real
                  la <strong>imagen en escala de grises</strong> que aparece en el monitor: la
                  micrografía SEM. Sobre ella se mide el diámetro de Feret, el área proyectada
                  o el diámetro circular equivalente de cada partícula.
                </li>
              </ol>
              <p className="mt-3 text-xs italic text-brand-gray">
                Detalle: la muestra suele recubrirse con una capa fina de oro o carbono para
                evitar que se cargue eléctricamente y produzca artefactos. Todo el experimento
                ocurre en alto vacío para que los electrones no se dispersen contra moléculas
                de aire.
              </p>
            </div>
          </div>
        )}
        {tab === 'sedim' && (
          <div>
            <p className="text-brand-gray leading-relaxed">
              <strong>Principio:</strong> se dispersa el polvo en un fluido y se mide la velocidad
              de sedimentación. Por la <strong>Ley de Stokes</strong> (partícula esférica, flujo
              laminar):
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              {'$$v_t = \\dfrac{(\\rho_p - \\rho_f) \\, g \\, d^2}{18 \\, \\mu}$$'}
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              <strong>Rango útil:</strong> ~0.5 μm – 100 μm. Arriba de 100 μm, el flujo deja de
              ser laminar; abajo de 0.5 μm, el movimiento browniano domina.
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              <strong>Ventajas:</strong> da {String.raw`$d_\text{Stokes}$`}, directamente útil para
              diseño hidrodinámico. <strong>Limitaciones:</strong> lento, sensible a agregación.
            </p>
            <Figure
              src="/classroom/iqya-2031/readings/propiedades-solidos-sedimentacion.png"
              alt="Sedimentación de partículas a distintos tiempos"
              caption="Sedimentación: a t₀ todas las partículas están dispersas; a t₁ las gruesas (amarillas) ya alcanzaron el fondo; a t₂ se observa una estratificación clara — gruesas abajo, medianas (verdes) en el centro y finas (rojas) aún en suspensión. La distancia 'd' recorrida en un tiempo dado se invierte con la Ley de Stokes para obtener el diámetro."
              maxWidth="520px"
            />
            <p className="text-brand-gray leading-relaxed mt-3">
              <strong>¿Por qué se separan en orden de tamaño?</strong> En la Ley de Stokes la
              velocidad terminal $v_t$ depende del <strong>cuadrado del diámetro</strong>. Una
              partícula el doble de grande cae unas <strong>4 veces más rápido</strong> que otra
              de la mitad de tamaño en el mismo fluido. Por eso aparece la estratificación: a un
              tiempo dado, las gruesas ya recorrieron toda la columna mientras las finas apenas
              comienzan a bajar.
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              En la práctica se mide la <strong>concentración a una altura fija</strong> (por
              transmitancia, rayos X o pesaje del sedimento) en función del tiempo. Cada
              instante <em>t</em> corresponde, por Stokes, a una clase de tamaño {String.raw`$d(t)$`} — y
              la curva concentración–tiempo se invierte para reconstruir la DTP.
            </p>
          </div>
        )}
        {tab === 'laser' && (
          <div>
            <p className="text-brand-gray leading-relaxed">
              <strong>Principio:</strong> un láser atraviesa la suspensión o nube de partículas; el
              patrón angular de luz difractada se invierte con la teoría de Mie (o Fraunhofer) para
              obtener la DTP.
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              <strong>Rango útil:</strong> ~0.1 μm – 3000 μm en un solo equipo.
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              <strong>Ventajas:</strong> rapidísimo (&lt; 1 min), reproducible, amplio rango.
              {' '}<strong>Limitaciones:</strong> asume esfericidad, requiere buen índice de
              refracción, equipo costoso.
            </p>
            <Figure
              src="/classroom/iqya-2031/readings/propiedades-solidos-laser.png"
              alt="Esquema de un equipo de difracción láser"
              caption="Equipo de difracción láser: la muestra se dispersa, atraviesa una celda donde el láser genera un patrón de difracción, y los detectores anulares registran el patrón. El computador invierte (Mie/Fraunhofer) y entrega la DTP con d₁₀, d₅₀ y d₉₀ en menos de un minuto."
              maxWidth="640px"
            />
            <p className="text-brand-gray leading-relaxed mt-3">
              <strong>¿Cómo "lee" el equipo el tamaño?</strong> Cuando un haz coherente de luz
              atraviesa una nube de partículas, cada una <em>dispersa</em> luz en un patrón
              angular característico. El resultado clave es: las <strong>partículas grandes
              dispersan principalmente hacia adelante</strong> (ángulos pequeños), mientras que
              las <strong>pequeñas dispersan en ángulos mayores</strong> y de forma más
              isotrópica. Esa es la huella óptica de cada tamaño.
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              Un anillo de detectores fotosensibles registra simultáneamente la intensidad en
              decenas de ángulos. El computador invierte el patrón usando la <strong>teoría de
              Mie</strong> (rigurosa, requiere conocer el índice de refracción complejo) o la
              aproximación de <strong>Fraunhofer</strong> (válida para $d \gg \lambda$). El
              resultado es una DTP en cuestión de segundos — sin tocar la muestra y con miles de
              partículas medidas en paralelo.
            </p>
          </div>
        )}
        {tab === 'coulter' && (
          <div>
            <p className="text-brand-gray leading-relaxed">
              <strong>Principio:</strong> las partículas suspendidas en un electrolito pasan una a
              una a través de un pequeño orificio entre dos electrodos. Cada partícula que cruza
              desplaza su propio volumen de electrolito y genera un pulso de resistencia
              proporcional al volumen desplazado.
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              <strong>Rango útil:</strong> ~0.4 μm – 1200 μm (según tamaño del orificio).
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              <strong>Ventajas:</strong> mide $d_v$ directamente, alta resolución, cuenta número
              de partículas. <strong>Limitaciones:</strong> requiere partículas no conductoras
              suspendidas en electrolito, una apertura por rango de tamaño.
            </p>
            <Figure
              src="/classroom/iqya-2031/readings/propiedades-solidos-coulter.gif"
              alt="Animación del principio del contador Coulter"
              caption="Contador Coulter: las partículas suspendidas en electrolito cruzan una apertura entre dos electrodos. Cada paso desplaza electrolito y genera un pulso eléctrico proporcional al volumen — directamente d_v, sin asunción de forma."
              maxWidth="420px"
            />
            <p className="text-brand-gray leading-relaxed mt-3">
              <strong>¿Qué se mide exactamente?</strong> Entre los dos electrodos circula una
              corriente constante a través de la apertura llena de electrolito conductor. Cada
              vez que una partícula <em>no conductora</em> cruza el orificio, desplaza un
              volumen equivalente de electrolito y la <strong>resistencia eléctrica sube
              brevemente</strong>. Eso genera un pulso de voltaje cuya amplitud es directamente
              proporcional al volumen de la partícula.
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              El sistema cuenta y digitaliza decenas de miles de pulsos por segundo. Como cada
              pulso = una partícula y su altura = su volumen, el equipo entrega <strong>número
              de partículas y $d_v$</strong> sin asumir forma ni propiedades ópticas — algo que
              ningún otro método logra al mismo tiempo. Es el estándar para hemogramas
              (contadores de glóbulos), polvos farmacéuticos finos y partículas en
              microelectrónica.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Galería de formas comunes ─── */
const formas = [
  {
    id: 'acicular',
    nombre: 'Acicular',
    phi: '0.3 – 0.5',
    descripcion:
      'Partículas alargadas en forma de aguja, con relación longitud/diámetro alta. Se entrelazan mecánicamente, lo que dificulta el flujo pero puede aumentar la resistencia de compactos.',
    ejemplo: 'Cristales de caseína, fibras de celulosa corta, sulfato de calcio anhidro.',
  },
  {
    id: 'fibrosa',
    nombre: 'Fibrosa',
    phi: '0.2 – 0.4',
    descripcion:
      'Aún más alargadas que las aciculares, con relación L/D &gt; 10. Forman agregados entrelazados densos. Muy malas para fluidizar.',
    ejemplo: 'Fibras de algodón, pulpa de papel, asbestos.',
  },
  {
    id: 'granular',
    nombre: 'Granular',
    phi: '0.7 – 0.8',
    descripcion:
      'Forma irregular tridimensional sin una dimensión dominante. La mayoría de polvos industriales caen en esta categoría.',
    ejemplo: 'Azúcar, sal, café molido, arena de río, fertilizantes.',
  },
  {
    id: 'esferica',
    nombre: 'Esférica',
    phi: '≈ 1.0',
    descripcion:
      'Geometría ideal: máxima esfericidad, mínima área superficial por volumen, empaquetamiento predecible y flujo libre.',
    ejemplo: 'Perdigones metálicos, microesferas de vidrio, spray-dried milk, polvo atomizado.',
  },
  {
    id: 'laminar',
    nombre: 'Laminar',
    phi: '0.2 – 0.6',
    descripcion:
      'Forma de hojuela o placa: dos dimensiones dominantes, una pequeña. Se orientan durante el flujo (anisotropía) y se empaquetan de forma muy densa.',
    ejemplo: 'Mica, grafito en hojuelas, copos de maíz, pigmentos perlados.',
  },
  {
    id: 'cubica',
    nombre: 'Cúbica',
    phi: '≈ 0.81',
    descripcion:
      'Cristales con simetría cúbica — tres dimensiones comparables y caras planas. Empaque eficiente y flujo razonable.',
    ejemplo: 'Sal de mesa (NaCl), azúcar moscabada fina, algunos cristales farmacéuticos.',
  },
];

const ShapeGallery: React.FC = () => {
  const [active, setActive] = useState<string>('esferica');
  useKatexRerender([active]);
  const formaActiva = formas.find((f) => f.id === active) ?? formas[3];

  return (
    <div className="my-6 not-prose">
      <p className="text-sm text-brand-gray mb-3">
        Haz clic en una morfología para explorar su descripción, esfericidad típica y ejemplos
        industriales.
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
        {formas.map((f) => (
          <button
            key={f.id}
            onClick={() => setActive(f.id)}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition-colors ${
              active === f.id
                ? 'bg-brand-dark text-white border-brand-dark'
                : 'bg-white text-brand-gray border-zinc-200 hover:border-brand-yellow hover:text-brand-dark'
            }`}
          >
            {f.nombre}
          </button>
        ))}
      </div>

      <div className="rounded-xl border-l-4 border-brand-yellow bg-white shadow-sm p-5">
        <div className="flex items-baseline gap-3 mb-2">
          <h4 className="text-lg font-bold text-brand-dark">{formaActiva.nombre}</h4>
          <span className="text-xs text-brand-yellow-dark font-mono">
            $\Phi_S \approx$ {formaActiva.phi}
          </span>
        </div>
        <p className="text-sm text-brand-gray leading-relaxed mb-2"
          dangerouslySetInnerHTML={{ __html: formaActiva.descripcion }} />
        <p className="text-xs text-brand-gray italic">
          <strong>Ejemplos:</strong> {formaActiva.ejemplo}
        </p>
      </div>

    </div>
  );
};

/* ─── Calculadora Carr/Hausner ─── */
const CarrHausnerCalculator: React.FC = () => {
  const [rhoS, setRhoS] = useState(500);
  const [rhoC, setRhoC] = useState(620);

  const IC = useMemo(() => ((rhoC - rhoS) / rhoC) * 100, [rhoS, rhoC]);
  const RH = useMemo(() => rhoC / rhoS, [rhoS, rhoC]);

  const clasif = useMemo(() => {
    if (IC <= 10) return { label: 'Excelente', color: 'bg-emerald-500', text: 'text-emerald-400' };
    if (IC <= 15) return { label: 'Bueno', color: 'bg-emerald-600', text: 'text-emerald-400' };
    if (IC <= 20) return { label: 'Aceptable', color: 'bg-amber-400', text: 'text-amber-300' };
    if (IC <= 25) return { label: 'Regular', color: 'bg-amber-500', text: 'text-amber-300' };
    if (IC <= 31) return { label: 'Pobre', color: 'bg-orange-500', text: 'text-orange-300' };
    if (IC <= 37) return { label: 'Muy pobre', color: 'bg-red-500', text: 'text-red-400' };
    return { label: 'Muy, muy pobre', color: 'bg-red-700', text: 'text-red-400' };
  }, [IC]);

  useKatexRerender([rhoS, rhoC]);

  const consistente = rhoC >= rhoS;

  return (
    <div className="my-6 rounded-xl bg-brand-dark p-5 sm:p-6 not-prose text-zinc-100">
      <p className="font-semibold text-brand-yellow text-sm mb-3">🧮 Calculadora Carr / Hausner</p>
      <p className="text-xs text-zinc-400 mb-4">
        Introduce las densidades masales suelta y compactada (en kg/m³ o g/mL — solo importa que
        sean consistentes) y observa la clasificación USP del flujo.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {[
          { label: 'Densidad suelta ρs', value: rhoS, set: setRhoS, min: 100, max: 2000, step: 10 },
          { label: 'Densidad compactada ρc', value: rhoC, set: setRhoC, min: 100, max: 2000, step: 10 },
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

      {!consistente && (
        <p className="text-xs text-red-400 mb-3">
          ⚠️ La densidad compactada debe ser {'\u2265'} la suelta. Ajusta los valores.
        </p>
      )}

      <div className="grid sm:grid-cols-3 gap-3">
        <div className="rounded-lg bg-zinc-900 border border-zinc-700 p-4">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Índice de Carr</p>
          <p className="text-2xl font-bold font-mono text-brand-yellow">{IC.toFixed(1)} %</p>
          <p className="text-xs text-zinc-400 mt-1">
            {String.raw`$IC = \dfrac{\rho_c - \rho_s}{\rho_c} \times 100\%$`}
          </p>
        </div>
        <div className="rounded-lg bg-zinc-900 border border-zinc-700 p-4">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Razón de Hausner</p>
          <p className="text-2xl font-bold font-mono text-brand-yellow">{RH.toFixed(2)}</p>
          <p className="text-xs text-zinc-400 mt-1">
            {String.raw`$RH = \dfrac{\rho_c}{\rho_s}$`}
          </p>
        </div>
        <div className="rounded-lg bg-zinc-900 border border-zinc-700 p-4 flex flex-col justify-center">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Carácter de flujo (USP)</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-block w-3 h-3 rounded-full ${clasif.color}`} aria-hidden="true" />
            <p className={`text-xl font-bold ${clasif.text}`}>{clasif.label}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Tabla interactiva de esfericidad ─── */
const sphericityRows = [
  { forma: 'Esfera', phi: 1.0, note: 'Geometría ideal: máximo empaquetamiento aleatorio ≈ 64 %.' },
  { forma: 'Cubo', phi: 0.806, note: 'Tres dimensiones iguales; empaque eficiente en malla cúbica.' },
  { forma: 'Cilindro (L = D)', phi: 0.874, note: 'Partícula equidimensional; común en cristales prismáticos.' },
  { forma: 'Cilindro (L = 5D)', phi: 0.70, note: 'Alargado: aumenta la fricción interparticular.' },
  { forma: 'Placa (L = W, H = 0.1 L)', phi: 0.53, note: 'Hojuela o laminar: se orientan en el flujo.' },
  { forma: 'Aguja (L = 10 D)', phi: 0.58, note: 'Acicular: entrelazamiento mecánico alto.' },
  { forma: 'Partículas trituradas (angular)', phi: 0.65, note: 'Típico de materiales molidos: rocas, minerales.' },
  { forma: 'Arena redondeada', phi: 0.82, note: 'Desgastada por transporte natural: fluye bien.' },
];

const SphericityTable: React.FC = () => {
  const [active, setActive] = useState(0);
  useKatexRerender([active]);

  return (
    <div className="my-6 not-prose">
      <p className="text-sm text-brand-gray mb-3">
        Valores típicos de esfericidad $\Phi_S$ para formas ideales y reales. Haz clic en una fila
        para resaltarla.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-brand-dark text-white text-left">
              <th className="px-4 py-2.5 font-semibold">Forma</th>
              <th className="px-4 py-2.5 font-semibold">$\Phi_S$</th>
              <th className="px-4 py-2.5 font-semibold">Comentario</th>
            </tr>
          </thead>
          <tbody>
            {sphericityRows.map((r, i) => (
              <tr
                key={r.forma}
                onClick={() => setActive(i)}
                className={`cursor-pointer transition-colors ${
                  active === i ? 'bg-yellow-50' : i % 2 === 0 ? 'bg-white' : 'bg-zinc-50'
                } hover:bg-yellow-50 border-b border-zinc-100`}
              >
                <td className="px-4 py-2.5 font-medium text-brand-dark">{r.forma}</td>
                <td className="px-4 py-2.5 font-mono text-brand-dark">{r.phi.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-brand-gray text-xs">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-brand-gray mt-2 italic">
        A menor $\Phi_S$ → mayor área superficial por unidad de volumen → mayor coeficiente de
        arrastre y mayor resistencia al flujo del polvo.
      </p>
    </div>
  );
};

/* ─── Componente principal ─── */
const PropiedadesSolidos: React.FC = () => {
  const course = getCourseBySlug('iqya-2031');
  if (!course) return null;
  const reading = course.readings.find((r) => r.slug === 'propiedades-solidos');
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
      {/* Mobile TOC toggle */}
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
                onClick={() => {
                  setActiveSection(null);
                  setTocOpen(false);
                }}
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
        {/* Sticky TOC sidebar */}
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

        {/* Contenido principal */}
        <div className="reading-prose">
          {activeSection === null && (
            <>
              <p className="text-lg leading-relaxed text-brand-gray">
                Esta lectura acompaña la sesión sobre <strong>propiedades de los sólidos
                particulados</strong>: densidad, porosidad, tamaño y su distribución, forma,
                propiedades de flujo y otras características que determinan el comportamiento
                de los polvos durante su almacenamiento, transporte, mezclado y procesamiento
                industrial — especialmente en la industria de alimentos.
              </p>

              <InfoCallout title="📌 Aplicación al Proyecto del Curso">
                Al seleccionar un proceso que involucre sólidos, deberán investigar y reportar
                las propiedades relevantes de estos materiales. Estos datos serán fundamentales
                para el diseño y selección de equipos como <strong>silos, alimentadores,
                mezcladores, molinos o sistemas de transporte</strong> en las etapas posteriores
                del proyecto.
              </InfoCallout>
            </>
          )}

          {isVisible('introduccion') && (
            <>
              <SectionTitle id="introduccion">Introducción</SectionTitle>
              <p>
                Comprender las características de los sólidos particulados es fundamental
                para diseñar y operar equipos en numerosas industrias, especialmente en el
                procesamiento de alimentos. Estas propiedades determinan el comportamiento
                de los sólidos durante su <strong>almacenamiento, transporte, mezclado y
                procesamiento</strong>.
              </p>
              <p>
                A diferencia de los fluidos — que quedan bien descritos por densidad y
                viscosidad — un sólido particulado requiere caracterizarse mediante un
                conjunto más amplio de propiedades: varios tipos de densidad, porosidad a
                distintas escalas, tamaño (nunca único, sino una distribución), forma,
                resistencia mecánica, humedad y capacidad de fluir bajo su propio peso. En
                esta lectura revisaremos cada una de ellas.
              </p>

              <Figure
                src="/classroom/iqya-2031/readings/propiedades-solidos-01.png"
                alt="Sólidos particulados"
                caption="Los sólidos particulados son mezclas complejas de partículas, huecos y — en muchos casos — humedad: su caracterización combina varias propiedades independientes."
                maxWidth="600px"
              />
            </>
          )}

          {isVisible('densidad') && (
            <>
              <SectionTitle id="densidad">Densidad de partícula</SectionTitle>
              <p>
                La densidad es una característica esencial, pero no es una sola magnitud:
                según qué volumen consideremos (con o sin poros, con o sin huecos
                interparticulares), se distinguen varios tipos. Confundirlos es una fuente
                clásica de error en el diseño de equipos.
              </p>

              <SubTitle>Tipos de densidad</SubTitle>
              <p>
                Explora las cuatro definiciones más usadas — cada una responde a un volumen
                distinto:
              </p>
              <DensityTypesTabs />

              <SubTitle>Determinación experimental: picnometría</SubTitle>
              <p>
                La <strong>picnometría</strong> es una técnica precisa para determinar la
                densidad de partículas. Se basa en medir el volumen de un fluido (líquido o
                gas, como aire o helio) desplazado por el sólido en un recipiente de volumen
                conocido (picnómetro).
              </p>

              <p>
                <strong>Procedimiento con picnómetro de líquido (ej. agua).</strong> Navega
                entre los 8 pasos con las pestañas numeradas:
              </p>

              <PycnometerStepper />

              <VideoEmbed id="Gw3tvSC6gZ8" title="Demostración de picnómetro de líquido" start={6} />
            </>
          )}

          {isVisible('porosidad') && (
            <>
              <SectionTitle id="porosidad">Porosidad ($\varepsilon$)</SectionTitle>
              <p>
                La <strong>porosidad</strong> ($\varepsilon$) es la fracción del volumen
                total de un lecho de partículas (o de una partícula) que corresponde a
                espacio vacío. Al igual que la densidad, puede definirse a distintas escalas:
              </p>

              <SubTitle>Porosidad del lecho (interparticular)</SubTitle>
              <p>
                Corresponde al volumen de huecos <em>entre</em> partículas dentro del lecho:
              </p>
              <p>
                {'$$\\varepsilon_\\text{lecho} = 1 - \\frac{\\rho_\\text{masal}}{\\rho_\\text{aparente}}$$'}
              </p>

              <SubTitle>Porosidad de la partícula (intraparticular)</SubTitle>
              <p>
                Corresponde a los poros <em>internos</em> de cada partícula (si
                {String.raw`$\rho_\text{aparente}$`} considera solo poros cerrados y
                {String.raw`$\rho_\text{verdadera}$`} es la densidad verdadera):
              </p>
              <p>
                {'$$\\varepsilon_\\text{partícula} = 1 - \\frac{\\rho_\\text{aparente}}{\\rho_\\text{verdadera}}$$'}
              </p>

              <SubTitle>Pruébalo: calculadora e intérprete</SubTitle>
              <p>
                Ajusta las tres densidades y observa cómo cambian las porosidades y qué tipo de
                empaquetamiento / material indica cada valor.
              </p>
              <PorosityCalculator />

              <InfoCallout title="📌 Valores típicos">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Lecho aleatorio de esferas (poured): $\varepsilon \approx 0.40$.</li>
                  <li>Lecho aleatorio de esferas compactado: $\varepsilon \approx 0.36$.</li>
                  <li>Empaque cúbico cerrado ordenado: $\varepsilon \approx 0.26$ (teórico).</li>
                  <li>Lecho de partículas irregulares (p. ej. café molido): $\varepsilon = 0.45 - 0.55$.</li>
                  <li>Polvos cohesivos (harina): $\varepsilon &gt; 0.6$ (empacamiento suelto).</li>
                </ul>
              </InfoCallout>
            </>
          )}

          {isVisible('tamano') && (
            <>
              <SectionTitle id="tamano">Tamaño y distribución de tamaño de partícula</SectionTitle>
              <p>
                El tamaño de las partículas y el rango de tamaños presentes impactan
                significativamente la <strong>fluidez, el mezclado, las tasas de disolución
                y la generación de polvo</strong>.
              </p>

              <SubTitle>Rangos industriales típicos</SubTitle>
              <p>
                Como referencia, estos son los órdenes de magnitud habituales en materiales de
                la industria de alimentos y química fina:
              </p>

              <div className="overflow-x-auto my-4 not-prose">
                <table className="w-full text-sm border-collapse rounded-lg overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-brand-dark text-white text-left">
                      <th className="px-4 py-2.5 font-semibold">Material</th>
                      <th className="px-4 py-2.5 font-semibold">Tamaño típico</th>
                      <th className="px-4 py-2.5 font-semibold">Categoría</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b border-zinc-100">
                      <td className="px-4 py-2.5 text-brand-dark font-medium">Humo, aerosoles</td>
                      <td className="px-4 py-2.5 font-mono text-brand-dark">0.01 – 1 μm</td>
                      <td className="px-4 py-2.5 text-brand-gray text-xs">Ultrafino</td>
                    </tr>
                    <tr className="bg-zinc-50 border-b border-zinc-100">
                      <td className="px-4 py-2.5 text-brand-dark font-medium">Cemento, pigmentos</td>
                      <td className="px-4 py-2.5 font-mono text-brand-dark">5 – 30 μm</td>
                      <td className="px-4 py-2.5 text-brand-gray text-xs">Fino</td>
                    </tr>
                    <tr className="bg-white border-b border-zinc-100">
                      <td className="px-4 py-2.5 text-brand-dark font-medium">Cacao en polvo</td>
                      <td className="px-4 py-2.5 font-mono text-brand-dark">20 – 100 μm</td>
                      <td className="px-4 py-2.5 text-brand-gray text-xs">Fino</td>
                    </tr>
                    <tr className="bg-zinc-50 border-b border-zinc-100">
                      <td className="px-4 py-2.5 text-brand-dark font-medium">Harina de trigo</td>
                      <td className="px-4 py-2.5 font-mono text-brand-dark">50 – 150 μm</td>
                      <td className="px-4 py-2.5 text-brand-gray text-xs">Fino – medio</td>
                    </tr>
                    <tr className="bg-white border-b border-zinc-100">
                      <td className="px-4 py-2.5 text-brand-dark font-medium">Azúcar refinada</td>
                      <td className="px-4 py-2.5 font-mono text-brand-dark">200 – 600 μm</td>
                      <td className="px-4 py-2.5 text-brand-gray text-xs">Medio</td>
                    </tr>
                    <tr className="bg-zinc-50 border-b border-zinc-100">
                      <td className="px-4 py-2.5 text-brand-dark font-medium">Sal de mesa</td>
                      <td className="px-4 py-2.5 font-mono text-brand-dark">300 – 700 μm</td>
                      <td className="px-4 py-2.5 text-brand-gray text-xs">Medio</td>
                    </tr>
                    <tr className="bg-white border-b border-zinc-100">
                      <td className="px-4 py-2.5 text-brand-dark font-medium">Café molido (filtro)</td>
                      <td className="px-4 py-2.5 font-mono text-brand-dark">500 – 900 μm</td>
                      <td className="px-4 py-2.5 text-brand-gray text-xs">Medio</td>
                    </tr>
                    <tr className="bg-zinc-50 border-b border-zinc-100">
                      <td className="px-4 py-2.5 text-brand-dark font-medium">Arena de playa</td>
                      <td className="px-4 py-2.5 font-mono text-brand-dark">0.1 – 2 mm</td>
                      <td className="px-4 py-2.5 text-brand-gray text-xs">Grueso</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-2.5 text-brand-dark font-medium">Arroz, lentejas, semillas</td>
                      <td className="px-4 py-2.5 font-mono text-brand-dark">2 – 8 mm</td>
                      <td className="px-4 py-2.5 text-brand-gray text-xs">Muy grueso</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <SubTitle>Diámetros equivalentes</SubTitle>
              <p>
                Las partículas industriales rara vez son esferas perfectas, por lo que usamos
                un <strong>"diámetro equivalente"</strong>: el diámetro de una esfera que
                comparte <em>alguna</em> propiedad física con la partícula real. Explora los
                cuatro más usados:
              </p>

              <DiameterTypesTabs />

              <SubTitle>Distribución de tamaño de partícula (DTP)</SubTitle>
              <p>
                La mayoría de los polvos consisten en partículas de varios tamaños. La
                distribución se grafica típicamente como porcentaje <em>acumulado</em> que
                pasa (undersize) en función del tamaño.
              </p>

              <Figure
                src="/classroom/iqya-2031/readings/propiedades-solidos-granulometria.jpeg"
                alt="Granulometría: clases de tamaño desde roca hasta arcilla"
                caption="Granulometría clásica: la misma muestra de suelo abarca varias órdenes de magnitud — rocas (&gt; 75 mm), gravas, arenas (0.074 – 2 mm), limos y arcillas (&lt; 0.005 mm). Cada tamiz separa una población distinta y la DTP describe cuánto pesa cada una."
                maxWidth="420px"
              />

              <p>
                Tres <strong>percentiles característicos</strong> resumen la DTP:
              </p>
              <ul>
                <li>
                  <strong>$d_{'{10}'}$:</strong> 10 % de la masa (o número) tiene tamaño menor
                  — indica la fracción de finos.
                </li>
                <li>
                  <strong>$d_{'{50}'}$ (mediana):</strong> el 50 % está por debajo — valor
                  central representativo.
                </li>
                <li>
                  <strong>$d_{'{90}'}$:</strong> el 90 % está por debajo — indica la fracción
                  de gruesos.
                </li>
              </ul>

              <p>Y un indicador de amplitud de la distribución:</p>
              <p>{'$$\\text{span} = \\dfrac{d_{90} - d_{10}}{d_{50}}$$'}</p>
              <p>
                Un <strong>span &lt; 1</strong> indica una distribución estrecha (monomodal);
                {' '}<strong>span &gt; 2</strong> indica una distribución ancha o multimodal —
                típica de productos molidos sin clasificar. En farmacia y microencapsulación
                suele exigirse span &lt; 1.5.
              </p>

              <PSDExplorer />

              <SubTitle>Métodos de medición</SubTitle>
              <p>
                Cada método tiene un rango útil y una variable medida distintos. Explora los
                cinco más comunes:
              </p>
              <SizingMethodsTabs />

              <TipCallout title="💡 ¿Cuál método elegir?">
                Para caracterización rutinaria de granulometría media-gruesa, tamizado es casi
                siempre suficiente y es el estándar industrial. Para polvos finos (&lt; 38 μm)
                o cuando se requiere resolución y rapidez, difracción láser domina el mercado
                moderno. Microscopía + análisis de imagen siguen siendo la referencia para
                forma y para validar otros métodos.
              </TipCallout>
            </>
          )}

          {isVisible('forma') && (
            <>
              <SectionTitle id="forma">Forma de la partícula</SectionTitle>
              <p>
                Las partículas reales rara vez son esferas perfectas. La forma influye
                directamente en el <strong>empaquetamiento, el flujo y las fuerzas
                interparticulares</strong>.
              </p>

              <SubTitle>Formas comunes</SubTitle>
              <p>
                Seis morfologías básicas cubren la mayoría de polvos industriales. Haz clic en
                cada una para ver descripción y ejemplos:
              </p>
              <ShapeGallery />

              <Figure
                src="/classroom/iqya-2031/readings/propiedades-solidos-forma.png"
                alt="Galería de formas de partícula bajo microscopio"
                caption="Catálogo de morfologías reales bajo microscopio: agujas, varillas, hojuelas, partículas angulares, equiaxiales, cúbicas, cilíndricas, lamelares, romboédricas, redondeadas y esféricas. La forma se identifica por inspección visual antes de cuantificar con esfericidad o redondez."
                maxWidth="640px"
              />

              <SubTitle>Esfericidad ($\Phi_S$)</SubTitle>
              <p>
                La <strong>esfericidad</strong> ($\Phi_S$) es una medida que indica qué tan
                cercana es la forma de una partícula a una esfera perfecta. Se define como
                el cociente entre el área superficial de una esfera con el mismo volumen que
                la partícula y el área superficial real de la partícula:
              </p>
              <p>
                {'$$\\Phi_S = \\frac{A_\\text{esfera con el mismo volumen}}{A_\\text{real de la partícula}}$$'}
              </p>

              <SphericitySvg />

              <p>
                Para una esfera perfecta, <strong>$\Phi_S = 1$</strong>; para partículas
                irregulares, <strong>$\Phi_S &lt; 1$</strong>. Este parámetro es importante
                porque influye en los <strong>coeficientes de arrastre en fluidos</strong> y
                en la <strong>densidad de empaquetamiento</strong>.
              </p>

              <Figure
                src="/classroom/iqya-2031/readings/propiedades-solidos-esfericidad.png"
                alt="Diagrama clásico de Krumbein-Sloss: esfericidad vs redondez"
                caption="Diagrama clásico de Krumbein-Sloss: esfericidad (filas, qué tan cercana al volumen de una esfera) vs redondez (columnas, qué tan suaves son los bordes). Son dos descriptores independientes — una partícula puede ser muy redondeada pero poco esférica (fila inferior) y viceversa."
                maxWidth="520px"
              />

              <SubTitle>Valores típicos por forma</SubTitle>
              <p>
                La siguiente tabla recoge valores de $\Phi_S$ para formas ideales y materiales
                reales:
              </p>

              <SphericityTable />

              <TipCallout title="💡 ¿Por qué importa $\Phi_S$?">
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    En la <strong>ecuación de Ergun</strong> (caída de presión en lecho fijo),
                    $\Phi_S$ aparece en ambos términos: viscoso y de inercia.
                  </li>
                  <li>
                    En el <strong>coeficiente de arrastre</strong>: para $\Phi_S &lt; 1$, $C_D$
                    puede aumentar un factor de 2–5 respecto a una esfera del mismo $d_v$.
                  </li>
                  <li>
                    En la <strong>porosidad aleatoria</strong> de empaque: partículas con
                    {String.raw` $\Phi_S < 0.6$ tienen $\varepsilon_\text{lecho} > 0.55$`}.
                  </li>
                </ul>
              </TipCallout>
            </>
          )}

          {isVisible('flujo') && (
            <>
              <SectionTitle id="flujo">Propiedades de flujo de los polvos</SectionTitle>
              <p>
                La manera en que <strong>fluye un polvo</strong> es fundamental para su
                manejo y procesamiento. A continuación, los tres indicadores experimentales
                más usados y un apunte sobre ensayos avanzados.
              </p>

              <SubTitle>Ángulo de reposo ($\theta$)</SubTitle>
              <p>
                Es el ángulo formado entre la horizontal y la pendiente del cono que se crea
                cuando un polvo se vierte libremente sobre una superficie plana.
              </p>
              <ul>
                <li>
                  <strong>$\theta &lt; 30°$:</strong> indica un polvo de <em>flujo
                  libre</em>.
                </li>
                <li>
                  <strong>$\theta &gt; 45°$:</strong> indica un polvo <em>cohesivo</em>, de
                  flujo deficiente.
                </li>
                <li>
                  Este ángulo depende del <strong>tamaño de partícula, forma, contenido de
                  humedad</strong> y fuerzas interparticulares.
                </li>
              </ul>

              <Figure
                src="/classroom/iqya-2031/readings/propiedades-solidos-reposo.jpeg"
                alt="Ángulo de reposo para distintos materiales"
                caption="Ángulo de reposo en materiales reales: arena fina ~35°, arena gruesa ~40°, gravilla angular ~45°. Cuanto más irregular y rugoso es el grano, mayor es el ángulo — más resistencia al flujo libre."
                maxWidth="640px"
              />

              <p>
                <strong>Valores típicos</strong> para materiales comunes:
              </p>

              <div className="overflow-x-auto my-4 not-prose">
                <table className="w-full text-sm border-collapse rounded-lg overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-brand-dark text-white text-left">
                      <th className="px-4 py-2.5 font-semibold">Material</th>
                      <th className="px-4 py-2.5 font-semibold">$\theta$ (°)</th>
                      <th className="px-4 py-2.5 font-semibold">Flujo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b border-zinc-100">
                      <td className="px-4 py-2.5 text-brand-dark font-medium">Arena seca redondeada</td>
                      <td className="px-4 py-2.5 font-mono text-brand-dark">28 – 32</td>
                      <td className="px-4 py-2.5 text-brand-gray text-xs">Libre</td>
                    </tr>
                    <tr className="bg-zinc-50 border-b border-zinc-100">
                      <td className="px-4 py-2.5 text-brand-dark font-medium">Azúcar granulada</td>
                      <td className="px-4 py-2.5 font-mono text-brand-dark">30 – 35</td>
                      <td className="px-4 py-2.5 text-brand-gray text-xs">Libre</td>
                    </tr>
                    <tr className="bg-white border-b border-zinc-100">
                      <td className="px-4 py-2.5 text-brand-dark font-medium">Sal de mesa</td>
                      <td className="px-4 py-2.5 font-mono text-brand-dark">32 – 38</td>
                      <td className="px-4 py-2.5 text-brand-gray text-xs">Libre – aceptable</td>
                    </tr>
                    <tr className="bg-zinc-50 border-b border-zinc-100">
                      <td className="px-4 py-2.5 text-brand-dark font-medium">Café molido</td>
                      <td className="px-4 py-2.5 font-mono text-brand-dark">35 – 42</td>
                      <td className="px-4 py-2.5 text-brand-gray text-xs">Aceptable</td>
                    </tr>
                    <tr className="bg-white border-b border-zinc-100">
                      <td className="px-4 py-2.5 text-brand-dark font-medium">Harina de trigo</td>
                      <td className="px-4 py-2.5 font-mono text-brand-dark">40 – 50</td>
                      <td className="px-4 py-2.5 text-brand-gray text-xs">Cohesivo</td>
                    </tr>
                    <tr className="bg-zinc-50 border-b border-zinc-100">
                      <td className="px-4 py-2.5 text-brand-dark font-medium">Cacao en polvo</td>
                      <td className="px-4 py-2.5 font-mono text-brand-dark">45 – 55</td>
                      <td className="px-4 py-2.5 text-brand-gray text-xs">Cohesivo</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-2.5 text-brand-dark font-medium">Cemento</td>
                      <td className="px-4 py-2.5 font-mono text-brand-dark">40 – 50</td>
                      <td className="px-4 py-2.5 text-brand-gray text-xs">Cohesivo</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <SubTitle>Índice de Carr y razón de Hausner</SubTitle>
              <p>
                A partir de las densidades masales <em>suelta</em> ({String.raw`$\rho_\text{suelta}$`}) y
                <em> compactada</em> ({String.raw`$\rho_\text{compactada}$`}) se calculan dos indicadores
                ampliamente usados en la industria farmacéutica y de alimentos:
              </p>

              <p>
                <strong>Índice de compresibilidad (índice de Carr):</strong>
              </p>
              <p>
                {'$$IC = \\left( \\frac{\\rho_\\text{compactada} - \\rho_\\text{suelta}}{\\rho_\\text{compactada}} \\right) \\times 100\\%$$'}
              </p>

              <p>
                <strong>Razón de Hausner:</strong>
              </p>
              <p>
                {'$$RH = \\frac{\\rho_\\text{compactada}}{\\rho_\\text{suelta}}$$'}
              </p>

              <p>
                <strong>Interpretación (guía general):</strong> tabla basada en estándares
                USP y literatura de caracterización de polvos.
              </p>

              <div className="not-prose my-6 overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-zinc-100 text-brand-dark">
                      <th className="border border-zinc-300 px-3 py-2 text-left font-semibold">
                        Índice de Carr (%)
                      </th>
                      <th className="border border-zinc-300 px-3 py-2 text-left font-semibold">
                        Razón de Hausner
                      </th>
                      <th className="border border-zinc-300 px-3 py-2 text-left font-semibold">
                        Carácter de flujo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-brand-gray">
                    <tr>
                      <td className="border border-zinc-300 px-3 py-2">≤ 10</td>
                      <td className="border border-zinc-300 px-3 py-2">1.00 – 1.11</td>
                      <td className="border border-zinc-300 px-3 py-2">Excelente</td>
                    </tr>
                    <tr className="bg-zinc-50">
                      <td className="border border-zinc-300 px-3 py-2">11 – 15</td>
                      <td className="border border-zinc-300 px-3 py-2">1.12 – 1.18</td>
                      <td className="border border-zinc-300 px-3 py-2">Bueno</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 px-3 py-2">16 – 20</td>
                      <td className="border border-zinc-300 px-3 py-2">1.19 – 1.25</td>
                      <td className="border border-zinc-300 px-3 py-2">Aceptable</td>
                    </tr>
                    <tr className="bg-zinc-50">
                      <td className="border border-zinc-300 px-3 py-2">21 – 25</td>
                      <td className="border border-zinc-300 px-3 py-2">1.26 – 1.34</td>
                      <td className="border border-zinc-300 px-3 py-2">Regular</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 px-3 py-2">26 – 31</td>
                      <td className="border border-zinc-300 px-3 py-2">1.35 – 1.45</td>
                      <td className="border border-zinc-300 px-3 py-2">Pobre</td>
                    </tr>
                    <tr className="bg-zinc-50">
                      <td className="border border-zinc-300 px-3 py-2">32 – 37</td>
                      <td className="border border-zinc-300 px-3 py-2">1.46 – 1.59</td>
                      <td className="border border-zinc-300 px-3 py-2">Muy pobre</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 px-3 py-2">&gt; 38</td>
                      <td className="border border-zinc-300 px-3 py-2">&gt; 1.60</td>
                      <td className="border border-zinc-300 px-3 py-2">Muy, muy pobre</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                Usa esta <strong>calculadora</strong> para evaluar un polvo en particular:
              </p>
              <CarrHausnerCalculator />

              <SubTitle>Cohesión y adhesión</SubTitle>
              <p>
                Las fuerzas entre partículas (<strong>cohesión</strong>) y entre partículas y
                las paredes del contenedor (<strong>adhesión</strong>) afectan
                significativamente el flujo.
              </p>
              <ul>
                <li>
                  Los polvos cohesivos tienden a formar <strong>arcos</strong> (bloqueos en
                  forma de cúpula) y <strong>"chimeneas" o "tubos de rata"</strong>
                  {' '}(<em>ratholing</em>) en las tolvas, donde el material fluye únicamente
                  por un canal central.
                </li>
              </ul>

              <Figure
                src="/classroom/iqya-2031/readings/propiedades-solidos-adhesion.png"
                alt="Adhesión vs cohesión"
                caption="Adhesión: atracción entre moléculas distintas (la cinta se pega al papel). Cohesión: atracción entre moléculas iguales (el mercurio forma gotas porque sus átomos se atraen entre sí). En un polvo, la cohesión bloquea el flujo gravitatorio y la adhesión hace que se quede pegado a las paredes de tolvas y tuberías."
                maxWidth="560px"
              />

              <SubTitle>Función de flujo</SubTitle>
              <p>
                Se determina mediante ensayos de <strong>celda de cizallamiento</strong>
                {' '}(por ejemplo, celda de <strong>Jenike</strong>). Esta función caracteriza
                la resistencia del polvo y su capacidad para fluir bajo esfuerzo. Es un
                concepto avanzado, pero esencial para el diseño robusto de tolvas y silos,
                especialmente cuando se manejan polvos cohesivos.
              </p>

              <InfoCallout title="📌 Función de flujo de Jenike (ffc)">
                La función de flujo de Jenike relaciona la <strong>resistencia a la compresión
                no confinada</strong> ($\sigma_c$) con el <strong>esfuerzo principal mayor de
                consolidación</strong> ($\sigma_1$):
                <p className="mt-2">{'$$ff_c = \\dfrac{\\sigma_1}{\\sigma_c}$$'}</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>$ff_c &lt; 2$: polvo muy cohesivo, no fluirá por gravedad.</li>
                  <li>$2 &lt; ff_c &lt; 4$: cohesivo.</li>
                  <li>$4 &lt; ff_c &lt; 10$: fácil de fluir.</li>
                  <li>$ff_c &gt; 10$: flujo libre.</li>
                </ul>
                Este ensayo permite diseñar el <strong>ángulo mínimo de la tolva</strong> y
                el <strong>tamaño mínimo de salida</strong> para garantizar flujo másico.
              </InfoCallout>

              <TipCallout>
                En la práctica industrial, el <strong>ángulo de reposo</strong> y la pareja
                <strong> Carr / Hausner</strong> son suficientes para un diagnóstico rápido
                del comportamiento de un polvo. Cuando el diseño es crítico (silos,
                alimentadores de alta precisión) o el polvo es claramente cohesivo, hay que
                avanzar a ensayos tipo Jenike.
              </TipCallout>
            </>
          )}

          {isVisible('otras') && (
            <>
              <SectionTitle id="otras">Otras propiedades importantes</SectionTitle>
              <ul>
                <li>
                  <strong>Contenido de humedad:</strong> afecta la fluidez al aumentar la
                  cohesión y la estabilidad durante el almacenamiento, pudiendo causar
                  apelmazamiento y crecimiento microbiano.
                </li>
                <li>
                  <strong>Área superficial específica:</strong> determina las tasas de
                  disolución, adsorción y cinética de reacción. Se mide mediante adsorción
                  de gases (ej., <strong>método BET</strong>).
                </li>
                <li>
                  <strong>Dureza y friabilidad:</strong> influyen en el comportamiento
                  durante la molienda y el manejo, afectando la generación de polvo y el
                  desgaste por fricción.
                </li>
                <li>
                  <strong>Higroscopicidad:</strong> tendencia a absorber humedad del aire.
                </li>
                <li>
                  <strong>Propiedades térmicas:</strong> calor específico y conductividad
                  térmica, cruciales para procesos de calentamiento o enfriamiento.
                </li>
              </ul>

              <InfoCallout title="📌 Método BET — un apunte">
                El <strong>método BET</strong> (Brunauer-Emmett-Teller, 1938) mide el área
                superficial específica a partir de la <em>isoterma de adsorción</em> de un
                gas inerte (típicamente N₂ a 77 K) sobre el sólido. La ecuación BET linealiza
                la isoterma en un rango $0.05 &lt; p/p_0 &lt; 0.35$ y de la pendiente se
                obtiene el volumen de monocapa $v_m$; de ahí el área superficial:
                <p className="mt-2">{'$$S_\\text{BET} = \\dfrac{v_m \\, N_A \\, \\sigma}{V_m}$$'}</p>
                donde $\sigma$ es el área ocupada por una molécula de N₂ (0.162 nm²). Valores
                típicos: carbón activo 500–1500 m²/g, zeolitas 300–700 m²/g, sílice 200–400
                m²/g, polvos farmacéuticos 0.5–5 m²/g. Es <strong>crítico en catálisis</strong>
                {' '}(actividad proporcional al área accesible) y en <strong>cinética de
                disolución</strong> (Noyes-Whitney: $dm/dt \propto S$).
              </InfoCallout>
            </>
          )}

          {isVisible('impacto') && (
            <>
              <SectionTitle id="impacto">Impacto en operaciones industriales</SectionTitle>
              <p>
                En la práctica industrial, las propiedades anteriores influyen directamente
                en la selección y diseño de casi todos los equipos de manejo de sólidos:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Almacenamiento
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Diseño de silos y tolvas (ángulos de cono, tamaño de salida, necesidad
                    de ayudas de flujo como vibradores o inyección de aire). Evitar
                    condiciones de "no flujo" como arcos y chimeneas es esencial. El diseño
                    de la tolva (flujo másico vs. flujo de embudo) depende críticamente de
                    las propiedades de flujo del polvo.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Reducción de tamaño (molienda)
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    La energía requerida y la distribución final del tamaño de partícula
                    dependen de la <strong>dureza</strong> y <strong>friabilidad</strong> del
                    material de alimentación.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Calidad del producto
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Uniformidad de la dosificación (ej. mezclas instantáneas, premezclas de
                    vitaminas), textura (ej. suavidad del chocolate en polvo) y apariencia
                    del producto alimenticio final.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Disolución y dispersión
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Las partículas más finas con mayores áreas superficiales generalmente
                    se disuelven o dispersan más rápido.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Alimentación y transporte
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Selección y diseño de alimentadores (de tornillo, de banda) y sistemas
                    de transporte (neumático, mecánico).
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Mezclado
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Lograr la homogeneidad es un desafío si los componentes tienen
                    diferentes tamaños, formas o densidades, lo que lleva a la
                    <strong> segregación</strong> (desmezclado). El tipo de mezclador, el
                    tiempo de mezclado y a veces pasos de pre-procesamiento (como la
                    granulación) se eligen en función de estas propiedades.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5 sm:col-span-2">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Control de polvo
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Los polvos finos y de baja densidad pueden generar una cantidad
                    significativa de polvo, lo que requiere medidas adecuadas de
                    ventilación y seguridad (<strong>riesgo de explosiones de polvo</strong>
                    {' '}para materiales orgánicos).
                  </p>
                </div>
              </div>
            </>
          )}

          {isVisible('caso') && (
            <>
              <SectionTitle id="caso">Caso práctico: diseñar una tolva para cacao en polvo</SectionTitle>
              <p>
                Supongamos que debes diseñar una tolva de almacenamiento intermedio para
                <strong> cacao en polvo</strong> con humedad variable (entre 3 % en época seca
                y 7 % en época húmeda) en una planta de chocolates. ¿Qué propiedades medir y
                qué decisiones tomar?
              </p>

              <SubTitle>1. Propiedades a caracterizar</SubTitle>
              <ul>
                <li>
                  <strong>{String.raw`$\rho_\text{suelta}$, $\rho_\text{compactada}$`}</strong> a ambos
                  niveles de humedad (3 % y 7 %) — para dimensionar la tolva y estimar cuánto
                  se compactará durante el almacenamiento.
                </li>
                <li>
                  <strong>DTP por tamizado o difracción láser</strong> — el cacao típico está
                  entre 20 y 100 μm, con $d_{'{50}'} \approx 40$ μm.
                </li>
                <li>
                  <strong>Ángulo de reposo</strong> y <strong>pareja Carr/Hausner</strong> en
                  los dos extremos de humedad — diagnóstico rápido.
                </li>
                <li>
                  <strong>Ensayo de cizallamiento Jenike</strong> — obligatorio para cacao
                  porque se sospecha cohesivo ($\theta &gt; 45°$ esperado).
                </li>
                <li>
                  <strong>Higroscopicidad</strong> y <strong>actividad de agua</strong> — para
                  evaluar apelmazamiento y crecimiento microbiano durante almacenamiento.
                </li>
              </ul>

              <SubTitle>2. Decisiones de diseño</SubTitle>

              <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Tipo de tolva
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Para polvos cohesivos como el cacao → <strong>tolva de flujo másico</strong>
                    {' '}(todo el material se mueve al abrir la salida). Evitar flujo de embudo
                    (ratholing garantizado).
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Ángulo del cono
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    A partir de la celda Jenike y del ángulo de fricción con la pared, diseñar
                    un cono con semi-ángulo típicamente <strong>15°–25°</strong> respecto a la
                    vertical. Pared pulida (acero inox 2B).
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Tamaño de salida
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Debe superar el <strong>diámetro crítico de arco</strong> calculado con
                    $ff_c$ — típicamente <strong>0.3–0.6 m</strong> para cacao fino. Menor que
                    esto → arco garantizado.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Ayudas de flujo
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Vibradores neumáticos externos o <strong>aireación con N₂ seco</strong>
                    {' '}(no aire comprimido: el cacao absorbe humedad). Alternativa: agitador
                    mecánico tipo "bin-activator".
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Control de humedad
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Tolva hermética, venteo con filtro dehumidificador, control de temperatura
                    ≤ 20 °C para minimizar actividad de agua y caking.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Seguridad
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    El cacao en polvo es <strong>explosivo</strong> (ATEX clase St1).
                    Requiere: venting de explosión, supresión química, puesta a tierra,
                    evitar fuentes de ignición.
                  </p>
                </div>
              </div>

              <WarningCallout title="⚠️ Trampa frecuente">
                Si se diseña la tolva con la {String.raw`$\rho_\text{suelta}$`} del cacao seco (3 %),
                pero en operación real el material llega al 7 % → la densidad suelta puede
                bajar 15 %, y el ángulo de reposo puede subir de 48° a 60°. El equipo
                "funciona en el laboratorio y no en planta". <strong>Siempre caracterizar en
                el peor escenario esperable</strong>, no en el de diseño ideal.
              </WarningCallout>
            </>
          )}

          {isVisible('consejos') && (
            <>
              <SectionTitle id="consejos">Consejos prácticos</SectionTitle>
              <ul>
                <li>
                  <strong>Caracterización detallada:</strong> no subestimar la importancia
                  de conocer bien las propiedades de los sólidos. Un pequeño cambio en la
                  humedad o el tamaño de partícula puede alterar drásticamente el
                  comportamiento.
                </li>
                <li>
                  <strong>Fuentes de información:</strong> consultar literatura técnica
                  (como el <em>Perry's Chemical Engineers' Handbook</em>), bases de datos
                  de propiedades de materiales y datos de proveedores de ingredientes.
                </li>
                <li>
                  <strong>Mediciones experimentales:</strong> si es posible, realizar
                  mediciones básicas (densidad aparente suelta y compactada, ángulo de
                  reposo, análisis por tamizado) para materiales específicos del proyecto.
                  Para problemas de flujo más críticos, considerar ensayos de cizallamiento.
                </li>
                <li>
                  <strong>Considerar la variabilidad:</strong> las propiedades de los
                  materiales naturales (como harinas o cacao) pueden variar entre lotes o
                  proveedores. El diseño debe considerar esta variabilidad.
                </li>
              </ul>
            </>
          )}

          {isVisible('bibliografia') && (
            <>
              <SectionTitle id="bibliografia">Bibliografía recomendada</SectionTitle>
              <p>Referencias para profundizar en propiedades de sólidos particulados:</p>
              <ul className="text-sm text-brand-gray leading-relaxed">
                <li>
                  McCabe, W. L., Smith, J. C., &amp; Harriott, P. (2005).
                  <em> Unit Operations of Chemical Engineering</em> (7th ed.), Capítulo 28:
                  Properties and Handling of Particulate Solids. McGraw-Hill.
                </li>
                <li>
                  Rhodes, M. (2008). <em>Introduction to Particle Technology</em> (2nd ed.),
                  Capítulo 1: Particle Size Analysis. John Wiley &amp; Sons.
                </li>
                <li>
                  United States Pharmacopeia (USP). <em>&lt;1174&gt; Powder Flow</em> —
                  índice de Carr, razón de Hausner y clasificación del carácter de flujo.
                </li>
                <li>
                  Perry, R. H., &amp; Green, D. W. (eds.). <em>Perry's Chemical Engineers'
                  Handbook</em> (8th ed.). McGraw-Hill — secciones sobre caracterización y
                  manejo de sólidos.
                </li>
                <li>
                  Jenike, A. W. (1964). <em>Storage and Flow of Solids</em>. Bulletin 123,
                  University of Utah. Referencia clásica para ensayos de cizallamiento y
                  diseño de tolvas.
                </li>
                <li>
                  Brunauer, S., Emmett, P. H., &amp; Teller, E. (1938). Adsorption of gases
                  in multimolecular layers. <em>J. Am. Chem. Soc.</em>, 60, 309–319.
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </ReadingLayout>
  );
};

export default PropiedadesSolidos;
