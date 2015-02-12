// Get recent spot data
var data = require('../public/json/recent.json');

exports.recentPlaces = function(req, res) {
  res.render('recent', data);
};