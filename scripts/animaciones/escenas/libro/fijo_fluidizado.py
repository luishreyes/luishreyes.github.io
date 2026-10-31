"""Del lecho fijo al fluidizado: el agua sube cada vez más rápido por un lecho de arena; la caída de presión crece casi
en proporción a la velocidad hasta igualar el peso sumergido del lecho, el lecho se levanta y la curva se queda en una
meseta mientras el lecho se expande.

Para el capítulo 16 del libro de operaciones unitarias (Partículas en un fluido). El lecho es la capa de arena del
filtro del caso tomada como uniforme, del tamaño efectivo: 0,30 m de arena de 0,5 mm y 2650 kg/m³ con porosidad de
0,42, en agua a 25 °C (997,05 kg/m³ y 0,890 mPa·s, IAPWS). La pérdida del lecho fijo es la de Ergun con las constantes
de la arena y d = ES (MWH, ec. 11-13 y tabla 11-3: 112 y 2,25); la del lecho fluidizado, su peso sumergido (MWH,
ec. 11-17); la porosidad del lecho expandido sale de Ergun igualado al peso (MWH, ecs. 11-22 a 11-24) y la altura, de
la masa constante (ec. 11-15). Son las mismas cuentas de herramientas/filtro-arena.py del libro.

    uv run publicar.py escenas/libro/fijo_fluidizado.py FijoFluidizado \
        --tema uniandes --fondo nieve --destino {libro}/figuras/particulas-en-un-fluido
"""
from estilo import *
from paleta_libro import *   # los colores salen de la paleta del libro (libro/estilo/paleta.json)

G = 9.80665
RHO, MU = 997.05, 0.890e-3
RHO_P, D, EPS0, L0, KV, KI = 2650.0, 0.5e-3, 0.42, 0.30, 112.0, 2.25
ARENA, ARENA_P = mat("solido"), mat("solido", "oscuro")    # la arena y sus granos
AGUA = mat("agua")


def hl_fijo(u):
    """Pérdida del lecho fijo, m de agua (MWH ec. 11-13), con u en m/s."""
    e = EPS0
    return (KV * (1 - e) ** 2 / e ** 3 * MU * L0 * u / (RHO * G * D * D)
            + KI * (1 - e) / e ** 3 * L0 * u * u / (G * D))


PESO = (RHO_P - RHO) * (1 - EPS0) * L0 / RHO          # MWH ec. 11-17: 0,288 m


def umf():
    lo, hi = 1e-6, 0.1
    for _ in range(80):
        m = 0.5 * (lo + hi)
        lo, hi = (m, hi) if hl_fijo(m) < PESO else (lo, m)
    return 0.5 * (lo + hi)


U_MF = umf()


def eps(u):
    """La porosidad del lecho expandido (MWH ecs. 11-22 a 11-24)."""
    if u <= U_MF:
        return EPS0
    X = MU * u / (2 * G * (RHO_P - RHO) * D * D) * (KV + KI * RHO * u * D / MU)
    Y = KV * MU * u / (3 * G * (RHO_P - RHO) * D * D)
    r = np.sqrt(X * X + Y ** 3)
    return max(EPS0, np.cbrt(X + r) + np.cbrt(X - r))


def altura(u):
    return L0 * (1 - EPS0) / (1 - eps(u))


def caida(u):
    return min(hl_fijo(u), PESO)


class FijoFluidizado(Scene):
    def construct(self):
        mh = ValueTracker(0.0)                        # la velocidad del agua, m/h
        u = lambda: mh.get_value() / 3600

        # la columna y el lecho, a la izquierda
        X0, Y0, ANCHO, ESC = -6.2, -3.1, 2.4, 6.0      # ESC: unidades de pantalla por metro de lecho
        col = Rectangle(width=ANCHO, height=4.2, stroke_color=TINTA, stroke_width=4, fill_color=AGUA, fill_opacity=1)
        col.move_to([X0 + ANCHO / 2, Y0 + 2.1, 0])
        placa = Rectangle(width=ANCHO, height=0.08, stroke_width=0, fill_color=TINTA_2, fill_opacity=1).move_to([X0 + ANCHO / 2, Y0 - 0.04, 0])
        rng = np.random.default_rng(4)
        N = 260
        base = np.column_stack([rng.uniform(0.06, ANCHO - 0.06, N), rng.uniform(0.02, 0.98, N)])
        fase = rng.uniform(0, 2 * np.pi, N)

        def lecho():
            h = altura(u()) * ESC
            agita = 0.0 if u() <= U_MF else min(0.05, 0.4 * (u() - U_MF) / U_MF * 0.05)
            t = mh.get_value()
            g = VGroup(Rectangle(width=ANCHO - 0.04, height=h, stroke_width=0, fill_color=ARENA,
                                 fill_opacity=0.55 + 0.45 * (1 - EPS0) / (1 - eps(u())) * 0.8)
                       .move_to([X0 + ANCHO / 2, Y0 + h / 2, 0]))
            for (x, y), f in zip(base, fase):
                g.add(Dot([X0 + x + agita * np.sin(f + 3 * t), Y0 + y * h + agita * np.cos(f + 2 * t), 0],
                          radius=0.028, color=ARENA_P))
            return g

        g_lecho = always_redraw(lecho)
        flecha = Arrow([X0 + ANCHO / 2, Y0 - 0.9, 0], [X0 + ANCHO / 2, Y0 - 0.15, 0], buff=0, color=NAVY, stroke_width=6)
        r_agua = always_redraw(lambda: texto(f"agua: {num(mh.get_value(), 0)} m/h", TAM_NOTA, TINTA)
                               .next_to(flecha, RIGHT, 0.15))
        r_alto = always_redraw(lambda: texto(f"lecho: {num(altura(u()), 2)} m", TAM_NOTA, TINTA_2)
                               .move_to([X0 + ANCHO / 2, Y0 + 4.55, 0]))

        # la gráfica, a la derecha
        KPA = RHO * G / 1000                          # m de agua a kPa
        ax = ejes((0, 60, 10), (0, 4, 1), x_largo=6.6, y_largo=3.8,
                  x_titulo="velocidad del agua que sube (m/h)", y_titulo="caída de presión (kPa)")
        ax.shift([-1.4, -2.75, 0] - ax.c2p(0, 0))
        peso = DashedLine(ax.c2p(0, PESO * KPA), ax.c2p(60, PESO * KPA), color=TINTA_3, stroke_width=3, dash_length=0.1)
        r_peso = texto("el peso sumergido del lecho", TAM_NOTA, TINTA_2).next_to(ax.c2p(60, PESO * KPA), UP, 0.1).align_to(ax.c2p(60, 0), RIGHT)
        traza = always_redraw(lambda: ax.plot(lambda x: caida(x / 3600) * KPA, x_range=(0, max(0.01, mh.get_value()), 0.2),
                                              color=NAVY, stroke_width=6, use_smoothing=False))
        punto = always_redraw(lambda: Dot(ax.c2p(mh.get_value(), caida(u()) * KPA), radius=0.1, color=AMARILLO,
                                          stroke_color=TINTA, stroke_width=2, fill_opacity=1))

        titulo = rotulo("Del lecho fijo al fluidizado").to_corner(UL, buff=0.35)

        def leyenda(*lineas):
            return VGroup(*[texto(s, TAM_NOTA, TINTA_2) for s in lineas]).arrange(DOWN, buff=0.08, aligned_edge=LEFT) \
                .next_to(titulo, DOWN, 0.15, aligned_edge=LEFT)

        # 0 · el lecho quieto
        self.next_section("fijo")
        nota = leyenda("Una capa de arena de 0,5 mm en agua a 25 °C. Mientras el lecho está quieto,",
                       "la caída de presión crece casi en proporción a la velocidad: es Ergun.")
        self.add(col, placa, g_lecho, flecha, r_agua, r_alto, ax, peso, r_peso, traza, punto, titulo, nota)
        self.play(mh.animate.set_value(12), run_time=3.2, rate_func=linear)
        self.wait(0.8)

        # 1 · el lecho se levanta
        self.next_section("mínima")
        t1 = rotulo("La mínima fluidización").move_to(titulo, aligned_edge=LEFT)
        n1 = leyenda(f"A {num(U_MF * 3600, 0)} m/h la caída iguala el peso sumergido del lecho, {num(PESO * RHO * G / 1000, 1)} kPa ({num(PESO, 2)} m de agua).",
                     "Los granos dejan de apoyarse unos en otros y el lecho se levanta.")
        self.play(ReplacementTransform(titulo, t1), ReplacementTransform(nota, n1), run_time=0.6)
        self.play(mh.animate.set_value(U_MF * 3600), run_time=1.6, rate_func=linear)
        guia = DashedLine(ax.c2p(U_MF * 3600, 0), ax.c2p(U_MF * 3600, PESO * KPA), color=OLIVA, stroke_width=4, dash_length=0.1)
        r_mf = MathTex(r"U_{mf}", font_size=TAM_TEXTO + 4, color=OLIVA).next_to(ax.c2p(U_MF * 3600, 0), UP + RIGHT, 0.12)
        self.play(Create(guia), FadeIn(r_mf), run_time=0.6)
        self.wait(1.2)

        # 2 · fluidizado
        self.next_section("fluidizado")
        t2 = rotulo("El lecho fluidizado").move_to(t1, aligned_edge=LEFT)
        n2 = leyenda("Desde ahí la caída ya no sube: el lecho se expande lo justo para que el agua",
                     f"pase con la misma pérdida. A 46 m/h la capa mide {num(altura(46 / 3600), 2)} m, {num(100 * (altura(46 / 3600) / L0 - 1), 0)} % más.")
        self.play(ReplacementTransform(t1, t2), ReplacementTransform(n1, n2), run_time=0.6)
        self.play(mh.animate.set_value(46), run_time=3.6, rate_func=linear)
        self.wait(1.4)
        self.wait(0.6)
