var zmq = require('zeromq');
const init = require('./init.js');
let reply = zmq.socket('rep');
let brokers = []
// Responde al cliente

setTimeout(() => {
  cargarBrokers();
  reply.bind('tcp://' + init.getProp('RESPCLIENTEIP') + ':' + init.getProp('RESPCLIENTEPUERTO'));
  let newTopico = {
    accion: 3,
    topico: 'heartbeat'
  }
  asignarTopico(newTopico);
  newTopico.topico = 'message/All'
  asignarTopico(newTopico);
}, 2000);



reply.on('message', function (request) {
  request = JSON.parse(request)
  console.log(request);
  let response = {
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
      peticionPublicacion(request,response)
      break;
    case 2:
      suscripcionTopico(request,response)
      break;
    default: {
      response.exito = false;
      response.error = {
        codigo: 2,
        mensaje: 'Operacion inexistente'
      };
      console.log('Error')
    }
  }
  console.log('Response al cliente:');
  console.log(response);
  reply.send(JSON.stringify(response));
})

function asignarTopico(request) {
  let existeTopico = false;
  brokers.forEach(broker => {
    if (broker.topicos.find(topico => topico == request.topico)) {
      existeTopico = true;
    }
  })
  
  if (!existeTopico) {
    let brokerMin = getBrokerMinTopics();
    brokerMin.topicos.push(request.topico);
    // Request al broker
    let requester = brokerMin.sock;
    requester.send(JSON.stringify(request));
  } else {
    reply.send(JSON.stringify('Ya existe topico'));
  }
}

function getBrokerMinTopics() {
  let minCantTopicos = 999;
  let idBrokerMin = 0;
  brokers.forEach(broker => {
    if (broker.topicos.length < minCantTopicos) {
      minCantTopicos = broker.topicos.length
      idBrokerMin = broker.idBroker
    }
  });
  let brokerMin = brokers.find(broker => broker.idBroker == idBrokerMin);
  return brokerMin;
}

function peticionPublicacion(request,response) {
  let brokerTopico = getBrokerByTopico(request.topico);
  
  if(brokerTopico!=null)
  {
    response.resultados = {
      datosBroker: [{
        topico: request.topico,
        ip: brokerTopico.ip,
        puerto: brokerTopico.puertoPub
      }]
    }
  }
  else{
    response.exito = false;
    response.error = {
      codigo: 1,
      mensaje: 'error, topico inexistente'
    };
  }
}

function suscripcionTopico(request,response) {
  
  let brokerAsignado = getBrokerByTopico('message/'+request.topico);
  if(brokerAsignado == null)
  {
    brokerAsignado = getBrokerMinTopics();
  }
  let brokerAll = getBrokerByTopico('message/All');
  let brokerHeart = getBrokerByTopico('heartbeat');
  request.topico = 'message/'+request.topico;
  brokerAsignado.topicos.push(request.topico);
  brokerAsignado.sock.send(JSON.stringify(request));
  response.resultados = {
    datosBroker: [{
      topico: request.topico,
      ip: brokerAsignado.ip,
      puerto: brokerAsignado.puertoSub
    }, {
      topico: 'message/All',
      ip: brokerAll.ip,
      puerto: brokerAll.puertoSub
    },
    {
      topico: 'heartbeat',
      ip: brokerHeart.ip,
      puerto: brokerHeart.puertoSub
    }]
  }
}

function getBrokerByTopico(topico) {
  let i = 0;
  let broker = null;
  while (i < brokers.length && broker == null) {
    if (brokers[i].topicos.some(topicoBroker => {
       return topicoBroker.toLowerCase() === topico.toLowerCase() ;
      })) {
      broker = brokers[i];
    }
    i++;
  }
  return broker;
}

function cargarBrokers() {
  const cantBrokers = init.getProp('CANTBROKERS');
  for (let i = 1; i <= cantBrokers; i++) {
    let ip = init.getProp('IPBROKER' + i);
    let puerto = init.getProp('PUERTOBROK' + i);
    let requester = zmq.socket('req');
    requester.connect("tcp://" + ip + ":" + puerto);
    let broker = {
      idBroker: i,
      sock: requester,
      ip: ip,
      puerto: puerto,
      puertoSub: init.getProp('PUERTOBROK' + i + 'SUB'),
      puertoPub: init.getProp('PUERTOBROK' + i + 'PUB'),
      topicos: []
    }
    brokers.push(broker);
  }
}
