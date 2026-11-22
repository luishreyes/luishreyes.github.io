"""Esquema del aparato tipo Clevenger para aceites más livianos que el agua (POU 2027-10).

Dibujo propio, con la geometría del aparato del laboratorio: matraz sobre la manta, tubo
de vapor, condensador de bolas con su chaqueta, tubo graduado con la llave abajo, brazo de
retorno que rebosa al tubo de vapor a la altura del tope de la escala, y tubo de llenado.
El nivel del brazo fija el del agua en el tubo graduado: el aceite flota encima y, a medida
que se acumula, la interfase baja por la escala.

Escribe el SVG entre los marcadores <!-- CLEVENGER_START --> y <!-- CLEVENGER_END --> de los
documentos que los tengan, y la versión sin rótulos entre <!-- CLEVENGER_ICONO_START/END -->.
Uso, desde la raíz del repositorio:  python3 scripts/esquemas/clevenger.py
"""
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
CURSO = RAIZ / 'public/classroom/iqya-2031-2027-10'
DOCS = [
    CURSO / 'laboratorios/Laboratorio_01/Laboratorio_01_Arrastre_de_Vapor.html',
    CURSO / 'lecturas/Lectura_04/Lectura_04_Arrastre_de_Vapor.html',
    CURSO / 'slides/Presentacion_del_Curso/Presentacion_del_Curso.html',
    CURSO / 'lecturas/Guias/Guia_Semana_04.html',
]
NAVY, AGUA, CHAQ, ACEITE, CASC, MANTA, MANTA2, GUIA = '#19222F', '#DDE6EE', '#EAF0F5', '#FFF500', '#E0B400', '#6E6A00', '#565200', '#525C64'


def tubo(d, ancho, relleno='#fff', borde=3.5):
    """Un tubo de vidrio: el trazo oscuro y, encima, el interior más angosto."""
    return (f'<path d="{d}" fill="none" stroke="{NAVY}" stroke-width="{ancho}" stroke-linejoin="round" stroke-linecap="butt"/>'
            f'<path d="{d}" fill="none" stroke="{relleno}" stroke-width="{ancho - 2 * borde}" stroke-linejoin="round" stroke-linecap="butt"/>')


def aparato():
    p = []
    # Manta calefactora
    p.append(f'<path d="M62,702 C62,824 338,824 338,702 Z" fill="{MANTA}"/>')
    p.append(f'<path d="M84,702 C84,800 316,800 316,702 Z" fill="{MANTA2}"/>')
    # Matraz de fondo redondo con el agua y la cáscara
    p.append(f'<circle cx="200" cy="690" r="104" fill="#fff" stroke="{NAVY}" stroke-width="3.5"/>')
    p.append(f'<path d="M96.5,700 A104,104 0 0 0 303.5,700 Z" fill="{AGUA}"/>')
    for x, y, a in [(150, 728, -20), (186, 742, 15), (226, 724, -8), (168, 760, 30), (248, 752, -28), (206, 770, 5), (132, 748, 12)]:
        p.append(f'<rect x="{x - 9}" y="{y - 4}" width="18" height="8" rx="2" fill="{CASC}" transform="rotate({a} {x} {y})"/>')
    p.append(f'<circle cx="200" cy="690" r="104" fill="none" stroke="{NAVY}" stroke-width="3.5"/>')
    # Cuello con la junta esmerilada
    p.append(f'<rect x="182" y="556" width="36" height="40" fill="#fff" stroke="{NAVY}" stroke-width="3.5"/>')
    p.append(f'<rect x="179" y="546" width="42" height="22" fill="#fff" stroke="{NAVY}" stroke-width="2.5"/>')
    p.append(''.join(f'<path d="M{x},548 l6,18" stroke="{NAVY}" stroke-width="1.4"/>' for x in range(182, 218, 6)))
    # Tubo de vapor y cruce al condensador
    p.append(tubo('M200,546 L200,126 Q200,100 226,100 L444,100 Q470,100 470,126 L470,152', 20))
    # Brazo de retorno, lleno de agua: sale del fondo del tubo graduado y rebosa al tubo de vapor
    p.append(tubo('M470,560 L238,414 Q232,410 224,410 L209,410', 15, AGUA, 3))
    # Tubo de llenado, sobre el brazo
    p.append(tubo('M300,452 L300,336', 11, '#fff', 3))
    p.append(f'<path d="M282,318 L318,318 L306,338 L294,338 Z" fill="#fff" stroke="{NAVY}" stroke-width="2.5" stroke-linejoin="round"/>')
    # Condensador de bolas en su chaqueta de agua
    p.append(f'<rect x="438" y="152" width="64" height="202" rx="14" fill="{CHAQ}" stroke="{NAVY}" stroke-width="3.5"/>')
    p.append(tubo('M470,152 L470,380', 12, '#fff', 3))
    for cy in (184, 218, 252, 286, 320):
        p.append(f'<ellipse cx="470" cy="{cy}" rx="15" ry="15" fill="#fff" stroke="{NAVY}" stroke-width="2.5"/>')
    p.append(tubo('M502,174 L540,174', 12, CHAQ, 3))
    p.append(tubo('M502,334 L540,334', 12, CHAQ, 3))
    # Gotas de condensado
    for y in (388, 400):
        p.append(f'<path d="M470,{y - 5} q4,6 0,8 q-4,-2 0,-8 z" fill="{NAVY}"/>')
    # Tubo graduado: el aceite arriba, el agua abajo, la escala a la derecha
    p.append(f'<path d="M454,404 L486,404 L479,418 L461,418 Z" fill="#fff" stroke="{NAVY}" stroke-width="2.5" stroke-linejoin="round"/>')
    p.append(f'<path d="M470,416 L470,566" fill="none" stroke="{NAVY}" stroke-width="24"/>')
    p.append(f'<path d="M470,419 L470,566" fill="none" stroke="#fff" stroke-width="16"/>')
    p.append(f'<path d="M470,408 L470,446" fill="none" stroke="{ACEITE}" stroke-width="16"/>')
    p.append(f'<path d="M470,446 L470,566" fill="none" stroke="{AGUA}" stroke-width="16"/>')
    p.append(f'<path d="M462,446 L478,446" stroke="{NAVY}" stroke-width="1.6"/>')
    for i, y in enumerate(range(420, 545, 9)):
        largo = 12 if i % 5 == 0 else 7
        p.append(f'<path d="M483,{y} h{largo}" stroke="{NAVY}" stroke-width="1.6"/>')
    # Llave y punta de descarga
    p.append(tubo('M470,566 L470,618', 11, AGUA, 3))
    p.append(f'<circle cx="470" cy="584" r="10" fill="#fff" stroke="{NAVY}" stroke-width="2.5"/>')
    p.append(f'<rect x="480" y="580" width="30" height="8" rx="3" fill="{NAVY}"/>')
    return ''.join(p)


def rotulos():
    t = []
    def linea(x1, y1, x2, y2):
        t.append(f'<path d="M{x1},{y1} L{x2},{y2}" stroke="{GUIA}" stroke-width="1.4" fill="none"/>')
    def texto(x, y, renglones, ancla='start', peso=600):
        ts = ''.join(f'<tspan x="{x}" dy="{0 if i == 0 else 21}">{r}</tspan>' for i, r in enumerate(renglones))
        t.append(f'<text x="{x}" y="{y}" text-anchor="{ancla}" font-size="17" font-weight="{peso}" fill="{NAVY}">{ts}</text>')
    # Flechas del agua de enfriamiento
    t.append(f'<path d="M566,334 L548,334" stroke="{NAVY}" stroke-width="2.2" marker-end="url(#cv-flecha)"/>')
    t.append(f'<path d="M546,174 L564,174" stroke="{NAVY}" stroke-width="2.2" marker-end="url(#cv-flecha)"/>')
    texto(574, 168, ['Sale el agua', 'de enfriamiento'])
    texto(574, 328, ['Entra el agua fría'])
    linea(504, 252, 568, 252); texto(574, 258, ['Condensador', 'de bolas'])
    linea(494, 430, 568, 430); texto(574, 426, ['Tubo graduado:', 'el aceite flota', 'arriba y se lee', 'en mililitros'])
    linea(512, 584, 568, 584); texto(574, 580, ['Llave: por aquí', 'se mide el', 'condensado'])
    # Vapor que sube
    t.append(f'<path d="M172,420 L172,300" stroke="{NAVY}" stroke-width="2.2" marker-end="url(#cv-flecha)"/>')
    texto(158, 352, ['Vapor de', 'agua y aceite'], 'end')
    linea(150, 200, 188, 200); texto(144, 206, ['Tubo de vapor'], 'end')
    texto(300, 304, ['Tubo de llenado'], 'middle')
    # El agua que vuelve
    t.append(f'<path d="M420,550 L318,486" stroke="{NAVY}" stroke-width="2.2" marker-end="url(#cv-flecha)"/>')
    linea(330, 478, 330, 634); texto(340, 652, ['Brazo de retorno:', 'el agua vuelve', 'al matraz'])
    texto(200, 838, ['Matraz de 2 L con la cáscara y el agua,', 'sobre la manta calefactora'], 'middle')
    return ''.join(t)


DEFS = (f'<defs><marker id="cv-flecha" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
        f'<path d="M0,0 L10,5 L0,10 Z" fill="{NAVY}"/></marker></defs>')
ARIA = ('Aparato tipo Clevenger: un matraz de fondo redondo con la cáscara y el agua sobre una manta calefactora; el vapor de agua y '
        'aceite sube por el tubo de vapor y cruza a un condensador de bolas enfriado con agua, que entra abajo y sale arriba; el '
        'condensado cae al tubo graduado, donde el aceite flota sobre el agua y se lee en mililitros; una llave en el fondo deja '
        'sacar el condensado, y el brazo de retorno, lleno de agua, la devuelve al tubo de vapor y al matraz; un tubo lateral sirve para llenarlo.')
FIGURA = (f'<svg class="clevenger" viewBox="0 0 760 880" role="img" aria-label="{ARIA}" xmlns="http://www.w3.org/2000/svg" '
          f'style="width:100%;min-width:520px;height:auto;display:block;font-family:inherit">{DEFS}{aparato()}{rotulos()}</svg>')
ICONO = (f'<svg viewBox="52 86 500 740" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">{aparato()}</svg>')

n = 0
for doc in DOCS:
    s = doc.read_text(encoding='utf-8')
    s2 = re.sub(r'(<!-- CLEVENGER_START -->).*?(<!-- CLEVENGER_END -->)', lambda m: m.group(1) + FIGURA + m.group(2), s, flags=re.S)
    s2 = re.sub(r'(<!-- CLEVENGER_ICONO_START -->).*?(<!-- CLEVENGER_ICONO_END -->)', lambda m: m.group(1) + ICONO + m.group(2), s2, flags=re.S)
    if s2 != s:
        doc.write_text(s2, encoding='utf-8'); n += 1
(CURSO / 'assets/esquemas').mkdir(parents=True, exist_ok=True)
(CURSO / 'assets/esquemas/clevenger.svg').write_text(FIGURA.replace('font-family:inherit', 'font-family:system-ui,sans-serif'), encoding='utf-8')
print('documentos con el esquema:', n)
