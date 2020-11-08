const net = require('net');

var server = net.createServer(function (socket) {
    var T2 = new Date().getTime();
    socket.on('data', function (data) {
        var T3 = new Date().getTime();
        socket.write(data.toString() + ',' + T2.toString() + ',' + T3.toString());
    })

});

server.listen(1337, '127.0.0.1');