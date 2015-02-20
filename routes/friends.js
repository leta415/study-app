var config = require('../config.js'), //config file contains all tokens and other private info
    db = require('orchestrate')(config.db); //config.db holds Orchestrate token

// Get friends data
var data = require('../public/json/friends.json');

exports.viewFriends = function(req, res) {
  res.render('friends', data);
};

exports.search = function(req, res){
	console.log("searching!");
	var username = req.body.username;

	db.search('users', req.user.username)
	.then(function(result){
		//get json array
		var displayName = result.body.displayName;
		var friendUsername = result.body.username;
		console.log("displaying" + displayName + friendUsername);
		var html = " <p>" + displayName +"</p><br><p>" + friendUsername + "</p>";
		$('.friendsName').html(html);

	})
	.fail(function(err){
		console.log(err);
	})
};