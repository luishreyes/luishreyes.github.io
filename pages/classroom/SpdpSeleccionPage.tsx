import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';
import { retos202620, type Reto202620 } from '../../components/data/classroom/spdp-retos-2026-20';
import { retosSeleccionados } from '../../components/data/classroom/spdp-retos-seleccionados-2026-20';
import { estudiantes202620 } from '../../components/data/classroom/spdp-estudiantes-2026-20';
import '@fontsource/anton/400.css';
import '@fontsource/barlow/400.css';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow/700.css';
import '@fontsource/playfair-display/400.css';
import '../../components/classroom/spdp-theme.css';
import '../../components/classroom/spdp-seleccion.css';

/* ============================================================
   SpdpSeleccionPage — herramienta del profesor para la sesión de
   selección de retos del SPDP 2026-20. No está enlazada desde
   ninguna página del curso: se entra por la URL
   /classroom/iqya-3050-2026-20/seleccion.

   Flujo: (1) Registrar: cada estudiante dice su opción 1 y su
   opción 2. (2) Resolver: la página asigna de una vez a quien no
   compite con nadie y lista los conflictos para discutirlos.
   (3) Por reto: el tablero completo.

   El estado vive en el localStorage de este navegador (nada sale
   del equipo) y se exporta a Excel (CSV) o a un respaldo JSON.
   Los retos ya asignados antes de la sesión salen de
   spdp-retos-seleccionados-2026-20.ts y quedan fijos.
   ============================================================ */

type Vista = 'registrar' | 'resolver' | 'retos';
type Opciones = [number | null, number | null];

interface Estado {
  /** estudiante → [opción 1, opción 2] */
  prefs: Record<string, Opciones>;
  /** estudiante → reto asignado en la sesión */
  asignados: Record<string, number>;
  /** estudiantes agregados a mano (no estaban en la lista) */
  extras: string[];
}

const CLAVE = 'spdp:2026-20:seleccion';
const VACIO: Estado = { prefs: {}, asignados: {}, extras: [] };

function leer(): Estado {
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    if (!crudo) return VACIO;
    const e = JSON.parse(crudo);
    return { prefs: e.prefs ?? {}, asignados: e.asignados ?? {}, extras: Array.isArray(e.extras) ? e.extras : [] };
  } catch {
    return VACIO;
  }
}

const sinTildes = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** «Alejandro Gómez» (como lo escribió un asesor) coincide con «Alejandro Gómez Ramírez». */
const coincide = (corto: string, completo: string) => {
  const c = sinTildes(completo).split(/\s+/);
  return sinTildes(corto)
    .split(/\s+/)
    .every((p) => c.includes(p));
};

const retoPorId = new Map(retos202620.map((r) => [r.id, r]));

/** Cupos que quedan de un reto antes de la sesión, descontando lo ya asignado. */
function cupoInicial(r: Reto202620): number {
  const s = retosSeleccionados[r.id];
  if (!s) return r.integrantes;
  if (s.individual || s.motivo === 'maestria') return 0;
  return Math.max(0, r.integrantes - s.nombres.length);
}

/** Estudiante de la lista que ya tenía reto antes de la sesión. */
function retoPrevio(nombre: string): number | null {
  for (const [id, s] of Object.entries(retosSeleccionados)) {
    if (s.motivo === 'maestria') continue; // proyecto de maestría: no es su reto del seminario
    if (s.nombres.some((n) => coincide(n, nombre))) return Number(id);
  }
  return null;
}

type EstadoEst = 'previo' | 'asignado' | 'libre' | 'conflicto' | 'pendiente';

const ROTULO: Record<EstadoEst, string> = {
  previo: 'Ya tenía reto',
  asignado: 'Asignado',
  libre: 'Sin conflicto',
  conflicto: 'En conflicto',
  pendiente: 'Sin registrar',
};

const corto = (r: Reto202620) => `${r.id} · ${r.titulo}`;

export const SpdpSeleccionPage: React.FC<{ course: Course }> = ({ course }) => {
  const [estado, setEstado] = useState<Estado>(() => leer());
  const [vista, setVista] = useState<Vista>('registrar');
  const [actual, setActual] = useState<string | null>(null);
  const [qEst, setQEst] = useState('');
  const [qReto, setQReto] = useState('');
  const [nuevo, setNuevo] = useState('');
  const buscarReto = useRef<HTMLInputElement>(null);
  const archivo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch {
      /* sin almacenamiento: exportar seguido */
    }
  }, [estado]);

  useEffect(() => {
    document.title = 'Selección de retos · SPDP 2026-20';
  }, []);

  const lista = useMemo(() => [...estudiantes202620, ...estado.extras], [estado.extras]);
  const previos = useMemo(() => new Map(lista.map((n) => [n, retoPrevio(n)])), [lista]);

  /* ---------- cálculo central ---------- */
  const calc = useMemo(() => {
    const quedan = new Map<number, number>();
    retos202620.forEach((r) => quedan.set(r.id, cupoInicial(r)));
    Object.values(estado.asignados).forEach((id: number) => quedan.set(id, (quedan.get(id) ?? 0) - 1));

    const sinReto = (n: string) => !previos.get(n) && estado.asignados[n] === undefined;
    const op1 = new Map<number, string[]>();
    const op2 = new Map<number, string[]>();
    lista.forEach((n) => {
      if (!sinReto(n)) return;
      const [a, b] = estado.prefs[n] ?? [null, null];
      if (a) op1.set(a, [...(op1.get(a) ?? []), n]);
      if (b) op2.set(b, [...(op2.get(b) ?? []), n]);
    });
    const enConflicto = (id: number) => (op1.get(id)?.length ?? 0) > (quedan.get(id) ?? 0);

    const est = new Map<string, EstadoEst>();
    lista.forEach((n) => {
      if (previos.get(n)) return est.set(n, 'previo');
      if (estado.asignados[n] !== undefined) return est.set(n, 'asignado');
      const a = estado.prefs[n]?.[0];
      if (!a) return est.set(n, 'pendiente');
      est.set(n, enConflicto(a) ? 'conflicto' : 'libre');
    });
    return { quedan, op1, op2, enConflicto, est };
  }, [estado, lista, previos]);

  const cuenta = (e: EstadoEst) => lista.filter((n) => calc.est.get(n) === e).length;

  /* ---------- acciones ---------- */
  const elegir = (id: number) => {
    if (!actual) return;
    setEstado((s) => {
      const [a, b] = s.prefs[actual] ?? [null, null];
      let nuevas: Opciones;
      if (a === id || b === id) nuevas = [a, b];
      else if (!a) nuevas = [id, b];
      else if (!b) nuevas = [a, id];
      else nuevas = [a, id]; // con las dos llenas, reemplaza la opción 2
      return { ...s, prefs: { ...s.prefs, [actual]: nuevas } };
    });
    setQReto('');
    buscarReto.current?.focus();
  };
  const quitar = (n: string, i: 0 | 1) =>
    setEstado((s) => {
      const p: Opciones = [...(s.prefs[n] ?? [null, null])] as Opciones;
      p[i] = null;
      if (i === 0 && p[1]) [p[0], p[1]] = [p[1], null]; // la opción 2 sube a 1
      return { ...s, prefs: { ...s.prefs, [n]: p } };
    });
  const intercambiar = (n: string) =>
    setEstado((s) => {
      const [a, b] = s.prefs[n] ?? [null, null];
      return { ...s, prefs: { ...s.prefs, [n]: [b, a] } };
    });
  const asignar = (n: string, id: number) => setEstado((s) => ({ ...s, asignados: { ...s.asignados, [n]: id } }));
  const desasignar = (n: string) =>
    setEstado((s) => {
      const a = { ...s.asignados };
      delete a[n];
      return { ...s, asignados: a };
    });
  const asignarSinConflicto = () =>
    setEstado((s) => {
      const a = { ...s.asignados };
      lista.forEach((n) => {
        const op = s.prefs[n]?.[0];
        if (calc.est.get(n) === 'libre' && op) a[n] = op;
      });
      return { ...s, asignados: a };
    });
  const siguiente = () => {
    const resto = lista.filter((n) => calc.est.get(n) === 'pendiente' && n !== actual);
    setActual(resto[0] ?? null);
    setQReto('');
  };
  const agregar = () => {
    const n = nuevo.trim().replace(/\s+/g, ' ');
    if (!n || lista.some((x) => sinTildes(x) === sinTildes(n))) return;
    setEstado((s) => ({ ...s, extras: [...s.extras, n] }));
    setActual(n);
    setNuevo('');
  };

  /* ---------- exportar ---------- */
  const descargar = (nombre: string, contenido: string, tipo: string) => {
    const url = URL.createObjectURL(new Blob([contenido], { type: tipo }));
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    a.click();
    URL.revokeObjectURL(url);
  };
  const exportarExcel = () => {
    const cel = (t: string) => `"${t.replace(/"/g, '""')}"`;
    const nombreReto = (id: number | null | undefined) => (id ? corto(retoPorId.get(id)!) : '');
    const filas = [['Estudiante', 'Estado', 'Opción 1', 'Opción 2', 'Reto asignado', 'Asesor del reto asignado']];
    lista.forEach((n) => {
      const [a, b] = estado.prefs[n] ?? [null, null];
      const final = previos.get(n) ?? estado.asignados[n] ?? null;
      filas.push([n, ROTULO[calc.est.get(n)!], nombreReto(a), nombreReto(b), nombreReto(final), final ? retoPorId.get(final)!.asesor : '']);
    });
    // punto y coma y BOM: así lo abre Excel en español con tildes
    descargar('seleccion-retos-2026-20.csv', '﻿' + filas.map((f) => f.map(cel).join(';')).join('\r\n'), 'text/csv;charset=utf-8');
  };
  const respaldo = () => descargar('seleccion-retos-2026-20.json', JSON.stringify(estado, null, 2), 'application/json');
  const cargar = (f: File) =>
    f.text().then((t) => {
      try {
        const e = JSON.parse(t);
        if (!e || typeof e.prefs !== 'object') throw new Error('formato');
        setEstado({ prefs: e.prefs, asignados: e.asignados ?? {}, extras: e.extras ?? [] });
      } catch {
        window.alert('Ese archivo no es un respaldo de esta página.');
      }
    });
  const borrar = () => {
    if (window.confirm('¿Borrar todas las opciones y asignaciones de esta sesión? Descargue antes un respaldo si lo necesita.')) setEstado(VACIO);
  };

  /* ---------- piezas ---------- */
  const Sello: React.FC<{ n: string }> = ({ n }) => {
    const e = calc.est.get(n)!;
    return <span className={`sel-estado sel-estado--${e}`}>{ROTULO[e]}</span>;
  };

  const RetoInfo: React.FC<{ id: number }> = ({ id }) => {
    const r = retoPorId.get(id)!;
    const q = calc.quedan.get(id) ?? 0;
    const d = calc.op1.get(id)?.length ?? 0;
    return (
      <span className="sel-reto-info">
        {r.asesor} · para {r.integrantes === 1 ? 'uno' : 'dos'} · quedan {q} · {d} {d === 1 ? 'lo pide' : 'lo piden'} de 1.ª
      </span>
    );
  };

  const estudiantesFiltrados = lista.filter((n) => !qEst || sinTildes(n).includes(sinTildes(qEst)));
  const retosFiltrados = retos202620.filter((r) => {
    if (!qReto) return true;
    const q = sinTildes(qReto);
    return String(r.id).startsWith(q) || sinTildes(`${r.titulo} ${r.asesor} ${r.coasesor ?? ''}`).includes(q);
  });

  const retosEnConflicto = retos202620.filter((r) => calc.enConflicto(r.id) && (calc.op1.get(r.id)?.length ?? 0) > 0);

  return (
    <CourseAccessGate course={course}>
      <div className="spdp-ds sel">
        <header className="sel-cabeza">
          <div className="sel-wrap">
            <Link to={`/classroom/${course.slug}/retos`} className="sp-volver">
              ← Explorador de retos
            </Link>
            <h1 className="sel-titulo">Selección de retos</h1>
            <p className="sel-nota">Solo para el profesor. Lo que registre se guarda en este navegador; exporte a Excel al terminar.</p>
            <div className="sel-cifras">
              <div><b>{lista.length}</b>Estudiantes</div>
              <div><b>{cuenta('previo') + cuenta('asignado')}</b>Con reto</div>
              <div><b>{cuenta('libre')}</b>Sin conflicto</div>
              <div className={cuenta('conflicto') ? 'sel-cifra--alerta' : ''}><b>{cuenta('conflicto')}</b>En conflicto</div>
              <div><b>{cuenta('pendiente')}</b>Sin registrar</div>
            </div>
          </div>
        </header>

        <nav className="sp-tabs" aria-label="Pasos">
          <div className="sel-wrap sp-tabs-inner" role="tablist">
            {(
              [
                ['registrar', '1 · Registrar opciones'],
                ['resolver', `2 · Resolver${cuenta('conflicto') ? ` (${retosEnConflicto.length})` : ''}`],
                ['retos', '3 · Por reto'],
              ] as [Vista, string][]
            ).map(([v, t]) => (
              <button key={v} type="button" role="tab" className="sp-tab" aria-selected={vista === v} onClick={() => setVista(v)}>
                {t}
              </button>
            ))}
          </div>
        </nav>

        <main className="sel-wrap sel-main">
          {/* ================= 1 · registrar ================= */}
          {vista === 'registrar' && (
            <div className="sel-registrar">
              <aside className="sel-col">
                <input className="sel-buscar" type="search" placeholder="Buscar estudiante…" value={qEst} onChange={(e) => setQEst(e.target.value)} />
                <ul className="sel-lista">
                  {estudiantesFiltrados.map((n) => {
                    const [a, b] = estado.prefs[n] ?? [null, null];
                    return (
                      <li key={n}>
                        <button type="button" className="sel-est" aria-current={actual === n} onClick={() => setActual(n)}>
                          <span className="sel-est-nombre">{n}</span>
                          <Sello n={n} />
                          {(a || b) && (
                            <span className="sel-est-ops">
                              {a ? `1: ${a}` : ''}
                              {b ? ` · 2: ${b}` : ''}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <div className="sel-agregar">
                  <input type="text" placeholder="Agregar estudiante que no está" value={nuevo} onChange={(e) => setNuevo(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && agregar()} />
                  <button type="button" className="sp-boton sp-boton--claro" onClick={agregar}>
                    Agregar
                  </button>
                </div>
              </aside>

              <section className="sel-col">
                {!actual ? (
                  <p className="sel-vacio">Escoja un estudiante de la lista para registrar sus dos opciones.</p>
                ) : (
                  <>
                    <div className="sel-ficha-est">
                      <h2 className="sel-h2">{actual}</h2>
                      <Sello n={actual} />
                    </div>
                    {previos.get(actual) ? (
                      <p className="sel-aviso">
                        Ya tenía reto antes de la sesión: <b>{corto(retoPorId.get(previos.get(actual)!)!)}</b>. No necesita registrar opciones.
                      </p>
                    ) : (
                      <>
                        {estado.asignados[actual] !== undefined && (
                          <p className="sel-aviso">
                            Asignado a <b>{corto(retoPorId.get(estado.asignados[actual])!)}</b>.{' '}
                            <button type="button" className="sp-link" onClick={() => desasignar(actual)}>
                              Quitar asignación
                            </button>
                          </p>
                        )}
                        <div className="sel-opciones">
                          {[0, 1].map((i) => {
                            const id = (estado.prefs[actual] ?? [null, null])[i];
                            return (
                              <div key={i} className={`sel-opcion${id ? ' sel-opcion--llena' : ''}`}>
                                <span className="sel-opcion-n">Opción {i + 1}</span>
                                {id ? (
                                  <>
                                    <span className="sel-opcion-reto">{corto(retoPorId.get(id)!)}</span>
                                    <RetoInfo id={id} />
                                    <button type="button" className="sp-link" onClick={() => quitar(actual, i as 0 | 1)}>
                                      Quitar
                                    </button>
                                  </>
                                ) : (
                                  <span className="sel-opcion-vacia">Toque un reto abajo</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className="sel-acciones">
                          <button type="button" className="sp-boton sp-boton--claro" onClick={() => intercambiar(actual)}>
                            Intercambiar 1 y 2
                          </button>
                          <button type="button" className="sp-boton sp-boton--acento" onClick={siguiente}>
                            Siguiente sin registrar →
                          </button>
                        </div>
                        <input
                          ref={buscarReto}
                          className="sel-buscar"
                          type="search"
                          placeholder="Buscar reto por número, título o asesor…"
                          value={qReto}
                          onChange={(e) => setQReto(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && retosFiltrados.length === 1 && elegir(retosFiltrados[0].id)}
                        />
                        <ul className="sel-retos">
                          {retosFiltrados.map((r) => {
                            const q = calc.quedan.get(r.id) ?? 0;
                            const [a, b] = estado.prefs[actual] ?? [null, null];
                            const marca = a === r.id ? '1' : b === r.id ? '2' : null;
                            return (
                              <li key={r.id}>
                                <button type="button" className={`sel-reto${q <= 0 ? ' sel-reto--lleno' : ''}${marca ? ' sel-reto--elegido' : ''}`} onClick={() => elegir(r.id)}>
                                  <span className="sel-reto-id">{marca ? `Opción ${marca}` : r.id}</span>
                                  <span className="sel-reto-titulo">{r.titulo}</span>
                                  {q <= 0 ? <span className="sel-reto-info">Sin cupos</span> : <RetoInfo id={r.id} />}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </>
                    )}
                  </>
                )}
              </section>
            </div>
          )}

          {/* ================= 2 · resolver ================= */}
          {vista === 'resolver' && (
            <div className="sel-resolver">
              <div className="sel-bloque">
                <h2 className="sel-h2">Sin conflicto ({cuenta('libre')})</h2>
                <p className="sel-nota-oscura">Su opción 1 tiene cupo para todos los que la pidieron. Se pueden asignar de una vez.</p>
                {cuenta('libre') > 0 && (
                  <button type="button" className="sp-boton sp-boton--acento" onClick={asignarSinConflicto}>
                    Asignar a los {cuenta('libre')} en su opción 1
                  </button>
                )}
                <ul className="sel-filas">
                  {lista
                    .filter((n) => calc.est.get(n) === 'libre')
                    .map((n) => (
                      <li key={n}>
                        <b>{n}</b> → {corto(retoPorId.get(estado.prefs[n]![0]!)!)}
                      </li>
                    ))}
                </ul>
              </div>

              <div className="sel-bloque">
                <h2 className="sel-h2">Conflictos para discutir ({retosEnConflicto.length})</h2>
                {retosEnConflicto.length === 0 && <p className="sel-nota-oscura">Ninguno por ahora.</p>}
                {retosEnConflicto.map((r) => {
                  const q = calc.quedan.get(r.id) ?? 0;
                  return (
                    <article key={r.id} className="sel-conflicto">
                      <header>
                        <span className="sel-reto-id">{r.id}</span>
                        <h3>{r.titulo}</h3>
                        <span className="sel-reto-info">
                          {r.asesor} · para {r.integrantes === 1 ? 'uno' : 'dos'} · {q <= 0 ? 'sin cupos' : `${q} ${q === 1 ? 'cupo' : 'cupos'}`} · lo piden {calc.op1.get(r.id)!.length}
                        </span>
                      </header>
                      <ul>
                        {calc.op1.get(r.id)!.map((n) => {
                          const b = estado.prefs[n]?.[1] ?? null;
                          const qb = b ? calc.quedan.get(b) ?? 0 : 0;
                          const db = b ? calc.op1.get(b)?.length ?? 0 : 0;
                          return (
                            <li key={n} className="sel-candidato">
                              <b>{n}</b>
                              <span className="sel-reto-info">
                                {b ? (
                                  <>
                                    Opción 2: {corto(retoPorId.get(b)!)}{' '}
                                    {qb <= 0 ? '(sin cupos)' : db === 0 ? `(quedan ${qb}, nadie más lo pide de 1.ª)` : `(quedan ${qb}, ${db} lo ${db === 1 ? 'pide' : 'piden'} de 1.ª)`}
                                  </>
                                ) : (
                                  'Sin opción 2'
                                )}
                              </span>
                              <span className="sel-botones">
                                {q > 0 && (
                                  <button type="button" className="sp-boton sp-boton--acento" onClick={() => asignar(n, r.id)}>
                                    Se queda aquí
                                  </button>
                                )}
                                {b && qb > 0 && (
                                  <button type="button" className="sp-boton sp-boton--claro" onClick={() => asignar(n, b)}>
                                    Pasa a su opción 2
                                  </button>
                                )}
                                <button
                                  type="button"
                                  className="sp-link"
                                  onClick={() => {
                                    setActual(n);
                                    setVista('registrar');
                                  }}
                                >
                                  Cambiar opciones
                                </button>
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </article>
                  );
                })}
              </div>

              <div className="sel-bloque">
                <h2 className="sel-h2">Con reto ({cuenta('previo') + cuenta('asignado')})</h2>
                <ul className="sel-filas">
                  {lista
                    .filter((n) => calc.est.get(n) === 'previo' || calc.est.get(n) === 'asignado')
                    .map((n) => {
                      const id = previos.get(n) ?? estado.asignados[n];
                      return (
                        <li key={n}>
                          <b>{n}</b> → {corto(retoPorId.get(id)!)}{' '}
                          {calc.est.get(n) === 'previo' ? (
                            <span className="sel-reto-info">(desde antes)</span>
                          ) : (
                            <button type="button" className="sp-link" onClick={() => desasignar(n)}>
                              Deshacer
                            </button>
                          )}
                        </li>
                      );
                    })}
                </ul>
              </div>

              {cuenta('pendiente') > 0 && (
                <div className="sel-bloque">
                  <h2 className="sel-h2">Sin registrar ({cuenta('pendiente')})</h2>
                  <p className="sel-nota-oscura">{lista.filter((n) => calc.est.get(n) === 'pendiente').join(' · ')}</p>
                </div>
              )}
            </div>
          )}

          {/* ================= 3 · por reto ================= */}
          {vista === 'retos' && (
            <div className="sel-tabla-wrap">
              <table className="sel-tabla">
                <thead>
                  <tr>
                    <th>Reto</th>
                    <th>Cupos</th>
                    <th>Asignados</th>
                    <th>Lo piden de 1.ª</th>
                    <th>De 2.ª</th>
                  </tr>
                </thead>
                <tbody>
                  {retos202620.map((r) => {
                    const pre = retosSeleccionados[r.id];
                    const ses = lista.filter((n) => estado.asignados[n] === r.id);
                    const q = calc.quedan.get(r.id) ?? 0;
                    const conflicto = calc.enConflicto(r.id) && (calc.op1.get(r.id)?.length ?? 0) > 0;
                    return (
                      <tr key={r.id} className={conflicto ? 'sel-fila--conflicto' : q <= 0 ? 'sel-fila--llena' : ''}>
                        <td>
                          <b>{r.id}</b> {r.titulo}
                          <span className="sel-reto-info">{r.asesor}</span>
                        </td>
                        <td>
                          {q} de {r.integrantes}
                        </td>
                        <td>
                          {pre && <span className="sel-reto-info">{pre.nombres.join(', ')}{pre.motivo === 'maestria' ? ' (maestría)' : ''}</span>}
                          {ses.join(', ')}
                        </td>
                        <td>{(calc.op1.get(r.id) ?? []).join(', ')}</td>
                        <td className="sel-tenue">{(calc.op2.get(r.id) ?? []).join(', ')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ================= exportar ================= */}
          <div className="sel-exportar">
            <button type="button" className="sp-boton" onClick={exportarExcel}>
              Exportar a Excel
            </button>
            <button type="button" className="sp-boton sp-boton--claro" onClick={respaldo}>
              Descargar respaldo
            </button>
            <button type="button" className="sp-boton sp-boton--claro" onClick={() => archivo.current?.click()}>
              Cargar respaldo
            </button>
            <input ref={archivo} type="file" accept="application/json,.json" hidden onChange={(e) => e.target.files?.[0] && cargar(e.target.files[0])} />
            <button type="button" className="sp-link" onClick={borrar}>
              Borrar todo
            </button>
          </div>
        </main>
      </div>
    </CourseAccessGate>
  );
};
