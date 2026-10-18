import React, { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageWrapper } from '../components/PageWrapper';
import { EncabezadoPagina, Cabecera } from '../components/Apertura';
import { Sube } from '../components/Sube';
import { useI18n, localize, fill, type UIKey } from '../context/i18n';
import { useAppData } from '../context/AppDataContext';
import { researchLinesMap } from '../components/data/research';
import { editedBooksData } from '../components/data/editorships';
import { fotos, type Foto } from '../components/data/fotos';
import { metrics } from '../components/data/metrics';
import { studentsData, graduatedStudentsData } from '../components/data/students';
import { esPublicacion } from '../components/data/citations';
import type { ResearchArea } from '../types';

/** Texto con cursivas marcadas entre asteriscos: nombres de especies, genes y libros. */
const Rico: React.FC<{ texto: string }> = ({ texto }) => (
  <>
    {texto.split('*').map((trozo, i) => (i % 2 ? <i key={i}>{trozo}</i> : <React.Fragment key={i}>{trozo}</React.Fragment>))}
  </>
);

/** Lista de nombres como se dice: «A, B y C». */
const enumerar = (nombres: string[], lang: 'en' | 'es') => {
  if (nombres.length < 2) return nombres.join('');
  const y = lang === 'es' ? ' y ' : ' and ';
  return nombres.slice(0, -1).join(', ') + y + nombres[nombres.length - 1];
};

interface Estudiante { nombre: string; nivel: UIKey; foto?: string }
interface Publicacion { donde: string; ano: number; href: string; etiqueta?: UIKey }
interface Caso {
  id: string;
  titulo: UIKey;
  parrafos: UIKey[];
  foto?: { f: Foto; pie?: UIKey; pos?: string };
  estudiantes: Estudiante[];
  publicaciones: Publicacion[];
  /** Título de la lista de publicaciones, cuando no es «Dónde se publicó». */
  tituloPubs?: UIKey;
  enlaces?: { href: string; etiqueta: UIKey }[];
  ods: number[];
}

const doi = (d: string) => `https://doi.org/${d}`;
const retrato = (slug: string) => `/images/students/${slug}.jpg`;

/** Los cinco casos, con lo que se publicó de cada uno y sus estudiantes. Lo que sigue en
 *  revisión se nombra sin sus cifras; de la serie con Enel, solo lo que es público. */
const CASOS: Caso[] = [
  {
    id: 'raices',
    titulo: 'rc.case.roots.title',
    parrafos: ['rc.case.roots.p1', 'rc.case.roots.p2', 'rc.case.roots.p3'],
    estudiantes: [],
    tituloPubs: 'rc.case.roots.timeline',
    publicaciones: [
      { donde: 'PLoS ONE', ano: 2011, href: doi('10.1371/journal.pone.0017678') },
      { donde: 'Biotechnology and Bioengineering', ano: 2013, href: doi('10.1002/bit.24938') },
      { donde: 'Metabolic Engineering', ano: 2014, href: doi('10.1016/j.ymben.2013.11.002') },
      { donde: 'Biotechnology and Bioengineering', ano: 2018, href: doi('10.1002/bit.26590') },
      { donde: 'Scientific Reports', ano: 2020, href: doi('10.1038/s41598-020-71428-6') },
      { donde: 'Metabolic Engineering', ano: 2024, href: doi('10.1016/j.ymben.2024.03.008') },
      { donde: 'US 2025/0257369 A1', ano: 2025, href: 'https://patents.google.com/patent/US20250257369A1' },
    ],
    ods: [7, 9, 12, 13],
  },
  {
    id: 'lisosomales',
    titulo: 'rc.case.lyso.title',
    parrafos: ['rc.case.lyso.p1', 'rc.case.lyso.p2', 'rc.case.lyso.p3', 'rc.case.lyso.p4'],
    foto: { f: fotos.academiaMedicina, pie: 'rc.case.lyso.photo', pos: 'center 40%' },
    estudiantes: [
      { nombre: 'Andrés Felipe Leal', nivel: 'rc.lvl.phd.co', foto: retrato('andres-felipe-leal') },
      { nombre: 'Julian Daniel Torres Vanegas', nivel: 'rc.lvl.phd', foto: retrato('julian-daniel-torres-vanegas') },
      { nombre: 'Carlos Manuel Ramírez Acosta', nivel: 'rc.lvl.ms', foto: retrato('carlos-manuel-ramirez-acosta') },
      { nombre: 'Carlos Emilio Torres Garay', nivel: 'rc.lvl.ms.co', foto: retrato('carlos-emilio-torres-garay') },
      { nombre: 'David Arango', nivel: 'rc.lvl.ms.co', foto: retrato('david-arango-saavedra') },
    ],
    publicaciones: [
      { donde: 'Pharmaceutics', ano: 2021, href: doi('10.3390/pharmaceutics13030428') },
      { donde: 'Scientific Reports', ano: 2022, href: doi('10.1038/s41598-022-19407-x') },
      { donde: 'International Journal of Molecular Sciences', ano: 2022, href: doi('10.3390/ijms231810672') },
      { donde: 'Frontiers in Bioengineering and Biotechnology', ano: 2024, href: doi('10.3389/fbioe.2024.1420183') },
      { donde: 'Nanocarriers for Nucleic Acids and Proteins, CRC Press', ano: 2025, href: doi('10.1201/9781003473183') },
    ],
    ods: [3, 9],
  },
  {
    id: 'peptidos',
    titulo: 'rc.case.amp.title',
    parrafos: ['rc.case.amp.p1', 'rc.case.amp.p2', 'rc.case.amp.p3', 'rc.case.amp.p4'],
    foto: { f: fotos.mentoria, pos: 'center 40%' },
    estudiantes: [
      { nombre: 'María Camila Henao', nivel: 'rc.lvl.ms', foto: retrato('maria-camila-henao') },
      { nombre: 'Cristian F. Rodríguez', nivel: 'rc.lvl.ms.co', foto: retrato('cristian-f-rodriguez') },
      { nombre: 'Saúl Camilo Gómez Tinoco', nivel: 'rc.lvl.ms.co', foto: retrato('saul-camilo-gomez-tinoco') },
      { nombre: 'Valentina Quezada Pérez', nivel: 'rc.lvl.ms.co', foto: retrato('valentina-quezada-perez') },
      { nombre: 'Paola Ruiz Puentes', nivel: 'rc.lvl.ms.co' },
    ],
    publicaciones: [
      { donde: 'Antibiotics', ano: 2020, href: doi('10.3390/antibiotics9120854') },
      { donde: 'Micromachines', ano: 2021, href: doi('10.3390/mi12111377') },
      { donde: 'Membranes (AHB-1)', ano: 2022, href: doi('10.3390/membranes12060600') },
      { donde: 'Membranes (AMPs-Net)', ano: 2022, href: doi('10.3390/membranes12070708') },
      { donde: 'Antimicrobial Peptides, Elsevier', ano: 2024, href: 'https://www.sciencedirect.com/book/9780443153938/antimicrobial-peptides' },
    ],
    ods: [3, 9],
  },
  {
    id: 'sonido',
    titulo: 'rc.case.sound.title',
    parrafos: ['rc.case.sound.p1', 'rc.case.sound.p2', 'rc.case.sound.p3'],
    foto: { f: fotos.gradoBrayan, pie: 'rc.case.sound.photo', pos: 'center 35%' },
    estudiantes: [
      { nombre: 'Brayan Rodríguez', nivel: 'rc.lvl.phd.felipe', foto: retrato('brayan-rodriguez') },
      { nombre: 'Martha Liliana Díaz-Bustamante', nivel: 'rc.lvl.phd.now' },
    ],
    publicaciones: [
      { donde: 'Applied Sciences', ano: 2020, href: doi('10.3390/app10249008') },
      { donde: 'Foods', ano: 2021, href: doi('10.3390/foods10092063') },
      { donde: 'Journal of Environmental Psychology', ano: 2025, href: doi('10.1016/j.jenvp.2025.102749') },
      { donde: 'ACS Omega', ano: 2026, href: doi('10.1021/acsomega.5c13283') },
    ],
    enlaces: [{ href: 'https://sonicseasoning.vercel.app/', etiqueta: 'rc.case.sound.app' }],
    ods: [2, 3, 9, 12],
  },
  {
    id: 'el-colegio',
    titulo: 'rc.case.air.title',
    parrafos: ['rc.case.air.p1', 'rc.case.air.p2', 'rc.case.air.p3', 'rc.case.air.p4'],
    foto: { f: fotos.acofiGabriela, pie: 'rc.case.air.photo', pos: 'center 55%' },
    estudiantes: [
      { nombre: 'Gabriela Meléndez Plata', nivel: 'rc.lvl.ms.2026', foto: retrato('gabriela-melendez-plata') },
      { nombre: 'Jesús Rafael Acevedo Mastrogiacomo', nivel: 'rc.lvl.ms.co.2026', foto: retrato('jesus-rafael-acevedo') },
      { nombre: 'Martha Lizeth Castellanos Ordóñez', nivel: 'rc.lvl.phd.now' },
      { nombre: 'Mariana García Alba', nivel: 'rc.lvl.ug.2024' },
      { nombre: 'Esteban Muñoz Cardona', nivel: 'rc.lvl.ug.2024' },
    ],
    publicaciones: [
      { donde: 'Processes', ano: 2025, href: doi('10.3390/pr13041077') },
      { donde: 'ACOFI', ano: 2025, href: 'https://acofipapers.org/index.php/eiei/article/download/4507/2733', etiqueta: 'rc.case.air.talk' },
    ],
    enlaces: [
      { href: 'https://youtu.be/PhvCvoBIYfY', etiqueta: 'rc.case.air.v1' },
      { href: 'https://youtu.be/IRz5ar5qzmg', etiqueta: 'rc.case.air.v2' },
      { href: 'https://youtu.be/b4tzNIa5QsM', etiqueta: 'rc.case.air.v3' },
    ],
    ods: [3, 6, 11],
  },
];

const ORDEN_LINEAS: ResearchArea[] = [
  'Smart Biomaterials & Nanobiotechnology',
  'Molecular & Synthetic Biology',
  'Bioprocess Engineering',
  'Sustainability & Circular Economy',
  'Computational Biology & AI-Driven Design',
  'Reverse Engineering of Microorganisms',
  'Multisensory Experience Design',
  'Scholarship of Teaching & Learning',
];

const Externo: React.FC<{ href: string; children: React.ReactNode; className?: string }> = ({ href, children, className = '' }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={`a-enlace ${className}`}>
    {children} <span aria-hidden="true">↗</span>
  </a>
);

/** Un caso: el texto con sus resultados a la izquierda; a la derecha, la foto, los
 *  estudiantes, dónde se publicó y los ODS a los que aporta. */
const BloqueCaso: React.FC<{ caso: Caso; fondo: string }> = ({ caso, fondo }) => {
  const { t, lang } = useI18n();
  return (
    <section id={caso.id} className={`${fondo} a-campo scroll-mt-16`}>
      <div className="a-c">
        <Sube><Cabecera titulo={t(caso.titulo)} /></Sube>
        <div className="mt-12 grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div>
            {caso.parrafos.map((p, i) => (
              <Sube key={p} delay={0.04 * Math.min(i, 2)}>
                <p className={`a-texto ${i ? 'mt-6' : ''}`}><Rico texto={t(p)} /></p>
              </Sube>
            ))}
            {caso.enlaces && (
              <Sube className="mt-8">
                <ul className="flex flex-wrap gap-x-8 gap-y-3">
                  {caso.enlaces.map((e) => (
                    <li key={e.href}><Externo href={e.href}>{t(e.etiqueta)}</Externo></li>
                  ))}
                </ul>
              </Sube>
            )}
          </div>

          <div className="space-y-12">
            {caso.foto && (
              <Sube delay={0.08}>
                <figure>
                  <div className="overflow-hidden aspect-[4/3]">
                    <img
                      src={caso.foto.f.src}
                      alt={localize(caso.foto.f.alt, lang)}
                      loading="lazy"
                      className="a-foto a-bn"
                      style={{ objectPosition: caso.foto.pos ?? 'center' }}
                    />
                  </div>
                  <figcaption className="a-pie">{caso.foto.pie ? t(caso.foto.pie) : localize(caso.foto.f.alt, lang)}.</figcaption>
                </figure>
              </Sube>
            )}

            {caso.estudiantes.length > 0 && (
              <Sube delay={0.1}>
                <h3 className="font-semibold text-tinta-900">{t('rc.pg.students')}</h3>
                <ul className="mt-4 border-t-2 border-tinta-900">
                  {caso.estudiantes.map((e) => (
                    <li key={e.nombre} className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 items-center py-3 border-b-2 border-papel-300">
                      {e.foto ? (
                        <img src={e.foto} alt={e.nombre} loading="lazy" className="a-bn w-14 h-14 object-cover object-top" />
                      ) : (
                        <span aria-hidden="true" />
                      )}
                      <span className="min-w-0">
                        <span className="block text-tinta-900 leading-snug">{e.nombre}</span>
                        <span className="block a-s text-tinta-600">{t(e.nivel)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Sube>
            )}

            <Sube delay={0.12}>
              <h3 className="font-semibold text-tinta-900">{t(caso.tituloPubs ?? 'rc.pg.pubs')}</h3>
              <ul className="mt-4 border-t-2 border-tinta-900">
                {caso.publicaciones.map((p) => (
                  <li key={p.href} className="py-3 border-b-2 border-papel-300">
                    <a href={p.href} target="_blank" rel="noopener noreferrer" className="group grid grid-cols-[3.5rem_minmax(0,1fr)_auto] gap-x-4 items-baseline">
                      <span className="a-s text-tinta-600 tabular-nums">{p.ano}</span>
                      <span className="text-tinta-900 leading-snug group-hover:underline underline-offset-4">
                        {p.etiqueta ? t(p.etiqueta) : <i>{p.donde}</i>}
                      </span>
                      <span aria-hidden="true" className="text-tinta-600">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Sube>

            <Sube delay={0.14}>
              <p className="a-s text-tinta-700">{t('rc.pg.sdg')}:</p>
              <ul className="mt-2 a-s text-tinta-900 space-y-1">
                {caso.ods.map((n) => (
                  <li key={n}>
                    <span className="font-semibold tabular-nums">{n}</span>, {t(`rc.sdg.${n}` as UIKey)}
                  </li>
                ))}
              </ul>
            </Sube>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ResearchProgramPage = () => {
  const { t, lang } = useI18n();
  const { products } = useAppData();
  const { hash } = useLocation();

  // Al llegar con un ancla (#el-colegio) desde otra página, el caso se busca cuando ya existe.
  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const ir = () => document.getElementById(id)?.scrollIntoView({ block: 'start' });
    const r = window.setTimeout(ir, 120);
    return () => window.clearTimeout(r);
  }, [hash]);

  // Publicaciones de cada línea: sin ponencias, patentes ni la publicación secundaria.
  const porLinea = useMemo(() => {
    const cuenta: Partial<Record<ResearchArea, number>> = {};
    for (const p of products) {
      if (!esPublicacion(p)) continue;
      for (const a of p.researchAreas ?? []) cuenta[a] = (cuenta[a] ?? 0) + 1;
    }
    return cuenta;
  }, [products]);

  // Las líneas de cada libro salen de su ficha en products.json (por DOI o ISBN).
  const lineasDeLibro = (d?: string, isbn?: string) => {
    const ficha = products.find((p) => p.doi === d || p.doi === isbn);
    return (ficha?.researchAreas ?? []).map((a) => localize(researchLinesMap[a]?.title ?? a, lang));
  };

  const graduados = graduatedStudentsData.phd.length + graduatedStudentsData.ms.length;
  const actuales = studentsData.phd.length + studentsData.ms.length;
  const conteo = {
    pubs: products.filter(esPublicacion).length,
    patents: products.filter((p) => p.type === 'Patent').length,
    talks: products.filter((p) => p.type === 'Conference').length,
  };

  const resultados = [
    { to: '/research/products', q: t('nav.research.products'), d: fill(t('rc.more.products'), conteo) },
    { to: '/research/grants', q: t('nav.research.grants'), d: fill(t('rc.more.grants'), { n: metrics.research.grants, active: metrics.research.activeGrants }) },
    { to: '/research/students', q: t('students.title'), d: fill(t('rc.more.students'), { grad: graduados, cur: actuales }) },
  ];

  const patentes = [
    {
      ano: 2023,
      titulo: 'rc.pat.bio.title' as UIKey,
      donde: 'rc.pat.bio.where' as UIKey,
      texto: 'rc.pat.bio.text' as UIKey,
      foto: retrato('jorge-luis-patarroyo'),
      fotoAlt: 'Jorge Luis Patarroyo',
    },
    {
      ano: 2025,
      titulo: 'rc.pat.us.title' as UIKey,
      donde: 'rc.pat.us.where' as UIKey,
      texto: 'rc.pat.us.text' as UIKey,
      href: 'https://patents.google.com/patent/US20250257369A1',
    },
  ];

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('rc.pg.title')}
        entrada={<p className="[text-wrap:pretty]">{t('rc.pg.lead')}</p>}
        foto={{ src: '/images/site/generales-campus-2015-2015-69.jpg', alt: t('rc.pg.photo.alt'), posicion: '60% center' }}
      >
        <nav aria-label={t('rc.pg.cases')} className="mt-10">
          <ul className="a-filtros">
            {CASOS.map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`} className="inline-flex items-center min-h-[40px] px-4 a-s bg-papel-100 text-tinta-900 transition-colors hover:bg-resaltador-suave">
                  {t(c.titulo)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </EncabezadoPagina>

      {CASOS.map((c, i) => (
        <BloqueCaso key={c.id} caso={c} fondo={i % 2 ? 'a-papel' : 'a-hundido'} />
      ))}

      {/* ── Las patentes ── */}
      <section id="patentes" className="a-portada a-campo scroll-mt-16">
        <div className="a-c">
          <Sube><Cabecera titulo={t('rc.pat.title')} /></Sube>
          <ul className="a-registro mt-12">
            {patentes.map((p, i) => (
              <Sube as="li" key={p.titulo} delay={0.06 * i} className="lg:!grid-cols-[9rem_minmax(0,1fr)_14rem] lg:!py-10">
                <span className="cuando">{p.ano}</span>
                <div>
                  <p className="que max-w-[40ch]"><Rico texto={t(p.titulo)} /></p>
                  <p className="donde max-w-[64ch]">{t(p.donde)}</p>
                  <p className="detalle">{t(p.texto)}</p>
                  {p.href && <Externo href={p.href} className="inline-block mt-4 a-s">{t('rc.pat.link')}</Externo>}
                </div>
                {p.foto ? (
                  <figure className="max-w-[14rem]">
                    <img src={p.foto} alt={p.fotoAlt} loading="lazy" className="a-bn w-full aspect-square object-cover object-top" />
                    <figcaption className="a-pie !mt-2">{p.fotoAlt}</figcaption>
                  </figure>
                ) : <span className="hidden lg:block" />}
              </Sube>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Las ocho líneas: filas en letra grande, cada una con el enlace a sus productos ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('rc.lines.title')} /></Sube>
          <Sube delay={0.06}><p className="mt-8 a-texto">{t('rc.lines.text')}</p></Sube>
          <ul className="mt-10 border-t-2 border-tinta-900">
            {ORDEN_LINEAS.map((id, i) => {
              const line = researchLinesMap[id];
              const n = porLinea[id] ?? 0;
              return (
                <Sube
                  as="li"
                  key={id}
                  delay={0.04 * Math.min(i, 3)}
                  className="grid gap-x-12 gap-y-5 py-10 border-b-2 border-papel-300 md:grid-cols-[minmax(0,1fr)_9rem] lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)_10rem]"
                >
                  <h3 className="a-h3 max-w-[22ch] md:col-span-2 lg:col-span-1">{localize(line.title, lang)}</h3>
                  <p className="a-texto text-tinta-800">{localize(line.description, lang)}</p>
                  {n > 0 && (
                    <Link
                      to={`/research/products?area=${encodeURIComponent(id)}`}
                      className="group block self-start text-tinta-900 no-underline"
                    >
                      <span className="block a-titulo tabular-nums transition-transform duration-200 [@media(hover:hover)]:group-hover:-translate-y-0.5">{n}</span>
                      <span className="block a-s mt-2 underline underline-offset-4 decoration-1 [@media(hover:hover)]:group-hover:bg-resaltador-suave">
                        {t('rc.lines.pubs')} <span aria-hidden="true">→</span>
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
      <section className="a-hundido a-campo">
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
