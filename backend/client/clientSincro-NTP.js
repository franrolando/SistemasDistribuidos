const net = require('net');
let offset;
let delay;
var client = new net.Socket();
client.connect(1337, '127.0.0.1', function() {
    console.log('Connected')
});

setInterval(() => {
    client.write(new Date().getTime().toString());
}, 120000);

client.on('data', function(data) {
    var times = data.toString().split(",");
    var T1 = parseInt(times[0]);
    var T2 = parseInt(times[1]);
    var T3 = parseInt(times[2]);
    var T4 = (new Date()).getTime();
    offset = ((T2 - T1) + (T3 - T4)) / 2;
    delay = ((T2 - T1) + (T4 - T3)) / 2;
});

client.on('close', function() {
    console.log('Connection closed');
});

client.on('error',function(error){0
    console.log(error);
})