import Ember from 'ember';
import RedbaMap from 'npm:redba-maps';

const {ControlPosition} = window.google.maps;

export default Ember.Component.extend({
  didRender(){
    // Busca en elemento donde se creará en mapa
    let ele = document.getElementById('map_canvas');
    
    // define las opciones por defecto
    let ops = {
      // Icono del la seda
      sedeIcon: 'assets/dot-circle-icon.png',
      showSede: true,

      streetViewControl: false,
      mapTypeControlOptions: { 
        position: ControlPosition.BOTTOM_LEFT 
      }
    };

    // IMPORTANTE
    // Hay que hacer publica o copiar los archivos
    // que se encuetran en node_modules/redba-maps/public/**/*

    // Crea un promise de las regiones
    ops.regions = $.get('regiones.json');

    // Puede servir para poner un loading
    ops.regions.then( response => {
      // lodaded
    });

    // Define la funcción para obtener una region
    ops.fetchRegion = (idRegion) => {
      return $.get(`regiones/${idRegion}.json`);
    };

    // Define la funcción para obtener un distrito
    ops.fetchDistrict = (idDistrict) => {
      return $.get(`distritos/${idDistrict}.json`);
    };

    // Crea el mapa
    var map = new RedbaMap(ele, ops);

    // Events
    map.addListener('region.click', (region) => {
      console.log('region.click', region);

      region.show(true);
      region.fitBounds();
    });

     map.addListener('district.click', (distrito) => {
      console.log('district.click', distrito);
    });

    map.addListener('sede.click', (region) => {
      console.log('sede.click', region);
    });

    // Este evento solo se despues del ops.overRegionZoom (default 8)
    map.addListener('region.over_change', (region, prevRegion) => {
      console.log('region.over_change');
      console.log(region, prevRegion);
    });
    

    // Esto carga escuelas de ejemplo
    $.get('/escuelas.json')
      .then(data => {
        var escuelas = data;
        escuelas.forEach(e => {

          // Simple marker
          // https://developers.google.com/maps/documentation/javascript/examples/marker-simple
          // 
          // Custom marker
          // https://developers.google.com/maps/documentation/javascript/custom-markers
          e.marker = new google.maps.Marker({
            position: { lat: e.lat, lng: e.lng },
            map: map,
            title: `CUE ${e.cue} / ${e.nombre}`
          });

        });
      })
      .fail( err => {
        console.log(err);
      });

  }
});
