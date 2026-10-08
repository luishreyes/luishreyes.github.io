// Herramienta «Clasifique su reto» · SPDP 2026-20 · sesión 06.
//
// Reglas de clasificación: diagrama de auto-clasificación de riesgo del Comité
// de Ética de la Facultad de Ingeniería (transcrito en
// sPDP/202620/presentaciones/corridas/2026-10-06-arbol-riesgo-comite.json) con
// las ambigüedades resueltas por el profesor como miembro del Comité el 7 de
// octubre de 2026 (corridas/2026-10-07-respuestas-profesor-comite.md). Esas
// respuestas mandan: se responden siempre las tres preguntas y vale el nivel
// mayor; un Sí en 1.2 es mayor al mínimo; personas con No en 1.1–1.5 es mínimo;
// un conflicto de interés es mínimo.
//
// Documentos y URL: página del Comité consultada el 6 de octubre de 2026
// (corridas/2026-10-06-documentos-comite-etica.md).

export type Nivel = 0 | 1 | 2; // sin riesgo · riesgo mínimo · riesgo mayor al mínimo

export const NIVEL_NOMBRE: Record<Nivel, string> = {
  0: 'Sin riesgo',
  1: 'Riesgo mínimo',
  2: 'Riesgo mayor al mínimo',
};

export const NIVEL_REVISA: Record<Nivel, string> = {
  0: 'Lo revisa el coordinador. El aval es casi automático, pero la solicitud se envía igual: en este seminario todos los equipos la envían, y el proceso obliga a hacer el curso de ética.',
  1: 'Va al Comité de Ética de la Facultad, que se reúne cada ocho días. Revisa que no se identifique a nadie y también qué se pregunta.',
  2: 'Va al Comité de Ética de la Facultad, con la carta de aval del asesor. Es el nivel que más revisa el Comité: envíe la solicitud completa y con tiempo.',
};

export interface Documento {
  id: string;
  titulo: string;
  detalle: string;
  url?: string;
  urlTexto?: string;
}

const BASE = 'https://ingenieria.uniandes.edu.co/sites/default/files';
const CE = `${BASE}/facultad-ingenieria/documentos/vicedecanatura-investigacion-doctorados/comite-etica`;

export const PLATYPUS = 'https://platypus.uniandes.edu.co/';
export const CORREO_COMITE = 'etica-ing@uniandes.edu.co';
export const PAGINA_COMITE = 'https://ingenieria.uniandes.edu.co/es/investigacion-innovacion/investigacion/comites/comite-etica';

export const OBLIGATORIOS: Documento[] = [
  {
    id: 'certificado',
    titulo: 'Certificado del curso de ética de la investigación',
    detalle: 'Del curso de Bloque Neón o del CITI Program. Es el primer documento de la solicitud y, sin él, la entrega final queda incompleta.',
  },
  {
    id: 'aval',
    titulo: 'Carta de aval del asesor',
    detalle: 'Su asesor declara que revisó el proyecto y que lo acompañará. Formato 2026-20 del Comité.',
    url: `${CE}/CartaAval_Profesor_202620.docx`,
    urlTexto: 'Formato de la carta (.docx)',
  },
  {
    id: 'protocolo',
    titulo: 'Protocolo de datos',
    detalle: 'Qué datos recoge, para qué, cómo los protege y cuándo los elimina. Si no necesita un dato personal, no lo pida.',
    url: `${CE}/Guia%20protocolo%20de%20datos.pdf`,
    urlTexto: 'Guía de protocolo de datos (PDF)',
  },
];

export type Plantilla = 'encuestas' | 'pantallas' | 'biomedico' | 'alimentos';

export const PLANTILLAS: Record<Plantilla, Documento> = {
  encuestas: {
    id: 'consentimiento-encuestas',
    titulo: 'Consentimiento informado · encuestas y entrevistas',
    detalle: 'La plantilla del Comité para instrumentos de preguntas. Se adapta y se revisa con la lista de chequeo.',
    url: `${BASE}/consentimiento-informado-encuestas-entrevistas.docx`,
    urlTexto: 'Plantilla (.docx)',
  },
  pantallas: {
    id: 'consentimiento-pantallas',
    titulo: 'Consentimiento informado · videojuegos, pantallas, realidad virtual',
    detalle: 'La plantilla del Comité para pruebas con interfaces. Se adapta y se revisa con la lista de chequeo.',
    url: `${BASE}/consentimiento-informado-video_juegos-pantallas-realidad-virtual.docx`,
    urlTexto: 'Plantilla (.docx)',
  },
  biomedico: {
    id: 'consentimiento-biomedico',
    titulo: 'Consentimiento informado · experimentos biomédicos',
    detalle: 'La plantilla del Comité para procedimientos sobre el cuerpo. Se adapta y se revisa con la lista de chequeo.',
    url: `${BASE}/consentimiento-informado-experimentos-biomedicos.docx`,
    urlTexto: 'Plantilla (.docx)',
  },
  alimentos: {
    id: 'consentimiento-alimentos',
    titulo: 'Consentimiento informado · alimentos y pruebas sensoriales',
    detalle: 'Versión 2026. Trae la tabla de ingredientes y la pregunta de alergias. Es la más cercana a un panel sensorial o de producto.',
    url: `${CE}/consentimiento-informado-alimentos-2026.docx`,
    urlTexto: 'Plantilla 2026 (.docx)',
  },
};

export const LISTA_CHEQUEO: Documento = {
  id: 'lista-chequeo',
  titulo: 'Lista de chequeo del consentimiento',
  detalle: 'Para revisar el consentimiento antes de enviarlo. La primera pregunta es si los datos quedan anonimizados.',
  url: `${CE}/lista-chequeo-consentimiento-informado.pdf`,
  urlTexto: 'Lista de chequeo (PDF)',
};

export const INSTRUMENTO: Documento = {
  id: 'instrumento',
  titulo: 'Instrumento de recolección',
  detalle: 'La encuesta, la guía de entrevista o la ficha de la prueba, tal como la verán los participantes.',
};

export const ASENTIMIENTO: Documento = {
  id: 'asentimiento',
  titulo: 'Asentimiento del menor y consentimiento de sus padres o acudientes',
  detalle: 'Con menores de 18 años van los dos: el menor asiente y el adulto responsable consiente.',
};

export const CICUA: Documento = {
  id: 'cicua',
  titulo: 'Aval del Comité CICUA',
  detalle: 'El Comité Institucional de Cuidado y Uso de Animales avala el trabajo con animales antes de que el Comité de Ética lo revise.',
};

export const ACUERDO_EMPRESA: Documento = {
  id: 'acuerdo-empresa',
  titulo: 'Acuerdo firmado estudiante-empresa',
  detalle: 'Lo firman los estudiantes y el representante legal: uso académico, confidencialidad y aval del Comité antes de empezar. Los resultados no son consultoría ni concepto técnico.',
  url: `${BASE}/formato_acuerdo_estudiante-empresa_comite_de_etica.docx`,
  urlTexto: 'Formato del acuerdo (.docx)',
};

export const SALIDA_CAMPUS: Documento = {
  id: 'salida',
  titulo: 'Certificado del curso de gestión de riesgos de salida del campus y permisos de salida académica',
  detalle: 'Para trabajo de campo fuera de la Universidad.',
};

export const MICROORGANISMOS: Documento = {
  id: 'micro',
  titulo: 'Protocolos de laboratorio revisados por Salud y Seguridad en el Trabajo',
  detalle: 'Para trabajo con microorganismos o patógenos. Es una revisión aparte del Comité.',
};

export const COLECTA: Documento = {
  id: 'colecta',
  titulo: 'Permisos de colecta',
  detalle: 'Para recolección de plantas o animales.',
};

export const PROTOTIPO: Documento = {
  id: 'prototipo',
  titulo: 'Informe técnico del prototipo con su protocolo experimental',
  detalle: 'Cuando el prototipo se valida con usuarios. La validación cuenta como trabajo con personas.',
};

export const IAG: Documento = {
  id: 'iag',
  titulo: 'Declaración de uso de IA generativa',
  detalle: 'Qué sistema usó, cómo y para qué. Nunca ponga en un prompt datos de los participantes ni información confidencial de la empresa.',
  url: `${CE}/lineamientos-uso-inteligencia-artificial-generativa-IAG-uniandes.pdf`,
  urlTexto: 'Lineamientos de IAG de Uniandes (PDF)',
};

export const FECHAS_2026_20 = [
  { fecha: 'Jue 12 nov', que: 'Sesión del Comité' },
  { fecha: 'Mié 18 nov', que: 'Envíe su solicitud por Platypus (penúltima clase)' },
  { fecha: 'Jue 19 nov', que: 'Sesión del Comité' },
  { fecha: 'Mié 25 nov', que: 'Entrega final, con la constancia de envío' },
  { fecha: 'Jue 26 nov', que: 'Sesión del Comité' },
];
