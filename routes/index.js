
/*
 * GET home page.
 */

exports.view = function(req, res) {
  res.render('index', {
    layout: 'index',
    "menu-items": [
      {
        "name" : "Recent Spots",
        "img"  : "recent.png",
        "page" : "recent"
      },
      {
        "name" : "Check-ins",
        "img"  : "checkin.png",
        "page" : "checkin"
      },
      {
        "name" : "Place Details",
        "img"  : "group.png",
        "page" : "placeDetails"
      },
      {
        "name" : "Bookmarks",
        "img"  : "favorite.png",
        "page" : "bookmarks"
      },    
      {
        "name" : "Map",
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