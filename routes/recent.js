var config = require('../config.js'), //config file contains all tokens and other private info
    db = require('orchestrate')(config.db); //config.db holds Orchestrate token

// Get recent spot data
var data;

exports.recentPlaces = function(req, res) {
	db.get('checkins', req.user.username)
	.then(function (result) {
		data = result.body;
    	data.locations.reverse();
		data.pageName = "Recent Spots";
		res.render('recent', data);
		//console.log(result.body);
	})
	.fail(function (err) {
		// var data = require('../public/json/recent.json');
		var empty;
		empty = {"pageName": "Recent Spots"};
		res.render('recent', empty);
		console.log("failed");
	})

  // res.render('recent', data);
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

  if (i == placesArray.length) {
  	obj = null;
  }

  res.json(obj);
};

exports.bookmark = function(req, res) {
	var name = req.params.id;
	console.log("adding " + name);

	db.get('bookmarks', req.user.username)
	.then(function(result) {
		temp = {};

		bookmarks = result.body.bookmarks;

		var bookmarkExists = 0;
		// Iterate through bookmarks and check to see if we 
		// need to put the bookmark in again
		for (var i = 0; i < bookmarks.length; i++) {
			if (name == bookmarks[i].name) {
				// bookmark already exists
				bookmarkExists = 1;
			}
		}

		console.log("bookmarkExists: " + bookmarkExists);
		if (!bookmarkExists) {
			console.log("I'm in here");
			temp["name"] = name;

			bookmarks.push(temp);
			var json = "{\"bookmarks\": " + JSON.stringify(bookmarks) + "}";  
			console.log(json);
			var jsonObj = JSON.parse(json);

			db.put('bookmarks', req.user.username, jsonObj)
			.then(function(result){
				console.log("added bookmark" + name);
			})
			.fail(function(err){
				console.log("problem putting bookmark in");
				console.log(err);
			})
		} else {
			console.log("bookmark already exists!");
		}

	})
	.fail(function(err){
		console.log(err);
		console.log("user doesn't have bookmarks yet");

		bookmarks = [];
		temp = {};
		temp["name"] = name;
		bookmarks.push(temp);
		var json = "{\"bookmarks\": " + JSON.stringify(bookmarks) + "}";  
		console.log(json);
		var jsonObj = JSON.parse(json);

		db.put('bookmarks', req.user.username, jsonObj)
		.then(function(result){
			console.log("added bookmark" + name + "#2");
		})
		.fail(function(err){
			console.log("problem putting bookmark in for the first time");
			console.log(err);
		})
	})	
};
