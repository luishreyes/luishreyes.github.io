import React from 'react';
import { ReadingLayout } from '../../../../components/classroom/ReadingLayout';
import { getCourseBySlug } from '../../../../components/data/classroom';

const TrabajoEnEquipo: React.FC = () => {
  const course = getCourseBySlug('iqya-2031');
  if (!course) return null;
  const reading = course.readings.find((r) => r.slug === 'trabajo-en-equipo');
  if (!reading) return null;

  return (
    <ReadingLayout course={course} reading={reading}>
      {/* ───────────────────────── 1. Introducción ───────────────────────── */}
      <h2>Introducción</h2>
      <p>
        En los proyectos de ingeniería, el trabajo en equipo no es opcional: es la
        forma en que se resuelven problemas reales. Ninguna planta química se
        diseña, construye u opera por una sola persona. Sin embargo, no basta con
        juntar gente talentosa en un mismo grupo &mdash; hay una diferencia
        importante entre un <strong>grupo de trabajo</strong> y un{' '}
        <strong>equipo</strong>.
      </p>
      <p>
        Un <strong>grupo de trabajo</strong> opera con baja interdependencia: cada
        miembro cumple su tarea individual, la responsabilidad es personal y la
        coordinación es mínima. Un <strong>equipo</strong>, en cambio, se
        caracteriza por alta interdependencia, responsabilidad compartida y toma de
        decisiones colaborativa. El resultado del equipo depende de cómo se
        integran las contribuciones de todos, no solo de la suma de partes.
      </p>
      <p>
        Para entender qué tan &laquo;equipo&raquo; es tu grupo, piensa en cuatro
        tipos de <strong>interdependencia</strong>:
      </p>
      <ul>
        <li>
          <strong>De objetivos:</strong> compartimos una meta comun cuyo logro
          depende del aporte de todos.
        </li>
        <li>
          <strong>De recursos:</strong> usamos insumos, herramientas o
          información que debemos gestiónar conjuntamente.
        </li>
        <li>
          <strong>De tareas:</strong> mi avance depende de lo que entregue mi
          compañero, y viceversa.
        </li>
        <li>
          <strong>De reconocimiento:</strong> el éxito o fracaso se evalua de
          forma colectiva, no individual.
        </li>
      </ul>
      <p>
        Esta lectura te dará herramientas concretas para pasar de ser un grupo
        que divide tareas a un equipo que construye soluciónes. La aplicarás
        directamente en tu proyecto de Operaciones Unitarias.
      </p>

      {/* ──────── 2. Proyecto Aristóteles ──────── */}
      <h2>El Proyecto Aristóteles: la ciencia detrás de los equipos efectivos</h2>
      <p>
        En 2012, Google se hizo una pregunta aparentemente simple:{' '}
        <em>&iquest;qué hace que un equipo sea efectivo?</em> Para responderla,
        lanzó el <strong>Proyecto Aristóteles</strong>, un estudio que durante dos
        años analizó más de 180 equipos internos. Los investigadores recopilaron
        datos sobre composición (personalidad, habilidades, trayectoria),
        dinámicas de interacción y resultados.
      </p>
      <p>
        La conclusión fue contraintuitiva: la composición del equipo &mdash; quienes
        son sus miembros &mdash; importa mucho menos que <strong>como interactuan</strong>.
        Equipos con perfiles &laquo;perfectos&raquo; sobre el papel fracasaban,
        mientras que otros aparentemente dispares producían resultados
        excepcionales. La clave estaba en las{' '}
        <strong>normás de grupo</strong> (<em>team norms</em>): tradiciones,
        estándares de comportamiento y reglas no escritas que gobiernan la
        convivencia.
      </p>

      <div className="my-8 aspect-video rounded-xl overflow-hidden shadow-lg">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/v2PaZ8Nl2T4"
          title="Google's Project Aristotle — Re:Work"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <p>
        El estudio identificó cuatro características que distinguen a los equipos
        de alto rendimiento:
      </p>

      <h3>Confiabilidad</h3>
      <p>
        Los miembros entregan su trabajo a tiempo y con la calidad acordada. Cuando
        dices &laquo;lo tengo listo para el jueves&raquo;, el equipo puede confiar
        en que así será. Sin confiabilidad, la planificación se vuelve ficción.
      </p>

      <h3>Estructura y claridad</h3>
      <p>
        Cada persona sabe <em>que</em> tiene qué hacer, <em>como</em> se espera
        que lo haga y <em>para cuando</em>. Los objetivos del equipo están
        definidos, los roles son claros y los criterios de calidad son explícitos.
      </p>

      <h3>Propósito</h3>
      <p>
        El trabajo tiene significado personal para cada integrante. No se trata
        solo de &laquo;pasar la materia&raquo;: cada miembro encuentra una
        conexión entre lo que hace y lo que le importa &mdash; aprender, resolver
        un problema real, desarrollar una habilidad profesiónal.
      </p>

      <h3>Seguridad psicológica</h3>
      <p>
        Es la caracteristica más importante y la más difícil de construir. Un
        equipo tiene seguridad psicológica cuando sus miembros sienten que pueden
        tomar riesgos interpersonales sin ser castigados: hacer preguntas
        &laquo;tontas&raquo;, admitir errores, proponer ideas no convencionales o
        pedir ayuda sin temor a ser juzgados.
      </p>
      <p>
        Amy Edmondson, profesora de Harvard y pionera en el estudio de la
        seguridad psicológica, lo resume así: no se trata de ser amable, sino de
        crear un espacio donde la sinceridad sea bienvenida porque el equipo
        entiende que es necesaria para mejorar.
      </p>

      <div className="my-8 aspect-video rounded-xl overflow-hidden shadow-lg">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/LhoLuui9gX8"
          title="Amy Edmondson — Building a psychologically safe workplace"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* ──────── 3. Bienestar del equipo ──────── */}
      <h2>Bienestar del equipo</h2>
      <p>
        Un equipo efectivo no es solo productivo: también cuida a sus miembros.
        El bienestar del equipo tiene tres dimensiónes:
      </p>
      <ul>
        <li>
          <strong>Emocional:</strong> sentirse escuchado, valorado y seguro para
          expresar frustraciónes o preocupaciones sin miedo.
        </li>
        <li>
          <strong>Físico:</strong> respetar horarios de descanso, evitar jornadas
          insostenibles y reconocer que la salud es prerrequisito del rendimiento.
        </li>
        <li>
          <strong>Social:</strong> construir relaciones genuinas que van más allá
          de lo estrictamente académico &mdash; conocerse, generar confianza,
          celebrar los logros.
        </li>
      </ul>

      <h3>Recomendaciones prácticas para momentos dificiles</h3>
      <ul>
        <li>
          <strong>Sistema de respaldo (<em>backup buddy</em>):</strong> cada
          miembro tiene un compañero asignado que conoce su trabajo y puede
          cubrirlo temporalmente si surge una emergencia.
        </li>
        <li>
          <strong>Redistribución de carga:</strong> cuando un integrante enfrenta
          una situación personal compleja, el equipo redistribuye tareas de forma
          explicita y sin culpa. Esto se acuerda en reunión y queda en acta.
        </li>
        <li>
          <strong>Check-in emocional breve:</strong> al inicio de cada reunión,
          dedicar dos minutos a preguntar &laquo;&iquest;como llega cada
          uno?&raquo; No se trata de terapia grupal, sino de calibrar el estado
          del equipo.
        </li>
      </ul>

      <h3>Reconocimiento y celebración</h3>
      <p>
        No esperes al final del semestre para reconocer el buen trabajo. Un
        mensaje breve (&laquo;excelente trabajo con el diagrama de flujo&raquo;)
        o una mención en el acta de reunión refuerza las conductas positivas y
        fortalece la cohesión. Celebra los hitos intermedios: la primera entrega,
        el primer calculo que cierra, la sesion de laboratorio sin incidentes.
      </p>

      {/* ──────── 4. Organización metodológica ──────── */}
      <h2>Organización metodológica</h2>
      <p>
        Sin estructura, la buena intención se diluye. Estas son las herramientas
        organizativas mínimas que tu equipo deberia adoptar desde la primera
        semana.
      </p>

      <h3>Tipos de reunión</h3>
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Duración</th>
            <th>Propósito</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Seguimiento semanal</td>
            <td>60 &ndash; 90 min</td>
            <td>
              Revisar avances, identificar bloqueos, asignar tareas para la
              semana.
            </td>
          </tr>
          <tr>
            <td>Sesion técnica</td>
            <td>Variable</td>
            <td>
              Trabajo colaborativo en calculos, simulaciones o diseno de
              diagramas.
            </td>
          </tr>
          <tr>
            <td>Revision pre-entrega</td>
            <td>~120 min</td>
            <td>
              Revision integral del entregable antes de la fecha limite.
              Verificación de coherencia, formato y requisitos.
            </td>
          </tr>
          <tr>
            <td>Retrospectiva</td>
            <td>~60 min</td>
            <td>
              Reflexion sobre que funcionó, que no y que mejorar. Se realiza
              despues de cada entrega importante.
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Herramientas de comunicación</h3>
      <ul>
        <li>
          <strong>Mensajeria instantanea</strong> (WhatsApp, Slack, Discord):
          coordinación rapida, avisos urgentes. No para decisiones importantes.
        </li>
        <li>
          <strong>Gestion de proyectos</strong> (Trello, Notion, Asana): tablero
          con tareas, responsables, fechas y estados. Visibilidad compartida del
          avance.
        </li>
        <li>
          <strong>Repositorio de documentos</strong> (Google Drive, OneDrive,
          GitHub): carpeta compartida con estructura clara y control de versiones.
        </li>
        <li>
          <strong>Videoconferencia</strong> (Teams, Zoom, Meet): para reuniónes
          cuando no puedan verse presencialmente.
        </li>
        <li>
          <strong>Tableros visuales</strong> (Miro, FigJam): para lluvias de
          ideas, mapas de proceso y diagramas colaborativos.
        </li>
      </ul>

      <h3>Rol de Scrum Master / Coordinador(a)</h3>
      <p>
        Designen a una persona que facilite las reuniónes, lleve el seguimiento
        de las tareas y se asegure de que las normás del equipo se cumplan. Este
        rol no implica más autoridad, sino más responsabilidad operativa. Se
        recomienda rotarlo cada dos o tres semanas para que todos desarrollen
        habilidades de liderazgo.
      </p>

      {/* ──────── 5. Normas y compromisos de equipo ──────── */}
      <h2>Normas y compromisos de equipo</h2>
      <p>
        Las normas son los acuerdos explícitos que regulan la convivencia y el
        trabajo del equipo. Sin ellas, cada persona opera con sus propios
        supuestos &mdash; y los conflictos aparecen cuando esos supuestos chocan.
      </p>

      <h3>Categorias de normas</h3>
      <ul>
        <li>
          <strong>Temporales:</strong> puntualidad en reuniónes, plazos internos
          de entrega, tiempos de respuesta en mensajes.
        </li>
        <li>
          <strong>De calidad:</strong> nivel de detalle esperado, revision cruzada
          antes de entregar, uso de plantillas estandarizadas.
        </li>
        <li>
          <strong>De comunicación:</strong> canales para cada tipo de mensaje,
          frecuencia de actualizaciones, formato de actas.
        </li>
        <li>
          <strong>Interpersonales:</strong> cómo dar y recibir retroalimentación,
          manejo de desacuerdos, trato respetuoso.
        </li>
      </ul>

      <h3>Caracteristicas de una buena norma</h3>
      <p>
        Una norma efectiva es <strong>específica</strong> (sin ambigüedades),{' '}
        <strong>medible</strong> (se puede verificar si se cumple),{' '}
        <strong>consensuada</strong> (todos la aceptan),{' '}
        <strong>realista</strong> (alcanzable dadas las restricciones) y{' '}
        <strong>relevante</strong> (aporta al funcionamiento del equipo).
      </p>

      <h3>Ejemplos de normas con indicadores observables</h3>
      <table>
        <thead>
          <tr>
            <th>Norma</th>
            <th>Indicador observable</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Puntualidad en reuniónes</td>
            <td>
              Asistencia dentro de los primeros 5 minutos en más del 90&nbsp;% de
              las reuniónes.
            </td>
          </tr>
          <tr>
            <td>Entrega interna anticipada</td>
            <td>
              Contribuciones individuales listas al menos 24&nbsp;h antes de la
              fecha de entrega oficial.
            </td>
          </tr>
          <tr>
            <td>Respuesta en mensajeria</td>
            <td>
              Responder mensajes del equipo en un máximo de 12&nbsp;h en dias
              habiles.
            </td>
          </tr>
          <tr>
            <td>Revision cruzada</td>
            <td>
              Todo entregable es revisado por al menos un compañero antes de ser
              enviado.
            </td>
          </tr>
          <tr>
            <td>Retroalimentación constructiva</td>
            <td>
              Los comentarios se formulan con el formato &laquo;observación +
              impacto + sugerencia&raquo;.
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Todas las normás deben quedar documentadas en el{' '}
        <strong>Contrato de Equipo</strong>, que cada miembro firma al inicio del
        semestre.
      </p>

      {/* ──────── 6. Resolución de conflictos ──────── */}
      <h2>Resolución de conflictos</h2>
      <p>
        Los conflictos no son senales de fracaso &mdash; son inevitables cuando
        personas con diferentes perspectivas trabajan juntas bajo presion. Lo que
        importa es cómo se manejan.
      </p>

      <h3>Tres tipos de conflicto</h3>
      <ul>
        <li>
          <strong>De tarea:</strong> desacuerdos sobre el contenido técnico. Por
          ejemplo, que modelo termodinamico usar o cómo dimensiónar un equipo.
          Estos conflictos, bien gestiónados, mejoran la calidad del trabajo.
        </li>
        <li>
          <strong>De proceso:</strong> diferencias sobre cómo organizar el
          trabajo &mdash; quien hace que, cómo se toman las decisiones, que
          herramienta usar.
        </li>
        <li>
          <strong>Interpersonal:</strong> tensiones entre personas basadas en
          percepciones, estilos de comunicación o actitudes. Son los mas
          daninos si no se abordan temprano.
        </li>
      </ul>

      <h3>Protocolo de escalonamiento</h3>
      <ol>
        <li>
          <strong>Diálogo directo:</strong> las personas involucradas conversan en
          privado, usando comunicación asertiva, para resolver el desacuerdo.
        </li>
        <li>
          <strong>Mediación interna:</strong> un tercer miembro del equipo actua
          cómo mediador neutral.
        </li>
        <li>
          <strong>Reunion de equipo:</strong> el conflicto se lleva a la reunión
          semanal para buscar una solución colectiva.
        </li>
        <li>
          <strong>Intervención externa:</strong> si las instancias anteriores no
          funcionan, se acude al asistente del curso o al profesor.
        </li>
      </ol>

      <h3>Tecnicas de comunicación</h3>
      <ul>
        <li>
          <strong>Mensajes-Yo:</strong> en lugar de &laquo;tu nunca
          entregas a tiempo&raquo;, decir &laquo;me siento frustrado cuando las
          entregas se atrasan porque impacta mi parte del trabajo&raquo;. La
          estructura es: <em>siento + cuando + porque</em>.
        </li>
        <li>
          <strong>Escucha activa:</strong> parafrasear lo que dice la otra
          persona antes de responder. &laquo;Si entiendo bien, lo que te
          preocupa es...&raquo;
        </li>
        <li>
          <strong>Enfoque basado en intereses:</strong> ir más allá de las
          posiciones (&laquo;quiero hacer X&raquo;) para entender los intereses
          subyacentes (&laquo;necesito que el calculo sea confiable&raquo;).
        </li>
      </ul>
      <p>
        Todos los acuerdos derivados de la resolución de conflictos deben quedar
        documentados en el acta de reunión correspondiente.
      </p>

      {/* ──────── 7. Roles en el proyecto ──────── */}
      <h2>Roles en el proyecto</h2>
      <p>
        Asignar roles no es &laquo;dividir el trabajo para que cada quien haga lo
        suyo&raquo;. Es una estrategia para que el equipo funcione de manera
        eficiente sin perder la vision integrada del proyecto.
      </p>

      <h3>Principios para la asignación de roles</h3>
      <ul>
        <li>
          <strong>Alineación con competencias:</strong> cada persona asume
          responsabilidades donde puede aportar mas, considerando sus fortalezas
          e intereses.
        </li>
        <li>
          <strong>Carga equilibrada:</strong> ningun rol debe concentrar
          demasiado trabajo ni dejar a otro sin responsabilidades sustantivas.
        </li>
        <li>
          <strong>Desarrollo profesiónal:</strong> los roles también son una
          oportunidad para desarrollar habilidades nuevas, no solo para explotar
          las existentes.
        </li>
        <li>
          <strong>Rotación estratégica:</strong> cuando sea posible, rotar ciertos
          roles (como la coordinación) para que todos ganen experiencia diversa.
        </li>
        <li>
          <strong>Responsabilidad compartida:</strong> aunque cada rol tiene
          responsabilidades específicas, el resultado final es de todos.
        </li>
      </ul>

      <h3>Roles fundamentales</h3>

      <h3>Coordinación general</h3>
      <p>
        Es el &laquo;director de orquesta&raquo; operativo. Sus
        responsabilidades incluyen:
      </p>
      <ul>
        <li>Planificación y seguimiento del cronograma de actividades.</li>
        <li>Facilitación de reuniónes (agenda, tiempos, moderación).</li>
        <li>Seguimiento del cumplimiento de tareas y plazos.</li>
        <li>
          Monitoreo del clima del equipo: detectar tensiones a tiempo y activar
          el protocolo de resolución.
        </li>
      </ul>

      <h3>Lider(es) técnico(s)</h3>
      <p>
        Uno o dos miembros que asumen la responsabilidad de la solidez técnica del
        proyecto:
      </p>
      <ul>
        <li>Profundización en la teoria y los fundamentos del proceso.</li>
        <li>
          Toma de decisiones técnicas justificadas (selección de modelos,
          parametros de diseno, criterios de seguridad).
        </li>
        <li>Gestion de la bibliografía y las fuentes técnicas.</li>
        <li>
          Verificación de la coherencia técnica entre las distintas secciones
          del informe.
        </li>
      </ul>

      <h3>Gestor(a) de documentación</h3>
      <p>
        Responsable de que el equipo produzca documentos de calidad profesiónal:
      </p>
      <ul>
        <li>
          Creación y mantenimiento de plantillas (informe, actas, presentaciones).
        </li>
        <li>
          Control de versiones: asegurar que todos trabajen sobre la version mas
          reciente.
        </li>
        <li>
          Consistencia de estilo: nomenclatura, unidades, formato de figuras y
          tablas.
        </li>
      </ul>

      <h3>Roles complementarios</h3>
      <p>
        Dependiendo del tamano y las necesidades del equipo, pueden incorporarse:
      </p>
      <ul>
        <li>
          <strong>Analista de datos:</strong> procesamiento de datos
          experimentales, graficas, análisis estadistico.
        </li>
        <li>
          <strong>Gestor(a) de compras/logística:</strong> insumos de laboratorio,
          reserva de equipos, permisos.
        </li>
        <li>
          <strong>Vocero(a):</strong> comunicación con otros equipos, con el
          profesor o con actores externos.
        </li>
        <li>
          <strong>Gestor(a) de riesgos:</strong> identificación de riesgos del
          proyecto (técnicos, de cronograma, de seguridad) y planes de
          mitigación.
        </li>
      </ul>
      <p>
        Para equipos pequenos (4 &ndash; 5 integrantes), es necesario combinar
        roles. Por ejemplo, la coordinación general puede fusionarse con la
        voceria, o el lider técnico puede asumir también la gestión de riesgos.
        Lo importante es que cada responsabilidad tenga un nombre asociado.
      </p>

      {/* ──────── 8. Matriz de evaluación ──────── */}
      <h2>Matriz de evaluación</h2>
      <p>
        La evaluación entre pares es una herramienta poderosa para la rendición de
        cuentas y el desarrollo personal. Se deriva directamente de las normás del
        equipo: si acordamos que la puntualidad es importante, entonces la
        evaluamos.
      </p>

      <h3>Estructura de la matriz</h3>
      <p>
        Utilizamos una escala <strong>Likert de 1 a 5</strong> (1&nbsp;= nunca
        cumple, 5&nbsp;= siempre cumple). Cada ciclo de evaluación incluye{' '}
        <strong>autoevaluación</strong> y <strong>evaluación de pares</strong>.
      </p>

      <table>
        <thead>
          <tr>
            <th>Criterio</th>
            <th>Indicador observable</th>
            <th>Peso (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Puntualidad y preparación</td>
            <td>
              Asiste a reuniónes y comparte lectura previa en más del 80&nbsp;% de
              las sesiones.
            </td>
            <td>10</td>
          </tr>
          <tr>
            <td>Cumplimiento de tareas</td>
            <td>
              Entrega a tiempo y con la condición de satisfacción acordada.
            </td>
            <td>20</td>
          </tr>
          <tr>
            <td>Calidad técnica</td>
            <td>
              Propone y justifica decisiones con fundamentos técnicos solidos.
            </td>
            <td>20</td>
          </tr>
          <tr>
            <td>Seguridad y HSE</td>
            <td>
              Reporta riesgos oportunamente y cumple los protocolos de
              seguridad, higiene y medio ambiente.
            </td>
            <td>15</td>
          </tr>
          <tr>
            <td>Colaboración y respeto</td>
            <td>
              Practica escucha activa, ofrece y recibe feedback constructivo.
            </td>
            <td>15</td>
          </tr>
          <tr>
            <td>Documentación</td>
            <td>
              Actualiza actas, repositorios e informes de manera oportuna.
            </td>
            <td>10</td>
          </tr>
          <tr>
            <td>Liderazgo / Apoyo</td>
            <td>
              Toma la iniciativa cuando es necesario y ayuda a destrabar
              bloqueos de compañeros.
            </td>
            <td>10</td>
          </tr>
        </tbody>
      </table>

      <p>
        Durante el semestre se realizan <strong>cinco ciclos de evaluación</strong>,
        alineados con las entregas principales del proyecto. Cada ciclo incluye
        puntuación cuantitativa y un espacio para{' '}
        <strong>comentarios cualitativos</strong>: que esta haciendo bien la
        persona y en que puede mejorar. Los comentarios son tan importantes como
        los numeros &mdash; un 3/5 sin explicación no ayuda a nadie a crecer.
      </p>

      {/* ──────── 9. Entregables ──────── */}
      <h2>Entregables</h2>

      <h3>Contrato de Equipo</h3>
      <p>
        Se entrega en la <strong>semana 2</strong> del semestre, firmado por todos
        los integrantes. Debe incluir:
      </p>
      <ul>
        <li>Normás del equipo (con indicadores observables).</li>
        <li>Asignación de roles y responsabilidades.</li>
        <li>Horarios disponibles y calendario de reuniónes.</li>
        <li>Protocolo de resolución de conflictos.</li>
        <li>Criterios y pesos de la evaluación entre pares.</li>
      </ul>
      <p>
        El contrato es un documento vivo: puede actualizarse durante el semestre
        si el equipo lo acuerda por consenso y lo documenta en acta.
      </p>

      <h3>Actas de reunión semanales</h3>
      <p>Cada acta debe incluir, cómo mínimo:</p>
      <ol>
        <li>
          <strong>Encabezado:</strong> fecha, hora, lugar (o enlace), asistentes y
          ausentes.
        </li>
        <li>
          <strong>Objetivo de la reunión:</strong> que se busca lograr en esta
          sesion.
        </li>
        <li>
          <strong>Decisiones tomadas:</strong> acuerdos concretos con su
          justificación.
        </li>
        <li>
          <strong>Tareas asignadas:</strong> que, quien, para cuando y condición
          de satisfacción.
        </li>
        <li>
          <strong>Riesgos identificados:</strong> potenciales bloqueos y plan de
          mitigación.
        </li>
        <li>
          <strong>Reconocimientos:</strong> contribuciones destacadas de la
          semana.
        </li>
        <li>
          <strong>Proxima reunión:</strong> fecha, hora y temas provisionales.
        </li>
      </ol>

      {/* ──────── 10. Buenas prácticas de documentación ──────── */}
      <h2>Buenas prácticas de documentación</h2>
      <ul>
        <li>
          <strong>Rotar quien toma notas:</strong> no siempre la misma persona.
          Además de distribuir la carga, obliga a todos a prestar atención a la
          estructura de la reunión.
        </li>
        <li>
          <strong>Actualizar dentro de las 24 horas:</strong> un acta que se
          escribe tres dias despues pierde precision y utilidad.
        </li>
        <li>
          <strong>Revision colectiva:</strong> el acta se comparte con todo el
          equipo para corrección antes de considerarse definitiva.
        </li>
        <li>
          <strong>Repositorio centralizado y accesible:</strong> todos los
          documentos en una misma ubicación (carpeta compartida o repositorio),
          con una estructura de carpetas clara y nombres de archivo
          consistentes.
        </li>
      </ul>

      {/* ──────── Cierre ──────── */}
      <blockquote>
        El objetivo no es simplemente dividir el trabajo, sino construir un
        equipo donde cada miembro sea indispensable para el éxito colectivo.
      </blockquote>
    </ReadingLayout>
  );
};

export default TrabajoEnEquipo;
