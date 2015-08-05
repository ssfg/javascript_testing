// .js
// ======

var fs = require('fs');

var colah_tools = require('./colah_tools');
// console.log(typeof tools.foo); // => 'function'
// console.log(typeof tools.bar); // => 'function'
// console.log(typeof tools.zemba); // => undefined

function log(data) {
  console.log(data);
}

function save(data) {
  
  fs.writeFile("test.json", data, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
  });
}

var data = colah_tools.convertData(log);

// tools.bar();
// tools.zemba();