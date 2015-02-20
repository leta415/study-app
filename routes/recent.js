var config = require('../config.js'), //config file contains all tokens and other private info
    db = require('orchestrate')(config.db); //config.db holds Orchestrate token

// Get recent spot data
var data;

exports.recentPlaces = function(req, res) {
	db.get('checkins', req.user.username)
	.then(function (result) {
		data = result.body;
		data.pageName = "Recent Spots";
		res.render('recent', data);
		console.log(result.body);
	})
	.fail(function (err) {
		var data = require('../public/json/recent.json');
		res.render('recent', data);
		console.log("failed");
	})

  // res.render('recent', data);
};
