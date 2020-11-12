var zmq = require('zeromq');
let brokers = [
]

broker = {
  idBroker = 0,
  ip = '',
  puerto = '',
  topicos =[]
}

// Responde al cliente
let reply = zmq.socket('rep');
reply.bind('tcp://127.0.0.1:5555');
// Request al broker
var requester = zmq.socket('req');
requester.connect("tcp://localhost:5556");

reply.on('message', function (request) {
  response = {
    exito = true,
    accion = request.accion,
    idPeticion = request.idPeticion,
    resultados = {},
    error = {
      codigo = '',
      mensaje = ''
    }
  }
  switch (request.accion) {
    case 1:
      peticionPublicacion(request.nombreTopico)
      break;
    case 2:
      suscripcionTopico(request.nombreTopico)
      break;
    case 3:
      asignarTopico(request.nombreTopico)
      break;
    case 4:
      mostrarTopicos()
      break;
    case 5:
      mostrarMensajes(request.nombreTopico)
      break;
    case 6:
      borrarMensajes(request.nombreTopico)
      break;
    case 7:
      peticionGrupo(request.nombreTopico)
      break;
    default: {
      response.exito = false;
      response.error = {
        codigo = 2,
        mensaje = 'Operacion inexistente'
      };
      reply.send(response);
    }
  }
})

responder.on('message', function (request) {
  request = JSON.parse(request);
  console.log("Received request: [", request.toString(), "]");
  responder.send(response);
});

responder.bind('tcp://*:5555');

console.log("Connecting to hello world server...");
var requester = zmq.socket('req');
requester.connect("tcp://localhost:5556");

requester.on("message", function (reply) {
  console.log("Received reply : [", reply.toString(), ']');
});


function addTopico(nombreTopico) {
  let minCantTopicos = 999;
  let idBrokerMin = 0;
  brokers.array.forEach(broker => {
    if (broker.topicos.length < minCantTopicos) {
      minCantTopicos = broker.topicos.length
      idBrokerMin = broker.idBroker
    }
  });
  brokerMin = brokers.find(broker => broker.idBroker = idBrokerMin)
  brokerMin.brokers.push(nombreTopico);
  requester.send("Hello");
  responder.on('message', function (request) {
    request = JSON.parse(request);
    console.log("Received request: [", request.toString(), "]");
    responder.send(response);
  });
}

function peticionPublicacion(nombreTopico) {

}

function suscripcionTopico(nombreTopico) {

}

function asignarTopico(nombreTopico) {

}

function mostrarTopicos(idBroker) {

}

function mostrarMensajes(nombreTopico) {

}

function borrarMensajes(nombreTopico) {

}

function peticionGrupo(idGrupo) {

}

