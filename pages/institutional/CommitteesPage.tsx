import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageWrapper } from '../../components/PageWrapper';
import { EncabezadoPagina, Cabecera } from '../../components/Apertura';
import { Sube } from '../../components/Sube';
import { CommitteeCard } from '../../components/CommitteeCard';
import { useI18n, fill, localize, cardinal, type UIKey, type Lang } from '../../context/i18n';
import { fotos } from '../../components/data/fotos';
import {
  committeesData,
  leadershipRolesData,
  ethicsCommitteeLoad,
  ethicsWeeks,
  ethicsCasesEstimate,
  evaluationCallsData,
  evaluationUniversities,
  facultyEvaluationsData,
  externalJuriesData,
  type EvaluationCall,
  type EvaluationRecord,
} from '../../components/data/institutional';
import type { Committee } from '../../types';

const ESTE_ANIO = new Date().getFullYear();
const vigente = (c: Committee) => c.endYear === 'Present' || (typeof c.endYear === 'number' && c.endYear >= ESTE_ANIO);
const fin = (c: Committee) => (c.endYear === 'Present' ? Infinity : c.endYear ?? c.startYear);
const numero = (n: number, lang: Lang) => n.toLocaleString(lang === 'es' ? 'es-CO' : 'en-US');
const suma = (cs: EvaluationCall[]) => cs.reduce((s, c) => s + c.proposals, 0);

/** «2021-10» → «2021-1»: el semestre como lo dice cualquiera. */
const semestre = (codigo: string) => codigo.replace(/-(\d)0$/, '-$1');

/** Las semanas de clase del Comité de Ética: un cuadro por semana, un renglón por semestre. */
const SemanasEtica: React.FC = () => {
  const { t, lang } = useI18n();
  const { fullSemesters, weeksPerSemester, currentSemester, weeksIntoCurrentSemester } = ethicsCommitteeLoad;
  const filas = [
    ...fullSemesters.map((s) => ({ s, semanas: weeksPerSemester, enCurso: false })),
    { s: currentSemester, semanas: weeksIntoCurrentSemester, enCurso: true },
  ];
  return (
    <figure>
      <h3 className="a-h3">{t('svc.ethics.fig.title')}</h3>
      <p className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <b className="text-[length:var(--t-titulo)] leading-none font-bold tracking-tight text-tinta-900 tabular-nums">
          {numero(Math.floor(ethicsCasesEstimate / 100) * 100, lang)}+
        </b>
        <span className="a-s text-tinta-800">{fill(t('svc.ethics.fig.total'), { weeks: ethicsWeeks })}</span>
      </p>
      <ul className="mt-6 border-t-2 border-tinta-900 pt-3">
        {filas.map((f) => (
          <li key={f.s} className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-3 py-1 transition-colors hover:bg-resaltador-suave">
            <span className="a-meta leading-tight">
              {semestre(f.s)}
              {f.enCurso && <span className="block">{t('svc.ethics.fig.current')}</span>}
            </span>
            <span className="flex flex-wrap gap-[3px]" aria-label={`${semestre(f.s)}: ${f.semanas}`}>
              {Array.from({ length: weeksPerSemester }, (_, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className={`block w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < f.semanas ? 'bg-tinta-900' : 'bg-papel-300'}`}
                />
              ))}
            </span>
          </li>
        ))}
      </ul>
      <figcaption className="a-pie max-w-[52ch]">{t('svc.ethics.fig.caption')}</figcaption>
    </figure>
  );
};


/** Las propuestas evaluadas, año por año: un cuadro por propuesta. */
const PorAnio: React.FC = () => {
  const { t } = useI18n();
  const años = Array.from({ length: 2026 - 2018 + 1 }, (_, i) => 2018 + i);
  const max = Math.max(...años.map((a) => suma(evaluationCallsData.filter((c) => c.year === a))));
  return (
    <figure>
      <h3 className="a-h3">{t('svc.eval.chart.title')}</h3>
      <div className="mt-8 grid grid-cols-9 gap-1.5 sm:gap-3 items-end border-b-2 border-tinta-900" style={{ minHeight: `${max * 1.35 + 0.5}rem` }}>
        {años.map((a) => {
          const nacional = suma(evaluationCallsData.filter((c) => c.year === a && c.scope === 'national'));
          const universidad = suma(evaluationCallsData.filter((c) => c.year === a && c.scope === 'university'));
          return (
            <div key={a} className="flex flex-col-reverse items-center gap-1 pb-1.5" aria-label={`${a}: ${nacional + universidad}`}>
              {Array.from({ length: nacional }, (_, i) => <span key={`n${i}`} aria-hidden="true" className="block w-full max-w-[2rem] h-[1.1rem] bg-tinta-900" />)}
              {Array.from({ length: universidad }, (_, i) => <span key={`u${i}`} aria-hidden="true" className="block w-full max-w-[2rem] h-[1.1rem] bg-tinta-400" />)}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-9 gap-1.5 sm:gap-3 pt-2 a-meta text-center">
        {años.map((a) => <span key={a}>{a}</span>)}
      </div>
      <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 a-s text-tinta-800">
        <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="block w-3.5 h-3.5 bg-tinta-900" />{t('svc.eval.national')}</span>
        <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="block w-3.5 h-3.5 bg-tinta-400" />{t('svc.eval.university')}</span>
      </p>
      <figcaption className="a-pie">{t('svc.eval.chart.caption')}</figcaption>
    </figure>
  );
};

/** Una lista corta de evaluaciones con el año en su columna. */
const Registro: React.FC<{ titulo: UIKey; filas: EvaluationRecord[] }> = ({ titulo, filas }) => {
  const { t, lang } = useI18n();
  return (
    <div>
      <h3 className="a-h3">{t(titulo)}</h3>
      <ul className="mt-6 border-t-2 border-tinta-900">
        {filas.map((f, i) => (
          <Sube as="li" key={i} delay={0.04 * i} className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-3 py-4 border-b-2 border-papel-300">
            <span className="a-meta pt-0.5">{f.year}</span>
            <span>
              <span className="block font-semibold leading-snug text-tinta-900">{localize(f.what, lang)}</span>
              <span className="block a-s text-tinta-800 mt-1">{localize(f.where, lang)}</span>
            </span>
          </Sube>
        ))}
      </ul>
    </div>
  );
};

export const CommitteesPage: React.FC = () => {
  const { t, lang } = useI18n();
  const { hash } = useLocation();

  // Desde la apertura del capítulo se llega directo a «Evaluar a otros».
  useEffect(() => {
    if (!hash) return;
    const id = window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 120);
    return () => window.clearTimeout(id);
  }, [hash]);

  // La iniciativa de IA tiene su propia página; aquí queda en el registro, ya cerrada.
  const iniciativa: Committee = {
    title: { en: t('committees.ai.title'), es: t('committees.ai.title') },
    role: { en: t('committees.ai.role'), es: t('committees.ai.role') },
    startYear: 2024,
    endYear: 2026,
    level: 'Faculty',
    description: [{ en: t('committees.ai.desc'), es: t('committees.ai.desc') }],
  };

  const todos = [...leadershipRolesData, ...committeesData];
  const actuales = todos.filter(vigente).sort((a, b) => b.startYear - a.startYear);
  const anteriores = [...todos.filter((c) => !vigente(c)), iniciativa].sort(
    (a, b) => fin(b) - fin(a) || b.startYear - a.startYear,
  );
  const primero = Math.min(...todos.map((c) => c.startYear));

  // Las fotos van con el cargo al que pertenecen, y solo con ese.
  const foto = (f: { src: string; alt: { en: string; es: string } | string }) => ({ src: f.src, alt: localize(f.alt, lang) });
  const fotosDe = (c: Committee) => {
    const titulo = localize(c.title, 'en');
    if (titulo.includes('Academia Joven')) return [foto(fotos.academiaJoven)];
    if (titulo.includes('AIChE Student Chapter')) return [foto(fotos.fenomenosTransporte), foto(fotos.chemECar)];
    return undefined;
  };

  // Evaluar a otros: lo que se cuenta sale del registro de convocatorias.
  const nacionales = evaluationCallsData.filter((c) => c.scope === 'national');
  const universitarias = evaluationCallsData.filter((c) => c.scope === 'university');
  const expertos = evaluationCallsData.find((c) => c.note === 'experts');
  const paneles = evaluationCallsData.filter((c) => c.panel).length;
  const casos = numero(Math.floor(ethicsCasesEstimate / 100) * 100, lang);
  const evaluacion = fill(t('svc.eval.p1'), {
    proposals: suma(evaluationCallsData),
    calls: evaluationCallsData.length,
    national: suma(nacionales),
    panels: cardinal(paneles, lang),
    experts: cardinal(expertos?.proposals ?? 0, lang),
    university: cardinal(suma(universitarias), lang),
    universities: cardinal(evaluationUniversities, lang),
  });
  const filasTabla = [
    { tipo: t('svc.eval.national'), calls: nacionales.length, proposals: suma(nacionales), panels: nacionales.filter((c) => c.panel).length },
    { tipo: t('svc.eval.university'), calls: universitarias.length, proposals: suma(universitarias), panels: universitarias.filter((c) => c.panel).length },
  ];

  return (
    <PageWrapper noPadding scrollToTop={!hash}>
      <EncabezadoPagina
        titulo={t('committees.title')}
        entrada={<p>{fill(t('committees.sub'), { first: primero })}</p>}
        accion={{ label: t('svc.committees.cta'), onClick: () => document.getElementById('evaluar')?.scrollIntoView({ behavior: 'smooth' }) }}
        foto={{ src: '/images/portafolio/claustro/into-the-wall.jpg', alt: t('service.img.building'), posicion: '50% 40%' }}
      />

      {/* ── El gobierno de la Universidad, con la carga del Comité de Ética ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('svc.gov.title')} /></Sube>
          <div className="mt-12 grid gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:items-start">
            <div>
              <Sube><p className="a-texto">{t('svc.gov.p1')}</p></Sube>
              <Sube delay={0.04}><p className="a-texto mt-5">{fill(t('svc.gov.p2'), { cases: casos })}</p></Sube>
              <Sube delay={0.08}><p className="a-texto mt-5">{t('svc.gov.p3')}</p></Sube>
            </div>
            <Sube delay={0.1}><SemanasEtica /></Sube>
          </div>
        </div>
      </section>

      {/* ── El GDPP: dos periodos de dirección ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('svc.gdpp.title')} /></Sube>
          <Sube delay={0.06}><p className="mt-10 a-texto">{t('svc.gdpp.p1')}</p></Sube>
        </div>
      </section>

      {/* ── Los cargos: lo vigente, abierto ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('svc.roles.title')} /></Sube>
          <Sube className="mt-14"><h3 className="a-h3">{t('committees.current')}</h3></Sube>
          <ul className="a-registro !mt-8">
            {actuales.map((c) => (
              <CommitteeCard key={`${c.startYear}-${localize(c.title, 'en')}`} committee={c} fotos={fotosDe(c)} open />
            ))}
          </ul>
          <Sube className="mt-20"><h3 className="a-h3">{t('committees.past')}</h3></Sube>
          <ul className="a-registro !mt-8">
            {anteriores.map((c) => (
              <CommitteeCard
                key={`${c.startYear}-${localize(c.title, 'en')}`}
                committee={c}
                fotos={fotosDe(c)}
                link={c === iniciativa ? { to: '/service/augmented-intelligence', label: t('committees.learnMore') } : undefined}
              />
            ))}
          </ul>
        </div>
      </section>

      {/* ── Evaluar a otros ── */}
      <section id="evaluar" className="a-papel a-campo scroll-mt-16">
        <div className="a-c">
          <Sube><Cabecera titulo={t('svc.eval.title')} /></Sube>
          <div className="mt-12 grid gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:items-start">
            <div>
              <Sube><p className="a-texto">{evaluacion}</p></Sube>
              <Sube delay={0.04}><p className="a-texto mt-5">{t('svc.eval.p2')}</p></Sube>
              <Sube delay={0.08}><p className="a-pie max-w-[64ch]">{t('svc.eval.confidential')}</p></Sube>
            </div>
            <Sube delay={0.1}><PorAnio /></Sube>
          </div>
          <Sube className="mt-16 overflow-x-auto">
            <table className="a-tabla">
              <thead>
                <tr>
                  <th scope="col">{t('svc.eval.table.type')}</th>
                  <th scope="col" className="num">{t('svc.eval.table.calls')}</th>
                  <th scope="col" className="num">{t('svc.eval.table.proposals')}</th>
                  <th scope="col" className="num">{t('svc.eval.table.panels')}</th>
                </tr>
              </thead>
              <tbody>
                {filasTabla.map((f) => (
                  <tr key={f.tipo} className="transition-colors hover:bg-resaltador-suave">
                    <td>{f.tipo}</td>
                    <td className="num">{f.calls}</td>
                    <td className="num">{f.proposals}</td>
                    <td className="num">{f.panels}</td>
                  </tr>
                ))}
                <tr className="font-semibold text-tinta-900">
                  <td>{t('svc.eval.table.total')}</td>
                  <td className="num">{evaluationCallsData.length}</td>
                  <td className="num">{suma(evaluationCallsData)}</td>
                  <td className="num">{paneles}</td>
                </tr>
              </tbody>
            </table>
          </Sube>
          <div className="mt-24 grid gap-24 md:grid-cols-2 md:gap-12">
            <Registro titulo="svc.eval.faculty.title" filas={facultyEvaluationsData} />
            <Registro titulo="svc.eval.juries.title" filas={externalJuriesData} />
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};
