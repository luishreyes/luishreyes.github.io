import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../../components/PageWrapper';
import { StatsSection } from '../../components/StatsSection';
import { Sube } from '../../components/Sube';
import { Apertura, Cabecera } from '../../components/Apertura';
import { useI18n, fill, localize, type Lang } from '../../context/i18n';
import { fotos } from '../../components/data/fotos';
import { metrics } from '../../components/data/metrics';
import { editorialData } from '../../components/data/institutional';
import { editedBooksData } from '../../components/data/editorships';
import { totalReviews, totalJournalsReviewed } from '../../components/data/peerReview';

const { service } = metrics;

/** El dossier marca con el resaltador la frase que manda: aquí, la primera. */
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

export const InstitutionalOverviewPage: React.FC = () => {
  const { t, lang } = useI18n();

  const stats = [
    { label: t('stats.editorialBoards'), value: service.editorialBoards, note: fill(t('stats.editorialBoards.note'), { since: service.editorialBoardsSince }) },
    { label: t('stats.editedBooks'), value: service.editedBooks, note: t('stats.editedBooks.note') },
    { label: t('stats.guestEditorships'), value: service.guestEditorships, note: fill(t('stats.guestEditorships.note'), { since: service.guestEditorshipsSince }) },
    { label: t('stats.committees'), value: service.committees, note: t('stats.committees.note') },
    { label: t('stats.leadershipRoles'), value: service.leadershipRoles },
    { label: t('stats.outreach'), value: service.outreachActivities },
  ];

  // Cada frente lleva lo que mejor lo muestra: una foto del lugar, las portadas de los
  // libros o, donde no hay foto honesta, la cifra que lo prueba.
  const foto = (src: string, alt: string, posicion = 'center') => (
    <img src={src} alt={alt} loading="lazy" className="a-foto a-bn aspect-[3/2]" style={{ objectPosition: posicion }} />
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
      media: (
        <div className="a-cifras !grid-cols-2 aspect-[3/2] content-center bg-papel-200 px-8">
          <div>
            <b>{numero(totalReviews, lang)}</b>
            <span>{t('peerReview.reviews')}</span>
          </div>
          <div>
            <b>{totalJournalsReviewed}</b>
            <span>{t('peerReview.journals')}</span>
          </div>
        </div>
      ),
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
      to: '/service/outreach',
      title: t('service.outreach.title'),
      desc: t('service.outreach.desc'),
      media: foto(fotos.scoutingSelfie.src, localize(fotos.scoutingSelfie.alt, lang), '50% 45%'),
    },
  ];

  return (
    <PageWrapper noPadding>
      <Apertura
        palabra={t('nav.service').toLowerCase()}
        entrada={t('service.overview.sub')}
        foto={{ src: fotos.palmaCharla.src, alt: localize(fotos.palmaCharla.alt, lang), posicion: '16% 50%' }}
        accion={{ to: '/service/committees', label: t('service.overview.cta') }}
      />

      {/* ── Qué es el servicio y cuánto pesa ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('service.overview.lead.title')} /></Sube>
          <Sube delay={0.06}>
            <p className="mt-10 a-texto">{conResaltado(t('service.overview.text'))}</p>
          </Sube>
          <Sube delay={0.1} className="mt-16 sm:mt-20">
            <StatsSection stats={stats} isLoading={false} />
          </Sube>
        </div>
      </section>

      {/* ── Los cinco frentes: filas grandes que llevan a cada página ── */}
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
                        {area.title.split(' ').slice(-1)[0]}{'\u00a0'}
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
