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

      <Figure
        src="/classroom/iqya-2031/readings/propiedades-solidos-02.png"
        alt="Comparación de los tipos de densidad"
        caption="Densidad verdadera, de partícula y masal: cada una corresponde a un volumen distinto — sólido puro, sólido + poros cerrados, y lecho completo con huecos interparticulares."
        maxWidth="600px"
      />
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
            volumen) y se pesa el conjunto ({String.raw`$m_{\text{pic}+p}$`}). La masa del polvo se
            obtiene por diferencia:
          </p>
          <p className="mt-2">{'$$m_p = m_{\\text{pic}+p} - m_\\text{pic}$$'}</p>
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
            <Figure
              src="/classroom/iqya-2031/readings/propiedades-solidos-06.jpeg"
              alt="Diámetro equivalente por volumen"
              caption="Diámetro equivalente por volumen ($d_v$): diámetro de la esfera con el mismo volumen que la partícula real."
              maxWidth="400px"
            />
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
            <Figure
              src="/classroom/iqya-2031/readings/propiedades-solidos-09.png"
              alt="Análisis por tamizado"
              caption="Pila de tamices con aperturas decrecientes. Es el método más común y económico para caracterizar DTP en la industria."
              maxWidth="500px"
            />
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
              src="/classroom/iqya-2031/readings/propiedades-solidos-10.gif"
              alt="Microscopía de partículas"
              caption="Microscopía: observación directa de morfología y dimensiones. Permite caracterizar simultáneamente tamaño y forma."
              maxWidth="500px"
            />
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
              src="/classroom/iqya-2031/readings/propiedades-solidos-11.png"
              alt="Método de sedimentación"
              caption="Sedimentación: el tamaño se deduce de la velocidad terminal de caída libre mediante la Ley de Stokes."
              maxWidth="500px"
            />
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
              src="/classroom/iqya-2031/readings/propiedades-solidos-12.png"
              alt="Difracción láser"
              caption="Difracción láser: el patrón de dispersión de la luz incidente se invierte para obtener la DTP completa en segundos."
              maxWidth="500px"
            />
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
              src="/classroom/iqya-2031/readings/propiedades-solidos-13.jpeg"
              alt="Contador Coulter"
              caption="Contador Coulter: cada partícula que cruza el orificio genera un pulso de resistencia proporcional a su volumen."
              maxWidth="500px"
            />
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

      <Figure
        src="/classroom/iqya-2031/readings/propiedades-solidos-14.png"
        alt="Formas comunes de partículas"
        caption="Morfologías típicas: acicular, fibrosa, granular, esférica, laminar y cúbica. La forma condiciona el flujo, el empaquetamiento y la interacción con fluidos."
        maxWidth="600px"
      />
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

              <Figure
                src="/classroom/iqya-2031/readings/propiedades-solidos-03.png"
                alt="Picnómetro de líquido"
                caption="Picnómetro de líquido: recipiente de volumen calibrado empleado para medir densidad de partícula por desplazamiento."
                maxWidth="400px"
              />

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

              <Figure
                src="/classroom/iqya-2031/readings/propiedades-solidos-04.jpeg"
                alt="Porosidad del lecho"
                caption="Porosidad interparticular: los huecos visibles entre partículas dentro del lecho — función directa del empaquetamiento."
                maxWidth="400px"
              />

              <SubTitle>Porosidad de la partícula (intraparticular)</SubTitle>
              <p>
                Corresponde a los poros <em>internos</em> de cada partícula (si
                {String.raw`$\rho_\text{aparente}$`} considera solo poros cerrados y
                {String.raw`$\rho_\text{verdadera}$`} es la densidad verdadera):
              </p>
              <p>
                {'$$\\varepsilon_\\text{partícula} = 1 - \\frac{\\rho_\\text{aparente}}{\\rho_\\text{verdadera}}$$'}
              </p>

              <Figure
                src="/classroom/iqya-2031/readings/propiedades-solidos-05.png"
                alt="Porosidad intraparticular"
                caption="Porosidad intraparticular: poros cerrados o abiertos dentro del grano. Invisible desde el exterior, pero afecta densidad efectiva y cinética de secado o extracción."
                maxWidth="400px"
              />

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

              <Figure
                src="/classroom/iqya-2031/readings/propiedades-solidos-15.jpeg"
                alt="Esfericidad"
                caption={<>Esfericidad $\Phi_S$: razón entre área de la esfera equivalente en volumen y área real de la partícula.</>}
                maxWidth="500px"
              />

              <p>
                Para una esfera perfecta, <strong>$\Phi_S = 1$</strong>; para partículas
                irregulares, <strong>$\Phi_S &lt; 1$</strong>. Este parámetro es importante
                porque influye en los <strong>coeficientes de arrastre en fluidos</strong> y
                en la <strong>densidad de empaquetamiento</strong>.
              </p>

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
                    $\Phi_S &lt; 0.6$ tienen $\varepsilon_\text{lecho} &gt; 0.55$.
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
                src="/classroom/iqya-2031/readings/propiedades-solidos-16.png"
                alt="Ángulo de reposo"
                caption={<>Ángulo de reposo $\theta$: se mide sobre el cono formado al verter el polvo libremente sobre una superficie plana.</>}
                maxWidth="500px"
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
                  <strong>$\rho_\text{suelta}$, $\rho_\text{compactada}$</strong> a ambos
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
