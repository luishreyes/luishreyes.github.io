import React from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '../data/classroom';
import './pou-2027-theme.css';

// Piezas de cabecera de los cursos con identidad institucional (POU 2027-10):
// la barra del curso y el mosaico de láminas. El landing las usa completas y
// las páginas internas (material, simuladores) las usan en franja, para que
// todas se reconozcan como parte del mismo curso.

type Activa = 'material' | 'simuladores' | 'cronograma';

// Documento interno del curso: se abre en el visor de la misma página.
const isInternalDoc = (slug: string, href?: string): boolean =>
  !!href && href.startsWith(`/classroom/${slug}/`);
const toViewer = (slug: string, href: string): string =>
  `/classroom/${slug}/ver/${href.slice(`/classroom/${slug}/`.length)}`;

export const Pou27Barra: React.FC<{ course: Course; activa?: Activa; enInicio?: boolean }> = ({
  course,
  activa,
  enInicio = false,
}) => {
  const cronograma = course.readings.find((r) => r.slug === 'cronograma-interactivo');
  const actual = (a: Activa) => (activa === a ? ('page' as const) : undefined);
  return (
    <div className="barra">
      {/* En el landing la marca lleva al aula; en las páginas internas, al inicio del curso. */}
      <Link className="marca" to={enInicio ? '/classroom' : `/classroom/${course.slug}`}>
        Aula · {course.code} · {course.term}
      </Link>
      <nav aria-label="Accesos del curso">
        <Link to={`/classroom/${course.slug}/readings`} aria-current={actual('material')}>
          Material
        </Link>
        {(course.simulations?.length ?? 0) > 0 && (
          <Link to={`/classroom/${course.slug}/simulations`} aria-current={actual('simuladores')}>
            Simuladores
          </Link>
        )}
        {cronograma?.href &&
          (isInternalDoc(course.slug, cronograma.href) ? (
            <Link to={toViewer(course.slug, cronograma.href)} aria-current={actual('cronograma')}>
              Cronograma
            </Link>
          ) : (
            <a href={cronograma.href} target="_blank" rel="noopener noreferrer">
              Cronograma
            </a>
          ))}
      </nav>
    </div>
  );
};

export const Pou27Mosaico: React.FC<{ course: Course; franja?: boolean }> = ({ course, franja = false }) => {
  const A = `/classroom/${course.slug}/assets`;
  // En franja cabe una sola fila: seis columnas, con el alambique adentro.
  if (franja)
    return (
      <div className="mosaico franja" aria-hidden="true">
        <div className="m-ancha"><img src={`${A}/hero-naranjas.jpg`} alt="" width={1421} height={1124} /></div>
        <div className="t-am" />
        <div className="m-ancha"><img src={`${A}/alambique.jpg`} alt="" width={1500} height={1171} /></div>
        <div className="t-nv" />
      </div>
    );
  return (
    <div className="mosaico" aria-hidden="true">
      <div className="m-ancha"><img src={`${A}/hero-naranjas.jpg`} alt="" width={1421} height={1124} /></div>
      <div className="t-am m-alta" />
      <div className="m-oculta"><img src={`${A}/hero-rama.jpg`} alt="" width={1459} height={1182} /></div>
      <div className="t-nv m-oculta" />
      <div className="t-pp m-oculta" />
      <div className="m-oculta"><img src={`${A}/hero-limones.jpg`} alt="" width={1344} height={999} /></div>
      <div className="t-nv m-oculta" />
      <div className="m-ancha"><img src={`${A}/alambique.jpg`} alt="" width={1500} height={1171} /></div>
      <div className="t-am m-oculta" />
    </div>
  );
};

// Cabecera de las páginas internas: barra más franja de mosaico.
export const Pou27Cabecera: React.FC<{ course: Course; activa: Activa }> = ({ course, activa }) => (
  <div className="pou27">
    <Pou27Barra course={course} activa={activa} />
    <Pou27Mosaico course={course} franja />
  </div>
);
