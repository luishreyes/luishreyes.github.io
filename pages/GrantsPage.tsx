import React, { useMemo, useState } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { EncabezadoPagina } from '../components/Apertura';
import { Sube } from '../components/Sube';
import { grantsData } from '../components/data/grants';
import { useI18n, localize, fill } from '../context/i18n';
import { fotos } from '../components/data/fotos';
import type { Grant } from '../types';

type Orden = 'newest' | 'oldest';

const fin = (g: Grant) => g.endYear ?? g.startYear;

/** Registro de proyectos: los años en su columna, el título, quién lo financió y el papel
 *  del profesor. Los que siguen en curso van aparte de los concluidos. */
const Registro: React.FC<{ grants: Grant[] }> = ({ grants }) => {
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
            {g.area === 'education' && <span className="block a-s text-tinta-600 mt-1">{t('grants.area.education')}</span>}
          </p>
        </Sube>
      ))}
    </ul>
  );
};

export const GrantsPage = () => {
  const { t, lang } = useI18n();
  const [orden, setOrden] = useState<Orden>('newest');

  const ordenar = (lista: Grant[]) =>
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

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('grants.title')}
        entrada={<p className="[text-wrap:pretty]">{fill(t('grants.intro'), { n: grantsData.length, first: primerAno, active: enCurso.length })}</p>}
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

      {/* ── Dónde se hace el trabajo: la planta, la industria, el laboratorio ── */}
      <section className="a-portada a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3 mb-10">{t('grants.work.title')}.</h2></Sube>
          <ul className="grid gap-x-6 gap-y-10 md:grid-cols-3">
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
    </PageWrapper>
  );
};
