$(document).ready(function() {
    $('.placeName').on('click', getPlaceDetails);
});

function getPlaceDetails(e) {
  e.preventDefault();
  var name = $(this).text();
  var url = '/bookmarks/' + name;
  $.get(url, showPlaceDetails);
}

function showPlaceDetails(result) {
  var nameQuery = encodeURIComponent(result.name.trim()) + '%20La Jolla,%20CA';    
  var url = 'https://www.google.com/maps/embed/v1/place?q=' + nameQuery + '&key=AIzaSyDQRjMnj-tHPC2FnAE8xhQ-HyoiUHeYQdQ';
  $('#place-details-map-iframe-overlay').attr('src', url);
  $('#place-details-name-overlay').html(result.name);
  $('#hours-times-m-overlay').html(result.hoursM);
  $('#hours-times-t-overlay').html(result.hoursT);
  $('#hours-times-w-overlay').html(result.hoursW);
  $('#hours-times-th-overlay').html(result.hoursTh);
  $('#hours-times-f-overlay').html(result.hoursF);
  $('#hours-times-s-overlay').html(result.hoursS);
  $('#hours-times-su-overlay').html(result.hoursSu);
  $('#amenity-val-wifi-overlay').html(result.wifi);
  $('#amenity-val-outlets-overlay').html(result.outlets);
  $('#amenity-val-coffee-overlay').html(result.coffee);
  $('#amenity-val-food-overlay').html(result.food);
  $('#place-details-overlay').css('display', 'initial');
}

$(".placeName").on('hidden', function() {
    $("#place-detail-overlay").modal('show');
});