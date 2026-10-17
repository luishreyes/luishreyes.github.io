import React from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { StatsSection } from '../components/StatsSection';
import { Sube } from '../components/Sube';
import { Apertura, Cabecera } from '../components/Apertura';
import { useI18n, localize } from '../context/i18n';
import { metrics, awardsByRole } from '../components/data/metrics';
import { ProductsOverTimeChart } from '../components/ProductsOverTimeChart';
import { ResearchConnectionsGraph } from '../components/ResearchConnectionsGraph';
import { useAppData } from '../context/AppDataContext';

/** El dossier marca con el resaltador la frase que manda: aquí, la primera de la visión. */
const conResaltado = (texto: string) => {
  const corte = texto.indexOf('. ');
  if (corte < 0) return texto;
  return (
    <>
      <span className="a-resaltado">{texto.slice(0, corte + 1)}</span>
      {texto.slice(corte + 1)}
    </>
  );
};

export const ResearchOverviewPage: React.FC = () => {
  const { citationData, products } = useAppData();
  const { t, lang } = useI18n();
  const { research } = metrics;
  const researchAwards = awardsByRole('research');
  const ceja = `02 · ${t('nav.research')}`;

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

  return (
    <PageWrapper noPadding>
      <Apertura
        numero="02"
        palabra={t('nav.research').toLowerCase()}
        entrada={t('research.overview.subtitle')}
        foto={{ src: '/images/site/generated-image-september-02-2025-1-07pm.jpg', alt: t('research.overview.hero.alt') }}
        accion={{ to: '/research/program', label: t('research.overview.vision.cta') }}
      />

      {/* ── Visión y cifras ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera ceja={ceja} titulo={t('research.overview.vision.title')} /></Sube>
          <Sube delay={0.06}>
            <p className="mt-10 a-texto">{conResaltado(t('research.overview.vision.text'))}</p>
          </Sube>
          <Sube delay={0.1} className="mt-16 sm:mt-20">
            <StatsSection stats={stats} isLoading={citationData.isLoading} />
          </Sube>
        </div>
      </section>

      {/* ── Producción en el tiempo ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera ceja={ceja} titulo={t('research.overview.chart.title')} className="mb-10" /></Sube>
          <Sube delay={0.06}>
            <ProductsOverTimeChart products={products} />
            <p className="a-pie">Fig. 2.1 · {t('research.overview.chart.caption')}</p>
          </Sube>
        </div>
      </section>

      {/* ── Red de áreas: lo único del sitio que se puede tocar ── */}
      <section className="a-oscuro a-campo">
        <div className="a-c">
          <Sube>
            <span className="a-ceja">{ceja} · {t('research.overview.network.label')}</span>
            <div className="mt-10">
              <ResearchConnectionsGraph products={products} />
            </div>
          </Sube>
        </div>
      </section>
    </PageWrapper>
  );
};
