import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { PageWrapper } from '../../components/PageWrapper';
import { EncabezadoPagina } from '../../components/Apertura';
import { Sube } from '../../components/Sube';
import { useI18n, localize, type UIKey } from '../../context/i18n';
import { fotos, type Foto } from '../../components/data/fotos';
import { PLIEGO, MARGEN, Resaltar, Retrato, SumaVectorial, cargoDe, testimoniosDe } from '../purpose/TeachingPurposePage';

const MARCO: { titulo: UIKey; texto: UIKey }[] = [
  { titulo: 'philosophy.fw1.title', texto: 'philosophy.fw1.desc' },
  { titulo: 'philosophy.fw2.title', texto: 'philosophy.fw2.desc' },
];

const PRACTICAS: [UIKey, UIKey][] = [
  ['philosophy.practice1.bold', 'philosophy.practice1.text'],
  ['philosophy.practice2.bold', 'philosophy.practice2.text'],
  ['philosophy.practice3.bold', 'philosophy.practice3.text'],
  ['philosophy.practice4.bold', 'philosophy.practice4.text'],
  ['philosophy.practice5.bold', 'philosophy.practice5.text'],
];

const EN_LA_PRACTICA: [UIKey, UIKey][] = [
  ['philosophy.inPractice.assessment.bold', 'philosophy.inPractice.assessment.text'],
  ['philosophy.inPractice.content.bold', 'philosophy.inPractice.content.text'],
  ['philosophy.inPractice.feedback.bold', 'philosophy.inPractice.feedback.text'],
  ['philosophy.inPractice.tracking.bold', 'philosophy.inPractice.tracking.text'],
];

// Estudiantes de dos de los cursos, con lo que escribieron en la página de testimonios.
const EXALUMNOS = ['Daniela Aristizabal', 'David Santamaría', 'Jason Bernal Sánchez', 'Camilo Zarate'];

/** Una foto del margen, con su pie. */
const FotoMargen: React.FC<{ foto: Foto; forma?: string; delay?: number }> = ({ foto, forma = 'aspect-[4/3]', delay = 0.08 }) => {
  const { lang } = useI18n();
  return (
    <Sube delay={delay}>
      <figure className="mt-10">
        <img src={foto.src} alt={localize(foto.alt, lang)} loading="lazy" className={`a-bn w-full object-cover ${forma}`} />
        <figcaption className="a-pie">{localize(foto.alt, lang)}</figcaption>
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
        titulo={t('philosophy.title')}
        entrada={<p>{t('philosophy.sub')}</p>}
        accion={{ to: '/teaching/courses', label: t('philosophy.cta') }}
        foto={{ src: fotos.pouDiagrama.src, alt: localize(fotos.pouDiagrama.alt, lang) }}
      />

      {/* ── El marco: constructivismo co-adaptativo ── */}
      <section className="a-papel pt-6 pb-20 sm:pb-28">
        <div className={`a-c ${PLIEGO}`}>
          <div className={MARGEN}>
            <Sube><h2 className="a-h3">{sinCorte(t('philosophy.framework'))}</h2></Sube>
            <Sube delay={0.08} className="mt-12">
              <blockquote className="a-cita">{t('philosophy.quote')}</blockquote>
            </Sube>
          </div>
          <div className="space-y-6">
            <Sube><p className="a-texto">{t('philosophy.intro')}</p></Sube>
            {MARCO.map((m, i) => (
              <Sube key={m.titulo} delay={0.06 * (i + 1)} className="!mt-10">
                <h3 className="font-semibold text-tinta-900">{sinCorte(t(m.titulo))}</h3>
                <p className="a-texto mt-2">{t(m.texto)}</p>
              </Sube>
            ))}
          </div>
        </div>
      </section>

      {/* ── El principio central, con la suma para tocarla ── */}
      <section className="a-hundido a-campo">
        <div className={`a-c ${PLIEGO}`}>
          <div className={`${MARGEN} order-2 lg:order-1`}>
            <Sube delay={0.1}><SumaVectorial /></Sube>
          </div>
          <div className="order-1 lg:order-2">
            <Sube><h3 className="a-h3">{t('philosophy.fw3.title')}</h3></Sube>
            <Sube delay={0.06}><p className="a-texto mt-6">{t('philosophy.fw3.desc')}</p></Sube>
          </div>
        </div>
      </section>

      {/* ── La equidad y las cinco prácticas ── */}
      <section className="a-papel a-campo">
        <Bloque titulo={t('philosophy.equity')}>
          <Sube><p className="a-texto">{t('philosophy.equity.p')}</p></Sube>
        </Bloque>
        <Bloque
          titulo={t('philosophy.practices')}
          className="mt-20 sm:mt-28"
          fijo={false}
          margen={<><FotoMargen foto={fotos.cervezaGlucanos} /><FotoMargen foto={fotos.mentoria} delay={0.12} /></>}
        >
          <ol className="list-decimal pl-6 space-y-6 max-w-[64ch] marker:font-semibold marker:text-tinta-900">
            {PRACTICAS.map(([negrita, texto], i) => (
              <Sube as="li" key={negrita} delay={0.05 * i} className="pl-2">
                <strong className="font-semibold text-tinta-900">{t(negrita)}</strong>{t(texto)}
              </Sube>
            ))}
          </ol>
        </Bloque>
      </section>

      {/* ── Para quiénes: la foto del campus a todo el ancho ── */}
      <figure ref={banda} className="a-papel">
        <div className="overflow-hidden h-[52svh] min-h-[280px] max-h-[620px]">
          <motion.img
            src="/images/site/04.png"
            alt={t('philosophy.campus.alt')}
            loading="lazy"
            className="a-foto a-bn"
            style={{ objectPosition: 'center 70%', ...(reduce ? {} : { scale: escala }) }}
          />
        </div>
        <figcaption className="a-c a-pie">{t('philosophy.campus.alt')}</figcaption>
      </figure>

      {/* ── La base estoica y la filosofía en la práctica ── */}
      <section className="a-papel a-campo">
        <Bloque titulo={t('philosophy.stoic')}>
          <Sube><p className="a-texto">{t('philosophy.stoic.p')}</p></Sube>
        </Bloque>
        <Bloque titulo={t('philosophy.inPractice')} className="mt-20 sm:mt-28" margen={<FotoMargen foto={fotos.postersPou} />}>
          <ul className="list-disc pl-6 space-y-4 max-w-[64ch] marker:text-tinta-900">
            {EN_LA_PRACTICA.map(([negrita, texto], i) => (
              <Sube as="li" key={negrita} delay={0.05 * i} className="pl-2">
                <strong className="font-semibold text-tinta-900">{t(negrita)}</strong>{t(texto)}
              </Sube>
            ))}
          </ul>
        </Bloque>
      </section>

      {/* ── La transformación ── */}
      <section className="a-portada a-campo">
        <Bloque titulo={t('philosophy.transformation')} margen={<FotoMargen foto={fotos.sesionOlga} forma="aspect-[4/3] object-[50%_30%]" />}>
          <Sube><p className="a-texto">{t('philosophy.transformation.p1')}</p></Sube>
          <Sube delay={0.06}>
            <p className="a-texto text-tinta-900">
              <Resaltar texto={t('philosophy.transformation.p2')} frase={t('philosophy.mark')} />
            </p>
          </Sube>
        </Bloque>
      </section>

      {/* ── Quienes pasaron por esos cursos ── */}
      <section className="a-papel a-campo">
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
            <p className="a-pie !mt-0">{t('philosophy.students')}</p>
            <Link to="/teaching/testimonials" className="a-enlace">
              {t('philosophy.students.cta')} <span aria-hidden="true">→</span>
            </Link>
          </Sube>
        </div>
      </section>
    </PageWrapper>
  );
};
