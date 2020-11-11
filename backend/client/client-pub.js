var zmq = require('zeromq')
  , sock = zmq.socket('pub');
  const IP= '127.0.0.1';
  const PORT=  '3000';

const zmq = require('zeromq'),
			sock = zmq.socket('pub')

sock.connect('tcp://'+IP+':'+PORT+'')

let counter = 0

setInterval(function() {
	console.log('Envia mensaje nº', counter)
  sock.send(['miTopico2', 'Este es el mensaje ' + counter++])
}, 500)