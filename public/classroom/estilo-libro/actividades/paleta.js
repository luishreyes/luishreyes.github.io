/* La paleta de las figuras del libro, para el navegador: window.PALETA, con cada nombre ya
   resuelto a su color. La escribe herramientas/paleta.mjs desde estilo/paleta.json: no se edita a mano. Para cambiar un color, se cambia paleta.json y se corre node herramientas/paleta.mjs.
   Se carga en cada capítulo antes que los scripts de sus figuras.
   Uso: PALETA.base.tinta, PALETA.materiales.agua.relleno, PALETA.graficas.series[0],
   PALETA.cortes.pieza, PALETA.color('agua.medio'). */
(function () {
  'use strict';
  var P = {
    "base": {
      "tinta": "#19222F",
      "tinta-2": "#525C64",
      "guia": "#8A96A3",
      "eje": "#AEB8C2",
      "borde": "#D3D9DF",
      "rejilla": "#E3E8EE",
      "zona": "#F1F3F5",
      "papel": "#F6F8FA",
      "blanco": "#FFFFFF",
      "amarillo": "#FFF500",
      "amarillo-claro": "#FFFCCC",
      "oliva": "#6E6A00",
      "oliva-osc": "#565200",
      "azul": "#2E5E9E",
      "naranja": "#C2410C",
      "alerta": "#B3261E"
    },
    "materiales": {
      "agua": {
        "relleno": "#E4EEF7",
        "medio": "#BCD0E6",
        "oscuro": "#8FB0CF"
      },
      "aceite": {
        "relleno": "#F3E9BE",
        "medio": "#E3CF7A",
        "oscuro": "#B08A1E"
      },
      "suspension": {
        "relleno": "#E6D9BC",
        "medio": "#CDBB92",
        "oscuro": "#6B5333"
      },
      "solido": {
        "relleno": "#D9CFB8",
        "medio": "#A89464",
        "oscuro": "#7A5634"
      },
      "cascara": {
        "relleno": "#F5D9B3",
        "medio": "#E0922F",
        "oscuro": "#9A5B12"
      },
      "metal": {
        "relleno": "#C9D1D9",
        "medio": "#AEB8C2",
        "oscuro": "#8A96A3"
      },
      "concreto": {
        "relleno": "#E8E6E1",
        "medio": "#D2CFC8",
        "oscuro": "#A6A196"
      },
      "vidrio": {
        "relleno": "#F1F6FA",
        "medio": "#DFE9F1",
        "oscuro": "#AEC3D6"
      },
      "gas": {
        "relleno": "#FFFFFF",
        "medio": "#E3E8EE",
        "oscuro": "#AEB8C2"
      },
      "caliente": {
        "relleno": "#F6D9C8",
        "medio": "#E9A57E",
        "oscuro": "#C2410C"
      },
      "caucho": {
        "relleno": "#5D666E",
        "medio": "#3E464D",
        "oscuro": "#19222F"
      },
      "antracita": {
        "relleno": "#35383C",
        "medio": "#242628",
        "oscuro": "#19222F"
      },
      "acido": {
        "relleno": "#F5D9B3",
        "medio": "#E0922F",
        "oscuro": "#C2410C"
      }
    },
    "graficas": {
      "series": [
        "#2E5E9E",
        "#6E6A00",
        "#C2410C",
        "#19222F",
        "#8A96A3"
      ],
      "texto": "#19222F",
      "texto-2": "#525C64",
      "eje": "#AEB8C2",
      "rejilla": "#E3E8EE",
      "zona": "#F1F3F5",
      "caso-relleno": "#FFF500",
      "caso-trazo": "#19222F",
      "fuera-de-rango": "#B3261E",
      "referencia": "#8A96A3",
      "barra": "#C9D1D9",
      "rejilla-mayor": "#D3D9DF",
      "contexto": "#C9D1D9",
      "zona-marcada": "#D3D9DF",
      "zona-fuera": "#F6D9C8",
      "advertencia": "#C2410C"
    },
    "esquemas": {
      "trazo": "#19222F",
      "texto": "#19222F",
      "texto-2": "#525C64",
      "pregunta": "#565200",
      "equipo-relleno": "#FFFFFF",
      "pieza": "#C9D1D9",
      "liquido": "#E4EEF7",
      "calor": "#C2410C",
      "resaltado": "#FFF500",
      "resaltado-claro": "#FFFCCC",
      "frontera": "#6E6A00",
      "familias": {
        "mecanica": "#FFF500",
        "calor": "#6E6A00",
        "masa": "#19222F",
        "quimica": "#2E5E9E"
      }
    },
    "cortes": {
      "trazo": "#19222F",
      "pieza": "#C9D1D9",
      "pieza-media": "#AEB8C2",
      "pieza-oscura": "#8A96A3",
      "pieza-atras": "#D3D9DF",
      "liquido": "#E4EEF7",
      "liquido-hondo": "#BCD0E6",
      "flujo": "#2E5E9E",
      "calor": "#C2410C",
      "giro": "#C2410C",
      "resaltado": "#FFF500"
    },
    "isometricas": {
      "acero": {
        "cara": "#EEF0F2",
        "tapa": "#F7F8F9",
        "sombras": [
          "#C9CED3",
          "#D6DADE",
          "#E1E4E7",
          "#ECEEF0"
        ]
      },
      "fundicion": {
        "cara": "#DFE2E5",
        "tapa": "#E9EBED",
        "sombras": [
          "#C1C6CB",
          "#CACFD3",
          "#D3D7DA",
          "#DADDE0"
        ]
      },
      "pintado": {
        "cara": "#E4E8EA",
        "tapa": "#EDF0F1",
        "sombras": [
          "#C7CDD1",
          "#D0D5D8",
          "#D8DCDF",
          "#DFE2E4"
        ]
      },
      "concreto": {
        "cara": "#E8E6E1",
        "tapa": "#EFEDE9",
        "sombras": [
          "#D2CFC8",
          "#D9D6D0",
          "#DFDDD7",
          "#E4E2DC"
        ]
      },
      "vidrio": {
        "cara": "#F1F6FA",
        "tapa": "#F7FBFD",
        "sombras": [
          "#DFE9F1",
          "#E6EEF4",
          "#ECF2F7",
          "#F1F6FA"
        ]
      },
      "agua": {
        "cara": "#E4EEF7",
        "tapa": "#EEF4FA",
        "sombras": [
          "#BCD0E6",
          "#C9D9EB",
          "#D6E3F1",
          "#DDE8F4"
        ]
      },
      "amarillo": {
        "cara": "#F3E9A6",
        "tapa": "#F8F1C4",
        "sombras": [
          "#DCCF7E",
          "#E4D88D",
          "#EBE09A",
          "#EFE5A1"
        ]
      },
      "caucho": {
        "cara": "#5D666E",
        "tapa": "#6B747C",
        "sombras": [
          "#3E464D",
          "#475057",
          "#505960",
          "#576067"
        ]
      },
      "solido": {
        "cara": "#D9CFB8",
        "tapa": "#E3DBC8",
        "sombras": [
          "#A89464",
          "#B8A67A",
          "#C6B68F",
          "#CFC2A3"
        ]
      },
      "aceite": {
        "cara": "#F3E9BE",
        "tapa": "#F7F0D2",
        "sombras": [
          "#E3CF7A",
          "#E8D78E",
          "#EDDFA3",
          "#F0E4B0"
        ]
      },
      "cascara": {
        "cara": "#F5D9B3",
        "tapa": "#F8E4CA",
        "sombras": [
          "#E0922F",
          "#E6A757",
          "#EDBD7E",
          "#F1CB99"
        ]
      },
      "cobre": {
        "cara": "#E6CDB4",
        "tapa": "#EEDCCA",
        "sombras": [
          "#C49E7C",
          "#CEAC8D",
          "#D8BA9E",
          "#DFC4A9"
        ]
      },
      "antracita": {
        "cara": "#35383C",
        "tapa": "#3D4045",
        "sombras": [
          "#242628",
          "#282B2E",
          "#2E3034",
          "#323438"
        ]
      },
      "hueco": {
        "claro": "#AEB8C2",
        "medio": "#8A96A3",
        "oscuro": "#525C64"
      },
      "punto": "#FFF500",
      "rotulo": "#19222F"
    },
    "animaciones": {
      "tema": "uniandes",
      "fondo": "blanco"
    }
  };
  var M = P.materiales, B = P.base;
  P.color = function (ref) {
    if (/^#[0-9A-Fa-f]{6}$/.test(ref)) return ref;
    var p = ref.split('.');
    var c = p.length > 1 ? (M[p[0]] || {})[p[1]] : B[p[0]];
    if (!c) throw new Error('PALETA: «' + ref + '» no está en paleta.json');
    return c;
  };
  window.PALETA = P;
})();
