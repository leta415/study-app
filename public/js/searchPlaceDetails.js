var lastSearched; //Last place that was searched for by user
var placeNames;
var placeObj;
var name;

$(document).ready(function() {
    $.get('/getAllPlaceNames', getAllPlaceNamesCallback);
});

// Get array of place names
function getAllPlaceNamesCallback(result) {
   placeNames = result.slice(0);
   initializeSearchPlaces();
}

function initializeSearchPlaces() {

    var substringMatcher = function(strs) {
        return function findMatches(q, cb) {
            var matches, substrRegex;
     
            // an array that will be populated with substring matches
            matches = [];
     
            // regex used to determine if a string contains the substring `q`
            substrRegex = new RegExp(q, 'i');
     
            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function(i, str) {
                if (substrRegex.test(str)) {
                    // the typeahead jQuery plugin expects suggestions to a
                    // JavaScript object, refer to typeahead docs for more info
                    matches.push({ value: str });
                }
            });
     
            cb(matches);
        };
    };
     
    $('#search-place-details-input').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    },
    {
        name: 'placeNames',
        displayKey: 'value',
        source: substringMatcher(placeNames)
        // updater: function(item) {
        //     console.log(item["value"]);
        //     return item;
        // }
    }); 

    // If enter key pressed, choose first suggestion. If no sugesstions, show message.
    $("#search-place-details-input").keypress(function(e) {
        if (e.which == 13) {
          e.preventDefault();
          if ($(".tt-suggestion:first-child").length) {
            $('#place-details-not-found').css('display', 'none');
            $(".tt-suggestion:first-child").click();
          } else if (lastSearched == $('#search-place-details-input').val()) {
            return;
          } else {
            $('#place-details-not-found').css('display', 'initial');
          }
        }
    });

    jQuery('#search-place-details-input').on('typeahead:autocompleted', searchCallback);
    jQuery('#search-place-details-input').on('typeahead:selected', searchCallback);

    function searchCallback (e, datum) {
        woopra.track("search_place");
        $('#place-details-not-found').css('display', 'none');

        // Return if same as last searched
        if (lastSearched == datum.value) {
            return;
        }

        lastSearched = datum.value;

        console.log("datum.value: " + datum.value); //datum value is place name

        // Find place info by name
        var getPlaceUrl = '/findPlaceByName/' + datum.value;
        $.get(getPlaceUrl, findPlace);
    }

   $("#search-place-details-input").focus();
}

function clickSearch(searchVal) {
  woopra.track("list_click");
  // Find place info by name
  //var getPlaceUrl = '/findPlaceByName/' + datum.value;
  var getPlaceUrl = '/findPlaceByName/' + searchVal;
  $.get(getPlaceUrl, findPlace);
}

// Find place by name
function findPlace(result) {
   placeObj = result;
   var nameQuery = encodeURIComponent(placeObj.name.trim());
   var url = "https://www.google.com/maps/embed/v1/place?q=" + nameQuery + "&key=AIzaSyDQRjMnj-tHPC2FnAE8xhQ-HyoiUHeYQdQ";
   $("#place-details-map-iframe").attr("src", url);
   name = placeObj.name;
   console.log(name);
   $("#place-details-name").html(placeObj.name);
   $("#hours-times-m").html(placeObj.hours.M);
   $("#hours-times-t").html(placeObj.hours.T);
   $("#hours-times-w").html(placeObj.hours.W);
   $("#hours-times-th").html(placeObj.hours.Th);
   $("#hours-times-f").html(placeObj.hours.F);
   $("#hours-times-s").html(placeObj.hours.S);
   $("#hours-times-su").html(placeObj.hours.Su);
   $("#amenity-val-wifi").html(placeObj.amenities.wifi);
   $("#amenity-val-outlets").html(placeObj.amenities.outlets);
   $("#amenity-val-coffee").html(placeObj.amenities.coffee);
   $("#amenity-val-food").html(placeObj.amenities.food);
   $("#place-details").css("display", "initial");
   $("#placeList").hide();
}


//adding bookmarks
$('a.btnMark').on('click', function (e) {
    console.log("bookmark clicked");
    e.preventDefault();
    //var id = $('#place-details-name').val();
    $('#location').html(name);
    $('#bookmarkModal').data('id', name).modal('show');
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