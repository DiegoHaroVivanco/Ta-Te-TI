const socketIO = require('socket.io');
const evaluador = require('./back-tateti/evaluador');
const DatosTateti = require('./back-tateti/tateti');
const io = socketIO();

let posYMarca = new DatosTateti;
let turno = true; 
let figura = true; // true -> x | false -> o

io.on('connection', (socket) =>{ 
    console.log("Se conectó un nuevo cliente");
    //console.log(socket.id);
    socket.broadcast.emit('reset', {});    // envia un msj a todos menos a la socket que se acaba de conectar 
    socket.emit('init', {figure: figura}); // envio la figura que le toca jugar
    socket.figure = figura;
    socket.tablaUsr = [];
    figura = !figura;

    // le digo al servidor que hacer cuando alguien envie un msj de tipo "nuevo-movimiento"
    socket.on("nuevo-movimiento", (dato)=>{
        //console.log(dato);    
        
        if(!posYMarca.posicionOcupada(dato.posicion)){
            // Evaluar si es tu turno
            if(turno == socket.figure){
                socket.tablaUsr.push(parseInt(dato.posicion)); // apilo la pos que se acaba de marcar
                
                // marcamos la pos como ocupada y enviamos el movimiento
                posYMarca.setPosicionesOcupadas(dato.posicion);
                io.emit("alguien-marco", {posicion: dato.posicion, figura: socket.figure}); // envio en que pos se jugó y con que figura    
                
                // Evaluamos si el usuario ganó
                let evaluacion = evaluador(socket.tablaUsr);
                console.log("Resultado "+evaluacion+"tablero: "+socket.tablaUsr );
                
                posYMarca.aumentarCantMarcas();
                if(evaluacion){
                    io.emit("gano",{figura: socket.figure}); // les digo a todas las sockets quien ganó    
                    posYMarca.reiniciarMarcas();
                }else if(posYMarca.evaluarEmpate()){
                    io.emit('empataron', {});   
                    posYMarca.reiniciarMarcas();
                }
                
                turno = !turno;
                socket.on("reiniciarTab", () =>{
                    posYMarca.reiniciarMarcas();
                    posYMarca.reiniciarPosiciones(); // reinicio el tablero
                    io.emit('reset', {});
                    socket.tablaUsr = [];
                });
            }else{
                socket.emit('no-te-toca', {});
            }
        }else{
            console.log("Esta posicion está ocupada");
        }
    });
});

module.exports = io;