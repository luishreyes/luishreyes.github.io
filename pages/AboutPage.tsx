import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageWrapper } from '../components/PageWrapper';
import { Cabecera } from '../components/Apertura';
import { Sube, SALE } from '../components/Sube';
import { Vectores } from '../components/Vectores';
import { fotos } from '../components/data/fotos';
import { useI18n, type UIKey } from '../context/i18n';

/** El contenido del sitio, en el orden de los capítulos del portafolio docente, cada uno con su foto. */
const CAPITULOS: { to: string; nombre: UIKey; linea: UIKey; foto: string }[] = [
  { to: '/context', nombre: 'nav.context', linea: 'home.contents.context', foto: fotos.portadaContexto.src },
  { to: '/trajectory', nombre: 'nav.trajectory', linea: 'home.contents.trajectory', foto: fotos.portadaTrayectoria.src },
  { to: '/teaching', nombre: 'nav.teaching', linea: 'home.contents.teaching', foto: fotos.portadaDocencia.src },
  { to: '/teaching/continuing-education', nombre: 'nav.teaching.continuing', linea: 'home.contents.training', foto: fotos.portadaFormacion.src },
  { to: '/school', nombre: 'nav.students', linea: 'home.contents.students', foto: fotos.portadaEscuela.src },
  { to: '/research', nombre: 'nav.research', linea: 'home.contents.research', foto: fotos.portadaInvestigacion.src },
  { to: '/service', nombre: 'nav.service', linea: 'home.contents.service', foto: fotos.portadaServicio.src },
  { to: '/recognition', nombre: 'nav.recognition', linea: 'home.contents.recognition', foto: fotos.portadaReconocimiento.src },
  { to: '/next', nombre: 'nav.next', linea: 'home.contents.next', foto: fotos.portadaLoQueSigue.src },
  { to: '/classroom', nombre: 'nav.classroom', linea: 'home.contents.classroom', foto: '/classroom/iqya-2031-2026-20/banner.jpg' },
];

/** Portada: la declaración. La primera pantalla es solo palabras (la dirección
 *  «type-only-statement» del skill); las fotos llegan después, grandes y pocas. */
export const AboutPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <PageWrapper noPadding>
      {/* ── Primera pantalla: la convicción, el nombre y una acción ── */}
      <section className="a-portada pt-16">
        <div className="a-c flex min-h-[calc(100svh-4rem)] flex-col justify-between gap-16 py-14 sm:py-20">
          <motion.h1
            className="a-declara"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: SALE }}
          >
            {t('home.statement')}
          </motion.h1>
          <motion.div
            className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: SALE, delay: 0.2 }}
          >
            <p className="a-entrada max-w-[40ch]">
              <strong className="font-semibold text-tinta-900">Luis H. Reyes.</strong> {t('home.who')}
            </p>
            <a className="a-boton justify-self-start" href="mailto:lh.reyes@uniandes.edu.co">
              {t('home.cta')} <span aria-hidden="true">→</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── La declaración ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('home.declaration.title')} /></Sube>
          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
            <Sube>
              <img src="/images/site/1756469286343.jpg" alt={t('home.portrait.alt')} className="a-bn w-full aspect-[4/5] object-cover" />
            </Sube>
            <Sube delay={0.08}>
              <p className="a-texto">{t('home.declaration.p1')}</p>
              <p className="a-texto">
                {t('home.declaration.p2a')} <span className="a-resaltado">{t('home.declaration.p2b')}</span>{' '}
                {t('home.declaration.p2c')}
              </p>
              <p className="a-texto">{t('home.declaration.p3')}</p>
              <p className="a-texto">{t('home.declaration.p4')}</p>
              <p className="a-texto font-semibold text-tinta-900">{t('home.declaration.p5')}</p>
            </Sube>
          </div>
        </div>
      </section>

      {/* ── La gente para la que existe todo lo anterior ── */}
      <Sube>
        <img src="/images/site/04.png" alt={t('home.band.alt')} loading="lazy" className="a-bn block w-full h-[46svh] min-h-[240px] object-cover" />
      </Sube>

      {/* ── Lo único de la portada que se toca: la suma de vectores ── */}
      <section className="a-oscuro a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('home.vectors.title')} /></Sube>
          <Sube delay={0.06}>
            <p className="mt-8 a-texto a-sec">{t('tch.pu.v1')}</p>
          </Sube>
          <Sube delay={0.1} className="mt-14">
            <Vectores />
          </Sube>
          <Sube className="mt-12">
            <Link to="/teaching/purpose" className="a-enlace">
              {t('home.vectors.more')} <span aria-hidden="true">→</span>
            </Link>
          </Sube>
        </div>
      </section>

      {/* ── Contenido ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('home.contents.title')} className="mb-2" /></Sube>
          <ul>
            {CAPITULOS.map((c, i) => (
              <Sube as="li" key={c.to} delay={0.04 * i}>
                <Link
                  to={c.to}
                  className="group grid grid-cols-[6rem_minmax(0,1fr)_auto] sm:grid-cols-[12rem_minmax(0,1fr)_auto] items-center gap-5 sm:gap-8 py-5 border-b-2 border-papel-300 transition-colors hover:bg-resaltador-suave"
                >
                  <img src={c.foto} alt="" loading="lazy" className="a-bn w-full aspect-[16/10] object-cover" />
                  <span>
                    <span className="block a-h3">{t(c.nombre)}</span>
                    <span className="block a-s a-sec mt-1">{t(c.linea)}</span>
                  </span>
                  <span className="a-h3 pr-2 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                </Link>
              </Sube>
            ))}
          </ul>
        </div>
      </section>
    </PageWrapper>
  );
};
