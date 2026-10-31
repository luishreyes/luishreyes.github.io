"""La matriz dimensional de una gota que sube en el agua, para el capítulo 4 del libro de
operaciones unitarias (Análisis dimensional y escalado). Método de Pawlowski, como lo presenta
Zlokarnik (Scale-Up in Chemical Engineering, 2.ª ed., cap. 3): la lista u = f(d, ρ, μ, gΔρ),
la matriz de exponentes de M, L y T con ρ, d y μ en el núcleo, tres combinaciones de filas hasta
que el núcleo es la identidad, y la lectura de los dos números, Re y Ar. Es la tabla tbl-ade-matriz
del capítulo, paso a paso.

    uv run publicar.py escenas/libro/matriz_dimensional.py MatrizDimensional \
        --tema uniandes --fondo nieve --nombre matriz-gota \
        --destino {libro}/figuras/analisis-dimensional-y-escalado \
        --titulo "la matriz dimensional de la gota, llevada a la identidad hasta leer Re y Ar"
"""
from estilo import *
from paleta_libro import *   # los colores salen de la paleta del libro (libro/estilo/paleta.json)

COLS = [r"\rho", "d", r"\mu", "u", r"g\Delta\rho"]
FILAS = ["M", "L", "T"]
INICIO = [[1, 0, 1, 0, 1], [-3, 1, -1, 1, -2], [0, 0, -1, -1, -2]]
# las tres combinaciones, en orden: T ← −T; M ← M − T; L ← L + 3M + T (con las filas ya cambiadas)
PASO1 = [[1, 0, 1, 0, 1], [-3, 1, -1, 1, -2], [0, 0, 1, 1, 2]]
PASO2 = [[1, 0, 0, -1, -1], [-3, 1, -1, 1, -2], [0, 0, 1, 1, 2]]
PASO3 = [[1, 0, 0, -1, -1], [0, 1, 0, -1, -3], [0, 0, 1, 1, 2]]
assert all(PASO3[i][j] == (1 if i == j else 0) for i in range(3) for j in range(3))
# comprobación: las combinaciones dan lo mismo que la tabla del capítulo (M + T, L + 3M + 2T, −T)
assert PASO3[0] == [a + b for a, b in zip(INICIO[0], INICIO[2])]
assert PASO3[1] == [a + 3 * b + 2 * c for a, b, c in zip(INICIO[1], INICIO[0], INICIO[2])]
assert PASO3[2] == [-c for c in INICIO[2]]

X0, DX = -3.2, 1.45                 # columnas de la matriz
Y0, DY = 1.5, 0.8                   # filas


def entrada(v, color=None):
    s = str(v).replace("-", "-")
    return formula(s if v >= 0 else r"-" + str(-v), tam=TAM_TEXTO + 8, color=color or TINTA)


class MatrizDimensional(Scene):
    def construct(self):
        def paso(s):
            return rotulo(s, color=TINTA).to_corner(UL, buff=0.4)

        def pos(i, j):
            return np.array([X0 + DX * j + (0.45 if j >= 3 else 0), Y0 - DY * i, 0])

        # ── 1. La lista ───────────────────────────────────────────────────
        self.next_section("lista")
        titulo = paso("La lista de relevancia de la gota")
        lista = formula(r"u = f(d,\ \rho,\ \mu,\ g\Delta\rho)", tam=TAM_TITULO + 8).move_to([0, 1.7, 0])
        dims = VGroup(*[
            VGroup(formula(s, tam=TAM_TEXTO + 6), texto(d, TAM_NOTA, TINTA_2)).arrange(DOWN, buff=0.18)
            for s, d in [("u", "L/T"), ("d", "L"), (r"\rho", "M/L³"), (r"\mu", "M/(L·T)"), (r"g\Delta\rho", "M/(L²·T²)")]
        ]).arrange(RIGHT, buff=0.9).move_to([0, 0.0, 0])
        cuenta = texto("5 magnitudes, 3 dimensiones de base: 5 − 3 = 2 números", TAM_TEXTO, TINTA).move_to([0, -1.6, 0])
        self.play(FadeIn(titulo), Write(lista), run_time=1.2)
        self.play(LaggedStart(*[FadeIn(d, shift=UP * 0.1) for d in dims], lag_ratio=0.15), run_time=1.4)
        self.play(FadeIn(cuenta, shift=UP * 0.1), run_time=0.7)
        self.wait(1.4)

        # ── 2. La matriz ──────────────────────────────────────────────────
        self.next_section("matriz")
        nuevo = paso("Los exponentes de M, L y T, columna por columna")
        cab = VGroup(*[formula(c, tam=TAM_TEXTO + 8).move_to(pos(-1, j) + UP * 0.1) for j, c in enumerate(COLS)])
        fil = VGroup(*[texto(f, TAM_TEXTO + 4, TINTA_2, peso=SEMIBOLD).move_to(pos(i, -1)) for i, f in enumerate(FILAS)])
        vals = [[entrada(INICIO[i][j]).move_to(pos(i, j)) for j in range(5)] for i in range(3)]
        celdas = VGroup(*[v for r in vals for v in r])
        nucleo = Rectangle(width=3 * DX - 0.2, height=3 * DY + 0.2, stroke_width=0, fill_color=REJILLA, fill_opacity=0.55)
        nucleo.move_to((pos(0, 0) + pos(2, 2)) / 2)
        e_nuc = texto("núcleo", TAM_NOTA, TINTA_2).next_to(nucleo, DOWN, 0.15)
        resid = Rectangle(width=2 * DX - 0.2, height=3 * DY + 0.2, stroke_color=OLIVA, stroke_width=3, fill_opacity=0)
        resid.move_to((pos(0, 3) + pos(2, 4)) / 2)
        e_res = texto("residuo", TAM_NOTA, OLIVA).next_to(resid, DOWN, 0.15)
        self.play(FadeTransform(titulo, nuevo), FadeOut(lista), FadeOut(dims), FadeOut(cuenta), run_time=0.8)
        titulo = nuevo
        self.play(FadeIn(cab), FadeIn(fil), run_time=0.7)
        self.play(LaggedStart(*[FadeIn(v) for v in celdas], lag_ratio=0.04), run_time=1.4)
        self.play(FadeIn(nucleo), FadeIn(e_nuc), Create(resid), FadeIn(e_res), run_time=1.0)
        self.bring_to_back(nucleo)
        nota = texto("Al residuo van la incógnita y las dudosas: cada columna da un número.", TAM_NOTA, TINTA_2).move_to([0, -2.55, 0])
        self.play(FadeIn(nota), run_time=0.6)
        self.wait(1.4)

        # ── 3. Las tres combinaciones ─────────────────────────────────────
        def combinar(nuevo_t, fila, destino, op):
            t = paso(nuevo_t)
            etiqueta = formula(op, tam=TAM_TEXTO + 6, color=OLIVA).move_to([4.9, pos(fila, 0)[1], 0])
            marca = SurroundingRectangle(VGroup(*vals[fila]), color=OLIVA, buff=0.12, stroke_width=3)
            self.play(FadeTransform(self.titulo_actual, t), Create(marca), FadeIn(etiqueta), run_time=0.8)
            self.titulo_actual = t
            cambios = []
            for j in range(5):
                if destino[fila][j] != self.actual[fila][j]:
                    n = entrada(destino[fila][j], OLIVA).move_to(pos(fila, j))
                    cambios.append(Transform(vals[fila][j], n))
            self.play(*cambios, run_time=1.0)
            self.actual = [r[:] for r in destino]
            self.play(FadeOut(marca), FadeOut(etiqueta), *[v.animate.set_color(TINTA) for v in vals[fila]], run_time=0.5)
            self.wait(0.8)

        self.titulo_actual = titulo
        self.actual = [r[:] for r in INICIO]
        self.play(FadeOut(nota), run_time=0.3)
        self.next_section("paso1")
        combinar("Se combinan filas hasta que el núcleo es la identidad", 2, PASO1, r"T \leftarrow -T")
        self.next_section("paso2")
        combinar("La fila de M: se le resta la nueva T", 0, PASO2, r"M \leftarrow M - T")
        self.next_section("paso3")
        combinar("La fila de L: tres veces M, más T", 1, PASO3, r"L \leftarrow L + 3M + T")
        listo = texto("El núcleo quedó en la matriz identidad.", TAM_NOTA, TINTA_2).move_to([0, -2.55, 0])
        self.play(FadeIn(listo), run_time=0.5)
        self.wait(1.0)

        # ── 4. Leer los números ───────────────────────────────────────────
        self.next_section("leer")
        t = paso("Cada columna del residuo da un número")
        self.play(FadeTransform(self.titulo_actual, t), FadeOut(listo), FadeOut(e_nuc), FadeOut(e_res), run_time=0.7)
        col_u = SurroundingRectangle(VGroup(*[vals[i][3] for i in range(3)], cab[3]), color=NAVY, buff=0.12, stroke_width=3)
        col_g = SurroundingRectangle(VGroup(*[vals[i][4] for i in range(3)], cab[4]), color=NAVY, buff=0.12, stroke_width=3)
        re = formula(r"\Pi_1 = \frac{u}{\rho^{-1}\, d^{-1}\, \mu^{1}} = \frac{\rho u d}{\mu} = \mathrm{Re}", tam=TAM_TEXTO + 4)
        ar = formula(r"\Pi_2 = \frac{g\Delta\rho}{\rho^{-1}\, d^{-3}\, \mu^{2}} = \frac{\rho\, g\Delta\rho\, d^3}{\mu^2} = \mathrm{Ar}", tam=TAM_TEXTO + 4)
        VGroup(re, ar).arrange(DOWN, buff=0.3, aligned_edge=LEFT).move_to([0, -2.05, 0])
        self.play(Create(col_u), run_time=0.6)
        self.play(Write(re), run_time=1.2)
        self.wait(0.6)
        self.play(ReplacementTransform(col_u, col_g), run_time=0.6)
        self.play(Write(ar), run_time=1.2)
        self.play(FadeOut(col_g), run_time=0.4)
        assert ar.get_bottom()[1] > -3.1, ar.get_bottom()          # libre la franja de los controles
        assert re.get_top()[1] < pos(2, 0)[1] - 0.35, re.get_top()
        cierre = paso("Cinco magnitudes, dos números: Re = F(Ar)")
        self.play(FadeTransform(t, cierre), run_time=0.7)
        self.wait(2.5)
