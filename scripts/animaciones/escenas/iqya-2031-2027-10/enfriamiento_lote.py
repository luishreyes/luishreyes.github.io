"""Cuánto tarda en enfriarse un lote en un tanque agitado con chaqueta, y qué
lo acorta. Es la Figura 3 de la Lectura 09 (Mezclado y escalado) de POU
2027-10. Usa el mismo modelo que la calculadora de esa lectura y que su
Tabla 8: lote acuoso de 2,65 m³ que baja de 70 °C a 25 °C con agua que entra a
15 °C y 3 kg/s; PBT de 0,5 m a 120 rpm; Nu = 0,53·Re^(2/3)·Pr^(1/3)·(μ/μw)^0,14;
ho = 1500 W/m²K, pared de acero de 6 mm y Rf = 2×10⁻⁴ m²K/W (supuestos del
ejemplo). Da 69 min; 65 min con el doble de velocidad; 126 min en un tanque
ocho veces mayor con el mismo P/V.

    uv run publicar.py escenas/iqya-2031-2027-10/enfriamiento_lote.py EnfriamientoLote \
        --curso iqya-2031-2027-10 --carpeta lecturas/Lectura_09 --tema uniandes --fondo papel \
        --nombre enfriamiento-lote \
        --titulo "la temperatura de un lote que se enfría en un tanque con chaqueta, con el doble de velocidad y en un tanque ocho veces mayor"
"""
import math

from estilo import *

# ── El modelo (el mismo de la calculadora de la Lectura 09) ─────────────
CP = CC = 4180.0
XW, KW, RF, HO = 0.006, 16.0, 2e-4, 1500.0
T0, TF, T1 = 70.0, 25.0, 15.0


def mu_agua(t):
    return 2.414e-5 * 10 ** (247.8 / (t + 273.15 - 140))


def k_agua(t):
    return 0.5706 + 0.00178 * t - 6.6e-6 * t * t


def rho_agua(t):
    return 1001.4 - 0.0912 * t - 0.00352 * t * t


def caso(dt=1.5, rpm=120.0, mc=3.0, c=0.53, m=0.14):
    da, h, n, tm = dt / 3, dt, rpm / 60, (T0 + TF) / 2
    rho, mu, k, muw = rho_agua(tm), mu_agua(tm), k_agua(tm), mu_agua(TF)
    re = rho * n * da * da / mu
    pr = CP * mu / k
    hi = c * re ** (2 / 3) * pr ** (1 / 3) * (mu / muw) ** m * k / dt
    res = [1 / hi, XW / KW, 1 / HO, RF]
    u = 1 / sum(res)
    a = math.pi * dt * h + math.pi * dt * dt / 4
    v = math.pi / 4 * dt * dt * h
    eps = 1 - math.exp(-u * a / (mc * CC))
    tau = rho * v * CP / (mc * CC * eps) / 60  # min
    return dict(u=u, tau=tau, t=tau * math.log((T0 - T1) / (TF - T1)),
                fr=[r / sum(res) for r in res], av=a / v)


BASE = caso()
DOBLE = caso(rpm=240.0)
GRANDE = caso(dt=3.0, rpm=120.0 * 2 ** (-2 / 3), mc=24.0)


def temp(c, t):
    return T1 + (T0 - T1) * math.exp(-t / c["tau"])


def lineas(renglones, tam=TAM_TEXTO, color=None, peso=MEDIUM):
    return VGroup(*[texto(r, tam, color, peso=peso) for r in renglones]).arrange(DOWN, aligned_edge=LEFT, buff=0.12)


class EnfriamientoLote(Scene):
    def construct(self):
        ax = ejes((0, 140, 20), (10, 75, 10), x_largo=7.3, y_largo=4.5,
                  x_titulo="Tiempo (min)", y_titulo="Temperatura del lote (°C)",
                  y_numeros=[10, 20, 30, 40, 50, 60, 70], tam=28)
        ax.shift([-5.75, -1.8, 0] - ax.c2p(0, 10))
        assert ax.get_bottom()[1] > -3.1, ax.get_bottom()  # libre la franja de los controles
        X = 2.25       # borde izquierdo del panel de la derecha
        ANCHO = 6.85 - X
        ARRIBA = 2.7

        def paso(s):
            return rotulo(s, tam=44, color=TINTA).to_corner(UL, buff=0.4)

        def horizontal(tc, color):
            return DashedLine(ax.c2p(0, tc), ax.c2p(140, tc), color=color, dash_length=0.12, stroke_width=2.5)

        def punto(t, tc, relleno=AMARILLO):
            return Dot(ax.c2p(t, tc), radius=0.11, color=NAVY, fill_color=relleno, fill_opacity=1, stroke_width=4)

        def curva(c, color, ancho=6, hasta=None):
            return ax.plot(lambda t: temp(c, t), x_range=(0, hasta or 140), color=color, stroke_width=ancho)

        def en_panel(mob, y=ARRIBA):
            if mob.width > ANCHO:
                mob.scale_to_fit_width(ANCHO)
            return mob.move_to([X, y, 0], aligned_edge=UL)

        # ── 1. El lote y el agua ────────────────────────────────────────
        self.next_section("lote")
        titulo = paso("Un lote de 2,65 m³ se enfría por la chaqueta")
        agua = horizontal(T1, TINTA_2)
        et_agua = texto("agua, 15 °C", 26, TINTA_2).next_to(ax.c2p(1, T1), UR, 0.08)
        meta = horizontal(TF, ACERO)
        et_meta = texto("meta, 25 °C", 26, ACERO, peso=SEMIBOLD).next_to(ax.c2p(1, TF), UR, 0.08)
        inicio = punto(0, T0)
        et_ini = texto("70 °C", 28, TINTA, peso=SEMIBOLD).next_to(ax.c2p(0, T0), UR, 0.12)
        balance = formula(r"m\,c_p\,\frac{dT}{dt} = -\,\dot m_c\,c_c\,\varepsilon\,(T - t_1)", tam=36)
        nota1 = lineas(["El calor que sale es", "proporcional a la diferencia", "entre el lote y el agua", "que entra a la chaqueta."], 27, TINTA_2)
        panel1 = en_panel(VGroup(balance, nota1).arrange(DOWN, aligned_edge=LEFT, buff=0.3))
        self.play(FadeIn(titulo), Create(ax), run_time=1.2)
        self.play(Create(agua), FadeIn(et_agua), Create(meta), FadeIn(et_meta), run_time=1.0)
        self.play(GrowFromCenter(inicio), FadeIn(et_ini), FadeIn(panel1, shift=UP * 0.1), run_time=0.9)
        self.wait(0.6)

        # ── 2. La fuerza impulsora se apaga ─────────────────────────────
        self.next_section("base")
        nuevo = paso("La diferencia con el agua se apaga")
        tt = ValueTracker(0.01)
        traza = always_redraw(lambda: curva(BASE, TINTA, hasta=max(tt.get_value(), 0.02)))
        movil = always_redraw(lambda: punto(tt.get_value(), temp(BASE, tt.get_value())))
        flecha = always_redraw(lambda: DoubleArrow(
            ax.c2p(tt.get_value(), T1), ax.c2p(tt.get_value(), temp(BASE, tt.get_value())),
            buff=0, color=ACERO, stroke_width=4, tip_length=0.18,
            max_tip_length_to_length_ratio=0.25))
        et_flecha = always_redraw(lambda: MathTex(r"T - t_1", font_size=34, color=ACERO).next_to(
            ax.c2p(tt.get_value(), T1 + 0.72 * (temp(BASE, tt.get_value()) - T1)), RIGHT, 0.12))
        integral = formula(r"\ln\frac{T_0 - t_1}{T - t_1} = \frac{t}{\tau}", tam=40)
        tau = formula(r"\tau = \frac{m\,c_p}{\dot m_c\,c_c\,\varepsilon} = " + num(BASE["tau"], 0) + r"\ \text{min}", tam=38)
        nota2 = lineas(["Cada 40 min la diferencia", "se divide entre e = 2,72."], 27, TINTA_2)
        panel2 = en_panel(VGroup(integral, tau, nota2).arrange(DOWN, aligned_edge=LEFT, buff=0.35))
        self.play(FadeTransform(titulo, nuevo), FadeOut(panel1), FadeOut(et_ini), run_time=0.7)
        titulo = nuevo
        self.remove(inicio)
        self.add(traza, movil, flecha, et_flecha)
        self.play(FadeIn(panel2, shift=UP * 0.1), run_time=0.6)
        self.play(tt.animate.set_value(BASE["t"]), run_time=4.0, rate_func=linear)
        self.remove(traza, movil, flecha, et_flecha)
        base = curva(BASE, TINTA, hasta=BASE["t"])
        fin_base = punto(BASE["t"], TF)
        et_base = texto(f"{BASE['t']:.0f} min", 28, TINTA, peso=SEMIBOLD).next_to(ax.c2p(BASE["t"], TF), DR, 0.12)
        self.add(base, fin_base)
        self.play(FadeIn(et_base), run_time=0.5)
        self.wait(0.6)

        # ── 3. El doble de velocidad ────────────────────────────────────
        self.next_section("velocidad")
        nuevo = paso(f"El doble de velocidad: {DOBLE['t']:.0f} min")
        nombres = ["proceso", "pared", "servicio", "ensuciamiento"]
        colores = [AMARILLO, REJILLA, TINTA_3, TINTA_2]
        ANCHO_BARRA = ANCHO

        def barra(fr, ancho_total):
            return VGroup(*[
                Rectangle(width=max(f * ancho_total, 0.01), height=0.5, fill_color=col, fill_opacity=1,
                          stroke_color=NAVY, stroke_width=2)
                for f, col in zip(fr, colores)
            ]).arrange(RIGHT, buff=0)

        def leyenda(fr):
            return VGroup(*[
                VGroup(Square(0.26, fill_color=col, fill_opacity=1, stroke_color=NAVY, stroke_width=2),
                       texto(f"{n}: {100 * f:.0f} %", 26, TINTA_2)).arrange(RIGHT, buff=0.15)
                for n, col, f in zip(nombres, colores, fr)
            ]).arrange(DOWN, aligned_edge=LEFT, buff=0.1)

        cab = texto("Resistencias de 1/U", 28, TINTA, peso=SEMIBOLD)
        b1 = barra(BASE["fr"], ANCHO_BARRA)
        ley1 = leyenda(BASE["fr"])
        grupo = VGroup(cab, b1, ley1).arrange(DOWN, aligned_edge=LEFT, buff=0.22)
        assert grupo.width <= ANCHO + 1e-6, grupo.width  # sin escalar: b2 y ley2 se arman al mismo tamaño
        en_panel(grupo)
        # con el doble de velocidad solo encoge el tramo del proceso: el total baja de 1/U a 1/U'
        escala = BASE["u"] / DOBLE["u"]
        b2 = barra(DOBLE["fr"], ANCHO_BARRA * escala).move_to(b1, aligned_edge=LEFT)
        ley2 = leyenda(DOBLE["fr"]).move_to(ley1, aligned_edge=UL)
        nota3 = lineas(["El coeficiente del proceso", f"sube 59 %; U, solo {100 * (DOBLE['u'] / BASE['u'] - 1):.0f} %.", "La potencia sube 8 veces."], 26, TINTA_2)
        nota3.next_to(grupo, DOWN, buff=0.35, aligned_edge=LEFT)
        assert nota3.width <= ANCHO + 1e-6 and nota3.get_bottom()[1] > -3.1, (nota3.width, nota3.get_bottom())
        doble = curva(DOBLE, ACERO, ancho=5, hasta=DOBLE["t"])
        fin_doble = punto(DOBLE["t"], TF, relleno=FONDO)
        et_doble = texto(f"{DOBLE['t']:.0f} min", 28, ACERO, peso=SEMIBOLD).next_to(ax.c2p(DOBLE["t"], TF), DL, 0.12)
        self.play(FadeTransform(titulo, nuevo), FadeOut(panel2), run_time=0.7)
        titulo = nuevo
        self.play(FadeIn(grupo, shift=UP * 0.1), run_time=0.8)
        self.play(Transform(b1, b2), Transform(ley1, ley2), run_time=1.2)
        self.play(Create(doble), run_time=1.6)
        self.play(GrowFromCenter(fin_doble), FadeIn(et_doble), FadeIn(nota3), run_time=0.7)
        self.wait(0.8)

        # ── 4. Un tanque ocho veces mayor ───────────────────────────────
        self.next_section("escala")
        nuevo = paso(f"Ocho veces el volumen: {GRANDE['t']:.0f} min")
        grande = curva(GRANDE, AMBAR, ancho=6, hasta=GRANDE["t"])
        fin_grande = punto(GRANDE["t"], TF, relleno=AMBAR)
        et_grande = texto(f"{GRANDE['t']:.0f} min", 28, TINTA, peso=SEMIBOLD).next_to(ax.c2p(GRANDE["t"], TF), DOWN, 0.16)

        def item(color, renglon1, renglon2):
            return VGroup(Line(ORIGIN, RIGHT * 0.55, color=color, stroke_width=7),
                          lineas([renglon1, renglon2], 26, TINTA_2)).arrange(RIGHT, buff=0.2, aligned_edge=UP)

        ley = VGroup(
            item(TINTA, f"1,5 m y 120 rpm: {BASE['t']:.0f} min", "el caso base"),
            item(ACERO, f"240 rpm: {DOBLE['t']:.0f} min", "con 8 veces la potencia"),
            item(AMBAR, f"3 m, mismo P/V: {GRANDE['t']:.0f} min", f"A/V de {num(BASE['av'], 2)} a {num(GRANDE['av'], 2)} m²/m³"),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.3)
        panel4 = en_panel(ley)
        self.play(FadeTransform(titulo, nuevo), FadeOut(grupo), FadeOut(b1), FadeOut(ley1), FadeOut(nota3), run_time=0.7)
        titulo = nuevo
        self.play(Create(grande), run_time=2.0)
        self.play(GrowFromCenter(fin_grande), FadeIn(et_grande), FadeIn(panel4, shift=UP * 0.1), run_time=0.8)
        self.wait(2.0)
