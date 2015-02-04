
/*
 * GET home page.
 */

exports.view = function(req, res) {
  res.render('index', {
    "icons": [
      {
        "name" : "Classes",
        "img"  : "books.png"
      },
      {
        "name" : "Recent Spots",
        "img"  : "recent.png"
      },
      {
        "name" : "My Groups",
        "img"  : "group.png"
      },
      {
        "name" : "Friends",
        "img"  : "friend.png"
      },
      {
        "name" : "Check-ins",
        "img"  : "checkin.png"
      },
      {
        "name" : "Map",
        "img"  : "map.png"
      },
      {
        "name" : "Bookmarks",
        "img"  : "favorite.png"
      },
      {
        "name" : "I'm feeling lucky",
        "img"  : "lucky.png"
      },
      {
        "name" : "Settings",
        "img"  : "settings.png"
      }
    ]
  });
};