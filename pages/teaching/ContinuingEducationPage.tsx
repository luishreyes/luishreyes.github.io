import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageWrapper } from '../../components/PageWrapper';
import { EncabezadoPagina, Cabecera } from '../../components/Apertura';
import { StatsSection } from '../../components/StatsSection';
import { Sube, SALE } from '../../components/Sube';
import {
  edcoCoursesData,
  edcoOrganizations,
  trainingCourses,
  moocCourses,
  isTaught,
  todayIso,
  type EdcoCourse,
  type EdcoOrgId,
} from '../../components/data/edco';
import { eduProCourse } from '../../components/data/classroom/edu-pro';
import { useI18n, fill, localize, cardinal, type UIKey, type Lang } from '../../context/i18n';
import { fotos, type Foto } from '../../components/data/fotos';
import { logosOrganizaciones, type Logo } from '../../components/data/logos';

/** Formación a escala: el curso de Coursera, los cursos abiertos de Educación Continua y la
 *  formación para organizaciones. Todas las cifras salen de components/data/edco.ts; ninguna
 *  de dinero. */

// ── Lo que se cuenta ─────────────────────────────────────────────────────────

type Kind = 'open' | 'org' | 'online' | 'summer';
const kindOf = (c: EdcoCourse): Kind =>
  c.channel === 'coursera' ? 'online' : c.type === 'Summer School' ? 'summer' : c.type === 'Corporate Course' ? 'org' : 'open';
const kindKey: Record<Kind, UIKey> = {
  open: 'training.kind.open',
  org: 'training.kind.org',
  online: 'training.kind.online',
  summer: 'training.kind.summer',
};
type Filter = 'all' | Kind;
const FILTERS: { id: Filter; label: UIKey }[] = [
  { id: 'all', label: 'training.filter.all' },
  { id: 'open', label: 'training.filter.open' },
  { id: 'org', label: 'training.filter.org' },
  { id: 'online', label: 'training.filter.online' },
  { id: 'summer', label: 'training.filter.summer' },
];
const roleKey: Record<EdcoCourse['role'], UIKey> = {
  Instructor: 'training.role.instructor',
  Coordinator: 'training.role.coordinator',
};

/** Más reciente primero; dentro del año, por fecha de inicio (los de Coursera, que no tienen, arriba). */
const orden = (c: EdcoCourse) => c.start ?? (c.channel === 'coursera' ? `${c.year}-12-31` : `${c.year}-01-01`);
const ordenados = [...edcoCoursesData].sort((a, b) => b.year - a.year || orden(b).localeCompare(orden(a)));

const deRegistro = trainingCourses.filter((c) => c.edcoRecord);
const paraOrganizaciones = trainingCourses.filter((c) => c.type === 'Corporate Course');
const dominando = trainingCourses.filter((c) => c.title.startsWith('Dominando la Inteligencia Artificial'));
const años = trainingCourses.map((c) => c.year);
const desde = Math.min(...años);
const hasta = Math.max(...años);
const porAño = Array.from({ length: hasta - desde + 1 }, (_, i) => desde + i).map((year) => {
  const delAño = trainingCourses.filter((c) => c.year === year);
  const open = delAño.filter((c) => c.type === 'Open Course').length;
  return { year, open, org: delAño.length - open, total: delAño.length };
});
const maxAño = Math.max(...porAño.map((f) => f.total));

/** Cada organización con sus cursos o grupos y sus años, de más a menos. */
const organizaciones = (() => {
  const m = new Map<EdcoOrgId, { n: number; years: Set<number> }>();
  for (const c of paraOrganizaciones) {
    if (!c.org) continue;
    const o = m.get(c.org) ?? { n: 0, years: new Set<number>() };
    o.n += 1;
    o.years.add(c.year);
    m.set(c.org, o);
  }
  return [...m].map(([id, o]) => ({ id, ...edcoOrganizations[id], n: o.n, years: [...o.years].sort() }));
})();

const moocEs = moocCourses.find((c) => c.url && c.title.startsWith('Fundamentos'));
const moocEn = moocCourses.find((c) => c.url && c.title.startsWith('Fundamentals'));
const moocEnConstruccion = moocCourses.find((c) => c.underConstruction);
const pct = (rate = 0) => Math.round(rate * 100);

// ── Piezas ───────────────────────────────────────────────────────────────────

const Figura: React.FC<{ foto: Foto; pie: string; lang: Lang; proporcion?: string; className?: string }> = ({ foto, pie, lang, proporcion = 'aspect-[4/3]', className = '' }) => (
  <figure className={className}>
    <img src={foto.src} alt={localize(foto.alt, lang)} loading="lazy" className={`a-bn w-full ${proporcion} object-cover`} />
    <figcaption className="a-pie">{pie}</figcaption>
  </figure>
);

/** Cursos y grupos por año, en dos tonos de tinta (abiertos y para organizaciones), con la cifra
 *  escrita en cada fila: el color nunca es lo único que distingue las dos series. */
const PorAño: React.FC<{ enCurso: number }> = ({ enCurso }) => {
  const { t, lang } = useI18n();
  return (
    <figure>
      <h3 className="a-h3">{t('training.chart.title')}.</h3>
      <p className="mt-5 flex flex-wrap gap-x-7 gap-y-2 a-s text-tinta-800">
        <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="inline-block w-3.5 h-3.5 bg-tinta-900" />{t('training.chart.open')}</span>
        <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="inline-block w-3.5 h-3.5 bg-tinta-500" />{t('training.chart.org')}</span>
      </p>
      <ul className="mt-6 border-t-2 border-tinta-900">
        {porAño.map((f, i) => (
          <Sube as="li" key={f.year} delay={0.04 * i} className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-x-4 py-3 border-b-2 border-papel-300 transition-colors hover:bg-resaltador-suave">
            <span className="a-meta">{f.year}</span>
            <div>
              {/* La barra y, pegada a ella, la cifra del año. */}
              <div className="flex items-center gap-3">
                <div className="flex h-5 gap-[2px]" style={{ width: `calc((100% - 3.5rem) * ${f.total / maxAño})` }} aria-hidden="true">
                  {f.open > 0 && <span className="h-full bg-tinta-900" style={{ flex: `${f.open} 1 0` }} />}
                  {f.org > 0 && <span className="h-full bg-tinta-500" style={{ flex: `${f.org} 1 0` }} />}
                </div>
                <b className="text-[length:var(--t-l)] leading-none font-semibold text-tinta-900 tabular-nums">{f.total}</b>
              </div>
              <p className="a-s text-tinta-700 mt-1.5">{fill(t('training.chart.row'), { open: f.open, org: f.org })}</p>
            </div>
          </Sube>
        ))}
      </ul>
      <figcaption className="a-pie">
        {enCurso > 0
          ? fill(t('training.chart.caption'), { year: hasta, n: cardinal(enCurso, lang) })
          : t('training.chart.caption0')}
      </figcaption>
    </figure>
  );
};

// ── La página ────────────────────────────────────────────────────────────────

export const ContinuingEducationPage = () => {
  const { t, lang } = useI18n();
  const [filtro, setFiltro] = useState<Filter>('all');
  const miles = (n: number) => n.toLocaleString(lang === 'es' ? 'es-CO' : 'en-US');
  const nombre = (s: Parameters<typeof localize>[0]) => localize(s, lang);

  const hoy = todayIso();
  const dictados = trainingCourses.filter((c) => isTaught(c, hoy));
  const enCursoUltimoAño = trainingCourses.filter((c) => c.year === hasta && !isTaught(c, hoy)).length;
  const horas = deRegistro.filter((c) => isTaught(c, hoy)).reduce((s, c) => s + (c.edcoRecord?.hours ?? 0), 0);
  const externas = organizaciones.filter((o) => o.external).length;
  const listaOrganizaciones = [...organizaciones].sort((a, b) => b.n - a.n || nombre(a.name).localeCompare(nombre(b.name), 'es'));
  // El muro de logos va en el mismo orden que la tabla.
  const orden = new Map(listaOrganizaciones.map((o, i) => [o.id, i]));
  const muro = logosOrganizaciones
    .filter((l) => orden.has(l.org))
    .sort((a, b) => (orden.get(a.org) ?? 0) - (orden.get(b.org) ?? 0));
  const altLogo = (l: Logo) => nombre(l.alt ?? edcoOrganizations[l.org].name);

  const stats = [
    ...(moocEs ? [{ label: t('training.stat.mooc'), value: moocEs.attendees, note: fill(t('training.stat.mooc.note'), { pct: pct(moocEs.completionRate) }) }] : []),
    { label: fill(t('training.stat.courses'), { from: desde, to: hasta }), value: trainingCourses.length, note: fill(t('training.stat.courses.note'), { n: dictados.length }) },
    { label: t('training.stat.enrolled'), value: deRegistro.reduce((s, c) => s + c.attendees, 0), note: t('training.stat.enrolled.note') },
    { label: t('training.stat.orgs'), value: organizaciones.length, note: fill(t('training.stat.orgs.note'), { ext: externas }) },
    {
      label: fill(t('training.stat.dominando'), { year: Math.min(...dominando.map((c) => c.year)) }),
      value: dominando.length,
      note: fill(t('training.stat.dominando.note'), {
        open: dominando.filter((c) => c.type === 'Open Course').length,
        org: dominando.filter((c) => c.type === 'Corporate Course').length,
      }),
    },
    { label: t('training.stat.hours'), value: horas },
  ];

  const filtrados = useMemo(() => (filtro === 'all' ? ordenados : ordenados.filter((c) => kindOf(c) === filtro)), [filtro]);
  const inscritos = filtrados.reduce((s, c) => s + c.attendees, 0);

  const titulos = (c: EdcoCourse) => {
    const primary = lang === 'en' && c.titleEn ? c.titleEn : c.title;
    // En inglés, debajo, el nombre con que la Universidad registra el curso.
    const secondary = lang === 'en' && c.title !== primary ? c.title : null;
    return { primary, secondary };
  };
  const tituloDe = (c: EdcoCourse) => {
    const { primary } = titulos(c);
    const clase = 'text-[18px] leading-snug font-semibold text-tinta-900';
    const grupo = c.group ? <span className="font-normal text-tinta-700"> · {nombre(c.group)}</span> : null;
    return c.url ? (
      <a href={c.url} target="_blank" rel="noopener noreferrer" className={`${clase} underline decoration-1 underline-offset-[3px] hover:bg-resaltador-suave transition-colors`}>
        {primary}{grupo} <span aria-hidden="true">↗</span>
      </a>
    ) : (
      <span className={clase}>{primary}{grupo}</span>
    );
  };
  const via = (c: EdcoCourse) =>
    c.channel === 'executive' ? t('training.via.executive') : c.channel === 'edco' && !c.client ? t('training.via.edco') : c.channel === 'coursera' ? 'Coursera' : null;
  const cuantos = (c: EdcoCourse) =>
    c.underConstruction ? t('training.row.building') : c.attendeesUnknown ? t('training.row.unknown') : miles(c.attendees);

  // Cifras del relato, siempre leídas de los datos.
  const contraloria = paraOrganizaciones.filter((c) => c.org === 'contraloria').length;
  const orgsDe = (y: number) => porAño.find((f) => f.year === y)?.org ?? 0;
  const dominandoOpen = dominando.filter((c) => c.type === 'Open Course').length;

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('training.title')}
        entrada={t('training.lead')}
        foto={{ src: fotos.portadaFormacion.src, alt: localize(fotos.portadaFormacion.alt, lang), posicion: fotos.portadaFormacion.foco }}
        accion={moocEs?.url ? { href: moocEs.url, label: t('training.cta') } : undefined}
      />

      {/* ── Fuera del aula ── */}
      <section className="a-papel pt-10 sm:pt-16 pb-20 sm:pb-28">
        <div className="a-c">
          <Sube><Cabecera titulo={t('training.out.title')} /></Sube>
          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <div>
              <Sube>
                <p className="a-texto text-tinta-900">
                  {t('training.out.p1a')} <span className="a-resaltado font-semibold">{t('training.out.p1b')}</span>
                  {fill(t('training.out.p1c'), { n: miles(moocEs?.attendees ?? 0) })}
                </p>
              </Sube>
              <Sube><p className="a-texto mt-4">{t('training.out.p2')}</p></Sube>
            </div>
            <Sube delay={0.08}>
              <Figura foto={fotos.acofiPonencia} pie={t('training.out.photo')} lang={lang} />
            </Sube>
          </div>
        </div>
      </section>

      {/* ── Lo que suma ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('training.sum.title')} /></Sube>
          <Sube className="mt-14"><StatsSection stats={stats} isLoading={false} /></Sube>
          <Sube className="mt-24"><PorAño enCurso={enCursoUltimoAño} /></Sube>
        </div>
      </section>

      {/* ── El curso en línea ── */}
      {moocEs && (
        <section className="a-papel a-campo">
          <div className="a-c">
            <Sube><Cabecera titulo={t('training.mooc.title')} /></Sube>
            <div className="mt-12 grid gap-12 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] md:items-start">
              <Sube>
                <Figura foto={fotos.grabacionMooc} pie={t('training.mooc.photo')} lang={lang} proporcion="aspect-[4/5]" className="max-w-[360px]" />
              </Sube>
              <div>
                <Sube>
                  <p className="a-texto">
                    {fill(t('training.mooc.p1'), { title: moocEs.title, year: moocEs.year, n: miles(moocEs.attendees), pct: pct(moocEs.completionRate) })}
                  </p>
                </Sube>
                {moocEn && (
                  <Sube>
                    <p className="a-texto mt-4">
                      {fill(t('training.mooc.p2'), {
                        title: moocEn.title,
                        year: moocEn.year,
                        n: miles(moocEn.attendees),
                        pct: pct(moocEn.completionRate),
                        third: moocEnConstruccion?.title ?? '',
                        thirdEn: moocEnConstruccion?.titleEn ?? '',
                      })}
                    </p>
                  </Sube>
                )}
                <Sube className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                  <a href={moocEs.url} target="_blank" rel="noopener noreferrer" className="a-enlace">{t('training.mooc.linkEs')} <span aria-hidden="true">↗</span></a>
                  {moocEn?.url && (
                    <a href={moocEn.url} target="_blank" rel="noopener noreferrer" className="a-enlace">{t('training.mooc.linkEn')} <span aria-hidden="true">↗</span></a>
                  )}
                </Sube>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Cursos abiertos ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('training.open.title')} /></Sube>
          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <div>
              <Sube>
                <p className="a-texto">
                  {fill(t('training.open.p1'), {
                    title: dominando[0]?.title ?? '',
                    open: cardinal(dominandoOpen, lang),
                    org: cardinal(dominando.length - dominandoOpen, lang),
                    n: miles(dominando.reduce((s, c) => s + c.attendees, 0)),
                  })}
                </p>
              </Sube>
              <Sube><p className="a-texto mt-4">{t('training.open.p2')}</p></Sube>
            </div>
            <Sube delay={0.08}>
              <figure>
                <img src="/images/site/campus-mision-historia-y-simbolos-0.webp" alt={t('training.open.alt')} loading="lazy" className="a-bn w-full aspect-[4/3] object-cover" />
                <figcaption className="a-pie">{t('training.open.photo')}</figcaption>
              </figure>
            </Sube>
          </div>
        </div>
      </section>

      {/* ── Para organizaciones ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('training.orgs.title')} /></Sube>
          <div className="mt-12 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:items-start">
            <div>
              <Sube>
                <p className="a-texto">
                  {fill(t('training.orgs.p1'), { a: orgsDe(2024), b: orgsDe(2025), c: orgsDe(2026) })}
                </p>
              </Sube>
              <Sube><p className="a-texto mt-4">{fill(t('training.orgs.p2'), { n: cardinal(contraloria, lang) })}</p></Sube>
              <Sube><p className="a-texto mt-4">{t('training.orgs.p3')}</p></Sube>
              <Sube><p className="a-texto mt-4">{t('training.orgs.p4')}</p></Sube>
              <Sube className="mt-10">
                <Figura foto={fotos.ecopetrolOilGas} pie={t('training.orgs.photo')} lang={lang} />
              </Sube>
            </div>
            <Sube delay={0.06}>
              <figure>
                <h3 className="a-h3">{fill(t('training.orgs.list'), { n: cardinal(organizaciones.length, lang) })}.</h3>
                <table className="a-tabla mt-6">
                  <thead>
                    <tr>
                      <th scope="col">{t('training.orgs.col.org')}</th>
                      <th scope="col" className="num w-[6.5rem]">{t('training.orgs.col.n')}</th>
                      <th scope="col" className="hidden sm:table-cell w-[7.5rem]">{t('training.orgs.col.years')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listaOrganizaciones.map((o) => (
                      <tr key={o.id} className="transition-colors hover:bg-papel-100">
                        <td className="text-tinta-900">
                          {nombre(o.name)}
                          {o.detail && <span className="block text-tinta-600">{nombre(o.detail)}</span>}
                          <span className="block sm:hidden text-tinta-600 tabular-nums">{o.years.join(', ')}</span>
                        </td>
                        <td className="num text-tinta-900">{o.n}</td>
                        <td className="hidden sm:table-cell text-tinta-800 tabular-nums">{o.years.join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <figcaption className="a-pie">{fill(t('training.orgs.caption'), { year: desde })}</figcaption>
              </figure>
            </Sube>
          </div>

          {/* El muro de logos: el mismo peso visual para todos (área constante, con tope de ancho y alto). */}
          <Sube className="mt-20">
            <figure>
              <ul className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 border-t-2 border-tinta-900">
                {muro.map((l) => {
                  const area = 2600, maxW = 120, maxH = 52;
                  let h = Math.sqrt(area / l.ratio), w = h * l.ratio;
                  if (w > maxW) { w = maxW; h = w / l.ratio; }
                  if (h > maxH) { h = maxH; w = h * l.ratio; }
                  return (
                    <li key={l.slug} className="flex items-center justify-center h-24 sm:h-28 px-3 border-b-2 border-papel-300">
                      <img src={`/images/portafolio/logos/${l.slug}.svg`} alt={altLogo(l)} loading="lazy" className="block max-w-full h-auto opacity-80" style={{ width: Math.round(w) }} />
                    </li>
                  );
                })}
              </ul>
              <figcaption className="a-pie">{fill(t('training.orgs.wall'), { year: desde })}</figcaption>
            </figure>
          </Sube>
        </div>
      </section>

      {/* ── Todos los cursos ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('training.list.title')} /></Sube>
          <Sube delay={0.04}><p className="a-texto mt-8">{t('training.list.intro')}</p></Sube>
          <Sube delay={0.06}>
            <div className="a-filtros mt-8" role="group" aria-label={t('training.list.filters')}>
              {FILTERS.map((f) => (
                <button key={f.id} type="button" onClick={() => setFiltro(f.id)} aria-pressed={filtro === f.id}>
                  {t(f.label)}
                </button>
              ))}
            </div>
            <p className="a-meta mt-6 mb-6" aria-live="polite">
              {fill(t('training.list.count'), { n: filtrados.length, people: miles(inscritos) })}
            </p>
          </Sube>

          {/* Escritorio y tableta: el título se lleva la columna ancha */}
          <table className="a-tabla hidden md:table">
            <thead>
              <tr>
                <th scope="col" className="w-[5rem]">{t('training.col.year')}</th>
                <th scope="col">{t('training.col.course')}</th>
                <th scope="col" className="w-[30%]">{t('training.col.kind')}</th>
                <th scope="col" className="num w-[8.5rem]">{t('training.col.enrolled')}</th>
                <th scope="col" className="w-[8rem]">{t('training.col.role')}</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((c, i) => {
                const { secondary } = titulos(c);
                const canal = via(c);
                return (
                  <motion.tr
                    key={`${filtro}-${c.year}-${c.title}-${i}`}
                    className="transition-colors hover:bg-papel-200"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '0px 0px -5% 0px' }}
                    transition={{ duration: 0.45, ease: SALE }}
                  >
                    <td className="tabular-nums text-tinta-600">{c.year}</td>
                    <td>
                      {tituloDe(c)}
                      {secondary && <span className="block mt-1 text-[18px] leading-snug text-tinta-700">{secondary}</span>}
                      {c.note && <span className="block mt-1 text-tinta-600">{nombre(c.note)}</span>}
                    </td>
                    <td className="text-tinta-800">
                      <span className="block">{t(kindKey[kindOf(c)])}</span>
                      {c.client && c.channel !== 'coursera' && <span className="block text-tinta-600">{c.client}</span>}
                      {canal && <span className="block text-tinta-600">{canal}</span>}
                      {!isTaught(c, hoy) && !c.underConstruction && c.channel !== 'coursera' && <span className="block mt-1 text-tinta-900">{t('training.row.ongoing')}</span>}
                    </td>
                    <td className="num text-tinta-800">
                      {cuantos(c)}
                      {c.completionRate != null && (
                        <span className="block text-tinta-600">{fill(t('training.row.completed'), { pct: pct(c.completionRate) })}</span>
                      )}
                    </td>
                    <td className="text-tinta-800">{t(roleKey[c.role])}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>

          {/* Teléfono: cada curso apilado, sin desplazamiento lateral */}
          <ul className="md:hidden border-t-2 border-tinta-900">
            {filtrados.map((c, i) => {
              const { secondary } = titulos(c);
              const canal = via(c);
              return (
                <Sube as="li" key={`${filtro}-${c.year}-${c.title}-${i}`} className="py-5 border-b-2 border-papel-300">
                  <p className="a-meta">{c.year} · {t(kindKey[kindOf(c)])} · {t(roleKey[c.role])}</p>
                  <p className="mt-1">{tituloDe(c)}</p>
                  {secondary && <p className="a-s text-tinta-700">{secondary}</p>}
                  {c.note && <p className="a-s mt-1 text-tinta-600">{nombre(c.note)}</p>}
                  {c.client && c.channel !== 'coursera' && <p className="a-s mt-1 text-tinta-800">{c.client}</p>}
                  {canal && <p className="a-s text-tinta-800">{canal}</p>}
                  <p className="a-s text-tinta-800">
                    {c.underConstruction || c.attendeesUnknown ? cuantos(c) : fill(t('training.row.enrolled'), { n: miles(c.attendees) })}
                    {c.completionRate != null && ` · ${fill(t('training.row.completed'), { pct: pct(c.completionRate) })}`}
                    {!isTaught(c, hoy) && !c.underConstruction && c.channel !== 'coursera' && ` · ${t('training.row.ongoing')}`}
                  </p>
                </Sube>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── Los materiales, en el aula ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center">
            <Sube>
              <div className="overflow-hidden aspect-[16/9]">
                <img src={eduProCourse.bannerUrl} alt={t('training.room.alt')} loading="lazy" className="a-foto a-bn" />
              </div>
            </Sube>
            <Sube delay={0.06}>
              <h2 className="a-h3">{t('training.room.title')}.</h2>
              <p className="a-texto mt-4">{fill(t('training.room.p'), { n: cardinal(eduProCourse.edcoCourses?.length ?? 0, lang) })}</p>
              <Link to="/classroom" className="a-enlace inline-block mt-6">{t('training.room.cta')} <span aria-hidden="true">→</span></Link>
            </Sube>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};
