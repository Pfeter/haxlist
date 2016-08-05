

var exports = module.exports = (function() {
  var fs = require('fs');
  var obj;

  return {
    katas : fs.readFile('./datas/katas', 'utf8', function (err, data) {
      if (err) {
        throw err;
        return;
      }

      obj = JSON.parse(data);
    });
  }

})();
