let fs = require('fs')
const readline = require('readline');
let config = []

var file = 'backend/coordinador/configCoord.txt';
var rl = readline.createInterface({
    input: fs.createReadStream(file),
    output: process.stdout,
    terminal: false
});

rl.on('line', function (line) {
    let parse = line.split(' ')
    if (!parse[0].startsWith('//')) {
        config.push({
            prop: parse[0],
            value: parse[2]
        });
    }
});

function getProp(prop) {
    return config.find(param => param.prop == prop).value;
}

module.exports = {
    getProp
}