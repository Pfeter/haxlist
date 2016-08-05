'use strict';

require('dotenv').config();
const fs = require('fs');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const compression = require('compression');
const passport = require('passport');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const loginCheck = require('connect-ensure-login');
const database = JSON.parse(fs.readFileSync('datas/katas.json', 'utf8'));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "http://localhost:3000/login/google/return"
  },
  function(request, accessToken, refreshToken, profile, cb) {
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
app.use(session({
  store: new RedisStore({
    url: process.env.REDIS_URL
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))
app.use(compression({filter: shouldCompress}));
app.use(express.static(__dirname + '/client', {
  maxage: '48h'
}))
app.use(passport.initialize());
app.use(passport.session());

app.get('/',
  loginCheck.ensureLoggedIn('/login/google'),
  function(req, res){
  res.json({data: req.user} || {"status": "test"})
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

app.get('/katas', function(req, res) {
  res.json(database.slice(0, 10));
})

app.get('/login/google',
  passport.authenticate('google', { scope:
  	[ 'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read' ] })
);

app.get('/login/google/return',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/profile');
  });

app.get('/profile',
  loginCheck.ensureLoggedIn('/login/google'),
  function(req, res){
    console.log(req.user);
    res.json({status: "logged in",
              display_name: req.user.displayName,
              email: req.user.emails[0].value,
              gender: req.user.gender});
    return;
  });

app.get('/logout',
  loginCheck.ensureLoggedIn('/login/google'),
  function(req, res){
    req.session.destroy(function (err) {
     res.status(200).redirect('/landing');
   });
  });

app.listen(port);
console.log("listening on " + port + "!");
