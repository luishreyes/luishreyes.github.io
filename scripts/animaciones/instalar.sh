#!/usr/bin/env bash
# Instala Manim y lo que necesita para las animaciones del aula.
#
#   bash scripts/animaciones/instalar.sh
#
# En la nube (Linux) instala con apt LaTeX, dvisvgm y Pango; en el Mac, con
# Homebrew, cairo, pango y BasicTeX con los paquetes que pide Manim. Después
# crea el entorno de Python con uv (scripts/animaciones/.venv, ignorado en
# git) con la versión de Manim fijada en pyproject.toml. Se puede repetir:
# lo que ya está instalado se salta.
set -euo pipefail
cd "$(dirname "$0")"

if [[ "$(uname)" == "Darwin" ]]; then
  command -v brew >/dev/null || { echo "Falta Homebrew: https://brew.sh"; exit 1; }
  brew list cairo >/dev/null 2>&1 || brew install cairo
  brew list pango >/dev/null 2>&1 || brew install pango
  brew list pkg-config >/dev/null 2>&1 || brew install pkg-config
  command -v uv >/dev/null || brew install uv
  if ! command -v latex >/dev/null && [[ ! -x /Library/TeX/texbin/latex ]]; then
    brew install --cask basictex
  fi
  export PATH="/Library/TeX/texbin:$PATH"
  # Los paquetes de LaTeX que usa la plantilla de Manim, más «was» (icomma: la coma decimal)
  if ! kpsewhich icomma.sty >/dev/null || ! kpsewhich standalone.cls >/dev/null; then
    sudo tlmgr update --self
    sudo tlmgr install standalone preview doublestroke ms setspace rsfs relsize ragged2e \
      fundus-calligra microtype wasysym physics dvisvgm jknapltx wasy cm-super \
      babel-english gnu-freefont mathastext cbfonts-fd was siunitx
  fi
else
  SUDO=""
  [[ "$(id -u)" -ne 0 ]] && SUDO="sudo"
  if ! command -v dvisvgm >/dev/null || ! kpsewhich icomma.sty >/dev/null 2>&1 \
     || ! pkg-config --exists pangocairo; then
    $SUDO apt-get update -qq
    DEBIAN_FRONTEND=noninteractive $SUDO apt-get install -y --no-install-recommends \
      texlive-latex-base texlive-latex-recommended texlive-latex-extra \
      texlive-fonts-recommended texlive-science cm-super dvisvgm \
      libcairo2-dev libpango1.0-dev pkg-config ffmpeg
  fi
  if ! command -v uv >/dev/null; then
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="$HOME/.local/bin:$PATH"
  fi
fi

uv sync
uv run python -c "import manim; print('Manim', manim.__version__, 'listo')"
