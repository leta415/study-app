var lastSearched;

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
     
    // Places for testing purposes
    var places = ["Geisel Library", "Computer Science Labs", "Price Center", "Applied Physics and Mathematics Building", "Biomedical Library"];


    $('#search-place-details-input').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    },
    {
        name: 'places',
        displayKey: 'value',
        source: substringMatcher(places),
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

        var index = 0;
        if (datum.value == "Geisel Library") index = 0;
        else if (datum.value == "Computer Science Labs") index = 1;
        else if (datum.value == "Price Center") index = 2;
        else if (datum.value == "Applied Physics and Mathematics Building") index = 3;
        else index = 4;

        $.getJSON('/json/placesInfo.json', function(json) {
            console.log(json);
            console.log("json name: " + json.placesInfo[index].name);
            var nameQuery = encodeURIComponent(json.placesInfo[index].name.trim()) + "%20La Jolla,%20CA";
            var url = "https://www.google.com/maps/embed/v1/place?q=" + nameQuery + "&key=AIzaSyDQRjMnj-tHPC2FnAE8xhQ-HyoiUHeYQdQ";
            console.log("Request for: " + url);
            $("#place-details-map-iframe").attr("src", url);
            $("#place-details-name").html(json.placesInfo[index].name);
            $("#hours-times-m").html(json.placesInfo[index].hoursM);
            $("#hours-times-t").html(json.placesInfo[index].hoursT);
            $("#hours-times-w").html(json.placesInfo[index].hoursW);
            $("#hours-times-th").html(json.placesInfo[index].hoursTh);
            $("#hours-times-f").html(json.placesInfo[index].hoursF);
            $("#hours-times-s").html(json.placesInfo[index].hoursS);
            $("#hours-times-su").html(json.placesInfo[index].hoursSu);
            $("#amenity-val-wifi").html(json.placesInfo[index].wifi);
            $("#amenity-val-outlets").html(json.placesInfo[index].outlets);
            $("#amenity-val-coffee").html(json.placesInfo[index].coffee);
            $("#amenity-val-food").html(json.placesInfo[index].food);
            $("#place-details").css("display", "initial");
        });
    }

    $("#search-place-details-input").focus();

}

$(document).ready(function() {
    initializeSearchPlaces();
})