var zmq = require('zeromq');
const COORDINADOR_IP = '127.0.0.1';
const COORDINADOR_PUERTO = 5555;
var requester = zmq.socket('req');

requester.on("message", function (reply) {
  reply = JSON.parse(reply);
  console.log('Received reply: ');
  console.log(reply)
  switch (reply.accion) {
    case (1):
      break;
    case (2):
      subscribirseTopico(reply)
      break;
    case (3):
      break;
    default:
      console.log('Default case')
  }
});
var idCliente = 1;
let topicos = ['heartbeat', 'messageAll', 'message/' + idCliente];

idPeticion = 1;
let request = {
  idPeticion: idPeticion++,
  accion: 2,
  topico: 'prueba'
}
requester.connect('tcp://' + COORDINADOR_IP + ':' + COORDINADOR_PUERTO);
requester.send(JSON.stringify(request));

function subscribirseTopico(reply) {
    sock = zmq.socket('sub')
  sock.connect('tcp://'+reply.resultados.datosBroker.ip+':'+reply.resultados.datosBroker.puerto);
  sock.subscribe(reply.resultados.datosBroker.topico);
  sock.on('message', function (topic, message) {
    console.log('Recibio topico:', topic.toString(), 'con mensaje:', message.toString())
  })
}