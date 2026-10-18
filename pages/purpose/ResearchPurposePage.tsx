import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../../components/PageWrapper';
import { EncabezadoPagina } from '../../components/Apertura';
import { Sube } from '../../components/Sube';
import { useI18n, localize } from '../../context/i18n';
import { graduatedStudentsData } from '../../components/data/students';
import { fotos } from '../../components/data/fotos';
import type { GraduatedStudent } from '../../types';
import { PLIEGO, MARGEN, Resaltar, Retrato } from './TeachingPurposePage';

// «El resultado más profundo es la persona que sale transformada del laboratorio»:
// cuatro egresados del grupo y dónde trabajan hoy, de sus fichas.
const EGRESADOS = ['Ariel Coli', 'María Camila Henao', 'Sebastián Rodríguez Patiño', 'Julián Fernando Becerra-Encinales'];

export const ResearchPurposePage: React.FC = () => {
  const { t, lang } = useI18n();
  const todos = [...graduatedStudentsData.phd, ...graduatedStudentsData.ms];
  const egresados = EGRESADOS.map((n) => todos.find((g) => g.name === n)).filter((g): g is GraduatedStudent => Boolean(g));

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('purpose.research.title')}
        entrada={<p>{t('purpose.research.sub')}</p>}
        accion={{ to: '/research/program', label: t('purpose.research.cta') }}
        foto={{ src: fotos.laboratorio.src, alt: localize(fotos.laboratorio.alt, lang) }}
      />

      {/* ── Dos compromisos, y de dónde vienen ── */}
      <section className="a-papel pt-6 pb-20 sm:pb-28">
        <div className={`a-c ${PLIEGO}`}>
          <div className={MARGEN}>
            <Sube><h2 className="a-h3">{t('purpose.research.h2')}</h2></Sube>
            {/* Junto a la lección de Katy Kao, el grupo cuando empezaba */}
            <Sube delay={0.08}>
              <figure className="mt-10">
                <img src={fotos.recienLlegado.src} alt={localize(fotos.recienLlegado.alt, lang)} loading="lazy" className="a-bn w-full aspect-[4/3] object-cover" />
                <figcaption className="a-pie">{localize(fotos.recienLlegado.alt, lang)}</figcaption>
              </figure>
            </Sube>
          </div>
          <div className="space-y-6">
            <Sube><p className="a-texto">{t('purpose.research.p1')}</p></Sube>
            <Sube delay={0.06}><p className="a-texto">{t('purpose.research.p2')}</p></Sube>
          </div>
        </div>
      </section>

      {/* ── La alineación de los vectores, y la formación como punto ── */}
      <section className="a-hundido a-campo">
        <div className={`a-c ${PLIEGO}`}>
          <div className={MARGEN}>
            <Sube delay={0.08}>
              <blockquote className="a-cita">{t('purpose.research.quote')}</blockquote>
            </Sube>
          </div>
          <div className="space-y-6">
            <Sube><p className="a-texto">{t('purpose.research.p3')}</p></Sube>
            <Sube delay={0.06}>
              <p className="a-texto"><Resaltar texto={t('purpose.research.p4')} frase={t('purpose.research.mark')} /></p>
            </Sube>
          </div>
        </div>
      </section>

      {/* ── Redes, voz propia y el laboratorio que quiero; al margen, quienes salieron de él ── */}
      <section className="a-papel a-campo">
        <div className={`a-c ${PLIEGO}`}>
          <div className="order-2 lg:order-1">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-10">
              {egresados.map((g, i) => (
                <Retrato
                  key={g.name}
                  src={g.imageUrl}
                  nombre={g.name}
                  linea={`${g.program ? localize(g.program, lang) : g.degree} · ${g.graduationYear}`}
                  detalle={g.currentPosition ? localize(g.currentPosition, lang) : undefined}
                  delay={0.06 * i}
                  cuadrado
                />
              ))}
            </ul>
            <Sube className="mt-8">
              <p className="a-pie !mt-0">{t('purpose.research.graduates')}</p>
              <Link to="/research/students" className="a-enlace inline-block mt-3">
                {t('purpose.research.graduates.cta')} <span aria-hidden="true">→</span>
              </Link>
            </Sube>
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <Sube><p className="a-texto">{t('purpose.research.p5')}</p></Sube>
            <Sube delay={0.06}><p className="a-texto">{t('purpose.research.p6')}</p></Sube>
            <Sube delay={0.1}><p className="a-texto">{t('purpose.research.p7')}</p></Sube>
            <Sube delay={0.12}><p className="a-texto text-tinta-900">{t('purpose.research.p8')}</p></Sube>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};
