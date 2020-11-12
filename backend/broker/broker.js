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
				resultados: {
					datosBroker =[{
						topico = request.topico,
						ip = IP_ENVIA,
						puerto = PORT_ENVIA,
					}]
				},
			};
			break;
		case (3):
			response = {
				resultados = {}
			};
			break;
		case (4):
			response = {
				resultados = {
					listaTopicos = topics
				}
			};
			break;
		case (5):
			response = {
				resultados = {
					mensajes = colaMensajes
				}
			};
			break;
		case (6):
			response = {
				resultados = {}
			};
			break;
		default:
	}

	responder.send(response);
});

responder.bind('tcp://127.0.0.1:5556');

/***************************************************************************************************************************************/
