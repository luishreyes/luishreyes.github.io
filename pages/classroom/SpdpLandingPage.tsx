import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Course, CronogramaEntry } from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';
import { todayISO } from '../../components/classroom/today';
import { retos202620 } from '../../components/data/classroom/spdp-retos-2026-20';
import { spdpDocumentos, spdpPresentaciones, type SpdpDocumento } from '../../components/data/classroom/spdp-material-2026-20';
import '@fontsource/anton/400.css';
import '@fontsource/barlow/400.css';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow/700.css';
import '@fontsource/playfair-display/400.css';
import '../../components/classroom/spdp-theme.css';
import '../../components/classroom/spdp-landing.css';

/* ============================================================
   SpdpLandingPage — portada del SPDP 2026-20 (IQYA 3050) en la
   identidad del curso (spdp-theme.css + spdp-landing.css).
   Todo sale de los datos: el Course (seminario-2026-20.ts), los
   retos y el material generados desde la carpeta del curso.
   Contenido en papel claro; solo la cabecera va en negro.
   ============================================================ */

interface Props {
  course: Course;
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

const aFecha = (iso: string) => new Date(`${iso}T12:00:00`);
/** «miércoles 7 de octubre» */
const fechaLarga = (iso: string) => {
  const d = aFecha(iso);
  return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
};
/** «7 de octubre» */
const diaMes = (iso: string) => {
  const d = aFecha(iso);
  return `${d.getDate()} de ${MESES[d.getMonth()]}`;
};
const NUMEROS = ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];
const enLetras = (n: number) => NUMEROS[n] ?? String(n);
const mayuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
const dosCifras = (n: number) => String(n).padStart(2, '0');
const sinTildes = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const diasEntre = (desde: string, hasta: string) => Math.round((aFecha(hasta).getTime() - aFecha(desde).getTime()) / 86_400_000);

/** Convierte los correos de un texto en enlaces mailto. */
const conCorreos = (texto: string): React.ReactNode => {
  const partes = texto.split(/([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/);
  if (partes.length === 1) return texto;
  return partes.map((p, i) =>
    i % 2 === 1 ? (
      <a key={i} href={`mailto:${p}`} className="spl-enlace">
        {p}
      </a>
    ) : (
      <React.Fragment key={i}>{p}</React.Fragment>
    ),
  );
};

const metaDocumento = (d: SpdpDocumento) =>
  [d.tipo === 'pdf' ? 'PDF' : 'Word', d.paginas ? `${d.paginas} páginas` : null, d.peso].filter(Boolean).join(' · ');

/* ---------------- íconos (SVG en línea, sin CDN) ---------------- */

const IconoFlecha: React.FC<{ dir?: 'izq' | 'der' }> = ({ dir = 'der' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {dir === 'izq' ? <path d="M19 12H5M11 18l-6-6 6-6" /> : <path d="M5 12h14M13 6l6 6-6 6" />}
  </svg>
);
const IconoDocumento = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 3H6a1 1 0 00-1 1v16a1 1 0 001 1h12a1 1 0 001-1V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </svg>
);

/* ---------------- piezas ---------------- */

const Seccion: React.FC<{ id: string; kicker: string; titulo: string; ancha?: boolean; children: React.ReactNode }> = ({ id, kicker, titulo, ancha, children }) => (
  <section className="spl-seccion" aria-labelledby={`spl-${id}`}>
    <div className={`sp-wrap spl-seccion-rejilla${ancha ? ' spl-seccion-rejilla--ancha' : ''}`}>
      <header className="spl-seccion-cabeza">
        <span className="sp-kicker">{kicker}</span>
        <h2 id={`spl-${id}`} className="spl-h2">
          {titulo}
        </h2>
      </header>
      <div className="spl-seccion-cuerpo">{children}</div>
    </div>
  </section>
);

const Puerta: React.FC<{ to: string; n: string; kicker: string; titulo: string; texto: string; meta: string }> = ({ to, n, kicker, titulo, texto, meta }) => (
  <Link to={to} className="spl-puerta">
    <span className="spl-puerta-kicker">
      <span className="spl-puerta-n">{n}</span> {kicker}
    </span>
    <h2 className="spl-puerta-titulo">{titulo}</h2>
    <p className="spl-puerta-texto">{texto}</p>
    <span className="spl-puerta-pie">
      <span>{meta}</span>
      <span className="spl-puerta-flecha">
        <IconoFlecha />
      </span>
    </span>
  </Link>
);

const EnlaceDocumento: React.FC<{ d: SpdpDocumento }> = ({ d }) => (
  <a
    className="spl-doc"
    href={d.archivo}
    {...(d.tipo === 'pdf' ? { target: '_blank', rel: 'noopener noreferrer' } : { download: true })}
  >
    <IconoDocumento />
    <span>
      <span className="spl-doc-titulo">{d.titulo}</span>
      <span className="spl-doc-meta">{metaDocumento(d)}</span>
    </span>
  </a>
);

/* ---------------- página ---------------- */

export const SpdpLandingPage: React.FC<Props> = ({ course }) => {
  const base = `/classroom/${course.slug}`;
  const hoy = todayISO();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sesiones = useMemo(
    () => [...(course.cronograma ?? [])].sort((a, b) => a.date.localeCompare(b.date)).map((e, i) => ({ ...e, n: i + 1 })),
    [course.cronograma],
  );
  const proxima = sesiones.find((s) => s.date >= hoy) ?? null;

  const cupos = retos202620.reduce((s, r) => s + r.integrantes, 0);
  const programa = spdpDocumentos.find((d) => d.id === 'programa');

  const franja = course.schedule.filter((s) => !/atenci/i.test(s.label));

  // Cada entrega con su peso (mismo orden en evaluation) y la sesión en que se entrega.
  const entregas = course.methodology.phases.map((f, i) => {
    const sesion = sesiones.find((s) => s.proyecto && sinTildes(s.proyecto).includes(sinTildes(f.title))) ?? null;
    return {
      ...f,
      porcentaje: course.evaluation[i]?.percentage ?? null,
      sesion,
      documentos: sesion ? spdpDocumentos.filter((d) => d.sesion === sesion.n) : [],
    };
  });
  const aprobadoReprobado = course.evaluation.length > 0 && course.evaluation.every((e) => /aprobado\/reprobado/i.test(e.description));

  const presentacionDe = (n: number) => spdpPresentaciones.find((p) => p.sesion === n);

  const etiquetaProxima = (s: CronogramaEntry) => {
    const d = diasEntre(hoy, s.date);
    if (d === 0) return 'Hoy';
    if (d === 1) return 'Mañana';
    return `En ${d} días`;
  };

  return (
    <CourseAccessGate course={course}>
      <div className="spdp-ds spl-pagina">
        {/* ---------------- cabecera ---------------- */}
        <header className="sp-hero spl-hero" style={{ ['--spl-banner' as string]: `url(${course.bannerUrl})` }}>
          <div className="sp-wrap">
            <Link to="/classroom" className="sp-volver">
              <IconoFlecha dir="izq" /> Aula
            </Link>
            <span className="sp-kicker">
              {course.code.replace('-', ' ')} · {course.term}
            </span>
            <div className="sp-marca" />
            <h1 className="sp-display spl-titulo">{course.title}</h1>
            {course.tagline && <p className="sp-hero-lead">{course.tagline}</p>}

            <div className="spl-franja">
              {sesiones.length > 0 && (
                <div className="spl-franja-cifra">
                  <span className="sp-cifra-valor sp-cifra-valor--naranja">{sesiones.length}</span>
                  <span className="sp-cifra-pie">
                    Sesiones · {diaMes(sesiones[0].date)} a {diaMes(sesiones[sesiones.length - 1].date)}
                  </span>
                </div>
              )}
              <dl className="spl-franja-datos">
                {franja.map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.detail}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </header>

        {/* ---------------- tres puertas ---------------- */}
        <nav className="sp-wrap spl-puertas" aria-label="Accesos del curso">
          <Puerta
            to={`${base}/readings`}
            n="01"
            kicker="Material"
            titulo="Material del curso"
            texto="Las presentaciones de las sesiones, las guías de las entregas y el formato de la entrega final."
            meta={`${spdpPresentaciones.length} presentaciones · ${spdpDocumentos.length} documentos`}
          />
          <Puerta
            to={`${base}/retos`}
            n="02"
            kicker={course.challenges ? `Retos ${course.challenges.term}` : 'Retos'}
            titulo="Explorador de retos"
            texto="Busque y filtre los retos propuestos, ábralos completos y guarde sus favoritos antes de formar equipo."
            meta={`${retos202620.length} retos · ${cupos} cupos`}
          />
          {programa && (
            <Puerta
              to={`${base}/readings?ver=programa`}
              n="03"
              kicker="Programa"
              titulo={programa.titulo}
              texto={programa.descripcion}
              meta={metaDocumento(programa)}
            />
          )}
        </nav>

        {/* ---------------- próxima sesión ---------------- */}
        {proxima && (
          <section className="sp-wrap spl-proxima-envoltura" aria-labelledby="spl-proxima">
            <div className="spl-proxima">
              <span className="spl-proxima-n" aria-hidden="true">
                {dosCifras(proxima.n)}
              </span>
              <div className="spl-proxima-cuerpo">
                <span className="spl-proxima-kicker">
                  {proxima.date === hoy ? 'Sesión de hoy' : 'Próxima sesión'} · {etiquetaProxima(proxima)}
                </span>
                <span className="spl-proxima-fecha">
                  Sesión {proxima.n} · {mayuscula(fechaLarga(proxima.date))}
                </span>
                <h2 id="spl-proxima" className="spl-proxima-tema">
                  {proxima.topic}
                </h2>
                {proxima.details && proxima.details.length > 0 && (
                  <ul className="spl-lista">
                    {proxima.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                )}
                <div className="spl-proxima-pie">
                  {proxima.proyecto && <span className="spl-entrega-marca">{proxima.proyecto}</span>}
                  {presentacionDe(proxima.n) && (
                    <Link to={`${base}/readings`} className="spl-enlace">
                      Presentación de la sesión en Material del curso
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ---------------- el curso ---------------- */}
        <Seccion id="curso" kicker="El curso" titulo="De qué se trata">
          <p className="spl-lead">{course.description}</p>
          {course.pillars && course.pillars.length > 0 && (
            <div className="spl-pilares">
              {course.pillars.map((p) => (
                <div key={p.title} className="spl-pilar">
                  <h3 className="spl-h3">{p.title}</h3>
                  <p>{p.description}</p>
                </div>
              ))}
            </div>
          )}
        </Seccion>

        {/* ---------------- objetivos ---------------- */}
        {course.objectives.length > 0 && (
          <Seccion id="objetivos" kicker="Objetivos" titulo="Al terminar el curso">
            <ol className="spl-objetivos">
              {course.objectives.map((o, i) => (
                <li key={i}>
                  <span className="spl-objetivo-n" aria-hidden="true">
                    {dosCifras(i + 1)}
                  </span>
                  <p>{o}</p>
                </li>
              ))}
            </ol>
          </Seccion>
        )}

        {/* ---------------- entregas ---------------- */}
        <Seccion id="entregas" kicker="Evaluación" ancha titulo={`${mayuscula(enLetras(entregas.length))} entregas`}>
          <p className="spl-texto">{course.methodology.summary}</p>
          <div className="spl-entregas">
            {entregas.map((e) => (
              <article key={e.label} className="spl-entrega">
                <div className="spl-entrega-cabeza">
                  <span className="spl-entrega-label">{e.label}</span>
                  {e.porcentaje !== null && <span className="spl-entrega-pct">{e.porcentaje} %</span>}
                </div>
                <h3 className="spl-h3">{e.title}</h3>
                {e.sesion && (
                  <span className="spl-entrega-fecha">
                    {mayuscula(fechaLarga(e.sesion.date))} · Sesión {e.sesion.n}
                  </span>
                )}
                <ul className="spl-lista spl-lista--compacta">
                  {e.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
                {e.documentos.length > 0 && (
                  <div className="spl-entrega-docs">
                    {e.documentos.map((d) => (
                      <EnlaceDocumento key={d.id} d={d} />
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
          {aprobadoReprobado && (
            <p className="spl-nota">
              <span className="spl-nota-etiqueta">Calificación</span> El curso se califica Aprobado o Reprobado, con el peso de cada entrega.
            </p>
          )}
        </Seccion>

        {/* ---------------- cronograma ---------------- */}
        {sesiones.length > 0 && (
          <Seccion id="cronograma" kicker="Cronograma" titulo={
              sesiones.every((s) => sinTildes(s.day) === 'miercoles')
                ? `${mayuscula(enLetras(sesiones.length))} miércoles`
                : `${mayuscula(enLetras(sesiones.length))} sesiones`
            }>
            <ol className="spl-crono">
              {sesiones.map((s) => {
                const esProxima = proxima?.n === s.n;
                const pasada = s.date < hoy;
                return (
                  <li
                    key={s.date}
                    className={`spl-crono-fila${esProxima ? ' spl-crono-fila--proxima' : ''}${pasada ? ' spl-crono-fila--pasada' : ''}`}
                    aria-current={esProxima ? 'date' : undefined}
                  >
                    <span className="spl-crono-n">{dosCifras(s.n)}</span>
                    <div className="spl-crono-tema">
                      <span className="spl-crono-fecha">
                        {mayuscula(fechaLarga(s.date))}
                        {esProxima && <span className="spl-crono-marca">{s.date === hoy ? 'Hoy' : 'Próxima'}</span>}
                      </span>
                      <span className="spl-crono-titulo">{s.topic}</span>
                    </div>
                    <div className="spl-crono-entrega">{s.proyecto && <span className="spl-entrega-marca">{s.proyecto}</span>}</div>
                  </li>
                );
              })}
            </ol>
          </Seccion>
        )}

        {/* ---------------- uso de IA ---------------- */}
        <Seccion id="ia" kicker="Uso de IA" titulo="Escala AIAS">
          <p className="spl-texto">{course.aias.intro}</p>
          <div className="spl-tabla-envoltura" role="region" aria-label="Niveles de la escala AIAS" tabIndex={0}>
            <table className="spl-tabla">
              <thead>
                <tr>
                  <th scope="col">Nivel</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Qué permite</th>
                  <th scope="col">En este curso</th>
                </tr>
              </thead>
              <tbody>
                {course.aias.levels.map((l) => (
                  <tr key={l.level} className={/^no aplica/i.test(l.application) ? 'spl-tabla-fila--tenue' : undefined}>
                    <td className="spl-tabla-nivel">{l.level}</td>
                    <th scope="row">{l.title}</th>
                    <td>{l.description}</td>
                    <td>{l.application}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {course.aias.declaration.length > 0 && (
            <div className="spl-declaracion">
              <h3 className="spl-h3">Declaración de uso de IA</h3>
              <p>Cada declaración indica:</p>
              <ol>
                {course.aias.declaration.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ol>
            </div>
          )}
        </Seccion>

        {/* ---------------- políticas ---------------- */}
        {course.policies.length > 0 && (
          <Seccion id="politicas" kicker="Políticas" titulo="Reglas del curso">
            <div className="spl-politicas">
              {course.policies.map((p) => (
                <div key={p.category} className="spl-politica">
                  <h3 className="spl-h3">{p.category}</h3>
                  <ul className="spl-lista spl-lista--compacta">
                    {p.items.map((it) => (
                      <li key={it}>{conCorreos(it)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Seccion>
        )}

        {/* ---------------- comunidad ---------------- */}
        {course.community.length > 0 && (
          <Seccion id="comunidad" kicker="Comunidad" titulo="Bienestar y apoyo">
            <div className="spl-plegables">
              {course.community.map((c) => (
                <details key={c.category} className="spl-plegable">
                  <summary>
                    <span>{c.category}</span>
                    <span className="spl-plegable-signo" aria-hidden="true" />
                  </summary>
                  <ul className="spl-lista spl-lista--compacta">
                    {c.items.map((it) => (
                      <li key={it}>{conCorreos(it)}</li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </Seccion>
        )}

        {/* ---------------- contacto ---------------- */}
        {course.team.length > 0 && (
          <Seccion id="contacto" kicker="Contacto" titulo="Equipo docente">
            <div className="spl-equipo">
              {course.team.map((t) => (
                <div key={t.name} className="spl-persona">
                  <span className="spl-persona-rol">{t.role}</span>
                  <h3 className="spl-persona-nombre">{t.name}</h3>
                  {t.email && (
                    <a href={`mailto:${t.email}`} className="spl-enlace spl-persona-correo">
                      {t.email}
                    </a>
                  )}
                  {t.officeHours && (
                    <p className="spl-persona-horario">
                      <span className="spl-nota-etiqueta">Atención</span> {t.officeHours}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Seccion>
        )}

        <footer className="sp-wrap">
          <div className="sp-pie-pagina">
            {course.code} · {course.title} · {course.term}
          </div>
        </footer>
      </div>
    </CourseAccessGate>
  );
};
