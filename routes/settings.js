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
exports.changeName = function(req, res) {
	console.log("Changing display name");
	change(req, res, "displayName", req.body.displayName);
}

// Allows user to change their display name
exports.changeEmail = function(req, res) {
	console.log("Changing email");
	change(req, res, "email", req.body.email);
}

// Allows user to change their password 
// This one is more complicated

// Keepin' it DRY
var change = function(req, res, field, information) { // Update the display name only
	console.log("I'm in mini function");
	db.newPatchBuilder('local-users', req.user.username)
	  .replace(field, information)
	  .apply()
	  .then(function (result) {
	    console.log("Successfully changed");

		// Re-render the page to reflect new changes
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
	  }) // Fail on changing the display name
	  .fail(function (err) {
	    console.log("Something went wrong with changing field");
	  })
}