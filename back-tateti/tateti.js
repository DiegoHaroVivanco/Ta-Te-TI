function DatosTateti(){
    this.posicionesOcupadas = [];
    this.cantMarcas = 0;

    this.setPosicionesOcupadas = (pos)=>{
        this.posicionesOcupadas[pos] = true;
    }
    
    this.posicionOcupada = (pos)=>{
        // Operador condicional (ternario)
        return ((this.posicionesOcupadas[pos]) ? true : false);
    }
    
    this.reiniciarPosiciones = ()=>{
        this.posicionesOcupadas = [];
    }

    this.aumentarCantMarcas = ()=>{
        this.cantMarcas++;
    }
    this.reiniciarMarcas = ()=>{
        this.cantMarcas = 0;
    }
    this.evaluarEmpate = ()=>{
        return((this.cantMarcas === 9)? true : false);
    }
}

module.exports = DatosTateti;