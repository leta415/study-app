
/*
 * GET home page.
 */

exports.view = function(req, res) {
  res.render('index', {
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
        "name" : "My Groups",
        "img"  : "group.png",
        "page" : "group"
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