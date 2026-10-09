import React from 'react';
import type { ReleaseInfo } from './courseRelease';
import { getPublishToken, itemKey, savePublishToken, type PublishKind } from './publishState';

// Controles de la publicación manual de POU (equipo docente), compartidos por
// «Material del curso» y «Simuladores»: el token de GitHub se pega una sola vez
// y queda en este navegador; con él cada botón escribe el cambio en el
// repositorio para que lo vean todos los estudiantes. Ver PUBLICACION.md.

export interface PublishControls {
  /** Hay token guardado en este navegador. */
  hasToken: boolean;
  /** Qué se está guardando ahora mismo: la llave de una actividad o una marca propia. */
  guardando: string | null;
  /** Publica u oculta varias actividades en un solo commit. */
  alternar: (changes: Array<{ key: string; on: boolean }>, message: string, marca: string) => Promise<void>;
  /** Botón Publicada/Oculta de una actividad, o `null` fuera de la vista docente de un curso manual. */
  boton: (kind: PublishKind, id: string, titulo: string) => React.ReactNode;
  /** Panel bajo el hero: token y errores. `null` fuera de la vista docente de un curso manual. */
  panel: React.ReactNode;
}

export const usePublishControls = (
  release: Pick<ReleaseInfo, 'isStaff' | 'manual' | 'publishedItems' | 'setItemsPublished'>,
  /** Frase que la página agrega a la explicación del panel (p. ej. el botón de la semana). */
  nota?: string,
): PublishControls => {
  const { isStaff, manual, publishedItems, setItemsPublished } = release;
  const [pubToken, setPubToken] = React.useState<string | null>(() => getPublishToken());
  const [tokenDraft, setTokenDraft] = React.useState('');
  const [pubError, setPubError] = React.useState<string | null>(null);
  const [guardando, setGuardando] = React.useState<string | null>(null);

  const guardarToken = (e: React.FormEvent) => {
    e.preventDefault();
    const t = tokenDraft.trim();
    if (!t) return;
    savePublishToken(t);
    setPubToken(t);
    setTokenDraft('');
    setPubError(null);
  };

  const olvidarToken = () => {
    savePublishToken(null);
    setPubToken(null);
  };

  const alternar = async (changes: Array<{ key: string; on: boolean }>, message: string, marca: string) => {
    if (!pubToken) {
      setPubError('Antes de publicar, configure el token del equipo docente (arriba).');
      return;
    }
    if (changes.length === 0) return;
    setGuardando(marca);
    setPubError(null);
    try {
      await setItemsPublished(changes, pubToken, message);
    } catch (err) {
      setPubError(err instanceof Error ? err.message : 'No se pudo guardar el cambio.');
    } finally {
      setGuardando(null);
    }
  };

  const activo = isStaff && manual;

  // Vive junto al enlace de la actividad (nunca adentro, para no anidar controles).
  const boton = (kind: PublishKind, id: string, titulo: string): React.ReactNode => {
    if (!activo) return null;
    const k = itemKey(kind, id);
    const on = publishedItems?.has(k) ?? false;
    return (
      <button
        type="button"
        className={`pou-pub-toggle sm${on ? ' on' : ''}`}
        disabled={guardando !== null}
        aria-pressed={on}
        title={
          on
            ? 'Los estudiantes ven esta actividad. Clic para ocultarla.'
            : 'Los estudiantes no ven esta actividad. Clic para publicarla.'
        }
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void alternar([{ key: k, on: !on }], `${on ? 'oculta' : 'publica'} «${titulo}»`, k);
        }}
      >
        {guardando === k ? 'Guardando…' : on ? 'Publicada' : 'Oculta'}
      </button>
    );
  };

  const panel = activo ? (
    <div className="pou-pub-panel">
      {pubToken ? (
        <p>
          Publicación manual activa: cada actividad tiene su botón <strong>Publicada / Oculta</strong>.
          {nota ? ` ${nota}` : ''} Los estudiantes ven el cambio en cosa de un minuto.{' '}
          <button type="button" onClick={olvidarToken}>
            Cambiar token
          </button>
        </p>
      ) : (
        <>
          <p>
            Para publicar u ocultar desde aquí se necesita un{' '}
            <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener noreferrer">
              fine-grained token de GitHub ↗
            </a>{' '}
            con acceso solo a <code>luishreyes.github.io</code> y permiso «Contents · Read and write». Se pega una
            sola vez y queda guardado en este navegador.
          </p>
          <form onSubmit={guardarToken}>
            <input
              type="password"
              autoComplete="off"
              spellCheck={false}
              placeholder="github_pat_…"
              value={tokenDraft}
              onChange={(e) => setTokenDraft(e.target.value)}
              aria-label="Token de publicación"
            />
            <button type="submit">Guardar</button>
          </form>
        </>
      )}
      {pubError && <p className="err">{pubError}</p>}
    </div>
  ) : null;

  return { hasToken: !!pubToken, guardando, alternar, boton, panel };
};
