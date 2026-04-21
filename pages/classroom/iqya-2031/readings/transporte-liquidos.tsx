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
  { id: 'introduccion', label: 'Introducción' },
  { id: 'propiedades', label: 'Propiedades del fluido' },
  { id: 'perdidas', label: 'Pérdidas en tuberías' },
  { id: 'desafios', label: 'Desafíos de diseño' },
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

/* ─── Figura con caption ─── */
const Figure: React.FC<{ src: string; alt: string; caption?: string; maxWidth?: string }> = ({
  src,
  alt,
  caption,
  maxWidth,
}) => (
  <figure className="my-8 not-prose">
    <img
      src={src}
      alt={alt}
      className="rounded-xl shadow-lg mx-auto"
      style={maxWidth ? { maxWidth } : undefined}
    />
    {caption && (
      <figcaption className="text-center text-sm text-brand-gray mt-3">{caption}</figcaption>
    )}
  </figure>
);

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
            Esta lectura acompaña la sesión sobre <strong>transporte de líquidos</strong> en la
            industria. Revisaremos las propiedades del fluido que gobiernan su flujo, cómo se
            cuantifican las pérdidas de energía en tuberías, y los principales desafíos que
            enfrenta un ingeniero al diseñar un sistema de transporte. El material es la base
            sobre la cual construiremos, en la siguiente sesión, el estudio de las bombas.
          </p>

          <figure className="my-8 not-prose">
            <img
              src="/classroom/iqya-2031/readings/transporte-liquidos-01.gif"
              alt="Transporte de líquidos en la industria"
              className="rounded-xl shadow-lg mx-auto"
            />
            <figcaption className="text-center text-sm text-brand-gray mt-3">
              El transporte de líquidos conecta todas las etapas del proceso industrial: desde
              la alimentación de materias primas hasta la distribución del producto final.
            </figcaption>
          </figure>

          <InfoCallout title="📌 Aplicación al proyecto del curso">
            Si tu proyecto incluye el transporte de un líquido entre equipos o desde/hacia
            almacenamiento, para esta parte deberás:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Caracterizar el fluido:</strong> determinar o estimar su densidad,
                viscosidad y presión de vapor a la temperatura de operación.
              </li>
              <li>
                <strong>Diseñar la línea de tubería:</strong> proponer un diámetro y material
                para la tubería, y estimar su longitud y los accesorios necesarios.
              </li>
              <li>
                <strong>Calcular las pérdidas de presión totales</strong> ($h_L$) en la línea
                diseñada.
              </li>
              <li>
                <strong>Estimar la cabeza total del sistema</strong> que una bomba necesitaría
                vencer, considerando cambios de elevación, presiones en los puntos inicial y
                final, además de $h_L$.
              </li>
            </ul>
          </InfoCallout>

          {isVisible('introduccion') && (
            <>
              <SectionTitle id="introduccion">
                La operación unitaria silenciosa pero fundamental
              </SectionTitle>
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
              <SectionTitle id="propiedades">
                Propiedades del fluido que rigen el transporte
              </SectionTitle>
              <p>
                Las características del líquido que se transporta son determinantes para el
                diseño y la operación del sistema. Las tres propiedades más importantes son la
                densidad, la viscosidad y la presión de vapor.
              </p>

              <SubTitle>Densidad ($\rho$)</SubTitle>
              <p>
                Masa por unidad de volumen (kilogramos por metro cúbico).
              </p>
              <p>
                <strong>Importancia:</strong>
              </p>
              <ul>
                <li>
                  Afecta la presión hidrostática $P = \rho g h$, especialmente cuando hay
                  cambios de elevación.
                </li>
                <li>Influye en la potencia que requieren las bombas.</li>
                <li>
                  En líquidos, la densidad varía principalmente con la temperatura (disminuye
                  al calentarse) y muy poco con la presión, ya que los líquidos son casi
                  incompresibles.
                </li>
              </ul>

              <Figure
                src="/classroom/iqya-2031/readings/transporte-liquidos-02.gif"
                alt="Variación de la densidad con la temperatura"
                caption="La densidad de los líquidos disminuye a medida que aumenta la temperatura."
              />

              <SubTitle>Viscosidad ($\mu$, $\nu$)</SubTitle>
              <p>
                Resistencia de un fluido a fluir. Se distinguen dos formas:
              </p>
              <ul>
                <li>
                  <strong>Viscosidad dinámica ($\mu$):</strong> pascal-segundo (Pa·s) o
                  centipoise (cP).
                </li>
                <li>
                  <strong>Viscosidad cinemática ($\nu = \mu / \rho$):</strong> metros
                  cuadrados por segundo (m²/s) o centistokes (cSt).
                </li>
              </ul>
              <p>
                <strong>Importancia:</strong>
              </p>
              <ul>
                <li>
                  Constituye el factor principal de las pérdidas de energía por fricción en
                  las tuberías.
                </li>
                <li>Afecta la selección del tipo de bomba y la potencia requerida.</li>
                <li>
                  La viscosidad disminuye notablemente con el aumento de temperatura,
                  especialmente en hidrocarburos pesados. Por ello, a menudo es necesario
                  calentar el fluido para facilitar su bombeo.
                </li>
              </ul>

              <Figure
                src="/classroom/iqya-2031/readings/transporte-liquidos-03.gif"
                alt="Variación de la viscosidad con la temperatura"
                caption="La viscosidad disminuye de forma marcada al aumentar la temperatura, especialmente en hidrocarburos pesados."
              />

              <SubTitle>Presión de vapor ({String.raw`$P_{'{\\text{vap}}'}$`})</SubTitle>
              <p>
                Presión a la cual un líquido se vaporiza (entra en ebullición) a una temperatura
                específica (pascales o milímetros de mercurio).
              </p>
              <p>
                <strong>Importancia:</strong>
              </p>
              <ul>
                <li>
                  Fundamental para <strong>prevenir la cavitación</strong> en las bombas.
                  Cuando la presión en la succión de la bomba cae por debajo de la
                  {String.raw`$P_{'{\\text{vap}}'}$`} del líquido a la temperatura de bombeo, se forman
                  burbujas de vapor que, al colapsar violentamente, dañan el equipo y reducen
                  su eficiencia.
                </li>
                <li>
                  Aumenta con la temperatura. Es crucial conocer la {String.raw`$P_{'{\\text{vap}}'}$`} a la
                  temperatura de operación.
                </li>
              </ul>

              <Figure
                src="/classroom/iqya-2031/readings/transporte-liquidos-04.png"
                alt="Cavitación en bombas"
                caption="Cavitación: cuando la presión local cae por debajo de la presión de vapor, se forman y colapsan burbujas que erosionan el impulsor."
              />

              <Figure
                src="/classroom/iqya-2031/readings/transporte-liquidos-05.jpeg"
                alt="Curva de presión de vapor"
                caption="La presión de vapor aumenta de forma no lineal con la temperatura."
              />

              <Figure
                src="/classroom/iqya-2031/readings/transporte-liquidos-06.png"
                alt="Gráfica de presión"
                caption="Mapa de presión a lo largo de un sistema de transporte: la presión mínima debe mantenerse por encima de la presión de vapor del líquido."
              />

              <InfoCallout title="📌 Recuerda">
                Densidad, viscosidad y presión de vapor son las <strong>tres propiedades</strong>
                que siempre debes caracterizar antes de diseñar una línea de tubería. Todas
                dependen de la temperatura, así que conocerlas en la condición real de operación
                es indispensable.
              </InfoCallout>
            </>
          )}

          {isVisible('perdidas') && (
            <>
              <SectionTitle id="perdidas">
                Pérdidas de energía en tuberías: el precio de mover fluidos
              </SectionTitle>
              <p>
                Un fluido que se mueve a través de una tubería pierde energía por fricción, lo
                cual se manifiesta como una caída de presión. Para cuantificar estas pérdidas
                usamos la ecuación de Bernoulli modificada como marco general, y luego las
                ecuaciones de Darcy-Weisbach (pérdidas mayores) y del coeficiente $K_L$
                (pérdidas menores) para los términos específicos.
              </p>

              <SubTitle>Ecuación general de energía (Bernoulli modificada)</SubTitle>
              <p>
                Para un flujo incompresible y estacionario entre dos puntos (1 y 2) de un
                sistema:
              </p>
              <p>
                {'$$\\dfrac{P_1}{\\rho g} + \\dfrac{\\alpha_1 V_1^2}{2g} + z_1 + h_A = \\dfrac{P_2}{\\rho g} + \\dfrac{\\alpha_2 V_2^2}{2g} + z_2 + h_L$$'}
              </p>
              <p>Donde:</p>
              <ul>
                <li>$P$: presión (pascales).</li>
                <li>$\rho$: densidad (kilogramos por metro cúbico).</li>
                <li>$g$: aceleración de la gravedad (metros por segundo cuadrado).</li>
                <li>$V$: velocidad promedio del fluido (metros por segundo).</li>
                <li>
                  $\alpha$: factor de corrección de energía cinética (adimensional, $\approx 1$
                  para flujo turbulento, $\approx 2$ para flujo laminar).
                </li>
                <li>$z$: elevación (metros).</li>
                <li>$h_A$: cabeza añadida por una bomba (metros).</li>
                <li>
                  $h_L$: pérdidas totales de cabeza (metros), que incluyen:
                  <ul>
                    <li>
                      <strong>Pérdidas mayores ($h_f$):</strong> por fricción en tramos rectos
                      de tubería.
                    </li>
                    <li>
                      <strong>Pérdidas menores ($h_m$):</strong> por accesorios (válvulas,
                      codos, expansiones, contracciones).
                    </li>
                  </ul>
                </li>
              </ul>

              <SubTitle>Pérdidas mayores por fricción ($h_f$): Darcy-Weisbach</SubTitle>
              <p>
                La ecuación de Darcy-Weisbach es la más utilizada para calcular las pérdidas
                por fricción en tramos rectos de tubería:
              </p>
              <p>{'$$h_f = f \\, \\dfrac{L}{D} \\, \\dfrac{V^2}{2g}$$'}</p>
              <p>Donde:</p>
              <ul>
                <li>$f$: factor de fricción de Darcy (adimensional).</li>
                <li>$L$: longitud de la tubería (metros).</li>
                <li>$D$: diámetro interno de la tubería (metros).</li>
                <li>$V$: velocidad promedio del fluido (metros por segundo).</li>
                <li>$g$: aceleración de la gravedad (metros por segundo cuadrado).</li>
              </ul>

              <p>
                El factor de fricción $f$ depende del <strong>número de Reynolds</strong>, que
                caracteriza el régimen de flujo:
              </p>
              <p>{'$$\\mathrm{Re} = \\dfrac{\\rho V D}{\\mu}$$'}</p>
              <ul>
                <li>
                  <strong>Flujo laminar</strong> ({String.raw`$\mathrm{Re} &lt; 2100$`}): el factor de
                  fricción se calcula analíticamente como {String.raw`$f = 64 / \mathrm{Re}$`}.
                </li>
                <li>
                  <strong>Régimen de transición</strong> ({String.raw`$2100 &lt; \mathrm{Re} &lt; 4000$`}):
                  comportamiento inestable, se evita en diseño.
                </li>
                <li>
                  <strong>Flujo turbulento</strong> ({String.raw`$\mathrm{Re} &gt; 4000$`}): $f$ se calcula
                  usando el <strong>diagrama de Moody</strong> o ecuaciones como la de
                  <strong> Colebrook-White</strong>, considerando también la rugosidad
                  relativa $\varepsilon / D$ de la tubería.
                </li>
              </ul>

              <Figure
                src="/classroom/iqya-2031/readings/transporte-liquidos-07.png"
                alt="Ecuación de Colebrook-White"
                caption="Ecuación de Colebrook-White."
              />

              <Figure
                src="/classroom/iqya-2031/readings/transporte-liquidos-08.png"
                alt="Diagrama de Moody"
                caption="Diagrama de Moody."
              />

              <p>
                La <strong>rugosidad absoluta $\varepsilon$</strong> es una medida de la
                aspereza interna de la pared de la tubería (metros). Su valor depende del
                material y del estado de conservación de la tubería (acero comercial, hierro
                galvanizado, concreto, PVC, etc.).
              </p>

              <SubTitle>Pérdidas menores en accesorios ($h_m$)</SubTitle>
              <p>
                Las pérdidas en válvulas, codos, tees, expansiones y contracciones se calculan
                mediante el método del <strong>coeficiente de pérdida $K_L$</strong>:
              </p>
              <p>{'$$h_m = \\sum K_L \\, \\dfrac{V^2}{2g}$$'}</p>
              <p>
                Donde $K_L$ representa el coeficiente de pérdida específico para cada
                accesorio, obtenido de tablas o especificaciones del fabricante. La suma se
                realiza sobre todos los accesorios presentes en la línea.
              </p>

              <Figure
                src="/classroom/iqya-2031/readings/transporte-liquidos-09.png"
                alt="Tabla de coeficientes de pérdida para accesorios"
                caption="Coeficientes de pérdida $K_L$ típicos para accesorios comunes (válvulas, codos, tees, entradas y salidas)."
              />

              <TipCallout title="💡 En la práctica">
                El procedimiento típico es: (1) calcular $V$ a partir del caudal y el diámetro;
                (2) calcular {String.raw`$\mathrm{Re}$`}; (3) obtener $f$ del diagrama de Moody o
                Colebrook-White según la rugosidad relativa; (4) calcular $h_f$ con
                Darcy-Weisbach; (5) sumar las $h_m$ de cada accesorio; (6) finalmente, aplicar
                Bernoulli modificada para obtener $h_A$, la cabeza que la bomba debe aportar.
              </TipCallout>
            </>
          )}

          {isVisible('desafios') && (
            <>
              <SectionTitle id="desafios">
                Desafíos clave en el diseño de sistemas de tuberías
              </SectionTitle>
              <p>
                Diseñar una línea de transporte no es solamente aplicar ecuaciones: implica
                balancear múltiples criterios de ingeniería, económicos y de operación.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Integridad de ductos
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Selección apropiada de materiales para evitar la corrosión, y diseño que
                    garantice la resistencia a presiones operativas y posibles sobrepresiones
                    (golpes de ariete, transientes).
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Manejo hidráulico y pérdidas de presión
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Selección óptima de diámetros para equilibrar costos de inversión — las
                    tuberías más grandes son más costosas — con costos operativos — las
                    tuberías más grandes generan menos pérdidas y reducen el consumo
                    energético en bombeo.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Variabilidad de propiedades del fluido
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Evaluación del impacto de los cambios de temperatura sobre densidad y
                    viscosidad, que afectan directamente las pérdidas de carga. Este efecto es
                    especialmente significativo en hidrocarburos pesados.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Optimización del trazado
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Reducción de la longitud total de tubería y minimización del número de
                    accesorios para disminuir las pérdidas. Un trazado limpio puede ahorrar
                    años de consumo energético.
                  </p>
                </div>
              </div>

              <InfoCallout title="📌 Criterio de diseño">
                La búsqueda del diámetro óptimo es un clásico problema de
                <strong> trade-off</strong>: aumentar el diámetro reduce las pérdidas (y por
                tanto el costo operativo de bombeo), pero incrementa el costo de inversión.
                La solución se encuentra minimizando el costo total anualizado a lo largo de
                la vida útil del sistema.
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
              </ul>
            </>
          )}
        </div>
      </div>
    </ReadingLayout>
  );
};

export default TransporteLiquidos;
