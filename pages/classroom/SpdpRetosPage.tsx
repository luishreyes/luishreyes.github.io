import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { Course } from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';
import { retos202620, retosCorte, type Reto202620, type RetoOrigen } from '../../components/data/classroom/spdp-retos-2026-20';
import '@fontsource/anton/400.css';
import '@fontsource/barlow/400.css';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow/700.css';
import '@fontsource/playfair-display/400.css';
import '../../components/classroom/spdp-theme.css';

/* ============================================================
   SpdpRetosPage — explorador de los retos de 2026-20 del SPDP
   (IQYA 3050), en la identidad del curso (spdp-theme.css).
   Los datos salen del mismo archivo que la presentación del
   Día 1 (sPDP/202620/presentaciones/datos/exportar-portafolio.py).

   Tres vistas: Explorar (búsqueda + filtros con conteo), En cifras
   (las gráficas de la presentación; tocar una barra filtra) y Mis
   favoritos (guardados en este navegador; se comparten con un
   enlace ?favoritos=177,183). ?reto=177 abre la ficha de un reto.
   ============================================================ */

type Vista = 'explorar' | 'cifras' | 'favoritos';

interface Filtros {
  area: string | null;
  tipo: string | null;
  integrantes: number | null;
  origen: RetoOrigen | null;
  persona: string | null;
}

const SIN_FILTROS: Filtros = { area: null, tipo: null, integrantes: null, origen: null, persona: null };

const ORIGEN_ROTULO: Record<RetoOrigen, string> = {
  asesor: 'Propuesto por el asesor',
  semillero: 'Semillero o proyecto especial',
  empresa: 'Propuesto por una empresa',
};

const CLAVE_FAVORITOS = 'spdp:2026-20:favoritos';

const numero = (n: number) =>
  ['cero', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce'][n] ?? String(n);

const personas = (n: number) => (n === 1 ? 'una persona' : 'dos personas');

const sinTildes = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** El localStorage puede fallar (navegación privada, almacenamiento bloqueado): nunca rompe la página. */
function leerFavoritos(): number[] {
  try {
    const crudo = window.localStorage.getItem(CLAVE_FAVORITOS);
    const lista = crudo ? JSON.parse(crudo) : [];
    return Array.isArray(lista) ? lista.filter((x) => typeof x === 'number') : [];
  } catch {
    return [];
  }
}
function guardarFavoritos(ids: number[]) {
  try {
    window.localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(ids));
  } catch {
    /* sin almacenamiento: los favoritos viven solo mientras la pestaña esté abierta */
  }
}

function contar<T>(items: Reto202620[], clave: (r: Reto202620) => T): Map<T, number> {
  const m = new Map<T, number>();
  items.forEach((r) => m.set(clave(r), (m.get(clave(r)) ?? 0) + 1));
  return m;
}

function cumple(r: Reto202620, f: Filtros, q: string, ignorar?: keyof Filtros): boolean {
  if (ignorar !== 'area' && f.area && r.area !== f.area) return false;
  if (ignorar !== 'tipo' && f.tipo && r.tipo !== f.tipo) return false;
  if (ignorar !== 'integrantes' && f.integrantes && r.integrantes !== f.integrantes) return false;
  if (ignorar !== 'origen' && f.origen && r.origen !== f.origen) return false;
  if (ignorar !== 'persona' && f.persona && r.asesor !== f.persona && r.coasesor !== f.persona) return false;
  if (q) {
    const hay = sinTildes(
      [r.titulo, r.enCorto, r.asesor, r.coasesor ?? '', r.area, r.tipo, r.empresa ?? '', r.reto, r.objetivos].join(' '),
    );
    if (!q.split(/\s+/).every((p) => hay.includes(p))) return false;
  }
  return true;
}

/* ---------------- íconos (SVG en línea, sin CDN) ---------------- */

const IconoEstrella: React.FC<{ llena: boolean }> = ({ llena }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={llena ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z" />
  </svg>
);
const IconoBuscar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
  </svg>
);
const IconoCerrar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
const IconoFlecha: React.FC<{ dir: 'izq' | 'der' }> = ({ dir }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {dir === 'izq' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
  </svg>
);

/* ---------------- piezas ---------------- */

const Estrella: React.FC<{ activa: boolean; onToggle: () => void; titulo: string; claro?: boolean }> = ({ activa, onToggle, titulo, claro }) => (
  <button
    type="button"
    className="sp-estrella"
    aria-pressed={activa}
    aria-label={activa ? `Quitar «${titulo}» de favoritos` : `Guardar «${titulo}» en favoritos`}
    title={activa ? 'Quitar de favoritos' : 'Guardar en favoritos'}
    onClick={(e) => {
      e.stopPropagation();
      onToggle();
    }}
    style={claro ? { color: activa ? 'var(--sp-orange-500)' : 'rgba(255,255,255,.75)' } : undefined}
  >
    <IconoEstrella llena={activa} />
  </button>
);

const Ficha: React.FC<{ r: Reto202620; favorito: boolean; onFavorito: () => void; onAbrir: () => void }> = ({ r, favorito, onFavorito, onAbrir }) => (
  <article
    className="sp-ficha"
    role="button"
    tabIndex={0}
    onClick={onAbrir}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onAbrir();
      }
    }}
    aria-label={`${r.titulo}. Ver el reto completo`}
  >
    <span className="sp-ficha-area">{r.area}</span>
    <Estrella activa={favorito} onToggle={onFavorito} titulo={r.titulo} />
    <h3 className="sp-ficha-titulo">{r.titulo}</h3>
    <span className="sp-ficha-meta">
      {r.tipo} · {personas(r.integrantes)}
    </span>
    <p className="sp-ficha-corto">{r.enCorto}</p>
    <Etiquetas r={r} />
    <div className="sp-ficha-pie">
      <b>{r.asesor}</b>
      {r.coasesor ? <> · con {r.coasesor}</> : null}
    </div>
  </article>
);

const Etiquetas: React.FC<{ r: Reto202620 }> = ({ r }) => {
  const items: { t: string; acento?: boolean }[] = [];
  if (r.origen === 'semillero') items.push({ t: 'Semillero o proyecto especial' });
  if (r.empresa) items.push({ t: r.empresa === 'Por definir' ? 'Empresa por definir' : r.empresa });
  if (r.requisito) items.push({ t: 'Tiene requisito', acento: true });
  if (r.residuo) items.push({ t: 'Parte de un residuo' });
  if (!items.length) return null;
  return (
    <div className="sp-etiquetas">
      {items.map((i) => (
        <span key={i.t} className={`sp-etiqueta${i.acento ? ' sp-etiqueta--acento' : ''}`}>
          {i.t}
        </span>
      ))}
    </div>
  );
};

const Chip: React.FC<{ activo: boolean; n: number; onClick: () => void; children: React.ReactNode }> = ({ activo, n, onClick, children }) => (
  <button type="button" className="sp-chip" aria-pressed={activo} onClick={onClick} disabled={!activo && n === 0}>
    {children} <span className="sp-chip-n">{n}</span>
  </button>
);

/* ---------------- página ---------------- */

interface Props {
  course: Course;
}

export const SpdpRetosPage: React.FC<Props> = ({ course }) => {
  const [params, setParams] = useSearchParams();
  const [vista, setVista] = useState<Vista>('explorar');
  const [filtros, setFiltros] = useState<Filtros>(SIN_FILTROS);
  const [busqueda, setBusqueda] = useState('');
  const [favoritos, setFavoritos] = useState<number[]>(() => leerFavoritos());
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const [copiado, setCopiado] = useState<string | null>(null);

  const abierto = useMemo(() => {
    const id = Number(params.get('reto'));
    return retos202620.find((r) => r.id === id) ?? null;
  }, [params]);

  const compartidos = useMemo(() => {
    const crudo = params.get('favoritos');
    if (!crudo) return null;
    const ids = crudo.split(',').map(Number).filter((id) => retos202620.some((r) => r.id === id));
    return ids.length ? ids : null;
  }, [params]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (compartidos) setVista('favoritos');
  }, [compartidos]);
  useEffect(() => guardarFavoritos(favoritos), [favoritos]);

  const abrir = useCallback(
    (id: number | null) => {
      const p = new URLSearchParams(params);
      if (id === null) p.delete('reto');
      else p.set('reto', String(id));
      setParams(p, { replace: id === null });
    },
    [params, setParams],
  );

  const alternarFavorito = (id: number) =>
    setFavoritos((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const q = sinTildes(busqueda.trim());
  const visibles = useMemo(() => retos202620.filter((r) => cumple(r, filtros, q)), [filtros, q]);

  // Conteo de cada opción con los demás filtros aplicados: dice cuántos retos
  // quedarían si se toca ese botón.
  const conteo = useCallback(
    <T,>(clave: keyof Filtros, valor: (r: Reto202620) => T) =>
      contar(retos202620.filter((r) => cumple(r, filtros, q, clave)), valor),
    [filtros, q],
  );

  const areas = useMemo(() => Array.from(contar(retos202620, (r) => r.area)).sort((a, b) => b[1] - a[1]).map(([a]) => a), []);
  const gente = useMemo(() => {
    const s = new Set<string>();
    retos202620.forEach((r) => {
      s.add(r.asesor);
      if (r.coasesor) s.add(r.coasesor);
    });
    return Array.from(s).sort((a, b) => sinTildes(a.split(' ').slice(-1)[0]).localeCompare(sinTildes(b.split(' ').slice(-1)[0])));
  }, []);

  const totales = useMemo(() => {
    const asesores = new Set(retos202620.map((r) => r.asesor));
    return {
      retos: retos202620.length,
      cupos: retos202620.reduce((s, r) => s + r.integrantes, 0),
      asesores: asesores.size,
    };
  }, []);

  const hayFiltros = Object.values(filtros).some((v) => v !== null) || q.length > 0;
  const limpiar = () => {
    setFiltros(SIN_FILTROS);
    setBusqueda('');
  };
  const filtrar = (f: Partial<Filtros>) => {
    setFiltros({ ...SIN_FILTROS, ...f });
    setBusqueda('');
    setVista('explorar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const alternar = <K extends keyof Filtros>(k: K, v: Filtros[K]) => setFiltros((f) => ({ ...f, [k]: f[k] === v ? null : v }));

  const copiar = async (texto: string, que: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(que);
    } catch {
      window.prompt('Copie el texto:', texto);
    }
    window.setTimeout(() => setCopiado(null), 2500);
  };

  // Navegación entre fichas dentro del conjunto visible (o de favoritos, si se abrió desde ahí).
  const secuencia = vista === 'favoritos' ? (compartidos ?? favoritos) : visibles.map((r) => r.id);
  const pos = abierto ? secuencia.indexOf(abierto.id) : -1;

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') abrir(null);
      if (e.key === 'ArrowRight' && pos >= 0 && pos < secuencia.length - 1) abrir(secuencia[pos + 1]);
      if (e.key === 'ArrowLeft' && pos > 0) abrir(secuencia[pos - 1]);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [abierto, abrir, pos, secuencia]);

  return (
    <CourseAccessGate course={course}>
      <div className="spdp-ds">
        {/* ---------------- cabecera ---------------- */}
        <header className="sp-hero">
          <div className="sp-wrap">
            <Link to={`/classroom/${course.slug}`} className="sp-volver">
              <IconoFlecha dir="izq" /> Volver al curso
            </Link>
            <span className="sp-kicker">IQYA 3050 · Retos 2026-20 · se desarrollan en 2027-10</span>
            <div className="sp-marca" />
            <h1 className="sp-display">Los retos</h1>
            <p className="sp-hero-lead">
              {totales.retos} retos propuestos por {totales.asesores} asesores del departamento. Explórelos, ábralos completos y guarde dos o tres
              favoritos antes del miércoles 14 de octubre, cuando se forman los equipos.
            </p>
            <div className="sp-cifras">
              <div>
                <span className="sp-cifra-valor sp-cifra-valor--naranja">{totales.retos}</span>
                <span className="sp-cifra-pie">Retos</span>
              </div>
              <div>
                <span className="sp-cifra-valor">{totales.cupos}</span>
                <span className="sp-cifra-pie">Cupos de estudiante</span>
              </div>
              <div>
                <span className="sp-cifra-valor">{totales.asesores}</span>
                <span className="sp-cifra-pie">Asesores</span>
              </div>
            </div>
          </div>
        </header>

        {/* ---------------- pestañas ---------------- */}
        <nav className="sp-tabs" aria-label="Vistas">
          <div className="sp-wrap sp-tabs-inner" role="tablist">
            {(
              [
                ['explorar', 'Explorar'],
                ['cifras', 'En cifras'],
                ['favoritos', 'Mis favoritos'],
              ] as [Vista, string][]
            ).map(([v, t]) => (
              <button key={v} type="button" role="tab" className="sp-tab" aria-selected={vista === v} onClick={() => setVista(v)}>
                {t}
                {v === 'favoritos' && favoritos.length > 0 ? <span className="sp-tab-n">{favoritos.length}</span> : null}
              </button>
            ))}
          </div>
        </nav>

        <main className="sp-wrap sp-seccion">
          {vista === 'explorar' && (
            <div className="sp-explorar">
              {/* filtros */}
              <aside>
                <button type="button" className="sp-boton sp-boton--claro sp-filtros-toggle" aria-expanded={filtrosAbiertos} onClick={() => setFiltrosAbiertos((x) => !x)}>
                  {filtrosAbiertos ? 'Ocultar filtros' : 'Filtrar'}
                  {hayFiltros ? ` · ${Object.values(filtros).filter((v) => v !== null).length}` : ''}
                </button>
                <div className="sp-filtros" data-abierto={filtrosAbiertos}>
                  <FiltrosPanel
                    filtros={filtros}
                    areas={areas}
                    gente={gente}
                    conteo={conteo}
                    alternar={alternar}
                    setPersona={(p) => setFiltros((f) => ({ ...f, persona: p }))}
                  />
                </div>
              </aside>

              {/* resultados */}
              <section aria-label="Retos">
                <label className="sp-buscar">
                  <IconoBuscar />
                  <input
                    type="search"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar: cacao, CFD, empaques, Luker…"
                    aria-label="Buscar en los retos"
                  />
                </label>
                <div className="sp-resultados-cabeza">
                  <span className="sp-conteo">
                    <b>{visibles.length}</b> de {retos202620.length} retos
                  </span>
                  {hayFiltros && (
                    <button type="button" className="sp-link" onClick={limpiar}>
                      Quitar filtros
                    </button>
                  )}
                </div>
                {visibles.length ? (
                  <div className="sp-grid">
                    {visibles.map((r) => (
                      <Ficha key={r.id} r={r} favorito={favoritos.includes(r.id)} onFavorito={() => alternarFavorito(r.id)} onAbrir={() => abrir(r.id)} />
                    ))}
                  </div>
                ) : (
                  <p className="sp-vacio">
                    Ningún reto cumple con todo eso a la vez.{' '}
                    <button type="button" className="sp-link" onClick={limpiar}>
                      Quitar filtros
                    </button>
                  </p>
                )}
              </section>
            </div>
          )}

          {vista === 'cifras' && <EnCifras filtrar={filtrar} />}

          {vista === 'favoritos' && (
            <Favoritos
              favoritos={favoritos}
              compartidos={compartidos}
              abrir={abrir}
              quitar={alternarFavorito}
              agregarCompartidos={() => {
                if (!compartidos) return;
                setFavoritos((f) => Array.from(new Set([...f, ...compartidos])));
                const p = new URLSearchParams(params);
                p.delete('favoritos');
                setParams(p, { replace: true });
              }}
              descartarCompartidos={() => {
                const p = new URLSearchParams(params);
                p.delete('favoritos');
                setParams(p, { replace: true });
              }}
              copiar={copiar}
              copiado={copiado}
              irAExplorar={() => setVista('explorar')}
              slug={course.slug}
            />
          )}
        </main>

        <footer className="sp-wrap">
          <div className="sp-pie-pagina">Formulario de propuesta de retos · semestre 2026-20 · corte: {retosCorte}</div>
        </footer>

        {/* ---------------- ficha completa ---------------- */}
        {abierto && (
          <>
            <div className="sp-velo" onClick={() => abrir(null)} aria-hidden="true" />
            <div className="sp-panel" role="dialog" aria-modal="true" aria-labelledby="sp-panel-titulo">
              <div className="sp-panel-cabeza">
                <span className="sp-kicker">Reto {abierto.id} · {abierto.area}</span>
                <div className="sp-panel-botones">
                  <Estrella activa={favoritos.includes(abierto.id)} onToggle={() => alternarFavorito(abierto.id)} titulo={abierto.titulo} claro />
                  <button type="button" className="sp-boton-icono" aria-label="Reto anterior" disabled={pos <= 0} onClick={() => abrir(secuencia[pos - 1])}>
                    <IconoFlecha dir="izq" />
                  </button>
                  <button type="button" className="sp-boton-icono" aria-label="Reto siguiente" disabled={pos < 0 || pos >= secuencia.length - 1} onClick={() => abrir(secuencia[pos + 1])}>
                    <IconoFlecha dir="der" />
                  </button>
                  <button type="button" className="sp-boton-icono" aria-label="Cerrar" onClick={() => abrir(null)}>
                    <IconoCerrar />
                  </button>
                </div>
              </div>
              <div className="sp-panel-cuerpo">
                <span className="sp-kicker" style={{ color: 'var(--sp-accent-text)' }}>
                  {abierto.tipo} · {personas(abierto.integrantes)}
                </span>
                <h2 id="sp-panel-titulo" className="sp-panel-titulo">
                  {abierto.titulo}
                </h2>
                <p className="sp-panel-lead">{abierto.enCorto}</p>
                <table className="sp-datos">
                  <tbody>
                    <tr>
                      <th scope="row">Asesor</th>
                      <td>{abierto.asesor}</td>
                    </tr>
                    {abierto.coasesor && (
                      <tr>
                        <th scope="row">Coasesor</th>
                        <td>{abierto.coasesor}</td>
                      </tr>
                    )}
                    <tr>
                      <th scope="row">Origen</th>
                      <td>{ORIGEN_ROTULO[abierto.origen]}</td>
                    </tr>
                    {abierto.empresa && (
                      <tr>
                        <th scope="row">Empresa</th>
                        <td>{abierto.empresa}</td>
                      </tr>
                    )}
                    <tr>
                      <th scope="row">Equipo</th>
                      <td>{abierto.integrantes === 1 ? 'Una persona' : 'Dos personas'}</td>
                    </tr>
                    <tr>
                      <th scope="row">Seguimiento</th>
                      <td style={{ whiteSpace: 'pre-wrap' }}>{abierto.seguimientoTexto}</td>
                    </tr>
                    {abierto.requisito && (
                      <tr>
                        <th scope="row">Requisito</th>
                        <td style={{ color: 'var(--sp-accent-text)', fontWeight: 600 }}>{abierto.requisito}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <h3 className="sp-bloque-titulo">El reto, como lo escribió el asesor</h3>
                <p className="sp-texto-largo">{abierto.reto}</p>
                <h3 className="sp-bloque-titulo">Objetivos</h3>
                <p className="sp-texto-largo">{abierto.objetivos}</p>
                <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button type="button" className={`sp-boton${favoritos.includes(abierto.id) ? ' sp-boton--claro' : ' sp-boton--acento'}`} onClick={() => alternarFavorito(abierto.id)}>
                    <IconoEstrella llena={favoritos.includes(abierto.id)} />
                    {favoritos.includes(abierto.id) ? 'Está en sus favoritos' : 'Guardar en favoritos'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </CourseAccessGate>
  );
};

/* ---------------- filtros ---------------- */

const FiltrosPanel: React.FC<{
  filtros: Filtros;
  areas: string[];
  gente: string[];
  conteo: <T>(clave: keyof Filtros, valor: (r: Reto202620) => T) => Map<T, number>;
  alternar: <K extends keyof Filtros>(k: K, v: Filtros[K]) => void;
  setPersona: (p: string | null) => void;
}> = ({ filtros, areas, gente, conteo, alternar, setPersona }) => {
  const nArea = conteo('area', (r) => r.area);
  const nTipo = conteo('tipo', (r) => r.tipo);
  const nInt = conteo('integrantes', (r) => r.integrantes);
  const nOrigen = conteo('origen', (r) => r.origen);
  const enPersona = conteo('persona', (r) => r.asesor);
  const enPersonaCo = conteo('persona', (r) => r.coasesor);
  return (
    <>
      <div>
        <h2 className="sp-filtro-titulo">Área</h2>
        <div className="sp-opciones">
          {areas.map((a) => (
            <Chip key={a} activo={filtros.area === a} n={nArea.get(a) ?? 0} onClick={() => alternar('area', a)}>
              {a}
            </Chip>
          ))}
        </div>
      </div>
      <div>
        <h2 className="sp-filtro-titulo">Tipo</h2>
        <div className="sp-opciones">
          {['Investigación', 'Innovación'].map((t) => (
            <Chip key={t} activo={filtros.tipo === t} n={nTipo.get(t as Reto202620['tipo']) ?? 0} onClick={() => alternar('tipo', t)}>
              {t}
            </Chip>
          ))}
        </div>
      </div>
      <div>
        <h2 className="sp-filtro-titulo">Equipo</h2>
        <div className="sp-opciones">
          {[1, 2].map((n) => (
            <Chip key={n} activo={filtros.integrantes === n} n={nInt.get(n) ?? 0} onClick={() => alternar('integrantes', n)}>
              {n === 1 ? 'Para una persona' : 'Para dos'}
            </Chip>
          ))}
        </div>
      </div>
      <div>
        <h2 className="sp-filtro-titulo">Origen</h2>
        <div className="sp-opciones">
          {(['asesor', 'semillero', 'empresa'] as RetoOrigen[]).map((o) => (
            <Chip key={o} activo={filtros.origen === o} n={nOrigen.get(o) ?? 0} onClick={() => alternar('origen', o)}>
              {o === 'asesor' ? 'El asesor' : o === 'semillero' ? 'Semillero o proyecto especial' : 'Una empresa'}
            </Chip>
          ))}
        </div>
      </div>
      <div>
        <h2 className="sp-filtro-titulo">Asesor o coasesor</h2>
        <select className="sp-select" value={filtros.persona ?? ''} onChange={(e) => setPersona(e.target.value || null)} aria-label="Asesor o coasesor">
          <option value="">Todos</option>
          {gente.map((g) => {
            const n = (enPersona.get(g) ?? 0) + (enPersonaCo.get(g) ?? 0);
            return (
              <option key={g} value={g}>
                {g} ({n})
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
};

/* ---------------- en cifras ---------------- */

const EnCifras: React.FC<{ filtrar: (f: Partial<Filtros>) => void }> = ({ filtrar }) => {
  const tipo = contar(retos202620, (r) => r.tipo);
  const tam = contar(retos202620, (r) => r.integrantes);
  const origen = contar(retos202620, (r) => r.origen);
  const area = Array.from(contar(retos202620, (r) => r.area)).sort((a, b) => b[1] - a[1]);
  const cuposArea = new Map<string, number>();
  retos202620.forEach((r) => cuposArea.set(r.area, (cuposArea.get(r.area) ?? 0) + r.integrantes));

  // Asesoría principal y coasesoría por separado, como en la presentación.
  const principales = Array.from(contar(retos202620, (r) => r.asesor));
  const coas = contar(retos202620.filter((r) => r.coasesor), (r) => r.coasesor as string);
  const filasAs = principales
    .map(([a, p]) => ({ a, p, c: coas.get(a) ?? 0 }))
    .sort((x, y) => y.p + y.c - (x.p + x.c) || x.a.localeCompare(y.a));
  const maxAs = Math.max(...filasAs.map((f) => f.p + f.c));
  const maxArea = Math.max(...area.map(([, n]) => n));
  const maxOrigen = Math.max(...Array.from(origen.values()));

  const Barra: React.FC<{ rotulo: string; v: number; max: number; valor: string; b?: number; onClick: () => void }> = ({ rotulo, v, max, valor, b = 0, onClick }) => (
    <button type="button" className="sp-barra" onClick={onClick} aria-label={`${rotulo}: ${valor}. Ver esos retos`}>
      <span className="sp-barra-rotulo">{rotulo}</span>
      <span className="sp-barra-pista">
        <span className="sp-barra-pila" style={{ ['--v' as string]: v + b, ['--max' as string]: max }}>
          <span className="sp-barra-seg" style={{ flex: v }} />
          {b > 0 && <span className="sp-barra-seg sp-barra-seg--b" style={{ flex: b }} />}
        </span>
        <span className="sp-barra-valor">{valor}</span>
      </span>
    </button>
  );

  return (
    <>
      <p className="sp-grafico-nota" style={{ marginBottom: 24 }}>
        Toque una barra para ver esos retos.
      </p>
      <div className="sp-cifras-grid">
        <section className="sp-grafico">
          <h2 className="sp-grafico-titulo">Tipo de proyecto</h2>
          <div className="sp-partida">
            <div className="sp-partida-pista">
              <button type="button" className="a" style={{ flex: tipo.get('Investigación') ?? 0 }} onClick={() => filtrar({ tipo: 'Investigación' })} aria-label="Ver los retos de investigación" />
              <button type="button" className="b" style={{ flex: tipo.get('Innovación') ?? 0 }} onClick={() => filtrar({ tipo: 'Innovación' })} aria-label="Ver los retos de innovación" />
            </div>
            <div className="sp-partida-rotulos">
              <span><b>{tipo.get('Investigación') ?? 0}</b>Investigación</span>
              <span><b>{tipo.get('Innovación') ?? 0}</b>Innovación</span>
            </div>
          </div>
          <p className="sp-grafico-nota">Investigación responde una pregunta con un método; innovación entrega un producto o un proceso nuevo.</p>
        </section>

        <section className="sp-grafico">
          <h2 className="sp-grafico-titulo">Tamaño del equipo</h2>
          <div className="sp-partida">
            <div className="sp-partida-pista">
              <button type="button" className="a" style={{ flex: tam.get(2) ?? 0 }} onClick={() => filtrar({ integrantes: 2 })} aria-label="Ver los retos para dos" />
              <button type="button" className="b" style={{ flex: tam.get(1) ?? 0 }} onClick={() => filtrar({ integrantes: 1 })} aria-label="Ver los retos para una persona" />
            </div>
            <div className="sp-partida-rotulos">
              <span><b>{tam.get(2) ?? 0}</b>Para dos</span>
              <span><b>{tam.get(1) ?? 0}</b>Para uno</span>
            </div>
          </div>
          <p className="sp-grafico-nota">Un reto para dos necesita equipo de dos. Los equipos se arman el 14 de octubre.</p>
        </section>

        <section className="sp-grafico">
          <h2 className="sp-grafico-titulo">De qué se tratan</h2>
          <div className="sp-barras">
            {area.map(([a, n]) => (
              <Barra key={a} rotulo={a} v={n} max={maxArea} valor={`${n} ${n === 1 ? 'reto' : 'retos'} · ${cuposArea.get(a)} cupos`} onClick={() => filtrar({ area: a })} />
            ))}
          </div>
        </section>

        <section className="sp-grafico">
          <h2 className="sp-grafico-titulo">De dónde viene el reto</h2>
          <div className="sp-barras">
            {(['asesor', 'semillero', 'empresa'] as RetoOrigen[]).map((o) => (
              <Barra
                key={o}
                rotulo={o === 'asesor' ? 'El asesor' : o === 'semillero' ? 'Semillero o proyecto especial' : 'Una empresa'}
                v={origen.get(o) ?? 0}
                max={maxOrigen}
                valor={String(origen.get(o) ?? 0)}
                onClick={() => filtrar({ origen: o })}
              />
            ))}
          </div>
          <p className="sp-grafico-nota">Si viene de un semillero o proyecto especial, alguien ya empezó el trabajo: usted llega a continuarlo.</p>
        </section>

        <section className="sp-grafico" style={{ gridColumn: '1 / -1' }}>
          <h2 className="sp-grafico-titulo">Con quién puede trabajar</h2>
          <div className="sp-leyenda">
            <span>Asesoría principal</span>
            <span className="b">Coasesoría</span>
          </div>
          <div className="sp-barras" style={{ maxWidth: 820 }}>
            {filasAs.map((f) => (
              <Barra key={f.a} rotulo={f.a} v={f.p} b={f.c} max={maxAs} valor={f.c ? `${f.p} + ${f.c}` : String(f.p)} onClick={() => filtrar({ persona: f.a })} />
            ))}
          </div>
          <p className="sp-grafico-nota">Otros coasesores, que no proponen retos propios, aparecen en la ficha de cada reto.</p>
        </section>
      </div>
    </>
  );
};

/* ---------------- favoritos ---------------- */

const Favoritos: React.FC<{
  favoritos: number[];
  compartidos: number[] | null;
  abrir: (id: number) => void;
  quitar: (id: number) => void;
  agregarCompartidos: () => void;
  descartarCompartidos: () => void;
  copiar: (texto: string, que: string) => void;
  copiado: string | null;
  irAExplorar: () => void;
  slug: string;
}> = ({ favoritos, compartidos, abrir, quitar, agregarCompartidos, descartarCompartidos, copiar, copiado, irAExplorar, slug }) => {
  const porId = (id: number) => retos202620.find((r) => r.id === id)!;
  const lista = (compartidos ?? favoritos).map(porId);
  const enlace = `${window.location.origin}/classroom/${slug}/retos?favoritos=${favoritos.join(',')}`;
  const texto = favoritos
    .map(porId)
    .map((r) => `${r.id} · ${r.titulo} — ${r.asesor} (${personas(r.integrantes)})`)
    .join('\n');

  return (
    <div style={{ maxWidth: 880 }}>
      {compartidos ? (
        <div className="sp-aviso" style={{ marginBottom: 24 }}>
          <span className="sp-aviso-etiqueta">Lista compartida</span>
          <p>
            Alguien le compartió {numero(compartidos.length)} {compartidos.length === 1 ? 'reto' : 'retos'}.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button type="button" className="sp-boton sp-boton--claro" onClick={agregarCompartidos}>
              Agregar a mis favoritos
            </button>
            <button type="button" className="sp-boton" style={{ background: 'transparent', borderColor: '#fff' }} onClick={descartarCompartidos}>
              Ver los míos
            </button>
          </div>
        </div>
      ) : (
        <div className="sp-aviso" style={{ marginBottom: 24 }}>
          <span className="sp-aviso-etiqueta">Escoja dos o tres</span>
          <p>No uno solo. El miércoles 14 de octubre se forman los equipos y se asigna un reto a cada uno.</p>
        </div>
      )}

      {lista.length === 0 ? (
        <p className="sp-vacio">
          Todavía no ha guardado ninguno. Toque la estrella de un reto para guardarlo aquí.{' '}
          <button type="button" className="sp-link" onClick={irAExplorar}>
            Ir a explorar
          </button>
        </p>
      ) : (
        <>
          {lista.map((r) => (
            <div key={r.id} className="sp-fila">
              <div>
                <span className="sp-ficha-area">{r.area}</span>
                <div style={{ marginTop: 4 }}>
                  <button type="button" className="sp-fila-titulo" onClick={() => abrir(r.id)}>
                    {r.titulo}
                  </button>
                </div>
                <div className="sp-ficha-meta" style={{ marginTop: 6 }}>
                  {r.tipo} · {personas(r.integrantes)} · {r.asesor}
                </div>
                <p className="sp-ficha-corto" style={{ marginTop: 6 }}>
                  {r.enCorto}
                </p>
              </div>
              {!compartidos && <Estrella activa onToggle={() => quitar(r.id)} titulo={r.titulo} />}
            </div>
          ))}
          {!compartidos && (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
              <button type="button" className="sp-boton sp-boton--acento" onClick={() => copiar(enlace, 'enlace')}>
                {copiado === 'enlace' ? 'Enlace copiado' : 'Copiar enlace para compartir'}
              </button>
              <button type="button" className="sp-boton sp-boton--claro" onClick={() => copiar(texto, 'texto')}>
                {copiado === 'texto' ? 'Lista copiada' : 'Copiar como texto'}
              </button>
            </div>
          )}
          {!compartidos && (
            <p className="sp-grafico-nota" style={{ marginTop: 14 }}>
              Sus favoritos se guardan en este navegador. El enlace abre la misma lista en el celular de su compañero.
            </p>
          )}
        </>
      )}
    </div>
  );
};
