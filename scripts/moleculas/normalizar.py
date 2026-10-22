"""Deja listas para la página las estructuras que dibuja chemdraw-mcp.

Cada SVG de RDKit sale escalado a su propio lienzo, así que dos moléculas
puestas lado a lado tienen enlaces de distinto largo. Este script lee los SVG
de ~/ChemDraw-Output, les quita el fondo blanco, pasa el negro a la tinta del
curso, recorta el lienzo a la molécula y les da a todas el mismo largo de
enlace en píxeles, con un trazo de grosor fijo. Los nombres y las fórmulas no
van en la imagen (la letra de RDKit pierde las tildes): los pone la página.

    python3 scripts/moleculas/normalizar.py SALIDA origen.svg:destino ...
    python3 scripts/moleculas/normalizar.py public/classroom/iqya-2031-2027-10/assets/moleculas \\
        ~/ChemDraw-Output/einzelmolekuele/r-limonene.svg:limoneno ...

Opciones: --enlace 34 (px por enlace), --trazo 2.2 (px), --tinta '#19222F'.
"""
import argparse, math, os, re, statistics

p = argparse.ArgumentParser()
p.add_argument('salida')
p.add_argument('pares', nargs='+', help='origen.svg:nombre')
p.add_argument('--enlace', type=float, default=34)
p.add_argument('--trazo', type=float, default=2.2)
p.add_argument('--tinta', default='#19222F')
a = p.parse_args()
os.makedirs(a.salida, exist_ok=True)

for par in a.pares:
    origen, nombre = par.rsplit(':', 1)
    svg = open(os.path.expanduser(origen), encoding='iso-8859-1').read()
    svg = re.sub(r"<rect[^>]*>\s*</rect>", '', svg)
    # La leyenda en inglés que RDKit dibuja debajo, como trazos.
    svg = re.sub(r"<path class='legend'.*?/>\s*", '', svg, flags=re.S)
    # El largo de cada enlace: el trazo más largo de su clase (en un doble, el exterior).
    largos = {}
    for clase, d in re.findall(r"<path class='(bond-\d+)[^']*' d='M ([^']*)'", svg):
        nums = [float(x) for x in re.findall(r'-?\d+\.?\d*', d)]
        if len(nums) == 4:
            l = math.dist(nums[:2], nums[2:])
            largos[clase] = max(largos.get(clase, 0), l)
    escala = a.enlace / statistics.median(largos.values())
    xs, ys = [], []
    for d in re.findall(r" d='([^']*)'", svg):
        nums = [float(x) for x in re.findall(r'-?\d+\.?\d*', d)]
        xs += nums[0::2]; ys += nums[1::2]
    m = 6 / escala
    x0, y0, x1, y1 = min(xs) - m, min(ys) - m, max(xs) + m, max(ys) + m
    svg = svg.replace('#000000', a.tinta)
    svg = re.sub(r'(fill:none;[^\']*?stroke-width:)[\d.]+px', lambda g: f'{g.group(1)}{a.trazo / escala:.2f}px', svg)
    svg = re.sub(r"width='[^']*' height='[^']*' viewBox='[^']*'",
                 f"width='{(x1 - x0) * escala:.0f}' height='{(y1 - y0) * escala:.0f}' "
                 f"viewBox='{x0:.1f} {y0:.1f} {x1 - x0:.1f} {y1 - y0:.1f}'", svg, count=1)
    svg = re.sub(r"<\?xml[^>]*>\s*", '', svg)
    open(os.path.join(a.salida, nombre + '.svg'), 'w', encoding='utf-8').write(svg)
    print(f'{nombre}.svg  {(x1 - x0) * escala:.0f} × {(y1 - y0) * escala:.0f} px')
