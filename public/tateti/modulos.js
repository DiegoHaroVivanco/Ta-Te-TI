export function reiniciar(){ //
    const elem = document.querySelectorAll(".table");
    for(let i=0; i < elem.length; i++){
        elem[i].innerHTML = "";
    }
}
export function empate(){ //
    Swal.fire("Hay empate");
}

export function quienGano(figura){ //
    let figu = convertirFigura(figura);
    Swal.fire(figu + " Ganó la partida");
}

export function nuevaJugada(pos, figura){ //
    document.querySelector('#msj').innerHTML = " ES EL TURNO DE LAS "+convertirFigura(!figura);
    // dependiendo la pos en que se marcó, pongo la figura
    document.querySelector("#elemento-"+pos).innerHTML = convertirFigura(figura);
}
export function noTeToca(){ //
    Swal.fire("No es tu turno!!");
}
export function queFigura(figura){
    document.querySelector('#msj').innerHTML = "Jugas con: "+figura;
    if(figura == 'X'){
        document.querySelector('#msj').innerHTML += "<p> ES TU TURNO";
    }else{
        document.querySelector('#msj').innerHTML += "<p> NO ES TU TURNO";        
    }
}
export function convertirFigura(bandera){
    if(bandera){
        return "X"
    }else{return "O"}
}
