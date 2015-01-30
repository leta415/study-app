
/*
 * GET home page.
 */

exports.view = function(req, res) {
  res.render('index', {
    "icons": [
      {
        "name" : "test"
      },
      {
        "name" : "test2"
      },
      {
        "name" : "test3"
      },
      {
        "name" : "test4"
      },
      {
        "name" : "test5"
      },
      {
        "name" : "test6"
      },
      {
        "name" : "test7"
      },
      {
        "name" : "test8"
      },
      {
        "name" : "test9"
      }
    ]
  });
};