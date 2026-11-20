// Los nombres de las piezas de la etapa del TASTE, en español (la vista del libro) y en inglés (la lámina de la edición
// impresa). Cada rótulo es [ancla, lado, texto, opciones]: el ancla es un punto de build.mjs (out/fig_data.json, o
// out/detalle_data.json si empieza por «d:»), el lado dice dónde va el texto ('izq' o 'der' del dibujo) y las opciones
// corren el texto ({ dy }) o lo fijan ({ x, y }, en las unidades de la vista). libro.mjs los acomoda a la altura de su
// pieza, sin encimarse. Sin códigos ni datos del caso: esos los da el pie del capítulo.
export const ROTULOS = [
  // a la izquierda, arriba: la llegada del jugo, la cámara de reparto y el vapor de calentamiento
  ['JUGO', 'izq', 'Jugo caliente de la etapa anterior'],
  ['VENTURI', 'izq', 'Tubo reducido con Venturi'],
  ['CONO_T', 'izq', 'Cono de reparto'],
  ['ESPEJO_T', 'izq', 'Espejo de arriba, con\nlas bocas de los tubos'],
  ['VAPOR', 'izq', 'Vapor de calentamiento,\ndel efecto anterior'],
  ['GUIA', 'izq', 'Guía'],
  // el círculo del detalle: la boca de un tubo
  ['d:D_NIEBLA', 'izq', 'Niebla de jugo'],
  ['d:D_BOCA', 'izq', 'Jugo que entra por el borde'],
  ['d:D_ESPEJO', 'izq', 'Espejo, en corte'],
  ['d:D_PARED', 'izq', 'Pared del tubo'],
  ['d:D_PELICULA', 'izq', 'Película que se forma'],
  ['d:D_VAPOR', 'izq', 'Vapor del jugo'],
  ['d:D_CALEFACCION', 'izq', 'Vapor de calentamiento'],
  // a la izquierda, abajo: la calandria y la línea de la mezcla
  ['CALANDRIA', 'izq', 'Calandria'],
  ['SOPORTE', 'izq', 'Placa soporte'],
  ['CORAZA', 'izq', 'Coraza, en corte'],
  ['ESPEJO_B', 'izq', 'Espejo de abajo'],
  ['CONO_B', 'izq', 'Cámara de abajo:\nel jugo y su vapor'],
  ['MEZCLA', 'izq', 'Línea de la mezcla'],
  ['PERSONA', 'izq', 'Persona de 1,75 m'],
  // a la derecha: el venteo, los tubos, los apoyos, el separador y la bomba
  ['VENTEO', 'der', 'Venteo de incondensables\ny aromas'],
  ['TUBOS', 'der', 'Tubos: el jugo baja\nen película por la pared'],
  ['OREJA', 'der', 'Oreja de apoyo'],
  ['ESTRUCTURA', 'der', 'Estructura'],
  ['VAPOR_SIG', 'der', 'Vapor al efecto siguiente'],
  ['CONDENSADO', 'der', 'Salida del condensado'],
  ['SEPARADOR', 'der', 'Separador ciclónico'],
  ['ENTRADA_T', 'der', 'Entrada tangencial'],
  ['SEP_CONO', 'der', 'Salida del jugo'],
  ['DESCARGA', 'der', 'Jugo a la etapa siguiente'],
  ['BOMBA', 'der', 'Bomba centrífuga'],
];

export const ROTULOS_EN = [
  ['JUGO', 'izq', 'Hot juice from the previous stage'],
  ['VENTURI', 'izq', 'Venturi feed pipe'],
  ['CONO_T', 'izq', 'Distribution cone'],
  ['ESPEJO_T', 'izq', 'Top tubesheet'],
  ['VAPOR', 'izq', 'Heating vapor'],
  ['d:D_NIEBLA', 'izq', 'Juice mist'],
  ['d:D_BOCA', 'izq', 'Juice entering at the rim'],
  ['d:D_ESPEJO', 'izq', 'Tubesheet (cut)'],
  ['d:D_PARED', 'izq', 'Tube wall'],
  ['d:D_PELICULA', 'izq', 'Film forming'],
  ['d:D_VAPOR', 'izq', 'Juice vapor'],
  ['d:D_CALEFACCION', 'izq', 'Heating vapor'],
  ['CALANDRIA', 'izq', 'Calandria'],
  ['SOPORTE', 'izq', 'Support plate'],
  ['CORAZA', 'izq', 'Shell (cut)'],
  ['CONO_B', 'izq', 'Bottom chamber'],
  ['MEZCLA', 'izq', 'Juice and vapor'],
  ['PERSONA', 'izq', 'Person, 1.75 m'],
  ['VENTEO', 'der', 'Noncondensable vent'],
  ['TUBOS', 'der', 'Tubes: falling film'],
  ['OREJA', 'der', 'Support lug'],
  ['VAPOR_SIG', 'der', 'Vapor to the next effect'],
  ['CONDENSADO', 'der', 'Condensate outlet'],
  ['SEPARADOR', 'der', 'Cyclone separator'],
  ['ENTRADA_T', 'der', 'Tangential inlet'],
  ['DESCARGA', 'der', 'Juice to the next stage'],
  ['BOMBA', 'der', 'Centrifugal pump'],
];

// el nombre del círculo, debajo de él (m: cuántas veces más grande)
export const PIES = (m) => [`La boca de un tubo, ×${m}`];
export const PIES_EN = (m) => [`One tube inlet, ×${m}`];

export const DESCRIPCION = 'Una etapa de un evaporador TASTE de jugo de naranja, en isométrico, con una persona de 1,75 m de pie en el piso para la escala. ' +
  'A la izquierda, la calandria: un haz vertical de tubos largos dentro de una coraza, cortado por el plano de su eje para ver adentro, casi diez veces más alto que la persona. ' +
  'Arriba, el jugo caliente de la etapa anterior llega por un tubo reducido con un Venturi, cortado, y se abre en el cono de reparto en una niebla que baja hacia las bocas de los tubos, en el espejo de arriba. ' +
  'En los tubos de la fila del corte se ve el jugo, que baja en película por la pared; detrás va la fila siguiente, entera, y tres placas soporte cruzan el haz. ' +
  'El vapor de calentamiento del efecto anterior entra a la coraza arriba, a la izquierda; arriba, a la derecha, sale el venteo de los incondensables y los aromas, con su válvula; abajo, a la derecha, el condensado. ' +
  'La calandria se apoya en dos orejas sobre una estructura de dos columnas, con una guía cerca del espejo de arriba. ' +
  'Abajo, la cámara con su cono recoge el jugo y su vapor y los manda por la línea de la mezcla, que baja, da la vuelta en un codo y entra tangencial al separador ciclónico, a la derecha. ' +
  'Del separador, el vapor sale por arriba hacia el efecto siguiente y el jugo baja por el cono a una bomba centrífuga, delante, que lo manda a la etapa siguiente. ' +
  'Un círculo a la izquierda amplía la boca de un tubo en el espejo de arriba, abierta por su eje: la niebla de jugo que baja, las bocas vecinas con el jugo que entra por el borde, la película que se forma en la pared y engruesa hacia abajo, el vapor del jugo que baja por el centro y, bajo el espejo, el vapor de calentamiento entre los tubos.';

export const DESCRIPCION_EN = 'One stage of a TASTE evaporator for orange juice, in isometric, with a 1.75 m person standing on the floor for scale. ' +
  'On the left, the calandria: a vertical bundle of long tubes in a shell, cut along its axis to show the inside, almost ten times as tall as the person. ' +
  'At the top, hot juice from the previous stage arrives through a Venturi feed pipe, shown in section, and opens in the distribution cone into a mist that falls toward the tube inlets in the top tubesheet. ' +
  'In the tubes of the cut row the juice is seen running down the wall as a film; behind them is the next row, whole, and three support plates cross the bundle. ' +
  'Heating vapor from the previous effect enters the shell at the top left; at the top right, the vent for noncondensables and aromas leaves through its valve; at the bottom right, the condensate. ' +
  'The calandria rests on two lugs on a two-column frame, with a guide near the top tubesheet. ' +
  'At the bottom, the chamber and its cone collect the juice and its vapor and send them down the mixture line, which turns in an elbow and enters the cyclone separator, on the right, tangentially. ' +
  'From the separator, the vapor leaves at the top toward the next effect and the juice flows down the cone to a centrifugal pump in front, which sends it to the next stage. ' +
  'A circle on the left enlarges one tube inlet in the top tubesheet, opened along its axis: the falling juice mist, the neighboring inlets with juice entering at the rim, the film forming on the wall and thickening downward, the juice vapor flowing down the center and, below the tubesheet, the heating vapor between the tubes.';
