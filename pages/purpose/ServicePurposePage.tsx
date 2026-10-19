import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../../components/PageWrapper';
import { EncabezadoPagina } from '../../components/Apertura';
import { Sube } from '../../components/Sube';
import { useI18n, localize, fill, type UIKey } from '../../context/i18n';
import { editorialData } from '../../components/data/institutional';
import { graduatedStudentsData } from '../../components/data/students';
import { fotos } from '../../components/data/fotos';
import type { GraduatedStudent } from '../../types';
import { PLIEGO, MARGEN, Resaltar, Retrato } from './TeachingPurposePage';

// «El estudiante que asesoro hoy será un nodo en la red de mañana»: egresados del grupo que
// hoy enseñan, con el cargo de su ficha.
const DOCENTES = ['Brayan Rodríguez', 'Julian Daniel Torres Vanegas', 'Cristian F. Rodríguez', 'Tatiana Carolina Beltrán González'];

// Dónde ocurre el servicio: las páginas del capítulo, con el título y la descripción de cada una.
const PAGINAS: { to: string; titulo: UIKey; texto: UIKey }[] = [
  { to: '/service/augmented-intelligence', titulo: 'service.ai.title', texto: 'service.ai.desc' },
  { to: '/service/committees', titulo: 'service.leadership.title', texto: 'service.leadership.desc' },
  { to: '/service/committees#evaluar', titulo: 'svc.eval.row.title', texto: 'svc.eval.row.desc' },
  { to: '/service/editorial', titulo: 'service.editorial.title', texto: 'service.editorial.desc' },
  { to: '/service/editorships', titulo: 'service.editorships.title', texto: 'service.editorships.desc' },
  { to: '/service/outreach', titulo: 'service.outreach.title', texto: 'service.outreach.desc' },
];

export const ServicePurposePage: React.FC = () => {
  const { t, lang } = useI18n();
  const todos = [...graduatedStudentsData.phd, ...graduatedStudentsData.ms];
  const nombres = editorialData.map((b) => b.journal);
  const revistas = `${nombres.slice(0, -1).join(', ')} ${t('service.and')} ${nombres[nombres.length - 1]}`;
  const docentes = DOCENTES.map((n) => todos.find((g) => g.name === n)).filter((g): g is GraduatedStudent => Boolean(g));

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('svc.purpose.title')}
        entrada={<p>{t('svc.purpose.sub')}</p>}
        accion={{ to: '/service', label: t('svc.purpose.cta') }}
        foto={{ src: fotos.scoutingSelfie.src, alt: localize(fotos.scoutingSelfie.alt, lang) }}
      />

      {/* ── Lo que Uniandes me dio, y la participación ── */}
      <section className="a-papel pt-6 pb-20 sm:pb-28">
        <div className={`a-c ${PLIEGO}`}>
          <div className={MARGEN}>
            <Sube><h2 className="a-h3">{t('svc.purpose.h2')}</h2></Sube>
            {/* Junto a la conversación con un estudiante de colegio que decide si la ingeniería es para él */}
            <Sube delay={0.08}>
              <figure className="mt-10">
                <img src={fotos.scoutingBarranca.src} alt={localize(fotos.scoutingBarranca.alt, lang)} loading="lazy" className="a-bn w-full aspect-[4/3] object-cover" style={{ objectPosition: fotos.scoutingBarranca.foco }} />
                <figcaption className="a-pie">{localize(fotos.scoutingBarranca.alt, lang)}.</figcaption>
              </figure>
            </Sube>
          </div>
          <div className="space-y-6">
            <Sube><p className="a-texto">{t('svc.purpose.p1')}</p></Sube>
            <Sube delay={0.06}>
              <p className="a-texto"><Resaltar texto={t('svc.purpose.p2')} frase={t('svc.purpose.mark')} /></p>
            </Sube>
          </div>
        </div>
      </section>

      {/* ── La IA generativa y los puentes: la ponencia en ACOFI ── */}
      <section className="a-hundido a-campo">
        <div className={`a-c ${PLIEGO}`}>
          <figure className={MARGEN}>
            <Sube>
              <img
                src={fotos.acofiPonencia.src}
                alt={localize(fotos.acofiPonencia.alt, lang)}
                loading="lazy"
                className="a-bn w-full aspect-[4/3] object-cover object-[70%_50%]"
              />
            </Sube>
            <Sube delay={0.06}><figcaption className="a-pie">{localize(fotos.acofiPonencia.alt, lang)}</figcaption></Sube>
          </figure>
          <div className="space-y-6">
            <Sube><p className="a-texto">{t('svc.purpose.p3')}</p></Sube>
            <Sube delay={0.06}><p className="a-texto">{t('svc.purpose.p4')}</p></Sube>
          </div>
        </div>
      </section>

      {/* ── Lo que me sostiene, y la red que sigue ── */}
      <section className="a-papel a-campo">
        <div className={`a-c ${PLIEGO}`}>
          <div className={MARGEN} />
          <div className="space-y-6">
            <Sube><p className="a-texto">{t('svc.purpose.p5')}</p></Sube>
            <Sube delay={0.06}><p className="a-texto">{t('svc.purpose.p6')}</p></Sube>
          </div>
        </div>
        <div className="a-c mt-16">
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {docentes.map((g, i) => (
              <Retrato
                key={g.name}
                src={g.imageUrl}
                nombre={g.name}
                linea={`${g.program ? localize(g.program, lang) : g.degree} · ${g.graduationYear}`}
                detalle={g.currentPosition ? localize(g.currentPosition, lang) : undefined}
                delay={0.06 * i}
              />
            ))}
          </ul>
          <Sube className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3">
            <p className="a-pie !mt-0">{t('purpose.service.teachers')}</p>
            <Link to="/research/students" className="a-enlace">
              {t('purpose.service.teachers.cta')} <span aria-hidden="true">→</span>
            </Link>
          </Sube>
        </div>
      </section>

      {/* ── Dónde ocurre el servicio: las páginas del capítulo ── */}
      <section className="a-hundido a-campo">
        <div className={`a-c ${PLIEGO}`}>
          <div className={MARGEN}>
            <Sube><h2 className="a-h3">{t('svc.purpose.where')}</h2></Sube>
            <Sube delay={0.08}>
              <figure className="mt-10">
                <img src={fotos.ptarSalitre.src} alt={localize(fotos.ptarSalitre.alt, lang)} loading="lazy" className="a-bn w-full aspect-[4/3] object-cover" />
                <figcaption className="a-pie">{localize(fotos.ptarSalitre.alt, lang)}</figcaption>
              </figure>
            </Sube>
          </div>
          <ul className="a-filas">
            {PAGINAS.map((p, i) => (
              <Sube as="li" key={p.to} delay={0.05 * i}>
                <Link to={p.to} className="a-fila">
                  <span className="q">{t(p.titulo)}</span>
                  <span className="d">{fill(t(p.texto), { boards: revistas })}</span>
                  <span className="ir" aria-hidden="true">→</span>
                </Link>
              </Sube>
            ))}
          </ul>
        </div>
      </section>
    </PageWrapper>
  );
};
