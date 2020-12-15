const { setInterval } = require('timers');
const zmq = require('zeromq')

const subSocket = zmq.socket('xsub'),
	pubSocket = zmq.socket('xpub')

const init = require('./init.js');
const net = require('net');

let COORDINADOR_IP;
let COORDINADOR_PUERTO;
let IP_RECIBE;
let PUERTO_RECIBE;
let IP_ENVIA;
let PUERTO_ENVIA;
let ID_BROKER;
let tiempoVidaMensajes;
let maxMensajes;
let ipRest;
let puertoResp;
let puertoNTP;

setTimeout(() => {
	// levanta las propiedades
	ID_BROKER = init.getProp('ID_BROKER');
	COORDINADOR_IP = init.getProp('COORDINADOR_IP');
	COORDINADOR_PUERTO = init.getProp('COORDINADOR_PUERTO');
	IP_RECIBE = init.getProp('IP_RECIBE');
	PUERTO_RECIBE = init.getProp('PUERTO_RECIBE');
	IP_ENVIA = init.getProp('IP_ENVIA');
	PUERTO_ENVIA = init.getProp('PUERTO_ENVIA');
	tiempoVidaMensajes = init.getProp('TIEMPOVIDAMENSAJES');
	maxMensajes = init.getProp('CANTIDADMENSAJES');
	ipRest = init.getProp('IPRESP');
	puertoResp = init.getProp('PUERTORESP');

	puertoNTP = init.getProp('PUERTONTP');
	
	/*var server = net.createServer(function (socket) {
		socket.on('data', function (data) {
			socket.write('Connected');
		})

	});
	server.listen(puertoNTP, '127.0.0.1');*/

	listenReply();
	setInterval(() => {
		limpiarMensajes();
	}, tiempoVidaMensajes);
	subSocket.bindSync('tcp://' + IP_ENVIA + ':' + PUERTO_ENVIA + '')
	pubSocket.bindSync('tcp://' + IP_RECIBE + ':' + PUERTO_RECIBE + '')

}, 1000);

let topics = [];
let colaMensajes = [];

subSocket.on('message', function (topic, message) {
	message = JSON.parse(message)
	console.log('LLego un mensaje')
	console.log(topic.toString())
	console.log(message)
	if (!topic.toString().startsWith('message/g_')) {
		let topico = topics.find(topico => topico.nombre == topic);
		if (topico.colaMensajes.length == maxMensajes) {
			let mensajeViejo = topico.colaMensajes[0];
			topico.colaMensajes.forEach(mensaje => {
				if (mensaje.fecha < mensajeViejo.fecha) {
					mensajeViejo = mensaje;
				}
			});
			let indiceViejo = topico.colaMensajes.indexOf(mensajeViejo);
			topico.colaMensajes.splice(indiceViejo, 1);
		}
		topico.colaMensajes.push(message);
	}
	pubSocket.send([topic, JSON.stringify(message)])
})

pubSocket.on('message', function (topic) {
	subSocket.send(topic)
	topic = topic.slice(1);
	console.log('Se subscribieron a ' + topic);
	let topico = topics.find(topico => topico.nombre == topic);
	console.log(topico.colaMensajes);

	topico.colaMensajes.forEach(mensaje => {
		console.log('Enviando ' + mensaje);
		pubSocket.send([topic, JSON.stringify(mensaje)]);
	})
})

function limpiarMensajes() {
	console.log('limpiando mensajes')
	topics.forEach(topico => {
		let newCola = [];
		topico.colaMensajes.forEach(mensaje => {
			if (new Date(mensaje.fecha).getTime() > new Date().getTime() - tiempoVidaMensajes) {
				newCola.push(mensaje);
			}
		});
		topico.colaMensajes = newCola;
	});
}
/***************************************************************************************************************************************/

function listenReply() {
	var responder = zmq.socket('rep');
	responder.bind('tcp://' + ipRest + ':' + puertoResp);
	responder.on('message', function (request) {
		request = JSON.parse(request);
		console.log("Received request: [", request, "]");
		let response;
		switch (request.accion) {
			// Solicitud Publicacion
			case (1):
				response = {
					resultados: {}
				};
				break;
			// Solicitud susc alta
			case (2):
			// Asignar topico
			case (3):
				if (!topics.some(topico => topico.nombre == request.topico)) {
					let topico = {
						nombre: request.topico,
						colaMensajes: [

						]
					}
					topics.push(topico)
				}
				response = {
					resultados: {}
				};
				console.log(topics);
				break;
			// Solicitud Publicacion
			case (4):
				response = {
					exito: true,
					accion: request.accion,
					idPeticion: request.idPeticion,
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
					idPeticion: request.idPeticion,
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
					idPeticion: request.idPeticion,
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
}

function getTopicos() {
	let topicos = []
	topics.forEach(topico => {
		if (!topico.nombre.startsWith('message/g_')) {
			topicos.push(topico.nombre)
		}
	})
	return topicos;
}

function getMensajes(nombreTopico) {
	let i = 0;
	let topico = null;
	while (i < topics.length && topico == null) {
		if (topics[i].nombre == nombreTopico) {
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
		if (topics[i].nombre == nombreTopico) {
			topico = topics[i];
		}
		i++;
	}
	topico.colaMensajes = [];
}

/***************************************************************************************************************************************/
