"""Flujo másico contra flujo de embudo: el mismo silo con dos paredes, lleno
en capas, al abrir la salida.

Para el capítulo 8 del libro de operaciones unitarias (almacenamiento,
transporte y mezclado de sólidos). El silo es el del caso: 3,0 m de
diámetro, tolva cónica de 24° y salida de 300 mm, con 50 t de carbonato.
Con acero inoxidable (φw = 20°) la tolva queda dentro del flujo másico;
con acero al carbono (φw = 28°), fuera (Oko, en Rhodes y Seville, tablas
9.1 y 9.2, con el ángulo efectivo de BCR-116).

El movimiento es un modelo del libro, en un corte plano, con velocidades
ilustrativas. Flujo másico: el cilindro baja en bloque y el cono converge
hacia su vértice, más rápido en el eje que junto a la pared. Flujo de
embudo: el modelo cinemático, con la velocidad que baja de la salida como
una campana que se ensancha con la altura, v = q/√(4πBh)·exp(−x²/4Bh) y
u = −v·x/2h, con h la altura sobre la salida más h0; B y h0 hacen que el
canal tenga el ancho de la salida abajo y se abra hacia arriba. Las
franjas oscuras son capas de polvo teñido; cada franja la limitan dos
líneas de material que el modelo arrastra punto por punto.

    uv run publicar.py escenas/libro/flujo_masico_embudo.py FlujoMasicoEmbudo \
        --tema uniandes --fondo nieve --destino {libro}/figuras/almacenamiento-transporte-y-mezclado
"""
from estilo import *

# ── El silo del caso (m) ───────────────────────────────────────────────
R, r = 1.5, 0.15                          # radio del cilindro y de la salida
TH = np.radians(24.0)                     # semiángulo de la tolva
YT = (R - r) / np.tan(TH)                 # altura del cono: 3,03 m
YS = YT + 4.724                           # superficie del silo lleno (50 t)
YA = -r / np.tan(TH)                      # vértice virtual del cono
RHO_T = YT - YA

# ── El modelo (velocidades ilustrativas, m/s) ──────────────────────────
V0 = 0.375                                # flujo másico: el cilindro baja en bloque
Q = 0.5                                   # flujo de embudo: caudal del canal
B_K = 0.0044                              # m, ancho de difusión del canal
H0 = r * r / (4 * B_K)                    # el canal tiene el ancho de la salida abajo
VMAX = 6.0
T_FIN = 9.0                               # s de descarga
PASOS = 120                               # pasos del modelo por segundo
GUARDA = 60                               # estados guardados por segundo
FUERA = -0.8                              # bajo esta altura, el polvo ya salió


def ancho(y):
    return np.where(y >= YT, R, np.where(y >= 0, r + np.maximum(y, 0) * np.tan(TH), r))


def vel_masico(x, y):
    d = y - YA
    rho = np.hypot(x, d)
    a = np.minimum(1.0, np.arctan2(np.abs(x), d) / TH)
    s = np.minimum(VMAX, V0 * RHO_T / rho * (1.2 - 0.45 * a * a))
    cu, cv = -s * x / rho, s * d / rho
    w = np.clip((y - YT) / 0.6, 0, 1)
    w = w * w * (3 - 2 * w)
    u = (1 - w) * cu
    v = (1 - w) * cv + w * V0 * (1 - 0.06 * (x / R) ** 2)
    abajo = y < 0
    return np.where(abajo, 0.0, u), np.where(abajo, VMAX, v)


def vel_embudo(x, y):
    h = np.maximum(y, 0) + H0
    v = np.minimum(VMAX, Q / np.sqrt(4 * np.pi * B_K * h) * np.exp(-x * x / (4 * B_K * h)))
    u = -v * x / (2 * h)
    abajo = y < 0
    return np.where(abajo, 0.0, u), np.where(abajo, VMAX, v)


def lineas_iniciales():
    """La superficie y, debajo, las dos líneas de cada franja de polvo teñido."""
    alturas = [YS]
    y = YS - 0.55
    while y > 0.35:
        alturas += [y, y - 0.14]
        y -= 0.55
    out = []
    for y0 in alturas:
        w = float(ancho(np.array(y0)))
        n = max(9, int(2 * w / 0.05) + 1)
        out.append(np.column_stack([np.linspace(-w, w, n), np.full(n, y0)]))
    return out


def paso(ln, vel, dt):
    x, y = ln[:, 0], ln[:, 1]
    vivo = y > FUERA
    u1, v1 = vel(x, y)
    xm, ym = x + 0.5 * dt * u1, y - 0.5 * dt * v1
    u2, v2 = vel(xm, ym)
    x = np.where(vivo, x + dt * u2, x)
    y = np.where(vivo, y - dt * v2, y)
    lim = ancho(y)
    x = np.clip(x, -lim, lim)
    x[0], x[-1] = -lim[0], lim[-1]          # los extremos van por la pared
    ln = np.column_stack([x, y])
    # se agregan puntos donde la línea se estira
    seg = np.hypot(np.diff(ln[:, 0]), np.diff(ln[:, 1]))
    largo = np.where((seg > 0.06) & ((ln[:-1, 1] > FUERA) | (ln[1:, 1] > FUERA)))[0]
    if len(largo) and len(ln) < 2000:
        medios = 0.5 * (ln[largo] + ln[largo + 1])
        ln = np.insert(ln, largo + 1, medios, axis=0)
    return ln


def simular(vel):
    lineas = lineas_iniciales()
    estados = [[l.copy() for l in lineas]]
    sub = PASOS // GUARDA
    for _ in range(int(T_FIN * GUARDA)):
        for _ in range(sub):
            lineas = [paso(l, vel, 1.0 / PASOS) for l in lineas]
        estados.append([l.copy() for l in lineas])
    return estados


ESTADOS = {"masico": simular(vel_masico), "embudo": simular(vel_embudo)}


def sale(tipo, k):
    """¿Sigue saliendo polvo? En el de embudo, hasta que la superficie del canal pasa la salida."""
    if tipo == "masico":
        return True
    return float(ESTADOS[tipo][k][0][:, 1].min()) > 0


# ── El dibujo ───────────────────────────────────────────────────────────
ESC = 0.6                                 # unidades de Manim por metro
Y_SALIDA = 2.0 - YS * ESC                 # la salida, con la superficie en 2,0


class Silo:
    def __init__(self, cx, tipo):
        self.cx, self.tipo = cx, tipo
        self.p = lambda x, y: np.array([cx + ESC * x, Y_SALIDA + ESC * y, 0.0])
        alto = YS + 0.25
        contorno = [self.p(-R, alto), self.p(-R, YT), self.p(-r, 0), self.p(r, 0), self.p(R, YT), self.p(R, alto)]
        self.lleno = Polygon(*contorno[:5], self.p(R, alto), stroke_width=0, fill_color=REJILLA, fill_opacity=1)
        self.vacio = VMobject(stroke_width=0, fill_color=FONDO, fill_opacity=1)
        self.borde = VMobject(stroke_color=TINTA_3, stroke_width=2.5)        # la superficie libre
        self.franjas = VGroup(*[VMobject(stroke_width=0, fill_color=TEAL, fill_opacity=1)
                                for _ in range((len(ESTADOS[tipo][0]) - 1) // 2)])
        self.pared = VMobject(stroke_color=TINTA, stroke_width=5).set_points_as_corners(contorno)
        self.chorro = Rectangle(width=2 * r * ESC, height=0.4, stroke_width=0, fill_color=REJILLA, fill_opacity=1)
        self.chorro.next_to(self.p(0, 0), DOWN, buff=0)
        self.chorro.set_opacity(0)
        self.grupo = VGroup(self.lleno, self.vacio, self.franjas, self.borde, self.chorro, self.pared)

    def puntos(self, ln):
        x, y = ln[:, 0].copy(), ln[:, 1].copy()
        bajo = y < 0                                  # lo que ya salió se pega a la salida y no se ve
        y[bajo] = 0
        x[bajo] = np.clip(x[bajo], -r, r)
        return np.column_stack([self.cx + ESC * x, Y_SALIDA + ESC * y, np.zeros_like(x)])

    def dibujar(self, k):
        est = ESTADOS[self.tipo][k]
        sup = self.puntos(est[0])
        tapa = [self.p(R, YS + 0.25), self.p(-R, YS + 0.25)]
        self.vacio.set_points_as_corners([*sup, *tapa, sup[0]])
        self.borde.set_points_as_corners(sup)
        for j, f in enumerate(self.franjas):
            a, b = self.puntos(est[2 * j + 1]), self.puntos(est[2 * j + 2])
            f.set_points_as_corners([*a, *b[::-1], a[0]])
        self.chorro.set_opacity(1 if (k > 0 and sale(self.tipo, k)) else 0)


def nota(lineas, tam=TAM_NOTA, color=None, alinear=LEFT):
    g = VGroup(*[texto(s, tam=tam, color=color or TINTA_2) for s in lineas])
    return g.arrange(DOWN, aligned_edge=alinear, buff=0.12)


class FlujoMasicoEmbudo(Scene):
    def construct(self):
        t = ValueTracker(0.0)
        izq, der = Silo(-2.0, "masico"), Silo(2.0, "embudo")
        for s in (izq, der):
            s.dibujar(0)
            s.grupo.add_updater(lambda m, s=s: s.dibujar(min(int(round(t.get_value() * GUARDA)), int(T_FIN * GUARDA))))

        titulo = rotulo("El mismo silo y la misma tolva de 24°").to_corner(UL, buff=0.35)
        def etiqueta(s, linea1, linea2):
            g = VGroup(texto(linea1, tam=TAM_TEXTO), texto(linea2, tam=TAM_NOTA, color=TINTA_2)).arrange(DOWN, buff=0.1)
            return g.next_to(s.p(0, YS + 0.25), UP, buff=0.18)
        e_izq = etiqueta(izq, "Acero inoxidable", "fricción de 20°")
        e_der = etiqueta(der, "Acero al carbono", "fricción de 28°")

        # ── 1. El silo lleno en capas ───────────────────────────────────
        self.next_section("capas")
        self.add(titulo)
        self.play(Create(izq.pared), Create(der.pared), FadeIn(e_izq), FadeIn(e_der), run_time=1.2)
        self.play(FadeIn(izq.lleno), FadeIn(der.lleno), FadeIn(izq.vacio), FadeIn(der.vacio), FadeIn(izq.borde), FadeIn(der.borde), run_time=0.6)
        self.play(LaggedStart(*[FadeIn(f) for f in [*reversed(izq.franjas), *reversed(der.franjas)]],
                              lag_ratio=0.04), run_time=1.6)
        self.add(izq.chorro, der.chorro)
        n_capas = nota(["Las franjas oscuras son", "polvo teñido: marcan", "las capas del llenado"], alinear=RIGHT).next_to(izq.p(-R, YT + 2.2), LEFT, buff=0.35)
        self.play(FadeIn(n_capas), run_time=0.6)
        self.wait(0.6)

        # ── 2. Se abre la salida ────────────────────────────────────────
        self.next_section("descarga")
        self.add(izq.grupo, der.grupo)
        titulo2 = rotulo("Se abre la salida").to_corner(UL, buff=0.35)
        self.play(FadeOut(n_capas), Transform(titulo, titulo2), run_time=0.5)
        n1 = nota(["Todo el lecho baja.", "En el cilindro, las", "capas siguen planas"], alinear=RIGHT).next_to(izq.p(-R, YT + 3.0), LEFT, buff=0.35)
        n2 = nota(["En el cono se curvan", "hacia la salida"], alinear=RIGHT).next_to(izq.p(-R, YT * 0.45), LEFT, buff=0.35)
        n3 = nota(["Solo baja un canal", "sobre la salida: lo de", "arriba sale primero"]).next_to(der.p(R, YT + 3.0), RIGHT, buff=0.35)
        n4 = nota(["Junto a la pared,", "el polvo no se mueve"]).next_to(der.p(R, YT * 0.45), RIGHT, buff=0.35)
        self.play(t.animate.set_value(3.0), FadeIn(n1, run_time=0.8), FadeIn(n3, run_time=0.8), run_time=3.0, rate_func=linear)
        self.play(t.animate.set_value(T_FIN), FadeIn(n2, run_time=0.8), FadeIn(n4, run_time=0.8), run_time=T_FIN - 3.0, rate_func=linear)
        self.wait(0.6)

        # ── 3. Los dos patrones ─────────────────────────────────────────
        self.next_section("patrones")
        for s in (izq, der):
            s.grupo.clear_updaters()
        titulo3 = rotulo("Flujo másico y flujo de embudo").to_corner(UL, buff=0.35)
        p_izq = VGroup(texto("Flujo másico", tam=TAM_TEXTO, color=ACERO_OSC),
                       nota(["lo primero que entra", "es lo primero que sale"], alinear=RIGHT)).arrange(DOWN, aligned_edge=RIGHT, buff=0.12)
        p_izq.next_to(izq.p(-R, YT * 0.45), LEFT, buff=0.35).align_to(n2, RIGHT)
        p_der = VGroup(texto("Flujo de embudo", tam=TAM_TEXTO, color=ACERO_OSC),
                       nota(["el canal se vacía y", "queda como ratonera"])).arrange(DOWN, aligned_edge=LEFT, buff=0.12)
        p_der.next_to(der.p(R, YT * 0.45), RIGHT, buff=0.35).align_to(n4, LEFT)
        self.play(Transform(titulo, titulo3), FadeOut(n2), FadeOut(n4), run_time=0.5)
        self.play(FadeIn(p_izq), FadeIn(p_der), run_time=0.8)
        self.wait(2.0)
        self.wait(0.6)
