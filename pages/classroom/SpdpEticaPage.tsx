import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';
import { retos202620 } from '../../components/data/classroom/spdp-retos-2026-20';
import {
  ACUERDO_EMPRESA, ASENTIMIENTO, CICUA, COLECTA, CORREO_COMITE, FECHAS_2026_20, IAG, INSTRUMENTO,
  LISTA_CHEQUEO, MICROORGANISMOS, NIVEL_NOMBRE, NIVEL_REVISA, OBLIGATORIOS, PAGINA_COMITE, PLANTILLAS,
  PLATYPUS, PROTOTIPO, SALIDA_CAMPUS, type Documento, type Nivel, type Plantilla,
} from '../../components/data/classroom/spdp-etica-2026-20';
import '@fontsource/anton/400.css';
import '@fontsource/barlow/400.css';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow/700.css';
import '@fontsource/playfair-display/400.css';
import '../../components/classroom/spdp-theme.css';

/* ============================================================
   SpdpEticaPage — «Clasifique su reto», la herramienta de la sesión 06
   del SPDP 2026-20. Es el QR de la lámina 23 del deck.

   El equipo responde el diagrama de auto-clasificación de riesgo del
   Comité de Ética con su propio proyecto y obtiene tres cosas:
   1. su nivel de riesgo, con el porqué de cada respuesta que lo fijó;
   2. la lista exacta de documentos para Platypus, con las plantillas;
   3. el texto de partida para la sección 06 de la entrega final.

   Las reglas están en spdp-etica-2026-20.ts. Las respuestas se guardan
   en el navegador para que el equipo pueda volver.
   ============================================================ */

type SiNo = 'si' | 'no' | null;

interface Estado {
  reto: number | null;
  q1: SiNo; q1eco: SiNo;
  q11: SiNo; q12: SiNo; q13: SiNo; q14: SiNo; q15: SiNo;
  evalA: [boolean, boolean, boolean];
  q2: SiNo; evalB: [boolean, boolean, boolean];
  q3: SiNo;
  sujetos: 'personas' | 'animales' | 'ambos';
  menores: boolean; plantilla: Plantilla;
  empresa: boolean; salida: boolean; micro: boolean; colecta: boolean; prototipo: boolean; iag: boolean;
  r1: string; r2: string; r3: string;
}

const INICIAL: Estado = {
  reto: null, q1: null, q1eco: null, q11: null, q12: null, q13: null, q14: null, q15: null,
  evalA: [false, false, false], q2: null, evalB: [false, false, false], q3: null,
  sujetos: 'personas', menores: false, plantilla: 'encuestas',
  empresa: false, salida: false, micro: false, colecta: false, prototipo: false, iag: false,
  r1: '', r2: '', r3: '',
};

const CLAVE = 'spdp-etica-2026-20';
const cargar = (): Estado => {
  try {
    const g = localStorage.getItem(CLAVE);
    return g ? { ...INICIAL, ...JSON.parse(g) } : INICIAL;
  } catch { return INICIAL; }
};

const CRITERIOS = [
  '(a) El riesgo es improbable',
  '(b) El daño eventual es menor',
  '(c) Prevenirlo y mitigarlo es fácil y barato',
];

interface Motivo { nivel: Nivel; texto: string }

/** Aplica el diagrama con las reglas del Comité. Devuelve cada nivel que
    apareció en el camino; la clasificación es el mayor. */
const clasificar = (e: Estado): { motivos: Motivo[]; nivel: Nivel; completo: boolean } => {
  const m: Motivo[] = [];
  let completo = e.q1 !== null && e.q2 !== null && e.q3 !== null;
  const abc = (ev: [boolean, boolean, boolean]) => ev.every(Boolean);

  if (e.q1 === 'no') {
    if (e.q1eco === null) completo = false;
    if (e.q1eco === 'si') m.push({ nivel: 2, texto: 'No hay personas ni animales, pero el proyecto puede afectar comunidades o ecosistemas (pregunta 1, rama del no).' });
  }
  if (e.q1 === 'si') {
    const sub: SiNo[] = [e.q11, e.q12, e.q13, e.q14, e.q15];
    if (sub.some((s) => s === null)) completo = false;
    if (e.q12 === 'si') m.push({ nivel: 2, texto: 'Procedimientos invasivos, dispositivos nuevos o medicamentos (1.2).' });
    if (e.q14 === 'si') m.push({ nivel: 2, texto: 'Publicará datos sensibles de los participantes (1.4).' });
    const abcA = e.q11 === 'si' || e.q13 === 'si' || e.q15 === 'si';
    if (abcA) {
      const cuales = [e.q11 === 'si' && 'una variable fisiológica, psicológica o social (1.1)', e.q13 === 'si' && 'información de una comunidad vulnerable (1.3)', e.q15 === 'si' && 'un incentivo por participar (1.5)'].filter(Boolean).join('; ');
      m.push(abc(e.evalA)
        ? { nivel: 1, texto: `Interviene ${cuales}, y los tres criterios (a)(b)(c) se cumplen.` }
        : { nivel: 2, texto: `Interviene ${cuales}, y falla al menos un criterio de (a)(b)(c).` });
    }
    if (sub.every((s) => s === 'no')) m.push({ nivel: 1, texto: 'Trabaja con personas o animales y respondió no a 1.1–1.5: nunca es «sin riesgo».' });
  }
  if (e.q2 === 'si') {
    m.push(abc(e.evalB)
      ? { nivel: 1, texto: 'Si no salen los resultados hay pérdidas (pregunta 2), pero los tres criterios (a)(b)(c) se cumplen.' }
      : { nivel: 2, texto: 'Si no salen los resultados hay pérdidas (pregunta 2) y falla al menos un criterio de (a)(b)(c).' });
  }
  if (e.q3 === 'si') m.push({ nivel: 1, texto: 'Hay un conflicto de interés (pregunta 3). El Comité lo revisa.' });
  const nivel = (m.length ? Math.max(...m.map((x) => x.nivel)) : 0) as Nivel;
  if (!m.length && completo) m.push({ nivel: 0, texto: 'Respondió no a las preguntas 1, 2 y 3 y no afecta comunidades ni ecosistemas.' });
  return { motivos: m, nivel, completo };
};

const documentos = (e: Estado): { obligatorios: Documento[]; segunCaso: Documento[] } => {
  const personas = e.q1 === 'si' && (e.sujetos === 'personas' || e.sujetos === 'ambos');
  const animales = e.q1 === 'si' && (e.sujetos === 'animales' || e.sujetos === 'ambos');
  const obligatorios = OBLIGATORIOS.map((d) =>
    d.id === 'certificado' && e.q1 === 'si'
      ? { ...d, detalle: `${d.detalle} Como trabaja con ${personas && animales ? 'personas y animales' : personas ? 'personas' : 'animales'}, también el módulo correspondiente del curso.` }
      : d,
  );
  const s: Documento[] = [];
  if (personas || e.prototipo) {
    s.push(PLANTILLAS[e.plantilla], INSTRUMENTO, LISTA_CHEQUEO);
    if (e.menores) s.push(ASENTIMIENTO);
  }
  if (animales) s.push(CICUA);
  if (e.empresa) s.push(ACUERDO_EMPRESA);
  if (e.salida) s.push(SALIDA_CAMPUS);
  if (e.micro) s.push(MICROORGANISMOS);
  if (e.colecta) s.push(COLECTA);
  if (e.prototipo) s.push(PROTOTIPO);
  if (e.iag) s.push(IAG);
  return { obligatorios, segunCaso: s };
};

const textoSeccion06 = (e: Estado, nivel: Nivel, motivos: Motivo[], docs: Documento[]): string => {
  const reto = e.reto ? retos202620.find((r) => r.id === e.reto) : undefined;
  const cab = reto ? `Proyecto: ${reto.titulo} (reto ${reto.id}, asesor ${reto.asesor}${reto.coasesor ? `, coasesor ${reto.coasesor}` : ''}).\n\n` : '';
  const ref = [
    `¿A quién podría afectar? ${e.r1.trim() || '[complete]'}`,
    `¿Cómo? ${e.r2.trim() || '[complete]'}`,
    `¿Qué hacemos para evitarlo? ${e.r3.trim() || '[complete]'}`,
  ].join('\n');
  const por = motivos.map((m) => `- ${m.texto}`).join('\n');
  return `${cab}1. Reflexión sobre las implicaciones éticas\n${ref}\n\n2. Nivel de riesgo según el diagrama del Comité de Ética de la Facultad\n${NIVEL_NOMBRE[nivel]}.\n${por}\n\n3. Comité\n${NIVEL_REVISA[nivel].split('.')[0]}.\n\n4. Documentos enviados por Platypus\n${docs.map((d) => `- ${d.titulo}`).join('\n')}\n\n5. Certificado del curso de ética de la investigación: [adjunto]\n6. Constancia de envío a Platypus: [fecha de envío y captura o número de solicitud]`;
};

const IconoFlecha = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
);

const SiNoBotones: React.FC<{ valor: SiNo; onChange: (v: SiNo) => void }> = ({ valor, onChange }) => (
  <div className="sp-opciones sp-et-sino">
    <button type="button" className="sp-chip" aria-pressed={valor === 'si'} onClick={() => onChange('si')}>Sí</button>
    <button type="button" className="sp-chip" aria-pressed={valor === 'no'} onClick={() => onChange('no')}>No</button>
  </div>
);

const Pregunta: React.FC<{ num: string; texto: string; nota?: string; valor: SiNo; onChange: (v: SiNo) => void }> = ({ num, texto, nota, valor, onChange }) => (
  <div className="sp-et-pregunta">
    <span className="sp-et-num">{num}</span>
    <div>
      <p className="sp-et-texto">{texto}</p>
      {nota && <p className="sp-et-nota">{nota}</p>}
    </div>
    <SiNoBotones valor={valor} onChange={onChange} />
  </div>
);

const Criterios: React.FC<{ valor: [boolean, boolean, boolean]; onChange: (v: [boolean, boolean, boolean]) => void }> = ({ valor, onChange }) => (
  <div className="sp-et-criterios">
    <p className="sp-et-nota">Marque cada criterio que se cumple. Los tres: riesgo mínimo. Falla uno: mayor al mínimo.</p>
    {CRITERIOS.map((c, i) => (
      <label key={c} className="sp-et-check">
        <input type="checkbox" checked={valor[i]} onChange={(ev) => { const n = [...valor] as [boolean, boolean, boolean]; n[i] = ev.target.checked; onChange(n); }} />
        <span>{c}</span>
      </label>
    ))}
  </div>
);

const Marca: React.FC<{ texto: string; valor: boolean; onChange: (v: boolean) => void }> = ({ texto, valor, onChange }) => (
  <label className="sp-et-check"><input type="checkbox" checked={valor} onChange={(ev) => onChange(ev.target.checked)} /><span>{texto}</span></label>
);

const Doc: React.FC<{ d: Documento }> = ({ d }) => (
  <div className="sp-et-doc">
    <b>{d.titulo}</b>
    <span>{d.detalle}</span>
    {d.url && <a className="sp-link" href={d.url} target="_blank" rel="noopener noreferrer">{d.urlTexto ?? 'Descargar'}</a>}
  </div>
);

interface Props { course: Course }

export const SpdpEticaPage: React.FC<Props> = ({ course }) => {
  const [e, setE] = useState<Estado>(cargar);
  const [copiado, setCopiado] = useState(false);
  const set = <K extends keyof Estado>(k: K, v: Estado[K]) => setE((p) => ({ ...p, [k]: v }));

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => { try { localStorage.setItem(CLAVE, JSON.stringify(e)); } catch { /* sin almacenamiento */ } }, [e]);

  const { motivos, nivel, completo } = useMemo(() => clasificar(e), [e]);
  const docs = useMemo(() => documentos(e), [e]);
  const todos = [...docs.obligatorios, ...docs.segunCaso];
  const texto = useMemo(() => textoSeccion06(e, nivel, motivos, todos), [e, nivel, motivos, todos]);
  const retos = useMemo(() => [...retos202620].sort((a, b) => a.id - b.id), []);

  const copiar = async () => {
    try { await navigator.clipboard.writeText(texto); setCopiado(true); setTimeout(() => setCopiado(false), 2000); } catch { /* el usuario puede seleccionar */ }
  };

  return (
    <CourseAccessGate course={course}>
      <div className="spdp-ds">
        <header className="sp-hero sp-hero--corta">
          <div className="sp-wrap">
            <Link to={`/classroom/${course.slug}/readings`} className="sp-volver"><IconoFlecha /> Material del curso</Link>
            <span className="sp-kicker">IQYA 3050 · 2026-20 · Sesión 06 · Taller de ética</span>
            <div className="sp-marca" />
            <h1 className="sp-display">Clasifique su reto</h1>
            <p className="sp-hero-lead">
              Responda el diagrama del Comité de Ética con su propio proyecto. Al final obtiene su nivel de riesgo y por qué,
              la lista exacta de documentos con sus plantillas, y el texto de partida para la sección 06 de la entrega final.
            </p>
          </div>
        </header>

        <main className="sp-wrap sp-et">
          {/* ---------------- su reto ---------------- */}
          <section className="sp-et-bloque">
            <div className="sp-encabezado"><span className="sp-kicker">Antes de empezar</span><div className="sp-marca" /><h2 className="sp-h2">Su reto</h2></div>
            <select className="sp-select" value={e.reto ?? ''} onChange={(ev) => set('reto', ev.target.value ? Number(ev.target.value) : null)} aria-label="Su reto">
              <option value="">Elija su reto (opcional: solo encabeza el texto final)</option>
              {retos.map((r) => <option key={r.id} value={r.id}>{r.id} · {r.titulo} — {r.asesor}</option>)}
            </select>
          </section>

          {/* ---------------- paso 02: el diagrama ---------------- */}
          <section className="sp-et-bloque">
            <div className="sp-encabezado"><span className="sp-kicker">Paso 02 · el nivel de riesgo</span><div className="sp-marca" /><h2 className="sp-h2">Las tres preguntas del diagrama</h2></div>
            <p className="sp-et-intro">Siempre se responden las tres, y vale el nivel más alto que aparezca.</p>

            <Pregunta num="1" texto="¿Su proyecto involucrará investigación con animales o humanos?"
              nota="Entrevistas, encuestas, validación de prototipos con usuarios, toma de muestras y talleres focales cuentan como trabajo con personas."
              valor={e.q1} onChange={(v) => set('q1', v)} />

            {e.q1 === 'no' && (
              <Pregunta num="1·" texto="¿Su proyecto tiene el potencial de afectar a comunidades o ecosistemas?" nota="Si es sí, el nivel es mayor al mínimo." valor={e.q1eco} onChange={(v) => set('q1eco', v)} />
            )}

            {e.q1 === 'si' && (
              <div className="sp-et-sub">
                <div className="sp-et-pregunta sp-et-pregunta--sel">
                  <span className="sp-et-num">1·</span>
                  <p className="sp-et-texto">¿Con quién trabaja?</p>
                  <div className="sp-opciones">
                    {(['personas', 'animales', 'ambos'] as const).map((s) => (
                      <button key={s} type="button" className="sp-chip" aria-pressed={e.sujetos === s} onClick={() => set('sujetos', s)}>{s[0].toUpperCase() + s.slice(1)}</button>
                    ))}
                  </div>
                </div>
                <p className="sp-et-intro">Responda las cinco. Si todas son no, el proyecto queda en riesgo mínimo, no sin riesgo.</p>
                <Pregunta num="1.1" texto="¿Modifica, interviene o analiza una variable fisiológica, psicológica o social de los participantes?" nota="Si es sí: se evalúa con los criterios (a)(b)(c)." valor={e.q11} onChange={(v) => set('q11', v)} />
                <Pregunta num="1.2" texto="¿Realiza procedimientos invasivos o quirúrgicos, ensayos con dispositivos nuevos, medicamentos u otro ensayo con riesgo significativo?" nota="Si es sí: riesgo mayor al mínimo." valor={e.q12} onChange={(v) => set('q12', v)} />
                <Pregunta num="1.3" texto="¿Recoge información de una comunidad vulnerable (menores de edad, personas privadas de la libertad, personas con discapacidad)?" nota="Si es sí: se evalúa con los criterios (a)(b)(c)." valor={e.q13} onChange={(v) => set('q13', v)} />
                <Pregunta num="1.4" texto="¿Publicará algún dato sensible de los participantes, con un riesgo adicional a la incomodidad?" nota="Si es sí: riesgo mayor al mínimo." valor={e.q14} onChange={(v) => set('q14', v)} />
                <Pregunta num="1.5" texto="¿Ofrecerá a los participantes algún incentivo por participar?" nota="Si es sí: se evalúa con los criterios (a)(b)(c)." valor={e.q15} onChange={(v) => set('q15', v)} />
                {(e.q11 === 'si' || e.q13 === 'si' || e.q15 === 'si') && <Criterios valor={e.evalA} onChange={(v) => set('evalA', v)} />}
              </div>
            )}

            <Pregunta num="2" texto="Si su investigación no llega a los resultados esperados, ¿podría haber pérdida de fondos, pérdida del tiempo o la buena voluntad de los participantes, o daños a la reputación suya o de la Universidad?"
              nota="Los daños de reputación vienen de resultados de baja calidad. Si es sí: se evalúa con los criterios (a)(b)(c)."
              valor={e.q2} onChange={(v) => set('q2', v)} />
            {e.q2 === 'si' && <Criterios valor={e.evalB} onChange={(v) => set('evalB', v)} />}

            <Pregunta num="3" texto="¿Existe algún conflicto de interés?"
              nota="Un interés secundario, monetario o sentimental, que pesa sobre el juicio profesional. Si es sí: riesgo mínimo, y el Comité lo revisa."
              valor={e.q3} onChange={(v) => set('q3', v)} />
          </section>

          {/* ---------------- resultado ---------------- */}
          <section className="sp-et-bloque">
            <div className={`sp-et-resultado sp-et-resultado--${completo ? nivel : 'x'}`}>
              <span className="sp-kicker">{completo ? 'Su clasificación' : 'Faltan respuestas'}</span>
              <h2 className="sp-et-nivel">{completo ? NIVEL_NOMBRE[nivel] : 'Responda las tres preguntas'}</h2>
              {completo && <p className="sp-et-revisa">{NIVEL_REVISA[nivel]}</p>}
              {motivos.length > 0 && (
                <ul className="sp-et-motivos">{motivos.map((m) => <li key={m.texto}><span className={`sp-et-pastilla sp-et-pastilla--${m.nivel}`}>{NIVEL_NOMBRE[m.nivel]}</span>{m.texto}</li>)}</ul>
              )}
            </div>
          </section>

          {/* ---------------- paso 03: documentos ---------------- */}
          <section className="sp-et-bloque">
            <div className="sp-encabezado"><span className="sp-kicker">Paso 03 · los documentos</span><div className="sp-marca" /><h2 className="sp-h2">Lo que lleva su solicitud</h2></div>
            <p className="sp-et-intro">Tres van siempre. Marque lo que aplica a su proyecto y la lista se completa.</p>
            <div className="sp-et-marcas">
              {e.q1 === 'si' && (e.sujetos !== 'animales') && (
                <>
                  <Marca texto="Hay menores de 18 años entre los participantes" valor={e.menores} onChange={(v) => set('menores', v)} />
                  <label className="sp-et-check sp-et-check--select"><span>Instrumento con personas</span>
                    <select className="sp-select" value={e.plantilla} onChange={(ev) => set('plantilla', ev.target.value as Plantilla)} aria-label="Plantilla de consentimiento">
                      <option value="encuestas">Encuestas y entrevistas</option>
                      <option value="alimentos">Pruebas sensoriales o de producto (alimentos)</option>
                      <option value="pantallas">Videojuegos, pantallas, realidad virtual</option>
                      <option value="biomedico">Experimentos biomédicos</option>
                    </select>
                  </label>
                </>
              )}
              <Marca texto="Comparte información con una empresa o entidad aliada" valor={e.empresa} onChange={(v) => set('empresa', v)} />
              <Marca texto="Valida un prototipo con usuarios" valor={e.prototipo} onChange={(v) => set('prototipo', v)} />
              <Marca texto="Sale del campus para tomar datos" valor={e.salida} onChange={(v) => set('salida', v)} />
              <Marca texto="Trabaja con microorganismos o patógenos" valor={e.micro} onChange={(v) => set('micro', v)} />
              <Marca texto="Recolecta plantas o animales" valor={e.colecta} onChange={(v) => set('colecta', v)} />
              <Marca texto="Usa IA generativa en alguna etapa del proyecto" valor={e.iag} onChange={(v) => set('iag', v)} />
            </div>
            <h3 className="sp-et-h3">Van siempre</h3>
            <div className="sp-et-docs">{docs.obligatorios.map((d) => <Doc key={d.id} d={d} />)}</div>
            {docs.segunCaso.length > 0 && (
              <>
                <h3 className="sp-et-h3">Por su caso</h3>
                <div className="sp-et-docs">{docs.segunCaso.map((d) => <Doc key={d.id} d={d} />)}</div>
              </>
            )}
          </section>

          {/* ---------------- paso 01: la reflexión + sección 06 ---------------- */}
          <section className="sp-et-bloque">
            <div className="sp-encabezado"><span className="sp-kicker">Paso 01 · la reflexión, para la sección 06</span><div className="sp-marca" /><h2 className="sp-h2">Tres preguntas, un párrafo</h2></div>
            <p className="sp-et-intro">Escriba una o dos frases por pregunta. Es lo que va en la sección 06 del formato de entrega final.</p>
            <div className="sp-et-reflexion">
              <label><span className="sp-et-num">01</span><span>¿A quién podría afectar?</span><textarea value={e.r1} onChange={(ev) => set('r1', ev.target.value)} rows={2} placeholder="Los panelistas aplican cremas comerciales en la piel." /></label>
              <label><span className="sp-et-num">02</span><span>¿Cómo?</span><textarea value={e.r2} onChange={(ev) => set('r2', ev.target.value)} rows={2} placeholder="Una persona alérgica a un componente podría tener una reacción." /></label>
              <label><span className="sp-et-num">03</span><span>¿Qué hace para evitarlo?</span><textarea value={e.r3} onChange={(ev) => set('r3', ev.target.value)} rows={3} placeholder="Se pregunta por alergias antes, se aplica en una zona pequeña del antebrazo y la persona puede detenerse cuando quiera." /></label>
            </div>
            <h3 className="sp-et-h3">Texto de partida para la sección 06</h3>
            <textarea className="sp-et-salida" readOnly value={texto} rows={18} aria-label="Texto para la sección 06" />
            <div className="sp-acciones">
              <button type="button" className="sp-boton sp-boton--acento" onClick={copiar}>{copiado ? 'Copiado' : 'Copiar el texto'}</button>
              <button type="button" className="sp-boton sp-boton--claro" onClick={() => setE(INICIAL)}>Empezar de nuevo</button>
            </div>
          </section>

          {/* ---------------- paso 04: Platypus y fechas ---------------- */}
          <section className="sp-et-bloque">
            <div className="sp-encabezado"><span className="sp-kicker">Paso 04 · Platypus</span><div className="sp-marca" /><h2 className="sp-h2">Dónde se envía y cuándo</h2></div>
            <div className="sp-et-fechas">
              {FECHAS_2026_20.map((f) => <div key={f.fecha} className={f.fecha.startsWith('Mié') ? 'sp-et-fecha sp-et-fecha--curso' : 'sp-et-fecha'}><b>{f.fecha}</b><span>{f.que}</span></div>)}
            </div>
            <div className="sp-aviso"><span className="sp-aviso-etiqueta">Sin avales retroactivos</span><p>El Comité no avala datos ya tomados y un proyecto puede pasar más de una vez. Si falta información, la solicitud vuelve: mejor enviarla completa.</p></div>
            <div className="sp-acciones">
              <a className="sp-boton sp-boton--acento" href={PLATYPUS} target="_blank" rel="noopener noreferrer">Ir a Platypus</a>
              <a className="sp-boton sp-boton--claro" href={PAGINA_COMITE} target="_blank" rel="noopener noreferrer">Página del Comité</a>
              <a className="sp-boton sp-boton--claro" href={`mailto:${CORREO_COMITE}`}>{CORREO_COMITE}</a>
            </div>
            <p className="sp-et-fuente">Diagrama de auto-clasificación de riesgo y documentos del Comité de Ética de la Facultad de Ingeniería, página consultada el 6 de octubre de 2026 · reglas de aplicación confirmadas por el Comité el 7 de octubre de 2026.</p>
          </section>
        </main>
      </div>
    </CourseAccessGate>
  );
};
