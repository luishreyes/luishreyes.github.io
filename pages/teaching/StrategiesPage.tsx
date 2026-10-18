import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../../components/PageWrapper';
import { EncabezadoPagina, Cabecera } from '../../components/Apertura';
import { Sube } from '../../components/Sube';
import { useI18n, localize, fill, type UIKey, type Lang } from '../../context/i18n';
import { pou202620Course } from '../../components/data/classroom/pou-2026-20';
import { fotos, type Foto } from '../../components/data/fotos';

/** Estrategias y material de los cursos: los ocho bloques, los simuladores del aula de Proyecto
 *  de Operaciones Unitarias y el material del curso. Las cifras del aula se leen de sus datos. */

const AULA = `/classroom/${pou202620Course.slug}`;
const simulaciones = pou202620Course.simulations ?? [];
const simuladores = simulaciones.filter((s) => s.id !== 'manual-diagramas');
const material = pou202620Course.readings ?? [];
// Guías de trabajo: sin el programa ni el cronograma, que son del curso y no del proyecto.
const guias = material.filter((r) => r.category === 'guia' && !['programa-del-curso', 'cronograma-interactivo'].includes(r.slug));

const CIFRAS: { n: number; k: UIKey }[] = [
  { n: material.filter((r) => r.category === 'lectura').length, k: 'tch.st.n.readings' },
  { n: (pou202620Course.presentations ?? []).length, k: 'tch.st.n.slides' },
  { n: material.filter((r) => r.category === 'taller').length, k: 'tch.st.n.workshops' },
  { n: guias.length, k: 'tch.st.n.guides' },
  { n: simuladores.length, k: 'tch.st.n.sims' },
  { n: simulaciones.length - simuladores.length, k: 'tch.st.n.manual' },
];

/** Un bloque de estrategia: el título en el margen y el texto a la derecha, con una foto opcional. */
const Bloque: React.FC<{ titulo: string; children: React.ReactNode; foto?: React.ReactNode; className?: string }> = ({ titulo, children, foto, className = '' }) => (
  <div className={`grid gap-y-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-16 ${className}`}>
    <Sube><h3 className="a-h3">{titulo}</h3></Sube>
    <div className="space-y-6">
      {children}
      {foto}
    </div>
  </div>
);

const Figura: React.FC<{ foto: Foto; pie: string; lang: Lang; forma?: string }> = ({ foto, pie, lang, forma = 'aspect-[16/10]' }) => (
  <Sube delay={0.06}>
    <figure>
      <img src={foto.src} alt={localize(foto.alt, lang)} loading="lazy" className={`a-bn w-full object-cover ${forma}`} />
      <figcaption className="a-pie">{pie}</figcaption>
    </figure>
  </Sube>
);

export const StrategiesPage: React.FC = () => {
  const { t, lang } = useI18n();
  const nombre = (id: string, titulo: string) => {
    const clave = `tch.sim.${id}` as UIKey;
    try {
      return lang === 'en' ? t(clave) : titulo;
    } catch {
      return titulo;
    }
  };

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('tch.st.title')}
        entrada={<p>{t('tch.st.lead')}</p>}
        accion={{ label: t('tch.st.cta'), onClick: () => document.getElementById('simuladores')?.scrollIntoView({ behavior: 'smooth' }) }}
        foto={{ src: fotos.pouRetro.src, alt: localize(fotos.pouRetro.alt, lang), posicion: fotos.pouRetro.foco }}
      />

      {/* ── El proyecto ── */}
      <section className="a-papel pt-6 pb-20 sm:pb-28">
        <div className="a-c">
          <Bloque titulo={t('tch.st.project.t')} foto={<Figura foto={fotos.pouDiagrama} pie={t('tch.st.project.photo')} lang={lang} />}>
            <Sube><p className="a-texto">{t('tch.st.project')}</p></Sube>
          </Bloque>
        </div>
      </section>

      {/* ── Los simuladores, a todo el ancho ── */}
      <section id="simuladores" className="a-hundido a-campo scroll-mt-16">
        <div className="a-c">
          <Sube><Cabecera titulo={t('tch.st.sims.t')} /></Sube>
          <div className="mt-10 grid gap-x-16 gap-y-6 lg:grid-cols-2">
            <Sube><p className="a-texto text-tinta-900">{fill(t('tch.st.sims'), { n: simuladores.length })}</p></Sube>
            <Sube delay={0.05}>
              <p className="a-texto">{fill(t('tch.st.sims.where'), { term: pou202620Course.term })}</p>
              <Link to={`${AULA}/simulations`} className="a-boton mt-8">
                {t('tch.st.sims.cta')} <span aria-hidden="true">→</span>
              </Link>
            </Sube>
          </div>
          <ul className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {simulaciones.map((s, i) => (
              <Sube as="li" key={s.id} delay={0.03 * (i % 4)}>
                <figure>
                  <div data-ui className="overflow-hidden bg-white aspect-[16/10]">
                    <img src={s.bannerImg} alt={nombre(s.id, s.title)} loading="lazy" className="block w-full h-full object-cover" />
                  </div>
                  <figcaption className="mt-3 a-s text-tinta-900">{nombre(s.id, s.title)}</figcaption>
                </figure>
              </Sube>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Antes de clase, debates, equipos ── */}
      <section className="a-papel a-campo">
        <div className="a-c space-y-20 sm:space-y-28">
          <Bloque titulo={t('tch.st.read.t')}>
            <Sube><p className="a-texto">{t('tch.st.read')}</p></Sube>
            <Sube className="mt-4">
              <a href="https://open.spotify.com/show/2N3EYNS4OJeZzWF1iZvwad" target="_blank" rel="noopener noreferrer" className="a-enlace">
                {t('tch.st.podcast')} <span aria-hidden="true">↗</span>
              </a>
            </Sube>
          </Bloque>
          <Bloque titulo={t('tch.st.debate.t')}>
            <Sube><p className="a-texto">{t('tch.st.debate')}</p></Sube>
          </Bloque>
          <Bloque titulo={t('tch.st.teams.t')} foto={<Figura foto={fotos.equiposTapabocas} pie={t('tch.st.teams.photo')} lang={lang} />}>
            <Sube><p className="a-texto">{t('tch.st.teams')}</p></Sube>
          </Bloque>
        </div>
      </section>

      {/* ── Escribir, jugar y la IA con reglas ── */}
      <section className="a-hundido a-campo">
        <div className="a-c space-y-20 sm:space-y-28">
          <Bloque titulo={t('tch.st.write.t')} foto={<Figura foto={fotos.postersPou} pie={t('tch.st.write.photo')} lang={lang} />}>
            <Sube><p className="a-texto">{t('tch.st.write')}</p></Sube>
          </Bloque>
          <Bloque titulo={t('tch.st.play.t')}>
            <Sube><p className="a-texto">{t('tch.st.play')}</p></Sube>
          </Bloque>
          <Bloque titulo={t('tch.st.ai.t')}>
            <Sube>
              <p className="a-texto">{t('tch.st.ai')}</p>
              <Link to="/teaching/scholarship" className="a-enlace inline-block mt-4">{t('tch.st.ai.cta')} <span aria-hidden="true">→</span></Link>
            </Sube>
          </Bloque>
        </div>
      </section>

      {/* ── El material ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('tch.st.material.t')} /></Sube>
          <div className="mt-10 grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <div>
              <Sube><p className="a-texto">{t('tch.st.material')}</p></Sube>
              <Sube delay={0.05}>
                <p className="mt-10 font-semibold text-tinta-900">{fill(t('tch.st.material.pou'), { term: pou202620Course.term })}</p>
                <div className="mt-8 a-cifras !gap-y-14">
                  {CIFRAS.filter((c) => c.n > 0).map((c) => (
                    <div key={c.k}><b>{c.n}</b><span>{t(c.k)}</span></div>
                  ))}
                </div>
                <Link to={AULA} className="a-boton mt-12">{t('tch.st.material.cta')} <span aria-hidden="true">→</span></Link>
              </Sube>
            </div>
            <Figura foto={fotos.cursoGrupo} pie={t('tch.st.class.group')} lang={lang} forma="aspect-[4/5]" />
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};
