'use strict';

require('dotenv').config();
const fs = require('fs');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const compression = require('compression');
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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression({filter: shouldCompress}));
app.use(express.static(__dirname + '/client', {
  maxage: '48h'
}))


app.get('/test', function(req, res) {
  res.json([
    {
      hacker: 'pocok',
      task: 'backend guru'
    },
    {
      hacker: 'petya',
      task: 'dataminer'
    },
    {
      hacker: 'peet',
      task: 'visual wizard'
    }
  ]);
});
app.get('/err', function(req, res, next) {
  next();
})

app.listen(port);
console.log("listening on " + port + "!");
