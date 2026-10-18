import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../../components/PageWrapper';
import { EncabezadoPagina } from '../../components/Apertura';
import { Sube } from '../../components/Sube';
import { editorialData } from '../../components/data/institutional';
import { editedBooksData } from '../../components/data/editorships';
import {
  reviewedJournals,
  reviewsByArea,
  reviewAreaLabels,
  totalReviews,
  totalJournalsReviewed,
  ORCID_URL,
} from '../../components/data/peerReview';
import { useI18n, localize, fill, cardinal, type Lang } from '../../context/i18n';

const MESES: Record<string, [string, string]> = {
  Jan: ['January', 'enero'], Feb: ['February', 'febrero'], Mar: ['March', 'marzo'], Apr: ['April', 'abril'],
  May: ['May', 'mayo'], Jun: ['June', 'junio'], Jul: ['July', 'julio'], Aug: ['August', 'agosto'],
  Sep: ['September', 'septiembre'], Oct: ['October', 'octubre'], Nov: ['November', 'noviembre'], Dec: ['December', 'diciembre'],
};

/** 'Sep 2022' → «September 2022» o «septiembre de 2022». */
const mesAnio = (texto: string, lang: Lang) => {
  const [mes, anio] = texto.split(' ');
  const nombre = MESES[mes];
  if (!nombre || !anio) return texto;
  return lang === 'es' ? `${nombre[1]} de ${anio}` : `${nombre[0]} ${anio}`;
};

/** «Manuscript Evaluation: Oversee…» → el rótulo en negrita y el resto en texto. */
const responsabilidad = (texto: string) => {
  const corte = texto.indexOf(': ');
  if (corte < 0) return texto;
  return (
    <>
      <strong className="font-semibold text-tinta-900">{texto.slice(0, corte)}.</strong>{' '}
      {texto.charAt(corte + 2).toUpperCase() + texto.slice(corte + 3)}
    </>
  );
};

const numero = (n: number, lang: Lang) => n.toLocaleString(lang === 'es' ? 'es-CO' : 'en-US');

export const EditorialPage: React.FC = () => {
  const { t, lang } = useI18n();
  const maxArea = Math.max(...reviewsByArea.map((a) => a.reviews));

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('editorial.title')}
        entrada={<p>{fill(t('editorial.sub'), { count: cardinal(editorialData.length, lang) })}</p>}
        foto={{ src: '/images/site/1756469286343.jpg', alt: t('service.img.portrait'), posicion: '50% 30%' }}
      >
        {/* La prueba arriba: lo que dice el registro público de ORCID. */}
        <Sube delay={0.24} className="mt-12">
          <div className="a-cifras">
            <div>
              <b>{numero(totalReviews, lang)}</b>
              <span>{t('peerReview.reviews')}</span>
            </div>
            <div>
              <b>{totalJournalsReviewed}</b>
              <span>{t('peerReview.journals')}</span>
            </div>
          </div>
        </Sube>
        <Sube delay={0.3} className="mt-12">
          <a href={ORCID_URL} target="_blank" rel="noopener noreferrer" className="a-boton">
            {t('peerReview.orcid')} <span aria-hidden="true">↗</span>
          </a>
        </Sube>
      </EncabezadoPagina>

      {/* ── Las tres sillas, compactas ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('editorial.boards')}</h2></Sube>
          <ul className="a-registro !mt-8">
            {editorialData.map((role, i) => (
              <Sube as="li" key={role.journal} delay={0.05 * i}>
                <span className="cuando">{fill(t('editorial.since'), { date: mesAnio(role.startDate, lang) })}</span>
                <div>
                  <p className="que">
                    <a href={role.journalUrl} target="_blank" rel="noopener noreferrer" className="hover:bg-resaltador-suave transition-colors">
                      {role.journal}
                    </a>
                  </p>
                  <p className="donde">{localize(role.role, lang)}</p>
                  <div className="detalle grid gap-x-12 gap-y-5 lg:!max-w-none lg:grid-cols-2">
                    <p>{localize(role.description, lang)}</p>
                    <ul className="space-y-3">
                      {role.responsibilities.map((r, j) => (
                        <li key={j}>{responsabilidad(localize(r, lang))}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="mt-5">
                    <a href={role.journalUrl} target="_blank" rel="noopener noreferrer" className="a-enlace">
                      {t('editorial.visitJournal')} <span aria-hidden="true">↗</span>
                    </a>
                  </p>
                </div>
              </Sube>
            ))}
          </ul>
        </div>
      </section>

      {/* ── La evaluación por pares, por área, con el índice de revistas ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('peerReview.title')}</h2></Sube>
          <Sube delay={0.06}><p className="mt-6 a-texto">{t('peerReview.lead')}</p></Sube>
          <Sube delay={0.1}><h3 className="mt-14 font-semibold text-tinta-900">{t('peerReview.areasTitle')}</h3></Sube>
          <div className="mt-6 columns-1 md:columns-2 lg:columns-3 gap-x-12">
            {reviewsByArea.map(({ area, reviews, journals }, i) => (
              <Sube key={area} delay={0.04 * i} className="break-inside-avoid mb-20">
                <table className="a-tabla">
                  <caption className="text-left pb-4">
                    <span className="block text-[length:var(--t-l)] leading-[1.15] tracking-[-0.02em] font-semibold text-tinta-900">
                      {localize(reviewAreaLabels[area], lang)}
                    </span>
                    <span className="mt-2 block text-tinta-700">
                      {reviews} {t('peerReview.reviewsShort')} · {journals} {t('peerReview.journalsShort')}
                    </span>
                    <span className="mt-3 block h-2 bg-papel-300" aria-hidden="true">
                      <span className="block h-full bg-tinta-900" style={{ width: `${(reviews / maxArea) * 100}%` }} />
                    </span>
                  </caption>
                  <thead className="sr-only">
                    <tr>
                      <th scope="col">{t('peerReview.journal')}</th>
                      <th scope="col">{t('peerReview.reviewsShort')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviewedJournals.filter((j) => j.area === area).map((j) => (
                      <tr key={j.journal}>
                        <td className="!py-2.5">{j.journal}</td>
                        <td className="num !py-2.5 !pr-0 font-semibold text-tinta-900">{j.reviews ?? '–'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Sube>
            ))}
          </div>
          <p className="mt-4 a-s a-sec max-w-[72ch]">{t('peerReview.note')}</p>
        </div>
      </section>

      {/* ── Los encargos puntuales tienen su página ── */}
      <section className="a-hundido a-campo">
        <div className="a-c grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <Sube><h2 className="a-h3">{t('editorial.editorships.link')}</h2></Sube>
            <Sube delay={0.06}><p className="mt-6 a-texto">{t('editorial.editorships.text')}</p></Sube>
            <Sube delay={0.1}>
              <p className="mt-8">
                <Link to="/service/editorships" className="a-boton">
                  {t('editorial.editorships.link')} <span aria-hidden="true">→</span>
                </Link>
              </p>
            </Sube>
          </div>
          <Sube delay={0.08}>
            <Link to="/service/editorships" className="grid grid-cols-3 gap-4 sm:gap-6 items-end" aria-label={t('editorial.editorships.link')}>
              {editedBooksData.map((book) => (
                <img
                  key={book.title}
                  src={book.cover}
                  alt={fill(t('editorships.coverAlt'), { title: book.title })}
                  loading="lazy"
                  className="block w-full aspect-[5/7] object-cover transition-transform duration-200 hover:-translate-y-1"
                />
              ))}
            </Link>
          </Sube>
        </div>
      </section>
    </PageWrapper>
  );
};
