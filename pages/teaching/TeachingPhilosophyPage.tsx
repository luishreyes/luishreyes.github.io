import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { PageWrapper } from '../../components/PageWrapper';
import { EncabezadoPagina } from '../../components/Apertura';
import { Sube } from '../../components/Sube';
import { useI18n, localize, type UIKey } from '../../context/i18n';
import { fotos, type Foto } from '../../components/data/fotos';
import { PLIEGO, MARGEN, Resaltar, Retrato, cargoDe, testimoniosDe } from '../purpose/TeachingPurposePage';

// Lo que el enfoque pide en mis cursos, en el orden del texto.
const EN_MIS_CURSOS: UIKey[] = ['tch.ph.c1', 'tch.ph.c2', 'tch.ph.c3', 'tch.ph.c4', 'tch.ph.c5'];

// Estudiantes de dos de los cursos, con lo que escribieron en la página de testimonios.
const EXALUMNOS = ['Daniela Aristizabal', 'David Santamaría', 'Jason Bernal Sánchez', 'Camilo Zarate'];

/** Una foto del margen, con su pie. */
const FotoMargen: React.FC<{ foto: Foto; pie: string; forma?: string; delay?: number }> = ({ foto, pie, forma = 'aspect-[4/3]', delay = 0.08 }) => {
  const { lang } = useI18n();
  return (
    <Sube delay={delay}>
      <figure className="mt-10">
        <img src={foto.src} alt={localize(foto.alt, lang)} loading="lazy" className={`a-bn w-full object-cover ${forma}`} />
        <figcaption className="a-pie">{pie}</figcaption>
      </figure>
    </Sube>
  );
};

/** Las palabras con guion («co-adaptation») no se parten al final de la línea. */
const sinCorte = (texto: string) =>
  texto.split(/(\S*-\S*)/).map((trozo, i) => (trozo.includes('-') ? <span key={i} className="whitespace-nowrap">{trozo}</span> : trozo));

/** Un bloque del ensayo: su título en el margen, con las fotos que le tocan debajo, y el texto
 *  a la derecha. En el teléfono el texto va antes que las fotos. El margen se queda fijo solo
 *  cuando cabe en la pantalla. */
const Bloque: React.FC<{ titulo: string; children: React.ReactNode; margen?: React.ReactNode; fijo?: boolean; className?: string }> = ({
  titulo,
  children,
  margen,
  fijo = true,
  className = '',
}) => (
  <div className={`a-c grid gap-y-8 lg:gap-y-0 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16 ${className}`}>
    <div className={`lg:col-start-1 lg:row-start-1 ${fijo && !margen ? MARGEN : ''}`}>
      <Sube><h2 className="a-h3">{sinCorte(titulo)}</h2></Sube>
    </div>
    <div className="space-y-6 lg:col-start-2 lg:row-start-1 lg:row-span-2">{children}</div>
    {margen && <div className={`lg:col-start-1 lg:row-start-2 ${fijo ? MARGEN : ''}`}>{margen}</div>}
  </div>
);

/** La segunda idea de la filosofía docente: el constructivismo co-adaptativo. */
export const TeachingPhilosophyPage: React.FC = () => {
  const { t, lang } = useI18n();
  const exalumnos = testimoniosDe(EXALUMNOS);
  const reduce = useReducedMotion();
  const banda = useRef<HTMLDivElement>(null);
  // La foto de los estudiantes se acerca despacio mientras pasa.
  const { scrollYProgress } = useScroll({ target: banda, offset: ['start end', 'end start'] });
  const escala = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('tch.ph.title')}
        entrada={<p>{t('tch.ph.lead')}</p>}
        accion={{ to: '/teaching/courses', label: t('tch.ph.cta') }}
        foto={{ src: fotos.pouDiagrama.src, alt: localize(fotos.pouDiagrama.alt, lang) }}
      />

      {/* ── Los estudiantes de hoy ── */}
      <section className="a-papel pt-6 pb-20 sm:pb-28">
        <div className={`a-c ${PLIEGO}`}>
          <div className={MARGEN}>
            <Sube><h2 className="a-h3">{t('tch.ph.today')}</h2></Sube>
            <Sube delay={0.08} className="mt-12">
              <blockquote className="a-cita">{t('tch.ph.quote')}</blockquote>
            </Sube>
          </div>
          <div className="space-y-6">
            <Sube><p className="a-texto">{t('tch.ph.p1')}</p></Sube>
            <Sube delay={0.06}><p className="a-texto">{t('tch.ph.p2')}</p></Sube>
          </div>
        </div>
      </section>

      {/* ── El enfoque y lo que pide en mis cursos ── */}
      <section className="a-hundido a-campo">
        <Bloque titulo={t('tch.ph.approach')}>
          <Sube><p className="a-texto text-tinta-900">{t('tch.ph.a1')}</p></Sube>
        </Bloque>
        <Bloque
          titulo={t('tch.ph.inCourses')}
          className="mt-20 sm:mt-28"
          fijo={false}
          margen={<><FotoMargen foto={fotos.reto2019} pie={t('tch.ph.photo.reto')} /><FotoMargen foto={fotos.cervezaGlucanos} pie={t('tch.ph.photo.beer')} delay={0.12} /></>}
        >
          <ul className="border-t-2 border-tinta-900 max-w-[64ch]">
            {EN_MIS_CURSOS.map((clave, i) => (
              <Sube as="li" key={clave} delay={0.05 * i} className="py-4 border-b-2 border-papel-300 text-tinta-900">
                {clave === 'tch.ph.c5' ? <Resaltar texto={t(clave)} frase={t('tch.ph.mark')} /> : t(clave)}
              </Sube>
            ))}
          </ul>
          <Sube><p className="a-texto !mt-10">{t('tch.ph.p3')}</p></Sube>
        </Bloque>
      </section>

      {/* ── Para quiénes: la foto del campus a todo el ancho ── */}
      <figure ref={banda} className="a-papel">
        <div className="overflow-hidden h-[52svh] min-h-[280px] max-h-[620px]">
          <motion.img
            src="/images/site/04.png"
            alt={t('tch.ph.campus')}
            loading="lazy"
            className="a-foto a-bn"
            style={{ objectPosition: 'center 70%', ...(reduce ? {} : { scale: escala }) }}
          />
        </div>
        <figcaption className="a-c a-pie">{t('tch.ph.campus')}</figcaption>
      </figure>

      {/* ── Lo que documento ── */}
      <section className="a-papel a-campo">
        <Bloque titulo={t('tch.ph.record')} margen={<FotoMargen foto={fotos.postersPou} pie={t('tch.ph.photo.posters')} />}>
          <Sube><p className="a-texto">{t('tch.ph.r1')}</p></Sube>
          <Sube delay={0.06} className="flex flex-wrap gap-x-8 gap-y-3">
            <Link to="/teaching/scholarship" className="a-enlace">{t('tch.ph.r.sotl')} <span aria-hidden="true">→</span></Link>
            <Link to="/teaching/unit-ops" className="a-enlace">{t('tch.ph.r.unitops')} <span aria-hidden="true">→</span></Link>
          </Sube>
        </Bloque>
      </section>

      {/* ── Quienes pasaron por esos cursos ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {exalumnos.map((x, i) => (
              <Retrato
                key={x.name}
                src={x.imageUrl}
                nombre={x.name}
                linea={localize(x.context, lang)}
                detalle={localize(cargoDe(x), lang)}
                delay={0.06 * i}
              />
            ))}
          </ul>
          <Sube className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3">
            <p className="a-pie !mt-0">{t('tch.ph.students')}</p>
            <Link to="/teaching/testimonials" className="a-enlace">
              {t('tch.ph.students.cta')} <span aria-hidden="true">→</span>
            </Link>
          </Sube>
          <ul className="a-filas mt-20">
            <Sube as="li">
              <Link to="/teaching/purpose" className="a-fila">
                <span className="q">{t('tch.pu.title')}</span>
                <span className="d">{t('tch.ph.prev')}</span>
                <span className="ir" aria-hidden="true">→</span>
              </Link>
            </Sube>
          </ul>
        </div>
      </section>
    </PageWrapper>
  );
};
