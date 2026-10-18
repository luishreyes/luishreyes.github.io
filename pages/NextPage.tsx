import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/PageWrapper';
import { EncabezadoPagina, Cabecera } from '../components/Apertura';
import { Sube } from '../components/Sube';
import { fotos, type Foto } from '../components/data/fotos';
import { useI18n, localize, type UIKey, type Lang } from '../context/i18n';

/** Lo que sigue: el plan para responder las dos cosas que la portada dice no saber.
 *  Solo va lo que ya es público o es propio: lo que está en evaluación se cuenta sin
 *  socios ni cifras, y las alianzas que todavía no se han propuesto no se nombran. */

const BRAZOS: { nombre: UIKey; texto: UIKey }[] = [
  { nombre: 'next.arm.none', texto: 'next.arm.none.text' },
  { nombre: 'next.arm.chatbot', texto: 'next.arm.chatbot.text' },
  { nombre: 'next.arm.tutor', texto: 'next.arm.tutor.text' },
];

const ESTADO: { titulo: UIKey; items: UIKey[] }[] = [
  { titulo: 'next.status.running', items: ['next.st.novus', 'next.st.literacy', 'next.st.health', 'next.st.enel'] },
  { titulo: 'next.status.proposed', items: ['next.st.casf', 'next.st.help'] },
  { titulo: 'next.status.tobuild', items: ['next.st.seedbed', 'next.st.sites'] },
];

const Figura: React.FC<{ foto: Foto; pie: string; lang: Lang }> = ({ foto, pie, lang }) => (
  <figure>
    <img src={foto.src} alt={localize(foto.alt, lang)} loading="lazy" className="a-bn w-full aspect-[4/3] object-cover" />
    <figcaption className="a-pie">{pie}</figcaption>
  </figure>
);

export const NextPage: React.FC = () => {
  const { t, lang } = useI18n();

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('next.title')}
        entrada={t('next.lead')}
        foto={{ src: fotos.acofiPonencia.src, alt: localize(fotos.acofiPonencia.alt, lang) }}
        accion={{ to: '/research/grants', label: t('next.now.link') }}
      />

      {/* ── La pregunta ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('next.question.title')} /></Sube>
          <Sube className="mt-12"><p className="a-texto">{t('next.question.p1')}</p></Sube>
          <Sube className="mt-10">
            <p className="a-entrada max-w-[34ch]"><span className="a-resaltado font-semibold">{t('next.question.mark')}</span></p>
          </Sube>
        </div>
      </section>

      {/* ── El estudio causal ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('next.casf.title')} /></Sube>
          <div className="mt-12">
            <Sube><p className="a-texto">{t('next.casf.p1')}</p></Sube>
            <Sube><p className="a-texto mt-4 font-semibold text-tinta-900">{t('next.casf.mark')}</p></Sube>
            <Sube><p className="a-texto mt-4">{t('next.casf.p2')}</p></Sube>
          </div>
          <Sube className="mt-16"><h3 className="a-h3">{t('next.arms.title')}.</h3></Sube>
          <ol className="mt-6 grid gap-x-10 sm:grid-cols-3 border-t-2 border-tinta-900">
            {BRAZOS.map((b, i) => (
              <Sube as="li" key={b.nombre} delay={0.06 * i} className="py-6 border-b-2 border-papel-300 sm:border-b-0">
                <p className="font-semibold text-tinta-900">{t(b.nombre)}</p>
                <p className="mt-2 a-s text-tinta-800 max-w-[32ch]">{t(b.texto)}</p>
              </Sube>
            ))}
          </ol>
          <Sube className="mt-8">
            <p className="a-entrada tabular-nums">
              {t('next.arm.tutor')} = {t('next.arm.none').toLowerCase()} &gt; {t('next.arm.chatbot').toLowerCase()}
            </p>
          </Sube>
          <Sube className="mt-8"><p className="a-texto">{t('next.arms.measure')}</p></Sube>
        </div>
      </section>

      {/* ── La competencia de usar la ayuda ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('next.help.title')} /></Sube>
          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <Sube><p className="a-texto">{t('next.help.p1')}</p></Sube>
            <Sube delay={0.08}>
              <Figura foto={fotos.mentoria} pie={localize(fotos.mentoria.alt, lang)} lang={lang} />
            </Sube>
          </div>
        </div>
      </section>

      {/* ── Lo que ya está en marcha y el tiempo que se libere ── */}
      <section className="a-hundido a-campo">
        <div className="a-c grid gap-16 lg:grid-cols-2">
          <div>
            <Sube><h2 className="a-h3">{t('next.now.title')}.</h2></Sube>
            <Sube><p className="a-texto mt-6">{t('next.now.p1')}</p></Sube>
            <Sube className="mt-6">
              <Link to="/research/grants" className="a-enlace">{t('next.now.link')} <span aria-hidden="true">→</span></Link>
            </Sube>
          </div>
          <div>
            <Sube><h2 className="a-h3">{t('next.time.title')}.</h2></Sube>
            <Sube>
              <p className="a-texto mt-6">
                {t('next.time.p1')} <strong className="font-semibold text-tinta-900">{t('next.time.mark')}</strong>
              </p>
            </Sube>
            <Sube><p className="a-texto mt-4">{t('next.time.p2')}</p></Sube>
          </div>
        </div>
      </section>

      {/* ── Con quién y lo que sigue igual ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('next.with.title')} /></Sube>
          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <Sube><p className="a-texto">{t('next.with.p1')}</p></Sube>
            <Sube delay={0.08}><Figura foto={fotos.aiche2025} pie={t('next.with.photo')} lang={lang} /></Sube>
          </div>
          <div className="mt-20 grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <Sube><Figura foto={fotos.sesionOlga} pie={t('next.same.photo')} lang={lang} /></Sube>
            <div>
              <Sube><h2 className="a-h3">{t('next.same.title')}.</h2></Sube>
              <Sube><p className="a-texto mt-6">{t('next.same.p1')}</p></Sube>
            </div>
          </div>
        </div>
      </section>

      {/* ── En qué va cada cosa ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('next.status.title')} /></Sube>
          <div className="mt-12 grid gap-12 md:grid-cols-3">
            {ESTADO.map((col, i) => (
              <Sube key={col.titulo} delay={0.06 * i}>
                <h3 className="a-h3">{t(col.titulo)}</h3>
                <ul className="mt-5 border-t-2 border-tinta-900">
                  {col.items.map((it) => (
                    <li key={it} className="py-4 border-b-2 border-papel-300 text-tinta-800">{t(it)}</li>
                  ))}
                </ul>
              </Sube>
            ))}
          </div>
        </div>
      </section>

      {/* ── El compromiso ── */}
      <section className="a-oscuro a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('next.promise.title')} /></Sube>
          <Sube className="mt-12"><p className="a-h3 max-w-[30ch]">{t('next.promise.p1')}</p></Sube>
          <Sube className="mt-6"><p className="a-entrada max-w-[48ch]">{t('next.promise.p2')}</p></Sube>
        </div>
      </section>
    </PageWrapper>
  );
};
