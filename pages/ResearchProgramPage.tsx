import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/PageWrapper';
import { EncabezadoPagina } from '../components/Apertura';
import { Sube } from '../components/Sube';
import { useI18n, localize, fill, cardinal } from '../context/i18n';
import { useAppData } from '../context/AppDataContext';
import { researchLines, researchLinesMap } from '../components/data/research';
import { editedBooksData } from '../components/data/editorships';
import { fotos } from '../components/data/fotos';
import { metrics } from '../components/data/metrics';
import { studentsData, graduatedStudentsData } from '../components/data/students';
import type { ResearchArea } from '../types';

/** El dossier marca con el resaltador la frase que manda: la primera del párrafo. */
const conResaltado = (texto: string) => {
  const corte = texto.indexOf('. ');
  if (corte < 0) return texto;
  return (
    <>
      <span className="a-resaltado">{texto.slice(0, corte + 1)}</span>
      {texto.slice(corte + 1)}
    </>
  );
};

const mayuscula = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Lista de nombres como se dice: «A, B y C». */
const enumerar = (nombres: string[], lang: 'en' | 'es') => {
  if (nombres.length < 2) return nombres.join('');
  const y = lang === 'es' ? ' y ' : ' and ';
  return nombres.slice(0, -1).join(', ') + y + nombres[nombres.length - 1];
};

export const ResearchProgramPage = () => {
  const { t, lang } = useI18n();
  const { products } = useAppData();

  // Cuántos productos lleva cada línea, para el enlace a la lista filtrada.
  const porLinea = useMemo(() => {
    const cuenta: Partial<Record<ResearchArea, number>> = {};
    for (const p of products) for (const a of p.researchAreas ?? []) cuenta[a] = (cuenta[a] ?? 0) + 1;
    return cuenta;
  }, [products]);

  // Las líneas de cada libro salen de su ficha en products.json (por DOI o ISBN).
  const lineasDeLibro = (doi?: string, isbn?: string) => {
    const ficha = products.find((p) => p.doi === doi || p.doi === isbn);
    return (ficha?.researchAreas ?? []).map((a) => localize(researchLinesMap[a]?.title ?? a, lang));
  };

  const primerAno = useMemo(() => {
    const anos = products.map((p) => parseInt(p.publicationDate.slice(0, 4), 10)).filter(Number.isFinite);
    return anos.length ? Math.min(...anos) : null;
  }, [products]);

  const graduados = graduatedStudentsData.phd.length + graduatedStudentsData.ms.length;
  const actuales = studentsData.phd.length + studentsData.ms.length;

  const resultados = [
    {
      to: '/research/products',
      q: t('nav.research.products'),
      d: fill(t('research.program.more.products'), { n: products.length, first: primerAno ?? '' }),
    },
    {
      to: '/research/grants',
      q: t('grants.title'),
      d: fill(t('research.program.more.grants'), { n: metrics.research.grants, active: metrics.research.activeGrants }),
    },
    {
      to: '/research/students',
      q: t('students.title'),
      d: fill(t('research.program.more.students'), { grad: graduados, cur: actuales }),
    },
  ];

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('research.program.title')}
        entrada={<p className="[text-wrap:pretty]">{t('research.program.sub')}</p>}
        accion={{ to: '/research/products', label: t('research.program.cta') }}
        foto={{ src: '/images/site/generales-campus-2015-2015-69.jpg', alt: t('research.program.photo.alt'), posicion: '60% center' }}
      />

      {/* ── Cómo trabaja el grupo: los dos párrafos del programa, uno junto al otro ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('research.program.approach.title')}.</h2></Sube>
          <div className="mt-10 grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <div>
              <Sube delay={0.06}><p className="a-texto text-tinta-900">{conResaltado(t('research.program.para1'))}</p></Sube>
              <Sube delay={0.12}><p className="a-texto text-tinta-900 mt-6">{t('research.program.para2')}</p></Sube>
            </div>
            <Sube delay={0.16}>
              <figure>
                <div className="overflow-hidden aspect-[4/3]">
                  <img src={fotos.mentoria.src} alt={localize(fotos.mentoria.alt, lang)} loading="lazy" className="a-foto a-bn" />
                </div>
                <figcaption className="a-pie">{localize(fotos.mentoria.alt, lang)}.</figcaption>
              </figure>
            </Sube>
          </div>
        </div>
      </section>

      {/* ── Las líneas: filas en letra grande, cada una con el enlace a sus productos ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube>
            <h2 className="a-h3">
              {mayuscula(fill(t('research.program.lines.title'), { n: cardinal(researchLines.length, lang) }))}.
            </h2>
          </Sube>
          <ul className="mt-10 border-t-2 border-tinta-900">
            {researchLines.map((line, i) => {
              const n = porLinea[line.id] ?? 0;
              return (
                <Sube
                  as="li"
                  key={line.id}
                  delay={0.04 * Math.min(i, 3)}
                  className="grid gap-x-12 gap-y-5 py-10 border-b-2 border-papel-300 md:grid-cols-[minmax(0,1fr)_9rem] lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)_10rem]"
                >
                  <h3 className="a-h3 max-w-[22ch] md:col-span-2 lg:col-span-1">{localize(line.title, lang)}</h3>
                  <p className="a-texto text-tinta-800">{localize(line.description, lang)}</p>
                  {n > 0 && (
                    <Link
                      to={`/research/products?area=${encodeURIComponent(line.id)}`}
                      className="group block self-start text-tinta-900 no-underline"
                    >
                      <span className="block a-titulo tabular-nums transition-transform duration-200 [@media(hover:hover)]:group-hover:-translate-y-0.5">{n}</span>
                      <span className="block a-s mt-2 underline underline-offset-4 decoration-1 [@media(hover:hover)]:group-hover:bg-resaltador-suave">
                        {t('research.program.lines.products')} <span aria-hidden="true">→</span>
                      </span>
                    </Link>
                  )}
                </Sube>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── Los libros editados: portada, editorial y las líneas a las que pertenecen ── */}
      <section className="a-portada a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('research.program.books.title')}.</h2></Sube>
          <Sube delay={0.06}><p className="mt-4 a-texto">{t('research.program.books.text')}</p></Sube>
          <ul className="mt-12 grid gap-x-10 gap-y-14 md:grid-cols-3">
            {editedBooksData.map((libro, i) => {
              const lineas = lineasDeLibro(libro.doi, libro.isbn);
              return (
                <Sube as="li" key={libro.title} delay={0.08 * i} className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-6 md:block">
                  <a href={libro.url} target="_blank" rel="noopener noreferrer" className="block w-[8.5rem] md:w-[11rem] group">
                    <img
                      src={libro.cover}
                      alt={`${t('products.cover.alt')} ${libro.title}`}
                      className="w-full aspect-[7/10] object-cover transition-transform duration-300 [@media(hover:hover)]:group-hover:-translate-y-1"
                    />
                  </a>
                  <div className="md:mt-6">
                    <p className="font-semibold leading-snug text-tinta-900">{libro.title}</p>
                    <p className="a-meta mt-2">{libro.publisher} · {libro.year} · {fill(t('research.program.books.pages'), { n: libro.pages })}</p>
                    <p className="a-s mt-3 text-tinta-800">{fill(t('research.program.books.editors'), { names: enumerar(libro.editors, lang) })}</p>
                    {lineas.length > 0 && <p className="a-s mt-1 text-tinta-800">{t('products.lines')}: {lineas.join(' · ')}</p>}
                    <a href={libro.url} target="_blank" rel="noopener noreferrer" className="a-enlace a-s inline-block mt-4">
                      {t('research.program.books.link')} <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </Sube>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── Adónde lleva el programa: productos, proyectos y estudiantes ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3 mb-10">{t('research.program.more.title')}.</h2></Sube>
          <ul className="a-filas">
            {resultados.map((r, i) => (
              <Sube as="li" key={r.to} delay={0.06 * i}>
                <Link to={r.to} className="a-fila">
                  <span className="q">{r.q}</span>
                  <span className="d">{r.d}</span>
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
