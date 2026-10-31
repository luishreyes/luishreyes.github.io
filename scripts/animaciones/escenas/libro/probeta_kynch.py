"""La probeta de Kynch: un lodo de 5 g/L sedimenta en una probeta de 1 m. La interfaz baja a velocidad constante hasta
que la alcanzan las capas más concentradas que suben desde el fondo; desde ahí frena y la curva de altura contra tiempo
se dobla. La tangente en cada punto de la curva da la velocidad de la capa que llega ahí y corta el eje de las alturas
en H0·C0/C (la construcción de Kynch).

Para el capítulo 16 del libro de operaciones unitarias (Sedimentación y decantación). La velocidad de sedimentación por
lotes v(C) es la de la tabla 10-1 de MWH (Crittenden et al., 2012, p. 662, de Tchobanoglous et al.), interpolada en
log-log con las pendientes de Fritsch y Carlson; el flujo de sólidos es J = C·v(C), cada concentración sube desde el
fondo a w = −dJ/dC, y después del quiebre t = H0·C0/[C·(v + w)] y h = w·t (Chhabra y Basavaraj, 2019, ecs. 8.36 y
8.40). Las funciones son copia exacta de las de herramientas/decantadores.py del libro: 1,02 m/h hasta 0,558 h.

    uv run publicar.py escenas/libro/probeta_kynch.py ProbetaKynch \
        --tema uniandes --fondo nieve --destino {libro}/figuras/sedimentacion-y-decantacion
"""
import math

from estilo import *
from paleta_libro import *   # los colores salen de la paleta del libro (libro/estilo/paleta.json)

LODO, LODO_OSC = mat("suspension"), mat("suspension", "oscuro")   # el lodo de 5 g/L y el de 25 g/L
AGUA = mat("agua")

# ── herramientas/decantadores.py (copia exacta) ─────────────────────────
# MWH tabla 10-1 (de Tchobanoglous et al., 2003): velocidad inicial de la interfaz contra la concentración
FLUJO_DATOS = [(1, 7.50), (2, 4.80), (3, 2.55), (5, 1.02), (10, 0.31), (15, 0.16)]   # g/L, m/h


_LX = [math.log(c) for c, _ in FLUJO_DATOS]
_LY = [math.log(v) for _, v in FLUJO_DATOS]


def _pchip_pendientes(x, y):
    """Pendientes de Fritsch y Carlson: la interpolación pasa por los puntos, es suave y no inventa máximos."""
    n = len(x)
    h = [x[i + 1] - x[i] for i in range(n - 1)]
    dl = [(y[i + 1] - y[i]) / h[i] for i in range(n - 1)]
    m = [0.0] * n
    m[0], m[-1] = dl[0], dl[-1]
    for i in range(1, n - 1):
        if dl[i - 1] * dl[i] <= 0:
            m[i] = 0.0
        else:
            w1, w2 = 2 * h[i] + h[i - 1], h[i] + 2 * h[i - 1]
            m[i] = (w1 + w2) / (w1 / dl[i - 1] + w2 / dl[i])
    return m


_LM = _pchip_pendientes(_LX, _LY)


def v_lote(c):
    """m/h, velocidad de sedimentación por lotes a la concentración c (g/L): interpolación monótona en log-log de
    la tabla 10-1 de MWH; fuera de 1 a 15 g/L sigue la pendiente del último tramo."""
    lc = math.log(c)
    if lc <= _LX[0]:
        return math.exp(_LY[0] + _LM[0] * (lc - _LX[0]))
    if lc >= _LX[-1]:
        return math.exp(_LY[-1] + _LM[-1] * (lc - _LX[-1]))
    k = max(i for i in range(len(_LX) - 1) if _LX[i] <= lc)
    h = _LX[k + 1] - _LX[k]
    t = (lc - _LX[k]) / h
    h00, h10, h01, h11 = 2 * t ** 3 - 3 * t ** 2 + 1, t ** 3 - 2 * t ** 2 + t, -2 * t ** 3 + 3 * t ** 2, t ** 3 - t ** 2
    return math.exp(h00 * _LY[k] + h10 * h * _LM[k] + h01 * _LY[k + 1] + h11 * h * _LM[k + 1])


def flujo(c):
    """kg/(m²·h) = (g/L)·(m/h)."""
    return c * v_lote(c)


def dflujo(c, h=1e-4):
    return (flujo(c * (1 + h)) - flujo(c * (1 - h))) / (2 * c * h)


def kynch(c0, h0, cmax=25.0, k=120):
    """La curva de altura contra tiempo de la probeta (Kynch): la interfaz baja a v(C0) hasta tocar la primera
    característica que sube del fondo; después, para cada C, t = H0·C0/[C·(v + w)] y h = w·t, con w = −dJ/dC
    (Chhabra y Basavaraj ecs. 8.36 y 8.40). Vale donde la curva de flujo es convexa (C sobre la inflexión)."""
    v0 = v_lote(c0)
    w0 = -dflujo(c0)
    t1 = h0 / (v0 + w0)
    pts = [[0.0, h0], [t1, h0 - v0 * t1]]
    for i in range(1, k + 1):
        c = c0 * (cmax / c0) ** (i / k)
        w = -dflujo(c)
        t = h0 * c0 / (c * (v_lote(c) + w))
        pts.append([t, w * t])
    return {"c0": c0, "h0": h0, "v0": v0, "t1": t1, "puntos": pts}


# ── el caso ─────────────────────────────────────────────────────────────
C0, H0, CMAX = 5.0, 1.0, 25.0
K = kynch(C0, H0, CMAX, k=240)
V0, T1 = K["v0"], K["t1"]                           # 1,02 m/h y 0,558 h
W0 = -dflujo(C0)                                    # 0,77 m/h
T_FIN = K["puntos"][-1][0]                          # 1,76 h, cuando llega la capa de 25 g/L


def w_de(c):
    return -dflujo(c)


def t_de(c):
    """Cuándo llega a la interfaz la capa de concentración c (después del quiebre)."""
    return H0 * C0 / (c * (v_lote(c) + w_de(c)))


def c_interfaz(t):
    """La concentración justo debajo de la interfaz: C0 hasta el quiebre; después, la capa que llega a esa hora."""
    if t <= T1:
        return C0
    lo, hi = C0, CMAX
    for _ in range(60):
        m = 0.5 * (lo + hi)
        lo, hi = (m, hi) if t_de(m) < t else (lo, m)
    return 0.5 * (lo + hi)


def h_interfaz(t):
    if t <= T1:
        return H0 - V0 * t
    return w_de(c_interfaz(t)) * t


# la concentración a la altura y y la hora t, por debajo de la interfaz: la capa con w = y/t
_CS = np.exp(np.linspace(math.log(C0), math.log(CMAX), 200))
_WS = np.array([w_de(c) for c in _CS])               # baja con C: se invierte al interpolar


def c_en(y, t):
    if t <= 0:
        return C0
    w = y / t
    if w >= _WS[0]:
        return C0
    return float(np.interp(w, _WS[::-1], _CS[::-1]))


def color_lodo(c):
    a = (math.log(c) - math.log(C0)) / (math.log(CMAX) - math.log(C0))
    return interpolate_color(ManimColor(LODO), ManimColor(LODO_OSC), min(1.0, max(0.0, a)))


class ProbetaKynch(Scene):
    def construct(self):
        tt = ValueTracker(0.0)                        # el tiempo, h

        # la probeta, a la izquierda; su escala de alturas es la del eje de la gráfica
        X0, Y0, ANCHO, ESC = -6.25, -2.15, 1.4, 3.0     # ESC: unidades de pantalla por metro
        XC = X0 + ANCHO / 2
        N = 48

        def contenido():
            t = tt.get_value()
            h = h_interfaz(t)
            g = VGroup(Rectangle(width=ANCHO, height=(H0 - h) * ESC, stroke_width=0, fill_color=AGUA, fill_opacity=1)
                       .move_to([XC, Y0 + (H0 + h) / 2 * ESC, 0]))
            dy = h / N
            for i in range(N):
                y = (i + 0.5) * dy
                g.add(Rectangle(width=ANCHO, height=dy * ESC + 0.01, stroke_width=0,
                                fill_color=color_lodo(c_en(y, t)), fill_opacity=1)
                      .move_to([XC, Y0 + y * ESC, 0]))
            g.add(Line([X0, Y0 + h * ESC, 0], [X0 + ANCHO, Y0 + h * ESC, 0], color=TINTA_2, stroke_width=3))
            return g

        g_lodo = always_redraw(contenido)
        vidrio = VGroup(
            Line([X0, Y0 + H0 * ESC + 0.1, 0], [X0, Y0, 0], color=TINTA, stroke_width=4),
            Line([X0, Y0, 0], [X0 + ANCHO, Y0, 0], color=TINTA, stroke_width=4),
            Line([X0 + ANCHO, Y0, 0], [X0 + ANCHO, Y0 + H0 * ESC + 0.1, 0], color=TINTA, stroke_width=4),
            Rectangle(width=ANCHO + 0.5, height=0.1, stroke_width=0, fill_color=TINTA_2, fill_opacity=1)
            .move_to([XC, Y0 - 0.05, 0]),
        )
        r_alto = always_redraw(lambda: texto(f"interfaz: {num(h_interfaz(tt.get_value()), 2)} m", TAM_NOTA, TINTA)
                               .move_to([XC, Y0 + H0 * ESC + 0.7, 0]))
        r_conc = always_redraw(lambda: texto(f"debajo: {num(c_interfaz(tt.get_value()), 1)} g/L", TAM_NOTA, TINTA_2)
                               .move_to([XC, Y0 + H0 * ESC + 0.28, 0]))

        # la gráfica, a la derecha
        ax = ejes((0, 2, 0.5), (0, 1, 0.2), x_largo=9.4, y_largo=ESC * H0, dec=1,
                  x_titulo="tiempo (h)", y_titulo="altura de la interfaz (m)")
        ax.shift([-2.75, Y0, 0] - ax.c2p(0, 0))
        traza = always_redraw(lambda: ax.plot(h_interfaz, x_range=(0, max(0.002, tt.get_value()), 0.004),
                                              color=NAVY, stroke_width=6, use_smoothing=False))
        punto = always_redraw(lambda: Dot(ax.c2p(tt.get_value(), h_interfaz(tt.get_value())), radius=0.1,
                                          color=AMARILLO, stroke_color=TINTA, stroke_width=2, fill_opacity=1))

        titulo = rotulo("La probeta: sedimentación por zonas").to_corner(UL, buff=0.35)

        def leyenda(*lineas):
            return VGroup(*[texto(s, TAM_NOTA, TINTA_2) for s in lineas]).arrange(DOWN, buff=0.08, aligned_edge=LEFT) \
                .next_to(titulo, DOWN, 0.15, aligned_edge=LEFT)

        # 1 · la interfaz baja recta
        self.next_section("zona")
        nota = leyenda(f"Un lodo de {num(C0, 0)} g/L en una probeta de {num(H0, 0)} m. Arriba queda agua clara y la interfaz",
                       f"baja a {num(V0, 2)} m/h, la velocidad de sedimentación del lodo de {num(C0, 0)} g/L: la curva es una recta.")
        self.add(vidrio, g_lodo, r_alto, r_conc, ax, traza, punto, titulo, nota)
        self.bring_to_front(vidrio)
        self.wait(0.4)
        self.play(tt.animate.set_value(0.25), run_time=2.8, rate_func=linear)
        self.wait(0.6)

        # 2 · las capas que suben del fondo
        self.next_section("capas")
        t1 = rotulo("Las capas que suben del fondo").move_to(titulo, aligned_edge=LEFT)
        n1 = leyenda("Desde el fondo suben capas más concentradas, cada una a su velocidad constante:",
                     f"son las rectas que salen del origen. La de {num(C0, 0)} g/L sube a {num(W0, 2)} m/h y alcanza la",
                     f"interfaz a las {num(T1, 2)} h; desde ahí la interfaz frena y la curva se dobla.")
        CAPAS = (C0, 7.0, 10.0, 15.0, CMAX)

        def capas():
            t = tt.get_value()
            g = VGroup()
            for c in CAPAS:
                tc = T1 if c == C0 else t_de(c)
                te = min(t, tc)
                if te <= 0:
                    continue
                g.add(Line(ax.c2p(0, 0), ax.c2p(te, w_de(c) * te), color=TINTA_2 if c == C0 else TINTA_3,
                           stroke_width=3 if c == C0 else 2))
            return g

        g_capas = always_redraw(capas)
        r_w = VGroup(texto("cada capa sube a", TAM_NOTA, TINTA_2),
                     formula(r"w = -dJ/dC", TAM_TEXTO, TINTA_2)).arrange(RIGHT, buff=0.2)
        r_w.move_to(ax.c2p(1.0, 0.94), aligned_edge=LEFT)
        r_c0 = texto(f"{num(C0, 0)} g/L", TAM_NOTA, TINTA_2).move_to(ax.c2p(0.20, 0.33))
        self.play(ReplacementTransform(titulo, t1), ReplacementTransform(nota, n1), run_time=0.6)
        self.add(g_capas)
        self.bring_to_front(traza, punto)
        self.play(FadeIn(g_capas), FadeIn(r_w), FadeIn(r_c0), run_time=0.6)
        self.play(tt.animate.set_value(T1), run_time=2.4, rate_func=linear)
        quiebre = Dot(ax.c2p(T1, h_interfaz(T1)), radius=0.07, color=TINTA_2)
        self.add(quiebre)
        self.bring_to_front(punto)
        self.wait(0.8)
        self.play(tt.animate.set_value(T_FIN), run_time=6.0, rate_func=linear)
        self.wait(0.6)

        # 3 · la construcción de Kynch
        self.next_section("construcción")
        C = 10.0
        tp, hp, vp = t_de(C), w_de(C) * t_de(C), v_lote(C)
        corte = H0 * C0 / C                           # 0,50 m
        t2 = rotulo("La construcción de Kynch").move_to(t1, aligned_edge=LEFT)
        n2 = leyenda(f"La tangente donde llega la capa de {num(C, 0)} g/L corta el eje en {num(H0, 0)} m × {num(C0, 0)}/{num(C, 0)} = {num(corte, 2)} m,",
                     "y su pendiente es la velocidad de esa capa. Así una sola probeta da la velocidad",
                     "de cada concentración, que es lo que pide el diseño del espesador.")
        tangente = Line(ax.c2p(0, corte), ax.c2p(corte / vp, 0), color=OLIVA, stroke_width=4)
        p_corte = Dot(ax.c2p(0, corte), radius=0.08, color=OLIVA)
        r_corte = VGroup(
            VGroup(texto("corte:", TAM_NOTA, OLIVA),
                   formula(r"H_0 C_0/C = " + num(corte, 2) + r"\ \mathrm{m}", TAM_TEXTO, OLIVA)).arrange(RIGHT, buff=0.2),
            VGroup(texto("pendiente:", TAM_NOTA, OLIVA),
                   formula(r"v = " + num(vp, 2) + r"\ \mathrm{m/h}", TAM_TEXTO, OLIVA)).arrange(RIGHT, buff=0.2),
        ).arrange(DOWN, buff=0.16, aligned_edge=LEFT).next_to(r_w, DOWN, 0.16, aligned_edge=LEFT)
        p_capa = Dot(ax.c2p(tp, hp), radius=0.1, color=AMARILLO, stroke_color=TINTA, stroke_width=2, fill_opacity=1)
        r_capa = texto(f"{num(C, 0)} g/L", TAM_NOTA, TINTA).next_to(ax.c2p(tp, hp), UR, 0.14)
        self.play(ReplacementTransform(t1, t2), ReplacementTransform(n1, n2), run_time=0.6)
        self.play(Create(tangente), FadeIn(p_corte), run_time=1.4)
        self.play(FadeOut(punto), FadeIn(p_capa), FadeIn(r_capa), FadeIn(r_corte), run_time=0.6)
        self.wait(1.4)
        self.wait(0.6)
