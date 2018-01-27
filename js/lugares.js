lugaresModulo = (function () {
  var servicioLugares // Servicio para obtener lugares cercanos e información de lugares(como fotos, puntuación del lugar,etc).

    // Completa las direcciones ingresadas por el usuario a y establece los límites
    // con un círculo cuyo radio es de 20000 metros.
  function autocompletar () {
        /* Completar la función autocompletar(): autocompleta los 4 campos de texto de la
        página (las direcciones ingresables por el usuario).
        Para esto creá un círculo con radio de 20000 metros y usalo para fijar
        los límites de la búsqueda de dirección. El círculo no se debe ver en el mapa. */
        var inputDi = document.getElementById('direccion');
        var inputDesde = document.getElementById('desde');
        var inputHasta = document.getElementById('hasta');
        var inputAgregar = document.getElementById('agregar');
         
        var options = {
          strictBounds: true
        };
        // https://developers.google.com/maps/documentation/javascript/reference?hl=es-419#Autocomplete
        autocompleteDi = new google.maps.places.Autocomplete(inputDi, options);
        autocompleteDesde = new google.maps.places.Autocomplete(inputDesde, options);
        autocompleteHasta = new google.maps.places.Autocomplete(inputHasta, options);
        autocompleteAgregar = new google.maps.places.Autocomplete(inputAgregar, options);
 
        //Agrego el Circulo
        var areaDeBusqueda = new google.maps.Circle({
          map: mapa,
          center: posicionCentral,
          radius: 20000
        });
        autocompleteDi.setBounds(areaDeBusqueda.getBounds());
        autocompleteDesde.setBounds(areaDeBusqueda.getBounds());
        autocompleteHasta.setBounds(areaDeBusqueda.getBounds());
        autocompleteAgregar.setBounds(areaDeBusqueda.getBounds());
  }

    // Inicializo la variable servicioLugares y llamo a la función autocompletar
  function inicializar () {
    servicioLugares = new google.maps.places.PlacesService(mapa)
    autocompletar()
  }

    // Busca lugares con el tipo especificado en el campo de TipoDeLugar

  function buscarCerca (posicion) {
        /* Completar la función buscarCerca  que realice la búsqueda de los lugares
    del tipo (tipodeLugar) y con el radio indicados en el HTML cerca del lugar
    pasado como parámetro y llame a la función marcarLugares. */ 
    // Paso tres Guia 2
    var miLugar = document.getElementById('tipoDeLugar').value;
    var miRadio = document.getElementById('radio').value;

    var request = {
      location: posicion,
      radius: miRadio,
      types: [miLugar]

    };
    
    servicioLugares.nearbySearch(request, marcadorModulo.marcarLugares);
  }//Termina BuscarCerca
  return {
    inicializar,
    buscarCerca
  }
})()

