
/**
 * Module dependencies.
 */

var express = require('express'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    TwitterStrategy = require('passport-twitter'),
    GoogleStrategy = require('passport-google'),
    FacebookStrategy = require('passport-facebook');
    
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')

var config = require('./config.js'), // contains all tokens and other private info
	funct = require('./functions.js'); // contains our helper functions for Passport and database

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

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

// Configure express to use handlebars templates
var hbs = handlebars.create({
    defaultLayout: 'main', 
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser("Secret here"));
app.use(express.bodyParser());
app.use(express.session({secret: 'anything'}));
app.use(passport.initialize());
app.use(passport.session());

/* This is so that the user session persists across the templates, and that
 * req.user is implicitly defined in all the routes. 
 */
app.use( function (req, res, next) {
    res.locals.user = req.user;
    next();
});

app.use(app.router);

// Session-persisted message middleware
app.use(function(req, res, next){
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});

/* So images are understood to be static 
 */

['img'].forEach(function (dir){
    app.use('/'+dir, express.static(__dirname+'/'+dir));
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Simple route middleware to ensure user is authenticated.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  req.session.error = 'Please sign in!';
  res.redirect('/login');
}

// Add routes here
app.get('/', ensureAuthenticated, index.view);
app.get('/map', map.viewMap);
app.get('/friends', ensureAuthenticated, friend.viewFriends);
app.get('/group', ensureAuthenticated, group.viewGroups);
app.get('/recent', ensureAuthenticated, recent.recentPlaces);
app.get('/checkin', ensureAuthenticated, checkin.view);
app.get('/bookmarks', ensureAuthenticated, bookmarks.list);
app.get('/lucky', lucky.view);
app.get('/settings', ensureAuthenticated, settings.list);
app.get('/classes', ensureAuthenticated, classes.list);

//===============PASSPORT=================
passport.serializeUser(function(user, done) {
  console.log("serializing " + user.username);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log("deserializing " + obj);
  done(null, obj);
});

// Use the LocalStrategy within Passport to login/”signin” users.
passport.use('local-signin', new LocalStrategy(
  {passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, username, password, done) {
    funct.localAuth(username, password)
    .then(function (user) {
      if (user) {
        console.log("LOGGED IN AS: " + user.username);
        req.session.success = 'You are successfully logged in ' + user.username + '!';
        done(null, user);
      }
      if (!user) {
        console.log("COULD NOT LOG IN");
        req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
        done(null, user);
      }
    })
    .fail(function (err){
      console.log(err.body);
    });
  }
));
// Use the LocalStrategy within Passport to register/"signup" users.
passport.use('local-signup', new LocalStrategy(
  {passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, username, password, done) {
    funct.localReg(username, password)
    .then(function (user) {
      if (user) {
        console.log("REGISTERED: " + user.username);
        req.session.success = 'You are successfully registered and logged in ' + user.username + '!';
        done(null, user);
      }
      if (!user) {
        console.log("COULD NOT REGISTER");
        req.session.error = 'That username is already in use, please try a different one.'; //inform user could not log them in
        done(null, user);
      }
    })
    .fail(function (err){
      console.log(err.body);
    });
  }
));

app.get('/login', function(req, res){
  res.render('login', {layout: 'index'});
});

app.get('/signup', function(req, res){
  res.render('signup', {layout: 'index'});
});


// sends the request through our local signup strategy, and if successful takes user to homepage, 
// otherwise returns then to signin page
app.post('/local-reg', passport.authenticate('local-signup', {
  successRedirect: '/',
  // failureRedirect: '/signup'
  failureRedirect: '/signup',
  })
);

// sends the request through our local login/signin strategy, and 
// if successful takes user to homepage, otherwise returns then to signin page
app.post('/login', passport.authenticate('local-signin', { 
  successRedirect: '/',
  // failureRedirect: '/login'
    failureRedirect: '/login',
  })
);

//logs user out of site, deleting them from the session, and returns to homepage
app.get('/logout', function(req, res){
  var name = req.user.username;
  console.log("LOGGING OUT " + req.user.username);
  req.logout();
  res.redirect('/');
  req.session.notice = "You have successfully been logged out " + name + "!";
});

// Allows user to check in to the site
app.post('/checkin', checkin.checkin);
app.get('/search', friend.search);

//============END PASSPORT=================

// Example route
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
