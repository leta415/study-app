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
  var nameQuery = encodeURIComponent(result.name.trim());    
  var url = 'https://www.google.com/maps/embed/v1/place?q=' + nameQuery + '&key=AIzaSyDQRjMnj-tHPC2FnAE8xhQ-HyoiUHeYQdQ';
  $('#place-details-map-iframe-overlay').attr('src', url);
  $('#place-details-name-overlay').html(result.name);
  $('#hours-times-m-overlay').html(result.hours.M);
  $('#hours-times-t-overlay').html(result.hours.T);
  $('#hours-times-w-overlay').html(result.hours.W);
  $('#hours-times-th-overlay').html(result.hours.Th);
  $('#hours-times-f-overlay').html(result.hours.F);
  $('#hours-times-s-overlay').html(result.hours.S);
  $('#hours-times-su-overlay').html(result.hours.Su);
  $('#amenity-val-wifi-overlay').html(result.amenities.wifi);
  $('#amenity-val-outlets-overlay').html(result.amenities.outlets);
  $('#amenity-val-coffee-overlay').html(result.amenities.coffee);
  $('#amenity-val-food-overlay').html(result.amenities.food);
  $('#place-details-overlay').css('display', 'initial');
}

$(".placeName").on('hidden', function() {
    $("#place-detail-overlay").modal('show');
});

//adding bookmarks
$('a.btnMark').on('click', function (e) {
    console.log("bookmark clicked");
    e.preventDefault();
    var id = $(this).closest('tr').data('id');
    $('#location').html(id);
    $('#bookmarkModal').data('id', id).modal('show');
});

$('#btnAdd').click(function (e) {
    e.preventDefault();
    console.log("confirm clicked");
    var id = $('#bookmarkModal').data('id');
    var url ='/bookmark/'+ id;

    function refresh(json){
        var id = json['name'];
        $('#bookmarkExisted').data('id', id).modal('show');
    }
    $.get(url, refresh);

    $('#bookmarkModal').modal('hide');
});