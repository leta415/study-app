// Get friends data
var data = require('../public/json/friends.json');

exports.viewFriends = function(req, res) {
  res.render('friends', data);
};