
/*
 * GET home page.
 */

exports.view = function(req, res) {
  res.render('index', {
    "menu-items": [
      {
        "name" : "Classes",
        "img"  : "books.png",
        "page" : "classes"
      },
      {
        "name" : "Recent Spots",
        "img"  : "recent.png",
        "page" : "recent"
      },
      {
        "name" : "My Groups",
        "img"  : "group.png",
        "page" : "group"
      },
      {
        "name" : "Friends",
        "img"  : "friend.png",
        "page" : "friends"
      },
      {
        "name" : "Check-ins",
        "img"  : "checkin.png",
        "page" : "checkin"
      },
      {
        "name" : "Map",
        "img"  : "map.png",
        "page" : "map"
      },
      {
        "name" : "Bookmarks",
        "img"  : "favorite.png",
        "page" : "bookmarks"
      },
      {
        "name" : "I'm feeling lucky",
        "img"  : "lucky.png",
        "page" : "lucky"
      },
      {
        "name" : "Settings",
        "img"  : "settings.png",
        "page" : "settings"
      }
    ]
  });
};