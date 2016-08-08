'use strict';

var config = require('../CONFIG');
var katas = require('./katas.json');

const mysql = require('mysql');
const connection = mysql.createConnection(config.sqlEntry);

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

function getQuery(newQuery, table, callback) {
  const fullQuery = mysql.format(newQuery, table);
  connection.query(fullQuery, function(err, result) {
    if (err) {
      return console.log(err.toString());
    }
    callback(result);
  });
}

function addKata(newKata, callback) {
  const newQuery = 'INSERT INTO katas (codewars_id, name, kyu, link) VALUES (?, ?, ?, ?);';
  const table = [newKata.codewars_id, newKata.name, newKata.kyu, newKata.link];
  getQuery(newQuery, table, callback);
}

function filterKata(filterId, callback) {
  const newQuery = 'SELECT * FROM katas WHERE katas.codewars_id LIKE (?);';
  const table = [filterId];
  getQuery(newQuery, table, callback);
}

var callback = function() {
  console.log({ 'status': 'ok' });
};

// var inputKata = {
//   codewars_id: '568f058bb74d73512500003f',
//   name: 'Big integers sum',
//   kyu: '6 kyu',
//   link: '/kata/big-integers-sum'
// };

// addKata(inputKata, callback);

for (var i = 0; i < katas.length; i++) {
  var inputKata = {
    codewars_id: katas[i].datas.kataid,
    name: katas[i].datas.kataname,
    kyu: katas[i].datas.kyu,
    link: katas[i].datas.katalink
  };
  filterKata(inputKata.codewars_id, callback);
  addKata(inputKata, callback);
}
