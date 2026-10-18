import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../../components/PageWrapper';
import { EncabezadoPagina } from '../../components/Apertura';
import { Sube } from '../../components/Sube';
import { useI18n, localize } from '../../context/i18n';
import { graduatedStudentsData } from '../../components/data/students';
import { fotos } from '../../components/data/fotos';
import type { GraduatedStudent } from '../../types';
import { PLIEGO, MARGEN, Resaltar, Retrato } from './TeachingPurposePage';

// «El estudiante más fuerte se vuelve un multiplicador»: egresados del grupo que hoy enseñan,
// con el cargo de su ficha.
const DOCENTES = ['Brayan Rodríguez', 'Julian Daniel Torres Vanegas', 'Cristian F. Rodríguez', 'Tatiana Carolina Beltrán González'];

export const ServicePurposePage: React.FC = () => {
  const { t, lang } = useI18n();
  const todos = [...graduatedStudentsData.phd, ...graduatedStudentsData.ms];
  const docentes = DOCENTES.map((n) => todos.find((g) => g.name === n)).filter((g): g is GraduatedStudent => Boolean(g));

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('purpose.service.title')}
        entrada={<p>{t('purpose.service.sub')}</p>}
        accion={{ to: '/service', label: t('purpose.service.cta') }}
        foto={{ src: fotos.scoutingSelfie.src, alt: localize(fotos.scoutingSelfie.alt, lang) }}
      />

      {/* ── Las instituciones son ecosistemas ── */}
      <section className="a-papel pt-6 pb-20 sm:pb-28">
        <div className={`a-c ${PLIEGO}`}>
          <div className={MARGEN}>
            <Sube><h2 className="a-h3">{t('purpose.service.h2')}</h2></Sube>
            {/* Junto a lo que Uniandes le dio: el campus */}
            <Sube delay={0.08}>
              <figure className="mt-10">
                <img src="/images/site/campus-mision-historia-y-simbolos-0.webp" alt={t('purpose.service.photo.alt')} loading="lazy" className="a-bn w-full aspect-[4/3] object-cover" />
                <figcaption className="a-pie">{t('purpose.service.photo.alt')}</figcaption>
              </figure>
            </Sube>
          </div>
          <div className="space-y-6">
            <Sube><p className="a-texto">{t('purpose.service.p1')}</p></Sube>
            <Sube delay={0.06}>
              <p className="a-texto"><Resaltar texto={t('purpose.service.p2')} frase={t('purpose.service.mark')} /></p>
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
            <Sube><p className="a-texto">{t('purpose.service.p3')}</p></Sube>
            <Sube delay={0.06}><p className="a-texto">{t('purpose.service.p4')}</p></Sube>
          </div>
        </div>
      </section>

      {/* ── Lo que me sostiene, y la cadena que sigue ── */}
      <section className="a-papel a-campo">
        <div className={`a-c ${PLIEGO}`}>
          <div className={MARGEN}>
            <Sube delay={0.08}>
              <blockquote className="a-cita">{t('purpose.service.quote')}</blockquote>
            </Sube>
          </div>
          <div className="space-y-6">
            <Sube><p className="a-texto">{t('purpose.service.p5')}</p></Sube>
            <Sube delay={0.06}><p className="a-texto">{t('purpose.service.p6')}</p></Sube>
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
        {/* Diversidad, adaptación e interconexión: el cierre */}
        <div className={`a-c ${PLIEGO} mt-20 sm:mt-28`}>
          <div className="hidden lg:block" />
          <Sube><p className="a-texto text-tinta-900">{t('purpose.service.p7')}</p></Sube>
        </div>
      </section>
    </PageWrapper>
  );
};
