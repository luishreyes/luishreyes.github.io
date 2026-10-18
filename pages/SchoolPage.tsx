import React, { useDeferredValue, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/PageWrapper';
import { EncabezadoPagina, Cabecera } from '../components/Apertura';
import { Sube } from '../components/Sube';
import { fotos } from '../components/data/fotos';
import { studentsData, graduatedStudentsData } from '../components/data/students';
import { undergraduateStudents, UNDERGRADUATE_RECORD_SINCE, type UndergraduateStudent } from '../components/data/students/undergraduate';
import { testimonials, type Testimonial } from '../components/data/teaching';
import { graduateByName } from '../components/data/metrics';
import { useI18n, localize, fill, type UIKey, type Lang } from '../context/i18n';

/** Escuela: la investigación como una forma de hacer docencia. Un caso primero (Carlos), los de
 *  pregrado que siguieron, el curso de cerveza que se volvió escuela, dónde están los egresados,
 *  los doctores, lo que dicen ellos, las cifras y, al final, la lista completa de pregrado.
 *  Nada de dinero ni de juicios sobre las personas; de los empleadores de pregrado, solo el agregado. */

/** Texto con cursivas: lo que va entre asteriscos (especies, revistas) sale en <i>. */
const Rico: React.FC<{ texto: string }> = ({ texto }) => (
  <>{texto.split('*').map((s, i) => (i % 2 ? <i key={i}>{s}</i> : <React.Fragment key={i}>{s}</React.Fragment>))}</>
);

const comillas = (texto: string, lang: Lang) => (lang === 'es' ? `«${texto}»` : `“${texto}”`);
const plano = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/\*/g, '').toLowerCase();
const unir = (lista: string[], y: string) => (lista.length < 2 ? lista.join('') : `${lista.slice(0, -1).join(', ')} ${y} ${lista[lista.length - 1]}`);

const Figura: React.FC<{ src: string; alt: string; pie: string; proporcion?: string; posicion?: string; className?: string }> = ({
  src, alt, pie, proporcion = 'aspect-[4/3]', posicion = 'center', className = '',
}) => (
  <figure className={className}>
    <div className={`overflow-hidden ${proporcion}`}>
      <img src={src} alt={alt} loading="lazy" className="a-foto a-bn" style={{ objectPosition: posicion }} />
    </div>
    <figcaption className="a-pie">{pie}</figcaption>
  </figure>
);

/** Barras horizontales de una sola serie: el número va escrito al lado, así que la lista misma es
 *  la vista en tabla. La barra que se toca se marca con el resaltador. */
const Barras: React.FC<{ titulo: string; pie: string; filas: { nombre: string; n: number; suave?: boolean }[] }> = ({ titulo, pie, filas }) => {
  const max = Math.max(...filas.map((f) => f.n));
  return (
    <figure>
      <h3 className="a-h3">{titulo}.</h3>
      <ul className="mt-6 border-t-2 border-tinta-900">
        {filas.map((f) => (
          <li
            key={f.nombre}
            className="group grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 items-center py-3 border-b-2 border-papel-300 sm:grid-cols-[13rem_minmax(0,1fr)_2.5rem]"
          >
            <span className="leading-snug text-tinta-800">{f.nombre}</span>
            <span className="text-right font-semibold tabular-nums text-tinta-900 sm:col-start-3 sm:row-start-1">{f.n}</span>
            <span aria-hidden="true" className="col-span-2 h-3 sm:col-span-1 sm:col-start-2 sm:row-start-1">
              <span
                className={`block h-full transition-colors duration-200 group-hover:bg-resaltador ${f.suave ? 'bg-tinta-300' : 'bg-tinta-900'}`}
                style={{ width: `${Math.max(2, (f.n / max) * 100)}%` }}
              />
            </span>
          </li>
        ))}
      </ul>
      <figcaption className="a-pie">{pie}</figcaption>
    </figure>
  );
};

// Agregados de los egresados de maestría y doctorado según su cargo de hoy, y de las empresas que
// tienen a tres o más de mis estudiantes (de pregrado y de posgrado). Sin nombres de pregrado.
const DESTINOS: { clave: UIKey; n: number }[] = [
  { clave: 'school.dest.industry', n: 22 },
  { clave: 'school.dest.public', n: 1 },
  { clave: 'school.dest.academia', n: 9 },
  { clave: 'school.dest.phd', n: 2 },
  { clave: 'school.dest.own', n: 3 },
  { clave: 'school.dest.school', n: 1 },
];
const EMPRESAS: [string, number][] = [['Universidad de los Andes', 7], ['MSD', 4], ['Zimmer Biomet', 4], ['Quala', 4], ['Sanofi', 3]];
// Personas que codirigí con cada colega, según el registro académico (2018-10 a 2026-10).
const COLEGAS: [string, number][] = [
  ['Juan Carlos Cruz', 45], ['Diego Pradilla', 10], ['Andrés Fernando González', 9], ['Óscar Álvarez', 8],
  ['Nicolás Ríos Ratkovich', 6], ['María Hernández Carrión', 5], ['Jorge Mario Gómez', 5], ['Miguel Ángel Fernández Niño', 3],
];

// Los cuatro doctores, en el orden en que los cuenta el capítulo.
const DOCTORES: { nombre: string; texto: UIKey }[] = [
  { nombre: 'Julian Daniel Torres Vanegas', texto: 'school.phd.torres' },
  { nombre: 'Brayan Rodríguez', texto: 'school.phd.brayan' },
  { nombre: 'Julián Fernando Becerra-Encinales', texto: 'school.phd.becerra' },
  { nombre: 'Andrés Felipe Leal', texto: 'school.phd.leal' },
];

// Testimonios de dirigidos. Carlos y Angie ya hablan en su propio bloque; el resto, en este orden.
const YA_CITADOS = ['Carlos Manuel Ramírez Acosta', 'Angie Daniela Bolaños Barbosa'];
const ORDEN_VOCES = ['Brayan Rodríguez', 'Julián F. Becerra-Encinales', 'Julian Daniel Torres Vanegas', 'Cristian F. Rodríguez', 'María Camila Henao', 'Olga Lucía Acuña', 'Valentina Quezada', 'Juanita Sierra'];
const rolDe = (q: Testimonial) => (q.graduateName ? graduateByName(q.graduateName)?.currentPosition : undefined) || q.info;
const testimonioDe = (nombre: string) => testimonials.find((q) => q.name === nombre && q.category === 'Research Advising');

const Parrafos: React.FC<{ q: Testimonial; lang: Lang; className?: string }> = ({ q, lang, className = '' }) => {
  const partes = localize(q.quote, lang).split('\n\n');
  return (
    <>
      {partes.map((p, i) => (
        <p key={i} className={`${className} ${i ? 'mt-4' : ''}`}>
          {i === 0 ? (lang === 'es' ? '«' : '“') : ''}{p}{i === partes.length - 1 ? (lang === 'es' ? '»' : '”') : ''}
        </p>
      ))}
    </>
  );
};

/** Una persona de pregrado: su nombre, cada proyecto con su periodo y tipo, y con quién lo codirigí. */
const Pregrado: React.FC<{ p: UndergraduateStudent }> = ({ p }) => {
  const { t } = useI18n();
  return (
    <li className="grid gap-2 py-5 border-t-2 border-papel-300 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-10">
      <div>
        <p className="font-semibold leading-snug text-tinta-900">{p.name}</p>
        {p.alsoMasters && <p className="a-s mt-1 text-tinta-600">{t('school.ug.also')}</p>}
      </div>
      <div>
        {p.works.map((w) => (
          <div key={w.period + w.title} className="mb-3 last:mb-0">
            <p className="a-meta">
              {w.period} · {unir(w.types.map((tp) => t(`school.ug.type.${tp}` as UIKey)), t('school.ug.and').toLowerCase())}
            </p>
            <p className="mt-1 leading-snug text-tinta-800 max-w-[70ch]"><Rico texto={w.title} /></p>
          </div>
        ))}
        {p.coadvisors.length > 0 && (
          <p className="a-s mt-2 text-tinta-600">{fill(t('school.ug.with'), { names: unir(p.coadvisors, t('school.ug.and')) })}</p>
        )}
      </div>
    </li>
  );
};

const ListaPregrado: React.FC = () => {
  const { t } = useI18n();
  const [q, setQ] = useState('');
  // Solo se pinta la lista de los años abiertos: un <details> cerrado no necesita sus 30 filas.
  const [abiertos, setAbiertos] = useState<Set<string>>(() => new Set());
  const alternar = (ano: string, abierto: boolean) =>
    setAbiertos((prev) => { const n = new Set(prev); if (abierto) n.add(ano); else n.delete(ano); return n; });
  const busqueda = useDeferredValue(q);
  const cuenta = (n: number) => (n === 1 ? t('school.ug.count1') : fill(t('school.ug.count'), { n }));

  const porAno = useMemo(() => {
    const m = new Map<string, UndergraduateStudent[]>();
    for (const p of undergraduateStudents) {
      const ano = p.works[0].period.slice(0, 4);
      if (!m.has(ano)) m.set(ano, []);
      m.get(ano)!.push(p);
    }
    return [...m.entries()];
  }, []);

  const hallados = useMemo(() => {
    const k = plano(busqueda.trim());
    if (!k) return null;
    return undergraduateStudents.filter((p) => plano([p.name, ...p.coadvisors, ...p.works.map((w) => w.title)].join(' ')).includes(k));
  }, [busqueda]);

  return (
    <>
      <div className="mt-10 grid gap-4 sm:grid-cols-[minmax(0,26rem)_auto] sm:items-end sm:gap-8">
        <label className="block">
          <span className="a-s text-tinta-600">{t('school.ug.search')}</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="mt-2 block w-full min-h-[48px] px-4 bg-papel-100 text-tinta-900 border-0 border-b-2 border-tinta-900 focus:outline-none focus-visible:outline-2 focus-visible:outline-tinta-900"
          />
        </label>
        <p className="a-meta" aria-live="polite">{cuenta(hallados ? hallados.length : undergraduateStudents.length)}</p>
      </div>

      {hallados ? (
        hallados.length ? (
          <ul className="mt-8 border-b-2 border-papel-300">
            {hallados.map((p) => <Pregrado key={p.name} p={p} />)}
          </ul>
        ) : (
          <p className="mt-8 a-texto">{t('school.ug.none')}</p>
        )
      ) : (
        <div className="mt-8 border-t-2 border-tinta-900">
          {porAno.map(([ano, gente]) => (
            <details key={ano} className="group border-b-2 border-papel-300" onToggle={(e) => alternar(ano, (e.currentTarget as HTMLDetailsElement).open)}>
              <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-5 transition-colors hover:bg-resaltador-suave [&::-webkit-details-marker]:hidden">
                <span className="text-[length:var(--t-l)] font-semibold leading-none tabular-nums text-tinta-900">{ano}</span>
                <span className="a-meta">
                  {cuenta(gente.length)}
                  <span aria-hidden="true" className="ml-3 inline-block w-4 text-center text-tinta-900 group-open:hidden">+</span>
                  <span aria-hidden="true" className="ml-3 hidden w-4 text-center text-tinta-900 group-open:inline-block">−</span>
                </span>
              </summary>
              {abiertos.has(ano) && (
                <ul className="pb-4">
                  {gente.map((p) => <Pregrado key={p.name} p={p} />)}
                </ul>
              )}
            </details>
          ))}
        </div>
      )}
    </>
  );
};

export const SchoolPage: React.FC = () => {
  const { t, lang } = useI18n();
  const irA = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const egresados = graduatedStudentsData.phd.length + graduatedStudentsData.ms.length;
  const conocidos = DESTINOS.reduce((s, d) => s + d.n, 0);
  const destinos = [
    ...DESTINOS.map((d) => ({ nombre: t(d.clave), n: d.n })),
    { nombre: t('school.dest.none'), n: egresados - conocidos, suave: true },
  ];
  const doctores = DOCTORES.map((d) => ({ ...d, s: graduatedStudentsData.phd.find((g) => g.name === d.nombre) })).filter((d) => d.s);
  const carlos = testimonioDe('Carlos Manuel Ramírez Acosta');
  const angie = testimonioDe('Angie Daniela Bolaños Barbosa');
  const voces = testimonials
    .filter((q) => q.category === 'Research Advising' && !YA_CITADOS.includes(q.name))
    .sort((a, b) => {
      const ia = ORDEN_VOCES.indexOf(a.name), ib = ORDEN_VOCES.indexOf(b.name);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
  const doctorado = graduatedStudentsData.phd.length + studentsData.phd.length;

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('school.title')}
        entrada={
          <>
            <p>{t('school.lead')}</p>
            <p className="mt-6 text-[length:var(--t-m)] font-normal leading-[1.55] text-tinta-800 [text-wrap:pretty]">{t('school.intro')}</p>
          </>
        }
        foto={{ src: fotos.laboratorio.src, alt: t('school.photo'), posicion: 'center 40%' }}
        accion={{ label: t('school.cta'), onClick: () => irA('pregrado') }}
      />

      {/* ── Un caso primero: Carlos ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('school.case.title')} /></Sube>
          <div className="mt-12 grid gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
            <div>
              <Sube><p className="a-texto font-medium text-tinta-900">{t('school.case.p0')}</p></Sube>
              <Sube className="mt-12"><h3 className="a-h3">Carlos Manuel Ramírez Acosta.</h3></Sube>
              <Sube className="mt-6"><p className="a-texto">{t('school.case.p1')}</p></Sube>
              <Sube className="mt-3">
                <Link to="/teaching/testimonials" className="a-enlace a-s">{t('school.case.pandas')} <span aria-hidden="true">→</span></Link>
              </Sube>
              <Sube className="mt-6"><p className="a-texto">{t('school.case.p2')}</p></Sube>
              <Sube className="mt-4"><p className="a-texto"><Rico texto={t('school.case.p3')} /></p></Sube>
            </div>
            <Sube delay={0.08} className="lg:sticky lg:top-24">
              <Figura src={fotos.gradoCarlos.src} alt={localize(fotos.gradoCarlos.alt, lang)} pie={`${localize(fotos.gradoCarlos.alt, lang)}.`} posicion="center 40%" />
              {carlos && (
                <figure className="mt-14">
                  <blockquote className="a-cita"><p>{localize(carlos.quote, lang)}</p></blockquote>
                  <figcaption className="a-quien">{t('school.case.quoteBy')}</figcaption>
                </figure>
              )}
            </Sube>
          </div>
        </div>
      </section>

      {/* ── Los que siguieron ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('school.kept.title')} /></Sube>
          <Sube className="mt-10"><p className="a-entrada max-w-[56ch]">{t('school.kept.lead')}</p></Sube>
          <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
            <ul className="border-t-2 border-tinta-900">
              {([
                ['school.kept.pub.t', 'school.kept.pub.p'],
                ['school.kept.peer.t', 'school.kept.peer.p'],
                ['school.kept.grad.t', 'school.kept.grad.p'],
              ] as [UIKey, UIKey][]).map(([titulo, texto], i) => (
                <Sube as="li" key={titulo} delay={0.05 * i} className="py-8 border-b-2 border-papel-300">
                  <h3 className="a-h3">{t(titulo)}.</h3>
                  <p className="a-texto mt-4">
                    <Rico texto={fill(t(texto), { n: 13, total: undergraduateStudents.length })} />
                  </p>
                </Sube>
              ))}
            </ul>
            <Sube delay={0.1} className="lg:sticky lg:top-24">
              <Figura src={fotos.egresadosAiche.src} alt={localize(fotos.egresadosAiche.alt, lang)} pie={t('school.kept.photo')} />
              <button type="button" onClick={() => irA('pregrado')} className="a-enlace mt-8 text-left">
                {t('school.kept.link')} <span aria-hidden="true">↓</span>
              </button>
            </Sube>
          </div>
        </div>
      </section>

      {/* ── Un curso que se volvió escuela ── */}
      <section className="a-portada a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('school.course.title')} /></Sube>
          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
            <Sube className="lg:sticky lg:top-24">
              <Figura src={fotos.cervezaGlucanos.src} alt={localize(fotos.cervezaGlucanos.alt, lang)} pie={t('school.course.photo')} proporcion="aspect-[4/3] lg:aspect-[4/5]" posicion="center 75%" />
            </Sube>
            <div>
              {(['school.course.p1', 'school.course.p2', 'school.course.p3', 'school.course.p4', 'school.course.p5'] as UIKey[]).map((k, i) => (
                <Sube key={k} className={i ? 'mt-4' : ''}><p className="a-texto"><Rico texto={t(k)} /></p></Sube>
              ))}
            </div>
          </div>

          <Sube className="mt-20">
            <figure>
              <h3 className="a-h3">{t('school.course.line')}.</h3>
              <ol className="mt-8 grid border-t-2 border-tinta-900 md:grid-cols-5 md:gap-x-6">
                {[1, 2, 3, 4, 5].map((n) => (
                  <li key={n} className="py-6 border-b-2 border-papel-400 md:border-b-0">
                    <span aria-hidden="true" className="mb-4 block h-2.5 w-2.5 bg-tinta-900" />
                    <p className="a-meta">{t(`school.course.s${n}.when` as UIKey)}</p>
                    <p className="mt-2 font-semibold leading-snug text-tinta-900">{t(`school.course.s${n}.what` as UIKey)}</p>
                    <p className="a-s mt-2 leading-snug text-tinta-800">{t(`school.course.s${n}.text` as UIKey)}</p>
                  </li>
                ))}
              </ol>
            </figure>
          </Sube>

          {angie && (
            <Sube className="mt-20">
              <figure className="grid gap-8 border-t-2 border-tinta-900 pt-10 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-12">
                <img src={angie.imageUrl} alt={angie.name} loading="lazy" className="a-bn w-40 aspect-[4/5] object-cover object-top md:w-full" />
                <div>
                  <blockquote className="max-w-[64ch]">
                    <Parrafos q={angie} lang={lang} className="text-tinta-900" />
                  </blockquote>
                  <figcaption className="mt-6">
                    <span className="block font-semibold text-tinta-900">{angie.name}</span>
                    <span className="a-meta block">{localize(rolDe(angie), lang)}</span>
                    <span className="a-meta block">{localize(angie.context, lang)}</span>
                  </figcaption>
                </div>
              </figure>
            </Sube>
          )}
        </div>
      </section>

      {/* ── Dónde están hoy ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('school.ms.title')} /></Sube>
          <div className="mt-12 grid gap-x-14 gap-y-4 lg:grid-cols-2">
            <Sube><p className="a-texto">{fill(t('school.ms.p1'), { total: egresados, known: conocidos })}</p></Sube>
            <Sube delay={0.06}>
              <p className="a-texto">{t('school.ms.p2')}</p>
              <p className="a-texto">{t('school.ms.p3')}</p>
            </Sube>
          </div>
          <div className="mt-16 grid gap-16 lg:grid-cols-2">
            <Sube>
              <Barras titulo={t('school.ms.dest.title')} pie={fill(t('school.ms.dest.caption'), { total: egresados, known: conocidos })} filas={destinos} />
            </Sube>
            <Sube delay={0.06}>
              <Barras titulo={t('school.ms.firms.title')} pie={t('school.ms.firms.caption')} filas={EMPRESAS.map(([nombre, n]) => ({ nombre, n }))} />
            </Sube>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <Sube><Figura src={fotos.acs2026.src} alt={localize(fotos.acs2026.alt, lang)} pie={`${localize(fotos.acs2026.alt, lang)}.`} proporcion="aspect-[16/10]" posicion="70% center" /></Sube>
            <Sube delay={0.06}><Figura src={fotos.medellin.src} alt={localize(fotos.medellin.alt, lang)} pie={`${localize(fotos.medellin.alt, lang)}.`} proporcion="aspect-[16/10] md:aspect-[4/5]" /></Sube>
          </div>
          <Sube className="mt-10">
            <Link to="/research/students" className="a-enlace">{t('school.ms.link')} <span aria-hidden="true">→</span></Link>
          </Sube>
        </div>
      </section>

      {/* ── Formar doctores ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('school.phd.title')} /></Sube>
          <Sube className="mt-10"><p className="a-entrada max-w-[52ch]">{t('school.phd.lead')}</p></Sube>
          <ul className="mt-12 border-t-2 border-tinta-900">
            {doctores.map(({ nombre, texto, s }, i) => (
              <Sube
                as="li"
                key={nombre}
                delay={0.04 * i}
                className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-5 gap-y-5 py-10 border-b-2 border-papel-300 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-x-8 lg:grid-cols-[11rem_minmax(0,17rem)_minmax(0,1fr)] lg:gap-x-12"
              >
                <img src={s!.imageUrl} alt={nombre} loading="lazy" className="a-bn w-full aspect-[4/5] object-cover object-top" />
                <div>
                  <h3 className="a-h3">{nombre}.</h3>
                  <p className="a-meta mt-3">{localize(s!.program, lang)} · {s!.graduationYear}</p>
                </div>
                <p className="a-texto col-span-2 lg:col-span-1"><Rico texto={t(texto)} /></p>
              </Sube>
            ))}
          </ul>
          <Sube className="mt-14">
            <p className="a-texto font-medium text-tinta-900">{t('school.phd.close')}</p>
            <Link to="/teaching/philosophy" className="a-enlace mt-4 inline-block">{t('school.phd.philosophy')} <span aria-hidden="true">→</span></Link>
          </Sube>
          <div className="mt-14 grid gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <Sube><Figura src={fotos.gradoBrayan.src} alt={localize(fotos.gradoBrayan.alt, lang)} pie={t('school.phd.brayanPhoto')} proporcion="aspect-[3/2]" posicion="center 35%" /></Sube>
            <Sube delay={0.06}><Figura src={fotos.gradoJulian.src} alt={localize(fotos.gradoJulian.alt, lang)} pie={t('school.phd.julianPhoto')} proporcion="aspect-[4/5] md:aspect-square" posicion="center 30%" /></Sube>
          </div>

          <div className="mt-20 grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
            <div>
              <Sube><h3 className="a-h3">{t('school.phd.current')}.</h3></Sube>
              <ul className="mt-6 border-t-2 border-tinta-900">
                {studentsData.phd.map((s, i) => (
                  <Sube as="li" key={s.name} delay={0.04 * i} className="py-6 border-b-2 border-papel-300">
                    <p className="font-semibold text-tinta-900 text-[length:var(--t-l)] leading-tight tracking-[-0.02em]">{s.name}</p>
                    <p className="a-texto mt-2">{localize(s.info, lang)}</p>
                  </Sube>
                ))}
              </ul>
            </div>
            <Sube delay={0.08} className="lg:mt-14">
              <Figura src={fotos.marthaAiche.src} alt={localize(fotos.marthaAiche.alt, lang)} pie={`${localize(fotos.marthaAiche.alt, lang)}.`} proporcion="aspect-[4/5]" posicion="60% center" />
            </Sube>
          </div>
        </div>
      </section>

      {/* ── Lo que dicen ellos ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('school.voices.title')} /></Sube>
          <Sube className="mt-10">
            <p className="a-texto">{t('school.voices.intro')}</p>
            <p className="a-entrada mt-4 max-w-[56ch]">
              {t('school.voices.leadA')} <span className="a-resaltado font-semibold">{t('school.voices.leadB')}</span>.
            </p>
          </Sube>
          <div className="mt-14 lg:columns-2 lg:gap-16">
            {voces.map((q, i) => (
              <Sube key={`${q.name}-${q.category}`} delay={0.03 * (i % 4)} className="break-inside-avoid pb-14">
                <figure>
                  <div className="flex items-end gap-5 border-t-2 border-tinta-900 pt-6">
                    <img src={q.imageUrl} alt={q.name} loading="lazy" className="a-bn h-[120px] w-[120px] flex-shrink-0 object-cover object-top" />
                    <figcaption className="min-w-0">
                      <span className="block font-semibold leading-tight text-tinta-900">{q.name}</span>
                      <span className="a-meta mt-1 block">{localize(rolDe(q), lang)}</span>
                      <span className="a-meta block">{localize(q.context, lang)}</span>
                    </figcaption>
                  </div>
                  <blockquote className="mt-6 max-w-[64ch]">
                    <Parrafos q={q} lang={lang} className="text-tinta-900" />
                  </blockquote>
                </figure>
              </Sube>
            ))}
          </div>
          <Sube>
            <Link to="/teaching/testimonials" className="a-enlace">{t('school.voices.more')} <span aria-hidden="true">→</span></Link>
          </Sube>
        </div>
      </section>

      {/* ── Las cifras ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('school.n.title')} /></Sube>
          <Sube className="mt-14">
            <div className="a-cifras">
              <div><b>174</b><span>{t('school.n.people')}</span></div>
              <div><b>{undergraduateStudents.length}</b><span>{t('school.n.ug')}</span></div>
              <div><b>40</b><span>{t('school.n.ms')}</span></div>
              <div><b>{doctorado}</b><span>{t('school.n.phd')}</span></div>
              <div><b>13</b><span>{t('school.n.coauthors')}</span></div>
              <div><b>33</b><span>{t('school.n.talks')}</span></div>
            </div>
          </Sube>
          <div className="mt-16 grid gap-x-14 gap-y-4 lg:grid-cols-2">
            <Sube>
              <p className="a-texto">{t('school.n.p1')}</p>
              <p className="a-texto">{t('school.n.p2')}</p>
              <p className="a-texto">{t('school.n.p3')}</p>
            </Sube>
            <Sube delay={0.06}><p className="a-texto">{t('school.n.p4')}</p></Sube>
          </div>
          <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:items-start">
            <Sube>
              <Barras titulo={t('school.n.colleagues')} pie={t('school.n.colleagues.caption')} filas={COLEGAS.map(([nombre, n]) => ({ nombre, n }))} />
              <p className="a-s mt-4 text-tinta-800">{t('school.n.others')}: {t('school.n.othersEach')}.</p>
            </Sube>
            <div>
              <Sube><h3 className="a-h3">{t('school.table.title')}.</h3></Sube>
              <Sube className="mt-6"><p className="a-texto">{t('school.table.p1')}</p></Sube>
              <div className="mt-8 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.78fr)]">
                <Sube><Figura src={fotos.sesionOlga.src} alt={localize(fotos.sesionOlga.alt, lang)} pie={t('school.table.olga')} proporcion="aspect-[4/3] sm:aspect-[3/4]" posicion="center 35%" /></Sube>
                <Sube delay={0.06}><Figura src={fotos.mentoria.src} alt={localize(fotos.mentoria.alt, lang)} pie={t('school.table.enrique')} proporcion="aspect-[4/3]" /></Sube>
              </div>
              <Sube className="mt-8"><p className="a-texto"><Rico texto={t('school.table.p2')} /></p></Sube>
            </div>
          </div>
        </div>
      </section>

      {/* ── Los de pregrado ── */}
      <section id="pregrado" className="a-papel a-campo scroll-mt-16">
        <div className="a-c">
          <Sube><Cabecera titulo={t('school.ug.title')} /></Sube>
          <Sube className="mt-10"><p className="a-texto">{fill(t('school.ug.intro'), { since: UNDERGRADUATE_RECORD_SINCE })}</p></Sube>
          <ListaPregrado />
          <div className="mt-12">
            <Link to="/research/students" className="a-enlace">{t('school.ug.graduate')} <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};
