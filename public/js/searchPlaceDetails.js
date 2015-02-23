var lastSearched; //Last place that was searched for by user
var placeNames;
var placeObj;

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

// Find place by name
function findPlace(result) {
   placeObj = result;
   var nameQuery = encodeURIComponent(placeObj.name.trim());
   var url = "https://www.google.com/maps/embed/v1/place?q=" + nameQuery + "&key=AIzaSyDQRjMnj-tHPC2FnAE8xhQ-HyoiUHeYQdQ";
   $("#place-details-map-iframe").attr("src", url);
   $("#place-details-name").html(placeObj.name);
   $("#hours-times-m").html(placeObj.hoursM);
   $("#hours-times-t").html(placeObj.hoursT);
   $("#hours-times-w").html(placeObj.hoursW);
   $("#hours-times-th").html(placeObj.hoursTh);
   $("#hours-times-f").html(placeObj.hoursF);
   $("#hours-times-s").html(placeObj.hoursS);
   $("#hours-times-su").html(placeObj.hoursSu);
   $("#amenity-val-wifi").html(placeObj.wifi);
   $("#amenity-val-outlets").html(placeObj.outlets);
   $("#amenity-val-coffee").html(placeObj.coffee);
   $("#amenity-val-food").html(placeObj.food);
   $("#place-details").css("display", "initial");
}