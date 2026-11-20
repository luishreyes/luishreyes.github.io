---
name: fable-director
description: Convierte a Claude Fable en director en Claude Code. Fable planea, reparte, juzga e integra, y subagentes más baratos (Haiku, Sonnet, Opus) leen, buscan, implementan y verifican. Úsela en sesiones Fable ante trabajo con mucho volumen de lectura o escritura, como barridos de código, triage de logs, revisión de documentos, investigación web, implementaciones en varias partes o pruebas. También cuando el usuario escriba /fable-director o pida delegar, usar subagentes o ahorrar tokens.
---

# Fable como director

Usted pone el juicio y los subagentes ponen los tokens. Los tokens de salida son los más caros, así que usted lee resúmenes y decide, y los subagentes escriben.

## 0. Verifique su modelo

- Si es Fable, aplique esta skill.
- Si es Opus, aplíquela delegando solo a Sonnet y Haiku.
- Si es Sonnet o Haiku, avise en una línea que la skill no rinde aquí y trabaje normal.

## 1. Delegar o no

Delegue cuando el trabajo es obligatorio, voluminoso y un modelo menor lo puede hacer con un buen brief.

No delegue lecturas cortas (1 a 3 archivos), respuestas que ya conoce, juicio sobre material crudo que usted debe ver, decisiones de arquitectura o producto, la síntesis final, ni cuando el usuario pida que lo haga usted.

Alarma: si en una tarea grande lleva 4 llamadas seguidas a herramientas sin delegar, pare y reconsidere. Si decide no delegar algo grande, diga por qué en una frase.

## 2. Equipo

Fije siempre `model` en cada llamada al Agent tool. Un subagente sin modelo hereda Fable y se pierde el ahorro.

| Rol | subagent_type | model | Para qué |
|---|---|---|---|
| scout | Explore | haiku | Barridos mecánicos: listar archivos, grep, inventarios |
| investigador | Explore o general-purpose | sonnet | Trazar código, leer logs, documentos o web cuando un faltante saldría caro (Haiku omite cosas sin avisar) |
| ejecutor | general-purpose | sonnet | Implementar lo ya diseñado, escribir pruebas, ediciones rutinarias |
| arquitecto | general-purpose | opus | Depuración profunda, cambios riesgosos (auth, pagos, migraciones, datos), revisar a los ejecutores |
| verificador | general-purpose | sonnet (haiku si solo corre comandos) | Correr pruebas, lint y typecheck, comparar el diff con el plan. Reporta pasa o falla y no corrige |

## 3. El brief

Cada subagente arranca sin su contexto. Escriba un brief autocontenido con:

- **Objetivo**: una pregunta o un entregable.
- **Alcance**: archivos, rutas o fuentes, y qué queda por fuera.
- **Restricciones**: patrones a seguir y qué no tocar.
- **Terminado**: en código, el comando de verificación y su salida real. En lectura, la forma del reporte con tope, por ejemplo: "máximo 300 palabras, evidencia como ruta:línea, separe hechos de suposiciones".
- **Lista de no**: no opinar sobre diseño, no editar fuera del alcance, no inventar ("no encontrado" es una respuesta válida).

Si hay cambios sin commit, agregue: "No ejecute git stash, git reset, git checkout -- ni git clean. Si necesita un árbol limpio, pare y avise."

## 4. Reparto

- Verifique las premisas antes de repartir (por ejemplo, que la lista de servicios que va a revisar exista de verdad).
- Pocos briefs grandes, uno por eje independiente, no uno por archivo.
- Los independientes van en paralelo, con varias llamadas en un solo mensaje.
- Si dos ediciones tocan los mismos archivos, van en secuencia o con un solo ejecutor.
- Los subagentes no lanzan subagentes.

## 5. Juzgar e integrar

- Lea el reporte sin rehacer el trabajo. Compruebe usted mismo solo las afirmaciones sorprendentes o las que sostienen una decisión.
- Todo cambio con peso pasa por un verificador que no vio la implementación. Los cambios riesgosos pasan además por el arquitecto.
- Si un subagente falla, reintente una vez con uno nuevo y el mismo brief. Si falla otra vez, reescriba el brief más acotado o con más contexto. No lo arregle usted salvo que sea pequeño.
- Cierre con su síntesis: qué se hizo, qué se verificó y con qué evidencia, qué queda abierto.

## Ejemplo

"¿Por qué falla el login en staging?"
1. En paralelo: scout (haiku) hace inventario de archivos de auth y configuración; investigador (sonnet) resume los logs de la última hora en máximo 200 palabras.
2. Usted decide la hipótesis.
3. Ejecutor (sonnet) aplica el arreglo con una prueba que lo demuestre.
4. Verificador (sonnet) corre la suite y compara el diff con el plan.
5. Usted integra y reporta.
