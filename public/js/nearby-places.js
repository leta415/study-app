var origInfowindow;

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
function initializeNearbyPlaces() {
  var input = /** @type {HTMLInputElement} */(
    document.getElementById('search-places-input'));

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  // Define click listener for search places enter key
  $("#search-places-input").keypress(function(e) {
    if (e.which == 13) {
      e.preventDefault();
    }
  });

  // Define click listener for search places search button
  $("#search-places-enter").click(function(e) {
    e.preventDefault();
  });

  // var startLocInfowindow = new google.maps.InfoWindow();
  var startLocMarker = new google.maps.Marker({
    map: map,
    // anchorPoint: new google.maps.Point(0, -29)
  });

  google.maps.event.addListener(autocomplete, 'place_changed', autocompleteCallback);
    // function() {

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
  // }); 

  // Callbback for search places google autocomplete
  function autocompleteCallback() {
    // Destroy original current location
    if (origInfowindow != null) {
      google.maps.event.clearInstanceListeners(origInfowindow);  // just in case handlers continue to stick around
      origInfowindow.close();
      origInfowindow = null;
      origMarker.setVisible(false);
    }

    startLocMarker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      console.log("Place searched for was not found.");
      $("#place-not-found").css("display", "initial");
      return;
    }

    $("#place-not-found").css("display", "none");

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

    console.log("lat: " + place.geometry.location.lat() + "   lng: " + place.geometry.location.lng());
    var getNearbyUrl = "/displayNearby/" + place.geometry.location.lat() + "/" + place.geometry.location.lng(); 
    $.get(getNearbyUrl, showNearbyOnMap);
  }
  // End of autocompleteCallback function


  function showNearbyOnMap(result) {
    // 'result' is an array of json objects that you need to call .value on

    infoWindow = null;
    infoWindow = new google.maps.InfoWindow({
      content: "holding..."
    });

    for (var index = 0; index < result.length; index++) {
      obj = result[index].value;
      console.log("making marker for place: " + obj.name);

      var jsStr = 
          "var nameQuery = encodeURIComponent('" + obj.name.trim() + "');" +
          "var url = 'https://www.google.com/maps/embed/v1/place?q=' + nameQuery + '&key=AIzaSyDQRjMnj-tHPC2FnAE8xhQ-HyoiUHeYQdQ';" +
          "$('#place-details-map-iframe-overlay').attr('src', url);" +
          "$('#place-details-name-overlay').html('" + obj.name + "');" +
          "$('#hours-times-m-overlay').html('" + obj.hours.M + "');" +
          "$('#hours-times-t-overlay').html('" + obj.hours.T + "');" +
          "$('#hours-times-w-overlay').html('" + obj.hours.W + "');" +
          "$('#hours-times-th-overlay').html('" + obj.hours.Th + "');" +
          "$('#hours-times-f-overlay').html('" + obj.hours.F + "');" +
          "$('#hours-times-s-overlay').html('" + obj.hours.S + "');" +
          "$('#hours-times-su-overlay').html('" + obj.hours.Su + "');" +
          "$('#amenity-val-wifi-overlay').html('" + obj.amenities.wifi + "');" +
          "$('#amenity-val-outlets-overlay').html('" + obj.amenities.outlets + "');" +
          "$('#amenity-val-coffee-overlay').html('" + obj.amenities.coffee + "');" +
          "$('#amenity-val-food-overlay').html('" + obj.amenities.food + "');" +
          "$('#place-details-overlay').css('display', 'initial');";

      var newMarker = new google.maps.Marker({
        position: {lat: obj.location.latitude, lng: obj.location.longitude},
        map: map,
        clickable: true,
        html: "<a href='#' onclick=\"" + jsStr + "\" data-toggle='modal' data-target='#place-detail-overlay' id='place" + index + "'><strong>" + obj.name +"</strong></a>"      
      });

      google.maps.event.addListener(newMarker, 'click', function() {
        //this.info.open(map, newMarker);
        infoWindow.setContent(this.html);
        infoWindow.open(map, this);
      });

      var placeID = "#place" + index;
      $(placeID).on('hidden', function() {
        $("#place-detail-overlay").modal('show');
      });      
    }
  }
  // End of showNearbyOnMap

  $("#search-places-input").prop("disabled", false);
  $("#search-places-input").focus();
}

google.maps.event.addDomListener(window, 'load', initializeNearbyPlaces);