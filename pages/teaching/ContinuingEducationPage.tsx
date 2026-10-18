import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageWrapper } from '../../components/PageWrapper';
import { EncabezadoPagina } from '../../components/Apertura';
import { StatsSection } from '../../components/StatsSection';
import { Sube, SALE } from '../../components/Sube';
import { edcoCoursesData, type EdcoCourse } from '../../components/data/edco';
import { eduProCourse } from '../../components/data/classroom/edu-pro';
import { useI18n, fill, localize, type UIKey } from '../../context/i18n';
import { fotos } from '../../components/data/fotos';

type FilterType = 'All' | EdcoCourse['type'];
const filterOptions: FilterType[] = ['All', 'Open Course', 'Corporate Course', 'Summer School'];
const typeKey: Record<FilterType, UIKey> = {
  All: 'contEd.filter.all',
  'Open Course': 'contEd.filter.open',
  'Corporate Course': 'contEd.filter.corporate',
  'Summer School': 'contEd.filter.summer',
};
const roleKey: Record<EdcoCourse['role'], UIKey> = {
  Instructor: 'contEd.role.instructor',
  Coordinator: 'contEd.role.coordinator',
};

const MOOC = 'Coursera (MOOC)';
const ordenados = [...edcoCoursesData].sort((a, b) => b.year - a.year);
const primerAno = Math.min(...edcoCoursesData.map((c) => c.year));
const presenciales = edcoCoursesData.filter((c) => c.client !== MOOC);
const moocs = edcoCoursesData.filter((c) => c.client === MOOC);
// El MOOC con más inscritos y página pública: la acción de la primera pantalla.
const moocPrincipal = [...moocs].filter((c) => c.url).sort((a, b) => b.attendees - a.attendees)[0];
const comoInstructor = edcoCoursesData.filter((c) => c.role === 'Instructor').length;
const comoCoordinador = edcoCoursesData.filter((c) => c.role === 'Coordinator').length;

export const ContinuingEducationPage = () => {
  const { t, lang } = useI18n();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const miles = (n: number) => n.toLocaleString(lang === 'es' ? 'es-CO' : 'en-US');

  const filtrados = useMemo(
    () => (activeFilter === 'All' ? ordenados : ordenados.filter((c) => c.type === activeFilter)),
    [activeFilter],
  );
  const participantes = filtrados.reduce((s, c) => s + c.attendees, 0);

  const stats = [
    { label: fill(t('contEd.stat.programs'), { year: primerAno }), value: edcoCoursesData.length },
    { label: t('contEd.stat.inPerson'), value: presenciales.reduce((s, c) => s + c.attendees, 0) },
    { label: t('contEd.stat.mooc'), value: moocs.reduce((s, c) => s + c.attendees, 0) },
    { label: t('contEd.stat.corporate'), value: edcoCoursesData.filter((c) => c.type === 'Corporate Course').length },
  ];

  const titulos = (c: EdcoCourse) => {
    const primary = lang === 'en' && c.titleEn ? c.titleEn : c.title;
    const secondary = lang === 'en' ? c.title : c.titleEn;
    return { primary, secondary: secondary && secondary !== primary ? secondary : null };
  };
  const tituloDe = (c: EdcoCourse) => {
    const { primary } = titulos(c);
    const clase = 'text-[18px] leading-snug font-semibold text-tinta-900';
    return c.url ? (
      <a href={c.url} target="_blank" rel="noopener noreferrer" className={`${clase} underline decoration-1 underline-offset-[3px] hover:bg-resaltador-suave transition-colors`}>
        {primary} <span aria-hidden="true">↗</span>
      </a>
    ) : (
      <span className={clase}>{primary}</span>
    );
  };
  const asistentes = (c: EdcoCourse) => (
    <>
      {miles(c.attendees)}
      {c.completionRate != null && (
        <span className="block text-tinta-600">{fill(t('contEd.row.completed'), { pct: Math.round(c.completionRate * 100) })}</span>
      )}
    </>
  );

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('contEd.title')}
        entrada={
          <>
            <p>{t('contEd.lead')}</p>
            <p className="mt-6 text-[18px] leading-[1.55] font-normal text-tinta-800">{t('contEd.sub')}</p>
          </>
        }
        foto={{ src: '/images/site/img-4560-2.jpg', alt: t('contEd.hero.alt'), posicion: '18% 50%' }}
        accion={moocPrincipal ? { href: moocPrincipal.url, label: t('contEd.cta') } : undefined}
      />

      {/* ── Cifras ── */}
      <section className="a-hundido py-16 sm:py-20">
        <div className="a-c">
          <Sube><StatsSection stats={stats} isLoading={false} /></Sube>
        </div>
      </section>

      {/* ── Todos los programas ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('contEd.list.title')}.</h2></Sube>
          <Sube delay={0.05}>
            <div className="a-filtros mt-8" role="group" aria-label={t('contEd.col.type')}>
              {filterOptions.map((f) => (
                <button key={f} type="button" onClick={() => setActiveFilter(f)} aria-pressed={activeFilter === f}>
                  {t(typeKey[f])}
                </button>
              ))}
            </div>
            <p className="a-meta mt-6 mb-6" aria-live="polite">
              {fill(t('contEd.count'), { n: filtrados.length, people: miles(participantes) })}
            </p>
          </Sube>

          {/* Escritorio y tableta: el título se lleva la columna ancha */}
          <table className="a-tabla hidden md:table">
            <thead>
              <tr>
                <th scope="col" className="w-[5rem]">{t('contEd.col.year')}</th>
                <th scope="col">{t('contEd.col.title')}</th>
                <th scope="col" className="w-[30%]">{t('contEd.col.type')}</th>
                <th scope="col" className="num w-[8.5rem]">{t('contEd.col.attendees')}</th>
                <th scope="col" className="w-[8rem]">{t('contEd.col.role')}</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((c, i) => {
                const { secondary } = titulos(c);
                return (
                  <motion.tr
                    key={`${activeFilter}-${c.year}-${c.title}-${i}`}
                    className="transition-colors hover:bg-papel-100"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '0px 0px -5% 0px' }}
                    transition={{ duration: 0.45, ease: SALE }}
                  >
                    <td className="tabular-nums text-tinta-600">{c.year}</td>
                    <td>
                      {tituloDe(c)}
                      {secondary && <span className="block mt-1 text-[18px] leading-snug text-tinta-700">{secondary}</span>}
                    </td>
                    <td className="text-tinta-800">
                      <span className="block">{t(typeKey[c.type])}</span>
                      {c.client && <span className="block text-tinta-600">{c.client}</span>}
                    </td>
                    <td className="num text-tinta-800">{asistentes(c)}</td>
                    <td className="text-tinta-800">{t(roleKey[c.role])}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>

          {/* Teléfono: cada programa apilado, sin desplazamiento lateral */}
          <ul className="md:hidden border-t-2 border-tinta-900">
            {filtrados.map((c, i) => {
              const { secondary } = titulos(c);
              return (
                <Sube as="li" key={`${activeFilter}-${c.year}-${c.title}-${i}`} className="py-5 border-b-2 border-papel-300">
                  <p className="a-meta">{c.year} · {t(typeKey[c.type])} · {t(roleKey[c.role])}</p>
                  <p className="mt-1">{tituloDe(c)}</p>
                  {secondary && <p className="a-s text-tinta-700">{secondary}</p>}
                  {c.client && <p className="a-s mt-1 text-tinta-800">{c.client}</p>}
                  <p className="a-s text-tinta-800">
                    {fill(t('contEd.row.attendees'), { n: miles(c.attendees) })}
                    {c.completionRate != null && ` · ${fill(t('contEd.row.completed'), { pct: Math.round(c.completionRate * 100) })}`}
                  </p>
                </Sube>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── Quién, dónde y con qué ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('contEd.behind.title')}.</h2></Sube>
          <Sube delay={0.04}>
            <p className="mt-4 a-texto">
              {fill(t('contEd.behind.instructor'), { n: comoInstructor, total: edcoCoursesData.length, c: comoCoordinador })}
            </p>
          </Sube>
          <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_minmax(0,1.2fr)]">
            <Sube as="div">
              <figure>
                <div className="overflow-hidden aspect-[4/5]">
                  <img src={fotos.grabacionMooc.src} alt={localize(fotos.grabacionMooc.alt, lang)} loading="lazy" className="a-foto object-top" />
                </div>
                <figcaption className="mt-4 text-tinta-900">
                  {localize(fotos.grabacionMooc.alt, lang)}.{' '}
                  {fill(t('contEd.behind.mooc'), {
                    n: miles(moocs.reduce((s, c) => s + c.attendees, 0)),
                    c: miles(moocs.reduce((s, c) => s + Math.round(c.attendees * (c.completionRate ?? 0)), 0)),
                  })}
                </figcaption>
              </figure>
            </Sube>
            <Sube delay={0.06}>
              <figure>
                <div className="overflow-hidden aspect-[4/5] md:aspect-[5/6]">
                  <img src="/images/site/campus-mision-historia-y-simbolos-0.webp" alt={t('contEd.campus.alt')} loading="lazy" className="a-foto a-bn" />
                </div>
                <figcaption className="mt-4 text-tinta-900">{t('contEd.behind.campus')}</figcaption>
              </figure>
            </Sube>
            <Sube delay={0.12}>
              <figure>
                <div className="overflow-hidden aspect-[4/5] md:aspect-[5/6]">
                  <img src={eduProCourse.bannerUrl} alt={t('contEd.classroom.alt')} loading="lazy" className="a-foto a-bn" />
                </div>
                <figcaption className="mt-4 text-tinta-900">
                  {fill(t('contEd.behind.classroom'), { n: eduProCourse.edcoCourses?.length ?? 0 })}
                </figcaption>
                <Link to="/classroom" className="a-enlace inline-block mt-4">{t('contEd.behind.cta')} <span aria-hidden="true">→</span></Link>
              </figure>
            </Sube>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};
