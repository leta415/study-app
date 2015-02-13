var data = require('../public/json/defaultPlaces.json');

exports.viewMap = function(req, res) {
  res.render('map', data);
};