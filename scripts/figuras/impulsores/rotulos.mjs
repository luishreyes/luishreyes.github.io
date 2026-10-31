// Los nombres de los siete impulsores y de sus piezas, en español (el libro web) y en inglés (la edición impresa).
// Cada rótulo es [ancla, lado, texto]: el ancla es el punto que build.mjs deja en out/{impulsor}.json y el lado, la
// columna donde va el texto. Para traducir basta cambiar los textos: las anclas y los lados son los mismos.

export const IMPULSORES = [
  { id: 'helice', es: 'Hélice', en: 'Marine propeller' },
  { id: 'pbt', es: 'Palas inclinadas', en: 'Pitched-blade turbine' },
  { id: 'hidrofoil', es: 'Hidrofoil', en: 'Hydrofoil' },
  { id: 'rushton', es: 'Rushton', en: 'Rushton turbine' },
  { id: 'paleta', es: 'Paleta', en: 'Flat paddle' },
  { id: 'ancla', es: 'Ancla', en: 'Anchor' },
  { id: 'cinta', es: 'Cinta helicoidal', en: 'Helical ribbon' },
];

export const ROTULOS = {
  helice: [
    ['PALA', 'izq', 'Pala torcida'],
    ['CUBO', 'izq', 'Cubo'],
    ['TUERCA', 'izq', 'Tuerca del extremo'],
    ['EJE', 'der', 'Eje'],
    ['CHAVETA', 'der', 'Chaveta'],
    ['PRISIONERO', 'der', 'Prisionero'],
  ],
  pbt: [
    ['PALA', 'izq', 'Pala plana a 45°'],
    ['PERNOS', 'izq', 'Pernos de la pala'],
    ['CUBO', 'izq', 'Cubo'],
    ['EJE', 'der', 'Eje'],
    ['CHAVETA', 'der', 'Chaveta'],
    ['PRISIONERO', 'der', 'Prisionero'],
    ['OREJA', 'der', 'Oreja soldada'],
  ],
  hidrofoil: [
    ['PALA', 'izq', 'Pala con perfil de ala'],
    ['CUBO', 'izq', 'Cubo'],
    ['PERNO', 'izq', 'Perno del extremo'],
    ['EJE', 'der', 'Eje'],
    ['CHAVETA', 'der', 'Chaveta'],
    ['PRISIONERO', 'der', 'Prisionero'],
    ['PUNTA', 'der', 'Punta angosta'],
  ],
  rushton: [
    ['DISCO', 'izq', 'Disco'],
    ['PALA', 'izq', 'Pala plana vertical'],
    ['CUBO', 'izq', 'Cubo'],
    ['EJE', 'der', 'Eje'],
    ['CHAVETA', 'der', 'Chaveta'],
    ['SOPORTE', 'der', 'Soporte de la pala'],
    ['PERNOS', 'der', 'Pernos'],
  ],
  paleta: [
    ['OREJA', 'izq', 'Oreja soldada'],
    ['CUBO', 'izq', 'Cubo'],
    ['EJE', 'der', 'Eje'],
    ['CHAVETA', 'der', 'Chaveta'],
    ['PRISIONERO', 'der', 'Prisionero'],
    ['PALA', 'der', 'Pala plana'],
    ['PERNOS', 'der', 'Pernos de la pala'],
  ],
  ancla: [
    ['TIRANTE', 'izq', 'Tirante'],
    ['BRAZO', 'izq', 'Brazo en U'],
    ['CUBO', 'izq', 'Cubo'],
    ['EJE', 'der', 'Eje'],
    ['COLLAR', 'der', 'Collar'],
    ['PARED', 'der', 'Pared del tanque'],
    ['HOLGURA', 'der', 'Holgura de 30 mm'],
  ],
  cinta: [
    ['CINTA1', 'izq', 'Cinta helicoidal'],
    ['BRAZO', 'izq', 'Brazo'],
    ['CINTA2', 'izq', 'Segunda cinta, a 180°'],
    ['EJE', 'der', 'Eje'],
    ['COLLAR', 'der', 'Collar'],
    ['PARED', 'der', 'Pared del tanque, a 30 mm'],
  ],
};

// los mismos rótulos en inglés, por ancla (para la edición impresa o una lámina con nombres)
export const ROTULOS_EN = {
  helice: { PALA: 'Twisted blade', CUBO: 'Hub', TUERCA: 'End nut', EJE: 'Shaft', CHAVETA: 'Key', PRISIONERO: 'Set screw' },
  pbt: { PALA: 'Flat blade at 45°', PERNOS: 'Blade bolts', CUBO: 'Hub', EJE: 'Shaft', CHAVETA: 'Key', PRISIONERO: 'Set screw', OREJA: 'Welded lug' },
  hidrofoil: { PALA: 'Airfoil blade', CUBO: 'Hub', PERNO: 'End bolt', EJE: 'Shaft', CHAVETA: 'Key', PRISIONERO: 'Set screw', PUNTA: 'Narrow tip' },
  rushton: { DISCO: 'Disc', PALA: 'Flat vertical blade', CUBO: 'Hub', EJE: 'Shaft', CHAVETA: 'Key', SOPORTE: 'Blade clip', PERNOS: 'Bolts' },
  paleta: { PALA: 'Flat blade', PERNOS: 'Blade bolts', CUBO: 'Hub', EJE: 'Shaft', CHAVETA: 'Key', PRISIONERO: 'Set screw', OREJA: 'Welded lug' },
  ancla: { TIRANTE: 'Cross arm', BRAZO: 'U-shaped arm', CUBO: 'Hub', EJE: 'Shaft', COLLAR: 'Collar', PARED: 'Tank wall', HOLGURA: '30 mm clearance' },
  cinta: { CINTA1: 'Helical ribbon', BRAZO: 'Support arm', CINTA2: 'Second ribbon, 180° apart', EJE: 'Shaft', COLLAR: 'Collar', PARED: 'Tank wall, 30 mm away' },
};

// lo que lee un lector de pantalla en cada vista
export const DESCRIPCION = {
  helice: 'Hélice marina de tres palas, en isométrico. Un cubo fundido en una pieza con tres palas anchas, torcidas y de punta redonda, con paso igual al diámetro, que empujan el líquido hacia abajo. Arriba, el trozo de eje con su chaveta; en el cubo, un prisionero; abajo, la arandela y la tuerca del extremo del eje. Va con el mismo diámetro y a la misma escala que las otras turbinas.',
  pbt: 'Turbina de cuatro palas inclinadas a 45°, en isométrico. Un cubo cuadrado con cuatro orejas soldadas, y en cada oreja una pala plana de un quinto del diámetro de ancho sujeta con dos pernos, con el borde de ataque arriba para que bombee hacia abajo. Arriba, el eje con su chaveta; en el cubo, dos prisioneros; abajo, la arandela y el perno del extremo del eje. Va con el mismo diámetro y a la misma escala que las otras turbinas.',
  hidrofoil: 'Hidrofoil de tres palas, en isométrico. Palas anchas junto al cubo que se angostan hacia la punta, torcidas y con curvatura, más inclinadas en el cubo que en la punta. Arriba, el eje con su chaveta; en el cubo, un prisionero; abajo, la arandela y el perno del extremo del eje. Va con el mismo diámetro y a la misma escala que las otras turbinas.',
  rushton: 'Turbina Rushton, en isométrico. Un disco horizontal de tres cuartos del diámetro, con su cubo encima, y seis palas planas verticales de un cuarto del diámetro de largo y un quinto de alto, montadas sobre el borde del disco con una ranura y empernadas a un soporte arriba y otro abajo, así media pala queda sobre el disco. Arriba, el eje con su chaveta; abajo, la arandela y el perno del extremo. Va con el mismo diámetro y a la misma escala que las otras turbinas.',
  paleta: 'Paleta plana de dos palas, en isométrico. Dos palas verticales de un quinto del diámetro de alto, cada una empernada con cuatro pernos a una oreja soldada al cubo. Arriba, el eje con su chaveta; en el cubo, un prisionero; abajo, la arandela y el perno del extremo. Va con el mismo diámetro y a la misma escala que las otras turbinas.',
  ancla: 'Ancla en isométrico, dentro de la mitad de atrás de su tanque de 1,2 m. Un brazo en U de un décimo del diámetro de ancho sube junto a la pared y sigue el fondo elíptico; mide el 95 % del diámetro del tanque, así pasa a 30 mm de la pared y del fondo. El cubo va abajo, en el extremo del eje, y arriba dos tirantes unen los brazos a un collar. Va a otra escala que las turbinas.',
  cinta: 'Cinta helicoidal doble en isométrico, dentro de la mitad de atrás de su tanque de 1,2 m. Dos cintas de un décimo del diámetro de ancho dan una vuelta cada una, a 180° entre sí, con paso igual al diámetro; miden el 95 % del diámetro del tanque y pasan a 30 mm de la pared. Brazos abajo, en el medio y arriba las sujetan a tres collares en el eje. Va a otra escala que las turbinas.',
};
