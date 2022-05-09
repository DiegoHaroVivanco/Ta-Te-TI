const fs = require('fs');

function leerArch(genero) {
    //leer archivo de palabras.json
    let arch = fs.readFileSync('palabra.json');
    return JSON.parse(arch)[genero];
}

function buscarPalabra(listaPalabras) {
    //retorna una palabra
    return listaPalabras[Math.floor(Math.random() * listaPalabras.length)];
}

function crearID() {
    if (fs.existsSync('datos.json')) {
        const arch = fs.readFileSync('datos.json');
        const listaJugadores = JSON.parse(arch);

        return (listaJugadores[listaJugadores.length - 1]['id'] += 1);
    } else {
        return 0;
    }
}

function crearJugador() {
    const lista = leerArch('frutas');
    const palabra = buscarPalabra(lista);

    let jugador = {
        id: crearID(),
        palabra: palabra,
        longitud: palabra.length,
        start: false,
        letra: '',
        aciertos: 0,
        errores: 0,
    };
    guardarDatos(jugador);

    return {
        id: jugador['id'],
        long: jugador['longitud'],
        start: jugador['start'],
        letra: '',
        intentos: jugador['intentos'],
        aciertos: jugador['aciertos'],
        errores: jugador['errores'],
    };
}

function guardarDatos(jugador) {
    if (!fs.existsSync('datos.json')) {
        let listaJugadores = [];
        listaJugadores.push(jugador);
        fs.writeFileSync('datos.json', JSON.stringify(listaJugadores, null, 2));
    } else {
        let listaJugadores = fs.readFileSync('datos.json');
        let lista = JSON.parse(listaJugadores);
        lista.push(jugador);
        fs.writeFileSync('datos.json', JSON.stringify(lista, null, 2));
    }
}

function EvaluarPalabra(id, letra) {
    //retornar la posion de la letra hacetada

    const arch = fs.readFileSync('datos.json');
    const listaJugadores = JSON.parse(arch);

    let pos = [];
    let ok = false;
    let jugador = listaJugadores[id];

    for (let i = 0; i < jugador['palabra'].length; i++) {
        if (letra.toUpperCase() == jugador['palabra'].toUpperCase()[i]) {
            pos.push(i);
            ok = true;
            jugador['aciertos'] += 1;
        }
    }

    if (!ok) jugador['errores'] += 1;

    listaJugadores[id] = jugador;
    fs.writeFileSync('datos.json', JSON.stringify(listaJugadores, null, 2));

    if (jugador['errores'] < 6) {
        return {
            arreglo: pos,
            long: jugador['longitud'],
            aciertos: jugador['aciertos'],
            errores: jugador['errores'],
        };
    } else {
        return {
            arreglo: pos,
            log: jugador['longitud'],
            palabra: jugador['palabra'],
            aciertos: jugador['aciertos'],
            errores: jugador['errores'],
        };
    }
}

module.exports = {
    crearJugador: crearJugador,
    EvaluarPalabra: EvaluarPalabra,
};