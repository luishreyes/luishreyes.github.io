"""Cómo se ajusta el modelo de Rosin-Rammler a un tamizado: los siete puntos
del acumulado pasante se llevan a ln ln(1/R) contra ln d, donde el modelo es
una recta; la pendiente es n, el corte con el cero da d63, y de vuelta en la
curva se lee el d80 del modelo. Los datos son los del ejemplo de la sección 6
de la Lectura 3 de POU 2027-10 (100 g de un producto de molienda), así que los
números coinciden con el texto: n = 1,94, d63 = 0,62 mm, d80 = 0,79 mm frente
a 0,81 mm por interpolación.

    uv run publicar.py escenas/iqya-2031-2027-10/ajuste_rosin_rammler.py AjusteRosinRammler \
        --curso iqya-2031-2027-10 --carpeta lecturas/Lectura_03 --tema uniandes --fondo nieve \
        --nombre ajuste-rosin-rammler --titulo "cómo se ajusta el modelo de Rosin-Rammler a un tamizado"
"""
from estilo import *

# Abertura del tamiz (mm) y porcentaje acumulado que la pasa
D = np.array([1.18, 0.85, 0.60, 0.425, 0.30, 0.212, 0.150])
PASA = np.array([95, 83, 65, 43, 25, 12, 5]) / 100.0
R = 1 - PASA                              # retenido acumulado
LX = np.log(D)
LY = np.log(np.log(1 / R))
N, B = np.polyfit(LX, LY, 1)              # recta: LY = N·LX + B
D63 = float(np.exp(-B / N))
D80 = D63 * (-np.log(0.2)) ** (1 / N)
PRED = 1 - np.exp(-(D / D63) ** N)
R2 = 1 - np.sum((PASA - PRED) ** 2) / np.sum((PASA - PASA.mean()) ** 2)
D80_INTERP = 0.85 - (83 - 80) / (83 - 65) * (0.85 - 0.60)


TICKS = ((0.15, "0,15"), (0.3, "0,3"), (0.6, "0,6"), (1.2, "1,2"))


def mezcla(*partes, tam=TAM_TEXTO, color=None, peso=MEDIUM):
    """Una línea que mezcla texto en Barlow y símbolos en LaTeX: Barlow no
    trae subíndices. Cada parte es un str (texto) o una tupla ('tex', s)."""
    objs = []
    for p in partes:
        if isinstance(p, tuple):
            objs.append(formula(p[1], tam=tam + 4, color=color or TINTA))
        else:
            objs.append(texto(p, tam, color, peso=peso))
    return VGroup(*objs).arrange(RIGHT, buff=0.16)


def pasa_rr(d):
    return 1 - np.exp(-(d / D63) ** N)


def lineas(renglones, tam=TAM_TEXTO, color=None, peso=MEDIUM):
    return VGroup(*[texto(r, tam, color, peso=peso) for r in renglones]).arrange(DOWN, aligned_edge=LEFT, buff=0.12)


def ejes_libres(x_range, y_range, x_largo, y_largo):
    """Ejes sin números ni marcas: cada escena pone las suyas."""
    return Axes(x_range=x_range, y_range=y_range, x_length=x_largo, y_length=y_largo, tips=False,
                axis_config={"color": TINTA_2, "stroke_width": 3, "include_ticks": False})


def marca_x(ax, x, etiqueta):
    p = ax.c2p(x, ax.y_range[0])
    raya = Line(p, p + DOWN * 0.1, color=TINTA_2, stroke_width=3)
    return VGroup(raya, texto(etiqueta, TAM_NOTA, TINTA_2).next_to(raya, DOWN, 0.1))


def marca_y(ax, y, etiqueta):
    p = ax.c2p(ax.x_range[0], y)
    raya = Line(p, p + LEFT * 0.1, color=TINTA_2, stroke_width=3)
    return VGroup(raya, texto(etiqueta, TAM_NOTA, TINTA_2).next_to(raya, LEFT, 0.1))


class AjusteRosinRammler(Scene):
    def construct(self):
        X0, Y0 = -5.55, -1.75           # esquina inferior izquierda de las gráficas
        AN, AL = 6.2, 4.25
        PANEL = 1.45                   # borde izquierdo del panel de texto
        ARRIBA = 2.75

        def paso(s):
            return rotulo(s, color=TINTA).to_corner(UL, buff=0.4)

        def en_panel(m, y=ARRIBA):
            return m.move_to([PANEL, y, 0], aligned_edge=UL)

        # ── Gráfica 1: acumulado pasante contra la abertura (eje logarítmico) ──
        def lg(d):                     # abscisa de la gráfica 1: log10(d / 0,12 mm), que arranca en 0
            return np.log10(d / 0.12)
        U1 = lg(1.6)
        g1 = ejes_libres((0, U1, 1), (0, 100, 10), AN, AL)
        g1.shift([X0, Y0, 0] - g1.c2p(0, 0))
        t1x = VGroup(*[marca_x(g1, lg(v), e) for v, e in TICKS])
        t1y = VGroup(*[marca_y(g1, v, str(v)) for v in (0, 20, 40, 60, 80, 100)])
        tit1x = texto("Abertura del tamiz, d (mm)", TAM_NOTA, TINTA_2).next_to(t1x, DOWN, 0.18)
        tit1y = texto("% que pasa", TAM_NOTA, TINTA_2).rotate(PI / 2).next_to(t1y, LEFT, 0.22)
        marco1 = VGroup(g1, t1x, t1y, tit1x, tit1y)
        assert marco1.get_bottom()[1] > -2.8, marco1.get_bottom()   # libre la franja de los controles
        assert marco1.get_left()[0] > -7.0, marco1.get_left()

        def p1(d, pasa):
            return g1.c2p(lg(d), 100 * pasa)

        def punto(pos):
            return Dot(pos, radius=0.11, color=NAVY, fill_color=AMARILLO, fill_opacity=1, stroke_width=4)

        # ── 1. Lo que da el tamizado ──────────────────────────────────────
        self.next_section("datos")
        titulo = paso("Un tamizado da siete puntos, no una curva")
        puntos = VGroup(*[punto(p1(d, x)) for d, x in zip(D, PASA)])
        nota = en_panel(VGroup(lineas(["Cada punto es una malla:", "el porcentaje de la masa", "que pasa por esa abertura."],
                                      TAM_TEXTO, TINTA),
                               lineas(["El eje de tamaños va en", "escala logarítmica."], TAM_TEXTO, TINTA_2)
                               ).arrange(DOWN, aligned_edge=LEFT, buff=0.4))
        self.play(FadeIn(titulo), Create(g1), FadeIn(t1x), FadeIn(t1y), FadeIn(tit1x), FadeIn(tit1y), run_time=1.2)
        self.play(LaggedStart(*[GrowFromCenter(p) for p in puntos], lag_ratio=0.15), run_time=1.4)
        self.play(FadeIn(nota, shift=UP * 0.1), run_time=0.7)
        self.wait(0.8)

        # ── 2. El modelo ──────────────────────────────────────────────────
        self.next_section("modelo")
        nuevo = paso("El modelo de Rosin-Rammler")
        ec = formula(r"X(d) = 1 - \exp\!\left[-\left(\frac{d}{d_{63}}\right)^{n}\right]", tam=40)
        expl = VGroup(texto("Dos parámetros:", TAM_TEXTO, TINTA),
                      mezcla(("tex", r"d_{63}"), "el tamaño que pasa el 63,2 %", tam=TAM_NOTA + 1),
                      mezcla(("tex", r"n"), "qué tan angosta es la curva", tam=TAM_NOTA + 1)).arrange(DOWN, aligned_edge=LEFT, buff=0.14)
        pregunta = lineas(["¿Cómo se sacan de", "siete puntos?"], TAM_TEXTO, ACERO_OSC, SEMIBOLD)
        bloque = en_panel(VGroup(ec, expl, pregunta).arrange(DOWN, aligned_edge=LEFT, buff=0.35))
        assert bloque.get_right()[0] < 6.95, bloque.get_right()
        self.play(FadeTransform(titulo, nuevo), FadeOut(nota), run_time=0.7)
        titulo = nuevo
        self.play(Write(ec), run_time=1.2)
        self.play(FadeIn(expl, shift=UP * 0.1), run_time=0.8)
        self.play(FadeIn(pregunta, shift=UP * 0.1), run_time=0.6)
        self.wait(0.8)

        # ── Gráfica 2: ln ln(1/R) contra ln d ─────────────────────────────
        XA, YA = -2.1, -3.4            # la gráfica 2 se dibuja corrida para que los ejes queden en los bordes
        g2 = ejes_libres((0, 0.35 - XA, 1), (0, 1.6 - YA, 1), AN, AL)
        g2.shift([X0, Y0, 0] - g2.c2p(0, 0))

        def p2(x, y):
            return g2.c2p(x - XA, y - YA)

        t2x = VGroup(*[marca_x(g2, v - XA, num(v, 1)) for v in (-2.0, -1.5, -1.0, -0.5, 0.0)])
        t2y = VGroup(*[marca_y(g2, v - YA, num(v, 0)) for v in (-3, -2, -1, 0, 1)])
        tit2x = texto("ln d", TAM_NOTA, TINTA_2).next_to(t2x, DOWN, 0.18)
        tit2y = texto("ln ln(1/R)", TAM_NOTA, TINTA_2).rotate(PI / 2).next_to(t2y, LEFT, 0.22)
        marco2 = VGroup(g2, t2x, t2y, tit2x, tit2y)
        assert marco2.get_left()[0] > -7.0, marco2.get_left()
        cero = DashedLine(p2(-2.1, 0), p2(0.35, 0), color=TINTA_3, dash_length=0.1, stroke_width=2)

        # ── 3. Linealizar ─────────────────────────────────────────────────
        self.next_section("linealizar")
        nuevo = paso("Dos logaritmos vuelven el modelo una recta")
        lin = formula(r"\ln\ln\frac{1}{R} = n\,\ln d \;-\; n\,\ln d_{63}", tam=42)
        rdef = lineas(["R = 1 − X, lo que queda retenido."], TAM_NOTA, TINTA_2)
        bloque2 = en_panel(VGroup(lin, rdef).arrange(DOWN, aligned_edge=LEFT, buff=0.25))
        self.play(FadeTransform(titulo, nuevo), FadeOut(expl), FadeOut(pregunta), run_time=0.7)
        titulo = nuevo
        self.play(ec.animate.scale(0.8).move_to([PANEL, ARRIBA, 0], aligned_edge=UL), run_time=0.6)
        bloque2.next_to(ec, DOWN, 0.35, aligned_edge=LEFT)
        self.play(FadeIn(bloque2, shift=UP * 0.1), run_time=0.8)
        nuevos = VGroup(*[punto(p2(x, y)) for x, y in zip(LX, LY)])
        self.play(ReplacementTransform(marco1, marco2),
                  *[p.animate.move_to(q.get_center()) for p, q in zip(puntos, nuevos)],
                  run_time=2.0, rate_func=smooth)
        self.play(Create(cero), run_time=0.5)
        self.wait(0.8)

        # ── 4. La recta da n y d63 ────────────────────────────────────────
        self.next_section("recta")
        nuevo = paso("La pendiente es n; el corte con el cero da el tamaño")
        recta = g2.plot(lambda u: N * (u + XA) + B - YA, x_range=(0.05, 0.3 - XA), color=ACERO, stroke_width=6)
        x63 = np.log(D63)
        p63 = Dot(p2(x63, 0), radius=0.13, color=ACERO_OSC, fill_color=ACERO_OSC, fill_opacity=1)
        guia = DashedLine(p2(x63, 0), p2(x63, YA), color=ACERO_OSC, dash_length=0.08, stroke_width=2.5)
        res = VGroup(formula(rf"n = {num(N, 2)}", tam=38),
                     formula(rf"\ln d_{{63}} = {num(x63, 2)}", tam=38),
                     formula(rf"d_{{63}} = e^{{{num(x63, 2)}}} = {num(D63, 2)}\ \mathrm{{mm}}", tam=38),
                     formula(rf"R^2 = {num(R2, 3)}", tam=38)).arrange(DOWN, aligned_edge=LEFT, buff=0.16)
        res.next_to(bloque2, DOWN, 0.4, aligned_edge=LEFT)
        assert res.get_bottom()[1] > -2.8, res.get_bottom()
        assert res.get_right()[0] < 6.95, res.get_right()
        self.play(FadeTransform(titulo, nuevo), run_time=0.7)
        titulo = nuevo
        self.play(Create(recta), run_time=1.3)
        self.play(GrowFromCenter(p63), Create(guia), run_time=0.7)
        self.play(FadeIn(res, shift=UP * 0.1), run_time=0.9)
        self.wait(1.0)

        # ── 5. De vuelta a la curva ───────────────────────────────────────
        self.next_section("curva")
        nuevo = paso("De vuelta en la curva, con el modelo")
        g1b = ejes_libres((0, U1, 1), (0, 100, 10), AN, AL)
        g1b.shift([X0, Y0, 0] - g1b.c2p(0, 0))
        t1xb = VGroup(*[marca_x(g1b, lg(v), e) for v, e in TICKS])
        t1yb = VGroup(*[marca_y(g1b, v, str(v)) for v in (0, 20, 40, 60, 80, 100)])
        tit1xb = texto("Abertura del tamiz, d (mm)", TAM_NOTA, TINTA_2).next_to(t1xb, DOWN, 0.18)
        tit1yb = texto("% que pasa", TAM_NOTA, TINTA_2).rotate(PI / 2).next_to(t1yb, LEFT, 0.22)
        marco1b = VGroup(g1b, t1xb, t1yb, tit1xb, tit1yb)
        curva = g1b.plot(lambda u: 100 * pasa_rr(0.12 * 10 ** u), x_range=(0, U1), color=ACERO, stroke_width=6)
        de_vuelta = VGroup(*[punto(g1b.c2p(lg(d), 100 * x)) for d, x in zip(D, PASA)])
        self.play(FadeTransform(titulo, nuevo), FadeOut(guia), FadeOut(p63), FadeOut(cero), FadeOut(bloque2),
                  res.animate.next_to(ec, DOWN, 0.4, aligned_edge=LEFT), run_time=0.9)
        titulo = nuevo
        self.play(ReplacementTransform(marco2, marco1b), ReplacementTransform(recta, curva),
                  *[p.animate.move_to(q.get_center()) for p, q in zip(puntos, de_vuelta)],
                  run_time=2.0, rate_func=smooth)

        def lectura(dd, pct, et, lado):
            h = DashedLine(g1b.c2p(0, pct), g1b.c2p(lg(dd), pct), color=NAVY, dash_length=0.08, stroke_width=2.5)
            v = DashedLine(g1b.c2p(lg(dd), pct), g1b.c2p(lg(dd), 0), color=NAVY, dash_length=0.08, stroke_width=2.5)
            e = formula(et, tam=34, color=NAVY).next_to(g1b.c2p(0.06, pct), UR, 0.1)
            return VGroup(h, v, e)

        l63 = lectura(D63, 63.2, rf"d_{{63}} = {num(D63, 2)}\ \mathrm{{mm}}", UL)
        l80 = lectura(D80, 80, rf"d_{{80}} = {num(D80, 2)}\ \mathrm{{mm}}", UL)
        comp = VGroup(texto("Interpolando entre dos mallas:", TAM_NOTA, TINTA_2),
                      formula(rf"d_{{80}} = {num(D80_INTERP, 2)}\ \mathrm{{mm}}", tam=36, color=TINTA_2)
                      ).arrange(DOWN, aligned_edge=LEFT, buff=0.12)
        comp.next_to(ec, DOWN, 0.4, aligned_edge=LEFT).shift(DOWN * (res.height + 0.35))
        assert comp.get_bottom()[1] > -2.8, comp.get_bottom()
        self.play(Create(l63), run_time=0.9)
        self.play(Create(l80), run_time=0.9)
        self.play(FadeIn(comp, shift=UP * 0.1), run_time=0.7)
        self.wait(2.2)
