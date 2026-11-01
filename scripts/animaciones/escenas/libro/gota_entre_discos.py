"""La gota entre dos discos: el aceite corre por el espacio entre dos discos de una purificadora, del borde de la pila
hacia el eje, y cada gota de agua se mueve hacia la cara de abajo del disco de arriba. Si la toca antes del radio
interior se queda; si no, sale con el aceite. Tres canales de la pila, uno por tamaño de gota: la de 2 µm, la más chica
del agua libre del caso, toca el disco apenas entra; la de 0,19 µm se queda si entra en la mitad de arriba del canal;
la de 0,12 µm, solo si entra muy cerca del disco. Al final, la fracción del espesor que se captura en cada canal, Σ y
la curva de recuperación por tamaño.

Para el capítulo 19 del libro de operaciones unitarias (Separación centrífuga), sección «Cuánto tanque reemplaza». Los
números se leen de lo que escribe herramientas/centrifugas.py --json del libro: la purificadora del caso (33 discos,
radios de 52 y 30 mm, 50° con la horizontal, 0,5 mm entre discos, 10 000 r/min, en datos.js) y el aceite a 20 °C
(844,9 kg/m³ y 0,929 mPa·s; Δρ = 153,3 kg/m³) con 24,6 L/h (caso.json). La trayectoria es la del ej. 11.2 de Coulson y
Richardson (Chhabra y Basavaraj, 2019, pp. 636–638), la misma que integra trayectoria_discos() del modelo: flujo pistón
en los N − 1 canales, v = Q/[(N − 1)·2πr·a]; la gota cruza el canal a u·sen α, con u = u_g·ω²r/g (ec. de la velocidad
en el campo), y se desprecia lo que la gota se atrasa a lo largo del canal. Integrada, la altura que gana la gota es
y/a = (u_g·Σ/Q)·(r_e³ − r³)/(r_e³ − r_i³), con Σ = 2πω²(N − 1)(r_e³ − r_i³)·tan α/(3g) = 1015 m² (la ecuación de discos
del capítulo), así que la fracción del espesor que se captura es u_g·Σ/Q y la gota del 50 % es la de Q = 2·u_g·Σ:
0,19 µm. La posición en el tiempo sale de la misma velocidad del aceite: r² = r_e² − t·Q·cos α/[(N − 1)·π·a], y el
aceite tarda 20,7 s en cruzar el canal (cálculo del libro con esa ecuación; el capítulo no lo da). Con la eficiencia de
las de discos del Perry, 55 %, quedan 558 m² y el corte del caso, 0,26 µm (el del capítulo).

Lo que es del dibujo: el espesor del canal va 9 veces más ancho que el largo (a lo largo del canal, no del radio); los
discos, más delgados de lo que son; las gotas, de un tamaño que se vea (una de 2 µm en un canal de 0,5 mm no se vería),
y la velocidad con que el agua resbala hacia afuera por la cara de abajo del disco (4 mm/s), que el modelo no da. El
primer medio segundo va a un cuarto del tiempo real, para que se vea a la gota de 2 µm tocar el disco, y el resto, a
unas 2,5 veces; el reloj marca siempre el tiempo real. El corte de la pila, abajo a la derecha, va con los radios a escala y el espaciado
exagerado.

El último cuadro (el póster) lleva texto en español: el título, la ecuación de Σ, dos líneas de lectura, los rótulos
de los canales y de la gráfica y el corte de la pila.

    uv run publicar.py escenas/libro/gota_entre_discos.py GotaEntreDiscos \
        --tema uniandes --fondo nieve --destino {libro}/figuras/separacion-centrifuga

La edición impresa en inglés lleva el último cuadro quieto, con los mismos números y punto decimal: la variable
ANIM_IDIOMA=en cambia los textos y el separador decimal (por defecto es «es», y el video en español no cambia). Desde
scripts/animaciones, con -s (solo el último cuadro) y el doble de resolución para el papel:

    ANIM_TEMA=uniandes ANIM_FONDO=nieve ANIM_IDIOMA=en PYTHONPATH=. uv run python -m manim render \
        escenas/libro/gota_entre_discos.py GotaEntreDiscos -s -r 3840,2160
"""
import json
import math
import os

import paleta_libro
from estilo import *
from paleta_libro import *   # los colores salen de la paleta del libro (libro/estilo/paleta.json)

# El idioma de los textos: «es» (el video del libro web) o «en» (el cuadro quieto de la edición impresa en inglés)
IDIOMA = os.environ.get("ANIM_IDIOMA", "es")
if IDIOMA not in ("es", "en"):
    raise ValueError(f"ANIM_IDIOMA debe ser es o en, no {IDIOMA!r}")
EN = IDIOMA == "en"


def tr(es, en):
    """El texto en el idioma de la escena."""
    return en if EN else es


if EN:
    def num(x, dec=1):
        """En inglés, con punto decimal: num(38.66) → '38.7'."""
        return f"{x:.{dec}f}"
PCT = "%" if EN else " %"                          # 50 % en español, 50% en inglés

ACEITE = mat("aceite")
GOTA, PELICULA = mat("agua", "oscuro"), mat("agua", "medio")
DISCO, DISCO_OSC = mat("metal"), mat("metal", "oscuro")
FLUJO = color("azul")                              # el flujo, como en los cortes

# ── el caso, leído de herramientas/centrifugas.py --json ────────────────
FIG = paleta_libro.RUTA.parents[1] / "figuras" / "separacion-centrifuga"
_CASO = json.loads((FIG / "caso.json").read_text(encoding="utf-8"))["caso_a"]
_JS = (FIG / "datos.js").read_text(encoding="utf-8")
PURIF = json.loads(_JS[_JS.index("{"):_JS.rindex(";")])["purif"]

G = 9.80665
N, RE, RI = PURIF["N"], PURIF["r_ext"], PURIF["r_int"]
ALFA = math.radians(PURIF["alfa_h"])
RPM, ESP, EF = PURIF["rpm"], PURIF["a"], PURIF["ef"]
F20 = _CASO["fluidos"]["20"]
MU, DRHO = F20["mu_aceite"], F20["drho"]
Q = _CASO["ops"]["20"]["Q"]                        # m³/s: 24,6 L/h
CANALES = N - 1
W = RPM * 2 * math.pi / 60

SIGMA = 2 * math.pi * W ** 2 * CANALES * (RE ** 3 - RI ** 3) * math.tan(ALFA) / (3 * G)
SIGMA_EF = SIGMA * EF
assert abs(SIGMA - _CASO["purificadora"]["sigma"]) < 1e-9 * SIGMA


def ug(d):
    """Velocidad de la gota con 1 g, Stokes."""
    return G * DRHO * d ** 2 / (18 * MU)


def corte(sigma):
    """El tamaño del 50 %, con Q = 2 u_g Σ."""
    return math.sqrt(18 * MU * Q / (2 * sigma * G * DRHO))


D50, D50_EF = corte(SIGMA), corte(SIGMA_EF)
assert abs(D50_EF * 1e6 - _CASO["purificadora"]["corte_20"]) < 1e-9


def fraccion(d):
    """Lo que la gota cruza del espesor en todo el canal, u_g Σ/Q (más de 1: la cruza antes del final)."""
    return ug(d) * SIGMA / Q


def recuperacion(d, sigma):
    return min(1.0, ug(d) * sigma / Q)


def v_aceite(r):
    return Q / (CANALES * 2 * math.pi * r * ESP)


K_T = Q * math.cos(ALFA) / (CANALES * math.pi * ESP)   # r² = r_e² − K_T·t
T_CANAL = (RE ** 2 - RI ** 2) / K_T                     # s: 20,7


def r_de_t(t):
    return math.sqrt(max(RE ** 2 - K_T * t, 0.0))


def t_de_r(r):
    return (RE ** 2 - r ** 2) / K_T


def avance(r):
    """(r_e³ − r³)/(r_e³ − r_i³): de 0 en la entrada a 1 en el radio interior."""
    return (RE ** 3 - r ** 3) / (RE ** 3 - RI ** 3)


def r_de_avance(a):
    return (RE ** 3 - a * (RE ** 3 - RI ** 3)) ** (1 / 3)


# ── el dibujo ───────────────────────────────────────────────────────────
X0, X1 = -5.35, 2.35                                   # r_e a la izquierda, r_i a la derecha
XL = X1 - X0
EXAGERA = 9
H = EXAGERA * XL * math.cos(ALFA) / (RE - RI) * ESP    # alto del canal en pantalla: 1,12
DT = 0.13                                              # espesor del disco en pantalla (del dibujo)
Y_TOPE = 1.45
TECHO = [Y_TOPE - DT - j * (H + DT) for j in range(3)]  # la cara de abajo del disco de arriba de cada canal
PISO = [t - H for t in TECHO]
R_GOTA = [0.085, 0.07, 0.06]                           # del dibujo
GOTAS = [2e-6, D50, 0.12e-6]
Y0 = [(k + 0.5) / 6 for k in range(6)]                 # alturas de entrada, como fracción del espesor
X_SAL = X1 + 0.2
R_SAL = RI - (X_SAL - X1) / XL * (RE - RI)             # donde queda la gota que salió
V_RESBALA = 4e-3                                       # m/s: lo que resbala la gota por el disco (del dibujo)


def xr(r):
    return X0 + (RE - r) / (RE - RI) * XL


def yc(j, y):
    return PISO[j] + y * H


def destino(d, y0):
    """(captura, r): si la gota toca el disco de arriba, el radio donde lo toca; si no, None."""
    f = fraccion(d)
    if y0 + f >= 1.0:
        return True, r_de_avance((1.0 - y0) / f)
    return False, None


def punto(j, d, y0, t):
    """Dónde está la gota a los t segundos, en pantalla; None si ya resbaló fuera de la pila."""
    f = fraccion(d)
    se_queda, rc = destino(d, y0)
    r = r_de_t(min(t, t_de_r(R_SAL)))
    if se_queda and r <= rc:                           # tocó el disco: resbala hacia afuera
        r_res = rc + V_RESBALA * (t - t_de_r(rc))
        if r_res >= RE:
            return None
        return np.array([xr(r_res), TECHO[j] - R_GOTA[j], 0.0])
    if r < RI:                                         # ya salió de la pila
        return np.array([xr(r), yc(j, y0 + f), 0.0])
    y = y0 + f * avance(r)
    return np.array([xr(r), min(yc(j, y), TECHO[j] - R_GOTA[j]), 0.0])


def camino(j, d, y0, t, n=90):
    """La trayectoria hasta los t segundos."""
    f = fraccion(d)
    se_queda, rc = destino(d, y0)
    r_t = r_de_t(min(t, t_de_r(R_SAL)))
    r_fin = max(r_t, rc) if se_queda else max(r_t, RI)
    pts = []
    for k in range(n + 1):
        r = RE - (RE - r_fin) * k / n
        pts.append([xr(r), yc(j, min(1.0, y0 + f * avance(r))), 0.0])
    if not se_queda and r_t < RI:
        pts.append([xr(r_t), yc(j, y0 + f), 0.0])
    return pts


T_LENTO = 0.5                                          # s reales que se muestran despacio al comienzo
# el reloj corre hasta que la última gota sale de la pila o termina de resbalar
TT_FIN = max([t_de_r(R_SAL)] + [t_de_r(destino(d, y0)[1]) + (RE - destino(d, y0)[1]) / V_RESBALA
                                for d in GOTAS for y0 in Y0 if destino(d, y0)[0]]) + 0.4


class GotaEntreDiscos(Scene):
    def construct(self):
        tt = ValueTracker(0.0)                         # tiempo real en el canal, s

        titulo = rotulo(tr("El canal entre dos discos", "The channel between two discs")).to_corner(UL, buff=0.35)

        def leyenda(*lineas):
            g = VGroup(*[l if isinstance(l, Mobject) else marcado(l) for l in lineas])
            return g.arrange(DOWN, buff=0.1, aligned_edge=LEFT).next_to(titulo, DOWN, 0.15, aligned_edge=LEFT)

        # ── los tres canales, con sus cuatro discos ─────────────────────
        aceite = VGroup(*[Rectangle(width=XL, height=H, stroke_width=0, fill_color=ACEITE, fill_opacity=1)
                          .move_to([(X0 + X1) / 2, (TECHO[j] + PISO[j]) / 2, 0]) for j in range(3)])
        discos = VGroup()
        for k in range(4):
            arriba = Y_TOPE - k * (H + DT)
            discos.add(Rectangle(width=XL + 0.3, height=DT, stroke_color=DISCO_OSC, stroke_width=2,
                                 fill_color=DISCO, fill_opacity=1)
                       .move_to([(X0 + X1) / 2, arriba - DT / 2, 0]))
        discos.set_z_index(4)
        r_disco = texto(tr("disco", "disc"), TAM_NOTA, TINTA_2).next_to(discos[0], LEFT, 0.15)

        # el eje de los radios, abajo
        y_eje = PISO[2] - DT - 0.16
        eje_r = VGroup(Line([X0, y_eje, 0], [X1, y_eje, 0], color=TINTA_2, stroke_width=3))
        for r_mm in (52, 48, 44, 40, 36, 32, 30):
            x = xr(r_mm / 1000)
            eje_r.add(Line([x, y_eje, 0], [x, y_eje - 0.08, 0], color=TINTA_2, stroke_width=3))
            eje_r.add(texto(str(r_mm), TAM_NOTA, TINTA_2).next_to([x, y_eje - 0.08, 0], DOWN, 0.1))
        eje_r.add(texto(tr("radio (mm)", "radius (mm)"), TAM_NOTA, TINTA_2).next_to(eje_r, DOWN, 0.08).align_to([X0 - 0.15, 0, 0], LEFT))
        eje_r.add(texto(tr(f"espesor exagerado {EXAGERA} veces", f"thickness exaggerated {EXAGERA} times"), TAM_NOTA, TINTA_2)
                  .match_y(eje_r[-1]).align_to([X1 + 0.15, 0, 0], RIGHT))

        # el espesor, a la derecha del canal de arriba
        cota = VGroup(Line([X1 + 0.32, PISO[0], 0], [X1 + 0.32, TECHO[0], 0], color=TINTA_2, stroke_width=3),
                      Line([X1 + 0.24, PISO[0], 0], [X1 + 0.4, PISO[0], 0], color=TINTA_2, stroke_width=3),
                      Line([X1 + 0.24, TECHO[0], 0], [X1 + 0.4, TECHO[0], 0], color=TINTA_2, stroke_width=3))
        cota.add(texto(f"{num(ESP * 1000, 1)} mm", TAM_NOTA, TINTA_2).rotate(PI / 2)
                 .next_to(cota[0], RIGHT, 0.1))

        # el perfil del aceite: flujo pistón, más rápido hacia el eje
        perfil = VGroup()
        for j in range(3):
            for r_mm in (50.5, 41.5, 32.5):
                r = r_mm / 1000
                x, largo = xr(r), 0.4 * v_aceite(r) * 1000      # 0,4 de pantalla por mm/s
                for y in (0.2, 0.5, 0.8):
                    perfil.add(Arrow([x, yc(j, y), 0], [x + largo, yc(j, y), 0], buff=0, color=FLUJO,
                                     stroke_width=4, max_tip_length_to_length_ratio=0.22,
                                     max_stroke_width_to_length_ratio=8))
                perfil.add(Line([x, yc(j, 0.08), 0], [x, yc(j, 0.92), 0], color=FLUJO, stroke_width=2))
                perfil.add(DashedLine([x + largo, yc(j, 0.08), 0], [x + largo, yc(j, 0.92), 0], color=FLUJO,
                                      stroke_width=2, dash_length=0.06))
        r_aceite = texto(tr("aceite", "oil"), TAM_NOTA, FLUJO).move_to([xr(0.046), yc(1, 0.5), 0])

        corte_pila = corte_de_la_pila()

        # 1 · el canal y el aceite
        self.next_section("canal")
        nota = leyenda(*tr((
            f"Purificadora del caso: {N} discos de {num(2 * RE * 1000, 0)} mm a 10 000 r/min, "
            f"a {PURIF['alfa_h']:.0f}° y separados {num(ESP * 1000, 1)} mm.",
            f"El aceite, {num(Q * 3.6e6, 1)} L/h en {CANALES} canales, corre hacia el eje en flujo pistón, "
            "como supone Σ:",
            f"{num(v_aceite(RE) * 1000, 1)} mm/s al entrar y {num(v_aceite(RI) * 1000, 1)} mm/s al salir, "
            f"porque el paso se angosta. Tarda {num(T_CANAL, 1)} s."), (
            f"The case purifier: {N} discs of {num(2 * RE * 1000, 0)} mm at 10 000 r/min, "
            f"at {PURIF['alfa_h']:.0f}° and {num(ESP * 1000, 1)} mm apart.",
            f"The oil, {num(Q * 3.6e6, 1)} L/h in {CANALES} channels, flows toward the axis in plug flow, "
            "as Σ assumes:",
            f"{num(v_aceite(RE) * 1000, 1)} mm/s at the inlet and {num(v_aceite(RI) * 1000, 1)} mm/s at the outlet, "
            f"because the passage narrows. It takes {num(T_CANAL, 1)} s.")))
        self.add(titulo, nota)
        self.play(FadeIn(aceite), Create(discos), FadeIn(r_disco), run_time=1.2)
        self.play(FadeIn(eje_r), FadeIn(cota), FadeIn(corte_pila), run_time=0.8)
        self.play(LaggedStart(*[GrowArrow(a) if isinstance(a, Arrow) else Create(a) for a in perfil],
                              lag_ratio=0.01), FadeIn(r_aceite), run_time=1.6)
        self.wait(1.2)
        self.wait(0.6)

        # 2 · tres tamaños de gota
        self.next_section("gotas")
        t2 = rotulo(tr("Tres tamaños de gota", "Three drop sizes")).move_to(titulo, aligned_edge=LEFT)
        n2 = leyenda(*tr((
            f"Cada gota se aleja del eje, con {num(W ** 2 * RE / G, 0)} g en la entrada, y cruza hacia el disco de arriba.",
            f"Si lo toca antes de {num(RI * 1000, 0)} mm, se queda y resbala hacia afuera; si no, sale con el aceite.",
            f"Arriba, 2 µm, la gota más chica del agua libre; en el medio, la del 50 %; abajo, "
            f"{num(GOTAS[2] * 1e6, 2)} µm."), (
            f"Each drop moves away from the axis, with {num(W ** 2 * RE / G, 0)} g at the inlet, toward the disc above.",
            f"If it touches that disc before {num(RI * 1000, 0)} mm, it stays and slides outward; if not, it leaves with the oil.",
            f"Top, 2 µm, the smallest drop of the free water; middle, the 50% drop; bottom, "
            f"{num(GOTAS[2] * 1e6, 2)} µm.")))
        tamanos = VGroup(*[texto(f"{num(d * 1e6, 2 if d < 1e-6 else 0)} µm", TAM_TEXTO, TINTA, peso=SEMIBOLD)
                           .next_to([X0 - 0.15, yc(j, 0.62), 0], LEFT, 0.12) for j, d in enumerate(GOTAS)])

        def trayectorias():
            g = VGroup()
            t = tt.get_value()
            for j, d in enumerate(GOTAS):
                for y0 in Y0:
                    se_queda, _ = destino(d, y0)
                    g.add(VMobject(color=OLIVA if se_queda else AMBAR, stroke_width=3.5)
                          .set_points_as_corners(camino(j, d, y0, t)))
            return g.set_z_index(2)

        def gotas():
            g = VGroup()
            t = tt.get_value()
            for j, d in enumerate(GOTAS):
                for y0 in Y0:
                    q = punto(j, d, y0, t)
                    if q is not None:
                        g.add(Circle(radius=R_GOTA[j], stroke_color=TINTA, stroke_width=2, fill_color=GOTA,
                                     fill_opacity=1).move_to(q))
            return g.set_z_index(3)

        def peliculas():
            g = VGroup()
            t = tt.get_value()
            for j, d in enumerate(GOTAS):
                rs = [destino(d, y0)[1] for y0 in Y0 if destino(d, y0)[0] and r_de_t(t) <= destino(d, y0)[1]]
                if rs:
                    x_fin = xr(min(rs))
                    g.add(Rectangle(width=x_fin - X0 + 0.02, height=0.06, stroke_width=0, fill_color=PELICULA,
                                    fill_opacity=1).move_to([(X0 + x_fin) / 2, TECHO[j] - 0.03, 0]))
            return g.set_z_index(1)

        g_tray, g_gotas, g_pel = always_redraw(trayectorias), always_redraw(gotas), always_redraw(peliculas)

        # la clave y el reloj, arriba a la derecha (donde después va la gráfica)
        XK = 3.4

        def muestra(c, s, rayas=False):
            l = (DashedLine if rayas else Line)([0, 0, 0], [0.5, 0, 0], color=c, stroke_width=4)
            return VGroup(l, texto(s, TAM_NOTA, TINTA_2).next_to(l, RIGHT, 0.15))

        clave = VGroup(muestra(OLIVA, tr("llega al disco", "reaches the disc")),
                       muestra(AMBAR, tr("sale con el aceite", "leaves with the oil"))) \
            .arrange(DOWN, buff=0.16, aligned_edge=LEFT).move_to([XK, 1.3, 0], aligned_edge=UL)
        reloj = always_redraw(lambda: texto(f"t = {num(min(tt.get_value(), TT_FIN), 1)} s", TAM_TEXTO, TINTA)
                              .move_to([XK, -0.05, 0], aligned_edge=UL))

        self.play(ReplacementTransform(titulo, t2), ReplacementTransform(nota, n2), FadeOut(perfil),
                  FadeOut(r_aceite), run_time=0.8)
        self.add(g_pel, g_tray)
        self.play(FadeIn(tamanos), FadeIn(clave), FadeIn(g_gotas), FadeIn(reloj), run_time=0.8)
        # el primer medio segundo, despacio: las de 2 µm tocan el disco y resbalan fuera en 0,4 s
        self.play(tt.animate.set_value(T_LENTO), run_time=2.0, rate_func=linear)
        self.play(tt.animate.set_value(TT_FIN), run_time=8.5, rate_func=linear)

        # el límite del 50 %: entra a la mitad y toca el disco justo en el radio interior
        pts_lim = [[xr(r), yc(1, 0.5 + 0.5 * avance(r)), 0] for r in np.linspace(RE, RI, 80)]
        limite = DashedVMobject(VMobject(color=TINTA, stroke_width=3).set_points_as_corners(pts_lim),
                                num_dashes=40).set_z_index(2)
        clave_lim = muestra(TINTA, tr("el límite del 50 %", "the 50% limit"), rayas=True).next_to(clave, DOWN, 0.16,
                                                                                       aligned_edge=LEFT)
        se_queda_2, r_2 = destino(GOTAS[0], 0.0)
        r_grande = VGroup(texto(tr("la gota más chica del agua libre toca el disco",
                                   "the smallest free-water drop touches the disc"), TAM_NOTA, TINTA_2),
                          texto(tr(f"en los primeros {num((RE - r_2) / math.cos(ALFA) * 1000, 1)} mm del canal, "
                                   f"en {num(t_de_r(r_2), 1)} s",
                                   f"in the first {num((RE - r_2) / math.cos(ALFA) * 1000, 1)} mm of the channel, "
                                   f"in {num(t_de_r(r_2), 1)} s"), TAM_NOTA, TINTA_2)) \
            .arrange(DOWN, buff=0.08).move_to([(X0 + X1) / 2, yc(0, 0.5), 0])
        self.play(Create(limite), FadeIn(clave_lim), FadeIn(r_grande), run_time=1.2)
        self.wait(1.0)
        self.wait(0.6)

        # 3 · la fracción que se captura, Σ y la recuperación
        self.next_section("sigma")
        t3 = rotulo(tr("Lo que se captura y Σ", "What is captured, and Σ")).move_to(t2, aligned_edge=LEFT)
        f_sigma = MathTex(r"\Sigma = 2\pi\,\omega^2 (N-1)\left(r_e^3 - r_i^3\right)\tan\alpha\,/\,(3g) = ",
                          f"{SIGMA:.0f}" + r"\ \mathrm{m^2}", font_size=TAM_TEXTO, color=TINTA)
        f_sigma[1].set_color(FLUJO)
        n3 = leyenda(f_sigma, *tr((
            f"El canal captura u<sub>g</sub>Σ/Q de su espesor; la gota del 50 % es la de Q = 2u<sub>g</sub>Σ: "
            f"{num(D50 * 1e6, 2)} µm.",
            f"Con la eficiencia de {EF * 100:.0f} % del Perry quedan "
            f"<span foreground='{OLIVA}'>{SIGMA_EF:.0f} m²</span> y el corte del caso, {num(D50_EF * 1e6, 2)} µm."), (
            f"The channel captures u<sub>g</sub>Σ/Q of its thickness; Q = 2u<sub>g</sub>Σ gives the 50% drop: "
            f"{num(D50 * 1e6, 2)} µm.",
            f"With Perry’s {EF * 100:.0f}% efficiency, "
            f"<span foreground='{OLIVA}'>{SIGMA_EF:.0f} m²</span> remain, and the case cuts at {num(D50_EF * 1e6, 2)} µm.")))

        zonas, limites, barras, pcts = VGroup(), VGroup(), VGroup(), VGroup()
        for j, d in enumerate(GOTAS):
            f = fraccion(d)
            y_in = max(0.0, 1.0 - f)
            r_toca = r_de_avance((1.0 - y_in) / f)
            rs = np.linspace(RE, r_toca, 80)
            curva = [[xr(r), yc(j, min(1.0, y_in + f * avance(r))), 0] for r in rs]
            zonas.add(Polygon(*curva, [xr(r_toca), TECHO[j], 0], [X0, TECHO[j], 0], stroke_width=0,
                              fill_color=AMARILLO, fill_opacity=0.55).set_z_index(0.5))
            if j == 2:
                limites.add(DashedVMobject(VMobject(color=TINTA, stroke_width=3).set_points_as_corners(curva),
                                           num_dashes=40).set_z_index(2))
            barras.add(Line([X0 - 0.07, yc(j, y_in), 0], [X0 - 0.07, TECHO[j], 0], color=OLIVA, stroke_width=7))
            pcts.add(texto(f"{100 * min(1.0, f):.0f}{PCT}", TAM_TEXTO, OLIVA, peso=SEMIBOLD)
                     .next_to(tamanos[j], DOWN, 0.08, aligned_edge=RIGHT))

        grafica = grafica_recuperacion()
        self.play(ReplacementTransform(t2, t3), ReplacementTransform(n2, n3), FadeOut(clave), FadeOut(clave_lim),
                  FadeOut(reloj), run_time=0.8)
        self.play(FadeIn(zonas), Create(limites), Create(barras), FadeIn(pcts), run_time=1.4)
        self.play(FadeIn(grafica[0]), run_time=0.6)
        self.play(Create(grafica[1][0]), FadeIn(grafica[1][1]), run_time=1.2)
        self.play(FadeIn(grafica[2]), run_time=0.8)
        self.wait(2.0)
        self.wait(0.6)


# ── piezas ──────────────────────────────────────────────────────────────
def marcado(s, tam=TAM_NOTA, color=None):
    """Texto en Barlow con marcas de Pango (<sub>, <span foreground=...>)."""
    return MarkupText(s, font=LETRA, font_size=tam, color=color or TINTA_2, weight=MEDIUM)


def corte_de_la_pila():
    """Media sección de la pila con los radios a escala: el eje, cuatro discos a 50° y el canal resaltado."""
    XA, K = 3.45, 0.046                                # el eje y la escala (pantalla por mm)
    YB, P = -2.85, 0.2                                 # el pie del disco de abajo y el paso entre discos
    sube = (RE - RI) * 1000 * math.tan(ALFA) * K
    xe, xi = XA + RE * 1000 * K, XA + RI * 1000 * K
    lineas = [((xe, YB + k * P), (xi, YB + k * P + sube)) for k in range(4)]
    g = VGroup()
    for k in range(3):
        (a0, a1), (b0, b1) = lineas[k], lineas[k + 1]
        g.add(Polygon([*a0, 0], [*a1, 0], [*b1, 0], [*b0, 0], stroke_width=0,
                      fill_color=AMARILLO if k == 1 else ACEITE, fill_opacity=1))
    for (p0, p1) in lineas:
        g.add(Line([*p0, 0], [*p1, 0], color=DISCO_OSC, stroke_width=4))
    eje = DashedLine([XA, YB - 0.2, 0], [XA, YB + 3 * P + sube + 0.1, 0], color=TINTA_2, stroke_width=2,
                     dash_length=0.1)
    g.add(eje, texto(tr("eje", "axis"), TAM_NOTA, TINTA_2).next_to(eje, UP, 0.06))
    # el ángulo con la horizontal, en el pie del disco de abajo
    (p0, _) = lineas[0]
    g.add(DashedLine([p0[0] - 0.6, p0[1], 0], [p0[0], p0[1], 0], color=TINTA_3, stroke_width=2, dash_length=0.05))
    g.add(Arc(radius=0.42, start_angle=PI - ALFA, angle=ALFA, arc_center=[*p0, 0], color=TINTA_2, stroke_width=2.5))
    g.add(texto(f"{PURIF['alfa_h']:.0f}°", TAM_NOTA, TINTA_2).next_to([p0[0] - 0.42, p0[1], 0], LEFT, 0.08)
          .shift(UP * 0.12))
    # los radios
    g.add(texto(f"{num(RI * 1000, 0)} mm", TAM_NOTA, TINTA_2).next_to([xi, lineas[3][1][1], 0], RIGHT, 0.1)
          .shift(UP * 0.12))
    g.add(texto(f"{num(RE * 1000, 0)} mm", TAM_NOTA, TINTA_2).next_to([xe, YB, 0], RIGHT, 0.12))
    # el aceite sube por el canal hacia el eje
    (a0, a1), (b0, b1) = lineas[1], lineas[2]
    m0 = np.array([(a0[0] + b0[0]) / 2, (a0[1] + b0[1]) / 2, 0])
    m1 = np.array([(a1[0] + b1[0]) / 2, (a1[1] + b1[1]) / 2, 0])
    g.add(Arrow(m0 + 0.15 * (m1 - m0), m0 + 0.85 * (m1 - m0), buff=0, color=FLUJO, stroke_width=4,
                max_tip_length_to_length_ratio=0.2))
    g.add(texto(tr("el canal", "channel"), TAM_NOTA, TINTA_2).next_to([xi, (a1[1] + b1[1]) / 2 - 0.25, 0], LEFT, 0.12))
    return g


def grafica_recuperacion():
    """La recuperación por tamaño, que es la fracción del espesor que se captura: u_g Σ/Q hasta 1."""
    D_MAX, ANCHO, ALTO = 0.5e-6, 2.8, 1.05
    O = np.array([3.95, 0.08, 0.0])

    def p(d, rec):
        return O + np.array([d / D_MAX * ANCHO, rec * ALTO, 0])

    ejes_ = VGroup(Line(O, p(D_MAX, 0), color=TINTA_2, stroke_width=3),
                   Line(O, p(0, 1.08), color=TINTA_2, stroke_width=3))
    for v in range(6):
        q = p(v * 1e-7, 0)
        ejes_.add(Line(q, q + DOWN * 0.07, color=TINTA_2, stroke_width=3))
        if v % 2:
            ejes_.add(texto(num(v / 10, 1), TAM_NOTA, TINTA_2).next_to(q + DOWN * 0.07, DOWN, 0.06))
    for v, s in ((0, "0"), (0.5, "50"), (1, "100")):
        q = p(0, v)
        ejes_.add(Line(q, q + LEFT * 0.07, color=TINTA_2, stroke_width=3))
        ejes_.add(texto(s, TAM_NOTA, TINTA_2).next_to(q + LEFT * 0.07, LEFT, 0.06))
    ejes_.add(DashedLine(p(0, 0.5), p(D_MAX, 0.5), color=REJILLA, stroke_width=2, dash_length=0.06))
    ejes_.add(texto(tr("gota (µm)", "drop (µm)"), TAM_NOTA, TINTA_2).next_to(p(D_MAX / 2, 0), DOWN, 0.42))
    ejes_.add(texto(tr("recuperación (%)", "recovery (%)"), TAM_NOTA, TINTA_2).next_to(p(0, 1.08), UP, 0.1).align_to([3.35, 0, 0], LEFT))

    def curva(sigma, c):
        ds = np.linspace(0, D_MAX, 240)
        return VMobject(color=c, stroke_width=4).set_points_as_corners([p(d, recuperacion(d, sigma)) for d in ds])

    curvas = VGroup(curva(SIGMA, FLUJO), curva(SIGMA_EF, OLIVA))
    puntos = VGroup(*[Dot(p(d, recuperacion(d, SIGMA)), radius=0.07, color=TINTA) for d in GOTAS[1:]])
    caso = Dot(p(D50_EF, 0.5), radius=0.09, color=AMARILLO, stroke_color=TINTA, stroke_width=2.5, fill_opacity=1)
    rotulos = VGroup(texto(f"{SIGMA:.0f} m²", TAM_NOTA, FLUJO).move_to(p(0.012e-6, 0.82), aligned_edge=LEFT),
                     texto(f"{SIGMA_EF:.0f} m²", TAM_NOTA, OLIVA).move_to(p(0.31e-6, 0.22), aligned_edge=LEFT))
    return VGroup(ejes_, VGroup(curvas, rotulos), VGroup(puntos, caso))
