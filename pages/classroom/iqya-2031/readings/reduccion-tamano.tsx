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
  { id: 'objetivo', label: '¿Por qué rompemos las cosas?' },
  { id: 'mecanismos', label: 'Mecanismos de fractura' },
  { id: 'equipos', label: 'Equipos' },
  { id: 'leyes', label: 'Leyes de la conminución' },
  { id: 'ejemplo', label: 'Ejemplo resuelto (Bond)' },
  { id: 'factores', label: 'Factores operativos' },
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

const SubSubTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h4 className="text-base font-semibold text-brand-dark mt-6 mb-2">{children}</h4>
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

/* ─── Mini-SVG de mecanismos de fractura ─── */
const MechIcon: React.FC<{ kind: 'compresion' | 'impacto' | 'atricion' | 'corte' }> = ({ kind }) => {
  const common = 'w-16 h-16 text-brand-yellow-dark';
  if (kind === 'compresion') {
    return (
      <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="14" y="28" width="36" height="8" rx="1.5" fill="currentColor" fillOpacity="0.15" />
        <path d="M32 8v12M32 44v12" strokeLinecap="round" />
        <path d="M24 14l8 6 8-6M24 50l8-6 8 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === 'impacto') {
    return (
      <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="16" cy="32" r="6" fill="currentColor" />
        <path d="M22 32h8" strokeLinecap="round" />
        <path d="M36 20l4 4 6-6M36 44l4-4 6 6M40 32h8" strokeLinecap="round" />
        <polygon points="34,24 42,28 38,32 44,36 34,40 38,32" fill="currentColor" fillOpacity="0.2" />
      </svg>
    );
  }
  if (kind === 'atricion') {
    return (
      <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="8" y="18" width="48" height="6" rx="1.5" fill="currentColor" fillOpacity="0.15" />
        <rect x="8" y="40" width="48" height="6" rx="1.5" fill="currentColor" fillOpacity="0.15" />
        <circle cx="20" cy="32" r="3" />
        <circle cx="32" cy="32" r="3" />
        <circle cx="44" cy="32" r="3" />
        <path d="M8 14l4-4M52 14l4-4M8 54l4-4M52 54l4-4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M10 20l20 12-20 12z" fill="currentColor" fillOpacity="0.2" />
      <path d="M34 32h20" strokeLinecap="round" />
      <path d="M54 32l-6-4M54 32l-6 4" strokeLinecap="round" />
      <path d="M30 10l6 22-6 22" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3" />
    </svg>
  );
};

/* ─── Tabs de mecanismos de fractura ─── */
const MechanismsTabs: React.FC = () => {
  const [tab, setTab] = useState<'compresion' | 'impacto' | 'atricion' | 'corte'>('compresion');
  useKatexRerender([tab]);

  const tabs = [
    { id: 'compresion', label: 'Compresión' },
    { id: 'impacto', label: 'Impacto' },
    { id: 'atricion', label: 'Atrición' },
    { id: 'corte', label: 'Corte' },
  ] as const;

  return (
    <div className="my-6 not-prose">
      <div role="tablist" aria-label="Mecanismos de fractura" className="flex gap-2 border-b border-zinc-200 flex-wrap">
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
        {tab === 'compresion' && (
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="shrink-0 mx-auto md:mx-0"><MechIcon kind="compresion" /></div>
            <div className="flex-1">
              <p className="text-brand-gray leading-relaxed">
                Fuerzas <strong>opuestas y lentas</strong> que aplastan el sólido hasta que su
                resistencia a la compresión se supera. Es el mecanismo dominante en la{' '}
                <strong>reducción gruesa</strong> de materiales duros y frágiles — típicamente
                la etapa primaria de una planta de conminución.
              </p>
              <ul className="mt-3 pl-5 list-disc space-y-1 text-brand-gray leading-relaxed">
                <li><strong>Equipos típicos:</strong> trituradoras de mandíbula (jaw), giratorias (gyratory), rodillos (crushing rolls).</li>
                <li><strong>Material ideal:</strong> rocas duras, frágiles y no demasiado abrasivas. Caliza, cuarzo, mineral de hierro.</li>
                <li><strong>Ejemplos industriales:</strong> minería primaria, canteras, cemento (primera etapa), reciclaje de concreto.</li>
                <li><strong>Relación de reducción típica:</strong> 3:1 a 8:1 por etapa.</li>
              </ul>
            </div>
          </div>
        )}

        {tab === 'impacto' && (
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="shrink-0 mx-auto md:mx-0"><MechIcon kind="impacto" /></div>
            <div className="flex-1">
              <p className="text-brand-gray leading-relaxed">
                Un <strong>golpe súbito</strong> y de alta velocidad transfiere energía cinética
                a la partícula, generando fracturas por propagación rápida de grietas. La
                partícula se rompe por la inercia de su propia masa frente al impacto.
              </p>
              <ul className="mt-3 pl-5 list-disc space-y-1 text-brand-gray leading-relaxed">
                <li><strong>Equipos típicos:</strong> molinos de martillos (hammer mills), molinos de impacto, pulverizadores.</li>
                <li><strong>Material ideal:</strong> frágiles y de dureza media. Carbón, fosfatos, piedra caliza, granos secos.</li>
                <li><strong>Ejemplos industriales:</strong> molienda de carbón en plantas térmicas, harina industrial, fertilizantes.</li>
                <li><strong>Relación de reducción típica:</strong> 10:1 a 40:1.</li>
              </ul>
            </div>
          </div>
        )}

        {tab === 'atricion' && (
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="shrink-0 mx-auto md:mx-0"><MechIcon kind="atricion" /></div>
            <div className="flex-1">
              <p className="text-brand-gray leading-relaxed">
                <strong>Fuerzas de cizalla</strong> entre las partículas y las superficies del
                equipo (o entre las partículas mismas). El material se degrada progresivamente
                por rozamiento — mecanismo dominante en la <strong>molienda fina</strong>, donde
                es preciso crear mucha nueva área superficial.
              </p>
              <ul className="mt-3 pl-5 list-disc space-y-1 text-brand-gray leading-relaxed">
                <li><strong>Equipos típicos:</strong> molinos de discos (atrición), molinos de bolas, molinos de barras, molinos coloidales.</li>
                <li><strong>Material ideal:</strong> amplio — desde duros hasta semiduros. Cementos, pigmentos, minerales metálicos.</li>
                <li><strong>Ejemplos industriales:</strong> molienda de clinker a cemento, beneficio de minerales, farma (activos).</li>
                <li><strong>Relación de reducción típica:</strong> 20:1 a 100:1 (molinos de bolas largos).</li>
              </ul>
            </div>
          </div>
        )}

        {tab === 'corte' && (
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="shrink-0 mx-auto md:mx-0"><MechIcon kind="corte" /></div>
            <div className="flex-1">
              <p className="text-brand-gray leading-relaxed">
                Una <strong>cuchilla</strong> aplica una fuerza concentrada en una línea estrecha
                para seccionar el material. A diferencia de la fractura frágil, el corte es el
                mecanismo apropiado para materiales que <strong>deforman plásticamente</strong> o
                son <strong>fibrosos</strong>.
              </p>
              <ul className="mt-3 pl-5 list-disc space-y-1 text-brand-gray leading-relaxed">
                <li><strong>Equipos típicos:</strong> cortadoras rotativas (knife mills), granuladores, picadoras.</li>
                <li><strong>Material ideal:</strong> blandos, elásticos, fibrosos o tenaces. Plásticos, caucho, papel, textiles, biomasa.</li>
                <li><strong>Ejemplos industriales:</strong> reciclaje de plásticos, alimentos (carnes, vegetales), preparación de pulpa.</li>
                <li><strong>Relación de reducción típica:</strong> depende del tamaño de la malla, comúnmente 5:1 a 20:1.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Explorador de equipos ─── */
type Equipo = {
  id: string;
  nombre: string;
  grupo: 'trituradoras' | 'molinos' | 'ultrafinos';
  descripcion: string;
  mecanismo: string;
  aplicaciones: string;
  material: string;
  relacion: string;
  imagen?: string;
  imagenMaxWidth?: string;
  video?: { id: string; title: string };
};

const equipos: Equipo[] = [
  {
    id: 'jaw',
    nombre: 'Mandíbula (jaw)',
    grupo: 'trituradoras',
    descripcion: 'Mandíbula fija y móvil; el material se comprime entre ambas a medida que la móvil oscila.',
    mecanismo: 'Compresión',
    aplicaciones: 'Trituración primaria en minería, canteras, escorias, reciclaje de concreto.',
    material: 'Rocas duras y abrasivas; bloques grandes (hasta 1.5 m).',
    relacion: '3:1 a 7:1',
    imagen: '/classroom/iqya-2031/readings/reduccion-tamano-02.gif',
    imagenMaxWidth: '500px',
  },
  {
    id: 'gyratory',
    nombre: 'Giratoria (gyratory)',
    grupo: 'trituradoras',
    descripcion: 'Cono de trituración que gira excéntricamente dentro de una carcasa cónica; alimenta por arriba, descarga por abajo.',
    mecanismo: 'Compresión continua',
    aplicaciones: 'Minería primaria de muy alta capacidad; operación continua (sin tiempos muertos).',
    material: 'Rocas muy duras y masivas; cobre, hierro, oro primario.',
    relacion: 'Hasta 8:1',
    imagen: '/classroom/iqya-2031/readings/reduccion-tamano-03.gif',
    imagenMaxWidth: '500px',
  },
  {
    id: 'rolls',
    nombre: 'Rodillos (crushing rolls)',
    grupo: 'trituradoras',
    descripcion: 'Dos rodillos que giran en direcciones opuestas; el material es atrapado y comprimido en el nip.',
    mecanismo: 'Compresión (y algo de cizalla si son dentados)',
    aplicaciones: 'Carbón, yeso, arcilla, sal, roca fosfórica; alimentación a molinos.',
    material: 'Dureza media-baja, no muy abrasivos.',
    relacion: '2:1 a 4:1',
    imagen: '/classroom/iqya-2031/readings/reduccion-tamano-04.gif',
    imagenMaxWidth: '500px',
  },
  {
    id: 'hammer',
    nombre: 'Martillos (hammer mill)',
    grupo: 'molinos',
    descripcion: 'Rotor con martillos pivotantes a alta velocidad; las partículas se rompen al golpear martillos, placas y rejilla.',
    mecanismo: 'Impacto (principal) + atrición',
    aplicaciones: 'Carbón, piedra caliza, fosfatos, alimentos secos, biomasa, madera.',
    material: 'Frágiles, fibrosos, dureza baja-media.',
    relacion: '10:1 a 40:1',
    imagen: '/classroom/iqya-2031/readings/reduccion-tamano-05.gif',
    imagenMaxWidth: '500px',
  },
  {
    id: 'disc',
    nombre: 'Discos / atrición',
    grupo: 'molinos',
    descripcion: 'Uno o dos discos rotatorios con superficies abrasivas o dentadas; el material se muele en el gap entre discos.',
    mecanismo: 'Atrición (cizalla entre superficies)',
    aplicaciones: 'Granos, especias, pigmentos, pulpa de papel.',
    material: 'Blandos a semiduros; tolera algo de humedad.',
    relacion: '5:1 a 10:1',
    imagen: '/classroom/iqya-2031/readings/reduccion-tamano-06.jpeg',
    imagenMaxWidth: '500px',
  },
  {
    id: 'ball',
    nombre: 'Bolas / barras (tumbling)',
    grupo: 'molinos',
    descripcion: 'Cilindro horizontal rotatorio; los medios (bolas de acero/cerámica o barras) caen y muelen el material por impacto y cizalla.',
    mecanismo: 'Impacto + atrición',
    aplicaciones: 'Molienda fina de minerales, cemento, cerámica, pigmentos; workhorse de la minería.',
    material: 'Duros y abrasivos; apto para operación húmeda o seca.',
    relacion: '20:1 a 100:1 (configurables en circuito cerrado)',
    imagen: '/classroom/iqya-2031/readings/reduccion-tamano-07.gif',
    imagenMaxWidth: '500px',
  },
  {
    id: 'jet',
    nombre: 'Chorro (jet mill)',
    grupo: 'ultrafinos',
    descripcion: 'Chorros de gas a alta velocidad aceleran las partículas, que chocan entre sí. No hay medios de molienda — producto libre de contaminación metálica.',
    mecanismo: 'Impacto partícula-partícula',
    aplicaciones: 'Farmacéuticos, pigmentos, cerámicas finas, toners, cosméticos.',
    material: 'Sensibles al calor (gas frío), alta pureza.',
    relacion: 'Producto submicrónico (d50 < 10 µm)',
    video: { id: 'J0WEeE_I1i0', title: 'Jet mill en operación' },
  },
  {
    id: 'knife',
    nombre: 'Cuchillas (knife mill)',
    grupo: 'ultrafinos',
    descripcion: 'Cuchillas montadas en un rotor que cortan el material contra cuchillas fijas; tamaño de producto definido por una malla de descarga.',
    mecanismo: 'Corte',
    aplicaciones: 'Reciclaje de plásticos, caucho, textiles; alimentos (carnes, vegetales).',
    material: 'Blandos, elásticos, fibrosos, tenaces.',
    relacion: '5:1 a 20:1 (según malla)',
    video: { id: 'Lz_FFXp6678', title: 'Knife mill / cortadora rotativa en operación' },
  },
];

const EquipmentSelector: React.FC = () => {
  const [grupo, setGrupo] = useState<'trituradoras' | 'molinos' | 'ultrafinos'>('trituradoras');
  const [selected, setSelected] = useState<string>('jaw');
  useKatexRerender([grupo, selected]);

  const visibles = equipos.filter((e) => e.grupo === grupo);
  const activo = equipos.find((e) => e.id === selected) ?? visibles[0];

  const grupos = [
    { id: 'trituradoras', label: 'Trituradoras', sub: 'Reducción gruesa' },
    { id: 'molinos', label: 'Molinos', sub: 'Reducción intermedia y fina' },
    { id: 'ultrafinos', label: 'Ultrafinos + cortadoras', sub: 'Producto micrométrico o corte' },
  ] as const;

  return (
    <div className="my-6 not-prose">
      <div role="tablist" aria-label="Grupos de equipos" className="flex gap-2 border-b border-zinc-200 flex-wrap">
        {grupos.map((g) => (
          <button
            key={g.id}
            role="tab"
            aria-selected={grupo === g.id}
            onClick={() => {
              setGrupo(g.id);
              const first = equipos.find((e) => e.grupo === g.id);
              if (first) setSelected(first.id);
            }}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
              grupo === g.id
                ? 'text-brand-dark border-brand-yellow'
                : 'text-brand-gray border-transparent hover:text-brand-dark'
            }`}
          >
            <span className="block">{g.label}</span>
            <span className="block text-[11px] font-normal text-brand-gray">{g.sub}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 grid md:grid-cols-[260px_1fr] gap-4">
        {/* Lista de cards */}
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {visibles.map((e) => (
            <button
              key={e.id}
              onClick={() => setSelected(e.id)}
              className={`shrink-0 md:shrink text-left px-4 py-3 rounded-lg border transition-all ${
                selected === e.id
                  ? 'bg-yellow-50 border-brand-yellow shadow-sm'
                  : 'bg-white border-zinc-200 hover:border-brand-yellow hover:bg-zinc-50'
              }`}
            >
              <p className={`font-semibold text-sm ${selected === e.id ? 'text-brand-dark' : 'text-brand-dark'}`}>
                {e.nombre}
              </p>
              <p className="text-xs text-brand-gray mt-0.5">{e.mecanismo}</p>
            </button>
          ))}
        </div>

        {/* Panel de detalle */}
        {activo && (
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h4 className="text-lg font-bold text-brand-dark mb-1">{activo.nombre}</h4>
            <p className="text-xs uppercase tracking-wider text-brand-yellow-dark font-semibold mb-3">
              {activo.mecanismo}
            </p>
            <p className="text-sm text-brand-gray leading-relaxed mb-3">{activo.descripcion}</p>
            <dl className="text-sm grid sm:grid-cols-2 gap-x-4 gap-y-2 mb-3">
              <div>
                <dt className="text-xs uppercase tracking-wider text-brand-gray font-semibold">Aplicaciones</dt>
                <dd className="text-brand-dark">{activo.aplicaciones}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-brand-gray font-semibold">Material ideal</dt>
                <dd className="text-brand-dark">{activo.material}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase tracking-wider text-brand-gray font-semibold">Relación de reducción</dt>
                <dd className="text-brand-dark font-mono">{activo.relacion}</dd>
              </div>
            </dl>
            {activo.imagen && (
              <Figure
                src={activo.imagen}
                alt={activo.nombre}
                caption={activo.nombre}
                maxWidth={activo.imagenMaxWidth ?? '500px'}
              />
            )}
            {activo.video && <VideoEmbed id={activo.video.id} title={activo.video.title} />}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Calculadora de Bond ─── */
const materialesBond = [
  { nombre: 'Caliza', wi: 11.6 },
  { nombre: 'Clinker (cemento)', wi: 13.5 },
  { nombre: 'Cuarzo', wi: 13.6 },
  { nombre: 'Granito', wi: 14.4 },
  { nombre: 'Mineral de hierro', wi: 15.4 },
  { nombre: 'Bauxita', wi: 9.5 },
  { nombre: 'Yeso', wi: 7.0 },
];

const BondCalculator: React.FC = () => {
  const [Wi, setWi] = useState(11.6);
  const [F80, setF80] = useState(10000); // µm
  const [P80, setP80] = useState(100); // µm

  const E = useMemo(() => Wi * (10 / Math.sqrt(P80) - 10 / Math.sqrt(F80)), [Wi, F80, P80]);

  useKatexRerender([E]);

  const fmt = (n: number) => {
    if (!isFinite(n)) return '—';
    const abs = Math.abs(n);
    if (abs >= 1e5 || (abs > 0 && abs < 1e-2)) return n.toExponential(2);
    return n.toLocaleString('es-CO', { maximumFractionDigits: 3 });
  };

  return (
    <div className="my-6 rounded-xl bg-brand-dark p-5 sm:p-6 not-prose text-zinc-100">
      <p className="font-semibold text-brand-yellow text-sm mb-3">🧮 Calculadora de la ley de Bond</p>
      <p className="text-xs text-zinc-400 mb-4">
        Ajusta {String.raw`$W_i$`}, {String.raw`$F_{80}$`} y {String.raw`$P_{80}$`} para estimar la
        energía específica {String.raw`$E$`} (kWh/t).
      </p>

      <div className="mb-4">
        <p className="text-xs uppercase tracking-wider text-zinc-400 mb-2">Presets de material (fija el Wᵢ)</p>
        <div className="flex flex-wrap gap-2">
          {materialesBond.map((m) => (
            <button
              key={m.nombre}
              onClick={() => setWi(m.wi)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                Math.abs(Wi - m.wi) < 0.01
                  ? 'bg-brand-yellow text-brand-dark border-brand-yellow font-semibold'
                  : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-brand-yellow hover:text-white'
              }`}
            >
              {m.nombre} <span className="opacity-70 font-mono">({m.wi})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        {[
          { label: 'Wᵢ (kWh/t)', value: Wi, set: setWi, min: 1, max: 30, step: 0.1 },
          { label: 'F₈₀ (µm) — alimentación', value: F80, set: setF80, min: 50, max: 200000, step: 50 },
          { label: 'P₈₀ (µm) — producto', value: P80, set: setP80, min: 5, max: 10000, step: 5 },
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
          <p className="text-xs uppercase tracking-wider text-zinc-500">Energía específica</p>
          <p className="text-2xl font-bold font-mono text-brand-yellow">{fmt(E)} kWh/t</p>
          <p className="text-xs text-zinc-400 mt-1">
            {String.raw`$E = W_i \left[ \dfrac{10}{\sqrt{P_{80}}} - \dfrac{10}{\sqrt{F_{80}}} \right]$`}
          </p>
        </div>
        <div className="text-xs text-zinc-400 sm:text-right">
          <p>Razón de reducción:</p>
          <p className="font-mono text-zinc-200">{fmt(F80 / P80)} :1</p>
        </div>
      </div>
    </div>
  );
};

/* ─── Tabs de las leyes de la conminución ─── */
const LawsComparisonTabs: React.FC = () => {
  const [tab, setTab] = useState<'rittinger' | 'kick' | 'bond' | 'hukki'>('rittinger');
  useKatexRerender([tab]);

  const tabs = [
    { id: 'rittinger', label: 'Rittinger (1867)' },
    { id: 'kick', label: 'Kick (1885)' },
    { id: 'bond', label: 'Bond (1952)' },
    { id: 'hukki', label: 'Hukki (1961)' },
  ] as const;

  return (
    <div className="my-6 not-prose">
      <div role="tablist" aria-label="Leyes de la conminución" className="flex gap-2 border-b border-zinc-200 flex-wrap">
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
        {tab === 'rittinger' && (
          <div>
            <p className="text-brand-gray leading-relaxed">
              <strong>Postulado:</strong> la energía requerida $E$ es proporcional a la{' '}
              <strong>nueva área superficial creada</strong>. Ajusta bien a la molienda{' '}
              <strong>fina</strong>, donde la creación de superficie domina el costo energético.
            </p>
            <p className="my-3">
              {'$$E = K_R\\left(\\dfrac{1}{x_2} - \\dfrac{1}{x_1}\\right)$$'}
            </p>
            <ul className="pl-5 list-disc space-y-1 text-brand-gray leading-relaxed">
              <li>{String.raw`$x_1$, $x_2$`}: tamaños promedio de alimentación y producto.</li>
              <li>{String.raw`$K_R$`}: constante empírica del material y del equipo.</li>
              <li><strong>Cuándo aplica:</strong> molienda fina (rango &lt; 100 µm).</li>
              <li><strong>Limitaciones:</strong> sobreestima la energía en trituración gruesa; la constante depende del equipo.</li>
            </ul>
          </div>
        )}
        {tab === 'kick' && (
          <div>
            <p className="text-brand-gray leading-relaxed">
              <strong>Postulado:</strong> la energía es proporcional a la{' '}
              <strong>relación de reducción</strong> — rompe una partícula requiere el mismo trabajo
              específico que partirla en fragmentos geométricamente similares.
            </p>
            <p className="my-3">
              {'$$E = K_K \\log\\dfrac{x_1}{x_2}$$'}
            </p>
            <ul className="pl-5 list-disc space-y-1 text-brand-gray leading-relaxed">
              <li>{String.raw`$K_K$`}: constante empírica del material.</li>
              <li><strong>Cuándo aplica:</strong> trituración gruesa (cm → mm).</li>
              <li><strong>Limitaciones:</strong> subestima la energía en molienda fina; no considera la generación de superficie nueva.</li>
            </ul>
          </div>
        )}
        {tab === 'bond' && (
          <div>
            <p className="text-brand-gray leading-relaxed">
              <strong>Postulado:</strong> la energía es proporcional a la <strong>diferencia de
              longitudes de grieta</strong> — una formulación intermedia entre Rittinger y Kick
              que empíricamente funciona muy bien en el rango industrial de molienda.
            </p>
            <p className="my-3">
              {'$$E = W_i \\left[\\dfrac{10}{\\sqrt{P_{80}}} - \\dfrac{10}{\\sqrt{F_{80}}}\\right]$$'}
            </p>
            <ul className="pl-5 list-disc space-y-1 text-brand-gray leading-relaxed">
              <li>{String.raw`$W_i$`}: Índice de Trabajo de Bond (kWh/t). Se mide en un ensayo estandarizado.</li>
              <li>{String.raw`$F_{80}, P_{80}$`}: tamaños por los que pasa el 80% de la alimentación y del producto, en µm.</li>
              <li><strong>Cuándo aplica:</strong> rango industrial de molienda intermedia (mm → 100 µm). <strong>Es la ley más utilizada.</strong></li>
              <li><strong>Uso industrial:</strong> dimensionamiento de molinos de bolas y barras; comparación de circuitos.</li>
            </ul>
            <BondCalculator />
            <Figure
              src="/classroom/iqya-2031/readings/reduccion-tamano-08.png"
              alt="Tabla del Índice de Trabajo de Bond para distintos materiales"
              caption="Índice de Trabajo de Bond para distintos materiales industriales."
              maxWidth="700px"
            />
          </div>
        )}
        {tab === 'hukki' && (
          <div>
            <p className="text-brand-gray leading-relaxed">
              <strong>Hukki (1961)</strong> observó que ninguna de las tres leyes clásicas es
              universal, y propuso una <strong>forma generalizada</strong> donde el exponente
              depende del tamaño de partícula:
            </p>
            <p className="my-3">
              {'$$\\dfrac{dE}{dx} = -\\dfrac{K}{x^{n(x)}}$$'}
            </p>
            <ul className="pl-5 list-disc space-y-1 text-brand-gray leading-relaxed">
              <li>{String.raw`$n \approx 1$`} → trituración gruesa (Kick).</li>
              <li>{String.raw`$n \approx 1.5$`} → molienda intermedia (Bond).</li>
              <li>{String.raw`$n \approx 2$`} → molienda fina (Rittinger).</li>
            </ul>
            <p className="text-brand-gray leading-relaxed mt-3">
              La ecuación de Hukki <strong>reconcilia</strong> las tres leyes como casos
              particulares según el rango de tamaños. Útil para entender por qué ninguna ley
              clásica funciona en todos los rangos y por qué la industria segmenta el proceso en
              etapas con equipos diferentes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Tabla resumen de relación de reducción por equipo ─── */
const ReductionRatioTable: React.FC = () => {
  const filas = [
    { equipo: 'Trituradora de mandíbula', rr: '3:1 – 7:1', producto: '50 – 300 mm', nota: 'Primaria' },
    { equipo: 'Trituradora giratoria', rr: '4:1 – 8:1', producto: '25 – 200 mm', nota: 'Primaria alta capacidad' },
    { equipo: 'Rodillos lisos', rr: '2:1 – 4:1', producto: '5 – 50 mm', nota: 'Secundaria suave' },
    { equipo: 'Molino de martillos', rr: '10:1 – 40:1', producto: '0.5 – 25 mm', nota: 'Frágiles y fibrosos' },
    { equipo: 'Molino de bolas', rr: '20:1 – 100:1', producto: '10 – 200 µm', nota: 'Workhorse industrial' },
    { equipo: 'Molino de barras', rr: '15:1 – 50:1', producto: '0.3 – 2 mm', nota: 'Menos finos que bolas' },
    { equipo: 'Jet mill', rr: 'n/a', producto: '< 10 µm', nota: 'Submicrónico, sin contaminación' },
    { equipo: 'Knife mill', rr: '5:1 – 20:1', producto: '1 – 20 mm', nota: 'Fibrosos, plásticos' },
  ];
  return (
    <div className="my-6 not-prose">
      <p className="text-sm text-brand-gray mb-3">
        Rangos típicos de <strong>relación de reducción</strong> y tamaño de producto por tipo
        de equipo. Úsalo para acotar qué equipos considerar según el salto {String.raw`$F/P$`} que
        necesitas.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-brand-dark text-white text-left">
              <th className="px-4 py-2.5 font-semibold">Equipo</th>
              <th className="px-4 py-2.5 font-semibold">Relación de reducción</th>
              <th className="px-4 py-2.5 font-semibold">Tamaño de producto</th>
              <th className="px-4 py-2.5 font-semibold">Notas</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f, i) => (
              <tr key={f.equipo} className={i % 2 === 0 ? 'bg-white' : 'bg-zinc-50'}>
                <td className="px-4 py-2.5 font-medium text-brand-dark">{f.equipo}</td>
                <td className="px-4 py-2.5 font-mono text-brand-dark">{f.rr}</td>
                <td className="px-4 py-2.5 font-mono text-brand-gray">{f.producto}</td>
                <td className="px-4 py-2.5 text-brand-gray text-xs">{f.nota}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ─── Material properties explorer ─── */
/* ─── Cards interactivas de propiedades del material ─── */
type PropCard = {
  id: string;
  name: string;
  tagline: string;
  icon: React.ReactNode;
  color: string;
  detail: React.ReactNode;
  metric: string;
};

const MaterialPropertyCards: React.FC = () => {
  const [open, setOpen] = useState<string | null>(null);
  useKatexRerender([open]);

  const ic = (paths: React.ReactNode) => (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths}
    </svg>
  );

  const props: PropCard[] = [
    {
      id: 'dureza',
      name: 'Dureza',
      tagline: 'Resistencia a ser rayado o indentado.',
      color: 'text-sky-600 bg-sky-50 border-sky-200',
      icon: ic(<><path d="M12 2L3 7v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7l-9-5z"/></>),
      metric: 'Mohs 1–10 · Bond Wᵢ (kWh/t)',
      detail: (
        <>
          <p>
            Define qué tan agresivo debe ser el equipo para iniciar la fractura. Escalas prácticas:
            <strong> Mohs</strong> (1–10) para referencia mineralógica, <strong>Bond {String.raw`$W_i$`}</strong>
            para energía específica.
          </p>
          <p className="mt-2 text-xs text-brand-gray">
            <strong className="text-brand-dark">Ejemplo:</strong> cuarzo Mohs 7 → molino de bolas
            con liners de Cr-Mo; talco Mohs 1 → molino de martillos.
          </p>
        </>
      ),
    },
    {
      id: 'friabilidad',
      name: 'Friabilidad',
      tagline: 'Facilidad con que se fractura bajo impacto.',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      icon: ic(<><path d="M12 2v6l-3-3M12 2v6l3-3M4 14l4 3-2 4M20 14l-4 3 2 4M8 22h8"/></>),
      metric: 'Friable vs. tenaz',
      detail: (
        <>
          <p>
            Un material duro puede ser <strong>friable</strong> (se rompe bien con impacto) o
            <strong> tenaz</strong> (absorbe energía sin fracturar). Dureza y friabilidad son
            propiedades independientes.
          </p>
          <p className="mt-2 text-xs text-brand-gray">
            <strong className="text-brand-dark">Ejemplo:</strong> carbón = duro pero friable, ideal
            para molino de martillos. Caucho = blando pero tenaz, necesita cortadora rotativa.
          </p>
        </>
      ),
    },
    {
      id: 'abrasividad',
      name: 'Abrasividad',
      tagline: 'Desgaste que causa en el equipo.',
      color: 'text-red-600 bg-red-50 border-red-200',
      icon: ic(<><path d="M3 18h18M6 14l2-4 2 4M10 14l2-6 2 6M14 14l2-3 2 3"/></>),
      metric: 'Ai (Bond abrasion index)',
      detail: (
        <>
          <p>
            Causa desgaste de revestimientos, medios de molienda y piezas de repuesto. En minería,
            el costo de <em>liners</em> y bolas puede ser comparable al costo energético.
          </p>
          <p className="mt-2 text-xs text-brand-gray">
            <strong className="text-brand-dark">Ejemplo:</strong> cuarzo y alúmina son altamente
            abrasivos (Ai &gt; 0.5) → usar revestimientos de caucho o acero al manganeso.
          </p>
        </>
      ),
    },
    {
      id: 'humedad',
      name: 'Humedad',
      tagline: 'Contenido de agua libre en el material.',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      icon: ic(<><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></>),
      metric: '% p/p',
      detail: (
        <>
          <p>
            Puede causar <strong>apelmazamiento</strong>, adherencia en revestimientos y
            obstrucción de tamices. A veces se opta por <strong>molienda húmeda</strong> o por un
            secado previo para facilitar la fractura.
          </p>
          <p className="mt-2 text-xs text-brand-gray">
            <strong className="text-brand-dark">Regla práctica:</strong> &gt; 5% humedad → considerar
            molienda húmeda o secado upstream. Arenas de playa, harinas y algunos minerales
            requieren tratamiento específico.
          </p>
        </>
      ),
    },
    {
      id: 'termico',
      name: 'Sensibilidad al calor',
      tagline: 'Degradación, oxidación o fusión.',
      color: 'text-orange-600 bg-orange-50 border-orange-200',
      icon: ic(<><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></>),
      metric: 'T máx admisible (°C)',
      detail: (
        <>
          <p>
            Materiales farmacéuticos, alimentos, polímeros y explosivos se degradan con el
            calor generado en la molienda. Requieren <strong>enfriamiento</strong> (con agua
            fría, N₂ líquido para criogénica) o <strong>jet mills</strong> que expanden gas.
          </p>
          <p className="mt-2 text-xs text-brand-gray">
            <strong className="text-brand-dark">Ejemplo:</strong> especias (aroma volátil) se
            muelen criogénicamente con N₂; pigmentos orgánicos se muelen en jet mill.
          </p>
        </>
      ),
    },
    {
      id: 'pegajosidad',
      name: 'Pegajosidad',
      tagline: 'Tendencia a adherirse a superficies.',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      icon: ic(<><path d="M12 2v8M4 10c0 4 4 8 8 8s8-4 8-8M9 10h6M10 18v4M14 18v4"/></>),
      metric: 'Cualitativo',
      detail: (
        <>
          <p>
            Causa obstrucción del equipo, adherencia al revestimiento y apelmazamiento en
            tamices. Requiere limpieza frecuente, revestimientos no-adherentes (PTFE) o
            aditivos antiaglomerantes.
          </p>
          <p className="mt-2 text-xs text-brand-gray">
            <strong className="text-brand-dark">Ejemplo:</strong> resinas, algunos polímeros,
            productos farma → usar jet mill o molino con revestimiento liso + control de humedad.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="my-6 not-prose">
      <p className="text-sm text-brand-gray mb-3">
        Las seis propiedades del material que más influyen en la selección del equipo y en la
        operación. Haz clic en cada una para ver detalle y ejemplos industriales.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {props.map((p) => {
          const isOpen = open === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setOpen(isOpen ? null : p.id)}
              className={`text-left rounded-xl border-2 p-4 transition-all ${
                isOpen
                  ? `${p.color} shadow-md ring-2 ring-brand-yellow`
                  : 'bg-white border-zinc-200 hover:border-brand-yellow hover:-translate-y-0.5 hover:shadow-sm'
              }`}
              aria-expanded={isOpen}
            >
              <div className="flex items-start justify-between gap-2">
                <div className={isOpen ? '' : 'text-brand-yellow-dark'}>{p.icon}</div>
                <span className="text-[10px] text-brand-gray uppercase tracking-wider">
                  {isOpen ? 'Cerrar' : 'Ver más'}
                </span>
              </div>
              <h4 className="mt-2 font-semibold text-brand-dark text-base">{p.name}</h4>
              <p className="text-xs text-brand-gray mt-0.5 leading-snug">{p.tagline}</p>
              <p className="text-[11px] font-mono text-brand-gray/70 mt-1.5">{p.metric}</p>
            </button>
          );
        })}
      </div>
      {/* Panel de detalle de la propiedad seleccionada */}
      {open && (
        <div
          key={open}
          className="mt-4 rounded-xl border-l-4 border-brand-yellow bg-white shadow-sm p-5 animate-[fadeIn_200ms_ease]"
        >
          {(() => {
            const p = props.find((x) => x.id === open);
            if (!p) return null;
            return (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-brand-yellow-dark">{p.icon}</div>
                  <h4 className="font-bold text-brand-dark text-lg">{p.name}</h4>
                </div>
                <div className="text-sm text-brand-gray leading-relaxed">{p.detail}</div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

const MaterialPropertiesExplorer: React.FC = () => {
  const [mohs, setMohs] = useState(5);
  const [humedad, setHumedad] = useState<'seco' | 'humedo' | 'muy-humedo'>('seco');
  const [termico, setTermico] = useState<'normal' | 'sensible'>('normal');
  const [alim, setAlim] = useState<'gruesa' | 'media' | 'fina'>('media');
  useKatexRerender([mohs, humedad, termico, alim]);

  const recomendaciones = useMemo(() => {
    const recs: { equipo: string; razon: string }[] = [];

    // Primary selection by feed size
    if (alim === 'gruesa') {
      if (mohs >= 6) {
        recs.push({ equipo: 'Trituradora giratoria', razon: 'Alta capacidad para rocas muy duras.' });
        recs.push({ equipo: 'Trituradora de mandíbula', razon: 'Trituración primaria robusta y confiable.' });
      } else {
        recs.push({ equipo: 'Trituradora de mandíbula', razon: 'Adecuada para dureza media en primaria.' });
        recs.push({ equipo: 'Rodillos', razon: 'Material no muy duro — compresión suave.' });
      }
    } else if (alim === 'media') {
      if (mohs >= 6) {
        recs.push({ equipo: 'Molino de bolas', razon: 'Molienda fina de materiales duros y abrasivos.' });
        recs.push({ equipo: 'Molino de barras', razon: 'Producto grueso con menos finos que bolas.' });
      } else if (mohs >= 3) {
        recs.push({ equipo: 'Molino de martillos', razon: 'Materiales frágiles de dureza media.' });
        recs.push({ equipo: 'Molino de atrición (discos)', razon: 'Semiduros; producto intermedio a fino.' });
      } else {
        recs.push({ equipo: 'Cortadora (knife mill)', razon: 'Materiales blandos o fibrosos.' });
        recs.push({ equipo: 'Molino de martillos', razon: 'Frágiles y fibrosos de baja dureza.' });
      }
    } else {
      // fina
      if (termico === 'sensible') {
        recs.push({ equipo: 'Jet mill', razon: 'Producto submicrónico sin generar calor excesivo.' });
      }
      recs.push({ equipo: 'Molino de bolas', razon: 'Molienda fina industrial estándar.' });
      recs.push({ equipo: 'Molino coloidal / atrición', razon: 'Finos ultrafinos por cizalla.' });
    }

    // Wet/dry adjustments
    if (humedad === 'muy-humedo') {
      recs.unshift({
        equipo: 'Molienda húmeda (ball mill con agua)',
        razon: 'Alta humedad — la molienda húmeda evita apelmazamiento.',
      });
    } else if (humedad === 'humedo') {
      recs.push({ equipo: 'Considerar secado previo', razon: 'Humedad intermedia puede dar apelmazamiento.' });
    }

    // Thermal adjustments
    if (termico === 'sensible' && alim !== 'fina') {
      recs.unshift({
        equipo: 'Jet mill o molienda criogénica',
        razon: 'Material sensible al calor — evitar fricción que genere subida de temperatura.',
      });
    }

    return recs.slice(0, 5);
  }, [mohs, humedad, termico, alim]);

  return (
    <div className="my-6 not-prose rounded-xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
      <p className="font-semibold text-brand-dark mb-3">🎯 Explorador de selección de equipo</p>
      <p className="text-sm text-brand-gray mb-4">
        Configura las propiedades del material y el tamaño de alimentación. Verás equipos
        recomendados como primera aproximación.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-brand-gray font-semibold">
            Dureza Mohs: <span className="font-mono text-brand-dark">{mohs}</span>
          </span>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={mohs}
            onChange={(e) => setMohs(Number(e.target.value))}
            className="w-full accent-brand-yellow mt-1"
          />
          <div className="flex justify-between text-[10px] text-brand-gray mt-0.5">
            <span>1 talco</span>
            <span>5 apatita</span>
            <span>10 diamante</span>
          </div>
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-wider text-brand-gray font-semibold">Humedad</span>
          <select
            value={humedad}
            onChange={(e) => setHumedad(e.target.value as 'seco' | 'humedo' | 'muy-humedo')}
            className="w-full mt-1 border border-zinc-300 rounded px-2 py-1.5 text-sm"
          >
            <option value="seco">Seco (&lt; 2%)</option>
            <option value="humedo">Húmedo (2–10%)</option>
            <option value="muy-humedo">Muy húmedo (&gt; 10%)</option>
          </select>
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-wider text-brand-gray font-semibold">Sensibilidad térmica</span>
          <select
            value={termico}
            onChange={(e) => setTermico(e.target.value as 'normal' | 'sensible')}
            className="w-full mt-1 border border-zinc-300 rounded px-2 py-1.5 text-sm"
          >
            <option value="normal">Normal</option>
            <option value="sensible">Sensible al calor</option>
          </select>
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-wider text-brand-gray font-semibold">Tamaño de alimentación</span>
          <select
            value={alim}
            onChange={(e) => setAlim(e.target.value as 'gruesa' | 'media' | 'fina')}
            className="w-full mt-1 border border-zinc-300 rounded px-2 py-1.5 text-sm"
          >
            <option value="gruesa">Gruesa (&gt; 5 cm)</option>
            <option value="media">Media (1 mm – 5 cm)</option>
            <option value="fina">Fina (&lt; 1 mm)</option>
          </select>
        </label>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-brand-gray font-semibold mb-2">
          Equipos recomendados
        </p>
        <ol className="space-y-2">
          {recomendaciones.map((r, i) => (
            <li
              key={`${r.equipo}-${i}`}
              className="flex gap-3 items-start rounded-lg border border-zinc-200 p-3 bg-zinc-50"
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-yellow text-brand-dark text-xs font-bold shrink-0">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-brand-dark text-sm">{r.equipo}</p>
                <p className="text-xs text-brand-gray">{r.razon}</p>
              </div>
            </li>
          ))}
        </ol>
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
            Se desea moler <strong>100 t/h de caliza</strong> desde {String.raw`$F_{80} = 10$`} mm
            hasta {String.raw`$P_{80} = 100$`} µm en un molino de bolas. Para la caliza,{' '}
            {String.raw`$W_i = 11.6$`} kWh/t.
          </p>
          <p className="mt-2">
            <strong>Objetivo:</strong> calcular la energía específica $E$ y la potencia total
            que debe entregar el molino.
          </p>
        </>
      ),
    },
    {
      heading: '1. Datos y unidades',
      body: (
        <>
          <ul className="list-disc pl-5 space-y-1">
            <li>Caudal: {String.raw`$\dot m = 100$`} t/h.</li>
            <li>{String.raw`$F_{80} = 10 \text{ mm} = 10{,}000$`} µm.</li>
            <li>{String.raw`$P_{80} = 100$`} µm.</li>
            <li>{String.raw`$W_i = 11.6$`} kWh/t (caliza).</li>
          </ul>
          <p className="text-xs text-brand-gray italic mt-2">
            Importante: la ecuación de Bond usa {String.raw`$F_{80}$`} y {String.raw`$P_{80}$`} en
            <strong> micrómetros</strong>.
          </p>
        </>
      ),
    },
    {
      heading: '2. Aplicar la ecuación de Bond',
      body: (
        <>
          <p>
            {'$$E = W_i \\left[\\dfrac{10}{\\sqrt{P_{80}}} - \\dfrac{10}{\\sqrt{F_{80}}}\\right]$$'}
          </p>
        </>
      ),
    },
    {
      heading: '3. Calcular E',
      body: (
        <>
          <p>
            {'$$E = 11.6 \\left[\\dfrac{10}{\\sqrt{100}} - \\dfrac{10}{\\sqrt{10{,}000}}\\right] = 11.6 \\times (1 - 0.1) = 10.44 \\text{ kWh/t}$$'}
          </p>
          <p className="text-xs text-brand-gray italic mt-2">
            La energía específica es del orden de <strong>10 kWh/t</strong> — valor típico para
            molienda fina de caliza en la industria cementera.
          </p>
        </>
      ),
    },
    {
      heading: '4. Calcular la potencia total',
      body: (
        <>
          <p>
            {'$$P = E \\times \\dot m = 10.44 \\text{ kWh/t} \\times 100 \\text{ t/h} = 1{,}044 \\text{ kW} \\approx 1.04 \\text{ MW}$$'}
          </p>
          <p className="text-xs text-brand-gray italic mt-2">
            Esta es la potencia <strong>útil</strong> que entra al proceso de fractura — el motor
            del molino deberá ser mayor, dado que la transmisión y las pérdidas mecánicas
            introducen factores de seguridad de 1.3–1.5×.
          </p>
        </>
      ),
    },
    {
      heading: '5. Interpretación',
      body: (
        <>
          <p>
            Sin embargo, la eficiencia energética real de la conminución es del orden de{' '}
            <strong>1–2%</strong>: la energía realmente invertida en crear nueva superficie es
            una fracción mínima del total. Casi todo se convierte en <strong>calor</strong> (el
            molino sube de temperatura, a veces requiere enfriamiento) y en{' '}
            <strong>deformación elástica</strong> de la carga molturante.
          </p>
          <p className="mt-2 font-semibold text-brand-dark">
            Por eso la conminución es el <strong>mayor consumidor eléctrico</strong> de una
            planta minera típica — entre el 30% y el 60% del total.
          </p>
          <p className="text-xs text-brand-gray italic mt-3">
            <strong>Lección:</strong> dos estrategias para reducir el consumo: (1) no moler
            más fino de lo necesario, (2) clasificar y reciclar agresivamente el grueso para no
            remoler el fino que ya está en especificación.
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
const ReduccionTamano: React.FC = () => {
  const course = getCourseBySlug('iqya-2031');
  if (!course) return null;
  const reading = course.readings.find((r) => r.slug === 'reduccion-tamano');
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
                Esta lectura acompaña la sesión sobre <strong>reducción de tamaño</strong> — también
                llamada conminución — y sintetiza los principios, mecanismos, equipos y leyes
                energéticas que gobiernan el paso de trozos grandes de sólido a partículas
                controladas. Es una de las operaciones mecánicas más comunes en la industria y,
                paradójicamente, una de las menos eficientes energéticamente.
              </p>

              <InfoCallout title="📌 Aplicación al proyecto del curso">
                Si tu proyecto involucra la reducción de tamaño de un material, deberás investigar
                sus propiedades y seleccionar un tipo de equipo adecuado. Además, tendrás que
                justificar la elección del equipo y, si es posible,
                <strong> estimar la energía requerida</strong> utilizando alguna de las leyes de
                conminución. <strong>Bond</strong> es la más recomendada para estimaciones
                preliminares siempre que se pueda obtener o asumir un {String.raw`$W_i$`}.
              </InfoCallout>
            </>
          )}

          {isVisible('objetivo') && (
            <>
              <SectionTitle id="objetivo">¿Por qué rompemos las cosas?</SectionTitle>
              <p>
                La <strong>reducción de tamaño</strong>, o <strong>conminución</strong>, es una
                operación unitaria que transforma materiales sólidos en partículas más
                pequeñas. Sus objetivos principales son:
              </p>
              <ul>
                <li>
                  <strong>Aumentar el área superficial:</strong> esencial para acelerar
                  reacciones químicas heterogéneas (sólido–fluido), mejorar procesos de
                  disolución, lixiviación o la eficiencia de catalizadores sólidos.
                </li>
                <li>
                  <strong>Obtener un tamaño de partícula específico:</strong> muchos productos
                  finales o intermedios requieren un tamaño definido para cumplir con
                  especificaciones de calidad, de mercado o de la siguiente etapa del proceso
                  (cemento, pigmentos, harinas, productos farmacéuticos).
                </li>
                <li>
                  <strong>Liberar componentes valiosos:</strong> en minería se muele la roca
                  para liberar los minerales de interés de la ganga (material estéril).
                </li>
                <li>
                  <strong>Facilitar el manejo y transporte:</strong> partículas más pequeñas y
                  uniformes son más fáciles de transportar neumáticamente o de mezclar.
                </li>
                <li>
                  <strong>Mejorar propiedades del producto:</strong> como la textura en
                  alimentos o la capacidad de compactación en la industria farmacéutica.
                </li>
              </ul>

              <TipCallout title="💡 El poder del área superficial">
                Para una partícula esférica, el área específica por unidad de volumen escala
                como {String.raw`$a_v \propto 1/D$`}. Reducir de <strong>50 mm a 100 µm</strong>{' '}
                — un factor de 500 en diámetro — multiplica el área superficial disponible por{' '}
                <strong>~500 veces</strong>. Esta es la razón profunda por la cual la molienda
                es irreemplazable en hidrometalurgia, en catálisis heterogénea y en la
                liberación de activos farmacéuticos: sin esa superficie, la cinética de los
                procesos posteriores se vuelve prohibitivamente lenta.
              </TipCallout>

              <TipCallout>
                La reducción de tamaño <strong>raramente</strong> produce partículas de un solo
                tamaño. El producto siempre es una <strong>distribución</strong> de tamaños de
                partícula, que debe ser caracterizada (tamizado, análisis de imagen,
                difracción láser, etc.) para saber si cumple con la especificación.
              </TipCallout>
            </>
          )}

          {isVisible('mecanismos') && (
            <>
              <SectionTitle id="mecanismos">Mecanismos de fractura</SectionTitle>
              <p>
                Para reducir el tamaño de un sólido hay que aplicar un esfuerzo que supere su
                resistencia a la fractura. Los cuatro mecanismos fundamentales son{' '}
                <strong>compresión</strong>, <strong>impacto</strong>, <strong>atrición</strong>
                {' '}y <strong>corte</strong>. Navega entre ellos con las pestañas:
              </p>

              <MechanismsTabs />

              <InfoCallout>
                En la mayoría de los equipos industriales, estos mecanismos actúan de forma
                <strong> combinada</strong>, aunque uno suele ser el predominante según el
                diseño del equipo y las propiedades del material.
              </InfoCallout>

              <TipCallout title="💡 Liberación mineralógica — el criterio de parar">
                En minería, uno no muele hasta un tamaño arbitrario: se muele hasta el{' '}
                <strong>tamaño de liberación</strong>, el tamaño al que las partículas de
                mineral valioso quedan mayoritariamente separadas de la ganga. Moler{' '}
                <em>más fino</em> que el tamaño de liberación gasta energía sin aportar
                beneficio metalúrgico y además incrementa el <strong>slimes</strong> (ultrafinos
                difíciles de recuperar por flotación). Esta es una de las decisiones económicas
                más importantes del diseño de una planta concentradora.
              </TipCallout>
            </>
          )}

          {isVisible('equipos') && (
            <>
              <SectionTitle id="equipos">Equipos de reducción de tamaño</SectionTitle>
              <p>
                La elección del equipo adecuado es fundamental y depende de múltiples
                factores. Una forma común de clasificarlos es por el{' '}
                <strong>tamaño de producto</strong> que generan: trituradoras (reducción
                gruesa), molinos (intermedia y fina), ultrafinos y cortadoras. Explora cada
                grupo y haz clic en cada equipo para ver descripción, aplicaciones y
                visualización.
              </p>

              <EquipmentSelector />

              <SubTitle>Tabla resumen — relación de reducción por equipo</SubTitle>
              <ReductionRatioTable />

              <InfoCallout title="📌 ¿Por qué se necesitan varias etapas?">
                Ningún equipo puede llevar un bloque de 1 m directamente a 100 µm —
                relaciones de reducción de 10⁴:1 son imposibles en una sola máquina. Por eso
                las plantas industriales se diseñan en <strong>cascada</strong>: trituración
                primaria → secundaria → molienda gruesa (barras) → molienda fina (bolas) →
                eventualmente ultrafina (jet o stirred mill). Cada etapa aplica una relación
                de reducción que cae en su rango óptimo.
              </InfoCallout>
            </>
          )}

          {isVisible('leyes') && (
            <>
              <SectionTitle id="leyes">Eficiencia energética y leyes de la conminución</SectionTitle>
              <p>
                La reducción de tamaño es una operación con <strong>baja eficiencia
                energética</strong> — en la industria suele ser{' '}
                <strong>inferior al 2%</strong>, porque la mayor parte de la energía
                suministrada se disipa como <strong>calor y deformación elástica</strong> en
                el sólido y en el equipo. Para estimar la energía requerida se usan tres
                leyes empíricas clásicas y una formulación generalizada que las reconcilia.
              </p>

              <LawsComparisonTabs />

              <div className="my-8 rounded-xl overflow-hidden border border-zinc-200 shadow-sm not-prose">
                <div className="grid lg:grid-cols-[220px_1fr]">
                  {/* Panel izquierdo: número grande de eficiencia */}
                  <div className="bg-brand-dark text-white p-6 flex flex-col justify-center items-center text-center">
                    <p className="text-xs uppercase tracking-widest text-zinc-400 mb-1">Eficiencia termodinámica</p>
                    <p className="text-6xl font-bold text-brand-yellow leading-none">1-2<span className="text-3xl">%</span></p>
                    <p className="text-xs text-zinc-300 mt-3 leading-relaxed">
                      Energía invertida vs. energía de superficie creada ({String.raw`$\gamma \cdot \Delta A$`}).
                      El resto es calor, vibración y deformación elástica.
                    </p>
                  </div>
                  {/* Panel derecho: estrategias para mejorar */}
                  <div className="bg-white p-6">
                    <p className="text-xs uppercase tracking-widest text-brand-yellow-dark font-bold mb-3">
                      Tres palancas para mejorar la eficiencia
                    </p>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-yellow text-brand-dark font-bold text-sm flex items-center justify-center">1</span>
                        <p className="text-sm text-brand-dark leading-snug">
                          <strong>No moler de más</strong> — clasifica y separa el fino antes de moler; no gastes energía en partículas que ya están en especificación.
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-yellow text-brand-dark font-bold text-sm flex items-center justify-center">2</span>
                        <p className="text-sm text-brand-dark leading-snug">
                          <strong>Elige el mecanismo correcto</strong> — compresión para duros frágiles, impacto para frágiles de dureza media, atrición para finos, corte para blandos/fibrosos.
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-yellow text-brand-dark font-bold text-sm flex items-center justify-center">3</span>
                        <p className="text-sm text-brand-dark leading-snug">
                          <strong>Integra etapas en cascada</strong> — cada equipo trabajando en su rango óptimo de reducción, sin forzar relaciones de reducción extremas.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Barra inferior con leyes → rango */}
                <div className="bg-zinc-50 border-t border-zinc-200 p-4">
                  <p className="text-xs text-brand-gray mb-2">
                    <strong className="text-brand-dark">Rango de aplicación de cada ley:</strong>
                  </p>
                  <div className="relative h-8 rounded-md bg-gradient-to-r from-sky-100 via-yellow-100 to-red-100 overflow-hidden">
                    <div className="absolute inset-0 flex items-center text-[11px] font-semibold text-brand-dark">
                      <span className="flex-1 text-center">Kick (cm → mm)</span>
                      <span className="w-px h-full bg-brand-gray/30" />
                      <span className="flex-1 text-center">Bond (mm → 100 µm)</span>
                      <span className="w-px h-full bg-brand-gray/30" />
                      <span className="flex-1 text-center">Rittinger (&lt; 100 µm)</span>
                    </div>
                  </div>
                  <p className="text-xs text-brand-gray italic mt-2 text-center">
                    Hukki unifica las tres como casos particulares de una misma ecuación diferencial.
                  </p>
                </div>
              </div>
            </>
          )}

          {isVisible('ejemplo') && (
            <>
              <SectionTitle id="ejemplo">Ejemplo resuelto: energía de molienda con Bond</SectionTitle>
              <p>
                Aplicamos la ley de Bond a un caso típico de cementera / cantera. Haz clic en{' '}
                <em>Mostrar siguiente paso</em> para avanzar — intenta calcular primero y
                compara.
              </p>
              <WorkedExample />
            </>
          )}

          {isVisible('factores') && (
            <>
              <SectionTitle id="factores">Factores operativos y criterios de selección</SectionTitle>
              <p>
                Además de las leyes energéticas, varios factores influyen fuertemente en la
                operación y selección del equipo.
              </p>

              <SubTitle>Propiedades del material</SubTitle>
              <MaterialPropertyCards />

              <Figure
                src="/classroom/iqya-2031/readings/reduccion-tamano-09.jpeg"
                alt="Referencia de dureza de materiales"
                caption="Escala de dureza — referencia para evaluar qué equipo usar."
                maxWidth="600px"
              />

              <SubTitle>Molienda seca vs. molienda húmeda</SubTitle>
              <p>
                Una decisión transversal muy importante: la molienda puede realizarse en seco o
                con el material suspendido en agua (o en otro líquido). Cada modo tiene
                ventajas y limitaciones.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 my-4 not-prose">
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">Molienda seca</h4>
                  <p className="text-xs text-brand-gray leading-relaxed mb-2">
                    <strong className="text-emerald-600">Ventajas:</strong> producto seco listo
                    para empaque/transporte; sin efluentes líquidos; útil cuando el material es
                    sensible al agua (cemento, cal).
                  </p>
                  <p className="text-xs text-brand-gray leading-relaxed">
                    <strong className="text-red-600">Desventajas:</strong> requiere captación
                    de polvo; mayor desgaste; menor eficiencia de impacto (partículas rebotan);
                    calentamiento.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">Molienda húmeda</h4>
                  <p className="text-xs text-brand-gray leading-relaxed mb-2">
                    <strong className="text-emerald-600">Ventajas:</strong> mayor eficiencia
                    energética (el agua amortigua y evacua finos); sin emisión de polvo; ideal
                    para acoplar con flotación o lixiviación aguas abajo.
                  </p>
                  <p className="text-xs text-brand-gray leading-relaxed">
                    <strong className="text-red-600">Desventajas:</strong> requiere manejo de
                    pulpa y desaguado (filtros, espesadores); corrosión; el producto sale
                    húmedo y debe secarse si es necesario.
                  </p>
                </div>
              </div>

              <SubTitle>Variables de proceso</SubTitle>
              <ul>
                <li>
                  <strong>Tamaño de alimentación y producto deseado</strong> — define la
                  relación de reducción y, con ello, el tipo y número de etapas.
                </li>
                <li>
                  <strong>Capacidad requerida</strong> (toneladas por hora).
                </li>
                <li>
                  <strong>Especificaciones del producto:</strong> distribución de tamaño
                  ({String.raw`$d_{50}$, $d_{80}$`}, % pasante en malla), forma de partícula.
                </li>
                <li>
                  <strong>Costos:</strong> de capital (equipo) y operativos (energía,
                  mantenimiento, medios de molienda, revestimientos).
                </li>
              </ul>

              <SubTitle>Explorador interactivo</SubTitle>
              <p>
                Configura las propiedades del material y obtendrás una lista de equipos
                recomendados como punto de partida. No reemplaza un análisis detallado, pero
                ayuda a acotar rápidamente las opciones razonables.
              </p>

              <MaterialPropertiesExplorer />
            </>
          )}

          {isVisible('consejos') && (
            <>
              <SectionTitle id="consejos">Consejos prácticos para el proyecto</SectionTitle>
              <p>
                A partir de la práctica industrial, tres recomendaciones transversales
                resultan especialmente útiles cuando uno enfrenta por primera vez un problema
                de conminución:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    1. Caracterizar bien el material
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Es fundamental conocer la <strong>dureza</strong>, la estructura y, si es
                    posible, el <strong>Índice de Trabajo de Bond</strong> de la alimentación.
                    Sin esa información, cualquier estimación energética es solo una
                    conjetura.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    2. Selección inteligente del equipo
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    No basta con buscar algo que "rompa" el material. Hay que considerar la
                    <strong> eficiencia</strong>, el producto final deseado y los{' '}
                    <strong>costos</strong> totales (capital + operación + mantenimiento).
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5 sm:col-span-2">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    3. Pensar en el circuito completo
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    La reducción de tamaño casi nunca viaja sola: suele ir acompañada de
                    etapas de <strong>clasificación</strong> (tamizado, ciclones) que reciclan
                    el material grueso y dejan salir solo el fino. El diseño debe ser
                    <strong> integral</strong> — equipo de reducción + clasificador +
                    recirculación.
                  </p>
                </div>
              </div>

              <InfoCallout>
                Para el proyecto del curso, piensa la conminución como un{' '}
                <strong>sistema</strong>, no como un equipo aislado: cómo llega el material,
                cómo se alimenta, cómo sale, cómo se clasifica y qué hacer con el rechazo.
              </InfoCallout>
            </>
          )}

          {isVisible('bibliografia') && (
            <>
              <SectionTitle id="bibliografia">Bibliografía recomendada</SectionTitle>
              <ul className="text-sm text-brand-gray leading-relaxed">
                <li>
                  McCabe, W. L., Smith, J. C., &amp; Harriott, P. (2005).
                  <em> Unit Operations of Chemical Engineering</em> (7th ed.). McGraw-Hill —
                  Capítulo 28: Size reduction.
                </li>
                <li>
                  Wills, B. A., &amp; Finch, J. A. (2015). <em>Wills' Mineral Processing
                  Technology</em> (8th ed.). Butterworth-Heinemann.
                </li>
                <li>
                  Geankoplis, C. J. (2003). <em>Transport Processes and Separation Process
                  Principles</em> (4th ed.). Prentice Hall.
                </li>
                <li>
                  Bond, F. C. (1952). The third theory of comminution. <em>Transactions AIME</em>,
                  193, 484–494.
                </li>
                <li>
                  Hukki, R. T. (1961). Proposal for a solomonic settlement between the theories
                  of von Rittinger, Kick and Bond. <em>Transactions AIME</em>, 220, 403–408.
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </ReadingLayout>
  );
};

export default ReduccionTamano;
