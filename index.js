const express = require('express');
const app = express();
const PORT = 8080;
const ahorcado = require('./ahorcado.js');
const pptls = require('./pptls.js');
const io = require('./socket-tateti');
const http = require('http');
app.io = io;
var letters = /^[A-Za-z]+$/;
app.use(express.static('public'));
app.use(express.json());
//Ahorcado
app.get('/ahorcado/jugador', (req, res) => {
    res.json(ahorcado.crearJugador());
});

app.post('/ahorcado/evaluar', (req, res) => {
    if (
        (!isNaN(req.body.id) && letters.test(req.body.letra)) ||
        req.body.letra == 'ñ'
    ) {
        res.json(ahorcado.EvaluarPalabra(req.body.id, req.body.letra));
    } else {
        res.status(404).send('Not found');
    }
});

//Piedra papel tijera lagarto Spock
app.post('/pptls/room', (req, res) => {
    res.json(pptls.createRoom());
});
app.post('/pptls/room/:roomID', (req, res) => {
    res.json(pptls.joinRoom(req.params.roomID));
});
app.get('/pptls/room/:roomID', (req, res) => {
    res.json(pptls.setResult(req.params.roomID));
});
app.post('/pptls/room/choice/:roomID', (req, res) => {
    res.json(pptls.setChoice(req.body.choice, req.params.roomID));
});
app.post('/pptls/room/reset/:roomID', (req, res) => {
    res.json(pptls.resetRoom(req.params.roomID));
});

// socket ta-te-tis
const server = http.createServer(app);
app.io.attach(server);

server.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));