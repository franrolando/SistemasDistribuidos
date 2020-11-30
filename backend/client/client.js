let ID_CLIENTE ;
let idPeticion = 0;
let brokers = [];
let COORDINADOR_IP;
let COORDINADOR_PUERTO;
let date;
const sincroNTP = require('./clientSincro-NTP.js');
const init = require('./init.js');
const net = require('net');
const pub = require('./client-pub.js');
const request = require('./client-request.js');

var clientNTP = new net.Socket();
clientNTP.connect(1337, '127.0.0.1', function () {
    console.log('Connected')
});

setInterval(() => {
    let callback = (offset, delay) => {
        date = new Date().getTime() + offset + delay;
    };
    sincroNTP.getOffSetDelayNTP(clientNTP, callback);
}, 120000);

setInterval(function() {
	console.log('Envia mensaje nº', counter)
  sock.send(['/heartbeat', 'Este es el mensaje ' + counter++])
}, 500)

setTimeout(() => {
    ID_CLIENTE = init.getProp('ID_CLIENTE');
    COORDINADOR_IP = init.getProp('COORDINADOR_IP');
    COORDINADOR_PUERTO = init.getProp('COORDINADOR_PUERTO');
}, 1000);

function enviarMensaje(cliente,mensaje){

}

function a(){
    socket.on('connect', function (fd, ep) {
      socket.send([topico, JSON.stringify(mensaje)]);
      socket.unmonitor();
      socket.close();
    });
    socket.monitor(100, 0);
}