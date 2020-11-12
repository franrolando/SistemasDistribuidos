var zmq = require('zeromq');
const COORDINADOR_IP = '127.0.0.1';
const COORDINADOR_PUERTO = 5555;
var requester = zmq.socket('req');

requester.on("message", function(reply) {
  console.log("Received reply : [", reply.toString(), ']');
});
var idCliente = 1
let topicos = ['heartbeat', 'messageAll', 'message/'+idCliente]

idPeticion = 1;
let request = {
  idPeticion = idPeticion++,
  accion = 2,
  topico = 'prueba'
}

requester.connect('tcp://'+COORDINADOR_IP+':'+COORDINADOR_PUERTO);
requester.send(request);