import React, { useEffect, useMemo, useState } from 'react';
import { ReadingLayout } from '../../../../components/classroom/ReadingLayout';
import { getCourseBySlug } from '../../../../components/data/classroom';

/* ─── KaTeX ─── */
const useKatex = () => {
  useEffect(() => {
    const renderAll = () => {
      // @ts-expect-error
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

/* ─── Íconos SVG ─── */
const Icon: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
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

/* ─── Callouts ─── */
const TipCallout: React.FC<{ title?: string; children: React.ReactNode }> = ({ title = 'Idea clave', children }) => (
  <div className="my-6 rounded-xl bg-brand-dark p-5 sm:p-6 not-prose">
    <p className="font-semibold text-brand-yellow text-sm mb-2 flex items-center gap-2">
      <span className="text-base"><IconLightbulb /></span>{title}
    </p>
    <div className="text-sm text-zinc-300 leading-relaxed">{children}</div>
  </div>
);
const InfoCallout: React.FC<{ title?: string; children: React.ReactNode }> = ({ title = 'Nota', children }) => (
  <div className="my-6 rounded-xl bg-brand-dark p-5 sm:p-6 not-prose">
    <p className="font-semibold text-emerald-400 text-sm mb-2 flex items-center gap-2">
      <span className="text-base"><IconPin /></span>{title}
    </p>
    <div className="text-sm text-zinc-300 leading-relaxed">{children}</div>
  </div>
);
const WarningCallout: React.FC<{ title?: string; children: React.ReactNode }> = ({ title = 'Importante', children }) => (
  <div className="my-6 rounded-xl bg-brand-dark p-5 sm:p-6 not-prose">
    <p className="font-semibold text-red-400 text-sm mb-2 flex items-center gap-2">
      <span className="text-base"><IconWarn /></span>{title}
    </p>
    <div className="text-sm text-zinc-300 leading-relaxed">{children}</div>
  </div>
);

const SectionTitle: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => (
  <h2 id={id} className="text-2xl font-bold text-brand-dark mt-14 mb-4 scroll-mt-32">{children}</h2>
);
const SubTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-lg font-semibold text-brand-dark mt-8 mb-3">{children}</h3>
);

const Figure: React.FC<{ src: string; alt: string; caption?: React.ReactNode; maxWidth?: string }> = ({
  src, alt, caption, maxWidth = '700px',
}) => (
  <figure className="my-8 not-prose flex flex-col items-center">
    <div className="w-full flex justify-center rounded-xl bg-zinc-50 border border-zinc-200 p-4 sm:p-6">
      <img src={src} alt={alt} className="block max-w-full h-auto rounded-md shadow-md" style={{ maxWidth }} />
    </div>
    {caption && <figcaption className="text-center text-sm text-brand-gray mt-3 italic max-w-2xl">{caption}</figcaption>}
  </figure>
);

/* ─── TOC ─── */
const tocItems = [
  { id: 'introduccion', label: 'Agitación vs. mezclado' },
  { id: 'patrones', label: 'Patrones de flujo' },
  { id: 'impulsores', label: 'Tipos de impulsores' },
  { id: 'bafles', label: 'Bafles (deflectores)' },
  { id: 'geometria', label: 'Geometría estándar' },
  { id: 'potencia', label: 'Potencia y adimensionales' },
  { id: 'escalado', label: 'Escalado' },
  { id: 'bibliografia', label: 'Bibliografía' },
];

/* ─── Esquemas SVG de impulsores ─── */
type ImpellerSpec = {
  id: string;
  family: 'axial' | 'radial' | 'viscoso';
  name: string;
  Np: number;             // turbulento, baffled
  rpmRange: [number, number];
  flow: 'axial' | 'radial' | 'mixto' | 'cercano-pared';
  uses: string;
  description: string;
};

const impellers: ImpellerSpec[] = [
  { id: 'helice', family: 'axial', name: 'Hélice marina (3 palas)', Np: 0.35, rpmRange: [400, 1750], flow: 'axial',
    uses: 'Homogeneización de líquidos miscibles, suspensión de sólidos finos, transferencia de calor.',
    description: 'Tres o cuatro palas helicoidales similares a las de un barco. Alto bombeo axial, bajo cizallamiento. Eficaz solo para fluidos de baja viscosidad.' },
  { id: 'pbt', family: 'axial', name: 'Turbina de palas inclinadas (PBT 45°)', Np: 1.5, rpmRange: [60, 400], flow: 'mixto',
    uses: 'Versátil: suspensión, mezcla líquido-líquido, transferencia de calor.',
    description: 'Cuatro o seis palas planas inclinadas a 45°. Combina flujo axial y radial; el ángulo determina el reparto. La opción más usada en mezcla general.' },
  { id: 'rushton', family: 'radial', name: 'Turbina Rushton (6 palas en disco)', Np: 5.5, rpmRange: [50, 400], flow: 'radial',
    uses: 'Dispersión de gas (fermentadores), reacciones limitadas por transferencia de masa.',
    description: 'Disco horizontal con 6 palas verticales rectas. Alto cizallamiento, alto consumo de potencia. Estándar industrial para procesos gas-líquido.' },
  { id: 'curved', family: 'radial', name: 'Turbina de palas curvas (Smith)', Np: 3.5, rpmRange: [50, 400], flow: 'radial',
    uses: 'Dispersión de gas con menor consumo energético que Rushton.',
    description: 'Variante de Rushton con palas cóncavas hacia adelante. Mantiene el flujo radial pero reduce la zona de baja presión detrás de las palas, bajando $N_P$.' },
  { id: 'paddle', family: 'radial', name: 'Paletas (paddle)', Np: 2.0, rpmRange: [20, 150], flow: 'radial',
    uses: 'Agitación suave en fluidos viscosos, mezcla de polvos o pastas.',
    description: 'Dos o más palas planas grandes, baja velocidad. Cubre buena parte del diámetro del tanque.' },
  { id: 'anchor', family: 'viscoso', name: 'Ancla', Np: 0.5, rpmRange: [10, 50], flow: 'cercano-pared',
    uses: 'Fluidos muy viscosos (μ > 5000 cP), transferencia de calor con paredes encamisadas.',
    description: 'Sigue el contorno del tanque a baja velocidad. Barre la pared para evitar acumulaciones y mejorar la transferencia de calor.' },
  { id: 'helical', family: 'viscoso', name: 'Cinta helicoidal', Np: 0.3, rpmRange: [5, 30], flow: 'axial',
    uses: 'Fluidos muy viscosos donde se requiere mezcla axial (polímeros, mieles, geles).',
    description: 'Cinta enrollada en hélice alrededor del eje. Levanta material desde el fondo hacia la superficie en régimen laminar.' },
];

const ImpellerSVG: React.FC<{ id: string; size?: number }> = ({ id, size = 220 }) => {
  const cx = size / 2;
  const cy = size / 2;
  const stroke = '#1A1A1A';
  switch (id) {
    case 'helice':
      return (
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden>
          <line x1={cx} y1="20" x2={cx} y2={size - 20} stroke={stroke} strokeWidth="3" />
          {[0, 120, 240].map((a) => (
            <path key={a}
              d={`M ${cx} ${cy} q ${Math.cos((a * Math.PI) / 180) * 60} ${Math.sin((a * Math.PI) / 180) * 60} ${Math.cos(((a + 30) * Math.PI) / 180) * 80} ${Math.sin(((a + 30) * Math.PI) / 180) * 80} q ${Math.cos(((a + 90) * Math.PI) / 180) * 14} ${Math.sin(((a + 90) * Math.PI) / 180) * 14} ${Math.cos(((a + 150) * Math.PI) / 180) * 28} ${Math.sin(((a + 150) * Math.PI) / 180) * 28} z`}
              fill="#FFBF00" stroke={stroke} strokeWidth="1.5" opacity="0.9" />
          ))}
          <circle cx={cx} cy={cy} r="10" fill={stroke} />
        </svg>
      );
    case 'pbt':
      return (
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden>
          <line x1={cx} y1="20" x2={cx} y2={size - 20} stroke={stroke} strokeWidth="3" />
          {[0, 90, 180, 270].map((a) => {
            const rad = (a * Math.PI) / 180;
            const x1 = cx + Math.cos(rad) * 18;
            const y1 = cy + Math.sin(rad) * 18;
            const x2 = cx + Math.cos(rad) * 80;
            const y2 = cy + Math.sin(rad) * 80;
            return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFBF00" strokeWidth="14" strokeLinecap="round" />;
          })}
          {[0, 90, 180, 270].map((a) => {
            const rad = (a * Math.PI) / 180;
            const x1 = cx + Math.cos(rad) * 18;
            const y1 = cy + Math.sin(rad) * 18;
            const x2 = cx + Math.cos(rad) * 80;
            const y2 = cy + Math.sin(rad) * 80;
            return <line key={`b-${a}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth="1.5" />;
          })}
          <circle cx={cx} cy={cy} r="14" fill={stroke} />
        </svg>
      );
    case 'rushton':
      return (
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden>
          <line x1={cx} y1="20" x2={cx} y2={size - 20} stroke={stroke} strokeWidth="3" />
          <circle cx={cx} cy={cy} r="46" fill="#fff" stroke={stroke} strokeWidth="1.5" />
          {[0, 60, 120, 180, 240, 300].map((a) => {
            const rad = (a * Math.PI) / 180;
            const x = cx + Math.cos(rad) * 46;
            const y = cy + Math.sin(rad) * 46;
            const x2 = cx + Math.cos(rad) * 80;
            const y2 = cy + Math.sin(rad) * 80;
            return <rect key={a} x={x} y={y - 12} width={x2 - x} height={24} fill="#FFBF00" stroke={stroke} strokeWidth="1.2"
              transform={`rotate(${a} ${x} ${y})`} />;
          })}
          <circle cx={cx} cy={cy} r="14" fill={stroke} />
        </svg>
      );
    case 'curved':
      return (
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden>
          <line x1={cx} y1="20" x2={cx} y2={size - 20} stroke={stroke} strokeWidth="3" />
          <circle cx={cx} cy={cy} r="46" fill="#fff" stroke={stroke} strokeWidth="1.5" />
          {[0, 60, 120, 180, 240, 300].map((a) => {
            const rad = (a * Math.PI) / 180;
            const x = cx + Math.cos(rad) * 46;
            const y = cy + Math.sin(rad) * 46;
            const x2 = cx + Math.cos(rad) * 80;
            const y2 = cy + Math.sin(rad) * 80;
            const cmx = (x + x2) / 2 + Math.cos(rad + Math.PI / 2) * 10;
            const cmy = (y + y2) / 2 + Math.sin(rad + Math.PI / 2) * 10;
            return <path key={a} d={`M ${x} ${y} Q ${cmx} ${cmy} ${x2} ${y2}`} stroke="#FFBF00" strokeWidth="14" fill="none" strokeLinecap="round" />;
          })}
          <circle cx={cx} cy={cy} r="14" fill={stroke} />
        </svg>
      );
    case 'paddle':
      return (
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden>
          <line x1={cx} y1="20" x2={cx} y2={size - 20} stroke={stroke} strokeWidth="3" />
          <rect x={cx - 90} y={cy - 14} width={180} height={28} fill="#FFBF00" stroke={stroke} strokeWidth="1.5" rx="3" />
          <circle cx={cx} cy={cy} r="14" fill={stroke} />
        </svg>
      );
    case 'anchor':
      return (
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden>
          <line x1={cx} y1="20" x2={cx} y2={cy - 10} stroke={stroke} strokeWidth="3" />
          <path d={`M ${cx - 80} ${cy + 20} L ${cx - 80} ${cy + 60} A 60 60 0 0 0 ${cx + 80} ${cy + 60} L ${cx + 80} ${cy + 20}`}
            fill="none" stroke="#FFBF00" strokeWidth="14" strokeLinecap="round" />
          <line x1={cx - 80} y1={cy + 20} x2={cx + 80} y2={cy + 20} stroke="#FFBF00" strokeWidth="14" strokeLinecap="round" />
          <line x1={cx} y1={cy + 20} x2={cx} y2={cy - 10} stroke={stroke} strokeWidth="3" />
        </svg>
      );
    case 'helical':
      return (
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden>
          <line x1={cx} y1="20" x2={cx} y2={size - 20} stroke={stroke} strokeWidth="3" />
          {[0, 1, 2, 3].map((i) => {
            const y = 35 + i * 40;
            return (
              <ellipse key={i} cx={cx} cy={y} rx="65" ry="14" fill="none" stroke="#FFBF00" strokeWidth="6"
                strokeDasharray="60 50" />
            );
          })}
          <line x1={cx - 65} y1={35} x2={cx - 65} y2={size - 35} stroke="#FFBF00" strokeWidth="4" />
          <line x1={cx + 65} y1={35} x2={cx + 65} y2={size - 35} stroke="#FFBF00" strokeWidth="4" />
        </svg>
      );
    default:
      return null;
  }
};

const ImpellerStepper: React.FC = () => {
  const [active, setActive] = useState(0);
  const i = impellers[active];

  const familyLabel: Record<ImpellerSpec['family'], string> = {
    axial: 'Flujo axial',
    radial: 'Flujo radial',
    viscoso: 'Para fluidos viscosos',
  };

  return (
    <div className="my-8 not-prose">
      <div className="flex flex-wrap gap-2 mb-4" role="tablist">
        {impellers.map((t, k) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={k === active}
            onClick={() => setActive(k)}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              k === active
                ? 'bg-brand-dark text-white border-brand-dark'
                : 'bg-white text-brand-gray border-zinc-300 hover:border-brand-dark hover:text-brand-dark'
            }`}
          >
            {t.name.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-4 flex items-center justify-center min-h-[280px]">
          <ImpellerSVG id={i.id} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-brand-yellow-dark mb-1">
            {familyLabel[i.family]} · Patrón {i.flow}
          </p>
          <h4 className="text-xl font-bold text-brand-dark mb-3">{i.name}</h4>
          <p className="text-sm text-brand-gray leading-relaxed mb-4">{i.description}</p>

          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div className="rounded-lg bg-zinc-50 p-3 border border-zinc-200">
              <div className="text-xs text-brand-gray uppercase">Np (turbulento, con bafles)</div>
              <div className="font-mono font-semibold text-brand-dark">{i.Np}</div>
            </div>
            <div className="rounded-lg bg-zinc-50 p-3 border border-zinc-200">
              <div className="text-xs text-brand-gray uppercase">Velocidad típica</div>
              <div className="font-mono font-semibold text-brand-dark">{i.rpmRange[0]}–{i.rpmRange[1]} rpm</div>
            </div>
          </div>

          <p className="text-sm">
            <span className="font-semibold text-brand-dark">Aplicaciones: </span>
            <span className="text-brand-gray">{i.uses}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

/* ─── Diagrama de patrones de flujo ─── */
const FlowPatternDiagram: React.FC<{ pattern: 'axial' | 'radial' }> = ({ pattern }) => {
  const W = 360;
  const H = 280;
  const cx = W / 2;
  const wallTop = 30;
  const wallBot = H - 30;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="max-w-full" role="img"
      aria-label={`Patrón de flujo ${pattern}`}>
      {/* Tank */}
      <line x1={70} y1={wallTop} x2={70} y2={wallBot} stroke="#1A1A1A" strokeWidth="3" />
      <line x1={W - 70} y1={wallTop} x2={W - 70} y2={wallBot} stroke="#1A1A1A" strokeWidth="3" />
      <path d={`M 70 ${wallBot} Q ${cx} ${wallBot + 20} ${W - 70} ${wallBot}`} stroke="#1A1A1A" strokeWidth="3" fill="none" />
      {/* Liquid */}
      <path d={`M 70 ${wallTop + 20} L 70 ${wallBot} Q ${cx} ${wallBot + 20} ${W - 70} ${wallBot} L ${W - 70} ${wallTop + 20} Z`}
        fill="#dbeafe" opacity="0.5" />
      {/* Shaft */}
      <line x1={cx} y1={10} x2={cx} y2={H / 2 + 30} stroke="#1A1A1A" strokeWidth="3" />
      {/* Impeller */}
      <rect x={cx - 35} y={H / 2 + 26} width={70} height={10} fill="#FFBF00" stroke="#1A1A1A" strokeWidth="1.5" />

      {/* Arrows */}
      {pattern === 'axial' ? (
        <>
          <path d={`M ${cx - 20} ${H / 2 + 50} L ${cx - 20} ${wallBot - 20} L ${cx - 70} ${wallBot - 30} L ${cx - 100} ${wallBot - 60} L ${cx - 100} ${wallTop + 50} L ${cx - 50} ${wallTop + 30} L ${cx - 30} ${H / 2 + 25}`}
            fill="none" stroke="#1d4ed8" strokeWidth="2.5" markerEnd="url(#arrowAx)" />
          <path d={`M ${cx + 20} ${H / 2 + 50} L ${cx + 20} ${wallBot - 20} L ${cx + 70} ${wallBot - 30} L ${cx + 100} ${wallBot - 60} L ${cx + 100} ${wallTop + 50} L ${cx + 50} ${wallTop + 30} L ${cx + 30} ${H / 2 + 25}`}
            fill="none" stroke="#1d4ed8" strokeWidth="2.5" markerEnd="url(#arrowAx)" />
          <defs>
            <marker id="arrowAx" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0 0 L8 4 L0 8 z" fill="#1d4ed8" />
            </marker>
          </defs>
          <text x={cx} y={H - 6} textAnchor="middle" fontSize="13" fontWeight="700" fill="#1d4ed8">Patrón axial</text>
        </>
      ) : (
        <>
          <path d={`M ${cx + 35} ${H / 2 + 31} L ${W - 80} ${H / 2 + 31} L ${W - 80} ${wallBot - 30}`}
            fill="none" stroke="#b45309" strokeWidth="2.5" markerEnd="url(#arrowR)" />
          <path d={`M ${cx + 35} ${H / 2 + 31} L ${W - 80} ${H / 2 + 31} L ${W - 80} ${wallTop + 30}`}
            fill="none" stroke="#b45309" strokeWidth="2.5" markerEnd="url(#arrowR)" />
          <path d={`M ${cx - 35} ${H / 2 + 31} L 80 ${H / 2 + 31} L 80 ${wallBot - 30}`}
            fill="none" stroke="#b45309" strokeWidth="2.5" markerEnd="url(#arrowR)" />
          <path d={`M ${cx - 35} ${H / 2 + 31} L 80 ${H / 2 + 31} L 80 ${wallTop + 30}`}
            fill="none" stroke="#b45309" strokeWidth="2.5" markerEnd="url(#arrowR)" />
          <defs>
            <marker id="arrowR" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0 0 L8 4 L0 8 z" fill="#b45309" />
            </marker>
          </defs>
          <text x={cx} y={H - 6} textAnchor="middle" fontSize="13" fontWeight="700" fill="#b45309">Patrón radial</text>
        </>
      )}
    </svg>
  );
};

/* ─── Comparación con/sin bafles ─── */
const VortexComparison: React.FC = () => {
  return (
    <div className="grid md:grid-cols-2 gap-4 my-6 not-prose">
      <div className="rounded-xl bg-white border border-zinc-200 p-4 text-center">
        <h5 className="text-sm font-semibold text-brand-dark mb-2">Sin bafles</h5>
        <svg viewBox="0 0 280 240" className="w-full max-w-[280px] mx-auto" aria-label="Vórtice sin bafles">
          <line x1="40" y1="20" x2="40" y2="220" stroke="#1A1A1A" strokeWidth="3" />
          <line x1="240" y1="20" x2="240" y2="220" stroke="#1A1A1A" strokeWidth="3" />
          <path d="M 40 220 Q 140 240 240 220" stroke="#1A1A1A" strokeWidth="3" fill="none" />
          <path d="M 40 60 Q 140 100 140 130 Q 140 100 240 60 L 240 220 Q 140 240 40 220 Z" fill="#dbeafe" opacity="0.6" />
          <path d="M 40 60 Q 140 100 140 130 Q 140 100 240 60" stroke="#1d4ed8" strokeWidth="2" fill="none" />
          <line x1="140" y1="10" x2="140" y2="160" stroke="#1A1A1A" strokeWidth="3" />
          <rect x="105" y="156" width="70" height="10" fill="#FFBF00" stroke="#1A1A1A" strokeWidth="1.5" />
          <text x="140" y="232" textAnchor="middle" fontSize="11" fill="#7f1d1d" fontWeight="700">vórtice profundo</text>
        </svg>
        <p className="text-xs text-brand-gray mt-1">El fluido rota como cuerpo rígido y forma un vórtice central.</p>
      </div>

      <div className="rounded-xl bg-white border border-zinc-200 p-4 text-center">
        <h5 className="text-sm font-semibold text-brand-dark mb-2">Con 4 bafles</h5>
        <svg viewBox="0 0 280 240" className="w-full max-w-[280px] mx-auto" aria-label="Tanque con bafles">
          <line x1="40" y1="20" x2="40" y2="220" stroke="#1A1A1A" strokeWidth="3" />
          <line x1="240" y1="20" x2="240" y2="220" stroke="#1A1A1A" strokeWidth="3" />
          <path d="M 40 220 Q 140 240 240 220" stroke="#1A1A1A" strokeWidth="3" fill="none" />
          <path d="M 40 50 L 240 50 L 240 220 Q 140 240 40 220 Z" fill="#dbeafe" opacity="0.6" />
          <line x1="40" y1="50" x2="240" y2="50" stroke="#1d4ed8" strokeWidth="2" />
          {/* Baffles */}
          <rect x="44" y="50" width="12" height="160" fill="#1A1A1A" />
          <rect x="224" y="50" width="12" height="160" fill="#1A1A1A" />
          {/* Shaft + impeller */}
          <line x1="140" y1="10" x2="140" y2="160" stroke="#1A1A1A" strokeWidth="3" />
          <rect x="105" y="156" width="70" height="10" fill="#FFBF00" stroke="#1A1A1A" strokeWidth="1.5" />
          <text x="140" y="232" textAnchor="middle" fontSize="11" fill="#047857" fontWeight="700">superficie plana</text>
        </svg>
        <p className="text-xs text-brand-gray mt-1">Los bafles cortan el remolino y crean turbulencia tridimensional efectiva.</p>
      </div>
    </div>
  );
};

/* ─── Diagrama de geometría estándar de tanque ─── */
const TankGeometryDiagram: React.FC = () => {
  const Dt = 240;       // tank diameter SVG units
  const W = 360;
  const H = 360;
  const tankX = (W - Dt) / 2;
  const tankYTop = 50;
  const tankYBot = H - 30;
  const liquidH = Dt;          // H = Dt
  const liquidY = tankYBot - liquidH;
  const Da = Dt / 3;
  const E = Dt / 3;
  const baffleW = Dt / 12;
  const impellerY = tankYBot - E;

  const dim = '#7f1d1d';
  const txt = '#1A1A1A';
  return (
    <div className="my-6 not-prose flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[440px]" aria-label="Geometría estándar del tanque">
        {/* Tank walls */}
        <line x1={tankX} y1={tankYTop} x2={tankX} y2={tankYBot} stroke={txt} strokeWidth="3" />
        <line x1={tankX + Dt} y1={tankYTop} x2={tankX + Dt} y2={tankYBot} stroke={txt} strokeWidth="3" />
        <path d={`M ${tankX} ${tankYBot} Q ${W / 2} ${tankYBot + 20} ${tankX + Dt} ${tankYBot}`} stroke={txt} strokeWidth="3" fill="none" />
        {/* Liquid */}
        <path d={`M ${tankX} ${liquidY} L ${tankX} ${tankYBot} Q ${W / 2} ${tankYBot + 20} ${tankX + Dt} ${tankYBot} L ${tankX + Dt} ${liquidY} Z`}
          fill="#dbeafe" opacity="0.55" />
        <line x1={tankX} y1={liquidY} x2={tankX + Dt} y2={liquidY} stroke="#1d4ed8" strokeWidth="1.5" />
        {/* Baffles */}
        <rect x={tankX + 4} y={liquidY} width={baffleW} height={tankYBot - liquidY} fill="#1A1A1A" opacity="0.85" />
        <rect x={tankX + Dt - 4 - baffleW} y={liquidY} width={baffleW} height={tankYBot - liquidY} fill="#1A1A1A" opacity="0.85" />
        {/* Shaft + impeller */}
        <line x1={W / 2} y1={20} x2={W / 2} y2={impellerY} stroke={txt} strokeWidth="3" />
        <rect x={W / 2 - Da / 2} y={impellerY} width={Da} height={10} fill="#FFBF00" stroke={txt} strokeWidth="1.5" />
        {/* Dimensions */}
        {/* Dt */}
        <line x1={tankX} y1={tankYTop - 14} x2={tankX + Dt} y2={tankYTop - 14} stroke={dim} strokeWidth="1" markerStart="url(#dl)" markerEnd="url(#dr)" />
        <text x={W / 2} y={tankYTop - 18} textAnchor="middle" fontSize="13" fill={dim} fontWeight="700">D_t</text>
        {/* Da */}
        <line x1={W / 2 - Da / 2} y1={impellerY + 26} x2={W / 2 + Da / 2} y2={impellerY + 26} stroke={dim} strokeWidth="1" markerStart="url(#dl)" markerEnd="url(#dr)" />
        <text x={W / 2} y={impellerY + 22} textAnchor="middle" fontSize="12" fill={dim} fontWeight="700">D_a</text>
        {/* H */}
        <line x1={tankX + Dt + 14} y1={liquidY} x2={tankX + Dt + 14} y2={tankYBot} stroke={dim} strokeWidth="1" markerStart="url(#du)" markerEnd="url(#dd)" />
        <text x={tankX + Dt + 18} y={(liquidY + tankYBot) / 2 + 4} fontSize="13" fill={dim} fontWeight="700">H</text>
        {/* E */}
        <line x1={W / 2 + Da / 2 + 14} y1={impellerY + 5} x2={W / 2 + Da / 2 + 14} y2={tankYBot} stroke={dim} strokeWidth="1" markerStart="url(#du)" markerEnd="url(#dd)" />
        <text x={W / 2 + Da / 2 + 18} y={(impellerY + tankYBot) / 2 + 4} fontSize="13" fill={dim} fontWeight="700">E</text>
        {/* W (baffle width) */}
        <text x={tankX + 4} y={liquidY - 6} fontSize="11" fill={dim} fontWeight="700">W=Dt/12</text>

        <defs>
          <marker id="dl" markerWidth="8" markerHeight="8" refX="2" refY="4" orient="auto">
            <path d="M8 0 L0 4 L8 8 z" fill={dim} />
          </marker>
          <marker id="dr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 z" fill={dim} />
          </marker>
          <marker id="du" markerWidth="8" markerHeight="8" refX="4" refY="2" orient="auto">
            <path d="M0 8 L4 0 L8 8 z" fill={dim} />
          </marker>
          <marker id="dd" markerWidth="8" markerHeight="8" refX="4" refY="6" orient="auto">
            <path d="M0 0 L4 8 L8 0 z" fill={dim} />
          </marker>
        </defs>
      </svg>
    </div>
  );
};

/* ─── Curva Np vs Re interactiva ─── */
const NpReChart: React.FC = () => {
  const [showImpeller, setShowImpeller] = useState<string>('rushton');
  const [Re, setRe] = useState(1e4);

  const W = 600;
  const H = 360;
  const margin = { top: 20, right: 24, bottom: 56, left: 64 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  const reMin = 1, reMax = 1e6;
  const npMin = 0.1, npMax = 100;

  const xScale = (re: number) =>
    margin.left + ((Math.log10(re) - Math.log10(reMin)) / (Math.log10(reMax) - Math.log10(reMin))) * plotW;
  const yScale = (np: number) =>
    margin.top + plotH - ((Math.log10(np) - Math.log10(npMin)) / (Math.log10(npMax) - Math.log10(npMin))) * plotH;

  // Curvas: Np(Re) ≈ Kl/Re para laminar, plateau para turbulento (con bafles)
  // Modelo: Np = Kl/Re + Kt   (suaviza la transición)
  const curves: { id: string; name: string; Kl: number; Kt: number; color: string }[] = [
    { id: 'rushton',  name: 'Rushton',         Kl: 65,  Kt: 5.5,  color: '#7f1d1d' },
    { id: 'pbt',      name: 'PBT 45°',         Kl: 50,  Kt: 1.5,  color: '#b45309' },
    { id: 'helice',   name: 'Hélice marina',   Kl: 41,  Kt: 0.35, color: '#1d4ed8' },
    { id: 'paddle',   name: 'Paletas',         Kl: 70,  Kt: 2.0,  color: '#15803d' },
    { id: 'anchor',   name: 'Ancla',           Kl: 300, Kt: 0.5,  color: '#9333ea' },
  ];

  const npFn = (c: { Kl: number; Kt: number }, re: number) => c.Kl / re + c.Kt;

  const pathFor = (c: { Kl: number; Kt: number }) => {
    const pts: string[] = [];
    for (let lr = 0; lr <= 6; lr += 0.04) {
      const re = Math.pow(10, lr);
      const np = Math.max(npMin, Math.min(npMax, npFn(c, re)));
      pts.push(`${pts.length === 0 ? 'M' : 'L'}${xScale(re).toFixed(1)} ${yScale(np).toFixed(1)}`);
    }
    return pts.join(' ');
  };

  const xTicks = [1, 10, 100, 1000, 10000, 1e5, 1e6];
  const yTicks = [0.1, 1, 10, 100];

  const fmtRe = (re: number) => {
    if (re < 1) return re.toFixed(2);
    if (re < 1000) return re.toFixed(0);
    if (re < 1e6) return (re / 1000).toFixed(0) + 'k';
    return (re / 1e6).toFixed(1) + 'M';
  };

  // Régimen
  const regime = Re < 10 ? 'Laminar' : Re < 1e4 ? 'Transicional' : 'Turbulento';
  const regimeColor = Re < 10 ? '#7f1d1d' : Re < 1e4 ? '#b45309' : '#15803d';

  return (
    <div className="my-6 not-prose">
      <div className="rounded-xl bg-white border border-zinc-200 p-5 sm:p-6 shadow-sm">
        <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
          <h4 className="text-base font-semibold text-brand-dark">{String.raw`Curva $N_P$ vs $\text{Re}_{ag}$ — log-log`}</h4>
          <div className="text-sm text-brand-gray">
            {String.raw`$\text{Re}_{ag}$`}: <span className="font-mono text-brand-dark font-semibold">{fmtRe(Re)}</span>
            {' · '}
            <span className="font-semibold" style={{ color: regimeColor }}>{regime}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {curves.map((c) => (
            <button
              key={c.id}
              onClick={() => setShowImpeller(c.id)}
              className={`px-2.5 py-1 text-xs rounded-full border-2 transition-all ${
                showImpeller === c.id ? 'bg-brand-dark text-white' : 'bg-white text-brand-gray hover:text-brand-dark'
              }`}
              style={{ borderColor: c.color }}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[680px]" role="img" aria-label="Np vs Re">
            <rect x={margin.left} y={margin.top} width={plotW} height={plotH} fill="#fafafa" />

            {/* Régimen background bands */}
            <rect x={xScale(reMin)} y={margin.top} width={xScale(10) - xScale(reMin)} height={plotH} fill="#fee2e2" opacity="0.35" />
            <rect x={xScale(10)} y={margin.top} width={xScale(1e4) - xScale(10)} height={plotH} fill="#fef3c7" opacity="0.4" />
            <rect x={xScale(1e4)} y={margin.top} width={xScale(reMax) - xScale(1e4)} height={plotH} fill="#dcfce7" opacity="0.35" />

            {/* Gridlines */}
            {xTicks.map((t) => {
              const x = xScale(t);
              return (
                <g key={`x-${t}`}>
                  <line x1={x} y1={margin.top} x2={x} y2={margin.top + plotH} stroke="#e4e4e7" strokeWidth="0.5" strokeDasharray="2 2" />
                  <text x={x} y={margin.top + plotH + 18} textAnchor="middle" fontSize="11" fill="#52525b">
                    {t < 1000 ? t : t < 1e6 ? `${t / 1000}k` : `${t / 1e6}M`}
                  </text>
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

            {/* Axis */}
            <line x1={margin.left} y1={margin.top + plotH} x2={margin.left + plotW} y2={margin.top + plotH} stroke="#27272a" strokeWidth="1.2" />
            <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + plotH} stroke="#27272a" strokeWidth="1.2" />

            <text x={margin.left + plotW / 2} y={H - 8} textAnchor="middle" fontSize="12" fill="#27272a" fontWeight="600">
              Reynolds de agitación (Re_ag)
            </text>
            <text x="14" y={margin.top + plotH / 2} textAnchor="middle" fontSize="12" fill="#27272a" fontWeight="600"
              transform={`rotate(-90 14 ${margin.top + plotH / 2})`}>
              Número de potencia (N_P)
            </text>

            {/* Régimen labels */}
            <text x={(xScale(reMin) + xScale(10)) / 2} y={margin.top + 14} textAnchor="middle" fontSize="10" fill="#7f1d1d" fontWeight="700">Laminar</text>
            <text x={(xScale(10) + xScale(1e4)) / 2} y={margin.top + 14} textAnchor="middle" fontSize="10" fill="#b45309" fontWeight="700">Transicional</text>
            <text x={(xScale(1e4) + xScale(reMax)) / 2} y={margin.top + 14} textAnchor="middle" fontSize="10" fill="#15803d" fontWeight="700">Turbulento</text>

            {/* Curves */}
            {curves.map((c) => (
              <path key={c.id} d={pathFor(c)} stroke={c.color} strokeWidth={c.id === showImpeller ? 3 : 1.5}
                opacity={c.id === showImpeller ? 1 : 0.35} fill="none" />
            ))}

            {/* Cursor */}
            <line x1={xScale(Re)} y1={margin.top} x2={xScale(Re)} y2={margin.top + plotH}
              stroke="#1A1A1A" strokeWidth="1.2" strokeDasharray="4 2" opacity="0.7" />
            {curves.map((c) => {
              const np = Math.max(npMin, Math.min(npMax, npFn(c, Re)));
              return c.id === showImpeller ? (
                <circle key={c.id} cx={xScale(Re)} cy={yScale(np)} r="6" fill={c.color} stroke="white" strokeWidth="2" />
              ) : null;
            })}
          </svg>
        </div>

        <input
          type="range"
          min={0}
          max={6}
          step={0.05}
          value={Math.log10(Re)}
          onChange={(e) => setRe(Math.pow(10, parseFloat(e.target.value)))}
          className="w-full mt-3 accent-brand-yellow-dark"
          aria-label="Reynolds de agitación"
        />

        <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
          <div className="rounded-lg bg-zinc-50 p-3 border border-zinc-200">
            <div className="text-xs text-brand-gray uppercase">Re_ag</div>
            <div className="font-mono font-semibold text-brand-dark">{fmtRe(Re)}</div>
          </div>
          <div className="rounded-lg bg-zinc-50 p-3 border border-zinc-200">
            <div className="text-xs text-brand-gray uppercase">N_P (impulsor activo)</div>
            <div className="font-mono font-semibold text-brand-dark">
              {npFn(curves.find((c) => c.id === showImpeller)!, Re).toFixed(2)}
            </div>
          </div>
          <div className="rounded-lg p-3 border" style={{ backgroundColor: regimeColor + '22', borderColor: regimeColor + '88' }}>
            <div className="text-xs uppercase font-semibold" style={{ color: regimeColor }}>Régimen</div>
            <div className="font-semibold text-brand-dark">{regime}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Calculadora de potencia de agitación ─── */
const AgitationPowerCalculator: React.FC = () => {
  const [Da, setDa] = useState(0.5);  // m
  const [N, setN] = useState(120);    // rpm
  const [rho, setRho] = useState(1000);
  const [mu, setMu] = useState(1);    // cP
  const [impellerId, setImpellerId] = useState('rushton');
  const [etaMot, setEtaMot] = useState(0.92);

  const muSI = mu * 1e-3;        // Pa·s
  const Nrps = N / 60;
  const Re = (Da * Da * Nrps * rho) / muSI;
  const curves = { rushton: { Kl: 65, Kt: 5.5 }, pbt: { Kl: 50, Kt: 1.5 }, helice: { Kl: 41, Kt: 0.35 }, paddle: { Kl: 70, Kt: 2.0 } };
  const c = curves[impellerId as keyof typeof curves];
  const Np = c.Kl / Re + c.Kt;
  const P = Np * rho * Math.pow(Nrps, 3) * Math.pow(Da, 5);
  const Pmotor = P / etaMot;

  const fmt = (v: number, d = 2) => Number.isFinite(v) ? v.toFixed(d) : '—';

  return (
    <div className="my-8 not-prose">
      <div className="rounded-xl bg-white border border-zinc-200 p-5 sm:p-6 shadow-sm">
        <h4 className="text-base font-semibold text-brand-dark mb-4">Calculadora de potencia de agitación</h4>

        <div className="grid md:grid-cols-2 gap-x-6 gap-y-3">
          <label className="block">
            <div className="flex justify-between text-xs mb-1"><span className="text-brand-gray">Diámetro impulsor D_a</span><span className="font-mono font-semibold">{Da.toFixed(2)} m</span></div>
            <input type="range" min={0.05} max={2.5} step={0.01} value={Da} onChange={(e) => setDa(+e.target.value)} className="w-full accent-brand-yellow-dark" />
          </label>
          <label className="block">
            <div className="flex justify-between text-xs mb-1"><span className="text-brand-gray">Velocidad N</span><span className="font-mono font-semibold">{N.toFixed(0)} rpm</span></div>
            <input type="range" min={5} max={1500} step={1} value={N} onChange={(e) => setN(+e.target.value)} className="w-full accent-brand-yellow-dark" />
          </label>
          <label className="block">
            <div className="flex justify-between text-xs mb-1"><span className="text-brand-gray">Densidad ρ</span><span className="font-mono font-semibold">{rho.toFixed(0)} kg/m³</span></div>
            <input type="range" min={600} max={1600} step={10} value={rho} onChange={(e) => setRho(+e.target.value)} className="w-full accent-brand-yellow-dark" />
          </label>
          <label className="block">
            <div className="flex justify-between text-xs mb-1"><span className="text-brand-gray">Viscosidad μ</span><span className="font-mono font-semibold">{mu < 10 ? mu.toFixed(1) : mu.toFixed(0)} cP</span></div>
            <input type="range" min={0} max={5} step={0.05} value={Math.log10(mu)} onChange={(e) => setMu(Math.pow(10, +e.target.value))} className="w-full accent-brand-yellow-dark" />
          </label>
          <label className="block">
            <div className="text-xs text-brand-gray mb-1">Impulsor</div>
            <select
              value={impellerId}
              onChange={(e) => setImpellerId(e.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white text-sm py-1.5 px-2 text-brand-dark"
            >
              <option value="rushton">Turbina Rushton (Np_t ≈ 5.5)</option>
              <option value="pbt">PBT 45° (Np_t ≈ 1.5)</option>
              <option value="helice">Hélice marina (Np_t ≈ 0.35)</option>
              <option value="paddle">Paletas (Np_t ≈ 2.0)</option>
            </select>
          </label>
          <label className="block">
            <div className="flex justify-between text-xs mb-1"><span className="text-brand-gray">η motor</span><span className="font-mono font-semibold">{(etaMot * 100).toFixed(0)} %</span></div>
            <input type="range" min={0.7} max={0.97} step={0.01} value={etaMot} onChange={(e) => setEtaMot(+e.target.value)} className="w-full accent-brand-yellow-dark" />
          </label>
        </div>

        <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          <div className="rounded-lg bg-zinc-50 p-3 border border-zinc-200">
            <div className="text-xs text-brand-gray uppercase">Re_ag</div>
            <div className="font-mono font-semibold text-brand-dark">{Re < 1e4 ? fmt(Re, 0) : (Re / 1000).toFixed(0) + 'k'}</div>
          </div>
          <div className="rounded-lg bg-zinc-50 p-3 border border-zinc-200">
            <div className="text-xs text-brand-gray uppercase">N_P</div>
            <div className="font-mono font-semibold text-brand-dark">{fmt(Np, 2)}</div>
          </div>
          <div className="rounded-lg bg-zinc-50 p-3 border border-zinc-200">
            <div className="text-xs text-brand-gray uppercase">P al fluido</div>
            <div className="font-mono font-semibold text-brand-dark">
              {P > 1000 ? (P / 1000).toFixed(2) + ' kW' : P.toFixed(0) + ' W'}
            </div>
          </div>
          <div className="rounded-lg bg-yellow-50 p-3 border border-yellow-200">
            <div className="text-xs uppercase font-semibold text-brand-yellow-dark">P motor</div>
            <div className="font-mono font-semibold text-brand-dark">
              {Pmotor > 1000 ? (Pmotor / 1000).toFixed(2) + ' kW' : Pmotor.toFixed(0) + ' W'}
            </div>
          </div>
        </div>

        <p className="text-xs text-brand-gray mt-3 italic">
          {String.raw`$\text{Re}_{ag} = D_a^2 N \rho / \mu$, $P = N_P \rho N^3 D_a^5$, con $N$ en rev/s y $D_a$ en m. La curva $N_P(\text{Re})$ se modela como $K_l/\text{Re} + K_t$.`}
        </p>
      </div>
    </div>
  );
};

/* ─── Calculadora de escalado ─── */
const ScaleupCalculator: React.FC = () => {
  // Modelo a escala 1
  const [N1, setN1] = useState(300);  // rpm
  const [Da1, setDa1] = useState(0.2); // m
  const [scaleVol, setScaleVol] = useState(125); // V2/V1
  const [criterion, setCriterion] = useState<'pv' | 'vtip' | 're' | 'tmix'>('pv');
  const [Np, setNp] = useState(5.5);
  const rho = 1000;

  // Si V escala con D^3 y similitud geométrica: D2/D1 = (V2/V1)^(1/3)
  const R = Math.pow(scaleVol, 1 / 3);   // D2/D1
  const Da2 = Da1 * R;

  // Cálculo de N2/N1 según criterio
  let nRatio = 1;
  if (criterion === 'pv') nRatio = Math.pow(R, -2 / 3);
  else if (criterion === 'vtip') nRatio = Math.pow(R, -1);
  else if (criterion === 're') nRatio = Math.pow(R, -2);
  else if (criterion === 'tmix') nRatio = 1;

  const N2 = N1 * nRatio;
  const N1rps = N1 / 60;
  const N2rps = N2 / 60;

  const P1 = Np * rho * Math.pow(N1rps, 3) * Math.pow(Da1, 5);
  const P2 = Np * rho * Math.pow(N2rps, 3) * Math.pow(Da2, 5);
  const V1 = (Math.PI / 4) * Math.pow(Da1 * 3, 2) * (Da1 * 3); // Dt = 3*Da, H = Dt
  const V2 = V1 * scaleVol;
  const PV1 = P1 / V1;
  const PV2 = P2 / V2;
  const vtip1 = Math.PI * Da1 * N1rps;
  const vtip2 = Math.PI * Da2 * N2rps;
  const Re1 = (Da1 * Da1 * N1rps * rho) / 1e-3;
  const Re2 = (Da2 * Da2 * N2rps * rho) / 1e-3;

  const fmt = (v: number, d = 1) => Number.isFinite(v) ? v.toFixed(d) : '—';
  const fmtP = (P: number) => P > 1000 ? (P / 1000).toFixed(2) + ' kW' : P.toFixed(0) + ' W';

  const Cell: React.FC<{ label: string; v1: string; v2: string; ratio: string }> = ({ label, v1, v2, ratio }) => (
    <tr className="border-t border-zinc-200">
      <td className="py-2 px-2 text-sm font-medium text-brand-dark">{label}</td>
      <td className="py-2 px-2 text-sm text-brand-gray text-right font-mono">{v1}</td>
      <td className="py-2 px-2 text-sm text-brand-gray text-right font-mono">{v2}</td>
      <td className="py-2 px-2 text-sm text-right font-mono font-semibold text-brand-yellow-dark">{ratio}</td>
    </tr>
  );

  const criteriaInfo: Record<string, { name: string; desc: string }> = {
    pv: { name: 'P/V constante', desc: 'Mantiene la disipación específica de potencia. Útil para dispersión gas-líquido y fermentaciones.' },
    vtip: { name: 'V_tip constante', desc: 'Mantiene la cizalladura periférica. Crítico para emulsiones y bioprocesos con células sensibles.' },
    re: { name: 'Re_ag constante', desc: 'Mantiene el patrón hidrodinámico. Solo aplicable cuando macromezcla domina.' },
    tmix: { name: 't_mix constante (≈ N constante)', desc: 'Mantiene el tiempo de homogeneización — exige aumentar mucho la potencia con la escala.' },
  };

  return (
    <div className="my-8 not-prose">
      <div className="rounded-xl bg-white border border-zinc-200 p-5 sm:p-6 shadow-sm">
        <h4 className="text-base font-semibold text-brand-dark mb-3">Calculadora de escalado (similitud geométrica)</h4>

        <div className="grid md:grid-cols-2 gap-x-6 gap-y-3 mb-4">
          <label className="block">
            <div className="flex justify-between text-xs mb-1"><span className="text-brand-gray">D_a (modelo, escala 1)</span><span className="font-mono font-semibold">{Da1.toFixed(2)} m</span></div>
            <input type="range" min={0.05} max={1} step={0.01} value={Da1} onChange={(e) => setDa1(+e.target.value)} className="w-full accent-brand-yellow-dark" />
          </label>
          <label className="block">
            <div className="flex justify-between text-xs mb-1"><span className="text-brand-gray">N (modelo)</span><span className="font-mono font-semibold">{N1.toFixed(0)} rpm</span></div>
            <input type="range" min={50} max={1200} step={5} value={N1} onChange={(e) => setN1(+e.target.value)} className="w-full accent-brand-yellow-dark" />
          </label>
          <label className="block">
            <div className="flex justify-between text-xs mb-1"><span className="text-brand-gray">Factor de escalado V₂/V₁</span><span className="font-mono font-semibold">×{scaleVol.toFixed(0)}</span></div>
            <input type="range" min={2} max={1000} step={1} value={scaleVol} onChange={(e) => setScaleVol(+e.target.value)} className="w-full accent-brand-yellow-dark" />
          </label>
          <label className="block">
            <div className="flex justify-between text-xs mb-1"><span className="text-brand-gray">N_P (turbulento)</span><span className="font-mono font-semibold">{Np.toFixed(1)}</span></div>
            <input type="range" min={0.3} max={6} step={0.1} value={Np} onChange={(e) => setNp(+e.target.value)} className="w-full accent-brand-yellow-dark" />
          </label>
        </div>

        <div className="mb-4">
          <p className="text-xs uppercase font-semibold text-brand-gray mb-1.5">Criterio de escalado</p>
          <div className="flex flex-wrap gap-2">
            {(['pv', 'vtip', 're', 'tmix'] as const).map((k) => (
              <button
                key={k}
                onClick={() => setCriterion(k)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  criterion === k
                    ? 'bg-brand-dark text-white border-brand-dark'
                    : 'bg-white text-brand-gray border-zinc-300 hover:border-brand-dark hover:text-brand-dark'
                }`}
              >
                {criteriaInfo[k].name}
              </button>
            ))}
          </div>
          <p className="text-xs text-brand-gray italic mt-2">{criteriaInfo[criterion].desc}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="bg-zinc-100 text-brand-dark">
                <th className="text-left p-2 border-b border-zinc-300 font-semibold">Parámetro</th>
                <th className="text-right p-2 border-b border-zinc-300 font-semibold">Modelo (escala 1)</th>
                <th className="text-right p-2 border-b border-zinc-300 font-semibold">Prototipo (escala 2)</th>
                <th className="text-right p-2 border-b border-zinc-300 font-semibold">Razón 2/1</th>
              </tr>
            </thead>
            <tbody>
              <Cell label="D_a (m)" v1={fmt(Da1, 3)} v2={fmt(Da2, 3)} ratio={`×${R.toFixed(2)}`} />
              <Cell label="N (rpm)" v1={fmt(N1, 0)} v2={fmt(N2, 0)} ratio={`×${nRatio.toFixed(3)}`} />
              <Cell label="Volumen (m³)" v1={fmt(V1, 3)} v2={fmt(V2, 2)} ratio={`×${scaleVol.toFixed(0)}`} />
              <Cell label="Potencia P (W)" v1={fmtP(P1)} v2={fmtP(P2)} ratio={`×${(P2 / P1).toFixed(1)}`} />
              <Cell label="P/V (W/m³)" v1={fmt(PV1, 0)} v2={fmt(PV2, 0)} ratio={`×${(PV2 / PV1).toFixed(2)}`} />
              <Cell label="V_tip (m/s)" v1={fmt(vtip1, 2)} v2={fmt(vtip2, 2)} ratio={`×${(vtip2 / vtip1).toFixed(2)}`} />
              <Cell label="Re_ag" v1={fmt(Re1, 0)} v2={fmt(Re2, 0)} ratio={`×${(Re2 / Re1).toFixed(2)}`} />
            </tbody>
          </table>
        </div>

        <p className="text-xs text-brand-gray mt-3 italic">
          {String.raw`Asumiendo similitud geométrica completa ($D_t = 3 D_a$, $H = D_t$) y agua como fluido. La razón $D_2/D_1 = (V_2/V_1)^{1/3}$ implica relaciones predecibles entre $N$, $P$, $P/V$ y $V_{tip}$ según el criterio.`}
        </p>
      </div>
    </div>
  );
};

/* ─── Componente principal ─── */
const Agitacion: React.FC = () => {
  const course = getCourseBySlug('iqya-2031');
  if (!course) return null;
  const reading = course.readings.find((r) => r.slug === 'agitacion');
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
          <span>{activeSection ? tocItems.find((t) => t.id === activeSection)?.label ?? 'Contenido' : 'Contenido'}</span>
          <span className="text-brand-gray">{tocOpen ? '−' : '+'}</span>
        </button>
        {tocOpen && (
          <nav className="mt-1 rounded-lg bg-white border border-zinc-200 shadow-lg p-3 space-y-1">
            {activeSection && (
              <button onClick={() => { setActiveSection(null); setTocOpen(false); }}
                className="block w-full text-left py-1.5 px-2 text-sm font-semibold text-brand-yellow-dark hover:bg-zinc-50 rounded transition-colors">
                ← Ver todo
              </button>
            )}
            {tocItems.map((t) => (
              <button key={t.id} onClick={() => handleTocClick(t.id)}
                className={`block w-full text-left py-1 px-2 text-sm rounded transition-colors ${
                  activeSection === t.id ? 'text-brand-dark font-semibold bg-yellow-50' : 'text-brand-gray hover:text-brand-dark hover:bg-zinc-50'
                }`}>
                {t.label}
              </button>
            ))}
          </nav>
        )}
      </div>

      <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-10">
        <nav className="hidden lg:block">
          <div className="sticky top-28 space-y-1 text-sm">
            {activeSection && (
              <button onClick={() => setActiveSection(null)}
                className="block w-full text-left py-1.5 mb-2 text-sm font-semibold text-brand-yellow-dark hover:text-brand-dark transition-colors">
                ← Ver todo
              </button>
            )}
            {tocItems.map((t) => (
              <button key={t.id} onClick={() => handleTocClick(t.id)}
                className={`block w-full text-left py-1 rounded px-2 transition-colors ${
                  activeSection === t.id ? 'text-brand-dark font-semibold bg-yellow-50' : 'text-brand-gray hover:text-brand-dark'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="reading-prose">
          {activeSection === null && (
            <>
              <p className="text-lg leading-relaxed text-brand-gray">
                Esta lectura acompaña al Episodio 5 de <em>Gradiente de Ideas</em>, donde Luis H. Reyes
                conversa con la <strong>Ing. Sofía Vargas (Belcorp)</strong> sobre los principios y
                aplicaciones de la agitación. Es una de las operaciones unitarias más extendidas en la
                industria —cosmética, farmacéutica, alimentos, química y bioprocesos— y la base para
                que el resto del proceso (transferencia de masa, calor, reacción) ocurra de forma
                eficiente y reproducible.
              </p>

              <Figure
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1400&auto=format&fit=crop"
                alt="Tanques agitados en planta industrial"
                caption="Tanques agitados industriales — el corazón de procesos cosméticos, farmacéuticos y bioquímicos."
                maxWidth="720px"
              />

              <InfoCallout title="Aplicación al proyecto del curso">
                Si tu proyecto incluye un tanque agitado (mezcla, reacción, suspensión, dispersión),
                debes:
                <ol className="list-decimal pl-5 mt-2 space-y-1">
                  <li>Definir claramente el <strong>objetivo</strong> de la agitación (homogeneizar, suspender, dispersar gas, transferir calor, etc.).</li>
                  <li>Seleccionar un <strong>tipo de impulsor</strong> apropiado y justificarlo.</li>
                  <li>Estimar las <strong>dimensiones</strong> del tanque y del impulsor con relaciones geométricas estándar.</li>
                  <li>{String.raw`Calcular el $\text{Re}_{ag}$ a las condiciones de operación.`}</li>
                  <li>{String.raw`Determinar el $N_P$ usando la curva $N_P$ vs $\text{Re}_{ag}$.`}</li>
                  <li>Calcular la potencia requerida y la potencia del motor (con eficiencia y factor de servicio).</li>
                  <li>Decidir si lleva <strong>bafles</strong>.</li>
                  <li>Si parten de un diseño de laboratorio, discutir qué <strong>criterio de escalado</strong> aplicaría a su proceso.</li>
                </ol>
              </InfoCallout>
            </>
          )}

          {isVisible('introduccion') && (
            <>
              <SectionTitle id="introduccion">Agitación vs. mezclado</SectionTitle>
              <p>
                Es importante diferenciar dos términos relacionados pero distintos:
              </p>
              <ul>
                <li>
                  <strong>Agitación:</strong> movimiento inducido en un material —típicamente un fluido
                  o mezcla de fluidos— dentro de un recipiente, para crear un patrón de flujo
                  específico.
                </li>
                <li>
                  <strong>Mezclado:</strong> proceso que busca una distribución aleatoria y uniforme de
                  dos o más componentes o fases inicialmente separadas, hasta alcanzar un grado deseado
                  de homogeneidad.
                </li>
              </ul>
              <p>
                La agitación es a menudo el <em>medio</em> para lograr el mezclado, pero se puede
                agitar sin mezclar (mantener agua en movimiento) y se puede mezclar sin un patrón de
                agitación clásico (mezcla por impacto en líneas).
              </p>

              <SubTitle>Para qué se agita</SubTitle>
              <ul>
                <li>Suspender partículas sólidas.</li>
                <li>Dispersar un gas en un líquido (burbujeo, fermentación).</li>
                <li>Promover transferencia de calor (paredes encamisadas, serpentines).</li>
                <li>Mantener homogeneidad o evitar sedimentación.</li>
                <li>Aumentar la velocidad de reacciones químicas (reduciendo resistencia a la transferencia de masa).</li>
                <li>Formar y estabilizar emulsiones (cremas, lociones), suspensiones (maquillajes), incorporar activos.</li>
              </ul>

              <TipCallout title="¿Por qué importa en cosmética?">
                Como cuenta la Ing. Vargas en el episodio, en cosmética la agitación define la
                <strong> textura, apariencia y eficacia</strong> del producto: el tamaño de gota de una
                emulsión determina si una crema se siente sedosa o pesada, y la calidad de la dispersión
                de pigmentos define si un labial es uniforme o granuloso. Un mismo formula con dos
                agitaciones distintas puede dar productos comercialmente incompatibles.
              </TipCallout>
            </>
          )}

          {isVisible('patrones') && (
            <>
              <SectionTitle id="patrones">Patrones de flujo</SectionTitle>
              <p>
                El <strong>impulsor</strong> (o agitador) es el corazón del sistema. Al rotar imparte
                energía al fluido y genera un patrón de flujo característico. Los dos patrones primarios
                son:
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-6 not-prose">
                <div className="rounded-xl bg-white border border-zinc-200 p-4">
                  <FlowPatternDiagram pattern="axial" />
                  <p className="text-sm text-brand-gray leading-relaxed mt-3">
                    <strong className="text-brand-dark">Flujo axial:</strong> el fluido se desplaza
                    paralelo al eje del agitador (hacia abajo o arriba), choca contra el fondo o la
                    superficie y vuelve a las paredes para recircular. <strong>Buen bombeo, bajo
                    cizallamiento.</strong>
                  </p>
                </div>
                <div className="rounded-xl bg-white border border-zinc-200 p-4">
                  <FlowPatternDiagram pattern="radial" />
                  <p className="text-sm text-brand-gray leading-relaxed mt-3">
                    <strong className="text-brand-dark">Flujo radial:</strong> el fluido sale
                    perpendicular al eje hacia las paredes, donde se divide en corrientes ascendente y
                    descendente. Crea zonas de <strong>alta turbulencia y cizalladura</strong> cerca del
                    impulsor.
                  </p>
                </div>
              </div>

              <p>
                Algunos impulsores combinan ambos comportamientos en proporciones variables (las
                turbinas de palas inclinadas son el ejemplo clásico), y los agitadores para fluidos
                viscosos —como anclas o cintas helicoidales— no se ajustan al esquema axial/radial sino
                que tienen patrones cercanos a la pared o flujos forzados muy controlados.
              </p>
            </>
          )}

          {isVisible('impulsores') && (
            <>
              <SectionTitle id="impulsores">Tipos de impulsores</SectionTitle>
              <p>
                La selección del impulsor depende del régimen (laminar, transicional, turbulento), la
                viscosidad, el tipo de mezcla deseada (gas-líquido, líquido-líquido, sólido-líquido), y
                las restricciones del proceso (cizallamiento permitido, sensibilidad biológica, etc.).
                Estos son los más comunes:
              </p>

              <ImpellerStepper />

              <SubTitle>Cómo elegir</SubTitle>
              <div className="my-4 overflow-x-auto not-prose">
                <table className="min-w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-zinc-100 text-brand-dark">
                      <th className="text-left p-3 border border-zinc-200 font-semibold">Si necesitas…</th>
                      <th className="text-left p-3 border border-zinc-200 font-semibold">Impulsor recomendado</th>
                    </tr>
                  </thead>
                  <tbody className="text-brand-gray">
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">Mezcla rápida de líquidos miscibles, μ baja</td>
                      <td className="p-3 border border-zinc-200">Hélice marina o PBT 45°</td>
                    </tr>
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">Suspensión de sólidos finos</td>
                      <td className="p-3 border border-zinc-200">Hélice o PBT (axial)</td>
                    </tr>
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">Dispersión de gas (fermentación, oxigenación)</td>
                      <td className="p-3 border border-zinc-200">Turbina Rushton (o Smith curva)</td>
                    </tr>
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">Emulsiones (alto cizallamiento puntual)</td>
                      <td className="p-3 border border-zinc-200">Rushton + alta velocidad / molinos coloidales en línea</td>
                    </tr>
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">Fluidos viscosos (μ &gt; 1000 cP)</td>
                      <td className="p-3 border border-zinc-200">Cinta helicoidal o ancla</td>
                    </tr>
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">Transferencia de calor con paredes</td>
                      <td className="p-3 border border-zinc-200">Ancla o cinta helicoidal</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {isVisible('bafles') && (
            <>
              <SectionTitle id="bafles">Bafles (deflectores)</SectionTitle>
              <p>
                Los <strong>bafles</strong> son placas verticales montadas en las paredes internas del
                tanque. Su función es <strong>romper el remolino</strong> (movimiento de masa
                rotacional) que produce el impulsor en líquidos de baja a moderada viscosidad,
                convirtiendo la rotación en patrones axiales y radiales más efectivos.
              </p>

              <VortexComparison />

              <SubTitle>Beneficios</SubTitle>
              <ul>
                <li>Convierten el movimiento rotacional en flujo axial/radial efectivo.</li>
                <li>Aumentan la turbulencia.</li>
                <li>Evitan la incorporación no deseada de gas desde el espacio superior (vórtice profundo).</li>
                <li>Estandarizan el comportamiento (los $N_P$ tabulados asumen tanque con bafles).</li>
              </ul>

              <SubTitle>Diseño típico</SubTitle>
              <ul>
                <li>Cuatro bafles distribuidos a 90° alrededor del tanque.</li>
                <li>{String.raw`Ancho $W_b \approx D_t / 12$ (a veces hasta $D_t/10$).`}</li>
                <li>Separados ligeramente de la pared (pequeño <em>gap</em>) para evitar zonas muertas.</li>
                <li>Que cubran al menos la zona del impulsor en altura.</li>
              </ul>

              <WarningCallout title="Cuándo NO poner bafles">
                <ul className="list-disc pl-5 space-y-1">
                  <li>En líquidos muy viscosos: el fluido mismo resiste el remolino y los bafles son
                    innecesarios o crean zonas muertas.</li>
                  <li>Con agitadores excéntricos o angulares: el desbalance ya rompe el patrón
                    rotacional.</li>
                  <li>En tanques muy pequeños donde el bafle ocupa una fracción importante del
                    diámetro.</li>
                </ul>
              </WarningCallout>
            </>
          )}

          {isVisible('geometria') && (
            <>
              <SectionTitle id="geometria">Geometría estándar de un tanque agitado</SectionTitle>
              <p>
                Para que las correlaciones —y, sobre todo, los criterios de escalado— sean válidos, se
                trabaja con tanques que cumplen <strong>similitud geométrica</strong>. Las relaciones
                típicas (configuración estándar) son:
              </p>

              <TankGeometryDiagram />

              <div className="my-4 overflow-x-auto not-prose">
                <table className="min-w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-zinc-100 text-brand-dark">
                      <th className="text-left p-3 border border-zinc-200 font-semibold">Relación</th>
                      <th className="text-left p-3 border border-zinc-200 font-semibold">Valor estándar</th>
                      <th className="text-left p-3 border border-zinc-200 font-semibold">Comentario</th>
                    </tr>
                  </thead>
                  <tbody className="text-brand-gray">
                    <tr><td className="p-3 border border-zinc-200 font-mono text-brand-dark">D_a / D_t</td><td className="p-3 border border-zinc-200">1/3</td><td className="p-3 border border-zinc-200">Diámetro de impulsor un tercio del tanque.</td></tr>
                    <tr><td className="p-3 border border-zinc-200 font-mono text-brand-dark">H / D_t</td><td className="p-3 border border-zinc-200">1</td><td className="p-3 border border-zinc-200">Altura de líquido igual al diámetro.</td></tr>
                    <tr><td className="p-3 border border-zinc-200 font-mono text-brand-dark">E / D_t</td><td className="p-3 border border-zinc-200">1/3</td><td className="p-3 border border-zinc-200">Altura del impulsor sobre el fondo.</td></tr>
                    <tr><td className="p-3 border border-zinc-200 font-mono text-brand-dark">W_b / D_t</td><td className="p-3 border border-zinc-200">1/12</td><td className="p-3 border border-zinc-200">Ancho de bafle.</td></tr>
                    <tr><td className="p-3 border border-zinc-200 font-mono text-brand-dark">L / D_a</td><td className="p-3 border border-zinc-200">1/4</td><td className="p-3 border border-zinc-200">Longitud de pala (en turbinas con disco).</td></tr>
                    <tr><td className="p-3 border border-zinc-200 font-mono text-brand-dark">W / D_a</td><td className="p-3 border border-zinc-200">1/5</td><td className="p-3 border border-zinc-200">Ancho de pala.</td></tr>
                  </tbody>
                </table>
              </div>

              <p>
                Cuando un proceso requiere algo distinto (tanques alargados, impulsores múltiples,
                etc.) hay que tener especial cuidado al usar correlaciones tabuladas: la geometría
                deja de ser similar y los $N_P$ publicados pueden no aplicar.
              </p>
            </>
          )}

          {isVisible('potencia') && (
            <>
              <SectionTitle id="potencia">Potencia y números adimensionales</SectionTitle>
              <p>
                Estimar la potencia consumida por el agitador es fundamental para dimensionar el motor
                y evaluar el costo operativo. Se usan dos números adimensionales clave.
              </p>

              <SubTitle>Número de Reynolds de agitación</SubTitle>
              <p>Caracteriza el régimen de flujo en el tanque:</p>
              <p>{String.raw`$$\text{Re}_{ag} = \frac{D_a^2 \cdot N \cdot \rho}{\mu}$$`}</p>
              <ul>
                <li>{String.raw`$D_a$: diámetro del impulsor (m).`}</li>
                <li>{String.raw`$N$: velocidad de rotación (rev/s — atención a las unidades).`}</li>
                <li>{String.raw`$\rho$: densidad del fluido (kg/m³).`}</li>
                <li>{String.raw`$\mu$: viscosidad dinámica (Pa·s).`}</li>
              </ul>

              <InfoCallout title="Los regímenes en agitación NO son los de tubería">
                <ul className="list-disc pl-5 space-y-0.5">
                  <li>{String.raw`Laminar: $\text{Re}_{ag} \lesssim 10$.`}</li>
                  <li>{String.raw`Transicional: $10 \lesssim \text{Re}_{ag} \lesssim 10^4$.`}</li>
                  <li>{String.raw`Turbulento: $\text{Re}_{ag} \gtrsim 10^4$.`}</li>
                </ul>
                <p className="mt-2 text-zinc-300">Es la pista número uno para la mayoría de
                cálculos: marca dónde leer la curva $N_P$, si los bafles son útiles, y qué
                correlaciones aplican.</p>
              </InfoCallout>

              <SubTitle>Número de potencia</SubTitle>
              <p>Relaciona la potencia consumida con las propiedades del fluido y la geometría:</p>
              <p>{String.raw`$$N_P = \frac{P}{\rho \cdot N^3 \cdot D_a^5}$$`}</p>
              <ul>
                <li>{String.raw`$P$: potencia consumida por el agitador (W).`}</li>
                <li>{String.raw`$N_P$ depende de la geometría (tipo de impulsor, $D_a/D_t$, presencia de bafles…) y de $\text{Re}_{ag}$.`}</li>
              </ul>

              <p>{String.raw`Para un sistema geométricamente similar se obtienen `}<strong>curvas log-log</strong>{String.raw` de $N_P$ vs $\text{Re}_{ag}$ con dos comportamientos asintóticos:`}</p>
              <ul>
                <li>{String.raw`En **régimen laminar** ($\text{Re}_{ag} < 10$): $N_P \cdot \text{Re}_{ag} = K_l$ (constante), por lo que $N_P \propto 1/\text{Re}_{ag}$.`}</li>
                <li>{String.raw`En **régimen turbulento con bafles** ($\text{Re}_{ag} > 10^4$): $N_P$ tiende a un valor **constante** $K_t$ característico de cada impulsor.`}</li>
                <li>{String.raw`Entre ambos hay una zona transicional donde $N_P$ depende suavemente de $\text{Re}_{ag}$.`}</li>
              </ul>

              <NpReChart />

              <SubTitle>Cálculo de la potencia</SubTitle>
              <p>
                Conocido $N_P$ (de la curva o correlación), se despeja la potencia entregada al fluido:
              </p>
              <p>{String.raw`$$P = N_P \cdot \rho \cdot N^3 \cdot D_a^5$$`}</p>
              <p>
                {String.raw`La `}<strong>potencia del motor</strong>{String.raw` debe ser mayor que $P$ para cubrir las pérdidas mecánicas en transmisión y motor — típicamente se divide entre $\eta_{\text{motor}} \approx 0{,}85{-}0{,}95$ y se aplica un factor de servicio de 1,15–1,25.`}
              </p>

              <AgitationPowerCalculator />

              <TipCallout title="Ejemplo numérico rápido">
                {String.raw`Tanque con turbina Rushton ($N_P \approx 5{,}5$) en régimen turbulento, $D_a = 0{,}5$ m, $N = 120$ rpm $= 2$ rev/s, $\rho = 1000$ kg/m³:`}
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>{String.raw`$P = 5{,}5 \cdot 1000 \cdot 2^3 \cdot 0{,}5^5 = 5{,}5 \cdot 1000 \cdot 8 \cdot 0{,}03125 \approx 1375$ W.`}</li>
                  <li>{String.raw`Con $\eta_{\text{motor}} = 0{,}9$: $P_{\text{motor}} \approx 1{,}53$ kW.`}</li>
                  <li>{String.raw`Aplicando $f_s = 1{,}2$: motor comercial de $\approx 2{,}2$ kW (3 HP).`}</li>
                </ul>
              </TipCallout>
            </>
          )}

          {isVisible('escalado') && (
            <>
              <SectionTitle id="escalado">Escalado de sistemas de agitación</SectionTitle>
              <p>
                El <strong>escalado</strong> (scale-up) es el proceso de diseñar un equipo a gran
                escala (industrial) basándose en los resultados obtenidos en un equipo más pequeño
                (laboratorio o planta piloto). Es uno de los desafíos más importantes en ingeniería
                de procesos: <strong>no todos los parámetros se pueden mantener constantes
                simultáneamente</strong> al cambiar de tamaño. La elección del criterio depende del
                mecanismo o fenómeno que controla el proceso de agitación deseado.
              </p>

              <SubTitle>Similitud geométrica</SubTitle>
              <p>
                Para que las correlaciones y criterios sean válidos se busca mantener la
                <strong> similitud geométrica</strong> entre el modelo (subíndice 1, escala pequeña) y
                el prototipo (subíndice 2, escala grande): se conservan las relaciones
                {String.raw` $D_a/D_t$, $H/D_t$, $E/D_t$, $W_b/D_t$,`} etc. Si esto se cumple, el
                cambio de escala se reduce a un único factor {String.raw`$R = D_2 / D_1 = (V_2 / V_1)^{1/3}$`}.
              </p>

              <SubTitle>Criterios comunes</SubTitle>
              <p>Cada criterio fija una variable y deja que las demás se ajusten. La elección importa
                porque cambia drásticamente la potencia, la cizalladura y el tiempo de mezclado en la
                escala industrial.</p>

              <div className="my-4 overflow-x-auto not-prose">
                <table className="min-w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-zinc-100 text-brand-dark">
                      <th className="text-left p-3 border border-zinc-200 font-semibold">Criterio</th>
                      <th className="text-left p-3 border border-zinc-200 font-semibold">N₂/N₁ (geometría similar)</th>
                      <th className="text-left p-3 border border-zinc-200 font-semibold">Cuándo usarlo</th>
                    </tr>
                  </thead>
                  <tbody className="text-brand-gray">
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">P/V constante</td>
                      <td className="p-3 border border-zinc-200 font-mono">R^(−2/3)</td>
                      <td className="p-3 border border-zinc-200">Dispersiones gas-líquido, fermentaciones (transferencia de O₂), suspensión de finos.</td>
                    </tr>
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">V_tip constante</td>
                      <td className="p-3 border border-zinc-200 font-mono">R^(−1)</td>
                      <td className="p-3 border border-zinc-200">Procesos sensibles a cizalladura: emulsiones, cultivos celulares, dispersiones líquido-líquido.</td>
                    </tr>
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">Re_ag constante</td>
                      <td className="p-3 border border-zinc-200 font-mono">R^(−2)</td>
                      <td className="p-3 border border-zinc-200">Procesos limitados por macromezcla o circulación general; transferencia de calor dependiente de Re.</td>
                    </tr>
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">t_mix constante (≈ N constante)</td>
                      <td className="p-3 border border-zinc-200 font-mono">≈ 1</td>
                      <td className="p-3 border border-zinc-200">Procesos donde la rapidez de homogeneización es crítica; reacciones rápidas.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                El selector siguiente permite explorar las consecuencias numéricas — cómo cambian
                {String.raw`$N$, $P$, $P/V$, $V_{tip}$ y $\text{Re}_{ag}$ al pasar de la escala 1 a la escala 2`}
                según el criterio elegido:
              </p>

              <ScaleupCalculator />

              <SubTitle>Estrategia general</SubTitle>
              <ol>
                <li><strong>Identificar el mecanismo controlante:</strong> ¿qué fenómeno físico
                  (transferencia de masa, cizalladura, suspensión, homogeneización rápida,
                  transferencia de calor) es crítico para el éxito del proceso?</li>
                <li><strong>Seleccionar el criterio de escalado</strong> según ese mecanismo.</li>
                <li><strong>Mantener similitud geométrica</strong> tanto como se pueda.</li>
                <li><strong>Calcular los parámetros del prototipo</strong> con el criterio seleccionado.</li>
                <li><strong>Verificar otros parámetros:</strong> ¿la cizalladura sigue aceptable?
                  ¿la potencia es razonable? Casi siempre hay que llegar a un compromiso.</li>
                <li><strong>Considerar limitaciones prácticas:</strong> motores comerciales,
                  velocidades estándar, restricciones mecánicas, espacio, costos.</li>
              </ol>

              <WarningCallout title="El escalado no es una ciencia exacta">
                Para procesos críticos siempre se valida en una <strong>planta piloto a escala
                intermedia</strong> antes de pasar a escala industrial. Quien escala en un solo paso
                desde matraz a 10 000 L suele descubrir tarde —y caro— que el criterio elegido no
                era el correcto.
              </WarningCallout>
            </>
          )}

          {isVisible('bibliografia') && (
            <>
              <SectionTitle id="bibliografia">Bibliografía recomendada</SectionTitle>
              <ul className="text-sm text-brand-gray leading-relaxed">
                <li>
                  McCabe, W. L., Smith, J. C., &amp; Harriott, P. (2005).
                  <em> Unit Operations of Chemical Engineering</em> (7th ed.). McGraw-Hill.
                  (Capítulo 9: Agitation and Mixing of Liquids).
                </li>
                <li>
                  Perry, R. H., &amp; Green, D. W. (Eds.). (2019).
                  <em> Perry's Chemical Engineers' Handbook</em> (9th ed.). McGraw-Hill.
                  (Sección 21: Liquid-Solid Operations and Equipment — Agitation and Mixing of Liquids).
                </li>
                <li>
                  Geankoplis, C. J. (2003).
                  <em> Transport Processes and Separation Process Principles</em> (4th ed.). Prentice Hall.
                  (Capítulo 3, secciones de agitación).
                </li>
                <li>
                  Paul, E. L., Atiemo-Obeng, V. A., &amp; Kresta, S. M. (Eds.). (2004).
                  <em> Handbook of Industrial Mixing: Science and Practice</em>. Wiley-Interscience.
                  <span className="italic"> — Referencia muy completa y avanzada sobre mezclado industrial,
                  con capítulos detallados sobre escalado.</span>
                </li>
                <li>
                  Tatterson, G. B. (1991). <em>Fluid Mixing and Gas Dispersion in Agitated Tanks</em>.
                  McGraw-Hill.
                </li>
              </ul>
              <p className="text-sm text-brand-gray italic mt-6">
                Notas complementarias al Episodio 5 de <em>Gradiente de Ideas</em> con la Ing. Sofía
                Vargas (Belcorp). ¡Que la agitación les sea propicia!
              </p>
            </>
          )}
        </div>
      </div>
    </ReadingLayout>
  );
};

export default Agitacion;
