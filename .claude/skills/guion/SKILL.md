---
name: guion
description: Genera un guión detallado para leer en voz alta en clase a partir de una presentación HTML del Classroom (decks deck-stage de edu-pro o cualquier deck de public/classroom). Se invoca con /guion. Úsalo cuando el usuario pida un "guión", "script de clase", "qué decir en cada diapositiva", "libreto" o "narración para leer tal cual" de una presentación. Produce un documento en español, redactado para leerse literalmente, con tiempos por diapositiva que suman la duración de la sesión.
---

# /guion — Guión de clase para leer en voz alta

Genera un **guión completo y literal** (libreto) para dictar una presentación del Classroom. El profesor debe poder **leerlo tal cual, sin improvisar ni suponer nada**.

## 1. Determinar el deck y la duración

1. **Deck objetivo.** Tómalo de los argumentos (`$ARGUMENTS`): puede ser el nombre del archivo (`modelos-m1s2-aprendizaje.html`), el slug/título, o una ruta.
   - Busca primero en `public/classroom/edu-pro/slides/`, luego en `public/classroom/*/slides/`.
   - Si no se especifica ninguno, **pregunta** al usuario cuál deck, listando los `.html` disponibles en `public/classroom/edu-pro/slides/`. No adivines.
2. **Duración.** Si los argumentos traen una duración (`1.5h`, `90 min`, `2 horas`), úsala. Si no, búscala en los datos del curso (`components/data/classroom/{slug}.ts` → `sessions[].time`/`hours` o `presentations[]`). Si no la encuentras, **usa 1.5 h (90 min) por defecto** y dilo explícitamente.

## 2. Leer TODO el deck

- Lee el archivo HTML completo (usa varias páginas si es largo — **no** te quedes con la primera).
- Extrae, en orden, **todas** las `<section>`: `data-label`, kickers, `h1`/`h2`, párrafos, listas, callouts, banners, pasos, tablas, y **todos** los paneles de los componentes interactivos `reveal`/`tabs` (cada `.rv-panel`, cada pestaña) — porque en clase se hace clic en cada uno.
- Principio inquebrantable: **no resumas ni recortes**. Todo el contenido del deck debe quedar cubierto en el guión.

## 3. Presupuesto de tiempo

- Reparte los minutos de la sesión entre las diapositivas de forma proporcional al peso del contenido:
  - Portada, divisores de sección, big-quote y cierre: **cortas** (~0.5–1 min).
  - Diapositivas de contenido: 2–4 min según densidad.
  - Diapositivas interactivas (`reveal`): tiempo suficiente para narrar **cada** panel.
  - Ejercicios participativos: reservar su bloque completo (trabajo individual + puesta en común).
- La suma de todos los tiempos debe **igualar la duración total**. Ajusta hasta cuadrar.
- Muestra para cada diapositiva `[⏱ M:SS–M:SS · N min]` (rango dentro de la sesión) y un reloj acumulado.

## 4. Redacción del guión (lo esencial)

Para **cada** diapositiva, en orden, produce un bloque con:

1. **Encabezado:** número de diapositiva, título y el marcador de tiempo.
2. **Acotaciones entre corchetes** para la acción física: `[Al pasar a la diapositiva]`, `[Haz clic en «Categorizar»]`, `[Espera respuestas del grupo]`, `[Pausa]`.
3. **Texto para leer en voz alta**, redactado en **primera persona del presentador**, en párrafos completos y naturales —no en viñetas—, listo para leerse literalmente. Nada de «explique que…»; escribe la frase exacta que se dice.
4. En diapositivas interactivas, una acotación de clic **antes** de narrar cada panel, y el texto hablado de ese panel.
5. Preguntas al público **escritas completas**, con una posible reformulación breve por si hay silencio.
6. Una **frase de transición** al final que enlace con la diapositiva siguiente.

### Estilo
- Español de Colombia, **tildes correctas** siempre (á, é, í, ó, ú, ñ, ü). Nunca español sin acentos.
- Trato de **«ustedes»** (formal), salvo que el curso indique otra cosa. Adapta ejemplos al público del curso (p. ej. CGR → sector público, auditoría, control fiscal).
- Tono cálido, claro y profesional; frases habladas, no académicas de lectura.
- Cuando el deck nombre una herramienta (ChatGPT, Claude, AlphaGo, etc.), menciónala al hablar tal como aparece.
- Incluye al inicio una **nota de uso** (cómo leerlo, qué son los corchetes) y un **resumen de tiempos** en tabla.

## 5. Entrega

1. Escribe el guión en `guiones/{nombre-del-deck}-guion.md` (crea la carpeta `guiones/` en la raíz del repo si no existe; queda fuera de `public/`, así que no se despliega).
2. Envíalo al usuario con `SendUserFile`.
3. En el chat, resume: deck, duración, número de diapositivas cubiertas y el reparto de tiempos por sección. No pegues el guión completo en el chat.
4. **No** hagas commit ni push salvo que el usuario lo pida.

## 6. Verificación antes de entregar

- ¿Están **todas** las diapositivas del deck (mismo número que `<section>` en el HTML)?
- ¿Se narró **cada** panel de los componentes interactivos?
- ¿La suma de tiempos **iguala** la duración pedida?
- ¿Todo el texto hablado se puede leer literalmente, sin frases del tipo «explique que…»?
- ¿Tildes correctas en todo el documento?
