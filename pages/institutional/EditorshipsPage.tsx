import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageWrapper } from '../../components/PageWrapper';
import {
  editedBooksData,
  guestEditorshipsData,
  MY_EDITOR_NAME,
  type EditedBook,
  type GuestEditorship,
} from '../../components/data/editorships';
import { editorialData } from '../../components/data/institutional';
import { useI18n, localize, fill, cardinal, type UIKey } from '../../context/i18n';

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

// Lucide icons, inline so they inherit size and colour from the surrounding text.
const IconPen = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20h9" /><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
  </svg>
);

const IconExternal = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

const IconArrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** "A, B and C", with the professor's own name set in bold. */
const EditorList: React.FC<{ names: string[]; and: string }> = ({ names, and }) => (
  <>
    {names.map((name, i) => {
      const separator = i === 0 ? '' : i === names.length - 1 ? ` ${and} ` : ', ';
      return (
        <React.Fragment key={name}>
          {separator}
          {name === MY_EDITOR_NAME ? <strong className="font-semibold text-brand-dark">{name}</strong> : name}
        </React.Fragment>
      );
    })}
  </>
);

const BookCard: React.FC<{ book: EditedBook }> = ({ book }) => {
  const { t, lang } = useI18n();
  const role = t(book.role === 'first-editor' ? 'editorships.role.first' : 'editorships.role.co');

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
  ].filter(Boolean) as string[];

  return (
    <article className="bg-white rounded-xl shadow-lg border border-yellow-400/40 overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* A typographic cover: publisher and year, no borrowed artwork */}
      <div className="md:w-1/3 flex items-center justify-center p-8 bg-zinc-50">
        <div className="relative w-32 h-44 rounded-r-md rounded-l-sm bg-brand-dark shadow-xl border-l-8 border-brand-yellow flex flex-col justify-between p-4" aria-hidden="true">
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/60 leading-snug">{book.publisher}</span>
          <span className="text-3xl font-bold text-brand-yellow tabular-nums">{book.year}</span>
        </div>
      </div>
      <div className="p-8 flex flex-col justify-between md:w-2/3">
        <div>
          <p className="block text-sm font-semibold text-yellow-500 uppercase tracking-wide">
            {role} ({book.year})
          </p>
          <h3 className="mt-2 text-2xl font-bold text-brand-dark leading-tight">{book.title}</h3>
          <p className="mt-2 font-medium text-brand-dark">{book.publisher}</p>
          <p className="mt-1 text-sm text-brand-gray">
            {t('editorships.editedBy')} <EditorList names={book.editors} and={t('editorships.and')} />
          </p>

          <p className="mt-4 text-brand-gray text-base leading-relaxed">{localize(book.summary, lang)}</p>

          {authored && (
            <p className="mt-4 flex items-start gap-3 text-sm text-brand-dark">
              <span className="mt-0.5 flex-shrink-0 text-base text-yellow-500"><IconPen /></span>
              <span className="leading-relaxed">{authored}</span>
            </p>
          )}

          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            {meta.map((item) => <li key={item}>{item}</li>)}
            {book.openAccess && <li className="text-yellow-700">{t('editorships.openAccess')}</li>}
          </ul>
        </div>
        <div className="mt-6">
          <a
            href={book.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-yellow-400 text-brand-dark font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-yellow-500 transition-colors duration-300 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-400"
          >
            {t('editorships.viewBook')}
            <IconExternal />
          </a>
        </div>
      </div>
    </article>
  );
};

const GuestEditorshipCard: React.FC<{ issue: GuestEditorship }> = ({ issue }) => {
  const { t, lang } = useI18n();
  const where = [localize(issue.section, lang), localize(issue.publisher, lang)].filter(Boolean).join(' · ');

  return (
    <article className="h-full bg-white rounded-xl shadow-lg border border-zinc-200 border-l-4 border-l-brand-yellow p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-yellow-800 bg-yellow-100 px-2 py-1 rounded-md">
          {t(`editorships.kind.${issue.kind}` as UIKey)}
        </span>
        <span className="text-xs font-semibold text-brand-dark bg-zinc-100 px-2 py-1 rounded-md tabular-nums">{issue.period}</span>
      </div>

      <p className="mt-4 text-sm font-bold uppercase tracking-widest text-brand-dark">{issue.journal}</p>
      <p className="mt-1 text-sm text-brand-gray">{where}</p>

      <h3 className="mt-4 text-xl font-bold text-brand-dark leading-snug">{issue.issueTitle}</h3>

      <p className="mt-3 text-sm font-semibold text-yellow-500 uppercase tracking-wide">{localize(issue.role, lang)}</p>
      <p className="mt-1 text-sm text-brand-gray">{localize(issue.withEditors, lang)}</p>

      {issue.facts && (
        <ul className="mt-4 space-y-1 text-sm text-brand-gray">
          {issue.facts.map((fact) => (
            <li key={localize(fact, 'en')} className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-yellow-400" aria-hidden="true" />
              <span>{localize(fact, lang)}</span>
            </li>
          ))}
        </ul>
      )}

      {issue.editorial && (
        <div className="mt-5 border-t border-zinc-100 pt-4">
          <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">{t('editorships.editorial')}</p>
          <a
            href={`https://doi.org/${issue.editorial.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-start gap-1.5 text-sm font-semibold text-brand-dark border-b-2 border-brand-yellow hover:border-brand-yellow-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            <span>{issue.editorial.title}</span>
            <span className="mt-0.5 flex-shrink-0"><IconExternal /></span>
          </a>
          <p className="mt-1 font-mono text-[11px] text-zinc-400">DOI {issue.editorial.doi}</p>
        </div>
      )}
    </article>
  );
};

export const EditorshipsPage: React.FC = () => {
  const { t, lang } = useI18n();

  return (
    <PageWrapper noPadding>
      <div className="pt-16">
        <div className="sticky top-16 bg-zinc-50/95 backdrop-blur-sm z-20 py-6 border-b border-zinc-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark text-left">{t('editorships.title')}</h1>
            <p className="mt-4 text-lg text-left text-brand-gray">{t('editorships.sub')}</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Edited books */}
          <section>
            <h2 className="text-3xl font-bold tracking-tight text-brand-dark">{t('editorships.books.title')}</h2>
            <p className="mt-3 text-brand-gray leading-relaxed max-w-3xl">{t('editorships.books.lead')}</p>
            <motion.div
              className="mt-8 space-y-8"
              {...{ variants: listVariants, initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.05 } }}
            >
              {editedBooksData.map((book) => (
                <motion.div key={book.title} {...{ variants: itemVariants }}>
                  <BookCard book={book} />
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Guest editorships */}
          <section className="mt-20">
            <h2 className="text-3xl font-bold tracking-tight text-brand-dark">{t('editorships.issues.title')}</h2>
            <p className="mt-3 text-brand-gray leading-relaxed max-w-3xl">
              {fill(t('editorships.issues.lead'), { count: capitalize(cardinal(guestEditorshipsData.length, lang)) })}
            </p>
            <motion.div
              className="mt-8 grid gap-6 md:grid-cols-2"
              {...{ variants: listVariants, initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.05 } }}
            >
              {guestEditorshipsData.map((issue) => (
                <motion.div key={issue.issueTitle} className="h-full" {...{ variants: itemVariants }}>
                  <GuestEditorshipCard issue={issue} />
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Back to the standing board seats */}
          <Link
            to="/service/editorial"
            className="group mt-16 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50 px-6 py-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            <p className="text-sm text-brand-gray leading-relaxed max-w-2xl">
              {fill(t('editorships.boardsText'), { count: cardinal(editorialData.length, lang) })}
            </p>
            <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-brand-dark border-b-2 border-brand-yellow group-hover:border-brand-yellow-dark transition-colors">
              {t('editorships.boardsLink')}
              <IconArrow />
            </span>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};
