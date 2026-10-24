"""El ciclo de un compresor de pistón y su espacio muerto.

Para el capítulo 11 del libro de operaciones unitarias (ventiladores,
compresores y vacío). El caso es el aire de instrumentos de la planta de
aceite esencial en Bogotá: aspira a 73,7 kPa y entrega a 700 kPa
manométricos, 773,7 kPa absolutos, una relación de 10,5. El cilindro tiene
un espacio muerto de 6 % del volumen barrido, y la compresión y la
reexpansión siguen una politrópica con n = 1,35 (datos ilustrativos del
libro). Con una sola etapa la reexpansión se come casi un tercio del
barrido; con dos etapas de 3,24, menos de un décimo.

El eje de volumen va en porcentaje del volumen barrido; el espacio muerto
queda a la izquierda, entre 0 y 6 %.

    uv run publicar.py escenas/libro/ciclo_compresor.py CicloCompresor \
        --tema uniandes --fondo nieve --destino {libro}/figuras/ventiladores-compresores-y-vacio
"""
from estilo import *

# ── El caso ─────────────────────────────────────────────────────────────
P1, P2 = 73.7, 773.7                     # kPa absolutos
C, NP = 6.0, 1.35                        # espacio muerto (% del barrido) y exponente politrópico
V1 = 100.0 + C                           # punto muerto inferior
R1 = P2 / P1                             # una etapa
R2 = R1 ** 0.5                           # cada una de dos etapas
P2B = P1 * R2


def ciclo(p2):
    """Los cuatro vértices del ciclo ideal con espacio muerto."""
    v2 = V1 * (P1 / p2) ** (1 / NP)
    v4 = C * (p2 / P1) ** (1 / NP)
    return v2, v4


def eta_v(p2):
    return 1 - C / 100 * ((p2 / P1) ** (1 / NP) - 1)


# ── El dibujo ───────────────────────────────────────────────────────────
# el cilindro, horizontal, con la culata a la izquierda; x del pistón según el volumen
XC0, XC1, YC, RC = -5.8, -1.9, -0.75, 0.8     # culata, fin del barrido, eje y medio alto del cilindro
XP0, XP1 = XC0 + 0.15, XC0 + 0.6             # las dos lumbreras, arriba (succión) y abajo (descarga)


def x_piston(v):
    return XC0 + v / V1 * (XC1 - XC0)


class CicloCompresor(Scene):
    def construct(self):
        v = ValueTracker(V1)                 # volumen del cilindro, % del barrido
        p = ValueTracker(P1)                 # presión del gas, kPa
        fase = {"abre_s": False, "abre_d": False}

        ax = ejes((0, 110, 20), (0, 800, 200), x_largo=6.0, y_largo=4.4,
                  x_titulo="volumen del cilindro (% del barrido)", y_titulo="presión (kPa)").move_to([3.35, -0.55, 0])
        muerto = Rectangle(width=ax.c2p(C, 0)[0] - ax.c2p(0, 0)[0], height=ax.c2p(0, 800)[1] - ax.c2p(0, 0)[1],
                           stroke_width=0, fill_color=REJILLA, fill_opacity=0.7).move_to(ax.c2p(C / 2, 400))
        r_muerto = texto("espacio muerto", TAM_NOTA * 0.85, TINTA_2).rotate(PI / 2).move_to(muerto.get_center() + UP * 0.9 + RIGHT * 0.03)

        # el cilindro: paredes, culata con dos válvulas, gas y pistón
        pared = VGroup(
            VMobject(stroke_color=TINTA, stroke_width=4).set_points_as_corners(
                [[XP0, YC + RC, 0], [XC0, YC + RC, 0], [XC0, YC - RC, 0], [XP0, YC - RC, 0]]),
            Line([XP1, YC + RC, 0], [XC1 + 0.9, YC + RC, 0], stroke_color=TINTA, stroke_width=4),
            Line([XP1, YC - RC, 0], [XC1 + 0.9, YC - RC, 0], stroke_color=TINTA, stroke_width=4))
        puerto_s = VGroup(Line([XP0, YC + RC, 0], [XP0, YC + RC + 0.6, 0], stroke_color=TINTA, stroke_width=3),
                          Line([XP1, YC + RC, 0], [XP1, YC + RC + 0.6, 0], stroke_color=TINTA, stroke_width=3))
        puerto_d = VGroup(Line([XP0, YC - RC, 0], [XP0, YC - RC - 0.6, 0], stroke_color=TINTA, stroke_width=3),
                          Line([XP1, YC - RC, 0], [XP1, YC - RC - 0.6, 0], stroke_color=TINTA, stroke_width=3))

        def valvulas():
            g = VGroup()
            # la de succión abre hacia adentro del cilindro; la de descarga, hacia afuera
            for y0, abre, sentido in ((YC + RC, fase["abre_s"], -1), (YC - RC, fase["abre_d"], -1)):
                a = [XP0, y0, 0]
                b = [XP0 + 0.3, y0 + sentido * 0.32, 0] if abre else [XP1, y0, 0]
                g.add(Line(a, b, stroke_color=OLIVA, stroke_width=8))
            return g

        def gas():
            xp = x_piston(v.get_value())
            f = (p.get_value() - P1) / (P2 - P1)
            return Rectangle(width=xp - XC0, height=2 * RC - 0.08, stroke_width=0,
                             fill_color=interpolate_color(ManimColor(REJILLA), ManimColor(NAVY), 0.15 + 0.85 * max(0, min(1, f))),
                             fill_opacity=1).move_to([(xp + XC0) / 2, YC, 0])

        def piston():
            xp = x_piston(v.get_value())
            return VGroup(Rectangle(width=0.32, height=2 * RC - 0.08, stroke_color=TINTA, stroke_width=3,
                                    fill_color=TINTA_2, fill_opacity=1).move_to([xp + 0.16, YC, 0]),
                          Line([xp + 0.32, YC, 0], [xp + 1.4, YC, 0], stroke_color=TINTA, stroke_width=6))

        g_gas, g_pis, g_val = always_redraw(gas), always_redraw(piston), always_redraw(valvulas)
        r_suc = texto("succión", TAM_NOTA, TINTA_2).next_to(puerto_s, UP, 0.1)
        r_des = texto("descarga", TAM_NOTA, TINTA_2).next_to(puerto_d, DOWN, 0.1)
        lectura = always_redraw(lambda: texto(f"{num(p.get_value(), 0)} kPa", TAM_TEXTO, TINTA)
                                .move_to([(XC0 + XC1) / 2 + 0.5, YC + RC + 0.4, 0]))

        punto = always_redraw(lambda: Dot(ax.c2p(v.get_value(), p.get_value()), radius=0.08, color=NAVY))
        traza = VMobject(stroke_color=NAVY, stroke_width=5)
        traza.set_points_as_corners([ax.c2p(V1, P1), ax.c2p(V1, P1)])

        def sigue(m):
            m.add_points_as_corners([ax.c2p(v.get_value(), p.get_value())])
        titulo = rotulo("Un compresor de pistón, una etapa").to_corner(UL, buff=0.35)

        def leyenda(*lineas):
            return VGroup(*[texto(s, TAM_NOTA, TINTA_2) for s in lineas]).arrange(DOWN, buff=0.08, aligned_edge=LEFT) \
                .next_to(titulo, DOWN, 0.15, aligned_edge=LEFT)

        def politropica(va, vb, p_a, t, run_time):
            """Lleva el pistón de va a vb con p·v^n constante."""
            k = p_a * va ** NP
            self.play(v.animate.set_value(vb), UpdateFromFunc(p, lambda m: m.set_value(k / v.get_value() ** NP)),
                      run_time=run_time, rate_func=t)

        # 0 · el cilindro lleno de aire de Bogotá
        self.next_section("cilindro")
        nota = leyenda("Aspira aire a 73,7 kPa y lo entrega a 774 kPa absolutos: una relación de 10,5.",
                       "El pistón no llega a la culata: queda un espacio muerto de 6 % del barrido.")
        self.add(pared, puerto_s, puerto_d, g_gas, g_pis, g_val, r_suc, r_des, lectura, ax, muerto, r_muerto,
                 traza, punto, titulo, nota)
        self.wait(1.2)
        self.wait(0.6)

        # 1 · compresión
        self.next_section("compresion")
        v2, v4 = ciclo(P2)
        t1 = rotulo("Compresión").to_corner(UL, buff=0.35)
        n1 = leyenda("Las dos válvulas cerradas: el pistón avanza y la presión sube.",
                     "La de descarga abre cuando el gas llega a la presión de la línea.")
        self.play(ReplacementTransform(titulo, t1), ReplacementTransform(nota, n1), run_time=0.6)
        traza.add_updater(sigue)
        politropica(V1, v2, P1, smooth, 3.0)
        self.wait(0.6)

        # 2 · descarga
        self.next_section("descarga")
        t2 = rotulo("Descarga").to_corner(UL, buff=0.35)
        n2 = leyenda("Con la válvula de descarga abierta, el pistón empuja el aire a la línea",
                     "a presión constante, hasta el final de su carrera.")
        self.play(ReplacementTransform(t1, t2), ReplacementTransform(n1, n2), run_time=0.6)
        fase["abre_d"] = True
        self.play(v.animate.set_value(C), run_time=2.2, rate_func=smooth)
        fase["abre_d"] = False
        self.wait(0.6)

        # 3 · reexpansión del espacio muerto
        self.next_section("reexpansion")
        t3 = rotulo("Reexpansión").to_corner(UL, buff=0.35)
        n3 = leyenda("El aire que quedó en el espacio muerto se expande mientras el pistón regresa.",
                     "Hasta que su presión no baja a la de succión, no entra aire nuevo.")
        self.play(ReplacementTransform(t2, t3), ReplacementTransform(n2, n3), run_time=0.6)
        politropica(C, v4, P2, smooth, 2.6)
        self.wait(0.6)

        # 4 · succión y eficiencia volumétrica
        self.next_section("succion")
        t4 = rotulo("Succión").to_corner(UL, buff=0.35)
        ev = eta_v(P2)
        n4 = leyenda(f"Abre la de succión y entra aire nuevo, pero solo en {num(V1 - v4, 0)} % del barrido.",
                     f"La eficiencia volumétrica es {num(ev * 100, 0)} %: casi un tercio del cilindro trabaja en vano.")
        self.play(ReplacementTransform(t3, t4), ReplacementTransform(n3, n4), run_time=0.6)
        fase["abre_s"] = True
        self.play(v.animate.set_value(V1), run_time=2.4, rate_func=smooth)
        fase["abre_s"] = False
        traza.clear_updaters()
        llave = DoubleArrow(ax.c2p(v4, 40), ax.c2p(V1, 40), buff=0, color=NAVY, stroke_width=4, tip_length=0.14,
                            max_tip_length_to_length_ratio=0.12)
        r_titulo_llave = texto("aspira, en % del barrido:", TAM_NOTA, TINTA_2).move_to(ax.c2p(33, 720), aligned_edge=LEFT)
        r_llave = VGroup(r_titulo_llave, texto(f"una etapa, {num(eta_v(P2) * 100, 0)} %", TAM_NOTA, NAVY)
                         .next_to(r_titulo_llave, DOWN, 0.12, aligned_edge=LEFT))
        relleno = Polygon(*[ax.c2p(x, y) for x, y in
                            [(V1, P1)] + [(vv, P1 * (V1 / vv) ** NP) for vv in np.linspace(V1, v2, 30)] +
                            [(C, P2)] + [(vv, P2 * (C / vv) ** NP) for vv in np.linspace(C, v4, 20)]],
                          stroke_width=0, fill_color=NAVY, fill_opacity=0.15)
        self.play(FadeIn(relleno), GrowFromCenter(llave), FadeIn(r_llave), run_time=0.8)
        self.wait(1.0)
        self.wait(0.6)

        # 5 · dos etapas
        self.next_section("dos-etapas")
        t5 = rotulo("En dos etapas").to_corner(UL, buff=0.35)
        v2b, v4b = ciclo(P2B)
        n5 = leyenda(f"La primera etapa sube solo a {num(P2B, 0)} kPa, una relación de {num(R2, 2)}: el espacio muerto",
                     f"se reexpande poco y aspira {num(eta_v(P2B) * 100, 0)} % del barrido. Entre etapas, el aire se enfría.")
        ciclo2 = VMobject(stroke_color=OLIVA, stroke_width=5).set_points_as_corners(
            [ax.c2p(x, y) for x, y in [(V1, P1)] + [(vv, P1 * (V1 / vv) ** NP) for vv in np.linspace(V1, v2b, 30)] +
             [(C, P2B)] + [(vv, P2B * (C / vv) ** NP) for vv in np.linspace(C, v4b, 20)] + [(V1, P1)]])
        llave2 = DoubleArrow(ax.c2p(v4b, 15), ax.c2p(V1, 15), buff=0, color=OLIVA, stroke_width=4, tip_length=0.14,
                             max_tip_length_to_length_ratio=0.12)
        r_llave2 = texto(f"primera de dos, {num(eta_v(P2B) * 100, 0)} %", TAM_NOTA, OLIVA) \
            .next_to(r_llave, DOWN, 0.12, aligned_edge=LEFT)
        self.play(ReplacementTransform(t4, t5), ReplacementTransform(n4, n5), FadeOut(punto), run_time=0.6)
        self.play(Create(ciclo2), run_time=2.0)
        self.play(GrowFromCenter(llave2), FadeIn(r_llave2), run_time=0.8)
        self.wait(1.4)
        self.wait(0.6)
