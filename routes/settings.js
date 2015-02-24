var config = require('../config.js'), //config file contains all tokens and other private info
    db = require('orchestrate')(config.db); //config.db holds Orchestrate token

exports.list = function(req, res) {
	// Find user's current settings in database
	db.get('local-users', req.user.username)
	.then(function (result) {
		data = result.body;
		data.pageName = "Settings";
		res.render('settings', data);
		console.log(result.body);
	})
	.fail(function (err) {
		var empty;
		empty = {"pageName": "Settings"};
		res.render('settings', empty);
		console.log("failed");
	})

};