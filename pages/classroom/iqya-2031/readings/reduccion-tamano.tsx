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

/* ─── TOC ─── */
const tocItems = [
  { id: 'objetivo', label: '¿Por qué rompemos las cosas?' },
  { id: 'mecanismos', label: 'Mecanismos de fractura' },
  { id: 'equipos', label: 'Equipos' },
  { id: 'leyes', label: 'Leyes de la conminución' },
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

/* ─── Figura ─── */
const Figure: React.FC<{ src: string; alt: string; caption?: string; maxWidth?: string }> = ({
  src,
  alt,
  caption,
  maxWidth = '720px',
}) => (
  <figure className="my-8 not-prose">
    <img
      src={src}
      alt={alt}
      className="rounded-xl shadow-lg mx-auto"
      style={{ maxWidth, width: '100%' }}
    />
    {caption && (
      <figcaption className="text-center text-sm text-brand-gray mt-3">{caption}</figcaption>
    )}
  </figure>
);

/* ─── Componente principal ─── */
const ReduccionTamano: React.FC = () => {
  const course = getCourseBySlug('iqya-2031');
  if (!course) return null;
  const reading = course.readings.find((r) => r.slug === 'reduccion-tamano');
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
            preliminares siempre que se pueda obtener o asumir un <em>W<sub>i</sub></em>.
          </InfoCallout>

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
                resistencia a la fractura. Los cuatro mecanismos fundamentales son:
              </p>

              <SubTitle>1. Compresión</SubTitle>
              <p>
                Se aplican fuerzas opuestas que aplastan el material. Es el mecanismo
                dominante en la <strong>reducción gruesa</strong> de materiales duros y
                frágiles.
              </p>
              <p>
                <strong>Equipos típicos:</strong> trituradoras de mandíbula, trituradoras
                giratorias, rodillos de trituración.
              </p>

              <SubTitle>2. Impacto</SubTitle>
              <p>
                Implica un <strong>golpe súbito y de alta velocidad</strong>. Las partículas se
                rompen debido a la energía cinética transferida. Eficaz para materiales duros
                y algunos de dureza media.
              </p>
              <p>
                <strong>Equipos típicos:</strong> molinos de martillos, molinos de impacto.
              </p>

              <SubTitle>3. Atrición (o frotamiento / cizalladura)</SubTitle>
              <p>
                Se produce cuando las partículas se rozan entre sí o contra las superficies
                del equipo, generando fuerzas de cizalla que desgastan las superficies.
                Predomina en la <strong>molienda fina</strong>.
              </p>
              <p>
                <strong>Equipos típicos:</strong> molinos de discos, molinos de bolas, molinos
                de barras, molinos coloidales.
              </p>

              <SubTitle>4. Corte</SubTitle>
              <p>
                Se aplica una fuerza de corte directa, como con cuchillas. Es más adecuado
                para materiales <strong>blandos, fibrosos o plásticos</strong>.
              </p>
              <p>
                <strong>Equipos típicos:</strong> cortadoras rotativas, granuladores.
              </p>

              <InfoCallout>
                En la mayoría de los equipos industriales, estos mecanismos actúan de forma
                <strong> combinada</strong>, aunque uno suele ser el predominante según el
                diseño del equipo y las propiedades del material.
              </InfoCallout>

              <Figure
                src="/classroom/iqya-2031/readings/reduccion-tamano-01.jpeg"
                alt="Resumen de los mecanismos de fractura: compresión, impacto, atrición y corte"
                caption="Los cuatro mecanismos de fractura actuando sobre un sólido particulado."
              />
            </>
          )}

          {isVisible('equipos') && (
            <>
              <SectionTitle id="equipos">Equipos de reducción de tamaño</SectionTitle>
              <p>
                La elección del equipo adecuado es fundamental y depende de múltiples
                factores. Una forma común de clasificarlos es por el{' '}
                <strong>tamaño de producto</strong> que generan.
              </p>

              <SubTitle>Trituradoras — reducción gruesa</SubTitle>
              <p>
                Utilizadas para la <strong>reducción primaria</strong> de grandes trozos de
                material (desde varios metros hasta unos pocos centímetros). Principalmente
                usan <strong>compresión</strong>.
              </p>

              <SubSubTitle>Trituradoras de mandíbula (jaw crushers)</SubSubTitle>
              <p>
                Una mandíbula fija y una móvil que se acerca y aleja, comprimiendo el
                material. Tipos:
              </p>
              <ul>
                <li><strong>Blake:</strong> pivote superior.</li>
                <li><strong>Dodge:</strong> pivote inferior.</li>
                <li><strong>De movimiento excéntrico</strong>.</li>
              </ul>
              <ul>
                <li><strong>Aplicaciones:</strong> rocas duras y abrasivas, minerales, escorias.</li>
                <li><strong>Relación de reducción típica:</strong> 3:1 a 7:1.</li>
              </ul>
              <Figure
                src="/classroom/iqya-2031/readings/reduccion-tamano-02.gif"
                alt="Trituradora de mandíbula en operación"
                caption="Trituradora de mandíbula (jaw crusher)."
                maxWidth="560px"
              />

              <SubSubTitle>Trituradoras giratorias (gyratory crushers)</SubSubTitle>
              <p>
                Un <strong>cono de trituración</strong> que gira excéntricamente dentro de una
                carcasa cónica fija. Alimentación por la parte superior, descarga por la
                inferior.
              </p>
              <ul>
                <li><strong>Aplicaciones:</strong> grandes capacidades, rocas muy duras, minería primaria.</li>
                <li><strong>Relación de reducción típica:</strong> hasta 8:1.</li>
              </ul>
              <Figure
                src="/classroom/iqya-2031/readings/reduccion-tamano-03.gif"
                alt="Trituradora giratoria en operación"
                caption="Trituradora giratoria (gyratory crusher)."
                maxWidth="560px"
              />

              <SubSubTitle>Trituradoras de rodillos (crushing rolls)</SubSubTitle>
              <p>
                <strong>Dos rodillos</strong> que giran en direcciones opuestas, atrapando y
                comprimiendo el material entre ellos. Pueden ser lisos o dentados.
              </p>
              <ul>
                <li>
                  <strong>Aplicaciones:</strong> materiales de dureza media a baja, no muy
                  abrasivos (carbón, yeso, arcilla).
                </li>
              </ul>
              <Figure
                src="/classroom/iqya-2031/readings/reduccion-tamano-04.gif"
                alt="Trituradora de rodillos en operación"
                caption="Trituradora de rodillos (crushing rolls)."
                maxWidth="560px"
              />

              <SubTitle>Molinos — reducción intermedia y fina</SubTitle>
              <p>
                Toman la descarga de las trituradoras o materiales más pequeños y los reducen
                a <strong>polvos</strong> (desde centímetros hasta micrones). Combinan
                <strong> impacto y atrición</strong>.
              </p>

              <SubSubTitle>Molinos de martillos (hammer mills)</SubSubTitle>
              <p>
                Rotores con <strong>martillos pivotantes</strong> que giran a alta velocidad,
                golpeando el material contra placas rompedoras y una rejilla de descarga.
              </p>
              <ul>
                <li>
                  <strong>Aplicaciones:</strong> materiales frágiles, fibrosos, de dureza baja
                  a media (carbón, piedra caliza, fosfatos, alimentos secos, madera).
                </li>
              </ul>
              <Figure
                src="/classroom/iqya-2031/readings/reduccion-tamano-05.gif"
                alt="Molino de martillos en operación"
                caption="Molino de martillos (hammer mill)."
                maxWidth="560px"
              />

              <SubSubTitle>Molinos de atrición (attrition / disc mills)</SubSubTitle>
              <p>
                Uno o dos <strong>discos rotatorios</strong> con superficies abrasivas o
                dentadas. El material se muele en el espacio entre los discos.
              </p>
              <ul>
                <li>
                  <strong>Aplicaciones:</strong> molienda fina de materiales blandos a
                  semiduros (granos, especias, pigmentos).
                </li>
              </ul>
              <Figure
                src="/classroom/iqya-2031/readings/reduccion-tamano-06.jpeg"
                alt="Molino de atrición / discos"
                caption="Molino de atrición (disc mill)."
                maxWidth="560px"
              />

              <SubSubTitle>Molinos de volteo (tumbling mills)</SubSubTitle>
              <p>
                Cilindros horizontales que giran sobre su eje, conteniendo{' '}
                <strong>medios de molienda</strong> (bolas, barras, guijarros) que caen y
                golpean / frotan el material.
              </p>
              <ul>
                <li>
                  <strong>Molinos de bolas:</strong> usan bolas de acero o cerámica. Producen
                  un producto muy fino.
                </li>
                <li>
                  <strong>Molinos de barras:</strong> usan barras de acero. Producen un
                  producto más grueso y con menos finos que los molinos de bolas.
                </li>
                <li>
                  <strong>Aplicaciones:</strong> materiales duros y abrasivos (minerales,
                  cemento, cerámica).
                </li>
              </ul>
              <Figure
                src="/classroom/iqya-2031/readings/reduccion-tamano-07.gif"
                alt="Molino de bolas en operación"
                caption="Molino de bolas (ball mill) — un molino de volteo con medios esféricos."
                maxWidth="560px"
              />

              <SubTitle>Molinos ultrafinos y cortadoras</SubTitle>
              <p>
                Para obtener partículas en el rango <strong>micrométrico</strong> o para
                materiales que requieren un <strong>corte preciso</strong>.
              </p>

              <SubSubTitle>Molinos de energía de fluido (jet mills)</SubSubTitle>
              <p>
                Las partículas son aceleradas por <strong>chorros de gas a alta velocidad</strong>{' '}
                (aire o vapor) y chocan entre sí o contra una superficie. Producen partículas
                muy finas (submicrónicas) sin contaminación por medios de molienda.
              </p>
              <ul>
                <li>
                  <strong>Aplicaciones:</strong> materiales sensibles al calor, productos
                  farmacéuticos, pigmentos, cerámicas finas.
                </li>
              </ul>
              <VideoEmbed id="J0WEeE_I1i0" title="Jet mill en operación" />

              <SubSubTitle>Cortadoras rotativas (rotary cutters / knife mills)</SubSubTitle>
              <p>
                <strong>Cuchillas montadas en un rotor</strong> que cortan el material contra
                cuchillas fijas.
              </p>
              <ul>
                <li>
                  <strong>Aplicaciones:</strong> materiales blandos, elásticos o fibrosos
                  (plásticos, caucho, papel, textiles, productos alimenticios).
                </li>
              </ul>
              <VideoEmbed id="Lz_FFXp6678" title="Knife mill / cortadora rotativa en operación" />
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
                leyes empíricas clásicas.
              </p>

              <SubTitle>Ley de Rittinger</SubTitle>
              <p>
                Postula que la energía requerida $E$ es proporcional a la{' '}
                <strong>nueva área superficial creada</strong>. Se ajusta mejor a la{' '}
                <strong>molienda fina</strong>, donde se genera mucha superficie nueva:
              </p>
              <p>
                {'$$E = K_R\\left(\\dfrac{1}{x_2} - \\dfrac{1}{x_1}\\right)$$'}
              </p>
              <p>
                Donde $x_1$ y $x_2$ son los tamaños promedio inicial y final de partícula, y
                $K_R$ es una constante empírica característica del material y del equipo.
              </p>

              <SubTitle>Ley de Kick</SubTitle>
              <p>
                Sugiere que la energía $E$ es proporcional a la <strong>relación de
                reducción</strong>. Se ajusta mejor a la <strong>trituración gruesa</strong>:
              </p>
              <p>
                {'$$E = K_K \\log\\dfrac{x_2}{x_1}$$'}
              </p>
              <p>
                Donde $K_K$ es una constante empírica del material.
              </p>

              <SubTitle>Ley de Bond (la más utilizada industrialmente)</SubTitle>
              <p>
                Introduce el concepto de <strong>Índice de Trabajo de Bond</strong> $W_i$, que
                representa la energía específica (en kWh / tonelada) necesaria para reducir un
                material desde un tamaño teóricamente infinito hasta que el <strong>80%</strong>{' '}
                del producto pase por un tamiz de <strong>100 µm</strong>. La ecuación de Bond
                es:
              </p>
              <p>
                {'$$E = W_i \\left[\\dfrac{10}{\\sqrt{P_{80}}} - \\dfrac{10}{\\sqrt{F_{80}}}\\right]$$'}
              </p>
              <ul>
                <li>
                  $E$: energía específica consumida (kWh / tonelada de material).
                </li>
                <li>
                  $W_i$: Índice de Trabajo de Bond del material (kWh / tonelada). Se determina
                  experimentalmente.
                </li>
                <li>
                  $P_{'{80}'}$: tamaño de partícula (en µm) por el cual pasa el 80% del{' '}
                  <strong>producto</strong> molido.
                </li>
                <li>
                  $F_{'{80}'}$: tamaño de partícula (en µm) por el cual pasa el 80% de la{' '}
                  <strong>alimentación</strong> al equipo.
                </li>
              </ul>
              <p>
                Esta ley se usa ampliamente para el <strong>dimensionamiento</strong> de
                molinos de bolas y barras y para comparar la eficiencia de diferentes
                circuitos de molienda.
              </p>

              <Figure
                src="/classroom/iqya-2031/readings/reduccion-tamano-08.png"
                alt="Tabla del Índice de Trabajo de Bond para distintos materiales"
                caption="Índice de trabajo para distintos materiales."
                maxWidth="720px"
              />

              <TipCallout title="💡 ¿Cuál ley usar?">
                Una regla rápida: <strong>Kick</strong> para trituración gruesa, <strong>Bond</strong>{' '}
                para molienda intermedia (rango de operación industrial típico) y{' '}
                <strong>Rittinger</strong> para molienda fina. Bond es, con diferencia, la más
                usada porque cubre el rango de tamaños que domina la industria minera.
              </TipCallout>
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
              <ul>
                <li>
                  <strong>Dureza:</strong> materiales muy duros requieren equipos robustos y
                  mayor energía.
                </li>
                <li>
                  <strong>Friabilidad:</strong> facilidad con la que un material se fractura.
                </li>
                <li>
                  <strong>Abrasividad:</strong> causa desgaste en los equipos (piezas de
                  repuesto, revestimientos).
                </li>
                <li>
                  <strong>Contenido de humedad:</strong> puede causar apelmazamiento o
                  dificultar la molienda en seco. A veces se opta por <strong>molienda
                  húmeda</strong>.
                </li>
                <li>
                  <strong>Sensibilidad al calor:</strong> algunos materiales se degradan o
                  funden, requiriendo enfriamiento (típico en farma y polímeros).
                </li>
                <li>
                  <strong>Pegajosidad:</strong> puede causar obstrucciones y adherencias.
                </li>
              </ul>

              <Figure
                src="/classroom/iqya-2031/readings/reduccion-tamano-09.jpeg"
                alt="Referencia de dureza de materiales"
                caption="Escala de dureza — referencia para evaluar qué equipo usar."
                maxWidth="640px"
              />

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
                  <strong>Especificaciones del producto:</strong> distribución de tamaño,
                  forma de partícula.
                </li>
                <li>
                  <strong>Costos:</strong> de capital (equipo) y operativos (energía,
                  mantenimiento, desgaste de partes).
                </li>
              </ul>
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
              </ul>
            </>
          )}
        </div>
      </div>
    </ReadingLayout>
  );
};

export default ReduccionTamano;
