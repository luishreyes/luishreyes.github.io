import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/PageWrapper';
import { EncabezadoPagina, Cabecera } from '../components/Apertura';
import { Sube } from '../components/Sube';
import { fotos, type Foto } from '../components/data/fotos';
import { useI18n, localize, type UIKey, type Lang } from '../context/i18n';

/** Lo que sigue: la frontera de la investigación decide qué se enseña, se mide si sirve y se lleva a la Universidad.
 *  Solo va lo que ya es público o es propio: lo que está en evaluación se cuenta sin socios ni cifras, las alianzas
 *  que todavía no se han propuesto no se nombran y no se promete trabajo con empresas. */

const PASOS: { cuando: UIKey; titulo: UIKey; texto: UIKey; clave?: boolean }[] = [
  { cuando: 'next.eco.s1.when', titulo: 'next.eco.s1', texto: 'next.eco.s1.text' },
  { cuando: 'next.eco.s2.when', titulo: 'next.eco.s2', texto: 'next.eco.s2.text', clave: true },
  { cuando: 'next.eco.s3.when', titulo: 'next.eco.s3', texto: 'next.eco.s3.text' },
  { cuando: 'next.eco.s4.when', titulo: 'next.eco.s4', texto: 'next.eco.s4.text' },
];

const SIMULADORES = [
  { src: '/classroom/iqya-2031-2026-20/simuladores-banners/explorador-ecofiltro.jpg', nombre: 'tch.sim.explorador-ecofiltro' as UIKey },
  { src: '/classroom/iqya-2031-2026-20/simuladores-banners/explorador-bombas-centrifugas.jpg', nombre: 'tch.sim.explorador-bombas-centrifugas' as UIKey },
];

const BRAZOS: { nombre: UIKey; texto: UIKey }[] = [
  { nombre: 'next.arm.none', texto: 'next.arm.none.text' },
  { nombre: 'next.arm.chatbot', texto: 'next.arm.chatbot.text' },
  { nombre: 'next.arm.tutor', texto: 'next.arm.tutor.text' },
];

const CICLO: { titulo: UIKey; texto: UIKey }[] = [
  { titulo: 'next.cycle.frontier', texto: 'next.cycle.frontier.text' },
  { titulo: 'next.cycle.class', texto: 'next.cycle.class.text' },
  { titulo: 'next.cycle.evidence', texto: 'next.cycle.evidence.text' },
];

const ESTADO: { titulo: UIKey; items: UIKey[] }[] = [
  { titulo: 'next.status.running', items: ['next.st.research', 'next.st.novus', 'next.st.simulator'] },
  { titulo: 'next.status.proposed', items: ['next.st.casf', 'next.st.help'] },
  { titulo: 'next.status.tobuild', items: ['next.st.diagnosis', 'next.st.ia', 'next.st.seedbed', 'next.st.sites'] },
];

const COMPROMISOS: UIKey[] = ['next.promise.1', 'next.promise.2', 'next.promise.3'];

const Figura: React.FC<{ foto: Foto; pie: string; lang: Lang }> = ({ foto, pie, lang }) => (
  <figure>
    <img src={foto.src} alt={localize(foto.alt, lang)} loading="lazy" className="a-bn w-full aspect-[4/3] object-cover" style={{ objectPosition: foto.foco ?? 'center' }} />
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
        foto={{ src: fotos.portadaLoQueSigue.src, alt: localize(fotos.portadaLoQueSigue.alt, lang), posicion: fotos.portadaLoQueSigue.foco }}
        accion={{ to: '/research/grants', label: t('next.link') }}
      />

      {/* ── Lo que no se delega: la escena del ecofiltro y el plan ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('next.core.title')} /></Sube>
          <div className="mt-12 grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <div>
              <Sube><p className="a-texto">{t('next.core.p1')}</p></Sube>
              <Sube><p className="a-texto mt-6">{t('next.core.p2')}</p></Sube>
              <Sube className="mt-8">
                <p className="a-entrada max-w-[34ch]"><span className="a-resaltado font-semibold">{t('next.core.mark')}</span></p>
              </Sube>
            </div>
            <Sube delay={0.08}><Figura foto={fotos.paraisoSemilla} pie={`${localize(fotos.paraisoSemilla.alt, lang)}.`} lang={lang} /></Sube>
          </div>
          <Sube className="mt-12"><p className="a-texto">{t('next.core.p3')}</p></Sube>
        </div>
      </section>

      {/* ── Un ejemplo: el ecofiltro ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('next.eco.title')} /></Sube>
          <Sube className="mt-12"><p className="a-texto">{t('next.eco.p1')}</p></Sube>
          <Sube className="mt-14">
            <figure>
              <ol className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                {PASOS.map((p) => (
                  <li key={p.titulo} className="border-t-2 border-tinta-900 pt-4">
                    <p className="a-s text-tinta-600">{t(p.cuando)}</p>
                    <p className="mt-2 flex items-center gap-2 font-semibold text-tinta-900">
                      {p.clave && <span aria-hidden="true" className="inline-block w-3 h-3 bg-resaltador" />}
                      {t(p.titulo)}
                    </p>
                    <p className="mt-2 a-s text-tinta-800">{t(p.texto)}</p>
                  </li>
                ))}
              </ol>
              <figcaption className="a-pie">{t('next.eco.caption')}</figcaption>
            </figure>
          </Sube>
          <Sube className="mt-14"><p className="a-texto">{t('next.eco.p2')}</p></Sube>
          <Sube className="mt-14">
            <figure>
              <div className="grid gap-6 sm:grid-cols-2">
                {SIMULADORES.map((s) => (
                  <Link key={s.src} to="/simulators" className="group block">
                    <img src={s.src} alt={t(s.nombre)} loading="lazy" className="block w-full aspect-[16/10] object-cover transition-opacity group-hover:opacity-85" />
                    <span className="mt-3 block a-s text-tinta-900 font-semibold">{t(s.nombre)}</span>
                  </Link>
                ))}
              </div>
              <figcaption className="a-pie">
                {t('next.sims.caption')}{' '}
                <Link to="/simulators" className="a-enlace">{t('next.sims.link')} <span aria-hidden="true">→</span></Link>
              </figcaption>
            </figure>
          </Sube>
        </div>
      </section>

      {/* ── Medirlo: los tres grupos de CASF 2.0 ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('next.measure.title')} /></Sube>
          <Sube className="mt-12"><p className="a-texto">{t('next.measure.p1')}</p></Sube>
          <Sube className="mt-14"><h3 className="a-h3">{t('next.arms.title')}.</h3></Sube>
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
          <Sube className="mt-8"><p className="a-texto">{t('next.measure.p2')}</p></Sube>
          <Sube className="mt-6"><p className="a-texto">{t('next.measure.p3')}</p></Sube>
        </div>
      </section>

      {/* ── Continuar Inteligencia Aumentada, y el ciclo ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('next.ia.title')} /></Sube>
          <div className="mt-12 grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <div>
              <Sube><p className="a-texto">{t('next.ia.p1')}</p></Sube>
              <Sube><p className="a-texto mt-6">{t('next.ia.p2')}</p></Sube>
            </div>
            <Sube delay={0.08}><Figura foto={fotos.acofiPonencia} pie={`${localize(fotos.acofiPonencia.alt, lang)}.`} lang={lang} /></Sube>
          </div>
          <Sube className="mt-16">
            <figure>
              <ol className="grid gap-px bg-tinta-700 md:grid-cols-3">
                {CICLO.map((c) => (
                  <li key={c.titulo} className="bg-tinta-900 px-6 py-6">
                    <p className="a-h3 !text-papel-0">{t(c.titulo)}</p>
                    <p className="mt-3 a-s text-papel-200">{t(c.texto)}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-4 a-s text-tinta-700"><span aria-hidden="true">↺ </span>{t('next.cycle.loop')}</p>
              <div className="mt-4 grid gap-x-8 gap-y-2 border-t-2 border-tinta-900 bg-papel-200 px-6 py-5 md:grid-cols-[14rem_minmax(0,1fr)]">
                <p className="font-semibold text-tinta-900">{t('next.cycle.base')}</p>
                <p className="a-s text-tinta-800">{t('next.cycle.base.text')}</p>
              </div>
              <figcaption className="a-pie">{t('next.cycle.caption')}</figcaption>
            </figure>
          </Sube>
        </div>
      </section>

      {/* ── Dentro de unos años ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('next.years.title')} /></Sube>
          <div className="mt-12 grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <Sube><Figura foto={fotos.pouRetro} pie={`${localize(fotos.pouRetro.alt, lang)}.`} lang={lang} /></Sube>
            <div>
              <Sube><p className="a-texto">{t('next.years.p1')}</p></Sube>
              <Sube><p className="a-texto mt-6">{t('next.years.p2')}</p></Sube>
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

      {/* ── Lo que me comprometo a hacer ── */}
      <section className="a-oscuro a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('next.promise.title')} /></Sube>
          <ul className="mt-12 grid gap-x-10 md:grid-cols-3 border-t-2 border-tinta-700">
            {COMPROMISOS.map((c, i) => (
              <Sube as="li" key={c} delay={0.06 * i} className="py-6 border-b-2 border-tinta-700 md:border-b-0">
                <p className="a-entrada text-papel-0">{t(c)}</p>
              </Sube>
            ))}
          </ul>
        </div>
      </section>
    </PageWrapper>
  );
};
