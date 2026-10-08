// GENERADO por sPDP/202620/presentaciones/datos/exportar-portafolio.py.
// No editar a mano: se sobrescribe. Los archivos que nombra se copian a
// public/classroom/iqya-3050-2026-20/ en la misma corrida.
//
// Ajuste a mano del 8 de octubre de 2026: sesión 6 y formato corregido (sección
// 06). Replicar en el exportador antes de volver a correrlo.

export interface SpdpDocumento {
  id: string;
  titulo: string;
  descripcion: string;
  /** URL absoluta dentro del sitio. */
  archivo: string;
  tipo: 'pdf' | 'docx';
  paginas: number | null;
  peso: string;
  /** Sesión en la que se entrega (para mostrarlo también ahí), o null si es transversal. */
  sesion: number | null;
}

export interface SpdpPresentacion {
  sesion: number;
  titulo: string;
  archivo: string;
  laminas: number | null;
  peso: string;
}

export const spdpDocumentos: SpdpDocumento[] = [
  {
    "id": "programa",
    "titulo": "Programa del curso",
    "descripcion": "Información general, objetivos, metodología, cronograma, evaluación, uso de IA y políticas.",
    "archivo": "/classroom/iqya-3050-2026-20/documentos/IQYA-3050-Programa-2026-20-8B.pdf",
    "tipo": "pdf",
    "paginas": 9,
    "peso": "151 KB",
    "sesion": null
  },
  {
    "id": "guia-propuesta-valor",
    "titulo": "Guía · Propuesta de valor",
    "descripcion": "Qué lleva la Entrega 1 y cómo se construye, paso a paso.",
    "archivo": "/classroom/iqya-3050-2026-20/documentos/IQYA-3050-Guia-Propuesta-de-Valor-2026-20-8B.pdf",
    "tipo": "pdf",
    "paginas": 5,
    "peso": "145 KB",
    "sesion": 4
  },
  {
    "id": "guia-flujograma",
    "titulo": "Guía · Flujograma",
    "descripcion": "Qué lleva la Entrega 2: el proceso completo en un prototipo de papel.",
    "archivo": "/classroom/iqya-3050-2026-20/documentos/IQYA-3050-Guia-Flujograma-2026-20-8B.pdf",
    "tipo": "pdf",
    "paginas": 7,
    "peso": "321 KB",
    "sesion": 6
  },
  {
    "id": "formato-entrega-final",
    "titulo": "Formato · Entrega final",
    "descripcion": "Plantilla en Word de la propuesta final. Se descarga y se llena.",
    "archivo": "/classroom/iqya-3050-2026-20/documentos/IQYA-3050-Formato-Entrega-Final-2026-20-8B.docx",
    "tipo": "docx",
    "paginas": null,
    "peso": "496 KB",
    "sesion": 8
  }
];

export const spdpPresentaciones: SpdpPresentacion[] = [
  {
    "sesion": 1,
    "titulo": "El curso y los retos",
    "archivo": "/classroom/iqya-3050-2026-20/presentaciones/IQYA-3050-Presentacion-Dia1-Curso-Retos-2026-20-8B.pdf",
    "laminas": 29,
    "peso": "377 KB"
  },
  {
    "sesion": 3,
    "titulo": "IA generativa para investigación",
    "archivo": "/classroom/iqya-3050-2026-20/presentaciones/IQYA-3050-Presentacion-Dia3-IA-Investigacion-2026-20-8B.pdf",
    "laminas": 33,
    "peso": "1.5 MB"
  },
  {
    "sesion": 4,
    "titulo": "IA generativa para análisis de datos",
    "archivo": "/classroom/iqya-3050-2026-20/presentaciones/IQYA-3050-Presentacion-Dia4-IA-Analisis-Datos-2026-20-8B.pdf",
    "laminas": 30,
    "peso": "420 KB"
  },
  {
    "sesion": 5,
    "titulo": "Presupuesto y laboratorio",
    "archivo": "/classroom/iqya-3050-2026-20/presentaciones/IQYA-3050-Presentacion-Dia5-Presupuesto-Laboratorio-2026-20-8B.pdf",
    "laminas": 28,
    "peso": "2.1 MB"
  },
  {
    "sesion": 6,
    "titulo": "Ética en investigación",
    "archivo": "/classroom/iqya-3050-2026-20/presentaciones/IQYA-3050-Presentacion-Dia6-Etica-2026-20-8B.pdf",
    "laminas": 24,
    "peso": "335 KB"
  }
];
