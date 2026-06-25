# MOBILE-SLIDES — Guía de soporte móvil para presentaciones EDCO

> **Leer antes de publicar cualquier presentación nueva.**
> Este documento explica por qué las presentaciones deben tener un bloque
> `@media (max-width: 768px)` en su `<style>` local, qué cubre `edco.css`
> automáticamente y qué debe agregar cada archivo.

---

## Cómo funciona deck-stage en móvil

`assets/deck-stage.js` es un Web Component con Shadow DOM. En pantallas
≤ 768 px activa un modo scroll vertical:

```css
/* Dentro del Shadow DOM — NO puede ser sobreescrito desde fuera */
@media (max-width: 768px) {
  :host        { position: static; height: auto; background: #f2f2f2; }
  .canvas      { transform: none; width: 100%; height: auto; position: static; }
  ::slotted(*) { position: static !important; width: 100% !important;
                 height: auto !important; opacity: 1 !important; }

  /* Posición relativa forzada en tipos con overlay absoluto */
  ::slotted(.cover), ::slotted(.s--dark), ::slotted(.divider) {
    position: relative !important;
  }
}
```

**Consecuencias clave:**

| Qué hace el Shadow DOM | Qué implica para el CSS local |
|---|---|
| `::slotted(*) { position: static !important }` | `position: absolute` en badges/overlays escapa al viewport |
| `transform: none` en el canvas | Las unidades `px` del canvas 1920×1080 **no se escalan** |
| `width: 100%` en cada slide | Grids de N columnas con tamaños fijos desbordan |

---

## Regla de cascada Shadow DOM

Una regla `!important` **dentro del Shadow DOM gana** sobre una `!important` del
documento externo. Por eso no sirve agregar `position: relative !important`
a `.cover` en `edco.css` — el Shadow DOM la anula. El fix correcto ya está
en `deck-stage.js`.

---

## Qué cubre `edco.css` automáticamente (no repetir por archivo)

| Componente | Lo que edco.css hace en ≤ 768px |
|---|---|
| Body / scroll | `height: auto`, fondo `#f2f2f2` |
| `.s` (slide base) | `padding: 28px 20px`, `min-height: 0`, `overflow: visible` |
| Títulos (`h1.s-title`, `.s h2`, `.s h3`) | Reducción a 26 / 23 / 19 px |
| Texto (`.s p`, `.s ul`, `.s ol`) | 16 / 15 px |
| `.kicker` | 13 px, letter-spacing reducido |
| `.s-foot` (pie de página) | `position: static` — deja de flotar sobre el slide |
| `.cover` decoraciones | `.cover-bar`, `.yellow-edge`, `.wm` → `display: none` |
| `.cover h1` | 30 px |
| `.cover-meta` | `flex-direction: column` |
| `.divider h2` | 38 px |
| `.cards`, `.cards.two`, `.cards.four` | `grid-template-columns: 1fr` |
| `.split`, `.vs-cols`, `.stat-wrap` | `grid-template-columns: 1fr` |
| `.steps`, `.steps.three`, `.steps.four` | `grid-template-columns: 1fr` |
| `.agenda-list` | `grid-template-columns: 1fr` |
| `table` (genérico) | `display: block; overflow-x: auto; font-size: 12px` |
| `.callout` | `padding: 16px 18px` |
| `.fullbleed .fb-img` | `position: static; inset: auto` |

**Todo lo anterior aplica SOLO a clases definidas en `edco.css`.** Si tu slide
define una clase local con el mismo nombre (p.ej. `.banner`), la regla local
tiene mayor especificidad y anula la de `edco.css` — por eso necesitas
overrides en tu propio bloque `@media`.

---

## El problema de especificidad (por qué falla sin overrides locales)

`edco.css` reduce `.s h3` a 19 px en móvil. Pero si tu CSS local dice
`.rv-panel h3 { font-size: 34px }`, esa regla **gana** porque tiene el
mismo peso de especificidad y aparece después. En móvil, el texto sigue
siendo 34 px.

**Regla general:** cualquier componente local con font-size en selectores
hijos (`.micomponente h3`, `.micomponente p`) necesita un override
`!important` en tu bloque móvil.

---

## Checklist antes de publicar (ejecutar en cada presentación nueva)

```
[ ] ¿Tiene <meta name="viewport" content="width=device-width,initial-scale=1">?
[ ] ¿Todos los grids de 2+ columnas tienen override → 1fr en @media ≤768px?
[ ] ¿Todos los position:absolute con offsets negativos se reflow a static en móvil?
[ ] ¿Las imágenes con width/height fijos en px tienen override a tamaños móvil?
[ ] ¿Los textos con font-size px locales (h3, p, ul de componentes propios) tienen override?
[ ] ¿Los círculos/badges de tamaño fijo tienen width/height reducidos?
[ ] ¿Los grids con inline style="" tienen attribute-selector catch-all?
[ ] ¿Probado en Chrome DevTools con iPhone 14 Pro (390px) y Galaxy S20 (360px)?
```

---

## Plantilla de bloque móvil

Copiar al final de `</style>` en cada presentación nueva y completar según
los componentes que use ese deck:

```css
/* ── MÓVIL ≤768px ──────────────────────────────────────────────────── */
@media (max-width: 768px) {

  /* ── Grids de 2 columnas → 1 ── */
  .two-col,
  .two-col:has(> img.diagram:first-child),
  .two-col:has(> img.diagram:last-child) { grid-template-columns: 1fr !important; gap: 16px !important; }

  /* ── Grids de 3 columnas → 1 (o 2 si hay 4+ items legibles) ── */
  .pillar-cards, .eje-cards, .sec-grid { grid-template-columns: repeat(2,1fr) !important; gap: 10px !important; }
  .op-cards, .model-grid { grid-template-columns: 1fr !important; gap: 10px !important; }

  /* ── Grids de N columnas con clase reveal ── */
  .rv-grid.c4,.rv-grid.c5,.rv-grid.c6,.rv-grid.c7,.rv-grid.c8 { grid-template-columns: repeat(2,1fr) !important; }
  .rv-grid.c2 { grid-template-columns: 1fr !important; }

  /* ── Inline grids (attribute selectors) ── */
  [style*="grid-template-columns:repeat(3"],[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; }
  [style*="grid-template-columns:repeat(7"],[style*="grid-template-columns: repeat(7"] { grid-template-columns: repeat(2,1fr) !important; }
  [style*="grid-template-columns:1fr 1fr 1fr"],[style*="grid-template-columns: 1fr 1fr 1fr"] { grid-template-columns: 1fr !important; }

  /* ── Textos de componentes propios (especificidad local > edco.css) ── */
  .rv-panel h3 { font-size: 17px !important; }
  .rv-panel p  { font-size: 14px !important; }
  .rv-panel ul { font-size: 13px !important; }
  .dark-box h3 { font-size: 17px !important; }
  .dark-box p, .dark-box ul, .dark-box li { font-size: 14px !important; }
  .accent-card h3 { font-size: 16px !important; }
  .accent-card p, .accent-card li { font-size: 13px !important; }
  .banner { font-size: 14px !important; padding: 10px 14px !important; }

  /* ── Imágenes con dimensiones fijas en px ── */
  .person-card img { width: 72px !important; height: 72px !important; }

  /* ── Elementos con position:absolute y offsets negativos → reflow estático ── */
  /* .mi-badge { position: static !important; transform: none !important; display: inline-flex !important; margin-bottom: 4px !important; } */

  /* ── Círculos / iconos grandes ── */
  /* .mi-circulo { width: 80px !important; height: 80px !important; } */

  /* ── Flex timelines (diff-timeline) ── */
  .diff-timeline { flex-wrap: wrap !important; gap: 8px !important; }
  .diff-step { flex: 0 0 calc(50% - 4px) !important; }
  .diff-arrow { display: none !important; }
}
```

---

## Componentes por archivo — estado actual

| Archivo | Bloque móvil | Notas |
|---|---|---|
| `edco.css` | Sí (global) | Cubre componentes estándar |
| `deck-stage.js` | Sí (Shadow DOM) | `.cover`, `.s--dark`, `.divider` → `position:relative` |
| `m1-introduccion-ia.html` | No necesario | Solo usa componentes estándar de edco.css |
| `m2-1-fundamentos-modelos-generativos.html` | Sí | `.prob-row`, `.cw-row-item`, `.rlhf-grid` |
| `m3-1-fundamentos-imagenes.html` | Sí | `.two-col`, `.lvpw-wrap`, `.diff-timeline`, `.gallery-grid`, etc. |
| `m3-2-narrativas-visuales.html` | Sí | `.two-col`, `.diff-timeline`, `.stepper`, etc. |
| `m3-3-analisis-datos.html` | Sí (5 reglas) | Revisar si son suficientes |
| `modelos-m1s1-fundamentos-ia.html` | Sí (11 reglas) | Referencia canónica |
| `modelos-m1s2-aprendizaje.html` | Sí (11 reglas) | Referencia canónica |
| `cgr-s01-fundamentos-ia.html` | Sí (completo) | 20 problemas corregidos |
| `cgr-s02-como-aprenden.html` | Sí (11 reglas) | Referencia canónica |

---

## Patrón de position:absolute en móvil (el bug más frecuente)

El Shadow DOM de `deck-stage` convierte todos los `<section>` a
`position: static` en móvil. Cualquier hijo con `position: absolute` y
`inset: 0` o con offsets negativos pasa a posicionarse relativo al
**viewport**, no al slide.

**Tipos de elementos afectados y su fix:**

### Overlay de fondo (::after en .cover--photo)
```css
/* YA CORREGIDO en deck-stage.js Shadow DOM */
::slotted(.cover) { position: relative !important; }
```
No necesitas hacer nada en tu CSS local.

### Badges flotantes (position:absolute con top/left negativos)
```css
/* ✗ Desktop: .mi-badge { position: absolute; top: -14px; left: 16px } */
/* ✓ Móvil: reflow a inline-flex estático */
@media (max-width: 768px) {
  .mi-badge { position: static !important; transform: none !important;
              display: inline-flex !important; margin-bottom: 6px !important; }
  .mi-contenedor { padding-top: 20px !important; } /* compensar espacio */
}
```

### Líneas decorativas verticales (::before con position:absolute)
```css
@media (max-width: 768px) {
  .mi-lista::before { display: none !important; }
  .mi-lista { padding-left: 10px !important; } /* sin la línea, sin padding extra */
}
```

---

## Cómo probar en el navegador

1. Abrir la presentación en Chrome
2. DevTools → Toggle Device Toolbar (Ctrl+Shift+M)
3. Probar con estos breakpoints:
   - **390 px** — iPhone 14 Pro (el más común entre estudiantes)
   - **360 px** — Samsung Galaxy S20
   - **414 px** — iPhone Plus
4. Hacer scroll por todos los slides — verificar que ningún elemento
   desborde horizontalmente (barra de scroll horizontal = bug)
5. Verificar que el texto sea legible sin zoom (≥ 12 px)
6. Verificar que los grids nunca tengan columnas menores a ~120 px
