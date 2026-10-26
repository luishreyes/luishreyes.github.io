"""La característica instalada de una válvula de control: cómo se dobla la
característica inherente cuando la línea se lleva parte de la caída.

Para el capítulo 12 del libro de operaciones unitarias (válvulas, tuberías y
medición de flujo). Primero, la característica lineal y la de igual porcentaje
(R = 30, Perry 8.ª, ec. 8-122) con la caída constante en la válvula. Después,
la misma válvula en una línea cuya caída total no cambia, con la válvula
llevándose, toda abierta, una fracción a de esa caída: el caudal relativo es
q = f / sqrt(a + (1 - a) f²), la ecuación con que el libro reproduce la
fig. 8-79 del Perry. Al bajar a, la de igual porcentaje se endereza y la lineal
se dobla hacia la de apertura rápida. Al final, el caso del capítulo: la línea
de agua de los capítulos 9 y 10 con la bomba de 190 mm y dos válvulas de globo
de jaula de 2 in (Emerson, p. 121; Darby, tabla 11.3), con los caudales que salen de
herramientas/control-linea-agua.py del libro.

    uv run publicar.py escenas/libro/caracteristica_instalada.py CaracteristicaInstalada \
        --tema uniandes --fondo nieve --destino {libro}/figuras/valvulas-tuberias-y-medicion-de-flujo
"""
from estilo import *

R = 30.0


def f_igual(x):
    """Igual porcentaje, con el tramo recto del primer 5 % para que cierre."""
    return R ** (x - 1) if x >= 0.05 else x / 0.05 * R ** (0.05 - 1)


def instalada(f, a):
    return f / np.sqrt(a + (1 - a) * f * f) if f > 0 else 0.0


# El caso: caudal (m³/h) contra carrera, cada 5 %, con la bomba y la línea (control-linea-agua.py)
CASO_IGUAL = [0.0, 2.025, 2.399, 2.841, 3.364, 3.98, 4.704, 5.554, 6.545, 7.696, 9.018, 10.52, 12.2, 14.04, 16.002, 18.023, 20.021, 21.901, 23.577, 24.988, 26.117]
CASO_LINEAL = [0.0, 3.123, 6.166, 9.045, 11.697, 14.083, 16.192, 18.026, 19.601, 20.943, 22.077, 23.033, 23.837, 24.514, 25.084, 25.567, 25.978, 26.328, 26.63, 26.892, 27.119]
DEMANDA = [(8.0, 0.462, 0.131), (18.0, 0.749, 0.349), (25.0, 0.95, 0.692)]   # Q, carrera igual %, carrera lineal


class CaracteristicaInstalada(Scene):
    def construct(self):
        a = ValueTracker(1.0)
        ax = ejes((0, 100, 20), (0, 100, 20), x_largo=7.4, y_largo=4.3,
                  x_titulo="carrera (%)", y_titulo="caudal (% del máximo)")
        ax.shift([-4.6, -2.1, 0] - ax.c2p(0, 0))      # libre la franja de abajo, donde van los controles

        def curva(fn, color, ancho=6):
            return ax.plot(lambda x: 100 * instalada(fn(x / 100), a.get_value()), x_range=(0, 100, 0.5),
                           color=color, stroke_width=ancho, use_smoothing=False)

        g_lin = always_redraw(lambda: curva(lambda x: x, OLIVA))
        g_ig = always_redraw(lambda: curva(f_igual, NAVY))
        r_lin = always_redraw(lambda: texto("lineal", TAM_NOTA, OLIVA)
                              .next_to(ax.c2p(40, 100 * instalada(0.4, a.get_value())), UL, 0.12))
        r_ig = always_redraw(lambda: texto("igual porcentaje", TAM_NOTA, NAVY)
                             .next_to(ax.c2p(72, 100 * instalada(f_igual(0.72), a.get_value())), DR, 0.12))

        titulo = rotulo("La característica inherente").to_corner(UL, buff=0.35)

        def leyenda(*lineas):
            return VGroup(*[texto(s, TAM_NOTA, TINTA_2) for s in lineas]).arrange(DOWN, buff=0.08, aligned_edge=LEFT) \
                .next_to(titulo, DOWN, 0.15, aligned_edge=LEFT)

        # 0 · la característica inherente
        self.next_section("inherente")
        nota = leyenda("Con la caída constante en la válvula, el caudal sigue al Cv.",
                       "La lineal sube parejo; la de igual porcentaje, cada vez más rápido.")
        self.add(ax, titulo, nota)
        self.play(Create(g_lin), Create(g_ig), run_time=1.6)
        self.play(FadeIn(r_lin), FadeIn(r_ig), run_time=0.5)
        self.wait(1.2)
        self.wait(0.6)

        # 1 · la línea se lleva parte de la caída
        self.next_section("instalada")
        t1 = rotulo("La característica instalada").to_corner(UL, buff=0.35)
        n1 = leyenda("Ahora la caída total no cambia y la línea se lleva una parte:",
                     "al abrir, sube el caudal, la línea pierde más y a la válvula le queda menos.")
        lectura = always_redraw(lambda: VGroup(
            texto("la válvula, abierta, se lleva", TAM_NOTA, TINTA_2),
            texto(f"{num(100 * a.get_value(), 0)} % de la caída", TAM_TEXTO, TINTA, peso=SEMIBOLD))
            .arrange(DOWN, buff=0.08, aligned_edge=LEFT).move_to(ax.c2p(60, 14), aligned_edge=LEFT))
        self.play(ReplacementTransform(titulo, t1), ReplacementTransform(nota, n1), FadeIn(lectura), run_time=0.6)
        self.play(a.animate.set_value(0.25), run_time=3.0, rate_func=smooth)
        self.wait(0.8)
        self.play(a.animate.set_value(0.10), run_time=2.0, rate_func=smooth)
        n1b = leyenda("Con 10 % la de igual porcentaje sale casi recta: la misma carrera da el",
                      "mismo cambio de caudal en todo el intervalo. La lineal se dobló hacia arriba.")
        self.play(ReplacementTransform(n1, n1b), run_time=0.6)
        self.wait(1.4)
        self.wait(0.6)

        # 2 · el caso del capítulo
        self.next_section("caso")
        t2 = rotulo("La línea del caso, con la bomba de 190 mm").to_corner(UL, buff=0.35)
        n2 = leyenda("Dos globos de jaula de 2 in. La de igual porcentaje reparte los tres caudales",
                     "de la planta en la carrera; la lineal los amontona abajo y casi cierra a 8 m³/h.")
        ax2 = ejes((0, 100, 20), (0, 30, 5), x_largo=7.4, y_largo=4.3,
                   x_titulo="carrera (%)", y_titulo="caudal (m³/h)")
        ax2.shift([-4.6, -2.1, 0] - ax2.c2p(0, 0))
        xs = [5 * i for i in range(21)]
        c_ig = VMobject(stroke_color=NAVY, stroke_width=6).set_points_smoothly([ax2.c2p(x, q) for x, q in zip(xs, CASO_IGUAL)])
        c_lin = VMobject(stroke_color=OLIVA, stroke_width=6).set_points_smoothly([ax2.c2p(x, q) for x, q in zip(xs, CASO_LINEAL)])
        g_lin.clear_updaters(); g_ig.clear_updaters(); r_lin.clear_updaters(); r_ig.clear_updaters(); lectura.clear_updaters()
        self.play(ReplacementTransform(t1, t2), ReplacementTransform(n1b, n2), FadeOut(lectura),
                  ReplacementTransform(ax, ax2), ReplacementTransform(g_ig, c_ig), ReplacementTransform(g_lin, c_lin),
                  FadeOut(r_lin), FadeOut(r_ig), run_time=1.4)
        guias, puntos, rot = VGroup(), VGroup(), VGroup()
        for q, xi, xl in DEMANDA:
            guias.add(DashedLine(ax2.c2p(0, q), ax2.c2p(100, q), color=REJILLA, stroke_width=3, dash_length=0.12))
            rot.add(texto(f"{num(q, 0)} m³/h", TAM_NOTA * 0.85, TINTA_2).next_to(ax2.c2p(100, q), RIGHT, 0.12))
            for x, col in ((xi, NAVY), (xl, OLIVA)):
                puntos.add(Dot(ax2.c2p(100 * x, q), radius=0.1, color=AMARILLO, stroke_color=TINTA, stroke_width=2,
                               fill_opacity=1))
        self.play(FadeIn(guias), FadeIn(rot), run_time=0.6)
        self.play(LaggedStart(*[GrowFromCenter(p) for p in puntos], lag_ratio=0.15), run_time=1.4)
        r_c = VGroup(texto("igual porcentaje: 46, 75 y 95 %", TAM_NOTA * 0.9, NAVY),
                     texto("lineal: 13, 35 y 69 %", TAM_NOTA * 0.9, OLIVA)).arrange(DOWN, buff=0.1, aligned_edge=LEFT) \
            .move_to(ax2.c2p(44, 6.0), aligned_edge=UL)
        self.play(FadeIn(r_c), run_time=0.6)
        self.wait(1.6)
        self.wait(0.6)
