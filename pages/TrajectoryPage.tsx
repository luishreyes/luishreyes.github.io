import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/PageWrapper';
import { EncabezadoPagina, Cabecera } from '../components/Apertura';
import { Sube } from '../components/Sube';
import { fotos, type Foto } from '../components/data/fotos';
import { useI18n, localize, type UIKey } from '../context/i18n';
import { educationData, specializationsData, credentialsData } from '../components/data/education';
import { workExperienceData } from '../components/data/experience';
import { logosTrayectoria } from '../components/data/logos';
import { MuroLogos } from '../components/MuroLogos';

/** Trayectoria: los cinco tramos, cada uno con la decisión que lo explica, y después
 *  la hoja de vida (formación, experiencia, cursos y certificados) en registros. */

type Bloque = { tipo: 'p' | 'decision'; clave: UIKey } | { tipo: 'razones'; claves: UIKey[] } | { tipo: 'cierre'; clave: UIKey };
const TRAMOS: { años: UIKey; titulo: UIKey; foto?: { f: Foto; pie: UIKey }; bloques: Bloque[] }[] = [
  { años: 't1.years', titulo: 't1.title', bloques: [{ tipo: 'p', clave: 't1.p1' }, { tipo: 'decision', clave: 't1.decision' }] },
  { años: 't2.years', titulo: 't2.title', bloques: [{ tipo: 'p', clave: 't2.p1' }, { tipo: 'p', clave: 't2.p2' }, { tipo: 'decision', clave: 't2.decision' }, { tipo: 'p', clave: 't2.p3' }] },
  { años: 't3.years', titulo: 't3.title', bloques: [
    { tipo: 'p', clave: 't3.p1' }, { tipo: 'decision', clave: 't3.reasons' },
    { tipo: 'razones', claves: ['t3.r1', 't3.r2', 't3.r3', 't3.r4'] },
    { tipo: 'p', clave: 't3.p2' }, { tipo: 'p', clave: 't3.p3' }, { tipo: 'decision', clave: 't3.decision' }, { tipo: 'p', clave: 't3.p4' },
  ] },
  { años: 't4.years', titulo: 't4.title', foto: { f: fotos.reto2019, pie: 't4.photo' }, bloques: [
    { tipo: 'p', clave: 't4.p1' }, { tipo: 'decision', clave: 't4.decision' }, { tipo: 'p', clave: 't4.p2' }, { tipo: 'p', clave: 't4.p3' },
  ] },
  { años: 't5.years', titulo: 't5.title', foto: { f: fotos.grabacionMooc, pie: 't5.photo' }, bloques: [
    { tipo: 'p', clave: 't5.p1' }, { tipo: 'decision', clave: 't5.decision1' }, { tipo: 'p', clave: 't5.p2' },
    { tipo: 'decision', clave: 't5.decision2' }, { tipo: 'p', clave: 't5.p3' },
  ] },
];
export const TrajectoryPage: React.FC = () => {
  const { t, lang } = useI18n();
  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('trajectory.title')}
        entrada={t('trajectory.intro')}
        foto={{ src: fotos.portadaTrayectoria.src, alt: localize(fotos.portadaTrayectoria.alt, lang), posicion: fotos.portadaTrayectoria.foco }}
        accion={{ label: t('nav.downloadCv'), onClick: () => window.dispatchEvent(new Event('lhr:descargar-cv')) }}
      />

      {/* ── Los cinco tramos ── */}
      <section className="a-papel pb-20 sm:pb-28">
        <div className="a-c">
          <Sube><Cabecera titulo={t('trajectory.story.title')} /></Sube>
          <ol className="mt-4">
            {TRAMOS.map((tr) => (
              <li key={tr.años} className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-16 py-14 border-b-2 border-papel-300 last:border-b-0">
                <div>
                  <Sube>
                    <p className="text-[length:var(--t-l)] leading-tight font-light text-tinta-600 tabular-nums">{t(tr.años)}</p>
                  </Sube>
                  {tr.foto && (
                    <Sube className="mt-8 hidden lg:block">
                      <figure>
                        <img src={tr.foto.f.src} alt={localize(tr.foto.f.alt, lang)} loading="lazy" className="a-bn w-full aspect-[4/3] object-cover" />
                        <figcaption className="a-pie">{t(tr.foto.pie)}</figcaption>
                      </figure>
                    </Sube>
                  )}
                </div>
                <div>
                  <Sube><h3 className="a-h3 mb-6 max-w-[30ch]">{t(tr.titulo)}.</h3></Sube>
                  {tr.bloques.map((b, i) =>
                    b.tipo === 'razones' ? (
                      <Sube key={i} className="my-6">
                        <ul className="grid gap-x-8 sm:grid-cols-2 border-t-2 border-tinta-900">
                          {b.claves.map((k) => <li key={k} className="py-4 border-b-2 border-papel-300 text-tinta-800">{t(k)}</li>)}
                        </ul>
                      </Sube>
                    ) : (
                      <Sube key={i}>
                        <p className={`a-texto ${i ? 'mt-4' : ''} ${b.tipo === 'decision' ? 'font-semibold text-tinta-900' : ''}`}>
                          {b.tipo === 'cierre' ? <span className="a-resaltado font-semibold">{t(b.clave)}</span> : t(b.clave)}
                        </p>
                      </Sube>
                    ),
                  )}
                  {tr.foto && (
                    <Sube className="mt-8 lg:hidden">
                      <figure>
                        <img src={tr.foto.f.src} alt={localize(tr.foto.f.alt, lang)} loading="lazy" className="a-bn w-full aspect-[4/3] object-cover" />
                        <figcaption className="a-pie">{t(tr.foto.pie)}</figcaption>
                      </figure>
                    </Sube>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <Sube className="mt-6">
            <Link to="/context" className="a-enlace">{t('trajectory.context.link')} <span aria-hidden="true">→</span></Link>
          </Sube>
        </div>
      </section>

      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('trajectory.record.title')} /></Sube>
          <Sube className="mt-12"><h2 className="a-h3">{t('about.education.title')}.</h2></Sube>
          <ul className="a-registro mt-6">
            {educationData.map((e) => (
              <Sube as="li" key={e.institution}>
                <span className="cuando">{e.year}</span>
                <div>
                  <p className="que">{localize(e.degree, lang)}, {localize(e.field, lang)}</p>
                  <p className="donde">{e.institution} · {e.location}</p>
                </div>
              </Sube>
            ))}
          </ul>
        </div>
      </section>

      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('about.experience.title')}.</h2></Sube>
          <ul className="a-registro mt-6">
            {workExperienceData.map((w) => (
              <Sube as="li" key={`${w.company}-${w.period}`}>
                <span className="cuando">{w.period}</span>
                <div>
                  <p className="que">{localize(w.role, lang)}</p>
                  <p className="donde">{w.company} · {w.location}</p>
                </div>
              </Sube>
            ))}
          </ul>
          <Sube className="mt-14">
            <MuroLogos
              logos={logosTrayectoria.map((l) => ({ slug: l.slug, ratio: l.ratio, alt: localize(l.name, lang) }))}
              columnas="grid-cols-3 md:grid-cols-5 lg:grid-cols-9"
              pie={t('trajectory.logos.caption')}
            />
          </Sube>
          {/* La Universidad de los Andes, donde trabaja desde 2017 */}
          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {[
              { src: '/images/portafolio/claustro/enclosure.jpg', alt: 'Universidad de los Andes', pos: '50% 50%' },
              { src: fotos.estudiantesConversando.src, alt: localize(fotos.estudiantesConversando.alt, lang), pos: fotos.estudiantesConversando.foco },
              { src: '/images/portafolio/claustro/celosia.jpg', alt: 'Universidad de los Andes', pos: '66% 40%' },
            ].map((x, i) => (
              <Sube key={x.src} delay={0.06 * i}>
                <img src={x.src} alt={x.alt} loading="lazy" className="a-bn w-full aspect-[4/3] object-cover" style={{ objectPosition: x.pos }} />
              </Sube>
            ))}
          </div>
          <p className="a-pie">Universidad de los Andes, Bogotá.</p>
        </div>
      </section>

      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('about.continuing.title')}.</h2></Sube>
          <ul className="a-registro mt-6">
            {specializationsData.map((s) => (
              <Sube as="li" key={s.title}>
                <span className="cuando">{s.date}</span>
                <div>
                  <p className="que">{s.title}</p>
                  <p className="donde">{s.institution}</p>
                  <p className="detalle">{s.description}</p>
                  {s.skills.length > 0 && <p className="detalle">{s.skills.join(' · ')}</p>}
                </div>
              </Sube>
            ))}
          </ul>
        </div>
      </section>

      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('about.licenses.title')}.</h2></Sube>
          <ul className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 border-t-2 border-tinta-900 pt-8">
            {credentialsData.map((c) => (
              <li key={`${c.title}-${c.issuer}`}>
                <p className="text-tinta-900 leading-snug">{c.title}</p>
                <p className="mt-1 text-tinta-700">{c.issuer} · {c.date.replace(/^Issued\s+/, '')}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageWrapper>
  );
};
