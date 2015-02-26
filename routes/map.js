var config = require('../config.js'), //config file contains all tokens and other private info
    db = require('orchestrate')(config.db); //config.db holds Orchestrate token

var data; //= require('../public/json/defaultPlaces.json');

exports.viewMap = function(req, res) {
   res.render('map', {'pageName': 'Search Nearby Places'});
};

exports.displayNearbyResults = function(req, res) {
  var lat = req.params.lat;
  var lng = req.params.lng;

  console.log("read in lat/lng: " + lat + ", " + lng);

  db.newSearchBuilder()
    .collection('places')
    .query("value.location:NEAR:{lat:" + lat + " lon:" + lng + " dist:0.5km}")
    .then(function (result) {
      console.log("found " + result.body.total_count + " nearby places");
      res.send(200, result.body.results);
    })
    .fail(function (err) {
      console.log(err);
      res.send(500);
    });

   // db.list('places')
   //    .then(function (result) {
   //        // console.log("result: "+result);
   //        // console.log("result.results: "+result['results']);
   //        var items = result.body.results;
   //        console.log("items: " + items);
   //        res.send(200, items);
   //    })
   //    .fail(function (err) {
   //       console.log(err);
   //       res.send(500);
   //    });
};