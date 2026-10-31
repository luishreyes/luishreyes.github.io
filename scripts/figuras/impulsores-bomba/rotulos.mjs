// Los nombres de los cuatro impulsores de bomba y de sus piezas, en español (el libro web) y en inglés (la edición
// impresa). Cada rótulo es [ancla, lado, texto]: el ancla es el punto que build.mjs deja en out/{impulsor}.json y el
// lado, la columna donde va el texto. Para traducir basta cambiar los textos: las anclas y los lados son los mismos.

export const IMPULSORES = [
  { id: 'cerrado', es: 'Cerrado', en: 'Closed' },
  { id: 'semiabierto', es: 'Semiabierto', en: 'Semi-open' },
  { id: 'abierto', es: 'Abierto', en: 'Open' },
  { id: 'axial', es: 'Axial', en: 'Axial-flow' },
];

export const ROTULOS = {
  cerrado: [
    ['OJO', 'izq', 'Ojo'],
    ['TUERCA', 'izq', 'Tuerca del impulsor'],
    ['ALABE', 'izq', 'Álabe'],
    ['TAPA_TRAS', 'izq', 'Tapa trasera'],
    ['ANILLO', 'der', 'Anillo de desgaste'],
    ['AGUJERO', 'der', 'Agujero de balance'],
    ['TAPA_DEL', 'der', 'Tapa delantera, cortada'],
  ],
  semiabierto: [
    ['TUERCA', 'izq', 'Tuerca del impulsor'],
    ['ENTRADA', 'izq', 'Borde de ataque'],
    ['CUBO', 'izq', 'Cubo, en corte'],
    ['ALABE', 'izq', 'Álabe'],
    ['TAPA_TRAS', 'izq', 'Tapa trasera'],
    ['BORDE', 'der', 'Borde libre del álabe'],
    ['CHAVETA', 'der', 'Chaveta'],
    ['EJE', 'der', 'Eje'],
  ],
  abierto: [
    ['TUERCA', 'izq', 'Tuerca del impulsor'],
    ['CUBO', 'izq', 'Cubo, en corte'],
    ['NERVIO', 'izq', 'Tapa trasera recortada'],
    ['ALABE', 'izq', 'Álabe'],
    ['BORDE', 'der', 'Borde libre del álabe'],
    ['CHAVETA', 'der', 'Chaveta'],
    ['EJE', 'der', 'Eje'],
  ],
  axial: [
    ['CONO', 'izq', 'Cono de entrada, cortado'],
    ['ALABE', 'izq', 'Álabe torcido'],
    ['EJE', 'izq', 'Eje'],
    ['HOLGURA', 'izq', 'Holgura de 0,6 mm'],
    ['CARCASA', 'der', 'Carcasa, mitad de atrás'],
    ['TUERCA', 'der', 'Tuerca del impulsor'],
    ['PUNTA', 'der', 'Perfil del álabe'],
    ['CUBO', 'der', 'Cubo'],
  ],
};

// los mismos rótulos en inglés, por ancla (para la edición impresa o una lámina con nombres)
export const ROTULOS_EN = {
  cerrado: { OJO: 'Eye', TUERCA: 'Impeller nut', ALABE: 'Vane', TAPA_TRAS: 'Back shroud', ANILLO: 'Wear ring', AGUJERO: 'Balance hole', TAPA_DEL: 'Front shroud, cut away' },
  semiabierto: { TUERCA: 'Impeller nut', ENTRADA: 'Leading edge', ALABE: 'Vane', TAPA_TRAS: 'Back shroud', BORDE: 'Open vane edge', CUBO: 'Hub, sectioned', CHAVETA: 'Key', EJE: 'Shaft' },
  abierto: { TUERCA: 'Impeller nut', ALABE: 'Vane', NERVIO: 'Scalloped back shroud', BORDE: 'Open vane edge', CUBO: 'Hub, sectioned', CHAVETA: 'Key', EJE: 'Shaft' },
  axial: { CONO: 'Nose cone, cut away', CUBO: 'Hub', ALABE: 'Twisted blade', EJE: 'Shaft', TUERCA: 'Impeller nut', PUNTA: 'Blade section', HOLGURA: '0.6 mm tip clearance', CARCASA: 'Casing, back half' },
};

// lo que lee un lector de pantalla en cada vista
export const DESCRIPCION = {
  cerrado: 'Impulsor cerrado en isométrico, con el ojo hacia arriba. Seis álabes curvados hacia atrás van entre la tapa trasera y la tapa delantera; a la delantera se le quitó un sector frente al lector para verlos. En el centro, el ojo, con el anillo de desgaste sobre su cuello; adentro se ven los bordes de ataque, un agujero de balance en la tapa trasera y la tuerca del impulsor sobre el cubo. Mide 190 mm, como el impulsor de la bomba del caso, y va a la misma escala que el semiabierto y el abierto.',
  semiabierto: 'Impulsor semiabierto en isométrico: los mismos seis álabes del cerrado sobre la tapa trasera, sin tapa delantera, así su borde libre queda a la vista; ese borde pasa muy cerca de la carcasa. Al cubo se le quitó el cuarto que mira al lector para ver el eje y la chaveta; encima, la arandela, la tuerca del impulsor y la punta roscada del eje. Misma escala que el cerrado y el abierto.',
  abierto: 'Impulsor abierto en isométrico: los mismos seis álabes casi sin tapas; de la trasera solo queda un disco junto al cubo, con un nervio corto bajo cada álabe, y de ahí afuera los álabes van libres. Abajo se ven el cubo de atrás y el eje. Al cubo se le quitó el cuarto que mira al lector para ver la chaveta. Misma escala que el cerrado y el semiabierto.',
  axial: 'Impulsor de una bomba axial en isométrico, dentro de la mitad de atrás de su carcasa con bridas. Un cubo grande, de la mitad del diámetro, lleva cuatro álabes torcidos de perfil delgado, más inclinados junto al cubo que en la punta; las puntas pasan a 0,6 mm de la carcasa. Arriba, el cono de entrada, sin el cuarto de adelante, deja ver la arandela y la tuerca del impulsor; abajo sale el eje. El impulsor mide 300 mm y va a otra escala que los radiales.',
};
