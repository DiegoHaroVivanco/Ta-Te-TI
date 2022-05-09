const ahorcado = '/ahorcado';
const DivContainer = document.getElementById('container-letras');
var ImgHorca = document.getElementById('horca');

function display(long) {
    for (let i = 0; i < long; i++) {
        var newDiv = document.createElement('div');
        //const newImg = document.createElement('img');
        //newImg.setAttribute('id', 'letra-' + i);
        //newImg.setAttribute('class', 'img-letra');
        /********añadiendo codigo */
        newDiv.setAttribute('id', 'cajaLetra-' + i);
        newDiv.classList.add('cuadrado');
        //newDiv.setAttribute('id', letra);
        //newDiv.appendChild(newImg);
        DivContainer.appendChild(newDiv);
    }
}

function DisplayLetras(datos, letra) {
    console.log(datos['arreglo']);

    if (datos['arreglo'].length > 0) {
        for (let i = 0; i < datos['arreglo'].length; i++) {
            /* imagenLetra = document.getElementById(
                'letra-' + datos['arreglo'][i]
            );
            imagenLetra.setAttribute(
                'src',
                './img/' + letra.toUpperCase() + '.png'
            ); */

            /**andiendo codigo  */

            var cajaL = document.getElementById(
                'cajaLetra-' + datos['arreglo'][i]
            );
            var newImg = document.createElement('img');
            newImg.setAttribute('class', 'img-letra');
            newImg.setAttribute('src', './img/' + letra.toUpperCase() + '.png');
            cajaL.appendChild(newImg);
            //DivContainer.appendChild(cajaL);
        }
    } else if (datos['errores'] < 6) {
        ImgHorca.setAttribute('src', './img/' + datos['errores'] + '.png');
    } else {
        alert('Perdiste  la  palabra era: ' + datos['palabra'].toUpperCase());
        location.reload();
    }

    if (datos['long'] == datos['aciertos']) {
        //&& datos['errores'] < 6
        alert('ADIVINASTE LA PALABRA DEL AHORCADO ⭐FELICITACIONES⭐');
        location.reload();
    }

    document.querySelector('#aciertos').value = datos['aciertos'];
    document.querySelector('#errores').value = datos['errores'];
}

ImgHorca.setAttribute('src', './img/0.png');
var Jugador;
var datos;

async function searchServer(method, url, data) {
    const res = await fetch(ahorcado + url, {
        method: `${method}`,
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    jugador = await res.json();

    display(jugador['long']);
}

searchServer('GET', '/jugador/');

async function EvaluarLetra(method, url, data) {
    const res = await fetch(ahorcado + url, {
        method: `${method}`,
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    datos = await res.json();
    DisplayLetras(datos, data['letra']);
}
let = letras_ingresadas = [];
var letters = /^[A-Za-z]+$/;
document.querySelector('#Evaluar').addEventListener('click', () => {
    const letra = document.querySelector('#letra').value;
    if (letters.test(letra) || letra == 'ñ') {
        if (letras_ingresadas.length == 0) {
            letras_ingresadas.push(letra);
            EvaluarLetra('POST', '/evaluar/', {
                id: jugador['id'],
                letra: letra,
            });
        } else if (!letras_ingresadas.includes(letra)) {
            letras_ingresadas.push(letra);
            EvaluarLetra('POST', '/evaluar/', {
                id: jugador['id'],
                letra: letra,
            });
        } else {
            alert('Esa letra ya ingresaste ingrese otra');
        }
    } else {
        alert('Ingrese solo letras');
    }
    document.querySelector('#letra').value = '';
    document.querySelector('#letra').focus();
});