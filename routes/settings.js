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

// Allows user to change their display name
exports.change = function(req, res) {
	console.log("Changing display name");

	db.newPatchBuilder('local-users', req.user.username)
	  .replace("displayName", req.body.displayName)
	  .apply()
	  .then(function (result) {
	    console.log("Successfully changed display name");

		// Re-render the page
		db.get('local-users', req.user.username)
		.then(function (result) {
			console.log("race condition");
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
	  })
	  .fail(function (err) {
	    console.log("Something went wrong with changing display name");
	  })

	// db.put('local-users', req.user.username, req.body)
	// .then(function (result) {
	// 	console.log("Successfully changed display name");
	// })
	// .fail(function (err) {
	// 	console.log("Something went wrong with changing display name");
	// })

}