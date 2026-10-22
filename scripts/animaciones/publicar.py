"""Renderiza una escena de Manim y la deja lista en una presentación o una lectura del aula.

    uv run publicar.py ESCENA.py Clase --curso SLUG --deck CARPETA [opciones]
    uv run publicar.py ESCENA.py Clase --curso SLUG --carpeta lecturas/Lectura_NN [opciones]
    uv run publicar.py ESCENA.py Clase --borrador          (solo para revisar)

Opciones:
  --deck      la presentación: equivale a --carpeta slides/CARPETA
  --carpeta   cualquier carpeta dentro del curso, como lecturas/Lectura_01
  --tema      industry (POU 2026-20, por defecto) | uniandes (POU 2027-10)
  --fondo     el de la diapositiva o la lectura: blanco | papel | oscuro, y en
              uniandes también nieve (los recuadros de las secciones pares de las lecturas)
  --nombre    nombre de los archivos publicados (por defecto, la clase en kebab-case)
  --formato   16:9 | 4:3 | 1:1 (1080 px de alto; 16:9 es 1920 × 1080)
  --titulo    lo que lee un lector de pantalla (por defecto, el nombre)
  --borrador  480p a 15 cuadros en media/, sin publicar nada

Publica en {carpeta}/assets/video/:
  {nombre}.mp4   H.264 sin audio, con el índice al comienzo (arranca sin bajar entero)
  {nombre}.webp  el último cuadro: póster, vista con movimiento reducido e impresión
e imprime el HTML: en una presentación, con las pausas de cada sección
(self.next_section en la escena); en una lectura, una figura con controles.
Ver ANIMACIONES.md.
"""
import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path

import av

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[1]
FORMATOS = {"16:9": (1920, 1080), "4:3": (1440, 1080), "1:1": (1080, 1080)}
FPS = 30


def kebab(nombre):
    return re.sub(r"(?<!^)(?=[A-Z])", "-", nombre).lower()


def renderizar(escena, clase, ancho, alto, fps, fondo, tema):
    entorno = dict(os.environ, ANIM_FONDO=fondo, ANIM_TEMA=tema,
                   PYTHONPATH=os.pathsep.join(p for p in (str(AQUI), os.environ.get("PYTHONPATH")) if p))
    subprocess.run(
        [sys.executable, "-m", "manim", "render", str(escena), clase,
         "-r", f"{ancho},{alto}", "--fps", str(fps), "--save_sections",
         "--media_dir", str(AQUI / "media"), "--progress_bar", "none"],
        check=True, cwd=AQUI, env=entorno)
    carpeta = AQUI / "media" / "videos" / escena.stem / f"{alto}p{fps}"
    return carpeta / f"{clase}.mp4", carpeta / "sections" / f"{clase}.json"


def pausas(json_secciones, fps):
    """Instantes en que el video se detiene: un poco antes del final de cada
    sección menos la última, dentro de la espera con que termina la sección."""
    if not json_secciones.exists():
        return []
    fin, altos = 0.0, []
    for s in json.loads(json_secciones.read_text()):
        dur = float(s.get("nb_frames", 0)) / fps or float(s.get("duration", 0))
        fin += dur
        altos.append(fin - min(0.25, dur / 4))
    return [round(t, 2) for t in altos[:-1]]


def publicar(origen, mp4, poster):
    """Manim ya entrega H.264 yuv420p; solo se reempaqueta, sin recodificar,
    con el índice (moov) al comienzo para que el navegador arranque enseguida."""
    mp4.parent.mkdir(parents=True, exist_ok=True)
    with av.open(str(origen)) as ent, \
            av.open(str(mp4), "w", format="mp4", options={"movflags": "+faststart"}) as sal:
        vin = ent.streams.video[0]
        vout = sal.add_stream_from_template(vin)
        for paquete in ent.demux(vin):
            if paquete.dts is None:
                continue
            paquete.stream = vout
            sal.mux(paquete)
    with av.open(str(origen)) as ent:
        for cuadro in ent.decode(video=0):
            ultimo = cuadro
    ultimo.to_image().save(poster, "WEBP", quality=88)


def main():
    p = argparse.ArgumentParser(description="Renderiza una escena de Manim para una presentación del aula.")
    p.add_argument("escena", type=Path)
    p.add_argument("clase")
    p.add_argument("--curso")
    p.add_argument("--deck")
    p.add_argument("--carpeta")
    p.add_argument("--tema", default="industry", choices=["industry", "uniandes"])
    p.add_argument("--nombre")
    p.add_argument("--titulo")
    p.add_argument("--fondo", default="blanco", choices=["blanco", "papel", "nieve", "oscuro"])
    p.add_argument("--formato", default="16:9", choices=list(FORMATOS))
    p.add_argument("--borrador", action="store_true")
    a = p.parse_args()

    escena = a.escena.resolve()
    ancho, alto = FORMATOS[a.formato]
    if a.borrador:
        ancho, alto, fps = round(ancho * 480 / alto) // 2 * 2, 480, 15
        video, _ = renderizar(escena, a.clase, ancho, alto, fps, a.fondo, a.tema)
        print(f"\nBorrador: {video}")
        return
    carpeta = a.carpeta or (f"slides/{a.deck}" if a.deck else None)
    if not (a.curso and carpeta):
        p.error("para publicar hacen falta --curso y --deck o --carpeta (o use --borrador)")

    destino = RAIZ / "public" / "classroom" / a.curso / carpeta
    if not destino.is_dir():
        p.error(f"no existe la carpeta {destino.relative_to(RAIZ)}")
    video, secciones = renderizar(escena, a.clase, ancho, alto, FPS, a.fondo, a.tema)
    nombre = a.nombre or kebab(a.clase)
    mp4 = destino / "assets" / "video" / f"{nombre}.mp4"
    poster = mp4.with_suffix(".webp")
    publicar(video, mp4, poster)

    altos = pausas(secciones, FPS)
    rel = f"assets/video/{nombre}"
    titulo = a.titulo or nombre.replace("-", " ").capitalize()
    print(f"\nPublicado: {mp4.relative_to(RAIZ)} ({mp4.stat().st_size / 1e6:.1f} MB) y {poster.name}")
    if not carpeta.startswith("slides/"):
        # Una lectura no tiene la flecha del deck: el video lleva controles, y el
        # póster (el último cuadro) es la figura completa para quien no lo reproduce.
        print("\nHTML para la lectura (la figura completa es el póster):\n")
        print(f'<figure class="fig full">\n'
              f'  <div class="fig-frame">\n'
              f'    <video class="anim-lectura" src="{rel}.mp4" poster="{rel}.webp" width="{ancho}" height="{alto}"\n'
              f'           controls muted playsinline preload="none" aria-label="Animación: {titulo}"></video>\n'
              f'  </div>\n'
              f'  <figcaption><b>Figura N.</b> …</figcaption>\n'
              f'</figure>')
        return
    print("\nHTML para la diapositiva (una vez por presentación, después de deck-stage.js:"
          ' <script src="/classroom/animaciones.js"></script>):\n')
    print(f'<div class="anim-caja">\n'
          f'  <video class="anim" src="{rel}.mp4" poster="{rel}.webp" width="{ancho}" height="{alto}"\n'
          f'         data-pausas="{",".join(str(t) for t in altos)}" muted playsinline preload="auto"\n'
          f'         role="button" tabindex="0" aria-label="Animación: {titulo}. Flecha derecha para avanzar"></video>\n'
          f'  <img class="anim-impresion" src="{rel}.webp" alt="{titulo}" width="{ancho}" height="{alto}">\n'
          f'</div>')


if __name__ == "__main__":
    main()
