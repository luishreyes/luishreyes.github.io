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
    const target = document.querySelector('.reading-prose') ?? document.body;
    rme(target, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
      ],
      throwOnError: false,
    });
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
            <Figure
              src="/classroom/iqya-2031/readings/transporte-liquidos-02.gif"
              alt="Variación de la densidad con la temperatura"
              caption="La densidad de los líquidos disminuye a medida que aumenta la temperatura."
              maxWidth="500px"
            />
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
            <Figure
              src="/classroom/iqya-2031/readings/transporte-liquidos-03.gif"
              alt="Variación de la viscosidad con la temperatura"
              caption="La viscosidad disminuye de forma marcada al aumentar la temperatura, especialmente en hidrocarburos pesados."
              maxWidth="500px"
            />
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
            <Figure
              src="/classroom/iqya-2031/readings/transporte-liquidos-05.jpeg"
              alt="Curvas de presión de vapor: diethyl ether, ethanol, water"
              caption="Curvas de presión de vapor para diferentes líquidos. Los puntos marcan la temperatura a la que Pᵥₐₚ = 760 torr (1 atm) — es decir, el punto de ebullición."
              maxWidth="500px"
            />
            <Figure
              src="/classroom/iqya-2031/readings/transporte-liquidos-04.png"
              alt="Cavitación en bombas"
              caption="Cavitación: cuando la presión local cae por debajo de la presión de vapor, se forman y colapsan burbujas que erosionan el impulsor."
              maxWidth="400px"
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
      <div className="rounded-xl border-l-4 border-brand-yellow bg-white shadow-sm p-6">
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
          <p className="text-lg leading-relaxed text-brand-gray">
            Esta lectura acompaña la sesión sobre <strong>transporte de líquidos</strong> en la
            industria. Revisaremos las propiedades del fluido que gobiernan su flujo, cómo se
            cuantifican las pérdidas de energía en tuberías, y los principales desafíos que
            enfrenta un ingeniero al diseñar un sistema de transporte. El material es la base
            sobre la cual construiremos, en la siguiente sesión, el estudio de las bombas.
          </p>

          <Figure
            src="/classroom/iqya-2031/readings/transporte-liquidos-01.gif"
            alt="Transporte de líquidos en la industria"
            caption="El transporte de líquidos conecta todas las etapas del proceso industrial: desde la alimentación de materias primas hasta la distribución del producto final."
            maxWidth="600px"
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
              <Figure
                src="/classroom/iqya-2031/readings/transporte-liquidos-07.png"
                alt="Ecuación de Colebrook-White"
                caption={<>Ecuación de Colebrook-White — implícita en $f$, requiere iteración.</>}
                maxWidth="400px"
              />
              <Figure
                src="/classroom/iqya-2031/readings/transporte-liquidos-08.png"
                alt="Diagrama de Moody"
                caption="Diagrama de Moody: factor de fricción vs. Reynolds para distintas rugosidades relativas. En turbulento completamente desarrollado (derecha), f depende solo de ε/D."
                maxWidth="700px"
              />

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
              <Figure
                src="/classroom/iqya-2031/readings/transporte-liquidos-06.png"
                alt="Mapa de presión a lo largo del sistema"
                caption="Mapa de presión a lo largo de un sistema de transporte. La presión mínima (típicamente justo antes de la bomba) debe mantenerse por encima de la presión de vapor, con un margen de NPSH."
                maxWidth="600px"
              />
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
