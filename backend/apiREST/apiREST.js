const express = require('express')
const cors = require('cors')
const app = express()
const port = 4500

app.use(cors())
let idPeticion = 0;
let brokers = []
let broker = {
    idBroker: 1,
    ip: 'localhost',
    puerto: '5556'
}
brokers.push(broker);
var zmq = require('zeromq');
var requester = zmq.socket('req');
var idCliente = 1;
let topicos = ['heartbeat', 'messageAll', 'message/' + idCliente];

idPeticion = 1;
let request = {
    idPeticion: idPeticion++,
    accion: 2,
    topico: 'prueba'
}

app.get('/broker/*/topics', (req, res) => {
    let broker = brokers.find(broker => broker.idBroker == req.params[0]);
    let request = {
        idPeticion: idPeticion++,
        accion: 4,
        topico: 'nombreTopico'
    }
    requester.connect('tcp://' + broker.ip + ':' + broker.puerto);
    requester.send(JSON.stringify(request));
    requester.on('message', function (reply) {
        res.send(reply);
    })
})

app.get('/broker/*/topics/*', (req, res) => {
    let broker = brokers.find(broker => broker.idBroker == req.params[0]);
    let request = {
        idPeticion: idPeticion++,
        accion: 5,
        topico: req.params[1]
    }
    requester.connect('tcp://' + broker.ip + ':' + broker.puerto);
    requester.send(JSON.stringify(request));
    requester.on('message', function (reply) {
        res.send(reply);
    })
})

app.delete('/broker/*/topics/*', (req, res) => {
    let broker = brokers.find(broker => broker.idBroker == req.params[0]);
    let request = {
        idPeticion: idPeticion++,
        accion: 6,
        topico: req.params[1]
    }
    requester.connect('tcp://' + broker.ip + ':' + broker.puerto);
    requester.send(JSON.stringify(request));
    requester.on('message', function (reply) {
        res.send(reply);
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})