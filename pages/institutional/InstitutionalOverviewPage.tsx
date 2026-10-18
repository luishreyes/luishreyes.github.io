import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../../components/PageWrapper';
import { StatsSection } from '../../components/StatsSection';
import { Sube } from '../../components/Sube';
import { Apertura, Cabecera } from '../../components/Apertura';
import { useI18n, fill, localize, type Lang } from '../../context/i18n';
import { fotos } from '../../components/data/fotos';
import { metrics } from '../../components/data/metrics';
import { editorialData, ethicsCasesEstimate, evaluationCallsData, leadershipRolesData } from '../../components/data/institutional';
import { editedBooksData } from '../../components/data/editorships';
import { totalReviews, totalJournalsReviewed } from '../../components/data/peerReview';

const { service } = metrics;

/** El resaltador en la frase que manda: la primera. */
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

/** «A, B y C» en el idioma de la página. */
const enumerar = (items: string[], y: string) =>
  items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} ${y} ${items[items.length - 1]}`;

const numero = (n: number, lang: Lang) => n.toLocaleString(lang === 'es' ? 'es-CO' : 'en-US');

// Las cifras que vienen de un registro con su propio número (la cohorte del AIChE, la red AIGEN).
const MENTORES_COHORTE = 34;
const UNIVERSIDADES_AIGEN = 55;

export const InstitutionalOverviewPage: React.FC = () => {
  const { t, lang } = useI18n();

  const propuestas = evaluationCallsData.reduce((s, c) => s + c.proposals, 0);
  const nacionales = evaluationCallsData.filter((c) => c.scope === 'national').reduce((s, c) => s + c.proposals, 0);
  const etica = Math.floor(ethicsCasesEstimate / 100) * 100;
  const tieneMentor = leadershipRolesData.some((r) => localize(r.title, 'en').startsWith('Future Faculty Mentoring Program'));

  // Las cifras del capítulo: casi todas son conteos; la del Comité de Ética es un estimado y lo dice.
  const stats = [
    { label: t('svc.fig.boards'), value: service.editorialBoards },
    { label: t('svc.fig.books'), value: service.editedBooks },
    { label: t('svc.fig.issues'), value: service.guestEditorships },
    { label: fill(t('svc.fig.reviews'), { journals: totalJournalsReviewed }), value: totalReviews },
    { label: fill(t('svc.fig.proposals'), { calls: evaluationCallsData.length, national: nacionales }), value: propuestas },
    { label: t('svc.fig.ethics'), value: `${numero(etica, lang)}+`, note: t('svc.fig.ethics.note') },
    { label: t('svc.fig.ai'), value: '~470' },
    ...(tieneMentor ? [{ label: t('svc.fig.mentor'), value: fill(t('svc.fig.mentor.value'), { n: MENTORES_COHORTE }) }] : []),
    { label: t('svc.fig.aigen'), value: UNIVERSIDADES_AIGEN },
  ];

  // Cada frente lleva lo que mejor lo muestra: una foto del lugar, las portadas de los
  // libros o, donde no hay foto honesta, la cifra que lo prueba.
  const foto = (src: string, alt: string, posicion = 'center') => (
    <img src={src} alt={alt} loading="lazy" className="a-foto a-bn aspect-[3/2]" style={{ objectPosition: posicion }} />
  );
  const cifras = (a: { n: number; label: string }, b: { n: number; label: string }) => (
    <div className="a-cifras !grid-cols-2 aspect-[3/2] content-center bg-papel-200 px-8">
      <div><b>{numero(a.n, lang)}</b><span>{a.label}</span></div>
      <div><b>{numero(b.n, lang)}</b><span>{b.label}</span></div>
    </div>
  );

  const areas: { to: string; title: string; desc: string; media: React.ReactNode }[] = [
    {
      to: '/service/committees',
      title: t('service.leadership.title'),
      desc: t('service.leadership.desc'),
      media: foto(fotos.fenomenosTransporte.src, localize(fotos.fenomenosTransporte.alt, lang), '50% 38%'),
    },
    {
      to: '/service/augmented-intelligence',
      title: t('service.ai.title'),
      desc: t('service.ai.desc'),
      media: foto(fotos.acofiPonencia.src, localize(fotos.acofiPonencia.alt, lang), '62% 50%'),
    },
    {
      to: '/service/editorial',
      title: t('service.editorial.title'),
      desc: fill(t('service.editorial.desc'), { boards: enumerar(editorialData.map((b) => b.journal), t('service.and')) }),
      media: cifras({ n: totalReviews, label: t('peerReview.reviews') }, { n: totalJournalsReviewed, label: t('peerReview.journals') }),
    },
    {
      to: '/service/editorships',
      title: t('service.editorships.title'),
      desc: t('service.editorships.desc'),
      media: (
        <div className="grid grid-cols-3 gap-4 items-end">
          {editedBooksData.map((book) => (
            <img
              key={book.title}
              src={book.cover}
              alt={fill(t('editorships.coverAlt'), { title: book.title })}
              loading="lazy"
              className="block w-full aspect-[5/7] object-cover"
            />
          ))}
        </div>
      ),
    },
    {
      to: '/service/committees#evaluar',
      title: t('svc.eval.row.title'),
      desc: t('svc.eval.row.desc'),
      media: cifras({ n: propuestas, label: t('svc.eval.proposals') }, { n: evaluationCallsData.length, label: t('svc.eval.calls') }),
    },
    {
      to: '/service/outreach',
      title: t('service.outreach.title'),
      desc: t('service.outreach.desc'),
      media: foto(fotos.scoutingFeria.src, localize(fotos.scoutingFeria.alt, lang), fotos.scoutingFeria.foco),
    },
  ];

  return (
    <PageWrapper noPadding>
      <Apertura
        palabra={t('nav.service').toLowerCase()}
        entrada={t('svc.overview.sub')}
        foto={{ src: fotos.portadaServicio.src, alt: localize(fotos.portadaServicio.alt, lang), posicion: fotos.portadaServicio.foco }}
        accion={{ to: '/service/purpose', label: t('svc.overview.cta') }}
      />

      {/* ── El ecosistema y las cifras del capítulo ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('svc.overview.lead.title')} /></Sube>
          <Sube delay={0.06}>
            <p className="mt-10 a-texto">{conResaltado(t('svc.overview.lead.text'))}</p>
          </Sube>
          <Sube delay={0.08} className="mt-6">
            <Link to="/service/purpose" className="a-enlace">{t('svc.overview.lead.link')} <span aria-hidden="true">→</span></Link>
          </Sube>
          <Sube delay={0.1} className="mt-20 sm:mt-24">
            <h2 className="a-h3">{t('svc.figures.title')}.</h2>
          </Sube>
          {/* Nueve cifras: en pantallas anchas, tres por fila. */}
          <Sube delay={0.12} className="mt-10 lg:[&>.a-cifras]:!grid-cols-3">
            <StatsSection stats={stats} isLoading={false} />
          </Sube>
        </div>
      </section>

      {/* ── Los frentes: filas grandes que llevan a cada página ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          {/* Las filas son el título de la sección: su nombre queda para los lectores de pantalla. */}
          <h2 className="sr-only">{t('service.areas.title')}</h2>
          <ul className="border-t-2 border-tinta-900">
            {areas.map((area, i) => (
              <Sube as="li" key={area.to} delay={0.04 * i}>
                <Link
                  to={area.to}
                  className="group grid gap-x-12 gap-y-6 py-10 sm:py-12 sm:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] sm:items-center border-b-2 border-papel-300 text-tinta-800 no-underline transition-colors duration-200 hover:bg-resaltador-suave focus-visible:bg-resaltador-suave"
                >
                  <div>
                    <h3 className="a-h3 lg:!text-[length:var(--t-titulo)] lg:!leading-[1.04] lg:!tracking-[-0.04em] lg:!font-bold">
                      {area.title.split(' ').slice(0, -1).join(' ')}{' '}
                      {/* La flecha va pegada a la última palabra: nunca queda sola en una línea. */}
                      <span className="whitespace-nowrap">
                        {area.title.split(' ').slice(-1)[0]}{' '}
                        <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1.5">→</span>
                      </span>
                    </h3>
                    <p className="mt-5 a-texto">{area.desc}</p>
                  </div>
                  <Sube delay={0.12} className="overflow-hidden">{area.media}</Sube>
                </Link>
              </Sube>
            ))}
          </ul>
        </div>
      </section>
    </PageWrapper>
  );
};
