import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { PageWrapper } from '../components/PageWrapper';
import { StatsSection } from '../components/StatsSection';
import { Sube, SALE } from '../components/Sube';
import { useI18n, localize } from '../context/i18n';
import { metrics, awardsByRole } from '../components/data/metrics';
import { ProductsOverTimeChart } from '../components/ProductsOverTimeChart';
import { ResearchConnectionsGraph } from '../components/ResearchConnectionsGraph';
import { useAppData } from '../context/AppDataContext';

export const ResearchOverviewPage: React.FC = () => {
  const { citationData, products } = useAppData();
  const { t, lang } = useI18n();
  const { research } = metrics;
  const researchAwards = awardsByRole('research');
  const reduce = useReducedMotion();

  const stats = [
    { label: t('stats.products'), value: products.length },
    { label: t('stats.citations'), value: citationData.total },
    { label: t('stats.hindex'), value: citationData.hIndex },
    { label: t('stats.i10index'), value: citationData.i10Index },
    { label: t('stats.grants'), value: research.grants, note: `${research.activeGrants} ${t('stats.grants.note')}` },
    { label: t('stats.mentees'), value: research.mentees, note: `${research.graduatedMentees} ${t('stats.mentees.note')}` },
    // The two national distinctions get their own figures; the rest are counted
    // on the Recognition page.
    ...researchAwards
      .filter((award) => ['Fundación Alejandro Ángel Escobar', 'National Academy of Medicine of Colombia'].includes(localize(award.awarder, 'en')))
      .map((award) => ({
        label: `${localize(award.title, lang)}, ${localize(award.awarder, lang)}`,
        value: String(award.year),
      })),
  ];

  // La foto de la apertura se acerca despacio mientras la página sube.
  const aperturaRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: aperturaRef, offset: ['start start', 'end start'] });
  const escala = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <PageWrapper noPadding>
      {/* ── Apertura: el nombre de la sección en grande y la foto a sangre ── */}
      <section ref={aperturaRef} className="a-navy pt-16">
        <div className="grid lg:grid-cols-2 lg:min-h-[calc(100svh-4rem)]">
          <div className="relative overflow-hidden h-[42svh] min-h-[260px] lg:h-auto lg:order-2">
            <motion.img
              src="/images/site/generated-image-september-02-2025-1-07pm.jpg"
              alt={t('research.overview.hero.alt')}
              className="a-foto a-bn"
              style={reduce ? undefined : { scale: escala }}
            />
          </div>
          <div className="a-c a-c-izq flex flex-col justify-end py-14 lg:py-24">
            <motion.h1
              className="a-h1 text-white"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: SALE }}
            >
              {t('nav.research')}<span className="text-andes-yellow">.</span>
            </motion.h1>
            <motion.p
              className="mt-8 a-texto text-[clamp(20px,1.8vw,26px)] leading-[1.35] max-w-[30ch]"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: SALE, delay: 0.12 }}
            >
              {t('research.overview.subtitle')}
            </motion.p>
            <motion.div
              className="mt-10"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: SALE, delay: 0.24 }}
            >
              <Link to="/research/program" className="a-boton">
                {t('research.overview.vision.cta')} <span aria-hidden="true">→</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Visión y cifras, sobre el amarillo ── */}
      <section className="a-amarillo a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h2">{t('research.overview.vision.title')}</h2></Sube>
          <Sube delay={0.06}>
            <p className="mt-8 a-texto">{t('research.overview.vision.text')}</p>
          </Sube>
          <Sube delay={0.1} className="mt-16 sm:mt-24">
            <StatsSection stats={stats} isLoading={citationData.isLoading} />
          </Sube>
        </div>
      </section>

      {/* ── Producción en el tiempo ── */}
      <section className="a-nieve a-campo">
        <div className="a-c">
          <Sube>
            <ProductsOverTimeChart products={products} />
          </Sube>
        </div>
      </section>

      {/* ── Red de áreas: lo único del sitio que se puede tocar ── */}
      <section className="a-navy a-campo">
        <div className="a-c">
          <Sube>
            <ResearchConnectionsGraph products={products} />
          </Sube>
        </div>
      </section>
    </PageWrapper>
  );
};
