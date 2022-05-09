import { reiniciar, empate, quienGano, nuevaJugada, noTeToca, queFigura, convertirFigura } from "./modulos.js";
const botonReset = document.getElementById("btnreset");
const botonJugar = document.getElementById("btnjugar");

function def_eventos() {
    const elements = document.querySelectorAll(".table");

    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        element.addEventListener("click", () => {
            const pos = element.id.split("-")[1]; // separa el id del elemento y devuelve lo de la pos 1, osea el numero
            console.log(element.id);
            enviarPos(pos);

        });
    }
}

const socket = io(); // esta función, sale de la libreria que se importó(en el html) 

function enviarPos(pos) {
    socket.emit("nuevo-movimiento", { posicion: pos }); // le envio un msj al servidor sobre el nuevo movimiento
}

function reinicarTablero(){
    botonReset.addEventListener('click', ()=>{
        socket.emit("reiniciarTab");
    });
}

botonJugar.addEventListener('click', ()=>{
    socket.emit("reiniciarTab");
});

socket.on('connect', () => {
    socket.on('init', (dato) => {
        console.log(dato);
        queFigura(convertirFigura(dato.figure));
    });
    socket.on('reset', () => {
        reiniciar();
    });
    socket.on("gano", (dato) => {
        quienGano(dato.figura);
        reiniciar();
    });
    socket.on("empataron", () => {
        empate();
        reiniciar();
    });
    socket.on('no-te-toca', () => {
        noTeToca();
    });
    socket.on("alguien-marco", (dato) => {
        // marco el casillero
        nuevaJugada(dato.posicion, dato.figura);
    });
});

reinicarTablero();
def_eventos();