const net = require('net');

const port = 1337; 

const server = net.createServer(function (socket) {
    socket.on('data', function (data) {
        const request = JSON.parse(data);
        const reply = {
            t1: request.t1,
            t2: new Date().toISOString(),
            t3: new Date().toISOString()
        }
        socket.write(JSON.stringify(reply));
    });
});

server.listen(port);