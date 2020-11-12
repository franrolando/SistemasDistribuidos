const net = require('net');

var server = net.createServer(function (socket) {
    socket.on('data', function (data) {
        var T2 = new Date().getTime();
        var client = new net.Socket();
        client.connect(1338, '127.0.0.1', function () {
            client.write(new Date().getTime().toString());
            client.on('data', function (dataBroker) {
                var T3 = new Date().getTime();
                socket.write(data.toString() + ',' + T2.toString() + ',' + T3.toString());
            });
        });
    })

});

server.listen(1337, '127.0.0.1');