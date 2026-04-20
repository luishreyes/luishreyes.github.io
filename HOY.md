# "¿Qué hay para hoy?" — Guía del cronograma interactivo

> **Leer este documento al agregar o modificar el cronograma de un curso.**

## Qué es

Un botón amarillo "¿Qué hay para hoy?" en el landing del curso que abre un popup oscuro mostrando las actividades de los próximos 7 días. Muestra el tema, detalles, quices, talleres y entregas con badges de colores.

## Arquitectura

```
components/data/classroom.ts       ← Interface CronogramaEntry + campo en Course
components/data/classroom/{curso}.ts ← Array cronograma con todas las semanas
components/classroom/TodayButton.tsx ← Componente botón + modal
pages/classroom/CourseLandingPage.tsx ← Integración en el landing
```

## Tipo CronogramaEntry

```ts
export interface CronogramaEntry {
  date: string;       // ISO: '2026-01-20'
  day: string;        // 'Martes', 'Jueves', 'Lunes'
  week: number;       // Número de semana
  topic: string;      // Tema principal (primera línea)
  details?: string[]; // Sub-bullets del tema
  quiz?: string;      // Nombre del quiz si hay
  taller?: string;    // Nombre del taller si hay
  proyecto?: string;  // Entrega, coevaluación o retroalimentación
}
```

## Cómo agregar cronograma a un curso nuevo

### 1. Parsear el Excel del cronograma

Si el cronograma viene en Excel, usar Python con openpyxl:

```python
import openpyxl
from datetime import datetime, timedelta

wb = openpyxl.load_workbook('cronograma.xlsx', data_only=False)
ws = wb['Cronograma']
# Extraer datos fila por fila, resolver fechas de fórmulas manualmente
```

**Nota:** Los archivos Excel de este curso tienen fórmulas para fechas (`=B2+7`). Hay que resolverlas manualmente conociendo la fecha base (primer martes del semestre).

### 2. Construir el array de TypeScript

Cada entrada del cronograma necesita:
- `date`: fecha ISO calculada a partir de la semana y el día
- `day`: 'Lunes', 'Martes' o 'Jueves'
- `week`: número de semana
- `topic`: tema principal (lo que va antes del primer `•`)
- `details`: array de sub-bullets (lo que va después de cada `•`)
- `quiz`, `taller`, `proyecto`: opcionales

Helper para calcular fechas:
```python
from datetime import datetime, timedelta

# base = primer martes del semestre
base = datetime(2026, 1, 20)

def date_for(week, day_offset):
    """day_offset: -1=Lunes, 0=Martes, 2=Jueves"""
    d = base + timedelta(days=(week-1)*7 + day_offset)
    return d.strftime('%Y-%m-%d')
```

### 3. Agregar al archivo del curso

En `components/data/classroom/{curso}.ts`:

```ts
import type { CronogramaEntry } from '../classroom';

const cronograma: CronogramaEntry[] = [
  {
    date: '2026-01-20',
    day: 'Martes',
    week: 1,
    topic: 'Introducción al curso',
    details: ['Presentación del proyecto', 'Metodología de trabajo'],
  },
  // ... más entradas
];

export const miCurso: Course = {
  // ... otros campos
  cronograma,
};
```

### 4. El componente TodayButton se activa solo

El `TodayButton` ya está integrado en `CourseLandingPage.tsx`. Si el curso tiene `cronograma`, aparece automáticamente. Si no tiene, no se renderiza.

## Comportamiento del componente

- Filtra eventos donde `date >= hoy` y `date < hoy + 7 días`
- Ordena cronológicamente
- Si no hay eventos: muestra "Sin actividades esta semana"
- Si la fecha es hoy: resalta con borde amarillo y etiqueta "📍 Hoy"
- Badges de color:
  - 🔴 Quiz (rojo)
  - 🔵 Taller (azul)
  - 🟡 Proyecto/entrega (amarillo)
- Se cierra con click fuera del modal, botón X, o tecla Escape

## Semanas especiales

Para semanas de receso o festivos, simplemente no incluir entradas para esas fechas. El componente mostrará "Sin actividades esta semana" automáticamente.

## Notas

- Las fechas usan `T12:00:00` al parsear para evitar problemas de timezone
- El formato de fecha usa `es-CO` locale (español Colombia)
- El modal usa `bg-brand-dark` consistente con los callouts de las lecturas
- `backdrop-blur-sm` y `bg-black/50` para el overlay
