import React, { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../../components/PageWrapper';
import { EncabezadoPagina } from '../../components/Apertura';
import { Sube } from '../../components/Sube';
import { useI18n, localize, num, type UIKey } from '../../context/i18n';
import { testimonials, type Testimonial } from '../../components/data/teaching';
import { graduatedStudentsData } from '../../components/data/students';
import { fotos } from '../../components/data/fotos';

/* Las cuatro páginas de lectura (los tres propósitos y la filosofía) se arman como las
   páginas de lectura del portafolio impreso: un margen a la izquierda con el título del
   bloque, la cita o la figura, y el texto a la derecha en una medida cómoda. */
export const PLIEGO = 'grid gap-y-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-16';
export const MARGEN = 'lg:sticky lg:top-28 lg:self-start';

/** Resalta con el marcador una frase que ya está en el párrafo (una sola por página). */
export const Resaltar: React.FC<{ texto: string; frase: string }> = ({ texto, frase }) => {
  const i = texto.indexOf(frase);
  if (i < 0) return <>{texto}</>;
  return (
    <>
      {texto.slice(0, i)}
      <span className="a-resaltado">{frase}</span>
      {texto.slice(i + frase.length)}
    </>
  );
};

/** Retrato de una persona con su nombre y, debajo, de dónde viene y dónde está. */
export const Retrato: React.FC<{ src: string; nombre: string; linea: string; detalle?: string; delay?: number; cuadrado?: boolean }> = ({
  src,
  nombre,
  linea,
  detalle,
  delay = 0,
  cuadrado = false,
}) => (
  <Sube as="li" delay={delay}>
    <img src={src} alt={nombre} loading="lazy" className={`a-bn w-full object-cover object-top ${cuadrado ? 'aspect-square' : 'aspect-[4/5]'}`} />
    <p className="mt-4 font-semibold leading-tight text-tinta-900">{nombre}</p>
    <p className="a-meta mt-1">{linea}</p>
    {detalle && <p className="a-s mt-2 text-tinta-700">{detalle}</p>}
  </Sube>
);

/** Cargo actual de quien dio un testimonio: el de su ficha de egresado, si la tiene. */
export const cargoDe = (x: Testimonial) => {
  const ficha = x.graduateName
    ? [...graduatedStudentsData.phd, ...graduatedStudentsData.ms].find((g) => g.name === x.graduateName)
    : undefined;
  return ficha?.currentPosition ?? x.info;
};

export const testimoniosDe = (nombres: string[]) =>
  nombres
    .map((n) => testimonials.find((x) => x.name === n && x.category === 'Teaching & Mentorship'))
    .filter((x): x is Testimonial => Boolean(x));

const CASOS: { clave: UIKey; angulo: number }[] = [
  { clave: 'vector.aligned', angulo: 0 },
  { clave: 'vector.orthogonal', angulo: 90 },
  { clave: 'vector.opposed', angulo: 180 },
];

/** La suma vectorial del ensayo, para tocarla: el estudiante llega con su vector, el
 *  educador suma el suyo con el ángulo que escoja y la resultante (con el marcador) dice
 *  cuánto avanza y cuánto se desvía. Las frases que acompañan cada caso son del texto. */
export const SumaVectorial: React.FC = () => {
  const { t, lang } = useI18n();
  const id = useId().replace(/:/g, '');
  const [angulo, setAngulo] = useState(90);
  const rad = (angulo * Math.PI) / 180;
  const L = 150;
  const O = { x: 24, y: 236 };
  const S = { x: O.x + L, y: O.y };
  const E = { x: S.x + L * Math.cos(rad), y: S.y - L * Math.sin(rad) };
  const avance = Math.max(0, 1 + Math.cos(rad));
  const desvio = Math.max(0, Math.sin(rad));
  const nula = Math.hypot(E.x - O.x, E.y - O.y) < 4;
  const frase: UIKey =
    angulo <= 25 ? 'vector.say.aligned'
    : angulo >= 155 ? 'vector.say.opposed'
    : angulo >= 70 && angulo <= 110 ? 'vector.say.orthogonal'
    : 'vector.say.between';

  const punta = (nombre: string, color: string) => (
    <marker id={`${id}-${nombre}`} viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="18" markerHeight="18" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill={color} />
    </marker>
  );

  return (
    <figure>
      <ul className="mb-3 flex flex-wrap gap-x-6 gap-y-2 a-s text-tinta-700" aria-hidden="true">
        <li className="flex items-center gap-2"><span className="inline-block w-7 h-[6px] bg-tinta-400" />{t('vector.student')}</li>
        <li className="flex items-center gap-2"><span className="inline-block w-7 h-[6px] bg-tinta-700" />{t('vector.educator')}</li>
        <li className="flex items-center gap-2">
          <span className="relative inline-block w-7 h-[12px] bg-resaltador"><span className="absolute inset-x-0 top-[4.5px] h-[3px] bg-tinta-900" /></span>
          {t('vector.resultant')}
        </li>
      </ul>
      <svg viewBox="0 66 360 196" className="w-full h-auto" role="img"
        aria-label={`${t('vector.angle')}: ${angulo}°. ${t('vector.forward')} ${num(avance, lang, 2)}, ${t('vector.sideways')} ${num(desvio, lang, 2)}.`}>
        <defs>
          {punta('e', '#8E8E92')}
          {punta('d', '#4A4A4C')}
          {punta('r', '#1D1D1B')}
        </defs>
        {/* La resultante lleva el marcador debajo: es lo que cambia cuando se toca. */}
        {nula ? (
          <circle cx={O.x} cy={O.y} r="9" fill="#FFE900" />
        ) : (
          <line x1={O.x} y1={O.y} x2={E.x} y2={E.y} stroke="#FFE900" strokeWidth="16" strokeLinecap="round" />
        )}
        <line x1={O.x} y1={O.y} x2={S.x - 6} y2={S.y} stroke="#8E8E92" strokeWidth="6" markerEnd={`url(#${id}-e)`} />
        {!nula && (
          <line x1={S.x} y1={S.y} x2={E.x - 6 * Math.cos(rad)} y2={E.y + 6 * Math.sin(rad)} stroke="#4A4A4C" strokeWidth="6" markerEnd={`url(#${id}-d)`} />
        )}
        {nula ? (
          <circle cx={O.x} cy={O.y} r="3" fill="#1D1D1B" />
        ) : (
          <line x1={O.x} y1={O.y} x2={E.x} y2={E.y} stroke="#1D1D1B" strokeWidth="3" markerEnd={`url(#${id}-r)`} />
        )}
      </svg>
      <div className="mt-6 a-cifras !grid-cols-2" aria-live="polite">
        <div><b>{num(avance, lang, 2)}</b><span>{t('vector.forward')}</span></div>
        <div><b>{num(desvio, lang, 2)}</b><span>{t('vector.sideways')}</span></div>
      </div>
      <p className="mt-6 a-texto text-tinta-900">{t(frase)}</p>
      <div className="mt-8 a-filtros" role="group" aria-label={t('vector.presets')}>
        {CASOS.map((c) => (
          <button key={c.clave} type="button" aria-pressed={angulo === c.angulo} onClick={() => setAngulo(c.angulo)}>
            {t(c.clave)}
          </button>
        ))}
      </div>
      <label className="mt-6 block a-s text-tinta-800">
        {t('vector.angle')}: <span className="font-semibold tabular-nums text-tinta-900">{angulo}°</span>
        <input
          type="range" min={0} max={180} step={5} value={angulo}
          onChange={(e) => setAngulo(Number(e.target.value))}
          className="mt-2 block w-full h-11 cursor-pointer accent-[#1D1D1B]"
        />
      </label>
      <figcaption className="a-pie">{t('vector.caption')} {t('vector.unit')}</figcaption>
    </figure>
  );
};

const EXALUMNOS = ['Juanita Sierra', 'Carlos Manuel Ramírez Acosta', 'Fabio Esteban Herrera', 'Camila Ocasión'];

export const TeachingPurposePage: React.FC = () => {
  const { t, lang } = useI18n();
  const exalumnos = testimoniosDe(EXALUMNOS);

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('purpose.teaching.title')}
        entrada={<p>{t('purpose.teaching.sub')}</p>}
        accion={{ to: '/principles/philosophy', label: t('purpose.teaching.cta') }}
        foto={{ src: fotos.cervezaProteinas.src, alt: localize(fotos.cervezaProteinas.alt, lang) }}
      />

      {/* ── De dónde viene: la vocación y la frase de Álvaro Ramírez ── */}
      <section className="a-papel pt-6 pb-20 sm:pb-28">
        <div className={`a-c ${PLIEGO}`}>
          <div className={MARGEN}>
            <Sube><h2 className="a-h3">{t('purpose.teaching.h2')}</h2></Sube>
          </div>
          <div className="space-y-6">
            <Sube><p className="a-texto">{t('purpose.teaching.p1')}</p></Sube>
            <Sube delay={0.06} className="!my-14">
              <blockquote className="a-cita !max-w-[46ch]">{t('purpose.teaching.quote')}</blockquote>
              <span className="a-quien">{t('purpose.teaching.quote.who')}</span>
            </Sube>
            <Sube delay={0.06}><p className="a-texto">{t('purpose.teaching.p2')}</p></Sube>
          </div>
        </div>
      </section>

      {/* ── La metáfora vectorial, con la suma para tocarla ── */}
      <section className="a-hundido a-campo">
        <div className={`a-c ${PLIEGO}`}>
          <div className={`${MARGEN} order-2 lg:order-1`}>
            <Sube delay={0.1}><SumaVectorial /></Sube>
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <Sube><p className="a-texto">{t('purpose.teaching.p3')}</p></Sube>
            <Sube delay={0.06}><p className="a-texto">{t('purpose.teaching.p4')}</p></Sube>
            <Sube delay={0.1}>
              <p className="a-texto"><Resaltar texto={t('purpose.teaching.p5')} frase={t('purpose.teaching.mark')} /></p>
            </Sube>
          </div>
        </div>
      </section>

      {/* ── «Algunos vuelven años después a decírmelo»: quienes volvieron ── */}
      <section className="a-papel a-campo">
        <div className={`a-c ${PLIEGO}`}>
          <div className="hidden lg:block" />
          <Sube><p className="a-texto">{t('purpose.teaching.p6')}</p></Sube>
        </div>
        <div className="a-c mt-14">
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
            <p className="a-pie !mt-0">{t('purpose.teaching.students')}</p>
            <Link to="/teaching/testimonials" className="a-enlace">
              {t('purpose.teaching.students.cta')} <span aria-hidden="true">→</span>
            </Link>
          </Sube>
        </div>
        {/* El aula que quiero: el cierre */}
        <div className={`a-c ${PLIEGO} mt-20 sm:mt-28`}>
          <div className="hidden lg:block" />
          <div className="space-y-6">
            <Sube><p className="a-texto">{t('purpose.teaching.p7')}</p></Sube>
            <Sube delay={0.06}><p className="a-texto text-tinta-900">{t('purpose.teaching.p8')}</p></Sube>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};
