import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/PageWrapper';
import { EncabezadoPagina, Cabecera } from '../components/Apertura';
import { Sube } from '../components/Sube';
import { awardsData, studentRecognitionsData, type StudentRecognition } from '../components/data/awards';
import { graduatedStudentsData } from '../components/data/students';
import { committeesData } from '../components/data/institutional';
import { fotos, type Foto } from '../components/data/fotos';
import { useI18n, localize, fill, type Lang, type UIKey } from '../context/i18n';
import type { Recognition, GraduatedStudent } from '../types';

/* Los reconocimientos agrupados por lo que reconocen: la docencia, la investigación, la
   pertenencia, lo que les reconocieron a los estudiantes y lo que vino antes de Uniandes.
   Arriba, la línea de tiempo con los doce. Todo sale de awards.ts e institutional.ts. */

const AICHE = 'AIChE Education Division';
const OPENAI = 'OpenAI';
const NACIONALES = ['National Academy of Medicine of Colombia', 'Fundación Alejandro Ángel Escobar'];
const EDITOR = 'Pharmaceutics (MDPI)';
const FOTO_NACIONAL: Record<string, Foto> = {
  'National Academy of Medicine of Colombia': fotos.academiaMedicina,
  'Fundación Alejandro Ángel Escobar': fotos.angelEscobar,
};
// Los estudiantes que firman el trabajo premiado por la Academia, con su ficha de egresado.
const COAUTORES = ['Andrés Felipe Leal', 'Carlos Emilio Torres Garay', 'Valentina Quezada Pérez', 'Saúl Camilo Gómez Tinoco'];

const porOtorgante = (nombre: string) => awardsData.find((a) => localize(a.awarder, 'en') === nombre);
const senior = committeesData.find((c) => localize(c.title, 'en').startsWith('Senior Researcher'));
const academia = committeesData.find((c) => localize(c.title, 'en') === 'Academia Joven de Colombia');

type Carril = 'teaching' | 'research' | 'membership' | 'students' | 'before';
const CARRILES: { id: Carril; nombre: UIKey; ancla: string }[] = [
  { id: 'teaching', nombre: 'awards.lane.teaching', ancla: 'docencia' },
  { id: 'research', nombre: 'awards.lane.research', ancla: 'investigacion' },
  { id: 'membership', nombre: 'awards.lane.membership', ancla: 'pertenencia' },
  { id: 'students', nombre: 'awards.lane.students', ancla: 'estudiantes' },
  { id: 'before', nombre: 'awards.lane.before', ancla: 'antes' },
];

/** Los doce reconocimientos de la línea de tiempo, con el año de su registro. */
const HITOS: { carril: Carril; año: number; texto: UIKey }[] = [
  { carril: 'teaching', año: porOtorgante(OPENAI)?.year ?? 2025, texto: 'awards.tl.openai' },
  { carril: 'teaching', año: porOtorgante(AICHE)?.year ?? 2026, texto: 'awards.tl.aiche' },
  { carril: 'research', año: porOtorgante(EDITOR)?.year ?? 2021, texto: 'awards.tl.editor' },
  { carril: 'research', año: porOtorgante(NACIONALES[0])?.year ?? 2023, texto: 'awards.tl.anm' },
  { carril: 'research', año: porOtorgante(NACIONALES[1])?.year ?? 2023, texto: 'awards.tl.faae' },
  { carril: 'research', año: senior?.startYear ?? 2025, texto: 'awards.tl.senior' },
  { carril: 'membership', año: academia?.startYear ?? 2024, texto: 'awards.tl.academia' },
  { carril: 'students', año: 2020, texto: 'awards.tl.undergrad' },
  { carril: 'students', año: studentRecognitionsData[0]?.year ?? 2023, texto: 'awards.tl.rebeca' },
  { carril: 'before', año: porOtorgante('Universidad Industrial de Santander')?.year ?? 2007, texto: 'awards.tl.cumlaude' },
  { carril: 'before', año: porOtorgante('National Renewable Energy Laboratory (NREL)')?.year ?? 2013, texto: 'awards.tl.nrel' },
  { carril: 'before', año: awardsData.find((a) => localize(a.title, 'es').includes('Es Tiempo de Volver'))?.year ?? 2014, texto: 'awards.tl.etv' },
];
const AÑOS = [...new Set(HITOS.map((h) => h.año))].sort((a, b) => a - b);

const autores = (a: Recognition) =>
  a.authors.map((autor, i) => (
    <React.Fragment key={autor}>
      {autor.includes('Reyes') ? <strong className="font-semibold text-tinta-900">{autor}</strong> : autor}
      {i < a.authors.length - 1 ? ', ' : ''}
    </React.Fragment>
  ));

const Fuente: React.FC<{ href: string; label: string }> = ({ href, label }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="a-enlace">
    {label} <span aria-hidden="true">↗</span>
  </a>
);

/** Resalta con el marcador una frase que ya está en el texto (una sola por página). */
const Resaltar: React.FC<{ texto: string; desde: number }> = ({ texto, desde }) =>
  desde < 0 ? <>{texto}</> : <>{texto.slice(0, desde)}<span className="a-resaltado">{texto.slice(desde)}</span></>;

/** La línea de tiempo: en pantallas anchas, una cuadrícula de años por carriles; en el
 *  teléfono, cada carril como una lista con el año en su columna. Cada marca lleva a su bloque. */
const Linea: React.FC = () => {
  const { t } = useI18n();
  const columnas = { gridTemplateColumns: `10rem repeat(${AÑOS.length}, minmax(0, 1fr))` };
  return (
    <figure>
      <h2 className="a-h3">{fill(t('awards.timeline.title'), { n: HITOS.length })}.</h2>
      <div className="hidden lg:block mt-8 border-t-2 border-tinta-900">
        <div className="grid gap-x-3 py-3 a-meta" style={columnas}>
          <span />
          {AÑOS.map((a) => <span key={a}>{a}</span>)}
        </div>
        {CARRILES.map((c) => {
          const hitos = HITOS.filter((h) => h.carril === c.id);
          return (
            <div key={c.id} className="grid gap-x-3 border-t-2 border-papel-300 py-5 transition-colors hover:bg-resaltador-suave" style={columnas}>
              <a href={`#${c.ancla}`} className="font-semibold text-tinta-900 leading-snug pr-3 no-underline hover:underline" style={{ gridColumn: 1, gridRow: 1 }}>{t(c.nombre)}</a>
              {AÑOS.map((año) => {
                const delAño = hitos.filter((h) => h.año === año);
                if (!delAño.length) return null;
                const col = AÑOS.indexOf(año);
                const sig = AÑOS.findIndex((a, i) => i > col && hitos.some((h) => h.año === a));
                const ancho = Math.max(1, Math.min(2, (sig < 0 ? AÑOS.length : sig) - col));
                return (
                  <span key={año} className="grid gap-3 content-start pr-2" style={{ gridColumn: `${col + 2} / span ${ancho}`, gridRow: 1 }}>
                    {delAño.map((h) => (
                      <span key={h.texto} className="a-s leading-snug text-tinta-800">
                        <span aria-hidden="true" className="block w-2.5 h-2.5 bg-tinta-900 mb-2" />
                        <span className="sr-only">{h.año}: </span>
                        {t(h.texto)}
                      </span>
                    ))}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="lg:hidden mt-6 grid gap-10 sm:grid-cols-2">
        {CARRILES.map((c) => (
          <div key={c.id}>
            <a href={`#${c.ancla}`} className="font-semibold text-tinta-900 no-underline">{t(c.nombre)}</a>
            <ul className="mt-3 border-t-2 border-tinta-900">
              {HITOS.filter((h) => h.carril === c.id).map((h) => (
                <li key={h.texto} className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-3 py-3 border-b-2 border-papel-300">
                  <span className="a-meta">{h.año}</span>
                  <span className="a-s text-tinta-800">{t(h.texto)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <figcaption className="a-pie">{t('awards.timeline.caption')}</figcaption>
    </figure>
  );
};

/** Una de las dos distinciones nacionales de 2023: las dos llevan la misma forma. */
const Nacional: React.FC<{ a: Recognition; foto?: Foto; lang: Lang; delay: number }> = ({ a, foto, lang, delay }) => {
  const { t } = useI18n();
  return (
    <Sube delay={delay}>
      <article>
        {foto && (
          <figure className="mb-8">
            <img src={foto.src} alt={localize(foto.alt, lang)} loading="lazy" className="a-bn w-full aspect-[4/3] object-cover" />
            <figcaption className="a-pie">{localize(foto.alt, lang)}</figcaption>
          </figure>
        )}
        <h4 className="a-h3">{localize(a.title, lang)}</h4>
        <p className="a-meta mt-3">{localize(a.awarder, lang)} · {localize(a.category, lang)} · {a.year}</p>
        <div className="mt-6 space-y-4">
          {a.summary.map((p, i) => <p key={i} className="a-texto">{localize(p, lang)}</p>)}
        </div>
        <p className="a-s mt-6 text-tinta-700 max-w-[64ch]">{t('awards.authors')} {autores(a)}</p>
        <p className="mt-6"><Fuente href={a.url} label={t('awards.source')} /></p>
      </article>
    </Sube>
  );
};

/** Lo que les reconocieron a los estudiantes: el reconocimiento es de ellos, y sus nombres van primero. */
const DeEstudiantes: React.FC<{ r: StudentRecognition }> = ({ r }) => {
  const { t, lang } = useI18n();
  const conFoto = r.students.filter((s) => s.imageUrl);
  return (
    <Sube as="li">
      <span className="cuando">{r.yearLabel ? localize(r.yearLabel, lang) : r.year}</span>
      <div className={conFoto.length ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12' : undefined}>
        <div>
          <h3 className="que">{r.students.map((s) => s.name).join(lang === 'es' ? ' y ' : ' and ')}</h3>
          <p className="donde">
            {localize(r.title, lang)} · {localize(r.awarder, lang)}
            {r.url && <> · <Fuente href={r.url} label={t('awards.source')} /></>}
          </p>
          <p className="detalle a-texto">{localize(r.summary, lang)}</p>
        </div>
        {conFoto.length > 0 && (
          <ul className="mt-6 lg:mt-1 grid grid-cols-2 gap-4 max-w-[320px]">
            {conFoto.map((s) => (
              <li key={s.name}>
                <img src={s.imageUrl} alt={s.name} loading="lazy" className="a-bn w-full aspect-[4/5] object-cover object-top" />
                <p className="a-meta mt-2">{s.name}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Sube>
  );
};

export const AwardsPage: React.FC = () => {
  const { t, lang } = useI18n();
  const aiche = porOtorgante(AICHE);
  const openai = porOtorgante(OPENAI);
  const nacionales = NACIONALES.map(porOtorgante).filter((a): a is Recognition => Boolean(a));
  const editor = porOtorgante(EDITOR);
  const antes = awardsData.filter((a) => !a.role).sort((x, y) => x.year - y.year);
  const todos = [...graduatedStudentsData.phd, ...graduatedStudentsData.ms];
  const coautores = COAUTORES.map((n) => todos.find((g) => g.name === n)).filter((g): g is GraduatedStudent => Boolean(g));

  const subtitulo = t('awards.subtitle');
  const equipo = lang === 'es' ? subtitulo.indexOf('Casi todos') : subtitulo.indexOf('Most of');

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('awards.title')}
        entrada={<p><Resaltar texto={subtitulo} desde={equipo} /></p>}
        accion={{ to: '/teaching/unit-ops', label: t('awards.cta') }}
        foto={{ src: fotos.portadaReconocimiento.src, alt: localize(fotos.portadaReconocimiento.alt, lang), posicion: fotos.portadaReconocimiento.foco }}
      />

      {/* ── Los doce, en el tiempo ── */}
      <section className="a-papel pt-8 pb-20 sm:pb-28">
        <div className="a-c">
          <Sube><Linea /></Sube>
        </div>
      </section>

      {/* ── Por la docencia: el premio del AIChE con el peso que tiene, y OpenAI ── */}
      {aiche && (
        <section id="docencia" className="a-oscuro a-campo scroll-mt-16">
          <div className="a-c">
            <Sube><Cabecera titulo={t('awards.teaching.title')} /></Sube>
            <Sube delay={0.04}>
              <h3 className="mt-14 text-[length:var(--t-l)] md:text-[length:var(--t-titulo)] leading-[1.04] tracking-[-.04em] font-bold text-white lg:max-w-[24ch]">
                {localize(aiche.title, lang)}
              </h3>
            </Sube>
            <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
              <div>
                <Sube delay={0.06}>
                  <p className="a-entrada max-w-[40ch]">{t('awards.lead.verified')}</p>
                  <p className="a-meta mt-5">{localize(aiche.awarder, lang)} · {aiche.year}</p>
                </Sube>
                <div className="mt-10 space-y-4">
                  {aiche.summary.map((p, i) => (
                    <Sube key={i} delay={0.04 * i}><p className="a-texto">{localize(p, lang)}</p></Sube>
                  ))}
                </div>
                <Sube className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <Link to="/teaching/unit-ops" className="a-boton">
                    {t('awards.lead.course')} <span aria-hidden="true">→</span>
                  </Link>
                  <Fuente href={aiche.url} label={t('awards.lead.page')} />
                </Sube>
              </div>
              <Sube delay={0.12} className="lg:sticky lg:top-28 lg:self-start">
                <figure>
                  <img src={fotos.cursoGrupo.src} alt={localize(fotos.cursoGrupo.alt, lang)} className="a-bn w-full aspect-[4/3] object-cover" />
                  <figcaption className="a-pie !text-tinta-300">{localize(fotos.cursoGrupo.alt, lang)}</figcaption>
                </figure>
              </Sube>
            </div>
            {openai && (
              <Sube className="mt-20 pt-10 border-t-2 border-tinta-600 grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
                <div>
                  <h3 className="a-h3">{localize(openai.title, lang)}</h3>
                  <p className="a-meta mt-3">{localize(openai.awarder, lang)} · {openai.year}</p>
                </div>
                <div>
                  {openai.summary.map((p, i) => <p key={i} className="a-texto">{localize(p, lang)}</p>)}
                  <p className="mt-6"><Fuente href={openai.url} label={t('awards.source')} /></p>
                </div>
              </Sube>
            )}
          </div>
        </section>
      )}

      {/* ── Por la investigación: las dos distinciones de 2023 juntas, y lo demás como registro ── */}
      <section id="investigacion" className="a-hundido a-campo scroll-mt-16">
        <div className="a-c">
          <Sube><Cabecera titulo={t('awards.research.title')} /></Sube>
          <Sube delay={0.06}><p className="mt-10 a-texto">{t('awards.research.intro')}</p></Sube>
          {nacionales.length > 0 && (
            <>
              <Sube className="mt-16"><h3 className="a-h3">{t('awards.national.title')}</h3></Sube>
              <Sube delay={0.04}><p className="a-meta mt-3 max-w-[64ch]">{nacionales[0].projectTitle}</p></Sube>
              <div className="mt-12 grid gap-14 md:grid-cols-2 md:gap-12">
                {nacionales.map((a, i) => <Nacional key={a.url} a={a} foto={FOTO_NACIONAL[localize(a.awarder, 'en')]} lang={lang} delay={0.06 * i} />)}
              </div>
              <ul className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                {coautores.map((g, i) => (
                  <Sube as="li" key={g.name} delay={0.06 * i}>
                    <img src={g.imageUrl} alt={g.name} loading="lazy" className="a-bn w-full aspect-[4/5] object-cover object-top" />
                    <p className="mt-4 font-semibold leading-tight text-tinta-900">{g.name}</p>
                    <p className="a-meta mt-1">{g.program ? localize(g.program, lang) : g.degree} · {g.graduationYear}</p>
                  </Sube>
                ))}
              </ul>
              <Sube><p className="a-pie mt-10 max-w-[72ch]">{t('awards.national.coauthors')}</p></Sube>
            </>
          )}
          <ul className="a-registro !mt-20">
            {senior && (
              <Sube as="li">
                <span className="cuando">{senior.startYear}</span>
                <div>
                  <h3 className="que">{t('awards.senior.title')}</h3>
                  <p className="donde">{t('awards.senior.awarder')}</p>
                  <p className="detalle a-texto">{t('awards.senior.text')}</p>
                </div>
              </Sube>
            )}
            {editor && (
              <Sube as="li">
                <span className="cuando">{editor.year}</span>
                <div>
                  <h3 className="que">{localize(editor.title, lang)}</h3>
                  <p className="donde">{localize(editor.awarder, lang)} · <i>{editor.projectTitle}</i> · <Fuente href={editor.url} label={t('awards.source')} /></p>
                  {editor.summary.map((p, i) => <p key={i} className="detalle a-texto">{localize(p, lang)}</p>)}
                </div>
              </Sube>
            )}
          </ul>
        </div>
      </section>

      {/* ── La pertenencia: la Academia Joven de Colombia ── */}
      <section id="pertenencia" className="a-papel a-campo scroll-mt-16">
        <div className="a-c">
          <Sube><Cabecera titulo={t('awards.academia.title')} /></Sube>
          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:items-start">
            <div>
              <Sube><p className="a-entrada max-w-[44ch]">{t('awards.academia.text')}</p></Sube>
              <Sube delay={0.06}><p className="a-meta mt-6">{t('awards.academia.meta')} · Academia Colombiana de Ciencias Exactas, Físicas y Naturales</p></Sube>
            </div>
            <Sube delay={0.1}>
              <figure className="max-w-[420px]">
                <img src={fotos.academiaJoven.src} alt={localize(fotos.academiaJoven.alt, lang)} loading="lazy" className="a-bn w-full aspect-square object-cover object-top" />
                <figcaption className="a-pie">{localize(fotos.academiaJoven.alt, lang)}</figcaption>
              </figure>
            </Sube>
          </div>
        </div>
      </section>

      {/* ── Lo que les reconocieron a mis estudiantes ── */}
      <section id="estudiantes" className="a-hundido a-campo scroll-mt-16">
        <div className="a-c">
          <Sube><Cabecera titulo={t('awards.students.title')} /></Sube>
          <Sube delay={0.06}><p className="mt-10 a-texto">{t('awards.students.lead')}</p></Sube>
          <ul className="a-registro !mt-10">
            {studentRecognitionsData.map((r) => <DeEstudiantes key={localize(r.title, 'en')} r={r} />)}
          </ul>
        </div>
      </section>

      {/* ── Antes de Uniandes ── */}
      <section id="antes" className="a-papel a-campo scroll-mt-16">
        <div className="a-c">
          <Sube><Cabecera titulo={t('awards.before.title')} /></Sube>
          <ul className="a-registro !mt-12">
            {antes.map((a, i) => (
              <Sube as="li" key={a.url + a.year} delay={0.04 * i}>
                <span className="cuando">{a.year}</span>
                <div>
                  <h3 className="que">{localize(a.title, lang)}</h3>
                  <p className="donde">{localize(a.awarder, lang)} · <Fuente href={a.url} label={t('awards.source')} /></p>
                  <div className="detalle lg:!max-w-none lg:columns-2 lg:gap-12 [&_p]:break-inside-avoid-column">
                    {a.summary.map((p, j) => <p key={j} className="a-texto">{localize(p, lang)}</p>)}
                  </div>
                </div>
              </Sube>
            ))}
          </ul>
        </div>
      </section>
    </PageWrapper>
  );
};
