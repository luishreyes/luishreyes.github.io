# Guión de clase — M1 · Sesión 2: «Cómo aprenden los modelos»

**Curso:** Modelos de la IA · Contraloría General de la República (CGR) · EDCO Uniandes
**Presentación:** `modelos-m1s2-aprendizaje.html` (42 diapositivas)
**Duración:** 1.5 horas (90 minutos)
**Conferencista:** Luis H. Reyes

---

### Cómo usar este guión

- El texto en párrafos normales es lo que **se lee en voz alta, tal cual**.
- El texto **[entre corchetes y en cursiva]** son acotaciones para usted (no se leen): cuándo pasar de diapositiva, dónde hacer clic, cuándo hacer una pausa o esperar respuestas.
- Cada diapositiva trae un marcador `[⏱ minuto de inicio – minuto de fin · duración]` medido dentro de la sesión de 90 minutos.
- Las preguntas al público están escritas completas; si hay silencio, use la reformulación que aparece a continuación.

### Reparto de tiempos por sección

| Bloque | Diapositivas | Tiempo |
|---|---|---|
| Apertura (portada, recap, trabajo autónomo, agenda) | 1–4 | 0:00–9:30 · 9.5 min |
| §01 · ¿Cómo aprende una máquina? | 5–12 | 9:30–29:30 · 20 min |
| §02 · Tres formas de aprender | 13–19 | 29:30–45:30 · 16 min |
| §03 · Tipos de modelos | 20–28 | 45:30–63:30 · 18 min |
| §04 · Calidad de datos y sesgos | 29–34 | 63:30–76:30 · 13 min |
| §05 · Evaluación | 35–37 | 76:30–84:00 · 7.5 min |
| §06 · Ejercicio y cierre | 38–42 | 84:00–90:00 · 6 min |

---

## Diapositiva 1 · Portada — «Cómo aprenden los modelos»
**[⏱ 0:00 – 1:00 · 1 min]**

*[Al iniciar, con la portada en pantalla.]*

Muy buenas noches a todas y a todos. Bienvenidos a la segunda sesión de nuestro curso *Modelos de la Inteligencia Artificial*, que hacemos junto con la Contraloría General de la República y la Educación Continua de la Universidad de los Andes. Mi nombre es Luis Humberto Reyes, soy profesor asociado del Departamento de Ingeniería Química y de Alimentos, y voy a acompañarlos esta noche durante la próxima hora y media.

El título de hoy es *Cómo aprenden los modelos*, y el subtítulo lo dice todo: vamos a hablar de datos, algoritmos, modelos y evaluación. Es decir, hoy vamos a abrir la caja negra. En la sesión pasada vimos *qué* es la inteligencia artificial; hoy vamos a entender *cómo* funciona por dentro, sin necesidad de saber matemáticas ni programación.

*[Transición.]* Antes de entrar en materia, hagamos memoria de lo que ya vimos.

---

## Diapositiva 2 · Recapitulación — «¿Qué vimos en la sesión 1?»
**[⏱ 1:00 – 4:00 · 3 min]**

*[Al pasar a la diapositiva. Aparecen cinco tarjetas.]*

En la primera sesión, con el profesor Juan Carlos Cruz, ustedes recorrieron cinco ideas que quiero recordar rápidamente, porque son la base de todo lo de hoy.

Primero, la **historia de la inteligencia artificial**: no es algo de los últimos dos años; son más de setenta años de evolución, que han ocurrido por olas, con momentos de mucho entusiasmo y momentos de calma.

Segundo, la idea de **inteligencia artificial estrecha**: los sistemas que usamos hoy son excelentes en tareas específicas —traducir, recomendar, clasificar—, pero no tienen conciencia ni entienden el mundo como nosotros.

Tercero, que estamos ante un **ecosistema diverso**: no existe una sola inteligencia artificial. Hay muchas empresas y muchos modelos —OpenAI, Anthropic, Google, Meta, DeepSeek— compitiendo y avanzando.

Cuarto, que la IA ya está en nuestro **uso cotidiano**: en el filtro de correo, en el GPS, en las recomendaciones que nos aparecen todos los días.

Y quinto, quizás el más importante: la inteligencia artificial **no es magia**. Es matemáticas, datos y poder de cómputo. Nada más, y nada menos.

*[Señale el recuadro inferior.]* Y aquí está la promesa de hoy: vamos a abrir esa caja y a entender **cómo** funcionan estos sistemas por dentro.

---

## Diapositiva 3 · Trabajo autónomo — comentarios de la lectura
**[⏱ 4:00 – 8:00 · 4 min]**

*[Al pasar a la diapositiva.]*

Antes de avanzar, quiero abrir un espacio breve para la lectura que les quedó de trabajo autónomo: el documento de la OCDE sobre inteligencia artificial en el sector público. Me gustaría escuchar a dos o tres de ustedes.

*[Lea la primera pregunta y espere respuestas.]* La primera pregunta: ¿qué fue lo que más les llamó la atención de la lectura? *[Espere. Si hay silencio, reformule:]* ¿Hubo algún dato o alguna afirmación que los hiciera detenerse a pensar?

*[Segunda pregunta.]* La segunda: ¿qué aplicación de las que menciona el documento identificaron como la más relevante para su propia dependencia?

*[Tercera pregunta.]* Y la tercera: ¿apareció algún concepto nuevo o que los sorprendiera?

*[Escuche dos o tres intervenciones, agradezca y cierre.]* Muchas gracias. Guarden esas ideas, porque varias de ellas van a conectar con lo que veremos hoy, sobre todo cuando hablemos de calidad de datos y de sesgos.

---

## Diapositiva 4 · Agenda — «Lo que veremos hoy»
**[⏱ 8:00 – 9:30 · 1.5 min]**

*[Al pasar a la diapositiva.]*

Este es el mapa de ruta de la noche. Son seis paradas.

Primero, **el ciclo del aprendizaje**: el trío fundamental de datos, algoritmo y modelo. Segundo, **las tres formas de aprender** que existen: supervisado, no supervisado y por refuerzo. Tercero, **los tipos de modelos**, para entender qué herramienta sirve para qué tarea. Cuarto, **la calidad de los datos**: eso de que «basura entra, basura sale», y el tema de los sesgos. Quinto, **la evaluación**: cómo se mide si un modelo es bueno, y qué son los falsos positivos y los falsos negativos. Y sexto, cerramos con un **ejercicio** en el que ustedes van a pensar como científicos de datos aplicado a su trabajo.

*[Transición.]* Empecemos por el principio: ¿cómo hace una máquina para aprender?

---

## Diapositiva 5 · Divisor §01 — «¿Cómo aprende una máquina?»
**[⏱ 9:30 – 10:00 · 0.5 min]**

*[Al pasar al divisor de sección oscuro.]*

Parte uno. La pregunta de fondo de todo el aprendizaje automático es esta: ¿cómo aprende, entre comillas, una máquina? Y la respuesta se apoya en tres conceptos que vamos a ver uno por uno: los datos, el algoritmo y el modelo.

---

## Diapositiva 6 · La pregunta central — el trío fundamental
**[⏱ 10:00 – 12:30 · 2.5 min]**

*[Al pasar a la diapositiva. Aparecen tres tarjetas: Datos, Algoritmo, Modelo.]*

La pregunta central es: ¿cómo logra una máquina «aprender» sin que un programador le escriba, una por una, todas las reglas? Porque esa es la diferencia con la informática tradicional. Antes, un programa hacía exactamente lo que le decíamos, paso a paso. Aquí, en cambio, el sistema aprende de ejemplos. Y todo se reduce a tres piezas.

La primera son los **datos**. Son la materia prima, las experiencias de las que el sistema aprende.

La segunda es el **algoritmo**. Es el método de estudio, la estrategia que usa para encontrar patrones dentro de esos datos.

Y la tercera es el **modelo**. Es el resultado del aprendizaje: el conocimiento ya adquirido, listo para usarse.

*[Señale el recuadro inferior oscuro.]* Y la frase para recordar es esta: sin datos no hay aprendizaje; sin algoritmo no hay método; y sin modelo no hay aplicación. Las tres piezas son necesarias. Vamos a verlas una por una.

---

## Diapositiva 7 · Los datos: la materia prima
**[⏱ 12:30 – 15:00 · 2.5 min]**

*[Al pasar a la diapositiva.]*

Empecemos por los datos. Aquí la analogía es sencilla: los datos son para la inteligencia artificial lo que las experiencias son para un ser humano. Una persona que nunca ha visto el mar no puede describirlo. Un modelo que nunca ha visto ejemplos de fraude no puede detectarlo. Sin experiencias, no hay aprendizaje posible.

Y la buena noticia es que la IA puede aprender de casi cualquier tipo de dato. *[Señale la lista.]* Puede procesar **texto**: documentos, correos, contratos, leyes. Puede procesar **números**: tablas financieras, estadísticas, mediciones. Puede procesar **imágenes**: fotografías, documentos escaneados, radiografías. Puede procesar **audio**: grabaciones de voz, llamadas. Y puede procesar **video**: grabaciones de reuniones, contenido multimedia.

*[Señale el recuadro de la derecha.]* Y para que se hagan una idea de la escala: el modelo GPT-4 se entrenó con aproximadamente trece billones de *tokens* —trece billones de fragmentos de texto—. Para ponerlo en perspectiva, eso equivale, más o menos, a leer la biblioteca del Congreso de los Estados Unidos unas ochenta veces. Esa es la cantidad de «experiencia» que hay detrás de estas herramientas.

*[Transición.]* Ya tenemos los datos. Ahora, ¿qué se hace con ellos? Ahí entra el algoritmo.

---

## Diapositiva 8 · El algoritmo: el método de estudio
**[⏱ 15:00 – 17:00 · 2 min]**

*[Al pasar a la diapositiva.]*

Si los datos son los libros de texto, el algoritmo es la **estrategia de estudio**. Y así como cada persona estudia distinto, hay distintas estrategias, y cada una funciona mejor para cierto tipo de problema.

*[Señale las tres tarjetas.]* Algunas máquinas aprenden mejor haciendo **resúmenes**, organizando la información en reglas claras; eso es, por ejemplo, un árbol de decisión. Otras prefieren resolver **muchos ejercicios**, ajustándose poco a poco; eso es una red neuronal. Y otras funcionan mejor **en grupo**, combinando varias opiniones y votando la respuesta; eso es lo que llamamos un *ensemble*, un conjunto de modelos.

*[Señale el recuadro inferior.]* Aquí hay una idea clave que conviene subrayar: el algoritmo **no** es la respuesta. El algoritmo es el **proceso** para encontrar la respuesta. Es la receta de cocina, no el plato terminado. Si aplicamos la receta —el algoritmo— a los ingredientes —los datos—, obtenemos el plato. Y ese plato es el modelo.

---

## Diapositiva 9 · El modelo: el conocimiento adquirido
**[⏱ 17:00 – 19:30 · 2.5 min]**

*[Al pasar a la diapositiva. Aparece el flujo de tres discos.]*

Y llegamos al modelo. Cuando el algoritmo termina de procesar todos los datos, el resultado es un modelo: los patrones y las relaciones que aprendió, ya listos para aplicarse a situaciones nuevas.

*[Señale el flujo de izquierda a derecha.]* Véanlo así: tomamos los **datos y el algoritmo**, los pasamos por un proceso de **entrenamiento**, y de ahí sale el **modelo**. Ese es el ciclo completo, resumido en una imagen.

Y hay una propiedad del modelo que es fundamental entender: el modelo es **portátil**. Una vez entrenado, se puede usar millones de veces sin tener que volver a entrenarlo.

*[Señale el recuadro inferior.]* El mejor ejemplo es GPT. GPT es un modelo. Se entrenó una sola vez —un proceso que tomó meses y costó muchísimo dinero— y hoy millones de personas lo usan a diario, cada una en su computador, sin repetir ese entrenamiento. El entrenamiento es caro y ocurre una vez; el uso es barato y ocurre infinitas veces.

---

## Diapositiva 10 · El ciclo completo
**[⏱ 19:30 – 22:00 · 2.5 min]**

*[Al pasar a la diapositiva. Aparece la línea de siete pasos.]*

Ahora bien, en la práctica, entrenar un modelo no es apretar un botón. Es un ciclo de siete pasos, muy parecido a como uno se prepara para un examen importante.

El paso uno es la **recolección**: conseguir los libros y el material de estudio; es decir, reunir los datos. El paso dos es la **preparación**: organizar ese material, descartar lo que no sirve y llenar los vacíos; en datos esto se llama limpieza, y suele ser la parte más laboriosa. El paso tres es el **entrenamiento**: estudiar de verdad, encontrar los patrones. El paso cuatro es la **validación**: hacer simulacros de examen para verificar que sí estamos aprendiendo. El paso cinco es la **prueba**: el examen final, con preguntas completamente nuevas. El paso seis es el **despliegue**: graduarse y salir a aplicar lo aprendido en el mundo real. Y el paso siete es el **monitoreo**: verificar que el modelo sigue funcionando bien con el paso del tiempo, porque el mundo cambia.

*[Transición.]* Fíjense en los pasos cuatro y cinco: validación y prueba. Ahí hay una idea tan importante que merece su propia diapositiva.

---

## Diapositiva 11 · Tres conjuntos de datos
**[⏱ 22:00 – 24:30 · 2.5 min]**

*[Al pasar a la diapositiva. Aparecen tres estadísticas grandes.]*

Cuando entrenamos un modelo, hay una práctica fundamental: **nunca** usamos todos los datos para entrenar. Los dividimos en tres conjuntos separados.

*[Señale la primera cifra.]* Entre el setenta y el ochenta por ciento se usa para **entrenamiento**. Son los ejercicios de práctica: de aquí el modelo aprende.

*[Segunda cifra.]* Entre el diez y el quince por ciento se usa para **validación**. Son los simulacros de examen: sirven para ajustar la estrategia mientras el modelo todavía está aprendiendo.

*[Tercera cifra.]* Y el diez o quince por ciento restante se guarda para la **prueba**. Es el examen final, con datos que el modelo **nunca** ha visto.

*[Señale el recuadro inferior.]* ¿Y por qué esto importa tanto? Pónganse en el lugar de un estudiante que estudia solamente con las preguntas exactas del examen final que consiguió filtradas. Va a sacar diez en ese examen, pero en realidad no sabe nada: no aprendió, memorizó. Eso, en inteligencia artificial, tiene un nombre, y es uno de los problemas más importantes de todos: se llama **sobreajuste**.

---

## Diapositiva 12 · Sobreajuste: memorizar no es aprender
**[⏱ 24:30 – 27:00 · 2.5 min]**

*[Al pasar a la diapositiva.]*

El **sobreajuste** ocurre cuando el modelo memoriza los datos de entrenamiento en lugar de aprender los patrones que se pueden generalizar a casos nuevos.

Volvamos a la analogía del estudiante: imaginen a alguien que memoriza las cincuenta preguntas exactas del examen anterior. Le va a ir perfecto si el examen es idéntico. Pero si el profesor cambia una sola pregunta, se queda en blanco, porque nunca entendió el tema; solo memorizó respuestas.

*[Señale las dos tarjetas.]* Comparemos. Un **modelo sobreajustado** funciona perfecto con los datos que ya conoce, pero es terrible con datos nuevos. Un **modelo bien entrenado** funciona bien con los datos conocidos **y también** con los datos nuevos. Ese segundo es el que queremos siempre.

*[Señale el recuadro inferior.]* ¿Y cómo se detecta el sobreajuste? Precisamente comparando el rendimiento en el conjunto de entrenamiento contra el de prueba. Si el modelo saca diez en entrenamiento pero raspa en la prueba, esa diferencia enorme es la señal de alarma: está memorizando, no aprendiendo.

*[Transición.]* Con esto cerramos la primera parte: ya sabemos que aprender es datos más algoritmo igual modelo, y que hay que cuidarse del sobreajuste. Ahora bien, ¿de cuántas maneras distintas puede aprender una máquina?

---

## Diapositiva 13 · Divisor §02 — «Tres formas de aprender»
**[⏱ 27:00 – 29:30 · 2.5 min, incluye transición]**

*[Al pasar al divisor de sección.]*

Parte dos: las tres formas de aprender. Existen tres grandes paradigmas, tres maneras fundamentalmente distintas en que un modelo puede aprender. Se llaman aprendizaje **supervisado**, aprendizaje **no supervisado** y aprendizaje **por refuerzo**. Vamos a ver cada uno con ejemplos cotidianos.

---

## Diapositiva 14 · Aprendizaje supervisado: aprender con profesor
**[⏱ 29:30 – 31:30 · 2 min]**

*[Al pasar a la diapositiva.]*

El primero, y el más común de todos, es el aprendizaje **supervisado**. Funciona igual que aprender con un profesor que ya tiene las respuestas correctas.

*[Señale los tres pasos.]* Son tres pasos. Primero, le damos al modelo miles de **ejemplos etiquetados**, es decir, ejemplos que vienen con su respuesta correcta. Segundo, el modelo **encuentra los patrones** que relacionan cada ejemplo con su respuesta. Y tercero, cuando llega un dato nuevo, el modelo **predice** la respuesta aplicando esos patrones.

*[Señale el recuadro del ejemplo.]* El ejemplo clásico es el filtro de spam. Le mostramos al sistema miles de correos, cada uno etiquetado como «spam» o «no spam». El modelo aprende qué palabras y qué patrones suelen indicar que un correo es basura. Y cuando llega un correo nuevo, predice si es spam o no. Es exactamente como enseñarle a un niño qué es un perro: le mostramos cientos de fotos diciéndole «esto es un perro, esto no es un perro», y llega un momento en que reconoce perros que nunca había visto.

---

## Diapositiva 15 · Supervisado: dos tareas principales
**[⏱ 31:30 – 33:30 · 2 min]**

*[Al pasar a la diapositiva. Aparecen dos columnas.]*

Dentro del aprendizaje supervisado hay dos tareas principales, y la diferencia es sencilla pero importante: depende de qué tipo de respuesta le pedimos al modelo.

*[Señale la columna izquierda.]* La primera es la **clasificación**: predecir una **categoría**. Por ejemplo: ¿este correo es spam o no? ¿esta transacción es fraudulenta o legítima? ¿qué tipo de documento es este? La clasificación siempre responde con una **etiqueta**.

*[Señale la columna derecha.]* La segunda es la **regresión**: predecir un **número**. Por ejemplo: ¿cuánto valdrá esta casa? ¿cuál será la temperatura mañana? ¿cuánto va a tardar este trámite? La regresión siempre responde con un **número**.

Entonces, la regla para recordar es simple: si la respuesta es una categoría, es clasificación; si la respuesta es una cantidad, es regresión.

---

## Diapositiva 16 · No supervisado: descubrir sin profesor
**[⏱ 33:30 – 36:00 · 2.5 min]**

*[Al pasar a la diapositiva.]*

El segundo paradigma es el aprendizaje **no supervisado**. Y aquí cambia todo: **no hay respuestas correctas**. Nadie le dice al modelo qué debe encontrar. El modelo tiene que descubrir por sí mismo la estructura y los patrones que están ocultos en los datos.

*[Señale el recuadro del ejemplo.]* El mejor ejemplo lo usan ustedes seguramente todas las semanas: la lista *Discover Weekly* de Spotify. Spotify analiza los patrones de escucha de millones de usuarios. **Descubre** que las personas con gustos parecidos al suyo escuchan cierta canción, y entonces **se la recomienda a usted**, aunque usted nunca la había oído.

*[Señale el recuadro oscuro inferior.]* Y aquí está lo interesante: nadie le dijo a Spotify «creá un grupo de personas a las que les gusta este tipo de música». El sistema **lo descubrió solo**, encontrando la estructura escondida en los datos. Eso es aprendizaje no supervisado.

---

## Diapositiva 17 · No supervisado: aplicaciones
**[⏱ 36:00 – 38:00 · 2 min]**

*[Al pasar a la diapositiva. Aparecen tres tarjetas.]*

El aprendizaje no supervisado tiene tres aplicaciones típicas, y todas son muy relevantes para el sector público.

*[Señale la primera tarjeta.]* La primera es el **agrupamiento**, o *clustering*: organizar los datos en grupos naturales. Sirve para segmentar clientes o ciudadanos, para agrupar documentos por tema, o para identificar comunidades dentro de una red.

*[Segunda tarjeta.]* La segunda es la **detección de anomalías**: encontrar lo que se sale de lo normal. Por ejemplo, transacciones bancarias sospechosas, comportamientos atípicos en una red, o valores que se salen de rango. Para el control fiscal, esto es oro puro.

*[Tercera tarjeta.]* Y la tercera es la **reducción de dimensionalidad**: simplificar datos muy complejos. Sirve para comprimir miles de variables a las pocas que realmente importan, y para visualizar información complicada de una forma que un ser humano pueda entender.

---

## Diapositiva 18 · Por refuerzo: ensayo y error
**[⏱ 38:00 – 40:30 · 2.5 min]**

*[Al pasar a la diapositiva. A la derecha, la foto de Lee Sedol frente a AlphaGo.]*

El tercer paradigma es el aprendizaje **por refuerzo**, y aprende como un niño que toca una estufa caliente: probando, recibiendo la consecuencia y ajustando. Nadie le dijo al niño «no toques»; lo aprendió por experiencia.

Técnicamente, funciona así: un **agente** toma acciones, recibe **recompensas** cuando lo hace bien o **castigos** cuando lo hace mal, y con eso va optimizando su estrategia hasta volverse experto.

*[Señale el recuadro del ejemplo.]* El caso más icónico es AlphaGo, de la empresa DeepMind, en el año dos mil dieciséis. DeepMind entrenó una inteligencia artificial para jugar Go, que es considerado el juego de tablero más complejo del mundo. La hicieron jugar millones de partidas contra sí misma. Y en ese proceso aprendió estrategias que ningún ser humano había descubierto en tres mil años de historia del juego. Terminó venciendo al campeón mundial, Lee Sedol, que es la persona que ven en la fotografía. Fue un momento histórico para la inteligencia artificial.

---

## Diapositiva 19 · Comparación: tres formas de aprender
**[⏱ 40:30 – 45:30 · 5 min, incluye transición a §03]**

*[Al pasar a la diapositiva. Aparece una tabla comparativa.]*

Recojamos los tres paradigmas en una sola tabla, para que quede claro.

*[Recorra la tabla fila por fila.]* En el aprendizaje **supervisado**, ¿hay respuestas? Sí. La analogía es el estudiante con profesor, y el ejemplo, el filtro de spam.

En el **no supervisado**, ¿hay respuestas? No. La analogía es un explorador sin mapa, que tiene que encontrar la estructura por su cuenta, y el ejemplo es la segmentación de clientes.

Y en el aprendizaje **por refuerzo**, ¿hay respuestas? Parcialmente: hay recompensas y castigos, pero no una respuesta correcta dada de entrada. La analogía es un niño aprendiendo a caminar, y el ejemplo es AlphaGo.

*[Señale el recuadro inferior.]* Un último detalle importante: en la práctica, muchos sistemas **combinan** varios enfoques. ChatGPT, por ejemplo, usa aprendizaje supervisado **y** aprendizaje por refuerzo —lo que se conoce como RLHF, aprendizaje por refuerzo con retroalimentación humana—. No son cajones separados; se pueden mezclar.

*[Transición.]* Ya sabemos cómo aprende un modelo y de cuántas formas. Ahora la pregunta práctica: ¿qué tipos de modelos existen y cuál sirve para cada tarea?

---

## Diapositiva 20 · Divisor §03 — «Tipos de modelos y sus aplicaciones»
**[⏱ 45:30 – 46:00 · 0.5 min]**

*[Al pasar al divisor de sección.]*

Parte tres: los tipos de modelos y sus aplicaciones. La pregunta que nos guía en toda esta sección es muy práctica: ¿qué herramienta para qué tarea?

---

## Diapositiva 21 · No hay modelo universal
**[⏱ 46:00 – 48:00 · 2 min]**

*[Al pasar a la diapositiva.]*

Y lo primero que hay que decir es que **no existe un modelo universal**. Así como no hay una sola herramienta que sirva para toda la construcción, en inteligencia artificial no hay un modelo que sirva para todo.

*[Señale la columna de la izquierda.]* Un martillo es excelente para clavar, pero es terrible para atornillar. Con los modelos pasa igual: un clasificador es buenísimo categorizando documentos, pero no genera texto. Y un modelo de lenguaje redacta informes espléndidos, pero no sirve para detectar fraude en una tabla de números.

*[Señale el recuadro de la derecha.]* Por eso, elegir el modelo correcto para el problema correcto es una de las decisiones más importantes en cualquier proyecto de inteligencia artificial. Un proyecto puede fracasar no porque la tecnología sea mala, sino porque se escogió la herramienta equivocada. Veamos entonces las principales.

---

## Diapositiva 22 · Árboles de decisión
**[⏱ 48:00 – 50:00 · 2 min]**

*[Al pasar a la diapositiva. A la derecha, un diagrama de árbol.]*

El primero es uno de los modelos más intuitivos que existen: el **árbol de decisión**. Funciona exactamente como un diagrama de flujo, con preguntas de sí o no que nos van llevando a una conclusión.

*[Señale el diagrama de la derecha.]* Miren el ejemplo: ¿está nublado? Si no, no llevo paraguas. Si sí, paso a la siguiente pregunta: ¿la probabilidad de lluvia es mayor al sesenta por ciento? Si no, no llevo paraguas; si sí, llevo paraguas. Así de simple y así de transparente.

*[Señale la lista de la izquierda.]* Y esa transparencia es su gran **ventaja**: son fáciles de entender, de explicar y —muy importante para ustedes— de **auditar**. Uno puede seguir exactamente por qué el modelo tomó una decisión. Su **desventaja** es que a veces son demasiado simples para problemas muy complejos. Se usan mucho en diagnóstico médico, en evaluación de crédito y en la clasificación o *triage* de solicitudes. Cuando necesiten un modelo que puedan explicarle a un juez o a un ciudadano, el árbol de decisión es su mejor amigo.

---

## Diapositiva 23 · Redes neuronales
**[⏱ 50:00 – 52:00 · 2 min]**

*[Al pasar a la diapositiva.]*

En el otro extremo de la transparencia están las **redes neuronales**, que son el modelo detrás de casi toda la revolución actual de la inteligencia artificial. Se inspiran, muy vagamente, en las conexiones de neuronas de nuestro cerebro: son capas de neuronas artificiales conectadas entre sí, donde cada una recibe información, la procesa y la pasa a la siguiente capa.

*[Señale las tres capas.]* Véanlo con un ejemplo de reconocer un gato en una foto. La **primera capa** detecta cosas simples: bordes, formas. La **segunda capa** combina esos bordes en patrones: un ojo, una nariz, una oreja. Y la **tercera capa** junta todo y concluye: «esto es un gato». Cada capa construye sobre la anterior.

*[Señale el recuadro inferior.]* Y aquí aparece un término que seguramente han escuchado: *deep learning*, o aprendizaje profundo. No es más que una red neuronal con **muchas** capas: decenas, o incluso cientos. Ese es todo el secreto detrás de la palabra «profundo».

---

## Diapositiva 24 · Modelos de Lenguaje (LLMs)
**[⏱ 52:00 – 54:30 · 2.5 min]**

*[Al pasar a la diapositiva.]*

Y esto nos lleva a las estrellas del momento: los **modelos de lenguaje**, o LLM por sus siglas en inglés. Son la tecnología detrás de ChatGPT, de Claude y de Gemini. Básicamente son redes neuronales enormes, especializadas en texto.

¿Y cómo funcionan? Aquí viene lo que más sorprende a la gente. Funcionan **prediciendo la siguiente palabra más probable**. Es como el autocompletado del celular, pero a una escala incomparablemente mayor.

*[Señale el recuadro con las barras.]* Miren el ejemplo: «El gato se sentó en el...». El modelo calcula las probabilidades de cada posible palabra siguiente. «Tejado», con un treinta por ciento. «Sofá», con un veinticinco. «Jardín», con un quince. Y escoge según esas probabilidades.

*[Señale el recuadro oscuro inferior.]* Ahora, lo importante: este proceso tan simple, repetido miles de veces, palabra tras palabra, produce textos coherentes y que parecen inteligentes. Pero —y subrayo esto— es **predicción estadística, no comprensión real**. El modelo no «entiende» lo que dice como lo entendemos nosotros; está calculando probabilidades a una escala gigantesca. Tener esto claro es lo que nos permite usar estas herramientas con criterio y no creerles ciegamente.

---

## Diapositiva 25 · Cómo se entrenó ChatGPT
**[⏱ 54:30 – 56:30 · 2 min]**

*[Al pasar a la diapositiva. Aparecen tres tarjetas: Etapa 1, 2 y 3.]*

¿Y cómo se logra que un modelo así, además de coherente, sea útil y educado? Con tres etapas de entrenamiento. Tomemos ChatGPT como ejemplo.

*[Señale la Etapa 1.]* La **etapa uno** es el **pre-entrenamiento**. Se le da al modelo cantidades masivas de texto y aprende gramática, hechos del mundo y a razonar. Es como si leyera una biblioteca entera.

*[Etapa 2.]* La **etapa dos** es el **ajuste fino**. Se le muestran ejemplos de conversaciones bien hechas y aprende a seguir instrucciones y a comportarse como un asistente. Es como tomar un curso de comunicación profesional.

*[Etapa 3.]* Y la **etapa tres** es el **RLHF**, el refuerzo con retroalimentación humana. Evaluadores humanos califican las respuestas del modelo, y este aprende qué respuestas prefieren las personas. Es como un pasante que va mejorando gracias a la retroalimentación de su jefe. De estas tres etapas sale el ChatGPT que ustedes conocen.

---

## Diapositiva 26 · Modelos de visión
**[⏱ 56:30 – 58:30 · 2 min]**

*[Al pasar a la diapositiva. Dos tarjetas.]*

Pasemos del texto a la imagen. Los **modelos de visión** permiten que las máquinas interpreten imágenes y videos. Una aclaración técnica útil: para una computadora, una imagen no es más que una tabla de números —los píxeles—, y el modelo aprende a encontrar patrones en esos números.

*[Señale la tarjeta izquierda.]* En lo **cotidiano**, ya los usamos todos los días: el Face ID que desbloquea el celular, Google Photos que reconoce caras, las cámaras de tránsito que leen placas, los filtros de las redes sociales.

*[Señale la tarjeta derecha.]* Y en lo **profesional**, el impacto es enorme: diagnóstico de cáncer a partir de radiografías, control de calidad en la industria, reconocimiento de texto —lo que llamamos OCR— para digitalizar documentos, y clasificación de imágenes satelitales. Piensen en lo que esto significa para digitalizar y analizar los archivos físicos de una entidad pública.

---

## Diapositiva 27 · Modelos de difusión
**[⏱ 58:30 – 60:30 · 2 min]**

*[Al pasar a la diapositiva. Tres tarjetas.]*

El último gran tipo son los **modelos de difusión**, que son los modelos generativos de imagen y video. Estos aprenden a **crear** datos nuevos y realistas a partir de ruido aleatorio. La idea, curiosamente, viene de la termodinámica: es un proceso gradual que va «deshaciendo» el ruido hasta revelar la imagen deseada, como si de estática fuéramos sacando una fotografía nítida.

*[Señale las tres tarjetas.]* Tienen tres grandes usos. Primero, la **generación de imágenes**: arte y fotografía fotorrealista a partir de una simple descripción de texto; ahí están DALL·E y Midjourney. Segundo, la **edición de contenido**: modificar y expandir imágenes, cambiar estilos, eliminar objetos de forma inteligente; ahí está Adobe Firefly. Y tercero, la **creación multimodal**: generar audio y video con alta coherencia; ahí están Sora y Seedance. Este es el mundo que veremos con más detalle en el módulo tres del curso.

---

## Diapositiva 28 · Mapa de modelos (interactivo)
**[⏱ 60:30 – 63:30 · 3 min]**

*[Al pasar a la diapositiva. A la izquierda, seis botones; a la derecha, un panel que cambia al hacer clic.]*

Cerremos esta parte con un mapa que junta todo. La pregunta correcta antes de arrancar cualquier proyecto de inteligencia artificial es siempre la misma: **¿qué tipo de salida necesito?** Según la respuesta, sé qué familia de modelos usar. Vamos a recorrer las seis. *[Vaya haciendo clic en cada botón mientras narra.]*

*[Clic en «Categorizar».]* Si lo que necesito es **categorizar** —«¿a qué grupo pertenece este ejemplo?»—, como spam o no spam, o fraude o transacción legítima, entonces uso modelos de **clasificación**: árboles de decisión, regresión logística o redes neuronales clasificadoras.

*[Clic en «Predecir un número».]* Si necesito **predecir un número** —«¿cuánto?»—, cuánto costará algo o cuánto tardará un trámite, uso modelos de **regresión**: regresión lineal, *gradient boosting* o redes neuronales.

*[Clic en «Encontrar grupos».]* Si necesito **encontrar grupos** que no había definido de antemano, uso **clustering**: K-means, DBSCAN o métodos jerárquicos.

*[Clic en «Generar texto».]* Si necesito **generar texto** —redactar, resumir, traducir, responder—, uso **modelos de lenguaje**: ChatGPT, Claude, Gemini.

*[Clic en «Interpretar imágenes».]* Si necesito **interpretar imágenes** —reconocer objetos, leer documentos escaneados, analizar radiografías—, uso **modelos de visión**: redes convolucionales o *Vision Transformers*.

*[Clic en «Detectar lo raro».]* Y si necesito **detectar lo raro** —fraude, fallas, comportamientos inusuales—, uso modelos de **detección de anomalías**: *isolation forest*, autoencoders o modelos estadísticos.

*[Transición.]* Con este mapa ya podrían, ante cualquier problema, empezar a intuir qué tipo de modelo aplica. Pero hay algo que determina el éxito por encima de todos estos modelos, y es el tema de la siguiente parte.

---

## Diapositiva 29 · Divisor §04 — «La calidad de los datos lo es todo»
**[⏱ 63:30 – 64:00 · 0.5 min]**

*[Al pasar al divisor de sección.]*

Parte cuatro: la calidad de los datos lo es todo. Aquí va la frase que quiero que se lleven de toda la noche: basura entra, basura sale. Y con ella vienen los sesgos.

---

## Diapositiva 30 · GIGO: Garbage In, Garbage Out
**[⏱ 64:00 – 66:00 · 2 min]**

*[Al pasar a la diapositiva.]*

Este principio en inglés se conoce como *Garbage In, Garbage Out* —basura entra, basura sale— y en inteligencia artificial es más crítico que en cualquier otro campo. Significa que, si los datos son malos, los resultados serán malos, **sin importar** lo sofisticado que sea el algoritmo.

*[Señale el recuadro oscuro.]* La analogía es la cocina. Un chef extraordinario, con ingredientes frescos, produce un plato espectacular. Pero ese mismo chef, con ingredientes podridos, va a producir un plato incomible. No importa qué tan bueno sea el chef: no puede salvar ingredientes malos.

*[Señale las dos tarjetas inferiores.]* Y aquí está la traducción exacta: los **datos son los ingredientes** —ellos ponen el techo de calidad de todo el sistema— y el **algoritmo es el chef** —puede lucirse, pero no puede rescatar datos podridos—. Por eso, en cualquier proyecto de IA, la pregunta por los datos va **antes** que la pregunta por el modelo.

---

## Diapositiva 31 · ¿Qué hace buenos a los datos? (interactivo)
**[⏱ 66:00 – 69:00 · 3 min]**

*[Al pasar a la diapositiva. Cinco botones a la izquierda; panel a la derecha.]*

Entonces, ¿qué es lo que hace que unos datos sean buenos? Hay cinco propiedades fundamentales. Vamos una por una. *[Haga clic en cada propiedad mientras narra.]*

*[Clic en «Representatividad».]* La primera es la **representatividad**: los datos tienen que reflejar la realidad completa. Un modelo de reconocimiento facial entrenado solo con pieles claras va a fallar con pieles oscuras. Y aquí una aplicación directa para la Contraloría: si los datos de auditoría solo cubren ciertos sectores, el modelo nunca va a detectar patrones en los sectores que no están representados.

*[Clic en «Completitud».]* La segunda es la **completitud**: los datos deben cubrir los casos importantes sin vacíos. Cuando faltan valores en variables críticas, se distorsionan los patrones que el modelo aprende.

*[Clic en «Actualización».]* La tercera es la **actualización**: los datos deben ser recientes y relevantes. Un modelo entrenado con datos de dos mil quince no conoce la pandemia del COVID ni los cambios normativos posteriores. El mundo cambia, y los datos también tienen que hacerlo.

*[Clic en «Etiquetado correcto».]* La cuarta es el **etiquetado correcto**: las respuestas asociadas a cada ejemplo deben ser verdaderas. Si las etiquetas están mal, le estamos enseñando al modelo cosas equivocadas. Este es, por cierto, uno de los costos más subestimados de todo proyecto de inteligencia artificial.

*[Clic en «Volumen suficiente».]* Y la quinta es el **volumen suficiente**: sí, más datos suele ayudar, pero ojo con esto: la **calidad le gana a la cantidad**. Mil ejemplos limpios y bien etiquetados valen más que un millón de datos sucios y desordenados.

---

## Diapositiva 32 · ¿Qué es un sesgo en IA? (interactivo)
**[⏱ 69:00 – 72:00 · 3 min]**

*[Al pasar a la diapositiva. Cuatro botones a la izquierda; panel a la derecha.]*

Y esto nos lleva al tema más delicado de la noche: los **sesgos**. Un sesgo en inteligencia artificial es un error **sistemático**, causado por suposiciones incorrectas; son patrones de error que afectan a ciertos grupos de manera desproporcionada. Hay cuatro tipos principales. *[Haga clic en cada uno.]*

*[Clic en «Sesgo en los datos».]* El **tipo A** es el sesgo en los datos: los datos históricos reflejan desigualdades del pasado. Si las decisiones que quedaron registradas fueron sesgadas, el modelo va a aprender ese sesgo como si fuera la verdad. Caso típico: predecir reincidencia usando sentencias que históricamente ya venían sesgadas.

*[Clic en «Sesgo de selección».]* El **tipo B** es el sesgo de selección: los datos no representan a toda la población. Se entrenó con un subgrupo y se aplica a todos. Por ejemplo, una encuesta hecha solo por internet deja por fuera a quienes no usan internet, y el modelo va a extrapolar mal.

*[Clic en «Sesgo de medición».]* El **tipo C** es el sesgo de medición: lo que medimos no captura lo que en realidad queremos predecir. Un ejemplo poderoso: usamos «arrestos» como si fueran «criminalidad», pero los arrestos dependen de dónde patrulla más la policía. Entonces el modelo confunde el patrón policial con el patrón criminal.

*[Clic en «Sesgo de confirmación».]* Y el **tipo D** es el sesgo de confirmación: quienes diseñan el modelo, sin darse cuenta, escogen los datos que confirman lo que ya creían y descartan los que los contradicen. El modelo termina «validando» lo que en realidad era un prejuicio.

*[Señale el recuadro rojo inferior.]* Y la conclusión, que es clave: la inteligencia artificial **no crea sesgos nuevos**; lo que hace es **amplificar** los que ya existen en los datos. Veamos dos casos reales que lo demuestran.

---

## Diapositiva 33 · Caso: Amazon y la contratación
**[⏱ 72:00 – 74:00 · 2 min]**

*[Al pasar a la diapositiva.]*

El primer caso es de Amazon. En dos mil dieciocho se reveló que la empresa había desarrollado un sistema de inteligencia artificial para filtrar hojas de vida, y ese sistema resultó ser sexista. Veamos qué pasó, en tres pasos.

*[Señale los tres pasos.]* El **problema**: la industria de la tecnología ha estado dominada por hombres durante décadas, así que en los datos históricos la mayoría de contratados eran hombres. El modelo «aprendió», entonces, que ser hombre era una señal positiva. El **resultado**: el sistema empezó a penalizar las hojas de vida que mencionaban la palabra «mujeres» —por ejemplo, «capitana del equipo femenino de ajedrez»—. Y la **decisión**: al descubrirlo, Amazon canceló el sistema por completo.

*[Señale el recuadro inferior.]* La lección es contundente: los datos históricos reflejan el mundo **como fue**, no como debería ser. Y si no tenemos cuidado, la inteligencia artificial perpetúa las injusticias del pasado.

---

## Diapositiva 34 · Caso: COMPAS y la justicia penal
**[⏱ 74:00 – 76:30 · 2.5 min]**

*[Al pasar a la diapositiva.]*

El segundo caso es todavía más serio, porque afectó decisiones sobre la libertad de las personas. Se llama COMPAS: un sistema que se usó en tribunales de Estados Unidos para predecir la reincidencia criminal, es decir, la probabilidad de que un acusado volviera a delinquir. En dos mil dieciséis, una investigación del medio ProPublica reveló que tenía sesgos raciales.

*[Señale las dos tarjetas.]* Los hallazgos: el sistema era **dos veces más propenso** a etiquetar falsamente a los acusados afroamericanos como futuros criminales. Y, al revés, era más propenso a etiquetar falsamente a los acusados blancos como de bajo riesgo.

*[Señale el primer recuadro.]* Y algo fundamental: el algoritmo no era «racista» a propósito; nadie programó esa intención. Simplemente, los datos con los que se entrenó reflejaban las disparidades históricas del sistema de justicia.

*[Señale el recuadro rojo y lance la pregunta al grupo.]* Y aquí quiero dejarles una pregunta para que se la lleven pensando: ¿qué sesgos históricos podrían existir en los datos del sector público colombiano? *[Pausa breve; si alguien quiere intervenir, escúchelo; si no, continúe.]* Es una pregunta incómoda, pero es exactamente el tipo de pregunta que ustedes, desde el control fiscal, están llamados a hacer.

---

## Diapositiva 35 · Divisor §05 — «Evaluar un modelo»
**[⏱ 76:30 – 77:00 · 0.5 min]**

*[Al pasar al divisor de sección.]*

Parte cinco, y última antes del ejercicio: cómo evaluar un modelo. Métricas, falsos positivos y falsos negativos. En el fondo, la pregunta es: ¿cuándo podemos confiar en una inteligencia artificial?

---

## Diapositiva 36 · Métricas de evaluación
**[⏱ 77:00 – 79:30 · 2.5 min]**

*[Al pasar a la diapositiva. Dos tarjetas.]*

Cuando alguien nos dice «este modelo acierta el noventa por ciento de las veces», esa cifra sola no nos dice mucho. Necesitamos dos métricas más finas.

*[Señale la primera tarjeta.]* La primera es la **precisión**. Responde a: de todo lo que el modelo marcó como positivo, ¿cuánto era realmente positivo? Dicho con una imagen: de todas las alarmas de incendio que sonaron, ¿cuántas correspondían a incendios de verdad?

*[Señale la segunda tarjeta.]* La segunda es la **exhaustividad**. Responde a: de todos los casos positivos que existían de verdad, ¿cuántos alcanzó a detectar el modelo? Con la misma imagen: de todos los incendios que efectivamente ocurrieron, ¿cuántos lograron activar la alarma?

*[Señale el recuadro inferior.]* Y aquí está lo importante: el equilibrio entre las dos **depende del contexto**. En la detección de cáncer queremos altísima exhaustividad: no se nos puede escapar ningún caso, aunque eso implique algunas falsas alarmas. En cambio, en un filtro de spam preferimos alta precisión: es preferible que se cuele algún spam, y no que un correo importante termine en la basura. No hay una respuesta única; depende de qué error es más costoso.

---

## Diapositiva 37 · Falsos positivos vs. falsos negativos
**[⏱ 79:30 – 84:00 · 4.5 min, incluye transición]**

*[Al pasar a la diapositiva. Dos columnas: falso positivo y falso negativo.]*

Y esto nos lleva a los dos tipos de error que puede cometer cualquier modelo, un concepto que quiero que dominen perfectamente.

*[Señale la columna oscura de la izquierda.]* El **falso positivo** es cuando el modelo dice «sí», y en realidad era «no». La alarma suena, pero no hay fuego. El filtro marca como spam un correo que era legítimo.

*[Señale la columna de la derecha.]* El **falso negativo** es lo contrario: el modelo dice «no», y en realidad era «sí». Hay incendio, pero la alarma no suena. Un correo de *phishing*, de estafa, se cuela y llega a la bandeja de entrada.

*[Señale el primer recuadro.]* ¿Cuál de los dos es peor? Depende del contexto. En medicina, un falso negativo —no detectar una enfermedad que sí está— puede ser fatal. En un filtro de spam, un falso positivo —perder un correo legítimo— es molesto, pero no grave.

*[Señale el recuadro oscuro final, y plantéelo al grupo.]* Y llevémoslo a su terreno: en el control fiscal, ¿qué es peor? ¿Señalar por error a una entidad que en realidad estaba haciendo bien las cosas —un falso positivo—, o **no** detectar una irregularidad que sí estaba ocurriendo —un falso negativo—? *[Pausa breve.]* No hay respuesta única, pero tener clara esa pregunta es lo que les va a permitir evaluar con criterio cualquier sistema de inteligencia artificial que les propongan.

*[Transición.]* Y con esto llegamos al momento en que ustedes toman el control. Pasemos al ejercicio.

---

## Diapositiva 38 · Divisor §06 — «Ejercicio participativo»
**[⏱ 84:00 – 84:30 · 0.5 min]**

*[Al pasar al divisor de sección.]*

Parte seis: ejercicio participativo. Vamos a conectar todos los conceptos de esta noche con su realidad institucional.

---

## Diapositiva 39 · Ejercicio: pensando como científicos de datos
**[⏱ 84:30 – 87:30 · 3 min]**

*[Al pasar a la diapositiva. Cuatro pasos numerados.]*

Aquí va el ejercicio. Les voy a pedir que piensen como científicos de datos por un momento, siguiendo cuatro pasos.

*[Lea los cuatro pasos pausadamente.]* Paso uno, **identificar**: elijan un proceso de su dependencia que sea repetitivo o que maneje grandes volúmenes de información. Paso dos, **clasificar**: pregúntense qué tipo de aprendizaje necesitaría ese proceso: ¿clasificación, descubrimiento de patrones, o decisiones secuenciales? Paso tres, **evaluar los datos**: ¿qué datos necesitarían? ¿existen ya? ¿en qué formato están? ¿son de buena calidad? ¿qué sesgos podrían tener? Y paso cuatro, **analizar los errores**: ¿qué error sería más grave en ese proceso, un falso positivo o un falso negativo?

*[Señale el recuadro inferior y dé la instrucción.]* Les propongo lo siguiente: tómense **cinco minutos** para pensarlo de manera individual, cada uno con un proceso concreto de su trabajo, y después compartimos algunas ideas en grupo. *[Inicie el conteo de cinco minutos. Durante ese tiempo, puede caminar y resolver dudas puntuales.]*

*[Al cabo de los cinco minutos, invite a compartir.]* Muy bien, vamos a escuchar a dos o tres. ¿Quién quiere contarnos qué proceso escogió y qué respondió? *[Modere dos o tres intervenciones y conéctelas con los conceptos de la sesión.]*

---

## Diapositiva 40 · Resumen de la sesión
**[⏱ 87:30 – 89:00 · 1.5 min]**

*[Al pasar a la diapositiva. Seis tarjetas.]*

Recojamos entonces las seis ideas para llevarse de esta noche.

Uno: **datos más algoritmo es igual a modelo**; ese es el ciclo fundamental del aprendizaje automático. Dos: hay **tres tipos de aprendizaje** —supervisado, no supervisado y por refuerzo—. Tres: los **modelos son especializados**; cada tarea tiene su herramienta apropiada. Cuatro: los **datos son críticos**; su calidad determina el resultado, porque basura entra, basura sale. Cinco: los **sesgos son reales**, y los modelos amplifican los que ya vienen en los datos. Y seis: las **métricas importan**; la precisión, la exhaustividad y el balance entre falsos positivos y falsos negativos dependen siempre del contexto.

Si se llevan estas seis ideas, se llevan lo esencial de la noche.

---

## Diapositiva 41 · Reflexión final (cita)
**[⏱ 89:00 – 89:30 · 0.5 min]**

*[Al pasar a la diapositiva de la cita, sobre fondo oscuro.]*

Y quiero cerrar con una frase que resume todo: *La inteligencia artificial no es magia; es matemáticas aprendiendo de datos.* Entender esto es justamente lo que les da a ustedes el poder de evaluar con criterio cualquier propuesta de inteligencia artificial que llegue a su escritorio.

---

## Diapositiva 42 · Cierre — próxima sesión
**[⏱ 89:30 – 90:00 · 0.5 min]**

*[Al pasar a la diapositiva de cierre.]*

Muchas gracias por su participación y por su atención esta noche. Nuestra próxima sesión es la número tres, del módulo dos: *Modelos generativos de lenguaje*, con el profesor Juan Carlos Cruz; será el lunes once de mayo a las nueve de la mañana. Cualquier inquietud, mi correo está en pantalla: ele-hache punto reyes, arroba uniandes punto edu punto co. Que tengan muy buenas noches y nos vemos el lunes.

---

*Fin del guión — duración total: 90 minutos · 42 diapositivas.*
