"""La torta que crece: una suspensión de CaCO₃ se filtra a presión constante sobre una tela. A la izquierda, la hoja
en corte: el lodo arriba, la torta que se forma sobre la tela y el filtrado que gotea a la probeta; al lado, la presión
del líquido, que cae en línea recta a través de la torta y otra vez a través de la tela, y el esfuerzo de los sólidos,
que crece hacia la tela (Chhabra y Basavaraj, 2019, fig. 10.3, con P1 − Pz). A la derecha, t/V contra V se dibuja
punto a punto mientras corre el ensayo, y al final la recta de mínimos cuadrados: la ordenada es la tela y la
pendiente es la torta.

Para el capítulo 17 del libro de operaciones unitarias (Filtración). Los datos son los de Ruth, ensayo V de la tabla
29.1 de McCabe (ej. 29.1, pp. 1073–1076): 49,1 lbf/in² (338,5 kPa), 440 cm², 23,5 kg de sólido por m³ de filtrado,
agua a 25 °C con μ = 0,886 mPa·s, y t = 4,4 a 107,3 s para V = 0,5 a 5,0 L. La recta t/V = (K_p/2)·V + B
(Geankoplis, ecs. 24.2-13 a 24.2-18) se ajusta en SI sin el primer punto, como aconseja Geankoplis y como hace el
capítulo: los nueve puntos de 1,0 a 5,0 L dan t/V = 3,00 V + 6,39 (s/L, con V en L), y α = 2ΔP·A²·pendiente/(μc) y
R_m = ΔP·A·ordenada/μ dan 1,89 × 10¹¹ m/kg y 1,07 × 10¹¹ m⁻¹. El punto de 0,5 L se dibuja hueco: se midió, pero no
entra en la recta. Con los diez puntos saldrían 1,83 × 10¹¹ y 1,14 × 10¹¹ (los del mapa de fuentes del libro); el
ej. 24.2-1 de Geankoplis, con el mismo ensayo y sus redondeos, da 1,863 × 10¹¹ y 10,63 × 10¹⁰.

Lo que cae en la torta y lo que cae en la tela sale de la misma recta: dt/dV = K_p·V + B, así que la torta se lleva
K_p·V/(K_p·V + B) de ΔP (0 al comienzo, 32 % con 0,5 L, 82 % con 5 L). La presión del líquido cae en línea recta a
través de la torta porque la torta se toma incompresible (α uniforme), y el esfuerzo de los sólidos es la caída del
líquido desde la cara libre. El volumen de filtrado entre las lecturas se interpola en línea recta en la tabla.

El espesor de la torta en pantalla es esquemático: crece en proporción a V, pero no a escala (la torta de 5 L mide
unos milímetros). La tela, el lodo y las gotas también son esquemas.

    uv run publicar.py escenas/libro/torta_ruth.py TortaRuth \
        --tema uniandes --fondo nieve --destino {libro}/figuras/filtracion
"""
import math

from estilo import *

LODO, LODO_P = "#E6D9BC", "#A89464"                  # la suspensión y sus partículas
TORTA, TORTA_P = "#CDBB92", "#7E6942"                # la torta y sus partículas
FILTRADO, GOTA = "#E4EEF7", "#8FB0CF"                # el filtrado y las gotas

# ── el ensayo V de Ruth (McCabe, tabla 29.1) ────────────────────────────
PSI = 6894.757
DP = 49.1 * PSI                                      # Pa: 338,5 kPa
AREA = 440e-4                                        # m²
C = 23.5                                             # kg de sólido por m³ de filtrado
MU = 0.886e-3                                        # Pa·s
V_L = [0.5 * (i + 1) for i in range(10)]             # L
T_S = [4.4, 9.5, 16.3, 24.6, 34.7, 46.1, 59.0, 73.6, 89.4, 107.3]   # s

# mínimos cuadrados de t/V contra V, en SI, sin el primer punto (Geankoplis): los nueve de 1,0 a 5,0 L
_v = np.array(V_L[1:]) * 1e-3
_y = np.array(T_S[1:]) / _v
PEND, ORD = np.polyfit(_v, _y, 1)                    # s/m⁶ y s/m³: 3,00 × 10⁶ y 6387
ALFA = 2 * DP * AREA ** 2 * PEND / (MU * C)          # m/kg: 1,89 × 10¹¹
RM = DP * AREA * ORD / MU                            # m⁻¹: 1,07 × 10¹¹
KP, B = 2 * PEND, ORD                                # dt/dV = K_p·V + B
PEND_L, ORD_L = PEND * 1e-6, ORD * 1e-3              # en s/L² y s/L, los de la gráfica


def v_de(t):
    """Litros filtrados a los t segundos: la tabla, interpolada en línea recta desde (0, 0)."""
    return float(np.interp(t, [0.0] + T_S, [0.0] + V_L))


def parte_torta(v_l):
    """Fracción de ΔP que cae en la torta con v_l litros: K_p·V/(K_p·V + B)."""
    kv = KP * v_l * 1e-3
    return kv / (kv + B)


def cientifico(x, dec=2):
    e = math.floor(math.log10(x))
    return num(x / 10 ** e, dec), e


class TortaRuth(Scene):
    def construct(self):
        tt = ValueTracker(0.0)                        # el tiempo del ensayo, s
        op = ValueTracker(0.0)                        # aparece la torta: su rótulo y el esfuerzo de los sólidos
        V = lambda: v_de(tt.get_value())

        # ── la hoja en corte, a la izquierda ────────────────────────────
        XL, XR = -6.0, -4.3
        XC = (XL + XR) / 2
        DY = 0.25                                      # todo sube: la franja de abajo queda para los controles
        Y_TOPE, Y_TELA, E_TELA = 1.45 + DY, -0.75 + DY, 0.22   # la tela va de Y_TELA − E_TELA a Y_TELA
        H_MAX, V_MAX = 1.1, 5.0                        # alto de la torta en pantalla con 5 L (esquemático)
        h_torta = lambda: H_MAX * V() / V_MAX
        Y_SOP = Y_TELA - E_TELA                        # el soporte, debajo de la tela

        fondo_lodo = Rectangle(width=XR - XL, height=Y_TOPE - Y_TELA, stroke_width=0, fill_color=LODO, fill_opacity=1) \
            .move_to([XC, (Y_TOPE + Y_TELA) / 2, 0])

        rng = np.random.default_rng(7)
        N_L = 90
        lodo_x = rng.uniform(XL + 0.06, XR - 0.06, N_L)
        lodo_b = rng.uniform(0, 1, N_L)
        H_S = Y_TOPE - Y_TELA
        K_BAJA = 0.3                                   # cuánto bajan las partículas por litro filtrado (esquemático)

        def particulas_lodo():
            v, cara = V(), Y_TELA + h_torta()
            g = VGroup()
            for x, b in zip(lodo_x, lodo_b):
                y = Y_TELA + ((b * H_S - K_BAJA * v) % H_S)
                if cara + 0.04 < y < Y_TOPE - 0.04:
                    g.add(Dot([x, y, 0], radius=0.026, color=LODO_P))
            return g

        PASO = 0.085
        filas = int(H_MAX / (PASO * 0.87)) + 1
        celdas = []
        for j in range(filas):
            y = (j + 0.5) * PASO * 0.87
            dx = PASO / 2 if j % 2 else 0.0
            x = XL + 0.05 + dx
            while x < XR - 0.04:
                celdas.append((x + rng.uniform(-0.01, 0.01), y + rng.uniform(-0.01, 0.01)))
                x += PASO

        fondo_torta = always_redraw(lambda: Rectangle(width=XR - XL, height=max(0.001, h_torta()), stroke_width=0,
                                                      fill_color=TORTA, fill_opacity=1 if h_torta() > 0.002 else 0)
                                    .move_to([XC, Y_TELA + h_torta() / 2, 0]))
        granos = VGroup(*[Dot([x, Y_TELA + y, 0], radius=0.034, color=TORTA_P) for x, y in celdas])

        def asentar(g):
            h = h_torta()
            for d, (_, y) in zip(g, celdas):
                d.set_fill(opacity=1.0 if y < h - 0.02 else 0.0)

        granos.add_updater(asentar)

        tela = VGroup(Rectangle(width=XR - XL, height=E_TELA, stroke_width=0, fill_color=REJILLA, fill_opacity=1)
                      .move_to([XC, Y_TELA - E_TELA / 2, 0]))
        for k, y in enumerate((Y_TELA - E_TELA * 0.3, Y_TELA - E_TELA * 0.7)):
            x = XL + 0.06 + (0.05 if k else 0.0)
            while x < XR - 0.04:
                tela.add(Dot([x, y, 0], radius=0.045, color=TINTA_3))
                x += 0.1
        soporte = Rectangle(width=XR - XL, height=0.08, stroke_width=0, fill_color=TINTA_2, fill_opacity=1) \
            .move_to([XC, Y_SOP - 0.04, 0])
        Y_SAL = Y_SOP - 0.45
        paredes = VGroup(
            Line([XL, Y_TOPE + 0.08, 0], [XL, Y_SOP - 0.08, 0], color=TINTA, stroke_width=4),
            Line([XR, Y_TOPE + 0.08, 0], [XR, Y_SOP - 0.08, 0], color=TINTA, stroke_width=4),
            Line([XL, Y_TOPE + 0.08, 0], [XR, Y_TOPE + 0.08, 0], color=TINTA, stroke_width=4),
            Line([XL, Y_SOP - 0.08, 0], [XC - 0.08, Y_SAL + 0.12, 0], color=TINTA, stroke_width=4),
            Line([XR, Y_SOP - 0.08, 0], [XC + 0.08, Y_SAL + 0.12, 0], color=TINTA, stroke_width=4),
            Line([XC - 0.08, Y_SAL + 0.12, 0], [XC - 0.08, Y_SAL, 0], color=TINTA, stroke_width=4),
            Line([XC + 0.08, Y_SAL + 0.12, 0], [XC + 0.08, Y_SAL, 0], color=TINTA, stroke_width=4),
        )

        # la probeta que recibe el filtrado
        PB_ANCHO, PB_Y0, PB_ALTO, PB_VMAX = 0.9, -3.05 + DY, 1.15, 6.0
        nivel = lambda: PB_Y0 + PB_ALTO * V() / PB_VMAX
        probeta = VGroup(
            Line([XC - PB_ANCHO / 2, PB_Y0 + PB_ALTO, 0], [XC - PB_ANCHO / 2, PB_Y0, 0], color=TINTA, stroke_width=3),
            Line([XC - PB_ANCHO / 2, PB_Y0, 0], [XC + PB_ANCHO / 2, PB_Y0, 0], color=TINTA, stroke_width=3),
            Line([XC + PB_ANCHO / 2, PB_Y0, 0], [XC + PB_ANCHO / 2, PB_Y0 + PB_ALTO, 0], color=TINTA, stroke_width=3),
        )
        for litro in range(1, 6):
            y = PB_Y0 + PB_ALTO * litro / PB_VMAX
            probeta.add(Line([XC + PB_ANCHO / 2 - 0.14, y, 0], [XC + PB_ANCHO / 2, y, 0], color=TINTA_3, stroke_width=2))
        filtrado = always_redraw(lambda: Rectangle(width=PB_ANCHO - 0.04, height=max(0.001, nivel() - PB_Y0),
                                                   stroke_width=0, fill_color=FILTRADO, fill_opacity=1)
                                 .move_to([XC, (nivel() + PB_Y0) / 2, 0]))

        # las gotas: una cada 0,1 L, que caen en el tiempo de la pantalla
        estado = {"v": 0.0, "gotas": []}
        G_PANT = 14.0                                  # aceleración en pantalla, unidades/s²

        def mover_gotas(grupo, dt):
            v = V()
            while estado["v"] + 0.1 <= v + 1e-9:
                estado["v"] += 0.1
                estado["gotas"].append(0.0)
            estado["gotas"] = [tau + dt for tau in estado["gotas"]
                               if Y_SAL - 0.08 - 0.5 * G_PANT * (tau + dt) ** 2 > nivel() + 0.04]
            grupo.remove(*grupo.submobjects)
            grupo.add(*[Ellipse(width=0.07, height=0.11, stroke_width=0, fill_color=GOTA, fill_opacity=1)
                        .move_to([XC, Y_SAL - 0.08 - 0.5 * G_PANT * tau ** 2, 0]) for tau in estado["gotas"]])

        gotas = VGroup()
        gotas.add_updater(mover_gotas)

        r_lodo = texto("lodo", TAM_NOTA, TINTA_2).next_to([XL, 0.95 + DY, 0], LEFT, 0.12)
        r_tela = texto("tela", TAM_NOTA, TINTA_2).next_to([XL, Y_TELA - E_TELA / 2, 0], LEFT, 0.12)
        r_torta = always_redraw(lambda: texto("torta", TAM_NOTA, TINTA_2)
                                .next_to([XL, Y_TELA + max(h_torta(), 0.3) / 2 + 0.1, 0], LEFT, 0.12)
                                .set_opacity(op.get_value()))

        # ── el perfil de presión, al lado ───────────────────────────────
        PX0, PX1 = -3.95, -2.45
        Y_EJE = Y_SOP - 0.12
        px = lambda p: PX0 + (PX1 - PX0) * p / DP
        eje_y = Line([PX0, Y_EJE, 0], [PX0, Y_TOPE, 0], color=TINTA_2, stroke_width=3)
        eje_p = Line([PX0, Y_EJE, 0], [PX1 + 0.12, Y_EJE, 0], color=TINTA_2, stroke_width=3)
        marca = Line([PX1, Y_EJE, 0], [PX1, Y_EJE - 0.07, 0], color=TINTA_2, stroke_width=3)
        r_0 = texto("0", TAM_NOTA, TINTA_2).next_to([PX0, Y_EJE, 0], DOWN, 0.14)
        r_dp = texto(f"{num(DP / 1000, 1)} kPa", TAM_NOTA, TINTA_2).next_to([PX1, Y_EJE, 0], DOWN, 0.14)
        r_liq = texto("líquido", TAM_NOTA, NAVY).next_to([PX1, 1.12 + DY, 0], LEFT, 0.12)
        r_sol = always_redraw(lambda: texto("sólidos", TAM_NOTA, OLIVA).next_to([PX0, 0.72 + DY, 0], RIGHT, 0.12)
                              .set_opacity(op.get_value()))

        def perfil_liquido():
            cara = Y_TELA + h_torta()
            pm = DP * (1 - parte_torta(V()))           # presión del líquido en la cara de la tela
            pts = [[px(DP), Y_TOPE, 0], [px(DP), cara, 0], [px(pm), Y_TELA, 0], [px(0), Y_TELA - E_TELA, 0]]
            return VMobject(color=NAVY, stroke_width=5).set_points_as_corners(pts)

        def perfil_solidos():
            h = h_torta()
            if h < 0.01:
                return VGroup()
            ps = DP * parte_torta(V())                 # el esfuerzo en la cara de la tela: P1 − Pz
            return DashedLine([px(0), Y_TELA + h, 0], [px(ps), Y_TELA, 0], color=OLIVA, stroke_width=4,
                              dash_length=0.08).set_stroke(opacity=op.get_value())

        g_liq = always_redraw(perfil_liquido)
        g_sol = always_redraw(perfil_solidos)
        guias = always_redraw(lambda: VGroup(*[
            DashedLine([XR + 0.05, y, 0], [PX1 + 0.12, y, 0], color=REJILLA, stroke_width=2, dash_length=0.06)
            for y in (Y_TELA + h_torta(), Y_TELA, Y_TELA - E_TELA)]))

        def lecturas():
            v = V()
            filas_ = [texto(f"t = {num(tt.get_value(), 1)} s", TAM_NOTA, TINTA),
                      texto(f"V = {num(v, 2)} L", TAM_NOTA, TINTA),
                      texto(f"torta: {num(100 * parte_torta(v), 0)} % de ΔP", TAM_NOTA, TINTA_2)]
            return VGroup(*filas_).arrange(DOWN, buff=0.1, aligned_edge=LEFT).move_to([PX0, -1.85 + DY, 0], aligned_edge=UL)

        g_lect = always_redraw(lecturas)

        # ── la gráfica de Ruth, a la derecha ────────────────────────────
        ax = ejes((0, 6, 1), (0, 30, 5), x_largo=6.6, y_largo=3.8,
                  x_titulo="volumen de filtrado, V (L)", y_titulo="t/V (s/L)")
        ax.shift([-0.35, -2.2 + DY, 0] - ax.c2p(0, 0))

        def puntos():
            t = tt.get_value()
            g = VGroup()
            for v, ti in zip(V_L, T_S):
                if t >= ti - 1e-6:
                    if v == V_L[0]:                    # fuera del ajuste: hueco
                        g.add(Circle(radius=0.075, stroke_color=NAVY, stroke_width=4, fill_opacity=0)
                              .move_to(ax.c2p(v, ti / v)))
                    else:
                        g.add(Dot(ax.c2p(v, ti / v), radius=0.085, color=NAVY))
            return g

        g_puntos = always_redraw(puntos)

        titulo = rotulo("La torta que crece").to_corner(UL, buff=0.35)

        def leyenda(*lineas):
            return VGroup(*[texto(s, TAM_NOTA, TINTA_2) for s in lineas]).arrange(DOWN, buff=0.08, aligned_edge=LEFT) \
                .next_to(titulo, DOWN, 0.15, aligned_edge=LEFT)

        def bloque(nombre, tex1, tex2):
            """[0] el nombre, [1] su fórmula al lado y [2] el resultado debajo de la fórmula."""
            r = texto(nombre, TAM_TEXTO, OLIVA, peso=SEMIBOLD)
            f1 = formula(tex1, TAM_TEXTO, OLIVA).next_to(r, RIGHT, 0.25)
            f2 = formula(tex2, TAM_TEXTO, TINTA).next_to(f1, DOWN, 0.18, aligned_edge=LEFT)
            return VGroup(r, f1, f2)

        # 1 · el montaje y los primeros segundos
        self.next_section("montaje")
        nota = leyenda(f"Carbonato de calcio en agua sobre {num(AREA * 1e4, 0)} cm² de tela, a {num(DP / 1000, 1)} kPa "
                       "(el ensayo de Ruth).",
                       f"Sin torta, toda la caída está en la tela; a los {num(T_S[0], 1)} s ya pasó medio litro.")
        self.add(fondo_lodo, always_redraw(particulas_lodo), fondo_torta, granos, tela, soporte, paredes,
                 probeta, filtrado, gotas, r_lodo, r_tela, r_torta, r_sol, g_sol, eje_y, eje_p, marca, r_0, r_dp, guias, g_liq, r_liq,
                 g_lect, ax, g_puntos, titulo, nota)
        self.wait(0.4)
        self.play(tt.animate.set_value(T_S[0]), run_time=3.0, rate_func=linear)
        self.wait(0.6)

        # 2 · la torta crece y salen los puntos
        self.next_section("torta")
        t1 = rotulo("Cada medio litro, un punto").move_to(titulo, aligned_edge=LEFT)
        n1 = leyenda(f"Cada litro deja {num(C, 1)} g de sólido; la torta crece y se lleva cada vez más de la caída.",
                     f"Con 5 L tiene el {num(100 * parte_torta(5.0), 0)} %. El filtrado sale cada vez más despacio "
                     "y t/V contra V da una recta.")
        self.play(ReplacementTransform(titulo, t1), ReplacementTransform(nota, n1), op.animate.set_value(1.0),
                  run_time=0.6)
        self.play(tt.animate.set_value(T_S[-1]), run_time=10.0, rate_func=linear)
        self.wait(0.8)

        # 3 · la recta, la ordenada y la pendiente
        self.next_section("recta")
        t2 = rotulo("La recta de Ruth: la tela y la torta").move_to(t1, aligned_edge=LEFT)
        n2 = leyenda(f"Mínimos cuadrados sin el primer punto: t/V = {num(PEND_L, 2)} V + {num(ORD_L, 2)}, en s/L con V en L.",
                     "La ordenada es la resistencia de la tela; la pendiente, la que suma la torta por litro.")
        recta = Line(ax.c2p(0, ORD_L), ax.c2p(5.75, ORD_L + PEND_L * 5.75), color=OLIVA, stroke_width=4)
        self.play(ReplacementTransform(t1, t2), ReplacementTransform(n1, n2), run_time=0.6)
        self.play(Create(recta), run_time=1.4)
        self.bring_to_front(g_puntos)

        # la ordenada: la tela
        p_ord = Dot(ax.c2p(0, ORD_L), radius=0.1, color=AMARILLO, stroke_color=TINTA, stroke_width=2, fill_opacity=1)
        m_rm, e_rm = cientifico(RM)
        b_tela = bloque("la tela:", r"\mu R_m/(A\,\Delta P) = " + num(ORD_L, 2) + r"\ \mathrm{s/L}",
                        r"R_m = " + m_rm + r"\times 10^{" + str(e_rm) + r"}\ \mathrm{m^{-1}}")
        b_tela.shift(ax.c2p(1.6, ORD_L) - b_tela[0].get_left())
        f_ord = Arrow(b_tela[0].get_left() + LEFT * 0.1, ax.c2p(0, ORD_L), buff=0.14, color=OLIVA,
                      stroke_width=4, max_tip_length_to_length_ratio=0.12)
        self.play(FadeIn(p_ord), GrowArrow(f_ord), FadeIn(b_tela), run_time=0.8)
        self.wait(0.6)

        # la pendiente: la torta
        va, vb = 3.5, 5.0
        ya, yb = ORD_L + PEND_L * va, ORD_L + PEND_L * vb
        triang = VGroup(Line(ax.c2p(va, ya), ax.c2p(vb, ya), color=OLIVA, stroke_width=3),
                        Line(ax.c2p(vb, ya), ax.c2p(vb, yb), color=OLIVA, stroke_width=3))
        r_dv = texto(f"{num(vb - va, 1)} L", TAM_NOTA, OLIVA).next_to(triang[0], DOWN, 0.1)
        r_dy = texto(f"{num(yb - ya, 2)} s/L", TAM_NOTA, OLIVA).next_to(triang[1], RIGHT, 0.12)
        m_al, e_al = cientifico(ALFA)
        b_torta = bloque("la torta:", r"\mu\alpha c/(2A^2\Delta P) = " + num(PEND_L, 2) + r"\ \mathrm{s/L^2}",
                         r"\alpha = " + m_al + r"\times 10^{" + str(e_al) + r"}\ \mathrm{m/kg}")
        b_torta.shift(ax.c2p(0.3, 28.5) - b_torta[0].get_corner(UL))
        self.play(Create(triang), FadeIn(r_dv), FadeIn(r_dy), FadeIn(b_torta), run_time=0.8)
        self.wait(1.6)
        self.wait(0.6)
