// Get bookmarks data
var data = require('../public/json/bookmarks.json');

//Get placesInfo data
var places = require('../public/json/placesInfo.json');

exports.list = function(req, res) {
  res.render('bookmarks', data);
};

exports.viewPlace = function(req, res) {
  var placeName = req.params.name;
  var placesArray = places.placesInfo;

  var obj;
  for (var i = 0; i < placesArray.length; i++) {
    obj = placesArray[i];
    if (obj['name'] == placeName) {
        break;
    }
  }

  res.json(obj);
};