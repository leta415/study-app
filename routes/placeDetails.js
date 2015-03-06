var config = require('../config.js'), //config file contains all tokens and other private info
    db = require('orchestrate')(config.db); //config.db holds Orchestrate token

var data; // = require('../public/json/placesInfo.json');

exports.viewGroups = function(req, res) {
  var rand_num = Math.random();

  if (rand_num > 0.5) {
     db.list('places')
        .then(function (result) {
           console.log("inside viewGroups");
            var items = result.body.results;
            var names = [];
            for (var i = 0; i < items.length; i++) {
              names[i] = items[i].value.name;
            }

            var json = JSON.stringify(names);
            console.log(json);
            json = "{\"pageName\": \"Place Directory\", \"places\": " + json + "}";
            console.log(json);
            var newJson = JSON.parse(json);
            res.render('placeDetails', newJson);
        })
        .fail(function (err) {
           console.log(err);
           res.send(500);
        });
    } else {
      res.render('placeDetailsOrig', {
        pageName : "Place Directory"
      });
    }
};

exports.getAllPlaceNames = function(req, res) {
   db.list('places')
      .then(function (result) {
         console.log("inside getAllPlaceNames()");
          // console.log("result: "+result);
          // console.log("result.results: "+result['results']);
          var items = result.body.results;
          var names = [];
          for (var i = 0; i < items.length; i++) {
            names[i] = items[i].value.name;
          }
          // console.log("items: " + items);
          console.log("sending names back: " + names);
          res.send(200, names);
      })
      .fail(function (err) {
         console.log(err);
         res.send(500);
      });
};

exports.findPlaceByName = function(req, res) {
   db.search('places', req.params.name)
   .then(function (result) {
      var item = result.body.results[0].value;
      res.send(200, item);
   })
   .fail(function (err) {
      console.log(err);
      res.send(500);
   })
};