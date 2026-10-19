/** Cifras de la escuela: personas dirigidas, egresados, jurados, ponencias y publicaciones con cada
 *  estudiante. Se generan aparte, con las fuentes del registro académico, y no se editan a mano: cuando
 *  alguien se gradúa o entra, se vuelven a generar y la página se mueve con ellas. */
export const schoolFigures = {
  "people": 175,
  "record": 145,
  "recordFrom": "2018-10",
  "recordTo": "2026-10",
  "bothLevels": 5,
  "undergrad": 131,
  "masters": 41,
  "doctorate": 7,
  "current": {
    "phd": 3,
    "ms": 5
  },
  "coauthors": 13,
  "ug": {
    "known": 81,
    "abroad": 20,
    "byYear": [
      [2018, 11],
      [2019, 30],
      [2020, 10],
      [2021, 19],
      [2022, 22],
      [2023, 17],
      [2024, 13],
      [2025, 6],
      [2026, 3]
    ],
    "byType": [
      ["grado", 68],
      ["desarrollo", 57],
      ["especial", 20],
      ["especialMaestria", 5]
    ],
    "coAdvised": 85,
    "destinations": [
      ["industria", 63],
      ["posgrado", 9],
      ["academia", 5],
      ["emprendimiento", 2],
      ["sinDato", 2]
    ]
  },
  "graduates": {
    "total": 41,
    "known": 39,
    "destinations": [
      ["industry", 23],
      ["public", 1],
      ["academia", 9],
      ["phd", 2],
      ["own", 3],
      ["school", 1]
    ]
  },
  "firms": [
    ["Universidad de los Andes", 7],
    ["MSD", 4],
    ["Zimmer Biomet", 4],
    ["Quala", 4],
    ["Sanofi", 3]
  ],
  "firmsWithTwo": 6,
  "coAdvised": 93,
  "colleagues": 13,
  "colleaguesList": [
    ["Juan Carlos Cruz", 45],
    ["Diego Pradilla", 10],
    ["Andrés Fernando González", 9],
    ["Óscar Álvarez", 8],
    ["Nicolás Ríos Ratkovich", 6],
    ["María Hernández Carrión", 5],
    ["Jorge Mario Gómez", 5],
    ["Miguel Ángel Fernández Niño", 3],
    ["Juan Carlos Gómez", 1],
    ["Johanna Husserl", 1],
    ["Mayerlin Núñez", 1],
    ["Cristian F. Rodríguez", 1],
    ["Andrea Sánchez", 1]
  ],
  "withCruz": 45,
  "juries": {
    "total": 61,
    "dept": 46,
    "deptUg": 38,
    "deptMs": 8,
    "bio": 15,
    "bioAlsoAdvised": 7,
    "others": 54
  },
  "talks": {
    "since2017": 42,
    "withStudent": 33,
    "studentFirst": 27,
    "students": 22
  },
  "works": {
    "Carlos Manuel Ramírez Acosta": {
      "total": 5,
      "first": 2,
      "byYear": {
        "2020": 4,
        "2025": 1
      },
      "translations": 0
    },
    "Cristian F. Rodríguez": {
      "total": 12,
      "first": 8,
      "byYear": {
        "2023": 3,
        "2024": 2,
        "2025": 6,
        "2026": 1
      },
      "translations": 0
    },
    "Andrés Felipe Leal": {
      "total": 3,
      "first": 3,
      "byYear": {
        "2020": 1,
        "2022": 2
      },
      "translations": 0
    },
    "Brayan Rodríguez": {
      "total": 5,
      "first": 4,
      "byYear": {
        "2021": 1,
        "2023": 1,
        "2024": 1,
        "2025": 1,
        "2026": 1
      },
      "translations": 0
    },
    "Julian Daniel Torres Vanegas": {
      "total": 4,
      "first": 3,
      "byYear": {
        "2021": 1,
        "2022": 1,
        "2024": 1,
        "2025": 1
      },
      "translations": 0
    },
    "Julián Fernando Becerra-Encinales": {
      "total": 3,
      "first": 3,
      "byYear": {
        "2024": 1,
        "2025": 1,
        "2026": 1
      },
      "translations": 1
    }
  },
  "breweries": {
    "founded": 4,
    "still": 2
  }
};

export type SchoolWorks = { total: number; first: number; byYear: Record<string, number>; translations: number };
