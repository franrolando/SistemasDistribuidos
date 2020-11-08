var zmq = require('zeromq')
  , sock = zmq.socket('sub');
const IP= '127.0.0.1';
const PORT=  '3001';

sock.connect('tcp://'+IP+':'+PORT+'');
sock.subscribe('topic1');

sock.on('message', function(topic, message) {
  console.log('Recibio topico:', topic.toString(), 'con mensaje:', message.toString())
})