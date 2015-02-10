
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')

var index = require('./routes/index');
var map = require('./routes/map');
var friend = require('./routes/friends');
var group = require('./routes/group');
var recent = require('./routes/recent');
var checkin = require('./routes/checkin');
var bookmarks = require('./routes/bookmarks');
var lucky = require('./routes/lucky');
var settings = require('./routes/settings');
var classes = require('./routes/classes'); // probably going to change this
// Example route
// var user = require('./routes/user');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

['img'].forEach(function (dir){
    app.use('/'+dir, express.static(__dirname+'/'+dir));
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Add routes here
app.get('/', index.view);
app.get('/map', map.viewMap);
app.get('/friends', friend.viewFriends);
app.get('/group', group.viewGroups);
app.get('/recent', recent.recentPlaces);
app.get('/checkin', checkin.view);
app.get('/bookmarks', bookmarks.list);
app.get('/lucky', lucky.view);
app.get('/settings', settings.list);
app.get('/classes', classes.list);
// Example route
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
