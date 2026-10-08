import React, { useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { Course, CronogramaEntry } from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';
import { retos202620 } from '../../components/data/classroom/spdp-retos-2026-20';
import {
  spdpDocumentos,
  spdpPresentaciones,
  spdpArchivosSesion,
  type SpdpDocumento,
  type SpdpPresentacion,
} from '../../components/data/classroom/spdp-material-2026-20';
import '@fontsource/anton/400.css';
import '@fontsource/barlow/400.css';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow/700.css';
import '@fontsource/playfair-display/400.css';
import '../../components/classroom/spdp-theme.css';

/* ============================================================
   SpdpMaterialPage — «Material del curso» del SPDP 2026-20, en la
   identidad del curso. Dos bloques: los documentos transversales
   (programa, guías, formato) y las ocho sesiones del cronograma,
   cada una con su presentación en PDF si ya existe.

   Los PDF se ven aquí mismo, en un visor a pantalla completa
   (?ver=programa, ?ver=sesion-3), y siempre se pueden descargar.
   En celular el visor no embebe (los navegadores móviles muestran
   mal un PDF dentro de un iframe): ofrece abrirlo directamente.

   Los archivos y la lista salen de spdp-material-2026-20.ts, que
   genera sPDP/202620/presentaciones/datos/exportar-portafolio.py.
   ============================================================ */

type Visible = { tipo: 'doc'; doc: SpdpDocumento } | { tipo: 'pres'; pres: SpdpPresentacion; sesion?: CronogramaEntry };

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const fechaLarga = (iso: string) => {
  const [, m, d] = iso.split('-').map(Number);
  return `${d} de ${MESES[m - 1]}`;
};
const hoyIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const dosDigitos = (n: number) => String(n).padStart(2, '0');

const metaDoc = (d: SpdpDocumento) =>
  [d.tipo === 'pdf' ? 'PDF' : 'Word', d.paginas ? `${d.paginas} ${d.paginas === 1 ? 'página' : 'páginas'}` : null, d.peso]
    .filter(Boolean)
    .join(' · ');

const IconoDescargar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
  </svg>
);
const IconoVer = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconoAfuera = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" />
  </svg>
);
const IconoFlecha = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

interface Props {
  course: Course;
}

export const SpdpMaterialPage: React.FC<Props> = ({ course }) => {
  const [params, setParams] = useSearchParams();
  const cronograma = course.cronograma ?? [];
  const hoy = hoyIso();
  // La sesión de hoy o, si hoy no hay, la siguiente.
  const proxima = cronograma.find((s) => s.date >= hoy)?.week ?? null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const verId = params.get('ver');
  const visible: Visible | null = useMemo(() => {
    if (!verId) return null;
    const doc = spdpDocumentos.find((d) => d.id === verId && d.tipo === 'pdf');
    if (doc) return { tipo: 'doc', doc };
    const m = /^sesion-(\d+)$/.exec(verId);
    const pres = m ? spdpPresentaciones.find((p) => p.sesion === Number(m[1])) : undefined;
    if (pres) return { tipo: 'pres', pres, sesion: cronograma.find((s) => s.week === pres.sesion) };
    return null;
  }, [verId, cronograma]);

  const ver = (id: string | null) => {
    const p = new URLSearchParams(params);
    if (id) p.set('ver', id);
    else p.delete('ver');
    setParams(p, { replace: !id });
  };

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') ver(null);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const transversales = spdpDocumentos;
  const archivoVisible = visible ? (visible.tipo === 'doc' ? visible.doc.archivo : visible.pres.archivo) : '';

  return (
    <CourseAccessGate course={course}>
      <div className="spdp-ds">
        <header className="sp-hero sp-hero--corta">
          <div className="sp-wrap">
            <Link to={`/classroom/${course.slug}`} className="sp-volver">
              <IconoFlecha /> Volver al curso
            </Link>
            <span className="sp-kicker">IQYA 3050 · 2026-20 · Periodo 8B</span>
            <div className="sp-marca" />
            <h1 className="sp-display">Material del curso</h1>
            <p className="sp-hero-lead">
              La presentación de cada sesión, las guías de las entregas y el formato de la entrega final. Todo se ve aquí
              mismo y todo se descarga.
            </p>
          </div>
        </header>

        <main className="sp-wrap" style={{ paddingTop: 40, paddingBottom: 72 }}>
          {/* ---------------- documentos ---------------- */}
          <div className="sp-encabezado">
            <span className="sp-kicker">Para todo el semestre</span>
            <div className="sp-marca" />
            <h2 className="sp-h2">Documentos del curso</h2>
          </div>
          <div className="sp-docs">
            {transversales.map((d) => (
              <article key={d.id} className="sp-doc">
                <span className="sp-doc-meta">{metaDoc(d)}</span>
                <h3>{d.titulo}</h3>
                <p>{d.descripcion}</p>
                {d.sesion ? (
                  <span className="sp-doc-meta" style={{ color: 'var(--sp-accent-text)' }}>
                    Se entrega en la sesión {dosDigitos(d.sesion)}
                  </span>
                ) : null}
                <div className="sp-acciones">
                  {d.tipo === 'pdf' && (
                    <button type="button" className="sp-boton sp-boton--acento" onClick={() => ver(d.id)}>
                      <IconoVer /> Ver
                    </button>
                  )}
                  <a className="sp-boton sp-boton--claro" href={d.archivo} download>
                    <IconoDescargar /> Descargar
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* ---------------- sesiones ---------------- */}
          <div className="sp-encabezado">
            <span className="sp-kicker">Ocho miércoles, 12:30 a 1:50 pm</span>
            <div className="sp-marca" />
            <h2 className="sp-h2">Sesión por sesión</h2>
          </div>
          <div className="sp-sesiones">
            {cronograma.map((s) => {
              const pres = spdpPresentaciones.find((p) => p.sesion === s.week);
              const guias = spdpDocumentos.filter((d) => d.sesion === s.week);
              const archivos = spdpArchivosSesion.filter((a) => a.sesion === s.week);
              const esProxima = s.week === proxima;
              return (
                <section key={s.week} className={`sp-sesion${esProxima ? ' sp-sesion--hoy' : ''}`} aria-label={`Sesión ${s.week}`}>
                  <div>
                    <span className="sp-sesion-num">{dosDigitos(s.week)}</span>
                    <span className="sp-sesion-fecha">{fechaLarga(s.date)}</span>
                    {esProxima && <span className="sp-hoy-marca">{s.date === hoy ? 'Hoy' : 'Próxima'}</span>}
                  </div>
                  <div>
                    <h3 className="sp-sesion-tema">{s.topic}</h3>
                    {s.details && s.details.length > 0 && (
                      <ul>
                        {s.details.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                    )}
                    {s.proyecto && <span className="sp-sesion-entrega">{s.proyecto}</span>}
                  </div>
                  <div className="sp-sesion-material">
                    {pres ? (
                      <div className="sp-mat">
                        <span className="sp-mat-titulo">Presentación · {pres.titulo}</span>
                        <span className="sp-doc-meta">
                          PDF · {pres.laminas} láminas · {pres.peso}
                        </span>
                        <div className="sp-acciones">
                          <button type="button" className="sp-boton sp-boton--acento" onClick={() => ver(`sesion-${s.week}`)}>
                            <IconoVer /> Ver
                          </button>
                          <a className="sp-boton sp-boton--claro" href={pres.archivo} download>
                            <IconoDescargar /> Descargar
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="sp-mat sp-mat--pendiente">
                        {s.date < hoy ? 'Esta sesión no tuvo presentación.' : 'Todavía no hay presentación publicada.'}
                      </div>
                    )}
                    {guias.map((d) => (
                      <div key={d.id} className="sp-mat" style={{ borderLeftColor: 'var(--sp-ink-900)' }}>
                        <span className="sp-mat-titulo">{d.titulo}</span>
                        <span className="sp-doc-meta">{metaDoc(d)}</span>
                        <div className="sp-acciones">
                          {d.tipo === 'pdf' && (
                            <button type="button" className="sp-boton sp-boton--claro" onClick={() => ver(d.id)}>
                              <IconoVer /> Ver
                            </button>
                          )}
                          <a className="sp-boton sp-boton--claro" href={d.archivo} download>
                            <IconoDescargar /> Descargar
                          </a>
                        </div>
                      </div>
                    ))}
                    {archivos.map((a) => (
                      <div key={a.archivo} className="sp-mat" style={{ borderLeftColor: 'var(--sp-ink-900)' }}>
                        <span className="sp-mat-titulo">{a.titulo}</span>
                        <span className="sp-doc-meta">{a.descripcion} · {a.tipo.toUpperCase()} · {a.peso}</span>
                        <div className="sp-acciones">
                          {a.tipo === 'txt' && (
                            <a className="sp-boton sp-boton--claro" href={a.archivo} target="_blank" rel="noreferrer">
                              <IconoVer /> Abrir
                            </a>
                          )}
                          <a className="sp-boton sp-boton--claro" href={a.archivo} download>
                            <IconoDescargar /> Descargar
                          </a>
                        </div>
                      </div>
                    ))}
                    {s.week === 6 && (
                      <Link to={`/classroom/${course.slug}/etica`} className="sp-mat" style={{ textDecoration: 'none', borderLeftColor: 'var(--sp-ink-900)' }}>
                        <span className="sp-mat-titulo">Clasifique su reto</span>
                        <span className="sp-doc-meta">Nivel de riesgo, documentos y texto para la sección 06</span>
                      </Link>
                    )}
                    {s.week === 1 && (
                      <Link to={`/classroom/${course.slug}/retos`} className="sp-mat" style={{ textDecoration: 'none', borderLeftColor: 'var(--sp-ink-900)' }}>
                        <span className="sp-mat-titulo">Explorador de retos 2026-20</span>
                        <span className="sp-doc-meta">Los {retos202620.length} retos, con filtros y favoritos</span>
                      </Link>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </main>

        {/* ---------------- visor ---------------- */}
        {visible && (
          <div className="sp-visor" role="dialog" aria-modal="true" aria-label="Visor de PDF">
            <div className="sp-visor-cabeza">
              <div className="sp-visor-titulo">
                <span className="sp-kicker">
                  {visible.tipo === 'pres'
                    ? `Sesión ${dosDigitos(visible.pres.sesion)}${visible.sesion ? ` · ${fechaLarga(visible.sesion.date)}` : ''}`
                    : 'Documento del curso'}
                </span>
                {visible.tipo === 'pres' ? visible.pres.titulo : visible.doc.titulo}
              </div>
              <div className="sp-acciones" style={{ marginTop: 0 }}>
                <a className="sp-boton sp-boton--acento" href={archivoVisible} download>
                  <IconoDescargar /> Descargar
                </a>
                <a className="sp-boton" href={archivoVisible} target="_blank" rel="noopener noreferrer">
                  <IconoAfuera /> Pestaña nueva
                </a>
                <button type="button" className="sp-boton" onClick={() => ver(null)}>
                  Cerrar
                </button>
              </div>
            </div>
            <iframe src={`${archivoVisible}#view=FitH`} title={visible.tipo === 'pres' ? visible.pres.titulo : visible.doc.titulo} />
            <div className="sp-visor-movil">
              <p style={{ margin: '0 0 18px' }}>En el celular el PDF se lee mejor en su propio visor.</p>
              <a className="sp-boton sp-boton--acento" href={archivoVisible} target="_blank" rel="noopener noreferrer">
                <IconoAfuera /> Abrir el PDF
              </a>
            </div>
          </div>
        )}
      </div>
    </CourseAccessGate>
  );
};
