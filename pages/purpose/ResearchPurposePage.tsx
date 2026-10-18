import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../../components/PageWrapper';
import { EncabezadoPagina } from '../../components/Apertura';
import { Sube } from '../../components/Sube';
import { useI18n, localize, type UIKey } from '../../context/i18n';
import { graduatedStudentsData } from '../../components/data/students';
import { fotos } from '../../components/data/fotos';
import type { GraduatedStudent } from '../../types';
import { PLIEGO, MARGEN, Resaltar, Retrato } from './TeachingPurposePage';

// Investigar también es formar: cuatro egresados del grupo y dónde trabajan hoy, de sus fichas.
const EGRESADOS = ['Ariel Coli', 'María Camila Henao', 'Sebastián Rodríguez Patiño', 'Julián Fernando Becerra-Encinales'];

/** Las tres colaboraciones que nombra el texto, cada una con su caso en el programa. */
const COLABORACIONES: { caso: UIKey; con: { en: string; es: string }; ancla: string }[] = [
  {
    caso: 'rc.case.lyso.title',
    con: { en: 'Institute for the Study of Inborn Errors of Metabolism, Pontificia Universidad Javeriana', es: 'Instituto de Errores Innatos del Metabolismo, Pontificia Universidad Javeriana' },
    ancla: 'lisosomales',
  },
  {
    caso: 'rc.case.sound.title',
    con: { en: 'Felipe Reinoso-Carvalho, School of Management', es: 'Felipe Reinoso-Carvalho, Facultad de Administración' },
    ancla: 'sonido',
  },
  {
    caso: 'rc.case.air.title',
    con: { en: 'Enel Colombia S.A. E.S.P.', es: 'Enel Colombia S.A. E.S.P.' },
    ancla: 'el-colegio',
  },
];

export const ResearchPurposePage: React.FC = () => {
  const { t, lang } = useI18n();
  const todos = [...graduatedStudentsData.phd, ...graduatedStudentsData.ms];
  const egresados = EGRESADOS.map((n) => todos.find((g) => g.name === n)).filter((g): g is GraduatedStudent => Boolean(g));

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('rc.ph.title')}
        entrada={<p>{t('rc.ph.lead')}</p>}
        accion={{ to: '/research/program', label: t('rc.ph.cta') }}
        foto={{ src: fotos.gradoCarlos.src, alt: localize(fotos.gradoCarlos.alt, lang), posicion: 'center 35%' }}
      />

      {/* ── Investigar también es formar, y de dónde viene ── */}
      <section className="a-papel pt-6 pb-20 sm:pb-28">
        <div className={`a-c ${PLIEGO}`}>
          <div className={MARGEN}>
            <Sube><h2 className="a-h3">{t('rc.ph.h2')}</h2></Sube>
            {/* Junto a la lección de Katy Kao, el grupo cuando empezaba */}
            <Sube delay={0.08}>
              <figure className="mt-10">
                <img src={fotos.recienLlegado.src} alt={localize(fotos.recienLlegado.alt, lang)} loading="lazy" className="a-bn w-full aspect-[4/3] object-cover" />
                <figcaption className="a-pie">{localize(fotos.recienLlegado.alt, lang)}</figcaption>
              </figure>
            </Sube>
          </div>
          <div className="space-y-6">
            <Sube><p className="a-texto"><Resaltar texto={t('rc.ph.p1')} frase={t('rc.ph.mark')} /></p></Sube>
            <Sube delay={0.06}><p className="a-texto">{t('rc.ph.p2')}</p></Sube>
          </div>
        </div>
      </section>

      {/* ── Los vectores, y tres colaboraciones que salieron de ellos ── */}
      <section className="a-hundido a-campo">
        <div className={`a-c ${PLIEGO}`}>
          <div className={MARGEN}>
            <Sube><h2 className="a-h3">{t('rc.ph.vectors')}</h2></Sube>
            <Sube delay={0.08}>
              <figure className="mt-10">
                <div className="overflow-hidden aspect-[4/3]">
                  <img src={fotos.mentoria.src} alt={localize(fotos.mentoria.alt, lang)} loading="lazy" className="a-foto a-bn" />
                </div>
                <figcaption className="a-pie">{localize(fotos.mentoria.alt, lang)}</figcaption>
              </figure>
            </Sube>
          </div>
          <div>
            <Sube><p className="a-texto">{t('rc.ph.p3')}</p></Sube>
            <Sube delay={0.06} className="mt-12">
              <h3 className="a-h3 mb-6">{t('rc.ph.three')}</h3>
              <ul className="a-filas">
                {COLABORACIONES.map((c) => (
                  <li key={c.ancla}>
                    <Link to={`/research/program#${c.ancla}`} className="a-fila">
                      <span className="q">{t(c.caso)}</span>
                      <span className="d">{lang === 'es' ? c.con.es : c.con.en}</span>
                      <span className="ir" aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Sube>
          </div>
        </div>
      </section>

      {/* ── El hilo y la línea más reciente; al margen, quienes salieron del laboratorio ── */}
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
              <p className="a-pie !mt-0">{t('rc.ph.graduates')}</p>
              <Link to="/research/students" className="a-enlace inline-block mt-3">
                {t('rc.ph.graduates.cta')} <span aria-hidden="true">→</span>
              </Link>
            </Sube>
          </div>
          <div className="order-1 lg:order-2">
            <Sube><p className="a-texto text-tinta-900">{t('rc.ph.p4')}</p></Sube>
            <Sube delay={0.06} className="mt-8">
              <Link to="/research/program" className="a-enlace">
                {t('rc.ph.cta')} <span aria-hidden="true">→</span>
              </Link>
            </Sube>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};
