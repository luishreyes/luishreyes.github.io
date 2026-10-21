import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../../components/PageWrapper';
import { EncabezadoPagina } from '../../components/Apertura';
import { StatsSection } from '../../components/StatsSection';
import { Sube } from '../../components/Sube';
import { useI18n, localize, type UIKey } from '../../context/i18n';
import { fotos } from '../../components/data/fotos';

const VIMEO_ID = '1111471808';

/** El resaltador en la frase que manda: la primera del párrafo. */
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

// Las cifras de la primera convocatoria (informe de cierre de la iniciativa).
const CATEGORIAS: { key: UIKey; n: number }[] = [
  { key: 'ai.cat.optimization', n: 15 },
  { key: 'ai.cat.learning', n: 11 },
  { key: 'ai.cat.skills', n: 4 },
];

const ETAPAS = [1, 2, 3] as const;

export const AugmentedIntelligencePage: React.FC = () => {
  const { t, lang } = useI18n();

  // El alcance va arriba, en el encabezado; el embudo de la convocatoria, en su sección.
  const alcance = [
    { label: t('ai.impact.users'), value: '~470' },
    { label: t('ai.impact.interactions'), value: 10817 },
  ];
  const convocatoria = [
    { label: t('ai.impact.projects'), value: 30 },
    { label: t('ai.impact.selected'), value: 26 },
  ];

  const lista = 'mt-4 border-t-2 border-tinta-900';
  const item = 'py-3.5 border-b-2 border-papel-300';

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('ai.title')}
        entrada={<p>{t('ai.sub')}</p>}
        foto={{ src: fotos.acofiPonencia.src, alt: localize(fotos.acofiPonencia.alt, lang), posicion: '66% 50%' }}
      >
        {/* La prueba del proyecto, arriba y en tinta. */}
        <Sube delay={0.2} className="mt-12">
          <StatsSection stats={alcance} isLoading={false} />
        </Sube>
        <Sube delay={0.28} className="mt-12">
          <a href={`https://vimeo.com/${VIMEO_ID}`} target="_blank" rel="noopener noreferrer" className="a-boton">
            {t('ai.video.cta')} <span aria-hidden="true">↗</span>
          </a>
        </Sube>
      </EncabezadoPagina>

      {/* ── La prueba primero: lo que logró la primera convocatoria ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('ai.call.title')}</h2></Sube>
          <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <Sube delay={0.06}><p className="a-texto font-semibold text-tinta-900">{t('ai.impact.departments')}</p></Sube>
              <Sube delay={0.1}><p className="mt-6 a-texto">{conResaltado(t('ai.impact.limits'))}</p></Sube>
            </div>
            <Sube delay={0.08}>
              <div className="mb-12 [&_.a-cifras]:!grid-cols-2">
                <StatsSection stats={convocatoria} isLoading={false} />
              </div>
              <table className="a-tabla">
                <caption className="text-left font-semibold text-tinta-900 pb-3">{t('ai.categories')}</caption>
                <thead>
                  <tr>
                    <th scope="col">{t('ai.categories.category')}</th>
                    <th scope="col" className="num">{t('ai.categories.count')}</th>
                  </tr>
                </thead>
                <tbody>
                  {CATEGORIAS.map((c) => (
                    <tr key={c.key}>
                      <td>{t(c.key)}</td>
                      <td className="num">{c.n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Sube>
          </div>
        </div>
      </section>

      {/* ── El único video del sitio, grande ── */}
      <section className="a-oscuro a-campo">
        <div className="a-c grid gap-10 lg:gap-14 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)] lg:items-end">
          <Sube className="order-2 lg:order-1">
            <div className="aspect-video bg-tinta-800">
              <iframe
                src={`https://player.vimeo.com/video/${VIMEO_ID}?title=0&byline=0&portrait=0`}
                className="block w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                loading="lazy"
                title={t('ai.video.title')}
              />
            </div>
          </Sube>
          <div className="order-1 lg:order-2">
            <Sube><h2 className="a-h3">{t('ai.global')}</h2></Sube>
            <Sube delay={0.06}><p className="mt-6">{t('ai.openai.text')}</p></Sube>
            <Sube delay={0.1}>
              <p className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                <Link to="/recognition" className="a-enlace">{t('ai.recognition.link')} <span aria-hidden="true">→</span></Link>
                <a href={`https://vimeo.com/${VIMEO_ID}`} target="_blank" rel="noopener noreferrer" className="a-enlace">
                  {t('ai.video.cta')} <span aria-hidden="true">↗</span>
                </a>
              </p>
            </Sube>
          </div>
        </div>
      </section>

      {/* ── Mi papel ── */}
      <section className="a-papel a-campo">
        <div className="a-c grid gap-12 lg:gap-16 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            <Sube><h2 className="a-h3">{t('ai.myRole')}</h2></Sube>
            <Sube delay={0.06}>
              <p className="mt-6 a-texto">
                {t('ai.summary.pre')}<strong className="font-semibold text-tinta-900">Augmented Intelligence Uniandes</strong>{t('ai.summary.post')}
              </p>
            </Sube>
            <div className="mt-12 grid gap-10 sm:grid-cols-2">
              <Sube>
                <h3 className="font-semibold text-tinta-900">{t('ai.leadership')}</h3>
                <ul className={lista}>
                  {([1, 2, 3, 4] as const).map((n) => (
                    <li key={n} className={item}>
                      <strong className="font-semibold text-tinta-900">{t(`ai.lead.${n}.strong` as UIKey)}</strong>
                      {t(`ai.lead.${n}.text` as UIKey)}
                    </li>
                  ))}
                </ul>
              </Sube>
              <Sube delay={0.08}>
                <h3 className="font-semibold text-tinta-900">{t('ai.management')}</h3>
                <ul className={lista}>
                  {([1, 2, 3] as const).map((n) => (
                    <li key={n} className={item}>{t(`ai.mgmt.${n}` as UIKey)}</li>
                  ))}
                </ul>
              </Sube>
            </div>
          </div>
          <Sube delay={0.12} className="lg:pt-2">
            <figure>
              <div className="overflow-hidden aspect-[4/3]">
                <img
                  src={fotos.palmaCharla.src}
                  alt={localize(fotos.palmaCharla.alt, lang)}
                  loading="lazy"
                  className="a-foto"
                  style={{ objectPosition: '17% 50%' }}
                />
              </div>
              <figcaption className="a-pie">{localize(fotos.palmaCharla.alt, lang)}.</figcaption>
            </figure>
          </Sube>
        </div>
      </section>

      {/* ── El marco y sus principios ── */}
      <section className="a-hundido a-campo">
        <div className="a-c grid gap-14 lg:gap-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div>
            <Sube><h2 className="a-h3">{t('ai.framework')}</h2></Sube>
            <Sube delay={0.06}>
              <blockquote className="a-cita mt-12">{t('ai.framework.quote')}</blockquote>
              <p className="a-quien">{t('ai.framework.source')}</p>
            </Sube>
          </div>
          <Sube delay={0.1} className="lg:pt-1">
            <h3 className="font-semibold text-tinta-900">{t('ai.principles')}</h3>
            <ul className={lista}>
              {([1, 2, 3, 4] as const).map((n) => (
                <li key={n} className={item}>
                  <strong className="font-semibold text-tinta-900">{t(`ai.prin.${n}.strong` as UIKey)}</strong>
                  {t(`ai.prin.${n}.text` as UIKey)}
                </li>
              ))}
            </ul>
          </Sube>
        </div>
      </section>

      {/* ── Cómo corrió la convocatoria ── */}
      <section className="a-papel a-campo">
        <div className="a-c grid gap-12 lg:gap-16 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
          <div>
            <Sube><h2 className="a-h3">{t('ai.implementation')}</h2></Sube>
            <ol className="a-registro !mt-8">
              {ETAPAS.map((n, i) => (
                <Sube as="li" key={n} delay={0.06 * i}>
                  <span className="cuando">{t(`ai.stage${n}.date` as UIKey)}</span>
                  <div>
                    <p className="que">{t(`ai.stage${n}.title` as UIKey)}</p>
                    <p className="detalle">
                      {t(`ai.stage${n}.1` as UIKey)} {t(`ai.stage${n}.2` as UIKey)} {t(`ai.stage${n}.3` as UIKey)}
                    </p>
                  </div>
                </Sube>
              ))}
            </ol>
          </div>
          <Sube delay={0.1} className="overflow-hidden aspect-[4/3] lg:aspect-[4/5]">
            <img src="/images/portafolio/docencia/estudiantes-portatiles.jpg" alt={t('service.img.learning')} loading="lazy" className="a-foto a-bn" style={{ objectPosition: '50% 55%' }} />
          </Sube>
        </div>
      </section>

      {/* ── Lo que continúa ── */}
      <section className="a-oscuro a-campo">
        <div className="a-c grid gap-12 lg:gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:items-center">
          <Sube className="overflow-hidden aspect-square max-w-[420px]">
            <img src={fotos.retratoVoceria.src} alt={localize(fotos.retratoVoceria.alt, lang)} loading="lazy" className="a-foto a-bn" />
          </Sube>
          <div>
            <Sube><h2 className="a-h3">{t('ai.futureVision')}</h2></Sube>
            <Sube delay={0.06}><p className="mt-6 a-texto">{t('ai.futureVision.text')}</p></Sube>
            <Sube delay={0.1}>
              <p className="mt-8">
                <Link to="/service/committees" className="a-enlace">{t('service.leadership.title')} <span aria-hidden="true">→</span></Link>
              </p>
            </Sube>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};
