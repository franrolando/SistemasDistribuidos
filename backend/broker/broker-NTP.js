const net = require('net');

var server = net.createServer(function (socket) {
    socket.on('data', function (data) {
        socket.write('Connected');
    })

});

server.listen(1338, '127.0.0.1');