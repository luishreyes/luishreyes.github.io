import React, { useEffect, useState } from 'react';
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
  { id: 'perspectiva', label: 'Perspectiva histórica' },
  { id: 'definicion', label: 'Definición' },
  { id: 'importancia', label: 'Importancia' },
  { id: 'clasificacion', label: 'Clasificación y principios' },
  { id: 'balances', label: 'Balances de materia y energía' },
  { id: 'ejemplos', label: 'Ejemplos industriales' },
  { id: 'cierre', label: 'Cierre' },
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

const QuoteCallout: React.FC<{ children: React.ReactNode; source?: string }> = ({
  children,
  source,
}) => (
  <div className="my-6 rounded-xl bg-brand-dark p-5 sm:p-6 not-prose">
    <p className="text-sm text-zinc-200 leading-relaxed italic">{children}</p>
    {source && <p className="mt-3 text-xs text-zinc-400">— {source}</p>}
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

/* ─── Tabs de Clasificación (4 familias de fenómenos) ─── */
type FamilyId = 'flujo' | 'calor' | 'masa' | 'mecanicas';

const ClassificationTabs: React.FC = () => {
  const [tab, setTab] = useState<FamilyId>('flujo');
  useKatexRerender([tab]);

  const tabs: { id: FamilyId; label: string; dotClass: string }[] = [
    { id: 'flujo', label: '1. Flujo de fluidos', dotClass: 'bg-sky-500' },
    { id: 'calor', label: '2. Transferencia de calor', dotClass: 'bg-red-500' },
    { id: 'masa', label: '3. Transferencia de masa', dotClass: 'bg-emerald-500' },
    { id: 'mecanicas', label: '4. Operaciones mecánicas', dotClass: 'bg-amber-500' },
  ];

  return (
    <div className="my-6 not-prose">
      <div
        role="tablist"
        aria-label="Familias de operaciones unitarias"
        className="flex gap-2 border-b border-zinc-200 flex-wrap"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
              tab === t.id
                ? 'text-brand-dark border-brand-yellow'
                : 'text-brand-gray border-transparent hover:text-brand-dark'
            }`}
          >
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${t.dotClass}`} aria-hidden="true" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === 'flujo' && (
          <div>
            <h4 className="text-lg font-semibold text-brand-dark mb-2">
              Flujo de fluidos — transferencia de cantidad de movimiento
            </h4>
            <p className="text-brand-gray leading-relaxed">
              Se ocupan del movimiento de líquidos y gases. Incluyen transporte en tuberías,
              bombeo, compresión, agitación, mezclado, sedimentación y filtración.
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              <strong>Principio:</strong> mecánica de fluidos. La ecuación fundamental es el
              Balance de Energía Mecánica, conocida como <strong>ecuación de Bernoulli</strong>.
              Relaciona la presión $P$, velocidad $v$ y elevación $z$ de un fluido entre dos
              puntos (1 y 2), considerando el trabajo añadido por una bomba ($h_p$) y las
              pérdidas por fricción ($h_f$):
            </p>
            <p>
              {'$$\\frac{P_1}{\\rho g} + \\frac{v_1^{2}}{2 g} + z_1 + h_p = \\frac{P_2}{\\rho g} + \\frac{v_2^{2}}{2 g} + z_2 + h_f$$'}
            </p>
            <p className="text-brand-gray leading-relaxed">
              Donde $\rho$ representa la densidad del fluido y $g$ la aceleración de la
              gravedad.
            </p>
            <VideoEmbed id="DW4rItB20h4" title="Ejemplo: flujo de fluidos" />
          </div>
        )}

        {tab === 'calor' && (
          <div>
            <h4 className="text-lg font-semibold text-brand-dark mb-2">
              Transferencia de calor
            </h4>
            <p className="text-brand-gray leading-relaxed">
              Involucran el intercambio de energía térmica. Los ejemplos incluyen
              intercambiadores de calor, secado, evaporación y control de temperatura en
              reactores.
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              <strong>Principio:</strong> termodinámica y mecanismos de transferencia de calor
              (conducción, convección, radiación). La <strong>Ley de Enfriamiento de Newton</strong>
              {' '}para convección describe la tasa de transferencia de calor $q$, donde $h$ es el
              coeficiente de transferencia, $A$ el área, $T_s$ la temperatura de la superficie y
              $T_f$ la del fluido:
            </p>
            <p>{'$$q = h \\, A \\, (T_s - T_f)$$'}</p>
            <VideoEmbed id="GDyQXSEAJNA" title="Ejemplo: transferencia de calor" />
          </div>
        )}

        {tab === 'masa' && (
          <div>
            <h4 className="text-lg font-semibold text-brand-dark mb-2">
              Transferencia de masa
            </h4>
            <p className="text-brand-gray leading-relaxed">
              Implican el movimiento de componentes químicos entre fases o dentro de una misma
              fase. Constituyen la base de la mayoría de los procesos de separación. Ejemplos:
              destilación, absorción, extracción, adsorción, secado y operaciones con membranas.
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              <strong>Principio:</strong> equilibrio de fases y cinética de transferencia de
              masa. La <strong>Ley de Fick</strong> establece que el flujo molar {String.raw`$J_{A,z}$`}
              {' '}de un componente $A$ en dirección $z$ es proporcional al gradiente de su
              concentración $C_A$:
            </p>
            <p>{'$$J_{A,z} = - D_{AB} \\, \\frac{dC_A}{dz}$$'}</p>
            <p className="text-brand-gray leading-relaxed">
              Donde {String.raw`$D_{AB}$`} es el coeficiente de difusividad de $A$ en $B$.
            </p>
            <VideoEmbed id="PYMWUz7TC3A" title="Ejemplo: transferencia de masa" />
          </div>
        )}

        {tab === 'mecanicas' && (
          <div>
            <h4 className="text-lg font-semibold text-brand-dark mb-2">
              Operaciones mecánicas
            </h4>
            <p className="text-brand-gray leading-relaxed">
              Enfocadas en el manejo y procesamiento físico de sólidos: reducción de tamaño
              (trituración, molienda), tamizado, transporte de sólidos, mezclado de sólidos y
              pastas.
            </p>
            <p className="text-brand-gray leading-relaxed mt-2">
              <strong>Principio:</strong> mecánica de sólidos y propiedades de los materiales.
              A diferencia de los fluidos, los sólidos tienen un comportamiento discreto y
              heterogéneo: el tamaño de partícula, la forma, la dureza y la distribución
              granulométrica gobiernan su respuesta a los equipos.
            </p>
            <VideoEmbed id="Twp0OY0nn5w" title="Ejemplo: operaciones mecánicas" />
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Explorador interactivo del balance general ─── */
const MassBalanceExplorer: React.FC = () => {
  const [steady, setSteady] = useState(true);
  const [withReaction, setWithReaction] = useState(false);

  const terms: { key: string; label: string; visible: boolean; color: string }[] = [
    { key: 'ent', label: String.raw`\text{Entrada}`, visible: true, color: 'text-emerald-400' },
    { key: 'sal', label: String.raw`\text{Salida}`, visible: true, color: 'text-sky-400' },
    { key: 'gen', label: String.raw`\text{Generación}`, visible: withReaction, color: 'text-brand-yellow' },
    { key: 'con', label: String.raw`\text{Consumo}`, visible: withReaction, color: 'text-red-400' },
    { key: 'acum', label: String.raw`\text{Acumulación}`, visible: !steady, color: 'text-purple-400' },
  ];

  // Construir la ecuación KaTeX simplificada según los checkboxes
  const buildEquation = (): string => {
    const lhsParts: string[] = [String.raw`\text{Entrada}`, String.raw`-\,\text{Salida}`];
    if (withReaction) {
      lhsParts.push(String.raw`+\,\text{Generación}`);
      lhsParts.push(String.raw`-\,\text{Consumo}`);
    }
    const rhs = steady ? '0' : String.raw`\text{Acumulación}`;
    return `$$${lhsParts.join(' ')} = ${rhs}$$`;
  };

  useKatexRerender([steady, withReaction]);

  return (
    <div className="my-6 rounded-xl bg-brand-dark p-5 sm:p-6 not-prose text-zinc-100">
      <p className="font-semibold text-brand-yellow text-sm mb-3">
        ⚖️ Explorador del balance general
      </p>
      <p className="text-xs text-zinc-400 mb-4">
        Activa las condiciones del proceso y observa cómo se simplifica la ecuación general.
      </p>
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-zinc-500 mb-3">Condiciones</p>
          <label className="flex items-start gap-3 mb-3 cursor-pointer">
            <input
              type="checkbox"
              checked={steady}
              onChange={(e) => setSteady(e.target.checked)}
              className="mt-1 accent-brand-yellow"
            />
            <span>
              <span className="font-semibold text-white block">Estado estacionario</span>
              <span className="text-xs text-zinc-400">
                Las propiedades no cambian con el tiempo → no hay acumulación.
              </span>
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={withReaction}
              onChange={(e) => setWithReaction(e.target.checked)}
              className="mt-1 accent-brand-yellow"
            />
            <span>
              <span className="font-semibold text-white block">Hay reacción química</span>
              <span className="text-xs text-zinc-400">
                Aparecen términos de generación y consumo por especie.
              </span>
            </span>
          </label>

          <div className="mt-5">
            <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Términos activos</p>
            <div className="flex flex-wrap gap-2">
              {terms.map((t) => (
                <span
                  key={t.key}
                  className={`text-xs font-mono px-2 py-1 rounded border transition-all ${
                    t.visible
                      ? `${t.color} border-current bg-zinc-900`
                      : 'text-zinc-600 border-zinc-800 bg-zinc-900/40 line-through'
                  }`}
                >
                  {t.label.replace(/\\text\{|\}/g, '')}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Ecuación resultante</p>
          <div className="rounded-lg bg-zinc-900 border border-zinc-700 p-4 text-center">
            <p className="text-white text-sm sm:text-base">{buildEquation()}</p>
          </div>
          <p className="text-xs text-zinc-400 mt-3 italic leading-relaxed">
            {steady && !withReaction && 'Caso más común en operaciones unitarias en continuo: lo que entra sale.'}
            {steady && withReaction && 'Estacionario con reacción: la generación neta compensa la diferencia entre entrada y salida.'}
            {!steady && !withReaction && 'Transitorio sin reacción: típico de arranques, llenados o vaciados de tanques.'}
            {!steady && withReaction && 'Caso más general: reactores batch, transitorios con reacción, cambios de composición.'}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ─── Tabs de ejemplos industriales con stepper horizontal ─── */
type FamilyKey = 'flujo' | 'calor' | 'masa' | 'mecanicas' | 'reaccion';
const familyMeta: Record<FamilyKey, { label: string; color: string; bg: string }> = {
  flujo: { label: 'Flujo de fluidos', color: 'text-sky-600', bg: 'bg-sky-100 border-sky-300' },
  calor: { label: 'Transferencia de calor', color: 'text-red-600', bg: 'bg-red-100 border-red-300' },
  masa: { label: 'Transferencia de masa', color: 'text-emerald-600', bg: 'bg-emerald-100 border-emerald-300' },
  mecanicas: { label: 'Mecánica', color: 'text-amber-600', bg: 'bg-amber-100 border-amber-300' },
  reaccion: { label: 'Reacción química', color: 'text-purple-600', bg: 'bg-purple-100 border-purple-300' },
};

type IndustrialStep = {
  name: string;
  families: FamilyKey[];
  description: string;
};

type IndustrialExample = {
  id: string;
  label: string;
  intro: string;
  steps: IndustrialStep[];
  video: { id: string; title: string; start?: number };
};

const industrialExamples: IndustrialExample[] = [
  {
    id: 'refineria',
    label: 'Refinación de petróleo',
    intro:
      'Refinación de petróleo crudo para obtener gasolina. El crudo se transporta, se calienta y se separa en fracciones, cada una tratada con operaciones posteriores.',
    steps: [
      {
        name: 'Bombeo',
        families: ['flujo'],
        description:
          'El crudo se mueve desde tanques de almacenamiento hacia los hornos mediante bombas centrífugas. Pérdidas de carga, cavitación y NPSH son los criterios de diseño.',
      },
      {
        name: 'Precalentamiento',
        families: ['calor'],
        description:
          'Hornos e intercambiadores llevan el crudo hasta ~350 °C antes de entrar a la torre. La integración térmica con corrientes calientes de productos es clave para la eficiencia energética.',
      },
      {
        name: 'Destilación fraccionada',
        families: ['masa', 'calor'],
        description:
          'En la torre atmosférica el crudo se separa por punto de ebullición en gases, nafta, queroseno, diésel y residuo. Simultáneamente ocurren transferencia de masa (equilibrio vapor-líquido en cada plato) y transferencia de calor (vaporización y condensación).',
      },
      {
        name: 'Enfriamiento y tratamientos',
        families: ['calor', 'masa'],
        description:
          'Las fracciones se enfrían en intercambiadores y aerorefrigerantes, y se someten a operaciones posteriores (hidrotratamiento, reformado, mezclado) para obtener los productos comerciales finales.',
      },
    ],
    video: { id: 'GYRwWyG3Qqw', title: 'Refinación de petróleo', start: 8 },
  },
  {
    id: 'agua',
    label: 'Potabilización de agua',
    intro:
      'Potabilización de agua superficial (río o lago) para abastecimiento humano. Cada etapa elimina un tipo específico de contaminante mediante una operación unitaria distinta.',
    steps: [
      {
        name: 'Tamizado',
        families: ['mecanicas'],
        description:
          'Rejas y tamices retienen sólidos gruesos (ramas, basura) antes del tratamiento propiamente dicho. Operación puramente mecánica de separación por tamaño.',
      },
      {
        name: 'Coagulación / floculación',
        families: ['flujo'],
        description:
          'Se agrega un coagulante (sulfato de aluminio, PAC) y se agita suavemente para aglomerar partículas coloidales en flóculos visibles. Es mezclado y flujo de fluidos.',
      },
      {
        name: 'Sedimentación',
        families: ['flujo', 'mecanicas'],
        description:
          'En tanques de gran área superficial los flóculos se depositan por gravedad. El diseño se basa en la velocidad de sedimentación y el tiempo de residencia.',
      },
      {
        name: 'Filtración',
        families: ['flujo', 'mecanicas'],
        description:
          'Lechos de arena y antracita retienen las partículas finas que no sedimentaron. Se alternan ciclos de filtración y retrolavado.',
      },
      {
        name: 'Adsorción con carbón activado',
        families: ['masa'],
        description:
          'Opcional. El carbón activado retiene compuestos orgánicos, sabor y olor. Transferencia de masa de contaminantes del agua hacia la superficie del sólido.',
      },
      {
        name: 'Desinfección',
        families: ['masa', 'reaccion'],
        description:
          'Cloración, ozonización o radiación UV eliminan microorganismos patógenos. Combina transferencia de masa (del desinfectante al agua) con reacción química letal para las bacterias.',
      },
    ],
    video: { id: '0_ZcCqqpS2o', title: 'Potabilización de agua', start: 398 },
  },
  {
    id: 'azucar',
    label: 'Producción de azúcar',
    intro:
      'Obtención de azúcar cristalizado a partir de caña de azúcar. Es uno de los procesos más antiguos y claros para mostrar el encadenamiento de operaciones unitarias.',
    steps: [
      {
        name: 'Molienda',
        families: ['mecanicas'],
        description:
          'Trenes de molinos de rodillos extraen el jugo de la caña por compresión. El bagazo resultante se utiliza como combustible en las calderas.',
      },
      {
        name: 'Clarificación',
        families: ['flujo', 'reaccion'],
        description:
          'El jugo se trata con cal y se calienta para precipitar impurezas; los sólidos sedimentan en clarificadores y el jugo claro pasa a la siguiente etapa.',
      },
      {
        name: 'Evaporación',
        families: ['calor', 'masa'],
        description:
          'En evaporadores de múltiple efecto se concentra el jugo de ~15 % a ~65 % de sólidos eliminando agua. Aprovecha calor en cascada para reducir el consumo energético.',
      },
      {
        name: 'Cristalización',
        families: ['masa', 'calor'],
        description:
          'En tachos al vacío se sobresatura el jarabe y se forman cristales de sacarosa. El balance entre temperatura, presión y semillas determina el tamaño de cristal.',
      },
      {
        name: 'Centrifugación',
        families: ['mecanicas', 'flujo'],
        description:
          'Centrífugas separan los cristales del licor madre (miel) por fuerza centrífuga. Los cristales quedan húmedos; la miel se recircula o se destina a melazas.',
      },
      {
        name: 'Secado',
        families: ['calor', 'masa'],
        description:
          'Secadores rotatorios con aire caliente eliminan la humedad residual hasta llegar al azúcar comercial, listo para envasar.',
      },
    ],
    video: { id: 'GYRwWyG3Qqw', title: 'Proceso general (referencia)' },
  },
];

const IndustrialExamplesTabs: React.FC = () => {
  const [tabId, setTabId] = useState(industrialExamples[0].id);
  const [stepIdx, setStepIdx] = useState(0);
  useKatexRerender([tabId, stepIdx]);

  const example = industrialExamples.find((e) => e.id === tabId) ?? industrialExamples[0];
  const currentStep = example.steps[stepIdx];

  const handleTabChange = (id: string) => {
    setTabId(id);
    setStepIdx(0);
  };

  return (
    <div className="my-6 not-prose">
      {/* Tabs principales */}
      <div
        role="tablist"
        aria-label="Ejemplos industriales"
        className="flex gap-2 border-b border-zinc-200 flex-wrap"
      >
        {industrialExamples.map((e) => (
          <button
            key={e.id}
            role="tab"
            aria-selected={tabId === e.id}
            onClick={() => handleTabChange(e.id)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
              tabId === e.id
                ? 'text-brand-dark border-brand-yellow'
                : 'text-brand-gray border-transparent hover:text-brand-dark'
            }`}
          >
            {e.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <p className="text-brand-gray leading-relaxed mb-5">{example.intro}</p>

        {/* Stepper horizontal (círculos conectados) */}
        <div className="overflow-x-auto pb-2">
          <div className="flex items-center gap-0 min-w-max">
            {example.steps.map((s, i) => (
              <React.Fragment key={s.name + i}>
                <button
                  onClick={() => setStepIdx(i)}
                  className="flex flex-col items-center group"
                  aria-label={`Paso ${i + 1}: ${s.name}`}
                  aria-current={stepIdx === i ? 'step' : undefined}
                >
                  <span
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold border-2 transition-all ${
                      stepIdx === i
                        ? 'bg-brand-dark text-brand-yellow border-brand-yellow scale-110 shadow-md'
                        : 'bg-white text-brand-dark border-zinc-300 group-hover:border-brand-yellow'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={`mt-2 text-xs font-semibold text-center max-w-[110px] leading-tight ${
                      stepIdx === i ? 'text-brand-dark' : 'text-brand-gray'
                    }`}
                  >
                    {s.name}
                  </span>
                </button>
                {i < example.steps.length - 1 && (
                  <span
                    className="h-px w-8 sm:w-14 bg-zinc-300 mx-0 mb-8"
                    aria-hidden="true"
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Detalle del paso */}
        <div className="mt-6 rounded-xl border-l-4 border-brand-yellow bg-white shadow-sm p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-yellow-dark mb-1">
                Paso {stepIdx + 1} de {example.steps.length}
              </p>
              <h4 className="text-xl font-bold text-brand-dark">{currentStep.name}</h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentStep.families.map((f) => (
                <span
                  key={f}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${familyMeta[f].bg} ${familyMeta[f].color}`}
                >
                  {familyMeta[f].label}
                </span>
              ))}
            </div>
          </div>
          <p className="text-sm text-brand-gray leading-relaxed">{currentStep.description}</p>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setStepIdx(Math.max(0, stepIdx - 1))}
              disabled={stepIdx === 0}
              className="px-3 py-1.5 rounded-lg bg-zinc-100 text-brand-gray text-xs font-semibold hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Anterior
            </button>
            <button
              onClick={() => setStepIdx(Math.min(example.steps.length - 1, stepIdx + 1))}
              disabled={stepIdx === example.steps.length - 1}
              className="px-3 py-1.5 rounded-lg bg-brand-dark text-white text-xs font-semibold hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente →
            </button>
          </div>
        </div>

        <VideoEmbed id={example.video.id} title={example.video.title} start={example.video.start} />
      </div>
    </div>
  );
};

/* ─── Componente principal ─── */
const OperacionesUnitarias: React.FC = () => {
  const course = getCourseBySlug('iqya-2031');
  if (!course) return null;
  const reading = course.readings.find((r) => r.slug === 'operaciones-unitarias');
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
            <p className="text-lg leading-relaxed text-brand-gray">
              Esta lectura acompaña la primera sesión del curso y presenta el concepto que
              articula toda la disciplina: las <strong>operaciones unitarias</strong>. Aquí
              conocerás cómo surgió la idea, qué significa formalmente, por qué es tan poderosa
              y cómo se organizan los cientos de operaciones que veremos durante el semestre.
            </p>
          )}

          {isVisible('perspectiva') && (
            <>
              <SectionTitle id="perspectiva">Una perspectiva histórica</SectionTitle>
              <p>
                Para apreciar la Ingeniería Química contemporánea, es fundamental examinar el
                origen de uno de sus conceptos más influyentes: las operaciones unitarias.
                Antes del siglo XX, la industria química consistía principalmente en prácticas
                empíricas y oficios independientes. La fabricación de jabón, la producción de
                ácido sulfúrico y la metalurgia se consideraban procesos aislados, cada uno
                con sus propias metodologías y conocimientos. En ese entonces, no se
                reconocían los principios comunes que conectaban estas diversas industrias.
              </p>

              <Figure
                src="/classroom/iqya-2031/readings/arthur-d-little.jpeg"
                alt="Dr. Arthur D. Little"
                caption="Dr. Arthur D. Little (1863–1935), químico e ingeniero que formalizó el concepto de operaciones unitarias."
                maxWidth="320px"
              />

              <p>
                El punto de inflexión ocurrió en <strong>1915</strong>. El Dr. Arthur D. Little,
                destacado ingeniero químico y consultor, junto con un comité del
                <em> American Institute of Chemical Engineers (AIChE)</em>, presentó una
                visión revolucionaria en un informe al presidente del Massachusetts Institute
                of Technology (MIT). Propuso que:
              </p>

              <QuoteCallout source="Arthur D. Little, 1915. Citado en McCabe, Smith y Harriott (2005)">
                "cualquier proceso químico, sin importar cuán variado sea en su naturaleza,
                puede ser descompuesto en una serie coordinada de lo que podrían llamarse
                <em> operaciones unitarias</em>, como pulverización, secado, cristalización,
                filtración, evaporación, destilación, etc."
              </QuoteCallout>

              <p>
                Esta idea transformadora sugería que, en lugar de estudiar innumerables
                procesos individuales, los ingenieros podían enfocarse en un
                <strong> conjunto limitado de etapas físicas fundamentales</strong>. Permitió
                organizar el conocimiento en ingeniería química de manera lógica y
                sistemática, mejorando la enseñanza, la investigación y, crucialmente, el
                diseño y la innovación industrial.
              </p>

              <p>
                La propuesta de Little no quedó solo en el papel: pocos años después,
                <strong> William H. Walker, Warren K. Lewis y William H. McAdams</strong>
                {' '}consolidaron el enfoque en el MIT con el influyente manual{' '}
                <em>Principles of Chemical Engineering</em> (1923), el primer texto que
                organizaba la disciplina alrededor de las operaciones unitarias. Más tarde,
                <strong> Edwin R. Gilliland y Thomas H. Chilton</strong> extendieron el
                tratamiento matemático — especialmente de la destilación y la transferencia de
                masa —, sentando las bases de la ingeniería química moderna. En pocas décadas,
                lo que había sido un conjunto de oficios separados se convirtió en una
                profesión con un vocabulario y un cuerpo teórico propios.
              </p>

              <TipCallout>
                La separación conceptual entre <strong>reacción química</strong> (lo que pasa a
                nivel molecular) y <strong>operaciones unitarias</strong> (los procesos físicos
                que permiten que la reacción ocurra en escala industrial) es la base que hace
                posible diseñar plantas completas con métodos reproducibles.
              </TipCallout>
            </>
          )}

          {isVisible('definicion') && (
            <>
              <SectionTitle id="definicion">Definición</SectionTitle>
              <p>
                Una <strong>operación unitaria</strong> se define como un paso básico dentro de
                un proceso químico donde los materiales experimentan un cambio principalmente
                físico, o una transformación fisicoquímica, que se analiza y trata como una
                unidad individual.
              </p>

              <SubTitle>¿Para qué se usan?</SubTitle>
              <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Preparar reactivos
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Por ejemplo, la molienda de un sólido para aumentar su área superficial o
                    la disolución de un reactivo.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Separar y purificar productos
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Aislar un producto deseado de subproductos o impurezas mediante
                    destilación, extracción o filtración.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Controlar la energía
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Calentar o enfriar corrientes de proceso, como ocurre en los
                    intercambiadores de calor.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Mover materiales
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Transporte de fluidos por tuberías o de sólidos mediante sistemas de
                    transporte neumático, bandas, tornillos, etc.
                  </p>
                </div>
              </div>

              <SubTitle>Reacción química vs. operación unitaria</SubTitle>
              <p>
                Es importante distinguir las operaciones unitarias de las reacciones químicas.
                Mientras la <strong>reacción química</strong> constituye el núcleo de la
                transformación molecular, las <strong>operaciones unitarias</strong> son los
                procesos físicos que apoyan y posibilitan estas reacciones: acondicionan los
                reactivos, separan y purifican los productos, y gestionan la energía del
                sistema.
              </p>
              <p>
                Un proceso químico completo es una <strong>secuencia integrada</strong> de
                reacciones químicas y diversas operaciones unitarias. Como señala Geankoplis
                (2003), estas operaciones se fundamentan en los principios de transferencia de
                masa, calor y/o cantidad de movimiento.
              </p>

              <InfoCallout>
                Existen <strong>industrias completas que operan exclusivamente con operaciones
                unitarias</strong>, sin reacciones químicas presentes — piensa en una planta
                de tratamiento de agua, una refinería que solo separa fracciones, o una planta
                de alimentos que deshidrata y envasa.
              </InfoCallout>
            </>
          )}

          {isVisible('importancia') && (
            <>
              <SectionTitle id="importancia">Importancia</SectionTitle>
              <p>
                El estudio de las operaciones unitarias es fundamental en la formación del
                ingeniero químico por cuatro razones principales:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    1. Universalidad
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Los principios son aplicables en diversas industrias (petroquímica,
                    alimentaria, farmacéutica, biotecnológica, ambiental). Quien domina la
                    destilación puede diseñar una columna para separar etanol de agua, hexano
                    de xileno, o aromáticos de nafta.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    2. Simplificación de la complejidad
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Permiten descomponer procesos industriales complejos en unidades
                    manejables, facilitando el análisis y la optimización del sistema
                    completo.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    3. Base para diseño y escalado
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Proporcionan el marco teórico y los modelos matemáticos para escalar desde
                    el laboratorio hasta la producción industrial, pasando por la planta
                    piloto.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    4. Optimización y eficiencia
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    El análisis detallado de cada operación permite reducir consumo
                    energético, minimizar residuos, mejorar la calidad del producto y reducir
                    costos operativos — aspectos clave para sostenibilidad y rentabilidad.
                  </p>
                </div>
              </div>

              <TipCallout title="💡 Un mismo modelo, muchas industrias">
                Una <strong>columna de destilación</strong> en una refinería de gasolina, otra
                en una destilería de etanol para biocombustibles y una tercera en la separación
                petroquímica de xilenos comparten exactamente la misma teoría de{' '}
                <strong>equilibrio de fases</strong>, el mismo procedimiento de diseño (McCabe-
                Thiele o Ponchon-Savarit) y los mismos parámetros clave (relación de reflujo,
                número de etapas, inundación). Cambian los fluidos, el tamaño y las presiones,
                pero el ingeniero los aborda con el mismo lenguaje. Esa es la potencia del
                enfoque por operaciones unitarias.
              </TipCallout>
            </>
          )}

          {isVisible('clasificacion') && (
            <>
              <SectionTitle id="clasificacion">Clasificación y principios</SectionTitle>
              <p>
                Las operaciones unitarias se agrupan según el fenómeno físico predominante.
                Las cuatro grandes familias son: <strong>flujo de fluidos</strong>,{' '}
                <strong>transferencia de calor</strong>, <strong>transferencia de masa</strong>
                {' '}y <strong>operaciones mecánicas</strong>. Usa las pestañas para explorar
                cada una — cambia al principio físico, la ecuación característica y un ejemplo
                en video.
              </p>

              <ClassificationTabs />

              <InfoCallout title="📌 Operaciones híbridas">
                Muchas operaciones unitarias <strong>combinan varios fenómenos</strong>
                {' '}simultáneamente. Por ejemplo, el <strong>secado</strong> involucra al mismo
                tiempo transferencia de calor (para evaporar el agua de un sólido) y
                transferencia de masa (para transportar el vapor hacia el aire). La{' '}
                <strong>destilación</strong> combina equilibrio de fases con transferencia de
                masa y de calor. La <strong>cristalización</strong> acopla transferencia de
                masa y de calor con mecánica de partículas. Estas operaciones híbridas son la
                norma más que la excepción — por eso el ingeniero químico necesita dominar las
                cuatro familias simultáneamente y no como compartimentos estancos.
              </InfoCallout>
            </>
          )}

          {isVisible('balances') && (
            <>
              <SectionTitle id="balances">Balances de materia y energía</SectionTitle>
              <p>
                Los <strong>balances de materia y energía</strong> son herramientas
                fundamentales y transversales para cuantificar flujos, composiciones y
                requerimientos energéticos en cualquier operación unitaria — sin importar a
                cuál de las cuatro familias pertenezca.
              </p>
              <p>El balance general de materia se expresa como:</p>
              <p>
                {'$$\\text{Entrada} - \\text{Salida} + \\text{Generación} - \\text{Consumo} = \\text{Acumulación}$$'}
              </p>
              <p>
                En estado estacionario y sin reacción química, se simplifica a:
                <strong> Entrada = Salida</strong>. Esta versión sencilla es la que usaremos
                la mayor parte del semestre cuando los procesos operan en continuo y los
                componentes no se generan ni consumen dentro del equipo.
              </p>

              <SubTitle>Explorador interactivo</SubTitle>
              <p>
                Usa el siguiente panel para activar o desactivar las condiciones típicas del
                proceso y observa cómo se simplifica la ecuación general. Esta lógica es
                idéntica para balance por especie (con coeficientes estequiométricos cuando
                hay reacción) y para balance de energía (cambiando "materia" por "energía" e
                incluyendo calor y trabajo como términos de transferencia).
              </p>

              <MassBalanceExplorer />

              <SubTitle>Balance con reacción química</SubTitle>
              <p>
                Cuando hay reacción, el balance debe plantearse <strong>por especie</strong>
                {' '}química. Para la especie $A$ en una reacción $aA \to bB$, el término de
                generación o consumo está ligado a la velocidad de reacción $r_A$ (mol/L·s) y
                al volumen del reactor $V$:
              </p>
              <p>
                {'$$\\dot{n}_{A,\\text{ent}} - \\dot{n}_{A,\\text{sal}} + r_A \\, V = \\dfrac{dn_A}{dt}$$'}
              </p>
              <p>
                El signo de $r_A$ es <strong>negativo</strong> si $A$ es un reactivo (se
                consume) y <strong>positivo</strong> si es un producto (se genera). Este es el
                tema central del curso de <strong>Balance de Materia y Energía</strong> y lo
                profundizarás en <strong>Reactores Químicos</strong>; en este curso lo
                usaremos como herramienta de soporte, principalmente para equipos donde no hay
                reacción (intercambiadores, columnas, bombas, secadores).
              </p>

              <TipCallout title="💡 Checklist del balance">
                Antes de plantear cualquier balance pregúntate: ¿qué entra?, ¿qué sale?,
                ¿cambia algo con el tiempo (estado estacionario o transitorio)?, ¿hay
                reacción química (generación/consumo)? Si los cuatro términos están claros,
                el balance se resuelve solo.
              </TipCallout>
            </>
          )}

          {isVisible('ejemplos') && (
            <>
              <SectionTitle id="ejemplos">Ejemplos industriales</SectionTitle>
              <p>
                Para visualizar cómo se encadenan las operaciones, veamos tres procesos
                industriales simplificados. Fíjate cómo cada uno es una
                <strong> secuencia de operaciones unitarias interconectadas</strong> —
                cambia la materia prima y el producto, pero las familias de fenómenos se
                repiten una y otra vez. Haz clic en cada paso del stepper para explorarlo en
                detalle.
              </p>

              <IndustrialExamplesTabs />
            </>
          )}

          {isVisible('cierre') && (
            <>
              <SectionTitle id="cierre">Cierre</SectionTitle>
              <p>
                El concepto de operaciones unitarias continúa siendo un pilar de la Ingeniería
                Química. Proporciona un <strong>lenguaje común</strong> y un
                <strong> marco analítico fundamental</strong> para el diseño, análisis,
                optimización y resolución de problemas en diversas industrias. Su comprensión
                profunda es una herramienta esencial para el ingeniero químico.
              </p>
              <p>
                En las próximas sesiones del curso exploraremos en detalle varias de estas
                operaciones — empezando por las propiedades de sólidos particulados, luego
                reducción de tamaño, flujo de fluidos, bombas, agitación, transferencia de
                calor y, finalmente, equilibrio de fases y destilación.
              </p>

              <h3 className="text-lg font-semibold text-brand-dark mt-10 mb-3">
                Referencias
              </h3>
              <ul className="text-sm text-brand-gray leading-relaxed">
                <li>
                  McCabe, W. L., Smith, J. C., &amp; Harriott, P. (2005).
                  <em> Unit Operations of Chemical Engineering</em> (7th ed.). McGraw-Hill.
                </li>
                <li>
                  Geankoplis, C. J. (2003). <em>Transport Processes and Separation Process
                    Principles</em> (4th ed.). Prentice Hall.
                </li>
                <li>
                  Walker, W. H., Lewis, W. K., &amp; McAdams, W. H. (1923).
                  <em> Principles of Chemical Engineering</em>. McGraw-Hill. (Primer manual
                  basado en operaciones unitarias.)
                </li>
                <li>
                  Little, A. D. (1915). Report to the President of MIT. American Institute of
                  Chemical Engineers.
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </ReadingLayout>
  );
};

export default OperacionesUnitarias;
