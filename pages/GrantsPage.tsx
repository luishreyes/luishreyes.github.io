import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/PageWrapper';
import { EncabezadoPagina } from '../components/Apertura';
import { Sube } from '../components/Sube';
import { grantsData, computeCreditsData, type Proyecto } from '../components/data/grants';
import { useI18n, localize, fill } from '../context/i18n';
import { fotos } from '../components/data/fotos';
import type { Grant } from '../types';

type Orden = 'newest' | 'oldest';

const fin = (g: Grant) => g.endYear ?? g.startYear;

/** Investigador principal o coinvestigador principal, también «por la Universidad de los Andes». */
const esPrincipal = (g: Grant) => /principal investigator/i.test(localize(g.role, 'en'));

/** Registro de proyectos: los años en su columna, el título, quién lo financió y el papel
 *  del profesor, con la clase del proyecto. Los que siguen en curso van aparte de los concluidos. */
const Registro: React.FC<{ grants: (Grant | Proyecto)[] }> = ({ grants }) => {
  const { t, lang } = useI18n();
  return (
    <ul className="a-registro">
      {grants.map((g, i) => (
        <Sube
          as="li"
          key={g.title}
          delay={0.04 * Math.min(i, 4)}
          className="lg:!grid-cols-[9rem_minmax(0,1fr)_16rem] lg:!py-10"
        >
          <span className="cuando">
            {g.endYear && g.endYear !== g.startYear ? `${g.startYear}–${g.endYear}` : g.startYear}
          </span>
          <div>
            <p className="que max-w-[52ch] max-[759px]:!text-[18px] max-[759px]:!leading-snug">{g.title}</p>
            <p className="donde max-w-[60ch] !text-[18px] !text-tinta-800">{g.organization}</p>
          </div>
          <p className="text-tinta-800 lg:pt-[.3em]">
            {localize(g.role, lang)}
            {'kind' in g && (
              <span className="block a-s text-tinta-600 mt-1">
                {t(g.kind === 'research' ? 'rc.pr.kind.research' : 'rc.pr.kind.consultancy')}
                {g.area === 'education' && ` · ${t('grants.area.education')}`}
              </span>
            )}
          </p>
        </Sube>
      ))}
    </ul>
  );
};

export const GrantsPage = () => {
  const { t, lang } = useI18n();
  const [orden, setOrden] = useState<Orden>('newest');

  const ordenar = <T extends Grant>(lista: T[]) =>
    [...lista].sort((a, b) => {
      const d = fin(b) - fin(a) || b.startYear - a.startYear;
      return orden === 'newest' ? d : -d;
    });

  const { enCurso, concluidos, primerAno } = useMemo(
    () => ({
      enCurso: ordenar(grantsData.filter((g) => g.status === 'In Progress')),
      concluidos: ordenar(grantsData.filter((g) => g.status !== 'In Progress')),
      primerAno: Math.min(...grantsData.map((g) => g.startYear)),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orden],
  );

  const intro = fill(t('rc.pr.intro'), {
    n: grantsData.length,
    first: primerAno,
    research: grantsData.filter((g) => g.kind === 'research').length,
    consult: grantsData.filter((g) => g.kind === 'consultancy').length,
    pi: grantsData.filter(esPrincipal).length,
    active: enCurso.length,
  });

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('rc.pr.title')}
        entrada={<p className="[text-wrap:pretty]">{intro}</p>}
        foto={{ src: fotos.enel.src, alt: localize(fotos.enel.alt, lang), posicion: 'center 40%' }}
      >
        <div className="mt-10">
          <span className="a-s text-tinta-600">{t('grants.order')}</span>
          <div className="a-filtros mt-2">
            {(['newest', 'oldest'] as Orden[]).map((o) => (
              <button key={o} type="button" aria-pressed={orden === o} onClick={() => setOrden(o)}>
                {t(o === 'newest' ? 'grants.newest' : 'grants.oldest')}
              </button>
            ))}
          </div>
        </div>
      </EncabezadoPagina>

      <section className="a-papel pb-20 sm:pb-28 pt-4">
        <div className="a-c">
          <Sube><h2 className="a-h3 mb-8">{t('grants.active.title')}.</h2></Sube>
          <Registro grants={enCurso} />
        </div>
      </section>

      {/* ── Tres etapas, y dónde se hace el trabajo: la planta, la industria, el laboratorio ── */}
      <section className="a-portada a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('rc.pr.stages.title')}.</h2></Sube>
          <div className="mt-8 grid gap-x-16 gap-y-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <Sube><p className="a-texto">{t('rc.pr.stages.p1')}</p></Sube>
            <Sube delay={0.06}>
              <p className="a-texto">{t('rc.pr.stages.p2')}</p>
              <Link to="/research/program#el-colegio" className="a-enlace inline-block mt-4">
                {t('rc.pr.stages.link')} <span aria-hidden="true">→</span>
              </Link>
            </Sube>
          </div>
          <ul className="mt-14 grid gap-x-6 gap-y-10 md:grid-cols-3">
            {[
              { f: fotos.ecofarm, pos: 'center 35%' },
              { f: fotos.laboratorio, pos: '55% center' },
              { f: fotos.sesionOlga, pos: 'center 30%' },
            ].map(({ f, pos }, i) => (
              <Sube as="li" key={f.src} delay={0.08 * i}>
                <figure>
                  <div className="overflow-hidden aspect-[4/3]">
                    <img src={f.src} alt={localize(f.alt, lang)} loading="lazy" className="a-foto a-bn" style={{ objectPosition: pos }} />
                  </div>
                  <figcaption className="a-pie">{localize(f.alt, lang)}.</figcaption>
                </figure>
              </Sube>
            ))}
          </ul>
        </div>
      </section>

      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3 mb-8">{t('grants.done.title')}.</h2></Sube>
          <Registro grants={concluidos} />
        </div>
      </section>

      {/* ── Créditos de cómputo: aparte, porque no fueron un proyecto ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('rc.pr.credits.title')}.</h2></Sube>
          <Sube delay={0.06}><p className="mt-6 mb-10 a-texto">{t('rc.pr.credits.text')}</p></Sube>
          <Registro grants={computeCreditsData} />
        </div>
      </section>
    </PageWrapper>
  );
};
