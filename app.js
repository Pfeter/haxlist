'use strict';

require('dotenv').config();
const fs = require('fs');
const express = require('express');
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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression({filter: shouldCompress}));
app.get('/', function(req, res) {
  res.json({"status": "ok",
            "name": "test",
            "port": port,
            "message": "Hy! I'm running and want to send moore data."})
});


app.listen(port);
console.log("listening on " + port + "!");
