function jugar() {
    ponerBG();
    setTimeout(function() {
        window.location.assign('personaje.html');
    }, 2000);
    var sfxStart = new Audio('sfx/precios.m4a');
    sfxStart.play();
}

function ponerBG() {
    document.querySelector('.bg-transicion').classList.add('bg-transicion-show');
}

function quitarBG() {
    document.querySelector('.bg-transicion').style.backgroundColor = "rgba(0, 0, 0, 0)";
    setTimeout(function() {
        document.querySelector('.bg-transicion').classList.remove('bg-transicion-show');
    }, 2000);
}
let personajeActual = 1;
function siguientePersonaje(){
    personajeActual++;
    if(personajeActual == 7){
        personajeActual = 1;
    }
    document.getElementById('personaje').src="img/p"+personajeActual+".png"
    var sfxclic = new Audio('sfx/clic.m4a');
    sfxclic.play();

}

function anteriorPersonaje(){
    personajeActual--;
    if(personajeActual == 0){
        personajeActual = 6;
    }
    document.getElementById('personaje').src="img/p"+personajeActual+".png"
    sonarClic();
}
 
function sonarClic(){
    var sfxclic = new Audio('sfx/clic.m4a');
    sfxclic.play();
}

function personaje2(){
    localStorage.setItem('personaje1', personajeActual);
    localStorage.setItem('jugador1',document.getElementById('jugador1').value);
    ponerBG();
    setTimeout(
        function(){
            window.location.assign('personaje2.html')
        }
    )
}

function  comenzarJuego(){
        localStorage.setItem('personaje2', personajeActual);
    localStorage.setItem('jugador2',document.getElementById('jugador2').value);
    ponerBG();
    setTimeout(
        function(){
            window.location.assign('juego.html')
        }
    )
}

// ========== JUEGO ==========
// calaveras1/2 = calaveras acumuladas del jugador en la partida completa
let calaveras1 = 0;
let calaveras2 = 0;
const MAX_CALAVERAS = 3;

// rondaTerminada evita que ambos jugadores disparen en la misma ronda
let rondaTerminada = false;
// juegoTerminado evita disparos después de que alguien llegó a 3 calaveras
let juegoTerminado = false;

function cargarEscenario(){
    if(!localStorage.getItem('calaveras1')){
        localStorage.setItem('calaveras1', '0');
        localStorage.setItem('calaveras2', '0');
    }

    calaveras1 = parseInt(localStorage.getItem('calaveras1'), 10) || 0;
    calaveras2 = parseInt(localStorage.getItem('calaveras2'), 10) || 0;

    document.getElementById('jugador1').textContent = localStorage.getItem('jugador1');
    document.getElementById('jugador2').textContent = localStorage.getItem('jugador2');

    let personaje1 = localStorage.getItem('personaje1');
    let personaje2 = localStorage.getItem('personaje2');

    document.getElementById('personaje1').src = "img/p" + personaje1 + ".png";
    document.getElementById('personaje2').src = "img/p" + personaje2 + ".png";

    dibujarCalaveras();
    listos();
}

function listos(){
    setTimeout(function(){
        document.querySelector('.msj').style.opacity = "1";
    }, 500);
}

let conteoIniciado = false;

function conteo(){
    if(conteoIniciado) return;
    conteoIniciado = true;

    var sonarClic = new Audio('sfx/clic.m4a');
    document.querySelector('.msj').style.opacity = "0";
    document.querySelector('.no3').style.opacity = "1";
    sonarClic.play();

    // tiempo aleatorio entre 1 y 10 segundos para mostrar el "1"
    let tiempoRandom = Math.floor((Math.random() * 10) + 1) * 1000;

    setTimeout(function(){
        document.querySelector('.no3').style.opacity = "0";
        document.querySelector('.no2').style.opacity = "1";
        sonarClic.play();
        setTimeout(function(){
            document.querySelector('.no2').style.opacity = "0";
            document.querySelector('.no1').style.opacity = "1";
            sonarClic.play();
            setTimeout(function(){
                document.querySelector('.no1').style.opacity = "0";
                document.querySelector('.conteo').style.display = "none";
                sonarClic.play();
                // habilitar disparos al terminar el conteo
                rondaTerminada = false;
            }, tiempoRandom);
        }, 1000);
    }, 1000);
}

function dibujarCalaveras(){
    // calaveras1 = calaveras que tiene jugador 1 (acumuladas por perder rondas)
    let html1 = '';
    for(let i = 0; i < calaveras1; i++){
        html1 += "<img src='img/calavera.png'>";
    }
    document.querySelector('.muertes1').innerHTML = html1;

    let html2 = '';
    for(let i = 0; i < calaveras2; i++){
        html2 += "<img src='img/calavera.png'>";
    }
    document.querySelector('.muertes2').innerHTML = html2;

    // ocultar el contador de vidas (ya no se usa)
    document.querySelector('.vidas1').textContent = '';
    document.querySelector('.vidas2').textContent = '';
}

// Jugador 1 disparó primero: gana la ronda, jugador 2 recibe calavera
function disparo1(e){
    if(e) e.stopPropagation();
    if(rondaTerminada || juegoTerminado) return;
    rondaTerminada = true;

    sonarDisparo();
    calaveras2++;
    localStorage.setItem('calaveras2', calaveras2);
    dibujarCalaveras();

    if(calaveras2 >= MAX_CALAVERAS){
        juegoTerminado = true;
        ganador(1);
    } else {
        // Pausa breve y luego nueva ronda
        setTimeout(nuevaRonda, 1500);
    }
}

// Jugador 2 disparó primero: gana la ronda, jugador 1 recibe calavera
function disparo2(e){
    if(e) e.stopPropagation();
    if(rondaTerminada || juegoTerminado) return;
    rondaTerminada = true;

    sonarDisparo();
    calaveras1++;
    localStorage.setItem('calaveras1', calaveras1);
    dibujarCalaveras();

    if(calaveras1 >= MAX_CALAVERAS){
        juegoTerminado = true;
        ganador(2);
    } else {
        setTimeout(nuevaRonda, 1500);
    }
}

function nuevaRonda(){
    conteoIniciado = false;
    // Resetear el conteo visual para la siguiente ronda
    let conteoDiv = document.querySelector('.conteo');
    conteoDiv.style.display = "block";
    document.querySelector('.no3').style.opacity = "0";
    document.querySelector('.no2').style.opacity = "0";
    document.querySelector('.no1').style.opacity = "0";
    document.querySelector('.msj').style.opacity = "0";

    rondaTerminada = true; // bloquear hasta que termine el conteo
    listos();
}

function sonarDisparo(){
    var sfxDisparo = new Audio('sfx/disparo.m4a');
    sfxDisparo.play();
}

function ganador(jugador){
    let nombre = jugador == 1 ? localStorage.getItem('jugador1') : localStorage.getItem('jugador2');
    // Limpiar calaveras para la próxima partida
    localStorage.setItem('calaveras1', '0');
    localStorage.setItem('calaveras2', '0');
    mostrarGanador(nombre);
}

function mostrarGanador(nombre){
    document.getElementById('nombreGanador').textContent = nombre;
    document.getElementById('ganadorOverlay').classList.add('show');
    ponerBG();
}

function restart(){
    window.location.assign('personaje.html');
}