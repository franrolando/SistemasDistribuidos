var zmq = require('zeromq');

console.log("Connecting to hello world server...");
var requester = zmq.socket('req');

requester.on("message", function(reply) {
  console.log("Received reply : [", reply.toString(), ']');
});

requester.connect("tcp://localhost:5555");
requester.send("Hello");