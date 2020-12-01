let ID_CLIENTE;
let idPeticion = 0;
let brokers = [];
let COORDINADOR_IP;
let COORDINADOR_PUERTO;
let fechaSincro = new Date();
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
        fechaSincro = new Date().getTime() + offset + delay;
    };
    sincroNTP.getOffSetDelayNTP(clientNTP, callback);
}, 120000);

setInterval(function () {
    console.log('Envia heartbeat')
    let obj = {
        emisor : ID_CLIENTE,
        fecha : fechaSincro
    }
    sock.send(['/heartbeat', obj]);
}, 500)

setTimeout(() => {
    ID_CLIENTE = init.getProp('ID_CLIENTE');
    COORDINADOR_IP = init.getProp('COORDINADOR_IP');
    COORDINADOR_PUERTO = init.getProp('COORDINADOR_PUERTO');
    initPrompt();
}, 1000);

function enviarMensaje(cliente, mensaje, topico) {
    let i = 0;
    let broker = null;
    while (i < brokers.length && broker == null) {
        if (brokers[i].topicos.some(topicoBroker => { topicoBroker == topico; })) {
            broker = brokers[i];
        }
        i++;
    }
    if (broker != null) {
        broker.
    }
    idPeticion++;
}

function a() {
    socket.on('connect', function (fd, ep) {
        socket.send([topico, JSON.stringify(mensaje)]);
        socket.unmonitor();
        socket.close();
    });
    socket.monitor(100, 0);
}

function initPrompt() {
    var readline = require('readline');
    var r = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    r.on('line', function (linea) {
        let obj = {
            emisor: '',
            mensaje: '',
            fecha: '',
        }
        let topico;
        let lineaComando = '';
        lineaComando = linea.toString();
        let separado = lineaComando.split(" ");
        separado[0] = separado[0].toLowerCase();
        if (separado[0] == 'salir') {
            r.close();
        } else {
            switch (separado[0]) {
                case 'enviar':
                    let mensajeSpliteado = [];
                    if (separado[1] != '-g' && separado[1] != '-u') { // mensaje/all
                        for (let i = 1; i < separado.length; i++) {
                            mensajeSpliteado.push(separado[i]);
                        }
                        topico = 'message/all';   // no se cual deberia llevar este nombre, si topico o obj.emisor
                    } else {
                        for (let i = 3; i < separado.length; i++) {
                            mensajeSpliteado.push(separado[i]);
                        }
                        if (separado[1] == '-g') { // grupo
                            topico = 'message/g_' + separado[2];
                        } else {
                            if (separado[1] == '-u') { // un X cliente
                                topico = 'message/' + separado[2];
                            }
                        }
                    }
                    let mensaje = mensajeSpliteado.join();
                    mensaje = mensaje.replace(/,/g, ' ');
                    let mensajeCompleto = [];
                    let n = 0;
                    if (separado[1] != '-g' && separado[1] != '-u') {
                        n = 1;
                    } else {
                        n = 3;
                    }
                    for (let i = 0; i < n; i++) {
                        mensajeCompleto.push(separado[i]);
                    }
                    mensajeCompleto.push(mensaje);
                    console.log(mensajeCompleto);
                    obj.emisor = ID_CLIENTE;
                    obj.mensaje = mensaje;
                    obj.fecha = fechaSincro;
                    console.log('Topico: ' + topico);
                    console.log('Mensaje: ' + obj.mensaje);
                    break;
                case 'subscribirse':
                    topico = separado[1];
                    break;
                case '/group':
                    let grupo = separado[1];
                    break;
                default:
                    console.log('Comando inexistente');
            }
        }
    });
}