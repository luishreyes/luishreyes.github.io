"""Cómo mezcla un mezclador estático en flujo laminar: cada elemento parte la corriente en dos, estira cada mitad y las
apila, así que las estrías se duplican hasta que son tan delgadas que la difusión las borra. Al lado, el coeficiente de
variación que se mide a lo largo del mezclador.

Para el capítulo 14 del libro de operaciones unitarias (Mezclado y escalado de tanques agitados). Dos corrientes
iguales, ácido y agua, entran lado a lado a un Kenics KMS de 12 elementos de 1,5 D. El corte de la corriente es el del
mapa del panadero (Paul, cap. 3, fig. 3-2): una estría es un par de capas, una de cada líquido, y con n elementos hay
2ⁿ estrías de espesor D/2ⁿ (Geankoplis 5.ª ed., ec. 7.2-22; Perry 18-36). El CoV sigue la ec. 7-20 de Paul,
CoV/CoV₀ = K_iL^(L/D), con K_iL = 0,87 para el KMS en laminar (tabla 7-5); con mitad y mitad, la ec. 7-6 da
CoV₀ = [(1 − C_v)/C_v]^0,5 = 1. El espesor en micras es el de un tubo de 50 mm, el del ejemplo 7-8.4.2 de Paul (un
KMS en laminar).

    uv run publicar.py escenas/libro/estrias_estatico.py EstriasEstatico \
        --tema uniandes --fondo nieve --destino {libro}/figuras/mezclado
"""
from estilo import *

KIL = 0.87          # Paul, tabla 7-5: KMS en laminar
L_EL = 1.5          # largo de un elemento, en diámetros del tubo
N_EL = 12
D_MM = 50           # tubo del ejemplo 7-8.4.2 de Paul, solo para poner el espesor en unidades
CV = 0.5            # mitad ácido, mitad agua
COV0 = ((1 - CV) / CV) ** 0.5   # Paul, ec. 7-6: 1

# El ácido va en el color cálido de estilo.py y el agua en el gris azulado claro del tema (el capítulo los pinta en
# óxido y azul claro, que estilo.py no tiene); la mezcla es el promedio de los dos.
ACIDO, AGUA = AMBAR, REJILLA
MEZCLA = interpolate_color(ManimColor(ACIDO), ManimColor(AGUA), 0.5)

S = 3.0                      # lado del corte de la corriente
X0, Y0 = -6.75, -1.4         # su esquina de abajo a la izquierda
YMIN = np.log10(0.02)        # el eje del CoV va de 0,02 a 1
N_BORRA = 7                  # desde aquí las capas miden menos de dos píxeles en el corte


def cov(ld):
    return COV0 * KIL ** ld


def yv(c):
    """El CoV en el eje: logaritmo, contado desde el fondo del eje (así el eje de L/D queda abajo)."""
    return np.log10(c) - YMIN


def contraste(n):
    """Lo que queda de las estrías al pasar n elementos (n puede ir entre dos). El tiempo de difusión va con el
    cuadrado del espesor, que se divide entre dos en cada elemento: la diferencia se apaga como exp(−a·4ⁿ).
    Ilustrativo: el comienzo lo fija el dibujo (N_BORRA), no un coeficiente de difusión."""
    return 1.0 if n < N_BORRA else float(np.exp(-0.25 * 4 ** (n - N_BORRA)))


def redondo(x, dec):
    """num() con redondeo hacia arriba en el medio (6,25 → 6,3)."""
    f = 10 ** dec
    return num(np.floor(x * f + 0.5) / f, dec)


def espesor(n):
    mm = D_MM / 2 ** n
    if mm >= 1:
        return f"{redondo(mm, 0 if mm == int(mm) else 1)} mm"
    return f"{redondo(1000 * mm, 0)} µm"


def ld_txt(ld):
    s = num(ld, 1)
    return s[:-2] if s.endswith(",0") else s


def marcado(s, tam=TAM_NOTA, color=None, peso=MEDIUM):
    """Texto en Barlow con <sup> y <sub>: la letra no trae ⁿ, ⁰ ni ₀."""
    return MarkupText(s, font=LETRA, font_size=tam, color=color or TINTA, weight=peso)


def capas(n, x0, y0, ancho, alto):
    """Las 2ⁿ estrías en un rectángulo: cada una, una capa de agua abajo y una de ácido arriba."""
    g = VGroup(Rectangle(width=ancho, height=alto, stroke_width=0, fill_color=AGUA, fill_opacity=1)
               .move_to([x0 + ancho / 2, y0 + alto / 2, 0]))
    m = 2 ** n
    e = alto / m
    for j in range(m):
        g.add(Rectangle(width=ancho, height=e / 2, stroke_width=0, fill_color=ACIDO, fill_opacity=1)
              .move_to([x0 + ancho / 2, y0 + j * e + 3 * e / 4, 0]))
    return g


def lectura(n):
    if n == 0:
        l1 = "a la entrada: 1 estría"
        l2 = "espesor de la estría: D"
    else:
        l1 = f"{n} elemento{'s' if n > 1 else ''}: 2<sup>{n}</sup> = {2 ** n} estrías"
        l2 = f"espesor de la estría: D/{2 ** n}"
    return VGroup(marcado(l1, TAM_TEXTO, TINTA, SEMIBOLD),
                  texto(l2, TAM_NOTA, TINTA_2),
                  texto(f"en un tubo de 50 mm: {espesor(n)}", TAM_NOTA, TINTA_2)) \
        .arrange(DOWN, buff=0.1, aligned_edge=LEFT).move_to([X0, Y0 - 0.25, 0], aligned_edge=UL)


class EstriasEstatico(Scene):
    def construct(self):
        ld = ValueTracker(0.0)

        # ── la gráfica del CoV, con el largo en diámetros ──
        ax = ejes((0, 18, 1.5), (0, -YMIN, -YMIN), x_largo=6.3, y_largo=3.15,
                  x_numeros=list(range(0, 19, 3)), y_numeros=[])
        ax.shift([0.35, -2.2, 0] - ax.c2p(0, 0))
        marcas = VGroup()
        for v, s in [(1, "1"), (0.5, "0,5"), (0.2, "0,2"), (0.1, "0,1"), (0.05, "0,05"), (0.02, "0,02")]:
            marcas.add(texto(s, TAM_NOTA, TINTA_2).next_to(ax.c2p(0, yv(v)), LEFT, 0.24))
            if v in (0.5, 0.2, 0.1):
                marcas.add(Line(ax.c2p(0, yv(v)), ax.c2p(18, yv(v)), color=REJILLA, stroke_width=2))
        marcas.add(texto("CoV del ácido", TAM_NOTA, TINTA_2).rotate(PI / 2)
                   .next_to(ax.c2p(0, 0), LEFT, 1.12).match_y(ax.y_axis))
        marcas.add(texto("largo desde la entrada, L/D", TAM_NOTA, TINTA_2)
                   .next_to(ax.c2p(9, 0), DOWN, 0.55))
        meta = DashedLine(ax.c2p(0, yv(0.05)), ax.c2p(18, yv(0.05)), color=OLIVA, stroke_width=3, dash_length=0.12)
        r_meta = texto("CoV = 0,05: mezclado (Paul)", TAM_NOTA, OLIVA) \
            .next_to(ax.c2p(0.3, yv(0.05)), DOWN, 0.1, aligned_edge=LEFT)
        curva = ax.plot(lambda x: yv(cov(x)), x_range=(0, 18, 0.5), color=NAVY, stroke_width=5)
        r_curva = VGroup(formula(r"\mathrm{CoV} = 0,87^{\,L/D}", TAM_TEXTO + 2),
                         texto("KMS en laminar (Paul, ec. 7-20)", TAM_NOTA, TINTA)) \
            .arrange(DOWN, buff=0.1, aligned_edge=LEFT)
        r_curva.move_to(ax.c2p(0.25, yv(0.05)) + UP * 0.13, aligned_edge=DL)
        punto = always_redraw(lambda: Dot(ax.c2p(ld.get_value(), yv(cov(ld.get_value()))), radius=0.1,
                                          color=AMARILLO, stroke_color=TINTA, stroke_width=2, fill_opacity=1))
        valor = always_redraw(lambda: texto(
            f"L/D = {ld_txt(ld.get_value())} · CoV = {num(cov(ld.get_value()), 2)}", TAM_TEXTO, TINTA, peso=SEMIBOLD)
            .move_to(ax.c2p(18, -YMIN), aligned_edge=UR))

        # ── el mezclador, a la misma escala del eje: 12 elementos de 1,5 D ──
        def xd(v):
            return ax.c2p(v, 0)[0]

        YP, RP = 1.8, (xd(1) - xd(0)) / 2
        paredes = VGroup(*[Line([xd(-1.2), YP + s * RP, 0], [xd(18) + 0.12, YP + s * RP, 0], color=NAVY,
                                stroke_width=3) for s in (1, -1)])
        entrada = VGroup(
            Rectangle(width=xd(0) - xd(-1.2), height=RP, stroke_width=0, fill_color=ACIDO, fill_opacity=1)
            .move_to([(xd(-1.2) + xd(0)) / 2, YP + RP / 2, 0]),
            Rectangle(width=xd(0) - xd(-1.2), height=RP, stroke_width=0, fill_color=AGUA, fill_opacity=1)
            .move_to([(xd(-1.2) + xd(0)) / 2, YP - RP / 2, 0]))
        cintas = VGroup()
        for k in range(N_EL):
            a, b = xd(L_EL * k) + 0.02, xd(L_EL * (k + 1)) - 0.02
            m, arr, aba = (a + b) / 2, YP + RP - 0.03, YP - RP + 0.03
            y1, y2 = (arr, aba) if k % 2 == 0 else (aba, arr)
            cintas.add(CubicBezier([a, y1, 0], [m, y1, 0], [m, y2, 0], [b, y2, 0], color=TINTA_2, stroke_width=3))
            cintas.add(CubicBezier([a, YP, 0], [m, YP + (y1 - YP) * 0.5, 0], [m, YP + (y2 - YP) * 0.5, 0], [b, YP, 0],
                                   color=TINTA_2, stroke_width=1.5, stroke_opacity=0.6))
        r_tubo = texto("mezclador KMS: 12 elementos de 1,5 D", TAM_NOTA, TINTA_2) \
            .next_to([xd(-1.2), YP - RP, 0], DOWN, 0.14, aligned_edge=LEFT)

        def caja(k):   # el elemento k (desde 1) resaltado
            return Rectangle(width=xd(L_EL) - xd(0), height=2 * RP, stroke_width=0, fill_color=AMARILLO,
                             fill_opacity=1).move_to([(xd(L_EL * (k - 1)) + xd(L_EL * k)) / 2, YP, 0])

        # El elemento que la corriente recorre: entra al cuadro antes que las cintas, para quedar detrás
        actual = caja(1).set_fill(opacity=0)

        def seguir(m):
            k = int(np.ceil(ld.get_value() / L_EL - 1e-6))
            if k >= 1:
                m.move_to(caja(min(k, N_EL))).set_fill(opacity=1)

        actual.add_updater(seguir)

        # ── el corte de la corriente ──
        self.corte = capas(0, X0, Y0, S, S)
        velo = Rectangle(width=S, height=S, stroke_width=0, fill_color=MEZCLA, fill_opacity=0) \
            .move_to([X0 + S / 2, Y0 + S / 2, 0])
        marco = Rectangle(width=S, height=S, stroke_color=TINTA_2, stroke_width=2, fill_opacity=0).move_to(velo)
        r_corte = texto("la corriente en corte, idealizada", TAM_NOTA, TINTA_2) \
            .next_to(marco, UP, 0.12, aligned_edge=LEFT)

        def muestra(color, s):
            return VGroup(Square(0.3, stroke_color=TINTA_2, stroke_width=1.5, fill_color=color, fill_opacity=1),
                          texto(s, TAM_NOTA, TINTA)).arrange(RIGHT, buff=0.14)

        leyenda_c = VGroup(muestra(ACIDO, "ácido"), muestra(AGUA, "agua"), muestra(MEZCLA, "mezcla")) \
            .arrange(DOWN, buff=0.2, aligned_edge=LEFT).next_to(marco, RIGHT, 0.3, aligned_edge=UP)
        lect = lectura(0)
        visto = {"n": 0}

        def contar(m):   # la lectura cambia cuando la corriente sale de un elemento
            n = int(np.floor(ld.get_value() / L_EL + 1e-6))
            if n != visto["n"]:
                visto["n"] = n
                m.become(lectura(n))

        lect.add_updater(contar)
        velo.add_updater(lambda m: m.set_fill(opacity=1 - contraste(ld.get_value() / L_EL)))

        titulo = rotulo("Dos corrientes entran a un mezclador estático").to_corner(UL, buff=0.35)

        def nota(*lineas):
            return VGroup(*[marcado(s, TAM_NOTA, TINTA_2) for s in lineas]) \
                .arrange(DOWN, buff=0.08, aligned_edge=LEFT).next_to(titulo, DOWN, 0.15, aligned_edge=LEFT)

        # 0 · la entrada: ácido y agua lado a lado
        self.next_section("entrada")
        n0 = nota("En flujo laminar no hay remolinos que mezclen. Ácido y agua, mitad y mitad,",
                  "entran lado a lado a un KMS: cintas torcidas de 1,5 D, cada una girada 90°.")
        self.add(titulo, n0)
        self.play(FadeIn(self.corte), Create(marco), FadeIn(r_corte), FadeIn(leyenda_c[:2]), FadeIn(lect),
                  run_time=0.8)
        self.add(actual)
        self.play(FadeIn(entrada), Create(paredes), Create(cintas, lag_ratio=0.05), FadeIn(r_tubo), run_time=1.4)
        self.play(Create(ax), FadeIn(marcas), run_time=0.8)
        self.play(Create(curva), FadeIn(r_curva), Create(meta), FadeIn(r_meta), run_time=1.2)
        self.play(GrowFromCenter(punto), FadeIn(valor), run_time=0.5)
        self.add(velo, marco)
        self.wait(1.2)
        self.wait(0.6)

        def elemento(n, t, pausa=0.0):
            """El elemento n + 1: parte el corte en dos, estira cada mitad y las apila (2ⁿ → 2ⁿ⁺¹ estrías).
            Va en un solo play: cada play empieza un cuadro clave y el video pesa menos con pocos."""
            # la mitad izquierda pasa un pelo por debajo de la derecha, para que no se vea la costura antes del corte
            izq, der = capas(n, X0, Y0, S / 2 + 0.02, S), capas(n, X0 + S / 2, Y0, S / 2, S)
            self.remove(self.corte)
            self.add(izq, der, velo, marco)
            cuchilla = Line([X0 + S / 2, Y0 - 0.08, 0], [X0 + S / 2, Y0 + S + 0.08, 0], color=TINTA, stroke_width=6)
            i1, d1 = izq.copy().stretch(0.5, 1, about_edge=DOWN), der.copy().stretch(0.5, 1, about_edge=UP)
            i2, d2 = i1.copy().stretch_to_fit_width(S, about_edge=LEFT), d1.copy().stretch(2, 0, about_edge=RIGHT)
            fases = Succession(
                Create(cuchilla, run_time=0.35 * t),
                AnimationGroup(Transform(izq, i1), Transform(der, d1), FadeOut(cuchilla), run_time=0.6 * t),
                AnimationGroup(Transform(izq, i2), Transform(der, d2), run_time=0.6 * t))
            mover = AnimationGroup(fases, ld.animate(rate_func=linear, run_time=1.55 * t).set_value(L_EL * (n + 1)))
            self.play(Succession(mover, Wait(run_time=pausa)) if pausa else mover)
            self.corte = capas(n + 1, X0, Y0, S, S)
            self.remove(izq, der)
            self.add(self.corte, velo, marco)

        # 1 · los primeros elementos, despacio
        self.next_section("dividir")
        t1 = rotulo("Cada elemento parte, estira y apila").to_corner(UL, buff=0.35)
        n1 = nota("Cada elemento parte la corriente en dos, estira cada mitad y apila las dos.",
                  "Una estría es un par de capas, ácido y agua: n elementos dan 2<sup>n</sup>, de espesor D/2<sup>n</sup>.")
        self.play(ReplacementTransform(titulo, t1), ReplacementTransform(n0, n1), run_time=0.6)
        for n in range(3):
            elemento(n, 1.4, pausa=0.3)
        self.wait(0.5)
        self.wait(0.6)

        # 2 · más elementos: las estrías se duplican
        self.next_section("duplicar")
        t2 = rotulo("Las estrías se duplican con cada elemento").to_corner(UL, buff=0.35)
        n2 = nota("2, 4, 8, 16…: el número de estrías se duplica y su espesor se parte a la mitad.",
                  "Con 7 elementos ya son 128 estrías; en un tubo de 50 mm, cada una de 0,39 mm.")
        self.play(ReplacementTransform(t1, t2), ReplacementTransform(n1, n2), run_time=0.6)
        for n in range(3, N_BORRA):
            elemento(n, 0.75)
        self.wait(0.8)
        self.wait(0.6)

        # 3 · la difusión termina el trabajo
        self.next_section("difusion")
        t3 = rotulo("La difusión termina el trabajo").to_corner(UL, buff=0.35)
        n3 = nota("Cuando las estrías son más finas de lo que se ve, la difusión las borra.",
                  "El CoV medido del KMS en laminar baja 0,87 por diámetro: a los 18 D vale 0,08.")
        self.play(ReplacementTransform(t2, t3), ReplacementTransform(n2, n3), FadeIn(leyenda_c[2]), run_time=0.6)
        self.play(ld.animate.set_value(L_EL * N_EL), run_time=0.55 * (N_EL - N_BORRA), rate_func=linear)
        self.wait(2.0)
        self.wait(0.6)
