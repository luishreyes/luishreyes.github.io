import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/PageWrapper';
import { EncabezadoPagina } from '../components/Apertura';
import { Sube } from '../components/Sube';
import { useI18n, localize, fill, cardinal } from '../context/i18n';
import { studentsData, graduatedStudentsData } from '../components/data/students';
import { fotos, type Foto } from '../components/data/fotos';
import type { CurrentStudent, GraduatedStudent } from '../types';

type Filtro = 'all' | 'current' | 'alumni';

// Las fotos de grado que existen, por el nombre tal como está en la ficha del egresado.
const FOTO_DE_GRADO: Record<string, Foto> = {
  'Brayan Rodríguez': fotos.gradoBrayan,
  'Julián Fernando Becerra-Encinales': fotos.gradoJulian,
  'Olga Lucía Acuña': fotos.gradoOlga,
  'Carlos Manuel Ramírez Acosta': fotos.gradoCarlos,
};

/** La tesis entre comillas del idioma: «…» en español, “…” en inglés. */
const comillas = (texto: string, lang: 'en' | 'es') => (lang === 'es' ? `«${texto}»` : `“${texto}”`);

/** Iniciales para quien no tiene foto: la del nombre y la del primer apellido. */
const iniciales = (nombre: string) => {
  const p = nombre.split(/\s+/).filter(Boolean);
  const apellido = p.length >= 4 ? p[p.length - 2] : p[p.length - 1];
  return `${p[0][0]}${p.length > 1 ? apellido[0] : ''}`;
};

/** El retrato del egresado o, si no hay foto, un bloque con sus iniciales del mismo tamaño. */
const Retrato: React.FC<{ alumno: GraduatedStudent; className: string; alt?: string; lazy?: boolean }> = ({ alumno, className, alt = '', lazy }) =>
  alumno.imageUrl ? (
    <img src={alumno.imageUrl} alt={alt} loading={lazy ? 'lazy' : undefined} className={`a-bn object-cover object-top ${className}`} />
  ) : (
    <span aria-hidden="true" className={`flex items-end bg-papel-300 p-3 ${className}`}>
      <span className="text-[length:var(--t-l)] font-semibold leading-none text-tinta-700">{iniciales(alumno.name)}</span>
    </span>
  );

const porAno = (a: GraduatedStudent, b: GraduatedStudent) =>
  b.graduationYear - a.graduationYear ||
  localize(a.program, 'en').localeCompare(localize(b.program, 'en')) ||
  a.name.localeCompare(b.name);

/** Programa y año de grado: lo que va bajo el nombre. */
const useMetaGrado = () => {
  const { t, lang } = useI18n();
  return (s: GraduatedStudent) => {
    const grado = s.degree === 'M.S.' ? t('students.row.ms') : t('students.row.phd');
    return `${s.program ? localize(s.program, lang) : grado} · ${s.graduationYear}`;
  };
};

/** El resumen de la tesis, en un diálogo nativo: foco atrapado y Escape sin código extra. */
const DialogoTesis: React.FC<{ alumno: GraduatedStudent | null; onClose: () => void }> = ({ alumno, onClose }) => {
  const { t, lang } = useI18n();
  const meta = useMetaGrado();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (alumno && !d.open) d.showModal();
    if (!alumno && d.open) d.close();
  }, [alumno]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      aria-labelledby="tesis-titulo"
      className="w-[min(100vw-2rem,56rem)] max-h-[88svh] p-0 bg-papel-0 text-tinta-800 backdrop:bg-tinta-900/70"
    >
      {alumno && (
        <div className="p-6 sm:p-10">
          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="flex items-center gap-5">
              <Retrato alumno={alumno} alt={alumno.name} className="w-20 h-24 sm:w-24 sm:h-28 flex-none" />
              <div>
                <h2 id="tesis-titulo" className="a-h3">{alumno.name}</h2>
                <p className="a-meta mt-2">{meta(alumno)}</p>
                {alumno.currentPosition && <p className="a-s mt-1 text-tinta-800">{localize(alumno.currentPosition, lang)}</p>}
              </div>
            </div>
            <button type="button" onClick={onClose} className="a-boton flex-none self-end sm:self-auto !min-h-[44px] !px-5">
              {t('students.thesis.close')}
            </button>
          </div>
          {FOTO_DE_GRADO[alumno.name] && (
            <figure className="mt-8">
              <img src={FOTO_DE_GRADO[alumno.name].src} alt={localize(FOTO_DE_GRADO[alumno.name].alt, lang)} className="a-bn w-full max-h-[50svh] object-cover" />
              <figcaption className="a-pie">{localize(FOTO_DE_GRADO[alumno.name].alt, lang)}.</figcaption>
            </figure>
          )}
          <p className="a-s text-tinta-600 mt-8">{t('students.thesis')}</p>
          <p className="mt-1 font-semibold leading-snug text-tinta-900 max-w-[60ch]">{comillas(alumno.thesisTitle, lang)}</p>
          <div className="mt-8 space-y-6 border-t-2 border-tinta-900 pt-6">
            {alumno.laymanSummary.map((item, i) => (
              <div key={i}>
                <p className="font-semibold text-tinta-900">{localize(item.question, lang)}</p>
                <p className="mt-1 a-texto">{localize(item.answer, lang)}</p>
              </div>
            ))}
          </div>
          {alumno.linkedinUrl && (
            <a href={alumno.linkedinUrl} target="_blank" rel="noopener noreferrer" className="a-enlace inline-block mt-8">
              {t('students.linkedin')} <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      )}
    </dialog>
  );
};

export const StudentsPage = () => {
  const { t, lang } = useI18n();
  const meta = useMetaGrado();
  const [filtro, setFiltro] = useState<Filtro>('all');
  const [abierto, setAbierto] = useState<GraduatedStudent | null>(null);

  const doctores = useMemo(() => [...graduatedStudentsData.phd].sort(porAno), []);
  const magisteres = useMemo(() => [...graduatedStudentsData.ms].sort(porAno), []);
  const actuales: CurrentStudent[] = [...studentsData.phd, ...studentsData.ms];
  const egresados = doctores.length + magisteres.length;

  const filtros: { id: Filtro; label: string; n: number }[] = [
    { id: 'all', label: t('students.filter.all'), n: actuales.length + egresados },
    { id: 'current', label: t('students.filter.current'), n: actuales.length },
    { id: 'alumni', label: t('students.filter.alumni'), n: egresados },
  ];

  const verActuales = filtro !== 'alumni';
  const verEgresados = filtro !== 'current';

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('students.title')}
        foto={{ src: fotos.boom.src, alt: localize(fotos.boom.alt, lang), posicion: fotos.boom.foco }}
        entrada={
          <p className="[text-wrap:pretty]">
            {fill(t('students.intro'), {
              phd: cardinal(doctores.length, lang),
              ms: magisteres.length,
              cur: cardinal(actuales.length, lang),
            })}
          </p>
        }
      >
        <div className="mt-10">
          <span className="a-s text-tinta-600">{t('students.filter.label')}</span>
          <div className="a-filtros mt-2">
            {filtros.map((f) => (
              <button key={f.id} type="button" aria-pressed={filtro === f.id} onClick={() => setFiltro(f.id)} className="whitespace-nowrap">
                {f.label} {f.n}
              </button>
            ))}
          </div>
        </div>
        <Link to="/school" className="a-enlace mt-8 inline-block">
          {t('school.toSchool')} <span aria-hidden="true">→</span>
        </Link>
      </EncabezadoPagina>

      {/* ── Quienes trabajan hoy con el grupo: una lista limpia, el programa en su columna ── */}
      {verActuales && (
        <section className="a-hundido a-campo">
          <div className="a-c">
            <Sube><h2 className="a-h3 mb-8">{t('students.current')}.</h2></Sube>
            <div className="grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <ul className="a-registro">
              {actuales.map((s, i) => (
                <Sube as="li" key={s.name} delay={0.04 * Math.min(i, 4)}>
                  <span className="cuando">{s.degree === 'M.S.' ? t('students.row.ms') : t('students.row.phd')}</span>
                  <div>
                    <p className="que">{s.name}</p>
                    <p className="detalle text-tinta-800">{localize(s.info, lang)}</p>
                  </div>
                </Sube>
              ))}
            </ul>
            <Sube delay={0.1}>
              <figure className="lg:sticky lg:top-24">
                <div className="overflow-hidden aspect-[4/3] lg:aspect-[4/5]">
                  <img src={fotos.marthaAiche.src} alt={localize(fotos.marthaAiche.alt, lang)} loading="lazy" className="a-foto a-bn" style={{ objectPosition: 'center 30%' }} />
                </div>
                <figcaption className="a-pie">{localize(fotos.marthaAiche.alt, lang)}.</figcaption>
              </figure>
            </Sube>
            </div>
          </div>
        </section>
      )}

      {verEgresados && (
        <>
          {/* ── Los doctores: retrato grande, el cargo de hoy y la tesis ── */}
          <section className="a-papel a-campo">
            <div className="a-c">
              <Sube><h2 className="a-h3 mb-8">{t('students.phd.graduates')}.</h2></Sube>
              <ul className="border-t-2 border-tinta-900">
                {doctores.map((s, i) => (
                  <Sube
                    as="li"
                    key={s.name}
                    delay={0.05 * Math.min(i, 3)}
                    className="grid grid-cols-[7rem_minmax(0,1fr)] gap-x-5 gap-y-6 py-8 border-b-2 border-papel-300 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-x-8 lg:grid-cols-[17rem_minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-12 lg:py-10"
                  >
                    <button type="button" onClick={() => setAbierto(s)} className="block group" aria-label={`${t('students.thesis.show')}: ${s.name}`}>
                      <Retrato
                        alumno={s}
                        alt={s.name}
                        lazy
                        className="w-full aspect-[4/5] transition-transform duration-300 [@media(hover:hover)]:group-hover:-translate-y-1"
                      />
                    </button>
                    <div>
                      <h3 className="a-h3">{s.name}</h3>
                      <p className="a-meta mt-3">{meta(s)}</p>
                      {s.currentPosition && <p className="mt-3 text-tinta-800 max-w-[40ch]">{localize(s.currentPosition, lang)}</p>}
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                      <p className="a-s text-tinta-600">{t('students.thesis')}</p>
                      <p className="mt-1 font-semibold leading-snug text-tinta-900 max-w-[52ch]">{comillas(s.thesisTitle, lang)}</p>
                      <button type="button" onClick={() => setAbierto(s)} className="a-enlace a-s mt-4">
                        {t('students.thesis.show')} <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  </Sube>
                ))}
              </ul>
            </div>
          </section>

          {/* ── La vida del grupo: tres fotos de su día a día, cada una con su pie ── */}
          <section className="a-portada a-campo">
            <div className="a-c">
              <Sube><h2 className="a-h3 mb-10">{t('students.life.title')}.</h2></Sube>
              <ul className="grid gap-x-6 gap-y-10 md:grid-cols-[minmax(0,5fr)_minmax(0,2.8fr)_minmax(0,5fr)]">
                {[
                  { f: fotos.recienLlegado, aspecto: 'aspect-[4/3]', pos: 'center' },
                  { f: fotos.camilaJenga, aspecto: 'aspect-[3/4]', pos: 'center' },
                  { f: fotos.acs2026, aspecto: 'aspect-[4/3]', pos: '70% center' },
                ].map(({ f, aspecto, pos }, i) => (
                  <Sube as="li" key={f.src} delay={0.08 * i}>
                    <figure>
                      <div className={`overflow-hidden ${aspecto}`}>
                        <img src={f.src} alt={localize(f.alt, lang)} loading="lazy" className="a-foto a-bn" style={{ objectPosition: pos }} />
                      </div>
                      <figcaption className="a-pie">{localize(f.alt, lang)}.</figcaption>
                    </figure>
                  </Sube>
                ))}
              </ul>
            </div>
          </section>

          {/* ── Los magísteres: una cuadrícula de retratos, la tesis a un toque ── */}
          <section className="a-hundido a-campo">
            <div className="a-c">
              <Sube><h2 className="a-h3 mb-10">{t('students.ms.graduates')}.</h2></Sube>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:grid-cols-5 xl:gap-y-14">
                {magisteres.map((s, i) => (
                  <Sube as="li" key={s.name} delay={0.04 * (i % 5)}>
                    <button
                      type="button"
                      onClick={() => setAbierto(s)}
                      className="block w-full text-left group"
                      aria-label={`${t('students.thesis.show')}: ${s.name}`}
                    >
                      <Retrato
                        alumno={s}
                        lazy
                        className="w-full aspect-[4/5] transition-transform duration-300 [@media(hover:hover)]:group-hover:-translate-y-1"
                      />
                      <span className="block mt-4 font-semibold leading-tight text-tinta-900 [@media(hover:hover)]:group-hover:underline underline-offset-4 decoration-1">
                        {s.name}
                      </span>
                    </button>
                    <p className="a-meta mt-1 !text-tinta-700">{meta(s)}</p>
                    {s.currentPosition && <p className="mt-2 leading-snug text-tinta-800">{localize(s.currentPosition, lang)}</p>}
                  </Sube>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}

      <DialogoTesis alumno={abierto} onClose={() => setAbierto(null)} />
    </PageWrapper>
  );
};
