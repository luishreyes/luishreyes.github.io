import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/PageWrapper';
import { StatsSection } from '../components/StatsSection';
import { Sube } from '../components/Sube';
import { Apertura, Cabecera } from '../components/Apertura';
import { useI18n, localize } from '../context/i18n';
import { metrics, awardsByRole } from '../components/data/metrics';
import { graduatedStudentsData } from '../components/data/students';
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
  const doctores = graduatedStudentsData.phd;

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
        palabra={t('nav.research').toLowerCase()}
        entrada={t('research.overview.subtitle')}
        foto={{ src: '/images/site/generated-image-september-02-2025-1-07pm.jpg', alt: t('research.overview.hero.alt') }}
        accion={{ to: '/research/program', label: t('research.overview.vision.cta') }}
      />

      {/* ── Visión y cifras ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('research.overview.vision.title')} /></Sube>
          <Sube delay={0.06}>
            <p className="mt-10 a-texto">{conResaltado(t('research.overview.vision.text'))}</p>
          </Sube>
          <Sube delay={0.1} className="mt-16 sm:mt-20">
            <StatsSection stats={stats} isLoading={citationData.isLoading} />
          </Sube>
        </div>
      </section>

      {/* ── Los doctores del grupo: las fotos que la página necesita son las de su gente ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('research.overview.group.title')} /></Sube>
          <Sube delay={0.06}>
            <p className="mt-8 a-texto">
              {t('research.overview.group.text')
                .replace('{phd}', String(graduatedStudentsData.phd.length))
                .replace('{ms}', String(graduatedStudentsData.ms.length))}
            </p>
          </Sube>
          <ul className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {doctores.map((d, i) => (
              <Sube as="li" key={d.name} delay={0.06 * i}>
                <img src={d.imageUrl} alt={d.name} loading="lazy" className="a-bn w-full aspect-[4/5] object-cover object-top" />
                <p className="mt-4 font-semibold leading-tight text-tinta-900">{d.name}</p>
                <p className="a-meta mt-1">{d.program ? localize(d.program, lang) : d.degree} · {d.graduationYear}</p>
                {d.currentPosition && <p className="a-s mt-2 text-tinta-700">{localize(d.currentPosition, lang)}</p>}
              </Sube>
            ))}
          </ul>
          <Sube className="mt-12">
            <Link to="/research/students" className="a-enlace">
              {t('research.overview.group.cta')} <span aria-hidden="true">→</span>
            </Link>
          </Sube>
        </div>
      </section>

      {/* ── Producción en el tiempo ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('research.overview.chart.title')} className="mb-10" /></Sube>
          <Sube delay={0.06}>
            <ProductsOverTimeChart products={products} />
            <p className="a-pie">{t('research.overview.chart.caption')}</p>
          </Sube>
        </div>
      </section>

      {/* ── Red de áreas: lo único del sitio que se puede tocar ── */}
      <section className="a-oscuro a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('research.overview.network.label')} className="mb-12" /></Sube>
          <Sube delay={0.06}>
            <ResearchConnectionsGraph products={products} />
          </Sube>
        </div>
      </section>
    </PageWrapper>
  );
};
