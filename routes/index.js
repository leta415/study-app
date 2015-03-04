
/*
 * GET home page.
 */

exports.view = function(req, res) {
  res.render('index', {
    layout: 'noBackButton',
    "menu-items": [
      {
        "name" : "Recent Spots",
        "img"  : "recent.png",
        "page" : "recent"
      },
      {
        "name" : "Check In",
        "img"  : "checkin.png",
        "page" : "checkin"
      },
      {
        "name" : "Place Details",
        "img"  : "place.png",
        "page" : "placeDetails"
      },
      {
        "name" : "Favorites",
        "img"  : "favorite.png",
        "page" : "bookmarks"
      },    
      {
        "name" : "Nearby Places",
        "img"  : "map.png",
        "page" : "map"
      },
      {
        "name" : "Friends",
        "img"  : "friend.png",
        "page" : "friends"
      }
    ]
  });
};