var config = require('../config.js'), //config file contains all tokens and other private info
    db = require('orchestrate')(config.db); //config.db holds Orchestrate token

//Get placesInfo data
var places = require('../public/json/placesInfo.json');

exports.list = function(req, res) {
  res.render('bookmarks', data);
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

  res.json(obj);
};

exports.displayPlace = function(req, res) {
  db.get('bookmarks', req.user.username)
  .then(function (result) {
    data = result.body;
    data.bookmarks.reverse();
    data.pageName = "Bookmarks";
    res.render('bookmarks', data);
  })
  .fail(function (err) {
    var empty;
    empty = {"pageName": "Bookmarks"};
    res.render('bookmarks', empty);
    console.log("failed");
  })
};


exports.deleteBookmark = function(req,res){
  console.log("deleting");
  var id = req.params.id;
  console.log("deleting id " + id);
  var bookmarks = [];
  var newBookmarks = [];

  db.get('bookmarks', req.user.username)
  .then(function(result){
    bookmarks = result.body.bookmarks;
    for(var i in bookmarks){
      if(id != bookmarks[i].id){
        newBookmarks.push(bookmarks[i]);
      }
    }
    var json = "{\"bookmarks\": " + JSON.stringify(newBookmarks) + "}";  
    var jsonObj = JSON.parse(json);
    db.put('bookmarks', req.user.username ,jsonObj)
    .then(function(result){
      console.log("deleted bookmark " + id);
      res.redirect('/bookmarks');
    })
    .fail(function(err){
      console.log(err);
    })
  })
  .fail(function(err){
    console.log(err);
  })
};