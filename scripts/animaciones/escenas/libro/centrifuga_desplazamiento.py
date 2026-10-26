"""Centrífuga contra desplazamiento positivo: qué pasa con cada una al cerrar
la válvula de descarga.

Para el capítulo de bombas del libro de operaciones unitarias. Centrífuga
H = 40 − 0,0025·Q²; de desplazamiento positivo a velocidad fija, con un
desliz pequeño, Q = 60 − 0,15·H, y válvula de alivio a 50 m; sistema
H = 10 + k·Q², con Q en m³/h y H en m. La válvula de descarga sube k:
0,0015 abierta, 0,005 a medio cerrar y 0,02 casi cerrada. En el tema
Uniandes el desplazamiento positivo va en azul noche, así que el sistema
va en el gris de los ejes para no confundirlos.

    uv run publicar.py escenas/libro/centrifuga_desplazamiento.py CentrifugaDesplazamiento \
        --tema uniandes --fondo nieve --destino {libro}/figuras/bombas
"""
from estilo import *

H0, A = 40.0, 0.0025        # centrífuga: H = H0 − A·Q²
Q_TEO, DESLIZ = 60.0, 0.15  # desplazamiento positivo: Q = Q_TEO − DESLIZ·H
H_ALIVIO = 50.0             # la válvula de alivio abre aquí
DZ = 10.0
K_ABIERTA, K_MEDIA, K_CERRADA = 0.0015, 0.005, 0.02
H_TOPE = 60.0


def h_sistema(q, k):
    return DZ + k * q * q


def punto_centrifuga(k):
    q = np.sqrt((H0 - DZ) / (A + k))
    return q, h_sistema(q, k)


def punto_desplazamiento(k):
    """Cruce de Q = Q_TEO − DESLIZ·H con el sistema; si pide más de lo que
    aguanta la válvula de alivio, la presión se queda en H_ALIVIO y al
    sistema le llega lo que esa cabeza empuja por la tubería."""
    a, b, c = DESLIZ * k, 1.0, DESLIZ * DZ - Q_TEO
    q = (-b + np.sqrt(b * b - 4 * a * c)) / (2 * a)
    h = h_sistema(q, k)
    if h <= H_ALIVIO:
        return q, h, 0.0
    q_sis = np.sqrt((H_ALIVIO - DZ) / k)
    return q_sis, H_ALIVIO, (Q_TEO - DESLIZ * H_ALIVIO) - q_sis


class CentrifugaDesplazamiento(Scene):
    def construct(self):
        k = ValueTracker(K_ABIERTA)

        ax = ejes((0, 120, 20), (0, H_TOPE, 10), x_largo=7.0, y_largo=5.2,
                  x_titulo="Caudal Q (m³/h)", y_titulo="Cabeza H (m)")
        ax.shift([-5.3, -2.55, 0] - ax.c2p(0, 0))
        x_panel = 2.45
        titulo = rotulo("Dos maneras de mover un líquido").to_corner(UL, buff=0.35)

        # ── 1. Las dos curvas ───────────────────────────────────────────
        self.next_section("curvas")
        centrifuga = ax.plot(lambda q: H0 - A * q * q, x_range=(0, np.sqrt(H0 / A)),
                             color=ACERO, stroke_width=6)
        desplaz = ax.plot_parametric_curve(lambda h: np.array([Q_TEO - DESLIZ * h, h, 0]),
                                           t_range=(0, H_TOPE), color=TEAL, stroke_width=6)
        et_c = texto("Centrífuga", color=ACERO_OSC, peso=SEMIBOLD).next_to(ax.c2p(3, H0), UP, 0.12) \
            .align_to(ax.c2p(3, 0), LEFT)
        et_d = texto("Desplazamiento\npositivo", TAM_NOTA, color=TEAL, peso=SEMIBOLD) \
            .next_to(ax.c2p(Q_TEO - DESLIZ * 4, 4), RIGHT, 0.2)
        self.add(titulo)
        self.play(Create(ax), FadeIn(titulo), run_time=1.4)
        self.play(Create(centrifuga), FadeIn(et_c), run_time=1.4)
        self.play(Create(desplaz), FadeIn(et_d), run_time=1.4)
        self.wait(0.6)

        # ── 2. El sistema decide dónde trabaja cada una ─────────────────
        self.next_section("sistema")
        sistema = always_redraw(lambda: ax.plot(
            lambda q: h_sistema(q, k.get_value()),
            x_range=(0, min(120, np.sqrt((H_TOPE - DZ) / k.get_value()))),
            color=TINTA_2, stroke_width=6))
        def et_sistema():
            kv = k.get_value()
            if kv < 0.005:   # tendida: la etiqueta va abajo, cerca del extremo
                q = 0.86 * min(120, np.sqrt((H_TOPE - DZ) / kv))
                return texto("Sistema", TAM_NOTA, TINTA_2, peso=SEMIBOLD).next_to(ax.c2p(q, h_sistema(q, kv)), DR, 0.08)
            q = np.sqrt((58 - DZ) / kv)   # empinada: arriba, del lado libre de la otra curva
            lado = RIGHT if q > 55 else LEFT
            return texto("Sistema", TAM_NOTA, TINTA_2, peso=SEMIBOLD).next_to(ax.c2p(q, 58), lado, 0.15)

        et_s = always_redraw(et_sistema)
        p_c = always_redraw(lambda: Dot(ax.c2p(*punto_centrifuga(k.get_value())), radius=0.11, color=ACERO_OSC))
        p_d = always_redraw(lambda: Dot(ax.c2p(*punto_desplazamiento(k.get_value())[:2]), radius=0.11, color=TEAL))

        def lectura():
            qc, hc = punto_centrifuga(k.get_value())
            qd, hd, rec = punto_desplazamiento(k.get_value())
            filas = [texto("Centrífuga", TAM_NOTA, ACERO_OSC, peso=SEMIBOLD),
                     texto(f"{num(qc)} m³/h · {num(hc)} m"),
                     texto("Desplazamiento positivo", TAM_NOTA, TEAL, peso=SEMIBOLD).set_opacity(1),
                     texto(f"{num(qd)} m³/h · {num(hd)} m")]
            if rec > 0.05:
                filas.append(texto(f"{num(rec)} m³/h por el alivio", TAM_NOTA, AMBAR, peso=SEMIBOLD))
            g = VGroup(*filas).arrange(DOWN, aligned_edge=LEFT, buff=0.16)
            g[2].shift(DOWN * 0.18)
            g[3].shift(DOWN * 0.18)
            if rec > 0.05:
                g[4].shift(DOWN * 0.18)
            return g.move_to([x_panel, 2.3, 0], aligned_edge=UL)

        lect = always_redraw(lectura)
        nuevo = rotulo("El sistema decide dónde trabaja cada una").move_to(titulo, aligned_edge=LEFT)
        self.play(Create(sistema), FadeIn(et_s), FadeTransform(titulo, nuevo), run_time=1.4)
        titulo = nuevo
        self.play(GrowFromCenter(p_c), GrowFromCenter(p_d), FadeIn(lect), run_time=1.0)
        self.wait(0.8)

        # ── 3. A medio cerrar la válvula de descarga ────────────────────
        self.next_section("medio")
        nuevo = rotulo("Al cerrar la válvula de descarga").move_to(titulo, aligned_edge=LEFT)
        fantasma = ax.plot(lambda q: h_sistema(q, K_ABIERTA), x_range=(0, 120), color=REJILLA, stroke_width=5)
        self.add(fantasma, sistema, p_c, p_d)
        self.play(FadeTransform(titulo, nuevo), run_time=0.8)
        titulo = nuevo
        self.play(k.animate.set_value(K_MEDIA), run_time=3.2, rate_func=smooth)
        nota = texto("La centrífuga cede caudal;\nla otra casi no se entera.", TAM_NOTA, TINTA_2) \
            .move_to([x_panel, -1.2, 0], aligned_edge=UL)
        self.play(FadeIn(nota), run_time=0.8)
        self.wait(0.8)

        # ── 4. Casi cerrada: la válvula de alivio ───────────────────────
        self.next_section("alivio")
        q_ab = Q_TEO - DESLIZ * H_ALIVIO
        alivio = DashedLine(ax.c2p(0, H_ALIVIO), ax.c2p(q_ab, H_ALIVIO), color=AMBAR, stroke_width=5,
                            dash_length=0.14)
        et_al = texto("Alivio a 50 m", TAM_NOTA, AMBAR, peso=SEMIBOLD).next_to(ax.c2p(4, H_ALIVIO), UP, 0.1) \
            .align_to(ax.c2p(4, 0), LEFT)
        nuevo = rotulo("Si se cierra de más").move_to(titulo, aligned_edge=LEFT)
        self.play(FadeTransform(titulo, nuevo), FadeOut(nota), Create(alivio), FadeIn(et_al), run_time=1.0)
        titulo = nuevo
        self.play(k.animate.set_value(K_CERRADA), run_time=3.5, rate_func=smooth)
        nota2 = texto("Sin el alivio, la presión\nseguiría subiendo.", TAM_NOTA, TINTA_2) \
            .move_to([x_panel, -1.5, 0], aligned_edge=UL)
        self.play(FadeIn(nota2), run_time=0.8)

        final = rotulo("La centrífuga cede caudal; la otra, presión").move_to(titulo, aligned_edge=LEFT)
        self.play(FadeTransform(titulo, final), run_time=1.0)
        self.wait(2.5)
