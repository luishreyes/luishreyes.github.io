"""extract_guion.py — extrae el contenido de una presentación HTML del Classroom
y genera un .txt en formato guión, listo para leer en clase sin suponer nada.

Uso:
    python extract_guion.py <ruta-al-html> [ruta-al-txt-de-salida]

Ejemplo:
    python extract_guion.py \
        public/classroom/edu-pro/slides/m1-introduccion-ia.html \
        public/classroom/edu-pro/scripts/m1-guion.txt

El script:
1. Lee el HTML de la presentación.
2. Identifica cada <section class="slide"> con su comentario `<!-- N. Título -->`.
3. Para cada slide extrae:
   - eyebrow (etiqueta superior)
   - h1/h2 (título principal y subtítulo)
   - texto plano de párrafos, listas y banners (sin tags ni SVG)
4. Construye un esqueleto del guión, separando cada slide con `══` y un encabezado.

El guión que produce sirve como base. La versión definitiva de cada clase se
edita manualmente para fluidez narrativa y transiciones; este script garantiza
que ningún contenido del slide se quede afuera.
"""
from __future__ import annotations

import argparse
import re
import sys
from html.parser import HTMLParser
from pathlib import Path


# ---------------------------------------------------------------------------
# Parsing helpers
# ---------------------------------------------------------------------------

SLIDE_HEADER_RE = re.compile(r"<!--\s*([0-9]+)\.\s*(.+?)\s*-->", re.DOTALL)
SECTION_RE = re.compile(
    r'<section class="slide[^"]*"[^>]*>([\s\S]*?)</section>', re.MULTILINE
)
SCRIPT_STYLE_RE = re.compile(r"<(script|style|svg)[^>]*>[\s\S]*?</\1>", re.IGNORECASE)
TAG_RE = re.compile(r"<[^>]+>")
WS_RE = re.compile(r"[ \t]+")
MULTI_NEWLINE_RE = re.compile(r"\n{3,}")


class TextExtractor(HTMLParser):
    """Recorre el HTML de un slide y extrae texto en bloques narrativos.

    - Cada <h1>/<h2>/<h3> termina con doble salto de línea (separador).
    - Los <li> se prefijan con un guión.
    - Los enlaces se reemplazan por su texto (los URLs viven en el HTML, el guión es para leer).
    - Los <code>/<pre> se citan tal cual.
    """

    BLOCK_TAGS = {
        "h1", "h2", "h3", "h4", "p", "li", "ul", "ol", "div", "section",
        "blockquote", "pre",
    }
    SKIP_TAGS = {"svg", "script", "style", "math"}

    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []
        self._skip_depth = 0
        self._in_li = False
        self._tag_stack: list[str] = []

    def handle_starttag(self, tag: str, attrs):  # noqa: D401
        if tag in self.SKIP_TAGS:
            self._skip_depth += 1
            return
        self._tag_stack.append(tag)
        if tag in self.BLOCK_TAGS and self.parts and not self.parts[-1].endswith("\n"):
            self.parts.append("\n")
        if tag == "li":
            self.parts.append("- ")
            self._in_li = True

    def handle_endtag(self, tag: str):
        if tag in self.SKIP_TAGS:
            self._skip_depth = max(0, self._skip_depth - 1)
            return
        if self._tag_stack and self._tag_stack[-1] == tag:
            self._tag_stack.pop()
        if tag in {"h1", "h2", "h3", "h4"}:
            self.parts.append("\n\n")
        elif tag in {"p", "li"}:
            self.parts.append("\n")
            if tag == "li":
                self._in_li = False
        elif tag in {"ul", "ol", "blockquote", "pre"}:
            self.parts.append("\n")

    def handle_data(self, data: str):
        if self._skip_depth:
            return
        text = data.replace("\xa0", " ")
        text = WS_RE.sub(" ", text)
        if not text.strip():
            return
        self.parts.append(text)

    def get_text(self) -> str:
        text = "".join(self.parts)
        text = TAG_RE.sub("", text)  # safety net
        text = MULTI_NEWLINE_RE.sub("\n\n", text)
        return text.strip()


# ---------------------------------------------------------------------------
# Slide-level extraction
# ---------------------------------------------------------------------------

def find_slides(html: str) -> list[tuple[int, str, str]]:
    """Devuelve [(numero, titulo_comentario, html_del_slide), ...].

    Empareja cada `<!-- N. Título -->` con su `<section class="slide">` siguiente.
    """
    out: list[tuple[int, str, str]] = []
    for header in SLIDE_HEADER_RE.finditer(html):
        num = int(header.group(1))
        comment_title = header.group(2).strip()
        # Buscar la siguiente sección a partir de la posición del comentario
        section_m = SECTION_RE.search(html, header.end())
        if not section_m:
            continue
        out.append((num, comment_title, section_m.group(0)))
    return out


def slide_to_guion(num: int, comment_title: str, slide_html: str) -> str:
    """Convierte un slide en una sección del guión."""
    # Limpiar HTML pesado (svg, scripts) para que el extractor de texto trabaje bien
    cleaned = SCRIPT_STYLE_RE.sub("", slide_html)
    extractor = TextExtractor()
    extractor.feed(cleaned)
    body = extractor.get_text()

    header = f"\n{'═' * 78}\nSLIDE {num:02d} · {comment_title}\n{'═' * 78}\n"
    return header + body + "\n"


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n", 1)[0])
    parser.add_argument("html", type=Path, help="Ruta al HTML de la presentación")
    parser.add_argument(
        "txt",
        nargs="?",
        type=Path,
        default=None,
        help="Ruta al .txt de salida (por defecto: junto al HTML, .txt)",
    )
    args = parser.parse_args(argv)

    if not args.html.exists():
        print(f"ERROR: no existe {args.html}", file=sys.stderr)
        return 1

    html = args.html.read_text(encoding="utf-8")
    slides = find_slides(html)
    if not slides:
        print("ERROR: no encontré slides con comentario `<!-- N. ... -->`", file=sys.stderr)
        return 1

    title_match = re.search(r"<title>([^<]+)</title>", html)
    deck_title = title_match.group(1).strip() if title_match else args.html.stem

    parts: list[str] = []
    parts.append(f"GUIÓN PARA LEER EN CLASE\n{deck_title}\n\n")
    parts.append(
        "Lee este texto en voz natural. Cada bloque corresponde a un slide.\n"
        "Las listas con guión van como bullets — léelas con pausa entre cada\n"
        "ítem. Las frases en MAYÚSCULA son anclas estructurales (no se leen).\n"
    )
    parts.append("\nTotal de slides: " + str(len(slides)) + "\n")

    for num, comment_title, section_html in slides:
        parts.append(slide_to_guion(num, comment_title, section_html))

    out_path = args.txt or args.html.with_suffix(".txt")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text("".join(parts), encoding="utf-8")
    print(f"OK · guión escrito en {out_path} ({len(slides)} slides)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
