import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../../components/PageWrapper';
import { EncabezadoPagina, Cabecera } from '../../components/Apertura';
import { StatsSection } from '../../components/StatsSection';
import { Sube } from '../../components/Sube';
import { useI18n, localize, fill, num, cardinal, type UIKey } from '../../context/i18n';
import { educationPapers, criticalReview, pouLongitudinalStudy, sotlProducts } from '../../components/data/educationResearch';
import { awardsData } from '../../components/data/awards';
import { grantsData } from '../../components/data/grants';
import { graduateByName } from '../../components/data/metrics';
import type { Product } from '../../types';
import { useAppData } from '../../context/AppDataContext';
import { Resaltar } from '../purpose/TeachingPurposePage';
import { fotos } from '../../components/data/fotos';

const study = pouLongitudinalStudy;

// Proyectos marcados con area: 'education' en el registro de proyectos; marcar uno nuevo allá lo
// lista aquí sin tocar esta página.
const educationGrants = grantsData
  .filter((g) => g.area === 'education')
  .sort((a, b) => b.startYear - a.startYear);

// La selección de OpenAI, en el registro de reconocimientos.
const openai = awardsData.find((a) => localize(a.awarder, 'en') === 'OpenAI');

// Coautores del estudio de 2025 que son egresados del grupo, con su ficha.
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

/** Una entrada de bibliografía de products.json, con el año en su columna. */
const Entrada: React.FC<{ pub: Product; delay: number }> = ({ pub, delay }) => {
  const { t } = useI18n();
  const url = enlace(pub);
  return (
    <Sube as="li" delay={delay}>
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
};

export const ScholarshipOfTeachingPage: React.FC = () => {
  const { products } = useAppData();
  const { t, lang } = useI18n();
  const { talks, other } = useMemo(() => sotlProducts(products), [products]);

  const cifras = [
    { label: fill(t('tch.so.fig.students'), { cohorts: cardinal(study.cohorts, lang) }), value: study.students },
    { label: fill(t('tch.so.fig.motivation'), { before: study.sustainedMotivation.before }), value: `${study.sustainedMotivation.now} %` },
    { label: t('tch.so.fig.refs'), value: `${study.references.before} → ${study.references.after}` },
  ];

  // Mientras llegan los productos, la entrada cuenta solo los artículos.
  const lead = talks.length && other.length
    ? fill(t('tch.so.lead'), { papers: cardinal(educationPapers.length, lang), other: cardinal(other.length, lang), talks: cardinal(talks.length, lang) })
    : fill(t('tch.more.sotl.short'), { papers: cardinal(educationPapers.length, lang) });

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('tch.so.title')}
        entrada={<p>{lead.charAt(0).toUpperCase() + lead.slice(1)}</p>}
        accion={{ to: '/teaching/unit-ops', label: t('tch.so.cta') }}
        foto={{ src: fotos.acofiPonencia.src, alt: localize(fotos.acofiPonencia.alt, lang), posicion: '70% center' }}
      />

      {/* ── Cómo empezó, y el cuidado de estudiar un curso propio ── */}
      <section className="a-papel pt-6 pb-20 sm:pb-28">
        <div className="a-c grid gap-y-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-16">
          <Sube><h2 className="a-h3">{t('tch.so.start')}</h2></Sube>
          <div className="space-y-6">
            <Sube><p className="a-texto">{t('tch.so.s1')}</p></Sube>
            <Sube delay={0.05}>
              <p className="a-texto text-tinta-900"><Resaltar texto={t('tch.so.s2')} frase={t('tch.so.mark')} /></p>
            </Sube>
          </div>
        </div>
      </section>

      {/* ── Los estudios: cuatro artículos y la revisión ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('tch.so.studies')} className="mb-12" /></Sube>
          <ol className="a-registro">
            {educationPapers.map((paper, i) => (
              <Sube as="li" key={paper.doi} delay={0.04 * i}>
                <span className="cuando">{paper.year}</span>
                <div>
                  <h3 className="que">{localize(paper.design, lang)}</h3>
                  <p className="detalle">{localize(paper.summary, lang)}</p>
                  <p className="donde mt-3">
                    <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer" className="a-enlace">
                      {`${paper.authors} (${paper.year})`}
                    </a>
                    {', '}<em>{paper.journal}</em>{` ${paper.locator}`}
                  </p>
                </div>
              </Sube>
            ))}
            <Sube as="li" delay={0.04 * educationPapers.length}>
              <span className="cuando">{criticalReview.year}</span>
              <div>
                <h3 className="que">{localize(criticalReview.design, lang)}</h3>
                <p className="detalle">{localize(criticalReview.summary, lang)}</p>
                <p className="donde mt-3">
                  <em>{criticalReview.journal}</em>, {localize(criticalReview.status, lang)}.
                </p>
              </div>
            </Sube>
          </ol>
        </div>
      </section>

      {/* ── Lo que encontró el estudio de 2025, junto a sus cifras ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('tch.so.findings')} /></Sube>
          <div className="mt-12 grid gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
            <div className="space-y-6">
              <Sube>
                <p className="a-texto text-tinta-900">
                  {fill(t('tch.so.f1'), {
                    students: study.students,
                    cohorts: cardinal(study.cohorts, lang),
                    citation: `${study.paper.authors}, ${study.paper.year}`,
                    f: num(study.writtenCommunication.f, lang, 2),
                    p: num(study.writtenCommunication.pBelow, lang, 3),
                    pLow: num(study.independentEvaluator.pLow, lang, 3),
                    pHigh: num(study.independentEvaluator.pHigh, lang, 3),
                    now: study.sustainedMotivation.now,
                    before: study.sustainedMotivation.before,
                  })}
                </p>
              </Sube>
              <Sube delay={0.04}>
                <p className="a-texto">
                  {fill(t('tch.so.f2'), { rBefore: study.references.before, rAfter: study.references.after, rp: num(study.references.p, lang, 3) })}
                </p>
              </Sube>
            </div>
            <Sube delay={0.08} className="[&_.a-cifras]:!gap-y-[88px]">
              <StatsSection stats={cifras} isLoading={false} />
            </Sube>
          </div>
        </div>
      </section>

      {/* ── El marco CASF y la selección de OpenAI ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('tch.so.casf')} /></Sube>
          <div className="mt-10 grid gap-x-16 gap-y-6 lg:grid-cols-2">
            <Sube><p className="a-texto">{t('tch.so.c1')}</p></Sube>
            <Sube delay={0.05}>
              <p className="a-texto">{t('tch.so.c2')}</p>
              <Link to="/service/augmented-intelligence" className="a-enlace inline-block mt-4">{t('tch.so.casf.cta')} <span aria-hidden="true">→</span></Link>
              <p className="a-texto mt-10 text-tinta-900">{t('tch.so.openai')}</p>
              {openai?.url && (
                <a href={openai.url} target="_blank" rel="noopener noreferrer" className="a-enlace inline-block mt-4">
                  {t('tch.so.openai.cta')} <span aria-hidden="true">↗</span>
                </a>
              )}
            </Sube>
          </div>
        </div>
      </section>

      {/* ── Otras publicaciones ── */}
      {other.length > 0 && (
        <section className="a-papel a-campo">
          <div className="a-c">
            <Sube><Cabecera titulo={t('tch.so.other')} /></Sube>
            <Sube delay={0.04}><p className="mt-8 mb-12 a-texto">{t('tch.so.other.text')}</p></Sube>
            <ol className="a-registro">
              {other.map((pub, i) => <Entrada key={pub.doi} pub={pub} delay={0.03 * (i % 5)} />)}
            </ol>
          </div>
        </section>
      )}

      {/* ── Ponencias ── */}
      {talks.length > 0 && (
        <section className="a-hundido a-campo">
          <div className="a-c">
            <Sube><Cabecera titulo={t('tch.so.talks')} /></Sube>
            <div className="mt-8 mb-12 grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
              <Sube><p className="a-texto">{t('tch.so.talks.text')}</p></Sube>
              <Sube delay={0.06}>
                <figure>
                  <img src={fotos.aiche2025.src} alt={localize(fotos.aiche2025.alt, lang)} loading="lazy" className="a-bn w-full aspect-[16/10] object-cover" />
                  <figcaption className="a-pie">{t('tch.so.talks.photo')}</figcaption>
                </figure>
              </Sube>
            </div>
            <ol className="a-registro">
              {talks.map((pub, i) => <Entrada key={pub.doi} pub={pub} delay={0.03 * (i % 5)} />)}
            </ol>
          </div>
        </section>
      )}

      {/* ── Escrito con estudiantes ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('tch.so.coauthors')} /></Sube>
          <Sube delay={0.04}>
            <p className="mt-8 a-texto">{fill(t('tch.so.coauthors.text'), { year: study.paper.year })}</p>
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

      {/* ── Más allá de mis cursos ── */}
      {educationGrants.length > 0 && (
        <section className="a-hundido a-campo">
          <div className="a-c">
            <Sube><Cabecera titulo={t('tch.so.beyond')} /></Sube>
            <Sube delay={0.04}><p className="mt-8 a-texto">{t('tch.so.beyond.text')}</p></Sube>
            <ol className="a-registro mt-12">
              {educationGrants.map((grant, i) => (
                <Sube as="li" key={grant.title} delay={0.05 * i}>
                  <span className="cuando">{grant.startYear}{grant.endYear ? `${lang === 'es' ? ' a ' : ' to '}${grant.endYear}` : ''}</span>
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
    </PageWrapper>
  );
};
