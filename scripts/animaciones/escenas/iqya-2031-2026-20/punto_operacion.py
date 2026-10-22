"""Punto de operación de una bomba centrífuga y dos maneras de bajar el
caudal a 60 m³/h: cerrar la válvula de descarga o bajar la velocidad.

Para la diapositiva «El punto de operación» de Bombas centrífugas
(POU 2026-20). Bomba H = 40 − 0,0025·Q² y sistema H = 10 + 0,0015·Q²,
con Q en m³/h y H en m. Cada sección es un paso: en la diapositiva el
video se detiene al final de cada una y sigue con la flecha.

    uv run publicar.py escenas/iqya-2031-2026-20/punto_operacion.py PuntoOperacion \
        --curso iqya-2031-2026-20 --deck Bombas_Centrifugas
"""
from estilo import *

H0, A = 40.0, 0.0025        # bomba a velocidad nominal: H = H0·(n/n0)² − A·Q²
DZ, K0 = 10.0, 0.0015       # sistema con la válvula abierta: H = Δz + k·Q²
Q_META = 60.0
H_TOPE = 45.0               # tope del eje H


def h_bomba(q, r=1.0):
    return H0 * r * r - A * q * q


def h_sistema(q, k):
    return DZ + k * q * q


def operacion(k, r):
    q = np.sqrt((H0 * r * r - DZ) / (A + k))
    return q, h_sistema(q, k)


def potencia_kw(q, h):
    """Potencia hidráulica ρ·g·Q·H del agua, en kW."""
    return 1000 * 9.81 * (q / 3600) * h / 1000


K_VALV = (h_bomba(Q_META) - DZ) / Q_META**2                    # válvula que deja 60 m³/h
R_VEL = np.sqrt((h_sistema(Q_META, K0) + A * Q_META**2) / H0)  # velocidad que da 60 m³/h


class PuntoOperacion(Scene):
    def construct(self):
        k = ValueTracker(K0)
        r = ValueTracker(1.0)

        ax = ejes((0, 120, 20), (0, H_TOPE, 5), x_largo=7.0, y_largo=5.2,
                  x_titulo="Caudal Q (m³/h)", y_titulo="Altura H (m)",
                  y_numeros=[0, 10, 20, 30, 40])
        ax.shift([-5.3, -2.55, 0] - ax.c2p(0, 0))   # el título del paso va arriba, libre

        def curva_bomba(rv, color=ACERO, ancho=6):
            q_fin = min(120, np.sqrt(H0 * rv * rv / A))
            return ax.plot(lambda q: h_bomba(q, rv), x_range=(0, q_fin),
                           color=color, stroke_width=ancho)

        def curva_sistema(kv, color=TINTA, ancho=6):
            q_fin = min(120, np.sqrt((H_TOPE - DZ) / kv))
            return ax.plot(lambda q: h_sistema(q, kv), x_range=(0, q_fin),
                           color=color, stroke_width=ancho)

        def punto_op():
            return ax.c2p(*operacion(k.get_value(), r.get_value()))

        # Panel de la derecha: fórmulas arriba, lectura debajo
        x_panel = 2.75
        titulo = rotulo("Bomba y sistema").to_corner(UL, buff=0.35)

        f_bomba = MathTex("H_b", "=", "H_0", "-", "a", "Q^2", font_size=40, color=ACERO_OSC)
        f_bomba_n = MathTex("H_b", "=", "H_0", r"(n/n_0)^2", "-", "a", "Q^2",
                            font_size=40, color=ACERO_OSC)
        f_sist = MathTex("H_s", "=", r"\Delta z", "+", "k", "Q^2", font_size=40)
        f_bomba.move_to([x_panel, 2.45, 0], aligned_edge=LEFT)
        f_bomba_n.move_to([x_panel, 2.45, 0], aligned_edge=LEFT)
        f_sist.move_to([x_panel, 1.6, 0], aligned_edge=LEFT)

        # ── 1. Las dos curvas ───────────────────────────────────────────
        self.next_section("curvas")
        bomba = curva_bomba(1.0)
        sistema = curva_sistema(K0)

        def sobre_sistema(kv):   # donde va la etiqueta: cerca del extremo, por debajo
            q = 0.88 * min(120, np.sqrt((H_TOPE - DZ) / kv))
            return ax.c2p(q, h_sistema(q, kv))

        et_bomba = texto("Bomba", color=ACERO_OSC, peso=SEMIBOLD)
        et_bomba.add_updater(lambda m: m.next_to(ax.c2p(22, h_bomba(22, r.get_value())), UP, 0.15),
                             call_updater=True)
        et_sist = texto("Sistema", peso=SEMIBOLD)
        et_sist.add_updater(lambda m: m.next_to(sobre_sistema(k.get_value()), DR, 0.08),
                            call_updater=True)

        dz = texto("Δz = 10 m", TAM_NOTA, TINTA_2).next_to(ax.c2p(0, DZ), RIGHT, 0.2).shift(DOWN * 0.22)

        self.add(titulo)
        self.play(Create(ax), FadeIn(titulo), run_time=1.5)
        self.play(Create(bomba), Write(f_bomba), FadeIn(et_bomba), run_time=1.6)
        self.play(Create(sistema), Write(f_sist), FadeIn(et_sist), FadeIn(dz), run_time=1.6)
        bomba.add_updater(lambda m: m.become(curva_bomba(r.get_value())))
        sistema.add_updater(lambda m: m.become(curva_sistema(k.get_value())))
        self.wait(0.6)

        # ── 2. El punto de operación ────────────────────────────────────
        self.next_section("operacion")
        punto = always_redraw(lambda: Dot(punto_op(), radius=0.11, color=TINTA))
        guias = always_redraw(lambda: ax.get_lines_to_point(punto_op(), color=TINTA_3,
                                                            stroke_width=2.5))
        con_n = [False]

        def lectura():
            q, h = operacion(k.get_value(), r.get_value())
            filas = [texto(f"Q = {num(q)} m³/h"), texto(f"H = {num(h)} m")]
            if con_n[0]:
                filas.append(texto(f"Velocidad: {num(100 * r.get_value(), 0)} %"))
            return VGroup(*filas).arrange(DOWN, aligned_edge=LEFT, buff=0.18) \
                .move_to([x_panel, 0.95, 0], aligned_edge=UL)

        lect = always_redraw(lectura)
        nuevo = rotulo("El punto de operación").move_to(titulo, aligned_edge=LEFT)
        self.play(GrowFromCenter(punto), Create(guias), FadeIn(lect),
                  FadeTransform(titulo, nuevo), run_time=1.4)
        titulo = nuevo
        self.play(Flash(punto, color=ACERO, line_length=0.25, flash_radius=0.3))
        self.wait(0.6)

        # ── 3. La meta ──────────────────────────────────────────────────
        self.next_section("meta")
        meta = DashedLine(ax.c2p(Q_META, 0), ax.c2p(Q_META, H_TOPE), color=TINTA_3,
                          stroke_width=3, dash_length=0.12)
        et_meta = texto("60 m³/h", TAM_NOTA, TINTA_2).next_to(ax.c2p(Q_META, 42), LEFT, 0.15)
        nuevo = rotulo("Se necesitan 60 m³/h").move_to(titulo, aligned_edge=LEFT)
        self.play(Create(meta), FadeIn(et_meta), FadeTransform(titulo, nuevo), run_time=1.2)
        titulo = nuevo
        self.wait(0.6)

        # ── 4. Opción A: cerrar la válvula ──────────────────────────────
        self.next_section("valvula")
        nuevo = rotulo("A · Cerrar la válvula").move_to(titulo, aligned_edge=LEFT)
        fantasma_s = curva_sistema(K0, REJILLA, 5)
        self.play(FadeTransform(titulo, nuevo), FadeIn(fantasma_s),
                  f_sist[4].animate.set_color(AMBAR).scale(1.25), run_time=0.9)
        titulo = nuevo
        self.play(k.animate.set_value(K_VALV), run_time=3.5, rate_func=smooth)

        h_a = h_bomba(Q_META)
        h_libre = h_sistema(Q_META, K0)
        perdida = Line(ax.c2p(Q_META, h_libre), ax.c2p(Q_META, h_a), color=AMBAR, stroke_width=9)
        llave = Brace(perdida, RIGHT, buff=0.12, color=TINTA_2)
        et_perdida = texto(f"{num(h_a - h_libre)} m", TAM_NOTA, peso=SEMIBOLD).next_to(llave, RIGHT, 0.1) \
            .shift(DOWN * 0.12)
        nota_a = texto(f"{num(h_a - h_libre)} m en la válvula", TAM_NOTA, TINTA_2)
        self.play(Create(perdida), GrowFromCenter(llave), FadeIn(et_perdida), run_time=1.2)

        rect_a = Polygon(ax.c2p(0, 0), ax.c2p(Q_META, 0), ax.c2p(Q_META, h_a), ax.c2p(0, h_a),
                         stroke_width=0, fill_color=AMBAR, fill_opacity=0.16)
        kw_a = potencia_kw(Q_META, h_a)
        et_a = texto(f"{num(kw_a)} kW", TAM_TEXTO, peso=SEMIBOLD).move_to(ax.c2p(27, 26))
        f_pot = MathTex(r"P_h", "=", r"\rho\, g\, Q\, H", font_size=40) \
            .move_to([x_panel, -1.15, 0], aligned_edge=LEFT)
        res_a = texto(f"A · válvula: {num(kw_a)} kW", TAM_TEXTO).move_to([x_panel, -1.95, 0], aligned_edge=LEFT)
        nota_a.next_to(res_a, DOWN, 0.12, aligned_edge=LEFT)
        self.play(FadeIn(rect_a), FadeIn(et_a), Write(f_pot), FadeIn(res_a), FadeIn(nota_a), run_time=1.3)
        self.wait(0.6)

        # ── 5. Opción B: bajar la velocidad ─────────────────────────────
        self.next_section("velocidad")
        nuevo = rotulo("B · Bajar la velocidad").move_to(titulo, aligned_edge=LEFT)
        borde_a = DashedVMobject(
            Polygon(ax.c2p(0, 0), ax.c2p(Q_META, 0), ax.c2p(Q_META, h_a), ax.c2p(0, h_a),
                    color=AMBAR, stroke_width=3), num_dashes=60)
        self.play(FadeTransform(titulo, nuevo), FadeOut(perdida), FadeOut(llave),
                  FadeOut(et_perdida), FadeOut(et_a), FadeOut(dz), ReplacementTransform(rect_a, borde_a),
                  run_time=0.9)
        titulo = nuevo
        self.play(k.animate.set_value(K0), f_sist[4].animate.set_color(TINTA).scale(0.8),
                  run_time=1.6, rate_func=smooth)
        self.remove(fantasma_s)

        fantasma_b = curva_bomba(1.0, REJILLA, 5)
        con_n[0] = True
        self.add(fantasma_b, bomba, punto)
        self.play(TransformMatchingTex(f_bomba, f_bomba_n), run_time=1.0)
        self.play(r.animate.set_value(R_VEL), run_time=3.5, rate_func=smooth)

        h_b = h_sistema(Q_META, K0)
        rect_b = Polygon(ax.c2p(0, 0), ax.c2p(Q_META, 0), ax.c2p(Q_META, h_b), ax.c2p(0, h_b),
                         stroke_width=0, fill_color=ACERO, fill_opacity=0.28)
        kw_b = potencia_kw(Q_META, h_b)
        et_b = texto(f"{num(kw_b)} kW", TAM_TEXTO, peso=SEMIBOLD).move_to(ax.c2p(27, 5))
        res_b = texto(f"B · velocidad: {num(kw_b)} kW", TAM_TEXTO, color=ACERO_OSC, peso=SEMIBOLD) \
            .next_to(nota_a, DOWN, 0.3, aligned_edge=LEFT)
        self.play(FadeIn(rect_b), FadeIn(et_b), FadeIn(res_b), run_time=1.3)

        final = rotulo("Mismo caudal, la mitad de la potencia").move_to(titulo, aligned_edge=LEFT)
        self.play(FadeTransform(titulo, final), Indicate(res_b, color=ACERO, scale_factor=1.06),
                  run_time=1.2)
        self.wait(2.5)
