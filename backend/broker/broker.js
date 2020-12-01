const { setInterval } = require('timers');
const zmq = require('zeromq')

const subSocket = zmq.socket('xsub'),
	pubSocket = zmq.socket('xpub')

const init = require('./init.js');

let IP_RECIBE;
let PUERTO_RECIBE;
let IP_ENVIA;
let PUERTO_ENVIA;
let ID_BROKER;
let tiempoVidaMensajes;
let maxMensajes;
setTimeout(() => {
	ID_BROKER = init.getProp('ID_BROKER');
	COORDINADOR_IP = init.getProp('COORDINADOR_IP');
	COORDINADOR_PUERTO = init.getProp('COORDINADOR_PUERTO');
	IP_RECIBE = init.getProp('IP_RECIBE');
	PUERTO_RECIBE = init.getProp('PUERTO_RECIBE');
	IP_ENVIA = init.getProp('IP_ENVIA');
	PUERTO_ENVIA = init.getProp('PUERTO_ENVIA');
	tiempoVidaMensajes = init.getProp('TIEMPOVIDAMENSAJES');
	maxMensajes = init.getProp('CANTIDADMENSAJES');
	setInterval(() => {
		limpiarMensajes();
	}, tiempoVidaMensajes);
	subSocket.bindSync('tcp://' + IP_ENVIA + ':' + PUERTO_ENVIA + '')
	pubSocket.bindSync('tcp://' + IP_RECIBE + ':' + PUERTO_RECIBE + '')
}, 1000);

let topics = [];
let colaMensajes = [];

let topico = {
	nombre: 'nombreTopico',
	colaMensajes: [

	]
}

let mensaje = {
	emisor: 'Juan pedro',
	mensaje: 'Mensaje de prueba',
	fecha: 'hoy xdxd'
}

topico.colaMensajes.push(mensaje)
topics.push(topico)

subSocket.on('message', function (topic, message) {
	let topico = colaMensajes.find(topico => topico.nombre == topic);
	if (topico.colaMensajes.length == maxMensajes) {
		let mensajeViejo = topico.colaMensajes[0];
		topico.colaMensajes.forEach(mensaje => {
			if (mensaje.fecha < mensajeViejo.fecha){
				mensajeViejo = mensaje;
			}
		});
		let indiceViejo = topico.colaMensajes.indexOf(mensajeViejo);
		topico.colaMensajes.splice(indiceViejo,1);
	}
	topico.colaMensajes.push(message);
	pubSocket.send([topic, message])
})

pubSocket.on('message', function (topic) {
	subSocket.send(topic)
})

function limpiarMensajes(){
	colaMensajes.forEach(topico => {
		let newCola = [];
		topico.colaMensajes.forEach(mensaje => {
			if (mensaje.fecha.getTime() > new Date().getTime() - tiempoVidaMensajes) {
				newCola.push(mensaje);
			}
		});
		topico.colaMensajes = newCola;
	});
}
/***************************************************************************************************************************************/

var responder = zmq.socket('rep');
responder.bind('tcp://127.0.0.1:5556');
responder.on('message', function (request) {
	request = JSON.parse(request);
	console.log("Received request: [", request, "]");
	let response;
	switch (request.accion) {
		case (1):

		case (2):
			break;
		case (3):
			topics.push(request.topico)
			response = {
				resultados: {}
			};
			break;
		case (4):
			response = {
				exito: true,
				accion: request.accion,
				accion: request.idPeticion,
				resultados: {
					listaTopicos: getTopicos()
				},
				error: {
					codigo: '',
					mensaje: ''
				}
			}
			break;
		case (5):
			response = {
				exito: true,
				accion: request.accion,
				accion: request.idPeticion,
				resultados: {
					mensajes: getMensajes(request.topico)
				},
				error: {
					codigo: '',
					mensaje: ''
				}
			}
			break;
		case (6):
			deleteMensajes(request.topico)
			response = {
				exito: true,
				accion: request.accion,
				accion: request.idPeticion,
				resultados: {},
				error: {
					codigo: '',
					mensaje: ''
				}
			}
			break;
		default:
	}
	responder.send(JSON.stringify(response));
});

function getTopicos() {
	let topicos = []
	topics.forEach(topico => {
		topicos.push(topico.topico)
	})
	return topicos;
}

function getMensajes(nombreTopico) {
	let i = 0;
	let topico = null;
	while (i < topics.length && topico == null) {
		if (topics[i].topico == nombreTopico) {
			topico = topics[i];
		}
		i++;
	}
	return topico.colaMensajes;
}

function deleteMensajes(nombreTopico) {
	let i = 0;
	let topico = null;
	while (i < topics.length && topico == null) {
		if (topics[i].topico == nombreTopico) {
			topico = topics[i];
		}
		i++;
	}
	topico.colaMensajes = [];
}

/***************************************************************************************************************************************/