import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../../components/PageWrapper';
import { EncabezadoPagina } from '../../components/Apertura';
import { Sube } from '../../components/Sube';
import {
  editedBooksData,
  guestEditorshipsData,
  MY_EDITOR_NAME,
  type EditedBook,
  type GuestEditorship,
} from '../../components/data/editorships';
import { editorialData } from '../../components/data/institutional';
import { graduatedStudentsData } from '../../components/data/students';
import { useAppData } from '../../context/AppDataContext';
import { useI18n, localize, fill, cardinal, type UIKey } from '../../context/i18n';
import type { GraduatedStudent, Product } from '../../types';

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Sin tildes ni puntuación, para casar «Valentina Quezada» con «Valentina Quezada Pérez». */
const llano = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z ]/gi, '').replace(/\s+/g, ' ').trim().toLowerCase();

/** Los capítulos de un volumen que están en el registro de productos: primero la introducción,
 *  después en el orden del libro (el número final del DOI). */
const capitulosDe = (book: EditedBook, products: Product[]) =>
  products
    .filter((p) => p.type === 'Book Chapter' && (p.publicationVenue ?? '').includes(book.title))
    .sort((a, b) => {
      const intro = (p: Product) => (/^intro/i.test(p.title) ? 0 : 1);
      return intro(a) - intro(b) || a.doi.localeCompare(b.doi, undefined, { numeric: true });
    });

/** «A, B y C», con el nombre del profesor en negrita. */
const EditorList: React.FC<{ names: string[]; and: string }> = ({ names, and }) => (
  <>
    {names.map((name, i) => {
      const separator = i === 0 ? '' : i === names.length - 1 ? ` ${and} ` : ', ';
      return (
        <React.Fragment key={name}>
          {separator}
          {name === MY_EDITOR_NAME ? <strong className="font-semibold text-tinta-900">{name}</strong> : name}
        </React.Fragment>
      );
    })}
  </>
);

const BookEntry: React.FC<{ book: EditedBook; chapters: Product[] }> = ({ book, chapters }) => {
  const { t, lang } = useI18n();
  // El título va como título y el subtítulo aparte: así ningún título pasa de dos líneas.
  const [titulo, subtitulo] = book.title.split(/:\s+/, 2);

  let authored: string | null = null;
  if (book.authoredChapters > 0 && book.authoredIntroduction) {
    authored = fill(t('editorships.authored.chaptersIntro'), { n: cardinal(book.authoredChapters, lang) });
  } else if (book.authoredChapters > 0 && book.chapters) {
    authored = fill(t('editorships.authored.chaptersOf'), { n: cardinal(book.authoredChapters, lang), total: book.chapters });
  } else if (book.authoredIntroduction) {
    authored = t('editorships.authored.intro');
  }

  const meta = [
    fill(t('editorships.pages'), { n: book.pages }),
    book.chapters ? fill(t('editorships.chapters'), { n: book.chapters }) : null,
    book.isbn ? `ISBN ${book.isbn}` : null,
    book.doi ? `DOI ${book.doi}` : null,
    book.openAccess ? t('editorships.openAccess') : null,
  ].filter(Boolean) as string[];

  return (
    <Sube as="li" className="grid gap-x-12 gap-y-8 py-14 sm:py-16 sm:grid-cols-[180px_minmax(0,1fr)] lg:grid-cols-[230px_minmax(0,1fr)] border-b-2 border-papel-300">
      <a href={book.url} target="_blank" rel="noopener noreferrer" className="block self-start w-[150px] sm:w-full group">
        <img
          src={book.cover}
          alt={fill(t('editorships.coverAlt'), { title: book.title })}
          loading="lazy"
          className="block w-full h-auto transition-transform duration-200 group-hover:-translate-y-1"
        />
      </a>
      <div>
        <h3 className="a-h3">{titulo}</h3>
        {subtitulo && <p className="mt-2 a-entrada text-tinta-700">{subtitulo}</p>}
        <p className="mt-5 a-meta">{book.publisher} · {book.year}</p>
        <p className="mt-1 a-s">
          {t('editorships.editedBy')} <EditorList names={book.editors} and={t('editorships.and')} />
        </p>
        <p className="mt-6 a-texto">{localize(book.summary, lang)}</p>
        {authored && <p className="mt-4 a-texto font-semibold text-tinta-900">{authored}</p>}
        {chapters.length > 0 && (
          <>
            <h4 className="mt-8 font-semibold text-tinta-900">{t('editorships.chapters.title')}</h4>
            <ul className="mt-3 max-w-[72ch] space-y-2 a-s leading-[1.45]">
              {chapters.map((c) => (
                <li key={c.doi}>
                  <a href={`https://doi.org/${c.doi}`} target="_blank" rel="noopener noreferrer" className="a-enlace">{c.title}</a>
                </li>
              ))}
            </ul>
          </>
        )}
        <p className="mt-8 a-meta">{meta.join(' · ')}</p>
        <p className="mt-6">
          <a href={book.url} target="_blank" rel="noopener noreferrer" className="a-boton">
            {t('editorships.viewBook')} <span aria-hidden="true">↗</span>
          </a>
        </p>
      </div>
    </Sube>
  );
};

const IssueEntry: React.FC<{ issue: GuestEditorship; delay: number }> = ({ issue, delay }) => {
  const { t, lang } = useI18n();
  const donde = [
    issue.journal,
    localize(issue.section, lang),
    localize(issue.publisher, lang),
    t(`editorships.kind.${issue.kind}` as UIKey),
  ].filter(Boolean).join(' · ');

  return (
    <Sube as="li" delay={delay}>
      <span className="cuando">{issue.period}</span>
      <div>
        {/* En el teléfono el título va a 18 px: los de estas colecciones son frases largas. */}
        <p className="font-semibold text-tinta-900 tracking-[-0.02em] text-[18px] leading-[1.35] md:text-[length:var(--t-l)] md:leading-[1.15]">
          {issue.issueTitle}
        </p>
        <p className="donde">{donde}</p>
        <div className="detalle">
          <p>
            {t('editorships.guestEditors')}: <EditorList names={issue.editors} and={t('editorships.and')} />.
          </p>
          {issue.editorial && (
            <p className="mt-3">
              {t('editorships.editorial')}:{' '}
              <a href={`https://doi.org/${issue.editorial.doi}`} target="_blank" rel="noopener noreferrer" className="a-enlace">
                {issue.editorial.title}
              </a>{' '}
              <span className="text-tinta-600">(DOI {issue.editorial.doi})</span>
            </p>
          )}
        </div>
      </div>
    </Sube>
  );
};

/** Egresados del grupo que firman capítulos de estos volúmenes, con los capítulos de cada uno. */
const conEstudiantes = (capitulos: Product[]) => {
  const egresados: GraduatedStudent[] = [...graduatedStudentsData.phd, ...graduatedStudentsData.ms];
  const porEstudiante = new Map<GraduatedStudent, Product[]>();
  for (const c of capitulos) {
    for (const autor of c.authors) {
      const a = llano(autor);
      if (a === llano(MY_EDITOR_NAME)) continue;
      const e = egresados.find((s) => { const n = llano(s.name); return n === a || n.startsWith(a + ' ') || a.startsWith(n + ' '); });
      if (e) porEstudiante.set(e, [...(porEstudiante.get(e) ?? []), c]);
    }
  }
  return [...porEstudiante.entries()];
};

export const EditorshipsPage: React.FC = () => {
  const { t, lang } = useI18n();
  const { products } = useAppData();

  const capitulos = editedBooksData.map((book) => capitulosDe(book, products));
  const estudiantes = conEstudiantes(capitulos.flat());
  const capitulosConEstudiantes = new Set(estudiantes.flatMap(([, cs]) => cs.map((c) => c.doi))).size;

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina titulo={t('editorships.title')} entrada={<p>{t('editorships.sub')}</p>} />

      {/* ── Los libros: portada grande, sin panel; arrancan en la primera pantalla ── */}
      <section className="a-hundido a-campo !pt-14 sm:!pt-16">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('editorships.books.title')}</h2></Sube>
          <Sube delay={0.06}><p className="mt-6 a-texto">{t('editorships.books.lead')}</p></Sube>
          <ul className="mt-10 border-t-2 border-tinta-900">
            {editedBooksData.map((book, i) => (
              <BookEntry key={book.title} book={book} chapters={capitulos[i]} />
            ))}
          </ul>
        </div>
      </section>

      {/* ── Los capítulos escritos con egresados del grupo ── */}
      {estudiantes.length > 0 && (
        <section className="a-papel a-campo">
          <div className="a-c">
            <Sube><h2 className="a-h3">{t('editorships.students.title')}</h2></Sube>
            <Sube delay={0.06}>
              <p className="mt-6 a-texto">{fill(t('editorships.students.lead'), { n: cardinal(capitulosConEstudiantes, lang) })}</p>
            </Sube>
            <ul className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-12 lg:gap-x-10 lg:max-w-[980px]">
              {estudiantes.map(([e, cs], i) => (
                <Sube as="li" key={e.name} delay={0.06 * i}>
                  <img src={e.imageUrl} alt={e.name} loading="lazy" className="a-bn w-full aspect-[4/5] object-cover object-top" />
                  <p className="mt-4 font-semibold leading-tight text-tinta-900">{e.name}</p>
                  <p className="a-meta mt-1">{e.program ? localize(e.program, lang) : e.degree} · {e.graduationYear}</p>
                  <ul className="mt-3 space-y-2 a-s leading-[1.45] text-tinta-800">
                    {cs.map((c) => <li key={c.doi}>{c.title}</li>)}
                  </ul>
                </Sube>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Las ediciones invitadas, como registro ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('editorships.issues.title')}</h2></Sube>
          <Sube delay={0.06}>
            <p className="mt-6 a-texto">
              {fill(t('editorships.issues.lead'), { count: capitalize(cardinal(guestEditorshipsData.length, lang)) })}
            </p>
          </Sube>
          <ul className="a-registro !mt-8">
            {guestEditorshipsData.map((issue, i) => (
              <IssueEntry key={issue.issueTitle} issue={issue} delay={0.05 * i} />
            ))}
          </ul>
          <Sube className="mt-12">
            <p className="a-texto">
              {fill(t('editorships.boardsText'), { count: cardinal(editorialData.length, lang) })}{' '}
              <Link to="/service/editorial" className="a-enlace">{t('editorships.boardsLink')} <span aria-hidden="true">→</span></Link>
            </p>
          </Sube>
        </div>
      </section>
    </PageWrapper>
  );
};
