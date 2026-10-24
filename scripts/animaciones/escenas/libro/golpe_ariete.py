"""Las cuatro fases del golpe de ariete: tanque, tubo y válvula al final.

Para el capítulo 9 del libro de operaciones unitarias (flujo de fluidos en
tuberías). El tubo es la descarga del caso: 24 m de acero de 2½ in cédula
40 (62,71 mm, pared de 5,16 mm), con agua a 2,25 m/s. Con β = 2,2 GPa y
E = 207 GPa, la ecuación 6-204 del Perry da a = 1398 m/s, y la de
Joukowski (6-203), Δh = aΔv/g = 321 m de agua (3,13 MPa). La onda tarda
L/a = 17 ms en cruzar el tubo y el ciclo dura 4L/a = 69 ms.

El modelo es el de Joukowski sin fricción, con cierre instantáneo: la
presión y la velocidad cambian en escalón en el frente de onda, y la
oscilación no se amortigua. El tubo se ensancha y se estrecha mucho más
que en la realidad, para que se vea.

    uv run publicar.py escenas/libro/golpe_ariete.py GolpeAriete \
        --tema uniandes --fondo nieve --destino {libro}/figuras/flujo-de-fluidos-en-tuberias
"""
from estilo import *

# ── El caso ─────────────────────────────────────────────────────────────
L_M, A_ONDA, V0, DH = 24.0, 1398.0, 2.25, 321.0
T_CRUCE = L_M / A_ONDA * 1000              # ms que tarda la onda en cruzar el tubo

# ── El dibujo ───────────────────────────────────────────────────────────
X0, X1, YP = -4.7, 4.1, -1.75              # el tubo, del tanque a la válvula
RAD = {0: 0.24, 1: 0.33, -1: 0.17}         # medio alto del tubo según la presión (exagerado)
RELLENO = {0: REJILLA, 1: NAVY, -1: AMARILLO}
YB, AMP = 0.3, 1.1                         # la franja de presión: línea inicial y escalón
XV = X1 + 0.28                             # la válvula


def estado(tau, x):
    """Presión (−1, 0, 1) y velocidad (−1, 0, 1) en x ∈ [0, 1], del tanque a la válvula,
    con tau el tiempo en cruces del tubo (L/a). Antes del cierre, tau < 0."""
    if tau < 0:
        return 0, 1
    k, f = int(tau) % 4, tau - int(tau)
    if k == 0:
        return (1, 0) if x > 1 - f else (0, 1)
    if k == 1:
        return (0, -1) if x < f else (1, 0)
    if k == 2:
        return (-1, 0) if x > 1 - f else (0, -1)
    return (0, 1) if x < f else (-1, 0)


def frente(tau):
    if tau < 0:
        return None
    k, f = int(tau) % 4, tau - int(tau)
    return 1 - f if k in (0, 2) else f


def tramos(tau):
    xf = frente(tau)
    cortes = [0.0, 1.0] if xf is None or xf <= 0 or xf >= 1 else [0.0, xf, 1.0]
    out = []
    for a, b in zip(cortes[:-1], cortes[1:]):
        p, v = estado(tau, (a + b) / 2)
        out.append((a, b, p, v))
    return out


def xm(x):
    return X0 + x * (X1 - X0)


class GolpeAriete(Scene):
    def construct(self):
        t = ValueTracker(-1.0)

        # tanque y válvula, fijos
        tanque = VGroup(
            Rectangle(width=1.5, height=2.0, stroke_width=0, fill_color=REJILLA, fill_opacity=1)
            .move_to([X0 - 0.75, YP + 0.45, 0]),
            VMobject(stroke_color=TINTA, stroke_width=4).set_points_as_corners(
                [[X0 - 1.5, YP + 1.75, 0], [X0 - 1.5, YP - 0.55, 0], [X0, YP - 0.55, 0], [X0, YP + 1.75, 0]]),
        )
        nivel = Triangle(fill_color=TINTA, fill_opacity=1, stroke_width=0).scale(0.08).rotate(PI) \
            .move_to([X0 - 1.1, YP + 1.45 + 0.09, 0])
        valv = VGroup(
            Polygon([XV - 0.2, YP + 0.14, 0], [XV + 0.2, YP - 0.14, 0], [XV + 0.2, YP + 0.14, 0], [XV - 0.2, YP - 0.14, 0],
                    stroke_color=TINTA, stroke_width=3, fill_color=FONDO, fill_opacity=1),
            Line([XV, YP, 0], [XV, YP + 0.45, 0], stroke_color=TINTA, stroke_width=3),
            Line([XV - 0.15, YP + 0.45, 0], [XV + 0.15, YP + 0.45, 0], stroke_color=TINTA, stroke_width=3),
        )
        salida = VGroup(Line([XV + 0.2, YP + 0.12, 0], [XV + 0.75, YP + 0.12, 0], stroke_color=TINTA, stroke_width=3),
                        Line([XV + 0.2, YP - 0.12, 0], [XV + 0.75, YP - 0.12, 0], stroke_color=TINTA, stroke_width=3))
        chorro = Arrow([XV + 0.3, YP, 0], [XV + 1.15, YP, 0], buff=0, color=TINTA_2, stroke_width=4,
                       max_tip_length_to_length_ratio=0.3)
        cierre = Rectangle(width=0.07, height=0.26, stroke_width=0, fill_color=TINTA, fill_opacity=1).move_to([XV, YP, 0])
        r_tanque = texto("tanque", TAM_NOTA, TINTA_2).move_to([X0 - 0.75, YP - 0.95, 0])
        r_tubo = texto("24 m de acero, 2½ in", TAM_NOTA, TINTA_2).move_to([(X0 + X1) / 2, YP - 0.75, 0])
        r_valv = texto("válvula", TAM_NOTA, TINTA_2).move_to([XV + 0.1, YP - 0.75, 0])

        def tubo():
            g = VGroup()
            for a, b, p, v in tramos(t.get_value()):
                r = RAD[p]
                xa, xb = xm(a), xm(b)
                g.add(Polygon([xa, YP + r, 0], [xb, YP + r, 0], [xb, YP - r, 0], [xa, YP - r, 0],
                              stroke_width=0, fill_color=RELLENO[p], fill_opacity=1))
                g.add(Line([xa, YP + r, 0], [xb, YP + r, 0], stroke_color=TINTA, stroke_width=3))
                g.add(Line([xa, YP - r, 0], [xb, YP - r, 0], stroke_color=TINTA, stroke_width=3))
                if p == -1:
                    g[-3].set_stroke(TINTA, 1.5, 1)
            # flechas de la velocidad del agua donde corre
            for x in np.linspace(0.07, 0.93, 8):
                p, v = estado(t.get_value(), x)
                if v:
                    c = xm(x)
                    g.add(Arrow([c - 0.22 * v, YP, 0], [c + 0.22 * v, YP, 0], buff=0, color=TINTA, stroke_width=4,
                                max_tip_length_to_length_ratio=0.35))
            return g

        def franja():
            g = VGroup()
            for a, b, p, v in tramos(t.get_value()):
                xa, xb, y = xm(a), xm(b), YB + p * AMP
                if p:
                    g.add(Polygon([xa, YB, 0], [xb, YB, 0], [xb, y, 0], [xa, y, 0], stroke_width=0,
                                  fill_color=NAVY if p > 0 else AMARILLO, fill_opacity=0.18 if p > 0 else 0.8))
                g.add(Line([xa, y, 0], [xb, y, 0], stroke_color=NAVY, stroke_width=5))
            xf = frente(t.get_value())
            if xf is not None and 0 < xf < 1:
                ys = [YB + estado(t.get_value(), xf - 1e-6)[0] * AMP, YB + estado(t.get_value(), xf + 1e-6)[0] * AMP]
                g.add(Line([xm(xf), min(ys), 0], [xm(xf), max(ys), 0], stroke_color=NAVY, stroke_width=5))
                g.add(DashedLine([xm(xf), YB - AMP - 0.1, 0], [xm(xf), YP + 0.4, 0], stroke_color=TINTA_3, stroke_width=2,
                                 dash_length=0.08))
            return g

        base = DashedLine([X0, YB, 0], [X1, YB, 0], stroke_color=TINTA_3, stroke_width=2, dash_length=0.1)
        guias = VGroup(*[DashedLine([X0, YB + k * AMP, 0], [X1, YB + k * AMP, 0], stroke_color=REJILLA, stroke_width=2,
                                    dash_length=0.1) for k in (1, -1)])
        r_base = texto("presión inicial", TAM_NOTA, TINTA_2).next_to([X1, YB, 0], RIGHT, 0.2)
        r_alta = texto("+321 m", TAM_NOTA, NAVY).next_to([X1, YB + AMP, 0], RIGHT, 0.2)
        r_baja = texto("−321 m", TAM_NOTA, NAVY).next_to([X1, YB - AMP, 0], RIGHT, 0.2)
        r_franja = texto("presión a lo largo del tubo", TAM_NOTA, TINTA_2).next_to([X0, YB + AMP, 0], UP, 0.15, aligned_edge=LEFT)
        reloj = always_redraw(lambda: texto(f"t = {num(max(0.0, t.get_value()) * T_CRUCE, 1)} ms", TAM_TEXTO, TINTA)
                              .to_corner(UR, buff=0.4))
        g_tubo, g_franja = always_redraw(tubo), always_redraw(franja)

        titulo = rotulo("Agua a 2,25 m/s y la válvula abierta").to_corner(UL, buff=0.35)
        nota = texto("Una línea de 24 m de acero de 2½ in, la descarga del caso.", TAM_NOTA, TINTA_2) \
            .next_to(titulo, DOWN, 0.15, aligned_edge=LEFT)

        def leyenda(*lineas):
            return VGroup(*[texto(s, TAM_NOTA, TINTA_2) for s in lineas]).arrange(DOWN, buff=0.08, aligned_edge=LEFT) \
                .next_to(titulo, DOWN, 0.15, aligned_edge=LEFT)

        self.next_section("flujo")
        self.add(tanque, nivel, g_tubo, valv, salida, chorro, r_tanque, r_tubo, r_valv)
        self.add(guias, base, r_base, r_franja, g_franja, titulo, nota)
        self.wait(1.2)
        self.wait(0.6)

        self.next_section("cierre")
        t2 = rotulo("La válvula cierra de golpe").to_corner(UL, buff=0.35)
        n2 = leyenda("El agua junto a ella se detiene, se comprime y estira el tubo:",
                     "la presión sube 321 m de agua, 3,1 MPa. El frente viaja al tanque a 1398 m/s.")
        self.play(FadeIn(cierre), FadeOut(chorro), ReplacementTransform(titulo, t2), ReplacementTransform(nota, n2),
                  FadeIn(reloj), run_time=0.6)
        t.set_value(0.0)
        self.play(t.animate.set_value(1.0), FadeIn(r_alta), run_time=3.2, rate_func=linear)
        self.wait(0.6)

        self.next_section("rebote")
        t3 = rotulo("En el tanque, la onda rebota").to_corner(UL, buff=0.35)
        n3 = leyenda("El tanque no deja subir la presión: el agua sale hacia él a 2,25 m/s",
                     "y la presión vuelve a la inicial. El frente regresa a la válvula.")
        self.play(ReplacementTransform(t2, t3), ReplacementTransform(n2, n3), run_time=0.6)
        self.play(t.animate.set_value(2.0), run_time=3.2, rate_func=linear)
        self.wait(0.6)

        self.next_section("baja")
        t4 = rotulo("Junto a la válvula, la presión cae").to_corner(UL, buff=0.35)
        n4 = VGroup(texto("El agua que se aleja de la válvula cerrada deja una onda de baja presión, −321 m.", TAM_NOTA, TINTA_2),
                    texto("En un tubo real la presión llega antes a la de vapor: el agua hierve y la columna se separa.",
                          TAM_NOTA, AMBAR)).arrange(DOWN, buff=0.08, aligned_edge=LEFT).next_to(t4, DOWN, 0.15, aligned_edge=LEFT)
        self.play(ReplacementTransform(t3, t4), ReplacementTransform(n3, n4), FadeIn(r_baja), run_time=0.6)
        self.play(t.animate.set_value(3.0), run_time=3.2, rate_func=linear)
        self.wait(0.6)

        self.next_section("vuelta")
        t5 = rotulo("Y vuelve a empezar").to_corner(UL, buff=0.35)
        n5 = leyenda("La onda rebota otra vez en el tanque y el agua vuelve a correr hacia la válvula.",
                     "A los 4L/a = 69 ms todo está como al cerrar. Sin fricción, el ciclo no se apaga.")
        self.play(ReplacementTransform(t4, t5), ReplacementTransform(n4, n5), run_time=0.6)
        self.play(t.animate.set_value(4.0), run_time=3.2, rate_func=linear)
        self.wait(0.6)

        # el registro en la válvula: dos ciclos, como lo marcaría un manómetro rápido
        self.next_section("registro")
        t6 = rotulo("La presión en la válvula").to_corner(UL, buff=0.35)
        n6 = leyenda("Sube 321 m durante 2L/a = 34 ms y baja otros tantos durante 34 ms más.",
                     "En un tubo real, la fricción la apaga en unos ciclos.")
        reloj.clear_updaters()
        g_tubo.clear_updaters()
        g_franja.clear_updaters()
        figura = VGroup(tanque, nivel, g_tubo, valv, salida, cierre, r_tanque, r_tubo, r_valv,
                        guias, base, r_base, r_alta, r_baja, r_franja, g_franja, reloj)
        ax = ejes((0, 140, 20), (-400, 400, 200), x_largo=9.4, y_largo=3.4, y_numeros=[]).move_to([0.35, -0.5, 0])
        y_num = VGroup(*[texto(("−" if v < 0 else "") + str(abs(v)), TAM_NOTA, TINTA_2).next_to(ax.c2p(0, v), LEFT, 0.18)
                         for v in (-400, -200, 0, 200, 400)])
        ax.add(y_num, texto("Δh (m de agua)", TAM_NOTA, TINTA_2).rotate(PI / 2).next_to(y_num, LEFT, 0.3).match_y(ax.y_axis))
        x_tit = texto("tiempo desde el cierre (ms)", TAM_NOTA, TINTA_2).next_to(ax.c2p(70, -400), DOWN, 0.6)
        ms = 2 * T_CRUCE
        puntos = [(0, 0)]
        for k in range(4):
            nivel_k = DH if k % 2 == 0 else -DH
            puntos += [(k * ms, nivel_k), ((k + 1) * ms, nivel_k)]
        traza = VMobject(stroke_color=NAVY, stroke_width=5).set_points_as_corners([ax.c2p(x, y) for x, y in puntos])
        cero = DashedLine(ax.c2p(0, 0), ax.c2p(140, 0), stroke_color=TINTA_3, stroke_width=2, dash_length=0.1)
        flecha = DoubleArrow(ax.c2p(0, DH + 45), ax.c2p(ms, DH + 45), buff=0, color=TINTA_2, stroke_width=3,
                             tip_length=0.14, max_tip_length_to_length_ratio=0.2)
        r_ms = VGroup(flecha, texto("2L/a = 34 ms", TAM_NOTA, TINTA_2).next_to(flecha, UP, 0.08))
        self.play(FadeOut(figura), ReplacementTransform(t5, t6), ReplacementTransform(n5, n6), run_time=0.8)
        self.play(Create(ax), FadeIn(cero), FadeIn(x_tit), run_time=1.0)
        self.play(Create(traza), FadeIn(r_ms), run_time=2.4, rate_func=linear)
        self.wait(1.2)
        self.wait(0.6)
