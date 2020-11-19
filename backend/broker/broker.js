const zmq = require('zeromq')


const subSocket = zmq.socket('xsub'),
	pubSocket = zmq.socket('xpub')

const IP_RECIBE = '127.0.0.1';
const PORT_RECIBE = '3000';
const IP_ENVIA = '127.0.0.1';
const PORT_ENVIA = '3001';
const ID_BROKER = process.argv[2];
let topics = [];
let colaMensajes = [];

let topico = {
	topico : 'nombreTopico',
	colaMensajes: [

	]
}

let mensaje = {
	emisor : 'Juan pedro',
	mensaje : 'Mensaje de prueba',
	fecha : 'hoy xdxd'
}

topico.colaMensajes.push(mensaje)
topics.push(topico)

subSocket.bindSync('tcp://' + IP_ENVIA + ':' + PORT_ENVIA + '')
pubSocket.bindSync('tcp://' + IP_RECIBE + ':' + PORT_RECIBE + '')

subSocket.on('message', function (topic, message) {
	pubSocket.send([topic, message])
})

pubSocket.on('message', function (topic) {
	subSocket.send(topic)
})

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
				resultados : {}
			};
			break;
		case (4):
			response = {
				exito : true,
				accion : request.accion,
				accion : request.idPeticion,
				resultados : {
					listaTopicos : getTopicos()
				},
				error : {
					codigo : '',
					mensaje : ''
				}
			}
			break;
		case (5):
			response = {
				exito : true,
				accion : request.accion,
				accion : request.idPeticion,
				resultados : {
					mensajes : getMensajes(request.topico)
				},
				error : {
					codigo : '',
					mensaje : ''
				}
			}
			break;
		case (6):
			deleteMensajes(request.topico)
			response = {
				exito : true,
				accion : request.accion,
				accion : request.idPeticion,
				resultados : {},
				error : {
					codigo : '',
					mensaje : ''
				}
			}
			break;
		default:
	}
	responder.send(JSON.stringify(response));
});

function getTopicos(){
	let topicos = []
	topics.forEach(topico => {
		topicos.push(topico.topico)
	})
	return topicos;
}

function getMensajes(nombreTopico){
	let i = 0;
	let topico = null; 
	while (i < topics.length && topico == null){
		if (topics[i].topico == nombreTopico){
			topico = topics[i];
		}
		i++;
	}
	return topico.colaMensajes;
}

function deleteMensajes(nombreTopico){
	let i = 0;
	let topico = null; 
	while (i < topics.length && topico == null){
		if (topics[i].topico == nombreTopico){
			topico = topics[i];
		}
		i++;
	}
	topico.colaMensajes = [];
}

/***************************************************************************************************************************************/