direccionesModulo = (function () {
  var servicioDirecciones // Servicio que calcula las direcciones
  var mostradorDirecciones // Servicio muestra las direcciones

    // Calcula las rutas cuando se cambian los lugares de desde, hasta o algun punto intermedio
  function calcularRutasConClic () {
    document.getElementById('comoIr').addEventListener('change', function () {
      direccionesModulo.calcularYMostrarRutas()
    })

    document.getElementById('calcularMuchos').addEventListener('click', function () {
      direccionesModulo.calcularYMostrarRutas()
    })

    var listasLugares = document.getElementsByClassName('lugares')
    for (var j = 0; j < listasLugares.length; j++) {
      listasLugares[j].addEventListener('change', function () {
        if (document.getElementById('desde').value != '' && document.getElementById('desde').value != '') {
          direccionesModulo.calcularYMostrarRutas();
        
        }
      })
    }
  }

    // Agrega la dirección en las lista de Lugares Intermedios en caso de que no estén
  function agregarDireccionEnLista (direccion, coord) {
    var lugaresIntermedios = document.getElementById('puntosIntermedios')

    var haceFaltaAgregar = true
    for (i = 0; i < lugaresIntermedios.length; ++i) {
      if (lugaresIntermedios.options[i].text.replace(/\r?\n|\r/g, ' ') === direccion.replace(/\r?\n|\r/g, ' ')) {
        haceFaltaAgregar = false
      }
    }
    if (haceFaltaAgregar) {
      var opt = document.createElement('option')
      opt.value = coord
      opt.innerHTML = direccion
      lugaresIntermedios.appendChild(opt)
    }
  }

    // Agrega la dirección en las listas de puntos intermedios y lo muestra con el street view
  function agregarDireccionYMostrarEnMapa (direccion, ubicacion) {
    that = this
    var ubicacionTexto = ubicacion.lat() + ',' + ubicacion.lng()
    agregarDireccionEnLista(direccion, ubicacionTexto)
    mapa.setCenter(ubicacion)
    streetViewModulo.fijarStreetView(ubicacion)
    marcadorModulo.mostrarMiMarcador(ubicacion)
  }//Termina agregarDireccionYMostrarEnMapa

  function agregarDireccion (direccion, ubicacion) {
    that = this
    var ubicacionTexto = ubicacion.lat() + ',' + ubicacion.lng()
    agregarDireccionEnLista(direccion, ubicacionTexto)
    mapa.setCenter(ubicacion)
  }//Termina agregarDireccion

    // Inicializo las variables que muestra el panel y el que calcula las rutas//
  function inicializar () {
    calcularRutasConClic()
        // Agrega la direccion cuando se presioná enter en el campo agregar
    $('#agregar').keypress(function (e) {
      if (e.keyCode == 13) {
        var direccion = document.getElementById('agregar').value
        geocodificadorModulo.usaDireccion(direccion, direccionesModulo.agregarDireccion)
      }
    })
        // Calcula las rutas cuando se presioná enter en el campo desde y hay un valor distinto a vacío en 'hasta'
    $('#desde').keypress(function (e) {
      if (e.keyCode == 13 && document.getElementById('hasta').value != '') {
        direccionesModulo.calcularYMostrarRutas();
     
      }
    })

    // Calcula las rutas cuando se presioná enter en el campo hasta y hay un valor distinto a vacío en 'desde'
    $('#hasta').keypress(function (e) {
      if (e.keyCode == 13 && document.getElementById('desde').value != '') {
        direccionesModulo.calcularYMostrarRutas();
      
      }
    })
    servicioDirecciones = new google.maps.DirectionsService();
    mostradorDirecciones = new google.maps.DirectionsRenderer({
      draggable: true,
      map: mapa,
      panel: document.getElementById('directions-panel-summary'),
      suppressMarkers: true  //Estaba en 'true' me llevo mucho tiempo darme cuenta que esta propiedad tenia que estar en false para mostrar los marcadores    
    });
 
  }//Termina Inicializar

// Calcula la ruta entre los puntos Desde y Hasta con los puntosIntermedios
// dependiendo de la formaDeIr que puede ser Caminando, Auto o Bus/Subterraneo/Tren
    function calcularYMostrarRutas() {
        var miMedio = document.getElementById('comoIr').value;
        var desde = document.getElementById('desde').value;
        var hasta = document.getElementById('hasta').value;
        var request;
    
        var waypts = [];
        var checkboxArray = document.getElementById('puntosIntermedios');
          for (var i = 0; i < checkboxArray.length; i++) {
            if (checkboxArray.options[i].selected) {
              waypts.push({
                location: checkboxArray[i].value,
                stopover: true
              });
            }
          };
      
      if(miMedio === 'TRANSIT'){
        request = {
          origin: desde,
          destination: hasta,
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode[miMedio]
        };
      }else{
        request = {
          origin: desde,
          destination: hasta,
          waypoints: waypts,
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode[miMedio]
        };
      }
     
     servicioDirecciones.route(request, function(response, status) {
          if (status === 'OK') {
            mostradorDirecciones.setDirections(response);
            
            marcadorModulo.agregarMarcadorRuta (desde, 'A', true);
            marcadorModulo.agregarMarcadorRuta (hasta, 'B', false);
            

            waypts.forEach(function(element) {
              marcadorModulo.agregarMarcadorRuta (element.location, 'PI', true)
            });
           
          } else {
              swal({
              title: status,
              text: 'No se puedan mostrar las indicaciones',
              type: 'error',
              timer: 4000
            });
                         
          }//Cierra Else
    });
        
}//Termina Calcular y mostrar Rutas

  return {
    inicializar,
    agregarDireccion,
    agregarDireccionEnLista,
    agregarDireccionYMostrarEnMapa,
    calcularYMostrarRutas
  }
}())