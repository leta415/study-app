
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

Handlebars.registerHelper('grouped_each', function(every, context, options) {
    var out = "", subcontext = [], i;
    if (context && context.length > 0) {
        for (i = 0; i < context.length; i++) {
            if (i > 0 && i % every === 0) {
                out += options.fn(subcontext);
                subcontext = [];
            }
            subcontext.push(context[i]);
        }
        out += options.fn(subcontext);
    }
    return out;
});