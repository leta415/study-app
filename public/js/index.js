// Default study spot locations
geisel = new google.maps.LatLng(32.88120, -117.23750);
cselabs = new google.maps.LatLng(32.88180, -117.23352);
priceCenter = new google.maps.LatLng(32.87967, -117.23653);
apm = new google.maps.LatLng(32.87903, -117.24103);
biomed = new google.maps.LatLng(32.87665, -117.23701);
defaultLocations = [geisel, cselabs, priceCenter, apm, biomed];
/////////////////////////////////

// Initialize map
(function() {

  if(!!navigator.geolocation) {

    var mapOptions = {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    //Get HTML element and set up the map
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    navigator.geolocation.getCurrentPosition(function(position) {
    
      var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); 

      // Create info window for current location marker
      origInfowindow = new google.maps.InfoWindow({
        map: map,
        position: geolocate,
        content:
          '<h1>Current location</h1>' /*+
          '<h2>Latitude: ' + position.coords.latitude + '</h2>' +
          '<h2>Longitude: ' + position.coords.longitude + '</h2>'*/
      });
      origInfowindow.close();
      map.setCenter(geolocate);

      // Create marker for current location
      origMarker = new google.maps.Marker({
        position: geolocate,
        map: map,
        title: 'You are here.',
      });

      // Add click listener for current location marker
      google.maps.event.addListener(origMarker, 'click', function() {
        origInfowindow.open(map, origMarker);
      });
      
    });
    
  } else {
    document.getElementById('map-canvas').innerHTML = 'No Geolocation Support.';
  }

})();


// Initialize autocomplete places 
function initialize() {

  var input = /** @type {HTMLInputElement} */(
    document.getElementById('search-places-input'));

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  // var startLocInfowindow = new google.maps.InfoWindow();
  var startLocMarker = new google.maps.Marker({
    map: map,
    // anchorPoint: new google.maps.Point(0, -29)
  });

  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    // Destroy original current location
    if (origInfowindow) {
      google.maps.event.clearInstanceListeners(origInfowindow);  // just in case handlers continue to stick around
      origInfowindow.close();
      origInfowindow = null;
      origMarker.setVisible(false);
    }

    // Change html layout to show results 
    var resultsPanelsElem = document.getElementById("results-panels");
    resultsPanelsElem.className = "";
    resultsPanelsElem.className = "col-xs-12 col-md-4";
    var mapCanvasElem = document.getElementById("map-canvas");
    mapCanvasElem.className = "";
    mapCanvasElem.className = "col-xs-12 col-md-8";
    resultsPanelsElem.innerHTML = 
      "<div class='panel panel-primary'>" +
        "<div class='panel-body'>" +
          "Geisel Library" +
        "</div>" + 
      "</div>";

    // infowindow.close();
    startLocMarker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(16);  // When in doubt, 17 looks good.
    }

    startLocMarker.setIcon(/** @type {google.maps.Icon} */({
      // url: place.icon,
      url: "/img/youarehere-button.png",
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));

    startLocMarker.setPosition(place.geometry.location);
    startLocMarker.setVisible(true);

    var index;
    for (index = 0; index < defaultLocations.length; index++) {
      var marker = new google.maps.Marker({
        position: defaultLocations[index],
        map: map
      });
    }
    // var address = '';
    // if (place.address_components) {
    //   address = [
    //     (place.address_components[0] && place.address_components[0].short_name || ''),
    //     (place.address_components[1] && place.address_components[1].short_name || ''),
    //     (place.address_components[2] && place.address_components[2].short_name || '')
    //   ].join(' ');
    // }

    // origInfowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    // origInfowindow.open(map, origMarker);
  }); 
  // End of addListener for autocomplete

}

google.maps.event.addDomListener(window, 'load', initialize);