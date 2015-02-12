// Get recent spot data
var data = require('../public/json/bookmarks.json');

exports.list = function(req, res) {
  res.render('bookmarks', data);
};