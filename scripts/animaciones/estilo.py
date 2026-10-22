"""Estilo común de las animaciones de Manim del aula.

Cada escena lo importa en lugar de manim:

    from estilo import *

Registra la letra del curso (Barlow, autoalojada en fuentes/), pinta el
fondo de la diapositiva donde va el video y deja listos los colores, los
textos, las fórmulas con coma decimal y unos ejes con números en Barlow.

El fondo lo escoge publicar.py con --fondo (variable ANIM_FONDO): blanco
para una diapositiva `.s`, papel para `.s--tint` y oscuro para `.s--dark`.
Los colores de tinta cambian con él, así que las escenas usan los nombres
de aquí (TINTA, ACERO...) y nunca un hex suelto.

Identidad: «Industry» de POU 2026-20 (assets/deloitte.css de sus
presentaciones). Para otro curso se agrega su paleta y su letra aquí.
"""
import os
from pathlib import Path

import manimpango
from manim import *  # noqa: F401,F403  (las escenas reciben manim a través de este módulo)

AQUI = Path(__file__).resolve().parent

for _f in sorted((AQUI / "fuentes").glob("*.ttf")):
    manimpango.register_font(str(_f))

LETRA = "Barlow"
LETRA_TITULO = "Barlow Condensed"

# ── Fondo: el de la diapositiva que recibe el video ─────────────────────
FONDOS = {
    "blanco": "#F7F7F8",  # .s        (--blanco)
    "papel": "#E9E9EA",   # .s--tint  (--papel)
    "oscuro": "#111111",  # .s--dark
}
FONDO_NOMBRE = os.environ.get("ANIM_FONDO", "blanco")
if FONDO_NOMBRE not in FONDOS:
    raise ValueError(f"ANIM_FONDO debe ser uno de {list(FONDOS)}, no {FONDO_NOMBRE!r}")
FONDO = FONDOS[FONDO_NOMBRE]
OSCURO = FONDO_NOMBRE == "oscuro"
config.background_color = FONDO

# ── Colores (Industry; en oscuro, los de su bloque [data-theme=dark]) ───
TINTA = "#FFFFFF" if OSCURO else "#1D1F20"      # texto y trazo principal
TINTA_2 = "#B9B9BC" if OSCURO else "#5D5D60"    # texto secundario, ejes
TINTA_3 = "#8A8A8E" if OSCURO else "#7A7A7D"    # guías, notas
REJILLA = "#2E2E31" if OSCURO else "#C9C9CC"    # rejilla, curvas de referencia
ACERO = "#7FA6CC" if OSCURO else "#5980A6"      # el acento del curso
ACERO_OSC = "#9BBEDD" if OSCURO else "#416180"
ACERO_CLARO = "#22303D" if OSCURO else "#E8EFF6"
TEAL = "#8FB3D2" if OSCURO else "#2C455D"       # segundo trazo, de la misma familia
AMBAR = "#E0922F"                               # advertencia o pérdida, nunca decorativo

# ── Tamaños (font_size de Manim) ────────────────────────────────────────
# En un video de 1920 px de ancho, 30 da letra de unos 50 px. El video casi
# nunca ocupa la diapositiva entera: medir que el texto más pequeño quede
# en 24 px o más una vez puesto en su caja (ver ANIMACIONES.md).
TAM_NOTA = 26
TAM_TEXTO = 30
TAM_TITULO = 40

Text.set_default(font=LETRA, color=TINTA, weight=MEDIUM)

# Plantilla LaTeX: icomma deja la coma decimal sin espacio (12,5 y no 12, 5)
PLANTILLA = TexTemplate()
PLANTILLA.add_to_preamble(r"\usepackage{icomma}")
MathTex.set_default(tex_template=PLANTILLA, color=TINTA)
Tex.set_default(tex_template=PLANTILLA, color=TINTA)


def num(x, dec=1):
    """Número con coma decimal: num(38.66) → '38,7'."""
    return f"{x:.{dec}f}".replace(".", ",")


def texto(s, tam=TAM_TEXTO, color=None, peso=MEDIUM, **kw):
    """Texto en Barlow."""
    return Text(s, font=LETRA, font_size=tam, color=color or TINTA, weight=peso, **kw)


def rotulo(s, tam=TAM_TITULO, color=None, **kw):
    """Título de paso en Barlow Condensed. Va como se escribe, sin pasarlo a
    mayúsculas: las unidades cambian de sentido (m³/h no es M³/H)."""
    return Text(s, font=LETRA_TITULO, font_size=tam, color=color or ACERO_OSC,
                weight=SEMIBOLD, **kw)


def formula(tex, tam=TAM_TEXTO + 6, color=None, **kw):
    """Fórmula en LaTeX. La coma decimal se escribe tal cual: '12,5'."""
    return MathTex(tex, font_size=tam, color=color or TINTA, **kw)


def ejes(x_range, y_range, x_largo=9, y_largo=5.2, x_titulo="", y_titulo="",
         x_numeros=None, y_numeros=None, dec=0, tam=TAM_NOTA):
    """Ejes con números y títulos en Barlow.

    x_range e y_range van como en Manim: (min, max, paso). Los números de
    los ejes salen de x_numeros / y_numeros (por defecto, cada paso desde
    el mínimo) y llevan coma decimal. Los títulos quedan dentro del mismo
    objeto, así que Create(ejes) los dibuja también.
    """
    ax = Axes(
        x_range=x_range, y_range=y_range, x_length=x_largo, y_length=y_largo,
        tips=False,
        axis_config={"color": TINTA_2, "stroke_width": 3, "include_ticks": True,
                     "tick_size": 0.06},
    )
    if x_numeros is None:
        x_numeros = np.arange(x_range[0], x_range[1] + 1e-9, x_range[2])
    if y_numeros is None:
        y_numeros = np.arange(y_range[0], y_range[1] + 1e-9, y_range[2])
    numeros = VGroup()
    for v in x_numeros:
        numeros.add(texto(num(v, dec), tam, TINTA_2).next_to(ax.c2p(v, y_range[0]), DOWN, 0.18))
    for v in y_numeros:
        numeros.add(texto(num(v, dec), tam, TINTA_2).next_to(ax.c2p(x_range[0], v), LEFT, 0.18))
    ax.add(numeros)
    if x_titulo:
        ax.add(texto(x_titulo, tam, TINTA_2).next_to(ax.x_axis, DOWN, 0.75))
    if y_titulo:
        ax.add(texto(y_titulo, tam, TINTA_2).rotate(PI / 2).next_to(numeros, LEFT, 0.3)
               .match_y(ax.y_axis))
    return ax
