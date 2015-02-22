// Default study spot locations
geisel = new google.maps.LatLng(32.88120, -117.23750);
cselabs = new google.maps.LatLng(32.88180, -117.23352);
priceCenter = new google.maps.LatLng(32.87967, -117.23653);
apm = new google.maps.LatLng(32.87903, -117.24103);
biomed = new google.maps.LatLng(32.87665, -117.23701);
defaultLocations = [geisel, cselabs, priceCenter, apm, biomed];
defaultLocations[0][0] = "Geisel Library";
defaultLocations[1][0] = "Computer Science Labs";
defaultLocations[2][0] = "Price Center";
defaultLocations[3][0] = "Applied Physics and Mathematics Building";
defaultLocations[4][0] = "Biomedical Library";
/////////////////////////////////
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


    // Initialize an info window
    var index;
    infoWindow = null;
    infoWindow = new google.maps.InfoWindow({
      content: "holding..."
    });

    // Make markers and associate with appropriate info windows
    for (index = 0; index < defaultLocations.length; index++) {
      currentLocation = defaultLocations[index];

      var jsStr = 
        "$.getJSON('/json/placesInfo.json', function(json) {" +
          // "console.log(json);" +
          // "console.log('trying to get json stuff of index ' + " + index + ");" +
          // "console.log('json name: ' + json.placesInfo[" + index + "].name);" +
          "var nameQuery = encodeURIComponent(json.placesInfo[" + index + "].name.trim()) + '%20La Jolla,%20CA';" +
          "var url = 'https://www.google.com/maps/embed/v1/place?q=' + nameQuery + '&key=AIzaSyDQRjMnj-tHPC2FnAE8xhQ-HyoiUHeYQdQ';" +
          // "console.log('Request for: ' + url);" +
          "$('#place-details-map-iframe-overlay').attr('src', url);" +
          "$('#place-details-name-overlay').html(json.placesInfo[" + index + "].name);" +
          "$('#hours-times-m-overlay').html(json.placesInfo[" + index + "].hoursM);" +
          "$('#hours-times-t-overlay').html(json.placesInfo[" + index + "].hoursT);" +
          "$('#hours-times-w-overlay').html(json.placesInfo[" + index + "].hoursW);" +
          "$('#hours-times-th-overlay').html(json.placesInfo[" + index + "].hoursTh);" +
          "$('#hours-times-f-overlay').html(json.placesInfo[" + index + "].hoursF);" +
          "$('#hours-times-s-overlay').html(json.placesInfo[" + index + "].hoursS);" +
          "$('#hours-times-su-overlay').html(json.placesInfo[" + index + "].hoursSu);" +
          "$('#amenity-val-wifi-overlay').html(json.placesInfo[" + index + "].wifi);" +
          "$('#amenity-val-outlets-overlay').html(json.placesInfo[" + index + "].outlets);" +
          "$('#amenity-val-coffee-overlay').html(json.placesInfo[" + index + "].coffee);" +
          "$('#amenity-val-food-overlay').html(json.placesInfo[" + index + "].food);" +
          "$('#place-details-overlay').css('display', 'initial');" +
      "})";

      var newMarker = new google.maps.Marker({
        position: currentLocation,
        map: map,
        clickable: true,
        html: "<a href='#' onclick=\"" + jsStr + "\" data-toggle='modal' data-target='#place-detail-overlay' id='place" + index + "'><strong>" + defaultLocations[index][0] +"</strong></a>"      
      });

      google.maps.event.addListener(newMarker, 'click', function() {
        //this.info.open(map, newMarker);
        console.log(this.html);
        infoWindow.setContent(this.html);
        infoWindow.open(map, this);
      });

      var placeID = "#place" + index;
      $(placeID).on('hidden', function() {
        console.log("inside click");
        $("#place-detail-overlay").modal('show');
      });

    }
  }
  // End of autocompleteCallback function

  $("#search-places-input").prop("disabled", false);
  $("#search-places-input").focus();
}

google.maps.event.addDomListener(window, 'load', initializeNearbyPlaces);