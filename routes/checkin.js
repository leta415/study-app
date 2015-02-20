var config = require('../config.js'), //config file contains all tokens and other private info
    db = require('orchestrate')(config.db); //config.db holds Orchestrate token

exports.view = function(req, res) {
  res.render('checkin', {
    pageName: 'Check-ins',
  	"nearby": [
  		{
  			"name": "Geisel Library"
  		},
  		{
  			"name": "Biomedical Library"
  		}, 
  		{
  			"name": "Computer Science Basement"
  		}, 
  		{
  			"name": "Richard Atkinson Hall"
  		}, 
  		{
  			"name": "Applied Physics and Mathematics Building"
  		}
  	]
  });
};

exports.checkin = function(req, res) {
  console.log("You have checked in!");
  var location = req.body.location;
  var locDetails = req.body.locDetails;
  var studyDetails = req.body.studyDetails;

  /* Put the user's last checkin into database
   * under their username as the key 
   */
   var locations = [];
   var temp = {};
   
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
    // return time as a string
    console.log("The local time is " + nd.toLocaleString());

  db.get('checkins', req.user.username)
  .then(function (result) {
    // Get the json array
    locations = result.body.locations;
    console.log(result.body.locations);

    temp["location"] = location;
    temp["locDetails"] = locDetails;
    temp["studyDetails"] = studyDetails;
    temp["currentTime"] = nd;
    locations.push(temp);
    var json = "{\"locations\": " + JSON.stringify(locations) + "}";    

    jsonObj = JSON.parse(json);

    // update locations
    db.put('checkins', req.user.username, jsonObj)
    .then(function (result) {
      console.log("Checkin appended to the database.");
    })
    .fail(function (err) {
      console.log(err);
    });

  })
  .fail(function (err) { // if the user has never checked in before
    temp["location"] = location;
    temp["locDetails"] = locDetails;
    temp["studyDetails"] = studyDetails;
    temp["currentTime"] = nd;
    locations.push(temp);
    var json = "{\"locations\": " + JSON.stringify(locations) + "}";

    console.log(req.body);
    console.log("json : " + json); 

    jsonObj = JSON.parse(json);

    db.put('checkins', req.user.username, jsonObj)
    .then(function (result) {
      console.log("Checkin entered into the database for the first time.");
    })
    .fail(function (err) {
      console.log(err);
    });

  })

  res.redirect("/");
};