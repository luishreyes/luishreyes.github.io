import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';
import { retos202620 } from '../../components/data/classroom/spdp-retos-2026-20';
import { retosSeleccionados, otrosCasos, fechaSeleccion, plazoContacto } from '../../components/data/classroom/spdp-retos-seleccionados-2026-20';
import { estudiantes202620 } from '../../components/data/classroom/spdp-estudiantes-2026-20';
import { armarResultados, nombres, personas, type RetoResultado } from '../../components/data/classroom/spdp-resultados-2026-20';
import '@fontsource/anton/400.css';
import '@fontsource/barlow/400.css';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow/700.css';
import '@fontsource/playfair-display/400.css';
import '../../components/classroom/spdp-theme.css';
import '../../components/classroom/spdp-resultados.css';

/* ============================================================
   SpdpResultadosPage — resultados de la selección de retos del
   SPDP 2026-20 (sesión del 14 de octubre). Quién quedó en cada
   reto, por asesor y por estudiante, y lo que sigue: pedir una
   reunión de 15 minutos con el asesor antes del 21 de octubre.
   La versión para los profesores es el PDF que arma
   scripts/build-spdp-seleccion-pdf.mjs con los mismos datos.
   ============================================================ */

export const PDF_SELECCION = '/classroom/iqya-3050-2026-20/documentos/IQYA-3050-Seleccion-de-Retos-2026-20-8B.pdf';

const sinTildes = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const Reto: React.FC<{ r: RetoResultado; slug: string }> = ({ r, slug }) => (
  <article className={`rs-reto${r.estudiantes.length ? '' : ' rs-reto--vacio'}`}>
    <div className="rs-reto-cabeza">
      <span className="rs-reto-id">{r.reto.id}</span>
      <div>
        <Link to={`/classroom/${slug}/retos?reto=${r.reto.id}`} className="rs-reto-titulo">
          {r.reto.titulo}
        </Link>
        <span className="rs-meta">
          {r.reto.area} · {r.reto.tipo} · para {personas(r.reto.integrantes)}
          {r.reto.coasesor ? ` · con ${r.reto.coasesor}` : ''}
        </span>
      </div>
    </div>
    {r.estudiantes.length ? (
      <ul className="rs-estudiantes">
        {r.estudiantes.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
    ) : (
      <p className="rs-sin">Sin estudiantes en esta convocatoria.</p>
    )}
    {r.libres > 0 && r.estudiantes.length > 0 && <span className="rs-marca rs-marca--cupo">Queda un cupo</span>}
    {r.pendiente && (
      <p className="rs-pendiente">
        <b>Pendiente.</b> {r.pendiente}
      </p>
    )}
    {r.nota && <p className="rs-nota">{r.nota}</p>}
  </article>
);

export const SpdpResultadosPage: React.FC<{ course: Course }> = ({ course }) => {
  const res = useMemo(() => armarResultados(retos202620, retosSeleccionados, estudiantes202620, otrosCasos), []);
  const [q, setQ] = useState('');
  const [vista, setVista] = useState<'asesor' | 'estudiante'>('estudiante');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Resultados de la selección · SPDP 2026-20';
  }, []);

  const estudiantes = res.estudiantes.filter((e) => !q || sinTildes(e.nombre).includes(sinTildes(q)));
  const asesores = res.asesores.filter(
    (a) => !q || sinTildes(a.nombre).includes(sinTildes(q)) || [...a.principal, ...a.coasesor].some((r) => r.estudiantes.some((e) => sinTildes(e).includes(sinTildes(q)))),
  );
  const t = res.totales;
  const maxArea = Math.max(...res.areas.map((a) => a.propuestos));

  return (
    <CourseAccessGate course={course}>
      <div className="spdp-ds rs">
        <header className="sp-hero">
          <div className="sp-wrap">
            <Link to={`/classroom/${course.slug}`} className="sp-volver">
              ← Volver al curso
            </Link>
            <span className="sp-kicker">IQYA 3050 · Retos 2026-20 · Selección del {fechaSeleccion}</span>
            <div className="sp-marca" />
            <h1 className="sp-display">Resultados</h1>
            <p className="sp-hero-lead">
              {t.estudiantesConReto} de los {t.estudiantesCurso} estudiantes ya tienen reto para el Proyecto de Desarrollo Profesional de 2027-10. Busque su nombre, mire
              quién es su asesor y escríbale antes del {plazoContacto}.
            </p>
            <div className="sp-cifras">
              <div>
                <span className="sp-cifra-valor sp-cifra-valor--naranja">{t.estudiantesConReto}</span>
                <span className="sp-cifra-pie">Estudiantes con reto</span>
              </div>
              <div>
                <span className="sp-cifra-valor">{t.conEstudiantes}</span>
                <span className="sp-cifra-pie">Retos con estudiantes</span>
              </div>
              <div>
                <span className="sp-cifra-valor">{t.retos}</span>
                <span className="sp-cifra-pie">Retos propuestos</span>
              </div>
              <div>
                <span className="sp-cifra-valor">{t.asesores}</span>
                <span className="sp-cifra-pie">Asesores</span>
              </div>
            </div>
          </div>
        </header>

        <main className="sp-wrap sp-seccion">
          {/* ---------------- lo que sigue ---------------- */}
          <section className="rs-sigue" aria-labelledby="rs-sigue">
            <h2 id="rs-sigue" className="rs-h2">
              Lo que sigue
            </h2>
            <ol className="rs-pasos">
              <li>
                <b>Escríbale a su asesor antes del {plazoContacto}</b> para pedir una reunión de 15 minutos. Si el reto tiene coasesor, póngalo en copia.
              </li>
              <li>
                <b>Diga en el correo, con claridad, de qué se va a tratar la reunión.</b> Usted decide el tema: la documentación que necesita, la información del reto que
                quiere aclarar, las condiciones de laboratorio o de la empresa. El asesor debe saberlo antes de reunirse.
              </li>
              <li>
                <b>Si su reto tiene un pendiente,</b> resuélvalo en esa misma reunión y avísele al profesor del curso.
              </li>
            </ol>
            <a className="sp-boton sp-boton--claro" href={PDF_SELECCION} target="_blank" rel="noopener">
              Versión para los profesores (PDF)
            </a>
          </section>

          {/* ---------------- quién está dónde ---------------- */}
          <section aria-labelledby="rs-quien" className="rs-bloque">
            <div className="rs-bloque-cabeza">
              <h2 id="rs-quien" className="rs-h2">
                Quién trabaja en qué
              </h2>
              <div className="rs-controles">
                <div className="rs-alternar" role="tablist" aria-label="Ver por">
                  <button type="button" role="tab" aria-selected={vista === 'estudiante'} onClick={() => setVista('estudiante')}>
                    Por estudiante
                  </button>
                  <button type="button" role="tab" aria-selected={vista === 'asesor'} onClick={() => setVista('asesor')}>
                    Por asesor
                  </button>
                </div>
                <input className="rs-buscar" type="search" placeholder="Buscar un nombre…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar un nombre" />
              </div>
            </div>

            {vista === 'estudiante' ? (
              <div className="rs-tabla-envoltura">
                <table className="rs-tabla">
                  <thead>
                    <tr>
                      <th>Estudiante</th>
                      <th>Reto</th>
                      <th>Asesor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estudiantes.map((e) =>
                      e.retos.length ? (
                        e.retos.map((r, i) => (
                          <tr key={e.nombre + r.reto.id}>
                            {i === 0 && (
                              <td rowSpan={e.retos.length} className="rs-td-nombre">
                                {e.nombre}
                                {e.retos.length > 1 && <span className="rs-meta">Dos retos: uno de Ingeniería Química y uno de Ingeniería de Alimentos</span>}
                              </td>
                            )}
                            <td>
                              <Link to={`/classroom/${course.slug}/retos?reto=${r.reto.id}`}>
                                {r.reto.id} · {r.reto.titulo}
                              </Link>
                              {r.pendiente && <span className="rs-marca rs-marca--pendiente">Pendiente</span>}
                            </td>
                            <td>
                              {r.reto.asesor}
                              {r.reto.coasesor && <span className="rs-meta">con {r.reto.coasesor}</span>}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr key={e.nombre} className="rs-fila-otro">
                          <td className="rs-td-nombre">{e.nombre}</td>
                          <td>{e.otro?.situacion ?? 'Sin reto registrado.'}</td>
                          <td>{e.otro?.contacto ?? 'Luis H. Reyes'}</td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
                {estudiantes.length === 0 && <p className="sp-vacio">Nadie con ese nombre.</p>}
              </div>
            ) : (
              <div className="rs-asesores">
                {asesores.map((a) => (
                  <section key={a.nombre} className="rs-asesor">
                    <h3 className="rs-asesor-nombre">{a.nombre}</h3>
                    <span className="rs-meta">
                      {a.contactos} {a.contactos === 1 ? 'estudiante lo contactará' : 'estudiantes lo contactarán'}
                    </span>
                    <div className="rs-retos">
                      {a.principal.map((r) => (
                        <Reto key={r.reto.id} r={r} slug={course.slug} />
                      ))}
                    </div>
                    {a.coasesor.length > 0 && (
                      <p className="rs-co">
                        <b>Como coasesor:</b>{' '}
                        {a.coasesor.map((r, i) => (
                          <span key={r.reto.id}>
                            {i > 0 && ' · '}
                            {r.reto.id} {r.reto.titulo} ({r.reto.asesor}; {nombres(r.estudiantes)})
                          </span>
                        ))}
                      </p>
                    )}
                  </section>
                ))}
              </div>
            )}
          </section>

          {/* ---------------- pendientes ---------------- */}
          <section aria-labelledby="rs-pend" className="rs-bloque">
            <h2 id="rs-pend" className="rs-h2">
              Lo que queda abierto
            </h2>
            <div className="rs-abiertos">
              {res.pendientes.map((r) => (
                <div key={r.reto.id} className="rs-abierto rs-abierto--pendiente">
                  <span className="rs-abierto-etiqueta">Por confirmar</span>
                  <b>
                    {r.reto.id} · {r.reto.titulo}
                  </b>
                  <p>
                    {r.pendiente} Estudiantes: {nombres(r.estudiantes)}.
                  </p>
                </div>
              ))}
              {otrosCasos.map((o) => (
                <div key={o.nombre} className="rs-abierto">
                  <span className="rs-abierto-etiqueta">Caso aparte</span>
                  <b>{o.nombre}</b>
                  <p>
                    {o.situacion} Contacto: {o.contacto}.
                  </p>
                </div>
              ))}
              {res.conCupo.length > 0 && (
                <div className="rs-abierto">
                  <span className="rs-abierto-etiqueta">Con un cupo libre</span>
                  <p>{res.conCupo.map((r) => `${r.reto.id} · ${r.reto.titulo} (${nombres(r.estudiantes)})`).join('; ')}.</p>
                </div>
              )}
              {res.sinEstudiantes.length > 0 && (
                <div className="rs-abierto">
                  <span className="rs-abierto-etiqueta">Sin estudiantes</span>
                  <p>{res.sinEstudiantes.map((r) => `${r.reto.id} · ${r.reto.titulo} (${r.reto.asesor})`).join('; ')}.</p>
                </div>
              )}
            </div>
          </section>

          {/* ---------------- resumen ---------------- */}
          <section aria-labelledby="rs-resumen" className="rs-bloque">
            <h2 id="rs-resumen" className="rs-h2">
              Los retos que se propusieron
            </h2>
            <p className="rs-texto">
              Se propusieron {t.retos} retos de {t.asesores} asesores; {t.conEstudiantes} quedaron con estudiantes. {t.dosRetos} estudiantes tienen dos retos, uno por cada
              programa (Ingeniería Química e Ingeniería de Alimentos).
            </p>
            <div className="sp-leyenda">
              <span>Con estudiantes</span>
              <span className="b">Sin estudiantes</span>
            </div>
            <div className="sp-barras" style={{ maxWidth: 820 }}>
              {res.areas.map((a) => (
                <div key={a.area} className="sp-barra" style={{ cursor: 'default' }}>
                  <span className="sp-barra-rotulo">{a.area}</span>
                  <span className="sp-barra-pista">
                    <span className="sp-barra-pila" style={{ ['--v' as string]: a.propuestos, ['--max' as string]: maxArea }}>
                      <span className="sp-barra-seg" style={{ flex: a.conEstudiantes }} />
                      {a.propuestos > a.conEstudiantes && <span className="sp-barra-seg sp-barra-seg--b" style={{ flex: a.propuestos - a.conEstudiantes }} />}
                    </span>
                    <span className="sp-barra-valor">
                      {a.conEstudiantes} de {a.propuestos} · {a.estudiantes} {a.estudiantes === 1 ? 'estudiante' : 'estudiantes'}
                    </span>
                  </span>
                </div>
              ))}
            </div>
            <p className="rs-texto" style={{ marginTop: 18 }}>
              <Link to={`/classroom/${course.slug}/retos`} className="sp-link">
                Ver todos los retos en el explorador
              </Link>
            </p>
          </section>
        </main>

        <footer className="sp-wrap">
          <div className="sp-pie-pagina">Selección de retos · semestre 2026-20 · sesión del {fechaSeleccion}</div>
        </footer>
      </div>
    </CourseAccessGate>
  );
};
