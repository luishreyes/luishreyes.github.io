"""Perfil de energía y de presión a lo largo de una línea de bombeo.

Es el ejemplo resuelto de la Lectura 05 de POU 2027-10 (Transporte de
fluidos): agua a 25 °C, 36 m³/h, 120 m de acero comercial de 2 pulgadas
(Sch 40, D = 52,5 mm), de un tanque abierto cuyo nivel está 2 m sobre el eje
de la bomba a otro cuyo nivel está a 20 m. Accesorios: entrada de canto vivo,
seis codos bridados, dos válvulas de compuerta y la salida. Con Swamee-Jain
sale f = 0,0203 y la bomba debe dar h_A = 72,4 m, como en la lectura y en el
Explorador de Bernoulli. El recorrido (6 m de succión, 4 m horizontales,
19 m de subida y 91 m arriba) es el de la figura de la lectura.

    uv run python publicar.py escenas/iqya-2031-2027-10/perfil_presiones.py PerfilPresiones \
        --curso iqya-2031-2027-10 --carpeta lecturas/Lectura_05 --tema uniandes --fondo papel \
        --nombre perfil-presiones --titulo "perfil de energía y de presión a lo largo de una línea de bombeo"

    uv run python publicar.py escenas/iqya-2031-2027-10/perfil_presiones.py PerfilPresiones \
        --curso iqya-2031-2027-10 --deck Flujo_de_Fluidos --tema uniandes --fondo blanco \
        --nombre perfil-presiones --titulo "perfil de energía y de presión a lo largo de una línea de bombeo"
"""
import math

from estilo import *

# ── El modelo: los mismos datos y ecuaciones que el ejemplo resuelto ─────
RHO, MU, G = 997.0, 8.9e-4, 9.81
Q = 36 / 3600                      # m³/s
D, EPS = 0.0525, 0.046e-3          # m
V = Q / (math.pi * D ** 2 / 4)     # 4,62 m/s
VH = V ** 2 / (2 * G)              # cabeza de velocidad, 1,09 m
RE = RHO * V * D / MU
F = 0.25 / math.log10(EPS / D / 3.7 + 5.74 / RE ** 0.9) ** 2   # Swamee-Jain
J = F / D * VH                     # pérdida por metro de tubería, m/m
K_ENT, K_CODO, K_COMP, K_SAL = 0.5, 0.30, 0.15, 1.0
Z1, Z2 = 2.0, 20.0                 # niveles de los tanques sobre el eje de la bomba
S_BOMBA, L_TOTAL = 6.0, 120.0

# Recorrido: (s, z) de los quiebres de la tubería
RECORRIDO = [(0, 0), (10, 0), (29, 19), (120, 19)]
# Accesorios: posición sobre la línea y su K
ACCESORIOS = [(0.0, K_ENT), (2.0, K_CODO), (4.0, K_CODO), (5.0, K_COMP),
              (7.0, K_COMP), (10.0, K_CODO), (29.0, K_CODO), (60.0, K_CODO), (90.0, K_CODO)]
SUMA_K = sum(k for _, k in ACCESORIOS) + K_SAL
H_A = (Z2 - Z1) + J * L_TOTAL + SUMA_K * VH          # 72,4 m


def z(s):
    for (s0, z0), (s1, z1) in zip(RECORRIDO, RECORRIDO[1:]):
        if s <= s1:
            return z0 + (z1 - z0) * (s - s0) / (s1 - s0)
    return RECORRIDO[-1][1]


def puntos_energia(s_ini, s_fin, h_ini):
    """Energía total H(s) entre s_ini y s_fin: baja con pendiente J y cae de
    golpe K·v²/2g en cada accesorio. Devuelve los puntos (s, H) y el H final."""
    pts, h, s = [(s_ini, h_ini)], h_ini, s_ini
    for s_acc, k in ACCESORIOS:
        if s_ini <= s_acc < s_fin or (s_acc == s_ini == 0.0):
            if s_acc > s:
                h -= J * (s_acc - s)
                s = s_acc
                pts.append((s, h))
            h -= k * VH
            pts.append((s, h))
    h -= J * (s_fin - s)
    pts.append((s_fin, h))
    return pts, h


SUC, H_ENTRADA_BOMBA = puntos_energia(0.0, S_BOMBA, Z1)
H_SALIDA_BOMBA = H_ENTRADA_BOMBA + H_A
DES, H_FIN = puntos_energia(S_BOMBA, L_TOTAL, H_SALIDA_BOMBA)
assert abs(H_FIN - K_SAL * VH - Z2) < 1e-6, H_FIN


def h_en(s):
    """Energía total justo antes del punto s (después de los accesorios previos)."""
    pts = SUC if s <= S_BOMBA else DES
    h = pts[0][1]
    for (s0, h0), (s1, h1) in zip(pts, pts[1:]):
        if s1 <= s:
            h = h1
        elif s0 <= s < s1:
            h = h0 + (h1 - h0) * (s - s0) / (s1 - s0)
            break
    return h


def kpa(cabeza):
    return cabeza * RHO * G / 1000


class PerfilPresiones(Scene):
    def construct(self):
        # Ejes propios: Manim cruza los ejes en el origen, así que se grafica
        # (s + 15, y + 20) y los números dicen la distancia y la altura reales.
        X0, Y0 = 15, 20
        ax = ejes((0, 140, 20), (0, 100, 20), x_largo=11.9, y_largo=4.7, x_numeros=[], y_numeros=[])
        ax.shift([-5.55, -1.8, 0] - ax.c2p(0, 0))
        for v in (0, 20, 40, 60, 80, 100, 120):
            ax.add(texto(num(v, 0), TAM_NOTA, TINTA_2).next_to(ax.c2p(v + X0, 0), DOWN, 0.18))
        for v in (-20, 0, 20, 40, 60, 80):
            ax.add(texto(num(v, 0), TAM_NOTA, TINTA_2).next_to(ax.c2p(0, v + Y0), LEFT, 0.18))
        ax.add(texto("Distancia a lo largo de la tubería (m)", TAM_NOTA, TINTA_2).next_to(ax.c2p(55 + X0, 0), DOWN, 0.62))
        ax.add(texto("Altura (m de líquido)", TAM_NOTA, TINTA_2).rotate(PI / 2).next_to(ax.c2p(0, 50), LEFT, 0.72))
        assert ax.get_bottom()[1] > -2.95, ax.get_bottom()  # libre la franja de los controles

        def P(a, b):
            return ax.c2p(a + X0, b + Y0)

        def paso(s):
            return rotulo(s, color=TINTA).to_corner(UL, buff=0.35)

        def poli(pts, color, ancho):
            return VMobject(color=color, stroke_width=ancho).set_points_as_corners([P(a, b) for a, b in pts])

        cero = DashedLine(P(-15, 0), P(125, 0), color=REJILLA, dash_length=0.1, stroke_width=2)

        # ── 1. La línea ─────────────────────────────────────────────────
        self.next_section("linea")
        titulo = paso("La línea: 120 m de acero de 2 pulgadas")
        tubo = poli(RECORRIDO, TINTA_3, 9)
        t1 = Line(P(-12, Z1), P(0, Z1), color=TINTA, stroke_width=6)
        t2 = Line(P(114, Z2), P(125, Z2), color=TINTA, stroke_width=6)
        et_t1 = texto("Tanque 1", TAM_NOTA, TINTA_2).next_to(P(-13, Z1), UP, 0.14, aligned_edge=LEFT)
        et_t2 = texto("Tanque 2", TAM_NOTA, TINTA_2).move_to(P(125, 17.5), aligned_edge=UR)
        bomba = Circle(radius=0.13, color=TINTA, stroke_width=4, fill_color=FONDO, fill_opacity=1).move_to(P(S_BOMBA, 0))
        et_bomba = texto("bomba", TAM_NOTA, TINTA_2).next_to(bomba, LEFT, 0.1).shift(DOWN * 0.28)
        et_tubo = texto("tubería (elevación z)", TAM_NOTA, TINTA_3).next_to(P(75, 19), DOWN, 0.15)
        self.play(FadeIn(titulo), Create(ax), Create(cero), run_time=1.2)
        self.play(Create(tubo), FadeIn(t1), FadeIn(t2), FadeIn(et_t1), FadeIn(et_t2), FadeIn(et_tubo), run_time=1.4)
        self.play(GrowFromCenter(bomba), FadeIn(et_bomba), run_time=0.5)
        self.wait(0.6)

        # ── 2. Succión ──────────────────────────────────────────────────
        self.next_section("succion")
        nuevo = paso("En la succión la energía solo baja")
        e_suc = poli(SUC, TEAL, 6)
        p_suc = poli([(a, b - VH) for a, b in SUC[1:]], ACERO, 4)
        h_in = H_ENTRADA_BOMBA - VH  # línea piezométrica a la entrada de la bomba
        vacio = Line(P(S_BOMBA, 0), P(S_BOMBA, h_in), color=AMBAR, stroke_width=8)
        nota = VGroup(
            texto(f"Entrada de la bomba: {num(h_in - z(S_BOMBA))} m", TAM_NOTA, TINTA, peso=SEMIBOLD),
            texto(f"{num(kpa(h_in - z(S_BOMBA)), 0)} kPa manométricos: vacío", TAM_NOTA, AMBAR, peso=SEMIBOLD),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.08).next_to(P(16, -11), RIGHT, 0)
        flecha = Arrow(nota.get_left() + LEFT * 0.05, P(S_BOMBA + 0.6, h_in), buff=0.08, color=AMBAR, stroke_width=4,
                       max_tip_length_to_length_ratio=0.2)
        self.play(FadeTransform(titulo, nuevo), run_time=0.6)
        titulo = nuevo
        self.play(Create(e_suc), run_time=1.0)
        self.play(Create(p_suc), run_time=0.8)
        self.play(Create(vacio), FadeIn(nota), GrowArrow(flecha), run_time=0.8)
        self.wait(0.6)

        # ── 3. La bomba ─────────────────────────────────────────────────
        self.next_section("bomba")
        nuevo = paso(f"La bomba le entrega {num(H_A)} m de cabeza")
        salto = Arrow(P(S_BOMBA, H_ENTRADA_BOMBA), P(S_BOMBA, H_SALIDA_BOMBA), buff=0, color=TEAL,
                      stroke_width=6, max_tip_length_to_length_ratio=0.05)
        et_salto = texto(f"+{num(H_A)} m", TAM_TEXTO, TEAL, peso=SEMIBOLD).next_to(P(S_BOMBA, 66), RIGHT, 0.15)
        self.play(FadeTransform(titulo, nuevo), run_time=0.6)
        titulo = nuevo
        self.play(GrowArrow(salto), FadeIn(et_salto), run_time=1.0)
        self.wait(0.6)

        # ── 4. Descarga ─────────────────────────────────────────────────
        self.next_section("descarga")
        nuevo = paso(f"La fricción se come {num(J * 100, 0)} cm por cada metro")
        e_des = poli(DES + [(L_TOTAL, Z2)], TEAL, 6)
        p_des = poli([(a, b - VH) for a, b in DES], ACERO, 4)

        def item(color, ancho, s):
            return VGroup(Line(ORIGIN, RIGHT * 0.5, color=color, stroke_width=ancho),
                          texto(s, TAM_NOTA, TINTA)).arrange(RIGHT, buff=0.15)
        ley = VGroup(
            item(TEAL, 6, "Energía total H"),
            item(ACERO, 4, "Línea piezométrica, H − v²/2g"),
            item(TINTA_3, 9, "Tubería, z"),
            texto(f"Las separa v²/2g = {num(VH, 2)} m", TAM_NOTA, TINTA_2),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.1)
        ley.move_to(P(124, 80), aligned_edge=UR)
        self.play(FadeTransform(titulo, nuevo), FadeOut(et_tubo), run_time=0.6)
        titulo = nuevo
        self.play(Create(e_des), Create(p_des), run_time=2.4, rate_func=linear)
        self.play(FadeIn(ley), run_time=0.6)
        self.wait(0.6)

        # ── 5. La presión es lo que queda entre la piezométrica y el tubo ──
        self.next_section("presion")
        nuevo = paso("La presión: de la piezométrica al tubo")
        sitios = [  # (s, nombre, dónde va la etiqueta)
            (S_BOMBA + 0.5, "salida de la bomba", P(9, 50)),
            (45.0, "tras subir 19 m", P(47, 41)),
            (119.99, "llegada al tanque 2", P(125, 8.5)),
        ]
        self.play(FadeTransform(titulo, nuevo), FadeOut(et_salto), run_time=0.6)
        titulo = nuevo
        for s, nombre, donde in sitios:
            piezo = (h_en(s) if s > S_BOMBA + 1 else H_SALIDA_BOMBA) - VH
            cab = piezo - z(s)
            barra = Line(P(s, z(s)), P(s, piezo), color=ACERO_OSC, stroke_width=8)
            et = VGroup(texto(nombre, TAM_NOTA, TINTA_2),
                        texto(f"{num(cab)} m · {num(kpa(cab), 0)} kPa", TAM_NOTA, TINTA, peso=SEMIBOLD)
                        ).arrange(DOWN, aligned_edge=LEFT, buff=0.06)
            if s > 100:
                et = VGroup(*et).arrange(DOWN, aligned_edge=RIGHT, buff=0.06).move_to(donde, aligned_edge=UR)
            else:
                et.move_to(donde, aligned_edge=UL)
            self.play(Create(barra), FadeIn(et), run_time=0.7)
        self.wait(2.4)
