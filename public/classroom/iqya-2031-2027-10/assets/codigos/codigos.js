/* Copia de libro/figuras/los-diagramas-de-ingenieria/codigos.js para las presentaciones de 2027-10, con un
   solo cambio: el alto del plano se mide en píxeles de la página (clientHeight), porque deck-stage escala
   la diapositiva y getBoundingClientRect devolvería el alto escalado.

   El recuadro «Pruebe» del capítulo 2: «Lea un código», sobre el P&ID de V-102.
   El dibujo es el de la figura del P&ID: herramientas/diagramas-benceno.mjs lo escribe también en
   pid-v102.js, con lo que pertenece a cada código. Cada globo, código de equipo y número de línea se
   toca o se escoge con el teclado: queda en amarillo, el resto se apaga, su lazo queda a plena tinta
   con las señales marcadas, y al lado sale cómo se lee. En el teléfono el plano se desliza de lado y
   la lectura baja debajo de él. El campo de texto lee cualquier otro código: el de un equipo (formato
   XX-YZZ A/B), la etiqueta de un instrumento (letras de ANSI/ISA-5.1-2009) o el número de
   una línea; si está en el plano, lo escoge ahí. Solo lee las letras de uso frecuente de la tabla del
   capítulo; para las demás remite a la norma. Usa figuras/comun/pruebe.js. */
(function () {
  'use strict';
  var P = window.Pruebe, D = window.PID_V102;
  if (!P || !D) return;
  var h = P.h, s = P.s;
  var PA = window.PALETA, E = PA.esquemas;   // la paleta del libro (figuras/comun/paleta.js)
  var AMARILLO = E.resaltado, NAVY = E.trazo, SEC = E['texto-2'], BORDE = PA.base.borde, BLANCO = E['equipo-relleno'];
  var RELLENO = { globo: 1, valvula: 1, enclavamiento: 1 };
  var UMBRAL = 760, ANCHO_MOVIL = 980;

  var EQUIPOS = {
    C: 'compresor o turbina', D: 'secador', E: 'intercambiador de calor', F: 'filtro', H: 'calentador de fuego directo (horno)',
    P: 'bomba', R: 'reactor', S: 'separador de sólidos de un gas (ciclón)', T: 'torre', TK: 'tanque de almacenamiento', V: 'recipiente'
  };
  // Primera letra: la variable, con su forma después de «de».
  var VARIABLE = {
    A: 'análisis', E: 'voltaje', F: 'flujo', H: 'manual', I: 'corriente', J: 'potencia', K: 'tiempo', L: 'nivel',
    P: 'presión', Q: 'cantidad', S: 'velocidad', T: 'temperatura', V: 'vibración', W: 'peso', Y: 'evento', Z: 'posición'
  };
  var USUARIO = { C: 1, D: 1, G: 1, M: 1, N: 1, O: 1 };
  // Letras siguientes: la función.
  var FUNCION = {
    A: 'alarma', C: 'controlador', E: 'elemento primario', G: 'visor', I: 'indicador', K: 'estación de control',
    L: 'luz piloto', O: 'orificio', P: 'punto de prueba', R: 'registrador', S: 'interruptor', T: 'transmisor',
    U: 'instrumento multifunción', V: 'válvula', W: 'termopozo', X: 'accesorio', Y: 'relé, cálculo o convertidor', Z: 'accionador'
  };
  // Servicio de una línea: el capítulo usa P y FL.
  var SERVICIO = { P: 'proceso', FL: 'tea' };
  // Ejemplos que no están en este plano.
  var OTROS = ['E-105', 'TK-101', 'FFC-103', 'PDT-215', 'VT-500', 'ZSC-210'];

  // Un código no se parte en el guion al final de un renglón.
  function sinCorte(html) {
    return html.replace(/(\d+(?:,\d+)?″-[A-Z]+-\d+-[A-Z0-9]+|\b[A-Z]{1,4}-\d{3}(?: A\/B)?)/g, '<span style="white-space:nowrap">$1</span>');
  }
  function escapar(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function lista(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' y ' + a[a.length - 1]; }
  function css(e, t) { e.style.cssText += ';' + t; return e; }

  // ── La lectura de un código ───────────────────────────────────────────
  function leerEquipo(m) {
    var piezas = [
      { rot: 'Clase', val: m[1], det: EQUIPOS[m[1]] },
      { rot: 'Área', val: m[2], det: 'área ' + m[2] + '00 de la planta' },
      { rot: 'Consecutivo', val: m[3], det: 'el n.º ' + parseInt(m[3], 10) + ' de su clase en el área' }
    ];
    var art = (m[1] === 'P' || m[1] === 'T') ? 'Una ' : 'Un ';
    var frase = art + EQUIPOS[m[1]] + ' del área ' + m[2] + '00, ' + (art === 'Una ' ? 'la' : 'el') + ' n.º ' + parseInt(m[3], 10) + ' de su clase.';
    if (m[4]) {
      var n = m[4].split('/').length;
      piezas.push({ rot: 'Unidades', val: m[4], det: n > 1 ? n + ' unidades iguales' : 'una de varias unidades iguales' });
      frase += n > 1 ? ' Son ' + n + ' unidades iguales, en paralelo o de reserva: el PFD dibuja una; el P&ID, todas.'
        : ' La ' + m[4] + ' marca una de varias unidades iguales, en paralelo o de reserva: el PFD dibuja una; el P&ID, todas.';
    }
    var notas = [];
    if (m[1] === 'TK') notas.push('Con las letras de la ISA, TK sería una estación de control de temperatura. El dibujo decide: un globo es un instrumento; un tanque, un equipo.');
    if (m[1] === 'T') notas.push('En un código de equipo la T es una torre; un instrumento nunca lleva una sola letra.');
    return { tipo: 'Equipo · XX-YZZ', piezas: piezas, frase: frase, notas: notas };
  }

  function leerInstrumento(letras, lazo, sufijo) {
    var piezas = [], notas = [], i = 1;
    var v = letras[0], variable = VARIABLE[v], seguridad = false, modVar = '';
    if (!variable) {
      if (USUARIO[v]) { variable = 'la variable que defina la leyenda'; notas.push(v + ' es de libre elección del usuario: su significado lo da la leyenda del plano (ISA-5.1-2009). Las tablas antiguas la usaban con un significado fijo.'); }
      else return { error: 'La primera letra ' + v + ' es de uso poco frecuente. Búsquela en la tabla 4.1 de la norma.' };
    }
    piezas.push({ rot: 'Variable', val: v, det: variable });
    if (v === 'V') notas.push('En la ISA-5.1-2009, V es vibración. Las tablas antiguas la daban como viscosidad.');
    // Modificador de la variable, en segunda posición.
    var m2 = letras[1], resto = letras.slice(2);
    if (m2 === 'D' && resto.length) { modVar = ' diferencial'; piezas.push({ rot: 'Modificador', val: 'D', det: 'diferencial' }); i = 2; }
    else if (m2 === 'F' && resto.length) { modVar = 'razón de '; piezas.push({ rot: 'Modificador', val: 'F', det: 'razón' }); i = 2; }
    else if (m2 === 'Q' && resto.length) { modVar = ' totalizado'; piezas.push({ rot: 'Modificador', val: 'Q', det: 'totalizar' }); i = 2; }
    else if (m2 === 'S' && /[FPT]/.test(v) && /^[VE]$/.test(resto)) { seguridad = true; piezas.push({ rot: 'Modificador', val: 'S', det: 'seguridad' }); i = 2; }
    else if (m2 === 'K' && resto.length) { modVar = ''; piezas.push({ rot: 'Modificador', val: 'K', det: 'tasa de cambio' }); i = 2; notas.push('K en segunda posición es la tasa de cambio de la variable.'); }
    // Funciones y sus modificadores.
    var funciones = [], modsFun = [], previa = '';
    for (var j = i; j < letras.length; j++) {
      var c = letras[j];
      if ((previa === 'A' || previa === 'S') && /[HLMD]/.test(c)) {
        var mf = { H: 'alto', L: 'bajo', M: 'intermedio', D: 'desviación' }[c];
        if (modsFun.length && modsFun[modsFun.length - 1] === mf) modsFun[modsFun.length - 1] = 'muy ' + mf;
        else modsFun.push(mf);
        piezas.push({ rot: 'Mod. de función', val: c, det: mf });
        continue;
      }
      if ((previa === 'S' || previa === 'V') && (c === 'C' || c === 'O') && j === letras.length - 1) {
        var mo = c === 'C' ? 'cerrado' : 'abierto';
        modsFun.push(mo); piezas.push({ rot: 'Mod. de función', val: c, det: mo }); continue;
      }
      var f = FUNCION[c];
      if (!f) return { error: 'La letra ' + c + ' no está en la tabla corta del capítulo. Búsquela en la tabla 4.1 de la norma.' };
      funciones.push(f); piezas.push({ rot: 'Función', val: c, det: f }); previa = c;
    }
    if (!funciones.length) return { error: 'Falta la función: después de la variable va al menos una letra, como I, C, T o V.' };
    piezas.push({ rot: 'Lazo', val: lazo + (sufijo || ''), det: 'todos los instrumentos del lazo llevan ' + lazo });

    var nombre = funciones.length === 1 ? funciones[0] : funciones.slice(0, -1).join(', ') + ' y ' + funciones[funciones.length - 1];
    var deVar = v === 'H' ? 'manual' : 'de ' + (modVar === 'razón de ' ? 'razón de ' + variable + 's' : variable + modVar);
    if (seguridad) deVar = 'de seguridad de ' + variable;
    var frase = nombre.charAt(0).toUpperCase() + nombre.slice(1) + ' ' + deVar + (modsFun.length ? ' ' + modsFun.join(' y ') : '') + ', del lazo ' + lazo + '.';
    if (seguridad && letras[2] === 'E') notas.push('Un elemento de seguridad: con presión, un disco de ruptura; con temperatura, un fusible térmico.');
    if (seguridad && letras[2] === 'V') notas.push('Es una válvula de alivio: un dispositivo mecánico que abre a su presión de ajuste. No controla en operación normal.');
    if (letras === 'TY' || /Y$/.test(letras)) notas.push('Un Y muy común es el convertidor de corriente a presión (I/P), que vuelve la señal de 4 a 20 mA en aire para el actuador de la válvula.');
    return { tipo: 'Instrumento · ISA-5.1', piezas: piezas, frase: frase, notas: notas };
  }

  // Un rombo con una I adentro es un enclavamiento (ISA-5.1-2009).
  function leerEnclavamiento(n) {
    return {
      tipo: 'Enclavamiento · ISA-5.1',
      piezas: [{ rot: 'Símbolo', val: 'I', det: 'enclavamiento: un rombo con una I adentro' },
        { rot: 'Lazo', val: n, det: 'todos los instrumentos del lazo llevan ' + n }],
      frase: 'Enclavamiento del lazo ' + n + '.',
      notas: ['Una sola letra no es la etiqueta de un instrumento: dentro de un rombo, la I es un enclavamiento.']
    };
  }

  // La identificación de una línea: diámetro, servicio, número y clase (8″-P-110-A1).
  function leerLinea(m) {
    var d = m[1].replace('.', ','), svc = m[2], num = m[3], cl = m[4];
    var area = num[0], corr = parseInt(num.slice(1), 10), nombre = SERVICIO[svc];
    var piezas = [
      { rot: 'Diámetro', val: d + '″', det: d + (d === '1' ? ' pulgada' : ' pulgadas') + ' de diámetro nominal' },
      { rot: 'Servicio', val: svc, det: nombre || 'lo define la leyenda de los planos de la empresa' }
    ];
    var detNum = 'línea ' + num + ' del área ' + area + '00', notas = [];
    var frase = 'Una línea ' + (nombre ? 'de ' + nombre : 'de servicio ' + svc) + ' de ' + d + (d === '1' ? ' pulgada' : ' pulgadas') + ', la ' + num + ', de clase ' + cl + '.';
    if (svc === 'P') {
      detNum += '; lleva la corriente ' + corr;
      var dePfd = area === '1' && D.pfd.corrientes[corr];
      frase += ' Lleva la corriente ' + corr + (dePfd ? ' del PFD, ' + dePfd.charAt(0).toLowerCase() + dePfd.slice(1) : ' de su área') + '.';
    } else if (svc === 'FL') {
      notas.push('Una descarga a la tea no es una corriente del PFD, que no dibuja las válvulas de alivio: su número es solo el de la línea.');
    } else {
      notas.push('El capítulo usa P, proceso, y FL, tea. Las demás letras de servicio las define la leyenda de los planos de cada empresa.');
    }
    piezas.push({ rot: 'Número', val: num, det: detNum });
    piezas.push({ rot: 'Clase', val: cl, det: cl === 'A1' ? 'en este libro, acero al carbono para la presión de la sección de reacción' : 'la define la especificación de tubería de la empresa' });
    return { tipo: 'Línea de tubería', piezas: piezas, frase: frase, notas: notas };
  }

  function normalizar(texto) {
    return texto.toUpperCase().replace(/[”"]|''/g, '″').replace(/(\d)\s*(?:″|IN\b|PULG\b)/g, '$1″')
      .replace(/\s*-\s*/g, '-').replace(/\s+/g, ' ').trim();
  }

  function leer(texto) {
    var t = normalizar(texto), r;
    if (!t) return null;
    var eq = t.match(/^(TK|[CDEFHPRSTV])-(\d)(\d{2}) ?([A-Z](?:\/[A-Z])+|[A-Z])?$/);
    if (eq) {
      r = leerEquipo(eq); r.clase = 'equipo'; r.base = eq[1] + '-' + eq[2] + eq[3]; r.cod = r.base + (eq[4] ? ' ' + eq[4] : '');
      return r;
    }
    var li = t.match(/^(\d+(?:[.,]\d+)?)″?-([A-Z]{1,3})-(\d{3})-([A-Z0-9]{1,4})$/);
    if (li) { r = leerLinea(li); r.clase = 'linea'; r.cod = li[1].replace(',', '.') + '″-' + li[2] + '-' + li[3] + '-' + li[4]; return r; }
    var en = t.match(/^I-?(\d{1,4})$/);
    if (en) { r = leerEnclavamiento(en[1]); r.clase = 'enclavamiento'; r.cod = 'I-' + en[1]; return r; }
    var ins = t.match(/^([A-Z]{2,6})-?(\d{1,4})([A-Z])?$/);
    if (ins) {
      r = leerInstrumento(ins[1], ins[2], ins[3]);
      r.clase = 'instrumento'; r.letras = ins[1]; r.lazo = ins[2]; r.cod = ins[1] + '-' + ins[2] + (ins[3] || '');
      return r;
    }
    return { error: 'No reconozco el formato. Un equipo se escribe como E-101 o P-101 A/B; un instrumento, como PIC-105; una línea, como 8″-P-110-A1.' };
  }

  // ── El recuadro ───────────────────────────────────────────────────────
  function codigos(raiz) {
    var porCod = {}, lazos = {};
    var piezas = D.piezas.map(function (p0) {
      var p = {}; for (var k in p0) p[k] = p0[k];
      porCod[p.cod] = p;
      if (p.lazo) (lazos[p.lazo] = lazos[p.lazo] || []).push(p.cod);
      return p;
    });

    // El plano, en su marco blanco; la lectura flota encima en pantalla ancha.
    var marco = h('div', { class: 'dg-marco' }, raiz);
    var lienzo = css(h('div', {}, marco), 'position:relative');
    var svg = s('svg', { class: 'dg', viewBox: '0 0 ' + D.vb[0] + ' ' + D.vb[1], role: 'group',
      'aria-label': 'P&ID del separador de alta V-102. Cada globo, código de equipo y número de línea es un botón que dice cómo se lee.' }, lienzo);
    svg.innerHTML = D.svg;
    // El número de lazo de los globos va a 12 px y no a los 10 de la figura: en pantalla ancha el plano se
    // encoge a unos tres cuartos y, con 10, quedaría por debajo de los 9 px que pide la letra del libro.
    [].forEach.call(svg.querySelectorAll('.bub-n'), function (t) { t.style.fontSize = '12px'; });
    var defs = svg.querySelector('defs');
    var todo = [].slice.call(svg.children).filter(function (e) { return e !== defs; });
    todo.forEach(function (e) {
      e.claves = (e.getAttribute('data-de') || '').split('|').filter(Boolean);
      e.setAttribute('aria-hidden', 'true');
      e.style.transition = 'opacity .15s';
    });
    var fondo = s('g', { 'aria-hidden': 'true' }); svg.insertBefore(fondo, defs.nextSibling);
    var guia = s('g', { 'aria-hidden': 'true' }, svg);
    var capa = s('g', {}, svg);
    fondo.style.pointerEvents = guia.style.pointerEvents = 'none';

    var ranura = h('div', {}, raiz);
    var vivo = h('div', { class: 'visually-hidden', 'aria-live': 'polite' }, raiz);
    var fila = css(h('div', { class: 'cod-entrada' }, raiz), 'margin-top:1rem');
    var id = 'cod-' + Math.random().toString(36).slice(2, 7);
    h('label', { for: id }, fila, 'Código o etiqueta');
    var inp = h('input', { type: 'text', id: id, value: '', autocomplete: 'off', spellcheck: 'false', autocapitalize: 'characters' }, fila);
    var marcarOtros = P.botones(raiz, 'Otros códigos', OTROS.map(function (c) { return { t: c, v: c }; }), function (v) { inp.value = v; mostrar(); });

    function esTexto(e) { return !!e.querySelector('text') && !e.querySelector('path, rect, circle'); }
    function tiene(ks, lista) { for (var i = 0; i < ks.length; i++) if (lista.indexOf(ks[i]) >= 0) return true; return false; }

    // Lo que se toca: un rectángulo transparente sobre cada cara de cada pieza, en el orden del teclado.
    piezas.forEach(function (p) {
      p.caras = todo.filter(function (e) { return e.hasAttribute('data-cara') && e.claves.indexOf(p.cod) >= 0; });
      p.cajas = []; p.reales = [];
      p.toques = p.caras.map(function (e, i) {
        var r = s('rect', { fill: 'transparent', 'data-toque': '' }, capa);
        r.style.cursor = 'pointer'; r.style.outline = 'none';
        if (i === 0) {
          var nombre = { equipo: 'equipo', linea: 'línea', globo: 'instrumento', valvula: 'válvula', enclavamiento: 'enclavamiento' }[p.tipo];
          r.setAttribute('tabindex', '0'); r.setAttribute('role', 'button'); r.setAttribute('aria-pressed', 'false');
          r.setAttribute('aria-label', p.cod + ', ' + nombre);
        }
        r.addEventListener('click', function (ev) { ev.stopPropagation(); elegir(p, 'plano'); });
        r.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); elegir(p, 'teclado'); } });
        r.addEventListener('focus', function () { var v = false; try { v = r.matches(':focus-visible'); } catch (e) { v = true; } if (v) anillo(r, true); });
        r.addEventListener('blur', function () { anillo(r, false); });
        r.addEventListener('pointerenter', function () { r.setAttribute('fill', AMARILLO); r.setAttribute('fill-opacity', '.3'); });
        r.addEventListener('pointerleave', function () { r.setAttribute('fill', 'transparent'); r.removeAttribute('fill-opacity'); });
        return r;
      });
    });
    function anillo(r, si) {
      r.style.stroke = si ? NAVY : ''; r.style.strokeWidth = si ? '2.5' : ''; r.style.strokeDasharray = si ? '5 3' : '';
    }
    // Mide cada cara en el dibujo (necesita el plano a la vista y la letra ya cargada).
    function medir() {
      piezas.forEach(function (p) {
        p.caras.forEach(function (e, i) {
          var b; try { b = e.getBBox(); } catch (er) { return; }
          if (!b.width && !b.height) return;
          var t = esTexto(e), min = t ? 26 : 34, w = Math.max(b.width + 8, min), hh = Math.max(b.height + 8, min);
          var c = { x: b.x + b.width / 2 - w / 2, y: b.y + b.height / 2 - hh / 2, w: w, h: hh };
          p.cajas[i] = c; p.reales[i] = { x: b.x, y: b.y, w: b.width, h: b.height };
          var r = p.toques[i];
          r.setAttribute('x', c.x.toFixed(1)); r.setAttribute('y', c.y.toFixed(1));
          r.setAttribute('width', c.w.toFixed(1)); r.setAttribute('height', c.h.toFixed(1));
        });
      });
    }

    // El marcador amarillo: relleno en los globos y las válvulas, un halo debajo de líneas y equipos,
    // un fondo detrás de los códigos escritos. Lo demás se apaga.
    var rellenos = [];
    function halo(e, ancho) {
      var c = e.cloneNode(true);
      c.removeAttribute('data-de'); c.removeAttribute('style'); c.removeAttribute('aria-hidden');
      [].slice.call(c.querySelectorAll('text')).forEach(function (t) { t.parentNode.removeChild(t); });
      [c].concat([].slice.call(c.querySelectorAll('*'))).forEach(function (f) {
        if (/^(g|svg)$/i.test(f.tagName)) return;
        f.removeAttribute('class'); f.removeAttribute('marker-end');
        f.setAttribute('style', 'fill:none;stroke:' + AMARILLO + ';stroke-width:' + ancho + ';stroke-linecap:round;stroke-linejoin:round');
      });
      fondo.appendChild(c);
    }
    function fondoTexto(e) {
      var b; try { b = e.getBBox(); } catch (er) { return; }
      s('rect', { x: b.x - 3, y: b.y - 1.5, width: b.width + 6, height: b.height + 3, fill: AMARILLO }, fondo);
    }
    function pintar(sel) {
      while (fondo.firstChild) fondo.removeChild(fondo.firstChild);
      rellenos.forEach(function (f) { f.style.fill = ''; }); rellenos = [];
      todo.forEach(function (e) {
        if (!sel) { e.style.opacity = ''; return; }
        var ks = e.claves, enSel = tiene(ks, sel.sel), enRuta = tiene(ks, sel.ruta), enCon = tiene(ks, sel.con);
        e.style.opacity = enSel || enRuta || enCon ? '' : '.2';
        var cara = e.hasAttribute('data-cara'), marca = e.hasAttribute('data-marca'), texto = esTexto(e);
        if (enSel && cara) {
          if (texto) fondoTexto(e);
          else if (RELLENO[sel.tipo]) [].slice.call(e.querySelectorAll('.kf')).forEach(function (f) { f.style.fill = AMARILLO; rellenos.push(f); });
          else halo(e, 10);
        } else if ((enSel || enRuta) && marca && !texto) halo(e, enSel ? 9 : 7);
      });
    }
    function selDe(p) {
      var ruta = (p.ruta || []).slice(), con = (p.con || []).slice();
      if (p.lazo) { ruta.push('s ' + p.lazo); con.push('lazo ' + p.lazo); con = con.concat(lazos[p.lazo]); }
      return { sel: [p.cod], ruta: ruta, con: con, tipo: p.tipo };
    }

    // La lectura: un cuadro que flota junto a lo escogido, o que baja debajo del plano.
    var cuadro = h('div', {});
    var estado = null;
    function parrafo(padre, html, estilo, cls) { var p = h('p', cls ? { class: cls } : {}, padre, html); return css(p, estilo); }
    function llenar(r, titulo, p, extras, n) {
      cuadro.innerHTML = '';
      css(cuadro, 'background:' + BLANCO + ';color:' + NAVY + ';border:1.5px solid ' + NAVY + ';border-top-width:5px;padding:8px 12px 10px;box-sizing:border-box;line-height:1.4');
      var cab = css(h('div', {}, cuadro), 'display:flex;align-items:flex-start;justify-content:space-between;gap:10px');
      var tt = css(h('div', {}, cab), 'display:flex;flex-wrap:wrap;align-items:baseline;gap:0 12px;min-width:0');
      css(h('p', {}, tt), 'margin:0;font-size:var(--t-l);font-weight:600;line-height:1.2;letter-spacing:.02em;max-width:none;white-space:nowrap').textContent = titulo;
      if (r.tipo) css(h('p', { class: 'cod-tipo' }, tt, r.tipo), 'margin:0');
      var x = css(h('button', { type: 'button', 'aria-label': 'Cerrar la lectura' }, cab, '×'),
        'flex:none;width:32px;height:32px;padding:0;border:2px solid ' + BORDE + ';background:' + BLANCO + ';color:' + NAVY + ';font:inherit;font-size:20px;line-height:1;cursor:pointer');
      x.addEventListener('click', function () { cerrar(true); });
      // dos columnas si caben: la lectura de las letras y lo que dice el plano; debajo, el lazo y las notas
      var cuerpo = css(h('div', {}, cuadro), 'display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0 18px;align-items:start');
      var izq = h('div', {}, cuerpo);
      if (r.error) {
        parrafo(izq, null, 'font-size:var(--t-s);margin:.4rem 0 0', 'cod-frase cod-error').textContent = r.error;
      } else {
        parrafo(izq, null, 'font-size:var(--t-s);line-height:1.3;margin:.35rem 0 .45rem', 'cod-frase').textContent = r.frase;
        var dl = css(h('div', {}, izq), 'display:grid;grid-template-columns:max-content minmax(0,1fr);gap:1px 10px;align-items:baseline');
        r.piezas.forEach(function (q) {
          css(h('b', {}, dl), 'font-size:17px;font-weight:700;font-variant-numeric:tabular-nums;line-height:1.3').textContent = q.val;
          var d = css(h('span', {}, dl), 'font-size:var(--t-xs);line-height:1.3');
          d.appendChild(document.createTextNode(q.det + ' · '));
          css(h('span', {}, d), 'color:' + SEC).textContent = q.rot.toLowerCase();
        });
      }
      if (extras.length || (p && p.plano)) {
        var der = h('div', {}, cuerpo);
        extras.forEach(function (t) { parrafo(der, sinCorte(t), 'font-size:var(--t-xs);line-height:1.35;margin:.4rem 0 0;max-width:none'); });
        if (p && p.plano) parrafo(der, '<b style="font-weight:600">En este plano.</b> ' + sinCorte(escapar(p.plano)), 'font-size:var(--t-xs);line-height:1.35;margin:.4rem 0 0;max-width:none');
      }
      if (n && lazos[n].length > 1) {
        var marcar = P.botones(cuadro, 'Lazo ' + n, lazos[n].map(function (c) { return { t: c, v: c }; }), function (v) {
          elegir(porCod[v], 'lazo');
          var b = [].filter.call(cuadro.querySelectorAll('button.op'), function (x) { return x.textContent === v; })[0];
          if (b) b.focus();
        });
        var g = cuadro.querySelector('.botones'); css(g, 'margin:.5rem 0 0;gap:4px');
        css(g.querySelector('span'), 'font-size:var(--t-xs);margin-right:2px');
        [].forEach.call(g.querySelectorAll('button.op'), function (b) { css(b, 'min-height:30px;padding:0 7px;font-size:var(--t-xs);border-width:1.5px'); });
        marcar(p ? p.cod : '');
      }
      (r.notas || []).forEach(function (t) { parrafo(cuadro, sinCorte(escapar(t)), 'margin:.4rem 0 0;line-height:1.35', 'pie'); });
    }

    function aplicar(r, p, o) {
      var sel = null, ancla = null, n = null;
      if (p) { sel = selDe(p); ancla = p; n = p.lazo; }
      else if (o.lazo) {
        n = o.lazo; ancla = o.ancla;
        sel = { sel: [], ruta: ['s ' + n], con: lazos[n].concat(['lazo ' + n]), tipo: 'globo' };
      }
      estado = { r: r, p: p, sel: sel, ancla: ancla };
      pintar(sel);
      piezas.forEach(function (q) { if (q.toques[0]) q.toques[0].setAttribute('aria-pressed', String(q === p)); });
      llenar(r, o.titulo || (p ? p.cod : r.cod || inp.value.trim().toUpperCase()), p, o.extras || [], n);
      colocar(o.origen);
      vivo.textContent = r.error ? r.error : (o.titulo || (p ? p.cod : r.cod)) + '. ' + r.frase;
    }
    function elegir(p, origen) {
      inp.value = p.cod; marcarOtros('');
      aplicar(leer(p.cod), p, { origen: origen });
    }
    function cerrar(campo) {
      var p = estado && estado.p, dentro = cuadro.contains(document.activeElement);
      estado = null; pintar(null);
      while (guia.firstChild) guia.removeChild(guia.firstChild);
      if (cuadro.parentNode) cuadro.parentNode.removeChild(cuadro);
      piezas.forEach(function (q) { if (q.toques[0]) q.toques[0].setAttribute('aria-pressed', 'false'); });
      if (campo) { inp.value = ''; marcarOtros(''); }
      vivo.textContent = '';
      if (dentro) (p && p.toques[0] ? p.toques[0] : inp).focus();
    }

    // Lo que se escribe: si está en el plano se escoge ahí; si su lazo está, se marca el lazo.
    function mostrar() {
      var t = normalizar(inp.value), r = leer(inp.value);
      marcarOtros(OTROS.indexOf(t) >= 0 ? t : '');
      if (!r) { cerrar(false); return; }
      if (r.error) { aplicar(r, null, { origen: 'campo' }); return; }
      var p = porCod[r.cod];
      if (!p && r.clase === 'equipo') p = piezas.filter(function (q) { return q.tipo === 'equipo' && q.cod.split(' ')[0] === r.base; })[0];
      if (p) { aplicar(r, p, { origen: 'campo', titulo: r.cod }); return; }
      var o = { origen: 'campo', extras: [] }, pfd = '<a href="#fig-pfd">PFD</a>';
      if (r.clase === 'equipo') {
        var nom = D.pfd.equipos[r.cod] || D.pfd.equipos[r.base];
        if (nom) o.extras.push(/^bombas/.test(nom)
          ? 'En la planta de benceno son las ' + nom + ', y están en el ' + pfd + '; este P&amp;ID no las dibuja.'
          : /^columna/.test(nom)
            ? 'En la planta de benceno es la ' + nom + ', y está en el ' + pfd + '; este P&amp;ID no la dibuja.'
            : 'En la planta de benceno es el ' + nom + ', y está en el ' + pfd + '; este P&amp;ID no lo dibuja.');
      }
      if (r.clase === 'instrumento') {
        var miembros = lazos[r.lazo], mismo = miembros && miembros.some(function (c) { return c[0] === r.letras[0]; });
        if (D.pfd.lazos.indexOf(r.cod) >= 0) {
          if (D.pfd.enPid.indexOf(r.cod) >= 0) {
            o.lazo = r.lazo;
            o.extras.push('En el ' + pfd + ' el lazo ' + r.lazo + ' es un solo globo, el ' + r.cod + '. En este P&amp;ID se descompone en ' + lista(miembros) + '.');
          } else o.extras.push('Es un lazo del ' + pfd + '; este P&amp;ID no lo dibuja.');
        } else if (mismo) {
          o.lazo = r.lazo;
          o.extras.push('Este plano no lo dibuja, pero su lazo sí: ' + lista(miembros) + '.');
        }
        if (o.lazo) {
          // la lectura se ancla en el instrumento del lazo que más letras comparte con lo escrito
          var mejor = null, puntos = -1;
          miembros.forEach(function (c) {
            var l = c.split('-')[0], n = 0;
            for (var i = 0; i < r.letras.length; i++) if (l.indexOf(r.letras[i]) >= 0) n++;
            if (n > puntos) { puntos = n; mejor = c; }
          });
          o.ancla = porCod[mejor];
        }
      }
      aplicar(r, null, o);
    }

    // Dónde va la lectura: junto a lo escogido, sin tapar su lazo; en el teléfono, debajo del plano.
    function compacto() {
      var si = marco.clientWidth < UMBRAL;
      lienzo.style.width = si ? ANCHO_MOVIL + 'px' : '';
      return si;
    }
    function estatico() {
      if (cuadro.parentNode !== ranura) ranura.appendChild(cuadro);
      css(cuadro, 'position:static;width:auto;left:auto;top:auto;margin:.8rem 0 0');
    }
    function inter(a, b) {
      var w = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0), hh = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
      return w > 0 && hh > 0 ? w * hh : 0;
    }
    function obstaculos(k) {
      var o = [], sel = estado.sel;
      if (!sel) return o;
      piezas.forEach(function (p) {
        if (sel.sel.indexOf(p.cod) < 0 && sel.con.indexOf(p.cod) < 0) return;
        p.reales.forEach(function (b) { if (b) o.push({ x0: b.x * k - 6, y0: b.y * k - 6, x1: (b.x + b.w) * k + 6, y1: (b.y + b.h) * k + 6 }); });
      });
      todo.forEach(function (e) {
        if (!(tiene(e.claves, sel.ruta) || tiene(e.claves, sel.sel)) || !e.hasAttribute('data-marca') || e.hasAttribute('data-cara')) return;
        var b; try { b = e.getBBox(); } catch (er) { return; }
        if (b.width * b.height * k * k > 60000) return;          // una línea larga no cuenta como estorbo
        o.push({ x0: b.x * k - 4, y0: b.y * k - 4, x1: (b.x + b.width) * k + 4, y1: (b.y + b.height) * k + 4 });
      });
      return o;
    }
    function posicionar(p) {
      var W = lienzo.clientWidth, H = svg.clientHeight || svg.getBoundingClientRect().height, k = W / D.vb[0], b = p.reales[0];
      if (!b) return false;
      var cw = Math.round(Math.min(470, Math.max(300, W * 0.52)));
      cuadro.style.width = cw + 'px';
      var ch = cuadro.offsetHeight;
      if (ch > H - 8) return false;
      var a = { x0: b.x * k, y0: b.y * k, x1: (b.x + b.w) * k, y1: (b.y + b.h) * k };
      var acx = (a.x0 + a.x1) / 2, acy = (a.y0 + a.y1) / 2, gap = 18, obs = obstaculos(k), cands = [];
      [a.x1 + gap, a.x0 - gap - cw].forEach(function (x) { [acy - ch / 2, a.y0 - 14, a.y1 - ch + 14].forEach(function (y) { cands.push([x, y]); }); });
      [a.y1 + gap, a.y0 - gap - ch].forEach(function (y) { [acx - cw / 2, a.x0 - 14, a.x1 - cw + 14].forEach(function (x) { cands.push([x, y]); }); });
      // y, si todo lo de cerca es del lazo, las esquinas y los bordes del plano
      [2, (W - cw) / 2, W - cw - 2].forEach(function (x) { [2, (H - ch) / 2, H - ch - 2].forEach(function (y) { cands.push([x, y]); }); });
      var ae = { x0: a.x0 - 8, y0: a.y0 - 8, x1: a.x1 + 8, y1: a.y1 + 8 }, mejor = null, puntos = Infinity;
      cands.forEach(function (c) {
        var x = Math.max(2, Math.min(W - cw - 2, c[0])), y = Math.max(2, Math.min(H - ch - 2, c[1]));
        var r = { x0: x, y0: y, x1: x + cw, y1: y + ch };
        var sc = 60 * inter(r, ae) / ((ae.x1 - ae.x0) * (ae.y1 - ae.y0));
        obs.forEach(function (o) { sc += 6 * inter(r, o) / Math.max(1, (o.x1 - o.x0) * (o.y1 - o.y0)); });
        var qx = Math.max(r.x0, Math.min(acx, r.x1)), qy = Math.max(r.y0, Math.min(acy, r.y1));
        sc += 3 * Math.hypot(qx - acx, qy - acy) / W;
        if (sc < puntos) { puntos = sc; mejor = r; }
      });
      css(cuadro, 'position:absolute;margin:0;z-index:2;left:' + Math.round(mejor.x0) + 'px;top:' + Math.round(mejor.y0) + 'px');
      // la guía: del borde de lo escogido al punto más cercano del cuadro
      var qx = Math.max(mejor.x0, Math.min(acx, mejor.x1)), qy = Math.max(mejor.y0, Math.min(acy, mejor.y1));
      var dx = qx - acx, dy = qy - acy, L = Math.hypot(dx, dy);
      var t = Math.min((dx ? (a.x1 - a.x0) / 2 / Math.abs(dx) : Infinity), (dy ? (a.y1 - a.y0) / 2 / Math.abs(dy) : Infinity));
      var sx = acx + dx * Math.min(1, t) + (dx / (L || 1)) * 3, sy = acy + dy * Math.min(1, t) + (dy / (L || 1)) * 3;
      if (Math.hypot(qx - sx, qy - sy) > 6) {
        s('path', { d: 'M ' + (sx / k).toFixed(1) + ' ' + (sy / k).toFixed(1) + ' L ' + (qx / k).toFixed(1) + ' ' + (qy / k).toFixed(1),
          style: 'fill:none;stroke:' + NAVY + ';stroke-width:1.6' }, guia);
        s('circle', { cx: (sx / k).toFixed(1), cy: (sy / k).toFixed(1), r: 3, style: 'fill:' + NAVY }, guia);
      }
      return true;
    }
    function colocar(origen) {
      var chico = compacto();
      while (guia.firstChild) guia.removeChild(guia.firstChild);
      if (!estado) return;
      var p = estado.ancla;
      if (!chico && p) {
        if (cuadro.parentNode !== lienzo) lienzo.appendChild(cuadro);
        css(cuadro, 'position:absolute;margin:0;z-index:2;left:0;top:0');
        if (!posicionar(p)) estatico();
      } else estatico();
      if (chico && p && p.reales[0]) {
        // en el teléfono, el plano se desliza hasta lo escogido
        var k = lienzo.clientWidth / D.vb[0], b = p.reales[0], cx = lienzo.offsetLeft + (b.x + b.w / 2) * k;
        if (cx < marco.scrollLeft + 40 || cx > marco.scrollLeft + marco.clientWidth - 40) {
          marco.scrollTo({ left: Math.max(0, cx - marco.clientWidth / 2), behavior: P.reducido || origen === 'inicio' ? 'auto' : 'smooth' });
        }
      }
      if (chico && origen === 'plano' && cuadro.getBoundingClientRect().top > window.innerHeight - 60) {
        cuadro.scrollIntoView({ block: 'nearest', behavior: P.reducido ? 'auto' : 'smooth' });
      }
    }

    inp.addEventListener('input', mostrar);
    svg.addEventListener('click', function (ev) { if (!ev.target.closest('[data-toque]') && estado) cerrar(true); });
    raiz.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && estado) cerrar(true); });

    var ancho = 0;
    new ResizeObserver(function () {
      var w = Math.round(marco.getBoundingClientRect().width);
      if (!w || Math.abs(w - ancho) <= 2) return;
      ancho = w; medir();
      if (estado) { pintar(estado.sel); colocar(); }
    }).observe(marco);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { medir(); if (estado) { pintar(estado.sel); colocar(); } });

    // Arranca en el lazo de presión del capítulo.
    medir();
    elegir(porCod['PIC-105'], 'inicio');
  }

  function iniciar() {
    document.querySelectorAll('.interactivo[data-interactivo="codigos"]').forEach(function (raiz) {
      if (!raiz.dataset.listo) { raiz.dataset.listo = '1'; try { codigos(raiz); } catch (e) { console.error(e); } }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
