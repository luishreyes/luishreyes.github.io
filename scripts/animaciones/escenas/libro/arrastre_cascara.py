"""Lo que cuesta hundir la cáscara: la potencia de la turbina contra su velocidad, la velocidad que pide la cáscara
que flota y por qué una turbina más grande y más lenta la arrastra con menos potencia.

Para el capítulo 14 del libro de operaciones unitarias (Agitación). El caso es el reactor de extracción de pectina del
Explorador de agitación: tanque de 2,5 m, turbina de cuatro palas inclinadas a 45° de 0,83 m con N_P = 1,27 (McCabe,
tabla 9.2) en agua a 85 °C (968,6 kg/m³) y cáscara de 950 kg/m³. La potencia es P = N_P ρ N³ D⁵; la velocidad para
arrastrar sólidos que flotan, la correlación de Joosten et al. según Paul et al. (ec. 10-14):
Fr = N²D/g = 0,036 (D/T)^-3,65 ((ρ − ρs)/ρ)^0,42. Los números son los de herramientas/agitacion.py del libro.

    uv run publicar.py escenas/libro/arrastre_cascara.py ArrastreCascara \
        --tema uniandes --fondo nieve --destino {libro}/figuras/agitacion
"""
from estilo import *

G = 9.81
RHO, RHO_S, NP, T = 968.6, 950.0, 1.27, 2.5


def potencia_kw(rpm, dt):
    d = dt * T
    return NP * RHO * (rpm / 60) ** 3 * d ** 5 / 1000


def joosten_rpm(dt):
    d = dt * T
    fr = 0.036 * dt ** -3.65 * ((RHO - RHO_S) / RHO) ** 0.42
    return 60 * np.sqrt(fr * G / d)


class ArrastreCascara(Scene):
    def construct(self):
        dt = ValueTracker(0.332)
        ax = ejes((0, 200, 25), (0, 8, 1), x_largo=7.4, y_largo=3.7,
                  x_titulo="velocidad del eje (r/min)", y_titulo="potencia al líquido (kW)")
        ax.shift([-4.6, -2.5, 0] - ax.c2p(0, 0))

        def curva():
            d = dt.get_value()
            tope = min(200, 60 * (8 * 1000 / (NP * RHO * (d * T) ** 5)) ** (1 / 3))
            return ax.plot(lambda n: potencia_kw(n, d), x_range=(0, tope, 1), color=NAVY, stroke_width=6, use_smoothing=False)

        g_p = always_redraw(curva)
        titulo = rotulo("La potencia de la turbina del caso").to_corner(UL, buff=0.35)

        def leyenda(*lineas):
            return VGroup(*[texto(s, TAM_NOTA, TINTA_2) for s in lineas]).arrange(DOWN, buff=0.08, aligned_edge=LEFT) \
                .next_to(titulo, DOWN, 0.15, aligned_edge=LEFT)

        # 0 · la curva de potencia y el punto del caso
        self.next_section("potencia")
        nota = leyenda("En turbulento la potencia va con el cubo de la velocidad y la quinta del diámetro.",
                       "La turbina de 0,83 m a 100 r/min le entrega al líquido 2,24 kW.")
        p_caso = Dot(ax.c2p(100, potencia_kw(100, 0.332)), radius=0.1, color=AMARILLO, stroke_color=TINTA, stroke_width=2, fill_opacity=1)
        r_caso = texto("el caso: 100 r/min, 2,24 kW", TAM_NOTA, TINTA).next_to(p_caso, RIGHT, 0.15)
        self.add(ax, titulo, nota)
        self.play(Create(g_p), run_time=1.6)
        self.play(GrowFromCenter(p_caso), FadeIn(r_caso), run_time=0.6)
        self.wait(1.2)
        self.wait(0.6)

        # 1 · la velocidad que pide la cáscara
        self.next_section("joosten")
        t1 = rotulo("La velocidad que pide la cáscara").to_corner(UL, buff=0.35)
        n1 = leyenda("La cáscara de 950 kg/m³ flota en el agua a 85 °C. Para arrastrarla desde",
                     "la superficie, la correlación de Joosten pide 128 r/min: 4,67 kW, el doble.")
        guia = always_redraw(lambda: DashedLine(ax.c2p(joosten_rpm(dt.get_value()), 0), ax.c2p(joosten_rpm(dt.get_value()), 8),
                                                color=OLIVA, stroke_width=4, dash_length=0.12))
        p_j = always_redraw(lambda: Dot(ax.c2p(joosten_rpm(dt.get_value()), potencia_kw(joosten_rpm(dt.get_value()), dt.get_value())),
                                        radius=0.11, color=AMARILLO, stroke_color=TINTA, stroke_width=2, fill_opacity=1))
        r_j = texto("Joosten", TAM_NOTA, OLIVA).next_to(ax.c2p(joosten_rpm(0.332), 7.7), LEFT, 0.12)
        self.play(ReplacementTransform(titulo, t1), ReplacementTransform(nota, n1), run_time=0.6)
        self.play(Create(guia), FadeIn(r_j), run_time=0.8)
        self.play(GrowFromCenter(p_j), run_time=0.5)
        self.wait(1.4)
        self.wait(0.6)

        # 2 · una turbina más grande y más lenta
        self.next_section("diametro")
        t2 = rotulo("Una turbina más grande y más lenta").to_corner(UL, buff=0.35)
        n2 = leyenda("Con D/T mayor, la curva se empina (D⁵), pero la velocidad que pide Joosten",
                     "baja mucho más: la cáscara se hunde con menos vueltas y menos potencia.")
        r_j.add_updater(lambda m: m.next_to(ax.c2p(joosten_rpm(dt.get_value()), 7.7), LEFT, 0.12))
        traza = TracedPath(p_j.get_center, stroke_color=AMARILLO, stroke_width=5, dissipating_time=None)
        lectura = always_redraw(lambda: VGroup(
            texto(f"D/T = {num(dt.get_value(), 2)}, D = {num(dt.get_value() * T, 2)} m", TAM_NOTA, TINTA_2),
            texto(f"{num(joosten_rpm(dt.get_value()), 0)} r/min, {num(potencia_kw(joosten_rpm(dt.get_value()), dt.get_value()), 2)} kW",
                  TAM_TEXTO, TINTA, peso=SEMIBOLD))
            .arrange(DOWN, buff=0.08, aligned_edge=LEFT).move_to(ax.c2p(132, 5.6), aligned_edge=LEFT))
        self.add(traza)
        r_hoy = texto("hoy", TAM_NOTA, TINTA_2).next_to(p_caso, DOWN, 0.12)
        self.play(ReplacementTransform(t1, t2), ReplacementTransform(n1, n2), ReplacementTransform(r_caso, r_hoy), FadeIn(lectura), run_time=0.6)
        self.play(dt.animate.set_value(0.40), run_time=2.4, rate_func=smooth)
        self.wait(0.6)
        self.play(dt.animate.set_value(0.50), run_time=2.4, rate_func=smooth)
        n3 = leyenda("Con D/T = 0,50 bastan 49 r/min y 2,08 kW. Joosten midió con un solo bafle",
                     "parcial; con cuatro bafles completos puede pedir más, y eso se ensaya.")
        self.play(ReplacementTransform(n2, n3), run_time=0.6)
        self.wait(1.6)
        self.wait(0.6)
