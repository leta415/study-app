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
	var query = 'key=' + req.user.username + ' - name=\"' + name + "\"";
	console.log(query); 
	//check if user bookmarked the place already
	db.search('bookmark', query)
	.then(function(result){
		console.log(result.body);
		//if not, add bookmark
		if(result.body.count == 0){
			// create Date object for current location
		    var d = new Date();
		    
		    // convert to msec
		    // add local time zone offset 
		    // get UTC time in msec
		    utc = d.getTime() + (d.getTimezoneOffset() * 60000);

		    var offset = -8;
		    
		    // create new Date object for different city
		    // using supplied offset
		    nd = new Date(utc + (3600000*offset));
		    nd = nd.toLocaleString();

		    //random generated id for bookmark
			var id = Math.floor((Math.random() * 100) + 1);

			var bookmarks = [];
			var temp = {};

			db.get('bookmarks', req.user.username)
			.then(function(result){
				bookmarks = result.body.bookmarks;
				temp["name"] = name;
				temp["date"] = nd;
				temp["id"] = id;
				bookmarks.push(temp);
				var json = "{\"bookmarks\": " + JSON.stringify(bookmarks) + "}";  
				console.log(json);
				var jsonObj = JSON.parse(json);

				db.put('bookmarks', req.user.username, jsonObj)
				.then(function(result){
					console.log("added bookmark" + name);
				})
				.fail(function(err){
					console.log(err);
				})
			})
			.fail(function(err){
				console.log(err);
			})	
		}else{
			console.log("bookmark already existed");
			var returnjson = "{\"name\": \"" +name + "\"}";
			res.json( returnjson);
		}
	})
	.fail(function(err){
		console.log(err);
	})
};
