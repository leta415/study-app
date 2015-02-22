var config = require('../config.js'), //config file contains all tokens and other private info
    db = require('orchestrate')(config.db); //config.db holds Orchestrate token

// Get friends data
var data;// = require('../public/json/friends.json');

exports.viewFriends = function(req, res) {
  res.render('friends', data);
};

exports.displayFriends = function(req,res){
	db.get('friends', req.user.username)
	.then(function(result){
		data = result.body;
		data.pageName = "Friends";		
		console.log(data);
		res.render('friends', data);
	})
	.fail(function(err){
		var empty;
		empty = {"pageName": "Friends"};
		res.render('friends', empty);
		console.log("failed");
	})
};

exports.search = function(req, res){
	console.log("searching!");
	var username = req.params.id;
	console.log("query = username:" + username);
	db.search('users', 'username:' +username)
	.then(function(result){
		//get json array
		console.log(result.body.results[0].value);
		res.json(result.body.results[0].value);	
	})
	.fail(function(err){
		console.log(err);
	})
};

exports.deleteFriend = function(req,res){
	console.log("deleting");
};

exports.add = function(req,res){
	console.log("adding friend!");
	var username = req.params.id;
	var name = req.params.name;
	console.log(username + " " + name);
	var recentDetails;
	var friends = [];
	var temp = {};
	db.get('checkins', username)
	.then(function(result){
		var body = JSON.stringify(result.body);
		var jsonArray = JSON.parse(body);
		var locationList = jsonArray.locations;
		recentDetails = locationList[locationList.length-1];
		//random generated id for friend
		var id = Math.floor((Math.random() * 100) + 1);

		db.get('friends', req.user.username)
		.then(function(result){
			// Get the json array
			friends = result.body.friends;
			temp["name"] = name;
			temp["username"] = username;
			temp["topics"] = recentDetails.studyDetails;
			temp["location"] = recentDetails.location;
			temp["locationDetail"] = recentDetails.locDetails;
			temp["checkinTime"] = recentDetails.currentTime;
			temp["id"] = id;
			console.log(temp);
			friends.push(temp);
			var json = "{\"friends\": " + JSON.stringify(friends) + "}";  
			console.log(json);
			var jsonObj = JSON.parse(json);

			db.put('friends', req.user.username ,jsonObj)
			.then(function(result){
				console.log("added friend " + name);
				res.redirect('/friends');
			})
			.fail(function(err){
				console.log(err);
			})
		})
		.fail(function(err){
			console.log(err);
		})
		
	})
	.fail(function(err){
		//user hasn't checked in anywhere yet
		console.log(err);
		//add into user friends list
		db.get('friends', req.user.username)
		.then(function(result){
			// Get the json array
			friends = result.body.friends;
			temp["name"] = name;
			temp["username"] = username;
			temp["topics"] = "";
			temp["location"] = "";
			temp["locationDetail"] = "";
			temp["checkinTime"] = "";
			var id = Math.floor((Math.random() * 100) + 1);
			temp["id"] = id;
			console.log(temp);
			friends.push(temp);
			var json = "{\"friends\": " + JSON.stringify(friends) + "}";  
			console.log(json);
			var jsonObj = JSON.parse(json);

			db.put('friends', req.user.username ,jsonObj)
			.then(function(result){
				console.log("added friend " + name);
				res.redirect('/friends');
			})
			.fail(function(err){
				console.log(err);
			})
		})
		.fail(function(err){
			console.log(err);
		})
	})
};
