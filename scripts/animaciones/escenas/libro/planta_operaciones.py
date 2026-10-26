"""La planta de aceite esencial descompuesta en sus operaciones unitarias y
clasificada por familia, para el capítulo 1 del libro de operaciones
unitarias («Las operaciones unitarias»).

Es la escena de la Figura 1 de la Lectura 1 de POU 2027-10
(escenas/iqya-2031-2027-10/planta_operaciones.py). El libro tiene su propia
copia para no moverse cuando cambie el curso.

    uv run publicar.py escenas/libro/planta_operaciones.py PlantaOperaciones \
        --tema uniandes --fondo nieve --destino {libro}/figuras/las-operaciones-unitarias \
        --nombre planta-operaciones --titulo "la planta de aceite esencial en siete operaciones unitarias"
"""
from estilo import *

MEC, CAL, MAS = AMARILLO, OLIVA, NAVY
FAMILIAS = [(MEC, "Mecánicas"), (CAL, "Transferencia de calor"), (MAS, "Transferencia de masa")]

# nombre (una línea por renglón), condición de operación y familias, la dominante primero
PASOS = [
    (["Lavado y", "acondicionamiento"], "agua de lavado", [MEC]),
    (["Desgarrado"], "a 5–10 mm", [MEC]),
    (["Arrastre", "de vapor"], "vapor vivo", [MAS, CAL]),
    (["Condensación"], "agua de enfriamiento", [CAL]),
    (["Decantador", "florentino"], "aceite e hidrolato", [MEC]),
    (["Winterización"], "a 5–10 °C", [CAL, MAS, MEC]),
    (["Rectificación", "al vacío"], "a 10–20 mbar", [MAS]),
]
MIXTOS = (2, 5)

W, H = 2.5, 1.4
X = [-4.1, -1.05, 2.0, 5.05]
Y1, Y2 = 1.6, -0.95  # la franja de abajo queda libre para los controles del video
POS = [(X[0], Y1), (X[1], Y1), (X[2], Y1), (X[3], Y1), (X[1], Y2), (X[2], Y2), (X[3], Y2)]
FRANJA = 0.24


def bloque(i):
    lineas, cond, _ = PASOS[i]
    caja = Rectangle(width=W, height=H, stroke_color=TINTA, stroke_width=3,
                     fill_color=FONDO, fill_opacity=1).move_to([*POS[i], 0])
    nombre = VGroup(*[texto(l, 23, TINTA, peso=SEMIBOLD) for l in lineas]).arrange(DOWN, buff=0.06)
    detalle = texto(cond, 19, TINTA_2)
    for t in (nombre, detalle):
        if t.width > W - 0.26:
            t.scale_to_fit_width(W - 0.26)
    rotulos = VGroup(nombre, detalle).arrange(DOWN, buff=0.1)
    rotulos.move_to(caja).shift(UP * FRANJA / 2)
    return VGroup(caja, rotulos)


def franja(i, caja):
    fams = PASOS[i][2]
    ancho = W / len(fams)
    partes = VGroup(*[
        Rectangle(width=ancho, height=FRANJA, fill_color=c, fill_opacity=1,
                  stroke_color=TINTA, stroke_width=1.5)
        for c in fams
    ]).arrange(RIGHT, buff=0)
    return partes.move_to(caja.get_bottom(), aligned_edge=DOWN)


def flecha(a, b):
    return Arrow(a, b, buff=0.06, color=TINTA_2, stroke_width=3,
                 max_tip_length_to_length_ratio=0.3, tip_length=0.17)


class PlantaOperaciones(Scene):
    def construct(self):
        titulo = rotulo("Siete pasos entre la cáscara y el aceite", color=TINTA).to_corner(UL, buff=0.4)

        bloques = [bloque(i) for i in range(len(PASOS))]
        cajas = [b[0] for b in bloques]

        entrada = flecha([-7.0, Y1, 0], cajas[0].get_left())
        et_entrada = VGroup(texto("Cáscara de", 18, TINTA_2), texto("la juguera", 18, TINTA_2)) \
            .arrange(DOWN, buff=0.05, aligned_edge=LEFT)
        et_entrada.next_to(entrada, UP, buff=0.12, aligned_edge=LEFT)

        flechas = [flecha(cajas[k].get_right(), cajas[k + 1].get_left()) for k in (0, 1, 2)]
        y_paso = (Y1 - H / 2 + Y2 + H / 2) / 2
        bajada = VGroup(
            Line(cajas[3].get_bottom(), [X[3], y_paso, 0], color=TINTA_2, stroke_width=3),
            Line([X[3], y_paso, 0], [X[1], y_paso, 0], color=TINTA_2, stroke_width=3),
            flecha([X[1], y_paso, 0], cajas[4].get_top()),
        )
        flechas.append(bajada)
        flechas += [flecha(cajas[k].get_right(), cajas[k + 1].get_left()) for k in (4, 5)]

        salida = flecha(cajas[6].get_bottom(), [X[3], -2.25, 0])
        et_salida = texto("Aceite rectificado", 22, TINTA, peso=SEMIBOLD).next_to(salida, DOWN, buff=0.1)

        # ── 1. El tren de proceso ───────────────────────────────────────
        self.next_section("tren")
        self.play(FadeIn(titulo), GrowArrow(entrada), FadeIn(et_entrada), run_time=0.9)
        for i, b in enumerate(bloques):
            anims = [FadeIn(b, shift=RIGHT * 0.15)]
            if i < len(flechas):
                anims.append(Create(flechas[i]) if i == 3 else GrowArrow(flechas[i]))
            self.play(*anims, run_time=0.65)
        self.play(GrowArrow(salida), FadeIn(et_salida), run_time=0.7)
        self.wait(0.8)

        # ── 2. Tres familias ────────────────────────────────────────────
        self.next_section("familias")
        leyenda = VGroup(*[
            VGroup(Rectangle(width=0.45, height=0.26, fill_color=c, fill_opacity=1,
                             stroke_color=TINTA, stroke_width=1.5),
                   texto(n, 21, TINTA)).arrange(RIGHT, buff=0.18)
            for c, n in FAMILIAS
        ]).arrange(DOWN, aligned_edge=LEFT, buff=0.2)
        leyenda.move_to([-6.8, -0.4, 0], aligned_edge=UL)
        franjas = [franja(i, cajas[i]) for i in range(len(PASOS))]
        nuevo = rotulo("Tres familias de operaciones", color=TINTA).move_to(titulo, aligned_edge=LEFT)
        simples = [i for i in range(len(PASOS)) if i not in MIXTOS]
        self.play(FadeTransform(titulo, nuevo), FadeIn(leyenda, shift=UP * 0.1), run_time=0.9)
        titulo = nuevo
        self.play(LaggedStart(*[GrowFromEdge(franjas[i], LEFT) for i in simples], lag_ratio=0.25),
                  run_time=2.2)
        self.wait(0.8)

        # ── 3. Las operaciones mixtas ───────────────────────────────────
        self.next_section("mixtas")
        nuevo = rotulo("Dos pasos combinan familias", color=TINTA).move_to(titulo, aligned_edge=LEFT)
        self.play(FadeTransform(titulo, nuevo), run_time=0.8)
        titulo = nuevo
        self.play(*[GrowFromEdge(franjas[i], LEFT) for i in MIXTOS],
                  *[Indicate(cajas[i], color=ACERO, scale_factor=1.04) for i in MIXTOS], run_time=1.6)
        self.wait(0.8)

        # ── 4. Ninguna reacción ─────────────────────────────────────────
        self.next_section("sin-reaccion")
        nuevo = rotulo("La planta mueve, calienta y separa", color=TINTA).move_to(titulo, aligned_edge=LEFT)
        nota = texto("Ningún paso transforma una especie en otra: la planta no tiene reactor.",
                     21, TINTA_2).move_to([-6.8, -2.75, 0], aligned_edge=LEFT)
        self.play(FadeTransform(titulo, nuevo), FadeIn(nota, shift=UP * 0.1), run_time=1.0)
        self.wait(2.5)
