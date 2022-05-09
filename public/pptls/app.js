const choices = document.querySelectorAll('.choice'); //Choices = vector con botones para el juego
const hide_choices = document.querySelector('.game_choices'); //Traigo el div para poder ocultar todos los botones al hacerle click a uno
const pptls = '/pptls'; //prefix
const text = document.getElementById('text'); //Caja donde se muestra el resultado
var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString); //Parámetros que llegan a travéz de la URL
var roomID = urlParams.get('roomID'); //Obtener el parámetro roomID
var game;

// Función para hacer peticiones Fetch generalizadas
gameFetch = function(method, url, data) {
    return fetch(pptls + url, {
        method: `${method}`,
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then((response) => response.json());
};
//Función para enviarle la opción que elija el jugador al hacerle click
function choiceListener() {
    for (let i = 0; i < choices.length; i++) {
        let choice = choices[i];

        choice.addEventListener('click', () => {
            if (!game.result) {
                text.textContent = 'Esperando al oponente...';
            }
            hide_choices.style.display = 'none';
            gameFetch('POST', '/room/choice/' + game.roomID, {
                    choice: choice.id,
                })
                .then(getRoom)
                .then(getResult);
        });
    }
}
// Setea el URL con el id de la sala para que se pueda jugar de a 2
function setURL(response) {
    let roomElement = document.getElementById('room');
    roomElement.value = window.location.href + '?roomID=' + response.roomID;
    return response;
}
// Función principal donde se crea o se ingresa a una sala dependiendo si es el jugador 1 o 2
function startGame() {
    const paramName = 'roomID=';
    let paramPos = window.location.search.indexOf(paramName);

    if (paramPos != -1) {
        gameFetch(
                'POST',
                '/room/' +
                window.location.search.substring(paramPos + paramName.length)
            )
            .then(getRoom)
            .then(getResult);
    } else {
        gameFetch('POST', '/room/').then(getRoom).then(setURL).then(getResult);
    }
    setTimeout(listener, 1000);
}
// Función recursiva a la espera del resultado de la partida
function listener() {
    gameFetch('GET', '/room/' + game.roomID)
        .then(getRoom)
        .then(getResult);

    setTimeout(listener, 2000);
}
//Guardo datos de la sala en una variable global para poder acceder al id en todo el programa
function getRoom(response) {
    game = response;
    return response;
}
//Si ya hay un resultado se imprime en pantalla
function getResult(response) {
    if (response.result) {
        text.textContent = response.result;
        gameFetch('POST', '/room/reset/' + game.roomID).then(getRoom);
        hide_choices.style.display = 'block';
    }
}
window.addEventListener('load', choiceListener());