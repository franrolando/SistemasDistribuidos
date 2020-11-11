const net = require('net');

var client = new net.Socket();
client.connect(1337, '127.0.0.1', function() {
    var T1 = new Date().getTime();
    client.write(T1.toString());
});

client.on('data', function(data) {
    var times = data.toString().split(",");
    var T1 = parseInt(times[0]);
    var T2 = parseInt(times[1]);
    var T3 = parseInt(times[2]);
    var T4 = (new Date()).getTime();
    var offset = ((T2 - T1) + (T3 - T4)) / 2;
    var delay = ((T2 - T1) + (T4 - T3)) / 2;
    client.destroy();
});

client.on('close', function() {
    console.log('Connection closed');
});

client.on('error',function(error){
    console.log(error);
})