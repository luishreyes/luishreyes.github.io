import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../../components/PageWrapper';
import { EncabezadoPagina } from '../../components/Apertura';
import { Sube, SALE } from '../../components/Sube';
import { motion } from 'framer-motion';
import { teachingData, type TaughtCourse } from '../../components/data/teaching';
import { metrics } from '../../components/data/metrics';
import { pou202620Course } from '../../components/data/classroom/pou-2026-20';
import { useI18n, localize, fill, num, type UIKey } from '../../context/i18n';
import { fotos } from '../../components/data/fotos';

type FilterType = 'All' | 'Core' | 'Elective' | 'CBU' | 'Undergraduate' | 'Graduate';
const filterOptions: FilterType[] = ['All', 'Core', 'Elective', 'CBU', 'Undergraduate', 'Graduate'];
const filterLabelKey: Record<FilterType, UIKey> = {
  All: 'courses.filter.all',
  Core: 'courses.filter.core',
  Elective: 'courses.filter.elective',
  CBU: 'courses.filter.cbu',
  Undergraduate: 'courses.filter.undergraduate',
  Graduate: 'courses.filter.graduate',
};
const typeKey: Record<TaughtCourse['type'], UIKey> = {
  Core: 'teaching.type.core',
  Elective: 'teaching.type.elective',
  CBU: 'teaching.type.cbu',
  EDCO: 'teaching.type.edco',
  Corporate: 'teaching.type.corporate',
  Coursera: 'teaching.type.coursera',
};
const levelKey: Record<NonNullable<TaughtCourse['level']>, UIKey> = {
  Undergraduate: 'courses.filter.undergraduate',
  Graduate: 'courses.filter.graduate',
};

const ordenados = [...teachingData].sort((a, b) => b.term.localeCompare(a.term));

// El rango de las evaluaciones de los últimos tres años, para leer la columna con contexto.
const recientes = teachingData
  .filter((c) => c.evaluation !== null && c.year >= Math.max(...teachingData.map((x) => x.year)) - 2)
  .map((c) => c.evaluation as number);

// Dos capturas de los simuladores que tiene el aula del curso, con su nombre traducido.
const SIMULADORES: Record<string, UIKey> = {
  'explorador-bombas-centrifugas': 'unitops.today.pumps',
  'explorador-intercambiadores': 'unitops.today.exchangers',
};
const simuladores = (pou202620Course.simulations ?? []).filter((s) => s.id in SIMULADORES);

export const CoursesPage: React.FC = () => {
  const { t, lang } = useI18n();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const miles = (n: number) => n.toLocaleString(lang === 'es' ? 'es-CO' : 'en-US');
  const puntaje = (v: number) => (Number.isInteger(v) ? String(v) : num(v, lang, 1));

  const filtrados = useMemo(() => {
    if (activeFilter === 'All') return ordenados;
    return ordenados.filter((c) =>
      activeFilter === 'Undergraduate' || activeFilter === 'Graduate' ? c.level === activeFilter : c.type === activeFilter,
    );
  }, [activeFilter]);
  const estudiantes = filtrados.reduce((s, c) => s + (c.students || 0), 0);

  const tipo = (c: TaughtCourse) =>
    [t(typeKey[c.type]), c.level ? t(levelKey[c.level]) : null].filter(Boolean).join(' · ');

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('courses.title')}
        entrada={<p>{fill(t('courses.sub'), { firstYear: metrics.teaching.firstYear })}</p>}
        foto={{ src: fotos.cervezaProteinas.src, alt: localize(fotos.cervezaProteinas.alt, lang), posicion: 'center 30%' }}
      >
        <div className="a-filtros mt-10" role="group" aria-label={t('courses.col.type')}>
          {filterOptions.map((f) => (
            <button key={f} type="button" onClick={() => setActiveFilter(f)} aria-pressed={activeFilter === f}>
              {t(filterLabelKey[f])}
            </button>
          ))}
        </div>
      </EncabezadoPagina>

      <section className="a-papel pb-24 sm:pb-32">
        <div className="a-c">
          <p className="a-meta mb-6" aria-live="polite">
            {fill(t('courses.count'), { n: filtrados.length, students: miles(estudiantes) })}
          </p>

          {/* Escritorio y tableta: la tabla de verdad */}
          <table className="a-tabla hidden md:table">
            <thead>
              <tr>
                <th scope="col" className="w-[7rem]">{t('courses.col.term')}</th>
                <th scope="col">{t('courses.col.course')}</th>
                <th scope="col" className="w-[13rem]">{t('courses.col.type')}</th>
                <th scope="col" className="num w-[7rem]">{t('courses.col.students')}</th>
                <th scope="col" className="num w-[7rem]">{t('courses.col.evaluation')}</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((c, i) => (
                <motion.tr
                  key={`${activeFilter}-${c.term}-${c.code}-${i}`}
                  className="transition-colors hover:bg-papel-100"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -5% 0px' }}
                  transition={{ duration: 0.45, ease: SALE }}
                >
                  <td className="tabular-nums text-tinta-600">{c.term}</td>
                  <td>
                    <span className="block text-[18px] leading-snug font-semibold text-tinta-900">{localize(c.title, lang)}</span>
                    <span className="block text-tinta-600">{c.code}</span>
                  </td>
                  <td className="text-tinta-800">{tipo(c)}</td>
                  <td className="num text-tinta-800">{c.students}</td>
                  <td className="num text-[18px] font-semibold text-tinta-900">
                    {c.evaluation !== null ? puntaje(c.evaluation) : <span aria-label={t('courses.row.noEval')} className="text-tinta-500">—</span>}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* Teléfono: cada curso apilado, sin desplazamiento lateral */}
          <ul className="md:hidden border-t-2 border-tinta-900">
            {filtrados.map((c, i) => (
              <Sube as="li" key={`${activeFilter}-${c.term}-${c.code}-${i}`} className="py-5 border-b-2 border-papel-300">
                <p className="a-meta">{c.term} · {c.code}</p>
                <p className="mt-1 text-[18px] leading-snug font-semibold text-tinta-900">{localize(c.title, lang)}</p>
                <p className="a-s mt-1 text-tinta-800">
                  {tipo(c)} · {fill(t('courses.row.students'), { n: c.students })}
                </p>
                <p className="a-s text-tinta-800">
                  {c.evaluation !== null ? fill(t('courses.row.evaluation'), { score: puntaje(c.evaluation) }) : t('courses.row.noEval')}
                </p>
              </Sube>
            ))}
          </ul>

          <p className="mt-10 a-texto">
            {fill(t('courses.evalNote'), { low: Math.min(...recientes), high: Math.max(...recientes) })}
          </p>
        </div>
      </section>

      {/* ── Los cursos que tienen aula en el sitio ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('courses.classroom.title')}.</h2></Sube>
          <Sube delay={0.05}><p className="mt-4 a-texto">{t('courses.classroom.text')}</p></Sube>

          <div className="mt-12 grid gap-x-8 gap-y-14 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <Sube>
              <div className="overflow-hidden aspect-[16/10]">
                <img src={fotos.pouDiagrama.src} alt={localize(fotos.pouDiagrama.alt, lang)} loading="lazy" className="a-foto" />
              </div>
              <p className="mt-4 text-tinta-900">
                {fill(t('courses.classroom.pou'), { term: pou202620Course.term, n: pou202620Course.simulations?.length ?? 0 })}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {simuladores.map((s) => (
                  <figure key={s.id}>
                    <div data-ui className="overflow-hidden bg-white">
                      <img src={s.bannerImg} alt={t(SIMULADORES[s.id])} loading="lazy" className="block w-full h-auto" />
                    </div>
                    <figcaption className="a-pie mt-2">{t(SIMULADORES[s.id])}</figcaption>
                  </figure>
                ))}
              </div>
            </Sube>
            <Sube delay={0.08}>
              <div className="overflow-hidden aspect-[16/10]">
                <img src={fotos.equiposTapabocas.src} alt={localize(fotos.equiposTapabocas.alt, lang)} loading="lazy" className="a-foto" />
              </div>
              <p className="mt-4 text-tinta-900">{t('courses.classroom.dpro')}</p>
              <Link to="/classroom" className="a-boton mt-8">
                {t('courses.classroom.cta')} <span aria-hidden="true">→</span>
              </Link>
            </Sube>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};
