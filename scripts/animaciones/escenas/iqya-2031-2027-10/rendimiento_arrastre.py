"""Cómo sale el aceite de un lecho en el arrastre de vapor: el lecho primero se
calienta, después sale de golpe el aceite de las glándulas rotas (lavado) y al
final, despacio, el que tiene que difundir desde el tejido intacto. Con eso,
cada kilo de vapor lleva cada vez menos aceite, muy lejos del equilibrio.

Es la Figura 5 de la Lectura 4 de POU 2027-10. Los números son los del ejemplo
resuelto de la lectura (una hierba aromática genérica en un extractor piloto
de 30 kg con 12 kg/h de vapor), así que coinciden con el texto y con la
figura interactiva: y∞ = 0,85 % en base fresca, f = 0,60, k1 = 0,15 1/min,
k2 = 0,020 1/min y t0 = 22 min.

    uv run publicar.py escenas/iqya-2031-2027-10/rendimiento_arrastre.py RendimientoArrastre \
        --curso iqya-2031-2027-10 --carpeta lecturas/Lectura_04 --tema uniandes --fondo papel \
        --nombre rendimiento-arrastre --titulo "cómo sale el aceite de un lecho en el arrastre de vapor"
"""
import math

from estilo import *

Y_INF, F, K1, K2, T0 = 0.85, 0.60, 0.15, 0.020, 22.0
CARGA, VAPOR = 30.0, 12.0          # kg de hierba y kg/h de vapor del piloto
EQ_LIM = 690                       # g de limoneno por kg de vapor en equilibrio, a 1 atm


def lavado(t):
    return 0.0 if t <= T0 else Y_INF * F * (1 - math.exp(-K1 * (t - T0)))


def difusion(t):
    return 0.0 if t <= T0 else Y_INF * (1 - F) * (1 - math.exp(-K2 * (t - T0)))


def rend(t):
    return lavado(t) + difusion(t)


def relacion(t):
    """g de aceite por kg de vapor en el instante t."""
    if t <= T0:
        return 0.0
    tau = t - T0
    dy = Y_INF * (F * K1 * math.exp(-K1 * tau) + (1 - F) * K2 * math.exp(-K2 * tau))  # %/min
    return dy / 100 * CARGA * 1000 / (VAPOR / 60)


def lineas(renglones, tam=24, color=None, peso=MEDIUM):
    return VGroup(*[texto(r, tam, color, peso=peso) for r in renglones]).arrange(DOWN, aligned_edge=LEFT, buff=0.1)


class RendimientoArrastre(Scene):
    def construct(self):
        # La franja de abajo queda libre para los controles del video en la lectura.
        # Rendimiento en g de aceite por kg de hierba: 0,85 % = 8,5 g/kg.
        ax = ejes((0, 180, 30), (0, 10, 2), x_largo=6.4, y_largo=4.4,
                  x_titulo="Tiempo desde que se abre el vapor (min)", y_titulo="Aceite (g por kg de hierba)", tam=22)
        ax.shift([-5.2, -1.7, 0] - ax.c2p(0, 0))
        assert ax.get_bottom()[1] > -3.05, ax.get_bottom()
        X = 1.75          # borde izquierdo del panel de la derecha
        ARRIBA = 2.55

        def paso(s):
            return rotulo(s, tam=36, color=TINTA).to_corner(UL, buff=0.4)

        def en_panel(m, y=ARRIBA):
            return m.move_to([X, y, 0], aligned_edge=UL)

        # ── 1. Calentamiento ────────────────────────────────────────────
        self.next_section("calentamiento")
        titulo = paso("Primero el lecho se calienta")
        banda = Rectangle(width=ax.c2p(T0, 0)[0] - ax.c2p(0, 0)[0], height=ax.c2p(0, 10)[1] - ax.c2p(0, 0)[1],
                          stroke_width=0, fill_color=AMARILLO, fill_opacity=0.55)
        banda.move_to(ax.c2p(0, 0), aligned_edge=DL)
        gota = Dot(ax.c2p(T0, 0), radius=0.1, color=NAVY, fill_color=AMARILLO, fill_opacity=1, stroke_width=3)
        et_gota = texto("primera gota", 20, TINTA_2).move_to(ax.c2p(52, 0.45), aligned_edge=LEFT)
        fl_gota = Arrow(et_gota.get_left() + LEFT * 0.05, ax.c2p(T0 + 1.5, 0.08), buff=0.05, color=TINTA_2,
                        stroke_width=2.5, max_tip_length_to_length_ratio=0.25)
        nota1 = en_panel(lineas(["El vapor condensa sobre la carga", "fría y la lleva a la temperatura", "de ebullición.",
                                 "Hasta que el frente llega arriba,", f"a los {T0:.0f} min, no sale aceite."], 24, TINTA))
        self.play(FadeIn(titulo), Create(ax), run_time=1.2)
        self.play(FadeIn(banda), GrowFromCenter(gota), FadeIn(et_gota), GrowArrow(fl_gota), run_time=0.9)
        self.play(FadeIn(nota1, shift=UP * 0.1), run_time=0.8)
        self.wait(2.2)

        # ── 2. Lavado ───────────────────────────────────────────────────
        self.next_section("lavado")
        nuevo = paso("Sale rápido el aceite que está a la mano")
        c_lav = ax.plot(lambda t: 10 * lavado(t), x_range=(T0, 180, 0.5), color=ACERO, stroke_width=6)
        et_lav = texto("lavado", 22, ACERO, peso=SEMIBOLD).next_to(ax.c2p(150, 10 * lavado(150)), UP, 0.1)
        ec_lav = formula(r"Y_{\text{lav}} = Y_\infty\,f\,\left(1 - e^{-k_1 \tau}\right)", tam=32)
        txt_lav = lineas(["Aceite de las glándulas que el", "picado y el calor ya rompieron:",
                          f"f = {num(F, 2)} del total,", f"k₁ = {num(K1, 2)} min⁻¹."], 22, TINTA_2)
        bloque2 = en_panel(VGroup(ec_lav, txt_lav).arrange(DOWN, aligned_edge=LEFT, buff=0.22))
        self.play(FadeTransform(titulo, nuevo), FadeOut(nota1), run_time=0.7)
        titulo = nuevo
        self.play(Create(c_lav), run_time=1.6, rate_func=linear)
        self.play(FadeIn(et_lav), FadeIn(bloque2, shift=UP * 0.1), run_time=0.8)
        self.wait(2.4)

        # ── 3. Difusión y suma ──────────────────────────────────────────
        self.next_section("difusion")
        nuevo = paso("Después, despacio, el que tiene que difundir")
        c_dif = DashedVMobject(ax.plot(lambda t: 10 * difusion(t), x_range=(T0, 180, 0.5), color=TEAL, stroke_width=5), num_dashes=40)
        et_dif = texto("difusión", 22, TEAL, peso=SEMIBOLD).next_to(ax.c2p(150, 10 * difusion(150)), DOWN, 0.1)
        c_tot = ax.plot(lambda t: 10 * rend(t), x_range=(T0, 180, 0.5), color=TINTA, stroke_width=7)
        asint = DashedLine(ax.c2p(0, Y_INF * 10), ax.c2p(180, Y_INF * 10), color=TINTA_3, dash_length=0.1, stroke_width=2.5)
        et_asint = texto(f"Y∞ = {num(Y_INF * 10, 1)} g/kg", 20, TINTA_3).next_to(ax.c2p(180, Y_INF * 10), UP, 0.08) \
            .align_to(ax.c2p(180, 0), RIGHT)
        ec_tot = formula(r"Y = Y_\infty\left[1 - f\,e^{-k_1 \tau} - (1-f)\,e^{-k_2 \tau}\right]", tam=27)
        txt_tot = lineas(["τ = t − t₀. El tejido intacto", f"entrega su aceite con k₂ = {num(K2, 3)} min⁻¹,",
                          f"{num(K1 / K2, 1)} veces más lento que el lavado."], 22, TINTA_2)
        bloque3 = en_panel(VGroup(ec_tot, txt_tot).arrange(DOWN, aligned_edge=LEFT, buff=0.22))
        self.play(FadeTransform(titulo, nuevo), FadeOut(bloque2), run_time=0.7)
        titulo = nuevo
        self.play(Create(c_dif), FadeIn(et_dif), run_time=1.4)
        self.play(Create(c_tot), Create(asint), FadeIn(et_asint), FadeIn(bloque3, shift=UP * 0.1), run_time=1.6)
        self.wait(2.6)

        # ── 4. Cuánto aceite lleva cada kilo de vapor ───────────────────
        self.next_section("relacion")
        nuevo = paso("Cada kilo de vapor lleva cada vez menos aceite")
        ax2 = ejes((0, 180, 60), (0, 120, 40), x_largo=3.6, y_largo=1.8,
                   x_titulo="Tiempo (min)", y_titulo="g/kg de vapor", tam=20)
        ax2.shift([X + 1.15, -1.9, 0] - ax2.c2p(0, 0))
        assert ax2.get_bottom()[1] > -3.05, ax2.get_bottom()
        c_rel = ax2.plot(relacion, x_range=(T0 + 0.6, 180, 0.25), color=ACERO, stroke_width=5)
        pico = relacion(T0 + 1)
        y90 = rend(90) / 100 * CARGA * 1000     # g
        prom90 = y90 / (VAPOR * 90 / 60)        # g/kg
        txt_rel = lineas([f"Al empezar, unos {pico:.0f} g/kg;", f"a los 90 min, {num(relacion(90), 1)} g/kg.",
                          f"En equilibrio, el limoneno", f"daría {EQ_LIM} g/kg."], 22, TINTA)
        txt_rel.move_to([X, ARRIBA, 0], aligned_edge=UL)
        txt_prom = texto(f"Promedio a los 90 min: {num(prom90, 1)} g/kg", 22, ACERO_OSC, peso=SEMIBOLD)
        txt_prom.next_to(txt_rel, DOWN, 0.18, aligned_edge=LEFT)
        self.play(FadeTransform(titulo, nuevo), FadeOut(bloque3), run_time=0.7)
        titulo = nuevo
        self.play(Create(ax2), run_time=0.8)
        self.play(Create(c_rel), FadeIn(txt_rel, shift=UP * 0.1), run_time=1.6)
        self.play(FadeIn(txt_prom), run_time=0.7)
        self.wait(3.0)
