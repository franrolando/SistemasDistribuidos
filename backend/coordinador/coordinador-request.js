var zmq = require('zeromq');
let brokers = [

]

let broker = {
  idBroker: 0,
  ip: '127.0.0.1',
  puerto: '5556',
  topicos: []
}
brokers.push(broker);

cargarBrokers(brokers);

// Responde al cliente
let reply = zmq.socket('rep');
reply.bind('tcp://127.0.0.1:5555');


reply.on('message', function (request) {
  request = JSON.parse(request)
  console.log(request);
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
  switch (request.accion) {
    case 1:
      peticionPublicacion(request)
      break;
    case 2:
      suscripcionTopico(request)
      break;
    case 3:
      asignarTopico(request)
      break;
    case 7:
      peticionGrupo(request)
      break;
    default: {
      response.exito = false;
      response.error = {
        codigo: 2,
        mensaje: 'Operacion inexistente'
      };
      console.log('Error')
      reply.send(JSON.stringify(response));
    }
    console.log('Response al cliente:');
    console.log(response);
  }
})

function asignarTopico(request) {
  let existeTopico = false;
  brokers.forEach(broker => {
    if (broker.topicos.find(topico => topico == request.topico)) {
      existeTopico = true;
    }
  })
  if (!existeTopico) {
    let minCantTopicos = 999;
    let idBrokerMin = 0;
    brokers.forEach(broker => {
      if (broker.topicos.length < minCantTopicos) {
        minCantTopicos = broker.topicos.length
        idBrokerMin = broker.idBroker
      }
    });
    brokerMin = brokers.find(broker => broker.idBroker == idBrokerMin)
    brokerMin.topicos.push(request.topico);
    // Request al broker
    let requester = zmq.socket('req');
    requester.connect("tcp://" + brokerMin.ip + ":" + brokerMin.puerto);
    requester.send(JSON.stringify(request));
    requester.on("message", function (replyBroker) {
      reply.send(JSON.stringify(replyBroker));
    });
  } else {
    reply.send(JSON.stringify('Ya existe topico'));
  }
}

function peticionPublicacion(request) {

}

function suscripcionTopico(request) {
  let i = 0;
  let brokerTopico = null;
  while (i < brokers.length && brokerTopico == null) {
    if (brokers[i].topicos.some(topico => topico == request.topico)) {
      brokerTopico = brokers[i];
    } else {
      i++
    }
  }
  if (brokerTopico == null) {
    response.exito = false;
    response.error = {
      codigo: 1,
      mensaje: 'Topico inexistente'
    };
  } else {
    response.resultados = {
      datosBroker : {
        topico: request.topico,
        ip: brokerTopico.ip,
        puerto: brokerTopico.puerto,
      }
    }
  }
  reply.send(JSON.stringify(response));
}
 

  function peticionGrupo(request) {

  }

  function cargarBrokers(request) {

  }
