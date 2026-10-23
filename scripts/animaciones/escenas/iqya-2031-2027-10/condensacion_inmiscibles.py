"""Cómo condensa un vapor de agua que trae un poco de un orgánico inmiscible:
primero el agua sola, desde su punto de rocío, mientras el vapor que queda se
enriquece en el orgánico; después, a la temperatura del heteroazeótropo, los
dos juntos; al final, las dos fases líquidas se subenfrían. Curva de
condensación en equilibrio (integral) para agua y tolueno a 1 atm, con 0,05 kg
de tolueno por kg de agua, con las ecuaciones de Antoine de la lectura.
Va en la Figura 9 de la Lectura 10 de POU 2027-10 (sección 12).

    uv run publicar.py escenas/iqya-2031-2027-10/condensacion_inmiscibles.py CondensacionInmiscibles \
        --curso iqya-2031-2027-10 --carpeta lecturas/Lectura_10 --tema uniandes --fondo papel \
        --nombre condensacion-inmiscibles \
        --titulo "curva de condensación de un vapor de agua con un poco de tolueno, a 1 atm"
"""
from estilo import *

P = 760.0                       # mmHg
M_W, M_T = 18.015, 92.14
R_TOL = 0.05                    # kg de tolueno por kg de agua en el vapor
CP_L_W, CP_L_T = 4.19, 1.75     # kJ/kg·K, líquidos
CP_V_W, CP_V_T = 2.0, 1.5       # kJ/kg·K, vapores (aproximados)
LAM_T = 370.0                   # kJ/kg, tolueno cerca de 84 °C
T_SAL = 35.0                    # el condensado sale a 35 °C


def p_agua(t):
    return 10 ** (8.07131 - 1730.63 / (233.426 + t))


def p_tol(t):
    return 10 ** (6.95464 - 1344.8 / (219.482 + t))


def t_sat_agua(p):
    return 1730.63 / (8.07131 - np.log10(p)) - 233.426


def lam_agua(t):
    return 2501.0 - 2.37 * t     # kJ/kg, tablas de vapor, aproximación lineal


def t_az():
    a, b = 60.0, 100.0
    for _ in range(80):
        m = (a + b) / 2
        a, b = (m, b) if p_agua(m) + p_tol(m) < P else (a, m)
    return (a + b) / 2


TAZ = t_az()
Y_AZ = p_tol(TAZ) / P
N_W, N_T = 1 / M_W, R_TOL / M_T                    # kmol por kg de agua
F_AZ = 1 - (N_T / Y_AZ - N_T) / N_W                 # fracción de agua condensada al llegar a la meseta


def curva():
    """Puntos (Q, T, f, y) de la condensación del agua sola, con el calor
    latente y el enfriamiento del líquido y del vapor que quedan."""
    pts, q = [], 0.0
    n = 600
    prev = None
    for i in range(n + 1):
        f = F_AZ * (1 - (1 - i / n) ** 2)          # más puntos cerca del final, donde la curva cae
        nw_v = N_W * (1 - f)
        y = N_T / (N_T + nw_v)
        t = t_sat_agua((1 - y) * P)
        if prev is not None:
            fp, tp = prev
            dm = (f - fp)                            # kg de agua condensada
            c = f * CP_L_W + (1 - f) * CP_V_W + R_TOL * CP_V_T
            q += dm * lam_agua((t + tp) / 2) + c * (tp - t)
        pts.append((q, t, f, y))
        prev = (f, t)
    return pts


PTS = curva()
Q1 = PTS[-1][0]
Q2 = Q1 + (1 - F_AZ) * lam_agua(TAZ) + R_TOL * LAM_T
Q3 = Q2 + (CP_L_W + R_TOL * CP_L_T) * (TAZ - T_SAL)


def lineas(renglones, tam=TAM_TEXTO, color=None, peso=MEDIUM):
    return VGroup(*[texto(r, tam, color, peso=peso) for r in renglones]).arrange(DOWN, aligned_edge=LEFT, buff=0.12)


class CondensacionInmiscibles(Scene):
    def construct(self):
        ax = ejes((0, 2800, 400), (30, 110, 10), x_largo=6.3, y_largo=4.3,
                  x_titulo="Calor retirado (kJ por kg de agua)", y_titulo="Temperatura (°C)",
                  x_numeros=[0, 800, 1600, 2400], y_numeros=[30, 50, 70, 90, 110])
        ax.shift([-5.75, -1.85, 0] - ax.c2p(0, 30))
        assert ax.get_bottom()[1] > -3.15, ax.get_bottom()   # libre la franja de los controles
        X = 1.25
        ARRIBA = 2.55

        def paso(s):
            return rotulo(s, color=TINTA).to_corner(UL, buff=0.4)

        def en_panel(m, y=ARRIBA):
            return m.move_to([X, y, 0], aligned_edge=UL)

        def punto(q, t):
            return Dot(ax.c2p(q, t), radius=0.11, color=NAVY, fill_color=AMARILLO, fill_opacity=1, stroke_width=4)

        # ── 1. El vapor que llega ───────────────────────────────────────
        self.next_section("rocio")
        t0 = PTS[0][1]
        titulo = paso("Vapor de agua con 0,05 kg de tolueno por kg, a 1 atm")
        p0 = punto(0, t0)
        guia = DashedLine(ax.c2p(0, t0), ax.c2p(2800, t0), color=REJILLA, dash_length=0.1, stroke_width=2)
        et0 = texto(f"Rocío: {num(t0)} °C", TAM_NOTA, TINTA_2).next_to(ax.c2p(0, t0), UR, 0.12)
        info = en_panel(lineas([f"y del tolueno: {num(PTS[0][3], 4)}",
                                "El agua llega a su rocío",
                                "mucho antes que el tolueno."], TAM_NOTA, TINTA_2))
        self.play(FadeIn(titulo), Create(ax), run_time=1.2)
        self.play(Create(guia), GrowFromCenter(p0), FadeIn(et0), FadeIn(info, shift=UP * 0.1), run_time=1.0)
        self.wait(0.6)

        # ── 2. Condensa el agua sola ────────────────────────────────────
        self.next_section("agua")
        nuevo = paso("Primero condensa el agua sola")
        k = ValueTracker(0)

        def i_act():
            return int(round(k.get_value()))

        traza = always_redraw(lambda: VMobject(color=NAVY, stroke_width=7).set_points_as_corners(
            [ax.c2p(q, t) for q, t, _, _ in PTS[: max(2, i_act() + 1)]]))
        movil = always_redraw(lambda: punto(PTS[i_act()][0], PTS[i_act()][1]))
        lect = always_redraw(lambda: en_panel(lineas([
            f"Agua condensada: {num(100 * PTS[i_act()][2], 1)} %",
            f"y del tolueno: {num(PTS[i_act()][3], 3)}",
            f"T = {num(PTS[i_act()][1], 1)} °C"], TAM_TEXTO, TINTA, SEMIBOLD)))
        nota = en_panel(lineas(["El vapor que queda se", "enriquece en tolueno", "y su rocío baja."], TAM_NOTA, TINTA_2), y=0.95)
        self.play(FadeTransform(titulo, nuevo), FadeOut(info), FadeOut(p0), run_time=0.7)
        titulo = nuevo
        self.add(traza, movil, lect)
        self.play(FadeIn(nota), run_time=0.5)
        self.play(k.animate.set_value(len(PTS) - 1), run_time=4.5, rate_func=linear)
        self.wait(0.6)

        # ── 3. La meseta del heteroazeótropo ────────────────────────────
        self.next_section("meseta")
        nuevo = paso(f"A {num(TAZ)} °C condensan los dos juntos")
        fija = VMobject(color=NAVY, stroke_width=7).set_points_as_corners([ax.c2p(q, t) for q, t, _, _ in PTS])
        self.remove(traza, movil, lect)
        self.add(fija)
        meseta = Line(ax.c2p(Q1, TAZ), ax.c2p(Q2, TAZ), color=NAVY, stroke_width=7)
        p_az = punto(Q2, TAZ)
        guia_az = DashedLine(ax.c2p(0, TAZ), ax.c2p(Q1, TAZ), color=OLIVA, dash_length=0.1, stroke_width=3)
        et_az = texto(f"{num(TAZ)} °C", TAM_NOTA, OLIVA, peso=SEMIBOLD).next_to(ax.c2p(0, TAZ), UR, 0.1)
        ec = formula(r"P = p^{\circ}_{\text{agua}}(T) + p^{\circ}_{\text{tol}}(T)")
        valores = texto(f"760 = {num(p_agua(TAZ), 0)} + {num(p_tol(TAZ), 0)} mmHg", TAM_NOTA, TINTA_2)
        resto = lineas([f"Queda el {num(100 * (1 - F_AZ), 1)} % del agua", "y todo el tolueno.",
                        "Con dos líquidos y su vapor,", "la temperatura queda fija."], TAM_NOTA, TINTA_2)
        bloque = en_panel(VGroup(ec, valores, resto).arrange(DOWN, aligned_edge=LEFT, buff=0.2))
        self.play(FadeTransform(titulo, nuevo), FadeOut(nota), run_time=0.7)
        titulo = nuevo
        self.play(Create(guia_az), FadeIn(et_az), Create(meseta), GrowFromCenter(p_az), run_time=1.0)
        self.play(FadeIn(bloque, shift=UP * 0.1), run_time=0.9)
        self.wait(0.8)

        # ── 4. Subenfriamiento de las dos fases ─────────────────────────
        self.next_section("subenfriamiento")
        nuevo = paso("Las dos fases líquidas se subenfrían")
        sub = Line(ax.c2p(Q2, TAZ), ax.c2p(Q3, T_SAL), color=NAVY, stroke_width=7)
        p_fin = punto(Q3, T_SAL)
        et_fin = texto(f"{num(T_SAL, 0)} °C", TAM_NOTA, TINTA_2).next_to(ax.c2p(Q3, T_SAL), LEFT, 0.15)
        resumen = en_panel(lineas([
            f"Total: {num(Q3, 0)} kJ/kg de agua",
            f"Tolueno: {num(100 * R_TOL * LAM_T / Q3, 1)} % de la carga",
            "Salen dos líquidos que",
            "no se mezclan: van",
            "al decantador."], TAM_TEXTO, TINTA, SEMIBOLD))
        flecha = Arrow(ax.c2p(1150, 72), ax.c2p(Q1 - 30, TAZ - 1), buff=0.05, color=OLIVA, stroke_width=4,
                       max_tip_length_to_length_ratio=0.12)
        et_m = texto("agua y tolueno juntos", TAM_NOTA, OLIVA, peso=SEMIBOLD).next_to(ax.c2p(1150, 72), DOWN, 0.1)
        self.play(FadeTransform(titulo, nuevo), FadeOut(bloque), FadeOut(p_az), run_time=0.7)
        titulo = nuevo
        self.play(Create(sub), GrowFromCenter(p_fin), FadeIn(et_fin), run_time=1.2)
        self.play(FadeIn(resumen, shift=UP * 0.1), GrowArrow(flecha), FadeIn(et_m), run_time=0.9)
        self.wait(2.0)
