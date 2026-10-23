// Huella de un código del aula, para `accessHash` o `staffAccessHash` en los
// datos del curso. El código en claro va al repositorio privado, nunca aquí.
//
//   node scripts/codigo-aula.mjs CODIGO [CODIGO…]
//
// Usa la misma sal y las mismas rondas que components/classroom/codigoAula.ts.
import { pbkdf2Sync } from 'node:crypto';

const SAL = 'aula.luishreyes';
const RONDAS = 100_000;

const codigos = process.argv.slice(2);
if (!codigos.length) {
  console.error('Uso: node scripts/codigo-aula.mjs CODIGO [CODIGO…]');
  process.exit(1);
}
for (const c of codigos) {
  console.log(pbkdf2Sync(c.trim().toUpperCase(), SAL, RONDAS, 32, 'sha256').toString('hex'));
}
