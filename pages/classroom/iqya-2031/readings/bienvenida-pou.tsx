import React from 'react';
import { ReadingLayout } from '../../../../components/classroom/ReadingLayout';
import { getCourseBySlug } from '../../../../components/data/classroom';

const BienvenidaPou: React.FC = () => {
  const course = getCourseBySlug('iqya-2031');
  if (!course) return null;
  const reading = course.readings.find((r) => r.slug === 'bienvenida-pou');
  if (!reading) return null;

  return (
    <ReadingLayout course={course} reading={reading}>
      <p>
        Bienvenido al curso de <strong>Proyecto de Operaciones Unitarias (POU)</strong>.
        Este portal es tu espacio para encontrar las lecturas que te ayudarán a prepararte
        cada semana, y las presentaciones que usaremos en clase. Léelo con calma — aquí
        está casi todo lo que necesitas para empezar con buen pie.
      </p>

      <h2>Qué vas a encontrar aquí</h2>
      <ul>
        <li>
          <strong>Lecturas:</strong> entradas breves que acompañan cada podcast semanal
          y te dan el contexto para la clase presencial.
        </li>
        <li>
          <strong>Presentaciones:</strong> las diapositivas HTML que usaremos en clase.
          Se ven bien en laptop, iPad o iPhone.
        </li>
        <li>
          <strong>Enlaces directos:</strong> las fechas clave y políticas también están
          en el landing del curso. Bloque Neón sigue siendo el canal oficial para entregas.
        </li>
      </ul>

      <h2>Primera semana: qué hacer</h2>
      <ol>
        <li>Lee esta entrada completa.</li>
        <li>Revisa el cronograma y la distribución de notas en el landing del curso.</li>
        <li>Confirma que tu equipo ya quedó registrado (grupos de 4-5 personas).</li>
        <li>Agenda las fechas de entregas y coevaluaciones en tu calendario.</li>
      </ol>

      <h2>Sobre la metodología</h2>
      <p>
        Trabajamos con un modelo híbrido <strong>PO-PBL + aula invertida</strong>. Esto
        significa que vas a llegar a clase habiendo escuchado un podcast y leído una
        entrada como esta. Así aprovechamos el tiempo en el salón para profundizar,
        discutir y resolver.
      </p>
      <p>
        Cada semana tiene un ritmo de 3 + 3 + 3 horas: preparación individual, trabajo
        en clase, y aplicación al proyecto. No te atrases — el proyecto se construye
        pieza por pieza, y cada módulo depende del anterior.
      </p>

      <h2>Contacto</h2>
      <p>
        Cualquier pregunta de logística va primero al asistente del curso. Usa siempre
        el asunto <code>[IQYA-2031] – Tema</code> para que no se nos pierda el correo.
      </p>

      <blockquote>
        El objetivo no es que memorices operaciones unitarias. Es que las entiendas lo
        suficientemente bien como para diseñar un proceso real, defender las decisiones
        y comunicarlas con claridad.
      </blockquote>
    </ReadingLayout>
  );
};

export default BienvenidaPou;
