import type { Localized } from '../../context/i18n';

/** Con quién investiga y forma el profesor desde 2018: personas dentro de la Universidad, instituciones fuera de
 *  ella. Cada vínculo trae solo su nivel (1 ocasional, 2 frecuente, 3 constante), que suma publicaciones,
 *  estudiantes codirigidos, proyectos, patentes y redes. Se genera aparte y no se edita a mano. */
export interface NetworkPerson { name: Localized; label: Localized; level: 1 | 2 | 3; also?: string }
export interface NetworkGroup { id: string; name: Localized; short: Localized; people: NetworkPerson[] }
export interface NetworkBranch { id: string; name: Localized; short: Localized; groups: NetworkGroup[] }

export const researchNetwork: {
  totals: { people: number; uniandes: number; units: number; colombia: number; abroad: number };
  branches: NetworkBranch[];
} = {
  "totals": {
    "people": 50,
    "uniandes": 19,
    "units": 8,
    "colombia": 14,
    "abroad": 17
  },
  "branches": [
    {
      "id": "uniandes",
      "name": "Universidad de los Andes",
      "short": "Uniandes",
      "groups": [
        {
          "id": "ingenieria-quimica-y-de-alimentos",
          "name": {
            "es": "Ingeniería Química y de Alimentos",
            "en": "Chemical and Food Engineering"
          },
          "short": {
            "es": "Química y Alimentos",
            "en": "Chemical and Food"
          },
          "people": [
            {
              "name": "Óscar Álvarez",
              "label": "Óscar Álvarez",
              "level": 3
            },
            {
              "name": "Diego Pradilla",
              "label": "Diego Pradilla",
              "level": 3
            },
            {
              "name": "Andrés Fernando González Barrios",
              "label": "Andrés González Barrios",
              "level": 3
            },
            {
              "name": "Nicolás Ríos Ratkovich",
              "label": "Nicolás Ríos Ratkovich",
              "level": 2
            },
            {
              "name": "Jorge Mario Gómez",
              "label": "Jorge Mario Gómez",
              "level": 2
            },
            {
              "name": "María Hernández Carrión",
              "label": "María Hernández Carrión",
              "level": 2
            },
            {
              "name": "Andrea Sánchez-Camargo",
              "label": "Andrea Sánchez-Camargo",
              "level": 1
            }
          ]
        },
        {
          "id": "ingenieria-biomedica",
          "name": {
            "es": "Ingeniería Biomédica",
            "en": "Biomedical Engineering"
          },
          "short": {
            "es": "Biomédica",
            "en": "Biomedical"
          },
          "people": [
            {
              "name": "Juan Carlos Cruz",
              "label": "Juan Carlos Cruz",
              "level": 3
            },
            {
              "name": "Carolina Muñoz-Camargo",
              "label": "Carolina Muñoz-Camargo",
              "level": 3
            },
            {
              "name": "Natasha Bloch",
              "label": "Natasha Bloch",
              "level": 2
            },
            {
              "name": "Pablo Arbeláez",
              "label": "Pablo Arbeláez",
              "level": 2
            }
          ]
        },
        {
          "id": "ingenieria-electrica-y-electronica",
          "name": {
            "es": "Ingeniería Eléctrica y Electrónica",
            "en": "Electrical and Electronic Engineering"
          },
          "short": {
            "es": "Electrónica",
            "en": "Electronics"
          },
          "people": [
            {
              "name": "Johann F. Osma",
              "label": "Johann F. Osma",
              "level": 2,
              "also": "ingenieria-biomedica"
            }
          ]
        },
        {
          "id": "administracion",
          "name": {
            "es": "Facultad de Administración",
            "en": "School of Management"
          },
          "short": {
            "es": "Administración",
            "en": "Management"
          },
          "people": [
            {
              "name": "Felipe Reinoso-Carvalho",
              "label": "Felipe Reinoso-Carvalho",
              "level": 2
            }
          ]
        },
        {
          "id": "ciencias-biologicas",
          "name": {
            "es": "Ciencias Biológicas",
            "en": "Biological Sciences"
          },
          "short": {
            "es": "Biológicas",
            "en": "Biological Sciences"
          },
          "people": [
            {
              "name": "María Francisca Villegas-Torres",
              "label": "María Francisca Villegas-Torres",
              "level": 1
            },
            {
              "name": "Josman Velasco",
              "label": "Josman Velasco",
              "level": 1
            }
          ]
        },
        {
          "id": "ingenieria-civil-y-ambiental",
          "name": {
            "es": "Ingeniería Civil y Ambiental",
            "en": "Civil and Environmental Engineering"
          },
          "short": {
            "es": "Civil y Ambiental",
            "en": "Civil and Environmental"
          },
          "people": [
            {
              "name": "Johana Husserl",
              "label": "Johana Husserl",
              "level": 1
            }
          ]
        },
        {
          "id": "microscopia-microcore",
          "name": {
            "es": "Centro de Microscopía (MicroCore)",
            "en": "Microscopy Center (MicroCore)"
          },
          "short": "MicroCore",
          "people": [
            {
              "name": "Juan Camilo Orozco",
              "label": "Juan Camilo Orozco",
              "level": 1
            }
          ]
        },
        {
          "id": "ensenanza-y-aprendizaje",
          "name": {
            "es": "Enseñanza y aprendizaje",
            "en": "Teaching and learning"
          },
          "short": {
            "es": "Enseñanza",
            "en": "Teaching"
          },
          "people": [
            {
              "name": {
                "es": "Alison Reedy y María Lucía Guerrero",
                "en": "Alison Reedy and María Lucía Guerrero"
              },
              "label": {
                "es": "Alison Reedy y María Lucía Guerrero",
                "en": "Alison Reedy and María Lucía Guerrero"
              },
              "level": 1
            },
            {
              "name": "Carola Hernández",
              "label": "Carola Hernández",
              "level": 1
            }
          ]
        }
      ]
    },
    {
      "id": "colombia",
      "name": "Colombia",
      "short": "Colombia",
      "groups": [
        {
          "id": "universidades",
          "name": {
            "es": "Universidades",
            "en": "Universities"
          },
          "short": {
            "es": "Universidades",
            "en": "Universities"
          },
          "people": [
            {
              "name": "Pontificia Universidad Javeriana",
              "label": "Pontificia Universidad Javeriana",
              "level": 3
            },
            {
              "name": "Universidad de Cartagena",
              "label": "Universidad de Cartagena",
              "level": 2
            },
            {
              "name": "Universidad Antonio Nariño",
              "label": "Universidad Antonio Nariño",
              "level": 2
            },
            {
              "name": "Universidad de Antioquia",
              "label": "Universidad de Antioquia",
              "level": 2
            },
            {
              "name": "Universidad Nacional de Colombia",
              "label": "Universidad Nacional de Colombia",
              "level": 1
            },
            {
              "name": "Universidad de Ciencias Aplicadas y Ambientales (U.D.C.A)",
              "label": "U.D.C.A",
              "level": 1
            },
            {
              "name": "Corporación Universitaria Minuto de Dios",
              "label": "Uniminuto",
              "level": 1
            },
            {
              "name": "Universidad del Rosario",
              "label": "Universidad del Rosario",
              "level": 1
            },
            {
              "name": "Universidad de Pamplona",
              "label": "Universidad de Pamplona",
              "level": 1
            }
          ]
        },
        {
          "id": "centros-salud-y-empresas",
          "name": {
            "es": "Centros, salud y empresas",
            "en": "Research centers, health and companies"
          },
          "short": {
            "es": "Centros y empresas",
            "en": "Centers and companies"
          },
          "people": [
            {
              "name": "Enel Colombia",
              "label": "Enel Colombia",
              "level": 3
            },
            {
              "name": "Corporación Centro de Investigación en Palma de Aceite (Cenipalma)",
              "label": "Cenipalma",
              "level": 2
            },
            {
              "name": "Fundación Santa Fe de Bogotá",
              "label": "Fundación Santa Fe de Bogotá",
              "level": 1
            },
            {
              "name": "Technifarm",
              "label": "Technifarm",
              "level": 1
            },
            {
              "name": "BIO D",
              "label": "BIO D",
              "level": 1
            }
          ]
        }
      ]
    },
    {
      "id": "mundo",
      "name": {
        "es": "Otros países",
        "en": "Other countries"
      },
      "short": {
        "es": "Otros países",
        "en": "Other countries"
      },
      "groups": [
        {
          "id": "estados-unidos",
          "name": {
            "es": "Estados Unidos",
            "en": "United States"
          },
          "short": {
            "es": "Estados Unidos",
            "en": "United States"
          },
          "people": [
            {
              "name": "National Renewable Energy Laboratory",
              "label": "National Renewable Energy Laboratory",
              "level": 2
            },
            {
              "name": "Seton Hall University",
              "label": "Seton Hall University",
              "level": 2
            },
            {
              "name": "University of South Florida",
              "label": "University of South Florida",
              "level": 2
            },
            {
              "name": "Cornell University",
              "label": "Cornell University",
              "level": 1
            },
            {
              "name": "Purdue University",
              "label": "Purdue University",
              "level": 1
            },
            {
              "name": "Nemours Children's Health",
              "label": "Nemours Children's Health",
              "level": 1
            },
            {
              "name": "Texas A&M University",
              "label": "Texas A&M University",
              "level": 1
            }
          ]
        },
        {
          "id": "mexico-y-chile",
          "name": {
            "es": "México y Chile",
            "en": "Mexico and Chile"
          },
          "short": {
            "es": "México y Chile",
            "en": "Mexico and Chile"
          },
          "people": [
            {
              "name": "Tecnológico de Monterrey",
              "label": "Tecnológico de Monterrey",
              "level": 2
            },
            {
              "name": "Pontificia Universidad Católica de Chile",
              "label": "Pontificia Universidad Católica de Chile",
              "level": 2
            }
          ]
        },
        {
          "id": "brasil",
          "name": {
            "es": "Brasil",
            "en": "Brazil"
          },
          "short": {
            "es": "Brasil",
            "en": "Brazil"
          },
          "people": [
            {
              "name": "Grupo Boticário",
              "label": "Grupo Boticário",
              "level": 1
            }
          ]
        },
        {
          "id": "europa",
          "name": {
            "es": "Europa",
            "en": "Europe"
          },
          "short": {
            "es": "Europa",
            "en": "Europe"
          },
          "people": [
            {
              "name": "Iscte, Instituto Universitário de Lisboa",
              "label": {
                "es": "Iscte, Lisboa",
                "en": "Iscte, Lisbon"
              },
              "level": 1
            },
            {
              "name": "Wageningen University & Research",
              "label": "Wageningen University & Research",
              "level": 1
            },
            {
              "name": "University of Groningen",
              "label": "University of Groningen",
              "level": 1
            },
            {
              "name": "Universidad de Málaga",
              "label": "Universidad de Málaga",
              "level": 1
            },
            {
              "name": "Leibniz Institute of Plant Biochemistry",
              "label": "Leibniz Institute of Plant Biochemistry",
              "level": 2
            }
          ]
        },
        {
          "id": "asia",
          "name": "Asia",
          "short": "Asia",
          "people": [
            {
              "name": "Xinyang Normal University",
              "label": "Xinyang Normal University",
              "level": 1
            }
          ]
        },
        {
          "id": "redes",
          "name": {
            "es": "Redes",
            "en": "Networks"
          },
          "short": {
            "es": "Redes",
            "en": "Networks"
          },
          "people": [
            {
              "name": {
                "es": "Red AIGEN",
                "en": "AIGEN network"
              },
              "label": {
                "es": "Red AIGEN, 55 universidades",
                "en": "AIGEN network, 55 universities"
              },
              "level": 2
            }
          ]
        }
      ]
    }
  ]
};
