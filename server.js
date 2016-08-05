'use strict';

require('dotenv').config();
const fs = require('fs');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const compression = require('compression');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "http://localhost:3000/login/google/return"
  },
  function(accessToken, refreshToken, profile, cb) {
    // In this example, the user's Google profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, profile);
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

const app = express();
const port = process.env.PORT || 3000;



if (process.env.ENV === "DEVELOPMENT") {
  const logger = require("./logger");
  fs.existsSync("logs") || fs.mkdirSync("logs");
  const accessLogStream = fs.createWriteStream(__dirname + '/logs/access.log', {flags: 'a'});
  logger.debug("Overriding 'Express' logger");
  app.use(morgan('combined', { "stream": logger.stream }));
}

function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    return false
  }
  return compression.filter(req, res)
};

app.use(require('cookie-parser')());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require('express-session')({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(compression({filter: shouldCompress}));
app.use(express.static(__dirname + '/client', {
  maxage: '48h'
}))
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res){
  res.json({data: req} || {"status": "test"})
})

app.get('/test', function(req, res) {
  res.json([
    {
      name: 'pocok',
      task: 'backend guru'
    },
    {
      name: 'petya',
      task: 'dataminer'
    },
    {
      name: 'peet',
      task: 'visual wizard'
    }
  ]);
});

app.get('/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/login/google/return',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

app.listen(port);
console.log("listening on " + port + "!");
