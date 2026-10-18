import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/PageWrapper';
import { EncabezadoPagina, Cabecera } from '../components/Apertura';
import { Sube } from '../components/Sube';
import { fotos, type Foto } from '../components/data/fotos';
import { useI18n, localize, type UIKey, type Lang } from '../context/i18n';

/** Contexto: lo que cambió desde 2017 en cuatro frentes. Sin cifras de dinero: el
 *  frente de la investigación cuenta dónde se hace, no con qué se paga. */

const AÑOS = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

const CARRILES: { nombre: UIKey; hitos: { año: number; texto: UIKey }[] }[] = [
  { nombre: 'context.lane.students', hitos: [
    { año: 2017, texto: 'context.ev.arrive' },
    { año: 2021, texto: 'context.ev.reform' },
    { año: 2022, texto: 'context.ev.redesign' },
    { año: 2024, texto: 'context.ev.recovery' },
  ] },
  { nombre: 'context.lane.ai', hitos: [
    { año: 2020, texto: 'context.ev.peptides' },
    { año: 2022, texto: 'context.ev.chatgpt' },
    { año: 2023, texto: 'context.ev.orgs' },
    { año: 2026, texto: 'context.ev.taskforce' },
  ] },
  { nombre: 'context.lane.research', hitos: [
    { año: 2019, texto: 'context.ev.firstPi' },
    { año: 2022, texto: 'context.ev.enel' },
    { año: 2024, texto: 'context.ev.industry' },
  ] },
  { nombre: 'context.lane.university', hitos: [
    { año: 2017, texto: 'context.ev.conecta' },
    { año: 2022, texto: 'context.ev.didacta' },
    { año: 2024, texto: 'context.ev.guidelines' },
    { año: 2025, texto: 'context.ev.pdi' },
  ] },
];

/** Las fuentes externas, nombradas y enlazadas (verificadas en octubre de 2026). */
const FUENTES: { quien: string; obra: string; cuando: { en: string; es: string }; url: string }[] = [
  { quien: 'Digital Education Council', obra: 'Global AI Student Survey 2024', cuando: { en: 'August 2024', es: 'agosto de 2024' }, url: 'https://www.digitaleducationcouncil.com/post/digital-education-council-global-ai-student-survey-2024' },
  { quien: 'HEPI · Kortext', obra: 'Student Generative AI Survey 2025, Policy Note 61', cuando: { en: 'February 2025', es: 'febrero de 2025' }, url: 'https://www.hepi.ac.uk/reports/student-generative-ai-survey-2025/' },
  { quien: 'Chirikov, Smirnov & Kizilcec', obra: 'Science 392(6800), 818-820', cuando: { en: 'May 2026', es: 'mayo de 2026' }, url: 'https://doi.org/10.1126/science.aec5115' },
  { quien: 'McKinsey Global Institute', obra: 'The economic potential of generative AI', cuando: { en: 'June 2023', es: 'junio de 2023' }, url: 'https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier' },
  { quien: 'Microsoft · LinkedIn', obra: '2024 Work Trend Index Annual Report', cuando: { en: 'May 2024', es: 'mayo de 2024' }, url: 'https://news.microsoft.com/2024/05/08/' },
  { quien: 'Bastani et al.', obra: 'PNAS 122(26), e2422633122', cuando: { en: 'June 2025', es: 'junio de 2025' }, url: 'https://doi.org/10.1073/pnas.2422633122' },
  { quien: 'OpenAI', obra: 'Introducing ChatGPT', cuando: { en: '30 November 2022', es: '30 de noviembre de 2022' }, url: 'https://openai.com/index/chatgpt/' },
  { quien: 'Universidad de los Andes', obra: 'Conecta-TE', cuando: { en: 'since 2012', es: 'desde 2012' }, url: 'https://conectate.uniandes.edu.co/que-es-conecta-te/' },
  { quien: 'Universidad de los Andes', obra: 'DIDACTA', cuando: { en: 'since 2022', es: 'desde 2022' }, url: 'https://didacta.uniandes.edu.co/de-donde-viene-didacta/' },
  { quien: 'Universidad de los Andes', obra: 'Programa de Desarrollo Integral 2026-2030', cuando: { en: 'November 2025', es: 'noviembre de 2025' }, url: 'https://planeacion.uniandes.edu.co/pdi/nuestro-pdi' },
];

const Figura: React.FC<{ foto: Foto; pie: string; lang: Lang; proporcion?: string; className?: string }> = ({ foto, pie, lang, proporcion = 'aspect-[4/3]', className = '' }) => (
  <figure className={className}>
    <img src={foto.src} alt={localize(foto.alt, lang)} loading="lazy" className={`a-bn w-full ${proporcion} object-cover`} />
    <figcaption className="a-pie">{pie}</figcaption>
  </figure>
);

/** La línea de tiempo: en pantallas anchas, una cuadrícula de años por carriles;
 *  en el teléfono, cada carril como una lista con el año en su columna. */
const Frentes: React.FC = () => {
  const { t } = useI18n();
  return (
    <figure>
      <h3 className="a-h3">{t('context.timeline.title')}.</h3>
      <div className="hidden lg:block mt-8 border-t-2 border-tinta-900">
        <div className="grid grid-cols-[11rem_repeat(10,minmax(0,1fr))] gap-x-3 py-3 a-meta">
          <span />
          {AÑOS.map((a) => <span key={a}>{a}</span>)}
        </div>
        {CARRILES.map((c) => (
          <div key={c.nombre} className="grid grid-cols-[11rem_repeat(10,minmax(0,1fr))] gap-x-3 border-t-2 border-papel-300 py-5 transition-colors hover:bg-resaltador-suave">
            <span className="font-semibold text-tinta-900 leading-snug pr-3" style={{ gridColumn: 1, gridRow: 1 }}>{t(c.nombre)}</span>
            {/* Cada hito ocupa su año y, si el siguiente está libre, se extiende hasta dos columnas. */}
            {c.hitos.map((h, i) => {
              const col = AÑOS.indexOf(h.año);
              const sig = c.hitos[i + 1] ? AÑOS.indexOf(c.hitos[i + 1].año) : AÑOS.length;
              const ancho = Math.max(1, Math.min(2, sig - col));
              return (
                <span key={h.texto} className="a-s leading-snug text-tinta-800 pr-2" style={{ gridColumn: `${col + 2} / span ${ancho}`, gridRow: 1 }}>
                  <span aria-hidden="true" className="block w-2.5 h-2.5 bg-tinta-900 mb-2" />
                  <span className="sr-only">{h.año}: </span>
                  {t(h.texto)}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <div className="lg:hidden mt-6 grid gap-10 sm:grid-cols-2">
        {CARRILES.map((c) => (
          <div key={c.nombre}>
            <p className="font-semibold text-tinta-900">{t(c.nombre)}</p>
            <ul className="mt-3 border-t-2 border-tinta-900">
              {c.hitos.map((h) => (
                <li key={h.texto} className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-3 py-3 border-b-2 border-papel-300">
                  <span className="a-meta">{h.año}</span>
                  <span className="a-s text-tinta-800">{t(h.texto)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <figcaption className="a-pie">{t('context.timeline.caption')}</figcaption>
    </figure>
  );
};

export const ContextPage: React.FC = () => {
  const { t, lang } = useI18n();

  const promesas: { cifra?: string; texto: UIKey; fuente: string }[] = [
    { cifra: lang === 'es' ? '60-70 %' : '60-70 %', texto: 'context.pr.economy', fuente: 'McKinsey Global Institute, 2023' },
    { cifra: '75 %', texto: 'context.pr.workers', fuente: 'Microsoft · LinkedIn, 2024' },
    { cifra: '75 %', texto: 'context.pr.students', fuente: 'Digital Education Council, 2024 · HEPI, 2025' },
  ];
  const evidencias: { cifra?: string; texto: UIKey; fuente: string }[] = [
    { cifra: '−17 %', texto: 'context.ev.exam', fuente: 'Bastani et al., PNAS, 2025' },
    { texto: 'context.ev.tutor', fuente: 'Bastani et al., PNAS, 2025' },
    { texto: 'context.ev.text', fuente: lang === 'es' ? 'Estudios citados en mi revisión crítica' : 'Studies cited in my critical review' },
    { cifra: '0', texto: 'context.ev.zero', fuente: lang === 'es' ? 'Mi revisión crítica, en revisión final' : 'My critical review, in final review' },
  ];

  const Columna: React.FC<{ titulo: UIKey; items: typeof promesas }> = ({ titulo, items }) => (
    <div>
      <h3 className="a-h3">{t(titulo)}.</h3>
      <ul className="mt-6 border-t-2 border-tinta-900">
        {items.map((it, i) => (
          <Sube as="li" key={it.texto} delay={0.05 * i} className="py-6 border-b-2 border-papel-300">
            {it.cifra && <b className="block text-[length:var(--t-titulo)] leading-none font-bold tracking-tight text-tinta-900 tabular-nums">{it.cifra}</b>}
            <p className={`a-meta ${it.cifra ? 'mt-3' : ''}`}>{it.fuente}</p>
            <p className="mt-2 text-tinta-800 max-w-[46ch]">{t(it.texto)}</p>
          </Sube>
        ))}
      </ul>
    </div>
  );

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('context.title')}
        entrada={t('context.lead')}
        foto={{ src: fotos.portadaContexto.src, alt: localize(fotos.portadaContexto.alt, lang), posicion: fotos.portadaContexto.foco }}
        accion={{ label: t('context.sources.cta'), onClick: () => document.getElementById('fuentes')?.scrollIntoView({ behavior: 'smooth' }) }}
      />

      {/* ── Los cuatro frentes ── */}
      <section className="a-papel pb-20 sm:pb-28">
        <div className="a-c">
          <Sube><p className="a-texto text-tinta-900">{t('context.intro')}</p></Sube>
          <Sube className="mt-16"><Frentes /></Sube>
        </div>
      </section>

      {/* ── Los estudiantes ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('context.students.title')} /></Sube>
          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <div>
              <Sube><p className="a-texto">{t('context.students.p1')}</p></Sube>
              <Sube className="mt-4">
                <Link to="/teaching/unit-ops" className="a-enlace">{t('context.students.link')} <span aria-hidden="true">→</span></Link>
              </Sube>
              <Sube className="mt-8"><p className="a-texto">{t('context.students.p2')}</p></Sube>
              <Sube><p className="a-texto mt-4">{t('context.students.p3')}</p></Sube>
            </div>
            <Sube delay={0.08}>
              <Figura foto={fotos.pouNpsh} pie={t('context.students.photo')} lang={lang} />
            </Sube>
          </div>
          <Sube className="mt-16">
            <div className="a-cifras">
              <div><b>86 %</b><span>{t('context.stat.global')}</span><span className="a-meta">Digital Education Council</span></div>
              <div><b>92 %</b><span>{t('context.stat.uk')}</span><span className="a-meta">HEPI · Kortext</span></div>
              <div><b>2/3</b><span>{t('context.stat.us')}</span><span className="a-meta">Chirikov et al., Science</span></div>
            </div>
          </Sube>
        </div>
      </section>

      {/* ── La inteligencia artificial ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('context.ai.title')} /></Sube>
          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <Sube><p className="a-texto">{t('context.ai.p1')}</p></Sube>
            <Sube delay={0.08}>
              <Figura foto={fotos.palmaCharla} pie={t('context.ai.photo')} lang={lang} />
            </Sube>
          </div>
          <div className="mt-16 grid gap-14 lg:grid-cols-2">
            <Columna titulo="context.ai.promise" items={promesas} />
            <Columna titulo="context.ai.evidence" items={evidencias} />
          </div>
          <Sube className="mt-14">
            <p className="a-texto">
              {t('context.ai.p2a')} <span className="a-resaltado font-semibold">{t('context.ai.p2b')}</span>
            </p>
          </Sube>
        </div>
      </section>

      {/* ── La investigación ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('context.research.title')} /></Sube>
          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <div>
              <Sube><p className="a-texto">{t('context.research.p1')}</p></Sube>
              <Sube className="mt-6">
                <Link to="/research/grants" className="a-enlace">{t('context.research.link')} <span aria-hidden="true">→</span></Link>
              </Sube>
            </div>
            <Sube delay={0.08}>
              <Figura foto={fotos.enel} pie={t('context.research.photo')} lang={lang} />
            </Sube>
          </div>
        </div>
      </section>

      {/* ── La Universidad ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('context.university.title')} /></Sube>
          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <Sube>
              <Figura foto={fotos.estudiantesU} pie={t('context.university.photo')} lang={lang} />
            </Sube>
            <div>
              <Sube><p className="a-texto">{t('context.university.p1')}</p></Sube>
              <Sube><p className="a-texto mt-4">{t('context.university.p2')}</p></Sube>
              <Sube><p className="a-texto mt-4 font-semibold text-tinta-900">{t('context.university.p3')}</p></Sube>
            </div>
          </div>
        </div>
      </section>

      {/* ── Fuentes ── */}
      <section id="fuentes" className="a-hundido a-campo scroll-mt-16">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('context.sources.title')}.</h2></Sube>
          <ol className="mt-6 border-t-2 border-tinta-900 grid sm:grid-cols-2 gap-x-10">
            {FUENTES.map((f) => (
              <li key={f.url} className="py-4 border-b-2 border-papel-300">
                <a href={f.url} target="_blank" rel="noopener noreferrer" className="group block">
                  <span className="block text-tinta-900 font-semibold">{f.quien}</span>
                  <span className="block a-s text-tinta-800 group-hover:underline">
                    <i>{f.obra}</i>, {lang === 'es' ? f.cuando.es : f.cuando.en} <span aria-hidden="true">↗</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </PageWrapper>
  );
};
