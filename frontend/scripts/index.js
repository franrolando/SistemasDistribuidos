/************ LOGO ************/

var sourceSwap = function () {
  var $this = $(this);
  var newSource = $this.data('alt-src');
  $this.data('alt-src', $this.attr('src'));
  $this.attr('src', newSource);
}
$(function () {
  $('#logo img').hover(sourceSwap, sourceSwap);
});


$("#desplegar").on("click", function () {
  $('.sidebar').toggleClass("show");
  $('.navbar').toggleClass("show");
  $('#colTopics').toggleClass("show");
});


// id: identificador del html
function insertarHTML(id, html) {
  $(id).after(html);
}


/////////////////////// BROKERS ///////////////////////////

const IP = 'localhost';
const PORT = 4500;



// lista de brokers
let brokers = ['broker1', 'broker2', 'broker3'];

conexionApi('GET','/brokers',(data) => {
  let cantBrokers = JSON.parse(data);
  for (let i=1; i<= cantBrokers; i++){
    addBroker(i);
  }
})


function addBroker(id) {
  // broker
  let codBroker = ` 
  <a class="nav-link boton" data-toggle="list" onclick="getTopicos('${id}')" href="#topic-${id}" role="tab"> 
    <div class="media">
      <div class="avatar rounded-circle text-light align-middle">${id}</div>
      <div class="media-body">
          <div class="mt-0 idBroker">BROKER ${id}</div>
      </div>
    </div>
  </a>
  `;
  let listaBrokers = document.getElementById('listaBroker');
  listaBrokers.innerHTML += codBroker;

  // lista topicos
  let codTopics = `
  <div class="tab-pane fade show"  id="topic-${id}" role="tabpanel">
    <div class="noTopico font-weight-light text-muted text-center">no hay topicos</div>
    <div class="nav flex-column list-group topico" role="tablist" aria-orientation="vertical"></div>
  </div>
  `;
  insertarHTML(".lista-topicos", codTopics);
}





/////////////////////// GET TOPICOS HTTP ///////////////////////////
function getTopicos(idBroker) {
  // GET let url = 'http://' + IP + ':' + PORT + '/broker/'+1+'/topics';
  let url = 'http://' + IP + ':' + PORT + '/broker/' + idBroker + '/topics';
  // respuesta
  let callback = (data) => {
    let respuesta = JSON.parse(data);
    console.log(respuesta);
    if (respuesta.exito) {
      insertarTopicos(idBroker, respuesta.resultados.listaTopicos);
    }
    else {
      console.log(respuesta.error.codigo + " " + respuesta.error.mensaje)
    }
  };
  httpAsync("GET", url, callback);
}


function insertarTopicos(idBroker, listaTopicos) {
  let brokerBuscado = document.getElementById('topic-' + idBroker);

  brokerBuscado.getElementsByClassName("noTopico")[0].style.display = "none";

  let topico = brokerBuscado.getElementsByClassName("topico")[0];
  topico.innerHTML = '';

  listaTopicos.forEach(t => {
    addTopic(idBroker, t);
  });
}


// Agregar topico en un broker
function addTopic(idBroker, idTopic) {
  // botón del topico
  let codTopic = ` 
  <a class="nav-link boton" data-toggle="list" onclick="getMensajes('${idBroker}','${idTopic}')" href="#msg-${idTopic}-${idBroker}" role="tab"> 
    <div class="media">
        <div class="mt-0 idTopico">${idTopic}</div>
    </div>
  </a>
  `;
  let brokerBuscado = document.getElementById('topic-' + idBroker).getElementsByClassName("topico")[0];
  brokerBuscado.innerHTML += codTopic;

  // pestaña de mensajes para idBroker,idTopic
  let codMensajes = `
  <div class="tab-pane fade show"  id="msg-${idTopic}-${idBroker}" role="tabpanel">
      <div style="text-align: left;text-transform: capitalize;" class="h6">${idBroker} > ${idTopic}</div>
      <hr>
      <div class="chat-content  demoScroll sc2">
        <div class="chatMensajes"></div>
      </div>
  </div>
  `;
  let listaChats = document.getElementById('chat').getElementsByClassName('tab-content')[0];
  listaChats.innerHTML += codMensajes;
}






/////////////////////// GET MENSAJES topico HTTP ///////////////////////////
function getMensajes(idBroker, idTopic) {
  let url = 'http://' + IP + ':' + PORT + '/broker/' + idBroker + '/topics/' + idTopic;
  // respuesta
  let callback = (data) => {
    let respuesta = JSON.parse(data, (k,v) => {
      console.log('Clave :'+k)
      console.log('Valor :'+v)
    });
    console.log(respuesta)
    if (respuesta.exito) {
      insertarMensajes(idBroker, idTopic, respuesta.resultados.mensajes);
    }
    else {
      console.log(respuesta.error.codigo + " " + respuesta.error.mensaje)
    }
  };
  $("#borrarMensajes button").hide();
  httpAsync("GET", url, callback);
}

function conexionApi(tipo, url, callback) {
  httpAsync(tipo, 'http://' + IP + ':' + PORT +url, callback);
}



function insertarMensajes(idBroker, idTopic, listaMensajes) {
  let chat = document.getElementById('msg-' + idTopic + '-' + idBroker).getElementsByClassName('chat-content')[0];
  chat.innerHTML = '';
  $("#borrarMensajes button").hide();


  listaMensajes.forEach(m => {
    addMensaje(idBroker, idTopic, m);
  });
}


function addMensaje(idBroker, idTopic, msg) {
  let codMensaje = `
  <div class="rec">
    <div class="emisor h6">${msg.emisor} <span class="fecha">${msg.fecha}</span></div>
    <div class="cuerpoMensaje">${msg.mensaje}</div>
  </div>
  <hr>
  `;
  let chat = document.getElementById('msg-' + idTopic + '-' + idBroker).getElementsByClassName('chat-content')[0];
  if (chat != null) {
    chat.innerHTML += codMensaje;
    $("#borrarMensajes button").show();
  }
}







/////////////////////// ELIMINAR MENSAJES TOPICO - HTTP ///////////////////////////
$("#borrarMensajes .send button").click(function () {
  let activediv = $('#chat .tab-pane').filter('.active').attr('id');
  let res = activediv.split("-");

  let idBroker = res[2];
  let idTopic = res[1];

  // DELETE   /broker/123/topics/miTopico1, donde 123 es el id del broker y miTopico1 es el tópico.
  let url = 'http://' + IP + ':' + PORT + '/broker/' + idBroker + '/topics/' + idTopic;

  // respuesta
  let callback = (data) => {
    let respuesta = JSON.parse(data);
    if (respuesta.exito) {
      eliminarMensajes(idBroker, idTopic);
    }
    else {
      console.log(respuesta.error.codigo + " " + respuesta.error.mensaje)
    }
  };
  httpAsync("DELETE", url, callback);
});


function eliminarMensajes(idBroker, idTopic) {
  let chat = document.getElementById('msg-' + idTopic + '-' + idBroker).getElementsByClassName('chat-content')[0];
  chat.innerHTML = '<div class="font-weight-light text-muted text-center">no hay mensajes</div>';
}


function httpAsync(method, theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();

  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      var data = xmlHttp.responseText;
      callback(data);
    }
  }
  xmlHttp.open(method, theUrl, true);
  xmlHttp.send(null);
}