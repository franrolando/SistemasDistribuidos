const zmq = require('zeromq');
const requester = zmq.socket('req');
const init = require('./init.js');
const net = require('net');
let ID_CLIENTE;
let idPeticion = 0;
let brokers = [];
let COORDINADOR_IP;
let COORDINADOR_PUERTO;
let fechaSincro = new Date();
let mensajes = [];

/*
var clientNTP = new net.Socket();
clientNTP.connect(1337, '127.0.0.1', function () {
    console.log('Connected')
});

setInterval(() => {
    let callback = (offset, delay) => {
        fechaSincro = new Date().getTime() + offset + delay;
    };
    sincroNTP.getOffSetDelayNTP(clientNTP, callback);
}, 120000);*/



setTimeout(() => {
    ID_CLIENTE = init.getProp('ID_CLIENTE');
    COORDINADOR_IP = init.getProp('COORDINADOR_IP');
    COORDINADOR_PUERTO = init.getProp('COORDINADOR_PUERTO');
    requester.connect('tcp://' + COORDINADOR_IP + ':' + COORDINADOR_PUERTO);
    requester.on("message", function (reply) {
        reply = JSON.parse(reply);
        console.log('Recibo respuesta Coordinador: ');
        console.log(reply)
        if (reply.exito == true) {
            switch (reply.accion) {
                case (1):
                    publicarMensajeReply(reply.resultados.datosBroker, reply.idPeticion)
                    break;
                case (2):
                    subscribirseTopicoReply(reply.resultados.datosBroker, reply.idPeticion)
                    break;
                default:
                    console.log('Default case')
            }
        } else {
            console.log(reply.error.codigo + ": " + reply.error.mensaje);
        }
    });
    altaSubscripcion();
    /*setInterval(function () {
        console.log('Envia heartbeat')
        let obj = {
            emisor: ID_CLIENTE,
            fecha: fechaSincro
        }
        let brokerHeart = getBrokerByTopico('/heartbeat', 'P')
        brokerHeart.sock.send(['/heartbeat', obj]);
    }, 2000)*/
    initPrompt();
}, 1000);

function altaSubscripcion() {
    idPeticion++;
    let request = {
        idPeticion: idPeticion,
        accion: 2,
        topico: ID_CLIENTE
    }
    requester.send(JSON.stringify(request));
}

function subscribirseTopicoReply(brokersReply, idPeticionRep) {
    brokersReply.forEach(brokerReply => {
        let sock;
        if (idPeticionRep == 1 || (idPeticionRep != 1 && (brokerReply.topico != 'message/All' || brokerReply.topico != '/heartbeat'))) {
            let broker = getBrokerByTopico(brokerReply.topico, "S");
            if (broker != null) {
                sock = broker.sock;
            } else {
                sock = zmq.socket('sub')
                sock.connect('tcp://' + brokerReply.ip + ':' + brokerReply.puerto);
                sock.on('message', function (topic, message) {
                    if (message.emisor != ID_CLIENTE) {
                        console.log('Recibio topico:', topic.toString(), 'con mensaje:')
                        console.log(JSON.parse(message.toString()));
                    }
                })
            }
            sock.subscribe(brokerReply.topico);
        }
    });
}

function subscribirseTopico(topico) {
    let broker = getBrokerByTopico(topico, "S");
    if (broker != null) {
        broker.sock.subscribe(topico);
    } else {
        let sock = zmq.socket('sub');
        sock.connect('tcp://' + brokerReply.ip + ':' + brokerReply.puerto + '')
        let brokerNuevo = {
            sockPub: any,
            sockSub: sub,
            ip: brokerReply.ip,
            puerto: brokerReply.puerto,
            topicos: [brokerReply.topico]
        }
    }
}

function publicarMensaje(topico, mensaje) {
    idPeticion++;
    let broker = getBrokerByTopico(topico, "P");
    if (broker != null) {
        broker.sock.send([topico, JSON.stringify(mensaje)])
    } else {
        guardaMensajeReqBroker(topico, mensaje);
    }
}

function publicarMensajeReply(brokersReply, idPeticion) {
    brokersReply.forEach(brokerReply => {
        let sock;
        let mensaje = mensajes.find(mensaje => mensaje.idPeticion == idPeticion);
        if (brokers.some(broker => broker.ip == brokerReply.ip && broker.puerto == brokerReply.puerto)) {
            let broker = brokers.find(broker => broker => broker.ip == brokerReply.ip && broker.puerto == brokerReply.puerto);
            broker.topicos.push(brokerReply.topico);
            sock = broker.sock;
        } else {
            sock = zmq.socket('pub');
            sock.connect('tcp://' + brokerReply.ip + ':' + brokerReply.puerto)
            let brokerNuevo = {
                sock: sock,
                tipo: "P",
                ip: brokerReply.ip,
                puerto: brokerReply.puerto,
                topicos: [brokerReply.topico]
            }
            brokers.push(brokerNuevo);
        }
        setTimeout(() => {
            sock.send([mensaje.topico, JSON.stringify(mensaje.mensaje)]);
        }, 500);
        mensajes.splice(mensaje, 1);
    });
}

function peticionGrupo(grupo) {
    idPeticion++;
    let request = {
        idPeticion: idPeticion,
        accion: 2,
        topico: grupo
    }
    requester.send(JSON.stringify(request));
}

function guardaMensajeReqBroker(topico, mensaje) {
    let request = {
        idPeticion: idPeticion,
        accion: 1,
        topico: topico
    }
    message = {
        idPeticion: idPeticion,
        topico: topico,
        mensaje: mensaje
    }
    mensajes.push(message);
    requester.send(JSON.stringify(request));
}

function a() {
    socket.on('connect', function (fd, ep) {
        socket.send([topico, JSON.stringify(mensaje)]);
        socket.unmonitor();
        socket.close();
    });
    socket.monitor(100, 0);
}

function getBrokerByTopico(topico, tipo) {
    let i = 0;
    let broker = null;
    while (i < brokers.length && broker == null) {
        if (brokers[i].tipo == tipo && brokers[i].topicos.some(topicoBroker => { return topicoBroker.toLowerCase() == topico.toLowerCase(); })) {
            broker = brokers[i];
        }
        i++;
    }
    return broker;
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
                        topico = 'message/All';   // no se cual deberia llevar este nombre, si topico o obj.emisor
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
                    publicarMensaje(topico, obj);
                    break;
                case '/group':
                    let grupo = separado[1];
                    grupo = 'g_' + grupo;
                    peticionGrupo(grupo);
                    break;
                default:
                    console.log('Comando inexistente');
            }
        }
    });
}