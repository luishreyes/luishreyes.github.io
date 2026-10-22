"""Por qué el limoneno, que hierve a 176 °C, sale con el vapor por debajo de
100 °C: dos líquidos que no se mezclan hierven cuando la suma de sus presiones
de vapor puras iguala la del sistema. Mismas ecuaciones de Antoine que la
calculadora de reto-aceite-esencial.html, así que los números coinciden:
97,6 °C a 1 atm, 89,6 °C en Bogotá y 0,69 kg de aceite por kg de vapor.
Va en la presentación del curso de POU 2027-10 y en la guía del reto.

    uv run publicar.py escenas/iqya-2031-2027-10/arrastre_vapor.py ArrastreVapor \
        --curso iqya-2031-2027-10 --deck Presentacion_del_Curso --tema uniandes --fondo blanco \
        --nombre arrastre-vapor --titulo "por qué el limoneno sale con el vapor por debajo de 100 °C"
"""
from estilo import *

M_LIM, M_AGUA = 136.24, 18.02
PLANTA = 0.013  # kg de aceite por kg de vapor en una planta real


def p_agua(t):
    return 10 ** (8.07131 - 1730.63 / (233.426 + t)) * 0.133322


def p_lim(t):
    return 10 ** (6.21379 - 1615.9 / (t + 208))


def t_eb(p):
    a, b = 30.0, 110.0
    for _ in range(60):
        m = (a + b) / 2
        a, b = (m, b) if p_agua(m) + p_lim(m) < p else (a, m)
    return (a + b) / 2


def relacion(t):
    return p_lim(t) * M_LIM / (p_agua(t) * M_AGUA)


def lineas(renglones, tam=TAM_TEXTO, color=None, peso=MEDIUM):
    return VGroup(*[texto(r, tam, color, peso=peso) for r in renglones]).arrange(DOWN, aligned_edge=LEFT, buff=0.12)


class ArrastreVapor(Scene):
    def construct(self):
        # La franja de abajo queda libre para los controles del video en la guía del reto.
        ax = ejes((60, 105, 5), (0, 120, 20), x_largo=6.2, y_largo=4.6,
                  x_titulo="Temperatura (°C)", y_titulo="Presión de vapor (kPa)",
                  x_numeros=[60, 70, 80, 90, 100])
        ax.shift([-5.5, -1.75, 0] - ax.c2p(60, 0))
        assert ax.get_bottom()[1] > -3.0, ax.get_bottom()  # libre la franja de los controles
        X = 1.35  # borde izquierdo del panel de la derecha
        ARRIBA = 2.9

        def paso(s):
            return rotulo(s, color=TINTA).to_corner(UL, buff=0.4)

        def linea_p(p):
            return DashedLine(ax.c2p(60, p), ax.c2p(105, p), color=TINTA_2, dash_length=0.12, stroke_width=2.5)

        def punto(t, p):
            return Dot(ax.c2p(t, p), radius=0.12, color=NAVY, fill_color=AMARILLO, fill_opacity=1, stroke_width=4)

        def en_panel(m, y=ARRIBA):
            return m.move_to([X, y, 0], aligned_edge=UL)

        # ── 1. El agua sola ─────────────────────────────────────────────
        self.next_section("agua")
        titulo = paso("El agua sola hierve a 100 °C")
        agua = ax.plot(p_agua, x_range=(60, 103.5), color=TEAL, stroke_width=6)
        et_agua = texto("Agua", TAM_TEXTO, TEAL, peso=SEMIBOLD).next_to(ax.c2p(72, p_agua(72)), DR, 0.12)
        atm = linea_p(101.325)
        et_atm = texto("1 atm", TAM_NOTA, TINTA_2).next_to(ax.c2p(60, 101.325), UR, 0.08)
        p100 = punto(100, 101.325)
        self.play(FadeIn(titulo), Create(ax), run_time=1.2)
        self.play(Create(agua), FadeIn(et_agua), Create(atm), FadeIn(et_atm), run_time=1.4)
        self.play(GrowFromCenter(p100), run_time=0.5)
        self.wait(0.6)

        # ── 2. El limoneno solo ─────────────────────────────────────────
        self.next_section("limoneno")
        nuevo = paso("El limoneno solo apenas evapora")
        lim = ax.plot(p_lim, x_range=(60, 105), color=TINTA_3, stroke_width=5)
        et_lim = texto("Limoneno", TAM_TEXTO, TINTA_3, peso=SEMIBOLD).next_to(ax.c2p(64, p_lim(64)), UR, 0.1)
        nota_lim = en_panel(lineas([f"A 100 °C, el limoneno", f"ejerce {num(p_lim(100))} kPa.", "Solo, hierve a 176 °C."]))
        self.play(FadeTransform(titulo, nuevo), run_time=0.7)
        titulo = nuevo
        self.play(Create(lim), FadeIn(et_lim), run_time=1.2)
        self.play(FadeIn(nota_lim, shift=UP * 0.1), run_time=0.8)
        self.wait(0.8)

        # ── 3. Juntos ───────────────────────────────────────────────────
        self.next_section("juntos")
        t1 = t_eb(101.325)
        nuevo = paso(f"Juntos hierven a {num(t1)} °C")
        suma = ax.plot(lambda t: p_agua(t) + p_lim(t), x_range=(60, 103.0), color=ACERO, stroke_width=7)
        et_suma = texto("Agua + limoneno", TAM_TEXTO, ACERO, peso=SEMIBOLD).next_to(ax.c2p(82, p_agua(82) + p_lim(82)), UL, 0.12)
        ec = formula(r"P = p^{\circ}_{\text{agua}}(T) + p^{\circ}_{\text{lim}}(T)", color=TINTA)
        expl = lineas(["Cada líquido evapora", "como si estuviera solo."], TAM_NOTA, TINTA_2)
        bloque = en_panel(VGroup(ec, expl).arrange(DOWN, aligned_edge=LEFT, buff=0.22))
        p1 = punto(t1, 101.325)
        guia1 = DashedLine(ax.c2p(t1, 0), ax.c2p(t1, 101.325), color=NAVY, dash_length=0.08, stroke_width=2.5)
        et_t1 = texto(f"{num(t1)} °C", TAM_NOTA, NAVY, peso=SEMIBOLD).next_to(ax.c2p(t1, 38), LEFT, 0.1)
        self.play(FadeTransform(titulo, nuevo), FadeOut(nota_lim), FadeOut(p100), run_time=0.7)
        titulo = nuevo
        self.play(Create(suma), FadeIn(et_suma), FadeIn(bloque, shift=UP * 0.1), run_time=1.5)
        self.play(GrowFromCenter(p1), Create(guia1), FadeIn(et_t1), run_time=0.9)
        self.wait(0.8)

        # ── 4. Cuánto aceite lleva el vapor ─────────────────────────────
        self.next_section("relacion")
        nuevo = paso("Cuánto aceite arrastra cada kilo de vapor")
        rel = formula(r"\frac{m_{\text{aceite}}}{m_{\text{vapor}}} = \frac{p^{\circ}_{\text{lim}}\,M_{\text{lim}}}{p^{\circ}_{\text{agua}}\,M_{\text{agua}}}", color=TINTA)
        eq = lineas([f"Equilibrio: {num(relacion(t1), 2)} kg de aceite", "por kg de vapor"], TAM_TEXTO, TINTA, SEMIBOLD)
        planta = lineas([f"Planta: {num(PLANTA, 3)} kg/kg,", f"{relacion(t1) / PLANTA:.0f} veces menos"], TAM_TEXTO, ACERO, SEMIBOLD)
        por_que = lineas(["Manda la difusión del aceite", "dentro de la cáscara."], TAM_NOTA, TINTA_2)
        abajo = VGroup(rel, eq, planta, por_que).arrange(DOWN, aligned_edge=LEFT, buff=0.2)
        abajo.next_to(bloque, DOWN, buff=0.3, aligned_edge=LEFT)
        assert abajo.get_bottom()[1] > -3.0, abajo.get_bottom()  # libre la franja de los controles
        self.play(FadeTransform(titulo, nuevo), run_time=0.7)
        titulo = nuevo
        self.play(FadeIn(rel, shift=UP * 0.1), run_time=0.9)
        self.play(FadeIn(eq, shift=UP * 0.1), run_time=0.7)
        self.play(FadeIn(planta, shift=UP * 0.1), FadeIn(por_que), run_time=0.9)
        self.wait(1.0)

        # ── 5. En Bogotá ────────────────────────────────────────────────
        self.next_section("bogota")
        t2 = t_eb(75)
        nuevo = paso(f"En Bogotá, a 75 kPa, hierven a {num(t2)} °C")
        p_sis = ValueTracker(101.325)
        linea = always_redraw(lambda: linea_p(p_sis.get_value()))
        movil = always_redraw(lambda: punto(t_eb(p_sis.get_value()), p_sis.get_value()))
        self.remove(atm, p1)
        self.add(linea, movil)
        et_bog = texto("Bogotá", TAM_NOTA, TINTA_2).next_to(ax.c2p(60, 75), UR, 0.08)
        self.play(FadeTransform(titulo, nuevo), FadeOut(et_atm), run_time=0.7)
        titulo = nuevo
        self.play(p_sis.animate.set_value(75), run_time=2.2, rate_func=smooth)
        guia2 = DashedLine(ax.c2p(t2, 0), ax.c2p(t2, 75), color=NAVY, dash_length=0.08, stroke_width=2.5)
        et_t2 = texto(f"{num(t2)} °C", TAM_NOTA, NAVY, peso=SEMIBOLD).next_to(ax.c2p(t2, 38), LEFT, 0.1)
        self.play(FadeIn(et_bog), Create(guia2), FadeOut(et_t1), FadeIn(et_t2), run_time=0.9)
        self.wait(2.2)
