// Los códigos del aula no viven en el repositorio, que es público: cada curso
// guarda solo la huella del código (`accessHash`, `staffAccessHash`), y los
// códigos en claro están en el repositorio privado del profesor. La huella se
// saca del código en mayúsculas, así que la comparación sigue siendo
// case-insensitive.
//
// Es PBKDF2 y no un hash simple para que adivinar un código a partir de la
// huella cueste: cada intento pasa por 100 000 rondas. La sal es la misma en
// todos los cursos porque un semestre puede heredar el código del equipo
// docente del anterior (POU 2027-10 hereda el de 2026-20).
//
// Para sacar la huella de un código nuevo: node scripts/codigo-aula.mjs CODIGO

export const SAL = 'aula.luishreyes';
export const RONDAS = 100_000;

export const normalizarCodigo = (codigo: string): string => codigo.trim().toUpperCase();

export const huellaCodigo = async (codigo: string): Promise<string> => {
  const enc = new TextEncoder();
  const llave = await crypto.subtle.importKey('raw', enc.encode(normalizarCodigo(codigo)), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(SAL), iterations: RONDAS },
    llave,
    256,
  );
  return Array.from(new Uint8Array(bits), (b) => b.toString(16).padStart(2, '0')).join('');
};
