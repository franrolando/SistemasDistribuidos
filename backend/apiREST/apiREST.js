const express = require('express')
const cors = require('cors')
const app = express()
const port = 4500
var zmq = require('zeromq');
const init = require('./init.js');
let cantidadBrokers;
let brokers = [];

app.use(cors())

setTimeout(() => {
    cantidadBrokers = init.getProp('CANTBROKERS');
    cargarBrokers();
}, 1000);


idPeticion = 0;

app.get('/brokers', (req, res) => {
    res.send(JSON.stringify(brokers.length));
})

app.get('/broker/*/topics', (req, res) => {
    let broker = brokers.find(broker => broker.idBroker == req.params[0]);
    let request = {
        idPeticion: idPeticion++,
        accion: 4,
        topico: 'nombreTopico'
    }
    broker.sock.send(JSON.stringify(request));
        broker.sock.on('message', function (reply) {
            reply = JSON.parse(reply)
            if (request.idPeticion == reply.idPeticion){
                res.send(JSON.stringify(reply));
            }
        })
    
})

app.get('/broker/*/topics/*', (req, res) => {
    let broker = brokers.find(broker => broker.idBroker == req.params[0]);
    let request = {
        idPeticion: idPeticion++,
        accion: 5,
        topico: req.params[1]
    }
    broker.sock.send(JSON.stringify(request));
        broker.sock.on('message', function (reply) {
            reply = JSON.parse(reply)
            if (request.idPeticion == reply.idPeticion){
                res.send(JSON.stringify(reply));
            }
        })
    
})

app.delete('/broker/*/topics/*', (req, res) => {
    let broker = brokers.find(broker => broker.idBroker == req.params[0]);
    let request = {
        idPeticion: idPeticion++,
        accion: 6,
        topico: req.params[1]
    }
    broker.sock.send(JSON.stringify(request));

        broker.sock.on('message', function (reply) {
            reply = JSON.parse(reply)
            console.log(reply)
            if (request.idPeticion == reply.idPeticion){
                res.send(JSON.stringify(reply));
            }
        })
    
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

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
        topicos: []
      }
      brokers.push(broker);
    }
  }