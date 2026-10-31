"""Los colores de las escenas del libro de operaciones unitarias, leídos de la paleta del libro.

La paleta es una sola, libro/estilo/paleta.json del repositorio del libro, que va clonado al lado
de este (../libro-operaciones-unitarias); otra ruta se da con la variable LIBRO_PALETA. Cada escena
del libro la carga después de estilo:

    from estilo import *
    from paleta_libro import *

y queda con:

- Los nombres de color de estilo.py (TINTA, TINTA_2, OLIVA, NAVY, AMARILLO...) con los valores de
  la base de la paleta. En el tema uniandes casi todos ya son los mismos; los dos que la paleta no
  tiene toman el color de la base con el mismo papel: AMBAR (advertencia o pérdida) es el naranja y
  TINTA_3 (guías) es la guía.
- mat(nombre, tono): el color de un material de la paleta (agua, suspensión, sólido...) en su
  relleno, su tono medio o su tono oscuro. Los líquidos y los sólidos de una escena salen de aquí,
  nunca de un hex escrito en la escena.
- familia(nombre): el relleno de cada familia de operaciones del capítulo 1.
- BASE y MATERIALES, los diccionarios completos.

También les pasa esos valores a ejes(), texto(), rotulo() y fórmula() de estilo, para que los ejes y
los textos por defecto salgan de la paleta. Nada de esto toca estilo.py ni los videos de los
cursos: solo corre dentro de un render de una escena del libro.

El tema y el fondo son los de la sección «animaciones» de la paleta: uniandes, sobre blanco
(--tema uniandes --fondo nieve en publicar.py). Con otro tema u otro fondo la escena no arranca.
"""
import json
import os
import re
from pathlib import Path

import estilo
from manim import MEDIUM, MathTex, Tex, Text, config

RAIZ = Path(__file__).resolve().parents[4]          # la raíz del repositorio público
RUTA = Path(os.environ.get("LIBRO_PALETA")
            or RAIZ.parent / "libro-operaciones-unitarias" / "libro" / "estilo" / "paleta.json")
if not RUTA.is_file():
    raise FileNotFoundError(
        f"No encuentro la paleta del libro en {RUTA}. Clone luishreyes/libro-operaciones-unitarias al lado de "
        "este repositorio o dé su ruta en la variable LIBRO_PALETA.")

_CRUDO = json.loads(RUTA.read_text(encoding="utf-8"))
_HEX = re.compile(r"^#[0-9A-Fa-f]{6}$")


def _sin_notas(d):
    return {k: v for k, v in d.items() if k != "_nota"}


BASE = {k: v.upper() for k, v in _sin_notas(_CRUDO["base"]).items()}
MATERIALES = {m: {t: c.upper() for t, c in _sin_notas(tonos).items()}
              for m, tonos in _sin_notas(_CRUDO["materiales"]).items()}


def color(ref):
    """Un nombre de la paleta a su color, como herramientas/paleta.py del libro: «agua.medio» va a
    los materiales y «naranja», a la base."""
    partes = ref.split(".")
    c = MATERIALES.get(partes[0], {}).get(partes[1]) if len(partes) == 2 else BASE.get(ref)
    if not c or not _HEX.match(c):
        raise KeyError(f"paleta del libro: «{ref}» no es un color de {RUTA}")
    return c


def mat(nombre, tono="relleno"):
    """El color de un material: relleno (el cuerpo), medio (bordes y capas más hondas) u oscuro
    (partículas y contornos)."""
    if nombre not in MATERIALES:
        raise KeyError(f"paleta del libro: no hay material «{nombre}»; agréguelo a «materiales» de {RUTA}")
    return color(f"{nombre}.{tono}")


_FAMILIAS = _sin_notas(_CRUDO["esquemas"]["familias"])


def familia(nombre):
    """El relleno de una familia de operaciones del capítulo 1: mecanica, calor, masa o quimica."""
    return color(_FAMILIAS[nombre])


# ── Tema y fondo: los de la sección «animaciones» ───────────────────────
_ANIM = _CRUDO["animaciones"]
if estilo.TEMA != _ANIM["tema"]:
    raise ValueError(f"Las escenas del libro van con el tema {_ANIM['tema']} de la paleta, no con {estilo.TEMA}: "
                     f"publique con --tema {_ANIM['tema']} --fondo nieve.")
FONDO = color(_ANIM["fondo"])
if estilo.FONDO.upper() != FONDO:
    raise ValueError(f"Las escenas del libro van sobre el {_ANIM['fondo']} de la paleta ({FONDO}), no sobre "
                     f"{estilo.FONDO} (--fondo {estilo.FONDO_NOMBRE}): publique con --fondo nieve.")

# ── Los nombres de estilo.py, con los colores de la base ────────────────
# A la izquierda, el nombre de estilo; a la derecha, el color de la base que lo reemplaza.
_TEMA = {
    "TINTA": "tinta", "NAVY": "tinta", "TEAL": "tinta",
    "TINTA_2": "tinta-2",
    "TINTA_3": "guia",              # estilo: #5D666E (guías y notas); la paleta no lo tiene
    "REJILLA": "borde",             # rejilla y curvas de referencia, #D3D9DF en los dos
    "OLIVA": "oliva", "ACERO": "oliva",
    "ACERO_OSC": "oliva-osc",
    "ACERO_CLARO": "amarillo-claro",
    "AMARILLO": "amarillo",         # solo de relleno, nunca de texto ni de trazo
    "AMBAR": "naranja",             # estilo: #E0922F (advertencia o pérdida); la paleta no lo tiene
}
_VALORES = {nombre: color(ref) for nombre, ref in _TEMA.items()}
globals().update(_VALORES)

for _nombre, _valor in {**_VALORES, "FONDO": FONDO}.items():
    setattr(estilo, _nombre, _valor)
config.background_color = FONDO
Text.set_default(font=estilo.LETRA, color=_VALORES["TINTA"], weight=MEDIUM)
MathTex.set_default(tex_template=estilo.PLANTILLA, color=_VALORES["TINTA"])
Tex.set_default(tex_template=estilo.PLANTILLA, color=_VALORES["TINTA"])

__all__ = [*_TEMA, "FONDO", "BASE", "MATERIALES", "color", "mat", "familia"]
