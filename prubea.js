const { sep } = require('path');
var readline = require('readline');

var r = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let aux = '';
let obj = {
    emisor: '',
    mensaje: '',
    fecha: '',
}

r.on('line', function(linea){
    aux = linea.toString();
    let separado = aux.split(" ");
    separado[0] = separado[0].toLowerCase();
    if (separado[0] == 'salir') {
        r.close();
    } else {
        switch (separado[0]){
            case 'enviar':
                let aux2 = [];
                if (separado[1] != '-g' && separado[1] != '-u') { // mensaje/all
                    for (let i = 1; i < separado.length; i++) {
                        aux2.push(separado[i]);
                    }
                    topico = 'message/all';   // no se cual deberia llevar este nombre, si topico o obj.emisor
                } else {
                    for (let i = 3; i < separado.length; i++) {
                        aux2.push(separado[i]);
                    }
                    if (separado[1] == '-g') { // grupo
                        topico = 'message/g_' + separado[2];
                    } else {
                        if (separado[1] == '-u') { // un X cliente
                            topico = 'message/' + separado[2];
                        }
                    }
                }
                let mensaje = aux2.join();
                mensaje = mensaje.replace(/,/g, ' ');
                let mensajeCompleto  = [];
                if (separado[1] != '-g' && separado[1] != '-u') {
                    for (let i = 0; i < 1; i++) {
                        mensajeCompleto.push(separado[i]);
                    }
                } else {
                    for (let i = 0; i < 3; i++) {
                        mensajeCompleto.push(separado[i]);
                    }
                }
                mensajeCompleto.push(mensaje);
                console.log(mensajeCompleto);
                // obj.emisor = ID.CLIENTE;  esto lo sacamos del Id en client.js
                obj.mensaje = mensaje;
                // obj.fecha = date; esto lo sacamos del Id en client.js
                console.log('Topico: '+topico);
                console.log('Mensaje: '+obj.mensaje);
                break;
            case 'subscribirse':
                //
                break;
            case 'creargrupo':
                //
                break;
            default:
                console.log('Comando inexistente');
                
        }
    }
    
});

