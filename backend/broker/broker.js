const zmq = require('zeromq')


const subSocket = zmq.socket('xsub'),
	pubSocket = zmq.socket('xpub')

const IP_RECIBE = '127.0.0.1';
const PORT_RECIBE = '3000';
const IP_ENVIA = '127.0.0.1';
const PORT_ENVIA = '3001';
const ID_BROKER = process.argv[2];
let topics = [];

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

responder.on('message', function (request) {
	request = JSON.parse(request);
	console.log("Received request: [", request.toString(), "]");
	let response;
	switch (request.accion) {
		case (1):
			topics.push(request.topico)
		case (2):
			response = {
				topico = request.topico,
				ip = IP_ENVIA,
				puerto = PORT_ENVIA,
				accion = request.accion
			};
			break;
		case (3):
			response = {
				code = '',
			};
			break;
		case (4):
			response = {
				listaTopicos = topics,
			};
			break;
		case (5):
			response = {
				mensajes = '',
			};
			break;
		case (6):
			response = {
				code = '',
			};
			break;
		default:
	}
	
	responder.send(response);
});

responder.bind('tcp://*:5555');

/***************************************************************************************************************************************/
