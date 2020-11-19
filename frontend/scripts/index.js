
/* Lista de chats */
$(function() {
    var botones = $("#listaChats .contacto");
    botones.click(function() {
      botones.removeClass('active');
      $(this).addClass('active');
    });
  });


/* Hover del Logo */  
var sourceSwap = function () {
    var $this = $(this);
    var newSource = $this.data('alt-src');
    $this.data('alt-src', $this.attr('src'));
    $this.attr('src', newSource);
}
$(function () {
    $('#logo img').hover(sourceSwap, sourceSwap);
});

