/* Entrenador de aperturas — app.js
   Motor de ajedrez: chess.js 0.10.3 (window.Chess)
   Persistencia: localStorage con degradación a memoria
   Instructor: repaso espaciado SM-2 lite por variante */
(function(){
"use strict";

// ===================== DATASET =====================
const REP = [{"id":"italian","name":"Apertura Italiana","color":"w","eco":"C50","desc":"Desarrollo rápido apuntando a f7. Tranquila y muy sólida.","lines":[{"label":"Giuoco Pianissimo","moves":[{"san":"e4","note":"Ocupas el centro y liberas dama y alfil."},{"san":"e5"},{"san":"Nf3","note":"Atacas e5 y te desarrollas hacia el enroque."},{"san":"Nc6"},{"san":"Bc4","note":"El alfil apunta a f7, el punto más débil del rival."},{"san":"Bc5"},{"san":"c3","note":"Preparas d4 para construir un centro grande."},{"san":"Nf6"},{"san":"d3","note":"Sin prisas: posición sólida y lista para maniobrar."},{"san":"d6"}]},{"label":"Dos Caballos","moves":[{"san":"e4","note":"Centro y desarrollo."},{"san":"e5"},{"san":"Nf3","note":"Presionas e5."},{"san":"Nc6"},{"san":"Bc4","note":"Apuntas a f7."},{"san":"Nf6","note":"Dos Caballos: el rival contraataca e4 en vez de ...Bc5."},{"san":"d3","note":"Defiendes e4 con calma y evitas complicaciones."},{"san":"Bc5"},{"san":"O-O","note":"Rey seguro; el plan c3-d4 vendrá después."},{"san":"d6"}]}]},{"id":"ruylopez","name":"Ruy López","color":"w","eco":"C60","desc":"La \"Española\": presión duradera sobre el defensor de e5.","lines":[{"label":"Morphy cerrada","moves":[{"san":"e4","note":"Centro y desarrollo."},{"san":"e5"},{"san":"Nf3","note":"Presionas e5."},{"san":"Nc6"},{"san":"Bb5","note":"Clavas indirectamente al defensor de e5."},{"san":"a6"},{"san":"Ba4","note":"Mantienes la presión sin ceder el alfil."},{"san":"Nf6"},{"san":"O-O","note":"Rey a salvo, la torre entra en juego."},{"san":"Be7"},{"san":"Re1","note":"Refuerzas e4 y preparas d4/c3."},{"san":"b5"},{"san":"Bb3","note":"El alfil vuelve a la diagonal contra f7."},{"san":"d6"},{"san":"c3","note":"Preparas d4, el plan central de la Española."},{"san":"O-O"}]},{"label":"Defensa Berlín","moves":[{"san":"e4","note":"Centro y desarrollo."},{"san":"e5"},{"san":"Nf3","note":"Presionas e5."},{"san":"Nc6"},{"san":"Bb5","note":"Clavas al defensor de e5."},{"san":"Nf6","note":"El Muro de Berlín: el rival ataca e4 de inmediato."},{"san":"O-O","note":"Enrocas y ofreces el peón e4 por desarrollo."},{"san":"Nxe4"},{"san":"Re1","note":"Reconquistas la iniciativa clavando el caballo."},{"san":"Nd6"},{"san":"Bxc6","note":"Cambias para desbaratar su estructura de peones."},{"san":"dxc6"},{"san":"Nxe5","note":"Recuperas el peón con buena posición."}]}]},{"id":"queensgambit","name":"Gambito de Dama","color":"w","eco":"D30","desc":"Ofreces el peón c para desviar a d5 y dominar el centro.","lines":[{"label":"Rechazado","moves":[{"san":"d4","note":"Centro sólido de peón dama."},{"san":"d5"},{"san":"c4","note":"Ofreces el peón para desviar a d5 del centro."},{"san":"e6"},{"san":"Nc3","note":"Desarrollas presionando d5."},{"san":"Nf6"},{"san":"Bg5","note":"Clavas el caballo f6, aflojando la defensa de d5."},{"san":"Be7"},{"san":"e3","note":"Abres paso al alfil f1 con estructura firme."},{"san":"O-O"},{"san":"Nf3","note":"Desarrollo natural, control de e5."},{"san":"h6"},{"san":"Bh4","note":"Mantienes la clavada en vez de cambiar."},{"san":"b6"}]},{"label":"Aceptado","moves":[{"san":"d4","note":"Centro sólido."},{"san":"d5"},{"san":"c4","note":"Ofreces el peón c."},{"san":"dxc4","note":"El rival acepta el gambito y toma en c4."},{"san":"Nf3","note":"No recuperas el peón aún: primero desarrollas."},{"san":"Nf6"},{"san":"e3","note":"Abres la diagonal para reconquistar c4 con el alfil."},{"san":"e6"},{"san":"Bxc4","note":"Recuperas el peón con un alfil muy activo."},{"san":"c5"},{"san":"O-O","note":"Rey seguro y ligera ventaja de desarrollo."},{"san":"a6"}]},{"label":"Defensa Eslava","moves":[{"san":"d4","note":"Centro sólido."},{"san":"d5"},{"san":"c4","note":"Ofreces el peón c."},{"san":"c6","note":"La Eslava: el rival apoya d5 con el peón c en vez de e6."},{"san":"Nf3","note":"Desarrollo flexible."},{"san":"Nf6"},{"san":"Nc3","note":"Presionas d5 con otra pieza."},{"san":"dxc4"},{"san":"a4","note":"Frenas ...b5, que intentaría sostener el peón de c4."},{"san":"Bf5"}]}]},{"id":"london","name":"Sistema Londres","color":"w","eco":"D02","desc":"Setup casi automático: mismo plan sólido contra casi todo.","lines":[{"label":"Setup clásico","moves":[{"san":"d4","note":"El peón dama ancla tu centro."},{"san":"d5"},{"san":"Nf3","note":"Evitas el molesto ...Bg4."},{"san":"Nf6"},{"san":"Bf4","note":"La seña del Londres: sacas el alfil ANTES de e3."},{"san":"e6"},{"san":"e3","note":"Ahora cierras, con el alfil ya afuera y activo."},{"san":"Bd6"},{"san":"Bg3","note":"Conservas el alfil y evitas cambios."},{"san":"O-O"},{"san":"Bd3","note":"Apuntas a h7; el setup queda completo."},{"san":"b6"},{"san":"Nbd2","note":"El caballo apoyará e4 más adelante."},{"san":"Bb7"}]},{"label":"Contra ...c5","moves":[{"san":"d4","note":"Centro de peón dama."},{"san":"d5"},{"san":"Nf3","note":"Desarrollo flexible."},{"san":"Nf6"},{"san":"Bf4","note":"Sacas el alfil primero."},{"san":"c5","note":"El rival golpea tu centro por el flanco de dama."},{"san":"e3","note":"Sostienes d4 y abres tu alfil f1."},{"san":"Nc6"},{"san":"c3","note":"Refuerzas d4 para que la presión no incomode."},{"san":"Qb6"},{"san":"Qb3","note":"Ofreces cambiar damas y neutralizas la presión sobre b2."}]}]},{"id":"english","name":"Apertura Inglesa","color":"w","eco":"A20","desc":"Controlas d5 desde el flanco: una Siciliana con colores cambiados.","lines":[{"label":"Siciliana invertida","moves":[{"san":"c4","note":"Peleas por d5 desde el flanco."},{"san":"e5"},{"san":"Nc3","note":"Refuerzas el control de d5."},{"san":"Nf6"},{"san":"Nf3","note":"Presionas e5 y te desarrollas."},{"san":"Nc6"},{"san":"g3","note":"Preparas el fianchetto: tu alfil mandará en la gran diagonal."},{"san":"d5"},{"san":"cxd5","note":"Abres la posición para tu alfil de g2."},{"san":"Nxd5"},{"san":"Bg2","note":"El alfil presiona centro y flanco de dama."},{"san":"Nb6"},{"san":"O-O","note":"Rey seguro; a completar con d3/b3."},{"san":"Be7"}]},{"label":"Simétrica","moves":[{"san":"c4","note":"Control de d5 desde el flanco."},{"san":"c5","note":"El rival responde en espejo: posición simétrica."},{"san":"Nc3","note":"Desarrollas hacia d5/b5."},{"san":"Nc6"},{"san":"g3","note":"Preparas el fianchetto."},{"san":"g6"},{"san":"Bg2","note":"Tu alfil domina la gran diagonal."},{"san":"Bg7"},{"san":"Nf3","note":"Desarrollo natural."},{"san":"Nf6"},{"san":"O-O","note":"Rey seguro; rompes la simetría con d4 o b3 después."},{"san":"O-O"}]}]},{"id":"sicilian","name":"Siciliana (Najdorf)","color":"b","eco":"B90","desc":"La respuesta más combativa a 1.e4: desequilibrio desde la salida.","lines":[{"label":"Clásica 6.Be2","moves":[{"san":"e4"},{"san":"c5","note":"La Siciliana: peleas el centro de forma asimétrica."},{"san":"Nf3"},{"san":"d6","note":"Preparas ...Nf6 y controlas e5."},{"san":"d4"},{"san":"cxd4","note":"Cambias tu peón c por el central: ganas columna \"c\"."},{"san":"Nxd4"},{"san":"Nf6","note":"Atacas e4 y te desarrollas."},{"san":"Nc3"},{"san":"a6","note":"El toque Najdorf: controla b5 y prepara ...e5."},{"san":"Be2"},{"san":"e5","note":"Ganas espacio y expulsas al caballo de d4."},{"san":"Nb3"},{"san":"Be7","note":"Desarrollas y preparas el enroque."}]},{"label":"Ataque inglés 6.Be3","moves":[{"san":"e4"},{"san":"c5","note":"Siciliana."},{"san":"Nf3"},{"san":"d6","note":"Controlas e5."},{"san":"d4"},{"san":"cxd4","note":"Abres la columna c."},{"san":"Nxd4"},{"san":"Nf6","note":"Atacas e4."},{"san":"Nc3"},{"san":"a6","note":"Najdorf."},{"san":"Be3","note":"Ataque inglés: el rival prepara f3, Qd2 y enroque largo."},{"san":"e5","note":"Reaccionas en el centro ganando espacio."},{"san":"Nb3"},{"san":"Be6","note":"Desarrollas vigilando d5, casilla clave en esta línea."}]},{"label":"Alapin 2.c3","moves":[{"san":"e4"},{"san":"c5","note":"Siciliana."},{"san":"c3","note":"Alapin: el rival prepara d4 con apoyo en vez de 2.Nf3."},{"san":"Nf6","note":"Atacas e4 de inmediato para no dejarle centro cómodo."},{"san":"e5"},{"san":"Nd5","note":"El caballo se planta fuerte en el centro."},{"san":"d4"},{"san":"cxd4","note":"Abres líneas antes de que consolide."},{"san":"Nf3"},{"san":"Nc6","note":"Desarrollas presionando d4/e5."},{"san":"cxd4"},{"san":"d6","note":"Golpeas la cadena y liberas tu juego."}]}]},{"id":"french","name":"Defensa Francesa","color":"b","eco":"C00","desc":"Estructura de cadena sólida y contragolpe con ...c5.","lines":[{"label":"Winawer","moves":[{"san":"e4"},{"san":"e6","note":"Preparas ...d5 con una estructura muy sólida."},{"san":"d4"},{"san":"d5","note":"Golpeas el centro de inmediato."},{"san":"Nc3"},{"san":"Bb4","note":"Winawer: clavas el caballo y presionas e4."},{"san":"e5"},{"san":"c5","note":"Atacas la base de la cadena de peones (d4)."},{"san":"a3"},{"san":"Bxc3+","note":"Cambias alfil por caballo y dañas su estructura."},{"san":"bxc3"},{"san":"Ne7","note":"Rumbo a f5/g6 para presionar d4 y e5."}]},{"label":"Avance","moves":[{"san":"e4"},{"san":"e6","note":"Preparas ...d5."},{"san":"d4"},{"san":"d5","note":"Desafías el centro."},{"san":"e5","note":"Avance: el rival cierra el centro y gana espacio."},{"san":"c5","note":"Golpeas de inmediato la base de la cadena (d4)."},{"san":"c3"},{"san":"Nc6","note":"Sumas presión sobre d4."},{"san":"Nf3"},{"san":"Qb6","note":"La dama ataca d4 y b2: presión típica de la Francesa."}]},{"label":"Cambio","moves":[{"san":"e4"},{"san":"e6","note":"Preparas ...d5."},{"san":"d4"},{"san":"d5","note":"Desafías el centro."},{"san":"exd5","note":"Cambio: el rival simplifica y busca tablas."},{"san":"exd5","note":"Recapturas con estructura simétrica pero jugable."},{"san":"Nf3"},{"san":"Nf6","note":"Desarrollo natural."},{"san":"Bd3"},{"san":"Bd6","note":"Colocas tus piezas en espejo, sin ceder nada."}]}]},{"id":"carokann","name":"Defensa Caro-Kann","color":"b","eco":"B10","desc":"Sólida como la Francesa, pero sin encerrar el alfil bueno.","lines":[{"label":"Clásica","moves":[{"san":"e4"},{"san":"c6","note":"Preparas ...d5 sin encerrar a tu alfil bueno."},{"san":"d4"},{"san":"d5","note":"Desafías el centro de inmediato."},{"san":"Nc3"},{"san":"dxe4","note":"Abres la posición en buenos términos."},{"san":"Nxe4"},{"san":"Bf5","note":"Sacas el alfil \"problema\" ANTES de cerrarlo con ...e6."},{"san":"Ng3"},{"san":"Bg6","note":"El alfil se retira a una casilla segura y activa."},{"san":"h4"},{"san":"h6","note":"Le das casa de escape al alfil y frenas h5."},{"san":"Nf3"},{"san":"Nd7","note":"Desarrollo flexible: preparas ...Ngf6 y ...e6."}]},{"label":"Avance","moves":[{"san":"e4"},{"san":"c6","note":"Preparas ...d5."},{"san":"d4"},{"san":"d5","note":"Desafías el centro."},{"san":"e5","note":"Avance: el rival cierra el centro y gana espacio."},{"san":"Bf5","note":"La clave del Caro: tu alfil sale ANTES de quedar encerrado."},{"san":"Nf3"},{"san":"e6","note":"Ahora sí cierras, con el alfil bueno ya fuera."},{"san":"Be2"},{"san":"c5","note":"Golpeas la base de la cadena de peones."}]},{"label":"Cambio","moves":[{"san":"e4"},{"san":"c6","note":"Preparas ...d5."},{"san":"d4"},{"san":"d5","note":"Desafías el centro."},{"san":"exd5","note":"Cambio: el rival simplifica la estructura."},{"san":"cxd5","note":"Recapturas y obtienes una posición cómoda y sólida."},{"san":"Bd3"},{"san":"Nc6","note":"Desarrollas presionando d4."},{"san":"c3"},{"san":"Nf6","note":"Completas el desarrollo con total comodidad."}]}]},{"id":"kingsindian","name":"India de Rey","color":"b","eco":"E60","desc":"Cedes el centro para después atacarlo con piezas y ...e5/...f5.","lines":[{"label":"Clásica","moves":[{"san":"d4"},{"san":"Nf6","note":"Controlas e4 con flexibilidad."},{"san":"c4"},{"san":"g6","note":"Preparas el fianchetto: el alfil dominará la gran diagonal."},{"san":"Nc3"},{"san":"Bg7","note":"El alfil presiona el centro y protege tu rey."},{"san":"e4"},{"san":"d6","note":"Cedes espacio a propósito para golpear con ...e5 luego."},{"san":"Nf3"},{"san":"O-O","note":"Rey seguro antes de romper en el centro."},{"san":"Be2"},{"san":"e5","note":"El golpe temático: atacas su centro con piezas listas."},{"san":"O-O"},{"san":"Nc6","note":"Presionas d4 y preparas reagrupamientos."}]},{"label":"Sämisch","moves":[{"san":"d4"},{"san":"Nf6","note":"Controlas e4."},{"san":"c4"},{"san":"g6","note":"Preparas el fianchetto."},{"san":"Nc3"},{"san":"Bg7","note":"El alfil apunta al centro."},{"san":"e4"},{"san":"d6","note":"Estructura India de Rey."},{"san":"f3","note":"Sämisch: el rival blinda e4 y prepara enroque largo y ataque."},{"san":"O-O","note":"Enrocas; buscarás contrajuego con ...e5 o ...c5."},{"san":"Be3"},{"san":"e5","note":"Golpeas el centro sin miedo a la estructura sólida rival."}]},{"label":"Fianchetto","moves":[{"san":"d4"},{"san":"Nf6","note":"Controlas e4."},{"san":"c4"},{"san":"g6","note":"Preparas el fianchetto."},{"san":"Nc3"},{"san":"Bg7","note":"Alfil a la gran diagonal."},{"san":"Nf3","note":"El rival elige el sistema de fianchetto en vez de 4.e4."},{"san":"O-O","note":"Enrocas con seguridad."},{"san":"g3"},{"san":"d6","note":"Preparas la ruptura ...e5 con calma."},{"san":"Bg2"},{"san":"Nbd7","note":"El caballo apoya la futura ruptura ...e5."}]}]},{"id":"qgd","name":"Gambito de Dama Rechazado","color":"b","eco":"D35","desc":"Estructura firme; resuelves el alfil dama con ...Be7 y ...Nbd7.","lines":[{"label":"Variante del cambio","moves":[{"san":"d4"},{"san":"d5","note":"Ocupas el centro con solidez."},{"san":"c4"},{"san":"e6","note":"Rechazas el gambito y refuerzas d5."},{"san":"Nc3"},{"san":"Nf6","note":"Desarrollas y defiendes d5."},{"san":"cxd5","note":"Cambio: el rival fija la estructura."},{"san":"exd5","note":"Recapturas manteniendo un peón sólido en d5."},{"san":"Bg5"},{"san":"Be7","note":"Rompes la clavada y preparas el enroque."},{"san":"e3"},{"san":"O-O","note":"Rey a salvo; tu estructura es muy firme."},{"san":"Bd3"},{"san":"Nbd7","note":"El caballo irá a f6/f8 para reforzar la defensa."}]},{"label":"Principal con Bg5","moves":[{"san":"d4"},{"san":"d5","note":"Centro sólido."},{"san":"c4"},{"san":"e6","note":"Rechazas el gambito."},{"san":"Nc3"},{"san":"Nf6","note":"Defiendes d5."},{"san":"Bg5","note":"El rival clava tu caballo para presionar d5."},{"san":"Be7","note":"Deshaces la clavada con desarrollo."},{"san":"e3"},{"san":"O-O","note":"Rey seguro."},{"san":"Nf3"},{"san":"h6","note":"Interrogas al alfil: que decida clavar o cambiar."},{"san":"Bh4"},{"san":"b6","note":"Preparas ...Bb7 para pelear por e4 y la gran diagonal."}]},{"label":"Catalán","moves":[{"san":"d4"},{"san":"d5","note":"Centro sólido."},{"san":"c4"},{"san":"e6","note":"Rechazas el gambito."},{"san":"Nf3","note":"El rival va rumbo al Catalán en vez de 3.Nc3."},{"san":"Nf6","note":"Desarrollo natural."},{"san":"g3"},{"san":"Be7","note":"Te desarrollas con solidez ante el fianchetto rival."},{"san":"Bg2"},{"san":"O-O","note":"Rey seguro."},{"san":"O-O"},{"san":"dxc4","note":"Tomas en c4: si el rival lo recupera, habrás ganado tiempo o el peón cuesta trabajo recobrarlo."}]}]}];

const GLYPH={p:'\u265F',n:'\u265E',b:'\u265D',r:'\u265C',q:'\u265B',k:'\u265A'};
const PIECE_SVG={
  wP:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path fill="#fff" stroke="#000" stroke-linecap="round" stroke-width="1.5" d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"/></svg>',
  wN:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path fill="#fff" d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"/><path fill="#fff" d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3"/><path fill="#000" d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0m5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5"/></g></svg>',
  wB:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><g fill="#fff" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path stroke-linejoin="miter" d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5"/></g></svg>',
  wR:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path stroke-linecap="butt" d="M9 39h27v-3H9zm3-3v-4h21v4zm-1-22V9h4v2h5V9h5v2h5V9h4v5"/><path d="m34 14-3 3H14l-3-3"/><path stroke-linecap="butt" stroke-linejoin="miter" d="M31 17v12.5H14V17"/><path d="m31 29.5 1.5 2.5h-20l1.5-2.5"/><path fill="none" stroke-linejoin="miter" d="M11 14h23"/></g></svg>',
  wQ:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0m16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0M41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0M16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0M33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0"/><path stroke-linecap="butt" d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14z"/><path stroke-linecap="butt" d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/><path fill="none" d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0"/></g></svg>',
  wK:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path stroke-linejoin="miter" d="M22.5 11.63V6M20 8h5"/><path fill="#fff" stroke-linecap="butt" stroke-linejoin="miter" d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"/><path fill="#fff" d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10z"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/></g></svg>',
  bP:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path stroke="#000" stroke-linecap="round" stroke-width="1.5" d="M22.5 9a4 4 0 0 0-3.22 6.38 6.48 6.48 0 0 0-.87 10.65c-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47a6.46 6.46 0 0 0-.87-10.65A4.01 4.01 0 0 0 22.5 9z"/></svg>',
  bN:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path fill="#000" d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"/><path fill="#000" d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.04-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-1-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-2 2.5-3c1 0 1 3 1 3"/><path fill="#ececec" stroke="#ececec" d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0m5.43-9.75a.5 1.5 30 1 1-.86-.5.5 1.5 30 1 1 .86.5"/><path fill="#ececec" stroke="none" d="m24.55 10.4-.45 1.45.5.15c3.15 1 5.65 2.49 7.9 6.75S35.75 29.06 35.25 39l-.05.5h2.25l.05-.5c.5-10.06-.88-16.85-3.25-21.34s-5.79-6.64-9.19-7.16z"/></g></svg>',
  bB:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><g fill="#000" stroke-linecap="butt"><path d="M9 36c3.4-1 10.1.4 13.5-2 3.4 2.4 10.1 1 13.5 2 0 0 1.6.5 3 2-.7 1-1.6 1-3 .5-3.4-1-10.1.5-13.5-1-3.4 1.5-10.1 0-13.5 1-1.4.5-2.3.5-3-.5 1.4-2 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path stroke="#ececec" stroke-linejoin="miter" d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5"/></g></svg>',
  bR:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path stroke-linecap="butt" d="M9 39h27v-3H9zm3.5-7 1.5-2.5h17l1.5 2.5zm-.5 4v-4h21v4z"/><path stroke-linecap="butt" stroke-linejoin="miter" d="M14 29.5v-13h17v13z"/><path stroke-linecap="butt" d="M14 16.5 11 14h23l-3 2.5zM11 14V9h4v2h5V9h5v2h5V9h4v5z"/><path fill="none" stroke="#ececec" stroke-linejoin="miter" stroke-width="1" d="M12 35.5h21m-20-4h19m-18-2h17m-17-13h17M11 14h23"/></g></svg>',
  bQ:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><g stroke="none"><circle cx="6" cy="12" r="2.75"/><circle cx="14" cy="9" r="2.75"/><circle cx="22.5" cy="8" r="2.75"/><circle cx="31" cy="9" r="2.75"/><circle cx="39" cy="12" r="2.75"/></g><path stroke-linecap="butt" d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5z"/><path stroke-linecap="butt" d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/><path fill="none" stroke-linecap="butt" d="M11 38.5a35 35 1 0 0 23 0"/><path fill="none" stroke="#ececec" d="M11 29a35 35 1 0 1 23 0m-21.5 2.5h20m-21 3a35 35 1 0 0 22 0m-23 3a35 35 1 0 0 24 0"/></g></svg>',
  bK:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path stroke-linejoin="miter" d="M22.5 11.6V6"/><path fill="#000" stroke-linecap="butt" stroke-linejoin="miter" d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"/><path fill="#000" d="M11.5 37a22.3 22.3 0 0 0 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10z"/><path stroke-linejoin="miter" d="M20 8h5"/><path stroke="#ececec" d="M32 29.5s8.5-4 6-9.7C34.1 14 25 18 22.5 24.6v2.1-2.1C20 18 9.9 14 7 19.9c-2.5 5.6 4.8 9 4.8 9"/><path stroke="#ececec" d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/></g></svg>',
};
const FILES=['a','b','c','d','e','f','g','h'];
const DAY=86400000;
const $=id=>document.getElementById(id);
const el=(t,c)=>{const e=document.createElement(t); if(c)e.className=c; return e;};

// ===================== PERSISTENCIA =====================
const STORE_KEY='cae_v1';
let persistOK=true;
function defaultStore(){ return {version:1, items:{}, stats:{lines:0,attempts:0,correct:0}, streak:{count:0,lastDay:null}, customPgns:[], settings:{newPerSession:5, guideMode:true}}; }
let store=defaultStore();
function loadStore(){
  try{ const raw=localStorage.getItem(STORE_KEY); if(raw){ const p=JSON.parse(raw); store=Object.assign(defaultStore(),p); store.items=p.items||{}; store.stats=Object.assign({lines:0,attempts:0,correct:0},p.stats); store.streak=Object.assign({count:0,lastDay:null},p.streak); store.customPgns=p.customPgns||[]; store.settings=Object.assign({newPerSession:5,guideMode:true},p.settings); } }
  catch(e){ persistOK=false; }
  // probar escritura
  try{ localStorage.setItem(STORE_KEY+'_t','1'); localStorage.removeItem(STORE_KEY+'_t'); }catch(e){ persistOK=false; }
}
function saveStore(){
  if(persistOK){ try{ localStorage.setItem(STORE_KEY, JSON.stringify(store)); }catch(e){ persistOK=false; renderPersistBadge(); } }
  if(typeof schedulePush==='function') schedulePush();
}
function exportStore(){
  const blob=new Blob([JSON.stringify(store,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob); const a=el('a'); a.href=url;
  a.download='entrenador-aperturas-avances-'+todayISO()+'.json'; a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function importStore(file){
  const r=new FileReader();
  r.onload=()=>{ try{ const p=JSON.parse(r.result); if(!p||typeof p!=='object'||!p.items){ throw new Error('formato'); }
    store=Object.assign(defaultStore(),p); store.items=p.items||{}; saveStore(); renderHome();
    toast('Avances importados correctamente.'); }
    catch(e){ toast('Archivo no válido.',true); } };
  r.readAsText(file);
}

// ===================== FUSIÓN entre dispositivos =====================
// Reglas: por variante gana quien la practicó más recientemente (item.ts).
// Los contadores acumulados (líneas/precisión) toman el máximo entre ambos lados,
// para no perder progreso — con el costo de no sumar sesiones hechas en paralelo sin sincronizar.
// La racha toma el día más avanzado. Las líneas propias (PGN) se unen por id.
function mergeStores(local, remote){
  if(!remote) return local;
  if(!local) return remote;
  const merged=defaultStore();
  const ids=new Set([...Object.keys(local.items||{}), ...Object.keys(remote.items||{})]);
  ids.forEach(id=>{
    const a=local.items[id], b=remote.items[id];
    if(a&&b) merged.items[id]=(a.ts||0)>=(b.ts||0)?a:b;
    else merged.items[id]=a||b;
  });
  merged.stats={
    lines:Math.max(local.stats.lines||0, remote.stats.lines||0),
    attempts:Math.max(local.stats.attempts||0, remote.stats.attempts||0),
    correct:Math.max(local.stats.correct||0, remote.stats.correct||0),
  };
  if((local.streak.lastDay||'')>(remote.streak.lastDay||'')) merged.streak=local.streak;
  else if((remote.streak.lastDay||'')>(local.streak.lastDay||'')) merged.streak=remote.streak;
  else merged.streak={lastDay:local.streak.lastDay, count:Math.max(local.streak.count||0, remote.streak.count||0)};
  const map={}; (remote.customPgns||[]).forEach(p=>map[p.id]=p); (local.customPgns||[]).forEach(p=>map[p.id]=p);
  merged.customPgns=Object.values(map);
  merged.settings=local.settings||remote.settings;
  return merged;
}

// ===================== Sincronización en la nube (Firebase) =====================
const sync={ configured:false, signedIn:false, busy:false, lastSync:null, pushTimer:null };
function renderSyncUI(){
  const badge=$('syncBadge'); if(!badge) return;
  const panel=$('accountSignedOut'), panel2=$('accountSignedIn');
  if(!sync.configured){ badge.textContent='sin nube configurada'; badge.className='pill'; if(panel)panel.style.display='none'; if(panel2)panel2.style.display='none'; return; }
  if(!sync.signedIn){ badge.textContent='sin cuenta'; badge.className='pill'; if(panel)panel.style.display='block'; if(panel2)panel2.style.display='none'; return; }
  if(panel)panel.style.display='none'; if(panel2)panel2.style.display='block';
  if(sync.busy){ badge.textContent='sincronizando…'; badge.className='pill warn'; }
  else if(sync.lastSync){ badge.textContent='sincronizado · '+timeAgo(sync.lastSync); badge.className='pill ok'; }
  else { badge.textContent='conectado'; badge.className='pill ok'; }
}
function timeAgo(ts){ const s=Math.round((Date.now()-ts)/1000); if(s<10)return'ahora'; if(s<60)return s+'s'; const m=Math.round(s/60); if(m<60)return m+'min'; const h=Math.round(m/60); return h+'h'; }

function schedulePush(){
  clearTimeout(sync.pushTimer);
  sync.pushTimer=setTimeout(doPush, 1500); // agrupa varios cambios seguidos en un solo push
}
async function doPush(){
  if(!sync.configured||!sync.signedIn||!window.CloudSync) return;
  sync.busy=true; renderSyncUI();
  try{ await window.CloudSync.push(store); sync.lastSync=Date.now(); }
  catch(e){ toast('No se pudo sincronizar (revisa tu conexión).',true); }
  sync.busy=false; renderSyncUI();
}
async function doPullAndMerge(){
  if(!sync.configured||!sync.signedIn||!window.CloudSync) return;
  sync.busy=true; renderSyncUI();
  try{
    const remote=await window.CloudSync.pull();
    if(remote){ store=mergeStores(store, remote); saveStore(); renderHome(); }
    await window.CloudSync.push(store); // sube el resultado fusionado, así ambos lados quedan iguales
    sync.lastSync=Date.now();
    toast('Avances sincronizados con tu cuenta.');
  } catch(e){ toast('No se pudo sincronizar (revisa tu conexión).',true); }
  sync.busy=false; renderSyncUI();
}
function initCloudSync(){
  function wireOnce(){
    const configured = !!(window.CloudSync && window.CloudSync.configured);
    sync.configured = configured;
    if(!configured){ renderSyncUI(); return; }
    window.CloudSync.onAuthChange(async (user)=>{
      sync.signedIn=!!user;
      $('accountEmail') && ( $('accountEmail').textContent = user? (user.email||user.displayName||'tu cuenta') : '' );
      renderSyncUI();
      if(user) await doPullAndMerge();
    });
  }
  if(window.CloudSync) wireOnce();
  else window.addEventListener('cloudsync-ready', wireOnce, {once:true});
}

// ===================== ITEMS (variantes entrenables) =====================
function repItems(){
  const a=[];
  REP.forEach(op=>op.lines.forEach((ln,i)=>a.push({id:op.id+'#'+i, opId:op.id, name:op.name, label:ln.label, color:op.color, eco:op.eco, moves:ln.moves, desc:op.desc})));
  store.customPgns.forEach(p=>a.push({id:'pgn#'+p.id, opId:'pgn#'+p.id, name:p.name, label:'PGN', color:p.color, eco:'', moves:p.moves, desc:'Tu repertorio cargado desde PGN.'}));
  return a;
}
function itemById(id){ return repItems().find(x=>x.id===id); }

// ===================== SRS (SM-2 lite) =====================
function st(id){ return store.items[id]; }
function schedule(id, grade){
  let it=store.items[id]||{ease:2.5,interval:0,due:0,reps:0,lapses:0,seen:false,hist:[]};
  if(grade>=3){
    if(it.reps===0) it.interval=1; else if(it.reps===1) it.interval=3; else it.interval=Math.round(it.interval*it.ease);
    it.ease=Math.max(1.3, Math.min(2.8, it.ease+(0.1-(5-grade)*(0.08+(5-grade)*0.02))));
    it.reps++;
  } else { it.reps=0; it.lapses++; it.interval=1; it.ease=Math.max(1.3,it.ease-0.2); }
  it.due=Date.now()+it.interval*DAY; it.seen=true; it.lastGrade=grade; it.ts=Date.now();
  it.hist=(it.hist||[]).concat([{t:Date.now(),g:grade}]).slice(-30);
  store.items[id]=it;
}
function dueItems(){ const now=Date.now(); return repItems().filter(x=>{const s=st(x.id); return s&&s.seen&&s.due<=now;}); }
function newItems(){ return repItems().filter(x=>{const s=st(x.id); return !s||!s.seen;}); }
function buildSession(){
  const due=dueItems().sort((a,b)=>(st(a.id).due-st(b.id).due)||(st(a.id).ease-st(b.id).ease));
  const news=newItems().slice(0, store.settings.newPerSession);
  return due.concat(news);
}
function masteryOf(id){ const s=st(id); if(!s||!s.seen) return 0; return Math.max(0,Math.min(1, s.interval/21)); }
function opMastery(opId){ const its=repItems().filter(x=>x.opId===opId); if(!its.length) return 0; return its.reduce((a,x)=>a+masteryOf(x.id),0)/its.length; }
function globalMastery(){ const its=repItems(); if(!its.length) return 0; return its.reduce((a,x)=>a+masteryOf(x.id),0)/its.length; }

// ===================== streak días =====================
function todayISO(){ const d=new Date(); return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10); }
function markPracticedToday(){
  const t=todayISO(); if(store.streak.lastDay===t) return;
  const y=new Date(Date.now()-DAY); const yISO=new Date(y.getTime()-y.getTimezoneOffset()*60000).toISOString().slice(0,10);
  store.streak.count = (store.streak.lastDay===yISO)? store.streak.count+1 : 1;
  store.streak.lastDay=t;
}

// ===================== ESTADO ENTRENAMIENTO =====================
let chess=null, activeOp=null, played=[], ply=0, orient='w';
let selected=null, awaiting=false, hintLevel=0, busy=false, lastMove=null;
let lineClean=true, cleanMove=true, revealed=false;
let missCount=0, hintUsedMove=false, movesByYou=0;
// sesión
let inSession=false, sessionQueue=[], sessionPos=0, sessionResults=[];
let activeItem=null; // item entrenándose
let freeMode=false;  // explorar (rival elige variante)

// ===================== VISTAS =====================
function show(view){ $('viewHome').style.display=view==='home'?'block':'none'; $('viewTrainer').style.display=view==='trainer'?'block':'none'; window.scrollTo(0,0); }

function renderPersistBadge(){
  const b=$('persistBadge');
  if(persistOK){ b.textContent='guardado activo'; b.className='pill ok'; }
  else { b.textContent='sin guardar (modo demo)'; b.className='pill warn'; b.title='Este entorno no permite guardar. Instálala desde tu GitHub Pages para conservar avances.'; }
}

function renderHome(){
  renderPersistBadge();
  // racha
  $('homeStreak').textContent=store.streak.count;
  $('homeMastery').innerHTML=Math.round(globalMastery()*100)+'<span class="sub">%</span>';
  const acc=store.stats.attempts? Math.round(100*store.stats.correct/store.stats.attempts):null;
  $('homeAcc').innerHTML = acc!=null? acc+'<span class="sub">%</span>':'—';
  $('homeLines').textContent=store.stats.lines;

  // sesión de hoy
  const due=dueItems().length, nw=Math.min(store.settings.newPerSession, newItems().length);
  const total=due+nw;
  const hero=$('sessionHero');
  if(total===0){
    hero.querySelector('.hero-count').textContent='Todo al día';
    hero.querySelector('.hero-sub').textContent = newItems().length>0 ? 'Sin repasos vencidos. Puedes adelantar líneas nuevas cuando quieras.' : 'Has visto todo el repertorio. Vuelve mañana para consolidar.';
    $('btnStartSession').textContent = newItems().length>0 ? 'Adelantar líneas nuevas' : 'Repasar de todos modos';
  } else {
    hero.querySelector('.hero-count').textContent=total+(total===1?' línea':' líneas');
    hero.querySelector('.hero-sub').textContent=(due?due+' de repaso':'')+(due&&nw?' · ':'')+(nw?nw+' nuevas':'');
    $('btnStartSession').textContent='Empezar sesión de hoy';
  }

  // mapa de repertorio
  const mapW=$('repMapWhite'), mapB=$('repMapBlack'); mapW.innerHTML=''; mapB.innerHTML='';
  REP.forEach(op=>{
    const m=opMastery(op.id); const row=el('button','rep-row'); row.type='button';
    const its=repItems().filter(x=>x.opId===op.id);
    const dueN=its.filter(x=>{const s=st(x.id);return s&&s.seen&&s.due<=Date.now();}).length;
    row.innerHTML='<div class="rr-top"><span class="rr-name">'+op.name+'</span>'+
      (dueN?'<span class="rr-due">'+dueN+' ●</span>':'')+'</div>'+
      '<div class="rr-bar"><span style="width:'+Math.round(m*100)+'%"></span></div>';
    row.addEventListener('click',()=>exploreOpening(op.id));
    (op.color==='w'?mapW:mapB).appendChild(row);
  });

  // pgns guardados
  const pl=$('pgnList'); pl.innerHTML='';
  store.customPgns.forEach(p=>{
    const it=itemById('pgn#'+p.id); const m=it?masteryOf(it.id):0;
    const row=el('div','pgn-row');
    const b=el('button','rep-row'); b.type='button';
    b.innerHTML='<div class="rr-top"><span class="rr-name">'+p.name+'</span><span class="rr-eco">'+(p.color==='w'?'blancas':'negras')+'</span></div>'+
      '<div class="rr-bar"><span style="width:'+Math.round(m*100)+'%"></span></div>';
    b.addEventListener('click',()=>exploreItem('pgn#'+p.id));
    const del=el('button','pgn-del'); del.type='button'; del.textContent='×'; del.title='Eliminar';
    del.addEventListener('click',(e)=>{e.stopPropagation(); if(confirm('¿Eliminar "'+p.name+'"?')){ store.customPgns=store.customPgns.filter(x=>x.id!==p.id); delete store.items['pgn#'+p.id]; saveStore(); renderHome(); }});
    row.appendChild(b); row.appendChild(del); pl.appendChild(row);
  });
  $('pgnEmpty').style.display=store.customPgns.length?'none':'block';
}

// ===================== iniciar entrenamiento =====================
function opFromItem(item){ return {id:item.opId, name:item.name, color:item.color, eco:item.eco, desc:item.desc, lines:[{label:item.label, moves:item.moves}]}; }
function opFull(opId){ return REP.find(o=>o.id===opId); }

function startOpening(op, opts){
  opts=opts||{};
  activeOp=op; chess=new window.Chess(); played=[]; ply=0;
  selected=null; hintLevel=0; awaiting=false; busy=false; lastMove=null;
  lineClean=true; cleanMove=true; revealed=false; missCount=0; hintUsedMove=false; movesByYou=0;
  orient=op.color;
  show('trainer');
  const side=op.color==='w'?'blancas':'negras';
  $('trainerTitle').textContent = op.name;
  $('trainerSub').textContent = (freeMode?'explora · ':'')+'juegas con '+side;
  $('sessionProgress').style.display = inSession? 'block':'none';
  if(inSession){ $('sessionProgress').textContent='Sesión · '+(sessionPos+1)+' / '+sessionQueue.length; }
  $('btnContinue').style.display='none';
  $('varBadge').textContent = freeMode? '' : (op.lines.length===1? op.name+' · '+op.lines[0].label : '');
  $('plyTotal').textContent=Math.max(...op.lines.map(l=>l.moves.length));
  $('btnHint').disabled=false; $('btnRestart').disabled=false; $('btnUndo').disabled=true;
  setIdea('idea','Empieza la línea','La máquina juega la respuesta del rival. Encuentra el movimiento del repertorio.');
  updateSideLabels();
  renderBoard(); renderLog(); autoAdvance();
}
function updateSideLabels(){
  const rivalColor = activeOp.color==='w' ? 'b' : 'w';
  const rivalWord = rivalColor==='w' ? 'blancas' : 'negras';
  const youWord = activeOp.color==='w' ? 'blancas' : 'negras';
  const chip = c => '<span class="chip" style="background:'+(c==='w'?'#FAFAF5':'#1B1B1B')+';border:1.5px solid #8C8880;width:14px;height:14px;display:inline-block;border-radius:2px"></span>';
  $('labelTop').innerHTML = chip(rivalColor)+'<span>juega el rival ('+rivalWord+')</span>';
  $('labelBottom').innerHTML = chip(activeOp.color)+'<span><span class="who">Tú</span> juegas aquí ('+youWord+')</span>';
}
function exploreOpening(opId){ inSession=false; freeMode=true; activeItem=null; startOpening(opFull(opId)); }
function exploreItem(itemId){ inSession=false; freeMode=false; const it=itemById(itemId); activeItem=it; startOpening(opFromItem(it)); }

// ===================== sesión SRS =====================
function startSession(){
  sessionQueue=buildSession();
  if(sessionQueue.length===0){ // nada vencido ni nuevo: repaso libre de lo peor
    const worst=repItems().slice().sort((a,b)=>masteryOf(a.id)-masteryOf(b.id)).slice(0,5);
    sessionQueue=worst;
  }
  inSession=true; freeMode=false; sessionPos=0; sessionResults=[];
  nextInSession();
}
function nextInSession(){
  if(sessionPos>=sessionQueue.length){ endSession(); return; }
  activeItem=sessionQueue[sessionPos];
  startOpening(opFromItem(activeItem));
}
function endSession(){
  inSession=false;
  const n=sessionResults.length;
  const avg=n? (sessionResults.reduce((a,g)=>a+g,0)/n):0;
  const clean=sessionResults.filter(g=>g>=5).length;
  markPracticedToday(); saveStore();
  show('home'); renderHome();
  let msg='Sesión terminada: '+n+' línea'+(n===1?'':'s')+'. '+clean+' sin errores.';
  if(avg>=4.3) msg+=' Dominio sólido, vas muy bien.';
  else if(avg>=3) msg+=' Vas bien; las que fallaste volverán pronto.';
  else if(n) msg+=' Repasa con calma: te las reprogramé para que vuelvan pronto.';
  toast(msg);
}

// ===================== motor multi-línea =====================
function compat(op, sans){ return op.lines.filter(ln=>ln.moves.length>sans.length && ln.moves.slice(0,sans.length).every((m,i)=>m.san===sans[i])); }
function fromToOf(san){ try{ const p=new window.Chess(chess.fen()); const m=p.move(san); return m?{from:m.from,to:m.to}:null; }catch(e){ return null; } }
function pieceWord(pc){ if(!pc) return 'una pieza'; return ({p:'un peón',n:'un caballo',b:'un alfil',r:'una torre',q:'la dama',k:'el rey'})[pc.type]||'una pieza'; }

function autoAdvance(){
  while(true){
    const cs=compat(activeOp,played);
    if(cs.length===0){ finishLine(); return; }
    if(chess.turn()===activeOp.color) break;
    const opts=[...new Set(cs.map(l=>l.moves[ply].san))];
    const san=opts[Math.floor(Math.random()*opts.length)];
    const line=cs.find(l=>l.moves[ply].san===san); const note=line.moves[ply].note;
    const res=chess.move(san); lastMove=res?{from:res.from,to:res.to}:null; played.push(san); ply++;
    setIdea('idea','Juega el rival','<span class="mv">'+san+'</span>'+(note?' — '+note:''));
  }
  maybeReveal(); updateTurn();
  awaiting=true; cleanMove=true; hintUsedMove=false; hintLevel=0; $('btnUndo').disabled=(ply===0);
  renderBoard(); renderLog();
}
function maybeReveal(){
  if(revealed||freeMode) return;
  const cs=compat(activeOp,played);
  if(cs.length===1 && ply>=2){ revealed=true; $('varBadge').textContent=activeOp.name+' · '+cs[0].label; }
}
function finishLine(){
  awaiting=false; updateTurn(true);
  // identificar la línea jugada y su itemId
  let itemId=null;
  if(activeItem) itemId=activeItem.id;
  else { // explorar: buscar en el repertorio la línea que coincide
    const full=opFull(activeOp.id)||activeOp;
    const idx=(full.lines||[]).findIndex(l=>l.moves.map(m=>m.san).join(' ')===played.join(' '));
    if(idx>=0) itemId=activeOp.id+'#'+idx;
  }
  const grade=gradeNow();
  if(itemId){ schedule(itemId, grade); }
  store.stats.lines++; markPracticedToday(); saveStore();
  if(inSession){ sessionResults.push(grade); sessionPos++; }
  const gt = grade>=5?'¡Impecable!':grade>=4?'Muy bien.':grade>=3?'Bien, con algún tropiezo.':'A reforzar.';
  const nextDue = itemId&&st(itemId)? humanizeDue(st(itemId).interval):null;
  setIdea('done','Línea completa · '+gt,
    (activeOp.name)+(activeOp.lines.length===1?' · '+activeOp.lines[0].label:'')+'. '+
    (nextDue?('Próximo repaso: '+nextDue+'. '):'')+
    (inSession?'Pulsa <span class="mv">Continuar</span>.':'Pulsa <span class="mv">Reiniciar</span> o vuelve al inicio.'));
  $('btnHint').disabled=true; $('btnUndo').disabled=false;
  if(inSession){ $('btnContinue').style.display='inline-block'; }
  renderLog();
}
function gradeNow(){
  let penalty=missCount + (hintLevelMaxUsed>=2?2:(hintLevelMaxUsed>=1?1:0));
  return Math.max(1, 5-penalty);
}
let hintLevelMaxUsed=0;

function updateTurn(done){
  $('plyNow').textContent=ply; $('turnTag').classList.toggle('black', chess.turn()==='b');
  $('turnText').textContent = done?'línea terminada':(chess.turn()===activeOp.color?'tu turno — mueve':'juega la máquina');
}

// ===================== tablero =====================
function renderBoard(){
  const board=$('board'); board.innerHTML='';
  const grid=chess.board();
  const rO=orient==='w'?[0,1,2,3,4,5,6,7]:[7,6,5,4,3,2,1,0];
  const fO=orient==='w'?[0,1,2,3,4,5,6,7]:[7,6,5,4,3,2,1,0];
  const rl=$('ranks'); rl.innerHTML=''; rO.forEach(r=>{const d=el('div');d.textContent=(8-r);rl.appendChild(d);});
  const fl=$('files'); fl.innerHTML=''; fO.forEach(f=>{const d=el('div');d.textContent=FILES[f];fl.appendChild(d);});
  let targets=[]; if(selected){ targets=chess.moves({square:selected,verbose:true}).map(m=>({to:m.to,cap:!!m.captured})); }
  let guideSq=null;
  if(awaiting && !selected && store.settings.guideMode){ const exps=expectedSans(); if(exps.length){ const ft=fromToOf(exps[0]); if(ft) guideSq=ft.from; } }
  rO.forEach(r=>{ fO.forEach(f=>{
    const sq=FILES[f]+(8-r); const cell=el('div','sq '+(((f+r)%2===1)?'dark':'light')); cell.dataset.sq=sq;
    const pc=grid[r][f]; if(pc){ const sp=el('span','piece '+pc.color); const im=el('img'); im.src='./pieces/'+pc.color+pc.type.toUpperCase()+'.svg'; im.alt=''; im.draggable=false; sp.appendChild(im); cell.appendChild(sp); }
    if(selected===sq) cell.classList.add('selected');
    const t=targets.find(x=>x.to===sq); if(t){ if(t.cap)cell.classList.add('target-capture'); cell.appendChild(el('span','dot')); }
    if(lastMove&&(lastMove.from===sq||lastMove.to===sq)) cell.classList.add('lastmove');
    if(guideSq===sq) cell.classList.add('guide');
    if(awaiting){ const mine=pc&&pc.color===activeOp.color; if(mine||selected) cell.classList.add('playable'); }
    cell.addEventListener('click',()=>onSquare(sq)); board.appendChild(cell);
  });});
}
function onSquare(sq){
  if(!awaiting||busy) return; const pc=chess.get(sq);
  if(selected){ if(sq===selected){selected=null;renderBoard();return;} if(pc&&pc.color===activeOp.color){selected=sq;renderBoard();return;} tryMove(selected,sq); return; }
  if(pc&&pc.color===activeOp.color){ selected=sq; renderBoard(); }
}
function expectedSans(){ const cs=compat(activeOp,played); return [...new Set(cs.map(l=>l.moves[ply].san))]; }
function tryMove(from,to){
  const legal=chess.moves({square:from,verbose:true}).find(m=>m.to===to);
  if(!legal){ flash(to,'flash-bad'); selected=null; renderBoard(); registerMiss(); setIdea('bad','Movimiento ilegal','Esa pieza no puede ir ahí. Piensa en la idea de la apertura.'); return; }
  const exps=expectedSans(); const match=exps.map(fromToOf).find(ft=>ft&&ft.from===from&&ft.to===to);
  if(match){
    const res=chess.move({from:from,to:to,promotion:'q'}); lastMove={from:res.from,to:res.to};
    const cs=compat(activeOp,played); const line=cs.find(l=>l.moves[ply].san===res.san); const note=line?line.moves[ply].note:null;
    played.push(res.san); ply++; selected=null; hintLevel=0; movesByYou++;
    store.stats.attempts++; if(cleanMove){ store.stats.correct++; } saveStore();
    flash(to,'flash-good');
    setIdea('good','¡Correcto!','<span class="mv">'+res.san+'</span>'+(note?' — '+note:' — jugada del repertorio.'));
    awaiting=false; updateTurn(); renderBoard(); renderLog();
    busy=true; setTimeout(()=>{ busy=false; autoAdvance(); },440);
  } else {
    flash(to,'flash-bad'); selected=null; renderBoard(); registerMiss();
    const ft=exps.length?fromToOf(exps[0]):null; const hn=ft?pieceWord(chess.get(ft.from)):'otra pieza';
    setIdea('bad','No es la jugada del repertorio','Es legal, pero la teoría pide otra cosa. Pista: mueve '+hn+'. Usa <span class="mv">Pista</span> para ver desde dónde.');
  }
}
function registerMiss(){ missCount++; cleanMove=false; lineClean=false; }
function flash(sq,cls){ const e=document.querySelector('.sq[data-sq="'+sq+'"]'); if(!e)return; e.classList.add(cls); setTimeout(()=>{const x=document.querySelector('.sq[data-sq="'+sq+'"]'); if(x)x.classList.remove(cls);},480); }

function doHint(){
  if(!awaiting) return; const exps=expectedSans(); if(!exps.length) return; const ft=fromToOf(exps[0]); if(!ft) return;
  document.querySelectorAll('.sq.hint').forEach(e=>e.classList.remove('hint'));
  hintLevel=Math.min(hintLevel+1,2); hintLevelMaxUsed=Math.max(hintLevelMaxUsed,hintLevel); hintUsedMove=true;
  const fe=document.querySelector('.sq[data-sq="'+ft.from+'"]'); if(fe)fe.classList.add('hint');
  if(hintLevel===1){ cleanMove=false; setIdea('idea','Pista','Mueve '+pieceWord(chess.get(ft.from))+' desde <span class="mv">'+ft.from+'</span>. ¿A dónde va?'); }
  else { const te=document.querySelector('.sq[data-sq="'+ft.to+'"]'); if(te)te.classList.add('hint'); setIdea('idea','Pista completa','La jugada es <span class="mv">'+ft.from+' → '+ft.to+'</span>.'); }
}
function doUndo(){
  if(ply===0) return; chess.undo(); played.pop(); ply--;
  if(ply>0 && chess.turn()!==activeOp.color){ chess.undo(); played.pop(); ply--; }
  lastMove=null; selected=null; hintLevel=0; awaiting=false; $('btnHint').disabled=false; autoAdvance();
}
function doRestart(){ hintLevelMaxUsed=0; if(activeItem) startOpening(opFromItem(activeItem)); else if(activeOp) startOpening(opFull(activeOp.id)||activeOp); }

function renderLog(){
  const log=$('movesLog'); const hist=chess.history();
  if(hist.length===0){ log.innerHTML='<span class="num">—</span>'; return; }
  const out=[]; for(let i=0;i<hist.length;i++){ const w=(i%2===0); const you=(w&&activeOp.color==='w')||(!w&&activeOp.color==='b'); if(w)out.push('<span class="num">'+(Math.floor(i/2)+1)+'.</span>'); out.push('<span class="'+(you?'ply-you':'')+'">'+hist[i]+'</span>'); }
  log.innerHTML=out.join(' ');
}
function setIdea(kind,head,body){
  const box=$('ideaBox'); box.className='idea'+(kind==='good'?' good':kind==='bad'?' bad':kind==='done'?' done':'');
  box.querySelector('.head').textContent=head; $('ideaBody').innerHTML=body;
  $('opDesc').textContent=(activeOp&&(kind==='idea'||kind==='done'))?(activeOp.desc||''):'';
}
function humanizeDue(days){ if(days<=1) return 'mañana'; if(days<7) return 'en '+days+' días'; if(days<30) return 'en '+Math.round(days/7)+' semana(s)'; return 'en '+Math.round(days/30)+' mes(es)'; }

// ===================== PGN propio =====================
function parsePgnMoves(pgn){
  let s=pgn.replace(/\[[^\]]*\]/g,' ').replace(/\{[^}]*\}/g,' ').replace(/;[^\n]*/g,' ').replace(/\$\d+/g,' ').replace(/\d+\.(\.\.)?/g,' ').replace(/1-0|0-1|1\/2-1\/2/g,' ').replace(/\*/g,' ');
  while(/\([^()]*\)/.test(s)) s=s.replace(/\([^()]*\)/g,' ');
  return s.trim().split(/\s+/).filter(Boolean);
}
function savePgn(){
  const raw=$('pgnInput').value.trim(); const msg=$('pgnMsg'); msg.className='pgn-msg';
  const name=($('pgnName').value.trim())||('Mi línea '+(store.customPgns.length+1));
  if(!raw){ msg.classList.add('err'); msg.textContent='Pega una línea primero.'; return; }
  const color=document.querySelector('input[name="pgnColor"]:checked').value;
  const toks=parsePgnMoves(raw); if(!toks.length){ msg.classList.add('err'); msg.textContent='No encontré jugadas.'; return; }
  const test=new window.Chess(); const moves=[];
  for(const t of toks){ let r=null; try{ r=test.move(t); }catch(e){ r=null; } if(!r){ msg.classList.add('err'); msg.textContent='Jugada inválida cerca de "'+t+'".'; return; } moves.push({san:r.san}); }
  if(moves.length<2){ msg.classList.add('err'); msg.textContent='Muy corta para practicar.'; return; }
  const id='p'+Date.now().toString(36);
  store.customPgns.push({id,name,color,moves}); saveStore();
  msg.classList.add('ok'); msg.textContent='Guardada: '+moves.length+' medios-movimientos.';
  $('pgnInput').value=''; $('pgnName').value=''; renderHome();
}

// ===================== toast =====================
let toastT=null;
function toast(text,isErr){ const t=$('toast'); t.textContent=text; t.className='toast show'+(isErr?' err':''); clearTimeout(toastT); toastT=setTimeout(()=>{t.className='toast';},4200); }

// ===================== init =====================
function initApp(){
  loadStore();
  // wiring
  $('btnStartSession').addEventListener('click',startSession);
  $('btnExplore').addEventListener('click',()=>{ const its=repItems(); exploreOpening(REP[Math.floor(Math.random()*REP.length)].id); });
  $('btnSavePgn').addEventListener('click',savePgn);
  $('btnExport').addEventListener('click',exportStore);
  $('fileImport').addEventListener('change',e=>{ if(e.target.files[0]) importStore(e.target.files[0]); e.target.value=''; });
  $('btnBack').addEventListener('click',()=>{ inSession=false; show('home'); renderHome(); });
  $('btnHint').addEventListener('click',doHint);
  $('btnUndo').addEventListener('click',doUndo);
  $('btnRestart').addEventListener('click',doRestart);
  $('btnContinue').addEventListener('click',()=>{ nextInSession(); });
  const nps=$('newPerSession'); nps.value=store.settings.newPerSession; nps.addEventListener('change',()=>{ store.settings.newPerSession=Math.max(0,Math.min(20,parseInt(nps.value)||0)); saveStore(); renderHome(); });
  const gm=$('guideMode'); if(gm){ gm.checked=store.settings.guideMode!==false; gm.addEventListener('change',()=>{ store.settings.guideMode=gm.checked; saveStore(); if(activeOp) renderBoard(); }); }
  const bSignIn=$('btnSignIn'); if(bSignIn) bSignIn.addEventListener('click',async()=>{ try{ await window.CloudSync.signIn(); }catch(e){ toast('No se pudo iniciar sesión.',true); } });
  const bSignOut=$('btnSignOut'); if(bSignOut) bSignOut.addEventListener('click',async()=>{ await window.CloudSync.signOutUser(); toast('Cerraste sesión. Tus avances siguen guardados en este dispositivo.'); });
  const bSyncNow=$('btnSyncNow'); if(bSyncNow) bSyncNow.addEventListener('click',doPullAndMerge);
  initCloudSync();
  show('home'); renderHome();
}
window.__initApp=initApp;
})();
