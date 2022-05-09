module.exports = (tablaUsr) =>{
    const combinaciones = [ // cada arreglo representa a una combinacio con la que se puede ganar
        [1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]
    ];
    
    for(let i = 0; i < combinaciones.length; i++){
        const combinacion = combinaciones[i];
        let gano = true;
        for(let j=0; j < combinacion.length; j++){
            if(!estaEnElArray(tablaUsr, combinacion[j])){    
                gano = false;
                break;
            }    
        }
        if(gano){return true}    
    }
    return false;
}

function estaEnElArray(array, elem){
    return array.indexOf(elem) > -1;
}
