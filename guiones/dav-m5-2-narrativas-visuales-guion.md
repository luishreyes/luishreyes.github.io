# Guión de clase — M5.2 · Narrativas visuales con IA

**Curso:** Dominando la IA: Google Workspace y Gemini · Davivienda Cúcuta
**Sesión:** Módulo 5, sesión 2 de 2 · Jueves 6 de agosto de 2026 · 6:30 – 8:30 pm
**Modalidad:** Virtual · 11 participantes
**Duración total:** 120 minutos (16 diapositivas + taller de 45 minutos)

---

## Nota de uso

Este documento está escrito para **leerse en voz alta tal cual**. El texto en párrafos normales es lo que usted dice. Todo lo que aparece **[entre corchetes y en cursiva]** es una acotación: una acción, un clic, una pausa o una indicación de lo que debe hacer, y no se lee.

Las preguntas al grupo vienen escritas completas, con una reformulación breve por si nadie responde. Al final de cada diapositiva hay una frase de transición que enlaza con la siguiente.

**Antes de empezar:** tenga abierta una pestaña con Gemini y las cinco imágenes descargadas en el escritorio. Tres diapositivas de esta sesión son demostraciones en vivo.

---

## Resumen de tiempos

| # | Diapositiva | Tiempo | Acumulado |
|---|---|---|---|
| 1 | Portada | 1 min | 0:00 – 1:00 |
| 2 | La sesión pasada: texto → imagen | 4 min | 1:00 – 5:00 |
| 3 | Divisor · La IA que ve | 0:30 | 5:00 – 5:30 |
| 4 | Qué puede hacer con una imagen | 5 min | 5:30 – 10:30 |
| 5 | Anatomía del prompt visual | 5 min | 10:30 – 15:30 |
| 6 | **Demo 1 · Documento escaneado** | 9 min | 15:30 – 24:30 |
| 7 | **Demo 2 · Interpretar un gráfico** | 9 min | 24:30 – 33:30 |
| 8 | **Límites · el gráfico trampa** | 9 min | 33:30 – 42:30 |
| 9 | Divisor · De ver a contar | 0:30 | 42:30 – 43:00 |
| 10 | Qué es una narrativa visual | 4 min | 43:00 – 47:00 |
| 11 | La estructura de tres momentos | 5 min | 47:00 – 52:00 |
| 12 | El caso completo en tres momentos | 5 min | 52:00 – 57:00 |
| 13 | Pedirle la estructura a la IA | 5 min | 57:00 – 62:00 |
| 14 | Estilo base e inglés | 5 min | 62:00 – 67:00 |
| 15 | **Taller** (3 min de instrucciones + 45 de trabajo) | 48 min | 67:00 – 115:00 |
| 16 | Cierre | 5 min | 115:00 – 120:00 |

**Bloque 1 (la IA que ve):** 37 minutos · **Bloque 2 (de ver a contar):** 24 minutos · **Taller y cierre:** 53 minutos.

---

# 1 · Portada
### [⏱ 0:00 – 1:00 · 1 min]

*[Al abrir la presentación. Espere a que todos estén conectados.]*

Muy buenas noches a todos. Bienvenidos a la segunda sesión del módulo cinco, y con esta cerramos el bloque de contenido multimodal.

El martes hicimos que la inteligencia artificial creara imágenes. Hoy vamos a hacer exactamente lo contrario, y les adelanto que esta sesión es bastante más aplicable a lo que ustedes hacen todos los días.

Vamos a trabajar dos horas, y la última hora es taller: ustedes trabajando en Gemini con un caso real. Así que tengan Gemini abierto desde ya.

*[Transición]* Empecemos por recordar dónde quedamos.

---

# 2 · La sesión pasada: texto → imagen
### [⏱ 1:00 – 5:00 · 4 min]

*[Al pasar a la diapositiva]*

El martes vimos cómo los modelos de difusión generan imágenes a partir de texto. Trabajamos el vocabulario para controlarlas: el encuadre, la luz, el lente, la estética. Aprendimos que la calidad de la imagen depende casi por completo de la calidad de la descripción.

Íbamos en una sola dirección: de texto a imagen. Partíamos de la nada y creábamos algo que no existía.

*[Señale la columna derecha de la diapositiva]*

Hoy damos la vuelta completa. Los mismos modelos que generan imágenes también pueden **verlas** e interpretarlas. De imagen a texto.

Y quiero que noten por qué esto importa mucho más para su trabajo. Crear una imagen bonita es entretenido, pero honestamente no es lo que ustedes necesitan un martes a las diez de la mañana. En cambio, leer un documento escaneado, entender un gráfico que les llegó sin explicación, extraer las cifras de un estado financiero que alguien les mandó en PDF… eso sí es el día a día.

*[Pregunta al grupo]* Antes de seguir, una pregunta rápida: ¿a cuántos de ustedes les ha tocado transcribir a mano las cifras de un documento escaneado?

*[Espere respuestas. Si hay silencio, reformule:]* ¿O digitar de nuevo una tabla que les llegó como imagen porque no se podía copiar?

*[Escuche una o dos respuestas y comente brevemente lo que digan]*

Perfecto. Eso es exactamente lo que vamos a resolver hoy en la primera hora.

*[Transición]* Entremos entonces al primer bloque.

---

# 3 · Divisor · La IA que ve
### [⏱ 5:00 – 5:30 · 30 segundos]

*[Al pasar a la diapositiva]*

Bloque uno: la IA que ve. Modelos multimodales aplicados a documentos, estados financieros y gráficos.

---

# 4 · Qué puede hacer con una imagen
### [⏱ 5:30 – 10:30 · 5 min]

*[Al pasar a la diapositiva. Vaya señalando cada capacidad mientras la nombra.]*

Cuando le entregamos una imagen a un modelo multimodal, hay seis cosas que puede hacer. Las voy a recorrer rápido, pero quiero que en cada una piensen en un documento concreto de su escritorio.

**Describir.** Explicar en detalle qué aparece en una imagen o en una captura de pantalla. Es la más básica.

**Extraer texto.** Esto es OCR, pero mucho más inteligente que el OCR tradicional: lee documentos escaneados, estados financieros, certificaciones, actas, formularios. Y no solo transcribe, entiende la estructura.

**Interpretar gráficos.** Analiza barras, líneas y cascadas, y explica la tendencia sin que nadie se la dicte. Esta la vamos a probar en unos minutos y es sorprendente.

**Comparar.** Señala diferencias entre dos periodos, dos documentos o dos versiones del mismo archivo.

**Clasificar.** Identifica de qué tipo de documento se trata y lo organiza. Útil cuando les llega un correo con quince adjuntos.

**Y responder preguntas.** Contestar algo puntual sobre el documento sin tener que leerlo entero. «¿Cuál es el plazo de este contrato?», y listo.

*[Señale el recuadro inferior]*

Todo esto lo hacen desde Gemini corporativo, adjuntando la imagen directamente en la conversación. No necesitan instalar nada ni pedir permisos: ya lo tienen.

*[Transición]* Ahora bien, que la herramienta pueda hacerlo no significa que lo vaya a hacer bien. Eso depende de cómo se le pregunte.

---

# 5 · Anatomía del prompt visual
### [⏱ 10:30 – 15:30 · 5 min]

*[Al pasar a la diapositiva]*

Un buen prompt de análisis visual tiene cuatro partes. Si les falta alguna, la respuesta se vuelve genérica y no les sirve.

**Uno: contexto.** Dígale quién es usted y para qué está mirando la imagen. No es lo mismo mirar un estado financiero como analista de crédito que como auditor interno; buscan cosas distintas. Escriban algo como: «Eres analista de crédito revisando los estados financieros de un cliente empresarial».

**Dos: instrucción específica.** No digan «describe la imagen». Digan exactamente qué necesitan. Por ejemplo: «Identifica las variaciones relevantes entre 2024 y 2025».

**Tres: formato de salida.** Pidan la respuesta como la van a usar. Si la van a pegar en un correo, pidan párrafos. Si la van a pegar en Excel, pidan una tabla, y digan cuáles columnas: «Preséntalo en una tabla con concepto, 2025, 2024 y variación».

**Cuatro: capas de análisis.** Pidan primero lo general y después el detalle. «Primero el panorama, luego cada rubro». Esto evita que se pierda en minucias antes de darles la foto completa.

*[Señale el recuadro inferior y haga una pausa breve]*

Y quiero que se queden con esta frase: la diferencia entre una respuesta inútil y una que sirve casi nunca está en el modelo. Está en cuánto contexto le dieron. La herramienta es la misma para todos; lo que cambia es quién sabe pedirle las cosas.

*[Transición]* Dejemos la teoría. Vamos a hacerlo en vivo.

---

# 6 · Demo 1 · Documento escaneado
### [⏱ 15:30 – 24:30 · 9 min]

*[Al pasar a la diapositiva]*

Miren este documento. Es el estado financiero de una empresa que llamamos Distribuidora Andina. Es una empresa ficticia y las cifras son inventadas, pero el documento está hecho para verse como lo que a ustedes les llega de verdad: escaneado, un poco torcido, con grano.

*[Comparta pantalla y abra Gemini. Adjunte el archivo del estado financiero.]*

Voy a adjuntarlo en Gemini y a usar este prompt.

*[Lea el prompt de la diapositiva mientras lo pega]*

«Eres analista de crédito. Adjunto el estado financiero escaneado de un cliente. Extrae toda la información a una tabla con concepto, 2025 y 2024. Respeta subtotales y totales. No calcules nada que no esté en el documento.»

Fíjense en la última frase, que es deliberada: «no calcules nada que no esté en el documento». Al principio solo quiero que transcriba. Si le pido que calcule al tiempo que lee, mezclo dos tareas y no sé cuál falló.

*[Envíe el prompt. Mientras genera, siga hablando.]*

Mientras responde, quiero que tengan claro qué hay que mirar cuando llegue la respuesta.

*[Cuando aparezca la respuesta, léala por encima y compare dos o tres cifras contra el documento original en pantalla]*

Lo primero: ¿leyó bien todos los dígitos? Vamos a verificar un par. *[Señale una cifra en la respuesta y la misma en el documento]*

Los dos lugares donde más se equivoca son los separadores de miles —confunde el punto con una coma, o se come un dígito— y los paréntesis de las cifras negativas. En el estado de resultados, los costos y los gastos vienen entre paréntesis, y eso significa que restan. Si el modelo los transcribe sin el paréntesis, después va a sumar donde debía restar.

*[Pregunta al grupo]* ¿Alguien ve alguna cifra que no coincida con el documento?

*[Espere. Si hay silencio, reformule:]* ¿Les cuadra la última fila, la de utilidad neta?

*[Señale el último recuadro de la diapositiva]*

Y les dejo una intriga: este documento tiene una historia adentro. Las cifras no son neutras, cuentan algo. En la siguiente demostración la vamos a encontrar.

*[Transición]* Porque leer no es lo mismo que entender. Vamos con la segunda demostración.

---

# 7 · Demo 2 · Interpretar un gráfico
### [⏱ 24:30 – 33:30 · 9 min]

*[Al pasar a la diapositiva]*

Aquí tenemos dos gráficos, y son de dos tipos que ustedes reciben todo el tiempo.

*[Señale el gráfico de la izquierda]*

El de la izquierda es una cascada, o puente. Muestra cómo se pasa de la utilidad de un año a la del siguiente, descomponiendo qué sumó y qué restó. Es un gráfico poderoso pero incómodo de leer si uno no está entrenado.

*[Señale el de la derecha]*

El de la derecha es peor: cuatro series apiladas, dos ejes distintos, ocho trimestres. Es cartera por calificación con el índice de mora encima. De estos les llegan en cada comité, y honestamente casi nadie los lee completos.

*[Comparta pantalla, abra un chat nuevo en Gemini y adjunte el gráfico de cascada]*

Vamos a pedirle a Gemini que lo interprete.

*[Lea el prompt mientras lo pega]*

«Adjunto un gráfico. Explícame qué muestra, cuál es la tendencia principal y cuál es la conclusión. Escribe para alguien que no es financiero.»

Esa última instrucción —«escribe para alguien que no es financiero»— es un truco que les va a servir muchísimo. Obliga al modelo a traducir la jerga, y de paso les da el texto casi listo para explicarle el caso a un cliente o a alguien de otra área.

*[Envíe. Cuando llegue la respuesta, léala en voz alta o resuma lo que dijo.]*

*[Señale el pie del gráfico de la izquierda]*

Y aquí está la historia que les prometí. Esta empresa **subió sus ventas catorce por ciento**, pero su **utilidad neta cayó cuarenta y ocho por ciento**. Casi a la mitad.

*[Pausa breve]*

Piénsenlo un segundo: vendió más y ganó mucho menos. ¿Qué se la comió?

*[Espere respuestas. Si hay silencio, reformule:]* Miren la barra roja más grande del gráfico. ¿Qué dice?

*[La respuesta es: los gastos financieros. Confirme lo que digan y continúe.]*

Exacto: el gasto financiero. La operación está bien —el margen bruto incluso mejoró—; el problema es cómo financió ese crecimiento. Eso lo vamos a desarrollar más adelante.

*[Si el tiempo alcanza, adjunte también el gráfico de cartera y muestre la respuesta. Si va corto, sáltelo y menciónelo:]*

*[Opcional]* El de cartera funciona igual. Pruébenlo ustedes en el taller: es un buen ejercicio porque tiene doble eje y ahí el modelo se confunde con más frecuencia.

*[Transición]* Todo esto se ve muy bien. Ahora tengo que mostrarles el otro lado.

---

# 8 · Límites · el gráfico trampa
### [⏱ 33:30 – 42:30 · 9 min]

*[Al pasar a la diapositiva]*

Hasta aquí les he mostrado lo que hace bien. Esta diapositiva es la más importante de la sesión, porque es la que puede evitarles un problema serio.

Hay cuatro cosas que la IA no hace bien.

**Alucinaciones visuales.** Inventa cifras o texto que no están en el documento. Y lo hace con total seguridad, sin avisar que está dudando.

**Precisión numérica.** Se equivoca leyendo números en tablas densas, sobre todo cuando hay muchas columnas juntas.

**Aritmética.** Y esta subráyenla: un total que *calculó* el modelo no es un total verificado. Estos sistemas predicen texto; no son calculadoras.

**Contexto normativo.** No conoce el marco local ni las políticas del banco. No sabe qué exige la Superfinanciera ni cuál es la política de riesgo de ustedes.

*[Señale el gráfico de la derecha]*

Ahora quiero hacer un experimento con ustedes. Miren este gráfico: cumplimiento de meta de colocación, primer semestre.

*[Pregunta al grupo]* Sin analizarlo mucho: viéndolo así, ¿qué tan preocupante les parece la situación?

*[Espere respuestas. La mayoría va a decir que se ve mal, que hay una caída fuerte.]*

*[Comparta pantalla, abra un chat nuevo en Gemini, adjunte el gráfico del eje truncado y pegue:]*

Vamos a preguntarle a Gemini lo mismo: «Adjunto un gráfico del área comercial. Interprétalo y dime qué tan preocupante es la situación.»

*[Envíe y lea la respuesta en voz alta]*

*[Ahora vuelva a la diapositiva y señale el eje vertical]*

Ahora miren el eje vertical. No empieza en cero: empieza en noventa y siete coma cuatro y termina en noventa y ocho coma seis.

La caída real es de **ocho décimas de punto porcentual**. De noventa y ocho coma cuatro a noventa y siete coma seis. El cumplimiento sigue por encima del noventa y siete por ciento, que para cualquier área comercial es un resultado excelente.

*[Pausa]*

No hay ningún desplome. Lo que hay es un eje recortado que convierte una variación mínima en un precipicio visual.

*[Señale el recuadro de la regla de oro]*

Y de ahí sale la regla de oro de toda esta sesión: **la IA asiste; usted verifica y decide.** Ninguna cifra que vaya a un comité sale de una conversación con Gemini sin haberse confirmado contra la fuente.

Esto no es desconfianza en la herramienta. Es que ustedes firman las decisiones, no ella.

*[Transición]* Bien. Ya sabemos leer documentos y gráficos, y ya sabemos desconfiar con criterio. Pasemos a la segunda mitad, que es lo que hacemos con lo que encontramos.

---

# 9 · Divisor · De ver a contar
### [⏱ 42:30 – 43:00 · 30 segundos]

*[Al pasar a la diapositiva]*

Bloque dos: de ver a contar. Y la frase que lo resume: un hallazgo que nadie entiende es un hallazgo que no existe.

---

# 10 · Qué es una narrativa visual
### [⏱ 43:00 – 47:00 · 4 min]

*[Al pasar a la diapositiva]*

Una narrativa visual es una secuencia de imágenes que sostiene un argumento. Cada imagen prepara, revela, contrasta o concluye. Ninguna está de adorno.

No es decoración: es la forma de que un hallazgo se entienda en treinta segundos, que muchas veces es todo el tiempo que les van a dar en un comité.

*[Señale la cita de la derecha y léala despacio]*

Y tienen una prueba muy sencilla para saber si lo que armaron es narrativa o es relleno: **si elimino esta imagen, ¿se pierde parte del argumento?** Si la respuesta es sí, es narrativa. Si es no, es decoración.

*[Señale el recuadro inferior]*

Ustedes ya usan narrativas visuales aunque no las llamen así. Los informes de «antes y después», los seguimientos de un cliente en el tiempo, la lámina que abre un comité de crédito. Todas esas son narrativas visuales; lo que vamos a hacer hoy es construirlas con intención y en menos tiempo.

*[Transición]* ¿Y cómo se estructura una? Con tres momentos.

---

# 11 · La estructura de tres momentos
### [⏱ 47:00 – 52:00 · 5 min]

*[Al pasar a la diapositiva]*

Toda narrativa visual efectiva se puede organizar en tres momentos. Es una estructura simple y sirve para casi cualquier situación.

**Momento uno: establecer.** ¿Cuál es el punto de partida? ¿Qué necesita saber quien lee antes que nada? Aquí va la situación esperada, el contexto, el cliente tal como se presenta.

**Momento dos: desarrollar.** ¿Cuál es el corazón del asunto? ¿Qué se encontró, qué cambió? Aquí va el hallazgo, el dato revelador, el contraste incómodo. Este es el momento que justifica que ustedes estén hablando.

**Momento tres: resolver.** ¿Hacia dónde vamos? ¿Qué se concluye, qué se propone? La recomendación, la condición, la decisión que se está pidiendo.

*[Señale el recuadro inferior]*

Y miren cómo se traduce a lo que ustedes hacen. En análisis de crédito: lo que el cliente presenta, lo que encontramos, lo que recomendamos. En seguimiento de cartera: la meta, el comportamiento real, el plan de acción.

*[Pausa breve]*

Es la misma estructura de siempre. Lo que cambia es que ahora la vamos a construir en minutos y con apoyo visual.

*[Transición]* Y la mejor manera de verlo es con el caso que ya conocemos.

---

# 12 · El caso completo en tres momentos
### [⏱ 52:00 – 57:00 · 5 min]

*[Al pasar a la diapositiva]*

Volvamos a Distribuidora Andina, la empresa del documento con el que empezamos.

**Momento uno, establecer: un cliente que crece.** Las ventas suben catorce por ciento y la operación sigue sana; el margen bruto incluso mejora. Sobre el papel, es un buen cliente. Cualquiera diría que hay que prestarle.

**Momento dos, desarrollar: el costo de ese crecimiento.** La utilidad neta cae cuarenta y ocho por ciento. La deuda de corto plazo sube setenta y cinco por ciento y el gasto financiero se come toda la operación. Creció, sí, pero financiándose a corto plazo.

**Momento tres, resolver: qué recomendamos.** La cobertura de intereses quedó en uno coma cuarenta veces, que es muy ajustada: la utilidad operacional apenas alcanza para pagar los intereses. La recomendación sería aprobar condicionado a reperfilar la deuda, con seguimiento de capital de trabajo.

*[Pausa]*

Fíjense en algo importante. Ese es el mismo documento del que partimos hace media hora. **Leerlo era la mitad del trabajo; contarlo es la otra mitad.** Un análisis que nadie entiende en el comité no cambia ninguna decisión.

*[Transición]* Y aquí viene lo bueno: esa estructura no la tienen que armar solos.

---

# 13 · Pedirle la estructura a la IA
### [⏱ 57:00 – 62:00 · 5 min]

*[Al pasar a la diapositiva]*

Este es el prompt que convierte un hallazgo en una narrativa. Se los leo completo porque lo van a usar en el taller.

*[Lea el prompt de la diapositiva]*

«Soy analista de crédito. Encontré que un cliente aumentó sus ventas catorce por ciento pero su utilidad neta cayó cuarenta y ocho por ciento, financiándose con deuda de corto plazo que creció setenta y cinco por ciento. Necesito construir una narrativa visual de tres momentos para presentarla en comité.

Momento uno, establecer: ¿qué contexto necesita el comité? Momento dos, desarrollar: ¿cuál es el hallazgo central? Momento tres, resolver: ¿cuál es la recomendación?

Para cada momento dame un título corto, una descripción de lo que la imagen debería comunicar, y el tono sugerido.»

*[Señale las tres partes mientras las menciona]*

Noten la estructura del prompt: primero el contexto de quién soy, después el hallazgo con cifras concretas, después la petición dividida en los tres momentos, y al final el formato exacto que quiero recibir. Son las cuatro partes que vimos al comienzo, aplicadas.

*[Señale el recuadro inferior y haga una pausa]*

Y quiero insistir en esto porque es donde más se equivoca la gente: **empiecen siempre por el mensaje, nunca por la imagen.** La imagen es la consecuencia del argumento, no al revés. Si empiezan generando imágenes bonitas a ver cuál pega, van a terminar con tres ilustraciones sueltas que no dicen nada.

*[Transición]* Ya tenemos los tres momentos. Falta que las tres imágenes se vean como una sola historia.

---

# 14 · Estilo base e inglés
### [⏱ 62:00 – 67:00 · 5 min]

*[Al pasar a la diapositiva]*

Si cada imagen tiene un estilo distinto, la secuencia se rompe. Aunque el argumento sea impecable, visualmente se leen como tres cosas sueltas y el efecto se pierde.

La solución es simple: definan un estilo y una paleta, y repítanlos **textualmente** en los tres prompts. Sin cambiar ni una palabra.

*[Señale el recuadro negro de la derecha y lea el estilo base]*

Este es el estilo base que les propongo para hoy: ilustración digital de diseño plano profesional, paleta azul institucional profundo con acentos dorados sobre fondo blanco, composición limpia, moderna, con el sujeto centrado y pocos elementos.

Es sobrio y funciona bien en un comité. Ustedes pueden cambiarlo, pero cámbienlo para los tres a la vez.

*[Señale el recuadro «¿Por qué en inglés?»]*

Y una nota sobre el idioma. Los modelos de generación de imágenes se entrenaron sobre todo con descripciones en inglés, así que un prompt en inglés produce resultados bastante más precisos.

La buena noticia es que no necesitan escribir en inglés. Pídanle a Gemini que traduzca y enriquezca sus prompts: piensan en español, generan en inglés. Literalmente le dicen «genera tres prompts de imagen en inglés, uno por momento, todos con este estilo base», y él se encarga.

*[Transición]* Y con eso ya tienen todo lo que necesitan. Es su turno.

---

# 15 · Taller
### [⏱ 67:00 – 115:00 · 48 min · 3 de instrucciones + 45 de trabajo]

*[Al pasar a la diapositiva]*

Ahora ustedes. Tienen cuarenta y cinco minutos para construir su propia narrativa de tres momentos, y son cuatro pasos.

**Paso uno, leer: diez minutos.** Adjunten el estado financiero en Gemini y extraigan las cifras. Encuentren la historia. Y por favor, verifiquen dos o tres cifras contra el documento antes de seguir: si el modelo leyó mal un número, todo lo que viene después queda contaminado.

**Paso dos, estructurar: diez minutos.** Pídanle los tres momentos con el prompt que acabamos de ver. Revisen lo que proponga y ajústenlo. La IA propone; ustedes deciden si ese es el argumento que quieren defender.

**Paso tres, generar: quince minutos.** Tres prompts en inglés con el mismo estilo base, y las tres imágenes.

**Paso cuatro, presentar: diez minutos.** Armen la lámina de comité: las tres imágenes en orden, los tres títulos y una frase con la recomendación.

*[Señale el recuadro de advertencia]*

Una regla, y es en serio: **datos ficticios únicamente.** Trabajen con el caso que les entregamos o con un ejemplo inventado. Nada de información real de clientes del banco en este ejercicio.

*[Comparta el enlace de descarga de las imágenes y la guía del taller por el chat]*

Les acabo de dejar en el chat la guía del taller con todos los prompts listos para copiar, y el enlace para descargar el estado financiero.

*[Pregunta al grupo]* ¿Alguna duda antes de arrancar?

*[Espere. Resuelva dudas. Luego:]*

Perfecto. Empiecen. Yo me quedo conectado: escriban por el chat o levanten la mano si se atascan, y voy pasando a ver cómo van.

*[Durante los 45 minutos: manténgase disponible. A los 20 minutos avise que deberían ir en el paso dos. A los 35 avise que quedan 10 minutos y que vayan armando la lámina. A los 43 pida que cierren.]*

*[Al terminar, si el tiempo alcanza, pida a dos o tres personas que muestren su lámina en dos minutos cada una.]*

*[Transición]* Cerremos.

---

# 16 · Cierre
### [⏱ 115:00 – 120:00 · 5 min]

*[Al pasar a la diapositiva]*

Con esto cerramos el módulo cinco.

Se llevan dos capacidades que se complementan. La primera: leer documentos y gráficos que antes tocaba transcribir a mano, y hacerlo en segundos. La segunda: convertir un hallazgo en algo que un comité entiende de inmediato.

*[Pausa]*

Y se llevan también una advertencia, que para mí es lo más valioso de la noche. La IA lee, pero **ustedes deciden qué significa.** Ese gráfico del eje recortado que vimos hace un rato es el mejor recordatorio: la herramienta puede describir con toda seguridad algo que está mal planteado. La verificación y el criterio siguen siendo suyos, y eso no lo va a reemplazar ninguna versión nueva del modelo.

*[Señale la información de contacto]*

Su entregable es la narrativa de tres momentos que acaban de construir. Si quieren que la revise o tienen dudas después, ahí está mi correo.

*[Pregunta al grupo]* ¿Preguntas finales antes de cerrar?

*[Espere. Responda lo que surja.]*

Muchas gracias por estas dos sesiones. Nos vemos en el módulo seis con Juan Carlos. Buenas noches.
