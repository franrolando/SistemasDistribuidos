var zmq = require('zeromq');
var requester = zmq.socket('req');
const COORDINADOR_IP = '127.0.0.1';
const COORDINADOR_PUERTO = 5555;
let brokers = []

let broker = {
  ip: '',
  puerto: '',
  topicos: []
}

requester.on("message", function (reply) {
  reply = JSON.parse(reply);
  console.log('Received reply: ');
  console.log(reply)
  switch (reply.accion) {
    case (1):
      publicarMensaje(reply.resultados.datosBroker)
      break;
    case (2):
    case (3):
      subscribirseTopico(reply.resultados.datosBroker)
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

function subscribirseTopico(brokersReply) {
  sock = zmq.socket('sub')
  brokersReply.forEach(brokerReply => {
    sock.connect('tcp://' + brokerReply.ip + ':' + brokerReply.puerto);
    sock.subscribe(brokerReply.topico);
    sock.on('message', function (topic, message) {
      console.log('Recibio topico:', topic.toString(), 'con mensaje:', message.toString())
    })
  });
}

function publicarMensaje(brokersReply) {
  brokersReply.forEach(brokerReply => {
    let brokerNuevo = {
      ip: brokerReply.ip,
      puerto: brokerReply.puerto,
      topicos: [brokerReply.topico]
    }
    brokers.push(brokerNuevo);
  });
}