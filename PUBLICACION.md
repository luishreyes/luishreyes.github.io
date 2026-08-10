# Publicación manual del material (`manualRelease`)

Sistema con el que el **equipo docente decide, semana a semana y con un botón
ON/OFF, qué material ve el estudiantado**. Sustituye a la entrega gradual por
fechas (`gradualRelease`) en los cursos donde la sincronización automática no
sirve. Hoy lo usa POU 2026-20 (`iqya-2031-2026-20`).

## Cómo funciona

El portafolio es un sitio estático sin backend, así que el estado de
publicación vive **en el propio repositorio**:

```
published/{slug}.json      ← p. ej. published/iqya-2031-2026-20.json
{
  "weeks": [1, 2]          ← semanas visibles para los estudiantes
}
```

- **Lectura (todos):** la app lee ese JSON de `raw.githubusercontent.com`
  (el repo es público) con un cache-buster por minuto: un cambio se propaga a
  los estudiantes en ~1 minuto, sin esperar ningún deploy. La última lectura
  buena se guarda en `localStorage` (`classroom:published:{slug}`) como
  respaldo si la red falla; si nunca se ha podido leer nada, se **falla
  cerrado** (solo se ve el material transversal).
- **Escritura (equipo docente):** el botón Publicada/Oculta hace un commit a
  `main` sobre ese JSON usando la API de contenidos de GitHub con un
  fine-grained token. El workflow de deploy tiene `paths-ignore: published/**`,
  de modo que esos commits **no** reconstruyen el sitio.
- **Módulos:** `components/classroom/publishState.ts` (lectura/escritura del
  JSON, token) y `components/classroom/courseRelease.ts` (hook
  `useCourseRelease`, que en modo manual responde `isWeekOpen` con el JSON en
  vez de con fechas).

Reglas que se conservan del sistema gradual:

- El material **sin `week`** (programa, cronograma, guías transversales) está
  siempre disponible.
- Quien entra con `staffAccessCode` ve el semestre completo; además, **solo en
  esa vista** aparecen los botones Publicada/Oculta (en la página de Material,
  uno por hoja de semana). La vista de estudiante no tiene botones: solo ve lo
  publicado.
- Es una **capa de presentación, no de seguridad**: los HTML de `public/`
  siguen siendo estáticos y quien conozca la URL exacta puede abrirlos.

## Configurar un curso

En `components/data/classroom/{slug}.ts`:

```ts
staffAccessCode: '…',
manualRelease: true,   // reemplaza a gradualRelease / releaseLeadDays
```

Y crear la semilla `published/{slug}.json` con las semanas que ya deben estar
abiertas (para que nadie pierda acceso al activar el modo).

## Configurar el token (una vez por navegador del equipo docente)

1. En GitHub: **Settings → Developer settings → Personal access tokens →
   Fine-grained tokens → Generate new token**
   (https://github.com/settings/personal-access-tokens/new).
2. **Repository access:** *Only select repositories* →
   `luishreyes/luishreyes.github.io`.
3. **Permissions → Repository permissions → Contents: Read and write.** Nada
   más.
4. Expiración: lo que dure el semestre.
5. Entrar al Material del curso con el código del equipo docente y pegar el
   token en el panel «Publicación manual» del encabezado. Queda en
   `localStorage` (`classroom:publishToken`) de ese navegador.

⚠️ El token permite escribir **cualquier archivo del repositorio** (la API no
se puede acotar a un solo archivo). Compartirlo solo con el equipo docente, y
revocarlo en GitHub al terminar el semestre o si se filtra.

## Uso diario

- Entrar con `staffAccessCode` → Material del curso → botón **Publicada /
  Oculta** en la cabecera de cada semana. El cambio queda como un commit
  (`Classroom {slug}: semana N publicada`) y los estudiantes lo ven en ~1
  minuto (afecta Material, visor de documentos, índices de presentaciones y
  simulaciones, y los conteos del landing).
- Si dos personas publican a la vez, la escritura se reintenta sola sobre el
  estado fresco.
- Sin token guardado, los botones avisan que falta configurarlo; el panel del
  encabezado lo pide.
