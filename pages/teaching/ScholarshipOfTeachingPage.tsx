import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../../components/PageWrapper';
import { EncabezadoPagina } from '../../components/Apertura';
import { StatsSection } from '../../components/StatsSection';
import { Sube } from '../../components/Sube';
import { useI18n, localize, fill, num, cardinal, type UIKey } from '../../context/i18n';
import { cycleTurns, pouLongitudinalStudy } from '../../components/data/educationResearch';
import { awardsData } from '../../components/data/awards';
import { grantsData } from '../../components/data/grants';
import { graduateByName } from '../../components/data/metrics';
import type { Product } from '../../types';
import { useAppData } from '../../context/AppDataContext';
import { fotos } from '../../components/data/fotos';

const study = pouLongitudinalStudy;

const turnAward = (turn: (typeof cycleTurns)[number]) =>
  turn.recognizedBy ? awardsData.find((a) => localize(a.awarder, 'en') === turn.recognizedBy) : undefined;

// Grants tagged area: 'education' in the grant record. Tagging a new one there
// lists it here without touching this page.
const educationGrants = grantsData
  .filter((g) => g.area === 'education')
  .sort((a, b) => b.startYear - a.startYear);

// Coautores del estudio más reciente que son egresados del grupo, con su ficha.
const COAUTORES = ['Olga Lucía Acuña', 'Angie Daniela Bolaños Barbosa', 'Julian Daniel Torres Vanegas'];
const coautores = COAUTORES.map((n) => graduateByName(n)).filter((g): g is NonNullable<ReturnType<typeof graduateByName>> => Boolean(g));

const EDITORIAL_URL = 'https://www.sciencedirect.com/journal/education-for-chemical-engineers';
const RESPONSABILIDADES: [UIKey, UIKey][] = [
  ['sotl.editorial.r1.title', 'sotl.editorial.r1'],
  ['sotl.editorial.r2.title', 'sotl.editorial.r2'],
  ['sotl.editorial.r3.title', 'sotl.editorial.r3'],
];

/** Enlace de un producto: su URL, o su DOI cuando es un DOI de verdad. */
const enlace = (p: Product) => p.url || (p.doi.startsWith('10.') ? `https://doi.org/${p.doi}` : null);

export const ScholarshipOfTeachingPage: React.FC = () => {
  const { products } = useAppData();
  const { t, lang } = useI18n();

  const sotlPublications = useMemo(
    () =>
      products
        .filter((p) => p.researchAreas?.includes('Scholarship of Teaching & Learning'))
        .sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime()),
    [products],
  );

  const pasos = [
    { title: t('sotl.cycle.s1'), desc: t('sotl.cycle.s1d') },
    { title: t('sotl.cycle.s2'), desc: t('sotl.cycle.s2d') },
    { title: t('sotl.cycle.s3'), desc: t('sotl.cycle.s3d') },
  ];

  const cifras = [
    { label: fill(t('sotl.fig.students'), { cohorts: cardinal(study.cohorts, lang) }), value: study.students },
    { label: fill(t('sotl.fig.motivation'), { before: study.sustainedMotivation.before }), value: `${study.sustainedMotivation.now}%` },
    {
      label: fill(t('sotl.fig.blind'), { pLow: num(study.blindEvaluation.pLow, lang, 3), pHigh: num(study.blindEvaluation.pHigh, lang, 3) }),
      value: study.blindEvaluation.criteria,
    },
    { label: t('sotl.fig.papers'), value: cycleTurns.length },
  ];

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('sotl.title')}
        entrada={<p>{t('sotl.sub')}</p>}
        accion={{ to: '/teaching/unit-ops', label: t('sotl.caseCta') }}
        foto={{ src: fotos.acofiPonencia.src, alt: localize(fotos.acofiPonencia.alt, lang), posicion: '70% center' }}
      />

      {/* ── Las cifras del estudio junto al párrafo que las cuenta ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('sotl.figures.title')}.</h2></Sube>
          <div className="mt-12 grid gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
            <Sube delay={0.04}>
              <p className="text-tinta-900">
                {fill(t('sotl.intro2'), {
                  students: study.students,
                  cohorts: cardinal(study.cohorts, lang),
                  citation: `${study.paper.authors}, ${study.paper.year}`,
                  test: t('sotl.test.anova'),
                  f: num(study.writtenCommunication.f, lang, 2),
                  p: num(study.writtenCommunication.pBelow, lang, 3),
                  criteria: cardinal(study.blindEvaluation.criteria, lang),
                  pLow: num(study.blindEvaluation.pLow, lang, 3),
                  pHigh: num(study.blindEvaluation.pHigh, lang, 3),
                  motivationNow: study.sustainedMotivation.now,
                  motivationBefore: study.sustainedMotivation.before,
                })}
              </p>
            </Sube>
            <Sube delay={0.08} className="[&_.a-cifras]:!gap-y-[88px]">
              <StatsSection stats={cifras} isLoading={false} />
            </Sube>
          </div>
        </div>
      </section>

      {/* ── El método y el ciclo, en dos columnas ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <div className="grid gap-x-16 gap-y-6 lg:grid-cols-2">
            <Sube><p className="text-tinta-900">{t('sotl.intro1')}</p></Sube>
            <Sube delay={0.06}><p className="text-tinta-900">{t('sotl.intro3')}</p></Sube>
          </div>
          <Sube delay={0.1} className="mt-12">
            <p className="a-texto text-tinta-800">{t('sotl.case')}</p>
            <Link to="/teaching/unit-ops" className="a-enlace inline-block mt-4">
              {t('sotl.caseCta')} <span aria-hidden="true">→</span>
            </Link>
          </Sube>
        </div>
      </section>

      {/* ── El ciclo ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('sotl.cycle.title')}.</h2></Sube>
          <Sube delay={0.04}>
            <p className="mt-4 a-texto">
              {fill(t('sotl.cycle.sub'), { times: cardinal(cycleTurns.length, lang), sinceYear: cycleTurns[0].paper.year })}
            </p>
          </Sube>
          <ol className="mt-14 grid gap-x-10 gap-y-12 lg:grid-cols-3">
            {pasos.map((paso, i) => (
              <Sube as="li" key={paso.title} delay={0.08 * i} className="border-t-2 border-tinta-900 pt-6">
                <h3 className="a-titulo">{paso.title}.</h3>
                <p className="mt-5 text-tinta-800">{paso.desc}</p>
              </Sube>
            ))}
          </ol>
          <Sube delay={0.2}><p className="mt-12 a-entrada">{t('sotl.cycle.return')}</p></Sube>

          <Sube className="mt-24"><h2 className="a-h3 mb-8">{t('sotl.cycle.turns')}.</h2></Sube>
          <ol className="a-registro">
            {cycleTurns.map((turn, i) => {
              const award = turnAward(turn);
              return (
                <Sube as="li" key={turn.years} delay={0.05 * i}>
                  <span className="cuando">{turn.years.replace('-', '–')}</span>
                  <div>
                    <p className="que">{localize(turn.change, lang)}</p>
                    <p className="donde">
                      <a href={`https://doi.org/${turn.paper.doi}`} target="_blank" rel="noopener noreferrer" className="a-enlace">
                        {`${turn.paper.authors} (${turn.paper.year})`}
                      </a>
                      {`, ${turn.paper.journal} ${turn.paper.locator}`}
                    </p>
                    {award && (
                      <p className="detalle text-tinta-900">
                        <span className="a-resaltado">{fill(t('sotl.turn.recognized'), { award: localize(award.title, lang), year: award.year })}</span>
                      </p>
                    )}
                  </div>
                </Sube>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ── Escrito con estudiantes ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('sotl.coauthors.title')}.</h2></Sube>
          <Sube delay={0.04}>
            <p className="mt-4 a-texto">{fill(t('sotl.coauthors.text'), { year: study.paper.year })}</p>
          </Sube>
          <ul className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
            {coautores.map((c, i) => (
              <Sube as="li" key={c.name} delay={0.06 * i}>
                <img src={c.imageUrl} alt={c.name} loading="lazy" className="a-bn w-full aspect-[4/5] object-cover object-top" />
                <p className="mt-4 font-semibold leading-tight text-tinta-900">{c.name}</p>
                <p className="a-meta mt-1">{c.program ? localize(c.program, lang) : c.degree} · {c.graduationYear}</p>
                {c.currentPosition && <p className="a-s mt-2 text-tinta-700">{localize(c.currentPosition, lang)}</p>}
              </Sube>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Con financiación ── */}
      {educationGrants.length > 0 && (
        <section className="a-hundido a-campo">
          <div className="a-c">
            <Sube><h2 className="a-h3">{t('sotl.funded.title')}.</h2></Sube>
            <Sube delay={0.04}><p className="mt-4 a-texto">{t('sotl.funded.sub')}</p></Sube>
            <ol className="a-registro mt-12">
              {educationGrants.map((grant, i) => (
                <Sube as="li" key={grant.title} delay={0.05 * i}>
                  <span className="cuando">{grant.startYear}{grant.endYear ? `–${grant.endYear}` : ''}</span>
                  <div>
                    <p className="text-[18px] leading-snug font-semibold text-tinta-900">{grant.title}</p>
                    <p className="donde">{grant.organization}</p>
                    <p className="donde mt-0">
                      {localize(grant.role, lang)} · {grant.status === 'Concluded' ? t('grants.status.concluded') : t('grants.status.inProgress')}
                    </p>
                  </div>
                </Sube>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ── La revista, desde el comité editorial ── */}
      <section className="a-papel a-campo">
        <div className="a-c grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div>
            <Sube><h2 className="a-h3">{t('sotl.editorial')}.</h2></Sube>
            <Sube delay={0.04}>
              <p className="mt-6 a-entrada">{t('sotl.editorial.journal')}</p>
              <p className="a-meta mt-3">{t('sotl.editorial.role')}</p>
              <p className="mt-6 text-tinta-800">{t('sotl.editorial.description')}</p>
              <a href={EDITORIAL_URL} target="_blank" rel="noopener noreferrer" className="a-boton mt-8">
                {t('sotl.visitJournal')} <span aria-hidden="true">↗</span>
              </a>
            </Sube>
          </div>
          <dl className="border-t-2 border-tinta-900">
            {RESPONSABILIDADES.map(([titulo, texto], i) => (
              <Sube key={titulo} delay={0.05 * i} className="border-b-2 border-papel-300 py-6">
                <dt className="text-[18px] font-semibold text-tinta-900">{t(titulo)}</dt>
                <dd className="mt-2 text-tinta-800">{t(texto)}</dd>
              </Sube>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Publicaciones, como bibliografía ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3 mb-8">{t('sotl.publications')}.</h2></Sube>
          <ol className="a-registro">
            {sotlPublications.map((pub, i) => {
              const url = enlace(pub);
              return (
                <Sube as="li" key={pub.doi} delay={0.03 * (i % 5)}>
                  <span className="cuando">{pub.publicationDate.slice(0, 4)}</span>
                  <div>
                    {url ? (
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-[18px] leading-snug font-semibold text-tinta-900 underline decoration-1 underline-offset-[3px] hover:bg-resaltador-suave transition-colors">
                        {pub.title} <span aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      <p className="text-[18px] leading-snug font-semibold text-tinta-900">{pub.title}</p>
                    )}
                    <p className="donde">{pub.authors.join(', ')}</p>
                    <p className="donde mt-0">
                      <em>{pub.publicationVenue}</em> · {t(`sotl.type.${pub.type}` as UIKey)}
                    </p>
                  </div>
                </Sube>
              );
            })}
          </ol>
        </div>
      </section>
    </PageWrapper>
  );
};
