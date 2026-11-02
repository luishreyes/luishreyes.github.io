"""Eficiencias en destilación (POU 2026-20): tres animaciones para el deck.

EscalonMurphree  · diapositiva «El escalón que no llega»: qué mide Murphree en
                   un plato y cómo los puntos de los platos reales dibujan la
                   curva efectiva. Volatilidad constante α = 2,2, x_D = 0,85,
                   R = 3 y E_M = 0,64 (el caso «Murphree de la diapositiva de
                   Eficiencias» del Explorador McCabe-Thiele).
CurvaEfectiva    · diapositiva «La curva efectiva»: la columna del Taller 9
                   (etanol-agua, tabla x-y con PCHIP, z_F = 0,20, x_D = 0,80,
                   x_B = 0,02, q = 1,1, R = 2,5) escalonada contra el equilibrio
                   (10,96 etapas) y contra la curva efectiva (17,6 con 0,64).
                   El escalonado es el de stepColumn del explorador: el hervidor
                   siempre es de equilibrio.
PlatosReales     · diapositiva «De etapas teóricas a platos que se compran»:
                   9,96 etapas en la columna divididas por la eficiencia global
                   (55 %, 46,7 % de O'Connell y 37 %) a 450 mm entre platos.

    uv run python publicar.py escenas/iqya-2031-2026-20/eficiencias.py EscalonMurphree \
        --curso iqya-2031-2026-20 --deck Eficiencias_en_Destilacion --formato 4:3
"""
from math import ceil

from estilo import *


# ── Modelo ──────────────────────────────────────────────────────────────
def pchip(xs, ys):
    """PCHIP igual al PchipInterpolator de SciPy (el del explorador y el cuaderno)."""
    n = len(xs)
    h = [xs[k + 1] - xs[k] for k in range(n - 1)]
    m = [(ys[k + 1] - ys[k]) / h[k] for k in range(n - 1)]
    sg = lambda v: (v > 0) - (v < 0)
    d = [0.0] * n
    for i in range(1, n - 1):
        if sg(m[i]) != sg(m[i - 1]) or m[i] == 0 or m[i - 1] == 0:
            d[i] = 0.0
        else:
            w1, w2 = 2 * h[i] + h[i - 1], h[i] + 2 * h[i - 1]
            d[i] = (w1 + w2) / (w1 / m[i - 1] + w2 / m[i])

    def borde(h0, h1, m0, m1):
        dd = ((2 * h0 + h1) * m0 - h0 * m1) / (h0 + h1)
        if sg(dd) != sg(m0):
            dd = 0.0
        elif sg(m0) != sg(m1) and abs(dd) > 3 * abs(m0):
            dd = 3 * m0
        return dd

    d[0] = borde(h[0], h[1], m[0], m[1])
    d[n - 1] = borde(h[n - 2], h[n - 3], m[n - 2], m[n - 3])

    def f(x):
        if x <= xs[0]:
            k = 0
        elif x >= xs[-1]:
            k = n - 2
        else:
            lo, hi = 0, n - 1
            while hi - lo > 1:
                md = (lo + hi) >> 1
                if xs[md] <= x:
                    lo = md
                else:
                    hi = md
            k = lo
        t = (x - xs[k]) / h[k]
        t2, t3 = t * t, t * t * t
        return ((2 * t3 - 3 * t2 + 1) * ys[k] + (t3 - 2 * t2 + t) * h[k] * d[k]
                + (-2 * t3 + 3 * t2) * ys[k + 1] + (t3 - t2) * h[k] * d[k + 1])
    return f


c01 = lambda v: min(1.0, max(0.0, v))

# Tabla x-y del Taller 9 (etanol-agua, 1 atm)
T9X = [0, .01, .02, .05, .1, .2, .3, .4, .5, .55, .65, .75, .85, .894, .95, 1]
T9Y = [0, .110, .175, .325, .442, .531, .576, .614, .654, .676, .722, .778, .856, .894, .942, 1]
_fy, _fx = pchip(T9X, T9Y), pchip(T9Y, T9X)
eq_y = lambda x: c01(_fy(c01(x)))
eq_x = lambda y: c01(_fx(c01(y)))

ZF, XD, XB, Q, R = 0.20, 0.80, 0.02, 1.1, 2.5
M_R, B_R = R / (R + 1), XD / (R + 1)
_mq, _bq = Q / (Q - 1), -ZF / (Q - 1)
XI = (_bq - B_R) / (M_R - _mq)
YI = M_R * XI + B_R
M_S = (YI - XB) / (XI - XB)
B_S = XB - M_S * XB


def op_y(x):
    return M_R * x + B_R if x >= XI else M_S * x + B_S


def efectiva(x, E):
    yo = op_y(x)
    return yo + E * (eq_y(x) - yo)


def escalonar(E):
    """stepColumn del explorador, desde la cabeza. Devuelve (N, escalones);
    cada escalón es (y, x, y_siguiente) y el último es el hervidor."""
    st, sec, y, xp = [], "rect", XD, XD
    for _ in range(250):
        mm, bb = (M_R, B_R) if sec == "rect" else (M_S, B_S)
        xs = eq_x(y)
        if xs <= XB + 1e-12:                       # el hervidor (de equilibrio) alcanza los fondos
            fr = c01((xp - XB) / max(1e-12, xp - xs))
            st.append((y, xs, xs))
            return len(st) - 1 + fr, st
        if E < 1:
            lo, hi = 0.0, xp
            for _ in range(56):
                mid = 0.5 * (lo + hi)
                yo = mm * mid + bb
                if yo + E * (eq_y(mid) - yo) > y:
                    hi = mid
                else:
                    lo = mid
            x = 0.5 * (lo + hi)
        else:
            x = xs
        if sec == "rect" and x <= XI:
            sec = "strip"
        mm, bb = (M_R, B_R) if sec == "rect" else (M_S, B_S)
        yn = mm * x + bb
        st.append((y, x, yn))
        y, xp = yn, x
    return float("nan"), st


# ══════════════════════════════════════════════════════════════════════════
# 1. El escalón que no llega
# ══════════════════════════════════════════════════════════════════════════
ALFA, XD1, R1, EM = 2.2, 0.85, 3.0, 0.64
eq1 = lambda x: ALFA * x / (1 + (ALFA - 1) * x)
op1 = lambda x: R1 / (R1 + 1) * x + XD1 / (R1 + 1)
ef1 = lambda x: op1(x) + EM * (eq1(x) - op1(x))


class EscalonMurphree(Scene):
    def construct(self):
        X0, X1, Y0, Y1 = 0.30, 0.85, 0.40, 0.95
        ax = ejes((X0, X1, 0.1), (Y0, Y1, 0.1), x_largo=5.6, y_largo=5.6,
                  x_titulo="Fracción en el líquido", y_titulo="Fracción en el vapor",
                  x_numeros=[0.3, 0.4, 0.5, 0.6, 0.7, 0.8], y_numeros=[0.4, 0.5, 0.6, 0.7, 0.8, 0.9], dec=1)
        ax.shift([-3.7, -2.6, 0] - ax.c2p(X0, Y0))
        titulo = rotulo("Equilibrio y operación", tam=36).to_corner(UL, buff=0.3)

        # ── 1. Las curvas ───────────────────────────────────────────────
        self.next_section("curvas")
        diag = DashedLine(ax.c2p(Y0, Y0), ax.c2p(X1, X1), color=REJILLA, stroke_width=3, dash_length=0.12)
        equil = ax.plot(eq1, x_range=(X0, X1), color=TINTA, stroke_width=6)
        oper = ax.plot(op1, x_range=(X0, X1), color=ACERO, stroke_width=6)
        et_eq = texto("Equilibrio", TAM_NOTA, peso=SEMIBOLD).next_to(ax.c2p(0.66, eq1(0.66)), UL, 0.1)
        et_op = texto("Operación", TAM_NOTA, ACERO_OSC, peso=SEMIBOLD).next_to(ax.c2p(0.42, op1(0.42)), DR, 0.12)
        self.play(Create(ax), FadeIn(titulo), Create(diag), run_time=1.4)
        self.play(Create(equil), FadeIn(et_eq), run_time=1.2)
        self.play(Create(oper), FadeIn(et_op), run_time=1.2)
        self.wait(0.6)

        # Panel de lectura
        xn = ValueTracker(0.55)
        xp = 2.25

        def fila(tex, valor, color):
            return VGroup(Dot(radius=0.09, color=color), MathTex(tex, font_size=38, color=TINTA),
                          texto("= " + num(valor, 3), TAM_TEXTO)).arrange(RIGHT, buff=0.18)

        # ── 2. El vapor que entra ───────────────────────────────────────
        self.next_section("entra")
        titulo2 = rotulo("Plato n: entra el vapor de abajo", tam=36).move_to(titulo, aligned_edge=LEFT)
        guia = always_redraw(lambda: DashedLine(ax.c2p(xn.get_value(), Y0), ax.c2p(xn.get_value(), op1(xn.get_value())),
                                                color=TINTA_3, stroke_width=2.5, dash_length=0.1))
        et_x = always_redraw(lambda: MathTex("x_n", font_size=36, color=TINTA_2)
                             .next_to(ax.c2p(xn.get_value(), Y0), UP, 0.12).shift(RIGHT * 0.3))
        p_ent = always_redraw(lambda: Dot(ax.c2p(xn.get_value(), op1(xn.get_value())), radius=0.1, color=ACERO))
        et_ent = always_redraw(lambda: MathTex("y_{n+1}", font_size=36, color=ACERO_OSC)
                               .next_to(ax.c2p(xn.get_value(), op1(xn.get_value())), DR, 0.08))
        f1 = always_redraw(lambda: fila("y_{n+1}", op1(xn.get_value()), ACERO).move_to([xp, 0.9, 0], aligned_edge=LEFT))
        self.play(FadeTransform(titulo, titulo2), Create(guia), FadeIn(et_x), GrowFromCenter(p_ent),
                  FadeIn(et_ent), FadeIn(f1), run_time=1.4)
        titulo = titulo2
        self.wait(0.6)

        # ── 3. El plato ideal ───────────────────────────────────────────
        self.next_section("ideal")
        titulo2 = rotulo("Un plato ideal llega al equilibrio", tam=36).move_to(titulo, aligned_edge=LEFT)
        ideal = always_redraw(lambda: Line(ax.c2p(xn.get_value(), op1(xn.get_value())),
                                           ax.c2p(xn.get_value(), eq1(xn.get_value())), color=REJILLA, stroke_width=14))
        p_eq = always_redraw(lambda: Dot(ax.c2p(xn.get_value(), eq1(xn.get_value())), radius=0.1, color=TINTA))
        et_eqp = always_redraw(lambda: MathTex("y_n^*", font_size=36).next_to(ax.c2p(xn.get_value(), eq1(xn.get_value())), UL, 0.08))
        f2 = always_redraw(lambda: fila("y_n^*", eq1(xn.get_value()), TINTA).move_to([xp, 1.65, 0], aligned_edge=LEFT))
        self.add(ideal, p_ent)
        self.play(FadeTransform(titulo, titulo2), Create(ideal), run_time=1.0)
        self.play(GrowFromCenter(p_eq), FadeIn(et_eqp), FadeIn(f2), run_time=0.8)
        titulo = titulo2
        self.wait(0.6)

        # ── 4. El plato real ────────────────────────────────────────────
        self.next_section("real")
        titulo2 = rotulo("El real recorre solo una parte", tam=36).move_to(titulo, aligned_edge=LEFT)
        frac = ValueTracker(0.0)
        real = always_redraw(lambda: Line(ax.c2p(xn.get_value(), op1(xn.get_value())),
                                          ax.c2p(xn.get_value(), op1(xn.get_value()) + frac.get_value() *
                                                 (eq1(xn.get_value()) - op1(xn.get_value()))),
                                          color=AMBAR, stroke_width=14))
        y_real = lambda: op1(xn.get_value()) + frac.get_value() * (eq1(xn.get_value()) - op1(xn.get_value()))
        p_real = always_redraw(lambda: Dot(ax.c2p(xn.get_value(), y_real()), radius=0.1, color=AMBAR))
        et_real = always_redraw(lambda: MathTex("y_n", font_size=36, color=TINTA).next_to(ax.c2p(xn.get_value(), y_real()), RIGHT, 0.14))
        f3 = always_redraw(lambda: fila("y_n", y_real(), AMBAR).move_to([xp, 0.15, 0], aligned_edge=LEFT))
        self.add(real, p_ent, p_real)
        self.play(FadeTransform(titulo, titulo2), FadeIn(et_real), FadeIn(f3), run_time=0.6)
        self.play(frac.animate.set_value(EM), run_time=2.0, rate_func=smooth)
        titulo = titulo2
        em = MathTex(r"E_M", "=", r"\frac{y_n - y_{n+1}}{y_n^* - y_{n+1}}", font_size=40).move_to([xp, -1.15, 0], aligned_edge=LEFT)
        em_v = MathTex(r"=", "0{,}64", font_size=44, color=TINTA).next_to(em, DOWN, 0.25).align_to(em[1], LEFT)
        em_v[1].set_color(AMBAR)
        self.play(Write(em), run_time=1.2)
        self.play(FadeIn(em_v, shift=UP * 0.2), run_time=0.8)
        self.wait(0.6)

        # ── 5. Plato por plato: la curva efectiva ───────────────────────
        self.next_section("efectiva")
        titulo2 = rotulo("Plato por plato: la curva efectiva", tam=36).move_to(titulo, aligned_edge=LEFT)
        rastro = TracedPath(p_real.get_center, stroke_color=AMBAR, stroke_width=5)
        self.add(rastro)
        self.play(FadeTransform(titulo, titulo2), FadeOut(et_x), run_time=0.6)
        titulo = titulo2
        self.play(xn.animate.set_value(0.32), run_time=2.2, rate_func=smooth)
        self.play(xn.animate.set_value(0.83), run_time=4.0, rate_func=smooth)
        curva = DashedVMobject(ax.plot(ef1, x_range=(X0, X1), color=AMBAR, stroke_width=5), num_dashes=46)
        et_ef = texto("Curva efectiva", TAM_NOTA, AMBAR, peso=SEMIBOLD).move_to(ax.c2p(0.61, 0.47), aligned_edge=LEFT)
        guia_ef = Line(et_ef.get_top() + UP * 0.05 + RIGHT * 0.3, ax.c2p(0.70, ef1(0.70)), color=AMBAR, stroke_width=2)
        self.play(FadeOut(rastro), Create(curva), FadeIn(et_ef), Create(guia_ef), run_time=1.4)
        self.play(xn.animate.set_value(0.55), run_time=1.6, rate_func=smooth)
        self.wait(2.5)


# ══════════════════════════════════════════════════════════════════════════
# 2. La curva efectiva en la columna del Taller 9
# ══════════════════════════════════════════════════════════════════════════
class CurvaEfectiva(Scene):
    def construct(self):
        ax = ejes((0, 1, 0.2), (0, 1, 0.2), x_largo=5.9, y_largo=5.9,
                  x_titulo="Etanol en el líquido, x", y_titulo="Etanol en el vapor, y", dec=1)
        ax.shift([-2.45, -2.85, 0] - ax.c2p(0, 0))
        titulo = rotulo("La columna del Taller 9", tam=36).to_edge(UP, buff=0.22).to_edge(LEFT, buff=0.35)
        E = ValueTracker(1.0)

        def escalera(Ev, color, ancho=3.5):
            _, st = escalonar(Ev)
            pts = [ax.c2p(XD, XD)]
            for y, x, yn in st:
                pts += [ax.c2p(x, y), ax.c2p(x, yn)]
            return VMobject(color=color, stroke_width=ancho).set_points_as_corners(pts)

        def contador(Ev):
            N, _ = escalonar(Ev)
            if Ev >= 0.999:
                linea = texto(f"{num(N, 2)} etapas", TAM_TEXTO, peso=SEMIBOLD)
                sub = texto("teóricas, con el hervidor", TAM_NOTA, TINTA_2)
            else:
                linea = texto(f"{num(N, 1)} etapas", TAM_TEXTO, ACERO_OSC, peso=SEMIBOLD)
                sub = VGroup(MathTex("E_M", font_size=34, color=TINTA_2),
                             texto("= " + num(Ev, 2), TAM_NOTA, TINTA_2)).arrange(RIGHT, buff=0.12)
            return VGroup(linea, sub).arrange(DOWN, aligned_edge=LEFT, buff=0.12) \
                .move_to(ax.c2p(0.42, 0.15), aligned_edge=LEFT).add_background_rectangle(color=FONDO, opacity=1, buff=0.05)

        # ── 1. Curvas y escalonado ideal ────────────────────────────────
        self.next_section("ideal")
        diag = Line(ax.c2p(0, 0), ax.c2p(1, 1), color=REJILLA, stroke_width=3)
        equil = VMobject(color=TINTA, stroke_width=5).set_points_smoothly(
            [ax.c2p(x, eq_y(x)) for x in np.linspace(0, 1, 160)])
        rect = Line(ax.c2p(XI, YI), ax.c2p(XD, XD), color=ACERO, stroke_width=5)
        agot = Line(ax.c2p(XB, XB), ax.c2p(XI, YI), color=ACERO, stroke_width=5)
        marcas = VGroup()
        for v, t in ((ZF, "z_F"), (XD, "x_D")):
            marcas.add(DashedLine(ax.c2p(v, 0), ax.c2p(v, v), color=TINTA_3, stroke_width=2, dash_length=0.08))
            marcas.add(MathTex(t, font_size=32, color=TINTA_2).next_to(ax.c2p(v, 0), UP, 0.1).shift(RIGHT * 0.2))

        def entrada(color, txt, discontinua=False):
            l = Line(ORIGIN, RIGHT * 0.5, color=color, stroke_width=5)
            return VGroup(l, texto(txt, TAM_NOTA, TINTA_2)).arrange(RIGHT, buff=0.15)
        leyenda = VGroup(entrada(TINTA, "Equilibrio"), entrada(ACERO, "Operación")) \
            .arrange(DOWN, aligned_edge=LEFT, buff=0.12).move_to(ax.c2p(0.03, 0.97), aligned_edge=UL)
        self.play(Create(ax), FadeIn(titulo), Create(diag), run_time=1.3)
        self.play(Create(equil), Create(rect), Create(agot), FadeIn(marcas), FadeIn(leyenda), run_time=1.6)
        ideal = escalera(1.0, TINTA, 3)
        cont = contador(1.0)
        self.play(Create(ideal), run_time=3.0, rate_func=linear)
        self.play(FadeIn(cont), run_time=0.6)
        self.wait(0.6)

        # ── 2. La curva efectiva ────────────────────────────────────────
        self.next_section("efectiva")
        titulo2 = rotulo("Los platos reales no llegan", tam=36).move_to(titulo, aligned_edge=LEFT)
        curva_ef = always_redraw(lambda: VMobject(color=AMBAR, stroke_width=5).set_points_smoothly(
            [ax.c2p(x, efectiva(x, E.get_value())) for x in np.linspace(XB, XD, 140)]))
        f = MathTex(r"y = y_{op} + E_M\,(y^* - y_{op})", font_size=34).move_to(ax.c2p(0.40, 0.31), aligned_edge=LEFT)
        f = VGroup(BackgroundRectangle(f, color=FONDO, fill_opacity=1, buff=0.05), f)
        self.play(FadeTransform(titulo, titulo2), ideal.animate.set_stroke(REJILLA, 2.5), run_time=0.8)
        titulo = titulo2
        self.add(curva_ef)
        self.play(E.animate.set_value(0.64), Write(f), run_time=2.4, rate_func=smooth)
        et_ef = entrada(AMBAR, "Curva efectiva").next_to(leyenda, DOWN, 0.12, aligned_edge=LEFT)
        self.play(FadeIn(et_ef), run_time=0.5)
        self.wait(0.6)

        # ── 3. Escalonar contra la efectiva ─────────────────────────────
        self.next_section("escalonar")
        titulo2 = rotulo("Se escalona contra la efectiva", tam=36).move_to(titulo, aligned_edge=LEFT)
        real = escalera(0.64, ACERO_OSC, 3.5)
        cont2 = contador(0.64)
        self.play(FadeTransform(titulo, titulo2), run_time=0.6)
        titulo = titulo2
        self.play(Create(real), run_time=3.6, rate_func=linear)
        self.play(FadeTransform(cont, cont2), run_time=0.7)
        cont = cont2
        self.wait(0.6)

        # ── 4. Si la eficiencia baja más ────────────────────────────────
        self.next_section("baja")
        titulo2 = rotulo("Menos eficiencia, más platos", tam=36).move_to(titulo, aligned_edge=LEFT)
        self.remove(real)
        real = always_redraw(lambda: escalera(E.get_value(), ACERO_OSC, 3.5))
        cont_v = always_redraw(lambda: contador(E.get_value()))
        self.remove(cont)
        self.add(real, cont_v)
        self.play(FadeTransform(titulo, titulo2), run_time=0.6)
        titulo = titulo2
        self.play(E.animate.set_value(0.40), run_time=4.0, rate_func=smooth)
        hombro = Ellipse(width=1.5, height=1.1, color=AMBAR, stroke_width=4).move_to(ax.c2p(0.70, 0.75))
        nota = texto("Se amontonan\nen el hombro", TAM_NOTA, TINTA_2, line_spacing=0.9).move_to(ax.c2p(0.99, 0.52), aligned_edge=RIGHT)
        nota = VGroup(BackgroundRectangle(nota, color=FONDO, fill_opacity=1, buff=0.06), nota)
        self.play(Create(hombro), FadeIn(nota), run_time=1.0)
        self.wait(2.5)


# ══════════════════════════════════════════════════════════════════════════
# 3. De etapas teóricas a platos reales
# ══════════════════════════════════════════════════════════════════════════
N_TEO = 9.96          # en la columna, sin el hervidor
ESP = 0.45            # m entre platos
U_PLATO = 0.19       # unidades de Manim por plato


class PlatosReales(Scene):
    def construct(self):
        base = -3.15
        titulo = rotulo("De etapas teóricas a platos", tam=36).to_corner(UL, buff=0.3)
        Eo = ValueTracker(1.0)
        n_vis = ValueTracker(0)

        # Columna de etapas teóricas: 9 completas y 0,96 de la décima
        xt, alto_t = -3.9, 0.47
        etapas = VGroup()
        for i in range(10):
            h = alto_t * (0.96 if i == 9 else 1)
            etapas.add(Rectangle(width=1.25, height=h * 0.86, stroke_color=TINTA, stroke_width=2.5,
                                 fill_color=ACERO_CLARO, fill_opacity=1)
                       .move_to([xt, base + alto_t * i + h / 2, 0]))
        et_teo = VGroup(texto("9,96 etapas", TAM_TEXTO, peso=SEMIBOLD), texto("teóricas", TAM_NOTA, TINTA_2)) \
            .arrange(DOWN, buff=0.08).next_to(etapas, UP, 0.25)
        herv = VGroup(Rectangle(width=1.25, height=0.42, stroke_color=TINTA_3, stroke_width=2.5).set_fill(opacity=0),
                      texto("+ 1 hervidor", TAM_NOTA, TINTA_3)).arrange(RIGHT, buff=0.2)
        herv[0].move_to([xt, base - 0.42, 0])
        herv[1].next_to(herv[0], RIGHT, 0.2)

        # Columna real: platos a 450 mm
        xr, ancho_r = -1.25, 1.15

        def columna():
            n = int(round(n_vis.get_value()))
            alto = max(n, 1) * U_PLATO + 0.12
            casco = Rectangle(width=ancho_r, height=alto, stroke_color=TINTA, stroke_width=3.5) \
                .move_to([xr, base + alto / 2, 0])
            g = VGroup(casco)
            for i in range(n):
                y = base + 0.06 + (i + 0.5) * U_PLATO
                izq = i % 2 == 0
                a, b = (xr - ancho_r / 2, xr + ancho_r / 2 - 0.22) if izq else (xr - ancho_r / 2 + 0.22, xr + ancho_r / 2)
                g.add(Line([a, y, 0], [b, y, 0], color=TINTA, stroke_width=3))
            if n:
                cota = Line([xr + ancho_r / 2 + 0.25, base, 0], [xr + ancho_r / 2 + 0.25, base + alto, 0],
                            color=TINTA_3, stroke_width=2)
                g.add(cota, texto(f"{n} platos", TAM_TEXTO, peso=SEMIBOLD).next_to(casco, UP, 0.2))
                g.add(texto(f"{num(n * ESP, 1)} m", TAM_NOTA, TINTA_2).next_to(cota, RIGHT, 0.12))
            return g

        col = always_redraw(columna)

        def lectura():
            e = Eo.get_value()
            n = ceil(N_TEO / e - 1e-9)
            f = MathTex(r"N_{real} = \left\lceil \frac{9{,}96}{" + num(e, 3).rstrip("0").rstrip(",") + r"} \right\rceil = " + str(n),
                        font_size=40)
            return f.move_to([2.75, 1.55, 0])

        # ── 1. Las etapas teóricas ──────────────────────────────────────
        self.next_section("teoricas")
        self.play(FadeIn(titulo), run_time=0.5)
        self.play(LaggedStart(*[GrowFromEdge(r, DOWN) for r in etapas], lag_ratio=0.15), run_time=2.0)
        self.play(FadeIn(et_teo), FadeIn(herv), run_time=0.8)
        nota = texto("El hervidor es un intercambiador,\nno un plato: se descuenta", TAM_NOTA, TINTA_2,
                     line_spacing=0.9).move_to([2.75, -2.55, 0])
        self.play(FadeIn(nota), Indicate(herv[0], color=AMBAR), run_time=1.2)
        self.wait(0.6)

        # ── 2. Con el 55 % supuesto ─────────────────────────────────────
        def paso(nombre, e, titulo_txt, color_e, extra=None):
            nonlocal titulo
            self.next_section(nombre)
            t2 = rotulo(titulo_txt, tam=36).move_to(titulo, aligned_edge=LEFT)
            n = ceil(N_TEO / e - 1e-9)
            self.play(FadeTransform(titulo, t2), Eo.animate.set_value(e), run_time=0.8)
            titulo = t2
            self.play(n_vis.animate.set_value(n), run_time=0.12 * abs(n - n_vis.get_value()) + 0.6, rate_func=linear)
            if extra:
                self.play(*extra, run_time=0.8)
            self.wait(0.6)

        self.add(col)
        Eo.set_value(0.55)
        lect = always_redraw(lectura)
        e_txt = always_redraw(lambda: VGroup(MathTex("E_o", font_size=40),
                                             texto("= " + num(100 * Eo.get_value(), 1).replace(",0", "") + " %", TAM_TEXTO,
                                                   AMBAR if Eo.get_value() < 0.4 else TINTA, peso=SEMIBOLD))
                              .arrange(RIGHT, buff=0.15).move_to([2.75, 0.35, 0]))
        self.next_section("supuesto")
        t2 = rotulo("Con el 55 % supuesto", tam=36).move_to(titulo, aligned_edge=LEFT)
        self.play(FadeTransform(titulo, t2), FadeIn(lect), FadeIn(e_txt), run_time=0.8)
        titulo = t2
        self.play(n_vis.animate.set_value(19), run_time=2.6, rate_func=linear)
        self.wait(0.6)

        paso("oconnell", 0.467, "Con O'Connell: 46,7 %", TINTA)
        paso("diez", 0.37, "Diez puntos menos: 37 %", AMBAR)
        self.wait(2.0)
