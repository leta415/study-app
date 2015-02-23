var config = require('../config.js'), //config file contains all tokens and other private info
    db = require('orchestrate')(config.db); //config.db holds Orchestrate token

var data; //= require('../public/json/defaultPlaces.json');

exports.viewMap = function(req, res) {
   res.render('map', data);
};

exports.displayNearbyResults = function(req, res) {
   db.list('places')
      .then(function (result) {
          // console.log("result: "+result);
          // console.log("result.results: "+result['results']);
          var items = result.body.results;
          console.log("items: " + items);
          res.send(200, items);
      })
      .fail(function (err) {
         console.log(err);
         res.send(500);
      });
};