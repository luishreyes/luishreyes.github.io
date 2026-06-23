# EDCO-SLIDES — Sistema de diseño de presentaciones

> **Leer antes de crear o editar cualquier presentación del Classroom `edu-pro`.**
> Fuente de verdad: `public/classroom/edu-pro/slides/assets/edco.css` (452 líneas) y `m1-introduccion-ia.html` como ejemplo canónico.

---

## 1. Motor y scaffolding HTML obligatorio

Cada presentación es un archivo HTML autocontenido en `public/classroom/edu-pro/slides/`.

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>{Módulo} — {Subtítulo} · Dominando la IA · EDCO Uniandes</title>
<link rel="stylesheet" href="assets/edco.css">
<!-- KaTeX (SIEMPRE, aunque no haya fórmulas — puede añadirse después) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"
  onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false});"></script>
</head>
<body>

<deck-stage width="1920" height="1080">

  <!-- slides aquí -->

</deck-stage>

<script src="assets/deck-stage.js"></script>
<script>
/* Footer auto-injector — ajustar TAG */
const TAG = 'M{N} · {Título corto} · Dominando la IA';
document.querySelectorAll('deck-stage > section:not([data-nofoot])').forEach((s,i)=>{
  const f=document.createElement('div'); f.className='s-foot';
  f.innerHTML=`<span class="tag">${TAG}</span><span class="num">${String(i+1).padStart(2,'0')}</span>`;
  s.appendChild(f);
});
</script>
<script>
/* Lightbox — no tocar */
document.querySelectorAll('.img-panel img, .figbox img').forEach(img=>{
  img.addEventListener('click',()=>{
    const ov=document.createElement('div');
    Object.assign(ov.style,{position:'fixed',inset:'0',background:'rgba(0,0,0,.88)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:'9999',cursor:'zoom-out'});
    const ci=document.createElement('img');
    Object.assign(ci.style,{maxWidth:'94vw',maxHeight:'92vh',objectFit:'contain',borderRadius:'8px',boxShadow:'0 20px 80px rgba(0,0,0,.6)'});
    ci.src=img.src; ov.appendChild(ci); document.body.appendChild(ov);
    ov.onclick=()=>ov.remove();
  });
});
</script>
</body>
</html>
```

### `deck-stage` — motor de escalado

- `width="1920" height="1080"` — **no cambiar nunca**; escala automáticamente a cualquier pantalla
- Navegación: flechas ←/→, PageUp/Down, teclado, click en miniaturas del carril lateral
- La clase `[data-deck-active]` se agrega al `<section>` activo — usarla en CSS para animaciones de entrada

### `data-nofoot`

Agregar `data-nofoot` en secciones que **no deben** tener el footer auto-inyectado:
- Portada (`cover`)
- Cierre (`close`)
- Pantallas de créditos o imagen a sangre

---

## 2. Paleta de colores — tokens CSS definidos en `:root`

| Variable | Valor | Uso |
|---|---|---|
| `--negro` | `#000000` | Texto sobre blanco, fondos oscuros |
| `--amarillo` | `#FFD100` | Acento principal institucional |
| `--amarillo-2` | `#FFE07A` | Amarillo claro para chips/badges |
| `--amarillo-bg` | `#FFF7D6` | Lavado amarillo muy claro (callouts) |
| `--blanco` | `#FFFFFF` | Fondo base de slide |
| `--ink` | `#1A1A1A` | Texto principal en slides blancos |
| `--gris-1` | `#1A1A1A` | (alias de `--ink`) |
| `--gris-2` | `#44464A` | Texto secundario, párrafos, listas |
| `--gris-3` | `#6B6E73` | Meta, terciario, figcaptions, footer |
| `--gris-4` | `#B8B8B8` | Bordes desactivados, barras dim |
| `--gris-5` | `#E0E0E0` | Bordes de tarjetas, separadores |
| `--papel` | `#F4F3EF` | Fondo cálido para `.s--tint` y callouts |
| `--papel-2` | `#FAFAF8` | Variante más clara de papel |
| `--ochre` | `#8A6D00` | Dorado oscuro, meta sobre blanco |
| `--teal` | `#005F73` | Acento teal (callout variante) |
| `--rojo` | `#B3271F` | Callout de advertencia |

**⚠️ `--gris-6` NO EXISTE.** Si se necesita un fondo gris claro, usar `--papel` o `--papel-2`.

---

## 3. Tipografía — pesos críticos

### Familias

| Variable | Fuente | Uso |
|---|---|---|
| `--display` | Dax (institucional, autoalojada) | Títulos, kickers, cards h3, números |
| `--tipo` | IBM Plex Sans | Cuerpo de texto, párrafos, listas |
| `--mono` | IBM Plex Mono | Código, números de orden, datos |

### Pesos Dax disponibles

`300` (Light) · `400` (Regular) · `400 italic` · `500` (Medium) · `500 italic` · `700` (Bold) · `700 italic` · `900` (Black)

### Reglas de peso — **leer con atención**

| Elemento | Peso correcto | Notas |
|---|---|---|
| `h1.s-title` | **500** | Dax Medium — nunca Bold |
| `h2.s-head` | **500** | Dax Medium — nunca Bold |
| `.divider h2` | **500** | Dax Medium — **era 800, corregido** |
| `.close h2` | **500** | Dax Medium |
| `.cover h1` | **500** | Dax Medium |
| `.kicker` | **700** | Dax Bold — intencional |
| `.card h3` | **700** | Dax Bold — intencional |
| `.vs-cols .col h3` | **700** | Dax Bold — intencional |
| `.rlhf-n` (números circulares) | **800** | Dax ExtraBold — decorativo |
| `.stat-num` | **900** | Dax Black — elemento editorial |
| Kickers inline `<p style="...">` | **700 o 500** | Caption de subsección, contextual |

**Regla de oro:** Los títulos de slide (h1, h2) y los grandes títulos de divisores van siempre en Dax **500 (Medium)**. Bold (700+) solo en elementos pequeños: kickers, labels de tarjetas, números de orden.

---

## 4. Tipos de slide

### 4.1 Portada — `cover cover--photo`

```html
<section class="s cover cover--photo" data-label="Portada" data-nofoot
  style="background-image:url('img/cover.jpg');background-size:cover;background-position:center;">
  <div class="cover-top">
    <div class="cover-org">
      <img src="assets/img/uniandes-escudo.png" alt="Universidad de los Andes">
      <div class="org-txt">Universidad de los Andes<span>Educación Continua · EDCO</span></div>
    </div>
    <div class="cover-bar"></div>
  </div>
  <div class="cover-mid">
    <p class="course">Módulo {N}</p>
    <h1>Dominando la Inteligencia Artificial</h1>
    <p class="session">{Subtítulo del módulo}</p>
  </div>
  <div class="cover-meta">
    <div><b>Conferencista</b>Luis H. Reyes · Profesor Asociado, IQ y de Alimentos</div>
  </div>
</section>
```

> **Nota:** La portada con fondo blanco y watermark usa clase `.cover` sola (sin `cover--photo`) y agrega `<img class="wm" ...>` para el watermark lateral. La versión oscura con foto a sangre usa `cover--photo`.

### 4.2 Slide de contenido — `.s`

```html
<section class="s" data-label="Título descriptivo">
  <div class="kicker">§NN · Nombre de sección</div>
  <h2 class="s-head">Título del slide</h2>
  <!-- contenido -->
</section>
```

Variante tintada: `class="s s--tint"` → fondo `--papel`
Variante oscura: `class="s s--dark"` → fondo negro

### 4.3 Divisor de sección — `.divider`

```html
<section class="s s--dark divider" data-label="§NN Nombre">
  <div class="num">01</div>
  <h2>Título del<br>bloque temático</h2>
  <div class="yellow-underline"></div>
</section>
```

Puede incluir `<p class="sub">Descripción opcional de la sección</p>` después del `.yellow-underline`.

### 4.4 Cierre — `.close`

```html
<section class="s s--dark close" data-label="Cierre" data-nofoot>
  <div class="kicker">Próxima sesión</div>
  <h2>{Título del próximo módulo}</h2>
  <p class="mid">{Descripción de lo que viene}</p>
  <div class="contact">
    <div><span class="k">Email</span>lh.reyes@uniandes.edu.co</div>
    <div><span class="k">Campus</span>Edificio Mario Laserna, Bogotá</div>
  </div>
</section>
```

---

## 5. Componentes — HTML canónico

### 5.1 Agenda

```html
<ol class="agenda-list stagger-in">
  <li>
    <span class="n">01</span>
    <div class="t"><b>Título del tema</b><span>descripción breve en minúsculas</span></div>
  </li>
  <!-- ... hasta 6 items en grid 2×3 -->
</ol>
```

- `.n` usa `--mono`, peso 700, color `--negro`
- `.t b` usa `--display`, tamaño 29px, peso 700
- `.t span` usa 22px, color `--gris-3`
- El grid es automáticamente 2 columnas

### 5.2 Timeline — 6 columnas

```html
<div class="timeline stagger-in">
  <div class="dot">
    <span class="yr">2020</span>
    <span class="ev"><b>GPT-3</b><br>175 B parámetros. Texto fluido por primera vez.</span>
  </div>
  <!-- ... hasta 6 columnas -->
</div>
```

- `.timeline` es `display:grid; grid-template-columns:repeat(6,1fr)`
- `.dot` es la tarjeta con borde superior amarillo
- `.yr` = año en `--mono` tamaño 28px peso 700
- `.ev` = texto en 22px `--gris-2` — puede incluir `<b>` para el nombre del modelo y `<br>` antes de la descripción

### 5.3 Pasos numerados — `.steps`

```html
<div class="steps three stagger-in">  <!-- three | four | (default=5) -->
  <div class="step">
    <div class="st-n">1</div>   <!-- ⚠️ SIEMPRE .st-n, NUNCA .step-n -->
    <b>Título del paso</b>
    <span>Descripción en 22px gris.</span>
  </div>
</div>
```

Variantes: `class="steps"` (5 col) · `class="steps four"` · `class="steps three"`

### 5.4 Tarjetas — `.cards`

```html
<div class="cards stagger-in">  <!-- default 3 columnas -->
  <div class="card">
    <span class="card-n">01</span>
    <h3>Título tarjeta</h3>
    <p>Descripción en 24px.</p>
  </div>
</div>
```

Variantes: `class="cards two"` · `class="cards four"`
Variante sin acento amarillo: `class="card card--ink"` → borde negro

### 5.5 Split (imagen + texto)

```html
<div class="split stagger-in">  <!-- o split--wideR | split--wideL | split--narrow -->
  <div class="copy">
    <h2>Título de la columna</h2>
    <p>Texto de 28px.</p>
  </div>
  <div class="img-panel">
    <img src="img/ejemplo.jpg" alt="descripción">
    <p class="figcap">Pie de imagen en 22px gris-3.</p>
  </div>
</div>
```

### 5.6 Comparación VS — `.vs-cols`

```html
<div class="vs-cols stagger-in">
  <div class="col left">
    <h3>Opción A</h3>
    <p>...</p>
  </div>
  <div class="vs-divider">vs</div>
  <div class="col right">
    <h3>Opción B</h3>
    <p>...</p>
  </div>
</div>
```

`.col.left` → borde gris · `.col.right` → borde amarillo · `.col.dark` → fondo negro texto blanco

### 5.7 Callout

```html
<div class="callout">          <!-- o .callout.ink / .callout.teal / .callout.warn -->
  <h4>Título opcional</h4>
  <p><b>Negrita destaca</b> texto en 26px gris-2.</p>
</div>
```

### 5.8 Cita

```html
<blockquote class="quote">
  «La mejor manera de predecir el futuro es inventarlo.»
  <span class="attribution">— Alan Kay, 1971</span>
</blockquote>
```

### 5.9 Imagen a sangre — `.fullbleed`

```html
<section class="s fullbleed" data-label="Foto fondo" data-nofoot>
  <div class="fb-img">
    <img src="img/foto.jpg" alt="descripción">
  </div>
</section>
```

### 5.10 Fórmula — `.fml` + KaTeX

```html
<div class="fml">$$P(w_t \mid w_1, \ldots, w_{t-1}) = \text{softmax}(W h_{t-1})_t$$</div>
```

Para variante oscura (`s--dark`), KaTeX automáticamente hereda color blanco via `.s--dark .fml .katex { color:#fff; }`.

---

## 6. Clases utilitarias

| Clase | Efecto |
|---|---|
| `stagger-in` | Aplica `fadeInUp` animado a hijos directos cuando el slide recibe `.active` |
| `data-label="..."` | Etiqueta visible en el carril de miniaturas y en el debugger |
| `data-nofoot` | Omite el footer auto-inyectado |
| `.platform-link` | Enlace con subrayado amarillo y sufijo ↗ — **obligatorio** para toda plataforma/herramienta nombrada |
| `.s--tint` | Fondo `--papel` (crema) |
| `.s--dark` | Fondo negro, textos blancos |

---

## 7. Animación e interactividad mínima obligatoria

Cada deck debe tener al mínimo:

- `stagger-in` en grids de tarjetas y listas de agenda → entrada `fadeInUp` escalonada
- Hover lift en `.card`, `.dot`, `.rlhf-step`: `transform:translateY(-3px)` + `box-shadow`
- Progress bar pulse integrada en `deck-stage.js` al navegar
- `:focus-visible` con `outline:3px solid var(--negro)` en botones/tabs (ver `.lossmenu .tab:focus-visible`)
- `@media (prefers-reduced-motion: reduce)` que deshabilite animaciones de `stagger-in`

---

## 8. Íconos — SVG Lucide inline

**Nunca emojis** como íconos. Siempre SVG Lucide con `stroke="currentColor" width="1em" height="1em"`. Heredan color y tamaño del texto.

```html
<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
</svg>
```

---

## 9. Imágenes

- Todas en `public/classroom/edu-pro/slides/img/`
- Siempre **verificar visualmente** con `Read` tool antes de asignar a un slide
- Los nombres de archivo extraídos de PDF no indican contenido
- PDFs fuente en `temp/` (no versionada)

---

## 10. Errores comunes — lista de verificación antes de commitear

| Bug | Causa | Fix |
|---|---|---|
| Texto gorda en divisores | `.divider h2` hereda peso 800 | Ya corregido en edco.css → 500 |
| Texto gordo en cierre | `.close h2` sin `font-weight` | Ya corregido en edco.css → 500 |
| `var(--gris-6)` undefined | No existe esa variable | Reemplazar con `var(--papel)` |
| `class="step-n"` no estiliza | edco.css define `.st-n`, no `.step-n` | Usar siempre `class="st-n"` |
| Agenda con texto pequeño | `<li><b>...</b>` sin `.n` + `.t` | Usar estructura canónica §5.1 |
| Timeline sin estilos | Clases custom `.tl-item` etc. no existen | Usar `.dot > .yr + .ev` §5.2 |
| Plataforma sin link | Nombre de herramienta como texto plano | Envolver en `.platform-link` con `target="_blank"` |
| Fórmula en texto plano | Se olvidó KaTeX | Siempre `$...$` o `$$...$$` con KaTeX cargado |
| Footer en portada/cierre | Se olvidó `data-nofoot` | Agregar `data-nofoot` a portada y cierre |

---

## 11. Registro de presentaciones

Las presentaciones se registran en `components/data/classroom/edu-pro.ts` dentro del array `presentations` del curso, con:

```ts
{
  id: 'm{n}-{slug}',
  title: 'M{N} — {Título}',
  sessionNumber: N,
  date: 'YYYY-MM-DD',
  file: 'm{n}-{slug}.html',   // solo nombre del archivo, NO ruta completa
}
```

---

## 12. Archivos de referencia

| Archivo | Rol |
|---|---|
| `public/classroom/edu-pro/slides/assets/edco.css` | Fuente de verdad de todos los estilos |
| `public/classroom/edu-pro/slides/assets/deck-stage.js` | Motor de navegación y escalado |
| `public/classroom/edu-pro/slides/m1-introduccion-ia.html` | Ejemplo canónico (sin divisores, portada foto, cierre) |
| `public/classroom/edu-pro/slides/m2-1-fundamentos-modelos-generativos.html` | Ejemplo con divisores de sección y componentes custom |
| `public/classroom/edu-pro/slides/assets/img/uniandes-escudo.png` | Escudo institucional |
| `public/classroom/edu-pro/slides/assets/fonts/` | Fuentes Dax autoalojadas |
