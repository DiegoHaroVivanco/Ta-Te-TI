const fs = require('fs');

//Lógica del juego, donde a partir de las dos elecciones de los jugadores retorna un resultado buscando en la matriz
function getResult(choice_player1, choice_player2) {
    let game = [
        ['Empate', 'Gana papel', 'Gana piedra', 'Gana piedra', 'Gana Spock'],
        ['Gana papel', 'Empate', 'Gana tijera', 'Gana lagarto', 'Gana papel'],
        ['Gana piedra', 'Gana tijera', 'Empate', 'Gana tijera', 'Gana Spock'],
        [
            'Gana piedra',
            'Gana lagarto',
            'Gana tijera',
            'Empate',
            'Gana lagarto',
        ],
        ['Gana Spock', 'Gana papel', 'Gana Spock', 'Gana lagarto', 'Empate'],
    ];
    return game[choice_player2][choice_player1];
}
//A partir de un id retorna una sala buscandola en el archivo rooms.json
function findRoom(id) {
    let rooms_rawdata = fs.readFileSync('rooms.json');
    let rooms = JSON.parse(rooms_rawdata);
    let room = rooms.find((room) => room.roomID == id);
    return room;
}
//Evalúa si hay un resultado y si lo hay lo guarda en el atributo result de la sala
function setResult(id) {
    let room = findRoom(id);
    if (room.choices[0] && room.choices[1]) {
        room.result = getResult(room.choices[0], room.choices[1]);
        saveRoom(room);
    }
    return {
        roomID: room.roomID,
        result: room.result,
    };
}
//Guarda la elección que llega por parámetro en la sala con el id por parámetro
function setChoice(choice, id) {
    let room = findRoom(id);
    if (!room.choices[0]) {
        room.choices[0] = choice;
    } else if (!room.choices[1]) {
        room.choices[1] = choice;
    }
    saveRoom(room);
    return {
        roomID: room.roomID,
        result: room.result,
    };
}
//Crea la sala cuando el jugador 1 entra a la página web
function createRoom() {
    let room = {
        roomID: generateID(),
        choices: ['', ''],
        result: '',
    };
    saveRoom(room);
    return {
        roomID: room.roomID,
        result: room.result,
    };
}
//Función para unirse a una sala
function joinRoom(id) {
    let room = findRoom(id);
    if (room) {
        return {
            roomID: room.roomID,
            result: room.result,
        };
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateID() {
    let unix = new Date();
    let ran = getRandomInt(1, 50);
    let id = unix.getTime() + ran;

    return id;
}
//Guarda la sala que llega por parámetro en el archivo rooms.json
function saveRoom(room) {
    let rooms_rawdata = fs.readFileSync('rooms.json');
    let rooms = JSON.parse(rooms_rawdata);

    if (!findRoom(room.roomID)) {
        rooms.push(room);
    } else {
        let index = -1;
        let pos = rooms.find(function(item, i) {
            if (item.roomID == room.roomID) {
                index = i;
                return i;
            }
        });
        rooms.splice(index, 1, room);
    }

    fs.writeFileSync('rooms.json', JSON.stringify(rooms, null, 2));
}
function resetRoom(id){
    let r = findRoom(id);
    r.result = '';
    r.choices[0] = '';
    r.choices[1] = '';
    saveRoom(r);
    return {
        roomID: r.roomID,
        result: r.result,
    };
}
module.exports = {
    createRoom: createRoom,
    setResult: setResult,
    joinRoom: joinRoom,
    setChoice: setChoice,
    resetRoom: resetRoom
};