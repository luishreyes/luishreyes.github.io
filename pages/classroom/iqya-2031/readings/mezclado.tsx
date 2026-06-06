import React, { useEffect, useState } from 'react';
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
const IconGrad = () => (
  <Icon><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5" /></Icon>
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
const ProjectCallout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="my-6 rounded-xl bg-brand-dark p-5 sm:p-6 not-prose">
    <p className="font-semibold text-brand-yellow text-sm mb-2 flex items-center gap-2">
      <span className="text-base"><IconGrad /></span>Aplicación al proyecto del curso
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

const VideoEmbed: React.FC<{ id: string; title: string; caption?: string }> = ({ id, title, caption }) => (
  <div className="my-8 not-prose">
    <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3 max-w-2xl mx-auto">
      <div className="aspect-video">
        <iframe
          className="w-full h-full rounded-md"
          src={`https://www.youtube.com/embed/${id}?rel=0`}
          title={title}
          frameBorder={0}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {caption && <p className="text-xs text-brand-gray italic mt-2 text-center">{caption}</p>}
    </div>
  </div>
);

/* ─── Datos de equipos de sólidos ─── */
type SolidsEquipment = {
  id: string;
  family: 'volteo' | 'convectivo' | 'alta-cizalla';
  name: string;
  image: string;
  mechanism: string;
  advantages: string[];
  disadvantages: string[];
  uses: string;
  video?: { id: string; title: string };
};

const solidsEquipment: SolidsEquipment[] = [
  {
    id: 'doble-cono', family: 'volteo', name: 'Doble cono',
    image: '/classroom/iqya-2031/readings/mezclado-doble-cono.gif',
    mechanism: 'El recipiente cerrado rota sobre un eje horizontal; el material cae en cascada, se divide y recombina, promoviendo mezclado convectivo y difusivo.',
    advantages: [
      'Mezclado suave (bajo cizallamiento).',
      'Bueno para polvos de flujo libre y componentes frágiles.',
      'Fácil de limpiar, buena contención (importante para APIs potentes).',
      'Descarga completa por gravedad.',
    ],
    disadvantages: [
      'Menos efectivo para polvos cohesivos o con tendencia a aglomerarse.',
      'Puede generar segregación si los componentes tienen propiedades muy dispares y el tiempo de mezclado es excesivo.',
    ],
    uses: 'Preparación de mezclas de polvos farmacéuticos de flujo libre, mezcla de excipientes previo a la compresión.',
    video: { id: 'C1dTSgNuaeI', title: 'Mezcladora de sólidos de doble cono — INOXPA MBC' },
  },
  {
    id: 'v-blender', family: 'volteo', name: 'V-Blender',
    image: '/classroom/iqya-2031/readings/mezclado-v-blender.gif',
    mechanism: 'Dos tubos cilíndricos en forma de V giran sobre su eje. El material se divide en dos lotes en cada revolución y luego se recombina, creando una acción de dividir-y-recombinar muy eficiente.',
    advantages: [
      'División y recombinación eficiente en cada revolución.',
      'Menor tendencia a la segregación que el doble cono.',
      'Fácil de agregar un intensificador interno (barra con cuchillas).',
    ],
    disadvantages: [
      'Más voluminoso que un doble cono a igual capacidad.',
      'Limpieza algo más compleja por la geometría en V.',
    ],
    uses: 'Mezcla de polvos farmacéuticos, alimentos en polvo, productos químicos finos.',
    video: { id: 'tU4vILQkQag', title: 'Twin Shell Blender, V blender' },
  },
  {
    id: 'ribbon', family: 'convectivo', name: 'Mezclador de cinta (Ribbon Blender)',
    image: '/classroom/iqya-2031/readings/mezclado-ribbon-blender.gif',
    mechanism: 'Cintas helicoidales dobles (interior y exterior) giran en direcciones opuestas: la exterior mueve el material hacia el centro y la interior hacia los extremos, generando un fuerte mezclado axial y radial.',
    advantages: [
      'Más efectivo para polvos cohesivos que los de volteo.',
      'Puede incorporar pequeñas cantidades de líquidos (granulación).',
      'Buena acción de mezclado axial y radial.',
      'Alta capacidad (hasta 20 000 L).',
    ],
    disadvantages: [
      'Puede tener zonas muertas cerca de los extremos.',
      'Más difícil de limpiar que los mezcladores de volteo.',
      'Genera más cizalladura (no ideal para todos los productos).',
    ],
    uses: 'Mezcla de polvos cohesivos, premezclas con aditivos líquidos, industria alimentaria y de fertilizantes.',
    video: { id: '4GSh7gmiQao', title: 'Ribbon Blender Flowtec — Mezcladores de cinta helicoidal' },
  },
  {
    id: 'paddle', family: 'convectivo', name: 'Mezclador de paletas (Paddle Mixer)',
    image: '/classroom/iqya-2031/readings/mezclado-paddle-mixer.gif',
    mechanism: 'Paletas montadas en uno o dos ejes horizontales levantan y hacen caer el material, creando una acción de fluidización mecánica que combina mezclado convectivo y difusivo.',
    advantages: [
      'Acción de mezclado suave pero eficiente.',
      'Versátil: sirve para polvos, pastas y materiales frágiles.',
      'Doble eje reduce puntos muertos.',
    ],
    disadvantages: [
      'Menor cizalladura que los de alta velocidad.',
      'Velocidad de mezcla más lenta que los de cinta.',
    ],
    uses: 'Industria cerámica, alimentaria, química; mezcla de polvos con fibras o materiales frágiles.',
    video: { id: 'qh7TOi0YBGU', title: 'Dry Powder Mixer — Double Shaft Paddle Mixer' },
  },
  {
    id: 'tornillo-conico', family: 'convectivo', name: 'Tornillo cónico (Nauta Mixer)',
    image: '/classroom/iqya-2031/readings/mezclado-tornillo-conico.gif',
    mechanism: 'Un tornillo vertical orbita alrededor del interior de un cono. El tornillo eleva el material desde el fondo; la gravedad lo devuelve por las paredes del cono. El movimiento orbital garantiza que todo el volumen participe.',
    advantages: [
      'Excelente para mezclar polvos con grandes diferencias de densidad o tamaño.',
      'Mezclado suave: bajo cizallamiento y baja generación de calor.',
      'Descarga total por la válvula inferior del cono.',
    ],
    disadvantages: [
      'Tiempos de mezclado más largos que otros tipos.',
      'Geometría compleja para limpieza (validación en farma).',
    ],
    uses: 'Industria farmacéutica (mezcla de APIs de bajo dosaje), pigmentos, químicos especiales.',
    video: { id: 'mqbM6URncbY', title: 'PerMix PNA 4000 — Mezclador industrial de tornillo cónico' },
  },
  {
    id: 'alta-cizalla', family: 'alta-cizalla', name: 'Granulador de alta cizalladura',
    image: '/classroom/iqya-2031/readings/mezclado-granulador.gif',
    mechanism: 'Un impulsor principal de alta velocidad fluidiza el polvo y crea un vórtice, mientras que un chopper secundario rompe los aglomerados e intensifica la densificación. Usado principalmente para granulación húmeda, pero también para mezclado en seco de polvos cohesivos.',
    advantages: [
      'Tiempos de mezclado muy cortos (2–5 min).',
      'Excelente deaglomeración.',
      'Puede producir mezclas densas, ideales para compresión directa.',
    ],
    disadvantages: [
      'Alto consumo de energía.',
      'Puede sobrecalentar el producto (degrada APIs termosensibles).',
      'Equipo más complejo, difícil de escalar.',
    ],
    uses: 'Granulación húmeda farmacéutica, mezclado de polvos cohesivos con APIs de baja dosis.',
  },
];

/* ─── Stepper de equipos de sólidos ─── */
const SolidsEquipmentStepper: React.FC = () => {
  const [active, setActive] = useState(0);
  const eq = solidsEquipment[active];

  const familyLabel: Record<SolidsEquipment['family'], string> = {
    volteo: 'Volteo (tumble)',
    convectivo: 'Convectivo (con elementos internos)',
    'alta-cizalla': 'Alta cizalladura',
  };

  return (
    <div className="my-8 not-prose">
      <div className="flex flex-wrap gap-2 mb-4" role="tablist">
        {solidsEquipment.map((t, k) => (
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
            {t.name.split('(')[0].trim().split(' ').slice(0, 2).join(' ')}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-4 flex items-center justify-center min-h-[280px]">
          <img
            src={eq.image}
            alt={`Equipo: ${eq.name}`}
            className="block max-w-full h-auto"
            style={{ maxHeight: 320 }}
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-brand-yellow-dark mb-1">
            {familyLabel[eq.family]}
          </p>
          <h4 className="text-xl font-bold text-brand-dark mb-3">{eq.name}</h4>
          <p className="text-sm text-brand-gray leading-relaxed mb-4">{eq.mechanism}</p>

          <div className="mb-4">
            <p className="text-sm font-semibold text-brand-dark mb-1">Ventajas</p>
            <ul className="list-disc pl-5 text-sm text-brand-gray space-y-0.5">
              {eq.advantages.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
          <div className="mb-4">
            <p className="text-sm font-semibold text-brand-dark mb-1">Desventajas</p>
            <ul className="list-disc pl-5 text-sm text-brand-gray space-y-0.5">
              {eq.disadvantages.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </div>
          <p className="text-sm">
            <span className="font-semibold text-brand-dark">Aplicaciones: </span>
            <span className="text-brand-gray">{eq.uses}</span>
          </p>
        </div>
      </div>
      {eq.video && (
        <div className="mt-4">
          <VideoEmbed id={eq.video.id} title={eq.video.title} caption={`${eq.name} en operación.`} />
        </div>
      )}
    </div>
  );
};

/* ─── Calculadora de escalado de mezclado ─── */
const ScaleUpCalculator: React.FC = () => {
  const [criterion, setCriterion] = useState<'pv' | 'vtip' | 'nrev' | 'froude'>('pv');
  const [D1, setD1] = useState(0.3);
  const [N1, setN1] = useState(60);
  const [D2, setD2] = useState(1.2);

  const R = D2 / D1;
  let N2 = N1;
  let label = '';
  let formula = '';

  switch (criterion) {
    case 'pv':
      N2 = N1 * Math.pow(1 / R, 2 / 3);
      label = 'Potencia por unidad de volumen constante (P/V)';
      formula = String.raw`$N_2 = N_1 \cdot \left(\frac{D_1}{D_2}\right)^{2/3}$`;
      break;
    case 'vtip':
      N2 = N1 * (D1 / D2);
      label = 'Velocidad de punta constante (v_tip)';
      formula = String.raw`$N_2 = N_1 \cdot \frac{D_1}{D_2}$`;
      break;
    case 'nrev':
      N2 = N1;
      label = 'Mismo número de revoluciones totales (N·t = cte)';
      formula = String.raw`$N_2 = N_1$ (se ajusta el tiempo, no la velocidad)`;
      break;
    case 'froude':
      N2 = N1 * Math.pow(D1 / D2, 0.5);
      label = 'Número de Froude constante (Fr)';
      formula = String.raw`$N_2 = N_1 \cdot \sqrt{\frac{D_1}{D_2}}$`;
      break;
  }

  const vtip1 = Math.PI * (N1 / 60) * D1;
  const vtip2 = Math.PI * (N2 / 60) * D2;
  const PVratio = Math.pow(N2 / N1, 3) * Math.pow(D2 / D1, 2);

  return (
    <div className="my-8 not-prose rounded-xl bg-white border border-zinc-200 shadow-sm p-5 sm:p-6">
      <h4 className="text-base font-semibold text-brand-dark mb-4">Calculadora de escalado de mezclado</h4>

      <div className="flex flex-wrap gap-2 mb-5" role="tablist">
        {([
          ['pv', 'P/V cte'],
          ['vtip', 'v_tip cte'],
          ['nrev', 'N·t cte'],
          ['froude', 'Fr cte'],
        ] as const).map(([key, lbl]) => (
          <button
            key={key}
            role="tab"
            aria-selected={criterion === key}
            onClick={() => setCriterion(key)}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              criterion === key
                ? 'bg-brand-dark text-white border-brand-dark'
                : 'bg-white text-brand-gray border-zinc-300 hover:border-brand-dark hover:text-brand-dark'
            }`}
          >
            {lbl}
          </button>
        ))}
      </div>

      <p className="text-sm text-brand-gray mb-1">{label}</p>
      <p className="text-sm text-brand-gray mb-4">{formula}</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-5">
        <div>
          <label className="block text-xs text-brand-gray mb-1">Diámetro pequeña escala (m)</label>
          <input type="number" step="0.01" min="0.05" value={D1} onChange={(e) => setD1(parseFloat(e.target.value) || 0.1)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono" />
        </div>
        <div>
          <label className="block text-xs text-brand-gray mb-1">Velocidad pequeña escala (rpm)</label>
          <input type="number" step="1" min="1" value={N1} onChange={(e) => setN1(parseFloat(e.target.value) || 1)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono" />
        </div>
        <div>
          <label className="block text-xs text-brand-gray mb-1">Diámetro gran escala (m)</label>
          <input type="number" step="0.01" min="0.05" value={D2} onChange={(e) => setD2(parseFloat(e.target.value) || 0.1)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono" />
        </div>
      </div>

      <div className="rounded-lg bg-yellow-50 border border-brand-yellow p-4">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-yellow-dark mb-2">Resultado</p>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-brand-gray">Razón de escala: </span>
            <span className="font-mono font-semibold text-brand-dark">{R.toFixed(2)}×</span>
          </div>
          <div>
            <span className="text-brand-gray">N₂ (gran escala): </span>
            <span className="font-mono font-semibold text-brand-dark">{N2.toFixed(1)} rpm</span>
          </div>
          <div>
            <span className="text-brand-gray">v_tip pequeña: </span>
            <span className="font-mono font-semibold text-brand-dark">{vtip1.toFixed(2)} m/s</span>
          </div>
          <div>
            <span className="text-brand-gray">v_tip grande: </span>
            <span className="font-mono font-semibold text-brand-dark">{vtip2.toFixed(2)} m/s</span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-brand-gray">(P/V)₂ / (P/V)₁: </span>
            <span className="font-mono font-semibold text-brand-dark">{PVratio.toFixed(3)}</span>
            {criterion === 'pv' && <span className="text-xs text-emerald-600 ml-2 font-semibold">= 1.000 (constante)</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── TOC ─── */
const tocItems = [
  { id: 'objetivo', label: 'El objetivo del mezclado' },
  { id: 'mecanismos', label: 'Mecanismos fundamentales' },
  { id: 'equipos-solidos', label: 'Equipos para sólidos' },
  { id: 'equipos-liquidos', label: 'Equipos para líquidos' },
  { id: 'escalado', label: 'Escalado del mezclado' },
  { id: 'pat', label: 'Tecnología PAT' },
  { id: 'errores', label: 'Errores comunes' },
  { id: 'bibliografia', label: 'Bibliografía' },
];

/* ─── Componente principal ─── */
const MezcladoReading: React.FC = () => {
  const course = getCourseBySlug('iqya-2031');
  if (!course) return null;
  const reading = course.readings.find((r) => r.slug === 'lectura-07-mezclado');
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
      {/* ── Mobile TOC ── */}
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

      {/* ── Desktop TOC + contenido ── */}
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

        {/* ── Contenido principal ── */}
        <div className="reading-prose">
          {activeSection === null && (
            <>
              <p className="text-lg leading-relaxed text-brand-gray">
                El <strong>mezclado</strong> es una de las operaciones unitarias más frecuentes en la industria
                de procesos. Mientras que la <em>agitación</em> (tema de la lectura anterior) se enfoca en inducir
                movimiento dentro del fluido, el mezclado se enfoca en el <strong>resultado</strong>: lograr una
                distribución uniforme de dos o más componentes inicialmente separados, hasta alcanzar el grado
                de homogeneidad que el producto demanda.
              </p>

              <Figure
                src="/classroom/iqya-2031/readings/mezclado-difusion-fluorescencia.gif"
                alt="Fluorescencia verde difundiéndose en un matraz Erlenmeyer bajo luz UV, mostrando el proceso de mezclado difusivo"
                caption="Difusión de fluoresceína bajo luz UV: el proceso de mezclado a escala molecular es hermoso, pero lento sin intervención mecánica."
                maxWidth="480px"
              />

              <ProjectCallout>
                <p>Si el proyecto de tu equipo involucra una etapa de mezclado (y en la planta de pectina muy probablemente la hay):</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Definir claramente el <strong>objetivo</strong> de la operación de mezclado (homogeneización, disolución, dispersión, suspensión).</li>
                  <li>Seleccionar un tipo de equipo apropiado, justificando la elección según las fases involucradas y las propiedades de los materiales.</li>
                  <li>Estimar los parámetros operativos clave (tiempo de mezclado, velocidad de rotación).</li>
                  <li>Si consideran escalar desde el laboratorio, identificar el mecanismo crítico de mezclado y proponer un criterio de escalado
                    (p. ej., {String.raw`$P/V$`} constante, {String.raw`$v_{\text{tip}}$`} constante, {String.raw`$t_m$`} constante) justificando su elección.</li>
                </ul>
              </ProjectCallout>
            </>
          )}

          {/* ═══════ SECCIÓN 1: Objetivo del mezclado ═══════ */}
          {isVisible('objetivo') && (
            <>
              <SectionTitle id="objetivo">El objetivo del mezclado y su criticidad industrial</SectionTitle>
              <p>
                El mezclado busca lograr una distribución uniforme de componentes en un sistema. Pero «uniforme»
                depende del contexto: puede significar que cada miligramo de una tableta farmacéutica contenga exactamente
                la misma proporción de ingrediente activo, o que la viscosidad de una emulsión sea consistente en cada lote de 5 000 L.
              </p>

              <SubTitle>¿Por qué es tan crítico?</SubTitle>
              <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
                <div className="rounded-xl border border-zinc-200 p-5 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">Uniformidad de contenido</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Cada dosis unitaria (tableta, cápsula, volumen de suspensión) debe contener la cantidad correcta del
                    Ingrediente Farmacéutico Activo (API). Desviaciones generan problemas de eficacia o seguridad.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">Propiedades del producto</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    El mezclado afecta la biodisponibilidad, la tasa de disolución, la compresibilidad de polvos
                    para tabletas y la textura de semisólidos.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">Estabilidad del producto</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    En emulsiones o suspensiones, un mezclado adecuado es vital para lograr la dispersión correcta
                    y prevenir la separación de fases durante la vida útil del producto.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">Cumplimiento regulatorio (cGMP)</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Los procesos de mezclado deben ser validados para demostrar que producen consistentemente
                    un producto homogéneo. La FDA y el INVIMA lo exigen.
                  </p>
                </div>
              </div>

              <TipCallout title="Agitación ≠ Mezclado">
                <p>
                  La <strong>agitación</strong> es el medio (inducir movimiento); el <strong>mezclado</strong> es
                  el fin (lograr homogeneidad). Un sistema puede estar muy agitado y aun así mal mezclado si los
                  patrones de flujo no promueven la distribución uniforme de los componentes.
                </p>
              </TipCallout>
            </>
          )}

          {/* ═══════ SECCIÓN 2: Mecanismos ═══════ */}
          {isVisible('mecanismos') && (
            <>
              <SectionTitle id="mecanismos">Mecanismos fundamentales del mezclado</SectionTitle>
              <p>
                Independientemente del tipo de materiales (polvos, líquidos, pastas), el mezclado ocurre a través
                de una combinación de tres mecanismos a diferentes escalas. Entender cuál predomina en tu sistema
                es la clave para seleccionar el equipo correcto y para diseñar el escalado.
              </p>

              <SubTitle>1. Mezclado convectivo (macro-mezclado)</SubTitle>
              <p>
                Implica el movimiento de <strong>grandes grupos</strong> de partículas o porciones de fluido de una
                localización a otra dentro del mezclador. Es el mecanismo de «gran escala» y el que actúa más rápidamente.
              </p>
              <ul>
                <li>La acción de las cintas en un mezclador de cinta que transportan material de un extremo a otro.</li>
                <li>La circulación generada por un impulsor en un tanque agitado.</li>
                <li>El movimiento de cascada en un V-blender.</li>
              </ul>
              <p>
                <strong>Efecto:</strong> Reduce rápidamente las diferencias de concentración a gran escala,
                pero no garantiza la homogeneidad a nivel de partícula individual.
              </p>

              <SubTitle>2. Mezclado por cizalladura (shear mixing)</SubTitle>
              <p>
                Ocurre cuando se generan <strong>gradientes de velocidad</strong> dentro del material, haciendo que
                capas adyacentes se deslicen unas sobre otras. La cizalla reduce el tamaño de aglomerados (en polvos)
                o de gotas (en emulsiones) y redistribuye los componentes.
              </p>
              <ul>
                <li>La zona de alta velocidad cerca de las palas de un impulsor.</li>
                <li>La acción del <em>chopper</em> en un mezclador-granulador de alta cizalla.</li>
                <li>El flujo a través de regiones de constricción (rotor-estator, válvula de homogeneizador).</li>
              </ul>
              <p>
                <strong>Efecto:</strong> Importante para la deaglomeración, la dispersión y la reducción de la
                «escala de segregación» (el tamaño de las regiones no mezcladas).
              </p>

              <SubTitle>3. Mezclado difusivo (micro-mezclado)</SubTitle>
              <p>
                Opera a la escala más pequeña, eliminando las diferencias de concentración entre partículas
                o moléculas adyacentes.
              </p>
              <ul>
                <li><strong>En líquidos:</strong> difusión molecular impulsada por gradientes de concentración.</li>
                <li><strong>En polvos:</strong> movimiento aleatorio de partículas individuales que cambian de posición
                  relativa por turbulencia, percolación o vibración.</li>
              </ul>

              <Figure
                src="/classroom/iqya-2031/readings/mezclado-difusion-fluorescencia.gif"
                alt="Visualización de mezclado difusivo: fluoresceína difundiéndose en un matraz"
                caption="Difusión molecular visualizada con fluoresceína. El micro-mezclado es el mecanismo más lento, especialmente en sólidos."
                maxWidth="420px"
              />

              <p>
                <strong>Efecto:</strong> Esencial para alcanzar la homogeneidad a nivel microscópico. Es el mecanismo
                más lento, especialmente en sólidos.
              </p>

              <InfoCallout title="Los tres trabajan juntos">
                <p>La efectividad de cualquier proceso de mezclado depende de la contribución relativa de estos tres mecanismos,
                  que a su vez depende del tipo de mezclador, las propiedades del material y las condiciones de operación.
                  Un buen diseño maximiza los tres en la proporción adecuada.</p>
              </InfoCallout>

              <div className="my-6 overflow-x-auto not-prose">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-zinc-100 text-brand-dark">
                      <th className="text-left p-3 border border-zinc-200 font-semibold">Mecanismo</th>
                      <th className="text-left p-3 border border-zinc-200 font-semibold">Escala</th>
                      <th className="text-left p-3 border border-zinc-200 font-semibold">Velocidad</th>
                      <th className="text-left p-3 border border-zinc-200 font-semibold">Ejemplo</th>
                    </tr>
                  </thead>
                  <tbody className="text-brand-gray">
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">Convectivo</td>
                      <td className="p-3 border border-zinc-200">Macro (cm – m)</td>
                      <td className="p-3 border border-zinc-200">Rápido</td>
                      <td className="p-3 border border-zinc-200">Cascada en V-blender, cinta helicoidal</td>
                    </tr>
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">Cizalladura</td>
                      <td className="p-3 border border-zinc-200">Meso (μm – cm)</td>
                      <td className="p-3 border border-zinc-200">Medio</td>
                      <td className="p-3 border border-zinc-200">Chopper, rotor-estator</td>
                    </tr>
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">Difusivo</td>
                      <td className="p-3 border border-zinc-200">Micro (nm – μm)</td>
                      <td className="p-3 border border-zinc-200">Lento</td>
                      <td className="p-3 border border-zinc-200">Difusión molecular, percolación de partículas</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ═══════ SECCIÓN 3: Equipos de sólidos ═══════ */}
          {isVisible('equipos-solidos') && (
            <>
              <SectionTitle id="equipos-solidos">Equipos de mezclado para sólidos (polvos)</SectionTitle>
              <p>
                La selección del equipo es crucial y depende de las propiedades de los polvos
                (flujo libre vs. cohesivo, fragilidad, tamaño de partícula) y del objetivo
                (homogeneización simple, granulación, etc.). Se organizan en tres familias principales.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 my-6 not-prose">
                <div className="rounded-xl border-l-4 border-brand-yellow bg-yellow-50/50 p-4">
                  <h4 className="font-semibold text-brand-dark text-sm mb-1">Volteo (tumble)</h4>
                  <p className="text-xs text-brand-gray">El recipiente gira; el material cae en cascada. Bajo cizallamiento.</p>
                </div>
                <div className="rounded-xl border-l-4 border-emerald-500 bg-emerald-50/50 p-4">
                  <h4 className="font-semibold text-brand-dark text-sm mb-1">Convectivos</h4>
                  <p className="text-xs text-brand-gray">Elementos internos (cintas, paletas, tornillo) se mueven a través del polvo.</p>
                </div>
                <div className="rounded-xl border-l-4 border-red-500 bg-red-50/50 p-4">
                  <h4 className="font-semibold text-brand-dark text-sm mb-1">Alta cizalladura</h4>
                  <p className="text-xs text-brand-gray">Impulsor + chopper a alta velocidad. Mezclado y granulación rápidos.</p>
                </div>
              </div>

              <p>
                Explora cada tipo de equipo con el visor interactivo:
              </p>

              <SolidsEquipmentStepper />

              <WarningCallout title="Segregación: el enemigo del mezclado de sólidos">
                <p>En polvos, a diferencia de líquidos, el mezclado compite con la <strong>segregación</strong>: la tendencia
                  de partículas con propiedades distintas (tamaño, densidad, forma) a separarse. Un mezclado excesivo puede
                  empeorar la homogeneidad si el mecanismo dominante es la percolación de finos. La curva de mezclado
                  (uniformidad vs. tiempo) tiene un <strong>mínimo</strong> que hay que encontrar experimentalmente.</p>
              </WarningCallout>
            </>
          )}

          {/* ═══════ SECCIÓN 4: Equipos de líquidos ═══════ */}
          {isVisible('equipos-liquidos') && (
            <>
              <SectionTitle id="equipos-liquidos">Equipos de mezclado para líquidos y semisólidos</SectionTitle>
              <p>
                Para soluciones, suspensiones, emulsiones, geles, cremas y ungüentos. La selección depende
                de la viscosidad, la relación de fases y el objetivo (disolución, dispersión, emulsificación).
              </p>

              <SubTitle>Tanques agitados</SubTitle>
              <p>
                Como se estudió en la lectura de agitación, un impulsor rota dentro de un tanque generando
                patrones de flujo que promueven el mezclado. La selección del impulsor depende de la aplicación:
              </p>
              <div className="my-4 overflow-x-auto not-prose">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-zinc-100 text-brand-dark">
                      <th className="text-left p-3 border border-zinc-200 font-semibold">Impulsor</th>
                      <th className="text-left p-3 border border-zinc-200 font-semibold">Aplicación de mezclado</th>
                      <th className="text-left p-3 border border-zinc-200 font-semibold">Viscosidad</th>
                    </tr>
                  </thead>
                  <tbody className="text-brand-gray">
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">Hélice / PBT (axial)</td>
                      <td className="p-3 border border-zinc-200">Mezclado de líquidos miscibles, disolución, suspensión diluida</td>
                      <td className="p-3 border border-zinc-200">Baja a media</td>
                    </tr>
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">Turbina Rushton (radial)</td>
                      <td className="p-3 border border-zinc-200">Dispersión gas-líquido, transferencia de masa</td>
                      <td className="p-3 border border-zinc-200">Baja a media</td>
                    </tr>
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">Ancla / Cinta helicoidal</td>
                      <td className="p-3 border border-zinc-200">Cremas, ungüentos, polímeros</td>
                      <td className="p-3 border border-zinc-200">Alta (&gt; 5 000 cP)</td>
                    </tr>
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">Rotor-estator (alta cizalla)</td>
                      <td className="p-3 border border-zinc-200">Emulsiones finas, dispersión de polvos hidrofóbicos</td>
                      <td className="p-3 border border-zinc-200">Baja a media</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <SubTitle>Dispersores de alta cizalladura (rotor-estator)</SubTitle>
              <p>
                El rotor gira a alta velocidad dentro de un estator estacionario con ranuras o perforaciones,
                generando una intensa cizalladura mecánica. Son indispensables para la creación de emulsiones
                finas y la dispersión de polvos difíciles de humectar.
              </p>
              <VideoEmbed
                id="cep81yJlgDk"
                title="How Industrial Batch Mixers Work — Silverson High Shear"
                caption="Funcionamiento de un mezclador rotor-estator tipo Silverson: la cizalladura intensa en el gap genera emulsiones finas."
              />

              <SubTitle>Mezcladores estáticos (en línea)</SubTitle>
              <p>
                Elementos fijos dentro de una tubería dividen y recombinan repetidamente las corrientes de fluido,
                logrando el mezclado <strong>sin partes móviles</strong>. Son ideales para procesos continuos.
              </p>
              <ul>
                <li><strong>Ventajas:</strong> bajo mantenimiento, no necesitan motor, compactos, buena eficiencia para líquidos de viscosidad similar.</li>
                <li><strong>Aplicaciones:</strong> ajuste de pH en línea, diluciones, mezclado de corrientes antes de un reactor.</li>
              </ul>
              <VideoEmbed
                id="4H2Vk7_cCCc"
                title="Static Mixer — Funcionamiento"
                caption="Mezclador estático: los elementos fijos dividen y recombinan el fluido repetidamente sin partes móviles."
              />

              <SubTitle>Homogeneizadores de alta presión</SubTitle>
              <p>
                Fuerzan el fluido a pasar a alta velocidad a través de una válvula o abertura muy pequeña,
                causando intensa cizalladura, turbulencia e impacto. Resultan en la reducción del tamaño de gota
                en emulsiones o la disrupción celular.
              </p>
              <ul>
                <li><strong>Aplicaciones:</strong> producción de emulsiones y suspensiones muy finas y estables
                  (liposomas, nanoemulsiones, leches UHT).</li>
                <li>Presiones de operación típicas: 200–2 000 bar.</li>
              </ul>
              <VideoEmbed
                id="bb0vRcl0U9s"
                title="High Pressure Homogenizers — BEE International"
                caption="Homogeneizadores de alta presión: la cizalladura y cavitación en la válvula reducen el tamaño de gota a escala nanométrica."
              />

              <TipCallout title="¿Cómo elegir?">
                <p>La selección del equipo adecuado implica considerar:</p>
                <ul className="list-disc pl-5 space-y-0.5 mt-2">
                  <li>Las fases presentes (sólido-sólido, líquido-líquido, sólido-líquido, gas-líquido).</li>
                  <li>Las propiedades del material (viscosidad, tensión interfacial, tamaño de partícula, cohesividad).</li>
                  <li>El resultado deseado (disolución, suspensión, emulsificación, dispersión).</li>
                  <li>Los requerimientos de limpieza y esterilización (cGMP).</li>
                  <li>La capacidad de escalado.</li>
                </ul>
              </TipCallout>
            </>
          )}

          {/* ═══════ SECCIÓN 5: Escalado ═══════ */}
          {isVisible('escalado') && (
            <>
              <SectionTitle id="escalado">Escalado del mezclado</SectionTitle>
              <p>
                El <strong>escalado</strong> (<em>scale-up</em>) transfiere una operación de mezclado desde la escala de
                laboratorio o piloto a la producción comercial, manteniendo las características críticas del producto.
                Es un paso desafiante porque los mecanismos de mezclado cambian con la escala: al aumentar el volumen,
                la relación superficie/volumen disminuye, los tiempos de circulación aumentan y los gradientes de
                concentración local se hacen más difíciles de eliminar.
              </p>

              <SubTitle>Principios fundamentales</SubTitle>
              <ol>
                <li><strong>Comprender el mecanismo crítico:</strong> ¿Qué aspecto del mezclado es el más importante
                  para la calidad del producto? ¿La uniformidad de contenido del API? ¿El tamaño de gota de una emulsión?
                  ¿La tasa de disolución? Este entendimiento guía la elección del criterio de escalado.</li>
                <li><strong>Similitud geométrica:</strong> Mantener las relaciones entre las dimensiones clave
                  del mezclador ({String.raw`$D_a/D_t$, $H/D_t$`}) constantes entre escalas. Sin esto, las correlaciones
                  y los criterios de escalado pierden validez.</li>
                <li><strong>Caracterización del material:</strong> Las propiedades del material (tamaño de partícula,
                  densidad, cohesividad, viscosidad) pueden influir en cómo se comporta el mezclado a diferentes escalas.
                  Un polvo que fluye bien a 5 kg puede aglomerarse a 500 kg.</li>
              </ol>

              <SubTitle>Criterios de escalado</SubTitle>
              <p>
                Son las reglas que permiten calcular las condiciones de operación a gran escala
                a partir de los datos de pequeña escala. Cada criterio mantiene constante un
                parámetro diferente — y ninguno los mantiene todos.
              </p>

              <div className="my-6 overflow-x-auto not-prose">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-zinc-100 text-brand-dark">
                      <th className="text-left p-3 border border-zinc-200 font-semibold">Criterio</th>
                      <th className="text-left p-3 border border-zinc-200 font-semibold">Se mantiene constante</th>
                      <th className="text-left p-3 border border-zinc-200 font-semibold">Cuándo usarlo</th>
                    </tr>
                  </thead>
                  <tbody className="text-brand-gray">
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">{String.raw`$P/V$`}</td>
                      <td className="p-3 border border-zinc-200">Potencia por volumen</td>
                      <td className="p-3 border border-zinc-200">Turbulencia y transferencia de masa son clave (disolución, dispersión)</td>
                    </tr>
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">{String.raw`$v_{\text{tip}}$`}</td>
                      <td className="p-3 border border-zinc-200">Cizalladura máxima</td>
                      <td className="p-3 border border-zinc-200">Emulsiones, suspensiones, productos sensibles a la cizalla</td>
                    </tr>
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">{String.raw`$N \cdot t$`}</td>
                      <td className="p-3 border border-zinc-200">Revoluciones totales</td>
                      <td className="p-3 border border-zinc-200">Mezcladores de volteo (empírico, polvos de flujo libre)</td>
                    </tr>
                    <tr className="hover:bg-yellow-50/40">
                      <td className="p-3 border border-zinc-200 font-medium text-brand-dark">{String.raw`$\text{Fr}$`}</td>
                      <td className="p-3 border border-zinc-200">Froude</td>
                      <td className="p-3 border border-zinc-200">Cuando la gravedad gobierna la trayectoria (tumble blenders, vórtice)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                Prueba la calculadora interactiva para ver cómo varía la velocidad de rotación
                a gran escala según el criterio elegido:
              </p>

              <ScaleUpCalculator />

              <WarningCallout title="No se puede mantener todo constante">
                <p>{String.raw`Al escalar un tanque agitado manteniendo similitud geométrica, es físicamente imposible mantener simultáneamente $P/V$, $v_{\text{tip}}$, $\text{Re}$ y $t_m$ constantes. Siempre hay un compromiso. El arte del escalado está en identificar cuál de estos parámetros es el más relevante para la calidad del producto específico.`}</p>
              </WarningCallout>

              <TipCallout title="Número de revoluciones totales para tumble blenders">
                <p>Para mezcladores de volteo (V-blender, doble cono), un enfoque empírico muy usado es mantener
                  constante el producto {String.raw`$N \cdot t$`} (velocidad × tiempo = número total de rotaciones).
                  Se determina experimentalmente para cada formulación. Típicamente se requieren entre 100 y 1 000
                  revoluciones totales, dependiendo del sistema.</p>
              </TipCallout>
            </>
          )}

          {/* ═══════ SECCIÓN 6: PAT ═══════ */}
          {isVisible('pat') && (
            <>
              <SectionTitle id="pat">Process Analytical Technology (PAT) en el mezclado</SectionTitle>
              <p>
                La tecnología analítica de procesos (PAT) permite monitorear el progreso del mezclado <strong>en
                tiempo real</strong>, reemplazando el enfoque tradicional de «mezclar X minutos y esperar que salga bien»
                por un control basado en datos.
              </p>

              <SubTitle>Herramientas PAT para mezclado</SubTitle>
              <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
                <div className="rounded-xl border border-zinc-200 p-5 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">NIR en línea</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Espectroscopía de Infrarrojo Cercano. Mide la composición química y la homogeneidad
                    de la mezcla sin contacto directo. Puede detectar el punto final del mezclado y la
                    distribución del API.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">FBRM</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    <em>Focused Beam Reflectance Measurement.</em> Mide la distribución del tamaño de
                    partícula o gota en tiempo real, útil para monitorear granulación húmeda y emulsificación.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">Torque y potencia</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Monitorear la potencia consumida por el motor del mezclador. Cambios en el torque
                    indican cambios en la reología de la mezcla — útil para detectar el punto final de
                    la granulación húmeda.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">Imagen en línea</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Cámaras de alta velocidad y análisis de imagen para monitorear la forma, tamaño y
                    distribución de partículas en procesos de mezclado y granulación.
                  </p>
                </div>
              </div>

              <SubTitle>¿Por qué PAT facilita el escalado?</SubTitle>
              <ul>
                <li>Permite definir el punto final del mezclado por <strong>calidad del producto</strong>, no por tiempo fijo.</li>
                <li>Proporciona datos para justificar y validar el escalado ante agencias regulatorias (FDA, INVIMA).</li>
                <li>Facilita la comprensión de cómo los parámetros del proceso afectan la calidad de la mezcla.</li>
                <li>Reduce el número de lotes fallidos durante el escalado.</li>
              </ul>

              <InfoCallout title="PAT y Quality by Design (QbD)">
                <p>PAT es un pilar fundamental del enfoque <strong>Quality by Design</strong> promovido
                  por la FDA (ICH Q8). En lugar de verificar la calidad al final del proceso (análisis
                  del producto terminado), se diseña el proceso para que la calidad esté integrada desde
                  el principio. Para el mezclado, esto significa conocer el espacio de diseño (velocidad,
                  tiempo, carga) que garantiza la homogeneidad.</p>
              </InfoCallout>
            </>
          )}

          {/* ═══════ SECCIÓN 7: Errores comunes ═══════ */}
          {isVisible('errores') && (
            <>
              <SectionTitle id="errores">Errores comunes en el escalado del mezclado</SectionTitle>
              <p>
                El escalado del mezclado es donde más frecuentemente fallan los proyectos de transferencia
                tecnológica. Estos son los errores más recurrentes:
              </p>

              <div className="my-6 not-prose space-y-3">
                {[
                  {
                    title: 'Subestimar la caracterización física',
                    description: 'No medir las propiedades de los polvos (flujo, cohesividad, distribución de tamaño) a la escala de producción. Un polvo que fluye bien en un vaso de 500 mL puede arquearse en una tolva de 2 000 L.',
                  },
                  {
                    title: 'Estrategia de escalado incorrecta',
                    description: 'Mantener las mismas RPM o el mismo tiempo de mezclado sin considerar la física. Al duplicar el diámetro del recipiente y mantener las RPM, la velocidad de punta se duplica y el P/V se multiplica por 32.',
                  },
                  {
                    title: 'Mezclador inadecuado para la escala',
                    description: 'Un V-blender que funciona bien a 10 L puede segregar a 1 000 L si las propiedades de las partículas generan percolación en caída libre a mayor distancia.',
                  },
                  {
                    title: 'Plan de muestreo inválido',
                    description: 'No tener un plan de muestreo estadísticamente representativo para verificar la uniformidad. Tomar 3 muestras del centro no demuestra homogeneidad. Se necesitan muestras de múltiples ubicaciones y profundidades.',
                  },
                  {
                    title: 'Ignorar la segregación post-mezclado',
                    description: 'Lograr una mezcla homogénea en el mezclador y luego perderla durante la transferencia, el transporte neumático o el llenado de la tolva de la compresora.',
                  },
                ].map((err, i) => (
                  <div key={i} className="rounded-xl border-l-4 border-red-400 bg-red-50/30 p-4">
                    <h4 className="font-semibold text-brand-dark text-sm mb-1">{i + 1}. {err.title}</h4>
                    <p className="text-sm text-brand-gray">{err.description}</p>
                  </div>
                ))}
              </div>

              <TipCallout title="El consejo de oro">
                <p>Entender los materiales, el objetivo del mezclado y el mecanismo crítico que lo gobierna.
                  Experimentar a pequeña escala para entender sensibilidades. Documentar todo meticulosamente.
                  Y siempre, <strong>siempre</strong>, verificar la uniformidad con un plan de muestreo robusto
                  a cada escala.</p>
              </TipCallout>
            </>
          )}

          {/* ═══════ SECCIÓN 8: Bibliografía ═══════ */}
          {isVisible('bibliografia') && (
            <>
              <SectionTitle id="bibliografia">Bibliografía recomendada</SectionTitle>
              <ol className="space-y-3">
                <li>
                  <strong>McCabe, W. L., Smith, J. C., &amp; Harriott, P. (2005).</strong>{' '}
                  <em>Unit Operations of Chemical Engineering</em> (7.ª ed.). McGraw-Hill.
                  Capítulo 9: Agitation and Mixing of Liquids; Capítulo 21: Mixing of Solids and Pastes.
                </li>
                <li>
                  <strong>Perry, R. H., &amp; Green, D. W. (Eds.). (2019).</strong>{' '}
                  <em>Perry&apos;s Chemical Engineers&apos; Handbook</em> (9.ª ed.). McGraw-Hill.
                  Sección 21: Liquid-Solid Operations and Equipment — subsecciones sobre mezclado de líquidos, pastas y sólidos.
                </li>
                <li>
                  <strong>Harnby, N., Edwards, M. F., &amp; Nienow, A. W. (Eds.). (1997).</strong>{' '}
                  <em>Mixing in the Process Industries</em> (2.ª ed.). Butterworth-Heinemann.
                </li>
                <li>
                  <strong>Paul, E. L., Atiemo-Obeng, V. A., &amp; Kresta, S. M. (Eds.). (2004).</strong>{' '}
                  <em>Handbook of Industrial Mixing: Science and Practice</em>. Wiley-Interscience.
                  — Referencia muy completa, con capítulos dedicados al mezclado en diferentes industrias, incluyendo la farmacéutica.
                </li>
                <li>
                  <strong>Levin, M. (Ed.). (2011).</strong>{' '}
                  <em>Pharmaceutical Process Scale-Up</em> (3.ª ed.). Informa Healthcare.
                  — Capítulos específicos sobre escalado de mezclado de sólidos y granulación.
                </li>
              </ol>
            </>
          )}
        </div>
      </div>
    </ReadingLayout>
  );
};

export default MezcladoReading;
